// Phase 5C — Overture grant/deny runtime parity.
//
// Running an overture's grant path must (a) move relationshipScore up and
// (b) append a memory entry. The deny path must do the inverse. If either
// path is a no-op, the overture has no teeth. If grant and deny produce
// identical runtime diffs, the overture's two paths are mechanically
// indistinguishable. Both outcomes fail CARD_AUDIT_RULES §9.6.

import type { Corpus, Finding, Scan } from '../../types';
import type { AuditDecisionPath } from '../../ir';

export const SCAN_ID = 'overtures.grant-deny-runtime-parity';

function signatureOf(path: AuditDecisionPath): string | null {
  const fp = path.runtimeFingerprint;
  if (!fp) return null;
  return [...fp.touches].sort().join('|');
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'overture') continue;
    if (!card.coverage.runtimeDiffCoverage) continue;

    const grant = card.choices.find((c) => c.choiceId === 'grant');
    const deny = card.choices.find((c) => c.choiceId === 'deny');
    if (!grant || !deny) continue;

    const grantFp = grant.runtimeFingerprint;
    const denyFp = deny.runtimeFingerprint;

    if (grantFp?.noOp) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_GRANT_NO_OP',
        cardId: card.id,
        choiceId: 'grant',
        message: `${card.id}: grant path produced an empty runtime diff — accepting an overture should at least shift the relationship and record a memory.`,
        confidence: 'RUNTIME_GROUNDED',
        details: { fixtureId: grantFp.fixtureId },
      });
    }
    if (denyFp?.noOp) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_DENY_NO_OP',
        cardId: card.id,
        choiceId: 'deny',
        message: `${card.id}: deny path produced an empty runtime diff — refusing an overture should at least strain the relationship.`,
        confidence: 'RUNTIME_GROUNDED',
        details: { fixtureId: denyFp.fixtureId },
      });
    }

    const grantSig = signatureOf(grant);
    const denySig = signatureOf(deny);
    if (grantSig && denySig && grantSig === denySig && !grantFp?.noOp) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_GRANT_DENY_IDENTICAL',
        cardId: card.id,
        message: `${card.id}: grant and deny produce identical runtime fingerprints — the two paths are mechanically indistinguishable.`,
        confidence: 'RUNTIME_GROUNDED',
        details: { sharedSignature: grantSig },
      });
    }
  }

  return out;
};
