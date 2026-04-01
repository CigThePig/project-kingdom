import {
  ActionType,
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  KnowledgeBranch,
  MilitaryRecruitmentStance,
  PopulationClass,
  RationingLevel,
  ResourceType,
  Season,
  TaxationLevel,
  TradeOpenness,
} from './types';

// ============================================================
// Block 1 — Action Budget (gameplay-blueprint.md §5.1)
// ============================================================

export const ACTION_BUDGET_BASE = 3;
export const POLICY_CHANGES_PER_TURN = 1;
export const SLOT_COST_FREE = 0;
export const SLOT_COST_STANDARD = 1;
export const SLOT_COST_HIGH_IMPACT = 2;

// Default slot costs per action type.
// CrisisResponse defaults to free; individual event definitions may override to 1.
// PolicyChange uses 0 slots — policy changes have their own limit (POLICY_CHANGES_PER_TURN).
// ResearchDirective is a high-impact "burst" action per §5.10.
export const ACTION_SLOT_COSTS: Record<ActionType, number> = {
  [ActionType.Decree]: SLOT_COST_STANDARD,
  [ActionType.PolicyChange]: SLOT_COST_FREE,
  [ActionType.Construction]: SLOT_COST_STANDARD,
  [ActionType.MilitaryOrder]: SLOT_COST_STANDARD,
  [ActionType.TradeAction]: SLOT_COST_STANDARD,
  [ActionType.DiplomaticAction]: SLOT_COST_STANDARD,
  [ActionType.IntelligenceOp]: SLOT_COST_STANDARD,
  [ActionType.ReligiousEdict]: SLOT_COST_STANDARD,
  [ActionType.ResearchDirective]: SLOT_COST_HIGH_IMPACT,
  [ActionType.CrisisResponse]: SLOT_COST_FREE,
};

// ============================================================
// Block 2 — Satisfaction & Population (§4.4, §10.4)
// ============================================================

// Satisfaction runs 0–100. At or below BREAKING_POINT a class crisis event triggers.
export const SATISFACTION_BREAKING_POINT = 20;
export const SATISFACTION_CRISIS_WARNING = 30; // UI should escalate visual signals before breaking point

// Base sandbox ("The New Crown") starting satisfaction values.
// Moderate-to-good range: stable but with meaningful room to shift in either direction.
export const SATISFACTION_STARTING: Record<PopulationClass, number> = {
  [PopulationClass.Nobility]: 65,
  [PopulationClass.Clergy]: 60,
  [PopulationClass.Merchants]: 60,
  [PopulationClass.Commoners]: 55,
  [PopulationClass.MilitaryCaste]: 65,
};

// Base sandbox starting population counts.
// Commoners are the largest class per §4.4. Nobility is the smallest.
export const POPULATION_STARTING: Record<PopulationClass, number> = {
  [PopulationClass.Nobility]: 500,
  [PopulationClass.Clergy]: 1200,
  [PopulationClass.Merchants]: 2500,
  [PopulationClass.Commoners]: 18000,
  [PopulationClass.MilitaryCaste]: 2000,
};

// ============================================================
// Block 3 — Stability (§4.7, §6.1 Phase 8)
// ============================================================

export const STABILITY_MIN = 0;
export const STABILITY_MAX = 100;
export const STABILITY_STARTING = 55;

// Collapse failure condition: stability at 0 for this many consecutive turns (§10.4).
export const STABILITY_COLLAPSE_THRESHOLD = 0;
export const STABILITY_CONSECUTIVE_TURNS_FOR_COLLAPSE = 2;

// UI warning thresholds for escalating visual signals before failure.
export const STABILITY_CRITICAL_THRESHOLD = 15;
export const STABILITY_LOW_THRESHOLD = 30;

// Decree pace drag: subtracted from stability per action issued above 2 in a single turn.
export const STABILITY_DECREE_PACE_DRAG_PER_EXCESS_ACTION = 3;

// Weighted contributions to the composite stability calculation.
// Class weights sum to 0.84; system weights sum to 0.16; total = 1.0.
// Commoners are the strongest single contributor per §4.4.
// Nobility is second despite being the smallest class — they are "disproportionately influential" per §4.4.
export const STABILITY_CLASS_WEIGHTS: Record<PopulationClass, number> = {
  [PopulationClass.Commoners]: 0.28,
  [PopulationClass.Nobility]: 0.18,
  [PopulationClass.Clergy]: 0.14,
  [PopulationClass.Merchants]: 0.14,
  [PopulationClass.MilitaryCaste]: 0.10,
};

