import {
  ActionType,
  DiplomaticPosture,
  EconomicPhase,
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
  StyleAxis,
  TaxationLevel,
  TerrainType,
  TradeOpenness,
} from './types';

// ============================================================
// Block 1 — Action Budget (gameplay-blueprint.md §5.1)
// ============================================================

export const ACTION_BUDGET_BASE = 5;
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

// Narrative phase turn boundaries for event gating.
// Events tagged with a phase will only surface during the corresponding turn range.
export const PHASE_TURN_RANGES = {
  opening: { min: 1, max: 3 },
  developing: { min: 4, max: 8 },
  established: { min: 9, max: Infinity },
  any: { min: 1, max: Infinity },
} as const;

// Maximum number of storylines that may be active simultaneously.
export const MAX_ACTIVE_STORYLINES = 1;

// Minimum number of turns that must elapse between storyline activations.
export const MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS = 3;

// Cooldown turns after a storyline resolves before the next can activate.
export const STORYLINE_POST_RESOLUTION_COOLDOWN = 4;

// Minimum turn before any storyline can activate via narrative pressure.
export const NARRATIVE_PRESSURE_MIN_TURN = 8;

// Default retry limit for state-gated follow-ups.
// A due follow-up whose stateConditions fail will retry once per turn,
// up to this limit, before being discarded. Authored events may override.
export const DEFAULT_MAX_STATE_RETRIES = 3;

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

// Schema version for SaveFile. Bump when adding non-optional migration steps.
// v1: original. v2: Phase 2.5 geography graph + procedural region/settlement names.
// v3: Phase 3 rival agendas + memory.
// v4: Phase 5 court hand.
// v5: Phase 6 discoveredCombos.
// v6: Phase 1 runSeed / Phase 2.5 geography carry-through in turn resolution.
// v7: Phase 13 diplomacy bonds (DiplomacyState.bonds).
export const SAVE_SCHEMA_VERSION = 7;

// Overthrow failure condition (§10.4): triggers when nobility intrigue risk is high
// and any class is at or below the breaking point for consecutive turns.
export const OVERTHROW_INTRIGUE_THRESHOLD = 75;
export const OVERTHROW_CONSECUTIVE_TURNS = 3;

// Stable localStorage bucket for the save file. Compatibility is enforced by
// the `version` field inside the save (see SAVE_SCHEMA_VERSION + loadFromStorage),
// not by the key name, so this does not change when the schema version bumps.
export const SAVE_STORAGE_KEY = 'kingdom-save-v1';

// Consolidated failure consecutive-turn requirements for direct lookup by resolution code.
export const FAILURE_CONSECUTIVE_TURNS = {
  famine: FOOD_CONSECUTIVE_TURNS_FAMINE,
  insolvency: TREASURY_CONSECUTIVE_TURNS_INSOLVENT,
  collapse: STABILITY_CONSECUTIVE_TURNS_FOR_COLLAPSE,
} as const;

// ============================================================
// Block 13b — Ruling Style (Phase 5)
// ============================================================

export const RULING_STYLE_AXIS_MIN = -50;
export const RULING_STYLE_AXIS_MAX = 50;
export const RULING_STYLE_WINDOW_SIZE = 20;
export const RULING_STYLE_LEGACY_THRESHOLDS = [30, 45] as const;
export const RULING_STYLE_DOMINANT_AXIS_THRESHOLD = 20;

