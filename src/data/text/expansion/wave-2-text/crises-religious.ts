// Phase 7 — Wave-2 Crisis Text: Religious Flashpoints.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_RELIGIOUS_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_religious_schism: {
    title: 'The Church Splits in Two',
    body: 'Bishops of the northern sees have declared themselves no longer in communion with the primate, citing unreformed abuses. A dozen churches have changed the wording of the liturgy; a dozen more still wait to see which way the Crown falls.',
    choices: {
      back_the_orthodox_hierarchy: 'Back the Orthodox Hierarchy',
      recognize_both_confessions: 'Recognize Both Confessions',
      call_a_reconciliation_council: 'Call a Reconciliation Council',
    },
  },
  evt_exp_w2_heretical_sermon: {
    title: 'A Heretical Preacher in the Square',
    body: 'A young preacher is drawing larger and larger crowds at the cathedral square with sermons the primate calls outright heresy. He denies no doctrine out loud — he merely asks questions in public that the faithful used to keep quiet.',
    choices: {
      silence_the_preacher: 'Silence the Preacher',
      debate_him_publicly: 'Debate Him Publicly',
      ignore_the_crowd: 'Ignore the Crowd',
    },
  },
  evt_exp_w2_prophet_appears: {
    title: 'A Prophet at the Gates',
    body: 'A dust-stained figure has arrived at the capital gates, claiming visions of the kingdom\'s fate. The commons whisper of miracles; the bishops demand the matter be examined; the tax-collectors watch the crowds grow each day.',
    choices: {
      invite_to_the_cathedral: 'Invite to the Cathedral',
      confine_to_a_monastery: 'Confine to a Monastery',
      denounce_as_false: 'Denounce as False',
    },
  },
  evt_exp_w2_saints_succession: {
    title: 'The See Awaits a Successor',
    body: 'The old primate is dying, and the conclave has assembled to choose his heir. Each candidate carries a faction: one the Crown\'s creature, one the conclave\'s favourite, one a quiet reformer. The choice will echo for a generation.',
    choices: {
      endorse_the_royal_candidate: 'Endorse the Royal Candidate',
      defer_to_the_conclave: 'Defer to the Conclave',
      pressure_for_a_reformer: 'Pressure for a Reformer',
    },
  },
  evt_exp_w2_witch_trial: {
    title: 'A Witch Trial Demanded',
    body: 'Three women in a border village have been accused of consorting with evil. The local magistrate has called for a formal trial; the commons want a bonfire by tomorrow; the clergy want it handled by diocesan court. You are asked to rule.',
    choices: {
      allow_the_trial: 'Allow the Trial',
      dismiss_the_accusations: 'Dismiss the Accusations',
      reassign_accused_to_pilgrimage: 'Send Them on Pilgrimage',
    },
  },
};
