import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_DIPLOMACY_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- Opening Phase ---
  evt_exp_dip_foreign_emissary_arrives: {
    welcome_with_feast:    { treasuryDelta: -25, nobilitySatDelta: +2, diplomacyDeltas: { neighbor_arenthal: +3 }, culturalCohesionDelta: +1 },
    formal_audience_only:  { nobilitySatDelta: +1, diplomacyDeltas: { neighbor_arenthal: +1 } },
  },
  evt_exp_dip_border_greeting: {
    reciprocate_warmly:    { treasuryDelta: -15, diplomacyDeltas: { neighbor_arenthal: +4 }, commonerSatDelta: +1 },
    acknowledge_politely:  { diplomacyDeltas: { neighbor_arenthal: +1 } },
  },
  evt_exp_dip_trade_proposal: {
    accept_trade_terms:    { treasuryDelta: +25, merchantSatDelta: +3, diplomacyDeltas: { neighbor_valdris: +5 }, commonerSatDelta: -1 },
    counter_propose:       { merchantSatDelta: +1, diplomacyDeltas: { neighbor_valdris: +2 }, treasuryDelta: +10 },
    decline_politely:      { diplomacyDeltas: { neighbor_valdris: -3 }, merchantSatDelta: -2 },
  },

  // --- Developing Phase ---
  evt_exp_dip_diplomatic_incident: {
    issue_formal_apology:     { stabilityDelta: +2, diplomacyDeltas: { neighbor_arenthal: +5 }, nobilitySatDelta: -3, commonerSatDelta: -1, treasuryDelta: -20 },
    demand_reciprocal_apology: { nobilitySatDelta: +2, diplomacyDeltas: { neighbor_arenthal: -5 }, militaryCasteSatDelta: +1, stabilityDelta: -2 },
    downplay_the_incident:    { diplomacyDeltas: { neighbor_arenthal: -2 }, stabilityDelta: -1 },
  },
  evt_exp_dip_refugee_plea: {
    welcome_refugees:    { commonerSatDelta: -2, foodDelta: -15, populationDelta: +50, stabilityDelta: -1, culturalCohesionDelta: -2 } as MechanicalEffectDelta,
    limited_asylum:      { commonerSatDelta: +1, foodDelta: -5, stabilityDelta: +1 },
    close_the_borders:   { commonerSatDelta: -1, culturalCohesionDelta: +1, faithDelta: -1 },
  },
  evt_exp_dip_alliance_overture: {
    accept_alliance:      { diplomacyDeltas: { neighbor_valdris: +8 }, militaryReadinessDelta: +3, nobilitySatDelta: +2, treasuryDelta: -20 },
    propose_limited_pact: { diplomacyDeltas: { neighbor_valdris: +4 }, merchantSatDelta: +2, treasuryDelta: -10 },
    maintain_independence: { nobilitySatDelta: +1, diplomacyDeltas: { neighbor_valdris: -2 } },
  },
  evt_exp_dip_hostage_exchange: {
    negotiate_exchange:   { treasuryDelta: -50, stabilityDelta: +3, nobilitySatDelta: +4, diplomacyDeltas: { neighbor_arenthal: +3 } },
    refuse_and_retaliate: { militaryReadinessDelta: +3, diplomacyDeltas: { neighbor_arenthal: -5 }, stabilityDelta: -2, nobilitySatDelta: -2 },
    stall_for_time:       { stabilityDelta: -2, nobilitySatDelta: -1 },
  },
  evt_exp_dip_cultural_envoy: {
    host_cultural_exchange: { treasuryDelta: -20, culturalCohesionDelta: +3, diplomacyDeltas: { neighbor_valdris: +3 }, commonerSatDelta: +1 },
    polite_reception:       { culturalCohesionDelta: +1, diplomacyDeltas: { neighbor_valdris: +1 } },
  },

  // --- Established Phase ---
  evt_exp_dip_treaty_violation: {
    demand_reparations:     { treasuryDelta: +40, diplomacyDeltas: { neighbor_arenthal: -8 }, militaryCasteSatDelta: +2, stabilityDelta: -2 },
    military_posturing:     { militaryReadinessDelta: +5, diplomacyDeltas: { neighbor_arenthal: -6 }, treasuryDelta: -30, commonerSatDelta: -2 },
    seek_mediation:         { treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: +2 }, nobilitySatDelta: +1, stabilityDelta: +2 },
    overlook_the_violation: { diplomacyDeltas: { neighbor_arenthal: +3 }, nobilitySatDelta: -4, commonerSatDelta: -2, stabilityDelta: -3 },
  },
  evt_exp_dip_marriage_proposal: {
    accept_the_match:   { diplomacyDeltas: { neighbor_valdris: +8 }, nobilitySatDelta: +3, commonerSatDelta: -1, culturalCohesionDelta: -1 },
    negotiate_terms:    { diplomacyDeltas: { neighbor_valdris: +4 }, treasuryDelta: +20, nobilitySatDelta: +1 },
    politely_decline:   { diplomacyDeltas: { neighbor_valdris: -3 }, nobilitySatDelta: -1 },
  },
  evt_exp_dip_spy_scandal: {
    deny_involvement:          { diplomacyDeltas: { neighbor_arenthal: -3, neighbor_valdris: -3 }, espionageNetworkDelta: -2, stabilityDelta: -1 },
    expel_foreign_diplomats:   { diplomacyDeltas: { neighbor_arenthal: -6, neighbor_valdris: -6 }, espionageNetworkDelta: +3, stabilityDelta: +2, treasuryDelta: -20 },
    offer_intelligence_sharing: { diplomacyDeltas: { neighbor_arenthal: +4, neighbor_valdris: +4 }, espionageNetworkDelta: -5, stabilityDelta: +1 },
  },
  evt_exp_dip_border_dispute_escalation: {
    show_of_force:              { militaryReadinessDelta: +4, diplomacyDeltas: { neighbor_arenthal: -5 }, treasuryDelta: -40, commonerSatDelta: -2 },
    propose_border_commission:  { treasuryDelta: -25, diplomacyDeltas: { neighbor_arenthal: +5 }, stabilityDelta: +2, nobilitySatDelta: -1 },
    cede_disputed_territory:    { diplomacyDeltas: { neighbor_arenthal: +8 }, nobilitySatDelta: -5, commonerSatDelta: -3, regionConditionDelta: -3 },
  },
  evt_exp_dip_peace_conference: {
    host_the_conference:     { treasuryDelta: -80, diplomacyDeltas: { neighbor_arenthal: +6, neighbor_valdris: +6 }, nobilitySatDelta: +4, culturalCohesionDelta: +3, stabilityDelta: +3 },
    attend_as_participant:   { treasuryDelta: -30, diplomacyDeltas: { neighbor_arenthal: +3, neighbor_valdris: +3 }, nobilitySatDelta: +2 },
    decline_invitation:      { diplomacyDeltas: { neighbor_arenthal: -2, neighbor_valdris: -2 }, nobilitySatDelta: -1 },
  },
  evt_exp_dip_trade_embargo_threat: {
    negotiate_compromise:   { treasuryDelta: -30, diplomacyDeltas: { neighbor_valdris: +5 }, merchantSatDelta: +2 },
    counter_embargo:        { merchantSatDelta: -4, treasuryDelta: -20, diplomacyDeltas: { neighbor_valdris: -6 }, militaryReadinessDelta: +2 },
    seek_alternative_markets: { treasuryDelta: -40, merchantSatDelta: +1, diplomacyDeltas: { neighbor_arenthal: +3 } },
    accept_the_embargo:     { merchantSatDelta: -6, treasuryDelta: -30, commonerSatDelta: -3 },
  },
  evt_exp_dip_diplomatic_gift: {
    accept_graciously:      { diplomacyDeltas: { neighbor_arenthal: +2, neighbor_valdris: +2 }, culturalCohesionDelta: +1 },
    reciprocate_generously: { treasuryDelta: -25, diplomacyDeltas: { neighbor_arenthal: +5, neighbor_valdris: +5 }, nobilitySatDelta: +1 },
  },
  evt_exp_dip_war_reparations_demand: {
    pay_reparations:       { treasuryDelta: -100, diplomacyDeltas: { neighbor_arenthal: +6 }, nobilitySatDelta: -5, commonerSatDelta: -4, stabilityDelta: +2 },
    refuse_and_mobilize:   { militaryReadinessDelta: +6, militaryMoraleDelta: +3, treasuryDelta: -60, diplomacyDeltas: { neighbor_arenthal: -8 }, commonerSatDelta: -3 },
    request_arbitration:   { treasuryDelta: -30, diplomacyDeltas: { neighbor_arenthal: +2, neighbor_valdris: +3 }, stabilityDelta: +1 },
    stall_negotiations:    { diplomacyDeltas: { neighbor_arenthal: -4 }, stabilityDelta: -3, nobilitySatDelta: -2 },
  },

  // --- Any Phase ---
  evt_exp_dip_visiting_dignitary: {
    grand_welcome:       { treasuryDelta: -20, nobilitySatDelta: +2, diplomacyDeltas: { neighbor_valdris: +3 }, culturalCohesionDelta: +1 },
    standard_reception:  { nobilitySatDelta: +1, diplomacyDeltas: { neighbor_valdris: +1 } },
  },
  evt_exp_dip_foreign_merchant_dispute: {
    side_with_local_merchants:  { merchantSatDelta: +4, diplomacyDeltas: { neighbor_arenthal: -3 }, treasuryDelta: -10 },
    side_with_foreign_traders:  { merchantSatDelta: -3, diplomacyDeltas: { neighbor_arenthal: +4 }, treasuryDelta: +15 },
    impose_neutral_ruling:      { merchantSatDelta: -1, diplomacyDeltas: { neighbor_arenthal: +1 }, stabilityDelta: +1 },
  },
  evt_exp_dip_border_patrol_contact: {
    reinforce_patrols:   { militaryReadinessDelta: +3, treasuryDelta: -20, diplomacyDeltas: { neighbor_arenthal: -2 }, regionConditionDelta: +2 },
    open_dialogue:       { diplomacyDeltas: { neighbor_arenthal: +4 }, militaryCasteSatDelta: -1, stabilityDelta: +1 },
    monitor_situation:   { espionageNetworkDelta: +1, militaryCasteSatDelta: -1 },
  },
  evt_exp_dip_tribute_request: {
    pay_the_tribute:         { treasuryDelta: -60, diplomacyDeltas: { neighbor_valdris: +6 }, nobilitySatDelta: -4, commonerSatDelta: -2, stabilityDelta: +1 },
    refuse_defiantly:        { diplomacyDeltas: { neighbor_valdris: -6 }, militaryCasteSatDelta: +3, nobilitySatDelta: +2, militaryMoraleDelta: +2 },
    negotiate_lesser_amount: { treasuryDelta: -25, diplomacyDeltas: { neighbor_valdris: +2 }, nobilitySatDelta: -1 },
  },
  evt_exp_dip_diplomatic_marriage_offer: {
    arrange_the_marriage: { diplomacyDeltas: { neighbor_arenthal: +7 }, nobilitySatDelta: +3, culturalCohesionDelta: -1, treasuryDelta: -30 },
    delay_decision:       { diplomacyDeltas: { neighbor_arenthal: -1 }, nobilitySatDelta: -1 },
  },
  evt_exp_dip_joint_military_exercise: {
    participate_fully:   { militaryReadinessDelta: +4, militaryMoraleDelta: +2, treasuryDelta: -25, diplomacyDeltas: { neighbor_arenthal: +4, neighbor_valdris: +4 } },
    send_observers_only: { militaryReadinessDelta: +1, diplomacyDeltas: { neighbor_arenthal: +1, neighbor_valdris: +1 } },
  },

  // --- Smart Card Engine Surface — Phase E ---
  evt_rival_crisis_window: {
    acknowledge: {},
  },
};
