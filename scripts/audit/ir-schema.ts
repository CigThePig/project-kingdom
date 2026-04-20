// Ajv JSON schemas for the audit IR and findings.
//
// The IR flows adapter → corpus → scans → reporter. Validating at the
// adapter-output boundary catches shape drift early; validating emitted
// findings at the reporter boundary catches scans that forgot to fill a
// required field.
//
// These schemas are intentionally not exhaustive. They assert only fields
// scans and reporters actually consume, so future adapter extensions don't
// have to bump the schema on every metadata change.

import Ajv, { type ValidateFunction } from 'ajv';

import type { AuditCard } from './ir';
import type { CoverageMatrix } from './coverage/matrix';
import type { Finding, FindingSeverity } from './types';

const ajv = new Ajv({ allErrors: true, strict: false });

// ---------- AuditCard schema ----------

const FAMILY_VALUES = [
  'decree', 'crisis', 'petition', 'assessment', 'negotiation',
  'overture', 'notification', 'hand', 'world', 'unknown',
];

const RUNTIME_PATH_VALUES = [
  'event-resolution', 'direct-effect-assessment', 'direct-effect-negotiation',
  'generated-overture', 'inline-hand-apply', 'decree-resolution',
  'world-event-resolution', 'unknown',
];

const TEXT_SOURCE_VALUES = [
  'event-text', 'assessment-text', 'negotiation-text', 'overture-text',
  'world-text', 'inline-hand', 'inline-decree', 'none',
];

const EFFECT_SOURCE_VALUES = [
  'event-effects', 'assessment-effects', 'negotiation-effects',
  'inline-apply', 'generated-inline', 'world-event-effects',
  'decree-effects', 'none',
];

const SOURCE_KIND_VALUES = ['authored', 'generated', 'inline'];

const queuedModifierSummarySchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'turnsRemaining',
    'effectKeys',
    'hasSourceTag',
    'hasTurnApplied',
    'hasId',
  ],
  properties: {
    turnsRemaining: { type: 'string', enum: ['literal', 'dynamic'] },
    effectKeys: { type: 'array', items: { type: 'string' } },
    hasSourceTag: { type: 'boolean' },
    hasTurnApplied: { type: 'boolean' },
    hasId: { type: 'boolean' },
  },
} as const;

const structuralMarkerSummarySchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'touchesPersistentConsequences',
    'queuesTemporaryModifier',
    'appliesMechanicalDelta',
    'readsChoice',
    'writesPressure',
    'touchesBond',
    'choiceUsageKind',
    'earlyReturnOnMissingId',
    'silentFallbackOnChoiceKind',
    'queuedModifiers',
  ],
  properties: {
    touchesPersistentConsequences: { type: 'boolean' },
    queuesTemporaryModifier: { type: 'boolean' },
    appliesMechanicalDelta: { type: 'boolean' },
    readsChoice: { type: 'boolean' },
    writesPressure: { type: 'boolean' },
    touchesBond: { type: 'boolean' },
    choiceUsageKind: { type: 'string', enum: ['none', 'shallow', 'deep'] },
    earlyReturnOnMissingId: { type: 'boolean' },
    silentFallbackOnChoiceKind: { type: 'boolean' },
    queuedModifiers: { type: 'array', items: queuedModifierSummarySchema },
  },
} as const;

const decisionPathSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'cardId', 'family', 'choiceId', 'effectSourceKind', 'textSourceKind',
    'declaredEffects', 'declaredStructuralMarkers',
    'consequenceTagsProduced', 'consequenceTagsConsumed',
    'followUps', 'runtimeTouchHints', 'contextRequirements',
  ],
  properties: {
    cardId: { type: 'string', minLength: 1 },
    family: { type: 'string', enum: FAMILY_VALUES },
    choiceId: { type: 'string', minLength: 1 },
    label: { type: 'string' },
    effectSourceKind: { type: 'string', enum: EFFECT_SOURCE_VALUES },
    textSourceKind: { type: 'string', enum: TEXT_SOURCE_VALUES },
    declaredEffects: {
      oneOf: [{ type: 'null' }, { type: 'object' }],
    },
    declaredStructuralMarkers: structuralMarkerSummarySchema,
    pressureKey: {
      oneOf: [{ type: 'null' }, { type: 'string' }],
    },
    consequenceTagsProduced: { type: 'array', items: { type: 'string' } },
    consequenceTagsConsumed: { type: 'array', items: { type: 'string' } },
    followUps: { type: 'array', items: { type: 'string' } },
    runtimeTouchHints: { type: 'array', items: { type: 'string' } },
    contextRequirements: { type: 'array', items: { type: 'string' } },
    previewText: {
      oneOf: [{ type: 'null' }, { type: 'string' }],
    },
    runtimeFingerprint: {
      oneOf: [
        { type: 'null' },
        {
          type: 'object',
          additionalProperties: false,
          required: ['fixtureId', 'touches', 'classes', 'structuralCount', 'surfaceCount', 'noOp'],
          properties: {
            fixtureId: { type: 'string', minLength: 1 },
            touches: { type: 'array', items: { type: 'string' } },
            classes: { type: 'array', items: { type: 'string' } },
            structuralCount: { type: 'integer', minimum: 0 },
            surfaceCount: { type: 'integer', minimum: 0 },
            noOp: { type: 'boolean' },
          },
        },
      ],
    },
    runtimeFingerprintVariants: {
      oneOf: [
        { type: 'null' },
        {
          type: 'object',
          additionalProperties: false,
          required: ['a', 'b'],
          properties: {
            a: {
              type: 'object',
              additionalProperties: false,
              required: ['fixtureId', 'touches', 'classes', 'structuralCount', 'surfaceCount', 'noOp'],
              properties: {
                fixtureId: { type: 'string', minLength: 1 },
                touches: { type: 'array', items: { type: 'string' } },
                classes: { type: 'array', items: { type: 'string' } },
                structuralCount: { type: 'integer', minimum: 0 },
                surfaceCount: { type: 'integer', minimum: 0 },
                noOp: { type: 'boolean' },
              },
            },
            b: {
              type: 'object',
              additionalProperties: false,
              required: ['fixtureId', 'touches', 'classes', 'structuralCount', 'surfaceCount', 'noOp'],
              properties: {
                fixtureId: { type: 'string', minLength: 1 },
                touches: { type: 'array', items: { type: 'string' } },
                classes: { type: 'array', items: { type: 'string' } },
                structuralCount: { type: 'integer', minimum: 0 },
                surfaceCount: { type: 'integer', minimum: 0 },
                noOp: { type: 'boolean' },
              },
            },
          },
        },
      ],
    },
  },
} as const;

const coverageFlagsSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'textCoverage', 'effectCoverage', 'runtimeDiffCoverage',
    'pressureCoverage', 'consequenceCoverage', 'generatedFamilyCoverage',
    'astSemanticCoverage', 'previewParityCoverage',
  ],
  properties: {
    textCoverage: { type: 'boolean' },
    effectCoverage: { type: 'boolean' },
    runtimeDiffCoverage: { type: 'boolean' },
    pressureCoverage: { type: 'boolean' },
    consequenceCoverage: { type: 'boolean' },
    generatedFamilyCoverage: { type: 'boolean' },
    astSemanticCoverage: { type: 'boolean' },
    previewParityCoverage: { type: 'boolean' },
  },
} as const;

const auditCardSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'family', 'sourceKind', 'runtimePath', 'metadata', 'choices', 'coverage'],
  properties: {
    id: { type: 'string', minLength: 1 },
    family: { type: 'string', enum: FAMILY_VALUES },
    sourceKind: { type: 'string', enum: SOURCE_KIND_VALUES },
    runtimePath: { type: 'string', enum: RUNTIME_PATH_VALUES },
    filePath: { type: 'string' },
    title: { type: 'string' },
    body: { type: 'string' },
    severityHint: {
      oneOf: [{ type: 'null' }, { type: 'string' }],
    },
    metadata: { type: 'object' },
    choices: { type: 'array', items: decisionPathSchema },
    coverage: coverageFlagsSchema,
  },
} as const;

