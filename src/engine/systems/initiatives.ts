// Phase 10 — Long-Term Initiatives engine.
//
// Pure functions. An ActiveInitiative tracks one long-horizon directive.
// Progress accrues each turn from a small baseline plus a bonus per played
// card whose tags overlap the initiative's cardWeightingBoost list. The
// initiative also exerts a small per-turn narrative pressure while active,
// and boosts the selection weight of matching cards via
// getInitiativeCardWeightBoost(). Completion and failure are handled by the
// turn-resolution hook (see resolveTurn Phase 2c).

import type {
  ActiveInitiative,
  GameState,
  MechanicalEffectDelta,
  NarrativePressure,
} from '../types';
import type { CardTag } from '../cards/types';
import type { InitiativeDefinition } from '../../data/initiatives/definitions';
import { INITIATIVE_DEFINITIONS } from '../../data/initiatives';

/** Baseline progress per turn regardless of cards played. */
export const INITIATIVE_BASELINE_PROGRESS = 1;

/** Progress added for each played card whose tags overlap the boost list. */
export const INITIATIVE_PROGRESS_PER_TAGGED_CARD = 4;

/** Selection-weight multiplier applied to cards matching the boost list. */
export const INITIATIVE_CARD_WEIGHT_MULTIPLIER = 1.5;

/** Number of consecutive failing turns before auto-abandonment. */
export const INITIATIVE_FAILURE_GRACE_TURNS = 2;

/** Look up a definition; returns null for unknown ids. */
export function getInitiativeDefinition(
  definitionId: string,
): InitiativeDefinition | null {
  return INITIATIVE_DEFINITIONS[definitionId] ?? null;
}

/** Build a fresh ActiveInitiative from a definition. */
export function commitInitiative(
  def: InitiativeDefinition,
  turnCommitted: number,
): ActiveInitiative {
  return {
    definitionId: def.id,
    progressValue: 0,
    turnsActive: 0,
    turnsRequired: def.turnsRequired,
    turnCommitted,
    consecutiveFailingTurns: 0,
  };
}

export interface InitiativeTickResult {
  next: ActiveInitiative | null;
  completed: ActiveInitiative | null;
}

/** Per-turn progress tick. Returns an updated initiative; if it completed
 *  this turn, `completed` carries the pre-clear snapshot for payoff. */
export function tickInitiativeProgress(
  active: ActiveInitiative | null,
  playedTags: CardTag[],
): InitiativeTickResult {
  if (!active) return { next: null, completed: null };

  const def = getInitiativeDefinition(active.definitionId);
  if (!def) {
    // Unknown definition id — preserve as-is so data errors don't corrupt saves.
    return { next: active, completed: null };
  }

  const boostSet = new Set<CardTag>(def.cardWeightingBoost);
  let matchingTagCount = 0;
  for (const t of playedTags) {
    if (boostSet.has(t)) matchingTagCount += 1;
  }

  const gain =
    INITIATIVE_BASELINE_PROGRESS +
    matchingTagCount * INITIATIVE_PROGRESS_PER_TAGGED_CARD;

  const nextProgress = Math.min(100, active.progressValue + gain);
  const next: ActiveInitiative = {
    ...active,
    progressValue: nextProgress,
    turnsActive: active.turnsActive + 1,
  };

  if (nextProgress >= 100) {
    return { next: null, completed: next };
  }
  return { next, completed: null };
}

/** Explicit player-driven abandonment. Returns the penalty; caller applies. */
export function abandonInitiative(
  active: ActiveInitiative,
): { next: null; penalty: MechanicalEffectDelta } {
  const def = getInitiativeDefinition(active.definitionId);
  return { next: null, penalty: def?.abandonPenalty ?? {} };
}

export function isInitiativeComplete(a: ActiveInitiative): boolean {
  return a.progressValue >= 100;
}

/** Resolve a dotted field path on GameState to a number, if possible. */
function readNumericField(state: GameState, field: string): number | null {
  const parts = field.split('.');
  let cursor: unknown = state;
  for (const p of parts) {
    if (cursor && typeof cursor === 'object' && p in (cursor as object)) {
      cursor = (cursor as Record<string, unknown>)[p];
    } else {
      return null;
    }
  }
  return typeof cursor === 'number' ? cursor : null;
}

/** True iff any failure condition's threshold is violated right now. */
export function evaluateFailureConditions(
  active: ActiveInitiative,
  state: GameState,
): boolean {
  const def = getInitiativeDefinition(active.definitionId);
  if (!def || def.failureConditions.length === 0) return false;
  for (const cond of def.failureConditions) {
    if (cond.type === 'state_below') {
      const value = readNumericField(state, cond.field);
      if (value !== null && value < cond.threshold) return true;
    }
  }
  return false;
}

/** Advance or clear the consecutive-failing counter and detect auto-abandon. */
export function advanceFailureCounter(
  active: ActiveInitiative,
  failingThisTurn: boolean,
): { next: ActiveInitiative; shouldAutoAbandon: boolean } {
  const nextCounter = failingThisTurn ? active.consecutiveFailingTurns + 1 : 0;
  const next: ActiveInitiative = {
    ...active,
    consecutiveFailingTurns: nextCounter,
  };
  return {
    next,
    shouldAutoAbandon: nextCounter >= INITIATIVE_FAILURE_GRACE_TURNS,
  };
}

/** Card-distributor hook: multiplier applied to candidate card selection
 *  weight. Returns 1.0 when no initiative is active or no tags match. */
export function getInitiativeCardWeightBoost(
  active: ActiveInitiative | null | undefined,
  cardTags: readonly CardTag[],
): number {
  if (!active) return 1.0;
  const def = getInitiativeDefinition(active.definitionId);
  if (!def || def.cardWeightingBoost.length === 0) return 1.0;
  const boostSet = new Set<CardTag>(def.cardWeightingBoost);
  for (const t of cardTags) {
    if (boostSet.has(t)) return INITIATIVE_CARD_WEIGHT_MULTIPLIER;
  }
  return 1.0;
}

/** Per-turn pressure delta while an initiative is active. Returned shape is
 *  keyed by NarrativePressure axes; consumers merge additively. */
export function getPerTurnPressureDelta(
  active: ActiveInitiative | null | undefined,
): Partial<NarrativePressure> {
  if (!active) return {};
  const def = getInitiativeDefinition(active.definitionId);
  return def?.perTurnPressureDelta ?? {};
}
