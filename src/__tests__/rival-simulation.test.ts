// Phase 2 — Tests for rival kingdom simulation core.

import { describe, expect, it } from 'vitest';
import {
  IntelligenceOperationType,
  NeighborDisposition,
  NeighborState,
  RivalCrisisType,
  DiplomaticPosture,
} from '../engine/types';
import { seededRandom } from '../data/text/name-generation';
import {
  computeRivalActionPressure,
  createInitialRivalState,
  evaluateRivalCrisisEmergence,
  tickRivalKingdom,
} from '../engine/systems/rival-simulation';
import { resolveOperation } from '../engine/systems/espionage';

function buildNeighbor(overrides: Partial<NeighborState> = {}): NeighborState {
  return {
    id: 'neighbor_test',
    relationshipScore: 50,
    attitudePosture: DiplomaticPosture.Neutral,
    activeAgreements: [],
    pendingProposals: [],
    outstandingTensions: [],
    disposition: NeighborDisposition.Aggressive,
    militaryStrength: 60,
    religiousProfile: 'orthodox',
    culturalIdentity: 'highland',
    espionageCapability: 40,
    lastActionTurn: 0,
    warWeariness: 0,
    isAtWarWithPlayer: false,
    recentActionHistory: [],
    ...overrides,
  };
}

describe('createInitialRivalState', () => {
  it('is deterministic for the same seed and disposition', () => {
    const a = createInitialRivalState('seed_a', NeighborDisposition.Aggressive);
    const b = createInitialRivalState('seed_a', NeighborDisposition.Aggressive);
    expect(a).toEqual(b);
  });

  it('varies across seeds', () => {
    const a = createInitialRivalState('seed_a', NeighborDisposition.Aggressive);
    const b = createInitialRivalState('seed_b', NeighborDisposition.Aggressive);
    const changed =
      a.treasuryHealth !== b.treasuryHealth ||
      a.foodSecurity !== b.foodSecurity ||
      a.internalStability !== b.internalStability;
    expect(changed).toBe(true);
  });

  it('starts not in crisis and with empty event log', () => {
    const s = createInitialRivalState('seed_fresh', NeighborDisposition.Cautious);
    expect(s.isInCrisis).toBe(false);
    expect(s.crisisType).toBeNull();
    expect(s.recentInternalEvents).toEqual([]);
  });

  it('biases pressures by disposition', () => {
    const aggr = createInitialRivalState('seed_p', NeighborDisposition.Aggressive);
    const merc = createInitialRivalState('seed_p', NeighborDisposition.Mercantile);
    const iso = createInitialRivalState('seed_p', NeighborDisposition.Isolationist);
    expect(aggr.expansionistPressure).toBeGreaterThan(merc.expansionistPressure);
    expect(merc.mercantilePressure).toBeGreaterThan(aggr.mercantilePressure);
    expect(iso.pietisticPressure).toBeGreaterThan(aggr.pietisticPressure);
  });
});

