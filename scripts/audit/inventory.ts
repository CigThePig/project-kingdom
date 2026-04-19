// Card Audit — corpus census (§E of the plan).
// Distinct from §13 scans: produces the per-family / per-file / severity-
// distribution / category-distribution counts that feed §11.2 sub-batching
// decisions during the manual audit.
//
// Outputs audit-output/inventory.md and inventory.json.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import { loadCorpus } from './corpus';
import type { Corpus, Family } from './types';
import { EventSeverity, EventCategory, DecreeCategory } from '../../src/engine/types';

export interface InventoryReport {
  generatedAt: string;
  totals: {
    decrees: number;
    events: number;
    followUps: number;
    assessments: number;
    negotiations: number;
    worldEvents: number;
    handCards: number;
  };
  byFamily: Record<Family, number>;
  byFile: Array<{ file: string; count: number }>;
  eventsBySeverity: Record<EventSeverity, number>;
  eventsByCategory: Record<EventCategory, number>;
  decreesByCategory: Record<DecreeCategory, number>;
  decreesByRarity: { repeatable: number; oneshot: number; chained: number };
  singleChoiceCardCount: number;
  followUpEdgeCount: number;
  topFilesByCardCount: Array<{ file: string; count: number }>;
}

export async function computeInventory(corpus: Corpus): Promise<InventoryReport> {
  const totals = {
    decrees: corpus.decrees.pool.length,
    events: corpus.events.pool.length,
    followUps: corpus.events.followUpPool.length,
    assessments: corpus.assessments.pool.length,
    negotiations: corpus.negotiations.pool.length,
    worldEvents: corpus.worldEvents.defs.length,
    handCards: corpus.handCards.length,
  };

  const byFamily: Record<Family, number> = {} as Record<Family, number>;
  for (const fam of corpus.familyByCardId.values()) byFamily[fam] = (byFamily[fam] ?? 0) + 1;

  const fileCounts = new Map<string, number>();
  for (const file of corpus.filePathByCardId.values()) {
    fileCounts.set(file, (fileCounts.get(file) ?? 0) + 1);
  }
  const byFile = [...fileCounts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));

  const eventsBySeverity: Record<EventSeverity, number> = {
    [EventSeverity.Informational]: 0,
    [EventSeverity.Notable]: 0,
    [EventSeverity.Serious]: 0,
    [EventSeverity.Critical]: 0,
  };
  const eventsByCategory: Record<EventCategory, number> = newCategoryRecord();

  for (const ev of corpus.eventById.values()) {
    eventsBySeverity[ev.severity] = (eventsBySeverity[ev.severity] ?? 0) + 1;
    eventsByCategory[ev.category] = (eventsByCategory[ev.category] ?? 0) + 1;
  }

  const decreesByCategory: Record<DecreeCategory, number> = newDecreeCategoryRecord();
  let repeatable = 0;
  let chained = 0;
  for (const d of corpus.decrees.pool) {
    decreesByCategory[d.category] = (decreesByCategory[d.category] ?? 0) + 1;
    if (d.isRepeatable) repeatable++;
    if (d.chainId) chained++;
  }
  const oneshot = corpus.decrees.pool.length - repeatable;

  let singleChoiceCardCount = 0;
  for (const ev of corpus.eventById.values()) {
    if (ev.choices.length === 1) singleChoiceCardCount++;
  }

  let followUpEdgeCount = 0;
  for (const ev of corpus.eventById.values()) {
    followUpEdgeCount += (ev.followUpEvents ?? []).length;
  }

  return {
    generatedAt: new Date().toISOString(),
    totals,
    byFamily,
    byFile,
    eventsBySeverity,
    eventsByCategory,
    decreesByCategory,
    decreesByRarity: { repeatable, oneshot, chained },
    singleChoiceCardCount,
    followUpEdgeCount,
    topFilesByCardCount: byFile.slice(0, 10),
  };
}

export function renderInventoryMarkdown(report: InventoryReport): string {
  const lines: string[] = [];
  lines.push('# Card Audit — Inventory');
  lines.push('');
  lines.push(`Generated ${report.generatedAt}.`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push('| pool | count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(report.totals)) lines.push(`| ${k} | ${v} |`);
  lines.push('');

  lines.push('## By family');
  lines.push('');
  lines.push('| family | count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(report.byFamily).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Events by severity');
  lines.push('');
  lines.push('| severity | count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(report.eventsBySeverity)) lines.push(`| ${k} | ${v} |`);
  lines.push('');

  lines.push('## Events by category');
  lines.push('');
  lines.push('| category | count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(report.eventsByCategory).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Decrees by category');
  lines.push('');
  lines.push('| category | count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(report.decreesByCategory).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Decrees by rarity');
  lines.push('');
  lines.push('| rarity | count |');
  lines.push('|---|---:|');
  lines.push(`| repeatable | ${report.decreesByRarity.repeatable} |`);
  lines.push(`| one-shot | ${report.decreesByRarity.oneshot} |`);
  lines.push(`| chained (any tier) | ${report.decreesByRarity.chained} |`);
  lines.push('');

  lines.push('## Pattern C preview');
  lines.push('');
  lines.push(`Single-choice cards across all event pools: **${report.singleChoiceCardCount}**.`);
  lines.push(`Total follow-up graph edges: **${report.followUpEdgeCount}**.`);
  lines.push('');

  lines.push('## Top 10 files by card count');
  lines.push('');
  lines.push('| file | count |');
  lines.push('|---|---:|');
  for (const r of report.topFilesByCardCount) lines.push(`| ${r.file} | ${r.count} |`);
  lines.push('');

  return lines.join('\n') + '\n';
}

function newCategoryRecord(): Record<EventCategory, number> {
  const out: Record<string, number> = {};
  for (const v of Object.values(EventCategory)) out[v] = 0;
  return out as Record<EventCategory, number>;
}

function newDecreeCategoryRecord(): Record<DecreeCategory, number> {
  const out: Record<string, number> = {};
  for (const v of Object.values(DecreeCategory)) out[v] = 0;
  return out as Record<DecreeCategory, number>;
}

// ============================================================
// CLI entrypoint — `npm run audit:inventory`
// ============================================================

async function main(): Promise<void> {
  const outputDir = path.resolve(process.cwd(), 'audit-output');
  await fs.mkdir(outputDir, { recursive: true });
  const corpus = await loadCorpus();
  const report = await computeInventory(corpus);
  await fs.writeFile(
    path.join(outputDir, 'inventory.json'),
    JSON.stringify(report, null, 2) + '\n',
    'utf8',
  );
  await fs.writeFile(
    path.join(outputDir, 'inventory.md'),
    renderInventoryMarkdown(report),
    'utf8',
  );
  // eslint-disable-next-line no-console
  console.log(`Inventory written to ${path.relative(process.cwd(), outputDir)}/`);
}

const invokedDirectly = (() => {
  try {
    const url = new URL(`file://${process.argv[1] ?? ''}`).pathname;
    return import.meta.url === `file://${url}` || import.meta.url.endsWith(url);
  } catch {
    return false;
  }
})();
if (invokedDirectly) {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
