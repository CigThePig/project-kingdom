// Phase 13 — Diplomatic Bonds
// Rich, typed replacement for the flat DiplomaticAgreement. Bonds bundle
// kind-specific state (spouse names, tribute amounts, hostages, coalition
// targets) and carry their own per-turn effect application. Pure functions
// only — never mutate the incoming state.

import type {
  Bond,
  BondKind,
  CoalitionBond,
  CulturalExchangeBond,
  GameState,
  HostageBond,
  MarriageBond,
  MutualDefenseBond,
  NeighborState,
  ReligiousAccordBond,
  RivalMemoryEntry,
  TradeLeagueBond,
  VassalageBond,
} from '../types';
import { applyDiplomaticActionEffect } from './diplomacy';
import { areAdjacent } from './geography';
import { recordMemory } from './rival-memory';

/** Relationship floor enforced by hostage bonds on both sides. */
const HOSTAGE_FLOOR = 30;
/** Fractional per-turn deltas accumulate via fixed rounding each tick. */
function nudgeRelationship(
  neighbors: NeighborState[],
  neighborId: string,
  delta: number,
): NeighborState[] {
  if (delta === 0) return neighbors;
  return applyDiplomaticActionEffect(neighbors, neighborId, delta);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// --- ID generation ---

/** Small deterministic hash producing 6 base36 chars. Identical seeds → identical ids. */
function shortHash(input: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).slice(0, 6).padStart(6, '0');
}

export function bondIdFor(kind: BondKind, participants: string[], turn: number): string {
  const seed = `${kind}|${[...participants].sort().join(',')}|${turn}`;
  return `${kind}_t${turn}_${shortHash(seed)}`;
}

// --- Queries ---

export function getBondsForNeighbor(neighborId: string, state: GameState): Bond[] {
  const bonds = state.diplomacy.bonds ?? [];
  return bonds.filter((b) => b.participants.includes(neighborId));
}

export function hasBondOfKind(neighborId: string, kind: BondKind, state: GameState): boolean {
  return getBondsForNeighbor(neighborId, state).some((b) => b.kind === kind);
}

// --- Creation ---

export interface CreateMarriageBondArgs {
  participants: string[]; // [neighborId]
  turn: number;
  spouseName: string;
  dynastyId: string;
  turnsRemaining?: number | null;
}

export function createMarriageBond(args: CreateMarriageBondArgs): MarriageBond {
  return {
    bondId: bondIdFor('royal_marriage', args.participants, args.turn),
    kind: 'royal_marriage',
    turnStarted: args.turn,
    turnsRemaining: args.turnsRemaining ?? null,
    participants: args.participants,
    breachPenalty: -20,
    spouseName: args.spouseName,
    dynastyId: args.dynastyId,
    heirProduced: false,
  };
}

export interface CreateHostageBondArgs {
  participants: string[];
  turn: number;
  hostageName: string;
  mutual: boolean;
  turnsRemaining?: number | null;
}

export function createHostageBond(args: CreateHostageBondArgs): HostageBond {
  return {
    bondId: bondIdFor('hostage_exchange', args.participants, args.turn),
    kind: 'hostage_exchange',
    turnStarted: args.turn,
    turnsRemaining: args.turnsRemaining ?? null,
    participants: args.participants,
    breachPenalty: -25,
    hostageName: args.hostageName,
    mutual: args.mutual,
  };
}

export interface CreateVassalageBondArgs {
  participants: string[];
  turn: number;
  overlord: string;
  tributePerTurn: number;
  turnsRemaining?: number | null;
}

export function createVassalageBond(args: CreateVassalageBondArgs): VassalageBond {
  return {
    bondId: bondIdFor('vassalage', args.participants, args.turn),
    kind: 'vassalage',
    turnStarted: args.turn,
    turnsRemaining: args.turnsRemaining ?? null,
    participants: args.participants,
    breachPenalty: -30,
    overlord: args.overlord,
    tributePerTurn: args.tributePerTurn,
  };
}

export function createMutualDefenseBond(
  participants: string[],
  turn: number,
  turnsRemaining: number | null = null,
): MutualDefenseBond {
  return {
    bondId: bondIdFor('mutual_defense', participants, turn),
    kind: 'mutual_defense',
    turnStarted: turn,
    turnsRemaining,
    participants,
    breachPenalty: -22,
  };
}

export function createCoalitionBond(
  participants: string[],
  turn: number,
  commonEnemyId: string,
  turnsRemaining: number | null = 24,
): CoalitionBond {
  return {
    bondId: bondIdFor('coalition', participants, turn),
    kind: 'coalition',
    turnStarted: turn,
    turnsRemaining,
    participants,
    breachPenalty: -15,
    commonEnemyId,
  };
}

export function createTradeLeagueBond(
  participants: string[],
  turn: number,
  incomePerTurn: number,
  turnsRemaining: number | null = 20,
): TradeLeagueBond {
  return {
    bondId: bondIdFor('trade_league', participants, turn),
    kind: 'trade_league',
    turnStarted: turn,
    turnsRemaining,
    participants,
    breachPenalty: -10,
    incomePerTurn,
  };
}

