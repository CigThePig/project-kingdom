// Phase 5E — Decree high-impact depth (CARD_AUDIT_RULES §9.1).
//
// Defining-tier / isHighImpact decrees must do real structural work:
// establish a kingdom feature, change policy, start a construction project,
// or shift a region posture. A high-impact decree whose runtime diff only
// moves satisfaction sliders and treasury is a labelling mistake — the
// decree oversells its impact.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'decrees.high-impact-depth';

const HIGH_IMPACT_PATHS = [
  'policies',
  'activeKingdomFeatures',
  'constructionProjects',
  'activeInitiative',
  'religiousOrders',
  'faithCulture.religiousOrders',
];

function touchesHighImpact(touches: readonly string[]): boolean {
  for (const t of touches) {
    for (const sig of HIGH_IMPACT_PATHS) {
      if (t.startsWith(sig) || t.includes(sig)) return true;
    }
    // Region posture is nested: regions[i].posture
    if (/^regions\[\d+\]\.posture/.test(t)) return true;
  }
  return false;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'decree') continue;
    if (!card.metadata?.isHighImpact) continue;
    if (!card.coverage.runtimeDiffCoverage) continue;

    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp || fp.noOp) continue;
      if (touchesHighImpact(fp.touches)) continue;

      out.push({
        severity: 'MAJOR',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'HIGH_IMPACT_SHALLOW',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: isHighImpact decree but runtime diff shows no policy/feature/construction/posture touch — the "high impact" label does not match the mechanical footprint.`,
        confidence: 'RUNTIME_GROUNDED',
        details: {
          touches: fp.touches,
          expectedTouchSubstrings: HIGH_IMPACT_PATHS,
        },
      });
    }
  }

  return out;
};
