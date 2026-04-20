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
    accept_and_rebuild:        { [StyleAxis.Economy]: -1 },
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
    decline_involvement:    { [StyleAxis.Faith]: -1 },
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
    send_royal_blessing:    { [StyleAxis.Faith]: 1 },
    attend_in_person:       { [StyleAxis.Authority]: -1 },
    ignore_the_festivities: { [StyleAxis.Authority]: 1 },
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
    close_borders:            { [StyleAxis.Authority]: 4, [StyleAxis.Military]: 1 },
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
    mediate_compromise:         { [StyleAxis.Authority]: -1 },
  },
  evt_commoner_uprising_neglect: {
    emergency_food_distribution: { [StyleAxis.Economy]: -2 },
    deploy_military_patrols:     { [StyleAxis.Military]: 2, [StyleAxis.Authority]: 3 },
    announce_labor_reforms:      { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: -1 },
  },
  evt_clergy_power_grab: {
    assert_royal_authority:  { [StyleAxis.Authority]: 3, [StyleAxis.Faith]: -2, [StyleAxis.Military]: 1 },
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
    remain_neutral:       { [StyleAxis.Authority]: -1 },
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

  // ============================================================
  // Crisis-family auto-authored entries (card audit §11.1)
  // ============================================================

  // ---- Crisis: condition-events.ts (Food) ----
  evt_cond_drought_moderate: {
    emergency_irrigation: { [StyleAxis.Economy]: +1 },
    import_water: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    pray_for_rain: { [StyleAxis.Faith]: +1 },
  },
  evt_cond_drought_severe: {
    mass_relocation: { [StyleAxis.Economy]: +1 },
    seize_merchant_water: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: -1 },
    endure_the_drought: { [StyleAxis.Authority]: -1 },
  },
  evt_cond_famine_moderate: {
    emergency_rationing: { [StyleAxis.Economy]: +1 },
    import_foreign_grain: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    open_royal_granaries: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_cond_flood_moderate: {
    reinforce_levees: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    evacuate_lowlands: { [StyleAxis.Economy]: +1 },
    let_floodwaters_pass: { [StyleAxis.Authority]: -1 },
  },
  evt_cond_harshwinter_moderate: {
    distribute_firewood: { [StyleAxis.Economy]: -1 },
    open_shelters: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    wait_for_thaw: { [StyleAxis.Authority]: -1 },
  },
  evt_cond_plague_escalation: {
    martial_law: { [StyleAxis.Authority]: +3, [StyleAxis.Military]: +1 },
    appeal_to_clergy: { [StyleAxis.Faith]: +2 },
  },

  // ---- Crisis: expansion/chain-events.ts (Military) ----
  evt_exp_chain_border_war_mobilization: {
    full_mobilization: { [StyleAxis.Military]: +2 },
    defensive_posture: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    last_minute_peace_offer: { [StyleAxis.Military]: -1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_chain_border_war_resolution: {
    negotiate_ceasefire: { [StyleAxis.Authority]: -1 },
    press_advantage: { [StyleAxis.Military]: +1 },
    accept_unfavorable_terms: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1 },
  },
  evt_exp_chain_border_war_skirmish: {
    send_diplomats_immediately: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1 },
    reinforce_border_garrisons: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1, [StyleAxis.Economy]: +1 },
    demand_explanation: { [StyleAxis.Authority]: +2 },
  },
  evt_exp_chain_corruption_investigation: {
    expand_investigation: { [StyleAxis.Economy]: +2 },
    offer_amnesty_for_testimony: { [StyleAxis.Authority]: -2 },
    suppress_findings: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
  },
  evt_exp_chain_corruption_scandal: {
    public_trial_and_punishment: { [StyleAxis.Authority]: +2 },
    quiet_exile_of_guilty: { [StyleAxis.Economy]: +1 },
    pardon_in_exchange_for_restitution: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
  },
  evt_exp_chain_drought_autumn: {
    emergency_food_imports: { [StyleAxis.Economy]: +1 },
    strict_rationing: { [StyleAxis.Authority]: +2 },
    sacrifice_livestock: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_chain_drought_summer: {
    import_water_by_caravan: { [StyleAxis.Economy]: +1 },
    abandon_worst_fields: { [StyleAxis.Authority]: +2 },
    endure_and_hope: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_chain_guild_rev_council: {
    grant_council_representation: { [StyleAxis.Authority]: -1 },
    arrest_ringleaders: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    offer_economic_concessions: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_chain_guild_rev_shift: {
    embrace_new_order: { [StyleAxis.Authority]: +1 },
    crush_the_movement: { [StyleAxis.Authority]: +3, [StyleAxis.Economy]: +1 },
    negotiate_compromise: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_chain_rebellion_crisis: {
    military_suppression: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    federal_compromise: { [StyleAxis.Authority]: -1 },
    let_province_secede: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_chain_rebellion_separatist: {
    grant_limited_autonomy: { [StyleAxis.Authority]: -1 },
    martial_law_in_province: { [StyleAxis.Authority]: +3, [StyleAxis.Military]: +1 },
    promise_reforms: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_chain_reformation_doctrine: {
    adopt_new_doctrine: { [StyleAxis.Faith]: +1 },
    reaffirm_tradition: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    allow_dual_practice: { [StyleAxis.Authority]: -1 },
  },
  evt_exp_chain_reformation_split: {
    mediate_between_factions: { [StyleAxis.Authority]: -1 },
    side_with_orthodox: { [StyleAxis.Faith]: +2 },
    side_with_reformers: { [StyleAxis.Authority]: -1, [StyleAxis.Faith]: -1 },
  },
  evt_exp_chain_renaissance_golden: {
    declare_golden_age: { [StyleAxis.Faith]: +1 },
    channel_into_practical_arts: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    maintain_current_course: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_chain_spy_war_double_agent: {
    recruit_double_agent: { [StyleAxis.Authority]: +1 },
    expose_the_agent: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    eliminate_the_threat: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_chain_spy_war_resolution: {
    triumphant_intelligence_coup: { [StyleAxis.Authority]: +1 },
    negotiate_intelligence_truce: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1 },
    cut_losses_and_rebuild: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },

  // ---- Crisis: expansion/class-conflict-events.ts (ClassConflict) ----
  evt_exp_cc_clerical_overreach: {
    limit_church_holdings: { [StyleAxis.Faith]: +1 },
    sanction_expanded_tithes: { [StyleAxis.Authority]: +1 },
    negotiate_boundaries: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_cc_guild_noble_power_struggle: {
    curtail_guild_influence: { [StyleAxis.Economy]: +1 },
    formalize_guild_seats: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    play_factions_against_each_other: { [StyleAxis.Authority]: +1 },
  },
  evt_exp_cc_land_ownership_dispute: {
    redistribute_crown_lands: { [StyleAxis.Economy]: -2 },
    enforce_existing_deeds: { [StyleAxis.Authority]: +2 },
    establish_tenant_protections: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_cc_military_privilege_demand: {
    grant_military_estates: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: +1 },
    offer_honorary_titles: { [StyleAxis.Authority]: +1 },
    refuse_special_treatment: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_cc_privilege_reform: {
    enact_sweeping_reforms: { [StyleAxis.Authority]: -1 },
    offer_token_concessions: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    suppress_reform_movement: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_cc_social_mobility_demands: {
    open_ranks_to_merit: { [StyleAxis.Authority]: +1 },
    create_advancement_paths: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    reaffirm_social_order: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_cc_tax_burden_dispute: {
    redistribute_tax_burden: { [StyleAxis.Economy]: +2 },
    maintain_noble_exemptions: { [StyleAxis.Authority]: +1 },
    commission_tax_review: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
  },

  // ---- Crisis: expansion/culture-events.ts (Culture) ----
  evt_exp_cul_architectural_ambition: {
    build_great_cathedral: { [StyleAxis.Faith]: +1 },
    construct_public_amphitheater: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    invest_in_housing: { [StyleAxis.Economy]: +2 },
  },
  evt_exp_cul_assimilation_pressure: {
    resist_cultural_pressure: { [StyleAxis.Faith]: +1 },
    negotiate_cultural_treaty: { [StyleAxis.Authority]: -1 },
    accept_partial_integration: { [StyleAxis.Authority]: -1, [StyleAxis.Faith]: -1 },
  },
  evt_exp_cul_dialect_tensions: {
    enforce_common_tongue: { [StyleAxis.Authority]: +2 },
    protect_regional_dialects: { [StyleAxis.Faith]: +1 },
    promote_bilingual_policy: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_cul_heretical_art: {
    destroy_offensive_works: { [StyleAxis.Faith]: +1 },
    defend_artistic_freedom: { [StyleAxis.Authority]: -1 },
    convene_clergy_tribunal: { [StyleAxis.Authority]: +2, [StyleAxis.Faith]: +1 },
  },
  evt_exp_cul_identity_crisis: {
    reassert_national_identity: { [StyleAxis.Authority]: +2 },
    forge_new_cultural_synthesis: { [StyleAxis.Faith]: +1 },
    allow_regional_autonomy: { [StyleAxis.Authority]: -1, [StyleAxis.Faith]: -1 },
  },
  evt_exp_cul_military_ceremony: {
    grand_military_parade: { [StyleAxis.Military]: +1 },
    solemn_remembrance: { [StyleAxis.Faith]: +1 },
    skip_ceremony: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_cul_oral_history_keeper: {
    appoint_royal_chronicler: { [StyleAxis.Faith]: +1 },
    transcribe_oral_traditions: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    let_traditions_fade: { [StyleAxis.Authority]: -1 },
  },
  evt_exp_cul_preservation_crisis: {
    establish_preservation_council: { [StyleAxis.Faith]: +1 },
    embrace_cultural_change: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    suppress_foreign_influence: { [StyleAxis.Authority]: +2 },
  },

  // ---- Crisis: expansion/diplomacy-events.ts (Diplomacy) ----
  evt_exp_dip_border_dispute_escalation: {
    show_of_force: { [StyleAxis.Military]: +1 },
    propose_border_commission: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    cede_disputed_territory: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_dip_spy_scandal: {
    deny_involvement: { [StyleAxis.Authority]: +1 },
    expel_foreign_diplomats: { [StyleAxis.Military]: -1 },
    offer_intelligence_sharing: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_dip_trade_embargo_threat: {
    negotiate_compromise: { [StyleAxis.Authority]: -1 },
    counter_embargo: { [StyleAxis.Military]: +1 },
    seek_alternative_markets: { [StyleAxis.Economy]: +2 },
    accept_the_embargo: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1 },
  },
  evt_exp_dip_treaty_violation: {
    demand_reparations: { [StyleAxis.Authority]: +2 },
    military_posturing: { [StyleAxis.Military]: +1 },
    seek_mediation: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    overlook_the_violation: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_dip_tribute_request: {
    pay_the_tribute: { [StyleAxis.Military]: +1 },
    refuse_defiantly: { [StyleAxis.Authority]: +1 },
    negotiate_lesser_amount: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1 },
  },
  evt_exp_dip_war_reparations_demand: {
    pay_reparations: { [StyleAxis.Military]: +1 },
    refuse_and_mobilize: { [StyleAxis.Authority]: +1, [StyleAxis.Military]: +2 },
    request_arbitration: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    stall_negotiations: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Faith]: +1 },
  },

  // ---- Crisis: expansion/economy-events.ts (Economy) ----
  evt_exp_eco_black_market: {
    crack_down_harshly: { [StyleAxis.Authority]: +2 },
    infiltrate_and_tax: { [StyleAxis.Economy]: +2 },
    tolerate_for_now: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
  },
  evt_exp_eco_counterfeit_coins: {
    execute_counterfeiters: { [StyleAxis.Authority]: +3 },
    recall_all_coinage: { [StyleAxis.Economy]: +1 },
    issue_royal_stamps: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_eco_currency_debasement: {
    debase_the_coinage: { [StyleAxis.Economy]: -2 },
    raise_emergency_tax: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
    seek_foreign_loan: { [StyleAxis.Economy]: -1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_eco_debt_crisis: {
    default_on_debts: { [StyleAxis.Economy]: +1 },
    negotiate_with_creditors: { [StyleAxis.Authority]: -1 },
    impose_austerity_measures: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
  },
  evt_exp_eco_foreign_trade_disruption: {
    reroute_trade_through_valdris: { [StyleAxis.Economy]: +1 },
    invest_in_domestic_production: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
    endure_the_shortfall: { [StyleAxis.Authority]: -1 },
  },
  evt_exp_eco_inflation_crisis: {
    mint_new_currency: { [StyleAxis.Economy]: +2 },
    freeze_all_prices: { [StyleAxis.Authority]: -1 },
    allow_free_market_correction: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +2 },
  },
  evt_exp_eco_smuggling: {
    deploy_border_patrols: { [StyleAxis.Military]: +1 },
    bribe_smuggler_captains: { [StyleAxis.Economy]: +1 },
    ignore_the_smuggling: { [StyleAxis.Authority]: -1 },
  },
  evt_exp_eco_warehouse_fire: {
    fund_full_reconstruction: { [StyleAxis.Economy]: +1 },
    compensate_merchants_partially: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    leave_to_private_rebuilding: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/environment-events.ts (Environment) ----
  evt_exp_env_deforestation_crisis: {
    establish_royal_forest_reserves: { [StyleAxis.Economy]: +1 },
    tax_lumber_operations: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
    allow_continued_clearing: { [StyleAxis.Authority]: -1 },
  },
  evt_exp_env_harsh_winter_early: {
    accelerate_harvest: { [StyleAxis.Economy]: +1 },
    open_emergency_stores: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    trust_preparations: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_env_locust_swarm: {
    organize_pest_drives: { [StyleAxis.Economy]: +1 },
    burn_afflicted_fields: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    pray_for_deliverance: { [StyleAxis.Faith]: +1 },
  },
  evt_exp_env_volcanic_ash_cloud: {
    seal_granaries_and_ration: { [StyleAxis.Economy]: +1 },
    organize_mass_shelter: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    wait_for_skies_to_clear: { [StyleAxis.Authority]: -1 },
  },

  // ---- Crisis: expansion/espionage-events.ts (Espionage) ----
  evt_exp_esp_assassination_plot: {
    preemptive_arrests: { [StyleAxis.Authority]: +2 },
    double_royal_guard: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    set_counter_trap: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_esp_counter_espionage_raid: {
    full_scale_raid: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    surgical_strike: { [StyleAxis.Authority]: +1 },
    diplomatic_protest: { [StyleAxis.Military]: -1 },
  },
  evt_exp_esp_enemy_infiltration: {
    martial_law_purge: { [StyleAxis.Authority]: +3, [StyleAxis.Military]: +1 },
    targeted_counter_ops: { [StyleAxis.Authority]: +1 },
    negotiate_withdrawal: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_esp_intelligence_failure: {
    rebuild_network: { [StyleAxis.Authority]: +1 },
    scapegoat_spymaster: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    accept_losses: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_esp_military_secrets_stolen: {
    change_all_plans: { [StyleAxis.Authority]: +1 },
    hunt_the_thief: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    feed_false_plans: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_esp_poisoning_attempt: {
    purge_kitchen_staff: { [StyleAxis.Authority]: +1 },
    hire_royal_taster: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    trace_poison_source: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_esp_secret_alliance_exposed: {
    publicly_confirm: { [StyleAxis.Authority]: +1 },
    deny_and_distance: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    reframe_as_trade_pact: { [StyleAxis.Economy]: +1 },
  },
  evt_exp_esp_underground_resistance: {
    infiltrate_resistance: { [StyleAxis.Authority]: +1 },
    address_grievances: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    military_crackdown: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/food-events.ts (Food) ----
  evt_exp_fod_crop_disease: {
    burn_infected_fields: { [StyleAxis.Economy]: +1 },
    quarantine_affected_regions: { [StyleAxis.Authority]: +1 },
    pray_for_divine_intervention: { [StyleAxis.Faith]: +2 },
  },
  evt_exp_fod_distribution_inequity: {
    mandate_equal_rationing: { [StyleAxis.Economy]: +1 },
    open_royal_granaries: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    maintain_current_distribution: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_fod_imports_blocked: {
    demand_trade_resumption: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    seek_arenthal_imports: { [StyleAxis.Economy]: +1 },
    enforce_strict_rationing: { [StyleAxis.Authority]: +2 },
  },
  evt_exp_fod_labour_shortage: {
    conscript_urban_workers: { [StyleAxis.Authority]: +2 },
    offer_land_grants: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    accept_reduced_harvest: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_fod_livestock_plague: {
    cull_all_sick_animals: { [StyleAxis.Economy]: +1 },
    import_healthy_stock: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    let_plague_run_its_course: { [StyleAxis.Authority]: -1 },
  },

  // ---- Crisis: expansion/kingdom-events.ts (Kingdom) ----
  evt_exp_kgd_constitutional_crisis: {
    convene_emergency_council: { [StyleAxis.Authority]: +1 },
    assert_royal_authority: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    offer_charter_of_rights: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kgd_corruption_investigation: {
    public_tribunal: { [StyleAxis.Authority]: +2 },
    private_purge: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    offer_amnesty: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kgd_governance_reform: {
    accept_reforms: { [StyleAxis.Authority]: -1 },
    partial_concessions: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    reject_reforms: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kgd_power_consolidation: {
    centralize_authority: { [StyleAxis.Authority]: +1 },
    delegate_to_governors: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
    maintain_balance: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/knowledge-events.ts (Knowledge) ----
  evt_exp_kno_alchemist_discovery: {
    fund_military_application: { [StyleAxis.Military]: +1 },
    restrict_to_civilian_use: { [StyleAxis.Authority]: +2 },
    suppress_findings: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
  },
  evt_exp_kno_censorship_demand: {
    enforce_censorship: { [StyleAxis.Authority]: +2 },
    protect_free_inquiry: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
    create_review_board: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kno_library_fire: {
    emergency_salvage_operation: { [StyleAxis.Authority]: +1 },
    protect_rarest_volumes: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    let_it_burn: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kno_plague_remedy: {
    mass_produce_remedy: { [StyleAxis.Authority]: +1 },
    test_on_volunteers: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    dismiss_as_quackery: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kno_printing_press: {
    fund_mass_production: { [StyleAxis.Authority]: +1 },
    restrict_to_crown: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    ban_device: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kno_rival_hoards: {
    send_spies_to_copy: { [StyleAxis.Authority]: +1 },
    propose_knowledge_exchange: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    develop_independently: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_kno_student_uprising: {
    negotiate_with_students: { [StyleAxis.Authority]: -1 },
    disperse_by_force: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    close_academy_temporarily: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/military-events.ts (Military) ----
  evt_exp_mil_academy_proposal: {
    found_royal_academy: { [StyleAxis.Military]: +1 },
    expand_officer_training: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    defer_to_peacetime: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_exp_mil_arms_deal: {
    accept_arms_shipment: { [StyleAxis.Authority]: -1, [StyleAxis.Military]: +1 },
    negotiate_mutual_pact: { [StyleAxis.Authority]: -1 },
    politely_refuse: { [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_mil_cavalry_training: {
    build_cavalry_academy: { [StyleAxis.Military]: +2 },
    expand_existing_stables: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    maintain_infantry_focus: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_mil_court_martial: {
    public_tribunal: { [StyleAxis.Authority]: +2 },
    quiet_discharge: { [StyleAxis.Military]: +1 },
    pardon_and_reassign: { [StyleAxis.Authority]: -2, [StyleAxis.Military]: -1 },
  },
  evt_exp_mil_discipline_crisis: {
    enforce_strict_discipline: { [StyleAxis.Authority]: +2 },
    address_grievances: { [StyleAxis.Military]: +1 },
    rotate_troublesome_units: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_mil_naval_operations: {
    commission_war_galleys: { [StyleAxis.Military]: +2 },
    refit_merchant_vessels: { [StyleAxis.Economy]: +1 },
    focus_on_land_forces: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_mil_siege_preparations: {
    full_siege_mobilization: { [StyleAxis.Military]: +2 },
    reinforce_key_fortifications: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    seek_diplomatic_resolution: { [StyleAxis.Military]: -1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_mil_strategic_alliance: {
    formal_military_pact: { [StyleAxis.Military]: +1 },
    limited_cooperation: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    maintain_independence: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_mil_supply_chain: {
    emergency_supply_convoy: { [StyleAxis.Military]: +1 },
    requisition_from_merchants: { [StyleAxis.Economy]: +1 },
    ration_existing_supplies: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_mil_war_preparations: {
    full_war_mobilization: { [StyleAxis.Military]: +2 },
    defensive_preparations_only: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    last_chance_diplomacy: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },

  // ---- Crisis: expansion/public-order-events.ts (PublicOrder) ----
  evt_exp_po_crime_wave: {
    hire_additional_watchmen: { [StyleAxis.Authority]: +1 },
    public_executions: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    empower_neighborhood_watches: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_po_gang_warfare: {
    military_sweep: { [StyleAxis.Military]: +1 },
    pit_gangs_against_each_other: { [StyleAxis.Authority]: +1 },
    offer_gang_leaders_positions: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_po_market_riots: {
    deploy_garrison: { [StyleAxis.Military]: +1 },
    negotiate_with_ringleaders: { [StyleAxis.Authority]: -1 },
    seal_district_gates: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
  },
  evt_exp_po_martial_law: {
    declare_martial_law: { [StyleAxis.Authority]: +3, [StyleAxis.Military]: +1 },
    limited_military_patrols: { [StyleAxis.Military]: +1 },
    trust_civilian_authority: { [StyleAxis.Authority]: +1 },
  },
  evt_exp_po_mob_justice: {
    restore_order_by_force: { [StyleAxis.Authority]: +2 },
    hold_public_trial: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    let_the_mob_decide: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_po_prison_overcrowding: {
    build_new_prison: { [StyleAxis.Authority]: +1 },
    release_minor_offenders: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    forced_labor_gangs: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_po_refugee_influx: {
    welcome_and_settle: { [StyleAxis.Authority]: +1 },
    temporary_camps: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    close_the_borders: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_po_tax_resistance: {
    send_tax_collectors_with_guards: { [StyleAxis.Economy]: +2 },
    temporarily_reduce_taxes: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1 },
    address_grievances_at_court: { [StyleAxis.Authority]: +1 },
  },

  // ---- Crisis: expansion/religion-events.ts (Religion) ----
  evt_exp_rel_clerical_corruption: {
    royal_inquisition: { [StyleAxis.Authority]: +2, [StyleAxis.Faith]: +1 },
    internal_reform: { [StyleAxis.Authority]: -1 },
    look_the_other_way: { [StyleAxis.Faith]: +1 },
  },
  evt_exp_rel_divine_portent: {
    declare_divine_favor: { [StyleAxis.Faith]: +2 },
    call_for_penance: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    dismiss_superstition: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_rel_sacred_desecration: {
    hunt_perpetrators: { [StyleAxis.Authority]: +2 },
    consecrate_and_restore: { [StyleAxis.Faith]: +1 },
    call_for_reconciliation: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
  },

  // ---- Crisis: expansion/wave-2/crises-disasters.ts (Military) ----
  evt_exp_w2_naval_disaster: {
    fund_emergency_shipyard: { [StyleAxis.Military]: +1 },
    recall_merchant_vessels: { [StyleAxis.Economy]: +1 },
    blame_the_captain: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_exp_w2_plague_variant: {
    quarantine_afflicted_quarters: { [StyleAxis.Authority]: +1 },
    open_hospitals_for_all: { [StyleAxis.Economy]: +1 },
    pray_and_wait: { [StyleAxis.Authority]: -1, [StyleAxis.Faith]: +1 },
  },
  evt_exp_w2_well_poisoning: {
    hunt_the_saboteurs: { [StyleAxis.Authority]: +2 },
    quietly_replace_the_wells: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    blame_a_rival: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/wave-2/crises-phenomena.ts (Environment) ----
  evt_exp_w2_drought_escalation: {
    dig_emergency_wells: { [StyleAxis.Economy]: +1 },
    ration_water_strictly: { [StyleAxis.Authority]: +2 },
    lead_a_rain_procession: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },

  // ---- Crisis: expansion/wave-2/crises-political.ts (Military) ----
  evt_exp_w2_bandit_lord_uprising: {
    send_a_punitive_column: { [StyleAxis.Military]: +1 },
    offer_the_lord_a_title: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    pay_his_silence: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_w2_dynastic_challenge: {
    crush_the_pretender: { [StyleAxis.Authority]: +3 },
    marry_into_their_line: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    exile_with_a_pension: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_exp_w2_foreign_assassination: {
    condemn_publicly_and_mourn: { [StyleAxis.Military]: +1 },
    offer_the_network_quietly: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    deny_all_involvement: { [StyleAxis.Authority]: +1 },
  },
  evt_exp_w2_royal_illness: {
    summon_foreign_physicians: { [StyleAxis.Authority]: +1 },
    trust_the_cathedral_healers: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    govern_through_the_sickness: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/wave-2/crises-religious.ts (Religion) ----
  evt_exp_w2_prophet_appears: {
    invite_to_the_cathedral: { [StyleAxis.Faith]: +1 },
    confine_to_a_monastery: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    denounce_as_false: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_w2_religious_schism: {
    back_the_orthodox_hierarchy: { [StyleAxis.Faith]: +2 },
    recognize_both_confessions: { [StyleAxis.Faith]: +2, [StyleAxis.Authority]: +1 },
    call_a_reconciliation_council: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },

  // ---- Crisis: expansion/wave-2/crises-social.ts (ClassConflict) ----
  evt_exp_w2_bonded_labor_revolt: {
    crush_with_the_levy: { [StyleAxis.Authority]: +3, [StyleAxis.Economy]: +2 },
    grant_limited_emancipation: { [StyleAxis.Authority]: -1 },
    negotiate_better_terms: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_exp_w2_food_riot_escalation: {
    open_the_royal_granaries: { [StyleAxis.Authority]: +1 },
    post_guards_at_the_markets: { [StyleAxis.Economy]: +2 },
    hang_the_ringleaders: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_w2_mercenary_defection: {
    match_the_foreign_wages: { [StyleAxis.Military]: +1 },
    brand_them_as_deserters: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    recruit_local_replacements: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_exp_w2_monetary_crisis: {
    debase_the_coinage: { [StyleAxis.Economy]: -2 },
    borrow_from_the_merchants: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    seize_the_old_hoards: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: expansion/wave-2/index.ts (Environment) ----
  evt_exp_w2_comet_sighting: {
    declare_omen_of_renewal: { [StyleAxis.Economy]: +1 },
    order_ritual_purification: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    forbid_public_speculation: { [StyleAxis.Authority]: +2 },
  },

  // ---- Crisis: index.ts (Diplomacy) ----
  evt_ambassador_counter_rejected: {
    concede_to_terms: { [StyleAxis.Authority]: -2 },
    stand_firm: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    offer_trade_concession: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
  },
  evt_ambassador_trade_embargo: {
    seek_alternative_partners: { [StyleAxis.Military]: +1 },
    retaliate_economically: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    accept_embargo: { [StyleAxis.Authority]: -1 },
  },
  evt_audit_corruption_found: {
    prosecute_officials: { [StyleAxis.Economy]: +1 },
    demand_restitution: { [StyleAxis.Authority]: +2 },
    cover_up_findings: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_audit_embezzlement: {
    launch_crackdown: { [StyleAxis.Authority]: +2 },
    reform_treasury_oversight: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
    ignore_and_absorb: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_border_campaign_defeat: {
    rally_defense: { [StyleAxis.Military]: +1 },
    sue_for_peace: { [StyleAxis.Military]: -1, [StyleAxis.Authority]: +1 },
    scorched_earth: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_border_envoy_hostage: {
    pay_ransom: { [StyleAxis.Military]: +1 },
    rescue_mission: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    abandon_envoy: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: -1, [StyleAxis.Economy]: +1 },
  },
  evt_border_fortify_famine: {
    emergency_food_imports: { [StyleAxis.Economy]: +1 },
    redistribute_reserves: { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: +1 },
    enforce_rationing: { [StyleAxis.Authority]: +2 },
  },
  evt_grain_import_merchant_leverage: {
    grant_tariff_exemptions: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +2 },
    refuse_merchant_demands: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
    partial_concessions: { [StyleAxis.Authority]: -1 },
  },
  evt_grain_import_spoiled: {
    demand_replacement: { [StyleAxis.Authority]: +2 },
    emergency_local_harvest: { [StyleAxis.Economy]: +1 },
    distribute_what_remains: { [StyleAxis.Economy]: -1, [StyleAxis.Authority]: +1 },
  },
  evt_grain_noble_plot: {
    negotiate_concessions: { [StyleAxis.Authority]: -1 },
    arrest_ringleaders: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    show_of_force: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_grain_noble_uprising: {
    crush_uprising: { [StyleAxis.Authority]: +3 },
    negotiate_surrender: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    offer_amnesty: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_grain_ration_riots: {
    suppress_market_riots: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +2 },
    negotiate_with_rioters: { [StyleAxis.Authority]: -1 },
    distribute_reserves: { [StyleAxis.Economy]: -1 },
  },
  evt_infra_bridge_collapse: {
    emergency_rebuild: { [StyleAxis.Economy]: +1 },
    reroute_supply_lines: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    requisition_noble_estates: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_merchant_boycott: {
    break_boycott_by_force: { [StyleAxis.Economy]: +1 },
    negotiate_end: { [StyleAxis.Authority]: -1 },
    wait_out_boycott: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_merchant_council_overreach: {
    dissolve_council: { [StyleAxis.Authority]: +2 },
    limit_council_powers: { [StyleAxis.Economy]: +1 },
    side_with_merchants: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_merchant_tax_shortfall: {
    reverse_concessions: { [StyleAxis.Authority]: -1 },
    raise_taxes_elsewhere: { [StyleAxis.Economy]: +2 },
    cut_spending: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_mutiny_execute_revenge: {
    investigate_sabotage: { [StyleAxis.Economy]: +2 },
    rebuild_fortification: { [StyleAxis.Military]: +1 },
    purge_suspects: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_mutiny_pay_bankrupt: {
    emergency_taxation: { [StyleAxis.Economy]: +2 },
    seize_noble_assets: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: -1 },
    reduce_military_size: { [StyleAxis.Military]: +1 },
  },
  evt_mutiny_reform_betrayal: {
    meet_soldiers_personally: { [StyleAxis.Military]: +1 },
    call_loyal_units: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
    flee_capital: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_plague_bankruptcy: {
    emergency_loans: { [StyleAxis.Economy]: +1 },
    slash_all_spending: { [StyleAxis.Economy]: +1, [StyleAxis.Authority]: +1 },
    levy_crisis_tax: { [StyleAxis.Economy]: +2, [StyleAxis.Authority]: +1, [StyleAxis.Military]: +1 },
  },
  evt_plague_class_anger: {
    extend_treatment_to_all: { [StyleAxis.Authority]: +1 },
    suppress_riots: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    public_apology: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_plague_noble_spread: {
    emergency_measures: { [StyleAxis.Authority]: +1 },
    appeal_for_foreign_aid: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    isolate_and_wait: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_plague_quarantine_breaks: {
    military_enforcement: { [StyleAxis.Authority]: +2, [StyleAxis.Military]: +1 },
    expand_treatment: { [StyleAxis.Authority]: +1 },
    abandon_quarantine: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
  },
  evt_schism_inquisition: {
    authorize_inquisition: { [StyleAxis.Authority]: +2, [StyleAxis.Faith]: +1 },
    limit_scope: { [StyleAxis.Faith]: +1 },
    refuse_inquisition: { [StyleAxis.Authority]: +2, [StyleAxis.Faith]: +1, [StyleAxis.Economy]: +1 },
  },
  evt_schism_reform_backlash: {
    stand_with_reformists: { [StyleAxis.Authority]: -1 },
    appease_clergy: { [StyleAxis.Authority]: -2, [StyleAxis.Faith]: +1 },
    impose_silence: { [StyleAxis.Faith]: +1 },
  },
  evt_schism_reform_schism_deep: {
    recognize_both_authorities: { [StyleAxis.Faith]: +1 },
    enforce_single_doctrine: { [StyleAxis.Authority]: +2 },
    secularize_state: { [StyleAxis.Faith]: -2, [StyleAxis.Authority]: +1 },
  },
  evt_schism_underground_martyr: {
    honor_martyr: { [StyleAxis.Faith]: +1 },
    discredit_martyr: { [StyleAxis.Faith]: +1, [StyleAxis.Authority]: +1 },
    ignore_martyr: { [StyleAxis.Authority]: -1 },
  },
  evt_schism_underground_worship: {
    tolerate_quietly: { [StyleAxis.Authority]: -2 },
    crack_down: { [StyleAxis.Authority]: +2, [StyleAxis.Faith]: +1 },
    infiltrate_cells: { [StyleAxis.Faith]: +1 },
  },
  evt_succession_anxiety_root: {
    name_heir_publicly: { [StyleAxis.Authority]: +1 },
    suppress_rumors: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    convene_great_lords: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_succession_council_deadlock: {
    force_decision: { [StyleAxis.Authority]: +2 },
    dissolve_council: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    extend_deliberations: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_succession_heir_challenged: {
    discredit_rival: { [StyleAxis.Authority]: +1 },
    negotiate_with_rival: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    imprison_rival: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_succession_whispers: {
    crack_down_harder: { [StyleAxis.Authority]: +2 },
    address_publicly: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    redirect_attention: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_trade_escort_ambush: {
    send_reinforcements: { [StyleAxis.Military]: +1 },
    negotiate_ransom: { [StyleAxis.Authority]: -1 },
    cut_losses: { [StyleAxis.Military]: +1, [StyleAxis.Authority]: +1 },
  },
  evt_trade_negotiate_betrayal: {
    military_response: { [StyleAxis.Military]: +2 },
    demand_compensation: { [StyleAxis.Authority]: +2 },
    write_off_losses: { [StyleAxis.Economy]: +1 },
  },
  evt_uprising_guerrilla: {
    hunt_insurgents: { [StyleAxis.Authority]: +2 },
    offer_amnesty: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
    fortify_key_positions: { [StyleAxis.Military]: +2 },
  },
  evt_uprising_noble_backlash: {
    appease_nobility: { [StyleAxis.Authority]: -2 },
    stand_with_commoners: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
    find_compromise: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_uprising_reform_resistance: {
    override_nobility: { [StyleAxis.Authority]: +2 },
    compromise_on_reforms: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
    abandon_reforms: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: population-events.ts (Economy) ----
  evt_pop_decline: {
    encourage_families: { [StyleAxis.Economy]: +1 },
    attract_immigrants: { [StyleAxis.Authority]: -1 },
    accept_decline: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1 },
  },
  evt_pop_migration_crisis: {
    seal_borders: { [StyleAxis.Economy]: +1 },
    emergency_relief: { [StyleAxis.Economy]: -2, [StyleAxis.Authority]: +1 },
    let_them_leave: { [StyleAxis.Authority]: -1 },
  },
  evt_pop_overcrowding_crisis: {
    emergency_construction: { [StyleAxis.Authority]: +1 },
    forced_relocation: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    endure_squalor: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },

  // ---- Crisis: social-condition-events.ts (PublicOrder) ----
  evt_social_banditry_moderate: {
    military_sweep: { [StyleAxis.Military]: +1 },
    negotiate_brigands: { [StyleAxis.Authority]: -1 },
    fortify_trade_routes: { [StyleAxis.Economy]: +1, [StyleAxis.Military]: +2 },
  },
  evt_social_banditry_severe: {
    marshal_campaign: { [StyleAxis.Authority]: +1 },
    offer_amnesty: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: -1 },
    abandon_outer_roads: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_social_corruption_moderate: {
    purge_corrupt_officials: { [StyleAxis.Economy]: +1 },
    reform_tax_collection: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +2 },
    accept_status_quo: { [StyleAxis.Authority]: -1 },
  },
  evt_social_corruption_severe: {
    royal_tribunal: { [StyleAxis.Authority]: +2 },
    co_opt_corrupt_lords: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: +1 },
    endure_corruption: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_social_criminal_moderate: {
    crack_down_syndicates: { [StyleAxis.Authority]: +2 },
    recruit_informants: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    tolerate_black_market: { [StyleAxis.Authority]: -2, [StyleAxis.Economy]: +2, [StyleAxis.Military]: -1 },
  },
  evt_social_criminal_severe: {
    martial_purge: { [StyleAxis.Authority]: +1 },
    bribe_the_bosses: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1 },
    cede_the_ports: { [StyleAxis.Authority]: +1, [StyleAxis.Economy]: +1, [StyleAxis.Military]: +1 },
  },
  evt_social_unrest_moderate: {
    hold_public_festival: { [StyleAxis.Authority]: +1 },
    suppress_riots: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
    make_concessions: { [StyleAxis.Authority]: -1, [StyleAxis.Economy]: -1, [StyleAxis.Military]: +1 },
  },
  evt_social_unrest_severe: {
    declare_martial_law: { [StyleAxis.Authority]: +3, [StyleAxis.Military]: +1 },
    negotiate_rebel_leaders: { [StyleAxis.Authority]: -1 },
    abdicate_demands: { [StyleAxis.Authority]: +2, [StyleAxis.Economy]: +1 },
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
