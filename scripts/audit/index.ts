// Card Audit — CLI entrypoint.
//
//   npm run audit                       — full scan, default exit 0.
//   npm run audit -- --family=decree    — only emit findings for one family.
//   npm run audit -- --include-minor    — include MINOR severity in output.
//   npm run audit -- --include-polish   — include POLISH severity in output.
//   npm run audit -- --with-reach       — additionally run trigger-attainability.
//   npm run audit -- --seed-artifacts   — write/refresh docs/audit/* templates.
//   npm run audit -- --fail-on=critical — exit nonzero when threshold is met.
//   npm run audit -- --output=path      — override output dir (default audit-output/).

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import { loadCorpus } from './corpus';
import { computeInventory, renderInventoryMarkdown } from './inventory';
import { writeReports, countBySeverity } from './reporter';
import { seedArtifacts } from './seeder';
import {
  SEVERITY_RANK,
  type AuditConfig,
  type Family,
  type Finding,
  type Scan,
  type ScanOptions,
} from './types';

import { scan as missingTextScan, SCAN_ID as MISSING_TEXT_ID } from './scans/wiring/missing-text';
import { scan as choiceLabelScan, SCAN_ID as CHOICE_LABEL_ID } from './scans/wiring/choice-label-coverage';
import { scan as missingEffectsScan, SCAN_ID as MISSING_EFFECTS_ID } from './scans/wiring/missing-effects';
import { scan as emptyEffectsScan, SCAN_ID as EMPTY_EFFECTS_ID } from './scans/wiring/empty-effects';
import { scan as styleTagScan, SCAN_ID as STYLE_TAG_ID } from './scans/wiring/style-tag-targets';
import { scan as followupScan, SCAN_ID as FOLLOWUP_ID } from './scans/wiring/followup-targets';
import { scan as featureRegistryScan, SCAN_ID as FEATURE_REGISTRY_ID } from './scans/wiring/feature-registry-reach';
import { scan as decreeStructuralDepthScan, SCAN_ID as DECREE_STRUCTURAL_DEPTH_ID } from './scans/wiring/decree-structural-depth';
import { scan as tagProducersScan, SCAN_ID as TAG_PRODUCERS_ID } from './scans/wiring/tag-producers';
import { scan as tagConsumersScan, SCAN_ID as TAG_CONSUMERS_ID } from './scans/wiring/tag-consumers';

import { scan as surfaceOnlyScan, SCAN_ID as SURFACE_ONLY_ID } from './scans/substance/surface-only';
import { scan as singleChoiceScan, SCAN_ID as SINGLE_CHOICE_ID } from './scans/substance/single-choice-monthly';
import { scan as categoryTouchScan, SCAN_ID as CATEGORY_TOUCH_ID } from './scans/substance/category-without-touch';
import { scan as severityMagScan, SCAN_ID as SEVERITY_MAG_ID } from './scans/substance/severity-magnitude';
import { scan as choiceClonesScan, SCAN_ID as CHOICE_CLONES_ID } from './scans/substance/choice-clones';

import { scan as unresolvedTokensScan, SCAN_ID as UNRESOLVED_TOKENS_ID } from './scans/text/unresolved-tokens';

import { scan as pressurePrefixParityScan, SCAN_ID as PRESSURE_PREFIX_PARITY_ID } from './scans/engine/pressure-prefix-parity';
import { scan as consequenceWriteParityScan, SCAN_ID as CONSEQUENCE_WRITE_PARITY_ID } from './scans/engine/consequence-write-parity';
import { scan as textSourceParityScan, SCAN_ID as TEXT_SOURCE_PARITY_ID } from './scans/engine/text-source-parity';
import { scan as runtimePathParityScan, SCAN_ID as RUNTIME_PATH_PARITY_ID } from './scans/engine/runtime-path-parity';
import { scan as readerWriterRoundtripScan, SCAN_ID as READER_WRITER_ROUNDTRIP_ID } from './scans/engine/reader-writer-roundtrip';

import { scan as triggerReachScan, SCAN_ID as TRIGGER_REACH_ID } from './scans/reach/trigger-attainability';

interface RegisteredScan {
  id: string;
  scan: Scan;
  /** When true, only runs under --with-reach. */
  reachOnly?: boolean;
}

const SCANS: RegisteredScan[] = [
  { id: MISSING_TEXT_ID, scan: missingTextScan },
  { id: CHOICE_LABEL_ID, scan: choiceLabelScan },
  { id: MISSING_EFFECTS_ID, scan: missingEffectsScan },
  { id: EMPTY_EFFECTS_ID, scan: emptyEffectsScan },
  { id: STYLE_TAG_ID, scan: styleTagScan },
  { id: FOLLOWUP_ID, scan: followupScan },
  { id: FEATURE_REGISTRY_ID, scan: featureRegistryScan },
  { id: DECREE_STRUCTURAL_DEPTH_ID, scan: decreeStructuralDepthScan },
  { id: TAG_PRODUCERS_ID, scan: tagProducersScan },
  { id: TAG_CONSUMERS_ID, scan: tagConsumersScan },
  { id: SURFACE_ONLY_ID, scan: surfaceOnlyScan },
  { id: SINGLE_CHOICE_ID, scan: singleChoiceScan },
  { id: CATEGORY_TOUCH_ID, scan: categoryTouchScan },
  { id: SEVERITY_MAG_ID, scan: severityMagScan },
  { id: CHOICE_CLONES_ID, scan: choiceClonesScan },
  { id: UNRESOLVED_TOKENS_ID, scan: unresolvedTokensScan },
  { id: PRESSURE_PREFIX_PARITY_ID, scan: pressurePrefixParityScan },
  { id: CONSEQUENCE_WRITE_PARITY_ID, scan: consequenceWriteParityScan },
  { id: TEXT_SOURCE_PARITY_ID, scan: textSourceParityScan },
  { id: RUNTIME_PATH_PARITY_ID, scan: runtimePathParityScan },
  { id: READER_WRITER_ROUNDTRIP_ID, scan: readerWriterRoundtripScan },
  { id: TRIGGER_REACH_ID, scan: triggerReachScan, reachOnly: true },
];

