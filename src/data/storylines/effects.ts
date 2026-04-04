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
    launch_espionage_investigation: { espionageNetworkDelta: +5, nobilitySatDelta: -2, treasuryDelta: -25 },
    open_direct_negotiation:        { nobilitySatDelta: +3, stabilityDelta: +2, treasuryDelta: -15 },
    issue_public_condemnation:      { nobilitySatDelta: -4, commonerSatDelta: +2, stabilityDelta: -3 },
  },

  // ============================================================
  // Religious — The Prophet of the Waste
  // ============================================================
  sl_prophet_of_the_waste: {
    send_clergy_investigation: { clergySatDelta: +2, treasuryDelta: -20, heterodoxyDelta: -3 },
    declare_tolerance:         { heterodoxyDelta: +4, commonerSatDelta: +3, clergySatDelta: -3, culturalCohesionDelta: -2 },
    order_suppression:         { clergySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -3, heterodoxyDelta: -5 },
  },

  // ============================================================
  // Military — The Frozen March
  // ============================================================
  sl_frozen_march: {
    conduct_reconnaissance:    { espionageNetworkDelta: +6, militaryReadinessDelta: +3, treasuryDelta: -20 },
    dispatch_diplomatic_envoy: { stabilityDelta: +2, treasuryDelta: -15, nobilitySatDelta: +1 },
    begin_military_preparation: { militaryReadinessDelta: +8, militaryMoraleDelta: +3, treasuryDelta: -40, commonerSatDelta: -2 },
  },

  // ============================================================
  // TradeEcon — The Merchant King
  // ============================================================
  sl_merchant_king: {
    impose_regulatory_limits: { merchantSatDelta: -4, nobilitySatDelta: +3, stabilityDelta: +2 },
    accept_investment_offer:  { merchantSatDelta: +4, nobilitySatDelta: -3, treasuryDelta: +40 },
    await_and_observe:        { merchantSatDelta: +1, nobilitySatDelta: -1, stabilityDelta: -1 },
  },

  // ============================================================
  // Discovery — The Lost Expedition
  // ============================================================
  sl_lost_expedition: {
    dispatch_rescue_party: { treasuryDelta: -50, militaryReadinessDelta: -3, commonerSatDelta: +2 },
    await_further_word:    { commonerSatDelta: -1, stabilityDelta: -1 },
  },

  // ============================================================
  // Cultural — The Foreign Festival
  // ============================================================
  sl_foreign_festival: {
    embrace_cultural_exchange:  { culturalCohesionDelta: -4, merchantSatDelta: +3, commonerSatDelta: +2, treasuryDelta: +20 },
    permit_with_restrictions:   { culturalCohesionDelta: -1, merchantSatDelta: +1, stabilityDelta: +1 },
    restrict_foreign_practices: { culturalCohesionDelta: +3, merchantSatDelta: -3, clergySatDelta: +2, stabilityDelta: -1 },
  },
};

/**
 * Path-dependent resolution effects.
 * Maps storylineDefinitionId -> opening choiceId -> MechanicalEffectDelta.
 * Applied when a storyline reaches its resolution branch.
 * These are larger magnitude than branch effects (storylines are major arcs).
 */
export const STORYLINE_RESOLUTION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Political — The Pretender's Claim
  // ============================================================
  sl_pretenders_claim: {
    launch_espionage_investigation: { nobilitySatDelta: +5, stabilityDelta: +5, espionageNetworkDelta: +3 },
    open_direct_negotiation:        { nobilitySatDelta: +4, stabilityDelta: +3, treasuryDelta: -30 },
    issue_public_condemnation:      { commonerSatDelta: +5, nobilitySatDelta: -5, stabilityDelta: -2 },
  },

  // ============================================================
  // Religious — The Prophet of the Waste
  // ============================================================
  sl_prophet_of_the_waste: {
    send_clergy_investigation: { faithDelta: +6, clergySatDelta: +4, heterodoxyDelta: -5 },
    declare_tolerance:         { faithDelta: -3, culturalCohesionDelta: +4, commonerSatDelta: +4, heterodoxyDelta: +3 },
    order_suppression:         { faithDelta: +4, stabilityDelta: -4, commonerSatDelta: -3, heterodoxyDelta: -8 },
  },

  // ============================================================
  // Military — The Frozen March
  // ============================================================
  sl_frozen_march: {
    conduct_reconnaissance:     { militaryReadinessDelta: +10, espionageNetworkDelta: +8, stabilityDelta: +5 },
    dispatch_diplomatic_envoy:  { stabilityDelta: +4, treasuryDelta: -40, nobilitySatDelta: +3 },
    begin_military_preparation: { militaryReadinessDelta: +15, militaryMoraleDelta: +5, treasuryDelta: -60, commonerSatDelta: -3 },
  },

  // ============================================================
  // TradeEcon — The Merchant King
  // ============================================================
  sl_merchant_king: {
    impose_regulatory_limits: { nobilitySatDelta: +5, merchantSatDelta: -5, stabilityDelta: +4 },
    accept_investment_offer:  { merchantSatDelta: +6, nobilitySatDelta: -4, treasuryDelta: +60, stabilityDelta: -2 },
    await_and_observe:        { merchantSatDelta: +2, nobilitySatDelta: -2, stabilityDelta: -3 },
  },

  // ============================================================
  // Discovery — The Lost Expedition
  // ============================================================
  sl_lost_expedition: {
    dispatch_rescue_party: { treasuryDelta: +30, commonerSatDelta: +5, stabilityDelta: +4, culturalCohesionDelta: +3 },
    await_further_word:    { commonerSatDelta: -3, stabilityDelta: -2, culturalCohesionDelta: -2 },
  },

  // ============================================================
  // Cultural — The Foreign Festival
  // ============================================================
  sl_foreign_festival: {
    embrace_cultural_exchange:  { culturalCohesionDelta: -3, merchantSatDelta: +5, treasuryDelta: +30, commonerSatDelta: +3 },
    permit_with_restrictions:   { culturalCohesionDelta: +2, merchantSatDelta: +2, stabilityDelta: +3 },
    restrict_foreign_practices: { culturalCohesionDelta: +5, merchantSatDelta: -4, clergySatDelta: +3, faithDelta: +3 },
  },
};
