import type { MechanicalEffectDelta } from '../../engine/types';

export const EXPANSION_DECREE_EFFECTS: Record<string, MechanicalEffectDelta> = {
  // ============================================================
  // Chain: Espionage (3 tiers)
  // ============================================================
  decree_exp_spy_network: {
    espionageNetworkDelta: +3,
    nobilitySatDelta: -1,
    treasuryDelta: -20,
  },
  decree_exp_intelligence_bureau: {
    espionageNetworkDelta: +5,
    nobilitySatDelta: -3,
    treasuryDelta: -35,
    stabilityDelta: +1,
  },
  decree_exp_shadow_council: {
    espionageNetworkDelta: +8,
    nobilitySatDelta: -5,
    stabilityDelta: +3,
    treasuryDelta: -50,
    commonerSatDelta: -2,
  },

  // ============================================================
  // Chain: Education (3 tiers)
  // ============================================================
  decree_exp_village_schools: {
    commonerSatDelta: +2,
    culturalCohesionDelta: +1,
    treasuryDelta: -20,
  },
  decree_exp_provincial_academies: {
    commonerSatDelta: +3,
    culturalCohesionDelta: +3,
    clergySatDelta: -1,
    treasuryDelta: -35,
  },
  decree_exp_university_system: {
    commonerSatDelta: +4,
    culturalCohesionDelta: +6,
    clergySatDelta: -3,
    nobilitySatDelta: -2,
    treasuryDelta: -60,
  },

  // ============================================================
  // Chain: Agriculture Reform (3 tiers)
  // ============================================================
  decree_exp_land_reform: {
    foodDelta: +10,
    commonerSatDelta: +3,
    nobilitySatDelta: -4,
    treasuryDelta: -15,
  },
  decree_exp_irrigation_authority: {
    foodDelta: +15,
    commonerSatDelta: +2,
    regionDevelopmentDelta: +2,
    treasuryDelta: -30,
  },
  decree_exp_agricultural_modernization: {
    foodDelta: +25,
    commonerSatDelta: +3,
    merchantSatDelta: +2,
    regionDevelopmentDelta: +4,
    treasuryDelta: -50,
  },

  // ============================================================
  // Chain: Justice (3 tiers)
  // ============================================================
  decree_exp_circuit_courts: {
    stabilityDelta: +2,
    commonerSatDelta: +2,
    nobilitySatDelta: -1,
    treasuryDelta: -15,
  },
  decree_exp_common_law: {
    stabilityDelta: +3,
    commonerSatDelta: +3,
    nobilitySatDelta: -3,
    merchantSatDelta: +2,
    treasuryDelta: -25,
  },
  decree_exp_supreme_tribunal: {
    stabilityDelta: +6,
    commonerSatDelta: +4,
    nobilitySatDelta: -5,
    merchantSatDelta: +3,
    clergySatDelta: -2,
    treasuryDelta: -40,
  },

  // ============================================================
  // Standalone: Economic (2)
  // ============================================================
  decree_exp_trade_caravan: {
    treasuryDelta: +25,
    merchantSatDelta: +2,
  },
  decree_exp_mint_coinage: {
    treasuryDelta: +15,
    merchantSatDelta: +2,
    commonerSatDelta: +1,
    stabilityDelta: +1,
  },

  // ============================================================
  // Standalone: Military (2)
  // ============================================================
  decree_exp_levy_militia: {
    militaryReadinessDelta: +3,
    commonerSatDelta: -2,
    foodDelta: -5,
  },
  decree_exp_war_engineers: {
    militaryEquipmentDelta: +4,
    militaryReadinessDelta: +2,
    treasuryDelta: -30,
  },

  // ============================================================
  // Standalone: Civic (2)
  // ============================================================
  decree_exp_infrastructure_audit: {
    regionConditionDelta: +3,
    regionDevelopmentDelta: +1,
    treasuryDelta: -10,
  },
  decree_exp_anti_corruption_campaign: {
    commonerSatDelta: +3,
    nobilitySatDelta: -3,
    stabilityDelta: +2,
    treasuryDelta: -15,
  },

  // ============================================================
  // Standalone: Religious (2)
  // ============================================================
  decree_exp_interfaith_council: {
    heterodoxyDelta: -3,
    clergySatDelta: +2,
    faithDelta: +2,
    commonerSatDelta: +1,
    treasuryDelta: -15,
  },
  decree_exp_blessing_ceremony: {
    faithDelta: +3,
    clergySatDelta: +2,
    commonerSatDelta: +1,
    treasuryDelta: -10,
  },

  // ============================================================
  // Standalone: Diplomatic (2)
  // ============================================================
  decree_exp_peace_envoy: {
    diplomacyDeltas: { neighbor_arenthal: +3, neighbor_valdris: +3 },
    militaryCasteSatDelta: -1,
    treasuryDelta: -15,
  },
  decree_exp_cultural_exchange_program: {
    culturalCohesionDelta: +2,
    diplomacyDeltas: { neighbor_arenthal: +2, neighbor_valdris: +2 },
    clergySatDelta: -1,
    treasuryDelta: -20,
  },

  // ============================================================
  // Standalone: Social (2)
  // ============================================================
  decree_exp_emergency_grain: {
    foodDelta: -15,
    commonerSatDelta: +3,
    stabilityDelta: +1,
  },
  decree_exp_public_works: {
    regionDevelopmentDelta: +3,
    regionConditionDelta: +2,
    commonerSatDelta: +2,
    treasuryDelta: -25,
  },
};
