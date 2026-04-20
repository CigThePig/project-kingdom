// Phase 5A — Assessments substance rule (CARD_AUDIT_RULES §2 / §9.4).
//
// An assessment whose real runtime diff only nudges surface sliders
// (treasury, satisfaction, readiness) is structurally hollow. This mirrors
// the hand/runtime-structural-depth scan but reads the assessment's
// applyDirectEffects run, not a hand card's inline apply. Requires Phase 5
// runtime harness support for direct-effect-assessment.

import type { Corpus, Finding, Scan } from '../../types';
import { STRUCTURAL_TOUCH_CLASSES } from '../shared';

export const SCAN_ID = 'assessments.runtime-structural-depth';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'assessment') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;

    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp) continue;
      if (fp.noOp) continue; // a separate no-op scan would flag these
      if (fp.classes.some((c) => STRUCTURAL_TOUCH_CLASSES.has(c))) continue;

      out.push({
        severity: 'MAJOR',
        family: 'assessment',
        scanId: SCAN_ID,
        code: 'ASSESSMENT_SURFACE_ONLY',
        cardId: card.id,
        choiceId: path.choiceId,
        filePath: card.filePath,
        message: `${card.id}.${path.choiceId}: runtime diff only touches surface sliders (${fp.touches.join(', ')}) — assessments should leave a structural mark, not just a numeric nudge.`,
        confidence: 'RUNTIME_GROUNDED',
        details: {
          fixtureId: fp.fixtureId,
          touches: fp.touches,
          classes: fp.classes,
        },
      });
    }
  }

  return out;
};
