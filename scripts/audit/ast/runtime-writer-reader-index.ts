// Writer/reader index — one-shot lazy singleton that scans the ts-morph
// project for every engine write site relevant to the audit scanner:
//
//   - applyPressure(...)                — pressure writers
//   - persistentConsequences.push/filter — consequence-tag writers
//   - activeTemporaryModifiers refs     — temp-modifier writers
//   - diplomaticBonds refs / createBond  — bond writers
//   - EVENT_CHOICE_TEMPORARY_MODIFIERS refs — registry reads
//
// Each entry carries the source location so scans can point authors at the
// exact line that disagrees with the scanner's model. This replaces the
// regex-over-text approach used by M1.2 scans with a structural one, and is
// what M5's engine-parity scans upgrade to.

import { tsquery } from '@phenomnomnominal/tsquery';
import type { Node, SourceFile } from 'ts-morph';

import { getAuditProject } from './project';
import * as Q from './queries';

export interface WriteSite {
  filePath: string;
  line: number;
  column: number;
  /** Text snippet for the matched expression — used in finding messages. */
  snippet: string;
}

export interface PressureWriteSite extends WriteSite {
  /** Literal source-type argument, if the scan could extract it. */
  sourceType?: string;
}

export interface WriterReaderIndex {
  /** Every `applyPressure(...)` call found across the project. */
  pressureWrites: PressureWriteSite[];
  /**
   * `persistentConsequences: [...old, new]` assignments — the engine's
   * immutable spread-append shape. Same write-site role as a `.push()` call
   * would be, just expressed differently in this codebase.
   */
  consequenceWriteSites: WriteSite[];
  /** `persistentConsequences.filter(...)` call sites. */
  consequenceFilterSites: WriteSite[];
  /** Files that reference `activeTemporaryModifiers` (read or write). */
  temporaryModifierRefs: WriteSite[];
  /** Files that reference `diplomaticBonds` or call createBond. */
  bondRefs: WriteSite[];
  /** Files that reference the `EVENT_CHOICE_TEMPORARY_MODIFIERS` registry. */
  temporaryModifierRegistryRefs: WriteSite[];
}

let cached: WriterReaderIndex | null = null;

export function getWriterReaderIndex(): WriterReaderIndex {
  if (cached) return cached;
  const project = getAuditProject();
  const sources = project.getSourceFiles().filter((sf) => {
    const fp = sf.getFilePath();
    // Scope to production source — tests and scanner internals would create
    // false positives in the reader/writer set.
    return fp.includes('/src/') && !fp.includes('/__tests__/') && !fp.endsWith('.test.ts');
  });

  const pressureWrites: PressureWriteSite[] = [];
  const consequenceWriteSites: WriteSite[] = [];
  const consequenceFilterSites: WriteSite[] = [];
  const temporaryModifierRefs: WriteSite[] = [];
  const bondRefs: WriteSite[] = [];
  const temporaryModifierRegistryRefs: WriteSite[] = [];

  for (const sf of sources) {
    collectApplyPressure(sf, pressureWrites);
    collectSimple(sf, Q.PERSISTENT_CONSEQUENCES_ASSIGN, consequenceWriteSites);
    collectSimple(sf, Q.PERSISTENT_CONSEQUENCES_FILTER, consequenceFilterSites);
    collectSimple(sf, Q.TEMP_MODIFIER_REF, temporaryModifierRefs);
    collectSimple(sf, Q.BOND_REF, bondRefs);
    collectSimple(sf, Q.CREATE_BOND, bondRefs);
    collectSimple(sf, Q.TEMP_MODIFIER_REGISTRY_REF, temporaryModifierRegistryRefs);
  }

  cached = {
    pressureWrites,
    consequenceWriteSites,
    consequenceFilterSites,
    temporaryModifierRefs,
    bondRefs,
    temporaryModifierRegistryRefs,
  };
  return cached;
}

/** Reset — only used by tests. */
export function __resetWriterReaderIndexForTests(): void {
  cached = null;
}

// ============================================================
// Internal collectors
// ============================================================

function collectSimple(sf: SourceFile, selector: string, bucket: WriteSite[]): void {
  const matches = tsquery(sf.compilerNode, selector) as unknown as Node[];
  for (const match of matches) {
    bucket.push(toWriteSite(sf, match));
  }
}

function collectApplyPressure(sf: SourceFile, bucket: PressureWriteSite[]): void {
  const matches = tsquery(sf.compilerNode, Q.APPLY_PRESSURE) as unknown as Node[];
  for (const match of matches) {
    const site: PressureWriteSite = toWriteSite(sf, match);
    // Arg 1 (0-indexed) is the source-type string literal in
    // `applyPressure(state, 'event' | 'storyline' | 'decree', ...)`.
    // ts-morph CallExpression -> getArguments()[1]; we fall back to text
    // extraction if the node shape doesn't match.
    const callExprText = site.snippet;
    const sourceTypeMatch = callExprText.match(/applyPressure\s*\([^,]+,\s*['"]([a-z_]+)['"]/);
    if (sourceTypeMatch) site.sourceType = sourceTypeMatch[1];
    bucket.push(site);
  }
}

function toWriteSite(sf: SourceFile, node: Node | { getStart: () => number; getText: () => string }): WriteSite {
  const start = (node as { getStart: (sf?: unknown) => number }).getStart(sf.compilerNode);
  const lc = sf.getLineAndColumnAtPos(start);
  const rawText = (node as { getText: () => string }).getText();
  const snippet = rawText.length > 160 ? rawText.slice(0, 160) + '…' : rawText;
  return {
    filePath: relativizePath(sf.getFilePath()),
    line: lc.line,
    column: lc.column,
    snippet,
  };
}

function relativizePath(absolute: string): string {
  const cwd = process.cwd() + '/';
  return absolute.startsWith(cwd) ? absolute.slice(cwd.length) : absolute;
}
