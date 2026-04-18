// Phase 11 — Inter-Kingdom Diplomacy
// Pure functions over DiplomacyState. Simulates rival-vs-rival relationships,
// emits alliance / war / trade-pact agreements, and exposes queries for world
// pulse and card generation. All randomness flows from a seeded rng so replay
// remains deterministic (see turn-rng.ts header).
//
// Design anchor (CLAUDE.md rule #6): every behavior here is downstream of real
// state — agenda targets, adjacency, shared grievances, religious/cultural
// overlap — never a coin flip with flavor text.

import { areAdjacent, getInterRivalAdjacency } from './geography';
import type {
  DiplomacyState,
  GameState,
  InterRivalAgreement,
  InterRivalAgreementKind,
  NeighborState,
  RivalAgendaState,
  WorldGeography,
} from '../types';
import { RivalAgenda } from '../types';

// ============================================================
// Constants
// ============================================================

const SCORE_MIN = -100;
const SCORE_MAX = 100;
const ALLIANCE_THRESHOLD = 60;
const WAR_THRESHOLD = -60;
const TRADE_PACT_THRESHOLD = 40;
const TRADE_PACT_DURATION = 24;
const WAR_MIN_DURATION = 18;
const MAX_ACTIONS_PER_TURN = 1;

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min = SCORE_MIN, max = SCORE_MAX): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** Canonical key ordering so the pair (a,b) == (b,a). */
function canonicalPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function getScore(
  matrix: Record<string, Record<string, number>>,
  a: string,
  b: string,
): number {
  return matrix[a]?.[b] ?? 0;
}

function setScoreSymmetric(
  matrix: Record<string, Record<string, number>>,
  a: string,
  b: string,
  value: number,
): Record<string, Record<string, number>> {
  const clamped = clamp(value);
  const next: Record<string, Record<string, number>> = { ...matrix };
  next[a] = { ...(next[a] ?? {}), [b]: clamped };
  next[b] = { ...(next[b] ?? {}), [a]: clamped };
  return next;
}

function pairKey(a: string, b: string): string {
  const [lo, hi] = canonicalPair(a, b);
  return `${lo}|${hi}`;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Build the initial symmetric relationship matrix from static neighbor data.
 * - Cultural + religious overlap each contribute +5.
 * - Open adjacency contributes +5; contested adjacency contributes −10.
 * - Disposition pairings nudge by ±5 (isolationist/cautious neutral, aggressive
 *   pairs mutually dislike, mercantile pairs mutually prefer).
 * Symmetric; same seed always produces the same matrix.
 */
export function createInitialRivalRelationships(
  neighbors: NeighborState[],
  geography: WorldGeography | undefined,
): Record<string, Record<string, number>> {
  let matrix: Record<string, Record<string, number>> = {};
  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const a = neighbors[i];
      const b = neighbors[j];
      let score = 0;
      if (a.culturalIdentity === b.culturalIdentity) score += 5;
      if (a.religiousProfile === b.religiousProfile) score += 5;

      const edge = geography?.edges?.find(
        (e) =>
          (e.a === a.id && e.b === b.id) || (e.a === b.id && e.b === a.id),
      );
      if (edge) {
        if (edge.frictionTier === 'open') score += 5;
        else if (edge.frictionTier === 'contested') score -= 10;
        else if (edge.frictionTier === 'difficult') score -= 2;
      }

      if (a.disposition === 'Aggressive' && b.disposition === 'Aggressive') {
        score -= 5;
      }
      if (a.disposition === 'Mercantile' && b.disposition === 'Mercantile') {
        score += 5;
      }
      if (a.disposition === 'Isolationist' || b.disposition === 'Isolationist') {
        score -= 2;
      }

      matrix = setScoreSymmetric(matrix, a.id, b.id, score);
    }
  }
  return matrix;
}

// ============================================================
// Per-Turn Tick
// ============================================================

export interface InterRivalTickResult {
  diplomacy: DiplomacyState;
}

interface AgendaLike {
  agenda?: RivalAgendaState;
  id: string;
  isAtWarWithPlayer: boolean;
  culturalIdentity: string;
  religiousProfile: string;
}

function sharedAgendaTarget(a: AgendaLike, b: AgendaLike): boolean {
  const ta = a.agenda?.targetEntityId;
  const tb = b.agenda?.targetEntityId;
  if (!ta || !tb) return false;
  if (ta === tb) return true;
  return false;
}

function opposingAgenda(a: AgendaLike, b: AgendaLike): boolean {
  // A's agenda directly targets B, or vice versa.
  if (a.agenda?.targetEntityId === b.id) return true;
  if (b.agenda?.targetEntityId === a.id) return true;
  // Mutual ProveDominance / SubjugateAVassal rivalry.
  if (
    a.agenda?.current === RivalAgenda.ProveDominance &&
    b.agenda?.current === RivalAgenda.ProveDominance
  ) {
    return true;
  }
  return false;
}

