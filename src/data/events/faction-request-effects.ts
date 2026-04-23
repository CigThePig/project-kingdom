// Phase 6.5 — Faction Request Mechanical Effects
// Maps faction_req_* IDs → choiceId → MechanicalEffectDelta.
// Low satisfaction requests: deny = severe penalty. High satisfaction: grant = bonus.

import type { MechanicalEffectDelta } from '../../engine/types';

export const FACTION_REQUEST_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Nobility
  // ============================================================
  faction_req_nobility_tax_exemption: {
    grant_tax_exemption: { nobilitySatDelta: +8, treasuryDelta: -40, commonerSatDelta: -2 },
    deny_tax_exemption:  { nobilitySatDelta: -6, stabilityDelta: -3, treasuryDelta: +10 },
  },
  faction_req_nobility_court_privileges: {
    expand_court_privileges: { nobilitySatDelta: +5, commonerSatDelta: -1, treasuryDelta: -15 },
    deny_court_privileges:   { nobilitySatDelta: -3 },
  },
  faction_req_nobility_academy: {
    fund_noble_academy:       { nobilitySatDelta: +3, treasuryDelta: -30, culturalCohesionDelta: +2 },
    decline_academy_proposal: { nobilitySatDelta: -3, treasuryDelta: +5 },
  },

  // ============================================================
  // Clergy
  // ============================================================
  faction_req_clergy_heresy_crackdown: {
    authorize_crackdown: { clergySatDelta: +8, heterodoxyDelta: -5, commonerSatDelta: -3, stabilityDelta: -2 },
    refuse_crackdown:    { clergySatDelta: -6, heterodoxyDelta: +3 },
  },
  faction_req_clergy_temple_funding: {
    approve_temple_funding: { clergySatDelta: +5, faithDelta: +3, treasuryDelta: -25 },
    deny_temple_funding:    { clergySatDelta: -3, faithDelta: -1, treasuryDelta: +5 },
  },
  faction_req_clergy_religious_festival: {
    sponsor_religious_festival: { clergySatDelta: +3, faithDelta: +2, commonerSatDelta: +1, treasuryDelta: -20 },
    decline_festival_request:   { clergySatDelta: -3 },
  },

  // ============================================================
  // Merchants
  // ============================================================
  faction_req_merchant_trade_protections: {
    grant_trade_protections: { merchantSatDelta: +8, treasuryDelta: -30, nobilitySatDelta: -2 },
    deny_trade_protections:  { merchantSatDelta: -6, treasuryDelta: +10 },
  },
  faction_req_merchant_market_expansion: {
    approve_market_expansion: { merchantSatDelta: +5, treasuryDelta: +15, commonerSatDelta: -2, nobilitySatDelta: -2 },
    deny_market_expansion:    { merchantSatDelta: -3, treasuryDelta: -5 },
  },
  faction_req_merchant_foreign_mission: {
    fund_foreign_mission:    { merchantSatDelta: +3, treasuryDelta: -25, culturalCohesionDelta: +2 },
    decline_foreign_mission: { merchantSatDelta: -3 },
  },

  // ============================================================
  // Commoners
  // ============================================================
  faction_req_commoner_food_relief: {
    distribute_food_relief: { commonerSatDelta: +8, foodDelta: -25, stabilityDelta: +3 },
    deny_food_relief:       { commonerSatDelta: -6, stabilityDelta: -4, foodDelta: +5 },
  },
  faction_req_commoner_labor_reforms: {
    enact_labor_reforms:  { commonerSatDelta: +5, nobilitySatDelta: -2, merchantSatDelta: -1 },
    reject_labor_reforms: { commonerSatDelta: -3, stabilityDelta: -1 },
  },
  faction_req_commoner_public_works: {
    approve_public_works: { commonerSatDelta: +3, regionDevelopmentDelta: +3, treasuryDelta: -30 },
    decline_public_works: { commonerSatDelta: -3, treasuryDelta: +5 },
  },

  // ============================================================
  // Military Caste
  // ============================================================
  faction_req_military_equipment_pay: {
    increase_military_pay: { militaryCasteSatDelta: +8, militaryMoraleDelta: +4, treasuryDelta: -40 },
    deny_pay_increase:     { militaryCasteSatDelta: -6, militaryMoraleDelta: -3 },
  },
  faction_req_military_training_grounds: {
    build_training_grounds: { militaryCasteSatDelta: +5, militaryReadinessDelta: +4, treasuryDelta: -25 },
    deny_training_grounds:  { militaryCasteSatDelta: -3, militaryReadinessDelta: -3 },
  },
  faction_req_military_border_fortification: {
    approve_border_fortification:  { militaryCasteSatDelta: +3, militaryReadinessDelta: +3, treasuryDelta: -35, regionConditionDelta: +2 },
    decline_border_fortification:  { militaryCasteSatDelta: -3, treasuryDelta: +10, militaryReadinessDelta: -3 },
  },
};
