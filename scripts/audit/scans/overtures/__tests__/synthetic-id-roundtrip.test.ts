import { describe, expect, it } from 'vitest';

import { RivalAgenda } from '../../../../../src/engine/types';
import { buildEmptyCorpus } from '../../__test_helpers';
import { scan, SCAN_ID } from '../synthetic-id-roundtrip';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('round-trips every authored agenda without complaint', () => {
    const corpus = buildEmptyCorpus();
    for (const agenda of Object.values(RivalAgenda)) {
      corpus.overtures.text[agenda] = {
        title: 'T',
        body: 'B',
        grantTitle: 'Grant',
        denyTitle: 'Deny',
      };
    }
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips agendas without OVERTURE_TEXT entries', () => {
    const corpus = buildEmptyCorpus();
    // No text at all — scan should just return no findings for this one.
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
