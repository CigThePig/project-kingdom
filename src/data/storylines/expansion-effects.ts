import type { MechanicalEffectDelta } from '../../engine/types';

/**
 * Branch point choice effects for expansion storylines.
 * Applied when the player makes a branch point decision (opening or mid-arc).
 */
export const EXPANSION_STORYLINE_CHOICE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Political 1 — The Council of Lords
  // ============================================================
  sl_exp_council_of_lords: {
    // Opening choices
    accept_council_proposal:      { nobilitySatDelta: +5, commonerSatDelta: -2, stabilityDelta: +3, treasuryDelta: -15 },
    reject_and_reassert_authority: { nobilitySatDelta: -5, stabilityDelta: -3, commonerSatDelta: +2, militaryCasteSatDelta: +1 },
    propose_limited_advisory_body: { nobilitySatDelta: +2, commonerSatDelta: +1, stabilityDelta: +1, treasuryDelta: -10 },
    // Mid-arc choices
    grant_legislative_powers:      { nobilitySatDelta: +4, commonerSatDelta: -3, stabilityDelta: +2, treasuryDelta: -20 },
    stack_council_with_loyalists:  { nobilitySatDelta: -2, espionageNetworkDelta: +4, stabilityDelta: +1, treasuryDelta: -25 },
    dissolve_council_by_force:     { nobilitySatDelta: -5, militaryCasteSatDelta: +2, stabilityDelta: -4, commonerSatDelta: -2 },
  },

  // ============================================================
  // Political 2 — The Foreign Bride
  // ============================================================
  sl_exp_foreign_bride: {
    // Opening choices
    accept_marriage_alliance:       { treasuryDelta: +30, nobilitySatDelta: -2, commonerSatDelta: +2, culturalCohesionDelta: -3 },
    negotiate_better_terms:         { treasuryDelta: +15, nobilitySatDelta: +2, stabilityDelta: +1, espionageNetworkDelta: +2 },
    decline_and_seek_domestic_match: { nobilitySatDelta: +3, culturalCohesionDelta: +3, merchantSatDelta: -3, treasuryDelta: -10 },
    // Mid-arc choices
    embrace_foreign_customs:         { culturalCohesionDelta: -4, merchantSatDelta: +3, commonerSatDelta: +2, treasuryDelta: +20 },
    insist_on_assimilation:          { culturalCohesionDelta: +3, clergySatDelta: +2, commonerSatDelta: -1, stabilityDelta: +2 },
    exploit_alliance_for_trade:      { merchantSatDelta: +4, treasuryDelta: +25, nobilitySatDelta: -3, stabilityDelta: -1 },
  },

  // ============================================================
  // Religious 1 — The Relic Discovery
  // ============================================================
  sl_exp_relic_discovery: {
    // Opening choices
    enshrine_in_cathedral:  { faithDelta: +5, clergySatDelta: +4, treasuryDelta: -30, heterodoxyDelta: -3 },
    submit_to_scholarly_study: { faithDelta: -1, culturalCohesionDelta: +2, clergySatDelta: -2, treasuryDelta: -15 },
    auction_to_highest_bidder: { treasuryDelta: +40, clergySatDelta: -5, faithDelta: -3, merchantSatDelta: +3 },
    // Mid-arc choices
    declare_miraculous_origin: { faithDelta: +4, clergySatDelta: +3, heterodoxyDelta: -2, commonerSatDelta: +2 },
    share_relic_with_neighbor: { faithDelta: +2, stabilityDelta: +2, clergySatDelta: -2, treasuryDelta: -10 },
    suppress_competing_claims: { clergySatDelta: +2, stabilityDelta: -2, espionageNetworkDelta: +3, commonerSatDelta: -2 },
  },

  // ============================================================
  // Religious 2 — The Witch Trials
  // ============================================================
  sl_exp_witch_trials: {
    // Opening choices
    authorize_inquisition:       { clergySatDelta: +4, commonerSatDelta: -4, faithDelta: +3, stabilityDelta: -2 },
    demand_evidence_standards:   { clergySatDelta: -1, commonerSatDelta: +2, stabilityDelta: +2, nobilitySatDelta: +1 },
    dismiss_accusations_outright: { clergySatDelta: -4, commonerSatDelta: +3, faithDelta: -3, heterodoxyDelta: +3 },
    // Mid-arc choices
    expand_trials_to_nobility:   { nobilitySatDelta: -5, clergySatDelta: +3, espionageNetworkDelta: +3, stabilityDelta: -3 },
    pardon_the_accused:          { commonerSatDelta: +4, clergySatDelta: -3, faithDelta: -2, stabilityDelta: +2 },
    redirect_fervor_outward:     { militaryCasteSatDelta: +2, clergySatDelta: +1, stabilityDelta: +1, treasuryDelta: -20 },
  },

  // ============================================================
  // Military 1 — The Mercenary Company
  // ============================================================
  sl_exp_mercenary_company: {
    // Opening choices
    hire_full_company:      { militaryForceSizeDelta: +5, militaryReadinessDelta: +4, treasuryDelta: -40, militaryCasteSatDelta: -3 },
    hire_select_specialists: { militaryReadinessDelta: +3, militaryEquipmentDelta: +3, treasuryDelta: -25, militaryCasteSatDelta: -1 },
    turn_mercenaries_away:  { militaryCasteSatDelta: +3, treasuryDelta: +5, stabilityDelta: +1, militaryReadinessDelta: -2 },
    // Mid-arc choices
    integrate_into_standing_army: { militaryCasteSatDelta: -3, militaryForceSizeDelta: +3, militaryMoraleDelta: -2, treasuryDelta: -20 },
    deploy_to_border_garrison:    { militaryReadinessDelta: +4, regionConditionDelta: +2, treasuryDelta: -15, commonerSatDelta: -1 },
    terminate_contract_early:     { treasuryDelta: -30, militaryForceSizeDelta: -3, stabilityDelta: -2, militaryCasteSatDelta: +2 },
  },

  // ============================================================
  // Military 2 — The Veterans' March
  // ============================================================
  sl_exp_veterans_march: {
    // Opening choices
    grant_veteran_pensions: { treasuryDelta: -35, militaryCasteSatDelta: +4, commonerSatDelta: +2, stabilityDelta: +2 },
    offer_land_grants:      { treasuryDelta: -15, militaryCasteSatDelta: +3, regionDevelopmentDelta: +2, nobilitySatDelta: -3 },
    disperse_the_march:     { militaryCasteSatDelta: -5, stabilityDelta: -3, commonerSatDelta: -2, militaryMoraleDelta: -3 },
    // Mid-arc choices
    establish_veterans_guild:  { militaryCasteSatDelta: +3, commonerSatDelta: +2, treasuryDelta: -20, stabilityDelta: +2 },
    conscript_into_civic_works: { militaryCasteSatDelta: -1, regionDevelopmentDelta: +3, treasuryDelta: -15, commonerSatDelta: +1 },
    suppress_veteran_leaders:  { militaryCasteSatDelta: -4, stabilityDelta: -3, espionageNetworkDelta: +3, commonerSatDelta: -2 },
  },

  // ============================================================
  // TradeEcon 1 — The Silk Road
  // ============================================================
  sl_exp_silk_road: {
    // Opening choices
    fund_royal_trade_expedition: { treasuryDelta: -40, merchantSatDelta: +3, commonerSatDelta: +1, espionageNetworkDelta: +2 },
    charter_merchant_venture:    { treasuryDelta: -15, merchantSatDelta: +4, nobilitySatDelta: -2, commonerSatDelta: +1 },
    decline_route_proposal:      { merchantSatDelta: -4, stabilityDelta: +1, commonerSatDelta: -1, treasuryDelta: +5 },
    // Mid-arc choices
    build_caravanserai_network:  { treasuryDelta: -35, merchantSatDelta: +3, regionDevelopmentDelta: +3, commonerSatDelta: +2 },
    impose_trade_tariffs:        { treasuryDelta: +30, merchantSatDelta: -3, nobilitySatDelta: +2, commonerSatDelta: -1 },
    militarize_the_route:        { militaryReadinessDelta: +3, treasuryDelta: -25, merchantSatDelta: -2, militaryCasteSatDelta: +2 },
  },

  // ============================================================
  // TradeEcon 2 — The Currency Crisis
  // ============================================================
  sl_exp_currency_crisis: {
    // Opening choices
    ban_foreign_coinage:    { merchantSatDelta: -4, stabilityDelta: +2, treasuryDelta: -10, commonerSatDelta: -2 },
    mint_new_royal_currency: { treasuryDelta: -35, merchantSatDelta: +2, stabilityDelta: +3, nobilitySatDelta: +1 },
    allow_market_correction: { merchantSatDelta: -2, commonerSatDelta: -3, stabilityDelta: -2, treasuryDelta: +10 },
    // Mid-arc choices
    establish_royal_exchange:      { treasuryDelta: -30, merchantSatDelta: +4, stabilityDelta: +3, commonerSatDelta: +1 },
    seize_foreign_merchant_reserves: { merchantSatDelta: -5, treasuryDelta: +40, stabilityDelta: -3, nobilitySatDelta: +2 },
    negotiate_currency_treaty:     { treasuryDelta: -15, stabilityDelta: +2, merchantSatDelta: +2, espionageNetworkDelta: +2 },
  },

  // ============================================================
  // Discovery 1 — The Ancient Library
  // ============================================================
  sl_exp_ancient_library: {
    // Opening choices
    fund_full_excavation_library: { treasuryDelta: -40, culturalCohesionDelta: +3, clergySatDelta: -1, commonerSatDelta: +1 },
    send_scholars_quietly:        { treasuryDelta: -15, espionageNetworkDelta: +4, culturalCohesionDelta: +1, clergySatDelta: -2 },
    seal_the_site:                { clergySatDelta: +3, culturalCohesionDelta: -2, commonerSatDelta: -1, stabilityDelta: +1 },
    // Mid-arc choices
    publish_findings_openly:     { culturalCohesionDelta: +4, clergySatDelta: -3, commonerSatDelta: +3, heterodoxyDelta: +3 },
    restrict_to_royal_scholars:  { espionageNetworkDelta: +3, nobilitySatDelta: +2, commonerSatDelta: -2, treasuryDelta: -15 },
    weaponize_lost_knowledge:    { militaryReadinessDelta: +4, espionageNetworkDelta: +3, clergySatDelta: -4, stabilityDelta: -2 },
  },

  // ============================================================
  // Discovery 2 — The Cartographers' Guild
  // ============================================================
  sl_exp_cartographers_guild: {
    // Opening choices
    sponsor_mapping_expedition: { treasuryDelta: -30, merchantSatDelta: +2, espionageNetworkDelta: +3, commonerSatDelta: +1 },
    claim_territory_by_decree:  { militaryCasteSatDelta: +2, nobilitySatDelta: +2, treasuryDelta: -15, commonerSatDelta: -2 },
    sell_maps_to_merchants:     { treasuryDelta: +25, merchantSatDelta: +3, militaryCasteSatDelta: -2, espionageNetworkDelta: -2 },
    // Mid-arc choices
    establish_frontier_outpost:  { treasuryDelta: -30, militaryReadinessDelta: +3, regionDevelopmentDelta: +3, commonerSatDelta: +1 },
    negotiate_shared_borders:    { stabilityDelta: +3, merchantSatDelta: +2, militaryCasteSatDelta: -2, treasuryDelta: -10 },
    fortify_and_annex:           { militaryReadinessDelta: +4, treasuryDelta: -35, commonerSatDelta: -2, stabilityDelta: -2 },
  },

  // ============================================================
  // Cultural 1 — The Bards' Rebellion
  // ============================================================
  sl_exp_bards_rebellion: {
    // Opening choices
    ban_seditious_songs:       { commonerSatDelta: -4, clergySatDelta: +2, stabilityDelta: +1, culturalCohesionDelta: -2 },
    commission_counter_ballads: { treasuryDelta: -20, culturalCohesionDelta: +2, commonerSatDelta: +1, nobilitySatDelta: +2 },
    invite_bards_to_court:     { commonerSatDelta: +3, nobilitySatDelta: -2, culturalCohesionDelta: +1, treasuryDelta: -15 },
    // Mid-arc choices
    establish_royal_theater:      { treasuryDelta: -30, culturalCohesionDelta: +4, commonerSatDelta: +2, nobilitySatDelta: +1 },
    arrest_ringleaders:           { commonerSatDelta: -5, stabilityDelta: -2, espionageNetworkDelta: +3, nobilitySatDelta: +2 },
    channel_into_reform_movement: { commonerSatDelta: +3, nobilitySatDelta: -3, stabilityDelta: -1, culturalCohesionDelta: +2 },
  },

  // ============================================================
  // Cultural 2 — The Builder's Vision
  // ============================================================
  sl_exp_builders_vision: {
    // Opening choices
    approve_grand_monument:     { treasuryDelta: -40, culturalCohesionDelta: +4, commonerSatDelta: +2, nobilitySatDelta: +3 },
    redirect_to_infrastructure: { treasuryDelta: -25, regionDevelopmentDelta: +3, commonerSatDelta: +3, merchantSatDelta: +2 },
    reject_as_vanity_project:   { treasuryDelta: +5, commonerSatDelta: -1, nobilitySatDelta: -2, culturalCohesionDelta: -2 },
    // Mid-arc choices
    expand_scope_with_foreign_artisans: { treasuryDelta: -35, culturalCohesionDelta: -2, merchantSatDelta: +3, regionDevelopmentDelta: +3 },
    scale_back_to_essentials:           { treasuryDelta: +15, commonerSatDelta: +1, nobilitySatDelta: -2, stabilityDelta: +2 },
    conscript_labor_force:              { commonerSatDelta: -5, treasuryDelta: +20, regionDevelopmentDelta: +2, stabilityDelta: -3 },
  },
};

