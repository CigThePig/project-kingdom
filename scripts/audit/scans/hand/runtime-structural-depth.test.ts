import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './runtime-structural-depth';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags surface-only runtime diffs as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_surface_only',
        fingerprint: {
          touches: ['treasury.balance'],
          classes: ['surface'],
          structuralCount: 0,
          surfaceCount: 1,
          noOp: false,
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].code).toBe('HAND_SURFACE_ONLY');
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });

  it('does not flag cards with a structural touch', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_structural',
        fingerprint: {
          touches: ['persistentConsequences.length'],
          classes: ['surface', 'structural'],
          structuralCount: 1,
          surfaceCount: 1,
          noOp: false,
        },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag cards with diplomatic or temporal touches', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_diplomatic',
        fingerprint: {
          touches: ['diplomacy.neighbors[0].relationshipScore'],
          classes: ['diplomatic'],
          structuralCount: 0,
          surfaceCount: 0,
          noOp: false,
        },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips no-op runs (covered by no-op-apply scan)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_noop',
        fingerprint: { touches: [], classes: [], noOp: true },
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
        fingerprint: {
          touches: ['treasury.balance'],
          classes: ['surface'],
          structuralCount: 0,
          surfaceCount: 1,
          noOp: false,
        },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
