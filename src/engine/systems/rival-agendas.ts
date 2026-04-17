// Phase 3 — Rival Agendas
// Each rival adopts a long-range intent (RivalAgenda) that biases their
// action pressure record and surfaces as agenda-aware dossier text and
// diplomatic overture cards. Agendas are anchored to real world entities
// (regions / settlements / other rivals) via the Phase 2.5 geography
// helpers — never via RNG-only target selection.

import {
  NeighborActionType,
  NeighborDisposition,
  RivalAgenda,
  type GameState,
  type NeighborState,
  type RivalActionPressureScores,
  type RivalAgendaState,
} from '../types';
import { AGENDA_DEFS, type AgendaTargetClass } from '../../data/rivals/agendas';
import {
  areAdjacent,
  getInterRivalAdjacency,
  getRegionsClaimedBy,
  getSettlementsIn,
} from './geography';
import { seededRandom } from '../../data/text/name-generation';

const TURNS_UNTIL_SHIFT = 24;
/** Agendas' eligibility checks — returns a candidate target id or null. */
type Resolver = (neighbor: NeighborState, state: GameState) => string | null;

// ---- Target resolvers --------------------------------------------------

const resolveRestoreBorders: Resolver = (neighbor, state) => {
  const claims = getRegionsClaimedBy(neighbor.id, state);
  return claims.length > 0 ? claims[0] : null;
};

const resolveBleedRivals: Resolver = (neighbor, state) => {
  const pairs = getInterRivalAdjacency(state);
  for (const [a, b] of pairs) {
    if (a === neighbor.id) return b;
    if (b === neighbor.id) return a;
  }
  return null;
};

const resolveDominateTrade: Resolver = (neighbor, state) => {
  const edges = state.geography?.edges ?? [];
  for (const edge of edges) {
    if (edge.kind !== 'sea' && edge.kind !== 'river') continue;
    if (edge.a === neighbor.id && edge.b.startsWith('neighbor_')) return edge.b;
    if (edge.b === neighbor.id && edge.a.startsWith('neighbor_')) return edge.a;
  }
  // Fallback: any other rival reached by any adjacency.
  const others = state.diplomacy.neighbors.filter((n) => n.id !== neighbor.id);
  for (const other of others) {
    if (areAdjacent(neighbor.id, other.id, state)) return other.id;
  }
  return others.length > 0 ? others[0].id : null;
};

const resolveReligiousHegemony: Resolver = (neighbor, state) => {
  const playerFaith = state.faithCulture.kingdomFaithTraditionId;
  if (neighbor.religiousProfile !== playerFaith) return null;
  // Target a rival with a mismatched faith from the neighbor itself.
  const others = state.diplomacy.neighbors.filter(
    (n) => n.id !== neighbor.id && n.religiousProfile !== neighbor.religiousProfile,
  );
  return others.length > 0 ? others[0].id : null;
};

const resolveDynasticAlliance: Resolver = (neighbor, state) => {
  const others = [...state.diplomacy.neighbors]
    .filter((n) => n.id !== neighbor.id)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return others.length > 0 ? others[0].id : null;
};

const resolveSubjugateAVassal: Resolver = (neighbor, state) => {
  const others = [...state.diplomacy.neighbors]
    .filter((n) => n.id !== neighbor.id)
    .sort((a, b) => a.militaryStrength - b.militaryStrength);
  return others.length > 0 ? others[0].id : null;
};

const resolveProveDominance: Resolver = (neighbor, state) => {
  const others = [...state.diplomacy.neighbors]
    .filter((n) => n.id !== neighbor.id)
    .sort((a, b) => b.militaryStrength - a.militaryStrength);
  return others.length > 0 ? others[0].id : null;
};

const resolveSackSettlement: Resolver = (neighbor, state) => {
  const claims = getRegionsClaimedBy(neighbor.id, state);
  for (const regionId of claims) {
    const settlements = getSettlementsIn(regionId, state);
    if (settlements.length > 0) return settlements[0].id;
  }
  // Fallback: any settlement in a border region.
  const firstBorderRegion = state.regions.find((r) => r.borderRegion);
  if (firstBorderRegion) {
    const settlements = getSettlementsIn(firstBorderRegion.id, state);
    if (settlements.length > 0) return settlements[0].id;
  }
  return null;
};

