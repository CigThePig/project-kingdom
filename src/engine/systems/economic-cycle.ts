// SIMULATION-EXPANSION §Expansion 2 — Economic Depth
// Boom/bust cycles, scarcity pricing, inflation, merchant confidence.
// Pure engine logic. No React imports. No player-facing text.

import {
  ConditionCardTrigger,
  ConditionSeverity,
  ConditionType,
  EconomicModifiers,
  EconomicPhase,
  EconomicState,
  KingdomCondition,
  ResourceState,
  ResourceType,
  TradeOpenness,
} from '../types';
import {
  ECON_CONFIDENCE_MAX,
  ECON_CONFIDENCE_MIN,
  ECON_CONFIDENCE_STABILITY_BONUS_THRESHOLD,
  ECON_CONFIDENCE_STABILITY_WEIGHT,
  ECON_CONFIDENCE_STARTING,
  ECON_CONFIDENCE_TRADE_WEIGHT,
  ECON_CONFIDENCE_WAR_PENALTY,
  ECON_CUMULATIVE_INFLATION_STARTING,
  ECON_FOOD_PRICE_DENOMINATOR,
  ECON_FOOD_PRICE_MAX,
  ECON_FOOD_PRICE_MIN,
  ECON_INFLATION_BOOM_RATE,
  ECON_INFLATION_BOOM_TURNS_THRESHOLD,
  ECON_INFLATION_DEFLATION_RATE,
  ECON_INFLATION_HIGH_SPENDING_RATE,
  ECON_INFLATION_MAX,
  ECON_INFLATION_MIN,
  ECON_INFLATION_RATE_STARTING,
  ECON_MARKET_PANIC_CONFIDENCE_THRESHOLD,
  ECON_MOMENTUM_CONSTRUCTION_WEIGHT,
  ECON_MOMENTUM_FAMINE_PENALTY,
  ECON_MOMENTUM_MEAN_REVERSION,
  ECON_MOMENTUM_MERCHANT_SAT_TREND_WEIGHT,
  ECON_MOMENTUM_STARTING,
  ECON_MOMENTUM_STABILITY_WEIGHT,
  ECON_MOMENTUM_TRADE_TREND_WEIGHT,
  ECON_MOMENTUM_WAR_PENALTY,
  ECON_PHASE_BOOM_THRESHOLD,
  ECON_PHASE_DEPRESSION_THRESHOLD,
  ECON_PHASE_GROWTH_THRESHOLD,
  ECON_PHASE_MERCHANT_SAT_DELTA,
  ECON_PHASE_RECESSION_THRESHOLD,
  ECON_PHASE_TRADE_MULTIPLIER,
  ECON_PHASE_TREASURY_MULTIPLIER,
  ECON_SCARCITY_DEMAND_DECAY_RATE,
  ECON_SCARCITY_DEMAND_RISE_RATE,
  ECON_SCARCITY_STOCKPILE_THRESHOLD,
  ECON_TRADE_DISRUPTION_TURNS,
  ECON_TRADE_DISRUPTION_VOLUME_THRESHOLD,
  ECON_TRADE_VOLUME_MAX,
  ECON_TRADE_VOLUME_MIN,
  ECON_TRADE_VOLUME_STARTING,
} from '../constants';

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ============================================================
// Initialization
// ============================================================

export function createInitialEconomicState(
  merchantSatisfaction?: number,
  tradeIncome?: number,
): EconomicState {
  return {
    economicMomentum: ECON_MOMENTUM_STARTING,
    cyclePhase: EconomicPhase.Stagnation,
    turnsInCurrentPhase: 0,
    resourceDemandPressure: {
      [ResourceType.Wood]: 0,
      [ResourceType.Iron]: 0,
      [ResourceType.Stone]: 0,
    },
    foodPriceMultiplier: 1.0,
    inflationRate: ECON_INFLATION_RATE_STARTING,
    cumulativeInflation: ECON_CUMULATIVE_INFLATION_STARTING,
    merchantConfidence: ECON_CONFIDENCE_STARTING,
    tradeVolume: ECON_TRADE_VOLUME_STARTING,
    previousTradeIncome: tradeIncome ?? 0,
    previousMerchantSatisfaction: merchantSatisfaction ?? 50,
  };
}

