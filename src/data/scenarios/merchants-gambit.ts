// gameplay-blueprint.md §11 — "The Merchant's Gambit" Scenario

import {
  ACTION_BUDGET_BASE,
  COUNTER_INTELLIGENCE_STARTING,
  CULTURAL_COHESION_STARTING,
  FAITH_LEVEL_STARTING,
  FOOD_SEASONAL_MODIFIERS,
  FOOD_STARTING_RESERVES,
  INTELLIGENCE_NETWORK_STARTING,
  POPULATION_STARTING,
  RESOURCE_STARTING_EXTRACTION_RATES,
  RESOURCE_STARTING_STOCKPILES,
  SATISFACTION_STARTING,
} from '../../engine/constants';
import type { GameState } from '../../engine/types';
import { generateNeighborNames, generateRunSeed } from '../text/name-generation';
import { createInitialRivalState } from '../../engine/systems/rival-simulation';
import { seedRivalAgendas } from '../../engine/systems/rival-agendas';
import { edge, finalizeGeography } from '../../engine/systems/geography';
import { DISPOSITION_TO_PERSONALITY } from '../../bridge/dossierCompiler';
import { createInitialPacingState } from '../../engine/events/narrative-pacing';
import { createInitialNarrativePressure } from '../../engine/systems/narrative-pressure';
import { createInitialRulingStyleState } from '../../engine/systems/ruling-style';
import { createInitialEnvironmentState } from '../../engine/systems/environment';
import { createInitialCourtHand } from '../../engine/systems/court-hand';
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

export const MERCHANTS_GAMBIT_SCENARIO_ID = 'merchants_gambit';

