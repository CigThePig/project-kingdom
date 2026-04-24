import type { EventTextEntry } from '../events';

export const EXPANSION_CHAIN_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // CHAIN 1: Corruption
  // ============================================================
  evt_exp_chain_corruption_discovery: {
    title: 'Whispers of Corruption',
    body: 'A trusted clerk has brought disturbing evidence to the crown — treasury ledgers that do not balance, payments to phantom suppliers, and suspiciously wealthy officials. The rot may go deeper than anyone suspects. The {class_plural} await the crown\'s reply.',
    choices: {
      launch_quiet_investigation: 'Launch a Quiet Investigation',
      confront_suspects_publicly: 'Confront Suspects Publicly',
      turn_a_blind_eye: 'Turn a Blind Eye',
    },
  },
  evt_exp_chain_corruption_investigation: {
    title: 'The Investigation Deepens',
    body: 'The investigation has revealed a network of corruption reaching into the highest levels of the administration. Several noble families are implicated, and the evidence grows more damning by the day. The kingdom holds its breath. The {class_plural} are watching every move of the court.',
    choices: {
      expand_investigation: 'Expand the Investigation',
      offer_amnesty_for_testimony: 'Offer Amnesty for Testimony',
      suppress_findings: 'Suppress the Findings',
    },
  },
  evt_exp_chain_corruption_scandal: {
    title: 'The Great Corruption Scandal',
    body: 'The full scale of the corruption is now undeniable. Fortunes have been stolen from the crown, trust has been shattered, and the people demand justice. How the crown resolves this will define its legacy. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      public_trial_and_punishment: 'Public Trial and Punishment',
      quiet_exile_of_guilty: 'Quiet Exile of the Guilty',
      pardon_in_exchange_for_restitution: 'Pardon for Restitution',
    },
  },

  // ============================================================
  // CHAIN 2: Drought
  // ============================================================
  evt_exp_chain_drought_spring: {
    title: 'Spring Rains Fail to Come',
    body: 'The spring rains have not arrived. Wells are drawing low, streams thin to trickles, and farmers eye the cloudless sky with growing dread. If moisture does not come soon, the planting season will be compromised. The {class_plural} await the crown\'s reply.',
    choices: {
      dig_emergency_wells: 'Dig Emergency Wells',
      pray_for_rain: 'Pray for Rain',
      ration_water_early: 'Begin Rationing Water',
    },
  },
  evt_exp_chain_drought_summer: {
    title: 'The Drought Worsens',
    body: 'Summer has brought no relief. The drought has deepened into crisis as crops wither in the fields and livestock perish at dried-up watering holes. The kingdom faces a stark choice between costly intervention and devastating loss. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      import_water_by_caravan: 'Import Water by Caravan',
      abandon_worst_fields: 'Abandon the Worst Fields',
      endure_and_hope: 'Endure and Hope',
    },
  },
  evt_exp_chain_drought_autumn: {
    title: 'Famine Looms After the Drought',
    body: 'The harvest has failed catastrophically. Granaries stand nearly empty, and the spectre of famine haunts the land. Without dramatic action, the coming winter will claim lives on a scale not seen in generations. Word comes most urgently from {region}.',
    choices: {
      emergency_food_imports: 'Emergency Food Imports',
      strict_rationing: 'Impose Strict Rationing',
      sacrifice_livestock: 'Sacrifice Remaining Livestock',
    },
  },

  // ============================================================
  // CHAIN 3: Border War
  // ============================================================
  evt_exp_chain_border_war_skirmish: {
    title: 'Border Skirmish with Arenthal',
    body: 'Armed clashes have erupted along the Arenthal border. Our soldiers report casualties, and the enemy appears to be probing our defenses. This may be a test of our resolve — or the opening move of something larger. Word comes most urgently from {region}.',
    choices: {
      send_diplomats_immediately: 'Send Diplomats Immediately',
      reinforce_border_garrisons: 'Reinforce Border Garrisons',
      demand_explanation: 'Demand an Explanation',
    },
  },
  evt_exp_chain_border_war_mobilization: {
    title: 'War Preparations Intensify',
    body: 'The situation at the border has deteriorated beyond mere skirmishing. Both sides are mobilizing forces, and war now seems inevitable unless extraordinary measures are taken. The kingdom must decide how far it is willing to go. The {class_plural} are watching every move of the court.',
    choices: {
      full_mobilization: 'Order Full Mobilization',
      defensive_posture: 'Adopt Defensive Posture',
      last_minute_peace_offer: 'Last-Minute Peace Offer',
    },
  },
  evt_exp_chain_border_war_resolution: {
    title: 'The Border Conflict Reaches Its End',
    body: 'After weeks of tension and bloodshed, the border conflict has reached a decisive moment. Both kingdoms are exhausted, and the outcome now hangs on the crown\'s final decision. Peace or further war — the choice is yours. Word comes most urgently from {region}.',
    choices: {
      negotiate_ceasefire: 'Negotiate a Ceasefire',
      press_advantage: 'Press Our Advantage',
      accept_unfavorable_terms: 'Accept Unfavorable Terms',
    },
  },

  // ============================================================
  // CHAIN 4: Reformation
  // ============================================================
  evt_exp_chain_reformation_movement: {
    title: 'Religious Reform Movement Emerges',
    body: 'A group of theologians and minor clergy have begun advocating for sweeping reforms to religious practice. Their ideas challenge established doctrine and have attracted both enthusiastic followers and fierce opponents.',
    choices: {
      engage_with_reformers: 'Engage with the Reformers',
      suppress_the_movement: 'Suppress the Movement',
      observe_from_distance: 'Observe from a Distance',
    },
  },
  evt_exp_chain_reformation_split: {
    title: 'The Clergy Splits',
    body: 'The reform movement has fractured the clergy into bitterly opposed camps. Orthodox priests denounce the reformers as heretics, while reform advocates accuse the establishment of corruption and stagnation. The faithful look to the crown for guidance.',
    choices: {
      mediate_between_factions: 'Mediate Between Factions',
      side_with_orthodox: 'Side with the Orthodox',
      side_with_reformers: 'Side with the Reformers',
    },
  },
  evt_exp_chain_reformation_doctrine: {
    title: 'The Doctrine Question',
    body: 'The religious crisis has come to a head. A formal council of clergy and scholars has convened, and they demand the crown\'s endorsement of a doctrinal position. The decision will reshape the kingdom\'s spiritual identity for generations. Word comes most urgently from {region}.',
    choices: {
      adopt_new_doctrine: 'Adopt the New Doctrine',
      reaffirm_tradition: 'Reaffirm Traditional Doctrine',
      allow_dual_practice: 'Allow Both Traditions',
    },
  },

  // ============================================================
  // CHAIN 5: Guild Revolution
  // ============================================================
  evt_exp_chain_guild_rev_alliance: {
    title: 'Guild Alliance Forms',
    body: 'An unprecedented accord has formed between merchant guilds and commoner labor associations. United by shared grievances against noble privileges, they demand a voice in governance. The nobility watches with alarm. The {class_plural} await the crown\'s reply.',
    choices: {
      meet_with_guild_leaders: 'Meet with Guild Leaders',
      ban_cross_class_meetings: 'Ban Cross-Class Meetings',
      monitor_developments: 'Monitor Developments',
    },
  },
  evt_exp_chain_guild_rev_council: {
    title: 'The Workers\' Council Demands Power',
    body: 'The guild coalition has organized itself into a formal workers\' council, presenting the crown with a charter of demands. They seek permanent representation in governance — a radical break with tradition that the nobility fiercely opposes. The {class_plural} are watching every move of the court.',
    choices: {
      grant_council_representation: 'Grant Council Representation',
      arrest_ringleaders: 'Arrest the Ringleaders',
      offer_economic_concessions: 'Offer Economic Concessions',
    },
  },
  evt_exp_chain_guild_rev_shift: {
    title: 'The Power Struggle Climaxes',
    body: 'The conflict between the traditional nobility and the rising merchant-commoner coalition has reached its breaking point. Streets are tense, trade has slowed, and both sides look to the crown for a final resolution. The kingdom\'s social order hangs in the balance. Word comes most urgently from {region}.',
    choices: {
      embrace_new_order: 'Embrace the New Order',
      crush_the_movement: 'Crush the Movement',
      negotiate_compromise: 'Negotiate a Compromise',
    },
  },

  // ============================================================
  // CHAIN 6: Renaissance
  // ============================================================
  evt_exp_chain_renaissance_spark: {
    title: 'Spark of Intellectual Revival',
    body: 'A circle of scholars has produced a remarkable body of work — treatises on natural philosophy, translations of ancient texts, and innovative approaches to agriculture and medicine. The kingdom stands at the threshold of an intellectual awakening. The {class_plural} await the crown\'s reply.',
    choices: {
      fund_the_scholars: 'Fund the Scholars',
      encourage_but_dont_fund: 'Encourage Without Funding',
    },
  },
  evt_exp_chain_renaissance_flowering: {
    title: 'Cultural Flowering Spreads',
    body: 'The intellectual spark has caught fire. Artists, architects, and thinkers flock to the kingdom, and a sense of creative energy pervades the cities. The question now is whether to invest heavily in this flowering or let it develop at its own pace.',
    choices: {
      commission_grand_works: 'Commission Grand Works',
      open_public_academies: 'Open Public Academies',
      let_culture_grow_naturally: 'Let Culture Grow Naturally',
    },
  },
  evt_exp_chain_renaissance_golden: {
    title: 'On the Threshold of a Golden Age',
    body: 'The kingdom\'s cultural renaissance has reached its zenith. Masterworks of art and scholarship emerge daily, foreign courts send envoys to study our achievements, and the people swell with pride. This is a moment that could define an era.',
    choices: {
      declare_golden_age: 'Declare a Golden Age',
      channel_into_practical_arts: 'Channel into Practical Arts',
      maintain_current_course: 'Maintain Current Course',
    },
  },

  // ============================================================
  // CHAIN 7: Spy War
  // ============================================================
  evt_exp_chain_spy_war_discovery: {
    title: 'Enemy Spy Ring Uncovered',
    body: 'Our counter-intelligence operatives have identified a sophisticated foreign spy ring operating within the kingdom. The network has been gathering military secrets and cultivating informants among the court. We must decide how to respond.',
    choices: {
      dismantle_enemy_network: 'Dismantle the Network',
      feed_false_intelligence: 'Feed False Intelligence',
      observe_and_learn: 'Observe and Learn',
    },
  },
  evt_exp_chain_spy_war_double_agent: {
    title: 'The Double Agent Opportunity',
    body: 'A member of the enemy spy ring has approached our agents with an offer to defect. The intelligence they could provide is invaluable, but the risk of a counter-deception is significant. Trust is the most dangerous currency in espionage.',
    choices: {
      recruit_double_agent: 'Recruit the Double Agent',
      expose_the_agent: 'Expose the Agent Publicly',
      eliminate_the_threat: 'Eliminate the Threat Quietly',
    },
  },
  evt_exp_chain_spy_war_resolution: {
    title: 'The Intelligence War Concludes',
    body: 'The shadow conflict with the foreign intelligence service has reached its climax. Our agents are positioned to strike a decisive blow — or to negotiate a mutual stand-down. The outcome will shape the balance of secrets for years.',
    choices: {
      triumphant_intelligence_coup: 'Execute an Intelligence Coup',
      negotiate_intelligence_truce: 'Negotiate an Intelligence Truce',
      cut_losses_and_rebuild: 'Cut Losses and Rebuild',
    },
  },

  // ============================================================
  // CHAIN 8: Regional Rebellion
  // ============================================================
  evt_exp_chain_rebellion_unrest: {
    title: 'Provincial Unrest Grows',
    body: 'Reports from the provinces indicate growing discontent. Local leaders complain of neglect, overtaxation, and the capital\'s indifference to regional concerns. The unrest has not yet turned violent, but the trajectory is troubling. The {class_plural} await the crown\'s reply.',
    choices: {
      send_governor_to_negotiate: 'Send a Governor to Negotiate',
      deploy_peacekeeping_force: 'Deploy a Peacekeeping Force',
      ignore_provincial_grumbling: 'Ignore the Grumbling',
    },
  },
  evt_exp_chain_rebellion_separatist: {
    title: 'Separatist Movement Emerges',
    body: 'Provincial discontent has crystallized into an organized separatist movement. Local leaders have formed a council of their own and are collecting taxes independently. If the crown does not act decisively, the movement will only grow stronger. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      grant_limited_autonomy: 'Grant Limited Autonomy',
      martial_law_in_province: 'Impose Martial Law',
      promise_reforms: 'Promise Future Reforms',
    },
  },
  evt_exp_chain_rebellion_crisis: {
    title: 'The Provincial Crisis',
    body: 'The separatist province has declared itself autonomous and is raising its own militia. Trade with the rest of the kingdom has been severed, and neighboring provinces watch to see whether rebellion will be rewarded or crushed. The crown must act now. Word comes most urgently from {region}.',
    choices: {
      military_suppression: 'Military Suppression',
      federal_compromise: 'Offer a Federal Compromise',
      let_province_secede: 'Allow Secession',
    },
  },
};
