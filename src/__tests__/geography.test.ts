// Phase 2.5 — Geography foundation tests.

import { describe, expect, it } from 'vitest';
import {
  applyProceduralRegionNames,
  applyProceduralSettlementNames,
  areAdjacent,
  buildGeographyIndexes,
  edge,
  finalizeGeography,
  getClaimantsOf,
  getInterRivalAdjacency,
  getNeighborsBordering,
  getRegionAdjacencies,
  getRegionsClaimedBy,
  getSettlementsIn,
  recomputeBorderFlags,
  validateGeographyIntegrity,
} from '../engine/systems/geography';
import { createDefaultScenario } from '../data/scenarios/default';
import { createFaithfulKingdomScenario } from '../data/scenarios/faithful-kingdom';
import { createFracturedInheritanceScenario } from '../data/scenarios/fractured-inheritance';
import { createFrozenMarchScenario } from '../data/scenarios/frozen-march';
import { createMerchantsGambitScenario } from '../data/scenarios/merchants-gambit';
import type { WorldGeography } from '../engine/types';

describe('buildGeographyIndexes', () => {
  it('produces a symmetric _adjacencyIndex', () => {
    const geo: WorldGeography = {
      schemaVersion: 1,
      edges: [
        edge('region_a', 'region_b', 'land', 'open'),
        edge('region_b', 'neighbor_x', 'sea', 'contested'),
      ],
      historicClaims: [],
      settlements: [],
    };
    const built = buildGeographyIndexes(geo);
    const adj = built._adjacencyIndex!;

    for (const from of Object.keys(adj)) {
      for (const to of adj[from]) {
        expect(adj[to]).toContain(from);
      }
    }
  });

  it('indexes historicClaims by both neighbor and region', () => {
    const geo: WorldGeography = {
      schemaVersion: 1,
      edges: [],
      historicClaims: [
        {
          neighborId: 'neighbor_x',
          regionId: 'region_a',
          claimStrength: 'ancestral',
          lostOnTurn: null,
          internalReasonCode: 'test_claim',
        },
      ],
      settlements: [],
    };
    const built = buildGeographyIndexes(geo);
    expect(built._claimsByNeighbor!['neighbor_x']).toEqual(['region_a']);
    expect(built._claimsByRegion!['region_a']).toEqual(['neighbor_x']);
  });

  it('is idempotent', () => {
    const geo: WorldGeography = {
      schemaVersion: 1,
      edges: [edge('r1', 'r2')],
      historicClaims: [],
      settlements: [],
    };
    const a = buildGeographyIndexes(geo);
    const b = buildGeographyIndexes(a);
    expect(b._adjacencyIndex).toEqual(a._adjacencyIndex);
  });
});

describe('default scenario geography', () => {
  const state = createDefaultScenario();

  it('getNeighborsBordering returns only neighbor_* ids', () => {
    const bordering = getNeighborsBordering('region_timbermark', state);
    expect(bordering).toEqual(['neighbor_arenthal']);
  });

  it('getRegionsClaimedBy returns the ironvale claim', () => {
    const claimed = getRegionsClaimedBy('neighbor_valdris', state);
    expect(claimed).toEqual(['region_ironvale']);
  });

  it('getClaimantsOf finds the matching HistoricClaim', () => {
    const claims = getClaimantsOf('region_ironvale', state);
    expect(claims).toHaveLength(1);
    expect(claims[0].neighborId).toBe('neighbor_valdris');
    expect(claims[0].claimStrength).toBe('ancestral');
  });

  it('getRegionAdjacencies returns both region and neighbor ids', () => {
    const adj = getRegionAdjacencies('region_ironvale', state);
    expect(adj).toContain('region_heartlands');
    expect(adj).toContain('region_timbermark');
    expect(adj).toContain('neighbor_valdris');
  });

  it('settlements live inside their declared region', () => {
    const settlements = getSettlementsIn('region_heartlands', state);
    expect(settlements.some((s) => s.id === 'settlement_heartcrown')).toBe(true);
  });
});

describe('areAdjacent', () => {
  const state = createDefaultScenario();

  it('is symmetric', () => {
    expect(areAdjacent('region_heartlands', 'region_ironvale', state)).toBe(true);
    expect(areAdjacent('region_ironvale', 'region_heartlands', state)).toBe(true);
  });

  it('returns false (no throw) for unknown ids', () => {
    expect(areAdjacent('region_nowhere', 'region_imaginary', state)).toBe(false);
    expect(areAdjacent('region_heartlands', 'region_bogus', state)).toBe(false);
  });
});

describe('getInterRivalAdjacency', () => {
  it('returns sorted, deduped pairs across neighbors', () => {
    const state = createDefaultScenario();
    const pairs = getInterRivalAdjacency(state);
    expect(pairs).toEqual([['neighbor_arenthal', 'neighbor_valdris']]);
    // Each pair's ids must be in sorted order.
    for (const [a, b] of pairs) {
      expect(a < b).toBe(true);
    }
  });

  it('picks up all three rival edges in merchants_gambit', () => {
    const state = createMerchantsGambitScenario();
    const pairs = getInterRivalAdjacency(state);
    // arenthal-valdris, arenthal-krath, valdris-krath
    expect(pairs).toHaveLength(3);
  });
});