/** Mapping from each style axis to the population classes it favors (positive) and disfavors (negative). */
export const RULING_STYLE_CLASS_AFFINITY: Record<StyleAxis, { favors: PopulationClass; disfavors: PopulationClass }> = {
  [StyleAxis.Authority]: { favors: PopulationClass.Nobility, disfavors: PopulationClass.Commoners },
  [StyleAxis.Economy]:   { favors: PopulationClass.Merchants, disfavors: PopulationClass.Commoners },
  [StyleAxis.Military]:  { favors: PopulationClass.MilitaryCaste, disfavors: PopulationClass.Commoners },
  [StyleAxis.Faith]:     { favors: PopulationClass.Clergy, disfavors: PopulationClass.Merchants },
};

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
  // --- Market Chain ---
  market_charter:              { merchantSat: +4, commonerSat: +2 },
  trade_guild_expansion:       { merchantSat: +6, commonerSat: +3, treasuryDelta: +30 },
  merchant_republic_charter:   { merchantSat: +8, commonerSat: +4, treasuryDelta: +60, nobilitySat: -4 },
  // --- Trade Chain ---
  trade_subsidies:             { merchantSat: +5 },
  trade_monopoly:              { merchantSat: +6, treasuryDelta: +50, nobilitySat: -3 },
  international_trade_empire:  { merchantSat: +8, commonerSat: +3, treasuryDelta: +80, nobilitySat: -4 },
  // --- Emergency Levy (repeatable) ---
  emergency_levy:              { treasuryDelta: +120, merchantSat: -4, commonerSat: -3, nobilitySat: -2 },
  // --- Fortification Chain ---
  fortify_borders:             { militaryCasteSat: +3, readinessDelta: +5 },
  integrated_defense_network:  { militaryCasteSat: +4, readinessDelta: +10, moraleDelta: +4, commonerSat: -2 },
  fortress_kingdom:            { militaryCasteSat: +5, readinessDelta: +15, moraleDelta: +6, commonerSat: -4, nobilitySat: -2 },
  // --- Arms Chain ---
  arms_commission:             { militaryCasteSat: +4, merchantSat: +2, equipmentDelta: +8 },
  royal_arsenal:               { militaryCasteSat: +5, merchantSat: +3, equipmentDelta: +15, treasuryDelta: -20 },
  war_machine_industry:        { militaryCasteSat: +5, merchantSat: +4, equipmentDelta: +20, commonerSat: -3, treasuryDelta: -40 },
  // --- General Mobilization (repeatable) ---
  general_mobilization:        { militaryCasteSat: +5, commonerSat: -4, readinessDelta: +10 },
  // --- Roads Chain ---
  road_improvement:            { merchantSat: +3, commonerSat: +2 },
  provincial_highway_system:   { merchantSat: +4, commonerSat: +3, treasuryDelta: -20 },
  kingdom_transit_network:     { merchantSat: +6, commonerSat: +4, militaryCasteSat: +2, treasuryDelta: -40 },
  // --- Census (repeatable) ---
  census:                      { nobilitySat: -2, commonerSat: +1 },
  // --- Admin Chain ---
  administrative_reform:       { nobilitySat: -3, clergySat: -2 },
  royal_bureaucracy:           { nobilitySat: -4, clergySat: -3, commonerSat: +2 },
  centralized_governance:      { nobilitySat: -6, clergySat: -4, commonerSat: +4 },
  // --- Call Festival (repeatable) ---
  call_festival:               { clergySat: +4, commonerSat: +4, faithDelta: +5 },
  // --- Faith Chain ---
  invest_religious_order:      { clergySat: +4 },
  expand_religious_authority:  { clergySat: +5, faithDelta: +5, nobilitySat: -3 },
  theocratic_council:          { clergySat: +6, faithDelta: +8, nobilitySat: -5, commonerSat: -2 },
  // --- Heresy Chain ---
  suppress_heresy:             { clergySat: +2, commonerSat: -2, heterodoxyDelta: -10 },
  inquisitorial_authority:     { clergySat: +3, commonerSat: -5, nobilitySat: -2, heterodoxyDelta: -15 },
  religious_unification:       { clergySat: +5, commonerSat: -8, nobilitySat: -4, heterodoxyDelta: -25 },
  // --- Envoy Chain ---
  diplomatic_envoy:            { nobilitySat: +2, relationshipDelta: +5 },
  permanent_embassy:           { nobilitySat: +3, merchantSat: +2, relationshipDelta: +10 },
  diplomatic_supremacy:        { nobilitySat: +4, merchantSat: +3, clergySat: +1, relationshipDelta: +15 },
  // --- Trade Agreement (standalone) ---
  trade_agreement:             { merchantSat: +3, nobilitySat: +1, relationshipDelta: +8 },
  // --- Marriage Chain ---
  royal_marriage:              { nobilitySat: +4, clergySat: +2, relationshipDelta: +20 },
  dynasty_alliance:            { nobilitySat: +5, clergySat: +3, relationshipDelta: +25 },
  imperial_confederation:      { nobilitySat: +6, clergySat: +3, merchantSat: +4, relationshipDelta: +30, treasuryDelta: -50 },
  // --- Granary Chain ---
  public_granary:              { commonerSat: +5 },
  regional_food_distribution:  { commonerSat: +6, merchantSat: +2 },
  kingdom_breadbasket:         { commonerSat: +8, merchantSat: +3, clergySat: +1 },
  // --- Labor Chain ---
  labor_rights:                { commonerSat: +5, merchantSat: -3, nobilitySat: -2 },
  workers_guild_charter:       { commonerSat: +7, merchantSat: -3, nobilitySat: -3 },
  social_contract:             { commonerSat: +10, merchantSat: -4, nobilitySat: -5, clergySat: -3 },
  // --- Land Redistribution (standalone) ---
  land_redistribution:         { commonerSat: +5, nobilitySat: -5, clergySat: -3 },
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

// ============================================================
// Block 18 — Environment & Health System (Expansion 3)
// ============================================================

