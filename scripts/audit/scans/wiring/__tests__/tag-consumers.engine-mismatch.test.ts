// Phase 6 — tag-consumers ENGINE_MISMATCH path. Same shape as tag-producers:
// when the AST writer/reader index is empty the scanner's never-read
// findings are untrustworthy, so we emit a single POLISH ENGINE_MISMATCH
// instead of a cascade.

import { describe, expect, it, vi, afterEach } from 'vitest';

import { buildEmptyCorpus } from '../../__test_helpers';

const OPTS = { includeMinor: true, includePolish: true };

vi.mock('../../../ast/runtime-writer-reader-index', () => ({
  getWriterReaderIndex: vi.fn(() => ({
    pressureWrites: [],
    consequenceWriteSites: [],
    consequenceFilterSites: [],
    temporaryModifierRefs: [],
    bondRefs: [],
    temporaryModifierRegistryRefs: [],
  })),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('wiring.tag-consumers (ENGINE_MISMATCH path)', () => {
  it('suppresses never-read findings and emits one POLISH ENGINE_MISMATCH when writer index is empty', async () => {
    const { scan } = await import('../tag-consumers');
    const corpus = buildEmptyCorpus();
    corpus.tagProducers.set('evt_authored:c1', [
      { kind: 'event', id: 'evt_authored', choiceId: 'c1' },
    ]);
    corpus.familyByCardId.set('evt_authored', 'crisis');

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('NO_CONSEQUENCE_WRITERS_FOUND');
    expect(findings[0].confidence).toBe('ENGINE_MISMATCH');
    expect(findings[0].severity).toBe('POLISH');
  });
});
