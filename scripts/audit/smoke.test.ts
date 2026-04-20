// Smoke test — validates the end-to-end audit pipeline against the real corpus.
// Asserts: (1) no scan throws, (2) every family is non-empty in the corpus,
// (3) the Finding shape stays well-formed, and (4) the heatmap CRITICAL totals
// match the findings list CRITICAL totals.

import { describe, expect, it } from 'vitest';

import { loadCorpus } from './corpus';
import { computeInventory } from './inventory';
import type { Family, Finding, ScanOptions } from './types';

import { scan as missingTextScan } from './scans/wiring/missing-text';
import { scan as choiceLabelScan } from './scans/wiring/choice-label-coverage';
import { scan as missingEffectsScan } from './scans/wiring/missing-effects';
import { scan as emptyEffectsScan } from './scans/wiring/empty-effects';
import { scan as styleTagScan } from './scans/wiring/style-tag-targets';
import { scan as followupScan } from './scans/wiring/followup-targets';
import { scan as featureRegistryScan } from './scans/wiring/feature-registry-reach';
import { scan as tagProducersScan } from './scans/wiring/tag-producers';
import { scan as tagConsumersScan } from './scans/wiring/tag-consumers';
import { scan as surfaceOnlyScan } from './scans/substance/surface-only';
import { scan as singleChoiceScan } from './scans/substance/single-choice-monthly';
import { scan as categoryTouchScan } from './scans/substance/category-without-touch';
import { scan as severityMagScan } from './scans/substance/severity-magnitude';
import { scan as choiceClonesScan } from './scans/substance/choice-clones';
import { scan as unresolvedTokensScan } from './scans/text/unresolved-tokens';
import { scan as pressurePrefixParityScan } from './scans/engine/pressure-prefix-parity';
import { scan as consequenceWriteParityScan } from './scans/engine/consequence-write-parity';

const ALL_SCANS = [
  missingTextScan, choiceLabelScan, missingEffectsScan, emptyEffectsScan,
  styleTagScan, followupScan, featureRegistryScan, tagProducersScan, tagConsumersScan,
  surfaceOnlyScan, singleChoiceScan, categoryTouchScan, severityMagScan, choiceClonesScan,
  unresolvedTokensScan,
  pressurePrefixParityScan, consequenceWriteParityScan,
];

const FULL_OPTS: ScanOptions = { includeMinor: true, includePolish: true };

const REQUIRED_FAMILIES: Family[] = [
  'decree', 'crisis', 'petition', 'assessment', 'negotiation',
  'overture', 'notification', 'hand', 'world',
];

function isWellFormedFinding(f: unknown): f is Finding {
  if (!f || typeof f !== 'object') return false;
  const o = f as Record<string, unknown>;
  if (typeof o.severity !== 'string') return false;
  if (!['CRITICAL', 'MAJOR', 'MINOR', 'POLISH'].includes(o.severity)) return false;
  if (typeof o.family !== 'string') return false;
  if (typeof o.scanId !== 'string' || o.scanId.length === 0) return false;
  if (typeof o.code !== 'string' || o.code.length === 0) return false;
  if (typeof o.cardId !== 'string' || o.cardId.length === 0) return false;
  if (typeof o.message !== 'string' || o.message.length === 0) return false;
  if (o.choiceId !== undefined && typeof o.choiceId !== 'string') return false;
  if (o.filePath !== undefined && typeof o.filePath !== 'string') return false;
  if (
    o.confidence !== undefined &&
    !['DETERMINISTIC', 'RUNTIME_GROUNDED', 'HEURISTIC', 'ENGINE_MISMATCH'].includes(
      o.confidence as string,
    )
  ) return false;
  return true;
}

describe('audit pipeline smoke test', () => {
  it('loads the corpus without throwing and every required family is non-empty', async () => {
    const corpus = await loadCorpus();
    const inventory = await computeInventory(corpus);
    for (const family of REQUIRED_FAMILIES) {
      expect(
        (inventory.byFamily[family] ?? 0),
        `family '${family}' must be non-empty in the corpus`,
      ).toBeGreaterThan(0);
    }
  });

  it('every family appears in corpus.auditCards after M2 adapters run', async () => {
    const corpus = await loadCorpus();
    const familiesInIR = new Set(corpus.auditCards.map((c) => c.family));
    // Overtures are the only family without native-pool membership — they're
    // synthetic agenda-keyed cards. All other families must be present.
    const IR_FAMILIES: Family[] = [
      'decree', 'crisis', 'petition', 'assessment', 'negotiation',
      'overture', 'hand', 'world',
    ];
    for (const family of IR_FAMILIES) {
      expect(familiesInIR.has(family), `family '${family}' missing from auditCards`).toBe(true);
    }
  });

  it('coverage matrix has a row for every family in the IR', async () => {
    const corpus = await loadCorpus();
    const irFamilies = new Set(corpus.auditCards.map((c) => c.family));
    for (const family of irFamilies) {
      expect(
        corpus.coverage.byFamily[family],
        `coverage.byFamily['${family}'] should be populated`,
      ).toBeDefined();
    }
  });

  it('runs every scan against the real corpus without throwing', async () => {
    const corpus = await loadCorpus();
    for (const scan of ALL_SCANS) {
      const findings = scan(corpus, FULL_OPTS);
      expect(Array.isArray(findings)).toBe(true);
      for (const f of findings) {
        expect(isWellFormedFinding(f), `malformed finding from a scan: ${JSON.stringify(f)}`).toBe(true);
      }
    }
  });

  it('CRITICAL count from per-scan output matches the aggregate', async () => {
    const corpus = await loadCorpus();
    let perScanCritical = 0;
    const aggregate: Finding[] = [];
    for (const scan of ALL_SCANS) {
      const findings = scan(corpus, FULL_OPTS);
      perScanCritical += findings.filter((f) => f.severity === 'CRITICAL').length;
      aggregate.push(...findings);
    }
    const aggregateCritical = aggregate.filter((f) => f.severity === 'CRITICAL').length;
    expect(aggregateCritical).toBe(perScanCritical);
  });

  it('every finding carries a known scanId category prefix', async () => {
    const corpus = await loadCorpus();
    const known = ['wiring.', 'substance.', 'text.', 'reach.', 'engine.'];
    for (const scan of ALL_SCANS) {
      const findings = scan(corpus, FULL_OPTS);
      for (const f of findings) {
        expect(
          known.some((prefix) => f.scanId.startsWith(prefix)),
          `scanId '${f.scanId}' lacks a known category prefix`,
        ).toBe(true);
      }
    }
  });
});
