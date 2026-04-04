// Phase 12 — Archive Screen: historical record of kingdom events.
// Blueprint Reference: ui-blueprint.md §4.13; ux-blueprint.md §6

import { useState, useMemo } from 'react';

import {
  EventCategory,
  type TurnHistoryEntry,
  type ActiveEvent,
} from '../../../engine/types';
import { useTurnHistory } from '../../hooks/use-game-state';
import { useGameState } from '../../hooks/use-game-state';
import {
  EVENT_CATEGORY_LABELS,
  EVENT_SEVERITY_LABELS,
  SEASON_LABELS,
  ACTION_TYPE_LABELS,
} from '../../../data/text/labels';
import { EVENT_TEXT } from '../../../data/text/events';
import {
  ARCHIVE_EMPTY_TEXT,
  ARCHIVE_NO_RESULTS_TEXT,
} from '../../../data/text/reports';
import styles from './archive.module.css';

// ============================================================
// Types
// ============================================================

type CategoryFilter = 'all' | EventCategory;

// ============================================================
// Archive Screen
// ============================================================

export function Archive() {
  const turnHistory = useTurnHistory();
  const { eventHistory } = useGameState();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTurn, setExpandedTurn] = useState<number | null>(null);

  // Reverse chronological
  const sortedHistory = useMemo(
    () => [...turnHistory].sort((a, b) => b.turnNumber - a.turnNumber),
    [turnHistory],
  );

  // Filter events by category
  const filteredEvents = useMemo(() => {
    let events = [...eventHistory];
    if (categoryFilter !== 'all') {
      events = events.filter((e) => e.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter((e) => {
        const textEntry = EVENT_TEXT[e.definitionId];
        const title = textEntry?.title ?? e.definitionId;
        return title.toLowerCase().includes(query) || e.definitionId.toLowerCase().includes(query);
      });
    }
    return events;
  }, [eventHistory, categoryFilter, searchQuery]);

  const isEmpty = turnHistory.length === 0 && eventHistory.length === 0;

  return (
    <div className={styles.screen}>
      {isEmpty ? (
        <p className={styles.emptyState}>{ARCHIVE_EMPTY_TEXT}</p>
      ) : (
        <>
          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as CategoryFilter)
              }
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {EVENT_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            <input
              className={styles.filterSearch}
              type="text"
              placeholder="Search archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search archive"
            />
          </div>

          {/* Turn History */}
          <section>
            <h2 className={styles.sectionLabel}>
              Turn History ({sortedHistory.length})
            </h2>
            <div className={styles.turnList}>
              {sortedHistory.map((entry) => (
                <TurnEntry
                  key={entry.turnNumber}
                  entry={entry}
                  isExpanded={expandedTurn === entry.turnNumber}
                  onToggle={() =>
                    setExpandedTurn(
                      expandedTurn === entry.turnNumber
                        ? null
                        : entry.turnNumber,
                    )
                  }
                />
              ))}
            </div>
          </section>

          {/* Archived Events */}
          <section>
            <h2 className={styles.sectionLabel}>
              Resolved Events ({filteredEvents.length})
            </h2>
            {filteredEvents.length === 0 ? (
              <p className={styles.emptyState}>{ARCHIVE_NO_RESULTS_TEXT}</p>
            ) : (
              <div className={styles.eventList}>
                {filteredEvents
                  .sort((a, b) => b.turnSurfaced - a.turnSurfaced)
                  .map((event) => (
                    <ArchivedEventItem key={event.id} event={event} />
                  ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function TurnEntry({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: TurnHistoryEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={styles.turnCard}
      data-expanded={isExpanded ? 'true' : 'false'}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Turn ${entry.turnNumber} — ${SEASON_LABELS[entry.season]}, Year ${entry.year}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className={styles.turnHeader}>
        <span className={styles.turnLabel}>
          Month {entry.turnNumber} — {SEASON_LABELS[entry.season]}, Year{' '}
          {entry.year}
        </span>
        <div className={styles.turnBadges}>
          <span className={styles.turnBadge}>
            {entry.actionsIssued.length} action{entry.actionsIssued.length !== 1 ? 's' : ''}
          </span>
          <span className={styles.turnBadge}>
            {entry.eventsResolved.length} event{entry.eventsResolved.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className={styles.snapshotRow}>
        <span className={styles.snapshotItem}>
          Treasury: {entry.snapshotSummary.treasuryBalance}
        </span>
        <span className={styles.snapshotItem}>
          Food: {entry.snapshotSummary.foodReserves}
        </span>
        <span className={styles.snapshotItem}>
          Stability: {entry.snapshotSummary.stabilityValue}
        </span>
      </div>

      {isExpanded && entry.actionsIssued.length > 0 && (
        <div className={styles.turnDetail}>
          <span className={styles.detailTitle}>Actions Issued</span>
          <div className={styles.actionList}>
            {entry.actionsIssued.map((action) => (
              <div key={action.id} className={styles.actionItem}>
                <span className={styles.actionType}>
                  {ACTION_TYPE_LABELS[action.type]}
                </span>
                <span className={styles.actionId}>
                  {action.actionDefinitionId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArchivedEventItem({ event }: { event: ActiveEvent }) {
  const textEntry = EVENT_TEXT[event.definitionId];
  const title = textEntry?.title ?? event.definitionId;

  return (
    <div className={styles.eventItem}>
      <div className={styles.eventHeader}>
        <span className={styles.eventSeverity} data-severity={event.severity}>
          {EVENT_SEVERITY_LABELS[event.severity]}
        </span>
        <span className={styles.eventCategory}>
          {EVENT_CATEGORY_LABELS[event.category]}
        </span>
        <span className={styles.eventTurn}>Turn {event.turnSurfaced}</span>
      </div>
      <span className={styles.eventTitle}>{title}</span>
      {event.choiceMade && (
        <span className={styles.eventChoice}>
          Decision: {event.choiceMade}
        </span>
      )}
    </div>
  );
}
