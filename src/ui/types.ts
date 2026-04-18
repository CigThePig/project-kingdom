// UI-layer types for the card-based interface.
// These are presentation concerns — they do not belong in engine/types.ts.

export type CardFamily =
  | 'crisis'
  | 'response'
  | 'petition'
  | 'decree'
  | 'advisor'
  | 'legacy'
  | 'status'
  | 'season'
  | 'summary'
  | 'notification';

export type RoundPhase = 'seasonDawn' | 'crisis' | 'petition' | 'decree' | 'summary';

export interface PhaseDecisions {
  crisisResponse: string | null;
  petitionDecisions: { cardId: string; choiceId: string }[];
  selectedDecrees: string[];
}

export interface EffectHint {
  label: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
  /** Short modifier tags indicating active forces that will scale this delta. */
  modifiers?: string[];
}

/** A single line of simulation context attached to a card. */
export interface ContextLine {
  text: string;             // e.g. "Drought (Severe) — 3 turns active"
  tone: 'crisis' | 'pressure' | 'opportunity' | 'info';
}

/** A qualitative signal tag attached to a response or petition choice card. */
export interface SignalTag {
  label: string;              // e.g. "AUTHORITY ↑", "+AUSTERE", "FOLLOW-UP LIKELY"
  tone: 'style' | 'followup' | 'consequence';
}

export type ConfidenceLevel = 'low' | 'moderate' | 'high';

// ============================================================
// Expansion Types — World Texture (Workstreams A, B, C)
// ============================================================

import type {
  QualitativeTier,
  SeasonMonth,
  InteractionType,
  WorldPulseCategory,
  RivalPersonality,
  MechanicalEffectDelta,
  BondKind,
  AgentSpecialization,
} from '../engine/types';
import type { CardOfFamily } from '../engine/cards/types';

/** Generic card definition used by the card distributor and monthly structure. */
export interface CardDefinition {
  id: string;
  title: string;
  body: string;
  family: CardFamily;
  effects: EffectHint[];
}

// Monthly round phase tracking
export type MonthPhase =
  | 'monthDawn'
  | 'courtBusiness'
  | 'decree'    // Month 3 only
  | 'summary';  // Month 3 only

export interface MonthState {
  seasonMonth: SeasonMonth;          // 1, 2, or 3
  monthName: string;                 // "Early Thaw", "High Summer", etc.
  phase: MonthPhase;
  assignedCards: CardDefinition[];   // cards distributed to this month
  interactionType: InteractionType | null; // null = quiet month
  worldPulseLines: WorldPulseLine[];
  decisions: MonthDecision[];        // accumulated, fed to resolution after Month 3
}

export interface MonthDecision {
  cardId: string;
  choiceId: string;
  interactionType: InteractionType;
  month: SeasonMonth;
  /** Neighbor resolved during card generation; used to prevent retargeting at resolution. */
  targetNeighborId?: string;
}

export interface WorldPulseLine {
  text: string;
  category: WorldPulseCategory;
  sourceId?: string; // neighborId, factionId, etc.
}

// Negotiation interaction
export interface NegotiationTerm {
  id: string;
  title: string;
  description: string;
  effects: MechanicalEffectDelta;
  effectHints: EffectHint[];
  isToggled: boolean;
  /** Phase 13 — if set, toggling this term produces a Bond of this kind on accept. */
  bondKind?: BondKind;
  /** Phase 13 — numeric field the player may counter-propose. */
  counterableValue?: NegotiationCounterableValue;
}

/** Phase 13 — spec for a term whose value the player can haggle on. */
export interface NegotiationCounterableValue {
  field: 'tribute' | 'duration' | 'dowry';
  /** Baseline the card opens with (also the value used in `effects`). */
  baseline: number;
  min: number;
  max: number;
  step: number;
  /** Direction that favors the player when greater. */
  playerFavors: 'higher' | 'lower';
}

export interface NegotiationCard {
  eventCard: CardDefinition;
  terms: NegotiationTerm[];
  rejectEffects: MechanicalEffectDelta;
  rejectHints: EffectHint[];
  contextLabel: string;
  /** Neighbor resolved at generation time; prevents retargeting at resolution. */
  resolvedNeighborId?: string;
  /** Phase 13 — single counter-proposal (one numeric term adjusted) the player has staged. */
  counterProposal?: { termId: string; adjustedValue: number };
}

