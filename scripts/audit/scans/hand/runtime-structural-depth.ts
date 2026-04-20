// Hand-card scan §2 / §9.8 — Pattern A substance rule applied to hand cards.
// A hand card whose real runtime diff only nudges surface sliders
// (treasury, satisfaction, readiness) is structurally hollow. This mirrors
// the event-pool `substance/surface-only` scan but reads the real runtime
// fingerprint rather than table heuristics, so it catches cards that wire
// their effects through inline `apply` functions.
//
// "Structural" here means any touch-class beyond `surface` — structural,
// diplomatic, temporal, narrative, operations, region, policy, construction.
// A card that only touches `surface` paths (e.g. `treasury.balance`,
// `population.*SatDelta`) fails the rule.

import type { Corpus, Finding, Scan } from '../../types';
import { STRUCTURAL_TOUCH_CLASSES } from '../shared';

export const SCAN_ID = 'hand.runtime-structural-depth';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;
    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp) continue;
      if (fp.noOp) continue; // handled by no-op-apply scan
      if (fp.classes.some((c) => STRUCTURAL_TOUCH_CLASSES.has(c))) continue;

      out.push({
        severity: 'MAJOR',
        family: 'hand',
        scanId: SCAN_ID,
        code: 'HAND_SURFACE_ONLY',
        cardId: card.id,
        choiceId: path.choiceId,
        filePath: card.filePath,
        message: `${card.id}: runtime diff shows only surface touches (${fp.touches.join(', ')}) — the card pushes sliders with no structural side effect.`,
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
