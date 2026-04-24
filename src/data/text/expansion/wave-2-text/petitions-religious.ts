// Phase 7 — Wave-2 Petition Text: Religious Orders.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_PETITIONS_RELIGIOUS_TEXT: Record<string, EventTextEntry> = {
  faction_req_w2_mendicant_order_charter: {
    title: 'A Mendicant Order Begs a Charter',
    body: '{chamberlain_or_fallback} brings before the throne a travelling preacher who has founded a small mendicant order and asks royal leave to expand. The bishops are wary of any brotherhood outside their chain of command; the commons already press alms into their hands. The {class_plural} await the crown\'s reply.',
    choices: {
      charter_the_mendicants: 'Charter the Mendicants',
      refer_to_the_bishop: 'Refer to the Bishop',
    },
  },
  faction_req_w2_militant_brotherhood: {
    title: 'A Militant Brotherhood Requests Funding',
    body: 'A militant brotherhood of knight-monks petitions {chamberlain_or_fallback} for royal funding to pursue heretics in the hinterland. They promise swift action; their detractors warn of massacres charged to the Crown. The {class_plural} await the crown\'s reply.',
    choices: {
      fund_the_brotherhood: 'Fund the Brotherhood',
      decline_militant_funding: 'Decline Funding',
    },
  },
  faction_req_w2_pilgrim_road_petition: {
    title: 'The Pilgrim Road Awaits Consecration',
    body: 'The abbots of the southern houses propose a new pilgrim road linking three great shrines. The route would need royal protection and a modest grant; in return, they promise a flow of foreign coin and piety. The {class_plural} await the crown\'s reply.',
    choices: {
      found_the_pilgrim_road: 'Found the Pilgrim Road',
      reject_pilgrim_road: 'Reject the Proposal',
    },
  },
  faction_req_w2_abbey_tax_exemption: {
    title: 'The Great Abbey Begs Exemption',
    body: 'The abbot of the old royal abbey asks a full exemption from the hearth tax, pleading ancient charters and present poverty. The exchequer calls the poverty overstated; the nobility calls the exemption unearned. The {class_plural} await the crown\'s reply.',
    choices: {
      grant_the_exemption: 'Grant the Exemption',
      refuse_the_exemption: 'Refuse the Exemption',
    },
  },
};
