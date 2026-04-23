// Phase 7 — Wave-2 Crisis Events: Social Tensions.
//
// Four class-conflict and commoner-pressure crises.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_SOCIAL_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_food_riot_escalation',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'food_below', threshold: 40 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'open_the_royal_granaries', slotCost: 1, isFree: false },
      { choiceId: 'post_guards_at_the_markets', slotCost: 1, isFree: false },
      { choiceId: 'hang_the_ringleaders', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_bonded_labor_revolt',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
      { type: 'turn_range', minTurn: 7 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crush_with_the_levy', slotCost: 1, isFree: false },
      { choiceId: 'grant_limited_emancipation', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_better_terms', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_mercenary_defection',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 40 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'match_the_foreign_wages', slotCost: 1, isFree: false },
      { choiceId: 'brand_them_as_deserters', slotCost: 1, isFree: false },
      { choiceId: 'recruit_local_replacements', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_monetary_crisis',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_below', threshold: 100 },
      { type: 'turn_range', minTurn: 6 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'debase_the_coinage', slotCost: 1, isFree: false },
      { choiceId: 'borrow_from_the_merchants', slotCost: 1, isFree: false },
      { choiceId: 'seize_the_old_hoards', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_SOCIAL_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_food_riot_escalation: {
    open_the_royal_granaries: {
      foodDelta: -30,
      commonerSatDelta: 5,
      stabilityDelta: 3,
      nobilitySatDelta: -2,
    },
    post_guards_at_the_markets: {
      militaryReadinessDelta: -2,
      stabilityDelta: 1,
      commonerSatDelta: -3,
      foodDelta: -3,
    },
    hang_the_ringleaders: {
      stabilityDelta: 2,
      commonerSatDelta: -6,
      faithDelta: -2,
      foodDelta: -5,
    },
  },
  evt_exp_w2_bonded_labor_revolt: {
    crush_with_the_levy: {
      stabilityDelta: 2,
      militaryReadinessDelta: -3,
      commonerSatDelta: -5,
      nobilitySatDelta: 3,
    },
    grant_limited_emancipation: {
      commonerSatDelta: 5,
      nobilitySatDelta: -5,
      culturalCohesionDelta: -2,
    },
    negotiate_better_terms: {
      treasuryDelta: -30,
      commonerSatDelta: 3,
      nobilitySatDelta: -2,
    },
  },
  evt_exp_w2_mercenary_defection: {
    match_the_foreign_wages: {
      treasuryDelta: -60,
      militaryCasteSatDelta: 5,
      militaryMoraleDelta: 3,
    },
    brand_them_as_deserters: {
      militaryCasteSatDelta: -4,
      militaryForceSizeDelta: -1,
      stabilityDelta: -1,
    },
    recruit_local_replacements: {
      treasuryDelta: -30,
      militaryCasteSatDelta: -1,
      militaryForceSizeDelta: 1,
      militaryEquipmentDelta: -1,
    },
  },
  evt_exp_w2_monetary_crisis: {
    debase_the_coinage: {
      treasuryDelta: 50,
      merchantSatDelta: -5,
      commonerSatDelta: -3,
      stabilityDelta: -2,
    },
    borrow_from_the_merchants: {
      treasuryDelta: 70,
      merchantSatDelta: 3,
      nobilitySatDelta: -2,
    },
    seize_the_old_hoards: {
      treasuryDelta: 90,
      nobilitySatDelta: -5,
      stabilityDelta: -3,
    },
  },
};
