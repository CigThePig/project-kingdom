import type { EventTextEntry } from '../events';

export const EXPANSION_ENVIRONMENT_TEXT: Record<string, EventTextEntry> = {
  evt_exp_env_spring_thaw_floods: {
    title: 'Spring Thaw Flooding',
    body: 'The winter snows have melted with unusual speed, swelling rivers beyond their banks. Lowland settlements report rising waters threatening homes and stored grain. The crown must decide how to respond before the flood peaks.',
    choices: {
      build_emergency_levees: 'Build Emergency Levees',
      evacuate_lowlands: 'Evacuate the Lowlands',
      let_waters_recede: 'Let the Waters Recede Naturally',
    },
  },
  evt_exp_env_mild_winter_blessing: {
    title: 'A Mild Winter',
    body: 'This winter has been remarkably gentle. Frost has been light, livestock losses are minimal, and the ground may thaw early enough to extend the coming planting season. The kingdom could capitalize on this rare fortune.',
    choices: {
      extend_planting_season: 'Prepare Early Planting',
      enjoy_the_respite: 'Enjoy the Respite',
    },
  },
  evt_exp_env_new_spring_growth: {
    title: 'Vigorous Spring Growth',
    body: 'An unusually warm and wet spring has produced explosive growth across the kingdom\'s wild lands. Untamed vegetation encroaches on roads and settlements, but also signals fertile conditions for new farmland.',
    choices: {
      clear_new_fields: 'Clear Land for New Fields',
      preserve_the_woodlands: 'Preserve the Woodlands',
    },
  },
  evt_exp_env_forest_fire: {
    title: 'Wildfire in the Royal Forests',
    body: 'A devastating fire has erupted in the kingdom\'s central forest belt, driven by dry summer winds. Timber reserves, charcoal burners\' camps, and several outlying villages are directly threatened. Smoke is visible from the capital.',
    choices: {
      mobilize_firefighting_brigades: 'Mobilize Firefighting Brigades',
      create_firebreaks: 'Create Firebreaks',
      evacuate_and_wait: 'Evacuate and Wait',
    },
  },
  evt_exp_env_locust_swarm: {
    title: 'Locust Swarm Descends',
    body: 'A vast swarm of locusts has descended upon the kingdom\'s agricultural heartland. Fields that were green at dawn are stripped bare by midday. Farmers watch helplessly as the insects consume everything in their path.',
    choices: {
      organize_pest_drives: 'Organize Pest Drives',
      burn_afflicted_fields: 'Burn Afflicted Fields',
      pray_for_deliverance: 'Pray for Deliverance',
    },
  },
  evt_exp_env_river_pollution: {
    title: 'River Fouled by Industry',
    body: 'The kingdom\'s main river has become visibly tainted. Tanneries, dye works, and slaughterhouses upstream have turned the water dark and foul-smelling. Downstream communities report illness among those who drink from it.',
    choices: {
      regulate_tanneries: 'Regulate the Tanneries',
      relocate_workshops: 'Relocate Workshops Downstream',
      ignore_complaints: 'Ignore the Complaints',
    },
  },
  evt_exp_env_soil_exhaustion: {
    title: 'Exhausted Farmland',
    body: 'Harvests have dwindled in the kingdom\'s oldest agricultural regions. Years of continuous planting without rest have stripped the soil of its vitality. Farmers report that even well-tended fields yield only a fraction of their former bounty.',
    choices: {
      implement_field_rotation: 'Implement Field Rotation',
      import_fertile_soil: 'Import Fertile Soil',
      push_harder_next_season: 'Push Harder Next Season',
    },
  },
  evt_exp_env_earthquake: {
    title: 'Earthquake Strikes the Kingdom',
    body: 'The earth itself has turned against the crown. A powerful tremor has shaken the kingdom, collapsing walls, cracking foundations, and sending citizens fleeing into the streets. Reports of casualties and structural damage pour in from every quarter.',
    choices: {
      launch_rescue_operations: 'Launch Rescue Operations',
      prioritize_infrastructure: 'Prioritize Infrastructure Repair',
      call_for_prayer_and_calm: 'Call for Prayer and Calm',
    },
  },
  evt_exp_env_volcanic_ash_cloud: {
    title: 'Ash Cloud Darkens the Skies',
    body: 'A distant volcanic eruption has sent a vast cloud of ash drifting over the kingdom. The sun is dimmed, crops wilt under the grey pall, and citizens cough in the acrid air. Scholars warn the effects may persist for weeks.',
    choices: {
      seal_granaries_and_ration: 'Seal Granaries and Ration Food',
      organize_mass_shelter: 'Organize Mass Shelter',
      wait_for_skies_to_clear: 'Wait for Skies to Clear',
    },
  },
  evt_exp_env_deforestation_crisis: {
    title: 'Forests Stripped Bare',
    body: 'The kingdom\'s growing population has consumed timber at an alarming rate. Hillsides once thick with ancient oak now stand barren, causing erosion, flooding, and a shortage of building materials. Charcoal burners and shipwrights compete for what remains.',
    choices: {
      establish_royal_forest_reserves: 'Establish Royal Forest Reserves',
      tax_lumber_operations: 'Tax Lumber Operations',
      allow_continued_clearing: 'Allow Continued Clearing',
    },
  },
  evt_exp_env_coastal_erosion: {
    title: 'The Sea Claims the Shore',
    body: 'Autumn storms have accelerated the erosion of the kingdom\'s coastline. Several fishing villages report that the sea has advanced dramatically, swallowing fields and undermining structures. The coastal folk petition the crown for aid.',
    choices: {
      build_sea_walls: 'Build Sea Walls',
      relocate_coastal_villages: 'Relocate Coastal Villages',
      accept_gradual_loss: 'Accept the Gradual Loss',
    },
  },
  evt_exp_env_great_storm: {
    title: 'The Great Storm',
    body: 'A storm of unprecedented fury has struck the kingdom. Howling winds tear roofs from buildings, torrential rain floods valleys, and lightning ignites fires across the countryside. This is no ordinary tempest — it threatens the very fabric of the realm.',
    choices: {
      emergency_fortification: 'Emergency Fortification',
      distribute_emergency_supplies: 'Distribute Emergency Supplies',
      shelter_in_place: 'Shelter in Place',
    },
  },
  evt_exp_env_mine_contamination: {
    title: 'Mining Waste Poisons the Land',
    body: 'Runoff from the kingdom\'s mining operations has seeped into the surrounding soil and waterways. Livestock sicken, crops wither, and the communities downhill from the mines report a growing toll of illness among their children.',
    choices: {
      shut_down_mine: 'Shut Down the Mine',
      invest_in_drainage: 'Invest in Drainage Systems',
      continue_operations: 'Continue Operations',
    },
  },
  evt_exp_env_harsh_winter_early: {
    title: 'Winter Arrives Early',
    body: 'The first snows have fallen weeks ahead of schedule, catching farmers mid-harvest and travelers on open roads. If this cold persists, the kingdom faces a longer and harder winter than anyone anticipated.',
    choices: {
      accelerate_harvest: 'Accelerate the Harvest',
      open_emergency_stores: 'Open Emergency Stores',
      trust_preparations: 'Trust Existing Preparations',
    },
  },
  evt_exp_env_bountiful_rainfall: {
    title: 'Generous Spring Rains',
    body: 'The spring rains have been plentiful but measured — neither too heavy nor too scarce. Rivers run full, wells are replenished, and the fields drink deeply. It is a rare gift that could be put to good use.',
    choices: {
      expand_irrigation: 'Expand Irrigation Works',
      celebrate_good_fortune: 'Celebrate the Good Fortune',
    },
  },
  evt_exp_env_medicinal_springs: {
    title: 'Medicinal Hot Springs Discovered',
    body: 'Shepherds in a remote valley have discovered natural hot springs with remarkable healing properties. Word has spread quickly, and already the sick and lame make pilgrimages to the site. The question is who should control this gift of the earth.',
    choices: {
      build_healing_baths: 'Build Public Healing Baths',
      grant_to_clergy: 'Grant Stewardship to the Clergy',
      leave_undeveloped: 'Leave Undeveloped',
    },
  },
  evt_exp_env_summer_heat_wave: {
    title: 'Scorching Heat Wave',
    body: 'An oppressive heat has settled over the kingdom. Wells run dry, crops wilt in the fields, and the elderly and young suffer most. The capital\'s fountains have stopped flowing, and tempers grow as short as water supplies.',
    choices: {
      ration_water_supplies: 'Ration Water Supplies',
      dig_new_wells: 'Commission New Wells',
      endure_the_heat: 'Endure the Heat',
    },
  },
  evt_exp_env_animal_migration: {
    title: 'Great Animal Migration',
    body: 'A vast herd of deer and wild cattle passes through the kingdom\'s territories on their seasonal migration. The spectacle is breathtaking, and the opportunity for hunting is significant — though some counsel that the herds should be left undisturbed.',
    choices: {
      organize_hunts: 'Organize Royal Hunts',
      protect_herds: 'Protect the Herds',
    },
  },
};
