// Phase 6 — Dashboard Screen: kingdom overview, turn advance flow, navigable summary.
// Blueprint Reference: ui-blueprint.md §5.1; ux-blueprint.md §2, §4, §4.10

import { useState } from 'react';

import {
  PopulationClass,
  StorylineStatus,
} from '../../../engine/types';
import type {
  TurnSummaryItem,
  SummaryTargetScreen,
  FailureWarning,
} from '../../../engine/types';
import type { TurnResolutionResult } from '../../../engine/resolution/turn-resolution';
import {
  SATISFACTION_BREAKING_POINT,
  SATISFACTION_CRISIS_WARNING,
} from '../../../engine/constants';
import {
  useKingdomState,
  useCrownBar,
  useLastTurnResult,
} from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import { findConstructionDefinition } from '../../../data/construction/index';
import { STORYLINE_TEXT } from '../../../data/text/events';
import {
  CLASS_LABELS,
  SEASON_LABELS,
  ACTION_TYPE_LABELS,
  KNOWLEDGE_BRANCH_LABELS,
  ADVANCE_TURN_LABEL,
  CONFIRM_LABEL,
  CANCEL_LABEL,
  FAILURE_SCREEN_MAP,
  NEIGHBOR_LABELS,
  CONFLICT_PHASE_LABELS,
  CONFLICT_OUTCOME_LABELS,
  NEIGHBOR_ACTION_LABELS,
  REGION_LABELS,
  FAILURE_WARNING_MESSAGES,
} from '../../../data/text/labels';
import {
  TURN_SUMMARY_HEADER,
  TURN_SUMMARY_CRITICAL_SECTION,
  TURN_SUMMARY_NOTABLE_SECTION,
  TURN_SUMMARY_ROUTINE_SECTION,
  FAILURE_CONDITION_REPORTS,
  TREASURY_BALANCE_LINE,
  FOOD_RESERVES_LINE,
  CONSTRUCTION_COMPLETE_LINE,
  STORYLINE_PROGRESSION_LINE,
  STORYLINE_RESOLVED_LINE,
  FAITH_CHANGE_LINE,
  INTELLIGENCE_ARRIVAL_LINE,
  CONFLICT_UPDATE_LINE,
  CONFLICT_RESOLVED_LINE,
  NEIGHBOR_ACTION_LINE,
  MILITARY_UPDATE_LINE,
} from '../../../data/text/reports';
import { ResourceCard } from '../../components/resource-card/resource-card';
import { ForecastModule, type ForecastProjection } from '../../components/forecast-module/forecast-module';
import { Icon } from '../../components/icon/icon';
import styles from './dashboard.module.css';

// ============================================================
// Props
// ============================================================

interface DashboardProps {
  onNavigate: (screen: SummaryTargetScreen) => void;
}

// ============================================================
// Helpers
// ============================================================

type TurnPhase = 'idle' | 'confirming' | 'summary';

function getSatisfactionStatus(satisfaction: number): {
  label: string;
  styleKey: string;
  dataStatus: string;
} {
  if (satisfaction < SATISFACTION_BREAKING_POINT) {
    return { label: 'Critical', styleKey: 'statusCritical', dataStatus: 'critical' };
  }
  if (satisfaction < SATISFACTION_CRISIS_WARNING) {
    return { label: 'Restless', styleKey: 'statusRestless', dataStatus: 'restless' };
  }
  if (satisfaction < 50) {
    return { label: 'Uneasy', styleKey: 'statusUneasy', dataStatus: 'uneasy' };
  }
  return { label: 'Content', styleKey: 'statusContent', dataStatus: 'content' };
}

function getDeltaStyle(delta: number): string {
  if (delta > 0) return 'classDeltaPositive';
  if (delta < 0) return 'classDeltaNegative';
  return 'classDeltaNeutral';
}

function formatDelta(delta: number): string {
  if (delta > 0) return `\u25B2 +${delta}`;
  if (delta < 0) return `\u25BC ${delta}`;
  return '\u2015 0';
}

function computeDirection(netFlow: number): ForecastProjection['direction'] {
  if (netFlow > 0) return 'rising';
  if (netFlow < 0) return 'falling';
  return 'stable';
}

