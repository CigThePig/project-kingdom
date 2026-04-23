import type { EventTextEntry } from '../events';

export const EXPANSION_KNOWLEDGE_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Scholar Dispute at the Royal Academy (Notable, developing)
  // ============================================================
  evt_exp_kno_scholar_dispute: {
    title: 'Scholar Dispute at the Royal Academy',
    body: 'Two opposing factions within the Royal Academy have brought their quarrel before the throne. The traditionalists insist that ancient texts hold all wisdom worth pursuing, while a younger cohort of reformers advocates for empirical methods that challenge established doctrine. Both sides demand the Crown\'s endorsement.',
    choices: {
      side_with_traditionalists: 'Uphold Tradition',
      side_with_reformers: 'Champion the Reformers',
      let_them_settle_it: 'Let Them Resolve It',
    },
  },

  // ============================================================
  // 2. Foreign Manuscript Arrives (Informational, opening)
  // ============================================================
  evt_exp_kno_foreign_manuscript: {
    title: 'Foreign Manuscript Arrives',
    body: 'A merchant caravan has delivered a collection of manuscripts from a distant eastern court, written in a script none of our scholars can decipher. The texts appear to contain diagrams of mechanical devices and astronomical charts of remarkable sophistication.',
    choices: {
      commission_translation: 'Commission a Translation',
      archive_untranslated: 'Archive for Later Study',
    },
  },

  // ============================================================
  // 3. Alchemist's Volatile Discovery (Serious, established)
  // ============================================================
  evt_exp_kno_alchemist_discovery: {
    title: 'The Alchemist\'s Volatile Discovery',
    body: 'A court alchemist has produced a compound of terrible potency — a black powder that detonates with devastating force. The military sees an instrument of war; civilian engineers envision quarrying and mining applications. The clergy warns of tampering with forces best left undisturbed.',
    choices: {
      fund_military_application: 'Develop for Military Use',
      restrict_to_civilian_use: 'Restrict to Civilian Uses',
      suppress_findings: 'Suppress the Discovery',
    },
  },

  // ============================================================
  // 4. Library Fire Threatens Archives (Critical, established)
  // ============================================================
  evt_exp_kno_library_fire: {
    title: 'Fire Engulfs the Royal Archives',
    body: 'Flames have broken out in the kingdom\'s great library, threatening centuries of accumulated knowledge. The fire spreads with alarming speed through the dry summer air, and the archivists plead for immediate action. Much of what burns can never be recovered.',
    choices: {
      emergency_salvage_operation: 'Mount Full Salvage Effort',
      protect_rarest_volumes: 'Save Only the Rarest Works',
      let_it_burn: 'Accept the Loss',
    },
  },

  // ============================================================
  // 5. Student Uprising at the Academy (Serious, developing)
  // ============================================================
  evt_exp_kno_student_uprising: {
    title: 'Student Uprising at the Academy',
    body: 'Students at the kingdom\'s foremost academy have barricaded themselves within the lecture halls, demanding reduced tuition fees and the dismissal of several harsh masters. The unrest threatens to spill into the surrounding quarter, and the nobility view the disruption with open contempt.',
    choices: {
      negotiate_with_students: 'Negotiate Concessions',
      disperse_by_force: 'Send in the Guard',
      close_academy_temporarily: 'Shut the Academy Down',
    },
  },

  // ============================================================
  // 6. Clergy Demand Knowledge Censorship (Serious, established)
  // ============================================================
  evt_exp_kno_censorship_demand: {
    title: 'The Clergy Demand Censorship',
    body: 'The senior clergy have presented a formal petition demanding that certain philosophical and natural-science texts be removed from circulation. They argue that heterodox ideas undermine the faith and erode public morality. Scholars and merchants alike have voiced alarm at the proposed restrictions.',
    choices: {
      enforce_censorship: 'Enforce the Censorship',
      protect_free_inquiry: 'Protect Free Inquiry',
      create_review_board: 'Establish a Review Board',
    },
  },

  // ============================================================
  // 7. Engineering Breakthrough — Aqueduct Design (Notable, established)
  // ============================================================
  evt_exp_kno_aqueduct_design: {
    title: 'Aqueduct Engineering Breakthrough',
    body: 'The kingdom\'s master engineers have completed designs for a system of stone aqueducts capable of channeling fresh water from highland springs to the lowland settlements. The project would dramatically improve sanitation and agricultural yields, but the construction costs are considerable.',
    choices: {
      fund_construction: 'Fund Full Construction',
      limited_trial: 'Build a Trial Section',
      shelve_plans: 'Shelve the Plans',
    },
  },

  // ============================================================
  // 8. Herbalist Discovers Plague Remedy (Serious, any)
  // ============================================================
  evt_exp_kno_plague_remedy: {
    title: 'Herbalist Claims a Plague Remedy',
    body: 'A rural herbalist has arrived at court bearing a tincture she claims can halt the spread of the wasting sickness. Preliminary accounts from her village suggest genuine efficacy, but the clergy dismiss her methods as superstition, and the costs of mass production would strain the treasury.',
    choices: {
      mass_produce_remedy: 'Produce the Remedy at Scale',
      test_on_volunteers: 'Conduct Formal Trials',
      dismiss_as_quackery: 'Dismiss the Claim',
    },
  },

  // ============================================================
  // 9. Cartographer Maps New Trade Route (Notable, developing)
  // ============================================================
  evt_exp_kno_cartographer_route: {
    title: 'Cartographer Maps New Trade Route',
    body: 'The Crown\'s chief cartographer has identified a previously uncharted passage through the northern mountains that could open a direct trade route to wealthy markets beyond. Merchants are eager for the opportunity, but sharing such maps could compromise strategic intelligence.',
    choices: {
      fund_expedition: 'Fund an Expedition',
      sell_maps_to_merchants: 'Sell Maps to the Guilds',
      keep_maps_secret: 'Classify the Maps',
    },
  },

  // ============================================================
  // 10. Mathematical Treatise Challenges Tax System (Notable, established)
  // ============================================================
  evt_exp_kno_math_treatise: {
    title: 'Mathematical Treatise on Taxation',
    body: 'A mathematician at the academy has published a treatise demonstrating that the kingdom\'s fiscal calculations contain systematic errors that have long favored the nobility at the expense of the common purse. The work is rigorous, but adopting its conclusions would antagonize powerful lords.',
    choices: {
      adopt_new_methods: 'Reform the Tax Calculations',
      commission_rebuttal: 'Commission a Counter-Treatise',
      ignore_treatise: 'Set the Matter Aside',
    },
  },

  // ============================================================
  // 11. Printing Press Prototype (Critical, established)
  // ============================================================
  evt_exp_kno_printing_press: {
    title: 'The Printing Press Prototype',
    body: 'A brilliant artificer has constructed a device capable of pressing inked type onto parchment with extraordinary speed, producing identical copies of any text in hours rather than months. The implications are profound — knowledge could spread beyond the control of scribe and clergy alike, reshaping the balance of power in the realm.',
    choices: {
      fund_mass_production: 'Fund Public Production',
      restrict_to_crown: 'Restrict to Crown Use',
      ban_device: 'Suppress the Invention',
    },
  },

  // ============================================================
  // 12. Rival Kingdom Hoards Knowledge (Serious, any)
  // ============================================================
  evt_exp_kno_rival_hoards: {
    title: 'Valdris Hoards Scholarly Texts',
    body: 'Intelligence reports confirm that the Kingdom of Valdris has been systematically acquiring rare manuscripts and recruiting foreign scholars, denying their knowledge to neighboring realms. Our own academies feel the loss keenly, and advisors debate whether to respond with diplomacy, espionage, or self-reliance.',
    choices: {
      send_spies_to_copy: 'Dispatch Spies to Copy Texts',
      propose_knowledge_exchange: 'Propose a Scholarly Exchange',
      develop_independently: 'Invest in Our Own Scholars',
    },
  },

  // ============================================================
  // 13. Astronomical Observatory Proposal (Informational, developing)
  // ============================================================
  evt_exp_kno_observatory_proposal: {
    title: 'Observatory Construction Proposed',
    body: 'The court astronomer has petitioned for funds to raise a proper observatory upon the kingdom\'s highest hill. She argues that careful study of celestial movements will improve navigation, agricultural timing, and the accuracy of the royal calendar. The cost is modest but the clergy eye the project with suspicion.',
    choices: {
      approve_funding: 'Approve the Funding',
      defer_to_next_season: 'Defer the Decision',
    },
  },

  // ============================================================
  // 14. Merchant Guild Demands Navigation Charts (Notable, any)
  // ============================================================
  evt_exp_kno_navigation_charts: {
    title: 'Merchants Demand Navigation Charts',
    body: 'The merchant guild has formally requested access to the Crown\'s coastal and river navigation charts, arguing that better maps would increase trade revenue and reduce shipwreck losses. However, military advisors caution that these charts reveal strategic waterway positions that foreign courts could exploit.',
    choices: {
      share_crown_charts: 'Share Existing Charts',
      commission_new_surveys: 'Commission New Surveys',
      deny_request: 'Deny the Request',
    },
  },

  // ============================================================
  // 15. Wandering Philosopher Seeks Patronage (Informational, opening)
  // ============================================================
  evt_exp_kno_wandering_philosopher: {
    title: 'A Wandering Philosopher Arrives',
    body: 'A philosopher of some renown has arrived at the capital after years of travel through distant lands. He seeks royal patronage in exchange for lectures on natural philosophy and governance. His ideas are unconventional but his reputation precedes him.',
    choices: {
      grant_patronage: 'Grant Patronage',
      politely_decline: 'Decline Graciously',
    },
  },

  // ============================================================
  // 16. Competing Factions Vie for Ancient Codex (Informational, any)
  // ============================================================
  evt_exp_kno_ancient_codex: {
    title: 'Factions Vie for an Ancient Codex',
    body: 'A crumbling codex of extraordinary antiquity has been unearthed during foundation work near the cathedral. Both the clergy and the nobility claim rightful custody — the clergy on grounds of sacred provenance, the nobility citing the land deed. The court awaits the Crown\'s judgment on its disposition.',
    choices: {
      award_to_clergy: 'Award to the Clergy',
      award_to_nobility: 'Award to the Nobility',
      place_in_public_archive: 'Place in the Public Archive',
    },
  },
};
