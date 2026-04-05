// Narrative pacing — tracks event category recency and player behavior patterns
// to produce smarter, more varied event selection.
// Pure engine logic. No React imports.

import type { ActiveEvent, NarrativePacingState } from '../types';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../types';
import type { MechanicalEffectDelta } from '../types';

// ============================================================
// Initialization
// ============================================================

export function createInitialPacingState(): NarrativePacingState {
  return {
    recentCategoryTurns: {},
    recentSeverityCount: {
      [EventSeverity.Informational]: 0,
      [EventSeverity.Notable]: 0,
      [EventSeverity.Serious]: 0,
      [EventSeverity.Critical]: 0,
    },
    dominantClassFavor: null,
    classChoiceHistory: {
      [PopulationClass.Nobility]: 0,
      [PopulationClass.Clergy]: 0,
      [PopulationClass.Merchants]: 0,
      [PopulationClass.Commoners]: 0,
      [PopulationClass.MilitaryCaste]: 0,
    },
  };
}

// ============================================================
// Category Weight Calculation
// ============================================================

// Categories that fired recently get dampened; quiet categories get boosted.
const RECENT_TURN_DAMPEN_WINDOW = 2;   // fired within 2 turns: weight ×0.3
const QUIET_TURN_BOOST_THRESHOLD = 5;   // silent for 5+ turns: weight ×2.0
const DAMPEN_MULTIPLIER = 0.3;
const BOOST_MULTIPLIER = 2.0;

/**
 * Calculates a weight multiplier for each event category based on how recently
 * that category surfaced an event. Returns multipliers (default 1.0).
 */
export function calculateCategoryWeights(
  pacing: NarrativePacingState,
  currentTurn: number,
): Record<EventCategory, number> {
  const weights: Record<string, number> = {};

  for (const category of Object.values(EventCategory)) {
    const lastTurn = pacing.recentCategoryTurns[category];
    if (lastTurn === undefined) {
      // Never fired — give a moderate boost.
      weights[category] = BOOST_MULTIPLIER;
    } else {
      const turnsSince = currentTurn - lastTurn;
      if (turnsSince <= RECENT_TURN_DAMPEN_WINDOW) {
        weights[category] = DAMPEN_MULTIPLIER;
      } else if (turnsSince >= QUIET_TURN_BOOST_THRESHOLD) {
        weights[category] = BOOST_MULTIPLIER;
      } else {
        weights[category] = 1.0;
      }
    }
  }

  return weights as Record<EventCategory, number>;
}

// ============================================================
// Pacing State Updates
// ============================================================

/**
 * Updates pacing state after events are surfaced in a turn.
 * Records which categories fired and tracks severity distribution.
 */
export function updatePacingForSurfacedEvents(
  pacing: NarrativePacingState,
  surfacedEvents: ActiveEvent[],
  currentTurn: number,
): NarrativePacingState {
  if (surfacedEvents.length === 0) return pacing;

  const updatedCategoryTurns = { ...pacing.recentCategoryTurns };
  const updatedSeverityCount = { ...pacing.recentSeverityCount };

  for (const event of surfacedEvents) {
    updatedCategoryTurns[event.category] = currentTurn;
    updatedSeverityCount[event.severity] = (updatedSeverityCount[event.severity] || 0) + 1;
  }

  return {
    ...pacing,
    recentCategoryTurns: updatedCategoryTurns,
    recentSeverityCount: updatedSeverityCount,
  };
}

/**
 * Updates class favor tracking when a player resolves an event choice.
 * Examines the mechanical effects of the choice to determine which classes
 * were helped or hurt, adjusting the cumulative favor scores.
 */
export function updateClassFavorFromChoice(
  pacing: NarrativePacingState,
  effectDelta: MechanicalEffectDelta,
): NarrativePacingState {
  const history = { ...pacing.classChoiceHistory };

  // Track satisfaction changes as favor signals.
  if (effectDelta.nobilitySatDelta) history[PopulationClass.Nobility] += Math.sign(effectDelta.nobilitySatDelta);
  if (effectDelta.clergySatDelta) history[PopulationClass.Clergy] += Math.sign(effectDelta.clergySatDelta);
  if (effectDelta.merchantSatDelta) history[PopulationClass.Merchants] += Math.sign(effectDelta.merchantSatDelta);
  if (effectDelta.commonerSatDelta) history[PopulationClass.Commoners] += Math.sign(effectDelta.commonerSatDelta);
  if (effectDelta.militaryCasteSatDelta) history[PopulationClass.MilitaryCaste] += Math.sign(effectDelta.militaryCasteSatDelta);

  // Determine dominant class: the class with the highest cumulative favor.
  let dominant: PopulationClass | null = null;
  let highestFavor = 3; // minimum threshold to be considered "dominant"
  for (const [cls, score] of Object.entries(history)) {
    if (score > highestFavor) {
      highestFavor = score;
      dominant = cls as PopulationClass;
    }
  }

  return {
    ...pacing,
    classChoiceHistory: history,
    dominantClassFavor: dominant,
  };
}

// ============================================================
// Pattern Detection
// ============================================================

export interface PatternFlag {
  type: 'class_favor' | 'class_neglect';
  targetClass: PopulationClass;
  score: number;
}

/**
 * Detects player behavior patterns from the cumulative class favor history.
 * Returns flags that can be used to trigger pattern-reactive events.
 */
export function detectPlayerPatterns(pacing: NarrativePacingState): PatternFlag[] {
  const flags: PatternFlag[] = [];
  const FAVOR_THRESHOLD = 5;
  const NEGLECT_THRESHOLD = -4;

  for (const [cls, score] of Object.entries(pacing.classChoiceHistory)) {
    if (score >= FAVOR_THRESHOLD) {
      flags.push({ type: 'class_favor', targetClass: cls as PopulationClass, score });
    } else if (score <= NEGLECT_THRESHOLD) {
      flags.push({ type: 'class_neglect', targetClass: cls as PopulationClass, score });
    }
  }

  return flags;
}
