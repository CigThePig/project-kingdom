// Phase 7 — Wave-2 Event & Petition Text: aggregate barrel.
//
// Exports:
//  - EXPANSION_WAVE_2_CRISIS_TEXT:    25 entries (2 originals + 23 new)
//  - EXPANSION_WAVE_2_PETITION_TEXT:  20 entries (2 originals + 18 new)
//
// Imported by `src/data/text/events.ts` and spread into the `EVENT_TEXT`
// lookup used by every card generator.

import type { EventTextEntry } from '../../events';

import { EXPANSION_WAVE_2_CRISES_ORIGINAL_TEXT } from './crises-originals';
import { EXPANSION_WAVE_2_CRISES_DISASTER_TEXT } from './crises-disasters';
import { EXPANSION_WAVE_2_CRISES_RELIGIOUS_TEXT } from './crises-religious';
import { EXPANSION_WAVE_2_CRISES_POLITICAL_TEXT } from './crises-political';
import { EXPANSION_WAVE_2_CRISES_SOCIAL_TEXT } from './crises-social';
import { EXPANSION_WAVE_2_CRISES_PHENOMENA_TEXT } from './crises-phenomena';

import { EXPANSION_WAVE_2_PETITIONS_ORIGINAL_TEXT } from './petitions-originals';
import { EXPANSION_WAVE_2_PETITIONS_GUILD_TEXT } from './petitions-guilds';
import { EXPANSION_WAVE_2_PETITIONS_CIVIC_TEXT } from './petitions-civic';
import { EXPANSION_WAVE_2_PETITIONS_RELIGIOUS_TEXT } from './petitions-religious';
import { EXPANSION_WAVE_2_PETITIONS_MILITARY_TEXT } from './petitions-military';

export const EXPANSION_WAVE_2_CRISIS_TEXT: Record<string, EventTextEntry> = {
  ...EXPANSION_WAVE_2_CRISES_ORIGINAL_TEXT,
  ...EXPANSION_WAVE_2_CRISES_DISASTER_TEXT,
  ...EXPANSION_WAVE_2_CRISES_RELIGIOUS_TEXT,
  ...EXPANSION_WAVE_2_CRISES_POLITICAL_TEXT,
  ...EXPANSION_WAVE_2_CRISES_SOCIAL_TEXT,
  ...EXPANSION_WAVE_2_CRISES_PHENOMENA_TEXT,
};

export const EXPANSION_WAVE_2_PETITION_TEXT: Record<string, EventTextEntry> = {
  ...EXPANSION_WAVE_2_PETITIONS_ORIGINAL_TEXT,
  ...EXPANSION_WAVE_2_PETITIONS_GUILD_TEXT,
  ...EXPANSION_WAVE_2_PETITIONS_CIVIC_TEXT,
  ...EXPANSION_WAVE_2_PETITIONS_RELIGIOUS_TEXT,
  ...EXPANSION_WAVE_2_PETITIONS_MILITARY_TEXT,
};
