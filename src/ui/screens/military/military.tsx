// Phase 12 — Military Screen: military affairs and readiness.
// Blueprint Reference: ui-blueprint.md §4.7; ux-blueprint.md §6

import { PopulationClass } from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  MILITARY_POSTURE_LABELS,
  RECRUITMENT_STANCE_LABELS,
} from '../../../data/text/labels';
import {
  RECRUITMENT_EFFECT,
  MILITARY_READINESS_LOW_WARNING,
} from '../../../data/text/reports';
import styles from './military.module.css';

// ============================================================
// Helpers
// ============================================================

function getGaugeStatus(value: number): string {
  if (value >= 70) return 'good';
  if (value >= 40) return 'fair';
  return 'poor';
}

function formatUpkeep(value: number): string {
  return `${Math.round(value)} coin / month`;
}

// ============================================================
// Military Screen
// ============================================================

export function Military() {
  const kingdom = useKingdomState();
  const mil = kingdom.military;
  const recruitment = kingdom.policies.militaryRecruitmentStance;
  const casteState = kingdom.population[PopulationClass.MilitaryCaste];

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
