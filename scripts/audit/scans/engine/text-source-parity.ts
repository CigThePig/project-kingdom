// Engine parity — every AuditCard's `textSourceKind` on each decision path
// should either name a family-appropriate table (per `declaredTextSourceKind`)
// or be `'none'` when the card has no authored text at all.
//
// The scan is a scanner-model check, not a content check: if an adapter
// thinks a hand card's text comes from `event-text`, that's a bug in the
// adapter. Flag as ENGINE_MISMATCH so the finding stays out of the
// card-cleanup backlog.

import { declaredTextSourceKind } from '../../text-sources';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.text-source-parity';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    const expected = declaredTextSourceKind(card.family);
    for (const choice of card.choices) {
      if (choice.textSourceKind === 'none') continue;
      if (choice.textSourceKind === expected) continue;
      // `overture` has two runtime paths — one through OVERTURE_TEXT, one
      // through EVENT_TEXT — so either is acceptable there.
      if (card.family === 'overture' && choice.textSourceKind === 'event-text') {
        continue;
      }
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'TEXT_SOURCE_MISMATCH',
        cardId: card.id,
        choiceId: choice.choiceId,
        filePath: card.filePath,
        message: `Family '${card.family}' expects textSourceKind='${expected}' but the adapter produced '${choice.textSourceKind}' — scanner-side classification is wrong.`,
        confidence: 'ENGINE_MISMATCH',
        details: { expected, actual: choice.textSourceKind },
      });
    }
  }

  return out;
};
