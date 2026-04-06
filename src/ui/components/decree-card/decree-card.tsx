// Decree Card: decree option display with cost, effect preview, and progression state.
// Blueprint Reference: ui-blueprint.md §4.3, §6.4

import { DecreeCategory } from '../../../engine/types';
import type { MechanicalEffectDelta, PopulationClass, ResourceType } from '../../../engine/types';
import type { DecreeStatus } from '../../../engine/systems/decree-progression';
import {
  DECREE_CATEGORY_LABELS,
  CLASS_LABELS,
  RESOURCE_TYPE_LABELS,
  DECREE_ENACTED_LABEL,
  DECREE_UNLOCKED_LABEL,
  DECREE_TIER_LABEL,
} from '../../../data/text/labels';
import {
  DECREE_SLOT_COST_LABEL,
  DECREE_EFFECT_LABEL,
  DECREE_AFFECTED_CLASSES_LABEL,
  DECREE_PREREQUISITES_LABEL,
  CONSEQUENCE_PREVIEW_HEADER,
} from '../../../data/text/reports';
import { ConsequencePreview } from '../consequence-preview/consequence-preview';
import { Icon } from '../icon/icon';
import styles from './decree-card.module.css';

const CATEGORY_ICON_MAP: Record<DecreeCategory, string> = {
  [DecreeCategory.Economic]: 'treasury',
  [DecreeCategory.Military]: 'military',
  [DecreeCategory.Civic]: 'stability',
  [DecreeCategory.Religious]: 'flame',
  [DecreeCategory.Diplomatic]: 'diplomacy',
  [DecreeCategory.Social]: 'food',
};

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
  /** Progression status of this decree. */
  progressionStatus?: DecreeStatus;
  /** Turns remaining before a repeatable decree can be re-issued. */
  cooldownTurnsRemaining?: number;
  /** Chain progress: how far through the chain the player has progressed. */
  chainProgress?: { currentTier: number; maxTier: number } | null;
  /** This decree's tier within its chain (1-based). */
  tier?: number;
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

function ChainProgressDots({ currentTier, maxTier }: { currentTier: number; maxTier: number }) {
  const dots = [];
  for (let i = 1; i <= maxTier; i++) {
    let dotClass = styles.chainDotFuture;
    if (i <= currentTier) dotClass = styles.chainDotComplete;
    else if (i === currentTier + 1) dotClass = styles.chainDotCurrent;
    dots.push(
      <span key={i} className={dotClass} aria-hidden="true" />,
    );
  }
  return (
    <span className={styles.chainProgress} aria-label={`${DECREE_TIER_LABEL} ${currentTier} of ${maxTier}`}>
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
  progressionStatus,
  cooldownTurnsRemaining,
  chainProgress,
  tier,
}: DecreeCardProps) {
  const resourceCostEntries = resourceCosts
    ? (Object.entries(resourceCosts) as [ResourceType, number][]).filter(([, v]) => v > 0)
    : [];

  const isEnacted = progressionStatus === 'enacted';
  const isLocked = progressionStatus === 'locked';
  const isCooldown = progressionStatus === 'cooldown';
  const isUnlocked = progressionStatus === 'unlocked';

  const cardClasses = [
    styles.card,
    isDisabled || isEnacted || isLocked || isCooldown ? styles.disabled : '',
    isEnacted ? styles.enacted : '',
    isLocked ? styles.chainLocked : '',
    isCooldown ? styles.cooldown : '',
  ].filter(Boolean).join(' ');

  const buttonLabel = isEnacted
    ? DECREE_ENACTED_LABEL
    : isCooldown && cooldownTurnsRemaining
      ? `${cooldownTurnsRemaining} turn${cooldownTurnsRemaining !== 1 ? 's' : ''}`
      : 'Select';

  const effectivelyDisabled = isDisabled || isEnacted || isLocked || isCooldown;

  return (
    <div className={cardClasses}>
      {/* Header row */}
      <div className={styles.header}>
        <Icon name={CATEGORY_ICON_MAP[category] ?? 'decrees'} size="1.25em" className={styles.categoryIcon} />
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.categoryBadge}>{DECREE_CATEGORY_LABELS[category]}</span>
        {isEnacted && <span className={styles.enactedBadge}>{DECREE_ENACTED_LABEL}</span>}
        {isUnlocked && <span className={styles.unlockedBadge}>{DECREE_UNLOCKED_LABEL}</span>}
        {isNew && !isEnacted && !isUnlocked && <span className={styles.newBadge}>New</span>}
      </div>

      {/* Chain progress + tier indicator */}
      {chainProgress && chainProgress.maxTier > 1 && (
        <div className={styles.chainRow}>
          <span className={styles.tierLabel}>{DECREE_TIER_LABEL} {tier ?? 1}</span>
          <ChainProgressDots currentTier={chainProgress.currentTier} maxTier={chainProgress.maxTier} />
        </div>
      )}

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

      {/* Select / Enacted / Cooldown button */}
      <button
        className={styles.selectButton}
        disabled={effectivelyDisabled}
        onClick={() => onSelect?.(id)}
        aria-label={effectivelyDisabled ? `${title} — ${disabledReason ?? progressionStatus}` : `Select decree: ${title}`}
      >
        {buttonLabel}
      </button>

      {effectivelyDisabled && disabledReason && (
        <span className={styles.disabledReason}>{disabledReason}</span>
      )}
    </div>
  );
}
