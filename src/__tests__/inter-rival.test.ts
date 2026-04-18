// Phase 11 — Tests for inter-rival (Inter-Kingdom Diplomacy) system.

import { describe, expect, it } from 'vitest';
import {
  RivalAgenda,
  type GameState,
  type InterRivalAgreement,
} from '../engine/types';
import { seededRandom } from '../data/text/name-generation';
import {
  createInitialRivalRelationships,
  tickInterRivalRelationships,
  generateInterRivalActions,
  applyInterRivalAction,
  expireInterRivalAgreements,
  getActiveInterRivalWars,
  getActiveInterRivalAlliances,
  findCoalitionCandidates,
  seedInterRivalRelationships,
} from '../engine/systems/inter-rival';
import { createDefaultScenario } from '../data/scenarios/default';

// ---- Helpers ----------------------------------------------------------

function pairScore(
  state: GameState,
  a: string,
  b: string,
): number {
  return state.diplomacy.rivalRelationships?.[a]?.[b] ?? 0;
}

// ---- createInitialRivalRelationships ----------------------------------

describe('createInitialRivalRelationships', () => {
  it('is symmetric', () => {
    const state = createDefaultScenario();
    const matrix = createInitialRivalRelationships(
      state.diplomacy.neighbors,
      state.geography,
    );
    for (const a of Object.keys(matrix)) {
      for (const b of Object.keys(matrix[a] ?? {})) {
        expect(matrix[a][b]).toBe(matrix[b]?.[a]);
      }
    }
  });

  it('is deterministic for the same neighbors + geography', () => {
    const state = createDefaultScenario();
    const m1 = createInitialRivalRelationships(
      state.diplomacy.neighbors,
      state.geography,
    );
    const m2 = createInitialRivalRelationships(
      state.diplomacy.neighbors,
      state.geography,
    );
    expect(m1).toEqual(m2);
  });

  it('populates every rival pair', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    const matrix = createInitialRivalRelationships(
      neighbors,
      state.geography,
    );
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const a = neighbors[i].id;
        const b = neighbors[j].id;
        expect(matrix[a]?.[b]).toBeDefined();
        expect(matrix[b]?.[a]).toBeDefined();
      }
    }
  });
});

// ---- seedInterRivalRelationships --------------------------------------

describe('seedInterRivalRelationships', () => {
  it('is idempotent', () => {
    const state = createDefaultScenario();
    const first = seedInterRivalRelationships(state);
    const second = seedInterRivalRelationships(first);
    expect(second.diplomacy.rivalRelationships).toEqual(
      first.diplomacy.rivalRelationships,
    );
    expect(second.diplomacy.interRivalAgreements).toEqual(
      first.diplomacy.interRivalAgreements,
    );
  });

  it('populates rivalRelationships and interRivalAgreements', () => {
    const state = createDefaultScenario();
    expect(state.diplomacy.rivalRelationships).toBeDefined();
    expect(state.diplomacy.interRivalAgreements).toEqual([]);
  });
});

// ---- tickInterRivalRelationships --------------------------------------

describe('tickInterRivalRelationships', () => {
  it('drifts scores when rivals share an agenda target', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    const a = neighbors[0];
    const b = neighbors[1];
    const nextState: GameState = {
      ...state,
      diplomacy: {
        ...state.diplomacy,
        neighbors: state.diplomacy.neighbors.map((n) => {
          if (n.id === a.id || n.id === b.id) {
            return {
              ...n,
              agenda: {
                current: RivalAgenda.BleedTheRivals,
                targetEntityId: 'neighbor_shared_target',
                progressValue: 10,
                turnsActive: 2,
              },
            };
          }
          return n;
        }),
      },
    };
    const scoreBefore = pairScore(nextState, a.id, b.id);
    const result = tickInterRivalRelationships(
      nextState.diplomacy,
      nextState,
    );
    const scoreAfter =
      result.diplomacy.rivalRelationships?.[a.id]?.[b.id] ?? 0;
    expect(scoreAfter).toBeGreaterThan(scoreBefore);
  });

  it('drifts scores down when rivals target each other', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    const a = neighbors[0];
    const b = neighbors[1];
    const modified: GameState = {
      ...state,
      diplomacy: {
        ...state.diplomacy,
        neighbors: state.diplomacy.neighbors.map((n) => {
          if (n.id === a.id) {
            return {
              ...n,
              agenda: {
                current: RivalAgenda.ProveDominance,
                targetEntityId: b.id,
                progressValue: 10,
                turnsActive: 2,
              },
            };
          }
          return n;
        }),
      },
    };
    const scoreBefore = pairScore(modified, a.id, b.id);
    const result = tickInterRivalRelationships(
      modified.diplomacy,
      modified,
    );
    const scoreAfter =
      result.diplomacy.rivalRelationships?.[a.id]?.[b.id] ?? 0;
    expect(scoreAfter).toBeLessThan(scoreBefore);
  });
});

// ---- generateInterRivalActions ----------------------------------------

