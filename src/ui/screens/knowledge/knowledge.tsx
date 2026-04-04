// Phase 12 — Knowledge Screen: research branches and advancement tree.
// Blueprint Reference: ui-blueprint.md §4.11; ux-blueprint.md §6

import { useState } from 'react';

import {
  KnowledgeBranch,
  type KnowledgeBranchState,
} from '../../../engine/types';
import { KNOWLEDGE_MILESTONE_THRESHOLDS } from '../../../engine/constants';
import { useKingdomState } from '../../hooks/use-game-state';
import { KNOWLEDGE_BRANCH_LABELS } from '../../../data/text/labels';
import { KNOWLEDGE_BRANCH_DESCRIPTIONS } from '../../../data/text/reports';
import styles from './knowledge.module.css';

// ============================================================
// Helpers
// ============================================================

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
  if (threshold === null) return 100; // all milestones unlocked
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
  const knowledgeState = kingdom.knowledge;
  const researchFocus = kingdom.policies.researchFocus;
  const [expandedBranch, setExpandedBranch] = useState<KnowledgeBranch | null>(
    null,
  );

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
      </section>

      {/* Branch Cards */}
      <section>
        <h2 className={styles.sectionLabel}>Knowledge Branches</h2>
        <div className={styles.branchGrid}>
          {Object.values(KnowledgeBranch).map((branch) => {
            const branchState = knowledgeState.branches[branch];
            const isFocused = researchFocus === branch;
            const isExpanded = expandedBranch === branch;
            const progressPct = getProgressPercent(branchState);
            const nextThreshold = getNextThreshold(
              branchState.currentMilestoneIndex,
            );
            const isComplete = nextThreshold === null;

            return (
              <div
                key={branch}
                className={styles.branchCard}
                data-focused={isFocused ? 'true' : 'false'}
                data-expanded={isExpanded ? 'true' : 'false'}
                data-complete={isComplete ? 'true' : 'false'}
                onClick={() =>
                  setExpandedBranch(isExpanded ? null : branch)
                }
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${KNOWLEDGE_BRANCH_LABELS[branch]} — ${branchState.currentMilestoneIndex} of ${KNOWLEDGE_MILESTONE_THRESHOLDS.length} milestones`}
                onKeyDown={(e) => {
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
