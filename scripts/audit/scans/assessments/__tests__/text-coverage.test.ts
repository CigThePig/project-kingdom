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
        id: 'assess_ghost',
        family: 'assessment',
        title: '',
        body: '',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].code).toBe('ASSESSMENT_TEXT_MISSING');
  });

  it('passes when every choice has a label', () => {
    const corpus = buildEmptyCorpus();
    corpus.assessments.text['assess_ok'] = {
      title: 'T',
      body: 'B',
      choices: { act: 'Act', ignore: 'Ignore' },
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_ok',
        family: 'assessment',
        title: 'T',
        body: 'B',
        choices: [
          buildDecisionPath({
            cardId: 'assess_ok',
            family: 'assessment',
            choiceId: 'act',
            effectSourceKind: 'assessment-effects',
            textSourceKind: 'assessment-text',
          }),
          buildDecisionPath({
            cardId: 'assess_ok',
            family: 'assessment',
            choiceId: 'ignore',
            effectSourceKind: 'assessment-effects',
            textSourceKind: 'assessment-text',
          }),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags a missing choice label as MINOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.assessments.text['assess_partial'] = {
      title: 'T',
      body: 'B',
      choices: { act: 'Act' }, // ignore missing
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'assess_partial',
        family: 'assessment',
        title: 'T',
        body: 'B',
        choices: [
          buildDecisionPath({
            cardId: 'assess_partial',
            family: 'assessment',
            choiceId: 'act',
            effectSourceKind: 'assessment-effects',
            textSourceKind: 'assessment-text',
          }),
          buildDecisionPath({
            cardId: 'assess_partial',
            family: 'assessment',
            choiceId: 'ignore',
            effectSourceKind: 'assessment-effects',
            textSourceKind: 'assessment-text',
          }),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].code).toBe('ASSESSMENT_CHOICE_LABEL_MISSING');
  });
});
