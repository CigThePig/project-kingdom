// Environment & Health System — Expansion 3
// Condition lifecycle, weather oscillation, disease tracking.
// Pure functions. No React imports. No player-facing text.

import type {
  ConditionCardTrigger,
  ConditionEffect,
  EnvironmentState,
  FaithCultureState,
  FoodState,
  KingdomCondition,
  KnowledgeState,
  MilitaryState,
  PolicyState,
  PopulationState,
  RegionState,
  Season,
} from '../types';
import {
  ConditionSeverity,
  ConditionType,
  KnowledgeBranch,
  PopulationClass,
  ReligiousOrderType,
  TradeOpenness,
} from '../types';
import {
  getSocialConditionEscalatedEffects,
} from './social-fabric';
import {
  WEATHER_SEVERITY_MIN,
  WEATHER_SEVERITY_MAX,
  WEATHER_STARTING_SEVERITY,
  WEATHER_SEASONAL_BIAS,
  WEATHER_RANDOM_SWING,
  WEATHER_MEAN_REVERSION,
  DROUGHT_ACCUMULATION_RATE,
  DROUGHT_DECAY_RATE,
  DROUGHT_MILD_THRESHOLD,
  DROUGHT_MODERATE_THRESHOLD,
  DROUGHT_SEVERE_THRESHOLD,
  DROUGHT_FOOD_MODIFIER_MILD,
  DROUGHT_FOOD_MODIFIER_MODERATE,
  DROUGHT_FOOD_MODIFIER_SEVERE,
  DROUGHT_COMMONER_SAT_MODERATE,
  DROUGHT_COMMONER_SAT_SEVERE,
  FLOOD_RISK_ACCUMULATION_RATE,
  FLOOD_RISK_DECAY_RATE,
  FLOOD_TRIGGER_THRESHOLD,
  FLOOD_FOOD_RESERVE_DAMAGE,
  FLOOD_NEXT_SEASON_FOOD_BONUS,
  HARSH_WINTER_WEATHER_THRESHOLD,
  HARSH_WINTER_FOOD_CONSUMPTION_MULTIPLIER,
  HARSH_WINTER_READINESS_DECAY_MULTIPLIER,
  BOUNTIFUL_HARVEST_WEATHER_THRESHOLD,
  BOUNTIFUL_HARVEST_FOOD_MODIFIER,
  BOUNTIFUL_HARVEST_COMMONER_SAT_BONUS,
  BOUNTIFUL_HARVEST_MERCHANT_SAT_BONUS,
  DISEASE_VULNERABILITY_STARTING,
  DISEASE_VULNERABILITY_MAX,
  DISEASE_FAMINE_ACCUMULATION,
  DISEASE_WAR_ACCUMULATION,
  DISEASE_LOW_SANITATION_ACCUMULATION,
  DISEASE_TRADE_OPENNESS_ACCUMULATION,
  DISEASE_HEALING_ORDER_REDUCTION,
  DISEASE_CIVIC_MILESTONE_REDUCTION,
  DISEASE_NATURAL_DECAY,
  PLAGUE_TRIGGER_VULNERABILITY_THRESHOLD,
  PLAGUE_BASE_PROBABILITY_FACTOR,
  PLAGUE_MEMORY_IMMUNITY_TURNS,
  PLAGUE_DURATION_MILD,
  PLAGUE_DURATION_MODERATE,
  PLAGUE_DURATION_SEVERE,
  PLAGUE_STABILITY_PENALTY_MILD,
  PLAGUE_STABILITY_PENALTY_MODERATE,
  PLAGUE_STABILITY_PENALTY_SEVERE,
  SANITATION_STARTING,
  SANITATION_MIN,
  SANITATION_MAX,
  SANITATION_NATURAL_DECAY,
  CONDITION_ESCALATION_CHECK_TURNS,
  CONDITION_ESCALATION_PROBABILITY,
} from '../constants';

// ============================================================
// Condition Modifiers — consumed by downstream system calculations
// ============================================================

