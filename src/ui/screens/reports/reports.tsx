// Phase 10 — Reports Screen: tabbed domain reports with executive summaries.
// Blueprint Reference: ui-blueprint.md §5.2; ux-blueprint.md §3

import { useState } from 'react';

import {
  KnowledgeBranch,
  PopulationClass,
  ReligiousOrderType,
} from '../../../engine/types';
import {
  STABILITY_CRITICAL_THRESHOLD,
  STABILITY_LOW_THRESHOLD,
  TREASURY_LOW_BALANCE_WARNING,
} from '../../../engine/constants';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  CLASS_LABELS,
  KNOWLEDGE_BRANCH_LABELS,
  MILITARY_POSTURE_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
  NEIGHBOR_DISPOSITION_LABELS,
} from '../../../data/text/labels';
import {
  TREASURY_REPORT_HEADER,
  FOOD_REPORT_HEADER,
  SOCIETY_REPORT_HEADER,
  STABILITY_REPORT_HEADER,
  MILITARY_REPORT_HEADER,
  FAITH_REPORT_HEADER,
  DIPLOMACY_REPORT_HEADER,
  KNOWLEDGE_REPORT_HEADER,
  TREASURY_BALANCE_LINE,
  FOOD_RESERVES_LINE,
  CLASS_SATISFACTION_LINE,
  MILITARY_READINESS_LINE,
  NEIGHBOR_POSTURE_LINE,
  TREASURY_INSOLVENT_WARNING,
  TREASURY_LOW_WARNING,
  FOOD_FAMINE_WARNING,
  FOOD_LOW_WARNING,
  STABILITY_CRITICAL_WARNING,
  STABILITY_LOW_WARNING,
  SCHISM_ACTIVE_WARNING,
  MILITARY_READINESS_LOW_WARNING,
} from '../../../data/text/reports';
import styles from './reports.module.css';

// ============================================================
// Report Domains
// ============================================================

type ReportDomain =
  | 'treasury'
  | 'food'
  | 'society'
  | 'stability'
  | 'military'
  | 'faith'
  | 'diplomacy'
  | 'knowledge';

const DOMAIN_TABS: { id: ReportDomain; label: string }[] = [
  { id: 'treasury', label: TREASURY_REPORT_HEADER },
  { id: 'food', label: FOOD_REPORT_HEADER },
  { id: 'society', label: SOCIETY_REPORT_HEADER },
  { id: 'stability', label: STABILITY_REPORT_HEADER },
  { id: 'military', label: MILITARY_REPORT_HEADER },
  { id: 'faith', label: FAITH_REPORT_HEADER },
  { id: 'diplomacy', label: DIPLOMACY_REPORT_HEADER },
  { id: 'knowledge', label: KNOWLEDGE_REPORT_HEADER },
];

// ============================================================
// Religious Order Type Labels (not in labels.ts since only used here)
// ============================================================

const ORDER_TYPE_LABELS: Record<ReligiousOrderType, string> = {
  [ReligiousOrderType.Healing]: 'Healing Order',
  [ReligiousOrderType.Scholarly]: 'Scholarly Order',
  [ReligiousOrderType.Martial]: 'Martial Order',
  [ReligiousOrderType.Charitable]: 'Charitable Order',
};

// ============================================================
// Reports Screen
// ============================================================

