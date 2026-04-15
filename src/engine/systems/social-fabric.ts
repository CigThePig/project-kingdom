// Social Fabric — Expansion 4
// Social condition emergence, class interaction matrix.
// Pure functions. No React imports. No player-facing text.

import type {
  ConditionCardTrigger,
  ConditionEffect,
  EnvironmentState,
  KingdomCondition,
  PolicyState,
  PopulationState,
} from '../types';
import {
  ConditionSeverity,
  ConditionType,
  PopulationClass,
  TaxationLevel,
  TradeOpenness,
} from '../types';
import {
  SOCIAL_BANDITRY_COMMONER_SAT_THRESHOLD,
  SOCIAL_BANDITRY_STABILITY_THRESHOLD,
  SOCIAL_BANDITRY_TRADE_INCOME_PENALTY,
  SOCIAL_BANDITRY_FOOD_PRODUCTION_PENALTY,
  SOCIAL_BANDITRY_MERCHANT_SAT_DELTA,
  SOCIAL_BANDITRY_SEVERE_REGION_PENALTY,
  SOCIAL_CORRUPTION_NOBILITY_SAT_THRESHOLD,
  SOCIAL_CORRUPTION_TREASURY_PENALTY,
  SOCIAL_CORRUPTION_CONSTRUCTION_COST,
  SOCIAL_CORRUPTION_STABILITY_DELTA,
  SOCIAL_UNREST_CLASS_SAT_THRESHOLD,
  SOCIAL_UNREST_STABILITY_THRESHOLD,
  SOCIAL_UNREST_STABILITY_DELTA,
  SOCIAL_CRIMINAL_MERCHANT_SAT_THRESHOLD,
  SOCIAL_CRIMINAL_INTEL_NONE_TURNS,
  SOCIAL_CRIMINAL_COUNTER_INTEL_PENALTY,
  SOCIAL_CRIMINAL_TREASURY_PENALTY,
  SOCIAL_CRIMINAL_MERCHANT_SAT_BONUS,
  CLASS_INTERACTION_MERCHANT_RISING,
  CLASS_INTERACTION_CLERGY_RISING,
  CLASS_INTERACTION_MILITARY_RISING,
  CLASS_INTERACTION_NOBILITY_RISING,
  CLASS_INTERACTION_COMMONER_RISING,
  CLASS_INTERACTION_NOBILITY_FALLING,
  CLASS_INTERACTION_MERCHANT_FALLING,
  CLASS_INTERACTION_COMMONER_FALLING_LOW,
  CLASS_INTERACTION_COMMONER_FALLING,
  CLASS_INTERACTION_MERCHANT_NOBILITY_DELTA,
  CLASS_INTERACTION_CLERGY_MERCHANT_DELTA,
  CLASS_INTERACTION_MILITARY_COMMONER_DELTA,
  CLASS_INTERACTION_NOBILITY_COMMONER_DELTA,
  CLASS_INTERACTION_COMMONER_NOBILITY_DELTA,
} from '../constants';

// ============================================================
// Helpers
// ============================================================

let socialConditionIdCounter = 0;

function generateSocialConditionId(type: string, turn: number): string {
  socialConditionIdCounter++;
  return `social_${type}_t${turn}_${socialConditionIdCounter}`;
}

// ============================================================
// Social Condition Effect Builders
// ============================================================

export function buildBanditryEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [
    { target: 'trade.income', operator: 'multiply', value: SOCIAL_BANDITRY_TRADE_INCOME_PENALTY },
    { target: 'food.production', operator: 'multiply', value: SOCIAL_BANDITRY_FOOD_PRODUCTION_PENALTY },
    { target: 'merchant.satisfaction', operator: 'add', value: SOCIAL_BANDITRY_MERCHANT_SAT_DELTA },
  ];
  if (severity === ConditionSeverity.Severe) {
    // Brigand Kingdoms: severe regional penalty
    effects.push({ target: 'food.production', operator: 'multiply', value: SOCIAL_BANDITRY_SEVERE_REGION_PENALTY });
  }
  return effects;
}

export function buildCorruptionEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [
    { target: 'treasury.income', operator: 'multiply', value: SOCIAL_CORRUPTION_TREASURY_PENALTY },
    { target: 'construction.cost', operator: 'multiply', value: SOCIAL_CORRUPTION_CONSTRUCTION_COST },
    { target: 'stability', operator: 'add', value: SOCIAL_CORRUPTION_STABILITY_DELTA },
  ];
  if (severity === ConditionSeverity.Severe) {
    // Entrenched corruption: worse penalties
    effects.push({ target: 'treasury.income', operator: 'multiply', value: 0.95 });
    effects.push({ target: 'stability', operator: 'add', value: -1 });
  }
  return effects;
}