// --- Weather ---

export const WEATHER_SEVERITY_MIN = -50;
export const WEATHER_SEVERITY_MAX = 50;
export const WEATHER_STARTING_SEVERITY = 0;

// Seasonal bias: how weather drifts each season.
export const WEATHER_SEASONAL_BIAS: Record<Season, number> = {
  [Season.Spring]: 5,       // Mild, wet — flood risk
  [Season.Summer]: -5,      // Hot, dry — drought risk
  [Season.Autumn]: 0,       // Variable
  [Season.Winter]: -15,     // Harsh — severe winter risk
};

// Random swing applied each turn (+/- this value).
export const WEATHER_RANDOM_SWING = 15;

// Maximum weather trend carry-forward from previous turn.
export const WEATHER_TREND_CLAMP = 5;

// Mean-reversion: multiplied by current severity to pull toward 0.
export const WEATHER_MEAN_REVERSION = 0.1;

// --- Drought ---

// Per-turn accumulation when weatherSeverity < -10 in Summer/Autumn.
export const DROUGHT_ACCUMULATION_RATE = 10;

// Per-turn decay when not accumulating.
export const DROUGHT_DECAY_RATE = 5;

// Threshold for each drought severity.
export const DROUGHT_MILD_THRESHOLD = 30;
export const DROUGHT_MODERATE_THRESHOLD = 60;
export const DROUGHT_SEVERE_THRESHOLD = 85;

// Food production multiplier deltas per drought severity (applied as multiplier).
export const DROUGHT_FOOD_MODIFIER_MILD = 0.80;        // -20%
export const DROUGHT_FOOD_MODIFIER_MODERATE = 0.65;     // -35%
export const DROUGHT_FOOD_MODIFIER_SEVERE = 0.50;       // -50%

// Commoner satisfaction penalty per drought severity.
export const DROUGHT_COMMONER_SAT_MILD = 0;
export const DROUGHT_COMMONER_SAT_MODERATE = -2;
export const DROUGHT_COMMONER_SAT_SEVERE = -4;

// --- Flood ---

// Per-turn accumulation when weatherSeverity > +15 in Spring.
export const FLOOD_RISK_ACCUMULATION_RATE = 8;

// Per-turn decay when not accumulating.
export const FLOOD_RISK_DECAY_RATE = 4;

// Threshold at which flood triggers.
export const FLOOD_TRIGGER_THRESHOLD = 70;

// Fraction of food reserves destroyed by flood.
export const FLOOD_FOOD_RESERVE_DAMAGE = 0.15;

// Region localConditionModifier penalty from flood damage.
export const FLOOD_REGION_CONDITION_PENALTY = -0.15;

// Next-season food production bonus (replenished farmland).
export const FLOOD_NEXT_SEASON_FOOD_BONUS = 0.05;

// --- Harsh Winter ---

// Weather severity below which triggers harsh winter condition.
export const HARSH_WINTER_WEATHER_THRESHOLD = -35;

// Food consumption increase multiplier during harsh winter.
export const HARSH_WINTER_FOOD_CONSUMPTION_MULTIPLIER = 1.20;

// Military readiness decay multiplier during harsh winter.
export const HARSH_WINTER_READINESS_DECAY_MULTIPLIER = 1.5;

// --- Bountiful Harvest ---

// Weather severity above which triggers bountiful harvest (Summer/Autumn, no drought).
export const BOUNTIFUL_HARVEST_WEATHER_THRESHOLD = 20;

// Food production multiplier during bountiful harvest.
export const BOUNTIFUL_HARVEST_FOOD_MODIFIER = 1.30;    // +30%

// Commoner satisfaction bonus during bountiful harvest.
export const BOUNTIFUL_HARVEST_COMMONER_SAT_BONUS = 3;

// Merchant confidence bonus during bountiful harvest.
export const BOUNTIFUL_HARVEST_MERCHANT_SAT_BONUS = 2;

// --- Disease & Plague ---

// Starting disease vulnerability.
export const DISEASE_VULNERABILITY_STARTING = 10;
export const DISEASE_VULNERABILITY_MAX = 100;

// Per-turn disease vulnerability changes from various sources.
export const DISEASE_FAMINE_ACCUMULATION = 8;
export const DISEASE_WAR_ACCUMULATION = 3;
export const DISEASE_LOW_SANITATION_ACCUMULATION = 2;
export const DISEASE_TRADE_OPENNESS_ACCUMULATION = 1;

// Per-turn disease vulnerability reduction from protective factors.
export const DISEASE_HEALING_ORDER_REDUCTION = 3;
export const DISEASE_CIVIC_MILESTONE_REDUCTION = 2;
export const DISEASE_NATURAL_DECAY = 1;