// ============================================================
// Core Calculations
// ============================================================

/**
 * Determines the economic phase from momentum value.
 */
export function deriveEconomicPhase(momentum: number): EconomicPhase {
  if (momentum < ECON_PHASE_DEPRESSION_THRESHOLD) return EconomicPhase.Depression;
  if (momentum < ECON_PHASE_RECESSION_THRESHOLD) return EconomicPhase.Recession;
  if (momentum < ECON_PHASE_GROWTH_THRESHOLD) return EconomicPhase.Stagnation;
  if (momentum < ECON_PHASE_BOOM_THRESHOLD) return EconomicPhase.Growth;
  return EconomicPhase.Boom;
}

/**
 * Calculates the momentum delta for this turn.
 * Momentum drifts based on trade trends, merchant satisfaction trends, stability,
 * construction activity, war/famine penalties, and mean reversion.
 */
export function calculateMomentumDelta(
  tradeIncomeTrend: number,
  merchantSatTrend: number,
  stability: number,
  constructionCount: number,
  isAtWar: boolean,
  isFamine: boolean,
  currentMomentum: number,
): number {
  // Normalize trade trend to a -20..+20 range (trade income is typically 0-200)
  const normalizedTradeTrend = clamp(tradeIncomeTrend / 5, -20, 20);
  // Normalize merchant satisfaction trend to -10..+10
  const normalizedMerchantTrend = clamp(merchantSatTrend, -10, 10);
  // Stability contribution: above 50 is positive, below is negative
  const stabilityContribution = (stability - 50) * 0.2;
  // Construction activity is a mild positive signal
  const constructionContribution = Math.min(constructionCount, 5) * 2;

  let delta = 0;
  delta += normalizedTradeTrend * ECON_MOMENTUM_TRADE_TREND_WEIGHT;
  delta += normalizedMerchantTrend * ECON_MOMENTUM_MERCHANT_SAT_TREND_WEIGHT;
  delta += stabilityContribution * ECON_MOMENTUM_STABILITY_WEIGHT;
  delta += constructionContribution * ECON_MOMENTUM_CONSTRUCTION_WEIGHT;

  if (isAtWar) delta += ECON_MOMENTUM_WAR_PENALTY;
  if (isFamine) delta += ECON_MOMENTUM_FAMINE_PENALTY;

  // Mean reversion: always pulls toward zero, proportional to current momentum
  delta -= currentMomentum * ECON_MOMENTUM_MEAN_REVERSION;

  return delta;
}

/**
 * Returns phase-based modifiers for treasury, trade, and merchant satisfaction.
 */
export function getPhaseModifiers(phase: EconomicPhase): EconomicModifiers {
  return {
    treasuryMultiplier: ECON_PHASE_TREASURY_MULTIPLIER[phase],
    tradeMultiplier: ECON_PHASE_TRADE_MULTIPLIER[phase],
    merchantSatisfactionDelta: ECON_PHASE_MERCHANT_SAT_DELTA[phase],
    inflationCostMultiplier: 1.0, // set by caller from cumulativeInflation
    foodPriceSatisfactionPenalty: 0, // set by caller from foodPriceMultiplier
  };
}

/**
 * Updates resource demand pressure and food price multiplier based on scarcity.
 */
export function updateScarcityPressure(
  currentPressure: Record<ResourceType, number>,
  resources: ResourceState,
  foodReserves: number,
): { resourceDemandPressure: Record<ResourceType, number>; foodPriceMultiplier: number } {
  const updatedPressure = { ...currentPressure };

  for (const rt of [ResourceType.Wood, ResourceType.Iron, ResourceType.Stone]) {
    if (resources[rt].stockpile < ECON_SCARCITY_STOCKPILE_THRESHOLD) {
      updatedPressure[rt] = clamp(updatedPressure[rt] + ECON_SCARCITY_DEMAND_RISE_RATE, 0, 100);
    } else {
      updatedPressure[rt] = clamp(updatedPressure[rt] - ECON_SCARCITY_DEMAND_DECAY_RATE, 0, 100);
    }
  }

  // Food price multiplier: 1.0 + max(0, (100 - foodReserves) / 50)
  const rawFoodPrice = 1.0 + Math.max(0, (100 - foodReserves) / ECON_FOOD_PRICE_DENOMINATOR);
  const foodPriceMultiplier = clamp(rawFoodPrice, ECON_FOOD_PRICE_MIN, ECON_FOOD_PRICE_MAX);

  return { resourceDemandPressure: updatedPressure, foodPriceMultiplier };
}