/**
 * Advance the inter-rival relationship matrix by one turn. Pure function.
 * Returns the diplomacy slice with updated `rivalRelationships`.
 */
export function tickInterRivalRelationships(
  diplomacy: DiplomacyState,
  state: GameState,
): InterRivalTickResult {
  const neighbors = diplomacy.neighbors;
  const prior = diplomacy.rivalRelationships ?? {};
  const agreements = diplomacy.interRivalAgreements ?? [];
  let matrix: Record<string, Record<string, number>> = prior;

  const byId = new Map<string, NeighborState>();
  for (const n of neighbors) byId.set(n.id, n);

  const agreementByPair = new Map<string, InterRivalAgreement[]>();
  for (const ag of agreements) {
    const key = pairKey(ag.a, ag.b);
    const list = agreementByPair.get(key) ?? [];
    list.push(ag);
    agreementByPair.set(key, list);
  }

  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const a = neighbors[i];
      const b = neighbors[j];
      let delta = 0;

      if (sharedAgendaTarget(a, b)) delta += 1;
      if (opposingAgenda(a, b)) delta -= 2;

      if (a.isAtWarWithPlayer && b.isAtWarWithPlayer) delta += 1;
      if (a.culturalIdentity !== b.culturalIdentity) delta -= 0.25;
      if (a.religiousProfile !== b.religiousProfile) delta -= 0.25;

      const pairAgreements = agreementByPair.get(pairKey(a.id, b.id)) ?? [];
      for (const ag of pairAgreements) {
        if (ag.kind === 'alliance') delta += 0.5;
        else if (ag.kind === 'trade_pact') delta += 0.5;
        else if (ag.kind === 'war') delta -= 3;
      }

      // Adjacency subtle pressure.
      if (areAdjacent(a.id, b.id, state)) {
        const edge = state.geography?.edges?.find(
          (e) =>
            (e.a === a.id && e.b === b.id) ||
            (e.a === b.id && e.b === a.id),
        );
        if (edge?.frictionTier === 'contested') delta -= 0.5;
      }

      if (delta === 0) continue;
      matrix = setScoreSymmetric(
        matrix,
        a.id,
        b.id,
        getScore(matrix, a.id, b.id) + delta,
      );
    }
  }

  return {
    diplomacy: { ...diplomacy, rivalRelationships: matrix },
  };
}

// ============================================================
// Action Generation
// ============================================================

export interface InterRivalAction {
  kind: InterRivalAgreementKind;
  a: string;
  b: string;
  sharedTargetId?: string | null;
  turnGenerated: number;
}

const ALLIANCE_AGENDAS = new Set<RivalAgenda>([
  RivalAgenda.DynasticAlliance,
  RivalAgenda.BleedTheRivals,
  RivalAgenda.DefensiveConsolidation,
]);

const WAR_AGENDAS = new Set<RivalAgenda>([
  RivalAgenda.ProveDominance,
  RivalAgenda.SubjugateAVassal,
  RivalAgenda.RestoreTheOldBorders,
]);

function sharedHostilityTarget(
  a: NeighborState,
  b: NeighborState,
  matrix: Record<string, Record<string, number>>,
  neighbors: NeighborState[],
): string | null {
  if (a.isAtWarWithPlayer && b.isAtWarWithPlayer) return 'player';
  for (const other of neighbors) {
    if (other.id === a.id || other.id === b.id) continue;
    if (getScore(matrix, a.id, other.id) <= -30 && getScore(matrix, b.id, other.id) <= -30) {
      return other.id;
    }
  }
  return null;
}

function hasActiveAgreement(
  agreements: InterRivalAgreement[],
  a: string,
  b: string,
  kind: InterRivalAgreementKind,
): boolean {
  const [lo, hi] = canonicalPair(a, b);
  return agreements.some((ag) => ag.a === lo && ag.b === hi && ag.kind === kind);
}

/**
 * Evaluates every rival pair and returns at most MAX_ACTIONS_PER_TURN actions.
 * Actions are ranked by absolute score magnitude so the most dramatic pair
 * fires first. Deterministic given the matrix + rng.
 */
