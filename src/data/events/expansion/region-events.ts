import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_REGION_EVENTS: EventDefinition[] = [
  // --- 1. Provincial Autonomy Dispute (opening) ---
  {
    id: 'evt_exp_reg_autonomy_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'stability_below', threshold: 50 },
      { type: 'turn_range', minTurn: 2, maxTurn: 3 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_limited_autonomy', slotCost: 1, isFree: false },
      { choiceId: 'reassert_central_control', slotCost: 1, isFree: false },
      { choiceId: 'send_mediator', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // --- 2. Resource Discovery (opening) ---
  {
    id: 'evt_exp_reg_resource_discovery',
    severity: EventSeverity.Informational,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crown_extraction', slotCost: 1, isFree: false },
      { choiceId: 'local_development', slotCost: 1, isFree: false },
      { choiceId: 'survey_further', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'crown_extraction', followUpDefinitionId: 'evt_exp_fu_reg_resource_boom', delayTurns: 3, probability: 0.7 },
    ],
  },

  // --- 3. Trade Route Disruption (developing) ---
  {
    id: 'evt_exp_reg_trade_disruption',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 40 },
      { type: 'random_chance', probability: 0.4 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_trade_agreement' },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_trade_subsidies' },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'military_escort', slotCost: 2, isFree: false },
      { choiceId: 'negotiate_safe_passage', slotCost: 1, isFree: false },
      { choiceId: 'reroute_trade', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 4. Infrastructure Proposal (developing) ---
  {
    id: 'evt_exp_reg_infrastructure_proposal',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'treasury_above', threshold: 400 },
      { type: 'population_above', threshold: 800 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_road_network', slotCost: 2, isFree: false },
      { choiceId: 'build_regional_market', slotCost: 1, isFree: false },
      { choiceId: 'defer_construction', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'fund_road_network', followUpDefinitionId: 'evt_exp_fu_reg_infrastructure_complete', delayTurns: 4, probability: 0.8 },
    ],
  },

  // --- 5. Regional Festival (developing) ---
  {
    id: 'evt_exp_reg_festival',
    severity: EventSeverity.Informational,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Commoners, threshold: 45 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'royal_patronage', slotCost: 1, isFree: false },
      { choiceId: 'attend_personally', slotCost: 1, isFree: false },
      { choiceId: 'send_regards', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 6. Provincial Governor Corruption (established) ---
  {
    id: 'evt_exp_reg_governor_corruption',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'remove_governor', slotCost: 2, isFree: false },
      { choiceId: 'demand_restitution', slotCost: 1, isFree: false },
      { choiceId: 'issue_warning', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'remove_governor', followUpDefinitionId: 'evt_exp_fu_reg_new_governor', delayTurns: 2, probability: 0.7 },
    ],
  },

  // --- 7. Border Province Tensions (established) ---
  {
    id: 'evt_exp_reg_border_tensions',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_arenthal', threshold: 35 },
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 35 },
      ]},
      { type: 'military_readiness_below', threshold: 50 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_fortify_borders' },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fortify_border', slotCost: 2, isFree: false },
      { choiceId: 'diplomatic_reassurance', slotCost: 1, isFree: false },
      { choiceId: 'increase_patrols', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 8. Regional Specialization (established) ---
  {
    id: 'evt_exp_reg_specialization',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'turn_range', minTurn: 9 },
      { type: 'treasury_above', threshold: 350 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'encourage_artisan_quarter', slotCost: 1, isFree: false },
      { choiceId: 'develop_agricultural_hub', slotCost: 1, isFree: false },
      { choiceId: 'let_market_decide', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 9. Local Hero Emerges (established) ---
  {
    id: 'evt_exp_reg_local_hero',
    severity: EventSeverity.Informational,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'population_above', threshold: 1000 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'honor_at_court', slotCost: 1, isFree: false },
      { choiceId: 'appoint_local_office', slotCost: 1, isFree: false },
      { choiceId: 'acknowledge_from_afar', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'honor_at_court', followUpDefinitionId: 'evt_exp_fu_reg_hero_legend', delayTurns: 3, probability: 0.6 },
    ],
  },

  // --- 10. Provincial Development Rivalry (any) ---
  {
    id: 'evt_exp_reg_development_rivalry',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'population_above', threshold: 900 },
      { type: 'stability_above', threshold: 40 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'favor_petitioning_province', slotCost: 1, isFree: false },
      { choiceId: 'distribute_equally', slotCost: 2, isFree: false },
      { choiceId: 'encourage_competition', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
];
