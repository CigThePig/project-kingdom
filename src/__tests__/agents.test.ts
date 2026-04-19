// Phase 14 — Agent roster behavior tests.

import { describe, it, expect } from 'vitest';

import {
  createAgent,
  addAgentToRoster,
  canRecruitAgent,
  computeAgentDetectionRiskModifier,
  tickAgentRoster,
  pickCoverSettlement,
  applyAgentOpOutcome,
  extractAgent,
  DEFAULT_AGENT_ROSTER_CAP,
  BORDER_DETECTION_MULTIPLIER,
} from '../engine/systems/agents';
import {
  AgentSpecialization,
  AgentStatus,
  type EspionageState,
  type GameState,
} from '../engine/types';
import { createDefaultScenario } from '../data/scenarios/default';
import { seededRandom } from '../data/text/name-generation';

function baseEspionage(): EspionageState {
  return {
    networkStrength: 40,
    counterIntelligenceLevel: 30,
    agents: [],
    ongoingOperations: [],
    moles: [],
    agentRosterCap: DEFAULT_AGENT_ROSTER_CAP,
  };
}

function baseState(): GameState {
  return createDefaultScenario();
}

describe('createAgent — determinism', () => {
  it('produces a stable id and codename for a given seed + turn + index', () => {
    const a = createAgent({
      runSeed: 'seed123',
      turn: 5,
      index: 0,
      specialization: AgentSpecialization.Diplomatic,
      coverSettlementId: 'settlement_test',
    });
    const b = createAgent({
      runSeed: 'seed123',
      turn: 5,
      index: 0,
      specialization: AgentSpecialization.Diplomatic,
      coverSettlementId: 'settlement_test',
    });
    expect(a.id).toBe(b.id);
    expect(a.codename).toBe(b.codename);
    expect(a.status).toBe(AgentStatus.Active);
    expect(a.burnRisk).toBe(0);
    expect(a.recruitedTurn).toBe(5);
  });

  it('yields different ids across indexes', () => {
    const a = createAgent({
      runSeed: 'seed',
      turn: 1,
      index: 0,
      specialization: AgentSpecialization.Military,
      coverSettlementId: 'settlement_x',
    });
    const b = createAgent({
      runSeed: 'seed',
      turn: 1,
      index: 1,
      specialization: AgentSpecialization.Military,
      coverSettlementId: 'settlement_x',
    });
    expect(a.id).not.toBe(b.id);
  });
});

describe('canRecruitAgent — cap boundary', () => {
  it('allows recruitment below the cap and blocks at the cap', () => {
    let esp = baseEspionage();
    expect(canRecruitAgent(esp)).toBe(true);
    for (let i = 0; i < DEFAULT_AGENT_ROSTER_CAP; i++) {
      const agent = createAgent({
        runSeed: 'seed',
        turn: 1,
        index: i,
        specialization: AgentSpecialization.Diplomatic,
        coverSettlementId: 'settlement_test',
      });
      esp = addAgentToRoster(esp, agent);
    }
    expect(canRecruitAgent(esp)).toBe(false);
  });

  it('counts only Active agents toward the cap', () => {
    let esp = baseEspionage();
    for (let i = 0; i < DEFAULT_AGENT_ROSTER_CAP; i++) {
      esp = addAgentToRoster(
        esp,
        createAgent({
          runSeed: 'seed',
          turn: 1,
          index: i,
          specialization: AgentSpecialization.Diplomatic,
          coverSettlementId: 'settlement_test',
        }),
      );
    }
    expect(canRecruitAgent(esp)).toBe(false);
    // Mark one agent as Dead — a slot should open up.
    esp = {
      ...esp,
      agents: esp.agents!.map((a, i) =>
        i === 0 ? { ...a, status: AgentStatus.Dead } : a,
      ),
    };
    expect(canRecruitAgent(esp)).toBe(true);
  });
});

