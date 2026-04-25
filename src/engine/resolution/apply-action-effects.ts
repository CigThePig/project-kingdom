// Phase 1 — Action Effect Resolution
// Blueprint Reference: gameplay-blueprint.md §5.2–§5.11
//
// Implements ApplyActionEffectsFn: applies all queued player actions to GameState
// during Phase 2 of turn resolution. Pure TypeScript — no React imports.
//
// Actions are applied sequentially in player-queue order. Resource costs are
// deducted immediately; each subsequent action sees reduced stockpiles.
//
// This handler does NOT re-resolve intelligence operations (Phase 5 handles those)
// and does NOT run milestone checks (Phase 7 handles those).

import {
  ActionType,
  ConstructionCategory,
  ConstructionProject,
  DiplomaticAgreement,
  FestivalInvestmentLevel,
  GameState,
  IntelligenceFundingLevel,
  IssuedDecree,
  KingdomFeature,
  KnowledgeBranch,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  PersistentConsequence,
  PopulationClass,
  QueuedAction,
  RivalAgenda,
  TemporaryModifier,
  RationingLevel,
  ReligiousOrder,
  ReligiousOrderType,
  ReligiousTolerance,
  ResourceState,
  ResourceType,
  StorylineStatus,
  TaxationLevel,
  TradeOpenness,
} from '../types';
import { DECREE_POOL } from '../../data/decrees/index';
import { EVENT_CHOICE_EFFECTS, EVENT_CHOICE_TEMPORARY_MODIFIERS } from '../../data/events/effects';
import {
  isOvertureEventId,
  parseOvertureEventId,
} from '../../bridge/diplomaticOvertureGenerator';
import {
  isMediationEventId,
  isCoalitionEventId,
  parseMediationChoice,
  parseCoalitionChoice,
} from '../../bridge/interRivalCardGenerator';
import { recordMemory } from '../systems/rival-memory';
import { STORYLINE_CHOICE_EFFECTS } from '../../data/storylines/effects';
import { STORYLINE_POOL } from '../../data/storylines/index';
import { generateSpouseName } from '../../data/text/name-generation';
import { applyDiplomaticActionEffect as applyNeighborRelDelta } from '../systems/diplomacy';
import type { Bond } from '../types';
import {
  createMarriageBond,
  createTradeLeagueBond,
  createCulturalExchangeBond,
  createCoalitionBond,
  createVassalageBond,
} from '../systems/bonds';
import { applyEventChoiceEffects, applyStorylineBranchEffects, applyMechanicalEffectDelta } from '../events/apply-event-effects';
import { DECREE_EFFECTS as DECREE_PREVIEW_EFFECTS } from '../../data/decrees/effects';
import { recordBranchDecision } from '../events/storyline-engine';
import { turnRng, rngSuffix } from './turn-rng';
import { KINGDOM_FEATURE_REGISTRY } from '../../data/kingdom-features/index';
import {
  CONSTRUCTION_DEFAULT_TURNS,
  DECREE_EFFECTS,
  DIPLOMATIC_ACTION_DELTAS,
  MAX_ACTIVE_RELIGIOUS_ORDERS,
  RELIGIOUS_EDICT_FESTIVAL_FAITH_DELTA,
  RELIGIOUS_EDICT_FESTIVAL_CLERGY_SAT_DELTA,
  RELIGIOUS_EDICT_HERESY_DELTA,
  RELIGIOUS_EDICT_HERESY_CLERGY_SAT_DELTA,
  RELIGIOUS_EDICT_OBSERVANCE_COHESION_DELTA,
  RELIGIOUS_EDICT_OBSERVANCE_FAITH_DELTA,
  RELIGIOUS_ORDER_UPKEEP_PER_TURN,
  RESEARCH_DIRECTIVE_PROGRESS_BURST,
  RESEARCH_DIRECTIVE_TREASURY_COST,
  TRADE_AGREEMENT_TURNS,
} from '../constants';

// ============================================================
// Internal helpers
// ============================================================

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function deductResourceCosts(
  resources: ResourceState,
  costs: Partial<Record<ResourceType, number>>,
): ResourceState {
  let updated = resources;
  for (const [rt, cost] of Object.entries(costs) as [ResourceType, number][]) {
    if (cost === undefined || cost <= 0) continue;
    updated = {
      ...updated,
      [rt]: {
        ...updated[rt],
        stockpile: Math.max(0, updated[rt].stockpile - cost),
      },
    };
  }
  return updated;
}

function applyClassSatisfactionDelta(
  population: GameState['population'],
  cls: PopulationClass,
  delta: number,
): GameState['population'] {
  const prev = population[cls];
  return {
    ...population,
    [cls]: {
      ...prev,
      satisfaction: clamp(prev.satisfaction + delta, 0, 100),
    },
  };
}

// ============================================================
// Type guards for parameters (Record<string, unknown>)
// ============================================================

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}

function isPartialResourceCosts(v: unknown): v is Partial<Record<ResourceType, number>> {
  if (typeof v !== 'object' || v === null) return false;
  const obj = v as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!Object.values(ResourceType).includes(key as ResourceType)) return false;
    if (typeof obj[key] !== 'number') return false;
  }
  return true;
}

function isTaxationLevel(v: unknown): v is TaxationLevel {
  return Object.values(TaxationLevel).includes(v as TaxationLevel);
}

function isTradeOpenness(v: unknown): v is TradeOpenness {
  return Object.values(TradeOpenness).includes(v as TradeOpenness);
}

function isRationingLevel(v: unknown): v is RationingLevel {
  return Object.values(RationingLevel).includes(v as RationingLevel);
}

function isReligiousTolerance(v: unknown): v is ReligiousTolerance {
  return Object.values(ReligiousTolerance).includes(v as ReligiousTolerance);
}

function isFestivalInvestmentLevel(v: unknown): v is FestivalInvestmentLevel {
  return Object.values(FestivalInvestmentLevel).includes(v as FestivalInvestmentLevel);
}

function isMilitaryRecruitmentStance(v: unknown): v is MilitaryRecruitmentStance {
  return Object.values(MilitaryRecruitmentStance).includes(v as MilitaryRecruitmentStance);
}

function isIntelligenceFundingLevel(v: unknown): v is IntelligenceFundingLevel {
  return Object.values(IntelligenceFundingLevel).includes(v as IntelligenceFundingLevel);
}

function isKnowledgeBranch(v: unknown): v is KnowledgeBranch {
  return Object.values(KnowledgeBranch).includes(v as KnowledgeBranch);
}

function isMilitaryPosture(v: unknown): v is MilitaryPosture {
  return Object.values(MilitaryPosture).includes(v as MilitaryPosture);
}