export function Reports() {
  const kingdom = useKingdomState();
  const [activeDomain, setActiveDomain] = useState<ReportDomain>('treasury');

  function renderDomain() {
    switch (activeDomain) {
      case 'treasury':
        return renderTreasury();
      case 'food':
        return renderFood();
      case 'society':
        return renderSociety();
      case 'stability':
        return renderStability();
      case 'military':
        return renderMilitary();
      case 'faith':
        return renderFaith();
      case 'diplomacy':
        return renderDiplomacy();
      case 'knowledge':
        return renderKnowledge();
    }
  }

  // ---- Treasury ----

  function renderTreasury() {
    const { treasury } = kingdom;
    const isInsolvent = treasury.consecutiveTurnsInsolvent > 0;
    const isLow = treasury.balance <= TREASURY_LOW_BALANCE_WARNING;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          {TREASURY_BALANCE_LINE({ balance: treasury.balance, netFlow: treasury.netFlowPerTurn })}
        </p>

        {isInsolvent && <p className={styles.criticalBlock}>{TREASURY_INSOLVENT_WARNING}</p>}
        {!isInsolvent && isLow && <p className={styles.warningBlock}>{TREASURY_LOW_WARNING}</p>}

        <details className={styles.detailSection}>
          <summary>Income Breakdown</summary>
          <div className={styles.detailBody}>
            <table className={styles.dataTable}>
              <thead>
                <tr><th>Source</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>Taxation</td><td>{treasury.income.taxation}</td></tr>
                <tr><td>Trade</td><td>{treasury.income.trade}</td></tr>
                <tr><td>Miscellaneous</td><td>{treasury.income.miscellaneous}</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <details className={styles.detailSection}>
          <summary>Expense Breakdown</summary>
          <div className={styles.detailBody}>
            <table className={styles.dataTable}>
              <thead>
                <tr><th>Category</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>Military Upkeep</td><td>{treasury.expenses.militaryUpkeep}</td></tr>
                <tr><td>Construction</td><td>{treasury.expenses.constructionCosts}</td></tr>
                <tr><td>Intelligence</td><td>{treasury.expenses.intelligenceFunding}</td></tr>
                <tr><td>Religious Orders</td><td>{treasury.expenses.religiousUpkeep}</td></tr>
                <tr><td>Festivals</td><td>{treasury.expenses.festivalCosts}</td></tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    );
  }

  // ---- Food ----

  function renderFood() {
    const { food } = kingdom;
    const isFamine = food.consecutiveTurnsEmpty > 0;
    const isLow = food.reserves <= 30 && !isFamine;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          {FOOD_RESERVES_LINE({
            reserves: food.reserves,
            netFlow: food.netFlowPerTurn,
            seasonalModifier: food.seasonalModifier,
          })}
        </p>

        {isFamine && <p className={styles.criticalBlock}>{FOOD_FAMINE_WARNING}</p>}
        {isLow && <p className={styles.warningBlock}>{FOOD_LOW_WARNING}</p>}

        <details className={styles.detailSection}>
          <summary>Production & Consumption</summary>
          <div className={styles.detailBody}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Production per turn</span>
              <span className={styles.statValue}>{food.productionPerTurn}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Consumption per turn</span>
              <span className={styles.statValue}>{food.consumptionPerTurn}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Seasonal modifier</span>
              <span className={styles.statValue}>{food.seasonalModifier}x</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Agricultural bonus</span>
              <span className={styles.statValue}>+{food.agriculturalEfficiencyBonus}</span>
            </div>
          </div>
        </details>
      </div>
    );
  }

  // ---- Society ----

  function renderSociety() {
    return (
      <div className={styles.reportContent}>
        {Object.values(PopulationClass).map((cls) => {
          const classState = kingdom.population[cls];
          return (
            <div key={cls}>
              <p className={styles.summary}>
                {CLASS_SATISFACTION_LINE({
                  populationClass: cls,
                  satisfaction: classState.satisfaction,
                  delta: classState.satisfactionDeltaLastTurn,
                })}
              </p>
              <details className={styles.detailSection}>
                <summary>{CLASS_LABELS[cls]} Details</summary>
                <div className={styles.detailBody}>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Population</span>
                    <span className={styles.statValue}>{classState.population}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Satisfaction</span>
                    <span className={styles.statValue}>{classState.satisfaction} / 100</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Change this turn</span>
                    <span className={styles.statValue}>
                      {classState.satisfactionDeltaLastTurn >= 0 ? '+' : ''}
                      {classState.satisfactionDeltaLastTurn}
                    </span>
                  </div>
                  {cls === PopulationClass.Nobility && classState.intrigueRisk != null && (
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Intrigue risk</span>
                      <span className={styles.statValue}>{classState.intrigueRisk}</span>
                    </div>
                  )}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    );
  }

  // ---- Stability ----

  function renderStability() {
    const { stability } = kingdom;
    const isCritical = stability.value <= STABILITY_CRITICAL_THRESHOLD;
    const isLow = stability.value <= STABILITY_LOW_THRESHOLD && !isCritical;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          Kingdom stability stands at <strong>{stability.value}</strong> out of 100.
        </p>

        {isCritical && <p className={styles.criticalBlock}>{STABILITY_CRITICAL_WARNING}</p>}
        {isLow && <p className={styles.warningBlock}>{STABILITY_LOW_WARNING}</p>}

        <details className={styles.detailSection}>
          <summary>Contribution Breakdown</summary>
          <div className={styles.detailBody}>
            {Object.values(PopulationClass).map((cls) => (
              <div key={cls} className={styles.statRow}>
                <span className={styles.statLabel}>{CLASS_LABELS[cls]}</span>
                <span className={styles.statValue}>
                  {stability.classContributions[cls].toFixed(1)}
                </span>
              </div>
            ))}
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Food security</span>
              <span className={styles.statValue}>
                {stability.foodSecurityContribution.toFixed(1)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Faith</span>
              <span className={styles.statValue}>
                {stability.faithContribution.toFixed(1)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Cultural cohesion</span>
              <span className={styles.statValue}>
                {stability.culturalCohesionContribution.toFixed(1)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Decree pace impact</span>
              <span className={styles.statValue}>
                {stability.decreePaceContribution.toFixed(1)}
              </span>
            </div>
          </div>
        </details>
      </div>
    );
  }

  // ---- Military ----

  function renderMilitary() {
    const { military } = kingdom;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          {MILITARY_READINESS_LINE({
            readiness: military.readiness,
            forceSize: military.forceSize,
            morale: military.morale,
          })}
        </p>

        {military.readiness < 30 && (
          <p className={styles.warningBlock}>{MILITARY_READINESS_LOW_WARNING}</p>
        )}

        <details className={styles.detailSection}>
          <summary>Force Details</summary>
          <div className={styles.detailBody}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Equipment condition</span>
              <span className={styles.statValue}>{military.equipmentCondition}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Deployment posture</span>
              <span className={styles.statValue}>
                {MILITARY_POSTURE_LABELS[military.deploymentPosture]}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Upkeep burden per turn</span>
              <span className={styles.statValue}>{military.upkeepBurdenPerTurn}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Intelligence advantage</span>
              <span className={styles.statValue}>{military.intelligenceAdvantage}</span>
            </div>
          </div>
        </details>
      </div>
    );
  }

  // ---- Faith ----

  function renderFaith() {
    const { faithCulture } = kingdom;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          Faith stands at <strong>{faithCulture.faithLevel}</strong>. Cultural cohesion
          is at <strong>{faithCulture.culturalCohesion}</strong>.
        </p>

        {faithCulture.schismActive && (
          <p className={styles.criticalBlock}>{SCHISM_ACTIVE_WARNING}</p>
        )}

        <details className={styles.detailSection}>
          <summary>Religious Orders</summary>
          <div className={styles.detailBody}>
            {faithCulture.activeOrders.length === 0 ? (
              <p>No religious orders are currently active.</p>
            ) : (
              <table className={styles.dataTable}>
                <thead>
                  <tr><th>Order</th><th>Upkeep</th></tr>
                </thead>
                <tbody>
                  {faithCulture.activeOrders
                    .filter((o) => o.isActive)
                    .map((order) => (
                      <tr key={order.type}>
                        <td>{ORDER_TYPE_LABELS[order.type]}</td>
                        <td>{order.upkeepPerTurn}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </details>

        <details className={styles.detailSection}>
          <summary>Heterodoxy & Schism</summary>
          <div className={styles.detailBody}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Heterodoxy level</span>
              <span className={styles.statValue}>{faithCulture.heterodoxy}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Schism status</span>
              <span className={styles.statValue}>
                {faithCulture.schismActive ? 'Active' : 'Dormant'}
              </span>
            </div>
          </div>
        </details>
      </div>
    );
  }

  // ---- Diplomacy ----

  function renderDiplomacy() {
    const { diplomacy } = kingdom;

    if (diplomacy.neighbors.length === 0) {
      return (
        <div className={styles.reportContent}>
          <p className={styles.summary}>No neighboring kingdoms are currently known.</p>
        </div>
      );
    }

    return (
      <div className={styles.reportContent}>
        {diplomacy.neighbors.map((neighbor) => (
          <div key={neighbor.id}>
            <p className={styles.summary}>
              {NEIGHBOR_POSTURE_LINE({
                neighborName: neighbor.id,
                posture: DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture],
                relationshipScore: neighbor.relationshipScore,
              })}
            </p>
            <details className={styles.detailSection}>
              <summary>{neighbor.id} Details</summary>
              <div className={styles.detailBody}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Disposition</span>
                  <span className={styles.statValue}>
                    {NEIGHBOR_DISPOSITION_LABELS[neighbor.disposition]}
                  </span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Military strength</span>
                  <span className={styles.statValue}>{neighbor.militaryStrength}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Active agreements</span>
                  <span className={styles.statValue}>{neighbor.activeAgreements.length}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Outstanding tensions</span>
                  <span className={styles.statValue}>{neighbor.outstandingTensions.length}</span>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    );
  }

  // ---- Knowledge ----

  function renderKnowledge() {
    const { knowledge } = kingdom;

    return (
      <div className={styles.reportContent}>
        <p className={styles.summary}>
          Research progresses at <strong>{knowledge.progressPerTurn}</strong> points per turn.
        </p>

        {Object.values(KnowledgeBranch).map((branch) => {
          const branchState = knowledge.branches[branch];
          return (
            <details key={branch} className={styles.detailSection}>
              <summary>{KNOWLEDGE_BRANCH_LABELS[branch]}</summary>
              <div className={styles.detailBody}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Progress</span>
                  <span className={styles.statValue}>{branchState.progressValue}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Next milestone tier</span>
                  <span className={styles.statValue}>{branchState.currentMilestoneIndex + 1}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Unlocked advancements</span>
                  <span className={styles.statValue}>{branchState.unlockedAdvancements.length}</span>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist">
        {DOMAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeDomain === tab.id}
            className={activeDomain === tab.id ? styles.tabActive : styles.tab}
            onClick={() => setActiveDomain(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div role="tabpanel">
        {renderDomain()}
      </div>
    </div>
  );
}
