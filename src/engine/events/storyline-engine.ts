// gameplay-blueprint.md §8 — Storyline System
// Pure engine logic for storyline activation, branch progression, and resolution.
// No React imports. No player-facing text.

import {
  ActiveStoryline,
  StorylineActivationProfile,
  StorylineCategory,
  StorylineStatus,
  StorylineBranchDecision,
} from '../types';

// ============================================================
// Data Contract Interfaces (fulfilled by Phase 5 data layer)
// ============================================================

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
  /** Narrative pressure activation profile — replaces legacy activationConditions. */
  activationProfile: StorylineActivationProfile;
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

export function buildActiveStoryline(
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
    outcomeQuality: null, // set by caller after variance roll
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