export function createMerchantsGambitScenario(): GameState {
  const runSeed = generateRunSeed();

  const population: GameState['population'] = {
    [PopulationClass.Nobility]: {
      population: POPULATION_STARTING[PopulationClass.Nobility],
      satisfaction: 40,
      satisfactionDeltaLastTurn: 0,
      intrigueRisk: 10,
    },
    [PopulationClass.Clergy]: {
      population: POPULATION_STARTING[PopulationClass.Clergy],
      satisfaction: 50,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Merchants]: {
      population: 3500,
      satisfaction: 70,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Commoners]: {
      population: POPULATION_STARTING[PopulationClass.Commoners],
      satisfaction: 55,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.MilitaryCaste]: {
      population: POPULATION_STARTING[PopulationClass.MilitaryCaste],
      satisfaction: 40,
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
      loyalty: 65,
      infrastructure: { roads: 30, walls: 20, granaries: 25, sanitation: 22 },
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
      infrastructure: { roads: 18, walls: 22, granaries: 12, sanitation: 16 },
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
      loyalty: 55,
      infrastructure: { roads: 22, walls: 15, granaries: 18, sanitation: 15 },
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
      month: 3,
      season: Season.Spring,
      year: 1,
    },

    // --- Treasury ---
    treasury: {
      balance: 600,
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
      reserves: FOOD_STARTING_RESERVES,
      productionPerTurn: 0,
      consumptionPerTurn: 0,
      netFlowPerTurn: 0,
      seasonalModifier: FOOD_SEASONAL_MODIFIERS[Season.Spring],
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
      forceSize: 300,
      readiness: 35,
      equipmentCondition: 40,
      morale: 40,
      upkeepBurdenPerTurn: 0,
      deploymentPosture: MilitaryPosture.Standby,
      intelligenceAdvantage: 0,
      militaryCasteQuality: 0,
    },

    // --- Stability ---
    stability: {
      value: 50,
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
      faithLevel: FAITH_LEVEL_STARTING,
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
          relationshipScore: 65,
          attitudePosture: DiplomaticPosture.Friendly,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Mercantile,
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
            DISPOSITION_TO_PERSONALITY[NeighborDisposition.Mercantile],
          ),
          kingdomSimulation: createInitialRivalState(
            `${runSeed}_neighbor_arenthal_sim`,
            NeighborDisposition.Mercantile,
          ),
        },
        {
          id: 'neighbor_valdris',
          relationshipScore: 55,
          attitudePosture: DiplomaticPosture.Neutral,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Mercantile,
          militaryStrength: 60,
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
            DISPOSITION_TO_PERSONALITY[NeighborDisposition.Mercantile],
          ),
          kingdomSimulation: createInitialRivalState(
            `${runSeed}_neighbor_valdris_sim`,
            NeighborDisposition.Mercantile,
          ),
        },
        {
          id: 'neighbor_krath',
          relationshipScore: 30,
          attitudePosture: DiplomaticPosture.Tense,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Aggressive,
          militaryStrength: 70,
          religiousProfile: 'reformed',
          culturalIdentity: 'steppe',
          espionageCapability: 45,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
          recentActionHistory: [],
          ...generateNeighborNames(
            runSeed,
            'neighbor_krath',
            'steppe',
            DISPOSITION_TO_PERSONALITY[NeighborDisposition.Aggressive],
          ),
          kingdomSimulation: createInitialRivalState(
            `${runSeed}_neighbor_krath_sim`,
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
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.Civic]: {
          branch: KnowledgeBranch.Civic,
          progressValue: 0,
          currentMilestoneIndex: 0,
          unlockedAdvancements: [],
        },
        [KnowledgeBranch.MaritimeTrade]: {
          branch: KnowledgeBranch.MaritimeTrade,
          progressValue: 200,
          currentMilestoneIndex: 1,
          unlockedAdvancements: ['maritime_trade_milestone_0'],
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
      season: Season.Spring,
      year: 1,
      treasuryBalance: 600,
      foodReserves: FOOD_STARTING_RESERVES,
      stabilityRating: 50,
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
    scenarioId: MERCHANTS_GAMBIT_SCENARIO_ID,
    runSeed,
    environment: createInitialEnvironmentState(),
    economy: createInitialEconomicState(
      SATISFACTION_STARTING[PopulationClass.Merchants],
    ),
    causalLedger: createEmptyLedger(),

    // --- Court Hand (Phase 5) ---
    courtHand: createInitialCourtHand(),

    // --- Geography (Phase 2.5) ---
    // Merchant's Gambit: sea edges dominate; dense rival↔rival adjacency sets
    // up Phase 11 coalition dynamics. Minimal claims — the neighbors want
    // trade concessions more than territory.
    geography: {
      schemaVersion: 1,
      edges: [
        edge('region_heartlands', 'region_ironvale',   'land',  'open'),
        edge('region_heartlands', 'region_timbermark', 'river', 'open'),
        edge('region_ironvale',   'region_timbermark', 'river', 'open'),
        edge('region_timbermark', 'neighbor_arenthal', 'sea',   'open'),
        edge('region_heartlands', 'neighbor_valdris',  'sea',   'open'),
        edge('region_ironvale',   'neighbor_krath',    'land',  'contested'),
        edge('neighbor_arenthal', 'neighbor_valdris',  'sea',   'open'),
        edge('neighbor_arenthal', 'neighbor_krath',    'sea',   'contested'),
        edge('neighbor_valdris',  'neighbor_krath',    'land',  'open'),
      ],
      historicClaims: [
        {
          neighborId: 'neighbor_krath',
          regionId: 'region_ironvale',
          claimStrength: 'recent',
          lostOnTurn: null,
          internalReasonCode: 'krathi_trade_revanchism',
        },
      ],
      settlements: [
        {
          id: 'settlement_goldhaven',
          regionId: 'region_heartlands',
          role: 'capital',
          populationShare: 0.4,
        },
        {
          id: 'settlement_silvermarket',
          regionId: 'region_timbermark',
          role: 'market',
          populationShare: 0.3,
        },
      ],
    },
  };

  return seedRivalAgendas(finalizeGeography(baseState));
}
