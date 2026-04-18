// Bridge Layer — Petition Card Generator
// Translates petition-severity ActiveEvents into PetitionCardData[] for the UI.

import type { ActiveEvent, GameState } from '../engine/types';
import type { EffectHint, ContextLine, SignalTag } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { petitionToCard, notificationToCard } from '../engine/cards/adapters';
import { EVENT_TEXT } from '../data/text/events';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { getNeighborDisplayName } from './nameResolver';
import { NEIGHBOR_LABELS } from '../data/text/labels';
import { extractEventContext } from './contextExtractor';
import { extractChoiceSignals } from './signalExtractor';

// ============================================================
// Card data type
// ============================================================

export interface PetitionChoiceData {
  choiceId: string;
  title: string;
  effects: EffectHint[];
  signals: SignalTag[];
}

export interface PetitionCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  grantChoiceId: string;
  denyChoiceId: string;
  grantEffects: EffectHint[];
  denyEffects: EffectHint[];
  grantSignals: SignalTag[];
  denySignals: SignalTag[];
  /** All authored choices, preserving middle options for 3+ choice events. */
  allChoices: PetitionChoiceData[];
  context?: ContextLine[];
}

// ============================================================
// Neighbor substitution helper
// ============================================================

function substituteNeighbor(text: string, event: ActiveEvent, gameState?: GameState): string {
  if (!event.affectedNeighborId) return text;
  const name = gameState
    ? getNeighborDisplayName(event.affectedNeighborId, gameState)
    : (NEIGHBOR_LABELS[event.affectedNeighborId] ?? event.affectedNeighborId);
  return text.replace(/\{neighbor\}/g, name);
}

// ============================================================
// Generator
// ============================================================

export function generatePetitionCards(events: ActiveEvent[], gameState?: GameState): PetitionCardData[] {
  // Dev assertion: notification events should use generateNotificationCards(), not this function.
  if (import.meta.env.DEV) {
    for (const event of events) {
      const def = EVENT_POOL.find((e) => e.id === event.definitionId)
        ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);
      if (def?.classification === 'notification') {
        console.warn(
          `[petitionCardGenerator] Notification event "${event.definitionId}" was passed to generatePetitionCards(). ` +
          `Route it through generateNotificationCards() instead.`,
        );
      }
    }
  }

  const cards: PetitionCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    const choiceEffects = EVENT_CHOICE_EFFECTS[event.definitionId] ?? {};
    const context = gameState ? extractEventContext(gameState, event) : undefined;
    const contextLines = context?.length ? context : undefined;

    // Single-choice (notification-style) events: present as acknowledge-only petition.
    if (def.choices.length === 1) {
      const onlyChoice = def.choices[0];
      const onlyEffects = mechDeltaToEffectHints(choiceEffects[onlyChoice.choiceId] ?? {}, gameState);
      const onlySignals = extractChoiceSignals(event.definitionId, onlyChoice.choiceId);
      cards.push({
        eventId: event.id,
        definitionId: event.definitionId,
        title: substituteNeighbor(textEntry.title, event, gameState),
        body: substituteNeighbor(textEntry.body, event, gameState),
        grantChoiceId: onlyChoice.choiceId,
        denyChoiceId: onlyChoice.choiceId,
        grantEffects: onlyEffects,
        denyEffects: onlyEffects,
        grantSignals: onlySignals,
        denySignals: onlySignals,
        allChoices: [{ choiceId: onlyChoice.choiceId, title: textEntry.choices[onlyChoice.choiceId] ?? onlyChoice.choiceId, effects: onlyEffects, signals: onlySignals }],
        context: contextLines,
      });
      continue;
    }
    const grantChoice = def.choices[0];
    const denyChoice = def.choices[def.choices.length - 1];

    const allChoices: PetitionChoiceData[] = def.choices.map((c) => ({
      choiceId: c.choiceId,
      title: textEntry.choices[c.choiceId] ?? c.choiceId,
      effects: mechDeltaToEffectHints(choiceEffects[c.choiceId] ?? {}, gameState),
      signals: extractChoiceSignals(event.definitionId, c.choiceId),
    }));

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: substituteNeighbor(textEntry.title, event, gameState),
      body: substituteNeighbor(textEntry.body, event, gameState),
      grantChoiceId: grantChoice.choiceId,
      denyChoiceId: denyChoice.choiceId,
      grantEffects: mechDeltaToEffectHints(choiceEffects[grantChoice.choiceId] ?? {}, gameState),
      denyEffects: mechDeltaToEffectHints(choiceEffects[denyChoice.choiceId] ?? {}, gameState),
      grantSignals: extractChoiceSignals(event.definitionId, grantChoice.choiceId),
      denySignals: extractChoiceSignals(event.definitionId, denyChoice.choiceId),
      allChoices,
      context: contextLines,
    });
  }

  return cards;
}

/** Phase 4 — lift each petition into a unified `Card<'petition'>`. */
export function generatePetitionCardsAsCards(
  events: ActiveEvent[],
  gameState?: GameState,
): CardOfFamily<'petition'>[] {
  return generatePetitionCards(events, gameState).map((data) => {
    const def = EVENT_POOL.find((e) => e.id === data.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === data.definitionId);
    return petitionToCard(data, def);
  });
}

// ============================================================
// Notification Card Data
// ============================================================

export interface NotificationCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  acknowledgeChoiceId: string;
}

export function generateNotificationCards(
  events: ActiveEvent[],
  gameState?: GameState,
): NotificationCardData[] {
  const cards: NotificationCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: substituteNeighbor(textEntry.title, event, gameState),
      body: substituteNeighbor(textEntry.body, event, gameState),
      acknowledgeChoiceId: def.choices[0].choiceId,
    });
  }

  return cards;
}

/** Phase 4 — lift each notification into a unified `Card<'notification'>`. */
export function generateNotificationCardsAsCards(
  events: ActiveEvent[],
  gameState?: GameState,
): CardOfFamily<'notification'>[] {
  return generateNotificationCards(events, gameState).map((data) => {
    const def = EVENT_POOL.find((e) => e.id === data.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === data.definitionId);
    return notificationToCard(data, def);
  });
}
