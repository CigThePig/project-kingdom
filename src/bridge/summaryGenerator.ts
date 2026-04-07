// Bridge Layer — Summary Generator
// Generates narrative text and effect preview for the Summary phase.

import type { PhaseDecisions, EffectHint } from '../ui/types';
import type { CrisisPhaseData } from './crisisCardGenerator';
import type { PetitionCardData } from './petitionCardGenerator';
import type { RulingStyleState, StyleAxis } from '../engine/types';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { DECREE_EFFECTS } from '../data/decrees/effects';
import { checkThresholdCrossings, markThresholdsCrossed } from '../engine/systems/ruling-style';
import { LEGACY_TEXT } from '../data/text/legacy-text';

export interface LegacyCardData {
  title: string;
  body: string;
  axis: StyleAxis;
  threshold: number;
  effects: EffectHint[];
}

export interface SummaryData {
  narrative: string;
  effectPreview: EffectHint[];
  legacyCards: LegacyCardData[];
  /** Updated ruling style state with newly crossed thresholds marked. */
  updatedRulingStyle?: RulingStyleState;
}

export function generateSummaryData(
  decisions: PhaseDecisions,
  crisisData: CrisisPhaseData | null,
  petitionCards: PetitionCardData[],
  prevRulingStyle?: RulingStyleState,
  currentRulingStyle?: RulingStyleState,
): SummaryData {
  const parts: string[] = [];
  const allEffects: EffectHint[] = [];

  // Crisis
  if (decisions.crisisResponse && crisisData) {
    const chosen = crisisData.responses.find((r) => r.id === decisions.crisisResponse);
    if (chosen) {
      parts.push(`${crisisData.crisisCard.title} — you chose "${chosen.title}".`);
      allEffects.push(...chosen.effects);
    }
  } else if (crisisData) {
    parts.push('The crisis passed without a direct royal response.');
  }

  // Petitions
  const granted = decisions.petitionDecisions.filter((d) => d.granted).length;
  const denied = decisions.petitionDecisions.filter((d) => !d.granted).length;
  const total = granted + denied;
  if (total > 0) {
    parts.push(
      `You heard ${total} petition${total !== 1 ? 's' : ''}, granting ${granted} and denying ${denied}.`,
    );
    // Add effects for granted petitions
    for (const d of decisions.petitionDecisions) {
      const card = petitionCards.find((p) => p.eventId === d.cardId);
      if (card) {
        const choiceId = d.granted ? card.grantChoiceId : card.denyChoiceId;
        const delta = EVENT_CHOICE_EFFECTS[card.definitionId]?.[choiceId] ?? {};
        allEffects.push(...mechDeltaToEffectHints(delta));
      }
    }
  } else {
    parts.push('No petitions were brought before the throne.');
  }

  // Decrees
  const decreeCount = decisions.selectedDecrees.length;
  if (decreeCount > 0) {
    parts.push(
      `${decreeCount} royal decree${decreeCount !== 1 ? 's were' : ' was'} issued from the Royal Council.`,
    );
    for (const decreeId of decisions.selectedDecrees) {
      const delta = DECREE_EFFECTS[decreeId] ?? {};
      allEffects.push(...mechDeltaToEffectHints(delta));
    }
  } else {
    parts.push('The council adjourned without issuing decrees.');
  }

  parts.push('The kingdom endures. Your decisions ripple outward.');

  // Deduplicate effect hints — keep first occurrence per stat label prefix
  const seen = new Set<string>();
  const dedupedEffects: EffectHint[] = [];
  for (const hint of allEffects) {
    // Use the word before the number as the key (e.g. "Treasury" from "Treasury +50")
    const key = hint.label.replace(/[+-]\d+.*$/, '').trim();
    if (!seen.has(key)) {
      seen.add(key);
      dedupedEffects.push(hint);
    }
  }

  // Generate legacy cards from ruling style threshold crossings
  const legacyCards: LegacyCardData[] = [];
  let updatedRulingStyle: RulingStyleState | undefined;

  if (prevRulingStyle && currentRulingStyle) {
    const crossings = checkThresholdCrossings(prevRulingStyle, currentRulingStyle);
    for (const crossing of crossings) {
      const textKey = `${crossing.axis}_${crossing.direction}_${crossing.threshold}`;
      const text = LEGACY_TEXT[textKey as keyof typeof LEGACY_TEXT];
      if (text) {
        legacyCards.push({
          title: text.title,
          body: text.body,
          axis: crossing.axis,
          threshold: crossing.threshold,
          effects: [{ label: `${crossing.axis} ${crossing.direction === 'positive' ? '+' : '-'}${crossing.threshold}`, type: 'neutral' }],
        });
      }
    }
    if (crossings.length > 0) {
      updatedRulingStyle = markThresholdsCrossed(currentRulingStyle, crossings);
    }
  }

  return {
    narrative: parts.join(' '),
    effectPreview: dedupedEffects,
    legacyCards,
    updatedRulingStyle,
  };
}
