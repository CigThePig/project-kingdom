// Wiring scan §13.12 — every consequence tag read by a trigger
// (`consequence_tag_present` / `consequence_tag_absent`) must be produced by
// some choice somewhere in the corpus. A dead gate (read with no producer) is
// a CRITICAL wiring error: the gate can never open / always passes the absence
// check, silently bricking the card it guards.
//
// Phase 6 upgrade: cross-check the writer/reader AST index before trusting
// the scanner's tag-producer model. If the AST shows zero
// persistentConsequences write sites, the producer map itself is suspect and
// every "dead gate" finding would be noise — so we suppress them and emit a
// single ENGINE_MISMATCH instead, pointing at the engine file whose write
// sites the scanner expected.

import { getWriterReaderIndex } from '../../ast/runtime-writer-reader-index';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.tag-producers';

const APPLY_EFFECTS_PATH = 'src/engine/resolution/apply-action-effects.ts';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const index = safeGetWriterReaderIndex();
  if (index && index.consequenceWriteSites.length === 0) {
    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'NO_CONSEQUENCE_WRITERS_FOUND',
      cardId: 'apply-action-effects:persistentConsequences',
      filePath: APPLY_EFFECTS_PATH,
      message: 'AST writer/reader index found zero persistentConsequences write sites — the tag-producer model can\'t be trusted. Suppressing dead-gate findings until the index sees the engine\'s write sites again.',
      confidence: 'ENGINE_MISMATCH',
    });
    return out;
  }

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
        confidence: 'DETERMINISTIC',
        details: { tag, where: r.where },
      });
    }
  }

  return out;
};

function safeGetWriterReaderIndex(): ReturnType<typeof getWriterReaderIndex> | null {
  try {
    return getWriterReaderIndex();
  } catch {
    // If ts-morph fails to load the project (tsconfig missing, etc.) we
    // don't want to block the dead-gate checks — they still provide value
    // without the AST cross-check.
    return null;
  }
}
