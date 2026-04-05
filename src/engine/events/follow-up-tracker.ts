// Follow-up tracker — manages scheduled follow-up events that arise from player choices.
// Pure engine logic. No React imports.

import type { ActiveEvent, GameState, PendingFollowUp } from '../types';
import type { EventDefinition } from './event-engine';

/**
 * Schedules follow-up events based on a resolved event's choice.
 * Checks the event definition for follow-up rules matching the chosen choiceId.
 * Returns updated pendingFollowUps array (does not mutate input).
 */
export function scheduleFollowUps(
  pendingFollowUps: PendingFollowUp[],
  resolvedEvent: ActiveEvent,
  eventPool: EventDefinition[],
  currentTurn: number,
): PendingFollowUp[] {
  if (!resolvedEvent.isResolved || resolvedEvent.choiceMade === null) return pendingFollowUps;

  const definition = eventPool.find((d) => d.id === resolvedEvent.definitionId);
  if (!definition?.followUpEvents) return pendingFollowUps;

  const newFollowUps: PendingFollowUp[] = [];

  for (const followUp of definition.followUpEvents) {
    if (followUp.triggerChoiceId !== resolvedEvent.choiceMade) continue;

    // Don't schedule duplicates (same definitionId already pending).
    const alreadyPending = pendingFollowUps.some(
      (p) => p.definitionId === followUp.followUpDefinitionId,
    );
    if (alreadyPending) continue;

    newFollowUps.push({
      id: `fu-${followUp.followUpDefinitionId}-t${currentTurn}-${Math.random().toString(36).slice(2, 8)}`,
      definitionId: followUp.followUpDefinitionId,
      sourceEventId: resolvedEvent.definitionId,
      triggerChoiceId: resolvedEvent.choiceMade,
      triggerTurn: currentTurn,
      delayTurns: followUp.delayTurns,
      probability: followUp.probability,
    });
  }

  if (newFollowUps.length === 0) return pendingFollowUps;
  return [...pendingFollowUps, ...newFollowUps];
}

/**
 * Processes due follow-up events for the current turn.
 * Returns an object with:
 * - `surfacedEvents`: ActiveEvent[] — follow-up events ready to surface this turn
 * - `remainingFollowUps`: PendingFollowUp[] — follow-ups not yet due or that failed probability check
 */
export function processDueFollowUps(
  pendingFollowUps: PendingFollowUp[],
  eventPool: EventDefinition[],
  currentTurn: number,
  state: GameState,
  existingEventIds: Set<string>,
): { surfacedEvents: ActiveEvent[]; remainingFollowUps: PendingFollowUp[] } {
  const surfaced: ActiveEvent[] = [];
  const remaining: PendingFollowUp[] = [];

  for (const followUp of pendingFollowUps) {
    const turnsElapsed = currentTurn - followUp.triggerTurn;

    if (turnsElapsed < followUp.delayTurns) {
      // Not yet due.
      remaining.push(followUp);
      continue;
    }

    // Due now. Roll probability.
    if (Math.random() > followUp.probability) {
      // Failed probability check — discard.
      continue;
    }

    // Find the definition to create the ActiveEvent.
    const definition = eventPool.find((d) => d.id === followUp.definitionId);
    if (!definition) continue;

    // Skip if already active.
    if (existingEventIds.has(definition.id)) {
      remaining.push(followUp);
      continue;
    }

    const activeEvent: ActiveEvent = {
      id: `evt-${definition.id}-t${currentTurn}-${Math.random().toString(36).slice(2, 8)}`,
      definitionId: definition.id,
      severity: definition.severity,
      category: definition.category,
      isResolved: false,
      choiceMade: null,
      chainId: definition.chainId,
      chainStep: definition.chainStep,
      turnSurfaced: currentTurn,
      affectedRegionId: definition.affectsRegion ? pickRegionId(state) : null,
      affectedClassId: definition.affectsClass,
      relatedStorylineId: definition.relatedStorylineId,
      outcomeQuality: null,
      isFollowUp: true,
      followUpSourceId: followUp.sourceEventId,
    };

    surfaced.push(activeEvent);
  }

  return { surfacedEvents: surfaced, remainingFollowUps: remaining };
}

function pickRegionId(state: GameState): string | null {
  const eligible = state.regions.filter((r) => !r.isOccupied);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].id;
}
