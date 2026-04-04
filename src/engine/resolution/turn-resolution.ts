// gameplay-blueprint.md §6 — Turn Resolution Framework
// Orchestrates the 11-phase consequence chain for a single game turn.
// No React imports. No player-facing text.

import {
  ActionType,
  ConstructionProject,
  CrownBarData,
  EventSeverity,
  FailureCondition,
  GameState,
  IntelligenceOperationType,
  IntelligenceReport,
  KnowledgeBranch,
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
import { SEASON_MONTHS } from '../constants';
import { advanceEventChains, EventDefinition, surfaceEvents } from '../events/event-engine';
import {
  advanceStorylines,
  evaluateStorylinePool,
  StorylineDefinition,
} from '../events/storyline-engine';
import { applyStorylineResolutionEffects } from '../events/apply-event-effects';
import { STORYLINE_RESOLUTION_EFFECTS } from '../../data/storylines/effects';
import { resetActionBudgetForNextTurn } from './action-budget';
import { summarizeRegionalOutputs, checkTotalConquest } from '../systems/regions';
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
  getTradeBonus,
  getCulturalBonus,
} from '../systems/knowledge';
import {
  calculateAIRelationshipDelta,
  applyDiplomacyUpdate,
  tickDiplomaticAgreements,
} from '../systems/diplomacy';
import { EVENT_POOL } from '../../data/events/index';
import { STORYLINE_POOL } from '../../data/storylines/index';

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

  // Compute readiness delta early; needed in Phase 4 (nobility satisfaction driver).
  // Military training order detection deferred to data layer; defaulting to false.
  const readinessDecay = calculateReadinessDecay(state.military.deploymentPosture);
  const readinessGain = calculateReadinessGain(state.military.militaryCasteQuality, false);
  const readinessDelta = readinessGain - readinessDecay;

  // ---- Phase 2: Action Execution ----
  // Pass updated resources into action effects so actions can read the current stockpiles.
  const stateAfterActions = applyActionEffects(
    { ...state, resources: phase1Resources },
    state.actionBudget.queuedActions,
  );

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

  // External heterodox pressure: 0 until the event engine provides context (Phase 4 build plan).
  const heterodoxyDelta = calculateHeterodoxyDelta(
    stateAfterActions.faithCulture.faithLevel,
    updatedPopulation[PopulationClass.Clergy].satisfaction,
    stateAfterActions.policies.religiousTolerance,
    0,
  );

  let updatedFaithCulture = applyFaithCultureUpdate(
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

  let updatedStability = calculateStability(
    updatedPopulation,
    foodSecurityScore,
    updatedFaithCulture.faithLevel,
    updatedFaithCulture.culturalCohesion,
    actionsTakenThisTurn,
    stateAfterActions.stability,
  );

  // ---- Phase 9: Event and Storyline Generation ----
  // nextTurnNumber is needed here and again in Phase 11.
  const nextTurnNumber = state.turn.turnNumber + 1;

  // Phase 5 data layer provides the event and storyline pools.
  const EVENT_REGISTRY: EventDefinition[] = EVENT_POOL;
  const STORYLINE_REGISTRY: StorylineDefinition[] = STORYLINE_POOL;

  // Advance existing event chains (resolved chain events produce their next-step event).
  const chainAdvancedEvents = advanceEventChains(
    stateAfterActions.activeEvents,
    nextTurnNumber,
    EVENT_REGISTRY,
    [], // eventHistory is scoped to SaveFile, not available here; chains work with active set
  );

  // Surface new standalone events against updated state.
  const newEvents = surfaceEvents(
    stateAfterActions,
    nextTurnNumber,
    EVENT_REGISTRY,
    chainAdvancedEvents,
    [],
  );

  const activeEvents = [...chainAdvancedEvents, ...newEvents];

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
        workingState = applyStorylineResolutionEffects(
          workingState, storyline, STORYLINE_RESOLUTION_EFFECTS,
        );
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
    ...advancedStorylines,
    ...newStorylines,
  ];

  // Accumulate persistent consequences from storyline resolutions.
  const updatedPersistentConsequences = [
    ...stateAfterActions.persistentConsequences,
    ...storylineConsequences,
  ];

  // ---- Phase 10: Construction Progress ----
  // Decrement turn counters, remove completed projects, and deduct per-turn resource costs.
  let workingResources = stateAfterActions.resources;
  const updatedConstructionProjects: ConstructionProject[] = [];

  for (const project of stateAfterActions.constructionProjects) {
    if (project.turnsRemaining <= 1) {
      // Project completes this turn; effect application handled by data layer on completion.
      continue;
    }

    // Spread remaining resource cost evenly over remaining turns.
    const updatedCostRemaining: Partial<Record<ResourceType, number>> = {};
    for (const resourceType of Object.keys(project.resourceCostRemaining) as ResourceType[]) {
      const remaining = project.resourceCostRemaining[resourceType];
      if (remaining === undefined || remaining <= 0) continue;

      const perTurnCost = Math.ceil(remaining / project.turnsRemaining);
      updatedCostRemaining[resourceType] = Math.max(0, remaining - perTurnCost);

      workingResources = {
        ...workingResources,
        [resourceType]: {
          ...workingResources[resourceType],
          stockpile: Math.max(0, workingResources[resourceType].stockpile - perTurnCost),
        },
      };
    }

    updatedConstructionProjects.push({
      ...project,
      turnsRemaining: project.turnsRemaining - 1,
      resourceCostRemaining: updatedCostRemaining,
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

  // Evaluate failure conditions from final resolved state.
  const triggeredFailureConditions: FailureCondition[] = [];
  if (checkInsolvency(updatedTreasury)) triggeredFailureConditions.push(FailureCondition.Insolvency);
  if (checkFamine(updatedFood)) triggeredFailureConditions.push(FailureCondition.Famine);
  if (checkCollapse(updatedStability)) triggeredFailureConditions.push(FailureCondition.Collapse);
  if (checkTotalConquest(stateAfterActions.regions))
    triggeredFailureConditions.push(FailureCondition.Conquest);

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
    treasuryBalance: updatedTreasury.balance,
    foodReserves: updatedFood.reserves,
    stabilityRating: updatedStability.value,
    unresolvedUrgentMatters,
  };

  // Assemble the complete next game state.
  const nextState: GameState = {
    turn: nextTurn,
    treasury: updatedTreasury,
    food: updatedFood,
    resources: workingResources,
    population: updatedPopulation,
    military: updatedMilitary,
    stability: updatedStability,
    faithCulture: updatedFaithCulture,
    diplomacy: updatedDiplomacy,
    espionage: updatedEspionage,
    knowledge: updatedKnowledge,
    regions: stateAfterActions.regions,
    policies: stateAfterActions.policies,
    constructionProjects: updatedConstructionProjects,
    activeEvents,
    activeStorylines,
    actionBudget: nextActionBudget,
    crownBar: nextCrownBar,
    activeFailureConditions: triggeredFailureConditions,
    persistentConsequences: updatedPersistentConsequences,
    resolvedStorylineIds: allResolvedStorylineIds,
    lastStorylineActivationTurn: updatedLastActivationTurn,
    scenarioId: stateAfterActions.scenarioId,
  };

  return {
    nextState,
    historyEntry,
    newlyUnlockedMilestones,
    triggeredFailureConditions,
    generatedReports,
  };
}
