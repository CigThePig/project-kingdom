// Phase 7 — Wave-2 Hand Cards.
//
// Extends the base hand-card registry from 20 to 40 entries. Cards follow the
// same `HandCardDefinition` shape declared in `./hand-cards`; the union type
// `HandCardId` is widened to include `HandCardIdExpanded` over there.

import type {
  HandCardChoice,
  HandCardDefinition,
} from './hand-cards';
import type { GameState, TemporaryModifier } from '../../engine/types';
import { applyMechanicalEffectDelta } from '../../engine/events/apply-event-effects';

export type HandCardIdExpanded =
  | 'hand_emergency_levy'
  | 'hand_market_day_proclaimed'
  | 'hand_seize_contraband'
  | 'hand_treasury_inspection'
  | 'hand_call_to_arms'
  | 'hand_veterans_homecoming'
  | 'hand_iron_will'
  | 'hand_warlords_bargain'
  | 'hand_envoy_recalled'
  | 'hand_state_visit'
  | 'hand_secret_treaty'
  | 'hand_papal_blessing'
  | 'hand_relic_unveiled'
  | 'hand_anchorites_vigil'
  | 'hand_intercepted_dispatch'
  | 'hand_double_agent'
  | 'hand_pardon_political_prisoners'
  | 'hand_grand_assize'
  | 'hand_chronicler_summoned'
  | 'hand_open_court';

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function pickRivalId(state: GameState, choice: HandCardChoice): string | null {
  if (choice.kind === 'rival') return choice.neighborId;
  return state.diplomacy.neighbors[0]?.id ?? null;
}