export function buildUnrestEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [
    { target: 'stability', operator: 'add', value: SOCIAL_UNREST_STABILITY_DELTA },
    { target: 'construction.halted', operator: 'add', value: 1 },
  ];
  if (severity === ConditionSeverity.Moderate) {
    // Riot: additional commoner satisfaction penalty
    effects.push({ target: 'commoner.satisfaction', operator: 'add', value: -3 });
  }
  if (severity === ConditionSeverity.Severe) {
    // Rebellion: severe penalties
    effects.push({ target: 'commoner.satisfaction', operator: 'add', value: -5 });
    effects.push({ target: 'stability', operator: 'add', value: -3 });
  }
  return effects;
}

export function buildCriminalUnderworldEffects(severity: ConditionSeverity): ConditionEffect[] {
  const effects: ConditionEffect[] = [
    { target: 'espionage.counterIntel', operator: 'add', value: SOCIAL_CRIMINAL_COUNTER_INTEL_PENALTY },
    { target: 'treasury.income', operator: 'multiply', value: SOCIAL_CRIMINAL_TREASURY_PENALTY },
    // Perverse incentive: black market helps merchants
    { target: 'merchant.satisfaction', operator: 'add', value: SOCIAL_CRIMINAL_MERCHANT_SAT_BONUS },
  ];
  if (severity === ConditionSeverity.Moderate) {
    effects.push({ target: 'treasury.income', operator: 'multiply', value: 0.97 });
  }
  return effects;
}

// ============================================================
// Social Condition Emergence
// ============================================================

export function checkSocialConditionEmergence(
  population: PopulationState,
  stability: number,
  policies: PolicyState,
  environment: EnvironmentState,
  isAtWar: boolean,
  turnNumber: number,
  intelNoneTurns: number,
): KingdomCondition[] {
  const newConditions: KingdomCondition[] = [];
  const existingTypes = new Set(environment.activeConditions.map(c => c.type));

  // --- Banditry ---
  if (!existingTypes.has(ConditionType.Banditry)) {
    const commonerSatLow = population[PopulationClass.Commoners].satisfaction < SOCIAL_BANDITRY_COMMONER_SAT_THRESHOLD;
    const stabilityLow = stability < SOCIAL_BANDITRY_STABILITY_THRESHOLD;
    if ((commonerSatLow && stabilityLow) || isAtWar) {
      newConditions.push({
        id: generateSocialConditionId('banditry', turnNumber),
        type: ConditionType.Banditry,
        severity: ConditionSeverity.Mild,
        turnsActive: 0,
        turnsRemaining: null,
        systemEffects: buildBanditryEffects(ConditionSeverity.Mild),
        regionId: null,
        canEscalate: true,
        escalatesTo: ConditionType.Banditry,
      });
    }
  }

  // --- Corruption ---
  if (!existingTypes.has(ConditionType.Corruption)) {
    const nobilityHigh = population[PopulationClass.Nobility].satisfaction > SOCIAL_CORRUPTION_NOBILITY_SAT_THRESHOLD;
    const taxHigh = policies.taxationLevel === TaxationLevel.High || policies.taxationLevel === TaxationLevel.Punitive;
    if (nobilityHigh && taxHigh) {
      newConditions.push({
        id: generateSocialConditionId('corruption', turnNumber),
        type: ConditionType.Corruption,
        severity: ConditionSeverity.Mild,
        turnsActive: 0,
        turnsRemaining: null,
        systemEffects: buildCorruptionEffects(ConditionSeverity.Mild),
        regionId: null,
        canEscalate: true,
        escalatesTo: ConditionType.Corruption,
      });
    }
  }

  // --- Unrest ---
  if (!existingTypes.has(ConditionType.Unrest)) {
    const anyClassCritical = Object.values(PopulationClass).some(
      cls => population[cls].satisfaction < SOCIAL_UNREST_CLASS_SAT_THRESHOLD,
    );
    const stabilityLow = stability < SOCIAL_UNREST_STABILITY_THRESHOLD;
    if (anyClassCritical && stabilityLow) {
      newConditions.push({
        id: generateSocialConditionId('unrest', turnNumber),
        type: ConditionType.Unrest,
        severity: ConditionSeverity.Mild,
        turnsActive: 0,
        turnsRemaining: null,
        systemEffects: buildUnrestEffects(ConditionSeverity.Mild),
        regionId: null,
        canEscalate: true,
        escalatesTo: ConditionType.Unrest,
      });
    }
  }

  // --- Criminal Underworld ---
  if (!existingTypes.has(ConditionType.CriminalUnderworld)) {
    const merchantSatLow = population[PopulationClass.Merchants].satisfaction < SOCIAL_CRIMINAL_MERCHANT_SAT_THRESHOLD;
    const tradeRestricted = policies.tradeOpenness === TradeOpenness.Restricted || policies.tradeOpenness === TradeOpenness.Closed;
    const intelNeglected = intelNoneTurns >= SOCIAL_CRIMINAL_INTEL_NONE_TURNS;
    if ((merchantSatLow && tradeRestricted) || intelNeglected) {
      newConditions.push({
        id: generateSocialConditionId('criminal', turnNumber),
        type: ConditionType.CriminalUnderworld,
        severity: ConditionSeverity.Mild,
        turnsActive: 0,
        turnsRemaining: null,
        systemEffects: buildCriminalUnderworldEffects(ConditionSeverity.Mild),
        regionId: null,
        canEscalate: true,
        escalatesTo: ConditionType.CriminalUnderworld,
      });
    }
  }

  return newConditions;
}

