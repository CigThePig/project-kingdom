// Phase 12 — Dynamic World Events
// Pure functions over GameState. Spawns region-wide events (plagues, economic
// shocks, religious movements, climatic / celestial / agricultural / cooperative
// / mercenary situations) that spread across the geography graph, applies their
// per-turn effects to each affected kingdom, and surfaces a crisis card for
// the player when the event reaches the player's realm.
//
// Design anchor (CLAUDE.md rule 6): every behavior here is downstream of real
// state — adjacency, region conditions, rival internals, existing pool state —
// never a coin-flip with flavor text. Randomness flows from a caller-provided
// rng so replay stays deterministic (see turn-rng patterns).

import type {
  ActiveEvent,
  ActiveWorldEvent,
  AdjacencyEdge,
  AdjacencyKind,
  GameState,
  NeighborState,
  WorldEventDefinition,
  WorldEventEffect,
  WorldEventKingdomId,
} from '../types';
import {
  EventCategory,
  EventSeverity,
} from '../types';

// ============================================================
// Constants
// ============================================================

/** At most this many concurrently-active world events. Keeps the noise floor
 *  low and the card queue readable. */
const MAX_CONCURRENT_WORLD_EVENTS = 2;

/** Minimum turns between spawns (cooldown). Combined with weighted gating this
 *  yields the 8–15 turn average target from the design doc. */
const MIN_TURNS_BETWEEN_SPAWNS = 8;

/** Base per-turn probability of rolling a spawn once cooldown/cap clear. Tuned
 *  so the expected inter-arrival is ~8–15 turns. */
const BASE_SPAWN_ROLL = 0.18;

/** Upper bound on affected-kingdom list length, as a safety net. */
const MAX_AFFECTED_KINGDOMS = 16;

export const PLAYER_KINGDOM_ID: WorldEventKingdomId = 'player';

// ============================================================
// Helpers
// ============================================================

function weightedPick<T>(
  items: T[],
  weightFn: (item: T) => number,
  rng: () => number,
): T | null {
  if (items.length === 0) return null;
  const weights = items.map(weightFn);
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (total <= 0) return null;
  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    const w = Math.max(0, weights[i]);
    if (roll < w) return items[i];
    roll -= w;
  }
  return items[items.length - 1];
}

/** Kingdoms in the simulation = 'player' + every neighbor. */
function listAllKingdoms(state: GameState): WorldEventKingdomId[] {
  const ids: WorldEventKingdomId[] = [PLAYER_KINGDOM_ID];
  for (const n of state.diplomacy.neighbors) ids.push(n.id);
  return ids;
}

/** A kingdom is "coastal" if at least one of its edges is a sea edge. For the
 *  player we treat any `sea` edge on a player region as coastal; for neighbors
 *  we treat any `sea` edge touching the neighbor id as coastal. */
function kingdomIsCoastal(state: GameState, kingdomId: WorldEventKingdomId): boolean {
  const edges = state.geography?.edges ?? [];
  if (kingdomId === PLAYER_KINGDOM_ID) {
    const playerRegionIds = new Set(state.regions.map((r) => r.id));
    return edges.some(
      (e) => e.kind === 'sea' && (playerRegionIds.has(e.a) || playerRegionIds.has(e.b)),
    );
  }
  return edges.some(
    (e) => e.kind === 'sea' && (e.a === kingdomId || e.b === kingdomId),
  );
}

/** A kingdom is on a "border" if it has any adjacency edge at all. Used as a
 *  mild filter — in a well-formed geography almost everyone qualifies. */
function kingdomHasAnyAdjacency(state: GameState, kingdomId: WorldEventKingdomId): boolean {
  const idx = state.geography?._adjacencyIndex;
  if (!idx) return false;
  if (kingdomId === PLAYER_KINGDOM_ID) {
    for (const r of state.regions) {
      if ((idx[r.id]?.length ?? 0) > 0) return true;
    }
    return false;
  }
  return (idx[kingdomId]?.length ?? 0) > 0;
}

