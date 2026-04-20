// Phase 5A — Assessments text coverage.
//
// Assessments live in ASSESSMENT_TEXT, a distinct table from EVENT_TEXT.
// Every card must carry a title, a body, and a label per `choiceId`. This
// scan is deterministic: the adapter has already routed the family through
// getTextEntryForFamily, so we simply assert that the normalized entry is
// complete for every decision path.

import type { Corpus, Finding, Scan } from '../../types';
import { getTextEntryForFamily } from '../../text-sources';

export const SCAN_ID = 'assessments.text-coverage';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'assessment') continue;
    const text = getTextEntryForFamily(corpus, 'assessment', card.id);

    if (!text || !text.title || !text.body) {
      out.push({
        severity: 'MAJOR',
        family: 'assessment',
        scanId: SCAN_ID,
        code: 'ASSESSMENT_TEXT_MISSING',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: ASSESSMENT_TEXT entry is missing title or body — player will see a blank card on render.`,
        confidence: 'DETERMINISTIC',
        details: { hasTitle: !!text?.title, hasBody: !!text?.body },
      });
      continue;
    }

    for (const path of card.choices) {
      const label = text.choiceLabels[path.choiceId];
      if (!label || label.length === 0) {
        out.push({
          severity: 'MINOR',
          family: 'assessment',
          scanId: SCAN_ID,
          code: 'ASSESSMENT_CHOICE_LABEL_MISSING',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: no ASSESSMENT_TEXT choice label — the button renders the raw choiceId.`,
          confidence: 'DETERMINISTIC',
        });
      }
    }
  }

  return out;
};
