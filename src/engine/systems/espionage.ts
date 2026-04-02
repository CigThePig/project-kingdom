// gameplay-blueprint.md §4.10 — Espionage and Intelligence
// Pure engine logic for intelligence operations, network management, and counter-intelligence.
// No React imports. No player-facing text.

import {
  EspionageState,
  IntelligenceFundingLevel,
  IntelligenceOperationType,
  IntelligenceReport,
} from '../types';
import {
  ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE,
  ESPIONAGE_NETWORK_GROWTH_BY_FUNDING,
  INTELLIGENCE_NETWORK_MAX,
  INTELLIGENCE_NETWORK_MIN,
} from '../constants';

// ============================================================
// Operation Result Type (local — not a GameState type)
// ============================================================

/**
 * The result of a resolved intelligence operation.
 * Produced by resolveOperation and consumed by the turn-resolution engine
 * to update EspionageState and build IntelligenceReport records.
 */
export interface OperationResult {
  success: boolean;
  report: IntelligenceReport | null; // null when operation fails with no findings
  networkStrengthDelta: number;      // negative when agents are exposed
  diplomaticIncidentTriggered: boolean; // true only on Sabotage failures
  falseIntelligenceInjected: boolean;   // true when a planted false report is returned
}

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
 * Calculates the success probability for an operation.
 *
 * Formula:
 *   probability = BASE_SUCCESS[opType] + (networkStrength - targetCapability) / 200
 * Clamped to [0.1, 0.9] — no operation is guaranteed to succeed or fail (§4.10).
 */
export function calculateOperationSuccessProbability(
  networkStrength: number,
  operationType: IntelligenceOperationType,
  targetEspionageCapability: number,
): number {
  const base = ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE[operationType];
  const networkBonus = (networkStrength - targetEspionageCapability) / 200;
  return clamp(base + networkBonus, 0.1, 0.9);
}

/**
 * Returns the net change to networkStrength from funding policy this turn.
 * Growth rates are pre-costed (include baseline decay) in ESPIONAGE_NETWORK_GROWTH_BY_FUNDING.
 */
export function calculateNetworkChange(
  current: EspionageState,
  fundingLevel: IntelligenceFundingLevel,
): number {
  const delta = ESPIONAGE_NETWORK_GROWTH_BY_FUNDING[fundingLevel];
  const projected = current.networkStrength + delta;
  // Don't let the delta push past bounds
  if (projected < INTELLIGENCE_NETWORK_MIN) return INTELLIGENCE_NETWORK_MIN - current.networkStrength;
  if (projected > INTELLIGENCE_NETWORK_MAX) return INTELLIGENCE_NETWORK_MAX - current.networkStrength;
  return delta;
}

/**
 * Returns the per-turn counter-intelligence level gain.
 * Higher stability and military caste loyalty improve defensive security (§4.10).
 */
export function calculateCounterIntelligenceGrowth(
  fundingLevel: IntelligenceFundingLevel,
  stabilityValue: number,
  militaryCasteSatisfaction: number,
): number {
  const fundingBonus = ESPIONAGE_NETWORK_GROWTH_BY_FUNDING[fundingLevel] * 0.5;
  const stabilityBonus = stabilityValue > 60 ? 1 : 0;
  const casteBonus = militaryCasteSatisfaction > 70 ? 1 : 0;
  return clamp(fundingBonus + stabilityBonus + casteBonus, -2, 5);
}

// ============================================================
// Exported Operation Resolver
// ============================================================

/**
 * Resolves a single intelligence operation and returns the full result.
 *
 * The randomSeed parameter makes this function pure and deterministic —
 * the turn-resolution engine provides a seed (e.g. Math.random() result)
 * so the same seed always produces the same outcome. This enables save/replay.
 *
 * False intelligence mechanics (§4.10):
 * - If the target has high espionage capability (>70) and the operation "succeeds",
 *   there is a 25% chance the result is planted false intelligence.
 * - False intelligence is returned with `isGenuine: false` and `isCorrectionPending: true`.
 *   The UI layer must NEVER surface `isGenuine` directly — the correction arrives next turn.
 *
 * Agent exposure (§4.10):
 * - A failed operation with a roll below 0.2 relative to probability exposes agents,
 *   causing additional network strength loss.
 */
