// Phase 9 — Decree Card: decree option display with cost and effect preview.
// Blueprint Reference: ui-blueprint.md §4.3, §6.4

import type { DecreeCategory, MechanicalEffectDelta, PopulationClass, ResourceType } from '../../../engine/types';
import {
  DECREE_CATEGORY_LABELS,
  CLASS_LABELS,
  RESOURCE_TYPE_LABELS,
} from '../../../data/text/labels';
import {
  DECREE_SLOT_COST_LABEL,
  DECREE_EFFECT_LABEL,
  DECREE_AFFECTED_CLASSES_LABEL,
  DECREE_PREREQUISITES_LABEL,
  CONSEQUENCE_PREVIEW_HEADER,
} from '../../../data/text/reports';
import { ConsequencePreview } from '../consequence-preview/consequence-preview';
import styles from './decree-card.module.css';

// ============================================================
// Props
// ============================================================

interface DecreeCardProps {
  id: string;
  title: string;
  category: DecreeCategory;
  slotCost: number;
  resourceCosts?: Partial<Record<ResourceType, number>>;
  prerequisites?: string[];
  affectedClasses?: PopulationClass[];
  effectPreview: string;
  consequencePreview?: MechanicalEffectDelta;
  isNew?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onSelect?: (id: string) => void;
}

// ============================================================
// Private sub-components
// ============================================================

function SlotCostDots({ cost, maxSlots }: { cost: number; maxSlots: number }) {
  const dots = [];
  for (let i = 0; i < maxSlots; i++) {
    dots.push(
      <span
        key={i}
        className={i < cost ? styles.slotFilled : styles.slotEmpty}
        aria-hidden="true"
      />,
    );
  }
  return (
    <span className={styles.slotDots} aria-label={`${DECREE_SLOT_COST_LABEL}: ${cost}`}>
      {dots}
    </span>
  );
}

// ============================================================
// Decree Card
// ============================================================

export function DecreeCard({
  id,
  title,
  category,
  slotCost,
  resourceCosts,
  prerequisites,
  affectedClasses,
  effectPreview,
  consequencePreview,
  isNew,
  isDisabled,
  disabledReason,
  onSelect,
}: DecreeCardProps) {
  const resourceCostEntries = resourceCosts
    ? (Object.entries(resourceCosts) as [ResourceType, number][]).filter(([, v]) => v > 0)
    : [];

  return (
    <div className={styles.card + (isDisabled ? ' ' + styles.disabled : '')}>
      {/* Header row */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.categoryBadge}>{DECREE_CATEGORY_LABELS[category]}</span>
        {isNew && <span className={styles.newBadge}>New</span>}
      </div>

      {/* Slot cost */}
      <div className={styles.costRow}>
        <span className={styles.costLabel}>{DECREE_SLOT_COST_LABEL}</span>
        <SlotCostDots cost={slotCost} maxSlots={3} />
      </div>

      {/* Resource costs */}
      {resourceCostEntries.length > 0 && (
        <div className={styles.resourceCosts}>
          {resourceCostEntries.map(([type, amount]) => (
            <span key={type} className={styles.resourceCost}>
              {RESOURCE_TYPE_LABELS[type]}: {amount}
            </span>
          ))}
        </div>
      )}

      {/* Prerequisites */}
      {prerequisites && prerequisites.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{DECREE_PREREQUISITES_LABEL}</span>
          <ul className={styles.prerequisiteList}>
            {prerequisites.map((prereq) => (
              <li key={prereq} className={styles.prerequisiteItem}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Affected classes */}
      {affectedClasses && affectedClasses.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{DECREE_AFFECTED_CLASSES_LABEL}</span>
          <div className={styles.classChips}>
            {affectedClasses.map((cls) => (
              <span key={cls} className={styles.classChip}>{CLASS_LABELS[cls]}</span>
            ))}
          </div>
        </div>
      )}

      {/* Effect preview */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>{DECREE_EFFECT_LABEL}</span>
        <p className={styles.effectPreview}>{effectPreview}</p>
      </div>

      {/* Consequence preview — directional impact indicators */}
      {consequencePreview && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{CONSEQUENCE_PREVIEW_HEADER}</span>
          <ConsequencePreview effects={consequencePreview} />
        </div>
      )}

      {/* Select button */}
      <button
        className={styles.selectButton}
        disabled={isDisabled}
        onClick={() => onSelect?.(id)}
        aria-label={isDisabled ? `${title} — ${disabledReason}` : `Select decree: ${title}`}
      >
        Select
      </button>

      {isDisabled && disabledReason && (
        <span className={styles.disabledReason}>{disabledReason}</span>
      )}
    </div>
  );
}
