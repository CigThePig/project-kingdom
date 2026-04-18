// Phase 5 — Hand-card registry.
//
// Hand cards are banked `Card` envelopes that the player chooses to play on
// any turn while they hold a slot. Each definition owns its `apply` function,
// which returns a new `GameState` when the card resolves. Effects that map
// cleanly onto `MechanicalEffectDelta` route through `applyMechanicalEffectDelta`;
// others (pardon, construction, pressure trim) mutate targeted slices directly.
//
// Keep every `apply` short — anything that needs a new engine system moves to
// a later phase.

import type {
  Card,
  CardOfFamily,
  InitiativePayload,
} from '../../engine/cards/types';
import {
  PopulationClass,
  type GameState,
  type TemporaryModifier,
} from '../../engine/types';
import { applyMechanicalEffectDelta } from '../../engine/events/apply-event-effects';
import {
  HAND_CARDS_EXPANDED,
  HAND_CARD_COMBO_KEYS_EXPANDED,
  type HandCardIdExpanded,
} from './hand-cards-expanded';

// ============================================================
// Public types
// ============================================================

export type HandCardIdBase =
  | 'hand_royal_pardon'
  | 'hand_reserve_forces'
  | 'hand_master_builder'
  | 'hand_spymasters_whisper'
  | 'hand_court_favor'
  | 'hand_quiet_word'
  | 'hand_old_debt_called_in'
  | 'hand_forced_levy'
  | 'hand_grain_reserve'
  | 'hand_tithe_forgiven'
  | 'hand_festival_proclaimed'
  | 'hand_disciplined_march'
  | 'hand_diplomatic_courier'
  | 'hand_merchant_guild_favor'
  | 'hand_bookkeepers_audit'
  | 'hand_patient_sovereign'
  | 'hand_scholars_insight'
  | 'hand_border_patrol'
  | 'hand_sanctioned_raid'
  | 'hand_royal_announcement';

export type HandCardId = HandCardIdBase | HandCardIdExpanded;

export type HandCardChoiceKind = 'none' | 'class' | 'rival';

export type HandCardChoice =
  | { kind: 'none' }
  | { kind: 'class'; class: PopulationClass }
  | { kind: 'rival'; neighborId: string };

export interface HandCardDefinition {
  id: HandCardId;
  title: string;
  body: string;
  expiresAfterTurns: number;
  requiresChoice?: 'class' | 'rival';
  apply: (state: GameState, choice: HandCardChoice) => GameState;
}

// ============================================================
// Internal helpers
// ============================================================

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function pickRivalId(state: GameState, choice: HandCardChoice): string | null {
  if (choice.kind === 'rival') return choice.neighborId;
  return state.diplomacy.neighbors[0]?.id ?? null;
}

function bumpRelationship(state: GameState, neighborId: string, delta: number): GameState {
  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      neighbors: state.diplomacy.neighbors.map((n) =>
        n.id === neighborId
          ? { ...n, relationshipScore: clamp(n.relationshipScore + delta, 0, 100) }
          : n,
      ),
    },
  };
}

function queueTemporaryModifier(
  state: GameState,
  mod: TemporaryModifier,
): GameState {
  return {
    ...state,
    activeTemporaryModifiers: [...state.activeTemporaryModifiers, mod],
  };
}

// ============================================================
// Registry
// ============================================================

