// Phase 9 — Regional Governance Posture
// Pure engine logic for per-region posture effects. No React imports, no I/O.
// Postures are set rarely by the player (Court Opportunity cards or from the
// Codex), but their modifiers fire every turn via the regional tick.

import { GameState, RegionalInfrastructure, RegionalPosture, RegionState } from '../types';
import {
  POSTURE_DEVELOP_INFRA_GAIN,
  POSTURE_DEVELOP_TAX_MULTIPLIER,
  POSTURE_EXTRACT_INFRA_DECAY_MULT,
  POSTURE_EXTRACT_LOYALTY_DRIFT,
  POSTURE_EXTRACT_OUTPUT_MULTIPLIER,
  POSTURE_GARRISON_TRADE_MULTIPLIER,
  POSTURE_GARRISON_WALLS_CAP,
  POSTURE_GARRISON_WALLS_GAIN,
  POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT,
  POSTURE_PACIFY_LOYALTY_DRIFT,
  POSTURE_STALE_TURNS,
  REGION_INFRA_MAX,
  REGION_INFRA_MIN,
  REGION_LOYALTY_MAX,
  REGION_LOYALTY_MIN,
  REGION_LOYALTY_STARTING,
} from '../constants';

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolvePosture(region: RegionState): RegionalPosture {
  return region.posture ?? RegionalPosture.Autonomy;
}

// ============================================================
// Per-turn tick
// ============================================================

/**
 * Applies posture-driven per-turn adjustments to a region: infrastructure
 * progression (Develop, Garrison), loyalty drift (Extract, Pacify). Output
 * multipliers are *not* applied here — they flow through aggregation in
 * regions.ts via getPostureOutputMultiplier to keep the base tick pure.
 */
export function applyPostureTick(region: RegionState): RegionState {
  if (region.isOccupied) return region;
  const posture = resolvePosture(region);

  let infra = region.infrastructure;
  let loyalty = region.loyalty;

  if (infra) {
    const mutated: RegionalInfrastructure = { ...infra };
    if (posture === RegionalPosture.Develop) {
      const g = POSTURE_DEVELOP_INFRA_GAIN;
      mutated.roads = clamp(mutated.roads + g, REGION_INFRA_MIN, REGION_INFRA_MAX);
      mutated.walls = clamp(mutated.walls + g, REGION_INFRA_MIN, REGION_INFRA_MAX);
      mutated.granaries = clamp(mutated.granaries + g, REGION_INFRA_MIN, REGION_INFRA_MAX);
      mutated.sanitation = clamp(mutated.sanitation + g, REGION_INFRA_MIN, REGION_INFRA_MAX);
    } else if (posture === RegionalPosture.Garrison) {
      if (mutated.walls < POSTURE_GARRISON_WALLS_CAP) {
        mutated.walls = clamp(
          mutated.walls + POSTURE_GARRISON_WALLS_GAIN,
          REGION_INFRA_MIN,
          POSTURE_GARRISON_WALLS_CAP,
        );
      }
    }
    infra = mutated;
  }

  if (loyalty !== undefined) {
    if (posture === RegionalPosture.Extract) {
      loyalty = clamp(loyalty + POSTURE_EXTRACT_LOYALTY_DRIFT, REGION_LOYALTY_MIN, REGION_LOYALTY_MAX);
    } else if (posture === RegionalPosture.Pacify) {
      loyalty = clamp(loyalty + POSTURE_PACIFY_LOYALTY_DRIFT, REGION_LOYALTY_MIN, REGION_LOYALTY_MAX);
    }
  }

  return { ...region, infrastructure: infra, loyalty };
}

// ============================================================
// Aggregation modifiers (consumed by regions.ts / regional-life.ts)
// ============================================================

/**
 * Multiplier applied to primary economic output (food/trade/resource) for a
 * region based on its posture. Extract maximizes yield; Garrison on trade
 * regions takes a haircut. All other postures return 1.0 (neutral).
 */
export function getPostureOutputMultiplier(
  posture: RegionalPosture | undefined,
  resourceKind: 'Food' | 'Trade' | 'Resource',
): number {
  const p = posture ?? RegionalPosture.Autonomy;
  if (p === RegionalPosture.Extract) return POSTURE_EXTRACT_OUTPUT_MULTIPLIER;
  if (p === RegionalPosture.Garrison && resourceKind === 'Trade') {
    return POSTURE_GARRISON_TRADE_MULTIPLIER;
  }
  return 1.0;
}