describe('tickRivalKingdom', () => {
  it('does not mutate its input', () => {
    const state = createInitialRivalState('seed_a', NeighborDisposition.Aggressive);
    const snapshot = JSON.parse(JSON.stringify(state));
    tickRivalKingdom(state, 60, seededRandom('tick_a'));
    expect(state).toEqual(snapshot);
  });

  it('is deterministic for the same inputs', () => {
    const base = createInitialRivalState('seed_det', NeighborDisposition.Cautious);
    const a = tickRivalKingdom(base, 50, seededRandom('tick_det'));
    const b = tickRivalKingdom(base, 50, seededRandom('tick_det'));
    expect(a).toEqual(b);
  });

  it('produces variation across rivals over a 100-turn simulation', () => {
    const rivals = ['alpha', 'beta', 'gamma', 'delta'].map((name) =>
      createInitialRivalState(`seed_${name}`, NeighborDisposition.Opportunistic),
    );
    let states = rivals;
    for (let turn = 0; turn < 100; turn++) {
      states = states.map((rival, idx) =>
        tickRivalKingdom(rival, 50, seededRandom(`tick_${turn}_${idx}`)),
      );
    }
    const treasuries = new Set(states.map((s) => Math.round(s.treasuryHealth)));
    expect(treasuries.size).toBeGreaterThan(1);
  });

  it('enters famine crisis when foodSecurity drops below 30', () => {
    const base = createInitialRivalState('seed_famine', NeighborDisposition.Mercantile);
    const starved = { ...base, foodSecurity: 15, foodTrend: 'declining' as const };
    const next = tickRivalKingdom(starved, 50, seededRandom('tick_famine'));
    expect(next.isInCrisis).toBe(true);
    expect(next.crisisType).toBe(RivalCrisisType.Famine);
    expect(next.recentInternalEvents.length).toBeGreaterThan(0);
    expect(next.recentInternalEvents.some((e) => e.type.includes('famine') || e.type.includes('Famine'))).toBe(true);
  });

  it('enters insolvency crisis when treasuryHealth drops below 30', () => {
    const base = createInitialRivalState('seed_ins', NeighborDisposition.Aggressive);
    const broke = { ...base, treasuryHealth: 10, foodSecurity: 80, internalStability: 80 };
    const next = tickRivalKingdom(broke, 50, seededRandom('tick_ins'));
    expect(next.isInCrisis).toBe(true);
    expect(next.crisisType).toBe(RivalCrisisType.Insolvency);
  });

  it('exits crisis when condition recovers above 45', () => {
    const base = createInitialRivalState('seed_rec', NeighborDisposition.Cautious);
    const recovering = {
      ...base,
      isInCrisis: true,
      crisisType: RivalCrisisType.Famine,
      foodSecurity: 70,
      foodTrend: 'rising' as const,
    };
    const next = tickRivalKingdom(recovering, 50, seededRandom('tick_rec'));
    expect(next.isInCrisis).toBe(false);
    expect(next.crisisType).toBeNull();
  });

  it('caps recentInternalEvents at 8 entries', () => {
    let state = createInitialRivalState('seed_cap', NeighborDisposition.Opportunistic);
    state = {
      ...state,
      recentInternalEvents: Array.from({ length: 8 }, (_, i) => ({
        turnRecorded: i,
        type: `event_${i}`,
        severity: 'minor' as const,
        resolved: true,
      })),
      foodSecurity: 15,
      foodTrend: 'declining' as const,
    };
    const next = tickRivalKingdom(state, 50, seededRandom('tick_cap'));
    expect(next.recentInternalEvents.length).toBeLessThanOrEqual(8);
  });
});

describe('evaluateRivalCrisisEmergence', () => {
  it('picks Famine when foodSecurity is low', () => {
    const state = createInitialRivalState('seed_e', NeighborDisposition.Cautious);
    const starving = { ...state, foodSecurity: 20 };
    const crisis = evaluateRivalCrisisEmergence(starving, seededRandom('e1'));
    expect(crisis).toBe(RivalCrisisType.Famine);
  });

  it('picks Insolvency when treasuryHealth is low', () => {
    const state = createInitialRivalState('seed_e', NeighborDisposition.Cautious);
    const broke = { ...state, treasuryHealth: 10, foodSecurity: 80 };
    const crisis = evaluateRivalCrisisEmergence(broke, seededRandom('e2'));
    expect(crisis).toBe(RivalCrisisType.Insolvency);
  });

  it('picks civil unrest or succession when stability is low', () => {
    const state = createInitialRivalState('seed_e', NeighborDisposition.Cautious);
    const unstable = { ...state, internalStability: 15, foodSecurity: 80, treasuryHealth: 80 };
    const crisis = evaluateRivalCrisisEmergence(unstable, seededRandom('e3'));
    expect([RivalCrisisType.CivilUnrest, RivalCrisisType.SuccessionStruggle]).toContain(crisis);
  });

  it('returns null for healthy rivals (typical roll)', () => {
    const state = createInitialRivalState('seed_healthy', NeighborDisposition.Cautious);
    // A typical seed with healthy values should not roll a rare crisis.
    const crisis = evaluateRivalCrisisEmergence(state, seededRandom('healthy_roll'));
    // Rare crises are probabilistic, so assert it's either null OR one of the rare types.
    expect(crisis === null || crisis === RivalCrisisType.Plague || crisis === RivalCrisisType.ReligiousSchism).toBe(true);
  });
});

