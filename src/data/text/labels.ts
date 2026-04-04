import {
  ActionType,
  ConflictPhase,
  ConstructionCategory,
  DecreeCategory,
  DiplomaticPosture,
  EventCategory,
  EventSeverity,
  FailureCondition,
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  IntelligenceOperationType,
  KnowledgeBranch,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  NeighborActionType,
  NeighborDisposition,
  PopulationClass,
  RationingLevel,
  ReligiousOrderType,
  ReligiousTolerance,
  ResourceType,
  Season,
  StorylineCategory,
  TaxationLevel,
  TradeOpenness,
} from '../../engine/types';

// ============================================================
// Navigation & Screen Labels
// ============================================================

export const NAV_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  reports: 'Reports',
  decrees: 'Decrees',
  treasury: 'Treasury',
  military: 'Military',
  diplomacy: 'Diplomacy',
  faith: 'Faith & Culture',
  knowledge: 'Knowledge',
  regions: 'Regions',
  espionage: 'Intelligence',
  events: 'Dispatches',
  archive: 'Archive',
};

export const SCREEN_TITLES: Record<string, string> = {
  dashboard: 'Kingdom Overview',
  reports: 'Reports & Assessments',
  decrees: 'Royal Decrees',
  treasury: 'Treasury & Revenue',
  military: 'Military Affairs',
  diplomacy: 'Diplomatic Relations',
  faith: 'Faith & Cultural Affairs',
  knowledge: 'Knowledge & Advancement',
  regions: 'Regional Administration',
  espionage: 'Intelligence Services',
  events: 'Dispatches & Developments',
  archive: 'Historical Archive',
};

// ============================================================
// Population Class Labels
// ============================================================

export const CLASS_LABELS: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]: 'Nobility',
  [PopulationClass.Clergy]: 'Clergy',
  [PopulationClass.Merchants]: 'Merchant Guild',
  [PopulationClass.Commoners]: 'Commonfolk',
  [PopulationClass.MilitaryCaste]: 'Military Caste',
};

export const CLASS_PLURAL_LABELS: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]: 'Nobles',
  [PopulationClass.Clergy]: 'Clergy Members',
  [PopulationClass.Merchants]: 'Merchants',
  [PopulationClass.Commoners]: 'Commoners',
  [PopulationClass.MilitaryCaste]: 'Soldiers',
};

// ============================================================
// Season Labels
// ============================================================

export const SEASON_LABELS: Record<Season, string> = {
  [Season.Spring]: 'Spring',
  [Season.Summer]: 'Summer',
  [Season.Autumn]: 'Autumn',
  [Season.Winter]: 'Winter',
};

// ============================================================
// Event & Storyline Labels
// ============================================================

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  [EventCategory.Economy]: 'Economic Affairs',
  [EventCategory.Food]: 'Agricultural Affairs',
  [EventCategory.Military]: 'Military Affairs',
  [EventCategory.Diplomacy]: 'Diplomatic Affairs',
  [EventCategory.Environment]: 'Natural Events',
  [EventCategory.PublicOrder]: 'Public Order',
  [EventCategory.Religion]: 'Religious Affairs',
  [EventCategory.Culture]: 'Cultural Affairs',
  [EventCategory.Espionage]: 'Intelligence Matters',
  [EventCategory.Knowledge]: 'Scholarly Affairs',
  [EventCategory.ClassConflict]: 'Social Tensions',
  [EventCategory.Region]: 'Regional Affairs',
  [EventCategory.Kingdom]: 'Affairs of State',
};

export const EVENT_SEVERITY_LABELS: Record<EventSeverity, string> = {
  [EventSeverity.Informational]: 'Routine Dispatch',
  [EventSeverity.Notable]: 'Notable Development',
  [EventSeverity.Serious]: 'Serious Matter',
  [EventSeverity.Critical]: 'Critical Matter',
};

