// Phase 5 — Knowledge Screen: research branches, focus selection, and directive issuance.
// Blueprint Reference: ui-blueprint.md §4.11; ux-blueprint.md §4, §6

import React, { useState, useCallback, useContext } from 'react';

import {
  ActionType,
  KnowledgeBranch,
  type GameState,
  type KnowledgeBranchState,
  type QueuedAction,
} from '../../../engine/types';
import {
  KNOWLEDGE_MILESTONE_THRESHOLDS,
  RESEARCH_DIRECTIVE_TREASURY_COST,
  RESEARCH_DIRECTIVE_PROGRESS_BURST,
} from '../../../engine/constants';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import { GameContext } from '../../context/game-context';
import {
  KNOWLEDGE_BRANCH_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import { KNOWLEDGE_BRANCH_DESCRIPTIONS } from '../../../data/text/reports';
import styles from './knowledge.module.css';

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;
function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

function getNextThreshold(milestoneIndex: number): number | null {
  if (milestoneIndex >= KNOWLEDGE_MILESTONE_THRESHOLDS.length) return null;
  return KNOWLEDGE_MILESTONE_THRESHOLDS[milestoneIndex];
}

function getKnowledgeBonus(milestoneIndex: number): string {
  const bonus = Math.min(milestoneIndex * 0.1, 0.5);
  return `+${(bonus * 100).toFixed(0)}%`;
}

function getProgressPercent(state: KnowledgeBranchState): number {
  const threshold = getNextThreshold(state.currentMilestoneIndex);
  if (threshold === null) return 100;
  const prevThreshold =
    state.currentMilestoneIndex > 0
      ? KNOWLEDGE_MILESTONE_THRESHOLDS[state.currentMilestoneIndex - 1]
      : 0;
  const range = threshold - prevThreshold;
  const progress = state.progressValue - prevThreshold;
  return range > 0 ? Math.min(Math.round((progress / range) * 100), 100) : 0;
}

function estimateTurnsToMilestone(
  state: KnowledgeBranchState,
  progressPerTurn: number,
): string {
  const threshold = getNextThreshold(state.currentMilestoneIndex);
  if (threshold === null) return 'Complete';
  if (progressPerTurn <= 0) return 'Stalled';
  const remaining = threshold - state.progressValue;
  if (remaining <= 0) return 'Imminent';
  return `~${Math.ceil(remaining / progressPerTurn)} months`;
}

// ============================================================
// Knowledge Screen
// ============================================================

export function Knowledge() {
  const kingdom = useKingdomState();
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const ctx = useContext(GameContext);

  const knowledgeState = kingdom.knowledge;
  const researchFocus = kingdom.policies.researchFocus;
  const [expandedBranch, setExpandedBranch] = useState<KnowledgeBranch | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [policyChangeUsed, setPolicyChangeUsed] = useState(
    kingdom.actionBudget.policyChangesUsedThisTurn > 0,
  );

  const canIssueDirective = !isBudgetExhausted && slotsRemaining >= 2;
  const canChangeFocus = !policyChangeUsed && kingdom.actionBudget.policyChangesUsedThisTurn === 0;

  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  // ---- Set Research Focus (PolicyChange, free) ----

  const handleSetFocus = useCallback(
    (branch: KnowledgeBranch | null) => {
      if (!ctx) return;

      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.PolicyChange,
        actionDefinitionId: `policy_researchFocus`,
        slotCost: 0,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: { policyKey: 'researchFocus', newValue: branch },
      };

      const error = queueAction(action);
      if (error) {
        showError(BUDGET_ERROR_LABELS[error.code] ?? 'Focus could not be changed.');
        return;
      }

      // Immediately reflect the policy change in game state
      ctx.dispatch({
        type: 'UPDATE_GAME_STATE',
        updater: (state: GameState) => ({
          ...state,
          policies: {
            ...state.policies,
            researchFocus: branch,
            policyChangedThisTurn: true,
          },
        }),
      });
      setPolicyChangeUsed(true);
    },
    [ctx, queueAction, showError],
  );

  // ---- Issue Research Directive (ResearchDirective, 2 slots) ----

  const handleIssueDirective = useCallback(() => {
    if (!researchFocus) return;

    const action: QueuedAction = {
      id: generateActionId(),
      type: ActionType.ResearchDirective,
      actionDefinitionId: `research_directive_${researchFocus}`,
      slotCost: 2,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: { branch: researchFocus },
    };

    const error = queueAction(action);
    if (error) {
      showError(BUDGET_ERROR_LABELS[error.code] ?? 'Directive could not be issued.');
    }
  }, [researchFocus, queueAction, showError]);

  return (
    <div className={styles.screen}>
      {/* Research Summary */}
      <section>
        <h2 className={styles.sectionLabel}>Research Summary</h2>
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Current Focus</span>
            <span className={styles.summaryValue}>
              {researchFocus
                ? KNOWLEDGE_BRANCH_LABELS[researchFocus]
                : 'No research focus set'}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Progress Rate</span>
            <span className={styles.summaryValue}>
              {knowledgeState.progressPerTurn} points / month
            </span>
          </div>
          {researchFocus && (
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Next Milestone</span>
              <span className={styles.summaryValue}>
                {estimateTurnsToMilestone(
                  knowledgeState.branches[researchFocus],
                  knowledgeState.progressPerTurn,
                )}
              </span>
            </div>
          )}
        </div>

        {/* Research Directive */}
        <div className={styles.directiveSection}>
          {researchFocus ? (
            <>
              <button
                className={styles.directiveButton}
                disabled={!canIssueDirective}
                onClick={handleIssueDirective}
              >
                Issue Research Directive
                <span className={styles.slotCost}>2 slots</span>
              </button>
              <span className={styles.directiveCost}>
                +{RESEARCH_DIRECTIVE_PROGRESS_BURST} points in {KNOWLEDGE_BRANCH_LABELS[researchFocus]} —
                costs {RESEARCH_DIRECTIVE_TREASURY_COST} coin
              </span>
              {!canIssueDirective && slotsRemaining < 2 && (
                <span className={styles.directiveNote}>
                  Requires 2 action slots remaining.
                </span>
              )}
            </>
          ) : (
            <p className={styles.directiveNote}>
              Set a research focus to enable research directives.
            </p>
          )}
        </div>
      </section>

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Branch Cards */}
      <section>
        <h2 className={styles.sectionLabel}>Knowledge Branches</h2>
        <div className={styles.branchGrid}>
          {Object.values(KnowledgeBranch).map((branch) => {
            const branchState = knowledgeState.branches[branch];
            const isFocused = researchFocus === branch;
            const isExpanded = expandedBranch === branch;
            const progressPct = getProgressPercent(branchState);
            const nextThreshold = getNextThreshold(branchState.currentMilestoneIndex);
            const isComplete = nextThreshold === null;

            return (
              <div
                key={branch}
                className={styles.branchCard}
                data-focused={isFocused ? 'true' : 'false'}
                data-expanded={isExpanded ? 'true' : 'false'}
                data-complete={isComplete ? 'true' : 'false'}
              >
                {/* Clickable summary area */}
                <div
                  className={styles.branchSummary}
                  onClick={() => setExpandedBranch(isExpanded ? null : branch)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${KNOWLEDGE_BRANCH_LABELS[branch]} — ${branchState.currentMilestoneIndex} of ${KNOWLEDGE_MILESTONE_THRESHOLDS.length} milestones`}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedBranch(isExpanded ? null : branch);
                    }
                  }}
                >
                  {/* Header */}
                  <div className={styles.branchHeader}>
                    <span className={styles.branchName}>
                      {KNOWLEDGE_BRANCH_LABELS[branch]}
                    </span>
                    {isFocused && (
                      <span className={styles.focusBadge}>Active</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>
                      Milestone {branchState.currentMilestoneIndex} /{' '}
                      {KNOWLEDGE_MILESTONE_THRESHOLDS.length}
                    </span>
                    <span className={styles.progressBonus}>
                      {getKnowledgeBonus(branchState.currentMilestoneIndex)}
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      data-focused={isFocused ? 'true' : 'false'}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  {!isComplete && (
                    <span className={styles.progressDetail}>
                      {branchState.progressValue} / {nextThreshold} points
                    </span>
                  )}
                  {isComplete && (
                    <span className={styles.completeLabel}>
                      All milestones achieved
                    </span>
                  )}
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className={styles.branchDetail}>
                    <div className={styles.detailSection}>
                      <span className={styles.detailTitle}>Description</span>
                      <p className={styles.detailText}>
                        {KNOWLEDGE_BRANCH_DESCRIPTIONS[branch]}
                      </p>
                    </div>
                    <div className={styles.detailSection}>
                      <span className={styles.detailTitle}>
                        Advancements Unlocked ({branchState.unlockedAdvancements.length})
                      </span>
                      {branchState.unlockedAdvancements.length === 0 ? (
                        <p className={styles.detailText}>
                          No advancements yet. Focus research on this branch to
                          begin unlocking milestones.
                        </p>
                      ) : (
                        <ul className={styles.advancementList}>
                          {branchState.unlockedAdvancements.map((adv) => (
                            <li key={adv} className={styles.advancementItem}>
                              {adv}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Research Focus Actions */}
                    <div className={styles.focusActions}>
                      {isFocused ? (
                        <button
                          className={styles.clearFocusButton}
                          disabled={!canChangeFocus}
                          onClick={() => handleSetFocus(null)}
                          title="Remove research focus (policy change — 1 per turn)"
                        >
                          Clear Research Focus
                        </button>
                      ) : (
                        <button
                          className={styles.focusButton}
                          disabled={!canChangeFocus || isComplete}
                          onClick={() => handleSetFocus(branch)}
                          title="Direct research investment to this branch (policy change — 1 per turn)"
                        >
                          Set as Research Focus
                        </button>
                      )}
                      {!canChangeFocus && (
                        <span className={styles.focusNote}>
                          Policy change already used this turn.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
