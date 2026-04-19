// Phase F — Name resolver coverage for advisor / agent / bond lookups.
// Mirrors the shape of nameResolver.ts tests: happy path, missing id,
// present-but-missing-optional-field.

import { describe, it, expect } from 'vitest';
import {
  getAdvisorName,
  getAdvisorNameOrFallback,
  SEAT_FALLBACK_LABEL,
} from '../bridge/advisorNameResolver';
import {
  getAgentCodename,
  findAgentById,
  getAgentCoverSettlementLabel,
} from '../bridge/agentNameResolver';
import {
  findBondById,
  getBondDescriptor,
  getBondParticipantNames,
} from '../bridge/bondNameResolver';
import { createDefaultScenario } from '../data/scenarios/default';
import {
  AgentSpecialization,
  AgentStatus,
  CouncilSeat,
  PopulationClass,
  type Agent,
  type CouncilAdvisor,
  type GameState,
  type MarriageBond,
  type VassalageBond,
  type CoalitionBond,
  type TradeLeagueBond,
} from '../engine/types';

function stubAdvisor(seat: CouncilSeat, name: string): CouncilAdvisor {
  return {
    id: `adv_${seat}`,
    seat,
    name,
    personality: 'Steady' as CouncilAdvisor['personality'],
    modifiers: [],
    flaws: [],
    loyalty: 60,
    yearsServing: 1,
    turnAppointed: 1,
    background: `${name} has served many years.`,
    patronClass: PopulationClass.Nobility,
  };
}

function stubAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: 'agent_alpha',
    codename: 'Shrike',
    specialization: AgentSpecialization.Diplomatic,
    coverSettlementId: 'settlement_missing',
    reliability: 60,
    burnRisk: 10,
    status: AgentStatus.Active,
    recruitedTurn: 1,
    ...overrides,
  };
}

function attachAgent(state: GameState, agent: Agent): GameState {
  state.espionage = {
    ...state.espionage,
    agents: [...(state.espionage.agents ?? []), agent],
  };
  return state;
}

// ============================================================
// Advisor resolver
// ============================================================

describe('advisorNameResolver', () => {
  it('returns the appointed name when the seat is filled', () => {
    const state = createDefaultScenario();
    const advisor = stubAdvisor(CouncilSeat.Chancellor, 'Lord Vessin');
    state.council = {
      ...(state.council ?? { pendingCandidates: [] }),
      appointments: { [CouncilSeat.Chancellor]: advisor },
      pendingCandidates: state.council?.pendingCandidates ?? [],
    };
    expect(getAdvisorName(CouncilSeat.Chancellor, state)).toBe('Lord Vessin');
    expect(getAdvisorNameOrFallback(CouncilSeat.Chancellor, state)).toBe('Lord Vessin');
  });

  it('falls back to "your chancellor" when the seat is vacant', () => {
    const state = createDefaultScenario();
    state.council = {
      appointments: {},
      pendingCandidates: [],
    };
    expect(getAdvisorName(CouncilSeat.Chancellor, state)).toBe('your chancellor');
    expect(getAdvisorNameOrFallback(CouncilSeat.Chancellor, state)).toBe(
      SEAT_FALLBACK_LABEL[CouncilSeat.Chancellor],
    );
  });

  it('is safe when the council state is entirely absent', () => {
    const state = createDefaultScenario();
    // Simulate a pre-Phase-8 save where council is undefined.
    (state as GameState & { council?: unknown }).council = undefined;
    expect(getAdvisorName(CouncilSeat.Marshal, state)).toBe('your marshal');
    expect(getAdvisorNameOrFallback(CouncilSeat.Spymaster, state)).toBe(
      'your spymaster',
    );
  });
});

// ============================================================
// Agent resolver
// ============================================================

describe('agentNameResolver', () => {
  it('returns the codename when the agent is on the roster', () => {
    const state = createDefaultScenario();
    attachAgent(state, stubAgent({ id: 'agent_a', codename: 'Shrike' }));
    expect(getAgentCodename('agent_a', state)).toBe('Shrike');
    expect(findAgentById('agent_a', state)?.codename).toBe('Shrike');
  });

  it('falls back to "the agent" when the id is unknown', () => {
    const state = createDefaultScenario();
    expect(getAgentCodename('agent_missing', state)).toBe('the agent');
    expect(findAgentById('agent_missing', state)).toBeUndefined();
  });

  it('resolves the cover settlement label through the geography resolver', () => {
    const state = createDefaultScenario();
    const settlementId = state.geography?.settlements[0]?.id;
    if (!settlementId) {
      // Scenario without geography yet — the resolver should still produce
      // a non-empty fallback rather than a raw id.
      attachAgent(state, stubAgent({ coverSettlementId: 'settlement_unknown' }));
      expect(getAgentCoverSettlementLabel('agent_alpha', state)).toBe(
        'settlement_unknown',
      );
      return;
    }
    attachAgent(state, stubAgent({ coverSettlementId: settlementId }));
    const label = getAgentCoverSettlementLabel('agent_alpha', state);
    expect(label).not.toBe('');
    expect(label).not.toBe(settlementId); // resolved to a display name
  });

  it('returns "an unknown posting" when the agent id is missing', () => {
    const state = createDefaultScenario();
    expect(getAgentCoverSettlementLabel('agent_missing', state)).toBe(
      'an unknown posting',
    );
  });
});