/**
 * Updates inflation rate and cumulative inflation.
 * Inflation accumulates from high spending and prolonged boom.
 * Deflation occurs during recession/depression.
 */
export function updateInflation(
  currentRate: number,
  cumulativeInflation: number,
  totalExpenses: number,
  totalIncome: number,
  cyclePhase: EconomicPhase,
  turnsInPhase: number,
): { inflationRate: number; cumulativeInflation: number } {
  let rateDelta = 0;

  // High spending: expenses significantly exceed income
  if (totalExpenses > totalIncome * 1.2) {
    rateDelta += ECON_INFLATION_HIGH_SPENDING_RATE;
  }

  // Prolonged boom drives inflation
  if (cyclePhase === EconomicPhase.Boom && turnsInPhase > ECON_INFLATION_BOOM_TURNS_THRESHOLD) {
    rateDelta += ECON_INFLATION_BOOM_RATE;
  }

  // Deflation during economic contraction
  if (cyclePhase === EconomicPhase.Recession || cyclePhase === EconomicPhase.Depression) {
    rateDelta -= ECON_INFLATION_DEFLATION_RATE;
  }

  const newRate = clamp(currentRate + rateDelta, ECON_INFLATION_MIN, ECON_INFLATION_MAX);

  // Cumulative inflation compounds: each turn adds the current rate
  const newCumulative = cumulativeInflation * (1 + newRate);

  return { inflationRate: newRate, cumulativeInflation: newCumulative };
}

/**
 * Updates merchant confidence based on economic conditions.
 */
export function updateMerchantConfidence(
  currentConfidence: number,
  stability: number,
  tradeIncomeTrend: number,
  cyclePhase: EconomicPhase,
  isAtWar: boolean,
): number {
  let delta = 0;

  // Stability influence
  if (stability > ECON_CONFIDENCE_STABILITY_BONUS_THRESHOLD) {
    delta += (stability - ECON_CONFIDENCE_STABILITY_BONUS_THRESHOLD) * ECON_CONFIDENCE_STABILITY_WEIGHT;
  } else {
    delta += (stability - ECON_CONFIDENCE_STABILITY_BONUS_THRESHOLD) * ECON_CONFIDENCE_STABILITY_WEIGHT;
  }

  // Trade income trend influence
  const normalizedTrend = clamp(tradeIncomeTrend / 10, -5, 5);
  delta += normalizedTrend * ECON_CONFIDENCE_TRADE_WEIGHT;

  // Phase influence
  if (cyclePhase === EconomicPhase.Growth || cyclePhase === EconomicPhase.Boom) {
    delta += 2;
  } else if (cyclePhase === EconomicPhase.Recession || cyclePhase === EconomicPhase.Depression) {
    delta -= 3;
  }

  // War penalty
  if (isAtWar) delta += ECON_CONFIDENCE_WAR_PENALTY;

  return clamp(currentConfidence + delta, ECON_CONFIDENCE_MIN, ECON_CONFIDENCE_MAX);
}

/**
 * Updates trade volume based on openness, confidence, and neighbor relationships.
 */
