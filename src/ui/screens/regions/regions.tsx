// Phase 12 — Regions Screen: regional administration overview.
// Blueprint Reference: ui-blueprint.md §4.6; ux-blueprint.md §6

import { useState } from 'react';

import type { RegionState } from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  REGION_LABELS,
  ECONOMIC_OUTPUT_LABELS,
} from '../../../data/text/labels';
import { REGION_DESCRIPTIONS } from '../../../data/text/reports';
import styles from './regions.module.css';

// ============================================================
// Helpers
// ============================================================

function getRegionName(id: string): string {
  return REGION_LABELS[id] ?? id;
}

function getOutputLabel(output: string): string {
  return ECONOMIC_OUTPUT_LABELS[output] ?? output;
}

function getConditionStatus(modifier: number): string {
  if (modifier >= 1.2) return 'excellent';
  if (modifier >= 1.0) return 'good';
  if (modifier >= 0.8) return 'fair';
  return 'poor';
}

function formatCondition(modifier: number): string {
  const pct = Math.round((modifier - 1) * 100);
  if (pct > 0) return `+${pct}%`;
  if (pct < 0) return `${pct}%`;
  return 'Baseline';
}

// ============================================================
// Regions Screen
// ============================================================

export function Regions() {
  const kingdom = useKingdomState();
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const occupiedCount = kingdom.regions.filter((r) => r.isOccupied).length;

  return (
    <div className={styles.screen}>
      {/* Occupied Warning */}
      {occupiedCount > 0 && (
        <div className={styles.warningBanner} data-level="critical" role="alert">
          <span className={styles.warningText}>
            {occupiedCount} of {kingdom.regions.length} regions under foreign
            occupation. Regional output from occupied territories is suspended.
          </span>
        </div>
      )}

      {/* Region Cards */}
      <div className={styles.regionGrid}>
        {kingdom.regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isExpanded={expandedRegion === region.id}
            onToggle={() =>
              setExpandedRegion(
                expandedRegion === region.id ? null : region.id,
              )
            }
            constructionCount={
              kingdom.constructionProjects.filter(
                (p) => p.targetRegionId === region.id,
              ).length
            }
            eventCount={
              kingdom.activeEvents.filter(
                (e) =>
                  !e.isResolved && e.affectedRegionId === region.id,
              ).length
            }
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function RegionCard({
  region,
  isExpanded,
  onToggle,
  constructionCount,
  eventCount,
}: {
  region: RegionState;
  isExpanded: boolean;
  onToggle: () => void;
  constructionCount: number;
  eventCount: number;
}) {
  const conditionStatus = getConditionStatus(region.localConditionModifier);

  return (
    <div
      className={styles.regionCard}
      data-expanded={isExpanded ? 'true' : 'false'}
      data-occupied={region.isOccupied ? 'true' : 'false'}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${getRegionName(region.id)} — development ${region.developmentLevel}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Header */}
      <div className={styles.regionHeader}>
        <span className={styles.regionName}>{getRegionName(region.id)}</span>
        {region.isOccupied && (
          <span className={styles.occupiedBadge}>Occupied</span>
        )}
      </div>

      {/* Primary Output */}
      <span className={styles.outputLabel}>
        {getOutputLabel(region.primaryEconomicOutput)}
      </span>

      {/* Development Level Bar */}
      <div className={styles.statRow}>
        <span className={styles.statLabel}>Development</span>
        <span className={styles.statValue}>{region.developmentLevel}</span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${region.developmentLevel}%` }}
        />
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Population</span>
          <span className={styles.summaryValue}>
            {region.populationContribution.toLocaleString()}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Strategic Value</span>
          <span className={styles.summaryValue}>{region.strategicValue}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Condition</span>
          <span className={styles.summaryValue} data-status={conditionStatus}>
            {formatCondition(region.localConditionModifier)}
          </span>
        </div>
      </div>

      {/* Activity Indicators */}
      {(constructionCount > 0 || eventCount > 0) && (
        <div className={styles.activityRow}>
          {constructionCount > 0 && (
            <span className={styles.activityBadge}>
              {constructionCount} construction{constructionCount > 1 ? 's' : ''}
            </span>
          )}
          {eventCount > 0 && (
            <span className={styles.activityBadge} data-type="event">
              {eventCount} active event{eventCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Expanded Detail */}
      {isExpanded && (
        <div className={styles.regionDetail}>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Description</span>
            <p className={styles.detailText}>
              {REGION_DESCRIPTIONS[region.id] ?? 'No description available.'}
            </p>
          </div>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Local Faith Tradition</span>
            <p className={styles.detailText}>{region.localFaithProfile}</p>
          </div>
          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>Cultural Identity</span>
            <p className={styles.detailText}>{region.culturalIdentity}</p>
          </div>
        </div>
      )}
    </div>
  );
}
