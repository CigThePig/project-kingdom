// Phase 7 — Wave-2 Decree Consequence Preview Effects
// Parallel to `src/data/decrees/expansion-effects.ts`; merged into
// `DECREE_EFFECTS` via a spread in `src/data/decrees/effects.ts`.

import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_WAVE_2_DECREE_EFFECTS: Record<string, MechanicalEffectDelta> = {
  // ====================
  // Civic & Law
  // ====================
  decree_w2_codify_the_common_law: {
    stabilityDelta: +5,
    commonerSatDelta: +3,
    nobilitySatDelta: -3,
    treasuryDelta: -15,
  },
  decree_w2_expand_the_bureaucracy: {
    stabilityDelta: +3,
    treasuryDelta: -25,
    nobilitySatDelta: -1,
    clergySatDelta: -1,
  },
  decree_w2_free_cities_charter: {
    merchantSatDelta: +6,
    commonerSatDelta: +3,
    nobilitySatDelta: -4,
    treasuryDelta: +20,
    stabilityDelta: -1,
  },
  decree_w2_justice_circuits: {
    stabilityDelta: +3,
    commonerSatDelta: +2,
    nobilitySatDelta: -2,
    regionConditionDelta: +2,
    treasuryDelta: -10,
  },

  // ====================
  // Social
  // ====================
  decree_w2_sumptuary_laws: {
    nobilitySatDelta: +4,
    merchantSatDelta: -4,
    culturalCohesionDelta: +2,
  },
  decree_w2_hunting_regulations: {
    nobilitySatDelta: +3,
    commonerSatDelta: -3,
    foodDelta: -5,
  },
  decree_w2_language_standardization: {
    stabilityDelta: +2,
    nobilitySatDelta: +1,
    clergySatDelta: +1,
    culturalCohesionDelta: -3,
    commonerSatDelta: -1,
  },

  // ====================
  // Economic
  // ====================
  decree_w2_weights_and_measures: {
    merchantSatDelta: +3,
    commonerSatDelta: +2,
    treasuryDelta: +10,
    stabilityDelta: +1,
  },
  decree_w2_mint_standards: {
    merchantSatDelta: +3,
    commonerSatDelta: +2,
    treasuryDelta: +15,
    stabilityDelta: +2,
    nobilitySatDelta: -1,
  },
  decree_w2_road_construction: {
    merchantSatDelta: +5,
    regionDevelopmentDelta: +5,
    commonerSatDelta: -3,
    treasuryDelta: -20,
  },
  decree_w2_bridge_program: {
    merchantSatDelta: +3,
    commonerSatDelta: +2,
    regionDevelopmentDelta: +3,
    treasuryDelta: -15,
  },

  // ====================
  // Military
  // ====================
  decree_w2_military_reforms: {
    militaryReadinessDelta: +8,
    militaryEquipmentDelta: +6,
    militaryMoraleDelta: +3,
    militaryCasteSatDelta: +2,
    nobilitySatDelta: -4,
    treasuryDelta: -50,
  },

  // ====================
  // Religious
  // ====================
  decree_w2_religious_councils: {
    clergySatDelta: +3,
    heterodoxyDelta: -5,
    faithDelta: +2,
  },
  decree_w2_calendar_reform: {
    clergySatDelta: +2,
    culturalCohesionDelta: +2,
    commonerSatDelta: -2,
    faithDelta: +1,
  },

  // ====================
  // Civic (Cultural-Scholarly)
  // ====================
  decree_w2_university_charter: {
    clergySatDelta: +4,
    nobilitySatDelta: +2,
    culturalCohesionDelta: +4,
    treasuryDelta: -30,
    stabilityDelta: +2,
  },
};