export interface ConditionModifiers {
  foodProductionMultiplier: number;
  foodConsumptionMultiplier: number;
  tradeIncomeMultiplier: number;
  militaryReadinessDecayMultiplier: number;
  stabilityDelta: number;
  commonerSatisfactionDelta: number;
  merchantSatisfactionDelta: number;
  constructionHalted: boolean;
  // Social fabric (Expansion 4) — consumed by downstream phases
  treasuryIncomeMultiplier: number;
  constructionCostMultiplier: number;
  counterIntelligenceDelta: number;
  nobilitySatisfactionDelta: number;
  clergySatisfactionDelta: number;
  militaryCasteSatisfactionDelta: number;
}

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomInRange(random: number, min: number, max: number): number {
  return min + random * (max - min);
}

let conditionIdCounter = 0;

function generateConditionId(type: string, turn: number): string {
  conditionIdCounter++;
  return `cond_${type}_t${turn}_${conditionIdCounter}`;
}

// ============================================================
// Initialization
// ============================================================

export function createInitialEnvironmentState(): EnvironmentState {
  return {
    activeConditions: [],
    weatherSeverity: WEATHER_STARTING_SEVERITY,
    droughtAccumulator: 0,
    floodRisk: 0,
    diseaseVulnerability: DISEASE_VULNERABILITY_STARTING,
    sanitationLevel: SANITATION_STARTING,
    plagueMemoryTurns: 0,
  };
}

// ============================================================
// Weather System
// ============================================================

export function updateWeatherSeverity(
  currentSeverity: number,
  season: Season,
  random: number,
): number {
  const bias = WEATHER_SEASONAL_BIAS[season];
  const randomSwing = (random * 2 - 1) * WEATHER_RANDOM_SWING; // -SWING to +SWING
  const meanReversion = -WEATHER_MEAN_REVERSION * currentSeverity;
  const delta = bias + randomSwing + meanReversion;
  return clamp(Math.round(currentSeverity + delta), WEATHER_SEVERITY_MIN, WEATHER_SEVERITY_MAX);
}

// ============================================================
// Accumulator Updates
// ============================================================

export function updateDroughtAccumulator(
  current: number,
  weatherSeverity: number,
  season: Season,
): number {
  // Drought risk accumulates when weather is harsh (negative) during Summer/Autumn
  const isDroughtWeather = weatherSeverity < -10 &&
    (season === 'Summer' as Season || season === 'Autumn' as Season);

  if (isDroughtWeather) {
    return clamp(current + DROUGHT_ACCUMULATION_RATE, 0, 100);
  }
  return clamp(current - DROUGHT_DECAY_RATE, 0, 100);
}

export function updateFloodRisk(
  current: number,
  weatherSeverity: number,
  season: Season,
): number {
  // Flood risk accumulates when weather is very wet (positive) during Spring
  const isFloodWeather = weatherSeverity > 15 && season === 'Spring' as Season;

  if (isFloodWeather) {
    return clamp(current + FLOOD_RISK_ACCUMULATION_RATE, 0, 100);
  }
  return clamp(current - FLOOD_RISK_DECAY_RATE, 0, 100);
}

export function updateDiseaseVulnerability(
  current: number,
  food: FoodState,
  _population: PopulationState,
  policies: PolicyState,
  knowledge: KnowledgeState,
  sanitationLevel: number,
  hasHealingOrder: boolean,
  isAtWar: boolean,
): number {
  let delta = 0;

  // Famine increases vulnerability
  if (food.reserves <= 0) {
    delta += DISEASE_FAMINE_ACCUMULATION;
  }

  // War increases vulnerability
  if (isAtWar) {
    delta += DISEASE_WAR_ACCUMULATION;
  }

  // Low sanitation increases vulnerability
  if (sanitationLevel < 40) {
    delta += DISEASE_LOW_SANITATION_ACCUMULATION;
  }

  // Trade openness brings foreign diseases
  if (policies.tradeOpenness === TradeOpenness.Encouraged) {
    delta += DISEASE_TRADE_OPENNESS_ACCUMULATION;
  }

  // Protective factors
  if (hasHealingOrder) {
    delta -= DISEASE_HEALING_ORDER_REDUCTION;
  }

  // Civic knowledge milestones reduce vulnerability
  const civicMilestones = knowledge.branches[KnowledgeBranch.Civic].currentMilestoneIndex;
  if (civicMilestones > 0) {
    delta -= DISEASE_CIVIC_MILESTONE_REDUCTION * civicMilestones;
  }

  // Natural decay
  delta -= DISEASE_NATURAL_DECAY;

  return clamp(current + delta, 0, DISEASE_VULNERABILITY_MAX);
}

