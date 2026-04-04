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
};
