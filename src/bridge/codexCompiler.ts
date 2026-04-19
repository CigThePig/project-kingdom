// Bridge Layer — Codex State Compiler
// Reads GameState and produces qualitative tier assessments for each domain.
// Pure function: state in, CodexDomain[] out.

import { QualitativeTier, RegionalPosture } from '../engine/types';
import type {
  Bond,
  GameState,
  InterRivalAgreement,
  NarrativePressure,
  RegionState,
  TreasuryExpenseBreakdown,
} from '../engine/types';
import type {
  AgentRosterEntry,
  BondCodexEntry,
  CodexDomain,
  InterRivalDigest,
  InterRivalDigestEntry,
  RegionSummary,
} from '../ui/types';
import {
  CODEX_NARRATIVES,
  POSTURE_NARRATIVE,
  REGION_DEVELOPMENT_NARRATIVE,
  REGION_LOYALTY_NARRATIVE,
} from '../data/text/codex-narratives';
import { getDominantAxis, getSecondHighestAxis } from '../engine/systems/narrative-pressure';
import { NARRATIVE_AXIS_DEFINITIONS } from '../data/narrative-pressure/axis-definitions';
import { INITIATIVE_DEFINITIONS } from '../data/initiatives';
import {
  POSTURE_LABEL,
  POSTURE_SHORT_EFFECT,
  isPostureStale,
} from '../engine/systems/regional-posture';
import { getNeighborDisplayName, getRegionDisplayName } from './nameResolver';
import {
  getAgentCoverSettlementLabel,
} from './agentNameResolver';
import { describeBond, getBondParticipantNames } from './bondNameResolver';
import { getIntelLevel } from './dossierCompiler';
import {
  AGENT_SPECIALIZATION_LABELS,
  BOND_KIND_LABELS,
  INTELLIGENCE_OP_LABELS,
} from '../data/text/labels';

// ============================================================
// Domain definitions
// ============================================================

const DOMAIN_TITLES: Record<string, string> = {
  realm: 'The Realm',
  stores: 'Stores & Provisions',
  treasury: 'Treasury & Revenue',
  infrastructure: 'Infrastructure',
  armies: 'The Armies',
  faith: 'Faith & Culture',
  pressures: 'Kingdom Pressures',
  // Phase 10 — present only when an initiative is committed.
  initiative: 'Long-Term Initiative',
};

// ============================================================
// Tier assignment helpers
// ============================================================

/** Standard 5-tier thresholds for a 0–100 score. */
function assignStandardTier(score: number): QualitativeTier {
  if (score <= 15) return QualitativeTier.Dire;
  if (score <= 35) return QualitativeTier.Troubled;
  if (score <= 55) return QualitativeTier.Stable;
  if (score <= 75) return QualitativeTier.Prosperous;
  return QualitativeTier.Flourishing;
}

/** Realm uses narrower thresholds because stability max is effectively ~80. */
function assignRealmTier(stability: number): QualitativeTier {
  if (stability <= 12) return QualitativeTier.Dire;
  if (stability <= 28) return QualitativeTier.Troubled;
  if (stability <= 52) return QualitativeTier.Stable;
  if (stability <= 68) return QualitativeTier.Prosperous;
  return QualitativeTier.Flourishing;
}

/** Stores tier based on months-of-supply ratio. */
function assignStoresTier(reserves: number, consumptionPerTurn: number): QualitativeTier {
  const consumption = Math.max(1, consumptionPerTurn);
  const monthsOfSupply = reserves / consumption;
  if (monthsOfSupply < 1) return QualitativeTier.Dire;
  if (monthsOfSupply < 2) return QualitativeTier.Troubled;
  if (monthsOfSupply <= 5) return QualitativeTier.Stable;
  if (monthsOfSupply <= 9) return QualitativeTier.Prosperous;
  return QualitativeTier.Flourishing;
}

