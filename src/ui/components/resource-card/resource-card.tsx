// Phase 9 — Resource Card: compact resource status display with trend arrow.
// Blueprint Reference: ui-blueprint.md §4.5, §6.1

import styles from './resource-card.module.css';

// ============================================================
// Props
// ============================================================

interface ResourceCardProps {
  label: string;
  value: number;
  netFlow: number;
  interpretation?: string;
}

// ============================================================
// Private sub-components
// ============================================================

function TrendIndicator({ netFlow }: { netFlow: number }) {
  if (netFlow > 0) {
    return (
      <span className={styles.trendPositive} aria-label="rising">
        {'\u25B2'} +{netFlow}
      </span>
    );
  }
  if (netFlow < 0) {
    return (
      <span className={styles.trendNegative} aria-label="falling">
        {'\u25BC'} {netFlow}
      </span>
    );
  }
  return (
    <span className={styles.trendNeutral} aria-label="stable">
      {'\u2015'} 0
    </span>
  );
}

// ============================================================
// Resource Card
// ============================================================

export function ResourceCard({ label, value, netFlow, interpretation }: ResourceCardProps) {
  return (
    <div className={styles.card} aria-label={`${label}: ${value}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <TrendIndicator netFlow={netFlow} />
      {interpretation && (
        <span className={styles.interpretation}>{interpretation}</span>
      )}
    </div>
  );
}
