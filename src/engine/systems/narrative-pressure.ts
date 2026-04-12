// NARRATIVE-PRESSURE-SYSTEM.md — Engine system module
// Pressure application, dominant axis queries, and storyline activation evaluation.
// Pure functions. No React imports. No player-facing text.

import type {
  ActiveStoryline,
  NarrativePressure,
  PersistentConsequence,
} from '../types';
import type { StorylineDefinition } from '../events/storyline-engine';
import { PRESSURE_WEIGHTS } from '../../data/narrative-pressure/weights';
import {
  NARRATIVE_PRESSURE_MIN_TURN,
  STORYLINE_POST_RESOLUTION_COOLDOWN,
} from '../constants';

// ============================================================
// Pressure Application
// ============================================================

/**
 * Returns a fresh NarrativePressure with all axes at zero.
 */
export function createInitialNarrativePressure(): NarrativePressure {
  return {
    authority: 0,
    piety: 0,
    commerce: 0,
    militarism: 0,
    reform: 0,
    intrigue: 0,
    openness: 0,
    isolation: 0,
  };
}

/**
 * Applies pressure weights for a single player decision.
 * Returns updated NarrativePressure (does not mutate input).
 */
export function applyPressure(
  current: NarrativePressure,
  sourceType: string,
  sourceId: string,
  choiceId: string,
): NarrativePressure {
  const key = `${sourceType}:${sourceId}:${choiceId}`;
  const entry = PRESSURE_WEIGHTS[key];
  if (!entry) return current;

  const updated = { ...current };
  for (const [axis, weight] of Object.entries(entry.axisWeights)) {
    updated[axis as keyof NarrativePressure] += weight as number;
  }
  return updated;
}

// ============================================================
// Axis Queries
// ============================================================

/**
 * Returns the axis with the highest accumulated pressure.
 * Used for storyline activation and Codex display.
 */
export function getDominantAxis(pressure: NarrativePressure): {
  axis: keyof NarrativePressure;
  value: number;
} {
  let maxAxis: keyof NarrativePressure = 'authority';
  let maxValue = 0;
  for (const [axis, value] of Object.entries(pressure)) {
    if (value > maxValue) {
      maxAxis = axis as keyof NarrativePressure;
      maxValue = value;
    }
  }
  return { axis: maxAxis, value: maxValue };
}

/**
 * Returns the axis with the second-highest accumulated pressure.
 * Used for Codex narrative pulse descriptions.
 */
export function getSecondHighestAxis(pressure: NarrativePressure): {
  axis: keyof NarrativePressure;
  value: number;
} {
  const dominant = getDominantAxis(pressure);
  let secondAxis: keyof NarrativePressure = 'authority';
  let secondValue = 0;
  for (const [axis, value] of Object.entries(pressure)) {
    if (axis !== dominant.axis && value > secondValue) {
      secondAxis = axis as keyof NarrativePressure;
      secondValue = value;
    }
  }
  return { axis: secondAxis, value: secondValue };
}

// ============================================================
// Storyline Activation
// ============================================================

export interface StorylineCandidate {
  storylineId: string;
  dominantAxis: keyof NarrativePressure;
  pressure: number;
  priority: number;
}

/**
 * Evaluates all storylines against current pressure state.
 * Returns the single best candidate for activation, or null.
 */
export function evaluateStorylineActivation(
  pressure: NarrativePressure,
  storylines: StorylineDefinition[],
  currentTurn: number,
  activeStorylines: ActiveStoryline[],
  resolvedStorylineIds: string[],
  persistentConsequences: PersistentConsequence[],
  lastStorylineResolutionTurn: number,
): StorylineCandidate | null {

  // Hard gate: no activation before turn 8
  if (currentTurn < NARRATIVE_PRESSURE_MIN_TURN) return null;

  // Hard gate: only one primary storyline at a time
  if (activeStorylines.length > 0) return null;

  // Hard gate: post-resolution cooldown
  if (lastStorylineResolutionTurn > 0 &&
      currentTurn - lastStorylineResolutionTurn < STORYLINE_POST_RESOLUTION_COOLDOWN) {
    return null;
  }

  const candidates: StorylineCandidate[] = [];
  const tags = new Set(persistentConsequences.map(c => c.tag));

  for (const sl of storylines) {
    // Skip already resolved storylines
    if (resolvedStorylineIds.includes(sl.id)) continue;

    const profile = sl.activationProfile;

    // Check minimum turn
    if (currentTurn < profile.minTurn) continue;

    // Check primary axis threshold.
    // For the universal failsafe (priority 1), check if ANY axis exceeds the threshold.
    // This implements the "any axis > N" rule from the spec for storylines like Plague Ships.
    if (profile.priority === 1) {
      const dominant = getDominantAxis(pressure);
      if (dominant.value < profile.primaryThreshold) continue;
    } else {
      if (pressure[profile.primaryAxis] < profile.primaryThreshold) continue;
    }

    // Check secondary axis threshold (if defined)
    if (profile.secondaryAxis && profile.secondaryThreshold !== undefined) {
      if (pressure[profile.secondaryAxis] < profile.secondaryThreshold) continue;
    }

    // Check suppressor axis (if defined)
    if (profile.suppressedByAxis && profile.suppressedByThreshold !== undefined) {
      if (pressure[profile.suppressedByAxis] > profile.suppressedByThreshold) continue;
    }

    // Check required tags
    if (profile.requiredTags?.some(t => !tags.has(t))) continue;

    // Check blocking tags
    if (profile.blockedByTags?.some(t => tags.has(t))) continue;

    candidates.push({
      storylineId: sl.id,
      dominantAxis: profile.primaryAxis,
      pressure: pressure[profile.primaryAxis],
      priority: profile.priority,
    });
  }

  if (candidates.length === 0) return null;

  // Pick the candidate with highest priority, breaking ties by pressure value
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.pressure - a.pressure;
  });

  return candidates[0];
}
