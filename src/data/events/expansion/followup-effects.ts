import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_FOLLOWUP_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Economy Follow-ups
  // ============================================================
  evt_exp_fu_eco_price_control_backlash: {
    enforce_strictly: { merchantSatDelta: -3, commonerSatDelta: +2, stabilityDelta: +1, treasuryDelta: -15 },
    relax_controls:   { merchantSatDelta: +2, commonerSatDelta: -1, treasuryDelta: +10 },
  },
  evt_exp_fu_eco_guild_resentment: {
    offer_concessions_to_new_guild: { merchantSatDelta: +2, treasuryDelta: -15, commonerSatDelta: +1 },
    maintain_current_stance:        { merchantSatDelta: -2, stabilityDelta: -1 },
  },
  evt_exp_fu_eco_smuggler_revenge: {
    increase_guard_patrols: { treasuryDelta: -20, stabilityDelta: +2, espionageNetworkDelta: +1 },
    offer_amnesty:          { merchantSatDelta: +1, stabilityDelta: -1, treasuryDelta: +5 },
  },
  evt_exp_fu_eco_tax_compromise_fallout: {
    honor_the_agreement: { commonerSatDelta: +2, treasuryDelta: -10, stabilityDelta: +1 },
    renegotiate_terms:   { commonerSatDelta: -2, treasuryDelta: +10, stabilityDelta: -1 },
  },
  evt_exp_fu_eco_bailout_resentment: {
    address_public_anger: { commonerSatDelta: +2, treasuryDelta: -15, stabilityDelta: +1 },
    defend_the_decision:  { commonerSatDelta: -2, merchantSatDelta: +1, stabilityDelta: -1 },
  },

  // ============================================================
  // Food Follow-ups
  // ============================================================
  evt_exp_fu_food_granary_shortage: {
    import_emergency_grain: { treasuryDelta: -25, foodDelta: +15, commonerSatDelta: +1 },
    tighten_rationing:      { foodDelta: +5, commonerSatDelta: -2, stabilityDelta: -1 },
  },
  evt_exp_fu_food_overfishing: {
    impose_fishing_limits: { foodDelta: -5, commonerSatDelta: -1, regionConditionDelta: +3, stabilityDelta: +1 },
    continue_unrestricted: { foodDelta: +5, regionConditionDelta: -3, commonerSatDelta: +1, merchantSatDelta: +1 },
  },
  evt_exp_fu_food_feast_aftermath: {
    acknowledge: { commonerSatDelta: +1, stabilityDelta: +1 },
  },
  evt_exp_fu_food_quarantine_success: {
    acknowledge: { foodDelta: +5, regionConditionDelta: +2 },
  },

  // ============================================================
  // Military Follow-ups
  // ============================================================
  evt_exp_fu_mil_amnesty_returns: {
    reintegrate_fully:         { militaryMoraleDelta: -2, militaryReadinessDelta: +2, militaryCasteSatDelta: -1 },
    assign_to_labor_battalions: { militaryCasteSatDelta: +1, regionDevelopmentDelta: +1, commonerSatDelta: -1 },
  },
  evt_exp_fu_mil_arms_breakthrough: {
    mass_produce_weapons: { militaryEquipmentDelta: +3, treasuryDelta: -25, militaryCasteSatDelta: +2 },
    keep_as_elite_reserve: { militaryEquipmentDelta: +1, espionageNetworkDelta: +1, militaryCasteSatDelta: -1 },
  },
  evt_exp_fu_mil_fortress_garrison: {
    acknowledge: { militaryReadinessDelta: +2, regionConditionDelta: +2 },
  },
  evt_exp_fu_mil_peace_dividend: {
    invest_in_recovery:       { treasuryDelta: -20, regionDevelopmentDelta: +2, commonerSatDelta: +2 },
    save_for_future_conflicts: { treasuryDelta: +15, militaryCasteSatDelta: -1 },
  },
  evt_exp_fu_mil_parade_recruitment: {
    acknowledge: { militaryMoraleDelta: +2, commonerSatDelta: +1 },
  },

  // ============================================================
  // Diplomacy Follow-ups
  // ============================================================
  evt_exp_fu_dip_trade_profits: {
    acknowledge: { treasuryDelta: +20, merchantSatDelta: +1 },
  },
  evt_exp_fu_dip_apology_accepted: {
    propose_new_treaty: { diplomacyDeltas: { neighbor_arenthal: +3 }, treasuryDelta: -15, stabilityDelta: +1 },
    accept_restoration: { diplomacyDeltas: { neighbor_arenthal: +1 }, stabilityDelta: +1 },
  },
  evt_exp_fu_dip_refugee_integration: {
    provide_settlement_aid:   { treasuryDelta: -20, commonerSatDelta: +2, regionDevelopmentDelta: +1, diplomacyDeltas: { neighbor_arenthal: +2 } },
    let_refugees_self_organize: { commonerSatDelta: -1, stabilityDelta: -1, regionConditionDelta: -1, diplomacyDeltas: { neighbor_arenthal: -1 } },
  },
  evt_exp_fu_dip_alliance_first_test: {
    honor_alliance_obligations: { diplomacyDeltas: { neighbor_valdris: +4 }, treasuryDelta: -25, militaryReadinessDelta: -1 },
    find_diplomatic_excuse:     { diplomacyDeltas: { neighbor_valdris: -3 }, stabilityDelta: -1, treasuryDelta: +5 },
    delay_response:             { diplomacyDeltas: { neighbor_valdris: -1 }, stabilityDelta: -1 },
  },
  evt_exp_fu_dip_reparation_partial: {
    accept_partial_payment: { treasuryDelta: +15, diplomacyDeltas: { neighbor_arenthal: +2 }, nobilitySatDelta: -1 },
    insist_on_full_amount:  { diplomacyDeltas: { neighbor_arenthal: -3 }, nobilitySatDelta: +1, treasuryDelta: +30 },
  },

  // ============================================================
  // Environment Follow-ups
  // ============================================================
  evt_exp_fu_env_levee_success: {
    acknowledge: { regionConditionDelta: +3, commonerSatDelta: +1 },
  },
  evt_exp_fu_env_fire_recovery: {
    replant_forest:       { treasuryDelta: -15, regionConditionDelta: +3, commonerSatDelta: +1 },
    convert_to_farmland:  { foodDelta: +10, regionConditionDelta: -2, commonerSatDelta: +1 },
    let_nature_recover:   { regionConditionDelta: +1 },
  },
  evt_exp_fu_env_mine_reopening: {
    resume_full_operations:   { treasuryDelta: +15, regionConditionDelta: -1, commonerSatDelta: +1 },
    maintain_reduced_output:  { treasuryDelta: +5, regionConditionDelta: +1 },
  },
  evt_exp_fu_env_logging_ban_impact: {
    compensate_loggers: { treasuryDelta: -15, commonerSatDelta: +2, regionConditionDelta: +2 },
    hold_firm_on_ban:   { commonerSatDelta: -2, regionConditionDelta: +3 },
  },
  evt_exp_fu_env_mining_wealth: {
    acknowledge: { treasuryDelta: +20, regionDevelopmentDelta: +1 },
  },

  // ============================================================
  // PublicOrder Follow-ups
  // ============================================================
  evt_exp_fu_po_gang_driven_underground: {
    maintain_patrols:  { treasuryDelta: -15, stabilityDelta: +2, commonerSatDelta: +1 },
    declare_victory:   { stabilityDelta: -1, commonerSatDelta: -1 },
  },
  evt_exp_fu_po_prison_complete: {
    acknowledge: { stabilityDelta: +2, commonerSatDelta: +1 },
  },
  evt_exp_fu_po_militia_overreach: {
    rein_in_militia:    { commonerSatDelta: +2, stabilityDelta: +1, militaryCasteSatDelta: -1, treasuryDelta: -10 },
    look_the_other_way: { commonerSatDelta: -2, stabilityDelta: -2, nobilitySatDelta: +1 },
  },
  evt_exp_fu_po_martial_law_tension: {
    lift_martial_law:    { commonerSatDelta: +3, stabilityDelta: -1, militaryCasteSatDelta: -1 },
    extend_martial_law:  { commonerSatDelta: -3, stabilityDelta: +2, militaryCasteSatDelta: +1, treasuryDelta: -15 },
  },
  evt_exp_fu_po_purge_aftermath: {
    appoint_reformers:       { nobilitySatDelta: -2, commonerSatDelta: +2, stabilityDelta: +2, treasuryDelta: -10 },
    restore_old_officials:   { nobilitySatDelta: +2, commonerSatDelta: -2, stabilityDelta: -1 },
  },

  // ============================================================
  // Religion Follow-ups
  // ============================================================
  evt_exp_fu_rel_pilgrimage_boom: {
    build_pilgrim_infrastructure: { treasuryDelta: -20, faithDelta: +3, clergySatDelta: +2, commonerSatDelta: +1 },
    let_pilgrims_come_naturally:  { faithDelta: +1, commonerSatDelta: +1 },
  },
  evt_exp_fu_rel_underground_copies: {
    intensify_censorship:     { heterodoxyDelta: -2, clergySatDelta: +2, commonerSatDelta: -2, treasuryDelta: -10 },
    accept_inevitable_spread: { heterodoxyDelta: +3, clergySatDelta: -2, commonerSatDelta: +1 },
  },
  evt_exp_fu_rel_temple_consecration: {
    acknowledge: { faithDelta: +3, clergySatDelta: +2, culturalCohesionDelta: +1 },
  },
  evt_exp_fu_rel_clergy_reform: {
    install_reformist_clergy:   { clergySatDelta: -2, commonerSatDelta: +2, heterodoxyDelta: +2, faithDelta: +1 },
    restore_chastened_officials: { clergySatDelta: +2, commonerSatDelta: -1, heterodoxyDelta: -1 },
  },

  // ============================================================
  // Culture Follow-ups
  // ============================================================
  evt_exp_fu_cul_masterwork_completed: {
    acknowledge: { culturalCohesionDelta: +3, commonerSatDelta: +1, nobilitySatDelta: +1 },
  },
  evt_exp_fu_cul_cultural_tension: {
    celebrate_diversity:     { culturalCohesionDelta: -1, commonerSatDelta: +2, merchantSatDelta: +1, treasuryDelta: -15 },
    promote_traditional_arts: { culturalCohesionDelta: +2, clergySatDelta: +1, commonerSatDelta: -1, treasuryDelta: -15 },
    let_trends_settle:       { culturalCohesionDelta: +1 },
  },
  evt_exp_fu_cul_folk_festival: {
    acknowledge: { commonerSatDelta: +2, culturalCohesionDelta: +1, stabilityDelta: +1 },
  },
  evt_exp_fu_cul_underground_theater: {
    crack_down_on_gatherings: { commonerSatDelta: -3, stabilityDelta: +1, espionageNetworkDelta: +1 },
    reverse_the_ban:          { commonerSatDelta: +2, nobilitySatDelta: -1, culturalCohesionDelta: +1 },
  },
  evt_exp_fu_cul_language_resistance: {
    offer_bilingual_compromise: { commonerSatDelta: +1, culturalCohesionDelta: +1, treasuryDelta: -10 },
    enforce_compliance:         { commonerSatDelta: -3, stabilityDelta: -1, culturalCohesionDelta: +2 },
    abandon_policy:             { commonerSatDelta: +2, culturalCohesionDelta: -2, nobilitySatDelta: -1 },
  },

  // ============================================================
  // Espionage Follow-ups
  // ============================================================
  evt_exp_fu_esp_agent_intel: {
    exploit_intelligence: { espionageNetworkDelta: +3, treasuryDelta: +15, diplomacyDeltas: { neighbor_arenthal: -2 } },
    share_with_allies:    { espionageNetworkDelta: +1, diplomacyDeltas: { neighbor_valdris: +2 } },
  },
  evt_exp_fu_esp_network_rebuilt: {
    acknowledge: { espionageNetworkDelta: +2, stabilityDelta: +1 },
  },
  evt_exp_fu_esp_conspiracy_trial: {
    public_execution:       { nobilitySatDelta: -3, commonerSatDelta: +2, stabilityDelta: +2 },
    exile_the_conspirators: { nobilitySatDelta: -1, stabilityDelta: +1, espionageNetworkDelta: -1 },
    imprison_for_leverage:  { espionageNetworkDelta: +2, nobilitySatDelta: -2, stabilityDelta: -1 },
  },
  evt_exp_fu_esp_disinformation_success: {
    acknowledge: { espionageNetworkDelta: +2, diplomacyDeltas: { neighbor_arenthal: -1 } },
  },

  // ============================================================
  // Knowledge Follow-ups
  // ============================================================
  evt_exp_fu_kno_academic_breakthrough: {
    acknowledge: { culturalCohesionDelta: +2, commonerSatDelta: +1 },
  },
  evt_exp_fu_kno_technology_restored: {
    apply_to_military:     { militaryEquipmentDelta: +3, treasuryDelta: -15, militaryCasteSatDelta: +1 },
    apply_to_agriculture:  { foodDelta: +10, treasuryDelta: -15, commonerSatDelta: +2 },
    publish_for_all:       { culturalCohesionDelta: +2, commonerSatDelta: +1, clergySatDelta: -1 },
  },
  evt_exp_fu_kno_printed_pamphlets: {
    encourage_free_press:   { commonerSatDelta: +2, heterodoxyDelta: +2, clergySatDelta: -2, culturalCohesionDelta: +1 },
    regulate_publications:  { commonerSatDelta: -1, clergySatDelta: +1, stabilityDelta: +1, treasuryDelta: -10 },
  },
  evt_exp_fu_kno_scholar_contributions: {
    acknowledge: { culturalCohesionDelta: +2, diplomacyDeltas: { neighbor_valdris: +1 } },
  },

  // ============================================================
  // ClassConflict Follow-ups
  // ============================================================
  evt_exp_fu_cc_noble_retaliation: {
    stand_firm_with_merchants: { merchantSatDelta: +2, nobilitySatDelta: -3, stabilityDelta: -1 },
    offer_nobles_concession:   { nobilitySatDelta: +2, merchantSatDelta: -1, treasuryDelta: -15 },
    ignore_the_backlash:       { nobilitySatDelta: -1, stabilityDelta: -1 },
  },
  evt_exp_fu_cc_grievance_reforms: {
    implement_reforms: { commonerSatDelta: +3, nobilitySatDelta: -2, treasuryDelta: -20, stabilityDelta: +2 },
    delay_reforms:     { commonerSatDelta: -2, stabilityDelta: -1 },
  },
  evt_exp_fu_cc_strike_settlement: {
    acknowledge: { merchantSatDelta: +1, commonerSatDelta: +1, stabilityDelta: +1 },
  },
  evt_exp_fu_cc_new_merchant_class: {
    acknowledge: { merchantSatDelta: +2, commonerSatDelta: +1, nobilitySatDelta: -1 },
  },

  // ============================================================
  // Region Follow-ups
  // ============================================================
  evt_exp_fu_reg_resource_boom: {
    acknowledge: { treasuryDelta: +20, regionDevelopmentDelta: +2, merchantSatDelta: +1 },
  },
  evt_exp_fu_reg_infrastructure_complete: {
    acknowledge: { regionDevelopmentDelta: +3, regionConditionDelta: +2, commonerSatDelta: +1 },
  },
  evt_exp_fu_reg_new_governor: {
    appoint_loyal_noble:  { nobilitySatDelta: +2, commonerSatDelta: -1, stabilityDelta: +1 },
    appoint_local_leader: { commonerSatDelta: +2, nobilitySatDelta: -2, regionDevelopmentDelta: +1 },
    rule_directly:        { stabilityDelta: -1, nobilitySatDelta: -1, treasuryDelta: -10 },
  },
  evt_exp_fu_reg_hero_legend: {
    acknowledge: { commonerSatDelta: +2, stabilityDelta: +1, regionConditionDelta: +1 },
  },

  // ============================================================
  // Kingdom Follow-ups
  // ============================================================
  evt_exp_fu_kgd_reform_resistance: {
    push_through_resistance: { nobilitySatDelta: -3, commonerSatDelta: +2, stabilityDelta: +2, treasuryDelta: -15 },
    compromise_on_reforms:   { nobilitySatDelta: +1, commonerSatDelta: -1, stabilityDelta: +1 },
  },
  evt_exp_fu_kgd_audit_results: {
    prosecute_offenders: { nobilitySatDelta: -3, commonerSatDelta: +2, treasuryDelta: +25, stabilityDelta: +2 },
    quiet_reform:        { nobilitySatDelta: -1, stabilityDelta: +1, treasuryDelta: +10 },
  },
  evt_exp_fu_kgd_celebration_goodwill: {
    acknowledge: { commonerSatDelta: +2, stabilityDelta: +1, faithDelta: +1 },
  },
  evt_exp_fu_kgd_centralization_tension: {
    press_centralization:      { nobilitySatDelta: -3, stabilityDelta: +2, treasuryDelta: +15, commonerSatDelta: -1 },
    allow_provincial_autonomy: { nobilitySatDelta: +2, regionDevelopmentDelta: +2, stabilityDelta: -1 },
  },

  // ============================================================
  // Chain Follow-ups
  // ============================================================
  evt_exp_fu_chain_corruption_aftermath: {
    establish_oversight_body: { treasuryDelta: -20, stabilityDelta: +3, commonerSatDelta: +2, nobilitySatDelta: -2 },
    return_to_normal:         { stabilityDelta: -1, commonerSatDelta: -1 },
  },
  evt_exp_fu_chain_ceasefire_holds: {
    propose_formal_treaty: { diplomacyDeltas: { neighbor_arenthal: +4 }, treasuryDelta: -15, stabilityDelta: +2 },
    maintain_ceasefire:    { diplomacyDeltas: { neighbor_arenthal: +1 }, stabilityDelta: +1 },
  },
  evt_exp_fu_chain_golden_age_legacy: {
    acknowledge: { culturalCohesionDelta: +3, commonerSatDelta: +2, nobilitySatDelta: +1, stabilityDelta: +1 },
  },

  // ============================================================
  // Phase 2 Card Audit — Stub follow-up effects (batch 1)
  // ============================================================
  evt_fu_drought_wasteland: {
    invest_in_recovery: { treasuryDelta: -40, regionDevelopmentDelta: +3, regionConditionDelta: +2 },
    abandon_the_region: { regionDevelopmentDelta: -3, regionConditionDelta: -2, commonerSatDelta: -2 },
  },
  evt_fu_merchant_water_reprisal: {
    pay_compensation: { treasuryDelta: -40, merchantSatDelta: +3, regionConditionDelta: +1 },
    dismiss_claims:   { merchantSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_burned_quarters_rebuild: {
    fund_reconstruction: { treasuryDelta: -60, regionDevelopmentDelta: +3, commonerSatDelta: +2 },
    defer_the_works:     { commonerSatDelta: -2, regionDevelopmentDelta: -2 },
  },
  evt_fu_plague_worsens: {
    mobilize_healers: { treasuryDelta: -40, regionConditionDelta: +2, clergySatDelta: +2 },
    pray_and_wait:    { faithDelta: +2, regionConditionDelta: -2, commonerSatDelta: -3 },
  },
  evt_fu_plague_wasteland: {
    resettle_and_rebuild: { treasuryDelta: -60, regionDevelopmentDelta: +3, commonerSatDelta: +2 },
    leave_it_to_the_wind: { regionDevelopmentDelta: -3, regionConditionDelta: -2, stabilityDelta: -2 },
  },
  evt_fu_exodus_refugee_crisis: {
    open_refugee_camps: { treasuryDelta: -40, foodDelta: -15, commonerSatDelta: +3, regionConditionDelta: +1 },
    turn_them_back:     { commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_martial_law_aftermath: {
    lift_restrictions:        { commonerSatDelta: +3, stabilityDelta: -1, regionConditionDelta: +1 },
    keep_troops_in_streets:   { commonerSatDelta: -3, militaryReadinessDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_famine_ration_riot: {
    distribute_reserves: { foodDelta: -15, commonerSatDelta: +4, regionConditionDelta: +1 },
    clamp_down:          { militaryReadinessDelta: -2, commonerSatDelta: -4, regionConditionDelta: -2 },
  },
  evt_fu_grain_debt_called: {
    pay_the_debt:        { treasuryDelta: -80, diplomacyDeltas: { neighbor_arenthal: +3 } },
    renegotiate_terms:   { merchantSatDelta: -2, diplomacyDeltas: { neighbor_arenthal: -2 } },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 2) ---
  evt_fu_amnesty_banditry_return: {
    recommit_patrols: { treasuryDelta: -30, militaryReadinessDelta: -2, regionConditionDelta: +1 },
    cut_losses:       { merchantSatDelta: -2, regionDevelopmentDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_lawless_outer_region: {
    reclaim_by_force:        { treasuryDelta: -60, militaryReadinessDelta: -4, regionConditionDelta: +2 },
    formalize_warlord_rule:  { regionDevelopmentDelta: -2, nobilitySatDelta: -3, commonerSatDelta: -3 },
  },
  evt_fu_coopted_lords_demand_more: {
    grant_new_privileges: { nobilitySatDelta: +3, commonerSatDelta: -3, treasuryDelta: -30, regionConditionDelta: +1 },
    draw_the_line:        { nobilitySatDelta: -5, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_corruption_entrenched: {
    launch_tribunal: { treasuryDelta: -50, nobilitySatDelta: -5, stabilityDelta: +3, regionDevelopmentDelta: +2 },
    accept_the_rot:  { stabilityDelta: -3, commonerSatDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_martial_law_backlash: {
    withdraw_troops: { commonerSatDelta: +3, militaryReadinessDelta: +2, regionConditionDelta: +1 },
    arrest_dissenters: { commonerSatDelta: -3, stabilityDelta: +2, regionConditionDelta: -1 },
  },
  evt_fu_rebel_accord_unravels: {
    honor_every_term:   { treasuryDelta: -40, commonerSatDelta: +3, regionConditionDelta: +1 },
    repudiate_the_pact: { commonerSatDelta: -5, stabilityDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_syndicate_protection_fees: {
    pay_the_fee:      { treasuryDelta: -40, merchantSatDelta: +2, regionConditionDelta: -1 },
    break_the_racket: { treasuryDelta: -20, espionageNetworkDelta: +4, regionConditionDelta: +1 },
  },
  evt_fu_criminal_shadow_state: {
    reassert_authority:           { treasuryDelta: -50, militaryReadinessDelta: -3, regionConditionDelta: +2 },
    formalize_the_arrangement:    { merchantSatDelta: +2, stabilityDelta: -2, regionConditionDelta: -1 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 3) ---
  evt_fu_factions_see_through: {
    publicly_reconcile:   { nobilitySatDelta: +2, merchantSatDelta: +2, regionConditionDelta: +1 },
    disavow_both_sides:   { nobilitySatDelta: -3, merchantSatDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_social_order_revolt: {
    concede_to_reforms: { commonerSatDelta: +4, nobilitySatDelta: -4, regionDevelopmentDelta: +2 },
    crush_dissent:      { commonerSatDelta: -5, stabilityDelta: +2, regionConditionDelta: -2 },
  },
  evt_fu_token_concessions_backfire: {
    offer_real_reforms:  { treasuryDelta: -40, commonerSatDelta: +4, regionDevelopmentDelta: +2 },
    revoke_concessions:  { commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_reform_martyrs: {
    acknowledge_wrongs: { commonerSatDelta: +4, clergySatDelta: -2, regionConditionDelta: +1 },
    deny_the_dead:      { commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_cultural_drift_backlash: {
    support_traditionalists: { culturalCohesionDelta: +3, merchantSatDelta: -3, regionConditionDelta: +1 },
    stand_by_the_reforms:    { culturalCohesionDelta: -2, commonerSatDelta: +2, regionConditionDelta: -1 },
  },
  evt_fu_suppression_diaspora_unrest: {
    offer_refuge_terms:         { treasuryDelta: -30, commonerSatDelta: +3, regionConditionDelta: +1 },
    double_down_on_suppression: { stabilityDelta: -3, culturalCohesionDelta: -2, regionConditionDelta: -2 },
  },
  evt_fu_assimilation_standoff: {
    hold_the_line: { diplomacyDeltas: { neighbor_valdris: -4 }, militaryReadinessDelta: -3, regionConditionDelta: +1 },
    offer_terms:   { diplomacyDeltas: { neighbor_valdris: +4 }, culturalCohesionDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_integration_fifth_column: {
    purge_the_agents: { espionageNetworkDelta: +4, treasuryDelta: -30, regionConditionDelta: +1 },
    turn_them:        { espionageNetworkDelta: +6, diplomacyDeltas: { neighbor_valdris: -2 }, regionConditionDelta: +1 },
  },
  evt_fu_price_freeze_shortages: {
    lift_the_freeze:    { merchantSatDelta: +3, commonerSatDelta: -2, regionConditionDelta: +1 },
    enforce_by_patrol:  { militaryReadinessDelta: -3, merchantSatDelta: -4, regionConditionDelta: -2 },
  },
  evt_fu_market_crash_bread_riots: {
    distribute_emergency_food: { foodDelta: -20, commonerSatDelta: +4, regionConditionDelta: +1 },
    call_the_city_watch:       { militaryReadinessDelta: -3, commonerSatDelta: -4, regionConditionDelta: -2 },
  },
  evt_fu_counterfeit_underground_revenge: {
    hunt_the_remnants:       { espionageNetworkDelta: +5, treasuryDelta: -20, regionConditionDelta: +1 },
    offer_amnesty_for_names: { espionageNetworkDelta: +3, merchantSatDelta: +1, regionConditionDelta: +1 },
  },
  evt_fu_royal_stamp_fraud: {
    replace_the_stamps: { treasuryDelta: -40, merchantSatDelta: +3, regionDevelopmentDelta: +1 },
    prosecute_the_ring: { merchantSatDelta: +2, stabilityDelta: +2, regionConditionDelta: +1 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 4) ---
  evt_fu_dual_practice_schism: {
    unify_rite:           { faithDelta: +3, heterodoxyDelta: -3, clergySatDelta: +2, regionDevelopmentDelta: +1 },
    let_the_rites_split:  { heterodoxyDelta: +3, culturalCohesionDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_underground_reformers: {
    hunt_and_punish:   { heterodoxyDelta: -3, commonerSatDelta: -3, regionConditionDelta: -1 },
    meet_them_halfway: { heterodoxyDelta: +2, commonerSatDelta: +2, clergySatDelta: -2, regionConditionDelta: +1 },
  },
  evt_fu_schism_reformer_revolt: {
    convene_mediation:     { treasuryDelta: -40, faithDelta: +2, regionDevelopmentDelta: +1 },
    back_orthodoxy_fully:  { clergySatDelta: +3, heterodoxyDelta: -3, commonerSatDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_schism_parallel_churches: {
    formalize_both: { culturalCohesionDelta: -2, stabilityDelta: +1, regionConditionDelta: +1 },
    force_unity:    { militaryReadinessDelta: -3, clergySatDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_doctrine_enforcement_blowback: {
    soften_the_edict:     { clergySatDelta: -1, commonerSatDelta: +2, regionConditionDelta: +1 },
    prosecute_resisters:  { heterodoxyDelta: -3, commonerSatDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_coexistence_fractures: {
    mediate_the_split: { treasuryDelta: -30, faithDelta: +2, regionDevelopmentDelta: +1 },
    pick_a_side:       { culturalCohesionDelta: -2, stabilityDelta: -1, regionConditionDelta: -1 },
  },
  evt_fu_state_religion_persecution: {
    halt_the_purges:   { heterodoxyDelta: +2, commonerSatDelta: +3, regionConditionDelta: +1 },
    deepen_the_inquiry: { heterodoxyDelta: -4, commonerSatDelta: -4, regionConditionDelta: -2 },
  },
  evt_fu_pluralism_splinter_sects: {
    regulate_the_sects: { clergySatDelta: +2, heterodoxyDelta: -2, regionConditionDelta: +1 },
    let_them_fracture:  { heterodoxyDelta: +3, culturalCohesionDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_secularization_backlash: {
    restore_church_seats: { clergySatDelta: +3, commonerSatDelta: -2, regionConditionDelta: +1 },
    hold_the_reforms:     { clergySatDelta: -3, commonerSatDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_fu_comet_heresy_spreads: {
    authorize_suppression: { heterodoxyDelta: -4, commonerSatDelta: -3, regionConditionDelta: -1 },
    engage_in_debate:      { heterodoxyDelta: +2, culturalCohesionDelta: +2, regionConditionDelta: +1 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 5) ---
  evt_fu_marriage_dynastic_friction: {
    formalize_joint_rule: { diplomacyDeltas: { neighbor_arenthal: +4 }, nobilitySatDelta: -2, regionDevelopmentDelta: +1 },
    exile_the_in_laws:    { diplomacyDeltas: { neighbor_arenthal: -5 }, nobilitySatDelta: +2, regionConditionDelta: -1 },
  },
  evt_fu_exiled_pretender_returns: {
    meet_with_sword:   { treasuryDelta: -40, militaryReadinessDelta: -4, stabilityDelta: +2, regionConditionDelta: -1 },
    offer_a_settlement: { treasuryDelta: -60, nobilitySatDelta: +2, regionConditionDelta: +1 },
  },
  evt_fu_succession_factions_war: {
    seize_a_side:          { nobilitySatDelta: -4, militaryReadinessDelta: -3, regionDevelopmentDelta: -2, regionConditionDelta: -2 },
    call_peace_conference: { treasuryDelta: -40, nobilitySatDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_fu_merit_heir_noble_backlash: {
    grant_noble_concession: { nobilitySatDelta: +3, treasuryDelta: -30, regionConditionDelta: +1 },
    hold_the_merit_line:    { nobilitySatDelta: -5, commonerSatDelta: +3, regionDevelopmentDelta: +1 },
  },
  evt_fu_authority_rebellion: {
    crush_the_rising: { militaryReadinessDelta: -4, commonerSatDelta: -4, regionConditionDelta: -2 },
    grant_a_charter:  { treasuryDelta: -30, commonerSatDelta: +3, regionDevelopmentDelta: +2 },
  },
  evt_fu_charter_implementation: {
    stand_by_the_letter:    { commonerSatDelta: +2, nobilitySatDelta: -2, regionDevelopmentDelta: +1 },
    reinterpret_it_royally: { commonerSatDelta: -3, nobilitySatDelta: +2, regionConditionDelta: -1 },
  },
  evt_fu_purge_court_paralysis: {
    recall_trusted_exiles:      { nobilitySatDelta: +3, treasuryDelta: -20, regionDevelopmentDelta: +1 },
    fill_seats_with_loyalists:  { nobilitySatDelta: -2, stabilityDelta: +2, regionConditionDelta: +1 },
  },
  evt_fu_mercy_emboldens_plot: {
    arrest_the_cell: { espionageNetworkDelta: +4, treasuryDelta: -20, regionConditionDelta: +1 },
    ignore_the_rumors: { stabilityDelta: -3, regionConditionDelta: -2 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 6) ---
  evt_fu_purge_officer_shortage: {
    promote_from_ranks:  { militaryCasteSatDelta: +3, militaryReadinessDelta: +3, regionDevelopmentDelta: +1 },
    recruit_mercenaries: { treasuryDelta: -40, militaryReadinessDelta: +2, regionConditionDelta: -1 },
  },
  evt_fu_bribed_officers_ask_more: {
    raise_the_purse: { treasuryDelta: -60, militaryCasteSatDelta: +3, regionConditionDelta: +1 },
    hold_the_line:   { militaryCasteSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_ringleader_martyrs: {
    grant_posthumous_pardons:   { militaryCasteSatDelta: +2, commonerSatDelta: +2, regionConditionDelta: +1 },
    reinforce_the_narrative:    { militaryCasteSatDelta: -3, commonerSatDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_officer_cabal: {
    infiltrate_the_cabal: { espionageNetworkDelta: +5, treasuryDelta: -20, regionConditionDelta: +1 },
    confront_them_openly: { militaryCasteSatDelta: -4, militaryReadinessDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_merchant_boycott: {
    pay_the_backtax: { treasuryDelta: -60, merchantSatDelta: +4, regionConditionDelta: +1 },
    force_the_trade: { merchantSatDelta: -5, militaryReadinessDelta: -2, regionConditionDelta: -2 },
  },
  evt_fu_starving_garrison: {
    airlift_rations:    { treasuryDelta: -80, foodDelta: -20, militaryMoraleDelta: +5, regionDevelopmentDelta: +1 },
    abandon_the_post:   { militaryReadinessDelta: -5, regionDevelopmentDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_field_equipment_catastrophe: {
    emergency_armory_orders: { treasuryDelta: -80, militaryEquipmentDelta: +6, regionDevelopmentDelta: +1 },
    let_the_unit_dissolve:   { militaryForceSizeDelta: -100, militaryMoraleDelta: -5, regionConditionDelta: -1 },
  },
  evt_fu_estate_seizure_lawsuit: {
    pay_the_indemnity: { treasuryDelta: -60, nobilitySatDelta: +3, regionConditionDelta: +1 },
    quash_the_suit:    { nobilitySatDelta: -5, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_seized_granaries_noble_revolt: {
    return_the_stores:  { nobilitySatDelta: +3, foodDelta: -15, regionConditionDelta: +1 },
    confront_the_lords: { nobilitySatDelta: -5, militaryReadinessDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_famine_descends_into_riot: {
    distribute_reserves: { foodDelta: -15, commonerSatDelta: +4, regionConditionDelta: +1 },
    deploy_the_guard:    { militaryReadinessDelta: -2, commonerSatDelta: -4, regionConditionDelta: -2 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 7) ---
  evt_fu_noble_contribution_resistance: {
    seize_the_levy: { treasuryDelta: +40, nobilitySatDelta: -5, regionConditionDelta: -1 },
    waive_the_demand: { treasuryDelta: -30, nobilitySatDelta: +3, regionConditionDelta: +1 },
  },
  evt_fu_neglected_works_collapse: {
    emergency_repair_fund:  { treasuryDelta: -50, regionDevelopmentDelta: +3, commonerSatDelta: +2 },
    let_it_stand_as_warning: { regionDevelopmentDelta: -3, commonerSatDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_arrests_purge_pushback: {
    release_half_the_held: { nobilitySatDelta: +3, stabilityDelta: +1, regionConditionDelta: +1 },
    double_the_arrests:    { nobilitySatDelta: -5, espionageNetworkDelta: +2, regionConditionDelta: -2 },
  },
  evt_fu_double_agent_compromised: {
    extract_the_agent: { treasuryDelta: -30, espionageNetworkDelta: +3, regionConditionDelta: +1 },
    burn_them:         { espionageNetworkDelta: -3, stabilityDelta: -1, regionConditionDelta: -1 },
  },
  evt_fu_closed_border_smuggling: {
    legalize_controlled_exits: { merchantSatDelta: +3, treasuryDelta: +20, regionDevelopmentDelta: +1 },
    crack_down_on_runners:     { merchantSatDelta: -3, militaryReadinessDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_exodus_brain_drain: {
    incentivize_return: { treasuryDelta: -40, culturalCohesionDelta: +2, regionDevelopmentDelta: +2 },
    seal_borders_tighter: { militaryReadinessDelta: -3, merchantSatDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_curfew_mass_defiance: {
    lift_the_curfew:     { commonerSatDelta: +3, stabilityDelta: -1, regionConditionDelta: +1 },
    enforce_with_blood:  { commonerSatDelta: -6, militaryReadinessDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_peacekeeper_overreach: {
    court_martial_the_officers: { militaryCasteSatDelta: -3, commonerSatDelta: +3, regionConditionDelta: +1 },
    defend_the_guards:          { militaryCasteSatDelta: +2, commonerSatDelta: -4, regionConditionDelta: -1 },
  },
  evt_fu_patrol_brutality_complaint: {
    reassign_the_unit:    { militaryReadinessDelta: -2, commonerSatDelta: +3, regionConditionDelta: +1 },
    dismiss_the_complaint: { commonerSatDelta: -3, stabilityDelta: -1, regionConditionDelta: -1 },
  },
  evt_fu_labor_reform_backlash: {
    broaden_the_reform: { treasuryDelta: -30, commonerSatDelta: +4, regionDevelopmentDelta: +2 },
    soften_the_edict:   { commonerSatDelta: -1, nobilitySatDelta: +2, regionConditionDelta: +1 },
  },

  // --- Phase 2 Card Audit — Stub follow-up effects (batch 8) ---
  evt_fu_crushed_movement_underground: {
    hunt_the_cells: { espionageNetworkDelta: +4, treasuryDelta: -30, regionConditionDelta: -1 },
    offer_amnesty:  { commonerSatDelta: +3, heterodoxyDelta: +1, regionConditionDelta: +1 },
  },
  evt_fu_guild_compromise_drift: {
    honor_the_accord: { merchantSatDelta: +3, treasuryDelta: -20, regionDevelopmentDelta: +1 },
    revise_the_terms: { merchantSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  },
  evt_fu_commandeered_stores_noble_strike: {
    return_the_grain:    { nobilitySatDelta: +3, foodDelta: -10, regionConditionDelta: +1 },
    seize_more_estates:  { treasuryDelta: +40, nobilitySatDelta: -6, regionConditionDelta: -2 },
  },
  evt_fu_spoiled_grain_sickness: {
    deploy_healers:           { treasuryDelta: -40, commonerSatDelta: +3, regionConditionDelta: +2 },
    quarantine_the_villages:  { commonerSatDelta: -3, stabilityDelta: +1, regionConditionDelta: -1 },
  },
  evt_fu_noble_estate_razed: {
    compensate_the_survivors:  { treasuryDelta: -40, nobilitySatDelta: +2, regionDevelopmentDelta: +1 },
    redistribute_the_holdings: { commonerSatDelta: +4, nobilitySatDelta: -5, regionDevelopmentDelta: +2 },
  },
  evt_fu_amnesty_cabal_reforms: {
    codify_the_concessions: { nobilitySatDelta: +3, commonerSatDelta: -2, regionDevelopmentDelta: +1 },
    revoke_the_amnesty:     { nobilitySatDelta: -5, stabilityDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_force_crackdown_legacy: {
    apologize_publicly:   { commonerSatDelta: +4, nobilitySatDelta: -2, regionConditionDelta: +1 },
    erase_the_memorials:  { commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -2 },
  },
  evt_fu_mob_rule_spreads: {
    crush_the_mob_courts: { commonerSatDelta: -4, militaryReadinessDelta: -2, regionConditionDelta: -1 },
    formalize_tribunals:  { commonerSatDelta: +3, stabilityDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_fu_civilian_authority_falters: {
    restore_military_patrol: { militaryReadinessDelta: -3, stabilityDelta: +3, regionConditionDelta: +1 },
    back_civilian_courts:    { treasuryDelta: -30, commonerSatDelta: +3, regionDevelopmentDelta: +1 },
  },
  evt_fu_pardon_emboldens_graft: {
    launch_fresh_tribunal: { treasuryDelta: -40, nobilitySatDelta: -3, regionDevelopmentDelta: +2 },
    legalize_graft_fees:   { treasuryDelta: +20, commonerSatDelta: -3, regionConditionDelta: -1 },
  },
  evt_fu_press_smuggled_in: {
    seize_every_press: { treasuryDelta: -20, heterodoxyDelta: -3, regionConditionDelta: -1 },
    regulate_instead:  { merchantSatDelta: +2, commonerSatDelta: +2, regionDevelopmentDelta: +1 },
  },
  evt_fu_abandoned_convoy_outrage: {
    reimburse_the_merchants: { treasuryDelta: -40, merchantSatDelta: +3, regionConditionDelta: +1 },
    decline_responsibility:  { merchantSatDelta: -4, stabilityDelta: -1, regionConditionDelta: -1 },
  },
  evt_fu_scorched_earth_famine: {
    import_emergency_grain:     { treasuryDelta: -80, foodDelta: +25, regionConditionDelta: +1 },
    let_the_borderlands_starve: { commonerSatDelta: -5, regionDevelopmentDelta: -3, regionConditionDelta: -2 },
  },
  evt_fu_surrender_terms_harsh: {
    pay_the_indemnity: { treasuryDelta: -80, diplomacyDeltas: { neighbor_valdris: +4 }, regionConditionDelta: +1 },
    reopen_the_war:    { militaryReadinessDelta: -4, diplomacyDeltas: { neighbor_valdris: -6 }, regionConditionDelta: -2 },
  },
};
