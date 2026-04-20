import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../chain-tier-policy';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags tier 2+ without previousTierDecreeId', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_orphan_tier_2',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { tier: 2, previousTierDecreeId: null },
        touches: ['policies.taxationLevel'],
        classes: ['policy'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'DECREE_CHAIN_BROKEN')).toBe(true);
  });

  it('flags tier 2+ pointing at an unknown previous decree', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_bad_prev',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { tier: 2, previousTierDecreeId: 'decree_ghost' },
        touches: ['policies.taxationLevel'],
        classes: ['policy'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'DECREE_CHAIN_BROKEN')).toBe(true);
  });

  it('flags tier 2+ whose runtime diff is surface-only', () => {
    const corpus = buildEmptyCorpus();
    corpus.decrees.pool.push({ id: 'decree_parent' } as any);
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_underpowered',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { tier: 2, previousTierDecreeId: 'decree_parent' },
        touches: ['treasury.balance'],
        classes: ['surface'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'DECREE_TIER_UNDERPOWERED')).toBe(true);
  });

  it('passes a well-formed tier 2 decree', () => {
    const corpus = buildEmptyCorpus();
    corpus.decrees.pool.push({ id: 'decree_parent' } as any);
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_good_tier_2',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { tier: 2, previousTierDecreeId: 'decree_parent' },
        touches: ['policies.taxationLevel', 'issuedDecrees.length'],
        classes: ['policy', 'structural'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
