import type { EventTextEntry } from '../events';

export const EXPANSION_FOOD_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Granary Rats
  // ============================================================
  evt_exp_fod_granary_rats: {
    title: 'Vermin in the Royal Granaries',
    body: 'Your granary keeper reports with dismay that rats have infiltrated the Crown\'s principal grain stores in {region} — a catastrophe at any time, but grim indeed with reserves already at a {stores_tier} mark this {season}. Sacks gnawed open line the cellar floors, and the stench of spoilage hangs heavy in the vaults where the kingdom\'s reserves should stand secure.',
    choices: {
      hire_ratcatchers: 'Hire Professional Ratcatchers',
      distribute_before_spoilage: 'Distribute Before Further Spoilage',
      accept_the_losses: 'Accept the Losses',
    },
  },

  // ============================================================
  // 2. Fishing Fleet Expansion
  // ============================================================
  evt_exp_fod_fishing_fleet: {
    title: 'The Fishermen Seek New Boats',
    body: 'A delegation of coastal fishermen from {region} petitions the throne for funding to commission additional vessels. The {season} sea teems with catch they cannot harvest for want of boats, yet the cost of timber and rope would draw from a treasury in {treasury_tier} condition — with stores only at a {stores_tier} mark, {chancellor_or_fallback} counsels care.',
    choices: {
      fund_new_boats: 'Fund New Boats',
      conscript_coastal_labour: 'Conscript Coastal Labour',
      maintain_current_fleet: 'Maintain the Current Fleet',
    },
  },

  // ============================================================
  // 3. Food Preservation Innovations
  // ============================================================
  evt_exp_fod_preservation: {
    title: 'New Methods of Preservation',
    body: 'A travelling scholar arrives in {region} this {season} with techniques for preserving meat and fish through the lean winter months. Salt-curing and smoke-houses, he claims, could reduce spoilage by half — a welcome prospect with stores at a {stores_tier} mark. The methods require modest investment but would alter how your people prepare for the cold.',
    choices: {
      invest_in_salt_curing: 'Invest in Salt-Curing',
      build_smoke_houses: 'Build Smoke-Houses',
      rely_on_traditional_methods: 'Rely on Traditional Methods',
    },
  },

  // ============================================================
  // 4. Crop Disease
  // ============================================================
  evt_exp_fod_crop_disease: {
    title: 'Blight Upon the Fields',
    body: 'A creeping rot has appeared in the wheat fields of {region} this {season}, turning golden stalks to blackened husks. Farmers watch helplessly as the disease spreads from field to field, and {chancellor_or_fallback} warns that without swift action — with kingdom stores already at a {stores_tier} mark — the harvest will be devastated.',
    choices: {
      burn_infected_fields: 'Burn the Infected Fields',
      quarantine_affected_regions: 'Quarantine Affected Regions',
      pray_for_divine_intervention: 'Pray for Divine Intervention',
    },
  },

  // ============================================================
  // 5. Livestock Plague
  // ============================================================
  evt_exp_fod_livestock_plague: {
    title: 'Plague Sweeps the Herds',
    body: 'A terrible sickness has fallen upon the cattle and sheep of {region}. Animals collapse in the pastures this {season}, and the disease passes from herd to herd faster than quarantine lines can be drawn. Your people — with stores already at a {stores_tier} mark — face not only the loss of meat and milk but the draught animals upon which ploughing depends.',
    choices: {
      cull_all_sick_animals: 'Cull All Sick Animals',
      import_healthy_stock: 'Import Healthy Stock',
      let_plague_run_its_course: 'Let the Plague Run Its Course',
    },
  },

  // ============================================================
  // 6. Food Distribution Inequity
  // ============================================================
  evt_exp_fod_distribution_inequity: {
    title: 'The Hungry and the Well-Fed',
    body: '{chancellor_or_fallback} warns that with stores at a {stores_tier} mark, the disparity has grown too visible to ignore: while noble tables groan under the weight of roasted meats and fresh bread, common folk queue for hours to receive meagre portions of thin gruel. Unrest simmers in the lower quarters of the capital.',
    choices: {
      mandate_equal_rationing: 'Mandate Equal Rationing',
      open_royal_granaries: 'Open the Royal Granaries',
      maintain_current_distribution: 'Maintain Current Distribution',
    },
  },

  // ============================================================
  // 7. Feast and Famine Cycle
  // ============================================================
  evt_exp_fod_feast_famine: {
    title: 'The Pendulum of Plenty',
    body: 'Your kingdom swings between abundance and scarcity with alarming regularity — this {season} the stores across {region} stand at a {stores_tier} mark, and none can say where they will stand the next. When harvests are good, the people feast without thought for tomorrow; when they fail, famine follows swiftly. {chancellor_or_fallback} argues that only deliberate planning can break this destructive cycle.',
    choices: {
      establish_food_reserves: 'Establish Food Reserves',
      sell_surplus_abroad: 'Sell Surplus Abroad',
      do_nothing_special: 'Take No Special Action',
    },
  },

  // ============================================================
  // 8. Agricultural Labour Shortage
  // ============================================================
  evt_exp_fod_labour_shortage: {
    title: 'Too Few Hands for the Harvest',
    body: 'The fields of {region} stand ready for reaping this {season}, but there are not enough labourers to bring in the grain before it rots on the stalk. War, plague, and the lure of city wages have thinned the rural population, and your bailiffs report that entire villages lack the hands to work their own land — with kingdom stores at a {stores_tier} mark, the shortfall cannot be borne.',
    choices: {
      conscript_urban_workers: 'Conscript Urban Workers',
      offer_land_grants: 'Offer Land Grants',
      accept_reduced_harvest: 'Accept a Reduced Harvest',
    },
  },

  // ============================================================
  // 9. Food Hoarding by Nobles
  // ============================================================
  evt_exp_fod_noble_hoarding: {
    title: 'Noble Storehouses Overflow',
    body: '{spymaster_or_fallback} confirms that several noble houses have been quietly stockpiling grain and salted meat within their private holdings while the common granaries sit at a {stores_tier} mark. The lords claim they merely exercise prudent management, but the people see only greed in a time of want.',
    choices: {
      confiscate_noble_stores: 'Confiscate Noble Stores',
      negotiate_voluntary_sharing: 'Negotiate Voluntary Sharing',
      allow_nobles_their_stores: 'Allow Nobles Their Stores',
    },
  },

  // ============================================================
  // 10. Foreign Food Imports Blocked
  // ============================================================
  evt_exp_fod_imports_blocked: {
    title: 'Valdris Halts Food Shipments',
    body: 'Valdris has sealed its borders to all food exports bound for your kingdom. Grain barges sit idle on the river, and overland caravans are turned back at the frontier. Your people — with stores already at a {stores_tier} mark this {season} — already feel the pinch, and {chancellor_or_fallback} warns that without alternative supply, hunger will follow within weeks.',
    choices: {
      demand_trade_resumption: 'Demand Trade Resumption',
      seek_arenthal_imports: 'Seek Imports from Arenthal',
      enforce_strict_rationing: 'Enforce Strict Rationing',
    },
  },
};
