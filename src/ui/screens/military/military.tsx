// Phase 5 — Military Screen: military affairs, readiness, and order issuance.
// Blueprint Reference: ui-blueprint.md §4.7; ux-blueprint.md §4, §6

import { useState, useCallback } from 'react';

import {
  ActionType,
  MilitaryPosture,
  PopulationClass,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  MILITARY_POSTURE_LABELS,
  RECRUITMENT_STANCE_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import {
  RECRUITMENT_EFFECT,
  MILITARY_READINESS_LOW_WARNING,
} from '../../../data/text/reports';
import styles from './military.module.css';

// ============================================================
// Constants
// ============================================================

const READINESS_TRAINING_BOOST = 20;
const READINESS_TRAINING_SLOT_COST = 1;
const POSTURE_CHANGE_SLOT_COST = 1;

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;
function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

function getGaugeStatus(value: number): string {
  if (value >= 70) return 'good';
  if (value >= 40) return 'fair';
  return 'poor';
}

function formatUpkeep(value: number): string {
  return `${Math.round(value)} coin / month`;
}

const POSTURE_EFFECT_LABELS: Record<MilitaryPosture, string> = {
  [MilitaryPosture.Defensive]: 'Conserves resources. Focuses on fortification and garrison duty.',
  [MilitaryPosture.Standby]: 'Balanced footing. Forces ready to mobilize with short notice.',
  [MilitaryPosture.Mobilized]: 'Forces fully deployed. Higher upkeep; ready for rapid response.',
  [MilitaryPosture.Aggressive]: 'Offensive posture. Maximum force projection; costly and diplomatically provocative.',
};

// ============================================================
// Military Screen
// ============================================================

export function Military() {
  const kingdom = useKingdomState();
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const mil = kingdom.military;
  const recruitment = kingdom.policies.militaryRecruitmentStance;
  const casteState = kingdom.population[PopulationClass.MilitaryCaste];

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  // ---- Change deployment posture ----

  const handlePostureChange = useCallback(
    (posture: MilitaryPosture) => {
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.MilitaryOrder,
        actionDefinitionId: `military_posture_${posture}`,
        slotCost: POSTURE_CHANGE_SLOT_COST,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: { postureChange: posture },
      };
      const error = queueAction(action);
      if (error) showError(BUDGET_ERROR_LABELS[error.code] ?? 'Order could not be issued.');
    },
    [queueAction, showError],
  );

  // ---- Order readiness training ----

  const handleReadinessTraining = useCallback(() => {
    const action: QueuedAction = {
      id: generateActionId(),
      type: ActionType.MilitaryOrder,
      actionDefinitionId: 'military_readiness_training',
      slotCost: READINESS_TRAINING_SLOT_COST,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: { readinessBoost: READINESS_TRAINING_BOOST },
    };
    const error = queueAction(action);
    if (error) showError(BUDGET_ERROR_LABELS[error.code] ?? 'Order could not be issued.');
  }, [queueAction, showError]);

  const canIssueOrder = !isBudgetExhausted && slotsRemaining >= 1;
  const trainingDisabled = !canIssueOrder || mil.readiness >= 80;

  return (
    <div className={styles.screen}>
      {/* Readiness Warning */}
      {mil.readiness < 30 && (
        <div className={styles.warningBanner} data-level="critical" role="alert">
          <span className={styles.warningText}>
            {MILITARY_READINESS_LOW_WARNING}
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Strategic Overview Gauges */}
      <section>
        <h2 className={styles.sectionLabel}>Strategic Readiness</h2>
        <div className={styles.gaugeGrid}>
          <GaugeCard label="Readiness" value={mil.readiness} max={100} />
          <GaugeCard label="Equipment" value={mil.equipmentCondition} max={100} />
          <GaugeCard label="Morale" value={mil.morale} max={100} />
          <GaugeCard label="Intel Advantage" value={mil.intelligenceAdvantage} max={100} />
        </div>
      </section>

      {/* Force Summary */}
      <section>
        <h2 className={styles.sectionLabel}>Force Summary</h2>
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Force Size</span>
            <span className={styles.summaryValue}>
              {mil.forceSize.toLocaleString()} soldiers
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Deployment Posture</span>
            <span className={styles.summaryValue}>
              {MILITARY_POSTURE_LABELS[mil.deploymentPosture]}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Monthly Upkeep</span>
            <span className={styles.summaryValue}>
              {formatUpkeep(mil.upkeepBurdenPerTurn)}
            </span>
          </div>
        </div>
      </section>

      {/* Recruitment & Caste */}
      <section>
        <h2 className={styles.sectionLabel}>Recruitment & Personnel</h2>
        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <span className={styles.detailTitle}>Recruitment Stance</span>
            <span className={styles.detailValue}>
              {RECRUITMENT_STANCE_LABELS[recruitment]}
            </span>
            <p className={styles.detailText}>
              {RECRUITMENT_EFFECT[recruitment]}
            </p>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailTitle}>Military Caste</span>
            <div className={styles.casteRow}>
              <span className={styles.detailValue}>
                Satisfaction: {casteState.satisfaction}
              </span>
              <span className={styles.detailValue}>
                Quality: {mil.militaryCasteQuality}
              </span>
            </div>
            <span className={styles.detailValue}>
              {casteState.population.toLocaleString()} personnel
            </span>
          </div>
        </div>
      </section>

      {/* Issue Orders */}
      <section>
        <h2 className={styles.sectionLabel}>Issue Orders</h2>

        {/* Change Deployment Posture */}
        <div className={styles.orderCard}>
          <span className={styles.orderTitle}>Change Deployment Posture</span>
          <p className={styles.orderDescription}>
            Reposition forces between operational stances. Each posture affects upkeep, readiness, and diplomatic perception. Costs 1 action slot.
          </p>
          <div className={styles.postureGrid}>
            {Object.values(MilitaryPosture).map((posture) => {
              const isCurrent = posture === mil.deploymentPosture;
              return (
                <button
                  key={posture}
                  className={styles.postureButton}
                  data-current={isCurrent ? 'true' : 'false'}
                  disabled={isCurrent || !canIssueOrder}
                  onClick={() => handlePostureChange(posture)}
                  title={POSTURE_EFFECT_LABELS[posture]}
                >
                  <span className={styles.postureLabel}>{MILITARY_POSTURE_LABELS[posture]}</span>
                  <span className={styles.postureEffect}>{POSTURE_EFFECT_LABELS[posture]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Readiness Training */}
        <div className={styles.orderCard}>
          <span className={styles.orderTitle}>Order Readiness Training</span>
          <p className={styles.orderDescription}>
            Direct the military caste to conduct intensive readiness drills.
            {mil.readiness >= 80
              ? ' Forces are already at peak readiness.'
              : ` Increases readiness by ${READINESS_TRAINING_BOOST}. Costs 1 action slot.`}
          </p>
          <button
            className={styles.actionButton}
            disabled={trainingDisabled}
            onClick={handleReadinessTraining}
          >
            Order Training
            <span className={styles.slotCost}>1 slot</span>
          </button>
          {mil.readiness < 80 && (
            <span className={styles.effectPreview}>
              Readiness: {mil.readiness} → {Math.min(mil.readiness + READINESS_TRAINING_BOOST, 100)}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function GaugeCard({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const status = getGaugeStatus(value);

  return (
    <div className={styles.gaugeCard}>
      <span className={styles.gaugeLabel}>{label}</span>
      <div className={styles.gaugeValueRow}>
        <span className={styles.gaugeValue}>{value}</span>
        <span className={styles.gaugeMax}>/ {max}</span>
      </div>
      <div className={styles.gaugeBarTrack}>
        <div
          className={styles.gaugeBarFill}
          data-status={status}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
