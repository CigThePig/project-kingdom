import type { EventTriggerCondition } from './events/event-engine';
import type { Card, CardTag } from './cards/types';

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

// Phase 2 — Rival Kingdom Simulation Core
export enum RivalCrisisType {
  Famine = 'Famine',
  Insolvency = 'Insolvency',
  CivilUnrest = 'CivilUnrest',
  SuccessionStruggle = 'SuccessionStruggle',
  Plague = 'Plague',
  ReligiousSchism = 'ReligiousSchism',
}

// Phase 3 — Rival Agendas & Memory
export enum RivalAgenda {
  RestoreTheOldBorders = 'RestoreTheOldBorders',
  BleedTheRivals = 'BleedTheRivals',
  DominateTrade = 'DominateTrade',
  ReligiousHegemony = 'ReligiousHegemony',
  DynasticAlliance = 'DynasticAlliance',
  SubjugateAVassal = 'SubjugateAVassal',
  SackASettlement = 'SackASettlement',
  DefensiveConsolidation = 'DefensiveConsolidation',
  IsolationistRetreat = 'IsolationistRetreat',
  EconomicRecovery = 'EconomicRecovery',
  ConvertThePlayer = 'ConvertThePlayer',
  ProveDominance = 'ProveDominance',
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

// --- Population Dynamics (Expansion 1) ---

export interface PopulationDynamicsState {
  birthRateModifier: number;           // kingdom-wide, 0.8–1.2, affected by food/faith/stability
  deathRateModifier: number;           // kingdom-wide, 0.8–1.5, affected by disease/famine/war
  migrationPressure: number;           // -100 to +100. Positive = inflow, negative = outflow
  pendingMobility: ClassMobilityEvent[];
  housingCapacity: number;             // derived from regions + construction
  currentTotalPopulation: number;      // cached sum of all class populations
  recentBirthSurplus: number;          // rolling 4-turn sum of net births
  recentDeathSurplus: number;          // rolling 4-turn sum of net deaths
  consecutiveTurnsIntelNone: number;   // for CriminalUnderworld emergence check
}

export interface ClassMobilityEvent {
  fromClass: PopulationClass;
  toClass: PopulationClass;
  count: number;
  reason: string;                      // internal code: 'merchant_prosperity', 'conscription', etc.
}

// Card trigger for population events (migration, overcrowding, mobility)
export interface PopulationCardTrigger {
  type: 'migration_inflow' | 'migration_petition' | 'migration_crisis'
    | 'overcrowding_petition' | 'overcrowding_crisis'
    | 'merchant_titles' | 'conscription_harvest' | 'clergy_exodus'
    | 'population_boom' | 'population_decline';
  magnitude: number;                   // for severity determination
}

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
  /** @deprecated Phase 13 — Bond.bondId is the richer replacement. Kept for legacy
   *  trade agreements already running on pre-v7 saves; new creations use bonds. */
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

  // Phase 1 — procedurally generated display fields. All optional: nameResolver
  // falls back to NEIGHBOR_LABELS when absent, which is how pre-Phase-1 saves load.
  displayName?: string;
  rulerName?: string;
  rulerTitle?: string;
  dynastyName?: string;
  epithet?: string | null;
  capitalName?: string;

  // Phase 2 — Rival Kingdom Simulation Core. Optional for save migration;
  // pre-Phase-2 saves backfill via createInitialRivalState in LOAD_SAVE.
  kingdomSimulation?: RivalKingdomState;

  // Phase 3 — Rival Agendas & Memory. Optional for save migration;
  // pre-Phase-3 saves backfill via selectInitialAgenda in LOAD_SAVE.
  agenda?: RivalAgendaState;
  memory?: RivalMemoryEntry[];
}

// Phase 2 — Rival Kingdom Simulation types

export interface RivalInternalEvent {
  turnRecorded: number;
  type: string; // internal code: 'famine_southern_provinces', 'minor_uprising', etc.
  severity: 'minor' | 'notable' | 'major';
  resolved: boolean;
}

