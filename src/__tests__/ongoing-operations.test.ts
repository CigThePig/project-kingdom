// Phase 14 — Ongoing-operations staged-findings tests.

import { describe, it, expect } from 'vitest';

import {
  startOngoingOperation,
  tickOngoingOperations,
  abortOngoingOperation,
  DEFAULT_ONGOING_OP_TURNS,
} from '../engine/systems/agents';
import {
  IntelligenceOperationType,
  type EspionageState,
  type NeighborState,
} from '../engine/types';
import { createDefaultScenario } from '../data/scenarios/default';
import { seededRandom } from '../data/text/name-generation';

function baseEsp(): EspionageState {
  return {
    networkStrength: 50,
    counterIntelligenceLevel: 40,
    agents: [],
    ongoingOperations: [],
    moles: [],
  };
}

describe('startOngoingOperation', () => {
  it('adds an operation in the running state with findings empty', () => {
    const esp = baseEsp();
    const out = startOngoingOperation(esp, {
      opType: IntelligenceOperationType.Reconnaissance,
      targetId: 'neighbor_test',
      agentId: 'agent_1',
      turn: 3,
      opId: 'op_test',
    });
    expect(out.ongoingOperations?.length).toBe(1);
    const op = out.ongoingOperations![0];
    expect(op.status).toBe('running');
    expect(op.turnsElapsed).toBe(0);
    expect(op.turnsTotal).toBe(DEFAULT_ONGOING_OP_TURNS);
    expect(op.findings.length).toBe(0);
  });
});

describe('tickOngoingOperations', () => {
  it('grows findings by one each tick', () => {
    const state = createDefaultScenario();
    let esp = startOngoingOperation(baseEsp(), {
      opType: IntelligenceOperationType.Reconnaissance,
      targetId: state.diplomacy.neighbors[0]?.id ?? 'neighbor_a',
      agentId: null,
      turn: 1,
      opId: 'op_tick',
      turnsTotal: 4,
    });
    const neighbors: NeighborState[] = state.diplomacy.neighbors;
    let reportCount = 0;
    for (let t = 1; t <= 4; t++) {
      const res = tickOngoingOperations(
        esp,
        state,
        (key) => seededRandom(`${key}_t${t}`),
        t,
        neighbors,
      );
      esp = res.espionage;
      reportCount += res.newReports.length;
      const op = esp.ongoingOperations![0];
      if (t < 4) {
        expect(op.status).toBe('running');
        expect(op.findings.length).toBe(t);
      } else {
        expect(op.status).toBe('completed');
        expect(op.findings.length).toBeGreaterThanOrEqual(4);
      }
    }
    // Exactly ONE report emitted, on the final stage.
    expect(reportCount).toBe(1);
  });

  it('findings grow monotonically', () => {
    const state = createDefaultScenario();
    let esp = startOngoingOperation(baseEsp(), {
      opType: IntelligenceOperationType.Reconnaissance,
      targetId: state.diplomacy.neighbors[0]?.id ?? 'neighbor_a',
      agentId: null,
      turn: 1,
      opId: 'op_mono',
      turnsTotal: 4,
    });
    const neighbors: NeighborState[] = state.diplomacy.neighbors;
    const lengths: number[] = [];
    for (let t = 1; t <= 4; t++) {
      const res = tickOngoingOperations(
        esp,
        state,
        (key) => seededRandom(`${key}_m${t}`),
        t,
        neighbors,
      );
      esp = res.espionage;
      lengths.push(esp.ongoingOperations![0].findings.length);
    }
    for (let i = 1; i < lengths.length; i++) {
      expect(lengths[i]).toBeGreaterThanOrEqual(lengths[i - 1]);
    }
  });
});

describe('abortOngoingOperation', () => {
  it('marks an operation aborted and further ticks do not emit reports', () => {
    const state = createDefaultScenario();
    let esp = startOngoingOperation(baseEsp(), {
      opType: IntelligenceOperationType.Reconnaissance,
      targetId: state.diplomacy.neighbors[0]?.id ?? 'neighbor_a',
      agentId: null,
      turn: 1,
      opId: 'op_abort',
      turnsTotal: 4,
    });
    esp = abortOngoingOperation(esp, 'op_abort');
    expect(esp.ongoingOperations![0].status).toBe('aborted');

    const res = tickOngoingOperations(
      esp,
      state,
      (key) => seededRandom(`${key}_abort`),
      2,
      state.diplomacy.neighbors,
    );
    expect(res.newReports.length).toBe(0);
    expect(res.espionage.ongoingOperations![0].status).toBe('aborted');
  });
});