const BASE_HAND_CARDS: Record<HandCardIdBase, HandCardDefinition> = {
  hand_royal_pardon: {
    id: 'hand_royal_pardon',
    title: 'Royal Pardon',
    body: 'Dismiss one lingering grievance from a past decision. The court moves on.',
    expiresAfterTurns: 12,
    apply: (state) => {
      if (state.persistentConsequences.length === 0) return state;
      const [, ...rest] = state.persistentConsequences;
      return { ...state, persistentConsequences: rest };
    },
  },

  hand_reserve_forces: {
    id: 'hand_reserve_forces',
    title: 'Reserve Forces',
    body: 'Hidden garrisons muster on command. Readiness climbs.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(state, { militaryReadinessDelta: 20 }, null),
  },

  hand_master_builder: {
    id: 'hand_master_builder',
    title: 'Master Builder',
    body: 'A veteran architect accelerates the nearest project by one month.',
    expiresAfterTurns: 10,
    apply: (state) => {
      if (state.constructionProjects.length === 0) return state;
      let shortened = false;
      const updated = state.constructionProjects.map((p) => {
        if (shortened) return p;
        shortened = true;
        return { ...p, turnsRemaining: Math.max(0, p.turnsRemaining - 1) };
      });
      return { ...state, constructionProjects: updated };
    },
  },

  hand_spymasters_whisper: {
    id: 'hand_spymasters_whisper',
    title: "Spymaster's Whisper",
    body: 'A private courier lifts a veil. Warmer relations follow — a debt of trust.',
    expiresAfterTurns: 9,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const id = pickRivalId(state, choice);
      if (!id) return state;
      return bumpRelationship(state, id, 3);
    },
  },

  hand_court_favor: {
    id: 'hand_court_favor',
    title: 'Court Favor',
    body: 'A public gesture buys goodwill with one class for a month.',
    expiresAfterTurns: 10,
    requiresChoice: 'class',
    apply: (state, choice) => {
      if (choice.kind !== 'class') return state;
      const delta = classSatDeltaFor(choice.class, 10);
      return applyMechanicalEffectDelta(state, delta, null);
    },
  },

  hand_quiet_word: {
    id: 'hand_quiet_word',
    title: 'Quiet Word',
    body: 'A whispered instruction sharpens administrators. Stability edges up next turn.',
    expiresAfterTurns: 9,
    apply: (state) =>
      queueTemporaryModifier(state, {
        id: `hand_quiet_word_${state.turn.turnNumber}`,
        sourceTag: 'hand:quiet_word',
        turnsRemaining: 1,
        turnApplied: state.turn.turnNumber,
        effectPerTurn: { stabilityDelta: 1 },
      }),
  },

  hand_old_debt_called_in: {
    id: 'hand_old_debt_called_in',
    title: 'Old Debt Called In',
    body: 'An overseas loan is repaid in full — but a rival court notices.',
    expiresAfterTurns: 11,
    apply: (state, choice) => {
      const withGold = applyMechanicalEffectDelta(state, { treasuryDelta: 50 }, null);
      const id = pickRivalId(withGold, choice);
      if (!id) return withGold;
      return bumpRelationship(withGold, id, -5);
    },
  },

  hand_forced_levy: {
    id: 'hand_forced_levy',
    title: 'Forced Levy',
    body: 'Conscript farmers into a pike block. The field swells; the villages mutter.',
    expiresAfterTurns: 8,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryForceSizeDelta: 200, commonerSatDelta: -5 },
        null,
      ),
  },

  hand_grain_reserve: {
    id: 'hand_grain_reserve',
    title: 'Grain Reserve',
    body: 'Untouched stores from last harvest are released to the granaries.',
    expiresAfterTurns: 11,
    apply: (state) =>
      applyMechanicalEffectDelta(state, { foodDelta: 300 }, null),
  },

  hand_tithe_forgiven: {
    id: 'hand_tithe_forgiven',
    title: 'Tithe Forgiven',
    body: "A season's church contribution is waived. The altars beam; the treasury groans.",
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: -30, clergySatDelta: 8 },
        null,
      ),
  },

  hand_festival_proclaimed: {
    id: 'hand_festival_proclaimed',
    title: 'Festival Proclaimed',
    body: 'A holy day dampens every grievance for a single turn.',
    expiresAfterTurns: 10,
    apply: (state) =>
      queueTemporaryModifier(state, {
        id: `hand_festival_${state.turn.turnNumber}`,
        sourceTag: 'hand:festival_proclaimed',
        turnsRemaining: 1,
        turnApplied: state.turn.turnNumber,
        effectPerTurn: {
          nobilitySatDelta: 5,
          clergySatDelta: 5,
          merchantSatDelta: 5,
          commonerSatDelta: 5,
          militaryCasteSatDelta: 5,
        },
      }),
  },

  hand_disciplined_march: {
    id: 'hand_disciplined_march',
    title: 'Disciplined March',
    body: 'An extended drill stiffens the line. Readiness rises; morale holds.',
    expiresAfterTurns: 9,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryReadinessDelta: 10, militaryMoraleDelta: 5 },
        null,
      ),
  },

  hand_diplomatic_courier: {
    id: 'hand_diplomatic_courier',
    title: 'Diplomatic Courier',
    body: 'A trusted envoy smooths a recent slight abroad.',
    expiresAfterTurns: 10,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const id = pickRivalId(state, choice);
      if (!id) return state;
      return bumpRelationship(state, id, 5);
    },
  },

  hand_merchant_guild_favor: {
    id: 'hand_merchant_guild_favor',
    title: 'Merchant Guild Favor',
    body: 'Guild masters pay forward a trade monopoly. Coin flows; merchants smile.',
    expiresAfterTurns: 11,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: 40, merchantSatDelta: 5 },
        null,
      ),
  },

  hand_bookkeepers_audit: {
    id: 'hand_bookkeepers_audit',
    title: "Bookkeeper's Audit",
    body: 'A sharp-eyed clerk recovers lost tax revenue.',
    expiresAfterTurns: 12,
    apply: (state) =>
      applyMechanicalEffectDelta(state, { treasuryDelta: 25 }, null),
  },

  hand_patient_sovereign: {
    id: 'hand_patient_sovereign',
    title: 'Patient Sovereign',
    body: 'The crown declines to act this month. Stability notches up next turn.',
    expiresAfterTurns: 12,
    apply: (state) =>
      queueTemporaryModifier(state, {
        id: `hand_patient_${state.turn.turnNumber}`,
        sourceTag: 'hand:patient_sovereign',
        turnsRemaining: 1,
        turnApplied: state.turn.turnNumber,
        effectPerTurn: { stabilityDelta: 1 },
      }),
  },

  hand_scholars_insight: {
    id: 'hand_scholars_insight',
    title: "Scholar's Insight",
    body: 'A visiting scholar breaks an old deadlock. Research on the active branch advances.',
    expiresAfterTurns: 10,
    apply: (state) => {
      const branch = state.policies.researchFocus;
      if (!branch) return state;
      const branchState = state.knowledge.branches[branch];
      if (!branchState) return state;
      return {
        ...state,
        knowledge: {
          ...state.knowledge,
          branches: {
            ...state.knowledge.branches,
            [branch]: {
              ...branchState,
              progressValue: branchState.progressValue + 15,
            },
          },
        },
      };
    },
  },

  hand_border_patrol: {
    id: 'hand_border_patrol',
    title: 'Border Patrol',
    body: 'An extra watch at the frontier discourages trouble. Readiness and morale nudge up.',
    expiresAfterTurns: 9,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryReadinessDelta: 5, militaryMoraleDelta: 3 },
        null,
      ),
  },

  hand_sanctioned_raid: {
    id: 'hand_sanctioned_raid',
    title: 'Sanctioned Raid',
    body: 'A border raid enriches the treasury. A neighbor will not forget.',
    expiresAfterTurns: 8,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const withGold = applyMechanicalEffectDelta(state, { treasuryDelta: 80 }, null);
      const id = pickRivalId(withGold, choice);
      if (!id) return withGold;
      return bumpRelationship(withGold, id, -10);
    },
  },

  hand_royal_announcement: {
    id: 'hand_royal_announcement',
    title: 'Royal Announcement',
    body: 'A carefully worded proclamation takes the edge off building pressure.',
    expiresAfterTurns: 11,
    apply: (state) => {
      const np = state.narrativePressure;
      const trim = (v: number) => (v > 0 ? Math.max(0, v - 5) : v);
      return {
        ...state,
        narrativePressure: {
          ...np,
          authority: trim(np.authority),
          piety: trim(np.piety),
          commerce: trim(np.commerce),
          militarism: trim(np.militarism),
          reform: trim(np.reform),
          intrigue: trim(np.intrigue),
          openness: trim(np.openness),
          isolation: trim(np.isolation),
        },
      };
    },
  },
};

