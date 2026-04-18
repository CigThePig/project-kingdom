// Phase 7 — Wave-2 Crisis Text: Court & Political.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_POLITICAL_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_royal_scandal: {
    title: 'Scandal in the Court',
    body: 'A rumour has broken loose in the capital: a matter of the royal household that ought never to have left the chamber. The ballads have already been written; the bishops are drafting stern homilies. Silence will not serve.',
    choices: {
      deny_and_punish_the_gossips: 'Deny and Punish the Gossips',
      admit_and_seek_penance: 'Admit and Seek Penance',
      distract_with_festivities: 'Distract with Festivities',
    },
  },
  evt_exp_w2_royal_illness: {
    title: 'The Royal Person Falls Ill',
    body: 'A fever has taken the royal person, and the physicians disagree on the cause. The court grows restive; messengers ride between the great houses; succession whispers begin at the fringes. Every decision now must be made under the shadow of the sickbed.',
    choices: {
      summon_foreign_physicians: 'Summon Foreign Physicians',
      trust_the_cathedral_healers: 'Trust the Cathedral Healers',
      govern_through_the_sickness: 'Govern Through the Sickness',
    },
  },
  evt_exp_w2_dynastic_challenge: {
    title: 'A Pretender Raises a Banner',
    body: 'A distant cousin, long thought safely landless abroad, has appeared in the marches with a modest retinue and a claim to the throne. The claim is thin in law but thick in sympathy among the border lords. Left unanswered it will only grow.',
    choices: {
      crush_the_pretender: 'Crush the Pretender',
      marry_into_their_line: 'Marry into Their Line',
      exile_with_a_pension: 'Exile with a Pension',
    },
  },
  evt_exp_w2_foreign_assassination: {
    title: 'A Foreign Prince Is Slain',
    body: 'A neighbouring prince has been killed — by a knife, in his own hall, by hands not yet named. The court of that realm demands public mourning or public answers. Your own spymaster is studiously looking elsewhere.',
    choices: {
      condemn_publicly_and_mourn: 'Condemn Publicly and Mourn',
      offer_the_network_quietly: 'Offer Our Network Quietly',
      deny_all_involvement: 'Deny All Involvement',
    },
  },
  evt_exp_w2_bandit_lord_uprising: {
    title: 'A Bandit Lord Raises the Country',
    body: 'In the hill country a hedge-knight has gathered a small army from discontented tenants and deserters. He styles himself a champion of the commons and is said to have taken three manor houses already. The march captains await orders.',
    choices: {
      send_a_punitive_column: 'Send a Punitive Column',
      offer_the_lord_a_title: 'Offer Him a Title',
      pay_his_silence: 'Pay His Silence',
    },
  },
};
