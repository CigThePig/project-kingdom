// Phase G — Regional systems invariants.
// Targets Phase C audit fixes: occupied-region skip, banditry resolution,
// banditry food-target correction, disease worst-severity, low-trade streak.

import { describe, it, expect } from 'vitest';
import {
  resolveRegionalTick,
} from '../engine/systems/regional-life';
import {
  ConditionSeverity,
  ConditionType,
  EconomicPhase,
  TaxationLevel,
  TerrainType,
  type KingdomCondition,
  type RegionState,
} from '../engine/types';

function makeRegion(overrides: Partial<RegionState> = {}): RegionState {
  return {
    id: 'region_test',
    primaryEconomicOutput: 'Food',
    localConditionModifier: 1,
    populationContribution: 100,
    developmentLevel: 50,
    localFaithProfile: 'faith_orthodox',
    culturalIdentity: 'culture_home',
    strategicValue: 50,
    isOccupied: false,
    localPopulation: 1000,
    loyalty: 70,
    infrastructure: { roads: 50, walls: 50, granaries: 50, sanitation: 50 },
    localConditions: [],
    localEconomy: { productionOutput: 100, localTradeActivity: 50, taxContribution: 10 },
    terrainType: TerrainType.Plains,
    ...overrides,
  };
}

function makeBanditry(): KingdomCondition {
  return {
    id: 'cond_banditry_test',
    type: ConditionType.Banditry,
    severity: ConditionSeverity.Mild,
    turnsActive: 5,
    turnsRemaining: null,
    systemEffects: [
      { target: 'trade.income', operator: 'multiply', value: 0.9 },
      { target: 'food.production', operator: 'multiply', value: 0.95 },
    ],
    regionId: 'region_test',
    canEscalate: true,
    escalatesTo: null,
  };
}

describe('resolveRegionalTick', () => {
  it('skips occupied regions entirely', () => {
    const occupied = makeRegion({ isOccupied: true, loyalty: 10 });
    const result = resolveRegionalTick(
      [occupied],
      60,
      [],
      TaxationLevel.Moderate,
      'culture_home',
      EconomicPhase.Stagnation,
      5,
    );
    // Occupied region is returned unchanged — loyalty not drifted, no cards.
    expect(result.regions[0]).toEqual(occupied);
    expect(result.conditionCards).toHaveLength(0);
    expect(result.loyaltyWarnings).toHaveLength(0);
  });

  it('resolves banditry when loyalty recovers and walls are garrisoned', () => {
    const region = makeRegion({
      loyalty: 80,
      infrastructure: { roads: 50, walls: 40, granaries: 50, sanitation: 50 },
      localConditions: [makeBanditry()],
    });
    const result = resolveRegionalTick(
      [region],
      60,
      [],
      TaxationLevel.Moderate,
      'culture_home',
      EconomicPhase.Stagnation,
      5,
    );
    expect(result.regions[0].localConditions).toHaveLength(0);
    expect(
      result.conditionCards.some(
        (c) => c.conditionType === ConditionType.Banditry && c.triggerType === 'resolution',
      ),
    ).toBe(true);
  });

  it('keeps banditry active when walls remain undermanned', () => {
    const region = makeRegion({
      loyalty: 80,
      infrastructure: { roads: 50, walls: 10, granaries: 50, sanitation: 50 },
      localConditions: [makeBanditry()],
    });
    const result = resolveRegionalTick(
      [region],
      60,
      [],
      TaxationLevel.Moderate,
      'culture_home',
      EconomicPhase.Stagnation,
      5,
    );
    expect(result.regions[0].localConditions).toHaveLength(1);
  });

  it('emits emergent banditry with food.production modifier target', () => {
    // Force low-loyalty, low-walls region to provoke emergence.
    const region = makeRegion({
      loyalty: 15,
      infrastructure: { roads: 50, walls: 5, granaries: 50, sanitation: 50 },
    });
    const result = resolveRegionalTick(
      [region],
      10,
      [],
      TaxationLevel.Punitive,
      'culture_home',
      EconomicPhase.Recession,
      5,
    );
    const emergent = result.newConditions.find((c) => c.type === ConditionType.Banditry);
    expect(emergent).toBeDefined();
    const foodEffect = emergent!.systemEffects.find((e) => e.target === 'food.production');
    expect(foodEffect).toBeDefined();
    // Ensure the audit fix — 'food.productionModifier' would miss the aggregator.
    expect(
      emergent!.systemEffects.some((e) => e.target === 'food.productionModifier'),
    ).toBe(false);
  });
});