/** Collects every adjacency edge that touches the given kingdom. For the
 *  player, that's any edge touching one of its regions. For a neighbor, any
 *  edge where the neighbor id is an endpoint, plus edges touching regions
 *  claimed by that neighbor (via historicClaims). */
function getKingdomEdges(state: GameState, kingdomId: WorldEventKingdomId): AdjacencyEdge[] {
  const edges = state.geography?.edges ?? [];
  if (kingdomId === PLAYER_KINGDOM_ID) {
    const playerRegionIds = new Set(state.regions.map((r) => r.id));
    return edges.filter((e) => playerRegionIds.has(e.a) || playerRegionIds.has(e.b));
  }
  const claimedRegionIds = new Set(
    (state.geography?.historicClaims ?? [])
      .filter((c) => c.neighborId === kingdomId)
      .map((c) => c.regionId),
  );
  return edges.filter(
    (e) =>
      e.a === kingdomId
      || e.b === kingdomId
      || claimedRegionIds.has(e.a)
      || claimedRegionIds.has(e.b),
  );
}

/** Resolves the "other endpoint" of an edge into a kingdom id. Returns null
 *  when the other endpoint is a region that does not belong to any tracked
 *  kingdom (e.g. contested no-man's-land). */
function edgeOtherKingdom(
  state: GameState,
  edge: AdjacencyEdge,
  fromKingdomId: WorldEventKingdomId,
): WorldEventKingdomId | null {
  const playerRegionIds = new Set(state.regions.map((r) => r.id));
  const claimsByRegion = state.geography?._claimsByRegion ?? {};

  const endpointToKingdom = (endpoint: string): WorldEventKingdomId | null => {
    if (endpoint.startsWith('neighbor_')) return endpoint;
    if (playerRegionIds.has(endpoint)) return PLAYER_KINGDOM_ID;
    const claims = claimsByRegion[endpoint] ?? [];
    if (claims.length > 0) return claims[0];
    return null;
  };

  const kA = endpointToKingdom(edge.a);
  const kB = endpointToKingdom(edge.b);
  if (kA && kA !== fromKingdomId) return kA;
  if (kB && kB !== fromKingdomId) return kB;
  return null;
}

// ============================================================
// Spawn
// ============================================================

/** Picks one or more seed kingdoms based on the definition's selector. Always
 *  returns at least one id if there are any eligible kingdoms. */
function selectSeedKingdoms(
  def: WorldEventDefinition,
  state: GameState,
  rng: () => number,
): WorldEventKingdomId[] {
  const all = listAllKingdoms(state);
  switch (def.seedSelector) {
    case 'all_kingdoms':
      return all;
    case 'coastal': {
      const coastal = all.filter((k) => kingdomIsCoastal(state, k));
      if (coastal.length === 0) return [];
      const pick = coastal[Math.floor(rng() * coastal.length)];
      return [pick];
    }
    case 'border': {
      const bordered = all.filter((k) => kingdomHasAnyAdjacency(state, k));
      if (bordered.length === 0) return [];
      const pick = bordered[Math.floor(rng() * bordered.length)];
      return [pick];
    }
    case 'player_and_adjacent': {
      // Seed at player plus one adjacent neighbor, if any.
      const seeds: WorldEventKingdomId[] = [PLAYER_KINGDOM_ID];
      const playerEdges = getKingdomEdges(state, PLAYER_KINGDOM_ID);
      const neighbors = new Set<string>();
      for (const e of playerEdges) {
        const k = edgeOtherKingdom(state, e, PLAYER_KINGDOM_ID);
        if (k && k !== PLAYER_KINGDOM_ID) neighbors.add(k);
      }
      const arr = Array.from(neighbors);
      if (arr.length > 0) {
        seeds.push(arr[Math.floor(rng() * arr.length)]);
      }
      return seeds;
    }
    case 'any':
    default: {
      if (all.length === 0) return [];
      const pick = all[Math.floor(rng() * all.length)];
      return [pick];
    }
  }
}

