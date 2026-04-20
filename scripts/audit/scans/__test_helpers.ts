// Test helper — builds an empty `Corpus` shell that scans can mutate to set
// up minimal scenarios. Only used by *.test.ts files.

import type {
  AuditCard,
  AuditCoverageFlags,
  AuditDecisionPath,
  QueuedModifierSummary,
  RuntimeFingerprint,
  StructuralMarkerSummary,
} from '../ir';
import {
  emptyCoverageFlags,
  emptyStructuralMarkerSummary,
} from '../ir';
import type { Corpus } from '../types';

export function buildEmptyCorpus(): Corpus {
  return {
    events: { pool: [], followUpPool: [] },
    decrees: { pool: [], effects: {}, handlerKeys: new Set() },
    assessments: { pool: [], effects: {}, text: {} },
    negotiations: { pool: [], effects: {}, text: {} },
    overtures: { text: {}, authoredAgendas: [] },
    worldEvents: { defs: [], effects: {}, text: {} },
    handCards: [],
    text: { events: {} },
    effects: { events: {} },
    styleTags: {},
    tempModifiers: {},
    featureRegistry: {},
    eventById: new Map(),
    familyByCardId: new Map(),
    filePathByCardId: new Map(),
    tagProducers: new Map(),
    tagReaders: new Map(),
    auditCards: [],
    coverage: { byFamily: {}, overall: {} as never },
  };
}

// ============================================================
// Factories — synthetic AuditCard / AuditDecisionPath shapes so that hand
// and text scans can be exercised without running the real harness.
// ============================================================

export interface BuildHandAuditCardInput {
  id?: string;
  title?: string;
  body?: string;
  expiresAfterTurns?: number;
  requiresChoice?: 'class' | 'rival' | null;
  markers?: Partial<StructuralMarkerSummary>;
  fingerprint?: Partial<RuntimeFingerprint> | null;
  fingerprintVariants?: { a: RuntimeFingerprint; b: RuntimeFingerprint } | null;
  coverage?: Partial<AuditCoverageFlags>;
  queuedModifiers?: QueuedModifierSummary[];
}

/**
 * Build a fully-formed hand-family `AuditCard` with one `play` decision
 * path. All fields default to the shape a real hand-card adapter produces
 * under the mid-kingdom fixture; override only the dimensions a test cares
 * about.
 */
export function buildHandAuditCard(input: BuildHandAuditCardInput = {}): AuditCard {
  const markers: StructuralMarkerSummary = {
    ...emptyStructuralMarkerSummary(),
    ...input.markers,
    queuedModifiers: input.queuedModifiers ?? input.markers?.queuedModifiers ?? [],
  };
  const fingerprint: RuntimeFingerprint | null =
    input.fingerprint === null
      ? null
      : {
          fixtureId: 'mid-kingdom',
          touches: [],
          classes: [],
          structuralCount: 0,
          surfaceCount: 0,
          noOp: true,
          ...input.fingerprint,
        };
  const path: AuditDecisionPath = {
    cardId: input.id ?? 'hand_synthetic',
    family: 'hand',
    choiceId: 'play',
    label: input.title,
    effectSourceKind: 'inline-apply',
    textSourceKind: 'inline-hand',
    declaredEffects: null,
    declaredStructuralMarkers: markers,
    pressureKey: null,
    consequenceTagsProduced: [],
    consequenceTagsConsumed: [],
    followUps: [],
    runtimeTouchHints: ['inline-hand-apply'],
    contextRequirements: [],
    previewText: null,
    runtimeFingerprint: fingerprint,
    runtimeFingerprintVariants: input.fingerprintVariants ?? null,
  };
  const coverage: AuditCoverageFlags = {
    ...emptyCoverageFlags(),
    textCoverage: true,
    astSemanticCoverage: true,
    runtimeDiffCoverage: fingerprint !== null || input.fingerprintVariants != null,
    ...input.coverage,
  };
  return {
    id: input.id ?? 'hand_synthetic',
    family: 'hand',
    sourceKind: 'inline',
    runtimePath: 'inline-hand-apply',
    title: input.title ?? 'Synthetic Hand Card',
    body: input.body ?? 'A synthetic hand card used only by audit unit tests.',
    severityHint: null,
    metadata: {
      expiresAfterTurns: input.expiresAfterTurns ?? 10,
      requiresChoice: input.requiresChoice ?? null,
    },
    choices: [path],
    coverage,
  };
}

