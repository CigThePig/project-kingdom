// Phase 3 — Rival Memory
// Pure functions that track a rival kingdom's remembered grievances and
// favors toward the player. Memory entries decay over time; territorial
// losses on historically claimed regions double-weight in the drift delta
// that nudges the relationship score.

import type { GameState, RivalMemoryEntry } from '../types';
import { getRegionsClaimedBy } from './geography';

const DEFAULT_CAPACITY = 16;
const DECAY_PER_YEAR = 0.85;
const DROP_BELOW_WEIGHT = 0.05;
const DRIFT_DELTA_CLAMP = 20;

/** Sign and magnitude scalar applied per entry type when computing drift. */
const TYPE_SIGN: Record<RivalMemoryEntry['type'], number> = {
  favor: 1,
  demonstration: 0.5,
  slight: -1,
  breach: -1.5,
  territorial_loss: -2,
};

/**
 * Appends a memory entry. When capacity is exceeded, the lowest-weight
 * existing entry is evicted (not the oldest) — so a weighty grudge never
 * falls off the list just because the rival accumulated many small favors.
 */
export function recordMemory(
  memory: RivalMemoryEntry[] | undefined,
  entry: RivalMemoryEntry,
  capacity: number = DEFAULT_CAPACITY,
): RivalMemoryEntry[] {
  const next = [...(memory ?? []), entry];
  if (next.length <= capacity) return next;

  let minIdx = 0;
  for (let i = 1; i < next.length; i++) {
    if (next[i].weight < next[minIdx].weight) minIdx = i;
  }
  return next.filter((_, i) => i !== minIdx);
}

/**
 * Multiplies each entry's weight by DECAY_PER_YEAR^yearsElapsed and drops
 * entries that fall below DROP_BELOW_WEIGHT. Non-destructive — returns a
 * new array.
 */
export function decayMemoryWeights(
  memory: RivalMemoryEntry[] | undefined,
  yearsElapsed: number,
): RivalMemoryEntry[] {
  if (!memory || memory.length === 0) return [];
  if (yearsElapsed <= 0) return memory;

  const factor = DECAY_PER_YEAR ** yearsElapsed;
  const result: RivalMemoryEntry[] = [];
  for (const entry of memory) {
    const nextWeight = entry.weight * factor;
    if (nextWeight >= DROP_BELOW_WEIGHT) {
      result.push({ ...entry, weight: nextWeight });
    }
  }
  return result;
}

/**
 * Computes the cumulative relationship-drift delta produced by the memory
 * log. Positive = rival warms toward player; negative = rival sours.
 * Territorial_loss entries whose regionId is a historic claim of the
 * neighbor double-weight (design-doc rule).
 *
 * Result is clamped to ±DRIFT_DELTA_CLAMP so a single grudge cannot
 * permanently pin the relationship at 0.
 */
export function computeMemoryDriftDelta(
  memory: RivalMemoryEntry[] | undefined,
  neighborId: string,
  state: GameState,
): number {
  if (!memory || memory.length === 0) return 0;

  const claimedRegions = new Set(getRegionsClaimedBy(neighborId, state));
  let total = 0;
  for (const entry of memory) {
    const sign = TYPE_SIGN[entry.type];
    let contribution = entry.weight * sign;
    if (
      entry.type === 'territorial_loss' &&
      entry.regionId &&
      claimedRegions.has(entry.regionId)
    ) {
      contribution *= 2;
    }
    total += contribution;
  }

  if (total > DRIFT_DELTA_CLAMP) return DRIFT_DELTA_CLAMP;
  if (total < -DRIFT_DELTA_CLAMP) return -DRIFT_DELTA_CLAMP;
  return total;
}
