// Workstream A — Task A4: Assessment Card Definitions
// 6 assessment events using EventSeverity.Notable.
// Assessments present ambiguous intelligence — the player chooses a posture
// (investigate, hedge, or ignore) rather than a direct action.

import type { EventDefinition } from '../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
} from '../../engine/types';

export const ASSESSMENT_POOL: EventDefinition[] = [
  {
    id: 'assess_border_movement',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_border_movement', slotCost: 1, isFree: false },
      { choiceId: 'reinforce_preemptively', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_border_reports', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'assess_spy_report_unverified',
    severity: EventSeverity.Notable,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'verify_intelligence', slotCost: 1, isFree: false },
      { choiceId: 'act_on_report', slotCost: 1, isFree: false },
      { choiceId: 'file_away_report', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'assess_diplomatic_signal',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reciprocate_overture', slotCost: 1, isFree: false },
      { choiceId: 'investigate_intent', slotCost: 1, isFree: false },
      { choiceId: 'ignore_signal', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'assess_internal_unrest_rumor',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 55 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_unrest_rumor', slotCost: 1, isFree: false },
      { choiceId: 'preemptive_concession', slotCost: 1, isFree: false },
      { choiceId: 'monitor_quietly', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'assess_foreign_famine',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'food_above', threshold: 200 },
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'send_humanitarian_aid', slotCost: 1, isFree: false },
      { choiceId: 'exploit_weakness', slotCost: 1, isFree: false },
      { choiceId: 'observe_from_distance', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'assess_religious_movement',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 25 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_movement', slotCost: 1, isFree: false },
      { choiceId: 'suppress_early', slotCost: 1, isFree: false },
      { choiceId: 'allow_to_grow', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];
