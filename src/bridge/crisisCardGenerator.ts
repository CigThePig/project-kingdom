// Bridge Layer — Crisis Card Generator
// Translates a crisis-severity ActiveEvent into CrisisPhaseData for the UI.

import type { ActiveEvent, MechanicalEffectDelta, GameState } from '../engine/types';
import { EventSeverity } from '../engine/types';
import type { EffectHint, ContextLine, SignalTag } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { crisisToCard } from '../engine/cards/adapters';
import { EVENT_TEXT } from '../data/text/events';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { NEIGHBOR_LABELS } from '../data/text/labels';
import { getNeighborDisplayName } from './nameResolver';
import { extractEventContext } from './contextExtractor';
import { extractChoiceSignals } from './signalExtractor';
import { extractModifierTags } from './modifierTagExtractor';
import { WORLD_EVENT_DEFINITIONS, WORLD_EVENT_CHOICE_EFFECTS } from '../data/world-events';
import { WORLD_EVENT_TEXT } from '../data/text/world-events';

// ============================================================
// Shared utility — MechanicalEffectDelta → EffectHint[]
// Exported so other bridge modules can reuse it.
// ============================================================

function fmt(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function mechDeltaToEffectHints(
  delta: MechanicalEffectDelta,
  gameState?: GameState,
): EffectHint[] {
  const hints: EffectHint[] = [];
  const modTags = gameState ? extractModifierTags(gameState, delta) : {};

  function push(field: string, label: string, value: number, forceWarning?: boolean) {
    if (value === 0) return;
    const type: EffectHint['type'] = forceWarning
      ? 'warning'
      : value > 0
      ? 'positive'
      : 'negative';
    const mods = modTags[field];
    hints.push({
      label: `${label} ${fmt(value)}`,
      type,
      modifiers: mods?.length ? mods : undefined,
    });
  }

  if (delta.treasuryDelta !== undefined) push('treasuryDelta', 'Treasury', delta.treasuryDelta);
  if (delta.foodDelta !== undefined) push('foodDelta', 'Food', delta.foodDelta);
  if (delta.stabilityDelta !== undefined) push('stabilityDelta', 'Stability', delta.stabilityDelta);
  if (delta.faithDelta !== undefined) push('faithDelta', 'Faith', delta.faithDelta);
  if (delta.heterodoxyDelta !== undefined) push('heterodoxyDelta', 'Heterodoxy', delta.heterodoxyDelta, delta.heterodoxyDelta > 0);
  if (delta.culturalCohesionDelta !== undefined) push('culturalCohesionDelta', 'Culture', delta.culturalCohesionDelta);
  if (delta.militaryReadinessDelta !== undefined) push('militaryReadinessDelta', 'Readiness', delta.militaryReadinessDelta);
  if (delta.militaryEquipmentDelta !== undefined) push('militaryEquipmentDelta', 'Equipment', delta.militaryEquipmentDelta);
  if (delta.militaryMoraleDelta !== undefined) push('militaryMoraleDelta', 'Morale', delta.militaryMoraleDelta);
  if (delta.militaryForceSizeDelta !== undefined) push('militaryForceSizeDelta', 'Force Size', delta.militaryForceSizeDelta);
  if (delta.espionageNetworkDelta !== undefined) push('espionageNetworkDelta', 'Intel', delta.espionageNetworkDelta);
  if (delta.nobilitySatDelta !== undefined) push('nobilitySatDelta', 'Nobility', delta.nobilitySatDelta);
  if (delta.clergySatDelta !== undefined) push('clergySatDelta', 'Clergy', delta.clergySatDelta);
  if (delta.merchantSatDelta !== undefined) push('merchantSatDelta', 'Merchants', delta.merchantSatDelta);
  if (delta.commonerSatDelta !== undefined) push('commonerSatDelta', 'Commoners', delta.commonerSatDelta);
  if (delta.militaryCasteSatDelta !== undefined) push('militaryCasteSatDelta', 'Military Caste', delta.militaryCasteSatDelta);
  if (delta.regionDevelopmentDelta !== undefined) push('regionDevelopmentDelta', 'Region Dev', delta.regionDevelopmentDelta);
  if (delta.regionConditionDelta !== undefined) push('regionConditionDelta', 'Region', delta.regionConditionDelta);

  if (delta.diplomacyDeltas) {
    for (const [neighborId, value] of Object.entries(delta.diplomacyDeltas)) {
      if (value !== 0) {
        hints.push({
          label: `Relations (${neighborId}) ${fmt(value)}`,
          type: value > 0 ? 'positive' : 'negative',
        });
      }
    }
  }

  return hints;
}

// ============================================================
// Card data types
// ============================================================

export interface CrisisCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  effects: EffectHint[];
  context?: ContextLine[];
  storylineId?: string;
  branchPointId?: string;
}

