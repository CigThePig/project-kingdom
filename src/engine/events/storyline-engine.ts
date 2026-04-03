// gameplay-blueprint.md §8 — Storyline System
// Pure engine logic for storyline activation, branch progression, and resolution.
// No React imports. No player-facing text.

import {
  ActiveStoryline,
  DiplomaticPosture,
  GameState,
  KnowledgeBranch,
  PopulationClass,
  StorylineCategory,
  StorylineStatus,
  StorylineBranchDecision,
} from '../types';
import {
  MAX_ACTIVE_STORYLINES,
  MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS,
} from '../constants';

// ============================================================
// Data Contract Interfaces (fulfilled by Phase 5 data layer)
// ============================================================

/**
 * A single activation condition that must evaluate to true for a storyline
 * to become eligible. All conditions in StorylineDefinition.activationConditions
 * must pass simultaneously.
 */
export interface StorylineActivationCondition {
  type:
    | 'turn_min'
    | 'turn_max'
    | 'treasury_above'
    | 'treasury_below'
    | 'stability_above'
    | 'stability_below'
    | 'class_satisfaction_above'
    | 'class_satisfaction_below'
    | 'faith_above'
    | 'faith_below'
    | 'diplomatic_posture_with'
    | 'knowledge_branch_milestone'
    | 'random_chance';
  /** Numeric threshold for above/below condition types. */
  threshold?: number;
  /** Required for class_satisfaction_* conditions. */
  classTarget?: PopulationClass;
  /** Required for diplomatic_posture_with: neighbor to check. */
  neighborId?: string;
  /** Required for diplomatic_posture_with: minimum required posture. */
  posture?: DiplomaticPosture;
  /** Required for knowledge_branch_milestone. */
  branch?: KnowledgeBranch;
  /** Required for knowledge_branch_milestone: minimum milestone index unlocked. */
  minMilestoneIndex?: number;
  /** Required for random_chance: probability 0–1. */
  probability?: number;
}

/**
 * A single player choice at a branch point.
 * Consequence text and mechanical effects live in the data layer.
 */
export interface StorylineBranchChoiceDefinition {
  choiceId: string;
  /**
   * The branchId the storyline moves to after this choice.
   * Null means this choice leads directly to the resolution branch.
   */
  nextBranchId: string | null;
  /** Turns to wait in Dormant-equivalent state before the next branch point fires. */
  turnsUntilNextBranchPoint: number;
}

/**
 * A single decision moment within a storyline.
 */
export interface StorylineBranchPointDefinition {
  branchId: string;
  /**
   * When true, this branch closes the storyline.
   * The engine sets status to Resolved after a decision is recorded here.
   */
  isResolutionBranch: boolean;
  choices: StorylineBranchChoiceDefinition[];
}

/**
 * The authoritative definition of a storyline arc.
 * Instances (ActiveStoryline) are created at runtime when activation conditions are met.
 */
export interface StorylineDefinition {
  id: string;
  category: StorylineCategory;
  /** All conditions must pass for this storyline to become eligible for activation. */
  activationConditions: StorylineActivationCondition[];
  /** The branchId of the opening branch point (the first decision the player faces). */
  openingBranchId: string;
  branches: StorylineBranchPointDefinition[];
  /**
   * Turns to wait after activation before the first branch point fires.
   * During this period the storyline is Active but awaiting player decision.
   */
  initialTurnsUntilFirstBranchPoint: number;
}

// ============================================================
// Internal Helpers
// ============================================================

/** Posture comparison: returns true when actual is at least as friendly as required. */
const POSTURE_RANK: Record<DiplomaticPosture, number> = {
  War: 0,
  Hostile: 1,
  Tense: 2,
  Neutral: 3,
  Friendly: 4,
};

function evaluateActivationCondition(
  condition: StorylineActivationCondition,
  state: GameState,
  turnNumber: number,
): boolean {
  switch (condition.type) {
    case 'turn_min':
      return condition.threshold !== undefined && turnNumber >= condition.threshold;

    case 'turn_max':
      return condition.threshold !== undefined && turnNumber <= condition.threshold;

    case 'treasury_above':
      return condition.threshold !== undefined && state.treasury.balance > condition.threshold;

    case 'treasury_below':
      return condition.threshold !== undefined && state.treasury.balance < condition.threshold;

    case 'stability_above':
      return condition.threshold !== undefined && state.stability.value > condition.threshold;

    case 'stability_below':
      return condition.threshold !== undefined && state.stability.value < condition.threshold;

    case 'class_satisfaction_above':
      if (condition.threshold === undefined || condition.classTarget === undefined) return false;
      return state.population[condition.classTarget].satisfaction > condition.threshold;

    case 'class_satisfaction_below':
      if (condition.threshold === undefined || condition.classTarget === undefined) return false;
      return state.population[condition.classTarget].satisfaction < condition.threshold;

    case 'faith_above':
      return (
        condition.threshold !== undefined && state.faithCulture.faithLevel > condition.threshold
      );

    case 'faith_below':
      return (
        condition.threshold !== undefined && state.faithCulture.faithLevel < condition.threshold
      );

    case 'diplomatic_posture_with': {
      if (!condition.neighborId || !condition.posture) return false;
      const neighbor = state.diplomacy.neighbors.find((n) => n.id === condition.neighborId);
      if (!neighbor) return false;
      return POSTURE_RANK[neighbor.attitudePosture] >= POSTURE_RANK[condition.posture];
    }

    case 'knowledge_branch_milestone': {
      if (!condition.branch || condition.minMilestoneIndex === undefined) return false;
      const branchState = state.knowledge.branches[condition.branch];
      return branchState.currentMilestoneIndex >= condition.minMilestoneIndex;
    }

    case 'random_chance':
      return condition.probability !== undefined && Math.random() < condition.probability;

    default:
      return false;
  }
}