// ============================================================
// Condition Emergence
// ============================================================

function getDroughtSeverity(accumulator: number): ConditionSeverity | null {
  if (accumulator >= DROUGHT_SEVERE_THRESHOLD) return ConditionSeverity.Severe;
  if (accumulator >= DROUGHT_MODERATE_THRESHOLD) return ConditionSeverity.Moderate;
  if (accumulator >= DROUGHT_MILD_THRESHOLD) return ConditionSeverity.Mild;
  return null;
}

function buildDroughtEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [];
  switch (severity) {
    case ConditionSeverity.Mild:
      effects.push({ target: 'food.production', operator: 'multiply', value: DROUGHT_FOOD_MODIFIER_MILD });
      break;
    case ConditionSeverity.Moderate:
      effects.push({ target: 'food.production', operator: 'multiply', value: DROUGHT_FOOD_MODIFIER_MODERATE });
      effects.push({ target: 'commoner.satisfaction', operator: 'add', value: DROUGHT_COMMONER_SAT_MODERATE });
      break;
    case ConditionSeverity.Severe:
      effects.push({ target: 'food.production', operator: 'multiply', value: DROUGHT_FOOD_MODIFIER_SEVERE });
      effects.push({ target: 'commoner.satisfaction', operator: 'add', value: DROUGHT_COMMONER_SAT_SEVERE });
      effects.push({ target: 'trade.income', operator: 'multiply', value: 0.85 });
      break;
  }
  return effects;
}

function buildPlagueEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [];
  switch (severity) {
    case ConditionSeverity.Mild:
      effects.push({ target: 'stability', operator: 'add', value: PLAGUE_STABILITY_PENALTY_MILD });
      break;
    case ConditionSeverity.Moderate:
      effects.push({ target: 'stability', operator: 'add', value: PLAGUE_STABILITY_PENALTY_MODERATE });
      effects.push({ target: 'commoner.satisfaction', operator: 'add', value: -3 });
      break;
    case ConditionSeverity.Severe:
      effects.push({ target: 'stability', operator: 'add', value: PLAGUE_STABILITY_PENALTY_SEVERE });
      effects.push({ target: 'commoner.satisfaction', operator: 'add', value: -5 });
      effects.push({ target: 'trade.income', operator: 'multiply', value: 0.70 });
      break;
  }
  return effects;
}

function getPlagueDuration(severity: ConditionSeverity, random: number): number {
  let range: readonly [number, number];
  switch (severity) {
    case ConditionSeverity.Mild: range = PLAGUE_DURATION_MILD; break;
    case ConditionSeverity.Moderate: range = PLAGUE_DURATION_MODERATE; break;
    case ConditionSeverity.Severe: range = PLAGUE_DURATION_SEVERE; break;
  }
  return Math.round(randomInRange(random, range[0], range[1]));
}

