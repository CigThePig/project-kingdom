// Phase 5E — Decree preview parity.
//
// DecreeDefinition.effectPreview is the single string the player sees on the
// card before enacting. A preview that mentions "treasury" or "readiness"
// must be reflected in the runtime diff; otherwise the preview oversells the
// decree. Reuses PROMISE_KEYWORD_RULES from scans/shared.ts — the same
// lexicon text.promise-delivery uses.

import type { Corpus, Finding, Scan } from '../../types';
import { PROMISE_KEYWORD_RULES } from '../shared';

export const SCAN_ID = 'decrees.preview-parity';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'decree') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;
    // Decree adapter sets card.body = DecreeDefinition.effectPreview, the
    // UI-visible preview string the player reads on the card.
    const preview = card.body;
    if (!preview) continue;

    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp || fp.noOp) continue;

      for (const rule of PROMISE_KEYWORD_RULES) {
        if (!rule.keyword.test(preview)) continue;
        const satisfied = fp.touches.some((t) =>
          rule.requires.some((req) => t.includes(req)),
        );
        if (satisfied) continue;

        out.push({
          severity: 'MAJOR',
          family: 'decree',
          scanId: SCAN_ID,
          code: 'DECREE_PREVIEW_MISMATCH',
          cardId: card.id,
          filePath: card.filePath,
          message: `${card.id}: preview references "${rule.label}" but runtime diff shows no matching touch (touches: ${fp.touches.join(', ') || '∅'}).`,
          confidence: 'HEURISTIC',
          details: {
            ruleLabel: rule.label,
            previewSubstring: preview,
            expectedTouchSubstrings: rule.requires,
            actualTouches: fp.touches,
          },
        });
      }
    }
  }

  return out;
};
