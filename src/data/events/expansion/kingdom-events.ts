import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_KINGDOM_EVENTS: EventDefinition[] = [
  // --- 1. Coronation Anniversary (opening) ---
  {
    id: 'evt_exp_kgd_coronation_anniversary',
    severity: EventSeverity.Informational,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
      { type: 'stability_above', threshold: 40 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'lavish_celebration', slotCost: 1, isFree: false },
      { choiceId: 'solemn_ceremony', slotCost: 1, isFree: false },
      { choiceId: 'forgo_festivities', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // --- 2. Succession Question (opening) ---
  {
    id: 'evt_exp_kgd_succession_question',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 2, maxTurn: 3 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'name_heir_publicly', slotCost: 1, isFree: false },
      { choiceId: 'establish_council_regency', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_concerns', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // --- 3. Royal Court Intrigue (developing) ---
  {
    id: 'evt_exp_kgd_court_intrigue',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_below', threshold: 55 },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_factions', slotCost: 1, isFree: false },
      { choiceId: 'play_factions_against', slotCost: 1, isFree: false },
      { choiceId: 'ignore_rumors', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 4. Crown Treasury Audit (developing) ---
  {
    id: 'evt_exp_kgd_treasury_audit',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'treasury_below', threshold: 300 },
      { type: 'turn_range', minTurn: 4, maxTurn: 8 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'full_public_audit', slotCost: 2, isFree: false },
      { choiceId: 'quiet_internal_review', slotCost: 1, isFree: false },
      { choiceId: 'tighten_spending', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'full_public_audit', followUpDefinitionId: 'evt_exp_fu_kgd_audit_results', delayTurns: 3, probability: 0.7 },
    ],
  },

  // --- 5. National Celebration Demand (developing) ---
  {
    id: 'evt_exp_kgd_national_celebration',
    severity: EventSeverity.Informational,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'population_above', threshold: 900 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grand_royal_festival', slotCost: 1, isFree: false },
      { choiceId: 'modest_observance', slotCost: 0, isFree: true },
      { choiceId: 'redirect_funds_to_needy', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'grand_royal_festival', followUpDefinitionId: 'evt_exp_fu_kgd_celebration_goodwill', delayTurns: 2, probability: 0.7 },
    ],
  },

  // --- 6. Governance Reform Proposal (established) ---
  {
    id: 'evt_exp_kgd_governance_reform',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'accept_reforms', slotCost: 2, isFree: false },
      { choiceId: 'partial_concessions', slotCost: 1, isFree: false },
      { choiceId: 'reject_reforms', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'accept_reforms', followUpDefinitionId: 'evt_exp_fu_kgd_reform_resistance', delayTurns: 3, probability: 0.6 },
    ],
  },

  // --- 7. Constitutional Crisis (established) ---
  {
    id: 'evt_exp_kgd_constitutional_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_below', threshold: 25 },
      { type: 'any_of', conditions: [
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 30 },
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 25 },
      ]},
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'convene_emergency_council', slotCost: 2, isFree: false },
      { choiceId: 'assert_royal_authority', slotCost: 1, isFree: false },
      { choiceId: 'offer_charter_of_rights', slotCost: 2, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'assert_royal_authority', followUpDefinitionId: 'evt_fu_authority_rebellion', delayTurns: 3, probability: 0.7 },
      { triggerChoiceId: 'offer_charter_of_rights', followUpDefinitionId: 'evt_fu_charter_implementation', delayTurns: 3, probability: 0.8 },
    ],
  },

  // --- 8. Power Consolidation (established) ---
  {
    id: 'evt_exp_kgd_power_consolidation',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_above', threshold: 65 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.MilitaryCaste, threshold: 55 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'centralize_authority', slotCost: 2, isFree: false },
      { choiceId: 'delegate_to_governors', slotCost: 1, isFree: false },
      { choiceId: 'maintain_balance', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 9. Royal Decree Dispute (established) ---
  {
    id: 'evt_exp_kgd_decree_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'recent_decree_issued' },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_decree', slotCost: 1, isFree: false },
      { choiceId: 'amend_decree', slotCost: 1, isFree: false },
      { choiceId: 'rescind_decree', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 10. National Identity Debate (any) ---
  {
    id: 'evt_exp_kgd_national_identity',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_arenthal', threshold: 30 },
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 30 },
      ]},
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'promote_cultural_pride', slotCost: 1, isFree: false },
      { choiceId: 'emphasize_unity', slotCost: 1, isFree: false },
      { choiceId: 'let_discourse_continue', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 11. Corruption Investigation (established) ---
  {
    id: 'evt_exp_kgd_corruption_investigation',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'treasury_below', threshold: 400 },
      { type: 'stability_below', threshold: 50 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'public_tribunal', slotCost: 2, isFree: false },
      { choiceId: 'private_purge', slotCost: 1, isFree: false },
      { choiceId: 'offer_amnesty', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 12. Administrative Overhaul (any) ---
  {
    id: 'evt_exp_kgd_admin_overhaul',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'population_above', threshold: 1100 },
      { type: 'treasury_above', threshold: 500 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'comprehensive_restructuring', slotCost: 2, isFree: false },
      { choiceId: 'incremental_improvements', slotCost: 1, isFree: false },
      { choiceId: 'preserve_traditions', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'comprehensive_restructuring', followUpDefinitionId: 'evt_exp_fu_kgd_centralization_tension', delayTurns: 3, probability: 0.6 },
    ],
  },

  // --- 13. Crown Land Management (any) ---
  {
    id: 'evt_exp_kgd_crown_land',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'food_below', threshold: 120 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'open_crown_lands', slotCost: 1, isFree: false },
      { choiceId: 'lease_to_nobility', slotCost: 1, isFree: false },
      { choiceId: 'preserve_royal_domain', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 14. Royal Legacy (any) ---
  {
    id: 'evt_exp_kgd_royal_legacy',
    severity: EventSeverity.Informational,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'stability_above', threshold: 60 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'commission_monument', slotCost: 1, isFree: false },
      { choiceId: 'endow_scholarly_archive', slotCost: 1, isFree: false },
      { choiceId: 'let_deeds_speak', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 15. Royal Steward's Ledger (opening) ---
  {
    id: 'evt_exp_kgd_steward_ledger',
    severity: EventSeverity.Informational,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 2 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'prioritize_public_welfare', slotCost: 1, isFree: false },
      { choiceId: 'invest_in_royal_authority', slotCost: 1, isFree: false },
      { choiceId: 'maintain_current_allocations', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
];