const RESOLVERS: Partial<Record<RivalAgenda, Resolver>> = {
  [RivalAgenda.RestoreTheOldBorders]: resolveRestoreBorders,
  [RivalAgenda.BleedTheRivals]: resolveBleedRivals,
  [RivalAgenda.DominateTrade]: resolveDominateTrade,
  [RivalAgenda.ReligiousHegemony]: resolveReligiousHegemony,
  [RivalAgenda.DynasticAlliance]: resolveDynasticAlliance,
  [RivalAgenda.SubjugateAVassal]: resolveSubjugateAVassal,
  [RivalAgenda.ProveDominance]: resolveProveDominance,
  [RivalAgenda.SackASettlement]: resolveSackSettlement,
};

// ---- Initial agenda selection -----------------------------------------

/**
 * Weighted agenda candidates per disposition. Each entry is (agenda, weight).
 * Multiple entries can reference the same agenda to boost its odds.
 */
const DISPOSITION_WEIGHTS: Record<NeighborDisposition, Array<[RivalAgenda, number]>> = {
  [NeighborDisposition.Aggressive]: [
    [RivalAgenda.RestoreTheOldBorders, 4],
    [RivalAgenda.ProveDominance, 3],
    [RivalAgenda.SubjugateAVassal, 2],
    [RivalAgenda.BleedTheRivals, 2],
    [RivalAgenda.SackASettlement, 1],
  ],
  [NeighborDisposition.Opportunistic]: [
    [RivalAgenda.BleedTheRivals, 3],
    [RivalAgenda.DominateTrade, 2],
    [RivalAgenda.DynasticAlliance, 2],
    [RivalAgenda.ProveDominance, 1],
    [RivalAgenda.RestoreTheOldBorders, 1],
  ],
  [NeighborDisposition.Cautious]: [
    [RivalAgenda.DefensiveConsolidation, 4],
    [RivalAgenda.DynasticAlliance, 2],
    [RivalAgenda.DominateTrade, 1],
  ],
  [NeighborDisposition.Mercantile]: [
    [RivalAgenda.DominateTrade, 5],
    [RivalAgenda.DynasticAlliance, 2],
    [RivalAgenda.EconomicRecovery, 1],
  ],
  [NeighborDisposition.Isolationist]: [
    [RivalAgenda.IsolationistRetreat, 4],
    [RivalAgenda.DefensiveConsolidation, 3],
    [RivalAgenda.ConvertThePlayer, 1],
  ],
};

function pickWeighted<T>(rng: () => number, entries: Array<[T, number]>): T {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [item, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  return entries[entries.length - 1][0];
}

/**
 * Picks an initial agenda for a neighbor. Disposition weights the preference;
 * geography resolvers may reject a candidate (e.g. RestoreTheOldBorders needs
 * at least one historic claim) — in which case we fall back to
 * DefensiveConsolidation.
 *
 * Note: deviates from the spec signature by taking state — required so
 * geography-anchored agendas can resolve real targets at selection time.
 */
export function selectInitialAgenda(
  neighbor: NeighborState,
  state: GameState,
  rng: () => number,
): RivalAgendaState {
  const entries = DISPOSITION_WEIGHTS[neighbor.disposition] ?? [
    [RivalAgenda.DefensiveConsolidation, 1],
  ];

  // Try up to 3 picks to find one whose target resolver succeeds.
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = pickWeighted(rng, entries);
    const targetId = resolveAgendaTarget(candidate, neighbor, state);
    const def = AGENDA_DEFS[candidate];
    if (def.target === 'none' || targetId !== null) {
      return {
        current: candidate,
        targetEntityId: targetId,
        progressValue: 0,
        turnsActive: 0,
      };
    }
  }

  return {
    current: RivalAgenda.DefensiveConsolidation,
    targetEntityId: null,
    progressValue: 0,
    turnsActive: 0,
  };
}

/** Resolves an agenda's target entity id. Returns null for untargeted agendas
 * and for targeted agendas that find no eligible entity. */