function isReligiousOrderType(v: unknown): v is ReligiousOrderType {
  return Object.values(ReligiousOrderType).includes(v as ReligiousOrderType);
}

function isConstructionCategory(v: unknown): v is ConstructionCategory {
  return Object.values(ConstructionCategory).includes(v as ConstructionCategory);
}

// ============================================================
// Decree effect registry
// Keys are decree IDs with the 'decree_' prefix stripped.
// Each function receives (state, action) and returns a new GameState.
// Resource costs are deducted before these run — handle only downstream effects here.
// ============================================================

type DecreeEffectFn = (state: GameState, action: QueuedAction) => GameState;

function satDelta(
  state: GameState,
  deltas: Partial<Record<'nobilitySat' | 'clergySat' | 'merchantSat' | 'commonerSat' | 'militaryCasteSat', number>>,
): GameState['population'] {
  let pop = state.population;
  if (deltas.nobilitySat) pop = applyClassSatisfactionDelta(pop, PopulationClass.Nobility, deltas.nobilitySat);
  if (deltas.clergySat) pop = applyClassSatisfactionDelta(pop, PopulationClass.Clergy, deltas.clergySat);
  if (deltas.merchantSat) pop = applyClassSatisfactionDelta(pop, PopulationClass.Merchants, deltas.merchantSat);
  if (deltas.commonerSat) pop = applyClassSatisfactionDelta(pop, PopulationClass.Commoners, deltas.commonerSat);
  if (deltas.militaryCasteSat) pop = applyClassSatisfactionDelta(pop, PopulationClass.MilitaryCaste, deltas.militaryCasteSat);
  return pop;
}

// Helper: apply satisfaction + treasury delta from an effect constant.
function applySatAndTreasury(state: GameState, eff: typeof DECREE_EFFECTS[keyof typeof DECREE_EFFECTS]): GameState {
  let s = { ...state, population: satDelta(state, eff) };
  if ('treasuryDelta' in eff && eff.treasuryDelta) {
    s = { ...s, treasury: { ...s.treasury, balance: s.treasury.balance + eff.treasuryDelta } };
  }
  return s;
}

// Combined effect applicator for decrees that only need sat + treasury + military + faith.
function applyFullDecreeDeltas(state: GameState, action: QueuedAction, eff: typeof DECREE_EFFECTS[keyof typeof DECREE_EFFECTS]): GameState {
  let s = applySatAndTreasury(state, eff);
  const effRecord = eff as Record<string, number>;
  // Military
  if ('readinessDelta' in eff || 'moraleDelta' in eff || 'equipmentDelta' in eff) {
    let mil = s.military;
    if (effRecord.readinessDelta) mil = { ...mil, readiness: clamp(mil.readiness + effRecord.readinessDelta, 0, 100) };
    if (effRecord.moraleDelta) mil = { ...mil, morale: clamp(mil.morale + effRecord.moraleDelta, 0, 100) };
    if (effRecord.equipmentDelta) mil = { ...mil, equipmentCondition: clamp(mil.equipmentCondition + effRecord.equipmentDelta, 0, 100) };
    s = { ...s, military: mil };
  }
  // Faith/Heterodoxy
  if ('faithDelta' in eff || 'heterodoxyDelta' in eff) {
    let fc = s.faithCulture;
    if (effRecord.faithDelta) fc = { ...fc, faithLevel: clamp(fc.faithLevel + effRecord.faithDelta, 0, 100) };
    if (effRecord.heterodoxyDelta) fc = { ...fc, heterodoxy: clamp(fc.heterodoxy + effRecord.heterodoxyDelta, 0, 100) };
    s = { ...s, faithCulture: fc };
  }
  // Diplomacy
  if ('relationshipDelta' in eff && action.targetNeighborId !== null) {
    s = {
      ...s,
      diplomacy: {
        ...s.diplomacy,
        neighbors: applyNeighborRelDelta(s.diplomacy.neighbors, action.targetNeighborId, effRecord.relationshipDelta),
      },
    };
  }
  return s;
}

// Phase 13 — helpers for decrees that materialise diplomacy bonds.
function appendBondToState(state: GameState, bond: Bond): GameState {
  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      bonds: [...(state.diplomacy.bonds ?? []), bond],
    },
  };
}

function pickDecreeTargetNeighbor(state: GameState, action: QueuedAction): string | undefined {
  if (action.targetNeighborId) return action.targetNeighborId;
  const peaceful = state.diplomacy.neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return peaceful[0]?.id ?? state.diplomacy.neighbors[0]?.id;
}

function pickSecondMarriageNeighbor(state: GameState, excludeId: string | undefined): string | undefined {
  const peaceful = state.diplomacy.neighbors
    .filter((n) => !n.isAtWarWithPlayer && n.id !== excludeId)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  return peaceful[0]?.id;
}

