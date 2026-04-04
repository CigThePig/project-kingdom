// Phase 8 — Knowledge Screen: visual tree layout with milestone nodes.
// Blueprint Reference: ui-blueprint.md §4.11; ux-blueprint.md §4, §6

import React, { useState, useCallback, useContext, useRef, useEffect } from 'react';

import {
  ActionType,
  KnowledgeBranch,
  ReligiousOrderType,
  type GameState,
  type KnowledgeBranchState,
  type QueuedAction,
} from '../../../engine/types';
import {
  KNOWLEDGE_MILESTONE_THRESHOLDS,
  KNOWLEDGE_BASE_PROGRESS_PER_TURN,
  KNOWLEDGE_TREASURY_INVESTMENT_RATE,
  KNOWLEDGE_SCHOLARLY_CLERGY_ORDER_BONUS,
  KNOWLEDGE_INFRASTRUCTURE_BONUS,
  RESEARCH_DIRECTIVE_TREASURY_COST,
  RESEARCH_DIRECTIVE_PROGRESS_BURST,
} from '../../../engine/constants';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import { GameContext } from '../../context/game-context';
import { useRightPanel } from '../../context/right-panel-context';
import {
  KNOWLEDGE_BRANCH_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import { KNOWLEDGE_BRANCH_DESCRIPTIONS } from '../../../data/text/reports';
import {
  getMilestoneDefinition,
  getDependenciesForNode,
  CROSS_BRANCH_DEPENDENCIES,
  RESEARCH_CONTRIBUTOR_LABELS,
  type MilestoneDefinition,
  type CrossBranchDependency,
} from '../../../data/knowledge';
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

type NodeState = 'unlocked' | 'active' | 'locked';

function getNodeState(
  branchState: KnowledgeBranchState,
  milestoneIndex: number,
  isFocused: boolean,
): NodeState {
  if (milestoneIndex < branchState.currentMilestoneIndex) return 'unlocked';
  if (milestoneIndex === branchState.currentMilestoneIndex && isFocused) return 'active';
  return 'locked';
}

function getConnectorPercent(
  branchState: KnowledgeBranchState,
  segmentIndex: number,
): number {
  // segmentIndex is the connector between node[segmentIndex] and node[segmentIndex+1]
  // connector is "filled" if the milestone at segmentIndex is unlocked
  if (segmentIndex < branchState.currentMilestoneIndex) return 100;
  if (segmentIndex === branchState.currentMilestoneIndex) {
    // This is the active segment — show partial progress
    return getProgressPercent(branchState);
  }
  return 0;
}

interface SelectedNode {
  branch: KnowledgeBranch;
  milestoneIndex: number;
}

// Branch order for rendering (matches enum order)
const BRANCH_ORDER: KnowledgeBranch[] = Object.values(KnowledgeBranch);

// Branch index map for SVG line computation
const BRANCH_INDEX_MAP: Record<KnowledgeBranch, number> = {} as Record<KnowledgeBranch, number>;
BRANCH_ORDER.forEach((b, i) => { BRANCH_INDEX_MAP[b] = i; });

// ============================================================
// Sub-components
// ============================================================

function MilestoneNodeComponent({
  milestoneIndex,
  state,
  isSelected,
  definition,
  onClick,
}: {
  milestoneIndex: number;
  state: NodeState;
  isSelected: boolean;
  definition: MilestoneDefinition | undefined;
  onClick: () => void;
}) {
  return (
    <button
      className={styles.node}
      data-state={state}
      data-selected={isSelected ? 'true' : 'false'}
      onClick={onClick}
      aria-label={`Milestone ${milestoneIndex + 1}: ${definition?.name ?? 'Unknown'} — ${state}`}
      title={definition?.name}
    >
      {milestoneIndex + 1}
      <span className={styles.nodeLabel}>{definition?.name ?? `M${milestoneIndex + 1}`}</span>
    </button>
  );
}

function NodeDetailPanel({
  node,
  branchState,
  isFocused,
  progressPerTurn,
}: {
  node: SelectedNode;
  branchState: KnowledgeBranchState;
  isFocused: boolean;
  progressPerTurn: number;
}) {
  const def = getMilestoneDefinition(node.branch, node.milestoneIndex);
  if (!def) return null;

  const state = getNodeState(branchState, node.milestoneIndex, isFocused);
  const dependencies = getDependenciesForNode(node.branch, node.milestoneIndex);

  // Calculate ETA for this specific milestone
  const threshold = KNOWLEDGE_MILESTONE_THRESHOLDS[node.milestoneIndex];
  const remaining = threshold ? Math.max(0, threshold - branchState.progressValue) : 0;
  const eta = state === 'unlocked'
    ? 'Achieved'
    : !isFocused
      ? 'Not focused'
      : progressPerTurn <= 0
        ? 'Stalled'
        : remaining <= 0
          ? 'Imminent'
          : `~${Math.ceil(remaining / progressPerTurn)} months`;

  // Progress for this milestone
  const prevThreshold = node.milestoneIndex > 0
    ? KNOWLEDGE_MILESTONE_THRESHOLDS[node.milestoneIndex - 1]
    : 0;
  const range = threshold !== undefined ? threshold - prevThreshold : 0;
  const currentProgress = Math.max(0, branchState.progressValue - prevThreshold);
  const pct = state === 'unlocked' ? 100 : range > 0 ? Math.min(100, Math.round((currentProgress / range) * 100)) : 0;

  return (
    <div className={styles.nodeDetail}>
      <div className={styles.nodeDetailHeader}>
        <span className={styles.nodeDetailName}>{def.name}</span>
        <span className={styles.nodeDetailBonus}>{def.branchBonus}</span>
        <span className={styles.nodeDetailStatus} data-state={state}>
          {state === 'unlocked' ? 'Achieved' : state === 'active' ? 'In Progress' : 'Locked'}
        </span>
      </div>

      <p className={styles.nodeDetailDescription}>{def.description}</p>

      {state !== 'unlocked' && threshold !== undefined && (
        <div className={styles.nodeDetailProgress}>
          <div className={styles.nodeDetailBarTrack}>
            <div
              className={styles.nodeDetailBarFill}
              data-focused={isFocused ? 'true' : 'false'}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={styles.nodeDetailProgressText}>
            {branchState.progressValue} / {threshold} pts
          </span>
          <span className={styles.nodeDetailEta}>{eta}</span>
        </div>
      )}

      {def.unlocks.length > 0 && (
        <div className={styles.nodeDetailSection}>
          <span className={styles.nodeDetailSectionTitle}>Unlocks</span>
          <ul className={styles.unlockList}>
            {def.unlocks.map((u, i) => (
              <li key={i} className={styles.unlockChip} data-type={u.type}>
                {u.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dependencies.length > 0 && (
        <div className={styles.nodeDetailSection}>
          <span className={styles.nodeDetailSectionTitle}>Cross-Branch Links</span>
          <div className={styles.dependencyList}>
            {dependencies.map((dep, i) => {
              const isFrom = dep.from.branch === node.branch && dep.from.milestoneIndex === node.milestoneIndex;
              const otherBranch = isFrom ? dep.to.branch : dep.from.branch;
              const otherIndex = isFrom ? dep.to.milestoneIndex : dep.from.milestoneIndex;
              const otherDef = getMilestoneDefinition(otherBranch, otherIndex);
              const satisfied = isFrom
                ? branchState.currentMilestoneIndex > node.milestoneIndex
                : false; // simplified — "from" being unlocked satisfies the link
              return (
                <div key={i} className={styles.dependencyItem}>
                  <span className={styles.dependencyLine} data-satisfied={satisfied ? 'true' : 'false'} />
                  <span>
                    {isFrom ? 'Enables' : 'Benefits from'}{' '}
                    {KNOWLEDGE_BRANCH_LABELS[otherBranch]} — {otherDef?.name ?? `M${otherIndex + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchContributors({
  treasuryBalance,
  scholarlyOrderActive,
}: {
  treasuryBalance: number;
  scholarlyOrderActive: boolean;
}) {
  const treasuryBonus = Math.min(
    Math.round(treasuryBalance * KNOWLEDGE_TREASURY_INVESTMENT_RATE),
    40,
  );

  return (
    <div className={styles.contributorsSection}>
      <span className={styles.contributorsTitle}>Research Speed Contributors</span>
      <div className={styles.contributor}>
        <span className={styles.contributorDot} data-active="true" />
        <span>{RESEARCH_CONTRIBUTOR_LABELS.base}</span>
        <span className={styles.contributorValue} data-active="true">
          +{KNOWLEDGE_BASE_PROGRESS_PER_TURN}
        </span>
      </div>
      <div className={styles.contributor}>
        <span className={styles.contributorDot} data-active={treasuryBonus > 0 ? 'true' : 'false'} />
        <span>{RESEARCH_CONTRIBUTOR_LABELS.treasury}</span>
        <span className={styles.contributorValue} data-active={treasuryBonus > 0 ? 'true' : 'false'}>
          +{treasuryBonus}
        </span>
      </div>
      <div className={styles.contributor}>
        <span className={styles.contributorDot} data-active={scholarlyOrderActive ? 'true' : 'false'} />
        <span>{RESEARCH_CONTRIBUTOR_LABELS.scholarly}</span>
        <span
          className={styles.contributorValue}
          data-active={scholarlyOrderActive ? 'true' : 'false'}
        >
          {scholarlyOrderActive ? `+${KNOWLEDGE_SCHOLARLY_CLERGY_ORDER_BONUS}` : 'Inactive'}
        </span>
      </div>
      <div className={styles.contributor}>
        <span className={styles.contributorDot} data-active="false" />
        <span>{RESEARCH_CONTRIBUTOR_LABELS.infrastructure}</span>
        <span className={styles.contributorValue} data-active="false">
          Not established
        </span>
      </div>
    </div>
  );
}

function CrossBranchLines({
  containerRef,
  nodeRefs,
  knowledgeBranches,
  selectedNode,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  nodeRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  knowledgeBranches: Record<KnowledgeBranch, KnowledgeBranchState>;
  selectedNode: SelectedNode | null;
}) {
  const [lines, setLines] = useState<
    Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      satisfied: boolean;
      highlighted: boolean;
    }>
  >([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLines: typeof lines = [];

    for (const dep of CROSS_BRANCH_DEPENDENCIES) {
      const fromKey = `${dep.from.branch}_${dep.from.milestoneIndex}`;
      const toKey = `${dep.to.branch}_${dep.to.milestoneIndex}`;
      const fromEl = nodeRefs.current.get(fromKey);
      const toEl = nodeRefs.current.get(toKey);

      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const fromState = knowledgeBranches[dep.from.branch];
      const satisfied = fromState.currentMilestoneIndex > dep.from.milestoneIndex;

      const highlighted = selectedNode !== null && (
        (selectedNode.branch === dep.from.branch && selectedNode.milestoneIndex === dep.from.milestoneIndex) ||
        (selectedNode.branch === dep.to.branch && selectedNode.milestoneIndex === dep.to.milestoneIndex)
      );

      newLines.push({
        x1: fromRect.left + fromRect.width / 2 - containerRect.left,
        y1: fromRect.top + fromRect.height / 2 - containerRect.top,
        x2: toRect.left + toRect.width / 2 - containerRect.left,
        y2: toRect.top + toRect.height / 2 - containerRect.top,
        satisfied,
        highlighted,
      });
    }

    setLines(newLines);
  }, [containerRef, nodeRefs, knowledgeBranches, selectedNode]);

  if (lines.length === 0) return null;

  return (
    <svg className={styles.svgOverlay}>
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          className={styles.depLine}
          data-satisfied={line.satisfied ? 'true' : 'false'}
          data-highlighted={line.highlighted ? 'true' : 'false'}
        />
      ))}
    </svg>
  );
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
  const { update: updateRightPanel } = useRightPanel();
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [policyChangeUsed, setPolicyChangeUsed] = useState(
    kingdom.actionBudget.policyChangesUsedThisTurn > 0,
  );

  const canIssueDirective = !isBudgetExhausted && slotsRemaining >= 2;
  const canChangeFocus = !policyChangeUsed && kingdom.actionBudget.policyChangesUsedThisTurn === 0;

  // Detect scholarly clergy order
  const scholarlyOrderActive = kingdom.faithCulture.activeOrders.some(
    (o) => o.isActive && o.type === ReligiousOrderType.Scholarly,
  );

  // Refs for cross-branch SVG lines
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const handleSelectNode = useCallback(
    (branch: KnowledgeBranch, milestoneIndex: number) => {
      setSelectedNode((prev) => {
        if (prev && prev.branch === branch && prev.milestoneIndex === milestoneIndex) {
          return null; // toggle off
        }
        return { branch, milestoneIndex };
      });
      updateRightPanel({ selectedBranchId: branch });
    },
    [updateRightPanel],
  );

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

  // Register node ref callback
  const setNodeRef = useCallback(
    (key: string, el: HTMLButtonElement | null) => {
      if (el) {
        nodeRefs.current.set(key, el);
      } else {
        nodeRefs.current.delete(key);
      }
    },
    [],
  );

  return (
    <div className={styles.screen}>
      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

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

        {/* Research Speed Contributors */}
        <ResearchContributors
          treasuryBalance={kingdom.treasury.balance}
          scholarlyOrderActive={scholarlyOrderActive}
        />
      </section>

      {/* Knowledge Tree */}
      <section>
        <h2 className={styles.sectionLabel}>Knowledge Tree</h2>
        <div className={styles.treeContainer} ref={treeContainerRef}>
          {/* Cross-branch dependency lines */}
          <CrossBranchLines
            containerRef={treeContainerRef}
            nodeRefs={nodeRefs}
            knowledgeBranches={knowledgeState.branches}
            selectedNode={selectedNode}
          />

          {BRANCH_ORDER.map((branch) => {
            const branchState = knowledgeState.branches[branch];
            const isFocused = researchFocus === branch;
            const isComplete = branchState.currentMilestoneIndex >= KNOWLEDGE_MILESTONE_THRESHOLDS.length;
            const hasSel = selectedNode !== null && selectedNode.branch === branch;

            return (
              <React.Fragment key={branch}>
                <div
                  className={styles.branchRow}
                  data-focused={isFocused ? 'true' : 'false'}
                  data-selected={hasSel ? 'true' : 'false'}
                >
                  {/* Branch Header */}
                  <div className={styles.branchHeader}>
                    <div className={styles.branchNameRow}>
                      <span className={styles.branchName}>
                        {KNOWLEDGE_BRANCH_LABELS[branch]}
                      </span>
                      {isFocused && (
                        <span className={styles.focusBadge}>Active</span>
                      )}
                    </div>
                    <span className={styles.branchBonus}>
                      {getKnowledgeBonus(branchState.currentMilestoneIndex)}
                    </span>
                    {/* Focus button */}
                    {isFocused ? (
                      <button
                        className={styles.branchClearButton}
                        disabled={!canChangeFocus}
                        onClick={() => handleSetFocus(null)}
                        title="Remove research focus (policy change — 1 per turn)"
                      >
                        Clear Focus
                      </button>
                    ) : (
                      <button
                        className={styles.branchFocusButton}
                        disabled={!canChangeFocus || isComplete}
                        onClick={() => handleSetFocus(branch)}
                        title="Direct research investment to this branch (policy change — 1 per turn)"
                      >
                        Set Focus
                      </button>
                    )}
                    {!canChangeFocus && (
                      <span className={styles.focusNote}>
                        Policy change used this turn.
                      </span>
                    )}
                  </div>

                  {/* Node Track */}
                  <div className={styles.nodeTrack}>
                    {KNOWLEDGE_MILESTONE_THRESHOLDS.map((_, mIdx) => {
                      const nodeState = getNodeState(branchState, mIdx, isFocused);
                      const def = getMilestoneDefinition(branch, mIdx);
                      const isSelected =
                        selectedNode !== null &&
                        selectedNode.branch === branch &&
                        selectedNode.milestoneIndex === mIdx;
                      const nodeKey = `${branch}_${mIdx}`;

                      return (
                        <div key={mIdx} className={styles.nodeWrapper}>
                          <button
                            ref={(el) => setNodeRef(nodeKey, el)}
                            className={styles.node}
                            data-state={nodeState}
                            data-selected={isSelected ? 'true' : 'false'}
                            onClick={() => handleSelectNode(branch, mIdx)}
                            aria-label={`Milestone ${mIdx + 1}: ${def?.name ?? 'Unknown'} — ${nodeState}`}
                            title={def?.name}
                          >
                            {mIdx + 1}
                            <span className={styles.nodeLabel}>
                              {def?.name ?? `M${mIdx + 1}`}
                            </span>
                          </button>
                          {/* Connector line after each node except the last */}
                          {mIdx < KNOWLEDGE_MILESTONE_THRESHOLDS.length - 1 && (
                            <div
                              className={styles.connector}
                              data-focused={isFocused ? 'true' : 'false'}
                            >
                              <div
                                className={styles.connectorFill}
                                style={{
                                  width: `${getConnectorPercent(branchState, mIdx)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Node Detail Panel (below the branch row) */}
                {hasSel && selectedNode && (
                  <NodeDetailPanel
                    node={selectedNode}
                    branchState={branchState}
                    isFocused={isFocused}
                    progressPerTurn={knowledgeState.progressPerTurn}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
}
