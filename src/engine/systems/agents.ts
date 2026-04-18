// Phase 14 — Intelligence Network Depth (pure engine)
//
// Named agents, multi-turn ongoing operations, and mole lifecycle. All
// functions are pure: callers thread RNG, and returned state is new. No
// React, no I/O.
//
// Design anchors (docs/CROWN_AND_COUNCIL_EXPANSION.md §Phase 14):
//  - Up to 6 named agents with a settlement_* cover location. Agents covered
//    in border-region settlements receive a detection-risk multiplier.
//  - Long-term ops replace single-shot ops; single-shot is the degenerate
//    `turnsTotal = 1` case and still flows through `resolveOperation`.
//  - Rival kingdoms may plant moles in EMPTY council seats; counter-espionage
//    grows detection progress; petition surfaces expose / feed-false-intel.

import {
  Agent,
  AgentSpecialization,
  AgentStatus,
  CouncilSeat,
  CouncilState,
  EspionageState,
  GameState,
  IntelligenceOperationType,
  IntelligenceReport,
  Mole,
  NeighborState,
  OngoingOperation,
} from '../types';
import { deriveBorderRegionFlag } from './geography';
import { generateAgentCodename } from '../../data/text/name-generation';

// ============================================================
// Constants
// ============================================================

export const DEFAULT_AGENT_ROSTER_CAP = 6;
export const BURN_RISK_EXTRACTION_THRESHOLD = 70;
export const MOLE_DETECTION_EXPOSE_THRESHOLD = 70;
export const BORDER_DETECTION_MULTIPLIER = 1.25;
export const DEFAULT_ONGOING_OP_TURNS = 4;

// Per-op burn-risk deltas applied to the resolving agent.
export const BURN_RISK_ON_SUCCESS = 8;
export const BURN_RISK_ON_FAILURE = 15;
export const BURN_RISK_ON_EXPOSED_FAILURE = 30;
export const BURN_RISK_ON_OP_START = 5;
export const BURN_RISK_IDLE_DECAY = 3;

// Rival mole planting gates.
export const RIVAL_MOLE_CAPABILITY_MIN = 60;
export const RIVAL_MOLE_PLANT_PROBABILITY = 0.02;

// ============================================================
// Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Stage vocabulary for ongoing-op findings. Four stages = four codes. */
const ONGOING_STAGE_CODES = [
  'ongoing_leak',
  'ongoing_rumor',
  'ongoing_named_actor',
  'ongoing_decision',
] as const;

// ============================================================
// Construction
// ============================================================

export function createAgent(params: {
  runSeed: string;
  turn: number;
  index: number;
  specialization: AgentSpecialization;
  coverSettlementId: string;
  reliability?: number;
}): Agent {
  const seed = `${params.runSeed}:agent:${params.turn}:${params.index}`;
  return {
    id: `agent_${params.runSeed}_t${params.turn}_${params.index}`,
    codename: generateAgentCodename(seed),
    specialization: params.specialization,
    coverSettlementId: params.coverSettlementId,
    reliability: clamp(params.reliability ?? 50, 0, 100),
    burnRisk: 0,
    status: AgentStatus.Active,
    recruitedTurn: params.turn,
  };
}

export function addAgentToRoster(esp: EspionageState, agent: Agent): EspionageState {
  const agents = [...(esp.agents ?? []), agent];
  return { ...esp, agents };
}

export function canRecruitAgent(esp: EspionageState): boolean {
  const cap = esp.agentRosterCap ?? DEFAULT_AGENT_ROSTER_CAP;
  const active = (esp.agents ?? []).filter(
    (a) => a.status === AgentStatus.Active,
  ).length;
  return active < cap;
}

// ============================================================
// Detection Risk
// ============================================================

/**
 * Multiplier applied to exposure rolls for this agent. Border-region cover
 * inflates detection risk by BORDER_DETECTION_MULTIPLIER. Returns 1 when the
 * cover settlement lives in a non-border region (or when geography is absent,
 * e.g. pre-Phase-2.5 saves mid-migration).
 */
