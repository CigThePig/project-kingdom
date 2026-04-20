// Engine parity — PRESSURE_WEIGHTS source-type prefixes vs real
// applyPressure() call sites in the resolution pipeline.
//
// PRESSURE_WEIGHTS keys are `${sourceType}:${sourceId}:${choiceId}`; the
// engine calls `applyPressure(pressure, sourceType, sourceId, choiceId)` at
// every `applyPressure(...)` call site indexed by the M3 AST writer/reader
// index. A prefix appearing in the map but never written (or vice versa)
// is a scanner-model bug, not a content bug — we flag it as
// ENGINE_MISMATCH so it never blocks card-cleanup work.

import { PRESSURE_WEIGHTS } from '../../../../src/data/narrative-pressure/weights';
import { getWriterReaderIndex } from '../../ast/runtime-writer-reader-index';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.pressure-prefix-parity';

export const scan: Scan = (_corpus: Corpus): Finding[] => {
  const index = getWriterReaderIndex();

  const actualPrefixes = new Set<string>();
  const sampleSiteByPrefix = new Map<string, string>();
  for (const site of index.pressureWrites) {
    if (site.sourceType) {
      actualPrefixes.add(site.sourceType);
      if (!sampleSiteByPrefix.has(site.sourceType)) {
        sampleSiteByPrefix.set(site.sourceType, `${site.filePath}:${site.line}`);
      }
    }
  }

  const mapPrefixes = new Set<string>();
  for (const key of Object.keys(PRESSURE_WEIGHTS)) {
    const colon = key.indexOf(':');
    if (colon > 0) mapPrefixes.add(key.slice(0, colon));
  }

  const out: Finding[] = [];

  for (const prefix of mapPrefixes) {
    if (!actualPrefixes.has(prefix)) {
      out.push({
        severity: 'MAJOR',
        family: 'unknown',
        scanId: SCAN_ID,
        code: 'PRESSURE_PREFIX_ORPHAN',
        cardId: `narrative-pressure:${prefix}`,
        filePath: 'src/data/narrative-pressure/weights.ts',
        message: `PRESSURE_WEIGHTS contains keys with prefix '${prefix}:' but no applyPressure() call site uses that source-type.`,
        confidence: 'ENGINE_MISMATCH',
        details: { prefix, actualPrefixes: [...actualPrefixes] },
      });
    }
  }

  for (const prefix of actualPrefixes) {
    if (!mapPrefixes.has(prefix)) {
      const site = sampleSiteByPrefix.get(prefix);
      out.push({
        severity: 'MAJOR',
        family: 'unknown',
        scanId: SCAN_ID,
        code: 'PRESSURE_PREFIX_UNMAPPED',
        cardId: `narrative-pressure:${prefix}`,
        filePath: site,
        message: `applyPressure() is called with source-type '${prefix}' but no PRESSURE_WEIGHTS entry uses that prefix — this source-type produces no pressure at runtime.`,
        confidence: 'ENGINE_MISMATCH',
        details: { prefix, mapPrefixes: [...mapPrefixes], site },
      });
    }
  }

  return out;
};
