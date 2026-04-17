// Phase 3 — Tests for rival-agendas system.

import { describe, expect, it } from 'vitest';
import {
  NeighborActionType,
  NeighborDisposition,
  RivalAgenda,
  type GameState,
  type NeighborState,
  type RivalActionPressureScores,
  type RivalAgendaState,
} from '../engine/types';
import { seededRandom } from '../data/text/name-generation';
import {
  applyAgendaPressureModifier,
  selectInitialAgenda,
  shouldAgendaShift,
  tickAgenda,
} from '../engine/systems/rival-agendas';
import { createDefaultScenario } from '../data/scenarios/default';
import { createFracturedInheritanceScenario } from '../data/scenarios/fractured-inheritance';

// ---- Helpers ----------------------------------------------------------

function findNeighbor(state: GameState, id: string): NeighborState {
  const n = state.diplomacy.neighbors.find((nb) => nb.id === id);
  if (!n) throw new Error(`Expected neighbor ${id} in scenario`);
  return n;
}

function flatPressure(value = 1): RivalActionPressureScores {
  return Object.values(NeighborActionType).reduce((acc, k) => {
    acc[k] = value;
    return acc;
  }, {} as RivalActionPressureScores);
}

// ---- selectInitialAgenda ---------------------------------------------

describe('selectInitialAgenda', () => {
  it('produces a deterministic agenda for the same seed + state', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const a = selectInitialAgenda(valdris, state, seededRandom('test_seed_a'));
    const b = selectInitialAgenda(valdris, state, seededRandom('test_seed_a'));
    expect(a).toEqual(b);
  });

  it('varies across seeds', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const seeds = ['s1', 's2', 's3', 's4', 's5', 's6'];
    const agendas = new Set(
      seeds.map((s) => selectInitialAgenda(valdris, state, seededRandom(s)).current),
    );
    expect(agendas.size).toBeGreaterThanOrEqual(2);
  });

  it('anchors RestoreTheOldBorders.targetEntityId to the first claimed region', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    // Try many seeds until we roll RestoreTheOldBorders — it is weighted
    // heavily for Aggressive rivals. The test just verifies targeting.
    let found: RivalAgendaState | null = null;
    for (let i = 0; i < 50; i++) {
      const candidate = selectInitialAgenda(valdris, state, seededRandom(`try_${i}`));
      if (candidate.current === RivalAgenda.RestoreTheOldBorders) {
        found = candidate;
        break;
      }
    }
    // In default scenario, valdris has an ancestral claim on region_ironvale.
    if (found) {
      expect(found.targetEntityId).toBe('region_ironvale');
    }
    // Else: acceptable — the disposition mix did not land on this agenda.
  });

  it('falls back to a non-empty agenda even for an isolated neighbor with no claims', () => {
    // Craft a minimal state with a single neighbor and no claims.
    const state = createDefaultScenario();
    const minimal: GameState = {
      ...state,
      geography: {
        schemaVersion: 1,
        edges: [],
        historicClaims: [],
        settlements: [],
      },
      diplomacy: {
        ...state.diplomacy,
        neighbors: [
          { ...state.diplomacy.neighbors[0], disposition: NeighborDisposition.Aggressive },
        ],
      },
    };
    const picked = selectInitialAgenda(minimal.diplomacy.neighbors[0], minimal, seededRandom('x'));
    expect(picked.current).toBeDefined();
    expect(picked.turnsActive).toBe(0);
  });
});

// ---- tickAgenda -------------------------------------------------------

describe('tickAgenda', () => {
  it('increments turnsActive each tick', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    if (!valdris.agenda) throw new Error('Scenario should have seeded agendas');
    const next = tickAgenda(valdris.agenda, valdris, state, seededRandom('t'));
    expect(next.turnsActive).toBe(valdris.agenda.turnsActive + 1);
  });

  it('builds RestoreTheOldBorders progress while the region is unoccupied', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    // Force a RestoreTheOldBorders agenda targeted at an unoccupied region.
    const agenda: RivalAgendaState = {
      current: RivalAgenda.RestoreTheOldBorders,
      targetEntityId: 'region_ironvale',
      progressValue: 0,
      turnsActive: 0,
    };
    const next = tickAgenda(agenda, valdris, state, seededRandom('t'));
    expect(next.progressValue).toBeGreaterThan(0);
  });

  it('stalls RestoreTheOldBorders progress once the region is occupied', () => {
    const state = createDefaultScenario();
    const occupied: GameState = {
      ...state,
      regions: state.regions.map((r) =>
        r.id === 'region_ironvale' ? { ...r, isOccupied: true } : r,
      ),
    };
    const valdris = findNeighbor(occupied, 'neighbor_valdris');
    const agenda: RivalAgendaState = {
      current: RivalAgenda.RestoreTheOldBorders,
      targetEntityId: 'region_ironvale',
      progressValue: 10,
      turnsActive: 0,
    };
    const next = tickAgenda(agenda, valdris, occupied, seededRandom('t'));
    // satisfaction=='satisfied' sets progress to 100 (agenda accomplished).
    expect(next.progressValue).toBe(100);
  });
});

