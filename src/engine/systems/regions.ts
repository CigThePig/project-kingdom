// gameplay-blueprint.md §4.11 — Regions
// Pure engine logic for regional output aggregation and state updates.
// No React imports. No player-facing text.

import { RegionState, ResourceType } from '../types';
import { REGION_DEVELOPMENT_OUTPUT_SCALAR } from '../constants';

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
      const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel);
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
      const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel);
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
    const output = r.localConditionModifier * developmentMultiplier(r.developmentLevel);
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

    const output = clampMin(
      region.localConditionModifier * developmentMultiplier(region.developmentLevel),
      0,
    );

    if (
      region.primaryEconomicOutput === ResourceType.Wood ||
      region.primaryEconomicOutput === ResourceType.Iron ||
      region.primaryEconomicOutput === ResourceType.Stone
    ) {
      resourceOutputs[region.primaryEconomicOutput] += output;
    } else if (region.primaryEconomicOutput === 'Food') {
      foodOutput += output;
    } else if (region.primaryEconomicOutput === 'Trade') {
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