export const DECREE_EFFECT_REGISTRY = new Map<string, DecreeEffectFn>([
  // --- Market Chain ---
  ['market_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.market_charter)],
  ['trade_guild_expansion', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_guild_expansion)],
  ['merchant_republic_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.merchant_republic_charter)],
  // --- Trade Chain ---
  ['trade_subsidies', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_subsidies)],
  ['trade_monopoly', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_monopoly)],
  // International trade empire draws rival ire. Apply full deltas and then
  // nudge every peaceful neighbor's relationship score downward — rivals
  // resent the new commercial hegemony.
  ['international_trade_empire', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.international_trade_empire);
    const neighbors = s.diplomacy.neighbors.map((n) =>
      n.isAtWarWithPlayer
        ? n
        : { ...n, relationshipScore: clamp(n.relationshipScore - 5, 0, 100) },
    );
    return { ...s, diplomacy: { ...s.diplomacy, neighbors } };
  }],
  // --- Emergency Levy ---
  ['emergency_levy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.emergency_levy)],
  // --- Fortification Chain ---
  ['fortify_borders', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.fortify_borders)],
  ['integrated_defense_network', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.integrated_defense_network)],
  ['fortress_kingdom', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.fortress_kingdom)],
  // --- Arms Chain ---
  ['arms_commission', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.arms_commission)],
  ['royal_arsenal', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.royal_arsenal)],
  ['war_machine_industry', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.war_machine_industry)],
  // --- General Mobilization ---
  // Defining-tier decree: apply full deltas and also shift the recruitment
  // stance to WarFooting so the "high impact" label matches a real policy
  // change (per CARD_AUDIT_RULES §9.1).
  ['general_mobilization', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.general_mobilization);
    return {
      ...s,
      policies: { ...s.policies, militaryRecruitmentStance: MilitaryRecruitmentStance.WarFooting },
    };
  }],
  // --- Roads Chain ---
  ['road_improvement', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.road_improvement)],
  // Preview includes regionDevelopmentDelta so we run through
  // applyMechanicalEffectDelta to actually bump region development
  // (applyFullDecreeDeltas doesn't cover that field).
  ['provincial_highway_system', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_provincial_highway_system, action.targetRegionId)],
  ['kingdom_transit_network', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.kingdom_transit_network)],
  // --- Census ---
  ['census', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.census)],
  // --- Admin Chain ---
  ['administrative_reform', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.administrative_reform)],
  ['royal_bureaucracy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.royal_bureaucracy)],
  ['centralized_governance', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.centralized_governance)],
  // --- Call Festival ---
  ['call_festival', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.call_festival)],
  // --- Faith Chain ---
  ['invest_religious_order', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.invest_religious_order)],
  ['expand_religious_authority', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.expand_religious_authority)],
  ['theocratic_council', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.theocratic_council)],
  // --- Heresy Chain ---
  ['suppress_heresy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.suppress_heresy)],
  ['inquisitorial_authority', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.inquisitorial_authority)],
  ['religious_unification', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.religious_unification)],
  // --- Envoy Chain ---
  ['diplomatic_envoy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.diplomatic_envoy)],
  // Phase 13 — embassy creates a CulturalExchangeBond with the target neighbor.
  ['permanent_embassy', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.permanent_embassy);
    const targetId = pickDecreeTargetNeighbor(s, action);
    if (!targetId) return s;
    return appendBondToState(s, createCulturalExchangeBond([targetId], s.turn.turnNumber));
  }],
  // Phase 13 — supremacy adds a second CulturalExchangeBond on a second neighbor,
  // representing the wider mediation network promised by the tier-3 decree.
  ['diplomatic_supremacy', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.diplomatic_supremacy);
    const firstId = pickDecreeTargetNeighbor(s, action);
    const secondId = pickSecondMarriageNeighbor(s, firstId);
    if (!secondId) return s;
    return appendBondToState(s, createCulturalExchangeBond([secondId], s.turn.turnNumber));
  }],
  // --- Trade Agreement ---
  // Phase 13 — creates a TradeLeagueBond with the target neighbor.
  ['trade_agreement', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_agreement);
    const targetId = pickDecreeTargetNeighbor(s, action);
    if (!targetId) return s;
    return appendBondToState(s, createTradeLeagueBond([targetId], s.turn.turnNumber, 8));
  }],
  // --- Marriage Chain ---
  // Phase 13 — each tier adds a MarriageBond. Confederation converts the network
  // into a CoalitionBond spanning every marriage partner.
  ['royal_marriage', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.royal_marriage);
    const targetId = pickDecreeTargetNeighbor(s, action);
    if (!targetId) return s;
    return appendBondToState(s, createMarriageBond({
      participants: [targetId],
      turn: s.turn.turnNumber,
      spouseName: generateSpouseName(targetId),
      dynastyId: `dyn_${targetId}`,
    }));
  }],
  ['dynasty_alliance', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.dynasty_alliance);
    const existingMarriage = (s.diplomacy.bonds ?? []).find((b) => b.kind === 'royal_marriage');
    const firstPartner = existingMarriage?.participants[0];
    const secondId = pickSecondMarriageNeighbor(s, firstPartner);
    if (!secondId) return s;
    return appendBondToState(s, createMarriageBond({
      participants: [secondId],
      turn: s.turn.turnNumber,
      spouseName: generateSpouseName(secondId),
      dynastyId: `dyn_${secondId}`,
    }));
  }],
  ['imperial_confederation', (state, action) => {
    const s = applyFullDecreeDeltas(state, action, DECREE_EFFECTS.imperial_confederation);
    const marriagePartners = (s.diplomacy.bonds ?? [])
      .filter((b) => b.kind === 'royal_marriage')
      .flatMap((b) => b.participants);
    if (marriagePartners.length === 0) return s;
    const hostileEnemy = s.diplomacy.neighbors.find((n) => n.isAtWarWithPlayer)?.id
      ?? s.diplomacy.neighbors[0]?.id
      ?? 'unknown';
    return appendBondToState(s, createCoalitionBond(marriagePartners, s.turn.turnNumber, hostileEnemy));
  }],
  // --- Granary Chain ---
  ['public_granary', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.public_granary)],
  // Preview includes foodDelta + stabilityDelta which applyFullDecreeDeltas
  // doesn't cover; route through applyMechanicalEffectDelta instead.
  ['regional_food_distribution', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_regional_food_distribution, action.targetRegionId)],
  ['kingdom_breadbasket', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.kingdom_breadbasket)],
  // --- Labor Chain ---
  ['labor_rights', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.labor_rights)],
  ['workers_guild_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.workers_guild_charter)],
  ['social_contract', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.social_contract)],
  // --- Land Redistribution ---
  ['land_redistribution', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.land_redistribution)],
  // --- Phase 6 — Repeatable Expansion Decrees ---
  // One-shot deltas applied from the authored preview table. Repeatable
  // decrees don't get a KINGDOM_FEATURE_REGISTRY entry, so without an
  // explicit handler they'd resolve silently (caught by
  // wiring.decree-structural-depth).
  ['exp_trade_caravan', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_trade_caravan, action.targetRegionId)],
  ['exp_levy_militia', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_levy_militia, action.targetRegionId)],
  ['exp_blessing_ceremony', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_blessing_ceremony, action.targetRegionId)],
  ['exp_emergency_grain', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_emergency_grain, action.targetRegionId)],

  // --- Food Standalone Decrees ---
  ['military_ration_reform', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_military_ration_reform, action.targetRegionId)],
  ['seasonal_reserve_mandate', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_seasonal_reserve_mandate, action.targetRegionId)],
  ['agricultural_trade_compact', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_agricultural_trade_compact, action.targetRegionId)],
  ['harvest_tithe_exemption', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_harvest_tithe_exemption, action.targetRegionId)],

  // --- Knowledge-Gated: Agricultural ---
  ['crop_rotation', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_crop_rotation, action.targetRegionId)],
  ['irrigation_works', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_irrigation_works, action.targetRegionId)],

  // --- Knowledge-Gated: Military ---
  ['advanced_fortifications', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_advanced_fortifications, action.targetRegionId)],
  ['elite_training_program', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_elite_training_program, action.targetRegionId)],

  // --- Knowledge-Gated: Civic ---
  ['tax_code_reform', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_tax_code_reform, action.targetRegionId)],
  ['provincial_governance', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_provincial_governance, action.targetRegionId)],

  // --- Knowledge-Gated: Maritime/Trade ---
  ['harbor_expansion', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_harbor_expansion, action.targetRegionId)],
  ['trade_fleet_commission', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_trade_fleet_commission, action.targetRegionId)],

  // --- Knowledge-Gated: Cultural/Scholarly ---
  ['university_charter', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_university_charter, action.targetRegionId)],
  ['diplomatic_academy', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_diplomatic_academy, action.targetRegionId)],

  // --- Knowledge-Gated: Natural Philosophy ---
  ['engineering_corps', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_engineering_corps, action.targetRegionId)],
  ['medical_reforms', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_medical_reforms, action.targetRegionId)],

  // --- Expansion (Phase 7 wave 1) ---
  ['exp_spy_network', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_spy_network, action.targetRegionId)],
  ['exp_intelligence_bureau', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_intelligence_bureau, action.targetRegionId)],
  ['exp_shadow_council', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_shadow_council, action.targetRegionId)],
  ['exp_village_schools', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_village_schools, action.targetRegionId)],
  ['exp_provincial_academies', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_provincial_academies, action.targetRegionId)],
  ['exp_university_system', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_university_system, action.targetRegionId)],
  ['exp_land_reform', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_land_reform, action.targetRegionId)],
  ['exp_irrigation_authority', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_irrigation_authority, action.targetRegionId)],
  ['exp_agricultural_modernization', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_agricultural_modernization, action.targetRegionId)],
  ['exp_circuit_courts', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_circuit_courts, action.targetRegionId)],
  ['exp_common_law', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_common_law, action.targetRegionId)],
  ['exp_supreme_tribunal', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_supreme_tribunal, action.targetRegionId)],
  ['exp_mint_coinage', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_mint_coinage, action.targetRegionId)],
  ['exp_war_engineers', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_war_engineers, action.targetRegionId)],
  ['exp_infrastructure_audit', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_infrastructure_audit, action.targetRegionId)],
  ['exp_anti_corruption_campaign', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_anti_corruption_campaign, action.targetRegionId)],
  ['exp_interfaith_council', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_interfaith_council, action.targetRegionId)],
  ['exp_peace_envoy', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_peace_envoy, action.targetRegionId)],
  ['exp_cultural_exchange_program', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_cultural_exchange_program, action.targetRegionId)],
  ['exp_public_works', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_exp_public_works, action.targetRegionId)],

  // --- Expansion Wave 2 ---
  ['w2_weights_and_measures', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_weights_and_measures, action.targetRegionId)],
  ['w2_university_charter', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_university_charter, action.targetRegionId)],
  ['w2_codify_the_common_law', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_codify_the_common_law, action.targetRegionId)],
  ['w2_expand_the_bureaucracy', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_expand_the_bureaucracy, action.targetRegionId)],
  ['w2_free_cities_charter', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_free_cities_charter, action.targetRegionId)],
  ['w2_justice_circuits', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_justice_circuits, action.targetRegionId)],
  ['w2_sumptuary_laws', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_sumptuary_laws, action.targetRegionId)],
  ['w2_mint_standards', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_mint_standards, action.targetRegionId)],
  ['w2_road_construction', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_road_construction, action.targetRegionId)],
  ['w2_bridge_program', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_bridge_program, action.targetRegionId)],
  ['w2_military_reforms', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_military_reforms, action.targetRegionId)],
  ['w2_hunting_regulations', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_hunting_regulations, action.targetRegionId)],
  ['w2_religious_councils', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_religious_councils, action.targetRegionId)],
  ['w2_calendar_reform', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_calendar_reform, action.targetRegionId)],
  ['w2_language_standardization', (state, action) =>
    applyMechanicalEffectDelta(state, DECREE_PREVIEW_EFFECTS.decree_w2_language_standardization, action.targetRegionId)],
]);

