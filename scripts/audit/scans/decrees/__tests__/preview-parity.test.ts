import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../preview-parity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a preview claim not backed by the runtime diff', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_oversold',
        family: 'decree',
        runtimePath: 'decree-resolution',
        body: 'Funds construction of grand walls across the marches.',
        touches: ['treasury.balance'], // no constructionProjects touch
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'DECREE_PREVIEW_MISMATCH')).toBe(true);
  });

  it('passes when the runtime diff backs every preview claim', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_honest',
        family: 'decree',
        runtimePath: 'decree-resolution',
        body: 'Funds construction of new walls.',
        touches: ['constructionProjects[0].id', 'treasury.balance'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
