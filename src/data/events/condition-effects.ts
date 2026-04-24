// Condition Event Choice Effects — mechanical consequences for condition event decisions.

import type { MechanicalEffectDelta } from '../../engine/types';

export const CONDITION_EVENT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Drought
  // ============================================================
  evt_cond_drought_mild: {
    ration_water_supplies: { foodDelta: +10, commonerSatDelta: -2 },
    dig_new_wells: { treasuryDelta: -40, foodDelta: +15 },
  },
  evt_cond_drought_moderate: {
    emergency_irrigation: { treasuryDelta: -80, foodDelta: +25, commonerSatDelta: +2, regionConditionDelta: +1 },
    import_water: { treasuryDelta: -50, foodDelta: +10, merchantSatDelta: +1, regionConditionDelta: +1 },
    pray_for_rain: { faithDelta: +3, commonerSatDelta: -3, regionConditionDelta: -1 },
  },
  evt_cond_drought_severe: {
    mass_relocation: { treasuryDelta: -60, commonerSatDelta: -5, stabilityDelta: -5, foodDelta: +15, regionDevelopmentDelta: -3, regionConditionDelta: +1 },
    seize_merchant_water: { merchantSatDelta: -8, commonerSatDelta: +3, foodDelta: +20, regionConditionDelta: +1 },
    endure_the_drought: { commonerSatDelta: -5, stabilityDelta: -3, regionConditionDelta: -2 },
  },

  // ============================================================
  // Flood
  // ============================================================
  evt_cond_flood_moderate: {
    reinforce_levees: { treasuryDelta: -60, regionDevelopmentDelta: +3, stabilityDelta: +2, foodDelta: +3, regionConditionDelta: +1 },
    evacuate_lowlands: { treasuryDelta: -30, commonerSatDelta: -3, stabilityDelta: +1, foodDelta: +2, regionConditionDelta: +1 },
    let_floodwaters_pass: { foodDelta: -15, regionDevelopmentDelta: -3, regionConditionDelta: -1 },
  },

  // ============================================================
  // Harsh Winter
  // ============================================================
  evt_cond_harshwinter_moderate: {
    distribute_firewood: { treasuryDelta: -40, commonerSatDelta: +3, foodDelta: -5, regionConditionDelta: +1 },
    open_shelters: { treasuryDelta: -25, commonerSatDelta: +2, faithDelta: +2, regionConditionDelta: +1 },
    wait_for_thaw: { commonerSatDelta: -5, militaryMoraleDelta: -3, regionConditionDelta: -1 },
  },

  // ============================================================
  // Bountiful Harvest
  // ============================================================
  evt_cond_bountifulharvest_mild: {
    stockpile_surplus: { foodDelta: +25 },
    trade_surplus: { foodDelta: -10, treasuryDelta: +60, merchantSatDelta: +3 },
    feast_of_plenty: { foodDelta: -15, commonerSatDelta: +5, faithDelta: +2, stabilityDelta: +2 },
  },

  // ============================================================
  // Plague
  // ============================================================
  evt_cond_plague_mild: {
    quarantine_district: { treasuryDelta: -30, commonerSatDelta: -2, stabilityDelta: +2, regionConditionDelta: +1 },
    hire_healers: { treasuryDelta: -50, commonerSatDelta: +2, regionConditionDelta: +1 },
    ignore_sickness: { commonerSatDelta: -5, stabilityDelta: -3, regionConditionDelta: -2 },
  },
  evt_cond_plague_moderate: {
    citywide_quarantine: { treasuryDelta: -80, commonerSatDelta: -5, merchantSatDelta: -5, stabilityDelta: +3, regionConditionDelta: +1 },
    burn_infected_quarters: { treasuryDelta: -40, commonerSatDelta: -8, stabilityDelta: +1, regionDevelopmentDelta: -5, regionConditionDelta: +2 },
    pray_for_deliverance: { faithDelta: +5, commonerSatDelta: -3, stabilityDelta: -5, regionConditionDelta: -2 },
  },
  evt_cond_plague_severe: {
    seal_the_gates: { treasuryDelta: -60, merchantSatDelta: -10, commonerSatDelta: -5, stabilityDelta: +2, regionConditionDelta: +1 },
    mass_exodus: { commonerSatDelta: -10, stabilityDelta: -8, merchantSatDelta: -5, regionDevelopmentDelta: -4 },
    accept_fate: { commonerSatDelta: -8, stabilityDelta: -10, faithDelta: +3, regionDevelopmentDelta: -3, regionConditionDelta: -3 },
  },
  evt_cond_plague_escalation: {
    martial_law: { stabilityDelta: -5, commonerSatDelta: -8, militaryMoraleDelta: -3, nobilitySatDelta: +2, regionConditionDelta: -1 },
    appeal_to_clergy: { faithDelta: +5, clergySatDelta: +3, treasuryDelta: -45, regionConditionDelta: +2 },
  },

  // ============================================================
  // Famine
  // ============================================================
  evt_cond_famine_moderate: {
    emergency_rationing: { foodDelta: +10, commonerSatDelta: -5, stabilityDelta: -2, regionConditionDelta: -1 },
    import_foreign_grain: { treasuryDelta: -100, foodDelta: +30, merchantSatDelta: +2, diplomacyDeltas: { neighbor_arenthal: +2 }, regionConditionDelta: +1 },
    open_royal_granaries: { foodDelta: +20, commonerSatDelta: +3, nobilitySatDelta: -3, regionConditionDelta: +2 },
  },

  // ============================================================
  // Resolution notifications (acknowledge only)
  // ============================================================
  evt_cond_drought_resolved: {
    acknowledge: { commonerSatDelta: +2 },
  },
  evt_cond_plague_resolved: {
    acknowledge: { commonerSatDelta: +3, stabilityDelta: +2 },
  },
  evt_cond_flood_resolved: {
    acknowledge: { commonerSatDelta: +1 },
  },
};
