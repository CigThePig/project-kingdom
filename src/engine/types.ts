// ============================================================
// Section 1 — Time Enums & Interfaces
// ============================================================

export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter',
}

// String enum values serialize cleanly to/from JSON for save files.

export interface TurnState {
  turnNumber: number; // 1-based, increments every turn
  month: number; // 1–12
  season: Season;
  year: number; // 1-based kingdom year
}

// ============================================================
// Section 2 — Population Enums
// ============================================================

export enum PopulationClass {
  Nobility = 'Nobility',
  Clergy = 'Clergy',
  Merchants = 'Merchants',
  Commoners = 'Commoners',
  MilitaryCaste = 'MilitaryCaste',
}

// ============================================================
// Section 3 — Action Enums
// ============================================================

export enum ActionType {
  Decree = 'Decree',
  PolicyChange = 'PolicyChange',
  Construction = 'Construction',
  MilitaryOrder = 'MilitaryOrder',
  TradeAction = 'TradeAction',
  DiplomaticAction = 'DiplomaticAction',
  IntelligenceOp = 'IntelligenceOp',
  ReligiousEdict = 'ReligiousEdict',
  ResearchDirective = 'ResearchDirective',
  CrisisResponse = 'CrisisResponse',
}

export enum DecreeCategory {
  Economic = 'Economic',
  Military = 'Military',
  Civic = 'Civic',
  Religious = 'Religious',
  Diplomatic = 'Diplomatic',
  Social = 'Social',
}

export enum ConstructionCategory {
  Economic = 'Economic',
  Military = 'Military',
  Civic = 'Civic',
  Religious = 'Religious',
  Scholarly = 'Scholarly',
  Trade = 'Trade',
}

// ============================================================
// Section 4 — Intelligence / Espionage Enums
// ============================================================

export enum IntelligenceOperationType {
  Reconnaissance = 'Reconnaissance',
  DiplomaticIntelligence = 'DiplomaticIntelligence',
  EconomicIntelligence = 'EconomicIntelligence',
  Sabotage = 'Sabotage',
  InternalSurveillance = 'InternalSurveillance',
  CounterEspionageSweep = 'CounterEspionageSweep',
}

// ============================================================
// Section 5 — Event / Storyline Enums
// ============================================================

export enum EventSeverity {
  Informational = 'Informational',
  Notable = 'Notable',
  Serious = 'Serious',
  Critical = 'Critical',
}

export enum EventCategory {
  Economy = 'Economy',
  Food = 'Food',
  Military = 'Military',
  Diplomacy = 'Diplomacy',
  Environment = 'Environment',
  PublicOrder = 'PublicOrder',
  Religion = 'Religion',
  Culture = 'Culture',
  Espionage = 'Espionage',
  Knowledge = 'Knowledge',
  ClassConflict = 'ClassConflict',
  Region = 'Region',
  Kingdom = 'Kingdom',
}

export enum StorylineCategory {
  Political = 'Political',
  Religious = 'Religious',
  Military = 'Military',
  TradeEcon = 'TradeEcon',
  Discovery = 'Discovery',
  Cultural = 'Cultural',
}

export enum StorylineStatus {
  Dormant = 'Dormant',
  Active = 'Active',
  Resolved = 'Resolved',
}

export enum OutcomeQuality {
  Disastrous = 'Disastrous',
  Poor = 'Poor',
  Expected = 'Expected',
  Good = 'Good',
  Excellent = 'Excellent',
}

// ============================================================
// Section 6 — Diplomacy Enums
// ============================================================

export enum DiplomaticPosture {
  Friendly = 'Friendly',
  Neutral = 'Neutral',
  Tense = 'Tense',
  Hostile = 'Hostile',
  War = 'War',
}

export enum NeighborDisposition {
  Aggressive = 'Aggressive',
  Opportunistic = 'Opportunistic',
  Cautious = 'Cautious',
  Mercantile = 'Mercantile',
  Isolationist = 'Isolationist',
}

// ============================================================
// Section 6b — Conflict & AI Neighbor Enums
// ============================================================

