// Bridge Layer — Event Classifier
// Classifies ActiveEvent objects as 'crisis', 'petition', or 'notification'
// based on severity and the data-layer classification field.

import type { ActiveEvent } from '../engine/types';
import { EventSeverity } from '../engine/types';
import { EVENT_POOL } from '../data/events/index';
import { FOLLOW_UP_POOL } from '../data/events/index';

export type EventRole = 'crisis' | 'petition' | 'notification';

export function classifyEventRole(event: ActiveEvent): EventRole {
  // Check the data-layer classification first.
  const def = EVENT_POOL.find((e) => e.id === event.definitionId)
    ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);
  if (def?.classification === 'notification') return 'notification';

  // Severity-based routing for standard events.
  return event.severity === EventSeverity.Critical || event.severity === EventSeverity.Serious
    ? 'crisis'
    : 'petition';
}

export function partitionEvents(events: ActiveEvent[]): {
  crisisEvents: ActiveEvent[];
  petitionEvents: ActiveEvent[];
  notificationEvents: ActiveEvent[];
} {
  const unresolved = events.filter((e) => !e.isResolved);
  return {
    crisisEvents: unresolved.filter((e) => classifyEventRole(e) === 'crisis'),
    petitionEvents: unresolved.filter((e) => classifyEventRole(e) === 'petition'),
    notificationEvents: unresolved.filter((e) => classifyEventRole(e) === 'notification'),
  };
}
