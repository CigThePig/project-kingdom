// ============================================================
// Event & Storyline Display Text
// ============================================================
// Every EventDefinition.id in events/index.ts must have a matching key in EVENT_TEXT.
// Every StorylineDefinition.id must have a matching key in STORYLINE_TEXT,
// with entries for every branchId and every choiceId.

import { FACTION_REQUEST_TEXT as FACTION_REQUEST_TEXT_ENTRIES } from './faction-requests';
import { EXPANSION_ECONOMY_TEXT } from './expansion/economy-text';
import { EXPANSION_FOOD_TEXT } from './expansion/food-text';
import { EXPANSION_MILITARY_TEXT } from './expansion/military-text';
import { EXPANSION_DIPLOMACY_TEXT } from './expansion/diplomacy-text';
import { EXPANSION_ENVIRONMENT_TEXT } from './expansion/environment-text';
import { EXPANSION_PUBLIC_ORDER_TEXT } from './expansion/public-order-text';
import { EXPANSION_RELIGION_TEXT } from './expansion/religion-text';
import { EXPANSION_CULTURE_TEXT } from './expansion/culture-text';
import { EXPANSION_ESPIONAGE_TEXT } from './expansion/espionage-text';
import { EXPANSION_KNOWLEDGE_TEXT } from './expansion/knowledge-text';
import { EXPANSION_CLASS_CONFLICT_TEXT } from './expansion/class-conflict-text';
import { EXPANSION_REGION_TEXT } from './expansion/region-text';
import { EXPANSION_KINGDOM_TEXT } from './expansion/kingdom-text';
import { EXPANSION_CHAIN_TEXT } from './expansion/chain-text';
import { EXPANSION_FOLLOWUP_TEXT } from './expansion/followup-text';
import { CONDITION_EVENT_TEXT } from './expansion/condition-text';
import { SOCIAL_CONDITION_EVENT_TEXT } from './expansion/social-condition-text';
import { POPULATION_EVENT_TEXT } from './expansion/population-text';
import { EXPANSION_STORYLINE_TEXT } from './expansion/storyline-text';
import {
  EXPANSION_WAVE_2_CRISIS_TEXT,
  EXPANSION_WAVE_2_PETITION_TEXT,
} from './expansion/wave-2-text';

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
    body: 'With food reserves comfortably stocked, the common folk have organized a harvest celebration across several townships. The festivities have improved spirits and strengthened communal bonds.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },
  evt_abundant_harvest_surplus: {
    title: 'Bountiful Harvest Surplus',
    body: 'The fields have yielded beyond all expectations this season. Granaries are approaching capacity, and the kingdom\'s agricultural advisors present several options for making the most of this rare abundance before the surplus spoils.',
    choices: {
      invest_in_granary_expansion: 'Expand Granary Capacity',
      organize_food_trade_caravans: 'Organize Trade Caravans',
      celebrate_abundance: 'Celebrate the Bounty',
    },
  },
  evt_agricultural_innovation: {
    title: 'A Farmer\'s Discovery',
    body: 'Word has reached the court of a remarkable development: experienced farmers in the eastern provinces have developed new cultivation techniques that dramatically improve crop yields. Their methods show great promise but require investment to spread throughout the kingdom.',
    choices: {
      implement_across_kingdom: 'Implement Kingdom-Wide',
      trial_in_one_region: 'Trial in One Region',
      document_for_scholars: 'Document for Scholars',
    },
  },
  evt_autumn_stockpile_opportunity: {
    title: 'Preparing for Winter',
    body: 'Autumn markets are flush with grain and preserved goods as the harvest winds down. With winter approaching, the royal steward advises that this may be the last opportunity to bolster food reserves before the lean months set in.',
    choices: {
      purchase_winter_grain_reserves: 'Purchase Winter Reserves',
      organize_community_preserving: 'Organize Community Preserving',
      trust_existing_stores: 'Trust Existing Stores',
    },
  },
  evt_foreign_grain_offer: {
    title: 'Foreign Grain Merchants Arrive',
    body: "A delegation of merchants from {neighbor} has arrived at court with an enticing offer from {ruler_full}: surplus grain at favorable prices. They hint at the possibility of establishing a longer-term supply arrangement, though some advisors caution against dependency on foreign food sources.",
    choices: {
      accept_bulk_purchase: 'Accept Bulk Purchase',
      negotiate_ongoing_supply: 'Negotiate Ongoing Supply',
      decline_offer: 'Decline the Offer',
    },
  },
  evt_military_foraging_campaign: {
    title: 'Soldiers Seek Provisions',
    body: 'With food reserves under strain, military commanders have approached the throne with proposals to supplement their rations. They suggest several approaches, each with different implications for the army\'s readiness and the kingdom\'s relations with its borderland communities.',
    choices: {
      organize_military_hunts: 'Organize Military Hunts',
      forage_borderlands: 'Forage the Borderlands',
      reduce_military_rations: 'Reduce Military Rations',
    },
  },
  evt_spring_planting_expansion: {
    title: 'Spring Planting Expansion',
    body: 'The spring thaw has revealed fertile stretches of uncultivated land, and favorable weather forecasts have emboldened the kingdom\'s farmers. With adequate investment, the agricultural advisors believe this season could see a meaningful expansion of the kingdom\'s food production capacity.',
    choices: {
      clear_new_farmland: 'Clear New Farmland',
      improve_existing_fields: 'Improve Existing Fields',
      rely_on_current_acreage: 'Rely on Current Acreage',
    },
  },
  evt_commoner_agricultural_petition: {
    title: 'Farmers\' Petition',
    body: 'A delegation of the kingdom\'s most experienced farmers has petitioned the crown with detailed proposals to improve agricultural yields. Their plans range from modest irrigation improvements to ambitious land reclamation projects, all promising to strengthen the kingdom\'s food security.',
    choices: {
      fund_peasant_proposals: 'Fund Their Proposals',
      approve_with_oversight: 'Approve with Royal Oversight',
      acknowledge_initiative: 'Acknowledge Their Initiative',
    },
  },
  // --- Food Follow-up Text ---
  evt_granary_expansion_complete: {
    title: 'New Granaries Stand Ready',
    body: 'The granary expansion project has been completed. Sturdy new storage facilities now stand across the kingdom\'s agricultural heartland, greatly increasing the realm\'s capacity to preserve grain through the difficult months ahead.',
    choices: {
      stockpile_for_winter: 'Stockpile for Winter',
      share_with_needy_regions: 'Share with Needy Regions',
    },
  },
  evt_trade_caravan_returns: {
    title: 'Trade Caravans Return',
    body: 'The food trade caravans dispatched earlier have returned successfully. The merchants report brisk business abroad, bringing back both profits and foreign goods that will benefit the kingdom\'s markets and food stores.',
    choices: {
      reinvest_profits: 'Reinvest the Profits',
      distribute_foreign_goods: 'Distribute Foreign Goods',
    },
  },
  evt_supply_agreement_renewal: {
    title: 'Grain Supply Agreement Due',
    body: "The standing grain supply agreement with {neighbor} is approaching its renewal date. {ruler}'s merchants have sent word from {capital} that they are willing to continue the arrangement, though they seek to renegotiate certain terms in their favor.",
    choices: {
      renew_agreement: 'Renew the Agreement',
      renegotiate_terms: 'Renegotiate Terms',
      let_agreement_lapse: 'Let Agreement Lapse',
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
    body: 'An envoy of {ruler_full} has arrived from {capital} bearing proposals for expanded trade agreements. The terms appear favorable, though the nobility bristles at the growing influence of merchant-class wealth that foreign trade enables. Accepting would deepen economic ties and mutual dependency with {neighbor}.',
    choices: {
      accept_trade_terms: 'Accept the Terms',
      propose_modifications: 'Propose Modifications',
      decline_politely: 'Decline Politely',
    },
  },
  evt_border_tension_escalation: {
    title: 'Border Tensions Escalate',
    body: "Incidents along the kingdom's border have intensified. Disputed territorial claims, coupled with provocative military posturing by {ruler_full}, have raised the prospect of open conflict. The court awaits the crown's judgment.",
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
    body: "{spymaster_or_fallback} reports that operatives have identified a suspected agent of {neighbor} operating within the kingdom. The individual appears to be gathering information on military deployments and economic capacity for {ruler}'s court. The intelligence services await orders.",
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
      acknowledge: 'Acknowledge',
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
    body: 'A delegation of merchants from {capital} has arrived at the capital, seeking {ruler}\u2019s leave to establish permanent trading posts within the kingdom. They offer exotic goods and new commercial connections, though their presence would compete with established local traders.',
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
    body: 'The warm months have brought a surge in merchant activity. Trade caravans clog the roads, market towns are bustling, and the treasury benefits from increased tariff revenue. However, commoners complain that the influx of traders drives up prices and disrupts daily commerce. The court considers how best to manage this seasonal boom.',
    choices: {
      host_trade_fair: 'Host a Grand Trade Fair',
      reduce_trade_tariffs: 'Temporarily Reduce Tariffs',
      maintain_current_policy: 'Maintain Current Policy',
    },
  },

  // --- SEASONAL: Autumn (2) ---
  evt_autumn_harvest_bounty: {
    title: 'Bountiful Autumn Harvest',
    body: 'The harvest has exceeded all expectations. Granaries are overflowing, and farmers report yields significantly above average. The surplus presents an opportunity, but every option has its costs — stockpiling removes grain from the market and raises bread prices, exporting enriches traders at commoners\' expense, and distributing freely undermines the commercial order the nobility defends.',
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
  // evt_region_local_festival — removed, reclassified as World Pulse (see tension-audit.ts)
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
    body: "The emergency grain purchases that averted famine have created an uncomfortable dependency. Merchants from {neighbor} now supply a significant portion of the kingdom's food, and they have begun raising prices at {ruler}'s quiet encouragement. {chancellor_or_fallback} warns that this reliance leaves the realm vulnerable to supply disruptions, trade disputes, or deliberate economic pressure.",
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
    body: "{ruler_full} has imposed harsh new tariffs on goods crossing the borders of {neighbor}. The kingdom's merchants report significant losses, and trade caravans sit idle at border crossings. The motives of {dynasty} appear to be both economic and political — a calculated provocation that demands a measured response.",
    choices: {
      retaliatory_tariffs: 'Impose Retaliatory Tariffs',
      negotiate_terms: 'Negotiate New Terms',
      absorb_the_costs: 'Absorb the Costs',
    },
  },
  evt_trade_war_escalation: {
    title: 'Trade War Deepens',
    body: "The trade dispute with {neighbor} has escalated beyond tariffs into something resembling economic warfare. Commerce between {capital} and our markets has ground to a halt, prices of imported goods have soared, and merchants on both sides suffer. The longer this continues, the deeper the damage to the kingdom's prosperity.",
    choices: {
      embargo_neighbor: 'Impose Full Embargo',
      seek_alternative_markets: 'Seek Alternative Markets',
      capitulate: 'Accept Their Terms',
    },
  },
  evt_trade_war_resolution: {
    title: 'Trade Settlement',
    body: "Both kingdoms have exhausted their appetite for economic conflict. Envoys of {ruler_full} have arrived with proposals for resolution, and the kingdom's own merchants plead for an end to the disruption. The terms of any settlement will determine the balance of commercial power between our throne and {dynasty} for years to come.",
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
    body: "{marshal_or_fallback} reports unusual troop movements from {neighbor}. The scale and direction of {ruler}'s mobilization suggest preparations for an incursion into the realm's territory. Whether this is genuine preparation for war or a calculated display of force remains uncertain, but the threat cannot be ignored.",
    choices: {
      mobilize_defenses: 'Mobilize the Defenses',
      dispatch_scouts: 'Dispatch Forward Scouts',
      dismiss_as_rumor: 'Dismiss as Rumor',
    },
  },

  // ============================================================
  // PRODUCTION CHAIN TEXT
  // ============================================================

  // --- Chain 9: Infrastructure Decay ---
  evt_infrastructure_decay_root: {
    title: 'Crumbling Infrastructure',
    body: 'Roads are rutted, bridges groan under their loads, and public works across the kingdom show the scars of deferred maintenance. Engineers warn that without investment soon, critical failures are inevitable. The treasury is thin, but the cost of inaction may be higher.',
    choices: {
      fund_emergency_repairs: 'Fund Emergency Repairs',
      defer_maintenance: 'Defer Maintenance',
    },
  },
  evt_infra_repair_success: {
    title: 'Repairs Completed',
    body: 'The emergency repair program has been completed on schedule. Roads have been resurfaced, weakened bridges reinforced, and the most critical public works restored to serviceable condition. Trade flows more smoothly and the people take notice of the crown\'s investment.',
    choices: {
      acknowledge: 'Acknowledged',
    },
  },
  evt_infra_repair_cost_overrun: {
    title: 'Repair Costs Exceed Estimates',
    body: 'The infrastructure repair project has encountered unexpected complications — rotted foundations, substandard materials from previous contractors, and scope that was underestimated from the start. The engineers request additional funds to complete the work properly, or the crown can cut the project short.',
    choices: {
      approve_additional_funds: 'Approve Additional Funds',
      cut_scope: 'Cut the Scope',
    },
  },
  evt_infra_bridge_collapse: {
    title: 'Bridge Collapse Disrupts Supply Lines',
    body: 'A key bridge on the kingdom\'s primary trade and supply route has collapsed, sending a loaded grain cart into the river below. The failure was entirely predictable — engineers had warned of the deterioration months ago. Food shipments are disrupted, and the crown must act immediately to restore the connection.',
    choices: {
      emergency_rebuild: 'Order Emergency Rebuild',
      reroute_supply_lines: 'Reroute Supply Lines',
      requisition_noble_estates: 'Requisition Noble Estates for Materials',
    },
  },
  evt_infra_road_decay: {
    title: 'Roads Deteriorate Further',
    body: 'Without maintenance funds, the kingdom\'s roads have continued their steady decline. Merchant caravans report longer journey times, broken axles, and increased losses to spoilage. Trade revenue has begun to slip as commerce flows more slowly through the realm.',
    choices: {
      acknowledge: 'Acknowledged',
    },
  },
  evt_infra_commoner_petition: {
    title: 'Commoners Petition for Road Repairs',
    body: 'A delegation of commoners from the outer townships has brought a formal petition to the court. They describe impassable roads, isolated villages cut off from markets, and children unable to reach the nearest school. They ask only for basic repairs — enough to reconnect their communities to the kingdom\'s trade network.',
    choices: {
      grant_road_repairs: 'Grant Road Repairs',
      deny_petition: 'Deny the Petition',
    },
  },

  // --- Chain 1: Grain Crisis ---
  evt_grain_crisis_root: {
    title: 'Grain Crisis',
    body: 'A poor harvest has left the kingdom\'s grain reserves dangerously low. The autumn stores will not last through winter at current consumption rates. Advisors present three paths, each with consequences that will echo long after the immediate hunger is addressed.',
    choices: {
      ration_strictly: 'Impose Strict Rationing',
      import_grain: 'Import Grain at High Cost',
      seize_noble_reserves: 'Seize Noble Estates\' Reserves',
    },
  },
  evt_grain_ration_compliance: {
    title: 'Rationing Holds',
    body: 'The strict rationing program has held. The people tightened their belts, the markets adapted, and the winter stores — though thin — will last. Minor unrest in the early weeks has faded as the population accepted the necessity. The kingdom endures.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_grain_ration_riots: {
    title: 'Riots in the Market District',
    body: 'The rationing has pushed the people past their breaking point. Riots have erupted in the market district — stalls overturned, warehouses broken into, and grain stores looted. The city watch is overwhelmed, and the violence is spreading to neighboring districts.',
    choices: {
      suppress_market_riots: 'Suppress the Riots',
      negotiate_with_rioters: 'Negotiate with the Rioters',
      distribute_reserves: 'Distribute Emergency Reserves',
    },
  },
  evt_grain_ration_black_market: {
    title: 'Black Market Grain Trade',
    body: 'A grey market for grain has emerged under the rationing regime. Merchants with connections sell grain at inflated prices to those who can afford it, while the official ration remains inadequate. A delegation petitions the crown to either legalize the market or shut it down.',
    choices: {
      legalize_grey_market: 'Legalize the Grey Market',
      crack_down_market: 'Crack Down on It',
    },
  },
  evt_grain_import_merchant_leverage: {
    title: 'Import Merchants Demand Concessions',
    body: 'The merchants who supplied the imported grain are pressing their advantage. With the treasury weakened by the purchase, they demand permanent tariff exemptions as the price of continued cooperation. They know the kingdom cannot afford to alienate its grain suppliers.',
    choices: {
      grant_tariff_exemptions: 'Grant Tariff Exemptions',
      refuse_merchant_demands: 'Refuse Their Demands',
      partial_concessions: 'Offer Partial Concessions',
    },
  },
  evt_grain_import_gratitude: {
    title: 'Grain Arrives Safely',
    body: 'The imported grain has arrived in good condition and has been distributed to the kingdom\'s stores. The people are fed, the merchants are paid, and the crisis is averted. The treasury is lighter, but the kingdom\'s food supply is secure for the coming months.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_grain_import_spoiled: {
    title: 'Imported Grain Spoiled',
    body: 'Disaster has struck — nearly half the imported grain was spoiled, either through poor storage during transport or deliberate fraud by the suppliers. The food stores that were meant to see the kingdom through winter are now critically insufficient. The crown must act immediately.',
    choices: {
      demand_replacement: 'Demand Replacement Shipment',
      emergency_local_harvest: 'Emergency Local Harvest',
      distribute_what_remains: 'Distribute What Remains',
    },
  },
  evt_grain_noble_plot: {
    title: 'Nobility Organizes Resistance',
    body: 'The nobility, furious at the seizure of their estate reserves, is organizing a coordinated resistance. Intelligence reports describe secret meetings, the hiring of private guards, and communications with sympathetic nobles in neighboring kingdoms. This is not mere grumbling — it is the beginning of organized defiance.',
    choices: {
      negotiate_concessions: 'Negotiate Concessions',
      arrest_ringleaders: 'Arrest the Ringleaders',
      show_of_force: 'Display of Military Force',
    },
  },
  evt_grain_noble_acceptance: {
    title: 'Nobles Accept the Seizure',
    body: 'The nobility, though aggrieved by the seizure of their reserves, has accepted the necessity. The grain crisis was genuine, the people were hungry, and even the most privileged recognize that a starving kingdom serves no one. The nobles grumble, but they comply.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_grain_noble_concessions_result: {
    title: 'Terms Settled with Nobility',
    body: 'Negotiations with the resistant nobility have concluded. Concessions have been made — tax relief, restoration guarantees, and a formal apology for the seizure. The terms are expensive but have defused the crisis. The nobility accepts, and the kingdom moves forward.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_grain_noble_uprising: {
    title: 'Armed Noble Uprising',
    body: 'The arrests have backfired catastrophically. Loyal noble retainers have taken up arms, and an armed uprising has erupted in the provinces. Fortified estates have become strongholds of resistance, and the kingdom\'s military — already stretched thin — faces an internal war it can ill afford.',
    choices: {
      crush_uprising: 'Crush the Uprising',
      negotiate_surrender: 'Negotiate a Surrender',
      offer_amnesty: 'Offer General Amnesty',
    },
  },
  evt_grain_noble_cowed: {
    title: 'Nobility Falls in Line',
    body: 'The arrests of the ringleaders, backed by visible military strength, have had the desired effect. The remaining nobles have fallen in line, abandoning their resistance and accepting the new reality. The arrests were harsh, but effective — the nobility will not challenge the crown again soon.',
    choices: { acknowledge: 'Acknowledged' },
  },

  // --- Chain 3: Faith Schism ---
  evt_faith_schism_root: {
    title: 'Theological Dispute Erupts',
    body: 'A deep theological dispute has split the kingdom\'s religious institutions. The orthodox clergy demands adherence to traditional doctrine, while a growing reform movement challenges centuries of established teaching. The dispute has moved beyond the temples and into the streets, threatening to tear the kingdom\'s spiritual fabric apart.',
    choices: {
      back_orthodox: 'Back the Orthodox Faction',
      support_reformists: 'Support the Reformists',
      suppress_all_factions: 'Suppress All Factions',
    },
  },
  evt_schism_inquisition: {
    title: 'Orthodox Faction Demands Inquisition',
    body: 'Emboldened by royal support, the orthodox faction has demanded a formal inquisition to root out heterodox beliefs. They seek the authority to investigate, interrogate, and punish those who deviate from established doctrine. The clergy argues this is necessary to preserve spiritual unity; others see it as a dangerous overreach.',
    choices: {
      authorize_inquisition: 'Authorize the Inquisition',
      limit_scope: 'Limit Its Scope',
      refuse_inquisition: 'Refuse the Inquisition',
    },
  },
  evt_schism_orthodox_peace: {
    title: 'Theological Dispute Settles',
    body: 'The theological dispute has settled without further crisis. The orthodox position has been reaffirmed, the reformists have quieted, and the temples have returned to their traditional rhythms. Whether this peace reflects genuine resolution or mere exhaustion remains to be seen.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_schism_orthodox_overreach: {
    title: 'Commoners Complain of Religious Oppression',
    body: 'The orthodox clergy, backed by royal authority, has grown heavy-handed. Common folk report that temple attendance is enforced by social pressure and economic penalty, that minor deviations from doctrine are punished harshly, and that the joy has been drained from religious life. A petition reaches the court.',
    choices: {
      rein_in_clergy: 'Rein In the Clergy',
      support_clergy_authority: 'Support Clergy Authority',
    },
  },
  evt_schism_reform_growth: {
    title: 'Reform Movement Integrates Peacefully',
    body: 'The reform movement has integrated peacefully into the kingdom\'s religious landscape. New interpretations of doctrine have enriched theological discourse, and the reformists have found ways to innovate within the broader tradition rather than against it. The kingdom\'s faith is evolving, not breaking.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_schism_reform_backlash: {
    title: 'Clergy Revolts Against Reforms',
    body: 'The established clergy has revolted against the crown\'s support of the reform movement. Temples have closed their doors in protest, clergy refuse to perform rites, and senior religious figures denounce the reforms from makeshift pulpits in the market squares. The kingdom\'s spiritual infrastructure is in open rebellion.',
    choices: {
      stand_with_reformists: 'Stand with the Reformists',
      appease_clergy: 'Appease the Clergy',
      impose_silence: 'Impose Silence on Both Sides',
    },
  },
  evt_schism_reform_schism_deep: {
    title: 'Two Competing Religious Authorities',
    body: 'The kingdom now has two competing religious authorities — the orthodox hierarchy and a reformist council, each claiming legitimacy, each demanding the crown\'s exclusive recognition. Congregations are split, families are divided, and the question of which doctrine the kingdom officially follows has become unavoidable.',
    choices: {
      recognize_both_authorities: 'Recognize Both Authorities',
      enforce_single_doctrine: 'Enforce a Single Doctrine',
      secularize_state: 'Secularize the State',
    },
  },
  evt_schism_underground_worship: {
    title: 'Underground Worship Cells Discovered',
    body: 'The suppression of all religious factions has driven worship underground. Secret gatherings have been discovered in cellars, barns, and forest clearings. The worshippers come from all classes — commoners, merchants, even minor nobles — united by their refusal to abandon their faith simply because the crown demanded it.',
    choices: {
      tolerate_quietly: 'Tolerate Quietly',
      crack_down: 'Crack Down',
      infiltrate_cells: 'Infiltrate the Cells',
    },
  },
  evt_schism_suppress_calm: {
    title: 'Suppression Succeeds',
    body: 'The suppression of religious factions has worked — at least on the surface. Religious discourse is muted, the factional leaders have dispersed, and the public space is free of theological conflict. The temples are quiet, though whether this represents peace or merely the absence of visible dissent is an open question.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_schism_underground_stable: {
    title: 'An Uneasy Equilibrium',
    body: 'The decision to tolerate underground worship has produced an uneasy equilibrium. The worshippers practice their faith in private, the crown maintains its public stance, and both sides pretend the other does not exist. It is not a solution, but it is stable — a quiet coexistence built on mutual avoidance.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_schism_underground_martyr: {
    title: 'Crackdown Creates a Martyr',
    body: 'The crackdown on underground worship has created a martyr. A charismatic worship leader was killed during the raids, and their death has electrified the underground movement. Songs are sung in their memory, their words are copied and distributed, and what was once a scattered resistance has found its unifying symbol.',
    choices: {
      honor_martyr: 'Honor the Martyr',
      discredit_martyr: 'Discredit the Martyr',
      ignore_martyr: 'Ignore the Matter',
    },
  },

  // --- Chain 5: Plague Outbreak ---
  evt_plague_outbreak_root: {
    title: 'Plague Strikes the Kingdom',
    body: 'Disease has broken out in the densely populated districts. The affliction spreads rapidly through crowded quarters, and the death toll climbs daily. The court\'s physicians warn that without decisive action, the plague will reach every corner of the kingdom. The question is not whether to act, but who will be saved.',
    choices: {
      quarantine_districts: 'Quarantine Affected Districts',
      prioritize_nobility: 'Prioritize Treating the Nobility',
      open_royal_stores: 'Open Royal Stores for All',
    },
  },
  evt_plague_quarantine_holds: {
    title: 'Quarantine Holds',
    body: 'The quarantine has held. The disease was contained within the affected districts, casualties were limited, and the rest of the kingdom was spared the worst. The cost was real — lives lost, livelihoods disrupted — but the containment strategy prevented a far greater catastrophe.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_plague_quarantine_breaks: {
    title: 'Quarantine Collapses',
    body: 'The quarantine has collapsed. Desperate residents broke through the barriers, carrying the disease into previously clean districts. The plague is now spreading unchecked, and the kingdom\'s health infrastructure is overwhelmed. The original containment strategy has failed.',
    choices: {
      military_enforcement: 'Enforce with Military',
      expand_treatment: 'Expand Treatment Centers',
      abandon_quarantine: 'Abandon the Quarantine',
    },
  },
  evt_plague_quarantine_unrest: {
    title: 'Quarantined Districts Demand Compensation',
    body: 'The quarantined districts have suffered disproportionately. Businesses shuttered, wages lost, and families separated by the barriers. A delegation demands compensation for the sacrifices they made so the rest of the kingdom could remain healthy. Their grievance is legitimate.',
    choices: {
      compensate_quarantined: 'Compensate the Districts',
      maintain_quarantine: 'Maintain the Quarantine',
    },
  },
  evt_plague_class_anger: {
    title: 'Class Riots over Treatment',
    body: 'The decision to prioritize noble treatment has ignited fury among the common people. Riots have erupted in multiple districts, with crowds demanding equal access to medicine and physicians. The class divide, always present, has been exposed in the starkest possible terms: who lives and who dies is being decided by birth, not need.',
    choices: {
      extend_treatment_to_all: 'Extend Treatment to All',
      suppress_riots: 'Suppress the Riots',
      public_apology: 'Issue a Public Apology',
    },
  },
  evt_plague_noble_saved: {
    title: 'Nobility Treated Successfully',
    body: 'The noble families have been treated and the disease contained within their estates. The commoners, left largely to their own devices, have endured as they always do — with quiet suffering and long memory. The nobility is grateful; the common people are not.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_plague_noble_spread: {
    title: 'Second Wave Among Commoners',
    body: 'The untreated commoner population has become the breeding ground for a devastating second wave of plague. The disease has mutated in the overcrowded, neglected districts and is now more virulent than before. Population losses are mounting, and the kingdom faces a demographic crisis.',
    choices: {
      emergency_measures: 'Deploy Emergency Measures',
      appeal_for_foreign_aid: 'Appeal for Foreign Aid',
      isolate_and_wait: 'Isolate and Wait It Out',
    },
  },
  evt_plague_recovery: {
    title: 'Kingdom Recovers from Plague',
    body: 'The kingdom has survived the plague, weakened but united. The open stores policy, though devastatingly expensive, saved lives across all classes. The shared suffering has created a sense of solidarity, and the people credit the crown\'s generosity with their survival.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_plague_bankruptcy: {
    title: 'Treasury Depleted by Plague Response',
    body: 'The cost of treating the entire kingdom has emptied the treasury. The plague is receding, but the financial crisis is just beginning. The crown cannot pay its soldiers, maintain its roads, or fund any of the kingdom\'s essential services. Saving lives has bankrupted the realm.',
    choices: {
      emergency_loans: 'Seek Emergency Loans',
      slash_all_spending: 'Slash All Spending',
      levy_crisis_tax: 'Levy a Crisis Tax',
    },
  },
  evt_plague_gratitude: {
    title: 'Commoners Rally to the Crown',
    body: 'The commoners, grateful for the crown\'s sacrifice in opening the royal stores, have rallied to support the kingdom\'s recovery. Volunteer labor forces have organized, donations flow from townships, and a wave of goodwill strengthens the bonds between crown and people.',
    choices: { acknowledge: 'Acknowledged' },
  },

  // --- Chain 2: Border Incursion ---
  evt_border_incursion_root: {
    title: 'Border Incursion',
    body: "Raiders bearing {dynasty}'s colors have crossed the border in force. Villages near the frontier report burned farms, stolen livestock, and displaced families. The incursion is too organized to be mere banditry — this bears the hallmarks of state-sanctioned aggression by {ruler_full}. The court demands a response.",
    choices: {
      retaliate_with_force: 'Retaliate with Force',
      send_diplomatic_envoy: 'Send a Diplomatic Envoy',
      fortify_and_absorb: 'Fortify and Absorb the Losses',
    },
  },
  evt_border_campaign_victory: {
    title: 'Campaign Victory',
    body: "The retaliatory campaign has succeeded. The kingdom's forces drove the raiders back across the border, secured key positions, and extracted a formal apology from {ruler_full}. The victory strengthens the kingdom's reputation and sends a clear message to {dynasty} about the cost of aggression.",
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_border_campaign_stalemate: {
    title: 'Campaign Stalemate',
    body: 'The border campaign has ground to a stalemate. Neither side can achieve a decisive advantage, and the conflict is consuming resources at an unsustainable rate. The generals petition for either a significant commitment of additional resources or permission to withdraw with whatever terms can be salvaged.',
    choices: {
      commit_more_resources: 'Commit More Resources',
      withdraw_forces: 'Withdraw Forces',
    },
  },
  evt_border_campaign_defeat: {
    title: 'Campaign Defeated',
    body: 'The retaliatory campaign has failed catastrophically. The kingdom\'s forces were outmaneuvered and decisively beaten. The enemy is advancing into the kingdom\'s territory, and the remaining defenders are in disarray. The crown faces the gravest military crisis in a generation.',
    choices: {
      rally_defense: 'Rally a Last Defense',
      sue_for_peace: 'Sue for Peace',
      scorched_earth: 'Scorched Earth Retreat',
    },
  },
  evt_border_envoy_success: {
    title: 'Envoy Secures Ceasefire',
    body: "{chamberlain_or_fallback}'s envoy has secured a ceasefire with {ruler_full}. The agreement includes a withdrawal of raiders, compensation for damages, and a commitment to formal border negotiations. Diplomacy has prevailed where force might have failed.",
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_border_envoy_hostage: {
    title: 'Envoy Taken Hostage',
    body: "The diplomatic mission has ended in disaster — the envoy has been taken hostage on {ruler}'s order. Ransom demands have arrived at court from {capital}, and the hostage-takers threaten harm if their conditions are not met. The kingdom's honor and the envoy's life hang in the balance.",
    choices: {
      pay_ransom: 'Pay the Ransom',
      rescue_mission: 'Launch a Rescue Mission',
      abandon_envoy: 'Abandon the Envoy',
    },
  },
  evt_border_envoy_terms: {
    title: 'Unfavorable Peace Terms Offered',
    body: "{ruler_full} has offered peace terms, but they are unfavorable — territorial concessions, trade advantages, and a public acknowledgment of the kingdom's \"provocation.\" The terms are humiliating but would end the immediate crisis and prevent further bloodshed.",
    choices: {
      accept_unfavorable_terms: 'Accept the Terms',
      reject_terms: 'Reject the Terms',
    },
  },
  evt_border_fortify_holds: {
    title: 'Border Fortifications Hold',
    body: 'The decision to fortify and absorb the losses has proven sound. The border defenses held firm, the raids diminished as the fortifications strengthened, and the kingdom weathered the storm without escalation. The losses were real but manageable.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_border_fortify_famine: {
    title: 'Border Losses Trigger Shortages',
    body: 'The damage absorbed during the border incursion has triggered food shortages across the frontier provinces. Burned farms, disrupted supply lines, and displaced farmers have combined to create a growing hunger crisis. The fortification strategy preserved territory but not the people\'s food supply.',
    choices: {
      emergency_food_imports: 'Import Emergency Food Supplies',
      redistribute_reserves: 'Redistribute Existing Reserves',
      enforce_rationing: 'Enforce Rationing',
    },
  },
  evt_border_fortify_resentment: {
    title: 'Border Commoners Demand Compensation',
    body: 'Commoners living near the border have organized a petition demanding compensation for the losses they absorbed while the crown chose a defensive strategy. They bore the brunt of the raids — their farms burned, their livestock stolen — while the capital remained untouched.',
    choices: {
      grant_compensation: 'Grant Compensation',
      deny_compensation: 'Deny Compensation',
    },
  },

  // --- Chain 4: Trade Route Disruption ---
  evt_trade_route_disruption_root: {
    title: 'Trade Route Threatened',
    body: 'A major trade route has come under threat. Reports vary — bandits, a neighbor\'s toll demands, or natural disaster — but the result is the same: merchant caravans are turning back, goods are piling up in warehouses, and the kingdom\'s commercial lifeline is constricting. The court must decide how to restore the flow of trade.',
    choices: {
      send_military_escorts: 'Send Military Escorts',
      negotiate_with_disruptors: 'Negotiate with the Disrupting Party',
      redirect_to_alternate: 'Redirect to Alternate Routes',
    },
  },
  evt_trade_escort_success: {
    title: 'Trade Route Secured',
    body: 'The military escort program has succeeded. The trade route is secure, merchant caravans move freely under armed protection, and commerce has resumed at near-normal levels. The show of force has deterred further disruption, at least for now.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_trade_escort_ambush: {
    title: 'Escort Force Ambushed',
    body: 'The military escort was ambushed on the trade route by a well-organized force. Casualties are significant, goods have been seized, and the survivors report that the attackers had detailed knowledge of the escort\'s route and composition. This was not a random attack — it was planned.',
    choices: {
      send_reinforcements: 'Send Reinforcements',
      negotiate_ransom: 'Negotiate for Return of Goods',
      cut_losses: 'Cut Our Losses',
    },
  },
  evt_trade_escort_expensive: {
    title: 'Merchants Request Escort Subsidies',
    body: 'The military escort program is working, but the costs are mounting. Merchants petition the crown to subsidize the ongoing escort expenses, arguing that the trade route\'s security benefits the entire kingdom. The alternative is ending the program and leaving the route vulnerable again.',
    choices: {
      subsidize_escorts: 'Subsidize Ongoing Escorts',
      end_escort_program: 'End the Escort Program',
    },
  },
  evt_trade_negotiate_deal: {
    title: 'Toll Arrangement Offered',
    body: 'Negotiations with the disrupting party have produced a proposal: a formal toll arrangement. Merchants would pay a fixed fee for safe passage, and the disrupting party would guarantee the route\'s security. It is an unsavory arrangement, but it would restore trade immediately.',
    choices: {
      accept_toll: 'Accept the Toll Arrangement',
      refuse_toll: 'Refuse the Toll',
    },
  },
  evt_trade_negotiate_betrayal: {
    title: 'Negotiation Was a Ruse',
    body: 'The negotiation was a trap. While the kingdom\'s envoys discussed terms in good faith, the disrupting party used the ceasefire to seize a major merchant convoy. The goods are gone, the trust is broken, and the kingdom looks foolish for having trusted those who had no intention of honoring a deal.',
    choices: {
      military_response: 'Launch Military Response',
      demand_compensation: 'Demand Compensation',
      write_off_losses: 'Write Off the Losses',
    },
  },
  evt_trade_negotiate_alliance: {
    title: 'Lasting Trade Arrangement Formed',
    body: 'Against expectations, the negotiation has produced a lasting arrangement. The disrupting party has been brought into the kingdom\'s trade network as a legitimate partner, with mutual obligations and shared profits. What began as a crisis has become an opportunity for expanded commerce.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_trade_redirect_slow_recovery: {
    title: 'Alternate Routes Stabilize',
    body: 'The alternate trade routes have stabilized, though at reduced capacity. Journey times are longer, costs are higher, and some perishable goods simply cannot survive the detour. Trade continues, but the kingdom\'s commerce operates at a fraction of its former efficiency.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_trade_redirect_opportunity: {
    title: 'Investment Opportunity on New Route',
    body: 'A merchant guild proposes investing in the alternate trade route permanently — building proper roads, establishing waypoints, and negotiating with settlements along the new path. The investment is significant, but a successful second route would make the kingdom\'s trade network more resilient.',
    choices: {
      invest_in_new_route: 'Invest in the New Route',
      decline_investment: 'Decline the Investment',
    },
  },

  // --- Chain 6: Military Mutiny ---
  evt_military_mutiny_root: {
    title: 'Military Mutiny',
    body: 'Unpaid and overworked soldiers have begun to organize. The barracks are restless, officers report insubordination, and a delegation of senior sergeants has delivered an ultimatum to the crown: address their grievances or face the consequences. The military, the kingdom\'s shield, is turning inward.',
    choices: {
      pay_back_wages: 'Pay Back Wages Immediately',
      promise_reform: 'Promise Reform',
      execute_ringleaders: 'Execute the Ringleaders',
    },
  },
  evt_mutiny_pay_loyalty: {
    title: 'Soldiers Return to Duty',
    body: 'The payment of back wages has restored discipline and morale. The soldiers have returned to their posts, the officers report normal operations, and the mutiny has ended as quickly as it began. The treasury is lighter, but the kingdom\'s defense is intact.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_mutiny_pay_bankrupt: {
    title: 'Treasury Emptied by Military Pay',
    body: 'The soldiers are paid, but the treasury is empty. The crown cannot meet its other obligations — infrastructure projects halt, court salaries go unpaid, and there is no reserve for emergencies. The kingdom has traded one crisis for another.',
    choices: {
      emergency_taxation: 'Levy Emergency Taxes',
      seize_noble_assets: 'Seize Noble Assets',
      reduce_military_size: 'Reduce Military Size',
    },
  },
  evt_mutiny_reform_trust: {
    title: 'Military Reforms Succeed',
    body: 'The promised reforms have materialized. Pay schedules are regularized, training conditions improved, and a formal grievance process established. The soldiers, seeing their trust rewarded, have returned to full readiness. The military is stronger for having weathered the crisis.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_mutiny_reform_betrayal: {
    title: 'Soldiers March on the Capital',
    body: 'The promised reforms never came. The soldiers, feeling betrayed by empty promises, have mobilized and are marching on the capital. This is no longer a mutiny — it is an insurrection. The crown has hours, not days, to respond before the army reaches the palace gates.',
    choices: {
      meet_soldiers_personally: 'Meet the Soldiers Personally',
      call_loyal_units: 'Call Loyal Units',
      flee_capital: 'Flee the Capital',
    },
  },
  evt_mutiny_reform_desertion: {
    title: 'Desertion Rates Climb',
    body: 'Without visible progress on reform, soldiers are voting with their feet. Desertion rates have climbed steadily, with experienced veterans and skilled specialists among those departing. The army shrinks not through policy but through the quiet exodus of those who have lost faith in the crown\'s word.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_mutiny_execute_fear: {
    title: 'Army Cowed into Compliance',
    body: 'The execution of the mutiny\'s ringleaders has restored discipline through fear. The army is obedient, but the barracks are silent in a way that unsettles the officers. Morale is shattered, and the soldiers serve not from loyalty but from the knowledge of what happens to those who speak up.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_mutiny_execute_revenge: {
    title: 'Fortification Sabotaged',
    body: 'Loyalists of the executed soldiers have struck back with devastating precision. A key fortification on the kingdom\'s border has been sabotaged — walls weakened, supplies contaminated, and defensive positions compromised. The sabotage was an inside job, carried out by soldiers still serving.',
    choices: {
      investigate_sabotage: 'Investigate the Sabotage',
      rebuild_fortification: 'Rebuild the Fortification',
      purge_suspects: 'Purge Suspected Sympathizers',
    },
  },
  evt_mutiny_execute_loyalty_split: {
    title: 'Families Petition for Amnesty',
    body: 'Commoner-born soldiers have organized a petition on behalf of the families of the executed ringleaders. The families face destitution and social ostracism. The petition asks only for basic protections — the right to remain in their homes, to keep their property, to not be punished for the actions of their kin.',
    choices: {
      grant_amnesty_families: 'Grant Amnesty to Families',
      deny_amnesty: 'Deny the Petition',
    },
  },

  // --- Chain 8: Succession Anxiety ---
  evt_succession_anxiety_root: {
    title: 'Succession Rumors Spread',
    body: 'Rumors about the stability of the royal succession have begun circulating through the court and beyond. Different factions are positioning themselves for advantage, and foreign powers are taking notice. The uncertainty is eroding confidence in the kingdom\'s future. The crown must address the question before others answer it.',
    choices: {
      name_heir_publicly: 'Name an Heir Publicly',
      suppress_rumors: 'Suppress the Rumors',
      convene_great_lords: 'Convene the Great Lords',
    },
  },
  evt_succession_heir_accepted: {
    title: 'Succession Settled',
    body: 'The naming of an heir has been accepted across the kingdom. The nobility acknowledges the choice, the people feel reassured, and foreign courts send formal recognition. The question of succession, for now, is answered.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_succession_heir_challenged: {
    title: 'Rival Claimant Emerges',
    body: 'A rival claimant to the succession has emerged from within the nobility, backed by a coalition of discontented lords. The challenger presents a credible genealogical claim and has begun gathering military support. The named heir\'s position is suddenly precarious.',
    choices: {
      discredit_rival: 'Discredit the Rival',
      negotiate_with_rival: 'Negotiate with the Rival',
      imprison_rival: 'Imprison the Rival',
    },
  },
  evt_succession_heir_popular: {
    title: 'Heir Wins Popular Support',
    body: 'The named heir has proven unexpectedly popular with the common people. Public appearances have been well received, and the heir\'s reputation for fairness has spread through the townships. Popular support strengthens the succession and provides a counterweight to noble skepticism.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_succession_whispers: {
    title: 'Suppression Amplifies Rumors',
    body: 'The attempt to suppress succession rumors has backfired spectacularly. The very act of censorship has convinced people that the rumors are true, and underground pamphlets circulate with increasingly wild speculation. The court whispers louder than before, and foreign ambassadors are taking careful notes.',
    choices: {
      crack_down_harder: 'Crack Down Harder',
      address_publicly: 'Address the Matter Publicly',
      redirect_attention: 'Redirect Public Attention',
    },
  },
  evt_succession_suppress_works: {
    title: 'Rumors Die Down',
    body: 'The succession rumors have faded from public discourse. Whether through effective suppression or simple loss of interest, the topic no longer dominates court conversation. The kingdom\'s attention has moved on to more immediate concerns.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_succession_council_agreement: {
    title: 'Lords Agree on Succession',
    body: 'The council of great lords has reached agreement on a succession protocol. After extensive deliberation, a clear line of succession has been established with the support of the major noble houses. The arrangement may not please everyone, but it provides the stability the kingdom needs.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_succession_council_deadlock: {
    title: 'Succession Council Deadlocked',
    body: 'The council of great lords is hopelessly deadlocked. Rival factions have formed around competing candidates, and each session devolves into accusations and threats. The council that was meant to resolve the succession crisis is becoming one itself.',
    choices: {
      force_decision: 'Force a Decision',
      dissolve_council: 'Dissolve the Council',
      extend_deliberations: 'Extend Deliberations',
    },
  },
  evt_succession_council_proposal: {
    title: 'Compromise Candidate Proposed',
    body: 'A senior lord has proposed a compromise candidate for the succession — one with connections to multiple factions and a reputation for moderation. The proposal is imperfect but has the merit of being acceptable to most parties. The crown must decide whether pragmatism outweighs preference.',
    choices: {
      accept_compromise: 'Accept the Compromise',
      reject_compromise: 'Reject the Compromise',
    },
  },

  // --- Chain 11: Commoner Uprising ---
  evt_commoner_uprising_root: {
    title: 'Organized Commoner Resistance',
    body: 'Years of accumulated grievance have crystallized into organized resistance. This is not a riot — it is a movement, with leaders, demands, and growing support across the townships. The commoners have presented a formal list of grievances and warn that their patience has reached its limit.',
    choices: {
      meet_demands: 'Meet Their Demands',
      suppress_by_force: 'Suppress by Force',
      address_root_causes: 'Address Root Causes with Reform',
    },
  },
  evt_uprising_noble_backlash: {
    title: 'Nobility Retaliates',
    body: 'The concessions granted to the commoners have provoked a sharp reaction from the nobility. They view the crown\'s capitulation as a dangerous precedent — rewarding rebellion. Noble houses are withdrawing cooperation, and some are openly questioning whether the crown still serves their interests.',
    choices: {
      appease_nobility: 'Appease the Nobility',
      stand_with_commoners: 'Stand with the Commoners',
      find_compromise: 'Find a Compromise',
    },
  },
  evt_uprising_peace: {
    title: 'Peace Returns',
    body: 'The commoner demands have been met, and the movement has dissolved as peacefully as it formed. Markets reopen, the townships quiet, and a tentative normalcy returns to the kingdom. Whether this peace endures depends on whether the promises made are kept.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_uprising_guerrilla: {
    title: 'Guerrilla Attacks',
    body: 'The suppressed commoner movement has gone underground and turned violent. Supply wagons are ambushed on rural roads, tax collectors are attacked, and noble estates outside the capital face arson. The military struggles to fight an enemy that melts back into the population after each strike.',
    choices: {
      hunt_insurgents: 'Hunt the Insurgents',
      offer_amnesty: 'Offer Amnesty',
      fortify_key_positions: 'Fortify Key Positions',
    },
  },
  evt_uprising_crushed: {
    title: 'Uprising Crushed',
    body: 'The military has crushed the commoner uprising through overwhelming force. The movement\'s leaders are imprisoned or fled, and the townships are quiet — not from contentment, but from fear. The commoners will remember this, and the resentment runs deeper than before.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_uprising_reform_progress: {
    title: 'Reforms Taking Effect',
    body: 'The reforms initiated in response to the commoner uprising are beginning to show results. Working conditions have improved, taxation is more equitable, and the crown\'s investment in public works has created visible changes in the townships. Recovery is slow, but the trajectory is positive.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_uprising_reform_too_slow: {
    title: 'Reform Supporters Demand Faster Action',
    body: 'Those who supported reform over confrontation are growing impatient. The promised changes are proceeding too slowly for those who staked their credibility on the crown\'s good faith. A delegation of reform supporters petitions the crown for accelerated action before the moderates lose control to the radicals.',
    choices: {
      accelerate_reforms: 'Accelerate the Reforms',
      urge_patience: 'Urge Patience',
    },
  },
  evt_uprising_reform_resistance: {
    title: 'Nobility Resists Reforms',
    body: 'The reforms aimed at addressing commoner grievances have met stiff resistance from the nobility. The proposed changes would reduce noble privileges, redistribute resources, and fundamentally alter the feudal compact. The nobility argues that the crown is dismantling the very order that sustains the kingdom.',
    choices: {
      override_nobility: 'Override the Nobility',
      compromise_on_reforms: 'Compromise on Reforms',
      abandon_reforms: 'Abandon Reforms',
    },
  },

  // --- Chain 7: Merchant Guild Power Play ---
  evt_merchant_guild_demands_root: {
    title: 'Merchant Guild Demands Representation',
    body: 'The merchant guild has organized a formal delegation demanding political representation. They seek a permanent seat on the royal council, arguing that those who generate the kingdom\'s wealth deserve a voice in its governance. The nobility views this as an unacceptable challenge to the established order.',
    choices: {
      grant_council_seat: 'Grant a Council Seat',
      offer_tax_concessions: 'Offer Tax Concessions Instead',
      refuse_reassert_authority: 'Refuse and Reassert Authority',
    },
  },
  evt_merchant_council_effective: {
    title: 'Trade Council Produces Results',
    body: 'The merchant council seat has proven to be a wise concession. Trade policy is more informed, commercial disputes are resolved efficiently, and the guild\'s participation has produced measurable improvements in revenue collection. Even some nobles grudgingly acknowledge the arrangement\'s utility.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_merchant_council_overreach: {
    title: 'Nobility Demands Council Dissolution',
    body: 'The merchant council representative has overstepped — proposing trade regulations that directly undermine noble land rights and feudal commerce privileges. The nobility has united in demanding the council seat be dissolved, warning that the traditional order is being eroded from within.',
    choices: {
      dissolve_council: 'Dissolve the Council Seat',
      limit_council_powers: 'Limit Council Powers',
      side_with_merchants: 'Side with the Merchants',
    },
  },
  evt_merchant_council_corruption: {
    title: 'Reports of Council Corruption',
    body: 'Whispers have reached the court that the merchant council representative is using their position to steer contracts to favored guild members. The corruption is not yet public knowledge, but if left unchecked, it threatens to discredit both the council and the crown\'s judgment in creating it.',
    choices: {
      investigate_council: 'Investigate the Council',
      ignore_reports: 'Ignore the Reports',
    },
  },
  evt_merchant_tax_satisfied: {
    title: 'Tax Concessions Accepted',
    body: 'The merchant guild has accepted the tax concessions and withdrawn their demands for political representation. Trade activity has increased as merchants reinvest their savings, and the guild\'s public complaints have ceased. The concessions have bought peace, at least for now.',
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_merchant_tax_shortfall: {
    title: 'Revenue Shortfall from Concessions',
    body: 'The tax concessions granted to the merchant guild have created a significant shortfall in royal revenue. The treasury struggles to meet its obligations, and other groups are beginning to demand similar treatment. The crown must find a way to restore fiscal balance without igniting the conflict it sought to avoid.',
    choices: {
      reverse_concessions: 'Reverse the Concessions',
      raise_taxes_elsewhere: 'Raise Taxes Elsewhere',
      cut_spending: 'Cut Crown Spending',
    },
  },
  evt_merchant_boycott: {
    title: 'Merchant Guild Boycott',
    body: 'In retaliation for the crown\'s refusal, the merchant guild has organized a coordinated trade boycott. Shops close, caravans halt, and market squares stand empty. The economic disruption is significant and growing. The guild is betting that the crown\'s treasury will break before their reserves do.',
    choices: {
      break_boycott_by_force: 'Break the Boycott by Force',
      negotiate_end: 'Negotiate an End',
      wait_out_boycott: 'Wait It Out',
    },
  },
  evt_merchant_grudging_acceptance: {
    title: 'Guild Backs Down',
    body: 'The merchant guild\'s demands have lost momentum. Without sufficient support from other factions, and with their own members divided on the wisdom of confrontation, the guild has quietly withdrawn its formal petition. The matter is settled, though the underlying tensions remain.',
    choices: { acknowledge: 'Acknowledged' },
  },

  // --- Chain 10: Foreign Ambassador ---
  evt_foreign_ambassador_root: {
    title: 'Foreign Ambassador Arrives',
    body: "An ambassador of {ruler_full} has arrived at court bearing a formal proposal from {capital}. {neighbor} offers a partnership — trade agreements, mutual defense, and cultural exchange — but the terms suggest {dynasty} views the kingdom as a junior partner. The court is divided on how to respond.",
    choices: {
      accept_proposal: 'Accept the Proposal',
      counter_propose: 'Counter-Propose',
      reject_outright: 'Reject Outright',
    },
  },
  evt_ambassador_alliance_benefit: {
    title: 'Alliance Bears Fruit',
    body: "The alliance with {neighbor} has begun to yield tangible benefits. Trade routes are more secure, goods flow more freely between {capital} and our markets, and the kingdom's merchants report increased profits from access to new markets. The partnership, whatever its political costs, is proving economically sound.",
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_ambassador_dependency: {
    title: 'Growing Dependency Concerns',
    body: "{chancellor_or_fallback} has raised alarms about the kingdom's growing reliance on {neighbor}. Key imports now flow exclusively through {neighbor_short}'s channels, and {ruler_full} has begun using this leverage to influence domestic policy. The crown must decide whether to renegotiate from a position of weakness or accept the new reality.",
    choices: {
      renegotiate_terms: 'Renegotiate Terms',
      accept_dependency: 'Accept the Arrangement',
    },
  },
  evt_ambassador_counter_accepted: {
    title: 'Counter-Proposal Accepted',
    body: "{ruler_full} has accepted the kingdom's counter-proposal. The revised terms are more favorable — a true partnership of equals, with balanced trade provisions and mutual obligations. Diplomats on both sides express cautious optimism about the new arrangement.",
    choices: { acknowledge: 'Acknowledged' },
  },
  evt_ambassador_counter_rejected: {
    title: 'Counter-Proposal Rejected',
    body: "{ruler_full} has rejected the kingdom's counter-proposal with barely concealed displeasure. The ambassador warns that {dynasty}'s patience is not infinite and that continued resistance will have consequences. The court must decide how to proceed in the face of external pressure.",
    choices: {
      concede_to_terms: 'Concede to Their Terms',
      stand_firm: 'Stand Firm',
      offer_trade_concession: 'Offer Trade Concession',
    },
  },
  evt_ambassador_trade_embargo: {
    title: 'Trade Embargo Imposed',
    body: "{ruler_full} has imposed a formal trade embargo on the kingdom in retaliation for the diplomatic rejection. {neighbor_short}'s merchants have withdrawn, border crossings are restricted, and goods that once flowed freely are now contraband. The economic impact is immediate and severe.",
    choices: {
      seek_alternative_partners: 'Seek Alternative Partners',
      retaliate_economically: 'Retaliate Economically',
      accept_embargo: 'Accept and Endure',
    },
  },
  evt_ambassador_respect: {
    title: 'Rejection Earns Respect',
    body: "The kingdom's firm rejection of the proposal, backed by visible military strength, has earned a grudging respect from {ruler_full}. The ambassador departed with formal courtesy, and intelligence suggests {dynasty} has revised its assessment of the kingdom upward. Sometimes strength speaks louder than diplomacy.",
    choices: { acknowledge: 'Acknowledged' },
  },

  // --- Chain 12: Royal Treasury Audit ---
  evt_treasury_audit_root: {
    title: 'Treasury Irregularities Discovered',
    body: 'A routine audit of the royal treasury has uncovered discrepancies in the accounts — missing entries, unexplained transfers, and records that do not reconcile. The irregularities could indicate simple incompetence or something far more deliberate. The crown must decide how deeply to probe.',
    choices: {
      conduct_full_investigation: 'Conduct Full Investigation',
      accept_report: 'Accept the Report',
    },
  },
  evt_audit_corruption_found: {
    title: 'Corruption Uncovered',
    body: 'The investigation has revealed a network of corruption among senior court officials. Treasury funds were diverted into private accounts through a web of falsified contracts and phantom suppliers. The evidence is damning, and the court awaits the crown\'s judgment on the guilty parties.',
    choices: {
      prosecute_officials: 'Prosecute the Officials',
      demand_restitution: 'Demand Financial Restitution',
      cover_up_findings: 'Bury the Findings',
    },
  },
  evt_audit_clean: {
    title: 'Books Are Clean',
    body: 'After a thorough review, the investigators have concluded that the treasury\'s accounts are in order. The earlier discrepancies were the result of clerical errors, not malfeasance. The kingdom\'s financial administration, while imperfect, is fundamentally sound.',
    choices: {
      acknowledge: 'Acknowledged',
    },
  },
  evt_audit_embezzlement: {
    title: 'Embezzlement Worsens',
    body: 'The irregularities that were dismissed in the earlier audit have metastasized. A significant and ongoing embezzlement operation has been draining the treasury for months. The losses are now substantial enough to threaten the kingdom\'s ability to meet its obligations. Something must be done.',
    choices: {
      launch_crackdown: 'Launch a Crackdown',
      reform_treasury_oversight: 'Reform Treasury Oversight',
      ignore_and_absorb: 'Absorb the Losses',
    },
  },
  evt_audit_whistleblower: {
    title: 'A Clerk Comes Forward',
    body: 'A junior treasury clerk has come forward with detailed evidence of fraud among senior officials — ledgers, correspondence, and witness accounts. The clerk seeks the crown\'s protection in exchange for testimony. Protecting them risks angering the powerful, but silencing them buries the truth.',
    choices: {
      protect_whistleblower: 'Protect the Clerk',
      silence_whistleblower: 'Silence the Clerk',
    },
  },
  evt_audit_quiet: {
    title: 'Irregularities Fade',
    body: 'The treasury irregularities from the earlier audit have not resurfaced. Whether the problems resolved themselves or were quietly smoothed over by those involved, the accounts now appear stable. The matter passes from the court\'s attention without further incident.',
    choices: {
      acknowledge: 'Acknowledged',
    },
  },

  // Phase 6.5 — Faction Request Text
  ...FACTION_REQUEST_TEXT_ENTRIES,

  // Expansion Content Text
  ...EXPANSION_ECONOMY_TEXT,
  ...EXPANSION_FOOD_TEXT,
  ...EXPANSION_MILITARY_TEXT,
  ...EXPANSION_DIPLOMACY_TEXT,
  ...EXPANSION_ENVIRONMENT_TEXT,
  ...EXPANSION_PUBLIC_ORDER_TEXT,
  ...EXPANSION_RELIGION_TEXT,
  ...EXPANSION_CULTURE_TEXT,
  ...EXPANSION_ESPIONAGE_TEXT,
  ...EXPANSION_KNOWLEDGE_TEXT,
  ...EXPANSION_CLASS_CONFLICT_TEXT,
  ...EXPANSION_REGION_TEXT,
  ...EXPANSION_KINGDOM_TEXT,
  ...EXPANSION_CHAIN_TEXT,
  ...EXPANSION_FOLLOWUP_TEXT,
  ...CONDITION_EVENT_TEXT,
  ...SOCIAL_CONDITION_EVENT_TEXT,
  ...POPULATION_EVENT_TEXT,

  // Phase 7 — Wave-2 Expansion Text
  ...EXPANSION_WAVE_2_CRISIS_TEXT,
  ...EXPANSION_WAVE_2_PETITION_TEXT,
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
        body: '{spymaster_or_fallback} confirms that a foreign power has begun massing forces near the border. The mobilization appears deliberate and sustained. Whether this is posturing or preparation for invasion remains unclear, but the realm must prepare.',
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

  // Expansion Storyline Text
  ...EXPANSION_STORYLINE_TEXT,
};
