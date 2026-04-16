// Phase 1 — Name Resolver
// Single point of indirection for all neighbor display names.
// Prefers per-instance state fields, falls back to static labels, then to raw IDs.
//
// All ~30+ existing call sites that do `NEIGHBOR_LABELS[id] ?? id` should switch
// to use the helpers in this file.

import type { GameState, NeighborState } from '../engine/types';
import { NEIGHBOR_LABELS } from '../data/text/labels';
import { NEIGHBOR_RULER_NAMES } from '../data/text/dossier-templates';

/**
 * Looks up a neighbor by ID in the diplomacy state.
 * Returns undefined if not found.
 */
function findNeighbor(neighborId: string, state: GameState): NeighborState | undefined {
  return state.diplomacy.neighbors.find((n) => n.id === neighborId);
}

/**
 * Returns the display name for a neighbor kingdom.
 *
 * Resolution order:
 *   1. Live state field `neighbor.displayName` (set at scenario creation by procgen)
 *   2. Static `NEIGHBOR_LABELS` map (legacy, also serves as fallback for old saves)
 *   3. The raw neighbor ID (last resort, for unknown IDs)
 */
export function getNeighborDisplayName(neighborId: string, state: GameState): string {
  const neighbor = findNeighbor(neighborId, state);
  if (neighbor?.displayName) {
    return neighbor.displayName;
  }
  return NEIGHBOR_LABELS[neighborId] ?? neighborId;
}

/**
 * Returns the ruler name for a neighbor kingdom (e.g. "King Hadric IV").
 *
 * Resolution order:
 *   1. Live state field `neighbor.rulerName`
 *   2. Static `NEIGHBOR_RULER_NAMES` map
 *   3. A constructed default like "the ruler of {kingdom}"
 */
export function getNeighborRulerName(neighborId: string, state: GameState): string {
  const neighbor = findNeighbor(neighborId, state);
  if (neighbor?.rulerName) {
    return neighbor.rulerName;
  }
  if (NEIGHBOR_RULER_NAMES[neighborId]) {
    return NEIGHBOR_RULER_NAMES[neighborId];
  }
  return `the ruler of ${getNeighborDisplayName(neighborId, state)}`;
}

/**
 * Returns the ruler's title alone (e.g. "King", "Queen", "High Lord").
 * Useful for grammar in templates: "{title} {rulerName} demands tribute".
 */
export function getNeighborRulerTitle(neighborId: string, state: GameState): string {
  const neighbor = findNeighbor(neighborId, state);
  return neighbor?.rulerTitle ?? 'Ruler';
}

/**
 * Returns the dynasty/house name for a neighbor (e.g. "House Marrowmoor").
 *
 * Resolution order:
 *   1. Live state field `neighbor.dynastyName`
 *   2. Constructed default based on the kingdom name
 */
export function getNeighborDynastyName(neighborId: string, state: GameState): string {
  const neighbor = findNeighbor(neighborId, state);
  if (neighbor?.dynastyName) {
    return neighbor.dynastyName;
  }
  return `the ruling house of ${getNeighborDisplayName(neighborId, state)}`;
}

/**
 * Returns the capital city name for a neighbor (e.g. "Velthorne").
 *
 * Resolution order:
 *   1. Live state field `neighbor.capitalName`
 *   2. Constructed default by stripping pattern prefixes from displayName
 */
export function getNeighborCapitalName(neighborId: string, state: GameState): string {
  const neighbor = findNeighbor(neighborId, state);
  if (neighbor?.capitalName) {
    return neighbor.capitalName;
  }
  // Best-effort fallback: strip "Kingdom of ", "The ", "Realm of ", etc.
  const display = getNeighborDisplayName(neighborId, state);
  return display
    .replace(/^Kingdom of /, '')
    .replace(/^Realm of /, '')
    .replace(/^Crown of /, '')
    .replace(/^Free Cities of /, '')
    .replace(/^The /, '')
    .replace(/ Dominion$/, '')
    .replace(/ Confederation$/, '')
    .replace(/ Marches$/, '');
}

/**
 * Returns the epithet for a ruler (e.g. "the Iron-Handed") if one has been earned.
 * Returns null if no epithet is set — most rulers do not have epithets.
 */
export function getNeighborEpithet(neighborId: string, state: GameState): string | null {
  const neighbor = findNeighbor(neighborId, state);
  return neighbor?.epithet ?? null;
}

/**
 * Returns the full ruler descriptor including epithet if present.
 * E.g. "King Hadric IV, the Iron-Handed" or just "King Hadric IV".
 */
export function getNeighborFullRulerDescriptor(neighborId: string, state: GameState): string {
  const rulerName = getNeighborRulerName(neighborId, state);
  const epithet = getNeighborEpithet(neighborId, state);
  return epithet ? `${rulerName}, ${epithet}` : rulerName;
}