export interface RivalKingdomState {
  treasuryHealth: number; // 0–100
  treasuryTrend: 'rising' | 'stable' | 'declining';
  foodSecurity: number; // 0–100
  foodTrend: 'rising' | 'stable' | 'declining';
  internalStability: number; // 0–100
  populationMood: number; // 0–100
  expansionistPressure: number; // 0–100
  mercantilePressure: number; // 0–100
  pietisticPressure: number; // 0–100
  recentInternalEvents: RivalInternalEvent[]; // capped at 8, oldest dropped first
  isInCrisis: boolean;
  crisisType: RivalCrisisType | null;
}

/** Pressure score map, 0..1 per action type. Multiplies existing RNG gates in diplomacy AI. */
export type RivalActionPressureScores = Record<NeighborActionType, number>;

// Phase 3 — Rival Agendas & Memory types

export interface RivalMemoryEntry {
  turnRecorded: number;
  type: 'slight' | 'favor' | 'breach' | 'demonstration' | 'territorial_loss';
  /** Source tag describing what triggered this memory (e.g. 'rejected_proposal:trade'). */
  source: string;
  /** 0..1 magnitude. Decays over time; drift delta multiplies by this. */
  weight: number;
  /** Human-readable context string (internal, never rendered raw to player). */
  context: string;
  /** Phase 2.5 geography anchor — set for territorial_loss entries. */
  regionId?: string;
  /** Phase 2.5 geography anchor — set for settlement-scoped grievances. */
  settlementId?: string;
}

export interface RivalAgendaState {
  current: RivalAgenda;
  /** region_* | neighbor_* | settlement_* | null (untargeted agendas). */
  targetEntityId: string | null;
  /** 0..100 — progress toward satisfaction. Ticked by tickAgenda. */
  progressValue: number;
  /** Turns since this agenda was adopted. Used by shouldAgendaShift. */
  turnsActive: number;
}

export interface DiplomacyState {
  neighbors: NeighborState[];
  // Phase 11 — Inter-Kingdom Diplomacy. Both optional for save migration;
  // pre-Phase-11 saves backfill via createInitialRivalRelationships in LOAD_SAVE.
  /** Symmetric matrix of neighbor-to-neighbor relationship scores, −100..+100. */
  rivalRelationships?: Record<string, Record<string, number>>;
  /** Active inter-rival agreements (alliances, trade pacts, wars). */
  interRivalAgreements?: InterRivalAgreement[];
  // Phase 13 — rich diplomatic bonds (marriages, hostages, vassalage, coalitions, etc.).
  // Optional for save migration; pre-v7 saves backfill to [] in LOAD_SAVE.
  bonds?: Bond[];
}

// Phase 11 — Inter-Kingdom Diplomacy
export type InterRivalAgreementKind = 'alliance' | 'trade_pact' | 'war';

export interface InterRivalAgreement {
  id: string; // `${a}_${b}_${kind}_t${turn}`
  kind: InterRivalAgreementKind;
  /** Canonical lower neighbor_* id (string-compare). */
  a: string;
  /** Canonical higher neighbor_* id. */
  b: string;
  turnStarted: number;
  /** For alliances: shared target (neighbor_* or 'player'). */
  sharedTargetId?: string | null;
}

// --- Phase 13 — Diplomacy Overhaul: Bonds ---

/** Richer diplomatic ties that supersede the flat `DiplomaticAgreement`. */
export type BondKind =
  | 'royal_marriage'
  | 'hostage_exchange'
  | 'vassalage'
  | 'mutual_defense'
  | 'coalition'
  | 'trade_league'
  | 'religious_accord'
  | 'cultural_exchange';

export interface BondBase {
  /** Stable id: `${kind}_t${turnStarted}_${shortHash}`. */
  bondId: string;
  kind: BondKind;
  turnStarted: number;
  /** null = indefinite. Decremented each turn by tickBondExpiry. */
  turnsRemaining: number | null;
  /** neighbor_* ids. Multiple participants for coalition / trade_league / religious_accord. */
  participants: string[];
  /** Relationship delta applied to each participant on breach (negative). */
  breachPenalty: number;
}

export interface MarriageBond extends BondBase {
  kind: 'royal_marriage';
  spouseName: string;
  dynastyId: string;
  heirProduced: boolean;
}

export interface HostageBond extends BondBase {
  kind: 'hostage_exchange';
  hostageName: string;
  /** If true, both sides hold hostages (symmetric); else player holds only. */
  mutual: boolean;
}

export interface VassalageBond extends BondBase {
  kind: 'vassalage';
  /** neighbor_* id of the overlord. If player is overlord, value is 'player'. */
  overlord: string;
  /** Treasury delta to overlord per turn. */
  tributePerTurn: number;
}

