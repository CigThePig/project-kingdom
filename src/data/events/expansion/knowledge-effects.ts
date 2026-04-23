import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_KNOWLEDGE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Scholar Dispute at the Royal Academy (Notable, developing)
  // ============================================================
  evt_exp_kno_scholar_dispute: {
    side_with_traditionalists: {
      faithDelta: +3,
      clergySatDelta: +4,
      commonerSatDelta: -2,
      stabilityDelta: +1,
    },
    side_with_reformers: {
      faithDelta: -2,
      clergySatDelta: -3,
      commonerSatDelta: +3,
      culturalCohesionDelta: +2,
      stabilityDelta: -1,
    },
    let_them_settle_it: {
      stabilityDelta: -1,
      clergySatDelta: -1,
    },
  },

  // ============================================================
  // 2. Foreign Manuscript Arrives (Informational, opening)
  // ============================================================
  evt_exp_kno_foreign_manuscript: {
    commission_translation: {
      treasuryDelta: -15,
      culturalCohesionDelta: +2,
      clergySatDelta: +2,
    },
    archive_untranslated: {
      clergySatDelta: +1,
    },
  },

  // ============================================================
  // 3. Alchemist's Volatile Discovery (Serious, established)
  // ============================================================
  evt_exp_kno_alchemist_discovery: {
    fund_military_application: {
      treasuryDelta: -70,
      militaryEquipmentDelta: +5,
      militaryReadinessDelta: +4,
      commonerSatDelta: -3,
      stabilityDelta: -2,
    },
    restrict_to_civilian_use: {
      treasuryDelta: -40,
      regionDevelopmentDelta: +4,
      commonerSatDelta: +3,
      militaryCasteSatDelta: -2,
    },
    suppress_findings: {
      stabilityDelta: +2,
      clergySatDelta: +3,
      culturalCohesionDelta: -3,
      commonerSatDelta: -2,
    },
  },

  // ============================================================
  // 4. Library Fire Threatens Archives (Critical, established)
  // ============================================================
  evt_exp_kno_library_fire: {
    emergency_salvage_operation: {
      treasuryDelta: -100,
      culturalCohesionDelta: +4,
      clergySatDelta: +5,
      regionConditionDelta: -3,
      stabilityDelta: +2,
    },
    protect_rarest_volumes: {
      treasuryDelta: -40,
      culturalCohesionDelta: +2,
      clergySatDelta: +2,
      regionConditionDelta: -5,
      commonerSatDelta: -3,
    },
    let_it_burn: {
      culturalCohesionDelta: -5,
      clergySatDelta: -6,
      stabilityDelta: -4,
      commonerSatDelta: -2,
    },
  },

  // ============================================================
  // 5. Student Uprising at the Academy (Serious, developing)
  // ============================================================
  evt_exp_kno_student_uprising: {
    negotiate_with_students: {
      treasuryDelta: -30,
      commonerSatDelta: +5,
      nobilitySatDelta: -3,
      stabilityDelta: +2,
    },
    disperse_by_force: {
      commonerSatDelta: -4,
      militaryCasteSatDelta: +2,
      stabilityDelta: +3,
      culturalCohesionDelta: -2,
    },
    close_academy_temporarily: {
      stabilityDelta: +1,
      commonerSatDelta: -2,
      clergySatDelta: -3,
      culturalCohesionDelta: -2,
    },
  },

  // ============================================================
  // 6. Clergy Demand Knowledge Censorship (Serious, established)
  // ============================================================
  evt_exp_kno_censorship_demand: {
    enforce_censorship: {
      faithDelta: +4,
      clergySatDelta: +5,
      heterodoxyDelta: -5,
      culturalCohesionDelta: -3,
      commonerSatDelta: -3,
      merchantSatDelta: -2,
    },
    protect_free_inquiry: {
      faithDelta: -3,
      clergySatDelta: -4,
      heterodoxyDelta: +3,
      culturalCohesionDelta: +4,
      commonerSatDelta: +2,
      stabilityDelta: -2,
    },
    create_review_board: {
      treasuryDelta: -30,
      faithDelta: +1,
      clergySatDelta: +2,
      culturalCohesionDelta: +1,
      stabilityDelta: +1,
      nobilitySatDelta: +2,
    },
  },

  // ============================================================
  // 7. Engineering Breakthrough — Aqueduct Design (Notable, established)
  // ============================================================
  evt_exp_kno_aqueduct_design: {
    fund_construction: {
      treasuryDelta: -50,
      regionDevelopmentDelta: +6,
      commonerSatDelta: +4,
      foodDelta: +10,
      stabilityDelta: +1,
    },
    limited_trial: {
      treasuryDelta: -25,
      regionDevelopmentDelta: +3,
      commonerSatDelta: +2,
      foodDelta: +5,
    },
    shelve_plans: {
      commonerSatDelta: -1,
      clergySatDelta: +1,
    },
  },

  // ============================================================
  // 8. Herbalist Discovers Plague Remedy (Serious, any)
  // ============================================================
  evt_exp_kno_plague_remedy: {
    mass_produce_remedy: {
      treasuryDelta: -60,
      foodDelta: +15,
      commonerSatDelta: +5,
      stabilityDelta: +3,
      clergySatDelta: -2,
    },
    test_on_volunteers: {
      treasuryDelta: -25,
      commonerSatDelta: +2,
      stabilityDelta: +1,
      foodDelta: +5,
    },
    dismiss_as_quackery: {
      clergySatDelta: +2,
      commonerSatDelta: -3,
      stabilityDelta: -2,
      treasuryDelta: -5,
    },
  },

  // ============================================================
  // 9. Cartographer Maps New Trade Route (Notable, developing)
  // ============================================================
  evt_exp_kno_cartographer_route: {
    fund_expedition: {
      treasuryDelta: -40,
      merchantSatDelta: +4,
      commonerSatDelta: +1,
      regionDevelopmentDelta: +3,
      stabilityDelta: -1,
    },
    sell_maps_to_merchants: {
      treasuryDelta: +30,
      merchantSatDelta: +3,
      nobilitySatDelta: -2,
      espionageNetworkDelta: -2,
    },
    keep_maps_secret: {
      espionageNetworkDelta: +2,
      merchantSatDelta: -2,
    },
  },

  // ============================================================
  // 10. Mathematical Treatise Challenges Tax System (Notable, established)
  // ============================================================
  evt_exp_kno_math_treatise: {
    adopt_new_methods: {
      treasuryDelta: +35,
      nobilitySatDelta: -3,
      commonerSatDelta: +3,
      stabilityDelta: -1,
    },
    commission_rebuttal: {
      treasuryDelta: -20,
      nobilitySatDelta: +3,
      clergySatDelta: +2,
      commonerSatDelta: -1,
    },
    ignore_treatise: {
      clergySatDelta: -1,
      commonerSatDelta: -1,
    },
  },

  // ============================================================
  // 11. Printing Press Prototype (Critical, established)
  // ============================================================
  evt_exp_kno_printing_press: {
    fund_mass_production: {
      treasuryDelta: -120,
      culturalCohesionDelta: +6,
      commonerSatDelta: +6,
      merchantSatDelta: +4,
      clergySatDelta: -4,
      heterodoxyDelta: +5,
      stabilityDelta: -3,
      regionDevelopmentDelta: +3,
    },
    restrict_to_crown: {
      treasuryDelta: -60,
      nobilitySatDelta: +3,
      espionageNetworkDelta: +3,
      clergySatDelta: +2,
      commonerSatDelta: -3,
      culturalCohesionDelta: +2,
      regionDevelopmentDelta: +1,
    },
    ban_device: {
      faithDelta: +3,
      clergySatDelta: +5,
      commonerSatDelta: -5,
      merchantSatDelta: -4,
      culturalCohesionDelta: -4,
      regionConditionDelta: -1,
      stabilityDelta: +2,
    },
  },

  // ============================================================
  // 12. Rival Kingdom Hoards Knowledge (Serious, any)
  // ============================================================
  evt_exp_kno_rival_hoards: {
    send_spies_to_copy: {
      treasuryDelta: -50,
      espionageNetworkDelta: +4,
      culturalCohesionDelta: +2,
      stabilityDelta: -2,
      diplomacyDeltas: { valdris: -5 },
    },
    propose_knowledge_exchange: {
      treasuryDelta: -20,
      culturalCohesionDelta: +3,
      clergySatDelta: +2,
      diplomacyDeltas: { valdris: +5 },
      espionageNetworkDelta: -2,
    },
    develop_independently: {
      treasuryDelta: -40,
      culturalCohesionDelta: +1,
      stabilityDelta: +1,
      commonerSatDelta: -1,
    },
  },

  // ============================================================
  // 13. Astronomical Observatory Proposal (Informational, developing)
  // ============================================================
  evt_exp_kno_observatory_proposal: {
    approve_funding: {
      treasuryDelta: -15,
      culturalCohesionDelta: +2,
      clergySatDelta: +2,
      regionDevelopmentDelta: +2,
    },
    defer_to_next_season: {
      clergySatDelta: -1,
      stabilityDelta: +1,
    },
  },

  // ============================================================
  // 14. Merchant Guild Demands Navigation Charts (Notable, any)
  // ============================================================
  evt_exp_kno_navigation_charts: {
    share_crown_charts: {
      merchantSatDelta: +4,
      treasuryDelta: +20,
      espionageNetworkDelta: -3,
      militaryReadinessDelta: -2,
    },
    commission_new_surveys: {
      treasuryDelta: -35,
      merchantSatDelta: +3,
      regionDevelopmentDelta: +2,
      stabilityDelta: +1,
    },
    deny_request: {
      merchantSatDelta: -3,
      espionageNetworkDelta: +1,
      stabilityDelta: +1,
      treasuryDelta: -3,
    },
  },

  // ============================================================
  // 15. Wandering Philosopher Seeks Patronage (Informational, opening)
  // ============================================================
  evt_exp_kno_wandering_philosopher: {
    grant_patronage: {
      treasuryDelta: -10,
      culturalCohesionDelta: +2,
      clergySatDelta: +1,
      nobilitySatDelta: +1,
    },
    politely_decline: {
      commonerSatDelta: +1,
    },
  },

  // ============================================================
  // 16. Competing Factions Vie for Ancient Codex (Informational, any)
  // ============================================================
  evt_exp_kno_ancient_codex: {
    award_to_clergy: {
      faithDelta: +2,
      clergySatDelta: +3,
      nobilitySatDelta: -2,
      culturalCohesionDelta: +1,
    },
    award_to_nobility: {
      nobilitySatDelta: +3,
      clergySatDelta: -2,
      stabilityDelta: +1,
    },
    place_in_public_archive: {
      commonerSatDelta: +2,
      culturalCohesionDelta: +1,
      clergySatDelta: -1,
      nobilitySatDelta: -1,
    },
  },
};
