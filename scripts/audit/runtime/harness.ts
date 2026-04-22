// Runtime-diff harness: invoke the real engine against a canonical fixture
// and hand the before/after states back to the scan layer for diffing and
// classification. The harness is a thin dispatch table keyed by
// `RuntimePathKind`; each path calls the same public engine function the
// production app uses, so scans that read the harness result read the
// engine's actual behavior — not a scanner-side reimplementation.
//
// Scope:
//   - inline-hand-apply       → HandCardDefinition.apply()
//   - decree-resolution       → applyActionEffects() with ActionType.Decree
//   - direct-effect-assessment → applyDirectEffects() with InteractionType.Assessment
//   - direct-effect-negotiation → applyDirectEffects() with InteractionType.Negotiation
//   - generated-overture      → applyActionEffects() with ActionType.CrisisResponse
//                                (parameters encode a synthesized overture_*
//                                eventId the engine routes into its inline
//                                diplomatic-overture path)
//   - event-resolution        → applyEventChoiceEffects() with EVENT_CHOICE_EFFECTS
//                                (crises, petitions, notifications)
//   - world-event-resolution  → applyEventChoiceEffects() with a nested wrapper
//                                around WORLD_EVENT_CHOICE_EFFECTS (flat by
//                                effectsKey)
//
// Calls are pure: fixtures are cloned-on-mutate by the engine itself, so
// the harness never hands back a leaked reference.

import {
  ActionType,
  EventCategory,
  InteractionType,
  PopulationClass,
  RivalAgenda,
  type ActiveEvent,
  type GameState,
  type MechanicalEffectDelta,
  type QueuedAction,
} from '../../../src/engine/types';
import {
  HAND_CARDS,
  type HandCardChoice,
  type HandCardDefinition,
  type HandCardId,
} from '../../../src/data/cards/hand-cards';
import { applyActionEffects } from '../../../src/engine/resolution/apply-action-effects';
import { applyDirectEffects } from '../../../src/bridge/directEffectApplier';
import { applyEventChoiceEffects } from '../../../src/engine/events/apply-event-effects';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../../../src/data/events';
import { EVENT_CHOICE_EFFECTS } from '../../../src/data/events/effects';
import {
  WORLD_EVENT_CHOICE_EFFECTS,
  WORLD_EVENT_DEFINITIONS,
} from '../../../src/data/world-events';
import type { MonthDecision } from '../../../src/ui/types';
import { SeasonMonth } from '../../../src/engine/types';
import type { AuditCard, AuditDecisionPath } from '../ir';

export interface HarnessResultSupported {
  supported: true;
  before: GameState;
  after: GameState;
}

export interface HarnessResultUnsupported {
  supported: false;
  reason: string;
}

export type HarnessResult = HarnessResultSupported | HarnessResultUnsupported;

export interface VariantRunResultSupported {
  supported: true;
  before: GameState;
  afterA: GameState;
  afterB: GameState;
}

export type VariantRunResult = VariantRunResultSupported | HarnessResultUnsupported;

/**
 * Run a single decision path against a fixture and return `{ before, after }`.
 * Dispatch is by runtime path, not family, so future generated families
 * (overtures, synthetic decrees) can be slotted in without touching the
 * card-specific adapters.
 */
export function runChoice(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
): HarnessResult {
  switch (card.runtimePath) {
    case 'inline-hand-apply':
      return runHandCard(card, choice, state);
    case 'decree-resolution':
      return runDecree(card, state);
    case 'direct-effect-assessment':
      return runAssessment(card, choice, state);
    case 'direct-effect-negotiation':
      return runNegotiation(card, choice, state);
    case 'generated-overture':
      return runOverture(card, choice, state);
    case 'event-resolution':
      return runEvent(card, choice, state, /* isWorldEvent */ false);
    case 'world-event-resolution':
      return runEvent(card, choice, state, /* isWorldEvent */ true);
    case 'unknown':
    default:
      return { supported: false, reason: 'unknown runtime path' };
  }
}

/**
 * Run a single decision path against a fixture twice with two distinct
 * `choice` targets — two classes for `requiresChoice: 'class'`, two
 * neighbors for `requiresChoice: 'rival'`. Scans use `{ afterA, afterB }` to
 * detect cards that claim a target-dependent effect but produce identical
 * output diffs regardless of target.
 *
 * Only `inline-hand-apply` declares `requiresChoice`; other paths never
 * populate variant runs.
 */