export function updateTradeVolume(
  currentVolume: number,
  tradeOpenness: TradeOpenness,
  merchantConfidence: number,
  neighborRelScores: Record<string, number>,
): number {
  // Target volume based on conditions
  let target = merchantConfidence * 0.5; // base from confidence

  // Openness affects target
  if (tradeOpenness === TradeOpenness.Encouraged) target += 20;
  else if (tradeOpenness === TradeOpenness.Open) target += 10;
  else if (tradeOpenness === TradeOpenness.Restricted) target -= 15;
  else if (tradeOpenness === TradeOpenness.Closed) target -= 30;

  // Friendly neighbors boost target
  const friendlyNeighbors = Object.values(neighborRelScores).filter((s) => s > 60).length;
  target += friendlyNeighbors * 5;

  target = clamp(target, ECON_TRADE_VOLUME_MIN, ECON_TRADE_VOLUME_MAX);

  // Volume drifts toward target
  const drift = (target - currentVolume) * 0.15;
  return clamp(currentVolume + drift, ECON_TRADE_VOLUME_MIN, ECON_TRADE_VOLUME_MAX);
}

// ============================================================
// Condition Emergence
// ============================================================

/**
 * Checks if TradeDisruption should emerge.
 * Triggers when tradeVolume < threshold for 2+ consecutive turns.
 */
function checkTradeDisruption(
  economy: EconomicState,
  activeConditions: KingdomCondition[],
  turnNumber: number,
): KingdomCondition | null {
  if (economy.tradeVolume >= ECON_TRADE_DISRUPTION_VOLUME_THRESHOLD) return null;

  // Check if already active
  if (activeConditions.some((c) => c.type === ConditionType.TradeDisruption)) return null;

  // We use turnsInCurrentPhase as a proxy for how long volume has been low
  // (simplification — in a real scenario we'd track consecutive low-volume turns)
  if (economy.turnsInCurrentPhase < ECON_TRADE_DISRUPTION_TURNS) return null;

  const severity = economy.tradeVolume < 5 ? ConditionSeverity.Severe
    : economy.tradeVolume < 10 ? ConditionSeverity.Moderate
    : ConditionSeverity.Mild;

  return {
    id: `cond_trade_disruption_t${turnNumber}`,
    type: ConditionType.TradeDisruption,
    severity,
    turnsActive: 0,
    turnsRemaining: null, // until resolved by trade volume recovery
    systemEffects: [
      { target: 'trade.income', operator: 'multiply', value: severity === ConditionSeverity.Severe ? 0.5 : severity === ConditionSeverity.Moderate ? 0.7 : 0.85 },
      { target: 'merchant.satisfaction', operator: 'add', value: severity === ConditionSeverity.Severe ? -3 : severity === ConditionSeverity.Moderate ? -2 : -1 },
    ],
    regionId: null,
    canEscalate: true,
    escalatesTo: null,
  };
}

/**
 * Checks if MarketPanic should emerge.
 * Triggers when merchantConfidence drops below threshold.
 */
function checkMarketPanic(
  economy: EconomicState,
  activeConditions: KingdomCondition[],
  turnNumber: number,
): KingdomCondition | null {
  if (economy.merchantConfidence >= ECON_MARKET_PANIC_CONFIDENCE_THRESHOLD) return null;

  // Check if already active
  if (activeConditions.some((c) => c.type === ConditionType.MarketPanic)) return null;

  const severity = economy.merchantConfidence < 5 ? ConditionSeverity.Severe
    : economy.merchantConfidence < 10 ? ConditionSeverity.Moderate
    : ConditionSeverity.Mild;

  return {
    id: `cond_market_panic_t${turnNumber}`,
    type: ConditionType.MarketPanic,
    severity,
    turnsActive: 0,
    turnsRemaining: null,
    systemEffects: [
      { target: 'treasury.income', operator: 'multiply', value: severity === ConditionSeverity.Severe ? 0.5 : severity === ConditionSeverity.Moderate ? 0.7 : 0.85 },
      { target: 'merchant.satisfaction', operator: 'add', value: severity === ConditionSeverity.Severe ? -8 : severity === ConditionSeverity.Moderate ? -5 : -3 },
    ],
    regionId: null,
    canEscalate: true,
    escalatesTo: null,
  };
}

// ============================================================
// Main Phase 1b Orchestrator
// ============================================================

export interface EconomicCycleResult {
  economy: EconomicState;
  economicModifiers: EconomicModifiers;
  newConditions: KingdomCondition[];
  conditionCards: ConditionCardTrigger[];
  momentumDelta: number;
}

