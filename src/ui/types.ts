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
}

export interface NegotiationCard {
  eventCard: CardDefinition;
  terms: NegotiationTerm[];
  rejectEffects: MechanicalEffectDelta;
  rejectHints: EffectHint[];
  contextLabel: string;
  /** Neighbor resolved at generation time; prevents retargeting at resolution. */
  resolvedNeighborId?: string;
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
}

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

export type CodexSection = 'kingdom' | 'rivals' | 'situations' | 'chronicle';

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