// ============================================================
// Social Condition Escalation Effects
// ============================================================

export function getSocialConditionEscalatedEffects(
  conditionType: ConditionType,
  newSeverity: ConditionSeverity,
): ConditionEffect[] | null {
  switch (conditionType) {
    case ConditionType.Banditry: return buildBanditryEffects(newSeverity);
    case ConditionType.Corruption: return buildCorruptionEffects(newSeverity);
    case ConditionType.Unrest: return buildUnrestEffects(newSeverity);
    case ConditionType.CriminalUnderworld: return buildCriminalUnderworldEffects(newSeverity);
    default: return null;
  }
}

// ============================================================
// Class Interaction Matrix
// ============================================================

export function evaluateClassInteractions(
  population: PopulationState,
): Record<PopulationClass, number> {
  const deltas: Record<PopulationClass, number> = {
    [PopulationClass.Nobility]: 0,
    [PopulationClass.Clergy]: 0,
    [PopulationClass.Merchants]: 0,
    [PopulationClass.Commoners]: 0,
    [PopulationClass.MilitaryCaste]: 0,
  };

  const sat = (cls: PopulationClass) => population[cls].satisfaction;

  // Merchants rising → Nobility falling
  if (sat(PopulationClass.Merchants) > CLASS_INTERACTION_MERCHANT_RISING &&
      sat(PopulationClass.Nobility) < CLASS_INTERACTION_NOBILITY_FALLING) {
    deltas[PopulationClass.Nobility] += CLASS_INTERACTION_MERCHANT_NOBILITY_DELTA;
  }

  // Clergy rising → Merchants falling
  if (sat(PopulationClass.Clergy) > CLASS_INTERACTION_CLERGY_RISING &&
      sat(PopulationClass.Merchants) < CLASS_INTERACTION_MERCHANT_FALLING) {
    deltas[PopulationClass.Merchants] += CLASS_INTERACTION_CLERGY_MERCHANT_DELTA;
  }

  // Military rising → Commoners falling
  if (sat(PopulationClass.MilitaryCaste) > CLASS_INTERACTION_MILITARY_RISING &&
      sat(PopulationClass.Commoners) < CLASS_INTERACTION_COMMONER_FALLING) {
    deltas[PopulationClass.Commoners] += CLASS_INTERACTION_MILITARY_COMMONER_DELTA;
  }

  // Nobility rising → Commoners falling
  if (sat(PopulationClass.Nobility) > CLASS_INTERACTION_NOBILITY_RISING &&
      sat(PopulationClass.Commoners) < CLASS_INTERACTION_COMMONER_FALLING_LOW) {
    deltas[PopulationClass.Commoners] += CLASS_INTERACTION_NOBILITY_COMMONER_DELTA;
  }

  // Commoners rising → Nobility falling
  if (sat(PopulationClass.Commoners) > CLASS_INTERACTION_COMMONER_RISING &&
      sat(PopulationClass.Nobility) < CLASS_INTERACTION_NOBILITY_FALLING) {
    deltas[PopulationClass.Nobility] += CLASS_INTERACTION_COMMONER_NOBILITY_DELTA;
  }

  return deltas;
}

// ============================================================
// Main Phase 4c Orchestrator
// ============================================================

export function resolveSocialFabric(
  population: PopulationState,
  stability: number,
  policies: PolicyState,
  environment: EnvironmentState,
  isAtWar: boolean,
  turnNumber: number,
  intelNoneTurns: number,
): {
  satisfactionDeltas: Record<PopulationClass, number>;
  newConditions: KingdomCondition[];
  conditionCards: ConditionCardTrigger[];
} {
  const conditionCards: ConditionCardTrigger[] = [];

  // 1. Evaluate class interactions → satisfaction deltas
  const satisfactionDeltas = evaluateClassInteractions(population);

  // 2. Check for social condition emergence
  const newConditions = checkSocialConditionEmergence(
    population, stability, policies, environment,
    isAtWar, turnNumber, intelNoneTurns,
  );

  // 3. Generate condition card triggers for newly emerged conditions
  for (const cond of newConditions) {
    conditionCards.push({
      conditionId: cond.id,
      conditionType: cond.type,
      severity: cond.severity,
      triggerType: 'emergence',
      regionId: cond.regionId,
    });
  }

  return { satisfactionDeltas, newConditions, conditionCards };
}
