// Phase 7 — Wave-2 Petitions: Religious Orders.
//
// Six petitions from religious orders, militant brotherhoods, and mendicant
// houses.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_RELIGIOUS_PETITIONS: EventDefinition[] = [
  {
    id: 'faction_req_w2_mendicant_order_charter',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'charter_the_mendicants', slotCost: 0, isFree: true },
      { choiceId: 'refer_to_the_bishop', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_militant_brotherhood',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 12 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_the_brotherhood', slotCost: 0, isFree: true },
      { choiceId: 'decline_militant_funding', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_pilgrim_road_petition',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'found_the_pilgrim_road', slotCost: 0, isFree: true },
      { choiceId: 'reject_pilgrim_road', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_abbey_tax_exemption',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 50 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_the_exemption', slotCost: 0, isFree: true },
      { choiceId: 'refuse_the_exemption', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_RELIGIOUS_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  faction_req_w2_mendicant_order_charter: {
    charter_the_mendicants: {
      clergySatDelta: 3,
      heterodoxyDelta: -2,
      commonerSatDelta: 2,
    },
    refer_to_the_bishop: {
      clergySatDelta: -2,
      heterodoxyDelta: 1,
    },
  },
  faction_req_w2_militant_brotherhood: {
    fund_the_brotherhood: {
      treasuryDelta: -30,
      heterodoxyDelta: -3,
      clergySatDelta: 4,
      commonerSatDelta: -2,
    },
    decline_militant_funding: {
      clergySatDelta: -3,
      heterodoxyDelta: 2,
    },
  },
  faction_req_w2_pilgrim_road_petition: {
    found_the_pilgrim_road: {
      treasuryDelta: -25,
      clergySatDelta: 3,
      merchantSatDelta: 2,
      faithDelta: 2,
    },
    reject_pilgrim_road: {
      clergySatDelta: -3,
      faithDelta: -1,
    },
  },
  faction_req_w2_abbey_tax_exemption: {
    grant_the_exemption: {
      clergySatDelta: 5,
      treasuryDelta: -20,
      nobilitySatDelta: -2,
    },
    refuse_the_exemption: {
      clergySatDelta: -4,
      treasuryDelta: 10,
    },
  },
};