/** Determines whether a fresh world event should be spawned this turn, and if
 *  so picks one from the pool. Gates on concurrent-cap and cooldown. */
export function spawnWorldEvent(
  state: GameState,
  pool: WorldEventDefinition[],
  turn: number,
  rng: () => number,
): ActiveWorldEvent | null {
  const active = state.activeWorldEvents ?? [];
  if (active.length >= MAX_CONCURRENT_WORLD_EVENTS) return null;

  const mostRecentSpawn = active.reduce(
    (max, w) => (w.turnSpawned > max ? w.turnSpawned : max),
    -Infinity,
  );
  if (Number.isFinite(mostRecentSpawn) && turn - mostRecentSpawn < MIN_TURNS_BETWEEN_SPAWNS) {
    return null;
  }

  if (rng() >= BASE_SPAWN_ROLL) return null;

  const eligible = pool.filter((d) => turn >= d.minTurn);
  if (eligible.length === 0) return null;

  const def = weightedPick(eligible, (d) => d.spawnWeight, rng);
  if (!def) return null;

  const seeds = selectSeedKingdoms(def, state, rng);
  if (seeds.length === 0) return null;

  return {
    id: `${def.id}_t${turn}`,
    definitionId: def.id,
    category: def.category,
    severity: def.severity,
    turnSpawned: turn,
    turnsRemaining: def.durationTurns,
    phase: 'emerging',
    affectedKingdoms: seeds.slice(0, MAX_AFFECTED_KINGDOMS),
    recoveredKingdoms: [],
    playerCardSurfacedOnTurn: null,
  };
}

// ============================================================
// Tick (phase transitions + duration)
// ============================================================

/** Advances an event by one turn: phase progression (emerging → active →
 *  waning → resolved) and optional duration countdown. Pure. The `state` and
 *  `rng` parameters are reserved so the signature matches the other tick
 *  helpers and so future rules (e.g. weather-driven early resolution) can be
 *  added without a breaking change. */
export function tickWorldEvent(
  event: ActiveWorldEvent,
  def: WorldEventDefinition,
  state: GameState,
  rng: () => number,
): ActiveWorldEvent {
  void state;
  void rng;
  let next: ActiveWorldEvent = { ...event };

  // Phase progression: emerging → active after 1 turn; active → waning when
  // turnsRemaining ≤ 25% of the duration; waning → resolved when expired or
  // all kingdoms have recovered.
  if (next.phase === 'emerging') {
    next = { ...next, phase: 'active' };
  }

  const currentRemaining = next.turnsRemaining;
  if (currentRemaining !== null) {
    const nextRemaining = Math.max(0, currentRemaining - 1);
    next = { ...next, turnsRemaining: nextRemaining };
    if (def.durationTurns !== null && nextRemaining <= def.durationTurns * 0.25) {
      if (next.phase === 'active') next = { ...next, phase: 'waning' };
    }
    if (nextRemaining === 0) {
      next = { ...next, phase: 'resolved' };
    }
  }

  if (next.affectedKingdoms.length === 0 && next.phase !== 'resolved') {
    next = { ...next, phase: 'resolved' };
  }

  return next;
}

// ============================================================
// Spread
// ============================================================

/** Attempts to spread the event to new kingdoms via eligible adjacency edges.
 *  Never re-infects `recoveredKingdoms`. Deterministic given rng. */
