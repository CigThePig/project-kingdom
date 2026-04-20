// Phase 5E — Decree chain & tier policy (CARD_AUDIT_RULES §9.1).
//
// Tier-2+ decrees declare a previousTierDecreeId. The prior tier must exist
// in DECREE_POOL; a dangling reference silently prevents the chain from
// unlocking. Also: tier ≥ 2 decrees must produce a structural runtime
// fingerprint — per §9.1 a higher-tier decree can't justify its gate if its
// mechanical footprint is surface-only.

import type { Corpus, Finding, Scan } from '../../types';
import { STRUCTURAL_TOUCH_CLASSES } from '../shared';

export const SCAN_ID = 'decrees.chain-tier-policy';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const decreeIds = new Set(corpus.decrees.pool.map((d) => d.id));

  for (const card of corpus.auditCards) {
    if (card.family !== 'decree') continue;
    const tier = card.metadata?.tier as number | undefined;
    const prev = card.metadata?.previousTierDecreeId as string | null | undefined;

    if (typeof tier === 'number' && tier >= 2) {
      if (!prev) {
        out.push({
          severity: 'MAJOR',
          family: 'decree',
          scanId: SCAN_ID,
          code: 'DECREE_CHAIN_BROKEN',
          cardId: card.id,
          filePath: card.filePath,
          message: `${card.id}: tier ${tier} decree has no previousTierDecreeId — the chain cannot unlock by tier gate.`,
          confidence: 'DETERMINISTIC',
        });
      } else if (!decreeIds.has(prev)) {
        out.push({
          severity: 'MAJOR',
          family: 'decree',
          scanId: SCAN_ID,
          code: 'DECREE_CHAIN_BROKEN',
          cardId: card.id,
          filePath: card.filePath,
          message: `${card.id}: previousTierDecreeId "${prev}" is not in DECREE_POOL — dangling chain reference.`,
          confidence: 'DETERMINISTIC',
          details: { previousTierDecreeId: prev },
        });
      }

      // Substance check: tier ≥ 2 must do structural work.
      if (card.coverage.runtimeDiffCoverage) {
        for (const path of card.choices) {
          const fp = path.runtimeFingerprint;
          if (!fp || fp.noOp) continue;
          const hasStructural = fp.classes.some((c) => STRUCTURAL_TOUCH_CLASSES.has(c));
          if (!hasStructural) {
            out.push({
              severity: 'MAJOR',
              family: 'decree',
              scanId: SCAN_ID,
              code: 'DECREE_TIER_UNDERPOWERED',
              cardId: card.id,
              filePath: card.filePath,
              message: `${card.id}: tier ${tier} decree produces a surface-only runtime diff — higher-tier decrees must leave a structural mark.`,
              confidence: 'RUNTIME_GROUNDED',
              details: {
                tier,
                touches: fp.touches,
                classes: fp.classes,
              },
            });
          }
        }
      }
    }
  }

  return out;
};
