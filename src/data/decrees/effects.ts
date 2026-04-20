// Phase 6 — Decree Consequence Preview Effects
// Maps each decree ID to its approximate MechanicalEffectDelta for UI preview.
// These are directional indicators, not exact engine calculations.

import type { MechanicalEffectDelta } from '../../engine/types';
import { EXPANSION_DECREE_EFFECTS } from './expansion-effects';
import { EXPANSION_WAVE_2_DECREE_EFFECTS } from './expansion-wave-2/effects';

export const DECREE_EFFECTS: Record<string, MechanicalEffectDelta> = {
  // ====================
  // Economic (3)
  // ====================
  // --- Market Chain ---
  decree_market_charter: {
    merchantSatDelta: +3,
    commonerSatDelta: +1,
  },
  decree_trade_guild_expansion: {
    merchantSatDelta: +5,
    commonerSatDelta: +2,
    treasuryDelta: +30,
  },
  decree_merchant_republic_charter: {
    merchantSatDelta: +8,
    commonerSatDelta: +3,
    treasuryDelta: +60,
    nobilitySatDelta: -4,
  },
  // --- Trade Chain ---
  decree_trade_subsidies: {
    merchantSatDelta: +5,
    commonerSatDelta: +1,
  },
  decree_trade_monopoly: {
    merchantSatDelta: +6,
    treasuryDelta: +50,
    nobilitySatDelta: -3,
  },
  decree_international_trade_empire: {
    merchantSatDelta: +8,
    commonerSatDelta: +3,
    treasuryDelta: +80,
    nobilitySatDelta: -4,
  },
  // --- Emergency Levy (repeatable) ---
  decree_emergency_levy: {
    treasuryDelta: +80,
    merchantSatDelta: -4,
    commonerSatDelta: -3,
    nobilitySatDelta: -2,
  },

  // ====================
  // Military (3)
  // ====================
  // --- Fortification Chain ---
  decree_fortify_borders: {
    militaryReadinessDelta: +5,
    militaryCasteSatDelta: +2,
  },
  decree_integrated_defense_network: {
    militaryReadinessDelta: +10,
    militaryMoraleDelta: +4,
    militaryCasteSatDelta: +3,
    commonerSatDelta: -2,
  },
  decree_fortress_kingdom: {
    militaryReadinessDelta: +15,
    militaryMoraleDelta: +6,
    militaryCasteSatDelta: +5,
    commonerSatDelta: -4,
    nobilitySatDelta: -2,
    regionDevelopmentDelta: +3,
  },
  // --- Arms Chain ---
  decree_arms_commission: {
    militaryEquipmentDelta: +8,
    militaryCasteSatDelta: +2,
    merchantSatDelta: +1,
  },
  decree_royal_arsenal: {
    militaryEquipmentDelta: +15,
    militaryCasteSatDelta: +4,
    merchantSatDelta: +3,
    treasuryDelta: -20,
  },
  decree_war_machine_industry: {
    militaryEquipmentDelta: +20,
    militaryCasteSatDelta: +5,
    merchantSatDelta: +4,
    commonerSatDelta: -3,
    treasuryDelta: -40,
  },
  // --- General Mobilization (repeatable) ---
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
  // --- Roads Chain ---
  decree_road_improvement: {
    merchantSatDelta: +2,
    commonerSatDelta: +1,
    regionDevelopmentDelta: +3,
  },
  decree_provincial_highway_system: {
    merchantSatDelta: +4,
    commonerSatDelta: +2,
    regionDevelopmentDelta: +5,
    treasuryDelta: -20,
  },
  decree_kingdom_transit_network: {
    merchantSatDelta: +6,
    commonerSatDelta: +3,
    militaryCasteSatDelta: +2,
    regionDevelopmentDelta: +8,
    treasuryDelta: -40,
  },
  // --- Census (repeatable) ---
  decree_census: {
    stabilityDelta: +2,
    nobilitySatDelta: -1,
    // A census tightens taxation and nets the treasury a modest bump.
    treasuryDelta: +10,
  },
  // --- Administration Chain ---
  decree_administrative_reform: {
    stabilityDelta: +5,
    nobilitySatDelta: -3,
    clergySatDelta: -2,
  },
  decree_royal_bureaucracy: {
    stabilityDelta: +7,
    nobilitySatDelta: -4,
    clergySatDelta: -3,
    commonerSatDelta: +2,
  },
  decree_centralized_governance: {
    stabilityDelta: +10,
    nobilitySatDelta: -6,
    clergySatDelta: -4,
    commonerSatDelta: +4,
  },

  // ====================
  // Religious (3)
  // ====================
  // --- Call Festival (repeatable) ---
  decree_call_festival: {
    faithDelta: +5,
    clergySatDelta: +3,
    commonerSatDelta: +2,
    // The crown bears the festival's public costs.
    treasuryDelta: -15,
  },
  // --- Faith Chain ---
  decree_invest_religious_order: {
    faithDelta: +3,
    clergySatDelta: +4,
  },
  decree_expand_religious_authority: {
    faithDelta: +5,
    clergySatDelta: +5,
    nobilitySatDelta: -3,
  },
  decree_theocratic_council: {
    faithDelta: +8,
    clergySatDelta: +6,
    nobilitySatDelta: -5,
    commonerSatDelta: -2,
    stabilityDelta: +3,
  },
  // --- Heresy Chain ---
  decree_suppress_heresy: {
    heterodoxyDelta: -8,
    clergySatDelta: +2,
    commonerSatDelta: -2,
  },
  decree_inquisitorial_authority: {
    heterodoxyDelta: -15,
    clergySatDelta: +3,
    commonerSatDelta: -5,
    nobilitySatDelta: -2,
  },
  decree_religious_unification: {
    heterodoxyDelta: -25,
    clergySatDelta: +5,
    commonerSatDelta: -8,
    nobilitySatDelta: -4,
    stabilityDelta: -3,
  },

  // ====================
  // Diplomatic (3)
  // ====================
  // --- Envoy Chain ---
  decree_diplomatic_envoy: {
    nobilitySatDelta: +1,
  },
  decree_permanent_embassy: {
    nobilitySatDelta: +2,
    merchantSatDelta: +2,
    stabilityDelta: +2,
  },
  decree_diplomatic_supremacy: {
    nobilitySatDelta: +4,
    merchantSatDelta: +3,
    clergySatDelta: +1,
    stabilityDelta: +4,
  },
  // --- Trade Agreement (standalone one-time) ---
  decree_trade_agreement: {
    merchantSatDelta: +3,
    nobilitySatDelta: +1,
  },
  // --- Marriage Chain ---
  decree_royal_marriage: {
    nobilitySatDelta: +4,
    clergySatDelta: +1,
  },
  decree_dynasty_alliance: {
    nobilitySatDelta: +5,
    clergySatDelta: +2,
    stabilityDelta: +3,
  },
  decree_imperial_confederation: {
    nobilitySatDelta: +6,
    clergySatDelta: +3,
    merchantSatDelta: +4,
    stabilityDelta: +5,
    treasuryDelta: -50,
  },

  // ====================
  // Social (3)
  // ====================
  // --- Granary Chain ---
  decree_public_granary: {
    commonerSatDelta: +4,
    foodDelta: +10,
  },
  decree_regional_food_distribution: {
    commonerSatDelta: +5,
    merchantSatDelta: +2,
    foodDelta: +20,
    stabilityDelta: +2,
  },
  decree_kingdom_breadbasket: {
    commonerSatDelta: +7,
    merchantSatDelta: +3,
    clergySatDelta: +1,
    foodDelta: +35,
    stabilityDelta: +4,
  },
  // --- Food Standalone Decrees ---
  decree_military_ration_reform: {
    foodDelta: +12,
    militaryCasteSatDelta: -2,
    militaryMoraleDelta: -1,
    commonerSatDelta: +1,
  },
  decree_seasonal_reserve_mandate: {
    foodDelta: +20,
    commonerSatDelta: +3,
    merchantSatDelta: -2,
    stabilityDelta: +2,
  },
  decree_agricultural_trade_compact: {
    foodDelta: +25,
    treasuryDelta: -30,
    merchantSatDelta: +3,
    commonerSatDelta: +2,
  },
  decree_harvest_tithe_exemption: {
    foodDelta: +18,
    treasuryDelta: -25,
    commonerSatDelta: +3,
    clergySatDelta: -2,
  },
  // --- Labor Chain ---
  decree_labor_rights: {
    commonerSatDelta: +5,
    merchantSatDelta: -2,
    nobilitySatDelta: -2,
  },
  decree_workers_guild_charter: {
    commonerSatDelta: +7,
    merchantSatDelta: -3,
    nobilitySatDelta: -3,
    stabilityDelta: +2,
  },
  decree_social_contract: {
    commonerSatDelta: +10,
    merchantSatDelta: -4,
    nobilitySatDelta: -5,
    clergySatDelta: -3,
    stabilityDelta: +4,
  },
  // --- Land Redistribution (standalone one-time) ---
  decree_land_redistribution: {
    commonerSatDelta: +8,
    nobilitySatDelta: -6,
    clergySatDelta: -4,
  },

  // ====================
  // Knowledge-Gated: Agricultural (2)
  // ====================
  decree_crop_rotation: {
    foodDelta: +15,
    commonerSatDelta: +2,
  },
  decree_irrigation_works: {
    foodDelta: +30,
    commonerSatDelta: +3,
    regionDevelopmentDelta: +4,
  },

  // ====================
  // Knowledge-Gated: Military (2)
  // ====================
  decree_advanced_fortifications: {
    militaryReadinessDelta: +8,
    militaryCasteSatDelta: +3,
    regionDevelopmentDelta: +2,
  },
  decree_elite_training_program: {
    militaryReadinessDelta: +12,
    militaryMoraleDelta: +5,
    militaryCasteSatDelta: +4,
    treasuryDelta: -40,
  },

  // ====================
  // Knowledge-Gated: Civic (2)
  // ====================
  decree_tax_code_reform: {
    treasuryDelta: +40,
    merchantSatDelta: +2,
    nobilitySatDelta: -2,
    stabilityDelta: +2,
  },
  decree_provincial_governance: {
    stabilityDelta: +6,
    regionDevelopmentDelta: +4,
    nobilitySatDelta: -4,
    commonerSatDelta: +3,
  },

  // ====================
  // Knowledge-Gated: Maritime/Trade (2)
  // ====================
  decree_harbor_expansion: {
    merchantSatDelta: +4,
    treasuryDelta: +20,
    regionDevelopmentDelta: +3,
  },
  decree_trade_fleet_commission: {
    merchantSatDelta: +6,
    treasuryDelta: +40,
    commonerSatDelta: +2,
  },

  // ====================
  // Knowledge-Gated: Cultural/Scholarly (2)
  // ====================
  decree_university_charter: {
    clergySatDelta: +3,
    culturalCohesionDelta: +3,
    commonerSatDelta: +1,
  },
  decree_diplomatic_academy: {
    nobilitySatDelta: +3,
    stabilityDelta: +3,
    culturalCohesionDelta: +2,
  },

  // ====================
  // Knowledge-Gated: Natural Philosophy (2)
  // ====================
  decree_engineering_corps: {
    regionDevelopmentDelta: +4,
    militaryReadinessDelta: +3,
    commonerSatDelta: +2,
  },
  decree_medical_reforms: {
    commonerSatDelta: +5,
    clergySatDelta: +2,
    stabilityDelta: +3,
    // Clergy-led healing orders lift faith as the reforms spread.
    faithDelta: +2,
  },

  // Expansion Decree Effects
  ...EXPANSION_DECREE_EFFECTS,

  // Phase 7 — Wave-2 Decree Effects
  ...EXPANSION_WAVE_2_DECREE_EFFECTS,
};
