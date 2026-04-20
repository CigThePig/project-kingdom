import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../placeholder-resolution';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags an unknown token as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:Test',
        family: 'overture',
        body: '{ruler_full} of {mysterious_made_up_token} approaches.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'OVERTURE_UNKNOWN_TOKEN')).toBe(true);
  });

  it('flags an overture body with no placeholders as MINOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:Flat',
        family: 'overture',
        body: 'A generic envoy arrives with a generic proposal.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('OVERTURE_BODY_NO_PLACEHOLDERS');
    expect(findings[0].severity).toBe('MINOR');
  });

  it('passes when all tokens are known', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:Good',
        family: 'overture',
        body: '{ruler_full} of {capital} sends {dynasty} envoys.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
