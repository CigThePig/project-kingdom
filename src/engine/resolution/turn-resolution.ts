// gameplay-blueprint.md §6 — Turn Resolution Framework
// Orchestrates the 11-phase consequence chain for a single game turn.
// No React imports. No player-facing text.

import {
  ActionType,
  ActiveEvent,
  ConflictState,
  ConstructionProject,
  CrownBarData,
  EventSeverity,
  FailureCondition,
  FailureWarning,
  GameState,
  IntelligenceOperationType,
  IntelligenceReport,
  KnowledgeBranch,
  NeighborAction,
  NeighborActionType,
  PersistentConsequence,
  PopulationClass,
  QueuedAction,
  ReligiousOrderType,
  ResourceState,
  ResourceType,
  StorylineStatus,
  TurnHistoryEntry,
  TurnState,
} from '../types';
import {
  SEASON_MONTHS,
  OVERTHROW_CONSECUTIVE_TURNS,
} from '../constants';
import { advanceEventChains, EventDefinition, surfaceEvents } from '../events/event-engine';
import { processDueFollowUps, scheduleFollowUps } from '../events/follow-up-tracker';
import { calculateCategoryWeights, createInitialPacingState, updateClassFavorFromChoice, updatePacingForSurfacedEvents } from '../events/narrative-pacing';
import {
  advanceStorylines,
  evaluateStorylinePool,
  StorylineDefinition,
} from '../events/storyline-engine';
import { applyMechanicalEffectDelta, applyStorylineResolutionEffects } from '../events/apply-event-effects';
import { STORYLINE_RESOLUTION_EFFECTS } from '../../data/storylines/effects';
import { resetActionBudgetForNextTurn } from './action-budget';
import { summarizeRegionalOutputs, checkTotalConquest, getOccupiedFraction, applyRegionDevelopmentChange } from '../systems/regions';
import {
  calculateTaxationIncome,
  calculateIncome,
  calculateExpenses,
  applyTreasuryFlow,
  checkInsolvency,
} from '../systems/treasury';
import { calculateTradeIncome } from '../systems/trade';
import {
  calculateFoodProduction,
  calculateFoodConsumption,
  applyFoodFlow,
  computeFoodSecurityScore,
  checkFamine,
} from '../systems/food';
import {
  calculateNobilitySatisfactionDelta,
  calculateClergySatisfactionDelta,
  calculateMerchantsSatisfactionDelta,
  calculateCommonersSatisfactionDelta,
  calculateMilitaryCasteSatisfactionDelta,
  applyPopulationSatisfactionDeltas,
  updateNobilityIntrigueRisk,
  calculateStability,
  checkCollapse,
  checkOverthrow,
  isOverthrowRiskActive,
} from '../systems/population';
import {
  calculateReadinessDecay,
  calculateReadinessGain,
  calculateMoraleDelta,
  calculateEquipmentDecay,
  calculateForceSizeDelta,
  calculateMilitaryUpkeepBurden,
  deriveMilitaryCasteQuality,
  applyMilitaryUpdate,
} from '../systems/military';
import {
  calculateFaithDelta,
  calculateCulturalCohesionDelta,
  calculateHeterodoxyDelta,
  applyFaithCultureUpdate,
} from '../systems/faith';
import {
  resolveOperation,
  applyEspionageUpdate,
  calculateCounterIntelligenceGrowth,
} from '../systems/espionage';
import {
  calculateResearchProgressThisTurn,
  applyKnowledgeProgress,
  checkMilestoneUnlock,
  applyMilestoneUnlock,
  getAgriculturalBonus,
  getMilitaryBonus,
  getTradeBonus,
  getCulturalBonus,
} from '../systems/knowledge';
import {
  calculateAIRelationshipDelta,
  applyDiplomacyUpdate,
  deriveDiplomaticPosture,
  tickDiplomaticAgreements,
  generateNeighborActions,
  handleEspionageExposure,
  updateNeighborMilitaryStrength,
  updateNeighborWarWeariness,
  applyWarDeclaration,
  applyPeaceResolution,
} from '../systems/diplomacy';
import {
  calculatePlayerCombatPower,
  calculateNeighborCombatPower,
  resolveConflictTurn,
  advanceConflictPhase,
  calculateWarCosts,
  calculateConflictMoraleImpact,
  initiateConflict,
  applyConflictConsequences,
} from '../systems/military';
import { EVENT_POOL } from '../../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../../data/events/effects';
import { STORYLINE_POOL } from '../../data/storylines/index';
import { findConstructionDefinition } from '../../data/construction/index';

// ============================================================
// Public Types
// ============================================================

/**
 * Callback provided by the data layer to apply player action effects.
 * Until the data layer is built (Phase 5), pass an identity function: `(s) => s`.
 */
export type ApplyActionEffectsFn = (state: GameState, actions: QueuedAction[]) => GameState;

/**
 * The result of resolving one turn. Contains the complete next GameState
 * plus metadata about what occurred during resolution.
 */
export interface TurnResolutionResult {
  nextState: GameState;
  historyEntry: TurnHistoryEntry;
  newlyUnlockedMilestones: Array<{ branch: KnowledgeBranch; milestoneIndex: number }>;
  triggeredFailureConditions: FailureCondition[];
  failureWarnings: FailureWarning[];
  completedConstructionIds: string[];
  // Intelligence reports generated this turn. The hook layer appends these to
  // SaveFile.intelligenceReports so the player can review operation outcomes.
  generatedReports: IntelligenceReport[];
}

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getSeasonForMonth(month: number): TurnState['season'] {
  const entries = Object.entries(SEASON_MONTHS) as [
    TurnState['season'],
    readonly [number, number, number],
  ][];
  for (const [season, months] of entries) {
    if ((months as readonly number[]).includes(month)) {
      return season;
    }
  }
  // Unreachable: SEASON_MONTHS covers all 12 months exactly once.
  return 'Spring' as TurnState['season'];
}

function isIntelligenceOperationType(value: unknown): value is IntelligenceOperationType {
  return (
    typeof value === 'string' &&
    (Object.values(IntelligenceOperationType) as string[]).includes(value)
  );
}

// ============================================================
// Core Resolution Function
// ============================================================

/**
 * Resolves a single game turn following the 11-phase order from §6.
 *
 * Each phase is a pure transformation of the game state. State is threaded
 * immutably through all phases and assembled into a new GameState at the end.
 *
 * @param state - The GameState at the start of this turn (before any resolution).
 * @param applyActionEffects - Data-layer callback that applies the effects of player
 *   actions (decrees, construction orders, policy changes, etc.). Pass `(s) => s`
 *   until the data layer is implemented.
 */
