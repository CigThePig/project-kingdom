// Phase 5 — Court Hand engine system.
//
// Pure functions over a `CourtHand` value. No React, no I/O. The hand holds
// banked cards between turns; each slot tracks how many turns remain before
// the card expires and is silently discarded.

import type { Card } from '../cards/types';
import type { CourtHand, CourtHandSlot } from '../types';

export const DEFAULT_COURT_HAND_CAPACITY = 5;

export function createInitialCourtHand(): CourtHand {
  return { slots: [], capacity: DEFAULT_COURT_HAND_CAPACITY };
}

export function canAddToHand(hand: CourtHand): boolean {
  return hand.slots.length < hand.capacity;
}

export function addCardToHand(hand: CourtHand, card: Card, currentTurn: number): CourtHand {
  if (!canAddToHand(hand)) return hand;
  const turnsUntilExpiry = card.expiresAfterTurns ?? 10;
  const slot: CourtHandSlot = {
    card,
    turnAdded: currentTurn,
    turnsUntilExpiry,
  };
  return { ...hand, slots: [...hand.slots, slot] };
}

export function removeCardFromHand(hand: CourtHand, cardId: string): CourtHand {
  return { ...hand, slots: hand.slots.filter((s) => s.card.id !== cardId) };
}

export function tickHandExpiry(hand: CourtHand): { hand: CourtHand; expiredCards: Card[] } {
  const expiredCards: Card[] = [];
  const remaining: CourtHandSlot[] = [];
  for (const slot of hand.slots) {
    const next = slot.turnsUntilExpiry - 1;
    if (next <= 0) {
      expiredCards.push(slot.card);
    } else {
      remaining.push({ ...slot, turnsUntilExpiry: next });
    }
  }
  return { hand: { ...hand, slots: remaining }, expiredCards };
}