export function generateInterRivalActions(
  diplomacy: DiplomacyState,
  state: GameState,
  turn: number,
  rng: () => number,
): InterRivalAction[] {
  const matrix = diplomacy.rivalRelationships ?? {};
  const agreements = diplomacy.interRivalAgreements ?? [];
  const neighbors = diplomacy.neighbors;
  const candidates: Array<{ action: InterRivalAction; priority: number }> = [];

  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const a = neighbors[i];
      const b = neighbors[j];
      const score = getScore(matrix, a.id, b.id);
      const adjacent = areAdjacent(a.id, b.id, state);
      const edge = adjacent
        ? state.geography?.edges?.find(
            (e) =>
              (e.a === a.id && e.b === b.id) ||
              (e.a === b.id && e.b === a.id),
          )
        : undefined;
      const contested = edge?.frictionTier === 'contested';

      // Alliance
      if (
        score >= ALLIANCE_THRESHOLD &&
        !hasActiveAgreement(agreements, a.id, b.id, 'alliance') &&
        !hasActiveAgreement(agreements, a.id, b.id, 'war')
      ) {
        const sharedTarget = sharedHostilityTarget(a, b, matrix, neighbors);
        const eligibleAgenda =
          (a.agenda && ALLIANCE_AGENDAS.has(a.agenda.current)) ||
          (b.agenda && ALLIANCE_AGENDAS.has(b.agenda.current));
        if (sharedTarget && eligibleAgenda) {
          const baseChance = adjacent ? 0.45 : 0.3;
          if (rng() < baseChance) {
            const [lo, hi] = canonicalPair(a.id, b.id);
            candidates.push({
              action: {
                kind: 'alliance',
                a: lo,
                b: hi,
                sharedTargetId: sharedTarget,
                turnGenerated: turn,
              },
              priority: score,
            });
          }
        }
      }

      // War
      if (
        score <= WAR_THRESHOLD &&
        adjacent &&
        !hasActiveAgreement(agreements, a.id, b.id, 'war')
      ) {
        const warAgendaActive =
          (a.agenda &&
            WAR_AGENDAS.has(a.agenda.current) &&
            a.agenda.targetEntityId === b.id) ||
          (b.agenda &&
            WAR_AGENDAS.has(b.agenda.current) &&
            b.agenda.targetEntityId === a.id) ||
          (a.agenda?.current === RivalAgenda.ProveDominance &&
            b.agenda?.current === RivalAgenda.ProveDominance);
        if (warAgendaActive) {
          const baseChance = contested ? 0.4 : 0.2;
          if (rng() < baseChance) {
            const [lo, hi] = canonicalPair(a.id, b.id);
            candidates.push({
              action: {
                kind: 'war',
                a: lo,
                b: hi,
                turnGenerated: turn,
              },
              priority: Math.abs(score) + 10, // wars take precedence
            });
          }
        }
      }

      // Trade pact
      if (
        score >= TRADE_PACT_THRESHOLD &&
        !hasActiveAgreement(agreements, a.id, b.id, 'trade_pact') &&
        !hasActiveAgreement(agreements, a.id, b.id, 'war')
      ) {
        const aMerc =
          (a.kingdomSimulation?.mercantilePressure ?? 0) >= 50 ||
          a.disposition === 'Mercantile';
        const bMerc =
          (b.kingdomSimulation?.mercantilePressure ?? 0) >= 50 ||
          b.disposition === 'Mercantile';
        if (aMerc && bMerc) {
          const baseChance = 0.3;
          if (rng() < baseChance) {
            const [lo, hi] = canonicalPair(a.id, b.id);
            candidates.push({
              action: {
                kind: 'trade_pact',
                a: lo,
                b: hi,
                turnGenerated: turn,
              },
              priority: score * 0.5,
            });
          }
        }
      }
    }
  }

  candidates.sort((x, y) => y.priority - x.priority);
  return candidates.slice(0, MAX_ACTIONS_PER_TURN).map((c) => c.action);
}

// ============================================================
// Applying Actions
// ============================================================

export function applyInterRivalAction(
  diplomacy: DiplomacyState,
  action: InterRivalAction,
  turn: number,
): DiplomacyState {
  const agreements = [...(diplomacy.interRivalAgreements ?? [])];
  const [lo, hi] = canonicalPair(action.a, action.b);
  const agreement: InterRivalAgreement = {
    id: `${lo}_${hi}_${action.kind}_t${turn}`,
    kind: action.kind,
    a: lo,
    b: hi,
    turnStarted: turn,
    sharedTargetId: action.sharedTargetId ?? null,
  };
  agreements.push(agreement);

  let matrix = diplomacy.rivalRelationships ?? {};
  const currentScore = getScore(matrix, lo, hi);
  if (action.kind === 'alliance') {
    matrix = setScoreSymmetric(matrix, lo, hi, Math.max(currentScore, 75));
  } else if (action.kind === 'war') {
    matrix = setScoreSymmetric(matrix, lo, hi, Math.min(currentScore, -80));
  } else if (action.kind === 'trade_pact') {
    matrix = setScoreSymmetric(matrix, lo, hi, Math.max(currentScore, 50));
  }

  return {
    ...diplomacy,
    rivalRelationships: matrix,
    interRivalAgreements: agreements,
  };
}

