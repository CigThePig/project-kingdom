// Social Condition Event Choice Effects — mechanical consequences for social condition decisions.

import type { MechanicalEffectDelta } from '../../engine/types';

export const SOCIAL_CONDITION_EVENT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Banditry
  // ============================================================
  evt_social_banditry_mild: {
    deploy_patrols: { treasuryDelta: -30, stabilityDelta: +2, militaryReadinessDelta: -3 },
    arm_merchant_caravans: { treasuryDelta: -20, merchantSatDelta: +3 },
    ignore_bandits: { merchantSatDelta: -3, commonerSatDelta: -2, stabilityDelta: -2 },
  },
  evt_social_banditry_moderate: {
    military_sweep: { treasuryDelta: -60, militaryReadinessDelta: -5, stabilityDelta: +3, commonerSatDelta: +2 },
    negotiate_brigands: { treasuryDelta: -40, stabilityDelta: +1, nobilitySatDelta: -3 },
    fortify_trade_routes: { treasuryDelta: -50, merchantSatDelta: +4, stabilityDelta: +1 },
  },
  evt_social_banditry_severe: {
    marshal_campaign: { treasuryDelta: -80, militaryReadinessDelta: -8, stabilityDelta: +5, commonerSatDelta: +3, regionConditionDelta: +2 },
    offer_amnesty: { stabilityDelta: +2, nobilitySatDelta: -5, commonerSatDelta: +2, regionConditionDelta: +1 },
    abandon_outer_roads: { merchantSatDelta: -8, commonerSatDelta: -5, stabilityDelta: -3, regionDevelopmentDelta: -4, regionConditionDelta: -2 },
  },
  evt_social_banditry_resolved: {
    acknowledge: { merchantSatDelta: +2, stabilityDelta: +2 },
  },

  // ============================================================
  // Corruption
  // ============================================================
  evt_social_corruption_mild: {
    launch_investigation: { treasuryDelta: -30, nobilitySatDelta: -3, stabilityDelta: +1 },
    public_denouncement: { nobilitySatDelta: -5, commonerSatDelta: +3, stabilityDelta: +2, faithDelta: +1, treasuryDelta: +5 },
    tolerate_graft: { nobilitySatDelta: +2, commonerSatDelta: -2, stabilityDelta: -1, treasuryDelta: -5 },
  },
  evt_social_corruption_moderate: {
    purge_corrupt_officials: { treasuryDelta: -50, nobilitySatDelta: -8, stabilityDelta: +3, commonerSatDelta: +3 },
    reform_tax_collection: { treasuryDelta: +30, nobilitySatDelta: -4, stabilityDelta: +1 },
    accept_status_quo: { nobilitySatDelta: +2, stabilityDelta: -3, commonerSatDelta: -3 },
  },
  evt_social_corruption_severe: {
    royal_tribunal: { treasuryDelta: -70, nobilitySatDelta: -10, stabilityDelta: +5, commonerSatDelta: +5, regionDevelopmentDelta: +2 },
    co_opt_corrupt_lords: { nobilitySatDelta: +3, commonerSatDelta: -5, stabilityDelta: -2, treasuryDelta: +20, regionConditionDelta: -1 },
    endure_corruption: { stabilityDelta: -5, commonerSatDelta: -5, regionDevelopmentDelta: -2, regionConditionDelta: -2, treasuryDelta: -30 },
  },
  evt_social_corruption_resolved: {
    acknowledge: { stabilityDelta: +2, commonerSatDelta: +2, treasuryDelta: +10 },
  },

  // ============================================================
  // Unrest
  // ============================================================
  evt_social_unrest_mild: {
    address_grievances: { treasuryDelta: -30, commonerSatDelta: +5, stabilityDelta: +2, faithDelta: +1 },
    increase_guard_presence: { treasuryDelta: -20, stabilityDelta: +1, commonerSatDelta: -2, faithDelta: -1 },
    ignore_grumbling: { commonerSatDelta: -3, stabilityDelta: -3, faithDelta: -1 },
  },
  evt_social_unrest_moderate: {
    hold_public_festival: { treasuryDelta: -50, commonerSatDelta: +5, stabilityDelta: +2, faithDelta: +2 },
    suppress_riots: { militaryReadinessDelta: -5, commonerSatDelta: -5, stabilityDelta: +3, nobilitySatDelta: +2 },
    make_concessions: { treasuryDelta: -40, commonerSatDelta: +3, nobilitySatDelta: -3, stabilityDelta: +1 },
  },
  evt_social_unrest_severe: {
    declare_martial_law: { militaryReadinessDelta: -8, commonerSatDelta: -8, stabilityDelta: +5, nobilitySatDelta: +3, regionConditionDelta: -1 },
    negotiate_rebel_leaders: { commonerSatDelta: +5, nobilitySatDelta: -5, stabilityDelta: +2, regionConditionDelta: +2 },
    abdicate_demands: { commonerSatDelta: +8, nobilitySatDelta: -8, stabilityDelta: -2, treasuryDelta: -60, regionDevelopmentDelta: -2 },
  },
  evt_social_unrest_resolved: {
    acknowledge: { commonerSatDelta: +3, stabilityDelta: +3 },
  },

  // ============================================================
  // Criminal Underworld
  // ============================================================
  evt_social_criminal_mild: {
    fund_undercover_ops: { treasuryDelta: -40, espionageNetworkDelta: +5, stabilityDelta: +1 },
    legalize_and_tax: { treasuryDelta: +20, merchantSatDelta: +3, stabilityDelta: -1, nobilitySatDelta: -2 },
    look_the_other_way: { merchantSatDelta: +1, stabilityDelta: -2, treasuryDelta: -5 },
  },
  evt_social_criminal_moderate: {
    crack_down_syndicates: { treasuryDelta: -60, espionageNetworkDelta: +8, stabilityDelta: +3, merchantSatDelta: -3 },
    recruit_informants: { treasuryDelta: -30, espionageNetworkDelta: +10, merchantSatDelta: -1 },
    tolerate_black_market: { merchantSatDelta: +3, stabilityDelta: -3, commonerSatDelta: -2, treasuryDelta: -10 },
  },
  evt_social_criminal_severe: {
    martial_purge: { treasuryDelta: -90, militaryReadinessDelta: -6, espionageNetworkDelta: +12, stabilityDelta: +5, commonerSatDelta: -3, regionConditionDelta: +2 },
    bribe_the_bosses: { treasuryDelta: -60, stabilityDelta: +2, nobilitySatDelta: -4, merchantSatDelta: +2, regionConditionDelta: -1 },
    cede_the_ports: { merchantSatDelta: +4, treasuryDelta: -40, stabilityDelta: -6, commonerSatDelta: -4, regionDevelopmentDelta: -3, regionConditionDelta: -2 },
  },
  evt_social_criminal_resolved: {
    acknowledge: { espionageNetworkDelta: +3, stabilityDelta: +1, treasuryDelta: +5 },
  },
};
