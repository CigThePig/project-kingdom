import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../neighbor-resolution-parity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags __NEIGHBOR__ placeholder that never resolves', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_dead_neighbor',
        family: 'assessment',
        declaredEffects: { diplomacyDeltas: { __NEIGHBOR__: 5 } },
        touches: ['treasury.balance'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('ASSESSMENT_NEIGHBOR_UNRESOLVED');
  });

  it('passes when the diff reaches diplomacy.neighbors', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_live_neighbor',
        family: 'assessment',
        declaredEffects: { diplomacyDeltas: { __NEIGHBOR__: 5 } },
        touches: ['diplomacy.neighbors[0].relationshipScore'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('ignores cards without the __NEIGHBOR__ placeholder', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_no_placeholder',
        family: 'assessment',
        declaredEffects: { diplomacyDeltas: { 'neighbor_1': 5 } },
        touches: ['treasury.balance'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