// ============================================================
// Expiration
// ============================================================

/**
 * Prunes expired agreements. Trade pacts have fixed duration. Wars resolve
 * after WAR_MIN_DURATION turns with an rng gate so outcomes vary but replay
 * stays deterministic.
 */
export function expireInterRivalAgreements(
  agreements: InterRivalAgreement[],
  turn: number,
  rng: () => number = Math.random,
): InterRivalAgreement[] {
  return agreements.filter((ag) => {
    const age = turn - ag.turnStarted;
    if (ag.kind === 'trade_pact') return age < TRADE_PACT_DURATION;
    if (ag.kind === 'war') {
      if (age < WAR_MIN_DURATION) return true;
      return rng() > 0.2;
    }
    return true; // alliances persist until superseded
  });
}

// ============================================================
// Queries
// ============================================================

export function getActiveInterRivalWars(
  diplomacy: DiplomacyState,
): InterRivalAgreement[] {
  return (diplomacy.interRivalAgreements ?? []).filter((a) => a.kind === 'war');
}

export function getActiveInterRivalAlliances(
  diplomacy: DiplomacyState,
): InterRivalAgreement[] {
  return (diplomacy.interRivalAgreements ?? []).filter(
    (a) => a.kind === 'alliance',
  );
}

export function getActiveInterRivalTradePacts(
  diplomacy: DiplomacyState,
): InterRivalAgreement[] {
  return (diplomacy.interRivalAgreements ?? []).filter(
    (a) => a.kind === 'trade_pact',
  );
}

export interface CoalitionCandidate {
  a: string;
  b: string;
  adjacent: boolean;
  sharedGrievances: number;
  score: number;
}

/**
 * Ranks rival pairs that could plausibly form a coalition against the player,
 * using `getInterRivalAdjacency` ∩ shared grievance memories (Phase 3).
 * Used by the coalition card generator (Task 11.4).
 */
/**
 * Scenario-factory helper. Idempotent: leaves an already-populated matrix
 * alone. Call after finalizeGeography + seedRivalAgendas so the matrix sees
 * final cultural/religious/adjacency data.
 */
export function seedInterRivalRelationships(state: GameState): GameState {
  const diplomacy = state.diplomacy;
  if (diplomacy.rivalRelationships && diplomacy.interRivalAgreements) {
    return state;
  }
  const rivalRelationships =
    diplomacy.rivalRelationships ??
    createInitialRivalRelationships(diplomacy.neighbors, state.geography);
  const interRivalAgreements = diplomacy.interRivalAgreements ?? [];
  return {
    ...state,
    diplomacy: {
      ...diplomacy,
      rivalRelationships,
      interRivalAgreements,
    },
  };
}

export function findCoalitionCandidates(state: GameState): CoalitionCandidate[] {
  const diplomacy = state.diplomacy;
  const neighbors = diplomacy.neighbors;
  const adjacencyPairs = getInterRivalAdjacency(state);
  const adjacentSet = new Set(adjacencyPairs.map(([a, b]) => pairKey(a, b)));
  const matrix = diplomacy.rivalRelationships ?? {};

  const GRIEVANCE_TYPES = new Set(['slight', 'breach', 'territorial_loss']);

  const candidates: CoalitionCandidate[] = [];
  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const a = neighbors[i];
      const b = neighbors[j];
      // Skip pairs already at war with each other — they can't coalesce.
      const atWar = (diplomacy.interRivalAgreements ?? []).some(
        (ag) =>
          ag.kind === 'war' &&
          ag.a === canonicalPair(a.id, b.id)[0] &&
          ag.b === canonicalPair(a.id, b.id)[1],
      );
      if (atWar) continue;

      const aGrievances = (a.memory ?? []).filter((m) =>
        GRIEVANCE_TYPES.has(m.type),
      );
      const bGrievances = (b.memory ?? []).filter((m) =>
        GRIEVANCE_TYPES.has(m.type),
      );
      let sharedGrievances = 0;
      for (const ga of aGrievances) {
        for (const gb of bGrievances) {
          if (ga.source === gb.source) sharedGrievances++;
        }
      }
      if (sharedGrievances === 0) continue;

      const adjacent = adjacentSet.has(pairKey(a.id, b.id));
      const relationshipScore = getScore(matrix, a.id, b.id);
      const score =
        sharedGrievances * 10 + (adjacent ? 15 : 0) + Math.max(0, relationshipScore) * 0.2;
      candidates.push({
        a: a.id,
        b: b.id,
        adjacent,
        sharedGrievances,
        score,
      });
    }
  }
  candidates.sort((x, y) => y.score - x.score);
  return candidates;
}
