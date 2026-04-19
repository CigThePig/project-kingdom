// Smart Card Engine Surface — Phase E
// Rival Crisis Window: a notification that surfaces when a neighbor is in
// crisis and the player's intel on them is at least 'moderate'. These tests
// cover the new `neighbor_in_crisis` trigger condition, the `__IN_CRISIS__`
// neighbor sentinel, and end-to-end smart-text rendering of the body.

import { describe, it, expect } from 'vitest';
import {
  evaluateCondition,
  resolveNeighborId,
  surfaceEvents,
} from '../engine/events/event-engine';
import type { EventTriggerCondition } from '../engine/events/event-engine';
import { EXPANSION_DIPLOMACY_EVENTS } from '../data/events/expansion/diplomacy-events';
import { EXPANSION_DIPLOMACY_TEXT } from '../data/text/expansion/diplomacy-text';
import { EXPANSION_DIPLOMACY_EFFECTS } from '../data/events/expansion/diplomacy-effects';
import { generateNotificationCards } from '../bridge/petitionCardGenerator';
import { createDefaultScenario } from '../data/scenarios/default';
import { RivalCrisisType } from '../engine/types';
import type { GameState, NeighborState } from '../engine/types';

function putFirstNeighborInCrisis(
  state: GameState,
  type: RivalCrisisType = RivalCrisisType.Famine,
): NeighborState {
  const nb = state.diplomacy.neighbors[0];
  if (!nb.kingdomSimulation) throw new Error('test requires kingdomSimulation present');
  nb.kingdomSimulation.isInCrisis = true;
  nb.kingdomSimulation.crisisType = type;
  nb.kingdomSimulation.populationMood = 20; // 'restive' band
  return nb;
}

function findCrisisDef() {
  const def = EXPANSION_DIPLOMACY_EVENTS.find((d) => d.id === 'evt_rival_crisis_window');
  if (!def) throw new Error('evt_rival_crisis_window missing from pool');
  return def;
}

describe('neighbor_in_crisis trigger condition', () => {
  it('returns true when a neighbor is in crisis and intel is at least moderate', () => {
    const state = createDefaultScenario();
    putFirstNeighborInCrisis(state);
    state.espionage!.networkStrength = 50; // moderate band (31–60)
    const c: EventTriggerCondition = { type: 'neighbor_in_crisis', minIntelLevel: 'moderate' };
    expect(evaluateCondition(c, state, 1)).toBe(true);
  });

  it('returns false when no neighbor is in crisis', () => {
    const state = createDefaultScenario();
    state.espionage!.networkStrength = 80;
    const c: EventTriggerCondition = { type: 'neighbor_in_crisis', minIntelLevel: 'moderate' };
    expect(evaluateCondition(c, state, 1)).toBe(false);
  });

  it('returns false when intel is below the required tier', () => {
    const state = createDefaultScenario();
    putFirstNeighborInCrisis(state);
    state.espionage!.networkStrength = 10; // minimal/none — below moderate (>30)
    const c: EventTriggerCondition = { type: 'neighbor_in_crisis', minIntelLevel: 'moderate' };
    expect(evaluateCondition(c, state, 1)).toBe(false);
  });

  it('defaults to moderate intel tier when minIntelLevel is absent', () => {
    const state = createDefaultScenario();
    putFirstNeighborInCrisis(state);
    state.espionage!.networkStrength = 25; // minimal — below moderate (>30)
    const c: EventTriggerCondition = { type: 'neighbor_in_crisis' };
    expect(evaluateCondition(c, state, 1)).toBe(false);
    state.espionage!.networkStrength = 35;
    expect(evaluateCondition(c, state, 1)).toBe(true);
  });
});

describe('__IN_CRISIS__ neighbor sentinel', () => {
  it('resolves to a neighbor whose kingdomSimulation.isInCrisis is true', () => {
    const state = createDefaultScenario();
    const nb = putFirstNeighborInCrisis(state);
    const resolved = resolveNeighborId('__IN_CRISIS__', state, 1, 'test');
    expect(resolved).toBe(nb.id);
  });

  it('returns null when no neighbor is in crisis', () => {
    const state = createDefaultScenario();
    expect(resolveNeighborId('__IN_CRISIS__', state, 1, 'test')).toBeNull();
  });
});

describe('evt_rival_crisis_window notification', () => {
  it('is authored as a notification with a single acknowledge choice and no mechanical effects', () => {
    const def = findCrisisDef();
    expect(def.classification).toBe('notification');
    expect(def.choices).toHaveLength(1);
    expect(def.choices[0].choiceId).toBe('acknowledge');
    expect(def.choices[0].slotCost).toBe(0);
    expect(def.choices[0].isFree).toBe(true);
    expect(def.repeatable).toBe(true);

    const effects = EXPANSION_DIPLOMACY_EFFECTS.evt_rival_crisis_window;
    expect(effects).toBeDefined();
    expect(effects.acknowledge).toEqual({});

    const text = EXPANSION_DIPLOMACY_TEXT.evt_rival_crisis_window;
    expect(text).toBeDefined();
    // Body must be purely smart-card driven — no raw realm names baked in.
    expect(text.body).toContain('{ruler_full}');
    expect(text.body).toContain('{rival_crisis}');
    expect(text.body).toContain('{rival_mood}');
  });

  it('surfaces only when a neighbor is in crisis and intel is moderate+', () => {
    const pool = [findCrisisDef()];

    // Case 1: no crisis, strong intel → should NOT surface.
    const noCrisis = createDefaultScenario();
    noCrisis.espionage!.networkStrength = 75;
    expect(surfaceEvents(noCrisis, 5, pool, [], [])).toHaveLength(0);

    // Case 2: crisis, minimal intel → should NOT surface.
    const weakIntel = createDefaultScenario();
    putFirstNeighborInCrisis(weakIntel);
    weakIntel.espionage!.networkStrength = 15;
    expect(surfaceEvents(weakIntel, 5, pool, [], [])).toHaveLength(0);

    // Case 3: crisis, moderate intel → should surface.
    const ok = createDefaultScenario();
    putFirstNeighborInCrisis(ok);
    ok.espionage!.networkStrength = 50;
    const surfaced = surfaceEvents(ok, 5, pool, [], []);
    expect(surfaced).toHaveLength(1);
    expect(surfaced[0].definitionId).toBe('evt_rival_crisis_window');
    expect(surfaced[0].affectedNeighborId).toBe(ok.diplomacy.neighbors[0].id);
  });

  it('renders a body that names the rival and cites the crisis + mood', () => {
    const state = createDefaultScenario();
    const nb = putFirstNeighborInCrisis(state, RivalCrisisType.Famine);
    state.espionage!.networkStrength = 50;
    const pool = [findCrisisDef()];
    const surfaced = surfaceEvents(state, 5, pool, [], []);
    expect(surfaced).toHaveLength(1);

    const cards = generateNotificationCards(surfaced, state);
    expect(cards).toHaveLength(1);
    const [card] = cards;
    // Identity — displayName / ruler name / capital were resolved.
    expect(card.body).toContain(nb.displayName ?? nb.id);
    expect(card.body).not.toMatch(/\{[a-z_]/); // no raw tokens left behind
    // Mood tier 'restive' (populationMood = 20) must appear.
    expect(card.body).toMatch(/restive/);
    // A non-empty crisis clause must be present (the literal crisis label
    // varies by type; here we just confirm the string mentions hunger/grain
    // which getRivalCrisisClause surfaces for Famine).
    expect(card.body.toLowerCase()).toMatch(/grain|hunger|famine|fields/);
  });
});