// Monthly card allocation — output of the card distributor.
// Phase 4: each slot holds a unified `Card` envelope of the matching family.
// Consumers reach legacy per-family fields via `card.payload`.
export interface MonthAllocation {
  interactionType: InteractionType | null;
  crisisData: CardOfFamily<'crisis'> | null;
  additionalCrises: CardOfFamily<'crisis'>[];
  /** Holds both petition and diplomatic-overture envelopes — overtures
   *  currently render and resolve identically to petitions. */
  petitionCards: (CardOfFamily<'petition'> | CardOfFamily<'overture'>)[];
  notificationCards: CardOfFamily<'notification'>[];
  negotiationCard: CardOfFamily<'negotiation'> | null;
  assessmentData: CardOfFamily<'assessment'> | null;
  /** Phase 5 — A Court Opportunity surfaced on a fully quiet month. Accept
   *  adds the referenced hand card to the Court Hand; decline is a no-op. */
  courtOpportunity?: CourtOpportunityOffer | null;
}

/** Phase 5 hand-card opportunity (original). */
export interface CourtOpportunityHandCardOffer {
  kind: 'hand_card';
  id: string;            // opportunity definition id
  title: string;         // framing title ("A Visiting Knight")
  body: string;          // flavor body
  handCardId: string;    // HandCardId referenced from src/data/cards/hand-cards
  handCardTitle: string; // preview of the hand card title
  handCardBody: string;  // preview of the hand card body
  expiresAfterTurns: number;
}

/** Phase 8 advisor-candidate opportunity. Accepting instantiates a candidate
 *  and moves it into `council.pendingCandidates`; if its seat is vacant, the
 *  reducer auto-appoints. */
export interface CourtOpportunityAdvisorOffer {
  kind: 'advisor_candidate';
  id: string;
  title: string;
  body: string;
  /** Template id from `src/data/advisors/candidates-wave-2`. */
  candidateTemplateId: string;
  /** Pre-resolved display fields so the card renders without extra lookups. */
  advisorName: string;
  seat: string;          // CouncilSeat enum value
  personality: string;   // AdvisorPersonality enum value
  background: string;
}

/** Phase 9 "Set Posture" opportunity. Accepting dispatches
 *  SET_REGIONAL_POSTURE; declining is a no-op. */
export interface CourtOpportunitySetPostureOffer {
  kind: 'set_posture';
  id: string;
  title: string;
  body: string;
  regionId: string;
  regionDisplayName: string;
  currentPosture: string;      // RegionalPosture enum value
  currentPostureLabel: string;
  suggestedPosture: string;    // RegionalPosture enum value
  suggestedPostureLabel: string;
  suggestedPostureEffect: string; // one-line summary of what the new posture does
}

/** Phase 10 "Commit to Initiative" opportunity. Accepting dispatches
 *  COMMIT_INITIATIVE; declining is a no-op. Only surfaces when no
 *  initiative is currently active. */
export interface CourtOpportunityInitiativeCommitOffer {
  kind: 'initiative_commit';
  id: string;
  title: string;
  body: string;
  /** Definition id from `src/data/initiatives/`. */
  definitionId: string;
  /** Pre-resolved display fields. */
  initiativeTitle: string;
  initiativeDescription: string;
  categoryLabel: string;           // "Military", "Cultural", etc.
  turnsRequired: number;
  rewardSummary: string;
  penaltySummary: string;
}

/** Phase 10 "Abandon Initiative" opportunity. Accepting dispatches
 *  ABANDON_INITIATIVE (applies penalty, clears slot); declining keeps the
 *  initiative. Only surfaces while an initiative is active. */
export interface CourtOpportunityInitiativeAbandonOffer {
  kind: 'initiative_abandon';
  id: string;
  title: string;
  body: string;
  currentInitiativeTitle: string;
  currentProgress: number;         // 0..100
  turnsActive: number;
  turnsRequired: number;
  penaltySummary: string;
}

/** Phase 14 "Recruit Agent" opportunity. Accepting dispatches
 *  RECRUIT_AGENT_FROM_OPPORTUNITY, adding a named agent to the roster. Only
 *  surfaces while the roster has room. */
export interface CourtOpportunityRecruitAgentOffer {
  kind: 'recruit_agent';
  id: string;
  title: string;
  body: string;
  specialization: AgentSpecialization;
  specializationLabel: string;
  /** Settlement the new agent will cover. Pre-resolved display name. */
  proposedCoverSettlementId: string;
  proposedCoverLabel: string;
}

export type CourtOpportunityOffer =
  | CourtOpportunityHandCardOffer
  | CourtOpportunityAdvisorOffer
  | CourtOpportunitySetPostureOffer
  | CourtOpportunityInitiativeCommitOffer
  | CourtOpportunityInitiativeAbandonOffer
  | CourtOpportunityRecruitAgentOffer;