// ============================================================
// Ten action handlers
// ============================================================

function applyDecreeEffect(state: GameState, action: QueuedAction): GameState {
  const decree = DECREE_POOL.find((d) => d.id === action.actionDefinitionId);
  if (!decree) return state; // unknown decree — no-op

  // 1. Deduct resource costs
  const resources = deductResourceCosts(state.resources, decree.resourceCosts);
  const stateAfterCosts = { ...state, resources };

  // 2. Strip 'decree_' prefix to get registry key
  const registryKey = decree.id.replace(/^decree_/, '');
  const effectFn = DECREE_EFFECT_REGISTRY.get(registryKey);
  const stateAfterEffects = effectFn ? effectFn(stateAfterCosts, action) : stateAfterCosts;

  // 3. Record the enacted decree for progression tracking
  const issuedRecord: IssuedDecree = {
    decreeId: decree.id,
    turnIssued: state.turn.turnNumber,
  };

  // 4. Record persistent consequences so future conditions can query decree
  //    history. Two tags per enactment:
  //      - `decree:<id>` — specific decree identity, used by feature registry.
  //      - `recent_decree_issued` — generic "any decree fired" gate for events
  //        like evt_exp_kgd_decree_dispute that react to policy churn.
  const decreeTag = `decree:${action.actionDefinitionId}`;
  let finalState = {
    ...stateAfterEffects,
    issuedDecrees: [...stateAfterEffects.issuedDecrees, issuedRecord],
    persistentConsequences: [
      ...stateAfterEffects.persistentConsequences,
      {
        sourceId: action.actionDefinitionId,
        sourceType: 'event',
        choiceMade: action.actionDefinitionId,
        turnApplied: state.turn.turnNumber,
        tag: `decree:${action.actionDefinitionId}`,
      } satisfies PersistentConsequence,
      {
        sourceId: action.actionDefinitionId,
        sourceType: 'event',
        choiceMade: action.actionDefinitionId,
        turnApplied: state.turn.turnNumber,
        tag: 'recent_decree_issued',
      } satisfies PersistentConsequence,
    ],
  };

  // 5. Create a kingdom feature if this decree has a registry entry.
  const featureDef = KINGDOM_FEATURE_REGISTRY[decreeTag];
  if (featureDef) {
    const feature: KingdomFeature = {
      id: `kf-${featureDef.featureId}-t${state.turn.turnNumber}`,
      sourceTag: decreeTag,
      turnEstablished: state.turn.turnNumber,
      ongoingEffect: featureDef.ongoingEffect,
      category: featureDef.category,
    };
    finalState = {
      ...finalState,
      activeKingdomFeatures: [...finalState.activeKingdomFeatures, feature],
    };
  }

  return finalState;
}

