// M5.1 engine parity scans — text/runtime/pressure.
//
// These three scans only fire when the scanner's model of the engine
// disagrees with what the engine actually does. On a healthy codebase
// with the full AST index, they should produce ENGINE_MISMATCH findings
// only for the real known-orphan PRESSURE_WEIGHTS prefixes (assessment,
// faction, negotiation, neighbor — four keys whose runtime writers don't
// exist). Text-source and runtime-path parity should come up clean.

import { describe, expect, it } from 'vitest';

import { loadCorpus } from '../../../corpus';
import { scan as pressurePrefixScan, SCAN_ID as PRESSURE_ID } from '../pressure-prefix-parity';
import { scan as textSourceScan, SCAN_ID as TEXT_SOURCE_ID } from '../text-source-parity';
import { scan as runtimePathScan, SCAN_ID as RUNTIME_PATH_ID } from '../runtime-path-parity';

describe('engine parity scans', () => {
  it('pressure-prefix-parity emits ENGINE_MISMATCH for the four known orphan prefixes', async () => {
    const corpus = await loadCorpus();
    const findings = pressurePrefixScan(corpus, {});
    expect(findings.length).toBeGreaterThan(0);
    for (const f of findings) {
      expect(f.scanId).toBe(PRESSURE_ID);
      expect(f.confidence).toBe('ENGINE_MISMATCH');
    }
    const orphanPrefixes = findings
      .filter((f) => f.code === 'PRESSURE_PREFIX_ORPHAN')
      .map((f) => f.details?.prefix);
    expect(orphanPrefixes).toEqual(
      expect.arrayContaining(['assessment', 'faction', 'negotiation', 'neighbor']),
    );
  });

  it('text-source-parity finds no misclassified cards on a healthy corpus', async () => {
    const corpus = await loadCorpus();
    const findings = textSourceScan(corpus, {});
    expect(findings.every((f) => f.scanId === TEXT_SOURCE_ID)).toBe(true);
    expect(findings.every((f) => f.confidence === 'ENGINE_MISMATCH')).toBe(true);
    expect(findings.length).toBe(0);
  });

  it('runtime-path-parity finds no unknown routings for authored cards', async () => {
    const corpus = await loadCorpus({ runtimeFingerprint: true });
    const findings = runtimePathScan(corpus, {});
    expect(findings.every((f) => f.scanId === RUNTIME_PATH_ID)).toBe(true);
    expect(findings.every((f) => f.confidence === 'ENGINE_MISMATCH')).toBe(true);
    const unknown = findings.filter((f) => f.code === 'RUNTIME_PATH_UNKNOWN');
    expect(unknown.length).toBe(0);
  });
});
