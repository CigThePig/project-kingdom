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
};
