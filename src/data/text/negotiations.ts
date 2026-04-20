// Workstream A — Task A4: Negotiation Player-Facing Text
// Each negotiation has a title, body, context label, per-term descriptions,
// and a reject label.

export interface NegotiationTextEntry {
  title: string;
  body: string;
  contextLabel: string;
  terms: Record<string, { title: string; description: string }>;
  rejectLabel: string;
}

export const NEGOTIATION_TEXT: Record<string, NegotiationTextEntry> = {
  // ============================================================
  // External Negotiations
  // ============================================================
  neg_trade_deal: {
    title: 'Trade Negotiations with {neighbor}',
    body: 'Envoys of {ruler_full} have arrived from {capital} to negotiate a comprehensive trade agreement. They present several terms for your consideration — each bringing benefits but also entanglements with the merchant houses of {dynasty}.',
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      exclusive_market_access: {
        title: 'Exclusive Market Access',
        description: 'Grant {neighbor} preferred access to our markets. Enriches the treasury but undercuts local merchants who face new foreign competition.',
      },
      bulk_pricing_agreement: {
        title: 'Bulk Pricing Agreement',
        description: 'Negotiate volume discounts on imported goods. Commoners benefit from lower prices, but domestic merchants lose pricing power.',
      },
      port_rights_concession: {
        title: 'Port Rights Concession',
        description: "Allow {neighbor_short}'s ships to dock freely in our harbors. Merchants gain new trade partners, but the military loses control of key coastal access points.",
      },
    },
    rejectLabel: 'Reject the Proposal Entirely',
  },

  neg_treaty_terms: {
    title: 'Treaty Negotiations with {neighbor}',
    body: "{ruler_full} proposes formalizing relations through a binding treaty between our throne and {dynasty}. The terms would deepen cooperation but constrain the kingdom's freedom of action in significant ways.",
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      mutual_defense_clause: {
        title: 'Mutual Defense Clause',
        description: 'Commit to defending {neighbor} if attacked. Strengthens the alliance but obliges military resources when they call for aid, reducing overall readiness.',
      },
      trade_corridor_rights: {
        title: 'Trade Corridor Rights',
        description: 'Establish a protected trade route between kingdoms. Commerce flourishes, though commoners along the route bear the burden of foreign traffic.',
      },
      border_access_agreement: {
        title: 'Border Access Agreement',
        description: 'Permit free movement across borders. Improves diplomatic ties but compromises espionage operations and border defenses.',
      },
    },
    rejectLabel: 'Decline the Treaty',
  },

  neg_peace_terms: {
    title: 'Peace Negotiations',
    body: 'After prolonged conflict, both sides have agreed to negotiate. The terms on the table are steep, but continued warfare may cost more than concessions. Each term demands a sacrifice.',
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      war_reparations: {
        title: 'Pay War Reparations',
        description: 'The treasury bears the cost of reconciliation — a heavy payment to compensate for the damage of war. The people will feel the burden.',
      },
      prisoner_exchange: {
        title: 'Prisoner Exchange',
        description: 'Return captured soldiers to their homeland. Restores military morale and earns goodwill, though some captured officers held intelligence value.',
      },
      territorial_concession: {
        title: 'Territorial Concession',
        description: 'Cede disputed border lands. Ends the territorial conflict but diminishes the kingdom and enrages the nobility who held those estates.',
      },
      trade_normalization: {
        title: 'Normalize Trade Relations',
        description: 'Reopen markets closed by wartime embargo. Merchants welcome the commerce, and the treasury benefits from resumed tariff income.',
      },
    },
    rejectLabel: 'Reject Peace and Continue Fighting',
  },

  neg_alliance_pact: {
    title: 'Alliance Proposal from {neighbor}',
    body: '{ruler_full} proposes a formal military and economic alliance from {capital}. The pact would bind the two kingdoms together against common threats — but each term limits sovereignty in exchange for security with {dynasty}.',
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      military_commitment: {
        title: 'Military Commitment',
        description: 'Pledge standing forces to the alliance. Provides collective security but draws down military readiness and burdens the soldiery with foreign deployments.',
      },
      shared_intelligence: {
        title: 'Shared Intelligence',
        description: 'Exchange espionage networks and intelligence reports. Strengthens both kingdoms\' spy capabilities but requires treasury investment in joint operations.',
      },
      trade_exclusivity: {
        title: 'Trade Exclusivity',
        description: 'Commit to preferential trade with {neighbor}. Enriches the treasury but angers merchants who lose freedom to trade with other kingdoms.',
      },
    },
    rejectLabel: 'Decline the Alliance',
  },

  // ============================================================
  // Internal Negotiations
  // ============================================================
  neg_noble_power_share: {
    title: 'Noble Houses Demand Power Sharing',
    body: 'A coalition of noble houses has arrived at court with a formal set of demands. Their loyalty wavers, and they insist the crown must share governance — or face the consequences of aristocratic displeasure.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      council_seats: {
        title: 'Guarantee Council Seats',
        description: 'Reserve seats on the royal council for noble representatives. Appeases the aristocracy but diminishes commoner voice in governance.',
      },
      tax_authority: {
        title: 'Delegate Tax Authority',
        description: 'Allow noble houses to collect taxes in their domains. Reduces noble grievances but shrinks crown revenue and antagonizes merchant tax collectors.',
      },
      judicial_power: {
        title: 'Grant Judicial Power',
        description: 'Permit nobles to adjudicate local disputes. Nobles gain leverage over commoners, and the clergy loses influence in moral arbitration.',
      },
    },
    rejectLabel: 'Refuse All Demands',
  },

  neg_merchant_guild_charter: {
    title: 'Merchant Guild Seeks Charter Privileges',
    body: 'The leading merchant guild has petitioned the crown for a formal charter granting commercial privileges. Their growing wealth makes them a force to be reckoned with — their terms reflect that confidence.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      monopoly_rights: {
        title: 'Exclusive Monopoly Rights',
        description: 'Grant the guild monopoly over key trade goods. Merchants prosper, but commoners face higher prices and nobles resent commercial dominance.',
      },
      tax_reduction: {
        title: 'Commercial Tax Reduction',
        description: 'Lower the tariff rate on guild commerce. Merchants benefit and commoners see slightly lower prices, but the treasury takes a direct hit.',
      },
      port_access: {
        title: 'Priority Port Access',
        description: 'Give guild ships priority berthing at royal ports. Increases trade efficiency and revenue, but displaces military vessels from key harbors.',
      },
    },
    rejectLabel: 'Deny the Charter',
  },

  neg_clergy_concordat: {
    title: 'Clergy Proposes a Concordat',
    body: 'The senior clergy seeks a formal agreement defining the relationship between crown and faith. Their proposed concordat would strengthen religious authority — each term extending the church\'s reach into areas traditionally governed by the crown.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      education_authority: {
        title: 'Religious Education Authority',
        description: 'Grant the clergy control over education in the realm. Strengthens cultural cohesion and reduces heresy, but commoners lose access to secular learning.',
      },
      tithe_enforcement: {
        title: 'Crown-Backed Tithe Enforcement',
        description: 'Use royal authority to enforce religious tithes. Strengthens the faith but burdens commoners and merchants with mandatory religious payments.',
      },
      heresy_courts: {
        title: 'Establish Heresy Courts',
        description: 'Authorize church-run courts to try heresy cases. Dramatically reduces heterodoxy but creates a climate of fear that unsettles commoners and destabilizes trust.',
      },
    },
    rejectLabel: 'Reject the Concordat',
  },

  neg_military_reform: {
    title: 'Military Proposes Structural Reforms',
    body: 'The officer corps presents a comprehensive reform proposal aimed at modernizing the military. Each reform addresses a genuine weakness — but every change has political costs beyond the barracks.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      merit_promotion: {
        title: 'Merit-Based Promotion',
        description: 'Promote officers based on ability rather than birth. Delights the military caste but infuriates the nobility, who lose a traditional path to power.',
      },
      veteran_benefits: {
        title: 'Veteran Benefits Program',
        description: 'Establish pensions and land grants for retired soldiers. Boosts morale and loyalty, but the treasury must fund an ongoing obligation.',
      },
      equipment_budget: {
        title: 'Dedicated Equipment Budget',
        description: 'Allocate a permanent portion of the treasury to arms and armor procurement. Improves readiness and equipment, but locks treasury funds away from other needs.',
      },
    },
    rejectLabel: 'Reject the Reforms',
  },

  // ============================================================
  // Expansion — 4 additional negotiations
  // ============================================================
  neg_commoner_charter: {
    title: 'Commoners Demand a Charter of Rights',
    body: 'A delegation of commoner representatives — guild workers, field laborers, and market traders — has gathered at the palace gates with a formal charter of demands. Their numbers are large enough that dismissal risks unrest, but each concession shifts power away from the crown and the upper classes.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      fair_wage_guarantee: {
        title: 'Fair Wage Guarantee',
        description: 'Mandate minimum wages for laborers and apprentices. Commoners gain economic security, but merchants bear the cost of higher labor expenses and the treasury funds enforcement.',
      },
      land_tenure_rights: {
        title: 'Land Tenure Rights',
        description: 'Grant commoners legal protection against eviction from their plots. Stabilizes rural life and encourages development, but directly undermines noble landholding prerogatives.',
      },
      public_assembly_rights: {
        title: 'Right of Public Assembly',
        description: 'Permit commoners to gather and petition without prior approval. Strengthens cultural expression but reduces the crown\'s ability to control dissent, and the clergy fears rival gathering places.',
      },
    },
    rejectLabel: 'Refuse the Charter',
  },

  neg_scholarly_patronage: {
    title: 'Scholars Petition for Royal Patronage',
    body: 'A consortium of scholars, philosophers, and natural historians seeks formal royal patronage to establish a center of learning. Their proposals would advance knowledge and culture — but each term carries entanglements with religious authority, foreign influence, or noble sensibility.',
    contextLabel: 'INTERNAL NEGOTIATION',
    terms: {
      university_funding: {
        title: 'University Endowment',
        description: 'Fund a permanent institution of higher learning. Advances cultural cohesion and knowledge, but the treasury bears a heavy cost and the clergy resents a rival center of authority.',
      },
      secular_curriculum: {
        title: 'Secular Curriculum',
        description: 'Allow the university to teach subjects outside religious doctrine. Commoners welcome broader education, but the curriculum increases heterodox thinking and deeply offends the clergy.',
      },
      foreign_scholars: {
        title: 'Invite Foreign Scholars',
        description: 'Welcome learned foreigners to teach and research. Improves diplomatic ties and enriches culture, but foreign scholars may carry espionage risk and the nobility distrusts outside influence.',
      },
    },
    rejectLabel: 'Decline Patronage',
  },

  neg_resource_blockade: {
    title: 'Blockade Negotiations with {neighbor}',
    body: "{ruler_full} has imposed a resource blockade on the kingdom, choking vital supply lines. Envoys from {capital} arrive with a list of demands — each term extracts a painful concession, but continued blockade may cost more than compliance. The kingdom's supplies dwindle with each passing day.",
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      payment_tribute: {
        title: 'Pay Tribute',
        description: 'Transfer a substantial sum to {neighbor} as a gesture of compliance. Eases the blockade but drains the treasury and demoralizes the common people who bear the tax burden.',
      },
      trade_concessions: {
        title: 'Grant Trade Concessions',
        description: 'Offer {neighbor} favorable trading terms that undercut domestic merchants. Reopens some commerce and brings modest revenue, but local merchants suffer under the unfair competition.',
      },
      military_passage_rights: {
        title: 'Military Passage Rights',
        description: 'Allow {neighbor} troops to transit through kingdom territory. Lifts the blockade pressure but weakens border security and compromises intelligence operations.',
      },
      hostage_exchange: {
        title: 'Exchange Hostages',
        description: 'Send members of noble families as diplomatic guarantors. Demonstrates commitment to peace but destabilizes the nobility and creates a permanent vulnerability.',
      },
    },
    rejectLabel: 'Refuse and Endure the Blockade',
  },

  neg_marriage_alliance: {
    title: 'Marriage Alliance Proposed by {neighbor}',
    body: "{ruler_full} proposes a dynastic marriage to bind the two kingdoms together, knitting our bloodline to {dynasty}. The alliance would bring lasting peace and cooperation, but the terms of the union involve significant concessions — each one a permanent commitment that reshapes the kingdom's future.",
    contextLabel: 'DIPLOMATIC NEGOTIATION',
    terms: {
      royal_dowry: {
        title: 'Royal Dowry',
        description: 'Provide a lavish dowry befitting a royal union. Cements the alliance and pleases the nobility who value dynastic tradition, but the treasury takes a devastating blow.',
      },
      land_gift: {
        title: 'Gift of Border Lands',
        description: 'Cede border territories as a wedding gift. Strengthens the diplomatic bond but permanently reduces the kingdom\'s development potential and enrages nobles who held estates there.',
      },
      faith_concessions: {
        title: 'Religious Accommodation',
        description: 'Permit {neighbor}\'s religious practices within the kingdom as a condition of the union. Improves diplomatic ties but introduces heterodox traditions that alarm the clergy.',
      },
    },
    rejectLabel: 'Decline the Marriage',
  },
};
