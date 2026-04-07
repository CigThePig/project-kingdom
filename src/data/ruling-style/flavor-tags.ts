// Phase 5.2 — Style Tag Assignment
// Maps event choices and decrees to ruling style axis deltas.
// Each delta is in the range +-1 to +-5. The rolling window of 20 decisions
// and axis range of -50 to +50 means individual deltas are small nudges.
//
// Axis directions:
//   Authority: Permissive (-) <-> Authoritarian (+)
//   Economy:   Populist (-)   <-> Mercantilist (+)
//   Military:  Pacifist (-)   <-> Martial (+)
//   Faith:     Secular (-)    <-> Theocratic (+)

import { StyleAxis } from '../../engine/types';

type AxisDeltas = Partial<Record<StyleAxis, number>>;

// ============================================================
// Event Choice Style Tags
// ============================================================
// Outer key: event definition ID
// Inner key: choice ID
// Value: axis deltas for that choice

export const EVENT_CHOICE_STYLE_TAGS: Record<string, Record<string, AxisDeltas>> = {
  // ---- Economy Events ----
  evt_merchant_capital_flight: {
    offer_tax_relief:        { [StyleAxis.Economy]: 2 },
    enforce_capital_controls: { [StyleAxis.Authority]: 3, [StyleAxis.Economy]: -1 },
    negotiate_with_guilds:   { [StyleAxis.Economy]: 1 },
  },
  evt_treasury_windfall: {
    invest_in_infrastructure: { [StyleAxis.Economy]: 2 },
    distribute_to_populace:   { [StyleAxis.Economy]: -2 },
    bolster_reserves:         {},
  },

  // ---- Food Events ----
  evt_harvest_blight: {
    quarantine_affected_fields: { [StyleAxis.Authority]: 1 },
    redirect_labor_to_salvage:  { [StyleAxis.Authority]: 1 },
    purchase_foreign_grain:     { [StyleAxis.Economy]: 2 },
  },
  evt_commoner_harvest_festival: {
    endorse_celebrations:    { [StyleAxis.Faith]: 1 },
    observe_without_comment: {},
  },

  // ---- Military Events ----
  evt_military_equipment_shortage_1: {
    emergency_procurement:       { [StyleAxis.Military]: 2, [StyleAxis.Economy]: 1 },
    redistribute_existing_stock: { [StyleAxis.Military]: 1 },
    defer_to_next_month:         { [StyleAxis.Military]: -1 },
  },
  evt_military_equipment_shortage_2: {
    full_rearmament_program: { [StyleAxis.Military]: 4, [StyleAxis.Economy]: 2 },
    request_allied_supplies: { [StyleAxis.Military]: 1 },
    reduce_force_size:       { [StyleAxis.Military]: -3 },
  },

  // ---- Diplomacy Events ----
  evt_neighbor_trade_overture: {
    accept_trade_terms:    { [StyleAxis.Economy]: 2 },
    propose_modifications: { [StyleAxis.Economy]: 1, [StyleAxis.Authority]: 1 },
    decline_politely:      { [StyleAxis.Economy]: -1 },
  },
  evt_border_tension_escalation: {
    reinforce_border_garrisons: { [StyleAxis.Military]: 3 },
    dispatch_diplomatic_envoy:  { [StyleAxis.Military]: -2 },
    issue_formal_protest:       { [StyleAxis.Authority]: 1 },
  },

  // ---- Environment Events ----
  evt_early_frost: {
    mobilize_harvest_crews: { [StyleAxis.Authority]: 1 },
    open_emergency_stores:  { [StyleAxis.Economy]: -1 },
    accept_the_losses:      {},
  },
  evt_spring_flooding: {
    organize_relief_effort:              { [StyleAxis.Economy]: -1 },
    redirect_military_engineers:         { [StyleAxis.Military]: 1 },
    levy_emergency_reconstruction_tax:   { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: 1 },
  },

  // ---- Class Conflict Events ----
  evt_commoner_labor_dispute: {
    mediate_negotiations:      {},
    side_with_laborers:        { [StyleAxis.Economy]: -3 },
    enforce_existing_contracts: { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: 2 },
  },

  // ---- Public Order Events ----
  evt_popular_unrest: {
    address_grievances_publicly: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
    deploy_peacekeepers:         { [StyleAxis.Authority]: 2, [StyleAxis.Military]: 2 },
    impose_curfew:               { [StyleAxis.Authority]: 4 },
  },

  // ---- Religion Events ----
  evt_heresy_emergence: {
    investigate_teachings:      { [StyleAxis.Faith]: -1 },
    suppress_immediately:       { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 2 },
    permit_theological_debate:  { [StyleAxis.Faith]: -2 },
  },
  evt_schism_crisis: {
    convene_ecclesiastical_council: { [StyleAxis.Faith]: 2 },
    enforce_state_doctrine:         { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 3 },
    allow_coexistence:              { [StyleAxis.Faith]: -2 },
  },

  // ---- Culture Events ----
  evt_foreign_cultural_influx: {
    embrace_exchange:           { [StyleAxis.Faith]: -1, [StyleAxis.Economy]: 1 },
    regulate_foreign_practices: { [StyleAxis.Authority]: 2, [StyleAxis.Faith]: 1 },
    observe_and_assess:         {},
  },
  evt_cultural_festival_proposal: {
    approve_full_festival:  { [StyleAxis.Faith]: 1, [StyleAxis.Economy]: -1 },
    approve_modest_version: { [StyleAxis.Faith]: 1 },
    decline_proposal:       {},
  },

  // ---- Espionage Events ----
  evt_foreign_agent_detected: {
    arrest_and_interrogate: { [StyleAxis.Authority]: 3 },
    monitor_covertly:       { [StyleAxis.Authority]: 1 },
    expel_from_kingdom:     { [StyleAxis.Authority]: 1, [StyleAxis.Military]: -1 },
  },
  evt_noble_intrigue_discovered: {
    confront_directly:           { [StyleAxis.Authority]: 3 },
    launch_counter_intelligence: { [StyleAxis.Authority]: 2 },
    ignore_for_now:              { [StyleAxis.Authority]: -2 },
  },

  // ---- Knowledge Events ----
  evt_scholarly_breakthrough: {
    fund_further_research:     { [StyleAxis.Faith]: -1, [StyleAxis.Economy]: 1 },
    apply_practical_findings:  { [StyleAxis.Economy]: 2 },
    acknowledge_achievement:   {},
  },
  evt_library_fire: {
    launch_restoration_effort: { [StyleAxis.Faith]: -1 },
    investigate_cause:         { [StyleAxis.Authority]: 1 },
    accept_and_rebuild:        {},
  },

  // ---- Class Conflict Events (continued) ----
  evt_noble_merchant_rivalry: {
    broker_compromise:           {},
    uphold_noble_privileges:     { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: -1 },
    recognize_merchant_standing: { [StyleAxis.Economy]: 3, [StyleAxis.Authority]: -1 },
  },
  evt_clergy_merchant_dispute: {
    side_with_clergy:     { [StyleAxis.Faith]: 3, [StyleAxis.Economy]: -1 },
    side_with_merchants:  { [StyleAxis.Economy]: 3, [StyleAxis.Faith]: -1 },
    seek_middle_ground:   {},
  },

  // ---- Region Events ----
  evt_regional_development_opportunity: {
    approve_development:       { [StyleAxis.Economy]: 2 },
    defer_to_local_governance: { [StyleAxis.Authority]: -2 },
    decline_investment:        {},
  },
  evt_regional_unrest: {
    dispatch_relief_and_reforms: { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
    send_peacekeeping_force:     { [StyleAxis.Military]: 2, [StyleAxis.Authority]: 2 },
    summon_local_leaders:        { [StyleAxis.Authority]: -1 },
  },

  // ---- Kingdom Events ----
  evt_annual_state_assessment: {
    review_in_full:      { [StyleAxis.Authority]: 1 },
    acknowledge_receipt: {},
  },
  evt_kingdom_milestone_celebrated: {
    host_state_celebration:          { [StyleAxis.Faith]: 1, [StyleAxis.Economy]: -1 },
    issue_commemorative_decree:      { [StyleAxis.Authority]: 1 },
    note_with_quiet_satisfaction:    {},
  },

  // ---- Noble Events ----
  evt_noble_succession_dispute: {
    mediate_succession:       { [StyleAxis.Authority]: 1 },
    support_senior_claimant:  { [StyleAxis.Authority]: 2 },
    let_nobles_settle_it:     { [StyleAxis.Authority]: -2 },
  },
  evt_noble_court_faction: {
    co_opt_faction_leaders:    { [StyleAxis.Authority]: 1 },
    publicly_denounce_faction: { [StyleAxis.Authority]: 3 },
    monitor_faction_quietly:   {},
  },
  evt_noble_land_seizure: {
    reverse_seizures:      { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: -1 },
    impose_compensation:   { [StyleAxis.Economy]: 1 },
    uphold_noble_claims:   { [StyleAxis.Authority]: -1 },
  },

  // ---- Clergy Events ----
  evt_clergy_monastic_dispute: {
    arbitrate_dispute:                 { [StyleAxis.Authority]: 1, [StyleAxis.Faith]: 1 },
    favor_established_order:           { [StyleAxis.Faith]: 2 },
    leave_to_ecclesiastical_courts:    { [StyleAxis.Faith]: 1, [StyleAxis.Authority]: -1 },
  },
  evt_clergy_pilgrimage_movement: {
    endorse_pilgrimage:   { [StyleAxis.Faith]: 2 },
    provide_royal_escort: { [StyleAxis.Faith]: 2, [StyleAxis.Military]: 1 },
    discourage_travel:    { [StyleAxis.Faith]: -2, [StyleAxis.Authority]: 1 },
  },
  evt_clergy_prophecy_claim: {
    investigate_prophecy:    { [StyleAxis.Faith]: -1, [StyleAxis.Authority]: 1 },
    endorse_as_divine_sign: { [StyleAxis.Faith]: 4 },
    dismiss_as_superstition: { [StyleAxis.Faith]: -3 },
  },

  // ---- Merchant Events ----
  evt_merchant_guild_formation: {
    grant_guild_charter:    { [StyleAxis.Economy]: 2, [StyleAxis.Authority]: -1 },
    impose_royal_oversight: { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: 1 },
    deny_guild_petition:    { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: -2 },
  },
  evt_merchant_smuggling_ring: {
    raid_smuggling_operation: { [StyleAxis.Authority]: 2 },
    infiltrate_network:       { [StyleAxis.Authority]: 1 },
    levy_fines_and_warn:      { [StyleAxis.Economy]: 1 },
  },
  evt_merchant_foreign_traders: {
    welcome_foreign_merchants: { [StyleAxis.Economy]: 3 },
    negotiate_trade_terms:     { [StyleAxis.Economy]: 2, [StyleAxis.Authority]: 1 },
    restrict_foreign_access:   { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: 2 },
  },

  // ---- Commoner Events ----
  evt_commoner_plague_outbreak: {
    quarantine_affected_districts: { [StyleAxis.Authority]: 2 },
    mobilize_clergy_healers:       { [StyleAxis.Faith]: 2 },
    distribute_herbal_remedies:    { [StyleAxis.Economy]: -1 },
  },
  evt_commoner_folk_hero: {
    invite_to_court:       { [StyleAxis.Authority]: -1 },
    co_opt_folk_narrative:  { [StyleAxis.Authority]: 1 },
    ignore_the_stories:     {},
  },
  evt_commoner_migration_wave: {
    manage_resettlement: { [StyleAxis.Authority]: 1 },
    restrict_movement:   { [StyleAxis.Authority]: 3 },
    allow_natural_flow:  { [StyleAxis.Authority]: -2 },
  },

  // ---- Military Class Events ----
  evt_military_veteran_demands: {
    grant_veteran_pensions:    { [StyleAxis.Military]: 2, [StyleAxis.Economy]: -1 },
    offer_land_grants:         { [StyleAxis.Military]: 1 },
    acknowledge_service_only:  { [StyleAxis.Military]: -2 },
  },
  evt_military_desertion_crisis: {
    increase_military_pay:    { [StyleAxis.Military]: 2, [StyleAxis.Economy]: 1 },
    enforce_harsh_discipline: { [StyleAxis.Authority]: 3, [StyleAxis.Military]: 1 },
    appeal_to_honor:          { [StyleAxis.Military]: 1 },
  },
  evt_military_honor_dispute: {
    uphold_military_merit:   { [StyleAxis.Military]: 2 },
    defer_to_noble_rank:     { [StyleAxis.Authority]: 2 },
    establish_joint_council:  { [StyleAxis.Military]: 1, [StyleAxis.Authority]: -1 },
  },

  // ---- Seasonal Events ----
  evt_spring_planting_festival: {
    sponsor_planting_rites: { [StyleAxis.Faith]: 1 },
    attend_ceremonies:      {},
  },
  evt_spring_river_thaw: {
    reinforce_riverbanks: { [StyleAxis.Economy]: 1 },
    evacuate_lowlands:    { [StyleAxis.Authority]: 1 },
    monitor_water_levels: {},
  },
  evt_summer_drought: {
    ration_water_supplies: { [StyleAxis.Authority]: 2 },
    dig_emergency_wells:   { [StyleAxis.Economy]: 1 },
    pray_for_rain:         { [StyleAxis.Faith]: 3 },
  },
  evt_summer_trade_season: {
    host_trade_fair:        { [StyleAxis.Economy]: 3 },
    reduce_trade_tariffs:   { [StyleAxis.Economy]: 2 },
    maintain_current_policy: {},
  },
  evt_autumn_harvest_bounty: {
    stockpile_surplus:    {},
    export_for_profit:    { [StyleAxis.Economy]: 3 },
    distribute_to_poor:   { [StyleAxis.Economy]: -3 },
  },
  evt_autumn_bandit_raids: {
    dispatch_patrol_forces: { [StyleAxis.Military]: 2 },
    arm_rural_militia:      { [StyleAxis.Military]: 1, [StyleAxis.Authority]: -1 },
    increase_road_patrols:  { [StyleAxis.Military]: 1 },
  },
  evt_winter_blizzard: {
    open_warming_shelters:           { [StyleAxis.Economy]: -1 },
    distribute_fuel_and_blankets:    { [StyleAxis.Economy]: -1 },
    wait_out_the_storm:              {},
  },
  evt_winter_food_shortage: {
    impose_strict_rationing:  { [StyleAxis.Authority]: 2 },
    purchase_emergency_grain: { [StyleAxis.Economy]: 1 },
    request_neighbor_aid:     { [StyleAxis.Military]: -1 },
  },

  // ---- Region-Specific Events ----
  evt_region_mine_collapse: {
    launch_rescue_operation: { [StyleAxis.Economy]: -1 },
    hire_foreign_engineers:  { [StyleAxis.Economy]: 2 },
    seal_and_rebuild:        { [StyleAxis.Economy]: 1 },
  },
  evt_region_trade_route_disruption: {
    military_escort_caravans: { [StyleAxis.Military]: 2, [StyleAxis.Economy]: 1 },
    negotiate_safe_passage:   { [StyleAxis.Economy]: 1 },
    reroute_trade:            { [StyleAxis.Economy]: 1 },
  },
  evt_region_local_festival: {
    send_royal_blessing: { [StyleAxis.Faith]: 1 },
    attend_in_person:    { [StyleAxis.Authority]: -1 },
  },
  evt_region_resource_discovery: {
    fund_extraction: { [StyleAxis.Economy]: 3 },
    auction_rights:  { [StyleAxis.Economy]: 2 },
    survey_further:  {},
  },
  evt_region_infrastructure_decay: {
    fund_major_repairs: { [StyleAxis.Economy]: 1 },
    levy_local_labor:   { [StyleAxis.Authority]: 2 },
    defer_maintenance:  {},
  },
  evt_region_separatist_sentiment: {
    negotiate_autonomy_terms:  { [StyleAxis.Authority]: -3 },
    dispatch_royal_governor:   { [StyleAxis.Authority]: 3 },
    show_of_force:             { [StyleAxis.Authority]: 4, [StyleAxis.Military]: 3 },
  },

  // ---- Escalation Events ----
  evt_escalation_famine_panic: {
    seize_noble_granaries:      { [StyleAxis.Authority]: 3, [StyleAxis.Economy]: -2 },
    enforce_martial_rationing:  { [StyleAxis.Authority]: 4, [StyleAxis.Military]: 2 },
    appeal_for_calm:            { [StyleAxis.Authority]: -1 },
  },
  evt_escalation_treasury_crisis: {
    emergency_asset_sales:          { [StyleAxis.Economy]: 2 },
    demand_noble_contributions:     { [StyleAxis.Authority]: 3, [StyleAxis.Economy]: -1 },
    suspend_non_essential_spending: { [StyleAxis.Authority]: 2 },
  },
  evt_escalation_faith_collapse: {
    call_grand_synod:       { [StyleAxis.Faith]: 3 },
    impose_state_religion:  { [StyleAxis.Faith]: 5, [StyleAxis.Authority]: 4 },
    embrace_pluralism:      { [StyleAxis.Faith]: -4, [StyleAxis.Authority]: -2 },
  },
  evt_escalation_military_mutiny: {
    meet_mutiny_demands:    { [StyleAxis.Military]: 2, [StyleAxis.Authority]: -2 },
    isolate_ringleaders:    { [StyleAxis.Authority]: 3 },
    negotiate_with_officers: { [StyleAxis.Military]: 1 },
  },
  evt_escalation_noble_conspiracy: {
    preemptive_arrests:    { [StyleAxis.Authority]: 4 },
    offer_reconciliation:  { [StyleAxis.Authority]: -2 },
    plant_double_agents:   { [StyleAxis.Authority]: 2 },
  },
  evt_escalation_mass_exodus: {
    promise_sweeping_reforms: { [StyleAxis.Authority]: -3, [StyleAxis.Economy]: -2 },
    close_borders:            { [StyleAxis.Authority]: 4 },
    let_dissenters_leave:     { [StyleAxis.Authority]: -1 },
  },

  // ---- Knowledge Follow-up Events ----
  evt_scholarly_discovery: {
    patent_discovery:    { [StyleAxis.Economy]: 2 },
    share_with_clergy:   { [StyleAxis.Faith]: 2 },
    apply_to_military:   { [StyleAxis.Military]: 2 },
  },
  evt_practical_innovation_success: {
    expand_workshops:   { [StyleAxis.Economy]: 2 },
    train_artisans:     { [StyleAxis.Economy]: 1 },
    present_to_court:   {},
  },

  // ---- Follow-up / Chain Events ----
  evt_merchant_demands_escalate: {
    hold_firm_on_terms:      { [StyleAxis.Authority]: 2 },
    extend_concessions:      { [StyleAxis.Economy]: 2, [StyleAxis.Authority]: -1 },
    impose_trade_conditions: { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: 1 },
  },
  evt_merchant_underground_economy: {
    raid_smuggling_networks: { [StyleAxis.Authority]: 3 },
    legitimize_shadow_trade: { [StyleAxis.Economy]: 2, [StyleAxis.Authority]: -2 },
    increase_enforcement:    { [StyleAxis.Authority]: 2 },
  },
  evt_noble_backlash_labor: {
    appease_nobles:  { [StyleAxis.Authority]: 1, [StyleAxis.Economy]: 1 },
    stand_firm:      { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
    offer_compromise: {},
  },
  evt_commoner_work_slowdown: {
    impose_work_quotas: { [StyleAxis.Authority]: 3, [StyleAxis.Economy]: 2 },
    open_dialogue:      { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
    hire_foreign_labor: { [StyleAxis.Economy]: 2 },
  },
  evt_theological_schism_brewing: {
    host_grand_debate:   { [StyleAxis.Faith]: 1 },
    quietly_suppress:    { [StyleAxis.Faith]: 2, [StyleAxis.Authority]: 2 },
    embrace_new_thought: { [StyleAxis.Faith]: -3 },
  },
  evt_intelligence_network_payoff: {
    expose_conspiracy:     { [StyleAxis.Authority]: 2 },
    leverage_for_loyalty:  { [StyleAxis.Authority]: 2 },
    share_with_allies:     { [StyleAxis.Military]: -1 },
  },
  evt_foreign_grain_dependency: {
    invest_in_domestic_agriculture: { [StyleAxis.Economy]: -1 },
    negotiate_long_term_supply:     { [StyleAxis.Economy]: 2 },
    accept_dependency:              {},
  },
  evt_resource_boom: {
    expand_operations:       { [StyleAxis.Economy]: 3 },
    tax_windfall:            { [StyleAxis.Economy]: 1, [StyleAxis.Authority]: 1 },
    establish_workers_rights: { [StyleAxis.Economy]: -2 },
  },
  evt_clergy_healing_reputation: {
    establish_permanent_hospice: { [StyleAxis.Faith]: 2 },
    leverage_piety:              { [StyleAxis.Faith]: 2, [StyleAxis.Authority]: 1 },
    return_to_normal:            {},
  },
  evt_military_pay_expectation: {
    institutionalize_pay_scale: { [StyleAxis.Military]: 2 },
    revert_to_standard_pay:     { [StyleAxis.Military]: -1, [StyleAxis.Economy]: 1 },
    offer_land_instead:         { [StyleAxis.Military]: 1 },
  },
  evt_noble_resentment_merchant_favor: {
    appease_nobility:           { [StyleAxis.Authority]: 1, [StyleAxis.Economy]: -1 },
    maintain_merchant_policies: { [StyleAxis.Economy]: 2 },
    mediate_compromise:         {},
  },
  evt_commoner_uprising_neglect: {
    emergency_food_distribution: { [StyleAxis.Economy]: -2 },
    deploy_military_patrols:     { [StyleAxis.Military]: 2, [StyleAxis.Authority]: 3 },
    announce_labor_reforms:      { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
  },
  evt_clergy_power_grab: {
    assert_royal_authority:  { [StyleAxis.Authority]: 3, [StyleAxis.Faith]: -2 },
    negotiate_boundaries:    { [StyleAxis.Faith]: 1 },
    accept_clergy_influence: { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: -2 },
  },
  evt_military_coup_threat: {
    purge_conspirators:  { [StyleAxis.Authority]: 4, [StyleAxis.Military]: -1 },
    bribe_officer_corps: { [StyleAxis.Military]: 1, [StyleAxis.Economy]: 1 },
    address_grievances:  { [StyleAxis.Military]: 2, [StyleAxis.Authority]: -1 },
  },

  // ---- Plague Chain ----
  evt_plague_outbreak: {
    immediate_quarantine: { [StyleAxis.Authority]: 2 },
    mobilize_healers:     { [StyleAxis.Faith]: 1 },
    pray_for_deliverance: { [StyleAxis.Faith]: 4 },
  },
  evt_plague_spread: {
    strict_lockdown:         { [StyleAxis.Authority]: 4 },
    burn_infected_quarters:  { [StyleAxis.Authority]: 3 },
    import_foreign_medicine: { [StyleAxis.Economy]: 2 },
  },
  evt_plague_aftermath: {
    rebuild_and_memorialize: { [StyleAxis.Faith]: 1 },
    impose_sanitation_laws:  { [StyleAxis.Authority]: 2 },
    exploit_cheap_labor:     { [StyleAxis.Economy]: 3, [StyleAxis.Authority]: 1 },
  },

  // ---- Trade War Chain ----
  evt_trade_war_tariffs: {
    retaliatory_tariffs: { [StyleAxis.Economy]: -1, [StyleAxis.Authority]: 1 },
    negotiate_terms:     { [StyleAxis.Economy]: 1 },
    absorb_the_costs:    { [StyleAxis.Economy]: -1 },
  },
  evt_trade_war_escalation: {
    embargo_neighbor:          { [StyleAxis.Economy]: -2, [StyleAxis.Military]: 1 },
    seek_alternative_markets:  { [StyleAxis.Economy]: 2 },
    capitulate:                { [StyleAxis.Economy]: 1, [StyleAxis.Authority]: -2 },
  },
  evt_trade_war_resolution: {
    favorable_treaty:    { [StyleAxis.Economy]: 2, [StyleAxis.Authority]: 1 },
    mutual_concessions:  { [StyleAxis.Economy]: 1 },
    accept_losses:       {},
  },

  // ---- Succession Chain ----
  evt_succession_question: {
    declare_heir:    { [StyleAxis.Authority]: 3 },
    convene_council: { [StyleAxis.Authority]: -1 },
    silence_rumors:  { [StyleAxis.Authority]: 1 },
  },
  evt_succession_factions: {
    back_eldest_claim:       { [StyleAxis.Authority]: 2 },
    support_merit_candidate: { [StyleAxis.Authority]: -1 },
    play_factions:           { [StyleAxis.Authority]: 1 },
  },
  evt_succession_resolution: {
    crown_heir_publicly:     { [StyleAxis.Authority]: 2 },
    exile_rivals:            { [StyleAxis.Authority]: 4 },
    grant_rival_concessions: { [StyleAxis.Authority]: -2 },
  },

  // ---- Famine Chain ----
  evt_food_shortage_warning: {
    impose_strict_rationing: { [StyleAxis.Authority]: 2 },
    buy_grain_reserves:      { [StyleAxis.Economy]: 1 },
    reduce_military_rations: { [StyleAxis.Military]: -2 },
  },
  evt_famine_crisis: {
    open_royal_granaries:     { [StyleAxis.Economy]: -2 },
    commandeer_noble_stores:  { [StyleAxis.Authority]: 3, [StyleAxis.Economy]: -1 },
    appeal_to_neighbors:      { [StyleAxis.Military]: -1 },
  },
  evt_famine_recovery: {
    invest_in_agriculture:     { [StyleAxis.Economy]: -1 },
    establish_grain_reserves:  { [StyleAxis.Authority]: 1 },
    celebrate_survival:        { [StyleAxis.Faith]: 1 },
  },

  // ---- Schism Chain ----
  evt_doctrinal_dispute: {
    convene_theological_council: { [StyleAxis.Faith]: 2 },
    enforce_orthodox_doctrine:   { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 2 },
    allow_scholarly_debate:      { [StyleAxis.Faith]: -2 },
  },
  evt_schism_factions: {
    support_reformers:    { [StyleAxis.Faith]: -2 },
    back_traditionalists: { [StyleAxis.Faith]: 3 },
    remain_neutral:       {},
  },
  evt_schism_resolution: {
    declare_unified_doctrine: { [StyleAxis.Faith]: 2, [StyleAxis.Authority]: 2 },
    formalize_tolerance:      { [StyleAxis.Faith]: -3, [StyleAxis.Authority]: -1 },
    suppress_dissent:         { [StyleAxis.Authority]: 3, [StyleAxis.Faith]: 2 },
  },

  // ---- Merchant Follow-up ----
  evt_merchant_permanent_concessions: {
    grant_permanent_charter: { [StyleAxis.Economy]: 3, [StyleAxis.Authority]: -1 },
    reject_demands:          { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: -1 },
    offer_limited_concession: { [StyleAxis.Economy]: 1 },
  },

  // ---- Heresy Follow-up ----
  evt_underground_heretical_movement: {
    infiltrate_movement:       { [StyleAxis.Authority]: 2 },
    public_amnesty:            { [StyleAxis.Faith]: -2, [StyleAxis.Authority]: -2 },
    double_down_suppression:   { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 3 },
  },

  // ---- Military Follow-up ----
  evt_equipment_failure_field: {
    emergency_field_repair: { [StyleAxis.Military]: 1 },
    retreat_and_regroup:    { [StyleAxis.Military]: -1 },
    push_through:           { [StyleAxis.Military]: 2 },
  },

  // ---- High-Stakes Standalone ----
  evt_golden_age_opportunity: {
    patron_arts_sciences: { [StyleAxis.Faith]: -1, [StyleAxis.Economy]: 1 },
    host_grand_festival:  { [StyleAxis.Faith]: 2 },
    invest_in_education:  { [StyleAxis.Faith]: -1, [StyleAxis.Economy]: 1 },
  },
  evt_assassination_attempt: {
    purge_inner_circle:    { [StyleAxis.Authority]: 5 },
    increase_royal_guard:  { [StyleAxis.Authority]: 2, [StyleAxis.Military]: 2 },
    show_mercy:            { [StyleAxis.Authority]: -3 },
  },
  evt_foreign_invasion_rumor: {
    mobilize_defenses: { [StyleAxis.Military]: 3 },
    dispatch_scouts:   { [StyleAxis.Military]: 1 },
    dismiss_as_rumor:  { [StyleAxis.Military]: -2 },
  },
};

// ============================================================
// Decree Style Tags
// ============================================================
// Key: decree ID
// Value: axis deltas for enacting that decree

export const DECREE_STYLE_TAGS: Record<string, AxisDeltas> = {
  // ---- Economic Chain: Market ----
  decree_market_charter:           { [StyleAxis.Economy]: 2 },
  decree_trade_guild_expansion:    { [StyleAxis.Economy]: 3 },
  decree_merchant_republic_charter: { [StyleAxis.Economy]: 4, [StyleAxis.Authority]: -2 },

  // ---- Economic Chain: Trade ----
  decree_trade_subsidies:          { [StyleAxis.Economy]: 2 },
  decree_trade_monopoly:           { [StyleAxis.Economy]: 3, [StyleAxis.Authority]: 2 },
  decree_international_trade_empire: { [StyleAxis.Economy]: 5 },

  // ---- Military: Emergency ----
  decree_emergency_levy:           { [StyleAxis.Military]: 2, [StyleAxis.Authority]: 1 },

  // ---- Military Chain: Fortification ----
  decree_fortify_borders:          { [StyleAxis.Military]: 2 },
  decree_integrated_defense_network: { [StyleAxis.Military]: 3, [StyleAxis.Economy]: 1 },
  decree_fortress_kingdom:         { [StyleAxis.Military]: 5 },

  // ---- Military Chain: Arms ----
  decree_arms_commission:          { [StyleAxis.Military]: 2, [StyleAxis.Economy]: 1 },
  decree_royal_arsenal:            { [StyleAxis.Military]: 3 },
  decree_war_machine_industry:     { [StyleAxis.Military]: 4, [StyleAxis.Economy]: 2 },

  // ---- Military: Mobilization ----
  decree_general_mobilization:     { [StyleAxis.Military]: 5, [StyleAxis.Authority]: 2 },

  // ---- Infrastructure Chain: Roads ----
  decree_road_improvement:         { [StyleAxis.Economy]: 1 },
  decree_provincial_highway_system: { [StyleAxis.Economy]: 2 },
  decree_kingdom_transit_network:  { [StyleAxis.Economy]: 3 },

  // ---- Governance Chain: Administration ----
  decree_census:                   { [StyleAxis.Authority]: 1 },
  decree_administrative_reform:    { [StyleAxis.Authority]: 2 },
  decree_royal_bureaucracy:        { [StyleAxis.Authority]: 3 },
  decree_centralized_governance:   { [StyleAxis.Authority]: 5 },

  // ---- Faith: Festival ----
  decree_call_festival:            { [StyleAxis.Faith]: 1 },

  // ---- Faith Chain: Religious Authority ----
  decree_invest_religious_order:   { [StyleAxis.Faith]: 2 },
  decree_expand_religious_authority: { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 1 },
  decree_theocratic_council:       { [StyleAxis.Faith]: 5, [StyleAxis.Authority]: 2 },

  // ---- Faith Chain: Heresy Suppression ----
  decree_suppress_heresy:          { [StyleAxis.Faith]: 3, [StyleAxis.Authority]: 2 },
  decree_inquisitorial_authority:  { [StyleAxis.Faith]: 4, [StyleAxis.Authority]: 3 },
  decree_religious_unification:    { [StyleAxis.Faith]: 5, [StyleAxis.Authority]: 3 },

  // ---- Diplomacy Chain ----
  decree_diplomatic_envoy:         { [StyleAxis.Military]: -1 },
  decree_permanent_embassy:        { [StyleAxis.Military]: -1 },
  decree_diplomatic_supremacy:     { [StyleAxis.Military]: -2, [StyleAxis.Economy]: 1 },

  // ---- Diplomacy: Trade Agreement ----
  decree_trade_agreement:          { [StyleAxis.Economy]: 2 },

  // ---- Diplomacy Chain: Dynasty ----
  decree_royal_marriage:           { [StyleAxis.Authority]: 1 },
  decree_dynasty_alliance:         { [StyleAxis.Authority]: 2 },
  decree_imperial_confederation:   { [StyleAxis.Authority]: 4 },

  // ---- Populist Chain: Food ----
  decree_public_granary:           { [StyleAxis.Economy]: -1 },
  decree_regional_food_distribution: { [StyleAxis.Economy]: -2 },
  decree_kingdom_breadbasket:      { [StyleAxis.Economy]: -3 },

  // ---- Populist Chain: Labor ----
  decree_labor_rights:             { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
  decree_workers_guild_charter:    { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
  decree_social_contract:          { [StyleAxis.Economy]: -4, [StyleAxis.Authority]: -2 },

  // ---- Populist: Land ----
  decree_land_redistribution:      { [StyleAxis.Economy]: -3, [StyleAxis.Authority]: 2 },

  // ---- Agricultural ----
  decree_crop_rotation:            { [StyleAxis.Economy]: -1 },
  decree_irrigation_works:         { [StyleAxis.Economy]: 1 },

  // ---- Military Standalone ----
  decree_advanced_fortifications:  { [StyleAxis.Military]: 3 },
  decree_elite_training_program:   { [StyleAxis.Military]: 3 },

  // ---- Governance Standalone ----
  decree_tax_code_reform:          { [StyleAxis.Authority]: 2, [StyleAxis.Economy]: 1 },
  decree_provincial_governance:    { [StyleAxis.Authority]: -2 },

  // ---- Maritime/Trade ----
  decree_harbor_expansion:         { [StyleAxis.Economy]: 2 },
  decree_trade_fleet_commission:   { [StyleAxis.Economy]: 3, [StyleAxis.Military]: 1 },

  // ---- Knowledge/Education ----
  decree_university_charter:       { [StyleAxis.Faith]: -2 },
  decree_diplomatic_academy:       { [StyleAxis.Military]: -1 },
  decree_engineering_corps:        { [StyleAxis.Military]: 1, [StyleAxis.Economy]: 1 },
  decree_medical_reforms:          { [StyleAxis.Economy]: -1 },
};
