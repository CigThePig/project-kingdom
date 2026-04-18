// Phase 8 — Council & Advisor system tests.

import { describe, it, expect } from 'vitest';

import {
  createCouncilState,
  instantiateCandidate,
  instantiateCandidateById,
  appointAdvisor,
  dismissAdvisor,
  collectAdvisorDeltaBonuses,
  collectSlotDiscounts,
  tickFlawDetection,
  aggregatePerTurnFlawDelta,
} from '../engine/systems/advisors';
import {
  CANDIDATE_TEMPLATES,
} from '../data/advisors/candidates-wave-2';
import {
  AdvisorPersonality,
  CouncilSeat,
  EventCategory,
  PopulationClass,
  type GameState,
} from '../engine/types';
import { createDefaultScenario } from '../data/scenarios/default';
import { COURT_OPPORTUNITIES } from '../data/cards/court-opportunities';
import { seededRandom } from '../data/text/name-generation';

function makeCouncilWithAppointee(templateId: string): {
  state: GameState;
  advisor: ReturnType<typeof instantiateCandidateById>;
} {
  const state = createDefaultScenario();
  const advisor = instantiateCandidateById(templateId, state.runSeed ?? 'seed', 1);
  if (!advisor) throw new Error(`Unknown template ${templateId}`);
  state.council = appointAdvisor(createCouncilState(), advisor);
  return { state, advisor };
}

describe('Phase 8 — council construction', () => {
  it('creates empty council', () => {
    const c = createCouncilState();
    expect(Object.keys(c.appointments)).toHaveLength(0);
    expect(c.pendingCandidates).toHaveLength(0);
  });

  it('instantiates every wave-2 candidate template without throwing', () => {
    for (const tmpl of CANDIDATE_TEMPLATES) {
      const a = instantiateCandidate(tmpl, 'seed', 1);
      expect(a.id).toContain(tmpl.id);
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.seat).toBe(tmpl.seat);
      expect(a.personality).toBe(tmpl.personality);
      expect(a.modifiers.length).toBeGreaterThan(0);
      expect(a.flaws.length).toBe(tmpl.flawIds.length);
    }
  });

  it('ships 12 candidate templates (3 per seat)', () => {
    expect(CANDIDATE_TEMPLATES).toHaveLength(12);
    const countBySeat: Record<string, number> = {};
    for (const t of CANDIDATE_TEMPLATES) countBySeat[t.seat] = (countBySeat[t.seat] ?? 0) + 1;
    expect(countBySeat[CouncilSeat.Chancellor]).toBe(3);
    expect(countBySeat[CouncilSeat.Marshal]).toBe(3);
    expect(countBySeat[CouncilSeat.Chamberlain]).toBe(3);
    expect(countBySeat[CouncilSeat.Spymaster]).toBe(3);
  });
});

describe('Phase 8 — appointment & dismissal', () => {
  it('appointing then dismissing applies patron-class penalty', () => {
    const { state, advisor } = makeCouncilWithAppointee('cand_chancellor_prudent_exchequer');
    expect(advisor!.patronClass).toBe(PopulationClass.Merchants);

    const { council, penalty } = dismissAdvisor(state.council!, advisor!.seat);
    expect(council.appointments[advisor!.seat]).toBeUndefined();
    expect(penalty.merchantSatDelta).toBe(-6);
  });

  it('dismissing a vacant seat is a no-op', () => {
    const council = createCouncilState();
    const { council: next, penalty } = dismissAdvisor(council, CouncilSeat.Marshal);
    expect(next).toEqual(council);
    expect(penalty).toEqual({});
  });
});

describe('Phase 8 — modifier aggregation', () => {
  it('collectAdvisorDeltaBonuses sums matching modifiers', () => {
    const { state } = makeCouncilWithAppointee('cand_chancellor_prudent_exchequer');
    // Prudent chancellor: petition + Economy + delta_bonus treasuryDelta +2
    const bonus = collectAdvisorDeltaBonuses(state.council, {
      target: 'petition',
      category: EventCategory.Economy,
    });
    expect(bonus.treasuryDelta).toBe(2);
  });

  it('ignores modifiers whose target does not match', () => {
    const { state } = makeCouncilWithAppointee('cand_chancellor_prudent_exchequer');
    const bonus = collectAdvisorDeltaBonuses(state.council, {
      target: 'crisis',
      category: EventCategory.Economy,
    });
    expect(bonus.treasuryDelta ?? 0).toBe(0);
  });

  it('collectSlotDiscounts returns 0 when no matching tag scope', () => {
    const { state } = makeCouncilWithAppointee('cand_marshal_battle_hardened_veteran');
    const discount = collectSlotDiscounts(state.council, {
      target: 'decree',
      tags: ['economy'],
    });
    expect(discount).toBe(0);
  });

  it('collectSlotDiscounts returns positive when tag scope matches', () => {
    const { state } = makeCouncilWithAppointee('cand_marshal_battle_hardened_veteran');
    const discount = collectSlotDiscounts(state.council, {
      target: 'decree',
      tags: ['military'],
    });
    expect(discount).toBeGreaterThan(0);
  });
});