export const HAND_CARDS: Record<HandCardId, HandCardDefinition> = {
  ...BASE_HAND_CARDS,
  ...HAND_CARDS_EXPANDED,
};

function classSatDeltaFor(cls: PopulationClass, amount: number) {
  switch (cls) {
    case PopulationClass.Nobility:
      return { nobilitySatDelta: amount };
    case PopulationClass.Clergy:
      return { clergySatDelta: amount };
    case PopulationClass.Merchants:
      return { merchantSatDelta: amount };
    case PopulationClass.Commoners:
      return { commonerSatDelta: amount };
    case PopulationClass.MilitaryCaste:
      return { militaryCasteSatDelta: amount };
  }
}

// ============================================================
// Card factory & play dispatch
// ============================================================

/** Phase 6 — combo key assignments per hand card. Keys are semantic tags
 *  (not card IDs); the registered combos in `src/data/cards/combos.ts` match
 *  against these strings. Unassigned cards contribute no keys and simply
 *  never participate in combos. */
const HAND_CARD_COMBO_KEYS: Readonly<Record<HandCardId, readonly string[]>> = {
  ...HAND_CARD_COMBO_KEYS_EXPANDED,
  hand_royal_pardon: ['royal_pardon'],
  hand_reserve_forces: ['reserve_forces'],
  hand_master_builder: ['wall_construction'],
  hand_spymasters_whisper: ['espionage_sweep'],
  hand_court_favor: ['court_favor'],
  hand_quiet_word: [],
  hand_old_debt_called_in: ['debt_called'],
  hand_forced_levy: ['mass_conscription'],
  hand_grain_reserve: ['famine_relief'],
  hand_tithe_forgiven: ['religious_gesture'],
  hand_festival_proclaimed: ['festival_decree'],
  hand_disciplined_march: ['military_drill'],
  hand_diplomatic_courier: ['diplomatic_overture'],
  hand_merchant_guild_favor: ['merchant_favor'],
  hand_bookkeepers_audit: ['scholarly_audit'],
  hand_patient_sovereign: ['sovereign_restraint'],
  hand_scholars_insight: ['scholarly_order'],
  hand_border_patrol: ['border_garrison'],
  hand_sanctioned_raid: [],
  hand_royal_announcement: ['royal_proclamation'],
};

