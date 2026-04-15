// Population Event Choice Effects — mechanical consequences for population event decisions.

import type { MechanicalEffectDelta } from '../../engine/types';

export const POPULATION_EVENT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Migration
  // ============================================================
  evt_pop_migration_inflow: {
    welcome_settlers: { treasuryDelta: -20, commonerSatDelta: +2, stabilityDelta: +1 },
    direct_to_frontier: { treasuryDelta: -15, commonerSatDelta: +1 },
    let_them_settle: { commonerSatDelta: +1 },
  },
  evt_pop_migration_petition: {
    reduce_taxes_briefly: { treasuryDelta: -30, commonerSatDelta: +3, merchantSatDelta: +2 },
    improve_conditions: { treasuryDelta: -40, commonerSatDelta: +4, stabilityDelta: +1 },
    dismiss_concerns: { commonerSatDelta: -3, stabilityDelta: -2 },
  },
  evt_pop_migration_crisis: {
    seal_borders: { merchantSatDelta: -5, stabilityDelta: +2, commonerSatDelta: -2 },
    emergency_relief: { treasuryDelta: -60, commonerSatDelta: +3, stabilityDelta: +1 },
    let_them_leave: { commonerSatDelta: -3, stabilityDelta: -3 },
  },

  // ============================================================
  // Overcrowding
  // ============================================================
  evt_pop_overcrowding_petition: {
    expand_housing: { treasuryDelta: -40, commonerSatDelta: +3, stabilityDelta: +1 },
    resettle_frontier: { treasuryDelta: -20, commonerSatDelta: -1, stabilityDelta: +1 },
    ignore_crowding: { commonerSatDelta: -3, stabilityDelta: -2 },
  },
  evt_pop_overcrowding_crisis: {
    emergency_construction: { treasuryDelta: -80, commonerSatDelta: +2, stabilityDelta: +2 },
    forced_relocation: { commonerSatDelta: -5, stabilityDelta: +1, nobilitySatDelta: -2 },
    endure_squalor: { commonerSatDelta: -5, stabilityDelta: -3 },
  },

  // ============================================================
  // Class Mobility
  // ============================================================
  evt_pop_merchant_titles: {
    grant_titles: { merchantSatDelta: +5, nobilitySatDelta: -5, treasuryDelta: +30 },
    deny_titles: { merchantSatDelta: -3, nobilitySatDelta: +2 },
  },
  evt_pop_conscription_harvest: {
    proceed_conscription: { militaryForceSizeDelta: +50, commonerSatDelta: -5, foodDelta: -10 },
    delay_conscription: { commonerSatDelta: +2, militaryMoraleDelta: -3 },
  },
  evt_pop_clergy_exodus: {
    offer_clergy_stipends: { treasuryDelta: -30, clergySatDelta: +5, faithDelta: +3 },
    let_clergy_depart: { clergySatDelta: -5, faithDelta: -3 },
  },

  // ============================================================
  // Demographics
  // ============================================================
  evt_pop_boom: {
    invest_in_growth: { treasuryDelta: -30, foodDelta: -10, commonerSatDelta: +3, stabilityDelta: +2 },
    celebrate_prosperity: { commonerSatDelta: +2, faithDelta: +1 },
  },
  evt_pop_decline: {
    encourage_families: { treasuryDelta: -30, faithDelta: +2, commonerSatDelta: +2 },
    attract_immigrants: { treasuryDelta: -40, merchantSatDelta: +2, commonerSatDelta: +1 },
    accept_decline: { commonerSatDelta: -2, stabilityDelta: -2 },
  },
};
