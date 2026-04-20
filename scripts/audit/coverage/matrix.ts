// Per-family coverage matrix — aggregates AuditCoverageFlags across every
// AuditCard in a family, reporting {total, withCoverage, coveragePct} for
// each dimension. The matrix is populated during corpus load and exposed as
// `corpus.coverage`; markdown/JSON rendering lands in Phase 7 (out of scope
// for the foundation branch).
//
// Downstream use:
//   - Phase 4 engine-reality scans gate structural claims on per-card
//     coverage flags (a false pressureCoverage means the scanner has no
//     signal and must not emit a pressure-related finding).
//   - Phase 7 renders this matrix into docs/audit/coverage.md so authors
//     see at a glance which dimensions are still dark for their family.

import type { AuditCard, AuditCoverageFlags } from '../ir';
import type { Family } from '../types';

export type CoverageDimension = keyof AuditCoverageFlags;

export const COVERAGE_DIMENSIONS: CoverageDimension[] = [
  'textCoverage',
  'effectCoverage',
  'runtimeDiffCoverage',
  'pressureCoverage',
  'consequenceCoverage',
  'generatedFamilyCoverage',
  'astSemanticCoverage',
  'previewParityCoverage',
];

export interface CoverageCell {
  total: number;
  withCoverage: number;
  /** withCoverage / total rounded to 1 decimal place; 0 when total === 0. */
  coveragePct: number;
}

export type CoverageRow = Record<CoverageDimension, CoverageCell>;

export type CoverageMatrix = {
  byFamily: Partial<Record<Family, CoverageRow>>;
  overall: CoverageRow;
};

function emptyRow(): CoverageRow {
  const row = {} as CoverageRow;
  for (const d of COVERAGE_DIMENSIONS) {
    row[d] = { total: 0, withCoverage: 0, coveragePct: 0 };
  }
  return row;
}

function finalize(row: CoverageRow): CoverageRow {
  for (const d of COVERAGE_DIMENSIONS) {
    const cell = row[d];
    cell.coveragePct = cell.total === 0 ? 0 : Math.round((cell.withCoverage / cell.total) * 1000) / 10;
  }
  return row;
}

export function buildCoverageMatrix(cards: AuditCard[]): CoverageMatrix {
  const byFamily: Partial<Record<Family, CoverageRow>> = {};
  const overall = emptyRow();

  for (const card of cards) {
    const row = byFamily[card.family] ?? emptyRow();
    for (const d of COVERAGE_DIMENSIONS) {
      row[d].total += 1;
      overall[d].total += 1;
      if (card.coverage[d]) {
        row[d].withCoverage += 1;
        overall[d].withCoverage += 1;
      }
    }
    byFamily[card.family] = row;
  }

  for (const family of Object.keys(byFamily) as Family[]) {
    finalize(byFamily[family]!);
  }
  finalize(overall);

  return { byFamily, overall };
}
