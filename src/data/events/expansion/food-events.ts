import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_FOOD_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Granary Rats — Notable, opening
  // ============================================================
  {
    id: 'evt_exp_fod_granary_rats',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'food_above', threshold: 50 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hire_ratcatchers', slotCost: 1, isFree: false },
      { choiceId: 'distribute_before_spoilage', slotCost: 1, isFree: false },
      { choiceId: 'accept_the_losses', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'hire_ratcatchers', followUpDefinitionId: 'evt_exp_fu_food_granary_shortage', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // 2. Fishing Fleet Expansion — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_fod_fishing_fleet',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'treasury_above', threshold: 200 },
      { type: 'turn_range', minTurn: 4, maxTurn: 10 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_new_boats', slotCost: 1, isFree: false },
      { choiceId: 'conscript_coastal_labour', slotCost: 1, isFree: false },
      { choiceId: 'maintain_current_fleet', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'fund_new_boats', followUpDefinitionId: 'evt_exp_fu_food_overfishing', delayTurns: 3, probability: 0.5 },
    ],
  },

  // ============================================================
  // 3. Food Preservation Innovations — Informational, developing
  // ============================================================
  {
    id: 'evt_exp_fod_preservation',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'population_above', threshold: 700 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invest_in_salt_curing', slotCost: 1, isFree: false },
      { choiceId: 'build_smoke_houses', slotCost: 1, isFree: false },
      { choiceId: 'rely_on_traditional_methods', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 4. Crop Disease — Serious, established
  // ============================================================
  {
    id: 'evt_exp_fod_crop_disease',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'turn_range', minTurn: 9 },
      { type: 'random_chance', probability: 0.2 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_crop_rotation' },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_exp_agricultural_modernization' },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'burn_infected_fields', slotCost: 1, isFree: false },
      { choiceId: 'quarantine_affected_regions', slotCost: 2, isFree: false },
      { choiceId: 'pray_for_divine_intervention', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 5. Livestock Plague — Critical, established
  // ============================================================
  {
    id: 'evt_exp_fod_livestock_plague',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'food_below', threshold: 60 },
      { type: 'any_of', conditions: [
        { type: 'season_is', season: Season.Spring },
        { type: 'season_is', season: Season.Summer },
      ]},
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_exp_agricultural_modernization' },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'cull_all_sick_animals', slotCost: 1, isFree: false },
      { choiceId: 'import_healthy_stock', slotCost: 2, isFree: false },
      { choiceId: 'let_plague_run_its_course', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'cull_all_sick_animals', followUpDefinitionId: 'evt_exp_fu_food_quarantine_success', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 6. Food Distribution Inequity — Serious, established
  // ============================================================
  {
    id: 'evt_exp_fod_distribution_inequity',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 55 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mandate_equal_rationing', slotCost: 1, isFree: false },
      { choiceId: 'open_royal_granaries', slotCost: 1, isFree: false },
      { choiceId: 'maintain_current_distribution', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 7. Feast and Famine Cycle — Notable, any
  // ============================================================
  {
    id: 'evt_exp_fod_feast_famine',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'food_above', threshold: 120 },
        { type: 'food_below', threshold: 30 },
      ]},
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_food_reserves', slotCost: 1, isFree: false },
      { choiceId: 'sell_surplus_abroad', slotCost: 1, isFree: false },
      { choiceId: 'do_nothing_special', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'establish_food_reserves', followUpDefinitionId: 'evt_exp_fu_food_feast_aftermath', delayTurns: 2, probability: 0.8 },
    ],
  },

  // ============================================================
  // 8. Agricultural Labour Shortage — Serious, any
  // ============================================================
  {
    id: 'evt_exp_fod_labour_shortage',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'population_below', threshold: 700 },
      { type: 'food_below', threshold: 80 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_exp_land_reform' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'conscript_urban_workers', slotCost: 1, isFree: false },
      { choiceId: 'offer_land_grants', slotCost: 1, isFree: false },
      { choiceId: 'accept_reduced_harvest', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 9. Food Hoarding by Nobles — Notable, established
  // ============================================================
  {
    id: 'evt_exp_fod_noble_hoarding',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'food_below', threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 50 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'confiscate_noble_stores', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_voluntary_sharing', slotCost: 1, isFree: false },
      { choiceId: 'allow_nobles_their_stores', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 10. Foreign Food Imports Blocked — Critical, any
  // ============================================================
  {
    id: 'evt_exp_fod_imports_blocked',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 35 },
      { type: 'food_below', threshold: 70 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_trade_agreement' },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'demand_trade_resumption', slotCost: 1, isFree: false },
      { choiceId: 'seek_arenthal_imports', slotCost: 1, isFree: false },
      { choiceId: 'enforce_strict_rationing', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];
