// Ruling Style System — Pure functions for style axis accumulation and queries.
// No UI imports. No side effects. State in, state out.

import { StyleAxis, PopulationClass } from '../types';
import type { RulingStyleState, StyleDecision } from '../types';
import {
  RULING_STYLE_AXIS_MIN,
  RULING_STYLE_AXIS_MAX,
  RULING_STYLE_WINDOW_SIZE,
  RULING_STYLE_LEGACY_THRESHOLDS,
  RULING_STYLE_DOMINANT_AXIS_THRESHOLD,
  RULING_STYLE_CLASS_AFFINITY,
} from '../constants';

// ============================================================
// Initialization
// ============================================================

const ZERO_AXES: Record<StyleAxis, number> = {
  [StyleAxis.Authority]: 0,
  [StyleAxis.Economy]: 0,
  [StyleAxis.Military]: 0,
  [StyleAxis.Faith]: 0,
};

export function createInitialRulingStyleState(): RulingStyleState {
  return {
    axes: { ...ZERO_AXES },
    recentDecisions: [],
    crossedThresholds: {},
  };
}

// ============================================================
// Accumulation
// ============================================================

function clampAxis(value: number): number {
  return Math.max(RULING_STYLE_AXIS_MIN, Math.min(RULING_STYLE_AXIS_MAX, value));
}

export function recalculateAxes(decisions: StyleDecision[]): Record<StyleAxis, number> {
  const axes = { ...ZERO_AXES };
  for (const decision of decisions) {
    for (const [axis, delta] of Object.entries(decision.axisDeltas)) {
      axes[axis as StyleAxis] += delta!;
    }
  }
  // Clamp all axes
  for (const axis of Object.values(StyleAxis)) {
    axes[axis] = clampAxis(axes[axis]);
  }
  return axes;
}

export function accumulateStyleDecision(
  state: RulingStyleState,
  decision: StyleDecision,
): RulingStyleState {
  const updated = [...state.recentDecisions, decision];
  // Trim to rolling window
  const trimmed = updated.length > RULING_STYLE_WINDOW_SIZE
    ? updated.slice(updated.length - RULING_STYLE_WINDOW_SIZE)
    : updated;

  return {
    ...state,
    recentDecisions: trimmed,
    axes: recalculateAxes(trimmed),
  };
}

// ============================================================
// Threshold Crossing Detection
// ============================================================

export interface ThresholdCrossing {
  axis: StyleAxis;
  threshold: number;       // 30 or 45
  direction: 'positive' | 'negative';  // which pole was reached
}

function thresholdKey(axis: StyleAxis, threshold: number, direction: 'positive' | 'negative'): string {
  const sign = direction === 'positive' ? '+' : '-';
  return `${axis}_${sign}${threshold}`;
}

export function checkThresholdCrossings(
  prevState: RulingStyleState,
  newState: RulingStyleState,
): ThresholdCrossing[] {
  const crossings: ThresholdCrossing[] = [];

  for (const axis of Object.values(StyleAxis)) {
    const newVal = newState.axes[axis];
    const prevVal = prevState.axes[axis];

    for (const threshold of RULING_STYLE_LEGACY_THRESHOLDS) {
      // Positive direction
      if (newVal >= threshold && prevVal < threshold) {
        const key = thresholdKey(axis, threshold, 'positive');
        if (!newState.crossedThresholds[key]) {
          crossings.push({ axis, threshold, direction: 'positive' });
        }
      }
      // Negative direction
      if (newVal <= -threshold && prevVal > -threshold) {
        const key = thresholdKey(axis, threshold, 'negative');
        if (!newState.crossedThresholds[key]) {
          crossings.push({ axis, threshold, direction: 'negative' });
        }
      }
    }
  }

  return crossings;
}

export function markThresholdsCrossed(
  state: RulingStyleState,
  crossings: ThresholdCrossing[],
): RulingStyleState {
  if (crossings.length === 0) return state;
  const updated = { ...state.crossedThresholds };
  for (const c of crossings) {
    updated[thresholdKey(c.axis, c.threshold, c.direction)] = true;
  }
  return { ...state, crossedThresholds: updated };
}

// ============================================================
// Faction Satisfaction Modifier
// ============================================================

/**
 * Returns a satisfaction modifier for the given population class based on
 * the current ruling style axes. Range roughly −2 to +2.
 *
 * Each axis has a favored and disfavored class. The modifier scales linearly:
 * axis value / 50 * 2 for the favored class, negated for the disfavored class.
 */
export function getStyleModifierForClass(
  axes: Record<StyleAxis, number>,
  populationClass: PopulationClass,
): number {
  let modifier = 0;
  for (const axis of Object.values(StyleAxis)) {
    const affinity = RULING_STYLE_CLASS_AFFINITY[axis];
    const axisValue = axes[axis];
    if (affinity.favors === populationClass) {
      modifier += (axisValue / RULING_STYLE_AXIS_MAX) * 2;
    }
    if (affinity.disfavors === populationClass) {
      modifier -= (axisValue / RULING_STYLE_AXIS_MAX) * 2;
    }
  }
  return modifier;
}

// ============================================================
// Decree Pool Weighting
// ============================================================

/**
 * Returns style axes with |value| >= the dominant threshold.
 * Used to bias decree card selection toward the player's established style.
 */
export function getDominantAxes(axes: Record<StyleAxis, number>): StyleAxis[] {
  return Object.values(StyleAxis).filter(
    (axis) => Math.abs(axes[axis]) >= RULING_STYLE_DOMINANT_AXIS_THRESHOLD,
  );
}
