// Phase 5A — Assessments neighbor-placeholder parity (CARD_AUDIT_RULES §9.4).
//
// Assessment effects may declare `diplomacyDeltas: { __NEIGHBOR__: n }`; at
// runtime, directEffectApplier.resolveNeighborPlaceholders substitutes the
// target neighbor id. If runtime diff shows no `diplomacy.neighbors` touch,
// the placeholder failed to resolve — either the fixture can't supply a
// neighbor or the declared delta is zero.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'assessments.neighbor-resolution-parity';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'assessment') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;

    for (const path of card.choices) {
      const declared = path.declaredEffects as
        | { diplomacyDeltas?: Record<string, number> }
        | null;
      if (!declared?.diplomacyDeltas) continue;
      const usesPlaceholder = Object.keys(declared.diplomacyDeltas).includes(
        '__NEIGHBOR__',
      );
      if (!usesPlaceholder) continue;

      const fp = path.runtimeFingerprint;
      if (!fp) continue;

      const touchedNeighbor = fp.touches.some(
        (t) => t.startsWith('diplomacy.neighbors') || t.includes('relationshipScore'),
      );
      if (touchedNeighbor) continue;

      out.push({
        severity: 'MAJOR',
        family: 'assessment',
        scanId: SCAN_ID,
        code: 'ASSESSMENT_NEIGHBOR_UNRESOLVED',
        cardId: card.id,
        choiceId: path.choiceId,
        filePath: card.filePath,
        message: `${card.id}.${path.choiceId}: declared __NEIGHBOR__ diplomacyDelta but runtime diff shows no diplomacy.neighbors touch — the placeholder never materialized.`,
        confidence: 'RUNTIME_GROUNDED',
        details: {
          declaredDiplomacyDeltas: declared.diplomacyDeltas,
          touches: fp.touches,
        },
      });
    }
  }

  return out;
};
