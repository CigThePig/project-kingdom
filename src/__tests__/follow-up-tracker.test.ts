import { describe, it, expect, vi, afterEach } from 'vitest';
import { scheduleFollowUps, processDueFollowUps } from '../engine/events/follow-up-tracker';
import { createDefaultScenario } from '../data/scenarios/default';
import { DEFAULT_MAX_STATE_RETRIES } from '../engine/constants';
import type { ActiveEvent, GameState, PendingFollowUp } from '../engine/types';
import { EventSeverity, EventCategory } from '../engine/types';
import type { EventDefinition, EventTriggerCondition } from '../engine/events/event-engine';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeFollowUp(overrides: Partial<PendingFollowUp> = {}): PendingFollowUp {
  return {
    id: 'fu-test-1',
    definitionId: 'evt_followup_a',
    sourceEventId: 'evt_source_a',
    triggerChoiceId: 'choice_1',
    triggerTurn: 1,
    delayTurns: 2,
    probability: 1.0,
    stateRetries: 0,
    exclusiveGroupId: null,
    ...overrides,
  };
}

function makeDefinition(overrides: Partial<EventDefinition> = {}): EventDefinition {
  return {
    id: 'evt_followup_a',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    ...overrides,
  };
}

function makeResolvedEvent(overrides: Partial<ActiveEvent> = {}): ActiveEvent {
  return {
    id: 'evt-source-1',
    definitionId: 'evt_source_a',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    isResolved: true,
    choiceMade: 'choice_1',
    chainId: null,
    chainStep: null,
    turnSurfaced: 1,
    affectedRegionId: null,
    affectedClassId: null,
    relatedStorylineId: null,
    outcomeQuality: null,
    isFollowUp: false,
    followUpSourceId: null,
    ...overrides,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const base = createDefaultScenario();
  return { ...base, ...overrides };
}

function makeSourceDefinition(overrides: Partial<EventDefinition> = {}): EventDefinition {
  return makeDefinition({
    id: 'evt_source_a',
    choices: [
      { choiceId: 'choice_1', slotCost: 1, isFree: false },
      { choiceId: 'choice_2', slotCost: 1, isFree: false },
    ],
    followUpEvents: [
      {
        triggerChoiceId: 'choice_1',
        followUpDefinitionId: 'evt_followup_a',
        delayTurns: 2,
        probability: 0.7,
      },
    ],
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  vi.restoreAllMocks();
});

// ===== scheduleFollowUps — composite dedupe =====

describe('scheduleFollowUps', () => {
  it('allows same definitionId from different source events', () => {
    const eventA = makeResolvedEvent({ definitionId: 'evt_source_a' });
    const eventB = makeResolvedEvent({
      id: 'evt-source-2',
      definitionId: 'evt_source_b',
      choiceMade: 'choice_1',
    });

    const defA = makeSourceDefinition({ id: 'evt_source_a' });
    const defB = makeSourceDefinition({
      id: 'evt_source_b',
      followUpEvents: [
        {
          triggerChoiceId: 'choice_1',
          followUpDefinitionId: 'evt_followup_a',
          delayTurns: 3,
          probability: 0.8,
        },
      ],
    });
    const pool = [defA, defB, makeDefinition({ id: 'evt_followup_a' })];

    // Schedule from source A first.
    const after1 = scheduleFollowUps([], eventA, pool, 1);
    expect(after1).toHaveLength(1);

    // Schedule from source B — should NOT be blocked.
    const after2 = scheduleFollowUps(after1, eventB, pool, 1);
    expect(after2).toHaveLength(2);
    expect(after2[0].sourceEventId).toBe('evt_source_a');
    expect(after2[1].sourceEventId).toBe('evt_source_b');
  });

  it('blocks true duplicate from same source + choice + definition', () => {
    const event = makeResolvedEvent();
    const def = makeSourceDefinition();
    const pool = [def, makeDefinition({ id: 'evt_followup_a' })];

    const after1 = scheduleFollowUps([], event, pool, 1);
    expect(after1).toHaveLength(1);

    // Same source, same choice — should be blocked.
    const after2 = scheduleFollowUps(after1, event, pool, 2);
    expect(after2).toHaveLength(1);
  });

  it('propagates stateConditions from authored definition', () => {
    const conditions: EventTriggerCondition[] = [
      { type: 'treasury_above', threshold: 50 },
    ];
    const def = makeSourceDefinition({
      followUpEvents: [
        {
          triggerChoiceId: 'choice_1',
          followUpDefinitionId: 'evt_followup_a',
          delayTurns: 2,
          probability: 1.0,
          stateConditions: conditions,
        },
      ],
    });
    const event = makeResolvedEvent();
    const pool = [def, makeDefinition({ id: 'evt_followup_a' })];

    const result = scheduleFollowUps([], event, pool, 1);
    expect(result).toHaveLength(1);
    expect(result[0].stateConditions).toEqual(conditions);
  });

  it('propagates exclusiveGroupId from authored definition', () => {
    const def = makeSourceDefinition({
      followUpEvents: [
        {
          triggerChoiceId: 'choice_1',
          followUpDefinitionId: 'evt_followup_a',
          delayTurns: 2,
          probability: 1.0,
          exclusiveGroupId: 'excl_test',
        },
      ],
    });
    const event = makeResolvedEvent();
    const pool = [def, makeDefinition({ id: 'evt_followup_a' })];

    const result = scheduleFollowUps([], event, pool, 1);
    expect(result[0].exclusiveGroupId).toBe('excl_test');
  });

  it('propagates maxStateRetries from authored definition', () => {
    const def = makeSourceDefinition({
      followUpEvents: [
        {
          triggerChoiceId: 'choice_1',
          followUpDefinitionId: 'evt_followup_a',
          delayTurns: 2,
          probability: 1.0,
          maxStateRetries: 5,
        },
      ],
    });
    const event = makeResolvedEvent();
    const pool = [def, makeDefinition({ id: 'evt_followup_a' })];

    const result = scheduleFollowUps([], event, pool, 1);
    expect(result[0].maxStateRetries).toBe(5);
  });

  it('initializes stateRetries to 0', () => {
    const event = makeResolvedEvent();
    const def = makeSourceDefinition();
    const pool = [def, makeDefinition({ id: 'evt_followup_a' })];

    const result = scheduleFollowUps([], event, pool, 1);
    expect(result[0].stateRetries).toBe(0);
  });
});

// ===== processDueFollowUps — state condition retry =====

describe('processDueFollowUps', () => {
  describe('state conditions', () => {
    it('re-queues a due follow-up when state conditions fail (under retry limit)', () => {
      // treasury_above: 9999 will never pass on a default scenario
      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        stateConditions: [{ type: 'treasury_above', threshold: 9999 }],
        stateRetries: 0,
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fu],
        pool,
        3, // turnsElapsed = 3 - 1 = 2 >= delayTurns (2) → due
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(0);
      expect(remainingFollowUps).toHaveLength(1);
      expect(remainingFollowUps[0].stateRetries).toBe(1);
    });

    it('discards a due follow-up when state retries exhausted (default max)', () => {
      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        stateConditions: [{ type: 'treasury_above', threshold: 9999 }],
        stateRetries: DEFAULT_MAX_STATE_RETRIES, // already at limit
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fu],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(0);
      expect(remainingFollowUps).toHaveLength(0); // discarded
    });

    it('uses authored maxStateRetries when provided', () => {
      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        stateConditions: [{ type: 'treasury_above', threshold: 9999 }],
        stateRetries: 1,
        maxStateRetries: 1, // custom limit — already exhausted
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fu],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(0);
      expect(remainingFollowUps).toHaveLength(0); // discarded because 1 >= 1
    });

    it('surfaces a follow-up when state conditions pass', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      // treasury_above: 0 will always pass
      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        stateConditions: [{ type: 'treasury_above', threshold: 0 }],
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents } = processDueFollowUps(
        [fu],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(1);
      expect(surfacedEvents[0].definitionId).toBe('evt_followup_a');
      expect(surfacedEvents[0].isFollowUp).toBe(true);
    });
  });

  // ===== ordering guarantee: state before probability =====

  describe('ordering guarantee', () => {
    it('does not roll probability when state conditions fail', () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        stateConditions: [{ type: 'treasury_above', threshold: 9999 }],
        stateRetries: 0,
      });
      const pool = [makeDefinition()];
      const state = makeState();

      processDueFollowUps([fu], pool, 3, state, new Set());

      // Math.random should NOT have been called at all — conditions failed
      // before reaching the probability roll.
      expect(randomSpy).not.toHaveBeenCalled();
    });
  });

  // ===== exclusive groups =====

  describe('exclusive groups', () => {
    it('cancels pending siblings when a follow-up with exclusiveGroupId surfaces', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fuA = makeFollowUp({
        id: 'fu-a',
        definitionId: 'evt_followup_a',
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      // Sibling B: not yet due (delayTurns: 5)
      const fuB = makeFollowUp({
        id: 'fu-b',
        definitionId: 'evt_followup_b',
        triggerTurn: 1,
        delayTurns: 5,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      // Unrelated C: no group
      const fuC = makeFollowUp({
        id: 'fu-c',
        definitionId: 'evt_followup_c',
        triggerTurn: 1,
        delayTurns: 5,
        probability: 1.0,
        exclusiveGroupId: null,
      });

      const pool = [
        makeDefinition({ id: 'evt_followup_a' }),
        makeDefinition({ id: 'evt_followup_b' }),
        makeDefinition({ id: 'evt_followup_c' }),
      ];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fuA, fuB, fuC],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(1);
      expect(surfacedEvents[0].definitionId).toBe('evt_followup_a');
      // B should be cancelled (same group), C should remain
      expect(remainingFollowUps).toHaveLength(1);
      expect(remainingFollowUps[0].id).toBe('fu-c');
    });

    it('cancels same-turn siblings in the same exclusive group', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fuA = makeFollowUp({
        id: 'fu-a',
        definitionId: 'evt_followup_a',
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      const fuB = makeFollowUp({
        id: 'fu-b',
        definitionId: 'evt_followup_b',
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });

      const pool = [
        makeDefinition({ id: 'evt_followup_a' }),
        makeDefinition({ id: 'evt_followup_b' }),
      ];
      const state = makeState();

      const { surfacedEvents } = processDueFollowUps(
        [fuA, fuB],
        pool,
        3,
        state,
        new Set(),
      );

      // Only A (first in array) should surface.
      expect(surfacedEvents).toHaveLength(1);
      expect(surfacedEvents[0].definitionId).toBe('evt_followup_a');
    });

    it('does not cancel follow-ups with different exclusiveGroupId', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fuA = makeFollowUp({
        id: 'fu-a',
        definitionId: 'evt_followup_a',
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      const fuB = makeFollowUp({
        id: 'fu-b',
        definitionId: 'evt_followup_b',
        triggerTurn: 1,
        delayTurns: 5,
        probability: 1.0,
        exclusiveGroupId: 'g2',
      });

      const pool = [
        makeDefinition({ id: 'evt_followup_a' }),
        makeDefinition({ id: 'evt_followup_b' }),
      ];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fuA, fuB],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(1);
      expect(remainingFollowUps).toHaveLength(1);
      expect(remainingFollowUps[0].id).toBe('fu-b');
    });

    it('does not cancel follow-ups with null exclusiveGroupId', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fuA = makeFollowUp({
        id: 'fu-a',
        definitionId: 'evt_followup_a',
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      const fuB = makeFollowUp({
        id: 'fu-b',
        definitionId: 'evt_followup_b',
        triggerTurn: 1,
        delayTurns: 5,
        probability: 1.0,
        exclusiveGroupId: null,
      });

      const pool = [
        makeDefinition({ id: 'evt_followup_a' }),
        makeDefinition({ id: 'evt_followup_b' }),
      ];
      const state = makeState();

      const { remainingFollowUps } = processDueFollowUps(
        [fuA, fuB],
        pool,
        3,
        state,
        new Set(),
      );

      expect(remainingFollowUps).toHaveLength(1);
      expect(remainingFollowUps[0].id).toBe('fu-b');
    });
  });

  // ===== edge cases =====

  describe('edge cases', () => {
    it('surfaces follow-up with no stateConditions (backward compat)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        stateConditions: undefined,
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents } = processDueFollowUps(
        [fu],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(1);
    });

    it('surfaces follow-up with empty stateConditions array', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const fu = makeFollowUp({
        triggerTurn: 1,
        delayTurns: 2,
        probability: 1.0,
        stateConditions: [],
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents } = processDueFollowUps(
        [fu],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(1);
    });

    it('preserves not-yet-due follow-ups with exclusive groups without cancelling them', () => {
      // Only fuA is not yet due. No sibling surfaces this turn.
      const fuA = makeFollowUp({
        id: 'fu-a',
        definitionId: 'evt_followup_a',
        triggerTurn: 1,
        delayTurns: 10, // not due
        probability: 1.0,
        exclusiveGroupId: 'g1',
      });
      const pool = [makeDefinition()];
      const state = makeState();

      const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
        [fuA],
        pool,
        3,
        state,
        new Set(),
      );

      expect(surfacedEvents).toHaveLength(0);
      expect(remainingFollowUps).toHaveLength(1);
      expect(remainingFollowUps[0].id).toBe('fu-a');
    });
  });
});
