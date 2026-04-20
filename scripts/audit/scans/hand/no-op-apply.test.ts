import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './no-op-apply';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a pure no-op as CRITICAL', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_dead',
        fingerprint: { noOp: true, touches: [], classes: [] },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('CRITICAL');
    expect(findings[0].code).toBe('NO_OP_APPLY');
  });

  it('flags a conditional no-op (AST has markers, runtime is empty) as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_conditional',
        fingerprint: { noOp: true, touches: [], classes: [] },
        markers: { touchesPersistentConsequences: true },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].code).toBe('CONDITIONAL_NO_OP');
  });

  it('flags temp-modifier marker without a matching runtime touch', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_missing_modifier',
        fingerprint: {
          noOp: false,
          touches: ['treasury.balance'],
          classes: ['surface'],
          structuralCount: 0,
          surfaceCount: 1,
        },
        markers: { queuesTemporaryModifier: true },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].details?.markerKind).toBe('queuesTemporaryModifier');
  });

  it('does not flag cards with matching AST + runtime signals', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_happy',
        fingerprint: {
          noOp: false,
          touches: ['activeTemporaryModifiers.length', 'activeTemporaryModifiers[2]'],
          classes: ['temporal'],
        },
        markers: { queuesTemporaryModifier: true },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips cards without runtime diff coverage', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_no_runtime',
        coverage: { runtimeDiffCoverage: false },
        fingerprint: { noOp: true, touches: [], classes: [] },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