export function spreadWorldEvent(
  event: ActiveWorldEvent,
  def: WorldEventDefinition,
  state: GameState,
  rng: () => number,
): ActiveWorldEvent {
  if (event.phase === 'resolved' || event.phase === 'waning') return event;
  if (!state.geography) return event;

  const transmittedBy = new Set<AdjacencyKind>(def.spread.transmittedBy);
  const blockedBy = new Set<AdjacencyKind>(def.spread.blockedBy ?? []);
  const affected = new Set(event.affectedKingdoms);
  const recovered = new Set(event.recoveredKingdoms);

  const newlyAffected: WorldEventKingdomId[] = [];

  for (const fromKingdom of event.affectedKingdoms) {
    const edges = getKingdomEdges(state, fromKingdom);
    for (const edge of edges) {
      if (blockedBy.has(edge.kind)) continue;
      if (!transmittedBy.has(edge.kind)) continue;
      const target = edgeOtherKingdom(state, edge, fromKingdom);
      if (!target) continue;
      if (affected.has(target) || recovered.has(target)) continue;
      if (newlyAffected.includes(target)) continue;
      if (rng() < def.spread.baseProbabilityPerTurn) {
        newlyAffected.push(target);
      }
    }
  }

  if (newlyAffected.length === 0) return event;

  const combined = [...event.affectedKingdoms, ...newlyAffected].slice(
    0,
    MAX_AFFECTED_KINGDOMS,
  );
  return { ...event, affectedKingdoms: combined };
}

// ============================================================
// Effect application
// ============================================================

