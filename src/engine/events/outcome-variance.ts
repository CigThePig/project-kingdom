// Outcome variance system — makes event/storyline choices produce variable results.
// Each choice resolution rolls a quality tier that scales the base mechanical effects.

import type { MechanicalEffectDelta } from '../types';
import { OutcomeQuality } from '../types';

// Weighted probability distribution for outcome quality tiers.
// Disastrous/Excellent are rare (~8%), Poor/Good moderate (~17%), Expected common (~50%).
const OUTCOME_WEIGHTS: readonly { quality: OutcomeQuality; weight: number }[] = [
  { quality: OutcomeQuality.Disastrous, weight: 0.08 },
  { quality: OutcomeQuality.Poor, weight: 0.17 },
  { quality: OutcomeQuality.Expected, weight: 0.50 },
  { quality: OutcomeQuality.Good, weight: 0.17 },
  { quality: OutcomeQuality.Excellent, weight: 0.08 },
];

// Multipliers applied to positive and negative deltas per quality tier.
const VARIANCE_MULTIPLIERS: Record<OutcomeQuality, { positive: number; negative: number }> = {
  [OutcomeQuality.Disastrous]: { positive: 0.3, negative: 1.8 },
  [OutcomeQuality.Poor]:       { positive: 0.6, negative: 1.3 },
  [OutcomeQuality.Expected]:   { positive: 1.0, negative: 1.0 },
  [OutcomeQuality.Good]:       { positive: 1.4, negative: 0.6 },
  [OutcomeQuality.Excellent]:  { positive: 2.0, negative: 0.3 },
};

/**
 * Rolls an outcome quality tier using weighted random selection.
 * Caller must pass a seeded RNG (see engine/resolution/turn-rng.ts) so
 * replay/determinism hold.
 */
export function rollOutcomeQuality(rng: () => number, tierBoost = 0): OutcomeQuality {
  const roll = rng();
  let cumulative = 0;
  let base: OutcomeQuality = OutcomeQuality.Expected;
  for (const entry of OUTCOME_WEIGHTS) {
    cumulative += entry.weight;
    if (roll < cumulative) {
      base = entry.quality;
      break;
    }
  }
  if (tierBoost <= 0) return base;
  // Phase 8 advisor `outcome_quality_boost`: bump the tier up by `tierBoost`
  // ranks, clamped at Excellent.
  const ORDER: OutcomeQuality[] = [
    OutcomeQuality.Disastrous,
    OutcomeQuality.Poor,
    OutcomeQuality.Expected,
    OutcomeQuality.Good,
    OutcomeQuality.Excellent,
  ];
  const idx = ORDER.indexOf(base);
  const boostedIdx = Math.min(ORDER.length - 1, idx + Math.round(tierBoost));
  return ORDER[boostedIdx];
}

/**
 * Applies outcome variance to a base mechanical effect delta.
 * Positive deltas (benefits) are scaled by the positive multiplier.
 * Negative deltas (costs/penalties) are scaled by the negative multiplier.
 * Returns a new delta object — does not mutate the input.
 */
export function applyVariance(
  baseEffect: MechanicalEffectDelta,
  quality: OutcomeQuality,
): MechanicalEffectDelta {
  if (quality === OutcomeQuality.Expected) {
    return { ...baseEffect };
  }

  const multipliers = VARIANCE_MULTIPLIERS[quality];
  const result: MechanicalEffectDelta = {};

  for (const [key, value] of Object.entries(baseEffect)) {
    if (key === 'diplomacyDeltas' && typeof value === 'object' && value !== null) {
      const scaledDiplomacy: Record<string, number> = {};
      for (const [neighborId, delta] of Object.entries(value as Record<string, number>)) {
        scaledDiplomacy[neighborId] = scaleValue(delta, multipliers);
      }
      result.diplomacyDeltas = scaledDiplomacy;
    } else if (typeof value === 'number') {
      (result as Record<string, number>)[key] = scaleValue(value, multipliers);
    }
  }

  return result;
}

function scaleValue(
  value: number,
  multipliers: { positive: number; negative: number },
): number {
  if (value === 0) return 0;
  const multiplier = value > 0 ? multipliers.positive : multipliers.negative;
  return Math.round(value * multiplier);
}

/**
 * Returns the display label for an outcome quality tier.
 */
export function getOutcomeQualityLabel(quality: OutcomeQuality): string {
  switch (quality) {
    case OutcomeQuality.Disastrous: return 'Disastrous Outcome';
    case OutcomeQuality.Poor: return 'Poor Outcome';
    case OutcomeQuality.Expected: return 'As Expected';
    case OutcomeQuality.Good: return 'Favorable Outcome';
    case OutcomeQuality.Excellent: return 'Exceptional Outcome';
  }
}