describe('computeAgentDetectionRiskModifier — border multiplier', () => {
  it('returns BORDER_DETECTION_MULTIPLIER for agents in border-region cover', () => {
    const state = baseState();
    // Find any border-region settlement.
    const borderSettlement = state.geography?.settlements?.find((s) => {
      const region = state.regions.find((r) => r.id === s.regionId);
      return region?.borderRegion === true;
    });
    if (!borderSettlement) return; // scenario has no border region — skip
    const agent = createAgent({
      runSeed: 'seed',
      turn: 1,
      index: 0,
      specialization: AgentSpecialization.Military,
      coverSettlementId: borderSettlement.id,
    });
    expect(computeAgentDetectionRiskModifier(agent, state)).toBe(
      BORDER_DETECTION_MULTIPLIER,
    );
  });

  it('returns 1 for agents in interior cover', () => {
    const state = baseState();
    const interior = state.geography?.settlements?.find((s) => {
      const region = state.regions.find((r) => r.id === s.regionId);
      return region?.borderRegion !== true;
    });
    if (!interior) return;
    const agent = createAgent({
      runSeed: 'seed',
      turn: 1,
      index: 0,
      specialization: AgentSpecialization.Military,
      coverSettlementId: interior.id,
    });
    expect(computeAgentDetectionRiskModifier(agent, state)).toBe(1);
  });
});

describe('tickAgentRoster — burn decay and status transitions', () => {
  it('decays burn risk for idle agents', () => {
    const state = baseState();
    const coverId = pickCoverSettlement(state, seededRandom('pick1')) ?? 'settlement_test';
    let esp = addAgentToRoster(
      baseEspionage(),
      createAgent({
        runSeed: 'seed',
        turn: 1,
        index: 0,
        specialization: AgentSpecialization.Economic,
        coverSettlementId: coverId,
      }),
    );
    // Bump burn risk so decay is visible.
    esp = {
      ...esp,
      agents: esp.agents!.map((a) => ({ ...a, burnRisk: 40 })),
    };
    const ticked = tickAgentRoster(esp, state, seededRandom('tick1'));
    expect(ticked.agents![0].burnRisk).toBeLessThan(40);
    expect(ticked.agents![0].status).toBe(AgentStatus.Active);
  });

  it('eventually transitions a very-high-burn agent away from Active', () => {
    const state = baseState();
    const coverId = pickCoverSettlement(state, seededRandom('pick2')) ?? 'settlement_test';
    let esp = addAgentToRoster(
      baseEspionage(),
      createAgent({
        runSeed: 'seed',
        turn: 1,
        index: 0,
        specialization: AgentSpecialization.Counter,
        coverSettlementId: coverId,
      }),
    );
    esp = {
      ...esp,
      agents: esp.agents!.map((a) => ({ ...a, burnRisk: 95 })),
    };
    let transitioned = false;
    // Burn a bunch of seeded rng — one of them should roll the transition.
    for (let i = 0; i < 200; i++) {
      const out = tickAgentRoster(esp, state, seededRandom(`tick_${i}`));
      if (out.agents![0].status !== AgentStatus.Active) {
        transitioned = true;
        break;
      }
    }
    expect(transitioned).toBe(true);
  });
});

describe('applyAgentOpOutcome', () => {
  it('adds burn-risk delta and applies status transition', () => {
    let esp = addAgentToRoster(
      baseEspionage(),
      createAgent({
        runSeed: 'seed',
        turn: 1,
        index: 0,
        specialization: AgentSpecialization.Military,
        coverSettlementId: 'settlement_test',
      }),
    );
    const agentId = esp.agents![0].id;
    esp = applyAgentOpOutcome(esp, agentId, {
      burnRiskDelta: 15,
      statusTransition: AgentStatus.Compromised,
    });
    expect(esp.agents![0].burnRisk).toBe(15);
    expect(esp.agents![0].status).toBe(AgentStatus.Compromised);
  });

  it('is a no-op when agentId is null (synthetic auto-agent)', () => {
    const esp = baseEspionage();
    const out = applyAgentOpOutcome(esp, null, { burnRiskDelta: 30 });
    expect(out).toBe(esp);
  });
});

describe('extractAgent', () => {
  it('removes the agent from the roster', () => {
    const esp = addAgentToRoster(
      baseEspionage(),
      createAgent({
        runSeed: 'seed',
        turn: 1,
        index: 0,
        specialization: AgentSpecialization.Court,
        coverSettlementId: 'settlement_test',
      }),
    );
    const agentId = esp.agents![0].id;
    const out = extractAgent(esp, agentId);
    expect(out.agents!.length).toBe(0);
  });
});

