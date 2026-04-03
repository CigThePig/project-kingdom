import {
  ActionType,
  ConstructionCategory,
  DecreeCategory,
  DiplomaticPosture,
  EventCategory,
  EventSeverity,
  FailureCondition,
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

export const ACTION_BUDGET_LABEL = 'Actions Remaining';
export const TURN_LABEL = 'Current Month';
export const YEAR_LABEL = 'Year of Reign';
export const ADVANCE_TURN_LABEL = 'Advance to Next Month';
export const CONFIRM_LABEL = 'Confirm';
export const CANCEL_LABEL = 'Cancel';
export const SAVE_LABEL = 'Save Kingdom';
export const LOAD_LABEL = 'Load Kingdom';