export const STORYLINE_CATEGORY_LABELS: Record<StorylineCategory, string> = {
  [StorylineCategory.Political]: 'Political Crisis',
  [StorylineCategory.Religious]: 'Religious Upheaval',
  [StorylineCategory.Military]: 'Military Campaign',
  [StorylineCategory.TradeEcon]: 'Economic Disruption',
  [StorylineCategory.Discovery]: 'Expedition & Discovery',
  [StorylineCategory.Cultural]: 'Cultural Shift',
};

// ============================================================
// Knowledge Branch Labels
// ============================================================

export const KNOWLEDGE_BRANCH_LABELS: Record<KnowledgeBranch, string> = {
  [KnowledgeBranch.Agricultural]: 'Agricultural Sciences',
  [KnowledgeBranch.Military]: 'Military Doctrine',
  [KnowledgeBranch.Civic]: 'Civic Administration',
  [KnowledgeBranch.MaritimeTrade]: 'Maritime & Trade',
  [KnowledgeBranch.CulturalScholarly]: 'Cultural Scholarship',
  [KnowledgeBranch.NaturalPhilosophy]: 'Natural Philosophy',
};

// ============================================================
// Policy Level Labels
// ============================================================

export const TAXATION_LEVEL_LABELS: Record<TaxationLevel, string> = {
  [TaxationLevel.Low]: 'Low Taxation',
  [TaxationLevel.Moderate]: 'Moderate Taxation',
  [TaxationLevel.High]: 'High Taxation',
  [TaxationLevel.Punitive]: 'Punitive Taxation',
};

export const TRADE_OPENNESS_LABELS: Record<TradeOpenness, string> = {
  [TradeOpenness.Closed]: 'Closed Borders',
  [TradeOpenness.Restricted]: 'Restricted Trade',
  [TradeOpenness.Open]: 'Open Commerce',
  [TradeOpenness.Encouraged]: 'Encouraged Trade',
};

export const RATIONING_LEVEL_LABELS: Record<RationingLevel, string> = {
  [RationingLevel.Abundant]: 'Abundant Provisions',
  [RationingLevel.Normal]: 'Standard Provisions',
  [RationingLevel.Rationed]: 'Rationed Supplies',
  [RationingLevel.Emergency]: 'Emergency Rationing',
};

export const RELIGIOUS_TOLERANCE_LABELS: Record<ReligiousTolerance, string> = {
  [ReligiousTolerance.Enforced]: 'Enforced Orthodoxy',
  [ReligiousTolerance.Favored]: 'Favored Tradition',
  [ReligiousTolerance.Tolerated]: 'Tolerated Pluralism',
  [ReligiousTolerance.Suppressed]: 'Suppressed Dissent',
};

export const FESTIVAL_INVESTMENT_LABELS: Record<FestivalInvestmentLevel, string> = {
  [FestivalInvestmentLevel.None]: 'No Festival Investment',
  [FestivalInvestmentLevel.Modest]: 'Modest Observances',
  [FestivalInvestmentLevel.Standard]: 'Standard Celebrations',
  [FestivalInvestmentLevel.Lavish]: 'Lavish Festivities',
};

export const RECRUITMENT_STANCE_LABELS: Record<MilitaryRecruitmentStance, string> = {
  [MilitaryRecruitmentStance.Minimal]: 'Minimal Enrollment',
  [MilitaryRecruitmentStance.Voluntary]: 'Voluntary Service',
  [MilitaryRecruitmentStance.Conscript]: 'Conscription',
  [MilitaryRecruitmentStance.WarFooting]: 'War Footing',
};

export const INTELLIGENCE_FUNDING_LABELS: Record<IntelligenceFundingLevel, string> = {
  [IntelligenceFundingLevel.None]: 'No Funding',
  [IntelligenceFundingLevel.Minimal]: 'Minimal Funding',
  [IntelligenceFundingLevel.Moderate]: 'Moderate Funding',
  [IntelligenceFundingLevel.Heavy]: 'Heavy Investment',
};

// ============================================================
// Military & Diplomatic Posture Labels
// ============================================================

