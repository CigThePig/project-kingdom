import type { EventTextEntry } from '../events';

export const CONDITION_EVENT_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Drought
  // ============================================================
  evt_cond_drought_mild: {
    title: 'Dry Winds',
    body: 'The rains have failed for weeks. Wells run lower each day, and the crops show early signs of wilting. Farmers eye the cloudless sky with growing worry. Without relief, the harvest will suffer.',
    choices: {
      ration_water_supplies: 'Ration Water Supplies',
      dig_new_wells: 'Dig New Wells',
    },
  },
  evt_cond_drought_moderate: {
    title: 'Deepening Dry Season in {region}',
    body: '{region} is {condition_context}. Rivers shrink to trickles, livestock grow gaunt, and dust storms scour the cracked fields around {settlement}. The common folk look to the crown for salvation.',
    choices: {
      emergency_irrigation: 'Build Emergency Irrigation',
      import_water: 'Import Water by Caravan',
      pray_for_rain: 'Order Prayers for Rain',
    },
  },
  evt_cond_drought_severe: {
    title: 'The Great Thirst of {region}',
    body: 'The earth of {region} is {condition_context}. Entire villages near {settlement} have been abandoned as their wells ran dry. What little water remains is fought over in the streets. The kingdom faces a crisis of survival.',
    choices: {
      mass_relocation: 'Relocate Inland Settlements',
      seize_merchant_water: 'Seize Merchant Water Reserves',
      endure_the_drought: 'Endure and Hope for Rain',
    },
  },

  // ============================================================
  // Flood
  // ============================================================
  evt_cond_flood_moderate: {
    title: 'Rising Waters in {region}',
    body: 'Relentless rains have swollen the rivers of {region} beyond their banks. Lowland fields are submerged, granaries in the villages around {settlement} are threatened, and the roads have become impassable mud. Action must be taken before the worst arrives.',
    choices: {
      reinforce_levees: 'Reinforce the Levees',
      evacuate_lowlands: 'Evacuate Lowland Settlements',
      let_floodwaters_pass: 'Let the Floodwaters Pass',
    },
  },

  // ============================================================
  // Harsh Winter
  // ============================================================
  evt_cond_harshwinter_moderate: {
    title: 'Bitter Cold Over {region}',
    body: 'A savage winter grips {region}. Blizzards bury the roads of {settlement} under drifts of snow, rivers freeze solid, and the bitter cold claims the lives of those without shelter. Food consumption soars as the populace struggles to stay warm.',
    choices: {
      distribute_firewood: 'Distribute Firewood Reserves',
      open_shelters: 'Open Warm Shelters',
      wait_for_thaw: 'Wait for the Thaw',
    },
  },

  // ============================================================
  // Bountiful Harvest
  // ============================================================
  evt_cond_bountifulharvest_mild: {
    title: 'Bountiful Harvest',
    body: 'The fields overflow with abundance. Favorable weather and fertile soil have produced a harvest beyond all expectation. Granaries strain under the surplus, and the people are jubilant. The question is what to do with such fortune.',
    choices: {
      stockpile_surplus: 'Stockpile the Surplus',
      trade_surplus: 'Trade the Surplus Abroad',
      feast_of_plenty: 'Hold a Feast of Plenty',
    },
  },

  // ============================================================
  // Plague
  // ============================================================
  evt_cond_plague_mild: {
    title: 'Sickness Spreads in {region}',
    body: 'A mysterious illness has taken root in the poorer quarters of {settlement}. Fevers, coughs, and worse symptoms spread from household to household across {region}. The healers are overwhelmed, and fear is growing faster than the disease itself.',
    choices: {
      quarantine_district: 'Quarantine the District',
      hire_healers: 'Hire Additional Healers',
      ignore_sickness: 'Ignore the Sickness',
    },
  },
  evt_cond_plague_moderate: {
    title: 'Pestilence Ravages {region}',
    body: 'The disease has swept through {region}, {condition_context}. Market squares in {settlement} stand empty, churches overflow with the dying, and the stench of sickness hangs over every settlement. The kingdom reels under the weight of the pestilence.',
    choices: {
      citywide_quarantine: 'Enforce Citywide Quarantine',
      burn_infected_quarters: 'Burn the Infected Quarters',
      pray_for_deliverance: 'Pray for Divine Deliverance',
    },
  },
  evt_cond_plague_severe: {
    title: 'The Great Dying of {region}',
    body: 'Death stalks the streets of {settlement} and the hinterlands of {region}, {condition_context}. Villages have been wiped out, trade has ground to a halt, and the living struggle to bury the dead. Panic and despair threaten to tear apart what the pestilence does not claim.',
    choices: {
      seal_the_gates: 'Seal the City Gates',
      mass_exodus: 'Order Mass Exodus to Clean Lands',
      accept_fate: 'Accept Our Fate',
    },
  },
  evt_cond_plague_escalation: {
    title: 'The Sickness Worsens in {region}',
    body: 'Despite all efforts, the pestilence in {region} intensifies. What was once containable has mutated into something far deadlier — {condition_context} — and physicians at {settlement} report new symptoms, higher mortality, and faster transmission. Drastic action may be the only recourse.',
    choices: {
      martial_law: 'Declare Martial Law',
      appeal_to_clergy: 'Appeal to the Clergy for Aid',
    },
  },

  // ============================================================
  // Famine
  // ============================================================
  evt_cond_famine_moderate: {
    title: 'The Hungering of {region}',
    body: 'Hunger has become the constant companion of the common folk in {region}, which is {condition_context}. Granaries are nearly bare, bread prices have soared beyond reach, and desperate families around {settlement} scour the countryside for anything edible. Without intervention, many more will die.',
    choices: {
      emergency_rationing: 'Impose Emergency Rationing',
      import_foreign_grain: 'Import Foreign Grain',
      open_royal_granaries: 'Open the Royal Granaries',
    },
  },

  // ============================================================
  // Condition Resolution
  // ============================================================
  evt_cond_drought_resolved: {
    title: 'The Rains Return',
    body: 'At last, dark clouds gather on the horizon and the blessed rain falls upon the parched earth. Rivers begin to fill, wells recover, and the land slowly drinks its fill. The drought has broken.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },
  evt_cond_plague_resolved: {
    title: 'The Plague Subsides',
    body: 'The death toll has finally begun to decline. New cases grow rarer with each passing day, and cautious hope returns to the streets. The kingdom bears deep scars, but the worst of the pestilence has passed.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },
  evt_cond_flood_resolved: {
    title: 'Floodwaters Recede',
    body: 'The waters have at last retreated, revealing mud-caked fields and damaged buildings. While the cleanup will take time, the immediate danger has passed. The riverside communities can begin to rebuild.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },

  // ============================================================
  // Trade Disruption
  // ============================================================
  evt_cond_trade_disruption_mild: {
    title: 'Trade Slowdown',
    body: 'Caravans grow scarce along the kingdom\'s trade roads, and market stalls that once overflowed with foreign goods now sit empty. Merchants grumble about rising costs and dwindling customers. The slowdown has yet to bite deeply, but left unchecked it will worsen.',
    choices: {
      subsidize_merchants: 'Subsidize Merchant Routes',
      restrict_imports: 'Protect Local Goods',
      wait_it_out: 'Let the Market Correct Itself',
    },
  },
  evt_cond_trade_disruption_moderate: {
    title: 'Trade Disruption',
    body: 'Trade routes have become unreliable. Shipments arrive late or not at all, warehouses run low on essential supplies, and the price of imported goods climbs steeply. The merchant class grows desperate for crown intervention before the situation deteriorates further.',
    choices: {
      emergency_trade_deals: 'Negotiate Emergency Deals',
      military_escorts: 'Escort Caravans with Soldiers',
      accept_losses: 'Accept the Losses',
    },
  },
  evt_cond_trade_disruption_severe: {
    title: 'Commerce Collapse',
    body: 'Trade has ground to a halt across the realm. Merchants flee to more hospitable kingdoms, warehouses stand bare, and entire market districts have shuttered. Without swift and decisive action, the economic lifeblood of the kingdom will drain away entirely.',
    choices: {
      crown_monopoly: 'Crown Takes Over Trade',
      foreign_aid: 'Beg Neighbors for Aid',
      endure: 'Endure the Collapse',
    },
  },

  // ============================================================
  // Market Panic
  // ============================================================
  evt_cond_market_panic_mild: {
    title: 'Market Jitters',
    body: 'Nervous merchants have begun pulling their investments from the kingdom\'s markets. Rumors of instability swirl through the trading houses, and confidence wavers. The decline is still manageable, but fear has a way of becoming its own prophecy.',
    choices: {
      reassure_merchants: 'Issue Public Reassurance',
      price_controls: 'Impose Price Controls',
      let_market_settle: 'Let the Market Settle',
    },
  },
  evt_cond_market_panic_moderate: {
    title: 'Market Panic',
    body: 'Merchants flee the markets in droves, selling their holdings at ruinous prices. Confidence has shattered, and the trading floors echo with shouts of desperation rather than commerce. The crown must act boldly or watch the kingdom\'s wealth evaporate.',
    choices: {
      bailout_merchants: 'Offer a Crown Bailout',
      seize_goods: 'Seize Merchant Assets',
      appeal_to_guilds: 'Appeal to the Guilds',
    },
  },
  evt_cond_market_panic_severe: {
    title: 'Financial Ruin',
    body: 'The markets have collapsed completely. Trading houses are boarded up, the currency is nearly worthless, and riots erupt wherever the desperate gather. The kingdom stands on the brink of total financial ruin, and only the most extreme measures can pull it back.',
    choices: {
      nationalize_trade: 'Nationalize All Trade',
      emergency_decree: 'Issue an Emergency Decree',
      accept_collapse: 'Accept the Collapse',
    },
  },
};
