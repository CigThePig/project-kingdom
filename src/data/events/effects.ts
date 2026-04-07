// gameplay-blueprint.md §7 — Event Choice Mechanical Effects
// Maps eventDefinitionId -> choiceId -> MechanicalEffectDelta.
// Each choice represents a genuine tradeoff; no strictly dominant options.

import type { MechanicalEffectDelta } from '../../engine/types';
import { FACTION_REQUEST_EFFECTS } from './faction-request-effects';

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

  // ============================================================
  // CLASS-SPECIFIC: Nobility (3)
  // ============================================================
  evt_noble_succession_dispute: {
    mediate_succession:        { nobilitySatDelta: +2, stabilityDelta: +3, treasuryDelta: -25 },
    support_senior_claimant:   { nobilitySatDelta: +4, commonerSatDelta: -2, stabilityDelta: +1 },
    let_nobles_settle_it:      { nobilitySatDelta: -3, stabilityDelta: -4 },
  },
  evt_noble_court_faction: {
    co_opt_faction_leaders:    { nobilitySatDelta: +3, treasuryDelta: -30, stabilityDelta: +2 },
    publicly_denounce_faction: { nobilitySatDelta: -4, commonerSatDelta: +2, stabilityDelta: -1 },
    monitor_faction_quietly:   { nobilitySatDelta: -1, espionageNetworkDelta: +3 },
  },
  evt_noble_land_seizure: {
    reverse_seizures:          { nobilitySatDelta: -5, commonerSatDelta: +4, stabilityDelta: +2 },
    impose_compensation:       { nobilitySatDelta: -2, commonerSatDelta: +2, treasuryDelta: +15 },
    uphold_noble_claims:       { nobilitySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -2 },
  },

  // ============================================================
  // CLASS-SPECIFIC: Clergy (3)
  // ============================================================
  evt_clergy_monastic_dispute: {
    arbitrate_dispute:                { clergySatDelta: +2, faithDelta: +2, treasuryDelta: -15 },
    favor_established_order:          { clergySatDelta: +3, heterodoxyDelta: -2, commonerSatDelta: -1 },
    leave_to_ecclesiastical_courts:   { clergySatDelta: -1, faithDelta: -1 },
  },
  evt_clergy_pilgrimage_movement: {
    endorse_pilgrimage:     { faithDelta: +3, clergySatDelta: +2, commonerSatDelta: +1 },
    provide_royal_escort:   { faithDelta: +4, clergySatDelta: +3, treasuryDelta: -25, militaryReadinessDelta: -2 },
    discourage_travel:      { clergySatDelta: -2, faithDelta: -1, commonerSatDelta: -1 },
  },
  evt_clergy_prophecy_claim: {
    investigate_prophecy:      { clergySatDelta: +1, treasuryDelta: -20, heterodoxyDelta: -3, espionageNetworkDelta: +2 },
    endorse_as_divine_sign:   { faithDelta: +5, clergySatDelta: +3, heterodoxyDelta: +4, nobilitySatDelta: -2 },
    dismiss_as_superstition:  { clergySatDelta: -3, commonerSatDelta: -1, heterodoxyDelta: -1 },
  },

  // ============================================================
  // CLASS-SPECIFIC: Merchants (3)
  // ============================================================
  evt_merchant_guild_formation: {
    grant_guild_charter:      { merchantSatDelta: +5, nobilitySatDelta: -2, stabilityDelta: +1 },
    impose_royal_oversight:   { merchantSatDelta: +1, nobilitySatDelta: +1, stabilityDelta: +2 },
    deny_guild_petition:      { merchantSatDelta: -4, stabilityDelta: -1 },
  },
  evt_merchant_smuggling_ring: {
    raid_smuggling_operation: { merchantSatDelta: -3, treasuryDelta: +40, espionageNetworkDelta: +3, stabilityDelta: +2 },
    infiltrate_network:       { espionageNetworkDelta: +6, treasuryDelta: -15, merchantSatDelta: -1 },
    levy_fines_and_warn:      { merchantSatDelta: -2, treasuryDelta: +25, stabilityDelta: +1 },
  },
  evt_merchant_foreign_traders: {
    welcome_foreign_merchants:  { merchantSatDelta: +2, culturalCohesionDelta: -2 },
    negotiate_trade_terms:      { merchantSatDelta: +3, treasuryDelta: +20, nobilitySatDelta: -1 },
    restrict_foreign_access:    { merchantSatDelta: -2, culturalCohesionDelta: +2, nobilitySatDelta: +1 },
  },

  // ============================================================
  // CLASS-SPECIFIC: Commoners (3)
  // ============================================================
  evt_commoner_plague_outbreak: {
    quarantine_affected_districts:  { commonerSatDelta: -3, stabilityDelta: +3, merchantSatDelta: -2, regionConditionDelta: -3 },
    mobilize_clergy_healers:        { commonerSatDelta: +2, clergySatDelta: +3, faithDelta: +3, treasuryDelta: -30 },
    distribute_herbal_remedies:     { commonerSatDelta: +1, treasuryDelta: -20, foodDelta: -15 },
  },
  evt_commoner_folk_hero: {
    invite_to_court:          { commonerSatDelta: +4, nobilitySatDelta: -2, stabilityDelta: +2 },
    co_opt_folk_narrative:    { commonerSatDelta: +2, culturalCohesionDelta: +2, stabilityDelta: +1 },
    ignore_the_stories:       { commonerSatDelta: -1, stabilityDelta: -2 },
  },
  evt_commoner_migration_wave: {
    manage_resettlement:    { commonerSatDelta: +2, treasuryDelta: -30, regionDevelopmentDelta: +3 },
    restrict_movement:      { commonerSatDelta: -3, stabilityDelta: +2, nobilitySatDelta: +1 },
    allow_natural_flow:     { regionConditionDelta: -2, commonerSatDelta: -1 },
  },

  // ============================================================
  // CLASS-SPECIFIC: Military Caste (3)
  // ============================================================
  evt_military_veteran_demands: {
    grant_veteran_pensions:    { militaryCasteSatDelta: +5, treasuryDelta: -40, militaryMoraleDelta: +3 },
    offer_land_grants:         { militaryCasteSatDelta: +3, nobilitySatDelta: -2, regionDevelopmentDelta: +2 },
    acknowledge_service_only:  { militaryCasteSatDelta: -2, militaryMoraleDelta: -2 },
  },
  evt_military_desertion_crisis: {
    increase_military_pay:    { militaryCasteSatDelta: +4, treasuryDelta: -50, militaryMoraleDelta: +3, militaryReadinessDelta: +3 },
    enforce_harsh_discipline: { militaryCasteSatDelta: -3, militaryReadinessDelta: +5, stabilityDelta: -2, militaryMoraleDelta: -2 },
    appeal_to_honor:          { militaryCasteSatDelta: +1, militaryMoraleDelta: +2 },
  },
  evt_military_honor_dispute: {
    uphold_military_merit:    { militaryCasteSatDelta: +3, nobilitySatDelta: -3, militaryMoraleDelta: +2 },
    defer_to_noble_rank:      { nobilitySatDelta: +3, militaryCasteSatDelta: -3, militaryMoraleDelta: -2 },
    establish_joint_council:  { militaryCasteSatDelta: +1, nobilitySatDelta: +1, stabilityDelta: +2, treasuryDelta: -15 },
  },

  // ============================================================
  // SEASONAL: Spring (2)
  // ============================================================
  evt_spring_planting_festival: {
    sponsor_planting_rites:  { faithDelta: +2, commonerSatDelta: +3, foodDelta: +5, treasuryDelta: -15 },
    attend_ceremonies:       { commonerSatDelta: +1, faithDelta: +1 },
    decline_involvement:     { commonerSatDelta: -1 },
  },
  evt_spring_river_thaw: {
    reinforce_riverbanks:        { treasuryDelta: -35, regionConditionDelta: +3, commonerSatDelta: +2 },
    evacuate_lowlands:           { commonerSatDelta: -1, stabilityDelta: +2, regionConditionDelta: -1 },
    monitor_water_levels:        { regionConditionDelta: -3, commonerSatDelta: -2 },
  },

  // ============================================================
  // SEASONAL: Summer (2)
  // ============================================================
  evt_summer_drought: {
    ration_water_supplies:       { foodDelta: -20, commonerSatDelta: -2, stabilityDelta: +2 },
    dig_emergency_wells:         { treasuryDelta: -45, foodDelta: -10, regionDevelopmentDelta: +2, commonerSatDelta: +1 },
    pray_for_rain:               { faithDelta: +2, foodDelta: -30, commonerSatDelta: -1 },
  },
  evt_summer_trade_season: {
    host_trade_fair:           { treasuryDelta: +30, merchantSatDelta: +3, commonerSatDelta: +1 },
    reduce_trade_tariffs:      { merchantSatDelta: +4, treasuryDelta: -20, nobilitySatDelta: -1 },
    maintain_current_policy:   { merchantSatDelta: +1 },
  },

  // ============================================================
  // SEASONAL: Autumn (2)
  // ============================================================
  evt_autumn_harvest_bounty: {
    stockpile_surplus:     { foodDelta: +25 },
    export_for_profit:     { treasuryDelta: +35, foodDelta: -15, merchantSatDelta: +2 },
    distribute_to_poor:    { commonerSatDelta: +4, foodDelta: -10, faithDelta: +1 },
  },
  evt_autumn_bandit_raids: {
    dispatch_patrol_forces:  { militaryReadinessDelta: -3, stabilityDelta: +3, commonerSatDelta: +2, regionConditionDelta: +2 },
    arm_rural_militia:       { commonerSatDelta: +1, stabilityDelta: +1, militaryCasteSatDelta: -1 },
    increase_road_patrols:   { stabilityDelta: +1, commonerSatDelta: -1 },
  },

  // ============================================================
  // SEASONAL: Winter (2)
  // ============================================================
  evt_winter_blizzard: {
    open_warming_shelters:         { treasuryDelta: -30, commonerSatDelta: +3, faithDelta: +1, regionConditionDelta: -2 },
    distribute_fuel_and_blankets:  { treasuryDelta: -20, commonerSatDelta: +2, foodDelta: -10 },
    wait_out_the_storm:            { commonerSatDelta: -3, regionConditionDelta: -4, stabilityDelta: -2 },
  },
  evt_winter_food_shortage: {
    impose_strict_rationing:     { commonerSatDelta: -3, stabilityDelta: +2, foodDelta: +15 },
    purchase_emergency_grain:    { treasuryDelta: -60, foodDelta: +30, merchantSatDelta: +1 },
    request_neighbor_aid:        { foodDelta: +20, stabilityDelta: -1 },
  },

  // ============================================================
  // REGIONAL (6)
  // ============================================================
  evt_region_mine_collapse: {
    launch_rescue_operation:  { treasuryDelta: -40, commonerSatDelta: +3, stabilityDelta: +2, regionConditionDelta: -3 },
    hire_foreign_engineers:   { treasuryDelta: -60, regionDevelopmentDelta: +4, regionConditionDelta: +2 },
    seal_and_rebuild:         { commonerSatDelta: -3, regionConditionDelta: -2, treasuryDelta: -20 },
  },
  evt_region_trade_route_disruption: {
    military_escort_caravans:  { militaryReadinessDelta: -2, merchantSatDelta: +3, treasuryDelta: +15, regionConditionDelta: +2 },
    negotiate_safe_passage:    { treasuryDelta: -20, merchantSatDelta: +2, stabilityDelta: +1 },
    reroute_trade:             { merchantSatDelta: -2, regionConditionDelta: -1 },
  },
  evt_region_local_festival: {
    send_royal_blessing:  { faithDelta: +1, commonerSatDelta: +1, regionConditionDelta: +1 },
    attend_in_person:     { faithDelta: +2, commonerSatDelta: +3, nobilitySatDelta: +1, treasuryDelta: -15 },
    ignore_the_festivities: { commonerSatDelta: -1, faithDelta: -1 },
  },
  evt_region_resource_discovery: {
    fund_extraction:   { treasuryDelta: -50, regionDevelopmentDelta: +6, merchantSatDelta: +2 },
    auction_rights:    { treasuryDelta: +30, merchantSatDelta: +3, commonerSatDelta: -1 },
    survey_further:    { regionDevelopmentDelta: +1 },
  },
  evt_region_infrastructure_decay: {
    fund_major_repairs:   { treasuryDelta: -45, regionDevelopmentDelta: +4, regionConditionDelta: +3, commonerSatDelta: +2 },
    levy_local_labor:     { commonerSatDelta: -3, regionConditionDelta: +2, regionDevelopmentDelta: +2 },
    defer_maintenance:    { regionConditionDelta: -3, regionDevelopmentDelta: -2, merchantSatDelta: -1 },
  },
  evt_region_separatist_sentiment: {
    negotiate_autonomy_terms:   { commonerSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +2, regionConditionDelta: +2 },
    dispatch_royal_governor:    { stabilityDelta: +3, commonerSatDelta: -2, nobilitySatDelta: +1, treasuryDelta: -25 },
    show_of_force:              { militaryReadinessDelta: -3, stabilityDelta: +1, commonerSatDelta: -4, militaryCasteSatDelta: -1 },
  },

  // ============================================================
  // ESCALATION (6)
  // ============================================================
  evt_escalation_famine_panic: {
    seize_noble_granaries:       { foodDelta: +30, nobilitySatDelta: -6, commonerSatDelta: +3, stabilityDelta: -2 },
    enforce_martial_rationing:   { foodDelta: +15, commonerSatDelta: -2, stabilityDelta: +4, militaryReadinessDelta: -3 },
    appeal_for_calm:             { commonerSatDelta: -1, stabilityDelta: -3 },
  },
  evt_escalation_treasury_crisis: {
    emergency_asset_sales:            { treasuryDelta: +80, regionDevelopmentDelta: -3, merchantSatDelta: -2 },
    demand_noble_contributions:       { treasuryDelta: +60, nobilitySatDelta: -5, stabilityDelta: -2 },
    suspend_non_essential_spending:   { treasuryDelta: +30, militaryReadinessDelta: -3, clergySatDelta: -2, faithDelta: -2 },
  },
  evt_escalation_faith_collapse: {
    call_grand_synod:        { treasuryDelta: -80, faithDelta: +8, clergySatDelta: +4, heterodoxyDelta: -10, stabilityDelta: +3 },
    impose_state_religion:   { faithDelta: +5, clergySatDelta: +2, commonerSatDelta: -4, heterodoxyDelta: -6, stabilityDelta: -3 },
    embrace_pluralism:       { faithDelta: -3, heterodoxyDelta: +5, culturalCohesionDelta: -4, commonerSatDelta: +3, merchantSatDelta: +2 },
  },
  evt_escalation_military_mutiny: {
    meet_mutiny_demands:      { militaryCasteSatDelta: +6, treasuryDelta: -60, militaryMoraleDelta: +5, nobilitySatDelta: -3 },
    isolate_ringleaders:      { militaryCasteSatDelta: -4, stabilityDelta: +3, militaryReadinessDelta: -5, espionageNetworkDelta: +3 },
    negotiate_with_officers:  { militaryCasteSatDelta: +2, treasuryDelta: -30, stabilityDelta: +1, militaryMoraleDelta: +2 },
  },
  evt_escalation_noble_conspiracy: {
    preemptive_arrests:     { nobilitySatDelta: -6, stabilityDelta: +5, commonerSatDelta: +2, espionageNetworkDelta: +4 },
    offer_reconciliation:   { nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -40, commonerSatDelta: -2 },
    plant_double_agents:    { espionageNetworkDelta: +8, nobilitySatDelta: -1, treasuryDelta: -25, stabilityDelta: +1 },
  },
  evt_escalation_mass_exodus: {
    promise_sweeping_reforms:  { commonerSatDelta: +5, treasuryDelta: -50, nobilitySatDelta: -3, stabilityDelta: +3 },
    close_borders:             { commonerSatDelta: -4, stabilityDelta: +2, merchantSatDelta: -3 },
    let_dissenters_leave:      { commonerSatDelta: -2, stabilityDelta: -4, merchantSatDelta: -1 },
  },

  // ============================================================
  // FOLLOW-UP EVENTS (12)
  // ============================================================

  // 1. Scholarly Discovery (follow-up to fund_further_research)
  evt_scholarly_discovery: {
    patent_discovery:    { treasuryDelta: +25, merchantSatDelta: +2 },
    share_with_clergy:   { clergySatDelta: +4, faithDelta: +3 },
    apply_to_military:   { militaryReadinessDelta: +5, militaryEquipmentDelta: +3 },
  },

  // 2. Practical Innovation Success (follow-up to apply_practical_findings)
  evt_practical_innovation_success: {
    expand_workshops:    { regionDevelopmentDelta: +3, treasuryDelta: -30, merchantSatDelta: +2 },
    train_artisans:      { commonerSatDelta: +2, merchantSatDelta: +2, stabilityDelta: +1 },
    present_to_court:    { nobilitySatDelta: +2, stabilityDelta: +1 },
  },

  // 3. Merchant Demands Escalate (follow-up to offer_tax_relief)
  evt_merchant_demands_escalate: {
    hold_firm_on_terms:      { merchantSatDelta: -3, stabilityDelta: +2 },
    extend_concessions:      { treasuryDelta: -30, merchantSatDelta: +4, nobilitySatDelta: -2 },
    impose_trade_conditions: { treasuryDelta: +15, merchantSatDelta: -2, stabilityDelta: +1 },
  },

  // 4. Merchant Underground Economy (follow-up to enforce_capital_controls)
  evt_merchant_underground_economy: {
    raid_smuggling_networks: { espionageNetworkDelta: +4, treasuryDelta: +20, merchantSatDelta: -3 },
    legitimize_shadow_trade: { merchantSatDelta: +2, treasuryDelta: -15, heterodoxyDelta: +3 },
    increase_enforcement:    { treasuryDelta: -25, stabilityDelta: +3, merchantSatDelta: -2 },
  },

  // 5. Noble Backlash (follow-up to side_with_laborers)
  evt_noble_backlash_labor: {
    appease_nobles:    { treasuryDelta: -40, nobilitySatDelta: +3, commonerSatDelta: -2 },
    stand_firm:        { nobilitySatDelta: -4, commonerSatDelta: +3, stabilityDelta: +2 },
    offer_compromise:  { treasuryDelta: -20, nobilitySatDelta: +1, commonerSatDelta: +1 },
  },

  // 6. Commoner Work Slowdown (follow-up to enforce_existing_contracts)
  evt_commoner_work_slowdown: {
    impose_work_quotas:  { commonerSatDelta: -3, merchantSatDelta: +2, treasuryDelta: +15 },
    open_dialogue:       { commonerSatDelta: +2, merchantSatDelta: -1, treasuryDelta: -15 },
    hire_foreign_labor:  { treasuryDelta: -25, merchantSatDelta: +1, culturalCohesionDelta: -2 },
  },

  // 7. Theological Schism Brewing (follow-up to permit_theological_debate)
  evt_theological_schism_brewing: {
    host_grand_debate:   { treasuryDelta: -50, culturalCohesionDelta: +4, heterodoxyDelta: +3, clergySatDelta: +2 },
    quietly_suppress:    { clergySatDelta: -3, heterodoxyDelta: -5, commonerSatDelta: -2 },
    embrace_new_thought: { heterodoxyDelta: +5, culturalCohesionDelta: +3, faithDelta: -3 },
  },

  // 8. Intelligence Network Payoff (follow-up to launch_counter_intelligence)
  evt_intelligence_network_payoff: {
    expose_conspiracy:     { stabilityDelta: +5, nobilitySatDelta: -6, commonerSatDelta: +3 },
    leverage_for_loyalty:  { nobilitySatDelta: +4, espionageNetworkDelta: +3, stabilityDelta: -2 },
    share_with_allies:     { espionageNetworkDelta: +2, stabilityDelta: +2 },
  },

  // 9. Foreign Grain Dependency (follow-up to purchase_foreign_grain)
  evt_foreign_grain_dependency: {
    invest_in_domestic_agriculture: { treasuryDelta: -60, regionDevelopmentDelta: +3, commonerSatDelta: +2 },
    negotiate_long_term_supply:     { treasuryDelta: -30, merchantSatDelta: +2, foodDelta: +15 },
    accept_dependency:              { stabilityDelta: -2, merchantSatDelta: +1 },
  },

  // 10. Resource Boom (follow-up to fund_extraction)
  evt_resource_boom: {
    expand_operations:        { treasuryDelta: -40, regionDevelopmentDelta: +5, merchantSatDelta: +3 },
    tax_windfall:             { treasuryDelta: +50, merchantSatDelta: -2, commonerSatDelta: +2 },
    establish_workers_rights: { commonerSatDelta: +3, merchantSatDelta: -1, stabilityDelta: +2 },
  },

  // 11. Clergy Healing Reputation (follow-up to mobilize_clergy_healers)
  evt_clergy_healing_reputation: {
    establish_permanent_hospice: { treasuryDelta: -40, clergySatDelta: +4, commonerSatDelta: +3, faithDelta: +3 },
    leverage_piety:              { faithDelta: +2, clergySatDelta: +1, heterodoxyDelta: -1 },
    return_to_normal:            { clergySatDelta: -1, commonerSatDelta: -1 },
  },

  // 12. Military Pay Expectation (follow-up to increase_military_pay)
  evt_military_pay_expectation: {
    institutionalize_pay_scale: { militaryMoraleDelta: +5, militaryCasteSatDelta: +3, treasuryDelta: -20 },
    revert_to_standard_pay:    { militaryCasteSatDelta: -4, militaryMoraleDelta: -3, treasuryDelta: +30 },
    offer_land_instead:        { militaryCasteSatDelta: +2, nobilitySatDelta: -2, regionDevelopmentDelta: +2 },
  },

  // ============================================================
  // PATTERN-REACTIVE EVENTS (4)
  // ============================================================
  evt_noble_resentment_merchant_favor: {
    appease_nobility:           { nobilitySatDelta: +5, merchantSatDelta: -3, treasuryDelta: -30 },
    maintain_merchant_policies: { merchantSatDelta: +2, nobilitySatDelta: -4, stabilityDelta: -3 },
    mediate_compromise:         { nobilitySatDelta: +2, merchantSatDelta: +1, stabilityDelta: +1, treasuryDelta: -15 },
  },
  evt_commoner_uprising_neglect: {
    emergency_food_distribution: { foodDelta: -40, commonerSatDelta: +6, stabilityDelta: +3 },
    deploy_military_patrols:     { commonerSatDelta: -2, militaryCasteSatDelta: +2, stabilityDelta: +4, militaryReadinessDelta: -3 },
    announce_labor_reforms:      { commonerSatDelta: +4, nobilitySatDelta: -3, merchantSatDelta: -2, stabilityDelta: +2 },
  },
  evt_clergy_power_grab: {
    assert_royal_authority:   { clergySatDelta: -6, nobilitySatDelta: +3, stabilityDelta: +2, faithDelta: -3 },
    negotiate_boundaries:     { clergySatDelta: -2, stabilityDelta: +1, faithDelta: +2 },
    accept_clergy_influence:  { clergySatDelta: +3, nobilitySatDelta: -4, faithDelta: +5, stabilityDelta: -2 },
  },
  evt_military_coup_threat: {
    purge_conspirators:   { militaryCasteSatDelta: -8, militaryReadinessDelta: -10, stabilityDelta: +5, nobilitySatDelta: +2 },
    bribe_officer_corps:  { treasuryDelta: -100, militaryCasteSatDelta: +4, stabilityDelta: +2 },
    address_grievances:   { militaryCasteSatDelta: +6, treasuryDelta: -40, commonerSatDelta: -2 },
  },

  // ============================================================
  // CHAIN: Plague (3)
  // ============================================================
  evt_plague_outbreak: {
    immediate_quarantine: { regionConditionDelta: -5, commonerSatDelta: -3, merchantSatDelta: -4, stabilityDelta: +2 },
    mobilize_healers:     { treasuryDelta: -60, commonerSatDelta: +2, clergySatDelta: +3, regionConditionDelta: -3 },
    pray_for_deliverance: { faithDelta: +5, clergySatDelta: +2, regionConditionDelta: -8 },
  },
  evt_plague_spread: {
    strict_lockdown:          { merchantSatDelta: -5, commonerSatDelta: -4, regionConditionDelta: -3, stabilityDelta: +1 },
    burn_infected_quarters:   { regionConditionDelta: -10, commonerSatDelta: -6, stabilityDelta: +3 },
    import_foreign_medicine:  { treasuryDelta: -120, regionConditionDelta: +2, commonerSatDelta: +3, merchantSatDelta: +2 },
  },
  evt_plague_aftermath: {
    rebuild_and_memorialize:  { treasuryDelta: -80, regionDevelopmentDelta: +5, commonerSatDelta: +4, faithDelta: +3 },
    impose_sanitation_laws:   { commonerSatDelta: +2, regionConditionDelta: +5, merchantSatDelta: -2 },
    exploit_cheap_labor:      { treasuryDelta: +40, commonerSatDelta: -5, merchantSatDelta: +3, nobilitySatDelta: +2 },
  },

  // ============================================================
  // CHAIN: Trade War (3)
  // ============================================================
  evt_trade_war_tariffs: {
    retaliatory_tariffs: { merchantSatDelta: -3, treasuryDelta: +20, stabilityDelta: -1 },
    negotiate_terms:     { treasuryDelta: -15, merchantSatDelta: +2, stabilityDelta: +1 },
    absorb_the_costs:    { treasuryDelta: -30, merchantSatDelta: -1 },
  },
  evt_trade_war_escalation: {
    embargo_neighbor:          { merchantSatDelta: -6, treasuryDelta: -40, militaryCasteSatDelta: +2, stabilityDelta: -2 },
    seek_alternative_markets:  { treasuryDelta: -25, merchantSatDelta: +1 },
    capitulate:                { merchantSatDelta: -2, nobilitySatDelta: -3, stabilityDelta: -2, treasuryDelta: +15 },
  },
  evt_trade_war_resolution: {
    favorable_treaty:    { treasuryDelta: +50, merchantSatDelta: +5, nobilitySatDelta: +2 },
    mutual_concessions:  { treasuryDelta: +20, merchantSatDelta: +3, stabilityDelta: +2 },
    accept_losses:       { treasuryDelta: -20, merchantSatDelta: -3, stabilityDelta: -1 },
  },

  // ============================================================
  // CHAIN: Succession Crisis (3)
  // ============================================================
  evt_succession_question: {
    declare_heir:     { nobilitySatDelta: +3, stabilityDelta: +3, commonerSatDelta: +1 },
    convene_council:  { nobilitySatDelta: +1, clergySatDelta: +2, stabilityDelta: +1, treasuryDelta: -20 },
    silence_rumors:   { stabilityDelta: -2, nobilitySatDelta: -2 },
  },
  evt_succession_factions: {
    back_eldest_claim:        { nobilitySatDelta: +4, commonerSatDelta: -2, stabilityDelta: +2 },
    support_merit_candidate:  { commonerSatDelta: +4, merchantSatDelta: +3, nobilitySatDelta: -5, stabilityDelta: -1 },
    play_factions:            { nobilitySatDelta: -2, stabilityDelta: -3, espionageNetworkDelta: +5 },
  },
  evt_succession_resolution: {
    crown_heir_publicly:      { stabilityDelta: +5, nobilitySatDelta: +3, commonerSatDelta: +2, faithDelta: +3 },
    exile_rivals:             { nobilitySatDelta: -3, stabilityDelta: +3, militaryCasteSatDelta: +2 },
    grant_rival_concessions:  { nobilitySatDelta: +2, treasuryDelta: -40, stabilityDelta: +1 },
  },

  // ============================================================
  // CHAIN: Famine (3)
  // ============================================================
  evt_food_shortage_warning: {
    impose_strict_rationing:   { foodDelta: +15, commonerSatDelta: -4, stabilityDelta: +1 },
    buy_grain_reserves:        { treasuryDelta: -80, foodDelta: +30, merchantSatDelta: +2 },
    reduce_military_rations:   { militaryCasteSatDelta: -4, foodDelta: +10, militaryMoraleDelta: -3 },
  },
  evt_famine_crisis: {
    open_royal_granaries:      { foodDelta: +25, commonerSatDelta: +5, nobilitySatDelta: -3, treasuryDelta: -30 },
    commandeer_noble_stores:   { foodDelta: +35, nobilitySatDelta: -8, commonerSatDelta: +3, stabilityDelta: -2 },
    appeal_to_neighbors:       { treasuryDelta: -50, foodDelta: +20, merchantSatDelta: +2 },
  },
  evt_famine_recovery: {
    invest_in_agriculture:     { treasuryDelta: -60, regionDevelopmentDelta: +5, foodDelta: +10, commonerSatDelta: +3 },
    establish_grain_reserves:  { treasuryDelta: -40, foodDelta: +20, stabilityDelta: +2 },
    celebrate_survival:        { commonerSatDelta: +3, faithDelta: +3 },
  },

  // ============================================================
  // CHAIN: Religious Schism (3)
  // ============================================================
  evt_doctrinal_dispute: {
    convene_theological_council:  { clergySatDelta: +3, treasuryDelta: -20, faithDelta: +2 },
    enforce_orthodox_doctrine:    { clergySatDelta: +2, heterodoxyDelta: -5, commonerSatDelta: -2 },
    allow_scholarly_debate:       { heterodoxyDelta: +3, culturalCohesionDelta: +2, clergySatDelta: -1 },
  },
  evt_schism_factions: {
    support_reformers:     { clergySatDelta: -4, commonerSatDelta: +3, heterodoxyDelta: +5, culturalCohesionDelta: +2 },
    back_traditionalists:  { clergySatDelta: +4, commonerSatDelta: -2, heterodoxyDelta: -5, faithDelta: +3 },
    remain_neutral:        { stabilityDelta: -3, clergySatDelta: -2 },
  },
  evt_schism_resolution: {
    declare_unified_doctrine:  { faithDelta: +5, clergySatDelta: +3, heterodoxyDelta: -8, stabilityDelta: +3 },
    formalize_tolerance:       { heterodoxyDelta: +5, culturalCohesionDelta: +5, clergySatDelta: -2, commonerSatDelta: +3 },
    suppress_dissent:          { clergySatDelta: +2, commonerSatDelta: -4, stabilityDelta: -2, heterodoxyDelta: -10 },
  },

  // ============================================================
  // ADDITIONAL FOLLOW-UP EVENTS (3)
  // ============================================================
  evt_merchant_permanent_concessions: {
    grant_permanent_charter:  { merchantSatDelta: +5, nobilitySatDelta: -3, treasuryDelta: -20 },
    reject_demands:           { merchantSatDelta: -6, stabilityDelta: -2 },
    offer_limited_concession: { merchantSatDelta: +2, treasuryDelta: -10, nobilitySatDelta: -1 },
  },
  evt_underground_heretical_movement: {
    infiltrate_movement:       { espionageNetworkDelta: +5, clergySatDelta: -2, treasuryDelta: -30 },
    public_amnesty:            { heterodoxyDelta: +8, commonerSatDelta: +3, clergySatDelta: -4, faithDelta: -3 },
    double_down_suppression:   { clergySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -3, heterodoxyDelta: -5 },
  },
  evt_equipment_failure_field: {
    emergency_field_repair:  { treasuryDelta: -80, militaryEquipmentDelta: +8, militaryReadinessDelta: -3 },
    retreat_and_regroup:     { militaryReadinessDelta: -8, militaryMoraleDelta: -5, militaryCasteSatDelta: -3 },
    push_through:            { militaryEquipmentDelta: -5, militaryMoraleDelta: +3, militaryCasteSatDelta: +2 },
  },

  // ============================================================
  // HIGH-STAKES STANDALONE (3)
  // ============================================================
  evt_golden_age_opportunity: {
    patron_arts_sciences:  { treasuryDelta: -100, culturalCohesionDelta: +8, nobilitySatDelta: +3, clergySatDelta: +2 },
    host_grand_festival:   { treasuryDelta: -60, commonerSatDelta: +5, faithDelta: +4, culturalCohesionDelta: +3 },
    invest_in_education:   { treasuryDelta: -80, commonerSatDelta: +3, merchantSatDelta: +3, culturalCohesionDelta: +5 },
  },
  evt_assassination_attempt: {
    purge_inner_circle:    { nobilitySatDelta: -6, stabilityDelta: +5, espionageNetworkDelta: +8, treasuryDelta: -40 },
    increase_royal_guard:  { treasuryDelta: -60, militaryCasteSatDelta: +3, stabilityDelta: +3 },
    show_mercy:            { nobilitySatDelta: +3, commonerSatDelta: +4, stabilityDelta: -2, espionageNetworkDelta: -5 },
  },
  evt_foreign_invasion_rumor: {
    mobilize_defenses:   { militaryReadinessDelta: +8, treasuryDelta: -50, militaryCasteSatDelta: +3, commonerSatDelta: -2 },
    dispatch_scouts:     { espionageNetworkDelta: +5, treasuryDelta: -20 },
    dismiss_as_rumor:    { stabilityDelta: -1 },
  },

  // Phase 6.5 — Faction Request Effects
  ...FACTION_REQUEST_EFFECTS,
};

