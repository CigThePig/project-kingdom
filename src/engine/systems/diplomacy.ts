// gameplay-blueprint.md §4.9 — Diplomacy
// Pure engine logic for neighbor relationship dynamics and AI behavior.
// No React imports. No player-facing text.

import {
  ConflictState,
  DiplomaticAgreement,
  DiplomaticPosture,
  DiplomacyState,
  EspionageState,
  MilitaryState,
  NeighborAction,
  NeighborActionType,
  NeighborDisposition,
  NeighborState,
} from '../types';
import {
  DIPLOMACY_AI_DELTA_BY_DISPOSITION,
  DIPLOMACY_POSTURE_THRESHOLDS,
  DIPLOMACY_SHARED_CULTURE_BONUS,
  DIPLOMACY_SHARED_FAITH_BONUS,
  ESPIONAGE_EXPOSURE_RELATIONSHIP_PENALTY,
  ESPIONAGE_EXPOSURE_TENSION_ID,
  NEIGHBOR_AI_ACTION_COOLDOWN,
  NEIGHBOR_AI_DEMAND_THRESHOLD,
  NEIGHBOR_AI_MILITARY_ATTRITION_RATE,
  NEIGHBOR_AI_MILITARY_BUILDUP_RATE,
  NEIGHBOR_AI_MILITARY_BUILDUP_THRESHOLD,
  NEIGHBOR_AI_PEACE_OFFER_WAR_WEARINESS,
  NEIGHBOR_AI_RELIGIOUS_PRESSURE_HETERODOXY_DELTA,
  NEIGHBOR_AI_TRADE_PROPOSAL_THRESHOLD,
  NEIGHBOR_AI_TRADE_WITHDRAWAL_THRESHOLD,
  NEIGHBOR_AI_TREATY_PROPOSAL_THRESHOLD,
  NEIGHBOR_AI_WAR_DECLARATION_THRESHOLD,
  NEIGHBOR_AI_WAR_WEARINESS_PER_TURN,
  TRADE_AI_PROPOSAL_AGREEMENT_TURNS,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Derives the DiplomaticPosture label from a relationship score.
 * Uses DIPLOMACY_POSTURE_THRESHOLDS: score ≤ threshold → that posture.
 * Evaluated in ascending order so the lowest matching threshold wins.
 */
export function deriveDiplomaticPosture(relationshipScore: number): DiplomaticPosture {
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.War]) {
    return DiplomaticPosture.War;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Hostile]) {
    return DiplomaticPosture.Hostile;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Tense]) {
    return DiplomaticPosture.Tense;
  }
  if (relationshipScore <= DIPLOMACY_POSTURE_THRESHOLDS[DiplomaticPosture.Neutral]) {
    return DiplomaticPosture.Neutral;
  }
  return DiplomaticPosture.Friendly;
}

/**
 * Returns true when a neighbor's posture is War (§4.9).
 */
export function isAtWar(neighbor: NeighborState): boolean {
  return neighbor.attitudePosture === DiplomaticPosture.War;
}

/**
 * Calculates the faith and culture alignment bonus/penalty between the kingdom
 * and a specific neighbor.
 *
 * Shared faith tradition → DIPLOMACY_SHARED_FAITH_BONUS (additive, §4.9).
 * Shared cultural identity → DIPLOMACY_SHARED_CULTURE_BONUS (additive).
 * Mismatched faith → negative penalty of equal magnitude.
 * Mismatched culture → smaller negative penalty.
 */
export function calculateFaithCultureAlignmentBonus(
  kingdomFaithTraditionId: string,
  kingdomCultureIdentityId: string,
  neighbor: NeighborState,
): number {
  const faithMatch = neighbor.religiousProfile === kingdomFaithTraditionId;
  const cultureMatch = neighbor.culturalIdentity === kingdomCultureIdentityId;

  const faithBonus = faithMatch
    ? DIPLOMACY_SHARED_FAITH_BONUS
    : -Math.round(DIPLOMACY_SHARED_FAITH_BONUS * 0.5);

  const cultureBonus = cultureMatch
    ? DIPLOMACY_SHARED_CULTURE_BONUS
    : -Math.round(DIPLOMACY_SHARED_CULTURE_BONUS * 0.5);

  return faithBonus + cultureBonus;
}

