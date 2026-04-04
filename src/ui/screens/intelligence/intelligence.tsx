// Phase 5 — Intelligence Screen: espionage network and operation launch.
// Blueprint Reference: ui-blueprint.md §4.10; ux-blueprint.md §4, §6
// Maps to ScreenId 'espionage' in app.tsx.
// CRITICAL: Never surface isGenuine field from IntelligenceReport.

import { useState, useCallback } from 'react';

import {
  ActionType,
  DiplomaticPosture,
  IntelligenceOperationType,
  type IntelligenceReport,
  type QueuedAction,
} from '../../../engine/types';
import {
  ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE,
} from '../../../engine/constants';
import { useKingdomState, useIntelligenceReports } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  INTELLIGENCE_FUNDING_LABELS,
  INTELLIGENCE_OP_LABELS,
  INTELLIGENCE_OP_DESCRIPTIONS,
  INTELLIGENCE_OP_RISK_LABELS,
  INTELLIGENCE_SUCCESS_TIERS,
  NEIGHBOR_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import styles from './intelligence.module.css';

// ============================================================
// Constants
// ============================================================

// Ops that target the internal kingdom — no neighbor selection needed
const INTERNAL_OPS = new Set([
  IntelligenceOperationType.InternalSurveillance,
  IntelligenceOperationType.CounterEspionageSweep,
]);

// Upfront treasury cost for external ops
const EXTERNAL_OP_INITIATION_COST = 10;

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
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const espionage = kingdom.espionage;
  const fundingLevel = kingdom.policies.intelligenceFundingLevel;
  const neighbors = kingdom.diplomacy.neighbors;

  // Launch workflow state
  const [selectedOpType, setSelectedOpType] = useState<IntelligenceOperationType | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAct = !isBudgetExhausted && slotsRemaining >= 1;

  const sortedReports = [...reports].sort(
    (a, b) => b.turnGenerated - a.turnGenerated,
  );

  // Non-war neighbors available as targets
  const availableTargets = neighbors.filter(
    (n) => n.attitudePosture !== DiplomaticPosture.War,
  );

  // ---- Open launch panel ----
  const handleOpenLaunch = useCallback((opType: IntelligenceOperationType) => {
    setSelectedOpType(opType);
    setSelectedTargetId(null);
    setErrorMessage(null);
    // Internal ops skip target selection — auto-confirm immediately ready
  }, []);

  // ---- Cancel launch ----
  const handleCancelLaunch = useCallback(() => {
    setSelectedOpType(null);
    setSelectedTargetId(null);
    setErrorMessage(null);
  }, []);

  // ---- Confirm launch ----
  const handleConfirmLaunch = useCallback(() => {
    if (selectedOpType === null) return;

    const isInternalOp = INTERNAL_OPS.has(selectedOpType);
    const targetId = isInternalOp ? null : selectedTargetId;

    if (!isInternalOp && targetId === null) return; // target required

    const initiationCost = isInternalOp ? 0 : EXTERNAL_OP_INITIATION_COST;

    const action: QueuedAction = {
      id: generateActionId(),
      type: ActionType.IntelligenceOp,
      actionDefinitionId: `intel_${selectedOpType}`,
      slotCost: 1,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: targetId,
      parameters: {
        operationType: selectedOpType,
        ...(initiationCost > 0 ? { initiationCost } : {}),
      },
    };

    const error = queueAction(action);
    if (error) {
      setErrorMessage(BUDGET_ERROR_LABELS[error.code] ?? 'Operation could not be launched.');
      return;
    }

    // Reset launch state on success
    setSelectedOpType(null);
    setSelectedTargetId(null);
    setErrorMessage(null);
  }, [selectedOpType, selectedTargetId, queueAction]);

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

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Available Operations */}
      <section>
        <h2 className={styles.sectionLabel}>Available Operations</h2>
        <div className={styles.opGrid}>
          {Object.values(IntelligenceOperationType).map((opType) => {
            const baseProbability = ESPIONAGE_BASE_SUCCESS_BY_OP_TYPE[opType];
            const tier = getSuccessTier(baseProbability);
            const isExpanded = selectedOpType === opType;
            const opIsInternal = INTERNAL_OPS.has(opType);

            return (
              <div
                key={opType}
                className={styles.opCard}
                data-expanded={isExpanded ? 'true' : 'false'}
              >
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
                  {!opIsInternal && (
                    <span className={styles.opCost}>
                      {EXTERNAL_OP_INITIATION_COST} coin
                    </span>
                  )}
                </div>
                <div className={styles.opRisk}>
                  <span className={styles.riskLabel}>Risk on failure:</span>
                  <span className={styles.riskText}>
                    {INTELLIGENCE_OP_RISK_LABELS[opType]}
                  </span>
                </div>

                {/* Launch workflow */}
                {isExpanded ? (
                  <div className={styles.launchPanel}>
                    {opIsInternal ? (
                      /* Internal ops — no target needed */
                      <div className={styles.confirmRow}>
                        <p className={styles.confirmSummary}>
                          This operation targets the internal kingdom.
                          No treasury cost. Costs 1 action slot.
                        </p>
                        <div className={styles.confirmButtons}>
                          <button
                            className={styles.launchButton}
                            disabled={!canAct}
                            onClick={handleConfirmLaunch}
                          >
                            Launch Operation
                            <span className={styles.slotCost}>1 slot</span>
                          </button>
                          <button
                            className={styles.cancelText}
                            onClick={handleCancelLaunch}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* External ops — target selection required */
                      <>
                        <div className={styles.targetPicker}>
                          <span className={styles.targetLabel}>Select Target Kingdom:</span>
                          {availableTargets.length === 0 ? (
                            <p className={styles.noTargetsNote}>
                              No available targets. All neighbors are at war.
                            </p>
                          ) : (
                            availableTargets.map((n) => (
                              <button
                                key={n.id}
                                className={styles.targetOption}
                                data-selected={selectedTargetId === n.id ? 'true' : 'false'}
                                onClick={() => setSelectedTargetId(n.id)}
                              >
                                {getTargetName(n.id)}
                              </button>
                            ))
                          )}
                        </div>
                        {selectedTargetId && (
                          <div className={styles.confirmRow}>
                            <p className={styles.confirmSummary}>
                              Target: <strong>{getTargetName(selectedTargetId)}</strong>.
                              Initiation cost: {EXTERNAL_OP_INITIATION_COST} coin.
                              Costs 1 action slot.
                            </p>
                            <div className={styles.confirmButtons}>
                              <button
                                className={styles.launchButton}
                                disabled={!canAct}
                                onClick={handleConfirmLaunch}
                              >
                                Confirm Launch
                                <span className={styles.slotCost}>1 slot</span>
                              </button>
                              <button
                                className={styles.cancelText}
                                onClick={handleCancelLaunch}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        {!selectedTargetId && (
                          <button
                            className={styles.cancelText}
                            onClick={handleCancelLaunch}
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    className={styles.launchButton}
                    disabled={!canAct}
                    onClick={() => handleOpenLaunch(opType)}
                  >
                    Launch
                    <span className={styles.slotCost}>1 slot</span>
                  </button>
                )}
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
