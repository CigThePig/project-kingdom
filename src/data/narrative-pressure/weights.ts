// Narrative Pressure — Master Weight Map
// Maps every player decision to its narrative pressure axis contributions.
// Keyed by: `${sourceType}:${sourceId}:${choiceId}`
//
// Weight ranges (NARRATIVE-PRESSURE-SYSTEM.md §2):
//   - Normal decisions: 1-4
//   - Major decisions: 5-10
//   - Crisis-level pivots: 10-15
//   - Follow-up event choices: 4-10 (amplified — doubling down)
//   - Storyline branch choices: 6-12 (highest weight — pivotal moments)

import type { NarrativePressure } from '../../engine/types';

export interface PressureWeightEntry {
  axisWeights: Partial<NarrativePressure>;
}

export const PRESSURE_WEIGHTS: Record<string, PressureWeightEntry> = {

  // ============================================================
  // SECTION 1: EVENTS — Base Pool
  // ============================================================

  // --- Economy ---

  // evt_merchant_capital_flight (Notable)
  'event:evt_merchant_capital_flight:offer_tax_relief': {
    axisWeights: { commerce: 3 },
  },
  'event:evt_merchant_capital_flight:enforce_capital_controls': {
    axisWeights: { authority: 3, isolation: 1 },
  },
  'event:evt_merchant_capital_flight:negotiate_with_guilds': {
    axisWeights: { commerce: 2, reform: 1 },
  },

  // evt_treasury_windfall (Informational)
  'event:evt_treasury_windfall:invest_in_infrastructure': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_treasury_windfall:distribute_to_populace': {
    axisWeights: { reform: 2 },
  },
  'event:evt_treasury_windfall:bolster_reserves': {
    axisWeights: {},
  },

  // --- Food ---

  // evt_harvest_blight (Serious)
  'event:evt_harvest_blight:quarantine_affected_fields': {
    axisWeights: { authority: 2 },
  },
  'event:evt_harvest_blight:redirect_labor_to_salvage': {
    axisWeights: { authority: 1, reform: 1 },
  },
  'event:evt_harvest_blight:purchase_foreign_grain': {
    axisWeights: { commerce: 2, openness: 1 },
  },

  // evt_commoner_harvest_festival (Informational — notification)
  'event:evt_commoner_harvest_festival:acknowledge': {
    axisWeights: {},
  },

  // --- Military (chain_equipment_crisis) ---

  // evt_military_equipment_shortage_1 (Notable, chain step 1)
  'event:evt_military_equipment_shortage_1:emergency_procurement': {
    axisWeights: { militarism: 3 },
  },
  'event:evt_military_equipment_shortage_1:redistribute_existing_stock': {
    axisWeights: { authority: 2 },
  },
  'event:evt_military_equipment_shortage_1:defer_to_next_month': {
    axisWeights: {},
  },

  // evt_military_equipment_shortage_2 (Serious, chain step 2 — amplified)
  'event:evt_military_equipment_shortage_2:full_rearmament_program': {
    axisWeights: { militarism: 4 },
  },
  'event:evt_military_equipment_shortage_2:request_allied_supplies': {
    axisWeights: { openness: 3, militarism: 1 },
  },
  'event:evt_military_equipment_shortage_2:reduce_force_size': {
    axisWeights: { reform: 2 },
  },

  // --- Diplomacy ---

  // evt_neighbor_trade_overture (Notable)
  'event:evt_neighbor_trade_overture:accept_trade_terms': {
    axisWeights: { commerce: 2, openness: 2 },
  },
  'event:evt_neighbor_trade_overture:propose_modifications': {
    axisWeights: { commerce: 2, authority: 1 },
  },
  'event:evt_neighbor_trade_overture:decline_politely': {
    axisWeights: { isolation: 2 },
  },

  // evt_border_tension_escalation (Serious)
  'event:evt_border_tension_escalation:reinforce_border_garrisons': {
    axisWeights: { militarism: 3, isolation: 1 },
  },
  'event:evt_border_tension_escalation:dispatch_diplomatic_envoy': {
    axisWeights: { openness: 3 },
  },
  'event:evt_border_tension_escalation:issue_formal_protest': {
    axisWeights: { authority: 1 },
  },

  // --- Environment ---

  // evt_early_frost (Notable)
  'event:evt_early_frost:mobilize_harvest_crews': {
    axisWeights: { authority: 2 },
  },
  'event:evt_early_frost:open_emergency_stores': {
    axisWeights: { reform: 2 },
  },
  'event:evt_early_frost:accept_the_losses': {
    axisWeights: {},
  },

  // evt_spring_flooding (Serious)
  'event:evt_spring_flooding:organize_relief_effort': {
    axisWeights: { reform: 2 },
  },
  'event:evt_spring_flooding:redirect_military_engineers': {
    axisWeights: { militarism: 2 },
  },
  'event:evt_spring_flooding:levy_emergency_reconstruction_tax': {
    axisWeights: { authority: 3 },
  },

  // --- PublicOrder ---

  // evt_commoner_labor_dispute (Notable)
  'event:evt_commoner_labor_dispute:mediate_negotiations': {
    axisWeights: { reform: 2 },
  },
  'event:evt_commoner_labor_dispute:side_with_laborers': {
    axisWeights: { reform: 3 },
  },
  'event:evt_commoner_labor_dispute:enforce_existing_contracts': {
    axisWeights: { authority: 3 },
  },

  // evt_popular_unrest (Critical)
  'event:evt_popular_unrest:address_grievances_publicly': {
    axisWeights: { reform: 3 },
  },
  'event:evt_popular_unrest:deploy_peacekeepers': {
    axisWeights: { authority: 4, militarism: 2 },
  },
  'event:evt_popular_unrest:impose_curfew': {
    axisWeights: { authority: 5 },
  },

  // --- Religion ---

  // evt_heresy_emergence (Notable)
  'event:evt_heresy_emergence:investigate_teachings': {
    axisWeights: { intrigue: 2 },
  },
  'event:evt_heresy_emergence:suppress_immediately': {
    axisWeights: { authority: 3, piety: 3 },
  },
  'event:evt_heresy_emergence:permit_theological_debate': {
    axisWeights: { openness: 2, reform: 1 },
  },

  // evt_schism_crisis (Critical)
  'event:evt_schism_crisis:convene_ecclesiastical_council': {
    axisWeights: { piety: 4 },
  },
  'event:evt_schism_crisis:enforce_state_doctrine': {
    axisWeights: { authority: 4, piety: 3 },
  },
  'event:evt_schism_crisis:allow_coexistence': {
    axisWeights: { openness: 3, reform: 2 },
  },

  // --- Culture ---

  // evt_foreign_cultural_influx (Informational)
  'event:evt_foreign_cultural_influx:embrace_exchange': {
    axisWeights: { openness: 2 },
  },
  'event:evt_foreign_cultural_influx:regulate_foreign_practices': {
    axisWeights: { authority: 1, isolation: 1 },
  },
  'event:evt_foreign_cultural_influx:observe_and_assess': {
    axisWeights: {},
  },

  // evt_cultural_festival_proposal (Notable)
  'event:evt_cultural_festival_proposal:approve_full_festival': {
    axisWeights: { piety: 2, openness: 1 },
  },
  'event:evt_cultural_festival_proposal:approve_modest_version': {
    axisWeights: { piety: 1 },
  },
  'event:evt_cultural_festival_proposal:decline_proposal': {
    axisWeights: { isolation: 1 },
  },

  // --- Espionage ---

  // evt_foreign_agent_detected (Notable)
  'event:evt_foreign_agent_detected:arrest_and_interrogate': {
    axisWeights: { authority: 2, intrigue: 2 },
  },
  'event:evt_foreign_agent_detected:monitor_covertly': {
    axisWeights: { intrigue: 3 },
  },
  'event:evt_foreign_agent_detected:expel_from_kingdom': {
    axisWeights: { authority: 2, isolation: 1 },
  },

  // evt_noble_intrigue_discovered (Serious)
  'event:evt_noble_intrigue_discovered:confront_directly': {
    axisWeights: { authority: 3 },
  },
  'event:evt_noble_intrigue_discovered:launch_counter_intelligence': {
    axisWeights: { intrigue: 4 },
  },
  'event:evt_noble_intrigue_discovered:ignore_for_now': {
    axisWeights: {},
  },

  // --- Knowledge ---

  // evt_scholarly_breakthrough (Informational)
  'event:evt_scholarly_breakthrough:fund_further_research': {
    axisWeights: { openness: 2 },
  },
  'event:evt_scholarly_breakthrough:apply_practical_findings': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_scholarly_breakthrough:acknowledge_achievement': {
    axisWeights: {},
  },

  // evt_library_fire (Serious)
  'event:evt_library_fire:launch_restoration_effort': {
    axisWeights: { openness: 2, piety: 1 },
  },
  'event:evt_library_fire:investigate_cause': {
    axisWeights: { intrigue: 2 },
  },
  'event:evt_library_fire:accept_and_rebuild': {
    axisWeights: { reform: 1 },
  },

  // --- ClassConflict ---

  // evt_noble_merchant_rivalry (Notable)
  'event:evt_noble_merchant_rivalry:broker_compromise': {
    axisWeights: { reform: 2 },
  },
  'event:evt_noble_merchant_rivalry:uphold_noble_privileges': {
    axisWeights: { authority: 2 },
  },
  'event:evt_noble_merchant_rivalry:recognize_merchant_standing': {
    axisWeights: { commerce: 3 },
  },

  // evt_clergy_merchant_dispute (Notable)
  'event:evt_clergy_merchant_dispute:side_with_clergy': {
    axisWeights: { piety: 3 },
  },
  'event:evt_clergy_merchant_dispute:side_with_merchants': {
    axisWeights: { commerce: 3 },
  },
  'event:evt_clergy_merchant_dispute:seek_middle_ground': {
    axisWeights: { reform: 1 },
  },

  // --- Region ---

  // evt_regional_development_opportunity (Informational)
  'event:evt_regional_development_opportunity:approve_development': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_regional_development_opportunity:defer_to_local_governance': {
    axisWeights: { reform: 1 },
  },
  'event:evt_regional_development_opportunity:decline_investment': {
    axisWeights: {},
  },

  // evt_regional_unrest (Serious)
  'event:evt_regional_unrest:dispatch_relief_and_reforms': {
    axisWeights: { reform: 3 },
  },
  'event:evt_regional_unrest:send_peacekeeping_force': {
    axisWeights: { authority: 3, militarism: 1 },
  },
  'event:evt_regional_unrest:summon_local_leaders': {
    axisWeights: { reform: 2 },
  },

  // --- Kingdom ---

  // evt_annual_state_assessment (Informational — notification)
  'event:evt_annual_state_assessment:acknowledge': {
    axisWeights: {},
  },

  // evt_kingdom_milestone_celebrated (Notable)
  'event:evt_kingdom_milestone_celebrated:host_state_celebration': {
    axisWeights: { authority: 2, piety: 1 },
  },
  'event:evt_kingdom_milestone_celebrated:issue_commemorative_decree': {
    axisWeights: { authority: 2 },
  },
  'event:evt_kingdom_milestone_celebrated:note_with_quiet_satisfaction': {
    axisWeights: {},
  },

  // --- Class-Specific: Nobility ---

  // evt_noble_succession_dispute (Serious)
  'event:evt_noble_succession_dispute:mediate_succession': {
    axisWeights: { authority: 3 },
  },
  'event:evt_noble_succession_dispute:support_senior_claimant': {
    axisWeights: { authority: 2 },
  },
  'event:evt_noble_succession_dispute:let_nobles_settle_it': {
    axisWeights: {},
  },

  // evt_noble_court_faction (Notable)
  'event:evt_noble_court_faction:co_opt_faction_leaders': {
    axisWeights: { intrigue: 2, authority: 1 },
  },
  'event:evt_noble_court_faction:publicly_denounce_faction': {
    axisWeights: { authority: 3 },
  },
  'event:evt_noble_court_faction:monitor_faction_quietly': {
    axisWeights: { intrigue: 2 },
  },

  // evt_noble_land_seizure (Serious)
  'event:evt_noble_land_seizure:reverse_seizures': {
    axisWeights: { reform: 3 },
  },
  'event:evt_noble_land_seizure:impose_compensation': {
    axisWeights: { authority: 2, reform: 1 },
  },
  'event:evt_noble_land_seizure:uphold_noble_claims': {
    axisWeights: { authority: 2 },
  },

  // --- Class-Specific: Clergy ---

  // evt_clergy_monastic_dispute (Notable)
  'event:evt_clergy_monastic_dispute:arbitrate_dispute': {
    axisWeights: { authority: 2, piety: 1 },
  },
  'event:evt_clergy_monastic_dispute:favor_established_order': {
    axisWeights: { piety: 2, authority: 1 },
  },
  'event:evt_clergy_monastic_dispute:leave_to_ecclesiastical_courts': {
    axisWeights: { piety: 1 },
  },

  // evt_clergy_pilgrimage_movement (Informational)
  'event:evt_clergy_pilgrimage_movement:endorse_pilgrimage': {
    axisWeights: { piety: 2 },
  },
  'event:evt_clergy_pilgrimage_movement:provide_royal_escort': {
    axisWeights: { piety: 2, authority: 1 },
  },
  'event:evt_clergy_pilgrimage_movement:discourage_travel': {
    axisWeights: { isolation: 1 },
  },

  // evt_clergy_prophecy_claim (Serious)
  'event:evt_clergy_prophecy_claim:investigate_prophecy': {
    axisWeights: { intrigue: 2, piety: 1 },
  },
  'event:evt_clergy_prophecy_claim:endorse_as_divine_sign': {
    axisWeights: { piety: 4 },
  },
  'event:evt_clergy_prophecy_claim:dismiss_as_superstition': {
    axisWeights: { reform: 2 },
  },

  // --- Class-Specific: Merchants ---

  // evt_merchant_guild_formation (Notable)
  'event:evt_merchant_guild_formation:grant_guild_charter': {
    axisWeights: { commerce: 3 },
  },
  'event:evt_merchant_guild_formation:impose_royal_oversight': {
    axisWeights: { authority: 2, commerce: 1 },
  },
  'event:evt_merchant_guild_formation:deny_guild_petition': {
    axisWeights: { authority: 2 },
  },

  // evt_merchant_smuggling_ring (Serious)
  'event:evt_merchant_smuggling_ring:raid_smuggling_operation': {
    axisWeights: { authority: 3 },
  },
  'event:evt_merchant_smuggling_ring:infiltrate_network': {
    axisWeights: { intrigue: 3 },
  },
  'event:evt_merchant_smuggling_ring:levy_fines_and_warn': {
    axisWeights: { authority: 1, commerce: 1 },
  },

  // evt_merchant_foreign_traders (Informational)
  'event:evt_merchant_foreign_traders:welcome_foreign_merchants': {
    axisWeights: { openness: 2, commerce: 1 },
  },
  'event:evt_merchant_foreign_traders:negotiate_trade_terms': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_merchant_foreign_traders:restrict_foreign_access': {
    axisWeights: { isolation: 2 },
  },

  // --- Class-Specific: Commoners ---

  // evt_commoner_plague_outbreak (Critical)
  'event:evt_commoner_plague_outbreak:quarantine_affected_districts': {
    axisWeights: { authority: 3 },
  },
  'event:evt_commoner_plague_outbreak:mobilize_clergy_healers': {
    axisWeights: { piety: 3 },
  },
  'event:evt_commoner_plague_outbreak:distribute_herbal_remedies': {
    axisWeights: { reform: 2 },
  },

  // evt_commoner_folk_hero (Notable)
  'event:evt_commoner_folk_hero:invite_to_court': {
    axisWeights: { authority: 2, reform: 1 },
  },
  'event:evt_commoner_folk_hero:co_opt_folk_narrative': {
    axisWeights: { intrigue: 2, authority: 1 },
  },
  'event:evt_commoner_folk_hero:ignore_the_stories': {
    axisWeights: {},
  },

  // evt_commoner_migration_wave (Notable)
  'event:evt_commoner_migration_wave:manage_resettlement': {
    axisWeights: { reform: 2 },
  },
  'event:evt_commoner_migration_wave:restrict_movement': {
    axisWeights: { authority: 2, isolation: 1 },
  },
  'event:evt_commoner_migration_wave:allow_natural_flow': {
    axisWeights: { openness: 1 },
  },

  // --- Class-Specific: Military Caste ---

  // evt_military_veteran_demands (Notable)
  'event:evt_military_veteran_demands:grant_veteran_pensions': {
    axisWeights: { militarism: 2, reform: 1 },
  },
  'event:evt_military_veteran_demands:offer_land_grants': {
    axisWeights: { militarism: 2 },
  },
  'event:evt_military_veteran_demands:acknowledge_service_only': {
    axisWeights: {},
  },

  // evt_military_desertion_crisis (Serious)
  'event:evt_military_desertion_crisis:increase_military_pay': {
    axisWeights: { militarism: 3 },
  },
  'event:evt_military_desertion_crisis:enforce_harsh_discipline': {
    axisWeights: { authority: 3, militarism: 1 },
  },
  'event:evt_military_desertion_crisis:appeal_to_honor': {
    axisWeights: { militarism: 1 },
  },

  // evt_military_honor_dispute (Notable)
  'event:evt_military_honor_dispute:uphold_military_merit': {
    axisWeights: { militarism: 2, reform: 1 },
  },
  'event:evt_military_honor_dispute:defer_to_noble_rank': {
    axisWeights: { authority: 2 },
  },
  'event:evt_military_honor_dispute:establish_joint_council': {
    axisWeights: { reform: 2 },
  },

  // --- Seasonal: Spring ---

  // evt_spring_planting_festival (Informational)
  'event:evt_spring_planting_festival:sponsor_planting_rites': {
    axisWeights: { piety: 1, reform: 1 },
  },
  'event:evt_spring_planting_festival:attend_ceremonies': {
    axisWeights: { piety: 1 },
  },
  'event:evt_spring_planting_festival:decline_involvement': {
    axisWeights: {},
  },

  // evt_spring_river_thaw (Notable)
  'event:evt_spring_river_thaw:reinforce_riverbanks': {
    axisWeights: { authority: 2 },
  },
  'event:evt_spring_river_thaw:evacuate_lowlands': {
    axisWeights: { reform: 2 },
  },
  'event:evt_spring_river_thaw:monitor_water_levels': {
    axisWeights: {},
  },

  // --- Seasonal: Summer ---

  // evt_summer_drought (Serious)
  'event:evt_summer_drought:ration_water_supplies': {
    axisWeights: { authority: 2 },
  },
  'event:evt_summer_drought:dig_emergency_wells': {
    axisWeights: { reform: 2 },
  },
  'event:evt_summer_drought:pray_for_rain': {
    axisWeights: { piety: 2 },
  },

  // evt_summer_trade_season (Informational)
  'event:evt_summer_trade_season:host_trade_fair': {
    axisWeights: { commerce: 2, openness: 1 },
  },
  'event:evt_summer_trade_season:reduce_trade_tariffs': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_summer_trade_season:maintain_current_policy': {
    axisWeights: {},
  },

  // --- Seasonal: Autumn ---

  // evt_autumn_harvest_bounty (Informational)
  'event:evt_autumn_harvest_bounty:stockpile_surplus': {
    axisWeights: { isolation: 1 },
  },
  'event:evt_autumn_harvest_bounty:export_for_profit': {
    axisWeights: { commerce: 2, openness: 1 },
  },
  'event:evt_autumn_harvest_bounty:distribute_to_poor': {
    axisWeights: { reform: 2 },
  },

  // evt_autumn_bandit_raids (Notable)
  'event:evt_autumn_bandit_raids:dispatch_patrol_forces': {
    axisWeights: { militarism: 2 },
  },
  'event:evt_autumn_bandit_raids:arm_rural_militia': {
    axisWeights: { militarism: 2, reform: 1 },
  },
  'event:evt_autumn_bandit_raids:increase_road_patrols': {
    axisWeights: { authority: 1 },
  },

  // --- Seasonal: Winter ---

  // evt_winter_blizzard (Serious)
  'event:evt_winter_blizzard:open_warming_shelters': {
    axisWeights: { reform: 2 },
  },
  'event:evt_winter_blizzard:distribute_fuel_and_blankets': {
    axisWeights: { reform: 2, authority: 1 },
  },
  'event:evt_winter_blizzard:wait_out_the_storm': {
    axisWeights: {},
  },

  // evt_winter_food_shortage (Serious)
  'event:evt_winter_food_shortage:impose_strict_rationing': {
    axisWeights: { authority: 3 },
  },
  'event:evt_winter_food_shortage:purchase_emergency_grain': {
    axisWeights: { commerce: 2, openness: 1 },
  },
  'event:evt_winter_food_shortage:request_neighbor_aid': {
    axisWeights: { openness: 3 },
  },

  // ============================================================
  // SECTION 2: EVENTS — Regional
  // ============================================================

  // evt_region_mine_collapse (Serious)
  'event:evt_region_mine_collapse:launch_rescue_operation': {
    axisWeights: { reform: 2 },
  },
  'event:evt_region_mine_collapse:hire_foreign_engineers': {
    axisWeights: { openness: 2, commerce: 1 },
  },
  'event:evt_region_mine_collapse:seal_and_rebuild': {
    axisWeights: { authority: 2 },
  },

  // evt_region_trade_route_disruption (Notable)
  'event:evt_region_trade_route_disruption:military_escort_caravans': {
    axisWeights: { militarism: 2, commerce: 1 },
  },
  'event:evt_region_trade_route_disruption:negotiate_safe_passage': {
    axisWeights: { openness: 2 },
  },
  'event:evt_region_trade_route_disruption:reroute_trade': {
    axisWeights: { commerce: 1 },
  },

  // evt_region_resource_discovery (Notable)
  'event:evt_region_resource_discovery:fund_extraction': {
    axisWeights: { commerce: 3 },
  },
  'event:evt_region_resource_discovery:auction_rights': {
    axisWeights: { commerce: 2 },
  },
  'event:evt_region_resource_discovery:survey_further': {
    axisWeights: { intrigue: 1 },
  },

  // evt_region_infrastructure_decay (Notable)
  'event:evt_region_infrastructure_decay:fund_major_repairs': {
    axisWeights: { reform: 2 },
  },
  'event:evt_region_infrastructure_decay:levy_local_labor': {
    axisWeights: { authority: 2 },
  },
  'event:evt_region_infrastructure_decay:defer_maintenance': {
    axisWeights: {},
  },

  // evt_region_separatist_sentiment (Serious)
  'event:evt_region_separatist_sentiment:negotiate_autonomy_terms': {
    axisWeights: { reform: 3, openness: 1 },
  },
  'event:evt_region_separatist_sentiment:dispatch_royal_governor': {
    axisWeights: { authority: 3 },
  },
  'event:evt_region_separatist_sentiment:show_of_force': {
    axisWeights: { militarism: 3, authority: 2 },
  },

  // ============================================================
  // SECTION 3: EVENTS — Escalation (Critical severity — weights 5-10)
  // ============================================================

  // evt_escalation_famine_panic (Critical)
  'event:evt_escalation_famine_panic:seize_noble_granaries': {
    axisWeights: { authority: 7, reform: 3 },
  },
  'event:evt_escalation_famine_panic:enforce_martial_rationing': {
    axisWeights: { authority: 8, militarism: 2 },
  },
  'event:evt_escalation_famine_panic:appeal_for_calm': {
    axisWeights: { reform: 3 },
  },

  // evt_escalation_treasury_crisis (Critical)
  'event:evt_escalation_treasury_crisis:emergency_asset_sales': {
    axisWeights: { commerce: 5 },
  },
  'event:evt_escalation_treasury_crisis:demand_noble_contributions': {
    axisWeights: { authority: 6, reform: 2 },
  },
  'event:evt_escalation_treasury_crisis:suspend_non_essential_spending': {
    axisWeights: { authority: 3 },
  },

  // evt_escalation_faith_collapse (Critical)
  'event:evt_escalation_faith_collapse:call_grand_synod': {
    axisWeights: { piety: 7 },
  },
  'event:evt_escalation_faith_collapse:impose_state_religion': {
    axisWeights: { authority: 7, piety: 5 },
  },
  'event:evt_escalation_faith_collapse:embrace_pluralism': {
    axisWeights: { openness: 6, reform: 4 },
  },

  // evt_escalation_military_mutiny (Critical)
  'event:evt_escalation_military_mutiny:meet_mutiny_demands': {
    axisWeights: { militarism: 5, reform: 3 },
  },
  'event:evt_escalation_military_mutiny:isolate_ringleaders': {
    axisWeights: { authority: 7, intrigue: 3 },
  },
  'event:evt_escalation_military_mutiny:negotiate_with_officers': {
    axisWeights: { militarism: 4, reform: 2 },
  },

  // evt_escalation_noble_conspiracy (Critical)
  'event:evt_escalation_noble_conspiracy:preemptive_arrests': {
    axisWeights: { authority: 8 },
  },
  'event:evt_escalation_noble_conspiracy:offer_reconciliation': {
    axisWeights: { reform: 5, openness: 2 },
  },
  'event:evt_escalation_noble_conspiracy:plant_double_agents': {
    axisWeights: { intrigue: 8 },
  },

  // evt_escalation_mass_exodus (Critical)
  'event:evt_escalation_mass_exodus:promise_sweeping_reforms': {
    axisWeights: { reform: 8 },
  },
  'event:evt_escalation_mass_exodus:close_borders': {
    axisWeights: { authority: 6, isolation: 5 },
  },
  'event:evt_escalation_mass_exodus:let_dissenters_leave': {
    axisWeights: { openness: 3 },
  },

  // ============================================================
  // SECTION 4: EVENTS — Pattern-Reactive + High-Stakes Standalone
  // ============================================================

  // evt_noble_resentment_merchant_favor (Serious, pattern-reactive)
  'event:evt_noble_resentment_merchant_favor:appease_nobility': {
    axisWeights: { authority: 3 },
  },
  'event:evt_noble_resentment_merchant_favor:maintain_merchant_policies': {
    axisWeights: { commerce: 4 },
  },
  'event:evt_noble_resentment_merchant_favor:mediate_compromise': {
    axisWeights: { reform: 2 },
  },

  // evt_commoner_uprising_neglect (Critical, pattern-reactive)
  'event:evt_commoner_uprising_neglect:emergency_food_distribution': {
    axisWeights: { reform: 5 },
  },
  'event:evt_commoner_uprising_neglect:deploy_military_patrols': {
    axisWeights: { authority: 5, militarism: 3 },
  },
  'event:evt_commoner_uprising_neglect:announce_labor_reforms': {
    axisWeights: { reform: 6 },
  },

  // evt_clergy_power_grab (Serious, pattern-reactive)
  'event:evt_clergy_power_grab:assert_royal_authority': {
    axisWeights: { authority: 4 },
  },
  'event:evt_clergy_power_grab:negotiate_boundaries': {
    axisWeights: { piety: 2, authority: 1 },
  },
  'event:evt_clergy_power_grab:accept_clergy_influence': {
    axisWeights: { piety: 5 },
  },

  // evt_military_coup_threat (Critical, pattern-reactive)
  'event:evt_military_coup_threat:purge_conspirators': {
    axisWeights: { authority: 7 },
  },
  'event:evt_military_coup_threat:bribe_officer_corps': {
    axisWeights: { intrigue: 4, militarism: 2 },
  },
  'event:evt_military_coup_threat:address_grievances': {
    axisWeights: { reform: 4, militarism: 2 },
  },

  // evt_golden_age_opportunity (Notable)
  'event:evt_golden_age_opportunity:patron_arts_sciences': {
    axisWeights: { openness: 3, commerce: 1 },
  },
  'event:evt_golden_age_opportunity:host_grand_festival': {
    axisWeights: { piety: 2, openness: 1 },
  },
  'event:evt_golden_age_opportunity:invest_in_education': {
    axisWeights: { reform: 2, openness: 1 },
  },

  // evt_assassination_attempt (Critical, high-stakes)
  'event:evt_assassination_attempt:purge_inner_circle': {
    axisWeights: { authority: 6, intrigue: 2 },
  },
  'event:evt_assassination_attempt:increase_royal_guard': {
    axisWeights: { militarism: 4, authority: 2 },
  },
  'event:evt_assassination_attempt:show_mercy': {
    axisWeights: { reform: 4, openness: 1 },
  },

  // evt_foreign_invasion_rumor (Serious, high-stakes)
  'event:evt_foreign_invasion_rumor:mobilize_defenses': {
    axisWeights: { militarism: 4 },
  },
  'event:evt_foreign_invasion_rumor:dispatch_scouts': {
    axisWeights: { intrigue: 3, militarism: 1 },
  },
  'event:evt_foreign_invasion_rumor:dismiss_as_rumor': {
    axisWeights: {},
  },

  // ============================================================
  // SECTION 5: EVENTS — Chains (step 2+ amplified)
  // ============================================================

  // --- Chain: Plague (chain_plague) ---

  // evt_plague_outbreak (Critical, step 1)
  'event:evt_plague_outbreak:immediate_quarantine': {
    axisWeights: { authority: 4 },
  },
  'event:evt_plague_outbreak:mobilize_healers': {
    axisWeights: { piety: 3, reform: 1 },
  },
  'event:evt_plague_outbreak:pray_for_deliverance': {
    axisWeights: { piety: 4 },
  },

  // evt_plague_spread (Critical, step 2 — amplified)
  'event:evt_plague_spread:strict_lockdown': {
    axisWeights: { authority: 5, isolation: 2 },
  },
  'event:evt_plague_spread:burn_infected_quarters': {
    axisWeights: { authority: 5, militarism: 2 },
  },
  'event:evt_plague_spread:import_foreign_medicine': {
    axisWeights: { openness: 5, commerce: 2 },
  },

  // evt_plague_aftermath (Serious, step 3 — amplified)
  'event:evt_plague_aftermath:rebuild_and_memorialize': {
    axisWeights: { reform: 4, piety: 2 },
  },
  'event:evt_plague_aftermath:impose_sanitation_laws': {
    axisWeights: { authority: 4, reform: 2 },
  },
  'event:evt_plague_aftermath:exploit_cheap_labor': {
    axisWeights: { commerce: 4, authority: 1 },
  },

  // --- Chain: Trade War (chain_trade_war) ---

  // evt_trade_war_tariffs (Notable, step 1)
  'event:evt_trade_war_tariffs:retaliatory_tariffs': {
    axisWeights: { isolation: 3, authority: 1 },
  },
  'event:evt_trade_war_tariffs:negotiate_terms': {
    axisWeights: { openness: 2, commerce: 1 },
  },
  'event:evt_trade_war_tariffs:absorb_the_costs': {
    axisWeights: { commerce: 1 },
  },

  // evt_trade_war_escalation (Serious, step 2 — amplified)
  'event:evt_trade_war_escalation:embargo_neighbor': {
    axisWeights: { isolation: 5, authority: 2 },
  },
  'event:evt_trade_war_escalation:seek_alternative_markets': {
    axisWeights: { commerce: 4, openness: 2 },
  },
  'event:evt_trade_war_escalation:capitulate': {
    axisWeights: { openness: 3 },
  },

  // evt_trade_war_resolution (Notable, step 3 — amplified)
  'event:evt_trade_war_resolution:favorable_treaty': {
    axisWeights: { commerce: 4, authority: 1 },
  },
  'event:evt_trade_war_resolution:mutual_concessions': {
    axisWeights: { openness: 3, commerce: 2 },
  },
  'event:evt_trade_war_resolution:accept_losses': {
    axisWeights: { openness: 2 },
  },

  // --- Chain: Succession Crisis (chain_succession) ---

  // evt_succession_question (Serious, step 1)
  'event:evt_succession_question:declare_heir': {
    axisWeights: { authority: 4 },
  },
  'event:evt_succession_question:convene_council': {
    axisWeights: { reform: 3 },
  },
  'event:evt_succession_question:silence_rumors': {
    axisWeights: { intrigue: 2, authority: 1 },
  },

  // evt_succession_factions (Critical, step 2 — amplified)
  'event:evt_succession_factions:back_eldest_claim': {
    axisWeights: { authority: 5 },
  },
  'event:evt_succession_factions:support_merit_candidate': {
    axisWeights: { reform: 5 },
  },
  'event:evt_succession_factions:play_factions': {
    axisWeights: { intrigue: 5 },
  },

  // evt_succession_resolution (Serious, step 3 — amplified)
  'event:evt_succession_resolution:crown_heir_publicly': {
    axisWeights: { authority: 5, piety: 1 },
  },
  'event:evt_succession_resolution:exile_rivals': {
    axisWeights: { authority: 5, intrigue: 2 },
  },
  'event:evt_succession_resolution:grant_rival_concessions': {
    axisWeights: { reform: 4, openness: 1 },
  },

  // --- Chain: Famine (chain_famine) ---

  // evt_food_shortage_warning (Notable, step 1)
  'event:evt_food_shortage_warning:impose_strict_rationing': {
    axisWeights: { authority: 3 },
  },
  'event:evt_food_shortage_warning:buy_grain_reserves': {
    axisWeights: { commerce: 2, openness: 1 },
  },
  'event:evt_food_shortage_warning:reduce_military_rations': {
    axisWeights: { reform: 1 },
  },

  // evt_famine_crisis (Critical, step 2 — amplified)
  'event:evt_famine_crisis:open_royal_granaries': {
    axisWeights: { reform: 5 },
  },
  'event:evt_famine_crisis:commandeer_noble_stores': {
    axisWeights: { authority: 5, reform: 2 },
  },
  'event:evt_famine_crisis:appeal_to_neighbors': {
    axisWeights: { openness: 5 },
  },

  // evt_famine_recovery (Notable, step 3 — amplified)
  'event:evt_famine_recovery:invest_in_agriculture': {
    axisWeights: { reform: 3, commerce: 1 },
  },
  'event:evt_famine_recovery:establish_grain_reserves': {
    axisWeights: { authority: 3 },
  },
  'event:evt_famine_recovery:celebrate_survival': {
    axisWeights: { piety: 1 },
  },

  // --- Chain: Religious Schism (chain_schism) ---

  // evt_doctrinal_dispute (Notable, step 1)
  'event:evt_doctrinal_dispute:convene_theological_council': {
    axisWeights: { piety: 3 },
  },
  'event:evt_doctrinal_dispute:enforce_orthodox_doctrine': {
    axisWeights: { authority: 3, piety: 2 },
  },
  'event:evt_doctrinal_dispute:allow_scholarly_debate': {
    axisWeights: { openness: 2, reform: 1 },
  },

  // evt_schism_factions (Serious, step 2 — amplified)
  'event:evt_schism_factions:support_reformers': {
    axisWeights: { reform: 5, openness: 1 },
  },
  'event:evt_schism_factions:back_traditionalists': {
    axisWeights: { piety: 5, isolation: 1 },
  },
  'event:evt_schism_factions:remain_neutral': {
    axisWeights: { openness: 2 },
  },

  // evt_schism_resolution (Notable, step 3 — amplified)
  'event:evt_schism_resolution:declare_unified_doctrine': {
    axisWeights: { authority: 4, piety: 3 },
  },
  'event:evt_schism_resolution:formalize_tolerance': {
    axisWeights: { openness: 4, reform: 3 },
  },
  'event:evt_schism_resolution:suppress_dissent': {
    axisWeights: { authority: 5, piety: 2 },
  },

  // ============================================================
  // SECTION 6: EVENTS — Follow-ups (amplified 4-8)
  // ============================================================

  // --- Follow-ups in EVENT_POOL (consequence-triggered) ---

  // evt_scholarly_discovery (follow-up to fund_further_research)
  'event:evt_scholarly_discovery:patent_discovery': {
    axisWeights: { commerce: 5 },
  },
  'event:evt_scholarly_discovery:share_with_clergy': {
    axisWeights: { piety: 5, openness: 1 },
  },
  'event:evt_scholarly_discovery:apply_to_military': {
    axisWeights: { militarism: 5 },
  },

  // evt_practical_innovation_success (follow-up to apply_practical_findings)
  'event:evt_practical_innovation_success:expand_workshops': {
    axisWeights: { commerce: 5, reform: 1 },
  },
  'event:evt_practical_innovation_success:train_artisans': {
    axisWeights: { reform: 5 },
  },
  'event:evt_practical_innovation_success:present_to_court': {
    axisWeights: { authority: 3 },
  },

  // evt_merchant_demands_escalate (follow-up to offer_tax_relief)
  'event:evt_merchant_demands_escalate:hold_firm_on_terms': {
    axisWeights: { authority: 5 },
  },
  'event:evt_merchant_demands_escalate:extend_concessions': {
    axisWeights: { commerce: 6 },
  },
  'event:evt_merchant_demands_escalate:impose_trade_conditions': {
    axisWeights: { authority: 4, commerce: 2 },
  },

  // evt_merchant_underground_economy (follow-up to enforce_capital_controls)
  'event:evt_merchant_underground_economy:raid_smuggling_networks': {
    axisWeights: { authority: 6 },
  },
  'event:evt_merchant_underground_economy:legitimize_shadow_trade': {
    axisWeights: { commerce: 5, openness: 2 },
  },
  'event:evt_merchant_underground_economy:increase_enforcement': {
    axisWeights: { authority: 5, isolation: 2 },
  },

  // evt_noble_backlash_labor (follow-up to side_with_laborers)
  'event:evt_noble_backlash_labor:appease_nobles': {
    axisWeights: { authority: 4 },
  },
  'event:evt_noble_backlash_labor:stand_firm': {
    axisWeights: { reform: 7 },
  },
  'event:evt_noble_backlash_labor:offer_compromise': {
    axisWeights: { reform: 4 },
  },

  // evt_commoner_work_slowdown (follow-up to enforce_existing_contracts)
  'event:evt_commoner_work_slowdown:impose_work_quotas': {
    axisWeights: { authority: 6 },
  },
  'event:evt_commoner_work_slowdown:open_dialogue': {
    axisWeights: { reform: 5 },
  },
  'event:evt_commoner_work_slowdown:hire_foreign_labor': {
    axisWeights: { openness: 4, commerce: 2 },
  },

  // evt_theological_schism_brewing (follow-up to permit_theological_debate)
  'event:evt_theological_schism_brewing:host_grand_debate': {
    axisWeights: { openness: 6, reform: 2 },
  },
  'event:evt_theological_schism_brewing:quietly_suppress': {
    axisWeights: { authority: 5, piety: 3 },
  },
  'event:evt_theological_schism_brewing:embrace_new_thought': {
    axisWeights: { reform: 6, openness: 2 },
  },

  // evt_intelligence_network_payoff (follow-up to launch_counter_intelligence)
  'event:evt_intelligence_network_payoff:expose_conspiracy': {
    axisWeights: { authority: 5, intrigue: 3 },
  },
  'event:evt_intelligence_network_payoff:leverage_for_loyalty': {
    axisWeights: { intrigue: 7 },
  },
  'event:evt_intelligence_network_payoff:share_with_allies': {
    axisWeights: { openness: 4, intrigue: 2 },
  },

  // evt_foreign_grain_dependency (follow-up to purchase_foreign_grain)
  'event:evt_foreign_grain_dependency:invest_in_domestic_agriculture': {
    axisWeights: { isolation: 4, reform: 2 },
  },
  'event:evt_foreign_grain_dependency:negotiate_long_term_supply': {
    axisWeights: { openness: 5, commerce: 2 },
  },
  'event:evt_foreign_grain_dependency:accept_dependency': {
    axisWeights: { openness: 3 },
  },

  // evt_resource_boom (follow-up to fund_extraction)
  'event:evt_resource_boom:expand_operations': {
    axisWeights: { commerce: 6 },
  },
  'event:evt_resource_boom:tax_windfall': {
    axisWeights: { authority: 4, commerce: 2 },
  },
  'event:evt_resource_boom:establish_workers_rights': {
    axisWeights: { reform: 6 },
  },

  // evt_clergy_healing_reputation (follow-up to mobilize_clergy_healers)
  'event:evt_clergy_healing_reputation:establish_permanent_hospice': {
    axisWeights: { piety: 5, reform: 2 },
  },
  'event:evt_clergy_healing_reputation:leverage_piety': {
    axisWeights: { piety: 6, authority: 1 },
  },
  'event:evt_clergy_healing_reputation:return_to_normal': {
    axisWeights: {},
  },

  // evt_military_pay_expectation (follow-up to increase_military_pay)
  'event:evt_military_pay_expectation:institutionalize_pay_scale': {
    axisWeights: { militarism: 6, reform: 1 },
  },
  'event:evt_military_pay_expectation:revert_to_standard_pay': {
    axisWeights: { authority: 5 },
  },
  'event:evt_military_pay_expectation:offer_land_instead': {
    axisWeights: { militarism: 4, reform: 2 },
  },

  // --- FOLLOW_UP_POOL events (amplified 5-8) ---

  // evt_merchant_permanent_concessions (follow-up to offer_tax_relief)
  'event:evt_merchant_permanent_concessions:grant_permanent_charter': {
    axisWeights: { commerce: 7 },
  },
  'event:evt_merchant_permanent_concessions:reject_demands': {
    axisWeights: { authority: 6 },
  },
  'event:evt_merchant_permanent_concessions:offer_limited_concession': {
    axisWeights: { commerce: 4, authority: 1 },
  },

  // evt_underground_heretical_movement (follow-up to suppress_immediately)
  'event:evt_underground_heretical_movement:infiltrate_movement': {
    axisWeights: { intrigue: 6 },
  },
  'event:evt_underground_heretical_movement:public_amnesty': {
    axisWeights: { reform: 6, openness: 2 },
  },
  'event:evt_underground_heretical_movement:double_down_suppression': {
    axisWeights: { authority: 7, piety: 4 },
  },

  // evt_equipment_failure_field (follow-up to defer_to_next_month)
  'event:evt_equipment_failure_field:emergency_field_repair': {
    axisWeights: { militarism: 5 },
  },
  'event:evt_equipment_failure_field:retreat_and_regroup': {
    axisWeights: { militarism: 3 },
  },
  'event:evt_equipment_failure_field:push_through': {
    axisWeights: { militarism: 4, authority: 2 },
  },

  // ============================================================
  // SECTION 7: FACTION REQUESTS (range 2-5)
  // ============================================================

  // --- Nobility ---
  'faction:faction_req_nobility_tax_exemption:grant_tax_exemption': {
    axisWeights: { authority: 3 },
  },
  'faction:faction_req_nobility_tax_exemption:deny_tax_exemption': {
    axisWeights: { reform: 3 },
  },
  'faction:faction_req_nobility_court_privileges:expand_court_privileges': {
    axisWeights: { authority: 3 },
  },
  'faction:faction_req_nobility_court_privileges:deny_court_privileges': {
    axisWeights: { reform: 2 },
  },
  'faction:faction_req_nobility_academy:fund_noble_academy': {
    axisWeights: { authority: 2 },
  },
  'faction:faction_req_nobility_academy:decline_academy_proposal': {
    axisWeights: { reform: 2 },
  },

  // --- Clergy ---
  'faction:faction_req_clergy_heresy_crackdown:authorize_crackdown': {
    axisWeights: { authority: 4, piety: 5 },
  },
  'faction:faction_req_clergy_heresy_crackdown:refuse_crackdown': {
    axisWeights: { reform: 3, openness: 2 },
  },
  'faction:faction_req_clergy_temple_funding:approve_temple_funding': {
    axisWeights: { piety: 3 },
  },
  'faction:faction_req_clergy_temple_funding:deny_temple_funding': {
    axisWeights: { reform: 2 },
  },
  'faction:faction_req_clergy_religious_festival:sponsor_religious_festival': {
    axisWeights: { piety: 3 },
  },
  'faction:faction_req_clergy_religious_festival:decline_festival_request': {
    axisWeights: { reform: 2 },
  },

  // --- Merchants ---
  'faction:faction_req_merchant_trade_protections:grant_trade_protections': {
    axisWeights: { commerce: 4, isolation: 1 },
  },
  'faction:faction_req_merchant_trade_protections:deny_trade_protections': {
    axisWeights: { openness: 2 },
  },
  'faction:faction_req_merchant_market_expansion:approve_market_expansion': {
    axisWeights: { commerce: 3 },
  },
  'faction:faction_req_merchant_market_expansion:deny_market_expansion': {
    axisWeights: { authority: 2 },
  },
  'faction:faction_req_merchant_foreign_mission:fund_foreign_mission': {
    axisWeights: { commerce: 3, openness: 2 },
  },
  'faction:faction_req_merchant_foreign_mission:decline_foreign_mission': {
    axisWeights: { isolation: 2 },
  },

  // --- Commoners ---
  'faction:faction_req_commoner_food_relief:distribute_food_relief': {
    axisWeights: { reform: 4 },
  },
  'faction:faction_req_commoner_food_relief:deny_food_relief': {
    axisWeights: { authority: 3 },
  },
  'faction:faction_req_commoner_labor_reforms:enact_labor_reforms': {
    axisWeights: { reform: 4 },
  },
  'faction:faction_req_commoner_labor_reforms:reject_labor_reforms': {
    axisWeights: { authority: 3 },
  },
  'faction:faction_req_commoner_public_works:approve_public_works': {
    axisWeights: { reform: 3 },
  },
  'faction:faction_req_commoner_public_works:decline_public_works': {
    axisWeights: { authority: 2 },
  },

  // --- Military Caste ---
  'faction:faction_req_military_equipment_pay:increase_military_pay': {
    axisWeights: { militarism: 4 },
  },
  'faction:faction_req_military_equipment_pay:deny_pay_increase': {
    axisWeights: { reform: 2 },
  },
  'faction:faction_req_military_training_grounds:build_training_grounds': {
    axisWeights: { militarism: 3 },
  },
  'faction:faction_req_military_training_grounds:deny_training_grounds': {
    axisWeights: { reform: 2 },
  },
  'faction:faction_req_military_border_fortification:approve_border_fortification': {
    axisWeights: { militarism: 3, isolation: 1 },
  },
  'faction:faction_req_military_border_fortification:decline_border_fortification': {
    axisWeights: { reform: 2 },
  },

  // ============================================================
  // SECTION 8: DECREES (range 2-4, tier 3 can be higher)
  // ============================================================

  // --- Economic: Market Chain ---
  'decree:decree_market_charter': {
    axisWeights: { commerce: 2 },
  },
  'decree:decree_trade_guild_expansion': {
    axisWeights: { commerce: 3 },
  },
  'decree:decree_merchant_republic_charter': {
    axisWeights: { commerce: 4, reform: 2 },
  },

  // --- Economic: Trade Chain ---
  'decree:decree_trade_subsidies': {
    axisWeights: { commerce: 3 },
  },
  'decree:decree_trade_monopoly': {
    axisWeights: { commerce: 3, authority: 1 },
  },
  'decree:decree_international_trade_empire': {
    axisWeights: { commerce: 4, openness: 2 },
  },

  // --- Economic: Emergency Levy ---
  'decree:decree_emergency_levy': {
    axisWeights: { authority: 3 },
  },

  // --- Military: Fortification Chain ---
  'decree:decree_fortify_borders': {
    axisWeights: { militarism: 2, isolation: 1 },
  },
  'decree:decree_integrated_defense_network': {
    axisWeights: { militarism: 3, isolation: 1 },
  },
  'decree:decree_fortress_kingdom': {
    axisWeights: { militarism: 4, isolation: 3 },
  },

  // --- Military: Arms Chain ---
  'decree:decree_arms_commission': {
    axisWeights: { militarism: 2 },
  },
  'decree:decree_royal_arsenal': {
    axisWeights: { militarism: 3 },
  },
  'decree:decree_war_machine_industry': {
    axisWeights: { militarism: 4, authority: 1 },
  },

  // --- Military: General Mobilization ---
  'decree:decree_general_mobilization': {
    axisWeights: { militarism: 4, authority: 1 },
  },

  // --- Civic: Roads Chain ---
  'decree:decree_road_improvement': {
    axisWeights: { commerce: 2 },
  },
  'decree:decree_provincial_highway_system': {
    axisWeights: { commerce: 3 },
  },
  'decree:decree_kingdom_transit_network': {
    axisWeights: { commerce: 3, openness: 1 },
  },

  // --- Civic: Administration Chain ---
  'decree:decree_census': {
    axisWeights: { authority: 2 },
  },
  'decree:decree_administrative_reform': {
    axisWeights: { authority: 3, reform: 1 },
  },
  'decree:decree_royal_bureaucracy': {
    axisWeights: { authority: 3 },
  },
  'decree:decree_centralized_governance': {
    axisWeights: { authority: 4 },
  },

  // --- Religious: Call Festival ---
  'decree:decree_call_festival': {
    axisWeights: { piety: 2 },
  },

  // --- Religious: Faith Chain ---
  'decree:decree_invest_religious_order': {
    axisWeights: { piety: 2 },
  },
  'decree:decree_expand_religious_authority': {
    axisWeights: { piety: 3 },
  },
  'decree:decree_theocratic_council': {
    axisWeights: { piety: 4, authority: 1 },
  },

  // --- Religious: Heresy Chain ---
  'decree:decree_suppress_heresy': {
    axisWeights: { piety: 2, authority: 2 },
  },
  'decree:decree_inquisitorial_authority': {
    axisWeights: { piety: 3, authority: 3 },
  },
  'decree:decree_religious_unification': {
    axisWeights: { piety: 4, authority: 3, isolation: 2 },
  },

  // --- Diplomatic: Envoy Chain ---
  'decree:decree_diplomatic_envoy': {
    axisWeights: { openness: 2 },
  },
  'decree:decree_permanent_embassy': {
    axisWeights: { openness: 3 },
  },
  'decree:decree_diplomatic_supremacy': {
    axisWeights: { openness: 4, authority: 1 },
  },

  // --- Diplomatic: Marriage Chain ---
  'decree:decree_trade_agreement': {
    axisWeights: { commerce: 2, openness: 1 },
  },
  'decree:decree_royal_marriage': {
    axisWeights: { openness: 3, authority: 1 },
  },
  'decree:decree_dynasty_alliance': {
    axisWeights: { openness: 3, authority: 1 },
  },
  'decree:decree_imperial_confederation': {
    axisWeights: { openness: 4, authority: 2 },
  },

  // --- Social: Granary Chain ---
  'decree:decree_public_granary': {
    axisWeights: { reform: 2 },
  },
  'decree:decree_regional_food_distribution': {
    axisWeights: { reform: 3 },
  },
  'decree:decree_kingdom_breadbasket': {
    axisWeights: { reform: 4 },
  },

  // --- Social: Labor Chain ---
  'decree:decree_labor_rights': {
    axisWeights: { reform: 3 },
  },
  'decree:decree_workers_guild_charter': {
    axisWeights: { reform: 3, commerce: 1 },
  },
  'decree:decree_social_contract': {
    axisWeights: { reform: 4 },
  },

  // --- Social: Land Redistribution ---
  'decree:decree_land_redistribution': {
    axisWeights: { reform: 4, authority: 1 },
  },

  // --- Knowledge-Gated: Agricultural ---
  'decree:decree_crop_rotation': {
    axisWeights: { reform: 2 },
  },
  'decree:decree_irrigation_works': {
    axisWeights: { reform: 3, commerce: 1 },
  },

  // --- Knowledge-Gated: Military ---
  'decree:decree_advanced_fortifications': {
    axisWeights: { militarism: 3 },
  },
  'decree:decree_elite_training_program': {
    axisWeights: { militarism: 3, authority: 1 },
  },

  // --- Knowledge-Gated: Civic ---
  'decree:decree_tax_code_reform': {
    axisWeights: { authority: 2, reform: 1 },
  },
  'decree:decree_provincial_governance': {
    axisWeights: { authority: 3 },
  },

  // --- Knowledge-Gated: Maritime/Trade ---
  'decree:decree_harbor_expansion': {
    axisWeights: { commerce: 3, openness: 1 },
  },
  'decree:decree_trade_fleet_commission': {
    axisWeights: { commerce: 3, openness: 2 },
  },

  // --- Knowledge-Gated: Cultural/Scholarly ---
  'decree:decree_university_charter': {
    axisWeights: { openness: 2, reform: 1 },
  },
  'decree:decree_diplomatic_academy': {
    axisWeights: { openness: 3 },
  },

  // --- Knowledge-Gated: Natural Philosophy ---
  'decree:decree_engineering_corps': {
    axisWeights: { reform: 2, militarism: 1 },
  },
  'decree:decree_medical_reforms': {
    axisWeights: { reform: 3 },
  },

  // ============================================================
  // SECTION 9: NEGOTIATIONS (terms 2-4 each, reject 3-5)
  // ============================================================

  // --- External: neg_trade_deal ---
  'negotiation:neg_trade_deal:exclusive_market_access': {
    axisWeights: { commerce: 3, openness: 2 },
  },
  'negotiation:neg_trade_deal:bulk_pricing_agreement': {
    axisWeights: { commerce: 3 },
  },
  'negotiation:neg_trade_deal:port_rights_concession': {
    axisWeights: { openness: 3, commerce: 1 },
  },
  'negotiation:neg_trade_deal:reject_trade_deal': {
    axisWeights: { isolation: 3 },
  },

  // --- External: neg_treaty_terms ---
  'negotiation:neg_treaty_terms:mutual_defense_clause': {
    axisWeights: { militarism: 3, openness: 1 },
  },
  'negotiation:neg_treaty_terms:trade_corridor_rights': {
    axisWeights: { commerce: 3, openness: 1 },
  },
  'negotiation:neg_treaty_terms:border_access_agreement': {
    axisWeights: { openness: 3 },
  },
  'negotiation:neg_treaty_terms:reject_treaty_terms': {
    axisWeights: { isolation: 4 },
  },

  // --- External: neg_peace_terms ---
  'negotiation:neg_peace_terms:war_reparations': {
    axisWeights: { commerce: 3 },
  },
  'negotiation:neg_peace_terms:prisoner_exchange': {
    axisWeights: { openness: 3, reform: 1 },
  },
  'negotiation:neg_peace_terms:territorial_concession': {
    axisWeights: { openness: 4 },
  },
  'negotiation:neg_peace_terms:trade_normalization': {
    axisWeights: { commerce: 3, openness: 1 },
  },
  'negotiation:neg_peace_terms:reject_peace_terms': {
    axisWeights: { militarism: 4, isolation: 2 },
  },

  // --- External: neg_alliance_pact ---
  'negotiation:neg_alliance_pact:military_commitment': {
    axisWeights: { militarism: 3, openness: 1 },
  },
  'negotiation:neg_alliance_pact:shared_intelligence': {
    axisWeights: { intrigue: 3, openness: 1 },
  },
  'negotiation:neg_alliance_pact:trade_exclusivity': {
    axisWeights: { commerce: 3, isolation: 1 },
  },
  'negotiation:neg_alliance_pact:reject_alliance_pact': {
    axisWeights: { isolation: 4 },
  },

  // --- Internal: neg_noble_power_share ---
  'negotiation:neg_noble_power_share:council_seats': {
    axisWeights: { reform: 3 },
  },
  'negotiation:neg_noble_power_share:tax_authority': {
    axisWeights: { reform: 2, commerce: 1 },
  },
  'negotiation:neg_noble_power_share:judicial_power': {
    axisWeights: { reform: 3 },
  },
  'negotiation:neg_noble_power_share:reject_noble_demands': {
    axisWeights: { authority: 5 },
  },

  // --- Internal: neg_merchant_guild_charter ---
  'negotiation:neg_merchant_guild_charter:monopoly_rights': {
    axisWeights: { commerce: 4 },
  },
  'negotiation:neg_merchant_guild_charter:tax_reduction': {
    axisWeights: { commerce: 3 },
  },
  'negotiation:neg_merchant_guild_charter:port_access': {
    axisWeights: { commerce: 2, openness: 2 },
  },
  'negotiation:neg_merchant_guild_charter:reject_guild_charter': {
    axisWeights: { authority: 4 },
  },

  // --- Internal: neg_clergy_concordat ---
  'negotiation:neg_clergy_concordat:education_authority': {
    axisWeights: { piety: 3 },
  },
  'negotiation:neg_clergy_concordat:tithe_enforcement': {
    axisWeights: { piety: 3, authority: 1 },
  },
  'negotiation:neg_clergy_concordat:heresy_courts': {
    axisWeights: { piety: 4, authority: 1 },
  },
  'negotiation:neg_clergy_concordat:reject_concordat': {
    axisWeights: { authority: 4, reform: 1 },
  },

  // --- Internal: neg_military_reform ---
  'negotiation:neg_military_reform:merit_promotion': {
    axisWeights: { reform: 3, militarism: 1 },
  },
  'negotiation:neg_military_reform:veteran_benefits': {
    axisWeights: { militarism: 3, reform: 1 },
  },
  'negotiation:neg_military_reform:equipment_budget': {
    axisWeights: { militarism: 3 },
  },
  'negotiation:neg_military_reform:reject_military_reform': {
    axisWeights: { authority: 4 },
  },

  // --- Expansion: neg_commoner_charter ---
  'negotiation:neg_commoner_charter:fair_wage_guarantee': {
    axisWeights: { reform: 4 },
  },
  'negotiation:neg_commoner_charter:land_tenure_rights': {
    axisWeights: { reform: 3 },
  },
  'negotiation:neg_commoner_charter:public_assembly_rights': {
    axisWeights: { reform: 4, openness: 1 },
  },
  'negotiation:neg_commoner_charter:reject_commoner_charter': {
    axisWeights: { authority: 5 },
  },

  // --- Expansion: neg_scholarly_patronage ---
  'negotiation:neg_scholarly_patronage:university_funding': {
    axisWeights: { openness: 3, reform: 1 },
  },
  'negotiation:neg_scholarly_patronage:secular_curriculum': {
    axisWeights: { reform: 3, openness: 1 },
  },
  'negotiation:neg_scholarly_patronage:foreign_scholars': {
    axisWeights: { openness: 4 },
  },
  'negotiation:neg_scholarly_patronage:reject_scholarly_patronage': {
    axisWeights: { isolation: 3, piety: 1 },
  },

  // --- Expansion: neg_resource_blockade ---
  'negotiation:neg_resource_blockade:payment_tribute': {
    axisWeights: { openness: 2 },
  },
  'negotiation:neg_resource_blockade:trade_concessions': {
    axisWeights: { commerce: 3, openness: 1 },
  },
  'negotiation:neg_resource_blockade:military_passage_rights': {
    axisWeights: { openness: 3, militarism: 1 },
  },
  'negotiation:neg_resource_blockade:hostage_exchange': {
    axisWeights: { openness: 3 },
  },
  'negotiation:neg_resource_blockade:reject_blockade_terms': {
    axisWeights: { militarism: 4, isolation: 2 },
  },

  // --- Expansion: neg_marriage_alliance ---
  'negotiation:neg_marriage_alliance:royal_dowry': {
    axisWeights: { openness: 3, commerce: 1 },
  },
  'negotiation:neg_marriage_alliance:land_gift': {
    axisWeights: { openness: 4 },
  },
  'negotiation:neg_marriage_alliance:faith_concessions': {
    axisWeights: { piety: 2, openness: 2 },
  },
  'negotiation:neg_marriage_alliance:reject_marriage_alliance': {
    axisWeights: { isolation: 4 },
  },

  // ============================================================
  // SECTION 10: ASSESSMENTS (range 2-4, ignore = empty)
  // ============================================================

  // assess_border_movement
  'assessment:assess_border_movement:investigate_border_movement': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_border_movement:reinforce_preemptively': {
    axisWeights: { militarism: 3 },
  },
  'assessment:assess_border_movement:dismiss_border_reports': {
    axisWeights: {},
  },

  // assess_spy_report_unverified
  'assessment:assess_spy_report_unverified:verify_intelligence': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_spy_report_unverified:act_on_report': {
    axisWeights: { authority: 3, intrigue: 1 },
  },
  'assessment:assess_spy_report_unverified:file_away_report': {
    axisWeights: {},
  },

  // assess_diplomatic_signal
  'assessment:assess_diplomatic_signal:reciprocate_overture': {
    axisWeights: { openness: 3 },
  },
  'assessment:assess_diplomatic_signal:investigate_intent': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_diplomatic_signal:ignore_signal': {
    axisWeights: {},
  },

  // assess_internal_unrest_rumor
  'assessment:assess_internal_unrest_rumor:investigate_unrest_rumor': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_internal_unrest_rumor:preemptive_concession': {
    axisWeights: { reform: 3 },
  },
  'assessment:assess_internal_unrest_rumor:monitor_quietly': {
    axisWeights: { intrigue: 1 },
  },

  // assess_foreign_famine
  'assessment:assess_foreign_famine:send_humanitarian_aid': {
    axisWeights: { openness: 3, reform: 1 },
  },
  'assessment:assess_foreign_famine:exploit_weakness': {
    axisWeights: { intrigue: 3, commerce: 1 },
  },
  'assessment:assess_foreign_famine:observe_from_distance': {
    axisWeights: {},
  },

  // assess_religious_movement
  'assessment:assess_religious_movement:investigate_movement': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_religious_movement:suppress_early': {
    axisWeights: { authority: 3, piety: 1 },
  },
  'assessment:assess_religious_movement:allow_to_grow': {
    axisWeights: { openness: 2, reform: 1 },
  },

  // assess_merchant_caravan_disappearance
  'assessment:assess_merchant_caravan_disappearance:fund_investigation': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_merchant_caravan_disappearance:increase_road_patrols': {
    axisWeights: { militarism: 2, authority: 1 },
  },
  'assessment:assess_merchant_caravan_disappearance:accept_losses': {
    axisWeights: {},
  },

  // assess_scholarly_heresy_manuscript
  'assessment:assess_scholarly_heresy_manuscript:examine_manuscript': {
    axisWeights: { openness: 3, intrigue: 1 },
  },
  'assessment:assess_scholarly_heresy_manuscript:seize_and_suppress': {
    axisWeights: { authority: 3, piety: 2 },
  },
  'assessment:assess_scholarly_heresy_manuscript:ignore_the_text': {
    axisWeights: {},
  },

  // assess_crop_blight_reports
  'assessment:assess_crop_blight_reports:dispatch_agronomists': {
    axisWeights: { reform: 2, intrigue: 1 },
  },
  'assessment:assess_crop_blight_reports:preemptive_rationing': {
    axisWeights: { authority: 3 },
  },
  'assessment:assess_crop_blight_reports:wait_for_confirmation': {
    axisWeights: {},
  },

  // assess_noble_faction_meeting
  'assessment:assess_noble_faction_meeting:infiltrate_meeting': {
    axisWeights: { intrigue: 4 },
  },
  'assessment:assess_noble_faction_meeting:confront_directly': {
    axisWeights: { authority: 3 },
  },
  'assessment:assess_noble_faction_meeting:let_them_meet': {
    axisWeights: {},
  },

  // assess_coastal_vessel_sighting
  'assessment:assess_coastal_vessel_sighting:send_naval_scouts': {
    axisWeights: { intrigue: 3, militarism: 1 },
  },
  'assessment:assess_coastal_vessel_sighting:fortify_harbor': {
    axisWeights: { militarism: 3, isolation: 1 },
  },
  'assessment:assess_coastal_vessel_sighting:observe_and_log': {
    axisWeights: {},
  },

  // assess_strange_illness_outbreak
  'assessment:assess_strange_illness_outbreak:quarantine_affected_area': {
    axisWeights: { authority: 3 },
  },
  'assessment:assess_strange_illness_outbreak:investigate_cause': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_strange_illness_outbreak:dismiss_as_seasonal': {
    axisWeights: {},
  },

  // ============================================================
  // SECTION 11: NEIGHBOR ACTIONS (range 3-6)
  // ============================================================

  // --- Crisis-tier ---

  // WarDeclaration (Critical)

  // Demand (Serious)

  // MilitaryBuildup (Serious)

  // EspionageRetaliation (Serious)

  // --- Petition-tier ---

  // TradeProposal (Notable)

  // TradeWithdrawal (Notable)

  // TreatyProposal (Notable)

  // PeaceOffer (Notable)

  // BorderTension (Notable)

  // ReligiousPressure (Notable)

  // ============================================================
  // SECTION 12: STORYLINES (range 6-12, opening + mid-arc only)
  // ============================================================

  // --- sl_pretenders_claim (Political) ---
  'storyline:sl_pretenders_claim:launch_espionage_investigation': {
    axisWeights: { intrigue: 8, authority: 2 },
  },
  'storyline:sl_pretenders_claim:open_direct_negotiation': {
    axisWeights: { openness: 7, reform: 2 },
  },
  'storyline:sl_pretenders_claim:issue_public_condemnation': {
    axisWeights: { authority: 9 },
  },
  'storyline:sl_pretenders_claim:expose_foreign_backing': {
    axisWeights: { intrigue: 9, authority: 2 },
  },
  'storyline:sl_pretenders_claim:offer_minor_title': {
    axisWeights: { openness: 8, reform: 2 },
  },
  'storyline:sl_pretenders_claim:rally_loyalist_nobles': {
    axisWeights: { authority: 10 },
  },

  // --- sl_prophet_of_the_waste (Religious) ---
  'storyline:sl_prophet_of_the_waste:send_clergy_investigation': {
    axisWeights: { piety: 7, intrigue: 2 },
  },
  'storyline:sl_prophet_of_the_waste:declare_tolerance': {
    axisWeights: { openness: 8, reform: 2 },
  },
  'storyline:sl_prophet_of_the_waste:order_suppression': {
    axisWeights: { authority: 8, piety: 3 },
  },
  'storyline:sl_prophet_of_the_waste:invite_prophet_to_capital': {
    axisWeights: { openness: 9, piety: 2 },
  },
  'storyline:sl_prophet_of_the_waste:integrate_teachings': {
    axisWeights: { piety: 9, reform: 3 },
  },
  'storyline:sl_prophet_of_the_waste:exile_the_prophet': {
    axisWeights: { authority: 9, isolation: 2 },
  },

  // --- sl_frozen_march (Military) ---
  'storyline:sl_frozen_march:conduct_reconnaissance': {
    axisWeights: { intrigue: 7, militarism: 2 },
  },
  'storyline:sl_frozen_march:dispatch_diplomatic_envoy': {
    axisWeights: { openness: 8 },
  },
  'storyline:sl_frozen_march:begin_military_preparation': {
    axisWeights: { militarism: 9 },
  },
  'storyline:sl_frozen_march:fortify_mountain_passes': {
    axisWeights: { militarism: 9, isolation: 2 },
  },
  'storyline:sl_frozen_march:seek_allied_reinforcements': {
    axisWeights: { openness: 8, militarism: 3 },
  },
  'storyline:sl_frozen_march:launch_preemptive_strike': {
    axisWeights: { militarism: 12 },
  },

  // --- sl_merchant_king (TradeEcon) ---
  'storyline:sl_merchant_king:impose_regulatory_limits': {
    axisWeights: { authority: 8, commerce: 1 },
  },
  'storyline:sl_merchant_king:accept_investment_offer': {
    axisWeights: { commerce: 9 },
  },
  'storyline:sl_merchant_king:await_and_observe': {
    axisWeights: { intrigue: 6 },
  },
  'storyline:sl_merchant_king:grant_noble_title': {
    axisWeights: { commerce: 10, authority: 2 },
  },
  'storyline:sl_merchant_king:seize_merchant_assets': {
    axisWeights: { authority: 10 },
  },
  'storyline:sl_merchant_king:broker_merchant_noble_alliance': {
    axisWeights: { commerce: 8, reform: 3 },
  },

  // --- sl_lost_expedition (Discovery) ---
  'storyline:sl_lost_expedition:dispatch_rescue_party': {
    axisWeights: { openness: 7, militarism: 2 },
  },
  'storyline:sl_lost_expedition:await_further_word': {
    axisWeights: { intrigue: 6 },
  },
  'storyline:sl_lost_expedition:send_scout_riders': {
    axisWeights: { intrigue: 7, openness: 1 },
  },
  'storyline:sl_lost_expedition:fund_full_excavation': {
    axisWeights: { openness: 9, commerce: 3 },
  },
  'storyline:sl_lost_expedition:secure_and_document': {
    axisWeights: { intrigue: 8, authority: 2 },
  },
  'storyline:sl_lost_expedition:abandon_the_site': {
    axisWeights: { isolation: 8 },
  },

  // --- sl_foreign_festival (Cultural) ---
  'storyline:sl_foreign_festival:embrace_cultural_exchange': {
    axisWeights: { openness: 9 },
  },
  'storyline:sl_foreign_festival:permit_with_restrictions': {
    axisWeights: { openness: 4, authority: 3 },
  },
  'storyline:sl_foreign_festival:restrict_foreign_practices': {
    axisWeights: { isolation: 8, authority: 2 },
  },
  'storyline:sl_foreign_festival:establish_cultural_quarter': {
    axisWeights: { openness: 10, commerce: 2 },
  },
  'storyline:sl_foreign_festival:host_synthesis_festival': {
    axisWeights: { openness: 9, piety: 2 },
  },
  'storyline:sl_foreign_festival:reassert_traditional_values': {
    axisWeights: { isolation: 10, piety: 2 },
  },

  // --- sl_merchants_rebellion (TradeEcon) ---
  'storyline:sl_merchants_rebellion:negotiate_guild_charter': {
    axisWeights: { commerce: 8, reform: 2 },
  },
  'storyline:sl_merchants_rebellion:crush_the_guild': {
    axisWeights: { authority: 10 },
  },
  'storyline:sl_merchants_rebellion:co_opt_guild_leaders': {
    axisWeights: { intrigue: 8, commerce: 2 },
  },
  'storyline:sl_merchants_rebellion:grant_trade_monopoly': {
    axisWeights: { commerce: 11 },
  },
  'storyline:sl_merchants_rebellion:impose_royal_oversight': {
    axisWeights: { authority: 10, commerce: 1 },
  },
  'storyline:sl_merchants_rebellion:pit_factions_against_each_other': {
    axisWeights: { intrigue: 10 },
  },

  // --- sl_holy_war (Religious) ---
  'storyline:sl_holy_war:defensive_stance': {
    axisWeights: { militarism: 7, piety: 3 },
  },
  'storyline:sl_holy_war:launch_counter_crusade': {
    axisWeights: { militarism: 10, piety: 4 },
  },
  'storyline:sl_holy_war:seek_diplomatic_peace': {
    axisWeights: { openness: 9, reform: 2 },
  },
  'storyline:sl_holy_war:rally_faithful_defenders': {
    axisWeights: { piety: 10, militarism: 3 },
  },
  'storyline:sl_holy_war:forge_interfaith_alliance': {
    axisWeights: { openness: 10, reform: 3 },
  },
  'storyline:sl_holy_war:scorched_earth_defense': {
    axisWeights: { militarism: 12, isolation: 2 },
  },

  // --- sl_prodigal_prince (Political) ---
  'storyline:sl_prodigal_prince:welcome_with_caution': {
    axisWeights: { openness: 6, intrigue: 3 },
  },
  'storyline:sl_prodigal_prince:investigate_claims': {
    axisWeights: { intrigue: 8 },
  },
  'storyline:sl_prodigal_prince:denounce_as_impostor': {
    axisWeights: { authority: 9 },
  },
  'storyline:sl_prodigal_prince:offer_advisory_role': {
    axisWeights: { openness: 8, reform: 2 },
  },
  'storyline:sl_prodigal_prince:confront_foreign_backers': {
    axisWeights: { intrigue: 9, isolation: 2 },
  },
  'storyline:sl_prodigal_prince:appeal_to_popular_opinion': {
    axisWeights: { reform: 9 },
  },

  // --- sl_plague_ships (Discovery) ---
  'storyline:sl_plague_ships:quarantine_the_harbor': {
    axisWeights: { authority: 8, isolation: 3 },
  },
  'storyline:sl_plague_ships:accept_the_cargo': {
    axisWeights: { commerce: 7, openness: 4 },
  },
  'storyline:sl_plague_ships:burn_the_ships': {
    axisWeights: { authority: 9, isolation: 3 },
  },
  'storyline:sl_plague_ships:isolate_and_treat': {
    axisWeights: { reform: 8, piety: 3 },
  },
  'storyline:sl_plague_ships:distribute_remedies': {
    axisWeights: { reform: 9, openness: 2 },
  },
  'storyline:sl_plague_ships:sacrifice_the_district': {
    axisWeights: { authority: 11 },
  },

  // --- sl_great_tournament (Military) ---
  'storyline:sl_great_tournament:diplomatic_showcase': {
    axisWeights: { openness: 8, authority: 1 },
  },
  'storyline:sl_great_tournament:military_demonstration': {
    axisWeights: { militarism: 9 },
  },
  'storyline:sl_great_tournament:cultural_celebration': {
    axisWeights: { openness: 7, piety: 2 },
  },
  'storyline:sl_great_tournament:exploit_diplomatic_moment': {
    axisWeights: { intrigue: 8, openness: 3 },
  },
  'storyline:sl_great_tournament:handle_tournament_incident': {
    axisWeights: { authority: 8, militarism: 2 },
  },
  'storyline:sl_great_tournament:host_grand_feast': {
    axisWeights: { openness: 8, commerce: 3 },
  },

  // --- sl_starving_winter (Cultural) ---
  'storyline:sl_starving_winter:ration_harshly': {
    axisWeights: { authority: 9, isolation: 2 },
  },
  'storyline:sl_starving_winter:seek_foreign_aid': {
    axisWeights: { openness: 9 },
  },
  'storyline:sl_starving_winter:sacrifice_military_stores': {
    axisWeights: { reform: 8 },
  },
  'storyline:sl_starving_winter:manage_refugee_crisis': {
    axisWeights: { reform: 9, openness: 2 },
  },
  'storyline:sl_starving_winter:tax_the_wealthy': {
    axisWeights: { reform: 10, authority: 2 },
  },
  'storyline:sl_starving_winter:abandon_outer_settlements': {
    axisWeights: { isolation: 10, authority: 2 },
  },

  // --- Scenario-Derived: sl_exp_merchants_gambit (TradeEcon) ---
  'storyline:sl_exp_merchants_gambit:court_the_merchant_guilds': {
    axisWeights: { commerce: 9, reform: 2 },
  },
  'storyline:sl_exp_merchants_gambit:tax_merchant_profits': {
    axisWeights: { authority: 8, commerce: 2 },
  },
  'storyline:sl_exp_merchants_gambit:establish_crown_trading_company': {
    axisWeights: { authority: 7, commerce: 3 },
  },
  'storyline:sl_exp_merchants_gambit:grant_guild_monopoly_rights': {
    axisWeights: { commerce: 10, reform: 2 },
  },
  'storyline:sl_exp_merchants_gambit:nationalize_key_trade_routes': {
    axisWeights: { authority: 10, commerce: 1 },
  },
  'storyline:sl_exp_merchants_gambit:broker_foreign_trade_pact': {
    axisWeights: { commerce: 8, openness: 3 },
  },

  // --- Scenario-Derived: sl_exp_frozen_march (Military) ---
  'storyline:sl_exp_frozen_march:mobilize_winter_defenses': {
    axisWeights: { militarism: 9, isolation: 1 },
  },
  'storyline:sl_exp_frozen_march:send_diplomatic_overture': {
    axisWeights: { openness: 8, reform: 1 },
  },
  'storyline:sl_exp_frozen_march:conscript_frontier_militia': {
    axisWeights: { militarism: 8, authority: 2 },
  },
  'storyline:sl_exp_frozen_march:launch_winter_offensive': {
    axisWeights: { militarism: 12 },
  },
  'storyline:sl_exp_frozen_march:fortify_and_endure': {
    axisWeights: { militarism: 8, isolation: 3 },
  },
  'storyline:sl_exp_frozen_march:negotiate_ceasefire_terms': {
    axisWeights: { openness: 9, reform: 2 },
  },

  // --- Scenario-Derived: sl_exp_fractured_inheritance (Political) ---
  'storyline:sl_exp_fractured_inheritance:appease_rival_claimants': {
    axisWeights: { openness: 7, reform: 2 },
  },
  'storyline:sl_exp_fractured_inheritance:assert_undivided_authority': {
    axisWeights: { authority: 9, militarism: 1 },
  },
  'storyline:sl_exp_fractured_inheritance:play_factions_against_each_other': {
    axisWeights: { intrigue: 9, authority: 1 },
  },
  'storyline:sl_exp_fractured_inheritance:convene_unity_council': {
    axisWeights: { reform: 8, openness: 2 },
  },
  'storyline:sl_exp_fractured_inheritance:purge_disloyal_nobles': {
    axisWeights: { authority: 11, intrigue: 1 },
  },
  'storyline:sl_exp_fractured_inheritance:offer_power_sharing_compact': {
    axisWeights: { reform: 9, openness: 2 },
  },

  // --- Scenario-Derived: sl_exp_faithful_kingdom (Religious) ---
  'storyline:sl_exp_faithful_kingdom:elevate_the_high_clergy': {
    axisWeights: { piety: 9, authority: 1 },
  },
  'storyline:sl_exp_faithful_kingdom:temper_clerical_influence': {
    axisWeights: { reform: 8, authority: 2 },
  },
  'storyline:sl_exp_faithful_kingdom:redirect_faith_to_charity': {
    axisWeights: { piety: 7, reform: 3 },
  },
  'storyline:sl_exp_faithful_kingdom:declare_state_orthodoxy': {
    axisWeights: { piety: 11, authority: 1 },
  },
  'storyline:sl_exp_faithful_kingdom:embrace_religious_tolerance': {
    axisWeights: { reform: 9, openness: 3 },
  },
  'storyline:sl_exp_faithful_kingdom:weaponize_faith_against_rivals': {
    axisWeights: { piety: 8, militarism: 4 },
  },

};