export function resolveAgendaTarget(
  agenda: RivalAgenda,
  neighbor: NeighborState,
  state: GameState,
): string | null {
  const def = AGENDA_DEFS[agenda];
  if (def.target === 'none') return null;
  const resolver = RESOLVERS[agenda];
  return resolver ? resolver(neighbor, state) : null;
}

// ---- Tick / shift ------------------------------------------------------

/**
 * Advances one turn of agenda state. Progress climbs when conditions favor
 * the agenda; for RestoreTheOldBorders, it only climbs while the player
 * still holds the target region (so agenda stalls once recovered).
 */
export function tickAgenda(
  agenda: RivalAgendaState,
  neighbor: NeighborState,
  world: GameState,
  rng: () => number,
): RivalAgendaState {
  void rng;
  const def = AGENDA_DEFS[agenda.current];
  const status = def.satisfaction(agenda, neighbor, world);

  let progress = agenda.progressValue;

  if (agenda.current === RivalAgenda.RestoreTheOldBorders && agenda.targetEntityId) {
    const region = world.regions.find((r) => r.id === agenda.targetEntityId);
    // Only build pressure while the player still controls the claim.
    if (region && !region.isOccupied) {
      progress = Math.min(100, progress + 2);
    }
  } else if (status === 'active') {
    progress = Math.min(100, progress + 1);
  }

  if (status === 'satisfied') {
    progress = 100;
  }

  return {
    ...agenda,
    progressValue: progress,
    turnsActive: agenda.turnsActive + 1,
  };
}

/**
 * Returns true when the agenda has run its course and should be replaced.
 * Shift triggers: turnsActive cap, satisfied agendas, or EconomicRecovery
 * clearing its treasury threshold.
 */
export function shouldAgendaShift(
  agenda: RivalAgendaState,
  neighbor: NeighborState,
  state?: GameState,
): boolean {
  if (agenda.turnsActive >= TURNS_UNTIL_SHIFT) return true;
  if (agenda.progressValue >= 100) return true;

  if (agenda.current === RivalAgenda.EconomicRecovery) {
    const sim = neighbor.kingdomSimulation;
    if (sim && sim.treasuryHealth >= 60) return true;
  }

  if (state && agenda.current === RivalAgenda.DefensiveConsolidation) {
    const sim = neighbor.kingdomSimulation;
    if (sim && sim.internalStability >= 70) return true;
  }

  return false;
}

// ---- Pressure modifier wrapper ----------------------------------------

const ACTION_TYPES: NeighborActionType[] = Object.values(NeighborActionType);

/**
 * Wraps the Phase 2 pressure record with an agenda-driven multiplier. Keeps
 * every NeighborActionType key present so callers never multiply by undefined.
 * Each score clamped to [0, 2] so pressure can't runaway.
 */
export function applyAgendaPressureModifier(
  scores: RivalActionPressureScores,
  agenda: RivalAgendaState | undefined,
  neighbor: NeighborState,
  state: GameState,
): RivalActionPressureScores {
  void neighbor;
  void state;
  if (!agenda) return scores;
  const def = AGENDA_DEFS[agenda.current];
  const result = { ...scores } as RivalActionPressureScores;
  for (const action of ACTION_TYPES) {
    const base = result[action] ?? 0;
    const mod = def.pressureModifiers[action] ?? 1;
    const next = base * mod;
    result[action] = next > 2 ? 2 : next < 0 ? 0 : next;
  }
  return result;
}

// ---- Convenience: populate agendas + memory for every neighbor --------

/**
 * Post-`finalizeGeography` pass used by scenario factories and save
 * migration. Returns a new GameState with each neighbor's agenda and
 * memory populated. Idempotent — neighbors that already have both are
 * left alone.
 */
export function seedRivalAgendas(state: GameState): GameState {
  const runSeed = state.runSeed ?? 'fallback_runseed';
  const neighbors = state.diplomacy.neighbors.map((n) => {
    if (n.agenda && n.memory) return n;
    const rng = seededRandom(`${runSeed}_${n.id}_agenda`);
    return {
      ...n,
      agenda: n.agenda ?? selectInitialAgenda(n, state, rng),
      memory: n.memory ?? [],
    };
  });
  return { ...state, diplomacy: { ...state.diplomacy, neighbors } };
}

// Re-export types for callers.
export type { AgendaTargetClass };