/** Treasury tier uses ratio of balance to monthly expenses + net flow direction. */
function assignTreasuryTier(
  balance: number,
  netFlow: number,
  expenses: TreasuryExpenseBreakdown,
): QualitativeTier {
  const totalMonthlyExpenses =
    expenses.militaryUpkeep +
    expenses.constructionCosts +
    expenses.intelligenceFunding +
    expenses.religiousUpkeep +
    expenses.festivalCosts;

  const monthsOfRunway = totalMonthlyExpenses > 0
    ? balance / totalMonthlyExpenses
    : balance > 0 ? Infinity : 0;

  if (monthsOfRunway < 0 && netFlow < 0) return QualitativeTier.Dire;
  if (monthsOfRunway < 2 && netFlow < 0) return QualitativeTier.Troubled;
  if (monthsOfRunway > 9 && netFlow > 0) return QualitativeTier.Flourishing;
  if (monthsOfRunway > 5 && netFlow > 0) return QualitativeTier.Prosperous;
  return QualitativeTier.Stable;
}

// ============================================================
// Narrative lookup
// ============================================================

function lookupNarrative(domainId: string, tier: QualitativeTier, turnNumber: number): string {
  const domainNarratives = CODEX_NARRATIVES[domainId];
  if (!domainNarratives) return '';
  const variants = domainNarratives[tier];
  if (!variants) return '';
  return variants[turnNumber % 3];
}

// ============================================================
// Main compiler
// ============================================================

export function compileKingdomState(state: GameState): CodexDomain[] {
  const { stability, food, treasury, regions, military, faithCulture, turn } = state;

  // Infrastructure: average development across all regions
  const avgDevelopment =
    regions.length > 0
      ? regions.reduce((sum, r) => sum + r.developmentLevel, 0) / regions.length
      : 0;

  // Armies: composite score
  const armiesScore =
    military.readiness * 0.4 + military.morale * 0.3 + military.equipmentCondition * 0.3;

  // Faith: composite score
  const faithScore =
    faithCulture.faithLevel * 0.5 +
    faithCulture.culturalCohesion * 0.3 +
    (100 - faithCulture.heterodoxy) * 0.2;

  const domains: { id: string; tier: QualitativeTier }[] = [
    { id: 'realm', tier: assignRealmTier(stability.value) },
    { id: 'stores', tier: assignStoresTier(food.reserves, food.consumptionPerTurn) },
    { id: 'treasury', tier: assignTreasuryTier(treasury.balance, treasury.netFlowPerTurn, treasury.expenses) },
    { id: 'infrastructure', tier: assignStandardTier(avgDevelopment) },
    { id: 'armies', tier: assignStandardTier(armiesScore) },
    { id: 'faith', tier: assignStandardTier(faithScore) },
  ];

  // Build the "Kingdom Pressures" domain from active conditions and causal chains.
  const pressuresNarrative = buildPressuresNarrative(state);
  if (pressuresNarrative) {
    const conditionCount = state.environment?.activeConditions.length ?? 0;
    const pressureTier = conditionCount >= 3 ? QualitativeTier.Dire
      : conditionCount >= 2 ? QualitativeTier.Troubled
      : conditionCount >= 1 ? QualitativeTier.Stable
      : QualitativeTier.Flourishing;
    domains.push({ id: 'pressures', tier: pressureTier });
  }

  // Phase 10 — initiative domain surfaces only when one is active.
  const initiativeNarrative = buildInitiativeNarrative(state);
  if (initiativeNarrative) {
    const active = state.activeInitiative!;
    const progress = active.progressValue;
    const initiativeTier =
      progress >= 80 ? QualitativeTier.Flourishing
        : progress >= 50 ? QualitativeTier.Prosperous
        : progress >= 25 ? QualitativeTier.Stable
        : QualitativeTier.Troubled;
    domains.push({ id: 'initiative', tier: initiativeTier });
  }

  return domains.map(({ id, tier }) => ({
    id,
    title: DOMAIN_TITLES[id],
    tier,
    narrative: id === 'pressures' && pressuresNarrative
      ? pressuresNarrative
      : id === 'initiative' && initiativeNarrative
      ? initiativeNarrative
      : lookupNarrative(id, tier, turn.turnNumber),
  }));
}

/** Phase 10 — one-line initiative summary for the Kingdom codex. Returns
 *  null when no initiative is active. */
function buildInitiativeNarrative(state: GameState): string | null {
  const active = state.activeInitiative;
  if (!active) return null;
  const def = INITIATIVE_DEFINITIONS[active.definitionId];
  const title = def?.title ?? active.definitionId;
  const progress = Math.round(active.progressValue);
  const turnsLine = `Turn ${active.turnsActive} of ~${active.turnsRequired}`;
  const description = def ? ` ${def.description}` : '';
  return `${title} — ${progress}% complete (${turnsLine}).${description}`;
}