export const MILITARY_POSTURE_LABELS: Record<MilitaryPosture, string> = {
  [MilitaryPosture.Defensive]: 'Defensive Posture',
  [MilitaryPosture.Standby]: 'Standby Readiness',
  [MilitaryPosture.Mobilized]: 'Mobilized Forces',
  [MilitaryPosture.Aggressive]: 'Aggressive Deployment',
};

export const DIPLOMATIC_POSTURE_LABELS: Record<DiplomaticPosture, string> = {
  [DiplomaticPosture.Friendly]: 'Friendly Relations',
  [DiplomaticPosture.Neutral]: 'Neutral Standing',
  [DiplomaticPosture.Tense]: 'Tense Relations',
  [DiplomaticPosture.Hostile]: 'Hostile Posture',
  [DiplomaticPosture.War]: 'State of War',
};

export const NEIGHBOR_DISPOSITION_LABELS: Record<NeighborDisposition, string> = {
  [NeighborDisposition.Aggressive]: 'Aggressive',
  [NeighborDisposition.Opportunistic]: 'Opportunistic',
  [NeighborDisposition.Cautious]: 'Cautious',
  [NeighborDisposition.Mercantile]: 'Mercantile',
  [NeighborDisposition.Isolationist]: 'Isolationist',
};

// ============================================================
// Failure Condition Labels
// ============================================================

export const FAILURE_CONDITION_LABELS: Record<FailureCondition, string> = {
  [FailureCondition.Famine]: 'Famine',
  [FailureCondition.Insolvency]: 'Insolvency',
  [FailureCondition.Collapse]: 'Civil Collapse',
  [FailureCondition.Conquest]: 'Foreign Conquest',
  [FailureCondition.Overthrow]: 'Overthrow',
};

// ============================================================
// Resource, Action, Decree & Construction Labels
// ============================================================

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  [ResourceType.Wood]: 'Timber',
  [ResourceType.Iron]: 'Iron',
  [ResourceType.Stone]: 'Stone',
};

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  [ActionType.Decree]: 'Royal Decree',
  [ActionType.PolicyChange]: 'Policy Adjustment',
  [ActionType.Construction]: 'Construction Order',
  [ActionType.MilitaryOrder]: 'Military Order',
  [ActionType.TradeAction]: 'Trade Directive',
  [ActionType.DiplomaticAction]: 'Diplomatic Action',
  [ActionType.IntelligenceOp]: 'Intelligence Operation',
  [ActionType.ReligiousEdict]: 'Religious Edict',
  [ActionType.ResearchDirective]: 'Research Directive',
  [ActionType.CrisisResponse]: 'Crisis Response',
};

export const DECREE_CATEGORY_LABELS: Record<DecreeCategory, string> = {
  [DecreeCategory.Economic]: 'Economic Decree',
  [DecreeCategory.Military]: 'Military Decree',
  [DecreeCategory.Civic]: 'Civic Decree',
  [DecreeCategory.Religious]: 'Religious Decree',
  [DecreeCategory.Diplomatic]: 'Diplomatic Decree',
  [DecreeCategory.Social]: 'Social Decree',
};

export const CONSTRUCTION_CATEGORY_LABELS: Record<ConstructionCategory, string> = {
  [ConstructionCategory.Economic]: 'Economic Structure',
  [ConstructionCategory.Military]: 'Military Fortification',
  [ConstructionCategory.Civic]: 'Civic Building',
  [ConstructionCategory.Religious]: 'Religious Monument',
  [ConstructionCategory.Scholarly]: 'Scholarly Institution',
  [ConstructionCategory.Trade]: 'Trade Infrastructure',
};

// ============================================================
// Standalone UI String Constants
// ============================================================

export const KINGDOM_NAME = 'The Kingdom';
export const ACTION_BUDGET_LABEL = 'Actions Remaining';
export const TURN_LABEL = 'Current Month';
export const YEAR_LABEL = 'Year of Reign';
export const ADVANCE_TURN_LABEL = 'Advance to Next Month';
export const CONFIRM_LABEL = 'Confirm';
export const CANCEL_LABEL = 'Cancel';
export const SAVE_LABEL = 'Save Kingdom';
export const LOAD_LABEL = 'Load Kingdom';

