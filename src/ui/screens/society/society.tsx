// Phase 11 — Society Screen: population classes + faith/culture tabs.
// Blueprint Reference: ui-blueprint.md §4.5, §7.5; ux-blueprint.md §4, §6

import { useState } from 'react';

import {
  PopulationClass,
  type ActiveEvent,
} from '../../../engine/types';
import { Icon } from '../../components/icon/icon';
import {
  SATISFACTION_BREAKING_POINT,
  SATISFACTION_CRISIS_WARNING,
  HETERODOXY_SCHISM_THRESHOLD,
} from '../../../engine/constants';
import { useKingdomState } from '../../hooks/use-game-state';
import { useRightPanel } from '../../context/right-panel-context';
import {
  CLASS_LABELS,
  SATISFACTION_STATUS_LABELS,
  SOCIETY_TAB_POPULATION,
  SOCIETY_TAB_FAITH,
  RELIGIOUS_ORDER_TYPE_LABELS,
  FESTIVAL_INVESTMENT_LABELS,
  EVENT_SEVERITY_LABELS,
} from '../../../data/text/labels';
import {
  CLASS_CONTRIBUTION_DESCRIPTIONS,
  CLASS_SATISFACTION_FACTORS,
  CLASS_RISK_DESCRIPTIONS,
  INTER_CLASS_DYNAMICS_SUMMARY,
  RELIGIOUS_ORDER_DESCRIPTIONS,
  HETERODOXY_WARNING_TEXT,
  SCHISM_ACTIVE_TEXT,
} from '../../../data/text/reports';
import { EVENT_TEXT } from '../../../data/text/events';
import styles from './society.module.css';

// ============================================================
// Types
// ============================================================

type ActiveTab = 'population' | 'faith';

// ============================================================
// Helpers
// ============================================================

const CLASS_ICON_NAMES: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]: 'nobility',
  [PopulationClass.Clergy]: 'clergy',
  [PopulationClass.Merchants]: 'merchants',
  [PopulationClass.Commoners]: 'commoners',
  [PopulationClass.MilitaryCaste]: 'military-class',
};

function getSatisfactionLevel(satisfaction: number): string {
  if (satisfaction < 20) return 'critical';
  if (satisfaction < 35) return 'restless';
  if (satisfaction < 50) return 'uneasy';
  return 'content';
}

function getSatisfactionStatus(satisfaction: number): string {
  if (satisfaction < SATISFACTION_BREAKING_POINT) return 'critical';
  if (satisfaction < SATISFACTION_CRISIS_WARNING) return 'restless';
  if (satisfaction < 50) return 'uneasy';
  return 'content';
}

function getDeltaDirection(delta: number): string {
  if (delta > 0) return 'positive';
  if (delta < 0) return 'negative';
  return 'neutral';
}

function formatDelta(delta: number): string {
  if (delta > 0) return `\u25B2 +${delta}`;
  if (delta < 0) return `\u25BC ${delta}`;
  return '\u2015 0';
}

// ============================================================
// Society Screen
// ============================================================

