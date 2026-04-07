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

export interface PetitionCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  grantChoiceId: string;
  denyChoiceId: string;
  grantEffects: EffectHint[];
  denyEffects: EffectHint[];
}

// ============================================================
// Generator
// ============================================================

export function generatePetitionCards(events: ActiveEvent[]): PetitionCardData[] {
  const cards: PetitionCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 2) continue;

    const choiceEffects = EVENT_CHOICE_EFFECTS[event.definitionId] ?? {};
    const grantChoice = def.choices[0];
    const denyChoice = def.choices[def.choices.length - 1];

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: textEntry.title,
      body: textEntry.body,
      grantChoiceId: grantChoice.choiceId,
      denyChoiceId: denyChoice.choiceId,
      grantEffects: mechDeltaToEffectHints(choiceEffects[grantChoice.choiceId] ?? {}),
      denyEffects: mechDeltaToEffectHints(choiceEffects[denyChoice.choiceId] ?? {}),
    });
  }

  return cards;
}
