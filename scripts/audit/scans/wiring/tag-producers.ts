// Wiring scan §13.12 — every consequence tag read by a trigger
// (`consequence_tag_present` / `consequence_tag_absent`) must be produced by
// some choice somewhere in the corpus. A dead gate (read with no producer) is
// a CRITICAL wiring error: the gate can never open / always passes the absence
// check, silently bricking the card it guards.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.tag-producers';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const [tag, readers] of corpus.tagReaders) {
    if (corpus.tagProducers.has(tag)) continue;
    for (const r of readers) {
      const family = familyOf(corpus, r.id);
      out.push({
        severity: 'CRITICAL',
        family,
        scanId: SCAN_ID,
        code: 'TAG_DEAD_GATE',
        cardId: r.id,
        filePath: fileOf(corpus, r.id),
        message: `${r.where} on ${r.id} reads consequence tag '${tag}' that no choice in the corpus produces.`,
        details: { tag, where: r.where },
      });
    }
  }

  return out;
};
