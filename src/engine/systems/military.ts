// gameplay-blueprint.md §4.6 — Military
// Pure engine logic for force readiness, morale, equipment, and upkeep.
// No React imports. No player-facing text.

import {
  ClassState,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  MilitaryState,
} from '../types';
import {
  MILITARY_EQUIPMENT_DECAY_BY_POSTURE,
  MILITARY_READINESS_DECAY_BY_POSTURE,
  MILITARY_READINESS_MAX,
  MILITARY_READINESS_MIN,
  MILITARY_UPKEEP_COST_PER_SOLDIER,
  MILITARY_UPKEEP_POSTURE_MULTIPLIER,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Natural attrition rate as a fraction of force size per turn on Minimal recruitment.
const ATTRITION_RATE_MINIMAL = 0.01;
// Conscript growth rate per turn as a fraction of commoner population.
const CONSCRIPT_GROWTH_RATE = 0.002;
// WarFooting growth rate per turn as a fraction of commoner + military caste population.
const WAR_FOOTING_GROWTH_RATE = 0.004;
// Voluntary recruitment rate per turn (natural enlistment).
const VOLUNTARY_ENLISTMENT_RATE = 0.0005;

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Returns the per-turn readiness decay for the given posture.
 * Higher postures cause more wear without active maintenance (§4.6).
 */
export function calculateReadinessDecay(posture: MilitaryPosture): number {
  return MILITARY_READINESS_DECAY_BY_POSTURE[posture];
}

/**
 * Returns the per-turn readiness gain when an active training order is in effect.
 * Quality of gain is boosted by military caste satisfaction.
 */
export function calculateReadinessGain(
  militaryCasteQuality: number,
  isTrainingOrderActive: boolean,
): number {
  if (!isTrainingOrderActive) return 0;
  // Base gain is 3; high-quality caste adds up to 2 more.
  return 3 + (militaryCasteQuality / 100) * 2;
}

/**
 * Returns the per-turn morale delta.
 *
 * Drivers (§4.6):
 * - Treasury balance: poor pay degrades morale.
 * - Military caste satisfaction: caste pride and loyalty reflects morale.
 * - Deployment posture: Mobilized/Aggressive implies active service — slight morale boost.
 */
export function calculateMoraleDelta(
  treasuryBalance: number,
  militaryCasteSatisfaction: number,
  posture: MilitaryPosture,
): number {
  const paySignal = treasuryBalance > 200 ? 1 : treasuryBalance > 0 ? 0 : -2;
  const casteSignal = (militaryCasteSatisfaction - 50) * 0.05;
  const postureBonus = posture === MilitaryPosture.Mobilized || posture === MilitaryPosture.Aggressive ? 1 : 0;
  return clamp(paySignal + casteSignal + postureBonus, -5, 5);
}

/**
 * Returns the per-turn equipment condition decay for the given posture.
 * Active deployment accelerates equipment wear (§4.6).
 */
export function calculateEquipmentDecay(posture: MilitaryPosture): number {
  return MILITARY_EQUIPMENT_DECAY_BY_POSTURE[posture];
}

/**
 * Calculates the per-turn force size delta based on recruitment stance.
 *
 * - Minimal: slight natural attrition.
 * - Voluntary: small steady enlistment offsets attrition.
 * - Conscript: active conscription from commoner pool.
 * - WarFooting: mass mobilisation drawing from commoners and military caste.
 */
export function calculateForceSizeDelta(
  stance: MilitaryRecruitmentStance,
  commoners: ClassState,
  militaryCaste: ClassState,
  currentForceSize: number,
): number {
  switch (stance) {
    case MilitaryRecruitmentStance.Minimal:
      return -Math.round(currentForceSize * ATTRITION_RATE_MINIMAL);
    case MilitaryRecruitmentStance.Voluntary: {
      const enlistment = Math.round(
        (commoners.population + militaryCaste.population) * VOLUNTARY_ENLISTMENT_RATE,
      );
      const attrition = Math.round(currentForceSize * ATTRITION_RATE_MINIMAL);
      return enlistment - attrition;
    }
    case MilitaryRecruitmentStance.Conscript:
      return Math.round(commoners.population * CONSCRIPT_GROWTH_RATE);
    case MilitaryRecruitmentStance.WarFooting:
      return Math.round(
        (commoners.population + militaryCaste.population) * WAR_FOOTING_GROWTH_RATE,
      );
  }
}

/**
 * Returns the per-turn military upkeep treasury burden.
 * Also stored on MilitaryState.upkeepBurdenPerTurn for the treasury system.
 */
export function calculateMilitaryUpkeepBurden(
  forceSize: number,
  posture: MilitaryPosture,
): number {
  return clamp(
    forceSize * MILITARY_UPKEEP_COST_PER_SOLDIER * MILITARY_UPKEEP_POSTURE_MULTIPLIER[posture],
    0,
    Infinity,
  );
}

/**
 * Derives militaryCasteQuality (0–100) from military caste satisfaction.
 * Quality is a direct mapping: satisfaction = quality for this field.
 */
export function deriveMilitaryCasteQuality(militaryCasteSatisfaction: number): number {
  return clamp(militaryCasteSatisfaction, 0, 100);
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies all deltas to produce a new MilitaryState.
 * intelligenceAdvantage is managed by espionage.ts and passed through unchanged.
 */
export function applyMilitaryUpdate(
  current: MilitaryState,
  readinessDelta: number,
  moraleDelta: number,
  equipmentDelta: number,
  forceSizeDelta: number,
  newUpkeepBurden: number,
  newCasteQuality: number,
): MilitaryState {
  return {
    ...current,
    readiness: clamp(current.readiness + readinessDelta, MILITARY_READINESS_MIN, MILITARY_READINESS_MAX),
    morale: clamp(current.morale + moraleDelta, 0, 100),
    equipmentCondition: clamp(current.equipmentCondition + equipmentDelta, 0, 100),
    forceSize: clamp(current.forceSize + forceSizeDelta, 0, Infinity),
    upkeepBurdenPerTurn: newUpkeepBurden,
    militaryCasteQuality: newCasteQuality,
    // intelligenceAdvantage is set by espionage.ts; left unchanged here
  };
}

