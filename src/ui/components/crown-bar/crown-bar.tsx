// Phase 8 — Crown Bar: persistent top status strip.
// Blueprint Reference: ui-blueprint.md §3.2

import { useState } from 'react';

import { useCrownBar, useActionBudget } from '../../hooks/use-game-state';
import {
  KINGDOM_NAME,
  TURN_LABEL,
  YEAR_LABEL,
  SEASON_LABELS,
  ACTION_BUDGET_LABEL,
  SAVE_LABEL,
} from '../../../data/text/labels';
import {
  TREASURY_LOW_BALANCE_WARNING,
  STABILITY_CRITICAL_THRESHOLD,
} from '../../../engine/constants';
import { Icon } from '../icon/icon';
import { ChangeHighlight } from '../change-highlight/change-highlight';
import styles from './crown-bar.module.css';

// ============================================================
// Props
// ============================================================

interface CrownBarProps {
  onNavigateToEvents: () => void;
  onToggleIntelPanel: () => void;
  hidden?: boolean;
}

// ============================================================
// Private sub-components
// ============================================================

const STAT_ICON_MAP: Record<string, string> = {
  Treasury: 'treasury',
  Food: 'food',
  Stability: 'stability',
};

function StatChip({ label, value, critical }: { label: string; value: number; critical?: boolean }) {
  const iconName = STAT_ICON_MAP[label];
  return (
    <div className={styles.statChip} data-critical={critical || undefined}>
      <span className={styles.statLabel}>
        {iconName && <Icon name={iconName} size="0.75rem" />}
        {label}
      </span>
      <ChangeHighlight value={value}>
        <span className={styles.statValue}>{value}</span>
      </ChangeHighlight>
    </div>
  );
}

function UrgentBadge({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null;

  return (
    <button
      className={styles.urgentBadge}
      onClick={onClick}
      aria-label={`${count} urgent matter${count !== 1 ? 's' : ''} — view dispatches`}
    >
      <Icon name="warning" size="0.75rem" />
      {count}
    </button>
  );
}

function ActionSlots({ used, total }: { used: number; total: number }) {
  const slots = [];
  for (let i = 0; i < total; i++) {
    slots.push(
      <span
        key={i}
        className={i < used ? styles.slotFilled : styles.slotEmpty}
        aria-hidden="true"
      />,
    );
  }

  return (
    <div className={styles.actionSlots} aria-label={`${ACTION_BUDGET_LABEL}: ${total - used} of ${total}`}>
      {slots}
    </div>
  );
}

// ============================================================
// Crown Bar
// ============================================================

export function CrownBar({ onNavigateToEvents, onToggleIntelPanel, hidden }: CrownBarProps) {
  const crownBar = useCrownBar();
  const actionBudget = useActionBudget();
  const [expanded, setExpanded] = useState(false);

  return (
    <header
      className={`${styles.crownBar} ${expanded ? styles.expanded : ''} ${hidden ? styles.hidden : ''}`}
      style={{ gridArea: 'crown' }}
    >
      <div className={styles.leftCluster}>
        <span className={styles.kingdomName}>{KINGDOM_NAME}</span>
        <span className={styles.turnInfo}>
          {TURN_LABEL} {crownBar.turnNumber}
        </span>
        <span className={styles.seasonBadge}>
          {SEASON_LABELS[crownBar.season]}
        </span>
        <span className={styles.yearInfo}>
          {YEAR_LABEL} {crownBar.year}
        </span>
      </div>

      <div className={styles.centerCluster}>
        <StatChip label="Treasury" value={crownBar.treasuryBalance} critical={crownBar.treasuryBalance < TREASURY_LOW_BALANCE_WARNING} />
        <StatChip label="Food" value={crownBar.foodReserves} critical={crownBar.foodReserves < 50} />
        <StatChip label="Stability" value={crownBar.stabilityRating} critical={crownBar.stabilityRating < STABILITY_CRITICAL_THRESHOLD} />
      </div>

      <div className={styles.rightCluster}>
        <UrgentBadge count={crownBar.unresolvedUrgentMatters} onClick={onNavigateToEvents} />
        <ActionSlots used={actionBudget.slotsUsed} total={actionBudget.slotsTotal} />
        <button className={styles.saveButton} aria-label={SAVE_LABEL}>
          {SAVE_LABEL}
        </button>
        <button
          className={styles.intelToggle}
          onClick={onToggleIntelPanel}
          aria-label="Toggle intelligence panel"
        >
          <Icon name="intelligence" size="0.875rem" />
        </button>
      </div>

      <button
        className={styles.expandTrigger}
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? 'Collapse status bar' : 'Expand status bar'}
        aria-expanded={expanded}
      >
        {expanded ? '\u25B2' : '\u25BC'}
      </button>
    </header>
  );
}
