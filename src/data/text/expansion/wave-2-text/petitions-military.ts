// Phase 7 — Wave-2 Petition Text: Military & Frontier.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_PETITIONS_MILITARY_TEXT: Record<string, EventTextEntry> = {
  faction_req_w2_border_captains_garrison: {
    title: 'The Border Captains Beg Reinforcement',
    body: '{marshal_or_fallback} brings word from the captains of the frontier march: their garrison has been thinned by two seasons of levy, and raiders press the passes each week. They ask for coin, men, and fresh equipment, or they will withdraw to the fallback line. The {class_plural} await the crown\'s reply.',
    choices: {
      reinforce_the_border_garrison: 'Reinforce the Garrison',
      leave_the_garrison_thin: 'Leave the Garrison Thin',
    },
  },
  faction_req_w2_knightly_order_grant: {
    title: 'A Knightly Order Seeks a Grant',
    body: 'A knightly order has petitioned {marshal_or_fallback} to establish a new chapter house in our lands, in exchange for binding service to the Crown. They want land and silver; in return they pledge steel at every summons. The old marshals are jealous. The {class_plural} await the crown\'s reply.',
    choices: {
      grant_the_knightly_order: 'Grant the Chapter House',
      deny_the_grant: 'Deny the Grant',
    },
  },
};
