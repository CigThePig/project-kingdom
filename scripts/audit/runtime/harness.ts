// Runtime-diff harness: invoke the real engine against a canonical fixture
// and hand the before/after states back to the scan layer for diffing and
// classification. The harness is a thin dispatch table keyed by
// `RuntimePathKind`; each path calls the same public engine function the
// production app uses, so scans that read the harness result read the
// engine's actual behavior — not a scanner-side reimplementation.
//
// Scope for M4.1: hand cards run through their inline `apply`, the
// remaining paths return `{ unsupported: true }` and downstream scans
// treat that as "coverage gap, not a finding." Later milestones flesh out
// event/decree/overture/world dispatch as those families' support lands.
//
// Calls are pure: fixtures are cloned-on-mutate by the engine itself, so
// the harness never hands back a leaked reference.

import { PopulationClass, type GameState } from '../../../src/engine/types';
import {
  HAND_CARDS,
  type HandCardChoice,
  type HandCardDefinition,
  type HandCardId,
} from '../../../src/data/cards/hand-cards';
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
    case 'event-resolution':
    case 'direct-effect-assessment':
    case 'direct-effect-negotiation':
    case 'generated-overture':
    case 'decree-resolution':
    case 'world-event-resolution':
      return {
        supported: false,
        reason: `runtime path ${card.runtimePath} not yet supported by harness`,
      };
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
 * Returns `{ supported: false }` when the card does not declare
 * `requiresChoice`, when the dispatch path is unsupported, or when the
 * fixture can't supply two distinct targets.
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

/**
 * Synthesize a HandCardChoice for cards that demand one. The first rival in
 * the fixture's neighbor list and a canonical class (Commoners) are fine —
 * the harness is diffing shapes, not testing game balance.
 */
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

/**
 * Pick two distinct synthetic `HandCardChoice` targets so the caller can
 * compare two apply runs. Returns `[null, null]` when the fixture cannot
 * supply two distinct targets. For class-driven cards, two different
 * PopulationClasses are always available (five enum values). For rival-
 * driven cards we need at least two neighbors in the fixture.
 */
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
