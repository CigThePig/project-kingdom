// Phase 2 — Rival Kingdom Simulation Core
// Pure simulation layer. No UI, no I/O, no Math.random() — seeded RNG only.
//
// Every rival kingdom maintains its own treasury, food, stability, and
// political pressures. These tick each turn and drive AI action pressure
// scores (consumed by diplomacy.ts) and espionage findings (consumed by
// espionage.ts). Crises emerge from real state and paralyze the rival
// until the underlying condition recovers.

import {
  NeighborActionType,
  NeighborDisposition,
  NeighborState,
  RivalActionPressureScores,
  RivalCrisisType,
  RivalInternalEvent,
  RivalKingdomState,
} from '../types';
import { seededRandom } from '../../data/text/name-generation';

// ============================================================
// Tunable Constants
// ============================================================

const RECENT_EVENTS_CAP = 8;
const CRISIS_ENTER_THRESHOLD = 30;
const CRISIS_EXIT_THRESHOLD = 45;

// Per-turn drift magnitudes (before disposition/trend modifiers).
const TREASURY_DRIFT = 2;
const FOOD_DRIFT = 2;
const STABILITY_DRIFT = 1.5;
const MOOD_DRIFT = 1;

// Pressure decay pulls idle pressures back toward a 35 baseline each turn.
const PRESSURE_BASELINE = 35;
const PRESSURE_DECAY = 0.5;

// Rare crisis rolls (per turn, independent of threshold-triggered crises).
const PLAGUE_PROBABILITY = 0.004;
const SCHISM_PROBABILITY = 0.003;

// ============================================================
// Numeric Helpers
// ============================================================

function clamp(value: number, min = 0, max = 100): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function driftToward(current: number, target: number, step: number): number {
  if (current === target) return current;
  const delta = target - current;
  const move = Math.sign(delta) * Math.min(step, Math.abs(delta));
  return current + move;
}

function noise(rng: () => number, magnitude: number): number {
  return (rng() - 0.5) * 2 * magnitude;
}

function pickTrend(rng: () => number, bias: number): 'rising' | 'stable' | 'declining' {
  // bias in [-1, 1]: positive → lean rising, negative → lean declining.
  const roll = rng() + bias * 0.25;
  if (roll > 0.66) return 'rising';
  if (roll < 0.33) return 'declining';
  return 'stable';
}

function trendDelta(trend: 'rising' | 'stable' | 'declining'): number {
  if (trend === 'rising') return 1;
  if (trend === 'declining') return -1;
  return 0;
}

// ============================================================
// Disposition → pressure and starting profile
// ============================================================

interface DispositionProfile {
  expansionist: number;
  mercantile: number;
  pietistic: number;
  /** Multiplier on expansionist/pietistic accumulation; mood seed bias. */
  stabilityBias: number;
}

function profileForDisposition(disposition: NeighborDisposition): DispositionProfile {
  switch (disposition) {
    case NeighborDisposition.Aggressive:
      return { expansionist: 1.5, mercantile: 0.2, pietistic: 0.2, stabilityBias: -0.1 };
    case NeighborDisposition.Opportunistic:
      return { expansionist: 0.9, mercantile: 0.6, pietistic: 0.2, stabilityBias: 0 };
    case NeighborDisposition.Mercantile:
      return { expansionist: 0.3, mercantile: 1.5, pietistic: 0.2, stabilityBias: 0.1 };
    case NeighborDisposition.Cautious:
      return { expansionist: 0.2, mercantile: 0.4, pietistic: 0.8, stabilityBias: 0.15 };
    case NeighborDisposition.Isolationist:
      return { expansionist: 0.2, mercantile: 0.2, pietistic: 1.2, stabilityBias: 0.2 };
    default:
      return { expansionist: 0.5, mercantile: 0.5, pietistic: 0.5, stabilityBias: 0 };
  }
}

// ============================================================
// Initial State
// ============================================================

/**
 * Seeds an initial simulation state deterministically from a seed string.
 * Same (seed, disposition) always produces the same starting state.
 */
