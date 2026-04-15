// Population Dynamics — Expansion 1
// Birth/death rates, migration, class mobility, carrying capacity.
// Pure functions. No React imports. No player-facing text.

import type {
  ClassMobilityEvent,
  FoodState,
  KingdomCondition,
  MilitaryState,
  PolicyState,
  PopulationCardTrigger,
  PopulationDynamicsState,
  PopulationState,
  RegionState,
} from '../types';
import {
  ConditionSeverity,
  ConditionType,
  MilitaryRecruitmentStance,
  PopulationClass,
  RationingLevel,
  ReligiousTolerance,
  TradeOpenness,
} from '../types';
import {
  POP_BASE_BIRTH_RATE,
  POP_BASE_DEATH_RATE,
  POP_BIRTH_FOOD_SURPLUS_THRESHOLD,
  POP_BIRTH_FOOD_SURPLUS_BONUS,
  POP_BIRTH_FOOD_LOW_THRESHOLD,
  POP_BIRTH_FOOD_LOW_PENALTY,
  POP_BIRTH_FAITH_HIGH_THRESHOLD,
  POP_BIRTH_FAITH_HIGH_BONUS,
  POP_BIRTH_STABILITY_LOW_THRESHOLD,
  POP_BIRTH_STABILITY_LOW_PENALTY,
  POP_BIRTH_RATIONING_EMERGENCY_PENALTY,
  POP_DEATH_FAMINE_BONUS,
  POP_DEATH_DISEASE_BONUS_MILD,
  POP_DEATH_DISEASE_BONUS_MODERATE,
  POP_DEATH_DISEASE_BONUS_SEVERE,
  POP_DEATH_WAR_COMMONER_BONUS,
  POP_DEATH_WAR_MILITARY_BONUS,
  POP_DEATH_LOW_STABILITY_THRESHOLD,
  POP_DEATH_LOW_STABILITY_BONUS,
  POP_CLASS_BIRTH_MULTIPLIER,
  POP_MILITARY_DEATH_POSTURE_MULTIPLIER,
  POP_MIGRATION_FOOD_SECURITY_WEIGHT,
  POP_MIGRATION_TAX_BURDEN_WEIGHT,
  POP_MIGRATION_STABILITY_WEIGHT,
  POP_MIGRATION_WAR_PENALTY,
  POP_MIGRATION_TRADE_ENCOURAGED_BONUS,
  POP_MIGRATION_TRADE_OPEN_BONUS,
  POP_MIGRATION_TOLERANCE_SUPPRESSED_PENALTY,
  POP_MIGRATION_INFLOW_RATE,
  POP_MIGRATION_OUTFLOW_RATE,
  POP_MIGRATION_ADVISOR_THRESHOLD,
  POP_MIGRATION_PETITION_THRESHOLD,
  POP_MIGRATION_CRISIS_THRESHOLD,
  POP_MOBILITY_COMMONER_TO_MERCHANT_RATE,
  POP_MOBILITY_MERCHANT_TO_NOBILITY_RATE,
  POP_MOBILITY_COMMONER_TO_MILITARY_CONSCRIPT_RATE,
  POP_MOBILITY_COMMONER_TO_MILITARY_WARFOOTING_RATE,
  POP_MOBILITY_CLERGY_TO_COMMONER_RATE,
  POP_MOBILITY_MERCHANT_SAT_THRESHOLD,
  POP_MOBILITY_COMMONER_SAT_THRESHOLD,
  POP_MOBILITY_MERCHANT_TO_NOBLE_SAT,
  POP_MOBILITY_MERCHANT_TO_NOBLE_STABILITY,
  POP_MOBILITY_CLERGY_FAITH_THRESHOLD,
  POP_BASE_HOUSING_PER_REGION_DEV,
  POP_OVERCAPACITY_DEATH_RATE_PER_10PCT,
  POP_MOMENTUM_WINDOW_TURNS,
  POP_DYNAMICS_STARTING_BIRTH_MODIFIER,
  POP_DYNAMICS_STARTING_DEATH_MODIFIER,
  POP_DYNAMICS_STARTING_MIGRATION,
} from '../constants';

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function totalPopulation(population: PopulationState): number {
  return Object.values(population).reduce((sum, cls) => sum + cls.population, 0);
}

// ============================================================
// Initialization
// ============================================================

