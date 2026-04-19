import type { EventTextEntry } from '../events';

export const EXPANSION_REGION_TEXT: Record<string, EventTextEntry> = {
  // --- 1. Provincial Autonomy Dispute ---
  evt_exp_reg_autonomy_dispute: {
    title: 'Provincial Demands for Autonomy',
    body: 'The governor of {region} — where the folk are presently {loyalty_tier} under a posture of {posture} — has petitioned the crown for expanded powers of self-governance. Local lords echo the call, citing the particular needs and traditions of their {terrain} reaches. Yielding may preserve peace, yet it risks emboldening others to seek the same.',
    choices: {
      grant_limited_autonomy: 'Grant Limited Autonomy',
      reassert_central_control: 'Reassert Central Control',
      send_mediator: 'Send a Royal Mediator',
    },
  },

  // --- 2. Resource Discovery ---
  evt_exp_reg_resource_discovery: {
    title: 'Discovery in the Provinces',
    body: "Prospectors working {region} have uncovered a deposit of valuable ore beneath its {terrain} ground — welcome news with the treasury in {treasury_tier} condition. The discovery could enrich the crown's coffers or transform the local economy, though the manner of its exploitation will determine who benefits and at what cost to the land.",
    choices: {
      crown_extraction: 'Claim for Crown Extraction',
      local_development: 'Support Local Development',
      survey_further: 'Commission Further Surveys',
    },
  },

  // --- 3. Trade Route Disruption ---
  evt_exp_reg_trade_disruption: {
    title: 'Trade Routes Under Threat',
    body: 'Merchants report that a vital trade route passing through {region} has become perilous — the {terrain} country there is under {posture} posture and the locals are {loyalty_tier}. Bandits — or perhaps agents of a foreign power — have been seizing caravans with alarming regularity. Commerce through the affected lands has slowed to a trickle.',
    choices: {
      military_escort: 'Deploy Military Escorts',
      negotiate_safe_passage: 'Negotiate Safe Passage',
      reroute_trade: 'Reroute Through Alternate Paths',
    },
  },

  // --- 4. Infrastructure Proposal ---
  evt_exp_reg_infrastructure_proposal: {
    title: 'Provincial Infrastructure Petition',
    body: "Leaders of {region} have submitted detailed proposals for infrastructure improvements, citing the strain that population growth places upon existing roads and markets across the {terrain} country. The investment would be substantial — with the treasury only in {treasury_tier} condition, {chancellor_or_fallback} counsels care — but the potential returns are not inconsiderable.",
    choices: {
      fund_road_network: 'Fund a New Road Network',
      build_regional_market: 'Build a Regional Market',
      defer_construction: 'Defer Construction for Now',
    },
  },

  // --- 5. Regional Festival ---
  evt_exp_reg_festival: {
    title: 'A Provincial Harvest Festival',
    body: 'The folk of {region} have organized an elaborate {season} celebration that has drawn attention across the realm. The local population — presently {loyalty_tier} under a posture of {posture} — looks to the crown for recognition, and your response will be taken as a measure of royal regard for the provinces.',
    choices: {
      royal_patronage: 'Extend Royal Patronage',
      attend_personally: 'Attend in Person',
      send_regards: 'Send Royal Regards',
    },
  },

  // --- 6. Provincial Governor Corruption ---
  evt_exp_reg_governor_corruption: {
    title: 'A Governor\'s Misrule',
    body: "Petitions from the common folk of {region} — where loyalty has slipped to {loyalty_tier} — paint a damning portrait of their governor's administration. Taxes collected never reach the crown's coffers, justice is sold to the highest bidder, and the governor's personal estates swell while the province withers.",
    choices: {
      remove_governor: 'Remove the Governor from Office',
      demand_restitution: 'Demand Restitution of Funds',
      issue_warning: 'Issue a Formal Warning',
    },
  },

  // --- 7. Border Province Tensions ---
  evt_exp_reg_border_tensions: {
    title: 'Unrest in the Border Provinces',
    body: '{region}, presently {loyalty_tier} under a posture of {posture}, has grown anxious as the borders thicken with rumor. Tales of foreign troop movements and diplomatic insults have reached the populace, and {marshal_or_fallback} reports that the garrison\'s morale is {morale_tier} without visible crown support. The border folk demand assurance.',
    choices: {
      fortify_border: 'Fortify the Border Defenses',
      diplomatic_reassurance: 'Pursue Diplomatic Reassurance',
      increase_patrols: 'Increase Border Patrols',
    },
  },

  // --- 8. Regional Specialization ---
  evt_exp_reg_specialization: {
    title: 'A Province Seeks Its Purpose',
    body: "{region} has the potential to develop a distinct economic identity, but its leaders seek the crown's guidance on which path to pursue. Artisans and merchants of the {terrain} country vie for royal favor, each arguing their craft would bring the greatest prosperity.",
    choices: {
      encourage_artisan_quarter: 'Encourage an Artisan Quarter',
      develop_agricultural_hub: 'Develop an Agricultural Hub',
      let_market_decide: 'Let the Market Decide',
    },
  },

  // --- 9. Local Hero Emerges ---
  evt_exp_reg_local_hero: {
    title: 'A Hero of the Provinces',
    body: 'Word reaches the capital of a commoner who has performed a remarkable deed in {region} — rescuing travelers from brigands, or perhaps organizing flood defenses that saved an entire village. The people celebrate this figure, and the court must decide how to respond.',
    choices: {
      honor_at_court: 'Honor Them at Court',
      appoint_local_office: 'Appoint to Local Office',
      acknowledge_from_afar: 'Acknowledge from Afar',
    },
  },

  // --- 10. Provincial Development Rivalry ---
  evt_exp_reg_development_rivalry: {
    title: 'Rivalry Between the Provinces',
    body: 'Two provinces have submitted competing petitions for crown investment, each claiming greater strategic importance and more pressing need. The rivalry has taken on a bitter edge, with provincial lords publicly disparaging their counterparts. Favoritism risks deepening the divide.',
    choices: {
      favor_petitioning_province: 'Favor the Petitioning Province',
      distribute_equally: 'Distribute Resources Equally',
      encourage_competition: 'Encourage Productive Competition',
    },
  },

  // --- 11. Loyalty Warning ---
  evt_exp_reg_loyalty_warning: {
    title: 'Discontent in the Provinces',
    body: "Reports from {region} paint a troubling picture: the local populace — now {loyalty_tier} under {posture} — speaks openly of the crown's neglect, and the loyalty of provincial leaders wavers. Taxes are collected grudgingly, royal decrees are met with foot-dragging, and the governor warns that patience is wearing thin.",
    choices: {
      send_envoy: 'Send a Royal Envoy',
      increase_investment: 'Increase Provincial Investment',
      ignore_complaints: 'Ignore the Complaints',
    },
  },

  // --- 12. Separatist Threat ---
  evt_exp_reg_separatist_threat: {
    title: 'Separatist Rumblings',
    body: "{region} has crossed from mere discontent into dangerous territory — loyalty there stands at {loyalty_tier}, and the current posture of {posture} has done nothing to arrest the slide. Local lords and influential merchants openly discuss breaking away from the kingdom, and separatist pamphlets circulate in the markets. The provincial garrison's loyalty is uncertain, and delay may embolden the movement further.",
    choices: {
      negotiate_concessions: 'Negotiate Concessions',
      military_presence: 'Establish Military Presence',
      grant_autonomy: 'Grant Regional Autonomy',
    },
  },

  // --- 11. Royal Tour ---
  evt_exp_reg_royal_tour: {
    title: 'A Tour of the Realm',
    body: 'Your advisors suggest that a newly crowned sovereign should be seen by the people. A procession through the provinces would let you observe conditions firsthand \u2014 the state of roads and bridges, the health of the harvest, the mood of the common folk. The local lords prepare their finest hospitality, but the people themselves watch with a harder question in their eyes: what manner of ruler have they gained?',
    choices: {
      invest_in_local_projects: 'Invest in Local Projects',
      hold_open_audience: 'Hold an Open Audience',
      observe_and_depart: 'Observe and Depart',
    },
  },
};
