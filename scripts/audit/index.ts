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
import { writeDocsArtifacts } from './report-artifacts';
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
import { scan as promiseDeliveryScan, SCAN_ID as PROMISE_DELIVERY_ID } from './scans/text/promise-delivery';
import { scan as scopeMismatchScan, SCAN_ID as SCOPE_MISMATCH_ID } from './scans/text/scope-mismatch';
import { scan as smartCardCoverageScan, SCAN_ID as SMART_CARD_COVERAGE_ID } from './scans/text/smart-card-coverage';

import { scan as pressurePrefixParityScan, SCAN_ID as PRESSURE_PREFIX_PARITY_ID } from './scans/engine/pressure-prefix-parity';
import { scan as consequenceWriteParityScan, SCAN_ID as CONSEQUENCE_WRITE_PARITY_ID } from './scans/engine/consequence-write-parity';
import { scan as textSourceParityScan, SCAN_ID as TEXT_SOURCE_PARITY_ID } from './scans/engine/text-source-parity';
import { scan as runtimePathParityScan, SCAN_ID as RUNTIME_PATH_PARITY_ID } from './scans/engine/runtime-path-parity';
import { scan as readerWriterRoundtripScan, SCAN_ID as READER_WRITER_ROUNDTRIP_ID } from './scans/engine/reader-writer-roundtrip';

import { scan as handRequiresChoiceUsedScan, SCAN_ID as HAND_REQUIRES_CHOICE_USED_ID } from './scans/hand/requires-choice-used';
import { scan as handNoOpApplyScan, SCAN_ID as HAND_NO_OP_APPLY_ID } from './scans/hand/no-op-apply';
import { scan as handRuntimeStructuralDepthScan, SCAN_ID as HAND_RUNTIME_STRUCTURAL_DEPTH_ID } from './scans/hand/runtime-structural-depth';
import { scan as handExpirySanityScan, SCAN_ID as HAND_EXPIRY_SANITY_ID } from './scans/hand/expiry-sanity';
import { scan as handTempModifierShapeScan, SCAN_ID as HAND_TEMP_MODIFIER_SHAPE_ID } from './scans/hand/temp-modifier-shape';
import { scan as handChoiceFallbackRiskScan, SCAN_ID as HAND_CHOICE_FALLBACK_RISK_ID } from './scans/hand/choice-fallback-risk';

// Phase 5A — Assessments
import { scan as assessmentsTextCoverageScan, SCAN_ID as ASSESSMENTS_TEXT_COVERAGE_ID } from './scans/assessments/text-coverage';
import { scan as assessmentsRuntimeStructuralDepthScan, SCAN_ID as ASSESSMENTS_RUNTIME_STRUCTURAL_DEPTH_ID } from './scans/assessments/runtime-structural-depth';
import { scan as assessmentsNeighborResolutionParityScan, SCAN_ID as ASSESSMENTS_NEIGHBOR_RESOLUTION_PARITY_ID } from './scans/assessments/neighbor-resolution-parity';
import { scan as assessmentsPressureWiringScan, SCAN_ID as ASSESSMENTS_PRESSURE_WIRING_ID } from './scans/assessments/pressure-wiring';

// Phase 5B — Negotiations
import { scan as negotiationsTextCoverageScan, SCAN_ID as NEGOTIATIONS_TEXT_COVERAGE_ID } from './scans/negotiations/text-coverage';
import { scan as negotiationsRejectTextCoverageScan, SCAN_ID as NEGOTIATIONS_REJECT_TEXT_COVERAGE_ID } from './scans/negotiations/reject-text-coverage';
import { scan as negotiationsTermDistinctnessScan, SCAN_ID as NEGOTIATIONS_TERM_DISTINCTNESS_ID } from './scans/negotiations/term-distinctness';
import { scan as negotiationsBondMaterializationParityScan, SCAN_ID as NEGOTIATIONS_BOND_MATERIALIZATION_PARITY_ID } from './scans/negotiations/bond-materialization-parity';
import { scan as negotiationsPressureWiringScan, SCAN_ID as NEGOTIATIONS_PRESSURE_WIRING_ID } from './scans/negotiations/pressure-wiring';

// Phase 5C — Overtures
import { scan as overturesAgendaCoverageScan, SCAN_ID as OVERTURES_AGENDA_COVERAGE_ID } from './scans/overtures/agenda-coverage';
import { scan as overturesPlaceholderResolutionScan, SCAN_ID as OVERTURES_PLACEHOLDER_RESOLUTION_ID } from './scans/overtures/placeholder-resolution';
import { scan as overturesSyntheticIdRoundtripScan, SCAN_ID as OVERTURES_SYNTHETIC_ID_ROUNDTRIP_ID } from './scans/overtures/synthetic-id-roundtrip';
import { scan as overturesGrantDenyRuntimeParityScan, SCAN_ID as OVERTURES_GRANT_DENY_RUNTIME_PARITY_ID } from './scans/overtures/grant-deny-runtime-parity';
import { scan as overturesEffectHintParityScan, SCAN_ID as OVERTURES_EFFECT_HINT_PARITY_ID } from './scans/overtures/effect-hint-parity';

