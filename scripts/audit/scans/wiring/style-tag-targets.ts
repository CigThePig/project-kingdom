// Wiring scan §13.8 — every key in EVENT_CHOICE_STYLE_TAGS targets a real
// event choice. Orphan style tags are dead weight and signal a renamed/removed
// choice that left a tag behind.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.style-tag-targets';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const eventId of Object.keys(corpus.styleTags)) {
    const ev = corpus.eventById.get(eventId);
    if (!ev) {
      out.push({
        severity: 'MAJOR',
        family: 'unknown',
        scanId: SCAN_ID,
        code: 'STYLE_TAG_ORPHAN_EVENT',
        cardId: eventId,
        filePath: fileOf(corpus, eventId),
        message: `EVENT_CHOICE_STYLE_TAGS contains entry for unknown event ${eventId}.`,
      });
      continue;
    }
    const validChoiceIds = new Set(ev.choices.map((c) => c.choiceId));
    for (const choiceId of Object.keys(corpus.styleTags[eventId] ?? {})) {
      if (!validChoiceIds.has(choiceId)) {
        out.push({
          severity: 'MAJOR',
          family: familyOf(corpus, eventId),
          scanId: SCAN_ID,
          code: 'STYLE_TAG_ORPHAN_CHOICE',
          cardId: eventId,
          choiceId,
          filePath: fileOf(corpus, eventId),
          message: `EVENT_CHOICE_STYLE_TAGS[${eventId}][${choiceId}] targets an unknown choice.`,
        });
      }
    }
  }

  return out;
};
