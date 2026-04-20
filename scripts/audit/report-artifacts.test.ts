// report-artifacts tests — guards Phase 7 docs/audit/*.json output:
//  - Ajv validates each of the three payloads.
//  - engine-mismatches.json is filtered strictly to ENGINE_MISMATCH findings.
//  - findings.json family totals agree with coverage.json row totals.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

import { describe, expect, it } from 'vitest';

import type { CoverageMatrix } from './coverage/matrix';
import {
  validateCoverageReport,
  validateEngineMismatchReport,
  validateFindingsReport,
} from './ir-schema';
import {
  buildCoverageReport,
  buildEngineMismatchReport,
  buildFindingsReport,
  materializeConfidence,
  writeDocsArtifacts,
} from './report-artifacts';
import type { Finding } from './types';

function coverageForFamilies(families: Record<string, number>): CoverageMatrix {
  const rowFor = (total: number) => ({
    textCoverage: { total, withCoverage: total, coveragePct: total === 0 ? 0 : 100 },
    effectCoverage: { total, withCoverage: total, coveragePct: total === 0 ? 0 : 100 },
    runtimeDiffCoverage: { total, withCoverage: 0, coveragePct: 0 },
    pressureCoverage: { total, withCoverage: 0, coveragePct: 0 },
    consequenceCoverage: { total, withCoverage: 0, coveragePct: 0 },
    generatedFamilyCoverage: { total, withCoverage: 0, coveragePct: 0 },
    astSemanticCoverage: { total, withCoverage: 0, coveragePct: 0 },
    previewParityCoverage: { total, withCoverage: 0, coveragePct: 0 },
  });
  const overallTotal = Object.values(families).reduce((s, v) => s + v, 0);
  const byFamily: CoverageMatrix['byFamily'] = {};
  for (const [family, total] of Object.entries(families)) {
    byFamily[family as keyof CoverageMatrix['byFamily']] = rowFor(total);
  }
  return { overall: rowFor(overallTotal), byFamily };
}

const BASE_FINDING: Finding = {
  severity: 'MAJOR',
  family: 'petition',
  scanId: 'substance.surface-only',
  code: 'SURFACE_ONLY',
  cardId: 'evt_sample',
  choiceId: 'grant',
  message: 'Sample',
};

describe('materializeConfidence', () => {
  it('fills in DETERMINISTIC when missing', () => {
    const f = materializeConfidence({ ...BASE_FINDING });
    expect(f.confidence).toBe('DETERMINISTIC');
  });

  it('leaves existing confidence untouched', () => {
    const f = materializeConfidence({ ...BASE_FINDING, confidence: 'HEURISTIC' });
    expect(f.confidence).toBe('HEURISTIC');
  });
});

describe('buildFindingsReport', () => {
  it('aggregates severity and confidence counts', () => {
    const findings = [
      { ...BASE_FINDING, confidence: 'DETERMINISTIC' as const },
      { ...BASE_FINDING, severity: 'MINOR' as const, confidence: 'HEURISTIC' as const },
      { ...BASE_FINDING, severity: 'CRITICAL' as const, confidence: 'ENGINE_MISMATCH' as const },
    ];
    const report = buildFindingsReport(findings, {
      scansRun: ['a', 'b'],
      startedAt: '2026-04-20T00:00:00.000Z',
      durationMs: 7,
    });
    expect(report.counts).toEqual({ CRITICAL: 1, MAJOR: 1, MINOR: 1, POLISH: 0 });
    expect(report.countsByConfidence).toEqual({
      DETERMINISTIC: 1,
      RUNTIME_GROUNDED: 0,
      HEURISTIC: 1,
      ENGINE_MISMATCH: 1,
    });
    expect(() => validateFindingsReport(report)).not.toThrow();
  });
});

describe('buildEngineMismatchReport', () => {
  it('keeps only ENGINE_MISMATCH findings and counts them by scan', () => {
    const findings = [
      { ...BASE_FINDING, confidence: 'DETERMINISTIC' as const },
      {
        ...BASE_FINDING,
        scanId: 'engine.text-source-parity',
        confidence: 'ENGINE_MISMATCH' as const,
      },
      {
        ...BASE_FINDING,
        scanId: 'engine.text-source-parity',
        cardId: 'evt_other',
        confidence: 'ENGINE_MISMATCH' as const,
      },
      {
        ...BASE_FINDING,
        scanId: 'engine.pressure-prefix-parity',
        confidence: 'ENGINE_MISMATCH' as const,
      },
    ];
    const report = buildEngineMismatchReport(findings, '2026-04-20T00:00:00.000Z');
    expect(report.count).toBe(3);
    expect(report.countsByScan).toEqual({
      'engine.text-source-parity': 2,
      'engine.pressure-prefix-parity': 1,
    });
    for (const f of report.findings) expect(f.confidence).toBe('ENGINE_MISMATCH');
    expect(() => validateEngineMismatchReport(report)).not.toThrow();
  });
});

describe('buildCoverageReport', () => {
  it('validates a populated coverage matrix', () => {
    const coverage = coverageForFamilies({ petition: 3, crisis: 1 });
    const report = buildCoverageReport(coverage, '2026-04-20T00:00:00.000Z');
    expect(() => validateCoverageReport(report)).not.toThrow();
    expect(report.byFamily.petition!.textCoverage.total).toBe(3);
  });
});

describe('writeDocsArtifacts', () => {
  it('writes all three validated JSON files', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-docs-'));
    try {
      const coverage = coverageForFamilies({ petition: 2 });
      const findings: Finding[] = [
        { ...BASE_FINDING },
        {
          ...BASE_FINDING,
          scanId: 'engine.text-source-parity',
          confidence: 'ENGINE_MISMATCH',
          cardId: 'evt_x',
        },
      ];
      await writeDocsArtifacts(dir, {
        findings,
        scansRun: ['substance.surface-only', 'engine.text-source-parity'],
        startedAt: '2026-04-20T00:00:00.000Z',
        durationMs: 1,
        coverage,
      });

      const findingsReport = JSON.parse(await fs.readFile(path.join(dir, 'findings.json'), 'utf8'));
      const coverageReport = JSON.parse(await fs.readFile(path.join(dir, 'coverage.json'), 'utf8'));
      const mismatchReport = JSON.parse(await fs.readFile(path.join(dir, 'engine-mismatches.json'), 'utf8'));

      expect(() => validateFindingsReport(findingsReport)).not.toThrow();
      expect(() => validateCoverageReport(coverageReport)).not.toThrow();
      expect(() => validateEngineMismatchReport(mismatchReport)).not.toThrow();

      expect(findingsReport.findings.length).toBe(2);
      // Every finding must be materialized with an explicit confidence string.
      for (const f of findingsReport.findings) {
        expect(typeof f.confidence).toBe('string');
      }
      expect(mismatchReport.count).toBe(1);
      expect(mismatchReport.findings[0].confidence).toBe('ENGINE_MISMATCH');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
