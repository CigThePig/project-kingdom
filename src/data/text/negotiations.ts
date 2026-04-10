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
    body: 'Envoys from {neighbor} have arrived to negotiate a comprehensive trade agreement. They present several terms for your consideration — each bringing benefits but also entanglements with a foreign power.',
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
        description: 'Allow {neighbor} ships to dock freely in our harbors. Merchants gain new trade partners, but the military loses control of key coastal access points.',
      },
    },
    rejectLabel: 'Reject the Proposal Entirely',
  },

  neg_treaty_terms: {
    title: 'Treaty Negotiations with {neighbor}',
    body: '{neighbor} proposes formalizing relations through a binding treaty. The terms would deepen cooperation but constrain the kingdom\'s freedom of action in significant ways.',
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
    body: '{neighbor} proposes a formal military and economic alliance. The pact would bind the two kingdoms together against common threats — but each term limits sovereignty in exchange for security.',
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
};
