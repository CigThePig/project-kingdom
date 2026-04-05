// gameplay-blueprint.md §8 — Storyline Choice Mechanical Effects
// Branch point effects and path-dependent resolution effects.

import type { MechanicalEffectDelta } from '../../engine/types';

/**
 * Maps storylineDefinitionId -> choiceId -> MechanicalEffectDelta.
 * Applied when the player makes a branch point decision (opening or mid-arc).
 */
export const STORYLINE_CHOICE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Political — The Pretender's Claim
  // ============================================================
  sl_pretenders_claim: {
    // Opening choices
    launch_espionage_investigation: { espionageNetworkDelta: +5, nobilitySatDelta: -2, treasuryDelta: -25 },
    open_direct_negotiation:        { nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -15 },
    issue_public_condemnation:      { nobilitySatDelta: -4, commonerSatDelta: +2, stabilityDelta: -3 },
    // Mid-arc choices
    expose_foreign_backing:   { espionageNetworkDelta: +4, nobilitySatDelta: +2, stabilityDelta: +3, treasuryDelta: -20 },
    offer_minor_title:        { nobilitySatDelta: +2, commonerSatDelta: -1, treasuryDelta: -15 },
    rally_loyalist_nobles:    { nobilitySatDelta: +3, militaryCasteSatDelta: +1, stabilityDelta: +2, treasuryDelta: -10 },
  },

  // ============================================================
  // Religious — The Prophet of the Waste
  // ============================================================
  sl_prophet_of_the_waste: {
    // Opening choices
    send_clergy_investigation: { clergySatDelta: +2, treasuryDelta: -20, heterodoxyDelta: -3 },
    declare_tolerance:         { heterodoxyDelta: +4, commonerSatDelta: +3, clergySatDelta: -3, culturalCohesionDelta: -2 },
    order_suppression:         { clergySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -3, heterodoxyDelta: -5 },
    // Mid-arc choices
    invite_prophet_to_capital: { heterodoxyDelta: +3, commonerSatDelta: +4, clergySatDelta: -4, faithDelta: -2 },
    integrate_teachings:       { heterodoxyDelta: +2, faithDelta: +2, clergySatDelta: -1, culturalCohesionDelta: +2 },
    exile_the_prophet:         { heterodoxyDelta: -4, commonerSatDelta: -3, clergySatDelta: +3, stabilityDelta: -2 },
  },

  // ============================================================
  // Military — The Frozen March
  // ============================================================
  sl_frozen_march: {
    // Opening choices
    conduct_reconnaissance:    { espionageNetworkDelta: +6, militaryReadinessDelta: +3, treasuryDelta: -20 },
    dispatch_diplomatic_envoy: { stabilityDelta: +2, treasuryDelta: -15, nobilitySatDelta: +1 },
    begin_military_preparation: { militaryReadinessDelta: +8, militaryMoraleDelta: +3, treasuryDelta: -40, commonerSatDelta: -2 },
    // Mid-arc choices
    fortify_mountain_passes:    { militaryReadinessDelta: +5, treasuryDelta: -30, regionConditionDelta: +3 },
    seek_allied_reinforcements: { treasuryDelta: -25, nobilitySatDelta: +2, militaryReadinessDelta: +3 },
    launch_preemptive_strike:   { militaryReadinessDelta: -5, militaryMoraleDelta: +4, commonerSatDelta: -3, treasuryDelta: -35 },
  },

  // ============================================================
  // TradeEcon — The Merchant King
  // ============================================================
  sl_merchant_king: {
    // Opening choices
    impose_regulatory_limits: { merchantSatDelta: -4, nobilitySatDelta: +3, stabilityDelta: +2 },
    accept_investment_offer:  { merchantSatDelta: +4, nobilitySatDelta: -3, treasuryDelta: +40 },
    await_and_observe:        { merchantSatDelta: +1, nobilitySatDelta: -1, stabilityDelta: -1 },
    // Mid-arc choices
    grant_noble_title:              { merchantSatDelta: +3, nobilitySatDelta: -4, commonerSatDelta: -1, stabilityDelta: +1 },
    seize_merchant_assets:          { merchantSatDelta: -6, nobilitySatDelta: +4, treasuryDelta: +50, stabilityDelta: -3 },
    broker_merchant_noble_alliance: { merchantSatDelta: +2, nobilitySatDelta: +1, stabilityDelta: +3, treasuryDelta: -20 },
  },

  // ============================================================
  // Discovery — The Lost Expedition
  // ============================================================
  sl_lost_expedition: {
    // Opening choices
    dispatch_rescue_party: { treasuryDelta: -50, militaryReadinessDelta: -3, commonerSatDelta: +2 },
    await_further_word:    { commonerSatDelta: -1, stabilityDelta: -1 },
    send_scout_riders:     { treasuryDelta: -20, espionageNetworkDelta: +3, militaryReadinessDelta: -1 },
    // Mid-arc choices
    fund_full_excavation:  { treasuryDelta: -60, culturalCohesionDelta: +3, clergySatDelta: +2 },
    secure_and_document:   { treasuryDelta: -25, culturalCohesionDelta: +2, espionageNetworkDelta: +2 },
    abandon_the_site:      { commonerSatDelta: -2, culturalCohesionDelta: -2 },
  },

  // ============================================================
  // Cultural — The Foreign Festival
  // ============================================================
  sl_foreign_festival: {
    // Opening choices
    embrace_cultural_exchange:  { culturalCohesionDelta: -4, merchantSatDelta: +3, commonerSatDelta: +2, treasuryDelta: +20 },
    permit_with_restrictions:   { culturalCohesionDelta: -1, merchantSatDelta: +1, stabilityDelta: +1 },
    restrict_foreign_practices: { culturalCohesionDelta: +3, merchantSatDelta: -3, clergySatDelta: +2, stabilityDelta: -1 },
    // Mid-arc choices
    establish_cultural_quarter:  { culturalCohesionDelta: -3, merchantSatDelta: +4, treasuryDelta: +25, commonerSatDelta: +2 },
    host_synthesis_festival:     { culturalCohesionDelta: +2, faithDelta: +2, commonerSatDelta: +3, treasuryDelta: -30 },
    reassert_traditional_values: { culturalCohesionDelta: +4, clergySatDelta: +3, merchantSatDelta: -4, faithDelta: +3 },
  },

  // ============================================================
  // TradeEcon 2 — The Merchant's Rebellion
  // ============================================================
  sl_merchants_rebellion: {
    negotiate_guild_charter:   { merchantSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +2, treasuryDelta: -20 },
    crush_the_guild:           { merchantSatDelta: -6, nobilitySatDelta: +4, militaryCasteSatDelta: +2, stabilityDelta: -3 },
    co_opt_guild_leaders:      { merchantSatDelta: +1, nobilitySatDelta: -1, treasuryDelta: -30, espionageNetworkDelta: +3 },
    grant_trade_monopoly:      { merchantSatDelta: +5, commonerSatDelta: -3, nobilitySatDelta: -4, treasuryDelta: +30 },
    impose_royal_oversight:    { merchantSatDelta: -3, nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -15 },
    pit_factions_against_each_other: { merchantSatDelta: -2, stabilityDelta: -2, espionageNetworkDelta: +5 },
  },

  // ============================================================
  // Religious 2 — The Holy War
  // ============================================================
  sl_holy_war: {
    defensive_stance:          { militaryReadinessDelta: +5, faithDelta: +3, treasuryDelta: -30, commonerSatDelta: -2 },
    launch_counter_crusade:    { militaryReadinessDelta: +8, militaryMoraleDelta: +5, treasuryDelta: -60, faithDelta: +5, commonerSatDelta: -4 },
    seek_diplomatic_peace:     { stabilityDelta: +3, treasuryDelta: -20, clergySatDelta: -3, nobilitySatDelta: +2 },
    rally_faithful_defenders:  { faithDelta: +4, militaryCasteSatDelta: +4, clergySatDelta: +3, treasuryDelta: -40 },
    forge_interfaith_alliance: { faithDelta: -3, culturalCohesionDelta: +3, stabilityDelta: +3, heterodoxyDelta: +4 },
    scorched_earth_defense:    { regionConditionDelta: -8, militaryReadinessDelta: +6, commonerSatDelta: -5, stabilityDelta: -3 },
  },

  // ============================================================
  // Political 2 — The Prodigal Prince
  // ============================================================
  sl_prodigal_prince: {
    welcome_with_caution:   { nobilitySatDelta: +2, commonerSatDelta: +3, stabilityDelta: +1, treasuryDelta: -20 },
    investigate_claims:     { espionageNetworkDelta: +5, nobilitySatDelta: -1, treasuryDelta: -25 },
    denounce_as_impostor:   { nobilitySatDelta: -3, commonerSatDelta: -2, stabilityDelta: -2 },
    offer_advisory_role:    { nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -15 },
    confront_foreign_backers: { espionageNetworkDelta: +4, nobilitySatDelta: +2, treasuryDelta: -30, stabilityDelta: +1 },
    appeal_to_popular_opinion: { commonerSatDelta: +4, nobilitySatDelta: -3, stabilityDelta: -1 },
  },

  // ============================================================
  // Discovery 2 — The Plague Ships
  // ============================================================
  sl_plague_ships: {
    quarantine_the_harbor:  { merchantSatDelta: -4, commonerSatDelta: -2, treasuryDelta: -20, stabilityDelta: +2 },
    accept_the_cargo:       { merchantSatDelta: +4, treasuryDelta: +30, commonerSatDelta: -3, regionConditionDelta: -3 },
    burn_the_ships:         { merchantSatDelta: -5, treasuryDelta: -15, stabilityDelta: +1, faithDelta: +2 },
    isolate_and_treat:      { treasuryDelta: -40, commonerSatDelta: +3, clergySatDelta: +2 },
    distribute_remedies:    { treasuryDelta: -30, commonerSatDelta: +4, merchantSatDelta: +2 },
    sacrifice_the_district: { commonerSatDelta: -6, regionConditionDelta: -5, stabilityDelta: +3 },
  },

  // ============================================================
  // Military 2 — The Great Tournament
  // ============================================================
  sl_great_tournament: {
    diplomatic_showcase:      { nobilitySatDelta: +3, treasuryDelta: -40, stabilityDelta: +2 },
    military_demonstration:   { militaryCasteSatDelta: +4, militaryMoraleDelta: +3, treasuryDelta: -35, nobilitySatDelta: +2 },
    cultural_celebration:     { commonerSatDelta: +4, culturalCohesionDelta: +3, treasuryDelta: -30 },
    exploit_diplomatic_moment: { nobilitySatDelta: +2, stabilityDelta: +2, treasuryDelta: -20 },
    handle_tournament_incident: { militaryCasteSatDelta: +2, stabilityDelta: -2, nobilitySatDelta: -1 },
    host_grand_feast:         { commonerSatDelta: +3, merchantSatDelta: +2, treasuryDelta: -50, faithDelta: +2 },
  },

  // ============================================================
  // Cultural 2 — The Starving Winter
  // ============================================================
  sl_starving_winter: {
    ration_harshly:            { commonerSatDelta: -5, foodDelta: +15, stabilityDelta: +1 },
    seek_foreign_aid:          { treasuryDelta: -40, foodDelta: +20, merchantSatDelta: +2 },
    sacrifice_military_stores: { militaryCasteSatDelta: -4, foodDelta: +15, militaryMoraleDelta: -3 },
    manage_refugee_crisis:     { commonerSatDelta: +3, treasuryDelta: -25, stabilityDelta: +2 },
    tax_the_wealthy:           { nobilitySatDelta: -5, merchantSatDelta: -3, treasuryDelta: +40, commonerSatDelta: +2 },
    abandon_outer_settlements: { regionConditionDelta: -5, commonerSatDelta: -4, stabilityDelta: -3, foodDelta: +10 },
  },
};

