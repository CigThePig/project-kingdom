// Engine parity — a card's declared RuntimePathKind must match what the
// runtime harness actually dispatches to. The scan only runs when the
// loader opted into `runtimeFingerprint: true` (otherwise every path
// would look unsupported). We emit ENGINE_MISMATCH when:
//
//   1. Declared runtime path is harness-supported, but every fixture
//      returned unsupported (scanner expected to run it, harness refuses).
//   2. Declared runtime path is already `'unknown'` — drift marker.
//
// Cards whose runtime path the harness doesn't support yet (events,
// decrees, overtures, negotiations, assessments, world events) are a
// coverage gap, not an engine mismatch — so those stay silent until the
// harness grows support in a later milestone.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.runtime-path-parity';

const HARNESS_SUPPORTED: ReadonlySet<string> = new Set(['inline-hand-apply']);

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.runtimePath === 'unknown') {
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'RUNTIME_PATH_UNKNOWN',
        cardId: card.id,
        filePath: card.filePath,
        message: `Family '${card.family}' is mapped to runtimePath='unknown' — the scanner has no model of how this card resolves at runtime.`,
        confidence: 'ENGINE_MISMATCH',
      });
      continue;
    }
    if (!HARNESS_SUPPORTED.has(card.runtimePath)) {
      // Harness doesn't support it yet — coverage gap, not parity error.
      continue;
    }
    const haveFingerprint = card.choices.some((c) => c.runtimeFingerprint);
    if (!haveFingerprint) {
      // Loader flag may simply be off for this run; only flag when we also
      // see that runtimeDiffCoverage is false.
      if (!card.coverage.runtimeDiffCoverage) continue;
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'RUNTIME_PATH_HARNESS_REFUSED',
        cardId: card.id,
        filePath: card.filePath,
        message: `Card declares runtimePath='${card.runtimePath}' which should be harness-supported, but no fixture produced a runtime fingerprint.`,
        confidence: 'ENGINE_MISMATCH',
      });
    }
  }

  return out;
};
