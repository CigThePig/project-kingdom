// gameplay-blueprint.md §4.1 — Treasury
// Pure engine logic for income, expense, and insolvency tracking.
// No React imports. No player-facing text.

import {
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  MilitaryState,
  RegionState,
  ReligiousOrder,
  TaxationLevel,
  TreasuryExpenseBreakdown,
  TreasuryIncomeBreakdown,
  TreasuryState,
} from '../types';
import {
  FESTIVAL_COST_PER_TURN,
  INTELLIGENCE_FUNDING_COST_PER_TURN,
  MILITARY_UPKEEP_COST_PER_SOLDIER,
  MILITARY_UPKEEP_POSTURE_MULTIPLIER,
  TAXATION_BASE_INCOME,
  TAXATION_INCOME_MULTIPLIER,
  TREASURY_CONSECUTIVE_TURNS_INSOLVENT,
  TREASURY_INSOLVENCY_THRESHOLD,
  TREASURY_MERCHANT_PROSPERITY_MAX,
  TREASURY_MERCHANT_PROSPERITY_MIN,
  TREASURY_NOBLE_COOPERATION_MAX,
  TREASURY_NOBLE_COOPERATION_MIN,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(t: number, min: number, max: number): number {
  return min + t * (max - min);
}

// ============================================================
// Exported Calculators — Income
// ============================================================

/**
 * Returns the noble cooperation multiplier for taxation.
 * At satisfaction 0 → NOBLE_COOPERATION_MIN; at 100 → NOBLE_COOPERATION_MAX.
 * Nobles withhold tax cooperation when dissatisfied (§4.4).
 */
export function calculateNobleCooperationMultiplier(nobleSatisfaction: number): number {
  const t = clamp(nobleSatisfaction / 100, 0, 1);
  return lerp(t, TREASURY_NOBLE_COOPERATION_MIN, TREASURY_NOBLE_COOPERATION_MAX);
}

/**
 * Returns the merchant prosperity multiplier for taxation.
 * At satisfaction 0 → MERCHANT_PROSPERITY_MIN; at 100 → MERCHANT_PROSPERITY_MAX.
 * High merchant prosperity drives commerce taxes and enterprise (§4.4).
 */
export function calculateMerchantProsperityMultiplier(merchantSatisfaction: number): number {
  const t = clamp(merchantSatisfaction / 100, 0, 1);
  return lerp(t, TREASURY_MERCHANT_PROSPERITY_MIN, TREASURY_MERCHANT_PROSPERITY_MAX);
}

/**
 * Calculates total taxation income for the turn.
 *
 * Formula:
 *   taxationIncome = BASE × taxationMultiplier × nobleCooperation × merchantProsperity
 *                    × (1 + regionCount × 0.1)
 *
 * The region count scalar reflects that more developed regions produce more taxable activity.
 */
export function calculateTaxationIncome(
  taxationLevel: TaxationLevel,
  nobleSatisfaction: number,
  merchantSatisfaction: number,
  regions: RegionState[],
): number {
  const taxMultiplier = TAXATION_INCOME_MULTIPLIER[taxationLevel];
  const nobleCooperation = calculateNobleCooperationMultiplier(nobleSatisfaction);
  const merchantProsperity = calculateMerchantProsperityMultiplier(merchantSatisfaction);
  const activeRegions = regions.filter((r) => !r.isOccupied).length;
  const regionScalar = 1 + activeRegions * 0.1;
  return clamp(
    TAXATION_BASE_INCOME * taxMultiplier * nobleCooperation * merchantProsperity * regionScalar,
    0,
    Infinity,
  );
}

/**
 * Assembles a TreasuryIncomeBreakdown from component income values.
 * Trade income is computed by trade.ts and passed in.
 */
export function calculateIncome(
  taxationIncome: number,
  tradeIncome: number,
  miscellaneousIncome: number,
): TreasuryIncomeBreakdown {
  return {
    taxation: clamp(taxationIncome, 0, Infinity),
    trade: clamp(tradeIncome, 0, Infinity),
    miscellaneous: clamp(miscellaneousIncome, 0, Infinity),
  };
}

// ============================================================
// Exported Calculators — Expenses
// ============================================================

/**
 * Returns the military upkeep cost for this turn.
 * Cost = forceSize × PER_SOLDIER_COST × postureMultiplier (§4.6).
 */
export function calculateMilitaryUpkeepCost(military: MilitaryState): number {
  const postureMultiplier = MILITARY_UPKEEP_POSTURE_MULTIPLIER[military.deploymentPosture];
  return clamp(
    military.forceSize * MILITARY_UPKEEP_COST_PER_SOLDIER * postureMultiplier,
    0,
    Infinity,
  );
}

/**
 * Returns total religious order upkeep cost from all active orders.
 * Each order carries its own upkeepPerTurn value (§4.8).
 */
export function calculateReligiousUpkeepCost(activeOrders: ReligiousOrder[]): number {
  return activeOrders
    .filter((o) => o.isActive)
    .reduce((sum, o) => sum + o.upkeepPerTurn, 0);
}

/**
 * Returns the intelligence funding cost per turn from the current policy (§4.10).
 */
export function calculateIntelligenceFundingCost(fundingLevel: IntelligenceFundingLevel): number {
  return INTELLIGENCE_FUNDING_COST_PER_TURN[fundingLevel];
}

/**
 * Returns the festival cost per turn from the current policy (§4.8).
 */
export function calculateFestivalCost(festivalLevel: FestivalInvestmentLevel): number {
  return FESTIVAL_COST_PER_TURN[festivalLevel];
}

/**
 * Assembles a TreasuryExpenseBreakdown from all expense components.
 * constructionCostThisTurn is passed by the resolution engine from active ConstructionProject[].
 */
export function calculateExpenses(
  military: MilitaryState,
  activeOrders: ReligiousOrder[],
  fundingLevel: IntelligenceFundingLevel,
  festivalLevel: FestivalInvestmentLevel,
  constructionCostThisTurn: number,
): TreasuryExpenseBreakdown {
  return {
    militaryUpkeep: calculateMilitaryUpkeepCost(military),
    constructionCosts: clamp(constructionCostThisTurn, 0, Infinity),
    intelligenceFunding: calculateIntelligenceFundingCost(fundingLevel),
    religiousUpkeep: calculateReligiousUpkeepCost(activeOrders),
    festivalCosts: calculateFestivalCost(festivalLevel),
  };
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies one turn of treasury income and expenses to produce a new TreasuryState.
 * Tracks consecutiveTurnsInsolvent for the insolvency failure condition.
 */
export function applyTreasuryFlow(
  current: TreasuryState,
  income: TreasuryIncomeBreakdown,
  expenses: TreasuryExpenseBreakdown,
): TreasuryState {
  const totalIncome = income.taxation + income.trade + income.miscellaneous;
  const totalExpenses =
    expenses.militaryUpkeep +
    expenses.constructionCosts +
    expenses.intelligenceFunding +
    expenses.religiousUpkeep +
    expenses.festivalCosts;
  const netFlow = totalIncome - totalExpenses;
  const newBalance = current.balance + netFlow;

  const isInsolvent = newBalance <= TREASURY_INSOLVENCY_THRESHOLD && netFlow < 0;
  const consecutiveTurnsInsolvent = isInsolvent
    ? current.consecutiveTurnsInsolvent + 1
    : 0;

  return {
    balance: newBalance,
    netFlowPerTurn: netFlow,
    income,
    expenses,
    consecutiveTurnsInsolvent,
  };
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Returns true when the insolvency failure condition is met:
 * treasury has been at or below zero with negative net flow for the required turns (§10.4).
 */
export function checkInsolvency(treasury: TreasuryState): boolean {
  return treasury.consecutiveTurnsInsolvent >= TREASURY_CONSECUTIVE_TURNS_INSOLVENT;
}

