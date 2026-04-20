// Shared helpers for family adapters.
//
// Centralizes defaults and tag-derivation so every adapter produces the same
// shape when signal is absent (`null` effects, empty string[] lists). Keeps
// coverage-flag bookkeeping honest: adapters explicitly flip flags true per
// dimension they've verified; absence stays false.

import {
  emptyCoverageFlags,
  emptyStructuralMarkerSummary,
  type AuditCard,
  type AuditCoverageFlags,
  type AuditDecisionPath,
  type AuditEffectSourceKind,
  type AuditSourceKind,
  type AuditTextSourceKind,
  type StructuralMarkerSummary,
} from '../ir';
import type { RuntimePathKind } from '../runtime-paths';
import type { Corpus, Family } from '../types';

/** Tag format the engine writes for an event/choice resolution. */
export function eventConsequenceTag(cardId: string, choiceId: string): string {
  return `${cardId}:${choiceId}`;
}

/** Tag format the engine writes for a decree enactment. */
export function decreeConsequenceTag(decreeId: string): string {
  return `decree:${decreeId}`;
}

/** Pressure-weight key format: `${sourceType}:${sourceId}:${choiceId}`. */
export function pressureKey(
  sourceType: 'event' | 'storyline' | 'decree',
  sourceId: string,
  choiceId: string,
): string {
  return `${sourceType}:${sourceId}:${choiceId}`;
}

export function buildDecisionPath(input: {
  cardId: string;
  family: Family;
  choiceId: string;
  label?: string;
  effectSourceKind: AuditEffectSourceKind;
  textSourceKind: AuditTextSourceKind;
  declaredEffects?: Record<string, unknown> | null;
  pressureKey?: string | null;
  consequenceTagsProduced?: string[];
  consequenceTagsConsumed?: string[];
  followUps?: string[];
  runtimeTouchHints?: string[];
  contextRequirements?: string[];
  previewText?: string | null;
  declaredStructuralMarkers?: StructuralMarkerSummary;
}): AuditDecisionPath {
  return {
    cardId: input.cardId,
    family: input.family,
    choiceId: input.choiceId,
    label: input.label,
    effectSourceKind: input.effectSourceKind,
    textSourceKind: input.textSourceKind,
    declaredEffects: input.declaredEffects ?? null,
    declaredStructuralMarkers:
      input.declaredStructuralMarkers ?? emptyStructuralMarkerSummary(),
    pressureKey: input.pressureKey ?? null,
    consequenceTagsProduced: input.consequenceTagsProduced ?? [],
    consequenceTagsConsumed: input.consequenceTagsConsumed ?? [],
    followUps: input.followUps ?? [],
    runtimeTouchHints: input.runtimeTouchHints ?? [],
    contextRequirements: input.contextRequirements ?? [],
    previewText: input.previewText ?? null,
  };
}

export function buildCard(input: {
  id: string;
  family: Family;
  sourceKind: AuditSourceKind;
  runtimePath: RuntimePathKind;
  filePath?: string;
  title?: string;
  body?: string;
  severityHint?: string | null;
  metadata?: Record<string, unknown>;
  choices: AuditDecisionPath[];
  coverage: AuditCoverageFlags;
}): AuditCard {
  return {
    id: input.id,
    family: input.family,
    sourceKind: input.sourceKind,
    runtimePath: input.runtimePath,
    filePath: input.filePath,
    title: input.title,
    body: input.body,
    severityHint: input.severityHint ?? null,
    metadata: input.metadata ?? {},
    choices: input.choices,
    coverage: input.coverage,
  };
}

export function defaultCoverage(overrides: Partial<AuditCoverageFlags> = {}): AuditCoverageFlags {
  return { ...emptyCoverageFlags(), ...overrides };
}

export function fileFor(corpus: Corpus, cardId: string): string | undefined {
  return corpus.filePathByCardId.get(cardId);
}
