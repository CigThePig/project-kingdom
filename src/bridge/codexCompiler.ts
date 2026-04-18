// Bridge Layer — Codex State Compiler
// Reads GameState and produces qualitative tier assessments for each domain.
// Pure function: state in, CodexDomain[] out.

import { QualitativeTier, RegionalPosture } from '../engine/types';
import type { GameState, NarrativePressure, RegionState, TreasuryExpenseBreakdown } from '../engine/types';
import type { CodexDomain, RegionSummary } from '../ui/types';
import {
  CODEX_NARRATIVES,
  POSTURE_NARRATIVE,
  REGION_DEVELOPMENT_NARRATIVE,
  REGION_LOYALTY_NARRATIVE,
} from '../data/text/codex-narratives';
import { getDominantAxis, getSecondHighestAxis } from '../engine/systems/narrative-pressure';
import { NARRATIVE_AXIS_DEFINITIONS } from '../data/narrative-pressure/axis-definitions';
import {
  POSTURE_LABEL,
  POSTURE_SHORT_EFFECT,
  isPostureStale,
} from '../engine/systems/regional-posture';
import { getRegionDisplayName } from './nameResolver';

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

  return domains.map(({ id, tier }) => ({
    id,
    title: DOMAIN_TITLES[id],
    tier,
    narrative: id === 'pressures' && pressuresNarrative
      ? pressuresNarrative
      : lookupNarrative(id, tier, turn.turnNumber),
  }));
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
