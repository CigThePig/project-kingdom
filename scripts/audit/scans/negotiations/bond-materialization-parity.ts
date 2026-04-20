// Phase 5B — Bond materialization parity.
//
// TERM_ID_TO_BOND_KIND maps accepted terms onto the Bond kind the engine
// appends to diplomacy.bonds on resolution. When a term is in the map,
// runtime diff must show a `diplomacy.bonds` touch. When diff shows a bond
// touch without a mapping, the engine wrote a bond the scanner didn't know
// about — scanner-model drift.

import type { Corpus, Finding, Scan } from '../../types';
import { TERM_ID_TO_BOND_KIND } from '../../../../src/bridge/negotiationBondMap';

export const SCAN_ID = 'negotiations.bond-materialization-parity';

function touchesBond(touches: readonly string[]): boolean {
  return touches.some((t) => t.includes('diplomacy.bonds') || t.startsWith('diplomacy.bonds'));
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'negotiation') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;
    const rejectChoiceId = card.metadata?.rejectChoiceId as string | undefined;

    for (const path of card.choices) {
      if (path.choiceId === rejectChoiceId) continue;
      const fp = path.runtimeFingerprint;
      if (!fp) continue;

      const declaredBond = TERM_ID_TO_BOND_KIND[path.choiceId];
      const diffBond = touchesBond(fp.touches);

      if (declaredBond && !diffBond) {
        out.push({
          severity: 'MAJOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'BOND_NOT_MATERIALIZED',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: TERM_ID_TO_BOND_KIND declares "${declaredBond}" but runtime diff shows no diplomacy.bonds touch — bond never materialized.`,
          confidence: 'RUNTIME_GROUNDED',
          details: { declaredBond, touches: fp.touches },
        });
      }

      if (!declaredBond && diffBond) {
        out.push({
          severity: 'MINOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'BOND_UNDECLARED',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}.${path.choiceId}: runtime diff added a diplomacy bond but TERM_ID_TO_BOND_KIND has no entry — engine writer unknown to the scanner model.`,
          confidence: 'ENGINE_MISMATCH',
          details: {
            bondTouches: fp.touches.filter((t) => t.includes('bonds')),
          },
        });
      }
    }
  }

  return out;
};
