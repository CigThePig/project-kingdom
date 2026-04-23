// Condition Event Definitions — surfaced by the environment condition system (Phase 0b).
// These events use triggerConditions: [{ type: 'always' }] because they are
// injected directly by the condition system, not surfaced by surfaceEvents().

import type { EventDefinition } from '../../engine/events/event-engine';
import { EventCategory, EventSeverity } from '../../engine/types';

export const CONDITION_EVENT_POOL: EventDefinition[] = [
  // ============================================================
  // Drought Events (3 severities)
  // ============================================================
  {
    id: 'evt_cond_drought_mild',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'ration_water_supplies', slotCost: 1, isFree: false },
      { choiceId: 'dig_new_wells', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_cond_drought_moderate',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_irrigation', slotCost: 2, isFree: false },
      { choiceId: 'import_water', slotCost: 1, isFree: false },
      { choiceId: 'pray_for_rain', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_cond_drought_severe',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mass_relocation', slotCost: 2, isFree: false },
      { choiceId: 'seize_merchant_water', slotCost: 1, isFree: false },
      { choiceId: 'endure_the_drought', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    followUpEvents: [
      { triggerChoiceId: 'endure_the_drought', followUpDefinitionId: 'evt_fu_drought_wasteland', delayTurns: 3, probability: 0.7 },
      { triggerChoiceId: 'seize_merchant_water', followUpDefinitionId: 'evt_fu_merchant_water_reprisal', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // Flood Event
  // ============================================================
  {
    id: 'evt_cond_flood_moderate',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reinforce_levees', slotCost: 1, isFree: false },
      { choiceId: 'evacuate_lowlands', slotCost: 1, isFree: false },
      { choiceId: 'let_floodwaters_pass', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Harsh Winter Event
  // ============================================================
  {
    id: 'evt_cond_harshwinter_moderate',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'distribute_firewood', slotCost: 1, isFree: false },
      { choiceId: 'open_shelters', slotCost: 1, isFree: false },
      { choiceId: 'wait_for_thaw', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Bountiful Harvest Event
  // ============================================================
  {
    id: 'evt_cond_bountifulharvest_mild',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'stockpile_surplus', slotCost: 0, isFree: true },
      { choiceId: 'trade_surplus', slotCost: 1, isFree: false },
      { choiceId: 'feast_of_plenty', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Plague Events (3 severities)
  // ============================================================
  {
    id: 'evt_cond_plague_mild',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'quarantine_district', slotCost: 1, isFree: false },
      { choiceId: 'hire_healers', slotCost: 1, isFree: false },
      { choiceId: 'ignore_sickness', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_cond_plague_moderate',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'citywide_quarantine', slotCost: 2, isFree: false },
      { choiceId: 'burn_infected_quarters', slotCost: 1, isFree: false },
      { choiceId: 'pray_for_deliverance', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    followUpEvents: [
      { triggerChoiceId: 'burn_infected_quarters', followUpDefinitionId: 'evt_fu_burned_quarters_rebuild', delayTurns: 3, probability: 0.8 },
      { triggerChoiceId: 'pray_for_deliverance', followUpDefinitionId: 'evt_fu_plague_worsens', delayTurns: 2, probability: 0.7 },
    ],
  },
  {
    id: 'evt_cond_plague_severe',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'seal_the_gates', slotCost: 2, isFree: false },
      { choiceId: 'mass_exodus', slotCost: 1, isFree: false },
      { choiceId: 'accept_fate', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    followUpEvents: [
      { triggerChoiceId: 'accept_fate', followUpDefinitionId: 'evt_fu_plague_wasteland', delayTurns: 3, probability: 0.8 },
      { triggerChoiceId: 'mass_exodus', followUpDefinitionId: 'evt_fu_exodus_refugee_crisis', delayTurns: 2, probability: 0.7 },
    ],
  },

  // ============================================================
  // Plague Escalation Event
  // ============================================================
  {
    id: 'evt_cond_plague_escalation',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'martial_law', slotCost: 2, isFree: false },
      { choiceId: 'appeal_to_clergy', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    classification: 'standard',
    followUpEvents: [
      { triggerChoiceId: 'martial_law', followUpDefinitionId: 'evt_fu_martial_law_aftermath', delayTurns: 3, probability: 0.7 },
    ],
  },

  // ============================================================
  // Famine Event
  // ============================================================
  {
    id: 'evt_cond_famine_moderate',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_rationing', slotCost: 1, isFree: false },
      { choiceId: 'import_foreign_grain', slotCost: 1, isFree: false },
      { choiceId: 'open_royal_granaries', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    followUpEvents: [
      { triggerChoiceId: 'emergency_rationing', followUpDefinitionId: 'evt_fu_famine_ration_riot', delayTurns: 2, probability: 0.6 },
      { triggerChoiceId: 'import_foreign_grain', followUpDefinitionId: 'evt_fu_grain_debt_called', delayTurns: 4, probability: 0.5 },
    ],
  },

  // ============================================================
  // Condition Resolution Events (3)
  // ============================================================
  {
    id: 'evt_cond_drought_resolved',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    classification: 'notification',
  },
  {
    id: 'evt_cond_plague_resolved',
    severity: EventSeverity.Informational,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    classification: 'notification',
  },
  {
    id: 'evt_cond_flood_resolved',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
    classification: 'notification',
  },
];