export function resolveEconomicCycle(
  economy: EconomicState,
  currentTradeIncome: number,
  currentMerchantSatisfaction: number,
  stability: number,
  constructionCount: number,
  isAtWar: boolean,
  isFamine: boolean,
  resources: ResourceState,
  foodReserves: number,
  totalExpenses: number,
  totalIncome: number,
  tradeOpenness: TradeOpenness,
  neighborRelScores: Record<string, number>,
  activeConditions: KingdomCondition[],
  turnNumber: number,
): EconomicCycleResult {
  const conditionCards: ConditionCardTrigger[] = [];
  const newConditions: KingdomCondition[] = [];

  // 1. Calculate momentum delta from trends
  const tradeIncomeTrend = currentTradeIncome - economy.previousTradeIncome;
  const merchantSatTrend = currentMerchantSatisfaction - economy.previousMerchantSatisfaction;

  const momentumDelta = calculateMomentumDelta(
    tradeIncomeTrend, merchantSatTrend, stability,
    constructionCount, isAtWar, isFamine, economy.economicMomentum,
  );

  const newMomentum = clamp(economy.economicMomentum + momentumDelta, -100, 100);
  const newPhase = deriveEconomicPhase(newMomentum);
  const phaseChanged = newPhase !== economy.cyclePhase;
  const newTurnsInPhase = phaseChanged ? 1 : economy.turnsInCurrentPhase + 1;

  // 2. Update scarcity pricing
  const scarcity = updateScarcityPressure(
    economy.resourceDemandPressure, resources, foodReserves,
  );

  // 3. Update inflation
  const inflation = updateInflation(
    economy.inflationRate, economy.cumulativeInflation,
    totalExpenses, totalIncome, newPhase, newTurnsInPhase,
  );

  // 4. Update merchant confidence
  const newConfidence = updateMerchantConfidence(
    economy.merchantConfidence, stability, tradeIncomeTrend, newPhase, isAtWar,
  );

  // 5. Update trade volume
  const newVolume = updateTradeVolume(
    economy.tradeVolume, tradeOpenness, newConfidence, neighborRelScores,
  );

  // 6. Build updated state
  const updatedEconomy: EconomicState = {
    economicMomentum: newMomentum,
    cyclePhase: newPhase,
    turnsInCurrentPhase: newTurnsInPhase,
    resourceDemandPressure: scarcity.resourceDemandPressure,
    foodPriceMultiplier: scarcity.foodPriceMultiplier,
    inflationRate: inflation.inflationRate,
    cumulativeInflation: inflation.cumulativeInflation,
    merchantConfidence: newConfidence,
    tradeVolume: newVolume,
    previousTradeIncome: currentTradeIncome,
    previousMerchantSatisfaction: currentMerchantSatisfaction,
  };

  // 7. Build modifiers for downstream consumption
  const modifiers = getPhaseModifiers(newPhase);
  modifiers.inflationCostMultiplier = inflation.cumulativeInflation;
  // Food price satisfaction penalty: when food costs > 1.5x, commoners suffer
  modifiers.foodPriceSatisfactionPenalty = scarcity.foodPriceMultiplier > 1.5
    ? -Math.floor((scarcity.foodPriceMultiplier - 1.0) * 3)
    : 0;

  // 8. Check condition emergence
  const tradeDisruption = checkTradeDisruption(updatedEconomy, activeConditions, turnNumber);
  if (tradeDisruption) {
    newConditions.push(tradeDisruption);
    conditionCards.push({
      conditionId: tradeDisruption.id,
      conditionType: tradeDisruption.type,
      severity: tradeDisruption.severity,
      triggerType: 'emergence',
      regionId: null,
    });
  }

  const marketPanic = checkMarketPanic(updatedEconomy, activeConditions, turnNumber);
  if (marketPanic) {
    newConditions.push(marketPanic);
    conditionCards.push({
      conditionId: marketPanic.id,
      conditionType: marketPanic.type,
      severity: marketPanic.severity,
      triggerType: 'emergence',
      regionId: null,
    });
  }

  return {
    economy: updatedEconomy,
    economicModifiers: modifiers,
    newConditions,
    conditionCards,
    momentumDelta,
  };
}
