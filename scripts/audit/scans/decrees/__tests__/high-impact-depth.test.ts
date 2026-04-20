import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../high-impact-depth';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a high-impact decree whose diff is surface-only', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_high_impact_shallow',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { isHighImpact: true },
        touches: ['treasury.balance'],
        classes: ['surface'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('HIGH_IMPACT_SHALLOW');
  });

  it('passes when the diff touches a policy', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_high_impact_deep',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { isHighImpact: true },
        touches: ['policies.taxationLevel', 'issuedDecrees.length'],
        classes: ['policy', 'structural'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('ignores non-high-impact decrees entirely', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_low_impact',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { isHighImpact: false },
        touches: ['treasury.balance'],
        classes: ['surface'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