export interface MonthCardAllocation {
  month1: MonthAllocation;
  month2: MonthAllocation;
  month3: MonthAllocation;
}

// Codex types
export interface CodexDomain {
  id: string;          // 'realm' | 'stores' | 'treasury' | 'infrastructure' | 'armies' | 'faith'
  title: string;
  tier: QualitativeTier;
  narrative: string;   // 1-3 sentence qualitative description
}

export interface RivalDossier {
  neighborId: string;
  kingdomName: string;
  rulerName: string;
  personality: RivalPersonality;
  personalityLabel: string;          // "Ambitious & Militaristic"
  regard: { label: string; score: number };  // "Wary (-12)"
  diplomaticStatus: string;          // "Non-Aggression Pact (Year 2)"
  tradeStatus: string | null;        // "Active — southern grain route" or null
  knownStrengths: string[];          // gated by intel level
  recentActions: string[];           // gated by intel level, last 3-4 turns
  spymasterAssessment: string | null; // gated by intel level >= Strong
  agendaAssessment: string | null;    // Phase 3: gated by intel level >= moderate
  dispositionTowardPlayer: string | null; // Phase 3: derived from memory drift
  confidenceRating: string | null;    // "Low" | "Moderate" | "High" | "Very High"
  intelLevel: 'none' | 'minimal' | 'moderate' | 'strong' | 'exceptional';
  // Phase 11 — foreign entanglements surfaced at moderate+ intel.
  foreignEntanglements?: string[];
}

export interface ActiveSituation {
  id: string;
  type: 'war' | 'construction' | 'treaty' | 'trade' | 'espionage' | 'failureWarning' | 'storyline' | 'kingdom_feature';
  title: string;
  statusLines: string[];   // 2-4 short status descriptors
  urgency: 'low' | 'medium' | 'high';
}

export interface ChronicleEntry {
  season: string;       // "Year 2, Autumn"
  text: string;         // "The Great Schism divided the clergy. You chose tolerance."
  isProtected: boolean; // legacy/milestone events can't be pruned
}

export type CodexSection = 'kingdom' | 'regions' | 'rivals' | 'situations' | 'chronicle' | 'combos' | 'council';

/** Phase 9 — per-region Codex entry. Compiled from RegionState + posture
 *  narrative fragments by `compileRegionSummaries(state)`. */
export interface RegionSummary {
  id: string;
  displayName: string;
  terrain: string;           // TerrainType enum value or empty for legacy regions
  posture: string;           // RegionalPosture enum value
  postureLabel: string;
  postureEffect: string;     // 1-line effect summary
  postureNarrative: string;  // 1-sentence flavor keyed to posture
  loyaltyTier: QualitativeTier;
  loyaltyValue: number;
  loyaltyNarrative: string;
  developmentTier: QualitativeTier;
  developmentValue: number;
  developmentNarrative: string;
  activityLine: string;      // leading condition or "Quiet season"
  isOccupied: boolean;
  turnsSincePostureChange: number;
  isStale: boolean;
  primaryOutput: string;     // 'Food' | 'Trade' | 'Wood' | 'Iron' | 'Stone'
  isBorder: boolean;
}

/** Maps a CardFamily to its CSS custom-property accent color. */
export function getAccentColor(family: CardFamily): string {
  switch (family) {
    case 'crisis':   return 'var(--color-accent-crisis)';
    case 'response': return 'var(--color-accent-response)';
    case 'petition': return 'var(--color-accent-petition)';
    case 'decree':   return 'var(--color-accent-decree)';
    case 'advisor':  return 'var(--color-accent-advisor)';
    case 'legacy':   return 'var(--color-accent-legacy)';
    case 'status':   return 'var(--color-accent-status)';
    case 'summary':  return 'var(--color-accent-response)';
    case 'season':   return 'var(--color-accent-status)';
    case 'notification': return 'var(--color-accent-status)';
  }
}

/** Family badge labels displayed in the card header. */
export function getFamilyLabel(family: CardFamily): string {
  switch (family) {
    case 'crisis':   return 'CRISIS';
    case 'response': return 'RESPONSE';
    case 'petition': return 'PETITION';
    case 'decree':   return 'DECREE';
    case 'advisor':  return 'ADVISOR';
    case 'legacy':   return 'LEGACY';
    case 'status':   return 'STATUS';
    case 'summary':  return 'SUMMARY';
    case 'season':   return 'SEASON';
    case 'notification': return 'NOTICE';
  }
}
