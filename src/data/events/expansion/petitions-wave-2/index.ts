// Phase 7 — Wave-2 Petitions: aggregate barrel.
//
// 20 total petitions: 2 originals (military pensions + clergy reform synod)
// plus 18 across four themed files. Registry imports
// `EXPANSION_WAVE_2_PETITIONS` and `EXPANSION_WAVE_2_PETITION_EFFECTS` from
// this barrel.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

import {
  EXPANSION_WAVE_2_GUILD_PETITIONS,
  EXPANSION_WAVE_2_GUILD_PETITION_EFFECTS,
} from './petitions-guilds';
import {
  EXPANSION_WAVE_2_CIVIC_PETITIONS,
  EXPANSION_WAVE_2_CIVIC_PETITION_EFFECTS,
} from './petitions-civic';
import {
  EXPANSION_WAVE_2_RELIGIOUS_PETITIONS,
  EXPANSION_WAVE_2_RELIGIOUS_PETITION_EFFECTS,
} from './petitions-religious';
import {
  EXPANSION_WAVE_2_MILITARY_PETITIONS,
  EXPANSION_WAVE_2_MILITARY_PETITION_EFFECTS,
} from './petitions-military';

const ORIGINAL_WAVE_2_PETITIONS: EventDefinition[] = [
  {
    id: 'faction_req_w2_military_pensions',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      {
        type: 'class_satisfaction_below',
        classTarget: PopulationClass.MilitaryCaste,
        threshold: 45,
      },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_veterans_pensions', slotCost: 0, isFree: true },
      { choiceId: 'defer_pensions_decision', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'faction_req_w2_clergy_reform_synod',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      {
        type: 'class_satisfaction_below',
        classTarget: PopulationClass.Clergy,
        threshold: 50,
      },
      { type: 'heterodoxy_above', threshold: 20 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'convene_reform_synod', slotCost: 0, isFree: true },
      { choiceId: 'reject_synod_request', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];

const ORIGINAL_WAVE_2_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  faction_req_w2_military_pensions: {
    fund_veterans_pensions: {
      militaryCasteSatDelta: 7,
      militaryMoraleDelta: 3,
      treasuryDelta: -30,
    },
    defer_pensions_decision: {
      militaryCasteSatDelta: -5,
      militaryMoraleDelta: -2,
    },
  },
  faction_req_w2_clergy_reform_synod: {
    convene_reform_synod: {
      clergySatDelta: 6,
      heterodoxyDelta: -3,
      treasuryDelta: -15,
    },
    reject_synod_request: {
      clergySatDelta: -5,
      heterodoxyDelta: 2,
      faithDelta: -1,
    },
  },
};

export const EXPANSION_WAVE_2_PETITIONS: EventDefinition[] = [
  ...ORIGINAL_WAVE_2_PETITIONS,
  ...EXPANSION_WAVE_2_GUILD_PETITIONS,
  ...EXPANSION_WAVE_2_CIVIC_PETITIONS,
  ...EXPANSION_WAVE_2_RELIGIOUS_PETITIONS,
  ...EXPANSION_WAVE_2_MILITARY_PETITIONS,
];

export const EXPANSION_WAVE_2_PETITION_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  ...ORIGINAL_WAVE_2_PETITION_EFFECTS,
  ...EXPANSION_WAVE_2_GUILD_PETITION_EFFECTS,
  ...EXPANSION_WAVE_2_CIVIC_PETITION_EFFECTS,
  ...EXPANSION_WAVE_2_RELIGIOUS_PETITION_EFFECTS,
  ...EXPANSION_WAVE_2_MILITARY_PETITION_EFFECTS,
};
