import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './expiry-sanity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags expiresAfterTurns below the floor', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({ id: 'hand_fast', title: 'Court Favor', expiresAfterTurns: 2 }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].code).toBe('EXPIRY_FLAVOR_MISMATCH');
  });

  it('flags expiresAfterTurns above the ceiling', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({ id: 'hand_long', title: 'Court Favor', expiresAfterTurns: 30 }),
    );
    expect(scan(corpus, OPTS)).toHaveLength(1);
  });

  it('flags a durable-titled card with short expiry', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({ id: 'hand_royal_pardon_test', title: 'Royal Pardon', expiresAfterTurns: 5 }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].details?.reasons).toBeDefined();
  });

  it('flags a fleeting-titled card with long expiry', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_whisper_test',
        title: "Whispered Rumor",
        expiresAfterTurns: 20,
      }),
    );
    expect(scan(corpus, OPTS)).toHaveLength(1);
  });

  it('does not flag reasonable expiry values', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({ id: 'hand_reasonable', title: 'Sturdy Ally', expiresAfterTurns: 10 }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
