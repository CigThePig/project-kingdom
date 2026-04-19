// Bridge Layer — Smart Text Substitution
//
// Central substitution function for card titles/bodies/choice labels. Replaces
// tokens like `{neighbor}`, `{ruler_full}`, `{region}`, `{season}` with values
// resolved from GameState + a small SmartTextContext carrying entity IDs.
//
// Phase A scope covers §3.1 identity tokens and §3.2 situational tokens of
// docs/SMART_CARD_ENGINE_SURFACE.md. Memory (§3.3) and stakes (§3.4) tokens are
// reserved in the dispatch table but resolve to empty strings until Phase C/D.
//
// Unknown tokens are preserved as-is (so authoring drift is visible during
// review); tokens whose context is missing resolve to the documented fallback.
// Exception: `{neighbor}` with no neighborId preserves the literal so legacy
// call sites that had no event context keep their current behavior.

import type { GameState, PopulationClass, KingdomCondition } from '../engine/types';
import {
  CouncilSeat,
  Season,
  SeasonMonth,
  RegionalPosture,
  ConditionType,
} from '../engine/types';
import {
  getNeighborDisplayName,
  getNeighborRulerName,
  getNeighborRulerTitle,
  getNeighborDynastyName,
  getNeighborCapitalName,
  getNeighborEpithet,
  getNeighborFullRulerDescriptor,
  getRegionDisplayName,
  getSettlementDisplayName,
} from './nameResolver';
import {
  getRivalEconomicPhaseLabel,
  getRivalMoodDescriptor,
  getRivalCrisisClause,
} from './rivalState';
import {
  ECONOMIC_PHASE_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
  TERRAIN_TYPE_LABELS,
  CONDITION_TYPE_LABELS,
  CONDITION_SEVERITY_ARTICLE,
  BOND_KIND_LABELS,
} from '../data/text/labels';
import { THEMATIC_MONTH_NAMES } from '../data/text/month-names';
import { SEASON_MONTHS } from '../engine/constants';
import { INITIATIVE_DEFINITIONS } from '../data/initiatives/index';
import { STORYLINE_TEXT } from '../data/text/events';
import { WORLD_EVENT_TEXT } from '../data/text/world-events';
import { getIntelLevel } from './dossierCompiler';

// ============================================================
// Context passed by card generators
// ============================================================

