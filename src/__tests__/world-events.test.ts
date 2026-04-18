// Phase 12 — Tests for the Dynamic World Events system.

import { describe, expect, it } from 'vitest';
import {
  type ActiveWorldEvent,
  type GameState,
  type WorldEventDefinition,
  EventSeverity,
} from '../engine/types';
import { seededRandom } from '../data/text/name-generation';
import {
  spawnWorldEvent,
  tickWorldEvent,
  spreadWorldEvent,
  applyWorldEventEffects,
  surfaceWorldEventsToActiveEvents,
  PLAYER_KINGDOM_ID,
} from '../engine/systems/world-events';
import { WORLD_EVENT_DEFINITIONS } from '../data/world-events';
import { createDefaultScenario } from '../data/scenarios/default';

// ---- Helpers ----------------------------------------------------------

function baseState(): GameState {
  return createDefaultScenario();
}

function makeDef(over: Partial<WorldEventDefinition>): WorldEventDefinition {
  return {
    id: 'we_test',
    category: 'plague',
    severity: EventSeverity.Serious,
    minTurn: 0,
    spawnWeight: 1,
    durationTurns: 10,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 1,
      blockedBy: [],
    },
    seedSelector: 'any',
    perTurnEffects: [],
    choices: [],
    ...over,
  };
}

function makeActive(
  over: Partial<ActiveWorldEvent> = {},
  def: WorldEventDefinition = makeDef({}),
): ActiveWorldEvent {
  return {
    id: `${def.id}_t0`,
    definitionId: def.id,
    category: def.category,
    severity: def.severity,
    turnSpawned: 0,
    turnsRemaining: def.durationTurns,
    phase: 'active',
    affectedKingdoms: [PLAYER_KINGDOM_ID],
    recoveredKingdoms: [],
    playerCardSurfacedOnTurn: null,
    ...over,
  };
}

// ---- spawnWorldEvent --------------------------------------------------

describe('spawnWorldEvent', () => {
  it('respects minTurn gating', () => {
    const state = baseState();
    const gated = makeDef({ id: 'we_gated', minTurn: 50 });
    const rng = seededRandom('spawn_gated');
    // Use a single definition so we know the minTurn check is the gate.
    const result = spawnWorldEvent(state, [gated], 5, rng);
    expect(result).toBeNull();
  });

  it('returns null when concurrent cap is reached', () => {
    const state: GameState = {
      ...baseState(),
      activeWorldEvents: [
        makeActive({ id: 'w1', turnSpawned: 30 }),
        makeActive({ id: 'w2', turnSpawned: 30 }),
      ],
    };
    const rng = seededRandom('spawn_cap');
    const result = spawnWorldEvent(state, WORLD_EVENT_DEFINITIONS, 60, rng);
    expect(result).toBeNull();
  });

  it('respects cooldown since last spawn', () => {
    const state: GameState = {
      ...baseState(),
      activeWorldEvents: [makeActive({ id: 'w1', turnSpawned: 10 })],
    };
    const rng = seededRandom('spawn_cooldown');
    const result = spawnWorldEvent(state, WORLD_EVENT_DEFINITIONS, 13, rng);
    expect(result).toBeNull();
  });

  it('is deterministic given identical inputs', () => {
    const state = baseState();
    const rng1 = seededRandom('spawn_det');
    const rng2 = seededRandom('spawn_det');
    const a = spawnWorldEvent(state, WORLD_EVENT_DEFINITIONS, 30, rng1);
    const b = spawnWorldEvent(state, WORLD_EVENT_DEFINITIONS, 30, rng2);
    expect(a).toEqual(b);
  });

  it('eventually spawns given enough attempts on an empty world events list', () => {
    const state = baseState();
    const def = makeDef({ id: 'we_certain', minTurn: 0, spawnWeight: 100 });
    let spawned: ActiveWorldEvent | null = null;
    for (let i = 0; i < 100 && !spawned; i++) {
      const rng = seededRandom(`spawn_attempt_${i}`);
      spawned = spawnWorldEvent(state, [def], 30, rng);
    }
    expect(spawned).not.toBeNull();
    expect(spawned?.definitionId).toBe('we_certain');
    expect(spawned?.affectedKingdoms.length).toBeGreaterThan(0);
  });
});

// ---- tickWorldEvent ---------------------------------------------------

