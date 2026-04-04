// Phase 10 — Dashboard Screen: kingdom overview and turn advance flow.
// Blueprint Reference: ui-blueprint.md §5.1; ux-blueprint.md §2, §4

import { useState } from 'react';

import {
  PopulationClass,
  StorylineStatus,
} from '../../../engine/types';
import type { TurnResolutionResult } from '../../../engine/resolution/turn-resolution';
import {
  SATISFACTION_BREAKING_POINT,
  SATISFACTION_CRISIS_WARNING,
} from '../../../engine/constants';
import {
  useKingdomState,
  useCrownBar,
} from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  CLASS_LABELS,
  SEASON_LABELS,
  ACTION_TYPE_LABELS,
  KNOWLEDGE_BRANCH_LABELS,
  ADVANCE_TURN_LABEL,
  CONFIRM_LABEL,
  CANCEL_LABEL,
} from '../../../data/text/labels';
import {
  TURN_SUMMARY_HEADER,
  TURN_SUMMARY_CRITICAL_SECTION,
  TURN_SUMMARY_NOTABLE_SECTION,
  TURN_SUMMARY_ROUTINE_SECTION,
  TREASURY_BALANCE_LINE,
  FOOD_RESERVES_LINE,
  FAILURE_CONDITION_REPORTS,
} from '../../../data/text/reports';
import { STORYLINE_TEXT } from '../../../data/text/events';
import { ResourceCard } from '../../components/resource-card/resource-card';
import { ForecastModule, type ForecastProjection } from '../../components/forecast-module/forecast-module';
import styles from './dashboard.module.css';

// ============================================================
// Props
// ============================================================

interface DashboardProps {
  onNavigateToEvents: () => void;
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

function buildTurnSummaryItems(result: TurnResolutionResult): {
  critical: string[];
  notable: string[];
  routine: string[];
} {
  const critical: string[] = [];
  const notable: string[] = [];
  const routine: string[] = [];

  // Failure conditions are always critical
  for (const fc of result.triggeredFailureConditions) {
    critical.push(FAILURE_CONDITION_REPORTS[fc]);
  }

  // Check class satisfactions in the new state
  const pop = result.nextState.population;
  for (const cls of Object.values(PopulationClass)) {
    const classState = pop[cls];
    if (classState.satisfaction < SATISFACTION_BREAKING_POINT) {
      critical.push(
        `${CLASS_LABELS[cls]} sentiment has fallen to critical levels (${classState.satisfaction}).`,
      );
    } else if (
      classState.satisfactionDeltaLastTurn !== 0 &&
      classState.satisfaction < SATISFACTION_CRISIS_WARNING
    ) {
      notable.push(
        `${CLASS_LABELS[cls]} sentiment is at ${classState.satisfaction} (${classState.satisfactionDeltaLastTurn >= 0 ? '+' : ''}${classState.satisfactionDeltaLastTurn}).`,
      );
    }
  }

  // Milestone unlocks are notable
  for (const milestone of result.newlyUnlockedMilestones) {
    notable.push(
      `A milestone has been reached in ${KNOWLEDGE_BRANCH_LABELS[milestone.branch]} \u2014 advancement tier ${milestone.milestoneIndex + 1}.`,
    );
  }

  // Treasury and food are routine
  routine.push(
    TREASURY_BALANCE_LINE({
      balance: result.nextState.treasury.balance,
      netFlow: result.nextState.treasury.netFlowPerTurn,
    }),
  );

  routine.push(
    FOOD_RESERVES_LINE({
      reserves: result.nextState.food.reserves,
      netFlow: result.nextState.food.netFlowPerTurn,
      seasonalModifier: result.nextState.food.seasonalModifier,
    }),
  );

  // New events surfaced
  const newUnresolved = result.nextState.activeEvents.filter((e) => !e.isResolved);
  if (newUnresolved.length > 0) {
    routine.push(
      `${newUnresolved.length} new dispatch${newUnresolved.length !== 1 ? 'es' : ''} await${newUnresolved.length === 1 ? 's' : ''} your attention.`,
    );
  }

  return { critical, notable, routine };
}

// ============================================================
// Dashboard
// ============================================================

export function Dashboard({ onNavigateToEvents }: DashboardProps) {
  const kingdom = useKingdomState();
  const crownBar = useCrownBar();
  const { advanceTurn, queuedActions, slotsRemaining } = useTurnActions();

  const [turnPhase, setTurnPhase] = useState<TurnPhase>('idle');
  const [turnResult, setTurnResult] = useState<TurnResolutionResult | null>(null);

  // ---- Turn advance handlers ----

  function handleAdvanceClick() {
    setTurnPhase('confirming');
  }

  function handleConfirm() {
    const result = advanceTurn();
    setTurnResult(result);
    setTurnPhase('summary');
  }

  function handleDismissSummary() {
    setTurnResult(null);
    setTurnPhase('idle');
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

  // Average class satisfaction delta for stability forecast
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

  // ---- Build summary if available ----

  const summaryItems = turnResult
    ? buildTurnSummaryItems(turnResult)
    : null;

  return (
    <div className={styles.screen}>
      {/* Resource Summary Row */}
      <div className={styles.resourceRow}>
        <ResourceCard
          label="Treasury"
          value={kingdom.treasury.balance}
          netFlow={kingdom.treasury.netFlowPerTurn}
        />
        <ResourceCard
          label="Food Reserves"
          value={kingdom.food.reserves}
          netFlow={kingdom.food.netFlowPerTurn}
        />
        <ResourceCard
          label="Stability"
          value={kingdom.stability.value}
          netFlow={0}
          interpretation={
            kingdom.stability.value < 30 ? 'Declining order' : undefined
          }
        />
      </div>

      {/* Class Satisfaction Grid */}
      <section>
        <h2 className={styles.sectionLabel}>Population Sentiment</h2>
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
          onClick={onNavigateToEvents}
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
        <h2 className={styles.sectionLabel}>Strategic Forecast</h2>
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
          {ADVANCE_TURN_LABEL}
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
      {turnPhase === 'summary' && summaryItems && (
        <div className={styles.summaryOverlay} role="dialog" aria-modal="true">
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>{TURN_SUMMARY_HEADER}</h2>

            {summaryItems.critical.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryCritical}>
                  {TURN_SUMMARY_CRITICAL_SECTION}
                </h3>
                {summaryItems.critical.map((item, i) => (
                  <p key={i} className={styles.summaryItemCritical}>{item}</p>
                ))}
              </div>
            )}

            {summaryItems.notable.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryNotable}>
                  {TURN_SUMMARY_NOTABLE_SECTION}
                </h3>
                {summaryItems.notable.map((item, i) => (
                  <p key={i} className={styles.summaryItem}>{item}</p>
                ))}
              </div>
            )}

            {summaryItems.routine.length > 0 && (
              <div className={styles.summarySection}>
                <h3 className={styles.summaryRoutine}>
                  {TURN_SUMMARY_ROUTINE_SECTION}
                </h3>
                {summaryItems.routine.map((item, i) => (
                  <p key={i} className={styles.summaryItem}>{item}</p>
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