// Plague emerges when diseaseVulnerability > this threshold.
export const PLAGUE_TRIGGER_VULNERABILITY_THRESHOLD = 60;

// Per-turn probability factor: (vulnerability - 40) * this = chance.
export const PLAGUE_BASE_PROBABILITY_FACTOR = 0.01;

// Turns of plague memory (reduced risk after a plague resolves).
export const PLAGUE_MEMORY_IMMUNITY_TURNS = 8;

// Death rate modifier per plague severity (future Expansion 1; also affects satisfaction now).
export const PLAGUE_DEATH_RATE_MILD = 0.15;
export const PLAGUE_DEATH_RATE_MODERATE = 0.30;
export const PLAGUE_DEATH_RATE_SEVERE = 0.50;

// Duration range [min, max] turns per plague severity.
export const PLAGUE_DURATION_MILD: readonly [number, number] = [3, 5];
export const PLAGUE_DURATION_MODERATE: readonly [number, number] = [4, 8];
export const PLAGUE_DURATION_SEVERE: readonly [number, number] = [6, 12];

// Satisfaction penalty per plague severity (across all classes).
export const PLAGUE_STABILITY_PENALTY_MILD = -3;
export const PLAGUE_STABILITY_PENALTY_MODERATE = -6;
export const PLAGUE_STABILITY_PENALTY_SEVERE = -10;

// --- Sanitation ---

export const SANITATION_STARTING = 30;
export const SANITATION_MIN = 0;
export const SANITATION_MAX = 100;
export const SANITATION_NATURAL_DECAY = 1;

// --- Condition Escalation ---

// Turns before unaddressed conditions are checked for escalation.
export const CONDITION_ESCALATION_CHECK_TURNS = 4;

// Probability of escalation per eligible check.
export const CONDITION_ESCALATION_PROBABILITY = 0.4;

// ============================================================
// Block 19 — Causal Legibility System (Expansion 6)
// ============================================================

// Minimum absolute delta value to record a causal entry.
export const CAUSAL_SIGNIFICANCE_THRESHOLD = 5;

// How many turns of causal chain history to keep.
export const CAUSAL_RECENT_TURNS_KEPT = 4;

// Minimum total magnitude for a chain to be included in the ledger.
export const CAUSAL_CHAIN_MIN_MAGNITUDE = 10;

// ============================================================
// Block 20 — Population Dynamics (Expansion 1)
// ============================================================

// Base demographic rates per turn (1 turn = 1 season ≈ 3 months).
export const POP_BASE_BIRTH_RATE = 0.008;   // ~3.2% annual under stable conditions
export const POP_BASE_DEATH_RATE = 0.005;   // ~2.0% annual under stable conditions

// --- Birth Rate Modifier Inputs ---

// Food reserves above this threshold grant a birth rate bonus.
export const POP_BIRTH_FOOD_SURPLUS_THRESHOLD = 200;
export const POP_BIRTH_FOOD_SURPLUS_BONUS = 0.1;

// Food reserves below this threshold impose a birth rate penalty.
export const POP_BIRTH_FOOD_LOW_THRESHOLD = 50;
export const POP_BIRTH_FOOD_LOW_PENALTY = -0.2;

// High faith encourages families.
export const POP_BIRTH_FAITH_HIGH_THRESHOLD = 70;
export const POP_BIRTH_FAITH_HIGH_BONUS = 0.05;

// Low stability suppresses births.
export const POP_BIRTH_STABILITY_LOW_THRESHOLD = 30;
export const POP_BIRTH_STABILITY_LOW_PENALTY = -0.15;

// Emergency rationing suppresses births.
export const POP_BIRTH_RATIONING_EMERGENCY_PENALTY = -0.2;

// --- Death Rate Modifier Inputs ---

// Famine (food reserves = 0) increases death rate.
export const POP_DEATH_FAMINE_BONUS = 0.3;

// Active disease conditions increase death rate by severity.
export const POP_DEATH_DISEASE_BONUS_MILD = 0.2;
export const POP_DEATH_DISEASE_BONUS_MODERATE = 0.35;
export const POP_DEATH_DISEASE_BONUS_SEVERE = 0.5;

// Active war increases death rate for commoners and military.
export const POP_DEATH_WAR_COMMONER_BONUS = 0.1;
export const POP_DEATH_WAR_MILITARY_BONUS = 0.3;

// Civil violence from very low stability.
export const POP_DEATH_LOW_STABILITY_THRESHOLD = 15;
export const POP_DEATH_LOW_STABILITY_BONUS = 0.1;

