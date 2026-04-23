// Phase 7 — Wave-2 Crisis Events: Court & Political.
//
// Five crises in the political/dynastic register.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_POLITICAL_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_royal_scandal',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'deny_and_punish_the_gossips', slotCost: 1, isFree: false },
      { choiceId: 'admit_and_seek_penance', slotCost: 1, isFree: false },
      { choiceId: 'distract_with_festivities', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_royal_illness',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 8 },
      { type: 'random_chance', probability: 0.1 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'summon_foreign_physicians', slotCost: 1, isFree: false },
      { choiceId: 'trust_the_cathedral_healers', slotCost: 1, isFree: false },
      { choiceId: 'govern_through_the_sickness', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_dynastic_challenge',
    severity: EventSeverity.Critical,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_below', threshold: 45 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crush_the_pretender', slotCost: 1, isFree: false },
      { choiceId: 'marry_into_their_line', slotCost: 1, isFree: false },
      { choiceId: 'exile_with_a_pension', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'marry_into_their_line', followUpDefinitionId: 'evt_fu_marriage_dynastic_friction', delayTurns: 3, probability: 0.6 },
      { triggerChoiceId: 'exile_with_a_pension', followUpDefinitionId: 'evt_fu_exiled_pretender_returns', delayTurns: 4, probability: 0.7 },
    ],
  },
  {
    id: 'evt_exp_w2_foreign_assassination',
    severity: EventSeverity.Serious,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.12 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'condemn_publicly_and_mourn', slotCost: 1, isFree: false },
      { choiceId: 'offer_the_network_quietly', slotCost: 1, isFree: false },
      { choiceId: 'deny_all_involvement', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    affectsNeighbor: '__ANY__',
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_exp_w2_bandit_lord_uprising',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'stability_below', threshold: 55 },
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'send_a_punitive_column', slotCost: 1, isFree: false },
      { choiceId: 'offer_the_lord_a_title', slotCost: 1, isFree: false },
      { choiceId: 'pay_his_silence', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];

export const EXPANSION_WAVE_2_POLITICAL_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_royal_scandal: {
    deny_and_punish_the_gossips: {
      stabilityDelta: -2,
      commonerSatDelta: -3,
      nobilitySatDelta: 1,
    },
    admit_and_seek_penance: {
      faithDelta: 3,
      clergySatDelta: 3,
      nobilitySatDelta: -3,
      commonerSatDelta: 2,
    },
    distract_with_festivities: {
      treasuryDelta: -40,
      commonerSatDelta: 4,
      nobilitySatDelta: 1,
    },
  },
  evt_exp_w2_royal_illness: {
    summon_foreign_physicians: {
      treasuryDelta: -50,
      nobilitySatDelta: 2,
      clergySatDelta: -2,
      stabilityDelta: 1,
    },
    trust_the_cathedral_healers: {
      faithDelta: 3,
      clergySatDelta: 4,
      stabilityDelta: -1,
    },
    govern_through_the_sickness: {
      stabilityDelta: -3,
      nobilitySatDelta: -2,
    },
  },
  evt_exp_w2_dynastic_challenge: {
    crush_the_pretender: {
      treasuryDelta: -70,
      militaryForceSizeDelta: -1,
      stabilityDelta: 4,
      nobilitySatDelta: -3,
      regionConditionDelta: -2,
    },
    marry_into_their_line: {
      nobilitySatDelta: 4,
      stabilityDelta: 3,
      culturalCohesionDelta: -2,
      diplomacyDeltas: { neighbor_arenthal: +4 },
    },
    exile_with_a_pension: {
      treasuryDelta: -40,
      stabilityDelta: 2,
      nobilitySatDelta: -2,
      diplomacyDeltas: { neighbor_valdris: +2 },
      regionConditionDelta: -1,
    },
  },
  evt_exp_w2_foreign_assassination: {
    condemn_publicly_and_mourn: {
      faithDelta: 2,
      nobilitySatDelta: 3,
      stabilityDelta: 1,
      diplomacyDeltas: { empire_south: +4 },
    },
    offer_the_network_quietly: {
      espionageNetworkDelta: 3,
      treasuryDelta: -30,
      stabilityDelta: -1,
      diplomacyDeltas: { empire_south: +2 },
    },
    deny_all_involvement: {
      stabilityDelta: -1,
      nobilitySatDelta: -2,
      diplomacyDeltas: { empire_south: -3 },
    },
  },
  evt_exp_w2_bandit_lord_uprising: {
    send_a_punitive_column: {
      treasuryDelta: -40,
      militaryReadinessDelta: -2,
      stabilityDelta: 3,
      regionConditionDelta: 2,
    },
    offer_the_lord_a_title: {
      nobilitySatDelta: -3,
      stabilityDelta: 2,
      commonerSatDelta: -2,
    },
    pay_his_silence: {
      treasuryDelta: -60,
      stabilityDelta: 1,
      commonerSatDelta: -2,
    },
  },
};