export interface MutualDefenseBond extends BondBase {
  kind: 'mutual_defense';
}

export interface CoalitionBond extends BondBase {
  kind: 'coalition';
  /** neighbor_* id of the target the coalition opposes. */
  commonEnemyId: string;
}

export interface TradeLeagueBond extends BondBase {
  kind: 'trade_league';
  /** Treasury delta per turn per participant edge. */
  incomePerTurn: number;
}

export interface ReligiousAccordBond extends BondBase {
  kind: 'religious_accord';
  /** Internal faith-tradition id shared across signatories. */
  sharedFaithId: string;
}

export interface CulturalExchangeBond extends BondBase {
  kind: 'cultural_exchange';
}

export type Bond =
  | MarriageBond
  | HostageBond
  | VassalageBond
  | MutualDefenseBond
  | CoalitionBond
  | TradeLeagueBond
  | ReligiousAccordBond
  | CulturalExchangeBond;

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

  // Expansion 5 — Regional Life (optional for backward compatibility)
  localPopulation?: number;             // actual population count in this region
  loyalty?: number;                     // 0–100, how attached the region is to the crown
  infrastructure?: RegionalInfrastructure;
  localConditions?: KingdomCondition[]; // regional conditions (drought, plague, banditry)
  localEconomy?: RegionalEconomy;
  /** @deprecated — derived from geography.edges via recomputeBorderFlags(). */
  borderRegion?: boolean;               // true = adjacent to a neighbor
  terrainType?: TerrainType;

  // Phase 2.5 — Procedural display name (seeded from runSeed + id).
  // Populated by applyProceduralRegionNames() during scenario setup or save migration.
  displayName?: string;

  // Phase 9 — Regional governance posture.
  // Optional for save-file backward compatibility; LOAD_SAVE migration defaults
  // missing values to RegionalPosture.Autonomy.
  posture?: RegionalPosture;
  postureSetOnTurn?: number;
}

// --- Regional posture (Phase 9) ---
export enum RegionalPosture {
  Develop = 'Develop',
  Extract = 'Extract',
  Garrison = 'Garrison',
  Pacify = 'Pacify',
  Autonomy = 'Autonomy',
}

// --- Geography (Phase 2.5) ---
// Graph-based location layer: regions, neighbors, and named settlements as
// nodes connected by adjacency edges. No coordinates, no pathfinding. Surfaces
// through cards and dossier text via the nameResolver.

export type GeographicEntityId = string; // 'region_*' | 'neighbor_*' | 'settlement_*'

export type AdjacencyKind = 'land' | 'river' | 'sea' | 'mountain_pass';
export type FrictionTier = 'open' | 'contested' | 'difficult';

export interface AdjacencyEdge {
  a: GeographicEntityId;
  b: GeographicEntityId;
  kind: AdjacencyKind;
  frictionTier: FrictionTier;
}

export type ClaimStrength = 'ancestral' | 'recent' | 'disputed';

export interface HistoricClaim {
  neighborId: string;
  regionId: string;
  claimStrength: ClaimStrength;
  // null = claimed but never controlled; otherwise the turn control was lost.
  lostOnTurn: number | null;
  // Stable code, not display text — drives dossier templating indirectly.
  internalReasonCode: string;
}

export type SettlementRole = 'capital' | 'market' | 'fortress' | 'shrine' | 'minor';

export interface Settlement {
  id: string;              // 'settlement_*'
  regionId: string;
  role: SettlementRole;
  populationShare: number; // 0..1 share of the parent region's population
  displayName?: string;    // procgen; populated during scenario setup / migration
}

