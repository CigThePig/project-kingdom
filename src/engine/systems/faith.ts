// gameplay-blueprint.md §4.8 — Faith and Culture
// Pure engine logic for faith level, cultural cohesion, heterodoxy, and schism.
// No React imports. No player-facing text.

import {
  FaithCultureState,
  FestivalInvestmentLevel,
  RegionState,
  ReligiousOrder,
  ReligiousTolerance,
} from '../types';
import {
  CULTURAL_COHESION_MAX,
  CULTURAL_COHESION_MIN,
  FAITH_FESTIVAL_DELTA_BY_LEVEL,
  FAITH_LEVEL_MAX,
  FAITH_LEVEL_MIN,
  FAITH_TOLERANCE_HETERODOX_MODIFIER,
  HETERODOXY_SCHISM_THRESHOLD,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Base faith decay per turn if clergy is at median satisfaction (50).
const FAITH_BASE_CLERGY_CONTRIBUTION = 0.04; // per satisfaction point above/below 50
// Fraction of regional cultural identity agreement required for full cohesion support.
const COHESION_ALIGNMENT_BONUS_PER_MATCHING_REGION = 1.0;
const COHESION_MISALIGNMENT_PENALTY_PER_REGION = 0.5;

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Calculates the net faith level delta for this turn.
 *
 * Drivers (§4.8):
 * - Clergy satisfaction: dissatisfied clergy weaken faith institutions.
 * - Festival investment: observances reinforce religious life; skipping them signals neglect.
 * - Heterodoxy level: high heterodoxy actively erodes mainstream faith.
 * - Religious tolerance policy: Favored/Enforced supports establishment faith;
 *   Suppressed indicates state coercion that paradoxically deepens unrest.
 * - Active religious orders: healing/charitable orders provide community faith support.
 */
export function calculateFaithDelta(
  clergySatisfaction: number,
  festivalInvestmentLevel: FestivalInvestmentLevel,
  heterodoxy: number,
  religiousTolerance: ReligiousTolerance,
  activeOrders: ReligiousOrder[],
): number {
  const clergyContribution = (clergySatisfaction - 50) * FAITH_BASE_CLERGY_CONTRIBUTION;
  const festivalContribution = FAITH_FESTIVAL_DELTA_BY_LEVEL[festivalInvestmentLevel];
  const heterodoxyPressure = -(heterodoxy / 100) * 3;
  const toleranceContribution = toleranceFaithBonus(religiousTolerance);
  const orderContribution = applyReligiousOrderEffects(activeOrders, 0);

  return clamp(
    clergyContribution + festivalContribution + heterodoxyPressure + toleranceContribution + orderContribution,
    -10,
    10,
  );
}

/**
 * Applies upkeep-adjusted effects from active religious orders to a base faith delta.
 * Each active order type contributes a fixed faith bonus per §4.8:
 * - Healing: minor faith stability (community trust)
 * - Scholarly: minor faith stability (doctrinal coherence)
 * - Martial: moderate faith boost (martial piety)
 * - Charitable: strong faith boost (visibility of church's mercy)
 */
export function applyReligiousOrderEffects(
  activeOrders: ReligiousOrder[],
  baseFaithDelta: number,
): number {
  const orderBonus = activeOrders
    .filter((o) => o.isActive)
    .reduce((sum, _o) => sum + 0.5, 0); // each active order adds 0.5 faith/turn
  return baseFaithDelta + orderBonus;
}

/**
 * Calculates the cultural cohesion delta for this turn.
 *
 * Drivers (§4.8):
 * - Regional cultural identity alignment: regions sharing the kingdom's primary
 *   cultural identity reinforce cohesion; misaligned regions erode it.
 * - Faith level: high faith strengthens shared identity.
 * - Cultural/Scholarly knowledge bonus: advances improve cohesion.
 */
export function calculateCulturalCohesionDelta(
  regions: RegionState[],
  kingdomCultureIdentityId: string,
  faithLevel: number,
  culturalKnowledgeBonus: number,
): number {
  const activeRegions = regions.filter((r) => !r.isOccupied);
  if (activeRegions.length === 0) return 0;

  let alignmentScore = 0;
  for (const region of activeRegions) {
    if (region.culturalIdentity === kingdomCultureIdentityId) {
      alignmentScore += COHESION_ALIGNMENT_BONUS_PER_MATCHING_REGION;
    } else {
      alignmentScore -= COHESION_MISALIGNMENT_PENALTY_PER_REGION;
    }
  }
  const alignmentDelta = alignmentScore / activeRegions.length; // normalise by region count

  const faithBonus = (faithLevel - 50) * 0.02;
  const knowledgeBonus = culturalKnowledgeBonus * 2;

  return clamp(alignmentDelta + faithBonus + knowledgeBonus, -5, 5);
}

/**
 * Calculates the heterodoxy delta for this turn.
 *
 * Heterodoxy grows when faith is low, clergy are dissatisfied, religious tolerance
 * is lax, or external pressure is applied. It declines when the establishment
 * faith is strong and actively maintained (§4.8).
 *
 * externalHeterodoxPressure: 0–1 scalar from event context (passed by resolution engine).
 */
export function calculateHeterodoxyDelta(
  faithLevel: number,
  clergySatisfaction: number,
  religiousTolerance: ReligiousTolerance,
  externalHeterodoxPressure: number,
): number {
  // Low faith generates heterodox movements naturally
  const faithDriver = faithLevel < 40 ? (40 - faithLevel) * 0.1 : -(faithLevel - 40) * 0.04;
  // Clergy dissatisfaction weakens enforcement of orthodoxy
  const clergyDriver = (50 - clergySatisfaction) * 0.05;
  // Tolerance policy modifier (positive = heterodoxy grows; negative = suppressed)
  const toleranceModifier = FAITH_TOLERANCE_HETERODOX_MODIFIER[religiousTolerance];
  // External pressure (e.g. foreign missionaries, storyline events)
  const externalDriver = externalHeterodoxPressure * 5;

  return clamp(faithDriver + clergyDriver + toleranceModifier + externalDriver, -5, 10);
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Returns true when heterodoxy is at or above the schism threshold,
 * triggering a schism evaluation check (§4.8).
 */
export function shouldCheckForSchism(heterodoxy: number): boolean {
  return heterodoxy >= HETERODOXY_SCHISM_THRESHOLD;
}

/**
 * Evaluates the current schism state.
 * If heterodoxy is above the threshold and no schism is active, a schism begins.
 * If a schism is already active, the state is unchanged (resolution happens via events).
 * Returns only the schism-related fields of FaithCultureState.
 */
export function evaluateSchismState(
  current: FaithCultureState,
): Pick<FaithCultureState, 'schismActive' | 'schismDetails'> {
  if (current.schismActive) {
    // Existing schism — resolution is handled through event choices, not automatically
    return { schismActive: current.schismActive, schismDetails: current.schismDetails };
  }
  if (current.heterodoxy >= HETERODOXY_SCHISM_THRESHOLD) {
    // New schism — schismDetails is an internal ID used to link events
    return {
      schismActive: true,
      schismDetails: `schism-${current.kingdomFaithTraditionId}-onset`,
    };
  }
  return { schismActive: false, schismDetails: null };
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies all faith/culture deltas to produce a new FaithCultureState.
 * Returns a new FaithCultureState (immutable update).
 */
export function applyFaithCultureUpdate(
  current: FaithCultureState,
  faithDelta: number,
  cohesionDelta: number,
  heterodoxyDelta: number,
): FaithCultureState {
  const newFaithLevel = clamp(current.faithLevel + faithDelta, FAITH_LEVEL_MIN, FAITH_LEVEL_MAX);
  const newCohesion = clamp(
    current.culturalCohesion + cohesionDelta,
    CULTURAL_COHESION_MIN,
    CULTURAL_COHESION_MAX,
  );
  const newHeterodoxy = clamp(current.heterodoxy + heterodoxyDelta, 0, 100);

  const schismState = evaluateSchismState({
    ...current,
    faithLevel: newFaithLevel,
    heterodoxy: newHeterodoxy,
  });

  return {
    ...current,
    faithLevel: newFaithLevel,
    culturalCohesion: newCohesion,
    heterodoxy: newHeterodoxy,
    schismActive: schismState.schismActive,
    schismDetails: schismState.schismDetails,
  };
}

// ============================================================
// Internal Driver Helpers
// ============================================================

function toleranceFaithBonus(religiousTolerance: ReligiousTolerance): number {
  switch (religiousTolerance) {
    case ReligiousTolerance.Enforced:
      return 2; // state enforcement supports establishment faith
    case ReligiousTolerance.Favored:
      return 1;
    case ReligiousTolerance.Tolerated:
      return -1; // signals ambivalence toward the faith
    case ReligiousTolerance.Suppressed:
      return -2; // active suppression may indicate hostility to religion broadly
  }
}