function buildPressuresNarrative(state: GameState): string | null {
  const parts: string[] = [];

  // Active conditions
  if (state.environment && state.environment.activeConditions.length > 0) {
    const conditionNames = state.environment.activeConditions.map(
      (c) => `${c.type} (${c.severity})`,
    );
    parts.push(`Active conditions: ${conditionNames.join(', ')}.`);
  }

  // Top causal chains by magnitude
  if (state.causalLedger && state.causalLedger.recentChains.length > 0) {
    const topChains = [...state.causalLedger.recentChains]
      .sort((a, b) => b.totalMagnitude - a.totalMagnitude)
      .slice(0, 3);
    for (const chain of topChains) {
      parts.push(
        `${chain.rootCause.description} \u2192 ${chain.finalEffect.description} (magnitude ${Math.round(chain.totalMagnitude)})`,
      );
    }
  }

  return parts.length > 0 ? parts.join(' ') : null;
}

// ============================================================
// Narrative Pulse — qualitative reading of dominant pressures
// ============================================================

function generatePulseDescription(
  dominant: { axis: keyof NarrativePressure; value: number },
  secondary: { axis: keyof NarrativePressure; value: number },
): string {
  const dominantDef = NARRATIVE_AXIS_DEFINITIONS[dominant.axis];
  if (dominant.value === 0) {
    return 'The kingdom drifts without a clear direction. Your decisions have yet to define the character of your reign.';
  }
  if (secondary.value > dominant.value * 0.6) {
    const secondaryDef = NARRATIVE_AXIS_DEFINITIONS[secondary.axis];
    return `${dominantDef.codexDescription} Meanwhile, ${secondaryDef.theme.toLowerCase()} also shapes the realm's trajectory.`;
  }
  return dominantDef.codexDescription;
}

// ============================================================
// Region summaries (Phase 9)
// ============================================================

function primaryOutputLabel(r: RegionState): string {
  const out = r.primaryEconomicOutput;
  if (out === 'Food') return 'Food';
  if (out === 'Trade') return 'Trade';
  return String(out);
}

function regionActivityLine(region: RegionState): string {
  const conds = region.localConditions ?? [];
  if (conds.length === 0) return 'Quiet season.';
  const lead = conds[0];
  return `${lead.type} (${lead.severity}).`;
}

export function compileRegionSummaries(state: GameState): RegionSummary[] {
  const currentTurn = state.turn.turnNumber;
  return state.regions.map((region) => {
    const posture = region.posture ?? RegionalPosture.Autonomy;
    const loyaltyValue = region.loyalty ?? 60;
    const developmentValue = region.developmentLevel;
    const loyaltyTier = assignStandardTier(loyaltyValue);
    const developmentTier = assignStandardTier(developmentValue);
    const turnsSincePostureChange = Math.max(0, currentTurn - (region.postureSetOnTurn ?? 0));
    return {
      id: region.id,
      displayName: getRegionDisplayName(region.id, state),
      terrain: region.terrainType ?? '',
      posture,
      postureLabel: POSTURE_LABEL[posture],
      postureEffect: POSTURE_SHORT_EFFECT[posture],
      postureNarrative: POSTURE_NARRATIVE[posture],
      loyaltyTier,
      loyaltyValue,
      loyaltyNarrative: REGION_LOYALTY_NARRATIVE[loyaltyTier],
      developmentTier,
      developmentValue,
      developmentNarrative: REGION_DEVELOPMENT_NARRATIVE[developmentTier],
      activityLine: regionActivityLine(region),
      isOccupied: region.isOccupied,
      turnsSincePostureChange,
      isStale: isPostureStale(region, currentTurn),
      primaryOutput: primaryOutputLabel(region),
      isBorder: region.borderRegion ?? false,
    };
  });
}

/**
 * Compiles a qualitative "Narrative Pulse" reading for the Codex.
 * Shows the story the player's decisions imply without exposing mechanical axes or numbers.
 */
