import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../pressure-wiring';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags declared pressure that does not surface', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_dead_pressure',
        family: 'negotiation',
        declaredEffects: { narrativePressure: { authority: 3 } },
        touches: ['treasury.balance'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('NEGOTIATION_PRESSURE_DEAD');
  });

  it('flags runtime pressure without a declaration', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_surprise_pressure',
        family: 'negotiation',
        declaredEffects: {},
        touches: ['narrativePressure.authority'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('NEGOTIATION_PRESSURE_UNDECLARED');
  });

  it('passes when declaration and runtime agree', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_ok_pressure',
        family: 'negotiation',
        declaredEffects: { narrativePressure: { authority: 3 } },
        touches: ['narrativePressure.authority'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
