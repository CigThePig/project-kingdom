// Phase 7 — Wave-2 Crisis Events: Religious Flashpoints.
//
// Five faith-axis crises exploring heterodoxy, schism, and popular piety.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_RELIGIOUS_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_religious_schism',
    severity: EventSeverity.Critical,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 35 },
      { type: 'turn_range', minTurn: 8 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'back_the_orthodox_hierarchy', slotCost: 1, isFree: false },
      { choiceId: 'recognize_both_confessions', slotCost: 1, isFree: false },
      { choiceId: 'call_a_reconciliation_council', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'back_the_orthodox_hierarchy', followUpDefinitionId: 'evt_fu_schism_reformer_revolt', delayTurns: 3, probability: 0.7 },
      { triggerChoiceId: 'recognize_both_confessions', followUpDefinitionId: 'evt_fu_schism_parallel_churches', delayTurns: 4, probability: 0.7 },
    ],
  },
  {
    id: 'evt_exp_w2_heretical_sermon',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 15 },
      { type: 'random_chance', probability: 0.2 },
      { type: 'turn_range', minTurn: 3 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'silence_the_preacher', slotCost: 1, isFree: false },
      { choiceId: 'debate_him_publicly', slotCost: 1, isFree: false },
      { choiceId: 'ignore_the_crowd', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_prophet_appears',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.12 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invite_to_the_cathedral', slotCost: 1, isFree: false },
      { choiceId: 'confine_to_a_monastery', slotCost: 1, isFree: false },
      { choiceId: 'denounce_as_false', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_saints_succession',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.14 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'endorse_the_royal_candidate', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_the_conclave', slotCost: 0, isFree: true },
      { choiceId: 'pressure_for_a_reformer', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_witch_trial',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'heterodoxy_above', threshold: 10 },
      { type: 'random_chance', probability: 0.18 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'allow_the_trial', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_the_accusations', slotCost: 1, isFree: false },
      { choiceId: 'reassign_accused_to_pilgrimage', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_RELIGIOUS_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_religious_schism: {
    back_the_orthodox_hierarchy: {
      clergySatDelta: 5,
      heterodoxyDelta: -3,
      commonerSatDelta: -3,
      stabilityDelta: -2,
      regionConditionDelta: -1,
    },
    recognize_both_confessions: {
      culturalCohesionDelta: -3,
      heterodoxyDelta: 2,
      stabilityDelta: 3,
      clergySatDelta: -2,
      regionConditionDelta: +1,
    },
    call_a_reconciliation_council: {
      treasuryDelta: -50,
      clergySatDelta: 3,
      heterodoxyDelta: -2,
      culturalCohesionDelta: 2,
      regionDevelopmentDelta: +1,
    },
  },
  evt_exp_w2_heretical_sermon: {
    silence_the_preacher: {
      heterodoxyDelta: -2,
      stabilityDelta: -2,
      commonerSatDelta: -3,
    },
    debate_him_publicly: {
      heterodoxyDelta: 1,
      culturalCohesionDelta: 2,
      clergySatDelta: 2,
    },
    ignore_the_crowd: {
      heterodoxyDelta: 3,
      stabilityDelta: -1,
    },
  },
  evt_exp_w2_prophet_appears: {
    invite_to_the_cathedral: {
      faithDelta: 4,
      commonerSatDelta: 3,
      heterodoxyDelta: 1,
      clergySatDelta: -2,
      treasuryDelta: -20,
    },
    confine_to_a_monastery: {
      clergySatDelta: 3,
      commonerSatDelta: -3,
      heterodoxyDelta: 2,
    },
    denounce_as_false: {
      clergySatDelta: 2,
      heterodoxyDelta: 4,
      stabilityDelta: -3,
    },
  },
  evt_exp_w2_saints_succession: {
    endorse_the_royal_candidate: {
      clergySatDelta: 2,
      faithDelta: 2,
      nobilitySatDelta: 2,
      heterodoxyDelta: 1,
    },
    defer_to_the_conclave: {
      clergySatDelta: 3,
      faithDelta: 1,
    },
    pressure_for_a_reformer: {
      clergySatDelta: -3,
      heterodoxyDelta: -3,
      commonerSatDelta: 3,
    },
  },
  evt_exp_w2_witch_trial: {
    allow_the_trial: {
      commonerSatDelta: -3,
      stabilityDelta: 1,
      heterodoxyDelta: -2,
      clergySatDelta: 2,
    },
    dismiss_the_accusations: {
      commonerSatDelta: 2,
      clergySatDelta: -3,
      heterodoxyDelta: 2,
    },
    reassign_accused_to_pilgrimage: {
      treasuryDelta: -20,
      commonerSatDelta: 1,
      clergySatDelta: 1,
      heterodoxyDelta: -1,
    },
  },
};