export interface BuildGenericAuditCardInput {
  id?: string;
  family?: AuditCard['family'];
  title?: string;
  body?: string;
  touches?: string[];
  classes?: string[];
  structuralCount?: number;
  surfaceCount?: number;
  affectsRegion?: boolean;
  metadata?: Record<string, unknown>;
  choices?: AuditDecisionPath[];
  declaredEffects?: Record<string, unknown> | null;
  sourceKind?: AuditCard['sourceKind'];
  runtimePath?: AuditCard['runtimePath'];
  previewText?: string | null;
  noRuntime?: boolean;
}

/**
 * Build a minimal `AuditCard` whose runtime fingerprint carries a specific
 * `touches[]` array — used by text scans (`promise-delivery`, `scope-
 * mismatch`) that compare body claims against recorded runtime touches.
 */
export function buildGenericAuditCard(input: BuildGenericAuditCardInput = {}): AuditCard {
  const touches = input.touches ?? [];
  const path: AuditDecisionPath = {
    cardId: input.id ?? 'card_generic',
    family: input.family ?? 'petition',
    choiceId: 'default',
    label: 'Default',
    effectSourceKind: 'event-effects',
    textSourceKind: 'event-text',
    declaredEffects: input.declaredEffects ?? null,
    declaredStructuralMarkers: emptyStructuralMarkerSummary(),
    pressureKey: null,
    consequenceTagsProduced: [],
    consequenceTagsConsumed: [],
    followUps: [],
    runtimeTouchHints: [],
    contextRequirements: [],
    previewText: input.previewText ?? null,
    runtimeFingerprint: input.noRuntime
      ? null
      : {
          fixtureId: 'mid-kingdom',
          touches,
          classes: input.classes ?? [],
          structuralCount: input.structuralCount ?? 0,
          surfaceCount: input.surfaceCount ?? touches.length,
          noOp: touches.length === 0,
        },
    runtimeFingerprintVariants: null,
  };
  const choices = input.choices ?? [path];
  return {
    id: input.id ?? 'card_generic',
    family: input.family ?? 'petition',
    sourceKind: input.sourceKind ?? 'authored',
    runtimePath: input.runtimePath ?? 'event-resolution',
    title: input.title ?? 'Generic Card',
    body: input.body ?? '',
    severityHint: null,
    metadata: {
      affectsRegion: input.affectsRegion ?? false,
      ...(input.metadata ?? {}),
    },
    choices,
    coverage: {
      ...emptyCoverageFlags(),
      textCoverage: true,
      runtimeDiffCoverage: !input.noRuntime,
    },
  };
}

/** Construct a lone `AuditDecisionPath` for tests that need specific
 *  runtime fingerprints per choice (term-distinctness, grant-deny parity). */
export function buildDecisionPath(input: {
  cardId: string;
  family: AuditCard['family'];
  choiceId: string;
  touches?: string[];
  classes?: string[];
  noOp?: boolean;
  declaredEffects?: Record<string, unknown> | null;
  previewText?: string | null;
  label?: string;
  effectSourceKind?: AuditDecisionPath['effectSourceKind'];
  textSourceKind?: AuditDecisionPath['textSourceKind'];
}): AuditDecisionPath {
  const touches = input.touches ?? [];
  return {
    cardId: input.cardId,
    family: input.family,
    choiceId: input.choiceId,
    label: input.label,
    effectSourceKind: input.effectSourceKind ?? 'event-effects',
    textSourceKind: input.textSourceKind ?? 'event-text',
    declaredEffects: input.declaredEffects ?? null,
    declaredStructuralMarkers: emptyStructuralMarkerSummary(),
    pressureKey: null,
    consequenceTagsProduced: [],
    consequenceTagsConsumed: [],
    followUps: [],
    runtimeTouchHints: [],
    contextRequirements: [],
    previewText: input.previewText ?? null,
    runtimeFingerprint: {
      fixtureId: 'mid-kingdom',
      touches,
      classes: input.classes ?? [],
      structuralCount: 0,
      surfaceCount: touches.length,
      noOp: input.noOp ?? touches.length === 0,
    },
    runtimeFingerprintVariants: null,
  };
}
