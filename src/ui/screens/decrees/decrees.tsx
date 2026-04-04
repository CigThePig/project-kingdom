// Phase 11 — Decrees Screen: decree issuing + policy management.
// Blueprint Reference: ui-blueprint.md §4.3, §4.4, §7.3, §7.4; ux-blueprint.md §4, §6

import { useState, useCallback, useContext } from 'react';

import {
  ActionType,
  DecreeCategory,
  PopulationClass,
  type GameState,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import { GameContext } from '../../context/game-context';
import { DECREE_POOL, type DecreeDefinition } from '../../../data/decrees/index';
import { DecreeCard } from '../../components/decree-card/decree-card';
import { PolicyCard } from '../../components/policy-card/policy-card';
import {
  DECREE_CATEGORY_LABELS,
  ACTION_TYPE_LABELS,
  ALL_CATEGORIES_LABEL,
  DECREES_TAB_LABEL,
  POLICIES_TAB_LABEL,
  QUEUED_ACTIONS_LABEL,
  SLOT_COUNTER_LABEL,
  POLICY_CHANGE_LIMIT_LABEL,
  POLICY_DOMAIN_LABELS,
  BUDGET_ERROR_LABELS,
  CONFIRM_HIGH_IMPACT_TITLE,
  CONFIRM_HIGH_IMPACT_BODY,
  CONFIRM_LABEL,
  CANCEL_LABEL,
  NO_DECREES_AVAILABLE,
  TAXATION_LEVEL_LABELS,
  TRADE_OPENNESS_LABELS,
  RATIONING_LEVEL_LABELS,
  RELIGIOUS_TOLERANCE_LABELS,
  FESTIVAL_INVESTMENT_LABELS,
  RECRUITMENT_STANCE_LABELS,
  INTELLIGENCE_FUNDING_LABELS,
  LABOR_ALLOCATION_LABELS,
} from '../../../data/text/labels';
import {
  TAXATION_EFFECT,
  TRADE_OPENNESS_EFFECT,
  RATIONING_EFFECT,
  TOLERANCE_EFFECT,
  FESTIVAL_EFFECT,
  RECRUITMENT_EFFECT,
  INTELLIGENCE_FUNDING_EFFECT,
  LABOR_ALLOCATION_EFFECT,
} from '../../../data/text/reports';
import styles from './decrees.module.css';

// ============================================================
// Types
// ============================================================

type ActiveTab = 'decrees' | 'policies';
type CategoryFilter = 'all' | DecreeCategory;

// Policy keys managed in this Policies tab.
// laborAllocationPriority uses KnowledgeBranch values + 'none' sentinel for null.
type LevelPolicyKey =
  | 'taxationLevel'
  | 'tradeOpenness'
  | 'militaryRecruitmentStance'
  | 'rationingLevel'
  | 'religiousTolerance'
  | 'festivalInvestmentLevel'
  | 'intelligenceFundingLevel'
  | 'laborAllocationPriority';

interface PolicyConfig {
  key: LevelPolicyKey;
  labels: Record<string, string>;
  effects: Record<string, string>;
  affectedClasses: PopulationClass[];
}

// ============================================================
// Policy configurations
// ============================================================

const POLICY_CONFIGS: PolicyConfig[] = [
  {
    key: 'taxationLevel',
    labels: TAXATION_LEVEL_LABELS,
    effects: TAXATION_EFFECT,
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Merchants, PopulationClass.Commoners],
  },
  {
    key: 'tradeOpenness',
    labels: TRADE_OPENNESS_LABELS,
    effects: TRADE_OPENNESS_EFFECT,
    affectedClasses: [PopulationClass.Merchants],
  },
  {
    key: 'militaryRecruitmentStance',
    labels: RECRUITMENT_STANCE_LABELS,
    effects: RECRUITMENT_EFFECT,
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Commoners],
  },
  {
    key: 'rationingLevel',
    labels: RATIONING_LEVEL_LABELS,
    effects: RATIONING_EFFECT,
    affectedClasses: [PopulationClass.Commoners],
  },
  {
    key: 'religiousTolerance',
    labels: RELIGIOUS_TOLERANCE_LABELS,
    effects: TOLERANCE_EFFECT,
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners],
  },
  {
    key: 'festivalInvestmentLevel',
    labels: FESTIVAL_INVESTMENT_LABELS,
    effects: FESTIVAL_EFFECT,
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners],
  },
  {
    key: 'intelligenceFundingLevel',
    labels: INTELLIGENCE_FUNDING_LABELS,
    effects: INTELLIGENCE_FUNDING_EFFECT,
    affectedClasses: [],
  },
  {
    key: 'laborAllocationPriority',
    labels: LABOR_ALLOCATION_LABELS,
    effects: LABOR_ALLOCATION_EFFECT,
    affectedClasses: [PopulationClass.Commoners],
  },
];

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;

