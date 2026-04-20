import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './promise-delivery';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a body that promises construction without touching construction', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_promises_walls',
        body: 'Raise new walls and swell the garrison.',
        touches: ['treasury.balance'],
      }),
    );
    const findings = scan(corpus, OPTS);
    // 'walls' matches construction; 'garrison' matches military readiness.
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0].code).toBe('PROMISE_NOT_DELIVERED');
    expect(findings[0].confidence).toBe('HEURISTIC');
  });

  it('does not flag when the runtime diff matches the claim', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_delivers',
        body: 'The treasury will recover this season.',
        touches: ['treasury.balance'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag bodies with no promise keywords', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_plain',
        body: 'A quiet season passes in the capital.',
        touches: ['population.classes.Commoners.satisfaction'],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips no-op runtime fingerprints', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_noop',
        body: 'The treasury will recover.',
        touches: [],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
