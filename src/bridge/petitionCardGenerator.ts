// Bridge Layer — Petition Card Generator
// Translates petition-severity ActiveEvents into PetitionCardData[] for the UI.

import type { ActiveEvent } from '../engine/types';
import type { EffectHint } from '../ui/types';
import { EVENT_TEXT } from '../data/text/events';
import { EVENT_POOL } from '../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { mechDeltaToEffectHints } from './crisisCardGenerator';

// ============================================================
// Card data type
// ============================================================

export interface PetitionChoiceData {
  choiceId: string;
  title: string;
  effects: EffectHint[];
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
  /** All authored choices, preserving middle options for 3+ choice events. */
  allChoices: PetitionChoiceData[];
}

// ============================================================
// Generator
// ============================================================

export function generatePetitionCards(events: ActiveEvent[]): PetitionCardData[] {
  const cards: PetitionCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    const choiceEffects = EVENT_CHOICE_EFFECTS[event.definitionId] ?? {};

    // Single-choice (notification-style) events: present as acknowledge-only petition.
    if (def.choices.length === 1) {
      const onlyChoice = def.choices[0];
      const onlyEffects = mechDeltaToEffectHints(choiceEffects[onlyChoice.choiceId] ?? {});
      cards.push({
        eventId: event.id,
        definitionId: event.definitionId,
        title: textEntry.title,
        body: textEntry.body,
        grantChoiceId: onlyChoice.choiceId,
        denyChoiceId: onlyChoice.choiceId,
        grantEffects: onlyEffects,
        denyEffects: onlyEffects,
        allChoices: [{ choiceId: onlyChoice.choiceId, title: textEntry.choices[onlyChoice.choiceId] ?? onlyChoice.choiceId, effects: onlyEffects }],
      });
      continue;
    }
    const grantChoice = def.choices[0];
    const denyChoice = def.choices[def.choices.length - 1];

    const allChoices: PetitionChoiceData[] = def.choices.map((c) => ({
      choiceId: c.choiceId,
      title: textEntry.choices[c.choiceId] ?? c.choiceId,
      effects: mechDeltaToEffectHints(choiceEffects[c.choiceId] ?? {}),
    }));

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: textEntry.title,
      body: textEntry.body,
      grantChoiceId: grantChoice.choiceId,
      denyChoiceId: denyChoice.choiceId,
      grantEffects: mechDeltaToEffectHints(choiceEffects[grantChoice.choiceId] ?? {}),
      denyEffects: mechDeltaToEffectHints(choiceEffects[denyChoice.choiceId] ?? {}),
      allChoices,
    });
  }

  return cards;
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

export function generateNotificationCards(events: ActiveEvent[]): NotificationCardData[] {
  const cards: NotificationCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: textEntry.title,
      body: textEntry.body,
      acknowledgeChoiceId: def.choices[0].choiceId,
    });
  }

  return cards;
}
