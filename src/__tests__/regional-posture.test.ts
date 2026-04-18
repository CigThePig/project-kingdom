// Phase 9 — Regional posture engine tests.

import { describe, it, expect } from 'vitest';
import {
  RegionalPosture,
  TerrainType,
  type GameState,
  type RegionState,
} from '../engine/types';
import {
  applyPostureTick,
  findFirstStaleRegion,
  getPostureBanditryEmergenceMultiplier,
  getPostureInfraDecayMultiplier,
  getPostureOutputMultiplier,
  getPostureTaxMultiplier,
  isPostureStale,
  POSTURE_LABEL,
  POSTURE_SHORT_EFFECT,
  selectSuggestedPosture,
} from '../engine/systems/regional-posture';
import {
  POSTURE_DEVELOP_INFRA_GAIN,
  POSTURE_DEVELOP_TAX_MULTIPLIER,
  POSTURE_EXTRACT_INFRA_DECAY_MULT,
  POSTURE_EXTRACT_LOYALTY_DRIFT,
  POSTURE_EXTRACT_OUTPUT_MULTIPLIER,
  POSTURE_GARRISON_TRADE_MULTIPLIER,
  POSTURE_GARRISON_WALLS_GAIN,
  POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT,
  POSTURE_PACIFY_LOYALTY_DRIFT,
  POSTURE_STALE_TURNS,
} from '../engine/constants';

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
    loyalty: 60,
    infrastructure: { roads: 40, walls: 40, granaries: 40, sanitation: 40 },
    localConditions: [],
    localEconomy: { productionOutput: 100, localTradeActivity: 50, taxContribution: 10 },
    terrainType: TerrainType.Plains,
    posture: RegionalPosture.Autonomy,
    postureSetOnTurn: 0,
    ...overrides,
  };
}

const stubState = { turn: { turnNumber: 10 } } as unknown as GameState;

describe('applyPostureTick', () => {
  it('is a no-op on occupied regions', () => {
    const region = makeRegion({ isOccupied: true, posture: RegionalPosture.Develop });
    const result = applyPostureTick(region);
    expect(result).toEqual(region);
  });

  it('Develop raises every infrastructure axis and leaves loyalty alone', () => {
    const region = makeRegion({ posture: RegionalPosture.Develop, loyalty: 60 });
    const next = applyPostureTick(region);
    expect(next.infrastructure?.roads).toBeCloseTo(40 + POSTURE_DEVELOP_INFRA_GAIN, 5);
    expect(next.infrastructure?.walls).toBeCloseTo(40 + POSTURE_DEVELOP_INFRA_GAIN, 5);
    expect(next.infrastructure?.granaries).toBeCloseTo(40 + POSTURE_DEVELOP_INFRA_GAIN, 5);
    expect(next.infrastructure?.sanitation).toBeCloseTo(40 + POSTURE_DEVELOP_INFRA_GAIN, 5);
    expect(next.loyalty).toBe(60);
  });

  it('Extract drifts loyalty down', () => {
    const region = makeRegion({ posture: RegionalPosture.Extract, loyalty: 60 });
    const next = applyPostureTick(region);
    expect(next.loyalty).toBeCloseTo(60 + POSTURE_EXTRACT_LOYALTY_DRIFT, 5);
    expect(next.loyalty! < 60).toBe(true);
  });

  it('Garrison only grows walls', () => {
    const region = makeRegion({ posture: RegionalPosture.Garrison });
    const next = applyPostureTick(region);
    expect(next.infrastructure?.walls).toBeCloseTo(40 + POSTURE_GARRISON_WALLS_GAIN, 5);
    expect(next.infrastructure?.roads).toBe(40);
  });

  it('Pacify drifts loyalty up', () => {
    const region = makeRegion({ posture: RegionalPosture.Pacify, loyalty: 60 });
    const next = applyPostureTick(region);
    expect(next.loyalty).toBeCloseTo(60 + POSTURE_PACIFY_LOYALTY_DRIFT, 5);
    expect(next.loyalty! > 60).toBe(true);
  });

  it('Autonomy is a no-op', () => {
    const region = makeRegion({ posture: RegionalPosture.Autonomy });
    const next = applyPostureTick(region);
    expect(next.infrastructure).toEqual(region.infrastructure);
    expect(next.loyalty).toBe(region.loyalty);
  });

  it('treats undefined posture as Autonomy', () => {
    const region = makeRegion({ posture: undefined });
    const next = applyPostureTick(region);
    expect(next.infrastructure).toEqual(region.infrastructure);
  });
});

