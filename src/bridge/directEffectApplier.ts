// Bridge Layer — Direct Effect Applier
// Applies assessment and negotiation effects directly to game state.
// These interactions don't go through the engine's event system (they aren't
// ActiveEvents in the pool). Their mechanical effects are applied before
// the standard turn resolution pipeline runs.

import { InteractionType } from '../engine/types';
import type { GameState, MechanicalEffectDelta } from '../engine/types';
import { applyMechanicalEffectDelta } from '../engine/events/apply-event-effects';
import { ASSESSMENT_EFFECTS } from '../data/events/assessment-effects';
import { NEGOTIATION_EFFECTS } from '../data/events/negotiation-effects';
import type { MonthDecision } from '../ui/types';

/**
 * Resolves __NEIGHBOR__ placeholders in diplomacyDeltas.
 * Picks the first peaceful neighbor by relationship score, or falls back to any.
 */
function resolveNeighborPlaceholders(
  delta: MechanicalEffectDelta,
  state: GameState,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;

  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  const neighborId = peaceful[0]?.id ?? neighbors[0]?.id ?? 'unknown';

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
        const delta = resolveNeighborPlaceholders(rawDelta, current);
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
          const delta = resolveNeighborPlaceholders(rawDelta, current);
          current = applyMechanicalEffectDelta(current, delta, null);
        }
      } else if (!d.choiceId.startsWith('accept:')) {
        // Term effect — choiceId is the bare termId
        const rawDelta = NEGOTIATION_EFFECTS[negotiationId]?.[d.choiceId];
        if (rawDelta) {
          const delta = resolveNeighborPlaceholders(rawDelta, current);
          current = applyMechanicalEffectDelta(current, delta, null);
        }
      }
    }
  }

  return current;
}
