import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState, createScenarioState } from '../context/game-context';
import { FailureCondition, RegionalPosture, type GameState, type SaveFile } from '../engine/types';
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

describe('LOAD_SAVE agenda + memory migration (Phase 3)', () => {
  function makeV2Save(scenarioId: string): SaveFile {
    const fresh = createScenarioState(scenarioId);
    // Strip agenda + memory to emulate a pre-Phase-3 (v2) save.
    const stripped: GameState = {
      ...fresh,
      diplomacy: {
        ...fresh.diplomacy,
        neighbors: fresh.diplomacy.neighbors.map((n) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { agenda: _a, memory: _m, ...rest } = n;
          return rest as typeof n;
        }),
      },
    };
    return {
      version: 2,
      scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: stripped,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
  }

  it('populates agenda and empty memory on every neighbor when loading a v2 save', () => {
    const save = makeV2Save('new_crown');
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });

    for (const n of result.gameState.diplomacy.neighbors) {
      expect(n.agenda).toBeDefined();
      expect(n.agenda!.current).toBeTruthy();
      expect(n.memory).toEqual([]);
    }
  });

  it('preserves existing agendas on a v3 save round-trip', () => {
    const initial = createScenarioState('new_crown');
    const save: SaveFile = {
      version: 3,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: initial,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    for (let i = 0; i < initial.diplomacy.neighbors.length; i++) {
      expect(loaded.gameState.diplomacy.neighbors[i].agenda).toEqual(
        initial.diplomacy.neighbors[i].agenda,
      );
    }
  });
});

// ============================================================
// Phase 9 — Regional posture: reducer action + save migration
// ============================================================

describe('SET_REGIONAL_POSTURE (Phase 9)', () => {
  it('sets posture and stamps postureSetOnTurn with the current turn', () => {
    const initial = createInitialState('new_crown');
    const target = initial.gameState.regions[0];
    const withTurn: typeof initial = {
      ...initial,
      gameState: { ...initial.gameState, turn: { ...initial.gameState.turn, turnNumber: 7 } },
    };
    const result = gameReducer(withTurn, {
      type: 'SET_REGIONAL_POSTURE',
      regionId: target.id,
      posture: RegionalPosture.Garrison,
    });
    const next = result.gameState.regions.find((r) => r.id === target.id)!;
    expect(next.posture).toBe(RegionalPosture.Garrison);
    expect(next.postureSetOnTurn).toBe(7);
  });

  it('leaves other regions untouched', () => {
    const initial = createInitialState('new_crown');
    const target = initial.gameState.regions[0];
    const result = gameReducer(initial, {
      type: 'SET_REGIONAL_POSTURE',
      regionId: target.id,
      posture: RegionalPosture.Extract,
    });
    for (const r of result.gameState.regions) {
      if (r.id === target.id) continue;
      const before = initial.gameState.regions.find((rr) => rr.id === r.id)!;
      expect(r.posture).toBe(before.posture);
      expect(r.postureSetOnTurn).toBe(before.postureSetOnTurn);
    }
  });
});

