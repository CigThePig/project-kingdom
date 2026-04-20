import { describe, expect, it } from 'vitest';

import {
  buildDecisionPath,
  buildEmptyCorpus,
  buildGenericAuditCard,
} from '../../__test_helpers';
import { scan, SCAN_ID } from '../text-coverage';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags missing title/body as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_ghost',
        family: 'negotiation',
        title: '',
        body: '',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'NEGOTIATION_TEXT_MISSING')).toBe(true);
  });

  it('flags missing term title and description as MINOR each', () => {
    const corpus = buildEmptyCorpus();
    corpus.negotiations.text['neg_partial'] = {
      title: 'T',
      body: 'B',
      contextLabel: '',
      terms: {}, // no entry for the term
      rejectLabel: 'Decline',
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_partial',
        family: 'negotiation',
        title: 'T',
        body: 'B',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_partial',
            family: 'negotiation',
            choiceId: 'fair_terms',
            effectSourceKind: 'negotiation-effects',
            textSourceKind: 'negotiation-text',
          }),
          buildDecisionPath({
            cardId: 'neg_partial',
            family: 'negotiation',
            choiceId: 'reject_default',
            effectSourceKind: 'none',
            textSourceKind: 'negotiation-text',
          }),
        ],
      }),
    );
    const codes = scan(corpus, OPTS).map((f) => f.code);
    expect(codes).toContain('NEGOTIATION_TERM_TITLE_MISSING');
    expect(codes).toContain('NEGOTIATION_TERM_DESCRIPTION_MISSING');
  });

  it('passes when every term is fully covered', () => {
    const corpus = buildEmptyCorpus();
    corpus.negotiations.text['neg_ok'] = {
      title: 'T',
      body: 'B',
      contextLabel: '',
      terms: { fair_terms: { title: 'Fair Terms', description: 'A solid deal.' } },
      rejectLabel: 'Walk away from the table',
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_ok',
        family: 'negotiation',
        title: 'T',
        body: 'B',
        metadata: { rejectChoiceId: 'reject_default' },
        choices: [
          buildDecisionPath({
            cardId: 'neg_ok',
            family: 'negotiation',
            choiceId: 'fair_terms',
            label: 'Fair Terms',
            previewText: 'A solid deal.',
            effectSourceKind: 'negotiation-effects',
            textSourceKind: 'negotiation-text',
          }),
          buildDecisionPath({
            cardId: 'neg_ok',
            family: 'negotiation',
            choiceId: 'reject_default',
            effectSourceKind: 'none',
            textSourceKind: 'negotiation-text',
          }),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
