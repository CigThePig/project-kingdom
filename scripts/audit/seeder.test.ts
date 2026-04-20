// Seeder tests — Phase 7 contract:
//  - Coverage matrix is inlined inside the AUTO_GENERATED block.
//  - Confidence column is present in the seeded table header.
//  - Old 7-column tables migrate to 8 columns while preserving outcome/notes.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

import { describe, expect, it } from 'vitest';

import type { CoverageMatrix } from './coverage/matrix';
import { seedArtifacts } from './seeder';
import type { Family, Finding } from './types';

function mkCoverage(): CoverageMatrix {
  const row = {
    textCoverage: { total: 2, withCoverage: 2, coveragePct: 100 },
    effectCoverage: { total: 2, withCoverage: 2, coveragePct: 100 },
    runtimeDiffCoverage: { total: 2, withCoverage: 1, coveragePct: 50 },
    pressureCoverage: { total: 2, withCoverage: 0, coveragePct: 0 },
    consequenceCoverage: { total: 2, withCoverage: 0, coveragePct: 0 },
    generatedFamilyCoverage: { total: 2, withCoverage: 0, coveragePct: 0 },
    astSemanticCoverage: { total: 2, withCoverage: 0, coveragePct: 0 },
    previewParityCoverage: { total: 0, withCoverage: 0, coveragePct: 0 },
  };
  return {
    overall: row,
    byFamily: { petition: row },
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
    message: 'sample message',
    ...overrides,
  };
}

function totalsByFamily(overrides: Partial<Record<Family, number>> = {}): Record<Family, number> {
  return {
    decree: 0,
    crisis: 0,
    petition: 0,
    assessment: 0,
    negotiation: 0,
    overture: 0,
    notification: 0,
    hand: 0,
    world: 0,
    unknown: 0,
    ...overrides,
  };
}

describe('seeder — Phase 7 output shape', () => {
  it('writes a coverage matrix inside the auto-generated block and an 8-column table', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-seeder-'));
    try {
      await seedArtifacts(dir, {
        findings: [mkFinding({ confidence: 'RUNTIME_GROUNDED' })],
        totalsByFamily: totalsByFamily({ petition: 2 }),
        lastScanAt: '2026-04-20T00:00:00.000Z',
        coverage: mkCoverage(),
      });
      const content = await fs.readFile(path.join(dir, 'findings', 'petitions.md'), 'utf8');
      expect(content).toContain('<!-- AUTO-GENERATED:START -->');
      expect(content).toContain('| Coverage area | Status |');
      expect(content).toContain('| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |');
      expect(content).toContain('RUNTIME_GROUNDED');
      // Auto-generated marker still wraps the block.
      expect(content).toContain('<!-- AUTO-GENERATED:END -->');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it('materializes DETERMINISTIC when the scan omitted a confidence', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-seeder-'));
    try {
      await seedArtifacts(dir, {
        findings: [mkFinding()],
        totalsByFamily: totalsByFamily({ petition: 1 }),
        lastScanAt: '2026-04-20T00:00:00.000Z',
        coverage: mkCoverage(),
      });
      const content = await fs.readFile(path.join(dir, 'findings', 'petitions.md'), 'utf8');
      expect(content).toContain('DETERMINISTIC');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});

describe('seeder — back-compat migration', () => {
  it('preserves outcome/notes when the prior file used the 7-column shape', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-seeder-'));
    try {
      const findingsDir = path.join(dir, 'findings');
      await fs.mkdir(findingsDir, { recursive: true });
      const existing = [
        '---',
        'family: petition',
        'totalCards: 1',
        'status: in-progress',
        'lastScan: 2025-01-01T00:00:00.000Z',
        '---',
        '',
        '# Petition — Audit findings',
        '',
        '<!-- AUTO-GENERATED:START -->',
        '',
        '| cardId | choiceId | severity | scanId | message | outcome | notes |',
        '|---|---|---|---|---|---|---|',
        '| evt_sample | grant | MAJOR | substance.surface-only | sample message | retext | handled already |',
        '',
        '<!-- AUTO-GENERATED:END -->',
        '',
      ].join('\n');
      await fs.writeFile(path.join(findingsDir, 'petitions.md'), existing, 'utf8');

      await seedArtifacts(dir, {
        findings: [mkFinding()],
        totalsByFamily: totalsByFamily({ petition: 1 }),
        lastScanAt: '2026-04-20T00:00:00.000Z',
        coverage: mkCoverage(),
      });

      const content = await fs.readFile(path.join(findingsDir, 'petitions.md'), 'utf8');
      // Outcome and notes survive the migration to the 8-column shape.
      expect(content).toContain('retext');
      expect(content).toContain('handled already');
      // Status is preserved.
      expect(content).toContain('status: in-progress');
      // New 8-column header is now in place.
      expect(content).toContain('| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it('preserves outcome/notes across an 8-column reseed', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'audit-seeder-'));
    try {
      // First run: writes the 8-column shape with empty outcome/notes.
      await seedArtifacts(dir, {
        findings: [mkFinding()],
        totalsByFamily: totalsByFamily({ petition: 1 }),
        lastScanAt: '2026-04-20T00:00:00.000Z',
        coverage: mkCoverage(),
      });
      const filePath = path.join(dir, 'findings', 'petitions.md');
      const original = await fs.readFile(filePath, 'utf8');
      // Hand-edit the outcome and notes in place.
      const edited = original.replace(
        /\| evt_sample \| grant \| MAJOR \| DETERMINISTIC \| substance.surface-only \| sample message \|\s*\|\s*\|/,
        '| evt_sample | grant | MAJOR | DETERMINISTIC | substance.surface-only | sample message | re-effect | needs follow-up |',
      );
      expect(edited).not.toBe(original);
      await fs.writeFile(filePath, edited, 'utf8');

      // Second run: seeder must preserve the edited cells.
      await seedArtifacts(dir, {
        findings: [mkFinding()],
        totalsByFamily: totalsByFamily({ petition: 1 }),
        lastScanAt: '2026-04-21T00:00:00.000Z',
        coverage: mkCoverage(),
      });
      const reseeded = await fs.readFile(filePath, 'utf8');
      expect(reseeded).toContain('re-effect');
      expect(reseeded).toContain('needs follow-up');
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
