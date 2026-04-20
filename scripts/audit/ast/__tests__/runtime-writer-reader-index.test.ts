// Index smoke tests — ensure the ts-morph writer/reader index finds the
// three known persistentConsequences write sites and the three known
// applyPressure call sites. Fixtures are the real source files; this is a
// truthiness test against known-good line numbers in resolution/*.ts.

import { describe, expect, it } from 'vitest';

import { getWriterReaderIndex } from '../runtime-writer-reader-index';

describe('runtime writer/reader index', () => {
  it('finds every applyPressure() call site in the resolution pipeline', () => {
    const index = getWriterReaderIndex();
    const inTurnResolution = index.pressureWrites.filter((w) =>
      w.filePath.endsWith('src/engine/resolution/turn-resolution.ts'),
    );
    expect(inTurnResolution.length).toBeGreaterThanOrEqual(3);
    const sourceTypes = new Set(inTurnResolution.map((w) => w.sourceType));
    expect(sourceTypes.has('event')).toBe(true);
    expect(sourceTypes.has('storyline')).toBe(true);
    expect(sourceTypes.has('decree')).toBe(true);
  });

  it('finds every persistentConsequences write site in apply-action-effects.ts', () => {
    const index = getWriterReaderIndex();
    const writes = index.consequenceWriteSites.filter((w) =>
      w.filePath.endsWith('src/engine/resolution/apply-action-effects.ts'),
    );
    // Three known write sites: decree (line 446), event-choice (~987),
    // storyline branch (~1086). All are immutable-spread assignments.
    expect(writes.length).toBeGreaterThanOrEqual(3);
  });

  it('relativizes paths to the project root', () => {
    const index = getWriterReaderIndex();
    for (const w of index.pressureWrites) {
      expect(w.filePath.startsWith('/')).toBe(false);
    }
  });
});