/** Build the runtime `Card` envelope from a hand-card definition. These live
 *  in `CourtHandSlot.card`. Uses the `initiative` family so combo keys and
 *  codex tags remain open for Phase 6+. */
export function buildHandCard(id: HandCardId): CardOfFamily<'initiative'> {
  const def = HAND_CARDS[id];
  const payload: InitiativePayload = { placeholder: true };
  return {
    id: `hand:${def.id}`,
    family: 'initiative',
    title: def.title,
    body: def.body,
    slotCost: 0,
    effortCost: 'Light',
    rarity: 'Common',
    tags: ['kingdom'],
    prerequisites: [],
    effects: [],
    context: [],
    comboKeys: [...(HAND_CARD_COMBO_KEYS[id] ?? [])],
    hand: 'banked',
    expiresAfterTurns: def.expiresAfterTurns,
    payload,
  };
}

/** Look up the hand-card definition from a runtime `Card` envelope. Returns
 *  null if the card isn't one of ours. */
export function handCardDefinitionFromCard(card: Card): HandCardDefinition | null {
  if (card.family !== 'initiative') return null;
  const id = card.id.startsWith('hand:') ? (card.id.slice(5) as HandCardId) : null;
  if (!id) return null;
  return HAND_CARDS[id] ?? null;
}
