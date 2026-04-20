// Audit IR — normalized card model the scanner uses in place of raw
// EVENT_POOL / NEGOTIATION_POOL / … arrays. Per
// docs/AUDIT_SCANNER_OVERHAUL_PLAN.md §"Core data model to introduce".
//
// Every family ships an adapter (scripts/audit/adapters/<family>.ts) that
// returns `AuditCard[]`. Scans read the IR instead of re-deriving family
// quirks in place. Coverage flags on each card force adapters to be honest
// about what the scanner actually sees for that family — an overture
// without a round-tripped agenda key sets `generatedFamilyCoverage: false`
// and downstream consumers know not to trust its structural findings.
//
// Fields are deliberately minimal for the foundation commit. M4 adds
// `runtimeFingerprint` to AuditDecisionPath once the runtime-diff harness
// lands; M3 fills `declaredStructuralMarkers` via the hand-card analyzer.
// Until then, adapters populate the shape with conservative defaults and
// leave the corresponding coverage flag `false`.

import type { Family } from './types';
import type { RuntimePathKind } from './runtime-paths';
import type { TextSourceKind } from './text-sources';

export type AuditFamily = Family;

/**
 * How a card's display text is authored. Mirrors TextSourceKind from
 * text-sources.ts so the IR is self-describing without re-importing.
 */
export type AuditTextSourceKind = TextSourceKind;

/**
 * Where a decision path reads its effect payload from. Distinct from
 * TextSourceKind because a card can have effects registered in a different
 * table than its text (e.g. assessments: ASSESSMENT_TEXT + ASSESSMENT_EFFECTS).
 */
export type AuditEffectSourceKind =
  | 'event-effects'
  | 'assessment-effects'
  | 'negotiation-effects'
  | 'inline-apply'
  | 'generated-inline'
  | 'world-event-effects'
  | 'decree-effects'
  | 'none';

/**
 * Whether a card is authored directly (events, world events, decrees),
 * generated at runtime from a schema (overtures, assessments, negotiations),
 * or carries inline logic (hand cards).
 */
export type AuditSourceKind = 'authored' | 'generated' | 'inline';

/**
 * Coarse markers extracted by the M3 hand-card AST analyzer. Every flag is
 * conservative: `false` means "we did not observe this", not "definitely
 * doesn't happen". Callers must gate structural claims on
 * `coverage.astSemanticCoverage`.
 */
export interface StructuralMarkerSummary {
  /** Mutates `persistentConsequences` via push/filter/spread. */
  touchesPersistentConsequences: boolean;
  /** Queues a temporary modifier (EVENT_CHOICE_TEMPORARY_MODIFIERS or inline). */
  queuesTemporaryModifier: boolean;
  /** Calls `applyMechanicalEffectDelta` or equivalent. */
  appliesMechanicalDelta: boolean;
  /** References the `choice` / `selectedChoiceId` parameter non-trivially. */
  readsChoice: boolean;
  /** Calls `applyPressure(...)` directly. */
  writesPressure: boolean;
  /** Creates or modifies a bond (diplomaticBonds / inter-rival bonds). */
  touchesBond: boolean;
}

export function emptyStructuralMarkerSummary(): StructuralMarkerSummary {
  return {
    touchesPersistentConsequences: false,
    queuesTemporaryModifier: false,
    appliesMechanicalDelta: false,
    readsChoice: false,
    writesPressure: false,
    touchesBond: false,
  };
}

/**
 * Runtime-diff signal for a single decision path. Populated by the M4
 * runtime harness — `null` means no fixture was dispatched (coverage
 * gap). `noOp=true` is a real finding: the harness ran and saw no state
 * change.
 */
export interface RuntimeFingerprint {
  /** Fixture id the fingerprint was produced against. */
  fixtureId: string;
  /** Every dotted path that changed between before/after. */
  touches: string[];
  /** Unique touch-classes the paths fall into (surface, structural, …). */
  classes: string[];
  /** Counts broken out for quick scanning. */
  structuralCount: number;
  surfaceCount: number;
  /** True when `touches` is empty — the decision mutated nothing. */
  noOp: boolean;
}

/**
 * A single decision path on a card — one event choice, one negotiation term,
 * one overture grant/deny, one decree activation, one hand-card play.
 * Decrees and hand cards typically produce one path each; events produce N.
 */
export interface AuditDecisionPath {
  cardId: string;
  family: AuditFamily;
  choiceId: string;
  label?: string;
  effectSourceKind: AuditEffectSourceKind;
  textSourceKind: AuditTextSourceKind;
  /** Authored effect payload, if one exists in the family's effect table. */
  declaredEffects: Record<string, unknown> | null;
  declaredStructuralMarkers: StructuralMarkerSummary;
  /** PRESSURE_WEIGHTS key (`${sourceType}:${sourceId}:${choiceId}`), if any. */
  pressureKey?: string | null;
  /** Consequence tags this path writes — from buildTagProducers or AST. */
  consequenceTagsProduced: string[];
  /** Consequence tags this path reads via trigger conditions. */
  consequenceTagsConsumed: string[];
  /** Downstream events queued by `followUpEventId` or equivalent. */
  followUps: string[];
  /** Free-form hints from adapters; runtime harness (M4) appends structural classes. */
  runtimeTouchHints: string[];
  /** Context fields the trigger condition depends on. */
  contextRequirements: string[];
  /** Short preview string shown in UI, if authored. */
  previewText?: string | null;
  /**
   * Runtime harness diff signal. `null` when the loader didn't opt in
   * to the harness or when the path's runtime family isn't harness-supported.
   */
  runtimeFingerprint?: RuntimeFingerprint | null;
}

/**
 * Per-card truth-in-advertising: each flag says "the scanner has real
 * signal for this dimension on this card". False means "the scanner hasn't
 * verified that yet" — it is NOT a content finding.
 */
export interface AuditCoverageFlags {
  textCoverage: boolean;
  effectCoverage: boolean;
  runtimeDiffCoverage: boolean;
  pressureCoverage: boolean;
  consequenceCoverage: boolean;
  generatedFamilyCoverage: boolean;
  astSemanticCoverage: boolean;
  previewParityCoverage: boolean;
}

export function emptyCoverageFlags(): AuditCoverageFlags {
  return {
    textCoverage: false,
    effectCoverage: false,
    runtimeDiffCoverage: false,
    pressureCoverage: false,
    consequenceCoverage: false,
    generatedFamilyCoverage: false,
    astSemanticCoverage: false,
    previewParityCoverage: false,
  };
}

export interface AuditCard {
  id: string;
  family: AuditFamily;
  sourceKind: AuditSourceKind;
  runtimePath: RuntimePathKind;
  filePath?: string;
  title?: string;
  body?: string;
  severityHint?: string | null;
  metadata: Record<string, unknown>;
  choices: AuditDecisionPath[];
  coverage: AuditCoverageFlags;
}