export function createInitialPopulationDynamicsState(
  population: PopulationState,
  regions: RegionState[],
): PopulationDynamicsState {
  return {
    birthRateModifier: POP_DYNAMICS_STARTING_BIRTH_MODIFIER,
    deathRateModifier: POP_DYNAMICS_STARTING_DEATH_MODIFIER,
    migrationPressure: POP_DYNAMICS_STARTING_MIGRATION,
    pendingMobility: [],
    housingCapacity: calculateHousingCapacity(regions),
    currentTotalPopulation: totalPopulation(population),
    recentBirthSurplus: 0,
    recentDeathSurplus: 0,
    consecutiveTurnsIntelNone: 0,
  };
}

// ============================================================
// Birth/Death Rate Modifiers
// ============================================================

export function calculateBirthRateModifier(
  food: FoodState,
  faithLevel: number,
  stability: number,
  rationingLevel: RationingLevel,
): number {
  let modifier = 1.0;

  if (food.reserves > POP_BIRTH_FOOD_SURPLUS_THRESHOLD) {
    modifier += POP_BIRTH_FOOD_SURPLUS_BONUS;
  }
  if (food.reserves < POP_BIRTH_FOOD_LOW_THRESHOLD) {
    modifier += POP_BIRTH_FOOD_LOW_PENALTY;
  }
  if (faithLevel > POP_BIRTH_FAITH_HIGH_THRESHOLD) {
    modifier += POP_BIRTH_FAITH_HIGH_BONUS;
  }
  if (stability < POP_BIRTH_STABILITY_LOW_THRESHOLD) {
    modifier += POP_BIRTH_STABILITY_LOW_PENALTY;
  }
  if (rationingLevel === RationingLevel.Emergency) {
    modifier += POP_BIRTH_RATIONING_EMERGENCY_PENALTY;
  }

  return clamp(modifier, 0.5, 1.5);
}

export function calculateDeathRateModifier(
  food: FoodState,
  activeConditions: KingdomCondition[],
  isAtWar: boolean,
  stability: number,
): number {
  let modifier = 1.0;

  // Famine
  if (food.reserves <= 0) {
    modifier += POP_DEATH_FAMINE_BONUS;
  }

  // Disease conditions (plague/pox) — use worst severity
  for (const cond of activeConditions) {
    if (cond.type === ConditionType.Plague || cond.type === ConditionType.Pox) {
      switch (cond.severity) {
        case ConditionSeverity.Severe:
          modifier += POP_DEATH_DISEASE_BONUS_SEVERE;
          break;
        case ConditionSeverity.Moderate:
          modifier += POP_DEATH_DISEASE_BONUS_MODERATE;
          break;
        case ConditionSeverity.Mild:
          modifier += POP_DEATH_DISEASE_BONUS_MILD;
          break;
      }
      break; // only apply worst active disease
    }
  }

  // War casualties increase death rate
  if (isAtWar) {
    modifier += POP_DEATH_WAR_COMMONER_BONUS;
  }

  // Civil violence from very low stability
  if (stability < POP_DEATH_LOW_STABILITY_THRESHOLD) {
    modifier += POP_DEATH_LOW_STABILITY_BONUS;
  }

  return clamp(modifier, 0.8, 2.0);
}

// ============================================================
// Per-Class Growth Calculation
// ============================================================

export function calculateClassGrowth(
  cls: PopulationClass,
  currentPop: number,
  birthRateModifier: number,
  deathRateModifier: number,
  migrationDelta: number,
  military: MilitaryState,
  isAtWar: boolean,
): { births: number; deaths: number; netGrowth: number } {
  const classBirthMult = POP_CLASS_BIRTH_MULTIPLIER[cls];

  // Military caste death rate scales with deployment posture
  let classDeathMult = 1.0;
  if (cls === PopulationClass.MilitaryCaste) {
    classDeathMult = POP_MILITARY_DEATH_POSTURE_MULTIPLIER[military.deploymentPosture];
    // Additional war bonus for military caste
    if (isAtWar) {
      classDeathMult += POP_DEATH_WAR_MILITARY_BONUS - POP_DEATH_WAR_COMMONER_BONUS;
    }
  }

  const births = Math.round(currentPop * POP_BASE_BIRTH_RATE * birthRateModifier * classBirthMult);
  const deaths = Math.round(currentPop * POP_BASE_DEATH_RATE * deathRateModifier * classDeathMult);
  const netGrowth = births - deaths + Math.round(migrationDelta);

  return { births, deaths, netGrowth };
}