/**
 * Tax-contribution multiplier. Develop deliberately reinvests, so the crown
 * sees −10% tax from that region.
 */
export function getPostureTaxMultiplier(posture: RegionalPosture | undefined): number {
  const p = posture ?? RegionalPosture.Autonomy;
  if (p === RegionalPosture.Develop) return POSTURE_DEVELOP_TAX_MULTIPLIER;
  return 1.0;
}

/**
 * Infrastructure decay multiplier. Extract accelerates decay; other postures
 * use the base decay rate.
 */
export function getPostureInfraDecayMultiplier(posture: RegionalPosture | undefined): number {
  const p = posture ?? RegionalPosture.Autonomy;
  if (p === RegionalPosture.Extract) return POSTURE_EXTRACT_INFRA_DECAY_MULT;
  return 1.0;
}

/**
 * Multiplier on banditry/unrest emergence probability. Pacify halves the
 * chance; other postures are neutral.
 */
export function getPostureBanditryEmergenceMultiplier(
  posture: RegionalPosture | undefined,
): number {
  const p = posture ?? RegionalPosture.Autonomy;
  if (p === RegionalPosture.Pacify) return POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT;
  return 1.0;
}

// ============================================================
// Stale detection + suggestion (Court Opportunity feeder)
// ============================================================

export function isPostureStale(
  region: RegionState,
  currentTurn: number,
  threshold = POSTURE_STALE_TURNS,
): boolean {
  if (region.isOccupied) return false;
  const setOn = region.postureSetOnTurn ?? 0;
  return currentTurn - setOn >= threshold;
}

/**
 * Heuristic used by the Court Opportunity generator to suggest a posture for a
 * stale region. Deterministic: no RNG. Order of checks matters — the first
 * matching rule wins.
 */
export function selectSuggestedPosture(
  region: RegionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _state: GameState,
): RegionalPosture {
  const current = resolvePosture(region);
  const loyalty = region.loyalty ?? REGION_LOYALTY_STARTING;

  if (loyalty < 40 && current !== RegionalPosture.Pacify) {
    return RegionalPosture.Pacify;
  }
  if (region.borderRegion && region.strategicValue >= 60 && current !== RegionalPosture.Garrison) {
    return RegionalPosture.Garrison;
  }
  if (region.developmentLevel < 35 && current !== RegionalPosture.Develop) {
    return RegionalPosture.Develop;
  }
  if (
    region.developmentLevel >= 60
    && (region.primaryEconomicOutput === 'Trade' || region.primaryEconomicOutput !== 'Food')
    && current !== RegionalPosture.Extract
  ) {
    return RegionalPosture.Extract;
  }
  // Fallback: rotate away from the current posture toward Autonomy, or pick
  // Develop if already Autonomy, so the card is never a no-op recommendation.
  if (current === RegionalPosture.Autonomy) return RegionalPosture.Develop;
  return RegionalPosture.Autonomy;
}

/**
 * Returns the first stale non-occupied region from the supplied list, or
 * null if none qualify. Deterministic — callers control ordering.
 */
export function findFirstStaleRegion(
  regions: RegionState[],
  currentTurn: number,
): RegionState | null {
  for (const region of regions) {
    if (isPostureStale(region, currentTurn)) return region;
  }
  return null;
}

// ============================================================
// Display helpers
// ============================================================

export const POSTURE_LABEL: Record<RegionalPosture, string> = {
  [RegionalPosture.Develop]: 'Develop',
  [RegionalPosture.Extract]: 'Extract',
  [RegionalPosture.Garrison]: 'Garrison',
  [RegionalPosture.Pacify]: 'Pacify',
  [RegionalPosture.Autonomy]: 'Autonomy',
};

export const POSTURE_SHORT_EFFECT: Record<RegionalPosture, string> = {
  [RegionalPosture.Develop]:
    'Invest in roads, walls, granaries, and sanitation. Tax yield falls 10%.',
  [RegionalPosture.Extract]:
    'Maximize extraction at +20%. Infrastructure decays faster; loyalty drifts down.',
  [RegionalPosture.Garrison]:
    'Reinforce walls each season. Local trade takes a 15% hit.',
  [RegionalPosture.Pacify]:
    'Loyalty rises slowly. Banditry and unrest are suppressed.',
  [RegionalPosture.Autonomy]:
    'Hands-off. No bonuses, no costs. The region runs itself.',
};
