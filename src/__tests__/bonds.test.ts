// Phase 13 — Tests for the diplomatic bond system.

import { describe, expect, it } from 'vitest';
import type {
  Bond,
  GameState,
  MarriageBond,
  TradeLeagueBond,
  VassalageBond,
} from '../engine/types';
import { ActionType, RivalAgenda } from '../engine/types';
import {
  applyBondTickEffects,
  breakBond,
  createCoalitionBond,
  createCulturalExchangeBond,
  createHostageBond,
  createMarriageBond,
  createMutualDefenseBond,
  createReligiousAccordBond,
  createTradeLeagueBond,
  createVassalageBond,
  evaluateCounterProposalAcceptance,
  getBondsForNeighbor,
  hasBondOfKind,
  tickBondExpiry,
} from '../engine/systems/bonds';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { createDefaultScenario } from '../data/scenarios/default';

function stateWithBonds(bonds: Bond[]): GameState {
  const base = createDefaultScenario();
  return {
    ...base,
    diplomacy: { ...base.diplomacy, bonds },
  };
}

function firstNeighborId(state: GameState): string {
  return state.diplomacy.neighbors[0]!.id;
}

describe('createMarriageBond', () => {
  it('produces a deterministic id from seed inputs', () => {
    const a = createMarriageBond({
      participants: ['n1'],
      turn: 5,
      spouseName: 'consort',
      dynastyId: 'dyn_n1',
    });
    const b = createMarriageBond({
      participants: ['n1'],
      turn: 5,
      spouseName: 'consort',
      dynastyId: 'dyn_n1',
    });
    expect(a.bondId).toBe(b.bondId);
    expect(a.kind).toBe('royal_marriage');
    expect(a.heirProduced).toBe(false);
    expect(a.breachPenalty).toBeLessThan(0);
    expect(a.turnsRemaining).toBeNull();
  });
});

describe('tickBondExpiry', () => {
  it('decrements timed bonds and expires at zero', () => {
    const timed = createCoalitionBond(['n1', 'n2'], 1, 'n3', 2);
    const { bonds, expired } = tickBondExpiry([timed]);
    expect(bonds).toHaveLength(1);
    expect(bonds[0].turnsRemaining).toBe(1);
    expect(expired).toHaveLength(0);

    const next = tickBondExpiry(bonds);
    expect(next.bonds).toHaveLength(0);
    expect(next.expired).toHaveLength(1);
  });

  it('leaves indefinite bonds alone', () => {
    const forever = createMarriageBond({
      participants: ['n1'],
      turn: 1,
      spouseName: 's',
      dynastyId: 'd',
    });
    const { bonds, expired } = tickBondExpiry([forever]);
    expect(bonds).toHaveLength(1);
    expect(bonds[0].turnsRemaining).toBeNull();
    expect(expired).toHaveLength(0);
  });
});

describe('breakBond', () => {
  it('applies breach penalty + memory entry and removes the bond', () => {
    const state = stateWithBonds([]);
    const nid = firstNeighborId(state);
    const bond = createMarriageBond({
      participants: [nid],
      turn: 1,
      spouseName: 's',
      dynastyId: 'd',
    });
    const seeded = stateWithBonds([bond]);

    const before = seeded.diplomacy.neighbors.find((n) => n.id === nid)!;
    const next = breakBond(bond.bondId, 'test', seeded);
    const after = next.diplomacy.neighbors.find((n) => n.id === nid)!;

    expect(next.diplomacy.bonds ?? []).toHaveLength(0);
    expect(after.relationshipScore).toBeLessThan(before.relationshipScore);
    expect((after.memory ?? []).some((m) => m.type === 'breach')).toBe(true);
  });

  it('is a no-op for unknown bond ids', () => {
    const seeded = stateWithBonds([]);
    const next = breakBond('does_not_exist', 'n/a', seeded);
    expect(next).toBe(seeded);
  });
});

