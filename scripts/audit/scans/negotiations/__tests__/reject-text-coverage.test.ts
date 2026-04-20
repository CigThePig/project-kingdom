import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../../__test_helpers';
import { scan, SCAN_ID } from '../reject-text-coverage';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags missing reject label as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.negotiations.text['neg_no_reject'] = {
      title: 'T',
      body: 'B',
      contextLabel: '',
      terms: {},
      rejectLabel: '',
    };
    corpus.auditCards.push(
      buildGenericAuditCard({ id: 'neg_no_reject', family: 'negotiation' }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('REJECT_LABEL_MISSING');
    expect(findings[0].severity).toBe('MAJOR');
  });

  it('flags generic reject labels as MINOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.negotiations.text['neg_generic'] = {
      title: 'T',
      body: 'B',
      contextLabel: '',
      terms: {},
      rejectLabel: 'Decline',
    };
    corpus.auditCards.push(
      buildGenericAuditCard({ id: 'neg_generic', family: 'negotiation' }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('REJECT_LABEL_GENERIC');
    expect(findings[0].severity).toBe('MINOR');
  });

  it('passes on a narratively-framed reject label', () => {
    const corpus = buildEmptyCorpus();
    corpus.negotiations.text['neg_flavored'] = {
      title: 'T',
      body: 'B',
      contextLabel: '',
      terms: {},
      rejectLabel: 'Send the envoys home empty-handed',
    };
    corpus.auditCards.push(
      buildGenericAuditCard({ id: 'neg_flavored', family: 'negotiation' }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
