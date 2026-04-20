// Phase 5C — Overtures agenda coverage.
//
// Overtures are keyed by RivalAgenda. Every agenda the rival simulation can
// adopt must have authored OVERTURE_TEXT (title + body + grantTitle +
// denyTitle); otherwise the overture generator returns null and the agenda
// silently fails to produce a card when its progress ripens.

import { RivalAgenda } from '../../../../src/engine/types';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'overtures.agenda-coverage';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  const text = corpus.overtures.text;

  for (const agenda of Object.values(RivalAgenda)) {
    const entry = text[agenda];
    const cardId = `overture:${agenda}`;
    if (!entry) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_AGENDA_MISSING',
        cardId,
        message: `overture:${agenda}: no OVERTURE_TEXT entry — the rival simulation can adopt this agenda but no overture will surface.`,
        confidence: 'DETERMINISTIC',
      });
      continue;
    }

    const missingFields: string[] = [];
    if (!entry.title) missingFields.push('title');
    if (!entry.body) missingFields.push('body');
    if (!entry.grantTitle) missingFields.push('grantTitle');
    if (!entry.denyTitle) missingFields.push('denyTitle');
    if (missingFields.length > 0) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_AGENDA_FIELDS_MISSING',
        cardId,
        message: `overture:${agenda}: OVERTURE_TEXT entry missing ${missingFields.join(', ')}.`,
        confidence: 'DETERMINISTIC',
        details: { missingFields },
      });
    }
  }

  return out;
};
