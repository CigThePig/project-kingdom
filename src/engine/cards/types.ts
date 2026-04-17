// Phase 4 — Unified Card Schema
//
// Every card-like surface in the game (crisis, petition, decree, negotiation,
// assessment, notification, overture, and future advisor/initiative) flows
// through a single discriminated `Card` type. The existing per-family data
// shapes (`CrisisPhaseData`, `PetitionCardData`, ...) survive as the `payload`
// field — this envelope adds shared metadata (cost, rarity, tags,
// prerequisites, combo keys, hand behavior) that later phases consume.
//
// This file is the schema only. Adapters that lift legacy data into `Card`
// live in `./adapters.ts`.

import type { RivalAgenda } from '../types';
import type { EffectHint, ContextLine, SignalTag } from '../../ui/types';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../../bridge/petitionCardGenerator';
import type { DecreeCardData } from '../../bridge/decreeCardGenerator';
import type { AssessmentPhaseData } from '../../bridge/assessmentCardGenerator';
import type { NegotiationCard } from '../../ui/types';

// ============================================================
// Scalar types
// ============================================================

export type CardId = string;

/** Coarse grouping by resolution pipeline. Parallel to — but distinct from —
 *  the UI-only `CardFamily` in `src/ui/types.ts`, which controls badges and
 *  accent colors. Engine code discriminates via this union. */
export type EngineCardFamily =
  | 'crisis'
  | 'petition'
  | 'decree'
  | 'negotiation'
  | 'assessment'
  | 'notification'
  | 'overture'
  | 'advisor'
  | 'initiative';

export type EffortTier = 'Light' | 'Standard' | 'Heavy' | 'Crushing';

export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Defining';

export type CardHandBehavior = 'instant' | 'banked' | 'persistent';

/** Union of every tag a card can carry. Drawn from existing event / decree
 *  taxonomies plus a handful of shared descriptors used by Phase 6 combos
 *  and Phase 7 filtering. Freely extendable in later phases. */
export type CardTag =
  // Event-category-aligned
  | 'economy'
  | 'food'
  | 'military'
  | 'diplomatic'
  | 'environment'
  | 'public_order'
  | 'religious'
  | 'cultural'
  | 'espionage'
  | 'knowledge'
  | 'class_conflict'
  | 'region'
  | 'kingdom'
  // Decree-category-aligned
  | 'civic'
  | 'social'
  // Shared descriptors
  | 'aggressive'
  | 'border'
  | 'commercial'
  | 'treasury'
  | 'administrative'
  | 'succession'
  | 'famine'
  | 'plague'
  | 'schism'
  | 'uprising'
  | 'migration'
  | 'trade'
  | 'tribute'
  | 'alliance'
  | 'hostage'
  | 'marriage'
  | 'pilgrimage'
  | 'festival'
  | 'construction'
  | 'military_buildup'
  | 'recruitment'
  | 'campaign'
  | 'siege'
  | 'scholarly'
  | 'heretical'
  | 'reformed'
  | 'orthodox'
  | 'legal'
  | 'bureaucratic'
  | 'expansionist'
  | 'isolationist'
  | 'pragmatic'
  | 'devout';

/** Gate a card behind runtime state. Consumed by Phase 5 (hand availability)
 *  and Phase 7 (content-expansion filtering). Always empty on Phase-4 cards
 *  emitted by adapters — generators populate as content warrants. */
export type CardPrerequisite =
  | {
      type: 'state_threshold';
      field: string;
      comparator: '>=' | '<=';
      value: number;
    }
  | { type: 'knowledge_unlocked'; advancementId: string }
  | { type: 'has_card_in_hand'; cardId: string }
  | { type: 'advisor_appointed'; seat: string }
  | { type: 'agenda_active'; agenda: RivalAgenda };

// ============================================================
// Payload aliases
// ============================================================
// Legacy data shapes live on in the bridge layer and surface as the `payload`
// of the corresponding family variant. New families (advisor, initiative)
// have placeholder payloads until their authoring phases land.

export type CrisisPayload = CrisisPhaseData;
export type PetitionPayload = PetitionCardData;
export type DecreePayload = DecreeCardData;
export type NegotiationPayload = NegotiationCard;
export type AssessmentPayload = AssessmentPhaseData;
export type NotificationPayload = NotificationCardData;
/** Overtures (Phase 3 diplomatic generator) currently reuse the petition
 *  payload shape — they render and resolve like petitions. Phase 13 may
 *  split these, at which point this alias changes. */
export type OverturePayload = PetitionCardData;

export interface AdvisorPayload {
  placeholder: true;
}

export interface InitiativePayload {
  placeholder: true;
}

// ============================================================
// Card envelope
// ============================================================

/** Metadata shared by every card regardless of family. */
export interface CardBase {
  id: CardId;
  title: string;
  body: string;

  // Cost & impact
  slotCost: number;
  effortCost: EffortTier;
  rarity: CardRarity;

  // Classification
  tags: CardTag[];

  // Availability gates
  prerequisites: CardPrerequisite[];

  // Display
  effects: EffectHint[];
  context: ContextLine[];
  signals?: SignalTag[];

  // Phase 6 combo metadata
  comboKeys?: string[];

  // Phase 5 hand mechanics
  hand: CardHandBehavior;
  expiresAfterTurns?: number;
}

/** Discriminated union over `family`. Each variant carries its legacy data
 *  shape in `payload`; phase components read via
 *  `card.family === '...' && card.payload`. */
export type Card =
  | (CardBase & { family: 'crisis'; payload: CrisisPayload })
  | (CardBase & { family: 'petition'; payload: PetitionPayload })
  | (CardBase & { family: 'decree'; payload: DecreePayload })
  | (CardBase & { family: 'negotiation'; payload: NegotiationPayload })
  | (CardBase & { family: 'assessment'; payload: AssessmentPayload })
  | (CardBase & { family: 'notification'; payload: NotificationPayload })
  | (CardBase & { family: 'overture'; payload: OverturePayload })
  | (CardBase & { family: 'advisor'; payload: AdvisorPayload })
  | (CardBase & { family: 'initiative'; payload: InitiativePayload });

/** Narrow a `Card` to a specific family variant. Useful in generators and
 *  consumers that already know which family they're producing / consuming. */
export type CardOfFamily<F extends EngineCardFamily> = Extract<Card, { family: F }>;
