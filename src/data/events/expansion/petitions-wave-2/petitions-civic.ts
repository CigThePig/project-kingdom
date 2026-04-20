// Phase 7 — Wave-2 Petitions: Civic & Regional.
//
// Six petitions from lords, peasants, scholars, and envoys.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_CIVIC_PETITIONS: EventDefinition[] = [
  {
    id: 'faction_req_w2_scholarly_society',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'charter_the_society', slotCost: 0, isFree: true },
      { choiceId: 'refuse_the_charter', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_regional_lords_road',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_the_royal_road', slotCost: 0, isFree: true },
      { choiceId: 'defer_the_road', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_displaced_peasants',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'resettle_on_crown_land', slotCost: 0, isFree: true },
      { choiceId: 'return_to_their_lords', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_foreign_envoy',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 3 },
      { type: 'random_chance', probability: 0.18 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_the_envoys_audience', slotCost: 0, isFree: true },
      { choiceId: 'make_the_envoy_wait', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_imprisoned_nobles',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 45 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'release_with_amnesty', slotCost: 0, isFree: true },
      { choiceId: 'hold_them_longer', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_bridge_petition',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 55 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'authorize_the_bridge', slotCost: 0, isFree: true },
      { choiceId: 'wait_for_better_weather', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_CIVIC_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  faction_req_w2_scholarly_society: {
    charter_the_society: {
      clergySatDelta: 4,
      culturalCohesionDelta: 2,
      treasuryDelta: -15,
    },
    refuse_the_charter: {
      clergySatDelta: -3,
      culturalCohesionDelta: -1,
    },
  },
  faction_req_w2_regional_lords_road: {
    fund_the_royal_road: {
      nobilitySatDelta: 4,
      treasuryDelta: -40,
      regionDevelopmentDelta: 3,
    },
    defer_the_road: {
      nobilitySatDelta: -4,
      stabilityDelta: -1,
    },
  },
  faction_req_w2_displaced_peasants: {
    resettle_on_crown_land: {
      commonerSatDelta: 4,
      treasuryDelta: -30,
      nobilitySatDelta: -2,
    },
    return_to_their_lords: {
      commonerSatDelta: -4,
      nobilitySatDelta: 3,
    },
  },
  faction_req_w2_foreign_envoy: {
    grant_the_envoys_audience: {
      nobilitySatDelta: 2,
      culturalCohesionDelta: 1,
      diplomacyDeltas: { __NEIGHBOR__: +3 },
    },
    make_the_envoy_wait: {
      nobilitySatDelta: -2,
      stabilityDelta: -1,
      diplomacyDeltas: { __NEIGHBOR__: -3 },
    },
  },
  faction_req_w2_imprisoned_nobles: {
    release_with_amnesty: {
      nobilitySatDelta: 5,
      commonerSatDelta: -3,
      stabilityDelta: 1,
    },
    hold_them_longer: {
      nobilitySatDelta: -4,
      stabilityDelta: 1,
      commonerSatDelta: 2,
    },
  },
  faction_req_w2_bridge_petition: {
    authorize_the_bridge: {
      commonerSatDelta: 3,
      merchantSatDelta: 2,
      regionDevelopmentDelta: 3,
      treasuryDelta: -30,
    },
    wait_for_better_weather: {
      commonerSatDelta: -2,
    },
  },
};
