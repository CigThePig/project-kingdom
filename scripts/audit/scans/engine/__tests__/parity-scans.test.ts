// M5.1 engine parity scans — text/runtime/pressure.
//
// These three scans only fire when the scanner's model of the engine
// disagrees with what the engine actually does. Post-M7 cleanup, the
// PRESSURE_WEIGHTS prefixes that historically had no writer (assessment,
// faction, negotiation) now have real applyPressure() call sites and the
// 'neighbor' prefix's dead entries were removed, so these scans should
// come up clean. Text-source and runtime-path parity should also pass.

import { describe, expect, it } from 'vitest';

import { loadCorpus } from '../../../corpus';
import { scan as pressurePrefixScan, SCAN_ID as PRESSURE_ID } from '../pressure-prefix-parity';
import { scan as textSourceScan, SCAN_ID as TEXT_SOURCE_ID } from '../text-source-parity';
import { scan as runtimePathScan, SCAN_ID as RUNTIME_PATH_ID } from '../runtime-path-parity';
import { scan as roundtripScan, SCAN_ID as ROUNDTRIP_ID } from '../reader-writer-roundtrip';

describe('engine parity scans', () => {
  it('pressure-prefix-parity is clean after M7 wired assessment/faction/negotiation writers and removed dead neighbor keys', async () => {
    const corpus = await loadCorpus();
    const findings = pressurePrefixScan(corpus, {});
    for (const f of findings) {
      expect(f.scanId).toBe(PRESSURE_ID);
      expect(f.confidence).toBe('ENGINE_MISMATCH');
    }
    // Every known former-orphan prefix either has a writer now or was
    // deleted. If this regresses, one of the applyPressure() dispatches
    // added in M7 has been reverted.
    expect(findings.length).toBe(0);
    expect(PRESSURE_ID).toBe('engine.pressure-prefix-parity');
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

  it('reader-writer-roundtrip reports no orphan PRESSURE_WEIGHTS prefixes after M7 cleanup', async () => {
    const corpus = await loadCorpus();
    const findings = roundtripScan(corpus, {});
    expect(findings.every((f) => f.scanId === ROUNDTRIP_ID)).toBe(true);
    expect(findings.every((f) => f.confidence === 'ENGINE_MISMATCH')).toBe(true);
    const orphanFindings = findings.filter((f) => f.code === 'PRESSURE_KEY_NO_WRITER');
    expect(orphanFindings).toEqual([]);
    expect(ROUNDTRIP_ID).toBe('engine.reader-writer-roundtrip');
  });
});