function clampNumber(v: number, lo: number, hi: number): number {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

function applyEffectToPlayer(state: GameState, effect: WorldEventEffect): GameState {
  const v = effect.value;
  switch (effect.kind) {
    case 'treasury':
      return {
        ...state,
        treasury: { ...state.treasury, balance: state.treasury.balance + v },
      };
    case 'food':
      return {
        ...state,
        food: { ...state.food, reserves: Math.max(0, state.food.reserves + v) },
      };
    case 'stability':
      return {
        ...state,
        stability: {
          ...state.stability,
          value: clampNumber(state.stability.value + v, 0, 100),
        },
      };
    case 'military_readiness':
      return {
        ...state,
        military: {
          ...state.military,
          readiness: clampNumber(state.military.readiness + v, 0, 100),
        },
      };
    case 'faith':
      return {
        ...state,
        faithCulture: {
          ...state.faithCulture,
          faithLevel: clampNumber(state.faithCulture.faithLevel + v, 0, 100),
        },
      };
    case 'heterodoxy':
      return {
        ...state,
        faithCulture: {
          ...state.faithCulture,
          heterodoxy: clampNumber(state.faithCulture.heterodoxy + v, 0, 100),
        },
      };
    case 'population':
      // Population changes apply as total-commoners nudge. Small value only.
      // Skipped here to keep the effect space bounded; commoners handle it.
      return state;
    case 'diplomacy_to_player':
    case 'rival_mood':
      // These only make sense on neighbors; no-op for player.
      return state;
    default:
      return state;
  }
}

function applyEffectToNeighbor(
  neighbor: NeighborState,
  effect: WorldEventEffect,
): NeighborState {
  const v = effect.value;
  const sim = neighbor.kingdomSimulation;
  switch (effect.kind) {
    case 'treasury':
      if (!sim) return neighbor;
      return {
        ...neighbor,
        kingdomSimulation: {
          ...sim,
          treasuryHealth: clampNumber(sim.treasuryHealth + v, 0, 100),
        },
      };
    case 'food':
      if (!sim) return neighbor;
      return {
        ...neighbor,
        kingdomSimulation: {
          ...sim,
          foodSecurity: clampNumber(sim.foodSecurity + v, 0, 100),
        },
      };
    case 'stability':
      if (!sim) return neighbor;
      return {
        ...neighbor,
        kingdomSimulation: {
          ...sim,
          internalStability: clampNumber(sim.internalStability + v, 0, 100),
        },
      };
    case 'military_readiness':
      return {
        ...neighbor,
        militaryStrength: clampNumber(neighbor.militaryStrength + v, 0, 100),
      };
    case 'rival_mood':
      if (!sim) return neighbor;
      return {
        ...neighbor,
        kingdomSimulation: {
          ...sim,
          populationMood: clampNumber(sim.populationMood + v, 0, 100),
        },
      };
    case 'diplomacy_to_player':
      return {
        ...neighbor,
        relationshipScore: clampNumber(neighbor.relationshipScore + v, 0, 100),
      };
    case 'faith':
    case 'heterodoxy':
    case 'population':
      // No neighbor-side surface for these today; deliberately silent so data
      // authors can still declare them for player-only events.
      return neighbor;
    default:
      return neighbor;
  }
}

/** Applies one turn of effects from all currently active events to every
 *  affected kingdom. Pure. */
export function applyWorldEventEffects(
  state: GameState,
  events: ActiveWorldEvent[],
  pool: WorldEventDefinition[],
): GameState {
  if (events.length === 0) return state;
  let next = state;
  let neighbors = state.diplomacy.neighbors;
  let neighborsChanged = false;

  for (const event of events) {
    if (event.phase === 'resolved') continue;
    const def = pool.find((d) => d.id === event.definitionId);
    if (!def) continue;
    for (const kingdomId of event.affectedKingdoms) {
      for (const effect of def.perTurnEffects) {
        if (kingdomId === PLAYER_KINGDOM_ID) {
          next = applyEffectToPlayer(next, effect);
        } else {
          const idx = neighbors.findIndex((n) => n.id === kingdomId);
          if (idx === -1) continue;
          const updated = applyEffectToNeighbor(neighbors[idx], effect);
          if (updated !== neighbors[idx]) {
            neighbors = neighbors.map((n, i) => (i === idx ? updated : n));
            neighborsChanged = true;
          }
        }
      }
    }
  }

  if (neighborsChanged) {
    next = { ...next, diplomacy: { ...next.diplomacy, neighbors } };
  }
  return next;
}

// ============================================================
// Player card surfacing
// ============================================================

/** For each active world event affecting the player that hasn't yet surfaced
 *  a crisis card, synthesize an `ActiveEvent` entry and mark the world event
 *  as surfaced. Reuses the existing crisis card pipeline — no parallel UI. */
export function surfaceWorldEventsToActiveEvents(
  events: ActiveWorldEvent[],
  _pool: WorldEventDefinition[],
  activeEvents: ActiveEvent[],
  turn: number,
): { activeEvents: ActiveEvent[]; worldEvents: ActiveWorldEvent[] } {
  if (events.length === 0) return { activeEvents, worldEvents: events };

  const newEvents: ActiveEvent[] = [];
  const updatedWorldEvents = events.map((we) => {
    if (we.phase === 'resolved') return we;
    if (we.playerCardSurfacedOnTurn !== null) return we;
    if (!we.affectedKingdoms.includes(PLAYER_KINGDOM_ID)) return we;

    newEvents.push({
      id: `evt_${we.id}`,
      definitionId: we.definitionId,
      severity: we.severity,
      category: categoryToEventCategory(we.category),
      isResolved: false,
      choiceMade: null,
      chainId: null,
      chainStep: null,
      turnSurfaced: turn,
      affectedRegionId: null,
      affectedClassId: null,
      affectedNeighborId: null,
      relatedStorylineId: null,
      outcomeQuality: null,
      isFollowUp: false,
      followUpSourceId: null,
    });

    return { ...we, playerCardSurfacedOnTurn: turn };
  });

  if (newEvents.length === 0) {
    return { activeEvents, worldEvents: updatedWorldEvents };
  }
  return {
    activeEvents: [...activeEvents, ...newEvents],
    worldEvents: updatedWorldEvents,
  };
}

function categoryToEventCategory(cat: WorldEventDefinition['category']): EventCategory {
  switch (cat) {
    case 'plague':
    case 'climatic':
      return EventCategory.Environment;
    case 'economic_shock':
    case 'cooperative':
      return EventCategory.Economy;
    case 'religious_movement':
      return EventCategory.Religion;
    case 'celestial':
      return EventCategory.Culture;
    case 'agricultural':
      return EventCategory.Food;
    case 'mercenary':
      return EventCategory.Military;
    default:
      return EventCategory.Kingdom;
  }
}

// Hush unused-import warnings where the enum ref must exist for the signature.
void EventSeverity;