// --- Class-Specific Birth Rate Multipliers ---
// Commoners grow fastest; nobility grows slowest.
export const POP_CLASS_BIRTH_MULTIPLIER: Record<PopulationClass, number> = {
  [PopulationClass.Commoners]: 1.2,
  [PopulationClass.Merchants]: 1.0,
  [PopulationClass.Clergy]: 0.7,
  [PopulationClass.Nobility]: 0.5,
  [PopulationClass.MilitaryCaste]: 0.8,
};

// --- Military Death Rate Posture Multipliers ---
export const POP_MILITARY_DEATH_POSTURE_MULTIPLIER: Record<MilitaryPosture, number> = {
  [MilitaryPosture.Defensive]: 1.0,
  [MilitaryPosture.Standby]: 1.0,
  [MilitaryPosture.Mobilized]: 1.2,
  [MilitaryPosture.Aggressive]: 1.5,
};

// --- Migration Pressure Inputs ---
// Migration pressure is a composite score (-100 to +100).
export const POP_MIGRATION_FOOD_SECURITY_WEIGHT = 20;
export const POP_MIGRATION_TAX_BURDEN_WEIGHT = 15;
export const POP_MIGRATION_STABILITY_WEIGHT = 20;
export const POP_MIGRATION_WAR_PENALTY = -25;
export const POP_MIGRATION_TRADE_ENCOURAGED_BONUS = 15;
export const POP_MIGRATION_TRADE_OPEN_BONUS = 10;
export const POP_MIGRATION_TOLERANCE_SUPPRESSED_PENALTY = -10;

// Per-point migration flow rates (fraction of commoner/merchant population).
export const POP_MIGRATION_INFLOW_RATE = 0.003;
export const POP_MIGRATION_OUTFLOW_RATE = 0.002;

// Card surfacing thresholds for migration events.
export const POP_MIGRATION_ADVISOR_THRESHOLD = 50;
export const POP_MIGRATION_PETITION_THRESHOLD = -30;
export const POP_MIGRATION_CRISIS_THRESHOLD = -60;

// --- Class Mobility Rates ---
// Fraction of source class population per season at peak conditions.
export const POP_MOBILITY_COMMONER_TO_MERCHANT_RATE = 0.005;
export const POP_MOBILITY_MERCHANT_TO_NOBILITY_RATE = 0.001;
export const POP_MOBILITY_COMMONER_TO_MILITARY_CONSCRIPT_RATE = 0.01;
export const POP_MOBILITY_COMMONER_TO_MILITARY_WARFOOTING_RATE = 0.02;
export const POP_MOBILITY_CLERGY_TO_COMMONER_RATE = 0.003;

// Satisfaction thresholds for mobility triggers.
export const POP_MOBILITY_MERCHANT_SAT_THRESHOLD = 60;
export const POP_MOBILITY_COMMONER_SAT_THRESHOLD = 40;
export const POP_MOBILITY_MERCHANT_TO_NOBLE_SAT = 80;
export const POP_MOBILITY_MERCHANT_TO_NOBLE_STABILITY = 60;
export const POP_MOBILITY_CLERGY_FAITH_THRESHOLD = 30;

// --- Carrying Capacity ---
// Housing capacity per point of regional development level.
export const POP_BASE_HOUSING_PER_REGION_DEV = 300;

// Per 10% over capacity, death rate modifier increase.
export const POP_OVERCAPACITY_DEATH_RATE_PER_10PCT = 0.05;

// Per 10% over capacity, disease vulnerability increase.
export const POP_OVERCAPACITY_DISEASE_VULN_PER_10PCT = 5;

// Rolling window for demographic momentum tracking.
export const POP_MOMENTUM_WINDOW_TURNS = 4;

// Starting defaults.
export const POP_DYNAMICS_STARTING_BIRTH_MODIFIER = 1.0;
export const POP_DYNAMICS_STARTING_DEATH_MODIFIER = 1.0;
export const POP_DYNAMICS_STARTING_MIGRATION = 0;

// ============================================================
// Block 21 — Social Fabric (Expansion 4)
// ============================================================

// --- Banditry ---
// Emerges when commoner satisfaction < threshold AND stability < threshold, OR during/after war.
export const SOCIAL_BANDITRY_COMMONER_SAT_THRESHOLD = 35;
export const SOCIAL_BANDITRY_STABILITY_THRESHOLD = 40;
export const SOCIAL_BANDITRY_TRADE_INCOME_PENALTY = 0.85;
export const SOCIAL_BANDITRY_FOOD_PRODUCTION_PENALTY = 0.90;
export const SOCIAL_BANDITRY_MERCHANT_SAT_DELTA = -5;
export const SOCIAL_BANDITRY_ESCALATION_TURNS = 4;
// Severe banditry: region output multiplier.
export const SOCIAL_BANDITRY_SEVERE_REGION_PENALTY = 0.60;
// Resolution: stability above this clears banditry.
export const SOCIAL_BANDITRY_RESOLUTION_STABILITY = 50;

