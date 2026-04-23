import type { EventTextEntry } from '../events';

export const EXPANSION_RELIGION_TEXT: Record<string, EventTextEntry> = {
  // --- 1. Miracle Claims ---
  evt_exp_rel_miracle_claims: {
    title: 'Reports of a Miracle',
    body: 'Pilgrims and clergy of the {faith_tradition} alike speak of a miraculous occurrence at a village shrine in {region} this {season} — water turned to wine, or perhaps a withered tree blooming in winter. The faithful flock to witness the site, while skeptics warn that unverified claims may breed dangerous credulity.',
    choices: {
      endorse_miracle: 'Endorse the Miracle',
      order_investigation: 'Order a Formal Investigation',
      remain_silent: 'Remain Silent on the Matter',
    },
  },

  // --- 2. Heretical Texts Discovered ---
  evt_exp_rel_heretical_texts: {
    title: 'Heretical Writings Uncovered',
    body: 'A cache of forbidden theological texts has been discovered circulating among scholars and certain members of the clergy. The writings challenge core doctrines of the {faith_tradition}, proposing interpretations that the orthodox hierarchy condemns as dangerous heresy.',
    choices: {
      public_burning: 'Order a Public Burning',
      scholarly_review: 'Commission a Scholarly Review',
      suppress_quietly: 'Suppress the Texts Quietly',
    },
  },

  // --- 3. Religious Order Expansion ---
  evt_exp_rel_order_expansion: {
    title: 'A Religious Order Seeks to Grow',
    body: 'The leaders of a prominent order of the {faith_tradition} have petitioned the crown for permission to establish new chapters throughout the provinces. Their monasteries bring learning and charity, but also considerable influence that does not always align with royal interests.',
    choices: {
      grant_charter: 'Grant an Expansion Charter',
      limit_expansion: 'Limit Their Expansion',
      demand_crown_oversight: 'Demand Crown Oversight',
    },
  },

  // --- 4. Temple Construction Demands ---
  evt_exp_rel_temple_construction: {
    title: 'The Clergy Demand a New Temple',
    body: 'The high clergy of the {faith_tradition} have formally requested that the crown fund the construction of a grand temple to demonstrate the kingdom\'s devotion. They argue that the current places of worship are insufficient for the faithful, and that piety demands visible commitment — though with the treasury in {treasury_tier} condition, {chancellor_or_fallback} urges measured ambition.',
    choices: {
      fund_grand_temple: 'Fund a Grand Temple',
      modest_chapel: 'Build a Modest Chapel',
      decline_construction: 'Decline the Request',
    },
  },

  // --- 5. Interfaith Dialogue ---
  evt_exp_rel_interfaith_dialogue: {
    title: 'Proposal for Interfaith Dialogue',
    body: 'Scholars from across the border have proposed a formal dialogue between the {faith_tradition} and the faith practiced on the other side. Some clergy see an opportunity for understanding and influence, while others view it as an invitation to heresy and foreign corruption.',
    choices: {
      host_dialogue: 'Host the Dialogue at Court',
      permit_cautiously: 'Permit with Caution',
      forbid_dialogue: 'Forbid All Such Dialogue',
    },
  },

  // --- 6. Pilgrimage Season ---
  evt_exp_rel_pilgrimage_season: {
    title: 'The Season of Pilgrimage',
    body: 'With the arrival of {season}, the faithful of the {faith_tradition} take to the roads in great numbers, journeying to holy sites throughout the kingdom. The pilgrims bring coin and devotion, but also strain upon the roads and the communities along their path.',
    choices: {
      provide_escorts: 'Provide Royal Escorts',
      tax_pilgrims: 'Tax the Pilgrim Routes',
      permit_freely: 'Permit Pilgrimage Freely',
    },
  },

  // --- 7. Divine Portent Interpretation ---
  evt_exp_rel_divine_portent: {
    title: 'A Portent in the Heavens',
    body: 'An unusual celestial event — a comet, an eclipse, or an alignment of stars — has seized the attention of clergy and commoners alike. The faithful demand interpretation, and competing voices within the temple offer starkly different readings of its meaning for the crown and its people.',
    choices: {
      declare_divine_favor: 'Declare It a Sign of Divine Favor',
      call_for_penance: 'Call for a Season of Penance',
      dismiss_superstition: 'Dismiss It as Superstition',
    },
  },

  // --- 8. Clerical Corruption ---
  evt_exp_rel_clerical_corruption: {
    title: 'Corruption Within the Clergy',
    body: 'Common folk bring accusations of clerical misconduct before the crown. Certain priests of the {faith_tradition} are said to sell blessings, hoard tithes for personal enrichment, and live in luxury while their congregations suffer. The faithful grow disillusioned, and the pious grow angry.',
    choices: {
      royal_inquisition: 'Launch a Royal Inquisition',
      internal_reform: 'Demand Internal Reform',
      look_the_other_way: 'Look the Other Way',
    },
  },

  // --- 9. Religious Holiday Observance ---
  evt_exp_rel_holiday_observance: {
    title: 'The Great Winter Observance',
    body: 'The principal holiday of the {faith_tradition} approaches with the deep of {season}. The clergy petition for crown sponsorship of the sacred rites, arguing that visible royal piety strengthens the tie between throne and altar. Others suggest a treasury in {treasury_tier} condition can ill afford elaborate ceremony.',
    choices: {
      crown_sponsored_rites: 'Sponsor the Sacred Rites',
      permit_observance: 'Permit Simple Observance',
      curtail_festivities: 'Curtail Festivities This Year',
    },
  },

  // --- 10. Monastery Funding ---
  evt_exp_rel_monastery_funding: {
    title: 'A Monastery Seeks the Crown\'s Aid',
    body: 'The abbot of an ancient and respected monastery of the {faith_tradition} has appealed to the crown for financial support. The monastery\'s scriptorium preserves invaluable texts, and its monks provide charity to the surrounding province, yet its coffers have run dry and its stonework erodes — much like a treasury now in {treasury_tier} condition.',
    choices: {
      generous_endowment: 'Grant a Generous Endowment',
      conditional_funding: 'Provide Conditional Funding',
      deny_funding: 'Deny the Request',
    },
  },

  // --- 11. Sacred Site Desecration ---
  evt_exp_rel_sacred_desecration: {
    title: 'Desecration of a Sacred Site',
    body: 'A holy site of the {faith_tradition}, of great significance to our people, has been desecrated — its altars defaced, its relics scattered, its sanctity violated. The clergy cry for vengeance, the faithful weep with outrage, and the perpetrators remain unknown. The kingdom\'s response will echo through generations of worship.',
    choices: {
      hunt_perpetrators: 'Hunt Down the Perpetrators',
      consecrate_and_restore: 'Consecrate and Restore the Site',
      call_for_reconciliation: 'Call for Reconciliation',
    },
  },

  // --- 12. Faith Healing Movement ---
  evt_exp_rel_faith_healing: {
    title: 'Rise of the Faith Healers',
    body: 'A movement of lay healers claiming divine inspiration has spread through the towns and villages. The common folk turn to them for cures when physicians are scarce, and some report genuine recoveries. The established clergy view these unlicensed practitioners with suspicion.',
    choices: {
      support_movement: 'Support the Movement',
      regulate_practices: 'Regulate Their Practices',
      ban_practitioners: 'Ban the Practitioners',
    },
  },

  // --- 13. Religious Education Reform ---
  evt_exp_rel_education_reform: {
    title: 'Reform of Religious Education',
    body: 'A debate has arisen within the clergy over the future of the kingdom\'s religious schools. Progressive voices argue for broadening the curriculum to include natural philosophy and practical arts, while traditionalists insist that sacred instruction must remain paramount.',
    choices: {
      expand_religious_schools: 'Expand Religious Schools',
      secular_curriculum: 'Introduce a Secular Curriculum',
      maintain_status_quo: 'Maintain the Status Quo',
    },
  },

  // --- 14. Court Chaplain's Blessing ---
  evt_exp_rel_chaplain_blessing: {
    title: 'The Court Chaplain\'s Blessing',
    body: 'The High Chaplain of the {faith_tradition} requests an audience to offer the traditional blessing upon a new reign. Beyond the ceremony, he gently inquires about Your Majesty\'s intentions regarding the faith. Will the crown be seen at morning prayers? Will tithes flow generously? The clergy watch this new sovereign with keen interest, measuring piety against pragmatism.',
    choices: {
      public_devotion: 'Demonstrate Public Devotion',
      private_piety: 'Maintain Private Piety',
      emphasize_secular_duties: 'Emphasize Secular Duties',
    },
  },
};