// ============================================================
// Temporary Modifier Specs — Ongoing effects from event choices
// ============================================================

export interface TemporaryModifierSpec {
  durationTurns: number;
  effectPerTurn: MechanicalEffectDelta;
}

export const EVENT_CHOICE_TEMPORARY_MODIFIERS: Record<string, Record<string, TemporaryModifierSpec>> = {
  evt_merchant_capital_flight: {
    // Tax relief reduces revenue for 4 turns
    offer_tax_relief: { durationTurns: 4, effectPerTurn: { treasuryDelta: -8 } },
  },
  evt_scholarly_breakthrough: {
    // Ongoing research funding costs
    fund_further_research: { durationTurns: 3, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_region_resource_discovery: {
    // Extraction yields income over time
    fund_extraction: { durationTurns: 5, effectPerTurn: { treasuryDelta: +10 } },
  },
  evt_summer_trade_season: {
    // Trade fair attracts commerce over several turns
    host_trade_fair: { durationTurns: 3, effectPerTurn: { treasuryDelta: +8, merchantSatDelta: +1 } },
  },
  evt_commoner_labor_dispute: {
    // Siding with laborers creates lasting class tension
    side_with_laborers: { durationTurns: 3, effectPerTurn: { commonerSatDelta: +1, nobilitySatDelta: -1 } },
    // Enforcing contracts breeds resentment among workers
    enforce_existing_contracts: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1, merchantSatDelta: +1 } },
  },
  evt_military_desertion_crisis: {
    // Higher pay is an ongoing expense
    increase_military_pay: { durationTurns: 4, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_heresy_emergence: {
    // Open debate allows heterodox ideas to spread
    permit_theological_debate: { durationTurns: 3, effectPerTurn: { heterodoxyDelta: +1 } },
  },
  evt_plague_outbreak: {
    // Quarantine disrupts commerce and drains resources for several turns
    immediate_quarantine: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1, treasuryDelta: -10 } },
  },
  evt_trade_war_tariffs: {
    // Retaliatory tariffs impose ongoing economic costs
    retaliatory_tariffs: { durationTurns: 4, effectPerTurn: { treasuryDelta: -8, merchantSatDelta: -1 } },
  },
  evt_golden_age_opportunity: {
    // Patronage yields cultural dividends but sustained expense
    patron_arts_sciences: { durationTurns: 5, effectPerTurn: { culturalCohesionDelta: +1, treasuryDelta: -5 } },
  },
};