describe('LOAD_SAVE regional-posture migration (Phase 9)', () => {
  function makePrePhase9Save(scenarioId: string): SaveFile {
    const fresh = createScenarioState(scenarioId);
    // Strip posture fields from every region to emulate a pre-Phase-9 save.
    const legacy: GameState = {
      ...fresh,
      regions: fresh.regions.map((r) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { posture: _p, postureSetOnTurn: _pt, ...rest } = r;
        return rest;
      }),
    };
    return {
      version: 3,
      scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: legacy,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
  }

  it('back-fills Autonomy on every region from a pre-Phase-9 save', () => {
    const save = makePrePhase9Save('new_crown');
    const initial = createInitialState();
    const result = gameReducer(initial, { type: 'LOAD_SAVE', save });
    for (const r of result.gameState.regions) {
      expect(r.posture).toBe(RegionalPosture.Autonomy);
      expect(r.postureSetOnTurn).toBe(0);
    }
  });

  it('preserves non-Autonomy postures on a post-Phase-9 save round-trip', () => {
    const initial = createScenarioState('new_crown');
    const mutated: GameState = {
      ...initial,
      regions: initial.regions.map((r, i) =>
        i === 0
          ? { ...r, posture: RegionalPosture.Pacify, postureSetOnTurn: 4 }
          : r,
      ),
    };
    const save: SaveFile = {
      version: 3,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: mutated,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    const first = loaded.gameState.regions.find((r) => r.id === mutated.regions[0].id)!;
    expect(first.posture).toBe(RegionalPosture.Pacify);
    expect(first.postureSetOnTurn).toBe(4);
  });
});

describe('LOAD_SAVE bonds migration (Phase 13)', () => {
  it('back-fills empty diplomacy.bonds on a v6 save', () => {
    const base = createScenarioState('new_crown');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bonds: _bonds, ...diplomacyWithoutBonds } = base.diplomacy;
    const legacy: GameState = {
      ...base,
      diplomacy: diplomacyWithoutBonds as typeof base.diplomacy,
    };
    const save: SaveFile = {
      version: 6,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: legacy,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(loaded.gameState.diplomacy.bonds).toEqual([]);
  });

  it('preserves existing bonds on a round-trip', () => {
    const base = createScenarioState('new_crown');
    const neighborId = base.diplomacy.neighbors[0]!.id;
    const withBonds: GameState = {
      ...base,
      diplomacy: {
        ...base.diplomacy,
        bonds: [
          {
            bondId: 'royal_marriage_t1_abc123',
            kind: 'royal_marriage',
            turnStarted: 1,
            turnsRemaining: null,
            participants: [neighborId],
            breachPenalty: -20,
            spouseName: 'consort',
            dynastyId: 'dyn_test',
            heirProduced: false,
          },
        ],
      },
    };
    const save: SaveFile = {
      version: 7,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: withBonds,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    const bonds = loaded.gameState.diplomacy.bonds ?? [];
    expect(bonds).toHaveLength(1);
    expect(bonds[0].kind).toBe('royal_marriage');
  });
});

describe('LOAD_SAVE espionage migration (Phase 14)', () => {
  it('back-fills agents/ongoingOperations/moles arrays + rosterCap on a v7 save', () => {
    const base = createScenarioState('new_crown');
    const legacyEspionage = {
      networkStrength: base.espionage.networkStrength,
      counterIntelligenceLevel: base.espionage.counterIntelligenceLevel,
    } as typeof base.espionage;
    const legacy: GameState = { ...base, espionage: legacyEspionage };
    const save: SaveFile = {
      version: 7,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: legacy,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(loaded.gameState.espionage.agents).toEqual([]);
    expect(loaded.gameState.espionage.ongoingOperations).toEqual([]);
    expect(loaded.gameState.espionage.moles).toEqual([]);
    expect(loaded.gameState.espionage.agentRosterCap).toBe(6);
  });

  it('preserves a populated roster on round-trip', () => {
    const base = createScenarioState('new_crown');
    const populated: GameState = {
      ...base,
      espionage: {
        ...base.espionage,
        agents: [
          {
            id: 'agent_rt_1',
            codename: 'Blackthorn',
            specialization: 'Diplomatic',
            coverSettlementId: 'settlement_test',
            reliability: 60,
            burnRisk: 20,
            status: 'Active',
            recruitedTurn: 3,
          },
        ] as never,
        ongoingOperations: [],
        moles: [],
        agentRosterCap: 6,
      },
    };
    const save: SaveFile = {
      version: 8,
      scenarioId: 'new_crown',
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: populated,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(loaded.gameState.espionage.agents?.length).toBe(1);
    expect(loaded.gameState.espionage.agents?.[0].codename).toBe('Blackthorn');
  });
});
