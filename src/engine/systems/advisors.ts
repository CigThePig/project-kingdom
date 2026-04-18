// Phase 8 — Council & Advisor pure engine system.
//
// All functions are pure: they take state + inputs and return new state or
// plain descriptors. Mutation lives exclusively at the reducer boundary.

import {
  type AdvisorFlaw,
  type AdvisorModifier,
  type CouncilAdvisor,
  CouncilSeat,
  type CouncilState,
  type EventCategory,
  type GameState,
  type MechanicalEffectDelta,
  PopulationClass,
} from '../types';
import type { CardTag } from '../cards/types';
import { generateRulerName, seededRandom } from '../../data/text/name-generation';
import {
  CANDIDATE_TEMPLATES,
  type CandidateTemplate,
} from '../../data/advisors/candidates-wave-2';
import { PERSONALITY_MODIFIER_TEMPLATES } from '../../data/advisors/personalities';
import {
  FLAW_DEFINITIONS,
} from '../../data/advisors/flaws';
import {
  advisorModifierMatches,
  applyDeltaBonus,
} from '../../data/advisors/effects';

const PATRON_SAT_FIELD: Record<PopulationClass, keyof MechanicalEffectDelta> = {
  [PopulationClass.Nobility]: 'nobilitySatDelta',
  [PopulationClass.Clergy]: 'clergySatDelta',
  [PopulationClass.Merchants]: 'merchantSatDelta',
  [PopulationClass.Commoners]: 'commonerSatDelta',
  [PopulationClass.MilitaryCaste]: 'militaryCasteSatDelta',
};

// ------------------------------------------------------------
// Construction
// ------------------------------------------------------------

export function createCouncilState(): CouncilState {
  return { appointments: {}, pendingCandidates: [] };
}

export function instantiateCandidate(
  template: CandidateTemplate,
  runSeed: string,
  turnAppointed: number,
  culture = 'anglo-saxon',
): CouncilAdvisor {
  const nameSeed = `${runSeed}_advisor_${template.id}`;
  const ruler = generateRulerName(nameSeed, culture);
  const rng = seededRandom(`${nameSeed}_flaws`);

  const flaws: AdvisorFlaw[] = template.flawIds.map((flawId) => {
    const def = FLAW_DEFINITIONS[flawId];
    if (!def) throw new Error(`Unknown flaw id: ${flawId}`);
    // 70% of flaws start hidden; detection chance 4-8% per turn.
    const hidden = rng() < 0.7;
    const detectionChancePerTurn = 0.04 + rng() * 0.04;
    return { id: flawId, hidden, detectionChancePerTurn, revealedTurn: null };
  });

  return {
    id: `advisor_${runSeed}_${template.id}`,
    name: ruler.fullName,
    seat: template.seat,
    personality: template.personality,
    modifiers: PERSONALITY_MODIFIER_TEMPLATES[template.personality].map((m) => ({
      ...m,
      scope: { ...m.scope },
      effect: { ...m.effect },
    })),
    flaws,
    loyalty: 60,
    yearsServing: 0,
    turnAppointed,
    background: template.background,
    patronClass: template.patronClass,
  };
}

export function instantiateCandidateById(
  templateId: string,
  runSeed: string,
  turnAppointed: number,
): CouncilAdvisor | null {
  const template = CANDIDATE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;
  return instantiateCandidate(template, runSeed, turnAppointed);
}

// ------------------------------------------------------------
// Appointment / dismissal
// ------------------------------------------------------------

export function appointAdvisor(council: CouncilState, advisor: CouncilAdvisor): CouncilState {
  return {
    ...council,
    appointments: { ...council.appointments, [advisor.seat]: advisor },
    pendingCandidates: council.pendingCandidates.filter((c) => c.id !== advisor.id),
  };
}

export interface DismissalResult {
  council: CouncilState;
  penalty: MechanicalEffectDelta;
}

export function dismissAdvisor(council: CouncilState, seat: CouncilSeat): DismissalResult {
  const current = council.appointments[seat];
  if (!current) return { council, penalty: {} };
  const satField = PATRON_SAT_FIELD[current.patronClass];
  const penalty: MechanicalEffectDelta = { [satField]: -6 } as MechanicalEffectDelta;
  const nextAppointments = { ...council.appointments };
  delete nextAppointments[seat];
  return {
    council: { ...council, appointments: nextAppointments },
    penalty,
  };
}

// ------------------------------------------------------------
// Per-turn ticks
// ------------------------------------------------------------