function applyPolicyChangeEffect(state: GameState, action: QueuedAction): GameState {
  const policy = action.parameters['policy'];
  const newValue = action.parameters['newValue'];

  if (!isString(policy)) return state;

  let policies = state.policies;

  switch (policy) {
    case 'taxationLevel':
      if (isTaxationLevel(newValue)) policies = { ...policies, taxationLevel: newValue };
      break;
    case 'tradeOpenness':
      if (isTradeOpenness(newValue)) policies = { ...policies, tradeOpenness: newValue };
      break;
    case 'rationingLevel':
      if (isRationingLevel(newValue)) policies = { ...policies, rationingLevel: newValue };
      break;
    case 'religiousTolerance':
      if (isReligiousTolerance(newValue)) policies = { ...policies, religiousTolerance: newValue };
      break;
    case 'festivalInvestmentLevel':
      if (isFestivalInvestmentLevel(newValue)) policies = { ...policies, festivalInvestmentLevel: newValue };
      break;
    case 'militaryRecruitmentStance':
      if (isMilitaryRecruitmentStance(newValue)) policies = { ...policies, militaryRecruitmentStance: newValue };
      break;
    case 'intelligenceFundingLevel':
      if (isIntelligenceFundingLevel(newValue)) policies = { ...policies, intelligenceFundingLevel: newValue };
      break;
    case 'researchFocus':
      // newValue may be a KnowledgeBranch or null
      if (newValue === null || isKnowledgeBranch(newValue)) {
        policies = { ...policies, researchFocus: newValue };
      }
      break;
    case 'laborAllocationPriority':
      if (newValue === null || isKnowledgeBranch(newValue)) {
        policies = { ...policies, laborAllocationPriority: newValue };
      }
      break;
  }

  return { ...state, policies };
}

function applyConstructionEffect(state: GameState, action: QueuedAction): GameState {
  // targetRegionId is required for construction
  if (action.targetRegionId === null) return state;

  const projectDefinitionId = action.parameters['projectDefinitionId'];
  const effectId = action.parameters['effectId'];
  if (!isString(projectDefinitionId) || !isString(effectId)) return state;

  const categoryRaw = action.parameters['category'];
  const category: ConstructionCategory = isConstructionCategory(categoryRaw)
    ? categoryRaw
    : ConstructionCategory.Civic;

  const turnsTotalRaw = action.parameters['turnsTotal'];
  const turnsTotal: number = isNumber(turnsTotalRaw) && turnsTotalRaw > 0
    ? turnsTotalRaw
    : CONSTRUCTION_DEFAULT_TURNS;

  // Deduct upfront resource costs if provided
  const costRaw = action.parameters['resourceCosts'];
  const resources = isPartialResourceCosts(costRaw)
    ? deductResourceCosts(state.resources, costRaw)
    : state.resources;

  const newProject: ConstructionProject = {
    id: `construction-${action.id}`,
    definitionId: projectDefinitionId,
    category,
    targetRegionId: action.targetRegionId,
    turnsRemaining: turnsTotal,
    turnsTotal,
    resourceCostRemaining: {}, // full cost paid upfront; Phase 10 sees nothing to deduct
    effectId,
  };

  return {
    ...state,
    resources,
    constructionProjects: [...state.constructionProjects, newProject],
  };
}

function applyMilitaryOrderEffect(state: GameState, action: QueuedAction): GameState {
  let military = state.military;
  let policies = state.policies;

  const postureChange = action.parameters['postureChange'];
  if (isMilitaryPosture(postureChange)) {
    military = { ...military, deploymentPosture: postureChange };
  }

  // Recruitment stance lives on PolicyState, not MilitaryState, so Phase 5 reads it correctly
  const stanceChange = action.parameters['recruitmentStanceChange'];
  if (isMilitaryRecruitmentStance(stanceChange)) {
    policies = { ...policies, militaryRecruitmentStance: stanceChange };
  }

  const readinessBoost = action.parameters['readinessBoost'];
  if (isNumber(readinessBoost)) {
    military = { ...military, readiness: clamp(military.readiness + readinessBoost, 0, 100) };
  }

  return { ...state, military, policies };
}

function applyTradeActionEffect(state: GameState, action: QueuedAction): GameState {
  const subType = action.parameters['tradeActionType'];
  if (!isString(subType)) return state;

  const targetNeighborId = action.targetNeighborId;

  if (subType === 'initiate_agreement' && targetNeighborId !== null) {
    const newAgreement: DiplomaticAgreement = {
      agreementId: `trade_${action.id}`,
      neighborId: targetNeighborId,
      turnsRemaining: TRADE_AGREEMENT_TURNS,
    };
    const updatedNeighbors = state.diplomacy.neighbors.map((n) =>
      n.id === targetNeighborId
        ? { ...n, activeAgreements: [...n.activeAgreements, newAgreement] }
        : n,
    );
    return { ...state, diplomacy: { ...state.diplomacy, neighbors: updatedNeighbors } };
  }

  if (subType === 'cancel_agreement' && targetNeighborId !== null) {
    const agreementId = action.parameters['agreementId'];
    const updatedNeighbors = state.diplomacy.neighbors.map((n) => {
      if (n.id !== targetNeighborId) return n;
      const filtered = isString(agreementId)
        ? n.activeAgreements.filter((a) => a.agreementId !== agreementId)
        : n.activeAgreements;
      return { ...n, activeAgreements: filtered };
    });
    // Apply relationship penalty for breaking a trade agreement
    const penalizedNeighbors = applyNeighborRelDelta(updatedNeighbors, targetNeighborId, -8);
    return { ...state, diplomacy: { ...state.diplomacy, neighbors: penalizedNeighbors } };
  }

  if (subType === 'economic_stabilization') {
    return {
      ...state,
      treasury: { ...state.treasury, balance: state.treasury.balance + 10 },
    };
  }

  return state;
}

function applyDiplomaticActionEffect(state: GameState, action: QueuedAction): GameState {
  const subType = action.parameters['diplomaticActionType'];
  const targetNeighborId = action.targetNeighborId;
  if (!isString(subType) || targetNeighborId === null) return state;

  const delta = DIPLOMATIC_ACTION_DELTAS[subType] ?? 0;
  let updatedNeighbors = applyNeighborRelDelta(state.diplomacy.neighbors, targetNeighborId, delta);

  // Clear all active agreements and pending proposals when breaking relations
  if (subType === 'break_agreement') {
    updatedNeighbors = updatedNeighbors.map((n) =>
      n.id === targetNeighborId ? { ...n, activeAgreements: [], pendingProposals: [] } : n,
    );
  }

  return { ...state, diplomacy: { ...state.diplomacy, neighbors: updatedNeighbors } };
}