export function runChoiceVariants(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
): VariantRunResult {
  const requiresChoice = card.metadata?.requiresChoice as
    | 'class'
    | 'rival'
    | null
    | undefined;
  if (!requiresChoice) {
    return { supported: false, reason: 'card does not declare requiresChoice' };
  }
  if (card.runtimePath !== 'inline-hand-apply') {
    return {
      supported: false,
      reason: `variant run not supported for runtime path ${card.runtimePath}`,
    };
  }
  void choice;
  const def = lookupHandCard(card.id);
  if (!def) {
    return { supported: false, reason: `no HandCardDefinition for ${card.id}` };
  }
  const [choiceA, choiceB] = pickSyntheticChoicePair(def, state);
  if (!choiceA || !choiceB) {
    return {
      supported: false,
      reason: `fixture lacks two distinct ${requiresChoice} targets for ${card.id}`,
    };
  }
  return {
    supported: true,
    before: state,
    afterA: def.apply(state, choiceA),
    afterB: def.apply(state, choiceB),
  };
}

// ============================================================
// Hand-card dispatch
// ============================================================

function runHandCard(
  card: AuditCard,
  _choice: AuditDecisionPath,
  state: GameState,
): HarnessResult {
  const def = lookupHandCard(card.id);
  if (!def) {
    return { supported: false, reason: `no HandCardDefinition for ${card.id}` };
  }
  const synthChoice = pickSyntheticChoice(def, state);
  if (!synthChoice) {
    return {
      supported: false,
      reason: `fixture lacks ${def.requiresChoice} target for ${card.id}`,
    };
  }
  const after = def.apply(state, synthChoice);
  return { supported: true, before: state, after };
}

function lookupHandCard(id: string): HandCardDefinition | null {
  const registry = HAND_CARDS as Record<string, HandCardDefinition | undefined>;
  return registry[id as HandCardId] ?? null;
}

function pickSyntheticChoice(
  def: HandCardDefinition,
  state: GameState,
): HandCardChoice | null {
  if (!def.requiresChoice) return { kind: 'none' };
  if (def.requiresChoice === 'class') {
    return { kind: 'class', class: PopulationClass.Commoners };
  }
  if (def.requiresChoice === 'rival') {
    const neighborId = state.diplomacy.neighbors[0]?.id;
    if (!neighborId) return null;
    return { kind: 'rival', neighborId };
  }
  return null;
}

function pickSyntheticChoicePair(
  def: HandCardDefinition,
  state: GameState,
): [HandCardChoice | null, HandCardChoice | null] {
  if (!def.requiresChoice) return [null, null];
  if (def.requiresChoice === 'class') {
    return [
      { kind: 'class', class: PopulationClass.Commoners },
      { kind: 'class', class: PopulationClass.Nobility },
    ];
  }
  if (def.requiresChoice === 'rival') {
    const neighbors = state.diplomacy.neighbors;
    const a = neighbors[0]?.id;
    const b = neighbors[1]?.id;
    if (!a || !b || a === b) return [null, null];
    return [
      { kind: 'rival', neighborId: a },
      { kind: 'rival', neighborId: b },
    ];
  }
  return [null, null];
}

// ============================================================
// Decree dispatch
// ============================================================

function runDecree(card: AuditCard, state: GameState): HarnessResult {
  const action: QueuedAction = {
    id: `audit-harness-${card.id}`,
    type: ActionType.Decree,
    actionDefinitionId: card.id,
    slotCost: 0,
    isFree: true,
    targetRegionId: state.regions?.[0]?.id ?? null,
    targetNeighborId: state.diplomacy.neighbors[0]?.id ?? null,
    parameters: {},
  };
  const after = applyActionEffects(state, [action]);
  return { supported: true, before: state, after };
}

// ============================================================
// Assessment dispatch
// ============================================================

function runAssessment(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
): HarnessResult {
  const decision: MonthDecision = {
    cardId: `assessment:${card.id}`,
    choiceId: `assessment:${card.id}:${choice.choiceId}`,
    interactionType: InteractionType.Assessment,
    month: SeasonMonth.Early,
    targetNeighborId: pickPeacefulNeighbor(state),
  };
  const after = applyDirectEffects(state, [decision], null);
  return { supported: true, before: state, after };
}

// ============================================================
// Negotiation dispatch
// ============================================================

function runNegotiation(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
): HarnessResult {
  // Reject paths prefix `reject:` so the direct-effect applier routes them
  // through the reject branch; term paths carry the bare termId.
  const rejectChoiceId = card.metadata?.rejectChoiceId as string | undefined;
  const isReject = rejectChoiceId != null && choice.choiceId === rejectChoiceId;
  const decision: MonthDecision = {
    cardId: `negotiation:${card.id}`,
    choiceId: isReject ? `reject:${choice.choiceId}` : choice.choiceId,
    interactionType: InteractionType.Negotiation,
    month: SeasonMonth.Early,
    targetNeighborId: pickPeacefulNeighbor(state),
  };
  const after = applyDirectEffects(state, [decision], card.id);
  return { supported: true, before: state, after };
}

// ============================================================
// Overture dispatch
// ============================================================

