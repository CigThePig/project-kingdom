// Card Audit — artifact seeder.
//
// Writes / updates docs/audit/findings/<family>.md and migration-list.md with
// candidate finding rows from the scan results. Existing `outcome` and `notes`
// columns are preserved across reruns: the seeder only touches the rows
// inside the `<!-- AUTO-GENERATED:START --> ... END -->` block, and within
// that block it preserves any human-edited cells when the row's cardId is
// already present.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import type { Family, Finding } from './types';

const AUTO_BEGIN = '<!-- AUTO-GENERATED:START -->';
const AUTO_END = '<!-- AUTO-GENERATED:END -->';

const FAMILIES: Family[] = [
  'decree',
  'crisis',
  'petition',
  'assessment',
  'negotiation',
  'overture',
  'notification',
  'hand',
];

const FAMILY_FILES: Record<Family, string> = {
  decree: 'decrees.md',
  crisis: 'crises.md',
  petition: 'petitions.md',
  assessment: 'assessments.md',
  negotiation: 'negotiations.md',
  overture: 'overtures.md',
  notification: 'notifications.md',
  hand: 'hand-cards.md',
  // The audit doesn't allocate per-family files for these; their findings
  // still appear in audit-output, just not in a docs/audit/findings file.
  world: 'world-events.md',
  unknown: 'unknown.md',
};

export interface SeedInputs {
  findings: Finding[];
  totalsByFamily: Record<Family, number>;
  lastScanAt: string;
}

export async function seedArtifacts(
  docsAuditDir: string,
  inputs: SeedInputs,
): Promise<void> {
  await fs.mkdir(path.join(docsAuditDir, 'findings'), { recursive: true });

  for (const family of FAMILIES) {
    const file = path.join(docsAuditDir, 'findings', FAMILY_FILES[family]);
    const findings = inputs.findings.filter((f) => f.family === family);
    await writeFamilyFile(file, family, findings, inputs.totalsByFamily[family] ?? 0, inputs.lastScanAt);
  }

  await writeMigrationListFile(
    path.join(docsAuditDir, 'migration-list.md'),
    inputs.findings.filter((f) => f.scanId === 'substance.single-choice-monthly'),
    inputs.lastScanAt,
  );
}

async function writeFamilyFile(
  filePath: string,
  family: Family,
  findings: Finding[],
  totalCards: number,
  lastScanAt: string,
): Promise<void> {
  const existing = await readIfExists(filePath);
  const preservedRows = parseHumanColumns(existing);
  const newBlock = renderFamilyBlock(findings, preservedRows);

  const frontmatter = [
    '---',
    `family: ${family}`,
    `totalCards: ${totalCards}`,
    'status: pending',
    `lastScan: ${lastScanAt}`,
    '---',
    '',
    `# ${capitalize(family)} — Audit findings`,
    '',
    'The auto-generated block below is rewritten on every \`npm run audit:seed\`.',
    'The `outcome` and `notes` columns are preserved across reruns when the cardId',
    'matches; edit them freely. To exclude a card from regeneration, leave the row',
    'in place but write an outcome — the seeder will keep your edits.',
    '',
    AUTO_BEGIN,
    '',
    '| cardId | choiceId | severity | scanId | message | outcome | notes |',
    '|---|---|---|---|---|---|---|',
    ...newBlock,
    '',
    AUTO_END,
    '',
  ].join('\n');

  await fs.writeFile(filePath, frontmatter, 'utf8');
}

function renderFamilyBlock(findings: Finding[], preserved: Map<string, { outcome: string; notes: string }>): string[] {
  if (findings.length === 0) {
    return ['| _(no findings — clean!)_ | | | | | | |'];
  }
  return findings.map((f) => {
    const key = `${f.cardId}|${f.choiceId ?? ''}|${f.scanId}`;
    const human = preserved.get(key) ?? { outcome: '', notes: '' };
    return [
      escapeCell(f.cardId),
      escapeCell(f.choiceId ?? ''),
      f.severity,
      escapeCell(f.scanId),
      escapeCell(f.message),
      escapeCell(human.outcome),
      escapeCell(human.notes),
    ].map((c) => ` ${c} `).join('|').replace(/^/, '|').concat('|');
  });
}

function parseHumanColumns(existing: string | null): Map<string, { outcome: string; notes: string }> {
  const out = new Map<string, { outcome: string; notes: string }>();
  if (!existing) return out;
  const start = existing.indexOf(AUTO_BEGIN);
  const end = existing.indexOf(AUTO_END);
  if (start === -1 || end === -1 || end <= start) return out;
  const block = existing.slice(start + AUTO_BEGIN.length, end);
  const lines = block.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.startsWith('|---')) continue;
    const cells = splitMarkdownRow(trimmed);
    if (cells.length < 7) continue;
    const [cardId, choiceId, , scanId, , outcome, notes] = cells;
    if (!cardId || cardId.startsWith('_')) continue;
    out.set(`${cardId}|${choiceId}|${scanId}`, { outcome, notes });
  }
  return out;
}

function splitMarkdownRow(line: string): string[] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

async function writeMigrationListFile(
  filePath: string,
  candidates: Finding[],
  lastScanAt: string,
): Promise<void> {
  const existing = await readIfExists(filePath);
  const preserved = parseMigrationHumanColumns(existing);

  const rows = candidates.length === 0
    ? ['| _(no candidates yet)_ | | | |']
    : candidates.map((f) => {
        const key = f.cardId;
        const human = preserved.get(key) ?? { destination: '', rationale: '' };
        return [
          escapeCell(f.cardId),
          escapeCell(f.family),
          escapeCell(human.destination || 'TBD'),
          escapeCell(human.rationale || 'single-choice card surfaced through monthly pool — relocate per §10'),
        ].map((c) => ` ${c} `).join('|').replace(/^/, '|').concat('|');
      });

  const content = [
    `<!-- lastScan: ${lastScanAt} -->`,
    '',
    '# Card Audit — Migration List',
    '',
    'Single-choice cards (Pattern C) currently surfaced through the monthly pool.',
    'The audit verdict per §10 is to relocate them to seasonal dawn / end-of-season',
    'summary / world pulse. Fill in the `destination` and `rationale` columns; the',
    'seeder preserves them across reruns.',
    '',
    AUTO_BEGIN,
    '',
    '| cardId | currentFamily | destination | rationale |',
    '|---|---|---|---|',
    ...rows,
    '',
    AUTO_END,
    '',
  ].join('\n');

  await fs.writeFile(filePath, content, 'utf8');
}

function parseMigrationHumanColumns(existing: string | null): Map<string, { destination: string; rationale: string }> {
  const out = new Map<string, { destination: string; rationale: string }>();
  if (!existing) return out;
  const start = existing.indexOf(AUTO_BEGIN);
  const end = existing.indexOf(AUTO_END);
  if (start === -1 || end === -1 || end <= start) return out;
  const block = existing.slice(start + AUTO_BEGIN.length, end);
  const lines = block.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.startsWith('|---')) continue;
    const cells = splitMarkdownRow(trimmed);
    if (cells.length < 4) continue;
    const [cardId, , destination, rationale] = cells;
    if (!cardId || cardId.startsWith('_')) continue;
    out.set(cardId, { destination, rationale });
  }
  return out;
}

async function readIfExists(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

function escapeCell(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