function applyIntelligenceOpEffect(state: GameState, action: QueuedAction): GameState {
  // Phase 5 of turn-resolution.ts resolves intelligence operations from queuedActions.
  // This handler only applies an optional upfront initiation cost if specified.
  const initiationCost = action.parameters['initiationCost'];
  if (isNumber(initiationCost) && initiationCost > 0) {
    return {
      ...state,
      treasury: { ...state.treasury, balance: state.treasury.balance - initiationCost },
    };
  }
  return state;
}

function applyReligiousEdictEffect(state: GameState, action: QueuedAction): GameState {
  const edictType = action.parameters['edictType'];
  if (!isString(edictType)) return state;

  switch (edictType) {
    case 'fund_festival': {
      const treasuryCost = action.parameters['cost'];
      const newBalance = isNumber(treasuryCost)
        ? state.treasury.balance - treasuryCost
        : state.treasury.balance;
      const pop = applyClassSatisfactionDelta(
        state.population,
        PopulationClass.Clergy,
        RELIGIOUS_EDICT_FESTIVAL_CLERGY_SAT_DELTA,
      );
      return {
        ...state,
        treasury: { ...state.treasury, balance: newBalance },
        population: pop,
        faithCulture: {
          ...state.faithCulture,
          faithLevel: clamp(state.faithCulture.faithLevel + RELIGIOUS_EDICT_FESTIVAL_FAITH_DELTA, 0, 100),
        },
      };
    }

    case 'invest_religious_order': {
      if (state.faithCulture.activeOrders.length >= MAX_ACTIVE_RELIGIOUS_ORDERS) return state;
      const orderTypeRaw = action.parameters['orderType'];
      if (!isReligiousOrderType(orderTypeRaw)) return state;
      const newOrder: ReligiousOrder = {
        type: orderTypeRaw,
        isActive: true,
        upkeepPerTurn: RELIGIOUS_ORDER_UPKEEP_PER_TURN,
      };
      return {
        ...state,
        faithCulture: {
          ...state.faithCulture,
          activeOrders: [...state.faithCulture.activeOrders, newOrder],
        },
      };
    }

    case 'address_heterodoxy': {
      const pop = applyClassSatisfactionDelta(
        state.population,
        PopulationClass.Clergy,
        RELIGIOUS_EDICT_HERESY_CLERGY_SAT_DELTA,
      );
      return {
        ...state,
        population: pop,
        faithCulture: {
          ...state.faithCulture,
          heterodoxy: clamp(state.faithCulture.heterodoxy + RELIGIOUS_EDICT_HERESY_DELTA, 0, 100),
        },
      };
    }

    case 'establish_observance': {
      return {
        ...state,
        faithCulture: {
          ...state.faithCulture,
          faithLevel: clamp(state.faithCulture.faithLevel + RELIGIOUS_EDICT_OBSERVANCE_FAITH_DELTA, 0, 100),
          culturalCohesion: clamp(state.faithCulture.culturalCohesion + RELIGIOUS_EDICT_OBSERVANCE_COHESION_DELTA, 0, 100),
        },
      };
    }

    default:
      return state;
  }
}

function applyResearchDirectiveEffect(state: GameState, action: QueuedAction): GameState {
  const focus = state.policies.researchFocus;
  if (focus === null) return state; // no branch focused — directive has no target

  // Allow explicit branch override from parameters
  const branchOverride = action.parameters['branch'];
  const targetBranch = isKnowledgeBranch(branchOverride) ? branchOverride : focus;

  const currentBranch = state.knowledge.branches[targetBranch];
  const updatedBranch = {
    ...currentBranch,
    progressValue: currentBranch.progressValue + RESEARCH_DIRECTIVE_PROGRESS_BURST,
  };

  return {
    ...state,
    treasury: {
      ...state.treasury,
      balance: state.treasury.balance - RESEARCH_DIRECTIVE_TREASURY_COST,
    },
    knowledge: {
      ...state.knowledge,
      branches: { ...state.knowledge.branches, [targetBranch]: updatedBranch },
    },
  };
}

/**
 * Phase 3 — Applies a player decision on a diplomatic overture card.
 * Writes a memory entry on the target neighbor and adjusts relationship
 * score. Keeps the full event-resolution pipeline untouched — overtures
 * are generated synthetically each turn and do not correspond to
 * EVENT_POOL entries.
 */
function applyOvertureDecision(
  state: GameState,
  _eventId: string,
  choiceId: string,
): GameState {
  const parsed = parseOvertureEventId(choiceId);
  if (!parsed) return state;
  const { neighborId, agenda, grant } = parsed;

  const turn = state.turn.turnNumber;
  const relationshipDelta = grant ? 6 : -6;

  let next: GameState = {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      neighbors: state.diplomacy.neighbors.map((n) => {
        if (n.id !== neighborId) return n;
        const nextMemory = recordMemory(n.memory ?? [], {
          turnRecorded: turn,
          type: grant ? 'favor' : 'slight',
          source: grant ? 'overture_granted' : 'overture_denied',
          weight: grant ? 1 : 0.9,
          context: grant ? 'Player granted diplomatic overture' : 'Player denied diplomatic overture',
        });
        const nextScore = Math.max(
          0,
          Math.min(100, n.relationshipScore + relationshipDelta),
        );
        // Reset agenda progress so the same overture does not immediately
        // surface again next turn.
        const nextAgenda = n.agenda
          ? { ...n.agenda, progressValue: Math.max(0, n.agenda.progressValue - 30) }
          : n.agenda;
        return {
          ...n,
          memory: nextMemory,
          relationshipScore: nextScore,
          agenda: nextAgenda,
        };
      }),
    },
  };

  // Grant path records a persistent consequence so future events can gate on
  // the agreement. Deny path nudges narrative pressure axes (authority on the
  // refusal, isolation as the rival retreats). The two paths thus touch
  // distinct state slices so overtures.grant-deny-runtime-parity sees a real
  // mechanical difference.
  if (grant) {
    next = {
      ...next,
      persistentConsequences: [
        ...next.persistentConsequences,
        {
          sourceId: `overture:${neighborId}:${agenda}`,
          sourceType: 'event',
          choiceMade: 'grant',
          turnApplied: turn,
          tag: `overture:${agenda}:granted`,
        },
      ],
    };
  } else {
    const np = next.narrativePressure;
    next = {
      ...next,
      narrativePressure: {
        ...np,
        authority: Math.min(100, np.authority + 2),
        isolation: Math.min(100, np.isolation + 2),
      },
    };
  }

  // Agenda-thematic side effects so the overture body's mechanical keywords
  // (faith, treasury) are reflected in the runtime diff even when the grant
  // path is otherwise diplomatic-only.
  switch (agenda) {
    case RivalAgenda.ReligiousHegemony:
    case RivalAgenda.ConvertThePlayer: {
      // Granting a rival clergy's mission raises heterodoxy; denying it calms
      // faith a touch as the local priesthood reasserts itself.
      const fc = next.faithCulture;
      next = {
        ...next,
        faithCulture: grant
          ? { ...fc, heterodoxy: Math.min(100, fc.heterodoxy + 3) }
          : { ...fc, faithLevel: Math.min(100, fc.faithLevel + 1) },
      };
      break;
    }
    case RivalAgenda.DominateTrade: {
      // Granting trade concessions yields immediate trade revenue; denying
      // costs the player a modest opportunity (spoiled negotiations, reroutes).
      next = {
        ...next,
        treasury: {
          ...next.treasury,
          balance: Math.max(0, next.treasury.balance + (grant ? 20 : -5)),
        },
      };
      break;
    }
    case RivalAgenda.EconomicRecovery: {
      // Easing tolls costs the player treasury; holding them lightly boosts
      // treasury via continued duties.
      next = {
        ...next,
        treasury: {
          ...next.treasury,
          balance: Math.max(0, next.treasury.balance + (grant ? -15 : +5)),
        },
      };
      break;
    }
    case RivalAgenda.SubjugateAVassal: {
      // Granting materialises a vassalage bond between the source rival
      // (overlord) and their resolved target (vassal). Mirrors the
      // negotiation pipeline's payment_tribute → vassalage construction
      // (src/bridge/directEffectApplier.ts buildBondForKind), so the
      // arrangement is queryable by future cards rather than vanishing
      // after the relationship-score nudge.
      if (grant) {
        const source = state.diplomacy.neighbors.find((n) => n.id === neighborId);
        const targetId = source?.agenda?.targetEntityId;
        if (targetId && targetId !== neighborId) {
          next = appendBondToState(
            next,
            createVassalageBond({
              participants: [targetId],
              turn,
              overlord: neighborId,
              tributePerTurn: 25,
            }),
          );
        }
      }
      break;
    }
    default:
      break;
  }

  return next;
}

