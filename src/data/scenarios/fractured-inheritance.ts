// gameplay-blueprint.md — "The Fractured Inheritance" Scenario

import {
  ACTION_BUDGET_BASE,
  COUNTER_INTELLIGENCE_STARTING,
  FOOD_SEASONAL_MODIFIERS,
  FOOD_STARTING_RESERVES,
  INTELLIGENCE_NETWORK_STARTING,
  MILITARY_EQUIPMENT_CONDITION_STARTING,
  MILITARY_FORCE_SIZE_STARTING,
  MILITARY_MORALE_STARTING,
  MILITARY_READINESS_STARTING,
  POPULATION_STARTING,
  RESOURCE_STARTING_EXTRACTION_RATES,
  RESOURCE_STARTING_STOCKPILES,
} from '../../engine/constants';
import type { GameState } from '../../engine/types';
import { createInitialPacingState } from '../../engine/events/narrative-pacing';
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
  TradeOpenness,
} from '../../engine/types';

export const FRACTURED_INHERITANCE_SCENARIO_ID = 'fractured_inheritance';

export function createFracturedInheritanceScenario(): GameState {
  return {
    // --- Time ---
    turn: {
      turnNumber: 1,
      month: 3,
      season: Season.Spring,
      year: 1,
    },

    // --- Treasury ---
    treasury: {
      balance: 700,
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
    population: {
      [PopulationClass.Nobility]: {
        population: POPULATION_STARTING[PopulationClass.Nobility],
        satisfaction: 30,
        satisfactionDeltaLastTurn: 0,
        intrigueRisk: 35,
      },
      [PopulationClass.Clergy]: {
        population: POPULATION_STARTING[PopulationClass.Clergy],
        satisfaction: 40,
        satisfactionDeltaLastTurn: 0,
      },
      [PopulationClass.Merchants]: {
        population: POPULATION_STARTING[PopulationClass.Merchants],
        satisfaction: 50,
        satisfactionDeltaLastTurn: 0,
      },
      [PopulationClass.Commoners]: {
        population: POPULATION_STARTING[PopulationClass.Commoners],
        satisfaction: 55,
        satisfactionDeltaLastTurn: 0,
      },
      [PopulationClass.MilitaryCaste]: {
        population: POPULATION_STARTING[PopulationClass.MilitaryCaste],
        satisfaction: 45,
        satisfactionDeltaLastTurn: 0,
      },
    },

    // --- Military ---
    military: {
      forceSize: MILITARY_FORCE_SIZE_STARTING,
      readiness: MILITARY_READINESS_STARTING,
      equipmentCondition: MILITARY_EQUIPMENT_CONDITION_STARTING,
      morale: MILITARY_MORALE_STARTING,
      upkeepBurdenPerTurn: 0,
      deploymentPosture: MilitaryPosture.Standby,
      intelligenceAdvantage: 0,
      militaryCasteQuality: 0,
    },

    // --- Stability ---
    stability: {
      value: 35,
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
      faithLevel: 55,
      culturalCohesion: 45,
      activeOrders: [],
      heterodoxy: 20,
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
          attitudePosture: DiplomaticPosture.Tense,
          activeAgreements: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Cautious,
          militaryStrength: 55,
          religiousProfile: 'orthodox',
          culturalIdentity: 'coastal',
          espionageCapability: 30,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
        },
        {
          id: 'neighbor_valdris',
          relationshipScore: 50,
          attitudePosture: DiplomaticPosture.Neutral,
          activeAgreements: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Opportunistic,
          militaryStrength: 60,
          religiousProfile: 'reformed',
          culturalIdentity: 'highland',
          espionageCapability: 40,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
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
    regions: [
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
      },
      {
        id: 'region_timbermark',
        primaryEconomicOutput: ResourceType.Wood,
        localConditionModifier: 0.7,
        populationContribution: 7000,
        developmentLevel: 30,
        localFaithProfile: 'orthodox',
        culturalIdentity: 'highland',
        strategicValue: 40,
        isOccupied: false,
      },
    ],

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
      treasuryBalance: 700,
      foodReserves: FOOD_STARTING_RESERVES,
      stabilityRating: 35,
      unresolvedUrgentMatters: 0,
    },

    // --- Failure Tracking ---
    activeFailureConditions: [],
    consecutiveTurnsOverthrowRisk: 0,

    // --- Persistent History ---
    persistentConsequences: [],
    activeTemporaryModifiers: [],
    pendingFollowUps: [],
    narrativePacing: createInitialPacingState(),
    resolvedStorylineIds: [],
    lastStorylineActivationTurn: 0,

    // --- Scenario ---
    scenarioId: FRACTURED_INHERITANCE_SCENARIO_ID,
  };
}