export function createInitialRivalState(
  seed: string,
  disposition: NeighborDisposition,
): RivalKingdomState {
  const rng = seededRandom(seed);
  const profile = profileForDisposition(disposition);

  const treasuryHealth = clamp(55 + noise(rng, 15) + profile.stabilityBias * 10);
  const foodSecurity = clamp(55 + noise(rng, 12) + profile.stabilityBias * 8);
  const internalStability = clamp(60 + noise(rng, 12) + profile.stabilityBias * 15);
  const populationMood = clamp(55 + noise(rng, 10) + profile.stabilityBias * 10);

  return {
    treasuryHealth,
    treasuryTrend: pickTrend(rng, profile.stabilityBias),
    foodSecurity,
    foodTrend: pickTrend(rng, profile.stabilityBias),
    internalStability,
    populationMood,
    expansionistPressure: clamp(30 + profile.expansionist * 15 + noise(rng, 8)),
    mercantilePressure: clamp(30 + profile.mercantile * 15 + noise(rng, 8)),
    pietisticPressure: clamp(30 + profile.pietistic * 15 + noise(rng, 8)),
    recentInternalEvents: [],
    isInCrisis: false,
    crisisType: null,
  };
}

// ============================================================
// Internal-event recording
// ============================================================

function appendInternalEvent(
  events: RivalInternalEvent[],
  entry: RivalInternalEvent,
): RivalInternalEvent[] {
  const next = [...events, entry];
  if (next.length > RECENT_EVENTS_CAP) {
    next.splice(0, next.length - RECENT_EVENTS_CAP);
  }
  return next;
}

// ============================================================
// Crisis Emergence
// ============================================================

/**
 * Picks an emerging crisis type if any condition has crossed the danger threshold,
 * or rolls rare plague/schism events. Returns null when no crisis emerges.
 * Does not mutate input state.
 */
export function evaluateRivalCrisisEmergence(
  rival: RivalKingdomState,
  rng: () => number,
): RivalCrisisType | null {
  if (rival.isInCrisis) return rival.crisisType;

  if (rival.foodSecurity < CRISIS_ENTER_THRESHOLD) {
    return RivalCrisisType.Famine;
  }
  if (rival.treasuryHealth < CRISIS_ENTER_THRESHOLD) {
    return RivalCrisisType.Insolvency;
  }
  if (rival.internalStability < CRISIS_ENTER_THRESHOLD) {
    return rng() < 0.2
      ? RivalCrisisType.SuccessionStruggle
      : RivalCrisisType.CivilUnrest;
  }

  // Rare stochastic crises independent of thresholds.
  const plagueRoll = rng();
  if (plagueRoll < PLAGUE_PROBABILITY) {
    return RivalCrisisType.Plague;
  }
  const schismRoll = rng();
  if (schismRoll < SCHISM_PROBABILITY) {
    return RivalCrisisType.ReligiousSchism;
  }

  return null;
}

function crisisResolved(rival: RivalKingdomState): boolean {
  if (!rival.isInCrisis || !rival.crisisType) return false;
  switch (rival.crisisType) {
    case RivalCrisisType.Famine:
      return rival.foodSecurity >= CRISIS_EXIT_THRESHOLD;
    case RivalCrisisType.Insolvency:
      return rival.treasuryHealth >= CRISIS_EXIT_THRESHOLD;
    case RivalCrisisType.CivilUnrest:
    case RivalCrisisType.SuccessionStruggle:
      return rival.internalStability >= CRISIS_EXIT_THRESHOLD;
    case RivalCrisisType.Plague:
      return rival.populationMood >= CRISIS_EXIT_THRESHOLD && rival.internalStability >= CRISIS_EXIT_THRESHOLD;
    case RivalCrisisType.ReligiousSchism:
      return rival.internalStability >= CRISIS_EXIT_THRESHOLD;
    default:
      return false;
  }
}

// ============================================================
// Tick
// ============================================================

/**
 * Advances a rival kingdom simulation by one turn. Returns a new state —
 * never mutates input. The RNG is a seeded generator owned by the caller
 * (turn-resolution builds one per neighbor per turn from runSeed + turn).
 *
 * neighborMilitaryStrength: large standing armies drain treasury slightly
 * and feed expansionist pressure when healthy.
 */
