// Phase 5 — Trade Screen: treasury, commerce, and trade agreement management.
// Blueprint Reference: ui-blueprint.md §4.8; ux-blueprint.md §4, §6
// Maps to ScreenId 'treasury' in app.tsx.

import { useState, useCallback } from 'react';

import {
  ActionType,
  DiplomaticPosture,
  PopulationClass,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  TRADE_OPENNESS_LABELS,
  NEIGHBOR_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import {
  TREASURY_BALANCE_LINE,
  TRADE_OPENNESS_EFFECT,
  TREASURY_INSOLVENT_WARNING,
  TREASURY_LOW_WARNING,
} from '../../../data/text/reports';
import styles from './trade.module.css';

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;
function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

function getNeighborName(id: string): string {
  return NEIGHBOR_LABELS[id] ?? id;
}

function getFlowDirection(value: number): string {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

function formatCoin(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${Math.round(value)}`;
}

// ============================================================
// Trade Screen
// ============================================================

export function Trade() {
  const kingdom = useKingdomState();
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const treasury = kingdom.treasury;
  const tradeOpenness = kingdom.policies.tradeOpenness;
  const merchantState = kingdom.population[PopulationClass.Merchants];
  const neighbors = kingdom.diplomacy.neighbors;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelConfirming, setCancelConfirming] = useState<string | null>(null);

  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const canAct = !isBudgetExhausted && slotsRemaining >= 1;

  const friendlyNeighbors = neighbors.filter((n) => n.relationshipScore > 70);

  const allAgreements = neighbors.flatMap((n) =>
    n.activeAgreements.map((a) => ({ ...a, neighborName: getNeighborName(n.id), neighborId: n.id })),
  );

  // ---- Initiate trade agreement ----

  const handleInitiateAgreement = useCallback(
    (neighborId: string) => {
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.TradeAction,
        actionDefinitionId: `trade_initiate_${neighborId}`,
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: neighborId,
        parameters: { tradeActionType: 'initiate_agreement' },
      };
      const error = queueAction(action);
      if (error) showError(BUDGET_ERROR_LABELS[error.code] ?? 'Trade action could not be queued.');
    },
    [queueAction, showError],
  );

  // ---- Cancel trade agreement ----

  const handleCancelAgreement = useCallback(
    (neighborId: string, agreementId: string) => {
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.TradeAction,
        actionDefinitionId: `trade_cancel_${agreementId}`,
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: neighborId,
        parameters: { tradeActionType: 'cancel_agreement', agreementId },
      };
      const error = queueAction(action);
      if (error) {
        showError(BUDGET_ERROR_LABELS[error.code] ?? 'Trade action could not be queued.');
      }
      setCancelConfirming(null);
    },
    [queueAction, showError],
  );

  // Neighbors eligible for a new agreement (not at war, no existing agreement)
  const eligibleForAgreement = neighbors.filter((n) => {
    const atWar = n.attitudePosture === DiplomaticPosture.War;
    const hasAgreement = n.activeAgreements.length > 0;
    return !atWar && !hasAgreement;
  });

  return (
    <div className={styles.screen}>
      {/* Treasury Warnings */}
      {treasury.consecutiveTurnsInsolvent > 0 && (
        <div className={styles.warningBanner} data-level="critical" role="alert">
          <span className={styles.warningText}>{TREASURY_INSOLVENT_WARNING}</span>
        </div>
      )}
      {treasury.consecutiveTurnsInsolvent === 0 && treasury.balance < 50 && (
        <div className={styles.warningBanner} data-level="warning" role="alert">
          <span className={styles.warningText}>{TREASURY_LOW_WARNING}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">{errorMessage}</div>
      )}

      {/* Treasury Overview */}
      <section>
        <h2 className={styles.sectionLabel}>Treasury Overview</h2>
        <div className={styles.overviewRow}>
          <div className={styles.balanceCard}>
            <span className={styles.balanceLabel}>Balance</span>
            <span className={styles.balanceValue}>
              {treasury.balance.toLocaleString()} coin
            </span>
            <span
              className={styles.flowValue}
              data-direction={getFlowDirection(treasury.netFlowPerTurn)}
            >
              {formatCoin(treasury.netFlowPerTurn)} / month
            </span>
          </div>
        </div>
        <p className={styles.reportLine}>
          {TREASURY_BALANCE_LINE({ balance: treasury.balance, netFlow: treasury.netFlowPerTurn })}
        </p>
      </section>

      {/* Income & Expenses */}
      <section>
        <h2 className={styles.sectionLabel}>Revenue & Expenditure</h2>
        <div className={styles.flowGrid}>
          <div className={styles.flowCard}>
            <span className={styles.flowCardTitle}>Income</span>
            <div className={styles.flowItemList}>
              <FlowItem label="Taxation" value={treasury.income.taxation} />
              <FlowItem label="Trade" value={treasury.income.trade} />
              <FlowItem label="Miscellaneous" value={treasury.income.miscellaneous} />
            </div>
          </div>
          <div className={styles.flowCard}>
            <span className={styles.flowCardTitle}>Expenses</span>
            <div className={styles.flowItemList}>
              <FlowItem label="Military Upkeep" value={-treasury.expenses.militaryUpkeep} />
              <FlowItem label="Construction" value={-treasury.expenses.constructionCosts} />
              <FlowItem label="Intelligence" value={-treasury.expenses.intelligenceFunding} />
              <FlowItem label="Religious Orders" value={-treasury.expenses.religiousUpkeep} />
              <FlowItem label="Festivals" value={-treasury.expenses.festivalCosts} />
            </div>
          </div>
        </div>
      </section>

      {/* Trade Factors */}
      <section>
        <h2 className={styles.sectionLabel}>Trade Factors</h2>
        <div className={styles.factorsGrid}>
          <div className={styles.factorCard}>
            <span className={styles.factorLabel}>Trade Policy</span>
            <span className={styles.factorValue}>
              {TRADE_OPENNESS_LABELS[tradeOpenness]}
            </span>
            <p className={styles.factorText}>
              {TRADE_OPENNESS_EFFECT[tradeOpenness]}
            </p>
          </div>
          <div className={styles.factorCard}>
            <span className={styles.factorLabel}>Merchant Satisfaction</span>
            <span className={styles.factorValue}>
              {merchantState.satisfaction} / 100
            </span>
          </div>
          <div className={styles.factorCard}>
            <span className={styles.factorLabel}>Diplomatic Trade Bonus</span>
            <span className={styles.factorValue}>
              {friendlyNeighbors.length} friendly partner{friendlyNeighbors.length !== 1 ? 's' : ''}
            </span>
            {friendlyNeighbors.length > 0 && (
              <p className={styles.factorText}>
                {friendlyNeighbors.map((n) => getNeighborName(n.id)).join(', ')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Active Agreements */}
      <section>
        <h2 className={styles.sectionLabel}>
          Active Agreements ({allAgreements.length})
        </h2>
        {allAgreements.length === 0 ? (
          <p className={styles.emptyState}>
            No active diplomatic agreements. Establish relations through
            diplomacy to unlock trade opportunities.
          </p>
        ) : (
          <div className={styles.agreementList}>
            {allAgreements.map((a) => (
              <div key={a.agreementId} className={styles.agreementItem}>
                <span className={styles.agreementPartner}>{a.neighborName}</span>
                <span className={styles.agreementId}>{a.agreementId}</span>
                <span className={styles.agreementDuration}>
                  {a.turnsRemaining === null
                    ? 'Indefinite'
                    : `${a.turnsRemaining} months remaining`}
                </span>
                {cancelConfirming === a.agreementId ? (
                  <div className={styles.cancelConfirmRow}>
                    <span className={styles.cancelWarning}>−8 relationship</span>
                    <button
                      className={styles.cancelConfirmButton}
                      onClick={() => handleCancelAgreement(a.neighborId, a.agreementId)}
                    >
                      Confirm Cancel
                    </button>
                    <button
                      className={styles.cancelDismissButton}
                      onClick={() => setCancelConfirming(null)}
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.cancelButton}
                    disabled={!canAct}
                    onClick={() => setCancelConfirming(a.agreementId)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trading Partners — initiate agreements */}
      <section>
        <h2 className={styles.sectionLabel}>Trading Partners</h2>
        <div className={styles.partnerGrid}>
          {neighbors.map((n) => {
            const isEligible = eligibleForAgreement.some((e) => e.id === n.id);
            return (
              <div key={n.id} className={styles.partnerCard}>
                <span className={styles.partnerName}>{getNeighborName(n.id)}</span>
                <span className={styles.partnerPosture}>
                  {DIPLOMATIC_POSTURE_LABELS[n.attitudePosture]}
                </span>
                <div className={styles.partnerRelation}>
                  <span className={styles.factorLabel}>Relationship</span>
                  <span className={styles.factorValue}>{n.relationshipScore}</span>
                </div>
                {n.attitudePosture === DiplomaticPosture.War ? (
                  <span className={styles.warBadge}>Trade Suspended</span>
                ) : n.activeAgreements.length > 0 ? (
                  <span className={styles.agreementActiveBadge}>
                    Agreement Active
                  </span>
                ) : isEligible ? (
                  <button
                    className={styles.initiateButton}
                    disabled={!canAct}
                    onClick={() => handleInitiateAgreement(n.id)}
                  >
                    Initiate Agreement
                    <span className={styles.slotCost}>1 slot</span>
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function FlowItem({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.flowItem}>
      <span className={styles.flowItemLabel}>{label}</span>
      <span
        className={styles.flowItemValue}
        data-direction={getFlowDirection(value)}
      >
        {formatCoin(value)}
      </span>
    </div>
  );
}