export function checkConditionEmergence(
  environment: EnvironmentState,
  season: Season,
  food: FoodState,
  turnNumber: number,
  random: number,
): KingdomCondition[] {
  const newConditions: KingdomCondition[] = [];
  const existingTypes = new Set(environment.activeConditions.map(c => c.type));

  // --- Drought ---
  if (!existingTypes.has('Drought' as ConditionType)) {
    const severity = getDroughtSeverity(environment.droughtAccumulator);
    if (severity !== null) {
      newConditions.push({
        id: generateConditionId('drought', turnNumber),
        type: 'Drought' as ConditionType,
        severity,
        turnsActive: 0,
        turnsRemaining: null, // resolves when drought accumulator drops
        systemEffects: buildDroughtEffects(severity),
        regionId: null,
        canEscalate: severity !== ConditionSeverity.Severe,
        escalatesTo: 'Drought' as ConditionType,
      });
    }
  }

  // --- Flood ---
  if (!existingTypes.has('Flood' as ConditionType) && environment.floodRisk >= FLOOD_TRIGGER_THRESHOLD) {
    newConditions.push({
      id: generateConditionId('flood', turnNumber),
      type: 'Flood' as ConditionType,
      severity: ConditionSeverity.Moderate,
      turnsActive: 0,
      turnsRemaining: 2,
      systemEffects: [
        { target: 'food.reserves', operator: 'multiply', value: 1.0 - FLOOD_FOOD_RESERVE_DAMAGE },
        { target: 'food.production', operator: 'add', value: FLOOD_NEXT_SEASON_FOOD_BONUS },
      ],
      regionId: null,
      canEscalate: false,
      escalatesTo: null,
    });
  }

  // --- Harsh Winter ---
  if (!existingTypes.has('HarshWinter' as ConditionType) &&
      season === 'Winter' as Season &&
      environment.weatherSeverity < HARSH_WINTER_WEATHER_THRESHOLD) {
    newConditions.push({
      id: generateConditionId('harsh_winter', turnNumber),
      type: 'HarshWinter' as ConditionType,
      severity: ConditionSeverity.Moderate,
      turnsActive: 0,
      turnsRemaining: 3, // lasts rest of winter
      systemEffects: [
        { target: 'food.consumption', operator: 'multiply', value: HARSH_WINTER_FOOD_CONSUMPTION_MULTIPLIER },
        { target: 'military.readinessDecay', operator: 'multiply', value: HARSH_WINTER_READINESS_DECAY_MULTIPLIER },
        { target: 'construction.halted', operator: 'add', value: 1 },
      ],
      regionId: null,
      canEscalate: false,
      escalatesTo: null,
    });
  }

  // --- Bountiful Harvest ---
  if (!existingTypes.has('BountifulHarvest' as ConditionType) &&
      !existingTypes.has('Drought' as ConditionType) &&
      (season === 'Summer' as Season || season === 'Autumn' as Season) &&
      environment.weatherSeverity > BOUNTIFUL_HARVEST_WEATHER_THRESHOLD) {
    newConditions.push({
      id: generateConditionId('bountiful_harvest', turnNumber),
      type: 'BountifulHarvest' as ConditionType,
      severity: ConditionSeverity.Mild,
      turnsActive: 0,
      turnsRemaining: 2,
      systemEffects: [
        { target: 'food.production', operator: 'multiply', value: BOUNTIFUL_HARVEST_FOOD_MODIFIER },
        { target: 'commoner.satisfaction', operator: 'add', value: BOUNTIFUL_HARVEST_COMMONER_SAT_BONUS },
        { target: 'merchant.satisfaction', operator: 'add', value: BOUNTIFUL_HARVEST_MERCHANT_SAT_BONUS },
      ],
      regionId: null,
      canEscalate: false,
      escalatesTo: null,
    });
  }

  // --- Plague ---
  if (!existingTypes.has('Plague' as ConditionType) &&
      !existingTypes.has('Pox' as ConditionType) &&
      environment.diseaseVulnerability > PLAGUE_TRIGGER_VULNERABILITY_THRESHOLD &&
      environment.plagueMemoryTurns > PLAGUE_MEMORY_IMMUNITY_TURNS) {
    const chance = (environment.diseaseVulnerability - 40) * PLAGUE_BASE_PROBABILITY_FACTOR;
    if (random < chance) {
      // Severity based on vulnerability level
      let severity: ConditionSeverity;
      let type: ConditionType;
      if (environment.diseaseVulnerability > 85) {
        severity = ConditionSeverity.Severe;
        type = 'Plague' as ConditionType;
      } else if (environment.diseaseVulnerability > 70) {
        severity = ConditionSeverity.Moderate;
        type = 'Plague' as ConditionType;
      } else {
        severity = ConditionSeverity.Mild;
        type = 'Pox' as ConditionType;
      }

      newConditions.push({
        id: generateConditionId('plague', turnNumber),
        type,
        severity,
        turnsActive: 0,
        turnsRemaining: getPlagueDuration(severity, random),
        systemEffects: buildPlagueEffects(severity),
        regionId: null,
        canEscalate: severity !== ConditionSeverity.Severe,
        escalatesTo: 'Plague' as ConditionType,
      });
    }
  }

  // --- Famine (condition) ---
  if (!existingTypes.has('Famine' as ConditionType) && food.consecutiveTurnsEmpty >= 2) {
    newConditions.push({
      id: generateConditionId('famine', turnNumber),
      type: 'Famine' as ConditionType,
      severity: food.consecutiveTurnsEmpty >= 3 ? ConditionSeverity.Severe : ConditionSeverity.Moderate,
      turnsActive: 0,
      turnsRemaining: null, // resolves when food reserves recover
      systemEffects: [
        { target: 'stability', operator: 'add', value: -5 },
        { target: 'commoner.satisfaction', operator: 'add', value: -4 },
      ],
      regionId: null,
      canEscalate: true,
      escalatesTo: 'Famine' as ConditionType,
    });
  }

  return newConditions;
}

