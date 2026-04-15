// gameplay-blueprint.md — "The Faithful Kingdom" Scenario
// A kingdom with deep religious roots, powerful clergy, but a neglected military
// and simmering tensions with a rival-faith neighbor.

import {
  ACTION_BUDGET_BASE,
  FOOD_SEASONAL_MODIFIERS,
  FOOD_STARTING_RESERVES,
  RESOURCE_STARTING_EXTRACTION_RATES,
  RESOURCE_STARTING_STOCKPILES,
} from '../../engine/constants';
import type { GameState } from '../../engine/types';
import { createInitialPacingState } from '../../engine/events/narrative-pacing';
import { createInitialNarrativePressure } from '../../engine/systems/narrative-pressure';
import { createInitialRulingStyleState } from '../../engine/systems/ruling-style';
import { createInitialEnvironmentState } from '../../engine/systems/environment';
import { createEmptyLedger } from '../../engine/systems/causal-ledger';
import { createInitialPopulationDynamicsState } from '../../engine/systems/population-dynamics';
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
  ReligiousOrderType,
  ReligiousTolerance,
  ResourceType,
  Season,
  TaxationLevel,
  TradeOpenness,
} from '../../engine/types';

export const FAITHFUL_KINGDOM_SCENARIO_ID = 'faithful_kingdom';

export function createFaithfulKingdomScenario(): GameState {
  const population: GameState['population'] = {
    [PopulationClass.Nobility]: {
      population: 500,
      satisfaction: 55,
      satisfactionDeltaLastTurn: 0,
      intrigueRisk: 10,
    },
    [PopulationClass.Clergy]: {
      population: 3000,
      satisfaction: 70,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Merchants]: {
      population: 2500,
      satisfaction: 45,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.Commoners]: {
      population: 18000,
      satisfaction: 55,
      satisfactionDeltaLastTurn: 0,
    },
    [PopulationClass.MilitaryCaste]: {
      population: 2000,
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
      localConditionModifier: 1.0,
      populationContribution: 7000,
      developmentLevel: 30,
      localFaithProfile: 'orthodox',
      culturalIdentity: 'highland',
      strategicValue: 40,
      isOccupied: false,
    },
  ];

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
      balance: 500,
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
      forceSize: 350,
      readiness: 40,
      equipmentCondition: 45,
      morale: 45,
      upkeepBurdenPerTurn: 0,
      deploymentPosture: MilitaryPosture.Defensive,
      intelligenceAdvantage: 0,
      militaryCasteQuality: 0,
    },

    // --- Stability ---
    stability: {
      value: 55,
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
      faithLevel: 85,
      culturalCohesion: 70,
      activeOrders: [
        { type: ReligiousOrderType.Healing, isActive: true, upkeepPerTurn: 20 },
        { type: ReligiousOrderType.Scholarly, isActive: true, upkeepPerTurn: 20 },
      ],
      heterodoxy: 5,
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
        },
        {
          id: 'neighbor_valdris',
          relationshipScore: 30,
          attitudePosture: DiplomaticPosture.Tense,
          activeAgreements: [],
          pendingProposals: [],
          outstandingTensions: [],
          disposition: NeighborDisposition.Cautious,
          militaryStrength: 60,
          religiousProfile: 'reformed',
          culturalIdentity: 'highland',
          espionageCapability: 40,
          lastActionTurn: 0,
          warWeariness: 0,
          isAtWarWithPlayer: false,
          recentActionHistory: [],
        },
      ],
    },

    // --- Espionage ---
    espionage: {
      networkStrength: 25,
      counterIntelligenceLevel: 20,
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
          progressValue: 200,
          currentMilestoneIndex: 1,
          unlockedAdvancements: ['cultural_scholarly_milestone_0'],
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
      militaryRecruitmentStance: MilitaryRecruitmentStance.Minimal,
      rationingLevel: RationingLevel.Normal,
      researchFocus: KnowledgeBranch.CulturalScholarly,
      religiousTolerance: ReligiousTolerance.Enforced,
      festivalInvestmentLevel: FestivalInvestmentLevel.Standard,
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
      treasuryBalance: 500,
      foodReserves: FOOD_STARTING_RESERVES,
      stabilityRating: 55,
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
    scenarioId: FAITHFUL_KINGDOM_SCENARIO_ID,
    environment: createInitialEnvironmentState(),
    causalLedger: createEmptyLedger(),
  };
}
