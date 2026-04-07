// ============================================================
// Event & Storyline Display Text
// ============================================================
// Every EventDefinition.id in events/index.ts must have a matching key in EVENT_TEXT.
// Every StorylineDefinition.id must have a matching key in STORYLINE_TEXT,
// with entries for every branchId and every choiceId.

import { FACTION_REQUEST_TEXT as FACTION_REQUEST_TEXT_ENTRIES } from './faction-requests';

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
// Event Text — 51 Entries
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
  // --- CLASS-SPECIFIC: Nobility (3) ---
  evt_noble_succession_dispute: {
    title: 'Noble Succession Dispute',
    body: 'Two prominent noble houses have entered a bitter dispute over the inheritance of a deceased lord\'s estates and titles. Both claimants present compelling arguments, and the matter threatens to divide the court. The crown\'s judgment is demanded.',
    choices: {
      mediate_succession: 'Mediate the Succession',
      support_senior_claimant: 'Support the Senior Claimant',
      let_nobles_settle_it: 'Let the Nobles Settle It',
    },
  },
  evt_noble_court_faction: {
    title: 'Court Faction Emerges',
    body: 'Intelligence reports indicate that a faction of lesser nobles has coalesced at court, united by shared grievances against the crown\'s recent policies. Their meetings grow bolder, and their rhetoric more pointed. The faction has not yet acted openly, but its existence is no longer secret.',
    choices: {
      co_opt_faction_leaders: 'Co-opt Faction Leaders',
      publicly_denounce_faction: 'Publicly Denounce the Faction',
      monitor_faction_quietly: 'Monitor Quietly',
    },
  },
  evt_noble_land_seizure: {
    title: 'Noble Land Seizures Reported',
    body: 'Emboldened by their standing at court, several noble houses have begun seizing common lands, displacing tenant farmers and consolidating their holdings. The commoners affected have petitioned the crown for redress, while the nobles claim ancient prerogatives.',
    choices: {
      reverse_seizures: 'Order Seizures Reversed',
      impose_compensation: 'Impose Compensation',
      uphold_noble_claims: 'Uphold Noble Claims',
    },
  },

  // --- CLASS-SPECIFIC: Clergy (3) ---
  evt_clergy_monastic_dispute: {
    title: 'Monastic Jurisdictional Dispute',
    body: 'Two rival monastic orders have come into conflict over the administration of a prosperous region\'s parishes. Both claim historical authority, and the dispute has disrupted religious services in several communities. The faithful await resolution.',
    choices: {
      arbitrate_dispute: 'Arbitrate the Dispute',
      favor_established_order: 'Favor the Established Order',
      leave_to_ecclesiastical_courts: 'Leave to Ecclesiastical Courts',
    },
  },
  evt_clergy_pilgrimage_movement: {
    title: 'Pilgrimage Movement Grows',
    body: 'A spontaneous pilgrimage movement has emerged among the faithful, with growing numbers of commoners and clergy traveling to a regional shrine believed to possess healing properties. The movement strengthens devotion but draws laborers from their fields.',
    choices: {
      endorse_pilgrimage: 'Endorse the Pilgrimage',
      provide_royal_escort: 'Provide Royal Escort',
      discourage_travel: 'Discourage the Travel',
    },
  },
  evt_clergy_prophecy_claim: {
    title: 'Clergy Member Claims Prophecy',
    body: 'A respected member of the clergy has publicly claimed to have received a divine prophecy foretelling great change for the kingdom. The orthodox hierarchy is alarmed, while common folk and some scholars are captivated. The prophecy\'s implications are deeply unsettling to those in power.',
    choices: {
      investigate_prophecy: 'Investigate the Prophecy',
      endorse_as_divine_sign: 'Endorse as Divine Sign',
      dismiss_as_superstition: 'Dismiss as Superstition',
    },
  },

  // --- CLASS-SPECIFIC: Merchants (3) ---
  evt_merchant_guild_formation: {
    title: 'Merchants Petition for Guild Charter',
    body: 'The kingdom\'s leading merchants have submitted a formal petition for the establishment of a chartered merchants\' guild. The guild would regulate trade practices, set standards, and represent merchant interests at court. The nobility views the proposal with suspicion.',
    choices: {
      grant_guild_charter: 'Grant the Guild Charter',
      impose_royal_oversight: 'Grant with Royal Oversight',
      deny_guild_petition: 'Deny the Petition',
    },
  },
  evt_merchant_smuggling_ring: {
    title: 'Smuggling Ring Uncovered',
    body: 'Intelligence operatives have uncovered a sophisticated smuggling operation running through the kingdom\'s trade routes. The network has been evading tariffs and moving contraband goods, costing the treasury significant revenue. Several prominent merchants may be implicated.',
    choices: {
      raid_smuggling_operation: 'Raid the Operation',
      infiltrate_network: 'Infiltrate the Network',
      levy_fines_and_warn: 'Levy Fines and Warn',
    },
  },
  evt_merchant_foreign_traders: {
    title: 'Foreign Traders Seek Access',
    body: 'A delegation of foreign merchants has arrived at the capital, seeking permission to establish permanent trading posts within the kingdom. They offer exotic goods and new commercial connections, though their presence would compete with established local traders.',
    choices: {
      welcome_foreign_merchants: 'Welcome Foreign Merchants',
      negotiate_trade_terms: 'Negotiate Terms',
      restrict_foreign_access: 'Restrict Access',
    },
  },

  // --- CLASS-SPECIFIC: Commoners (3) ---
  evt_commoner_plague_outbreak: {
    title: 'Plague Outbreak in the Commons',
    body: 'A virulent illness has broken out in the kingdom\'s most densely populated districts. The disease spreads rapidly through cramped quarters and compromised nutrition. Without decisive intervention, the outbreak could devastate the common population and spread to other classes.',
    choices: {
      quarantine_affected_districts: 'Quarantine Affected Districts',
      mobilize_clergy_healers: 'Mobilize Clergy Healers',
      distribute_herbal_remedies: 'Distribute Herbal Remedies',
    },
  },
  evt_commoner_folk_hero: {
    title: 'Folk Hero Emerges Among Commoners',
    body: 'A charismatic figure has risen from the commoner ranks, celebrated in songs and stories as a champion of the downtrodden. The folk hero\'s growing fame reflects deep popular discontent, though the figure has not called for rebellion — yet.',
    choices: {
      invite_to_court: 'Invite to Court',
      co_opt_folk_narrative: 'Co-opt the Narrative',
      ignore_the_stories: 'Ignore the Stories',
    },
  },
  evt_commoner_migration_wave: {
    title: 'Rural Migration Wave',
    body: 'Significant numbers of rural commoners are abandoning their villages and migrating toward the kingdom\'s towns and trading centers. The migration is driven by poor rural conditions and the promise of urban opportunity, but it strains town resources and depletes agricultural labor.',
    choices: {
      manage_resettlement: 'Manage Resettlement',
      restrict_movement: 'Restrict Movement',
      allow_natural_flow: 'Allow Natural Flow',
    },
  },

  // --- CLASS-SPECIFIC: Military Caste (3) ---
  evt_military_veteran_demands: {
    title: 'Veterans Demand Recognition',
    body: 'A delegation of military veterans has presented a formal petition to the crown, demanding pensions, land grants, and formal recognition of their service. The veterans command respect among the military caste and their cause has broad sympathy among the ranks.',
    choices: {
      grant_veteran_pensions: 'Grant Veteran Pensions',
      offer_land_grants: 'Offer Land Grants',
      acknowledge_service_only: 'Acknowledge Service Only',
    },
  },
  evt_military_desertion_crisis: {
    title: 'Desertion Crisis in the Ranks',
    body: 'Military commanders report an alarming increase in desertions. Soldiers cite poor conditions, inadequate equipment, and low morale as their reasons for abandoning their posts. The crisis threatens to hollow out the kingdom\'s fighting capability.',
    choices: {
      increase_military_pay: 'Increase Military Pay',
      enforce_harsh_discipline: 'Enforce Harsh Discipline',
      appeal_to_honor: 'Appeal to Honor and Duty',
    },
  },
  evt_military_honor_dispute: {
    title: 'Honor Dispute Between Officers and Nobles',
    body: 'A bitter dispute has erupted between military officers promoted on merit and noble-born officers claiming precedence by birth. The conflict has paralyzed the command structure and created factions within the officer corps. Both sides appeal to the crown.',
    choices: {
      uphold_military_merit: 'Uphold Military Merit',
      defer_to_noble_rank: 'Defer to Noble Rank',
      establish_joint_council: 'Establish Joint Council',
    },
  },

  // --- SEASONAL: Spring (2) ---
  evt_spring_planting_festival: {
    title: 'Spring Planting Festival',
    body: 'With food reserves healthy and the thaw complete, communities across the kingdom have organized spring planting festivals. The celebrations mark the beginning of the growing season with rituals, communal feasting, and prayers for a bountiful harvest.',
    choices: {
      sponsor_planting_rites: 'Sponsor the Planting Rites',
      attend_ceremonies: 'Attend the Ceremonies',
      decline_involvement: 'Decline Royal Involvement',
    },
  },
  evt_spring_river_thaw: {
    title: 'Spring Thaw Threatens Infrastructure',
    body: 'The spring thaw has brought a rapid increase in river levels across the kingdom\'s lowland regions. Bridges and riverside structures are under stress, and several roads have become impassable. Without preventive action, infrastructure damage could be significant.',
    choices: {
      reinforce_riverbanks: 'Reinforce Riverbanks',
      evacuate_lowlands: 'Evacuate Lowland Settlements',
      monitor_water_levels: 'Monitor Water Levels',
    },
  },

  // --- SEASONAL: Summer (2) ---
  evt_summer_drought: {
    title: 'Summer Drought Grips the Kingdom',
    body: 'A prolonged period without rainfall has dried wells, withered crops, and strained the kingdom\'s water supplies. Agricultural production is falling sharply, and commoners in several regions report water shortages. The drought shows no sign of breaking.',
    choices: {
      ration_water_supplies: 'Ration Water Supplies',
      dig_emergency_wells: 'Dig Emergency Wells',
      pray_for_rain: 'Organize Prayers for Rain',
    },
  },
  evt_summer_trade_season: {
    title: 'Peak Trade Season Arrives',
    body: 'The warm months have brought a surge in merchant activity. Trade caravans clog the roads, market towns are bustling, and the treasury benefits from increased tariff revenue. The court considers how best to capitalize on this seasonal commercial boom.',
    choices: {
      host_trade_fair: 'Host a Grand Trade Fair',
      reduce_trade_tariffs: 'Temporarily Reduce Tariffs',
      maintain_current_policy: 'Maintain Current Policy',
    },
  },

  // --- SEASONAL: Autumn (2) ---
  evt_autumn_harvest_bounty: {
    title: 'Bountiful Autumn Harvest',
    body: 'The harvest has exceeded all expectations. Granaries are overflowing, and farmers report yields significantly above average. The surplus presents a welcome opportunity — the question is how best to use it before it spoils or loses value.',
    choices: {
      stockpile_surplus: 'Stockpile the Surplus',
      export_for_profit: 'Export for Profit',
      distribute_to_poor: 'Distribute to the Poor',
    },
  },
  evt_autumn_bandit_raids: {
    title: 'Autumn Bandit Raids',
    body: 'As harvest stores accumulate and days shorten, bandit activity in the rural outskirts has surged. Raiding parties target granaries, merchant wagons, and isolated farms. The common folk demand protection, and the military suggests a show of force.',
    choices: {
      dispatch_patrol_forces: 'Dispatch Patrol Forces',
      arm_rural_militia: 'Arm the Rural Militia',
      increase_road_patrols: 'Increase Road Patrols',
    },
  },

  // --- SEASONAL: Winter (2) ---
  evt_winter_blizzard: {
    title: 'Severe Blizzard Strikes',
    body: 'A devastating blizzard has swept across the kingdom, burying roads in snow and isolating entire communities. Temperatures have plummeted, and the most vulnerable face exposure and starvation if relief does not reach them. The storm shows no sign of abating.',
    choices: {
      open_warming_shelters: 'Open Warming Shelters',
      distribute_fuel_and_blankets: 'Distribute Fuel and Blankets',
      wait_out_the_storm: 'Wait Out the Storm',
    },
  },
  evt_winter_food_shortage: {
    title: 'Winter Food Stores Run Low',
    body: 'The kingdom\'s food reserves are critically low as winter deepens. Rationing has already been informal in many communities, but the situation demands a coordinated royal response. Without intervention, famine conditions will set in before the spring thaw.',
    choices: {
      impose_strict_rationing: 'Impose Strict Rationing',
      purchase_emergency_grain: 'Purchase Emergency Grain',
      request_neighbor_aid: 'Request Neighbor Aid',
    },
  },

  // --- REGIONAL (6) ---
  evt_region_mine_collapse: {
    title: 'Mine Collapse in Resource Region',
    body: 'A major mine collapse has trapped workers and halted extraction in one of the kingdom\'s resource-producing regions. The disaster has shocked the community and disrupted the supply of critical materials. Rescue and recovery operations require immediate decision.',
    choices: {
      launch_rescue_operation: 'Launch Rescue Operation',
      hire_foreign_engineers: 'Hire Foreign Engineers',
      seal_and_rebuild: 'Seal and Begin Rebuilding',
    },
  },
  evt_region_trade_route_disruption: {
    title: 'Trade Route Disrupted',
    body: 'A key trade route through one of the kingdom\'s regions has been disrupted by a combination of deteriorating roads and reports of bandit activity. Merchant caravans are being delayed or rerouted, and commerce in the affected area has slowed significantly.',
    choices: {
      military_escort_caravans: 'Provide Military Escorts',
      negotiate_safe_passage: 'Negotiate Safe Passage',
      reroute_trade: 'Reroute Trade',
    },
  },
  evt_region_local_festival: {
    title: 'Regional Festival Celebrated',
    body: 'A region has organized a traditional local festival celebrating its patron saint and cultural heritage. The event has drawn visitors from neighboring areas and provides an opportunity to strengthen the crown\'s presence in the provinces.',
    choices: {
      send_royal_blessing: 'Send Royal Blessing',
      attend_in_person: 'Attend in Person',
      ignore_the_festivities: 'Ignore the Festivities',
    },
  },
  evt_region_resource_discovery: {
    title: 'New Resource Deposit Discovered',
    body: 'Surveyors have identified a promising new resource deposit in one of the kingdom\'s regions. Preliminary assessment suggests significant extractable wealth, but development will require investment. Several parties express interest in the discovery.',
    choices: {
      fund_extraction: 'Fund Royal Extraction',
      auction_rights: 'Auction Extraction Rights',
      survey_further: 'Commission Further Survey',
    },
  },
  evt_region_infrastructure_decay: {
    title: 'Regional Infrastructure Deteriorating',
    body: 'Years of deferred maintenance have taken their toll on a region\'s roads, bridges, and public buildings. The deterioration is now visible and actively hampering commerce and daily life. Local officials urgently request crown investment in repairs.',
    choices: {
      fund_major_repairs: 'Fund Major Repairs',
      levy_local_labor: 'Levy Local Labor for Repairs',
      defer_maintenance: 'Defer Maintenance Again',
    },
  },
  evt_region_separatist_sentiment: {
    title: 'Separatist Sentiment Grows',
    body: 'A peripheral region, long neglected and suffering from poor conditions, has seen the emergence of open separatist sentiment. Local leaders speak publicly of autonomy, and some have begun collecting their own taxes. The situation demands a response before it becomes a formal rebellion.',
    choices: {
      negotiate_autonomy_terms: 'Negotiate Autonomy Terms',
      dispatch_royal_governor: 'Dispatch a Royal Governor',
      show_of_force: 'Send a Show of Force',
    },
  },

  // --- ESCALATION (6) ---
  evt_escalation_famine_panic: {
    title: 'Famine Panic Grips the Kingdom',
    body: 'With food reserves perilously low and stability crumbling, panic has seized the population. Crowds storm markets and granaries, hoarding has become rampant, and violent confrontations over food are reported daily. The kingdom stands on the brink of collapse.',
    choices: {
      seize_noble_granaries: 'Seize Noble Granaries',
      enforce_martial_rationing: 'Enforce Martial Rationing',
      appeal_for_calm: 'Appeal for Calm',
    },
  },
  evt_escalation_treasury_crisis: {
    title: 'Treasury Crisis Demands Action',
    body: 'The kingdom\'s treasury is nearly empty. Creditors demand payment, military wages are overdue, and essential services face suspension. Without immediate and drastic measures to restore solvency, the crown\'s authority and the kingdom\'s functioning are in jeopardy.',
    choices: {
      emergency_asset_sales: 'Sell Crown Assets',
      demand_noble_contributions: 'Demand Noble Contributions',
      suspend_non_essential_spending: 'Suspend Non-Essential Spending',
    },
  },
  evt_escalation_faith_collapse: {
    title: 'Faith Crisis Threatens the Realm',
    body: 'The kingdom\'s religious unity has shattered. Heterodox movements have gained dominant influence in several regions, the orthodox clergy is demoralized, and the common people are spiritually adrift. Without a decisive response, the social fabric woven by faith will unravel entirely.',
    choices: {
      call_grand_synod: 'Call a Grand Synod',
      impose_state_religion: 'Impose State Religion',
      embrace_pluralism: 'Embrace Religious Pluralism',
    },
  },
  evt_escalation_military_mutiny: {
    title: 'Military Forces Threaten Mutiny',
    body: 'The kingdom\'s armed forces have reached a breaking point. Officers report that soldiers are organizing, refusing orders, and making collective demands. Without immediate concessions or decisive action, the military could turn against the crown itself.',
    choices: {
      meet_mutiny_demands: 'Meet the Demands',
      isolate_ringleaders: 'Isolate the Ringleaders',
      negotiate_with_officers: 'Negotiate Through Officers',
    },
  },
  evt_escalation_noble_conspiracy: {
    title: 'Noble Conspiracy Against the Crown',
    body: 'Intelligence has uncovered a serious conspiracy among the nobility to depose the ruling house. The plotters have financial backing, military contacts, and foreign support. The conspiracy is advanced and the threat is existential. The crown must act decisively.',
    choices: {
      preemptive_arrests: 'Order Preemptive Arrests',
      offer_reconciliation: 'Offer Reconciliation',
      plant_double_agents: 'Plant Double Agents',
    },
  },
  evt_escalation_mass_exodus: {
    title: 'Mass Exodus Threatens the Kingdom',
    body: 'Conditions in the kingdom have deteriorated to the point that significant numbers of commoners are fleeing across the borders. Entire villages are being abandoned, fields left fallow, and the population base — the foundation of all the kingdom\'s systems — is eroding rapidly.',
    choices: {
      promise_sweeping_reforms: 'Promise Sweeping Reforms',
      close_borders: 'Close the Borders',
      let_dissenters_leave: 'Let the Dissenters Leave',
    },
  },

  // ============================================================
  // FOLLOW-UP EVENTS (12)
  // ============================================================

  evt_scholarly_discovery: {
    title: 'Research Yields a Discovery',
    body: 'The scholars whose research the crown funded have produced a genuine breakthrough — a new technique with immediate applications. The discovery has attracted attention from merchants eager to profit, clergy scholars who see theological implications, and military advisors who recognize strategic potential. The crown must decide who benefits.',
    choices: {
      patent_discovery: 'Patent and License the Discovery',
      share_with_clergy: 'Share Findings with the Clergy',
      apply_to_military: 'Direct Application to Military Use',
    },
  },

  evt_practical_innovation_success: {
    title: 'Practical Applications Bear Fruit',
    body: 'The decision to apply scholarly findings to practical ends has produced tangible results. New methods have improved workshop output in the affected region, and word has spread among artisan communities. Several proposals have arrived at court for how to build on this momentum.',
    choices: {
      expand_workshops: 'Expand Regional Workshops',
      train_artisans: 'Sponsor Artisan Training',
      present_to_court: 'Present Achievements at Court',
    },
  },

  evt_merchant_demands_escalate: {
    title: 'Merchants Press for Further Concessions',
    body: 'The tax relief granted to stem the capital flight has stabilized the merchant class, but they now view the crown as amenable to pressure. A delegation of senior guild masters has arrived with a list of further demands, citing the precedent of the earlier concessions. The nobility watches with barely concealed displeasure.',
    choices: {
      hold_firm_on_terms: 'Hold Firm on Current Terms',
      extend_concessions: 'Grant Further Concessions',
      impose_trade_conditions: 'Impose Reciprocal Trade Conditions',
    },
  },

  evt_merchant_underground_economy: {
    title: 'Shadow Economy Emerges',
    body: 'The capital controls imposed to halt merchant flight have produced an unintended consequence: a thriving underground economy. Goods are moving through unofficial channels, customs revenues are declining, and intelligence reports suggest organized smuggling networks are taking root. The crown must decide how to respond to this parallel commerce.',
    choices: {
      raid_smuggling_networks: 'Raid the Smuggling Networks',
      legitimize_shadow_trade: 'Legitimize the Shadow Trade',
      increase_enforcement: 'Increase Border Enforcement',
    },
  },

  evt_noble_backlash_labor: {
    title: 'Nobility Objects to Labor Concessions',
    body: 'The crown\'s decision to side with laborers in the recent dispute has provoked a sharp response from the landed nobility. Several powerful houses have reduced their contributions to the treasury, and rumors circulate of a coordinated effort to reassert aristocratic authority over the working classes. The commoners, meanwhile, look to the crown for continued support.',
    choices: {
      appease_nobles: 'Offer the Nobility Compensation',
      stand_firm: 'Reaffirm Support for Laborers',
      offer_compromise: 'Broker a Compromise',
    },
  },

  evt_commoner_work_slowdown: {
    title: 'Workers Resist Through Slowdown',
    body: 'The enforcement of existing labor contracts has not resolved the underlying grievances. Workers across several industries have begun a coordinated slowdown — not outright refusal, but a deliberate reduction in output. Productivity has dropped noticeably, and merchants are beginning to feel the impact on their supply chains.',
    choices: {
      impose_work_quotas: 'Impose Mandatory Work Quotas',
      open_dialogue: 'Open a Formal Dialogue',
      hire_foreign_labor: 'Recruit Foreign Laborers',
    },
  },

  evt_theological_schism_brewing: {
    title: 'Theological Tensions Reach a Breaking Point',
    body: 'The open debate the crown permitted has not resolved doctrinal disagreements — it has deepened them. Two distinct theological camps have formed, each claiming scriptural authority and accusing the other of heresy. Clergy aligned with each faction are beginning to preach against the other, and the faithful are being forced to choose sides. Without intervention, a formal schism appears inevitable.',
    choices: {
      host_grand_debate: 'Convene a Grand Theological Debate',
      quietly_suppress: 'Quietly Suppress the Dissenting Faction',
      embrace_new_thought: 'Embrace Theological Pluralism',
    },
  },

  evt_intelligence_network_payoff: {
    title: 'Counter-Intelligence Yields Results',
    body: 'The intelligence network established to investigate noble intrigues has uncovered far more than anticipated. A web of secret alliances, hidden debts, and covert communications between powerful houses has been mapped. The information is politically explosive — it could be used to neutralize threats, secure loyalties, or strengthen diplomatic relationships.',
    choices: {
      expose_conspiracy: 'Publicly Expose the Conspiracy',
      leverage_for_loyalty: 'Use Information to Secure Loyalty',
      share_with_allies: 'Share Intelligence with Allies',
    },
  },

  evt_foreign_grain_dependency: {
    title: 'Kingdom Grows Reliant on Foreign Grain',
    body: 'The emergency grain purchases that averted famine have created an uncomfortable dependency. Foreign merchants now supply a significant portion of the kingdom\'s food, and they have begun raising prices. Advisors warn that this reliance leaves the realm vulnerable to supply disruptions, trade disputes, or deliberate economic pressure from neighboring kingdoms.',
    choices: {
      invest_in_domestic_agriculture: 'Invest in Domestic Agriculture',
      negotiate_long_term_supply: 'Negotiate a Long-Term Supply Agreement',
      accept_dependency: 'Accept the Current Arrangement',
    },
  },

  evt_resource_boom: {
    title: 'Resource Extraction Yields a Boom',
    body: 'The crown\'s investment in resource extraction has paid off handsomely. The operation is producing far beyond initial estimates, attracting workers, merchants, and speculators to the region. The local economy is transforming rapidly. Questions arise about who should benefit most from this windfall and whether the boom can be sustained without exploiting the labor force.',
    choices: {
      expand_operations: 'Expand Mining Operations',
      tax_windfall: 'Tax the Windfall Profits',
      establish_workers_rights: 'Establish Worker Protections',
    },
  },

  evt_clergy_healing_reputation: {
    title: 'Clergy Healers Gain Popular Reverence',
    body: 'The clergy mobilized to combat the plague have earned deep gratitude from the common people. Healers are being celebrated as living saints, and demand for permanent healing services has surged. The clergy leadership sees an opportunity to strengthen the faith\'s role in daily life, while some advisors caution against allowing the church to accumulate too much popular influence.',
    choices: {
      establish_permanent_hospice: 'Establish a Permanent Royal Hospice',
      leverage_piety: 'Channel the Piety to Strengthen Faith',
      return_to_normal: 'Allow Things to Settle Naturally',
    },
  },

  evt_military_pay_expectation: {
    title: 'Soldiers Expect Permanent Pay Increase',
    body: 'The temporary pay increase that halted the desertion crisis has created a new expectation. The military rank and file now view the higher wages as their due, and officers report that any attempt to revert to previous rates would trigger immediate unrest. The treasury bears the ongoing burden, and the nobility has begun to question the growing cost of maintaining the armed forces.',
    choices: {
      institutionalize_pay_scale: 'Make the Pay Scale Permanent',
      revert_to_standard_pay: 'Gradually Revert to Standard Rates',
      offer_land_instead: 'Offer Land Grants in Lieu of Pay',
    },
  },

  // ============================================================
  // PATTERN-REACTIVE EVENTS (4)
  // ============================================================
  evt_noble_resentment_merchant_favor: {
    title: 'Noble Resentment',
    body: 'The nobility grows openly resentful of policies perceived to favor the merchant class. Noble houses that once competed for commercial advantage now unite in their grievance, and whispers of coordinated resistance circulate through the court. The crown must address the imbalance before it fractures the ruling coalition.',
    choices: {
      appease_nobility: 'Appease the Nobility',
      maintain_merchant_policies: 'Maintain Merchant Policies',
      mediate_compromise: 'Mediate a Compromise',
    },
  },
  evt_commoner_uprising_neglect: {
    title: 'Commoner Uprising',
    body: 'Neglected and hungry, the common folk have taken to the streets in organized demonstrations that border on open revolt. Market squares have become gathering points for angry crowds, and several royal officials have been driven from their posts. The situation demands an immediate response before order collapses entirely.',
    choices: {
      emergency_food_distribution: 'Distribute Emergency Food',
      deploy_military_patrols: 'Deploy Military Patrols',
      announce_labor_reforms: 'Announce Labor Reforms',
    },
  },
  evt_clergy_power_grab: {
    title: 'Clerical Overreach',
    body: 'Emboldened by their growing influence among the faithful, senior clergy have begun asserting authority beyond their traditional bounds. Religious courts now claim jurisdiction over civil matters, and clerical edicts are being enforced as though they carry the weight of royal decree. The crown\'s temporal authority is being tested.',
    choices: {
      assert_royal_authority: 'Assert Royal Authority',
      negotiate_boundaries: 'Negotiate Clear Boundaries',
      accept_clergy_influence: 'Accept Expanded Influence',
    },
  },
  evt_military_coup_threat: {
    title: 'Conspiracy in the Barracks',
    body: 'Intelligence reports have uncovered a conspiracy among senior military officers to seize power from the crown. The plotters command significant loyalty within the ranks and have secured access to key armories. The conspiracy is well-advanced, and delay will only strengthen their position.',
    choices: {
      purge_conspirators: 'Purge the Conspirators',
      bribe_officer_corps: 'Buy the Officers\' Loyalty',
      address_grievances: 'Address Military Grievances',
    },
  },

  // ============================================================
  // CHAIN: Plague (3)
  // ============================================================
  evt_plague_outbreak: {
    title: 'Plague Strikes',
    body: 'Disease has appeared in the outer districts. Reports describe a swift and virulent illness that overwhelms the afflicted within days. The contagion spreads through close contact, and the crowded conditions of the lower quarters provide fertile ground. Without immediate action, the plague will reach the inner city.',
    choices: {
      immediate_quarantine: 'Impose Immediate Quarantine',
      mobilize_healers: 'Mobilize the Healers',
      pray_for_deliverance: 'Pray for Deliverance',
    },
  },
  evt_plague_spread: {
    title: 'Plague Spreads',
    body: 'The contagion has breached the inner city despite earlier efforts. Merchant houses are shuttered, laborers refuse to work, and the dead accumulate faster than they can be buried. The kingdom\'s economy and social order are buckling under the weight of the pestilence. Drastic measures are now the only options remaining.',
    choices: {
      strict_lockdown: 'Enforce Strict Lockdown',
      burn_infected_quarters: 'Burn the Infected Quarters',
      import_foreign_medicine: 'Import Foreign Medicine',
    },
  },
  evt_plague_aftermath: {
    title: 'Plague\'s End',
    body: 'The worst has passed. The contagion has burned through the population and finally subsided, leaving behind empty homes, grieving communities, and a kingdom forever changed. Recovery will be long, but the survivors look to the crown for direction. How the realm rebuilds will define its character for a generation.',
    choices: {
      rebuild_and_memorialize: 'Rebuild and Memorialize',
      impose_sanitation_laws: 'Impose Sanitation Laws',
      exploit_cheap_labor: 'Exploit the Cheap Labor',
    },
  },

  // ============================================================
  // CHAIN: Trade War (3)
  // ============================================================
  evt_trade_war_tariffs: {
    title: 'Trade Dispute',
    body: 'A neighboring kingdom has imposed harsh new tariffs on goods crossing its borders. The kingdom\'s merchants report significant losses, and trade caravans sit idle at border crossings. The neighbor\'s motives appear to be both economic and political — a calculated provocation that demands a measured response.',
    choices: {
      retaliatory_tariffs: 'Impose Retaliatory Tariffs',
      negotiate_terms: 'Negotiate New Terms',
      absorb_the_costs: 'Absorb the Costs',
    },
  },
  evt_trade_war_escalation: {
    title: 'Trade War Deepens',
    body: 'The trade dispute has escalated beyond tariffs into something resembling economic warfare. Commerce between the two kingdoms has ground to a halt, prices of imported goods have soared, and merchants on both sides suffer. The longer this continues, the deeper the damage to the kingdom\'s prosperity.',
    choices: {
      embargo_neighbor: 'Impose Full Embargo',
      seek_alternative_markets: 'Seek Alternative Markets',
      capitulate: 'Accept Their Terms',
    },
  },
  evt_trade_war_resolution: {
    title: 'Trade Settlement',
    body: 'Both kingdoms have exhausted their appetite for economic conflict. Envoys from the neighboring court have arrived with proposals for resolution, and the kingdom\'s own merchants plead for an end to the disruption. The terms of any settlement will determine the balance of commercial power for years to come.',
    choices: {
      favorable_treaty: 'Press for Favorable Treaty',
      mutual_concessions: 'Offer Mutual Concessions',
      accept_losses: 'Accept the Losses',
    },
  },

  // ============================================================
  // CHAIN: Succession Crisis (3)
  // ============================================================
  evt_succession_question: {
    title: 'The Succession Question',
    body: 'Whispers about the line of succession have begun circulating through the court and beyond. The matter of who will inherit the crown — long considered settled — is now the subject of quiet debate among the nobility. Left unaddressed, the uncertainty will erode confidence in the stability of the realm.',
    choices: {
      declare_heir: 'Declare the Heir Publicly',
      convene_council: 'Convene a Royal Council',
      silence_rumors: 'Silence the Rumors',
    },
  },
  evt_succession_factions: {
    title: 'Factions Emerge',
    body: 'The succession question has fractured the court into rival factions, each rallying behind a different claimant. Noble houses are choosing sides, and the competition for influence has grown fierce. The kingdom\'s stability depends on whether this contest can be managed or whether it will consume the ruling class entirely.',
    choices: {
      back_eldest_claim: 'Back the Eldest Claim',
      support_merit_candidate: 'Support a Merit Candidate',
      play_factions: 'Play the Factions',
    },
  },
  evt_succession_resolution: {
    title: 'Succession Decided',
    body: 'The matter of the succession can no longer be deferred. The factions have hardened, alliances have been struck, and the kingdom demands certainty. The crown must render a final judgment that will either unite the realm behind a recognized heir or leave wounds that fester for a generation.',
    choices: {
      crown_heir_publicly: 'Crown the Heir Publicly',
      exile_rivals: 'Exile Rival Claimants',
      grant_rival_concessions: 'Grant Rivals Concessions',
    },
  },

  // ============================================================
  // CHAIN: Famine (3)
  // ============================================================
  evt_food_shortage_warning: {
    title: 'Stores Run Low',
    body: 'The royal granaries report alarming shortfalls. Winter approaches, and current reserves will not sustain the population through the cold months at present consumption rates. Agricultural assessments confirm that the harvest fell well below expectations. The kingdom must prepare for lean times ahead.',
    choices: {
      impose_strict_rationing: 'Impose Strict Rationing',
      buy_grain_reserves: 'Purchase Grain Reserves',
      reduce_military_rations: 'Reduce Military Rations',
    },
  },
  evt_famine_crisis: {
    title: 'Famine Grips the Kingdom',
    body: 'The food shortage has become a full crisis. People go hungry in the streets, and desperation drives the weakest to beg at the gates of noble estates and church granaries. Reports of food-related violence grow daily. The crown must act decisively or face the complete unraveling of civil order.',
    choices: {
      open_royal_granaries: 'Open the Royal Granaries',
      commandeer_noble_stores: 'Commandeer Noble Stores',
      appeal_to_neighbors: 'Appeal to Neighboring Kingdoms',
    },
  },
  evt_famine_recovery: {
    title: 'The Lean Season Ends',
    body: 'Food has returned to the markets, and the specter of starvation recedes. The kingdom survived, but at great cost — weakened bodies, depleted reserves, and a populace that will not soon forget. The decisions made now will determine whether the realm emerges stronger or merely staggers into the next crisis.',
    choices: {
      invest_in_agriculture: 'Invest in Agriculture',
      establish_grain_reserves: 'Establish Grain Reserves',
      celebrate_survival: 'Celebrate the Survival',
    },
  },

  // ============================================================
  // CHAIN: Religious Schism (3)
  // ============================================================
  evt_doctrinal_dispute: {
    title: 'Doctrinal Disagreement',
    body: 'Scholars within the kingdom\'s religious institutions have fallen into sharp disagreement over matters of doctrine. The dispute, initially confined to seminary halls, has spilled into public sermons and pamphlets. Each side claims the other distorts the true faith. The clergy looks to the crown for guidance before the disagreement hardens into something worse.',
    choices: {
      convene_theological_council: 'Convene Theological Council',
      enforce_orthodox_doctrine: 'Enforce Orthodox Doctrine',
      allow_scholarly_debate: 'Allow Scholarly Debate',
    },
  },
  evt_schism_factions: {
    title: 'Faiths Divide',
    body: 'The doctrinal disagreement has crystallized into opposing factions within the religious establishment. Reformers advocate for new interpretations and broader access to scripture, while traditionalists insist on the authority of established doctrine. Both sides have gathered followers among the common folk, and each demands the crown\'s endorsement.',
    choices: {
      support_reformers: 'Support the Reformers',
      back_traditionalists: 'Back the Traditionalists',
      remain_neutral: 'Remain Neutral',
    },
  },
  evt_schism_resolution: {
    title: 'Religious Settlement',
    body: 'The religious divide has reached a point where resolution — or at least management — is no longer optional. Both factions have entrenched positions, but the strain on the kingdom\'s spiritual cohesion is unsustainable. A path forward exists, though every option carries consequence for the realm\'s faith and unity.',
    choices: {
      declare_unified_doctrine: 'Declare Unified Doctrine',
      formalize_tolerance: 'Formalize Religious Tolerance',
      suppress_dissent: 'Suppress the Dissent',
    },
  },

  // ============================================================
  // ADDITIONAL FOLLOW-UP EVENTS (3)
  // ============================================================
  evt_merchant_permanent_concessions: {
    title: 'Merchants Press Advantage',
    body: 'Emboldened by earlier concessions, the merchant class has organized a formal delegation demanding permanent privileges — tax exemptions, exclusive trade rights, and a seat on the royal council. Their wealth gives them leverage, but granting such demands would fundamentally alter the balance of power among the kingdom\'s classes.',
    choices: {
      grant_permanent_charter: 'Grant Permanent Charter',
      reject_demands: 'Reject Their Demands',
      offer_limited_concession: 'Offer Limited Concession',
    },
  },
  evt_underground_heretical_movement: {
    title: 'Underground Movement',
    body: 'The suppression of heterodox beliefs has driven them underground rather than eliminating them. Intelligence reports describe a growing network of secret gatherings, hidden texts, and coded symbols. The movement draws from the disaffected poor and the intellectually restless alike. It grows stronger in darkness than it ever was in daylight.',
    choices: {
      infiltrate_movement: 'Infiltrate the Movement',
      public_amnesty: 'Declare Public Amnesty',
      double_down_suppression: 'Double Down on Suppression',
    },
  },
  evt_equipment_failure_field: {
    title: 'Equipment Fails in the Field',
    body: 'Neglected arms and deteriorating supply lines have produced the worst possible outcome: critical equipment failures during active operations. Weapons break, armor fails, and soldiers find themselves exposed at the moment of greatest need. The military command demands an immediate accounting and a decision on how to proceed.',
    choices: {
      emergency_field_repair: 'Order Emergency Field Repairs',
      retreat_and_regroup: 'Retreat and Regroup',
      push_through: 'Push Through Regardless',
    },
  },

  // ============================================================
  // HIGH-STAKES STANDALONE (3)
  // ============================================================
  evt_golden_age_opportunity: {
    title: 'A Golden Opportunity',
    body: 'A rare alignment of prosperity and stability has presented the kingdom with an extraordinary opportunity. The treasury is healthy, the people are content, and the realm is at peace. Advisors counsel that this moment — fleeting by nature — should be seized to invest in the kingdom\'s lasting greatness.',
    choices: {
      patron_arts_sciences: 'Patronize Arts and Sciences',
      host_grand_festival: 'Host a Grand Festival',
      invest_in_education: 'Invest in Education',
    },
  },
  evt_assassination_attempt: {
    title: 'The Poisoned Cup',
    body: 'An attempt on the royal life has been narrowly averted. The method — poison concealed in the evening wine — suggests the involvement of someone with intimate access to the court. The kingdom holds its breath as the investigation begins. Trust within the inner circle has been shattered, and the crown must decide how to respond.',
    choices: {
      purge_inner_circle: 'Purge the Inner Circle',
      increase_royal_guard: 'Increase the Royal Guard',
      show_mercy: 'Show Measured Mercy',
    },
  },
  evt_foreign_invasion_rumor: {
    title: 'Armies on the Horizon',
    body: 'Border patrols have reported unusual troop movements in a neighboring kingdom. The scale and direction of the mobilization suggest preparations for an incursion into the realm\'s territory. Whether this is genuine preparation for war or a calculated display of force remains uncertain, but the threat cannot be ignored.',
    choices: {
      mobilize_defenses: 'Mobilize the Defenses',
      dispatch_scouts: 'Dispatch Forward Scouts',
      dismiss_as_rumor: 'Dismiss as Rumor',
    },
  },

  // Phase 6.5 — Faction Request Text
  ...FACTION_REQUEST_TEXT_ENTRIES,
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
      bp_pretender_mid: {
        body: 'The pretender\'s movement has entered a critical phase. Intelligence suggests foreign powers may be providing backing, while the pretender\'s noble supporters grow bolder. The crown must decide how to bring this crisis to a decisive end.',
        choices: {
          expose_foreign_backing: 'Expose Foreign Backing',
          offer_minor_title: 'Offer a Minor Title',
          rally_loyalist_nobles: 'Rally Loyalist Nobles',
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
      bp_prophet_mid: {
        body: 'The prophet\'s movement has grown beyond the frontier into the heartlands. Followers now number in the thousands, and the movement has developed its own rituals and gathering places. The orthodox clergy warns of permanent schism if the matter is not resolved.',
        choices: {
          invite_prophet_to_capital: 'Invite Prophet to Capital',
          integrate_teachings: 'Integrate Key Teachings',
          exile_the_prophet: 'Exile the Prophet',
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
      bp_frozen_march_mid: {
        body: 'The military situation has intensified. The neighboring force has moved into forward positions, and skirmishes along the border have claimed lives on both sides. A full-scale conflict appears increasingly likely unless dramatic action is taken.',
        choices: {
          fortify_mountain_passes: 'Fortify Mountain Passes',
          seek_allied_reinforcements: 'Seek Allied Reinforcements',
          launch_preemptive_strike: 'Launch Preemptive Strike',
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
      bp_merchant_king_mid: {
        body: 'The merchant family\'s ambitions have become undeniable. They have begun financing noble alliances, sponsoring public works, and openly discussing representation at court. The situation demands a definitive resolution before it reshapes the kingdom\'s social order.',
        choices: {
          grant_noble_title: 'Grant a Noble Title',
          seize_merchant_assets: 'Seize Merchant Assets',
          broker_merchant_noble_alliance: 'Broker an Alliance',
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
          send_scout_riders: 'Send Scout Riders',
        },
      },
      bp_expedition_mid: {
        body: 'Word has finally arrived from the frontier. The expedition — or what remains of it — has discovered ruins of extraordinary significance. Ancient texts, artifacts, and architectural remains suggest a civilization of remarkable advancement. The question is whether to invest heavily in excavation or secure what has been found.',
        choices: {
          fund_full_excavation: 'Fund Full Excavation',
          secure_and_document: 'Secure and Document',
          abandon_the_site: 'Abandon the Site',
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
      bp_festival_mid: {
        body: 'Foreign cultural influence has become a permanent feature of the kingdom\'s life. Districts in major towns now have distinct foreign quarters, hybrid art forms are emerging, and the debate over cultural identity has intensified. The crown must decide the long-term direction.',
        choices: {
          establish_cultural_quarter: 'Establish Cultural Quarter',
          host_synthesis_festival: 'Host a Synthesis Festival',
          reassert_traditional_values: 'Reassert Traditional Values',
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

  // --- TradeEcon 2 ---
  sl_merchants_rebellion: {
    title: 'The Merchant\'s Rebellion',
    statusNote: 'An organized merchant guild challenges royal economic authority.',
    branchPoints: {
      bp_rebellion_opening: {
        body: 'The wealthiest merchant houses have formed a united guild, presenting the crown with a formal charter demanding self-governance over trade affairs. Their combined wealth rivals the royal treasury, and their networks control supply lines the kingdom depends upon.',
        choices: {
          negotiate_guild_charter: 'Negotiate a Charter',
          crush_the_guild: 'Crush the Guild',
          co_opt_guild_leaders: 'Co-opt Guild Leaders',
        },
      },
      bp_rebellion_mid: {
        body: 'The merchant guild has consolidated its position. Markets are disrupted, and the guild\'s influence extends into the lower nobility. The crown must decide whether to accommodate their power or break it decisively.',
        choices: {
          grant_trade_monopoly: 'Grant Trade Monopoly',
          impose_royal_oversight: 'Impose Royal Oversight',
          pit_factions_against_each_other: 'Divide the Factions',
        },
      },
      bp_rebellion_resolution: {
        body: 'The question of merchant power has been settled. The relationship between crown and commerce is forever altered by the choices made during this crisis.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Religious 2 ---
  sl_holy_war: {
    title: 'The Holy War',
    statusNote: 'A neighboring kingdom wages religious war against the realm.',
    branchPoints: {
      bp_holy_war_opening: {
        body: 'A neighboring kingdom has declared a holy war, citing the realm\'s tolerance of heretical practices as justification. Their armies gather on the border, their priests preach the righteousness of invasion, and their merchants have already severed trade. The realm must respond.',
        choices: {
          defensive_stance: 'Adopt Defensive Posture',
          launch_counter_crusade: 'Launch a Counter-Crusade',
          seek_diplomatic_peace: 'Seek Diplomatic Peace',
        },
      },
      bp_holy_war_mid: {
        body: 'The holy war has entered a critical phase. Internal dissent grows as refugees stream in from border regions. The clergy demands action, the military seeks direction, and the population grows fearful. A decisive strategy must be chosen.',
        choices: {
          rally_faithful_defenders: 'Rally the Faithful',
          forge_interfaith_alliance: 'Forge Interfaith Alliance',
          scorched_earth_defense: 'Scorched Earth Defense',
        },
      },
      bp_holy_war_resolution: {
        body: 'The holy war has reached its conclusion. The realm\'s faith, borders, and alliances bear the permanent marks of this conflict.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Political 2 ---
  sl_prodigal_prince: {
    title: 'The Prodigal Prince',
    statusNote: 'A long-lost royal heir has returned with foreign backing.',
    branchPoints: {
      bp_prince_opening: {
        body: 'A figure claiming to be the king\'s long-lost brother has arrived at court, backed by a foreign power\'s gold and soldiers. His claim is plausible, his manners courtly, and the commoners are already singing songs about the returned prince. The court is divided.',
        choices: {
          welcome_with_caution: 'Welcome with Caution',
          investigate_claims: 'Investigate the Claims',
          denounce_as_impostor: 'Denounce as Impostor',
        },
      },
      bp_prince_mid: {
        body: 'The prince\'s presence has destabilized the court. Foreign ambassadors press his case, noble factions align behind or against him, and common folk see him as either savior or threat. The crown must resolve this before it tears the kingdom apart.',
        choices: {
          offer_advisory_role: 'Offer an Advisory Role',
          confront_foreign_backers: 'Confront Foreign Backers',
          appeal_to_popular_opinion: 'Appeal to the People',
        },
      },
      bp_prince_resolution: {
        body: 'The matter of the prodigal prince has been decided. The kingdom\'s political landscape is permanently reshaped by these events.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Discovery 2 ---
  sl_plague_ships: {
    title: 'The Plague Ships',
    statusNote: 'Trade ships bring exotic goods and an unknown disease.',
    branchPoints: {
      bp_plague_ships_opening: {
        body: 'A fleet of trade ships has arrived bearing extraordinary cargo — rare spices, foreign texts, and exotic animals. But sailors aboard are gravely ill with an unknown disease. The harbor master awaits orders as the sick multiply and the cargo rots on the docks.',
        choices: {
          quarantine_the_harbor: 'Quarantine the Harbor',
          accept_the_cargo: 'Accept the Cargo',
          burn_the_ships: 'Burn the Ships',
        },
      },
      bp_plague_ships_mid: {
        body: 'The disease has spread beyond the harbor district. Healers work without rest, the clergy offers prayers and remedies, and fear grips the markets. The crown must decide how to manage an outbreak that threatens the kingdom\'s population and economy alike.',
        choices: {
          isolate_and_treat: 'Isolate and Treat',
          distribute_remedies: 'Distribute Remedies Widely',
          sacrifice_the_district: 'Sacrifice the District',
        },
      },
      bp_plague_ships_resolution: {
        body: 'The plague has run its course. The kingdom counts its dead and weighs the costs of the choices that shaped the outcome.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Military 2 ---
  sl_great_tournament: {
    title: 'The Great Tournament',
    statusNote: 'A grand tournament becomes an arena for political maneuvering.',
    branchPoints: {
      bp_tournament_opening: {
        body: 'The crown has agreed to host a grand tournament, drawing knights, diplomats, and merchants from across the realm and beyond. What was intended as a spectacle of martial prowess has become an opportunity for political maneuvering. The court must decide the tournament\'s purpose.',
        choices: {
          diplomatic_showcase: 'Use for Diplomacy',
          military_demonstration: 'Military Showcase',
          cultural_celebration: 'Cultural Celebration',
        },
      },
      bp_tournament_mid: {
        body: 'The tournament is underway and the stakes have risen beyond sport. An incident between rival knights has inflamed old tensions, foreign dignitaries angle for advantage, and the common folk are enthralled. The crown must navigate this volatile moment carefully.',
        choices: {
          exploit_diplomatic_moment: 'Exploit Diplomatic Moment',
          handle_tournament_incident: 'Handle the Incident',
          host_grand_feast: 'Host a Grand Feast',
        },
      },
      bp_tournament_resolution: {
        body: 'The great tournament has concluded. Its legacy — in alliances forged, rivalries deepened, or bonds strengthened — will shape the kingdom\'s standing for seasons to come.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },

  // --- Cultural 2 ---
  sl_starving_winter: {
    title: 'The Starving Winter',
    statusNote: 'A brutal winter threatens the kingdom with widespread famine.',
    branchPoints: {
      bp_winter_opening: {
        body: 'The first snows have come early and heavy. Reports from the provinces describe livestock dying in the fields, roads becoming impassable, and grain stores falling far short of what is needed. The kingdom faces a winter that may test its very survival.',
        choices: {
          ration_harshly: 'Impose Harsh Rationing',
          seek_foreign_aid: 'Seek Foreign Aid',
          sacrifice_military_stores: 'Open Military Stores',
        },
      },
      bp_winter_mid: {
        body: 'The winter deepens. Refugees from outer settlements crowd the cities, the wealthy hoard what remains, and the poor grow desperate. Disease follows hunger. The crown must choose who bears the cost of survival.',
        choices: {
          manage_refugee_crisis: 'Manage the Refugees',
          tax_the_wealthy: 'Tax the Wealthy',
          abandon_outer_settlements: 'Abandon Outer Settlements',
        },
      },
      bp_winter_resolution: {
        body: 'Spring arrives at last. The kingdom has survived, but the scars of the starving winter — in lost lives, broken trust, and depleted reserves — will linger long.',
        choices: {
          conclude_arc: 'Conclude the Matter',
        },
      },
    },
  },
};
