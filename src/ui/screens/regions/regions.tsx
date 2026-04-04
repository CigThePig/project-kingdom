// Phase 5 — Regions Screen: regional administration and construction initiation.
// Blueprint Reference: ui-blueprint.md §4.6; ux-blueprint.md §4, §6

import React, { useState, useCallback } from 'react';

import {
  ActionType,
  type RegionState,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  REGION_LABELS,
  ECONOMIC_OUTPUT_LABELS,
  RESOURCE_TYPE_LABELS,
  CONSTRUCTION_CATEGORY_LABELS,
  KNOWLEDGE_BRANCH_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import { REGION_DESCRIPTIONS } from '../../../data/text/reports';
import { CONSTRUCTION_POOL, type ConstructionProjectDefinition } from '../../../data/construction/index';
import styles from './regions.module.css';

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;
function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

function getRegionName(id: string): string {
  return REGION_LABELS[id] ?? id;
}

function getOutputLabel(output: string): string {
  return ECONOMIC_OUTPUT_LABELS[output] ?? output;
}

function getConditionStatus(modifier: number): string {
  if (modifier >= 1.2) return 'excellent';
  if (modifier >= 1.0) return 'good';
  if (modifier >= 0.8) return 'fair';
  return 'poor';
}

function formatCondition(modifier: number): string {
  const pct = Math.round((modifier - 1) * 100);
  if (pct > 0) return `+${pct}%`;
  if (pct < 0) return `${pct}%`;
  return 'Baseline';
}

function formatResourceCosts(costs: Partial<Record<string, number>>): string {
  const parts = Object.entries(costs)
    .filter(([, v]) => v && v > 0)
    .map(([k, v]) => `${v} ${RESOURCE_TYPE_LABELS[k as keyof typeof RESOURCE_TYPE_LABELS] ?? k}`);
  return parts.length > 0 ? parts.join(', ') : 'None';
}

// ============================================================
// Regions Screen
// ============================================================

export function Regions() {
  const kingdom = useKingdomState();
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [confirmingProject, setConfirmingProject] = useState<{
    regionId: string;
    projectId: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAct = !isBudgetExhausted && slotsRemaining >= 1;
  const occupiedCount = kingdom.regions.filter((r) => r.isOccupied).length;

  const handleBeginConstruction = useCallback(
    (regionId: string, project: ConstructionProjectDefinition) => {
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.Construction,
        actionDefinitionId: `construction_${project.id}`,
        slotCost: 1,
        isFree: false,
        targetRegionId: regionId,
        targetNeighborId: null,
        parameters: {
          projectDefinitionId: project.id,
          effectId: project.id,
          category: project.category,
          turnsTotal: project.turnsTotal,
          resourceCosts: project.resourceCosts,
        },
      };
      const error = queueAction(action);
      if (error) {
        setErrorMessage(BUDGET_ERROR_LABELS[error.code] ?? 'Construction could not be initiated.');
        setTimeout(() => setErrorMessage(null), 3000);
      }
      setConfirmingProject(null);
    },
    [queueAction],
  );

  // Check if a project's knowledge prerequisites are met
  const isProjectUnlocked = useCallback(
    (project: ConstructionProjectDefinition): boolean => {
      if (!project.knowledgePrerequisite) return true;
      const { branch, milestoneIndex } = project.knowledgePrerequisite;
      const branchState = kingdom.knowledge.branches[branch];
      return branchState.currentMilestoneIndex > milestoneIndex;
    },
    [kingdom.knowledge.branches],
  );

  return (
    <div className={styles.screen}>
      {/* Occupied Warning */}
      {occupiedCount > 0 && (
        <div className={styles.warningBanner} data-level="critical" role="alert">
          <span className={styles.warningText}>
            {occupiedCount} of {kingdom.regions.length} regions under foreign
            occupation. Regional output from occupied territories is suspended.
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Region Cards */}
      <div className={styles.regionGrid}>
        {kingdom.regions.map((region) => {
          const activeProjects = kingdom.constructionProjects.filter(
            (p) => p.targetRegionId === region.id,
          );
          const activeEvents = kingdom.activeEvents.filter(
            (e) => !e.isResolved && e.affectedRegionId === region.id,
          );
          const availableProjects = CONSTRUCTION_POOL.filter(
            (p) => isProjectUnlocked(p),
          );

          return (
            <RegionCard
              key={region.id}
              region={region}
              isExpanded={expandedRegion === region.id}
              onToggle={() =>
                setExpandedRegion(expandedRegion === region.id ? null : region.id)
              }
              constructionCount={activeProjects.length}
              eventCount={activeEvents.length}
              activeProjects={activeProjects.map((p) => ({
                id: p.id,
                definitionId: p.definitionId,
                turnsRemaining: p.turnsRemaining,
                turnsTotal: p.turnsTotal,
              }))}
              availableProjects={availableProjects}
              confirmingProjectId={
                confirmingProject?.regionId === region.id
                  ? confirmingProject.projectId
                  : null
              }
              canAct={canAct}
              onBeginConstruction={(projectId) => {
                const proj = CONSTRUCTION_POOL.find((p) => p.id === projectId);
                if (proj) {
                  setConfirmingProject({ regionId: region.id, projectId });
                }
              }}
              onConfirmConstruction={(projectId) => {
                const proj = CONSTRUCTION_POOL.find((p) => p.id === projectId);
                if (proj) handleBeginConstruction(region.id, proj);
              }}
              onCancelConfirm={() => setConfirmingProject(null)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

interface ActiveProjectSummary {
  id: string;
  definitionId: string;
  turnsRemaining: number;
  turnsTotal: number;
}

function RegionCard({
  region,
  isExpanded,
  onToggle,
  constructionCount,
  eventCount,
  activeProjects,
  availableProjects,
  confirmingProjectId,
  canAct,
  onBeginConstruction,
  onConfirmConstruction,
  onCancelConfirm,
}: {
  region: RegionState;
  isExpanded: boolean;
  onToggle: () => void;
  constructionCount: number;
  eventCount: number;
  activeProjects: ActiveProjectSummary[];
  availableProjects: ConstructionProjectDefinition[];
  confirmingProjectId: string | null;
  canAct: boolean;
  onBeginConstruction: (projectId: string) => void;
  onConfirmConstruction: (projectId: string) => void;
  onCancelConfirm: () => void;
}) {
  const conditionStatus = getConditionStatus(region.localConditionModifier);

  return (
    <div
      className={styles.regionCard}
      data-expanded={isExpanded ? 'true' : 'false'}
      data-occupied={region.isOccupied ? 'true' : 'false'}
    >
      {/* Clickable summary area */}
      <div
        className={styles.regionSummary}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${getRegionName(region.id)} — development ${region.developmentLevel}`}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* Header */}
        <div className={styles.regionHeader}>
          <span className={styles.regionName}>{getRegionName(region.id)}</span>
          {region.isOccupied && (
            <span className={styles.occupiedBadge}>Occupied</span>
          )}
        </div>

        {/* Primary Output */}
        <span className={styles.outputLabel}>
          {getOutputLabel(region.primaryEconomicOutput)}
        </span>

        {/* Development Level Bar */}
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Development</span>
          <span className={styles.statValue}>{region.developmentLevel}</span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${region.developmentLevel}%` }}
          />
        </div>

        {/* Summary Stats */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Population</span>
            <span className={styles.summaryValue}>
              {region.populationContribution.toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Strategic Value</span>
            <span className={styles.summaryValue}>{region.strategicValue}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Condition</span>
            <span className={styles.summaryValue} data-status={conditionStatus}>
              {formatCondition(region.localConditionModifier)}
            </span>
          </div>
        </div>

        {/* Activity Indicators */}
        {(constructionCount > 0 || eventCount > 0) && (
          <div className={styles.activityRow}>
            {constructionCount > 0 && (
              <span className={styles.activityBadge}>
                {constructionCount} construction{constructionCount > 1 ? 's' : ''}
              </span>
            )}
            {eventCount > 0 && (
              <span className={styles.activityBadge} data-type="event">
                {eventCount} active event{eventCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className={styles.regionDetail}>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Description</span>
            <p className={styles.detailText}>
              {REGION_DESCRIPTIONS[region.id] ?? 'No description available.'}
            </p>
          </div>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Local Faith Tradition</span>
            <p className={styles.detailText}>{region.localFaithProfile}</p>
          </div>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Cultural Identity</span>
            <p className={styles.detailText}>{region.culturalIdentity}</p>
          </div>

          {/* Active Construction Projects */}
          {activeProjects.length > 0 && (
            <div className={styles.detailSection}>
              <span className={styles.detailTitle}>
                Active Construction ({activeProjects.length})
              </span>
              <div className={styles.activeProjectList}>
                {activeProjects.map((proj) => {
                  const progressPct = Math.round(
                    ((proj.turnsTotal - proj.turnsRemaining) / proj.turnsTotal) * 100,
                  );
                  const definition = CONSTRUCTION_POOL.find((d) => d.id === proj.definitionId);
                  return (
                    <div key={proj.id} className={styles.activeProjectItem}>
                      <div className={styles.activeProjectHeader}>
                        <span className={styles.activeProjectName}>
                          {definition?.title ?? proj.definitionId}
                        </span>
                        <span className={styles.activeProjectTurns}>
                          {proj.turnsRemaining} months remaining
                        </span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Construction Projects */}
          {!region.isOccupied && (
            <div className={styles.constructionSection}>
              <span className={styles.detailTitle}>Construction Projects</span>
              {availableProjects.length === 0 ? (
                <p className={styles.detailText}>
                  No construction projects are available. Advance knowledge to
                  unlock new development options.
                </p>
              ) : (
                <div className={styles.projectList}>
                  {availableProjects.map((project) => {
                    const isConfirming = confirmingProjectId === project.id;
                    return (
                      <div key={project.id} className={styles.projectCard}>
                        <div className={styles.projectHeader}>
                          <span className={styles.projectTitle}>{project.title}</span>
                          <span className={styles.projectCategory}>
                            {CONSTRUCTION_CATEGORY_LABELS[project.category]}
                          </span>
                        </div>
                        <p className={styles.projectEffect}>
                          {project.effectDescription}
                        </p>
                        <div className={styles.projectMeta}>
                          <span className={styles.projectMetaItem}>
                            {project.turnsTotal} months
                          </span>
                          <span className={styles.projectMetaItem}>
                            Cost: {formatResourceCosts(project.resourceCosts)}
                          </span>
                          {project.knowledgePrerequisite && (
                            <span className={styles.projectPrereq}>
                              Requires: {KNOWLEDGE_BRANCH_LABELS[project.knowledgePrerequisite.branch]} Milestone {project.knowledgePrerequisite.milestoneIndex + 1}
                            </span>
                          )}
                        </div>

                        {isConfirming ? (
                          <div className={styles.confirmPanel}>
                            <span className={styles.confirmText}>
                              Initiate construction of {project.title} in {getRegionName(region.id)}?
                              This will consume the required resources and 1 action slot.
                            </span>
                            <div className={styles.confirmButtons}>
                              <button
                                className={styles.beginButton}
                                onClick={() => onConfirmConstruction(project.id)}
                              >
                                Begin Construction
                                <span className={styles.slotCost}>1 slot</span>
                              </button>
                              <button
                                className={styles.cancelConfirmButton}
                                onClick={onCancelConfirm}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className={styles.beginButton}
                            disabled={!canAct}
                            onClick={() => onBeginConstruction(project.id)}
                          >
                            Begin Construction
                            <span className={styles.slotCost}>1 slot</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