function bumpRelationship(
  state: GameState,
  neighborId: string,
  delta: number,
): GameState {
  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      neighbors: state.diplomacy.neighbors.map((n) =>
        n.id === neighborId
          ? {
              ...n,
              relationshipScore: clamp(n.relationshipScore + delta, 0, 100),
            }
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

export const HAND_CARDS_EXPANDED: Record<HandCardIdExpanded, HandCardDefinition> = {
  hand_emergency_levy: {
    id: 'hand_emergency_levy',
    title: 'Emergency Levy',
    body: 'A snap tax fills the coffers — and rattles the realm.',
    expiresAfterTurns: 9,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: 30, stabilityDelta: -2 },
        null,
      ),
  },

  hand_market_day_proclaimed: {
    id: 'hand_market_day_proclaimed',
    title: 'Market Day Proclaimed',
    body: 'A royal market draws crowds and coin to the capital.',
    expiresAfterTurns: 11,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: 20, commonerSatDelta: 3, merchantSatDelta: 3 },
        null,
      ),
  },

  hand_seize_contraband: {
    id: 'hand_seize_contraband',
    title: 'Seize Contraband',
    body: 'Customs agents raid the warehouses. Gold for the crown; resentment in the guilds.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: 35, merchantSatDelta: -4 },
        null,
      ),
  },

  hand_treasury_inspection: {
    id: 'hand_treasury_inspection',
    title: 'Treasury Inspection',
    body: 'A surprise audit recovers misallocated funds. The nobility bristles at the scrutiny.',
    expiresAfterTurns: 12,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { treasuryDelta: 15, nobilitySatDelta: -3 },
        null,
      ),
  },

  hand_call_to_arms: {
    id: 'hand_call_to_arms',
    title: 'Call to Arms',
    body: 'Paid mobilisation swells the ranks without the resentment of conscription.',
    expiresAfterTurns: 9,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryForceSizeDelta: 150, treasuryDelta: -20 },
        null,
      ),
  },

  hand_veterans_homecoming: {
    id: 'hand_veterans_homecoming',
    title: "Veterans' Homecoming",
    body: 'Returning soldiers are honoured at court. The military caste stands taller.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryCasteSatDelta: 6, militaryMoraleDelta: 3 },
        null,
      ),
  },

  hand_iron_will: {
    id: 'hand_iron_will',
    title: 'Iron Will',
    body: 'A stirring address steadies the line for two months.',
    expiresAfterTurns: 9,
    apply: (state) =>
      queueTemporaryModifier(state, {
        id: `hand_iron_will_${state.turn.turnNumber}`,
        sourceTag: 'hand:iron_will',
        turnsRemaining: 2,
        turnApplied: state.turn.turnNumber,
        effectPerTurn: { militaryMoraleDelta: 2 },
      }),
  },

  hand_warlords_bargain: {
    id: 'hand_warlords_bargain',
    title: "Warlord's Bargain",
    body: 'A captain of mercenaries swears his sword. The clergy mutter about heathens in the ranks.',
    expiresAfterTurns: 8,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { militaryReadinessDelta: 15, faithDelta: -2 },
        null,
      ),
  },

  hand_envoy_recalled: {
    id: 'hand_envoy_recalled',
    title: 'Envoy Recalled',
    body: 'Withdrawing your ambassador is a public rebuke — and a show of resolve at home.',
    expiresAfterTurns: 9,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const id = pickRivalId(state, choice);
      const withStability = applyMechanicalEffectDelta(
        state,
        { stabilityDelta: 1 },
        null,
      );
      if (!id) return withStability;
      return bumpRelationship(withStability, id, -5);
    },
  },

  hand_state_visit: {
    id: 'hand_state_visit',
    title: 'State Visit',
    body: 'A formal visit to a foreign court — pomp, gifts, and warmer ties.',
    expiresAfterTurns: 11,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const withCost = applyMechanicalEffectDelta(
        state,
        { treasuryDelta: -25 },
        null,
      );
      const id = pickRivalId(withCost, choice);
      if (!id) return withCost;
      return bumpRelationship(withCost, id, 4);
    },
  },

  hand_secret_treaty: {
    id: 'hand_secret_treaty',
    title: 'Secret Treaty',
    body: 'A clandestine pact deepens trust abroad — but rumours leak.',
    expiresAfterTurns: 10,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const withHeterodoxy = applyMechanicalEffectDelta(
        state,
        { heterodoxyDelta: 1 },
        null,
      );
      const id = pickRivalId(withHeterodoxy, choice);
      if (!id) return withHeterodoxy;
      return bumpRelationship(withHeterodoxy, id, 6);
    },
  },

  hand_papal_blessing: {
    id: 'hand_papal_blessing',
    title: 'Papal Blessing',
    body: 'A high cleric blesses the realm. Faith and clergy alike rise.',
    expiresAfterTurns: 11,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { faithDelta: 5, clergySatDelta: 5 },
        null,
      ),
  },

  hand_relic_unveiled: {
    id: 'hand_relic_unveiled',
    title: 'Relic Unveiled',
    body: 'A holy relic is paraded through the streets to widespread veneration.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { clergySatDelta: 6, commonerSatDelta: 3, treasuryDelta: -15 },
        null,
      ),
  },

  hand_anchorites_vigil: {
    id: 'hand_anchorites_vigil',
    title: "Anchorites' Vigil",
    body: 'Cloistered prayer steadies the faith and quiets heretical murmurs.',
    expiresAfterTurns: 10,
    apply: (state) => {
      const trimmed = applyMechanicalEffectDelta(
        state,
        { heterodoxyDelta: -1 },
        null,
      );
      return queueTemporaryModifier(trimmed, {
        id: `hand_anchorites_${state.turn.turnNumber}`,
        sourceTag: 'hand:anchorites_vigil',
        turnsRemaining: 2,
        turnApplied: state.turn.turnNumber,
        effectPerTurn: { faithDelta: 1 },
      });
    },
  },

  hand_intercepted_dispatch: {
    id: 'hand_intercepted_dispatch',
    title: 'Intercepted Dispatch',
    body: 'A captured courier yields a sheaf of foreign correspondence.',
    expiresAfterTurns: 9,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { espionageNetworkDelta: 10 },
        null,
      ),
  },

  hand_double_agent: {
    id: 'hand_double_agent',
    title: 'Double Agent',
    body: 'A turned spy feeds you their masters\' secrets — at the price of trust.',
    expiresAfterTurns: 8,
    requiresChoice: 'rival',
    apply: (state, choice) => {
      const withSpy = applyMechanicalEffectDelta(
        state,
        { espionageNetworkDelta: 5 },
        null,
      );
      const id = pickRivalId(withSpy, choice);
      if (!id) return withSpy;
      return bumpRelationship(withSpy, id, -3);
    },
  },

  hand_pardon_political_prisoners: {
    id: 'hand_pardon_political_prisoners',
    title: 'Pardon Political Prisoners',
    body: 'Long-held dissidents walk free. The streets cheer; the lords grumble.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        {
          stabilityDelta: 2,
          commonerSatDelta: 4,
          nobilitySatDelta: -2,
        },
        null,
      ),
  },

  hand_grand_assize: {
    id: 'hand_grand_assize',
    title: 'Grand Assize',
    body: 'A travelling royal court hears grievances and binds the realm in common law.',
    expiresAfterTurns: 11,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        {
          stabilityDelta: 2,
          nobilitySatDelta: 3,
          treasuryDelta: -10,
        },
        null,
      ),
  },

  hand_chronicler_summoned: {
    id: 'hand_chronicler_summoned',
    title: 'Chronicler Summoned',
    body: "A learned scribe is set to compose the realm's history. The story of you tightens.",
    expiresAfterTurns: 12,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        { culturalCohesionDelta: 3, faithDelta: 1 },
        null,
      ),
  },

  hand_open_court: {
    id: 'hand_open_court',
    title: 'Open Court',
    body: 'The crown opens its doors to all petitioners for a day. Every class feels seen.',
    expiresAfterTurns: 10,
    apply: (state) =>
      applyMechanicalEffectDelta(
        state,
        {
          culturalCohesionDelta: 2,
          nobilitySatDelta: 2,
          clergySatDelta: 2,
          merchantSatDelta: 2,
          commonerSatDelta: 2,
          militaryCasteSatDelta: 2,
        },
        null,
      ),
  },
};

export const HAND_CARD_COMBO_KEYS_EXPANDED: Readonly<
  Record<HandCardIdExpanded, readonly string[]>
> = {
  hand_emergency_levy: ['debt_called'],
  hand_market_day_proclaimed: ['merchant_favor'],
  hand_seize_contraband: [],
  hand_treasury_inspection: ['scholarly_audit'],
  hand_call_to_arms: ['mass_conscription'],
  hand_veterans_homecoming: ['military_drill'],
  hand_iron_will: ['military_drill'],
  hand_warlords_bargain: ['reserve_forces'],
  hand_envoy_recalled: [],
  hand_state_visit: ['diplomatic_overture'],
  hand_secret_treaty: ['diplomatic_overture', 'espionage_sweep'],
  hand_papal_blessing: ['religious_gesture'],
  hand_relic_unveiled: ['religious_gesture', 'festival_decree'],
  hand_anchorites_vigil: ['religious_gesture'],
  hand_intercepted_dispatch: ['espionage_sweep'],
  hand_double_agent: ['espionage_sweep'],
  hand_pardon_political_prisoners: ['royal_pardon'],
  hand_grand_assize: ['royal_proclamation'],
  hand_chronicler_summoned: ['scholarly_order'],
  hand_open_court: ['court_favor', 'festival_decree'],
};