export function resolveOperation(
  operationType: IntelligenceOperationType,
  targetId: string,
  networkStrength: number,
  targetEspionageCapability: number,
  turnNumber: number,
  randomSeed: number,
): OperationResult {
  const successProbability = calculateOperationSuccessProbability(
    networkStrength,
    operationType,
    targetEspionageCapability,
  );

  const success = randomSeed < successProbability;

  if (!success) {
    // Check for agent exposure: low roll relative to success threshold indicates compromised op
    const exposureThreshold = successProbability * 0.25;
    const agentsExposed = randomSeed < exposureThreshold;
    const networkDelta = agentsExposed ? -8 : 0;

    // Sabotage failures may trigger a diplomatic incident (§4.10)
    const diplomaticIncident =
      operationType === IntelligenceOperationType.Sabotage && agentsExposed;

    return {
      success: false,
      report: null,
      networkStrengthDelta: networkDelta,
      diplomaticIncidentTriggered: diplomaticIncident,
      falseIntelligenceInjected: false,
    };
  }

  // Successful operation — check for false intelligence injection
  const falsePlantThreshold = 0.25;
  const canPlantFalseIntel = targetEspionageCapability > 70;
  // Use a secondary derived random value to avoid colliding with the success roll
  const falseIntelRoll = (randomSeed * 7.3 + 0.1) % 1;
  const isFalseIntelligence = canPlantFalseIntel && falseIntelRoll < falsePlantThreshold;

  const findingsCode = buildFindingsCode(operationType, targetId, turnNumber);

  const report: IntelligenceReport = {
    id: `intel-${turnNumber}-${targetId}-${operationType}`,
    operationType,
    targetId,
    findings: findingsCode,
    confidenceLevel: Math.round(successProbability * 100),
    // IMPORTANT: isGenuine is engine-only. The UI layer must NOT surface this field.
    isGenuine: !isFalseIntelligence,
    isCorrectionPending: isFalseIntelligence,
    turnGenerated: turnNumber,
  };

  return {
    success: true,
    report,
    networkStrengthDelta: 0,
    diplomaticIncidentTriggered: false,
    falseIntelligenceInjected: isFalseIntelligence,
  };
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Applies all per-operation network strength deltas and funding-driven growth
 * to produce a new EspionageState.
 */
export function applyEspionageUpdate(
  current: EspionageState,
  fundingLevel: IntelligenceFundingLevel,
  networkStrengthDeltas: number[],
): EspionageState {
  const operationDelta = networkStrengthDeltas.reduce((sum, d) => sum + d, 0);
  const fundingDelta = calculateNetworkChange(current, fundingLevel);
  const newNetworkStrength = clamp(
    current.networkStrength + operationDelta + fundingDelta,
    INTELLIGENCE_NETWORK_MIN,
    INTELLIGENCE_NETWORK_MAX,
  );
  return { ...current, networkStrength: newNetworkStrength };
}

// ============================================================
// Exported Validators
// ============================================================

/**
 * Determines whether a foreign espionage operation against the kingdom is blocked
 * by the kingdom's counter-intelligence capability.
 *
 * Uses randomSeed for pure/deterministic resolution (same contract as resolveOperation).
 */
export function checkCounterIntelligenceBlock(
  counterIntelligenceLevel: number,
  attackerNetworkStrength: number,
  randomSeed: number,
): boolean {
  const blockProbability = clamp(
    (counterIntelligenceLevel - attackerNetworkStrength) / 200 + 0.3,
    0.05,
    0.85,
  );
  return randomSeed < blockProbability;
}

// ============================================================
// Internal Helpers
// ============================================================

/**
 * Builds an internal findings code string for an operation result.
 * This is NOT player-facing text — it is an internal code used by the
 * event and reporting systems to generate appropriate text in the data layer.
 */
function buildFindingsCode(
  operationType: IntelligenceOperationType,
  targetId: string,
  turnNumber: number,
): string {
  return `${operationType.toLowerCase()}-${targetId}-t${turnNumber}`;
}
