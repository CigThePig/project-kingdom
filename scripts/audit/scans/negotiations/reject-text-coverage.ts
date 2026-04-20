// Phase 5B — Negotiations reject-text coverage.
//
// Every negotiation has a distinct reject path. The rejectLabel lives at
// top level of NEGOTIATION_TEXT. Missing reject text = the deny button
// renders the raw choiceId; generic reject text ("Decline") strips
// negotiation narrative weight (CARD_AUDIT_RULES §9.5).

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'negotiations.reject-text-coverage';

const GENERIC_REJECT_LABELS = new Set(['decline', 'reject', 'refuse', 'no']);

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'negotiation') continue;
    const raw = corpus.negotiations.text[card.id];
    if (!raw) continue; // primary text scan handles this

    const rejectLabel = raw.rejectLabel;
    if (!rejectLabel || rejectLabel.trim().length === 0) {
      out.push({
        severity: 'MAJOR',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'REJECT_LABEL_MISSING',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: NEGOTIATION_TEXT.rejectLabel is missing — the reject button will render as the raw choice id.`,
        confidence: 'DETERMINISTIC',
      });
      continue;
    }

    if (GENERIC_REJECT_LABELS.has(rejectLabel.trim().toLowerCase())) {
      out.push({
        severity: 'MINOR',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'REJECT_LABEL_GENERIC',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: rejectLabel "${rejectLabel}" is generic — negotiations should frame the reject path with narrative weight.`,
        confidence: 'DETERMINISTIC',
        details: { rejectLabel },
      });
    }
  }

  return out;
};