// ============================================================
// Migration
// ============================================================

export function calculateMigrationPressure(
  food: FoodState,
  stability: number,
  policies: PolicyState,
  isAtWar: boolean,
): number {
  let pressure = 0;

  // Food security: positive when reserves are good, negative when low
  const foodScore = clamp((food.reserves - 75) / 75, -1, 1);
  pressure += foodScore * POP_MIGRATION_FOOD_SECURITY_WEIGHT;

  // Tax burden: low tax attracts, high/punitive repels
  switch (policies.taxationLevel) {
    case 'Low': pressure += POP_MIGRATION_TAX_BURDEN_WEIGHT; break;
    case 'High': pressure -= POP_MIGRATION_TAX_BURDEN_WEIGHT * 0.5; break;
    case 'Punitive': pressure -= POP_MIGRATION_TAX_BURDEN_WEIGHT; break;
  }

  // Stability
  const stabilityScore = clamp((stability - 50) / 50, -1, 1);
  pressure += stabilityScore * POP_MIGRATION_STABILITY_WEIGHT;

  // War
  if (isAtWar) {
    pressure += POP_MIGRATION_WAR_PENALTY;
  }

  // Trade openness
  if (policies.tradeOpenness === TradeOpenness.Encouraged) {
    pressure += POP_MIGRATION_TRADE_ENCOURAGED_BONUS;
  } else if (policies.tradeOpenness === TradeOpenness.Open) {
    pressure += POP_MIGRATION_TRADE_OPEN_BONUS;
  }

  // Religious tolerance
  if (policies.religiousTolerance === ReligiousTolerance.Suppressed) {
    pressure += POP_MIGRATION_TOLERANCE_SUPPRESSED_PENALTY;
  }

  return clamp(Math.round(pressure), -100, 100);
}

export function calculateMigrationDelta(
  cls: PopulationClass,
  currentPop: number,
  migrationPressure: number,
): number {
  // Only commoners and merchants are affected by migration
  if (cls !== PopulationClass.Commoners && cls !== PopulationClass.Merchants) {
    return 0;
  }

  if (migrationPressure > 0) {
    return Math.round(currentPop * POP_MIGRATION_INFLOW_RATE * (migrationPressure / 100));
  } else if (migrationPressure < 0) {
    return -Math.round(currentPop * POP_MIGRATION_OUTFLOW_RATE * (Math.abs(migrationPressure) / 100));
  }

  return 0;
}

// ============================================================
// Class Mobility
// ============================================================

export function resolveClassMobility(
  population: PopulationState,
  policies: PolicyState,
  stability: number,
  faithLevel: number,
): ClassMobilityEvent[] {
  const events: ClassMobilityEvent[] = [];

  // Commoners → Merchants: trade encouraged + merchant sat > 60 + commoner sat > 40
  if (
    policies.tradeOpenness === TradeOpenness.Encouraged &&
    population[PopulationClass.Merchants].satisfaction > POP_MOBILITY_MERCHANT_SAT_THRESHOLD &&
    population[PopulationClass.Commoners].satisfaction > POP_MOBILITY_COMMONER_SAT_THRESHOLD
  ) {
    const count = Math.round(
      population[PopulationClass.Commoners].population * POP_MOBILITY_COMMONER_TO_MERCHANT_RATE,
    );
    if (count > 0) {
      events.push({
        fromClass: PopulationClass.Commoners,
        toClass: PopulationClass.Merchants,
        count,
        reason: 'merchant_prosperity',
      });
    }
  }

  // Merchants → Nobility: merchant sat > 80 + stability > 60
  if (
    population[PopulationClass.Merchants].satisfaction > POP_MOBILITY_MERCHANT_TO_NOBLE_SAT &&
    stability > POP_MOBILITY_MERCHANT_TO_NOBLE_STABILITY
  ) {
    const count = Math.round(
      population[PopulationClass.Merchants].population * POP_MOBILITY_MERCHANT_TO_NOBILITY_RATE,
    );
    if (count > 0) {
      events.push({
        fromClass: PopulationClass.Merchants,
        toClass: PopulationClass.Nobility,
        count,
        reason: 'noble_purchase',
      });
    }
  }

  // Commoners → Military Caste: conscription
  if (policies.militaryRecruitmentStance === MilitaryRecruitmentStance.Conscript) {
    const count = Math.round(
      population[PopulationClass.Commoners].population * POP_MOBILITY_COMMONER_TO_MILITARY_CONSCRIPT_RATE,
    );
    if (count > 0) {
      events.push({
        fromClass: PopulationClass.Commoners,
        toClass: PopulationClass.MilitaryCaste,
        count,
        reason: 'conscription',
      });
    }
  } else if (policies.militaryRecruitmentStance === MilitaryRecruitmentStance.WarFooting) {
    const count = Math.round(
      population[PopulationClass.Commoners].population * POP_MOBILITY_COMMONER_TO_MILITARY_WARFOOTING_RATE,
    );
    if (count > 0) {
      events.push({
        fromClass: PopulationClass.Commoners,
        toClass: PopulationClass.MilitaryCaste,
        count,
        reason: 'warfooting_conscription',
      });
    }
  }

  // Clergy → Commoners: religious tolerance Suppressed AND faith < 30
  if (
    policies.religiousTolerance === ReligiousTolerance.Suppressed &&
    faithLevel < POP_MOBILITY_CLERGY_FAITH_THRESHOLD
  ) {
    const count = Math.round(
      population[PopulationClass.Clergy].population * POP_MOBILITY_CLERGY_TO_COMMONER_RATE,
    );
    if (count > 0) {
      events.push({
        fromClass: PopulationClass.Clergy,
        toClass: PopulationClass.Commoners,
        count,
        reason: 'clergy_defrocking',
      });
    }
  }

  return events;
}