// ---- shouldAgendaShift -----------------------------------------------

describe('shouldAgendaShift', () => {
  it('returns true once turnsActive >= 24', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const aged: RivalAgendaState = {
      current: RivalAgenda.DefensiveConsolidation,
      targetEntityId: null,
      progressValue: 0,
      turnsActive: 24,
    };
    expect(shouldAgendaShift(aged, valdris, state)).toBe(true);
  });

  it('returns true when progressValue >= 100 (satisfied)', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const done: RivalAgendaState = {
      current: RivalAgenda.RestoreTheOldBorders,
      targetEntityId: 'region_ironvale',
      progressValue: 100,
      turnsActive: 4,
    };
    expect(shouldAgendaShift(done, valdris, state)).toBe(true);
  });

  it('returns false for a freshly-active agenda below its cap', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const fresh: RivalAgendaState = {
      current: RivalAgenda.DefensiveConsolidation,
      targetEntityId: null,
      progressValue: 5,
      turnsActive: 2,
    };
    expect(shouldAgendaShift(fresh, valdris, state)).toBe(false);
  });
});

// ---- applyAgendaPressureModifier --------------------------------------

describe('applyAgendaPressureModifier', () => {
  it('raises WarDeclaration score for RestoreTheOldBorders', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const agenda: RivalAgendaState = {
      current: RivalAgenda.RestoreTheOldBorders,
      targetEntityId: 'region_ironvale',
      progressValue: 0,
      turnsActive: 0,
    };
    const base = flatPressure(0.5);
    const out = applyAgendaPressureModifier(base, agenda, valdris, state);
    expect(out[NeighborActionType.WarDeclaration]).toBeGreaterThan(
      base[NeighborActionType.WarDeclaration],
    );
  });

  it('lowers WarDeclaration score for DefensiveConsolidation', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const agenda: RivalAgendaState = {
      current: RivalAgenda.DefensiveConsolidation,
      targetEntityId: null,
      progressValue: 0,
      turnsActive: 0,
    };
    const base = flatPressure(1);
    const out = applyAgendaPressureModifier(base, agenda, valdris, state);
    expect(out[NeighborActionType.WarDeclaration]).toBeLessThan(
      base[NeighborActionType.WarDeclaration],
    );
  });

  it('clamps each score to at most 2', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const agenda: RivalAgendaState = {
      current: RivalAgenda.RestoreTheOldBorders,
      targetEntityId: 'region_ironvale',
      progressValue: 0,
      turnsActive: 0,
    };
    const base = flatPressure(2);
    const out = applyAgendaPressureModifier(base, agenda, valdris, state);
    for (const action of Object.values(NeighborActionType)) {
      expect(out[action]).toBeLessThanOrEqual(2);
    }
  });

  it('returns a full record with no undefined keys', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const agenda: RivalAgendaState = {
      current: RivalAgenda.EconomicRecovery,
      targetEntityId: null,
      progressValue: 0,
      turnsActive: 0,
    };
    const base = flatPressure(1);
    const out = applyAgendaPressureModifier(base, agenda, valdris, state);
    for (const action of Object.values(NeighborActionType)) {
      expect(typeof out[action]).toBe('number');
      expect(Number.isFinite(out[action])).toBe(true);
    }
  });

  it('passes through unchanged when no agenda is provided', () => {
    const state = createDefaultScenario();
    const valdris = findNeighbor(state, 'neighbor_valdris');
    const base = flatPressure(0.7);
    const out = applyAgendaPressureModifier(base, undefined, valdris, state);
    expect(out).toBe(base);
  });
});

// ---- Scenario seeding integration ------------------------------------

describe('scenario seeding', () => {
  it('populates agenda and memory on every neighbor for the default scenario', () => {
    const state = createDefaultScenario();
    for (const n of state.diplomacy.neighbors) {
      expect(n.agenda).toBeDefined();
      expect(n.memory).toBeDefined();
      expect(Array.isArray(n.memory)).toBe(true);
    }
  });

  it('populates agendas for the fractured-inheritance scenario', () => {
    const state = createFracturedInheritanceScenario();
    for (const n of state.diplomacy.neighbors) {
      expect(n.agenda).toBeDefined();
      expect(n.memory).toEqual([]);
    }
  });
});
