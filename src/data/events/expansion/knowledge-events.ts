import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_KNOWLEDGE_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Scholar Dispute at the Royal Academy (Notable, developing)
  // ============================================================
  {
    id: 'evt_exp_kno_scholar_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4, maxTurn: 8 },
      { type: 'stability_above', threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'side_with_traditionalists', slotCost: 1, isFree: false },
      { choiceId: 'side_with_reformers', slotCost: 1, isFree: false },
      { choiceId: 'let_them_settle_it', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'side_with_traditionalists', followUpDefinitionId: 'evt_exp_fu_kno_academic_breakthrough', delayTurns: 4, probability: 0.5 },
    ],
  },

  // ============================================================
  // 2. Foreign Manuscript Arrives (Informational, opening)
  // ============================================================
  {
    id: 'evt_exp_kno_foreign_manuscript',
    severity: EventSeverity.Informational,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
      { type: 'treasury_above', threshold: 200 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'commission_translation', slotCost: 1, isFree: false },
      { choiceId: 'archive_untranslated', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 3. Alchemist's Volatile Discovery (Serious, established)
  // ============================================================
  {
    id: 'evt_exp_kno_alchemist_discovery',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_military_application', slotCost: 2, isFree: false },
      { choiceId: 'restrict_to_civilian_use', slotCost: 1, isFree: false },
      { choiceId: 'suppress_findings', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'fund_military_application', followUpDefinitionId: 'evt_exp_fu_kno_technology_restored', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 4. Library Fire Threatens Archives (Critical, established)
  // ============================================================
  {
    id: 'evt_exp_kno_library_fire',
    severity: EventSeverity.Critical,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'season_is', season: Season.Summer },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_salvage_operation', slotCost: 2, isFree: false },
      { choiceId: 'protect_rarest_volumes', slotCost: 1, isFree: false },
      { choiceId: 'let_it_burn', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 5. Student Uprising at the Academy (Serious, developing)
  // ============================================================
  {
    id: 'evt_exp_kno_student_uprising',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
      { type: 'stability_below', threshold: 55 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'negotiate_with_students', slotCost: 1, isFree: false },
      { choiceId: 'disperse_by_force', slotCost: 1, isFree: false },
      { choiceId: 'close_academy_temporarily', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 6. Clergy Demand Knowledge Censorship (Serious, established)
  // ============================================================
  {
    id: 'evt_exp_kno_censorship_demand',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'faith_above', threshold: 65 },
      { type: 'heterodoxy_above', threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_censorship', slotCost: 1, isFree: false },
      { choiceId: 'protect_free_inquiry', slotCost: 1, isFree: false },
      { choiceId: 'create_review_board', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 7. Engineering Breakthrough — Aqueduct Design (Notable, established)
  // ============================================================
  {
    id: 'evt_exp_kno_aqueduct_design',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'population_above', threshold: 800 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_construction', slotCost: 2, isFree: false },
      { choiceId: 'limited_trial', slotCost: 1, isFree: false },
      { choiceId: 'shelve_plans', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 8. Herbalist Discovers Plague Remedy (Serious, any)
  // ============================================================
  {
    id: 'evt_exp_kno_plague_remedy',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_mild:quarantine_district' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_mild:hire_healers' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_mild:ignore_sickness' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_moderate:citywide_quarantine' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_moderate:burn_infected_quarters' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_moderate:pray_for_deliverance' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_severe:seal_the_gates' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_severe:mass_exodus' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_cond_plague_severe:accept_fate' },
        { type: 'food_below', threshold: 60 },
      ]},
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mass_produce_remedy', slotCost: 2, isFree: false },
      { choiceId: 'test_on_volunteers', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_as_quackery', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 9. Cartographer Maps New Trade Route (Notable, developing)
  // ============================================================
  {
    id: 'evt_exp_kno_cartographer_route',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 50 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_expedition', slotCost: 1, isFree: false },
      { choiceId: 'sell_maps_to_merchants', slotCost: 1, isFree: false },
      { choiceId: 'keep_maps_secret', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 10. Mathematical Treatise Challenges Tax System (Notable, established)
  // ============================================================
  {
    id: 'evt_exp_kno_math_treatise',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'treasury_above', threshold: 500 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'adopt_new_methods', slotCost: 1, isFree: false },
      { choiceId: 'commission_rebuttal', slotCost: 1, isFree: false },
      { choiceId: 'ignore_treatise', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 11. Printing Press Prototype (Critical, established)
  // ============================================================
  {
    id: 'evt_exp_kno_printing_press',
    severity: EventSeverity.Critical,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'treasury_above', threshold: 400 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_mass_production', slotCost: 2, isFree: false },
      { choiceId: 'restrict_to_crown', slotCost: 1, isFree: false },
      { choiceId: 'ban_device', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'fund_mass_production', followUpDefinitionId: 'evt_exp_fu_kno_printed_pamphlets', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 12. Rival Kingdom Hoards Knowledge (Serious, any)
  // ============================================================
  {
    id: 'evt_exp_kno_rival_hoards',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'valdris', threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'send_spies_to_copy', slotCost: 2, isFree: false },
      { choiceId: 'propose_knowledge_exchange', slotCost: 1, isFree: false },
      { choiceId: 'develop_independently', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 13. Astronomical Observatory Proposal (Informational, developing)
  // ============================================================
  {
    id: 'evt_exp_kno_observatory_proposal',
    severity: EventSeverity.Informational,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_funding', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_next_season', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 14. Merchant Guild Demands Navigation Charts (Notable, any)
  // ============================================================
  {
    id: 'evt_exp_kno_navigation_charts',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 45 },
        { type: 'neighbor_relationship_above', neighborId: 'maritime_league', threshold: 50 },
      ]},
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'share_crown_charts', slotCost: 1, isFree: false },
      { choiceId: 'commission_new_surveys', slotCost: 1, isFree: false },
      { choiceId: 'deny_request', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 15. Wandering Philosopher Seeks Patronage (Informational, opening)
  // ============================================================
  {
    id: 'evt_exp_kno_wandering_philosopher',
    severity: EventSeverity.Informational,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'turn_range', minTurn: 2, maxTurn: 4 },
      { type: 'random_chance', probability: 0.4 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_patronage', slotCost: 1, isFree: false },
      { choiceId: 'politely_decline', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'grant_patronage', followUpDefinitionId: 'evt_exp_fu_kno_scholar_contributions', delayTurns: 4, probability: 0.7 },
    ],
  },

  // ============================================================
  // 16. Competing Factions Vie for Ancient Codex (Informational, any)
  // ============================================================
  {
    id: 'evt_exp_kno_ancient_codex',
    severity: EventSeverity.Informational,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'faith_above', threshold: 55 },
        { type: 'population_above', threshold: 600 },
      ]},
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.6,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'award_to_clergy', slotCost: 1, isFree: false },
      { choiceId: 'award_to_nobility', slotCost: 1, isFree: false },
      { choiceId: 'place_in_public_archive', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];
