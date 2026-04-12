// Narrative Pressure — Storyline Activation Profiles
// Maps each storyline to its pressure-based activation requirements.
// No logic — pure data definitions.

import type { StorylineActivationProfile } from '../../engine/types';

/**
 * Activation profiles keyed by storyline definition ID.
 * Each profile defines what pressure thresholds must be met for that
 * storyline to become eligible for activation.
 */
export const STORYLINE_ACTIVATION_PROFILES: Record<string, StorylineActivationProfile> = {
  // The Pretender's Claim — authority-driven political crisis
  sl_pretenders_claim: {
    primaryAxis: 'authority',
    primaryThreshold: 35,
    minTurn: 9,
    priority: 5,
  },

  // The Prophet of the Waste — grassroots religious movement
  sl_prophet_of_the_waste: {
    primaryAxis: 'piety',
    primaryThreshold: 30,
    suppressedByAxis: 'authority',
    suppressedByThreshold: 40,
    minTurn: 9,
    priority: 5,
  },

  // The Frozen March — military crisis on the northern border
  sl_frozen_march: {
    primaryAxis: 'militarism',
    primaryThreshold: 35,
    minTurn: 10,
    priority: 5,
  },

  // The Merchant King — rising mercantile power threatens the throne
  sl_merchant_king: {
    primaryAxis: 'commerce',
    primaryThreshold: 35,
    suppressedByAxis: 'authority',
    suppressedByThreshold: 35,
    minTurn: 10,
    priority: 5,
  },

  // The Lost Expedition — discovery in the wilderness
  sl_lost_expedition: {
    primaryAxis: 'openness',
    primaryThreshold: 25,
    secondaryAxis: 'commerce',
    secondaryThreshold: 15,
    minTurn: 10,
    priority: 4,
  },

  // The Foreign Festival — cultural exchange and its consequences
  sl_foreign_festival: {
    primaryAxis: 'openness',
    primaryThreshold: 30,
    suppressedByAxis: 'isolation',
    suppressedByThreshold: 25,
    minTurn: 9,
    priority: 4,
  },

  // The Merchant's Rebellion — guild power play
  sl_merchants_rebellion: {
    primaryAxis: 'commerce',
    primaryThreshold: 40,
    secondaryAxis: 'reform',
    secondaryThreshold: 15,
    minTurn: 11,
    priority: 6,
  },

  // The Holy War — religious-military crusade
  sl_holy_war: {
    primaryAxis: 'piety',
    primaryThreshold: 40,
    secondaryAxis: 'militarism',
    secondaryThreshold: 20,
    minTurn: 12,
    priority: 7,
  },

  // The Prodigal Prince — intrigue-driven succession crisis
  sl_prodigal_prince: {
    primaryAxis: 'intrigue',
    primaryThreshold: 30,
    minTurn: 11,
    priority: 5,
  },

  // The Plague Ships — universal failsafe storyline
  // Uses the dominant axis (any axis above 20 qualifies).
  // The engine evaluates primaryAxis against the player's actual dominant axis.
  // This is implemented by setting a low threshold on 'authority' as a representative axis,
  // but the actual activation check in evaluateStorylineActivation handles this as a special case.
  // Instead, we use the lowest-common-denominator approach: threshold 20 on each axis is tested
  // by creating this with authority as primary. The Plague Ships is the fallback —
  // its priority of 1 means it only fires if nothing else qualifies.
  sl_plague_ships: {
    primaryAxis: 'authority',
    primaryThreshold: 20,
    minTurn: 8,
    priority: 1,
  },

  // The Great Tournament — military prestige + diplomatic showcase
  sl_great_tournament: {
    primaryAxis: 'militarism',
    primaryThreshold: 25,
    secondaryAxis: 'openness',
    secondaryThreshold: 15,
    minTurn: 10,
    priority: 4,
  },

  // The Starving Winter — consequences of isolation
  sl_starving_winter: {
    primaryAxis: 'isolation',
    primaryThreshold: 25,
    suppressedByAxis: 'commerce',
    suppressedByThreshold: 30,
    minTurn: 9,
    priority: 4,
  },
};
