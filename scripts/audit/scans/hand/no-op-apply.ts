// Hand-card scan §9.8 / §8 — `apply` functions that produce no state change
// in the runtime harness, or that declare an AST-level marker without a
// matching runtime touch.
//
// Tier A (CRITICAL): the runtime diff is empty AND no AST marker suggests
//   the apply should have done anything. Equivalent to "wired to an empty
//   effects dict" from §8.
//
// Tier B (MAJOR): the AST says a structural marker fired (temp modifier,
//   bond, pressure) but the runtime diff doesn't show a corresponding path
//   — the card claims to do X but only X-under-specific-state, which hides
//   a fragile branch from the player.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'hand.no-op-apply';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;
    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp) continue;
      const markers = path.declaredStructuralMarkers;
      const anyStructural =
        markers.touchesPersistentConsequences
        || markers.queuesTemporaryModifier
        || markers.appliesMechanicalDelta
        || markers.writesPressure
        || markers.touchesBond;

      if (fp.noOp) {
        if (!anyStructural) {
          out.push({
            severity: 'CRITICAL',
            family: 'hand',
            scanId: SCAN_ID,
            code: 'NO_OP_APPLY',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message: `${card.id}: apply returned an unchanged GameState in the harness and the AST found no structural markers — the card does nothing when played.`,
            confidence: 'RUNTIME_GROUNDED',
            details: { fixtureId: fp.fixtureId },
          });
        } else {
          out.push({
            severity: 'MAJOR',
            family: 'hand',
            scanId: SCAN_ID,
            code: 'CONDITIONAL_NO_OP',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message: `${card.id}: apply returned an unchanged GameState in the harness even though the AST shows structural activity — the effect depends on fixture state that the mid-kingdom fixture doesn't provide.`,
            confidence: 'RUNTIME_GROUNDED',
            details: { fixtureId: fp.fixtureId, markers },
          });
        }
        continue;
      }

      // Tier B: marker claims temp modifier but touches doesn't include it.
      if (
        markers.queuesTemporaryModifier
        && !fp.touches.some((p) => p.startsWith('activeTemporaryModifiers'))
      ) {
        out.push({
          severity: 'MAJOR',
          family: 'hand',
          scanId: SCAN_ID,
          code: 'CONDITIONAL_NO_OP',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: AST claims a temporary modifier is queued but the runtime diff doesn't show activeTemporaryModifiers changing — the enqueue path is unreachable under the harness fixture.`,
          confidence: 'RUNTIME_GROUNDED',
          details: { markerKind: 'queuesTemporaryModifier', touches: fp.touches },
        });
      }
    }
  }

  return out;
};
