// gameplay-blueprint.md — "The Frozen March" Scenario
// A military-focused scenario: large but under-equipped army, hostile neighbor,
// harsh winter, strained food supplies.

import {
  ACTION_BUDGET_BASE,
  COUNTER_INTELLIGENCE_STARTING,
  CULTURAL_COHESION_STARTING,
  INTELLIGENCE_NETWORK_STARTING,
  POPULATION_STARTING,
  RESOURCE_STARTING_EXTRACTION_RATES,
  RESOURCE_STARTING_STOCKPILES,
  SATISFACTION_STARTING,
} from '../../engine/constants';
import type { GameState } from '../../engine/types';
import { generateNeighborNames, generateRunSeed } from '../text/name-generation';
import { createInitialRivalState } from '../../engine/systems/rival-simulation';
import { edge, finalizeGeography } from '../../engine/systems/geography';
import { DISPOSITION_TO_PERSONALITY } from '../../bridge/dossierCompiler';
import { createInitialPacingState } from '../../engine/events/narrative-pacing';
import { createInitialNarrativePressure } from '../../engine/systems/narrative-pressure';
import { createInitialRulingStyleState } from '../../engine/systems/ruling-style';
import { createInitialEnvironmentState } from '../../engine/systems/environment';
import { createEmptyLedger } from '../../engine/systems/causal-ledger';
import { createInitialPopulationDynamicsState } from '../../engine/systems/population-dynamics';
import { createInitialEconomicState } from '../../engine/systems/economic-cycle';
import {
  DiplomaticPosture,
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  KnowledgeBranch,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  NeighborDisposition,
  PopulationClass,
  RationingLevel,
  ReligiousTolerance,
  ResourceType,
  Season,
  TaxationLevel,
  TerrainType,
  TradeOpenness,
} from '../../engine/types';

export const FROZEN_MARCH_SCENARIO_ID = 'frozen_march';

