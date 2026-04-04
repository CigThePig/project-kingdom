// Phase 12 — Trade Screen: treasury and commerce overview.
// Blueprint Reference: ui-blueprint.md §4.8; ux-blueprint.md §6
// Maps to ScreenId 'treasury' in app.tsx.

import { PopulationClass, DiplomaticPosture } from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  TRADE_OPENNESS_LABELS,
  NEIGHBOR_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
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
  const treasury = kingdom.treasury;
  const tradeOpenness = kingdom.policies.tradeOpenness;
  const merchantState = kingdom.population[PopulationClass.Merchants];
  const neighbors = kingdom.diplomacy.neighbors;

  const friendlyNeighbors = neighbors.filter(
    (n) => n.relationshipScore > 70,
  );

  const allAgreements = neighbors.flatMap((n) =>
    n.activeAgreements.map((a) => ({ ...a, neighborName: getNeighborName(n.id) })),
  );

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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Neighbor Trade Postures */}
      <section>
        <h2 className={styles.sectionLabel}>Trading Partners</h2>
        <div className={styles.partnerGrid}>
          {neighbors.map((n) => (
            <div key={n.id} className={styles.partnerCard}>
              <span className={styles.partnerName}>{getNeighborName(n.id)}</span>
              <span className={styles.partnerPosture}>
                {DIPLOMATIC_POSTURE_LABELS[n.attitudePosture]}
              </span>
              <div className={styles.partnerRelation}>
                <span className={styles.factorLabel}>Relationship</span>
                <span className={styles.factorValue}>{n.relationshipScore}</span>
              </div>
              {n.attitudePosture === DiplomaticPosture.War && (
                <span className={styles.warBadge}>Trade Suspended</span>
              )}
            </div>
          ))}
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
