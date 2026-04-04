// Phase 12 — Intelligence Screen: espionage network and operations.
// Blueprint Reference: ui-blueprint.md §4.10; ux-blueprint.md §6
// Maps to ScreenId 'espionage' in app.tsx.
// CRITICAL: Never surface isGenuine field from IntelligenceReport.

import {
  IntelligenceOperationType,
  type IntelligenceReport,
} from '../../../engine/types';
import {
  ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE,
} from '../../../engine/constants';
import { useKingdomState, useIntelligenceReports } from '../../hooks/use-game-state';
import {
  INTELLIGENCE_FUNDING_LABELS,
  INTELLIGENCE_OP_LABELS,
  INTELLIGENCE_OP_DESCRIPTIONS,
  INTELLIGENCE_OP_RISK_LABELS,
  INTELLIGENCE_SUCCESS_TIERS,
  NEIGHBOR_LABELS,
} from '../../../data/text/labels';
import styles from './intelligence.module.css';

// ============================================================
// Helpers
// ============================================================

function getGaugeStatus(value: number): string {
  if (value >= 70) return 'good';
  if (value >= 40) return 'fair';
  return 'poor';
}

function getSuccessTier(baseProbability: number): string {
  if (baseProbability >= 0.7) return 'favorable';
  if (baseProbability >= 0.55) return 'moderate';
  if (baseProbability >= 0.4) return 'difficult';
  return 'perilous';
}

function getConfidenceLabel(level: number): string {
  if (level >= 80) return 'High';
  if (level >= 50) return 'Moderate';
  if (level >= 25) return 'Low';
  return 'Unreliable';
}

function getConfidenceStatus(level: number): string {
  if (level >= 80) return 'good';
  if (level >= 50) return 'fair';
  return 'poor';
}

function getTargetName(targetId: string): string {
  return NEIGHBOR_LABELS[targetId] ?? targetId;
}

// ============================================================
// Intelligence Screen
// ============================================================

export function Intelligence() {
  const kingdom = useKingdomState();
  const reports = useIntelligenceReports();
  const espionage = kingdom.espionage;
  const fundingLevel = kingdom.policies.intelligenceFundingLevel;

  const sortedReports = [...reports].sort(
    (a, b) => b.turnGenerated - a.turnGenerated,
  );

  return (
    <div className={styles.screen} data-domain="intelligence">
      {/* Network Gauges */}
      <section>
        <h2 className={styles.sectionLabel}>Network Status</h2>
        <div className={styles.gaugeGrid}>
          <GaugeCard
            label="Network Strength"
            value={espionage.networkStrength}
            max={100}
          />
          <GaugeCard
            label="Counter-Intelligence"
            value={espionage.counterIntelligenceLevel}
            max={100}
          />
        </div>
        <div className={styles.fundingRow}>
          <span className={styles.fundingLabel}>Current Funding</span>
          <span className={styles.fundingValue}>
            {INTELLIGENCE_FUNDING_LABELS[fundingLevel]}
          </span>
        </div>
      </section>

      {/* Available Operations */}
      <section>
        <h2 className={styles.sectionLabel}>Available Operations</h2>
        <div className={styles.opGrid}>
          {Object.values(IntelligenceOperationType).map((opType) => {
            const baseProbability = ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE[opType];
            const tier = getSuccessTier(baseProbability);

            return (
              <div key={opType} className={styles.opCard}>
                <span className={styles.opName}>
                  {INTELLIGENCE_OP_LABELS[opType]}
                </span>
                <p className={styles.opDescription}>
                  {INTELLIGENCE_OP_DESCRIPTIONS[opType]}
                </p>
                <div className={styles.opMeta}>
                  <span className={styles.opTier} data-tier={tier}>
                    {INTELLIGENCE_SUCCESS_TIERS[tier]}
                  </span>
                </div>
                <div className={styles.opRisk}>
                  <span className={styles.riskLabel}>Risk on failure:</span>
                  <span className={styles.riskText}>
                    {INTELLIGENCE_OP_RISK_LABELS[opType]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Intelligence Reports Feed */}
      <section>
        <h2 className={styles.sectionLabel}>
          Intelligence Briefings ({reports.length})
        </h2>
        {sortedReports.length === 0 ? (
          <p className={styles.emptyState}>
            No intelligence reports have been received. Fund the intelligence
            network and commission operations to gather information.
          </p>
        ) : (
          <div className={styles.reportList}>
            {sortedReports.map((report) => (
              <ReportItem key={report.id} report={report} />
            ))}
          </div>
        )}
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

function ReportItem({ report }: { report: IntelligenceReport }) {
  const confidenceLabel = getConfidenceLabel(report.confidenceLevel);
  const confidenceStatus = getConfidenceStatus(report.confidenceLevel);

  return (
    <div
      className={styles.reportItem}
      data-correction={report.isCorrectionPending ? 'true' : 'false'}
    >
      <div className={styles.reportHeader}>
        <span className={styles.reportType}>
          {INTELLIGENCE_OP_LABELS[report.operationType]}
        </span>
        <span className={styles.reportTurn}>Turn {report.turnGenerated}</span>
      </div>
      <span className={styles.reportTarget}>
        Target: {getTargetName(report.targetId)}
      </span>
      <div className={styles.reportConfidence}>
        <span className={styles.confidenceLabel}>Confidence</span>
        <span className={styles.confidenceValue} data-status={confidenceStatus}>
          {confidenceLabel} ({report.confidenceLevel})
        </span>
        <div className={styles.confidenceBarTrack}>
          <div
            className={styles.confidenceBarFill}
            data-status={confidenceStatus}
            style={{ width: `${report.confidenceLevel}%` }}
          />
        </div>
      </div>
      {report.isCorrectionPending && (
        <span className={styles.correctionBadge}>
          Updated Intelligence — Prior assessment revised
        </span>
      )}
    </div>
  );
}
