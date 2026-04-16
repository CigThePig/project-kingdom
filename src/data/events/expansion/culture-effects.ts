import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_CULTURE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- 1. Foreign Artistic Troupe (Informational, opening) ---
  evt_exp_cul_foreign_troupe: {
    welcome_performers: {
      culturalCohesionDelta: +2,
      commonerSatDelta: +2,
      treasuryDelta: -15,
      nobilitySatDelta: -1,
    },
    politely_decline: {
      culturalCohesionDelta: -1,
      stabilityDelta: +1,
    },
  },

  // --- 2. Monument Foundation (Notable, developing) ---
  evt_exp_cul_monument_foundation: {
    commission_grand_monument: {
      culturalCohesionDelta: +5,
      treasuryDelta: -50,
      regionDevelopmentDelta: +4,
      commonerSatDelta: -2,
    },
    build_modest_memorial: {
      culturalCohesionDelta: +3,
      treasuryDelta: -25,
      regionDevelopmentDelta: +2,
      stabilityDelta: +1,
    },
    defer_construction: {
      stabilityDelta: +1,
      culturalCohesionDelta: -1,
    },
  },

  // --- 3. Dialect Tensions (Serious, established) ---
  evt_exp_cul_dialect_tensions: {
    enforce_common_tongue: {
      culturalCohesionDelta: +4,
      stabilityDelta: +2,
      commonerSatDelta: -4,
      regionConditionDelta: -2,
    },
    protect_regional_dialects: {
      culturalCohesionDelta: -2,
      commonerSatDelta: +3,
      stabilityDelta: -2,
      regionDevelopmentDelta: +2,
    },
    promote_bilingual_policy: {
      culturalCohesionDelta: +2,
      treasuryDelta: -60,
      commonerSatDelta: +2,
      clergySatDelta: +2,
    },
  },

  // --- 4. Harvest Festival Tradition (Informational, any) ---
  evt_exp_cul_harvest_festival: {
    fund_grand_celebration: {
      culturalCohesionDelta: +2,
      commonerSatDelta: +3,
      treasuryDelta: -15,
      foodDelta: -10,
    },
    let_folk_celebrate: {
      culturalCohesionDelta: +1,
      commonerSatDelta: +1,
    },
  },

  // --- 5. Cultural Preservation Crisis (Critical, established) ---
  evt_exp_cul_preservation_crisis: {
    establish_preservation_council: {
      culturalCohesionDelta: +7,
      treasuryDelta: -100,
      clergySatDelta: +4,
      commonerSatDelta: +3,
      merchantSatDelta: -3,
    },
    embrace_cultural_change: {
      culturalCohesionDelta: -5,
      merchantSatDelta: +5,
      treasuryDelta: +40,
      commonerSatDelta: -4,
      faithDelta: -3,
    },
    suppress_foreign_influence: {
      culturalCohesionDelta: +3,
      stabilityDelta: -4,
      merchantSatDelta: -6,
      commonerSatDelta: +2,
      diplomacyDeltas: { empire_south: -10 },
    },
  },

  // --- 6. Arts Patronage Request (Notable, developing) ---
  evt_exp_cul_arts_patronage: {
    fund_royal_arts_guild: {
      culturalCohesionDelta: +4,
      treasuryDelta: -40,
      nobilitySatDelta: +4,
      commonerSatDelta: -2,
    },
    sponsor_traveling_artists: {
      culturalCohesionDelta: +3,
      treasuryDelta: -25,
      commonerSatDelta: +3,
      nobilitySatDelta: -1,
    },
    decline_patronage: {
      culturalCohesionDelta: -1,
      nobilitySatDelta: -2,
    },
  },

  // --- 7. Folk Tradition Revival (Informational, any) ---
  evt_exp_cul_folk_revival: {
    endorse_revival: {
      culturalCohesionDelta: +2,
      commonerSatDelta: +2,
      nobilitySatDelta: -1,
      faithDelta: +1,
    },
    observe_from_afar: {
      culturalCohesionDelta: +1,
      commonerSatDelta: +1,
    },
  },

  // --- 8. Literary Movement (Notable, established) ---
  evt_exp_cul_literary_movement: {
    fund_scriptoriums: {
      culturalCohesionDelta: +4,
      treasuryDelta: -35,
      clergySatDelta: +4,
      commonerSatDelta: -1,
    },
    commission_royal_chronicle: {
      culturalCohesionDelta: +3,
      treasuryDelta: -30,
      nobilitySatDelta: +3,
      clergySatDelta: +1,
      stabilityDelta: +1,
    },
    allow_natural_growth: {
      culturalCohesionDelta: +1,
      clergySatDelta: +1,
    },
  },

  // --- 9. Cultural Exchange Opportunity (Notable, developing) ---
  evt_exp_cul_exchange_opportunity: {
    send_cultural_delegation: {
      culturalCohesionDelta: +3,
      treasuryDelta: -35,
      diplomacyDeltas: { empire_south: +8 },
      nobilitySatDelta: +2,
    },
    invite_foreign_scholars: {
      culturalCohesionDelta: +2,
      treasuryDelta: -20,
      clergySatDelta: +3,
      heterodoxyDelta: +3,
    },
    politely_postpone: {
      culturalCohesionDelta: -1,
      diplomacyDeltas: { empire_south: -3 },
    },
  },

  // --- 10. Oral History Keeper (Serious, established) ---
  evt_exp_cul_oral_history_keeper: {
    appoint_royal_chronicler: {
      culturalCohesionDelta: +5,
      treasuryDelta: -60,
      clergySatDelta: +3,
      nobilitySatDelta: +2,
      commonerSatDelta: -2,
    },
    transcribe_oral_traditions: {
      culturalCohesionDelta: +4,
      treasuryDelta: -30,
      commonerSatDelta: +3,
      clergySatDelta: +2,
    },
    let_traditions_fade: {
      culturalCohesionDelta: -3,
      stabilityDelta: -1,
      commonerSatDelta: -2,
    },
  },

  // --- 11. Winter Storytelling Festival (Informational, any) ---
  evt_exp_cul_winter_stories: {
    host_royal_gathering: {
      culturalCohesionDelta: +2,
      commonerSatDelta: +2,
      treasuryDelta: -10,
      faithDelta: +1,
    },
    acknowledge_tradition: {
      culturalCohesionDelta: +1,
      stabilityDelta: +1,
    },
  },

  // --- 12. Assimilation Pressure (Critical, established) ---
  evt_exp_cul_assimilation_pressure: {
    resist_cultural_pressure: {
      culturalCohesionDelta: +6,
      militaryReadinessDelta: -5,
      treasuryDelta: -80,
      stabilityDelta: +3,
      diplomacyDeltas: { empire_south: -15 },
    },
    negotiate_cultural_treaty: {
      culturalCohesionDelta: +2,
      treasuryDelta: -40,
      diplomacyDeltas: { empire_south: +10 },
      stabilityDelta: +1,
      commonerSatDelta: -3,
    },
    accept_partial_integration: {
      culturalCohesionDelta: -6,
      merchantSatDelta: +5,
      treasuryDelta: +50,
      diplomacyDeltas: { empire_south: +15 },
      commonerSatDelta: -5,
      faithDelta: -3,
    },
  },

  // --- 13. Architectural Ambition (Serious, developing) ---
  evt_exp_cul_architectural_ambition: {
    build_great_cathedral: {
      culturalCohesionDelta: +5,
      treasuryDelta: -80,
      faithDelta: +5,
      clergySatDelta: +4,
      regionDevelopmentDelta: +5,
      commonerSatDelta: -3,
    },
    construct_public_amphitheater: {
      culturalCohesionDelta: +4,
      treasuryDelta: -50,
      commonerSatDelta: +4,
      regionDevelopmentDelta: +3,
      nobilitySatDelta: -1,
    },
    invest_in_housing: {
      culturalCohesionDelta: +1,
      treasuryDelta: -40,
      commonerSatDelta: +5,
      regionDevelopmentDelta: +4,
      stabilityDelta: +2,
    },
  },

  // --- 14. Spring Cultural Awakening (Notable, any) ---
  evt_exp_cul_spring_awakening: {
    sponsor_spring_arts: {
      culturalCohesionDelta: +4,
      treasuryDelta: -30,
      commonerSatDelta: +3,
      nobilitySatDelta: +2,
    },
    direct_energy_to_labor: {
      culturalCohesionDelta: -2,
      foodDelta: +15,
      commonerSatDelta: -2,
      stabilityDelta: +2,
    },
    let_creativity_bloom: {
      culturalCohesionDelta: +2,
      commonerSatDelta: +1,
    },
  },

  // --- 15. Heretical Art Scandal (Serious, established) ---
  evt_exp_cul_heretical_art: {
    destroy_offensive_works: {
      culturalCohesionDelta: -3,
      faithDelta: +4,
      clergySatDelta: +5,
      commonerSatDelta: -3,
      heterodoxyDelta: -5,
    },
    defend_artistic_freedom: {
      culturalCohesionDelta: +4,
      faithDelta: -3,
      clergySatDelta: -4,
      commonerSatDelta: +2,
      heterodoxyDelta: +4,
    },
    convene_clergy_tribunal: {
      culturalCohesionDelta: +1,
      treasuryDelta: -50,
      faithDelta: +2,
      clergySatDelta: +3,
      stabilityDelta: +2,
      heterodoxyDelta: -2,
    },
  },

  // --- 16. Cultural Identity Crisis (Critical, established) ---
  evt_exp_cul_identity_crisis: {
    reassert_national_identity: {
      culturalCohesionDelta: +8,
      treasuryDelta: -100,
      stabilityDelta: +4,
      commonerSatDelta: +4,
      merchantSatDelta: -5,
      diplomacyDeltas: { rival_north: -10 },
    },
    forge_new_cultural_synthesis: {
      culturalCohesionDelta: +3,
      treasuryDelta: -80,
      merchantSatDelta: +4,
      commonerSatDelta: -3,
      stabilityDelta: +2,
      diplomacyDeltas: { rival_north: +5 },
    },
    allow_regional_autonomy: {
      culturalCohesionDelta: -4,
      stabilityDelta: -3,
      commonerSatDelta: +3,
      regionDevelopmentDelta: +5,
      nobilitySatDelta: +3,
    },
  },

  // --- 17. Merchant Cultural Investment (Notable, any) ---
  evt_exp_cul_merchant_investment: {
    accept_merchant_patronage: {
      culturalCohesionDelta: +3,
      merchantSatDelta: +4,
      treasuryDelta: +20,
      nobilitySatDelta: -3,
      clergySatDelta: -1,
    },
    redirect_to_public_works: {
      culturalCohesionDelta: +2,
      treasuryDelta: -30,
      commonerSatDelta: +3,
      merchantSatDelta: -1,
      regionDevelopmentDelta: +3,
    },
    decline_with_gratitude: {
      merchantSatDelta: -2,
      nobilitySatDelta: +1,
    },
  },

  // --- 18. Military Tradition Ceremony (Serious, opening) ---
  evt_exp_cul_military_ceremony: {
    grand_military_parade: {
      culturalCohesionDelta: +4,
      treasuryDelta: -60,
      militaryMoraleDelta: +5,
      militaryCasteSatDelta: +5,
      commonerSatDelta: +2,
      stabilityDelta: -1,
    },
    solemn_remembrance: {
      culturalCohesionDelta: +3,
      treasuryDelta: -20,
      militaryMoraleDelta: +3,
      militaryCasteSatDelta: +3,
      faithDelta: +2,
    },
    skip_ceremony: {
      culturalCohesionDelta: -2,
      militaryCasteSatDelta: -3,
      militaryMoraleDelta: -2,
    },
  },

  // --- 19. Council Formation (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_cul_council_formation: {
    traditional_council:         { nobilitySatDelta: +3, clergySatDelta: +2, culturalCohesionDelta: +2, commonerSatDelta: -2, merchantSatDelta: -1 },
    meritocratic_council:        { merchantSatDelta: +3, commonerSatDelta: +2, nobilitySatDelta: -3, culturalCohesionDelta: -1, stabilityDelta: +1 },
    retain_predecessors_council: { stabilityDelta: +1, nobilitySatDelta: +1, commonerSatDelta: -1 },
  },
};
