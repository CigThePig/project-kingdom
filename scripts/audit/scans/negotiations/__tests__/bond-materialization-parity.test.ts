import { describe, expect, it } from 'vitest';

import {
  buildDecisionPath,
  buildEmptyCorpus,
  buildGenericAuditCard,
} from '../../__test_helpers';
import { scan, SCAN_ID } from '../bond-materialization-parity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a bond-typed term whose runtime diff never touches bonds', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_bond_missing',
        family: 'negotiation',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          // exclusive_market_access maps to 'trade_league' in TERM_ID_TO_BOND_KIND.
          buildDecisionPath({
            cardId: 'neg_bond_missing',
            family: 'negotiation',
            choiceId: 'exclusive_market_access',
            touches: ['treasury.balance'],
            classes: ['surface'],
          }),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('BOND_NOT_MATERIALIZED');
  });

  it('passes when the diff touches diplomacy.bonds', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_bond_ok',
        family: 'negotiation',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_bond_ok',
            family: 'negotiation',
            choiceId: 'exclusive_market_access',
            touches: ['diplomacy.bonds[0]', 'treasury.balance'],
            classes: ['diplomatic', 'surface'],
          }),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags undeclared bond writers as ENGINE_MISMATCH', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_surprise_bond',
        family: 'negotiation',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_surprise_bond',
            family: 'negotiation',
            choiceId: 'no_bond_kind_for_this_id',
            touches: ['diplomacy.bonds[0].kind'],
            classes: ['diplomatic'],
          }),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('BOND_UNDECLARED');
    expect(findings[0].confidence).toBe('ENGINE_MISMATCH');
  });
});
