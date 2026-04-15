import { describe, it, expect, vi, afterEach } from 'vitest';
import { scheduleFollowUps, processDueFollowUps } from '../engine/events/follow-up-tracker';
import { classifyEventRole } from '../bridge/eventClassifier';
import { generateCrisisPhaseData } from '../bridge/crisisCardGenerator';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { EVENT_TEXT } from '../data/text/events';
import { createDefaultScenario } from '../data/scenarios/default';
import { EventSeverity } from '../engine/types';
import type { ActiveEvent, GameState } from '../engine/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ALL_DEFINITIONS = [...EVENT_POOL, ...FOLLOW_UP_POOL];

function makeActiveEvent(overrides: Partial<ActiveEvent>): ActiveEvent {
  return {
    id: 'evt-test-1',
    definitionId: 'evt_test',
    severity: EventSeverity.Notable,
    category: 'Economy' as ActiveEvent['category'],
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
    ...overrides,
  };
}

function makeState(overrides?: Partial<GameState>): GameState {
  const base = createDefaultScenario();
  return { ...base, ...overrides };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// evt_merchant_permanent_concessions
// ---------------------------------------------------------------------------

describe('Follow-up event triage: evt_merchant_permanent_concessions', () => {
  const DEF_ID = 'evt_merchant_permanent_concessions';
  const PARENT_ID = 'evt_merchant_capital_flight';
  const TRIGGER_CHOICE = 'offer_tax_relief';

  it('exists in FOLLOW_UP_POOL with correct structure', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def).toBeDefined();
    expect(def!.choices).toHaveLength(3);
    expect(def!.choices.map((c) => c.choiceId)).toEqual([
      'grant_permanent_charter',
      'reject_demands',
      'offer_limited_concession',
    ]);
  });

  it('has severity Serious after triage', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def!.severity).toBe(EventSeverity.Serious);
  });

  it('has effects defined for all choices', () => {
    const effects = EVENT_CHOICE_EFFECTS[DEF_ID];
    expect(effects).toBeDefined();
    expect(effects.grant_permanent_charter).toBeDefined();
    expect(effects.reject_demands).toBeDefined();
    expect(effects.offer_limited_concession).toBeDefined();
  });

  it('has text entries for all choices', () => {
    const text = EVENT_TEXT[DEF_ID];
    expect(text).toBeDefined();
    expect(text.title).toBe('Merchants Press Advantage');
    expect(text.body).toBeTruthy();
    expect(text.choices.grant_permanent_charter).toBeTruthy();
    expect(text.choices.reject_demands).toBeTruthy();
    expect(text.choices.offer_limited_concession).toBeTruthy();
  });

  it('is scheduled when parent event resolves with offer_tax_relief', () => {
    const resolved = makeActiveEvent({
      definitionId: PARENT_ID,
      isResolved: true,
      choiceMade: TRIGGER_CHOICE,
    });

    const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
    expect(result).toHaveLength(1);
    expect(result[0].definitionId).toBe(DEF_ID);
    expect(result[0].delayTurns).toBe(3);
    expect(result[0].probability).toBe(0.7);
  });

  it('surfaces after delay, routes as crisis, and generates correct card', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const pending = [{
      id: 'fu-test-merchant',
      definitionId: DEF_ID,
      sourceEventId: PARENT_ID,
      triggerChoiceId: TRIGGER_CHOICE,
      triggerTurn: 1,
      delayTurns: 3,
      probability: 0.7,
      stateRetries: 0,
      exclusiveGroupId: null,
    }];

    const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
      pending,
      ALL_DEFINITIONS,
      4, // turnsElapsed = 4 - 1 = 3 >= delayTurns (3) → due
      makeState(),
      new Set(),
      new Set(),
    );

    expect(surfacedEvents).toHaveLength(1);
    expect(remainingFollowUps).toHaveLength(0);

    const surfaced = surfacedEvents[0];
    expect(surfaced.definitionId).toBe(DEF_ID);
    expect(surfaced.severity).toBe(EventSeverity.Serious);
    expect(surfaced.isFollowUp).toBe(true);
    expect(surfaced.followUpSourceId).toBe(PARENT_ID);

    // Classification
    expect(classifyEventRole(surfaced)).toBe('crisis');

    // Card generation
    const crisisData = generateCrisisPhaseData(surfaced);
    expect(crisisData.crisisCard.title).toBe('Merchants Press Advantage');
    expect(crisisData.crisisCard.body).toBeTruthy();
    expect(crisisData.responses).toHaveLength(3);
    expect(crisisData.responses.map((r) => r.choiceId)).toEqual([
      'grant_permanent_charter',
      'reject_demands',
      'offer_limited_concession',
    ]);
    for (const response of crisisData.responses) {
      expect(response.title).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// evt_underground_heretical_movement
// ---------------------------------------------------------------------------

describe('Follow-up event triage: evt_underground_heretical_movement', () => {
  const DEF_ID = 'evt_underground_heretical_movement';
  const PARENT_ID = 'evt_heresy_emergence';
  const TRIGGER_CHOICE = 'suppress_immediately';

  it('exists in FOLLOW_UP_POOL with correct structure', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def).toBeDefined();
    expect(def!.choices).toHaveLength(3);
    expect(def!.choices.map((c) => c.choiceId)).toEqual([
      'infiltrate_movement',
      'public_amnesty',
      'double_down_suppression',
    ]);
  });

  it('has severity Serious', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def!.severity).toBe(EventSeverity.Serious);
  });

  it('has effects defined for all choices', () => {
    const effects = EVENT_CHOICE_EFFECTS[DEF_ID];
    expect(effects).toBeDefined();
    expect(effects.infiltrate_movement).toBeDefined();
    expect(effects.public_amnesty).toBeDefined();
    expect(effects.double_down_suppression).toBeDefined();
  });

  it('has text entries for all choices', () => {
    const text = EVENT_TEXT[DEF_ID];
    expect(text).toBeDefined();
    expect(text.title).toBe('Underground Movement');
    expect(text.body).toBeTruthy();
    expect(text.choices.infiltrate_movement).toBeTruthy();
    expect(text.choices.public_amnesty).toBeTruthy();
    expect(text.choices.double_down_suppression).toBeTruthy();
  });

  it('is scheduled when parent event resolves with suppress_immediately', () => {
    const resolved = makeActiveEvent({
      definitionId: PARENT_ID,
      isResolved: true,
      choiceMade: TRIGGER_CHOICE,
    });

    const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
    expect(result).toHaveLength(1);
    expect(result[0].definitionId).toBe(DEF_ID);
    expect(result[0].delayTurns).toBe(3);
    expect(result[0].probability).toBe(0.5);
  });

  it('surfaces after delay, routes as crisis, and generates correct card', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const pending = [{
      id: 'fu-test-heresy',
      definitionId: DEF_ID,
      sourceEventId: PARENT_ID,
      triggerChoiceId: TRIGGER_CHOICE,
      triggerTurn: 1,
      delayTurns: 3,
      probability: 0.5,
      stateRetries: 0,
      exclusiveGroupId: null,
    }];

    const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
      pending,
      ALL_DEFINITIONS,
      4,
      makeState(),
      new Set(),
      new Set(),
    );

    expect(surfacedEvents).toHaveLength(1);
    expect(remainingFollowUps).toHaveLength(0);

    const surfaced = surfacedEvents[0];
    expect(surfaced.definitionId).toBe(DEF_ID);
    expect(surfaced.severity).toBe(EventSeverity.Serious);
    expect(surfaced.isFollowUp).toBe(true);
    expect(surfaced.followUpSourceId).toBe(PARENT_ID);

    expect(classifyEventRole(surfaced)).toBe('crisis');

    const crisisData = generateCrisisPhaseData(surfaced);
    expect(crisisData.crisisCard.title).toBe('Underground Movement');
    expect(crisisData.crisisCard.body).toBeTruthy();
    expect(crisisData.responses).toHaveLength(3);
    expect(crisisData.responses.map((r) => r.choiceId)).toEqual([
      'infiltrate_movement',
      'public_amnesty',
      'double_down_suppression',
    ]);
    for (const response of crisisData.responses) {
      expect(response.title).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// evt_equipment_failure_field
// ---------------------------------------------------------------------------

describe('Follow-up event triage: evt_equipment_failure_field', () => {
  const DEF_ID = 'evt_equipment_failure_field';
  const PARENT_ID = 'evt_military_equipment_shortage_1';
  const TRIGGER_CHOICE = 'defer_to_next_month';

  it('exists in FOLLOW_UP_POOL with correct structure', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def).toBeDefined();
    expect(def!.choices).toHaveLength(3);
    expect(def!.choices.map((c) => c.choiceId)).toEqual([
      'emergency_field_repair',
      'retreat_and_regroup',
      'push_through',
    ]);
    // push_through is a free action
    const pushThrough = def!.choices.find((c) => c.choiceId === 'push_through');
    expect(pushThrough!.isFree).toBe(true);
    expect(pushThrough!.slotCost).toBe(0);
  });

  it('has severity Critical', () => {
    const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
    expect(def!.severity).toBe(EventSeverity.Critical);
  });

  it('has effects defined for all choices', () => {
    const effects = EVENT_CHOICE_EFFECTS[DEF_ID];
    expect(effects).toBeDefined();
    expect(effects.emergency_field_repair).toBeDefined();
    expect(effects.retreat_and_regroup).toBeDefined();
    expect(effects.push_through).toBeDefined();
  });

  it('has text entries for all choices', () => {
    const text = EVENT_TEXT[DEF_ID];
    expect(text).toBeDefined();
    expect(text.title).toBe('Equipment Fails in the Field');
    expect(text.body).toBeTruthy();
    expect(text.choices.emergency_field_repair).toBeTruthy();
    expect(text.choices.retreat_and_regroup).toBeTruthy();
    expect(text.choices.push_through).toBeTruthy();
  });

  it('is scheduled when parent event resolves with defer_to_next_month', () => {
    const resolved = makeActiveEvent({
      definitionId: PARENT_ID,
      isResolved: true,
      choiceMade: TRIGGER_CHOICE,
    });

    const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
    expect(result).toHaveLength(1);
    expect(result[0].definitionId).toBe(DEF_ID);
    expect(result[0].delayTurns).toBe(2);
    expect(result[0].probability).toBe(0.6);
  });

  it('surfaces after delay, routes as crisis, and generates correct card', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const pending = [{
      id: 'fu-test-equipment',
      definitionId: DEF_ID,
      sourceEventId: PARENT_ID,
      triggerChoiceId: TRIGGER_CHOICE,
      triggerTurn: 1,
      delayTurns: 2,
      probability: 0.6,
      stateRetries: 0,
      exclusiveGroupId: null,
    }];

    const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
      pending,
      ALL_DEFINITIONS,
      3, // turnsElapsed = 3 - 1 = 2 >= delayTurns (2) → due
      makeState(),
      new Set(),
      new Set(),
    );

    expect(surfacedEvents).toHaveLength(1);
    expect(remainingFollowUps).toHaveLength(0);

    const surfaced = surfacedEvents[0];
    expect(surfaced.definitionId).toBe(DEF_ID);
    expect(surfaced.severity).toBe(EventSeverity.Critical);
    expect(surfaced.isFollowUp).toBe(true);
    expect(surfaced.followUpSourceId).toBe(PARENT_ID);

    expect(classifyEventRole(surfaced)).toBe('crisis');

    const crisisData = generateCrisisPhaseData(surfaced);
    expect(crisisData.crisisCard.title).toBe('Equipment Fails in the Field');
    expect(crisisData.crisisCard.body).toBeTruthy();
    expect(crisisData.responses).toHaveLength(3);
    expect(crisisData.responses.map((r) => r.choiceId)).toEqual([
      'emergency_field_repair',
      'retreat_and_regroup',
      'push_through',
    ]);
    // Verify push_through is a free action in the response card
    const pushResponse = crisisData.responses.find((r) => r.choiceId === 'push_through');
    expect(pushResponse!.isFree).toBe(true);
    expect(pushResponse!.slotCost).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Negative paths
// ---------------------------------------------------------------------------

describe('Follow-up event triage: negative paths', () => {
  it('wrong parent choice does not schedule follow-up', () => {
    const resolved = makeActiveEvent({
      definitionId: 'evt_merchant_capital_flight',
      isResolved: true,
      choiceMade: 'enforce_capital_controls', // not offer_tax_relief
    });

    const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
    expect(result).toHaveLength(0);
  });

  it('probability roll failure prevents surfacing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const pending = [{
      id: 'fu-test-fail',
      definitionId: 'evt_merchant_permanent_concessions',
      sourceEventId: 'evt_merchant_capital_flight',
      triggerChoiceId: 'offer_tax_relief',
      triggerTurn: 1,
      delayTurns: 3,
      probability: 0.7,
      stateRetries: 0,
      exclusiveGroupId: null,
    }];

    const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
      pending,
      ALL_DEFINITIONS,
      4,
      makeState(),
      new Set(),
      new Set(),
    );

    expect(surfacedEvents).toHaveLength(0);
    expect(remainingFollowUps).toHaveLength(0); // consumed by failed probability
  });

  it('follow-up does not surface before delay expires', () => {
    const pending = [{
      id: 'fu-test-early',
      definitionId: 'evt_equipment_failure_field',
      sourceEventId: 'evt_military_equipment_shortage_1',
      triggerChoiceId: 'defer_to_next_month',
      triggerTurn: 1,
      delayTurns: 2,
      probability: 0.6,
      stateRetries: 0,
      exclusiveGroupId: null,
    }];

    const { surfacedEvents, remainingFollowUps } = processDueFollowUps(
      pending,
      ALL_DEFINITIONS,
      2, // turnsElapsed = 2 - 1 = 1 < delayTurns (2) → not due
      makeState(),
      new Set(),
      new Set(),
    );

    expect(surfacedEvents).toHaveLength(0);
    expect(remainingFollowUps).toHaveLength(1);
  });
});
