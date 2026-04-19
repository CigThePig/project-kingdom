// Wiring scan — every choiceId on every event has a matching button label in
// EVENT_TEXT.choices. This is split out from missing-text so authors can see
// the per-choice gap distinct from "no entry exists at all".

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.choice-label-coverage';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    const text = corpus.text.events[ev.id];
    if (!text) continue; // covered by wiring.missing-text
    for (const c of ev.choices) {
      if (!text.choices || !text.choices[c.choiceId]) {
        out.push({
          severity: 'CRITICAL',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Choice ${c.choiceId} on ${ev.id} has no button label.`,
        });
      }
    }
  }

  for (const we of corpus.worldEvents.defs) {
    const text = corpus.worldEvents.text[we.id];
    if (!text) continue;
    for (const c of we.choices) {
      if (!text.choices || !text.choices[c.id]) {
        out.push({
          severity: 'CRITICAL',
          family: 'world',
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: we.id,
          choiceId: c.id,
          filePath: fileOf(corpus, we.id),
          message: `World event choice ${c.id} on ${we.id} has no button label.`,
        });
      }
    }
  }

  return out;
};
