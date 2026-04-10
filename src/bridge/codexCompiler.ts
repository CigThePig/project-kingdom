// Bridge Layer — Codex State Compiler
// Reads GameState and produces qualitative tier assessments for each domain.
// Pure function: state in, CodexDomain[] out.

import { QualitativeTier } from '../engine/types';
import type { GameState, TreasuryExpenseBreakdown } from '../engine/types';
import type { CodexDomain } from '../ui/types';
import { CODEX_NARRATIVES } from '../data/text/codex-narratives';

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

  return domains.map(({ id, tier }) => ({
    id,
    title: DOMAIN_TITLES[id],
    tier,
    narrative: lookupNarrative(id, tier, turn.turnNumber),
  }));
}