export function createReligiousAccordBond(
  participants: string[],
  turn: number,
  sharedFaithId: string,
  turnsRemaining: number | null = null,
): ReligiousAccordBond {
  return {
    bondId: bondIdFor('religious_accord', participants, turn),
    kind: 'religious_accord',
    turnStarted: turn,
    turnsRemaining,
    participants,
    breachPenalty: -12,
    sharedFaithId,
  };
}

export function createCulturalExchangeBond(
  participants: string[],
  turn: number,
  turnsRemaining: number | null = null,
): CulturalExchangeBond {
  return {
    bondId: bondIdFor('cultural_exchange', participants, turn),
    kind: 'cultural_exchange',
    turnStarted: turn,
    turnsRemaining,
    participants,
    breachPenalty: -8,
  };
}

// --- Expiry ---

export function tickBondExpiry(
  bonds: Bond[] | undefined,
): { bonds: Bond[]; expired: Bond[] } {
  if (!bonds || bonds.length === 0) return { bonds: [], expired: [] };

  const remaining: Bond[] = [];
  const expired: Bond[] = [];
  for (const bond of bonds) {
    if (bond.turnsRemaining === null) {
      remaining.push(bond);
      continue;
    }
    const next = bond.turnsRemaining - 1;
    if (next <= 0) {
      expired.push(bond);
    } else {
      remaining.push({ ...bond, turnsRemaining: next });
    }
  }
  return { bonds: remaining, expired };
}

// --- Breaking ---

/** Applies a bond's breach penalty to every non-player participant's relationship
 *  score and records a memory entry describing the breach. Removes the bond. */
export function breakBond(bondId: string, reason: string, state: GameState): GameState {
  const bonds = state.diplomacy.bonds ?? [];
  const target = bonds.find((b) => b.bondId === bondId);
  if (!target) return state;

  const remaining = bonds.filter((b) => b.bondId !== bondId);
  const turn = state.turn.turnNumber;

  const neighbors: NeighborState[] = state.diplomacy.neighbors.map((n) => {
    if (!target.participants.includes(n.id)) return n;
    const nextScore = Math.max(0, Math.min(100, n.relationshipScore + target.breachPenalty));
    const memoryEntry: RivalMemoryEntry = {
      turnRecorded: turn,
      type: 'breach',
      source: `bond_breach:${target.kind}:${reason}`,
      weight: 1,
      context: `Bond ${target.kind} broken (${reason})`,
    };
    return {
      ...n,
      relationshipScore: nextScore,
      memory: recordMemory(n.memory, memoryEntry),
    };
  });

  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      neighbors,
      bonds: remaining,
    },
  };
}

// --- Counter-proposal evaluation ---

export interface CounterProposalInput {
  /** Original numeric term value (baseline the card offered). */
  baseline: number;
  /** Player's adjusted value (what the counter asks for). */
  adjusted: number;
  /** Direction that favors the player when greater. */
  playerFavors: 'higher' | 'lower';
  /** Target neighbor's current relationshipScore, 0..100. */
  relationshipScore: number;
}

/** Pure, deterministic given its RNG. Returns a 0..1 probability the neighbor
 *  accepts the player's counter. The further the adjusted value pushes in the
 *  player's favor, the lower the acceptance odds; high relationship buys
 *  tolerance. */
export function evaluateCounterProposalAcceptance(input: CounterProposalInput): number {
  const { baseline, adjusted, playerFavors, relationshipScore } = input;
  if (baseline === 0 && adjusted === 0) return 1;

  const scale = Math.abs(baseline) > 0 ? Math.abs(baseline) : 1;
  const rawShift = playerFavors === 'higher' ? adjusted - baseline : baseline - adjusted;
  const normalized = rawShift / scale; // positive = player-favorable counter

  const relationshipBonus = (relationshipScore - 50) / 100; // -0.5..+0.5
  const base = 0.5 - normalized * 0.6 + relationshipBonus * 0.4;
  return clamp(base, 0.02, 0.98);
}

// --- Tick dispatcher ---

/** Single dispatch site the turn loop calls once per turn, after the existing
 *  tickDiplomaticAgreements call. Applies each bond's ongoing effect. */
export function applyBondTickEffects(state: GameState): GameState {
  const bonds = state.diplomacy.bonds ?? [];
  if (bonds.length === 0) return state;

  let next = state;
  for (const bond of bonds) {
    next = applyBondEffect(next, bond);
  }
  return next;
}

function applyBondEffect(state: GameState, bond: Bond): GameState {
  // Per-kind effect bodies filled in pass 2.
  switch (bond.kind) {
    case 'royal_marriage':
      return tickMarriage(state, bond);
    case 'hostage_exchange':
      return tickHostage(state, bond);
    case 'vassalage':
      return tickVassalage(state, bond);
    case 'mutual_defense':
      return tickMutualDefense(state, bond);
    case 'coalition':
      return tickCoalition(state, bond);
    case 'trade_league':
      return tickTradeLeague(state, bond);
    case 'religious_accord':
      return tickReligiousAccord(state);
    case 'cultural_exchange':
      return tickCulturalExchange(state, bond);
  }
}