export interface WorldGeography {
  schemaVersion: 1;
  edges: AdjacencyEdge[];
  historicClaims: HistoricClaim[];
  settlements: Settlement[];
  // Denormalized indexes — rebuilt by buildGeographyIndexes(); never authored.
  _adjacencyIndex?: Record<string, string[]>;
  _claimsByNeighbor?: Record<string, string[]>;
  _claimsByRegion?: Record<string, string[]>;
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
 * A permanent kingdom improvement established by decree or event choice.
 * Applies an ongoing mechanical effect every turn without expiring.
 */
export interface KingdomFeature {
  id: string;
  sourceTag: string;
  turnEstablished: number;
  ongoingEffect: MechanicalEffectDelta;
  category: 'infrastructure' | 'military' | 'diplomatic' | 'cultural' | 'economic';
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
  affectedNeighborId: string | null;
  relatedStorylineId: string | null;
  outcomeQuality: OutcomeQuality | null; // determined when choice is resolved; null if pending
  isFollowUp: boolean; // true if this event arose from a prior choice
  followUpSourceId: string | null; // definitionId of the event that spawned this follow-up
}

// ============================================================
// Section 13b — Narrative Pressure Types
// ============================================================

export interface NarrativePressure {
  authority: number;
  piety: number;
  commerce: number;
  militarism: number;
  reform: number;
  intrigue: number;
  openness: number;
  isolation: number;
}

export interface StorylineActivationProfile {
  /** Primary axis — must cross this threshold. */
  primaryAxis: keyof NarrativePressure;
  primaryThreshold: number;

  /** Optional secondary axis — if present, must also cross this threshold. */
  secondaryAxis?: keyof NarrativePressure;
  secondaryThreshold?: number;

  /** Optional suppressor — if this axis is ABOVE this value, storyline is blocked. */
  suppressedByAxis?: keyof NarrativePressure;
  suppressedByThreshold?: number;

  /** Minimum turn before this storyline can activate (floor: 8, enforced by engine). */
  minTurn: number;

  /** Priority when multiple storylines qualify simultaneously. Higher = preferred. */
  priority: number;

  /** Optional: required consequence tags (from follow-up chains or past decisions). */
  requiredTags?: string[];

  /** Optional: blocking consequence tags (if present, storyline cannot activate). */
  blockedByTags?: string[];
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
  /** Phase 6 — combo keys from every card played this turn. Optional so
   *  pre-expansion history entries deserialize cleanly. */
  playedComboKeys?: string[];
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
  stateConditions?: EventTriggerCondition[];   // fire-time state gate
  stateRetries?: number;                       // retry counter
  maxStateRetries?: number;                    // authored override for retry limit
  exclusiveGroupId?: string | null;            // sibling cancellation group
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
  Notification = 'Notification',
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
// Section 18 — Environment & Health System (Expansion 3)
// ============================================================

export enum ConditionType {
  // Environmental
  Drought = 'Drought',
  Flood = 'Flood',
  HarshWinter = 'HarshWinter',
  Blight = 'Blight',
  BountifulHarvest = 'BountifulHarvest',
  // Health
  Plague = 'Plague',
  Pox = 'Pox',
  Famine = 'Famine',
  Pestilence = 'Pestilence',
  // Social (reserved for Expansion 4)
  Banditry = 'Banditry',
  Corruption = 'Corruption',
  Unrest = 'Unrest',
  CriminalUnderworld = 'CriminalUnderworld',
  // Economic (reserved for Expansion 2)
  TradeDisruption = 'TradeDisruption',
  MarketPanic = 'MarketPanic',
  // Positive
  GoldenAge = 'GoldenAge',
  HarvestFestival = 'HarvestFestival',
  PilgrimageSeason = 'PilgrimageSeason',
  MilitaryTriumph = 'MilitaryTriumph',
}

export enum ConditionSeverity {
  Mild = 'Mild',
  Moderate = 'Moderate',
  Severe = 'Severe',
}

export interface ConditionEffect {
  target: string;                      // e.g., 'food.productionModifier', 'treasury.expenseModifier'
  operator: 'add' | 'multiply';
  value: number;
}

export interface KingdomCondition {
  id: string;
  type: ConditionType;
  severity: ConditionSeverity;
  turnsActive: number;
  turnsRemaining: number | null;       // null = until resolved by player action or system threshold
  systemEffects: ConditionEffect[];    // what this condition does each turn
  regionId: string | null;             // null = kingdom-wide, string = regional
  canEscalate: boolean;                // whether this condition can worsen if unaddressed
  escalatesTo: ConditionType | null;   // condition type of the escalated form
}

export interface EnvironmentState {
  activeConditions: KingdomCondition[];
  weatherSeverity: number;             // -50 to +50. Negative = harsh, positive = mild
  droughtAccumulator: number;          // 0–100, rises in dry conditions
  floodRisk: number;                   // 0–100, rises after heavy weather events
  diseaseVulnerability: number;        // 0–100, rises with overcrowding/famine/war
  sanitationLevel: number;             // 0–100, improved by civic construction/knowledge
  plagueMemoryTurns: number;           // turns since last plague, affects population caution
}

// ============================================================
// Section 18b — Causal Legibility System (Expansion 6)
// ============================================================

export interface CausalNode {
  system: string;                      // 'food', 'treasury', 'population', 'military', etc.
  description: string;                 // internal code, NOT player text: 'conscription_labor_loss'
  numericDelta: number | null;         // the actual value change, if quantifiable
}

export interface CausalEntry {
  cause: CausalNode;
  effect: CausalNode;
}

export interface CausalChain {
  id: string;
  rootCause: CausalNode;
  finalEffect: CausalNode;
  intermediateSteps: CausalNode[];
  totalMagnitude: number;              // abstract importance score for filtering
  turnRecorded: number;
}

export interface CausalLedger {
  currentTurnEntries: CausalEntry[];
  currentTurnChains: CausalChain[];
  recentChains: CausalChain[];         // last 4 turns, for advisor analysis
}

// ============================================================
// Section 18c — Condition Card Trigger (bridges environment → events)
// ============================================================

export interface ConditionCardTrigger {
  conditionId: string;
  conditionType: ConditionType;
  severity: ConditionSeverity;
  triggerType: 'emergence' | 'escalation' | 'resolution';
  regionId: string | null;
}

// ============================================================
// Section 18d — Economic System (Expansion 2)
// ============================================================

export enum EconomicPhase {
  Depression = 'Depression',           // momentum < -50
  Recession = 'Recession',            // momentum -50 to -15
  Stagnation = 'Stagnation',          // momentum -15 to +15
  Growth = 'Growth',                   // momentum +15 to +50
  Boom = 'Boom',                       // momentum > +50
}

export interface EconomicState {
  economicMomentum: number;            // -100 to +100. Positive = expansion, negative = contraction
  cyclePhase: EconomicPhase;           // derived from momentum thresholds
  turnsInCurrentPhase: number;

