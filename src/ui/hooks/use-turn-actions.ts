// Phase 7 — Hook for dispatching player actions within the action budget.
// Blueprint Reference: gameplay-blueprint.md §5.1 — Action Budget System

import { useContext, useCallback } from 'react';

import type { QueuedAction } from '../../engine/types';
import {
  validateActionAddition,
  checkActionBudgetExhausted,
  type ActionValidationError,
} from '../../engine/resolution/action-budget';
import {
  resolveTurn,
  type ApplyActionEffectsFn,
  type TurnResolutionResult,
} from '../../engine/resolution/turn-resolution';
import { applyActionEffects as applyRealActionEffects } from '../../engine/resolution/apply-action-effects';
import { GameContext } from '../context/game-context';

// ============================================================
// Hook
// ============================================================

export interface TurnActionsAPI {
  /** Queue an action. Returns null on success, or the validation error. */
  queueAction: (action: QueuedAction) => ActionValidationError | null;
  /** Remove a queued action by its ID. */
  removeAction: (actionId: string) => void;
  /** Resolve the current turn. Calls the engine outside the reducer, then dispatches the result. */
  advanceTurn: (applyActionEffects?: ApplyActionEffectsFn) => TurnResolutionResult;
  /** True when no action slots remain (free actions and policy changes may still be valid). */
  isBudgetExhausted: boolean;
  /** Currently queued actions for this turn. */
  queuedActions: ReadonlyArray<QueuedAction>;
  /** Number of action slots still available. */
  slotsRemaining: number;
}

export function useTurnActions(): TurnActionsAPI {
  const ctx = useContext(GameContext);
  if (ctx === null) {
    throw new Error('useTurnActions must be used within a <GameProvider>');
  }

  const { state, dispatch } = ctx;
  const budget = state.gameState.actionBudget;

  const queueAction = useCallback(
    (action: QueuedAction): ActionValidationError | null => {
      const error = validateActionAddition(action, budget);
      if (error !== null) {
        return error;
      }
      dispatch({ type: 'QUEUE_ACTION', action });
      return null;
    },
    [budget, dispatch],
  );

  const removeAction = useCallback(
    (actionId: string): void => {
      dispatch({ type: 'REMOVE_ACTION', actionId });
    },
    [dispatch],
  );

  const advanceTurn = useCallback(
    (applyActionEffects: ApplyActionEffectsFn = applyRealActionEffects): TurnResolutionResult => {
      // Run the engine's turn resolution outside the reducer to keep
      // the reducer pure (resolveTurn uses Math.random internally).
      const result = resolveTurn(state.gameState, applyActionEffects);
      dispatch({ type: 'TURN_RESOLVED', result });
      return result;
    },
    [state.gameState, dispatch],
  );

  return {
    queueAction,
    removeAction,
    advanceTurn,
    isBudgetExhausted: checkActionBudgetExhausted(budget),
    queuedActions: budget.queuedActions,
    slotsRemaining: budget.slotsRemaining,
  };
}