describe('tickWorldEvent', () => {
  it('does not mutate its input', () => {
    const def = makeDef({ durationTurns: 6 });
    const event = makeActive({ turnsRemaining: 6 }, def);
    const snap = JSON.parse(JSON.stringify(event));
    tickWorldEvent(event, def, baseState(), seededRandom('tick_a'));
    expect(event).toEqual(snap);
  });

  it('transitions emerging → active on first tick', () => {
    const def = makeDef({ durationTurns: 10 });
    const emerging = makeActive({ phase: 'emerging' }, def);
    const next = tickWorldEvent(emerging, def, baseState(), seededRandom('tick_em'));
    expect(next.phase).toBe('active');
  });

  it('decrements turnsRemaining and transitions active → waning near end', () => {
    const def = makeDef({ durationTurns: 4 });
    // Start with turnsRemaining = 2 (≤ 25% of 4 → 1.0 threshold; 2 > 1, so one
    // more tick drops to 1, below the threshold).
    let next = makeActive({ phase: 'active', turnsRemaining: 2 }, def);
    next = tickWorldEvent(next, def, baseState(), seededRandom('tick_down'));
    expect(next.turnsRemaining).toBe(1);
    expect(next.phase).toBe('waning');
  });

  it('becomes resolved when turnsRemaining hits zero', () => {
    const def = makeDef({ durationTurns: 1 });
    const near = makeActive({ phase: 'active', turnsRemaining: 1 }, def);
    const next = tickWorldEvent(near, def, baseState(), seededRandom('tick_zero'));
    expect(next.turnsRemaining).toBe(0);
    expect(next.phase).toBe('resolved');
  });
});

// ---- spreadWorldEvent -------------------------------------------------

describe('spreadWorldEvent', () => {
  it('does not spread when transmittedBy is empty', () => {
    const def = makeDef({
      spread: { transmittedBy: [], baseProbabilityPerTurn: 1 },
    });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const next = spreadWorldEvent(event, def, baseState(), seededRandom('spread_none'));
    expect(next.affectedKingdoms).toEqual([PLAYER_KINGDOM_ID]);
  });

  it('ignores blocked edge kinds', () => {
    const def = makeDef({
      spread: {
        transmittedBy: ['mountain_pass'],
        baseProbabilityPerTurn: 1,
        blockedBy: ['mountain_pass'],
      },
    });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const next = spreadWorldEvent(event, def, baseState(), seededRandom('spread_block'));
    expect(next.affectedKingdoms).toEqual([PLAYER_KINGDOM_ID]);
  });

  it('spreads to at least one neighbor when probability is 1 over permissive edges', () => {
    const def = makeDef({
      spread: {
        transmittedBy: ['land', 'river', 'sea', 'mountain_pass'],
        baseProbabilityPerTurn: 1,
      },
    });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const next = spreadWorldEvent(event, def, baseState(), seededRandom('spread_hot'));
    expect(next.affectedKingdoms.length).toBeGreaterThan(1);
  });

  it('does not re-infect kingdoms in recoveredKingdoms', () => {
    const state = baseState();
    const firstNeighbor = state.diplomacy.neighbors[0]?.id;
    if (!firstNeighbor) throw new Error('expected at least one neighbor');
    const def = makeDef({
      spread: {
        transmittedBy: ['land', 'river', 'sea', 'mountain_pass'],
        baseProbabilityPerTurn: 1,
      },
    });
    const event = makeActive({
      affectedKingdoms: [PLAYER_KINGDOM_ID],
      recoveredKingdoms: [firstNeighbor],
    }, def);
    const next = spreadWorldEvent(event, def, state, seededRandom('spread_rec'));
    expect(next.affectedKingdoms).not.toContain(firstNeighbor);
  });

  it('is deterministic given identical inputs', () => {
    const def = makeDef({
      spread: { transmittedBy: ['land', 'river'], baseProbabilityPerTurn: 0.5 },
    });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const a = spreadWorldEvent(event, def, baseState(), seededRandom('spread_det'));
    const b = spreadWorldEvent(event, def, baseState(), seededRandom('spread_det'));
    expect(a).toEqual(b);
  });

  it('skips when the event has resolved or is waning', () => {
    const def = makeDef({
      spread: { transmittedBy: ['land', 'river', 'sea'], baseProbabilityPerTurn: 1 },
    });
    const resolved = makeActive({ phase: 'resolved' }, def);
    const waning = makeActive({ phase: 'waning' }, def);
    expect(spreadWorldEvent(resolved, def, baseState(), seededRandom('s_r'))).toBe(resolved);
    expect(spreadWorldEvent(waning, def, baseState(), seededRandom('s_w'))).toBe(waning);
  });
});

// ---- applyWorldEventEffects -------------------------------------------

