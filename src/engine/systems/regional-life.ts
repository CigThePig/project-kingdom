// SIMULATION-EXPANSION §Expansion 5 — Regional Life
// Regional loyalty, infrastructure decay, local economy, terrain.
// Pure engine logic. No React imports. No player-facing text.

import {
  ConditionCardTrigger,
  ConditionSeverity,
  ConditionType,
  ConstructionProject,
  EconomicPhase,
  KingdomCondition,
  RegionalCardTrigger,
  RegionalEconomy,
  RegionalInfrastructure,
  RegionState,
  TaxationLevel,
  TerrainType,
} from '../types';
import {
  REGION_GRANARIES_FOOD_BUFFER_PER_POINT,
  REGION_INFRA_DECAY_BASE,
  REGION_INFRA_DECAY_MAX,
  REGION_INFRA_GRANARIES_STARTING,
  REGION_INFRA_MAX,
  REGION_INFRA_MIN,
  REGION_INFRA_ROADS_STARTING,
  REGION_INFRA_SANITATION_STARTING,
  REGION_INFRA_WALLS_STARTING,
  REGION_LOYALTY_CONDITION_PENALTY,
  REGION_LOYALTY_CONSTRUCTION_BONUS,
  REGION_LOYALTY_CULTURAL_MISMATCH_PENALTY,
  REGION_LOYALTY_MAX,
  REGION_LOYALTY_MIN,
  REGION_LOYALTY_REBELLION_THRESHOLD,
  REGION_LOYALTY_REDUCED_TAX_MULTIPLIER,
  REGION_LOYALTY_REDUCED_TAX_THRESHOLD,
  REGION_LOYALTY_SEPARATIST_THRESHOLD,
  REGION_LOYALTY_STABILITY_DRIFT_PER_POINT,
  REGION_LOYALTY_STABILITY_MIDPOINT,
  REGION_LOYALTY_STARTING,
  REGION_LOYALTY_TAX_BURDEN_PENALTY,
  REGION_ROADS_TRADE_BONUS_PER_POINT,
  REGION_SANITATION_DISEASE_REDUCTION_PER_POINT,
  REGION_TERRAIN_FOOD_MODIFIER,
  REGION_TERRAIN_TRADE_MODIFIER,
} from '../constants';

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Type guard: returns true if this region has Expansion 5 fields populated.
 */