export enum ConflictPhase {
  Skirmish = 'Skirmish',
  Campaign = 'Campaign',
  Siege = 'Siege',
}

export enum NeighborActionType {
  TradeProposal = 'TradeProposal',
  TradeWithdrawal = 'TradeWithdrawal',
  TreatyProposal = 'TreatyProposal',
  Demand = 'Demand',
  WarDeclaration = 'WarDeclaration',
  PeaceOffer = 'PeaceOffer',
  BorderTension = 'BorderTension',
  MilitaryBuildup = 'MilitaryBuildup',
  EspionageRetaliation = 'EspionageRetaliation',
  ReligiousPressure = 'ReligiousPressure',
}

// ============================================================
// Section 7 — Knowledge Enums
// ============================================================

export enum KnowledgeBranch {
  Agricultural = 'Agricultural',
  Military = 'Military',
  Civic = 'Civic',
  MaritimeTrade = 'MaritimeTrade',
  CulturalScholarly = 'CulturalScholarly',
  NaturalPhilosophy = 'NaturalPhilosophy',
}

// ============================================================
// Section 8 — Miscellaneous Enums
// ============================================================

export enum ReligiousOrderType {
  Healing = 'Healing',
  Scholarly = 'Scholarly',
  Martial = 'Martial',
  Charitable = 'Charitable',
}

export enum MilitaryPosture {
  Defensive = 'Defensive',
  Standby = 'Standby',
  Mobilized = 'Mobilized',
  Aggressive = 'Aggressive',
}

export enum ResourceType {
  Wood = 'Wood',
  Iron = 'Iron',
  Stone = 'Stone',
}

export enum FailureCondition {
  Famine = 'Famine',
  Insolvency = 'Insolvency',
  Collapse = 'Collapse',
  Conquest = 'Conquest',
  Overthrow = 'Overthrow',
}

export type FailureWarningSeverity = 'caution' | 'critical';

export interface FailureWarning {
  condition: FailureCondition;
  turnsRemaining: number;
  severity: FailureWarningSeverity;
}

// ============================================================
// Section 9 — Policy Enums
// ============================================================

export enum TaxationLevel {
  Low = 'Low',
  Moderate = 'Moderate',
  High = 'High',
  Punitive = 'Punitive',
}

export enum TradeOpenness {
  Closed = 'Closed',
  Restricted = 'Restricted',
  Open = 'Open',
  Encouraged = 'Encouraged',
}

export enum RationingLevel {
  Abundant = 'Abundant',
  Normal = 'Normal',
  Rationed = 'Rationed',
  Emergency = 'Emergency',
}

export enum ReligiousTolerance {
  Enforced = 'Enforced',
  Favored = 'Favored',
  Tolerated = 'Tolerated',
  Suppressed = 'Suppressed',
}

export enum FestivalInvestmentLevel {
  None = 'None',
  Modest = 'Modest',
  Standard = 'Standard',
  Lavish = 'Lavish',
}

export enum MilitaryRecruitmentStance {
  Minimal = 'Minimal',
  Voluntary = 'Voluntary',
  Conscript = 'Conscript',
  WarFooting = 'WarFooting',
}

export enum IntelligenceFundingLevel {
  None = 'None',
  Minimal = 'Minimal',
  Moderate = 'Moderate',
  Heavy = 'Heavy',
}

// ============================================================
// Section 10 — System State Interfaces
// ============================================================

// --- Treasury ---

export interface TreasuryIncomeBreakdown {
  taxation: number;
  trade: number;
  miscellaneous: number;
}

export interface TreasuryExpenseBreakdown {
  militaryUpkeep: number;
  constructionCosts: number;
  intelligenceFunding: number;
  religiousUpkeep: number;
  festivalCosts: number;
}

export interface TreasuryState {
  balance: number;
  netFlowPerTurn: number; // income total - expense total
  income: TreasuryIncomeBreakdown;
  expenses: TreasuryExpenseBreakdown;
  consecutiveTurnsInsolvent: number; // for insolvency failure condition tracking
}

// --- Food ---