export function resolveTurn(
  state: GameState,
  applyActionEffects: ApplyActionEffectsFn,
  eventHistory: ActiveEvent[] = [],
): TurnResolutionResult {
  // ---- Phase 1: Income and Production ----
  // Compute all regional outputs in one pass; reused by downstream calculations.
  const regionalSummary = summarizeRegionalOutputs(state.regions);

  // Update resource stockpiles from regional extraction this turn.
  const phase1Resources: ResourceState = {
    [ResourceType.Wood]: {
      stockpile: Math.max(
        0,
        state.resources[ResourceType.Wood].stockpile +
          regionalSummary.resourceOutputs[ResourceType.Wood],
      ),
      extractionRatePerTurn: regionalSummary.resourceOutputs[ResourceType.Wood],
    },
    [ResourceType.Iron]: {
      stockpile: Math.max(
        0,
        state.resources[ResourceType.Iron].stockpile +
          regionalSummary.resourceOutputs[ResourceType.Iron],
      ),
      extractionRatePerTurn: regionalSummary.resourceOutputs[ResourceType.Iron],
    },
    [ResourceType.Stone]: {
      stockpile: Math.max(
        0,
        state.resources[ResourceType.Stone].stockpile +
          regionalSummary.resourceOutputs[ResourceType.Stone],
      ),
      extractionRatePerTurn: regionalSummary.resourceOutputs[ResourceType.Stone],
    },
  };

  // Calculate income from pre-action state.
  const neighborRelScores: Record<string, number> = {};
  for (const n of state.diplomacy.neighbors) {
    neighborRelScores[n.id] = n.relationshipScore;
  }

  const taxationIncome = calculateTaxationIncome(
    state.policies.taxationLevel,
    state.population[PopulationClass.Nobility].satisfaction,
    state.population[PopulationClass.Merchants].satisfaction,
    state.regions,
  );

  const tradeIncome = calculateTradeIncome(
    state.population[PopulationClass.Merchants].satisfaction,
    state.policies.tradeOpenness,
    neighborRelScores,
    regionalSummary.tradeModifier,
    getTradeBonus(state.knowledge),
  );

  const incomeBreakdown = calculateIncome(taxationIncome, tradeIncome, 0);

  // Food production uses commoner labor and regional food output from pre-action state.
  const foodProduction = calculateFoodProduction(
    state.population[PopulationClass.Commoners],
    regionalSummary.foodOutput,
    state.turn.season,
    getAgriculturalBonus(state.knowledge),
  );

  // ---- Phase 2: Action Execution ----
  // Pass updated resources into action effects so actions can read the current stockpiles.
  let stateAfterActions = applyActionEffects(
    { ...state, resources: phase1Resources },
    state.actionBudget.queuedActions,
  );

  // ---- Phase 2b: Temporary Modifier Tick ----
  // Apply ongoing effects from temporary modifiers, then decrement and expire.
  for (const modifier of stateAfterActions.activeTemporaryModifiers) {
    stateAfterActions = applyMechanicalEffectDelta(
      stateAfterActions,
      modifier.effectPerTurn,
      null,
    );
  }
  stateAfterActions = {
    ...stateAfterActions,
    activeTemporaryModifiers: stateAfterActions.activeTemporaryModifiers
      .map((m) => ({ ...m, turnsRemaining: m.turnsRemaining - 1 }))
      .filter((m) => m.turnsRemaining > 0),
  };

  // Compute readiness delta after actions so deploymentPosture changes take effect.
  const readinessDecay = calculateReadinessDecay(stateAfterActions.military.deploymentPosture);
  const readinessGain = calculateReadinessGain(stateAfterActions.military.militaryCasteQuality, false);
  const readinessDelta = readinessGain - readinessDecay;

  // ---- Phase 3: Upkeep and Consumption ----
  // Construction gold cost: placeholder 0 until data layer defines per-project gold costs.
  const constructionCostThisTurn = 0;

  const expenseBreakdown = calculateExpenses(
    stateAfterActions.military,
    stateAfterActions.faithCulture.activeOrders,
    stateAfterActions.policies.intelligenceFundingLevel,
    stateAfterActions.policies.festivalInvestmentLevel,
    constructionCostThisTurn,
  );

  let updatedTreasury = applyTreasuryFlow(
    stateAfterActions.treasury,
    incomeBreakdown,
    expenseBreakdown,
  );

  const foodConsumption = calculateFoodConsumption(
    stateAfterActions.population,
    stateAfterActions.policies.rationingLevel,
    stateAfterActions.policies.militaryRecruitmentStance,
    stateAfterActions.military.forceSize,
  );

  let updatedFood = applyFoodFlow(stateAfterActions.food, foodProduction, foodConsumption);

  // ---- Phase 4: Population and Class Dynamics ----
  // Trade income trend used by merchants satisfaction delta.
  const tradeIncomeDelta = tradeIncome - state.treasury.income.trade;

  const satisfactionDeltas = {
    [PopulationClass.Nobility]: calculateNobilitySatisfactionDelta(
      stateAfterActions.population[PopulationClass.Nobility],
      stateAfterActions.policies.taxationLevel,
      stateAfterActions.stability.value,
      readinessDelta,
      stateAfterActions.population[PopulationClass.Merchants].satisfaction,
      stateAfterActions.population[PopulationClass.Clergy].satisfaction,
    ),
    [PopulationClass.Clergy]: calculateClergySatisfactionDelta(
      stateAfterActions.population[PopulationClass.Clergy],
      stateAfterActions.policies.religiousTolerance,
      stateAfterActions.faithCulture.faithLevel,
      stateAfterActions.policies.festivalInvestmentLevel,
      stateAfterActions.faithCulture.heterodoxy,
    ),
    [PopulationClass.Merchants]: calculateMerchantsSatisfactionDelta(
      stateAfterActions.population[PopulationClass.Merchants],
      stateAfterActions.policies.tradeOpenness,
      stateAfterActions.policies.taxationLevel,
      tradeIncomeDelta,
    ),
    [PopulationClass.Commoners]: calculateCommonersSatisfactionDelta(
      stateAfterActions.population[PopulationClass.Commoners],
      updatedFood.reserves,
      stateAfterActions.policies.taxationLevel,
      stateAfterActions.policies.militaryRecruitmentStance,
      stateAfterActions.faithCulture.faithLevel,
    ),
    [PopulationClass.MilitaryCaste]: calculateMilitaryCasteSatisfactionDelta(
      stateAfterActions.population[PopulationClass.MilitaryCaste],
      updatedTreasury.balance,
      stateAfterActions.military.equipmentCondition,
      stateAfterActions.military.morale,
      stateAfterActions.military,
    ),
  };

  const populationAfterDeltas = applyPopulationSatisfactionDeltas(
    stateAfterActions.population,
    satisfactionDeltas,
  );

  // Update nobility intrigue risk from new satisfaction.
  let updatedPopulation = {
    ...populationAfterDeltas,
    [PopulationClass.Nobility]: updateNobilityIntrigueRisk(
      populationAfterDeltas[PopulationClass.Nobility],
    ),
  };

  // ---- Phase 5: Military, Diplomacy, Intelligence ----
  const moraleDelta = calculateMoraleDelta(
    updatedTreasury.balance,
    updatedPopulation[PopulationClass.MilitaryCaste].satisfaction,
    stateAfterActions.military.deploymentPosture,
  );

  const equipmentDelta = -calculateEquipmentDecay(stateAfterActions.military.deploymentPosture);

  const forceSizeDelta = calculateForceSizeDelta(
    stateAfterActions.policies.militaryRecruitmentStance,
    updatedPopulation[PopulationClass.Commoners],
    updatedPopulation[PopulationClass.MilitaryCaste],
    stateAfterActions.military.forceSize,
  );

  const newCasteQuality = deriveMilitaryCasteQuality(
    updatedPopulation[PopulationClass.MilitaryCaste].satisfaction,
  );

  const newUpkeepBurden = calculateMilitaryUpkeepBurden(
    Math.max(0, stateAfterActions.military.forceSize + forceSizeDelta),
    stateAfterActions.military.deploymentPosture,
  );

  const militaryAfterUpdate = applyMilitaryUpdate(
    stateAfterActions.military,
    readinessDelta,
    moraleDelta,
    equipmentDelta,
    forceSizeDelta,
    newUpkeepBurden,
    newCasteQuality,
  );

  // Diplomacy: AI relationship drift for all neighbors.
  const aiRelationshipDeltas: Record<string, number> = {};
  for (const neighbor of stateAfterActions.diplomacy.neighbors) {
    const sharedFaith =
      neighbor.religiousProfile === stateAfterActions.faithCulture.kingdomFaithTraditionId;
    const sharedCulture =
      neighbor.culturalIdentity === stateAfterActions.faithCulture.kingdomCultureIdentityId;
    aiRelationshipDeltas[neighbor.id] = calculateAIRelationshipDelta(
      neighbor,
      militaryAfterUpdate.readiness,
      stateAfterActions.stability.value,
      sharedFaith,
      sharedCulture,
    );
  }

  const diplomacyAfterDrift = applyDiplomacyUpdate(
    stateAfterActions.diplomacy,
    aiRelationshipDeltas,
  );
  let updatedDiplomacy = {
    ...diplomacyAfterDrift,
    neighbors: tickDiplomaticAgreements(diplomacyAfterDrift.neighbors),
  };

  // Intelligence operation resolution.
  // Each IntelligenceOp action in the queue is resolved with a random seed.
  //
  // NOTE: Math.random() is called per operation. resolveTurn is intentionally
  // non-deterministic — the same state passed twice will produce different intel
  // outcomes. This is by design: the save model persists the post-resolution
  // GameState, not a seed, so determinism is not required and save-scumming
  // at turn boundaries is not possible.
  const networkStrengthDeltas: number[] = [];
  const generatedReports: IntelligenceReport[] = [];
  const intelOps = stateAfterActions.actionBudget.queuedActions.filter(
    (a) => a.type === ActionType.IntelligenceOp,
  );

  for (const op of intelOps) {
    const opType = op.parameters['operationType'];
    if (!isIntelligenceOperationType(opType)) continue;

    const targetId: string =
      op.targetNeighborId ??
      (typeof op.parameters['targetId'] === 'string' ? op.parameters['targetId'] : 'domestic');

    const targetNeighbor = updatedDiplomacy.neighbors.find((n) => n.id === targetId);
    const targetCapability = targetNeighbor?.espionageCapability ?? 0;

    const result = resolveOperation(
      opType,
      targetId,
      stateAfterActions.espionage.networkStrength,
      targetCapability,
      state.turn.turnNumber,
      Math.random(),
    );

    networkStrengthDeltas.push(result.networkStrengthDelta);
    if (result.report !== null) {
      generatedReports.push(result.report);
    }
  }

  // Counter-intelligence grows from funding, stability, and military caste loyalty.
  const counterIntelDelta = calculateCounterIntelligenceGrowth(
    stateAfterActions.policies.intelligenceFundingLevel,
    stateAfterActions.stability.value,
    updatedPopulation[PopulationClass.MilitaryCaste].satisfaction,
  );

  let updatedEspionage = {
    ...applyEspionageUpdate(
      stateAfterActions.espionage,
      stateAfterActions.policies.intelligenceFundingLevel,
      networkStrengthDeltas,
    ),
    counterIntelligenceLevel: clamp(
      stateAfterActions.espionage.counterIntelligenceLevel + counterIntelDelta,
      0,
      100,
    ),
  };

  // Propagate espionage network strength to military intelligence advantage.
  let updatedMilitary = {
    ...militaryAfterUpdate,
    intelligenceAdvantage: updatedEspionage.networkStrength,
  };

  // ---- Phase 5b: AI Neighbor Autonomous Actions ----
  const allNeighborActions: NeighborAction[] = [];
  const knowledgeMilBonus = getMilitaryBonus(stateAfterActions.knowledge) * 100;
  let externalHeterodoxPressure = 0;

  for (const neighbor of updatedDiplomacy.neighbors) {
    const actions = generateNeighborActions(
      neighbor,
      updatedMilitary,
      stateAfterActions.stability.value,
      updatedTreasury.balance,
      updatedEspionage,
      stateAfterActions.faithCulture.kingdomFaithTraditionId,
      stateAfterActions.faithCulture.kingdomCultureIdentityId,
      state.turn.turnNumber,
      stateAfterActions.activeConflicts,
      Math.random(),
    );
    allNeighborActions.push(...actions);
  }

  // Process AI actions: apply war declarations, trade proposals/withdrawals,
  // treaty proposals, demands, border tensions, and religious pressure.
  for (const action of allNeighborActions) {
    switch (action.actionType) {
      case NeighborActionType.WarDeclaration: {
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: applyWarDeclaration(updatedDiplomacy.neighbors, action.neighborId),
        };
        break;
      }
      case NeighborActionType.TradeProposal: {
        const turns =
          typeof action.parameters['agreementTurns'] === 'number'
            ? action.parameters['agreementTurns']
            : 12;
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  activeAgreements: [
                    ...n.activeAgreements,
                    {
                      agreementId: `trade_${action.neighborId}_t${state.turn.turnNumber}`,
                      neighborId: action.neighborId,
                      turnsRemaining: turns,
                    },
                  ],
                }
              : n,
          ),
        };
        break;
      }
      case NeighborActionType.TradeWithdrawal: {
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  activeAgreements: n.activeAgreements.filter(
                    (a) => !a.agreementId.startsWith('trade_'),
                  ),
                }
              : n,
          ),
        };
        break;
      }
      case NeighborActionType.TreatyProposal: {
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  activeAgreements: [
                    ...n.activeAgreements,
                    {
                      agreementId: `treaty_${action.neighborId}_t${state.turn.turnNumber}`,
                      neighborId: action.neighborId,
                      turnsRemaining: null,
                    },
                  ],
                  relationshipScore: clamp(n.relationshipScore + 5, 0, 100),
                }
              : n,
          ),
        };
        break;
      }
      case NeighborActionType.Demand: {
        // Demands reduce relationship; player can respond via crisis response events.
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  relationshipScore: clamp(n.relationshipScore - 3, 0, 100),
                  outstandingTensions: n.outstandingTensions.includes('demand_pending')
                    ? n.outstandingTensions
                    : [...n.outstandingTensions, 'demand_pending'],
                }
              : n,
          ),
        };
        break;
      }
      case NeighborActionType.BorderTension: {
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  relationshipScore: clamp(n.relationshipScore - 2, 0, 100),
                  outstandingTensions: n.outstandingTensions.includes('border_tension')
                    ? n.outstandingTensions
                    : [...n.outstandingTensions, 'border_tension'],
                }
              : n,
          ),
        };
        break;
      }
      case NeighborActionType.MilitaryBuildup: {
        // No direct effect on player state; neighbor strength is updated below.
        break;
      }
      case NeighborActionType.ReligiousPressure: {
        const heterDelta =
          typeof action.parameters['heterodoxyDelta'] === 'number'
            ? action.parameters['heterodoxyDelta']
            : 5;
        externalHeterodoxPressure += heterDelta;
        break;
      }
      case NeighborActionType.PeaceOffer:
      case NeighborActionType.EspionageRetaliation:
        // These generate events for the player to respond to; no immediate state change.
        break;
    }
  }

  // Update lastActionTurn for neighbors that took actions.
  const actedNeighborIds = new Set(allNeighborActions.map((a) => a.neighborId));
  updatedDiplomacy = {
    ...updatedDiplomacy,
    neighbors: updatedDiplomacy.neighbors.map((n) =>
      actedNeighborIds.has(n.id) ? { ...n, lastActionTurn: state.turn.turnNumber } : n,
    ),
  };

  // ---- Phase 5c: Espionage Exposure Check ----
  // Failed sabotage operations (already resolved above) may expose espionage.
  // Check if any intel op targeted a neighbor and failed — approximate with
  // counter-intelligence exceeding network strength for the target.
  for (const op of intelOps) {
    if (op.targetNeighborId === null) continue;
    const targetNeighbor = updatedDiplomacy.neighbors.find(
      (n) => n.id === op.targetNeighborId,
    );
    if (!targetNeighbor) continue;

    // Exposure probability: higher if target's espionage capability exceeds our counter-intel.
    const exposureRoll = Math.random();
    const exposureChance = clamp(
      (targetNeighbor.espionageCapability - updatedEspionage.networkStrength) * 0.01,
      0.05,
      0.4,
    );

    if (exposureRoll < exposureChance) {
      const exposure = handleEspionageExposure(targetNeighbor, state.turn.turnNumber);
      // Apply relationship penalty.
      updatedDiplomacy = {
        ...updatedDiplomacy,
        neighbors: updatedDiplomacy.neighbors.map((n) => {
          if (n.id !== targetNeighbor.id) return n;
          const newScore = clamp(n.relationshipScore + exposure.relationshipDelta, 0, 100);
          return {
            ...n,
            relationshipScore: newScore,
            attitudePosture: deriveDiplomaticPosture(newScore),
            outstandingTensions:
              exposure.tensionId && !n.outstandingTensions.includes(exposure.tensionId)
                ? [...n.outstandingTensions, exposure.tensionId]
                : n.outstandingTensions,
          };
        }),
      };
      if (exposure.action) {
        allNeighborActions.push(exposure.action);
      }
    }
  }

  // ---- Phase 5d: Conflict Initiation & Resolution ----
  // Check for new conflicts from war declarations.
  let activeConflicts: ConflictState[] = [...stateAfterActions.activeConflicts];

  for (const action of allNeighborActions) {
    if (action.actionType === NeighborActionType.WarDeclaration) {
      const alreadyInConflict = activeConflicts.some(
        (c) => c.neighborId === action.neighborId,
      );
      if (!alreadyInConflict) {
        // Target the region with highest strategic value.
        const targetRegion = stateAfterActions.regions
          .filter((r) => !r.isOccupied)
          .sort((a, b) => b.strategicValue - a.strategicValue)[0];
        activeConflicts.push(
          initiateConflict(
            action.neighborId,
            state.turn.turnNumber,
            targetRegion?.id ?? null,
          ),
        );
      }
    }
  }

  // Also check for player-initiated wars (player relationship dropped to War via actions).
  for (const neighbor of updatedDiplomacy.neighbors) {
    if (
      neighbor.isAtWarWithPlayer &&
      !activeConflicts.some((c) => c.neighborId === neighbor.id)
    ) {
      const targetRegion = stateAfterActions.regions
        .filter((r) => !r.isOccupied)
        .sort((a, b) => b.strategicValue - a.strategicValue)[0];
      activeConflicts.push(
        initiateConflict(
          neighbor.id,
          state.turn.turnNumber,
          targetRegion?.id ?? null,
        ),
      );
    }
  }

  // Resolve active conflicts.
  const resolvedConflicts: ConflictState[] = [];
  const ongoingConflicts: ConflictState[] = [];

  for (const conflict of activeConflicts) {
    const neighbor = updatedDiplomacy.neighbors.find((n) => n.id === conflict.neighborId);
    if (!neighbor) {
      ongoingConflicts.push(conflict);
      continue;
    }

    // Calculate terrain advantage from target region.
    const targetRegion = conflict.targetRegionId
      ? stateAfterActions.regions.find((r) => r.id === conflict.targetRegionId)
      : null;
    const terrainAdvantage = targetRegion ? targetRegion.strategicValue : 50;

    const playerPower = calculatePlayerCombatPower(
      updatedMilitary,
      terrainAdvantage,
      knowledgeMilBonus,
    );
    const neighborPower = calculateNeighborCombatPower(neighbor);

    const outcome = resolveConflictTurn(
      conflict,
      playerPower,
      neighborPower,
      updatedMilitary.forceSize,
      neighbor.militaryStrength,
      Math.random(),
    );

    // Apply casualties to player forces.
    updatedMilitary = {
      ...updatedMilitary,
      forceSize: Math.max(0, updatedMilitary.forceSize - outcome.playerCasualties),
    };

    // Apply war costs.
    const warCosts = calculateWarCosts(conflict);
    updatedTreasury = {
      ...updatedTreasury,
      balance: Math.max(0, updatedTreasury.balance - warCosts.treasuryDrain),
    };
    updatedFood = {
      ...updatedFood,
      reserves: Math.max(0, updatedFood.reserves - warCosts.foodDrain),
    };

    // Apply conflict morale impact.
    const conflictMorale = calculateConflictMoraleImpact(conflict);
    if (conflictMorale !== 0) {
      updatedMilitary = {
        ...updatedMilitary,
        morale: clamp(updatedMilitary.morale + conflictMorale, 0, 100),
      };
    }

    // Update conflict state.
    let updatedConflict: ConflictState = {
      ...conflict,
      turnsElapsed: conflict.turnsElapsed + 1,
      playerAdvantage: clamp(conflict.playerAdvantage + outcome.advantageShift, -100, 100),
      playerCasualties: conflict.playerCasualties + outcome.playerCasualties,
      neighborCasualties: conflict.neighborCasualties + outcome.neighborCasualties,
      lastOutcomeCode: outcome.outcomeCode,
    };

    // Advance phase if needed.
    updatedConflict = advanceConflictPhase(updatedConflict);

    if (outcome.isResolved) {
      resolvedConflicts.push(updatedConflict);
    } else {
      ongoingConflicts.push(updatedConflict);
    }
  }

  // Initialise with pre-phase values so conflict consequences (Phase 5d) can
  // reference them before Phases 6 and 8 recalculate the final figures.
  let updatedFaithCulture = stateAfterActions.faithCulture;
  let updatedStability = stateAfterActions.stability;

  // Apply consequences of resolved conflicts.
  for (const resolved of resolvedConflicts) {
    const playerWon = resolved.playerAdvantage > 0;

    // Apply peace resolution to diplomacy.
    updatedDiplomacy = {
      ...updatedDiplomacy,
      neighbors: applyPeaceResolution(updatedDiplomacy.neighbors, resolved.neighborId),
    };

    // Apply victory/defeat consequences via the military module.
    const stateForConsequences: GameState = {
      ...stateAfterActions,
      treasury: updatedTreasury,
      food: updatedFood,
      population: updatedPopulation,
      military: updatedMilitary,
      diplomacy: updatedDiplomacy,
      stability: updatedStability,
      faithCulture: updatedFaithCulture,
      espionage: updatedEspionage,
    };
    const afterConsequences = applyConflictConsequences(
      stateForConsequences,
      resolved,
      playerWon,
      Math.random(),
    );

    // Merge consequences back.
    updatedTreasury = afterConsequences.treasury;
    updatedFood = afterConsequences.food;
    updatedPopulation = afterConsequences.population;
    updatedMilitary = afterConsequences.military;
    updatedDiplomacy = afterConsequences.diplomacy;
    updatedStability = afterConsequences.stability;
  }

  activeConflicts = ongoingConflicts;

  // ---- Phase 5e: Update Neighbor Military Strength & War Weariness ----
  updatedDiplomacy = {
    ...updatedDiplomacy,
    neighbors: updatedDiplomacy.neighbors.map((n) => {
      const conflictForNeighbor = activeConflicts.find((c) => c.neighborId === n.id);
      const isInConflict = conflictForNeighbor !== undefined;
      const conflictAdvantage = conflictForNeighbor?.playerAdvantage ?? 0;

      return {
        ...n,
        militaryStrength: updateNeighborMilitaryStrength(n, isInConflict, conflictAdvantage),
        warWeariness: updateNeighborWarWeariness(n, isInConflict),
        isAtWarWithPlayer: n.attitudePosture === 'War',
      };
    }),
  };

  // Re-derive postures after all changes.
  updatedDiplomacy = {
    ...updatedDiplomacy,
    neighbors: updatedDiplomacy.neighbors.map((n) => ({
      ...n,
      attitudePosture: deriveDiplomaticPosture(n.relationshipScore),
    })),
  };

  // ---- Phase 6: Faith and Culture ----
  const faithDelta = calculateFaithDelta(
    updatedPopulation[PopulationClass.Clergy].satisfaction,
    stateAfterActions.policies.festivalInvestmentLevel,
    stateAfterActions.faithCulture.heterodoxy,
    stateAfterActions.policies.religiousTolerance,
    stateAfterActions.faithCulture.activeOrders,
  );

  const cohesionDelta = calculateCulturalCohesionDelta(
    stateAfterActions.regions,
    stateAfterActions.faithCulture.kingdomCultureIdentityId,
    stateAfterActions.faithCulture.faithLevel,
    getCulturalBonus(stateAfterActions.knowledge),
  );

  // External heterodox pressure from AI neighbor religious pressure actions (Phase 5b).
  const heterodoxyDelta = calculateHeterodoxyDelta(
    stateAfterActions.faithCulture.faithLevel,
    updatedPopulation[PopulationClass.Clergy].satisfaction,
    stateAfterActions.policies.religiousTolerance,
    externalHeterodoxPressure,
  );

  updatedFaithCulture = applyFaithCultureUpdate(
    stateAfterActions.faithCulture,
    faithDelta,
    cohesionDelta,
    heterodoxyDelta,
  );

  // ---- Phase 7: Knowledge Progress ----
  const scholarlyOrderActive = stateAfterActions.faithCulture.activeOrders.some(
    (o) => o.isActive && o.type === ReligiousOrderType.Scholarly,
  );

  // hasResearchInfrastructure: set by completed construction projects in the data layer.
  // Stub false until construction effect IDs are resolvable (Phase 5 build plan).
  const hasResearchInfrastructure = false;

  // Research focus is owned by PolicyState (§4.13, §5.3). KnowledgeState does not
  // store it — read from policies directly.
  const researchFocus = stateAfterActions.policies.researchFocus;

  const researchProgress = calculateResearchProgressThisTurn(
    researchFocus,
    updatedTreasury.balance,
    scholarlyOrderActive,
    hasResearchInfrastructure,
  );

  let updatedKnowledge = applyKnowledgeProgress(
    stateAfterActions.knowledge,
    researchProgress,
    researchFocus,
  );

  const newlyUnlockedMilestones: Array<{ branch: KnowledgeBranch; milestoneIndex: number }> = [];

  if (researchFocus !== null) {
    const focusBranch = researchFocus;
    const branchState = updatedKnowledge.branches[focusBranch];

    if (checkMilestoneUnlock(branchState)) {
      const nextMilestoneIndex = branchState.currentMilestoneIndex + 1;
      // Advancement ID placeholder: data layer will supply content IDs in Phase 5.
      const advancementId = `${focusBranch}-milestone-${nextMilestoneIndex}`;
      const updatedBranch = applyMilestoneUnlock(branchState, advancementId);
      updatedKnowledge = {
        ...updatedKnowledge,
        branches: { ...updatedKnowledge.branches, [focusBranch]: updatedBranch },
      };
      newlyUnlockedMilestones.push({ branch: focusBranch, milestoneIndex: nextMilestoneIndex });
    }
  }

  // ---- Phase 8: Stability Recalculation ----
  const foodSecurityScore = computeFoodSecurityScore(updatedFood);

  // Actions that consumed slots drive decree pace drag (§4.7).
  const actionsTakenThisTurn = stateAfterActions.actionBudget.queuedActions.filter(
    (a) => !a.isFree && a.type !== ActionType.PolicyChange,
  ).length;

  updatedStability = calculateStability(
    updatedPopulation,
    foodSecurityScore,
    updatedFaithCulture.faithLevel,
    updatedFaithCulture.culturalCohesion,
    actionsTakenThisTurn,
    stateAfterActions.stability,
  );

  // Apply stability penalty from active conflicts (§6.2).
  if (activeConflicts.length > 0) {
    const conflictStabilityPenalty = activeConflicts.reduce(
      (sum, c) => sum + calculateWarCosts(c).stabilityPenalty,
      0,
    );
    updatedStability = {
      ...updatedStability,
      value: clamp(updatedStability.value - conflictStabilityPenalty, 0, 100),
    };
  }

  // ---- Phase 9: Event and Storyline Generation ----
  // nextTurnNumber is needed here and again in Phase 11.
  const nextTurnNumber = state.turn.turnNumber + 1;

  // Phase 5 data layer provides the event and storyline pools.
  const EVENT_REGISTRY: EventDefinition[] = EVENT_POOL;
  const STORYLINE_REGISTRY: StorylineDefinition[] = STORYLINE_POOL;

  // Apply mechanical effects, schedule follow-ups, and update class-favor tracking
  // for all events the player resolved since the last turn.
  const currentPacing = stateAfterActions.narrativePacing ?? createInitialPacingState();
  let pacingWithChoiceFavor = currentPacing;
  let pendingFollowUpsAfterChoices = stateAfterActions.pendingFollowUps ?? [];

  for (const event of stateAfterActions.activeEvents) {
    if (!event.isResolved || event.choiceMade === null) continue;
    const effectDelta = EVENT_CHOICE_EFFECTS[event.definitionId]?.[event.choiceMade];
    if (effectDelta) {
      stateAfterActions = applyMechanicalEffectDelta(
        stateAfterActions, effectDelta, event.affectedRegionId,
      );
      pacingWithChoiceFavor = updateClassFavorFromChoice(pacingWithChoiceFavor, effectDelta);
    }
    pendingFollowUpsAfterChoices = scheduleFollowUps(
      pendingFollowUpsAfterChoices,
      event,
      EVENT_REGISTRY,
      state.turn.turnNumber,
    );
  }

  stateAfterActions = {
    ...stateAfterActions,
    pendingFollowUps: pendingFollowUpsAfterChoices,
  };

  // Advance existing event chains (resolved chain events produce their next-step event).
  const chainAdvancedEvents = advanceEventChains(
    stateAfterActions.activeEvents,
    nextTurnNumber,
    EVENT_REGISTRY,
    eventHistory,
  );

  // Process due follow-up events before standard surfacing.
  const existingEventIds = new Set([
    ...chainAdvancedEvents.map((e) => e.definitionId),
    ...eventHistory.map((e) => e.definitionId),
  ]);
  const followUpResult = processDueFollowUps(
    stateAfterActions.pendingFollowUps ?? [],
    EVENT_REGISTRY,
    nextTurnNumber,
    stateAfterActions,
    existingEventIds,
  );

  // Surface new standalone events against updated state.
  // Include follow-up events in the existing event list to avoid duplicates.
  const eventsWithFollowUps = [...chainAdvancedEvents, ...followUpResult.surfacedEvents];
  const categoryWeights = calculateCategoryWeights(pacingWithChoiceFavor, nextTurnNumber);
  const newEvents = surfaceEvents(
    stateAfterActions,
    nextTurnNumber,
    EVENT_REGISTRY,
    eventsWithFollowUps,
    eventHistory,
    categoryWeights,
  );

  const activeEvents = [...eventsWithFollowUps, ...newEvents];

  // Update narrative pacing state for surfaced events.
  const allNewlyBornEvents = [...followUpResult.surfacedEvents, ...newEvents];
  const updatedNarrativePacing = updatePacingForSurfacedEvents(
    pacingWithChoiceFavor,
    allNewlyBornEvents,
    nextTurnNumber,
  );

  // Decrement dormant turn counters for active storylines.
  const advancedStorylines = advanceStorylines(stateAfterActions.activeStorylines);

  // Apply resolution effects for storylines that were resolved this turn (via branch decisions).
  // Build a working state from the already-computed phase variables so resolution deltas
  // are applied on top of the fully resolved turn state.
  let workingState: GameState = {
    ...stateAfterActions,
    treasury: updatedTreasury,
    food: updatedFood,
    population: updatedPopulation,
    military: updatedMilitary,
    stability: updatedStability,
    faithCulture: updatedFaithCulture,
    diplomacy: updatedDiplomacy,
    espionage: updatedEspionage,
  };
  const newlyResolvedStorylineIds: string[] = [];
  const storylineConsequences: PersistentConsequence[] = [];
  let hadResolutions = false;

  for (const storyline of advancedStorylines) {
    if (storyline.status === StorylineStatus.Resolved && storyline.decisionHistory.length > 0) {
      // Check if this storyline was resolved this turn (last decision was this turn).
      const lastDecision = storyline.decisionHistory[storyline.decisionHistory.length - 1];
      if (lastDecision.turnNumber === state.turn.turnNumber) {
        const resResult = applyStorylineResolutionEffects(
          workingState, storyline, STORYLINE_RESOLUTION_EFFECTS,
        );
        workingState = resResult.state;
        newlyResolvedStorylineIds.push(storyline.definitionId);
        storylineConsequences.push({
          sourceId: storyline.definitionId,
          sourceType: 'storyline',
          choiceMade: lastDecision.choiceId,
          turnApplied: state.turn.turnNumber,
          tag: `${storyline.definitionId}:resolution:${storyline.decisionHistory[0].choiceId}`,
        });
        hadResolutions = true;
      }
    }
  }

  // Merge storyline resolution effects back into the phase variables.
  if (hadResolutions) {
    updatedTreasury = workingState.treasury;
    updatedFood = workingState.food;
    updatedPopulation = workingState.population;
    updatedMilitary = workingState.military;
    updatedStability = workingState.stability;
    updatedFaithCulture = workingState.faithCulture;
    updatedDiplomacy = workingState.diplomacy;
    updatedEspionage = workingState.espionage;
  }

  // Track resolved storyline IDs and last activation turn for pool evaluation.
  const allResolvedStorylineIds = [
    ...stateAfterActions.resolvedStorylineIds,
    ...newlyResolvedStorylineIds,
  ];
  const lastActivationTurn = advancedStorylines.length > 0
    ? Math.max(
        stateAfterActions.lastStorylineActivationTurn,
        ...advancedStorylines.map((s) => s.turnActivated),
      )
    : stateAfterActions.lastStorylineActivationTurn;

  // Evaluate storyline pool for new activations.
  const newStorylines = evaluateStorylinePool(
    stateAfterActions,
    nextTurnNumber,
    STORYLINE_REGISTRY,
    advancedStorylines.filter((s) => s.status !== StorylineStatus.Resolved),
    allResolvedStorylineIds,
    lastActivationTurn,
  );

  // Update lastStorylineActivationTurn if new storylines were activated.
  const updatedLastActivationTurn = newStorylines.length > 0
    ? nextTurnNumber
    : lastActivationTurn;

  const activeStorylines = [
    ...advancedStorylines.filter((s) => s.status !== StorylineStatus.Resolved),
    ...newStorylines,
  ];

  // Accumulate persistent consequences from storyline resolutions.
  const updatedPersistentConsequences = [
    ...stateAfterActions.persistentConsequences,
    ...storylineConsequences,
  ];

  // ---- Phase 10: Construction Progress ----
  // Decrement turn counters, remove completed projects, apply completion effects,
  // and deduct per-turn resource costs.
  let workingResources = stateAfterActions.resources;
  let constructionRegions = stateAfterActions.regions;
  let constructionTreasury = updatedTreasury;
  let constructionFood = updatedFood;
  let constructionMilitary = updatedMilitary;
  let constructionFaithCulture = updatedFaithCulture;
  let constructionStability = updatedStability;
  let constructionKnowledge = updatedKnowledge;
  const updatedConstructionProjects: ConstructionProject[] = [];
  const completedConstructionIds: string[] = [];

  for (const project of stateAfterActions.constructionProjects) {
    if (project.turnsRemaining <= 1) {
      // Project completes this turn — apply completion effects.
      completedConstructionIds.push(project.definitionId);
      const def = findConstructionDefinition(project.definitionId);
      if (def) {
        const fx = def.completionEffect;
        // Region development
        if (fx.regionDevelopmentDelta) {
          constructionRegions = applyRegionDevelopmentChange(
            constructionRegions,
            project.targetRegionId,
            fx.regionDevelopmentDelta,
          );
        }
        // Treasury income bonus (applied as immediate balance bump; persistent via development)
        if (fx.treasuryIncomeDelta) {
          constructionTreasury = {
            ...constructionTreasury,
            balance: constructionTreasury.balance + fx.treasuryIncomeDelta,
          };
        }
        // Food production bonus
        if (fx.foodProductionDelta) {
          constructionFood = {
            ...constructionFood,
            reserves: constructionFood.reserves + fx.foodProductionDelta,
          };
        }
        // Military bonuses
        if (fx.militaryReadinessDelta || fx.militaryEquipmentDelta) {
          constructionMilitary = {
            ...constructionMilitary,
            readiness: clamp(
              constructionMilitary.readiness + (fx.militaryReadinessDelta ?? 0),
              0,
              100,
            ),
            equipmentCondition: clamp(
              constructionMilitary.equipmentCondition + (fx.militaryEquipmentDelta ?? 0),
              0,
              100,
            ),
          };
        }
        // Faith bonus
        if (fx.faithDelta) {
          constructionFaithCulture = {
            ...constructionFaithCulture,
            faithLevel: clamp(constructionFaithCulture.faithLevel + fx.faithDelta, 0, 100),
          };
        }
        // Knowledge progress bonus (applied to focused branch if any)
        if (fx.knowledgeProgressDelta && stateAfterActions.policies.researchFocus) {
          const focusBranch = stateAfterActions.policies.researchFocus;
          const currentBranch = constructionKnowledge.branches[focusBranch];
          constructionKnowledge = {
            ...constructionKnowledge,
            branches: {
              ...constructionKnowledge.branches,
              [focusBranch]: {
                ...currentBranch,
                progressValue: currentBranch.progressValue + fx.knowledgeProgressDelta,
              },
            },
          };
        }
        // Stability bonus
        if (fx.stabilityDelta) {
          constructionStability = {
            ...constructionStability,
            value: clamp(constructionStability.value + fx.stabilityDelta, 0, 100),
          };
        }
        // Trade income bonus (applied as immediate treasury bump)
        if (fx.tradeIncomeDelta) {
          constructionTreasury = {
            ...constructionTreasury,
            balance: constructionTreasury.balance + fx.tradeIncomeDelta,
          };
        }
      }
      continue;
    }

    // Resource costs are paid upfront in applyConstructionEffect (Phase 2).
    // Just decrement the turn counter.
    if (project.turnsRemaining <= 0) continue;

    updatedConstructionProjects.push({
      ...project,
      turnsRemaining: project.turnsRemaining - 1,
    });
  }

  // ---- Phase 11: State Snapshot and Bookkeeping ----
  // Advance the calendar. (nextTurnNumber hoisted to Phase 9.)
  const nextMonth = state.turn.month === 12 ? 1 : state.turn.month + 1;
  const nextYear = state.turn.month === 12 ? state.turn.year + 1 : state.turn.year;
  const nextSeason = getSeasonForMonth(nextMonth);

  const nextTurn: TurnState = {
    turnNumber: nextTurnNumber,
    month: nextMonth,
    season: nextSeason,
    year: nextYear,
  };

  // Track overthrow risk counter.
  const overthrowRiskActive = isOverthrowRiskActive(updatedPopulation);
  const nextConsecutiveTurnsOverthrowRisk = overthrowRiskActive
    ? state.consecutiveTurnsOverthrowRisk + 1
    : 0;

  // Evaluate failure conditions from final resolved state.
  const triggeredFailureConditions: FailureCondition[] = [];
  if (checkInsolvency(constructionTreasury)) triggeredFailureConditions.push(FailureCondition.Insolvency);
  if (checkFamine(constructionFood)) triggeredFailureConditions.push(FailureCondition.Famine);
  if (checkCollapse(constructionStability)) triggeredFailureConditions.push(FailureCondition.Collapse);
  if (checkTotalConquest(constructionRegions))
    triggeredFailureConditions.push(FailureCondition.Conquest);
  if (checkOverthrow(nextConsecutiveTurnsOverthrowRisk))
    triggeredFailureConditions.push(FailureCondition.Overthrow);

  // Evaluate failure forecasting — warn player 1-2 turns before each failure.
  const failureWarnings: FailureWarning[] = [];
  if (!triggeredFailureConditions.includes(FailureCondition.Famine)) {
    const turnsEmpty = constructionFood.consecutiveTurnsEmpty;
    if (turnsEmpty >= 2) {
      failureWarnings.push({ condition: FailureCondition.Famine, turnsRemaining: 1, severity: 'critical' });
    } else if (turnsEmpty >= 1) {
      failureWarnings.push({ condition: FailureCondition.Famine, turnsRemaining: 2, severity: 'caution' });
    }
  }
  if (!triggeredFailureConditions.includes(FailureCondition.Insolvency)) {
    const turnsInsolvent = constructionTreasury.consecutiveTurnsInsolvent;
    if (turnsInsolvent >= 2) {
      failureWarnings.push({ condition: FailureCondition.Insolvency, turnsRemaining: 1, severity: 'critical' });
    } else if (turnsInsolvent >= 1) {
      failureWarnings.push({ condition: FailureCondition.Insolvency, turnsRemaining: 2, severity: 'caution' });
    }
  }
  if (!triggeredFailureConditions.includes(FailureCondition.Collapse)) {
    const turnsAtZero = constructionStability.consecutiveTurnsAtZero;
    if (turnsAtZero >= 1) {
      failureWarnings.push({ condition: FailureCondition.Collapse, turnsRemaining: 1, severity: 'critical' });
    }
  }
  if (!triggeredFailureConditions.includes(FailureCondition.Conquest)) {
    const occupiedFraction = getOccupiedFraction(constructionRegions);
    if (occupiedFraction > 0.75) {
      failureWarnings.push({ condition: FailureCondition.Conquest, turnsRemaining: 1, severity: 'critical' });
    } else if (occupiedFraction > 0.5) {
      failureWarnings.push({ condition: FailureCondition.Conquest, turnsRemaining: 2, severity: 'caution' });
    }
  }
  if (!triggeredFailureConditions.includes(FailureCondition.Overthrow)) {
    if (nextConsecutiveTurnsOverthrowRisk >= OVERTHROW_CONSECUTIVE_TURNS - 1) {
      failureWarnings.push({ condition: FailureCondition.Overthrow, turnsRemaining: 1, severity: 'critical' });
    } else if (nextConsecutiveTurnsOverthrowRisk >= OVERTHROW_CONSECUTIVE_TURNS - 2) {
      failureWarnings.push({ condition: FailureCondition.Overthrow, turnsRemaining: 2, severity: 'caution' });
    }
  }

  // Snapshot the start-of-turn state for the history entry.
  const historyEntry: TurnHistoryEntry = {
    turnNumber: state.turn.turnNumber,
    season: state.turn.season,
    year: state.turn.year,
    snapshotSummary: {
      treasuryBalance: state.treasury.balance,
      foodReserves: state.food.reserves,
      stabilityValue: state.stability.value,
      activeEventCount: state.activeEvents.filter((e) => !e.isResolved).length,
    },
    actionsIssued: stateAfterActions.actionBudget.queuedActions,
    eventsResolved: stateAfterActions.activeEvents
      .filter((e) => e.isResolved)
      .map((e) => e.id),
  };

  // Reset action budget for the next turn.
  const nextActionBudget = resetActionBudgetForNextTurn();

  // Build CrownBar display data for the new turn.
  const unresolvedUrgentMatters = activeEvents.filter(
    (e) =>
      !e.isResolved &&
      (e.severity === EventSeverity.Serious || e.severity === EventSeverity.Critical),
  ).length;

  const nextCrownBar: CrownBarData = {
    turnNumber: nextTurnNumber,
    season: nextSeason,
    year: nextYear,
    treasuryBalance: constructionTreasury.balance,
    foodReserves: constructionFood.reserves,
    stabilityRating: constructionStability.value,
    unresolvedUrgentMatters,
  };

  // Assemble the complete next game state.
  const nextState: GameState = {
    turn: nextTurn,
    treasury: constructionTreasury,
    food: constructionFood,
    resources: workingResources,
    population: updatedPopulation,
    military: constructionMilitary,
    stability: constructionStability,
    faithCulture: constructionFaithCulture,
    diplomacy: updatedDiplomacy,
    espionage: updatedEspionage,
    knowledge: constructionKnowledge,
    regions: constructionRegions,
    policies: stateAfterActions.policies,
    constructionProjects: updatedConstructionProjects,
    activeEvents,
    activeStorylines,
    activeConflicts,
    neighborActions: allNeighborActions,
    actionBudget: nextActionBudget,
    crownBar: nextCrownBar,
    activeFailureConditions: triggeredFailureConditions,
    consecutiveTurnsOverthrowRisk: nextConsecutiveTurnsOverthrowRisk,
    persistentConsequences: updatedPersistentConsequences,
    activeTemporaryModifiers: stateAfterActions.activeTemporaryModifiers,
    pendingFollowUps: followUpResult.remainingFollowUps,
    narrativePacing: updatedNarrativePacing,
    resolvedStorylineIds: allResolvedStorylineIds,
    lastStorylineActivationTurn: updatedLastActivationTurn,
    scenarioId: stateAfterActions.scenarioId,
  };

  return {
    nextState,
    historyEntry,
    newlyUnlockedMilestones,
    triggeredFailureConditions,
    failureWarnings,
    completedConstructionIds,
    generatedReports,
  };
}