describe('applyBondTickEffects — per kind', () => {
  it('marriage bond drifts relationship up over time', () => {
    const base = stateWithBonds([]);
    const nid = firstNeighborId(base);
    const bond: MarriageBond = createMarriageBond({
      participants: [nid],
      turn: 1,
      spouseName: 's',
      dynastyId: 'd',
    });
    const seeded = stateWithBonds([bond]);
    const before = seeded.diplomacy.neighbors.find((n) => n.id === nid)!.relationshipScore;
    const after = applyBondTickEffects(seeded).diplomacy.neighbors.find((n) => n.id === nid)!.relationshipScore;
    expect(after).toBeGreaterThanOrEqual(before);
  });

  it('hostage bond enforces a relationship floor', () => {
    const base = createDefaultScenario();
    const nid = firstNeighborId(base);
    const lowered = {
      ...base,
      diplomacy: {
        ...base.diplomacy,
        neighbors: base.diplomacy.neighbors.map((n) =>
          n.id === nid ? { ...n, relationshipScore: 10 } : n,
        ),
        bonds: [createHostageBond({ participants: [nid], turn: 1, hostageName: 'ward', mutual: true })],
      },
    };
    const after = applyBondTickEffects(lowered);
    expect(after.diplomacy.neighbors.find((n) => n.id === nid)!.relationshipScore).toBeGreaterThanOrEqual(30);
  });

  it('vassalage bond transfers tribute to the overlord (player)', () => {
    const base = createDefaultScenario();
    const nid = firstNeighborId(base);
    const bond = createVassalageBond({
      participants: [nid],
      turn: 1,
      overlord: 'player',
      tributePerTurn: 25,
    });
    const seeded = stateWithBonds([bond]);
    const before = seeded.treasury.balance;
    const after = applyBondTickEffects(seeded);
    expect(after.treasury.balance).toBe(before + 25);
  });

  it('trade league pays per eligible participant', () => {
    const base = createDefaultScenario();
    const nid = firstNeighborId(base);
    const bond: TradeLeagueBond = createTradeLeagueBond([nid], 1, 10);
    const seeded = stateWithBonds([bond]);
    const before = seeded.treasury.balance;
    const after = applyBondTickEffects(seeded);
    expect(after.treasury.balance).toBeGreaterThanOrEqual(before);
  });

  it('religious accord reduces heterodoxy', () => {
    const base = createDefaultScenario();
    const withHeterodoxy = {
      ...base,
      faithCulture: { ...base.faithCulture, heterodoxy: 40 },
      diplomacy: {
        ...base.diplomacy,
        bonds: [createReligiousAccordBond([firstNeighborId(base)], 1, 'shared_rite')],
      },
    };
    const after = applyBondTickEffects(withHeterodoxy);
    expect(after.faithCulture.heterodoxy).toBeLessThan(40);
  });

  it('cultural exchange drifts relationship + cohesion upward', () => {
    const base = createDefaultScenario();
    const nid = firstNeighborId(base);
    const bond = createCulturalExchangeBond([nid], 1);
    const seeded = stateWithBonds([bond]);
    const beforeRel = seeded.diplomacy.neighbors.find((n) => n.id === nid)!.relationshipScore;
    const beforeCoh = seeded.faithCulture.culturalCohesion;
    const after = applyBondTickEffects(seeded);
    expect(after.diplomacy.neighbors.find((n) => n.id === nid)!.relationshipScore).toBeGreaterThanOrEqual(beforeRel);
    expect(after.faithCulture.culturalCohesion).toBeGreaterThanOrEqual(beforeCoh);
  });

  it('mutual defense is a no-op when no partner is at war', () => {
    const base = createDefaultScenario();
    const bond = createMutualDefenseBond([firstNeighborId(base)], 1);
    const seeded = stateWithBonds([bond]);
    const after = applyBondTickEffects(seeded);
    expect(after).toEqual(seeded);
  });
});

describe('getBondsForNeighbor / hasBondOfKind', () => {
  it('filters by participant membership and kind', () => {
    const base = createDefaultScenario();
    const nid = firstNeighborId(base);
    const marriage = createMarriageBond({
      participants: [nid],
      turn: 1,
      spouseName: 's',
      dynastyId: 'd',
    });
    const seeded = stateWithBonds([marriage]);
    expect(getBondsForNeighbor(nid, seeded)).toHaveLength(1);
    expect(hasBondOfKind(nid, 'royal_marriage', seeded)).toBe(true);
    expect(hasBondOfKind(nid, 'trade_league', seeded)).toBe(false);
    expect(getBondsForNeighbor('no_such_neighbor', seeded)).toHaveLength(0);
  });
});