/**
 * Phase 11 — Applies a player decision on a mediation card. Resolves the
 * underlying inter-rival war (sponsor or back-one-side) and nudges player
 * relationships with both rivals.
 */
function applyMediationDecision(
  state: GameState,
  _eventId: string,
  choiceId: string,
): GameState {
  const parsed = parseMediationChoice(choiceId);
  if (!parsed) return state;
  const { warId, action } = parsed;
  const agreements = state.diplomacy.interRivalAgreements ?? [];
  const war = agreements.find((ag) => ag.id === warId && ag.kind === 'war');
  if (!war) return state;

  const rivalA = war.a;
  const rivalB = war.b;

  if (action === 'stay') {
    return state;
  }

  // Adjust player-vs-rival relationship scores.
  const deltaA =
    action === 'sponsor' ? 8 : action === 'backA' ? 12 : -12;
  const deltaB =
    action === 'sponsor' ? 8 : action === 'backB' ? 12 : -12;

  const nextNeighbors = state.diplomacy.neighbors.map((n) => {
    if (n.id === rivalA) {
      return {
        ...n,
        relationshipScore: clamp(n.relationshipScore + deltaA, 0, 100),
      };
    }
    if (n.id === rivalB) {
      return {
        ...n,
        relationshipScore: clamp(n.relationshipScore + deltaB, 0, 100),
      };
    }
    return n;
  });

  // If sponsoring peace, drop the war agreement and pay gold from treasury.
  let nextAgreements = agreements;
  let nextTreasury = state.treasury;
  if (action === 'sponsor') {
    nextAgreements = agreements.filter((ag) => ag.id !== warId);
    nextTreasury = {
      ...state.treasury,
      balance: state.treasury.balance - 30,
    };
  }

  return {
    ...state,
    treasury: nextTreasury,
    diplomacy: {
      ...state.diplomacy,
      neighbors: nextNeighbors,
      interRivalAgreements: nextAgreements,
    },
  };
}

/**
 * Phase 11 — Applies a player decision on a coalition card. Joining a side
 * bumps the chosen ally's relationship and dings the other rival.
 */
function applyCoalitionDecision(
  state: GameState,
  _eventId: string,
  choiceId: string,
): GameState {
  const parsed = parseCoalitionChoice(choiceId);
  if (!parsed) return state;
  const { pairKey, action } = parsed;
  const [a, b] = pairKey.split('__');
  if (!a || !b) return state;
  if (action === 'decline') return state;

  const ally = action === 'joinA' ? a : b;
  const other = action === 'joinA' ? b : a;

  const nextNeighbors = state.diplomacy.neighbors.map((n) => {
    if (n.id === ally) {
      return {
        ...n,
        relationshipScore: clamp(n.relationshipScore + 15, 0, 100),
      };
    }
    if (n.id === other) {
      return {
        ...n,
        relationshipScore: clamp(n.relationshipScore - 8, 0, 100),
      };
    }
    return n;
  });

  return {
    ...state,
    diplomacy: {
      ...state.diplomacy,
      neighbors: nextNeighbors,
    },
  };
}