export function computeAgentDetectionRiskModifier(
  agent: Agent,
  state: GameState,
): number {
  const settlement = state.geography?.settlements?.find(
    (s) => s.id === agent.coverSettlementId,
  );
  if (!settlement || !state.geography) return 1;
  const inBorder = deriveBorderRegionFlag(settlement.regionId, state.geography);
  return inBorder ? BORDER_DETECTION_MULTIPLIER : 1;
}

// ============================================================
// Roster Tick (per-turn)
// ============================================================

/**
 * Advances every Active agent: burn-risk decays when idle, rolls for status
 * transitions when burnRisk is high. Border cover amplifies the exposure roll.
 * Pure: returns a new EspionageState.
 */
export function tickAgentRoster(
  esp: EspionageState,
  state: GameState,
  rng: () => number,
): EspionageState {
  const agents = esp.agents;
  if (!agents || agents.length === 0) return esp;

  const assignedAgentIds = new Set(
    (esp.ongoingOperations ?? [])
      .filter((op) => op.status === 'running' && op.agentId)
      .map((op) => op.agentId as string),
  );

  const next = agents.map((agent) => {
    if (agent.status !== AgentStatus.Active) return agent;

    // Idle agents decay burn risk; assigned agents are handled on op resolution.
    const idle = !assignedAgentIds.has(agent.id);
    const burnRisk = idle
      ? clamp(agent.burnRisk - BURN_RISK_IDLE_DECAY, 0, 100)
      : agent.burnRisk;

    // High burn risk → chance of forced transition. Border cover amplifies.
    const detectionMod = computeAgentDetectionRiskModifier(agent, state);
    const compromiseThreshold = clamp(
      (burnRisk - 60) * 0.01 * detectionMod,
      0,
      0.5,
    );
    const deathThreshold = clamp((burnRisk - 85) * 0.02 * detectionMod, 0, 0.3);

    const roll = rng();
    let status: AgentStatus = agent.status;
    if (roll < deathThreshold) status = AgentStatus.Dead;
    else if (roll < compromiseThreshold + deathThreshold) status = AgentStatus.Compromised;

    return { ...agent, burnRisk, status };
  });

  return { ...esp, agents: next };
}

// ============================================================
// Ongoing Operations
// ============================================================

export function startOngoingOperation(
  esp: EspionageState,
  op: {
    opType: IntelligenceOperationType;
    targetId: string;
    agentId: string | null;
    turn: number;
    opId: string;
    turnsTotal?: number;
  },
): EspionageState {
  const ongoing: OngoingOperation = {
    id: op.opId,
    operationType: op.opType,
    targetId: op.targetId,
    agentId: op.agentId,
    turnsElapsed: 0,
    turnsTotal: op.turnsTotal ?? DEFAULT_ONGOING_OP_TURNS,
    findings: [],
    status: 'running',
    startedTurn: op.turn,
  };
  return {
    ...esp,
    ongoingOperations: [...(esp.ongoingOperations ?? []), ongoing],
  };
}

/**
 * Advance every running op one stage. Each stage appends one finding code;
 * the final stage emits a single IntelligenceReport carrying the accumulated
 * codes (plus any rival-simulation codes for the target).
 */
