import { describe, expect, it } from 'vitest';

import {
  buildDecisionPath,
  buildEmptyCorpus,
  buildGenericAuditCard,
} from '../../__test_helpers';
import { scan, SCAN_ID } from '../term-distinctness';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags two terms with identical runtime fingerprints as TERM_CLONE', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_clones',
        family: 'negotiation',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_clones',
            family: 'negotiation',
            choiceId: 'term_a',
            touches: ['treasury.balance'],
            classes: ['surface'],
          }),
          buildDecisionPath({
            cardId: 'neg_clones',
            family: 'negotiation',
            choiceId: 'term_b',
            touches: ['treasury.balance'],
            classes: ['surface'],
          }),
          buildDecisionPath({
            cardId: 'neg_clones',
            family: 'negotiation',
            choiceId: 'reject_default',
            touches: ['stability.value'],
            classes: ['surface'],
          }),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('TERM_CLONE');
  });

  it('does not flag terms with distinct runtime fingerprints', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_distinct',
        family: 'negotiation',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_distinct',
            family: 'negotiation',
            choiceId: 'term_a',
            touches: ['treasury.balance'],
            classes: ['surface'],
          }),
          buildDecisionPath({
            cardId: 'neg_distinct',
            family: 'negotiation',
            choiceId: 'term_b',
            touches: ['diplomacy.bonds.length'],
            classes: ['diplomatic'],
          }),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
