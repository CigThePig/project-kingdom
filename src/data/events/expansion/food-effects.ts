import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_FOOD_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Granary Rats — Notable
  // ============================================================
  evt_exp_fod_granary_rats: {
    hire_ratcatchers:            { treasuryDelta: -25, foodDelta: +10, commonerSatDelta: +1, regionConditionDelta: +1 },
    distribute_before_spoilage:  { foodDelta: -15, commonerSatDelta: +4, merchantSatDelta: -2, stabilityDelta: +1 },
    accept_the_losses:           { foodDelta: -25, commonerSatDelta: -3, stabilityDelta: -1 },
  },

  // ============================================================
  // 2. Fishing Fleet Expansion — Notable
  // ============================================================
  evt_exp_fod_fishing_fleet: {
    fund_new_boats:           { treasuryDelta: -40, foodDelta: +25, commonerSatDelta: +3, regionDevelopmentDelta: +2, merchantSatDelta: -1 },
    conscript_coastal_labour: { foodDelta: +15, commonerSatDelta: -4, militaryCasteSatDelta: -1, regionConditionDelta: -1, treasuryDelta: -5 },
    maintain_current_fleet:   { foodDelta: +5, commonerSatDelta: -1, treasuryDelta: -5 },
  },

  // ============================================================
  // 3. Food Preservation Innovations — Informational
  // ============================================================
  evt_exp_fod_preservation: {
    invest_in_salt_curing:         { treasuryDelta: -15, foodDelta: +10, merchantSatDelta: +1, commonerSatDelta: +1 },
    build_smoke_houses:            { treasuryDelta: -20, foodDelta: +15, regionDevelopmentDelta: +1, commonerSatDelta: -1 },
    rely_on_traditional_methods:   { foodDelta: +3, commonerSatDelta: +1 },
  },

  // ============================================================
  // 4. Crop Disease — Serious
  // ============================================================
  evt_exp_fod_crop_disease: {
    burn_infected_fields:        { foodDelta: -40, stabilityDelta: +3, commonerSatDelta: -3, regionConditionDelta: +2 },
    quarantine_affected_regions: { treasuryDelta: -60, foodDelta: -20, stabilityDelta: +5, regionConditionDelta: +4, commonerSatDelta: -2 },
    pray_for_divine_intervention:{ foodDelta: -50, faithDelta: +4, clergySatDelta: +3, commonerSatDelta: -4, stabilityDelta: -3 },
  },

  // ============================================================
  // 5. Livestock Plague — Critical
  // ============================================================
  evt_exp_fod_livestock_plague: {
    cull_all_sick_animals:       { foodDelta: -60, stabilityDelta: +5, commonerSatDelta: -6, regionConditionDelta: +3, treasuryDelta: -30 },
    import_healthy_stock:        { treasuryDelta: -100, foodDelta: +20, commonerSatDelta: +2, merchantSatDelta: -3, diplomacyDeltas: { neighbor_arenthal: +2 } },
    let_plague_run_its_course:   { foodDelta: -80, commonerSatDelta: -7, stabilityDelta: -5, regionConditionDelta: -4 },
  },

  // ============================================================
  // 6. Food Distribution Inequity — Serious
  // ============================================================
  evt_exp_fod_distribution_inequity: {
    mandate_equal_rationing:        { foodDelta: -10, commonerSatDelta: +5, nobilitySatDelta: -5, stabilityDelta: +3, clergySatDelta: +1 },
    open_royal_granaries:           { foodDelta: -30, commonerSatDelta: +6, treasuryDelta: -20, nobilitySatDelta: -2, stabilityDelta: +2 },
    maintain_current_distribution:  { commonerSatDelta: -4, stabilityDelta: -3, nobilitySatDelta: +2 },
  },

  // ============================================================
  // 7. Feast and Famine Cycle — Notable
  // ============================================================
  evt_exp_fod_feast_famine: {
    establish_food_reserves:  { treasuryDelta: -30, foodDelta: -10, stabilityDelta: +3, commonerSatDelta: +2, regionDevelopmentDelta: +1 },
    sell_surplus_abroad:      { treasuryDelta: +35, foodDelta: -20, merchantSatDelta: +3, commonerSatDelta: -3, diplomacyDeltas: { neighbor_valdris: +2 } },
    do_nothing_special:       { commonerSatDelta: -2, stabilityDelta: -1 },
  },

  // ============================================================
  // 8. Agricultural Labour Shortage — Serious
  // ============================================================
  evt_exp_fod_labour_shortage: {
    conscript_urban_workers:   { foodDelta: +30, commonerSatDelta: -5, merchantSatDelta: -3, stabilityDelta: -2, regionConditionDelta: +2 },
    offer_land_grants:         { treasuryDelta: -50, foodDelta: +20, commonerSatDelta: +3, nobilitySatDelta: -4, regionDevelopmentDelta: +3 },
    accept_reduced_harvest:    { foodDelta: -20, commonerSatDelta: -3, stabilityDelta: -2 },
  },

  // ============================================================
  // 9. Food Hoarding by Nobles — Notable
  // ============================================================
  evt_exp_fod_noble_hoarding: {
    confiscate_noble_stores:       { foodDelta: +30, nobilitySatDelta: -5, commonerSatDelta: +4, stabilityDelta: -2 },
    negotiate_voluntary_sharing:   { foodDelta: +15, nobilitySatDelta: -2, commonerSatDelta: +2, treasuryDelta: -10 },
    allow_nobles_their_stores:     { nobilitySatDelta: +2, commonerSatDelta: -4, stabilityDelta: -2, foodDelta: -5 },
  },

  // ============================================================
  // 10. Foreign Food Imports Blocked — Critical
  // ============================================================
  evt_exp_fod_imports_blocked: {
    demand_trade_resumption:   { foodDelta: +20, diplomacyDeltas: { neighbor_valdris: -5 }, militaryReadinessDelta: +3, commonerSatDelta: -2, stabilityDelta: -2 },
    seek_arenthal_imports:     { treasuryDelta: -80, foodDelta: +50, diplomacyDeltas: { neighbor_arenthal: +4, neighbor_valdris: -3 }, merchantSatDelta: +2 },
    enforce_strict_rationing:  { foodDelta: +10, commonerSatDelta: -7, nobilitySatDelta: -3, stabilityDelta: +4, clergySatDelta: -1 },
  },
};