// ============================================================
// Bond resolver
// ============================================================

function bond<T extends { kind: string }>(b: T): T {
  return b;
}

describe('bondNameResolver', () => {
  it('describes a royal marriage with the spouse name when present', () => {
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const marriage: MarriageBond = bond({
      bondId: 'm1',
      kind: 'royal_marriage',
      turnStarted: 1,
      turnsRemaining: null,
      participants: [nb.id],
      breachPenalty: -20,
      spouseName: 'Lady Sarielle',
      dynastyId: 'house_marrowmoor',
      heirProduced: false,
    });
    state.diplomacy.bonds = [marriage];
    expect(getBondDescriptor('m1', state)).toBe('the marriage to Lady Sarielle');
  });

  it('falls back to a participant list for a marriage lacking a spouse name', () => {
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const nbName = nb.displayName ?? nb.id;
    const marriage: MarriageBond = bond({
      bondId: 'm2',
      kind: 'royal_marriage',
      turnStarted: 1,
      turnsRemaining: null,
      participants: [nb.id],
      breachPenalty: -20,
      spouseName: '',
      dynastyId: 'house_marrowmoor',
      heirProduced: false,
    });
    state.diplomacy.bonds = [marriage];
    expect(getBondDescriptor('m2', state)).toContain(nbName);
  });

  it('describes a vassalage to an overlord by resolved name', () => {
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const expectedName = nb.displayName ?? nb.id;
    const v: VassalageBond = bond({
      bondId: 'v1',
      kind: 'vassalage',
      turnStarted: 1,
      turnsRemaining: null,
      participants: [nb.id],
      breachPenalty: -30,
      overlord: nb.id,
      tributePerTurn: 50,
    });
    state.diplomacy.bonds = [v];
    expect(getBondDescriptor('v1', state)).toBe(`the vassalage to ${expectedName}`);
  });

  it('describes a coalition against a named enemy', () => {
    const state = createDefaultScenario();
    const [a, b] = state.diplomacy.neighbors;
    const bName = b.displayName ?? b.id;
    const c: CoalitionBond = bond({
      bondId: 'c1',
      kind: 'coalition',
      turnStarted: 1,
      turnsRemaining: null,
      participants: [a.id],
      breachPenalty: -15,
      commonEnemyId: b.id,
    });
    state.diplomacy.bonds = [c];
    expect(getBondDescriptor('c1', state)).toBe(`the coalition against ${bName}`);
  });

  it('returns "the bond" when the id is unknown', () => {
    const state = createDefaultScenario();
    expect(getBondDescriptor('missing', state)).toBe('the bond');
    expect(findBondById('missing', state)).toBeUndefined();
  });

  it('lists participant names excluding the literal "player" overlord token', () => {
    const state = createDefaultScenario();
    const nb = state.diplomacy.neighbors[0];
    const nbName = nb.displayName ?? nb.id;
    const v: VassalageBond = bond({
      bondId: 'vp',
      kind: 'vassalage',
      turnStarted: 1,
      turnsRemaining: null,
      participants: [nb.id, 'player'],
      breachPenalty: -30,
      overlord: 'player',
      tributePerTurn: 25,
    });
    state.diplomacy.bonds = [v];
    const names = getBondParticipantNames(v, state);
    expect(names).toEqual([nbName]);
  });

  it('joins trade-league participants with "and" grammar', () => {
    const state = createDefaultScenario();
    const [a, b] = state.diplomacy.neighbors;
    const aName = a.displayName ?? a.id;
    const bName = b.displayName ?? b.id;
    const t: TradeLeagueBond = bond({
      bondId: 't1',
      kind: 'trade_league',
      turnStarted: 1,
      turnsRemaining: 8,
      participants: [a.id, b.id],
      breachPenalty: -10,
      incomePerTurn: 40,
    });
    state.diplomacy.bonds = [t];
    const descriptor = getBondDescriptor('t1', state);
    expect(descriptor).toContain(aName);
    expect(descriptor).toContain(bName);
    expect(descriptor).toContain('and');
  });
});
