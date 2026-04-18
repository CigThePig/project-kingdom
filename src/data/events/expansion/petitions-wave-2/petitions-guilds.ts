// Phase 7 — Wave-2 Petitions: Guild & Trade.
//
// Six petitions from guilds, trade bodies, and artisan orders.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_GUILD_PETITIONS: EventDefinition[] = [
  {
    id: 'faction_req_w2_merchant_tariff_reform',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 50 },
      { type: 'turn_range', minTurn: 3 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reform_the_tariffs', slotCost: 0, isFree: true },
      { choiceId: 'defer_the_petition', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_miners_charter',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 48 },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_the_miners_charter', slotCost: 0, isFree: true },
      { choiceId: 'refuse_the_charter', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_fishermens_protection',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 50 },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_coastal_patrols', slotCost: 0, isFree: true },
      { choiceId: 'decline_patrol_request', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_carpenters_price_cap',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 45 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'cap_the_timber_prices', slotCost: 0, isFree: true },
      { choiceId: 'leave_prices_to_market', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_millers_tax_relief',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_millers_relief', slotCost: 0, isFree: true },
      { choiceId: 'maintain_the_mill_tax', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_goldsmiths_seal',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 55 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_the_goldsmith_seal', slotCost: 0, isFree: true },
      { choiceId: 'refuse_monopoly', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_GUILD_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  faction_req_w2_merchant_tariff_reform: {
    reform_the_tariffs: {
      merchantSatDelta: 6,
      treasuryDelta: -30,
      commonerSatDelta: 2,
    },
    defer_the_petition: {
      merchantSatDelta: -5,
      stabilityDelta: -1,
    },
  },
  faction_req_w2_miners_charter: {
    grant_the_miners_charter: {
      commonerSatDelta: 5,
      nobilitySatDelta: -3,
      regionConditionDelta: 2,
    },
    refuse_the_charter: {
      commonerSatDelta: -4,
      nobilitySatDelta: 2,
    },
  },
  faction_req_w2_fishermens_protection: {
    fund_coastal_patrols: {
      treasuryDelta: -30,
      commonerSatDelta: 4,
      militaryReadinessDelta: 1,
    },
    decline_patrol_request: {
      commonerSatDelta: -4,
      stabilityDelta: -1,
    },
  },
  faction_req_w2_carpenters_price_cap: {
    cap_the_timber_prices: {
      commonerSatDelta: 3,
      merchantSatDelta: -4,
    },
    leave_prices_to_market: {
      merchantSatDelta: 3,
      commonerSatDelta: -3,
    },
  },
  faction_req_w2_millers_tax_relief: {
    grant_millers_relief: {
      commonerSatDelta: 4,
      treasuryDelta: -20,
    },
    maintain_the_mill_tax: {
      commonerSatDelta: -3,
      treasuryDelta: 15,
    },
  },
  faction_req_w2_goldsmiths_seal: {
    grant_the_goldsmith_seal: {
      merchantSatDelta: 5,
      treasuryDelta: 20,
      commonerSatDelta: -2,
    },
    refuse_monopoly: {
      merchantSatDelta: -3,
      commonerSatDelta: 2,
    },
  },
};