export function tickOngoingOperations(
  esp: EspionageState,
  _state: GameState,
  turnRngFor: (key: string) => () => number,
  turn: number,
  neighbors: NeighborState[],
): { espionage: EspionageState; newReports: IntelligenceReport[] } {
  const ongoing = esp.ongoingOperations;
  if (!ongoing || ongoing.length === 0) {
    return { espionage: esp, newReports: [] };
  }

  const newReports: IntelligenceReport[] = [];
  const nextOngoing: OngoingOperation[] = [];

  for (const op of ongoing) {
    if (op.status !== 'running') {
      nextOngoing.push(op);
      continue;
    }

    const nextElapsed = op.turnsElapsed + 1;
    const stageIndex = Math.min(nextElapsed - 1, ONGOING_STAGE_CODES.length - 1);
    const stageCode = ONGOING_STAGE_CODES[stageIndex];
    const nextFindings = [...op.findings, stageCode];

    if (nextElapsed >= op.turnsTotal) {
      // Final stage — emit one report carrying all accreted codes.
      const target = neighbors.find((n) => n.id === op.targetId);
      const simCodes: string[] = [];
      const sim = target?.kingdomSimulation;
      if (sim) {
        if (sim.foodSecurity < 35) simCodes.push('rival_food_shortage');
        if (sim.treasuryHealth < 35) simCodes.push('rival_treasury_strain');
        if (sim.internalStability < 40) simCodes.push('rival_internal_unrest');
        if (sim.expansionistPressure >= 70 && !sim.isInCrisis)
          simCodes.push('rival_expansionist_intent');
      }
      const allCodes = [...nextFindings, ...simCodes];
      const report: IntelligenceReport = {
        id: `ongoing-${op.id}`,
        operationType: op.operationType,
        targetId: op.targetId,
        findings: allCodes.join(';'),
        confidenceLevel: 75,
        isGenuine: true,
        isCorrectionPending: false,
        turnGenerated: turn,
      };
      newReports.push(report);
      nextOngoing.push({
        ...op,
        turnsElapsed: nextElapsed,
        findings: allCodes,
        status: 'completed',
      });
    } else {
      nextOngoing.push({
        ...op,
        turnsElapsed: nextElapsed,
        findings: nextFindings,
      });
    }
    // rng is threaded per-stage for future expansion (stage-specific rolls).
    // Consume one value to keep the seeded sequence stable.
    turnRngFor(`ongoing-op:${op.id}:stage:${nextElapsed}`)();
  }

  return {
    espionage: { ...esp, ongoingOperations: nextOngoing },
    newReports,
  };
}

export function abortOngoingOperation(
  esp: EspionageState,
  opId: string,
): EspionageState {
  const ongoing = esp.ongoingOperations;
  if (!ongoing) return esp;
  return {
    ...esp,
    ongoingOperations: ongoing.map((op) =>
      op.id === opId && op.status === 'running' ? { ...op, status: 'aborted' } : op,
    ),
  };
}

// ============================================================
// Agent burn-risk / status application after an op resolves
// ============================================================

/**
 * Applies an op-resolution outcome to a specific agent in the roster.
 * Pure: no-op if the agent is not in the roster (e.g. synthetic auto-agent).
 */
export function applyAgentOpOutcome(
  esp: EspionageState,
  agentId: string | null,
  outcome: {
    burnRiskDelta: number;
    statusTransition?: AgentStatus;
  },
): EspionageState {
  if (!agentId) return esp;
  const agents = esp.agents;
  if (!agents) return esp;
  const next = agents.map((a) => {
    if (a.id !== agentId) return a;
    return {
      ...a,
      burnRisk: clamp(a.burnRisk + outcome.burnRiskDelta, 0, 100),
      status: outcome.statusTransition ?? a.status,
    };
  });
  return { ...esp, agents: next };
}

// ============================================================
// Agent extraction (petition outcomes)
// ============================================================

export function extractAgent(esp: EspionageState, agentId: string): EspionageState {
  const agents = esp.agents;
  if (!agents) return esp;
  return {
    ...esp,
    agents: agents.filter((a) => a.id !== agentId),
  };
}

// ============================================================
// Mole Lifecycle
// ============================================================

/**
 * Rival-side: attempts to plant a mole in a vacant player council seat.
 * Returns null when no empty seat exists, capability is too low, or the
 * rare roll misses. Callers are responsible for appending the returned
 * Mole to EspionageState.moles.
 */
export function planMoleFromRival(
  neighborId: string,
  neighbor: NeighborState,
  playerCouncil: CouncilState,
  turn: number,
  rng: () => number,
): Mole | null {
  if ((neighbor.espionageCapability ?? 0) < RIVAL_MOLE_CAPABILITY_MIN) return null;
  if (rng() >= RIVAL_MOLE_PLANT_PROBABILITY) return null;

  const allSeats = Object.values(CouncilSeat) as CouncilSeat[];
  const emptySeats = allSeats.filter((seat) => !playerCouncil.appointments?.[seat]);
  if (emptySeats.length === 0) return null;

  const seat = emptySeats[Math.floor(rng() * emptySeats.length)];
  const capability = neighbor.espionageCapability ?? 60;
  return {
    id: `mole_${neighborId}_t${turn}`,
    plantedByNeighborId: neighborId,
    seat,
    detectionProgress: 0,
    turnsActive: 0,
    policyDriftIntensity: clamp((capability - 50) * 0.8, 10, 80),
    isExposed: false,
    plantedTurn: turn,
  };
}

