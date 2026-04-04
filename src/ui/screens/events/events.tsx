// Phase 10 — Events Screen: priority-ordered event and storyline presentation.
// Blueprint Reference: ui-blueprint.md §5.3; ux-blueprint.md §4

import { useState, useCallback, useContext } from 'react';

import {
  ActionType,
  EventSeverity,
  type ActiveEvent,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import { GameContext } from '../../context/game-context';
import { useRightPanel } from '../../context/right-panel-context';
import { EVENT_TEXT, STORYLINE_TEXT } from '../../../data/text/events';
import { EVENT_POOL } from '../../../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../../../data/events/effects';
import { EventPanel, type EventPanelChoice } from '../../components/event-panel/event-panel';
import styles from './events.module.css';

// ============================================================
// Helpers
// ============================================================

const SEVERITY_SORT_ORDER: Record<EventSeverity, number> = {
  [EventSeverity.Critical]: 0,
  [EventSeverity.Serious]: 1,
  [EventSeverity.Notable]: 2,
  [EventSeverity.Informational]: 3,
};

function sortBySeverity(a: ActiveEvent, b: ActiveEvent): number {
  return SEVERITY_SORT_ORDER[a.severity] - SEVERITY_SORT_ORDER[b.severity];
}

function buildChoices(event: ActiveEvent): EventPanelChoice[] {
  const textEntry = EVENT_TEXT[event.definitionId];
  const definition = EVENT_POOL.find((d) => d.id === event.definitionId);

  if (!textEntry || !definition) return [];

  const effectsForEvent = EVENT_CHOICE_EFFECTS[event.definitionId];

  return definition.choices.map((choice) => ({
    choiceId: choice.choiceId,
    label: textEntry.choices[choice.choiceId] ?? choice.choiceId,
    slotCost: choice.slotCost,
    isFree: choice.isFree,
    effects: effectsForEvent?.[choice.choiceId],
  }));
}

// ============================================================
// Events Screen
// ============================================================

export function Events() {
  const kingdom = useKingdomState();
  const { queueAction } = useTurnActions();
  const ctx = useContext(GameContext);
  const { update: updateRightPanel } = useRightPanel();
  const [actionError, setActionError] = useState<string | null>(null);

  const activeEvents = kingdom.activeEvents;
  const activeStorylines = kingdom.activeStorylines;

  // ---- Categorize events ----

  const storylineUnresolved: ActiveEvent[] = [];
  const otherUnresolved: ActiveEvent[] = [];
  const resolved: ActiveEvent[] = [];

  for (const event of activeEvents) {
    if (event.isResolved) {
      resolved.push(event);
    } else if (event.relatedStorylineId) {
      storylineUnresolved.push(event);
    } else {
      otherUnresolved.push(event);
    }
  }

  storylineUnresolved.sort(sortBySeverity);
  otherUnresolved.sort(sortBySeverity);
  resolved.sort((a, b) => b.turnSurfaced - a.turnSurfaced);

  // ---- Handle choice selection ----

  const handleChoiceSelect = useCallback(
    (eventId: string, choiceId: string) => {
      setActionError(null);

      const event = activeEvents.find((e) => e.id === eventId);
      if (!event || event.isResolved) return;

      const definition = EVENT_POOL.find((d) => d.id === event.definitionId);
      if (!definition) return;

      const choiceDef = definition.choices.find((c) => c.choiceId === choiceId);
      if (!choiceDef) return;

      // Queue the action
      const action: QueuedAction = {
        id: `${eventId}_${choiceId}_${Date.now()}`,
        type: ActionType.CrisisResponse,
        actionDefinitionId: `${event.definitionId}_${choiceId}`,
        slotCost: choiceDef.slotCost,
        isFree: choiceDef.isFree,
        targetRegionId: event.affectedRegionId,
        targetNeighborId: null,
        parameters: { eventId, choiceId },
      };

      const error = queueAction(action);
      if (error !== null) {
        setActionError(error.code);
        return;
      }

      // Mark event as resolved in game state
      if (ctx) {
        ctx.dispatch({
          type: 'UPDATE_GAME_STATE',
          updater: (state) => ({
            ...state,
            activeEvents: state.activeEvents.map((e) =>
              e.id === eventId
                ? { ...e, isResolved: true, choiceMade: choiceId }
                : e,
            ),
          }),
        });
      }
    },
    [activeEvents, queueAction, ctx],
  );

  // ---- Helper to resolve storyline info for an event ----

  function resolveStorylineInfo(
    event: ActiveEvent,
  ): { storylineTitle: string; actNumber: number } | null {
    if (!event.relatedStorylineId) return null;

    const storyline = activeStorylines.find(
      (s) => s.id === event.relatedStorylineId,
    );
    if (!storyline) return null;

    const text = STORYLINE_TEXT[storyline.definitionId];
    return {
      storylineTitle: text?.title ?? storyline.definitionId,
      actNumber: storyline.decisionHistory.length + 1,
    };
  }

  // ---- Render an event ----

  function renderEvent(event: ActiveEvent) {
    const textEntry = EVENT_TEXT[event.definitionId];
    if (!textEntry) return null;

    const choices = buildChoices(event);
    const storylineInfo = resolveStorylineInfo(event);
    const chainInfo =
      event.chainId && event.chainStep != null
        ? { chainId: event.chainId, chainStep: event.chainStep }
        : null;

    return (
      <div
        key={event.id}
        onMouseEnter={() => updateRightPanel({ selectedEventId: event.id })}
        onFocus={() => updateRightPanel({ selectedEventId: event.id })}
      >
        <EventPanel
          eventId={event.id}
          title={textEntry.title}
          body={textEntry.body}
          severity={event.severity}
          category={event.category}
          choices={choices}
          affectedClasses={event.affectedClassId ? [event.affectedClassId] : undefined}
          chainInfo={chainInfo}
          storylineInfo={storylineInfo}
          isResolved={event.isResolved}
          choiceMade={event.choiceMade}
          onChoiceSelect={handleChoiceSelect}
        />
      </div>
    );
  }

  // ---- Empty state ----

  if (activeEvents.length === 0) {
    return (
      <div className={styles.screen}>
        <p className={styles.emptyState}>
          No dispatches require your attention at this time. The kingdom proceeds in order.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {actionError && (
        <p className={styles.errorMessage}>{actionError}</p>
      )}

      {/* Storyline Events Requiring Response */}
      {storylineUnresolved.length > 0 && (
        <section>
          <h2 className={styles.sectionHeader}>
            Storyline Developments
            <span className={styles.sectionCount}>{storylineUnresolved.length}</span>
          </h2>
          <div className={styles.eventList}>
            {storylineUnresolved.map(renderEvent)}
          </div>
        </section>
      )}

      {/* Other Unresolved Events */}
      {otherUnresolved.length > 0 && (
        <section>
          <h2 className={styles.sectionHeader}>
            Matters Requiring Response
            <span className={styles.sectionCount}>{otherUnresolved.length}</span>
          </h2>
          <div className={styles.eventList}>
            {otherUnresolved.map(renderEvent)}
          </div>
        </section>
      )}

      {/* Recently Resolved Events */}
      {resolved.length > 0 && (
        <section>
          <h2 className={styles.sectionHeader}>
            Recently Resolved
            <span className={styles.sectionCount}>{resolved.length}</span>
          </h2>
          <div className={styles.eventList}>
            {resolved.map(renderEvent)}
          </div>
        </section>
      )}
    </div>
  );
}
