// Phase 6 — Consequence Preview: directional impact indicators for actions.
// Blueprint Reference: ux-blueprint.md §6.1 — Consequence Previewing

import type { MechanicalEffectDelta } from '../../../engine/types';
import { CONSEQUENCE_DELTA_LABELS } from '../../../data/text/labels';
import styles from './consequence-preview.module.css';

// ============================================================
// Props
// ============================================================

interface ConsequencePreviewProps {
  effects: MechanicalEffectDelta;
  compact?: boolean;
}

// ============================================================
// Delta entries to display
// ============================================================

const DISPLAY_ORDER: (keyof MechanicalEffectDelta)[] = [
  'treasuryDelta',
  'foodDelta',
  'stabilityDelta',
  'faithDelta',
  'heterodoxyDelta',
  'culturalCohesionDelta',
  'militaryReadinessDelta',
  'militaryMoraleDelta',
  'militaryEquipmentDelta',
  'militaryForceSizeDelta',
  'espionageNetworkDelta',
  'nobilitySatDelta',
  'clergySatDelta',
  'merchantSatDelta',
  'commonerSatDelta',
  'militaryCasteSatDelta',
  'regionDevelopmentDelta',
  'regionConditionDelta',
];

// ============================================================
// Consequence Preview
// ============================================================

export function ConsequencePreview({ effects, compact }: ConsequencePreviewProps) {
  const entries: Array<{ key: string; label: string; value: number }> = [];

  for (const key of DISPLAY_ORDER) {
    const value = effects[key];
    if (typeof value === 'number' && value !== 0) {
      entries.push({
        key,
        label: CONSEQUENCE_DELTA_LABELS[key] ?? key,
        value,
      });
    }
  }

  if (entries.length === 0) return null;

  return (
    <div className={compact ? styles.previewCompact : styles.preview}>
      {entries.map((entry) => (
        <span
          key={entry.key}
          className={styles.chip}
          data-direction={entry.value > 0 ? 'positive' : 'negative'}
        >
          <span className={styles.chipLabel}>{entry.label}</span>
          <span className={styles.chipValue}>
            {entry.value > 0 ? '\u25B2' : '\u25BC'}{' '}
            {entry.value > 0 ? `+${entry.value}` : entry.value}
          </span>
        </span>
      ))}
    </div>
  );
}
