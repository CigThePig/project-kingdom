// Test helper — builds an empty `Corpus` shell that scans can mutate to set
// up minimal scenarios. Only used by *.test.ts files.

import type { Corpus } from '../types';

export function buildEmptyCorpus(): Corpus {
  return {
    events: { pool: [], followUpPool: [] },
    decrees: { pool: [], effects: {} },
    assessments: { pool: [], effects: {}, text: {} },
    negotiations: { pool: [], effects: {}, text: {} },
    worldEvents: { defs: [], effects: {}, text: {} },
    handCards: [],
    text: { events: {} },
    effects: { events: {} },
    styleTags: {},
    tempModifiers: {},
    featureRegistry: {},
    eventById: new Map(),
    familyByCardId: new Map(),
    filePathByCardId: new Map(),
    tagProducers: new Map(),
    tagReaders: new Map(),
  };
}
