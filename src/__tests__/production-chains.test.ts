import { describe, it, expect, vi, afterEach } from 'vitest';
import { scheduleFollowUps, processDueFollowUps } from '../engine/events/follow-up-tracker';
import { classifyEventRole } from '../bridge/eventClassifier';
import { generateCrisisPhaseData } from '../bridge/crisisCardGenerator';
import { generatePetitionCards, generateNotificationCards } from '../bridge/petitionCardGenerator';
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
// Chain 9: Infrastructure Decay (6 events — petition root, simplest chain)
// ---------------------------------------------------------------------------

describe('Production chain: Infrastructure Decay', () => {
  const ROOT_ID = 'evt_infrastructure_decay_root';

  describe('root event', () => {
    it('exists in EVENT_POOL with Notable severity and 2 choices', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Notable);
      expect(def!.choices).toHaveLength(2);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'fund_emergency_repairs',
        'defer_maintenance',
      ]);
    });

    it('classifies as petition (Notable severity)', () => {
      const active = makeActiveEvent({ definitionId: ROOT_ID, severity: EventSeverity.Notable });
      expect(classifyEventRole(active)).toBe('petition');
    });

    it('generates petition card with correct title', () => {
      const active = makeActiveEvent({
        definitionId: ROOT_ID,
        severity: EventSeverity.Notable,
      });
      const cards = generatePetitionCards([active]);
      expect(cards).toHaveLength(1);
      expect(cards[0].title).toBe('Crumbling Infrastructure');
      expect(cards[0].grantChoiceId).toBe('fund_emergency_repairs');
      expect(cards[0].denyChoiceId).toBe('defer_maintenance');
    });

    it('has effects for all choices', () => {
      const effects = EVENT_CHOICE_EFFECTS[ROOT_ID];
      expect(effects).toBeDefined();
      expect(effects.fund_emergency_repairs).toBeDefined();
      expect(effects.defer_maintenance).toBeDefined();
    });

    it('has text entries for all choices', () => {
      const text = EVENT_TEXT[ROOT_ID];
      expect(text).toBeDefined();
      expect(text.title).toBe('Crumbling Infrastructure');
      expect(text.body).toBeTruthy();
      expect(text.choices.fund_emergency_repairs).toBeTruthy();
      expect(text.choices.defer_maintenance).toBeTruthy();
    });

    it('has 5 follow-up event entries', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def!.followUpEvents).toHaveLength(5);
    });
  });

  describe('follow-up: evt_infra_repair_success (notification)', () => {
    const DEF_ID = 'evt_infra_repair_success';

    it('exists in FOLLOW_UP_POOL as notification', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Informational);
      expect(def!.classification).toBe('notification');
      expect(def!.choices).toHaveLength(1);
      expect(def!.choices[0].choiceId).toBe('acknowledge');
    });

    it('has effects and text', () => {
      expect(EVENT_CHOICE_EFFECTS[DEF_ID]).toBeDefined();
      expect(EVENT_CHOICE_EFFECTS[DEF_ID].acknowledge).toBeDefined();
      expect(EVENT_TEXT[DEF_ID]).toBeDefined();
      expect(EVENT_TEXT[DEF_ID].title).toBe('Repairs Completed');
    });

    it('is scheduled when root resolves with fund_emergency_repairs', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'fund_emergency_repairs',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const match = result.find((f) => f.definitionId === DEF_ID);
      expect(match).toBeDefined();
      expect(match!.delayTurns).toBe(2);
    });

    it('classifies as notification and generates notification card', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Informational,
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      expect(classifyEventRole(active)).toBe('notification');
      const cards = generateNotificationCards([active]);
      expect(cards).toHaveLength(1);
      expect(cards[0].title).toBe('Repairs Completed');
      expect(cards[0].acknowledgeChoiceId).toBe('acknowledge');
    });
  });

  describe('follow-up: evt_infra_bridge_collapse (crisis)', () => {
    const DEF_ID = 'evt_infra_bridge_collapse';

    it('exists in FOLLOW_UP_POOL as Critical with 3 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Critical);
      expect(def!.choices).toHaveLength(3);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'emergency_rebuild',
        'reroute_supply_lines',
        'requisition_noble_estates',
      ]);
    });

    it('has effects for all choices', () => {
      const effects = EVENT_CHOICE_EFFECTS[DEF_ID];
      expect(effects).toBeDefined();
      expect(effects.emergency_rebuild).toBeDefined();
      expect(effects.reroute_supply_lines).toBeDefined();
      expect(effects.requisition_noble_estates).toBeDefined();
    });

    it('has text for all choices', () => {
      const text = EVENT_TEXT[DEF_ID];
      expect(text).toBeDefined();
      expect(text.title).toBe('Bridge Collapse Disrupts Supply Lines');
      expect(text.choices.emergency_rebuild).toBeTruthy();
      expect(text.choices.reroute_supply_lines).toBeTruthy();
      expect(text.choices.requisition_noble_estates).toBeTruthy();
    });

    it('is scheduled when root resolves with defer_maintenance', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'defer_maintenance',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const match = result.find((f) => f.definitionId === DEF_ID);
      expect(match).toBeDefined();
      expect(match!.delayTurns).toBe(3);
      expect(match!.probability).toBe(0.5);
    });

    it('classifies as crisis and generates crisis card', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Critical,
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      expect(classifyEventRole(active)).toBe('crisis');
      const crisisData = generateCrisisPhaseData(active);
      expect(crisisData.crisisCard.title).toBe('Bridge Collapse Disrupts Supply Lines');
      expect(crisisData.responses).toHaveLength(3);
    });
  });

  describe('follow-up: evt_infra_commoner_petition (petition)', () => {
    const DEF_ID = 'evt_infra_commoner_petition';

    it('exists in FOLLOW_UP_POOL as Notable with 2 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Notable);
      expect(def!.choices).toHaveLength(2);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'grant_road_repairs',
        'deny_petition',
      ]);
    });

    it('has effects and text', () => {
      expect(EVENT_CHOICE_EFFECTS[DEF_ID]).toBeDefined();
      expect(EVENT_CHOICE_EFFECTS[DEF_ID].grant_road_repairs).toBeDefined();
      expect(EVENT_CHOICE_EFFECTS[DEF_ID].deny_petition).toBeDefined();
      expect(EVENT_TEXT[DEF_ID]).toBeDefined();
      expect(EVENT_TEXT[DEF_ID].title).toBe('Commoners Petition for Road Repairs');
    });

    it('classifies as petition', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Notable,
      });
      expect(classifyEventRole(active)).toBe('petition');
    });
  });

  describe('defer_maintenance branch scheduling', () => {
    it('schedules all 3 defer_maintenance follow-ups', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'defer_maintenance',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const deferFollowUps = result.filter((f) =>
        ['evt_infra_bridge_collapse', 'evt_infra_road_decay', 'evt_infra_commoner_petition'].includes(f.definitionId),
      );
      expect(deferFollowUps).toHaveLength(3);
      // All share same exclusive group
      const groups = new Set(deferFollowUps.map((f) => f.exclusiveGroupId));
      expect(groups.size).toBe(1);
      expect(groups.has('excl_infra_defer')).toBe(true);
    });

    it('wrong choice does not schedule defer follow-ups', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'fund_emergency_repairs',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const deferIds = result.filter((f) => f.definitionId === 'evt_infra_bridge_collapse');
      expect(deferIds).toHaveLength(0);
    });
  });

  describe('data completeness', () => {
    const ALL_INFRA_IDS = [
      'evt_infrastructure_decay_root',
      'evt_infra_repair_success',
      'evt_infra_repair_cost_overrun',
      'evt_infra_bridge_collapse',
      'evt_infra_road_decay',
      'evt_infra_commoner_petition',
    ];

    it('all 6 events have effects entries', () => {
      for (const id of ALL_INFRA_IDS) {
        expect(EVENT_CHOICE_EFFECTS[id], `Missing effects for ${id}`).toBeDefined();
      }
    });

    it('all 6 events have text entries', () => {
      for (const id of ALL_INFRA_IDS) {
        expect(EVENT_TEXT[id], `Missing text for ${id}`).toBeDefined();
        expect(EVENT_TEXT[id].title, `Missing title for ${id}`).toBeTruthy();
        expect(EVENT_TEXT[id].body, `Missing body for ${id}`).toBeTruthy();
      }
    });

    it('every choice in every event has matching effect and text', () => {
      for (const id of ALL_INFRA_IDS) {
        const def = ALL_DEFINITIONS.find((e) => e.id === id);
        expect(def, `Missing definition for ${id}`).toBeDefined();
        for (const choice of def!.choices) {
          expect(
            EVENT_CHOICE_EFFECTS[id]?.[choice.choiceId],
            `Missing effect for ${id}.${choice.choiceId}`,
          ).toBeDefined();
          expect(
            EVENT_TEXT[id]?.choices?.[choice.choiceId],
            `Missing text for ${id}.${choice.choiceId}`,
          ).toBeTruthy();
        }
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Chain 2: Border Incursion (10 events — Critical root, neighbor conditions)
// ---------------------------------------------------------------------------

describe('Production chain: Border Incursion', () => {
  const ROOT_ID = 'evt_border_incursion_root';

  describe('root event', () => {
    it('exists in EVENT_POOL with Critical severity and 3 choices', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Critical);
      expect(def!.choices).toHaveLength(3);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'retaliate_with_force',
        'send_diplomatic_envoy',
        'fortify_and_absorb',
      ]);
    });

    it('uses neighbor_relationship_below trigger condition', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      const neighborCond = def!.triggerConditions.find(
        (c) => c.type === 'neighbor_relationship_below',
      );
      expect(neighborCond).toBeDefined();
    });

    it('classifies as crisis (Critical severity)', () => {
      const active = makeActiveEvent({ definitionId: ROOT_ID, severity: EventSeverity.Critical });
      expect(classifyEventRole(active)).toBe('crisis');
    });

    it('generates crisis card with correct title', () => {
      const active = makeActiveEvent({
        definitionId: ROOT_ID,
        severity: EventSeverity.Critical,
      });
      const crisisData = generateCrisisPhaseData(active);
      expect(crisisData.crisisCard.title).toBe('Border Incursion');
      expect(crisisData.responses).toHaveLength(3);
      expect(crisisData.responses.map((r) => r.choiceId)).toEqual([
        'retaliate_with_force',
        'send_diplomatic_envoy',
        'fortify_and_absorb',
      ]);
    });

    it('has effects with diplomacy deltas', () => {
      const effects = EVENT_CHOICE_EFFECTS[ROOT_ID];
      expect(effects).toBeDefined();
      expect(effects.retaliate_with_force.diplomacyDeltas).toBeDefined();
      expect(effects.send_diplomatic_envoy.diplomacyDeltas).toBeDefined();
    });

    it('has 9 follow-up event entries across 3 branches', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def!.followUpEvents).toHaveLength(9);
    });
  });

  describe('retaliate_with_force branch scheduling', () => {
    it('schedules 3 military follow-ups with shared exclusive group', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'retaliate_with_force',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const militaryFollowUps = result.filter((f) =>
        ['evt_border_campaign_victory', 'evt_border_campaign_stalemate', 'evt_border_campaign_defeat'].includes(f.definitionId),
      );
      expect(militaryFollowUps).toHaveLength(3);
      const groups = new Set(militaryFollowUps.map((f) => f.exclusiveGroupId));
      expect(groups.size).toBe(1);
      expect(groups.has('excl_border_military')).toBe(true);
    });
  });

  describe('follow-up: evt_border_campaign_victory (notification)', () => {
    const DEF_ID = 'evt_border_campaign_victory';

    it('exists in FOLLOW_UP_POOL as Informational notification', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Informational);
      expect(def!.classification).toBe('notification');
      expect(def!.choices[0].choiceId).toBe('acknowledge');
    });

    it('has diplomacy deltas in effects', () => {
      const effects = EVENT_CHOICE_EFFECTS[DEF_ID];
      expect(effects.acknowledge.diplomacyDeltas).toBeDefined();
    });

    it('generates notification card', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Informational,
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      expect(classifyEventRole(active)).toBe('notification');
      const cards = generateNotificationCards([active]);
      expect(cards).toHaveLength(1);
      expect(cards[0].title).toBe('Campaign Victory');
    });
  });

  describe('follow-up: evt_border_campaign_defeat (crisis)', () => {
    const DEF_ID = 'evt_border_campaign_defeat';

    it('exists as Critical with 3 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Critical);
      expect(def!.choices).toHaveLength(3);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'rally_defense',
        'sue_for_peace',
        'scorched_earth',
      ]);
    });

    it('classifies as crisis and generates crisis card', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Critical,
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      expect(classifyEventRole(active)).toBe('crisis');
      const crisisData = generateCrisisPhaseData(active);
      expect(crisisData.crisisCard.title).toBe('Campaign Defeated');
      expect(crisisData.responses).toHaveLength(3);
    });
  });

  describe('follow-up: evt_border_envoy_hostage (crisis)', () => {
    const DEF_ID = 'evt_border_envoy_hostage';

    it('exists as Serious with 3 choices including a free action', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Serious);
      expect(def!.choices).toHaveLength(3);
      const freeChoice = def!.choices.find((c) => c.choiceId === 'abandon_envoy');
      expect(freeChoice).toBeDefined();
      expect(freeChoice!.isFree).toBe(true);
      expect(freeChoice!.slotCost).toBe(0);
    });

    it('is scheduled from send_diplomatic_envoy with probability 0.5', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'send_diplomatic_envoy',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const match = result.find((f) => f.definitionId === DEF_ID);
      expect(match).toBeDefined();
      expect(match!.probability).toBe(0.5);
    });
  });

  describe('follow-up: evt_border_envoy_terms (petition)', () => {
    const DEF_ID = 'evt_border_envoy_terms';

    it('exists as Notable (petition) with 2 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Notable);
      expect(def!.choices).toHaveLength(2);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'accept_unfavorable_terms',
        'reject_terms',
      ]);
    });

    it('classifies as petition', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Notable,
      });
      expect(classifyEventRole(active)).toBe('petition');
    });
  });

  describe('follow-up: evt_border_campaign_stalemate (petition)', () => {
    const DEF_ID = 'evt_border_campaign_stalemate';

    it('exists as Notable with 2 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Notable);
      expect(def!.choices).toHaveLength(2);
    });
  });

  describe('fortify_and_absorb branch', () => {
    it('schedules 3 follow-ups with shared exclusive group', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'fortify_and_absorb',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const fortifyFollowUps = result.filter((f) =>
        ['evt_border_fortify_holds', 'evt_border_fortify_famine', 'evt_border_fortify_resentment'].includes(f.definitionId),
      );
      expect(fortifyFollowUps).toHaveLength(3);
      const groups = new Set(fortifyFollowUps.map((f) => f.exclusiveGroupId));
      expect(groups.size).toBe(1);
      expect(groups.has('excl_border_fortify')).toBe(true);
    });
  });

  describe('data completeness', () => {
    const ALL_BORDER_IDS = [
      'evt_border_incursion_root',
      'evt_border_campaign_victory',
      'evt_border_campaign_stalemate',
      'evt_border_campaign_defeat',
      'evt_border_envoy_success',
      'evt_border_envoy_hostage',
      'evt_border_envoy_terms',
      'evt_border_fortify_holds',
      'evt_border_fortify_famine',
      'evt_border_fortify_resentment',
    ];

    it('all 10 events have effects entries', () => {
      for (const id of ALL_BORDER_IDS) {
        expect(EVENT_CHOICE_EFFECTS[id], `Missing effects for ${id}`).toBeDefined();
      }
    });

    it('all 10 events have text entries', () => {
      for (const id of ALL_BORDER_IDS) {
        expect(EVENT_TEXT[id], `Missing text for ${id}`).toBeDefined();
        expect(EVENT_TEXT[id].title, `Missing title for ${id}`).toBeTruthy();
        expect(EVENT_TEXT[id].body, `Missing body for ${id}`).toBeTruthy();
      }
    });

    it('every choice in every event has matching effect and text', () => {
      for (const id of ALL_BORDER_IDS) {
        const def = ALL_DEFINITIONS.find((e) => e.id === id);
        expect(def, `Missing definition for ${id}`).toBeDefined();
        for (const choice of def!.choices) {
          expect(
            EVENT_CHOICE_EFFECTS[id]?.[choice.choiceId],
            `Missing effect for ${id}.${choice.choiceId}`,
          ).toBeDefined();
          expect(
            EVENT_TEXT[id]?.choices?.[choice.choiceId],
            `Missing text for ${id}.${choice.choiceId}`,
          ).toBeTruthy();
        }
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Chain 1: Grain Crisis (12 events — most complex, depth 4, all event types)
// ---------------------------------------------------------------------------

describe('Production chain: Grain Crisis', () => {
  const ROOT_ID = 'evt_grain_crisis_root';

  describe('root event', () => {
    it('exists in EVENT_POOL with Serious severity and 3 choices', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Serious);
      expect(def!.choices).toHaveLength(3);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'ration_strictly',
        'import_grain',
        'seize_noble_reserves',
      ]);
    });

    it('classifies as crisis (Serious severity)', () => {
      const active = makeActiveEvent({ definitionId: ROOT_ID, severity: EventSeverity.Serious });
      expect(classifyEventRole(active)).toBe('crisis');
    });

    it('generates crisis card with correct title and 3 responses', () => {
      const active = makeActiveEvent({
        definitionId: ROOT_ID,
        severity: EventSeverity.Serious,
      });
      const crisisData = generateCrisisPhaseData(active);
      expect(crisisData.crisisCard.title).toBe('Grain Crisis');
      expect(crisisData.responses).toHaveLength(3);
    });

    it('has effects for all choices', () => {
      const effects = EVENT_CHOICE_EFFECTS[ROOT_ID];
      expect(effects).toBeDefined();
      expect(effects.ration_strictly).toBeDefined();
      expect(effects.import_grain).toBeDefined();
      expect(effects.seize_noble_reserves).toBeDefined();
    });

    it('has text entries for all choices', () => {
      const text = EVENT_TEXT[ROOT_ID];
      expect(text).toBeDefined();
      expect(text.title).toBe('Grain Crisis');
      expect(text.body).toBeTruthy();
      expect(text.choices.ration_strictly).toBeTruthy();
      expect(text.choices.import_grain).toBeTruthy();
      expect(text.choices.seize_noble_reserves).toBeTruthy();
    });

    it('has 8 follow-up entries across 3 branches', () => {
      const def = EVENT_POOL.find((e) => e.id === ROOT_ID);
      expect(def!.followUpEvents).toHaveLength(8);
    });
  });

  describe('ration_strictly branch scheduling', () => {
    it('schedules 3 rationing follow-ups with shared exclusive group', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'ration_strictly',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const rationFollowUps = result.filter((f) =>
        ['evt_grain_ration_compliance', 'evt_grain_ration_riots', 'evt_grain_ration_black_market'].includes(f.definitionId),
      );
      expect(rationFollowUps).toHaveLength(3);
      const groups = new Set(rationFollowUps.map((f) => f.exclusiveGroupId));
      expect(groups.size).toBe(1);
      expect(groups.has('excl_grain_ration')).toBe(true);
    });
  });

  describe('follow-up: evt_grain_ration_compliance (notification)', () => {
    const DEF_ID = 'evt_grain_ration_compliance';

    it('exists in FOLLOW_UP_POOL as notification', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Informational);
      expect(def!.classification).toBe('notification');
      expect(def!.choices[0].choiceId).toBe('acknowledge');
    });

    it('has effects and text', () => {
      expect(EVENT_CHOICE_EFFECTS[DEF_ID].acknowledge).toBeDefined();
      expect(EVENT_TEXT[DEF_ID].title).toBe('Rationing Holds');
    });
  });

  describe('follow-up: evt_grain_ration_riots (crisis)', () => {
    const DEF_ID = 'evt_grain_ration_riots';

    it('exists as Serious with 3 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Serious);
      expect(def!.choices).toHaveLength(3);
    });

    it('classifies as crisis', () => {
      const active = makeActiveEvent({ definitionId: DEF_ID, severity: EventSeverity.Serious });
      expect(classifyEventRole(active)).toBe('crisis');
    });
  });

  describe('follow-up: evt_grain_ration_black_market (petition)', () => {
    const DEF_ID = 'evt_grain_ration_black_market';

    it('exists as Notable with 2 choices (petition)', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Notable);
      expect(def!.choices).toHaveLength(2);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'legalize_grey_market',
        'crack_down_market',
      ]);
    });

    it('classifies as petition', () => {
      const active = makeActiveEvent({ definitionId: DEF_ID, severity: EventSeverity.Notable });
      expect(classifyEventRole(active)).toBe('petition');
    });
  });

  describe('follow-up: evt_grain_import_spoiled (critical crisis)', () => {
    const DEF_ID = 'evt_grain_import_spoiled';

    it('exists as Critical with 3 choices including free action', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Critical);
      expect(def!.choices).toHaveLength(3);
      const freeChoice = def!.choices.find((c) => c.choiceId === 'distribute_what_remains');
      expect(freeChoice).toBeDefined();
      expect(freeChoice!.isFree).toBe(true);
    });

    it('is scheduled from import_grain with probability 0.4', () => {
      const resolved = makeActiveEvent({
        definitionId: ROOT_ID,
        isResolved: true,
        choiceMade: 'import_grain',
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
      const match = result.find((f) => f.definitionId === DEF_ID);
      expect(match).toBeDefined();
      expect(match!.probability).toBe(0.4);
      expect(match!.delayTurns).toBe(3);
    });
  });

  describe('depth-4: evt_grain_noble_plot (intermediate follow-up)', () => {
    const DEF_ID = 'evt_grain_noble_plot';

    it('exists in FOLLOW_UP_POOL with its own followUpEvents array', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Serious);
      expect(def!.choices).toHaveLength(3);
      expect(def!.followUpEvents).toBeDefined();
      expect(def!.followUpEvents!.length).toBeGreaterThanOrEqual(3);
    });

    it('schedules depth-4 follow-ups when resolved with arrest_ringleaders', () => {
      const resolved = makeActiveEvent({
        definitionId: DEF_ID,
        isResolved: true,
        choiceMade: 'arrest_ringleaders',
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 5);
      const arrestFollowUps = result.filter((f) =>
        ['evt_grain_noble_uprising', 'evt_grain_noble_cowed'].includes(f.definitionId),
      );
      expect(arrestFollowUps).toHaveLength(2);
      const groups = new Set(arrestFollowUps.map((f) => f.exclusiveGroupId));
      expect(groups.size).toBe(1);
      expect(groups.has('excl_grain_noble_arrest')).toBe(true);
    });

    it('schedules depth-4 follow-up when resolved with negotiate_concessions', () => {
      const resolved = makeActiveEvent({
        definitionId: DEF_ID,
        isResolved: true,
        choiceMade: 'negotiate_concessions',
        isFollowUp: true,
        followUpSourceId: ROOT_ID,
      });
      const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 5);
      const match = result.find((f) => f.definitionId === 'evt_grain_noble_concessions_result');
      expect(match).toBeDefined();
      expect(match!.probability).toBe(1.0);
    });
  });

  describe('depth-4: evt_grain_noble_uprising (terminal crisis)', () => {
    const DEF_ID = 'evt_grain_noble_uprising';

    it('exists as Critical with 3 choices', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Critical);
      expect(def!.choices).toHaveLength(3);
      expect(def!.choices.map((c) => c.choiceId)).toEqual([
        'crush_uprising',
        'negotiate_surrender',
        'offer_amnesty',
      ]);
    });

    it('classifies as crisis and generates crisis card', () => {
      const active = makeActiveEvent({
        definitionId: DEF_ID,
        severity: EventSeverity.Critical,
        isFollowUp: true,
        followUpSourceId: 'evt_grain_noble_plot',
      });
      expect(classifyEventRole(active)).toBe('crisis');
      const crisisData = generateCrisisPhaseData(active);
      expect(crisisData.crisisCard.title).toBe('Armed Noble Uprising');
      expect(crisisData.responses).toHaveLength(3);
    });
  });

  describe('depth-4: evt_grain_noble_cowed (terminal notification)', () => {
    const DEF_ID = 'evt_grain_noble_cowed';

    it('exists as Informational notification', () => {
      const def = FOLLOW_UP_POOL.find((e) => e.id === DEF_ID);
      expect(def).toBeDefined();
      expect(def!.severity).toBe(EventSeverity.Informational);
      expect(def!.classification).toBe('notification');
    });

    it('has effects and text', () => {
      expect(EVENT_CHOICE_EFFECTS[DEF_ID].acknowledge).toBeDefined();
      expect(EVENT_TEXT[DEF_ID].title).toBe('Nobility Falls in Line');
    });
  });

  describe('data completeness', () => {
    const ALL_GRAIN_IDS = [
      'evt_grain_crisis_root',
      'evt_grain_ration_compliance',
      'evt_grain_ration_riots',
      'evt_grain_ration_black_market',
      'evt_grain_import_merchant_leverage',
      'evt_grain_import_gratitude',
      'evt_grain_import_spoiled',
      'evt_grain_noble_plot',
      'evt_grain_noble_acceptance',
      'evt_grain_noble_concessions_result',
      'evt_grain_noble_uprising',
      'evt_grain_noble_cowed',
    ];

    it('all 12 events have effects entries', () => {
      for (const id of ALL_GRAIN_IDS) {
        expect(EVENT_CHOICE_EFFECTS[id], `Missing effects for ${id}`).toBeDefined();
      }
    });

    it('all 12 events have text entries', () => {
      for (const id of ALL_GRAIN_IDS) {
        expect(EVENT_TEXT[id], `Missing text for ${id}`).toBeDefined();
        expect(EVENT_TEXT[id].title, `Missing title for ${id}`).toBeTruthy();
        expect(EVENT_TEXT[id].body, `Missing body for ${id}`).toBeTruthy();
      }
    });

    it('every choice has matching effect and text', () => {
      for (const id of ALL_GRAIN_IDS) {
        const def = ALL_DEFINITIONS.find((e) => e.id === id);
        expect(def, `Missing definition for ${id}`).toBeDefined();
        for (const choice of def!.choices) {
          expect(
            EVENT_CHOICE_EFFECTS[id]?.[choice.choiceId],
            `Missing effect for ${id}.${choice.choiceId}`,
          ).toBeDefined();
          expect(
            EVENT_TEXT[id]?.choices?.[choice.choiceId],
            `Missing text for ${id}.${choice.choiceId}`,
          ).toBeTruthy();
        }
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Cross-chain validation and negative paths
// ---------------------------------------------------------------------------

describe('Production chains: cross-chain validation', () => {
  const ALL_ROOT_IDS = [
    'evt_grain_crisis_root',
    'evt_faith_schism_root',
    'evt_plague_outbreak_root',
    'evt_border_incursion_root',
    'evt_trade_route_disruption_root',
    'evt_military_mutiny_root',
    'evt_succession_anxiety_root',
    'evt_commoner_uprising_root',
    'evt_merchant_guild_demands_root',
    'evt_foreign_ambassador_root',
    'evt_treasury_audit_root',
    'evt_infrastructure_decay_root',
  ];

  it('all 12 root events exist in EVENT_POOL', () => {
    for (const id of ALL_ROOT_IDS) {
      const def = EVENT_POOL.find((e) => e.id === id);
      expect(def, `Missing root event ${id} in EVENT_POOL`).toBeDefined();
    }
  });

  it('all 12 root events have followUpEvents arrays', () => {
    for (const id of ALL_ROOT_IDS) {
      const def = EVENT_POOL.find((e) => e.id === id);
      expect(def!.followUpEvents, `Missing followUpEvents for ${id}`).toBeDefined();
      expect(def!.followUpEvents!.length, `Empty followUpEvents for ${id}`).toBeGreaterThan(0);
    }
  });

  it('all follow-up definitions referenced by roots exist in FOLLOW_UP_POOL', () => {
    for (const id of ALL_ROOT_IDS) {
      const def = EVENT_POOL.find((e) => e.id === id);
      for (const fu of def!.followUpEvents!) {
        const fuDef = FOLLOW_UP_POOL.find((e) => e.id === fu.followUpDefinitionId);
        expect(
          fuDef,
          `Root ${id} references ${fu.followUpDefinitionId} but it's not in FOLLOW_UP_POOL`,
        ).toBeDefined();
      }
    }
  });

  it('all FOLLOW_UP_POOL events use triggerConditions: always', () => {
    for (const def of FOLLOW_UP_POOL) {
      // Skip pre-existing follow-ups that may have different conditions
      if (!ALL_ROOT_IDS.some((rootId) => {
        const rootDef = EVENT_POOL.find((e) => e.id === rootId);
        return rootDef?.followUpEvents?.some((fu) => fu.followUpDefinitionId === def.id);
      })) {
        // Also check intermediate follow-ups
        const isIntermediate = FOLLOW_UP_POOL.some((parent) =>
          parent.followUpEvents?.some((fu) => fu.followUpDefinitionId === def.id),
        );
        if (!isIntermediate) continue;
      }
      const alwaysCond = def.triggerConditions.find((c) => c.type === 'always');
      expect(
        alwaysCond,
        `Follow-up ${def.id} should have triggerConditions: [{ type: 'always' }]`,
      ).toBeDefined();
    }
  });

  it('petition events (Notable) have exactly 2 choices', () => {
    for (const id of ALL_ROOT_IDS) {
      const rootDef = EVENT_POOL.find((e) => e.id === id);
      if (rootDef!.severity === EventSeverity.Notable) {
        expect(
          rootDef!.choices.length,
          `Petition root ${id} should have exactly 2 choices`,
        ).toBe(2);
      }
      // Check follow-ups too
      for (const fu of rootDef!.followUpEvents!) {
        const fuDef = FOLLOW_UP_POOL.find((e) => e.id === fu.followUpDefinitionId);
        if (fuDef && fuDef.severity === EventSeverity.Notable) {
          expect(
            fuDef.choices.length,
            `Petition follow-up ${fu.followUpDefinitionId} should have exactly 2 choices`,
          ).toBe(2);
        }
      }
    }
  });

  it('notification events have exactly 1 acknowledge choice', () => {
    for (const id of ALL_ROOT_IDS) {
      const rootDef = EVENT_POOL.find((e) => e.id === id);
      for (const fu of rootDef!.followUpEvents!) {
        const fuDef = FOLLOW_UP_POOL.find((e) => e.id === fu.followUpDefinitionId);
        if (fuDef?.classification === 'notification') {
          expect(
            fuDef.choices.length,
            `Notification ${fu.followUpDefinitionId} should have exactly 1 choice`,
          ).toBe(1);
          expect(fuDef.choices[0].choiceId).toBe('acknowledge');
          expect(fuDef.choices[0].isFree).toBe(true);
          expect(fuDef.choices[0].slotCost).toBe(0);
        }
      }
    }
  });
});

describe('Production chains: negative paths', () => {
  it('wrong parent choice does not schedule grain follow-ups', () => {
    const resolved = makeActiveEvent({
      definitionId: 'evt_grain_crisis_root',
      isResolved: true,
      choiceMade: 'ration_strictly',
    });
    const result = scheduleFollowUps([], resolved, ALL_DEFINITIONS, 1);
    // Should NOT schedule import or seizure branch follow-ups
    const importFollowUps = result.filter((f) => f.definitionId === 'evt_grain_import_merchant_leverage');
    expect(importFollowUps).toHaveLength(0);
    const seizureFollowUps = result.filter((f) => f.definitionId === 'evt_grain_noble_plot');
    expect(seizureFollowUps).toHaveLength(0);
  });

  it('unresolved event does not schedule follow-ups', () => {
    const unresolved = makeActiveEvent({
      definitionId: 'evt_border_incursion_root',
      isResolved: false,
      choiceMade: null,
    });
    const result = scheduleFollowUps([], unresolved, ALL_DEFINITIONS, 1);
    expect(result).toHaveLength(0);
  });

  it('follow-up does not surface before delay expires', () => {
    const pending = [{
      id: 'fu-test-early-grain',
      definitionId: 'evt_grain_ration_compliance',
      sourceEventId: 'evt_grain_crisis_root',
      triggerChoiceId: 'ration_strictly',
      triggerTurn: 1,
      delayTurns: 2,
      probability: 1.0,
      stateRetries: 0,
      exclusiveGroupId: 'excl_grain_ration',
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

  it('probability roll failure prevents surfacing', () => {
    // probability: 0 guarantees discard under seeded RNG — any roll > 0 fails the gate.
    const pending = [{
      id: 'fu-test-prob-fail',
      definitionId: 'evt_infra_bridge_collapse',
      sourceEventId: 'evt_infrastructure_decay_root',
      triggerChoiceId: 'defer_maintenance',
      triggerTurn: 1,
      delayTurns: 3,
      probability: 0,
      stateRetries: 0,
      exclusiveGroupId: 'excl_infra_defer',
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
});