export interface SmartTextContext {
  neighborId?: string;
  regionId?: string;
  settlementId?: string;
  classId?: PopulationClass;
  seat?: CouncilSeat;
  agentId?: string;
  bondId?: string;
  initiativeDefId?: string;
  storylineDefId?: string;
  worldEventDefId?: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Replaces every `{token}` in `text` with its resolved value.
 *
 * Tokens take two forms:
 *   - Simple:        `{season}`, `{ruler_full}`, `{neighbor}`
 *   - Parameterised: `{prefix:arg}` — e.g. `{condition:Drought}`,
 *                    `{prior_decision_clause:merchant}`. The resolver is
 *                    looked up by prefix and receives `arg` as a third arg.
 *
 * Missing context resolves to a documented fallback; unknown tokens are left
 * in place so drift is visible during review.
 */
export function substituteSmartPlaceholders(
  text: string,
  state: GameState,
  ctx: SmartTextContext = {},
): string {
  if (!text || text.indexOf('{') === -1) return text;
  return text.replace(TOKEN_REGEX, (match, token: string) => {
    const colonIdx = token.indexOf(':');
    const key = colonIdx === -1 ? token : token.slice(0, colonIdx);
    const arg = colonIdx === -1 ? undefined : token.slice(colonIdx + 1);
    const resolver = DISPATCH[key];
    if (!resolver) return match;
    const out = resolver(state, ctx, arg);
    return out === undefined ? match : out;
  });
}

// Matches {ident} and {ident:arg}. Token prefix permits letters, digits,
// underscore, and slashes (slashes used by grammar helpers like
// `{their/his/her}`). Arg allows [A-Za-z0-9_] for entity IDs and enum labels.
const TOKEN_REGEX = /\{([A-Za-z][A-Za-z0-9_/]*(?::[A-Za-z0-9_]+)?)\}/g;

// ============================================================
// Dispatch table
// ============================================================

type Resolver = (
  state: GameState,
  ctx: SmartTextContext,
  arg?: string,
) => string | undefined;

const SEAT_FALLBACK_LABEL: Record<CouncilSeat, string> = {
  [CouncilSeat.Chancellor]: 'your chancellor',
  [CouncilSeat.Marshal]: 'your marshal',
  [CouncilSeat.Chamberlain]: 'your chamberlain',
  [CouncilSeat.Spymaster]: 'your spymaster',
};

const REGIONAL_POSTURE_LABELS: Record<RegionalPosture, string> = {
  [RegionalPosture.Develop]: 'Develop',
  [RegionalPosture.Extract]: 'Extract',
  [RegionalPosture.Garrison]: 'Garrison',
  [RegionalPosture.Pacify]: 'Pacify',
  [RegionalPosture.Autonomy]: 'Autonomy',
};

const DISPATCH: Record<string, Resolver> = {
  // ---- §3.1 Identity — neighbor ----
  // `{neighbor}` with no context preserves the literal; legacy callers that
  // render event text without an affectedNeighborId must keep their current
  // leave-as-is behavior.
  neighbor: (state, ctx) => {
    if (!ctx.neighborId) return undefined;
    return getNeighborDisplayName(ctx.neighborId, state);
  },
  neighbor_short: (state, ctx) => {
    if (!ctx.neighborId) return 'their realm';
    const display = getNeighborDisplayName(ctx.neighborId, state);
    return display
      .replace(/^Kingdom of /, '')
      .replace(/^Realm of /, '')
      .replace(/^Crown of /, '')
      .replace(/^Free Cities of /, '')
      .replace(/^The /, '')
      .replace(/ Dominion$/, '')
      .replace(/ Confederation$/, '')
      .replace(/ Marches$/, '');
  },
  ruler: (state, ctx) => {
    if (!ctx.neighborId) return 'the ruler';
    return getNeighborRulerName(ctx.neighborId, state);
  },
  ruler_title: (state, ctx) => {
    if (!ctx.neighborId) return 'the ruler';
    return getNeighborRulerTitle(ctx.neighborId, state);
  },
  ruler_full: (state, ctx) => {
    if (!ctx.neighborId) return 'the ruler';
    return getNeighborFullRulerDescriptor(ctx.neighborId, state);
  },
  dynasty: (state, ctx) => {
    if (!ctx.neighborId) return 'the royal house';
    return getNeighborDynastyName(ctx.neighborId, state);
  },
  capital: (state, ctx) => {
    if (!ctx.neighborId) return 'the capital';
    return getNeighborCapitalName(ctx.neighborId, state);
  },
  epithet: (state, ctx) => {
    if (!ctx.neighborId) return '';
    return getNeighborEpithet(ctx.neighborId, state) ?? '';
  },

  // ---- §3.1 Identity — region & settlement ----
  region: (state, ctx) => {
    if (!ctx.regionId) return 'the province';
    return getRegionDisplayName(ctx.regionId, state);
  },
  settlement: (state, ctx) => {
    if (!ctx.settlementId) return 'the settlement';
    return getSettlementDisplayName(ctx.settlementId, state);
  },

  // ---- §3.1 Identity — council seats ----
  chancellor: (state) => resolveAdvisorName(state, CouncilSeat.Chancellor, false),
  marshal: (state) => resolveAdvisorName(state, CouncilSeat.Marshal, false),
  chamberlain: (state) => resolveAdvisorName(state, CouncilSeat.Chamberlain, false),
  spymaster: (state) => resolveAdvisorName(state, CouncilSeat.Spymaster, false),
  chancellor_or_fallback: (state) => resolveAdvisorName(state, CouncilSeat.Chancellor, true),
  marshal_or_fallback: (state) => resolveAdvisorName(state, CouncilSeat.Marshal, true),
  chamberlain_or_fallback: (state) => resolveAdvisorName(state, CouncilSeat.Chamberlain, true),
  spymaster_or_fallback: (state) => resolveAdvisorName(state, CouncilSeat.Spymaster, true),

  // ---- §3.1 Identity — active entities by title ----
  initiative_title: (state, ctx) => {
    const id = ctx.initiativeDefId ?? state.activeInitiative?.definitionId;
    if (!id) return 'the long-term initiative';
    return INITIATIVE_DEFINITIONS[id]?.title ?? 'the long-term initiative';
  },
  storyline_title: (state, ctx) => {
    const id = ctx.storylineDefId ?? state.activeStorylines[0]?.definitionId;
    if (!id) return 'the unfolding matter';
    return STORYLINE_TEXT[id]?.title ?? 'the unfolding matter';
  },
  world_event_title: (state, ctx) => {
    const id = ctx.worldEventDefId ?? state.activeWorldEvents?.[0]?.definitionId;
    if (!id) return 'the region-wide event';
    return WORLD_EVENT_TEXT[id]?.title ?? 'the region-wide event';
  },

  // ---- §3.2 Situational — time ----
  season: (state) => String(state.turn.season),
  month_name: (state) => resolveMonthName(state),
  year: (state) => `the ${ordinal(state.turn.year)} year of your reign`,

  // ---- §3.2 Situational — economy & treasury ----
  economic_phase: (state) => ECONOMIC_PHASE_LABELS[state.economy.cyclePhase],
  economic_phase_lc: (state) => ECONOMIC_PHASE_LABELS[state.economy.cyclePhase].toLowerCase(),
  inflation_note: (state) => {
    const rate = state.economy.inflationRate ?? 0;
    if (rate < 0.05) return '';
    const pct = Math.round(rate * 100);
    return `with inflation at ${pct}%`;
  },
  treasury_tier: (state) => treasuryTier(state),
  stores_tier: (state) => storesTier(state),
  intel_tier: (state) => {
    const tier = getIntelLevel(state.espionage.networkStrength ?? 0);
    return tier === 'none' ? 'no intel' : tier;
  },

  // ---- §3.2 Situational — geography & posture ----
  terrain: (state, ctx) => {
    if (!ctx.regionId) return 'the land';
    const region = state.regions.find((r) => r.id === ctx.regionId);
    if (!region?.terrainType) return 'the land';
    return TERRAIN_TYPE_LABELS[region.terrainType];
  },
  region_posture: (state, ctx) => {
    if (!ctx.regionId) return 'Autonomy';
    const region = state.regions.find((r) => r.id === ctx.regionId);
    const posture = region?.posture ?? RegionalPosture.Autonomy;
    return REGIONAL_POSTURE_LABELS[posture];
  },
  diplomatic_posture: (state, ctx) => {
    if (!ctx.neighborId) return 'Neutral Standing';
    const neighbor = state.diplomacy.neighbors.find((n) => n.id === ctx.neighborId);
    if (!neighbor) return 'Neutral Standing';
    return DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture];
  },
  // Alias: prefers region posture when region is in context, otherwise falls
  // back to the neighbor's diplomatic posture.
  posture: (state, ctx) => {
    if (ctx.regionId) {
      const region = state.regions.find((r) => r.id === ctx.regionId);
      const posture = region?.posture ?? RegionalPosture.Autonomy;
      return REGIONAL_POSTURE_LABELS[posture];
    }
    if (ctx.neighborId) {
      const neighbor = state.diplomacy.neighbors.find((n) => n.id === ctx.neighborId);
      if (neighbor) return DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture];
    }
    return 'Neutral Standing';
  },

  // ---- §3.2 Situational — faith & culture ----
  faith_tradition: (state) => titleCaseId(state.faithCulture.kingdomFaithTraditionId, 'the kingdom faith'),
  culture_identity: (state) => titleCaseId(state.faithCulture.kingdomCultureIdentityId, "the realm's ways"),

  // ---- §3.2 Situational — region loyalty & military tier (Phase C) ----
  loyalty_tier: (state, ctx) => {
    if (!ctx.regionId) return 'settled';
    const region = state.regions.find((r) => r.id === ctx.regionId);
    if (region?.loyalty === undefined || region.loyalty === null) return 'settled';
    return loyaltyTier(region.loyalty);
  },
  morale_tier: (state) => moraleTier(state.military.morale),
  equipment_condition_tier: (state) => equipmentTier(state.military.equipmentCondition),

  // ---- §3.2 Situational — parameterised active conditions ----
  // `{condition:Drought}` → "a severe Drought" if a matching KingdomCondition is
  // active on ctx.regionId (or kingdom-wide), otherwise "".
  condition: (state, ctx, arg) => {
    if (!arg) return '';
    const found = findActiveCondition(state, ctx, arg);
    if (!found) return '';
    const label = CONDITION_TYPE_LABELS[found.type] ?? found.type;
    return `${CONDITION_SEVERITY_ARTICLE[found.severity]} ${label}`;
  },
  // Companion: a short listing of all active conditions on the context region
  // (or kingdom-wide). Empty if none.
  condition_context: (state, ctx) => {
    const conditions = collectActiveConditions(state, ctx);
    if (conditions.length === 0) return '';
    const labels = conditions.map((c) => CONDITION_TYPE_LABELS[c.type] ?? c.type);
    return `already gripped by ${joinWithAnd(labels)}`;
  },

  // ---- §3.1 Identity — bonds (Phase C) ----
  bond_kind: (state, ctx) => {
    if (!ctx.bondId) return 'bond';
    const bond = state.diplomacy.bonds?.find((b) => b.bondId === ctx.bondId);
    if (!bond) return 'bond';
    return BOND_KIND_LABELS[bond.kind] ?? 'bond';
  },

  // ---- §3.4 Stakes — rival-scoped (Phase C) ----
  // Prefer the arg form `{rival_mood:neighbor_a}`; fall back to ctx.neighborId.
  rival_mood: (state, ctx, arg) => {
    const id = arg ?? ctx.neighborId;
    if (!id) return 'settled';
    return getRivalMoodDescriptor(id, state);
  },
  rival_crisis: (state, ctx, arg) => {
    const id = arg ?? ctx.neighborId;
    if (!id) return '';
    return getRivalCrisisClause(id, state);
  },
  rival_economic_phase: (state, ctx, arg) => {
    const id = arg ?? ctx.neighborId;
    if (!id) return 'Stagnation';
    return getRivalEconomicPhaseLabel(id, state);
  },
  rival_economic_phase_lc: (state, ctx, arg) => {
    const id = arg ?? ctx.neighborId;
    if (!id) return 'stagnation';
    return getRivalEconomicPhaseLabel(id, state).toLowerCase();
  },

  // ---- §3.5 Grammar helpers (gender-neutral defaults; refine in later phase) ----
  'their/his/her': () => 'their',
  'They/He/She': () => 'They',
  'is/was': () => 'is',

  // ---- §3.3 Memory clauses — reserved, empty until Phase D ----
  neighbor_memory_clause: () => '',
  ruling_style_note: () => '',
  recent_causal: () => '',
  inter_rival_note: () => '',
  watching_faction: () => '',
  storyline_arc_note: () => '',

  // ---- §3.3 Parameterised memory tokens — reserved, empty until Phase D ----
  agent: () => '',
  prior_decision_clause: () => '',
};