/**
 * Path-dependent resolution effects.
 * Maps storylineDefinitionId -> mid-arc choiceId -> MechanicalEffectDelta.
 * Applied when a storyline reaches its resolution branch.
 * These are larger magnitude than branch effects (storylines are major arcs).
 */
export const STORYLINE_RESOLUTION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Political — The Pretender's Claim
  // ============================================================
  sl_pretenders_claim: {
    expose_foreign_backing:   { nobilitySatDelta: +5, stabilityDelta: +6, espionageNetworkDelta: +5 },
    offer_minor_title:        { nobilitySatDelta: +4, stabilityDelta: +3, treasuryDelta: -30 },
    rally_loyalist_nobles:    { nobilitySatDelta: +6, commonerSatDelta: -2, stabilityDelta: +4, militaryCasteSatDelta: +2 },
  },

  // ============================================================
  // Religious — The Prophet of the Waste
  // ============================================================
  sl_prophet_of_the_waste: {
    invite_prophet_to_capital: { faithDelta: -4, culturalCohesionDelta: +5, commonerSatDelta: +5, heterodoxyDelta: +5 },
    integrate_teachings:       { faithDelta: +4, culturalCohesionDelta: +4, clergySatDelta: +2, heterodoxyDelta: -3 },
    exile_the_prophet:         { faithDelta: +5, clergySatDelta: +4, commonerSatDelta: -4, heterodoxyDelta: -6 },
  },

  // ============================================================
  // Military — The Frozen March
  // ============================================================
  sl_frozen_march: {
    fortify_mountain_passes:    { militaryReadinessDelta: +12, stabilityDelta: +5, regionConditionDelta: +4 },
    seek_allied_reinforcements: { stabilityDelta: +4, nobilitySatDelta: +3, treasuryDelta: -40, militaryReadinessDelta: +6 },
    launch_preemptive_strike:   { militaryReadinessDelta: +8, militaryMoraleDelta: +6, treasuryDelta: -60, commonerSatDelta: -4, stabilityDelta: -2 },
  },

  // ============================================================
  // TradeEcon — The Merchant King
  // ============================================================
  sl_merchant_king: {
    grant_noble_title:              { merchantSatDelta: +5, nobilitySatDelta: -5, stabilityDelta: +2, treasuryDelta: +30 },
    seize_merchant_assets:          { merchantSatDelta: -8, nobilitySatDelta: +6, treasuryDelta: +80, stabilityDelta: -4 },
    broker_merchant_noble_alliance: { merchantSatDelta: +4, nobilitySatDelta: +3, stabilityDelta: +5, treasuryDelta: +20 },
  },

  // ============================================================
  // Discovery — The Lost Expedition
  // ============================================================
  sl_lost_expedition: {
    fund_full_excavation: { treasuryDelta: +40, culturalCohesionDelta: +5, commonerSatDelta: +4, stabilityDelta: +3 },
    secure_and_document:  { culturalCohesionDelta: +3, espionageNetworkDelta: +4, stabilityDelta: +2 },
    abandon_the_site:     { commonerSatDelta: -3, stabilityDelta: -3, culturalCohesionDelta: -3 },
  },

  // ============================================================
  // Cultural — The Foreign Festival
  // ============================================================
  sl_foreign_festival: {
    establish_cultural_quarter:  { culturalCohesionDelta: -4, merchantSatDelta: +6, treasuryDelta: +40, commonerSatDelta: +3 },
    host_synthesis_festival:     { culturalCohesionDelta: +4, faithDelta: +3, commonerSatDelta: +4, stabilityDelta: +3 },
    reassert_traditional_values: { culturalCohesionDelta: +6, clergySatDelta: +4, merchantSatDelta: -5, faithDelta: +4 },
  },

  // ============================================================
  // TradeEcon 2 — The Merchant's Rebellion
  // ============================================================
  sl_merchants_rebellion: {
    grant_trade_monopoly:      { merchantSatDelta: +8, commonerSatDelta: -5, nobilitySatDelta: -6, treasuryDelta: +50, stabilityDelta: -2 },
    impose_royal_oversight:    { merchantSatDelta: -4, nobilitySatDelta: +5, stabilityDelta: +5, treasuryDelta: +20 },
    pit_factions_against_each_other: { merchantSatDelta: -3, stabilityDelta: -4, espionageNetworkDelta: +8, treasuryDelta: +30 },
  },

  // ============================================================
  // Religious 2 — The Holy War
  // ============================================================
  sl_holy_war: {
    rally_faithful_defenders:  { faithDelta: +8, militaryCasteSatDelta: +6, clergySatDelta: +5, stabilityDelta: +4, treasuryDelta: -50 },
    forge_interfaith_alliance: { faithDelta: -2, culturalCohesionDelta: +6, stabilityDelta: +5, heterodoxyDelta: +6, commonerSatDelta: +3 },
    scorched_earth_defense:    { regionConditionDelta: -12, militaryReadinessDelta: +10, stabilityDelta: -5, commonerSatDelta: -6, faithDelta: +4 },
  },

  // ============================================================
  // Political 2 — The Prodigal Prince
  // ============================================================
  sl_prodigal_prince: {
    offer_advisory_role:    { nobilitySatDelta: +5, stabilityDelta: +4, commonerSatDelta: +3, treasuryDelta: -20 },
    confront_foreign_backers: { espionageNetworkDelta: +8, nobilitySatDelta: +4, stabilityDelta: +3, treasuryDelta: -40 },
    appeal_to_popular_opinion: { commonerSatDelta: +6, nobilitySatDelta: -5, stabilityDelta: +2, faithDelta: +2 },
  },

  // ============================================================
  // Discovery 2 — The Plague Ships
  // ============================================================
  sl_plague_ships: {
    isolate_and_treat:      { commonerSatDelta: +5, clergySatDelta: +4, stabilityDelta: +3, treasuryDelta: -50 },
    distribute_remedies:    { commonerSatDelta: +6, merchantSatDelta: +4, treasuryDelta: -40, stabilityDelta: +2 },
    sacrifice_the_district: { commonerSatDelta: -8, stabilityDelta: +5, regionConditionDelta: -8, merchantSatDelta: +3 },
  },

  // ============================================================
  // Military 2 — The Great Tournament
  // ============================================================
  sl_great_tournament: {
    exploit_diplomatic_moment: { nobilitySatDelta: +5, stabilityDelta: +4, treasuryDelta: -30, militaryCasteSatDelta: +3 },
    handle_tournament_incident: { militaryCasteSatDelta: +4, stabilityDelta: +2, nobilitySatDelta: -2, militaryMoraleDelta: +5 },
    host_grand_feast:         { commonerSatDelta: +5, merchantSatDelta: +4, faithDelta: +3, culturalCohesionDelta: +4, treasuryDelta: -60 },
  },

  // ============================================================
  // Cultural 2 — The Starving Winter
  // ============================================================
  sl_starving_winter: {
    manage_refugee_crisis:     { commonerSatDelta: +6, stabilityDelta: +4, faithDelta: +3, treasuryDelta: -40 },
    tax_the_wealthy:           { nobilitySatDelta: -8, merchantSatDelta: -5, treasuryDelta: +60, commonerSatDelta: +4, stabilityDelta: -2 },
    abandon_outer_settlements: { regionConditionDelta: -10, commonerSatDelta: -6, stabilityDelta: -5, foodDelta: +20, treasuryDelta: +30 },
  },
};