// ============================================================
// Condition Lifecycle
// ============================================================

export function tickExistingConditions(
  conditions: KingdomCondition[],
  environment: EnvironmentState,
  food: FoodState,
  population?: PopulationState,
  stability?: number,
  espionage?: { counterIntelligenceLevel: number },
): { active: KingdomCondition[]; resolved: KingdomCondition[] } {
  const active: KingdomCondition[] = [];
  const resolved: KingdomCondition[] = [];

  for (const condition of conditions) {
    const updated: KingdomCondition = {
      ...condition,
      turnsActive: condition.turnsActive + 1,
      turnsRemaining: condition.turnsRemaining !== null
        ? condition.turnsRemaining - 1
        : null,
    };

    // Check natural resolution for timer-based conditions
    if (updated.turnsRemaining !== null && updated.turnsRemaining <= 0) {
      resolved.push(updated);
      continue;
    }

    // Check system-threshold resolution for non-timer conditions
    if (updated.turnsRemaining === null) {
      if (updated.type === 'Drought' as ConditionType &&
          environment.droughtAccumulator < DROUGHT_MILD_THRESHOLD) {
        resolved.push(updated);
        continue;
      }
      if (updated.type === 'Famine' as ConditionType && food.reserves > 0) {
        resolved.push(updated);
        continue;
      }

      // Social condition resolution (Expansion 4)
      if (stability !== undefined) {
        // Banditry resolves when stability recovers above 50
        if (updated.type === ConditionType.Banditry && stability > 50) {
          resolved.push(updated);
          continue;
        }
        // Unrest resolves when stability > 45 and no class below 25
        if (updated.type === ConditionType.Unrest && stability > 45 && population) {
          const allAbove25 = Object.values(PopulationClass).every(
            cls => population[cls].satisfaction >= 25,
          );
          if (allAbove25) {
            resolved.push(updated);
            continue;
          }
        }
      }
      // CriminalUnderworld resolves when counter-intelligence is high
      if (updated.type === ConditionType.CriminalUnderworld &&
          espionage && espionage.counterIntelligenceLevel >= 50) {
        resolved.push(updated);
        continue;
      }
      // Corruption does NOT auto-resolve — requires player decree action
    }

    active.push(updated);
  }

  return { active, resolved };
}

export function checkConditionEscalation(
  condition: KingdomCondition,
  random: number,
): KingdomCondition | null {
  if (!condition.canEscalate) return null;
  if (condition.turnsActive < CONDITION_ESCALATION_CHECK_TURNS) return null;
  if (random >= CONDITION_ESCALATION_PROBABILITY) return null;

  // Determine next severity
  let nextSeverity: ConditionSeverity;
  switch (condition.severity) {
    case ConditionSeverity.Mild:
      nextSeverity = ConditionSeverity.Moderate;
      break;
    case ConditionSeverity.Moderate:
      nextSeverity = ConditionSeverity.Severe;
      break;
    case ConditionSeverity.Severe:
      return null; // already at max
  }

  // Rebuild effects for new severity
  let newEffects: ConditionEffect[];
  switch (condition.type) {
    case 'Drought' as ConditionType:
      newEffects = buildDroughtEffects(nextSeverity);
      break;
    case 'Plague' as ConditionType:
    case 'Pox' as ConditionType:
      newEffects = buildPlagueEffects(nextSeverity);
      break;
    default: {
      // Social fabric conditions (Expansion 4) — delegate to social-fabric module
      const socialEffects = getSocialConditionEscalatedEffects(condition.type, nextSeverity);
      newEffects = socialEffects ?? condition.systemEffects;
      break;
    }
  }

  return {
    ...condition,
    severity: nextSeverity,
    systemEffects: newEffects,
    canEscalate: nextSeverity !== ConditionSeverity.Severe,
    // Pox escalates to Plague
    type: condition.type === ('Pox' as ConditionType) ? 'Plague' as ConditionType : condition.type,
  };
}