// ============================================================
// Enhanced Turn Summary Builder
// ============================================================

function buildTurnSummaryItems(
  result: TurnResolutionResult,
  previousState: {
    faithLevel: number;
    culturalCohesion: number;
    militaryReadiness: number;
    militaryMorale: number;
  },
): TurnSummaryItem[] {
  const items: TurnSummaryItem[] = [];

  // --- Critical: Failure conditions ---
  for (const fc of result.triggeredFailureConditions) {
    items.push({
      severity: 'critical',
      text: FAILURE_CONDITION_REPORTS[fc],
      targetScreen: (FAILURE_SCREEN_MAP[fc] as SummaryTargetScreen) ?? null,
      category: 'failure',
    });
  }

  // --- Critical/Notable: Failure warnings ---
  for (const fw of result.failureWarnings) {
    const msg = FAILURE_WARNING_MESSAGES[fw.condition];
    items.push({
      severity: fw.severity === 'critical' ? 'critical' : 'notable',
      text: msg[fw.severity],
      targetScreen: (FAILURE_SCREEN_MAP[fw.condition] as SummaryTargetScreen) ?? null,
      category: 'failure',
    });
  }

  // --- Critical/Notable: Class satisfaction ---
  const pop = result.nextState.population;
  for (const cls of Object.values(PopulationClass)) {
    const classState = pop[cls];
    if (classState.satisfaction < SATISFACTION_BREAKING_POINT) {
      items.push({
        severity: 'critical',
        text: `${CLASS_LABELS[cls]} sentiment has fallen to critical levels (${classState.satisfaction}).`,
        targetScreen: 'faith',
        category: 'class',
      });
    } else if (
      classState.satisfactionDeltaLastTurn !== 0 &&
      classState.satisfaction < SATISFACTION_CRISIS_WARNING
    ) {
      items.push({
        severity: 'notable',
        text: `${CLASS_LABELS[cls]} sentiment is at ${classState.satisfaction} (${classState.satisfactionDeltaLastTurn >= 0 ? '+' : ''}${classState.satisfactionDeltaLastTurn}).`,
        targetScreen: 'faith',
        category: 'class',
      });
    }
  }

  // --- Notable: Knowledge milestone unlocks ---
  for (const milestone of result.newlyUnlockedMilestones) {
    items.push({
      severity: 'notable',
      text: `A milestone has been reached in ${KNOWLEDGE_BRANCH_LABELS[milestone.branch]} \u2014 advancement tier ${milestone.milestoneIndex + 1}.`,
      targetScreen: 'knowledge',
      category: 'knowledge',
    });
  }

  // --- Notable: Construction completions ---
  for (const cId of result.completedConstructionIds) {
    const def = findConstructionDefinition(cId);
    items.push({
      severity: 'notable',
      text: CONSTRUCTION_COMPLETE_LINE({
        projectName: def?.title ?? cId,
        regionName: REGION_LABELS[cId] ?? 'Unknown Region',
      }),
      targetScreen: 'regions',
      category: 'construction',
    });
  }

  // --- Notable: Storyline progressions ---
  for (const storyline of result.nextState.activeStorylines) {
    const text = STORYLINE_TEXT[storyline.definitionId];
    const title = text?.title ?? storyline.definitionId;
    if (storyline.status === StorylineStatus.Active) {
      items.push({
        severity: 'notable',
        text: STORYLINE_PROGRESSION_LINE({ storylineTitle: title }),
        targetScreen: 'events',
        category: 'storyline',
      });
    } else if (storyline.status === StorylineStatus.Resolved) {
      items.push({
        severity: 'notable',
        text: STORYLINE_RESOLVED_LINE({ storylineTitle: title }),
        targetScreen: 'archive',
        category: 'storyline',
      });
    }
  }

  // --- Notable/Routine: Faith & culture changes ---
  const faithDelta = result.nextState.faithCulture.faithLevel - previousState.faithLevel;
  if (faithDelta !== 0) {
    items.push({
      severity: Math.abs(faithDelta) >= 5 ? 'notable' : 'routine',
      text: FAITH_CHANGE_LINE({
        faithLevel: result.nextState.faithCulture.faithLevel,
        delta: faithDelta,
      }),
      targetScreen: 'faith',
      category: 'faith',
    });
  }

  // --- Notable/Routine: Conflict updates ---
  for (const conflict of result.nextState.activeConflicts) {
    const neighborName = NEIGHBOR_LABELS[conflict.neighborId] ?? conflict.neighborId;
    if (conflict.lastOutcomeCode.startsWith('decisive_') || conflict.lastOutcomeCode.startsWith('attritional_') || conflict.lastOutcomeCode === 'stalemate') {
      items.push({
        severity: 'notable',
        text: CONFLICT_RESOLVED_LINE({
          neighborName,
          outcome: CONFLICT_OUTCOME_LABELS[conflict.lastOutcomeCode] ?? conflict.lastOutcomeCode,
        }),
        targetScreen: 'military',
        category: 'conflict',
      });
    } else {
      items.push({
        severity: 'notable',
        text: CONFLICT_UPDATE_LINE({
          neighborName,
          phase: CONFLICT_PHASE_LABELS[conflict.phase],
        }),
        targetScreen: 'military',
        category: 'conflict',
      });
    }
  }

  // --- Notable: Neighbor autonomous actions ---
  for (const action of result.nextState.neighborActions) {
    const neighborName = NEIGHBOR_LABELS[action.neighborId] ?? action.neighborId;
    items.push({
      severity: 'notable',
      text: NEIGHBOR_ACTION_LINE({
        neighborName,
        actionLabel: NEIGHBOR_ACTION_LABELS[action.actionType],
      }),
      targetScreen: 'diplomacy',
      category: 'diplomacy',
    });
  }

  // --- Routine: Intelligence report arrivals ---
  if (result.generatedReports.length > 0) {
    items.push({
      severity: 'routine',
      text: INTELLIGENCE_ARRIVAL_LINE({ count: result.generatedReports.length }),
      targetScreen: 'espionage',
      category: 'intelligence',
    });
  }

  // --- Routine: Treasury and food ---
  items.push({
    severity: 'routine',
    text: TREASURY_BALANCE_LINE({
      balance: result.nextState.treasury.balance,
      netFlow: result.nextState.treasury.netFlowPerTurn,
    }),
    targetScreen: 'treasury',
    category: 'treasury',
  });

  items.push({
    severity: 'routine',
    text: FOOD_RESERVES_LINE({
      reserves: result.nextState.food.reserves,
      netFlow: result.nextState.food.netFlowPerTurn,
      seasonalModifier: result.nextState.food.seasonalModifier,
    }),
    targetScreen: 'reports',
    category: 'food',
  });

  // --- Routine: Military update ---
  const readinessDelta = result.nextState.military.readiness - previousState.militaryReadiness;
  const moraleDelta = result.nextState.military.morale - previousState.militaryMorale;
  if (readinessDelta !== 0 || moraleDelta !== 0) {
    items.push({
      severity: 'routine',
      text: MILITARY_UPDATE_LINE({
        readiness: result.nextState.military.readiness,
        morale: result.nextState.military.morale,
      }),
      targetScreen: 'military',
      category: 'military',
    });
  }

  // --- Routine: New events surfaced ---
  const newUnresolved = result.nextState.activeEvents.filter((e) => !e.isResolved);
  if (newUnresolved.length > 0) {
    items.push({
      severity: 'routine',
      text: `${newUnresolved.length} new dispatch${newUnresolved.length !== 1 ? 'es' : ''} await${newUnresolved.length === 1 ? 's' : ''} your attention.`,
      targetScreen: 'events',
      category: 'event',
    });
  }

  return items;
}

