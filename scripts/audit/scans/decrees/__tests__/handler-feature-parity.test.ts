import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../handler-feature-parity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a decree without a registry handler as CRITICAL', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_dead',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { hasHandler: false },
        noRuntime: true,
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('CRITICAL');
    expect(findings[0].code).toBe('DECREE_NO_HANDLER');
  });

  it('flags a handler that produces no runtime diff as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_handler_noop',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { hasHandler: true },
        touches: [],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].code).toBe('DECREE_HANDLER_NO_OP');
  });

  it('passes when the handler runs and touches state', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'decree_live',
        family: 'decree',
        runtimePath: 'decree-resolution',
        metadata: { hasHandler: true },
        touches: ['treasury.balance', 'issuedDecrees.length'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
