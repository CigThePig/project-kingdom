// Workstream A — Task A3: World Pulse Reclassified Text
// Events removed from the decision pool and converted to ambient flavor lines.
// Each entry preserves the original event's trigger conditions so the World Pulse
// generator can surface them under the same circumstances.

import type { EventTriggerCondition } from '../../engine/events/event-engine';

export interface WorldPulseReclassifiedEntry {
  eventId: string;
  text: string;
  triggerConditions: EventTriggerCondition[];
}

export const WORLD_PULSE_RECLASSIFIED: WorldPulseReclassifiedEntry[] = [
  {
    eventId: 'evt_region_local_festival',
    text: 'A local festival fills the streets with music and celebration in the provinces.',
    triggerConditions: [
      { type: 'faith_above', threshold: 50 },
      { type: 'random_chance', probability: 0.25 },
    ],
  },
];