export function compileNarrativePulse(
  pressure: NarrativePressure,
): { headline: string; description: string } {
  const dominant = getDominantAxis(pressure);
  const secondary = getSecondHighestAxis(pressure);

  if (dominant.value === 0) {
    return {
      headline: 'A Kingdom Awaits',
      description: 'The kingdom drifts without a clear direction. Your decisions have yet to define the character of your reign.',
    };
  }

  const dominantDef = NARRATIVE_AXIS_DEFINITIONS[dominant.axis];

  return {
    headline: dominantDef.codexHeadline,
    description: generatePulseDescription(dominant, secondary),
  };
}

// ============================================================
// Phase F — Intelligence Roster (§10)
// ============================================================

/** Burn risk is inverted relative to the standard 0–100 tiers: high = bad. */
function assignInvertedTier(score: number): QualitativeTier {
  if (score >= 85) return QualitativeTier.Dire;
  if (score >= 65) return QualitativeTier.Troubled;
  if (score >= 45) return QualitativeTier.Stable;
  if (score >= 25) return QualitativeTier.Prosperous;
  return QualitativeTier.Flourishing;
}

const OPERATION_STAGE_LABELS = ['Scouting', 'Developing', 'Closing In', 'Reporting'];

function operationStageLabel(turnsElapsed: number, turnsTotal: number): string {
  if (turnsTotal <= 0) return 'Ongoing';
  const ratio = Math.max(0, Math.min(1, turnsElapsed / turnsTotal));
  const idx = Math.min(
    OPERATION_STAGE_LABELS.length - 1,
    Math.floor(ratio * OPERATION_STAGE_LABELS.length),
  );
  return OPERATION_STAGE_LABELS[idx];
}

/**
 * Compiles the Intelligence Roster Codex entries — one per active agent.
 * Returns [] when the espionage roster is empty or not yet seeded.
 */
export function compileAgentRoster(state: GameState): AgentRosterEntry[] {
  const agents = state.espionage?.agents ?? [];
  if (agents.length === 0) return [];
  const operations = state.espionage?.ongoingOperations ?? [];
  const currentTurn = state.turn.turnNumber;

  return agents.map((agent) => {
    const ops = operations
      .filter((op) => op.agentId === agent.id && op.status === 'running')
      .map((op) => ({
        label: INTELLIGENCE_OP_LABELS[op.operationType] ?? String(op.operationType),
        stageLabel: operationStageLabel(op.turnsElapsed, op.turnsTotal),
      }));

    return {
      id: agent.id,
      codename: agent.codename,
      specialization: agent.specialization,
      specializationLabel:
        AGENT_SPECIALIZATION_LABELS[agent.specialization] ?? String(agent.specialization),
      coverSettlementLabel: getAgentCoverSettlementLabel(agent.id, state),
      status: agent.status,
      reliabilityTier: assignStandardTier(agent.reliability),
      reliabilityValue: agent.reliability,
      burnRiskTier: assignInvertedTier(agent.burnRisk),
      burnRiskValue: agent.burnRisk,
      turnsActive: Math.max(0, currentTurn - agent.recruitedTurn),
      ongoingOperations: ops,
    };
  });
}

// ============================================================
// Phase F — Bonds (§10)
// ============================================================

function turnsRemainingLabel(bond: Bond): string {
  if (bond.turnsRemaining === null || bond.turnsRemaining === undefined) {
    return 'Indefinite';
  }
  if (bond.turnsRemaining <= 0) return 'Expiring this season';
  if (bond.turnsRemaining === 1) return '1 season remaining';
  return `${bond.turnsRemaining} seasons remaining`;
}

// Sort priority: marriage & vassalage first (they shape long-term play),
// then indefinite bonds, then oldest to youngest so the player sees the
// earliest commitments at the top.
const BOND_KIND_ORDER: Record<Bond['kind'], number> = {
  royal_marriage: 0,
  vassalage: 1,
  hostage_exchange: 2,
  mutual_defense: 3,
  coalition: 4,
  trade_league: 5,
  religious_accord: 6,
  cultural_exchange: 7,
};

/**
 * Compiles the Codex "Bonds" entries — one per active diplomatic bond.
 * Returns [] when `state.diplomacy.bonds` is empty or not yet seeded.
 */