export const STABILITY_FOOD_SECURITY_WEIGHT = 0.08;
export const STABILITY_FAITH_WEIGHT = 0.05;
export const STABILITY_CULTURAL_COHESION_WEIGHT = 0.03;

// ============================================================
// Block 4 — Food (§4.2, §10.4)
// ============================================================

export const FOOD_STARTING_RESERVES = 150;
export const FOOD_FAMINE_THRESHOLD = 0;

// Famine failure condition: reserves at 0 for this many consecutive turns (§10.4).
export const FOOD_CONSECUTIVE_TURNS_FAMINE = 3;

// Seasonal food production multipliers. Winter is 0.5 (not 0) so stored reserves
// remain the intended pressure point rather than a guaranteed zero-production crisis.
export const FOOD_SEASONAL_MODIFIERS: Record<Season, number> = {
  [Season.Spring]: 0.9, // planting — production building
  [Season.Summer]: 1.3, // peak harvest
  [Season.Autumn]: 1.1, // secondary harvest
  [Season.Winter]: 0.5, // minimal production
};

// Which calendar months (1–12) belong to each season.
// Together these cover all 12 months exactly once.
export const SEASON_MONTHS: Record<Season, readonly [number, number, number]> = {
  [Season.Spring]: [3, 4, 5],
  [Season.Summer]: [6, 7, 8],
  [Season.Autumn]: [9, 10, 11],
  [Season.Winter]: [12, 1, 2],
};

// ============================================================
// Block 5 — Treasury (§4.1, §10.4)
// ============================================================

export const TREASURY_STARTING_BALANCE = 500;
export const TREASURY_INSOLVENCY_THRESHOLD = 0;

// Insolvency failure condition: treasury at 0 with negative net flow for this many turns (§10.4).
export const TREASURY_CONSECUTIVE_TURNS_INSOLVENT = 3;

export const TREASURY_LOW_BALANCE_WARNING = 100; // UI warning threshold

// ============================================================
// Block 6 — Resources (§4.5)
// ============================================================

// Base sandbox starting stockpiles. Wood > Stone > Iron mirrors medieval material priorities.
export const RESOURCE_STARTING_STOCKPILES: Record<ResourceType, number> = {
  [ResourceType.Wood]: 80,
  [ResourceType.Iron]: 40,
  [ResourceType.Stone]: 60,
};

// Base sandbox starting per-turn extraction rates (three-region kingdom).
export const RESOURCE_STARTING_EXTRACTION_RATES: Record<ResourceType, number> = {
  [ResourceType.Wood]: 12,
  [ResourceType.Iron]: 6,
  [ResourceType.Stone]: 8,
};

// ============================================================
// Block 7 — Military (§4.6)
// ============================================================

export const MILITARY_READINESS_MIN = 0;
export const MILITARY_READINESS_MAX = 100;
export const MILITARY_READINESS_STARTING = 60;
export const MILITARY_EQUIPMENT_CONDITION_STARTING = 55;
export const MILITARY_MORALE_STARTING = 65;
export const MILITARY_FORCE_SIZE_STARTING = 1200;

// ============================================================
// Block 8 — Faith & Culture (§4.8)
// ============================================================

export const FAITH_LEVEL_MIN = 0;
export const FAITH_LEVEL_MAX = 100;
export const FAITH_LEVEL_STARTING = 55;

export const CULTURAL_COHESION_MIN = 0;
export const CULTURAL_COHESION_MAX = 100;
export const CULTURAL_COHESION_STARTING = 60;

// Heterodoxy at or above this level triggers a schism event check each turn.
export const HETERODOXY_SCHISM_THRESHOLD = 70;

// Capped at 4 because there are exactly 4 order types (ReligiousOrderType enum).
export const MAX_ACTIVE_RELIGIOUS_ORDERS = 4;

// ============================================================
// Block 9 — Espionage (§4.10)
// ============================================================

export const INTELLIGENCE_NETWORK_STARTING = 25;
export const COUNTER_INTELLIGENCE_STARTING = 20;
export const INTELLIGENCE_NETWORK_MIN = 0;
export const INTELLIGENCE_NETWORK_MAX = 100;

// ============================================================
// Block 10 — Knowledge (§4.13)
// ============================================================

// Progress points required to reach each milestone index (0-based).
// Same thresholds apply across all six knowledge branches.
// Milestone content (what each unlocks) lives in the data layer.
export const KNOWLEDGE_MILESTONE_THRESHOLDS: readonly number[] = [50, 120, 220, 350, 520];