function groupBySeverity(items: TurnSummaryItem[]): {
  critical: TurnSummaryItem[];
  notable: TurnSummaryItem[];
  routine: TurnSummaryItem[];
} {
  const critical: TurnSummaryItem[] = [];
  const notable: TurnSummaryItem[] = [];
  const routine: TurnSummaryItem[] = [];
  for (const item of items) {
    if (item.severity === 'critical') critical.push(item);
    else if (item.severity === 'notable') notable.push(item);
    else routine.push(item);
  }
  return { critical, notable, routine };
}

// ============================================================
// Dashboard
// ============================================================

export function Dashboard({ onNavigate }: DashboardProps) {
  const kingdom = useKingdomState();
  const crownBar = useCrownBar();
  const { advanceTurn, queuedActions, slotsRemaining } = useTurnActions();
  const lastResult = useLastTurnResult();

  const [turnPhase, setTurnPhase] = useState<TurnPhase>('idle');
  const [turnResult, setTurnResult] = useState<TurnResolutionResult | null>(null);
  // Snapshot previous state before resolution for delta computation
  const [prevSnapshot, setPrevSnapshot] = useState<{
    faithLevel: number;
    culturalCohesion: number;
    militaryReadiness: number;
    militaryMorale: number;
  } | null>(null);

  // ---- Turn advance handlers ----

  function handleAdvanceClick() {
    setTurnPhase('confirming');
  }

  function handleConfirm() {
    // Capture current state before resolution
    setPrevSnapshot({
      faithLevel: kingdom.faithCulture.faithLevel,
      culturalCohesion: kingdom.faithCulture.culturalCohesion,
      militaryReadiness: kingdom.military.readiness,
      militaryMorale: kingdom.military.morale,
    });
    const result = advanceTurn();
    setTurnResult(result);
    setTurnPhase('summary');
  }

  function handleDismissSummary() {
    setTurnResult(null);
    setPrevSnapshot(null);
    setTurnPhase('idle');
  }

  function handleSummaryItemClick(targetScreen: SummaryTargetScreen) {
    if (targetScreen) {
      handleDismissSummary();
      onNavigate(targetScreen);
    }
  }

  function handleAlertClick(screen: SummaryTargetScreen) {
    if (screen) {
      onNavigate(screen);
    }
  }

  // ---- Forecast projections ----

  const treasuryForecast: ForecastProjection[] = [
    { turnOffset: 1, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 70 },
    { turnOffset: 2, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 50 },
    { turnOffset: 3, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 30 },
  ];

  const foodForecast: ForecastProjection[] = [
    { turnOffset: 1, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 65 },
    { turnOffset: 2, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 45 },
    { turnOffset: 3, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 25 },
  ];

  const classDeltas = Object.values(PopulationClass).map(
    (cls) => kingdom.population[cls].satisfactionDeltaLastTurn,
  );
  const avgClassDelta = classDeltas.reduce((a, b) => a + b, 0) / classDeltas.length;

  const stabilityForecast: ForecastProjection[] = [
    { turnOffset: 1, direction: computeDirection(avgClassDelta), confidence: 50 },
    { turnOffset: 2, direction: computeDirection(avgClassDelta), confidence: 35 },
    { turnOffset: 3, direction: computeDirection(avgClassDelta), confidence: 20 },
  ];

  // ---- Active storylines ----

  const activeStorylines = kingdom.activeStorylines.filter(
    (s) => s.status === StorylineStatus.Active,
  );

  // ---- Failure warnings (from last turn result) ----

  const failureWarnings: FailureWarning[] = lastResult?.failureWarnings ?? [];

  // ---- Build summary if available ----

  const summaryItems = turnResult && prevSnapshot
    ? buildTurnSummaryItems(turnResult, prevSnapshot)
    : null;
  const grouped = summaryItems ? groupBySeverity(summaryItems) : null;

  return (
    <div className={styles.screen}>
      {/* Dashboard Alerts — Failure Warnings */}
      {failureWarnings.length > 0 && turnPhase === 'idle' && (
        <section className={styles.alertsSection}>
          {failureWarnings.map((fw, i) => {
            const msg = FAILURE_WARNING_MESSAGES[fw.condition];
            const screen = FAILURE_SCREEN_MAP[fw.condition] as SummaryTargetScreen;
            return (
              <button
                key={i}
                className={styles.alertItem}
                data-severity={fw.severity}
                onClick={() => handleAlertClick(screen)}
                aria-label={`${fw.severity} warning: ${msg[fw.severity]}`}
              >
                <span className={styles.alertSeverityBadge} data-severity={fw.severity}>
                  {fw.severity === 'critical' ? 'Critical' : 'Caution'}
                </span>
                <span className={styles.alertText}>{msg[fw.severity]}</span>
                <span className={styles.summaryNavArrow}>{'\u203A'}</span>
              </button>
            );
          })}
        </section>
      )}

      {/* Resource Summary Row */}
      <div className={styles.resourceRow}>
        <ResourceCard
          label="Treasury"
          value={kingdom.treasury.balance}
          netFlow={kingdom.treasury.netFlowPerTurn}
          maxValue={1000}
        />
        <ResourceCard
          label="Food Reserves"
          value={kingdom.food.reserves}
          netFlow={kingdom.food.netFlowPerTurn}
          maxValue={500}
        />
        <ResourceCard
          label="Stability"
          value={kingdom.stability.value}
          netFlow={0}
          maxValue={100}
          interpretation={
            kingdom.stability.value < 30 ? 'Declining order' : undefined
          }
        />
      </div>

      {/* Class Satisfaction Grid */}
      <section>
        <h2 className={styles.sectionLabel}><Icon name="society" size="0.875rem" /> Population Sentiment</h2>
        <div className={styles.classGrid}>
          {Object.values(PopulationClass).map((cls) => {
            const classState = kingdom.population[cls];
            const status = getSatisfactionStatus(classState.satisfaction);
            const deltaStyleKey = getDeltaStyle(classState.satisfactionDeltaLastTurn);

            return (
              <div
                key={cls}
                className={styles.classCard}
                data-status={status.dataStatus}
              >
                <span className={styles.className}>{CLASS_LABELS[cls]}</span>
                <span className={styles.classSatisfaction}>
                  {classState.satisfaction}
                </span>
                <span className={styles[deltaStyleKey as keyof typeof styles]}>
                  {formatDelta(classState.satisfactionDeltaLastTurn)}
                </span>
                <span className={styles[status.styleKey as keyof typeof styles]}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kingdom Condition Row */}
      <div className={styles.conditionRow}>
        <div className={styles.conditionCard}>
          <span className={styles.conditionLabel}>Faith</span>
          <span className={styles.conditionValue}>
            {kingdom.faithCulture.faithLevel}
          </span>
          {kingdom.faithCulture.schismActive && (
            <span className={styles.schismWarning}>Schism Active</span>
          )}
        </div>
        <div className={styles.conditionCard}>
          <span className={styles.conditionLabel}>Cultural Cohesion</span>
          <span className={styles.conditionValue}>
            {kingdom.faithCulture.culturalCohesion}
          </span>
        </div>

        {activeStorylines.map((storyline) => {
          const text = STORYLINE_TEXT[storyline.definitionId];
          return (
            <div key={storyline.id} className={styles.storylineCard}>
              <span className={styles.conditionLabel}>Active Storyline</span>
              <span className={styles.storylineTitle}>
                {text?.title ?? storyline.definitionId}
              </span>
              <span className={styles.storylineNote}>
                {text?.statusNote ?? ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Urgent Matters Banner */}
      {crownBar.unresolvedUrgentMatters > 0 && (
        <button
          className={styles.urgentBanner}
          onClick={() => onNavigate('events')}
          aria-label={`${crownBar.unresolvedUrgentMatters} urgent matters require attention`}
        >
          <span className={styles.urgentCount}>
            {crownBar.unresolvedUrgentMatters}
          </span>
          <span className={styles.urgentText}>
            urgent matter{crownBar.unresolvedUrgentMatters !== 1 ? 's' : ''} require{crownBar.unresolvedUrgentMatters === 1 ? 's' : ''} your attention
          </span>
        </button>
      )}

      {/* Forecast Area */}
      <section>
        <h2 className={styles.sectionLabel}><Icon name="compass" size="0.875rem" /> Strategic Forecast</h2>
        <div className={styles.forecastArea}>
          <ForecastModule
            title="Treasury Outlook"
            projections={treasuryForecast}
            summary={
              kingdom.treasury.netFlowPerTurn >= 0
                ? 'Revenue exceeds expenditure.'
                : 'Expenditure exceeds revenue.'
            }
          />
          <ForecastModule
            title="Food Supply Outlook"
            projections={foodForecast}
            summary={
              kingdom.food.netFlowPerTurn >= 0
                ? 'Reserves are accumulating.'
                : 'Reserves are depleting.'
            }
          />
          <ForecastModule
            title="Stability Outlook"
            projections={stabilityForecast}
            summary={
              avgClassDelta >= 0
                ? 'Population sentiment is holding steady.'
                : 'Population discontent is growing.'
            }
          />
        </div>
      </section>

      {/* Turn Advance Section */}
      <div className={styles.turnAdvance}>
        <button className={styles.advanceButton} onClick={handleAdvanceClick}>
          <Icon name="hourglass" size="1.125rem" /> {ADVANCE_TURN_LABEL}
        </button>
      </div>

      {/* Confirmation Overlay */}
      {turnPhase === 'confirming' && (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
          <div className={styles.confirmCard}>
            <h2 className={styles.confirmTitle}>{ADVANCE_TURN_LABEL}</h2>

            <p className={styles.confirmSection}>
              Current season: <strong>{SEASON_LABELS[crownBar.season]}</strong>,
              Year {crownBar.year}
            </p>

            {queuedActions.length > 0 && (
              <div className={styles.confirmSection}>
                <strong>Queued actions ({queuedActions.length}):</strong>
                <ul>
                  {queuedActions.map((a) => (
                    <li key={a.id}>{ACTION_TYPE_LABELS[a.type]}</li>
                  ))}
                </ul>
              </div>
            )}

            {slotsRemaining > 0 && (
              <p className={styles.confirmWarning}>
                {slotsRemaining} action slot{slotsRemaining !== 1 ? 's' : ''} unused this turn.
              </p>
            )}

            {crownBar.unresolvedUrgentMatters > 0 && (
              <p className={styles.confirmWarning}>
                {crownBar.unresolvedUrgentMatters} urgent matter{crownBar.unresolvedUrgentMatters !== 1 ? 's' : ''} remain unresolved.
              </p>
            )}

            <div className={styles.confirmActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setTurnPhase('idle')}
              >
                {CANCEL_LABEL}
              </button>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                {CONFIRM_LABEL}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turn Summary Overlay */}
      {turnPhase === 'summary' && grouped && (
        <div className={styles.summaryOverlay} role="dialog" aria-modal="true">
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>{TURN_SUMMARY_HEADER}</h2>

            {grouped.critical.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryCritical}>
                  {TURN_SUMMARY_CRITICAL_SECTION}
                </h3>
                {grouped.critical.map((item, i) => (
                  <SummaryItemRow
                    key={i}
                    item={item}
                    onClick={handleSummaryItemClick}
                    isCritical
                  />
                ))}
              </div>
            )}

            {grouped.notable.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryNotable}>
                  {TURN_SUMMARY_NOTABLE_SECTION}
                </h3>
                {grouped.notable.map((item, i) => (
                  <SummaryItemRow
                    key={i}
                    item={item}
                    onClick={handleSummaryItemClick}
                  />
                ))}
              </div>
            )}

            {grouped.routine.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryRoutine}>
                  {TURN_SUMMARY_ROUTINE_SECTION}
                </h3>
                {grouped.routine.map((item, i) => (
                  <SummaryItemRow
                    key={i}
                    item={item}
                    onClick={handleSummaryItemClick}
                  />
                ))}
              </div>
            )}

            <button
              className={styles.summaryDismiss}
              onClick={handleDismissSummary}
            >
              Return to Kingdom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Summary Item Row — clickable if it has a target screen
// ============================================================

function SummaryItemRow({
  item,
  onClick,
  isCritical,
}: {
  item: TurnSummaryItem;
  onClick: (screen: SummaryTargetScreen) => void;
  isCritical?: boolean;
}) {
  if (item.targetScreen) {
    return (
      <button
        className={isCritical ? styles.summaryItemNavigableCritical : styles.summaryItemNavigable}
        onClick={() => onClick(item.targetScreen)}
        aria-label={`${item.text} — navigate to ${item.targetScreen}`}
      >
        <span>{item.text}</span>
        <span className={styles.summaryNavArrow}>{'\u203A'}</span>
      </button>
    );
  }

  return (
    <p className={isCritical ? styles.summaryItemCritical : styles.summaryItem}>
      {item.text}
    </p>
  );
}