// ============================================================
// Decrees Screen Labels
// ============================================================

export const DECREES_TAB_LABEL = 'Decrees';
export const POLICIES_TAB_LABEL = 'Policies';
export const ALL_CATEGORIES_LABEL = 'All';
export const QUEUED_ACTIONS_LABEL = 'Queued Actions';
export const NO_DECREES_AVAILABLE = 'No decrees match the selected category.';
export const SLOT_COUNTER_LABEL = 'Action Slots';
export const POLICY_CHANGE_LIMIT_LABEL = 'Policy Change';
export const CONFIRM_HIGH_IMPACT_TITLE = 'Confirm High-Impact Decree';
export const CONFIRM_HIGH_IMPACT_BODY = 'This decree carries significant consequences and cannot be reversed once the turn advances.';

export const BUDGET_ERROR_LABELS: Record<string, string> = {
  BUDGET_EXHAUSTED: 'All action slots have been used this turn.',
  INSUFFICIENT_SLOTS: 'Not enough action slots remaining for this decree.',
  POLICY_LIMIT_REACHED: 'Only one policy change is permitted per turn.',
};

// ============================================================
// Policy Domain Labels
// ============================================================

export const POLICY_DOMAIN_LABELS: Record<string, string> = {
  taxationLevel: 'Taxation',
  tradeOpenness: 'Trade',
  militaryRecruitmentStance: 'Military Recruitment',
  rationingLevel: 'Food Rationing',
  researchFocus: 'Research Focus',
  religiousTolerance: 'Religious Tolerance',
  festivalInvestmentLevel: 'Festival Investment',
  intelligenceFundingLevel: 'Intelligence Funding',
  laborAllocationPriority: 'Labor Allocation',
};

// ============================================================
// Society Screen Labels
// ============================================================

export const SOCIETY_TAB_POPULATION = 'Population Classes';
export const SOCIETY_TAB_FAITH = 'Faith & Culture';

export const SATISFACTION_STATUS_LABELS: Record<string, string> = {
  content: 'Content',
  uneasy: 'Uneasy',
  restless: 'Restless',
  critical: 'Critical',
};

export const RELIGIOUS_ORDER_TYPE_LABELS: Record<ReligiousOrderType, string> = {
  [ReligiousOrderType.Healing]: 'Order of Healing',
  [ReligiousOrderType.Scholarly]: 'Scholarly Order',
  [ReligiousOrderType.Martial]: 'Martial Order',
  [ReligiousOrderType.Charitable]: 'Charitable Order',
};

// ============================================================
// Region Labels
// ============================================================

export const REGION_LABELS: Record<string, string> = {
  region_heartlands: 'The Heartlands',
  region_ironvale: 'Ironvale',
  region_timbermark: 'Timbermark',
};

export const ECONOMIC_OUTPUT_LABELS: Record<string, string> = {
  Food: 'Food Production',
  Trade: 'Trade Hub',
  [ResourceType.Wood]: 'Timber',
  [ResourceType.Iron]: 'Iron',
  [ResourceType.Stone]: 'Stone',
};

// ============================================================
// Neighbor Labels
// ============================================================

export const NEIGHBOR_LABELS: Record<string, string> = {
  neighbor_arenthal: 'Kingdom of Arenthal',
  neighbor_valdris: 'Valdris Confederation',
};

// ============================================================
// Intelligence Operation Labels
// ============================================================

export const INTELLIGENCE_OP_LABELS: Record<IntelligenceOperationType, string> = {
  [IntelligenceOperationType.Reconnaissance]: 'Reconnaissance',
  [IntelligenceOperationType.DiplomaticIntelligence]: 'Diplomatic Intelligence',
  [IntelligenceOperationType.EconomicIntelligence]: 'Economic Intelligence',
  [IntelligenceOperationType.Sabotage]: 'Sabotage',
  [IntelligenceOperationType.InternalSurveillance]: 'Internal Surveillance',
  [IntelligenceOperationType.CounterEspionageSweep]: 'Counter-Espionage Sweep',
};