/**
 * Per-turn mole tick: grows detectionProgress proportional to the player's
 * counter-intelligence level versus the planter's capability, and
 * accumulates a `pendingMolePolicyDrift` nudge on EspionageState for the
 * policy system to consume later. Moles inhabiting seats the player has
 * since filled are instantly exposed (seat collision rule).
 */
export function tickMoleDetection(
  esp: EspionageState,
  state: GameState,
  rng: () => number,
): EspionageState {
  const moles = esp.moles;
  if (!moles || moles.length === 0) return esp;

  const counterIntel = esp.counterIntelligenceLevel;
  const appointments = state.council?.appointments ?? {};

  let driftAccum = esp.pendingMolePolicyDrift ?? 0;
  const next = moles.map((mole) => {
    if (mole.isExposed) return mole;

    // Seat collision: if the seat is now filled, the mole is exposed.
    if (appointments[mole.seat]) {
      return { ...mole, isExposed: true, detectionProgress: 100 };
    }

    const planter = state.diplomacy.neighbors.find(
      (n) => n.id === mole.plantedByNeighborId,
    );
    const planterCap = planter?.espionageCapability ?? 50;
    // Deterministic progression + small jitter from rng (consumed once per tick).
    const jitter = (rng() - 0.5) * 4;
    const step = clamp((counterIntel - planterCap) / 20 + 2 + jitter, 0, 10);
    const detectionProgress = clamp(mole.detectionProgress + step, 0, 100);
    driftAccum += mole.policyDriftIntensity * 0.02;
    return {
      ...mole,
      turnsActive: mole.turnsActive + 1,
      detectionProgress,
    };
  });

  return { ...esp, moles: next, pendingMolePolicyDrift: driftAccum };
}

/**
 * Player chooses how to handle a detected mole.
 * - 'expose' removes the mole and damages the planter's relationship.
 * - 'feed_false_intel' marks the mole exposed (player-side) but leaves it in
 *   place; callers flag the planter for next-turn misinformation and grant
 *   a small counter-intel bump.
 */
export function applyMoleExposure(
  esp: EspionageState,
  moleId: string,
  choice: 'expose' | 'feed_false_intel',
): {
  espionage: EspionageState;
  relationshipDelta: number;
  relationshipTarget: string | null;
  rivalMisinformation: boolean;
} {
  const moles = esp.moles ?? [];
  const mole = moles.find((m) => m.id === moleId);
  if (!mole) {
    return {
      espionage: esp,
      relationshipDelta: 0,
      relationshipTarget: null,
      rivalMisinformation: false,
    };
  }

  if (choice === 'expose') {
    return {
      espionage: {
        ...esp,
        moles: moles.filter((m) => m.id !== moleId),
      },
      relationshipDelta: -6,
      relationshipTarget: mole.plantedByNeighborId,
      rivalMisinformation: false,
    };
  }

  // feed_false_intel — keep mole, flag exposed so further ticks don't
  // re-surface the petition; grant small counter-intel boost.
  const nextMoles = moles.map((m) =>
    m.id === moleId ? { ...m, isExposed: true } : m,
  );
  return {
    espionage: {
      ...esp,
      moles: nextMoles,
      counterIntelligenceLevel: clamp(esp.counterIntelligenceLevel + 3, 0, 100),
    },
    relationshipDelta: 0,
    relationshipTarget: mole.plantedByNeighborId,
    rivalMisinformation: true,
  };
}

// ============================================================
// Cover-settlement selection
// ============================================================

/**
 * Picks a non-border settlement from the geography for new agent cover.
 * Falls back to any settlement when no safe option exists. Pure — caller
 * threads rng for deterministic behavior.
 */
export function pickCoverSettlement(
  state: GameState,
  rng: () => number,
): string | null {
  const settlements = state.geography?.settlements ?? [];
  if (settlements.length === 0) return null;
  const geo = state.geography;
  if (!geo) return settlements[0].id;

  const safe = settlements.filter((s) => !deriveBorderRegionFlag(s.regionId, geo));
  const pool = safe.length > 0 ? safe : settlements;
  const pick = pool[Math.floor(rng() * pool.length)];
  return pick.id;
}
