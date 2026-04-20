// Reader/writer roundtrip — intersect the scanner's IR against the AST
// writer/reader index and flag cases where one side claims a resource the
// other side doesn't see. Scope for M5.2:
//
//   - PRESSURE_WEIGHTS keys whose source-type has no applyPressure() writer
//     anywhere in the engine. (pressure-prefix-parity checks prefixes; this
//     sibling scan checks *individual keys* once a prefix is orphaned.)
//   - Consequence tags produced by the scanner but with zero reader — already
//     covered by `wiring.tag-consumers`, so we stay narrow and only cross-
//     check producer-side.
//   - `EVENT_CHOICE_TEMPORARY_MODIFIERS` registry entries that the AST index
//     doesn't reference from the resolution pipeline.
//
// Everything this scan emits is an ENGINE_MISMATCH: scanner knows about a
// thing the engine doesn't (or vice versa). These are scanner-model gaps,
// not content bugs.

import { PRESSURE_WEIGHTS } from '../../../../src/data/narrative-pressure/weights';

import { getWriterReaderIndex } from '../../ast/runtime-writer-reader-index';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'engine.reader-writer-roundtrip';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const index = getWriterReaderIndex();
  const out: Finding[] = [];

  // --- Pressure keys ---------------------------------------------------
  // Collapse by prefix: pressure-prefix-parity already reports the orphan
  // prefix; this scan collects the individual key list per prefix so authors
  // can see the blast radius of deleting (or wiring up) that source-type.
  const writerPrefixes = new Set<string>();
  for (const w of index.pressureWrites) {
    if (w.sourceType) writerPrefixes.add(w.sourceType);
  }
  const orphanKeysByPrefix = new Map<string, string[]>();
  for (const key of Object.keys(PRESSURE_WEIGHTS)) {
    const prefix = key.split(':')[0];
    if (writerPrefixes.has(prefix)) continue;
    const bucket = orphanKeysByPrefix.get(prefix) ?? [];
    bucket.push(key);
    orphanKeysByPrefix.set(prefix, bucket);
  }
  for (const [prefix, keys] of orphanKeysByPrefix) {
    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'PRESSURE_KEY_NO_WRITER',
      cardId: `narrative-pressure:${prefix}`,
      filePath: 'src/data/narrative-pressure/weights.ts',
      message: `Source-type '${prefix}' has ${keys.length} PRESSURE_WEIGHTS entries but no applyPressure() writer — every key under this prefix is dead weight.`,
      confidence: 'ENGINE_MISMATCH',
      details: { prefix, orphanKeys: keys, writerPrefixes: [...writerPrefixes] },
    });
  }

  // --- Temporary-modifier registry -------------------------------------
  // `EVENT_CHOICE_TEMPORARY_MODIFIERS` is loaded into `corpus.tempModifiers`.
  // We require at least one reference to the registry identifier in the
  // engine source — otherwise the map is dead weight.
  if (index.temporaryModifierRegistryRefs.length === 0 && Object.keys(corpus.tempModifiers).length > 0) {
    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'TEMP_MODIFIER_REGISTRY_ORPHANED',
      cardId: 'temporary-modifiers:registry',
      filePath: 'src/data/events/effects.ts',
      message: 'EVENT_CHOICE_TEMPORARY_MODIFIERS has entries but the AST index found no references to the registry in engine source — temp-modifiers never fire at runtime.',
      confidence: 'ENGINE_MISMATCH',
    });
  }

  return out;
};