export interface FoodState {
  reserves: number;
  productionPerTurn: number;
  consumptionPerTurn: number;
  netFlowPerTurn: number; // production - consumption
  seasonalModifier: number; // multiplier applied to production, e.g. 0.5 in Winter
  agriculturalEfficiencyBonus: number; // cumulative bonus from knowledge advancements
  consecutiveTurnsEmpty: number; // for famine failure condition tracking
}

// --- Population ---

export interface ClassState {
  population: number;
  satisfaction: number; // 0–100
  satisfactionDeltaLastTurn: number;
  intrigueRisk?: number; // 0–100; only meaningful on Nobility
}

export type PopulationState = Record<PopulationClass, ClassState>;

// --- Resources ---

export interface ResourceStockState {
  stockpile: number;
  extractionRatePerTurn: number;
}

export type ResourceState = Record<ResourceType, ResourceStockState>;

// --- Military ---

export interface MilitaryState {
  forceSize: number;
  readiness: number; // 0–100
  equipmentCondition: number; // 0–100
  morale: number; // 0–100
  upkeepBurdenPerTurn: number;
  deploymentPosture: MilitaryPosture;
  intelligenceAdvantage: number; // 0–100, derived from espionage operations
  militaryCasteQuality: number; // derived from MilitaryCaste ClassState satisfaction
}

// --- Stability ---

export interface StabilityState {
  value: number; // 0–100, composite weighted score
  consecutiveTurnsAtZero: number; // for collapse failure condition tracking
  classContributions: Record<PopulationClass, number>; // per-class weighted partial scores
  foodSecurityContribution: number;
  faithContribution: number;
  culturalCohesionContribution: number;
  decreePaceContribution: number; // negative drag from high action volume
}

// --- Faith & Culture ---

export interface ReligiousOrder {
  type: ReligiousOrderType;
  isActive: boolean;
  upkeepPerTurn: number;
}

export interface FaithCultureState {
  faithLevel: number; // 0–100
  culturalCohesion: number; // 0–100
  activeOrders: ReligiousOrder[];
  heterodoxy: number; // 0–100; escalation toward schism threshold
  schismActive: boolean;
  schismDetails: string | null; // internal schism ID used to link events; NOT player-facing text
  kingdomFaithTraditionId: string; // internal faith tradition ID for alignment checks (e.g. 'orthodox', 'reformed')
  kingdomCultureIdentityId: string; // internal culture ID for alignment checks (e.g. 'highland', 'coastal')
}

// --- Diplomacy ---

export interface DiplomaticAgreement {
  agreementId: string;
  neighborId: string;
  turnsRemaining: number | null; // null = indefinite agreement
}

export interface NeighborState {
  id: string;
  relationshipScore: number; // 0–100
  attitudePosture: DiplomaticPosture;
  activeAgreements: DiplomaticAgreement[];
  /** Proposals awaiting player acceptance. Accepted at start of next turn if not rejected. */
  pendingProposals: DiplomaticAgreement[];
  outstandingTensions: string[]; // internal tension IDs; not player-facing text
  disposition: NeighborDisposition;
  militaryStrength: number; // 0–100
  religiousProfile: string; // internal faith-tradition ID
  culturalIdentity: string; // internal culture ID
  espionageCapability: number; // 0–100
  lastActionTurn: number; // turn of last autonomous AI action
  warWeariness: number; // 0–100, accumulates during conflicts
  isAtWarWithPlayer: boolean; // convenience flag derived from posture
  recentActionHistory: { turnNumber: number; actionType: NeighborActionType; summary: string }[];
}

export interface DiplomacyState {
  neighbors: NeighborState[];
}

// --- AI Neighbor Actions ---

export interface NeighborAction {
  neighborId: string;
  actionType: NeighborActionType;
  turnGenerated: number;
  parameters: Record<string, unknown>;
}

// --- Conflicts ---

