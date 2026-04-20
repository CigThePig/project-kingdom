// Card Audit — output emitters.
// Writes audit-output/findings.json + findings.md + heatmap.md.
// Findings are pre-sorted by `compareFindings` so reruns produce minimal diffs.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import {
  compareFindings,
  type Family,
  type Finding,
  type FindingSeverity,
} from './types';

const SEVERITY_ORDER: FindingSeverity[] = ['CRITICAL', 'MAJOR', 'MINOR', 'POLISH'];

export interface ReportInputs {
  findings: Finding[];
  scansRun: string[];
  startedAt: string;
  durationMs: number;
}

export async function writeReports(outputDir: string, inputs: ReportInputs): Promise<void> {
  await fs.mkdir(outputDir, { recursive: true });
  const sorted = [...inputs.findings].sort(compareFindings);

  await Promise.all([
    fs.writeFile(path.join(outputDir, 'findings.json'), renderJson(sorted, inputs), 'utf8'),
    fs.writeFile(path.join(outputDir, 'findings.md'), renderMarkdown(sorted, inputs), 'utf8'),
    fs.writeFile(path.join(outputDir, 'heatmap.md'), renderHeatmap(sorted, inputs), 'utf8'),
  ]);
}

// ============================================================
// JSON
// ============================================================

function renderJson(findings: Finding[], inputs: ReportInputs): string {
  const counts = countBySeverity(findings);
  const payload = {
    schemaVersion: 1,
    startedAt: inputs.startedAt,
    durationMs: inputs.durationMs,
    scansRun: inputs.scansRun,
    counts,
    findings,
  };
  return JSON.stringify(payload, null, 2) + '\n';
}

// ============================================================
// findings.md — grouped by family → severity → file
// ============================================================

function renderMarkdown(findings: Finding[], inputs: ReportInputs): string {
  const lines: string[] = [];
  lines.push('# Card Audit — Findings');
  lines.push('');
  lines.push(`Generated ${inputs.startedAt} in ${inputs.durationMs} ms.`);
  lines.push('');
  lines.push(renderCountsTable(findings));
  lines.push('');

  if (findings.length === 0) {
    lines.push('_No findings._');
    return lines.join('\n') + '\n';
  }

  const byFamily = groupBy(findings, (f) => f.family);
  for (const family of [...byFamily.keys()].sort()) {
    lines.push(`## ${family} (${byFamily.get(family)!.length})`);
    lines.push('');
    const bySev = groupBy(byFamily.get(family)!, (f) => f.severity);
    for (const sev of SEVERITY_ORDER) {
      const items = bySev.get(sev);
      if (!items || items.length === 0) continue;
      lines.push(`### ${sev} (${items.length})`);
      lines.push('');
      const byFile = groupBy(items, (f) => f.filePath ?? '(no file)');
      for (const file of [...byFile.keys()].sort()) {
        lines.push(`**${file}**`);
        lines.push('');
        for (const f of byFile.get(file)!) {
          lines.push(formatFindingRow(f));
        }
        lines.push('');
      }
    }
  }
  return lines.join('\n') + '\n';
}

function formatFindingRow(f: Finding): string {
  const choice = f.choiceId ? `:${f.choiceId}` : '';
  const confidence = f.confidence && f.confidence !== 'DETERMINISTIC' ? ` _(${f.confidence})_` : '';
  return `- \`${f.scanId}\` \`${f.code}\` \`${f.cardId}${choice}\`${confidence} — ${f.message}`;
}

// ============================================================
// heatmap.md — rows = files, cols = scan categories
// ============================================================

const CATEGORY_BY_PREFIX: Array<[prefix: string, label: string]> = [
  ['wiring.', 'wiring'],
  ['substance.', 'substance'],
  ['text.', 'text'],
  ['reach.', 'reach'],
  ['engine.', 'engine'],
];

function renderHeatmap(findings: Finding[], _inputs: ReportInputs): string {
  const lines: string[] = [];
  lines.push('# Card Audit — Heatmap');
  lines.push('');
  lines.push('Rows: source files. Columns: scan categories. Cells: finding counts (CRITICAL/MAJOR/MINOR/POLISH summed).');
  lines.push('');

  const categories = CATEGORY_BY_PREFIX.map(([, label]) => label);
  const counts = new Map<string, Map<string, number>>(); // file -> category -> count

  for (const f of findings) {
    const file = f.filePath ?? '(no file)';
    const category = categoryOf(f.scanId);
    let row = counts.get(file);
    if (!row) {
      row = new Map();
      counts.set(file, row);
    }
    row.set(category, (row.get(category) ?? 0) + 1);
  }

  if (counts.size === 0) {
    lines.push('_No findings._');
    return lines.join('\n') + '\n';
  }

  lines.push(`| file | total | ${categories.join(' | ')} |`);
  lines.push(`|---|---:|${categories.map(() => '---:').join('|')}|`);

  const filesSortedByTotal = [...counts.entries()]
    .map(([file, row]) => ({
      file,
      total: [...row.values()].reduce((s, v) => s + v, 0),
      row,
    }))
    .sort((a, b) => b.total - a.total || a.file.localeCompare(b.file));

  for (const { file, total, row } of filesSortedByTotal) {
    const cells = categories.map((c) => String(row.get(c) ?? 0));
    lines.push(`| ${file} | ${total} | ${cells.join(' | ')} |`);
  }
  return lines.join('\n') + '\n';
}

function categoryOf(scanId: string): string {
  for (const [prefix, label] of CATEGORY_BY_PREFIX) {
    if (scanId.startsWith(prefix)) return label;
  }
  return 'other';
}

// ============================================================
// Helpers
// ============================================================

export function countBySeverity(findings: Finding[]): Record<FindingSeverity, number> {
  const out: Record<FindingSeverity, number> = { CRITICAL: 0, MAJOR: 0, MINOR: 0, POLISH: 0 };
  for (const f of findings) out[f.severity]++;
  return out;
}

export function countByFamily(findings: Finding[]): Record<Family, number> {
  const out = {} as Record<Family, number>;
  for (const f of findings) out[f.family] = (out[f.family] ?? 0) + 1;
  return out;
}

function renderCountsTable(findings: Finding[]): string {
  const counts = countBySeverity(findings);
  return [
    '| severity | count |',
    '|---|---:|',
    ...SEVERITY_ORDER.map((s) => `| ${s} | ${counts[s]} |`),
    `| **total** | **${findings.length}** |`,
  ].join('\n');
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = out.get(k);
    if (list) list.push(item);
    else out.set(k, [item]);
  }
  return out;
}
