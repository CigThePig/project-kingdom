// Phase 2.5 — Location & Geography Foundation
// Pure helpers over a graph-based geography model. No coordinates, no pathfinding.
// Edges connect regions, neighbors, and named settlements. All lookups are O(1)
// via denormalized indexes rebuilt on load.

import {
  generateRegionName,
  generateSettlementName,
} from '../../data/text/name-generation';
import type {
  AdjacencyEdge,
  GameState,
  HistoricClaim,
  RegionState,
  Settlement,
  WorldGeography,
} from '../types';
import { TerrainType } from '../types';

// ============================================================
// Index Construction
// ============================================================

/**
 * Builds / rebuilds denormalized lookup indexes on a WorldGeography.
 * Returns the same object with `_adjacencyIndex`, `_claimsByNeighbor`,
 * and `_claimsByRegion` populated. Idempotent.
 */
export function buildGeographyIndexes(geo: WorldGeography): WorldGeography {
  const adj: Record<string, string[]> = {};
  for (const edge of geo.edges) {
    if (!adj[edge.a]) adj[edge.a] = [];
    if (!adj[edge.b]) adj[edge.b] = [];
    if (!adj[edge.a].includes(edge.b)) adj[edge.a].push(edge.b);
    if (!adj[edge.b].includes(edge.a)) adj[edge.b].push(edge.a);
  }

  const claimsByNeighbor: Record<string, string[]> = {};
  const claimsByRegion: Record<string, string[]> = {};
  for (const claim of geo.historicClaims) {
    if (!claimsByNeighbor[claim.neighborId]) claimsByNeighbor[claim.neighborId] = [];
    if (!claimsByRegion[claim.regionId]) claimsByRegion[claim.regionId] = [];
    claimsByNeighbor[claim.neighborId].push(claim.regionId);
    claimsByRegion[claim.regionId].push(claim.neighborId);
  }

  return {
    ...geo,
    _adjacencyIndex: adj,
    _claimsByNeighbor: claimsByNeighbor,
    _claimsByRegion: claimsByRegion,
  };
}

// ============================================================
// Adjacency Queries
// ============================================================

/** Returns direct neighbor entities of any kind connected by an edge. */
export function getRegionAdjacencies(regionId: string, state: GameState): string[] {
  return state.geography?._adjacencyIndex?.[regionId] ?? [];
}

/** Returns only `neighbor_*` entities directly connected to a region. */
export function getNeighborsBordering(regionId: string, state: GameState): string[] {
  return getRegionAdjacencies(regionId, state).filter((id) => id.startsWith('neighbor_'));
}

/** Symmetric adjacency check; false (no throw) for unknown ids. */
export function areAdjacent(idA: string, idB: string, state: GameState): boolean {
  const adj = state.geography?._adjacencyIndex;
  if (!adj) return false;
  return Boolean(adj[idA]?.includes(idB));
}

/**
 * Returns canonical [a, b] pairs for every rival↔rival adjacency, sorted and
 * deduped so the same pair never appears twice. Useful for coalition logic,
 * border skirmish flavor, and Phase 12 plague spread.
 */
