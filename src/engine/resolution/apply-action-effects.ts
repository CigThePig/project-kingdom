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
  KnowledgeBranch,
  MilitaryPosture,
  MilitaryRecruitmentStance,
  PersistentConsequence,
  PopulationClass,
  QueuedAction,
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
import { STORYLINE_CHOICE_EFFECTS } from '../../data/storylines/effects';
import { STORYLINE_POOL } from '../../data/storylines/index';
import { applyDiplomaticActionEffect as applyNeighborRelDelta } from '../systems/diplomacy';
import { applyEventChoiceEffects, applyStorylineBranchEffects } from '../events/apply-event-effects';
import { recordBranchDecision } from '../events/storyline-engine';
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

const DECREE_EFFECT_REGISTRY = new Map<string, DecreeEffectFn>([
  // --- Market Chain ---
  ['market_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.market_charter)],
  ['trade_guild_expansion', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_guild_expansion)],
  ['merchant_republic_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.merchant_republic_charter)],
  // --- Trade Chain ---
  ['trade_subsidies', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_subsidies)],
  ['trade_monopoly', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_monopoly)],
  ['international_trade_empire', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.international_trade_empire)],
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
  ['general_mobilization', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.general_mobilization)],
  // --- Roads Chain ---
  ['road_improvement', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.road_improvement)],
  ['provincial_highway_system', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.provincial_highway_system)],
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
  ['permanent_embassy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.permanent_embassy)],
  ['diplomatic_supremacy', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.diplomatic_supremacy)],
  // --- Trade Agreement ---
  ['trade_agreement', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.trade_agreement)],
  // --- Marriage Chain ---
  ['royal_marriage', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.royal_marriage)],
  ['dynasty_alliance', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.dynasty_alliance)],
  ['imperial_confederation', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.imperial_confederation)],
  // --- Granary Chain ---
  ['public_granary', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.public_granary)],
  ['regional_food_distribution', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.regional_food_distribution)],
  ['kingdom_breadbasket', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.kingdom_breadbasket)],
  // --- Labor Chain ---
  ['labor_rights', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.labor_rights)],
  ['workers_guild_charter', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.workers_guild_charter)],
  ['social_contract', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.social_contract)],
  // --- Land Redistribution ---
  ['land_redistribution', (state, action) => applyFullDecreeDeltas(state, action, DECREE_EFFECTS.land_redistribution)],
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

  return {
    ...stateAfterEffects,
    issuedDecrees: [...stateAfterEffects.issuedDecrees, issuedRecord],
  };
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
      agreementId: `trade-${action.id}`,
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

  const event = state.activeEvents.find((e) => e.id === eventId);
  if (!event || event.isResolved) return state;

  // Mark the event resolved.
  const resolvedEvent = { ...event, isResolved: true, choiceMade: choiceId };
  const updatedEvents = state.activeEvents.map((e) =>
    e.id === eventId ? resolvedEvent : e,
  );

  let updatedState = { ...state, activeEvents: updatedEvents };

  // Apply mechanical effects for the player's choice (with outcome variance).
  const eventResult = applyEventChoiceEffects(updatedState, resolvedEvent, EVENT_CHOICE_EFFECTS);
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

  // Record a persistent consequence.
  const consequence: PersistentConsequence = {
    sourceId: event.definitionId,
    sourceType: 'event',
    choiceMade: choiceId,
    turnApplied: state.turn.turnNumber,
    tag: `${event.definitionId}:${choiceId}`,
  };
  updatedState = {
    ...updatedState,
    persistentConsequences: [...updatedState.persistentConsequences, consequence],
  };

  // Create a temporary modifier if the choice specifies one.
  const modifierSpec = EVENT_CHOICE_TEMPORARY_MODIFIERS[event.definitionId]?.[choiceId];
  if (modifierSpec) {
    const modifier: TemporaryModifier = {
      id: `tmod-${event.definitionId}-${choiceId}-${Math.random().toString(36).slice(2, 8)}`,
      sourceTag: consequence.tag,
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
  const branchResult = applyStorylineBranchEffects(updatedState, updatedStoryline, STORYLINE_CHOICE_EFFECTS);
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
