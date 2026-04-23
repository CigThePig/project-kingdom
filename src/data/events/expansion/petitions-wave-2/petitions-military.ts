// Phase 7 — Wave-2 Petitions: Military & Frontier.
//
// Two military-adjacent petitions to pad out the existing pair (veterans'
// pensions + clergy reform synod lives in the root index.ts).

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_MILITARY_PETITIONS: EventDefinition[] = [
  {
    id: 'faction_req_w2_border_captains_garrison',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 50 },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reinforce_the_border_garrison', slotCost: 0, isFree: true },
      { choiceId: 'leave_the_garrison_thin', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_knightly_order_grant',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_the_knightly_order', slotCost: 0, isFree: true },
      { choiceId: 'deny_the_grant', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_MILITARY_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  faction_req_w2_border_captains_garrison: {
    reinforce_the_border_garrison: {
      treasuryDelta: -35,
      militaryCasteSatDelta: 4,
      militaryReadinessDelta: 2,
      regionConditionDelta: 1,
    },
    leave_the_garrison_thin: {
      militaryCasteSatDelta: -4,
      regionConditionDelta: -2,
      stabilityDelta: -1,
      militaryReadinessDelta: -3,
    },
  },
  faction_req_w2_knightly_order_grant: {
    grant_the_knightly_order: {
      treasuryDelta: -25,
      nobilitySatDelta: 4,
      militaryReadinessDelta: 1,
      militaryForceSizeDelta: 1,
    },
    deny_the_grant: {
      nobilitySatDelta: -3,
      militaryMoraleDelta: -1,
    },
  },
};