async function main(): Promise<void> {
  const config = parseArgs(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const t0 = Date.now();

  const corpus = await loadCorpus({ runtimeFingerprint: true });
  const opts: ScanOptions = {
    family: config.family,
    includeMinor: config.includeMinor,
    includePolish: config.includePolish,
  };

  const allFindings: Finding[] = [];
  const scansRun: string[] = [];

  for (const reg of SCANS) {
    if (reg.reachOnly && !config.withReach) continue;
    const findings = reg.scan(corpus, opts);
    scansRun.push(reg.id);
    for (const f of findings) {
      if (config.family && f.family !== config.family) continue;
      if (f.severity === 'MINOR' && !config.includeMinor) continue;
      if (f.severity === 'POLISH' && !config.includePolish) continue;
      allFindings.push(f);
    }
  }

  await fs.mkdir(config.outputDir, { recursive: true });
  await writeReports(config.outputDir, {
    findings: allFindings,
    scansRun,
    startedAt,
    durationMs: Date.now() - t0,
  });

  // Always write inventory alongside the findings — cheap and useful.
  const inventory = await computeInventory(corpus);
  await fs.writeFile(
    path.join(config.outputDir, 'inventory.json'),
    JSON.stringify(inventory, null, 2) + '\n',
    'utf8',
  );
  await fs.writeFile(
    path.join(config.outputDir, 'inventory.md'),
    renderInventoryMarkdown(inventory),
    'utf8',
  );

  if (config.seedArtifacts) {
    const docsAuditDir = path.resolve(process.cwd(), 'docs', 'audit');
    await seedArtifacts(docsAuditDir, {
      findings: allFindings,
      totalsByFamily: inventory.byFamily,
      lastScanAt: startedAt,
    });
  }

  const counts = countBySeverity(allFindings);
  // eslint-disable-next-line no-console
  console.log(
    `[audit] ${scansRun.length} scans · ${allFindings.length} findings ` +
      `(CRITICAL=${counts.CRITICAL} MAJOR=${counts.MAJOR} MINOR=${counts.MINOR} POLISH=${counts.POLISH}) ` +
      `· ${Date.now() - t0} ms · output → ${path.relative(process.cwd(), config.outputDir)}/`,
  );

  if (config.failOn) {
    const threshold = SEVERITY_RANK[config.failOn];
    const worst = allFindings.reduce((m, f) => Math.max(m, SEVERITY_RANK[f.severity]), -1);
    if (worst >= threshold) {
      // eslint-disable-next-line no-console
      console.error(`[audit] failing because ${config.failOn} threshold met.`);
      process.exit(1);
    }
  }
}

// ============================================================
// Arg parsing
// ============================================================

const FAMILY_VALUES: Family[] = [
  'decree', 'crisis', 'petition', 'assessment', 'negotiation',
  'overture', 'notification', 'hand', 'world', 'unknown',
];

function parseArgs(argv: string[]): AuditConfig {
  const config: AuditConfig = {
    outputDir: path.resolve(process.cwd(), 'audit-output'),
    includeMinor: false,
    includePolish: false,
    withReach: false,
    seedArtifacts: false,
  };

  for (const arg of argv) {
    if (arg === '--include-minor') config.includeMinor = true;
    else if (arg === '--include-polish') config.includePolish = true;
    else if (arg === '--with-reach') config.withReach = true;
    else if (arg === '--seed-artifacts') config.seedArtifacts = true;
    else if (arg.startsWith('--family=')) {
      const v = arg.slice('--family='.length) as Family;
      if (!FAMILY_VALUES.includes(v)) throw new Error(`Unknown family: ${v}`);
      config.family = v;
    } else if (arg.startsWith('--fail-on=')) {
      const v = arg.slice('--fail-on='.length).toUpperCase();
      if (v !== 'CRITICAL' && v !== 'MAJOR' && v !== 'MINOR' && v !== 'POLISH') {
        throw new Error(`Unknown --fail-on value: ${v}`);
      }
      config.failOn = v as AuditConfig['failOn'];
    } else if (arg.startsWith('--output=')) {
      config.outputDir = path.resolve(process.cwd(), arg.slice('--output='.length));
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return config;
}

function printHelp(): void {
  // eslint-disable-next-line no-console
  console.log(`Usage: tsx scripts/audit/index.ts [options]

Options:
  --family=<name>      Only emit findings for one family (decree, crisis,
                       petition, assessment, negotiation, overture,
                       notification, hand, world, unknown).
  --include-minor      Include MINOR-severity findings.
  --include-polish     Include POLISH-severity findings.
  --with-reach         Additionally run reach.trigger-attainability scan.
  --seed-artifacts     Write/refresh docs/audit/* finding tables.
  --fail-on=<sev>      Exit 1 when a finding at or above <sev> exists.
  --output=<dir>       Override output directory (default audit-output/).
  --help, -h           Print this message.
`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