// Minimum progress accumulated per turn even with no active research investment.
export const KNOWLEDGE_BASE_PROGRESS_PER_TURN = 2;

// ============================================================
// Block 11 — Storylines (§8.3)
// ============================================================

// Maximum number of storylines that may be active simultaneously.
export const MAX_ACTIVE_STORYLINES = 2;

// Minimum number of turns that must elapse between storyline activations.
export const MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS = 3;

// ============================================================
// Block 12 — Policy Upkeep & Multipliers (§5.3)
// ============================================================

// Taxation level multipliers applied to base taxation income.
export const TAXATION_INCOME_MULTIPLIER: Record<TaxationLevel, number> = {
  [TaxationLevel.Low]: 0.7,
  [TaxationLevel.Moderate]: 1.0,
  [TaxationLevel.High]: 1.4,
  [TaxationLevel.Punitive]: 1.8,
};

// Rationing level multipliers applied to base food consumption.
export const RATIONING_CONSUMPTION_MULTIPLIER: Record<RationingLevel, number> = {
  [RationingLevel.Abundant]: 1.3,
  [RationingLevel.Normal]: 1.0,
  [RationingLevel.Rationed]: 0.75,
  [RationingLevel.Emergency]: 0.5,
};

// Per-turn treasury cost for each intelligence funding level.
export const INTELLIGENCE_FUNDING_COST_PER_TURN: Record<IntelligenceFundingLevel, number> = {
  [IntelligenceFundingLevel.None]: 0,
  [IntelligenceFundingLevel.Minimal]: 15,
  [IntelligenceFundingLevel.Moderate]: 40,
  [IntelligenceFundingLevel.Heavy]: 80,
};

// Per-turn treasury cost for each festival investment level.
export const FESTIVAL_COST_PER_TURN: Record<FestivalInvestmentLevel, number> = {
  [FestivalInvestmentLevel.None]: 0,
  [FestivalInvestmentLevel.Modest]: 30,
  [FestivalInvestmentLevel.Standard]: 60,
  [FestivalInvestmentLevel.Lavish]: 120,
};

// Food consumption burden multipliers per military recruitment stance.
export const RECRUITMENT_FOOD_BURDEN_MULTIPLIER: Record<MilitaryRecruitmentStance, number> = {
  [MilitaryRecruitmentStance.Minimal]: 0.8,
  [MilitaryRecruitmentStance.Voluntary]: 1.0,
  [MilitaryRecruitmentStance.Conscript]: 1.2,
  [MilitaryRecruitmentStance.WarFooting]: 1.5,
};

// Trade income multipliers per trade openness policy.
export const TRADE_INCOME_MULTIPLIER: Record<TradeOpenness, number> = {
  [TradeOpenness.Closed]: 0.3,
  [TradeOpenness.Restricted]: 0.7,
  [TradeOpenness.Open]: 1.0,
  [TradeOpenness.Encouraged]: 1.3,
};

// ============================================================
// Block 13 — Save & Failure Tracking (§13, §10.4)
// ============================================================

export const SAVE_SCHEMA_VERSION = 1;

// LocalStorage key must include the version to avoid loading incompatible saves.
export const SAVE_STORAGE_KEY = 'kingdom-save-v1';

// Consolidated failure consecutive-turn requirements for direct lookup by resolution code.
export const FAILURE_CONSECUTIVE_TURNS = {
  famine: FOOD_CONSECUTIVE_TURNS_FAMINE,
  insolvency: TREASURY_CONSECUTIVE_TURNS_INSOLVENT,
  collapse: STABILITY_CONSECUTIVE_TURNS_FOR_COLLAPSE,
} as const;

// ============================================================
// Block 14 — Knowledge Branch Starting State (§4.13)
// ============================================================

// All branches start at zero progress in the base sandbox.
// Used by scenario initialisation to construct the initial KnowledgeState.
export const KNOWLEDGE_BRANCH_STARTING_PROGRESS: Record<KnowledgeBranch, number> = {
  [KnowledgeBranch.Agricultural]: 0,
  [KnowledgeBranch.Military]: 0,
  [KnowledgeBranch.Civic]: 0,
  [KnowledgeBranch.MaritimeTrade]: 0,
  [KnowledgeBranch.CulturalScholarly]: 0,
  [KnowledgeBranch.NaturalPhilosophy]: 0,
};
