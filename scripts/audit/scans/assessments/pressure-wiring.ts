// Phase 5A — Assessments pressure-wiring parity.
//
// ASSESSMENT_EFFECTS may declare narrativePressure deltas, but
// applyDirectEffects only forwards payloads through applyMechanicalEffectDelta.
// If the declared delta surfaces in runtime (narrativePressure.* touch), the
// wiring is live. If declared but absent from the diff, the declaration is
// dead paper; if the diff shows a pressure touch with no declared delta, the
// engine is writing pressure the scanner didn't account for.
//
// Both outcomes are ENGINE_MISMATCH — scanner-model drift, not card content.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'assessments.pressure-wiring';

interface NarrativePressureDelta {
  narrativePressure?: Record<string, number>;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'assessment') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;

    for (const path of card.choices) {
      const declared = path.declaredEffects as NarrativePressureDelta | null;
      const declaredAxes = declared?.narrativePressure
        ? Object.keys(declared.narrativePressure)
        : [];
      const fp = path.runtimeFingerprint;
      if (!fp) continue;

      const diffTouched = fp.touches.some((t) => t.startsWith('narrativePressure'));

      if (declaredAxes.length > 0 && !diffTouched) {
        out.push({
          severity: 'MAJOR',
          family: 'assessment',
          scanId: SCAN_ID,
          code: 'ASSESSMENT_PRESSURE_DEAD',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: declared narrativePressure (${declaredAxes.join(', ')}) but runtime diff shows no narrativePressure touch — the delta never reaches state.`,
          confidence: 'ENGINE_MISMATCH',
          details: { declaredAxes, touches: fp.touches },
        });
      }

      if (declaredAxes.length === 0 && diffTouched) {
        out.push({
          severity: 'MINOR',
          family: 'assessment',
          scanId: SCAN_ID,
          code: 'ASSESSMENT_PRESSURE_UNDECLARED',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: runtime diff touched narrativePressure but the declared effect does not reference it — scanner model and runtime disagree.`,
          confidence: 'ENGINE_MISMATCH',
          details: {
            pressureTouches: fp.touches.filter((t) => t.startsWith('narrativePressure')),
          },
        });
      }
    }
  }

  return out;
};
