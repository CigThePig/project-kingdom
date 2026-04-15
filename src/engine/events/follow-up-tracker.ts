// Follow-up tracker — manages scheduled follow-up events that arise from player choices.
// Pure engine logic. No React imports.

import type { ActiveEvent, GameState, PendingFollowUp } from '../types';
import type { EventDefinition } from './event-engine';
import { evaluateCondition, resolveNeighborId } from './event-engine';
import { DEFAULT_MAX_STATE_RETRIES } from '../constants';

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

    // Composite dedupe: sourceEventId + triggerChoiceId + definitionId.
    // Prevents true duplicates while allowing the same follow-up definition
    // to be scheduled from different source events.
    const alreadyPending = pendingFollowUps.some(
      (p) =>
        p.sourceEventId === resolvedEvent.definitionId &&
        p.triggerChoiceId === resolvedEvent.choiceMade &&
        p.definitionId === followUp.followUpDefinitionId,
    );
    if (alreadyPending) continue;

    const alreadyInBatch = newFollowUps.some(
      (p) =>
        p.sourceEventId === resolvedEvent.definitionId &&
        p.triggerChoiceId === resolvedEvent.choiceMade &&
        p.definitionId === followUp.followUpDefinitionId,
    );
    if (alreadyInBatch) continue;

    newFollowUps.push({
      id: `fu-${followUp.followUpDefinitionId}-t${currentTurn}-${Math.random().toString(36).slice(2, 8)}`,
      definitionId: followUp.followUpDefinitionId,
      sourceEventId: resolvedEvent.definitionId,
      triggerChoiceId: resolvedEvent.choiceMade,
      triggerTurn: currentTurn,
      delayTurns: followUp.delayTurns,
      probability: followUp.probability,
      stateConditions: followUp.stateConditions,
      stateRetries: 0,
      maxStateRetries: followUp.maxStateRetries,
      exclusiveGroupId: followUp.exclusiveGroupId ?? null,
    });
  }

  if (newFollowUps.length === 0) return pendingFollowUps;
  return [...pendingFollowUps, ...newFollowUps];
}

/**
 * Processes due follow-up events for the current turn.
 *
 * Processing order per follow-up:
 * 1. Timing check — not yet due goes to remaining
 * 2. Exclusive group pre-check — if a sibling already surfaced this turn, discard
 * 3. State conditions — all must pass (AND-list); empty/undefined = pass
 * 4. If conditions fail — increment stateRetries, re-queue or discard
 * 5. If conditions pass — roll probability
 * 6. If probability passes — surface; track exclusive group
 * 7. Post-loop — cancel remaining follow-ups whose exclusive group was surfaced
 */
export function processDueFollowUps(
  pendingFollowUps: PendingFollowUp[],
  eventPool: EventDefinition[],
  currentTurn: number,
  state: GameState,
  activeEventIds: Set<string>,
  historyEventIds: Set<string>,
): { surfacedEvents: ActiveEvent[]; remainingFollowUps: PendingFollowUp[] } {
  const surfaced: ActiveEvent[] = [];
  let remaining: PendingFollowUp[] = [];

  const surfacedExclusiveGroups = new Set<string>();

  for (const followUp of pendingFollowUps) {
    const turnsElapsed = currentTurn - followUp.triggerTurn;

    // 1. Timing check.
    if (turnsElapsed < followUp.delayTurns) {
      remaining.push(followUp);
      continue;
    }

    // 2. Exclusive group pre-check: if a sibling already surfaced this turn, discard.
    if (
      followUp.exclusiveGroupId != null &&
      surfacedExclusiveGroups.has(followUp.exclusiveGroupId)
    ) {
      continue;
    }

    // 3. Evaluate state conditions (AND-list).
    const conditions = followUp.stateConditions ?? [];
    const conditionsPass = conditions.every((c) =>
      evaluateCondition(c, state, currentTurn),
    );

    if (!conditionsPass) {
      // Conditions failed. Check retry budget.
      const retries = followUp.stateRetries ?? 0;
      const maxRetries = followUp.maxStateRetries ?? DEFAULT_MAX_STATE_RETRIES;
      if (retries < maxRetries) {
        remaining.push({
          ...followUp,
          stateRetries: retries + 1,
        });
      }
      // else: max retries exhausted, discard silently.
      continue;
    }

    // 4. Conditions passed. Roll probability.
    if (Math.random() > followUp.probability) {
      // Failed probability — discard permanently.
      continue;
    }

    // 5. Find the definition to create the ActiveEvent.
    const definition = eventPool.find((d) => d.id === followUp.definitionId);
    if (!definition) continue;

    // 6a. If this definition was already resolved in the past, discard permanently.
    // Re-queuing it would cause unbounded growth of pendingFollowUps.
    if (historyEventIds.has(definition.id)) {
      continue;
    }
    // 6b. If this definition is currently active (unresolved), re-queue for next turn.
    if (activeEventIds.has(definition.id)) {
      remaining.push(followUp);
      continue;
    }

    // 7. Surface the follow-up.
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
      affectedNeighborId: resolveNeighborId(definition.affectsNeighbor, state),
      relatedStorylineId: definition.relatedStorylineId,
      outcomeQuality: null,
      isFollowUp: true,
      followUpSourceId: followUp.sourceEventId,
    };

    surfaced.push(activeEvent);

    if (followUp.exclusiveGroupId != null) {
      surfacedExclusiveGroups.add(followUp.exclusiveGroupId);
    }
  }

  // 8. Post-loop: cancel remaining follow-ups whose exclusive group was surfaced.
  if (surfacedExclusiveGroups.size > 0) {
    remaining = remaining.filter(
      (fu) =>
        fu.exclusiveGroupId == null ||
        !surfacedExclusiveGroups.has(fu.exclusiveGroupId),
    );
  }

  return { surfacedEvents: surfaced, remainingFollowUps: remaining };
}

function pickRegionId(state: GameState): string | null {
  const eligible = state.regions.filter((r) => !r.isOccupied);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].id;
}