function runOverture(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
): HarnessResult {
  const neighborId = state.diplomacy.neighbors[0]?.id;
  if (!neighborId) {
    return { supported: false, reason: `fixture lacks a neighbor for ${card.id}` };
  }
  const agenda = card.metadata?.agenda as RivalAgenda | undefined;
  if (!agenda) {
    return { supported: false, reason: `${card.id} missing agenda metadata` };
  }
  const turn = state.turn.turnNumber;
  const eventId = `overture_${neighborId}_${agenda}_t${turn}`;
  const suffix = choice.choiceId === 'grant' ? '_grant' : '_deny';
  const choiceId = `${eventId}${suffix}`;
  const action: QueuedAction = {
    id: `audit-harness-${card.id}-${choice.choiceId}`,
    type: ActionType.CrisisResponse,
    actionDefinitionId: eventId,
    slotCost: 0,
    isFree: true,
    targetRegionId: null,
    targetNeighborId: neighborId,
    parameters: { eventId, choiceId },
  };
  const after = applyActionEffects(state, [action]);
  return { supported: true, before: state, after };
}

function pickPeacefulNeighbor(state: GameState): string | undefined {
  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return peaceful[0]?.id ?? neighbors[0]?.id;
}

// ============================================================
// Event / World-Event dispatch
// ============================================================

/**
 * Runs an event or world event against a fixture by building a transient
 * ActiveEvent with `isResolved: true`, then calling the same
 * `applyEventChoiceEffects` path the engine uses at resolve time. A median
 * rng (`() => 0.5`) keeps outcome variance deterministic so fingerprints
 * stay stable across runs.
 *
 * World events store effects flat by `effectsKey`; we wrap that map into the
 * nested `[eventId][choiceId]` shape `applyEventChoiceEffects` expects.
 */
function runEvent(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
  isWorldEvent: boolean,
): HarnessResult {
  if (isWorldEvent) {
    const def = WORLD_EVENT_DEFINITIONS.find((w) => w.id === card.id);
    if (!def) {
      return { supported: false, reason: `world event ${card.id} not in WORLD_EVENT_DEFINITIONS` };
    }
    const wrapped: Record<string, Record<string, MechanicalEffectDelta>> = {
      [card.id]: Object.fromEntries(
        def.choices.map((c) => [c.id, WORLD_EVENT_CHOICE_EFFECTS[c.effectsKey] ?? {}]),
      ),
    };
    const activeEvent = buildTransientActiveEvent(card, choice, state, {
      severity: def.severity,
      category: EventCategory.Kingdom,
      chainId: null,
      chainStep: null,
      relatedStorylineId: null,
    });
    const { state: after } = applyEventChoiceEffects(state, activeEvent, wrapped, () => 0.5);
    return { supported: true, before: state, after };
  }

  const def =
    EVENT_POOL.find((e) => e.id === card.id) ??
    FOLLOW_UP_POOL.find((e) => e.id === card.id);
  if (!def) {
    return { supported: false, reason: `event ${card.id} not in EVENT_POOL or FOLLOW_UP_POOL` };
  }
  const activeEvent = buildTransientActiveEvent(card, choice, state, {
    severity: def.severity,
    category: def.category,
    chainId: def.chainId,
    chainStep: def.chainStep,
    relatedStorylineId: def.relatedStorylineId,
  });
  const { state: after } = applyEventChoiceEffects(
    state,
    activeEvent,
    EVENT_CHOICE_EFFECTS,
    () => 0.5,
  );
  return { supported: true, before: state, after };
}

function buildTransientActiveEvent(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
  fields: {
    severity: ActiveEvent['severity'];
    category: ActiveEvent['category'];
    chainId: string | null;
    chainStep: number | null;
    relatedStorylineId: string | null;
  },
): ActiveEvent {
  const meta = card.metadata as
    | {
        affectsRegion?: boolean;
        affectsClass?: PopulationClass | null;
        affectsNeighbor?: string | null;
      }
    | undefined;
  const affectsRegion = meta?.affectsRegion === true;
  const affectsNeighborRaw = meta?.affectsNeighbor ?? null;
  const affectedNeighborId = affectsNeighborRaw
    ? state.diplomacy.neighbors[0]?.id ?? null
    : null;
  return {
    id: `audit-${card.id}`,
    definitionId: card.id,
    severity: fields.severity,
    category: fields.category,
    isResolved: true,
    choiceMade: choice.choiceId,
    chainId: fields.chainId,
    chainStep: fields.chainStep,
    turnSurfaced: state.turn.turnNumber,
    affectedRegionId: affectsRegion ? state.regions?.[0]?.id ?? null : null,
    affectedClassId: (meta?.affectsClass as PopulationClass | null) ?? null,
    affectedNeighborId,
    relatedStorylineId: fields.relatedStorylineId,
    outcomeQuality: null,
    isFollowUp: false,
    followUpSourceId: null,
  };
}
