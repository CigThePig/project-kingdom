import type { EventTextEntry } from '../events';

export const EXPANSION_KINGDOM_TEXT: Record<string, EventTextEntry> = {
  // --- 1. Coronation Anniversary ---
  evt_exp_kgd_coronation_anniversary: {
    title: 'The Coronation Anniversary',
    body: 'The anniversary of Your Majesty\'s coronation approaches, and the court awaits your pleasure regarding its observance. The commons anticipate revelry, while the treasury steward reminds you that celebration carries a cost measured in gold as surely as in goodwill.',
    choices: {
      lavish_celebration: 'Host a Lavish Celebration',
      solemn_ceremony: 'Hold a Solemn Ceremony',
      forgo_festivities: 'Forgo Festivities This Year',
    },
  },

  // --- 2. Succession Question ---
  evt_exp_kgd_succession_question: {
    title: 'Whispers of Succession',
    body: 'Certain great lords have raised the matter of succession with unseemly urgency. Their concern, though perhaps premature, is not without foundation — an unresolved line invites ambition. The manner in which you address this question shall echo through every noble hall. The {class_plural} await the crown\'s reply.',
    choices: {
      name_heir_publicly: 'Name an Heir Publicly',
      establish_council_regency: 'Establish a Council of Regency',
      dismiss_concerns: 'Dismiss These Concerns',
    },
  },

  // --- 3. Royal Court Intrigue ---
  evt_exp_kgd_court_intrigue: {
    title: 'Intrigue at Court',
    body: 'Your spymaster reports that opposing factions within the court have grown bold in their maneuvering. Whispered alliances form and dissolve in the corridors of power, and certain nobles are observed meeting in unusual combinations. The throne\'s authority may be quietly eroding.',
    choices: {
      investigate_factions: 'Launch a Formal Investigation',
      play_factions_against: 'Play Factions Against Each Other',
      ignore_rumors: 'Ignore the Rumors',
    },
  },

  // --- 4. Crown Treasury Audit ---
  evt_exp_kgd_treasury_audit: {
    title: 'The Crown\'s Accounts',
    body: 'The royal exchequer has discovered troubling discrepancies in the kingdom\'s ledgers. Expenditures exceed recorded allocations by a considerable margin, and several offices show patterns consistent with misappropriation. The crown\'s finances demand scrutiny.',
    choices: {
      full_public_audit: 'Order a Full Public Audit',
      quiet_internal_review: 'Conduct a Quiet Internal Review',
      tighten_spending: 'Tighten All Spending Immediately',
    },
  },

  // --- 5. National Celebration Demand ---
  evt_exp_kgd_national_celebration: {
    title: 'Demand for National Celebration',
    body: 'With summer upon our lands and the population grown prosperous, voices rise from every quarter calling for a great national celebration. The commons desire feasting and merriment, though your stewards note that such gatherings are costly endeavors. The {class_plural} await the crown\'s reply.',
    choices: {
      grand_royal_festival: 'Proclaim a Grand Royal Festival',
      modest_observance: 'Permit a Modest Observance',
      redirect_funds_to_needy: 'Redirect Funds to the Needy',
    },
  },

  // --- 6. Governance Reform Proposal ---
  evt_exp_kgd_governance_reform: {
    title: 'Calls for Governance Reform',
    body: 'A coalition of merchants, lesser nobles, and educated commoners has presented a formal petition demanding reforms to the kingdom\'s governance. They seek greater representation in royal councils and limits upon arbitrary decree. The old guard views this as an affront to tradition.',
    choices: {
      accept_reforms: 'Accept the Reforms in Full',
      partial_concessions: 'Offer Partial Concessions',
      reject_reforms: 'Reject the Petition',
    },
  },

  // --- 7. Constitutional Crisis ---
  evt_exp_kgd_constitutional_crisis: {
    title: 'A Crisis of Authority',
    body: 'The kingdom stands upon a precipice. Multiple factions claim legitimacy for their competing visions of governance, and the streets grow restless with uncertainty. Without decisive action, the very foundations of royal authority may fracture beyond repair. Word comes most urgently from {region}.',
    choices: {
      convene_emergency_council: 'Convene an Emergency Grand Council',
      assert_royal_authority: 'Assert Royal Authority by Force',
      offer_charter_of_rights: 'Offer a Royal Charter of Rights',
    },
  },

  // --- 8. Power Consolidation ---
  evt_exp_kgd_power_consolidation: {
    title: 'An Opportunity to Consolidate',
    body: 'Our lands enjoy a season of unusual stability, and the military stands firmly behind the crown. Your advisors suggest this may be an opportune moment to reshape the balance of power — though they disagree sharply on which direction the scales should tip. The {class_plural} are watching every move of the court.',
    choices: {
      centralize_authority: 'Centralize Authority Under the Crown',
      delegate_to_governors: 'Delegate Power to Provincial Governors',
      maintain_balance: 'Maintain the Current Balance',
    },
  },

  // --- 9. Royal Decree Dispute ---
  evt_exp_kgd_decree_dispute: {
    title: 'Challenge to the Royal Decree',
    body: 'A recent decree of the crown has met with organized resistance among the nobility. Several prominent lords refuse to implement its provisions within their domains, citing ancient privileges and precedent. The challenge cannot go unanswered without setting a dangerous example.',
    choices: {
      enforce_decree: 'Enforce the Decree Without Exception',
      amend_decree: 'Amend the Decree\'s Provisions',
      rescind_decree: 'Rescind the Decree Entirely',
    },
  },

  // --- 10. National Identity Debate ---
  evt_exp_kgd_national_identity: {
    title: 'Questions of National Identity',
    body: 'Relations with neighboring realms have strained the kingdom\'s sense of itself. Scholars and commoners alike debate what it means to belong to this realm, and whether accommodation or distinction should define the kingdom\'s character going forward.',
    choices: {
      promote_cultural_pride: 'Promote Cultural Pride',
      emphasize_unity: 'Emphasize Internal Unity',
      let_discourse_continue: 'Let the Discourse Continue',
    },
  },

  // --- 11. Corruption Investigation ---
  evt_exp_kgd_corruption_investigation: {
    title: 'Corruption in the Realm',
    body: 'Evidence has surfaced implicating several high-ranking officials in a web of bribery, embezzlement, and abuse of office. The rot appears to reach into the highest circles of administration. How the crown responds will define its commitment to justice — or its tolerance for convenience. The {class_plural} are watching every move of the court.',
    choices: {
      public_tribunal: 'Convene a Public Tribunal',
      private_purge: 'Conduct a Private Purge',
      offer_amnesty: 'Offer Amnesty for Cooperation',
    },
  },

  // --- 12. Administrative Overhaul ---
  evt_exp_kgd_admin_overhaul: {
    title: 'Proposal for Administrative Reform',
    body: 'The kingdom\'s growing population strains the existing machinery of governance. Tax collection falters, disputes languish unresolved, and provincial administrators plead for additional resources. A thorough overhaul could restore efficiency, though the cost and disruption give pause.',
    choices: {
      comprehensive_restructuring: 'Undertake Comprehensive Restructuring',
      incremental_improvements: 'Implement Incremental Improvements',
      preserve_traditions: 'Preserve Traditional Methods',
    },
  },

  // --- 13. Crown Land Management ---
  evt_exp_kgd_crown_land: {
    title: 'The Question of Crown Lands',
    body: 'With food stores dwindling as spring arrives, attention turns to the vast tracts of royal demesne that lie fallow. The commons petition to work these lands, while the nobility see opportunity for profitable leases. The crown must decide the fate of its own domain. The {class_plural} await the crown\'s reply.',
    choices: {
      open_crown_lands: 'Open Crown Lands to the Commons',
      lease_to_nobility: 'Lease Lands to the Nobility',
      preserve_royal_domain: 'Preserve the Royal Domain',
    },
  },

  // --- 14. Royal Legacy ---
  evt_exp_kgd_royal_legacy: {
    title: 'A Question of Legacy',
    body: 'With our lands secure and your reign well established, courtiers turn their thoughts to posterity. They propose that some lasting work be undertaken to ensure your name endures in the memory of the kingdom. The treasury can bear it, but every coin spent on legacy is one not spent on governance.',
    choices: {
      commission_monument: 'Commission a Grand Monument',
      endow_scholarly_archive: 'Endow a Scholarly Archive',
      let_deeds_speak: 'Let Deeds Speak for Themselves',
    },
  },

  // --- 15. Royal Steward's Ledger ---
  evt_exp_kgd_steward_ledger: {
    title: 'The Royal Steward\'s Ledger',
    body: 'The royal steward kneels before you with the kingdom\'s accounts spread across a broad oak table. Five hundred gold marks sit in the treasury, the granaries hold a season\'s worth of grain, and the tax rolls are due for review. He asks how Your Majesty would like the crown\'s coin directed in this early season of your reign.',
    choices: {
      prioritize_public_welfare: 'Direct Funds to Public Welfare',
      invest_in_royal_authority: 'Invest in Royal Authority',
      maintain_current_allocations: 'Keep Current Allocations',
    },
  },
};
