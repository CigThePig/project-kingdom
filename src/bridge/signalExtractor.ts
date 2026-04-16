// Bridge Layer — Signal Extractor
// Extracts qualitative decision signals from event/decree choices:
// ruling-style axis nudges, follow-up likelihood, and persistent consequences.
// These signals tell the player "what shape this decision gives your reign"
// without revealing exact mechanics.

import { StyleAxis } from '../engine/types';
import type { EventDefinition } from '../engine/events/event-engine';
import type { SignalTag } from '../ui/types';
import { EVENT_CHOICE_STYLE_TAGS } from '../data/ruling-style/flavor-tags';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../data/events/index';

// ============================================================
// Axis direction → player-facing label
// ============================================================

const AXIS_POSITIVE_LABELS: Record<StyleAxis, string> = {
  [StyleAxis.Authority]: 'AUTHORITY \u2191',
  [StyleAxis.Economy]:   'MERCANTILE \u2191',
  [StyleAxis.Military]:  'MARTIAL \u2191',
  [StyleAxis.Faith]:     'THEOCRATIC \u2191',
};

const AXIS_NEGATIVE_LABELS: Record<StyleAxis, string> = {
  [StyleAxis.Authority]: 'PERMISSIVE \u2191',
  [StyleAxis.Economy]:   'POPULIST \u2191',
  [StyleAxis.Military]:  'PACIFIST \u2191',
  [StyleAxis.Faith]:     'SECULAR \u2191',
};

// ============================================================
// Main extractor
// ============================================================

/**
 * Extracts decision signal tags for a specific event choice.
 * Returns 2–3 glyph-weight tags indicating ruling-style nudge,
 * follow-up likelihood, and consequence shape.
 */
export function extractChoiceSignals(
  eventDefinitionId: string,
  choiceId: string,
): SignalTag[] {
  const signals: SignalTag[] = [];

  // 1. Ruling-style axis nudges
  const styleTags = EVENT_CHOICE_STYLE_TAGS[eventDefinitionId]?.[choiceId];
  if (styleTags) {
    for (const [axis, delta] of Object.entries(styleTags)) {
      if (delta === undefined || delta === 0) continue;
      const label = delta > 0
        ? AXIS_POSITIVE_LABELS[axis as StyleAxis]
        : AXIS_NEGATIVE_LABELS[axis as StyleAxis];
      if (label) {
        signals.push({ label, tone: 'style' });
      }
    }
  }

  // 2. Follow-up likelihood
  const def: EventDefinition | undefined = EVENT_POOL.find((e) => e.id === eventDefinitionId)
    ?? FOLLOW_UP_POOL.find((e) => e.id === eventDefinitionId);

  if (def?.followUpEvents) {
    const matchingFollowUps = def.followUpEvents.filter(
      (fu) => fu.triggerChoiceId === choiceId,
    );
    if (matchingFollowUps.length > 0) {
      const maxProb = Math.max(...matchingFollowUps.map((fu) => fu.probability));
      if (maxProb >= 0.7) {
        signals.push({ label: 'FOLLOW-UP LIKELY', tone: 'followup' });
      } else if (maxProb >= 0.3) {
        signals.push({ label: 'FOLLOW-UP POSSIBLE', tone: 'followup' });
      }
    }
  }

  // Cap at 3 signals to keep the strip compact
  return signals.slice(0, 3);
}
