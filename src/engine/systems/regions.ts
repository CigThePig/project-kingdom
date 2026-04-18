// gameplay-blueprint.md §4.11 — Regions
// Pure engine logic for regional output aggregation and state updates.
// No React imports. No player-facing text.

import { RegionState, ResourceType } from '../types';
import {
  REGION_DEVELOPMENT_OUTPUT_SCALAR,
  REGION_LOYALTY_REDUCED_TAX_MULTIPLIER,
  REGION_LOYALTY_REDUCED_TAX_THRESHOLD,
  REGION_ROADS_TRADE_BONUS_PER_POINT,
} from '../constants';
import { getPostureOutputMultiplier } from './regional-posture';

// ============================================================
// Summary Interface
// ============================================================

export interface RegionalOutputSummary {
  resourceOutputs: Record<ResourceType, number>;
  foodOutput: number;
  tradeModifier: number;
  totalPopulationContribution: number;
}

// ============================================================
// Internal Helpers
// ============================================================

function clampMin(value: number, min: number): number {
  return value < min ? min : value;
}

// Returns the effective output multiplier for a region based on development level.
// Development 0 → base multiplier 0.5; development 100 → base multiplier 1.5.
function developmentMultiplier(developmentLevel: number): number {
  return developmentLevel * REGION_DEVELOPMENT_OUTPUT_SCALAR + 0.5;
}

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Calculates the total extraction output for a specific ResourceType across all
 * non-occupied regions whose primaryEconomicOutput matches that resource type.
 * Applies localConditionModifier and development level scaling.
 */
export function calculateRegionalResourceOutput(
  regions: RegionState[],
  resourceType: ResourceType,
): number {
  return regions
    .filter((r) => !r.isOccupied && r.primaryEconomicOutput === resourceType)
    .reduce((sum, r) => {
      const postureMult = getPostureOutputMultiplier(r.posture, 'Resource');
      const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel) * postureMult;
      return sum + clampMin(output, 0);
    }, 0);
}

/**
 * Calculates the total food production contribution from all non-occupied regions
 * whose primaryEconomicOutput is 'Food'.
 */
export function calculateRegionalFoodOutput(regions: RegionState[]): number {
  return regions
    .filter((r) => !r.isOccupied && r.primaryEconomicOutput === 'Food')
    .reduce((sum, r) => {
      const postureMult = getPostureOutputMultiplier(r.posture, 'Food');
      const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel) * postureMult;
      return sum + clampMin(output, 0);
    }, 0);
}

/**
 * Returns the aggregate trade modifier from all non-occupied regions whose
 * primaryEconomicOutput is 'Trade'. Used by trade.ts to scale base trade income.
 * A value of 1.0 is neutral; higher values represent trade-oriented regional bonuses.
 */
export function calculateRegionalTradeModifier(regions: RegionState[]): number {
  const tradeRegions = regions.filter(
    (r) => !r.isOccupied && r.primaryEconomicOutput === 'Trade',
  );
  if (tradeRegions.length === 0) return 1.0;
  const total = tradeRegions.reduce((sum, r) => {
    const postureMult = getPostureOutputMultiplier(r.posture, 'Trade');
    const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel) * postureMult;
    return sum + clampMin(output, 0);
  }, 0);
  // Normalise to a multiplier centered on 1.0: each trade region contributes 0.1 bonus per
  // unit of effective output above the 0.5 base, capped to prevent run-away scaling.
  return clampMin(1.0 + total * 0.1, 1.0);
}

/**
 * Returns the sum of populationContribution across all non-occupied regions.
 * Used by population.ts to weight commoner labor availability.
 */
export function calculateTotalRegionalPopulationContribution(regions: RegionState[]): number {
  return regions
    .filter((r) => !r.isOccupied)
    .reduce((sum, r) => sum + r.populationContribution, 0);
}

/**
 * Computes all regional outputs in a single pass over the regions array.
 * Preferred entry point for the turn-resolution engine to avoid multiple iterations.
 */