// --- Per-kind tick bodies ---

/** Royal marriage: slow positive relationship drift + small stability drip. */
function tickMarriage(state: GameState, bond: MarriageBond): GameState {
  let neighbors = state.diplomacy.neighbors;
  for (const pid of bond.participants) {
    neighbors = nudgeRelationship(neighbors, pid, 1);
  }
  return {
    ...state,
    diplomacy: { ...state.diplomacy, neighbors },
    stability: {
      ...state.stability,
      value: clamp(state.stability.value + 0.2, 0, 100),
    },
  };
}

/** Hostage exchange: enforces a relationship floor across participants,
 *  preventing organic drift from sinking below HOSTAGE_FLOOR. */
function tickHostage(state: GameState, bond: HostageBond): GameState {
  const neighbors = state.diplomacy.neighbors.map((n) => {
    if (!bond.participants.includes(n.id)) return n;
    if (n.relationshipScore >= HOSTAGE_FLOOR) return n;
    return { ...n, relationshipScore: HOSTAGE_FLOOR };
  });
  return {
    ...state,
    diplomacy: { ...state.diplomacy, neighbors },
  };
}

/** Vassalage: overlord receives tribute; vassal's expansionist pressure dampens. */
function tickVassalage(state: GameState, bond: VassalageBond): GameState {
  const playerIsOverlord = bond.overlord === 'player';
  const tributeDelta = playerIsOverlord ? bond.tributePerTurn : -bond.tributePerTurn;

  const neighbors = state.diplomacy.neighbors.map((n) => {
    if (!bond.participants.includes(n.id) || n.id === bond.overlord) return n;
    if (!n.kingdomSimulation) return n;
    return {
      ...n,
      kingdomSimulation: {
        ...n.kingdomSimulation,
        expansionistPressure: n.kingdomSimulation.expansionistPressure * 0.85,
      },
    };
  });

  return {
    ...state,
    diplomacy: { ...state.diplomacy, neighbors },
    treasury: {
      ...state.treasury,
      balance: state.treasury.balance + tributeDelta,
    },
  };
}

/** Mutual defense: when a partner is at war with the player or vice versa,
 *  accumulate war weariness on the player side for being dragged in. */
function tickMutualDefense(state: GameState, bond: MutualDefenseBond): GameState {
  const partnerAtWar = state.diplomacy.neighbors.some(
    (n) => bond.participants.includes(n.id) && n.isAtWarWithPlayer,
  );
  if (!partnerAtWar) return state;

  const neighbors = state.diplomacy.neighbors.map((n) => {
    if (!bond.participants.includes(n.id)) return n;
    return { ...n, warWeariness: clamp(n.warWeariness + 1, 0, 100) };
  });
  return { ...state, diplomacy: { ...state.diplomacy, neighbors } };
}

/** Coalition: every participant's stance toward commonEnemyId sours a bit. */
function tickCoalition(state: GameState, bond: CoalitionBond): GameState {
  let neighbors = state.diplomacy.neighbors;
  if (bond.commonEnemyId && bond.commonEnemyId !== 'player') {
    neighbors = nudgeRelationship(neighbors, bond.commonEnemyId, -1);
  }
  return { ...state, diplomacy: { ...state.diplomacy, neighbors } };
}

/** Trade league: treasury income per participant that shares an open edge. */
function tickTradeLeague(state: GameState, bond: TradeLeagueBond): GameState {
  if (bond.participants.length === 0) return state;

  let eligible = 0;
  for (const pid of bond.participants) {
    // If geography exists, require an edge from the player (any region adjacent
    // to the participant counts). When geography is missing (legacy save),
    // treat the league as always active rather than silently earning nothing.
    if (!state.geography) {
      eligible += 1;
      continue;
    }
    const anyAdjacent = state.regions.some((r) => areAdjacent(r.id, pid, state));
    if (anyAdjacent) eligible += 1;
  }
  if (eligible === 0) return state;

  return {
    ...state,
    treasury: {
      ...state.treasury,
      balance: state.treasury.balance + bond.incomePerTurn * eligible,
    },
  };
}

/** Religious accord: reduces heterodoxy across signatories. */
function tickReligiousAccord(state: GameState): GameState {
  const nextHeterodoxy = clamp(state.faithCulture.heterodoxy - 0.5, 0, 100);
  if (nextHeterodoxy === state.faithCulture.heterodoxy) return state;
  return {
    ...state,
    faithCulture: { ...state.faithCulture, heterodoxy: nextHeterodoxy },
  };
}

/** Cultural exchange: slow +cohesion and +relationship drift with partners. */
function tickCulturalExchange(state: GameState, bond: CulturalExchangeBond): GameState {
  let neighbors = state.diplomacy.neighbors;
  for (const pid of bond.participants) {
    neighbors = nudgeRelationship(neighbors, pid, 1);
  }
  return {
    ...state,
    diplomacy: { ...state.diplomacy, neighbors },
    faithCulture: {
      ...state.faithCulture,
      culturalCohesion: clamp(state.faithCulture.culturalCohesion + 0.3, 0, 100),
    },
  };
}