export function tickRivalKingdom(
  rival: RivalKingdomState,
  neighborMilitaryStrength: number,
  rng: () => number,
): RivalKingdomState {
  const inCrisis = rival.isInCrisis;
  const recoveryMultiplier = inCrisis ? 0.5 : 1;

  // --- Treasury ---
  const treasuryDrag = (neighborMilitaryStrength / 100) * 0.8; // upkeep cost
  const treasuryStep =
    trendDelta(rival.treasuryTrend) * TREASURY_DRIFT * recoveryMultiplier +
    noise(rng, 1.5) -
    treasuryDrag;
  const treasuryHealth = clamp(rival.treasuryHealth + treasuryStep);

  // --- Food (seasonal-ish: gentle sinusoid based on the RNG stream) ---
  const seasonal = (rng() - 0.5) * 2.4; // seasonal random walk stand-in
  const foodStep = trendDelta(rival.foodTrend) * FOOD_DRIFT * recoveryMultiplier + seasonal;
  const foodSecurity = clamp(rival.foodSecurity + foodStep);

  // --- Internal Stability drifts toward 50, faster when mood is healthy ---
  const stabilityTarget = 50 + (rival.populationMood - 50) * 0.3;
  const stabilityStep =
    driftToward(rival.internalStability, stabilityTarget, STABILITY_DRIFT * recoveryMultiplier) -
    rival.internalStability +
    noise(rng, 1.2);
  const internalStability = clamp(rival.internalStability + stabilityStep);

  // --- Population Mood tracks food + stability ---
  const moodTarget = 0.5 * foodSecurity + 0.5 * internalStability;
  const populationMood = clamp(
    driftToward(rival.populationMood, moodTarget, MOOD_DRIFT) + noise(rng, 0.8),
  );

  // --- Trends occasionally flip, more likely when in crisis ---
  const flipChance = inCrisis ? 0.2 : 0.12;
  const treasuryTrend = rng() < flipChance
    ? pickTrend(rng, (treasuryHealth - 50) / 100)
    : rival.treasuryTrend;
  const foodTrend = rng() < flipChance
    ? pickTrend(rng, (foodSecurity - 50) / 100)
    : rival.foodTrend;

  // --- Pressures: accumulate from disposition-less defaults; callers bias via profile in init.
  //     Here we just apply gentle drift: healthy state → pressure ambient, decay toward baseline.
  //     An aggressive kingdom with a healthy treasury and high military feeds expansionist up.
  const militaryFactor = neighborMilitaryStrength / 100;
  const healthFactor = (treasuryHealth + foodSecurity) / 200;
  const expansionistPressure = clamp(
    driftToward(rival.expansionistPressure, PRESSURE_BASELINE, PRESSURE_DECAY) +
      militaryFactor * healthFactor * 1.5 +
      noise(rng, 0.6),
  );
  const mercantilePressure = clamp(
    driftToward(rival.mercantilePressure, PRESSURE_BASELINE, PRESSURE_DECAY) +
      healthFactor * 1.0 +
      noise(rng, 0.6),
  );
  const pietisticPressure = clamp(
    driftToward(rival.pietisticPressure, PRESSURE_BASELINE, PRESSURE_DECAY) +
      (1 - healthFactor) * 0.6 +
      noise(rng, 0.6),
  );

  // --- Build candidate new state so crisis evaluation sees post-tick fields ---
  let recentInternalEvents = rival.recentInternalEvents;
  let next: RivalKingdomState = {
    ...rival,
    treasuryHealth,
    treasuryTrend,
    foodSecurity,
    foodTrend,
    internalStability,
    populationMood,
    expansionistPressure,
    mercantilePressure,
    pietisticPressure,
    recentInternalEvents,
  };

  // --- Crisis lifecycle ---
  if (next.isInCrisis && crisisResolved(next)) {
    recentInternalEvents = appendInternalEvent(recentInternalEvents, {
      turnRecorded: -1, // caller can stamp real turn when this is surfaced; internal-only
      type: `crisis_resolved_${next.crisisType ?? 'unknown'}`,
      severity: 'notable',
      resolved: true,
    });
    next = {
      ...next,
      isInCrisis: false,
      crisisType: null,
      recentInternalEvents,
    };
  } else if (!next.isInCrisis) {
    const emerging = evaluateRivalCrisisEmergence(next, rng);
    if (emerging) {
      recentInternalEvents = appendInternalEvent(recentInternalEvents, {
        turnRecorded: -1,
        type: `crisis_onset_${emerging}`,
        severity: emerging === RivalCrisisType.Plague ? 'major' : 'notable',
        resolved: false,
      });
      next = {
        ...next,
        isInCrisis: true,
        crisisType: emerging,
        recentInternalEvents,
      };
    }
  }

  // --- Minor background events (non-crisis colour) ---
  if (!next.isInCrisis && rng() < 0.05) {
    const roll = rng();
    let type = 'harvest_steady';
    if (roll < 0.25) type = 'market_boom';
    else if (roll < 0.5) type = 'border_skirmish';
    else if (roll < 0.75) type = 'festival_observed';
    recentInternalEvents = appendInternalEvent(recentInternalEvents, {
      turnRecorded: -1,
      type,
      severity: 'minor',
      resolved: true,
    });
    next = { ...next, recentInternalEvents };
  }

  return next;
}

