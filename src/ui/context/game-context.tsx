// Phase 7 — React context + useReducer for game state management.
// Blueprint Reference: TECHNICAL.md — State Management; ux-blueprint.md — §10 Save/Load

import { createContext, useReducer, useMemo, type ReactNode } from 'react';

import {
  ActionType,
  type ActiveEvent,
  type GameState,
  type IntelligenceReport,
  type QueuedAction,
  type SaveFile,
  type TurnHistoryEntry,
} from '../../engine/types';
import {
  validateActionAddition,
  deductActionCost,
} from '../../engine/resolution/action-budget';
import type { TurnResolutionResult } from '../../engine/resolution/turn-resolution';
import { createDefaultScenario } from '../../data/scenarios/default';

// ============================================================
// Context State
// ============================================================

export interface GameContextState {
  gameState: GameState;
  turnHistory: TurnHistoryEntry[];
  eventHistory: ActiveEvent[];
  intelligenceReports: IntelligenceReport[];
  lastTurnResult: TurnResolutionResult | null;
  isMidTurn: boolean;
  lastSavedAt: number | null;
}

// ============================================================
// Actions
// ============================================================

export type GameAction =
  | { type: 'INIT_NEW_GAME'; scenarioId?: string }
  | { type: 'LOAD_SAVE'; save: SaveFile }
  | { type: 'QUEUE_ACTION'; action: QueuedAction }
  | { type: 'REMOVE_ACTION'; actionId: string }
  | { type: 'TURN_RESOLVED'; result: TurnResolutionResult }
  | { type: 'SAVE_COMPLETED'; savedAt: number }
  | { type: 'UPDATE_GAME_STATE'; updater: (state: GameState) => GameState };

// ============================================================
// Context Value
// ============================================================

export interface GameContextValue {
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);

// ============================================================
// Initial State
// ============================================================

function createInitialState(): GameContextState {
  return {
    gameState: createDefaultScenario(),
    turnHistory: [],
    eventHistory: [],
    intelligenceReports: [],
    lastTurnResult: null,
    isMidTurn: false,
    lastSavedAt: null,
  };
}

// ============================================================
// Reducer
// ============================================================

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'INIT_NEW_GAME': {
      return createInitialState();
    }

    case 'LOAD_SAVE': {
      const { save } = action;
      return {
        gameState: save.gameState,
        turnHistory: save.turnHistory,
        eventHistory: save.eventHistory,
        intelligenceReports: save.intelligenceReports,
        lastTurnResult: null,
        isMidTurn: save.isMidTurn,
        lastSavedAt: save.savedAt,
      };
    }

    case 'QUEUE_ACTION': {
      const { action: queuedAction } = action;
      const budget = state.gameState.actionBudget;

      const error = validateActionAddition(queuedAction, budget);
      if (error !== null) {
        // Validation failed — return state unchanged.
        // The hook surfaces the error synchronously before dispatching,
        // so this branch is a safety net.
        return state;
      }

      const newBudget = deductActionCost(budget, queuedAction);
      return {
        ...state,
        gameState: {
          ...state.gameState,
          actionBudget: newBudget,
        },
        isMidTurn: true,
      };
    }

    case 'REMOVE_ACTION': {
      const { actionId } = action;
      const budget = state.gameState.actionBudget;
      const removedAction = budget.queuedActions.find((a) => a.id === actionId);

      if (!removedAction) {
        return state;
      }

      const remaining = budget.queuedActions.filter((a) => a.id !== actionId);

      // Recalculate slots from scratch to avoid drift.
      const policyActions = remaining.filter(
        (a) => a.type === ActionType.PolicyChange,
      );
      const slotActions = remaining.filter((a) => !a.isFree && a.type !== ActionType.PolicyChange);
      const slotsUsed = slotActions.reduce((sum, a) => sum + a.slotCost, 0);

      return {
        ...state,
        gameState: {
          ...state.gameState,
          actionBudget: {
            ...budget,
            slotsUsed,
            slotsRemaining: budget.slotsTotal - slotsUsed,
            policyChangesUsedThisTurn: policyActions.length,
            queuedActions: remaining,
          },
        },
        isMidTurn: remaining.length > 0,
      };
    }

    case 'TURN_RESOLVED': {
      const { result } = action;

      // Move resolved events from the previous turn into event history.
      const newlyResolved = state.gameState.activeEvents.filter((e) => e.isResolved);

      return {
        ...state,
        gameState: result.nextState,
        turnHistory: [...state.turnHistory, result.historyEntry],
        eventHistory: [...state.eventHistory, ...newlyResolved],
        intelligenceReports: [...state.intelligenceReports, ...result.generatedReports],
        lastTurnResult: result,
        isMidTurn: false,
        lastSavedAt: state.lastSavedAt,
      };
    }

    case 'SAVE_COMPLETED': {
      return {
        ...state,
        lastSavedAt: action.savedAt,
      };
    }

    case 'UPDATE_GAME_STATE': {
      return {
        ...state,
        gameState: action.updater(state.gameState),
      };
    }

    default:
      return state;
  }
}

// ============================================================
// Provider Component
// ============================================================

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const value = useMemo<GameContextValue>(
    () => ({ state, dispatch }),
    [state, dispatch],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
