// Phase 5E — Decree handler presence and no-op detection.
//
// A decree in DECREE_POOL that has no entry in DECREE_EFFECT_REGISTRY is
// authored-but-dead: the button shows, the decree "enacts", but no effect
// runs. That is a CRITICAL finding — players can't tell the difference
// until they notice nothing changed.
//
// A decree that HAS a handler but whose runtime diff is empty is a
// MAJOR handler-no-op: the code ran but left state untouched (e.g. a
// handler that short-circuits on missing action parameters). Surface
// effects (treasury etc.) MUST appear in the diff if the handler applies
// a MechanicalEffectDelta, so a noOp diff is a real regression signal.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'decrees.handler-feature-parity';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'decree') continue;

    const hasHandler = card.metadata?.hasHandler === true;
    if (!hasHandler) {
      out.push({
        severity: 'CRITICAL',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'DECREE_NO_HANDLER',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: decree is in DECREE_POOL but has no DECREE_EFFECT_REGISTRY handler — enacting it runs no code.`,
        confidence: 'DETERMINISTIC',
      });
      continue;
    }

    if (!card.coverage.runtimeDiffCoverage) continue;
    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp) continue;
      // The decree enactment always records an IssuedDecree + persistent
      // consequence, so a noOp diff means even that bookkeeping didn't run
      // — almost certainly a handler that bails early.
      if (fp.noOp) {
        out.push({
          severity: 'MAJOR',
          family: 'decree',
          scanId: SCAN_ID,
          code: 'DECREE_HANDLER_NO_OP',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: handler ran but runtime diff is empty — the decree short-circuits on the mid-kingdom fixture.`,
          confidence: 'RUNTIME_GROUNDED',
          details: { fixtureId: fp.fixtureId },
        });
      }
    }
  }

  return out;
};