// --- Corruption ---
// Emerges when nobility satisfaction > threshold AND taxation is High/Punitive.
export const SOCIAL_CORRUPTION_NOBILITY_SAT_THRESHOLD = 80;
export const SOCIAL_CORRUPTION_TREASURY_PENALTY = 0.90;
export const SOCIAL_CORRUPTION_CONSTRUCTION_COST = 1.15;
export const SOCIAL_CORRUPTION_STABILITY_DELTA = -2;

// --- Unrest ---
// Emerges when ANY class satisfaction < threshold AND stability < threshold.
export const SOCIAL_UNREST_CLASS_SAT_THRESHOLD = 20;
export const SOCIAL_UNREST_STABILITY_THRESHOLD = 35;
export const SOCIAL_UNREST_STABILITY_DELTA = -5;
// Escalation timeline: turns until riot, then rebellion.
export const SOCIAL_UNREST_ESCALATION_RIOT_TURNS = 3;
export const SOCIAL_UNREST_ESCALATION_REBELLION_TURNS = 6;
// Resolution: stability above this AND no class below 25 clears unrest.
export const SOCIAL_UNREST_RESOLUTION_STABILITY = 45;
export const SOCIAL_UNREST_RESOLUTION_CLASS_SAT = 25;

// --- Criminal Underworld ---
// Emerges when merchant sat < threshold AND trade Restricted/Closed, OR intel funding None for N turns.
export const SOCIAL_CRIMINAL_MERCHANT_SAT_THRESHOLD = 30;
export const SOCIAL_CRIMINAL_INTEL_NONE_TURNS = 4;
export const SOCIAL_CRIMINAL_COUNTER_INTEL_PENALTY = -15;
export const SOCIAL_CRIMINAL_TREASURY_PENALTY = 0.95;
// Perverse incentive: black market helps merchants slightly.
export const SOCIAL_CRIMINAL_MERCHANT_SAT_BONUS = 3;
// Resolution: counter-intelligence above this clears criminal underworld.
export const SOCIAL_CRIMINAL_RESOLUTION_COUNTER_INTEL = 50;

// --- Class Interaction Thresholds ---
// When source class satisfaction exceeds its rising threshold and target is below its falling threshold.
export const CLASS_INTERACTION_MERCHANT_RISING = 75;
export const CLASS_INTERACTION_CLERGY_RISING = 80;
export const CLASS_INTERACTION_MILITARY_RISING = 70;
export const CLASS_INTERACTION_NOBILITY_RISING = 80;
export const CLASS_INTERACTION_COMMONER_RISING = 70;

export const CLASS_INTERACTION_NOBILITY_FALLING = 50;
export const CLASS_INTERACTION_MERCHANT_FALLING = 60;
export const CLASS_INTERACTION_COMMONER_FALLING_LOW = 40;
export const CLASS_INTERACTION_COMMONER_FALLING = 50;

// Per-turn satisfaction delta applied to target class.
export const CLASS_INTERACTION_MERCHANT_NOBILITY_DELTA = -2;
export const CLASS_INTERACTION_CLERGY_MERCHANT_DELTA = -1;
export const CLASS_INTERACTION_MILITARY_COMMONER_DELTA = -1;
export const CLASS_INTERACTION_NOBILITY_COMMONER_DELTA = -2;
export const CLASS_INTERACTION_COMMONER_NOBILITY_DELTA = -2;

// ============================================================
// Block 22 — Economic Depth (Expansion 2)
// ============================================================

// --- Momentum Drift Weights ---
// momentumDelta = (tradeTrend × TRADE_WEIGHT) + (merchantSatTrend × MERCHANT_WEIGHT) + ...
export const ECON_MOMENTUM_TRADE_TREND_WEIGHT = 0.3;
export const ECON_MOMENTUM_MERCHANT_SAT_TREND_WEIGHT = 0.2;
export const ECON_MOMENTUM_STABILITY_WEIGHT = 0.15;
export const ECON_MOMENTUM_CONSTRUCTION_WEIGHT = 0.1;
export const ECON_MOMENTUM_WAR_PENALTY = -15;
export const ECON_MOMENTUM_FAMINE_PENALTY = -20;
export const ECON_MOMENTUM_MEAN_REVERSION = 0.05;

