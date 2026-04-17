// gameplay-blueprint.md §7, §8 — Event and Storyline Mechanical Effect Application
// Pure engine logic for applying MechanicalEffectDelta to GameState.
// No React imports. No player-facing text.

import {
  ActiveEvent,
  ActiveStoryline,
  GameState,
  MechanicalEffectDelta,
  OutcomeQuality,
  PopulationClass,
} from '../types';
import {
  applyRegionConditionChange,
  applyRegionDevelopmentChange,
} from '../systems/regions';
import { deriveDiplomaticPosture } from '../systems/diplomacy';
import { applyVariance, rollOutcomeQuality } from './outcome-variance';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function applyClassSatDelta(
  population: GameState['population'],
  cls: PopulationClass,
  delta: number,
): GameState['population'] {
  const prev = population[cls];
  return {
    ...population,
    [cls]: {
      ...prev,
      satisfaction: clamp(prev.satisfaction + delta, 0, 100),
    },
  };
}

// ============================================================
// Core Applicator
// ============================================================

/**
 * Applies a MechanicalEffectDelta to GameState, returning a new immutable state.
 * affectedRegionId is used for regionDevelopmentDelta and regionConditionDelta.
 */
export function applyMechanicalEffectDelta(
  state: GameState,
  delta: MechanicalEffectDelta,
  affectedRegionId: string | null,
): GameState {
  let s = state;

  // Treasury
  if (delta.treasuryDelta !== undefined && delta.treasuryDelta !== 0) {
    s = {
      ...s,
      treasury: {
        ...s.treasury,
        balance: Math.max(0, s.treasury.balance + delta.treasuryDelta),
      },
    };
  }

  // Food
  if (delta.foodDelta !== undefined && delta.foodDelta !== 0) {
    s = {
      ...s,
      food: {
        ...s.food,
        reserves: Math.max(0, s.food.reserves + delta.foodDelta),
      },
    };
  }

  // Stability
  if (delta.stabilityDelta !== undefined && delta.stabilityDelta !== 0) {
    s = {
      ...s,
      stability: {
        ...s.stability,
        value: clamp(s.stability.value + delta.stabilityDelta, 0, 100),
      },
    };
  }

  // Faith
  if (delta.faithDelta !== undefined && delta.faithDelta !== 0) {
    s = {
      ...s,
      faithCulture: {
        ...s.faithCulture,
        faithLevel: clamp(s.faithCulture.faithLevel + delta.faithDelta, 0, 100),
      },
    };
  }

  // Heterodoxy
  if (delta.heterodoxyDelta !== undefined && delta.heterodoxyDelta !== 0) {
    s = {
      ...s,
      faithCulture: {
        ...s.faithCulture,
        heterodoxy: clamp(s.faithCulture.heterodoxy + delta.heterodoxyDelta, 0, 100),
      },
    };
  }

  // Cultural Cohesion
  if (delta.culturalCohesionDelta !== undefined && delta.culturalCohesionDelta !== 0) {
    s = {
      ...s,
      faithCulture: {
        ...s.faithCulture,
        culturalCohesion: clamp(s.faithCulture.culturalCohesion + delta.culturalCohesionDelta, 0, 100),
      },
    };
  }

  // Military
  if (delta.militaryReadinessDelta !== undefined && delta.militaryReadinessDelta !== 0) {
    s = {
      ...s,
      military: {
        ...s.military,
        readiness: clamp(s.military.readiness + delta.militaryReadinessDelta, 0, 100),
      },
    };
  }
  if (delta.militaryMoraleDelta !== undefined && delta.militaryMoraleDelta !== 0) {
    s = {
      ...s,
      military: {
        ...s.military,
        morale: clamp(s.military.morale + delta.militaryMoraleDelta, 0, 100),
      },
    };
  }
  if (delta.militaryEquipmentDelta !== undefined && delta.militaryEquipmentDelta !== 0) {
    s = {
      ...s,
      military: {
        ...s.military,
        equipmentCondition: clamp(s.military.equipmentCondition + delta.militaryEquipmentDelta, 0, 100),
      },
    };
  }
  if (delta.militaryForceSizeDelta !== undefined && delta.militaryForceSizeDelta !== 0) {
    s = {
      ...s,
      military: {
        ...s.military,
        forceSize: Math.max(0, s.military.forceSize + delta.militaryForceSizeDelta),
      },
    };
  }

  // Espionage
  if (delta.espionageNetworkDelta !== undefined && delta.espionageNetworkDelta !== 0) {
    s = {
      ...s,
      espionage: {
        ...s.espionage,
        networkStrength: clamp(s.espionage.networkStrength + delta.espionageNetworkDelta, 0, 100),
      },
    };
  }

  // Class satisfaction deltas
  let pop = s.population;
  if (delta.nobilitySatDelta !== undefined && delta.nobilitySatDelta !== 0) {
    pop = applyClassSatDelta(pop, PopulationClass.Nobility, delta.nobilitySatDelta);
  }
  if (delta.clergySatDelta !== undefined && delta.clergySatDelta !== 0) {
    pop = applyClassSatDelta(pop, PopulationClass.Clergy, delta.clergySatDelta);
  }
  if (delta.merchantSatDelta !== undefined && delta.merchantSatDelta !== 0) {
    pop = applyClassSatDelta(pop, PopulationClass.Merchants, delta.merchantSatDelta);
  }
  if (delta.commonerSatDelta !== undefined && delta.commonerSatDelta !== 0) {
    pop = applyClassSatDelta(pop, PopulationClass.Commoners, delta.commonerSatDelta);
  }
  if (delta.militaryCasteSatDelta !== undefined && delta.militaryCasteSatDelta !== 0) {
    pop = applyClassSatDelta(pop, PopulationClass.MilitaryCaste, delta.militaryCasteSatDelta);
  }
  if (pop !== s.population) {
    s = { ...s, population: pop };
  }

  // Diplomacy deltas (per-neighbor relationship adjustments)
  if (delta.diplomacyDeltas !== undefined) {
    let neighbors = s.diplomacy.neighbors;
    for (const [neighborId, relDelta] of Object.entries(delta.diplomacyDeltas)) {
      neighbors = neighbors.map((n) => {
        if (n.id !== neighborId) return n;
        const newScore = clamp(n.relationshipScore + relDelta, 0, 100);
        return {
          ...n,
          relationshipScore: newScore,
          attitudePosture: deriveDiplomaticPosture(newScore),
        };
      });
    }
    s = { ...s, diplomacy: { ...s.diplomacy, neighbors } };
  }

  // Region development delta (applied to affectedRegionId)
  if (delta.regionDevelopmentDelta !== undefined && delta.regionDevelopmentDelta !== 0 && affectedRegionId !== null) {
    s = { ...s, regions: applyRegionDevelopmentChange(s.regions, affectedRegionId, delta.regionDevelopmentDelta) };
  }

  // Region condition delta (applied to affectedRegionId)
  if (delta.regionConditionDelta !== undefined && delta.regionConditionDelta !== 0 && affectedRegionId !== null) {
    s = { ...s, regions: applyRegionConditionChange(s.regions, affectedRegionId, delta.regionConditionDelta) };
  }

  return s;
}