export interface ResponseCardData {
  id: string;        // `${eventId}:${choiceId}`
  choiceId: string;
  title: string;
  effects: EffectHint[];
  signals: SignalTag[];
  slotCost: number;
  isFree: boolean;
}

export interface CrisisPhaseData {
  crisisCard: CrisisCardData;
  responses: ResponseCardData[];
}

// ============================================================
// Generator
// ============================================================

function severityLabel(severity: EventSeverity): EffectHint {
  switch (severity) {
    case EventSeverity.Critical:
      return { label: 'CRITICAL', type: 'negative' };
    case EventSeverity.Serious:
      return { label: 'SERIOUS', type: 'warning' };
    default:
      return { label: 'EVENT', type: 'neutral' };
  }
}

export function generateCrisisPhaseData(event: ActiveEvent, gameState?: GameState): CrisisPhaseData {
  // Phase 12 — World events use a parallel data shape. Route them through a
  // dedicated builder so we don't hybridize lookups.
  if (event.definitionId.startsWith('we_')) {
    return generateWorldEventCrisisPhaseData(event, gameState);
  }

  const textEntry = EVENT_TEXT[event.definitionId];
  const def = EVENT_POOL.find((e) => e.id === event.definitionId)
    ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);

  let title = textEntry?.title ?? 'CRISIS';
  let body = textEntry?.body ?? 'The court faces an urgent matter requiring your decision.';

  if (event.affectedNeighborId) {
    const neighborName = gameState
      ? getNeighborDisplayName(event.affectedNeighborId, gameState)
      : (NEIGHBOR_LABELS[event.affectedNeighborId] ?? event.affectedNeighborId);
    title = title.replace(/\{neighbor\}/g, neighborName);
    body = body.replace(/\{neighbor\}/g, neighborName);
  }

  const context = gameState ? extractEventContext(gameState, event, 4) : undefined;

  const crisisCard: CrisisCardData = {
    eventId: event.id,
    definitionId: event.definitionId,
    title,
    body,
    effects: [severityLabel(event.severity)],
    context: context?.length ? context : undefined,
  };

  if (!def || !textEntry) {
    return { crisisCard, responses: [] };
  }

  const choiceEffects = EVENT_CHOICE_EFFECTS[event.definitionId] ?? {};

  const responses: ResponseCardData[] = def.choices.map((choice) => {
    const delta = choiceEffects[choice.choiceId] ?? {};
    return {
      id: `${event.id}:${choice.choiceId}`,
      choiceId: choice.choiceId,
      title: textEntry.choices[choice.choiceId] ?? choice.choiceId,
      effects: mechDeltaToEffectHints(delta, gameState),
      signals: extractChoiceSignals(event.definitionId, choice.choiceId),
      slotCost: choice.slotCost,
      isFree: choice.isFree,
    };
  });

  return { crisisCard, responses };
}

/** Phase 12 — Builds a CrisisPhaseData from a world-event ActiveEvent. Looks
 *  up WorldEventDefinition and WORLD_EVENT_TEXT; falls back to a generic
 *  label pair when either is absent. */
function generateWorldEventCrisisPhaseData(
  event: ActiveEvent,
  gameState?: GameState,
): CrisisPhaseData {
  const def = WORLD_EVENT_DEFINITIONS.find((d) => d.id === event.definitionId);
  const textEntry = WORLD_EVENT_TEXT[event.definitionId];

  const title = textEntry?.title ?? 'WORLD EVENT';
  const body = textEntry?.body
    ?? 'A matter spanning the region reaches the court.';

  const crisisCard: CrisisCardData = {
    eventId: event.id,
    definitionId: event.definitionId,
    title,
    body,
    effects: [severityLabel(event.severity)],
  };

  if (!def || !textEntry) {
    return { crisisCard, responses: [] };
  }

  const responses: ResponseCardData[] = def.choices.map((choice) => {
    const delta = WORLD_EVENT_CHOICE_EFFECTS[choice.effectsKey] ?? {};
    return {
      id: `${event.id}:${choice.id}`,
      choiceId: choice.id,
      title: textEntry.choices[choice.id] ?? choice.id,
      effects: mechDeltaToEffectHints(delta, gameState),
      signals: [],
      slotCost: 0,
      isFree: true,
    };
  });

  return { crisisCard, responses };
}

/** Phase 4 — emits a unified `Card<'crisis'>` envelope. Use this in new
 *  downstream paths; legacy bookkeeping code that wants the payload shape
 *  can continue to call `generateCrisisPhaseData` directly. */
export function generateCrisisCard(
  event: ActiveEvent,
  gameState?: GameState,
): CardOfFamily<'crisis'> {
  const def = EVENT_POOL.find((e) => e.id === event.definitionId)
    ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);
  return crisisToCard(generateCrisisPhaseData(event, gameState), def);
}