function allActivationConditionsPass(
  definition: StorylineDefinition,
  state: GameState,
  turnNumber: number,
): boolean {
  return definition.activationConditions.every((c) =>
    evaluateActivationCondition(c, state, turnNumber),
  );
}

/**
 * Weights a candidate storyline by relevance to current kingdom pressures.
 * Higher weight = more likely to be selected when multiple storylines qualify.
 * Each category maps to a state signal that indicates player relevance.
 */
function storylineRelevanceWeight(definition: StorylineDefinition, state: GameState): number {
  switch (definition.category) {
    case StorylineCategory.Political:
      // More relevant when nobility intrigue risk is elevated.
      return 1 + (state.population[PopulationClass.Nobility].intrigueRisk ?? 0) / 100;

    case StorylineCategory.Religious:
      // More relevant when faith is stressed or heterodoxy is rising.
      return 1 + state.faithCulture.heterodoxy / 100;

    case StorylineCategory.Military: {
      // More relevant when military readiness is low or posture is elevated.
      const readinessStress = (100 - state.military.readiness) / 100;
      return 1 + readinessStress;
    }

    case StorylineCategory.TradeEcon:
      // More relevant when merchant satisfaction is low.
      return 1 + (100 - state.population[PopulationClass.Merchants].satisfaction) / 100;

    case StorylineCategory.Discovery:
      // More relevant when knowledge progress is advancing (any branch has milestones).
      {
        const maxMilestone = Math.max(
          ...Object.values(state.knowledge.branches).map((b) => b.currentMilestoneIndex),
        );
        return 1 + maxMilestone * 0.3;
      }

    case StorylineCategory.Cultural:
      // More relevant when cultural cohesion is stressed.
      return 1 + (100 - state.faithCulture.culturalCohesion) / 100;

    default:
      return 1;
  }
}

