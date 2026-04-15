import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState } from '../context/game-context';
import { FailureCondition } from '../engine/types';
import type { TurnResolutionResult } from '../engine/resolution/turn-resolution';

describe('gameReducer', () => {
  it('INIT_NEW_GAME creates a valid default state', () => {
    const state = createInitialState();
    expect(state.gameState).toBeDefined();
    expect(state.gameState.turn.turnNumber).toBe(1);
    expect(state.isGameOver).toBe(false);
    expect(state.gameOverConditions).toEqual([]);
    expect(state.turnHistory).toEqual([]);
    expect(state.chronicle).toEqual([]);
  });

  it('INIT_NEW_GAME with scenarioId creates correct scenario', () => {
    const state = createInitialState('fractured_inheritance');
    expect(state.gameState.scenarioId).toBe('fractured_inheritance');
  });

  it('INIT_NEW_GAME resets to clean state', () => {
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'INIT_NEW_GAME', scenarioId: 'frozen_march' });
    expect(result.gameState.scenarioId).toBe('frozen_march');
    expect(result.isGameOver).toBe(false);
    expect(result.turnHistory).toEqual([]);
  });

  it('TURN_RESOLVED sets isGameOver when failure conditions present', () => {
    const initial = createInitialState();
    const mockResult = {
      nextState: initial.gameState,
      historyEntry: {
        turnNumber: 1,
        season: initial.gameState.turn.season,
        year: 1,
        actions: [],
      },
      resolvedEvents: [],
      generatedReports: [],
      triggeredFailureConditions: [FailureCondition.Famine],
      failureWarnings: [],
      newlyUnlockedMilestones: [],
      completedConstructionIds: [],
    } as unknown as TurnResolutionResult;

    const result = gameReducer(initial, { type: 'TURN_RESOLVED', result: mockResult, decisions: [] });
    expect(result.isGameOver).toBe(true);
    expect(result.gameOverConditions).toEqual([FailureCondition.Famine]);
  });

  it('TURN_RESOLVED does not set isGameOver when no failure conditions', () => {
    const initial = createInitialState();
    const mockResult = {
      nextState: initial.gameState,
      historyEntry: {
        turnNumber: 1,
        season: initial.gameState.turn.season,
        year: 1,
        actions: [],
      },
      resolvedEvents: [],
      generatedReports: [],
      triggeredFailureConditions: [],
      failureWarnings: [],
      newlyUnlockedMilestones: [],
      completedConstructionIds: [],
    } as unknown as TurnResolutionResult;

    const result = gameReducer(initial, { type: 'TURN_RESOLVED', result: mockResult, decisions: [] });
    expect(result.isGameOver).toBe(false);
    expect(result.gameOverConditions).toEqual([]);
  });

  it('SAVE_COMPLETED updates lastSavedAt', () => {
    const initial = createInitialState();
    const now = Date.now();
    const result = gameReducer(initial, { type: 'SAVE_COMPLETED', savedAt: now });
    expect(result.lastSavedAt).toBe(now);
  });
});
