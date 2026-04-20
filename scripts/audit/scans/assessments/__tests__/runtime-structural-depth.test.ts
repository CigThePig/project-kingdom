import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../runtime-structural-depth';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags surface-only assessment runs as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_slider',
        family: 'assessment',
        touches: ['treasury.balance', 'stability.value'],
        classes: ['surface'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('ASSESSMENT_SURFACE_ONLY');
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });

  it('passes when the diff touches a structural class', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_structural',
        family: 'assessment',
        touches: ['persistentConsequences.length'],
        classes: ['structural'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips no-op runs', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_noop',
        family: 'assessment',
        touches: [],
        classes: [],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
