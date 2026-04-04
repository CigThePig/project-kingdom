// Phase 7 — Read-only hooks for accessing current kingdom state.
// Blueprint Reference: TECHNICAL.md — State Management

import { useContext } from 'react';

import type {
  ActionBudget,
  CrownBarData,
  FailureCondition,
  GameState,
  IntelligenceReport,
  TurnHistoryEntry,
  TurnState,
} from '../../engine/types';
import type { TurnResolutionResult } from '../../engine/resolution/turn-resolution';
import { GameContext, type GameAction, type GameContextState } from '../context/game-context';

// ============================================================
// Internal helper
// ============================================================

function useGameContext() {
  const ctx = useContext(GameContext);
  if (ctx === null) {
    throw new Error('useGameState must be used within a <GameProvider>');
  }
  return ctx;
}

// ============================================================
// Full context state
// ============================================================

export function useGameState(): GameContextState {
  return useGameContext().state;
}

// ============================================================
// Focused selectors
// ============================================================

export function useKingdomState(): GameState {
  return useGameContext().state.gameState;
}

export function useTurnInfo(): TurnState {
  return useGameContext().state.gameState.turn;
}

export function useCrownBar(): CrownBarData {
  return useGameContext().state.gameState.crownBar;
}

export function useActionBudget(): ActionBudget {
  return useGameContext().state.gameState.actionBudget;
}

export function useTurnHistory(): TurnHistoryEntry[] {
  return useGameContext().state.turnHistory;
}

export function useLastTurnResult(): TurnResolutionResult | null {
  return useGameContext().state.lastTurnResult;
}

export function useIntelligenceReports(): IntelligenceReport[] {
  return useGameContext().state.intelligenceReports;
}

export function useIsMidTurn(): boolean {
  return useGameContext().state.isMidTurn;
}

export function useIsGameOver(): boolean {
  return useGameContext().state.isGameOver;
}

export function useGameOverConditions(): FailureCondition[] {
  return useGameContext().state.gameOverConditions;
}

export function useGameDispatch(): React.Dispatch<GameAction> {
  return useGameContext().dispatch;
}