export const INTELLIGENCE_OP_DESCRIPTIONS: Record<IntelligenceOperationType, string> = {
  [IntelligenceOperationType.Reconnaissance]: 'Gather general intelligence on a neighboring kingdom\'s military posture and capabilities.',
  [IntelligenceOperationType.DiplomaticIntelligence]: 'Uncover a neighbor\'s diplomatic intentions, secret agreements, and alliance movements.',
  [IntelligenceOperationType.EconomicIntelligence]: 'Assess a neighbor\'s treasury strength, trade dependencies, and economic vulnerabilities.',
  [IntelligenceOperationType.Sabotage]: 'Conduct covert operations to disrupt a neighbor\'s infrastructure or military readiness.',
  [IntelligenceOperationType.InternalSurveillance]: 'Monitor domestic factions for signs of conspiracy, sedition, or noble intrigue.',
  [IntelligenceOperationType.CounterEspionageSweep]: 'Identify and neutralize foreign intelligence operatives within the kingdom.',
};

export const INTELLIGENCE_OP_RISK_LABELS: Record<IntelligenceOperationType, string> = {
  [IntelligenceOperationType.Reconnaissance]: 'Agent exposure and network degradation.',
  [IntelligenceOperationType.DiplomaticIntelligence]: 'Agent exposure and diplomatic incident if discovered.',
  [IntelligenceOperationType.EconomicIntelligence]: 'Agent exposure and diplomatic incident if discovered.',
  [IntelligenceOperationType.Sabotage]: 'Agent exposure, severe diplomatic incident, and potential retaliation.',
  [IntelligenceOperationType.InternalSurveillance]: 'Agent exposure and reduced network strength.',
  [IntelligenceOperationType.CounterEspionageSweep]: 'Agent exposure and reduced network strength.',
};

export const INTELLIGENCE_SUCCESS_TIERS: Record<string, string> = {
  favorable: 'Favorable Odds',
  moderate: 'Moderate Risk',
  difficult: 'Difficult Undertaking',
  perilous: 'Perilous Mission',
};

// ============================================================
// Conflict & AI Neighbor Labels (Phase 3)
// ============================================================

export const CONFLICT_PHASE_LABELS: Record<ConflictPhase, string> = {
  [ConflictPhase.Skirmish]: 'Border Skirmish',
  [ConflictPhase.Campaign]: 'Military Campaign',
  [ConflictPhase.Siege]: 'Siege',
};

export const CONFLICT_PHASE_DESCRIPTIONS: Record<ConflictPhase, string> = {
  [ConflictPhase.Skirmish]: 'Initial border clashes and probing attacks between forces.',
  [ConflictPhase.Campaign]: 'A sustained military engagement across multiple fronts.',
  [ConflictPhase.Siege]: 'Enemy forces lay siege to a strategic region.',
};

export const NEIGHBOR_ACTION_LABELS: Record<NeighborActionType, string> = {
  [NeighborActionType.TradeProposal]: 'Trade Proposal',
  [NeighborActionType.TradeWithdrawal]: 'Trade Withdrawal',
  [NeighborActionType.TreatyProposal]: 'Treaty Proposal',
  [NeighborActionType.Demand]: 'Diplomatic Demand',
  [NeighborActionType.WarDeclaration]: 'Declaration of War',
  [NeighborActionType.PeaceOffer]: 'Peace Offer',
  [NeighborActionType.BorderTension]: 'Border Tension',
  [NeighborActionType.MilitaryBuildup]: 'Military Buildup',
  [NeighborActionType.EspionageRetaliation]: 'Espionage Retaliation',
  [NeighborActionType.ReligiousPressure]: 'Religious Pressure',
};