export function applyClassMobility(
  population: PopulationState,
  events: ClassMobilityEvent[],
): PopulationState {
  // Build delta map
  const deltas: Record<PopulationClass, number> = {
    [PopulationClass.Nobility]: 0,
    [PopulationClass.Clergy]: 0,
    [PopulationClass.Merchants]: 0,
    [PopulationClass.Commoners]: 0,
    [PopulationClass.MilitaryCaste]: 0,
  };

  for (const evt of events) {
    deltas[evt.fromClass] -= evt.count;
    deltas[evt.toClass] += evt.count;
  }

  const result = { ...population };
  for (const cls of Object.values(PopulationClass)) {
    if (deltas[cls] !== 0) {
      result[cls] = {
        ...result[cls],
        population: Math.max(1, result[cls].population + deltas[cls]),
      };
    }
  }
  return result;
}

// ============================================================
// Carrying Capacity
// ============================================================

export function calculateHousingCapacity(
  regions: RegionState[],
): number {
  let capacity = 0;
  for (const region of regions) {
    if (!region.isOccupied) {
      capacity += region.developmentLevel * POP_BASE_HOUSING_PER_REGION_DEV;
    }
  }
  return capacity;
}

export function getOvercapacityFraction(
  totalPop: number,
  housingCapacity: number,
): number {
  if (housingCapacity <= 0 || totalPop <= housingCapacity) return 0;
  return (totalPop - housingCapacity) / housingCapacity;
}

// ============================================================
// Main Phase 4b Orchestrator
// ============================================================

