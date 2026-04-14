import type { StorylineTextEntry } from '../events';

export const EXPANSION_STORYLINE_TEXT: Record<string, StorylineTextEntry> = {
  // ============================================================
  // Political 1 — The Council of Lords
  // ============================================================
  sl_exp_council_of_lords: {
    title: 'The Council of Lords',
    statusNote: 'A coalition of nobles presses for a formal advisory council to the crown.',
    branchPoints: {
      bp_council_lords_opening: {
        body: 'A delegation of the kingdom\'s most powerful nobles has presented a formal petition demanding the establishment of an advisory council. They argue that the crown\'s decisions affect all great houses and that their voices deserve a permanent seat at the table. The proposal is unprecedented — and divisive.',
        choices: {
          accept_council_proposal: 'Accept the Council Proposal',
          reject_and_reassert_authority: 'Reject and Reassert Royal Authority',
          propose_limited_advisory_body: 'Propose a Limited Advisory Body',
        },
      },
      bp_council_lords_mid: {
        body: 'The council question has become the defining political issue of the realm. Nobles who were once rivals now unite behind the cause, while loyalist factions warn that any concession will erode the crown\'s power irreversibly. A decision must be made about the council\'s true scope.',
        choices: {
          grant_legislative_powers: 'Grant Legislative Powers',
          stack_council_with_loyalists: 'Stack the Council with Loyalists',
          dissolve_council_by_force: 'Dissolve the Council by Force',
        },
      },
      bp_council_lords_resolution: {
        body: 'The matter of the Council of Lords has reached its conclusion. The political landscape of the kingdom has been permanently altered by the decisions made during this crisis.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Political 2 — The Foreign Bride
  // ============================================================
  sl_exp_foreign_bride: {
    title: 'The Foreign Bride',
    statusNote: 'A marriage alliance with a foreign court brings both opportunity and complication.',
    branchPoints: {
      bp_foreign_bride_opening: {
        body: 'A prestigious foreign court has proposed a marriage alliance, offering a bride of noble blood along with a generous dowry and trade concessions. The match would strengthen the kingdom\'s position abroad, but some at court worry about foreign influence and the erosion of tradition.',
        choices: {
          accept_marriage_alliance: 'Accept the Marriage Alliance',
          negotiate_better_terms: 'Negotiate Better Terms',
          decline_and_seek_domestic_match: 'Decline and Seek a Domestic Match',
        },
      },
      bp_foreign_bride_mid: {
        body: 'The foreign bride has arrived, and her presence at court has become a lightning rod for debate. Her customs and language are unfamiliar, and factions have formed around whether to embrace or resist the cultural changes she brings. The crown must chart a course.',
        choices: {
          embrace_foreign_customs: 'Embrace Foreign Customs',
          insist_on_assimilation: 'Insist on Assimilation',
          exploit_alliance_for_trade: 'Exploit the Alliance for Trade',
        },
      },
      bp_foreign_bride_resolution: {
        body: 'The saga of the foreign bride has reached its conclusion. Whether the alliance has strengthened or strained the kingdom depends on the choices made along the way.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Religious 1 — The Relic Discovery
  // ============================================================
  sl_exp_relic_discovery: {
    title: 'The Relic Discovery',
    statusNote: 'A contested holy relic has been unearthed, sparking fervent debate.',
    branchPoints: {
      bp_relic_opening: {
        body: 'Workers excavating a foundation for a new chapel have unearthed what appears to be an ancient holy relic — a crystal reliquary containing what the clergy claim are the bones of a saint. News of the discovery has spread like wildfire, and pilgrims are already arriving. But rival factions dispute both its authenticity and its rightful home.',
        choices: {
          enshrine_in_cathedral: 'Enshrine in the Cathedral',
          submit_to_scholarly_study: 'Submit to Scholarly Study',
          auction_to_highest_bidder: 'Auction to the Highest Bidder',
        },
      },
      bp_relic_mid: {
        body: 'The relic has become a focal point of religious and political tension. The clergy is split over its significance, neighboring realms have lodged claims to it, and the common folk ascribe miraculous healings to its presence. The crown must decide how to manage this growing phenomenon.',
        choices: {
          declare_miraculous_origin: 'Declare Its Miraculous Origin',
          share_relic_with_neighbor: 'Share the Relic with a Neighbor',
          suppress_competing_claims: 'Suppress Competing Claims',
        },
      },
      bp_relic_resolution: {
        body: 'The matter of the holy relic has reached its conclusion. The faith of the realm has been shaped by the crown\'s handling of this extraordinary discovery.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Religious 2 — The Witch Trials
  // ============================================================
  sl_exp_witch_trials: {
    title: 'The Witch Trials',
    statusNote: 'Accusations of sorcery spread through the kingdom, demanding a response.',
    branchPoints: {
      bp_witch_trials_opening: {
        body: 'A series of unexplained misfortunes — crop failures, livestock deaths, a nobleman\'s sudden illness — have led to accusations of witchcraft in several provinces. The clergy demands formal inquisition, while voices of reason urge caution. Fear is spreading faster than the truth.',
        choices: {
          authorize_inquisition: 'Authorize an Inquisition',
          demand_evidence_standards: 'Demand Evidence Standards',
          dismiss_accusations_outright: 'Dismiss the Accusations Outright',
        },
      },
      bp_witch_trials_mid: {
        body: 'The witch scare has escalated beyond anyone\'s expectations. Accusations now target merchants, healers, and even minor nobles. Dungeons fill with the accused, and the populace is gripped by paranoia. The crown must decide whether to ride the wave of fervor or attempt to contain it.',
        choices: {
          expand_trials_to_nobility: 'Expand the Trials to the Nobility',
          pardon_the_accused: 'Pardon the Accused',
          redirect_fervor_outward: 'Redirect the Fervor Outward',
        },
      },
      bp_witch_trials_resolution: {
        body: 'The witch trials have run their course. Whether justice was served or hysteria prevailed, the kingdom must now reckon with the consequences.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Military 1 — The Mercenary Company
  // ============================================================
  sl_exp_mercenary_company: {
    title: 'The Mercenary Company',
    statusNote: 'A renowned mercenary company offers its services to the crown.',
    branchPoints: {
      bp_mercenary_opening: {
        body: 'The Iron Wolves, a mercenary company of fearsome reputation, have arrived at the kingdom\'s borders seeking employment. Their captain offers seasoned fighters, siege specialists, and scouts — for a price. The standing army views them with suspicion, but their capabilities are undeniable.',
        choices: {
          hire_full_company: 'Hire the Full Company',
          hire_select_specialists: 'Hire Select Specialists',
          turn_mercenaries_away: 'Turn the Mercenaries Away',
        },
      },
      bp_mercenary_mid: {
        body: 'The mercenaries have proven their worth in the field, but their presence has created tension. Regular soldiers resent the sellswords\' higher pay and foreign ways, while the mercenaries chafe under royal command. A decision must be made about their long-term role.',
        choices: {
          integrate_into_standing_army: 'Integrate into the Standing Army',
          deploy_to_border_garrison: 'Deploy to the Border Garrison',
          terminate_contract_early: 'Terminate the Contract Early',
        },
      },
      bp_mercenary_resolution: {
        body: 'The matter of the mercenary company has reached its conclusion. The kingdom\'s military strength and character have been shaped by these decisions.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Military 2 — The Veterans' March
  // ============================================================
  sl_exp_veterans_march: {
    title: 'The Veterans\' March',
    statusNote: 'Demobilized soldiers march on the capital demanding pensions and recognition.',
    branchPoints: {
      bp_veterans_opening: {
        body: 'Hundreds of demobilized soldiers have gathered outside the capital gates. They carry their old banners and wear their campaign medals, demanding pensions, land grants, and recognition for their service. Their cause is just, but the treasury is strained and the nobility is nervous about armed commoners making demands.',
        choices: {
          grant_veteran_pensions: 'Grant Veteran Pensions',
          offer_land_grants: 'Offer Land Grants Instead',
          disperse_the_march: 'Disperse the March',
        },
      },
      bp_veterans_mid: {
        body: 'The veterans\' movement has evolved beyond a simple protest. They have organized themselves into a disciplined force with elected leaders and clear demands. Other discontented groups are rallying to their cause. The crown must decide how to channel this energy before it becomes uncontrollable.',
        choices: {
          establish_veterans_guild: 'Establish a Veterans\' Guild',
          conscript_into_civic_works: 'Conscript into Civic Works',
          suppress_veteran_leaders: 'Suppress the Veteran Leaders',
        },
      },
      bp_veterans_resolution: {
        body: 'The veterans\' march has reached its conclusion. How the kingdom treats those who fought for it will echo through the ranks for generations.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // TradeEcon 1 — The Silk Road
  // ============================================================
  sl_exp_silk_road: {
    title: 'The Silk Road',
    statusNote: 'A proposal to establish an overland trade route promises riches and risk.',
    branchPoints: {
      bp_silk_road_opening: {
        body: 'A consortium of merchants has presented the crown with a bold proposal: an overland trade route through uncharted territory to distant markets. The potential profits are enormous — exotic spices, fine textiles, and rare metals — but the route passes through bandit country and disputed borderlands.',
        choices: {
          fund_royal_trade_expedition: 'Fund a Royal Trade Expedition',
          charter_merchant_venture: 'Charter a Merchant Venture',
          decline_route_proposal: 'Decline the Route Proposal',
        },
      },
      bp_silk_road_mid: {
        body: 'The first caravans have returned with goods that dazzle the court and fill the markets. But success has brought complications: bandits prey on the route, neighboring realms demand transit fees, and the merchant guilds squabble over trading rights. The route needs governance.',
        choices: {
          build_caravanserai_network: 'Build a Caravanserai Network',
          impose_trade_tariffs: 'Impose Trade Tariffs',
          militarize_the_route: 'Militarize the Route',
        },
      },
      bp_silk_road_resolution: {
        body: 'The fate of the overland trade route has been decided. Whether it becomes a highway of prosperity or a source of endless trouble depends on the choices made.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // TradeEcon 2 — The Currency Crisis
  // ============================================================
  sl_exp_currency_crisis: {
    title: 'The Currency Crisis',
    statusNote: 'Debased foreign coinage floods the kingdom\'s markets, threatening economic stability.',
    branchPoints: {
      bp_currency_opening: {
        body: 'Merchants report a flood of debased foreign coins entering the kingdom\'s markets. The counterfeit currency — clipped, alloyed, or outright forged — is undermining confidence in trade. Prices fluctuate wildly, and honest merchants suffer while currency speculators profit. The crown must act to stabilize the economy.',
        choices: {
          ban_foreign_coinage: 'Ban Foreign Coinage',
          mint_new_royal_currency: 'Mint New Royal Currency',
          allow_market_correction: 'Allow a Market Correction',
        },
      },
      bp_currency_mid: {
        body: 'The currency crisis has deepened. Markets have contracted, trade caravans sit idle, and the common folk hoard grain instead of trusting coin. Foreign powers deny responsibility while their merchants exploit the chaos. A structural solution is needed before the economy collapses entirely.',
        choices: {
          establish_royal_exchange: 'Establish a Royal Exchange',
          seize_foreign_merchant_reserves: 'Seize Foreign Merchant Reserves',
          negotiate_currency_treaty: 'Negotiate a Currency Treaty',
        },
      },
      bp_currency_resolution: {
        body: 'The currency crisis has been resolved — for better or worse. The economic decisions made during this turmoil will shape the kingdom\'s prosperity for years to come.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Discovery 1 — The Ancient Library
  // ============================================================
  sl_exp_ancient_library: {
    title: 'The Ancient Library',
    statusNote: 'A buried cache of ancient knowledge has been discovered beneath the kingdom.',
    branchPoints: {
      bp_library_opening: {
        body: 'Miners tunneling beneath the old quarter have broken through into a vast underground chamber filled with shelves of ancient scrolls and bound codices. The texts appear to predate the kingdom itself, written in archaic scripts that only the most learned scholars can decipher. The discovery could reshape the kingdom\'s understanding of its own past.',
        choices: {
          fund_full_excavation_library: 'Fund a Full Excavation',
          send_scholars_quietly: 'Send Scholars Quietly',
          seal_the_site: 'Seal the Site',
        },
      },
      bp_library_mid: {
        body: 'The scholars have made astonishing progress translating the ancient texts. The library contains knowledge of medicine, engineering, and natural philosophy far beyond current understanding — but also heterodox religious writings that challenge established doctrine. The clergy is alarmed, while the scholars are ecstatic.',
        choices: {
          publish_findings_openly: 'Publish the Findings Openly',
          restrict_to_royal_scholars: 'Restrict to Royal Scholars',
          weaponize_lost_knowledge: 'Weaponize the Lost Knowledge',
        },
      },
      bp_library_resolution: {
        body: 'The fate of the ancient library and its knowledge has been decided. What was buried for centuries has now reshaped the kingdom\'s future.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Discovery 2 — The Cartographers' Guild
  // ============================================================
  sl_exp_cartographers_guild: {
    title: 'The Cartographers\' Guild',
    statusNote: 'Royal cartographers have discovered uncharted territory beyond the kingdom\'s known borders.',
    branchPoints: {
      bp_cartographers_opening: {
        body: 'The Royal Cartographers\' Guild has presented extraordinary findings: beyond the eastern ridgeline lies a fertile valley, unclaimed by any neighboring power. The territory could provide farmland, timber, and mineral wealth — but claiming it risks conflict with neighbors who may have their own designs on the land.',
        choices: {
          sponsor_mapping_expedition: 'Sponsor a Mapping Expedition',
          claim_territory_by_decree: 'Claim the Territory by Decree',
          sell_maps_to_merchants: 'Sell the Maps to Merchants',
        },
      },
      bp_cartographers_mid: {
        body: 'The expedition has returned with detailed maps and samples of the valley\'s resources. The territory is richer than expected — and more contested. Neighboring scouts have been spotted, and a small indigenous settlement complicates any claim. The crown must decide how to proceed with colonization.',
        choices: {
          establish_frontier_outpost: 'Establish a Frontier Outpost',
          negotiate_shared_borders: 'Negotiate Shared Borders',
          fortify_and_annex: 'Fortify and Annex',
        },
      },
      bp_cartographers_resolution: {
        body: 'The question of the uncharted territory has been resolved. The kingdom\'s borders and ambitions have been redefined by the choices made.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Cultural 1 — The Bards' Rebellion
  // ============================================================
  sl_exp_bards_rebellion: {
    title: 'The Bards\' Rebellion',
    statusNote: 'Satirical songs criticizing the crown have become wildly popular.',
    branchPoints: {
      bp_bards_opening: {
        body: 'A troupe of traveling bards has composed a cycle of satirical ballads mocking the crown, the nobility, and the clergy with devastating wit. The songs have spread like wildfire through taverns and market squares, and the common folk sing them openly. Some call it harmless entertainment; others see the seeds of sedition.',
        choices: {
          ban_seditious_songs: 'Ban Seditious Songs',
          commission_counter_ballads: 'Commission Counter-Ballads',
          invite_bards_to_court: 'Invite the Bards to Court',
        },
      },
      bp_bards_mid: {
        body: 'The bards\' movement has evolved beyond mere entertainment. Their songs now carry specific political demands — fairer taxation, accountability for nobles, and freedom of expression. Crowds gather wherever they perform, and the line between art and activism has blurred entirely. The crown must decide whether to co-opt or confront this cultural uprising.',
        choices: {
          establish_royal_theater: 'Establish a Royal Theater',
          arrest_ringleaders: 'Arrest the Ringleaders',
          channel_into_reform_movement: 'Channel into a Reform Movement',
        },
      },
      bp_bards_resolution: {
        body: 'The bards\' rebellion has reached its conclusion. The relationship between art, dissent, and power in the kingdom has been permanently altered.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // ============================================================
  // Cultural 2 — The Builder's Vision
  // ============================================================
  sl_exp_builders_vision: {
    title: 'The Builder\'s Vision',
    statusNote: 'A visionary architect proposes a grand construction project for the kingdom.',
    branchPoints: {
      bp_builders_opening: {
        body: 'A master architect has presented the crown with breathtaking plans for a grand monument — a soaring cathedral, a magnificent bridge, or a great hall that would rival any structure in the known world. The project would require enormous resources but could define the kingdom\'s legacy for centuries.',
        choices: {
          approve_grand_monument: 'Approve the Grand Monument',
          redirect_to_infrastructure: 'Redirect to Practical Infrastructure',
          reject_as_vanity_project: 'Reject as a Vanity Project',
        },
      },
      bp_builders_mid: {
        body: 'Construction is underway, and the project has become the kingdom\'s defining endeavor. Workers flock to the site, artisans compete for commissions, and foreign courts send observers. But costs are mounting, labor shortages strain the provinces, and the architect\'s vision grows ever more ambitious. Scope must be managed.',
        choices: {
          expand_scope_with_foreign_artisans: 'Expand Scope with Foreign Artisans',
          scale_back_to_essentials: 'Scale Back to Essentials',
          conscript_labor_force: 'Conscript a Labor Force',
        },
      },
      bp_builders_resolution: {
        body: 'The great building project has reached its conclusion. Whether it stands as a monument to ambition or a cautionary tale of excess, it has left its mark on the kingdom.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },
};