export interface ConflictState {
  id: string;
  neighborId: string;
  phase: ConflictPhase;
  turnStarted: number;
  turnsElapsed: number;
  playerAdvantage: number; // -100 to +100, positive = player winning
  targetRegionId: string | null; // region under threat/siege
  playerCasualties: number; // cumulative force losses
  neighborCasualties: number; // estimated enemy losses
  lastOutcomeCode: string; // internal outcome code, NOT player-facing text
}

export interface ConflictResolutionOutcome {
  advantageShift: number;
  playerCasualties: number;
  neighborCasualties: number;
  outcomeCode: string; // internal code for text layer
  isResolved: boolean;
  playerVictory: boolean | null; // null if ongoing
}

// --- Espionage ---

export interface EspionageState {
  networkStrength: number; // 0–100
  counterIntelligenceLevel: number; // 0–100
}

// --- Knowledge ---

export interface KnowledgeBranchState {
  branch: KnowledgeBranch;
  progressValue: number; // raw accumulated progress points
  currentMilestoneIndex: number; // index of next milestone to unlock
  unlockedAdvancements: string[]; // internal advancement IDs
}

export interface KnowledgeState {
  branches: Record<KnowledgeBranch, KnowledgeBranchState>;
  // researchFocus is NOT stored here. The sole source of truth is PolicyState.researchFocus.
  // The blueprint defines no mechanic by which events can redirect research focus
  // independently of player policy (§4.13, §5.3).
  progressPerTurn: number; // calculated from treasury investment + clergy + infrastructure
}

// --- Regions ---

export interface RegionState {
  id: string;
  // 'Food' and 'Trade' are internal engine identifiers, not player-facing text
  primaryEconomicOutput: ResourceType | 'Food' | 'Trade';
  localConditionModifier: number; // multiplier applied to regional outputs
  populationContribution: number;
  developmentLevel: number; // 0–100
  localFaithProfile: string; // internal faith-tradition ID
  culturalIdentity: string; // internal culture ID
  strategicValue: number; // 0–100
  isOccupied: boolean;
}

// --- Policy ---

export interface PolicyState {
  taxationLevel: TaxationLevel;
  tradeOpenness: TradeOpenness;
  militaryRecruitmentStance: MilitaryRecruitmentStance;
  rationingLevel: RationingLevel;
  researchFocus: KnowledgeBranch | null;
  religiousTolerance: ReligiousTolerance;
  festivalInvestmentLevel: FestivalInvestmentLevel;
  intelligenceFundingLevel: IntelligenceFundingLevel;
  laborAllocationPriority: KnowledgeBranch | null; // which domain receives surplus labor
  policyChangedThisTurn: boolean; // enforces the one-change-per-turn rule
}

// ============================================================
// Section 11 — Action Queue Types
// ============================================================

export interface QueuedAction {
  id: string; // client-generated UUID
  type: ActionType;
  actionDefinitionId: string; // references the data layer action definition
  slotCost: number; // 0, 1, or 2
  isFree: boolean; // true for free crisis responses
  targetRegionId: string | null;
  targetNeighborId: string | null;
  parameters: Record<string, unknown>; // unknown (not any) — callers must narrow before use
}

export interface ActionBudget {
  slotsTotal: number; // always ACTION_BUDGET_BASE
  slotsUsed: number;
  slotsRemaining: number;
  policyChangesUsedThisTurn: number; // max 1 per turn
  queuedActions: QueuedAction[];
}

// ============================================================
// Section 12 — Construction Projects
// ============================================================

export interface ConstructionProject {
  id: string;
  definitionId: string; // references the data layer project definition
  category: ConstructionCategory;
  targetRegionId: string;
  turnsRemaining: number;
  turnsTotal: number;
  resourceCostRemaining: Partial<Record<ResourceType, number>>;
  effectId: string; // which persistent effect applies on completion
}

// ============================================================
// Section 12b — Mechanical Effect Delta
// ============================================================

/**
 * A flat, all-optional delta representing any combination of game state changes.
 * Used by event choice effects, storyline branch effects, and storyline resolution effects.
 */