/**
 * Calculates the AI-driven relationship score delta for a neighbor this turn.
 *
 * Drivers (§4.9):
 * - Disposition baseline: each disposition has a natural per-turn drift.
 * - Kingdom military strength: strong kingdoms deter Aggressive neighbors.
 * - Kingdom stability: unstable kingdoms invite Opportunistic and Aggressive pressure.
 * - Shared faith/culture: alignment provides a standing relationship stabilizer.
 *
 * Aggressive neighbors apply an additional -4 penalty if kingdom stability < 40.
 */
export function calculateAIRelationshipDelta(
  neighbor: NeighborState,
  kingdomMilitaryStrength: number,
  kingdomStabilityValue: number,
  sharedFaith: boolean,
  sharedCulture: boolean,
): number {
  const dispositionDelta = DIPLOMACY_AI_DELTA_BY_DISPOSITION[neighbor.disposition];

  // Aggressive neighbors are deterred by military strength
  const militaryDeterrence =
    neighbor.disposition === NeighborDisposition.Aggressive
      ? Math.round((kingdomMilitaryStrength - 50) * 0.04)
      : 0;

  // Opportunistic and Aggressive neighbors exploit instability
  const instabilityExploitation =
    (neighbor.disposition === NeighborDisposition.Aggressive ||
      neighbor.disposition === NeighborDisposition.Opportunistic) &&
    kingdomStabilityValue < 40
      ? -2
      : 0;

  // Mercantile neighbors appreciate stable trading partners
  const stabilityBonus =
    neighbor.disposition === NeighborDisposition.Mercantile && kingdomStabilityValue > 60
      ? 1
      : 0;

  // Faith/culture alignment provides a standing soft bonus
  const alignmentBonus = (sharedFaith ? 1 : 0) + (sharedCulture ? 0.5 : 0);

  const rawDelta =
    dispositionDelta +
    militaryDeterrence +
    instabilityExploitation +
    stabilityBonus +
    alignmentBonus;

  return clamp(rawDelta, -8, 5);
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies a player-initiated diplomatic action delta to a specific neighbor.
 * Clamps the resulting relationship score to [0, 100] and re-derives posture.
 * Returns a new NeighborState[] (immutable update).
 */
export function applyDiplomaticActionEffect(
  neighbors: NeighborState[],
  targetNeighborId: string,
  relationshipDelta: number,
): NeighborState[] {
  return neighbors.map((n) => {
    if (n.id !== targetNeighborId) return n;
    const newScore = clamp(n.relationshipScore + relationshipDelta, 0, 100);
    return {
      ...n,
      relationshipScore: newScore,
      attitudePosture: deriveDiplomaticPosture(newScore),
    };
  });
}

/**
 * Decrements turnsRemaining on all active timed agreements.
 * Removes agreements that have expired (turnsRemaining reaches 0).
 * Indefinite agreements (turnsRemaining === null) are untouched.
 * Returns a new NeighborState[] (immutable update).
 */
export function tickDiplomaticAgreements(neighbors: NeighborState[]): NeighborState[] {
  return neighbors.map((n) => {
    const updatedAgreements = n.activeAgreements
      .map((agreement: DiplomaticAgreement) => {
        if (agreement.turnsRemaining === null) return agreement;
        return { ...agreement, turnsRemaining: agreement.turnsRemaining - 1 };
      })
      .filter(
        (agreement: DiplomaticAgreement) =>
          agreement.turnsRemaining === null || agreement.turnsRemaining > 0,
      );
    return { ...n, activeAgreements: updatedAgreements };
  });
}

/**
 * Applies per-turn AI relationship deltas to all neighbors and re-derives their postures.
 * relationshipDeltas: Record<neighborId, delta> — pre-computed by resolution engine.
 * Returns a new DiplomacyState (immutable update).
 */
export function applyDiplomacyUpdate(
  current: DiplomacyState,
  relationshipDeltas: Record<string, number>,
): DiplomacyState {
  const updatedNeighbors = current.neighbors.map((n) => {
    const delta = relationshipDeltas[n.id] ?? 0;
    const newScore = clamp(n.relationshipScore + delta, 0, 100);
    return {
      ...n,
      relationshipScore: newScore,
      attitudePosture: deriveDiplomaticPosture(newScore),
    };
  });

  return { ...current, neighbors: updatedNeighbors };
}

// ============================================================
// AI Neighbor Autonomous Behavior (§9)
// ============================================================

/**
 * Evaluates whether a neighbor should declare war based on disposition,
 * relationship score, player weakness, and military strength comparison.
 * Only Aggressive and Opportunistic neighbors initiate war.
 */
export function shouldDeclareWar(
  neighbor: NeighborState,
  playerMilitaryStrength: number,
  playerStability: number,
  rng: number,
): boolean {
  if (neighbor.isAtWarWithPlayer) return false;
  if (neighbor.relationshipScore > NEIGHBOR_AI_WAR_DECLARATION_THRESHOLD) return false;

  const isAggressive = neighbor.disposition === NeighborDisposition.Aggressive;
  const isOpportunistic = neighbor.disposition === NeighborDisposition.Opportunistic;
  if (!isAggressive && !isOpportunistic) return false;

  // Aggressive neighbors are more willing; opportunistic need clear advantage.
  const militaryAdvantage = neighbor.militaryStrength - playerMilitaryStrength;
  const instabilityFactor = playerStability < 30 ? 0.2 : 0;

  const warChance = isAggressive
    ? 0.3 + (militaryAdvantage > 0 ? 0.2 : 0) + instabilityFactor
    : 0.1 + (militaryAdvantage > 10 ? 0.3 : 0) + instabilityFactor;

  return rng < warChance;
}

/**
 * Generates autonomous actions for a neighbor based on current game state evaluation.
 * Each neighbor evaluates: military strength, diplomatic stance, trade value,
 * stability, intelligence exposure, religious alignment (§9.2).
 * Returns an array of actions (typically 0 or 1 per turn).
 */
export function generateNeighborActions(
  neighbor: NeighborState,
  playerMilitary: MilitaryState,
  playerStability: number,
  playerTreasury: number,
  playerEspionage: EspionageState,
  kingdomFaith: string,
  kingdomCulture: string,
  currentTurn: number,
  activeConflicts: ConflictState[],
  rng: number,
): NeighborAction[] {
  const actions: NeighborAction[] = [];

  // Respect action cooldown — no spam.
  if (currentTurn - neighbor.lastActionTurn < NEIGHBOR_AI_ACTION_COOLDOWN) {
    return actions;
  }

  const inConflict = activeConflicts.some((c) => c.neighborId === neighbor.id);
  const playerMilStr = clamp(
    (playerMilitary.readiness + playerMilitary.morale + playerMilitary.equipmentCondition) / 3,
    0,
    100,
  );

  // --- Espionage detection (§9.2) — can fire regardless of war status ---
  const espionageExposureChance = clamp(
    (neighbor.espionageCapability - playerEspionage.networkStrength) * 0.005,
    0,
    0.15,
  );
  if (espionageExposureChance > 0 && rng < espionageExposureChance) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.EspionageRetaliation,
      turnGenerated: currentTurn,
      parameters: { severity: 'detected' },
    });
  }

  // --- Religious pressure — can fire regardless of war status ---
  const faithMismatch = neighbor.religiousProfile !== kingdomFaith;
  if (
    faithMismatch &&
    (neighbor.disposition === NeighborDisposition.Aggressive ||
      neighbor.disposition === NeighborDisposition.Cautious) &&
    rng < 0.1
  ) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.ReligiousPressure,
      turnGenerated: currentTurn,
      parameters: { heterodoxyDelta: NEIGHBOR_AI_RELIGIOUS_PRESSURE_HETERODOXY_DELTA },
    });
  }

  // --- Cultural pressure — can fire regardless of war status ---
  const cultureMismatch = neighbor.culturalIdentity !== kingdomCulture;
  if (
    cultureMismatch &&
    (neighbor.disposition === NeighborDisposition.Aggressive ||
      neighbor.disposition === NeighborDisposition.Opportunistic) &&
    rng < 0.08
  ) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.BorderTension,
      turnGenerated: currentTurn,
      parameters: { cause: 'cultural_mismatch' },
    });
  }

  // --- At War: consider peace offer, then stop ---
  if (neighbor.isAtWarWithPlayer && inConflict) {
    if (neighbor.warWeariness >= NEIGHBOR_AI_PEACE_OFFER_WAR_WEARINESS) {
      actions.push({
        neighborId: neighbor.id,
        actionType: NeighborActionType.PeaceOffer,
        turnGenerated: currentTurn,
        parameters: { warWeariness: neighbor.warWeariness },
      });
    }
    return actions;
  }

  // --- War Declaration ---
  if (shouldDeclareWar(neighbor, playerMilStr, playerStability, rng)) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.WarDeclaration,
      turnGenerated: currentTurn,
      parameters: {},
    });
    return actions;
  }

  // --- Hostile/Tense behaviors ---
  if (neighbor.relationshipScore <= NEIGHBOR_AI_MILITARY_BUILDUP_THRESHOLD) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.MilitaryBuildup,
      turnGenerated: currentTurn,
      parameters: {},
    });
    return actions;
  }

  if (neighbor.relationshipScore <= NEIGHBOR_AI_DEMAND_THRESHOLD) {
    // Aggressive and Opportunistic neighbors issue demands.
    if (
      neighbor.disposition === NeighborDisposition.Aggressive ||
      neighbor.disposition === NeighborDisposition.Opportunistic
    ) {
      actions.push({
        neighborId: neighbor.id,
        actionType: NeighborActionType.Demand,
        turnGenerated: currentTurn,
        parameters: { treasuryDemand: Math.round(playerTreasury * 0.1) },
      });
      return actions;
    }
    // Other dispositions create border tensions.
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.BorderTension,
      turnGenerated: currentTurn,
      parameters: {},
    });
    return actions;
  }

  // --- Trade proposals / withdrawals ---
  const hasTradeAgreement = neighbor.activeAgreements.some(
    (a) => a.agreementId.startsWith('trade_'),
  );

  if (!hasTradeAgreement && neighbor.relationshipScore >= NEIGHBOR_AI_TRADE_PROPOSAL_THRESHOLD) {
    // Mercantile neighbors are eager to trade.
    const tradeChance =
      neighbor.disposition === NeighborDisposition.Mercantile ? 0.5 : 0.2;
    if (rng < tradeChance) {
      actions.push({
        neighborId: neighbor.id,
        actionType: NeighborActionType.TradeProposal,
        turnGenerated: currentTurn,
        parameters: { agreementTurns: TRADE_AI_PROPOSAL_AGREEMENT_TURNS },
      });
      return actions;
    }
  }

  if (hasTradeAgreement && neighbor.relationshipScore < NEIGHBOR_AI_TRADE_WITHDRAWAL_THRESHOLD) {
    actions.push({
      neighborId: neighbor.id,
      actionType: NeighborActionType.TradeWithdrawal,
      turnGenerated: currentTurn,
      parameters: {},
    });
    return actions;
  }

  // --- Treaty proposals ---
  if (neighbor.relationshipScore >= NEIGHBOR_AI_TREATY_PROPOSAL_THRESHOLD) {
    const hasNonTradeAgreement = neighbor.activeAgreements.some(
      (a) => !a.agreementId.startsWith('trade_'),
    );
    if (!hasNonTradeAgreement && rng < 0.15) {
      actions.push({
        neighborId: neighbor.id,
        actionType: NeighborActionType.TreatyProposal,
        turnGenerated: currentTurn,
        parameters: {},
      });
      return actions;
    }
  }

  return actions;
}

