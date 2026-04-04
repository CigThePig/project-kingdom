// gameplay-blueprint.md §4.6 — Military
// Pure engine logic for force readiness, morale, equipment, and upkeep.
// No React imports. No player-facing text.

import {
  ClassState,
  ConflictPhase,
  ConflictResolutionOutcome,
  ConflictState,
  GameState,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  MilitaryState,
  NeighborState,
  PopulationClass,
} from '../types';
import {
  CONFLICT_CAMPAIGN_TO_SIEGE_ADVANTAGE,
  CONFLICT_CASTE_QUALITY_WEIGHT,
  CONFLICT_CASUALTY_RATE,
  CONFLICT_DEFEAT_ADVANTAGE_THRESHOLD,
  CONFLICT_DEFEAT_COMMONER_SAT_PENALTY,
  CONFLICT_DEFEAT_MILITARY_CASTE_SAT_PENALTY,
  CONFLICT_DEFEAT_NOBILITY_SAT_PENALTY,
  CONFLICT_DEFEAT_RELATIONSHIP_PENALTY,
  CONFLICT_DEFEAT_TERRITORY_LOSS_CHANCE,
  CONFLICT_EQUIPMENT_WEIGHT,
  CONFLICT_FOOD_DRAIN_PER_TURN,
  CONFLICT_FORCE_RATIO_MAX_ADVANTAGE,
  CONFLICT_INTELLIGENCE_WEIGHT,
  CONFLICT_KNOWLEDGE_WEIGHT,
  CONFLICT_MAX_CAMPAIGN_TURNS,
  CONFLICT_MORALE_BONUS_WINNING,
  CONFLICT_MORALE_PENALTY_LOSING,
  CONFLICT_MORALE_WEIGHT,
  CONFLICT_RANDOMNESS_RANGE,
  CONFLICT_READINESS_WEIGHT,
  CONFLICT_SKIRMISH_TO_CAMPAIGN_TURNS,
  CONFLICT_STABILITY_PENALTY_PER_CONFLICT,
  CONFLICT_TERRAIN_WEIGHT,
  CONFLICT_TREASURY_DRAIN_PER_TURN,
  CONFLICT_VICTORY_ADVANTAGE_THRESHOLD,
  CONFLICT_VICTORY_COMMONER_SAT_BONUS,
  CONFLICT_VICTORY_MILITARY_CASTE_SAT_BONUS,
  CONFLICT_VICTORY_NOBILITY_SAT_BONUS,
  CONFLICT_VICTORY_RELATIONSHIP_BOOST,
  CONFLICT_VICTORY_TREASURY_PLUNDER,
  MILITARY_EQUIPMENT_DECAY_BY_POSTURE,
  MILITARY_READINESS_DECAY_BY_POSTURE,
  MILITARY_READINESS_MAX,
  MILITARY_READINESS_MIN,
  MILITARY_UPKEEP_COST_PER_SOLDIER,
  MILITARY_UPKEEP_POSTURE_MULTIPLIER,
} from '../constants';
import { deriveDiplomaticPosture } from './diplomacy';

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

// ============================================================
// Conflict Resolution (§6.2)
// ============================================================

/**
 * Calculates the combat power score for the player's military.
 * Weighted composite of readiness, equipment, morale, caste quality,
 * terrain, intelligence, and knowledge (§6.2).
 * Returns 0–100 range.
 */
export function calculatePlayerCombatPower(
  military: MilitaryState,
  terrainAdvantage: number,
  knowledgeMilitaryBonus: number,
): number {
  const score =
    military.readiness * CONFLICT_READINESS_WEIGHT +
    military.equipmentCondition * CONFLICT_EQUIPMENT_WEIGHT +
    military.morale * CONFLICT_MORALE_WEIGHT +
    military.militaryCasteQuality * CONFLICT_CASTE_QUALITY_WEIGHT +
    terrainAdvantage * CONFLICT_TERRAIN_WEIGHT +
    military.intelligenceAdvantage * CONFLICT_INTELLIGENCE_WEIGHT +
    knowledgeMilitaryBonus * CONFLICT_KNOWLEDGE_WEIGHT;

  return clamp(Math.round(score), 0, 100);
}

/**
 * Calculates the combat power score for a neighboring kingdom.
 * Simplified: uses militaryStrength and espionageCapability.
 */
export function calculateNeighborCombatPower(
  neighbor: NeighborState,
): number {
  // Neighbors have a single militaryStrength that represents their composite power.
  // espionageCapability contributes as their intelligence advantage.
  const score =
    neighbor.militaryStrength * 0.85 +
    neighbor.espionageCapability * 0.15;

  return clamp(Math.round(score), 0, 100);
}

/**
 * Resolves one turn of an active conflict.
 * Compares combat power, applies force ratio advantage, adds randomness.
 * Returns outcome including advantage shift, casualties, and resolution status.
 */