describe('generateInterRivalActions', () => {
  it('returns no actions when scores are neutral', () => {
    const state = createDefaultScenario();
    // Reset matrix to zeroes.
    const neighbors = state.diplomacy.neighbors;
    const zeroMatrix: Record<string, Record<string, number>> = {};
    for (const a of neighbors) {
      zeroMatrix[a.id] = {};
      for (const b of neighbors) {
        if (a.id !== b.id) zeroMatrix[a.id][b.id] = 0;
      }
    }
    const flat: GameState = {
      ...state,
      diplomacy: { ...state.diplomacy, rivalRelationships: zeroMatrix },
    };
    const actions = generateInterRivalActions(
      flat.diplomacy,
      flat,
      1,
      seededRandom('gen1'),
    );
    expect(actions).toHaveLength(0);
  });

  it('caps actions at 1 per turn globally', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    // Saturate every pair so many would otherwise fire.
    const highMatrix: Record<string, Record<string, number>> = {};
    for (const a of neighbors) {
      highMatrix[a.id] = {};
      for (const b of neighbors) {
        if (a.id !== b.id) highMatrix[a.id][b.id] = 90;
      }
    }
    const hot: GameState = {
      ...state,
      diplomacy: {
        ...state.diplomacy,
        rivalRelationships: highMatrix,
        neighbors: state.diplomacy.neighbors.map((n) => ({
          ...n,
          agenda: {
            current: RivalAgenda.DynasticAlliance,
            targetEntityId: null,
            progressValue: 10,
            turnsActive: 2,
          },
          isAtWarWithPlayer: true,
        })),
      },
    };
    const actions = generateInterRivalActions(
      hot.diplomacy,
      hot,
      5,
      seededRandom('cap'),
    );
    expect(actions.length).toBeLessThanOrEqual(1);
  });
});

// ---- applyInterRivalAction --------------------------------------------

describe('applyInterRivalAction', () => {
  it('creates an alliance agreement and sets score to at least 75', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    const a = neighbors[0].id;
    const b = neighbors[1].id;
    const next = applyInterRivalAction(
      state.diplomacy,
      { kind: 'alliance', a, b, turnGenerated: 3 },
      3,
    );
    expect(next.interRivalAgreements).toHaveLength(1);
    expect(next.interRivalAgreements?.[0].kind).toBe('alliance');
    const scoreA = next.rivalRelationships?.[a]?.[b] ?? 0;
    expect(scoreA).toBeGreaterThanOrEqual(75);
  });

  it('creates a war agreement and sets score to at most -80', () => {
    const state = createDefaultScenario();
    const neighbors = state.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    const a = neighbors[0].id;
    const b = neighbors[1].id;
    const next = applyInterRivalAction(
      state.diplomacy,
      { kind: 'war', a, b, turnGenerated: 3 },
      3,
    );
    expect(next.rivalRelationships?.[a]?.[b] ?? 0).toBeLessThanOrEqual(-80);
  });
});

// ---- expireInterRivalAgreements ---------------------------------------

describe('expireInterRivalAgreements', () => {
  it('expires trade pacts after duration', () => {
    const agreements: InterRivalAgreement[] = [
      {
        id: 'a_b_trade_pact_t0',
        kind: 'trade_pact',
        a: 'neighbor_a',
        b: 'neighbor_b',
        turnStarted: 0,
      },
    ];
    const still = expireInterRivalAgreements(agreements, 10, () => 0.5);
    expect(still).toHaveLength(1);
    const gone = expireInterRivalAgreements(agreements, 30, () => 0.5);
    expect(gone).toHaveLength(0);
  });

  it('keeps alliances indefinitely', () => {
    const agreements: InterRivalAgreement[] = [
      {
        id: 'a_b_alliance_t0',
        kind: 'alliance',
        a: 'neighbor_a',
        b: 'neighbor_b',
        turnStarted: 0,
      },
    ];
    const still = expireInterRivalAgreements(agreements, 100, () => 0.5);
    expect(still).toHaveLength(1);
  });
});

// ---- Queries ----------------------------------------------------------

describe('getActiveInterRivalWars / Alliances', () => {
  it('filters by kind', () => {
    const diplomacy = {
      neighbors: [],
      interRivalAgreements: [
        {
          id: '1',
          kind: 'war' as const,
          a: 'x',
          b: 'y',
          turnStarted: 0,
        },
        {
          id: '2',
          kind: 'alliance' as const,
          a: 'x',
          b: 'y',
          turnStarted: 0,
        },
      ],
    };
    expect(getActiveInterRivalWars(diplomacy)).toHaveLength(1);
    expect(getActiveInterRivalAlliances(diplomacy)).toHaveLength(1);
  });
});

// ---- findCoalitionCandidates ------------------------------------------

describe('findCoalitionCandidates', () => {
  it('returns empty when no shared grievances exist', () => {
    const state = createDefaultScenario();
    const candidates = findCoalitionCandidates(state);
    expect(candidates).toEqual([]);
  });

  it('ranks pairs with shared grievances higher', () => {
    const base = createDefaultScenario();
    const neighbors = base.diplomacy.neighbors;
    if (neighbors.length < 2) return;
    const a = neighbors[0].id;
    const b = neighbors[1].id;
    const withGrievances: GameState = {
      ...base,
      diplomacy: {
        ...base.diplomacy,
        neighbors: base.diplomacy.neighbors.map((n) => {
          if (n.id === a || n.id === b) {
            return {
              ...n,
              memory: [
                {
                  turnRecorded: 1,
                  type: 'slight' as const,
                  source: 'shared_insult',
                  weight: 0.9,
                  context: 'test',
                },
              ],
            };
          }
          return n;
        }),
      },
    };
    const candidates = findCoalitionCandidates(withGrievances);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates[0].sharedGrievances).toBeGreaterThanOrEqual(1);
  });
});

// ---- Scenario integration --------------------------------------------

describe('scenario load', () => {
  it('default scenario seeds rivalRelationships and empty agreements', () => {
    const state = createDefaultScenario();
    expect(state.diplomacy.rivalRelationships).toBeDefined();
    expect(state.diplomacy.interRivalAgreements).toEqual([]);
  });
});
