import { describe, expect, it } from 'vitest';

import { RivalAgenda } from '../../../../../src/engine/types';
import { buildEmptyCorpus } from '../../__test_helpers';
import { scan, SCAN_ID } from '../agenda-coverage';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags every agenda missing from OVERTURE_TEXT', () => {
    const corpus = buildEmptyCorpus();
    const findings = scan(corpus, OPTS);
    const missing = findings.filter((f) => f.code === 'OVERTURE_AGENDA_MISSING');
    expect(missing.length).toBe(Object.values(RivalAgenda).length);
  });

  it('passes when every agenda has full OVERTURE_TEXT', () => {
    const corpus = buildEmptyCorpus();
    for (const agenda of Object.values(RivalAgenda)) {
      corpus.overtures.text[agenda] = {
        title: `${agenda} title`,
        body: `${agenda} body`,
        grantTitle: 'Grant',
        denyTitle: 'Deny',
      };
    }
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags partial entries with missing fields', () => {
    const corpus = buildEmptyCorpus();
    // Populate every agenda so nothing else flags.
    for (const agenda of Object.values(RivalAgenda)) {
      corpus.overtures.text[agenda] = {
        title: 'T',
        body: 'B',
        grantTitle: 'Grant',
        denyTitle: 'Deny',
      };
    }
    corpus.overtures.text[RivalAgenda.DynasticAlliance] = {
      title: 'T',
      body: '', // missing body
      grantTitle: 'Grant',
      denyTitle: '', // missing denyTitle
    };
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('OVERTURE_AGENDA_FIELDS_MISSING');
    expect(findings[0].details?.missingFields).toEqual(['body', 'denyTitle']);
  });
});
