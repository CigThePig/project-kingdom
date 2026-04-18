// Phase 14 — Mole lifecycle tests.

import { describe, it, expect } from 'vitest';

import {
  planMoleFromRival,
  tickMoleDetection,
  applyMoleExposure,
  MOLE_DETECTION_EXPOSE_THRESHOLD,
  RIVAL_MOLE_CAPABILITY_MIN,
} from '../engine/systems/agents';
import {
  CouncilSeat,
  type CouncilState,
  type EspionageState,
  type Mole,
  type NeighborState,
  NeighborDisposition,
  DiplomaticPosture,
} from '../engine/types';
import { createDefaultScenario } from '../data/scenarios/default';
import { seededRandom } from '../data/text/name-generation';

function emptyCouncil(): CouncilState {
  return { appointments: {}, pendingCandidates: [] };
}

function makeNeighbor(overrides: Partial<NeighborState> = {}): NeighborState {
  return {
    id: 'neighbor_rival',
    relationshipScore: 50,
    attitudePosture: DiplomaticPosture.Neutral,
    activeAgreements: [],
    pendingProposals: [],
    outstandingTensions: [],
    disposition: NeighborDisposition.Cautious,
    militaryStrength: 50,
    religiousProfile: 'faith_default',
    culturalIdentity: 'culture_default',
    espionageCapability: RIVAL_MOLE_CAPABILITY_MIN + 10,
    lastActionTurn: 0,
    warWeariness: 0,
    isAtWarWithPlayer: false,
    recentActionHistory: [],
    ...overrides,
  };
}

describe('planMoleFromRival', () => {
  it('returns null when espionageCapability is too low', () => {
    const neighbor = makeNeighbor({ espionageCapability: 30 });
    // Any rng — capability gate should short-circuit first.
    const result = planMoleFromRival(
      neighbor.id,
      neighbor,
      emptyCouncil(),
      5,
      () => 0.001,
    );
    expect(result).toBeNull();
  });

  it('returns null when every council seat is filled', () => {
    const neighbor = makeNeighbor({ espionageCapability: 95 });
    const filled: CouncilState = {
      appointments: {
        [CouncilSeat.Chancellor]: { id: 'adv1' } as never,
        [CouncilSeat.Marshal]: { id: 'adv2' } as never,
        [CouncilSeat.Chamberlain]: { id: 'adv3' } as never,
        [CouncilSeat.Spymaster]: { id: 'adv4' } as never,
      },
      pendingCandidates: [],
    };
    // Force successful rng — still null because no empty seat exists.
    const result = planMoleFromRival(neighbor.id, neighbor, filled, 5, () => 0.001);
    expect(result).toBeNull();
  });

  it('plants a mole when rng passes and at least one seat is empty', () => {
    const neighbor = makeNeighbor({ espionageCapability: 95 });
    // First rng value is the probability gate; second picks the seat index.
    const sequence = [0.001, 0.5];
    let i = 0;
    const rng = () => sequence[i++] ?? 0.5;
    const result = planMoleFromRival(
      neighbor.id,
      neighbor,
      emptyCouncil(),
      5,
      rng,
    );
    expect(result).not.toBeNull();
    expect(result!.plantedByNeighborId).toBe(neighbor.id);
    expect(result!.isExposed).toBe(false);
  });
});

describe('tickMoleDetection', () => {
  it('grows detection progress over time', () => {
    const state = createDefaultScenario();
    // Inject a neighbor with known espionageCapability to make the math stable.
    state.diplomacy.neighbors = [makeNeighbor({ espionageCapability: 40 })];
    const mole: Mole = {
      id: 'mole_test',
      plantedByNeighborId: 'neighbor_rival',
      seat: CouncilSeat.Chamberlain,
      detectionProgress: 10,
      turnsActive: 0,
      policyDriftIntensity: 20,
      isExposed: false,
      plantedTurn: 1,
    };
    const esp: EspionageState = {
      networkStrength: 40,
      counterIntelligenceLevel: 60,
      agents: [],
      ongoingOperations: [],
      moles: [mole],
    };
    let current = esp;
    for (let t = 0; t < 10; t++) {
      current = tickMoleDetection(current, state, seededRandom(`tick_${t}`));
    }
    expect(current.moles![0].detectionProgress).toBeGreaterThan(10);
    expect(current.moles![0].turnsActive).toBe(10);
  });

  it('instantly exposes a mole when the seat has been filled', () => {
    const state = createDefaultScenario();
    state.council = {
      appointments: {
        [CouncilSeat.Chamberlain]: { id: 'adv_filled' } as never,
      },
      pendingCandidates: [],
    };
    const mole: Mole = {
      id: 'mole_conflict',
      plantedByNeighborId: 'neighbor_rival',
      seat: CouncilSeat.Chamberlain,
      detectionProgress: 0,
      turnsActive: 0,
      policyDriftIntensity: 10,
      isExposed: false,
      plantedTurn: 1,
    };
    const esp: EspionageState = {
      networkStrength: 40,
      counterIntelligenceLevel: 40,
      agents: [],
      ongoingOperations: [],
      moles: [mole],
    };
    const out = tickMoleDetection(esp, state, seededRandom('collision'));
    expect(out.moles![0].isExposed).toBe(true);
    expect(out.moles![0].detectionProgress).toBe(100);
  });
});

describe('applyMoleExposure', () => {
  const base: EspionageState = {
    networkStrength: 40,
    counterIntelligenceLevel: 30,
    agents: [],
    ongoingOperations: [],
    moles: [
      {
        id: 'mole_x',
        plantedByNeighborId: 'neighbor_rival',
        seat: CouncilSeat.Spymaster,
        detectionProgress: MOLE_DETECTION_EXPOSE_THRESHOLD + 5,
        turnsActive: 5,
        policyDriftIntensity: 25,
        isExposed: false,
        plantedTurn: 1,
      },
    ],
  };

  it('expose removes the mole and produces a negative relationship delta', () => {
    const res = applyMoleExposure(base, 'mole_x', 'expose');
    expect(res.espionage.moles!.length).toBe(0);
    expect(res.relationshipDelta).toBeLessThan(0);
    expect(res.relationshipTarget).toBe('neighbor_rival');
    expect(res.rivalMisinformation).toBe(false);
  });

  it('feed_false_intel keeps the mole but flags misinformation and lifts counter-intel', () => {
    const res = applyMoleExposure(base, 'mole_x', 'feed_false_intel');
    expect(res.espionage.moles!.length).toBe(1);
    expect(res.espionage.moles![0].isExposed).toBe(true);
    expect(res.espionage.counterIntelligenceLevel).toBeGreaterThan(
      base.counterIntelligenceLevel,
    );
    expect(res.relationshipDelta).toBe(0);
    expect(res.rivalMisinformation).toBe(true);
  });

  it('the two choices produce distinct state deltas', () => {
    const a = applyMoleExposure(base, 'mole_x', 'expose');
    const b = applyMoleExposure(base, 'mole_x', 'feed_false_intel');
    expect(a.espionage.moles!.length).not.toBe(b.espionage.moles!.length);
    expect(a.relationshipDelta).not.toBe(b.relationshipDelta);
  });
});
