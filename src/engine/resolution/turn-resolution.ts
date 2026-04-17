// gameplay-blueprint.md §6 — Turn Resolution Framework
// Orchestrates the 11-phase consequence chain for a single game turn.
// No React imports. No player-facing text.

import {
  ActionType,
  ActiveEvent,
  ConditionCardTrigger,
  ConditionSeverity,
  ConflictState,
  ConstructionProject,
  CrownBarData,
  EventCategory,
  EventSeverity,
  FailureCondition,
  FailureWarning,
  GameState,
  IntelligenceFundingLevel,
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
  resolveEnvironmentTick,
  createInitialEnvironmentState,
} from '../systems/environment';
import {
  createTurnLedger,
  finalizeTurnLedger,
  createEmptyLedger,
  maybeRecord,
} from '../systems/causal-ledger';
import {
  resolveEconomicCycle,
  createInitialEconomicState,
} from '../systems/economic-cycle';
import {
  resolveRegionalTick,
} from '../systems/regional-life';
import {
  SEASON_MONTHS,
  OVERTHROW_CONSECUTIVE_TURNS,
} from '../constants';
import { advanceEventChains, EventDefinition, resolveEventChoice, surfaceEvents } from '../events/event-engine';
import { processDueFollowUps, scheduleFollowUps } from '../events/follow-up-tracker';
import { calculateCategoryWeights, createInitialPacingState, updateClassFavorFromChoice, updatePacingForSurfacedEvents } from '../events/narrative-pacing';
import {
  advanceStorylines,
  buildActiveStoryline,
  StorylineDefinition,
} from '../events/storyline-engine';
import {
  applyPressure,
  evaluateStorylineActivation,
} from '../systems/narrative-pressure';
import { applyMechanicalEffectDelta, applyStorylineResolutionEffects } from '../events/apply-event-effects';
import { STORYLINE_RESOLUTION_EFFECTS } from '../../data/storylines/effects';
import { resetActionBudgetForNextTurn } from './action-budget';
import { summarizeRegionalOutputs, checkTotalConquest, getOccupiedFraction, applyRegionDevelopmentChange, computeAdjustedRegionalSummary } from '../systems/regions';
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
  calculateStyleSatisfactionModifiers,
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
  computeRivalActionPressure,
  tickRivalKingdom,
} from '../systems/rival-simulation';
import {
  applyAgendaPressureModifier,
  selectInitialAgenda,
  shouldAgendaShift,
  tickAgenda,
} from '../systems/rival-agendas';
import { decayMemoryWeights, recordMemory } from '../systems/rival-memory';
import { seededRandom } from '../../data/text/name-generation';
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
import { resolvePopulationGrowth } from '../systems/population-dynamics';
import { resolveSocialFabric } from '../systems/social-fabric';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../../data/events/effects';
import { STORYLINE_POOL } from '../../data/storylines/index';
import { findConstructionDefinition } from '../../data/construction/index';
import { accumulateStyleDecision, createInitialRulingStyleState } from '../systems/ruling-style';
import { EVENT_CHOICE_STYLE_TAGS, DECREE_STYLE_TAGS } from '../../data/ruling-style/flavor-tags';
import type { StyleDecision } from '../types';

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
  // Events resolved by the player this turn. The context layer archives these
  // into eventHistory so they are excluded from future surfacing.
  resolvedEvents: ActiveEvent[];
  // Intelligence reports generated this turn. The hook layer appends these to
  // SaveFile.intelligenceReports so the player can review operation outcomes.
  generatedReports: IntelligenceReport[];
  // Condition card triggers generated by the environment system (Phase 0b).
  conditionCardTriggers: ConditionCardTrigger[];
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
  // ---- Phase 0: Accept pending diplomatic proposals ----
  // Proposals from the previous turn auto-accept if the player did not reject them.
  // This gives the player one turn of visibility before proposals take effect.
  let stateWithAcceptedProposals = state;
  const hasAnyPendingProposals = state.diplomacy.neighbors.some(
    (n) => n.pendingProposals && n.pendingProposals.length > 0,
  );
  // Track just-accepted agreement IDs so they are not decremented this turn.
  const justAcceptedAgreementIds = new Set<string>();
  if (hasAnyPendingProposals) {
    for (const n of state.diplomacy.neighbors) {
      for (const p of n.pendingProposals ?? []) {
        justAcceptedAgreementIds.add(p.agreementId);
      }
    }
    stateWithAcceptedProposals = {
      ...state,
      diplomacy: {
        ...state.diplomacy,
        neighbors: state.diplomacy.neighbors.map((n) => {
          if (!n.pendingProposals || n.pendingProposals.length === 0) return n;
          // Treaty proposals grant +5 relationship on acceptance.
          const treatyBonus = n.pendingProposals.filter(
            (p) => p.agreementId.startsWith('treaty_'),
          ).length * 5;
          // Phase 3: each accepted proposal records a favor in rival memory.
          let nextMemory = n.memory ?? [];
          for (const p of n.pendingProposals) {
            nextMemory = recordMemory(nextMemory, {
              turnRecorded: state.turn.turnNumber,
              type: 'favor',
              source: `accepted_proposal:${p.agreementId}`,
              weight: 0.8,
              context: 'Player accepted diplomatic proposal',
            });
          }
          return {
            ...n,
            activeAgreements: [...n.activeAgreements, ...n.pendingProposals],
            pendingProposals: [],
            relationshipScore: clamp(n.relationshipScore + treatyBonus, 0, 100),
            memory: nextMemory,
          };
        }),
      },
    };
  }

  // ---- Phase 0b: Environmental Tick ----
  // Resolve weather, condition lifecycle, disease tracking before income calculations.
  const ledger = createTurnLedger(state.turn.turnNumber);

  const environmentResult = resolveEnvironmentTick(
    stateWithAcceptedProposals.environment ?? createInitialEnvironmentState(),
    stateWithAcceptedProposals.turn.season,
    stateWithAcceptedProposals.food,
    stateWithAcceptedProposals.population,
    stateWithAcceptedProposals.regions,
    stateWithAcceptedProposals.military,
    stateWithAcceptedProposals.policies,
    stateWithAcceptedProposals.knowledge,
    stateWithAcceptedProposals.faithCulture,
    stateWithAcceptedProposals.activeConflicts.length,
    state.turn.turnNumber,
    Math.random(),
    stateWithAcceptedProposals.stability.value,
    stateWithAcceptedProposals.espionage,
  );
  let updatedEnvironment = environmentResult.environment;
  const conditionModifiers = environmentResult.modifiers;
  let conditionCardTriggers = environmentResult.conditionCards;

  // ---- Phase 1: Income and Production ----
  // Compute all regional outputs in one pass; reused by downstream calculations.
  const regionalSummary = summarizeRegionalOutputs(stateWithAcceptedProposals.regions);

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

  // Neighbor relationship scores needed for trade income calculation.
  const neighborRelScores: Record<string, number> = {};
  for (const n of stateWithAcceptedProposals.diplomacy.neighbors) {
    neighborRelScores[n.id] = n.relationshipScore;
  }

  // ---- Phase 1b: Economic Cycle Update (Expansion 2) ----
  // Updates economic momentum, cycle phase, scarcity pricing, inflation, confidence.
  const currentEconomy = stateWithAcceptedProposals.economy ?? createInitialEconomicState();
  const currentMerchantSat = stateWithAcceptedProposals.population[PopulationClass.Merchants].satisfaction;
  const preActionTradeIncome = calculateTradeIncome(
    currentMerchantSat,
    stateWithAcceptedProposals.policies.tradeOpenness,
    neighborRelScores,
    regionalSummary.tradeModifier,
    getTradeBonus(stateWithAcceptedProposals.knowledge),
  );

  const economicResult = resolveEconomicCycle(
    currentEconomy,
    preActionTradeIncome,
    currentMerchantSat,
    stateWithAcceptedProposals.stability.value,
    stateWithAcceptedProposals.constructionProjects.filter((p) => p.turnsRemaining > 0).length,
    stateWithAcceptedProposals.activeConflicts.length > 0,
    stateWithAcceptedProposals.food.reserves <= 0,
    phase1Resources,
    stateWithAcceptedProposals.food.reserves,
    state.treasury.expenses
      ? (state.treasury.expenses.militaryUpkeep + state.treasury.expenses.constructionCosts
        + state.treasury.expenses.intelligenceFunding + state.treasury.expenses.religiousUpkeep
        + state.treasury.expenses.festivalCosts)
      : 0,
    state.treasury.income
      ? (state.treasury.income.taxation + state.treasury.income.trade + state.treasury.income.miscellaneous)
      : 0,
    stateWithAcceptedProposals.policies.tradeOpenness,
    neighborRelScores,
    updatedEnvironment.activeConditions,
    state.turn.turnNumber,
  );
  const updatedEconomy = economicResult.economy;
  const economicModifiers = economicResult.economicModifiers;

  // Add economic conditions (TradeDisruption, MarketPanic) to environment.
  if (economicResult.newConditions.length > 0) {
    updatedEnvironment = {
      ...updatedEnvironment,
      activeConditions: [...updatedEnvironment.activeConditions, ...economicResult.newConditions],
    };
    conditionCardTriggers = [...conditionCardTriggers, ...economicResult.conditionCards];
  }

  // Record economic cycle changes to causal ledger.
  if (Math.abs(economicResult.momentumDelta) > 5) {
    maybeRecord(ledger, 'economy', 'momentum_shift', 'economy', 'cycle_phase_changed', economicResult.momentumDelta);
  }

  // ---- Phase 1c: Regional Tick (Expansion 5) ----
  // Updates loyalty, infrastructure decay, local economy, regional conditions.
  const regionalTickResult = resolveRegionalTick(
    stateWithAcceptedProposals.regions,
    stateWithAcceptedProposals.stability.value,
    stateWithAcceptedProposals.constructionProjects,
    stateWithAcceptedProposals.policies.taxationLevel,
    stateWithAcceptedProposals.faithCulture.kingdomCultureIdentityId,
    updatedEconomy.cyclePhase,
    state.turn.turnNumber,
  );
  const phase1cRegions = regionalTickResult.regions;

  // Add regional conditions to environment and card triggers.
  if (regionalTickResult.newConditions.length > 0) {
    updatedEnvironment = {
      ...updatedEnvironment,
      activeConditions: [...updatedEnvironment.activeConditions, ...regionalTickResult.newConditions],
    };
    conditionCardTriggers = [...conditionCardTriggers, ...regionalTickResult.conditionCards];
  }

  // Record loyalty and infrastructure changes to causal ledger.
  for (const warning of regionalTickResult.loyaltyWarnings) {
    if (warning.type === 'rebellion' || warning.type === 'separatist_event') {
      maybeRecord(ledger, 'region', 'loyalty_crisis', 'stability', 'regional_unrest', -10);
    }
  }

  // Compute adjusted regional summary accounting for loyalty and infrastructure.
  const adjustedRegionalSummary = computeAdjustedRegionalSummary(phase1cRegions);

  // ---- Phase 2: Action Execution ----
  // Pass updated resources and accepted proposals into action effects.
  // Snapshot existing construction project IDs so Phase 10 can skip new ones.
  const preActionProjectIds = new Set(
    stateWithAcceptedProposals.constructionProjects.map((p) => p.id),
  );
  let stateAfterActions = applyActionEffects(
    { ...stateWithAcceptedProposals, resources: phase1Resources, regions: phase1cRegions, economy: updatedEconomy },
    stateWithAcceptedProposals.actionBudget.queuedActions,
  );

  // ---- Phase 2a: Recalculate income/food with post-action policies ----
  // Policy changes (taxation, trade openness, rationing) applied in Phase 2
  // must feed into the same turn's economy/food calculations.
  const taxationIncomePostAction = calculateTaxationIncome(
    stateAfterActions.policies.taxationLevel,
    stateAfterActions.population[PopulationClass.Nobility].satisfaction,
    stateAfterActions.population[PopulationClass.Merchants].satisfaction,
    stateAfterActions.regions,
  );

  const tradeIncomePostAction = calculateTradeIncome(
    stateAfterActions.population[PopulationClass.Merchants].satisfaction,
    stateAfterActions.policies.tradeOpenness,
    neighborRelScores,
    regionalSummary.tradeModifier,
    getTradeBonus(stateAfterActions.knowledge),
  );

  // Apply condition modifiers to trade income (Phase 0b environment + social fabric effects).
  // Apply economic cycle trade multiplier (Phase 1b) and regional roads adjustment (Phase 1c).
  const conditionAdjustedTradeIncome = tradeIncomePostAction
    * conditionModifiers.tradeIncomeMultiplier
    * economicModifiers.tradeMultiplier
    * adjustedRegionalSummary.tradeModifierAdjusted;
  // Apply treasury income multiplier from social conditions (e.g. Corruption, CriminalUnderworld).
  // Apply economic cycle treasury multiplier (Phase 1b) and regional loyalty tax adjustment (Phase 1c).
  const adjustedTaxation = taxationIncomePostAction
    * conditionModifiers.treasuryIncomeMultiplier
    * economicModifiers.treasuryMultiplier
    * adjustedRegionalSummary.loyaltyTaxMultiplier;
  const incomeBreakdownPostAction = calculateIncome(adjustedTaxation, conditionAdjustedTradeIncome, 0);

  // Record trade income loss from conditions to causal ledger.
  const tradeLossFromConditions = tradeIncomePostAction - conditionAdjustedTradeIncome;
  maybeRecord(ledger, 'environment', 'condition_trade_penalty', 'treasury', 'trade_income_reduced', -tradeLossFromConditions);

  const baseFoodProduction = calculateFoodProduction(
    stateAfterActions.population[PopulationClass.Commoners],
    regionalSummary.foodOutput,
    stateAfterActions.turn.season,
    getAgriculturalBonus(stateAfterActions.knowledge),
  );

  // Apply condition modifiers to food production (Phase 0b environment effects).
  const foodProductionPostAction = baseFoodProduction * conditionModifiers.foodProductionMultiplier;

  // Record food production loss from conditions to causal ledger.
  const foodLossFromConditions = baseFoodProduction - foodProductionPostAction;
  maybeRecord(ledger, 'environment', 'condition_food_penalty', 'food', 'production_decreased', -foodLossFromConditions);

  // ---- Phase 2b: Temporary Modifier Tick ----
  // Apply ongoing effects from temporary modifiers, then decrement and expire.
  // Snapshot stability before modifiers so the delta can be re-applied after
  // Phase 8's from-scratch recalculation (Bug 11 fix).
  const stabilityBeforeModifiers = stateAfterActions.stability.value;
  for (const modifier of stateAfterActions.activeTemporaryModifiers) {
    stateAfterActions = applyMechanicalEffectDelta(
      stateAfterActions,
      modifier.effectPerTurn,
      null,
    );
  }
  // Apply ongoing effects from permanent kingdom features (no expiration).
  for (const feature of stateAfterActions.activeKingdomFeatures) {
    stateAfterActions = applyMechanicalEffectDelta(
      stateAfterActions,
      feature.ongoingEffect,
      null,
    );
  }
  const tempModifierStabilityDelta = stateAfterActions.stability.value - stabilityBeforeModifiers;
  stateAfterActions = {
    ...stateAfterActions,
    activeTemporaryModifiers: stateAfterActions.activeTemporaryModifiers
      .map((m) => ({ ...m, turnsRemaining: m.turnsRemaining - 1 }))
      .filter((m) => m.turnsRemaining > 0),
  };

  // Compute readiness delta after actions so deploymentPosture changes take effect.
  // Apply condition modifier to readiness decay (e.g., harsh winter increases decay).
  const baseReadinessDecay = calculateReadinessDecay(stateAfterActions.military.deploymentPosture);
  const readinessDecay = baseReadinessDecay * conditionModifiers.militaryReadinessDecayMultiplier;
  const readinessGain = calculateReadinessGain(stateAfterActions.military.militaryCasteQuality, false);
  const readinessDelta = readinessGain - readinessDecay;

  // ---- Phase 3: Upkeep and Consumption ----
  // Construction gold cost: placeholder 0 until data layer defines per-project gold costs.
  const constructionCostThisTurn = 0;

  const rawExpenseBreakdown = calculateExpenses(
    stateAfterActions.military,
    stateAfterActions.faithCulture.activeOrders,
    stateAfterActions.policies.intelligenceFundingLevel,
    stateAfterActions.policies.festivalInvestmentLevel,
    constructionCostThisTurn,
  );

  // Apply inflation cost multiplier to expenses (Phase 1b Economic Depth).
  // Inflation erodes purchasing power: military upkeep, construction, and religious upkeep cost more.
  const inflationMult = economicModifiers.inflationCostMultiplier;
  const expenseBreakdown = {
    ...rawExpenseBreakdown,
    militaryUpkeep: rawExpenseBreakdown.militaryUpkeep * inflationMult,
    constructionCosts: rawExpenseBreakdown.constructionCosts * inflationMult,
    religiousUpkeep: rawExpenseBreakdown.religiousUpkeep * inflationMult,
  };

  let updatedTreasury = applyTreasuryFlow(
    stateAfterActions.treasury,
    incomeBreakdownPostAction,
    expenseBreakdown,
  );

  // Record treasury flow to causal ledger.
  const netTreasuryFlow = updatedTreasury.balance - stateAfterActions.treasury.balance;
  maybeRecord(ledger, 'treasury', 'income_and_expenses', 'treasury', 'balance_changed', netTreasuryFlow);

  const baseFoodConsumption = calculateFoodConsumption(
    stateAfterActions.population,
    stateAfterActions.policies.rationingLevel,
    stateAfterActions.policies.militaryRecruitmentStance,
    stateAfterActions.military.forceSize,
  );

  // Apply condition modifiers to food consumption (e.g., harsh winter increases consumption).
  const foodConsumption = baseFoodConsumption * conditionModifiers.foodConsumptionMultiplier;

  let updatedFood = applyFoodFlow(stateAfterActions.food, foodProductionPostAction, foodConsumption);

  // Record food flow to causal ledger.
  const netFoodFlow = updatedFood.reserves - stateAfterActions.food.reserves;
  maybeRecord(ledger, 'food', 'production_and_consumption', 'food', 'reserves_changed', netFoodFlow);

  // ---- Phase 4: Population and Class Dynamics ----
  // Trade income trend used by merchants satisfaction delta.
  const tradeIncomeDelta = tradeIncomePostAction - state.treasury.income.trade;

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

  // Apply ruling style satisfaction modifiers (Phase 5 — Ruling Style).
  const styleModifiers = calculateStyleSatisfactionModifiers(stateAfterActions.rulingStyle.axes);
  for (const cls of Object.values(PopulationClass)) {
    satisfactionDeltas[cls] += styleModifiers[cls];
  }

  // Apply condition satisfaction modifiers (Phase 0b environment effects).
  satisfactionDeltas[PopulationClass.Commoners] += conditionModifiers.commonerSatisfactionDelta;
  satisfactionDeltas[PopulationClass.Merchants] += conditionModifiers.merchantSatisfactionDelta;
  satisfactionDeltas[PopulationClass.Nobility] += conditionModifiers.nobilitySatisfactionDelta;
  satisfactionDeltas[PopulationClass.Clergy] += conditionModifiers.clergySatisfactionDelta;
  satisfactionDeltas[PopulationClass.MilitaryCaste] += conditionModifiers.militaryCasteSatisfactionDelta;

  // Apply economic cycle satisfaction modifiers (Phase 1b Economic Depth).
  satisfactionDeltas[PopulationClass.Merchants] += economicModifiers.merchantSatisfactionDelta;
  // Food price multiplier impact on commoners: high food prices hurt the poor.
  satisfactionDeltas[PopulationClass.Commoners] += economicModifiers.foodPriceSatisfactionPenalty;

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

  // ---- Phase 4b: Population Growth (Expansion 1) ----
  const popGrowthResult = resolvePopulationGrowth(
    updatedPopulation,
    stateAfterActions.populationDynamics,
    updatedFood,
    stateAfterActions.faithCulture.faithLevel,
    stateAfterActions.stability.value,
    stateAfterActions.policies,
    stateAfterActions.military,
    updatedEnvironment.activeConditions,
    stateAfterActions.regions,
    stateAfterActions.activeConflicts.length > 0,
  );
  updatedPopulation = popGrowthResult.population;
  let updatedPopulationDynamics = popGrowthResult.dynamics;

  // Record significant population changes to causal ledger.
  const totalPopBefore = Object.values(stateAfterActions.population).reduce((s, c) => s + c.population, 0);
  const totalPopAfter = Object.values(updatedPopulation).reduce((s, c) => s + c.population, 0);
  maybeRecord(ledger, 'population', 'growth_and_death', 'population', 'total_changed', totalPopAfter - totalPopBefore);
  if (Math.abs(updatedPopulationDynamics.migrationPressure) > 30) {
    maybeRecord(ledger, 'governance', 'migration_pressure', 'population', 'migration_flow', updatedPopulationDynamics.migrationPressure);
  }

  // ---- Phase 4c: Social Fabric (Expansion 4) ----
  const socialFabricResult = resolveSocialFabric(
    updatedPopulation,
    stateAfterActions.stability.value,
    stateAfterActions.policies,
    updatedEnvironment,
    stateAfterActions.activeConflicts.length > 0,
    state.turn.turnNumber,
    updatedPopulationDynamics.consecutiveTurnsIntelNone,
  );

  // Apply class interaction satisfaction deltas.
  for (const cls of Object.values(PopulationClass)) {
    const interactionDelta = socialFabricResult.satisfactionDeltas[cls];
    if (interactionDelta !== 0) {
      updatedPopulation = {
        ...updatedPopulation,
        [cls]: {
          ...updatedPopulation[cls],
          satisfaction: clamp(updatedPopulation[cls].satisfaction + interactionDelta, 0, 100),
        },
      };
    }
  }

  // Add newly emerged social conditions to the environment.
  if (socialFabricResult.newConditions.length > 0) {
    updatedEnvironment = {
      ...updatedEnvironment,
      activeConditions: [...updatedEnvironment.activeConditions, ...socialFabricResult.newConditions],
    };
    conditionCardTriggers = [...conditionCardTriggers, ...socialFabricResult.conditionCards];

    // Record social condition emergence to causal ledger.
    for (const cond of socialFabricResult.newConditions) {
      maybeRecord(ledger, 'social_fabric', `${cond.type}_emerged`, 'stability', 'social_condition', -10);
    }
  }

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
    // Composite military strength on 0–100 scale, comparable to neighbor.militaryStrength.
    const playerMilitaryStrength = clamp(
      Math.round(
        militaryAfterUpdate.readiness * 0.3 +
        militaryAfterUpdate.equipmentCondition * 0.25 +
        militaryAfterUpdate.morale * 0.25 +
        militaryAfterUpdate.militaryCasteQuality * 0.2,
      ),
      0,
      100,
    );
    aiRelationshipDeltas[neighbor.id] = calculateAIRelationshipDelta(
      neighbor,
      playerMilitaryStrength,
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
    neighbors: tickDiplomaticAgreements(diplomacyAfterDrift.neighbors, justAcceptedAgreementIds),
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
      targetNeighbor?.kingdomSimulation,
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
      stateAfterActions.espionage.counterIntelligenceLevel + counterIntelDelta
        + conditionModifiers.counterIntelligenceDelta,
      0,
      100,
    ),
  };

  // Propagate espionage network strength to military intelligence advantage.
  let updatedMilitary = {
    ...militaryAfterUpdate,
    intelligenceAdvantage: updatedEspionage.networkStrength,
  };

  // ---- Phase 5a: Rival Kingdom Simulation + Agenda Tick ----
  // Each rival's kingdomSimulation advances before AI action evaluation so
  // that this turn's pressure scores reflect this turn's sim state. Phase 3
  // also ticks the agenda (may shift to a new one) and decays memory weights.
  const simRunSeed = state.runSeed ?? `fallback_${state.turn.turnNumber}`;
  updatedDiplomacy = {
    ...updatedDiplomacy,
    neighbors: updatedDiplomacy.neighbors.map((n) => {
      let next = n;
      if (n.kingdomSimulation) {
        const tickRng = seededRandom(`${simRunSeed}_sim_${n.id}_t${state.turn.turnNumber}`);
        const nextSim = tickRivalKingdom(n.kingdomSimulation, n.militaryStrength, tickRng);
        next = { ...next, kingdomSimulation: nextSim };
      }
      if (n.agenda) {
        const agendaRng = seededRandom(`${simRunSeed}_agenda_${n.id}_t${state.turn.turnNumber}`);
        let nextAgenda = tickAgenda(n.agenda, next, state, agendaRng);
        if (shouldAgendaShift(nextAgenda, next, state)) {
          nextAgenda = selectInitialAgenda(next, state, agendaRng);
        }
        next = { ...next, agenda: nextAgenda };
      }
      if (n.memory && n.memory.length > 0) {
        // 1/12 years per turn (turns are months). Slow attrition.
        next = { ...next, memory: decayMemoryWeights(n.memory, 1 / 12) };
      }
      return next;
    }),
  };

  // ---- Phase 5b: AI Neighbor Autonomous Actions ----
  const allNeighborActions: NeighborAction[] = [];
  const knowledgeMilBonus = getMilitaryBonus(stateAfterActions.knowledge) * 100;
  let externalHeterodoxPressure = 0;

  for (const neighbor of updatedDiplomacy.neighbors) {
    const basePressure = neighbor.kingdomSimulation
      ? computeRivalActionPressure(neighbor.kingdomSimulation, neighbor)
      : undefined;
    const pressure = basePressure
      ? applyAgendaPressureModifier(basePressure, neighbor.agenda, neighbor, state)
      : undefined;
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
      pressure,
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
        // Store as pending proposal rather than auto-accepting.
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  pendingProposals: [
                    ...n.pendingProposals,
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
        // Store as pending proposal rather than auto-accepting.
        // Relationship bonus deferred until proposal is accepted.
        updatedDiplomacy = {
          ...updatedDiplomacy,
          neighbors: updatedDiplomacy.neighbors.map((n) =>
            n.id === action.neighborId
              ? {
                  ...n,
                  pendingProposals: [
                    ...n.pendingProposals,
                    {
                      agreementId: `treaty_${action.neighborId}_t${state.turn.turnNumber}`,
                      neighborId: action.neighborId,
                      turnsRemaining: null,
                    },
                  ],
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
    // Use the same target lookup fallback as the main intel resolution (Phase 5a).
    const espTargetId: string | null =
      op.targetNeighborId ??
      (typeof op.parameters['targetId'] === 'string' ? op.parameters['targetId'] : null);
    if (espTargetId === null) continue;
    const targetNeighbor = updatedDiplomacy.neighbors.find(
      (n) => n.id === espTargetId,
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
  // Track newly initiated conflicts so they skip combat this turn (Bug 9 fix).
  const newlyInitiatedNeighborIds = new Set<string>();

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
        newlyInitiatedNeighborIds.add(action.neighborId);
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
      newlyInitiatedNeighborIds.add(neighbor.id);
    }
  }

  // Resolve active conflicts.
  const resolvedConflicts: ConflictState[] = [];
  const ongoingConflicts: ConflictState[] = [];

  for (const conflict of activeConflicts) {
    // Newly declared wars don't fight combat until next turn.
    if (newlyInitiatedNeighborIds.has(conflict.neighborId)) {
      ongoingConflicts.push(conflict);
      continue;
    }
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
  let updatedRegions = stateAfterActions.regions;

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
    updatedRegions = afterConsequences.regions;
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

  // Re-apply temporary modifier stability delta that was computed in Phase 2b
  // but lost when calculateStability recalculated from scratch.
  if (tempModifierStabilityDelta !== 0) {
    updatedStability = {
      ...updatedStability,
      value: clamp(updatedStability.value + tempModifierStabilityDelta, 0, 100),
    };
  }

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

  // Apply condition stability delta (Phase 0b environment effects).
  if (conditionModifiers.stabilityDelta !== 0) {
    const preCondStability = updatedStability.value;
    updatedStability = {
      ...updatedStability,
      value: clamp(updatedStability.value + conditionModifiers.stabilityDelta, 0, 100),
    };
    maybeRecord(ledger, 'environment', 'condition_stability_effect', 'stability', 'stability_changed', updatedStability.value - preCondStability);
  }

  // ---- Phase 9: Event and Storyline Generation ----
  // nextTurnNumber is needed here and again in Phase 11.
  const nextTurnNumber = state.turn.turnNumber + 1;

  // Phase 5 data layer provides the event and storyline pools.
  // EVENT_REGISTRY is used by surfaceEvents() — only the main pool.
  // FOLLOW_UP_REGISTRY merges both pools so processDueFollowUps can
  // resolve follow-up-only events by id.
  const EVENT_REGISTRY: EventDefinition[] = EVENT_POOL;
  const FOLLOW_UP_REGISTRY: EventDefinition[] = [...EVENT_POOL, ...FOLLOW_UP_POOL];
  const STORYLINE_REGISTRY: StorylineDefinition[] = STORYLINE_POOL;

  // ---- Phase 9a: Resolve events based on player crisis/petition responses ----
  // CrisisResponse actions carry eventId + choiceId in parameters. Match them to
  // active events and mark resolved so the effects loop below can process them.
  const crisisActions = stateAfterActions.actionBudget.queuedActions.filter(
    (a) => a.type === ActionType.CrisisResponse,
  );
  if (crisisActions.length > 0) {
    stateAfterActions = {
      ...stateAfterActions,
      activeEvents: stateAfterActions.activeEvents.map((event) => {
        const action = crisisActions.find(
          (a) => a.parameters['eventId'] === event.id,
        );
        if (action && typeof action.parameters['choiceId'] === 'string') {
          return resolveEventChoice(event, action.parameters['choiceId']);
        }
        return event;
      }),
    };
  }

  // Capture resolved events before chain advancement drops them.
  const resolvedEvents = stateAfterActions.activeEvents.filter((e) => e.isResolved);

  // Merge resolved events into eventHistory so that surfaceEvents, advanceEventChains,
  // and processDueFollowUps see current-turn resolutions in their dedup sets.
  // Without this, resolved events fall through both existingActive (dropped by
  // advanceEventChains) and eventHistory (not yet dispatched to context), allowing
  // them to be immediately re-surfaced for the next turn.
  const mergedEventHistory = [...eventHistory, ...resolvedEvents];

  // Apply mechanical effects, schedule follow-ups, and update class-favor tracking
  // for all events the player resolved since the last turn.
  const currentPacing = stateAfterActions.narrativePacing ?? createInitialPacingState();
  let pacingWithChoiceFavor = currentPacing;
  let pendingFollowUpsAfterChoices = stateAfterActions.pendingFollowUps ?? [];

  // Snapshot pre-event state so we can forward deltas to the phase variables
  // (which were computed in Phases 3-8 from the original stateAfterActions).
  const preEventTreasuryBalance = stateAfterActions.treasury.balance;
  const preEventFoodReserves = stateAfterActions.food.reserves;
  const preEventStabilityValue = stateAfterActions.stability.value;
  const preEventMilitary = stateAfterActions.military;
  const preEventFaithCulture = stateAfterActions.faithCulture;
  const preEventEspionageNetwork = stateAfterActions.espionage.networkStrength;
  const preEventPopulation = stateAfterActions.population;
  const preEventDiplomacy = stateAfterActions.diplomacy;
  const preEventRegions = stateAfterActions.regions;

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

  // Forward event effect deltas to phase variables so workingState doesn't
  // overwrite them with stale Phases 3-8 values.
  const eventTreasuryDelta = stateAfterActions.treasury.balance - preEventTreasuryBalance;
  const eventFoodDelta = stateAfterActions.food.reserves - preEventFoodReserves;
  const eventStabilityDelta = stateAfterActions.stability.value - preEventStabilityValue;
  if (eventTreasuryDelta !== 0) {
    updatedTreasury = { ...updatedTreasury, balance: Math.max(0, updatedTreasury.balance + eventTreasuryDelta) };
  }
  if (eventFoodDelta !== 0) {
    updatedFood = { ...updatedFood, reserves: Math.max(0, updatedFood.reserves + eventFoodDelta) };
  }
  if (eventStabilityDelta !== 0) {
    updatedStability = { ...updatedStability, value: clamp(updatedStability.value + eventStabilityDelta, 0, 100) };
  }
  // Military deltas
  if (stateAfterActions.military !== preEventMilitary) {
    const milReadinessDelta = stateAfterActions.military.readiness - preEventMilitary.readiness;
    const milMoraleDelta = stateAfterActions.military.morale - preEventMilitary.morale;
    const milEquipDelta = stateAfterActions.military.equipmentCondition - preEventMilitary.equipmentCondition;
    const milForceDelta = stateAfterActions.military.forceSize - preEventMilitary.forceSize;
    if (milReadinessDelta !== 0 || milMoraleDelta !== 0 || milEquipDelta !== 0 || milForceDelta !== 0) {
      updatedMilitary = {
        ...updatedMilitary,
        readiness: clamp(updatedMilitary.readiness + milReadinessDelta, 0, 100),
        morale: clamp(updatedMilitary.morale + milMoraleDelta, 0, 100),
        equipmentCondition: clamp(updatedMilitary.equipmentCondition + milEquipDelta, 0, 100),
        forceSize: Math.max(0, updatedMilitary.forceSize + milForceDelta),
      };
    }
  }
  // Faith/culture deltas
  if (stateAfterActions.faithCulture !== preEventFaithCulture) {
    const faithDeltaEvt = stateAfterActions.faithCulture.faithLevel - preEventFaithCulture.faithLevel;
    const heterDeltaEvt = stateAfterActions.faithCulture.heterodoxy - preEventFaithCulture.heterodoxy;
    const cohDeltaEvt = stateAfterActions.faithCulture.culturalCohesion - preEventFaithCulture.culturalCohesion;
    if (faithDeltaEvt !== 0 || heterDeltaEvt !== 0 || cohDeltaEvt !== 0) {
      updatedFaithCulture = {
        ...updatedFaithCulture,
        faithLevel: clamp(updatedFaithCulture.faithLevel + faithDeltaEvt, 0, 100),
        heterodoxy: clamp(updatedFaithCulture.heterodoxy + heterDeltaEvt, 0, 100),
        culturalCohesion: clamp(updatedFaithCulture.culturalCohesion + cohDeltaEvt, 0, 100),
      };
    }
  }
  // Espionage delta
  const eventEspDelta = stateAfterActions.espionage.networkStrength - preEventEspionageNetwork;
  if (eventEspDelta !== 0) {
    updatedEspionage = {
      ...updatedEspionage,
      networkStrength: clamp(updatedEspionage.networkStrength + eventEspDelta, 0, 100),
    };
  }
  // Population satisfaction deltas
  if (stateAfterActions.population !== preEventPopulation) {
    for (const cls of Object.values(PopulationClass)) {
      const satDelta = stateAfterActions.population[cls].satisfaction - preEventPopulation[cls].satisfaction;
      if (satDelta !== 0) {
        updatedPopulation = {
          ...updatedPopulation,
          [cls]: {
            ...updatedPopulation[cls],
            satisfaction: clamp(updatedPopulation[cls].satisfaction + satDelta, 0, 100),
          },
        };
      }
    }
  }
  // Diplomacy deltas
  if (stateAfterActions.diplomacy !== preEventDiplomacy) {
    updatedDiplomacy = {
      ...updatedDiplomacy,
      neighbors: updatedDiplomacy.neighbors.map((n) => {
        const preN = preEventDiplomacy.neighbors.find((pn) => pn.id === n.id);
        const postN = stateAfterActions.diplomacy.neighbors.find((pn) => pn.id === n.id);
        if (!preN || !postN || preN.relationshipScore === postN.relationshipScore) return n;
        const relDelta = postN.relationshipScore - preN.relationshipScore;
        return { ...n, relationshipScore: clamp(n.relationshipScore + relDelta, 0, 100) };
      }),
    };
  }
  // Region deltas (development/condition changes from event effects)
  if (stateAfterActions.regions !== preEventRegions) {
    updatedRegions = stateAfterActions.regions.map((postR) => {
      const preR = preEventRegions.find((r) => r.id === postR.id);
      const curR = updatedRegions.find((r) => r.id === postR.id);
      if (!preR || !curR) return curR ?? postR;
      const devDelta = postR.developmentLevel - preR.developmentLevel;
      if (devDelta !== 0) {
        return { ...curR, developmentLevel: Math.max(0, curR.developmentLevel + devDelta) };
      }
      return curR;
    });
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
    mergedEventHistory,
  );

  // Process due follow-up events before standard surfacing.
  const activeEventIds = new Set(
    chainAdvancedEvents.map((e) => e.definitionId),
  );
  const historyEventIds = new Set(
    mergedEventHistory.map((e) => e.definitionId),
  );
  const followUpResult = processDueFollowUps(
    stateAfterActions.pendingFollowUps ?? [],
    FOLLOW_UP_REGISTRY,
    nextTurnNumber,
    stateAfterActions,
    activeEventIds,
    historyEventIds,
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
    mergedEventHistory,
    categoryWeights,
  );

  // Convert condition card triggers from Phase 0b into ActiveEvent entries.
  const conditionActiveEvents: ActiveEvent[] = conditionCardTriggers.map((trigger) => ({
    id: `cond_${trigger.conditionType}_t${nextTurnNumber}_${trigger.conditionId}`,
    definitionId: `evt_cond_${trigger.conditionType.toLowerCase()}_${trigger.severity.toLowerCase()}`,
    title: '',
    description: '',
    category: EventCategory.Environment,
    severity: trigger.severity === ConditionSeverity.Severe ? EventSeverity.Critical
      : trigger.severity === ConditionSeverity.Moderate ? EventSeverity.Serious
      : EventSeverity.Notable,
    choices: [],
    isResolved: false,
    choiceMade: null,
    turnSurfaced: nextTurnNumber,
    chainId: null,
    chainStep: null,
    affectedRegionId: trigger.regionId,
    affectedClassId: null,
    affectedNeighborId: null,
    relatedStorylineId: null,
    outcomeQuality: null,
    isFollowUp: false,
    followUpSourceId: null,
  }));

  const activeEvents = [...eventsWithFollowUps, ...newEvents, ...conditionActiveEvents];

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
    populationDynamics: updatedPopulationDynamics,
    military: updatedMilitary,
    stability: updatedStability,
    faithCulture: updatedFaithCulture,
    diplomacy: updatedDiplomacy,
    espionage: updatedEspionage,
    regions: updatedRegions,
    environment: updatedEnvironment,
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
          tag: `${storyline.definitionId}:resolution:${lastDecision.choiceId}`,
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
    updatedRegions = workingState.regions;
  }

  // Track resolved storyline IDs and last activation/resolution turns.
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

  // Update lastStorylineResolutionTurn if any storylines resolved this turn.
  const updatedLastStorylineResolutionTurn = newlyResolvedStorylineIds.length > 0
    ? nextTurnNumber
    : stateAfterActions.lastStorylineResolutionTurn;

  // --- Narrative Pressure: accumulate from all resolved decisions this turn ---
  // Apply pressure from event choices resolved this turn.
  let updatedPressure = stateAfterActions.narrativePressure;
  for (const evt of stateAfterActions.activeEvents) {
    if (evt.isResolved && evt.choiceMade) {
      updatedPressure = applyPressure(updatedPressure, 'event', evt.definitionId, evt.choiceMade);
    }
  }
  // Apply pressure from storyline branch decisions made this turn.
  for (const sl of advancedStorylines) {
    for (const decision of sl.decisionHistory) {
      if (decision.turnNumber === stateAfterActions.turn.turnNumber) {
        updatedPressure = applyPressure(updatedPressure, 'storyline', sl.definitionId, decision.choiceId);
      }
    }
  }
  // Apply pressure from decree actions queued this turn.
  for (const action of stateAfterActions.actionBudget.queuedActions) {
    if (action.type === ActionType.Decree) {
      updatedPressure = applyPressure(updatedPressure, 'decree', action.actionDefinitionId, action.actionDefinitionId);
    }
  }

  // --- Evaluate storyline activation against updated pressure ---
  const candidate = evaluateStorylineActivation(
    updatedPressure,
    STORYLINE_REGISTRY,
    nextTurnNumber,
    advancedStorylines.filter((s) => s.status !== StorylineStatus.Resolved),
    allResolvedStorylineIds,
    stateAfterActions.persistentConsequences,
    updatedLastStorylineResolutionTurn,
  );

  // If a candidate qualifies, activate it.
  const newStorylines = [];
  if (candidate) {
    const def = STORYLINE_REGISTRY.find(s => s.id === candidate.storylineId);
    if (def) {
      newStorylines.push(buildActiveStoryline(def, nextTurnNumber));
    }
  }

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
  const workingResources = stateAfterActions.resources;
  let constructionRegions = updatedRegions;
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
        // Treasury bonus (one-time balance bump on completion; persistent income via development)
        if (fx.treasuryBonusDelta) {
          constructionTreasury = {
            ...constructionTreasury,
            balance: constructionTreasury.balance + fx.treasuryBonusDelta,
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
        // Knowledge progress bonus (applied to focused branch, or highest-progress fallback)
        if (fx.knowledgeProgressDelta) {
          const focusBranch = stateAfterActions.policies.researchFocus
            ?? Object.values(constructionKnowledge.branches)
                .sort((a, b) => b.progressValue - a.progressValue)[0]?.branch
            ?? null;
          if (focusBranch) {
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
    // Just decrement the turn counter — but skip projects created this turn.
    if (project.turnsRemaining <= 0) continue;

    const isNewThisTurn = !preActionProjectIds.has(project.id);
    updatedConstructionProjects.push({
      ...project,
      turnsRemaining: isNewThisTurn ? project.turnsRemaining : project.turnsRemaining - 1,
    });
  }

  // ---- Phase 11a: Ruling Style Accumulation ----
  let updatedRulingStyle = stateAfterActions.rulingStyle ?? createInitialRulingStyleState();

  // Accumulate from resolved events
  for (const event of stateAfterActions.activeEvents) {
    if (!event.isResolved || event.choiceMade === null) continue;
    const styleTags = EVENT_CHOICE_STYLE_TAGS[event.definitionId]?.[event.choiceMade];
    if (styleTags) {
      const decision: StyleDecision = {
        source: 'event',
        sourceId: event.definitionId,
        choiceId: event.choiceMade,
        turnApplied: state.turn.turnNumber,
        axisDeltas: styleTags,
      };
      updatedRulingStyle = accumulateStyleDecision(updatedRulingStyle, decision);
    }
  }

  // Accumulate from enacted decrees
  for (const action of stateAfterActions.actionBudget.queuedActions) {
    if (action.type === ActionType.Decree) {
      const styleTags = DECREE_STYLE_TAGS[action.actionDefinitionId];
      if (styleTags) {
        const decision: StyleDecision = {
          source: 'decree',
          sourceId: action.actionDefinitionId,
          choiceId: action.actionDefinitionId,
          turnApplied: state.turn.turnNumber,
          axisDeltas: styleTags,
        };
        updatedRulingStyle = accumulateStyleDecision(updatedRulingStyle, decision);
      }
    }
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

  // Finalize the causal ledger: chain related entries, merge with previous history, prune old chains.
  const finalizedLedger = finalizeTurnLedger(
    ledger,
    state.causalLedger ?? createEmptyLedger(),
  );

  // ---- Phase 11 bookkeeping: update intel none counter (Expansion 4) ----
  const nextIntelNoneTurns = stateAfterActions.policies.intelligenceFundingLevel === IntelligenceFundingLevel.None
    ? updatedPopulationDynamics.consecutiveTurnsIntelNone + 1
    : 0;
  updatedPopulationDynamics = {
    ...updatedPopulationDynamics,
    consecutiveTurnsIntelNone: nextIntelNoneTurns,
  };

  // Assemble the complete next game state.
  const nextState: GameState = {
    turn: nextTurn,
    treasury: constructionTreasury,
    food: constructionFood,
    resources: workingResources,
    population: updatedPopulation,
    populationDynamics: updatedPopulationDynamics,
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
    activeKingdomFeatures: stateAfterActions.activeKingdomFeatures,
    pendingFollowUps: followUpResult.remainingFollowUps,
    narrativePacing: updatedNarrativePacing,
    resolvedStorylineIds: allResolvedStorylineIds,
    lastStorylineActivationTurn: updatedLastActivationTurn,
    lastStorylineResolutionTurn: updatedLastStorylineResolutionTurn,
    narrativePressure: updatedPressure,
    issuedDecrees: stateAfterActions.issuedDecrees,
    rulingStyle: updatedRulingStyle,
    scenarioId: stateAfterActions.scenarioId,
    environment: updatedEnvironment,
    economy: updatedEconomy,
    causalLedger: finalizedLedger,
  };

  return {
    nextState,
    historyEntry,
    newlyUnlockedMilestones,
    triggeredFailureConditions,
    failureWarnings,
    completedConstructionIds,
    resolvedEvents,
    generatedReports,
    conditionCardTriggers,
  };
}