function buildActiveStoryline(
  definition: StorylineDefinition,
  turnNumber: number,
): ActiveStoryline {
  const id = `sl-${definition.id}-t${turnNumber}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    definitionId: definition.id,
    category: definition.category,
    status: StorylineStatus.Active,
    currentBranchId: definition.openingBranchId,
    decisionHistory: [],
    turnActivated: turnNumber,
    turnsUntilNextBranchPoint: definition.initialTurnsUntilFirstBranchPoint,
  };
}

// ============================================================
// Exported Functions
// ============================================================

/**
 * Evaluates the storyline pool against current state and returns any newly
 * activated storylines to add this turn.
 *
 * Selection rules (§8.3):
 * - At most MAX_ACTIVE_STORYLINES may be active simultaneously.
 * - At least MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS must have elapsed since
 *   the last activation (checked via lastActivationTurn).
 * - Storylines whose definitionId is already active or resolved (in
 *   resolvedStorylineIds) are excluded.
 * - Avoids repeating a StorylineCategory already resolved in this run.
 * - Among remaining candidates, selection is weighted by category relevance
 *   to current kingdom pressures.
 */
export function evaluateStorylinePool(
  state: GameState,
  turnNumber: number,
  storylinePool: StorylineDefinition[],
  activeStorylines: ActiveStoryline[],
  resolvedStorylineIds: string[],
  lastActivationTurn: number,
): ActiveStoryline[] {
  if (storylinePool.length === 0) return [];
  if (activeStorylines.length >= MAX_ACTIVE_STORYLINES) return [];
  if (turnNumber - lastActivationTurn < MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS) return [];

  const availableSlots = MAX_ACTIVE_STORYLINES - activeStorylines.length;
  const activeDefinitionIds = new Set(activeStorylines.map((s) => s.definitionId));
  const resolvedSet = new Set(resolvedStorylineIds);

  // Categories already fully resolved in this run — avoid repetition.
  const resolvedCategories = new Set<StorylineCategory>(
    storylinePool
      .filter((def) => resolvedSet.has(def.id))
      .map((def) => def.category),
  );

  const candidates = storylinePool.filter(
    (def) =>
      !activeDefinitionIds.has(def.id) &&
      !resolvedSet.has(def.id) &&
      !resolvedCategories.has(def.category) &&
      allActivationConditionsPass(def, state, turnNumber),
  );

  if (candidates.length === 0) return [];

  // Weighted selection: build a weighted list and pick without replacement.
  const weighted = candidates.map((def) => ({
    def,
    weight: storylineRelevanceWeight(def, state),
  }));

  const selected: ActiveStoryline[] = [];

  for (let i = 0; i < availableSlots && weighted.length > 0; i++) {
    const totalWeight = weighted.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    let pickedIndex = 0;
    for (let j = 0; j < weighted.length; j++) {
      roll -= weighted[j].weight;
      if (roll <= 0) {
        pickedIndex = j;
        break;
      }
    }
    selected.push(buildActiveStoryline(weighted[pickedIndex].def, turnNumber));
    // Remove selected from weighted pool and exclude its category.
    const pickedCategory = weighted[pickedIndex].def.category;
    weighted.splice(pickedIndex, 1);
    // Filter out same-category candidates to preserve variety.
    for (let j = weighted.length - 1; j >= 0; j--) {
      if (weighted[j].def.category === pickedCategory) {
        weighted.splice(j, 1);
      }
    }
  }

  return selected;
}

/**
 * Decrements turnsUntilNextBranchPoint by 1 for each Active storyline.
 * When the counter reaches 0 the branch point is ready for player input
 * (status remains Active — the UI surfaces it for decision).
 * Resolved storylines pass through unchanged.
 *
 * Returns a new array (immutable update).
 */
export function advanceStorylines(activeStorylines: ActiveStoryline[]): ActiveStoryline[] {
  return activeStorylines.map((storyline) => {
    if (storyline.status === StorylineStatus.Resolved) return storyline;
    if (storyline.turnsUntilNextBranchPoint === null) return storyline;
    if (storyline.turnsUntilNextBranchPoint <= 0) return storyline; // already at branch point

    return {
      ...storyline,
      turnsUntilNextBranchPoint: storyline.turnsUntilNextBranchPoint - 1,
    };
  });
}

/**
 * Records a player's branch decision and configures the next branch point.
 *
 * Updates:
 * - Appends to decisionHistory.
 * - Sets currentBranchId to the next branch from the chosen option.
 * - Sets turnsUntilNextBranchPoint from the choice definition.
 * - If the chosen option leads to the resolution branch, sets status = Resolved
 *   and turnsUntilNextBranchPoint = null.
 *
 * Throws if branchPointId or choiceId are not found in the definition.
 */
export function recordBranchDecision(
  storyline: ActiveStoryline,
  branchPointId: string,
  choiceId: string,
  turnNumber: number,
  definition: StorylineDefinition,
): ActiveStoryline {
  const branch = definition.branches.find((b) => b.branchId === branchPointId);
  if (!branch) {
    throw new Error(
      `recordBranchDecision: branchPointId "${branchPointId}" not found in storyline "${definition.id}"`,
    );
  }

  const choice = branch.choices.find((c) => c.choiceId === choiceId);
  if (!choice) {
    throw new Error(
      `recordBranchDecision: choiceId "${choiceId}" not found in branch "${branchPointId}" of storyline "${definition.id}"`,
    );
  }

  const newDecision: StorylineBranchDecision = {
    branchPointId,
    choiceId,
    turnNumber,
  };

  // Determine if the chosen path leads to the resolution branch.
  const nextBranch = choice.nextBranchId
    ? definition.branches.find((b) => b.branchId === choice.nextBranchId)
    : null;

  const leadsToResolution = branch.isResolutionBranch || nextBranch?.isResolutionBranch === true;

  return {
    ...storyline,
    status: leadsToResolution ? StorylineStatus.Resolved : StorylineStatus.Active,
    currentBranchId: choice.nextBranchId ?? branchPointId,
    decisionHistory: [...storyline.decisionHistory, newDecision],
    turnsUntilNextBranchPoint: leadsToResolution ? null : choice.turnsUntilNextBranchPoint,
  };
}

/**
 * Returns true when the storyline has been fully resolved (no remaining branch points).
 * A storyline is resolved when its status is Resolved or when its currentBranchId
 * points to a resolution branch in the definition.
 */
export function isStorylineResolved(
  storyline: ActiveStoryline,
  definition: StorylineDefinition,
): boolean {
  if (storyline.status === StorylineStatus.Resolved) return true;
  const currentBranch = definition.branches.find(
    (b) => b.branchId === storyline.currentBranchId,
  );
  return currentBranch?.isResolutionBranch === true;
}
