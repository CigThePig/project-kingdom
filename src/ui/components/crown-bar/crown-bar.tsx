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
import styles from './crown-bar.module.css';

// ============================================================
// Props
// ============================================================

interface CrownBarProps {
  onNavigateToEvents: () => void;
  onToggleIntelPanel: () => void;
}

// ============================================================
// Private sub-components
// ============================================================

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.statChip}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
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

export function CrownBar({ onNavigateToEvents, onToggleIntelPanel }: CrownBarProps) {
  const crownBar = useCrownBar();
  const actionBudget = useActionBudget();
  const [expanded, setExpanded] = useState(false);

  return (
    <header
      className={`${styles.crownBar} ${expanded ? styles.expanded : ''}`}
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
        <StatChip label="Treasury" value={crownBar.treasuryBalance} />
        <StatChip label="Food" value={crownBar.foodReserves} />
        <StatChip label="Stability" value={crownBar.stabilityRating} />
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
          Intel
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