/**
 * Handles neighbor reaction to discovered espionage operations.
 * Returns relationship delta and optional tension addition.
 */
export function handleEspionageExposure(
  neighbor: NeighborState,
  currentTurn: number,
): { relationshipDelta: number; tensionId: string | null; action: NeighborAction | null } {
  const alreadyHasTension = neighbor.outstandingTensions.includes(ESPIONAGE_EXPOSURE_TENSION_ID);
  const relationshipDelta = ESPIONAGE_EXPOSURE_RELATIONSHIP_PENALTY;
  const tensionId = alreadyHasTension ? null : ESPIONAGE_EXPOSURE_TENSION_ID;

  // Aggressive neighbors retaliate with border tensions.
  let action: NeighborAction | null = null;
  if (neighbor.disposition === NeighborDisposition.Aggressive) {
    action = {
      neighborId: neighbor.id,
      actionType: NeighborActionType.EspionageRetaliation,
      turnGenerated: currentTurn,
      parameters: { severity: 'hostile' },
    };
  }

  return { relationshipDelta, tensionId, action };
}

/**
 * Updates neighbor military strength based on disposition and conflict state.
 * Hostile neighbors build up; neighbors in conflict suffer attrition.
 */
export function updateNeighborMilitaryStrength(
  neighbor: NeighborState,
  isInConflict: boolean,
  conflictAdvantage: number,
): number {
  let delta = 0;

  if (isInConflict) {
    // Attrition during conflict; worse when losing.
    const attritionMultiplier = conflictAdvantage > 0 ? 1.5 : 1.0;
    delta = -Math.round(NEIGHBOR_AI_MILITARY_ATTRITION_RATE * attritionMultiplier);
  } else if (neighbor.relationshipScore <= NEIGHBOR_AI_MILITARY_BUILDUP_THRESHOLD) {
    delta = NEIGHBOR_AI_MILITARY_BUILDUP_RATE;
  }

  return clamp(neighbor.militaryStrength + delta, 5, 100);
}