  // Scarcity pricing
  resourceDemandPressure: Record<ResourceType, number>;  // 0–100, drives price multipliers
  foodPriceMultiplier: number;         // 0.5–3.0, affects treasury/satisfaction

  // Inflation
  inflationRate: number;               // 0.0–0.5, erodes treasury purchasing power
  cumulativeInflation: number;         // cumulative multiplier since game start (starts at 1.0)

  // Market confidence
  merchantConfidence: number;          // 0–100, separate from satisfaction — represents market outlook
  tradeVolume: number;                 // 0–100, represents kingdom commercial activity level

  // Trend tracking (previous turn values for delta calculation)
  previousTradeIncome: number;
  previousMerchantSatisfaction: number;

  // Count of consecutive turns tradeVolume has stayed below the disruption
  // threshold. Resets to 0 when volume recovers. Drives TradeDisruption
  // emergence independent of cycle-phase duration.
  consecutiveLowTradeTurns?: number;
}

// Modifiers returned by the economic cycle tick, applied downstream in turn resolution.
export interface EconomicModifiers {
  treasuryMultiplier: number;          // from economic phase (0.7–1.3)
  tradeMultiplier: number;             // from economic phase (0.6–1.4)
  merchantSatisfactionDelta: number;   // from economic phase (-3 to +2)
  inflationCostMultiplier: number;     // from cumulative inflation (1.0+)
  foodPriceSatisfactionPenalty: number; // from food price multiplier (0 to -6)
}

// ============================================================
// Section 18e — Regional Life (Expansion 5)
// ============================================================

export enum TerrainType {
  Plains = 'Plains',                   // food bonus, vulnerable to cavalry
  Hills = 'Hills',                     // mining bonus, defensive terrain
  Forest = 'Forest',                   // wood bonus, ambush terrain
  Coastal = 'Coastal',                 // trade bonus, naval vulnerability
  Mountain = 'Mountain',               // stone bonus, near-impregnable defense, low food
  River = 'River',                     // food + trade bonus, flood risk
}

export interface RegionalInfrastructure {
  roads: number;                       // 0–100, affects trade throughput and military movement
  walls: number;                       // 0–100, affects siege defense
  granaries: number;                   // 0–100, affects local food storage capacity
  sanitation: number;                  // 0–100, affects disease vulnerability
}

export interface RegionalEconomy {
  productionOutput: number;            // actual output this turn (after all modifiers)
  localTradeActivity: number;          // 0–100, affects merchant population
  taxContribution: number;             // this region's share of kingdom tax revenue
}

// Card trigger for regional loyalty events (loyalty warnings, separatism, rebellion)
export interface RegionalCardTrigger {
  regionId: string;
  type: 'loyalty_warning' | 'separatist_event' | 'rebellion' | 'infrastructure_decay';
  loyalty: number;
}

// ============================================================
// Section 19 — Save File & Main GameState
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
  populationDynamics: PopulationDynamicsState;

