// gameplay-blueprint.md §4.2 — Food
// Pure engine logic for food production, consumption, and famine tracking.
// No React imports. No player-facing text.

import {
  ClassState,
  FoodState,
  MilitaryRecruitmentStance,
  PopulationState,
  RationingLevel,
  Season,
} from '../types';
import {
  FOOD_BASE_CONSUMPTION_RATE_PER_PERSON,
  FOOD_COMMONER_LABOR_PRODUCTION_RATE,
  FOOD_CONSECUTIVE_TURNS_FAMINE,
  FOOD_FAMINE_THRESHOLD,
  FOOD_MILITARY_PROVISIONING_RATE,
  FOOD_SEASONAL_MODIFIERS,
  RATIONING_CONSUMPTION_MULTIPLIER,
  RECRUITMENT_FOOD_BURDEN_MULTIPLIER,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function totalPopulation(population: PopulationState): number {
  return (Object.values(population) as ClassState[]).reduce(
    (sum, cls) => sum + cls.population,
    0,
  );
}

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Returns the seasonal food production multiplier for the given season.
 * (Convenience wrapper around the FOOD_SEASONAL_MODIFIERS constant.)
 */
export function getSeasonalFoodModifier(season: Season): number {
  return FOOD_SEASONAL_MODIFIERS[season];
}

/**
 * Calculates base food production for this turn.
 *
 * Formula:
 *   production = (commoners.population × LABOR_RATE × seasonalModifier × (1 + agBonus))
 *                + regionalFoodOutput
 *
 * - Commoner population drives primary agricultural labor (§4.2, §4.4).
 * - Agricultural knowledge efficiency bonus compounds the labor output.
 * - Regional food output represents stable regional contributions independent of labor.
 */
export function calculateFoodProduction(
  commoners: ClassState,
  regionalFoodOutput: number,
  season: Season,
  agriculturalEfficiencyBonus: number,
): number {
  const seasonalModifier = FOOD_SEASONAL_MODIFIERS[season];
  const laborOutput =
    commoners.population *
    FOOD_COMMONER_LABOR_PRODUCTION_RATE *
    seasonalModifier *
    (1 + agriculturalEfficiencyBonus);
  return clamp(laborOutput + regionalFoodOutput, 0, Infinity);
}

/**
 * Calculates total food consumption for this turn.
 *
 * Formula:
 *   consumption = (totalPopulation × BASE_RATE × rationingMultiplier)
 *                 + (forceSize × PROVISIONING_RATE × recruitmentBurdenMultiplier)
 *
 * - Total population (all classes) drives base food demand.
 * - Rationing policy scales the per-capita demand.
 * - Military provisioning is an additional burden scaled by recruitment stance (§4.6).
 */
export function calculateFoodConsumption(
  population: PopulationState,
  rationingLevel: RationingLevel,
  militaryRecruitmentStance: MilitaryRecruitmentStance,
  forceSize: number,
): number {
  const pop = totalPopulation(population);
  const rationingMultiplier = RATIONING_CONSUMPTION_MULTIPLIER[rationingLevel];
  const recruitmentBurdenMultiplier = RECRUITMENT_FOOD_BURDEN_MULTIPLIER[militaryRecruitmentStance];

  const populationConsumption = pop * FOOD_BASE_CONSUMPTION_RATE_PER_PERSON * rationingMultiplier;
  const militaryProvisioning = forceSize * FOOD_MILITARY_PROVISIONING_RATE * recruitmentBurdenMultiplier;

  return clamp(populationConsumption + militaryProvisioning, 0, Infinity);
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies one turn of food flow: records production and consumption, updates reserves,
 * and tracks consecutive empty turns for the famine failure condition.
 *
 * Returns a new FoodState (immutable update).
 */
export function applyFoodFlow(
  current: FoodState,
  production: number,
  consumption: number,
): FoodState {
  const netFlow = production - consumption;
  const newReserves = Math.max(0, current.reserves + netFlow);

  const atFamineThreshold = newReserves <= FOOD_FAMINE_THRESHOLD;
  const consecutiveTurnsEmpty = atFamineThreshold
    ? current.consecutiveTurnsEmpty + 1
    : 0;

  return {
    ...current,
    productionPerTurn: production,
    consumptionPerTurn: consumption,
    netFlowPerTurn: netFlow,
    reserves: newReserves,
    consecutiveTurnsEmpty,
  };
}

/**
 * Applies an agricultural knowledge efficiency bonus delta to FoodState.
 * Called when an Agricultural knowledge milestone is reached (§4.13).
 * Returns a new FoodState.
 */
export function applyAgriculturalKnowledgeBonus(
  current: FoodState,
  bonusDelta: number,
): FoodState {
  return {
    ...current,
    agriculturalEfficiencyBonus: clamp(
      current.agriculturalEfficiencyBonus + bonusDelta,
      0,
      Infinity,
    ),
  };
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Returns true when the famine failure condition is met:
 * food reserves have been at zero for the required number of consecutive turns (§4.2, §10.4).
 */
export function checkFamine(food: FoodState): boolean {
  return food.consecutiveTurnsEmpty >= FOOD_CONSECUTIVE_TURNS_FAMINE;
}

/**
 * Returns a 0–100 food security score for use in stability weighting (§4.7).
 *
 * - Score 100: reserves are at or above a healthy surplus threshold.
 * - Score 0: reserves are at or below zero.
 * - Transitions linearly between 0 and the surplus threshold.
 *
 * A healthy surplus is defined as enough to cover 10 turns of current consumption.
 */
export function computeFoodSecurityScore(food: FoodState): number {
  if (food.reserves <= 0) return 0;
  const surplusThreshold = Math.max(food.consumptionPerTurn * 10, 1);
  return clamp((food.reserves / surplusThreshold) * 100, 0, 100);
}

