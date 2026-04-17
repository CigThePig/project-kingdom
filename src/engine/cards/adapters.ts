// Phase 4 — Card adapters
//
// Lifts the family-specific data shapes produced by each bridge generator
// into the unified `Card` envelope. Generators call the appropriate adapter
// as the last step of their pipeline; downstream code always sees `Card`.
//
// Every adapter is pure — no side effects, no RNG. Given the same legacy
// payload it always produces the same envelope.

import { EventCategory, EventSeverity, DecreeCategory } from '../types';
import type { EventDefinition } from '../events/event-engine';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../../bridge/petitionCardGenerator';
import type { DecreeCardData } from '../../bridge/decreeCardGenerator';
import type { AssessmentPhaseData } from '../../bridge/assessmentCardGenerator';
import type { NegotiationCard } from '../../ui/types';
import type { Card, CardBase, CardOfFamily, CardRarity, CardTag, EffortTier } from './types';

// ============================================================
// Shared helpers
// ============================================================

/** Map a numeric slot cost into an effort tier. Cards without an explicit
 *  cost land on `Light`. */
export function effortFromSlotCost(cost: number): EffortTier {
  if (cost >= 4) return 'Crushing';
  if (cost === 3) return 'Heavy';
  if (cost === 2) return 'Standard';
  return 'Light';
}

/** Critical events become `Rare`, everything else `Common`. Phase 7 content
 *  will author richer rarity distributions. */
export function rarityFromSeverity(sev?: EventSeverity): CardRarity {
  if (sev === EventSeverity.Critical) return 'Rare';
  return 'Common';
}

/** Map an `EventCategory` to its nearest card tags. Returns an empty array
 *  when the category is unknown — callers union the result with family-
 *  specific tags. */
export function deriveTagsFromEventCategory(cat?: EventCategory): CardTag[] {
  switch (cat) {
    case EventCategory.Economy:       return ['economy', 'treasury'];
    case EventCategory.Food:          return ['food'];
    case EventCategory.Military:      return ['military'];
    case EventCategory.Diplomacy:     return ['diplomatic'];
    case EventCategory.Environment:   return ['environment'];
    case EventCategory.PublicOrder:   return ['public_order'];
    case EventCategory.Religion:      return ['religious'];
    case EventCategory.Culture:       return ['cultural'];
    case EventCategory.Espionage:     return ['espionage'];
    case EventCategory.Knowledge:     return ['knowledge', 'scholarly'];
    case EventCategory.ClassConflict: return ['class_conflict', 'public_order'];
    case EventCategory.Region:        return ['region'];
    case EventCategory.Kingdom:       return ['kingdom'];
    default:                          return [];
  }
}

export function deriveTagsFromDecreeCategory(cat?: DecreeCategory): CardTag[] {
  switch (cat) {
    case DecreeCategory.Economic:   return ['economy', 'treasury'];
    case DecreeCategory.Military:   return ['military'];
    case DecreeCategory.Civic:      return ['civic', 'administrative'];
    case DecreeCategory.Religious:  return ['religious'];
    case DecreeCategory.Diplomatic: return ['diplomatic'];
    case DecreeCategory.Social:     return ['social'];
    default:                        return [];
  }
}

/** Union tags while preserving order and dropping duplicates. */
function mergeTags(...groups: CardTag[][]): CardTag[] {
  const seen = new Set<CardTag>();
  const out: CardTag[] = [];
  for (const group of groups) {
    for (const tag of group) {
      if (!seen.has(tag)) {
        seen.add(tag);
        out.push(tag);
      }
    }
  }
  return out;
}

/** Shared defaults for every envelope. Adapters spread this and then
 *  overwrite the fields they care about. */
function baseDefaults(): Pick<CardBase, 'prerequisites' | 'comboKeys' | 'hand' | 'context'> {
  return {
    prerequisites: [],
    comboKeys: [],
    hand: 'instant',
    context: [],
  };
}

// ============================================================
// Per-family adapters
// ============================================================

export function crisisToCard(
  data: CrisisPhaseData,
  def?: EventDefinition,
): CardOfFamily<'crisis'> {
  const maxSlotCost = data.responses.reduce(
    (max, r) => (r.slotCost > max ? r.slotCost : max),
    0,
  );
  const tags = mergeTags(deriveTagsFromEventCategory(def?.category));
  return {
    ...baseDefaults(),
    family: 'crisis',
    id: data.crisisCard.eventId,
    title: data.crisisCard.title,
    body: data.crisisCard.body,
    slotCost: maxSlotCost,
    effortCost: effortFromSlotCost(maxSlotCost),
    rarity: rarityFromSeverity(def?.severity),
    tags,
    effects: data.crisisCard.effects,
    context: data.crisisCard.context ?? [],
    payload: data,
  };
}