describe('pickCoverSettlement', () => {
  it('prefers a non-border settlement when available', () => {
    const state = baseState();
    const hasInterior = state.geography?.settlements?.some((s) => {
      const region = state.regions.find((r) => r.id === s.regionId);
      return region?.borderRegion !== true;
    });
    if (!hasInterior) return;
    const picked = pickCoverSettlement(state, seededRandom('cover'));
    expect(picked).not.toBeNull();
    const settlement = state.geography?.settlements?.find((s) => s.id === picked);
    expect(settlement).toBeDefined();
    const region = state.regions.find((r) => r.id === settlement!.regionId);
    expect(region?.borderRegion !== true).toBe(true);
  });
});

// Smart Card Engine Surface — Phase E: Agent Burn Extraction petition.
// Tests the smart-text upgrade of synthesizePhase14Petitions — the body must
// name the agent by codename, the cover settlement by its displayName, and
// state how long the agent has been in cover.
describe('Agent Burn Extraction petition — smart text', () => {
  it('renders the codename, cover settlement, and turns in cover', async () => {
    const { synthesizePhase14Petitions } = await import(
      '../bridge/petitionCardGenerator'
    );
    const state = baseState();
    const coverSettlement = state.geography?.settlements?.[0];
    if (!coverSettlement) throw new Error('test requires a settlement');
    state.turn.turnNumber = 12;
    state.espionage!.agents = [
      {
        id: 'agent_test_1',
        codename: 'Shrike',
        specialization: AgentSpecialization.Court,
        coverSettlementId: coverSettlement.id,
        reliability: 70,
        burnRisk: 85,
        status: AgentStatus.Active,
        recruitedTurn: 6,
      },
    ];

    const cards = synthesizePhase14Petitions(state);
    expect(cards).toHaveLength(1);
    const [card] = cards;
    expect(card.definitionId).toBe('phase14_extract');
    expect(card.title).toContain('Shrike');
    expect(card.title).toContain(coverSettlement.displayName ?? coverSettlement.id);
    // Body: codename + settlement + 6 seasons (12 - 6).
    expect(card.body).toContain('Shrike');
    expect(card.body).toContain(coverSettlement.displayName ?? coverSettlement.id);
    expect(card.body).toContain('6 seasons');
    // No unresolved tokens left behind.
    expect(card.body).not.toMatch(/\{[a-z_]/);
    expect(card.title).not.toMatch(/\{[a-z_]/);
  });

  it('uses singular "season" when exactly one turn has elapsed', async () => {
    const { synthesizePhase14Petitions } = await import(
      '../bridge/petitionCardGenerator'
    );
    const state = baseState();
    const coverSettlement = state.geography?.settlements?.[0];
    if (!coverSettlement) throw new Error('test requires a settlement');
    state.turn.turnNumber = 5;
    state.espionage!.agents = [
      {
        id: 'agent_test_2',
        codename: 'Hawk',
        specialization: AgentSpecialization.Military,
        coverSettlementId: coverSettlement.id,
        reliability: 60,
        burnRisk: 80,
        status: AgentStatus.Active,
        recruitedTurn: 4,
      },
    ];
    const [card] = synthesizePhase14Petitions(state);
    expect(card.body).toContain('1 season');
    expect(card.body).not.toContain('1 seasons');
  });

  it('does not surface a petition below the burn-risk threshold', async () => {
    const { synthesizePhase14Petitions } = await import(
      '../bridge/petitionCardGenerator'
    );
    const state = baseState();
    state.espionage!.agents = [
      {
        id: 'agent_safe',
        codename: 'Ember',
        specialization: AgentSpecialization.Counter,
        coverSettlementId: state.geography!.settlements![0].id,
        reliability: 80,
        burnRisk: 40,
        status: AgentStatus.Active,
        recruitedTurn: 1,
      },
    ];
    expect(synthesizePhase14Petitions(state)).toHaveLength(0);
  });
});