export interface MechanicalEffectDelta {
  treasuryDelta?: number;
  foodDelta?: number;
  stabilityDelta?: number;
  faithDelta?: number;
  heterodoxyDelta?: number;
  culturalCohesionDelta?: number;
  militaryReadinessDelta?: number;
  militaryMoraleDelta?: number;
  militaryEquipmentDelta?: number;
  militaryForceSizeDelta?: number;
  espionageNetworkDelta?: number;
  nobilitySatDelta?: number;
  clergySatDelta?: number;
  merchantSatDelta?: number;
  commonerSatDelta?: number;
  militaryCasteSatDelta?: number;
  /** Per-neighbor relationship score deltas. Keys are neighbor IDs. */
  diplomacyDeltas?: Record<string, number>;
  /** Applied to the event/storyline's affectedRegionId. */
  regionDevelopmentDelta?: number;
  /** Applied to the event/storyline's affectedRegionId. */
  regionConditionDelta?: number;
}

/**
 * Records that an event or storyline choice left a lasting mark on the kingdom.
 * Used to influence future event eligibility and storyline conditions.
 */
export interface PersistentConsequence {
  sourceId: string;        // event definitionId or storyline definitionId
  sourceType: 'event' | 'storyline';
  choiceMade: string;      // choiceId that was selected
  turnApplied: number;
  tag: string;             // internal identifier, e.g. 'evt_merchant_capital_flight:offer_tax_relief'
}

/**
 * A time-limited effect applied each turn until it expires.
 * Created by event/storyline choices that produce ongoing consequences.
 */
export interface TemporaryModifier {
  id: string;
  sourceTag: string;            // links back to the consequence tag that created it
  turnsRemaining: number;       // decremented each turn; removed when 0
  turnApplied: number;
  effectPerTurn: MechanicalEffectDelta;  // applied once per turn during resolution
}

// ============================================================
// Section 13 — Event Types
// ============================================================

export interface EventChoice {
  choiceId: string; // internal ID
  slotCost: number; // 0 = free crisis response, 1 = slot-consuming
  isFree: boolean;
}

export interface ActiveEvent {
  id: string;
  definitionId: string; // references the data layer event definition
  severity: EventSeverity;
  category: EventCategory;
  isResolved: boolean;
  choiceMade: string | null; // choiceId of player's selection; null if pending
  chainId: string | null; // event chain membership; null for standalone events
  chainStep: number | null;
  turnSurfaced: number;
  affectedRegionId: string | null;
  affectedClassId: PopulationClass | null;
  relatedStorylineId: string | null;
  outcomeQuality: OutcomeQuality | null; // determined when choice is resolved; null if pending
  isFollowUp: boolean; // true if this event arose from a prior choice
  followUpSourceId: string | null; // definitionId of the event that spawned this follow-up
}

// ============================================================
// Section 14 — Storyline Types
// ============================================================

export interface StorylineBranchDecision {
  branchPointId: string;
  choiceId: string;
  turnNumber: number;
  outcomeQuality: OutcomeQuality | null; // determined when branch choice is resolved
}

export interface ActiveStoryline {
  id: string;
  definitionId: string; // references the data layer storyline definition
  category: StorylineCategory;
  status: StorylineStatus;
  currentBranchId: string;
  decisionHistory: StorylineBranchDecision[];
  turnActivated: number;
  turnsUntilNextBranchPoint: number | null; // null when storyline is resolved
}

// ============================================================
// Section 15 — Intelligence Report
// ============================================================

export interface IntelligenceReport {
  id: string;
  operationType: IntelligenceOperationType;
  targetId: string; // neighborId or internal domestic target ID
  findings: string; // internal findings code — NOT player-facing text
  confidenceLevel: number; // 0–100
  // IMPORTANT: isGenuine is for engine resolution logic ONLY.
  // The UI layer must never surface this field directly.
  // False intelligence is deliberately indistinguishable from genuine intelligence
  // until a correction arrives on the following turn (§12.3).
  isGenuine: boolean;
  isCorrectionPending: boolean; // if true, a correction report arrives next turn
  turnGenerated: number;
}

// ============================================================
// Section 16 — History & Crown Bar
// ============================================================