/**
 * Updates neighbor war weariness. Increases during conflict, decays during peace.
 */
export function updateNeighborWarWeariness(
  neighbor: NeighborState,
  isInConflict: boolean,
): number {
  if (isInConflict) {
    return clamp(neighbor.warWeariness + NEIGHBOR_AI_WAR_WEARINESS_PER_TURN, 0, 100);
  }
  // Slow decay during peace.
  return clamp(neighbor.warWeariness - 3, 0, 100);
}

/**
 * Applies a war declaration: sets neighbor to war posture, marks isAtWarWithPlayer.
 */
export function applyWarDeclaration(
  neighbors: NeighborState[],
  neighborId: string,
): NeighborState[] {
  return neighbors.map((n) => {
    if (n.id !== neighborId) return n;
    return {
      ...n,
      relationshipScore: 0,
      attitudePosture: DiplomaticPosture.War,
      isAtWarWithPlayer: true,
    };
  });
}

/**
 * Applies a peace resolution: elevates relationship to Tense, clears war state.
 */
export function applyPeaceResolution(
  neighbors: NeighborState[],
  neighborId: string,
): NeighborState[] {
  return neighbors.map((n) => {
    if (n.id !== neighborId) return n;
    return {
      ...n,
      relationshipScore: 25,
      attitudePosture: DiplomaticPosture.Tense,
      isAtWarWithPlayer: false,
      warWeariness: 0,
    };
  });
}
