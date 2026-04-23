import type { EventTextEntry } from '../events';

export const EXPANSION_PUBLIC_ORDER_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Riots in the Market District
  // ============================================================
  evt_exp_po_market_riots: {
    title: 'Riots in the Market District',
    body: 'A dispute over grain prices has erupted into full violence in the central market of {region}. Stalls are overturned, goods looted, and the watch has retreated behind barricades. The disorder spreads with each passing hour, and merchants fear for their livelihoods.',
    choices: {
      deploy_garrison: 'Deploy the Garrison',
      negotiate_with_ringleaders: 'Negotiate with Ringleaders',
      seal_district_gates: 'Seal the District Gates',
    },
  },

  // ============================================================
  // 2. Highway Banditry Surge
  // ============================================================
  evt_exp_po_highway_banditry: {
    title: 'Highway Banditry Surge',
    body: 'Trade caravans along the main roads through {region} report a sharp increase in ambushes. Bandits operate with alarming coordination, striking at dawn and vanishing into the forests. Merchant guilds demand protection or threaten to reroute their traffic entirely.',
    choices: {
      fund_bounty_hunters: 'Fund Bounty Hunters',
      establish_road_garrisons: 'Establish Road Garrisons',
      offer_amnesty_to_bandits: 'Offer Amnesty to Bandits',
    },
  },

  // ============================================================
  // 3. Curfew Debate
  // ============================================================
  evt_exp_po_curfew_debate: {
    title: 'The Curfew Question',
    body: 'Your advisors recommend a curfew to curb the recent disorder after dark. The night watch reports that most violent incidents occur between dusk and dawn. However, merchants and tavern keepers warn that restricting evening hours will strangle commerce.',
    choices: {
      impose_strict_curfew: 'Impose Strict Curfew',
      limited_evening_curfew: 'Limited Evening Curfew',
      reject_curfew: 'Reject the Curfew',
    },
  },

  // ============================================================
  // 4. Crime Wave
  // ============================================================
  evt_exp_po_crime_wave: {
    title: 'A Wave of Lawlessness',
    body: 'Thefts, burglaries, and assaults have surged across the towns of {region}. The city watch is overwhelmed and citizens bolt their doors at nightfall. Your constable warns that without decisive action, lawlessness will become the norm rather than the exception.',
    choices: {
      hire_additional_watchmen: 'Hire Additional Watchmen',
      public_executions: 'Order Public Executions',
      empower_neighborhood_watches: 'Empower Neighborhood Watches',
    },
  },

  // ============================================================
  // 5. Vigilante Justice
  // ============================================================
  evt_exp_po_vigilante_justice: {
    title: 'Vigilantes Take the Law',
    body: 'Frustrated by the crown\'s failure to address rising crime, groups of armed commoners have begun dispensing justice themselves. Several suspected thieves have been beaten in the streets. The nobility views these bands as a threat to lawful authority.',
    choices: {
      arrest_vigilantes: 'Arrest the Vigilantes',
      legitimize_as_militia: 'Legitimize as Town Militia',
      ignore_for_now: 'Ignore for Now',
    },
  },

  // ============================================================
  // 6. Prison Overcrowding
  // ============================================================
  evt_exp_po_prison_overcrowding: {
    title: 'Prisons Bursting at the Seams',
    body: 'The kingdom\'s dungeons and gaols hold three times their intended capacity. Disease festers in the overcrowded cells, and the jailers warn of imminent revolt among the prisoners. A solution must be found before the situation becomes uncontainable.',
    choices: {
      build_new_prison: 'Build a New Prison',
      release_minor_offenders: 'Release Minor Offenders',
      forced_labor_gangs: 'Establish Forced Labor Gangs',
    },
  },

  // ============================================================
  // 7. Tax Resistance Movement
  // ============================================================
  evt_exp_po_tax_resistance: {
    title: 'Tax Resistance Spreads',
    body: 'Entire villages across {region} have barred their gates to the royal tax collectors. Petitions bearing hundreds of marks arrive at court, alleging unjust levies and corrupt assessors. The movement grows bolder each week, and other regions watch to see how the crown responds.',
    choices: {
      send_tax_collectors_with_guards: 'Send Collectors with Guards',
      temporarily_reduce_taxes: 'Temporarily Reduce Taxes',
      address_grievances_at_court: 'Address Grievances at Court',
    },
  },

  // ============================================================
  // 8. Black Market Flourishing
  // ============================================================
  evt_exp_po_black_market: {
    title: 'The Shadow Bazaar',
    body: 'With legitimate goods scarce and prices climbing, an underground market has taken root in the city\'s lower quarters. Stolen wares, smuggled foodstuffs, and untaxed luxuries change hands openly. Some see it as a lifeline; others see it as rot at the kingdom\'s core.',
    choices: {
      raid_black_market: 'Raid the Black Market',
      tax_and_regulate: 'Tax and Regulate It',
      turn_blind_eye: 'Turn a Blind Eye',
    },
  },

  // ============================================================
  // 9. Gang Warfare
  // ============================================================
  evt_exp_po_gang_warfare: {
    title: 'Gang War in the Streets',
    body: 'Two warring gangs have turned the lower districts of {region} into a battlefield. Bodies appear in alleys each morning, and residents cower behind locked doors. The violence threatens to engulf entire districts if left unchecked, and the watch alone cannot contain it.',
    choices: {
      military_sweep: 'Order a Military Sweep',
      pit_gangs_against_each_other: 'Play the Gangs Against Each Other',
      offer_gang_leaders_positions: 'Offer Gang Leaders Positions',
    },
  },

  // ============================================================
  // 10. Arson Attacks
  // ============================================================
  evt_exp_po_arson_attacks: {
    title: 'Fires in the Night',
    body: 'Several buildings across {region} have been set ablaze under cover of darkness in recent weeks. Whether the work of disgruntled citizens, foreign agents, or simple madness, the fires have destroyed homes and workshops alike. The people demand the crown act before more is lost.',
    choices: {
      form_fire_brigades: 'Form Fire Brigades',
      investigate_arsonists: 'Investigate the Arsonists',
      post_night_sentries: 'Post Night Sentries',
    },
  },

  // ============================================================
  // 11. Public Drunkenness Epidemic
  // ============================================================
  evt_exp_po_drunkenness: {
    title: 'A Kingdom in Its Cups',
    body: 'With granaries well-stocked, the taverns overflow and public drunkenness has become a daily spectacle. Brawls erupt at midday, workers stumble through their duties, and the clergy delivers stern sermons on the sin of excess. Your steward suggests intervention.',
    choices: {
      regulate_taverns: 'Regulate the Taverns',
      clergy_temperance_campaign: 'Launch a Temperance Campaign',
      leave_it_be: 'Leave It Be',
    },
  },

  // ============================================================
  // 12. Refugee Influx
  // ============================================================
  evt_exp_po_refugee_influx: {
    title: 'Refugees at the Gates',
    body: 'Columns of displaced families arrive at the borders of {region}, fleeing conflict in neighboring lands. They bring little more than the clothes on their backs, and their numbers strain the capacity of border towns. Your people are divided between compassion and fear.',
    choices: {
      welcome_and_settle: 'Welcome and Settle Them',
      temporary_camps: 'Establish Temporary Camps',
      close_the_borders: 'Close the Borders',
    },
  },

  // ============================================================
  // 13. Vagrancy Crisis
  // ============================================================
  evt_exp_po_vagrancy: {
    title: 'Vagrants Fill the Streets',
    body: 'The kingdom\'s towns see a growing number of homeless wanderers begging at crossroads and sleeping in doorways. Many are dispossessed farmers or laborers who can find no work. The sight unsettles both merchants and the faithful, who call on the crown for a remedy.',
    choices: {
      establish_poorhouses: 'Establish Poorhouses',
      conscript_vagrants: 'Conscript the Able-Bodied',
      ignore_the_problem: 'Ignore the Problem',
    },
  },

  // ============================================================
  // 14. Labor Strike
  // ============================================================
  evt_exp_po_labor_strike: {
    title: 'The Workers Lay Down Tools',
    body: 'Laborers in the quarries and workshops have ceased all work, demanding higher wages and shorter hours. Major works grind to a halt and the nobility fumes at the disruption. The strikers have elected spokesmen and refuse to budge until the crown answers.',
    choices: {
      grant_wage_increase: 'Grant a Wage Increase',
      break_the_strike: 'Break the Strike by Force',
      replace_with_conscripts: 'Replace with Conscripts',
    },
  },

  // ============================================================
  // 15. Mob Justice
  // ============================================================
  evt_exp_po_mob_justice: {
    title: 'The Mob Passes Judgment',
    body: 'An angry crowd in {region} has seized a suspected murderer from the custody of the watch and threatens to hang him from the city gates. The rule of law teeters on a knife\'s edge. If the crown does not act swiftly, the mob may decide that royal justice is no longer needed.',
    choices: {
      restore_order_by_force: 'Restore Order by Force',
      hold_public_trial: 'Hold a Public Trial',
      let_the_mob_decide: 'Let the Mob Decide',
    },
  },

  // ============================================================
  // 16. Martial Law Debate
  // ============================================================
  evt_exp_po_martial_law: {
    title: 'The Question of Martial Law',
    body: 'With civil order collapsing across {region} and the watch powerless to contain the unrest, your generals urge you to declare martial law. Soldiers would patrol every street and curfew would be absolute. The merchants warn it will kill trade; the commoners fear tyranny.',
    choices: {
      declare_martial_law: 'Declare Martial Law',
      limited_military_patrols: 'Limited Military Patrols',
      trust_civilian_authority: 'Trust Civilian Authority',
    },
  },

  // ============================================================
  // 17. Street Brawling Epidemic
  // ============================================================
  evt_exp_po_street_brawls: {
    title: 'Brawls in Every Quarter',
    body: 'The summer heat has shortened tempers across the kingdom. Street fights break out daily over petty disputes, and the watch spends more time separating combatants than keeping the peace. Your marshal suggests channeling the aggression before someone is killed.',
    choices: {
      increase_watch_patrols: 'Increase Watch Patrols',
      organize_public_games: 'Organize Public Games',
      dismiss_as_rowdiness: 'Dismiss as Rowdiness',
    },
  },

  // ============================================================
  // 18. People's Mood
  // ============================================================
  evt_exp_po_peoples_mood: {
    title: 'The People\'s Mood',
    body: 'Your city watch captain reports on the state of the capital\'s streets. The transition of power has left the common folk uncertain \u2014 not hostile, but watchful. Some neighbourhoods hum with cautious optimism; others nurse old grievances that the change of crown has done nothing to ease. The captain awaits your direction on how to keep the peace during these early days.',
    choices: {
      increase_watch_presence: 'Increase the Watch Presence',
      address_grievances: 'Address the People\'s Grievances',
      take_no_action: 'Take No Special Action',
    },
  },
};