// ============================================================
// Helpers
// ============================================================

function resolveAdvisorName(
  state: GameState,
  seat: CouncilSeat,
  withFallback: boolean,
): string {
  const advisor = state.council?.appointments?.[seat];
  if (advisor?.name) return advisor.name;
  return withFallback ? SEAT_FALLBACK_LABEL[seat] : `your ${seat.toLowerCase()}`;
}

function resolveMonthName(state: GameState): string {
  const { season, month } = state.turn;
  const seasonMonths = SEASON_MONTHS[season as Season];
  if (!seasonMonths) return `month ${month}`;
  const idx = seasonMonths.indexOf(month);
  if (idx === -1) return `month ${month}`;
  const sm = (idx + 1) as SeasonMonth;
  return THEMATIC_MONTH_NAMES[season as Season]?.[sm] ?? `month ${month}`;
}

function treasuryTier(state: GameState): string {
  const { balance, netFlowPerTurn, expenses } = state.treasury;
  const totalMonthlyExpenses =
    (expenses?.militaryUpkeep ?? 0) +
    (expenses?.constructionCosts ?? 0) +
    (expenses?.intelligenceFunding ?? 0) +
    (expenses?.religiousUpkeep ?? 0) +
    (expenses?.festivalCosts ?? 0);
  const monthsOfRunway = totalMonthlyExpenses > 0
    ? balance / totalMonthlyExpenses
    : balance > 0 ? Infinity : 0;
  if (monthsOfRunway < 0 && netFlowPerTurn < 0) return 'Dire';
  if (monthsOfRunway < 2 && netFlowPerTurn < 0) return 'Troubled';
  if (monthsOfRunway > 9 && netFlowPerTurn > 0) return 'Flourishing';
  if (monthsOfRunway > 5 && netFlowPerTurn > 0) return 'Prosperous';
  return 'Stable';
}

