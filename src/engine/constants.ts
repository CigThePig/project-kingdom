import {
  ActionType,
  DiplomaticPosture,
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  IntelligenceOperationType,
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
// Block 11 — Events & Storylines (§7, §8.3)
// ============================================================

// Maximum new events surfaced per turn across all severity tiers.
export const MAX_EVENTS_PER_TURN = 3;

// Per-severity caps within the per-turn budget (§7.3).
export const MAX_CRITICAL_EVENTS_PER_TURN = 1;
export const MAX_SERIOUS_EVENTS_PER_TURN = 1;

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

export const SAVE_SCHEMA_VERSION = 4;

// Overthrow failure condition (§10.4): triggers when nobility intrigue risk is high
// and any class is at or below the breaking point for consecutive turns.
export const OVERTHROW_INTRIGUE_THRESHOLD = 75;
export const OVERTHROW_CONSECUTIVE_TURNS = 3;

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

// ============================================================
// Block 15 — System Calibration Constants (gameplay-blueprint.md §4)
// ============================================================

// --- Treasury ---

// Base taxation income per turn at Moderate level before class cooperation modifiers.
// Moderate × 1.0 multiplier = 80 gold/turn baseline.
export const TAXATION_BASE_INCOME = 80;

// Noble cooperation: range of the multiplier applied to taxation income.
// Noble satisfaction 0 → NOBLE_COOPERATION_MIN; 100 → NOBLE_COOPERATION_MAX.
export const TREASURY_NOBLE_COOPERATION_MIN = 0.6;
export const TREASURY_NOBLE_COOPERATION_MAX = 1.2;

// Merchant prosperity: range of the multiplier applied to taxation income.
// Merchant satisfaction 0 → MERCHANT_PROSPERITY_MIN; 100 → MERCHANT_PROSPERITY_MAX.
export const TREASURY_MERCHANT_PROSPERITY_MIN = 0.7;
export const TREASURY_MERCHANT_PROSPERITY_MAX = 1.3;

// Treasury cost per military unit per turn at Standby posture (before posture multiplier).
export const MILITARY_UPKEEP_COST_PER_SOLDIER = 0.05;

// Posture multiplier applied to both military upkeep cost and readiness/equipment decay.
export const MILITARY_UPKEEP_POSTURE_MULTIPLIER: Record<MilitaryPosture, number> = {
  [MilitaryPosture.Defensive]: 0.8,
  [MilitaryPosture.Standby]: 1.0,
  [MilitaryPosture.Mobilized]: 1.4,
  [MilitaryPosture.Aggressive]: 1.8,
};

// --- Food ---

// Base food consumed per person (all classes combined) per turn before rationing multiplier.
export const FOOD_BASE_CONSUMPTION_RATE_PER_PERSON = 0.003;

// Base food produced per commoner per turn before season and knowledge modifiers.
export const FOOD_COMMONER_LABOR_PRODUCTION_RATE = 0.005;

// Additional food consumed per military unit per turn due to provisioning.
// Applied on top of the standard per-capita rate; further modified by recruitment stance.
export const FOOD_MILITARY_PROVISIONING_RATE = 0.02;

// --- Population ---

// Maximum absolute satisfaction shift per class per turn.
// Enforces the "gradual, not instant" rule from §4.4.
export const SATISFACTION_MAX_DELTA_PER_TURN = 5;

// --- Military ---

// Per-turn readiness decay per posture level when no active training order is in effect.
export const MILITARY_READINESS_DECAY_BY_POSTURE: Record<MilitaryPosture, number> = {
  [MilitaryPosture.Defensive]: 1,
  [MilitaryPosture.Standby]: 2,
  [MilitaryPosture.Mobilized]: 4,
  [MilitaryPosture.Aggressive]: 6,
};

// Per-turn equipment condition decay per posture level.
export const MILITARY_EQUIPMENT_DECAY_BY_POSTURE: Record<MilitaryPosture, number> = {
  [MilitaryPosture.Defensive]: 1,
  [MilitaryPosture.Standby]: 1,
  [MilitaryPosture.Mobilized]: 3,
  [MilitaryPosture.Aggressive]: 5,
};

// --- Regions ---

// Translates developmentLevel (0–100) into a fractional output bonus.
// A level-50 region gets a +0.5 multiplier bonus on top of the base 0.5 floor.
export const REGION_DEVELOPMENT_OUTPUT_SCALAR = 0.01;

// --- Trade ---

// Base trade income per turn before policy, merchant, and diplomatic modifiers.
export const TRADE_BASE_INCOME = 40;

// Flat additive bonus per neighboring kingdom with a relationship score above 70.
export const TRADE_DIPLOMATIC_BONUS_PER_FRIENDLY_NEIGHBOR = 5;

// Range of the merchant commerce multiplier applied to trade income.
// Merchant satisfaction 0 → MIN; 100 → MAX.
export const TRADE_MERCHANT_COMMERCE_MULTIPLIER_MIN = 0.7;
export const TRADE_MERCHANT_COMMERCE_MULTIPLIER_MAX = 1.4;

// --- Knowledge ---

// Research points gained per unit of treasury balance invested per turn.
// Example: balance 500 × 0.02 = 10 bonus points/turn.
export const KNOWLEDGE_TREASURY_INVESTMENT_RATE = 0.02;

// Flat research progress bonus per turn when a Scholarly religious order is active.
export const KNOWLEDGE_SCHOLARLY_CLERGY_ORDER_BONUS = 3;

// Flat research progress bonus per turn when relevant scholarly infrastructure exists.
export const KNOWLEDGE_INFRASTRUCTURE_BONUS = 5;

// --- Faith ---

// Faith level delta per turn from festival investment level.
// None is slightly negative (skipping observances lowers faith per §4.8).
export const FAITH_FESTIVAL_DELTA_BY_LEVEL: Record<FestivalInvestmentLevel, number> = {
  [FestivalInvestmentLevel.None]: -1,
  [FestivalInvestmentLevel.Modest]: 1,
  [FestivalInvestmentLevel.Standard]: 3,
  [FestivalInvestmentLevel.Lavish]: 6,
};

// Per-turn modifier to heterodoxy growth rate based on religious tolerance policy.
// Enforced suppression drives heterodoxy underground (grows faster); tolerance slows it.
export const FAITH_TOLERANCE_HETERODOX_MODIFIER: Record<ReligiousTolerance, number> = {
  [ReligiousTolerance.Enforced]: -3,
  [ReligiousTolerance.Favored]: -1,
  [ReligiousTolerance.Tolerated]: 1,
  [ReligiousTolerance.Suppressed]: 3,
};

// --- Espionage ---

// Base success probability (0–1) per operation type before network strength modifier.
export const ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE: Record<IntelligenceOperationType, number> = {
  [IntelligenceOperationType.Reconnaissance]: 0.7,
  [IntelligenceOperationType.DiplomaticIntelligence]: 0.65,
  [IntelligenceOperationType.EconomicIntelligence]: 0.65,
  [IntelligenceOperationType.Sabotage]: 0.4,
  [IntelligenceOperationType.InternalSurveillance]: 0.75,
  [IntelligenceOperationType.CounterEspionageSweep]: 0.6,
};

// Passive network strength decay per turn when not funded (None level).
export const ESPIONAGE_NETWORK_DECAY_PER_TURN = 2;

// Net network strength change per turn per funding level (after decay is factored in).
// None is negative (net decay); Heavy is a strong positive gain.
export const ESPIONAGE_NETWORK_GROWTH_BY_FUNDING: Record<IntelligenceFundingLevel, number> = {
  [IntelligenceFundingLevel.None]: -2,
  [IntelligenceFundingLevel.Minimal]: 1,
  [IntelligenceFundingLevel.Moderate]: 4,
  [IntelligenceFundingLevel.Heavy]: 8,
};

// --- Diplomacy ---

// Flat relationship score bonus when kingdom and neighbor share the same faith tradition.
export const DIPLOMACY_SHARED_FAITH_BONUS = 10;

// Flat relationship score bonus when kingdom and neighbor share the same cultural identity.
export const DIPLOMACY_SHARED_CULTURE_BONUS = 8;

// Per-turn AI-driven relationship score drift per neighbor disposition.
// Negative values represent passive hostile drift (Aggressive neighbors).
// Positive values represent friendly drift (Mercantile, Cautious neighbors).
export const DIPLOMACY_AI_DELTA_BY_DISPOSITION: Record<NeighborDisposition, number> = {
  [NeighborDisposition.Aggressive]: -2,
  [NeighborDisposition.Opportunistic]: 0,
  [NeighborDisposition.Cautious]: 1,
  [NeighborDisposition.Mercantile]: 2,
  [NeighborDisposition.Isolationist]: 0,
};

// Relationship score thresholds that define each DiplomaticPosture.
// A neighbor's posture is the highest label whose threshold their score exceeds.
export const DIPLOMACY_POSTURE_THRESHOLDS: Record<DiplomaticPosture, number> = {
  [DiplomaticPosture.War]: 10,
  [DiplomaticPosture.Hostile]: 30,
  [DiplomaticPosture.Tense]: 50,
  [DiplomaticPosture.Neutral]: 70,
  [DiplomaticPosture.Friendly]: 100,
};

// ============================================================
// Block 16 — Action Effect Constants (Phase 1)
// gameplay-blueprint.md §5.2–§5.11
// ============================================================

// Per-decree immediate satisfaction/state deltas.
// All satisfaction values are within SATISFACTION_MAX_DELTA_PER_TURN (5).
// Keys match decree IDs with the 'decree_' prefix stripped.
export const DECREE_EFFECTS = {
  market_charter:        { merchantSat: +4, commonerSat: +2 },
  emergency_levy:        { treasuryDelta: +120, merchantSat: -4, commonerSat: -3, nobilitySat: -2 },
  trade_subsidies:       { merchantSat: +5 },
  fortify_borders:       { militaryCasteSat: +3, readinessDelta: +5 },
  arms_commission:       { militaryCasteSat: +4, merchantSat: +2, equipmentDelta: +8 },
  general_mobilization:  { militaryCasteSat: +5, commonerSat: -4, readinessDelta: +10 },
  road_improvement:      { merchantSat: +3, commonerSat: +2 },
  census:                { nobilitySat: -2, commonerSat: +1 },
  administrative_reform: { nobilitySat: -3, clergySat: -2 },
  call_festival:         { clergySat: +4, commonerSat: +4, faithDelta: +5 },
  invest_religious_order:{ clergySat: +4 },
  suppress_heresy:       { clergySat: +2, commonerSat: -2, heterodoxyDelta: -10 },
  diplomatic_envoy:      { nobilitySat: +2, relationshipDelta: +5 },
  trade_agreement:       { merchantSat: +3, nobilitySat: +1, relationshipDelta: +8 },
  royal_marriage:        { nobilitySat: +4, clergySat: +2, relationshipDelta: +20 },
  public_granary:        { commonerSat: +5 },
  labor_rights:          { commonerSat: +5, merchantSat: -3, nobilitySat: -2 },
  land_redistribution:   { commonerSat: +5, nobilitySat: -5, clergySat: -3 },
} as const;

// Research directive burst (§5.10)
export const RESEARCH_DIRECTIVE_TREASURY_COST = 80;
export const RESEARCH_DIRECTIVE_PROGRESS_BURST = 30;

// Diplomatic action relationship deltas by sub-type (§5.7)
export const DIPLOMATIC_ACTION_DELTAS: Record<string, number> = {
  send_envoy:      +8,
  propose_treaty:  +12,
  issue_ultimatum: -15,
  break_agreement: -20,
};

// Religious edict immediate effect magnitudes (§5.9)
export const RELIGIOUS_EDICT_FESTIVAL_FAITH_DELTA = 8;
export const RELIGIOUS_EDICT_FESTIVAL_CLERGY_SAT_DELTA = 4;
export const RELIGIOUS_EDICT_OBSERVANCE_FAITH_DELTA = 5;
export const RELIGIOUS_EDICT_OBSERVANCE_COHESION_DELTA = 3;
export const RELIGIOUS_EDICT_HERESY_DELTA = -15;
export const RELIGIOUS_EDICT_HERESY_CLERGY_SAT_DELTA = 3;
export const RELIGIOUS_ORDER_UPKEEP_PER_TURN = 20;

// Construction project defaults (§5.4)
export const CONSTRUCTION_DEFAULT_TURNS = 4;
export const TRADE_AGREEMENT_TURNS = 12; // 1 in-game year

// ============================================================
// Block 17 — AI Neighbor & Conflict Constants (Phase 3)
// gameplay-blueprint.md §6.2, §9
// ============================================================

// --- AI Behavior Thresholds ---

// Relationship score below which an Aggressive/Opportunistic neighbor may declare war.
export const NEIGHBOR_AI_WAR_DECLARATION_THRESHOLD = 10;

// Relationship score below which a neighbor may issue demands.
export const NEIGHBOR_AI_DEMAND_THRESHOLD = 30;

// Relationship score above which a neighbor may propose a treaty.
export const NEIGHBOR_AI_TREATY_PROPOSAL_THRESHOLD = 65;

// Relationship score above which a neighbor may propose a trade agreement.
export const NEIGHBOR_AI_TRADE_PROPOSAL_THRESHOLD = 55;

// Relationship score below which a neighbor withdraws trade agreements.
export const NEIGHBOR_AI_TRADE_WITHDRAWAL_THRESHOLD = 35;

// War weariness above which a neighbor may offer peace.
export const NEIGHBOR_AI_PEACE_OFFER_WAR_WEARINESS = 60;

// Relationship score below which hostile neighbors increase military strength.
export const NEIGHBOR_AI_MILITARY_BUILDUP_THRESHOLD = 25;

// Minimum turns between autonomous AI actions per neighbor.
export const NEIGHBOR_AI_ACTION_COOLDOWN = 3;

// Per-turn war weariness accumulation for neighbors in active conflict.
export const NEIGHBOR_AI_WAR_WEARINESS_PER_TURN = 8;

// Per-turn neighbor military strength change when building up.
export const NEIGHBOR_AI_MILITARY_BUILDUP_RATE = 3;

// Per-turn neighbor military strength loss during conflict (from casualties).
export const NEIGHBOR_AI_MILITARY_ATTRITION_RATE = 2;

// Religious pressure: heterodoxy delta when a neighbor with different faith pressures.
export const NEIGHBOR_AI_RELIGIOUS_PRESSURE_HETERODOXY_DELTA = 5;

// --- Conflict Resolution Weights (§6.2) ---

// Maximum advantage contribution from force size ratio (larger army advantage).
export const CONFLICT_FORCE_RATIO_MAX_ADVANTAGE = 30;

// Weighted contributions to combat power score (must sum to ~1.0).
export const CONFLICT_READINESS_WEIGHT = 0.20;
export const CONFLICT_EQUIPMENT_WEIGHT = 0.15;
export const CONFLICT_MORALE_WEIGHT = 0.15;
export const CONFLICT_CASTE_QUALITY_WEIGHT = 0.10;
export const CONFLICT_TERRAIN_WEIGHT = 0.10;
export const CONFLICT_INTELLIGENCE_WEIGHT = 0.15;
export const CONFLICT_KNOWLEDGE_WEIGHT = 0.10;

// Random swing range: +/- this value applied to advantage shift each turn.
export const CONFLICT_RANDOMNESS_RANGE = 15;

// --- Conflict Phase Transitions ---

// Turns of skirmish before escalation to campaign.
export const CONFLICT_SKIRMISH_TO_CAMPAIGN_TURNS = 2;

// If player advantage drops below this during campaign, escalates to siege.
export const CONFLICT_CAMPAIGN_TO_SIEGE_ADVANTAGE = -30;

// Maximum turns a campaign can last before forced resolution.
export const CONFLICT_MAX_CAMPAIGN_TURNS = 8;

// --- Conflict Per-Turn Consequences ---

// Casualty rates as fraction of force size per turn, by conflict phase.
export const CONFLICT_CASUALTY_RATE: Record<string, number> = {
  Skirmish: 0.02,
  Campaign: 0.05,
  Siege: 0.08,
};

// Treasury drain per turn during active conflict.
export const CONFLICT_TREASURY_DRAIN_PER_TURN = 50;

// Food drain per turn during active conflict.
export const CONFLICT_FOOD_DRAIN_PER_TURN = 20;

// Stability penalty per active conflict per turn.
export const CONFLICT_STABILITY_PENALTY_PER_CONFLICT = 3;

// Morale shift based on conflict advantage direction.
export const CONFLICT_MORALE_BONUS_WINNING = 3;
export const CONFLICT_MORALE_PENALTY_LOSING = 5;

// --- Conflict Resolution Thresholds ---

// Player advantage at or above this = victory.
export const CONFLICT_VICTORY_ADVANTAGE_THRESHOLD = 60;

// Player advantage at or below this = defeat.
export const CONFLICT_DEFEAT_ADVANTAGE_THRESHOLD = -60;

// --- Conflict Resolution Consequences ---

// Relationship boost with OTHER neighbors after a victory (respect for strength).
export const CONFLICT_VICTORY_RELATIONSHIP_BOOST = 15;

// Treasury plunder gained on victory.
export const CONFLICT_VICTORY_TREASURY_PLUNDER = 100;

// Chance (0-1) of territory loss on defeat.
export const CONFLICT_DEFEAT_TERRITORY_LOSS_CHANCE = 0.6;

// Relationship penalty with defeated neighbor (additive to current score).
export const CONFLICT_DEFEAT_RELATIONSHIP_PENALTY = -10;

// Satisfaction penalties on defeat.
export const CONFLICT_DEFEAT_COMMONER_SAT_PENALTY = -8;
export const CONFLICT_DEFEAT_MILITARY_CASTE_SAT_PENALTY = -10;
export const CONFLICT_DEFEAT_NOBILITY_SAT_PENALTY = -5;

// Satisfaction bonuses on victory.
export const CONFLICT_VICTORY_MILITARY_CASTE_SAT_BONUS = 8;
export const CONFLICT_VICTORY_NOBILITY_SAT_BONUS = 5;
export const CONFLICT_VICTORY_COMMONER_SAT_BONUS = 3;

// --- Trade AI ---

// Duration of AI-proposed trade agreements (in turns).
export const TRADE_AI_PROPOSAL_AGREEMENT_TURNS = 12;

// --- Espionage Exposure ---

// Relationship penalty when espionage is discovered by a neighbor.
export const ESPIONAGE_EXPOSURE_RELATIONSHIP_PENALTY = -12;

// Tension ID added when espionage is discovered.
export const ESPIONAGE_EXPOSURE_TENSION_ID = 'espionage_discovered';