describe('posture multiplier helpers', () => {
  it('getPostureOutputMultiplier: Extract scales all outputs', () => {
    expect(getPostureOutputMultiplier(RegionalPosture.Extract, 'Food')).toBeCloseTo(
      POSTURE_EXTRACT_OUTPUT_MULTIPLIER,
    );
    expect(getPostureOutputMultiplier(RegionalPosture.Extract, 'Trade')).toBeCloseTo(
      POSTURE_EXTRACT_OUTPUT_MULTIPLIER,
    );
  });

  it('getPostureOutputMultiplier: Garrison penalises Trade only', () => {
    expect(getPostureOutputMultiplier(RegionalPosture.Garrison, 'Trade')).toBeCloseTo(
      POSTURE_GARRISON_TRADE_MULTIPLIER,
    );
    expect(getPostureOutputMultiplier(RegionalPosture.Garrison, 'Food')).toBe(1);
  });

  it('getPostureOutputMultiplier: neutral postures return 1', () => {
    expect(getPostureOutputMultiplier(RegionalPosture.Autonomy, 'Food')).toBe(1);
    expect(getPostureOutputMultiplier(RegionalPosture.Pacify, 'Trade')).toBe(1);
    expect(getPostureOutputMultiplier(undefined, 'Food')).toBe(1);
  });

  it('getPostureTaxMultiplier: Develop is below 1', () => {
    expect(getPostureTaxMultiplier(RegionalPosture.Develop)).toBeCloseTo(
      POSTURE_DEVELOP_TAX_MULTIPLIER,
    );
    expect(POSTURE_DEVELOP_TAX_MULTIPLIER < 1).toBe(true);
    expect(getPostureTaxMultiplier(RegionalPosture.Autonomy)).toBe(1);
  });

  it('getPostureInfraDecayMultiplier: Extract increases decay', () => {
    expect(getPostureInfraDecayMultiplier(RegionalPosture.Extract)).toBeCloseTo(
      POSTURE_EXTRACT_INFRA_DECAY_MULT,
    );
    expect(POSTURE_EXTRACT_INFRA_DECAY_MULT > 1).toBe(true);
  });

  it('getPostureBanditryEmergenceMultiplier: Pacify halves (or less)', () => {
    expect(getPostureBanditryEmergenceMultiplier(RegionalPosture.Pacify)).toBeCloseTo(
      POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT,
    );
    expect(POSTURE_PACIFY_BANDITRY_EMERGENCE_MULT < 1).toBe(true);
    expect(getPostureBanditryEmergenceMultiplier(RegionalPosture.Autonomy)).toBe(1);
  });
});

describe('isPostureStale / findFirstStaleRegion', () => {
  it('returns true once the gap hits the threshold', () => {
    const region = makeRegion({ postureSetOnTurn: 0 });
    expect(isPostureStale(region, POSTURE_STALE_TURNS - 1)).toBe(false);
    expect(isPostureStale(region, POSTURE_STALE_TURNS)).toBe(true);
    expect(isPostureStale(region, POSTURE_STALE_TURNS + 3)).toBe(true);
  });

  it('never stale when occupied', () => {
    const region = makeRegion({ isOccupied: true, postureSetOnTurn: 0 });
    expect(isPostureStale(region, POSTURE_STALE_TURNS + 20)).toBe(false);
  });

  it('findFirstStaleRegion picks the first qualifying region', () => {
    const fresh = makeRegion({ id: 'region_fresh', postureSetOnTurn: 10 });
    const stale = makeRegion({ id: 'region_stale', postureSetOnTurn: 0 });
    const hit = findFirstStaleRegion([fresh, stale], POSTURE_STALE_TURNS);
    expect(hit?.id).toBe('region_stale');
  });

  it('findFirstStaleRegion returns null when none qualify', () => {
    const r1 = makeRegion({ id: 'a', postureSetOnTurn: 10 });
    const r2 = makeRegion({ id: 'b', postureSetOnTurn: 10 });
    expect(findFirstStaleRegion([r1, r2], POSTURE_STALE_TURNS)).toBeNull();
  });
});

describe('selectSuggestedPosture', () => {
  it('picks Pacify when loyalty is low', () => {
    const region = makeRegion({ loyalty: 20 });
    expect(selectSuggestedPosture(region, stubState)).toBe(RegionalPosture.Pacify);
  });

  it('picks Garrison on strategic border regions when loyalty is fine', () => {
    const region = makeRegion({
      loyalty: 70,
      borderRegion: true,
      strategicValue: 80,
    });
    expect(selectSuggestedPosture(region, stubState)).toBe(RegionalPosture.Garrison);
  });

  it('picks Develop for under-developed loyal regions', () => {
    const region = makeRegion({
      loyalty: 70,
      developmentLevel: 20,
      borderRegion: false,
    });
    expect(selectSuggestedPosture(region, stubState)).toBe(RegionalPosture.Develop);
  });

  it('picks Extract for prosperous trade regions already on Autonomy', () => {
    const region = makeRegion({
      loyalty: 70,
      developmentLevel: 75,
      primaryEconomicOutput: 'Trade',
      borderRegion: false,
      posture: RegionalPosture.Autonomy,
    });
    expect(selectSuggestedPosture(region, stubState)).toBe(RegionalPosture.Extract);
  });

  it('never re-suggests the current posture', () => {
    const region = makeRegion({ loyalty: 20, posture: RegionalPosture.Pacify });
    const suggested = selectSuggestedPosture(region, stubState);
    expect(suggested).not.toBe(region.posture);
  });
});

describe('display maps', () => {
  it('POSTURE_LABEL has a label for every posture', () => {
    for (const p of Object.values(RegionalPosture)) {
      expect(typeof POSTURE_LABEL[p as RegionalPosture]).toBe('string');
      expect(POSTURE_LABEL[p as RegionalPosture].length).toBeGreaterThan(0);
    }
  });

  it('POSTURE_SHORT_EFFECT has an effect line for every posture', () => {
    for (const p of Object.values(RegionalPosture)) {
      expect(typeof POSTURE_SHORT_EFFECT[p as RegionalPosture]).toBe('string');
      expect(POSTURE_SHORT_EFFECT[p as RegionalPosture].length).toBeGreaterThan(5);
    }
  });
});
