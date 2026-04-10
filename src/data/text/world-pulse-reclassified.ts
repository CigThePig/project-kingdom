// Workstream A — Task A3: World Pulse Reclassified Text
// Events removed from the decision pool and converted to ambient flavor lines.
// Each entry preserves the original event's trigger conditions so the World Pulse
// generator can surface them under the same circumstances.

import type { EventTriggerCondition } from '../../engine/events/event-engine';
import { Season } from '../../engine/types';

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
  {
    eventId: 'evt_seasonal_market_bustle',
    text: 'The seasonal market hums with trade as merchants from distant lands fill the square with exotic wares.',
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'treasury_above', threshold: 200 },
    ],
  },
  {
    eventId: 'evt_autumn_pilgrim_procession',
    text: 'A procession of pilgrims winds through the countryside, singing hymns as they journey to a distant shrine.',
    triggerConditions: [
      { type: 'faith_above', threshold: 60 },
      { type: 'season_is', season: Season.Autumn },
    ],
  },
  {
    eventId: 'evt_winter_hearth_tales',
    text: 'As winter deepens, taverns fill with travelers sharing tales of distant kingdoms and strange omens.',
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'stability_above', threshold: 40 },
    ],
  },
  {
    eventId: 'evt_spring_construction_bustle',
    text: 'Spring brings renewed energy to the builders — scaffolding rises and hammers ring across the capital.',
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'treasury_above', threshold: 150 },
    ],
  },
];
