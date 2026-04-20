// Wiring scan §13.13 — informational scan of consequence tags that are
// produced but never read by any trigger or storyline. These are technically
// dead-end consequences: the player's decision recorded a tag that no future
// card reacts to.
//
// Severity is POLISH (default-suppressed) because many tags are recorded
// purely for chronicle/codex narration, not for downstream trigger gating.
//
// Phase 6 upgrade: cross-check the writer/reader AST index before trusting
// the scanner's tag-producer model. If the AST shows zero
// persistentConsequences write sites the producer map is suspect and every
// "never read" finding would be noise — suppress them and emit a single
// POLISH ENGINE_MISMATCH (mirroring engine.consequence-write-parity, which
// owns the deeper "the engine stopped writing tags" diagnosis).

import { getWriterReaderIndex } from '../../ast/runtime-writer-reader-index';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.tag-consumers';

const APPLY_EFFECTS_PATH = 'src/engine/resolution/apply-action-effects.ts';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const index = safeGetWriterReaderIndex();
  if (index && index.consequenceWriteSites.length === 0) {
    out.push({
      severity: 'POLISH',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'NO_CONSEQUENCE_WRITERS_FOUND',
      cardId: 'apply-action-effects:persistentConsequences',
      filePath: APPLY_EFFECTS_PATH,
      message: 'AST writer/reader index found zero persistentConsequences write sites — the tag-producer model can\'t be trusted. Suppressing never-read findings until the index sees the engine\'s write sites again.',
      confidence: 'ENGINE_MISMATCH',
    });
    return out;
  }

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
        confidence: 'DETERMINISTIC',
        details: { tag, producerKind: p.kind },
      });
    }
  }

  return out;
};

function safeGetWriterReaderIndex(): ReturnType<typeof getWriterReaderIndex> | null {
  try {
    return getWriterReaderIndex();
  } catch {
    return null;
  }
}