/**
 * Path-dependent resolution effects for expansion storylines.
 * Maps storylineDefinitionId -> mid-arc choiceId -> MechanicalEffectDelta.
 * Applied when a storyline reaches its resolution branch.
 * These are larger magnitude than branch effects (storylines are major arcs).
 */
export const EXPANSION_STORYLINE_RESOLUTION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Political 1 — The Council of Lords
  // ============================================================
  sl_exp_council_of_lords: {
    grant_legislative_powers:      { nobilitySatDelta: +7, commonerSatDelta: -4, stabilityDelta: +5, treasuryDelta: -30 },
    stack_council_with_loyalists:  { espionageNetworkDelta: +6, nobilitySatDelta: -3, stabilityDelta: +3, treasuryDelta: -40 },
    dissolve_council_by_force:     { nobilitySatDelta: -8, militaryCasteSatDelta: +4, stabilityDelta: -6, commonerSatDelta: -3 },
  },

  // ============================================================
  // Political 2 — The Foreign Bride
  // ============================================================
  sl_exp_foreign_bride: {
    embrace_foreign_customs:         { culturalCohesionDelta: -6, merchantSatDelta: +5, treasuryDelta: +40, commonerSatDelta: +4 },
    insist_on_assimilation:          { culturalCohesionDelta: +6, clergySatDelta: +4, stabilityDelta: +4, commonerSatDelta: -2 },
    exploit_alliance_for_trade:      { merchantSatDelta: +6, treasuryDelta: +50, nobilitySatDelta: -5, stabilityDelta: -2 },
  },

  // ============================================================
  // Religious 1 — The Relic Discovery
  // ============================================================
  sl_exp_relic_discovery: {
    declare_miraculous_origin: { faithDelta: +7, clergySatDelta: +5, commonerSatDelta: +4, heterodoxyDelta: -4 },
    share_relic_with_neighbor: { faithDelta: +3, stabilityDelta: +5, clergySatDelta: +2, treasuryDelta: +20 },
    suppress_competing_claims: { clergySatDelta: +3, espionageNetworkDelta: +5, stabilityDelta: -3, commonerSatDelta: -4 },
  },

  // ============================================================
  // Religious 2 — The Witch Trials
  // ============================================================
  sl_exp_witch_trials: {
    expand_trials_to_nobility:   { nobilitySatDelta: -8, clergySatDelta: +5, espionageNetworkDelta: +5, stabilityDelta: -5 },
    pardon_the_accused:          { commonerSatDelta: +7, clergySatDelta: -5, faithDelta: -3, stabilityDelta: +4 },
    redirect_fervor_outward:     { militaryCasteSatDelta: +4, clergySatDelta: +3, stabilityDelta: +3, treasuryDelta: -40 },
  },

  // ============================================================
  // Military 1 — The Mercenary Company
  // ============================================================
  sl_exp_mercenary_company: {
    integrate_into_standing_army: { militaryForceSizeDelta: +6, militaryCasteSatDelta: -4, militaryMoraleDelta: -3, treasuryDelta: -30 },
    deploy_to_border_garrison:    { militaryReadinessDelta: +7, regionConditionDelta: +4, treasuryDelta: -25, commonerSatDelta: +2 },
    terminate_contract_early:     { treasuryDelta: -50, stabilityDelta: -4, militaryForceSizeDelta: -4, commonerSatDelta: -3 },
  },

  // ============================================================
  // Military 2 — The Veterans' March
  // ============================================================
  sl_exp_veterans_march: {
    establish_veterans_guild:  { militaryCasteSatDelta: +6, commonerSatDelta: +4, stabilityDelta: +5, treasuryDelta: -40 },
    conscript_into_civic_works: { regionDevelopmentDelta: +6, militaryCasteSatDelta: -2, treasuryDelta: -20, commonerSatDelta: +3 },
    suppress_veteran_leaders:  { militaryCasteSatDelta: -7, stabilityDelta: -5, espionageNetworkDelta: +5, militaryMoraleDelta: -4 },
  },

  // ============================================================
  // TradeEcon 1 — The Silk Road
  // ============================================================
  sl_exp_silk_road: {
    build_caravanserai_network:  { treasuryDelta: +50, merchantSatDelta: +5, regionDevelopmentDelta: +5, commonerSatDelta: +3 },
    impose_trade_tariffs:        { treasuryDelta: +60, merchantSatDelta: -5, nobilitySatDelta: +4, commonerSatDelta: -2 },
    militarize_the_route:        { militaryReadinessDelta: +6, treasuryDelta: -40, merchantSatDelta: -3, militaryCasteSatDelta: +4 },
  },

  // ============================================================
  // TradeEcon 2 — The Currency Crisis
  // ============================================================
  sl_exp_currency_crisis: {
    establish_royal_exchange:      { treasuryDelta: +40, merchantSatDelta: +6, stabilityDelta: +5, commonerSatDelta: +3 },
    seize_foreign_merchant_reserves: { merchantSatDelta: -7, treasuryDelta: +60, stabilityDelta: -4, nobilitySatDelta: +3 },
    negotiate_currency_treaty:     { stabilityDelta: +5, merchantSatDelta: +4, treasuryDelta: +20, espionageNetworkDelta: +3 },
  },

  // ============================================================
  // Discovery 1 — The Ancient Library
  // ============================================================
  sl_exp_ancient_library: {
    publish_findings_openly:     { culturalCohesionDelta: +6, commonerSatDelta: +5, heterodoxyDelta: +5, clergySatDelta: -4 },
    restrict_to_royal_scholars:  { espionageNetworkDelta: +6, nobilitySatDelta: +4, commonerSatDelta: -4, treasuryDelta: -20 },
    weaponize_lost_knowledge:    { militaryReadinessDelta: +7, espionageNetworkDelta: +5, clergySatDelta: -6, stabilityDelta: -3 },
  },

  // ============================================================
  // Discovery 2 — The Cartographers' Guild
  // ============================================================
  sl_exp_cartographers_guild: {
    establish_frontier_outpost:  { regionDevelopmentDelta: +6, militaryReadinessDelta: +4, treasuryDelta: -40, commonerSatDelta: +3 },
    negotiate_shared_borders:    { stabilityDelta: +6, merchantSatDelta: +4, treasuryDelta: +20, militaryCasteSatDelta: -3 },
    fortify_and_annex:           { militaryReadinessDelta: +7, treasuryDelta: -50, stabilityDelta: -4, commonerSatDelta: -3 },
  },

  // ============================================================
  // Cultural 1 — The Bards' Rebellion
  // ============================================================
  sl_exp_bards_rebellion: {
    establish_royal_theater:      { culturalCohesionDelta: +6, commonerSatDelta: +4, treasuryDelta: -40, nobilitySatDelta: +3 },
    arrest_ringleaders:           { commonerSatDelta: -7, stabilityDelta: -4, espionageNetworkDelta: +5, nobilitySatDelta: +4 },
    channel_into_reform_movement: { commonerSatDelta: +6, nobilitySatDelta: -5, culturalCohesionDelta: +4, stabilityDelta: -2 },
  },

  // ============================================================
  // Cultural 2 — The Builder's Vision
  // ============================================================
  sl_exp_builders_vision: {
    expand_scope_with_foreign_artisans: { culturalCohesionDelta: -3, merchantSatDelta: +5, regionDevelopmentDelta: +6, treasuryDelta: -50 },
    scale_back_to_essentials:           { stabilityDelta: +5, commonerSatDelta: +3, treasuryDelta: +20, nobilitySatDelta: -3 },
    conscript_labor_force:              { commonerSatDelta: -7, regionDevelopmentDelta: +5, treasuryDelta: +30, stabilityDelta: -5 },
  },
};
