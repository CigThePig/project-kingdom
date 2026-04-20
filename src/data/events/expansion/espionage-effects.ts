import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_ESPIONAGE_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Informational (3)
  // ============================================================
  evt_exp_esp_coded_correspondence: {
    fund_codebreakers: {
      treasuryDelta: -15,
      espionageNetworkDelta: +3,
      merchantSatDelta: -1,
    },
    archive_for_later: {
      espionageNetworkDelta: +1,
    },
  },
  evt_exp_esp_informant_tip: {
    reward_informant: {
      treasuryDelta: -10,
      espionageNetworkDelta: +2,
      stabilityDelta: +1,
    },
    note_intelligence: {
      espionageNetworkDelta: +1,
      stabilityDelta: +1,
    },
  },
  evt_exp_esp_spy_equipment_advance: {
    commission_equipment: {
      treasuryDelta: -30,
      espionageNetworkDelta: +3,
      merchantSatDelta: +2,
    },
    acknowledge_progress: {
      espionageNetworkDelta: +1,
      merchantSatDelta: +1,
    },
  },

  // ============================================================
  // Notable (6)
  // ============================================================
  evt_exp_esp_double_agent_dilemma: {
    turn_agent_double: {
      espionageNetworkDelta: +5,
      treasuryDelta: -40,
      stabilityDelta: -1,
      diplomacyDeltas: { neighbor_arenthal: -5 },
    },
    extract_and_debrief: {
      espionageNetworkDelta: +3,
      treasuryDelta: -20,
      stabilityDelta: +1,
    },
    feed_disinformation: {
      espionageNetworkDelta: +2,
      stabilityDelta: -2,
      diplomacyDeltas: { neighbor_valdris: -3 },
      militaryReadinessDelta: +2,
    },
  },
  evt_exp_esp_foreign_spy_ring: {
    dismantle_network: {
      espionageNetworkDelta: +4,
      stabilityDelta: +2,
      treasuryDelta: -35,
      diplomacyDeltas: { neighbor_valdris: -5 },
    },
    surveil_and_exploit: {
      espionageNetworkDelta: +5,
      stabilityDelta: -1,
      nobilitySatDelta: -2,
    },
    expel_suspects: {
      espionageNetworkDelta: +1,
      stabilityDelta: +1,
      commonerSatDelta: -1,
    },
  },
  evt_exp_esp_blackmail_discovery: {
    confront_noble_privately: {
      nobilitySatDelta: -3,
      stabilityDelta: +2,
      espionageNetworkDelta: +2,
    },
    use_leverage_quietly: {
      nobilitySatDelta: +3,
      espionageNetworkDelta: +3,
      stabilityDelta: -2,
      faithDelta: -1,
    },
    destroy_evidence: {
      nobilitySatDelta: +1,
      espionageNetworkDelta: -1,
      stabilityDelta: +1,
    },
  },
  evt_exp_esp_intercepted_dispatches: {
    share_with_arenthal: {
      espionageNetworkDelta: +3,
      diplomacyDeltas: { neighbor_arenthal: +8, neighbor_valdris: -5 },
      stabilityDelta: +1,
    },
    confront_valdris: {
      espionageNetworkDelta: +2,
      diplomacyDeltas: { neighbor_valdris: +3 },
      stabilityDelta: -1,
      militaryReadinessDelta: +2,
    },
    file_intelligence: {
      espionageNetworkDelta: +2,
      stabilityDelta: +1,
    },
  },
  evt_exp_esp_mole_hunt: {
    thorough_investigation: {
      treasuryDelta: -50,
      espionageNetworkDelta: +5,
      stabilityDelta: -2,
      nobilitySatDelta: -2,
    },
    controlled_leak_test: {
      treasuryDelta: -20,
      espionageNetworkDelta: +3,
      stabilityDelta: -1,
    },
    tighten_protocols: {
      espionageNetworkDelta: +1,
      stabilityDelta: +1,
      merchantSatDelta: -1,
    },
  },
  evt_exp_esp_defector_opportunity: {
    grant_asylum: {
      treasuryDelta: -30,
      espionageNetworkDelta: +5,
      diplomacyDeltas: { neighbor_arenthal: -8 },
      commonerSatDelta: -1,
    },
    debrief_and_return: {
      espionageNetworkDelta: +3,
      diplomacyDeltas: { neighbor_arenthal: +3 },
      stabilityDelta: +1,
    },
    refuse_defector: {
      espionageNetworkDelta: -1,
      diplomacyDeltas: { neighbor_arenthal: +2 },
      stabilityDelta: +1,
    },
  },

  // ============================================================
  // Serious (5)
  // ============================================================
  evt_exp_esp_assassination_plot: {
    preemptive_arrests: {
      stabilityDelta: +3,
      espionageNetworkDelta: +4,
      nobilitySatDelta: -4,
      commonerSatDelta: -2,
      treasuryDelta: -40,
    },
    double_royal_guard: {
      treasuryDelta: -60,
      militaryReadinessDelta: -3,
      stabilityDelta: +2,
      militaryCasteSatDelta: +2,
    },
    set_counter_trap: {
      espionageNetworkDelta: +6,
      stabilityDelta: -1,
      treasuryDelta: -30,
      nobilitySatDelta: -2,
    },
  },
  evt_exp_esp_counter_espionage_raid: {
    full_scale_raid: {
      espionageNetworkDelta: +6,
      militaryReadinessDelta: -4,
      treasuryDelta: -60,
      diplomacyDeltas: { neighbor_valdris: -10 },
      stabilityDelta: +3,
      regionConditionDelta: -2,
    },
    surgical_strike: {
      espionageNetworkDelta: +4,
      militaryReadinessDelta: -2,
      treasuryDelta: -30,
      diplomacyDeltas: { neighbor_valdris: -5 },
      stabilityDelta: +1,
    },
    diplomatic_protest: {
      espionageNetworkDelta: +1,
      diplomacyDeltas: { neighbor_valdris: +3 },
      stabilityDelta: +2,
      nobilitySatDelta: +2,
      militaryCasteSatDelta: -3,
    },
  },
  evt_exp_esp_poisoning_attempt: {
    purge_kitchen_staff: {
      stabilityDelta: +2,
      commonerSatDelta: -4,
      espionageNetworkDelta: +2,
    },
    hire_royal_taster: {
      treasuryDelta: -40,
      stabilityDelta: +3,
      espionageNetworkDelta: +1,
    },
    trace_poison_source: {
      treasuryDelta: -60,
      espionageNetworkDelta: +5,
      stabilityDelta: +4,
      commonerSatDelta: -2,
      nobilitySatDelta: -2,
    },
  },
  evt_exp_esp_intelligence_failure: {
    rebuild_network: {
      treasuryDelta: -80,
      espionageNetworkDelta: +6,
      stabilityDelta: -1,
    },
    scapegoat_spymaster: {
      espionageNetworkDelta: -3,
      stabilityDelta: +2,
      nobilitySatDelta: +2,
      commonerSatDelta: +1,
    },
    accept_losses: {
      espionageNetworkDelta: -2,
      stabilityDelta: -1,
      militaryReadinessDelta: -2,
    },
  },
  evt_exp_esp_secret_alliance_exposed: {
    publicly_confirm: {
      diplomacyDeltas: { neighbor_arenthal: +5, neighbor_valdris: -20 },
      stabilityDelta: +3,
      espionageNetworkDelta: -2,
      militaryReadinessDelta: +3,
    },
    deny_and_distance: {
      diplomacyDeltas: { neighbor_arenthal: -5, neighbor_valdris: +3 },
      stabilityDelta: -2,
      espionageNetworkDelta: +3,
      nobilitySatDelta: -2,
    },
    reframe_as_trade_pact: {
      diplomacyDeltas: { neighbor_arenthal: -2, neighbor_valdris: -3 },
      stabilityDelta: +1,
      merchantSatDelta: +3,
      espionageNetworkDelta: +1,
    },
  },

  // ============================================================
  // Critical (3)
  // ============================================================
  evt_exp_esp_enemy_infiltration: {
    martial_law_purge: {
      stabilityDelta: +5,
      espionageNetworkDelta: +6,
      commonerSatDelta: -6,
      nobilitySatDelta: -4,
      treasuryDelta: -80,
      militaryReadinessDelta: -3,
    },
    targeted_counter_ops: {
      espionageNetworkDelta: +8,
      treasuryDelta: -100,
      stabilityDelta: +3,
      militaryReadinessDelta: -2,
      commonerSatDelta: -2,
    },
    negotiate_withdrawal: {
      espionageNetworkDelta: -4,
      diplomacyDeltas: { neighbor_valdris: +5, neighbor_arenthal: +5 },
      stabilityDelta: -3,
      treasuryDelta: -60,
      militaryCasteSatDelta: -4,
    },
  },
  evt_exp_esp_underground_resistance: {
    infiltrate_resistance: {
      espionageNetworkDelta: +8,
      treasuryDelta: -80,
      commonerSatDelta: -5,
      stabilityDelta: +4,
      regionConditionDelta: -2,
    },
    address_grievances: {
      commonerSatDelta: +6,
      treasuryDelta: -70,
      stabilityDelta: +5,
      nobilitySatDelta: -4,
      espionageNetworkDelta: -2,
    },
    military_crackdown: {
      militaryReadinessDelta: -5,
      commonerSatDelta: -6,
      stabilityDelta: +3,
      espionageNetworkDelta: +4,
      regionConditionDelta: -4,
      treasuryDelta: -50,
    },
  },
  evt_exp_esp_military_secrets_stolen: {
    change_all_plans: {
      treasuryDelta: -120,
      militaryReadinessDelta: -5,
      espionageNetworkDelta: +4,
      stabilityDelta: +4,
      militaryCasteSatDelta: -3,
    },
    hunt_the_thief: {
      treasuryDelta: -80,
      espionageNetworkDelta: +8,
      militaryReadinessDelta: -3,
      stabilityDelta: -2,
      diplomacyDeltas: { neighbor_arenthal: -5 },
    },
    feed_false_plans: {
      espionageNetworkDelta: +6,
      treasuryDelta: -40,
      militaryReadinessDelta: +3,
      stabilityDelta: -3,
      diplomacyDeltas: { neighbor_arenthal: -3 },
    },
  },

  // ============================================================
  // 18. Spymaster Introduction — Informational
  // ============================================================
  evt_exp_esp_spymaster_introduction: {
    fund_intelligence_network:     { treasuryDelta: -20, espionageNetworkDelta: +4, stabilityDelta: +1 },
    request_dossiers_on_neighbors: { treasuryDelta: -10, espionageNetworkDelta: +2, diplomacyDeltas: { neighbor_arenthal: +1, neighbor_valdris: +1 } },
    acknowledge_and_dismiss:       { espionageNetworkDelta: -1 },
  },
};
