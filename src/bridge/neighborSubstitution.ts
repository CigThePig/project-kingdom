// Bridge Layer — Neighbor Substitution Helper
// Resolves `__NEIGHBOR__` placeholders in MechanicalEffectDelta.diplomacyDeltas
// against the player's preferred non-warring neighbor. Shared by assessment,
// negotiation, and summary generators so a single rule governs targeting.

import type { GameState, MechanicalEffectDelta } from '../engine/types';

/** Picks the most favorable non-warring neighbor id. Falls back to the first neighbor or 'unknown'. */
export function pickPreferredNeighborId(state: GameState): string {
  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return peaceful[0]?.id ?? neighbors[0]?.id ?? 'unknown';
}

/**
 * Resolves `__NEIGHBOR__` in `diplomacyDeltas` to a concrete neighbor id.
 * If `neighborId` is provided, uses it; otherwise derives via {@link pickPreferredNeighborId}.
 * Returns the delta unchanged when no `diplomacyDeltas` are present.
 */
export function resolveNeighborInDelta(
  delta: MechanicalEffectDelta,
  stateOrId: GameState | string,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;
  const neighborId =
    typeof stateOrId === 'string' ? stateOrId : pickPreferredNeighborId(stateOrId);
  const resolved: Record<string, number> = {};
  for (const [key, value] of Object.entries(delta.diplomacyDeltas)) {
    resolved[key === '__NEIGHBOR__' ? neighborId : key] = value;
  }
  return { ...delta, diplomacyDeltas: resolved };
}