// ============================================================
// Condition Modifiers Aggregation
// ============================================================

export function aggregateConditionEffects(
  conditions: KingdomCondition[],
): ConditionModifiers {
  const modifiers: ConditionModifiers = {
    foodProductionMultiplier: 1.0,
    foodConsumptionMultiplier: 1.0,
    tradeIncomeMultiplier: 1.0,
    militaryReadinessDecayMultiplier: 1.0,
    stabilityDelta: 0,
    commonerSatisfactionDelta: 0,
    merchantSatisfactionDelta: 0,
    constructionHalted: false,
    treasuryIncomeMultiplier: 1.0,
    constructionCostMultiplier: 1.0,
    counterIntelligenceDelta: 0,
    nobilitySatisfactionDelta: 0,
    clergySatisfactionDelta: 0,
    militaryCasteSatisfactionDelta: 0,
  };

  for (const condition of conditions) {
    for (const effect of condition.systemEffects) {
      switch (effect.target) {
        case 'food.production':
          if (effect.operator === 'multiply') modifiers.foodProductionMultiplier *= effect.value;
          break;
        case 'food.consumption':
          if (effect.operator === 'multiply') modifiers.foodConsumptionMultiplier *= effect.value;
          break;
        case 'food.reserves':
          // One-time effects are handled in the tick, not as ongoing modifiers
          break;
        case 'trade.income':
          if (effect.operator === 'multiply') modifiers.tradeIncomeMultiplier *= effect.value;
          break;
        case 'military.readinessDecay':
          if (effect.operator === 'multiply') modifiers.militaryReadinessDecayMultiplier *= effect.value;
          break;
        case 'stability':
          if (effect.operator === 'add') modifiers.stabilityDelta += effect.value;
          break;
        case 'commoner.satisfaction':
          if (effect.operator === 'add') modifiers.commonerSatisfactionDelta += effect.value;
          break;
        case 'merchant.satisfaction':
          if (effect.operator === 'add') modifiers.merchantSatisfactionDelta += effect.value;
          break;
        case 'construction.halted':
          modifiers.constructionHalted = true;
          break;
        // Social fabric condition targets (Expansion 4)
        case 'treasury.income':
          if (effect.operator === 'multiply') modifiers.treasuryIncomeMultiplier *= effect.value;
          break;
        case 'construction.cost':
          if (effect.operator === 'multiply') modifiers.constructionCostMultiplier *= effect.value;
          break;
        case 'espionage.counterIntel':
          if (effect.operator === 'add') modifiers.counterIntelligenceDelta += effect.value;
          break;
        case 'nobility.satisfaction':
          if (effect.operator === 'add') modifiers.nobilitySatisfactionDelta += effect.value;
          break;
        case 'clergy.satisfaction':
          if (effect.operator === 'add') modifiers.clergySatisfactionDelta += effect.value;
          break;
        case 'militaryCaste.satisfaction':
          if (effect.operator === 'add') modifiers.militaryCasteSatisfactionDelta += effect.value;
          break;
      }
    }
  }

  return modifiers;
}

// ============================================================
// Main Phase 0b Function
// ============================================================

