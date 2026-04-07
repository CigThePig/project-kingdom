// Bridge Layer — Event Classifier
// Classifies ActiveEvent objects as 'crisis' or 'petition' based on severity.

import type { ActiveEvent } from '../engine/types';
import { EventSeverity } from '../engine/types';

export type EventRole = 'crisis' | 'petition';

export function classifyEventRole(event: ActiveEvent): EventRole {
  return event.severity === EventSeverity.Critical || event.severity === EventSeverity.Serious
    ? 'crisis'
    : 'petition';
}

export function partitionEvents(events: ActiveEvent[]): {
  crisisEvents: ActiveEvent[];
  petitionEvents: ActiveEvent[];
} {
  const unresolved = events.filter((e) => !e.isResolved);
  return {
    crisisEvents: unresolved.filter((e) => classifyEventRole(e) === 'crisis'),
    petitionEvents: unresolved.filter((e) => classifyEventRole(e) === 'petition'),
  };
}
