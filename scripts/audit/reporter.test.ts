// Reporter rendering tests — guards Phase 7 contract:
//  - JSON payload validates as FindingsReport schemaVersion 2.
//  - Markdown output includes per-family and overall coverage tables.
//  - Every finding row carries an explicit confidence suffix.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

import { describe, expect, it } from 'vitest';

import type { CoverageMatrix } from './coverage/matrix';
import { validateFindingsReport } from './ir-schema';
import { writeReports, coverageStatus, renderCoverageTable } from './reporter';
import type { Finding } from './types';

function mkCoverage(): CoverageMatrix {
  const fullRow = {
    textCoverage: { total: 3, withCoverage: 3, coveragePct: 100 },
    effectCoverage: { total: 3, withCoverage: 3, coveragePct: 100 },
    runtimeDiffCoverage: { total: 3, withCoverage: 2, coveragePct: 66.7 },
    pressureCoverage: { total: 3, withCoverage: 0, coveragePct: 0 },
    consequenceCoverage: { total: 3, withCoverage: 0, coveragePct: 0 },
    generatedFamilyCoverage: { total: 3, withCoverage: 0, coveragePct: 0 },
    astSemanticCoverage: { total: 3, withCoverage: 3, coveragePct: 100 },
    previewParityCoverage: { total: 0, withCoverage: 0, coveragePct: 0 },
  };
  return {
    overall: fullRow,
    byFamily: { petition: fullRow },
  };
}

function mkFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    severity: 'MAJOR',
    family: 'petition',
    scanId: 'substance.surface-only',
    code: 'SURFACE_ONLY',
    cardId: 'evt_sample',
    choiceId: 'grant',
    filePath: 'src/data/events/sample.ts',
    message: 'Sample finding for test',
    ...overrides,
  };
}

describe('reporter — coverage status helper', () => {
  it('returns covered for >= 95%', () => {
    expect(coverageStatus({ total: 10, withCoverage: 10, coveragePct: 100 })).toBe('covered (100%)');
    expect(coverageStatus({ total: 10, withCoverage: 10, coveragePct: 95 })).toBe('covered (95%)');
  });

  it('returns partial for > 0 and < 95', () => {
    expect(coverageStatus({ total: 10, withCoverage: 6, coveragePct: 60 })).toBe('partial (60%)');
    expect(coverageStatus({ total: 3, withCoverage: 2, coveragePct: 66.7 })).toBe('partial (66.7%)');
  });

  it('returns not covered for 0%', () => {
    expect(coverageStatus({ total: 5, withCoverage: 0, coveragePct: 0 })).toBe('not covered (0%)');
  });

  it('returns n/a when total is 0', () => {
    expect(coverageStatus({ total: 0, withCoverage: 0, coveragePct: 0 })).toBe('n/a');
  });
});

describe('reporter — renderCoverageTable', () => {
  it('emits every dimension with a status cell', () => {
    const cov = mkCoverage();
    const lines = renderCoverageTable(cov.overall);
    expect(lines[0]).toBe('| Coverage area | Status |');
    expect(lines.some((l) => l.includes('text integrity'))).toBe(true);
    expect(lines.some((l) => l.includes('pressure parity'))).toBe(true);
    expect(lines.some((l) => l.includes('preview parity'))).toBe(true);
  });
});

describe('reporter — writeReports end to end', () => {
  it('writes findings.json validating as FindingsReport schemaVersion 2', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-reporter-'));
    try {
      const findings: Finding[] = [
        mkFinding(),
        mkFinding({ scanId: 'engine.text-source-parity', confidence: 'ENGINE_MISMATCH', code: 'TEXT_SOURCE_MISMATCH' }),
      ];
      await writeReports(dir, {
        findings,
        scansRun: ['substance.surface-only', 'engine.text-source-parity'],
        startedAt: '2026-04-20T00:00:00.000Z',
        durationMs: 42,
        coverage: mkCoverage(),
      });

      const rawJson = await fs.readFile(path.join(dir, 'findings.json'), 'utf8');
      const parsed = JSON.parse(rawJson);
      expect(() => validateFindingsReport(parsed)).not.toThrow();
      expect(parsed.schemaVersion).toBe(2);
      expect(parsed.countsByConfidence.ENGINE_MISMATCH).toBe(1);
      expect(parsed.countsByConfidence.DETERMINISTIC).toBe(1);

      const md = await fs.readFile(path.join(dir, 'findings.md'), 'utf8');
      expect(md).toContain('## Coverage (overall)');
      expect(md).toContain('## petition (2)');
      expect(md).toContain('**Coverage**');
      // Both confidences must appear in the rendered finding rows.
      expect(md).toContain('_(DETERMINISTIC)_');
      expect(md).toContain('_(ENGINE_MISMATCH)_');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it('materializes implicit DETERMINISTIC confidence in the JSON output', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-reporter-'));
    try {
      await writeReports(dir, {
        findings: [mkFinding()], // no explicit confidence field
        scansRun: ['substance.surface-only'],
        startedAt: '2026-04-20T00:00:00.000Z',
        durationMs: 1,
        coverage: mkCoverage(),
      });
      const parsed = JSON.parse(await fs.readFile(path.join(dir, 'findings.json'), 'utf8'));
      expect(parsed.findings[0].confidence).toBe('DETERMINISTIC');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