describe('evaluateCounterProposalAcceptance', () => {
  it('rewards player-favorable counters less when they over-shift', () => {
    const easy = evaluateCounterProposalAcceptance({
      baseline: 25,
      adjusted: 20,
      playerFavors: 'lower',
      relationshipScore: 60,
    });
    const greedy = evaluateCounterProposalAcceptance({
      baseline: 25,
      adjusted: 5,
      playerFavors: 'lower',
      relationshipScore: 60,
    });
    expect(easy).toBeGreaterThan(greedy);
  });

  it('stays inside [0.02, 0.98]', () => {
    const extreme = evaluateCounterProposalAcceptance({
      baseline: 10,
      adjusted: -1000,
      playerFavors: 'lower',
      relationshipScore: 0,
    });
    const gift = evaluateCounterProposalAcceptance({
      baseline: 10,
      adjusted: 1000,
      playerFavors: 'lower',
      relationshipScore: 100,
    });
    expect(extreme).toBeGreaterThanOrEqual(0.02);
    expect(gift).toBeLessThanOrEqual(0.98);
  });
});

// Phase 10.5 — Vassalage bond materialises when a SubjugateAVassal overture is
// granted, mirroring the negotiation pipeline's payment_tribute → vassalage
// construction so the consequence is queryable rather than a one-turn nudge.
describe('overture grant — SubjugateAVassal vassalage materialization', () => {
  function seedSubjugateOverture(grant: boolean): {
    state: GameState;
    sourceId: string;
    targetId: string;
  } {
    const base = createDefaultScenario();
    const sourceId = base.diplomacy.neighbors[0]!.id;
    const targetId = base.diplomacy.neighbors[1]!.id;
    const turn = base.turn.turnNumber;

    const state: GameState = {
      ...base,
      diplomacy: {
        ...base.diplomacy,
        neighbors: base.diplomacy.neighbors.map((n) =>
          n.id === sourceId
            ? {
                ...n,
                agenda: {
                  current: RivalAgenda.SubjugateAVassal,
                  targetEntityId: targetId,
                  progressValue: 60,
                  turnsActive: 4,
                },
              }
            : n,
        ),
      },
    };

    const eventId = `overture_${sourceId}_SubjugateAVassal_t${turn}`;
    const choiceId = `${eventId}${grant ? '_grant' : '_deny'}`;

    const next = applyActionEffects(state, [
      {
        id: 'phase-10.5-test',
        type: ActionType.CrisisResponse,
        actionDefinitionId: eventId,
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: { eventId, choiceId },
      },
    ]);

    return { state: next, sourceId, targetId };
  }

  it('grant materialises a vassalage bond with the source rival as overlord', () => {
    const { state, sourceId, targetId } = seedSubjugateOverture(true);
    const bonds = (state.diplomacy.bonds ?? []).filter(
      (b) => b.kind === 'vassalage',
    ) as VassalageBond[];
    expect(bonds).toHaveLength(1);
    expect(bonds[0].overlord).toBe(sourceId);
    expect(bonds[0].participants).toEqual([targetId]);
    expect(bonds[0].tributePerTurn).toBeGreaterThan(0);
  });

  it('deny path leaves no vassalage bond on state', () => {
    const { state } = seedSubjugateOverture(false);
    const bonds = (state.diplomacy.bonds ?? []).filter((b) => b.kind === 'vassalage');
    expect(bonds).toHaveLength(0);
  });

  it('inter-rival vassalage tick does not move the player treasury', () => {
    // Ensures the tickVassalage tribute branch correctly no-ops when neither
    // overlord nor any participant is the player. Without this guard, granting
    // a SubjugateAVassal overture would silently drain the player's treasury
    // by tributePerTurn each tick.
    const { state } = seedSubjugateOverture(true);
    const before = state.treasury.balance;
    const after = applyBondTickEffects(state).treasury.balance;
    expect(after).toBe(before);
  });
});