  // Systems
  military: MilitaryState;
  stability: StabilityState;
  faithCulture: FaithCultureState;
  diplomacy: DiplomacyState;
  espionage: EspionageState;
  knowledge: KnowledgeState;

  // Environment & Health (Expansion 3)
  environment: EnvironmentState;

  // Economic System (Expansion 2)
  economy: EconomicState;

  // Causal Legibility (Expansion 6)
  causalLedger: CausalLedger;

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
  lastStorylineResolutionTurn: number;  // turn number of most recent storyline resolution (0 if none)

  // Narrative pressure accumulator — tracks thematic weight of player decisions
  narrativePressure: NarrativePressure;

  // Temporary modifiers from event/storyline choices (applied each turn, expire after N turns)
  activeTemporaryModifiers: TemporaryModifier[];

  // Permanent kingdom features established by decrees and event choices (applied each turn, never expire)
  activeKingdomFeatures: KingdomFeature[];

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

  // Phase 1 — per-run seed used to derive procedural names deterministically.
  // Optional so pre-Phase-1 saves load; LOAD_SAVE backfills via generateRunSeed().
  runSeed?: string;

  // Phase 2.5 — Geography graph. Optional for backward compatibility; legacy
  // saves get synthesized geography in LOAD_SAVE via
  // synthesizeGeographyFromScenario().
  geography?: WorldGeography;

  // Phase 5 — Court Hand. Holds banked cards for later use.
  // LOAD_SAVE backfills pre-Phase-5 saves via createInitialCourtHand().
  courtHand: CourtHand;

  // Phase 6 — IDs of combos that have fired at least once in this save.
  // Drives the discovered-vs-silhouette state in the Codex.
  // LOAD_SAVE backfills pre-Phase-6 saves with an empty array.
  discoveredCombos: string[];

  // Phase 6 — combo keys from cards played since the last turn resolution.
  // Pushed by the reducer when a card is played (hand, decree, petition, etc.)
  // and consumed + cleared by turn-resolution after detection runs.
  // LOAD_SAVE backfills pre-Phase-6 saves with an empty array.
  pendingComboKeysThisTurn: string[];

  // Phase 8 — Council & Advisor appointments. Optional for save compatibility;
  // LOAD_SAVE backfills pre-Phase-8 saves via createCouncilState().
  council?: CouncilState;

  // Phase 10 — Long-Term Initiative slot. At most one active initiative.
  // Optional for save compatibility; LOAD_SAVE backfills pre-Phase-10 saves
  // with null.
  activeInitiative?: ActiveInitiative | null;