export const NEIGHBOR_ACTION_DESCRIPTIONS: Record<NeighborActionType, string> = {
  [NeighborActionType.TradeProposal]: 'A neighboring kingdom proposes a trade agreement to establish regular commerce.',
  [NeighborActionType.TradeWithdrawal]: 'A neighboring kingdom withdraws from existing trade arrangements, citing deteriorating relations.',
  [NeighborActionType.TreatyProposal]: 'A neighboring kingdom proposes a formal treaty of cooperation and mutual respect.',
  [NeighborActionType.Demand]: 'A neighboring kingdom issues a demand backed by the implicit threat of force.',
  [NeighborActionType.WarDeclaration]: 'A neighboring kingdom has formally declared war. Military conflict is now imminent.',
  [NeighborActionType.PeaceOffer]: 'A war-weary neighbor extends an offer of peace and ceasefire.',
  [NeighborActionType.BorderTension]: 'Increased military activity and border patrols signal growing hostility from a neighbor.',
  [NeighborActionType.MilitaryBuildup]: 'Intelligence reports indicate a neighboring kingdom is expanding its military forces.',
  [NeighborActionType.EspionageRetaliation]: 'A neighbor has discovered our intelligence operations and responds with hostile countermeasures.',
  [NeighborActionType.ReligiousPressure]: 'A neighboring kingdom exerts religious influence, spreading dissenting theological interpretations.',
};

export const CONFLICT_OUTCOME_LABELS: Record<string, string> = {
  initiated: 'Conflict Initiated',
  ongoing: 'Hostilities Continue',
  decisive_victory: 'Decisive Victory',
  decisive_defeat: 'Decisive Defeat',
  attritional_victory: 'Hard-Won Victory',
  attritional_defeat: 'Grinding Defeat',
  stalemate: 'Stalemate',
};

// ============================================================
// Game Over Screen Labels
// ============================================================

export const GAME_OVER_TITLE = 'The Reign Has Ended';
export const GAME_OVER_ASSESSMENT_TITLE = 'Kingdom Assessment';
export const GAME_OVER_NEW_GAME_LABEL = 'Begin New Reign';
export const GAME_OVER_LOAD_SAVE_LABEL = 'Load Saved Kingdom';
export const GAME_OVER_TURNS_LABEL = 'Months Ruled';
export const GAME_OVER_TREASURY_LABEL = 'Treasury';
export const GAME_OVER_FOOD_LABEL = 'Food Reserves';
export const GAME_OVER_STABILITY_LABEL = 'Stability';
export const GAME_OVER_POPULATION_LABEL = 'Total Population';

// ============================================================
// Failure Warning Messages (Forecasting)
// ============================================================

export const FAILURE_WARNING_MESSAGES: Record<
  FailureCondition,
  { caution: string; critical: string }
> = {
  [FailureCondition.Famine]: {
    caution:
      'Food reserves have been depleted. If production does not recover within two turns, widespread famine will consume the realm.',
    critical:
      'Starvation spreads unchecked. Without immediate intervention, famine will end this reign next turn.',
  },
  [FailureCondition.Insolvency]: {
    caution:
      'The treasury is empty and debts mount. If the crown cannot restore positive revenue within two turns, insolvency is inevitable.',
    critical:
      'Creditors refuse extension. Without immediate funds, the apparatus of governance will collapse next turn.',
  },
  [FailureCondition.Collapse]: {
    caution:
      'Civil order has deteriorated to nothing. If stability is not restored immediately, the kingdom will fracture next turn.',
    critical:
      'Civil order has deteriorated to nothing. If stability is not restored immediately, the kingdom will fracture next turn.',
  },
  [FailureCondition.Conquest]: {
    caution:
      'More than half of the kingdom\'s regions are under foreign occupation. Continued losses will mean total conquest.',
    critical:
      'Nearly all regions have fallen. Without a decisive military reversal, foreign conquest will be complete.',
  },
  [FailureCondition.Overthrow]: {
    caution:
      'Noble intrigue festers alongside deep popular unrest. If the crown does not address these grievances, overthrow becomes likely.',
    critical:
      'Conspiracy reaches a critical mass. Without immediate reconciliation, a coup or revolution will topple the throne next turn.',
  },
};
