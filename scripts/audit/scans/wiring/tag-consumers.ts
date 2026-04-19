// Wiring scan §13.13 — informational scan of consequence tags that are
// produced but never read by any trigger or storyline. These are technically
// dead-end consequences: the player's decision recorded a tag that no future
// card reacts to.
//
// Severity is POLISH (default-suppressed) because many tags are recorded
// purely for chronicle/codex narration, not for downstream trigger gating.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.tag-consumers';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const [tag, producers] of corpus.tagProducers) {
    if (corpus.tagReaders.has(tag)) continue;
    for (const p of producers) {
      out.push({
        severity: 'POLISH',
        family: familyOf(corpus, p.id),
        scanId: SCAN_ID,
        code: 'TAG_NEVER_READ',
        cardId: p.id,
        choiceId: p.choiceId,
        filePath: fileOf(corpus, p.id),
        message: `Consequence tag '${tag}' produced by ${p.id}${p.choiceId ? `:${p.choiceId}` : ''} is never read by any trigger.`,
        details: { tag, producerKind: p.kind },
      });
    }
  }

  return out;
};
