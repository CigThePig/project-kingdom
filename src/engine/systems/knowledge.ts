// gameplay-blueprint.md §4.13 — Knowledge and Advancement
// Pure engine logic for research progress accumulation and milestone unlocks.
// No React imports. No player-facing text.

import { KnowledgeBranch, KnowledgeBranchState, KnowledgeState } from '../types';
import {
  KNOWLEDGE_BASE_PROGRESS_PER_TURN,
  KNOWLEDGE_INFRASTRUCTURE_BONUS,
  KNOWLEDGE_MILESTONE_THRESHOLDS,
  KNOWLEDGE_SCHOLARLY_CLERGY_ORDER_BONUS,
  KNOWLEDGE_TREASURY_INVESTMENT_RATE,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Maximum number of milestones per branch (defined by KNOWLEDGE_MILESTONE_THRESHOLDS length).
const MAX_MILESTONE_INDEX = KNOWLEDGE_MILESTONE_THRESHOLDS.length;

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Calculates research progress points earned this turn for the focused branch.
 *
 * Formula (§4.13):
 *   progress = BASE_PER_TURN
 *              + treasuryBalance × TREASURY_INVESTMENT_RATE
 *              + (scholarlyOrderActive ? SCHOLARLY_ORDER_BONUS : 0)
 *              + (hasResearchInfrastructure ? INFRASTRUCTURE_BONUS : 0)
 *
 * - Returns 0 when researchFocus is null (no active research direction).
 * - Base progress ensures even un-invested branches see minimal accumulation.
 * - Treasury investment converts financial capacity into research output.
 * - Scholarly orders (§4.8) and research buildings (§4.12) provide flat bonuses.
 */
export function calculateResearchProgressThisTurn(
  researchFocus: KnowledgeBranch | null,
  treasuryBalance: number,
  scholarlyOrderActive: boolean,
  hasResearchInfrastructure: boolean,
): number {
  if (researchFocus === null) return 0;

  const treasuryBonus = clamp(treasuryBalance * KNOWLEDGE_TREASURY_INVESTMENT_RATE, 0, 40);
  const scholarlyBonus = scholarlyOrderActive ? KNOWLEDGE_SCHOLARLY_CLERGY_ORDER_BONUS : 0;
  const infraBonus = hasResearchInfrastructure ? KNOWLEDGE_INFRASTRUCTURE_BONUS : 0;

  return KNOWLEDGE_BASE_PROGRESS_PER_TURN + treasuryBonus + scholarlyBonus + infraBonus;
}

/**
 * Returns true when the branch has accumulated enough progress to reach its next milestone.
 * Returns false when all milestones have already been unlocked.
 */
export function checkMilestoneUnlock(branchState: KnowledgeBranchState): boolean {
  const nextIndex = branchState.currentMilestoneIndex;
  if (nextIndex >= MAX_MILESTONE_INDEX) return false; // all milestones already reached
  const threshold = KNOWLEDGE_MILESTONE_THRESHOLDS[nextIndex];
  return branchState.progressValue >= threshold;
}

/**
 * Returns the knowledge bonus multiplier for a given branch state.
 * Used by other systems (food, military, trade, faith, population) to
 * apply efficiency improvements from research milestones.
 *
 * Formula: currentMilestoneIndex × 0.1
 * Range: 0.0 (no milestones) → 0.5 (all 5 milestones unlocked)
 */
export function getKnowledgeBonusForBranch(branchState: KnowledgeBranchState): number {
  return clamp(branchState.currentMilestoneIndex * 0.1, 0, 0.5);
}

// ============================================================
// Exported State Updaters
// ============================================================

/**
 * Advances a branch past its current milestone threshold.
 * Increments currentMilestoneIndex and appends the advancement ID.
 * The advancementId is provided by the data layer (passed by resolution engine).
 * Returns a new KnowledgeBranchState (immutable update).
 */
export function applyMilestoneUnlock(
  branchState: KnowledgeBranchState,
  advancementId: string,
): KnowledgeBranchState {
  const newMilestoneIndex = branchState.currentMilestoneIndex + 1;
  return {
    ...branchState,
    currentMilestoneIndex: newMilestoneIndex,
    unlockedAdvancements: [...branchState.unlockedAdvancements, advancementId],
  };
}

/**
 * Applies one turn of research progress to the focused branch in KnowledgeState.
 * If researchFocus is null, returns state unchanged.
 * Does NOT apply milestone unlocks — the caller checks checkMilestoneUnlock separately.
 * Returns a new KnowledgeState (immutable update).
 */
export function applyKnowledgeProgress(
  current: KnowledgeState,
  progressThisTurn: number,
): KnowledgeState {
  if (current.researchFocus === null) {
    return { ...current, progressPerTurn: 0 };
  }

  const focusBranch = current.researchFocus;
  const currentBranch = current.branches[focusBranch];
  const updatedBranch: KnowledgeBranchState = {
    ...currentBranch,
    progressValue: currentBranch.progressValue + progressThisTurn,
  };

  return {
    ...current,
    progressPerTurn: progressThisTurn,
    branches: {
      ...current.branches,
      [focusBranch]: updatedBranch,
    },
  };
}

// ============================================================
// Exported Convenience Accessors
// ============================================================

/**
 * Returns the Agricultural knowledge bonus for use by food.ts.
 * Caller extracts this from KnowledgeState before passing to calculateFoodProduction.
 */
export function getAgriculturalBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.Agricultural]);
}

/**
 * Returns the Military knowledge bonus for use by military.ts.
 */
export function getMilitaryBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.Military]);
}

/**
 * Returns the Maritime/Trade knowledge bonus for use by trade.ts.
 */
export function getTradeBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.MaritimeTrade]);
}

/**
 * Returns the Cultural/Scholarly knowledge bonus for use by faith.ts.
 */
export function getCulturalBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.CulturalScholarly]);
}

/**
 * Returns the Civic knowledge bonus for use by population.ts (governance efficiency).
 */
export function getCivicBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.Civic]);
}

/**
 * Returns the Natural Philosophy bonus (resource processing, engineering).
 */
export function getNaturalPhilosophyBonus(knowledge: KnowledgeState): number {
  return getKnowledgeBonusForBranch(knowledge.branches[KnowledgeBranch.NaturalPhilosophy]);
}