// ============================================================
// Event-Specific Wrapper
// ============================================================

/**
 * Looks up and applies mechanical effects for a resolved event choice.
 * Rolls outcome variance to scale effects before application.
 * Returns state unchanged if event is unresolved or has no effect mapping.
 * Returns { state, outcomeQuality } so the caller can store the quality on the event.
 */
export function applyEventChoiceEffects(
  state: GameState,
  event: ActiveEvent,
  effectsRegistry: Record<string, Record<string, MechanicalEffectDelta>>,
  rng: () => number,
): { state: GameState; outcomeQuality: OutcomeQuality | null } {
  if (!event.isResolved || event.choiceMade === null) return { state, outcomeQuality: null };

  const eventEffects = effectsRegistry[event.definitionId];
  if (!eventEffects) return { state, outcomeQuality: null };

  const choiceEffect = eventEffects[event.choiceMade];
  if (!choiceEffect) return { state, outcomeQuality: null };

  const quality = rollOutcomeQuality(rng);
  const variedEffect = applyVariance(choiceEffect, quality);

  return {
    state: applyMechanicalEffectDelta(state, variedEffect, event.affectedRegionId),
    outcomeQuality: quality,
  };
}

// ============================================================
// Storyline-Specific Wrappers
// ============================================================

/**
 * Applies mechanical effects for the most recent branch decision in a storyline.
 * Rolls outcome variance to scale effects before application.
 * Returns state unchanged if no decisions have been made or no effect mapping exists.
 */
export function applyStorylineBranchEffects(
  state: GameState,
  storyline: ActiveStoryline,
  effectsRegistry: Record<string, Record<string, MechanicalEffectDelta>>,
  rng: () => number,
): { state: GameState; outcomeQuality: OutcomeQuality | null } {
  if (storyline.decisionHistory.length === 0) return { state, outcomeQuality: null };

  const latestDecision = storyline.decisionHistory[storyline.decisionHistory.length - 1];
  const storylineEffects = effectsRegistry[storyline.definitionId];
  if (!storylineEffects) return { state, outcomeQuality: null };

  const choiceEffect = storylineEffects[latestDecision.choiceId];
  if (!choiceEffect) return { state, outcomeQuality: null };

  const quality = rollOutcomeQuality(rng);
  const variedEffect = applyVariance(choiceEffect, quality);

  return {
    state: applyMechanicalEffectDelta(state, variedEffect, null),
    outcomeQuality: quality,
  };
}

/**
 * Applies path-dependent resolution effects for a completed storyline.
 * The path is determined by the opening decision (decisionHistory[0]).
 * Resolution effects are larger magnitude than branch effects.
 * Rolls outcome variance for the resolution effects.
 * Returns state unchanged if no resolution effect mapping exists.
 */
export function applyStorylineResolutionEffects(
  state: GameState,
  storyline: ActiveStoryline,
  resolutionRegistry: Record<string, Record<string, MechanicalEffectDelta>>,
  rng: () => number,
): { state: GameState; outcomeQuality: OutcomeQuality | null } {
  if (storyline.decisionHistory.length === 0) return { state, outcomeQuality: null };

  const openingDecision = storyline.decisionHistory[0];
  const storylineResolutions = resolutionRegistry[storyline.definitionId];
  if (!storylineResolutions) return { state, outcomeQuality: null };

  const resolutionEffect = storylineResolutions[openingDecision.choiceId];
  if (!resolutionEffect) return { state, outcomeQuality: null };

  const quality = rollOutcomeQuality(rng);
  const variedEffect = applyVariance(resolutionEffect, quality);

  return {
    state: applyMechanicalEffectDelta(state, variedEffect, null),
    outcomeQuality: quality,
  };
}