// --- Phase Thresholds ---
// EconomicPhase is derived from momentum: Depression < -50 < Recession < -15 < Stagnation < +15 < Growth < +50 < Boom
export const ECON_PHASE_DEPRESSION_THRESHOLD = -50;
export const ECON_PHASE_RECESSION_THRESHOLD = -15;
export const ECON_PHASE_GROWTH_THRESHOLD = 15;
export const ECON_PHASE_BOOM_THRESHOLD = 50;

// --- Phase Modifier Tables ---
// Treasury income multiplier by economic phase.
export const ECON_PHASE_TREASURY_MULTIPLIER: Record<EconomicPhase, number> = {
  [EconomicPhase.Depression]: 0.7,
  [EconomicPhase.Recession]: 0.85,
  [EconomicPhase.Stagnation]: 1.0,
  [EconomicPhase.Growth]: 1.15,
  [EconomicPhase.Boom]: 1.3,
};

// Trade income multiplier by economic phase.
export const ECON_PHASE_TRADE_MULTIPLIER: Record<EconomicPhase, number> = {
  [EconomicPhase.Depression]: 0.6,
  [EconomicPhase.Recession]: 0.8,
  [EconomicPhase.Stagnation]: 1.0,
  [EconomicPhase.Growth]: 1.2,
  [EconomicPhase.Boom]: 1.4,
};

// Per-turn merchant satisfaction delta by economic phase.
export const ECON_PHASE_MERCHANT_SAT_DELTA: Record<EconomicPhase, number> = {
  [EconomicPhase.Depression]: -3,
  [EconomicPhase.Recession]: -1,
  [EconomicPhase.Stagnation]: 0,
  [EconomicPhase.Growth]: 1,
  [EconomicPhase.Boom]: 2,
};

// --- Scarcity Pricing ---
// Resource demand pressure rises when stockpile < threshold.
export const ECON_SCARCITY_STOCKPILE_THRESHOLD = 20;
export const ECON_SCARCITY_DEMAND_RISE_RATE = 5;     // per turn when scarce
export const ECON_SCARCITY_DEMAND_DECAY_RATE = 3;    // per turn when plentiful

// Food price multiplier: 1.0 + max(0, (100 - foodReserves) / DENOMINATOR)
export const ECON_FOOD_PRICE_DENOMINATOR = 50;
export const ECON_FOOD_PRICE_MIN = 0.5;
export const ECON_FOOD_PRICE_MAX = 3.0;

// --- Inflation ---
// Inflation accumulates when expenses > income by this margin.
export const ECON_INFLATION_HIGH_SPENDING_RATE = 0.01;  // per turn when overspending
export const ECON_INFLATION_BOOM_RATE = 0.02;           // per turn when in Boom for > 4 turns
export const ECON_INFLATION_BOOM_TURNS_THRESHOLD = 4;
export const ECON_INFLATION_DEFLATION_RATE = 0.01;      // per turn during Recession/Depression
export const ECON_INFLATION_MAX = 0.5;
export const ECON_INFLATION_MIN = 0.0;
export const ECON_CUMULATIVE_INFLATION_STARTING = 1.0;  // no inflation at game start

// --- Merchant Confidence ---
export const ECON_CONFIDENCE_STARTING = 60;
export const ECON_CONFIDENCE_STABILITY_BONUS_THRESHOLD = 50;  // stability above this boosts confidence
export const ECON_CONFIDENCE_TRADE_WEIGHT = 0.3;
export const ECON_CONFIDENCE_STABILITY_WEIGHT = 0.2;
export const ECON_CONFIDENCE_WAR_PENALTY = -10;
export const ECON_CONFIDENCE_MIN = 0;
export const ECON_CONFIDENCE_MAX = 100;

// --- Trade Volume ---
export const ECON_TRADE_VOLUME_STARTING = 50;
export const ECON_TRADE_VOLUME_MIN = 0;
export const ECON_TRADE_VOLUME_MAX = 100;

// --- Starting Values ---
export const ECON_MOMENTUM_STARTING = 0;
export const ECON_INFLATION_RATE_STARTING = 0;

// --- Condition Emergence ---
// TradeDisruption emerges when tradeVolume < threshold for N turns.
export const ECON_TRADE_DISRUPTION_VOLUME_THRESHOLD = 20;
export const ECON_TRADE_DISRUPTION_TURNS = 2;
// MarketPanic emerges when merchantConfidence < threshold.
export const ECON_MARKET_PANIC_CONFIDENCE_THRESHOLD = 15;

// ============================================================
// Block 23 — Regional Life (Expansion 5)
// ============================================================