export function hasRegionalExpansionFields(region: RegionState): boolean {
  return region.loyalty !== undefined && region.infrastructure !== undefined;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Creates an expanded region by adding Expansion 5 fields to an existing base region.
 */
export function createInitialRegionalState(
  base: RegionState,
  terrainType: TerrainType,
  borderRegion: boolean,
  loyalty?: number,
  infrastructure?: Partial<RegionalInfrastructure>,
): RegionState {
  const infra: RegionalInfrastructure = {
    roads: infrastructure?.roads ?? REGION_INFRA_ROADS_STARTING,
    walls: infrastructure?.walls ?? REGION_INFRA_WALLS_STARTING,
    granaries: infrastructure?.granaries ?? REGION_INFRA_GRANARIES_STARTING,
    sanitation: infrastructure?.sanitation ?? REGION_INFRA_SANITATION_STARTING,
  };

  const localEconomy: RegionalEconomy = {
    productionOutput: 0, // calculated during regional tick
    localTradeActivity: base.primaryEconomicOutput === 'Trade' ? 60 : 30,
    taxContribution: 0,  // calculated during regional tick
  };

  return {
    ...base,
    localPopulation: base.populationContribution,
    loyalty: loyalty ?? REGION_LOYALTY_STARTING,
    infrastructure: infra,
    localConditions: [],
    localEconomy,
    borderRegion,
    terrainType,
  };
}

// ============================================================
// Core Calculations
// ============================================================

/**
 * Applies infrastructure decay for one season.
 * Each component decays by 1-2 points per season.
 */
export function tickRegionalInfrastructure(
  infra: RegionalInfrastructure,
): RegionalInfrastructure {
  const decay = (current: number): number => {
    // Lower infrastructure decays slightly faster (neglect compounds)
    const rate = current < 30 ? REGION_INFRA_DECAY_MAX : REGION_INFRA_DECAY_BASE;
    return clamp(current - rate, REGION_INFRA_MIN, REGION_INFRA_MAX);
  };

  return {
    roads: decay(infra.roads),
    walls: decay(infra.walls),
    granaries: decay(infra.granaries),
    sanitation: decay(infra.sanitation),
  };
}

/**
 * Calculates the loyalty drift for a region this turn.
 */
export function calculateLoyaltyDrift(
  region: RegionState,
  stability: number,
  constructionInRegion: boolean,
  taxationLevel: TaxationLevel,
  kingdomCultureId: string,
): number {
  let delta = 0;

  // Stability drift: above midpoint = positive, below = negative
  delta += (stability - REGION_LOYALTY_STABILITY_MIDPOINT) * REGION_LOYALTY_STABILITY_DRIFT_PER_POINT;

  // Active regional conditions reduce loyalty
  const localConditionCount = region.localConditions?.length ?? 0;
  delta += localConditionCount * REGION_LOYALTY_CONDITION_PENALTY;

  // Construction in this region boosts loyalty
  if (constructionInRegion) {
    delta += REGION_LOYALTY_CONSTRUCTION_BONUS;
  }

  // High/Punitive taxation reduces loyalty
  if (taxationLevel === TaxationLevel.High || taxationLevel === TaxationLevel.Punitive) {
    delta += REGION_LOYALTY_TAX_BURDEN_PENALTY;
  }

  // Cultural mismatch penalty
  if (region.culturalIdentity !== kingdomCultureId) {
    delta += REGION_LOYALTY_CULTURAL_MISMATCH_PENALTY;
  }

  return delta;
}

/**
 * Calculates the regional economy for this turn.
 */
export function calculateRegionalEconomy(
  region: RegionState,
  economicPhase: EconomicPhase,
): RegionalEconomy {
  const terrain = region.terrainType ?? TerrainType.Plains;
  const roads = region.infrastructure?.roads ?? 0;
  const loyalty = region.loyalty ?? REGION_LOYALTY_STARTING;

  // Base production from development level and condition modifier
  const devMultiplier = region.developmentLevel * 0.01 + 0.5;
  let productionOutput = region.localConditionModifier * devMultiplier;

  // Terrain modifiers
  if (region.primaryEconomicOutput === 'Food') {
    productionOutput *= REGION_TERRAIN_FOOD_MODIFIER[terrain];
  } else if (region.primaryEconomicOutput === 'Trade') {
    productionOutput *= REGION_TERRAIN_TRADE_MODIFIER[terrain];
  }

  // Local trade activity: influenced by roads, economic phase, terrain
  let tradeActivity = (region.localEconomy?.localTradeActivity ?? 30);
  tradeActivity += roads * REGION_ROADS_TRADE_BONUS_PER_POINT * 10;
  if (economicPhase === EconomicPhase.Growth || economicPhase === EconomicPhase.Boom) {
    tradeActivity += 5;
  } else if (economicPhase === EconomicPhase.Recession || economicPhase === EconomicPhase.Depression) {
    tradeActivity -= 5;
  }
  tradeActivity = clamp(tradeActivity, 0, 100);

  // Tax contribution: reduced when loyalty is low
  let taxContribution = productionOutput * 10; // rough approximation
  if (loyalty < REGION_LOYALTY_REDUCED_TAX_THRESHOLD) {
    taxContribution *= REGION_LOYALTY_REDUCED_TAX_MULTIPLIER;
  }

  return {
    productionOutput,
    localTradeActivity: tradeActivity,
    taxContribution,
  };
}

/**
 * Returns the total food buffer from all regions' granaries.
 * Used to moderate famine impact.
 */
export function calculateGranaryFoodBuffer(regions: RegionState[]): number {
  return regions.reduce((sum, r) => {
    if (!hasRegionalExpansionFields(r) || r.isOccupied) return sum;
    return sum + (r.infrastructure!.granaries * REGION_GRANARIES_FOOD_BUFFER_PER_POINT);
  }, 0);
}

/**
 * Returns the aggregate sanitation benefit from all regions.
 * Reduces kingdom-wide disease vulnerability.
 */
export function calculateRegionalSanitationBonus(regions: RegionState[]): number {
  let totalSanitation = 0;
  let regionCount = 0;
  for (const r of regions) {
    if (!hasRegionalExpansionFields(r) || r.isOccupied) continue;
    totalSanitation += r.infrastructure!.sanitation;
    regionCount++;
  }
  if (regionCount === 0) return 0;
  const avgSanitation = totalSanitation / regionCount;
  return avgSanitation * REGION_SANITATION_DISEASE_REDUCTION_PER_POINT;
}

// ============================================================
// Main Phase 1c Orchestrator
// ============================================================

export interface RegionalTickResult {
  regions: RegionState[];
  conditionCards: ConditionCardTrigger[];
  newConditions: KingdomCondition[];
  loyaltyWarnings: RegionalCardTrigger[];
}

export function resolveRegionalTick(
  regions: RegionState[],
  stability: number,
  constructionProjects: ConstructionProject[],
  taxationLevel: TaxationLevel,
  kingdomCultureId: string,
  economicPhase: EconomicPhase,
  turnNumber: number,
): RegionalTickResult {
  const conditionCards: ConditionCardTrigger[] = [];
  const newConditions: KingdomCondition[] = [];
  const loyaltyWarnings: RegionalCardTrigger[] = [];

  const updatedRegions = regions.map((region) => {
    // Skip regions without expansion fields
    if (!hasRegionalExpansionFields(region)) return region;

    // Occupied regions don't tick: a foreign power runs them.
    if (region.isOccupied) return region;

    // 1. Infrastructure decay
    const newInfra = tickRegionalInfrastructure(region.infrastructure!);

    // 2. Loyalty drift
    const hasConstructionHere = constructionProjects.some(
      (p) => p.targetRegionId === region.id && p.turnsRemaining > 0,
    );
    const loyaltyDelta = calculateLoyaltyDrift(
      region, stability, hasConstructionHere, taxationLevel, kingdomCultureId,
    );
    const newLoyalty = clamp((region.loyalty ?? REGION_LOYALTY_STARTING) + loyaltyDelta, REGION_LOYALTY_MIN, REGION_LOYALTY_MAX);

    // 3. Check loyalty consequences and emit warnings
    if (newLoyalty < REGION_LOYALTY_REBELLION_THRESHOLD) {
      loyaltyWarnings.push({ regionId: region.id, type: 'rebellion', loyalty: newLoyalty });
    } else if (newLoyalty < REGION_LOYALTY_SEPARATIST_THRESHOLD) {
      loyaltyWarnings.push({ regionId: region.id, type: 'separatist_event', loyalty: newLoyalty });
    } else if (newLoyalty < REGION_LOYALTY_REDUCED_TAX_THRESHOLD) {
      loyaltyWarnings.push({ regionId: region.id, type: 'loyalty_warning', loyalty: newLoyalty });
    }

    // 4. Tick regional conditions
    const tickedConditions = (region.localConditions ?? []).map((c) => ({
      ...c,
      turnsActive: c.turnsActive + 1,
      turnsRemaining: c.turnsRemaining !== null ? c.turnsRemaining - 1 : null,
    }));
    // Banditry resolves organically when order is restored (loyalty recovered
    // and walls garrisoned). Without this, null-duration banditry stuck forever.
    const banditryResolves = (c: KingdomCondition): boolean =>
      c.type === ConditionType.Banditry && newLoyalty >= 50 && newInfra.walls >= 25;
    const stillActive = tickedConditions.filter(
      (c) => (c.turnsRemaining === null || c.turnsRemaining > 0) && !banditryResolves(c),
    );
    const resolved = tickedConditions.filter(
      (c) => (c.turnsRemaining !== null && c.turnsRemaining <= 0) || banditryResolves(c),
    );

    for (const cond of resolved) {
      conditionCards.push({
        conditionId: cond.id,
        conditionType: cond.type,
        severity: cond.severity,
        triggerType: 'resolution',
        regionId: region.id,
      });
    }

    // 5. Calculate regional economy
    const tempRegion = { ...region, loyalty: newLoyalty, infrastructure: newInfra, localConditions: stillActive };
    const newEconomy = calculateRegionalEconomy(tempRegion, economicPhase);

    // 6. Check for banditry emergence from low loyalty + low infrastructure
    if (newLoyalty < 30 && newInfra.walls < 15
      && !stillActive.some((c) => c.type === ConditionType.Banditry)) {
      const banditryCondition: KingdomCondition = {
        id: `cond_regional_banditry_${region.id}_t${turnNumber}`,
        type: ConditionType.Banditry,
        severity: ConditionSeverity.Mild,
        turnsActive: 0,
        turnsRemaining: null,
        systemEffects: [
          { target: 'trade.income', operator: 'multiply', value: 0.9 },
          { target: 'food.production', operator: 'multiply', value: 0.95 },
        ],
        regionId: region.id,
        canEscalate: true,
        escalatesTo: null,
      };
      stillActive.push(banditryCondition);
      newConditions.push(banditryCondition);
      conditionCards.push({
        conditionId: banditryCondition.id,
        conditionType: banditryCondition.type,
        severity: banditryCondition.severity,
        triggerType: 'emergence',
        regionId: region.id,
      });
    }

    return {
      ...region,
      infrastructure: newInfra,
      loyalty: newLoyalty,
      localConditions: stillActive,
      localEconomy: newEconomy,
    };
  });

  return { regions: updatedRegions, conditionCards, newConditions, loyaltyWarnings };
}