export function tickAdvisorLoyalty(
  advisor: CouncilAdvisor,
  state: GameState,
): CouncilAdvisor {
  // Loyalty drifts up slightly when kingdom stability is high, down when low.
  const stab = state.stability?.value ?? 50;
  const drift = stab >= 60 ? 1 : stab <= 35 ? -1 : 0;
  const next = clamp(advisor.loyalty + drift, 0, 100);
  return { ...advisor, loyalty: next };
}

export function tickFlawDetection(
  advisor: CouncilAdvisor,
  turn: number,
  rng: () => number,
): { advisor: CouncilAdvisor; revealed: AdvisorFlaw[] } {
  const revealed: AdvisorFlaw[] = [];
  const nextFlaws = advisor.flaws.map((flaw) => {
    if (!flaw.hidden) return flaw;
    if (rng() < flaw.detectionChancePerTurn) {
      const revealedFlaw: AdvisorFlaw = { ...flaw, hidden: false, revealedTurn: turn };
      revealed.push(revealedFlaw);
      return revealedFlaw;
    }
    return flaw;
  });
  return { advisor: { ...advisor, flaws: nextFlaws }, revealed };
}

// ------------------------------------------------------------
// Aggregation — called from card-resolution and turn-resolution
// ------------------------------------------------------------

export interface ModifierMatchArgs {
  target: AdvisorModifier['target'];
  tags?: CardTag[];
  category?: EventCategory;
}

export function collectAdvisorDeltaBonuses(
  council: CouncilState | undefined,
  args: ModifierMatchArgs,
): MechanicalEffectDelta {
  if (!council) return {};
  let delta: MechanicalEffectDelta = {};
  for (const seat of Object.keys(council.appointments) as CouncilSeat[]) {
    const advisor = council.appointments[seat];
    if (!advisor) continue;
    for (const mod of advisor.modifiers) {
      if (mod.effect.kind !== 'delta_bonus') continue;
      if (!advisorModifierMatches(mod, args)) continue;
      delta = applyDeltaBonus(delta, mod);
    }
  }
  return delta;
}

export function collectSlotDiscounts(
  council: CouncilState | undefined,
  args: ModifierMatchArgs,
): number {
  if (!council) return 0;
  let total = 0;
  for (const seat of Object.keys(council.appointments) as CouncilSeat[]) {
    const advisor = council.appointments[seat];
    if (!advisor) continue;
    for (const mod of advisor.modifiers) {
      if (mod.effect.kind !== 'slot_cost_discount') continue;
      if (!advisorModifierMatches(mod, args)) continue;
      total += mod.effect.value;
    }
  }
  return total;
}

export function collectOutcomeQualityBoost(
  council: CouncilState | undefined,
  args: ModifierMatchArgs,
): number {
  if (!council) return 0;
  let total = 0;
  for (const seat of Object.keys(council.appointments) as CouncilSeat[]) {
    const advisor = council.appointments[seat];
    if (!advisor) continue;
    for (const mod of advisor.modifiers) {
      if (mod.effect.kind !== 'outcome_quality_boost') continue;
      if (!advisorModifierMatches(mod, args)) continue;
      total += mod.effect.value;
    }
  }
  return total;
}

// ------------------------------------------------------------
// Per-turn flaw effects
// ------------------------------------------------------------

export function aggregatePerTurnFlawDelta(
  council: CouncilState | undefined,
  state: GameState,
): MechanicalEffectDelta {
  if (!council) return {};
  const out: MechanicalEffectDelta = {};
  for (const seat of Object.keys(council.appointments) as CouncilSeat[]) {
    const advisor = council.appointments[seat];
    if (!advisor) continue;
    for (const flaw of advisor.flaws) {
      const def = FLAW_DEFINITIONS[flaw.id];
      if (!def) continue;
      mergeDelta(out, def.perTurnDelta(state));
    }
  }
  return out;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function mergeDelta(dest: MechanicalEffectDelta, src: MechanicalEffectDelta): void {
  for (const key of Object.keys(src) as (keyof MechanicalEffectDelta)[]) {
    if (key === 'diplomacyDeltas') {
      const existing = dest.diplomacyDeltas ?? {};
      const incoming = src.diplomacyDeltas ?? {};
      for (const nid of Object.keys(incoming)) {
        existing[nid] = (existing[nid] ?? 0) + incoming[nid];
      }
      dest.diplomacyDeltas = existing;
      continue;
    }
    const existing = (dest as unknown as Record<string, number | undefined>)[key] ?? 0;
    const incoming = (src as unknown as Record<string, number | undefined>)[key] ?? 0;
    (dest as unknown as Record<string, number>)[key] = existing + incoming;
  }
}