// --- Loyalty ---
export const REGION_LOYALTY_STARTING = 60;
// Loyalty drift: +/- DRIFT_PER_STABILITY_POINT × (stability - 50)
export const REGION_LOYALTY_STABILITY_DRIFT_PER_POINT = 0.1;
export const REGION_LOYALTY_STABILITY_MIDPOINT = 50;
// Per unaddressed regional condition.
export const REGION_LOYALTY_CONDITION_PENALTY = -2;
// One-time bonus when construction completes in region.
export const REGION_LOYALTY_CONSTRUCTION_BONUS = 5;
// Per-turn penalty when taxation is High/Punitive with low regional benefit.
export const REGION_LOYALTY_TAX_BURDEN_PENALTY = -1;
// Per-turn penalty for cultural mismatch with kingdom identity.
export const REGION_LOYALTY_CULTURAL_MISMATCH_PENALTY = -1;
export const REGION_LOYALTY_MIN = 0;
export const REGION_LOYALTY_MAX = 100;

// Loyalty consequence thresholds.
export const REGION_LOYALTY_REDUCED_TAX_THRESHOLD = 40;    // below: -30% tax contribution
export const REGION_LOYALTY_REDUCED_TAX_MULTIPLIER = 0.7;
export const REGION_LOYALTY_SEPARATIST_THRESHOLD = 25;     // below: separatist events
export const REGION_LOYALTY_REBELLION_THRESHOLD = 15;      // below: rebellion

// --- Infrastructure ---
// Starting values.
export const REGION_INFRA_ROADS_STARTING = 25;
export const REGION_INFRA_WALLS_STARTING = 20;
export const REGION_INFRA_GRANARIES_STARTING = 20;
export const REGION_INFRA_SANITATION_STARTING = 20;

// Decay per season without maintenance.
export const REGION_INFRA_DECAY_BASE = 1;
export const REGION_INFRA_DECAY_MAX = 2;
export const REGION_INFRA_MIN = 0;
export const REGION_INFRA_MAX = 100;

// Infrastructure effects on kingdom systems.
export const REGION_ROADS_TRADE_BONUS_PER_POINT = 0.003;       // trade modifier per roads point
export const REGION_WALLS_DEFENSE_BONUS_PER_POINT = 0.005;     // siege defense per walls point
export const REGION_GRANARIES_FOOD_BUFFER_PER_POINT = 0.5;     // food buffer per granaries point
export const REGION_SANITATION_DISEASE_REDUCTION_PER_POINT = 0.003;

// --- Terrain Modifiers ---
// Multipliers applied to primary economic output by terrain type.
export const REGION_TERRAIN_FOOD_MODIFIER: Record<TerrainType, number> = {
  [TerrainType.Plains]: 1.3,
  [TerrainType.Hills]: 0.8,
  [TerrainType.Forest]: 0.9,
  [TerrainType.Coastal]: 1.0,
  [TerrainType.Mountain]: 0.5,
  [TerrainType.River]: 1.2,
};

export const REGION_TERRAIN_TRADE_MODIFIER: Record<TerrainType, number> = {
  [TerrainType.Plains]: 1.0,
  [TerrainType.Hills]: 0.8,
  [TerrainType.Forest]: 0.7,
  [TerrainType.Coastal]: 1.4,
  [TerrainType.Mountain]: 0.5,
  [TerrainType.River]: 1.3,
};

export const REGION_TERRAIN_DEFENSE_MODIFIER: Record<TerrainType, number> = {
  [TerrainType.Plains]: 0.8,
  [TerrainType.Hills]: 1.3,
  [TerrainType.Forest]: 1.2,
  [TerrainType.Coastal]: 0.9,
  [TerrainType.Mountain]: 1.5,
  [TerrainType.River]: 1.0,
};

// ============================================================
// Block 24 — Regional Governance Posture (Phase 9)
// ============================================================

// Minimum turns a posture must have been unchanged before it qualifies as stale
// and becomes eligible to surface a "Set Posture" Court Opportunity.
export const POSTURE_STALE_TURNS = 8;

// Posture-specific per-turn effect tuning (kept conservative — postures are set
// rarely, so their modifiers are small but cumulative).
export const POSTURE_DEVELOP_INFRA_GAIN = 0.5;     // +0.5 per season, each axis
export const POSTURE_DEVELOP_TAX_MULTIPLIER = 0.9; // −10%
export const POSTURE_EXTRACT_OUTPUT_MULTIPLIER = 1.2;
export const POSTURE_EXTRACT_INFRA_DECAY_MULT = 1.5;
export const POSTURE_EXTRACT_LOYALTY_DRIFT = -0.5;
export const POSTURE_GARRISON_WALLS_GAIN = 1;
export const POSTURE_GARRISON_WALLS_CAP = 80;
export const POSTURE_GARRISON_TRADE_MULTIPLIER = 0.85;
export const POSTURE_PACIFY_LOYALTY_DRIFT = 0.5;
export const POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT = 0.5;
