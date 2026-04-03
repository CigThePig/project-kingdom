// ============================================================
// Event & Storyline Display Text
// ============================================================
// Every EventDefinition.id in events/index.ts must have a matching key in EVENT_TEXT.
// Every StorylineDefinition.id must have a matching key in STORYLINE_TEXT,
// with entries for every branchId and every choiceId.

export interface EventTextEntry {
  title: string;
  body: string;
  choices: Record<string, string>; // choiceId → button label
}

export interface StorylineTextEntry {
  title: string;
  statusNote: string; // shown on Dashboard during dormant turns
  branchPoints: Record<
    string,
    {
      body: string;
      choices: Record<string, string>;
    }
  >;
}

// ============================================================
// Event Text — 26 Entries
// ============================================================

export const EVENT_TEXT: Record<string, EventTextEntry> = {
  // --- Economy (2) ---
  evt_merchant_capital_flight: {
    title: 'Capital Flight Among the Merchants',
    body: 'Reports from the merchant quarters indicate a troubling trend: significant wealth is being moved beyond the kingdom\'s borders. Merchant confidence has eroded, and several prominent trading houses are quietly relocating their reserves to foreign vaults.',
    choices: {
      offer_tax_relief: 'Offer Tax Relief',
      enforce_capital_controls: 'Enforce Capital Controls',
      negotiate_with_guilds: 'Negotiate with Guild Leaders',
    },
  },
  evt_treasury_windfall: {
    title: 'Unexpected Revenue Surplus',
    body: 'The treasury has received an unanticipated influx of revenue. A combination of favorable trade conditions and efficient tax collection has produced a surplus beyond projections. The court debates how best to allocate the excess.',
    choices: {
      invest_in_infrastructure: 'Invest in Infrastructure',
      distribute_to_populace: 'Distribute to the Populace',
      bolster_reserves: 'Bolster the Reserves',
    },
  },

  // --- Food (2) ---
  evt_harvest_blight: {
    title: 'Blight Threatens the Harvest',
    body: 'A persistent blight has spread across the kingdom\'s central farmlands. Crop yields are falling sharply, and agricultural laborers report entire fields lost to the affliction. Without intervention, the coming months will bring severe shortages.',
    choices: {
      quarantine_affected_fields: 'Quarantine Affected Fields',
      redirect_labor_to_salvage: 'Redirect Labor to Salvage',
      purchase_foreign_grain: 'Purchase Foreign Grain',
    },
  },
  evt_commoner_harvest_festival: {
    title: 'Commoners Celebrate the Harvest',
    body: 'With food reserves comfortably stocked, the common folk have organized a harvest celebration across several townships. The festivities have improved spirits, though some in the court question whether such gatherings should be formally endorsed.',
    choices: {
      endorse_celebrations: 'Endorse the Celebrations',
      observe_without_comment: 'Observe Without Comment',
    },
  },

  // --- Military (2) — Chain ---
  evt_military_equipment_shortage_1: {
    title: 'Equipment Shortages Reported',
    body: 'The military quartermaster has filed an urgent report: equipment stores are running dangerously low. Weapons require repair, armor is deteriorating, and supply lines for raw materials have thinned. If unaddressed, readiness will continue to decline.',
    choices: {
      emergency_procurement: 'Order Emergency Procurement',
      redistribute_existing_stock: 'Redistribute Existing Stock',
      defer_to_next_month: 'Defer to Next Month',
    },
  },
  evt_military_equipment_shortage_2: {
    title: 'Equipment Crisis Deepens',
    body: 'The equipment shortage has worsened considerably. Soldiers are improvising repairs with inadequate materials, and several garrison commanders report that their units are no longer fit for sustained operations. The situation demands decisive action.',
    choices: {
      full_rearmament_program: 'Launch Full Rearmament',
      request_allied_supplies: 'Request Allied Supplies',
      reduce_force_size: 'Reduce Force Size',
    },
  },

  // --- Diplomacy (2) ---
  evt_neighbor_trade_overture: {
    title: 'Foreign Trade Overture',
    body: 'An envoy from a neighboring kingdom has arrived bearing proposals for expanded trade agreements. The terms appear favorable, though accepting would deepen economic ties and mutual dependency with a foreign power.',
    choices: {
      accept_trade_terms: 'Accept the Terms',
      propose_modifications: 'Propose Modifications',
      decline_politely: 'Decline Politely',
    },
  },
  evt_border_tension_escalation: {
    title: 'Border Tensions Escalate',
    body: 'Incidents along the kingdom\'s border have intensified. Disputed territorial claims, coupled with provocative military posturing by a neighbor, have raised the prospect of open conflict. The court awaits the crown\'s judgment.',
    choices: {
      reinforce_border_garrisons: 'Reinforce Border Garrisons',
      dispatch_diplomatic_envoy: 'Dispatch a Diplomatic Envoy',
      issue_formal_protest: 'Issue Formal Protest',
    },
  },

  // --- Environment (2) ---
  evt_early_frost: {
    title: 'Early Frost Strikes the Harvest',
    body: 'An unseasonably early frost has descended upon the kingdom\'s agricultural regions. Late-season crops are at risk, and farmers report significant losses in fields that had not yet been harvested. The timing is deeply unfortunate.',
    choices: {
      mobilize_harvest_crews: 'Mobilize Emergency Harvest Crews',
      open_emergency_stores: 'Open Emergency Grain Stores',
      accept_the_losses: 'Accept the Losses',
    },
  },
  evt_spring_flooding: {
    title: 'Spring Flooding Devastates Lowlands',
    body: 'Unusually heavy rains and rapid snowmelt have caused widespread flooding in the kingdom\'s lowland regions. Farmland is submerged, roads are impassable, and several communities have been displaced. Recovery will require sustained effort.',
    choices: {
      organize_relief_effort: 'Organize Relief Effort',
      redirect_military_engineers: 'Deploy Military Engineers',
      levy_emergency_reconstruction_tax: 'Levy Reconstruction Tax',
    },
  },

  // --- PublicOrder (2) ---
  evt_commoner_labor_dispute: {
    title: 'Labor Dispute Among the Commoners',
    body: 'A dispute has erupted between common laborers and the estates that employ them. Workers demand better conditions and fairer compensation, while landholders insist that concessions would ruin the harvest economy. The unrest is spreading.',
    choices: {
      mediate_negotiations: 'Mediate Negotiations',
      side_with_laborers: 'Side with the Laborers',
      enforce_existing_contracts: 'Enforce Existing Contracts',
    },
  },
  evt_popular_unrest: {
    title: 'Popular Unrest Threatens Order',
    body: 'Deep dissatisfaction among the common population has erupted into open unrest. Crowds gather in marketplaces demanding relief, and several districts report organized resistance to royal authority. The stability of the realm is at stake.',
    choices: {
      address_grievances_publicly: 'Address Grievances Publicly',
      deploy_peacekeepers: 'Deploy Peacekeepers',
      impose_curfew: 'Impose Emergency Curfew',
    },
  },

  // --- Religion (2) ---
  evt_heresy_emergence: {
    title: 'Heretical Teachings Emerge',
    body: 'Reports from the clergy indicate that unorthodox teachings have taken root in several parishes. The doctrines challenge established tradition and have attracted a following among both commoners and minor scholars. The orthodox clergy demands a response.',
    choices: {
      investigate_teachings: 'Investigate the Teachings',
      suppress_immediately: 'Suppress Immediately',
      permit_theological_debate: 'Permit Theological Debate',
    },
  },
  evt_schism_crisis: {
    title: 'Schism Divides the Faithful',
    body: 'The growing divide within the kingdom\'s religious community has reached a breaking point. Two factions of the clergy now preach competing doctrines, and the faithful are forced to choose sides. The schism threatens to fracture the spiritual unity that binds the realm.',
    choices: {
      convene_ecclesiastical_council: 'Convene an Ecclesiastical Council',
      enforce_state_doctrine: 'Enforce State Doctrine',
      allow_coexistence: 'Allow Coexistence',
    },
  },

  // --- Culture (2) ---
  evt_foreign_cultural_influx: {
    title: 'Foreign Cultural Influences Arrive',
    body: 'Trade routes have brought more than goods — foreign customs, artistic traditions, and social practices are spreading through the kingdom\'s market towns. Some welcome the enrichment; others see a threat to the realm\'s cultural identity.',
    choices: {
      embrace_exchange: 'Embrace Cultural Exchange',
      regulate_foreign_practices: 'Regulate Foreign Practices',
      observe_and_assess: 'Observe and Assess',
    },
  },
  evt_cultural_festival_proposal: {
    title: 'Proposal for a Grand Cultural Festival',
    body: 'Leading figures among the clergy and cultural institutions have proposed a grand festival celebrating the kingdom\'s traditions. The event would reinforce cultural cohesion and boost morale, though it will require substantial investment.',
    choices: {
      approve_full_festival: 'Approve Full Festival',
      approve_modest_version: 'Approve Modest Version',
      decline_proposal: 'Decline the Proposal',
    },
  },

  // --- Espionage (2) ---
  evt_foreign_agent_detected: {
    title: 'Foreign Agent Detected',
    body: 'Intelligence operatives have identified a suspected foreign agent operating within the kingdom. The individual appears to be gathering information on military deployments and economic capacity. The intelligence services await orders.',
    choices: {
      arrest_and_interrogate: 'Arrest and Interrogate',
      monitor_covertly: 'Monitor Covertly',
      expel_from_kingdom: 'Expel from the Kingdom',
    },
  },
  evt_noble_intrigue_discovered: {
    title: 'Noble Intrigue Uncovered',
    body: 'Intelligence reports reveal that a faction within the nobility has been conducting secret correspondence with a foreign court. The nature of the communication is unclear, but the implications for the crown\'s authority are concerning.',
    choices: {
      confront_directly: 'Confront the Nobles Directly',
      launch_counter_intelligence: 'Launch Counter-Intelligence',
      ignore_for_now: 'Monitor Quietly',
    },
  },

  // --- Knowledge (2) ---
  evt_scholarly_breakthrough: {
    title: 'Scholarly Breakthrough Reported',
    body: 'Scholars in the kingdom\'s institutions report a significant advancement in their field of study. The discovery has practical implications that could benefit the realm, though further investment would be needed to realize its full potential.',
    choices: {
      fund_further_research: 'Fund Further Research',
      apply_practical_findings: 'Apply Practical Findings',
      acknowledge_achievement: 'Acknowledge the Achievement',
    },
  },
  evt_library_fire: {
    title: 'Fire Damages the Royal Library',
    body: 'A devastating fire has swept through a section of the kingdom\'s principal library. Irreplaceable manuscripts and scholarly works have been lost. The cause remains under investigation, but the damage to the realm\'s accumulated knowledge is severe.',
    choices: {
      launch_restoration_effort: 'Launch Restoration Effort',
      investigate_cause: 'Investigate the Cause',
      accept_and_rebuild: 'Accept and Rebuild',
    },
  },

  // --- ClassConflict (2) ---
  evt_noble_merchant_rivalry: {
    title: 'Rivalry Between Nobility and Merchants',
    body: 'Tensions between the old aristocracy and the rising merchant class have flared into open rivalry. The merchants, growing in wealth and influence, are challenging noble privileges. The nobility views this as an affront to the established order.',
    choices: {
      broker_compromise: 'Broker a Compromise',
      uphold_noble_privileges: 'Uphold Noble Privileges',
      recognize_merchant_standing: 'Recognize Merchant Standing',
    },
  },
  evt_clergy_merchant_dispute: {
    title: 'Clergy-Merchant Dispute Over Commerce',
    body: 'The clergy has publicly condemned certain merchant practices as contrary to the faith\'s teachings on fair dealing. Merchants counter that religious interference in commerce threatens the kingdom\'s prosperity. Both sides demand the crown\'s judgment.',
    choices: {
      side_with_clergy: 'Uphold Religious Standards',
      side_with_merchants: 'Protect Commercial Interests',
      seek_middle_ground: 'Seek Middle Ground',
    },
  },

  // --- Region (2) ---
  evt_regional_development_opportunity: {
    title: 'Regional Development Opportunity',
    body: 'Surveyors have identified an opportunity for significant development in one of the kingdom\'s regions. With targeted investment, local output could be meaningfully improved. The treasury has sufficient reserves to consider the proposal.',
    choices: {
      approve_development: 'Approve Development Investment',
      defer_to_local_governance: 'Defer to Local Governance',
      decline_investment: 'Decline the Investment',
    },
  },
  evt_regional_unrest: {
    title: 'Regional Unrest Intensifies',
    body: 'Discontent in a peripheral region has intensified to the point of organized resistance. Local officials report that royal authority is being openly questioned, and the population demands relief from conditions they consider intolerable.',
    choices: {
      dispatch_relief_and_reforms: 'Dispatch Relief and Reforms',
      send_peacekeeping_force: 'Send Peacekeeping Force',
      summon_local_leaders: 'Summon Local Leaders',
    },
  },

  // --- Kingdom (2) ---
  evt_annual_state_assessment: {
    title: 'Annual State Assessment',
    body: 'The annual assessment of the kingdom\'s condition has been compiled by the royal council. The report provides a comprehensive overview of all domains — treasury, food security, military readiness, social stability, and diplomatic standing.',
    choices: {
      review_in_full: 'Review in Full',
      acknowledge_receipt: 'Acknowledge Receipt',
    },
  },
  evt_kingdom_milestone_celebrated: {
    title: 'Kingdom Milestone Celebrated',
    body: 'The realm has achieved a period of notable prosperity and stability. The court recommends marking the occasion with a formal recognition, which would reinforce the crown\'s legitimacy and lift the spirits of the populace.',
    choices: {
      host_state_celebration: 'Host State Celebration',
      issue_commemorative_decree: 'Issue Commemorative Decree',
      note_with_quiet_satisfaction: 'Note with Quiet Satisfaction',
    },
  },
};