describe('computeRivalActionPressure', () => {
  it('returns higher war/demand scores for rivals with high expansionist pressure', () => {
    const highExp = {
      ...createInitialRivalState('seed_e1', NeighborDisposition.Aggressive),
      expansionistPressure: 95,
      mercantilePressure: 20,
      pietisticPressure: 20,
    };
    const lowExp = {
      ...createInitialRivalState('seed_e2', NeighborDisposition.Cautious),
      expansionistPressure: 10,
      mercantilePressure: 40,
      pietisticPressure: 40,
    };
    const neighbor = buildNeighbor();
    const high = computeRivalActionPressure(highExp, neighbor);
    const low = computeRivalActionPressure(lowExp, neighbor);
    expect(high.WarDeclaration).toBeGreaterThan(low.WarDeclaration);
    expect(high.Demand).toBeGreaterThan(low.Demand);
  });

  it('returns higher trade scores for mercantile-pressured rivals', () => {
    const highMerc = {
      ...createInitialRivalState('seed_m1', NeighborDisposition.Mercantile),
      mercantilePressure: 95,
      expansionistPressure: 20,
    };
    const lowMerc = {
      ...createInitialRivalState('seed_m2', NeighborDisposition.Aggressive),
      mercantilePressure: 10,
    };
    const neighbor = buildNeighbor();
    expect(computeRivalActionPressure(highMerc, neighbor).TradeProposal)
      .toBeGreaterThan(computeRivalActionPressure(lowMerc, neighbor).TradeProposal);
  });

  it('clamps offensive action scores for rivals in crisis', () => {
    const healthy = {
      ...createInitialRivalState('seed_c1', NeighborDisposition.Aggressive),
      expansionistPressure: 90,
      isInCrisis: false,
      crisisType: null,
    };
    const crisis = {
      ...healthy,
      isInCrisis: true,
      crisisType: RivalCrisisType.Famine,
    };
    const neighbor = buildNeighbor();
    const healthyScores = computeRivalActionPressure(healthy, neighbor);
    const crisisScores = computeRivalActionPressure(crisis, neighbor);
    expect(crisisScores.WarDeclaration).toBeLessThanOrEqual(0.25);
    expect(crisisScores.Demand).toBeLessThanOrEqual(0.25);
    expect(crisisScores.MilitaryBuildup).toBeLessThanOrEqual(0.25);
    expect(healthyScores.WarDeclaration).toBeGreaterThan(crisisScores.WarDeclaration);
  });

  it('suppresses war declaration while already at war', () => {
    const state = {
      ...createInitialRivalState('seed_w', NeighborDisposition.Aggressive),
      expansionistPressure: 95,
    };
    const neighbor = buildNeighbor({ isAtWarWithPlayer: true });
    const scores = computeRivalActionPressure(state, neighbor);
    expect(scores.WarDeclaration).toBe(0);
  });
});

describe('resolveOperation with rival simulation', () => {
  it('includes rival_food_shortage finding when target is in famine', () => {
    const sim = {
      ...createInitialRivalState('seed_esp', NeighborDisposition.Cautious),
      foodSecurity: 15,
      isInCrisis: true,
      crisisType: RivalCrisisType.Famine,
    };
    // high network strength + low target capability → reliable success
    const result = resolveOperation(
      IntelligenceOperationType.Reconnaissance,
      'neighbor_test',
      90,
      10,
      5,
      0.1,
      sim,
    );
    expect(result.success).toBe(true);
    expect(result.report?.findings).toContain('rival_food_shortage');
  });

  it('omits sim findings when no simulation is supplied', () => {
    const result = resolveOperation(
      IntelligenceOperationType.Reconnaissance,
      'neighbor_test',
      90,
      10,
      5,
      0.1,
    );
    expect(result.success).toBe(true);
    expect(result.report?.findings).not.toContain('rival_');
  });

  it('surfaces expansionist intent for healthy rivals with high expansionist pressure', () => {
    const sim = {
      ...createInitialRivalState('seed_exp', NeighborDisposition.Aggressive),
      expansionistPressure: 90,
      isInCrisis: false,
      crisisType: null,
      treasuryHealth: 70,
      foodSecurity: 70,
      internalStability: 70,
    };
    const result = resolveOperation(
      IntelligenceOperationType.Reconnaissance,
      'neighbor_test',
      90,
      10,
      5,
      0.1,
      sim,
    );
    expect(result.report?.findings).toContain('rival_expansionist_intent');
  });
});