function storesTier(state: GameState): string {
  const reserves = state.food.reserves;
  const consumption = state.food.consumptionPerTurn ?? 0;
  if (consumption <= 0) return reserves > 0 ? 'Flourishing' : 'Dire';
  const monthsOfSupply = reserves / consumption;
  if (monthsOfSupply < 1) return 'Dire';
  if (monthsOfSupply < 2) return 'Troubled';
  if (monthsOfSupply <= 5) return 'Stable';
  if (monthsOfSupply <= 9) return 'Prosperous';
  return 'Flourishing';
}

function titleCaseId(id: string | undefined | null, fallback: string): string {
  if (!id) return fallback;
  return id
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ---- Phase C tier helpers ----
// Band edges align with the gameplay-blueprint thresholds in engine/constants:
//   region.loyalty: <15 rebellion, <25 separatist, <40 reduced-tax
//   military.morale, military.equipmentCondition: 0..100, starting 65/55.

function loyaltyTier(value: number): string {
  if (value < 15) return 'rebellious';
  if (value < 25) return 'resentful';
  if (value < 40) return 'restless';
  if (value < 60) return 'neutral';
  if (value < 80) return 'loyal';
  return 'devoted';
}

function moraleTier(value: number): string {
  if (value < 20) return 'broken';
  if (value < 40) return 'shaken';
  if (value < 60) return 'steady';
  if (value < 80) return 'confident';
  return 'ardent';
}

function equipmentTier(value: number): string {
  if (value < 20) return 'ruined';
  if (value < 40) return 'worn';
  if (value < 60) return 'serviceable';
  if (value < 80) return 'sound';
  return 'pristine';
}

// Resolve a ConditionType argument from the authored token. Authors may write
// either the enum key (`{condition:Drought}`) or the value it serializes to
// (they are identical here), so we look the string up directly.
function resolveConditionType(arg: string): ConditionType | undefined {
  // ConditionType is a string enum where keys and values coincide; cast after
  // guarding against unknown entries.
  const match = (ConditionType as Record<string, string>)[arg];
  if (match !== undefined) return match as ConditionType;
  // Also allow authored args whose casing differs from the enum member name.
  const normalised = arg.toLowerCase();
  for (const v of Object.values(ConditionType)) {
    if (v.toLowerCase() === normalised) return v as ConditionType;
  }
  return undefined;
}

function findActiveCondition(
  state: GameState,
  ctx: SmartTextContext,
  arg: string,
): KingdomCondition | undefined {
  const type = resolveConditionType(arg);
  if (!type) return undefined;
  // Prefer a match on the context region if supplied; otherwise kingdom-wide.
  if (ctx.regionId) {
    const region = state.regions.find((r) => r.id === ctx.regionId);
    const hit = region?.localConditions?.find((c) => c.type === type);
    if (hit) return hit;
  }
  return state.environment?.activeConditions?.find((c) => c.type === type);
}

function collectActiveConditions(
  state: GameState,
  ctx: SmartTextContext,
): KingdomCondition[] {
  const scope: KingdomCondition[] = [];
  if (ctx.regionId) {
    const region = state.regions.find((r) => r.id === ctx.regionId);
    if (region?.localConditions?.length) scope.push(...region.localConditions);
  }
  const kingdomWide = state.environment?.activeConditions ?? [];
  for (const c of kingdomWide) {
    if (!scope.some((existing) => existing.type === c.type)) scope.push(c);
  }
  return scope;
}

function joinWithAnd(parts: string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}
