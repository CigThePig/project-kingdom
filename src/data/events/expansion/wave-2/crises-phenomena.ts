// Phase 7 — Wave-2 Crisis Events: Strange Phenomena.
//
// Four crises exploring folk belief, drought pressure, ruin discovery, and a
// succession dispute in a vassal house.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_PHENOMENA_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_strange_phenomenon',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'declare_it_a_miracle', slotCost: 1, isFree: false },
      { choiceId: 'call_it_a_trick_of_light', slotCost: 0, isFree: true },
      { choiceId: 'commission_scholars', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_drought_escalation',
    severity: EventSeverity.Serious,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'food_below', threshold: 80 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'dig_emergency_wells', slotCost: 1, isFree: false },
      { choiceId: 'ration_water_strictly', slotCost: 1, isFree: false },
      { choiceId: 'lead_a_rain_procession', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_explored_ruins',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.13 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_a_scholarly_expedition', slotCost: 1, isFree: false },
      { choiceId: 'strip_for_building_stone', slotCost: 1, isFree: false },
      { choiceId: 'seal_the_entrance', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_vassal_succession',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 7 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'confirm_the_elder_heir', slotCost: 1, isFree: false },
      { choiceId: 'back_the_capable_younger', slotCost: 1, isFree: false },
      { choiceId: 'take_the_fief_in_hand', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_PHENOMENA_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_strange_phenomenon: {
    declare_it_a_miracle: {
      faithDelta: 4,
      commonerSatDelta: 3,
      heterodoxyDelta: 1,
    },
    call_it_a_trick_of_light: {
      faithDelta: -2,
      commonerSatDelta: -2,
      culturalCohesionDelta: 1,
    },
    commission_scholars: {
      treasuryDelta: -30,
      clergySatDelta: 2,
      culturalCohesionDelta: 2,
    },
  },
  evt_exp_w2_drought_escalation: {
    dig_emergency_wells: {
      treasuryDelta: -50,
      foodDelta: 10,
      commonerSatDelta: 3,
      regionConditionDelta: 2,
    },
    ration_water_strictly: {
      foodDelta: -10,
      commonerSatDelta: -4,
      stabilityDelta: -1,
      regionConditionDelta: -1,
    },
    lead_a_rain_procession: {
      faithDelta: 3,
      clergySatDelta: 3,
      commonerSatDelta: 2,
      foodDelta: -5,
      regionConditionDelta: +1,
    },
  },
  evt_exp_w2_explored_ruins: {
    fund_a_scholarly_expedition: {
      treasuryDelta: -40,
      culturalCohesionDelta: 3,
      clergySatDelta: 3,
    },
    strip_for_building_stone: {
      treasuryDelta: 30,
      regionDevelopmentDelta: 3,
      culturalCohesionDelta: -3,
      faithDelta: -1,
    },
    seal_the_entrance: {
      stabilityDelta: 1,
      heterodoxyDelta: 1,
    },
  },
  evt_exp_w2_vassal_succession: {
    confirm_the_elder_heir: {
      nobilitySatDelta: 3,
      stabilityDelta: 2,
    },
    back_the_capable_younger: {
      nobilitySatDelta: -2,
      regionConditionDelta: 3,
      stabilityDelta: 1,
    },
    take_the_fief_in_hand: {
      treasuryDelta: 30,
      nobilitySatDelta: -5,
      stabilityDelta: -2,
    },
  },
};