export function Society() {
  const kingdom = useKingdomState();
  const { update: updateRightPanel } = useRightPanel();
  const [activeTab, setActiveTab] = useState<ActiveTab>('population');
  const [expandedClass, setExpandedClass] = useState<PopulationClass | null>(null);

  function handleExpandClass(cls: PopulationClass | null) {
    setExpandedClass(cls);
    if (cls) {
      updateRightPanel({ selectedClassId: cls });
    }
  }

  // Find the most critical class (lowest satisfaction)
  const mostCriticalClass = Object.values(PopulationClass).reduce(
    (worst, cls) =>
      kingdom.population[cls].satisfaction < kingdom.population[worst].satisfaction
        ? cls
        : worst,
    PopulationClass.Nobility,
  );

  // Class-related events (unresolved, with an affectedClassId)
  const classEvents = kingdom.activeEvents.filter(
    (e) => !e.isResolved && e.affectedClassId !== null,
  );

  return (
    <div className={styles.screen}>
      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist">
        <button
          className={styles.tab}
          role="tab"
          data-active={activeTab === 'population' ? 'true' : 'false'}
          aria-selected={activeTab === 'population'}
          onClick={() => setActiveTab('population')}
        >
          {SOCIETY_TAB_POPULATION}
        </button>
        <button
          className={styles.tab}
          role="tab"
          data-active={activeTab === 'faith' ? 'true' : 'false'}
          aria-selected={activeTab === 'faith'}
          onClick={() => setActiveTab('faith')}
        >
          {SOCIETY_TAB_FAITH}
        </button>
      </div>

      {/* Population Classes Tab */}
      {activeTab === 'population' && (
        <>
          {/* Class Cards Grid */}
          <div className={styles.classGrid}>
            {Object.values(PopulationClass).map((cls) => {
              const classState = kingdom.population[cls];
              const status = getSatisfactionStatus(classState.satisfaction);
              const isExpanded = expandedClass === cls;
              const isMostCritical = cls === mostCriticalClass;

              return (
                <div
                  key={cls}
                  className={styles.classCard}
                  data-status={status}
                  data-expanded={isExpanded ? 'true' : 'false'}
                  data-most-critical={isMostCritical ? 'true' : 'false'}
                  onClick={() =>
                    handleExpandClass(isExpanded ? null : cls)
                  }
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${CLASS_LABELS[cls]} — satisfaction ${classState.satisfaction}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleExpandClass(isExpanded ? null : cls);
                    }
                  }}
                >
                  {/* Header */}
                  <div className={styles.classHeader}>
                    <Icon name={CLASS_ICON_NAMES[cls]} size="0.875rem" />
                    <span className={styles.className}>{CLASS_LABELS[cls]}</span>
                  </div>

                  {/* Population count */}
                  <span className={styles.classPopulation}>
                    {classState.population.toLocaleString()} subjects
                  </span>

                  {/* Satisfaction bar */}
                  <div className={styles.satisfactionRow}>
                    <span className={styles.satisfactionValue}>
                      {classState.satisfaction}
                    </span>
                    <div className={styles.satisfactionBarTrack}>
                      <div
                        className={styles.satisfactionBarFill}
                        data-status={status}
                        style={{ width: `${classState.satisfaction}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.satisfactionGauge}>
                    <div
                      className={styles.satisfactionGaugeFill}
                      data-level={getSatisfactionLevel(classState.satisfaction)}
                      style={{ width: `${Math.min(100, classState.satisfaction)}%` }}
                    />
                  </div>

                  {/* Delta and status */}
                  <span
                    className={styles.classDelta}
                    data-direction={getDeltaDirection(
                      classState.satisfactionDeltaLastTurn,
                    )}
                  >
                    {formatDelta(classState.satisfactionDeltaLastTurn)}
                  </span>
                  <span className={styles.statusPhrase} data-status={status}>
                    {SATISFACTION_STATUS_LABELS[status]}
                  </span>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className={styles.classDetail}>
                      <div className={styles.detailSection}>
                        <span className={styles.detailTitle}>
                          Satisfaction Factors
                        </span>
                        <p className={styles.detailText}>
                          {CLASS_SATISFACTION_FACTORS[cls]}
                        </p>
                      </div>
                      <div className={styles.detailSection}>
                        <span className={styles.detailTitle}>
                          Contribution to the Kingdom
                        </span>
                        <p className={styles.detailText}>
                          {CLASS_CONTRIBUTION_DESCRIPTIONS[cls]}
                        </p>
                      </div>
                      <div className={styles.detailSection}>
                        <span className={styles.detailTitle}>
                          Risk Assessment
                        </span>
                        <p className={styles.detailText}>
                          {CLASS_RISK_DESCRIPTIONS[status]}
                        </p>
                      </div>
                      {cls === PopulationClass.Nobility &&
                        classState.intrigueRisk !== undefined &&
                        classState.intrigueRisk > 0 && (
                          <div className={styles.detailSection}>
                            <span className={styles.detailTitle}>
                              Intrigue Risk
                            </span>
                            <p className={styles.detailText}>
                              Noble intrigue risk stands at{' '}
                              {classState.intrigueRisk}. High intrigue
                              increases the probability of overthrow plots.
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inter-Class Dynamics */}
          <section>
            <h2 className={styles.sectionLabel}>Inter-Class Dynamics</h2>
            <div className={styles.dynamicsSummary}>
              <p className={styles.dynamicsText}>
                {INTER_CLASS_DYNAMICS_SUMMARY}
              </p>
            </div>
          </section>

          {/* Class-Related Events */}
          {classEvents.length > 0 && (
            <section>
              <h2 className={styles.sectionLabel}>
                Active Class Concerns ({classEvents.length})
              </h2>
              <div className={styles.classEventsList}>
                {classEvents.map((event) => (
                  <ClassEventItem key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Faith & Culture Tab */}
      {activeTab === 'faith' && (
        <>
          {/* Faith & Cohesion Gauges */}
          <div className={styles.faithGauges}>
            <GaugeCard
              label="Faith Level"
              value={kingdom.faithCulture.faithLevel}
              max={100}
            />
            <GaugeCard
              label="Cultural Cohesion"
              value={kingdom.faithCulture.culturalCohesion}
              max={100}
            />
          </div>

          {/* Schism Warning */}
          {kingdom.faithCulture.schismActive && (
            <div className={styles.warningBanner} data-level="critical" role="alert">
              <span className={styles.warningText}>{SCHISM_ACTIVE_TEXT}</span>
            </div>
          )}

          {/* Heterodoxy Warning */}
          {!kingdom.faithCulture.schismActive &&
            kingdom.faithCulture.heterodoxy >= HETERODOXY_SCHISM_THRESHOLD * 0.5 && (
              <div className={styles.warningBanner} data-level="warning" role="alert">
                <span className={styles.warningText}>
                  {HETERODOXY_WARNING_TEXT} (Heterodoxy: {kingdom.faithCulture.heterodoxy})
                </span>
              </div>
            )}

          {/* Religious Orders */}
          <section>
            <h2 className={styles.sectionLabel}>Religious Orders</h2>
            <div className={styles.ordersGrid}>
              {kingdom.faithCulture.activeOrders.map((order) => (
                <div
                  key={order.type}
                  className={styles.orderCard}
                  data-active={order.isActive ? 'true' : 'false'}
                >
                  <span className={styles.orderName}>
                    {RELIGIOUS_ORDER_TYPE_LABELS[order.type]}
                  </span>
                  <span
                    className={styles.orderStatus}
                    data-active={order.isActive ? 'true' : 'false'}
                  >
                    {order.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className={styles.orderDescription}>
                    {RELIGIOUS_ORDER_DESCRIPTIONS[order.type]}
                  </p>
                  <span className={styles.orderUpkeep}>
                    Upkeep: {order.upkeepPerTurn} coin / month
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Festival Status */}
          <section>
            <h2 className={styles.sectionLabel}>Festival Policy</h2>
            <div className={styles.festivalStatus}>
              <span className={styles.festivalLabel}>Current Investment:</span>
              <span className={styles.festivalValue}>
                {FESTIVAL_INVESTMENT_LABELS[kingdom.policies.festivalInvestmentLevel]}
              </span>
            </div>
          </section>
        </>
      )}
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
  // Derive a simple trend direction: we don't have delta stored for faith/cohesion,
  // so we show the value gauge without a trend arrow.
  return (
    <div className={styles.gaugeCard}>
      <span className={styles.gaugeLabel}>{label}</span>
      <div className={styles.gaugeValueRow}>
        <span className={styles.gaugeValue}>{value}</span>
        <span className={styles.gaugeTrend} data-direction="neutral">
          / {max}
        </span>
      </div>
      <div className={styles.gaugeBarTrack}>
        <div
          className={styles.gaugeBarFill}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ClassEventItem({ event }: { event: ActiveEvent }) {
  const textEntry = EVENT_TEXT[event.definitionId];
  const title = textEntry?.title ?? event.definitionId;

  return (
    <div className={styles.classEventItem}>
      <span
        className={styles.classEventSeverity}
        data-severity={event.severity}
      >
        {EVENT_SEVERITY_LABELS[event.severity]}
      </span>
      <span className={styles.classEventTitle}>{title}</span>
    </div>
  );
}