export interface TurnHistoryEntry {
  turnNumber: number;
  season: Season;
  year: number;
  snapshotSummary: {
    treasuryBalance: number;
    foodReserves: number;
    stabilityValue: number;
    activeEventCount: number;
  };
  actionsIssued: QueuedAction[];
  eventsResolved: string[]; // resolved event IDs
}

export interface CrownBarData {
  turnNumber: number;
  season: Season;
  year: number;
  treasuryBalance: number;
  foodReserves: number;
  stabilityRating: number;
  unresolvedUrgentMatters: number; // count of Serious/Critical unresolved events
}

// ============================================================
// Section 16b — Turn Summary Items
// ============================================================

/** Severity tier for turn summary item ordering. */
export type TurnSummarySeverity = 'critical' | 'notable' | 'routine';

/**
 * Screen navigation target for cross-screen linking from turn summary items.
 * Matches the ScreenId union used in the UI layer.
 */
export type SummaryTargetScreen =
  | 'dashboard'
  | 'reports'
  | 'decrees'
  | 'treasury'
  | 'military'
  | 'diplomacy'
  | 'faith'
  | 'knowledge'
  | 'regions'
  | 'espionage'
  | 'events'
  | 'archive'
  | null;

/** Category tag for turn summary items, used for grouping and icon selection. */
export type SummaryItemCategory =
  | 'treasury'
  | 'food'
  | 'class'
  | 'faith'
  | 'military'
  | 'construction'
  | 'knowledge'
  | 'event'
  | 'storyline'
  | 'intelligence'
  | 'diplomacy'
  | 'conflict'
  | 'failure';

/**
 * A structured turn summary entry with navigation target.
 * Replaces the plain-string approach in the original summary builder.
 */
export interface TurnSummaryItem {
  severity: TurnSummarySeverity;
  text: string;
  targetScreen: SummaryTargetScreen;
  category: SummaryItemCategory;
}

// ============================================================
// Section 16c — Follow-Up & Narrative Pacing
// ============================================================

/**
 * A scheduled follow-up event that will surface after a delay.
 * Created when a player makes a choice that triggers a reactive follow-up.
 */
export interface PendingFollowUp {
  id: string;
  definitionId: string;       // event definition to surface
  sourceEventId: string;      // definitionId of the event that spawned this
  triggerChoiceId: string;    // the choice that triggered this follow-up
  triggerTurn: number;        // turn the triggering choice was made
  delayTurns: number;         // turns to wait before surfacing
  probability: number;        // 0-1, chance it fires when due
}

// ============================================================
// Section 16d — Decree Progression Tracking
// ============================================================

/**
 * Records that a decree has been enacted.
 * Used to enforce one-time issuance and cooldown logic.
 */
export interface IssuedDecree {
  decreeId: string;        // matches DecreeDefinition.id
  turnIssued: number;
}

/**
 * Tracks narrative pacing to ensure event variety and detect player behavior patterns.
 * Updated each turn during event resolution.
 */
export interface NarrativePacingState {
  recentCategoryTurns: Partial<Record<EventCategory, number>>;  // last turn each category fired
  recentSeverityCount: Record<EventSeverity, number>;            // count in last 5 turns
  dominantClassFavor: PopulationClass | null;                    // class player consistently favors
  classChoiceHistory: Record<PopulationClass, number>;           // net favor score per class
}

// ============================================================
// Section 16e — Ruling Style Tracking
// ============================================================

export enum StyleAxis {
  Authority = 'Authority',   // Permissive (−) ↔ Authoritarian (+)
  Economy = 'Economy',       // Populist (−) ↔ Mercantilist (+)
  Military = 'Military',     // Pacifist (−) ↔ Martial (+)
  Faith = 'Faith',           // Secular (−) ↔ Theocratic (+)
}

// ============================================================
// Section 17 — Expansion Types (World Texture)
// ============================================================

// Month-within-Season tracking.
// The engine already has TurnState.month (1-12). These values map
// the 3 months within a season to the player-facing monthly structure.
export enum SeasonMonth {
  Early = 1,
  Mid = 2,
  Late = 3,
}

