import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_CLASS_CONFLICT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Tax Burden Dispute (Serious: -80/+50, -4/+6 sat)
  // ============================================================
  evt_exp_cc_tax_burden_dispute: {
    redistribute_tax_burden:   { treasuryDelta: +40, commonerSatDelta: +5, nobilitySatDelta: -4, stabilityDelta: +2 },
    maintain_noble_exemptions: { nobilitySatDelta: +4, commonerSatDelta: -5, stabilityDelta: -3, treasuryDelta: -10 },
    commission_tax_review:     { treasuryDelta: -30, commonerSatDelta: +2, nobilitySatDelta: -1, stabilityDelta: +1 },
  },

  // ============================================================
  // 2. Usury Accusation (Notable: -50/+40, -3/+5 sat)
  // ============================================================
  evt_exp_cc_usury_accusation: {
    enforce_usury_laws:        { clergySatDelta: +4, merchantSatDelta: -3, treasuryDelta: -20, faithDelta: +2 },
    protect_lending_practices: { merchantSatDelta: +4, clergySatDelta: -3, treasuryDelta: +25, heterodoxyDelta: +2 },
    appoint_arbitration_panel: { clergySatDelta: +1, merchantSatDelta: +1, treasuryDelta: -15, stabilityDelta: +2, faithDelta: -1 },
  },

  // ============================================================
  // 3. Military Privilege Demand (Serious: -80/+50, -4/+6 sat)
  // ============================================================
  evt_exp_cc_military_privilege_demand: {
    grant_military_estates:  { militaryCasteSatDelta: +6, nobilitySatDelta: -4, commonerSatDelta: -3, treasuryDelta: -50 },
    offer_honorary_titles:   { militaryCasteSatDelta: +3, nobilitySatDelta: -2, treasuryDelta: -20, stabilityDelta: +1 },
    refuse_special_treatment:{ militaryCasteSatDelta: -5, commonerSatDelta: +2, militaryMoraleDelta: -3, stabilityDelta: -2 },
  },

  // ============================================================
  // 4. Inter-Class Marriage (Informational: -15/+30, +1/+3 sat)
  // ============================================================
  evt_exp_cc_interclass_marriage: {
    bless_the_union:       { commonerSatDelta: +2, nobilitySatDelta: -2, stabilityDelta: +1 },
    discourage_precedent:  { nobilitySatDelta: +2, commonerSatDelta: -1, stabilityDelta: -1 },
  },

  // ============================================================
  // 5. Guild vs Nobility Power Struggle (Critical: -120/+80, -6/+8 sat)
  // ============================================================
  evt_exp_cc_guild_noble_power_struggle: {
    curtail_guild_influence:          { nobilitySatDelta: +6, merchantSatDelta: -7, treasuryDelta: -40, stabilityDelta: -3, regionDevelopmentDelta: -2 },
    formalize_guild_seats:            { merchantSatDelta: +7, nobilitySatDelta: -6, treasuryDelta: +50, stabilityDelta: +2, regionDevelopmentDelta: +3 },
    play_factions_against_each_other: { nobilitySatDelta: -2, merchantSatDelta: -2, espionageNetworkDelta: +4, stabilityDelta: -4, regionConditionDelta: -1 },
  },

  // ============================================================
  // 6. Commoner Envy (Notable: -50/+40, -3/+5 sat)
  // ============================================================
  evt_exp_cc_commoner_envy: {
    impose_wealth_tithe: { commonerSatDelta: +4, merchantSatDelta: -3, treasuryDelta: +30 },
    fund_public_works:   { commonerSatDelta: +3, treasuryDelta: -40, merchantSatDelta: -1, regionDevelopmentDelta: +3 },
    dismiss_grievances:  { commonerSatDelta: -3, merchantSatDelta: +1, stabilityDelta: -2 },
  },

  // ============================================================
  // 7. Clerical Overreach (Serious: -80/+50, -4/+6 sat)
  // ============================================================
  evt_exp_cc_clerical_overreach: {
    limit_church_holdings:    { clergySatDelta: -5, commonerSatDelta: +4, nobilitySatDelta: +2, faithDelta: -3 },
    sanction_expanded_tithes: { clergySatDelta: +5, commonerSatDelta: -4, faithDelta: +3, treasuryDelta: -30 },
    negotiate_boundaries:     { clergySatDelta: +1, commonerSatDelta: +1, treasuryDelta: -15, stabilityDelta: +2, faithDelta: -1 },
  },

  // ============================================================
  // 8. Justice Inequality (Notable: -50/+40, -3/+5 sat)
  // ============================================================
  evt_exp_cc_justice_inequality: {
    establish_equal_courts:    { commonerSatDelta: +5, nobilitySatDelta: -4, treasuryDelta: -35, stabilityDelta: +3 },
    uphold_traditional_courts: { nobilitySatDelta: +3, commonerSatDelta: -3, clergySatDelta: +1 },
    create_appellate_process:  { commonerSatDelta: +2, nobilitySatDelta: -1, treasuryDelta: -20, stabilityDelta: +1 },
  },

  // ============================================================
  // 9. Social Mobility Demands (Critical: -120/+80, -6/+8 sat)
  // ============================================================
  evt_exp_cc_social_mobility_demands: {
    open_ranks_to_merit:       { commonerSatDelta: +8, nobilitySatDelta: -6, clergySatDelta: -3, treasuryDelta: -60, stabilityDelta: +4, regionDevelopmentDelta: +3, heterodoxyDelta: +3 },
    create_advancement_paths:  { commonerSatDelta: +5, nobilitySatDelta: -3, treasuryDelta: -40, stabilityDelta: +2, regionDevelopmentDelta: +2, heterodoxyDelta: +1 },
    reaffirm_social_order:     { nobilitySatDelta: +4, clergySatDelta: +2, commonerSatDelta: -7, stabilityDelta: -5, regionConditionDelta: -2, faithDelta: +2 },
  },

  // ============================================================
  // 10. Land Ownership Dispute (Serious: -80/+50, -4/+6 sat)
  // ============================================================
  evt_exp_cc_land_ownership_dispute: {
    redistribute_crown_lands:      { commonerSatDelta: +5, nobilitySatDelta: -5, treasuryDelta: -20, regionDevelopmentDelta: +3, foodDelta: +5 },
    enforce_existing_deeds:        { nobilitySatDelta: +4, commonerSatDelta: -4, stabilityDelta: -2, foodDelta: -3 },
    establish_tenant_protections:  { commonerSatDelta: +3, nobilitySatDelta: -2, treasuryDelta: -15, stabilityDelta: +2, foodDelta: +3 },
  },

  // ============================================================
  // 11. Merchant-Military War Costs (Notable: -50/+40, -3/+5 sat)
  // ============================================================
  evt_exp_cc_merchant_military_war_costs: {
    reduce_military_spending:    { merchantSatDelta: +4, militaryCasteSatDelta: -4, militaryReadinessDelta: -5, treasuryDelta: +30 },
    levy_war_commerce_tax:       { militaryCasteSatDelta: +3, merchantSatDelta: -4, treasuryDelta: +25 },
    acknowledge_both_concerns:   { merchantSatDelta: +1, militaryCasteSatDelta: +1, stabilityDelta: -1 },
  },

  // ============================================================
  // 12. Labor Rights (Notable: -50/+40, -3/+5 sat)
  // ============================================================
  evt_exp_cc_labor_rights: {
    grant_labor_protections:  { commonerSatDelta: +5, merchantSatDelta: -3, nobilitySatDelta: -2, treasuryDelta: -25, faithDelta: +1 },
    enforce_work_obligations: { nobilitySatDelta: +3, merchantSatDelta: +2, commonerSatDelta: -4, stabilityDelta: -2, faithDelta: -2 },
    defer_to_local_lords:     { nobilitySatDelta: +2, commonerSatDelta: -2, stabilityDelta: -1, faithDelta: -1 },
  },

  // ============================================================
  // 13. Privilege Reform (Critical: -120/+80, -6/+8 sat)
  // ============================================================
  evt_exp_cc_privilege_reform: {
    enact_sweeping_reforms:    { commonerSatDelta: +8, nobilitySatDelta: -7, clergySatDelta: -4, treasuryDelta: -80, stabilityDelta: +5, regionDevelopmentDelta: +3 },
    offer_token_concessions:   { commonerSatDelta: +3, nobilitySatDelta: -2, treasuryDelta: -30, stabilityDelta: +1, regionConditionDelta: -1 },
    suppress_reform_movement:  { nobilitySatDelta: +4, commonerSatDelta: -6, militaryCasteSatDelta: +2, stabilityDelta: -6, regionConditionDelta: -2, treasuryDelta: -20 },
  },

  // ============================================================
  // 14. Harvest Tithe Resentment (Informational: -15/+30, +1/+3 sat)
  // ============================================================
  evt_exp_cc_harvest_tithe_resentment: {
    reduce_harvest_tithe: { commonerSatDelta: +3, clergySatDelta: -2, foodDelta: +10, treasuryDelta: -15 },
    hold_tithe_steady:    { clergySatDelta: +1, commonerSatDelta: -1, foodDelta: -3 },
  },
};
