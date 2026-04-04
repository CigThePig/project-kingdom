// Phase 9 — Policy Card: active policy status display.
// Blueprint Reference: ui-blueprint.md §4.4, §6.5

import type { PopulationClass } from '../../../engine/types';
import { CLASS_LABELS } from '../../../data/text/labels';
import styles from './policy-card.module.css';

// ============================================================
// Props
// ============================================================

interface PolicyCardProps {
  name: string;
  currentSettingLabel: string;
  effectSummary: string;
  affectedClasses?: PopulationClass[];
  isChangeAvailable: boolean;
  onSelect?: () => void;
}

// ============================================================
// Policy Card
// ============================================================

export function PolicyCard({
  name,
  currentSettingLabel,
  effectSummary,
  affectedClasses,
  isChangeAvailable,
  onSelect,
}: PolicyCardProps) {
  return (
    <div className={styles.card + (isChangeAvailable ? '' : ' ' + styles.locked)}>
      <h3 className={styles.name}>{name}</h3>
      <span className={styles.currentSetting}>{currentSettingLabel}</span>
      <p className={styles.effectSummary}>{effectSummary}</p>

      {affectedClasses && affectedClasses.length > 0 && (
        <div className={styles.classChips}>
          {affectedClasses.map((cls) => (
            <span key={cls} className={styles.classChip}>
              {CLASS_LABELS[cls]}
            </span>
          ))}
        </div>
      )}

      <button
        className={styles.adjustButton}
        disabled={!isChangeAvailable}
        onClick={onSelect}
        aria-label={isChangeAvailable ? `Adjust ${name}` : `${name} — policy change already used this turn`}
      >
        {isChangeAvailable ? 'Adjust' : 'Locked'}
      </button>

      {!isChangeAvailable && (
        <span className={styles.lockedReason}>Policy change already used this turn</span>
      )}
    </div>
  );
}
