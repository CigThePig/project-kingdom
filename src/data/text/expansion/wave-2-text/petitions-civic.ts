// Phase 7 — Wave-2 Petition Text: Civic & Regional.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_PETITIONS_CIVIC_TEXT: Record<string, EventTextEntry> = {
  faction_req_w2_scholarly_society: {
    title: 'A Scholarly Society Seeks a Charter',
    body: '{chamberlain_or_fallback} brings before the throne a petition from a circle of clerics and lay scholars: they have organized a learned society and ask royal recognition. They promise a flowering of letters; the practical-minded suggest the whole thing is a way to draw royal coin without royal oversight.',
    choices: {
      charter_the_society: 'Charter the Society',
      refuse_the_charter: 'Refuse the Charter',
    },
  },
  faction_req_w2_regional_lords_road: {
    title: 'The Regional Lords Demand a Royal Road',
    body: 'Three regional lords have arrived with a joint petition handed to {chancellor_or_fallback}: the old trade road through their holdings in {region} is failing, and they ask for royal coin to rebuild it. The benefit to travel is clear; the benefit to their private rents is clearer still.',
    choices: {
      fund_the_royal_road: 'Fund the Royal Road',
      defer_the_road: 'Defer the Road',
    },
  },
  faction_req_w2_displaced_peasants: {
    title: 'Displaced Peasants at the Gates',
    body: '{chancellor_or_fallback} reports that a column of peasants driven from their holdings in {region} by a new round of enclosures has arrived at the capital. They ask for crown land to settle. Their lords send riders demanding the runaways be returned at once.',
    choices: {
      resettle_on_crown_land: 'Resettle on Crown Land',
      return_to_their_lords: 'Return Them to Their Lords',
    },
  },
  faction_req_w2_foreign_envoy: {
    title: 'A Foreign Envoy Awaits Audience',
    body: 'An envoy from a distant court has arrived unannounced and requests an audience. {chamberlain_or_fallback} says protocol calls for waiting; the envoy says urgent; {spymaster_or_fallback} says interesting. You may grant the audience at once or make him cool his heels.',
    choices: {
      grant_the_envoys_audience: 'Grant the Audience',
      make_the_envoy_wait: 'Make Him Wait',
    },
  },
  faction_req_w2_imprisoned_nobles: {
    title: 'The Imprisoned Nobles Petition for Release',
    body: 'Three lords imprisoned for intrigue last year have petitioned for release under an amnesty. Their kinsmen are noisy; the common people remember the cost of the intrigue and want them to rot.',
    choices: {
      release_with_amnesty: 'Release with Amnesty',
      hold_them_longer: 'Hold Them Longer',
    },
  },
  faction_req_w2_bridge_petition: {
    title: 'A Village Begs a New Bridge',
    body: 'A delegation from a river-crossing village in {region} reports the old bridge is failing and the ferry has drowned two men this year. They ask for royal coin to fund a stone bridge. The treasurer asks whether there are not more pressing stones in the country.',
    choices: {
      authorize_the_bridge: 'Authorize the Bridge',
      wait_for_better_weather: 'Wait for Better Weather',
    },
  },
};