export function resolvePopulationGrowth(
  population: PopulationState,
  dynamics: PopulationDynamicsState,
  food: FoodState,
  faithLevel: number,
  stability: number,
  policies: PolicyState,
  military: MilitaryState,
  activeConditions: KingdomCondition[],
  regions: RegionState[],
  isAtWar: boolean,
): {
  population: PopulationState;
  dynamics: PopulationDynamicsState;
  mobilityEvents: ClassMobilityEvent[];
  populationCardTriggers: PopulationCardTrigger[];
} {
  const cardTriggers: PopulationCardTrigger[] = [];

  // 1. Calculate kingdom-wide modifiers
  const birthRateModifier = calculateBirthRateModifier(food, faithLevel, stability, policies.rationingLevel);
  const deathRateModifier = calculateDeathRateModifier(food, activeConditions, isAtWar, stability);

  // 2. Calculate migration pressure
  const migrationPressure = calculateMigrationPressure(food, stability, policies, isAtWar);

  // 3. Calculate housing capacity
  const housingCapacity = calculateHousingCapacity(regions);

  // 4. Apply overcapacity penalty to death rate
  const currentTotal = totalPopulation(population);
  const overcapacity = getOvercapacityFraction(currentTotal, housingCapacity);
  const overcapacityDeathBonus = Math.floor(overcapacity * 10) * POP_OVERCAPACITY_DEATH_RATE_PER_10PCT;
  const effectiveDeathModifier = clamp(deathRateModifier + overcapacityDeathBonus, 0.8, 2.0);

  // 5. Apply per-class growth
  let updatedPopulation = { ...population };
  let totalBirths = 0;
  let totalDeaths = 0;

  for (const cls of Object.values(PopulationClass)) {
    const migDelta = calculateMigrationDelta(cls, updatedPopulation[cls].population, migrationPressure);
    const growth = calculateClassGrowth(
      cls,
      updatedPopulation[cls].population,
      birthRateModifier,
      effectiveDeathModifier,
      migDelta,
      military,
      isAtWar,
    );

    totalBirths += growth.births;
    totalDeaths += growth.deaths;

    updatedPopulation = {
      ...updatedPopulation,
      [cls]: {
        ...updatedPopulation[cls],
        population: Math.max(1, updatedPopulation[cls].population + growth.netGrowth),
      },
    };
  }

  // 6. Resolve class mobility
  const mobilityEvents = resolveClassMobility(updatedPopulation, policies, stability, faithLevel);
  if (mobilityEvents.length > 0) {
    updatedPopulation = applyClassMobility(updatedPopulation, mobilityEvents);
  }

  // 7. Generate card triggers
  if (migrationPressure >= POP_MIGRATION_ADVISOR_THRESHOLD) {
    cardTriggers.push({ type: 'migration_inflow', magnitude: migrationPressure });
  } else if (migrationPressure <= POP_MIGRATION_CRISIS_THRESHOLD) {
    cardTriggers.push({ type: 'migration_crisis', magnitude: Math.abs(migrationPressure) });
  } else if (migrationPressure <= POP_MIGRATION_PETITION_THRESHOLD) {
    cardTriggers.push({ type: 'migration_petition', magnitude: Math.abs(migrationPressure) });
  }

  if (overcapacity > 0.2) {
    cardTriggers.push({ type: 'overcrowding_crisis', magnitude: overcapacity * 100 });
  } else if (overcapacity > 0.1) {
    cardTriggers.push({ type: 'overcrowding_petition', magnitude: overcapacity * 100 });
  }

  for (const evt of mobilityEvents) {
    if (evt.reason === 'noble_purchase' && evt.count > 0) {
      cardTriggers.push({ type: 'merchant_titles', magnitude: evt.count });
    }
    if ((evt.reason === 'conscription' || evt.reason === 'warfooting_conscription') && evt.count > 100) {
      cardTriggers.push({ type: 'conscription_harvest', magnitude: evt.count });
    }
    if (evt.reason === 'clergy_defrocking' && evt.count > 0) {
      cardTriggers.push({ type: 'clergy_exodus', magnitude: evt.count });
    }
  }

  const netBirthSurplus = totalBirths - totalDeaths;
  if (netBirthSurplus > 200) {
    cardTriggers.push({ type: 'population_boom', magnitude: netBirthSurplus });
  } else if (netBirthSurplus < -100) {
    cardTriggers.push({ type: 'population_decline', magnitude: Math.abs(netBirthSurplus) });
  }

  // 8. Update dynamics state with rolling momentum
  const newTotalPopulation = totalPopulation(updatedPopulation);
  const birthSurplusDelta = totalBirths;
  const deathSurplusDelta = totalDeaths;

  // Approximate rolling window: decay by 1/N each turn, add new delta
  const decayFactor = 1 - (1 / POP_MOMENTUM_WINDOW_TURNS);
  const newRecentBirthSurplus = Math.round(dynamics.recentBirthSurplus * decayFactor + birthSurplusDelta);
  const newRecentDeathSurplus = Math.round(dynamics.recentDeathSurplus * decayFactor + deathSurplusDelta);

  const updatedDynamics: PopulationDynamicsState = {
    birthRateModifier,
    deathRateModifier: effectiveDeathModifier,
    migrationPressure,
    pendingMobility: mobilityEvents,
    housingCapacity,
    currentTotalPopulation: newTotalPopulation,
    recentBirthSurplus: newRecentBirthSurplus,
    recentDeathSurplus: newRecentDeathSurplus,
    consecutiveTurnsIntelNone: dynamics.consecutiveTurnsIntelNone,
  };

  return {
    population: updatedPopulation,
    dynamics: updatedDynamics,
    mobilityEvents,
    populationCardTriggers: cardTriggers,
  };
}