export function getInterRivalAdjacency(state: GameState): Array<[string, string]> {
  const edges = state.geography?.edges ?? [];
  const seen = new Set<string>();
  const out: Array<[string, string]> = [];
  for (const edge of edges) {
    if (!edge.a.startsWith('neighbor_') || !edge.b.startsWith('neighbor_')) continue;
    const [a, b] = edge.a < edge.b ? [edge.a, edge.b] : [edge.b, edge.a];
    const key = `${a}|${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([a, b]);
  }
  return out;
}

// ============================================================
// Claim Queries
// ============================================================

/** Region ids historically claimed by a given neighbor. */
export function getRegionsClaimedBy(neighborId: string, state: GameState): string[] {
  return state.geography?._claimsByNeighbor?.[neighborId] ?? [];
}

/** Full HistoricClaim records targeting a given region. */
export function getClaimantsOf(regionId: string, state: GameState): HistoricClaim[] {
  const claims = state.geography?.historicClaims ?? [];
  return claims.filter((c) => c.regionId === regionId);
}

// ============================================================
// Settlement Queries
// ============================================================

/** All settlements inside a given region. */
export function getSettlementsIn(regionId: string, state: GameState): Settlement[] {
  const settlements = state.geography?.settlements ?? [];
  return settlements.filter((s) => s.regionId === regionId);
}

// ============================================================
// Derived Fields
// ============================================================

/**
 * Returns true iff the region has any edge to a `neighbor_*` entity.
 * Used to back-populate the legacy `borderRegion` field.
 */
export function deriveBorderRegionFlag(regionId: string, geo: WorldGeography): boolean {
  const adj = geo._adjacencyIndex?.[regionId] ?? [];
  return adj.some((id) => id.startsWith('neighbor_'));
}

/**
 * Updates `region.borderRegion` on every region to match the current
 * geography edges. Non-mutating: returns a new GameState with refreshed regions.
 */
export function recomputeBorderFlags(state: GameState): GameState {
  if (!state.geography) return state;
  const geo = state.geography;
  const regions = state.regions.map((r) => ({
    ...r,
    borderRegion: deriveBorderRegionFlag(r.id, geo),
  }));
  return { ...state, regions };
}

// ============================================================
// Integrity Validation
// ============================================================

/**
 * Throws if any edge or claim references an entity id that doesn't exist in
 * the state. Used in tests to catch authoring mistakes.
 */
export function validateGeographyIntegrity(state: GameState): void {
  const geo = state.geography;
  if (!geo) throw new Error('validateGeographyIntegrity: state has no geography');

  const knownIds = new Set<string>();
  for (const r of state.regions) knownIds.add(r.id);
  for (const n of state.diplomacy.neighbors) knownIds.add(n.id);
  for (const s of geo.settlements) knownIds.add(s.id);

  for (const edge of geo.edges) {
    if (!knownIds.has(edge.a)) {
      throw new Error(`geography: edge references unknown entity "${edge.a}"`);
    }
    if (!knownIds.has(edge.b)) {
      throw new Error(`geography: edge references unknown entity "${edge.b}"`);
    }
  }

  const regionIds = new Set(state.regions.map((r) => r.id));
  const neighborIds = new Set(state.diplomacy.neighbors.map((n) => n.id));
  for (const claim of geo.historicClaims) {
    if (!neighborIds.has(claim.neighborId)) {
      throw new Error(`geography: claim references unknown neighbor "${claim.neighborId}"`);
    }
    if (!regionIds.has(claim.regionId)) {
      throw new Error(`geography: claim references unknown region "${claim.regionId}"`);
    }
  }

  for (const s of geo.settlements) {
    if (!regionIds.has(s.regionId)) {
      throw new Error(`geography: settlement "${s.id}" references unknown region "${s.regionId}"`);
    }
  }
}

// ============================================================
// Procedural Name Application
// ============================================================

/**
 * Populates `region.displayName` for every region via generateRegionName(),
 * seeded by runSeed + region id. Falls back to Plains terrain if unset.
 * Idempotent — calling twice with the same runSeed yields the same names.
 */
export function applyProceduralRegionNames(state: GameState): GameState {
  const seed = state.runSeed ?? 'no-seed';
  const regions: RegionState[] = state.regions.map((r) => ({
    ...r,
    displayName: generateRegionName(`${seed}:${r.id}`, r.terrainType ?? TerrainType.Plains),
  }));
  return { ...state, regions };
}

/**
 * Populates `settlement.displayName` for every settlement in the geography.
 * Seeded by runSeed + settlement id + role. Terrain is looked up from the
 * parent region. Idempotent.
 */
export function applyProceduralSettlementNames(state: GameState): GameState {
  if (!state.geography) return state;
  const seed = state.runSeed ?? 'no-seed';
  const regionTerrain = new Map<string, TerrainType | undefined>();
  for (const r of state.regions) regionTerrain.set(r.id, r.terrainType);

  const settlements = state.geography.settlements.map((s) => ({
    ...s,
    displayName: generateSettlementName(
      `${seed}:${s.id}`,
      s.role,
      regionTerrain.get(s.regionId),
    ),
  }));

  return {
    ...state,
    geography: { ...state.geography, settlements },
  };
}

/**
 * Convenience: build indexes, apply procgen names to regions and settlements,
 * and refresh borderRegion flags. Call after scenario setup or save migration.
 */
export function finalizeGeography(state: GameState): GameState {
  if (!state.geography) return state;
  let next: GameState = {
    ...state,
    geography: buildGeographyIndexes(state.geography),
  };
  next = applyProceduralRegionNames(next);
  next = applyProceduralSettlementNames(next);
  next = recomputeBorderFlags(next);
  return next;
}

// ============================================================
// Edge Construction Helpers (used by scenario factories)
// ============================================================

export function edge(
  a: string,
  b: string,
  kind: AdjacencyEdge['kind'] = 'land',
  frictionTier: AdjacencyEdge['frictionTier'] = 'open',
): AdjacencyEdge {
  return { a, b, kind, frictionTier };
}
