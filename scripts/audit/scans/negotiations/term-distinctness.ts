// Phase 5B — Negotiation term distinctness (CARD_AUDIT_RULES §5.1 / §9.5).
//
// Each term in a negotiation should produce a distinct mechanical effect.
// Two terms whose runtime fingerprints touch the same state paths with the
// same touch-class vocabulary are clones. This scan walks every pair of
// non-reject terms within a negotiation; when their sorted touch sets and
// classes match, emits TERM_CLONE.

import type { Corpus, Finding, Scan } from '../../types';
import type { AuditDecisionPath } from '../../ir';

export const SCAN_ID = 'negotiations.term-distinctness';

function signature(path: AuditDecisionPath): string | null {
  const fp = path.runtimeFingerprint;
  if (!fp || fp.noOp) return null;
  const touches = [...fp.touches].sort().join('|');
  const classes = [...fp.classes].sort().join('|');
  return `${classes}::${touches}`;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'negotiation') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;
    const rejectChoiceId = card.metadata?.rejectChoiceId as string | undefined;
    const termPaths = card.choices.filter((c) => c.choiceId !== rejectChoiceId);

    const sigs = new Map<string, AuditDecisionPath[]>();
    for (const p of termPaths) {
      const sig = signature(p);
      if (!sig) continue;
      const list = sigs.get(sig);
      if (list) list.push(p);
      else sigs.set(sig, [p]);
    }

    for (const [sig, group] of sigs) {
      if (group.length < 2) continue;
      const ids = group.map((g) => g.choiceId);
      // Emit one finding per cloned pair (first vs each subsequent peer).
      for (let i = 1; i < group.length; i++) {
        out.push({
          severity: 'MAJOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'TERM_CLONE',
          cardId: card.id,
          choiceId: group[i].choiceId,
          filePath: card.filePath,
          message: `${card.id}: terms ${group[0].choiceId} and ${group[i].choiceId} produce identical runtime fingerprints — mechanically indistinguishable, fails differentiation rule.`,
          confidence: 'RUNTIME_GROUNDED',
          details: {
            clonedWith: group[0].choiceId,
            siblingIds: ids,
            sharedSignature: sig,
          },
        });
      }
    }
  }

  return out;
};
