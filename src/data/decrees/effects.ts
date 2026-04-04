// Phase 6 — Decree Consequence Preview Effects
// Maps each decree ID to its approximate MechanicalEffectDelta for UI preview.
// These are directional indicators, not exact engine calculations.

import type { MechanicalEffectDelta } from '../../engine/types';

export const DECREE_EFFECTS: Record<string, MechanicalEffectDelta> = {
  // ====================
  // Economic (3)
  // ====================
  decree_market_charter: {
    merchantSatDelta: +3,
    commonerSatDelta: +1,
  },
  decree_emergency_levy: {
    treasuryDelta: +80,
    merchantSatDelta: -4,
    commonerSatDelta: -3,
    nobilitySatDelta: -2,
  },
  decree_trade_subsidies: {
    merchantSatDelta: +5,
    commonerSatDelta: +1,
  },

  // ====================
  // Military (3)
  // ====================
  decree_fortify_borders: {
    militaryReadinessDelta: +5,
    militaryCasteSatDelta: +2,
  },
  decree_arms_commission: {
    militaryEquipmentDelta: +8,
    militaryCasteSatDelta: +2,
    merchantSatDelta: +1,
  },
  decree_general_mobilization: {
    militaryReadinessDelta: +10,
    militaryMoraleDelta: +3,
    militaryCasteSatDelta: +3,
    commonerSatDelta: -4,
    treasuryDelta: -30,
  },

  // ====================
  // Civic (3)
  // ====================
  decree_road_improvement: {
    merchantSatDelta: +2,
    commonerSatDelta: +1,
    regionDevelopmentDelta: +3,
  },
  decree_census: {
    stabilityDelta: +2,
    nobilitySatDelta: -1,
  },
  decree_administrative_reform: {
    stabilityDelta: +5,
    nobilitySatDelta: -3,
    clergySatDelta: -2,
  },

  // ====================
  // Religious (3)
  // ====================
  decree_call_festival: {
    faithDelta: +5,
    clergySatDelta: +3,
    commonerSatDelta: +2,
  },
  decree_invest_religious_order: {
    faithDelta: +3,
    clergySatDelta: +4,
  },
  decree_suppress_heresy: {
    heterodoxyDelta: -8,
    clergySatDelta: +2,
    commonerSatDelta: -2,
  },

  // ====================
  // Diplomatic (3)
  // ====================
  decree_diplomatic_envoy: {
    nobilitySatDelta: +1,
  },
  decree_trade_agreement: {
    merchantSatDelta: +3,
    nobilitySatDelta: +1,
  },
  decree_royal_marriage: {
    nobilitySatDelta: +4,
    clergySatDelta: +1,
  },

  // ====================
  // Social (3)
  // ====================
  decree_public_granary: {
    commonerSatDelta: +4,
    foodDelta: +10,
  },
  decree_labor_rights: {
    commonerSatDelta: +5,
    merchantSatDelta: -2,
    nobilitySatDelta: -2,
  },
  decree_land_redistribution: {
    commonerSatDelta: +8,
    nobilitySatDelta: -6,
    clergySatDelta: -4,
  },
};
