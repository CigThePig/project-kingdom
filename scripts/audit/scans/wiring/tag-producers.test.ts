// Unit test for §13.12 tag-producers (dead-gate detector). Builds a synthetic
// corpus where one trigger reads a tag no choice produces; asserts CRITICAL.

import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus } from '../__test_helpers';
import { scan, SCAN_ID } from './tag-producers';

const FULL_OPTS = { includeMinor: true, includePolish: true };

describe('wiring.tag-producers', () => {
  it('emits CRITICAL when a trigger reads a tag with no producer', () => {
    const corpus = buildEmptyCorpus();
    corpus.tagReaders.set('evt_ghost:choose_a', [
      { where: 'event-trigger', id: 'evt_consumer' },
    ]);
    corpus.familyByCardId.set('evt_consumer', 'crisis');

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0]).toMatchObject({
      severity: 'CRITICAL',
      scanId: SCAN_ID,
      code: 'TAG_DEAD_GATE',
      cardId: 'evt_consumer',
    });
    expect(findings[0].details).toMatchObject({ tag: 'evt_ghost:choose_a', where: 'event-trigger' });
  });

  it('emits no findings when every read tag has a producer', () => {
    const corpus = buildEmptyCorpus();
    corpus.tagReaders.set('evt_real:c1', [
      { where: 'event-trigger', id: 'evt_consumer' },
    ]);
    corpus.tagProducers.set('evt_real:c1', [
      { kind: 'event', id: 'evt_real', choiceId: 'c1' },
    ]);
    expect(scan(corpus, FULL_OPTS)).toEqual([]);
  });

  it('emits one finding per reader of a dead tag', () => {
    const corpus = buildEmptyCorpus();
    corpus.tagReaders.set('evt_ghost:c1', [
      { where: 'event-trigger', id: 'evt_a' },
      { where: 'decree-trigger', id: 'decree_b' },
    ]);
    corpus.familyByCardId.set('evt_a', 'crisis');
    corpus.familyByCardId.set('decree_b', 'decree');

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.length).toBe(2);
    expect(new Set(findings.map((f) => f.cardId))).toEqual(new Set(['evt_a', 'decree_b']));
    expect(findings.every((f) => f.severity === 'CRITICAL')).toBe(true);
  });
});
