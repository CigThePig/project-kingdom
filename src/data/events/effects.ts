// gameplay-blueprint.md §7 — Event Choice Mechanical Effects
// Maps eventDefinitionId -> choiceId -> MechanicalEffectDelta.
// Each choice represents a genuine tradeoff; no strictly dominant options.

import type { MechanicalEffectDelta } from '../../engine/types';

export const EVENT_CHOICE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Economy (2)
  // ============================================================
  evt_merchant_capital_flight: {
    offer_tax_relief:         { treasuryDelta: -50, merchantSatDelta: +5 },
    enforce_capital_controls:  { merchantSatDelta: -3, nobilitySatDelta: +2, stabilityDelta: -2 },
    negotiate_with_guilds:     { treasuryDelta: -20, merchantSatDelta: +3 },
  },
  evt_treasury_windfall: {
    invest_in_infrastructure:  { treasuryDelta: -60, regionDevelopmentDelta: +5, stabilityDelta: +2 },
    distribute_to_populace:    { treasuryDelta: -40, commonerSatDelta: +4, merchantSatDelta: -2 },
    bolster_reserves:          { treasuryDelta: +30 },
  },

  // ============================================================
  // Food (2)
  // ============================================================
  evt_harvest_blight: {
    quarantine_affected_fields:  { foodDelta: -30, commonerSatDelta: -2, regionConditionDelta: -3 },
    redirect_labor_to_salvage:   { foodDelta: -15, commonerSatDelta: -3, stabilityDelta: -1 },
    purchase_foreign_grain:      { treasuryDelta: -80, foodDelta: +20, merchantSatDelta: +2 },
  },
  evt_commoner_harvest_festival: {
    endorse_celebrations:       { commonerSatDelta: +3, faithDelta: +2, treasuryDelta: -10 },
    observe_without_comment:    { commonerSatDelta: +1 },
  },

  // ============================================================
  // Military (2) — Chain: chain_equipment_crisis
  // ============================================================
  evt_military_equipment_shortage_1: {
    emergency_procurement:       { treasuryDelta: -60, militaryEquipmentDelta: +8, militaryCasteSatDelta: +2 },
    redistribute_existing_stock: { militaryEquipmentDelta: +4, militaryCasteSatDelta: -1, militaryReadinessDelta: -3 },
    defer_to_next_month:         { militaryEquipmentDelta: -2, militaryCasteSatDelta: -3 },
  },
  evt_military_equipment_shortage_2: {
    full_rearmament_program:     { treasuryDelta: -120, militaryEquipmentDelta: +15, militaryReadinessDelta: +5, militaryCasteSatDelta: +4 },
    request_allied_supplies:     { militaryEquipmentDelta: +8, treasuryDelta: -30 },
    reduce_force_size:           { militaryForceSizeDelta: -150, militaryEquipmentDelta: +5, commonerSatDelta: +2, militaryCasteSatDelta: -4 },
  },

  // ============================================================
  // Diplomacy (2)
  // ============================================================
  evt_neighbor_trade_overture: {
    accept_trade_terms:     { merchantSatDelta: +3, treasuryDelta: +25 },
    propose_modifications:  { merchantSatDelta: +1, treasuryDelta: +15, stabilityDelta: +1 },
    decline_politely:       { merchantSatDelta: -2 },
  },
  evt_border_tension_escalation: {
    reinforce_border_garrisons:  { treasuryDelta: -40, militaryReadinessDelta: +5, stabilityDelta: +3, regionConditionDelta: -2 },
    dispatch_diplomatic_envoy:   { treasuryDelta: -20, stabilityDelta: +2, nobilitySatDelta: +1 },
    issue_formal_protest:        { stabilityDelta: -2, militaryCasteSatDelta: -1 },
  },

  // ============================================================
  // Environment (2)
  // ============================================================
  evt_early_frost: {
    mobilize_harvest_crews:  { foodDelta: -10, commonerSatDelta: +2, treasuryDelta: -15 },
    open_emergency_stores:   { foodDelta: -25, commonerSatDelta: +3, stabilityDelta: +1 },
    accept_the_losses:       { foodDelta: -35, commonerSatDelta: -3, regionConditionDelta: -3 },
  },
  evt_spring_flooding: {
    organize_relief_effort:              { treasuryDelta: -50, commonerSatDelta: +3, regionConditionDelta: -2, stabilityDelta: +2 },
    redirect_military_engineers:         { militaryReadinessDelta: -5, regionConditionDelta: +2, commonerSatDelta: +2, militaryCasteSatDelta: -2 },
    levy_emergency_reconstruction_tax:   { treasuryDelta: +30, commonerSatDelta: -4, merchantSatDelta: -3, regionConditionDelta: +3 },
  },

  // ============================================================
  // PublicOrder (2)
  // ============================================================
  evt_commoner_labor_dispute: {
    mediate_negotiations:       { commonerSatDelta: +2, nobilitySatDelta: -1, stabilityDelta: +2 },
    side_with_laborers:         { commonerSatDelta: +4, nobilitySatDelta: -3, merchantSatDelta: -2 },
    enforce_existing_contracts: { commonerSatDelta: -3, nobilitySatDelta: +2, merchantSatDelta: +2, stabilityDelta: -1 },
  },
  evt_popular_unrest: {
    address_grievances_publicly: { commonerSatDelta: +5, stabilityDelta: +3, nobilitySatDelta: -2 },
    deploy_peacekeepers:         { commonerSatDelta: -2, stabilityDelta: +5, militaryReadinessDelta: -3, militaryCasteSatDelta: -1 },
    impose_curfew:               { commonerSatDelta: -4, stabilityDelta: +4, merchantSatDelta: -3 },
  },

  // ============================================================
  // Religion (2)
  // ============================================================
  evt_heresy_emergence: {
    investigate_teachings:       { clergySatDelta: +2, heterodoxyDelta: -3, treasuryDelta: -15 },
    suppress_immediately:        { clergySatDelta: +3, heterodoxyDelta: -5, commonerSatDelta: -2, stabilityDelta: -2 },
    permit_theological_debate:   { clergySatDelta: -2, heterodoxyDelta: +3, culturalCohesionDelta: +2, commonerSatDelta: +1 },
  },
  evt_schism_crisis: {
    convene_ecclesiastical_council: { treasuryDelta: -80, clergySatDelta: +4, faithDelta: +5, heterodoxyDelta: -8, stabilityDelta: +3 },
    enforce_state_doctrine:          { clergySatDelta: +2, heterodoxyDelta: -5, commonerSatDelta: -3, stabilityDelta: -2, faithDelta: +3 },
    allow_coexistence:               { clergySatDelta: -3, heterodoxyDelta: +2, culturalCohesionDelta: -3, commonerSatDelta: +2, faithDelta: -2 },
  },

  // ============================================================
  // Culture (2)
  // ============================================================
  evt_foreign_cultural_influx: {
    embrace_exchange:           { culturalCohesionDelta: -3, merchantSatDelta: +2, commonerSatDelta: +1 },
    regulate_foreign_practices: { culturalCohesionDelta: +2, merchantSatDelta: -2, stabilityDelta: +1 },
    observe_and_assess:         { culturalCohesionDelta: -1 },
  },
  evt_cultural_festival_proposal: {
    approve_full_festival:   { treasuryDelta: -40, faithDelta: +3, clergySatDelta: +3, commonerSatDelta: +2, culturalCohesionDelta: +3 },
    approve_modest_version:  { treasuryDelta: -15, faithDelta: +1, clergySatDelta: +1, commonerSatDelta: +1, culturalCohesionDelta: +1 },
    decline_proposal:        { clergySatDelta: -2, faithDelta: -1, culturalCohesionDelta: -1 },
  },

  // ============================================================
  // Espionage (2)
  // ============================================================
  evt_foreign_agent_detected: {
    arrest_and_interrogate: { espionageNetworkDelta: +5, stabilityDelta: +2, treasuryDelta: -10 },
    monitor_covertly:       { espionageNetworkDelta: +8, stabilityDelta: -1 },
    expel_from_kingdom:     { stabilityDelta: +1, espionageNetworkDelta: -2 },
  },
  evt_noble_intrigue_discovered: {
    confront_directly:           { nobilitySatDelta: -4, stabilityDelta: +3, commonerSatDelta: +2 },
    launch_counter_intelligence: { espionageNetworkDelta: +6, treasuryDelta: -30, nobilitySatDelta: -1 },
    ignore_for_now:              { nobilitySatDelta: +1, stabilityDelta: -3 },
  },

  // ============================================================
  // Knowledge (2)
  // ============================================================
  evt_scholarly_breakthrough: {
    fund_further_research:    { treasuryDelta: -40, clergySatDelta: +3 },
    apply_practical_findings: { treasuryDelta: -20, commonerSatDelta: +2, merchantSatDelta: +2 },
    acknowledge_achievement:  { clergySatDelta: +1 },
  },
  evt_library_fire: {
    launch_restoration_effort: { treasuryDelta: -100, clergySatDelta: +3, culturalCohesionDelta: +2 },
    investigate_cause:         { treasuryDelta: -25, espionageNetworkDelta: +3, stabilityDelta: +1 },
    accept_and_rebuild:        { treasuryDelta: -40, clergySatDelta: -2, culturalCohesionDelta: -2 },
  },

  // ============================================================
  // ClassConflict (2)
  // ============================================================
  evt_noble_merchant_rivalry: {
    broker_compromise:            { nobilitySatDelta: +1, merchantSatDelta: +1, stabilityDelta: +2, treasuryDelta: -15 },
    uphold_noble_privileges:      { nobilitySatDelta: +4, merchantSatDelta: -4, stabilityDelta: -1 },
    recognize_merchant_standing:  { merchantSatDelta: +4, nobilitySatDelta: -4, treasuryDelta: +20 },
  },
  evt_clergy_merchant_dispute: {
    side_with_clergy:     { clergySatDelta: +4, merchantSatDelta: -3, faithDelta: +2 },
    side_with_merchants:  { merchantSatDelta: +4, clergySatDelta: -3, treasuryDelta: +15 },
    seek_middle_ground:   { clergySatDelta: +1, merchantSatDelta: +1, stabilityDelta: +1, treasuryDelta: -10 },
  },

  // ============================================================
  // Region (2)
  // ============================================================
  evt_regional_development_opportunity: {
    approve_development:       { treasuryDelta: -50, regionDevelopmentDelta: +8, commonerSatDelta: +2, merchantSatDelta: +2 },
    defer_to_local_governance: { regionDevelopmentDelta: +2, commonerSatDelta: +1 },
    decline_investment:        { commonerSatDelta: -1 },
  },
  evt_regional_unrest: {
    dispatch_relief_and_reforms: { treasuryDelta: -45, commonerSatDelta: +4, stabilityDelta: +3, regionConditionDelta: +3 },
    send_peacekeeping_force:     { militaryReadinessDelta: -3, stabilityDelta: +4, commonerSatDelta: -2, regionConditionDelta: +1 },
    summon_local_leaders:        { commonerSatDelta: +2, nobilitySatDelta: +1, stabilityDelta: +1 },
  },

  // ============================================================
  // Kingdom (2)
  // ============================================================
  evt_annual_state_assessment: {
    review_in_full:       { stabilityDelta: +2 },
    acknowledge_receipt:  { stabilityDelta: +1 },
  },
  evt_kingdom_milestone_celebrated: {
    host_state_celebration:         { treasuryDelta: -50, commonerSatDelta: +3, nobilitySatDelta: +2, stabilityDelta: +3 },
    issue_commemorative_decree:     { treasuryDelta: -20, nobilitySatDelta: +2, stabilityDelta: +2 },
    note_with_quiet_satisfaction:   { stabilityDelta: +1 },
  },
};
