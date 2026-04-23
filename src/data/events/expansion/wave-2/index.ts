// Phase 7 — Wave-2 Crisis Events: aggregate barrel.
//
// 25 total crises across five themed files plus the original two (comet +
// refugees). The rest of the registry (`src/data/events/index.ts` and
// `src/data/events/effects.ts`) imports `EXPANSION_WAVE_2_CRISES` and
// `EXPANSION_WAVE_2_CRISES_EFFECTS` from this barrel and spreads them.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

import {
  EXPANSION_WAVE_2_DISASTER_CRISES,
  EXPANSION_WAVE_2_DISASTER_CRISIS_EFFECTS,
} from './crises-disasters';
import {
  EXPANSION_WAVE_2_RELIGIOUS_CRISES,
  EXPANSION_WAVE_2_RELIGIOUS_CRISIS_EFFECTS,
} from './crises-religious';
import {
  EXPANSION_WAVE_2_POLITICAL_CRISES,
  EXPANSION_WAVE_2_POLITICAL_CRISIS_EFFECTS,
} from './crises-political';
import {
  EXPANSION_WAVE_2_SOCIAL_CRISES,
  EXPANSION_WAVE_2_SOCIAL_CRISIS_EFFECTS,
} from './crises-social';
import {
  EXPANSION_WAVE_2_PHENOMENA_CRISES,
  EXPANSION_WAVE_2_PHENOMENA_CRISIS_EFFECTS,
} from './crises-phenomena';

// The two originals shipped in the Phase 7 stub PR.
const ORIGINAL_WAVE_2_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_comet_sighting',
    severity: EventSeverity.Critical,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'declare_omen_of_renewal', slotCost: 1, isFree: false },
      { choiceId: 'order_ritual_purification', slotCost: 1, isFree: false },
      { choiceId: 'forbid_public_speculation', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'forbid_public_speculation', followUpDefinitionId: 'evt_fu_comet_heresy_spreads', delayTurns: 3, probability: 0.7 },
    ],
  },
  {
    id: 'evt_exp_w2_foreign_refugees',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'admit_and_settle_refugees', slotCost: 1, isFree: false },
      { choiceId: 'turn_them_back_at_the_border', slotCost: 1, isFree: false },
      { choiceId: 'extort_passage_tolls', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];

const ORIGINAL_WAVE_2_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_comet_sighting: {
    declare_omen_of_renewal: {
      faithDelta: 6,
      commonerSatDelta: 4,
      stabilityDelta: 3,
      regionConditionDelta: 2,
    },
    order_ritual_purification: {
      clergySatDelta: 6,
      treasuryDelta: -45,
      heterodoxyDelta: -3,
      regionConditionDelta: 1,
    },
    forbid_public_speculation: {
      stabilityDelta: -3,
      heterodoxyDelta: 3,
      commonerSatDelta: -3,
      regionConditionDelta: -1,
    },
  },
  evt_exp_w2_foreign_refugees: {
    admit_and_settle_refugees: {
      foodDelta: -20,
      commonerSatDelta: -2,
      culturalCohesionDelta: -2,
      stabilityDelta: 1,
    },
    turn_them_back_at_the_border: {
      stabilityDelta: -2,
      faithDelta: -2,
      clergySatDelta: -3,
    },
    extort_passage_tolls: {
      treasuryDelta: 30,
      faithDelta: -3,
      heterodoxyDelta: 1,
    },
  },
};

export const EXPANSION_WAVE_2_CRISES: EventDefinition[] = [
  ...ORIGINAL_WAVE_2_CRISES,
  ...EXPANSION_WAVE_2_DISASTER_CRISES,
  ...EXPANSION_WAVE_2_RELIGIOUS_CRISES,
  ...EXPANSION_WAVE_2_POLITICAL_CRISES,
  ...EXPANSION_WAVE_2_SOCIAL_CRISES,
  ...EXPANSION_WAVE_2_PHENOMENA_CRISES,
];

export const EXPANSION_WAVE_2_CRISES_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  ...ORIGINAL_WAVE_2_CRISIS_EFFECTS,
  ...EXPANSION_WAVE_2_DISASTER_CRISIS_EFFECTS,
  ...EXPANSION_WAVE_2_RELIGIOUS_CRISIS_EFFECTS,
  ...EXPANSION_WAVE_2_POLITICAL_CRISIS_EFFECTS,
  ...EXPANSION_WAVE_2_SOCIAL_CRISIS_EFFECTS,
  ...EXPANSION_WAVE_2_PHENOMENA_CRISIS_EFFECTS,
};
