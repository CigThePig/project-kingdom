// Phase 9 — Resource Card: compact resource status display with trend arrow.
// Blueprint Reference: ui-blueprint.md §4.5, §6.1

import { Icon } from '../icon/icon';
import styles from './resource-card.module.css';

// ============================================================
// Props
// ============================================================

interface ResourceCardProps {
  label: string;
  value: number;
  netFlow: number;
  interpretation?: string;
  maxValue?: number;
}

// ============================================================
// Private sub-components
// ============================================================

function TrendIndicator({ netFlow }: { netFlow: number }) {
  if (netFlow > 0) {
    return (
      <span className={styles.trendPositive} aria-label="rising">
        <Icon name="trend-up" size="0.75rem" /> +{netFlow}
      </span>
    );
  }
  if (netFlow < 0) {
    return (
      <span className={styles.trendNegative} aria-label="falling">
        <Icon name="trend-down" size="0.75rem" /> {netFlow}
      </span>
    );
  }
  return (
    <span className={styles.trendNeutral} aria-label="stable">
      <Icon name="trend-stable" size="0.75rem" /> 0
    </span>
  );
}

function getMiniBarFillClass(percentage: number): string {
  if (percentage < 25) return styles.miniBarFillCritical;
  if (percentage < 50) return styles.miniBarFillWarning;
  return '';
}

// ============================================================
// Label → icon name mapping
// ============================================================

const RESOURCE_ICON_MAP: Record<string, string> = {
  Treasury: 'treasury',
  Food: 'food',
  Stability: 'stability',
};

// ============================================================
// Resource Card
// ============================================================

export function ResourceCard({ label, value, netFlow, interpretation, maxValue = 100 }: ResourceCardProps) {
  const iconName = RESOURCE_ICON_MAP[label];
  const percentage = Math.min(100, (value / maxValue) * 100);
  const fillClass = getMiniBarFillClass(percentage);
  return (
    <div className={styles.card} aria-label={`${label}: ${value}`}>
      <span className={styles.label}>
        {iconName && <Icon name={iconName} size="1rem" />}
        {label}
      </span>
      <span className={styles.value}>{value}</span>
      <TrendIndicator netFlow={netFlow} />
      <div className={styles.miniBar}>
        <div
          className={`${styles.miniBarFill}${fillClass ? ` ${fillClass}` : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {interpretation && (
        <span className={styles.interpretation}>{interpretation}</span>
      )}
    </div>
  );
}