export function summarizeRegionalOutputs(regions: RegionState[]): RegionalOutputSummary {
  const resourceOutputs: Record<ResourceType, number> = {
    [ResourceType.Wood]: 0,
    [ResourceType.Iron]: 0,
    [ResourceType.Stone]: 0,
  };
  let foodOutput = 0;
  let tradeRawTotal = 0;
  let tradeRegionCount = 0;
  let totalPopulationContribution = 0;

  for (const region of regions) {
    if (region.isOccupied) continue;

    const baseOutput = region.localConditionModifier * developmentMultiplier(region.developmentLevel);
    let output: number;

    if (
      region.primaryEconomicOutput === ResourceType.Wood ||
      region.primaryEconomicOutput === ResourceType.Iron ||
      region.primaryEconomicOutput === ResourceType.Stone
    ) {
      output = clampMin(baseOutput * getPostureOutputMultiplier(region.posture, 'Resource'), 0);
      resourceOutputs[region.primaryEconomicOutput] += output;
    } else if (region.primaryEconomicOutput === 'Food') {
      output = clampMin(baseOutput * getPostureOutputMultiplier(region.posture, 'Food'), 0);
      foodOutput += output;
    } else if (region.primaryEconomicOutput === 'Trade') {
      output = clampMin(baseOutput * getPostureOutputMultiplier(region.posture, 'Trade'), 0);
      tradeRawTotal += output;
      tradeRegionCount++;
    }

    totalPopulationContribution += region.populationContribution;
  }

  const tradeModifier =
    tradeRegionCount === 0 ? 1.0 : clampMin(1.0 + tradeRawTotal * 0.1, 1.0);

  return { resourceOutputs, foodOutput, tradeModifier, totalPopulationContribution };
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies a delta to the localConditionModifier of a specific region.
 * Returns a new RegionState[] (immutable update).
 */
export function applyRegionConditionChange(
  regions: RegionState[],
  regionId: string,
  conditionDelta: number,
): RegionState[] {
  return regions.map((r) =>
    r.id === regionId
      ? { ...r, localConditionModifier: clampMin(r.localConditionModifier + conditionDelta, 0) }
      : r,
  );
}

/**
 * Applies a development level delta to a specific region (e.g. after construction completion).
 * developmentLevel is clamped to [0, 100]. Returns a new RegionState[].
 */
export function applyRegionDevelopmentChange(
  regions: RegionState[],
  regionId: string,
  developmentDelta: number,
): RegionState[] {
  return regions.map((r) => {
    if (r.id !== regionId) return r;
    const newLevel = Math.min(100, Math.max(0, r.developmentLevel + developmentDelta));
    return { ...r, developmentLevel: newLevel };
  });
}

/**
 * Sets the occupation flag on a specific region.
 * Used when a military conflict results in territory lost or recovered.
 */
export function applyOccupationChange(
  regions: RegionState[],
  regionId: string,
  isOccupied: boolean,
): RegionState[] {
  return regions.map((r) => (r.id === regionId ? { ...r, isOccupied } : r));
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Returns true when all regions are occupied — triggers the Conquest failure condition.
 */
export function checkTotalConquest(regions: RegionState[]): boolean {
  return regions.length > 0 && regions.every((r) => r.isOccupied);
}

/**
 * Returns the fraction (0–1) of regions currently occupied.
 * Used by failure forecasting to warn of approaching conquest.
 */
export function getOccupiedFraction(regions: RegionState[]): number {
  if (regions.length === 0) return 0;
  return regions.filter((r) => r.isOccupied).length / regions.length;
}

// ============================================================
// Expansion 5 — Adjusted Regional Summary
// ============================================================

export interface AdjustedRegionalSummary {
  tradeModifierAdjusted: number;        // trade modifier accounting for roads infrastructure
  loyaltyTaxMultiplier: number;         // aggregate tax multiplier from regional loyalty
}

/**
 * Computes loyalty- and infrastructure-adjusted regional modifiers.
 * Called after Phase 1c (regional tick) to provide adjusted values for Phase 2a.
 * The base summary (summarizeRegionalOutputs) handles resource extraction and is unaffected.
 */
export function computeAdjustedRegionalSummary(regions: RegionState[]): AdjustedRegionalSummary {
  let totalRoadsBonus = 0;
  let loyaltyPenaltyCount = 0;
  let activeRegionCount = 0;

  for (const region of regions) {
    if (region.isOccupied) continue;
    activeRegionCount++;

    // Infrastructure roads boost trade
    if (region.infrastructure) {
      totalRoadsBonus += region.infrastructure.roads * REGION_ROADS_TRADE_BONUS_PER_POINT;
    }

    // Low loyalty reduces tax contribution
    if (region.loyalty !== undefined && region.loyalty < REGION_LOYALTY_REDUCED_TAX_THRESHOLD) {
      loyaltyPenaltyCount++;
    }
  }

  // Trade modifier: 1.0 base + average roads bonus across active regions
  const avgRoadsBonus = activeRegionCount > 0 ? totalRoadsBonus / activeRegionCount : 0;
  const tradeModifierAdjusted = 1.0 + avgRoadsBonus;

  // Loyalty tax multiplier: proportional to how many regions have low loyalty
  const penaltyFraction = activeRegionCount > 0 ? loyaltyPenaltyCount / activeRegionCount : 0;
  const loyaltyTaxMultiplier = 1.0 - penaltyFraction * (1.0 - REGION_LOYALTY_REDUCED_TAX_MULTIPLIER);

  return { tradeModifierAdjusted, loyaltyTaxMultiplier };
}
