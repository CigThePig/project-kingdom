import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_REGION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- 1. Provincial Autonomy Dispute (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_reg_autonomy_dispute: {
    grant_limited_autonomy:    { stabilityDelta: +3, nobilitySatDelta: +4, commonerSatDelta: +2, regionDevelopmentDelta: +4, treasuryDelta: -30 },
    reassert_central_control:  { stabilityDelta: -3, nobilitySatDelta: -4, militaryReadinessDelta: +3, regionConditionDelta: -3, treasuryDelta: +20 },
    send_mediator:             { stabilityDelta: +1, nobilitySatDelta: +1, treasuryDelta: -15, regionConditionDelta: +2 },
  },

  // --- 2. Resource Discovery (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_reg_resource_discovery: {
    crown_extraction:          { treasuryDelta: +25, regionConditionDelta: -3, commonerSatDelta: -2, regionDevelopmentDelta: +2 },
    local_development:         { regionDevelopmentDelta: +5, commonerSatDelta: +3, treasuryDelta: -15, regionConditionDelta: +2 },
    survey_further:            { regionDevelopmentDelta: +1, treasuryDelta: -5 },
  },

  // --- 3. Trade Route Disruption (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_reg_trade_disruption: {
    military_escort:           { treasuryDelta: -60, militaryReadinessDelta: -4, merchantSatDelta: +5, regionDevelopmentDelta: +3, regionConditionDelta: +2, espionageNetworkDelta: +1 },
    negotiate_safe_passage:    { treasuryDelta: -30, merchantSatDelta: +3, diplomacyDeltas: { neighbor_valdris: +5 }, regionConditionDelta: +1, espionageNetworkDelta: -2 },
    reroute_trade:             { treasuryDelta: -40, merchantSatDelta: -2, regionDevelopmentDelta: +5, regionConditionDelta: -2, espionageNetworkDelta: -3 },
  },

  // --- 4. Infrastructure Proposal (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_reg_infrastructure_proposal: {
    fund_road_network:         { treasuryDelta: -50, regionDevelopmentDelta: +6, merchantSatDelta: +3, commonerSatDelta: +2, regionConditionDelta: +3 },
    build_regional_market:     { treasuryDelta: -30, regionDevelopmentDelta: +4, merchantSatDelta: +5, commonerSatDelta: +1, nobilitySatDelta: -2 },
    defer_construction:        { merchantSatDelta: -2, commonerSatDelta: -1, regionConditionDelta: -1, treasuryDelta: +10 },
  },

  // --- 5. Regional Festival (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_reg_festival: {
    royal_patronage:           { treasuryDelta: -20, commonerSatDelta: +3, regionConditionDelta: +2, faithDelta: +1, nobilitySatDelta: +1 },
    attend_personally:         { commonerSatDelta: +3, nobilitySatDelta: -1, stabilityDelta: +2, regionConditionDelta: +1 },
    send_regards:              { commonerSatDelta: +1, regionConditionDelta: +1 },
  },

  // --- 6. Provincial Governor Corruption (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_reg_governor_corruption: {
    remove_governor:           { stabilityDelta: +4, commonerSatDelta: +5, nobilitySatDelta: -6, regionDevelopmentDelta: +3, treasuryDelta: -20, regionConditionDelta: +3 },
    demand_restitution:        { treasuryDelta: +40, nobilitySatDelta: -4, commonerSatDelta: +3, regionConditionDelta: +2, regionDevelopmentDelta: +1 },
    issue_warning:             { nobilitySatDelta: +2, commonerSatDelta: -4, regionConditionDelta: -3, stabilityDelta: -2, treasuryDelta: -5 },
  },

  // --- 7. Border Province Tensions (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_reg_border_tensions: {
    fortify_border:            { treasuryDelta: -70, militaryReadinessDelta: +5, regionDevelopmentDelta: +4, militaryCasteSatDelta: +3, commonerSatDelta: -2, regionConditionDelta: +3 },
    diplomatic_reassurance:    { treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: +5, neighbor_valdris: +5 }, militaryCasteSatDelta: -3, regionConditionDelta: +1, militaryMoraleDelta: +2 },
    increase_patrols:          { militaryReadinessDelta: +3, treasuryDelta: -30, regionConditionDelta: +2, militaryCasteSatDelta: +1, commonerSatDelta: -1 },
  },

  // --- 8. Regional Specialization (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_reg_specialization: {
    encourage_artisan_quarter: { treasuryDelta: -35, merchantSatDelta: +4, regionDevelopmentDelta: +5, commonerSatDelta: +2, regionConditionDelta: +2 },
    develop_agricultural_hub:  { treasuryDelta: -25, foodDelta: +20, commonerSatDelta: +3, regionDevelopmentDelta: +4, merchantSatDelta: -2 },
    let_market_decide:         { merchantSatDelta: +1, regionDevelopmentDelta: +1, regionConditionDelta: -1 },
  },

  // --- 9. Local Hero Emerges (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_reg_local_hero: {
    honor_at_court:            { commonerSatDelta: +3, nobilitySatDelta: -1, stabilityDelta: +2, regionConditionDelta: +2, treasuryDelta: -10 },
    appoint_local_office:      { commonerSatDelta: +2, regionDevelopmentDelta: +3, nobilitySatDelta: -2, regionConditionDelta: +1 },
    acknowledge_from_afar:     { commonerSatDelta: +1, regionConditionDelta: +1 },
  },

  // --- 10. Provincial Development Rivalry (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_reg_development_rivalry: {
    favor_petitioning_province: { regionDevelopmentDelta: +5, regionConditionDelta: +3, nobilitySatDelta: -3, stabilityDelta: -2, treasuryDelta: -25 },
    distribute_equally:         { regionDevelopmentDelta: +3, regionConditionDelta: +2, treasuryDelta: -40, stabilityDelta: +3, commonerSatDelta: +2 },
    encourage_competition:      { regionDevelopmentDelta: +2, merchantSatDelta: +2, stabilityDelta: -2, commonerSatDelta: -1 },
  },

  // --- Loyalty Warning (surfaced by regional-life loyalty threshold) ---
  evt_exp_reg_loyalty_warning: {
    send_envoy:          { treasuryDelta: -20, regionConditionDelta: +3, stabilityDelta: +1, nobilitySatDelta: +1 },
    increase_investment: { treasuryDelta: -45, regionDevelopmentDelta: +3, regionConditionDelta: +4, commonerSatDelta: +2 },
    ignore_complaints:   { stabilityDelta: -3, regionConditionDelta: -3, commonerSatDelta: -2, nobilitySatDelta: -1, treasuryDelta: -10 },
  },

  // --- Separatist Threat (surfaced at separatist loyalty threshold) ---
  evt_exp_reg_separatist_threat: {
    negotiate_concessions: { treasuryDelta: -40, stabilityDelta: +2, regionConditionDelta: +4, nobilitySatDelta: -3, militaryReadinessDelta: +2 },
    military_presence:     { treasuryDelta: -70, militaryReadinessDelta: -4, stabilityDelta: +3, regionConditionDelta: -2, commonerSatDelta: -3 },
    grant_autonomy:        { stabilityDelta: -1, nobilitySatDelta: -4, regionConditionDelta: +6, commonerSatDelta: +3, militaryReadinessDelta: -3 },
  },

  // --- 11. Royal Tour (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_reg_royal_tour: {
    invest_in_local_projects:  { treasuryDelta: -25, regionDevelopmentDelta: +3, commonerSatDelta: +2, nobilitySatDelta: +1 },
    hold_open_audience:        { treasuryDelta: -10, commonerSatDelta: +3, stabilityDelta: +2, nobilitySatDelta: -1 },
    observe_and_depart:        { commonerSatDelta: -1, stabilityDelta: -1 },
  },
};
