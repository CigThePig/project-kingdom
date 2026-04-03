// gameplay-blueprint.md §7 — Event Pool Definitions
// 26 events: 2 per EventCategory, mixed severities, 1 two-step chain.

import type { EventDefinition } from '../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../engine/types';

export const EVENT_POOL: EventDefinition[] = [
  // ============================================================
  // Economy (2)
  // ============================================================
  {
    id: 'evt_merchant_capital_flight',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 35 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'offer_tax_relief', slotCost: 1, isFree: false },
      { choiceId: 'enforce_capital_controls', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_with_guilds', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_treasury_windfall',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_above', threshold: 800 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invest_in_infrastructure', slotCost: 1, isFree: false },
      { choiceId: 'distribute_to_populace', slotCost: 1, isFree: false },
      { choiceId: 'bolster_reserves', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Food (2)
  // ============================================================
  {
    id: 'evt_harvest_blight',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'quarantine_affected_fields', slotCost: 1, isFree: false },
      { choiceId: 'redirect_labor_to_salvage', slotCost: 1, isFree: false },
      { choiceId: 'purchase_foreign_grain', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
  },
  {
    id: 'evt_commoner_harvest_festival',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'food_above', threshold: 200 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'endorse_celebrations', slotCost: 0, isFree: true },
      { choiceId: 'observe_without_comment', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Military (2) — Chain: chain_equipment_crisis
  // ============================================================
  {
    id: 'evt_military_equipment_shortage_1',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 50 },
    ],
    weight: 1.0,
    chainId: 'chain_equipment_crisis',
    chainStep: 1,
    chainNextDefinitionId: 'evt_military_equipment_shortage_2',
    choices: [
      { choiceId: 'emergency_procurement', slotCost: 1, isFree: false },
      { choiceId: 'redistribute_existing_stock', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_next_month', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_military_equipment_shortage_2',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_equipment_crisis',
    chainStep: 2,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'full_rearmament_program', slotCost: 2, isFree: false },
      { choiceId: 'request_allied_supplies', slotCost: 1, isFree: false },
      { choiceId: 'reduce_force_size', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Diplomacy (2)
  // ============================================================
  {
    id: 'evt_neighbor_trade_overture',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'random_chance', probability: 0.3 },
      { type: 'turn_range', minTurn: 3 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'accept_trade_terms', slotCost: 1, isFree: false },
      { choiceId: 'propose_modifications', slotCost: 1, isFree: false },
      { choiceId: 'decline_politely', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_border_tension_escalation',
    severity: EventSeverity.Serious,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reinforce_border_garrisons', slotCost: 1, isFree: false },
      { choiceId: 'dispatch_diplomatic_envoy', slotCost: 1, isFree: false },
      { choiceId: 'issue_formal_protest', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
  },

  // ============================================================
  // Environment (2)
  // ============================================================
  {
    id: 'evt_early_frost',
    severity: EventSeverity.Notable,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mobilize_harvest_crews', slotCost: 1, isFree: false },
      { choiceId: 'open_emergency_stores', slotCost: 1, isFree: false },
      { choiceId: 'accept_the_losses', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
  },
  {
    id: 'evt_spring_flooding',
    severity: EventSeverity.Serious,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'organize_relief_effort', slotCost: 1, isFree: false },
      { choiceId: 'redirect_military_engineers', slotCost: 1, isFree: false },
      { choiceId: 'levy_emergency_reconstruction_tax', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
  },

  // ============================================================
  // PublicOrder (2)
  // ============================================================
  {
    id: 'evt_commoner_labor_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mediate_negotiations', slotCost: 1, isFree: false },
      { choiceId: 'side_with_laborers', slotCost: 1, isFree: false },
      { choiceId: 'enforce_existing_contracts', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_popular_unrest',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 25 },
      { type: 'stability_below', threshold: 30 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'address_grievances_publicly', slotCost: 0, isFree: true },
      { choiceId: 'deploy_peacekeepers', slotCost: 1, isFree: false },
      { choiceId: 'impose_curfew', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Religion (2)
  // ============================================================
  {
    id: 'evt_heresy_emergence',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 40 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_teachings', slotCost: 1, isFree: false },
      { choiceId: 'suppress_immediately', slotCost: 1, isFree: false },
      { choiceId: 'permit_theological_debate', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_schism_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'schism_active' },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'convene_ecclesiastical_council', slotCost: 2, isFree: false },
      { choiceId: 'enforce_state_doctrine', slotCost: 1, isFree: false },
      { choiceId: 'allow_coexistence', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Culture (2)
  // ============================================================
  {
    id: 'evt_foreign_cultural_influx',
    severity: EventSeverity.Informational,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'random_chance', probability: 0.25 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'embrace_exchange', slotCost: 0, isFree: true },
      { choiceId: 'regulate_foreign_practices', slotCost: 1, isFree: false },
      { choiceId: 'observe_and_assess', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_cultural_festival_proposal',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'faith_above', threshold: 60 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_full_festival', slotCost: 1, isFree: false },
      { choiceId: 'approve_modest_version', slotCost: 1, isFree: false },
      { choiceId: 'decline_proposal', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Espionage (2)
  // ============================================================
  {
    id: 'evt_foreign_agent_detected',
    severity: EventSeverity.Notable,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'random_chance', probability: 0.2 },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'arrest_and_interrogate', slotCost: 1, isFree: false },
      { choiceId: 'monitor_covertly', slotCost: 1, isFree: false },
      { choiceId: 'expel_from_kingdom', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_noble_intrigue_discovered',
    severity: EventSeverity.Serious,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 40 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'confront_directly', slotCost: 1, isFree: false },
      { choiceId: 'launch_counter_intelligence', slotCost: 1, isFree: false },
      { choiceId: 'ignore_for_now', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Knowledge (2)
  // ============================================================
  {
    id: 'evt_scholarly_breakthrough',
    severity: EventSeverity.Informational,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'treasury_above', threshold: 400 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_further_research', slotCost: 1, isFree: false },
      { choiceId: 'apply_practical_findings', slotCost: 1, isFree: false },
      { choiceId: 'acknowledge_achievement', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_library_fire',
    severity: EventSeverity.Serious,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'random_chance', probability: 0.07 },
      { type: 'turn_range', minTurn: 8 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'launch_restoration_effort', slotCost: 2, isFree: false },
      { choiceId: 'investigate_cause', slotCost: 1, isFree: false },
      { choiceId: 'accept_and_rebuild', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // ClassConflict (2)
  // ============================================================
  {
    id: 'evt_noble_merchant_rivalry',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 65 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 55 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'broker_compromise', slotCost: 1, isFree: false },
      { choiceId: 'uphold_noble_privileges', slotCost: 1, isFree: false },
      { choiceId: 'recognize_merchant_standing', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_clergy_merchant_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 45 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 60 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'side_with_clergy', slotCost: 1, isFree: false },
      { choiceId: 'side_with_merchants', slotCost: 1, isFree: false },
      { choiceId: 'seek_middle_ground', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },

  // ============================================================
  // Region (2)
  // ============================================================
  {
    id: 'evt_regional_development_opportunity',
    severity: EventSeverity.Informational,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'treasury_above', threshold: 300 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_development', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_local_governance', slotCost: 0, isFree: true },
      { choiceId: 'decline_investment', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
  },
  {
    id: 'evt_regional_unrest',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'stability_below', threshold: 35 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'dispatch_relief_and_reforms', slotCost: 1, isFree: false },
      { choiceId: 'send_peacekeeping_force', slotCost: 1, isFree: false },
      { choiceId: 'summon_local_leaders', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
  },

  // ============================================================
  // Kingdom (2)
  // ============================================================
  {
    id: 'evt_annual_state_assessment',
    severity: EventSeverity.Informational,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 12, maxTurn: 12 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'review_in_full', slotCost: 0, isFree: true },
      { choiceId: 'acknowledge_receipt', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },
  {
    id: 'evt_kingdom_milestone_celebrated',
    severity: EventSeverity.Notable,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'stability_above', threshold: 70 },
      { type: 'treasury_above', threshold: 600 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_state_celebration', slotCost: 1, isFree: false },
      { choiceId: 'issue_commemorative_decree', slotCost: 1, isFree: false },
      { choiceId: 'note_with_quiet_satisfaction', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
  },
];
