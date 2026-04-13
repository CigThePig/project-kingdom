// gameplay-blueprint.md §7 — Event Pool Definitions
// 52 events: base pool + pattern-reactive, chain events (plague, trade war, succession, famine, schism), follow-ups, and high-stakes standalone.

import type { EventDefinition } from '../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../engine/types';
import { FACTION_REQUEST_POOL } from './faction-requests';

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
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'offer_tax_relief', followUpDefinitionId: 'evt_merchant_permanent_concessions', delayTurns: 3, probability: 0.7 },
    ],
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
    phase: 'opening',
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
    phase: 'opening',
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
      { choiceId: 'acknowledge', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
    classification: 'notification',
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
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'defer_to_next_month', followUpDefinitionId: 'evt_equipment_failure_field', delayTurns: 2, probability: 0.6 },
    ],
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
    phase: 'any',
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
    phase: 'any',
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
    phase: 'developing',
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
    phase: 'opening',
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
    phase: 'opening',
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
    phase: 'any',
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
    phase: 'any',
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
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'suppress_immediately', followUpDefinitionId: 'evt_underground_heretical_movement', delayTurns: 3, probability: 0.5 },
    ],
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
    phase: 'any',
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
    phase: 'any',
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
    phase: 'opening',
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
    phase: 'any',
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
    phase: 'developing',
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
    phase: 'opening',
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
    phase: 'any',
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
    phase: 'developing',
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
    phase: 'developing',
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
    phase: 'opening',
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
    phase: 'developing',
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
      { choiceId: 'acknowledge', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    classification: 'notification',
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
    phase: 'any',
  },

  // ============================================================
  // CLASS-SPECIFIC: Nobility (3)
  // ============================================================
  {
    id: 'evt_noble_succession_dispute',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mediate_succession', slotCost: 1, isFree: false },
      { choiceId: 'support_senior_claimant', slotCost: 1, isFree: false },
      { choiceId: 'let_nobles_settle_it', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_noble_court_faction',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'stability_below', threshold: 50 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 55 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'co_opt_faction_leaders', slotCost: 1, isFree: false },
      { choiceId: 'publicly_denounce_faction', slotCost: 1, isFree: false },
      { choiceId: 'monitor_faction_quietly', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_noble_land_seizure',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 65 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reverse_seizures', slotCost: 1, isFree: false },
      { choiceId: 'impose_compensation', slotCost: 1, isFree: false },
      { choiceId: 'uphold_noble_claims', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // CLASS-SPECIFIC: Clergy (3)
  // ============================================================
  {
    id: 'evt_clergy_monastic_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_above', threshold: 50 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'arbitrate_dispute', slotCost: 1, isFree: false },
      { choiceId: 'favor_established_order', slotCost: 1, isFree: false },
      { choiceId: 'leave_to_ecclesiastical_courts', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_clergy_pilgrimage_movement',
    severity: EventSeverity.Informational,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_above', threshold: 60 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'endorse_pilgrimage', slotCost: 0, isFree: true },
      { choiceId: 'provide_royal_escort', slotCost: 1, isFree: false },
      { choiceId: 'discourage_travel', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_clergy_prophecy_claim',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 30 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'investigate_prophecy', slotCost: 1, isFree: false },
      { choiceId: 'endorse_as_divine_sign', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_as_superstition', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // CLASS-SPECIFIC: Merchants (3)
  // ============================================================
  {
    id: 'evt_merchant_guild_formation',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 55 },
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_guild_charter', slotCost: 1, isFree: false },
      { choiceId: 'impose_royal_oversight', slotCost: 1, isFree: false },
      { choiceId: 'deny_guild_petition', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_merchant_smuggling_ring',
    severity: EventSeverity.Serious,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'random_chance', probability: 0.15 },
      { type: 'turn_range', minTurn: 6 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'raid_smuggling_operation', slotCost: 1, isFree: false },
      { choiceId: 'infiltrate_network', slotCost: 1, isFree: false },
      { choiceId: 'levy_fines_and_warn', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_merchant_foreign_traders',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_above', threshold: 400 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'welcome_foreign_merchants', slotCost: 0, isFree: true },
      { choiceId: 'negotiate_trade_terms', slotCost: 1, isFree: false },
      { choiceId: 'restrict_foreign_access', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // CLASS-SPECIFIC: Commoners (3)
  // ============================================================
  {
    id: 'evt_commoner_plague_outbreak',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'food_below', threshold: 100 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'quarantine_affected_districts', slotCost: 1, isFree: false },
      { choiceId: 'mobilize_clergy_healers', slotCost: 1, isFree: false },
      { choiceId: 'distribute_herbal_remedies', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_commoner_folk_hero',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
      { type: 'stability_below', threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invite_to_court', slotCost: 1, isFree: false },
      { choiceId: 'co_opt_folk_narrative', slotCost: 1, isFree: false },
      { choiceId: 'ignore_the_stories', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_commoner_migration_wave',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'random_chance', probability: 0.2 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'manage_resettlement', slotCost: 1, isFree: false },
      { choiceId: 'restrict_movement', slotCost: 1, isFree: false },
      { choiceId: 'allow_natural_flow', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // CLASS-SPECIFIC: Military Caste (3)
  // ============================================================
  {
    id: 'evt_military_veteran_demands',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_veteran_pensions', slotCost: 1, isFree: false },
      { choiceId: 'offer_land_grants', slotCost: 1, isFree: false },
      { choiceId: 'acknowledge_service_only', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_military_desertion_crisis',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 35 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 35 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_military_pay', slotCost: 1, isFree: false },
      { choiceId: 'enforce_harsh_discipline', slotCost: 1, isFree: false },
      { choiceId: 'appeal_to_honor', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_military_honor_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 50 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'uphold_military_merit', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_noble_rank', slotCost: 1, isFree: false },
      { choiceId: 'establish_joint_council', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // SEASONAL: Spring (2)
  // ============================================================
  {
    id: 'evt_spring_planting_festival',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'food_above', threshold: 150 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'sponsor_planting_rites', slotCost: 1, isFree: false },
      { choiceId: 'attend_ceremonies', slotCost: 0, isFree: true },
      { choiceId: 'decline_involvement', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_spring_river_thaw',
    severity: EventSeverity.Notable,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reinforce_riverbanks', slotCost: 1, isFree: false },
      { choiceId: 'evacuate_lowlands', slotCost: 1, isFree: false },
      { choiceId: 'monitor_water_levels', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // SEASONAL: Summer (2)
  // ============================================================
  {
    id: 'evt_summer_drought',
    severity: EventSeverity.Serious,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'ration_water_supplies', slotCost: 1, isFree: false },
      { choiceId: 'dig_emergency_wells', slotCost: 1, isFree: false },
      { choiceId: 'pray_for_rain', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_summer_trade_season',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'treasury_above', threshold: 300 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_trade_fair', slotCost: 1, isFree: false },
      { choiceId: 'reduce_trade_tariffs', slotCost: 1, isFree: false },
      { choiceId: 'maintain_current_policy', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // SEASONAL: Autumn (2)
  // ============================================================
  {
    id: 'evt_autumn_harvest_bounty',
    severity: EventSeverity.Informational,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'food_above', threshold: 200 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'stockpile_surplus', slotCost: 0, isFree: true },
      { choiceId: 'export_for_profit', slotCost: 1, isFree: false },
      { choiceId: 'distribute_to_poor', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_autumn_bandit_raids',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'stability_below', threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'dispatch_patrol_forces', slotCost: 1, isFree: false },
      { choiceId: 'arm_rural_militia', slotCost: 1, isFree: false },
      { choiceId: 'increase_road_patrols', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // SEASONAL: Winter (2)
  // ============================================================
  {
    id: 'evt_winter_blizzard',
    severity: EventSeverity.Serious,
    category: EventCategory.Environment,
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'open_warming_shelters', slotCost: 1, isFree: false },
      { choiceId: 'distribute_fuel_and_blankets', slotCost: 1, isFree: false },
      { choiceId: 'wait_out_the_storm', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_winter_food_shortage',
    severity: EventSeverity.Serious,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'food_below', threshold: 80 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'impose_strict_rationing', slotCost: 1, isFree: false },
      { choiceId: 'purchase_emergency_grain', slotCost: 1, isFree: false },
      { choiceId: 'request_neighbor_aid', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // REGIONAL (6)
  // ============================================================
  {
    id: 'evt_region_mine_collapse',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'random_chance', probability: 0.1 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'launch_rescue_operation', slotCost: 1, isFree: false },
      { choiceId: 'hire_foreign_engineers', slotCost: 1, isFree: false },
      { choiceId: 'seal_and_rebuild', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_region_trade_route_disruption',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'stability_below', threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'military_escort_caravans', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_safe_passage', slotCost: 1, isFree: false },
      { choiceId: 'reroute_trade', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },
  // evt_region_local_festival — removed, reclassified as World Pulse (see tension-audit.ts)
  {
    id: 'evt_region_resource_discovery',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'treasury_above', threshold: 300 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_extraction', slotCost: 1, isFree: false },
      { choiceId: 'auction_rights', slotCost: 1, isFree: false },
      { choiceId: 'survey_further', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_region_infrastructure_decay',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_major_repairs', slotCost: 1, isFree: false },
      { choiceId: 'levy_local_labor', slotCost: 1, isFree: false },
      { choiceId: 'defer_maintenance', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_region_separatist_sentiment',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'stability_below', threshold: 30 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 30 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'negotiate_autonomy_terms', slotCost: 1, isFree: false },
      { choiceId: 'dispatch_royal_governor', slotCost: 1, isFree: false },
      { choiceId: 'show_of_force', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // ESCALATION (6)
  // ============================================================
  {
    id: 'evt_escalation_famine_panic',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'food_below', threshold: 50 },
      { type: 'stability_below', threshold: 40 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'seize_noble_granaries', slotCost: 1, isFree: false },
      { choiceId: 'enforce_martial_rationing', slotCost: 1, isFree: false },
      { choiceId: 'appeal_for_calm', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_escalation_treasury_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_below', threshold: 50 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_asset_sales', slotCost: 1, isFree: false },
      { choiceId: 'demand_noble_contributions', slotCost: 1, isFree: false },
      { choiceId: 'suspend_non_essential_spending', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_escalation_faith_collapse',
    severity: EventSeverity.Critical,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_below', threshold: 25 },
      { type: 'heterodoxy_above', threshold: 60 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'call_grand_synod', slotCost: 2, isFree: false },
      { choiceId: 'impose_state_religion', slotCost: 1, isFree: false },
      { choiceId: 'embrace_pluralism', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_escalation_military_mutiny',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 20 },
      { type: 'military_readiness_below', threshold: 30 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'meet_mutiny_demands', slotCost: 1, isFree: false },
      { choiceId: 'isolate_ringleaders', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_with_officers', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_escalation_noble_conspiracy',
    severity: EventSeverity.Critical,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 20 },
      { type: 'stability_below', threshold: 30 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'preemptive_arrests', slotCost: 1, isFree: false },
      { choiceId: 'offer_reconciliation', slotCost: 1, isFree: false },
      { choiceId: 'plant_double_agents', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_escalation_mass_exodus',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 20 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 20 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'promise_sweeping_reforms', slotCost: 1, isFree: false },
      { choiceId: 'close_borders', slotCost: 1, isFree: false },
      { choiceId: 'let_dissenters_leave', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // FOLLOW-UP EVENTS (12) — Consequence-triggered by prior choices
  // ============================================================

  // 1. Scholarly Breakthrough → Fund Further Research
  {
    id: 'evt_scholarly_discovery',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_scholarly_breakthrough:fund_further_research', minTurnsSinceConsequence: 3 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_scholarly_discovery:patent_discovery' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_scholarly_discovery:share_with_clergy' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_scholarly_discovery:apply_to_military' },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'patent_discovery', slotCost: 1, isFree: false },
      { choiceId: 'share_with_clergy', slotCost: 1, isFree: false },
      { choiceId: 'apply_to_military', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 2. Scholarly Breakthrough → Apply Practical Findings
  {
    id: 'evt_practical_innovation_success',
    severity: EventSeverity.Notable,
    category: EventCategory.Knowledge,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_scholarly_breakthrough:apply_practical_findings', minTurnsSinceConsequence: 2 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_practical_innovation_success:expand_workshops' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_practical_innovation_success:train_artisans' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_practical_innovation_success:present_to_court' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_workshops', slotCost: 1, isFree: false },
      { choiceId: 'train_artisans', slotCost: 1, isFree: false },
      { choiceId: 'present_to_court', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 3. Merchant Capital Flight → Offer Tax Relief
  {
    id: 'evt_merchant_demands_escalate',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_merchant_capital_flight:offer_tax_relief', minTurnsSinceConsequence: 3 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 40 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_demands_escalate:hold_firm_on_terms' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_demands_escalate:extend_concessions' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_demands_escalate:impose_trade_conditions' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hold_firm_on_terms', slotCost: 1, isFree: false },
      { choiceId: 'extend_concessions', slotCost: 1, isFree: false },
      { choiceId: 'impose_trade_conditions', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 4. Merchant Capital Flight → Enforce Capital Controls
  {
    id: 'evt_merchant_underground_economy',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_merchant_capital_flight:enforce_capital_controls', minTurnsSinceConsequence: 2 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_underground_economy:raid_smuggling_networks' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_underground_economy:legitimize_shadow_trade' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_merchant_underground_economy:increase_enforcement' },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'raid_smuggling_networks', slotCost: 1, isFree: false },
      { choiceId: 'legitimize_shadow_trade', slotCost: 1, isFree: false },
      { choiceId: 'increase_enforcement', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 5. Commoner Labor Dispute → Side with Laborers
  {
    id: 'evt_noble_backlash_labor',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_commoner_labor_dispute:side_with_laborers', minTurnsSinceConsequence: 2 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_noble_backlash_labor:appease_nobles' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_noble_backlash_labor:stand_firm' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_noble_backlash_labor:offer_compromise' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'appease_nobles', slotCost: 1, isFree: false },
      { choiceId: 'stand_firm', slotCost: 1, isFree: false },
      { choiceId: 'offer_compromise', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 6. Commoner Labor Dispute → Enforce Existing Contracts
  {
    id: 'evt_commoner_work_slowdown',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_commoner_labor_dispute:enforce_existing_contracts', minTurnsSinceConsequence: 2 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_commoner_work_slowdown:impose_work_quotas' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_commoner_work_slowdown:open_dialogue' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_commoner_work_slowdown:hire_foreign_labor' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'impose_work_quotas', slotCost: 1, isFree: false },
      { choiceId: 'open_dialogue', slotCost: 1, isFree: false },
      { choiceId: 'hire_foreign_labor', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 7. Heresy Emergence → Permit Theological Debate
  {
    id: 'evt_theological_schism_brewing',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_heresy_emergence:permit_theological_debate', minTurnsSinceConsequence: 3 },
      { type: 'heterodoxy_above', threshold: 45 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_theological_schism_brewing:host_grand_debate' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_theological_schism_brewing:quietly_suppress' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_theological_schism_brewing:embrace_new_thought' },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_grand_debate', slotCost: 2, isFree: false },
      { choiceId: 'quietly_suppress', slotCost: 1, isFree: false },
      { choiceId: 'embrace_new_thought', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 8. Noble Intrigue Discovered → Launch Counter Intelligence
  {
    id: 'evt_intelligence_network_payoff',
    severity: EventSeverity.Notable,
    category: EventCategory.Espionage,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_noble_intrigue_discovered:launch_counter_intelligence', minTurnsSinceConsequence: 3 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_intelligence_network_payoff:expose_conspiracy' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_intelligence_network_payoff:leverage_for_loyalty' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_intelligence_network_payoff:share_with_allies' },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expose_conspiracy', slotCost: 1, isFree: false },
      { choiceId: 'leverage_for_loyalty', slotCost: 1, isFree: false },
      { choiceId: 'share_with_allies', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 9. Harvest Blight → Purchase Foreign Grain
  {
    id: 'evt_foreign_grain_dependency',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_harvest_blight:purchase_foreign_grain', minTurnsSinceConsequence: 3 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_foreign_grain_dependency:invest_in_domestic_agriculture' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_foreign_grain_dependency:negotiate_long_term_supply' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_foreign_grain_dependency:accept_dependency' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invest_in_domestic_agriculture', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_long_term_supply', slotCost: 1, isFree: false },
      { choiceId: 'accept_dependency', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 10. Region Resource Discovery → Fund Extraction
  {
    id: 'evt_resource_boom',
    severity: EventSeverity.Notable,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_region_resource_discovery:fund_extraction', minTurnsSinceConsequence: 4 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_resource_boom:expand_operations' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_resource_boom:tax_windfall' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_resource_boom:establish_workers_rights' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_operations', slotCost: 1, isFree: false },
      { choiceId: 'tax_windfall', slotCost: 1, isFree: false },
      { choiceId: 'establish_workers_rights', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 11. Commoner Plague Outbreak → Mobilize Clergy Healers
  {
    id: 'evt_clergy_healing_reputation',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_commoner_plague_outbreak:mobilize_clergy_healers', minTurnsSinceConsequence: 2 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_clergy_healing_reputation:establish_permanent_hospice' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_clergy_healing_reputation:leverage_piety' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_clergy_healing_reputation:return_to_normal' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_permanent_hospice', slotCost: 1, isFree: false },
      { choiceId: 'leverage_piety', slotCost: 1, isFree: false },
      { choiceId: 'return_to_normal', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // 12. Military Desertion Crisis → Increase Military Pay
  {
    id: 'evt_military_pay_expectation',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'consequence_tag_present', consequenceTag: 'evt_military_desertion_crisis:increase_military_pay', minTurnsSinceConsequence: 3 },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_military_pay_expectation:institutionalize_pay_scale' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_military_pay_expectation:revert_to_standard_pay' },
      { type: 'consequence_tag_absent', consequenceTag: 'evt_military_pay_expectation:offer_land_instead' },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'institutionalize_pay_scale', slotCost: 1, isFree: false },
      { choiceId: 'revert_to_standard_pay', slotCost: 1, isFree: false },
      { choiceId: 'offer_land_instead', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // PATTERN-REACTIVE EVENTS (4)
  // ============================================================
  {
    id: 'evt_noble_resentment_merchant_favor',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 70 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 45 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'appease_nobility', slotCost: 1, isFree: false },
      { choiceId: 'maintain_merchant_policies', slotCost: 1, isFree: false },
      { choiceId: 'mediate_compromise', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_commoner_uprising_neglect',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 25 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_food_distribution', slotCost: 1, isFree: false },
      { choiceId: 'deploy_military_patrols', slotCost: 1, isFree: false },
      { choiceId: 'announce_labor_reforms', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_clergy_power_grab',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 80 },
      { type: 'faith_above', threshold: 70 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'assert_royal_authority', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_boundaries', slotCost: 1, isFree: false },
      { choiceId: 'accept_clergy_influence', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },
  {
    id: 'evt_military_coup_threat',
    severity: EventSeverity.Critical,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 25 },
      { type: 'military_readiness_below', threshold: 40 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'purge_conspirators', slotCost: 2, isFree: false },
      { choiceId: 'bribe_officer_corps', slotCost: 1, isFree: false },
      { choiceId: 'address_grievances', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // CHAIN: Plague (3 steps) — chain_plague
  // ============================================================
  {
    id: 'evt_plague_outbreak',
    severity: EventSeverity.Critical,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 1.5,
    chainId: 'chain_plague',
    chainStep: 1,
    chainNextDefinitionId: 'evt_plague_spread',
    choices: [
      { choiceId: 'immediate_quarantine', slotCost: 1, isFree: false },
      { choiceId: 'mobilize_healers', slotCost: 1, isFree: false },
      { choiceId: 'pray_for_deliverance', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_plague_spread',
    severity: EventSeverity.Critical,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_plague',
    chainStep: 2,
    chainNextDefinitionId: 'evt_plague_aftermath',
    choices: [
      { choiceId: 'strict_lockdown', slotCost: 1, isFree: false },
      { choiceId: 'burn_infected_quarters', slotCost: 1, isFree: false },
      { choiceId: 'import_foreign_medicine', slotCost: 2, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_plague_aftermath',
    severity: EventSeverity.Serious,
    category: EventCategory.Region,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_plague',
    chainStep: 3,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'rebuild_and_memorialize', slotCost: 1, isFree: false },
      { choiceId: 'impose_sanitation_laws', slotCost: 1, isFree: false },
      { choiceId: 'exploit_cheap_labor', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // CHAIN: Trade War (3 steps) — chain_trade_war
  // ============================================================
  {
    id: 'evt_trade_war_tariffs',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: 'chain_trade_war',
    chainStep: 1,
    chainNextDefinitionId: 'evt_trade_war_escalation',
    choices: [
      { choiceId: 'retaliatory_tariffs', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_terms', slotCost: 1, isFree: false },
      { choiceId: 'absorb_the_costs', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_trade_war_escalation',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_trade_war',
    chainStep: 2,
    chainNextDefinitionId: 'evt_trade_war_resolution',
    choices: [
      { choiceId: 'embargo_neighbor', slotCost: 1, isFree: false },
      { choiceId: 'seek_alternative_markets', slotCost: 1, isFree: false },
      { choiceId: 'capitulate', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_trade_war_resolution',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_trade_war',
    chainStep: 3,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'favorable_treaty', slotCost: 1, isFree: false },
      { choiceId: 'mutual_concessions', slotCost: 1, isFree: false },
      { choiceId: 'accept_losses', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // CHAIN: Succession Crisis (3 steps) — chain_succession
  // ============================================================
  {
    id: 'evt_succession_question',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 10 },
      { type: 'random_chance', probability: 0.15 },
      { type: 'stability_below', threshold: 50 },
    ],
    weight: 1.3,
    chainId: 'chain_succession',
    chainStep: 1,
    chainNextDefinitionId: 'evt_succession_factions',
    choices: [
      { choiceId: 'declare_heir', slotCost: 1, isFree: false },
      { choiceId: 'convene_council', slotCost: 1, isFree: false },
      { choiceId: 'silence_rumors', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_succession_factions',
    severity: EventSeverity.Critical,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_succession',
    chainStep: 2,
    chainNextDefinitionId: 'evt_succession_resolution',
    choices: [
      { choiceId: 'back_eldest_claim', slotCost: 1, isFree: false },
      { choiceId: 'support_merit_candidate', slotCost: 1, isFree: false },
      { choiceId: 'play_factions', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_succession_resolution',
    severity: EventSeverity.Serious,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_succession',
    chainStep: 3,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crown_heir_publicly', slotCost: 1, isFree: false },
      { choiceId: 'exile_rivals', slotCost: 1, isFree: false },
      { choiceId: 'grant_rival_concessions', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // CHAIN: Famine (3 steps) — chain_famine
  // ============================================================
  {
    id: 'evt_food_shortage_warning',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'food_below', threshold: 50 },
      { type: 'season_is', season: Season.Winter },
    ],
    weight: 1.2,
    chainId: 'chain_famine',
    chainStep: 1,
    chainNextDefinitionId: 'evt_famine_crisis',
    choices: [
      { choiceId: 'impose_strict_rationing', slotCost: 1, isFree: false },
      { choiceId: 'buy_grain_reserves', slotCost: 1, isFree: false },
      { choiceId: 'reduce_military_rations', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
  {
    id: 'evt_famine_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_famine',
    chainStep: 2,
    chainNextDefinitionId: 'evt_famine_recovery',
    choices: [
      { choiceId: 'open_royal_granaries', slotCost: 1, isFree: false },
      { choiceId: 'commandeer_noble_stores', slotCost: 1, isFree: false },
      { choiceId: 'appeal_to_neighbors', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_famine_recovery',
    severity: EventSeverity.Notable,
    category: EventCategory.Food,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_famine',
    chainStep: 3,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invest_in_agriculture', slotCost: 1, isFree: false },
      { choiceId: 'establish_grain_reserves', slotCost: 1, isFree: false },
      { choiceId: 'celebrate_survival', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // CHAIN: Religious Schism (3 steps) — chain_schism
  // ============================================================
  {
    id: 'evt_doctrinal_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 40 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    chainId: 'chain_schism',
    chainStep: 1,
    chainNextDefinitionId: 'evt_schism_factions',
    choices: [
      { choiceId: 'convene_theological_council', slotCost: 1, isFree: false },
      { choiceId: 'enforce_orthodox_doctrine', slotCost: 1, isFree: false },
      { choiceId: 'allow_scholarly_debate', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'evt_schism_factions',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_schism',
    chainStep: 2,
    chainNextDefinitionId: 'evt_schism_resolution',
    choices: [
      { choiceId: 'support_reformers', slotCost: 1, isFree: false },
      { choiceId: 'back_traditionalists', slotCost: 1, isFree: false },
      { choiceId: 'remain_neutral', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_schism_resolution',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: 'chain_schism',
    chainStep: 3,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'declare_unified_doctrine', slotCost: 1, isFree: false },
      { choiceId: 'formalize_tolerance', slotCost: 1, isFree: false },
      { choiceId: 'suppress_dissent', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // FOLLOW-UP & CHOICE-TRIGGERED EVENTS
  // NOTE: Follow-up-only events (always-trigger, no chain) have been
  // moved to FOLLOW_UP_POOL below. Only chain step 2+ events and
  // properly-gated standalone events remain here.
  // ============================================================
  {
    id: 'evt_golden_age_opportunity',
    severity: EventSeverity.Notable,
    category: EventCategory.Culture,
    triggerConditions: [
      { type: 'turn_range', minTurn: 8 },
      { type: 'stability_above', threshold: 65 },
      { type: 'treasury_above', threshold: 600 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'patron_arts_sciences', slotCost: 2, isFree: false },
      { choiceId: 'host_grand_festival', slotCost: 1, isFree: false },
      { choiceId: 'invest_in_education', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // HIGH-STAKES STANDALONE EVENTS (2)
  // ============================================================
  {
    id: 'evt_assassination_attempt',
    severity: EventSeverity.Critical,
    category: EventCategory.Kingdom,
    triggerConditions: [
      { type: 'turn_range', minTurn: 8 },
      { type: 'stability_below', threshold: 35 },
      { type: 'random_chance', probability: 0.1 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'purge_inner_circle', slotCost: 2, isFree: false },
      { choiceId: 'increase_royal_guard', slotCost: 1, isFree: false },
      { choiceId: 'show_mercy', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_foreign_invasion_rumor',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mobilize_defenses', slotCost: 1, isFree: false },
      { choiceId: 'dispatch_scouts', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_as_rumor', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // Phase 6.5 — Faction Request Petitions (15)
  // Imported from faction-requests.ts and spread into the main pool
  // so the event engine can surface them through the standard pipeline.
  // ============================================================
  ...FACTION_REQUEST_POOL,
];

// ============================================================
// FOLLOW-UP POOL — events surfaced only by the follow-up tracker.
// These use triggerConditions: [{ type: 'always' }] which is safe
// because the follow-up tracker bypasses trigger checks. They must
// NEVER be in EVENT_POOL, where surfaceEvents() would fire them
// unconditionally every turn.
// ============================================================
export const FOLLOW_UP_POOL: EventDefinition[] = [
  {
    id: 'evt_merchant_permanent_concessions',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_permanent_charter', slotCost: 1, isFree: false },
      { choiceId: 'reject_demands', slotCost: 1, isFree: false },
      { choiceId: 'offer_limited_concession', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_underground_heretical_movement',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'infiltrate_movement', slotCost: 1, isFree: false },
      { choiceId: 'public_amnesty', slotCost: 1, isFree: false },
      { choiceId: 'double_down_suppression', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
  {
    id: 'evt_equipment_failure_field',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'always' },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_field_repair', slotCost: 1, isFree: false },
      { choiceId: 'retreat_and_regroup', slotCost: 1, isFree: false },
      { choiceId: 'push_through', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];