// Rival Kingdom Personality (for dossier system)
export enum RivalPersonality {
  AmbitiousMilitaristic = 'AmbitiousMilitaristic',
  MercantilePragmatic = 'MercantilePragmatic',
  DevoutInsular = 'DevoutInsular',
  ExpansionistDiplomatic = 'ExpansionistDiplomatic',
  DefensiveCautious = 'DefensiveCautious',
}

// Qualitative State Tiers (for Codex)
export enum QualitativeTier {
  Dire = 'Dire',
  Troubled = 'Troubled',
  Stable = 'Stable',
  Prosperous = 'Prosperous',
  Flourishing = 'Flourishing',
}

// Interaction types (extends card families)
export enum InteractionType {
  CrisisResponse = 'CrisisResponse',
  Petition = 'Petition',
  Negotiation = 'Negotiation',
  Assessment = 'Assessment',
  Decree = 'Decree',
}

// World Pulse flavor categories
export enum WorldPulseCategory {
  NeighborActivity = 'NeighborActivity',
  KingdomCondition = 'KingdomCondition',
  FactionMurmur = 'FactionMurmur',
  Seasonal = 'Seasonal',
  Foreshadowing = 'Foreshadowing',
}

export interface StyleDecision {
  source: 'event' | 'decree' | 'petition';
  sourceId: string;
  choiceId: string;
  turnApplied: number;
  axisDeltas: Partial<Record<StyleAxis, number>>;
}

export interface RulingStyleState {
  axes: Record<StyleAxis, number>;              // each −50 to +50
  recentDecisions: StyleDecision[];             // rolling window of last 20
  crossedThresholds: Record<string, boolean>;   // e.g. "Authority_+30", prevents re-triggering
}

// ============================================================
// Section 17 — Save File & Main GameState
// ============================================================

export interface GameState {
  // Time
  turn: TurnState;

  // Resources
  treasury: TreasuryState;
  food: FoodState;
  resources: ResourceState;

  // Population
  population: PopulationState;

  // Systems
  military: MilitaryState;
  stability: StabilityState;
  faithCulture: FaithCultureState;
  diplomacy: DiplomacyState;
  espionage: EspionageState;
  knowledge: KnowledgeState;

  // Spatial
  regions: RegionState[];

  // Policies
  policies: PolicyState;

  // Active world state
  constructionProjects: ConstructionProject[];
  activeEvents: ActiveEvent[];
  activeStorylines: ActiveStoryline[];
  activeConflicts: ConflictState[];
  neighborActions: NeighborAction[]; // AI actions generated this turn, cleared each turn

  // Turn action management
  actionBudget: ActionBudget;

  // Derived / display
  crownBar: CrownBarData;

  // Failure tracking
  activeFailureConditions: FailureCondition[];
  consecutiveTurnsOverthrowRisk: number; // for overthrow failure condition tracking

  // Persistent history tracked in GameState for engine access
  persistentConsequences: PersistentConsequence[];
  resolvedStorylineIds: string[];       // definitionIds of resolved storylines
  lastStorylineActivationTurn: number;  // turn number of most recent storyline activation

  // Temporary modifiers from event/storyline choices (applied each turn, expire after N turns)
  activeTemporaryModifiers: TemporaryModifier[];

  // Follow-up events scheduled by prior choices
  pendingFollowUps: PendingFollowUp[];

  // Decree progression: tracks all enacted decrees for one-time/cooldown logic
  issuedDecrees: IssuedDecree[];

  // Narrative pacing state for smarter event selection
  narrativePacing: NarrativePacingState;

  // Ruling style tracking
  rulingStyle: RulingStyleState;

  // Scenario
  scenarioId: string;
}

export interface SaveFile {
  version: number; // schema version integer, e.g. 1
  scenarioId: string;
  savedAt: number; // Unix timestamp ms
  isMidTurn: boolean;
  gameState: GameState;
  turnHistory: TurnHistoryEntry[];
  eventHistory: ActiveEvent[]; // fully resolved past events
  intelligenceReports: IntelligenceReport[];
}