describe('applyWorldEventEffects', () => {
  it('applies treasury deltas to the player', () => {
    const def = makeDef({ perTurnEffects: [{ kind: 'treasury', value: -10 }] });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const state = baseState();
    const before = state.treasury.balance;
    const next = applyWorldEventEffects(state, [event], [def]);
    expect(next.treasury.balance).toBe(before - 10);
  });

  it('applies food deltas clamped at zero', () => {
    const def = makeDef({ perTurnEffects: [{ kind: 'food', value: -9999 }] });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const state = baseState();
    const next = applyWorldEventEffects(state, [event], [def]);
    expect(next.food.reserves).toBe(0);
  });

  it('applies stability deltas clamped 0..100', () => {
    const def = makeDef({ perTurnEffects: [{ kind: 'stability', value: +9999 }] });
    const event = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const state = baseState();
    const next = applyWorldEventEffects(state, [event], [def]);
    expect(next.stability.value).toBe(100);
  });

  it('applies rival_mood to a neighbor kingdomSimulation', () => {
    const state = baseState();
    const target = state.diplomacy.neighbors.find((n) => n.kingdomSimulation);
    if (!target) return;
    const def = makeDef({ perTurnEffects: [{ kind: 'rival_mood', value: -5 }] });
    const event = makeActive({ affectedKingdoms: [target.id] }, def);
    const next = applyWorldEventEffects(state, [event], [def]);
    const after = next.diplomacy.neighbors.find((n) => n.id === target.id);
    expect(after?.kingdomSimulation?.populationMood).toBeLessThan(
      target.kingdomSimulation!.populationMood,
    );
  });

  it('is a no-op when events list is empty', () => {
    const state = baseState();
    const next = applyWorldEventEffects(state, [], [makeDef({})]);
    expect(next).toBe(state);
  });

  it('skips events whose definition has been removed from the pool', () => {
    const state = baseState();
    const event = makeActive({ definitionId: 'we_missing' }, makeDef({ id: 'we_missing' }));
    const next = applyWorldEventEffects(state, [event], []);
    expect(next).toBe(state);
  });
});

// ---- surfaceWorldEventsToActiveEvents ---------------------------------

describe('surfaceWorldEventsToActiveEvents', () => {
  it('surfaces exactly once per event when it reaches the player', () => {
    const def = makeDef({});
    const we = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const firstPass = surfaceWorldEventsToActiveEvents([we], [def], [], 12);
    expect(firstPass.activeEvents.length).toBe(1);
    expect(firstPass.worldEvents[0].playerCardSurfacedOnTurn).toBe(12);

    const secondPass = surfaceWorldEventsToActiveEvents(
      firstPass.worldEvents,
      [def],
      [],
      13,
    );
    expect(secondPass.activeEvents.length).toBe(0);
  });

  it('does not surface events that have not reached the player', () => {
    const def = makeDef({});
    const we = makeActive({ affectedKingdoms: ['neighbor_valdris'] }, def);
    const result = surfaceWorldEventsToActiveEvents([we], [def], [], 5);
    expect(result.activeEvents.length).toBe(0);
    expect(result.worldEvents[0].playerCardSurfacedOnTurn).toBeNull();
  });

  it('preserves pre-existing activeEvents in the returned list', () => {
    const def = makeDef({});
    const we = makeActive({ affectedKingdoms: [PLAYER_KINGDOM_ID] }, def);
    const existing = [
      {
        id: 'evt_existing',
        definitionId: 'evt_existing',
        severity: EventSeverity.Notable,
        category: 0 as never,
        isResolved: false,
        choiceMade: null,
        chainId: null,
        chainStep: null,
        turnSurfaced: 1,
        affectedRegionId: null,
        affectedClassId: null,
        affectedNeighborId: null,
        relatedStorylineId: null,
        outcomeQuality: null,
        isFollowUp: false,
        followUpSourceId: null,
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = surfaceWorldEventsToActiveEvents([we], [def], existing as any, 1);
    expect(result.activeEvents.length).toBe(2);
  });
});

// ---- Data pool sanity -------------------------------------------------

describe('WORLD_EVENT_DEFINITIONS pool', () => {
  it('contains 10 definitions', () => {
    expect(WORLD_EVENT_DEFINITIONS.length).toBe(10);
  });

  it('has unique ids with the we_ prefix', () => {
    const ids = WORLD_EVENT_DEFINITIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith('we_')).toBe(true);
  });

  it('each definition has at least one choice', () => {
    for (const def of WORLD_EVENT_DEFINITIONS) {
      expect(def.choices.length).toBeGreaterThan(0);
    }
  });
});
