// Phase 5B — Negotiations pressure-wiring parity.
//
// Same shape as assessments/pressure-wiring: NEGOTIATION_EFFECTS may declare
// narrativePressure deltas, which flow through applyMechanicalEffectDelta.
// Runtime parity: a declared delta should surface as a narrativePressure
// touch; an undeclared touch points at an engine writer the scanner isn't
// modelling. Both are ENGINE_MISMATCH class.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'negotiations.pressure-wiring';

interface NarrativePressureDelta {
  narrativePressure?: Record<string, number>;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'negotiation') continue;
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
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'NEGOTIATION_PRESSURE_DEAD',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: declared narrativePressure (${declaredAxes.join(', ')}) but runtime diff shows none — delta never reaches state.`,
          confidence: 'ENGINE_MISMATCH',
          details: { declaredAxes, touches: fp.touches },
        });
      }

      if (declaredAxes.length === 0 && diffTouched) {
        out.push({
          severity: 'MINOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'NEGOTIATION_PRESSURE_UNDECLARED',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: runtime diff touched narrativePressure but declared effect does not reference it — scanner model and runtime disagree.`,
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
