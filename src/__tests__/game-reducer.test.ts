import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState, createScenarioState } from '../context/game-context';
import { FailureCondition, type GameState, type SaveFile } from '../engine/types';
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

describe('LOAD_SAVE geography migration (Phase 2.5)', () => {
  function makeLegacySave(scenarioId: string): SaveFile {
    const fresh = createScenarioState(scenarioId);
    // Strip geography + displayName to emulate a v1 save.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { geography: _geo, ...rest } = fresh;
    const legacyState: GameState = {
      ...(rest as GameState),
      regions: fresh.regions.map((r) => ({ ...r, displayName: undefined })),
    };
    return {
      version: 1,
      scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: legacyState,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
  }

  it('synthesizes geography for a v1 save with no geography field', () => {
    const save = makeLegacySave('new_crown');
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });

    expect(result.gameState.geography).toBeDefined();
    expect(result.gameState.geography!.edges.length).toBeGreaterThan(0);
    expect(result.gameState.geography!._adjacencyIndex).toBeDefined();
  });

  it('back-fills procgen displayName on every region', () => {
    const save = makeLegacySave('new_crown');
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });

    for (const r of result.gameState.regions) {
      expect(r.displayName).toBeTruthy();
    }
  });

  it('sets borderRegion flags derived from geography edges', () => {
    const save = makeLegacySave('new_crown');
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });

    const timbermark = result.gameState.regions.find(
      (r) => r.id === 'region_timbermark',
    )!;
    const heartlands = result.gameState.regions.find(
      (r) => r.id === 'region_heartlands',
    )!;
    expect(timbermark.borderRegion).toBe(true);
    expect(heartlands.borderRegion).toBe(false);
  });

  it('round-trips: save then load preserves edges, claims, and names', () => {
    const initial = createScenarioState('new_crown');
    const save: SaveFile = {
      version: 2,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: initial,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });

    expect(loaded.gameState.geography!.edges).toEqual(initial.geography!.edges);
    expect(loaded.gameState.geography!.historicClaims).toEqual(
      initial.geography!.historicClaims,
    );
    expect(loaded.gameState.regions.map((r) => r.displayName)).toEqual(
      initial.regions.map((r) => r.displayName),
    );
  });

  it('falls back to emergency geography for unknown scenarioId', () => {
    const save = makeLegacySave('new_crown');
    save.gameState.scenarioId = 'legacy_removed_scenario';
    save.scenarioId = 'legacy_removed_scenario';
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });

    expect(result.gameState.geography).toBeDefined();
    // Emergency geography connects every region to every neighbor.
    expect(result.gameState.geography!.edges.length).toBeGreaterThan(0);
    for (const r of result.gameState.regions) {
      expect(r.displayName).toBeTruthy();
    }
  });
});