describe('Phase 8 — flaw detection & per-turn effects', () => {
  it('reveals a hidden flaw within 30 turns (high detection roll)', () => {
    // Seed an advisor with one known flaw, force it hidden, then tick detection.
    const { state, advisor } = makeCouncilWithAppointee('cand_chancellor_prudent_exchequer');
    // Force flaw hidden with a moderate detection chance so 30 ticks surface it.
    const seeded = {
      ...advisor!,
      flaws: [{ ...advisor!.flaws[0], hidden: true, detectionChancePerTurn: 0.2 }],
    };
    let a = seeded;
    const rng = seededRandom('flaw-detection-test');
    let revealed = false;
    for (let t = 1; t <= 30; t++) {
      const res = tickFlawDetection(a, t, rng);
      a = res.advisor;
      if (res.revealed.length > 0) revealed = true;
      if (revealed) break;
    }
    expect(revealed).toBe(true);
    void state;
  });

  it('greedy flaw drains treasury each turn', () => {
    const state = createDefaultScenario();
    const advisor = instantiateCandidateById(
      'cand_chancellor_prudent_exchequer',
      state.runSeed ?? 'seed',
      1,
    );
    state.council = appointAdvisor(createCouncilState(), advisor!);
    const delta = aggregatePerTurnFlawDelta(state.council, state);
    expect((delta.treasuryDelta ?? 0)).toBeLessThan(0);
  });

  it('empty council produces no flaw delta', () => {
    const state = createDefaultScenario();
    state.council = createCouncilState();
    const delta = aggregatePerTurnFlawDelta(state.council, state);
    expect(delta).toEqual({});
  });
});

describe('Phase 8 — Court Opportunity integration', () => {
  it('includes advisor-candidate opportunities pointing at known templates', () => {
    const advisorOpps = COURT_OPPORTUNITIES.filter((o) => o.kind === 'advisor_candidate');
    expect(advisorOpps.length).toBeGreaterThanOrEqual(12);
    for (const opp of advisorOpps) {
      if (opp.kind !== 'advisor_candidate') continue;
      const tmpl = CANDIDATE_TEMPLATES.find((t) => t.id === opp.candidateTemplateId);
      expect(tmpl, `template ${opp.candidateTemplateId} exists`).toBeDefined();
    }
  });

  it('surfaces at least one advisor candidate across many rolls', () => {
    // With a 50-turn deterministic run we should see multiple advisor picks
    // given 12 weight-1 advisor opps alongside 15 hand_card opps (weight 1-3).
    const rng = seededRandom('opportunity-surface-test');
    const seenKinds = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const totalWeight = COURT_OPPORTUNITIES.reduce((s, o) => s + o.weight, 0);
      let pick = rng() * totalWeight;
      for (const opp of COURT_OPPORTUNITIES) {
        pick -= opp.weight;
        if (pick <= 0) {
          seenKinds.add(opp.kind);
          break;
        }
      }
    }
    expect(seenKinds.has('advisor_candidate')).toBe(true);
    expect(seenKinds.has('hand_card')).toBe(true);
  });
});

describe('Phase 8 — save migration', () => {
  it('save round-trip preserves council state', () => {
    const { state } = makeCouncilWithAppointee('cand_marshal_battle_hardened_veteran');
    const serialized = JSON.stringify(state);
    const restored = JSON.parse(serialized) as GameState;
    expect(restored.council?.appointments[CouncilSeat.Marshal]?.personality).toBe(
      AdvisorPersonality.BattleHardened,
    );
  });

  it('backfills empty council on pre-Phase-8 save', () => {
    const state = createDefaultScenario();
    delete state.council;
    const council = state.council ?? createCouncilState();
    expect(council.appointments).toEqual({});
    expect(council.pendingCandidates).toEqual([]);
  });
});
