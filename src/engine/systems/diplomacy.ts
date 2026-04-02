// gameplay-blueprint.md §4.9 — Diplomacy
// Pure engine logic for neighbor relationship dynamics and AI behavior.
// No React imports. No player-facing text.

import {
  DiplomaticAgreement,
  DiplomaticPosture,
  DiplomacyState,
  NeighborDisposition,
  NeighborState,
} from '../types';
import {
  DIPLOMACY_AI_DELTA_BY_DISPOSITION,
  DIPLOMACY_POSTURE_THRESHOLDS,
  DIPLOMACY_SHARED_CULTURE_BONUS,
  DIPLOMACY_SHARED_FAITH_BONUS,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Derives the DiplomaticPosture label from a relationship score.
 * Uses DIPLOMACY_POSTURE_THRESHOLDS: score ≤ threshold → that posture.
 * Evaluated in ascending order so the lowest matching threshold wins.
 */
export function deriveDiplomaticPosture(relationshipScore: number): DiplomaticPosture {
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.War]) {
    return DiplomaticPosture.War;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Hostile]) {
    return DiplomaticPosture.Hostile;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Tense]) {
    return DiplomaticPosture.Tense;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Neutral]) {
    return DiplomaticPosture.Neutral;
  }
  return DiplomaticPosture.Friendly;
}

/**
 * Returns true when a neighbor's posture is War (§4.9).
 */
export function isAtWar(neighbor: NeighborState): boolean {
  return neighbor.attitudePosture === DiplomaticPosture.War;
}

/**
 * Calculates the faith and culture alignment bonus/penalty between the kingdom
 * and a specific neighbor.
 *
 * Shared faith tradition → DIPLOMACY_SHARED_FAITH_BONUS (additive, §4.9).
 * Shared cultural identity → DIPLOMACY_SHARED_CULTURE_BONUS (additive).
 * Mismatched faith → negative penalty of equal magnitude.
 * Mismatched culture → smaller negative penalty.
 */
export function calculateFaithCultureAlignmentBonus(
  kingdomFaithTraditionId: string,
  kingdomCultureIdentityId: string,
  neighbor: NeighborState,
): number {
  const faithMatch = neighbor.religiousProfile === kingdomFaithTraditionId;
  const cultureMatch = neighbor.culturalIdentity === kingdomCultureIdentityId;

  const faithBonus = faithMatch
    ? DIPLOMACY_SHARED_FAITH_BONUS
    : -Math.round(DIPLOMACY_SHARED_FAITH_BONUS * 0.5);

  const cultureBonus = cultureMatch
    ? DIPLOMACY_SHARED_CULTURE_BONUS
    : -Math.round(DIPLOMACY_SHARED_CULTURE_BONUS * 0.5);

  return faithBonus + cultureBonus;
}

/**
 * Calculates the AI-driven relationship score delta for a neighbor this turn.
 *
 * Drivers (§4.9):
 * - Disposition baseline: each disposition has a natural per-turn drift.
 * - Kingdom military strength: strong kingdoms deter Aggressive neighbors.
 * - Kingdom stability: unstable kingdoms invite Opportunistic and Aggressive pressure.
 * - Shared faith/culture: alignment provides a standing relationship stabilizer.
 *
 * Aggressive neighbors apply an additional -4 penalty if kingdom stability < 40.
 */
export function calculateAIRelationshipDelta(
  neighbor: NeighborState,
  kingdomMilitaryStrength: number,
  kingdomStabilityValue: number,
  sharedFaith: boolean,
  sharedCulture: boolean,
): number {
  const dispositionDelta = DIPLOMACY_AI_DELTA_BY_DISPOSITION[neighbor.disposition];

  // Aggressive neighbors are deterred by military strength
  const militaryDeterrence =
    neighbor.disposition === NeighborDisposition.Aggressive
      ? Math.round((kingdomMilitaryStrength - 50) * 0.04)
      : 0;

  // Opportunistic and Aggressive neighbors exploit instability
  const instabilityExploitation =
    (neighbor.disposition === NeighborDisposition.Aggressive ||
      neighbor.disposition === NeighborDisposition.Opportunistic) &&
    kingdomStabilityValue < 40
      ? -2
      : 0;

  // Mercantile neighbors appreciate stable trading partners
  const stabilityBonus =
    neighbor.disposition === NeighborDisposition.Mercantile && kingdomStabilityValue > 60
      ? 1
      : 0;

  // Faith/culture alignment provides a standing soft bonus
  const alignmentBonus = (sharedFaith ? 1 : 0) + (sharedCulture ? 0.5 : 0);

  const rawDelta =
    dispositionDelta +
    militaryDeterrence +
    instabilityExploitation +
    stabilityBonus +
    alignmentBonus;

  return clamp(rawDelta, -8, 5);
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies a player-initiated diplomatic action delta to a specific neighbor.
 * Clamps the resulting relationship score to [0, 100] and re-derives posture.
 * Returns a new NeighborState[] (immutable update).
 */
export function applyDiplomaticActionEffect(
  neighbors: NeighborState[],
  targetNeighborId: string,
  relationshipDelta: number,
): NeighborState[] {
  return neighbors.map((n) => {
    if (n.id !== targetNeighborId) return n;
    const newScore = clamp(n.relationshipScore + relationshipDelta, 0, 100);
    return {
      ...n,
      relationshipScore: newScore,
      attitudePosture: deriveDiplomaticPosture(newScore),
    };
  });
}

/**
 * Decrements turnsRemaining on all active timed agreements.
 * Removes agreements that have expired (turnsRemaining reaches 0).
 * Indefinite agreements (turnsRemaining === null) are untouched.
 * Returns a new NeighborState[] (immutable update).
 */
export function tickDiplomaticAgreements(neighbors: NeighborState[]): NeighborState[] {
  return neighbors.map((n) => {
    const updatedAgreements = n.activeAgreements
      .map((agreement: DiplomaticAgreement) => {
        if (agreement.turnsRemaining === null) return agreement;
        return { ...agreement, turnsRemaining: agreement.turnsRemaining - 1 };
      })
      .filter(
        (agreement: DiplomaticAgreement) =>
          agreement.turnsRemaining === null || agreement.turnsRemaining > 0,
      );
    return { ...n, activeAgreements: updatedAgreements };
  });
}

/**
 * Applies per-turn AI relationship deltas to all neighbors and re-derives their postures.
 * relationshipDeltas: Record<neighborId, delta> — pre-computed by resolution engine.
 * Returns a new DiplomacyState (immutable update).
 */
export function applyDiplomacyUpdate(
  current: DiplomacyState,
  relationshipDeltas: Record<string, number>,
): DiplomacyState {
  const updatedNeighbors = current.neighbors.map((n) => {
    const delta = relationshipDeltas[n.id] ?? 0;
    const newScore = clamp(n.relationshipScore + delta, 0, 100);
    return {
      ...n,
      relationshipScore: newScore,
      attitudePosture: deriveDiplomaticPosture(newScore),
    };
  });

  return { ...current, neighbors: updatedNeighbors };
}