// ============================================================
// Pressure → action scores
// ============================================================

function zeroScores(): RivalActionPressureScores {
  return {
    [NeighborActionType.TradeProposal]: 0,
    [NeighborActionType.TradeWithdrawal]: 0,
    [NeighborActionType.TreatyProposal]: 0,
    [NeighborActionType.Demand]: 0,
    [NeighborActionType.WarDeclaration]: 0,
    [NeighborActionType.PeaceOffer]: 0,
    [NeighborActionType.BorderTension]: 0,
    [NeighborActionType.MilitaryBuildup]: 0,
    [NeighborActionType.EspionageRetaliation]: 0,
    [NeighborActionType.ReligiousPressure]: 0,
  };
}

/**
 * Translates a rival's simulation pressures into a 0..1 multiplier per
 * NeighborActionType. Diplomacy AI multiplies its existing RNG gates by
 * these scores — so high expansionist pressure amplifies demands/wars, and
 * a rival in crisis has all scores reduced (paralysis).
 *
 * A score of 1.0 leaves the existing AI chance unchanged; 0.5 halves it;
 * 0 suppresses the action entirely.
 */
export function computeRivalActionPressure(
  rival: RivalKingdomState,
  neighbor: NeighborState,
): RivalActionPressureScores {
  const scores = zeroScores();

  const exp = rival.expansionistPressure / 100;
  const merc = rival.mercantilePressure / 100;
  const piety = rival.pietisticPressure / 100;

  // Expansionist → aggressive actions
  scores[NeighborActionType.WarDeclaration] = clamp(0.3 + exp * 1.2, 0, 1.5) / 1.5;
  scores[NeighborActionType.Demand] = clamp(0.4 + exp * 1.0, 0, 1.5) / 1.5;
  scores[NeighborActionType.MilitaryBuildup] = clamp(0.4 + exp * 1.1, 0, 1.5) / 1.5;
  scores[NeighborActionType.BorderTension] = clamp(0.4 + exp * 0.8, 0, 1.5) / 1.5;

  // Mercantile → trade actions
  scores[NeighborActionType.TradeProposal] = clamp(0.3 + merc * 1.2, 0, 1.5) / 1.5;
  scores[NeighborActionType.TradeWithdrawal] = clamp(0.4 + (1 - merc) * 0.8, 0, 1.5) / 1.5;
  scores[NeighborActionType.TreatyProposal] = clamp(0.3 + merc * 0.8 + piety * 0.3, 0, 1.5) / 1.5;

  // Pietistic → religious pressure
  scores[NeighborActionType.ReligiousPressure] = clamp(0.2 + piety * 1.3, 0, 1.5) / 1.5;

  // Peace offer is reactive — always leave at full chance; diplomacy.ts still gates on war weariness.
  scores[NeighborActionType.PeaceOffer] = 1;

  // Espionage retaliation is not simulation-driven; leave at full chance.
  scores[NeighborActionType.EspionageRetaliation] = 1;

  // War weariness during ongoing war suppresses fresh aggression.
  if (neighbor.isAtWarWithPlayer) {
    scores[NeighborActionType.WarDeclaration] = 0;
    scores[NeighborActionType.Demand] *= 0.4;
  }

  // Crises paralyze: clamp all offensive/economic initiative to <= 0.25.
  if (rival.isInCrisis) {
    const paralyzed: NeighborActionType[] = [
      NeighborActionType.WarDeclaration,
      NeighborActionType.Demand,
      NeighborActionType.MilitaryBuildup,
      NeighborActionType.BorderTension,
      NeighborActionType.TradeProposal,
      NeighborActionType.TreatyProposal,
      NeighborActionType.ReligiousPressure,
    ];
    for (const action of paralyzed) {
      scores[action] = Math.min(scores[action], 0.25);
    }
  }

  return scores;
}
