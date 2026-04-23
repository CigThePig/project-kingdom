import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_PUBLIC_ORDER_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Riots in the Market District — Serious
  // ============================================================
  evt_exp_po_market_riots: {
    deploy_garrison:            { stabilityDelta: +4, militaryReadinessDelta: -5, commonerSatDelta: -3, militaryCasteSatDelta: +2 },
    negotiate_with_ringleaders: { stabilityDelta: +2, treasuryDelta: -40, commonerSatDelta: +3, nobilitySatDelta: -3 },
    seal_district_gates:        { stabilityDelta: +1, merchantSatDelta: -4, regionConditionDelta: -3, treasuryDelta: -20 },
  },

  // ============================================================
  // 2. Highway Banditry Surge — Notable
  // ============================================================
  evt_exp_po_highway_banditry: {
    fund_bounty_hunters:      { treasuryDelta: -40, stabilityDelta: +3, merchantSatDelta: +2, commonerSatDelta: -1 },
    establish_road_garrisons:  { treasuryDelta: -50, stabilityDelta: +4, militaryReadinessDelta: -3, regionDevelopmentDelta: +2 },
    offer_amnesty_to_bandits:  { stabilityDelta: +1, commonerSatDelta: +2, nobilitySatDelta: -3, merchantSatDelta: -2 },
  },

  // ============================================================
  // 3. Curfew Debate — Notable
  // ============================================================
  evt_exp_po_curfew_debate: {
    impose_strict_curfew:  { stabilityDelta: +5, commonerSatDelta: -4, merchantSatDelta: -3, militaryCasteSatDelta: +2 },
    limited_evening_curfew: { stabilityDelta: +3, commonerSatDelta: -2, merchantSatDelta: -1 },
    reject_curfew:          { stabilityDelta: -1, commonerSatDelta: +2, merchantSatDelta: +1 },
  },

  // ============================================================
  // 4. Crime Wave — Serious
  // ============================================================
  evt_exp_po_crime_wave: {
    hire_additional_watchmen:      { treasuryDelta: -60, stabilityDelta: +5, commonerSatDelta: +2, regionConditionDelta: +2 },
    public_executions:             { stabilityDelta: +4, commonerSatDelta: -4, faithDelta: -2, clergySatDelta: -2 },
    empower_neighborhood_watches:  { stabilityDelta: +2, commonerSatDelta: +3, nobilitySatDelta: -2, treasuryDelta: -20 },
  },

  // ============================================================
  // 5. Vigilante Justice — Notable
  // ============================================================
  evt_exp_po_vigilante_justice: {
    arrest_vigilantes:       { stabilityDelta: +2, commonerSatDelta: -3, nobilitySatDelta: +2, treasuryDelta: -25 },
    legitimize_as_militia:   { stabilityDelta: +1, commonerSatDelta: +3, nobilitySatDelta: -4, militaryReadinessDelta: -2 },
    ignore_for_now:          { stabilityDelta: -3, commonerSatDelta: +1, nobilitySatDelta: -1 },
  },

  // ============================================================
  // 6. Prison Overcrowding — Serious
  // ============================================================
  evt_exp_po_prison_overcrowding: {
    build_new_prison:         { treasuryDelta: -80, stabilityDelta: +4, regionDevelopmentDelta: +3, commonerSatDelta: -2 },
    release_minor_offenders:  { stabilityDelta: -3, commonerSatDelta: +3, nobilitySatDelta: -3, merchantSatDelta: -2 },
    forced_labor_gangs:       { treasuryDelta: +30, stabilityDelta: +2, commonerSatDelta: -5, clergySatDelta: -3 },
  },

  // ============================================================
  // 7. Tax Resistance Movement — Serious
  // ============================================================
  evt_exp_po_tax_resistance: {
    send_tax_collectors_with_guards:  { treasuryDelta: +40, stabilityDelta: -3, commonerSatDelta: -5, militaryReadinessDelta: -2 },
    temporarily_reduce_taxes:          { treasuryDelta: -60, stabilityDelta: +3, commonerSatDelta: +4, nobilitySatDelta: -2 },
    address_grievances_at_court:       { treasuryDelta: -30, stabilityDelta: +2, commonerSatDelta: +2, nobilitySatDelta: +1 },
  },

  // ============================================================
  // 8. Black Market Flourishing — Notable
  // ============================================================
  evt_exp_po_black_market: {
    raid_black_market:  { stabilityDelta: +3, merchantSatDelta: -4, foodDelta: +10, treasuryDelta: +20 },
    tax_and_regulate:   { treasuryDelta: +30, stabilityDelta: -1, merchantSatDelta: +2, nobilitySatDelta: -2 },
    turn_blind_eye:     { stabilityDelta: -2, merchantSatDelta: +1, commonerSatDelta: +1, foodDelta: +5 },
  },

  // ============================================================
  // 9. Gang Warfare — Serious
  // ============================================================
  evt_exp_po_gang_warfare: {
    military_sweep:               { stabilityDelta: +6, militaryReadinessDelta: -6, commonerSatDelta: -3, regionConditionDelta: -4, treasuryDelta: -25 },
    pit_gangs_against_each_other: { stabilityDelta: -2, espionageNetworkDelta: +3, commonerSatDelta: -4, nobilitySatDelta: -1 },
    offer_gang_leaders_positions: { stabilityDelta: +2, commonerSatDelta: +2, nobilitySatDelta: -5, merchantSatDelta: -2 },
  },

  // ============================================================
  // 10. Arson Attacks — Notable
  // ============================================================
  evt_exp_po_arson_attacks: {
    form_fire_brigades:   { treasuryDelta: -35, stabilityDelta: +3, commonerSatDelta: +2, regionConditionDelta: +2 },
    investigate_arsonists: { treasuryDelta: -25, stabilityDelta: +2, espionageNetworkDelta: +2, commonerSatDelta: -1 },
    post_night_sentries:   { stabilityDelta: +1, militaryReadinessDelta: -2, regionConditionDelta: -2 },
  },

  // ============================================================
  // 11. Public Drunkenness Epidemic — Informational
  // ============================================================
  evt_exp_po_drunkenness: {
    regulate_taverns:            { treasuryDelta: +15, stabilityDelta: +2, commonerSatDelta: -2, merchantSatDelta: -1 },
    clergy_temperance_campaign:  { stabilityDelta: +1, faithDelta: +3, commonerSatDelta: -1, clergySatDelta: +2 },
    leave_it_be:                 { stabilityDelta: -1, commonerSatDelta: +1 },
  },

  // ============================================================
  // 12. Refugee Influx — Critical
  // ============================================================
  evt_exp_po_refugee_influx: {
    welcome_and_settle:  { treasuryDelta: -80, foodDelta: -30, stabilityDelta: -3, commonerSatDelta: -4, regionDevelopmentDelta: +5 },
    temporary_camps:     { treasuryDelta: -40, foodDelta: -15, stabilityDelta: -1, commonerSatDelta: -2, regionConditionDelta: -3 },
    close_the_borders:   { stabilityDelta: +3, commonerSatDelta: +2, faithDelta: -3, clergySatDelta: -4 },
  },

  // ============================================================
  // 13. Vagrancy Crisis — Informational
  // ============================================================
  evt_exp_po_vagrancy: {
    establish_poorhouses:  { treasuryDelta: -15, stabilityDelta: +2, commonerSatDelta: +3, faithDelta: +1 },
    conscript_vagrants:    { stabilityDelta: +1, militaryForceSizeDelta: +2, commonerSatDelta: -2, clergySatDelta: -1 },
    ignore_the_problem:    { stabilityDelta: -1, commonerSatDelta: -1 },
  },

  // ============================================================
  // 14. Labor Strike — Notable
  // ============================================================
  evt_exp_po_labor_strike: {
    grant_wage_increase:    { treasuryDelta: -50, stabilityDelta: +3, commonerSatDelta: +5, nobilitySatDelta: -3 },
    break_the_strike:       { stabilityDelta: -2, commonerSatDelta: -5, nobilitySatDelta: +3, militaryReadinessDelta: -2 },
    replace_with_conscripts: { stabilityDelta: -1, commonerSatDelta: -4, militaryCasteSatDelta: -2, treasuryDelta: -20 },
  },

  // ============================================================
  // 15. Mob Justice — Critical
  // ============================================================
  evt_exp_po_mob_justice: {
    restore_order_by_force: { stabilityDelta: +6, commonerSatDelta: -6, militaryReadinessDelta: -5, militaryMoraleDelta: -3, regionConditionDelta: -1 },
    hold_public_trial:      { stabilityDelta: +3, treasuryDelta: -40, commonerSatDelta: +2, nobilitySatDelta: -2, regionDevelopmentDelta: +1 },
    let_the_mob_decide:     { stabilityDelta: -6, commonerSatDelta: +4, nobilitySatDelta: -6, clergySatDelta: -3, regionDevelopmentDelta: -3, regionConditionDelta: -2 },
  },

  // ============================================================
  // 16. Martial Law Debate — Critical
  // ============================================================
  evt_exp_po_martial_law: {
    declare_martial_law:      { stabilityDelta: +8, commonerSatDelta: -7, merchantSatDelta: -5, militaryReadinessDelta: -6, militaryCasteSatDelta: +4, regionConditionDelta: +1 },
    limited_military_patrols: { stabilityDelta: +4, commonerSatDelta: -3, militaryReadinessDelta: -3, treasuryDelta: -40, regionConditionDelta: +1 },
    trust_civilian_authority:  { stabilityDelta: -2, commonerSatDelta: +3, nobilitySatDelta: +2, militaryCasteSatDelta: -3, regionConditionDelta: -2 },
  },

  // ============================================================
  // 17. Street Brawling Epidemic — Informational
  // ============================================================
  evt_exp_po_street_brawls: {
    increase_watch_patrols: { treasuryDelta: -15, stabilityDelta: +2, commonerSatDelta: -1, militaryReadinessDelta: -1 },
    organize_public_games:  { treasuryDelta: -10, stabilityDelta: +1, commonerSatDelta: +3, nobilitySatDelta: -1 },
    dismiss_as_rowdiness:   { stabilityDelta: -1, commonerSatDelta: +1 },
  },

  // ============================================================
  // 18. People's Mood — Informational
  // ============================================================
  evt_exp_po_peoples_mood: {
    increase_watch_presence:  { treasuryDelta: -15, stabilityDelta: +3, commonerSatDelta: -1, militaryCasteSatDelta: +1 },
    address_grievances:       { treasuryDelta: -10, commonerSatDelta: +3, stabilityDelta: +1, nobilitySatDelta: -1 },
    take_no_action:           { stabilityDelta: -1, commonerSatDelta: -1 },
  },
};
