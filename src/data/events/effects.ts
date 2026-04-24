// gameplay-blueprint.md §7 — Event Choice Mechanical Effects
// Maps eventDefinitionId -> choiceId -> MechanicalEffectDelta.
// Each choice represents a genuine tradeoff; no strictly dominant options.

import type { MechanicalEffectDelta } from '../../engine/types';
import { FACTION_REQUEST_EFFECTS } from './faction-request-effects';
import { EXPANSION_ECONOMY_EFFECTS } from './expansion/economy-effects';
import { EXPANSION_FOOD_EFFECTS } from './expansion/food-effects';
import { EXPANSION_MILITARY_EFFECTS } from './expansion/military-effects';
import { EXPANSION_DIPLOMACY_EFFECTS } from './expansion/diplomacy-effects';
import { EXPANSION_ENVIRONMENT_EFFECTS } from './expansion/environment-effects';
import { EXPANSION_PUBLIC_ORDER_EFFECTS } from './expansion/public-order-effects';
import { EXPANSION_RELIGION_EFFECTS } from './expansion/religion-effects';
import { EXPANSION_CULTURE_EFFECTS } from './expansion/culture-effects';
import { EXPANSION_ESPIONAGE_EFFECTS } from './expansion/espionage-effects';
import { EXPANSION_KNOWLEDGE_EFFECTS } from './expansion/knowledge-effects';
import { EXPANSION_CLASS_CONFLICT_EFFECTS } from './expansion/class-conflict-effects';
import { EXPANSION_REGION_EFFECTS } from './expansion/region-effects';
import { EXPANSION_KINGDOM_EFFECTS } from './expansion/kingdom-effects';
import { EXPANSION_CHAIN_EFFECTS } from './expansion/chain-effects';
import { EXPANSION_FOLLOWUP_EFFECTS } from './expansion/followup-effects';
import { CONDITION_EVENT_EFFECTS } from './condition-effects';
import { SOCIAL_CONDITION_EVENT_EFFECTS } from './social-condition-effects';
import { POPULATION_EVENT_EFFECTS } from './population-effects';
import { EXPANSION_WAVE_2_CRISES_EFFECTS } from './expansion/wave-2';
import { EXPANSION_WAVE_2_PETITION_EFFECTS } from './expansion/petitions-wave-2';

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
    quarantine_affected_fields:  { foodDelta: -20, commonerSatDelta: -2, regionConditionDelta: -3 },
    redirect_labor_to_salvage:   { foodDelta: -10, commonerSatDelta: -3, stabilityDelta: -1 },
    purchase_foreign_grain:      { treasuryDelta: -80, foodDelta: +20, merchantSatDelta: +2 },
  },
  evt_commoner_harvest_festival: {
    acknowledge: { commonerSatDelta: +2, faithDelta: +1, foodDelta: +2 },
  },
  evt_abundant_harvest_surplus: {
    invest_in_granary_expansion:   { foodDelta: +20, treasuryDelta: -25, commonerSatDelta: +2, regionDevelopmentDelta: +3 },
    organize_food_trade_caravans:  { foodDelta: -10, treasuryDelta: +40, merchantSatDelta: +3 },
    celebrate_abundance:           { foodDelta: +10, commonerSatDelta: +3, faithDelta: +1 },
  },
  evt_agricultural_innovation: {
    implement_across_kingdom:  { foodDelta: +25, treasuryDelta: -40, commonerSatDelta: +3, regionDevelopmentDelta: +3 },
    trial_in_one_region:       { foodDelta: +15, treasuryDelta: -15, regionDevelopmentDelta: +5 },
    document_for_scholars:     { foodDelta: +5, clergySatDelta: +2 },
  },
  evt_autumn_stockpile_opportunity: {
    purchase_winter_grain_reserves:  { treasuryDelta: -50, foodDelta: +35, merchantSatDelta: +2 },
    organize_community_preserving:   { foodDelta: +20, commonerSatDelta: +2, treasuryDelta: -15 },
    trust_existing_stores:           { stabilityDelta: +1, foodDelta: -3 },
  },
  evt_foreign_grain_offer: {
    accept_bulk_purchase:       { treasuryDelta: -40, foodDelta: +30, merchantSatDelta: +2, diplomacyDeltas: { neighbor_arenthal: +3 } },
    negotiate_ongoing_supply:   { treasuryDelta: -25, foodDelta: +15, merchantSatDelta: +3, nobilitySatDelta: -1, diplomacyDeltas: { neighbor_arenthal: +2 } },
    decline_offer:              { merchantSatDelta: -1, diplomacyDeltas: { neighbor_arenthal: -2 } },
  },
  evt_military_foraging_campaign: {
    organize_military_hunts:  { foodDelta: +15, militaryMoraleDelta: +2, militaryCasteSatDelta: +1, regionConditionDelta: -2 },
    forage_borderlands:       { foodDelta: +20, militaryReadinessDelta: -3, commonerSatDelta: -2 },
    reduce_military_rations:  { foodDelta: +10, militaryCasteSatDelta: -3, militaryMoraleDelta: -2, commonerSatDelta: +1 },
  },
  evt_spring_planting_expansion: {
    clear_new_farmland:       { treasuryDelta: -35, foodDelta: +20, commonerSatDelta: +2, regionDevelopmentDelta: +4 },
    improve_existing_fields:  { treasuryDelta: -20, foodDelta: +15, regionConditionDelta: +3 },
    rely_on_current_acreage:  { stabilityDelta: +1 },
  },
  evt_commoner_agricultural_petition: {
    fund_peasant_proposals:   { treasuryDelta: -25, foodDelta: +20, commonerSatDelta: +4, nobilitySatDelta: -2 },
    approve_with_oversight:   { treasuryDelta: -10, foodDelta: +10, commonerSatDelta: +2, nobilitySatDelta: +1 },
    acknowledge_initiative:   { commonerSatDelta: +2, foodDelta: +5 },
  },
  // --- Food Follow-up Effects ---
  evt_granary_expansion_complete: {
    stockpile_for_winter:      { foodDelta: +15, stabilityDelta: +2 },
    share_with_needy_regions:  { foodDelta: +5, commonerSatDelta: +3, regionDevelopmentDelta: +2 },
  },
  evt_trade_caravan_returns: {
    reinvest_profits:          { treasuryDelta: +25, merchantSatDelta: +2, foodDelta: +5 },
    distribute_foreign_goods:  { foodDelta: +10, commonerSatDelta: +2, merchantSatDelta: +1 },
  },
  evt_supply_agreement_renewal: {
    renew_agreement:       { treasuryDelta: -30, foodDelta: +20, merchantSatDelta: +1, stabilityDelta: +1 },
    renegotiate_terms:     { treasuryDelta: -15, foodDelta: +10, merchantSatDelta: +2 },
    let_agreement_lapse:   { merchantSatDelta: -2 },
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
    accept_trade_terms:     { merchantSatDelta: +3, treasuryDelta: +25, nobilitySatDelta: -1, diplomacyDeltas: { neighbor_valdris: +4 } },
    propose_modifications:  { merchantSatDelta: +1, treasuryDelta: +15, stabilityDelta: +1, diplomacyDeltas: { neighbor_valdris: +1 } },
    decline_politely:       { merchantSatDelta: -2, diplomacyDeltas: { neighbor_valdris: -2 } },
  },
  evt_border_tension_escalation: {
    reinforce_border_garrisons:  { treasuryDelta: -40, militaryReadinessDelta: +5, stabilityDelta: +3, regionConditionDelta: -2, diplomacyDeltas: { neighbor_valdris: -3 } },
    dispatch_diplomatic_envoy:   { treasuryDelta: -20, stabilityDelta: +2, nobilitySatDelta: +1, diplomacyDeltas: { neighbor_valdris: +4 } },
    issue_formal_protest:        { stabilityDelta: -2, militaryCasteSatDelta: -1, diplomacyDeltas: { neighbor_valdris: -2 } },
  },

  // ============================================================
  // Environment (2)
  // ============================================================
  evt_early_frost: {
    mobilize_harvest_crews:  { foodDelta: -5, commonerSatDelta: +2, treasuryDelta: -15 },
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
    mediate_negotiations:       { commonerSatDelta: +2, nobilitySatDelta: -1, stabilityDelta: +2, foodDelta: +2 },
    side_with_laborers:         { commonerSatDelta: +4, nobilitySatDelta: -3, merchantSatDelta: -2, foodDelta: -3 },
    enforce_existing_contracts: { commonerSatDelta: -3, nobilitySatDelta: +2, merchantSatDelta: +2, stabilityDelta: -1, foodDelta: +3 },
  },
  evt_popular_unrest: {
    address_grievances_publicly: { commonerSatDelta: +5, stabilityDelta: +3, nobilitySatDelta: -2, regionConditionDelta: +1 },
    deploy_peacekeepers:         { commonerSatDelta: -2, stabilityDelta: +5, militaryReadinessDelta: -3, militaryCasteSatDelta: -1, treasuryDelta: -40, regionConditionDelta: +1 },
    impose_curfew:               { commonerSatDelta: -4, stabilityDelta: +4, merchantSatDelta: -3, regionConditionDelta: -1 },
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
    convene_ecclesiastical_council: { treasuryDelta: -80, clergySatDelta: +4, faithDelta: +5, heterodoxyDelta: -8, stabilityDelta: +3, regionDevelopmentDelta: +2 },
    enforce_state_doctrine:          { clergySatDelta: +2, heterodoxyDelta: -5, commonerSatDelta: -3, stabilityDelta: -2, faithDelta: +3, regionConditionDelta: -1 },
    allow_coexistence:               { clergySatDelta: -3, heterodoxyDelta: +2, culturalCohesionDelta: -3, commonerSatDelta: +2, faithDelta: -2, regionConditionDelta: +1 },
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
    side_with_merchants:  { merchantSatDelta: +4, clergySatDelta: -3, treasuryDelta: +15, faithDelta: -2 },
    seek_middle_ground:   { clergySatDelta: +1, merchantSatDelta: +1, stabilityDelta: +1, treasuryDelta: -10, faithDelta: -1 },
  },

  // ============================================================
  // Region (2)
  // ============================================================
  evt_regional_development_opportunity: {
    approve_development:       { treasuryDelta: -50, regionDevelopmentDelta: +8, commonerSatDelta: +2, merchantSatDelta: +2 },
    defer_to_local_governance: { regionDevelopmentDelta: +2, commonerSatDelta: +1, treasuryDelta: -5 },
    decline_investment:        { commonerSatDelta: -1, treasuryDelta: +5 },
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
    acknowledge: { stabilityDelta: +2 },
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
    reverse_seizures:          { nobilitySatDelta: -5, commonerSatDelta: +4, stabilityDelta: +2, treasuryDelta: -20 },
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
    mobilize_clergy_healers:        { commonerSatDelta: +2, clergySatDelta: +3, faithDelta: +3, treasuryDelta: -45 },
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
    sponsor_planting_rites:  { faithDelta: +2, commonerSatDelta: +3, foodDelta: +15, treasuryDelta: -15 },
    attend_ceremonies:       { commonerSatDelta: +1, faithDelta: +1, foodDelta: +5 },
    decline_involvement:     { commonerSatDelta: -1, foodDelta: -2 },
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
    dig_emergency_wells:         { treasuryDelta: -45, foodDelta: +5, regionDevelopmentDelta: +2, commonerSatDelta: +1 },
    pray_for_rain:               { faithDelta: +2, foodDelta: -30, commonerSatDelta: -1 },
  },
  evt_summer_trade_season: {
    host_trade_fair:           { treasuryDelta: +30, merchantSatDelta: +3, commonerSatDelta: -1 },
    reduce_trade_tariffs:      { merchantSatDelta: +4, treasuryDelta: -20, nobilitySatDelta: -1 },
    maintain_current_policy:   { merchantSatDelta: +1, treasuryDelta: +10 },
  },

  // ============================================================
  // SEASONAL: Autumn (2)
  // ============================================================
  evt_autumn_harvest_bounty: {
    stockpile_surplus:     { foodDelta: +30, commonerSatDelta: -1 },
    export_for_profit:     { treasuryDelta: +35, foodDelta: -15, merchantSatDelta: +2, commonerSatDelta: -2 },
    distribute_to_poor:    { commonerSatDelta: +4, foodDelta: -10, faithDelta: +1, nobilitySatDelta: -1 },
  },
  evt_autumn_bandit_raids: {
    dispatch_patrol_forces:  { militaryReadinessDelta: -3, stabilityDelta: +3, commonerSatDelta: +2, regionConditionDelta: +2, foodDelta: +3 },
    arm_rural_militia:       { commonerSatDelta: +1, stabilityDelta: +1, militaryCasteSatDelta: -1, foodDelta: +2 },
    increase_road_patrols:   { stabilityDelta: +1, commonerSatDelta: -1, foodDelta: +1 },
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
  // evt_region_local_festival — removed, reclassified as World Pulse (see tension-audit.ts)
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
    negotiate_autonomy_terms:   { commonerSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +2, regionConditionDelta: +2, treasuryDelta: -10 },
    dispatch_royal_governor:    { stabilityDelta: +3, commonerSatDelta: -2, nobilitySatDelta: +1, treasuryDelta: -25 },
    show_of_force:              { militaryReadinessDelta: -3, stabilityDelta: +1, commonerSatDelta: -4, militaryCasteSatDelta: -1, treasuryDelta: -15 },
  },

  // ============================================================
  // ESCALATION (6)
  // ============================================================
  evt_escalation_famine_panic: {
    seize_noble_granaries:       { foodDelta: +45, nobilitySatDelta: -6, commonerSatDelta: +3, stabilityDelta: -2, regionConditionDelta: +1 },
    enforce_martial_rationing:   { foodDelta: +15, commonerSatDelta: -2, stabilityDelta: +4, militaryReadinessDelta: -3, regionConditionDelta: -1 },
    appeal_for_calm:             { commonerSatDelta: -1, stabilityDelta: -3, regionConditionDelta: -2, foodDelta: -3 },
  },
  evt_escalation_treasury_crisis: {
    emergency_asset_sales:            { treasuryDelta: +80, regionDevelopmentDelta: -3, merchantSatDelta: -2 },
    demand_noble_contributions:       { treasuryDelta: +60, nobilitySatDelta: -5, stabilityDelta: -2, regionConditionDelta: -1 },
    suspend_non_essential_spending:   { treasuryDelta: +30, militaryReadinessDelta: -3, clergySatDelta: -2, faithDelta: -2, regionDevelopmentDelta: -2 },
  },
  evt_escalation_faith_collapse: {
    call_grand_synod:        { treasuryDelta: -80, faithDelta: +8, clergySatDelta: +4, heterodoxyDelta: -10, stabilityDelta: +3, regionDevelopmentDelta: +2 },
    impose_state_religion:   { faithDelta: +5, clergySatDelta: +2, commonerSatDelta: -4, heterodoxyDelta: -6, stabilityDelta: -3, regionConditionDelta: -1 },
    embrace_pluralism:       { faithDelta: -3, heterodoxyDelta: +5, culturalCohesionDelta: -4, commonerSatDelta: +3, merchantSatDelta: +2, regionConditionDelta: +1 },
  },
  evt_escalation_military_mutiny: {
    meet_mutiny_demands:      { militaryCasteSatDelta: +6, treasuryDelta: -60, militaryMoraleDelta: +5, nobilitySatDelta: -3, regionConditionDelta: +1 },
    isolate_ringleaders:      { militaryCasteSatDelta: -4, stabilityDelta: +3, militaryReadinessDelta: -5, espionageNetworkDelta: +3, regionConditionDelta: -1 },
    negotiate_with_officers:  { militaryCasteSatDelta: +2, treasuryDelta: -30, stabilityDelta: +1, militaryMoraleDelta: +2, regionConditionDelta: +1 },
  },
  evt_escalation_noble_conspiracy: {
    preemptive_arrests:     { nobilitySatDelta: -6, stabilityDelta: +5, commonerSatDelta: +2, espionageNetworkDelta: +4, regionConditionDelta: +1 },
    offer_reconciliation:   { nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -40, commonerSatDelta: -2, regionDevelopmentDelta: +1 },
    plant_double_agents:    { espionageNetworkDelta: +8, nobilitySatDelta: -1, treasuryDelta: -25, stabilityDelta: +1, regionConditionDelta: -1 },
  },
  evt_escalation_mass_exodus: {
    promise_sweeping_reforms:  { commonerSatDelta: +5, treasuryDelta: -50, nobilitySatDelta: -3, stabilityDelta: +3, regionDevelopmentDelta: +2 },
    close_borders:             { commonerSatDelta: -4, stabilityDelta: +2, merchantSatDelta: -3, regionConditionDelta: -1 },
    let_dissenters_leave:      { commonerSatDelta: -2, stabilityDelta: -4, merchantSatDelta: -1, regionDevelopmentDelta: -3 },
  },

  // ============================================================
  // FOLLOW-UP EVENTS (12)
  // ============================================================

  // 1. Scholarly Discovery (follow-up to fund_further_research)
  evt_scholarly_discovery: {
    patent_discovery:    { treasuryDelta: +25, merchantSatDelta: +2, faithDelta: -1 },
    share_with_clergy:   { clergySatDelta: +4, faithDelta: +3 },
    apply_to_military:   { militaryReadinessDelta: +5, militaryEquipmentDelta: +3, faithDelta: -1 },
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
    stand_firm:        { nobilitySatDelta: -4, commonerSatDelta: +3, stabilityDelta: +2, treasuryDelta: -10 },
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
    expose_conspiracy:     { stabilityDelta: +5, nobilitySatDelta: -6, commonerSatDelta: +3, espionageNetworkDelta: -3 },
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
    return_to_normal:            { clergySatDelta: -1, commonerSatDelta: -1, faithDelta: -1 },
  },

  // 12. Military Pay Expectation (follow-up to increase_military_pay)
  evt_military_pay_expectation: {
    institutionalize_pay_scale: { militaryMoraleDelta: +5, militaryCasteSatDelta: +3, treasuryDelta: -20 },
    revert_to_standard_pay:    { militaryCasteSatDelta: -4, militaryMoraleDelta: -3, treasuryDelta: +30 },
    offer_land_instead:        { militaryCasteSatDelta: +2, nobilitySatDelta: -2, regionDevelopmentDelta: +2, treasuryDelta: -10 },
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
    emergency_food_distribution: { foodDelta: -40, commonerSatDelta: +6, stabilityDelta: +3, regionConditionDelta: +2 },
    deploy_military_patrols:     { commonerSatDelta: -2, militaryCasteSatDelta: +2, stabilityDelta: +4, militaryReadinessDelta: -3, regionConditionDelta: -1 },
    announce_labor_reforms:      { commonerSatDelta: +4, nobilitySatDelta: -3, merchantSatDelta: -2, stabilityDelta: +2, regionDevelopmentDelta: +2 },
  },
  evt_clergy_power_grab: {
    assert_royal_authority:   { clergySatDelta: -6, nobilitySatDelta: +3, stabilityDelta: +2, faithDelta: -3, treasuryDelta: -20 },
    negotiate_boundaries:     { clergySatDelta: -2, stabilityDelta: +1, faithDelta: +2 },
    accept_clergy_influence:  { clergySatDelta: +3, nobilitySatDelta: -4, faithDelta: +5, stabilityDelta: -2 },
  },
  evt_military_coup_threat: {
    purge_conspirators:   { militaryCasteSatDelta: -8, militaryReadinessDelta: -10, stabilityDelta: +5, nobilitySatDelta: +2, regionConditionDelta: -1 },
    bribe_officer_corps:  { treasuryDelta: -100, militaryCasteSatDelta: +4, stabilityDelta: +2, regionConditionDelta: +1 },
    address_grievances:   { militaryCasteSatDelta: +6, treasuryDelta: -40, commonerSatDelta: -2, regionDevelopmentDelta: +1 },
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
    back_eldest_claim:        { nobilitySatDelta: +4, commonerSatDelta: -2, stabilityDelta: +2, regionConditionDelta: +1 },
    support_merit_candidate:  { commonerSatDelta: +4, merchantSatDelta: +3, nobilitySatDelta: -5, stabilityDelta: -1, treasuryDelta: -40, regionDevelopmentDelta: +2 },
    play_factions:            { nobilitySatDelta: -2, stabilityDelta: -3, espionageNetworkDelta: +5, regionConditionDelta: -2 },
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
    open_royal_granaries:      { foodDelta: +25, commonerSatDelta: +5, nobilitySatDelta: -3, treasuryDelta: -30, regionConditionDelta: +2 },
    commandeer_noble_stores:   { foodDelta: +35, nobilitySatDelta: -8, commonerSatDelta: +3, stabilityDelta: -2, regionConditionDelta: +1 },
    appeal_to_neighbors:       { treasuryDelta: -50, foodDelta: +20, merchantSatDelta: +2, diplomacyDeltas: { neighbor_arenthal: +3 }, regionConditionDelta: +1 },
  },
  evt_famine_recovery: {
    invest_in_agriculture:     { treasuryDelta: -60, regionDevelopmentDelta: +5, foodDelta: +10, commonerSatDelta: +3 },
    establish_grain_reserves:  { treasuryDelta: -40, foodDelta: +20, stabilityDelta: +2 },
    celebrate_survival:        { commonerSatDelta: +3, faithDelta: +3, foodDelta: +2 },
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
    support_reformers:     { clergySatDelta: -4, commonerSatDelta: +3, heterodoxyDelta: +5, culturalCohesionDelta: +2, treasuryDelta: -20 },
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
    reject_demands:           { merchantSatDelta: -6, stabilityDelta: -2, treasuryDelta: +5 },
    offer_limited_concession: { merchantSatDelta: +2, treasuryDelta: -10, nobilitySatDelta: -1 },
  },
  evt_underground_heretical_movement: {
    infiltrate_movement:       { espionageNetworkDelta: +5, clergySatDelta: -2, treasuryDelta: -30, heterodoxyDelta: -2 },
    public_amnesty:            { heterodoxyDelta: +8, commonerSatDelta: +3, clergySatDelta: -4, faithDelta: -3 },
    double_down_suppression:   { clergySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -3, heterodoxyDelta: -5 },
  },
  evt_equipment_failure_field: {
    emergency_field_repair:  { treasuryDelta: -80, militaryEquipmentDelta: +8, militaryReadinessDelta: -3, regionDevelopmentDelta: +1 },
    retreat_and_regroup:     { militaryReadinessDelta: -8, militaryMoraleDelta: -5, militaryCasteSatDelta: -3, regionConditionDelta: -1 },
    push_through:            { militaryEquipmentDelta: -5, militaryMoraleDelta: +3, militaryCasteSatDelta: +2, regionConditionDelta: -2 },
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
    purge_inner_circle:    { nobilitySatDelta: -6, stabilityDelta: +5, espionageNetworkDelta: +8, treasuryDelta: -40, regionConditionDelta: -1 },
    increase_royal_guard:  { treasuryDelta: -60, militaryCasteSatDelta: +3, stabilityDelta: +3, regionConditionDelta: +1 },
    show_mercy:            { nobilitySatDelta: +3, commonerSatDelta: +4, stabilityDelta: -2, espionageNetworkDelta: -5, regionDevelopmentDelta: +1 },
  },
  evt_foreign_invasion_rumor: {
    mobilize_defenses:   { militaryReadinessDelta: +8, treasuryDelta: -50, militaryCasteSatDelta: +3, commonerSatDelta: -2 },
    dispatch_scouts:     { espionageNetworkDelta: +5, treasuryDelta: -20 },
    dismiss_as_rumor:    { stabilityDelta: -1 },
  },

  // ============================================================
  // PRODUCTION CHAIN EFFECTS
  // ============================================================

  // --- Chain 9: Infrastructure Decay ---
  evt_infrastructure_decay_root: {
    fund_emergency_repairs: { treasuryDelta: -60, stabilityDelta: +2 },
    defer_maintenance:      { stabilityDelta: -1 },
  },
  evt_infra_repair_success: {
    acknowledge: { stabilityDelta: +1 },
  },
  evt_infra_repair_cost_overrun: {
    approve_additional_funds: { treasuryDelta: -40, stabilityDelta: +1 },
    cut_scope:                { commonerSatDelta: -2, stabilityDelta: -1 },
  },
  evt_infra_bridge_collapse: {
    emergency_rebuild:         { treasuryDelta: -80, foodDelta: -20, stabilityDelta: +2, regionDevelopmentDelta: +3 },
    reroute_supply_lines:      { foodDelta: -30, merchantSatDelta: -3, treasuryDelta: -20, regionConditionDelta: -1 },
    requisition_noble_estates: { nobilitySatDelta: -4, foodDelta: +10, commonerSatDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_infra_road_decay: {
    acknowledge: { treasuryDelta: -10, merchantSatDelta: -1 },
  },
  evt_infra_commoner_petition: {
    grant_road_repairs: { treasuryDelta: -30, commonerSatDelta: +3 },
    deny_petition:      { commonerSatDelta: -3, stabilityDelta: -1 },
  },

  // --- Chain 1: Grain Crisis ---
  evt_grain_crisis_root: {
    ration_strictly:      { foodDelta: +10, commonerSatDelta: -3, stabilityDelta: +1 },
    import_grain:         { treasuryDelta: -60, foodDelta: +25, merchantSatDelta: -1 },
    seize_noble_reserves: { nobilitySatDelta: -5, foodDelta: +20, commonerSatDelta: +2 },
  },
  evt_grain_ration_compliance: {
    acknowledge: { stabilityDelta: +1, commonerSatDelta: +1 },
  },
  evt_grain_ration_riots: {
    suppress_market_riots: { stabilityDelta: +2, commonerSatDelta: -4, militaryReadinessDelta: -2, treasuryDelta: -20 },
    negotiate_with_rioters: { commonerSatDelta: +2, stabilityDelta: -1, treasuryDelta: -15 },
    distribute_reserves:    { foodDelta: -10, commonerSatDelta: +3, stabilityDelta: +1 },
  },
  evt_grain_ration_black_market: {
    legalize_grey_market: { merchantSatDelta: +3, commonerSatDelta: +1, treasuryDelta: -10 },
    crack_down_market:    { merchantSatDelta: -3, stabilityDelta: +1, commonerSatDelta: -1 },
  },
  evt_grain_import_merchant_leverage: {
    grant_tariff_exemptions:  { merchantSatDelta: +4, treasuryDelta: -30, nobilitySatDelta: -1 },
    refuse_merchant_demands:  { merchantSatDelta: -4, foodDelta: -10, stabilityDelta: -1, treasuryDelta: +5 },
    partial_concessions:      { merchantSatDelta: +1, treasuryDelta: -15 },
  },
  evt_grain_import_gratitude: {
    acknowledge: { commonerSatDelta: +2, merchantSatDelta: +1 },
  },
  evt_grain_import_spoiled: {
    demand_replacement:      { treasuryDelta: -20, merchantSatDelta: -2, foodDelta: +10, diplomacyDeltas: { neighbor_arenthal: -2 } },
    emergency_local_harvest: { commonerSatDelta: -2, foodDelta: +15, treasuryDelta: -45, regionDevelopmentDelta: -1 },
    distribute_what_remains: { foodDelta: -5, commonerSatDelta: -2, regionConditionDelta: -2 },
  },
  evt_grain_noble_plot: {
    negotiate_concessions: { nobilitySatDelta: +2, treasuryDelta: -20, stabilityDelta: +1, foodDelta: +5 },
    arrest_ringleaders:    { nobilitySatDelta: -4, stabilityDelta: +2, militaryReadinessDelta: -2, foodDelta: -5 },
    show_of_force:         { nobilitySatDelta: -3, militaryReadinessDelta: -3, stabilityDelta: +1, foodDelta: -10 },
  },
  evt_grain_noble_acceptance: {
    acknowledge: { nobilitySatDelta: +1, stabilityDelta: +1, foodDelta: +5 },
  },
  evt_grain_noble_concessions_result: {
    acknowledge: { nobilitySatDelta: +1, treasuryDelta: -5 },
  },
  evt_grain_noble_uprising: {
    crush_uprising:       { militaryReadinessDelta: -5, nobilitySatDelta: -5, stabilityDelta: +3, regionDevelopmentDelta: -2, regionConditionDelta: -1 },
    negotiate_surrender:  { nobilitySatDelta: -1, treasuryDelta: -45, stabilityDelta: +1, regionConditionDelta: +1 },
    offer_amnesty:        { nobilitySatDelta: +2, commonerSatDelta: -2, stabilityDelta: -1, regionDevelopmentDelta: +1 },
  },
  evt_grain_noble_cowed: {
    acknowledge: { nobilitySatDelta: -1, stabilityDelta: +2 },
  },

  // --- Chain 3: Faith Schism ---
  evt_faith_schism_root: {
    back_orthodox:          { heterodoxyDelta: -5, commonerSatDelta: -2, clergySatDelta: +4 },
    support_reformists:     { heterodoxyDelta: +5, commonerSatDelta: +3, clergySatDelta: -4, faithDelta: -3, treasuryDelta: -20 },
    suppress_all_factions:  { stabilityDelta: +2, faithDelta: -3, clergySatDelta: -3, commonerSatDelta: -2 },
  },
  evt_schism_inquisition: {
    authorize_inquisition: { heterodoxyDelta: -8, commonerSatDelta: -4, clergySatDelta: +3, faithDelta: +2, treasuryDelta: -20 },
    limit_scope:           { heterodoxyDelta: -3, commonerSatDelta: -1, clergySatDelta: +1 },
    refuse_inquisition:    { clergySatDelta: -4, commonerSatDelta: +2, heterodoxyDelta: +2 },
  },
  evt_schism_orthodox_peace: {
    acknowledge: { faithDelta: +3, stabilityDelta: +2 },
  },
  evt_schism_orthodox_overreach: {
    rein_in_clergy:          { clergySatDelta: -3, commonerSatDelta: +2, faithDelta: -1 },
    support_clergy_authority: { clergySatDelta: +2, commonerSatDelta: -3, faithDelta: +1 },
  },
  evt_schism_reform_growth: {
    acknowledge: { heterodoxyDelta: +2, commonerSatDelta: +1, faithDelta: +1 },
  },
  evt_schism_reform_backlash: {
    stand_with_reformists: { clergySatDelta: -5, commonerSatDelta: +2, heterodoxyDelta: +3, treasuryDelta: -20 },
    appease_clergy:        { clergySatDelta: +3, commonerSatDelta: -2, heterodoxyDelta: -3 },
    impose_silence:        { clergySatDelta: -2, commonerSatDelta: -2, stabilityDelta: -1, faithDelta: -1 },
  },
  evt_schism_reform_schism_deep: {
    recognize_both_authorities: { faithDelta: -3, heterodoxyDelta: +5, stabilityDelta: -2, culturalCohesionDelta: +3, regionConditionDelta: +1 },
    enforce_single_doctrine:    { faithDelta: +4, heterodoxyDelta: -8, clergySatDelta: +2, commonerSatDelta: -3, treasuryDelta: -40, regionConditionDelta: -1 },
    secularize_state:           { faithDelta: -5, clergySatDelta: -5, commonerSatDelta: +3, stabilityDelta: +2, regionDevelopmentDelta: +2 },
  },
  evt_schism_underground_worship: {
    tolerate_quietly: { heterodoxyDelta: +3, stabilityDelta: +1, clergySatDelta: -2 },
    crack_down:       { commonerSatDelta: -4, stabilityDelta: -2, heterodoxyDelta: -3 },
    infiltrate_cells: { espionageNetworkDelta: +4, treasuryDelta: -20, clergySatDelta: -1, heterodoxyDelta: -1 },
  },
  evt_schism_suppress_calm: {
    acknowledge: { stabilityDelta: +2, faithDelta: -1 },
  },
  evt_schism_underground_stable: {
    acknowledge: { heterodoxyDelta: +1, stabilityDelta: +1 },
  },
  evt_schism_underground_martyr: {
    honor_martyr:      { commonerSatDelta: +4, clergySatDelta: -4, heterodoxyDelta: +5, faithDelta: -3, regionConditionDelta: +1 },
    discredit_martyr:  { commonerSatDelta: -3, clergySatDelta: +2, stabilityDelta: -2, treasuryDelta: -40, regionConditionDelta: -2 },
    ignore_martyr:     { stabilityDelta: -1, heterodoxyDelta: +2, regionConditionDelta: -1 },
  },

  // --- Chain 5: Plague Outbreak ---
  evt_plague_outbreak_root: {
    quarantine_districts: { commonerSatDelta: -3, treasuryDelta: -40, stabilityDelta: +1, regionConditionDelta: +1 },
    prioritize_nobility:  { commonerSatDelta: -6, nobilitySatDelta: +3, stabilityDelta: -2, regionConditionDelta: -2 },
    open_royal_stores:    { commonerSatDelta: +3, treasuryDelta: -80, nobilitySatDelta: -2, regionConditionDelta: +2 },
  },
  evt_plague_quarantine_holds: {
    acknowledge: { stabilityDelta: +2, commonerSatDelta: +1 },
  },
  evt_plague_quarantine_breaks: {
    military_enforcement: { militaryReadinessDelta: -3, commonerSatDelta: -4, stabilityDelta: +1, regionConditionDelta: +1 },
    expand_treatment:     { treasuryDelta: -50, commonerSatDelta: +2, regionConditionDelta: +2 },
    abandon_quarantine:   { commonerSatDelta: -2, stabilityDelta: -3, regionConditionDelta: -3, regionDevelopmentDelta: -2 },
  },
  evt_plague_quarantine_unrest: {
    compensate_quarantined: { treasuryDelta: -30, commonerSatDelta: +3 },
    maintain_quarantine:    { commonerSatDelta: -3, stabilityDelta: -1 },
  },
  evt_plague_class_anger: {
    extend_treatment_to_all: { treasuryDelta: -60, commonerSatDelta: +4, nobilitySatDelta: -3, regionConditionDelta: +2 },
    suppress_riots:          { commonerSatDelta: -5, stabilityDelta: +2, militaryReadinessDelta: -3, regionConditionDelta: -1 },
    public_apology:          { commonerSatDelta: +2, nobilitySatDelta: -2, stabilityDelta: -1, regionConditionDelta: +1 },
  },
  evt_plague_noble_saved: {
    acknowledge: { nobilitySatDelta: +2, commonerSatDelta: -1 },
  },
  evt_plague_noble_spread: {
    emergency_measures:    { treasuryDelta: -50, commonerSatDelta: +1, stabilityDelta: +1 },
    appeal_for_foreign_aid: { treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: +3 } },
    isolate_and_wait:      { commonerSatDelta: -3, stabilityDelta: -2 },
  },
  evt_plague_recovery: {
    acknowledge: { stabilityDelta: +2, commonerSatDelta: +2, clergySatDelta: +1, merchantSatDelta: +1 },
  },
  evt_plague_bankruptcy: {
    emergency_loans:    { treasuryDelta: +40, stabilityDelta: -1 },
    slash_all_spending: { treasuryDelta: +20, commonerSatDelta: -2, militaryReadinessDelta: -3 },
    levy_crisis_tax:    { treasuryDelta: +30, commonerSatDelta: -3, merchantSatDelta: -2 },
  },
  evt_plague_gratitude: {
    acknowledge: { commonerSatDelta: +3, stabilityDelta: +2 },
  },

  // --- Chain 2: Border Incursion ---
  evt_border_incursion_root: {
    retaliate_with_force:  { militaryReadinessDelta: -5, stabilityDelta: +2, diplomacyDeltas: { neighbor_valdris: -5 }, treasuryDelta: -40 },
    send_diplomatic_envoy: { treasuryDelta: -30, diplomacyDeltas: { neighbor_valdris: +3 } },
    fortify_and_absorb:    { foodDelta: -20, commonerSatDelta: -2, militaryReadinessDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_border_campaign_victory: {
    acknowledge: { diplomacyDeltas: { neighbor_valdris: +10 }, stabilityDelta: +3, militaryCasteSatDelta: +3 },
  },
  evt_border_campaign_stalemate: {
    commit_more_resources: { treasuryDelta: -40, militaryReadinessDelta: -3 },
    withdraw_forces:       { militaryCasteSatDelta: -3, stabilityDelta: -2 },
  },
  evt_border_campaign_defeat: {
    rally_defense:   { militaryReadinessDelta: -5, treasuryDelta: -60, stabilityDelta: +1, regionDevelopmentDelta: -2 },
    sue_for_peace:   { diplomacyDeltas: { neighbor_valdris: +5 }, nobilitySatDelta: -3, treasuryDelta: -30, regionConditionDelta: -1 },
    scorched_earth:  { foodDelta: -30, commonerSatDelta: -4, militaryReadinessDelta: +3, regionDevelopmentDelta: -5, regionConditionDelta: -3 },
  },
  evt_border_envoy_success: {
    acknowledge: { diplomacyDeltas: { neighbor_valdris: +8 }, stabilityDelta: +2 },
  },
  evt_border_envoy_hostage: {
    pay_ransom:      { treasuryDelta: -60, diplomacyDeltas: { neighbor_valdris: -3 } },
    rescue_mission:  { militaryReadinessDelta: -5, treasuryDelta: -20, stabilityDelta: +2, diplomacyDeltas: { neighbor_valdris: -5 } },
    abandon_envoy:   { stabilityDelta: -3, nobilitySatDelta: -2, diplomacyDeltas: { neighbor_valdris: -8 } },
  },
  evt_border_envoy_terms: {
    accept_unfavorable_terms: { treasuryDelta: -20, diplomacyDeltas: { neighbor_valdris: +5 }, nobilitySatDelta: -2 },
    reject_terms:             { diplomacyDeltas: { neighbor_valdris: -5 }, stabilityDelta: -1 },
  },
  evt_border_fortify_holds: {
    acknowledge: { stabilityDelta: +2, militaryReadinessDelta: +2 },
  },
  evt_border_fortify_famine: {
    emergency_food_imports: { treasuryDelta: -50, foodDelta: +25 },
    redistribute_reserves:  { foodDelta: +10, nobilitySatDelta: -2, commonerSatDelta: +1 },
    enforce_rationing:      { foodDelta: +5, commonerSatDelta: -3, stabilityDelta: -1 },
  },
  evt_border_fortify_resentment: {
    grant_compensation: { treasuryDelta: -25, commonerSatDelta: +3 },
    deny_compensation:  { commonerSatDelta: -3, stabilityDelta: -1 },
  },

  // --- Chain 4: Trade Route Disruption ---
  evt_trade_route_disruption_root: {
    send_military_escorts:      { militaryReadinessDelta: -3, treasuryDelta: -30, merchantSatDelta: +2 },
    negotiate_with_disruptors:  { treasuryDelta: -20, stabilityDelta: -1 },
    redirect_to_alternate:      { merchantSatDelta: -3, treasuryDelta: -15 },
  },
  evt_trade_escort_success: {
    acknowledge: { merchantSatDelta: +2, treasuryDelta: +10 },
  },
  evt_trade_escort_ambush: {
    send_reinforcements: { militaryReadinessDelta: -5, treasuryDelta: -40, stabilityDelta: +1, regionConditionDelta: +1 },
    negotiate_ransom:    { treasuryDelta: -60, merchantSatDelta: -2, diplomacyDeltas: { neighbor_valdris: -2 }, regionConditionDelta: -1 },
    cut_losses:          { merchantSatDelta: -4, militaryCasteSatDelta: -2, treasuryDelta: -20, regionDevelopmentDelta: -2 },
  },
  evt_trade_escort_expensive: {
    subsidize_escorts:   { treasuryDelta: -40, merchantSatDelta: +2 },
    end_escort_program:  { merchantSatDelta: -3, militaryReadinessDelta: +2 },
  },
  evt_trade_negotiate_deal: {
    accept_toll:  { treasuryDelta: -15, merchantSatDelta: -1, stabilityDelta: +1 },
    refuse_toll:  { merchantSatDelta: +1, stabilityDelta: -1 },
  },
  evt_trade_negotiate_betrayal: {
    military_response:    { militaryReadinessDelta: -4, treasuryDelta: -20, stabilityDelta: +1 },
    demand_compensation:  { treasuryDelta: +10, merchantSatDelta: -1 },
    write_off_losses:     { treasuryDelta: -30, merchantSatDelta: -3 },
  },
  evt_trade_negotiate_alliance: {
    acknowledge: { merchantSatDelta: +3, treasuryDelta: +15, stabilityDelta: +1 },
  },
  evt_trade_redirect_slow_recovery: {
    acknowledge: { merchantSatDelta: -1, treasuryDelta: -10 },
  },
  evt_trade_redirect_opportunity: {
    invest_in_new_route: { treasuryDelta: -50, merchantSatDelta: +3 },
    decline_investment:  { merchantSatDelta: -1 },
  },

  // --- Chain 6: Military Mutiny ---
  evt_military_mutiny_root: {
    pay_back_wages:      { treasuryDelta: -80, militaryCasteSatDelta: +4, militaryMoraleDelta: +3, regionConditionDelta: +1 },
    promise_reform:      { militaryReadinessDelta: -3, militaryCasteSatDelta: -1, regionConditionDelta: -1 },
    execute_ringleaders: { militaryReadinessDelta: -2, stabilityDelta: +2, militaryMoraleDelta: -5, regionConditionDelta: -2 },
  },
  evt_mutiny_pay_loyalty: {
    acknowledge: { militaryCasteSatDelta: +3, militaryReadinessDelta: +5 },
  },
  evt_mutiny_pay_bankrupt: {
    emergency_taxation:    { treasuryDelta: +40, commonerSatDelta: -4, merchantSatDelta: -3 },
    seize_noble_assets:    { treasuryDelta: +50, nobilitySatDelta: -5 },
    reduce_military_size:  { militaryForceSizeDelta: -200, militaryCasteSatDelta: -3, treasuryDelta: +20 },
  },
  evt_mutiny_reform_trust: {
    acknowledge: { militaryCasteSatDelta: +3, militaryReadinessDelta: +3, stabilityDelta: +1 },
  },
  evt_mutiny_reform_betrayal: {
    meet_soldiers_personally: { stabilityDelta: +3, militaryCasteSatDelta: +2, treasuryDelta: -40, regionConditionDelta: +1 },
    call_loyal_units:         { militaryReadinessDelta: -5, stabilityDelta: -3, militaryCasteSatDelta: -2, regionConditionDelta: -2 },
    flee_capital:             { stabilityDelta: -5, nobilitySatDelta: -3, commonerSatDelta: -3, regionDevelopmentDelta: -3, regionConditionDelta: -3 },
  },
  evt_mutiny_reform_desertion: {
    acknowledge: { militaryReadinessDelta: -5, militaryForceSizeDelta: -100 },
  },
  evt_mutiny_execute_fear: {
    acknowledge: { militaryMoraleDelta: -3, stabilityDelta: +1 },
  },
  evt_mutiny_execute_revenge: {
    investigate_sabotage:   { espionageNetworkDelta: +3, treasuryDelta: -20, stabilityDelta: +1, regionConditionDelta: +1 },
    rebuild_fortification:  { treasuryDelta: -60, militaryReadinessDelta: +3, regionDevelopmentDelta: +2 },
    purge_suspects:         { militaryCasteSatDelta: -4, militaryForceSizeDelta: -100, stabilityDelta: +2, regionConditionDelta: -2 },
  },
  evt_mutiny_execute_loyalty_split: {
    grant_amnesty_families: { commonerSatDelta: +3, militaryCasteSatDelta: +1, nobilitySatDelta: -1 },
    deny_amnesty:           { commonerSatDelta: -3, stabilityDelta: -1 },
  },

  // --- Chain 8: Succession Anxiety ---
  evt_succession_anxiety_root: {
    name_heir_publicly:  { stabilityDelta: +3, nobilitySatDelta: -2, treasuryDelta: -20 },
    suppress_rumors:     { faithDelta: -2, stabilityDelta: -1 },
    convene_great_lords: { nobilitySatDelta: -2, stabilityDelta: +1 },
  },
  evt_succession_heir_accepted: {
    acknowledge: { stabilityDelta: +3 },
  },
  evt_succession_heir_challenged: {
    discredit_rival:      { espionageNetworkDelta: +3, nobilitySatDelta: -2, stabilityDelta: +1 },
    negotiate_with_rival: { treasuryDelta: -30, nobilitySatDelta: +1 },
    imprison_rival:       { nobilitySatDelta: -4, stabilityDelta: +2, commonerSatDelta: -1 },
  },
  evt_succession_heir_popular: {
    acknowledge: { stabilityDelta: +2, commonerSatDelta: +2 },
  },
  evt_succession_whispers: {
    crack_down_harder:    { stabilityDelta: -2, commonerSatDelta: -2, faithDelta: -1 },
    address_publicly:     { stabilityDelta: +2, nobilitySatDelta: -1 },
    redirect_attention:   { treasuryDelta: -20, stabilityDelta: +1 },
  },
  evt_succession_suppress_works: {
    acknowledge: { stabilityDelta: +2 },
  },
  evt_succession_council_agreement: {
    acknowledge: { stabilityDelta: +3, nobilitySatDelta: +2 },
  },
  evt_succession_council_deadlock: {
    force_decision:        { nobilitySatDelta: -3, stabilityDelta: +2, treasuryDelta: -20 },
    dissolve_council:      { nobilitySatDelta: -2, stabilityDelta: -2 },
    extend_deliberations:  { stabilityDelta: -1 },
  },
  evt_succession_council_proposal: {
    accept_compromise: { nobilitySatDelta: +2, stabilityDelta: +2 },
    reject_compromise: { nobilitySatDelta: -3, stabilityDelta: -1 },
  },

  // --- Chain 11: Commoner Uprising ---
  evt_commoner_uprising_root: {
    meet_demands:        { commonerSatDelta: +5, nobilitySatDelta: -4, treasuryDelta: -40, regionConditionDelta: +2 },
    suppress_by_force:   { stabilityDelta: +2, commonerSatDelta: -5, faithDelta: -2, regionConditionDelta: -2, regionDevelopmentDelta: -2 },
    address_root_causes: { treasuryDelta: -50, commonerSatDelta: +2, stabilityDelta: +1, regionDevelopmentDelta: +3 },
  },
  evt_uprising_noble_backlash: {
    appease_nobility:    { nobilitySatDelta: +3, commonerSatDelta: -3, treasuryDelta: -20 },
    stand_with_commoners: { nobilitySatDelta: -4, commonerSatDelta: +3, stabilityDelta: -2 },
    find_compromise:     { nobilitySatDelta: +1, commonerSatDelta: +1, treasuryDelta: -15 },
  },
  evt_uprising_peace: {
    acknowledge: { stabilityDelta: +3, commonerSatDelta: +2 },
  },
  evt_uprising_guerrilla: {
    hunt_insurgents:      { militaryReadinessDelta: -5, stabilityDelta: -2, commonerSatDelta: -4, regionConditionDelta: -2, treasuryDelta: -20, foodDelta: -5 },
    offer_amnesty:        { commonerSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +1, regionConditionDelta: +1, treasuryDelta: -10 },
    fortify_key_positions: { treasuryDelta: -40, militaryReadinessDelta: -3, stabilityDelta: +1, regionDevelopmentDelta: +2 },
  },
  evt_uprising_crushed: {
    acknowledge: { commonerSatDelta: -3, stabilityDelta: +2 },
  },
  evt_uprising_reform_progress: {
    acknowledge: { commonerSatDelta: +3, stabilityDelta: +1 },
  },
  evt_uprising_reform_too_slow: {
    accelerate_reforms: { treasuryDelta: -30, commonerSatDelta: +2, stabilityDelta: +1 },
    urge_patience:      { commonerSatDelta: -2, stabilityDelta: -1 },
  },
  evt_uprising_reform_resistance: {
    override_nobility:     { nobilitySatDelta: -5, commonerSatDelta: +3, stabilityDelta: -2, treasuryDelta: -20 },
    compromise_on_reforms: { nobilitySatDelta: -1, commonerSatDelta: -1 },
    abandon_reforms:       { commonerSatDelta: -4, nobilitySatDelta: +2, stabilityDelta: -2 },
  },

  // --- Chain 7: Merchant Guild Power Play ---
  evt_merchant_guild_demands_root: {
    grant_council_seat:        { nobilitySatDelta: -3, merchantSatDelta: +5, stabilityDelta: +1 },
    offer_tax_concessions:     { treasuryDelta: -30, merchantSatDelta: +3 },
    refuse_reassert_authority: { nobilitySatDelta: +2, merchantSatDelta: -4, treasuryDelta: -15 },
  },
  evt_merchant_council_effective: {
    acknowledge: { merchantSatDelta: +2, stabilityDelta: +1, treasuryDelta: +10 },
  },
  evt_merchant_council_overreach: {
    dissolve_council:      { merchantSatDelta: -5, nobilitySatDelta: +3, stabilityDelta: -2, treasuryDelta: -20 },
    limit_council_powers:  { merchantSatDelta: -2, nobilitySatDelta: +1 },
    side_with_merchants:   { merchantSatDelta: +3, nobilitySatDelta: -4, stabilityDelta: -1 },
  },
  evt_merchant_council_corruption: {
    investigate_council: { merchantSatDelta: -3, treasuryDelta: +15, stabilityDelta: +1 },
    ignore_reports:      { merchantSatDelta: +1, commonerSatDelta: -2, stabilityDelta: -1 },
  },
  evt_merchant_tax_satisfied: {
    acknowledge: { merchantSatDelta: +1 },
  },
  evt_merchant_tax_shortfall: {
    reverse_concessions:   { merchantSatDelta: -5, treasuryDelta: +25, stabilityDelta: -1 },
    raise_taxes_elsewhere: { commonerSatDelta: -3, treasuryDelta: +20 },
    cut_spending:          { stabilityDelta: -2, treasuryDelta: +10 },
  },
  evt_merchant_boycott: {
    break_boycott_by_force: { merchantSatDelta: -4, stabilityDelta: +2, militaryReadinessDelta: -3, treasuryDelta: -15, foodDelta: -5 },
    negotiate_end:          { merchantSatDelta: +2, treasuryDelta: -25, foodDelta: -5 },
    wait_out_boycott:       { treasuryDelta: -20, merchantSatDelta: -2, foodDelta: -10 },
  },
  evt_merchant_grudging_acceptance: {
    acknowledge: { stabilityDelta: +1 },
  },

  // --- Chain 10: Foreign Ambassador ---
  evt_foreign_ambassador_root: {
    accept_proposal:  { treasuryDelta: +20, nobilitySatDelta: -2, diplomacyDeltas: { neighbor_arenthal: +10 } },
    counter_propose:  { treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: +5 } },
    reject_outright:  { nobilitySatDelta: +2, diplomacyDeltas: { neighbor_arenthal: -10 } },
  },
  evt_ambassador_alliance_benefit: {
    acknowledge: { treasuryDelta: +15, merchantSatDelta: +2, diplomacyDeltas: { neighbor_arenthal: +2 } },
  },
  evt_ambassador_dependency: {
    renegotiate_terms: { treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: -5 }, stabilityDelta: +1 },
    accept_dependency: { treasuryDelta: +10, diplomacyDeltas: { neighbor_arenthal: +5 }, nobilitySatDelta: -3 },
  },
  evt_ambassador_counter_accepted: {
    acknowledge: { diplomacyDeltas: { neighbor_arenthal: +10 }, stabilityDelta: +1 },
  },
  evt_ambassador_counter_rejected: {
    concede_to_terms:      { diplomacyDeltas: { neighbor_arenthal: +5 }, treasuryDelta: -30, nobilitySatDelta: -2 },
    stand_firm:            { diplomacyDeltas: { neighbor_arenthal: -10 }, stabilityDelta: +2, nobilitySatDelta: +2 },
    offer_trade_concession: { treasuryDelta: -20, merchantSatDelta: -2, diplomacyDeltas: { neighbor_arenthal: +3 } },
  },
  evt_ambassador_trade_embargo: {
    seek_alternative_partners: { treasuryDelta: -30, merchantSatDelta: -2, diplomacyDeltas: { neighbor_arenthal: -5 } },
    retaliate_economically:    { treasuryDelta: -20, merchantSatDelta: -3, diplomacyDeltas: { neighbor_arenthal: -10 } },
    accept_embargo:            { merchantSatDelta: -4, treasuryDelta: -40 },
  },
  evt_ambassador_respect: {
    acknowledge: { stabilityDelta: +2, nobilitySatDelta: +1, diplomacyDeltas: { neighbor_arenthal: +2 } },
  },

  // --- Chain 12: Royal Treasury Audit ---
  evt_treasury_audit_root: {
    conduct_full_investigation: { treasuryDelta: -30, stabilityDelta: +1 },
    accept_report:             { stabilityDelta: -1 },
  },
  evt_audit_corruption_found: {
    prosecute_officials:  { stabilityDelta: +3, nobilitySatDelta: -3, treasuryDelta: +20 },
    demand_restitution:   { treasuryDelta: +40, nobilitySatDelta: -2 },
    cover_up_findings:    { stabilityDelta: -2, commonerSatDelta: -2, treasuryDelta: -10 },
  },
  evt_audit_clean: {
    acknowledge: { stabilityDelta: +2 },
  },
  evt_audit_embezzlement: {
    launch_crackdown:          { treasuryDelta: +30, nobilitySatDelta: -4, stabilityDelta: +2 },
    reform_treasury_oversight: { treasuryDelta: -20, stabilityDelta: +3 },
    ignore_and_absorb:         { treasuryDelta: -15, stabilityDelta: -2 },
  },
  evt_audit_whistleblower: {
    protect_whistleblower:  { commonerSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +1, treasuryDelta: +10, merchantSatDelta: +1 },
    silence_whistleblower:  { commonerSatDelta: -3, nobilitySatDelta: +2, stabilityDelta: -2, treasuryDelta: -5, merchantSatDelta: -1 },
  },
  evt_audit_quiet: {
    acknowledge: {},
  },

  // Phase 6.5 — Faction Request Effects
  ...FACTION_REQUEST_EFFECTS,

  // Expansion Content Effects
  ...EXPANSION_ECONOMY_EFFECTS,
  ...EXPANSION_FOOD_EFFECTS,
  ...EXPANSION_MILITARY_EFFECTS,
  ...EXPANSION_DIPLOMACY_EFFECTS,
  ...EXPANSION_ENVIRONMENT_EFFECTS,
  ...EXPANSION_PUBLIC_ORDER_EFFECTS,
  ...EXPANSION_RELIGION_EFFECTS,
  ...EXPANSION_CULTURE_EFFECTS,
  ...EXPANSION_ESPIONAGE_EFFECTS,
  ...EXPANSION_KNOWLEDGE_EFFECTS,
  ...EXPANSION_CLASS_CONFLICT_EFFECTS,
  ...EXPANSION_REGION_EFFECTS,
  ...EXPANSION_KINGDOM_EFFECTS,
  ...EXPANSION_CHAIN_EFFECTS,
  ...EXPANSION_FOLLOWUP_EFFECTS,
  ...CONDITION_EVENT_EFFECTS,
  ...SOCIAL_CONDITION_EVENT_EFFECTS,
  ...POPULATION_EVENT_EFFECTS,

  // Phase 7 — Wave-2 content
  ...EXPANSION_WAVE_2_CRISES_EFFECTS,
  ...EXPANSION_WAVE_2_PETITION_EFFECTS,
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
    increase_military_pay: { durationTurns: 4, effectPerTurn: { treasuryDelta: -10 } },
    appeal_to_honor: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: +1 } },
    enforce_harsh_discipline: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: -1 } },
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
    evt_uprising_noble_backlash: {
    find_compromise: { durationTurns: 3, effectPerTurn: { nobilitySatDelta: +1, commonerSatDelta: +1 } },
    appease_nobility: { durationTurns: 3, effectPerTurn: { nobilitySatDelta: +1 } },
    stand_with_commoners: { durationTurns: 3, effectPerTurn: { commonerSatDelta: +1 } },
  },

    evt_trade_negotiate_betrayal: {
    demand_compensation: { durationTurns: 3, effectPerTurn: { treasuryDelta: +2 } },
    military_response: { durationTurns: 3, effectPerTurn: { militaryReadinessDelta: -1 } },
    write_off_losses: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1 } },
  },

    evt_schism_inquisition: {
    limit_scope: { durationTurns: 3, effectPerTurn: { heterodoxyDelta: -1 } },
    authorize_inquisition: { durationTurns: 4, effectPerTurn: { faithDelta: +1, culturalCohesionDelta: -1 } },
    refuse_inquisition: { durationTurns: 3, effectPerTurn: { clergySatDelta: -1 } },
  },

  evt_merchant_underground_economy: {
    legitimize_shadow_trade: { durationTurns: 3, effectPerTurn: { treasuryDelta: +4, heterodoxyDelta: +1 } },
  },
    evt_merchant_permanent_concessions: {
    offer_limited_concession: { durationTurns: 4, effectPerTurn: { treasuryDelta: -3, merchantSatDelta: +1 } },
    grant_permanent_charter: { durationTurns: 4, effectPerTurn: { nobilitySatDelta: -1 } },
    reject_demands: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1 } },
  },

    evt_merchant_boycott: {
    wait_out_boycott: { durationTurns: 3, effectPerTurn: { stabilityDelta: -1 } },
    break_boycott_by_force: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: -1 } },
    negotiate_end: { durationTurns: 4, effectPerTurn: { merchantSatDelta: +1 } },
  },

    evt_library_fire: {
    launch_restoration_effort: { durationTurns: 4, effectPerTurn: { treasuryDelta: -5, culturalCohesionDelta: +1 } },
    accept_and_rebuild: { durationTurns: 4, effectPerTurn: { culturalCohesionDelta: +1 } },
    investigate_cause: { durationTurns: 3, effectPerTurn: { espionageNetworkDelta: +1 } },
  },

    evt_clergy_prophecy_claim: {
    investigate_prophecy: { durationTurns: 3, effectPerTurn: { clergySatDelta: -1 } },
    dismiss_as_superstition: { durationTurns: 3, effectPerTurn: { clergySatDelta: -1 } },
    endorse_as_divine_sign: { durationTurns: 4, effectPerTurn: { faithDelta: +1 } },
  },

    evt_audit_embezzlement: {
    reform_treasury_oversight: { durationTurns: 4, effectPerTurn: { treasuryDelta: -4 } },
    ignore_and_absorb: { durationTurns: 3, effectPerTurn: { stabilityDelta: -1 } },
    launch_crackdown: { durationTurns: 3, effectPerTurn: { nobilitySatDelta: -1 } },
  },

    evt_ambassador_trade_embargo: {
    retaliate_economically: { durationTurns: 3, effectPerTurn: { treasuryDelta: -6, merchantSatDelta: -1 } },
    accept_embargo: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1 } },
  },

  evt_exp_reg_trade_disruption: {
    military_escort: { durationTurns: 3, effectPerTurn: { treasuryDelta: -4 } },
    reroute_trade: { durationTurns: 4, effectPerTurn: { merchantSatDelta: -1 } },
  },
  evt_exp_reg_separatist_threat: {
    negotiate_concessions: { durationTurns: 4, effectPerTurn: { treasuryDelta: -4 } },
    military_presence: { durationTurns: 3, effectPerTurn: { treasuryDelta: -6, militaryMoraleDelta: +1 } },
  },
  evt_exp_reg_governor_corruption: {
    demand_restitution: { durationTurns: 3, effectPerTurn: { treasuryDelta: +4 } },
    issue_warning: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_reg_border_tensions: {
    fortify_border: { durationTurns: 4, effectPerTurn: { treasuryDelta: -4 } },
    increase_patrols: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: +1 } },
  },
    evt_exp_po_tax_resistance: {
    temporarily_reduce_taxes: { durationTurns: 3, effectPerTurn: { treasuryDelta: -8 } },
    address_grievances_at_court: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    send_tax_collectors_with_guards: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
  },

    evt_exp_kgd_governance_reform: {
    partial_concessions: { durationTurns: 4, effectPerTurn: { stabilityDelta: +1, treasuryDelta: -2 } },
    accept_reforms: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    reject_reforms: { durationTurns: 2, effectPerTurn: { treasuryDelta: +6 } },
  },

  evt_fu_state_religion_persecution: {
    deepen_the_inquiry: { durationTurns: 4, effectPerTurn: { heterodoxyDelta: -1, culturalCohesionDelta: -1 } },
  },
  evt_fu_ringleader_martyrs: {
    reinforce_the_narrative: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1 } },
  },
  evt_fu_peacekeeper_overreach: {
    court_martial_the_officers: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: -1 } },
  },
  evt_fu_noble_contribution_resistance: {
    seize_the_levy: { durationTurns: 3, effectPerTurn: { nobilitySatDelta: -1, treasuryDelta: +5 } },
  },
  evt_fu_factions_see_through: {
    publicly_reconcile: { durationTurns: 3, effectPerTurn: { stabilityDelta: +1 } },
  },
    evt_exp_esp_military_secrets_stolen: {
    feed_false_plans: { durationTurns: 3, effectPerTurn: { espionageNetworkDelta: +1 } },
    change_all_plans: { durationTurns: 2, effectPerTurn: { treasuryDelta: -40 } },
  },

  evt_exp_env_mine_contamination: {
    invest_in_drainage: { durationTurns: 4, effectPerTurn: { treasuryDelta: -6 } },
    continue_operations: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1, treasuryDelta: +4 } },
  },
  evt_exp_env_great_storm: {
    emergency_fortification: { durationTurns: 3, effectPerTurn: { treasuryDelta: -5 } },
    distribute_emergency_supplies: { durationTurns: 2, effectPerTurn: { foodDelta: -4 } },
  },
  evt_exp_env_earthquake: {
    launch_rescue_operations: { durationTurns: 3, effectPerTurn: { treasuryDelta: -6 } },
    prioritize_infrastructure: { durationTurns: 4, effectPerTurn: { regionDevelopmentDelta: +1 } },
  },
    evt_exp_eco_black_market: {
    infiltrate_and_tax: { durationTurns: 3, effectPerTurn: { treasuryDelta: +6, espionageNetworkDelta: -1 } },
    crack_down_harshly: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    tolerate_for_now: { durationTurns: 2, effectPerTurn: { treasuryDelta: +3 } },
  },

    evt_exp_dip_trade_embargo_threat: {
    seek_alternative_markets: { durationTurns: 4, effectPerTurn: { treasuryDelta: +4, merchantSatDelta: +1 } },
    accept_the_embargo: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },

  evt_exp_dip_spy_scandal: {
    offer_intelligence_sharing: { durationTurns: 3, effectPerTurn: { espionageNetworkDelta: -1 } },
  },
  evt_exp_cul_identity_crisis: {
    forge_new_cultural_synthesis: { durationTurns: 4, effectPerTurn: { culturalCohesionDelta: +1, treasuryDelta: -3 } },
  },
    evt_exp_cc_tax_burden_dispute: {
    commission_tax_review: { durationTurns: 3, effectPerTurn: { treasuryDelta: -4 } },
    maintain_noble_exemptions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -3 } },
    redistribute_tax_burden: { durationTurns: 2, effectPerTurn: { commonerSatDelta: +1, nobilitySatDelta: -1 } },
  },

    evt_exp_chain_guild_rev_council: {
    grant_council_representation: { durationTurns: 4, effectPerTurn: { nobilitySatDelta: -1, merchantSatDelta: +1 } },
    arrest_ringleaders: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    offer_economic_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
  },

    evt_cond_plague_mild: {
    quarantine_district: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1, treasuryDelta: -5 } },
    hire_healers: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
    ignore_sickness: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },

  evt_social_unrest_moderate: {
    hold_public_festival: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    make_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    suppress_riots: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_social_criminal_moderate: {
    crack_down_syndicates: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    recruit_informants: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    tolerate_black_market: { durationTurns: 2, effectPerTurn: { treasuryDelta: -3 } },
  },
  evt_social_corruption_moderate: {
    accept_status_quo: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    purge_corrupt_officials: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    reform_tax_collection: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
  },
  evt_social_banditry_moderate: {
    fortify_trade_routes: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    military_sweep: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    negotiate_brigands: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
  },
  evt_pop_overcrowding_crisis: {
    emergency_construction: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    endure_squalor: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    forced_relocation: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_pop_migration_crisis: {
    emergency_relief: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    let_them_leave: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    seal_borders: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_pop_decline: {
    accept_decline: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    attract_immigrants: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    encourage_families: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_winter_food_shortage: {
    impose_strict_rationing: { durationTurns: 2, effectPerTurn: { foodDelta: +5 } },
    purchase_emergency_grain: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    request_neighbor_aid: { durationTurns: 2, effectPerTurn: { foodDelta: +6 } },
  },
  evt_winter_blizzard: {
    distribute_fuel_and_blankets: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_uprising_reform_resistance: {
    abandon_reforms: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    compromise_on_reforms: { durationTurns: 2, effectPerTurn: { commonerSatDelta: -1 } },
    override_nobility: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_underground_heretical_movement: {
    double_down_suppression: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    infiltrate_movement: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    public_amnesty: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
  },
  evt_trade_war_escalation: {
    capitulate: { durationTurns: 2, effectPerTurn: { treasuryDelta: +5 } },
    embargo_neighbor: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    seek_alternative_markets: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
  },
  evt_trade_route_disruption_root: {
    negotiate_with_disruptors: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    redirect_to_alternate: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
    send_military_escorts: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_theological_schism_brewing: {
    embrace_new_thought: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
    host_grand_debate: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    quietly_suppress: { durationTurns: 2, effectPerTurn: { heterodoxyDelta: -1 } },
  },
  evt_summer_drought: {
    pray_for_rain: { durationTurns: 2, effectPerTurn: { foodDelta: -10 } },
    ration_water_supplies: { durationTurns: 2, effectPerTurn: { foodDelta: -6 } },
  },
  evt_succession_whispers: {
    address_publicly: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    crack_down_harder: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    redirect_attention: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_succession_resolution: {
    crown_heir_publicly: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    exile_rivals: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    grant_rival_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
  },
  evt_succession_question: {
    convene_council: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    declare_heir: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    silence_rumors: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_succession_heir_challenged: {
    discredit_rival: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    imprison_rival: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    negotiate_with_rival: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_succession_council_deadlock: {
    dissolve_council: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    extend_deliberations: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    force_decision: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_succession_anxiety_root: {
    convene_great_lords: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    name_heir_publicly: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    suppress_rumors: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_schism_underground_worship: {
    crack_down: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    infiltrate_cells: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    tolerate_quietly: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_schism_reform_backlash: {
    appease_clergy: { durationTurns: 2, effectPerTurn: { heterodoxyDelta: -1 } },
    impose_silence: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    stand_with_reformists: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_schism_factions: {
    back_traditionalists: { durationTurns: 2, effectPerTurn: { faithDelta: +1 } },
    remain_neutral: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    support_reformers: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_regional_unrest: {
    summon_local_leaders: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_region_separatist_sentiment: {
    dispatch_royal_governor: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
    show_of_force: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_plague_noble_spread: {
    emergency_measures: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    isolate_and_wait: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_plague_bankruptcy: {
    emergency_loans: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
    levy_crisis_tax: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
    slash_all_spending: { durationTurns: 2, effectPerTurn: { treasuryDelta: +6 } },
  },
  evt_plague_aftermath: {
    exploit_cheap_labor: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
  },
  evt_noble_succession_dispute: {
    let_nobles_settle_it: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    mediate_succession: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
    support_senior_claimant: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_noble_resentment_merchant_favor: {
    appease_nobility: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    maintain_merchant_policies: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    mediate_compromise: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_noble_land_seizure: {
    impose_compensation: { durationTurns: 2, effectPerTurn: { treasuryDelta: +5 } },
    reverse_seizures: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    uphold_noble_claims: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_noble_intrigue_discovered: {
    confront_directly: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    ignore_for_now: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    launch_counter_intelligence: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_mutiny_pay_bankrupt: {
    emergency_taxation: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
    reduce_military_size: { durationTurns: 2, effectPerTurn: { treasuryDelta: +6 } },
    seize_noble_assets: { durationTurns: 2, effectPerTurn: { treasuryDelta: +16 } },
  },
  evt_military_equipment_shortage_2: {
    full_rearmament_program: { durationTurns: 2, effectPerTurn: { treasuryDelta: -40 } },
    reduce_force_size: { durationTurns: 2, effectPerTurn: { militaryEquipmentDelta: +1 } },
    request_allied_supplies: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_merchant_tax_shortfall: {
    cut_spending: { durationTurns: 2, effectPerTurn: { treasuryDelta: +3 } },
    raise_taxes_elsewhere: { durationTurns: 2, effectPerTurn: { treasuryDelta: +6 } },
    reverse_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: +8 } },
  },
  evt_merchant_smuggling_ring: {
    infiltrate_network: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
    levy_fines_and_warn: { durationTurns: 2, effectPerTurn: { treasuryDelta: +8 } },
    raid_smuggling_operation: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
  },
  evt_merchant_guild_demands_root: {
    grant_council_seat: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    offer_tax_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    refuse_reassert_authority: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_merchant_council_overreach: {
    dissolve_council: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    limit_council_powers: { durationTurns: 2, effectPerTurn: { nobilitySatDelta: +1 } },
    side_with_merchants: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_harvest_blight: {
    purchase_foreign_grain: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    redirect_labor_to_salvage: { durationTurns: 2, effectPerTurn: { foodDelta: -3 } },
  },
  evt_grain_ration_riots: {
    distribute_reserves: { durationTurns: 2, effectPerTurn: { foodDelta: -3 } },
    negotiate_with_rioters: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
    suppress_market_riots: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_grain_noble_plot: {
    arrest_ringleaders: { durationTurns: 2, effectPerTurn: { foodDelta: -1 } },
    negotiate_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    show_of_force: { durationTurns: 2, effectPerTurn: { foodDelta: -3 } },
  },
  evt_grain_import_merchant_leverage: {
    grant_tariff_exemptions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    partial_concessions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
    refuse_merchant_demands: { durationTurns: 2, effectPerTurn: { treasuryDelta: +1 } },
  },
  evt_grain_crisis_root: {
    import_grain: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    ration_strictly: { durationTurns: 2, effectPerTurn: { foodDelta: +3 } },
    seize_noble_reserves: { durationTurns: 2, effectPerTurn: { foodDelta: +6 } },
  },
  evt_foreign_invasion_rumor: {
    dismiss_as_rumor: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    dispatch_scouts: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    mobilize_defenses: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
  },
  evt_faith_schism_root: {
    back_orthodox: { durationTurns: 2, effectPerTurn: { heterodoxyDelta: -1 } },
    support_reformists: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    suppress_all_factions: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_commoner_plague_outbreak: {
    distribute_herbal_remedies: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    mobilize_clergy_healers: { durationTurns: 2, effectPerTurn: { treasuryDelta: -15 } },
  },
  evt_clergy_power_grab: {
    accept_clergy_influence: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    assert_royal_authority: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    negotiate_boundaries: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_border_incursion_root: {
    fortify_and_absorb: { durationTurns: 2, effectPerTurn: { foodDelta: -6 } },
  },
  evt_border_fortify_famine: {
    emergency_food_imports: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    enforce_rationing: { durationTurns: 2, effectPerTurn: { foodDelta: +1 } },
    redistribute_reserves: { durationTurns: 2, effectPerTurn: { foodDelta: +3 } },
  },
  evt_audit_corruption_found: {
    cover_up_findings: { durationTurns: 2, effectPerTurn: { treasuryDelta: -3 } },
    demand_restitution: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
    prosecute_officials: { durationTurns: 2, effectPerTurn: { treasuryDelta: +6 } },
  },
  evt_exp_rel_sacred_desecration: {
    call_for_reconciliation: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    hunt_perpetrators: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
  },
  evt_exp_rel_divine_portent: {
    call_for_penance: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    declare_divine_favor: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    dismiss_superstition: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
  },
  evt_exp_rel_clerical_corruption: {
    internal_reform: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    look_the_other_way: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    royal_inquisition: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
  },
  evt_exp_po_refugee_influx: {
    close_the_borders: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_po_prison_overcrowding: {
    build_new_prison: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    forced_labor_gangs: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
    release_minor_offenders: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_po_market_riots: {
    deploy_garrison: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    negotiate_with_ringleaders: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
  },
  evt_exp_po_gang_warfare: {
    offer_gang_leaders_positions: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    pit_gangs_against_each_other: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_po_crime_wave: {
    empower_neighborhood_watches: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    public_executions: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_mil_war_preparations: {
    full_war_mobilization: { durationTurns: 2, effectPerTurn: { treasuryDelta: -40 } },
  },
  evt_exp_mil_siege_preparations: {
    full_siege_mobilization: { durationTurns: 2, effectPerTurn: { treasuryDelta: -40 } },
  },
  evt_exp_mil_naval_operations: {
    commission_war_galleys: { durationTurns: 2, effectPerTurn: { treasuryDelta: -23 } },
    focus_on_land_forces: { durationTurns: 2, effectPerTurn: { militaryReadinessDelta: -1 } },
    refit_merchant_vessels: { durationTurns: 2, effectPerTurn: { treasuryDelta: -11 } },
  },
  evt_exp_mil_discipline_crisis: {
    address_grievances: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    enforce_strict_discipline: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    rotate_troublesome_units: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_mil_court_martial: {
    pardon_and_reassign: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    public_tribunal: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    quiet_discharge: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_mil_cavalry_training: {
    expand_existing_stables: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    maintain_infantry_focus: { durationTurns: 2, effectPerTurn: { militaryReadinessDelta: -1 } },
  },
  evt_exp_mil_academy_proposal: {
    defer_to_peacetime: { durationTurns: 2, effectPerTurn: { militaryMoraleDelta: -1 } },
    expand_officer_training: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    found_royal_academy: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
  },
  evt_exp_kno_student_uprising: {
    close_academy_temporarily: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    disperse_by_force: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    negotiate_with_students: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
    evt_exp_kno_rival_hoards: {
    develop_independently: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    propose_knowledge_exchange: { durationTurns: 3, effectPerTurn: { culturalCohesionDelta: +1 } },
    send_spies_to_copy: { durationTurns: 3, effectPerTurn: { espionageNetworkDelta: +1 } },
  },

  evt_exp_kno_plague_remedy: {
    dismiss_as_quackery: { durationTurns: 2, effectPerTurn: { treasuryDelta: -1 } },
    mass_produce_remedy: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    test_on_volunteers: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
  },
  evt_exp_kno_library_fire: {
    let_it_burn: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_kno_censorship_demand: {
    create_review_board: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    enforce_censorship: { durationTurns: 2, effectPerTurn: { faithDelta: +1 } },
    protect_free_inquiry: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_kno_alchemist_discovery: {
    fund_military_application: { durationTurns: 2, effectPerTurn: { treasuryDelta: -23 } },
    restrict_to_civilian_use: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    suppress_findings: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_kgd_power_consolidation: {
    centralize_authority: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
    delegate_to_governors: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    maintain_balance: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_kgd_corruption_investigation: {
    offer_amnesty: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    private_purge: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
    public_tribunal: { durationTurns: 2, effectPerTurn: { treasuryDelta: +16 } },
  },
  evt_exp_fod_labour_shortage: {
    accept_reduced_harvest: { durationTurns: 2, effectPerTurn: { foodDelta: -6 } },
  },
  evt_exp_fod_imports_blocked: {
    enforce_strict_rationing: { durationTurns: 2, effectPerTurn: { foodDelta: +3 } },
  },
  evt_exp_fod_distribution_inequity: {
    maintain_current_distribution: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    mandate_equal_rationing: { durationTurns: 2, effectPerTurn: { foodDelta: -3 } },
    open_royal_granaries: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_exp_fod_crop_disease: {
    pray_for_divine_intervention: { durationTurns: 2, effectPerTurn: { foodDelta: -16 } },
  },
  evt_exp_esp_underground_resistance: {
    address_grievances: { durationTurns: 2, effectPerTurn: { treasuryDelta: -23 } },
  },
  evt_exp_esp_poisoning_attempt: {
    hire_royal_taster: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    purge_kitchen_staff: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
    trace_poison_source: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
  },
  evt_exp_esp_intelligence_failure: {
    accept_losses: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    rebuild_network: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    scapegoat_spymaster: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_esp_enemy_infiltration: {
    martial_law_purge: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    targeted_counter_ops: { durationTurns: 2, effectPerTurn: { treasuryDelta: -33 } },
  },
  evt_exp_esp_assassination_plot: {
    double_royal_guard: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    preemptive_arrests: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    set_counter_trap: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_exp_env_volcanic_ash_cloud: {
    seal_granaries_and_ration: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_exp_env_locust_swarm: {
    organize_pest_drives: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    pray_for_deliverance: { durationTurns: 2, effectPerTurn: { foodDelta: -6 } },
  },
  evt_exp_env_harsh_winter_early: {
    accelerate_harvest: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    open_emergency_stores: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    trust_preparations: { durationTurns: 2, effectPerTurn: { foodDelta: -1 } },
  },
  evt_exp_eco_warehouse_fire: {
    compensate_merchants_partially: { durationTurns: 2, effectPerTurn: { treasuryDelta: -11 } },
  },
  evt_exp_eco_smuggling: {
    bribe_smuggler_captains: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    ignore_the_smuggling: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_exp_eco_foreign_trade_disruption: {
    endure_the_shortfall: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    invest_in_domestic_production: { durationTurns: 2, effectPerTurn: { treasuryDelta: -23 } },
  },
  evt_exp_eco_debt_crisis: {
    impose_austerity_measures: { durationTurns: 2, effectPerTurn: { treasuryDelta: +20 } },
    negotiate_with_creditors: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
  },
  evt_exp_eco_currency_debasement: {
    debase_the_coinage: { durationTurns: 2, effectPerTurn: { treasuryDelta: +16 } },
    raise_emergency_tax: { durationTurns: 2, effectPerTurn: { treasuryDelta: +13 } },
  },
  evt_exp_cul_oral_history_keeper: {
    appoint_royal_chronicler: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    let_traditions_fade: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    transcribe_oral_traditions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_exp_cul_military_ceremony: {
    grand_military_parade: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
    skip_ceremony: { durationTurns: 2, effectPerTurn: { militaryMoraleDelta: -1 } },
    solemn_remembrance: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
  },
  evt_exp_cul_heretical_art: {
    convene_clergy_tribunal: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    defend_artistic_freedom: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
    destroy_offensive_works: { durationTurns: 2, effectPerTurn: { faithDelta: +1 } },
  },
  evt_exp_cul_dialect_tensions: {
    promote_bilingual_policy: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
  },
  evt_exp_cc_military_privilege_demand: {
    grant_military_estates: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    offer_honorary_titles: { durationTurns: 2, effectPerTurn: { treasuryDelta: -6 } },
    refuse_special_treatment: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_cc_land_ownership_dispute: {
    enforce_existing_deeds: { durationTurns: 2, effectPerTurn: { foodDelta: -1 } },
    establish_tenant_protections: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_exp_cc_clerical_overreach: {
    limit_church_holdings: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
    negotiate_boundaries: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
    sanction_expanded_tithes: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
  },
  evt_exp_chain_spy_war_resolution: {
    cut_losses_and_rebuild: { durationTurns: 2, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_exp_chain_renaissance_golden: {
    channel_into_practical_arts: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    declare_golden_age: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    maintain_current_course: { durationTurns: 2, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_chain_reformation_split: {
    mediate_between_factions: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
    side_with_orthodox: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
    side_with_reformers: { durationTurns: 2, effectPerTurn: { faithDelta: -1 } },
  },
  evt_exp_chain_rebellion_separatist: {
    promise_reforms: { durationTurns: 2, effectPerTurn: { treasuryDelta: -1 } },
  },
  evt_exp_chain_drought_summer: {
    endure_and_hope: { durationTurns: 2, effectPerTurn: { foodDelta: -5 } },
    import_water_by_caravan: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
  },
  evt_exp_chain_drought_autumn: {
    emergency_food_imports: { durationTurns: 2, effectPerTurn: { treasuryDelta: -33 } },
    strict_rationing: { durationTurns: 2, effectPerTurn: { foodDelta: +1 } },
  },
  evt_exp_chain_corruption_investigation: {
    expand_investigation: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    offer_amnesty_for_testimony: { durationTurns: 2, effectPerTurn: { treasuryDelta: +10 } },
    suppress_findings: { durationTurns: 2, effectPerTurn: { stabilityDelta: -1 } },
  },
  evt_exp_chain_border_war_mobilization: {
    defensive_posture: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    full_mobilization: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
  },
  evt_cond_harshwinter_moderate: {
    distribute_firewood: { durationTurns: 2, effectPerTurn: { treasuryDelta: -13 } },
    open_shelters: { durationTurns: 2, effectPerTurn: { treasuryDelta: -8 } },
    wait_for_thaw: { durationTurns: 2, effectPerTurn: { militaryMoraleDelta: -1 } },
  },
  evt_cond_flood_moderate: {
    evacuate_lowlands: { durationTurns: 2, effectPerTurn: { treasuryDelta: -10 } },
    let_floodwaters_pass: { durationTurns: 2, effectPerTurn: { foodDelta: -5 } },
    reinforce_levees: { durationTurns: 2, effectPerTurn: { treasuryDelta: -20 } },
  },
  evt_cond_drought_moderate: {
    emergency_irrigation: { durationTurns: 2, effectPerTurn: { treasuryDelta: -26 } },
    import_water: { durationTurns: 2, effectPerTurn: { treasuryDelta: -16 } },
    pray_for_rain: { durationTurns: 2, effectPerTurn: { faithDelta: +1 } },
  },
  evt_exp_w2_monetary_crisis: {
    borrow_from_the_merchants: { durationTurns: 4, effectPerTurn: { treasuryDelta: -4 } },
    seize_the_old_hoards: { durationTurns: 3, effectPerTurn: { nobilitySatDelta: -1 } },
  },
  evt_exp_w2_mercenary_defection: {
    brand_them_as_deserters: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: -1 } },
    match_the_foreign_wages: { durationTurns: 4, effectPerTurn: { treasuryDelta: -8 } },
    recruit_local_replacements: { durationTurns: 3, effectPerTurn: { militaryReadinessDelta: +1 } },
  },
  evt_exp_w2_food_riot_escalation: {
    hang_the_ringleaders: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1 } },
    open_the_royal_granaries: { durationTurns: 3, effectPerTurn: { foodDelta: -2 } },
    post_guards_at_the_markets: { durationTurns: 3, effectPerTurn: { stabilityDelta: +1 } },
  },
  evt_exp_w2_bonded_labor_revolt: {
    crush_with_the_levy: { durationTurns: 3, effectPerTurn: { militaryMoraleDelta: -1 } },
    grant_limited_emancipation: { durationTurns: 4, effectPerTurn: { nobilitySatDelta: -1 } },
    negotiate_better_terms: { durationTurns: 3, effectPerTurn: { commonerSatDelta: +1 } },
  },
  evt_exp_w2_prophet_appears: {
    confine_to_a_monastery: { durationTurns: 3, effectPerTurn: { heterodoxyDelta: +1 } },
    denounce_as_false: { durationTurns: 3, effectPerTurn: { clergySatDelta: -1 } },
    invite_to_the_cathedral: { durationTurns: 4, effectPerTurn: { faithDelta: +1 } },
  },
  evt_exp_w2_royal_illness: {
    govern_through_the_sickness: { durationTurns: 4, effectPerTurn: { stabilityDelta: -1 } },
    summon_foreign_physicians: { durationTurns: 3, effectPerTurn: { treasuryDelta: -6 } },
    trust_the_cathedral_healers: { durationTurns: 4, effectPerTurn: { faithDelta: +1 } },
  },
  evt_exp_w2_bandit_lord_uprising: {
    offer_the_lord_a_title: { durationTurns: 4, effectPerTurn: { nobilitySatDelta: -1 } },
    pay_his_silence: { durationTurns: 3, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_exp_w2_drought_escalation: {
    lead_a_rain_procession: { durationTurns: 3, effectPerTurn: { faithDelta: +1 } },
    ration_water_strictly: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1 } },
  },
  evt_exp_w2_well_poisoning: {
    blame_a_rival: { durationTurns: 3, effectPerTurn: { diplomacyDeltas: {} } },
    hunt_the_saboteurs: { durationTurns: 3, effectPerTurn: { espionageNetworkDelta: +1 } },
    quietly_replace_the_wells: { durationTurns: 3, effectPerTurn: { treasuryDelta: -5 } },
  },
  evt_exp_w2_naval_disaster: {
    blame_the_captain: { durationTurns: 2, effectPerTurn: { militaryMoraleDelta: -1 } },
    fund_emergency_shipyard: { durationTurns: 4, effectPerTurn: { treasuryDelta: -6 } },
    recall_merchant_vessels: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1 } },
  },
  evt_exp_w2_plague_variant: {
    open_hospitals_for_all: { durationTurns: 4, effectPerTurn: { treasuryDelta: -4, commonerSatDelta: +1 } },
    pray_and_wait: { durationTurns: 3, effectPerTurn: { faithDelta: +1 } },
  },
};
