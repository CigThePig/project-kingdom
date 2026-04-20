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
};