export function petitionToCard(
  data: PetitionCardData,
  def?: EventDefinition,
): CardOfFamily<'petition'> {
  const grantChoice = def?.choices.find((c) => c.choiceId === data.grantChoiceId);
  const slotCost = grantChoice?.slotCost ?? 1;
  const tags = mergeTags(deriveTagsFromEventCategory(def?.category), ['administrative']);
  return {
    ...baseDefaults(),
    family: 'petition',
    id: data.eventId,
    title: data.title,
    body: data.body,
    slotCost,
    effortCost: effortFromSlotCost(slotCost),
    rarity: rarityFromSeverity(def?.severity),
    tags,
    effects: data.grantEffects,
    signals: data.grantSignals,
    context: data.context ?? [],
    payload: data,
  };
}

export function notificationToCard(
  data: NotificationCardData,
  def?: EventDefinition,
): CardOfFamily<'notification'> {
  const tags = mergeTags(deriveTagsFromEventCategory(def?.category));
  return {
    ...baseDefaults(),
    family: 'notification',
    id: data.eventId,
    title: data.title,
    body: data.body,
    slotCost: 0,
    effortCost: 'Light',
    rarity: 'Common',
    tags,
    effects: [],
    payload: data,
  };
}

export function decreeToCard(data: DecreeCardData): CardOfFamily<'decree'> {
  const category = data.category as DecreeCategory | undefined;
  const tags = mergeTags(deriveTagsFromDecreeCategory(category));
  return {
    ...baseDefaults(),
    family: 'decree',
    id: data.decreeId,
    title: data.title,
    body: data.body,
    slotCost: data.slotCost,
    effortCost: effortFromSlotCost(data.slotCost),
    rarity: data.isHighImpact ? 'Rare' : 'Common',
    tags,
    effects: data.effects,
    context: data.context ?? [],
    payload: data,
  };
}

export function negotiationToCard(data: NegotiationCard): CardOfFamily<'negotiation'> {
  const slotCost = Math.max(1, data.terms.length);
  const termEffects = data.terms.flatMap((t) => t.effectHints);
  return {
    ...baseDefaults(),
    family: 'negotiation',
    id: data.eventCard.id,
    title: data.eventCard.title,
    body: data.eventCard.body,
    slotCost,
    effortCost: effortFromSlotCost(slotCost),
    rarity: 'Uncommon',
    tags: ['diplomatic'],
    effects: termEffects.length > 0 ? termEffects : data.eventCard.effects,
    payload: data,
  };
}

export function assessmentToCard(
  data: AssessmentPhaseData,
  def?: EventDefinition,
): CardOfFamily<'assessment'> {
  const inner = data.crisisData;
  const maxSlotCost = inner.responses.reduce(
    (max, r) => (r.slotCost > max ? r.slotCost : max),
    0,
  );
  const tags = mergeTags(deriveTagsFromEventCategory(def?.category), ['espionage']);
  return {
    ...baseDefaults(),
    family: 'assessment',
    id: inner.crisisCard.eventId,
    title: inner.crisisCard.title,
    body: inner.crisisCard.body,
    slotCost: maxSlotCost,
    effortCost: effortFromSlotCost(maxSlotCost),
    rarity: rarityFromSeverity(def?.severity),
    tags,
    effects: inner.crisisCard.effects,
    context: inner.crisisCard.context ?? [],
    payload: data,
  };
}

export function overtureToCard(
  data: PetitionCardData,
  def?: EventDefinition,
): CardOfFamily<'overture'> {
  const tags = mergeTags(deriveTagsFromEventCategory(def?.category), ['diplomatic']);
  return {
    ...baseDefaults(),
    family: 'overture',
    id: data.eventId,
    title: data.title,
    body: data.body,
    slotCost: 1,
    effortCost: 'Light',
    rarity: 'Uncommon',
    tags,
    effects: data.grantEffects,
    signals: data.grantSignals,
    context: data.context ?? [],
    payload: data,
  };
}

// ============================================================
// Exhaustiveness anchor
// ============================================================

/** Type-level check that the Card union matches the adapter coverage.
 *  Unused at runtime — will error at compile time if a family is added
 *  without a corresponding adapter. */
export type _AdapterCoverageCheck = {
  crisis: ReturnType<typeof crisisToCard>;
  petition: ReturnType<typeof petitionToCard>;
  notification: ReturnType<typeof notificationToCard>;
  decree: ReturnType<typeof decreeToCard>;
  negotiation: ReturnType<typeof negotiationToCard>;
  assessment: ReturnType<typeof assessmentToCard>;
  overture: ReturnType<typeof overtureToCard>;
} extends Record<string, Card>
  ? true
  : false;