function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

function isDecreeDisabled(
  decree: DecreeDefinition,
  slotsRemaining: number,
  isBudgetExhausted: boolean,
  kingdom: ReturnType<typeof useKingdomState>,
): { disabled: boolean; reason: string } {
  if (isBudgetExhausted) {
    return { disabled: true, reason: BUDGET_ERROR_LABELS.BUDGET_EXHAUSTED };
  }
  if (decree.slotCost > slotsRemaining) {
    return { disabled: true, reason: BUDGET_ERROR_LABELS.INSUFFICIENT_SLOTS };
  }
  if (decree.knowledgePrerequisite) {
    const branch = kingdom.knowledge.branches[decree.knowledgePrerequisite.branch];
    if (branch.currentMilestoneIndex <= decree.knowledgePrerequisite.milestoneIndex) {
      return { disabled: true, reason: `Requires ${decree.prerequisites[0] ?? 'knowledge advancement'}` };
    }
  }
  return { disabled: false, reason: '' };
}

// ============================================================
// Decrees Screen
// ============================================================

export function Decrees() {
  const kingdom = useKingdomState();
  const { queueAction, removeAction, slotsRemaining, queuedActions, isBudgetExhausted } =
    useTurnActions();
  const ctx = useContext(GameContext);

  const [activeTab, setActiveTab] = useState<ActiveTab>('decrees');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmingDecree, setConfirmingDecree] = useState<DecreeDefinition | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<LevelPolicyKey | null>(null);

  const budget = kingdom.actionBudget;

  // ---- Decree commit ----

  const commitDecree = useCallback(
    (decree: DecreeDefinition) => {
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.Decree,
        actionDefinitionId: decree.id,
        slotCost: decree.slotCost,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      };

      const error = queueAction(action);
      if (error) {
        setErrorMessage(BUDGET_ERROR_LABELS[error.code] ?? 'Action could not be queued.');
        setTimeout(() => setErrorMessage(null), 3000);
      } else {
        setErrorMessage(null);
      }
      setConfirmingDecree(null);
    },
    [queueAction],
  );

  // ---- Decree selection ----

  const handleDecreeSelect = useCallback(
    (decreeId: string) => {
      const decree = DECREE_POOL.find((d) => d.id === decreeId);
      if (!decree) return;

      if (decree.isHighImpact) {
        setConfirmingDecree(decree);
        return;
      }

      commitDecree(decree);
    },
    [commitDecree],
  );

  // ---- Policy change ----

  const handlePolicyChange = useCallback(
    (policyKey: LevelPolicyKey, newValue: string) => {
      if (!ctx) return;

      // 'none' is the sentinel for null (used by laborAllocationPriority)
      const resolvedValue: string | null = newValue === 'none' ? null : newValue;

      // Queue a PolicyChange action
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.PolicyChange,
        actionDefinitionId: `policy_${policyKey}`,
        slotCost: 0,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: { policyKey, newValue: resolvedValue },
      };

      const error = queueAction(action);
      if (error) {
        setErrorMessage(BUDGET_ERROR_LABELS[error.code] ?? 'Policy change could not be applied.');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      // Apply the policy change to game state immediately so the UI reflects it
      ctx.dispatch({
        type: 'UPDATE_GAME_STATE',
        updater: (state: GameState) => ({
          ...state,
          policies: {
            ...state.policies,
            [policyKey]: resolvedValue,
            policyChangedThisTurn: true,
          },
        }),
      });

      setSelectedPolicy(null);
      setErrorMessage(null);
    },
    [ctx, queueAction],
  );

  // ---- Filtered decrees ----

  const filteredDecrees =
    categoryFilter === 'all'
      ? DECREE_POOL
      : DECREE_POOL.filter((d) => d.category === categoryFilter);

  // ---- Render helpers ----

  const slotsTotal = budget.slotsTotal;
  const slotsUsed = budget.slotsUsed;
  const policyUsed = budget.policyChangesUsedThisTurn > 0;

  return (
    <div className={styles.screen}>
      {/* Action Slot Counter */}
      <div className={styles.slotCounter}>
        <span className={styles.slotCounterLabel}>{SLOT_COUNTER_LABEL}</span>
        <span className={styles.slotDots} aria-label={`${slotsRemaining} of ${slotsTotal} slots remaining`}>
          {Array.from({ length: slotsTotal }, (_, i) => (
            <span
              key={i}
              className={styles.slotDot}
              data-state={i < slotsUsed ? 'used' : 'available'}
              aria-hidden="true"
            />
          ))}
        </span>
        <span className={styles.slotSummary}>
          {slotsRemaining} / {slotsTotal}
        </span>
        <span
          className={styles.policyChangeIndicator}
          data-used={policyUsed ? 'true' : 'false'}
        >
          {POLICY_CHANGE_LIMIT_LABEL}: {policyUsed ? 'Used' : 'Available'}
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist">
        <button
          className={styles.tab}
          role="tab"
          data-active={activeTab === 'decrees' ? 'true' : 'false'}
          aria-selected={activeTab === 'decrees'}
          onClick={() => setActiveTab('decrees')}
        >
          {DECREES_TAB_LABEL}
        </button>
        <button
          className={styles.tab}
          role="tab"
          data-active={activeTab === 'policies' ? 'true' : 'false'}
          aria-selected={activeTab === 'policies'}
          onClick={() => setActiveTab('policies')}
        >
          {POLICIES_TAB_LABEL}
        </button>
      </div>

      {/* Decrees Tab Content */}
      {activeTab === 'decrees' && (
        <>
          {/* Category Filter */}
          <div className={styles.categoryFilter} role="group" aria-label="Filter by category">
            <button
              className={styles.filterChip}
              data-active={categoryFilter === 'all' ? 'true' : 'false'}
              onClick={() => setCategoryFilter('all')}
            >
              {ALL_CATEGORIES_LABEL}
            </button>
            {Object.values(DecreeCategory).map((cat) => (
              <button
                key={cat}
                className={styles.filterChip}
                data-active={categoryFilter === cat ? 'true' : 'false'}
                onClick={() => setCategoryFilter(cat)}
              >
                {DECREE_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Decree Grid */}
          {filteredDecrees.length > 0 ? (
            <div className={styles.decreeGrid}>
              {filteredDecrees.map((decree) => {
                const { disabled, reason } = isDecreeDisabled(
                  decree,
                  slotsRemaining,
                  isBudgetExhausted,
                  kingdom,
                );
                const isNewlyUnlocked =
                  decree.knowledgePrerequisite !== null && !disabled;
                return (
                  <DecreeCard
                    key={decree.id}
                    id={decree.id}
                    title={decree.title}
                    category={decree.category}
                    slotCost={decree.slotCost}
                    resourceCosts={decree.resourceCosts}
                    prerequisites={decree.prerequisites}
                    affectedClasses={decree.affectedClasses}
                    effectPreview={decree.effectPreview}
                    isNew={isNewlyUnlocked}
                    isDisabled={disabled}
                    disabledReason={reason}
                    onSelect={handleDecreeSelect}
                  />
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyState}>{NO_DECREES_AVAILABLE}</p>
          )}
        </>
      )}

      {/* Policies Tab Content */}
      {activeTab === 'policies' && (
        <div className={styles.policyList}>
          {POLICY_CONFIGS.map((config) => {
            const rawValue = kingdom.policies[config.key];
            // laborAllocationPriority can be null; map to 'none' sentinel for label lookup
            const currentValue = rawValue === null ? 'none' : (rawValue as string);
            const currentLabel = config.labels[currentValue] ?? currentValue;
            const currentEffect = config.effects[currentValue] ?? '';
            const isChangeAvailable = !policyUsed;

            return (
              <div key={config.key}>
                <PolicyCard
                  name={POLICY_DOMAIN_LABELS[config.key]}
                  currentSettingLabel={currentLabel}
                  effectSummary={currentEffect}
                  affectedClasses={config.affectedClasses}
                  isChangeAvailable={isChangeAvailable}
                  onSelect={() => setSelectedPolicy(config.key)}
                />

                {/* Policy change level picker */}
                {selectedPolicy === config.key && (
                  <div className={styles.policyChangePanel}>
                    <h4 className={styles.policyChangePanelTitle}>
                      {POLICY_DOMAIN_LABELS[config.key]}
                    </h4>
                    <div className={styles.policyChangeOptions}>
                      {Object.entries(config.labels).map(([value, label]) => (
                        <button
                          key={value}
                          className={styles.policyOption}
                          data-current={value === currentValue ? 'true' : 'false'}
                          disabled={value === currentValue || policyUsed}
                          onClick={() => handlePolicyChange(config.key, value)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {selectedPolicy === config.key && (
                      <p className={styles.policyChangeEffect}>{currentEffect}</p>
                    )}
                    <button
                      className={styles.policyChangeDismiss}
                      onClick={() => setSelectedPolicy(null)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Queued Actions */}
      {queuedActions.length > 0 && (
        <section className={styles.queuedSection}>
          <h2 className={styles.sectionLabel}>
            {QUEUED_ACTIONS_LABEL} ({queuedActions.length})
          </h2>
          <div className={styles.queuedList}>
            {queuedActions.map((action) => {
              const decree = DECREE_POOL.find(
                (d) => d.id === action.actionDefinitionId,
              );
              const label =
                decree?.title ??
                ACTION_TYPE_LABELS[action.type] ??
                action.actionDefinitionId;
              return (
                <div key={action.id} className={styles.queuedItem}>
                  <span className={styles.queuedItemLabel}>{label}</span>
                  <span className={styles.queuedItemCost}>
                    {action.slotCost > 0
                      ? `${action.slotCost} slot${action.slotCost !== 1 ? 's' : ''}`
                      : 'Free'}
                  </span>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeAction(action.id)}
                    aria-label={`Remove ${label}`}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* High-Impact Confirmation Overlay */}
      {confirmingDecree && (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
          <div className={styles.confirmCard}>
            <h2 className={styles.confirmTitle}>{CONFIRM_HIGH_IMPACT_TITLE}</h2>
            <p className={styles.confirmBody}>
              <span className={styles.confirmDecreeName}>{confirmingDecree.title}</span>
              {' \u2014 '}
              {CONFIRM_HIGH_IMPACT_BODY}
            </p>
            <p className={styles.confirmBody}>{confirmingDecree.effectPreview}</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setConfirmingDecree(null)}
              >
                {CANCEL_LABEL}
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => commitDecree(confirmingDecree)}
              >
                {CONFIRM_LABEL}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