// ============================================================
// Storyline Text — 6 Entries
// ============================================================

export const STORYLINE_TEXT: Record<string, StorylineTextEntry> = {
  // --- Political ---
  sl_pretenders_claim: {
    title: 'The Pretender\'s Claim',
    statusNote: 'A challenge to the crown\'s legitimacy develops in the shadows.',
    branchPoints: {
      bp_pretender_opening: {
        body: 'A distant relative of the ruling family has emerged from obscurity, backed by a faction of discontented nobles. The pretender claims a legitimate right to the throne and has begun rallying support in the provinces. The court is alarmed.',
        choices: {
          launch_espionage_investigation: 'Launch Espionage Investigation',
          open_direct_negotiation: 'Open Direct Negotiation',
          issue_public_condemnation: 'Issue Public Condemnation',
        },
      },
      bp_pretender_resolution: {
        body: 'The matter of the pretender\'s claim has reached its conclusion. The decisions made during this crisis will shape the political landscape of the kingdom for years to come.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Religious ---
  sl_prophet_of_the_waste: {
    title: 'The Prophet of the Waste',
    statusNote: 'A charismatic figure preaches reformed doctrine in the frontier regions.',
    branchPoints: {
      bp_prophet_opening: {
        body: 'A charismatic figure has appeared in the kingdom\'s frontier regions, preaching a reformed doctrine that challenges established religious tradition. The prophet\'s following is growing rapidly, and the orthodox clergy demands that the crown intervene.',
        choices: {
          send_clergy_investigation: 'Send Clergy to Investigate',
          declare_tolerance: 'Declare Tolerance',
          order_suppression: 'Order Suppression',
        },
      },
      bp_prophet_resolution: {
        body: 'The matter of the frontier prophet has reached its resolution. The faith of the realm — whether unified, reformed, or fractured — now reflects the choices made during this crisis.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Military ---
  sl_frozen_march: {
    title: 'The Frozen March',
    statusNote: 'A neighboring power masses forces along the border.',
    branchPoints: {
      bp_frozen_march_opening: {
        body: 'Intelligence reports confirm that a neighboring kingdom has begun massing forces near the border. The mobilization appears deliberate and sustained. Whether this is posturing or preparation for invasion remains unclear, but the realm must prepare.',
        choices: {
          conduct_reconnaissance: 'Conduct Reconnaissance',
          dispatch_diplomatic_envoy: 'Dispatch Diplomatic Envoy',
          begin_military_preparation: 'Begin Military Preparation',
        },
      },
      bp_frozen_march_resolution: {
        body: 'The military crisis along the border has reached its conclusion. The outcome — whether achieved through negotiation, deterrence, or force of arms — will define the kingdom\'s security for the foreseeable future.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- TradeEcon ---
  sl_merchant_king: {
    title: 'The Merchant King',
    statusNote: 'A powerful merchant family challenges the balance of power.',
    branchPoints: {
      bp_merchant_king_opening: {
        body: 'A single merchant family has amassed wealth sufficient to rival the lower nobility. Their trading empire spans the kingdom and beyond, and their influence over the economy grows with each passing month. The nobility is alarmed, and the court is divided.',
        choices: {
          impose_regulatory_limits: 'Impose Regulatory Limits',
          accept_investment_offer: 'Accept Investment Offer',
          await_and_observe: 'Await and Observe',
        },
      },
      bp_merchant_king_resolution: {
        body: 'The matter of the merchant family\'s rising power has been settled. The balance between noble privilege and merchant enterprise has been redefined.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Discovery ---
  sl_lost_expedition: {
    title: 'The Lost Expedition',
    statusNote: 'An expedition to the frontier has gone silent.',
    branchPoints: {
      bp_expedition_opening: {
        body: 'An expedition dispatched to explore the kingdom\'s distant frontier has gone silent. Weeks have passed without report, and the last message spoke of unusual discoveries and growing unease. The court debates whether to mount a rescue or accept the loss.',
        choices: {
          dispatch_rescue_party: 'Dispatch Rescue Party',
          await_further_word: 'Await Further Word',
        },
      },
      bp_expedition_resolution: {
        body: 'The fate of the lost expedition has been determined. Whether the venture produced discovery or loss, the kingdom must reckon with its outcome.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Cultural ---
  sl_foreign_festival: {
    title: 'The Foreign Festival',
    statusNote: 'Foreign cultural influence spreads through trade and migration.',
    branchPoints: {
      bp_festival_opening: {
        body: 'A wave of foreign cultural practices has arrived through expanding trade routes. Foreign festivals, artistic traditions, and social customs are gaining popularity, particularly among the merchant class. The clergy views this with suspicion, while traders see opportunity.',
        choices: {
          embrace_cultural_exchange: 'Embrace Cultural Exchange',
          permit_with_restrictions: 'Permit with Restrictions',
          restrict_foreign_practices: 'Restrict Foreign Practices',
        },
      },
      bp_festival_resolution: {
        body: 'The question of foreign cultural influence has been addressed. The kingdom\'s cultural identity has been shaped — for better or worse — by the crown\'s response.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },
};