export function compileBonds(state: GameState): BondCodexEntry[] {
  const bonds = state.diplomacy.bonds ?? [];
  if (bonds.length === 0) return [];
  const currentTurn = state.turn.turnNumber;

  const sorted = [...bonds].sort((a, b) => {
    const kindDelta = (BOND_KIND_ORDER[a.kind] ?? 99) - (BOND_KIND_ORDER[b.kind] ?? 99);
    if (kindDelta !== 0) return kindDelta;
    const aIndefinite = a.turnsRemaining === null ? 0 : 1;
    const bIndefinite = b.turnsRemaining === null ? 0 : 1;
    if (aIndefinite !== bIndefinite) return aIndefinite - bIndefinite;
    return a.turnStarted - b.turnStarted;
  });

  return sorted.map((bond) => {
    const entry: BondCodexEntry = {
      bondId: bond.bondId,
      kind: bond.kind,
      kindLabel: BOND_KIND_LABELS[bond.kind] ?? String(bond.kind),
      descriptor: describeBond(bond, state),
      participantNames: getBondParticipantNames(bond, state),
      ageInTurns: Math.max(0, currentTurn - bond.turnStarted),
      turnsRemainingLabel: turnsRemainingLabel(bond),
      breachPenalty: bond.breachPenalty,
    };
    switch (bond.kind) {
      case 'royal_marriage':
        entry.heirProduced = bond.heirProduced;
        break;
      case 'vassalage':
        entry.tributePerTurn = bond.tributePerTurn;
        break;
      case 'trade_league':
        entry.incomePerTurn = bond.incomePerTurn;
        break;
      case 'hostage_exchange':
        entry.hostageName = bond.hostageName;
        break;
      case 'coalition':
        entry.commonEnemyName = getNeighborDisplayName(bond.commonEnemyId, state);
        break;
    }
    return entry;
  });
}

// ============================================================
// Phase F — Inter-Rival Situation (§10)
// ============================================================

const INTER_RIVAL_KIND_LABELS: Record<InterRivalAgreement['kind'], string> = {
  alliance: 'Alliance',
  trade_pact: 'Trade Pact',
  war: 'War',
};

const INTEL_TIER_RANK = {
  none: 0,
  minimal: 1,
  moderate: 2,
  strong: 3,
  exceptional: 4,
} as const;

/**
 * Compiles a qualitative digest of inter-rival agreements. Gated by the
 * player's intelligence-network tier (§10: "gated by intel tier").
 *
 *   - none / minimal → no entries; emptyLine describes the blind spot.
 *   - moderate+       → all agreements surface.
 *   - strong+         → shared targets (alliance "against X") surface.
 */
export function compileInterRivalDigest(state: GameState): InterRivalDigest {
  const intelLevel = getIntelLevel(state.espionage?.networkStrength ?? 0);
  const agreements = state.diplomacy.interRivalAgreements ?? [];

  if (INTEL_TIER_RANK[intelLevel] < INTEL_TIER_RANK.moderate) {
    return {
      intelLevel,
      entries: [],
      emptyLine:
        'Your network is too thin to read the currents between foreign courts. Invest in espionage to see who allies, trades, or wars with whom.',
    };
  }

  if (agreements.length === 0) {
    return {
      intelLevel,
      entries: [],
      emptyLine: 'No alliances, trade pacts, or wars between your neighbors are known at court.',
    };
  }

  const currentTurn = state.turn.turnNumber;
  const canSeeSharedTargets = INTEL_TIER_RANK[intelLevel] >= INTEL_TIER_RANK.strong;

  const entries: InterRivalDigestEntry[] = agreements
    .slice()
    .sort((a, b) => b.turnStarted - a.turnStarted)
    .map((ag) => {
      const entry: InterRivalDigestEntry = {
        id: ag.id,
        kind: ag.kind,
        kindLabel: INTER_RIVAL_KIND_LABELS[ag.kind],
        participantAName: getNeighborDisplayName(ag.a, state),
        participantBName: getNeighborDisplayName(ag.b, state),
        turnsActive: Math.max(0, currentTurn - ag.turnStarted),
      };
      if (canSeeSharedTargets && ag.sharedTargetId) {
        entry.sharedTargetName =
          ag.sharedTargetId === 'player'
            ? 'your realm'
            : getNeighborDisplayName(ag.sharedTargetId, state);
      }
      return entry;
    });

  return { intelLevel, entries };
}
