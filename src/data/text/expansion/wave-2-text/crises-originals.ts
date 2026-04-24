// Phase 7 — Wave-2 Crisis Text: Originals.
//
// Display text for the two crises shipped in the Phase 7 stub PR. Required
// because the earlier PR populated `EXPANSION_WAVE_2_CRISES` without adding
// matching `EVENT_TEXT` entries, leaving the generator to fall back to a
// `'CRISIS'` placeholder at `src/bridge/crisisCardGenerator.ts`.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_ORIGINAL_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_comet_sighting: {
    title: 'A Great Comet Burns the Sky',
    body: 'For a full week a great burning star has hung over the capital at dusk. The bishops whisper of omens; the commonfolk crowd the cathedral steps; the astronomers debate in quiet rooms. Every observer asks the same question: is this a sign of favour, or of judgement?',
    choices: {
      declare_omen_of_renewal: 'Declare an Omen of Renewal',
      order_ritual_purification: 'Order Ritual Purification',
      forbid_public_speculation: 'Forbid Public Speculation',
    },
  },
  evt_exp_w2_foreign_refugees: {
    title: 'Refugees at the Border',
    body: 'A column of foreigners — perhaps a thousand souls — has gathered at the frontier, fleeing a burning that was not of your making. They carry little; they speak a different tongue; and they ask leave to cross. The marches are already thin, and the bishops will have opinions. The {class_plural} await the crown\'s reply.',
    choices: {
      admit_and_settle_refugees: 'Admit and Settle',
      turn_them_back_at_the_border: 'Turn Them Back',
      extort_passage_tolls: 'Extort Passage Tolls',
    },
  },
};
