import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_CULTURE_EVENTS: EventDefinition[] = [
  // ============================================================
  // Culture (18)
  // ============================================================

  // --- 1. Foreign Artistic Troupe (Informational, opening) ---
  {
    id: 'evt_exp_cul_foreign_troupe',
    severity: EventSeverity.Informational,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
      { type: 'random_chance', probability: 0.4 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'welcome_performers', slotCost: 1, isFree: false },
      { choiceId: 'politely_decline', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // --- 2. Monument Foundation (Notable, developing) ---
  {
    id: 'evt_exp_cul_monument_foundation',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'treasury_above', threshold: 400 },
      { type: 'stability_above', threshold: 50 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'commission_grand_monument', slotCost: 2, isFree: false },
      { choiceId: 'build_modest_memorial', slotCost: 1, isFree: false },
      { choiceId: 'defer_construction', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 3. Dialect Tensions (Serious, established) ---
  {
    id: 'evt_exp_cul_dialect_tensions',
    severity: EventSeverity.Serious,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'stability_below', threshold: 45 },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_common_tongue', slotCost: 1, isFree: false },
      { choiceId: 'protect_regional_dialects', slotCost: 1, isFree: false },
      { choiceId: 'promote_bilingual_policy', slotCost: 2, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 4. Harvest Festival Tradition (Informational, any) ---
  {
    id: 'evt_exp_cul_harvest_festival',
    severity: EventSeverity.Informational,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'food_above', threshold: 120 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_grand_celebration', slotCost: 1, isFree: false },
      { choiceId: 'let_folk_celebrate', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // --- 5. Cultural Preservation Crisis (Critical, established) ---
  {
    id: 'evt_exp_cul_preservation_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'any_of', conditions: [
        { type: 'stability_below', threshold: 30 },
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 25 },
      ]},
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_preservation_council', slotCost: 2, isFree: false },
      { choiceId: 'embrace_cultural_change', slotCost: 1, isFree: false },
      { choiceId: 'suppress_foreign_influence', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 6. Arts Patronage Request (Notable, developing) ---
  {
    id: 'evt_exp_cul_arts_patronage',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'treasury_above', threshold: 300 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 40 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_royal_arts_guild', slotCost: 1, isFree: false },
      { choiceId: 'sponsor_traveling_artists', slotCost: 1, isFree: false },
      { choiceId: 'decline_patronage', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 7. Folk Tradition Revival (Informational, any) ---
  {
    id: 'evt_exp_cul_folk_revival',
    severity: EventSeverity.Informational,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Commoners, threshold: 50 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'endorse_revival', slotCost: 1, isFree: false },
      { choiceId: 'observe_from_afar', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 8. Literary Movement (Notable, established) ---
  {
    id: 'evt_exp_cul_literary_movement',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 45 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_scriptoriums', slotCost: 1, isFree: false },
      { choiceId: 'commission_royal_chronicle', slotCost: 1, isFree: false },
      { choiceId: 'allow_natural_growth', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 9. Cultural Exchange Opportunity (Notable, developing) ---
  {
    id: 'evt_exp_cul_exchange_opportunity',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'neighbor_relationship_above', neighborId: 'empire_south', threshold: 40 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'send_cultural_delegation', slotCost: 1, isFree: false },
      { choiceId: 'invite_foreign_scholars', slotCost: 1, isFree: false },
      { choiceId: 'politely_postpone', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 10. Oral History Keeper (Serious, established) ---
  {
    id: 'evt_exp_cul_oral_history_keeper',
    severity: EventSeverity.Serious,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'population_above', threshold: 800 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'appoint_royal_chronicler', slotCost: 2, isFree: false },
      { choiceId: 'transcribe_oral_traditions', slotCost: 1, isFree: false },
      { choiceId: 'let_traditions_fade', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 11. Winter Storytelling Festival (Informational, any) ---
  {
    id: 'evt_exp_cul_winter_stories',
    severity: EventSeverity.Informational,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'stability_above', threshold: 40 },
    ],
    weight: 0.6,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_royal_gathering', slotCost: 1, isFree: false },
      { choiceId: 'acknowledge_tradition', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // --- 12. Assimilation Pressure (Critical, established) ---
  {
    id: 'evt_exp_cul_assimilation_pressure',
    severity: EventSeverity.Critical,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'empire_south', threshold: 30 },
      { type: 'turn_range', minTurn: 11 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'resist_cultural_pressure', slotCost: 2, isFree: false },
      { choiceId: 'negotiate_cultural_treaty', slotCost: 1, isFree: false },
      { choiceId: 'accept_partial_integration', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 13. Architectural Ambition (Serious, developing) ---
  {
    id: 'evt_exp_cul_architectural_ambition',
    severity: EventSeverity.Serious,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'treasury_above', threshold: 500 },
      { type: 'turn_range', minTurn: 5, maxTurn: 8 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'build_great_cathedral', slotCost: 2, isFree: false },
      { choiceId: 'construct_public_amphitheater', slotCost: 1, isFree: false },
      { choiceId: 'invest_in_housing', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 14. Spring Cultural Awakening (Notable, any) ---
  {
    id: 'evt_exp_cul_spring_awakening',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'stability_above', threshold: 55 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'sponsor_spring_arts', slotCost: 1, isFree: false },
      { choiceId: 'direct_energy_to_labor', slotCost: 1, isFree: false },
      { choiceId: 'let_creativity_bloom', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 15. Heretical Art Scandal (Serious, established) ---
  {
    id: 'evt_exp_cul_heretical_art',
    severity: EventSeverity.Serious,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 40 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'destroy_offensive_works', slotCost: 1, isFree: false },
      { choiceId: 'defend_artistic_freedom', slotCost: 1, isFree: false },
      { choiceId: 'convene_clergy_tribunal', slotCost: 2, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 16. Cultural Identity Crisis (Critical, established) ---
  {
    id: 'evt_exp_cul_identity_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 12 },
      { type: 'any_of', conditions: [
        { type: 'neighbor_relationship_below', neighborId: 'rival_north', threshold: 25 },
        { type: 'stability_below', threshold: 25 },
      ]},
      { type: 'population_above', threshold: 600 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reassert_national_identity', slotCost: 2, isFree: false },
      { choiceId: 'forge_new_cultural_synthesis', slotCost: 2, isFree: false },
      { choiceId: 'allow_regional_autonomy', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 17. Merchant Cultural Investment (Notable, any) ---
  {
    id: 'evt_exp_cul_merchant_investment',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 55 },
      { type: 'treasury_above', threshold: 350 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'accept_merchant_patronage', slotCost: 1, isFree: false },
      { choiceId: 'redirect_to_public_works', slotCost: 1, isFree: false },
      { choiceId: 'decline_with_gratitude', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 18. Military Tradition Ceremony (Serious, opening) ---
  {
    id: 'evt_exp_cul_military_ceremony',
    severity: EventSeverity.Serious,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'military_readiness_above', threshold: 60 },
      { type: 'turn_range', minTurn: 2, maxTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grand_military_parade', slotCost: 2, isFree: false },
      { choiceId: 'solemn_remembrance', slotCost: 1, isFree: false },
      { choiceId: 'skip_ceremony', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
];
