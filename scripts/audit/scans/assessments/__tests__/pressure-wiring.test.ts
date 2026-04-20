import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../pressure-wiring';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags declared narrativePressure that never surfaces in runtime', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_dead_pressure',
        family: 'assessment',
        declaredEffects: { narrativePressure: { authority: 5 } },
        touches: ['treasury.balance'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('ASSESSMENT_PRESSURE_DEAD');
    expect(findings[0].confidence).toBe('ENGINE_MISMATCH');
  });

  it('flags runtime pressure that was never declared', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_surprise_pressure',
        family: 'assessment',
        declaredEffects: {},
        touches: ['narrativePressure.authority'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('ASSESSMENT_PRESSURE_UNDECLARED');
  });

  it('passes when declared and runtime agree', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_agreeing',
        family: 'assessment',
        declaredEffects: { narrativePressure: { authority: 5 } },
        touches: ['narrativePressure.authority'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