function applyCrisisResponseEffect(state: GameState, action: QueuedAction): GameState {
  // Handle storyline branch decisions (parameters contain storylineId + branchPointId).
  const storylineId = action.parameters['storylineId'];
  if (isString(storylineId)) {
    return applyStorylineBranchDecision(state, action);
  }

  // Handle event crisis responses.
  const eventId = action.parameters['eventId'];
  const choiceId = action.parameters['choiceId'];
  if (!isString(eventId) || !isString(choiceId)) return state;

  // Phase 3 — Diplomatic overture decisions bypass EVENT_CHOICE_EFFECTS;
  // effects are applied inline (relationship delta + memory entry).
  if (isOvertureEventId(eventId)) {
    return applyOvertureDecision(state, eventId, choiceId);
  }

  // Phase 11 — Mediation / coalition decisions follow the same inline path.
  if (isMediationEventId(eventId)) {
    return applyMediationDecision(state, eventId, choiceId);
  }
  if (isCoalitionEventId(eventId)) {
    return applyCoalitionDecision(state, eventId, choiceId);
  }

  const event = state.activeEvents.find((e) => e.id === eventId);
  if (!event || event.isResolved) return state;

  // Mark the event resolved.
  const resolvedEvent = { ...event, isResolved: true, choiceMade: choiceId };
  const updatedEvents = state.activeEvents.map((e) =>
    e.id === eventId ? resolvedEvent : e,
  );

  let updatedState = { ...state, activeEvents: updatedEvents };

  // Apply mechanical effects for the player's choice (with outcome variance).
  const eventResult = applyEventChoiceEffects(
    updatedState,
    resolvedEvent,
    EVENT_CHOICE_EFFECTS,
    turnRng(state, `event-choice:${eventId}:${choiceId}`),
  );
  updatedState = eventResult.state;

  // Store outcome quality on the resolved event.
  if (eventResult.outcomeQuality !== null) {
    updatedState = {
      ...updatedState,
      activeEvents: updatedState.activeEvents.map((e) =>
        e.id === eventId ? { ...e, outcomeQuality: eventResult.outcomeQuality } : e,
      ),
    };
  }

  // Record a persistent consequence. The tag string is inlined into the
  // persistentConsequences assignment so the audit's AST writer-reader
  // index can see the `${eventId}:${choiceId}` template-literal shape
  // without chasing the variable assignment.
  const eventChoiceTag = `${event.definitionId}:${choiceId}`;
  updatedState = {
    ...updatedState,
    persistentConsequences: [
      ...updatedState.persistentConsequences,
      {
        sourceId: event.definitionId,
        sourceType: 'event',
        choiceMade: choiceId,
        turnApplied: state.turn.turnNumber,
        tag: `${event.definitionId}:${choiceId}`,
      } satisfies PersistentConsequence,
    ],
  };

  // Create a kingdom feature if this event choice has a registry entry.
  const featureDef = KINGDOM_FEATURE_REGISTRY[eventChoiceTag];
  if (featureDef) {
    const feature: KingdomFeature = {
      id: `kf-${featureDef.featureId}-t${state.turn.turnNumber}`,
      sourceTag: eventChoiceTag,
      turnEstablished: state.turn.turnNumber,
      ongoingEffect: featureDef.ongoingEffect,
      category: featureDef.category,
    };
    updatedState = {
      ...updatedState,
      activeKingdomFeatures: [...updatedState.activeKingdomFeatures, feature],
    };
  }

  // Create a temporary modifier if the choice specifies one.
  const modifierSpec = EVENT_CHOICE_TEMPORARY_MODIFIERS[event.definitionId]?.[choiceId];
  if (modifierSpec) {
    const modifier: TemporaryModifier = {
      id: `tmod-${event.definitionId}-${choiceId}-${rngSuffix(turnRng(state, `tmod:${event.definitionId}:${choiceId}`))}`,
      sourceTag: eventChoiceTag,
      turnsRemaining: modifierSpec.durationTurns,
      turnApplied: state.turn.turnNumber,
      effectPerTurn: modifierSpec.effectPerTurn,
    };
    updatedState = {
      ...updatedState,
      activeTemporaryModifiers: [...updatedState.activeTemporaryModifiers, modifier],
    };
  }

  return updatedState;
}

function applyStorylineBranchDecision(state: GameState, action: QueuedAction): GameState {
  const storylineId = action.parameters['storylineId'];
  const branchPointId = action.parameters['branchPointId'];
  const choiceId = action.parameters['choiceId'];
  if (!isString(storylineId) || !isString(branchPointId) || !isString(choiceId)) return state;

  const storyline = state.activeStorylines.find((s) => s.id === storylineId);
  if (!storyline || storyline.status === StorylineStatus.Resolved) return state;

  // Find the definition from the storyline pool.
  const definition = STORYLINE_POOL.find((d) => d.id === storyline.definitionId);
  if (!definition) return state;

  // Record the branch decision (updates status, branch, countdown).
  const updatedStoryline = recordBranchDecision(
    storyline, branchPointId, choiceId, state.turn.turnNumber, definition,
  );

  const updatedStorylines = state.activeStorylines.map((s) =>
    s.id === storylineId ? updatedStoryline : s,
  );

  let updatedState = { ...state, activeStorylines: updatedStorylines };

  // Apply mechanical effects for the branch choice (with outcome variance).
  const branchResult = applyStorylineBranchEffects(
    updatedState,
    updatedStoryline,
    STORYLINE_CHOICE_EFFECTS,
    turnRng(state, `storyline-branch:${storylineId}:${branchPointId}:${choiceId}`),
  );
  updatedState = branchResult.state;

  // Store outcome quality on the latest branch decision.
  if (branchResult.outcomeQuality !== null) {
    const storyWithQuality = {
      ...updatedStoryline,
      decisionHistory: updatedStoryline.decisionHistory.map((d, i) =>
        i === updatedStoryline.decisionHistory.length - 1
          ? { ...d, outcomeQuality: branchResult.outcomeQuality }
          : d,
      ),
    };
    updatedState = {
      ...updatedState,
      activeStorylines: updatedState.activeStorylines.map((s) =>
        s.id === storylineId ? storyWithQuality : s,
      ),
    };
  }

  // Record persistent consequence.
  const consequence: PersistentConsequence = {
    sourceId: storyline.definitionId,
    sourceType: 'storyline',
    choiceMade: choiceId,
    turnApplied: state.turn.turnNumber,
    tag: `${storyline.definitionId}:${branchPointId}:${choiceId}`,
  };
  updatedState = {
    ...updatedState,
    persistentConsequences: [...updatedState.persistentConsequences, consequence],
  };

  return updatedState;
}

// ============================================================
// Main export — implements ApplyActionEffectsFn
// ============================================================

export function applyActionEffects(
  state: GameState,
  queuedActions: ReadonlyArray<QueuedAction>,
): GameState {
  let current = state;
  for (const action of queuedActions) {
    switch (action.type) {
      case ActionType.Decree:
        current = applyDecreeEffect(current, action);
        break;
      case ActionType.PolicyChange:
        current = applyPolicyChangeEffect(current, action);
        break;
      case ActionType.Construction:
        current = applyConstructionEffect(current, action);
        break;
      case ActionType.MilitaryOrder:
        current = applyMilitaryOrderEffect(current, action);
        break;
      case ActionType.TradeAction:
        current = applyTradeActionEffect(current, action);
        break;
      case ActionType.DiplomaticAction:
        current = applyDiplomaticActionEffect(current, action);
        break;
      case ActionType.IntelligenceOp:
        current = applyIntelligenceOpEffect(current, action);
        break;
      case ActionType.ReligiousEdict:
        current = applyReligiousEdictEffect(current, action);
        break;
      case ActionType.ResearchDirective:
        current = applyResearchDirectiveEffect(current, action);
        break;
      case ActionType.CrisisResponse:
        current = applyCrisisResponseEffect(current, action);
        break;
    }
  }
  return current;
}
