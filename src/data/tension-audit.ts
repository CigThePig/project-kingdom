// Workstream A — Task A1: Card Tension Audit
// Structured audit of every player-facing card in the game.
// For each card, evaluates whether all options present meaningful costs.
//
// Deleted via A3 reclassification:
//   evt_region_local_festival — reclassified as world pulse. All choices were
//     trivially small positives with no real cost, offering no meaningful decision.

export interface TensionAuditEntry {
  cardId: string;
  source: 'events' | 'faction-requests' | 'neighbor-actions' | 'decrees';
  currentClassification: 'crisis' | 'petition' | 'decree';
  tensionPass: boolean;
  problem?:
    | 'no_cost_to_accept'
    | 'lopsided_deny'
    | 'lopsided_grant'
    | 'not_a_decision'
    | 'wrong_interaction_type'
    | 'missing_cross_faction_cost';
  recommendation?:
    | 'rebalance'
    | 'reclassify_as_notification'
    | 'reclassify_as_world_pulse'
    | 'reclassify_as_negotiation'
    | 'reclassify_as_assessment'
    | 'delete';
  notes?: string;
}

export const TENSION_AUDIT: TensionAuditEntry[] = [
  // ============================================================
  // EVENTS — Base Pool (52 events from EVENT_POOL)
  // Classification: Critical/Serious → crisis, Notable/Informational → petition
  // ============================================================

  // --- Economy (2) ---
  { cardId: 'evt_merchant_capital_flight', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_treasury_windfall', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Food (2) ---
  { cardId: 'evt_harvest_blight', source: 'events', currentClassification: 'crisis', tensionPass: true },
  {
    cardId: 'evt_commoner_harvest_festival',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'not_a_decision',
    recommendation: 'reclassify_as_notification',
    notes: 'Endorse (+3 commoner, +2 faith, -10 treasury) vs observe (+1 commoner). Treasury cost makes endorse dominant for attentive players; observe is never strategically interesting.',
  },

  // --- Military (2) ---
  { cardId: 'evt_military_equipment_shortage_1', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_military_equipment_shortage_2', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Diplomacy (2) ---
  {
    cardId: 'evt_neighbor_trade_overture',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'Accept: +3 merchantSat, +25 treasury — all positive, zero cost. Add nobility cost (nobles resent merchant ascendancy from foreign trade).',
  },
  { cardId: 'evt_border_tension_escalation', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Environment (2) ---
  { cardId: 'evt_early_frost', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_spring_flooding', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- PublicOrder (2) ---
  { cardId: 'evt_commoner_labor_dispute', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_popular_unrest', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Religion (2) ---
  { cardId: 'evt_heresy_emergence', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_schism_crisis', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Culture (2) ---
  { cardId: 'evt_foreign_cultural_influx', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_cultural_festival_proposal', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Espionage (2) ---
  { cardId: 'evt_foreign_agent_detected', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_noble_intrigue_discovered', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Knowledge (2) ---
  { cardId: 'evt_scholarly_breakthrough', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_library_fire', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- ClassConflict (2) ---
  { cardId: 'evt_noble_merchant_rivalry', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_clergy_merchant_dispute', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Region (2) ---
  { cardId: 'evt_regional_development_opportunity', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_regional_unrest', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Kingdom (2) ---
  {
    cardId: 'evt_annual_state_assessment',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'not_a_decision',
    recommendation: 'reclassify_as_notification',
    notes: 'Review (+2 stability) vs acknowledge (+1 stability). Both options are free positives with no tradeoff. This is an information event, not a decision.',
  },
  { cardId: 'evt_kingdom_milestone_celebrated', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Class-specific: Nobility (3) ---
  { cardId: 'evt_noble_succession_dispute', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_noble_court_faction', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_noble_land_seizure', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Class-specific: Clergy (3) ---
  { cardId: 'evt_clergy_monastic_dispute', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_clergy_pilgrimage_movement', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_clergy_prophecy_claim', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Class-specific: Merchants (3) ---
  { cardId: 'evt_merchant_guild_formation', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_merchant_smuggling_ring', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_merchant_foreign_traders', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Class-specific: Commoners (3) ---
  { cardId: 'evt_commoner_plague_outbreak', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_commoner_folk_hero', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_commoner_migration_wave', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Class-specific: Military Caste (3) ---
  { cardId: 'evt_military_veteran_demands', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_military_desertion_crisis', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_military_honor_dispute', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Seasonal: Spring (2) ---
  { cardId: 'evt_spring_planting_festival', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_spring_river_thaw', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Seasonal: Summer (2) ---
  { cardId: 'evt_summer_drought', source: 'events', currentClassification: 'crisis', tensionPass: true },
  {
    cardId: 'evt_summer_trade_season',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'Host trade fair: +30 treasury, +3 merchantSat, +1 commonerSat — all positive. Add commoner cost (crowds disrupt daily commerce, inflate prices).',
  },

  // --- Seasonal: Autumn (2) ---
  {
    cardId: 'evt_autumn_harvest_bounty',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'All 3 choices are purely positive with zero negatives. Stockpile: +25 food. Export: +35 treasury, -15 food, +2 merchantSat. Distribute: +4 commonerSat, -10 food, +1 faith. Add cross-faction costs to each.',
  },
  { cardId: 'evt_autumn_bandit_raids', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Seasonal: Winter (2) ---
  { cardId: 'evt_winter_blizzard', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_winter_food_shortage', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Regional (6) ---
  { cardId: 'evt_region_mine_collapse', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_region_trade_route_disruption', source: 'events', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'evt_region_local_festival',
    source: 'events',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'not_a_decision',
    recommendation: 'reclassify_as_world_pulse',
    notes: 'All choices are trivially small positives. Send blessing: +1/+1/+1, attend: +2/+3/+1/-15, ignore: -1/-1. No genuine tradeoff; better as ambient flavor.',
  },
  { cardId: 'evt_region_resource_discovery', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_region_infrastructure_decay', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_region_separatist_sentiment', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Escalation (6) ---
  { cardId: 'evt_escalation_famine_panic', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_escalation_treasury_crisis', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_escalation_faith_collapse', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_escalation_military_mutiny', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_escalation_noble_conspiracy', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_escalation_mass_exodus', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Follow-up Events (12) ---
  { cardId: 'evt_scholarly_discovery', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_practical_innovation_success', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_merchant_demands_escalate', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_merchant_underground_economy', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_noble_backlash_labor', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_commoner_work_slowdown', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_theological_schism_brewing', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_intelligence_network_payoff', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_foreign_grain_dependency', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_resource_boom', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_clergy_healing_reputation', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_military_pay_expectation', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Pattern-Reactive (4) ---
  { cardId: 'evt_noble_resentment_merchant_favor', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_commoner_uprising_neglect', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_clergy_power_grab', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_military_coup_threat', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Chain: Plague (3) ---
  { cardId: 'evt_plague_outbreak', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_plague_spread', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_plague_aftermath', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Chain: Trade War (3) ---
  { cardId: 'evt_trade_war_tariffs', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_trade_war_escalation', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_trade_war_resolution', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Chain: Succession Crisis (3) ---
  { cardId: 'evt_succession_question', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_succession_factions', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_succession_resolution', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- Chain: Famine (3) ---
  { cardId: 'evt_food_shortage_warning', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_famine_crisis', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_famine_recovery', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Chain: Religious Schism (3) ---
  { cardId: 'evt_doctrinal_dispute', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_schism_factions', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_schism_resolution', source: 'events', currentClassification: 'petition', tensionPass: true },

  // --- Additional Follow-up (3) ---
  { cardId: 'evt_merchant_permanent_concessions', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_underground_heretical_movement', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_equipment_failure_field', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // --- High-stakes Standalone (3) ---
  { cardId: 'evt_golden_age_opportunity', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'evt_assassination_attempt', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'evt_foreign_invasion_rumor', source: 'events', currentClassification: 'crisis', tensionPass: true },

  // ============================================================
  // FACTION REQUESTS (15)
  // All are Notable → petition classification
  // ============================================================

  // --- Nobility (3) ---
  { cardId: 'faction_req_nobility_tax_exemption', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  { cardId: 'faction_req_nobility_court_privileges', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'faction_req_nobility_academy',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'lopsided_deny',
    recommendation: 'rebalance',
    notes: 'Deny costs only -1 nobilitySat. The faction came with a request — refusal should sting. Raise to -3 minimum.',
  },

  // --- Clergy (3) ---
  { cardId: 'faction_req_clergy_heresy_crackdown', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  { cardId: 'faction_req_clergy_temple_funding', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'faction_req_clergy_religious_festival',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'lopsided_deny',
    recommendation: 'rebalance',
    notes: 'Deny costs only -1 clergySat. Grant also lacks cross-faction cost (treasury only). Raise deny to -3 and add cross-faction pressure to grant.',
  },

  // --- Merchants (3) ---
  { cardId: 'faction_req_merchant_trade_protections', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'faction_req_merchant_market_expansion',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'Approve: +5 merchantSat, +15 treasury, +1 commonerSat — all positive, zero negatives. Add commoner displacement cost (-2) and noble encroachment cost (-2).',
  },
  {
    cardId: 'faction_req_merchant_foreign_mission',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'lopsided_deny',
    recommendation: 'rebalance',
    notes: 'Deny costs only -1 merchantSat. Raise to -3.',
  },

  // --- Commoners (3) ---
  { cardId: 'faction_req_commoner_food_relief', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  { cardId: 'faction_req_commoner_labor_reforms', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'faction_req_commoner_public_works',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'lopsided_deny',
    recommendation: 'rebalance',
    notes: 'Deny costs only -1 commonerSat. Raise to -3.',
  },

  // --- Military Caste (3) ---
  { cardId: 'faction_req_military_equipment_pay', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  { cardId: 'faction_req_military_training_grounds', source: 'faction-requests', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'faction_req_military_border_fortification',
    source: 'faction-requests',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'lopsided_deny',
    recommendation: 'rebalance',
    notes: 'Deny costs only -1 militaryCasteSat. Raise to -3.',
  },

  // ============================================================
  // NEIGHBOR ACTIONS (10)
  // Crisis-tier: Critical/Serious → crisis. Petition-tier: Notable → petition.
  // ============================================================

  // --- Crisis-tier (4) ---
  { cardId: 'WarDeclaration', source: 'neighbor-actions', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'Demand', source: 'neighbor-actions', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'MilitaryBuildup', source: 'neighbor-actions', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'EspionageRetaliation', source: 'neighbor-actions', currentClassification: 'crisis', tensionPass: true },

  // --- Petition-tier (6) ---
  {
    cardId: 'TradeProposal',
    source: 'neighbor-actions',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'Accept: +3 merchantSat, +15 treasury, +8 diplomacy — all positive, zero cost. Local merchants should lose satisfaction from foreign competition. Also a candidate for reclassify_as_negotiation (complex deal deserves term-by-term negotiation).',
  },
  { cardId: 'TradeWithdrawal', source: 'neighbor-actions', currentClassification: 'petition', tensionPass: true },
  {
    cardId: 'TreatyProposal',
    source: 'neighbor-actions',
    currentClassification: 'petition',
    tensionPass: false,
    problem: 'no_cost_to_accept',
    recommendation: 'rebalance',
    notes: 'Accept: +3 stability, +12 diplomacy — all positive, zero cost. Treaties should impose military constraints and diplomatic maintenance costs. Also a candidate for reclassify_as_negotiation.',
  },
  { cardId: 'PeaceOffer', source: 'neighbor-actions', currentClassification: 'petition', tensionPass: true },
  { cardId: 'BorderTension', source: 'neighbor-actions', currentClassification: 'petition', tensionPass: true },
  { cardId: 'ReligiousPressure', source: 'neighbor-actions', currentClassification: 'petition', tensionPass: true },

  // ============================================================
  // DECREES (54)
  // All classified as 'decree'. Check for "obviously never pick" entries.
  // ============================================================

  // --- Economic (7) ---
  { cardId: 'decree_market_charter', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_trade_guild_expansion', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_merchant_republic_charter', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_trade_subsidies', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_trade_monopoly', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_international_trade_empire', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_emergency_levy', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Military (7) ---
  { cardId: 'decree_fortify_borders', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_integrated_defense_network', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_fortress_kingdom', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_arms_commission', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_royal_arsenal', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_war_machine_industry', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_general_mobilization', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Civic (8) ---
  { cardId: 'decree_road_improvement', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_provincial_highway_system', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_kingdom_transit_network', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_census', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_administrative_reform', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_royal_bureaucracy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_centralized_governance', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_tax_code_reform', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Religious (7) ---
  { cardId: 'decree_call_festival', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_invest_religious_order', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_expand_religious_authority', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_theocratic_council', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_suppress_heresy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_inquisitorial_authority', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_religious_unification', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Diplomatic (8) ---
  { cardId: 'decree_diplomatic_envoy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_permanent_embassy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_diplomatic_supremacy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_trade_agreement', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_royal_marriage', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_dynasty_alliance', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_imperial_confederation', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_university_charter', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Social (9) ---
  { cardId: 'decree_public_granary', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_regional_food_distribution', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_kingdom_breadbasket', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_labor_rights', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_workers_guild_charter', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_social_contract', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_land_redistribution', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_engineering_corps', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_medical_reforms', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // --- Knowledge-gated (8) ---
  { cardId: 'decree_crop_rotation', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_irrigation_works', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_advanced_fortifications', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_elite_training_program', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_provincial_governance', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_diplomatic_academy', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_harbor_expansion', source: 'decrees', currentClassification: 'decree', tensionPass: true },
  { cardId: 'decree_trade_fleet_commission', source: 'decrees', currentClassification: 'decree', tensionPass: true },

  // ============================================================
  // EXPANSION — New Assessment Cards (6)
  // All Notable → petition classification, all pass tension audit
  // ============================================================
  { cardId: 'assess_merchant_caravan_disappearance', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'assess_scholarly_heresy_manuscript', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'assess_crop_blight_reports', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'assess_noble_faction_meeting', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'assess_coastal_vessel_sighting', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'assess_strange_illness_outbreak', source: 'events', currentClassification: 'petition', tensionPass: true },

  // ============================================================
  // EXPANSION — New Negotiation Cards (4)
  // Serious → crisis, Notable → petition
  // ============================================================
  { cardId: 'neg_commoner_charter', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'neg_scholarly_patronage', source: 'events', currentClassification: 'petition', tensionPass: true },
  { cardId: 'neg_resource_blockade', source: 'events', currentClassification: 'crisis', tensionPass: true },
  { cardId: 'neg_marriage_alliance', source: 'events', currentClassification: 'petition', tensionPass: true },
];