export function resolveConflictTurn(
  conflict: ConflictState,
  playerCombatPower: number,
  neighborCombatPower: number,
  playerForceSize: number,
  neighborMilitaryStrength: number,
  rng: number,
): ConflictResolutionOutcome {
  // Force ratio advantage: larger army gets a bonus.
  const forceRatio = playerForceSize > 0
    ? clamp((playerForceSize / 1000) / Math.max(neighborMilitaryStrength / 50, 0.5), 0.2, 3)
    : 0.2;
  const forceAdvantage = clamp(
    (forceRatio - 1) * CONFLICT_FORCE_RATIO_MAX_ADVANTAGE,
    -CONFLICT_FORCE_RATIO_MAX_ADVANTAGE,
    CONFLICT_FORCE_RATIO_MAX_ADVANTAGE,
  );

  // Combat power differential.
  const powerDiff = playerCombatPower - neighborCombatPower;

  // Random factor: controlled randomness between -RANGE and +RANGE.
  const randomFactor = (rng * 2 - 1) * CONFLICT_RANDOMNESS_RANGE;

  // Advantage shift this turn.
  const advantageShift = Math.round(powerDiff * 0.3 + forceAdvantage + randomFactor);
  const newAdvantage = clamp(conflict.playerAdvantage + advantageShift, -100, 100);

  // Casualties based on conflict phase.
  const casualtyRate = CONFLICT_CASUALTY_RATE[conflict.phase] ?? CONFLICT_CASUALTY_RATE['Skirmish'];
  const playerCasualties = Math.round(playerForceSize * casualtyRate);
  const neighborCasualties = Math.round(neighborMilitaryStrength * casualtyRate * 10);

  // Check for resolution.
  const turnsTotal = conflict.turnsElapsed + 1;
  const isVictory = newAdvantage >= CONFLICT_VICTORY_ADVANTAGE_THRESHOLD;
  const isDefeat = newAdvantage <= CONFLICT_DEFEAT_ADVANTAGE_THRESHOLD;
  const isMaxTurns = turnsTotal >= CONFLICT_MAX_CAMPAIGN_TURNS;

  const isResolved = isVictory || isDefeat || isMaxTurns;
  let playerVictory: boolean | null = null;
  let outcomeCode = 'ongoing';

  if (isResolved) {
    if (isVictory) {
      playerVictory = true;
      outcomeCode = 'decisive_victory';
    } else if (isDefeat) {
      playerVictory = false;
      outcomeCode = 'decisive_defeat';
    } else {
      // Max turns reached: whoever has advantage wins; tie = stalemate (treated as draw).
      playerVictory = newAdvantage > 0 ? true : newAdvantage < 0 ? false : null;
      outcomeCode = playerVictory === true
        ? 'attritional_victory'
        : playerVictory === false
          ? 'attritional_defeat'
          : 'stalemate';
    }
  }

  return {
    advantageShift,
    playerCasualties,
    neighborCasualties,
    outcomeCode,
    isResolved,
    playerVictory,
  };
}

/**
 * Advances a conflict's phase based on turns elapsed and advantage.
 * Skirmish → Campaign after SKIRMISH_TO_CAMPAIGN_TURNS.
 * Campaign → Siege if player advantage drops below CAMPAIGN_TO_SIEGE_ADVANTAGE.
 */
export function advanceConflictPhase(
  conflict: ConflictState,
): ConflictState {
  let phase = conflict.phase;

  if (
    phase === ConflictPhase.Skirmish &&
    conflict.turnsElapsed >= CONFLICT_SKIRMISH_TO_CAMPAIGN_TURNS
  ) {
    phase = ConflictPhase.Campaign;
  }

  if (
    phase === ConflictPhase.Campaign &&
    conflict.playerAdvantage <= CONFLICT_CAMPAIGN_TO_SIEGE_ADVANTAGE
  ) {
    phase = ConflictPhase.Siege;
  }

  return phase !== conflict.phase ? { ...conflict, phase } : conflict;
}

/**
 * Calculates per-turn war costs (treasury drain, food drain, stability penalty).
 */
export function calculateWarCosts(
  conflict: ConflictState,
): { treasuryDrain: number; foodDrain: number; stabilityPenalty: number } {
  const phaseMultiplier =
    conflict.phase === ConflictPhase.Siege
      ? 1.5
      : conflict.phase === ConflictPhase.Campaign
        ? 1.0
        : 0.5;

  return {
    treasuryDrain: Math.round(CONFLICT_TREASURY_DRAIN_PER_TURN * phaseMultiplier),
    foodDrain: Math.round(CONFLICT_FOOD_DRAIN_PER_TURN * phaseMultiplier),
    stabilityPenalty: CONFLICT_STABILITY_PENALTY_PER_CONFLICT,
  };
}

/**
 * Calculates morale impact from an active conflict's current advantage.
 */
export function calculateConflictMoraleImpact(
  conflict: ConflictState,
): number {
  if (conflict.playerAdvantage > 10) {
    return CONFLICT_MORALE_BONUS_WINNING;
  }
  if (conflict.playerAdvantage < -10) {
    return -CONFLICT_MORALE_PENALTY_LOSING;
  }
  return 0;
}

