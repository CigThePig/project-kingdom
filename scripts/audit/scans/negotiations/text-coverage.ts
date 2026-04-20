// Phase 5B — Negotiations text coverage.
//
// NEGOTIATION_TEXT has a different shape from EVENT_TEXT: a top-level title
// + body + contextLabel, plus a `terms` map keyed by termId (each with
// title + description), plus a rejectLabel. This scan asserts that every
// term in NEGOTIATION_POOL carries both a title and a description.

import type { Corpus, Finding, Scan } from '../../types';
import { getTextEntryForFamily } from '../../text-sources';

export const SCAN_ID = 'negotiations.text-coverage';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'negotiation') continue;
    const text = getTextEntryForFamily(corpus, 'negotiation', card.id);

    if (!text || !text.title || !text.body) {
      out.push({
        severity: 'MAJOR',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'NEGOTIATION_TEXT_MISSING',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: NEGOTIATION_TEXT entry is missing title or body.`,
        confidence: 'DETERMINISTIC',
        details: { hasTitle: !!text?.title, hasBody: !!text?.body },
      });
      continue;
    }

    const rejectChoiceId = card.metadata?.rejectChoiceId as string | undefined;

    for (const path of card.choices) {
      if (rejectChoiceId && path.choiceId === rejectChoiceId) continue; // reject text is a separate scan
      const label = text.choiceLabels[path.choiceId];
      const description = text.termDescriptions?.[path.choiceId];

      if (!label) {
        out.push({
          severity: 'MINOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'NEGOTIATION_TERM_TITLE_MISSING',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: term title missing from NEGOTIATION_TEXT.terms.`,
          confidence: 'DETERMINISTIC',
        });
      }
      if (!description) {
        out.push({
          severity: 'MINOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'NEGOTIATION_TERM_DESCRIPTION_MISSING',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: term description missing from NEGOTIATION_TEXT.terms — term renders without player-facing context.`,
          confidence: 'DETERMINISTIC',
        });
      }
    }
  }

  return out;
};