  // Phase 12 — Dynamic World Events. Region-wide events (plagues, shocks,
  // movements) that span kingdoms. Optional for save compatibility;
  // LOAD_SAVE backfills pre-Phase-12 saves with an empty array.
  activeWorldEvents?: ActiveWorldEvent[];
}

// ============================================================
// Phase 10 — Long-Term Initiatives
// ============================================================

export type InitiativeCategory =
  | 'military'
  | 'cultural'
  | 'economic'
  | 'religious'
  | 'political';

/** Condition that, if persistently true, auto-abandons an initiative.
 *  `field` is a dotted path into GameState (e.g. 'treasury.gold',
 *  'stability.value'). Evaluated numerically; non-numeric targets skip. */
export interface InitiativeFailureCondition {
  type: 'state_below';
  field: string;
  threshold: number;
}

export interface ActiveInitiative {
  definitionId: string;
  /** 0..100 — completes at 100. */
  progressValue: number;
  turnsActive: number;
  turnsRequired: number;
  turnCommitted: number;
  /** Auto-abandon triggers after 2 consecutive failing turns. */
  consecutiveFailingTurns: number;
}

// Phase 5 — Court Hand
export interface CourtHandSlot {
  card: Card;
  turnAdded: number;
  turnsUntilExpiry: number;
}

export interface CourtHand {
  slots: CourtHandSlot[];
  capacity: number;
}

// ============================================================
// Phase 8 — Council & Advisors
// ============================================================
// Four seats: Chancellor (civic/economy), Marshal (military), Chamberlain
// (diplomacy/court), Spymaster (espionage/knowledge). Each seat holds at most
// one CouncilAdvisor. Advisors carry personality-driven modifiers that layer
// into card resolution, plus flaws (often hidden at appointment) that can
// surface over time.

export enum CouncilSeat {
  Chancellor = 'Chancellor',
  Marshal = 'Marshal',
  Chamberlain = 'Chamberlain',
  Spymaster = 'Spymaster',
}

export enum AdvisorPersonality {
  Prudent = 'Prudent',
  Zealous = 'Zealous',
  Cunning = 'Cunning',
  BattleHardened = 'BattleHardened',
  SilverTongue = 'SilverTongue',
  Scholar = 'Scholar',
  Ironfist = 'Ironfist',
  Reformist = 'Reformist',
}

export type AdvisorEffectKind =
  | 'income_multiplier'
  | 'slot_cost_discount'
  | 'outcome_quality_boost'
  | 'finding_confidence_boost'
  | 'delta_bonus';

/** A scoped modifier attached to a CouncilAdvisor. Each modifier describes a
 *  target (what kind of card or system it affects), a scope (optional tag and
 *  category filters), and an effect (what it does when it matches).
 *
 *  `delta_bonus` is the workhorse — a numeric value that adds into the
 *  MechanicalEffectDelta for matching choices. `value` is interpreted as a
 *  percentage when the effect is `income_multiplier` or `slot_cost_discount`,
 *  and as a flat integer for `delta_bonus` / `outcome_quality_boost`. */
export interface AdvisorModifier {
  target: 'crisis' | 'petition' | 'decree' | 'negotiation' | 'overture' | 'system';
  scope: {
    tags?: CardTag[];
    categories?: EventCategory[];
    seats?: CouncilSeat[];
  };
  effect: {
    kind: AdvisorEffectKind;
    value: number;
    /** For `delta_bonus` only: name of the MechanicalEffectDelta field the
     *  bonus flows into (e.g. 'treasuryDelta', 'nobilitySatDelta'). */
    deltaField?: string;
  };
}

export interface AdvisorFlaw {
  /** Stable id — `'greedy' | 'drunkard' | 'zealot' | 'vendetta' | 'reformist'`.
   *  Definitions live in `src/data/advisors/flaws.ts`. */
  id: string;
  hidden: boolean;
  /** 0-1 probability the flaw is revealed on any given turn. */
  detectionChancePerTurn: number;
  /** Turn the flaw was revealed, or null while hidden. */
  revealedTurn: number | null;
}

export interface CouncilAdvisor {
  /** `'advisor_<runSeed>_<n>'`. Stable across renames. */
  id: string;
  /** Display name. Derived at instantiation via `generateRulerName` and then
   *  stored so loyalty ticks and chronicle lines can reference the same string. */
  name: string;
  seat: CouncilSeat;
  personality: AdvisorPersonality;
  modifiers: AdvisorModifier[];
  flaws: AdvisorFlaw[];
  /** 0-100. Drifts each turn based on whether recent pressures align with
   *  the advisor's personality. Below 30 advisors may disobey; below 10 they
   *  may defect. */
  loyalty: number;
  yearsServing: number;
  turnAppointed: number;
  background: string;
  /** Class that takes the penalty when this advisor is dismissed. */
  patronClass: PopulationClass;
}

export interface CouncilState {
  appointments: Partial<Record<CouncilSeat, CouncilAdvisor>>;
  /** Candidates surfaced by court opportunities but not yet appointed. */
  pendingCandidates: CouncilAdvisor[];
}

export interface SaveFile {
  version: number; // schema version integer, e.g. 1
  scenarioId: string;
  savedAt: number; // Unix timestamp ms
  // True iff the engine had queued actions when the save was written.
  // NOT a resume cursor — the UI's currentMonth/currentPhase/accumulatedDecisions
  // are not persisted, so a reload always starts at month-dawn with the
  // queued actions intact. Treat this as a "has pending work" indicator, not
  // as permission to resume mid-phase.
  isMidTurn: boolean;
  gameState: GameState;
  turnHistory: TurnHistoryEntry[];
  eventHistory: ActiveEvent[]; // fully resolved past events
  intelligenceReports: IntelligenceReport[];
  chronicle?: Array<{ season: string; text: string; isProtected: boolean }>;
  /** Decree IDs offered last season, used to penalize repeat offers. */
  recentlyOfferedDecreeIds?: string[];
}

// ============================================================
// Phase 12 — Dynamic World Events
// ============================================================
//
// Region-wide events that cross kingdom borders: plagues, economic shocks,
// religious movements, climatic disasters, celestial omens. Spread iterates
// Phase 2.5 geography (`_adjacencyIndex`) and each definition declares which
// AdjacencyKind values transmit it.

export type WorldEventCategory =
  | 'plague'
  | 'economic_shock'
  | 'religious_movement'
  | 'climatic'
  | 'celestial'
  | 'mercenary'
  | 'agricultural'
  | 'cooperative';

/** 'player' or a neighbor id ('neighbor_*'). */
export type WorldEventKingdomId = string;

export type WorldEventPhaseName = 'emerging' | 'active' | 'waning' | 'resolved';

/** Stat-delta kinds applied per turn to each affected kingdom. The engine maps
 *  these to the real stat surfaces at apply time — kept as a small stable
 *  enum so data authors don't touch field names. */
export type WorldEventEffectKind =
  | 'treasury'
  | 'food'
  | 'stability'
  | 'military_readiness'
  | 'faith'
  | 'heterodoxy'
  | 'population'
  | 'diplomacy_to_player'
  | 'rival_mood';

export interface WorldEventEffect {
  kind: WorldEventEffectKind;
  /** Per-turn delta while the kingdom is affected. Small integers (~-5..+5). */
  value: number;
}

export interface WorldEventSpreadRule {
  /** Only edges of these kinds transmit the event. */
  transmittedBy: AdjacencyKind[];
  /** Base probability per turn per candidate edge (0..1). */
  baseProbabilityPerTurn: number;
  /** Edges of these kinds hard-block spread even if present. */
  blockedBy?: AdjacencyKind[];
}

export interface WorldEventChoiceDef {
  id: string;
  /** Key into WORLD_EVENT_CHOICE_EFFECTS (data/world-events/effects). */
  effectsKey: string;
}

export type WorldEventSeedSelector =
  | 'any'
  | 'coastal'
  | 'border'
  | 'player_and_adjacent'
  | 'all_kingdoms';

export interface WorldEventDefinition {
  id: string;                          // 'we_*'
  category: WorldEventCategory;
  severity: EventSeverity;
  /** Earliest turn on which this event may spawn. */
  minTurn: number;
  /** Relative weight when selecting among eligible definitions. */
  spawnWeight: number;
  /** null = stays until all kingdoms recover; number = auto-resolve countdown. */
  durationTurns: number | null;
  spread: WorldEventSpreadRule;
  /** How initial seed kingdoms are picked. */
  seedSelector: WorldEventSeedSelector;
  /** Effects applied each turn to each affected kingdom. */
  perTurnEffects: WorldEventEffect[];
  /** Player-facing choices surfaced via crisis card. */
  choices: WorldEventChoiceDef[];
}

export interface ActiveWorldEvent {
  id: string;                          // instance id, e.g. 'we_black_pox_t12'
  definitionId: string;                // refers to a WorldEventDefinition
  category: WorldEventCategory;
  severity: EventSeverity;
  turnSpawned: number;
  /** null = indefinite; otherwise counts down each turn. */
  turnsRemaining: number | null;
  phase: WorldEventPhaseName;
  /** 'player' or neighbor_* ids currently affected. */
  affectedKingdoms: WorldEventKingdomId[];
  /** Kingdoms that have been affected but since recovered. Prevents
   *  re-infection during the same instance. */
  recoveredKingdoms: WorldEventKingdomId[];
  /** Turn on which the player was first surfaced a crisis card; null if
   *  never surfaced yet (e.g. event hasn't reached player). */
  playerCardSurfacedOnTurn: number | null;
}