/**
 * Creates a new ConflictState for a freshly declared war.
 */
export function initiateConflict(
  neighborId: string,
  currentTurn: number,
  targetRegionId: string | null,
): ConflictState {
  return {
    id: `conflict_${neighborId}_t${currentTurn}`,
    neighborId,
    phase: ConflictPhase.Skirmish,
    turnStarted: currentTurn,
    turnsElapsed: 0,
    playerAdvantage: 0,
    targetRegionId,
    playerCasualties: 0,
    neighborCasualties: 0,
    lastOutcomeCode: 'initiated',
  };
}

/**
 * Applies consequences of a resolved conflict to game state.
 * Victory: treasury plunder, relationship ripple to other neighbors, satisfaction bonuses.
 * Defeat: possible territory loss, satisfaction penalties, diplomatic weakness.
 */
export function applyConflictConsequences(
  state: GameState,
  conflict: ConflictState,
  playerVictory: boolean,
  rng: number,
): GameState {
  let s = state;

  if (playerVictory) {
    // Treasury plunder.
    s = {
      ...s,
      treasury: {
        ...s.treasury,
        balance: s.treasury.balance + CONFLICT_VICTORY_TREASURY_PLUNDER,
      },
    };

    // Satisfaction bonuses.
    s = {
      ...s,
      population: {
        ...s.population,
        [PopulationClass.MilitaryCaste]: {
          ...s.population[PopulationClass.MilitaryCaste],
          satisfaction: clamp(
            s.population[PopulationClass.MilitaryCaste].satisfaction +
              CONFLICT_VICTORY_MILITARY_CASTE_SAT_BONUS,
            0,
            100,
          ),
        },
        [PopulationClass.Nobility]: {
          ...s.population[PopulationClass.Nobility],
          satisfaction: clamp(
            s.population[PopulationClass.Nobility].satisfaction +
              CONFLICT_VICTORY_NOBILITY_SAT_BONUS,
            0,
            100,
          ),
        },
        [PopulationClass.Commoners]: {
          ...s.population[PopulationClass.Commoners],
          satisfaction: clamp(
            s.population[PopulationClass.Commoners].satisfaction +
              CONFLICT_VICTORY_COMMONER_SAT_BONUS,
            0,
            100,
          ),
        },
      },
    };

    // Other neighbors gain respect.
    const updatedNeighbors = s.diplomacy.neighbors.map((n) => {
      if (n.id === conflict.neighborId) return n;
      const newScore = clamp(n.relationshipScore + CONFLICT_VICTORY_RELATIONSHIP_BOOST, 0, 100);
      return {
        ...n,
        relationshipScore: newScore,
        attitudePosture: deriveDiplomaticPosture(newScore),
      };
    });
    s = { ...s, diplomacy: { ...s.diplomacy, neighbors: updatedNeighbors } };
  } else {
    // Defeat consequences.
    // Satisfaction penalties.
    s = {
      ...s,
      population: {
        ...s.population,
        [PopulationClass.MilitaryCaste]: {
          ...s.population[PopulationClass.MilitaryCaste],
          satisfaction: clamp(
            s.population[PopulationClass.MilitaryCaste].satisfaction +
              CONFLICT_DEFEAT_MILITARY_CASTE_SAT_PENALTY,
            0,
            100,
          ),
        },
        [PopulationClass.Nobility]: {
          ...s.population[PopulationClass.Nobility],
          satisfaction: clamp(
            s.population[PopulationClass.Nobility].satisfaction +
              CONFLICT_DEFEAT_NOBILITY_SAT_PENALTY,
            0,
            100,
          ),
        },
        [PopulationClass.Commoners]: {
          ...s.population[PopulationClass.Commoners],
          satisfaction: clamp(
            s.population[PopulationClass.Commoners].satisfaction +
              CONFLICT_DEFEAT_COMMONER_SAT_PENALTY,
            0,
            100,
          ),
        },
      },
    };

    // Diplomatic ripple: other neighbors lose respect.
    const updatedNeighbors = s.diplomacy.neighbors.map((n) => {
      if (n.id === conflict.neighborId) return n;
      const newScore = clamp(n.relationshipScore + CONFLICT_DEFEAT_RELATIONSHIP_PENALTY, 0, 100);
      return {
        ...n,
        relationshipScore: newScore,
        attitudePosture: deriveDiplomaticPosture(newScore),
      };
    });
    s = { ...s, diplomacy: { ...s.diplomacy, neighbors: updatedNeighbors } };

    // Territory loss chance.
    if (
      conflict.targetRegionId !== null &&
      rng < CONFLICT_DEFEAT_TERRITORY_LOSS_CHANCE
    ) {
      s = {
        ...s,
        regions: s.regions.map((r) =>
          r.id === conflict.targetRegionId ? { ...r, isOccupied: true } : r,
        ),
      };
    }
  }

  return s;
}