const auditCardsSchema = {
  type: 'array',
  items: auditCardSchema,
} as const;

// ---------- Finding schema ----------

const findingSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['severity', 'family', 'scanId', 'code', 'cardId', 'message'],
  properties: {
    severity: { type: 'string', enum: ['CRITICAL', 'MAJOR', 'MINOR', 'POLISH'] },
    family: { type: 'string', enum: FAMILY_VALUES },
    scanId: { type: 'string', minLength: 1 },
    code: { type: 'string', minLength: 1 },
    cardId: { type: 'string', minLength: 1 },
    choiceId: { type: 'string' },
    filePath: { type: 'string' },
    message: { type: 'string', minLength: 1 },
    details: { type: 'object' },
    confidence: {
      type: 'string',
      enum: ['DETERMINISTIC', 'RUNTIME_GROUNDED', 'HEURISTIC', 'ENGINE_MISMATCH'],
    },
  },
} as const;

const findingsSchema = {
  type: 'array',
  items: findingSchema,
} as const;

// ---------- Compiled validators ----------

const validateAuditCardsImpl: ValidateFunction<AuditCard[]> = ajv.compile(auditCardsSchema);
const validateFindingsImpl: ValidateFunction<Finding[]> = ajv.compile(findingsSchema);

export function validateAuditCards(cards: unknown): asserts cards is AuditCard[] {
  if (!validateAuditCardsImpl(cards)) {
    const errors = validateAuditCardsImpl.errors ?? [];
    throw new Error(
      `AuditCard[] validation failed:\n${errors
        .map((e) => `  ${e.instancePath || '(root)'} ${e.message}`)
        .join('\n')}`,
    );
  }
}

export function validateFindings(findings: unknown): asserts findings is Finding[] {
  if (!validateFindingsImpl(findings)) {
    const errors = validateFindingsImpl.errors ?? [];
    throw new Error(
      `Finding[] validation failed:\n${errors
        .map((e) => `  ${e.instancePath || '(root)'} ${e.message}`)
        .join('\n')}`,
    );
  }
}

// ---------- Phase 7 report envelope schemas ----------
//
// These envelopes are what get written to docs/audit/*.json. Scans never emit
// them directly; the reporter and report-artifacts modules build them from
// Finding[] + CoverageMatrix. Ajv validation runs at write time so scanner
// drift fails loud before hitting disk.

const SEVERITY_VALUES = ['CRITICAL', 'MAJOR', 'MINOR', 'POLISH'] as const;
const CONFIDENCE_VALUES = [
  'DETERMINISTIC',
  'RUNTIME_GROUNDED',
  'HEURISTIC',
  'ENGINE_MISMATCH',
] as const;

const severityCountsSchema = {
  type: 'object',
  additionalProperties: false,
  required: [...SEVERITY_VALUES],
  properties: Object.fromEntries(
    SEVERITY_VALUES.map((s) => [s, { type: 'integer', minimum: 0 }]),
  ),
} as const;

const confidenceCountsSchema = {
  type: 'object',
  additionalProperties: false,
  required: [...CONFIDENCE_VALUES],
  properties: Object.fromEntries(
    CONFIDENCE_VALUES.map((c) => [c, { type: 'integer', minimum: 0 }]),
  ),
} as const;

const findingsReportSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'startedAt',
    'durationMs',
    'scansRun',
    'counts',
    'countsByConfidence',
    'findings',
  ],
  properties: {
    schemaVersion: { type: 'integer', const: 2 },
    startedAt: { type: 'string', minLength: 1 },
    durationMs: { type: 'integer', minimum: 0 },
    scansRun: { type: 'array', items: { type: 'string', minLength: 1 } },
    counts: severityCountsSchema,
    countsByConfidence: confidenceCountsSchema,
    findings: findingsSchema,
  },
} as const;

const coverageCellSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['total', 'withCoverage', 'coveragePct'],
  properties: {
    total: { type: 'integer', minimum: 0 },
    withCoverage: { type: 'integer', minimum: 0 },
    coveragePct: { type: 'number', minimum: 0, maximum: 100 },
  },
} as const;

const COVERAGE_DIMENSION_KEYS = [
  'textCoverage',
  'effectCoverage',
  'runtimeDiffCoverage',
  'pressureCoverage',
  'consequenceCoverage',
  'generatedFamilyCoverage',
  'astSemanticCoverage',
  'previewParityCoverage',
] as const;

const coverageRowSchema = {
  type: 'object',
  additionalProperties: false,
  required: [...COVERAGE_DIMENSION_KEYS],
  properties: Object.fromEntries(
    COVERAGE_DIMENSION_KEYS.map((d) => [d, coverageCellSchema]),
  ),
} as const;

const coverageReportSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['schemaVersion', 'generatedAt', 'overall', 'byFamily'],
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    generatedAt: { type: 'string', minLength: 1 },
    overall: coverageRowSchema,
    byFamily: {
      type: 'object',
      additionalProperties: coverageRowSchema,
    },
  },
} as const;

const engineMismatchReportSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'generatedAt',
    'count',
    'countsByScan',
    'findings',
  ],
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    generatedAt: { type: 'string', minLength: 1 },
    count: { type: 'integer', minimum: 0 },
    countsByScan: {
      type: 'object',
      additionalProperties: { type: 'integer', minimum: 0 },
    },
    findings: findingsSchema,
  },
} as const;

export interface FindingsReport {
  schemaVersion: 2;
  startedAt: string;
  durationMs: number;
  scansRun: string[];
  counts: Record<FindingSeverity, number>;
  countsByConfidence: Record<
    'DETERMINISTIC' | 'RUNTIME_GROUNDED' | 'HEURISTIC' | 'ENGINE_MISMATCH',
    number
  >;
  findings: Finding[];
}

export interface CoverageReport {
  schemaVersion: 1;
  generatedAt: string;
  overall: CoverageMatrix['overall'];
  byFamily: CoverageMatrix['byFamily'];
}

export interface EngineMismatchReport {
  schemaVersion: 1;
  generatedAt: string;
  count: number;
  countsByScan: Record<string, number>;
  findings: Finding[];
}

const validateFindingsReportImpl: ValidateFunction<FindingsReport> =
  ajv.compile(findingsReportSchema);
const validateCoverageReportImpl: ValidateFunction<CoverageReport> =
  ajv.compile(coverageReportSchema);
const validateEngineMismatchReportImpl: ValidateFunction<EngineMismatchReport> =
  ajv.compile(engineMismatchReportSchema);

function formatAjvErrors(errors: import('ajv').ErrorObject[] | null | undefined): string {
  return (errors ?? [])
    .map((e) => `  ${e.instancePath || '(root)'} ${e.message}`)
    .join('\n');
}

export function validateFindingsReport(payload: unknown): asserts payload is FindingsReport {
  if (!validateFindingsReportImpl(payload)) {
    throw new Error(
      `FindingsReport validation failed:\n${formatAjvErrors(validateFindingsReportImpl.errors)}`,
    );
  }
}

export function validateCoverageReport(payload: unknown): asserts payload is CoverageReport {
  if (!validateCoverageReportImpl(payload)) {
    throw new Error(
      `CoverageReport validation failed:\n${formatAjvErrors(validateCoverageReportImpl.errors)}`,
    );
  }
}

export function validateEngineMismatchReport(
  payload: unknown,
): asserts payload is EngineMismatchReport {
  if (!validateEngineMismatchReportImpl(payload)) {
    throw new Error(
      `EngineMismatchReport validation failed:\n${formatAjvErrors(
        validateEngineMismatchReportImpl.errors,
      )}`,
    );
  }
}
