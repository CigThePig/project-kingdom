// Workstream A — Task A4: Assessment Choice Effects
// Pattern: one option costs resources to learn more, one costs resources to
// hedge, one is free but risks exposure or missed opportunity.

import type { MechanicalEffectDelta } from '../../engine/types';

export const ASSESSMENT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // assess_border_movement — Ambiguous military activity on border
  // ============================================================
  assess_border_movement: {
    investigate_border_movement: {
      treasuryDelta: -20,
      espionageNetworkDelta: +4,
      stabilityDelta: +1,
    },
    reinforce_preemptively: {
      militaryReadinessDelta: +3,
      treasuryDelta: -30,
      commonerSatDelta: -1,
    },
    dismiss_border_reports: {
      stabilityDelta: -2,
      militaryReadinessDelta: -1,
    },
  },

  // ============================================================
  // assess_spy_report_unverified — Intelligence report with uncertain reliability
  // ============================================================
  assess_spy_report_unverified: {
    verify_intelligence: {
      treasuryDelta: -25,
      espionageNetworkDelta: +3,
      stabilityDelta: +2,
    },
    act_on_report: {
      espionageNetworkDelta: -2,
      stabilityDelta: +3,
      nobilitySatDelta: -2,
      treasuryDelta: -15,
    },
    file_away_report: {
      espionageNetworkDelta: -1,
      stabilityDelta: -1,
    },
  },

  // ============================================================
  // assess_diplomatic_signal — Neighbor makes subtle overture
  // ============================================================
  assess_diplomatic_signal: {
    reciprocate_overture: {
      treasuryDelta: -15,
      diplomacyDeltas: { __NEIGHBOR__: +8 },
      stabilityDelta: +1,
    },
    investigate_intent: {
      espionageNetworkDelta: +3,
      treasuryDelta: -20,
      diplomacyDeltas: { __NEIGHBOR__: -2 },
    },
    ignore_signal: {
      diplomacyDeltas: { __NEIGHBOR__: -3 },
      stabilityDelta: -1,
    },
  },

  // ============================================================
  // assess_internal_unrest_rumor — Reports of faction unrest
  // ============================================================
  assess_internal_unrest_rumor: {
    investigate_unrest_rumor: {
      treasuryDelta: -20,
      espionageNetworkDelta: +3,
      stabilityDelta: +2,
    },
    preemptive_concession: {
      commonerSatDelta: +2,
      nobilitySatDelta: -1,
      treasuryDelta: -15,
      stabilityDelta: +1,
    },
    monitor_quietly: {
      stabilityDelta: -2,
      commonerSatDelta: -1,
    },
  },

  // ============================================================
  // assess_foreign_famine — Neighbor reportedly suffering
  // ============================================================
  assess_foreign_famine: {
    send_humanitarian_aid: {
      foodDelta: -20,
      treasuryDelta: -15,
      diplomacyDeltas: { __NEIGHBOR__: +12 },
      faithDelta: +2,
      commonerSatDelta: +1,
    },
    exploit_weakness: {
      diplomacyDeltas: { __NEIGHBOR__: -8 },
      merchantSatDelta: +3,
      treasuryDelta: +20,
      clergySatDelta: -2,
    },
    observe_from_distance: {
      diplomacyDeltas: { __NEIGHBOR__: -2 },
    },
  },

  // ============================================================
  // assess_religious_movement — New religious movement emerging
  // ============================================================
  assess_religious_movement: {
    investigate_movement: {
      treasuryDelta: -20,
      espionageNetworkDelta: +2,
      clergySatDelta: +1,
      heterodoxyDelta: -2,
    },
    suppress_early: {
      commonerSatDelta: -3,
      clergySatDelta: +3,
      heterodoxyDelta: -4,
      stabilityDelta: -1,
    },
    allow_to_grow: {
      heterodoxyDelta: +4,
      culturalCohesionDelta: -2,
      commonerSatDelta: +1,
    },
  },

  // ============================================================
  // Expansion — 6 additional assessment effects
  // ============================================================
  assess_merchant_caravan_disappearance: {
    fund_investigation: {
      treasuryDelta: -25,
      espionageNetworkDelta: +3,
      merchantSatDelta: +1,
      stabilityDelta: +1,
    },
    increase_road_patrols: {
      treasuryDelta: -20,
      militaryReadinessDelta: -2,
      merchantSatDelta: +2,
      commonerSatDelta: -1,
    },
    accept_losses: {
      merchantSatDelta: -3,
      treasuryDelta: -10,
      stabilityDelta: -1,
    },
  },

  assess_scholarly_heresy_manuscript: {
    examine_manuscript: {
      treasuryDelta: -15,
      culturalCohesionDelta: +3,
      heterodoxyDelta: +2,
      clergySatDelta: -2,
    },
    seize_and_suppress: {
      clergySatDelta: +3,
      heterodoxyDelta: -3,
      culturalCohesionDelta: -2,
      commonerSatDelta: -1,
    },
    ignore_the_text: {
      heterodoxyDelta: +1,
      culturalCohesionDelta: -1,
    },
  },

  assess_crop_blight_reports: {
    dispatch_agronomists: {
      treasuryDelta: -20,
      foodDelta: +10,
      commonerSatDelta: +1,
      stabilityDelta: +1,
    },
    preemptive_rationing: {
      foodDelta: +5,
      commonerSatDelta: -3,
      stabilityDelta: -1,
      merchantSatDelta: -1,
    },
    wait_for_confirmation: {
      foodDelta: -5,
      stabilityDelta: -1,
    },
  },

  assess_noble_faction_meeting: {
    infiltrate_meeting: {
      espionageNetworkDelta: +4,
      treasuryDelta: -20,
      nobilitySatDelta: -3,
    },
    confront_directly: {
      nobilitySatDelta: -2,
      stabilityDelta: +2,
      commonerSatDelta: +1,
    },
    let_them_meet: {
      nobilitySatDelta: +1,
      stabilityDelta: -2,
    },
  },

  assess_coastal_vessel_sighting: {
    send_naval_scouts: {
      treasuryDelta: -25,
      espionageNetworkDelta: +3,
      diplomacyDeltas: { __NEIGHBOR__: +5 },
    },
    fortify_harbor: {
      militaryReadinessDelta: +3,
      treasuryDelta: -30,
      merchantSatDelta: -2,
    },
    observe_and_log: {
      espionageNetworkDelta: -1,
      diplomacyDeltas: { __NEIGHBOR__: -2 },
    },
  },

  assess_strange_illness_outbreak: {
    quarantine_affected_area: {
      commonerSatDelta: -3,
      merchantSatDelta: -2,
      stabilityDelta: +3,
      foodDelta: -10,
    },
    investigate_cause: {
      treasuryDelta: -25,
      clergySatDelta: +1,
      commonerSatDelta: +1,
      stabilityDelta: +1,
    },
    dismiss_as_seasonal: {
      commonerSatDelta: -2,
      stabilityDelta: -2,
    },
  },
};
