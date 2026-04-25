// Phase 7 — Wave-2 Crisis Events: Disasters & Material Failures.
//
// Five disaster-flavored crises. All follow the existing `EventDefinition`
// shape and register choice effects in `EXPANSION_WAVE_2_CRISES_EFFECTS` via
// the barrel re-export at `./index.ts`.

import type { EventDefinition } from '../../../../engine/events/event-engine';
import type { MechanicalEffectDelta } from '../../../../engine/types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../../../engine/types';

export const EXPANSION_WAVE_2_DISASTER_CRISES: EventDefinition[] = [
  {
    id: 'evt_exp_w2_plague_variant',
    severity: EventSeverity.Critical,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'turn_range', minTurn: 8 },
      { type: 'random_chance', probability: 0.1 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'quarantine_afflicted_quarters', slotCost: 1, isFree: false },
      { choiceId: 'open_hospitals_for_all', slotCost: 1, isFree: false },
      { choiceId: 'pray_and_wait', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_exp_w2_naval_disaster',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.12 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_emergency_shipyard', slotCost: 1, isFree: false },
      { choiceId: 'recall_merchant_vessels', slotCost: 1, isFree: false },
      { choiceId: 'blame_the_captain', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_exp_w2_library_fire',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.1 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'commission_scribes_to_restore', slotCost: 1, isFree: false },
      { choiceId: 'import_foreign_copies', slotCost: 1, isFree: false },
      { choiceId: 'accept_the_loss', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_exp_w2_well_poisoning',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 50 },
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hunt_the_saboteurs', slotCost: 1, isFree: false },
      { choiceId: 'quietly_replace_the_wells', slotCost: 1, isFree: false },
      { choiceId: 'blame_a_rival', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_exp_w2_salt_shortage',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.14 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'ration_royal_stocks', slotCost: 1, isFree: false },
      { choiceId: 'open_the_salt_roads', slotCost: 1, isFree: false },
      { choiceId: 'impose_a_salt_tax', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
];

export const EXPANSION_WAVE_2_DISASTER_CRISIS_EFFECTS: Record<
  string,
  Record<string, MechanicalEffectDelta>
> = {
  evt_exp_w2_plague_variant: {
    quarantine_afflicted_quarters: {
      stabilityDelta: -3,
      commonerSatDelta: -4,
      regionConditionDelta: -2,
      treasuryDelta: -20,
    },
    open_hospitals_for_all: {
      treasuryDelta: -60,
      commonerSatDelta: 4,
      clergySatDelta: 3,
      faithDelta: 2,
    },
    pray_and_wait: {
      stabilityDelta: -5,
      commonerSatDelta: -6,
      faithDelta: 3,
      heterodoxyDelta: 2,
    },
  },
  evt_exp_w2_naval_disaster: {
    fund_emergency_shipyard: {
      treasuryDelta: -70,
      militaryEquipmentDelta: 4,
      merchantSatDelta: 3,
    },
    recall_merchant_vessels: {
      treasuryDelta: -20,
      merchantSatDelta: -4,
      stabilityDelta: 1,
    },
    blame_the_captain: {
      militaryMoraleDelta: -4,
      nobilitySatDelta: 2,
      stabilityDelta: -1,
    },
  },
  evt_exp_w2_library_fire: {
    commission_scribes_to_restore: {
      treasuryDelta: -40,
      clergySatDelta: 4,
      culturalCohesionDelta: 2,
    },
    import_foreign_copies: {
      treasuryDelta: -30,
      merchantSatDelta: 2,
      culturalCohesionDelta: -1,
    },
    accept_the_loss: {
      clergySatDelta: -4,
      culturalCohesionDelta: -3,
    },
  },
  evt_exp_w2_well_poisoning: {
    hunt_the_saboteurs: {
      stabilityDelta: 2,
      commonerSatDelta: -2,
      militaryCasteSatDelta: 2,
    },
    quietly_replace_the_wells: {
      treasuryDelta: -50,
      commonerSatDelta: 3,
      stabilityDelta: 1,
    },
    blame_a_rival: {
      stabilityDelta: 1,
      commonerSatDelta: 2,
      heterodoxyDelta: 1,
    },
  },
  evt_exp_w2_salt_shortage: {
    ration_royal_stocks: {
      treasuryDelta: -20,
      commonerSatDelta: 2,
      nobilitySatDelta: -2,
    },
    open_the_salt_roads: {
      treasuryDelta: -40,
      merchantSatDelta: 4,
      commonerSatDelta: 3,
    },
    impose_a_salt_tax: {
      treasuryDelta: 50,
      commonerSatDelta: -5,
      stabilityDelta: -2,
    },
  },
};
