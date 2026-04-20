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
import type { Finding } from './types';

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