// Phase 5E — Decrees
import { scan as decreesPreviewParityScan, SCAN_ID as DECREES_PREVIEW_PARITY_ID } from './scans/decrees/preview-parity';
import { scan as decreesHandlerFeatureParityScan, SCAN_ID as DECREES_HANDLER_FEATURE_PARITY_ID } from './scans/decrees/handler-feature-parity';
import { scan as decreesChainTierPolicyScan, SCAN_ID as DECREES_CHAIN_TIER_POLICY_ID } from './scans/decrees/chain-tier-policy';
import { scan as decreesHighImpactDepthScan, SCAN_ID as DECREES_HIGH_IMPACT_DEPTH_ID } from './scans/decrees/high-impact-depth';

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
  { id: PROMISE_DELIVERY_ID, scan: promiseDeliveryScan },
  { id: SCOPE_MISMATCH_ID, scan: scopeMismatchScan },
  { id: SMART_CARD_COVERAGE_ID, scan: smartCardCoverageScan },
  { id: PRESSURE_PREFIX_PARITY_ID, scan: pressurePrefixParityScan },
  { id: CONSEQUENCE_WRITE_PARITY_ID, scan: consequenceWriteParityScan },
  { id: TEXT_SOURCE_PARITY_ID, scan: textSourceParityScan },
  { id: RUNTIME_PATH_PARITY_ID, scan: runtimePathParityScan },
  { id: READER_WRITER_ROUNDTRIP_ID, scan: readerWriterRoundtripScan },
  { id: HAND_TEMP_MODIFIER_SHAPE_ID, scan: handTempModifierShapeScan },
  { id: HAND_EXPIRY_SANITY_ID, scan: handExpirySanityScan },
  { id: HAND_CHOICE_FALLBACK_RISK_ID, scan: handChoiceFallbackRiskScan },
  { id: HAND_RUNTIME_STRUCTURAL_DEPTH_ID, scan: handRuntimeStructuralDepthScan },
  { id: HAND_NO_OP_APPLY_ID, scan: handNoOpApplyScan },
  { id: HAND_REQUIRES_CHOICE_USED_ID, scan: handRequiresChoiceUsedScan },
  // Phase 5A — Assessments
  { id: ASSESSMENTS_TEXT_COVERAGE_ID, scan: assessmentsTextCoverageScan },
  { id: ASSESSMENTS_RUNTIME_STRUCTURAL_DEPTH_ID, scan: assessmentsRuntimeStructuralDepthScan },
  { id: ASSESSMENTS_NEIGHBOR_RESOLUTION_PARITY_ID, scan: assessmentsNeighborResolutionParityScan },
  { id: ASSESSMENTS_PRESSURE_WIRING_ID, scan: assessmentsPressureWiringScan },
  // Phase 5B — Negotiations
  { id: NEGOTIATIONS_TEXT_COVERAGE_ID, scan: negotiationsTextCoverageScan },
  { id: NEGOTIATIONS_REJECT_TEXT_COVERAGE_ID, scan: negotiationsRejectTextCoverageScan },
  { id: NEGOTIATIONS_TERM_DISTINCTNESS_ID, scan: negotiationsTermDistinctnessScan },
  { id: NEGOTIATIONS_BOND_MATERIALIZATION_PARITY_ID, scan: negotiationsBondMaterializationParityScan },
  { id: NEGOTIATIONS_PRESSURE_WIRING_ID, scan: negotiationsPressureWiringScan },
  // Phase 5C — Overtures
  { id: OVERTURES_AGENDA_COVERAGE_ID, scan: overturesAgendaCoverageScan },
  { id: OVERTURES_PLACEHOLDER_RESOLUTION_ID, scan: overturesPlaceholderResolutionScan },
  { id: OVERTURES_SYNTHETIC_ID_ROUNDTRIP_ID, scan: overturesSyntheticIdRoundtripScan },
  { id: OVERTURES_GRANT_DENY_RUNTIME_PARITY_ID, scan: overturesGrantDenyRuntimeParityScan },
  { id: OVERTURES_EFFECT_HINT_PARITY_ID, scan: overturesEffectHintParityScan },
  // Phase 5E — Decrees
  { id: DECREES_PREVIEW_PARITY_ID, scan: decreesPreviewParityScan },
  { id: DECREES_HANDLER_FEATURE_PARITY_ID, scan: decreesHandlerFeatureParityScan },
  { id: DECREES_CHAIN_TIER_POLICY_ID, scan: decreesChainTierPolicyScan },
  { id: DECREES_HIGH_IMPACT_DEPTH_ID, scan: decreesHighImpactDepthScan },
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
    coverage: corpus.coverage,
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
      coverage: corpus.coverage,
    });
    await writeDocsArtifacts(docsAuditDir, {
      findings: allFindings,
      scansRun,
      startedAt,
      durationMs: Date.now() - t0,
      coverage: corpus.coverage,
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