export function createFrozenMarchScenario(): GameState {
  const runSeed = generateRunSeed();

  const population: GameState['population'] = {
    [PopulationClass.Nobility]: {
      population: POPULATION_STARTING[PopulationClass.Nobility],
      satisfaction: 50,
      satisfactionDeltaLastTurn: 0,
      intrigueRisk: 10,
    },
    [PopulationClass.Clergy]: {
      population: POPULATION_STARTING[PopulationClass.Clergy],
      satisfaction: 50,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Merchants]: {
      population: POPULATION_STARTING[PopulationClass.Merchants],
      satisfaction: 45,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Commoners]: {
      population: POPULATION_STARTING[PopulationClass.Commoners],
      satisfaction: 45,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.MilitaryCaste]: {
      population: POPULATION_STARTING[PopulationClass.MilitaryCaste],
      satisfaction: 55,
      satisfactionDeltaLastTurn: 0,
    },
  };

  const regions: GameState['regions'] = [
    {
      id: 'region_heartlands',
      primaryEconomicOutput: 'Food',
      localConditionModifier: 1.0,
      populationContribution: 12000,
      developmentLevel: 40,
      localFaithProfile: 'orthodox',
      culturalIdentity: 'highland',
      strategicValue: 50,
      isOccupied: false,
      // Expansion 5 — Regional Life
      localPopulation: 12000,
      loyalty: 55,
      infrastructure: { roads: 22, walls: 25, granaries: 20, sanitation: 18 },
      localConditions: [],
      localEconomy: { productionOutput: 0, localTradeActivity: 30, taxContribution: 0 },
      borderRegion: false,
      terrainType: TerrainType.Plains,
    },
    {
      id: 'region_ironvale',
      primaryEconomicOutput: ResourceType.Iron,
      localConditionModifier: 1.0,
      populationContribution: 5000,
      developmentLevel: 35,
      localFaithProfile: 'orthodox',
      culturalIdentity: 'highland',
      strategicValue: 60,
      isOccupied: false,
      localPopulation: 5000,
      loyalty: 50,
      infrastructure: { roads: 15, walls: 30, granaries: 15, sanitation: 15 },
      localConditions: [],
      localEconomy: { productionOutput: 0, localTradeActivity: 25, taxContribution: 0 },
      borderRegion: false,
      terrainType: TerrainType.Hills,
    },
    {
      id: 'region_timbermark',
      primaryEconomicOutput: ResourceType.Wood,
      localConditionModifier: 1.0,
      populationContribution: 7000,
      developmentLevel: 30,
      localFaithProfile: 'orthodox',
      culturalIdentity: 'highland',
      strategicValue: 40,
      isOccupied: false,
      localPopulation: 7000,
      loyalty: 40,
      infrastructure: { roads: 15, walls: 18, granaries: 12, sanitation: 12 },
      localConditions: [],
      localEconomy: { productionOutput: 0, localTradeActivity: 20, taxContribution: 0 },
      borderRegion: true,
      terrainType: TerrainType.Forest,
    },
  ];

  const baseState: GameState = {
    // --- Time ---
    turn: {
      turnNumber: 1,
      month: 12,
      season: Season.Winter,
      year: 1,
    },

    // --- Treasury ---
    treasury: {
      balance: 400,
      netFlowPerTurn: 0,
      income: {
        taxation: 0,
        trade: 0,
        miscellaneous: 0,
      },
      expenses: {
        militaryUpkeep: 0,
        constructionCosts: 0,
        intelligenceFunding: 0,
        religiousUpkeep: 0,
        festivalCosts: 0,
      },
      consecutiveTurnsInsolvent: 0,
    },

    // --- Food ---
    food: {
      reserves: 120,
      productionPerTurn: 0,
      consumptionPerTurn: 0,
      netFlowPerTurn: 0,
      seasonalModifier: 0.25, // Winter effect doubled (normal Winter is 0.5)
      agriculturalEfficiencyBonus: 0,
      consecutiveTurnsEmpty: 0,
    },

    // --- Resources ---
    resources: {
      [ResourceType.Wood]: {
        stockpile: RESOURCE_STARTING_STOCKPILES[ResourceType.Wood],
        extractionRatePerTurn: RESOURCE_STARTING_EXTRACTION_RATES[ResourceType.Wood],
      },
      [ResourceType.Iron]: {
        stockpile: RESOURCE_STARTING_STOCKPILES[ResourceType.Iron],
        extractionRatePerTurn: RESOURCE_STARTING_EXTRACTION_RATES[ResourceType.Iron],
      },
      [ResourceType.Stone]: {
        stockpile: RESOURCE_STARTING_STOCKPILES[ResourceType.Stone],
        extractionRatePerTurn: RESOURCE_STARTING_EXTRACTION_RATES[ResourceType.Stone],
      },
    },

    // --- Population ---
    population,
    populationDynamics: createInitialPopulationDynamicsState(population, regions),

    // --- Military ---
    military: {
      forceSize: 600,
      readiness: 50,
      equipmentCondition: 35,
      morale: 55,
      upkeepBurdenPerTurn: 0,
      deploymentPosture: MilitaryPosture.Standby,
      intelligenceAdvantage: 0,
      militaryCasteQuality: 0,
    },

    // --- Stability ---
    stability: {
      value: 45,
      consecutiveTurnsAtZero: 0,
      classContributions: {
        [PopulationClass.Nobility]: 0,
        [PopulationClass.Clergy]: 0,
        [PopulationClass.Merchants]: 0,
        [PopulationClass.Commoners]: 0,
        [PopulationClass.MilitaryCaste]: 0,
      },
      foodSecurityContribution: 0,
      faithContribution: 0,
      culturalCohesionContribution: 0,
      decreePaceContribution: 0,
    },

    // --- Faith & Culture ---
    faithCulture: {
      faithLevel: 50,
      culturalCohesion: CULTURAL_COHESION_STARTING,
      activeOrders: [],
      heterodoxy: 10,
      schismActive: false,
      schismDetails: null,
      kingdomFaithTraditionId: 'orthodox',
      kingdomCultureIdentityId: 'highland',
    },

    // --- Diplomacy ---
    diplomacy: {
      neighbors: [
        {
          id: 'neighbor_arenthal',
          relationshipScore: 60,
          attitudePosture: DiplomaticPosture.Neutral,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Cautious,
          militaryStrength: 55,
          religiousProfile: 'orthodox',
          culturalIdentity: 'coastal',
          espionageCapability: 30,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
          recentActionHistory: [],
          ...generateNeighborNames(
            runSeed,
            'neighbor_arenthal',
            'coastal',
            DISPOSITION_TO_PERSONALITY[NeighborDisposition.Cautious],
          ),
          kingdomSimulation: createInitialRivalState(
            `${runSeed}_neighbor_arenthal_sim`,
            NeighborDisposition.Cautious,
          ),
        },
        {
          id: 'neighbor_valdris',
          relationshipScore: 25,
          attitudePosture: DiplomaticPosture.Hostile,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Aggressive,
          militaryStrength: 75,
          religiousProfile: 'reformed',
          culturalIdentity: 'highland',
          espionageCapability: 40,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
          recentActionHistory: [],
          ...generateNeighborNames(
            runSeed,
            'neighbor_valdris',
            'highland',
            DISPOSITION_TO_PERSONALITY[NeighborDisposition.Aggressive],
          ),
          kingdomSimulation: createInitialRivalState(
            `${runSeed}_neighbor_valdris_sim`,
            NeighborDisposition.Aggressive,
          ),
        },
      ],
    },

    // --- Espionage ---
    espionage: {
      networkStrength: INTELLIGENCE_NETWORK_STARTING,
      counterIntelligenceLevel: COUNTER_INTELLIGENCE_STARTING,
    },

    // --- Knowledge ---
    knowledge: {
      branches: {
        [KnowledgeBranch.Agricultural]: {
          branch: KnowledgeBranch.Agricultural,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.Military]: {
          branch: KnowledgeBranch.Military,
          progressValue: 100,
          currentMilestoneIndex: 1,
          unlockedAdvancements: ['military_milestone_0'],
        },
        [KnowledgeBranch.Civic]: {
          branch: KnowledgeBranch.Civic,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.MaritimeTrade]: {
          branch: KnowledgeBranch.MaritimeTrade,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.CulturalScholarly]: {
          branch: KnowledgeBranch.CulturalScholarly,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.NaturalPhilosophy]: {
          branch: KnowledgeBranch.NaturalPhilosophy,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
      },
      progressPerTurn: 0,
    },

    // --- Regions ---
    regions,

    // --- Policies ---
    policies: {
      taxationLevel: TaxationLevel.Moderate,
      tradeOpenness: TradeOpenness.Open,
      militaryRecruitmentStance: MilitaryRecruitmentStance.Voluntary,
      rationingLevel: RationingLevel.Normal,
      researchFocus: null,
      religiousTolerance: ReligiousTolerance.Favored,
      festivalInvestmentLevel: FestivalInvestmentLevel.None,
      intelligenceFundingLevel: IntelligenceFundingLevel.Minimal,
      laborAllocationPriority: null,
      policyChangedThisTurn: false,
    },

    // --- Construction Projects ---
    constructionProjects: [],

    // --- Active Events & Storylines ---
    activeEvents: [],
    activeStorylines: [],
    activeConflicts: [],
    neighborActions: [],

    // --- Action Budget ---
    actionBudget: {
      slotsTotal: ACTION_BUDGET_BASE,
      slotsUsed: 0,
      slotsRemaining: ACTION_BUDGET_BASE,
      policyChangesUsedThisTurn: 0,
      queuedActions: [],
    },

    // --- Crown Bar (derived, will be recalculated) ---
    crownBar: {
      turnNumber: 1,
      season: Season.Winter,
      year: 1,
      treasuryBalance: 400,
      foodReserves: 120,
      stabilityRating: 45,
      unresolvedUrgentMatters: 0,
    },

    // --- Failure Tracking ---
    activeFailureConditions: [],
    consecutiveTurnsOverthrowRisk: 0,

    // --- Persistent History ---
    persistentConsequences: [],
    activeTemporaryModifiers: [],
    activeKingdomFeatures: [],
    pendingFollowUps: [],
    issuedDecrees: [],
    narrativePacing: createInitialPacingState(),
    resolvedStorylineIds: [],
    lastStorylineActivationTurn: 0,
    lastStorylineResolutionTurn: 0,
    narrativePressure: createInitialNarrativePressure(),

    // --- Scenario ---
    // --- Ruling Style ---
    rulingStyle: createInitialRulingStyleState(),

    // --- Scenario ---
    scenarioId: FROZEN_MARCH_SCENARIO_ID,
    runSeed,
    environment: createInitialEnvironmentState(),
    economy: createInitialEconomicState(
      SATISFACTION_STARTING[PopulationClass.Merchants],
    ),
    causalLedger: createEmptyLedger(),

    // --- Geography (Phase 2.5) ---
    // Frozen march: mountain passes dominate. The hostile northern neighbor
    // (Arenthal) presses hard on Timbermark through brutal mountain terrain.
    // A single 'ancestral' claim expresses the old territorial grievance.
    geography: {
      schemaVersion: 1,
      edges: [
        edge('region_heartlands', 'region_ironvale',   'mountain_pass', 'difficult'),
        edge('region_heartlands', 'region_timbermark', 'land',          'open'),
        edge('region_ironvale',   'region_timbermark', 'mountain_pass', 'difficult'),
        edge('region_timbermark', 'neighbor_arenthal', 'mountain_pass', 'contested'),
        edge('region_ironvale',   'neighbor_valdris',  'mountain_pass', 'contested'),
        edge('neighbor_arenthal', 'neighbor_valdris',  'mountain_pass', 'difficult'),
      ],
      historicClaims: [
        {
          neighborId: 'neighbor_arenthal',
          regionId: 'region_timbermark',
          claimStrength: 'ancestral',
          lostOnTurn: null,
          internalReasonCode: 'arenthali_winter_conquest',
        },
      ],
      settlements: [
        {
          id: 'settlement_frosthold',
          regionId: 'region_heartlands',
          role: 'capital',
          populationShare: 0.35,
        },
        {
          id: 'settlement_ironpass',
          regionId: 'region_ironvale',
          role: 'fortress',
          populationShare: 0.25,
        },
      ],
    },
  };

  return finalizeGeography(baseState);
}
