// Engine parity §M1 — PRESSURE_WEIGHTS source-type prefixes vs real
// applyPressure() call sites in the resolution pipeline.
//
// PRESSURE_WEIGHTS keys are `${sourceType}:${sourceId}:${choiceId}`; the
// engine calls `applyPressure(pressure, sourceType, sourceId, choiceId)` at
// three sites in turn-resolution.ts (event / storyline / decree). A prefix
// appearing in the map but never written (or vice versa) is a scanner-model
// bug, not a content bug — we flag it as ENGINE_MISMATCH so it never blocks
// card-cleanup work.
//
// This scan uses regex against the resolution source file for the foundation
// commit; M5 (§5a) upgrades it to the AST writer/reader index once M3 lands.

import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { PRESSURE_WEIGHTS } from '../../../../src/data/narrative-pressure/weights';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.pressure-prefix-parity';

const RESOLUTION_SRC = path.resolve(
  process.cwd(),
  'src',
  'engine',
  'resolution',
  'turn-resolution.ts',
);

// applyPressure(pressure, 'event' | 'storyline' | 'decree', ...)
const APPLY_PRESSURE_RE = /applyPressure\s*\([^,]+,\s*['"]([a-z_]+)['"]/g;

export const scan: Scan = (_corpus: Corpus): Finding[] => {
  let source: string;
  try {
    source = readFileSync(RESOLUTION_SRC, 'utf8');
  } catch {
    return [];
  }

  const actualPrefixes = new Set<string>();
  APPLY_PRESSURE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = APPLY_PRESSURE_RE.exec(source)) !== null) {
    actualPrefixes.add(m[1]);
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
      out.push({
        severity: 'MAJOR',
        family: 'unknown',
        scanId: SCAN_ID,
        code: 'PRESSURE_PREFIX_UNMAPPED',
        cardId: `narrative-pressure:${prefix}`,
        filePath: 'src/engine/resolution/turn-resolution.ts',
        message: `applyPressure() is called with source-type '${prefix}' but no PRESSURE_WEIGHTS entry uses that prefix — this source-type produces no pressure at runtime.`,
        confidence: 'ENGINE_MISMATCH',
        details: { prefix, mapPrefixes: [...mapPrefixes] },
      });
    }
  }

  return out;
};
