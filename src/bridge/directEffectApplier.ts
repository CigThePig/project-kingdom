// Bridge Layer — Direct Effect Applier
// Applies assessment and negotiation effects directly to game state.
// These interactions don't go through the engine's event system (they aren't
// ActiveEvents in the pool). Their mechanical effects are applied before
// the standard turn resolution pipeline runs.

import { InteractionType } from '../engine/types';
import type { Bond, BondKind, GameState, MechanicalEffectDelta } from '../engine/types';
import { applyMechanicalEffectDelta } from '../engine/events/apply-event-effects';
import { ASSESSMENT_EFFECTS } from '../data/events/assessment-effects';
import { NEGOTIATION_EFFECTS } from '../data/events/negotiation-effects';
import type { MonthDecision } from '../ui/types';
import {
  createCulturalExchangeBond,
  createHostageBond,
  createMarriageBond,
  createMutualDefenseBond,
  createReligiousAccordBond,
  createTradeLeagueBond,
  createVassalageBond,
} from '../engine/systems/bonds';
import { TERM_ID_TO_BOND_KIND } from './negotiationBondMap';

/**
 * Resolves __NEIGHBOR__ placeholders in diplomacyDeltas.
 * Uses the provided neighborId if available (from card generation), otherwise
 * falls back to picking the first peaceful neighbor by relationship score.
 */
function resolveNeighborPlaceholders(
  delta: MechanicalEffectDelta,
  state: GameState,
  preResolvedNeighborId?: string,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;

  let neighborId = preResolvedNeighborId;
  if (!neighborId) {
    const neighbors = state.diplomacy.neighbors;
    const peaceful = neighbors
      .filter((n) => !n.isAtWarWithPlayer)
      .sort((a, b) => b.relationshipScore - a.relationshipScore);
    neighborId = peaceful[0]?.id ?? neighbors[0]?.id ?? 'unknown';
  }

  const resolved: Record<string, number> = {};
  for (const [key, value] of Object.entries(delta.diplomacyDeltas)) {
    resolved[key === '__NEIGHBOR__' ? neighborId : key] = value;
  }
  return { ...delta, diplomacyDeltas: resolved };
}

/**
 * Applies assessment and negotiation effects directly to game state.
 * Called from RoundController before the standard resolution pipeline.
 */
export function applyDirectEffects(
  state: GameState,
  decisions: MonthDecision[],
  negotiationId: string | null,
): GameState {
  let current = state;

  for (const d of decisions) {
    if (d.interactionType === InteractionType.Assessment) {
      // cardId format: "assessment:<definitionId>"
      // choiceId format: "assessment:<defId>:<bareChoiceId>"
      const assessId = d.cardId.replace('assessment:', '');
      const parts = d.choiceId.split(':');
      const bareChoiceId = parts[parts.length - 1];
      const rawDelta = ASSESSMENT_EFFECTS[assessId]?.[bareChoiceId];
      if (rawDelta) {
        const delta = resolveNeighborPlaceholders(rawDelta, current, d.targetNeighborId);
        current = applyMechanicalEffectDelta(current, delta, null);
      }
    }

    if (d.interactionType === InteractionType.Negotiation && negotiationId) {
      if (d.choiceId.startsWith('reject:')) {
        // Find the reject choice key in the negotiation effects
        const rejectKey = Object.keys(NEGOTIATION_EFFECTS[negotiationId] ?? {}).find(
          (k) => k.startsWith('reject'),
        );
        if (rejectKey) {
          const rawDelta = NEGOTIATION_EFFECTS[negotiationId][rejectKey];
          const delta = resolveNeighborPlaceholders(rawDelta, current, d.targetNeighborId);
          current = applyMechanicalEffectDelta(current, delta, null);
        }
      } else if (!d.choiceId.startsWith('accept:')) {
        // Term effect — choiceId is the bare termId
        const rawDelta = NEGOTIATION_EFFECTS[negotiationId]?.[d.choiceId];
        if (rawDelta) {
          const delta = resolveNeighborPlaceholders(rawDelta, current, d.targetNeighborId);
          current = applyMechanicalEffectDelta(current, delta, null);
        }
        // Phase 13 — if this term maps to a bond kind, materialize it.
        const bondKind = TERM_ID_TO_BOND_KIND[d.choiceId];
        if (bondKind) {
          current = appendBondForTerm(current, bondKind, d.choiceId, d.targetNeighborId);
        }
      }
    }
  }

  return current;
}

/** Creates the appropriate Bond for an accepted negotiation term and appends
 *  it to state.diplomacy.bonds. No-op if no viable neighbor can be resolved. */
function appendBondForTerm(
  state: GameState,
  kind: BondKind,
  termId: string,
  preResolvedNeighborId?: string,
): GameState {
  const neighborId = preResolvedNeighborId ?? pickFallbackNeighbor(state);
  if (!neighborId) return state;

  const turn = state.turn.turnNumber;
  const bond = buildBondForKind(kind, termId, [neighborId], turn);
  if (!bond) return state;

  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      bonds: [...(state.diplomacy.bonds ?? []), bond],
    },
  };
}

function pickFallbackNeighbor(state: GameState): string | undefined {
  const peaceful = state.diplomacy.neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return peaceful[0]?.id ?? state.diplomacy.neighbors[0]?.id;
}

function buildBondForKind(
  kind: BondKind,
  termId: string,
  participants: string[],
  turn: number,
): Bond | null {
  switch (kind) {
    case 'royal_marriage':
      return createMarriageBond({
        participants,
        turn,
        spouseName: 'consort', // display names come from procgen at dossier time
        dynastyId: `dyn_${participants[0]}`,
      });
    case 'hostage_exchange':
      return createHostageBond({
        participants,
        turn,
        hostageName: 'ward',
        mutual: termId === 'hostage_exchange' || termId === 'prisoner_exchange',
      });
    case 'vassalage':
      return createVassalageBond({
        participants,
        turn,
        overlord: participants[0],
        tributePerTurn: 25,
      });
    case 'mutual_defense':
      return createMutualDefenseBond(participants, turn);
    case 'trade_league':
      return createTradeLeagueBond(participants, turn, 8);
    case 'religious_accord':
      return createReligiousAccordBond(participants, turn, 'shared_rite');
    case 'cultural_exchange':
      return createCulturalExchangeBond(participants, turn);
    case 'coalition':
      // Coalitions are formed via dedicated coalition cards (P11), not
      // individual negotiation terms — a single-term opt-in would need a
      // common-enemy target we don't have here.
      return null;
  }
}
