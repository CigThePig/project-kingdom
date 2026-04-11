// gameplay-blueprint.md §4.4, §4.7 — Population Classes and Stability
// Pure engine logic for class satisfaction dynamics and stability recalculation.
// No React imports. No player-facing text.

import {
  ClassState,
  FestivalInvestmentLevel,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  MilitaryState,
  PopulationClass,
  PopulationState,
  ReligiousTolerance,
  StabilityState,
  StyleAxis,
  TaxationLevel,
  TradeOpenness,
} from '../types';
import {
  SATISFACTION_BREAKING_POINT,
  SATISFACTION_MAX_DELTA_PER_TURN,
  STABILITY_CLASS_WEIGHTS,
  STABILITY_COLLAPSE_THRESHOLD,
  STABILITY_CONSECUTIVE_TURNS_FOR_COLLAPSE,
  STABILITY_CULTURAL_COHESION_WEIGHT,
  STABILITY_DECREE_PACE_DRAG_PER_EXCESS_ACTION,
  STABILITY_FAITH_WEIGHT,
  STABILITY_FOOD_SECURITY_WEIGHT,
  STABILITY_MAX,
  STABILITY_MIN,
  OVERTHROW_INTRIGUE_THRESHOLD,
  OVERTHROW_CONSECUTIVE_TURNS,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Maps a satisfaction-level policy enum to a rough "pressure" number.
// High taxation → high pressure on affected classes; Low → low pressure.
function taxationPressure(level: TaxationLevel): number {
  switch (level) {
    case TaxationLevel.Low:
      return -1; // relief
    case TaxationLevel.Moderate:
      return 0;
    case TaxationLevel.High:
      return 1;
    case TaxationLevel.Punitive:
      return 3;
  }
}

// ============================================================
// Exported Class-Specific Satisfaction Calculators
// ============================================================

/**
 * Calculates the satisfaction delta for Nobility this turn.
 *
 * Drivers (§4.4):
 * - Taxation level on their estates: high taxation hurts nobility directly.
 * - Perceived influence: high stability signals political security.
 * - Military credibility: rising readiness signals competent rule.
 * - Merchant/clergy ascendancy: high satisfaction of rival classes threatens noble status.
 */
export function calculateNobilitySatisfactionDelta(
  current: ClassState,
  taxationLevel: TaxationLevel,
  stabilityValue: number,
  militaryReadinessDelta: number,
  merchantSatisfaction: number,
  clergySatisfaction: number,
): number {
  const taxPressure = -taxationPressure(taxationLevel) * 1.5; // nobility hit hardest by taxes
  const stabilityBonus = (stabilityValue - 50) * 0.04; // stability above 50 reassures nobility
  const readinessBonus = militaryReadinessDelta * 0.1;
  const rivalThreat = -((merchantSatisfaction + clergySatisfaction) / 2 - 50) * 0.03;

  return clampSatisfactionDelta(current.satisfaction, taxPressure + stabilityBonus + readinessBonus + rivalThreat);
}

/**
 * Calculates the satisfaction delta for Clergy this turn.
 *
 * Drivers (§4.4):
 * - Religious tolerance policy: Favored/Enforced boosts; Suppressed hurts.
 * - Faith level: high faith validates clergy's institutional role.
 * - Festival investment: lavish observances reflect royal piety.
 * - Heterodoxy pressure: rising heterodoxy signals weakening authority.
 */
export function calculateClergySatisfactionDelta(
  current: ClassState,
  religiousTolerance: ReligiousTolerance,
  faithLevel: number,
  festivalInvestmentLevel: FestivalInvestmentLevel,
  heterodoxy: number,
): number {
  const toleranceBonus = toleranceClergyBonus(religiousTolerance);
  const faithBonus = (faithLevel - 50) * 0.04;
  const festivalBonus = festivalClergyBonus(festivalInvestmentLevel);
  const heterodoxyPenalty = -(heterodoxy / 100) * 3;

  return clampSatisfactionDelta(
    current.satisfaction,
    toleranceBonus + faithBonus + festivalBonus + heterodoxyPenalty,
  );
}

/**
 * Calculates the satisfaction delta for Merchants this turn.
 *
 * Drivers (§4.4):
 * - Trade openness policy: more open → more income → happier merchants.
 * - Taxation level: high taxes reduce merchant profit margins.
 * - Trade income delta: rising income signals prosperity; falling signals trouble.
 */
export function calculateMerchantsSatisfactionDelta(
  current: ClassState,
  tradeOpenness: TradeOpenness,
  taxationLevel: TaxationLevel,
  tradeIncomeDelta: number,
): number {
  const tradeBonus = tradeOpennessMerchantBonus(tradeOpenness);
  const taxPenalty = -taxationPressure(taxationLevel) * 0.8;
  const incomeTrendBonus = clamp(tradeIncomeDelta * 0.05, -2, 2);

  return clampSatisfactionDelta(
    current.satisfaction,
    tradeBonus + taxPenalty + incomeTrendBonus,
  );
}

/**
 * Calculates the satisfaction delta for Commoners this turn.
 *
 * Drivers (§4.4):
 * - Food reserves: the strongest single driver — commoners feel hunger most acutely.
 * - Taxation burden: direct impact on living standards.
 * - Military recruitment: conscription reduces commoner freedom and labor.
 * - Faith level: religious comfort provides psychological stability.
 */
export function calculateCommonersSatisfactionDelta(
  current: ClassState,
  foodReserves: number,
  taxationLevel: TaxationLevel,
  militaryRecruitmentStance: MilitaryRecruitmentStance,
  faithLevel: number,
): number {
  const foodBonus = foodReserveCommoner(foodReserves);
  const taxPenalty = -taxationPressure(taxationLevel) * 1.0;
  const recruitmentPenalty = recruitmentCommoner(militaryRecruitmentStance);
  const faithBonus = (faithLevel - 50) * 0.02;

  return clampSatisfactionDelta(
    current.satisfaction,
    foodBonus + taxPenalty + recruitmentPenalty + faithBonus,
  );
}

/**
 * Calculates the satisfaction delta for the Military Caste this turn.
 *
 * Drivers (§4.4):
 * - Treasury balance: pay reliability is paramount — empty coffers signal neglect.
 * - Equipment condition: professional warriors demand quality arms.
 * - Morale: high morale reflects pride and purpose.
 * - Posture: Mobilized/Aggressive implies active deployment — meaningful but draining.
 */
export function calculateMilitaryCasteSatisfactionDelta(
  current: ClassState,
  treasuryBalance: number,
  militaryEquipmentCondition: number,
  militaryMorale: number,
  military: MilitaryState,
): number {
  const payBonus = treasuryBalance > 200 ? 1 : treasuryBalance > 0 ? 0 : -3;
  const equipmentBonus = (militaryEquipmentCondition - 50) * 0.04;
  const moraleBonus = (militaryMorale - 50) * 0.03;
  const postureBonus = postureMillitaryCaste(military.deploymentPosture);

  return clampSatisfactionDelta(
    current.satisfaction,
    payBonus + equipmentBonus + moraleBonus + postureBonus,
  );
}

// ============================================================
// Exported Clamping Utility
// ============================================================

/**
 * Clamps a satisfaction delta to the per-turn maximum change rate.
 * Satisfaction shifts are gradual, not instant (§4.4).
 * Returns the final clamped delta (not the new satisfaction value).
 */
export function clampSatisfactionDelta(current: number, delta: number): number {
  const clamped = clamp(delta, -SATISFACTION_MAX_DELTA_PER_TURN, SATISFACTION_MAX_DELTA_PER_TURN);
  // Further clamp so satisfaction never exceeds [0, 100]
  const newSatisfaction = clamp(current + clamped, 0, 100);
  return newSatisfaction - current;
}

// ============================================================
// Exported Ruling Style Satisfaction Modifier
// ============================================================

/**
 * Returns a per-class satisfaction modifier based on the current ruling style axes.
 * Each axis favors one class and disfavors another (see RULING_STYLE_CLASS_AFFINITY).
 * The modifier is additive and typically ranges from −2 to +2.
 */
export function calculateStyleSatisfactionModifiers(
  axes: Record<StyleAxis, number>,
): Record<PopulationClass, number> {
  const modifiers = {} as Record<PopulationClass, number>;
  for (const cls of Object.values(PopulationClass)) {
    modifiers[cls] = 0;
  }

  // Authority: Nobility favors authoritarian (+), Commoners disfavor
  modifiers[PopulationClass.Nobility]     += (axes[StyleAxis.Authority] / 50) * 2;
  modifiers[PopulationClass.Commoners]    -= (axes[StyleAxis.Authority] / 50) * 2;

  // Economy: Merchants favor mercantilist (+), Commoners disfavor
  modifiers[PopulationClass.Merchants]    += (axes[StyleAxis.Economy] / 50) * 2;
  modifiers[PopulationClass.Commoners]    -= (axes[StyleAxis.Economy] / 50) * 2;

  // Military: MilitaryCaste favors martial (+), Commoners disfavor
  modifiers[PopulationClass.MilitaryCaste] += (axes[StyleAxis.Military] / 50) * 2;
  modifiers[PopulationClass.Commoners]     -= (axes[StyleAxis.Military] / 50) * 2;

  // Faith: Clergy favors theocratic (+), Merchants disfavor
  modifiers[PopulationClass.Clergy]       += (axes[StyleAxis.Faith] / 50) * 2;
  modifiers[PopulationClass.Merchants]    -= (axes[StyleAxis.Faith] / 50) * 2;

  return modifiers;
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies all class satisfaction deltas to produce a new PopulationState.
 * Each delta is already clamped by the caller via clampSatisfactionDelta.
 * Returns a new PopulationState (immutable update).
 */
export function applyPopulationSatisfactionDeltas(
  current: PopulationState,
  deltas: Record<PopulationClass, number>,
): PopulationState {
  const updated = { ...current };
  for (const cls of Object.values(PopulationClass)) {
    const delta = deltas[cls];
    const prev = current[cls];
    updated[cls] = {
      ...prev,
      satisfaction: clamp(prev.satisfaction + delta, 0, 100),
      satisfactionDeltaLastTurn: delta,
    };
  }
  return updated;
}

/**
 * Recalculates intrigueRisk on the Nobility ClassState based on their satisfaction.
 * Low noble satisfaction correlates with heightened conspiracy risk (§4.4).
 */
export function updateNobilityIntrigueRisk(nobilityState: ClassState): ClassState {
  // Intrigue risk is inverse of satisfaction: 100 satisfaction → 0 risk, 0 satisfaction → 100 risk.
  const intrigueRisk = clamp(100 - nobilityState.satisfaction, 0, 100);
  return { ...nobilityState, intrigueRisk };
}

// ============================================================
// Exported Stability Calculation (§6.1 Phase 8)
// ============================================================

/**
 * Recalculates overall stability as a weighted composite.
 *
 * Formula (§4.7):
 *   stability = Σ(class.satisfaction × classWeight)
 *               + foodSecurityScore × FOOD_WEIGHT
 *               + faithLevel × FAITH_WEIGHT
 *               + culturalCohesion × CULTURAL_COHESION_WEIGHT
 *               − max(0, actionsAbove2) × DECREE_PACE_DRAG
 *
 * Result clamped to [0, 100]. Also tracks consecutiveTurnsAtZero for collapse detection.
 */
export function calculateStability(
  population: PopulationState,
  foodSecurityScore: number,
  faithLevel: number,
  culturalCohesion: number,
  actionsTakenThisTurn: number,
  current: StabilityState,
): StabilityState {
  const classContributions = {} as Record<PopulationClass, number>;
  let classTotal = 0;

  for (const cls of Object.values(PopulationClass)) {
    const weight = STABILITY_CLASS_WEIGHTS[cls];
    const contribution = population[cls].satisfaction * weight;
    classContributions[cls] = contribution;
    classTotal += contribution;
  }

  const foodContribution = foodSecurityScore * STABILITY_FOOD_SECURITY_WEIGHT;
  const faithContribution = faithLevel * STABILITY_FAITH_WEIGHT;
  const culturalCohesionContribution = culturalCohesion * STABILITY_CULTURAL_COHESION_WEIGHT;
  const excessActions = Math.max(0, actionsTakenThisTurn - 2);
  const decreePaceDrag = -(excessActions * STABILITY_DECREE_PACE_DRAG_PER_EXCESS_ACTION);
  const decreePaceContribution = decreePaceDrag;

  const rawValue =
    classTotal +
    foodContribution +
    faithContribution +
    culturalCohesionContribution +
    decreePaceContribution;

  const value = clamp(rawValue, STABILITY_MIN, STABILITY_MAX);
  const atZero = value <= STABILITY_COLLAPSE_THRESHOLD;
  const consecutiveTurnsAtZero = atZero ? current.consecutiveTurnsAtZero + 1 : 0;

  return {
    value,
    consecutiveTurnsAtZero,
    classContributions,
    foodSecurityContribution: foodContribution,
    faithContribution,
    culturalCohesionContribution,
    decreePaceContribution,
  };
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Returns the set of classes currently at or below the breaking point threshold.
 * A non-empty result means class-specific crisis events should be evaluated (§4.4).
 */
export function getClassesAtBreakingPoint(population: PopulationState): PopulationClass[] {
  return Object.values(PopulationClass).filter(
    (cls) => population[cls].satisfaction <= SATISFACTION_BREAKING_POINT,
  );
}

/**
 * Returns true when the collapse failure condition is met:
 * stability has been at zero for the required number of consecutive turns (§10.4).
 */
export function checkCollapse(stability: StabilityState): boolean {
  return stability.consecutiveTurnsAtZero >= STABILITY_CONSECUTIVE_TURNS_FOR_COLLAPSE;
}

/**
 * Returns true when the overthrow failure condition is met:
 * nobility intrigue risk has been at or above the threshold while any class
 * is at the breaking point for the required number of consecutive turns (§10.4).
 */
export function checkOverthrow(consecutiveTurnsOverthrowRisk: number): boolean {
  return consecutiveTurnsOverthrowRisk >= OVERTHROW_CONSECUTIVE_TURNS;
}

/**
 * Evaluates whether the current turn qualifies as an "overthrow risk" turn.
 * Returns true when nobility intrigue risk is high AND at least one class is at breaking point.
 */
export function isOverthrowRiskActive(population: PopulationState): boolean {
  const nobilityIntrigue = population[PopulationClass.Nobility].intrigueRisk ?? 0;
  if (nobilityIntrigue < OVERTHROW_INTRIGUE_THRESHOLD) return false;
  return getClassesAtBreakingPoint(population).length > 0;
}

// ============================================================
// Internal Satisfaction Driver Helpers
// ============================================================

function toleranceClergyBonus(religiousTolerance: ReligiousTolerance): number {
  switch (religiousTolerance) {
    case ReligiousTolerance.Enforced:
      return 2; // clergy benefits from state enforcement of their authority
    case ReligiousTolerance.Favored:
      return 1;
    case ReligiousTolerance.Tolerated:
      return -1;
    case ReligiousTolerance.Suppressed:
      return -3; // actively damages clergy satisfaction
  }
}

function festivalClergyBonus(level: FestivalInvestmentLevel): number {
  switch (level) {
    case FestivalInvestmentLevel.None:
      return -1;
    case FestivalInvestmentLevel.Modest:
      return 0;
    case FestivalInvestmentLevel.Standard:
      return 1;
    case FestivalInvestmentLevel.Lavish:
      return 2;
  }
}

function tradeOpennessMerchantBonus(openness: TradeOpenness): number {
  switch (openness) {
    case TradeOpenness.Closed:
      return -3;
    case TradeOpenness.Restricted:
      return -1;
    case TradeOpenness.Open:
      return 1;
    case TradeOpenness.Encouraged:
      return 3;
  }
}

function foodReserveCommoner(foodReserves: number): number {
  if (foodReserves <= 0) return -4;
  if (foodReserves < 50) return -2;
  if (foodReserves < 100) return 0;
  if (foodReserves < 200) return 1;
  return 2; // ample reserves signal security
}

function recruitmentCommoner(stance: MilitaryRecruitmentStance): number {
  switch (stance) {
    case MilitaryRecruitmentStance.Minimal:
      return 1;
    case MilitaryRecruitmentStance.Voluntary:
      return 0;
    case MilitaryRecruitmentStance.Conscript:
      return -2;
    case MilitaryRecruitmentStance.WarFooting:
      return -4;
  }
}

function postureMillitaryCaste(posture: MilitaryPosture): number {
  switch (posture) {
    case MilitaryPosture.Defensive:
      return 0;
    case MilitaryPosture.Standby:
      return 0;
    case MilitaryPosture.Mobilized:
      return 1; // sense of purpose
    case MilitaryPosture.Aggressive:
      return 2; // active campaign — glory and risk
  }
}
