// Phase 7 — Wave-2 Crisis Events.
//
// Two new crises occupying themes from the design doc not previously
// represented in the expansion pool: a celestial omen and a foreign-refugee
// influx. These slot into the existing event-engine pipeline alongside the
// rest of EXPANSION_*_EVENTS.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_CRISES: EventDefinition[] = [
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
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
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

export const EXPANSION_WAVE_2_CRISES_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_comet_sighting: {
    declare_omen_of_renewal: {
      faithDelta: 4,
      commonerSatDelta: 3,
      stabilityDelta: 2,
    },
    order_ritual_purification: {
      clergySatDelta: 5,
      treasuryDelta: -20,
      heterodoxyDelta: -2,
    },
    forbid_public_speculation: {
      stabilityDelta: -3,
      heterodoxyDelta: 2,
      commonerSatDelta: -2,
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