export function resolveEnvironmentTick(
  environment: EnvironmentState,
  season: Season,
  food: FoodState,
  population: PopulationState,
  _regions: RegionState[],
  _military: MilitaryState,
  policies: PolicyState,
  knowledge: KnowledgeState,
  faithCulture: FaithCultureState,
  activeConflictCount: number,
  turnNumber: number,
  random: number,
  stability?: number,
  espionage?: { counterIntelligenceLevel: number },
): {
  environment: EnvironmentState;
  conditionCards: ConditionCardTrigger[];
  modifiers: ConditionModifiers;
} {
  const conditionCards: ConditionCardTrigger[] = [];

  // 1. Update weather
  const newWeather = updateWeatherSeverity(environment.weatherSeverity, season, random);

  // 2. Update accumulators
  const newDrought = updateDroughtAccumulator(environment.droughtAccumulator, newWeather, season);
  const newFloodRisk = updateFloodRisk(environment.floodRisk, newWeather, season);

  const hasHealingOrder = faithCulture.activeOrders.some(
    o => o.isActive && o.type === ReligiousOrderType.Healing,
  );
  const isAtWar = activeConflictCount > 0;

  const newDiseaseVuln = updateDiseaseVulnerability(
    environment.diseaseVulnerability,
    food, population, policies, knowledge,
    environment.sanitationLevel, hasHealingOrder, isAtWar,
  );

  // Sanitation decays slowly without civic investment
  const civicMilestones = knowledge.branches[KnowledgeBranch.Civic].currentMilestoneIndex;
  const sanitationChange = civicMilestones > 0 ? civicMilestones : -SANITATION_NATURAL_DECAY;
  const newSanitation = clamp(
    environment.sanitationLevel + sanitationChange,
    SANITATION_MIN,
    SANITATION_MAX,
  );

  // Plague memory increments each turn
  const newPlagueMemory = environment.plagueMemoryTurns + 1;

  // Build intermediate state for condition checks
  const intermediateEnv: EnvironmentState = {
    activeConditions: environment.activeConditions,
    weatherSeverity: newWeather,
    droughtAccumulator: newDrought,
    floodRisk: newFloodRisk,
    diseaseVulnerability: newDiseaseVuln,
    sanitationLevel: newSanitation,
    plagueMemoryTurns: newPlagueMemory,
  };

  // 3. Tick existing conditions (includes social condition resolution checks)
  const { active: tickedConditions, resolved } = tickExistingConditions(
    intermediateEnv.activeConditions, intermediateEnv, food,
    population, stability, espionage,
  );

  // Generate resolution card triggers
  for (const cond of resolved) {
    conditionCards.push({
      conditionId: cond.id,
      conditionType: cond.type,
      severity: cond.severity,
      triggerType: 'resolution',
      regionId: cond.regionId,
    });
  }

  // 4. Check escalation for eligible conditions
  // Use second random seed derived from the first to avoid correlation
  const escalationRandom = (random * 7.13) % 1;
  const escalatedConditions: KingdomCondition[] = [];
  const nonEscalated: KingdomCondition[] = [];

  for (const condition of tickedConditions) {
    const escalated = checkConditionEscalation(condition, escalationRandom);
    if (escalated) {
      escalatedConditions.push(escalated);
      conditionCards.push({
        conditionId: escalated.id,
        conditionType: escalated.type,
        severity: escalated.severity,
        triggerType: 'escalation',
        regionId: escalated.regionId,
      });
    } else {
      nonEscalated.push(condition);
    }
  }

  const afterEscalation = [...nonEscalated, ...escalatedConditions];

  // 5. Check emergence of new conditions
  const envForEmergence: EnvironmentState = {
    ...intermediateEnv,
    activeConditions: afterEscalation,
  };
  const newConditions = checkConditionEmergence(envForEmergence, season, food, turnNumber, random);

  for (const cond of newConditions) {
    conditionCards.push({
      conditionId: cond.id,
      conditionType: cond.type,
      severity: cond.severity,
      triggerType: 'emergence',
      regionId: cond.regionId,
    });
  }

  const allActiveConditions = [...afterEscalation, ...newConditions];

  // Reset plague memory if a plague just resolved
  let finalPlagueMemory = newPlagueMemory;
  for (const r of resolved) {
    if (r.type === ('Plague' as ConditionType) || r.type === ('Pox' as ConditionType)) {
      finalPlagueMemory = 0;
    }
  }

  // Reset flood risk if flood just occurred
  let finalFloodRisk = newFloodRisk;
  for (const c of newConditions) {
    if (c.type === ('Flood' as ConditionType)) {
      finalFloodRisk = 0;
    }
  }

  // 6. Aggregate modifiers
  const modifiers = aggregateConditionEffects(allActiveConditions);

  const finalEnvironment: EnvironmentState = {
    activeConditions: allActiveConditions,
    weatherSeverity: newWeather,
    droughtAccumulator: newDrought,
    floodRisk: finalFloodRisk,
    diseaseVulnerability: newDiseaseVuln,
    sanitationLevel: newSanitation,
    plagueMemoryTurns: finalPlagueMemory,
  };

  return { environment: finalEnvironment, conditionCards, modifiers };
}
