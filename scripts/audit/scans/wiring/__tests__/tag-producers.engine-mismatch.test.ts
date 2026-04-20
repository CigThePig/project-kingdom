// Phase 6 — tag-producers ENGINE_MISMATCH path. When the AST writer/reader
// index reports zero persistentConsequences write sites, the scanner's
// producer model can't be trusted. In that situation the scan must suppress
// dead-gate findings and emit a single ENGINE_MISMATCH finding pointing at
// the engine's effect-application file.

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

describe('wiring.tag-producers (ENGINE_MISMATCH path)', () => {
  it('suppresses dead-gate findings and emits one ENGINE_MISMATCH when writer index is empty', async () => {
    const { scan } = await import('../tag-producers');
    const corpus = buildEmptyCorpus();
    corpus.tagReaders.set('evt_ghost:c1', [
      { where: 'event-trigger', id: 'evt_consumer' },
    ]);
    corpus.familyByCardId.set('evt_consumer', 'crisis');

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('NO_CONSEQUENCE_WRITERS_FOUND');
    expect(findings[0].confidence).toBe('ENGINE_MISMATCH');
    expect(findings[0].severity).toBe('MAJOR');
  });
});