describe('recomputeBorderFlags', () => {
  it('sets borderRegion=true for regions touching a neighbor_*', () => {
    const state = createDefaultScenario();
    const recomputed = recomputeBorderFlags(state);
    const timbermark = recomputed.regions.find((r) => r.id === 'region_timbermark')!;
    const ironvale = recomputed.regions.find((r) => r.id === 'region_ironvale')!;
    expect(timbermark.borderRegion).toBe(true);
    expect(ironvale.borderRegion).toBe(true);
  });

  it('sets borderRegion=false for interior regions (no neighbor edges)', () => {
    const state = createDefaultScenario();
    const recomputed = recomputeBorderFlags(state);
    const heartlands = recomputed.regions.find((r) => r.id === 'region_heartlands')!;
    // In the default scenario, heartlands has no edge to any neighbor_*.
    expect(heartlands.borderRegion).toBe(false);
  });
});

describe('validateGeographyIntegrity', () => {
  it('passes on all 5 scenarios', () => {
    expect(() => validateGeographyIntegrity(createDefaultScenario())).not.toThrow();
    expect(() => validateGeographyIntegrity(createFaithfulKingdomScenario())).not.toThrow();
    expect(() =>
      validateGeographyIntegrity(createFracturedInheritanceScenario()),
    ).not.toThrow();
    expect(() => validateGeographyIntegrity(createFrozenMarchScenario())).not.toThrow();
    expect(() =>
      validateGeographyIntegrity(createMerchantsGambitScenario()),
    ).not.toThrow();
  });

  it('throws on a dangling edge', () => {
    const state = createDefaultScenario();
    const bogus = {
      ...state,
      geography: {
        ...state.geography!,
        edges: [...state.geography!.edges, edge('region_heartlands', 'region_bogus')],
      },
    };
    expect(() => validateGeographyIntegrity(bogus)).toThrow(/unknown entity/);
  });

  it('throws on a claim referencing unknown neighbor', () => {
    const state = createDefaultScenario();
    const bogus = {
      ...state,
      geography: {
        ...state.geography!,
        historicClaims: [
          ...state.geography!.historicClaims,
          {
            neighborId: 'neighbor_ghost',
            regionId: 'region_heartlands',
            claimStrength: 'recent' as const,
            lostOnTurn: null,
            internalReasonCode: 'ghost',
          },
        ],
      },
    };
    expect(() => validateGeographyIntegrity(bogus)).toThrow(/unknown neighbor/);
  });
});

describe('applyProceduralRegionNames', () => {
  it('populates displayName for every region', () => {
    const state = createDefaultScenario();
    for (const r of state.regions) {
      expect(r.displayName).toBeTruthy();
    }
  });

  it('is deterministic for the same runSeed', () => {
    const a = applyProceduralRegionNames({
      ...createDefaultScenario(),
      runSeed: 'fixed_seed_1',
    });
    const b = applyProceduralRegionNames({
      ...createDefaultScenario(),
      runSeed: 'fixed_seed_1',
    });
    expect(a.regions.map((r) => r.displayName)).toEqual(
      b.regions.map((r) => r.displayName),
    );
  });

  it('varies by runSeed', () => {
    const a = applyProceduralRegionNames({
      ...createDefaultScenario(),
      runSeed: 'seed_alpha',
    });
    const b = applyProceduralRegionNames({
      ...createDefaultScenario(),
      runSeed: 'seed_beta',
    });
    const aNames = a.regions.map((r) => r.displayName).sort();
    const bNames = b.regions.map((r) => r.displayName).sort();
    expect(aNames).not.toEqual(bNames);
  });
});

describe('applyProceduralSettlementNames', () => {
  it('populates displayName for every settlement', () => {
    const state = createDefaultScenario();
    for (const s of state.geography!.settlements) {
      expect(s.displayName).toBeTruthy();
    }
  });

  it('is deterministic for the same runSeed', () => {
    const a = applyProceduralSettlementNames({
      ...createDefaultScenario(),
      runSeed: 'fixed_seed_1',
    });
    const b = applyProceduralSettlementNames({
      ...createDefaultScenario(),
      runSeed: 'fixed_seed_1',
    });
    expect(a.geography!.settlements.map((s) => s.displayName)).toEqual(
      b.geography!.settlements.map((s) => s.displayName),
    );
  });
});

describe('finalizeGeography', () => {
  it('builds indexes, names regions and settlements, and recomputes borderRegion', () => {
    const raw = {
      ...createDefaultScenario(),
      // Blow away the indexes to prove finalizeGeography rebuilds them.
      geography: {
        ...createDefaultScenario().geography!,
        _adjacencyIndex: undefined,
        _claimsByNeighbor: undefined,
        _claimsByRegion: undefined,
      },
    };
    const final = finalizeGeography(raw);
    expect(final.geography!._adjacencyIndex).toBeDefined();
    expect(final.geography!._claimsByNeighbor).toBeDefined();
    expect(final.regions.every((r) => r.displayName)).toBe(true);
    expect(final.geography!.settlements.every((s) => s.displayName)).toBe(true);
  });
});
