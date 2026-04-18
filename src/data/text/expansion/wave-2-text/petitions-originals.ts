// Phase 7 — Wave-2 Petition Text: Originals.
//
// Display text for the two petitions shipped in the Phase 7 stub PR.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_PETITIONS_ORIGINAL_TEXT: Record<string, EventTextEntry> = {
  faction_req_w2_military_pensions: {
    title: 'The Veterans Petition for Pensions',
    body: 'A delegation of greying captains and maimed men-at-arms presents a formal petition: the royal host has been called to the field so often that promises of honour-land cannot be met. They request a fund for pensions — or they will seek service with others who can pay.',
    choices: {
      fund_veterans_pensions: 'Fund Veterans\' Pensions',
      defer_pensions_decision: 'Defer the Decision',
    },
  },
  faction_req_w2_clergy_reform_synod: {
    title: 'The Bishops Beg a Reform Synod',
    body: 'A delegation of the primate\'s household asks leave to convene a reform synod. The usual heterodoxies are unusually loud in the provinces, and the bishops believe a synod can still catch them. They ask royal coin and royal backing.',
    choices: {
      convene_reform_synod: 'Convene the Reform Synod',
      reject_synod_request: 'Reject the Request',
    },
  },
};
