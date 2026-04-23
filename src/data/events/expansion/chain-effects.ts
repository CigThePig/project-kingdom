import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_CHAIN_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // CHAIN 1: Corruption
  // ============================================================
  evt_exp_chain_corruption_discovery: {
    launch_quiet_investigation: { treasuryDelta: -25, espionageNetworkDelta: +3, nobilitySatDelta: -2, stabilityDelta: +1 },
    confront_suspects_publicly: { nobilitySatDelta: -4, commonerSatDelta: +3, stabilityDelta: -2, treasuryDelta: -10 },
    turn_a_blind_eye:           { nobilitySatDelta: +1, stabilityDelta: -1, treasuryDelta: -15 },
  },
  evt_exp_chain_corruption_investigation: {
    expand_investigation:        { treasuryDelta: -40, espionageNetworkDelta: +4, nobilitySatDelta: -4, stabilityDelta: +2 },
    offer_amnesty_for_testimony: { treasuryDelta: +30, nobilitySatDelta: -2, commonerSatDelta: -2, stabilityDelta: -1 },
    suppress_findings:           { nobilitySatDelta: +2, commonerSatDelta: -3, stabilityDelta: -3 },
  },
  evt_exp_chain_corruption_scandal: {
    public_trial_and_punishment:       { stabilityDelta: +5, commonerSatDelta: +6, nobilitySatDelta: -7, treasuryDelta: +50, regionDevelopmentDelta: +2 },
    quiet_exile_of_guilty:             { nobilitySatDelta: -2, stabilityDelta: +2, treasuryDelta: +20, commonerSatDelta: -3, regionConditionDelta: -1 },
    pardon_in_exchange_for_restitution: { treasuryDelta: +80, nobilitySatDelta: +3, commonerSatDelta: -5, stabilityDelta: -3, regionDevelopmentDelta: -2, regionConditionDelta: -1 },
  },

  // ============================================================
  // CHAIN 2: Drought
  // ============================================================
  evt_exp_chain_drought_spring: {
    dig_emergency_wells: { treasuryDelta: -30, foodDelta: +5, commonerSatDelta: +2, regionConditionDelta: +2 },
    pray_for_rain:       { faithDelta: +2, foodDelta: -5, commonerSatDelta: -1 },
    ration_water_early:  { foodDelta: -3, commonerSatDelta: -2, stabilityDelta: +1 },
  },
  evt_exp_chain_drought_summer: {
    import_water_by_caravan: { treasuryDelta: -60, foodDelta: -10, merchantSatDelta: +2, commonerSatDelta: +1 },
    abandon_worst_fields:    { foodDelta: -25, commonerSatDelta: -3, regionConditionDelta: -4, stabilityDelta: +1 },
    endure_and_hope:         { foodDelta: -15, commonerSatDelta: -4, stabilityDelta: -2 },
  },
  evt_exp_chain_drought_autumn: {
    emergency_food_imports: { treasuryDelta: -100, foodDelta: +25, merchantSatDelta: +2, commonerSatDelta: +3 },
    strict_rationing:       { foodDelta: +5, commonerSatDelta: -5, stabilityDelta: -3, militaryMoraleDelta: -2 },
    sacrifice_livestock:    { foodDelta: +15, regionConditionDelta: -5, commonerSatDelta: -3 },
  },

  // ============================================================
  // CHAIN 3: Border War
  // ============================================================
  evt_exp_chain_border_war_skirmish: {
    send_diplomats_immediately:  { treasuryDelta: -25, diplomacyDeltas: { neighbor_arenthal: +4 }, militaryCasteSatDelta: -2, stabilityDelta: +2 },
    reinforce_border_garrisons:  { militaryReadinessDelta: +5, treasuryDelta: -40, diplomacyDeltas: { neighbor_arenthal: -3 }, commonerSatDelta: -1 },
    demand_explanation:          { diplomacyDeltas: { neighbor_arenthal: -2 }, stabilityDelta: -1 },
  },
  evt_exp_chain_border_war_mobilization: {
    full_mobilization:       { militaryReadinessDelta: +8, militaryMoraleDelta: +4, treasuryDelta: -80, commonerSatDelta: -4, foodDelta: -15 },
    defensive_posture:       { militaryReadinessDelta: +4, treasuryDelta: -40, commonerSatDelta: -1, stabilityDelta: +1 },
    last_minute_peace_offer: { diplomacyDeltas: { neighbor_arenthal: +3 }, treasuryDelta: -30, militaryCasteSatDelta: -3, nobilitySatDelta: -2 },
  },
  evt_exp_chain_border_war_resolution: {
    negotiate_ceasefire:      { diplomacyDeltas: { neighbor_arenthal: +5 }, treasuryDelta: -30, stabilityDelta: +4, militaryCasteSatDelta: -2 },
    press_advantage:          { diplomacyDeltas: { neighbor_arenthal: -8 }, militaryReadinessDelta: -5, treasuryDelta: +40, regionConditionDelta: -3, commonerSatDelta: -3 },
    accept_unfavorable_terms: { diplomacyDeltas: { neighbor_arenthal: +8 }, nobilitySatDelta: -6, militaryCasteSatDelta: -4, stabilityDelta: -4, treasuryDelta: -40 },
  },

  // ============================================================
  // CHAIN 4: Reformation
  // ============================================================
  evt_exp_chain_reformation_movement: {
    engage_with_reformers: { heterodoxyDelta: +3, clergySatDelta: -3, commonerSatDelta: +2, faithDelta: -1 },
    suppress_the_movement: { heterodoxyDelta: -3, clergySatDelta: +3, commonerSatDelta: -3, stabilityDelta: -2 },
    observe_from_distance: { heterodoxyDelta: +1, stabilityDelta: -1 },
  },
  evt_exp_chain_reformation_split: {
    mediate_between_factions: { stabilityDelta: +2, clergySatDelta: -1, commonerSatDelta: +1, treasuryDelta: -25, faithDelta: +2 },
    side_with_orthodox:       { clergySatDelta: +5, commonerSatDelta: -4, heterodoxyDelta: -4, stabilityDelta: -2 },
    side_with_reformers:      { clergySatDelta: -5, commonerSatDelta: +4, heterodoxyDelta: +5, faithDelta: -3 },
  },
  evt_exp_chain_reformation_doctrine: {
    adopt_new_doctrine:  { faithDelta: +5, heterodoxyDelta: -8, clergySatDelta: -6, commonerSatDelta: +5, culturalCohesionDelta: -3, treasuryDelta: -40, regionDevelopmentDelta: +2 },
    reaffirm_tradition:  { faithDelta: +3, clergySatDelta: +6, commonerSatDelta: -4, heterodoxyDelta: +3, stabilityDelta: +2, regionConditionDelta: +1 },
    allow_dual_practice: { culturalCohesionDelta: -2, heterodoxyDelta: +4, stabilityDelta: -3, commonerSatDelta: +2, clergySatDelta: -3, regionConditionDelta: -2 },
  },

  // ============================================================
  // CHAIN 5: Guild Revolution
  // ============================================================
  evt_exp_chain_guild_rev_alliance: {
    meet_with_guild_leaders: { merchantSatDelta: +3, commonerSatDelta: +2, nobilitySatDelta: -2, treasuryDelta: -15 },
    ban_cross_class_meetings: { nobilitySatDelta: +2, merchantSatDelta: -3, commonerSatDelta: -3, stabilityDelta: -2 },
    monitor_developments:     { stabilityDelta: -1, espionageNetworkDelta: +1 },
  },
  evt_exp_chain_guild_rev_council: {
    grant_council_representation: { merchantSatDelta: +4, commonerSatDelta: +3, nobilitySatDelta: -5, stabilityDelta: +2 },
    arrest_ringleaders:           { nobilitySatDelta: +3, merchantSatDelta: -5, commonerSatDelta: -4, stabilityDelta: -3 },
    offer_economic_concessions:   { treasuryDelta: -50, merchantSatDelta: +3, commonerSatDelta: +1, nobilitySatDelta: -2 },
  },
  evt_exp_chain_guild_rev_shift: {
    embrace_new_order:     { merchantSatDelta: +6, commonerSatDelta: +5, nobilitySatDelta: -8, stabilityDelta: +3, culturalCohesionDelta: -2, regionDevelopmentDelta: +3 },
    crush_the_movement:    { nobilitySatDelta: +5, militaryCasteSatDelta: +2, merchantSatDelta: -7, commonerSatDelta: -6, stabilityDelta: -5, treasuryDelta: -40, regionConditionDelta: -3 },
    negotiate_compromise:  { merchantSatDelta: +3, commonerSatDelta: +2, nobilitySatDelta: -3, treasuryDelta: -30, stabilityDelta: +1, regionConditionDelta: +1 },
  },

  // ============================================================
  // CHAIN 6: Renaissance
  // ============================================================
  evt_exp_chain_renaissance_spark: {
    fund_the_scholars:          { treasuryDelta: -25, culturalCohesionDelta: +3, clergySatDelta: +1 },
    encourage_but_dont_fund:    { culturalCohesionDelta: +1, clergySatDelta: -1 },
  },
  evt_exp_chain_renaissance_flowering: {
    commission_grand_works:     { treasuryDelta: -70, culturalCohesionDelta: +6, commonerSatDelta: +3, nobilitySatDelta: +2, regionDevelopmentDelta: +3 },
    open_public_academies:      { treasuryDelta: -40, culturalCohesionDelta: +4, commonerSatDelta: +4, clergySatDelta: -2 },
    let_culture_grow_naturally: { culturalCohesionDelta: +2, commonerSatDelta: +1 },
  },
  evt_exp_chain_renaissance_golden: {
    declare_golden_age:         { treasuryDelta: -80, culturalCohesionDelta: +8, stabilityDelta: +5, faithDelta: +3, commonerSatDelta: +4, nobilitySatDelta: +3 },
    channel_into_practical_arts: { treasuryDelta: -30, regionDevelopmentDelta: +5, merchantSatDelta: +3, culturalCohesionDelta: +3 },
    maintain_current_course:    { culturalCohesionDelta: +2, stabilityDelta: +1 },
  },

  // ============================================================
  // CHAIN 7: Spy War
  // ============================================================
  evt_exp_chain_spy_war_discovery: {
    dismantle_enemy_network: { espionageNetworkDelta: +5, treasuryDelta: -30, diplomacyDeltas: { neighbor_arenthal: -3 } },
    feed_false_intelligence: { espionageNetworkDelta: +3, diplomacyDeltas: { neighbor_arenthal: -1 }, stabilityDelta: +1 },
    observe_and_learn:       { espionageNetworkDelta: +1, stabilityDelta: -1 },
  },
  evt_exp_chain_spy_war_double_agent: {
    recruit_double_agent: { espionageNetworkDelta: +6, treasuryDelta: -40, diplomacyDeltas: { neighbor_arenthal: +2 }, stabilityDelta: -1 },
    expose_the_agent:     { espionageNetworkDelta: -2, diplomacyDeltas: { neighbor_arenthal: -4 }, stabilityDelta: +3, nobilitySatDelta: +2 },
    eliminate_the_threat: { espionageNetworkDelta: +2, stabilityDelta: -2, diplomacyDeltas: { neighbor_arenthal: -5 } },
  },
  evt_exp_chain_spy_war_resolution: {
    triumphant_intelligence_coup: { espionageNetworkDelta: +8, diplomacyDeltas: { neighbor_arenthal: -6 }, treasuryDelta: -50, nobilitySatDelta: +3, stabilityDelta: +3 },
    negotiate_intelligence_truce: { espionageNetworkDelta: +2, diplomacyDeltas: { neighbor_arenthal: +4 }, treasuryDelta: -20, stabilityDelta: +2 },
    cut_losses_and_rebuild:       { espionageNetworkDelta: -4, treasuryDelta: -15, stabilityDelta: -2 },
  },

  // ============================================================
  // CHAIN 8: Regional Rebellion
  // ============================================================
  evt_exp_chain_rebellion_unrest: {
    send_governor_to_negotiate: { treasuryDelta: -20, commonerSatDelta: +2, nobilitySatDelta: +1, stabilityDelta: +2, regionConditionDelta: +2 },
    deploy_peacekeeping_force:  { militaryReadinessDelta: -2, treasuryDelta: -30, commonerSatDelta: -2, stabilityDelta: +1, regionConditionDelta: +1 },
    ignore_provincial_grumbling: { stabilityDelta: -2, commonerSatDelta: -2, regionConditionDelta: -3 },
  },
  evt_exp_chain_rebellion_separatist: {
    grant_limited_autonomy: { stabilityDelta: +3, commonerSatDelta: +3, nobilitySatDelta: -4, regionDevelopmentDelta: +3, treasuryDelta: -20 },
    martial_law_in_province: { militaryReadinessDelta: +3, commonerSatDelta: -5, stabilityDelta: -2, regionConditionDelta: -3, treasuryDelta: -40 },
    promise_reforms:         { commonerSatDelta: +1, stabilityDelta: -1, nobilitySatDelta: -1, treasuryDelta: -5 },
  },
  evt_exp_chain_rebellion_crisis: {
    military_suppression: { militaryReadinessDelta: -4, commonerSatDelta: -7, stabilityDelta: +4, treasuryDelta: -70, regionConditionDelta: -5, nobilitySatDelta: +3 },
    federal_compromise:   { commonerSatDelta: +4, nobilitySatDelta: -4, stabilityDelta: +2, treasuryDelta: -30, regionDevelopmentDelta: +4 },
    let_province_secede:  { commonerSatDelta: -3, nobilitySatDelta: -5, stabilityDelta: -6, regionDevelopmentDelta: -8, militaryCasteSatDelta: -4 },
  },
};
