import { describe, it, expect, vi, afterEach } from 'vitest';
import { evaluateCondition } from '../engine/events/event-engine';
import type { EventTriggerCondition } from '../engine/events/event-engine';
import { createDefaultScenario } from '../data/scenarios/default';
import { NeighborActionType } from '../engine/types';
import type { GameState } from '../engine/types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeState(overrides: Partial<GameState> = {}): GameState {
  const base = createDefaultScenario();
  return { ...base, ...overrides };
}

// Default scenario neighbors:
//   neighbor_arenthal: relationshipScore 60
//   neighbor_valdris:  relationshipScore 50
// Default total population: 500 + 1200 + 2500 + 18000 + 2000 = 24200

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  vi.restoreAllMocks();
});

// ===== neighbor_relationship_above =====

describe('neighbor_relationship_above', () => {
  it('returns true when relationship score exceeds threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      neighborId: 'neighbor_arenthal',
      threshold: 50,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('returns false when relationship score is below threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      neighborId: 'neighbor_arenthal',
      threshold: 70,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when relationship score equals threshold (strict >)', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      neighborId: 'neighbor_arenthal',
      threshold: 60,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when neighbor does not exist', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      neighborId: 'nonexistent',
      threshold: 10,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when neighborId is missing', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      threshold: 10,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when threshold is missing', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_above',
      neighborId: 'neighbor_arenthal',
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });
});

// ===== neighbor_relationship_below =====

describe('neighbor_relationship_below', () => {
  it('returns true when relationship score is below threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_below',
      neighborId: 'neighbor_arenthal',
      threshold: 70,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('returns false when relationship score exceeds threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_below',
      neighborId: 'neighbor_arenthal',
      threshold: 50,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when relationship score equals threshold (strict <)', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_below',
      neighborId: 'neighbor_arenthal',
      threshold: 60,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when neighbor does not exist', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_relationship_below',
      neighborId: 'nonexistent',
      threshold: 100,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });
});

// ===== neighbor_action_recent =====

describe('neighbor_action_recent', () => {
  it('returns true when matching action exists within turn window', () => {
    const state = makeState();
    state.diplomacy.neighbors[0].recentActionHistory = [
      { turnNumber: 8, actionType: NeighborActionType.BorderTension, summary: 'test' },
    ];
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.BorderTension,
      withinTurns: 3,
    };
    // turnNumber 10, entry at turn 8 → diff = 2 ≤ 3
    expect(evaluateCondition(condition, state, 10)).toBe(true);
  });

  it('returns false when matching action is outside turn window', () => {
    const state = makeState();
    state.diplomacy.neighbors[0].recentActionHistory = [
      { turnNumber: 5, actionType: NeighborActionType.BorderTension, summary: 'test' },
    ];
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.BorderTension,
      withinTurns: 3,
    };
    // turnNumber 10, entry at turn 5 → diff = 5 > 3
    expect(evaluateCondition(condition, state, 10)).toBe(false);
  });

  it('includes the exact boundary turn', () => {
    const state = makeState();
    state.diplomacy.neighbors[0].recentActionHistory = [
      { turnNumber: 7, actionType: NeighborActionType.TradeProposal, summary: 'test' },
    ];
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.TradeProposal,
      withinTurns: 3,
    };
    // turnNumber 10, entry at turn 7 → diff = 3 ≤ 3 (exact boundary)
    expect(evaluateCondition(condition, state, 10)).toBe(true);
  });

  it('returns false when action type does not match', () => {
    const state = makeState();
    state.diplomacy.neighbors[0].recentActionHistory = [
      { turnNumber: 9, actionType: NeighborActionType.BorderTension, summary: 'test' },
    ];
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.WarDeclaration,
      withinTurns: 3,
    };
    expect(evaluateCondition(condition, state, 10)).toBe(false);
  });

  it('returns false when neighbor has no action history', () => {
    const state = makeState();
    // recentActionHistory is [] by default
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.BorderTension,
      withinTurns: 5,
    };
    expect(evaluateCondition(condition, state, 10)).toBe(false);
  });

  it('returns false when neighbor does not exist', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'neighbor_action_recent',
      neighborId: 'nonexistent',
      actionType: NeighborActionType.BorderTension,
      withinTurns: 5,
    };
    expect(evaluateCondition(condition, state, 10)).toBe(false);
  });

  it('returns false when any required field is missing', () => {
    const state = makeState();
    // Missing actionType
    expect(evaluateCondition({
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      withinTurns: 3,
    }, state, 10)).toBe(false);
    // Missing withinTurns
    expect(evaluateCondition({
      type: 'neighbor_action_recent',
      neighborId: 'neighbor_arenthal',
      actionType: NeighborActionType.BorderTension,
    }, state, 10)).toBe(false);
    // Missing neighborId
    expect(evaluateCondition({
      type: 'neighbor_action_recent',
      actionType: NeighborActionType.BorderTension,
      withinTurns: 3,
    }, state, 10)).toBe(false);
  });
});

// ===== population_above =====

describe('population_above', () => {
  it('returns true when total population exceeds threshold', () => {
    const state = makeState();
    // Default total = 24200
    const condition: EventTriggerCondition = {
      type: 'population_above',
      threshold: 20000,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('returns false when total population is below threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_above',
      threshold: 30000,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when total population equals threshold (strict >)', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_above',
      threshold: 24200,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when threshold is missing', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_above',
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });
});

// ===== population_below =====

describe('population_below', () => {
  it('returns true when total population is below threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_below',
      threshold: 30000,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('returns false when total population exceeds threshold', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_below',
      threshold: 20000,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when total population equals threshold (strict <)', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'population_below',
      threshold: 24200,
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });
});

// ===== any_of =====

describe('any_of', () => {
  it('returns true when at least one sub-condition passes', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'any_of',
      conditions: [
        { type: 'treasury_above', threshold: 999999 }, // false
        { type: 'food_above', threshold: 0 },          // true (default food > 0)
      ],
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('returns false when no sub-conditions pass', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'any_of',
      conditions: [
        { type: 'treasury_above', threshold: 999999 },
        { type: 'food_above', threshold: 999999 },
      ],
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when conditions array is empty', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'any_of',
      conditions: [],
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('returns false when conditions field is undefined', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'any_of',
    };
    expect(evaluateCondition(condition, state, 1)).toBe(false);
  });

  it('handles nested any_of recursively', () => {
    const state = makeState();
    const condition: EventTriggerCondition = {
      type: 'any_of',
      conditions: [
        { type: 'treasury_above', threshold: 999999 }, // false
        {
          type: 'any_of',
          conditions: [
            { type: 'treasury_above', threshold: 999999 }, // false
            { type: 'always' },                             // true
          ],
        },
      ],
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
  });

  it('short-circuits on first passing condition', () => {
    const state = makeState();
    const randomSpy = vi.spyOn(Math, 'random');
    const condition: EventTriggerCondition = {
      type: 'any_of',
      conditions: [
        { type: 'always' },                            // passes immediately
        { type: 'random_chance', probability: 0.5 },   // should not be reached
      ],
    };
    expect(evaluateCondition(condition, state, 1)).toBe(true);
    expect(randomSpy).not.toHaveBeenCalled();
  });
});
