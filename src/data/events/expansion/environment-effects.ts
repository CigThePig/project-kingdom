import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_ENVIRONMENT_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- Opening Phase ---
  evt_exp_env_spring_thaw_floods: {
    build_emergency_levees:  { treasuryDelta: -40, regionConditionDelta: +3, commonerSatDelta: +2, stabilityDelta: +1 },
    evacuate_lowlands:       { commonerSatDelta: -2, foodDelta: -10, stabilityDelta: +2 },
    let_waters_recede:       { regionConditionDelta: -3, commonerSatDelta: -1 },
  },
  evt_exp_env_mild_winter_blessing: {
    extend_planting_season:  { foodDelta: +15, treasuryDelta: -10, commonerSatDelta: +1 },
    enjoy_the_respite:       { commonerSatDelta: +1, stabilityDelta: +1 },
  },
  evt_exp_env_new_spring_growth: {
    clear_new_fields:        { foodDelta: +10, treasuryDelta: -15, regionDevelopmentDelta: +3, commonerSatDelta: +1 },
    preserve_the_woodlands:  { culturalCohesionDelta: +1, regionConditionDelta: +2 },
  },

  // --- Developing Phase ---
  evt_exp_env_forest_fire: {
    mobilize_firefighting_brigades: { treasuryDelta: -50, regionConditionDelta: -2, commonerSatDelta: +3, stabilityDelta: +2, foodDelta: -3 },
    create_firebreaks:              { treasuryDelta: -30, regionConditionDelta: -4, foodDelta: -5 },
    evacuate_and_wait:              { regionConditionDelta: -6, commonerSatDelta: -3, foodDelta: -15 },
  },
  evt_exp_env_locust_swarm: {
    organize_pest_drives:    { treasuryDelta: -30, foodDelta: -10, commonerSatDelta: +2 },
    burn_afflicted_fields:   { foodDelta: -25, regionConditionDelta: -3, stabilityDelta: +1 },
    pray_for_deliverance:    { foodDelta: -20, faithDelta: +2, commonerSatDelta: -2 },
  },
  evt_exp_env_river_pollution: {
    regulate_tanneries:      { merchantSatDelta: -3, commonerSatDelta: +2, regionConditionDelta: +2, treasuryDelta: -15 },
    relocate_workshops:      { treasuryDelta: -40, merchantSatDelta: -2, regionConditionDelta: +4, regionDevelopmentDelta: +2 },
    ignore_complaints:       { commonerSatDelta: -3, regionConditionDelta: -2 },
  },
  evt_exp_env_soil_exhaustion: {
    implement_field_rotation: { foodDelta: +10, treasuryDelta: -20, regionDevelopmentDelta: +3 },
    import_fertile_soil:      { treasuryDelta: -45, foodDelta: +15, merchantSatDelta: +1 },
    push_harder_next_season:  { foodDelta: -5, commonerSatDelta: -2, regionConditionDelta: -3 },
  },

  // --- Established Phase ---
  evt_exp_env_earthquake: {
    launch_rescue_operations:  { treasuryDelta: -100, commonerSatDelta: +5, stabilityDelta: +3, regionConditionDelta: -5 },
    prioritize_infrastructure: { treasuryDelta: -70, regionConditionDelta: -3, regionDevelopmentDelta: -2, stabilityDelta: +1 },
    call_for_prayer_and_calm:  { regionConditionDelta: -8, commonerSatDelta: -4, faithDelta: +3, stabilityDelta: -3, treasuryDelta: -5 },
  },
  evt_exp_env_volcanic_ash_cloud: {
    seal_granaries_and_ration: { foodDelta: -15, commonerSatDelta: -3, stabilityDelta: +2, treasuryDelta: -20 },
    organize_mass_shelter:     { treasuryDelta: -60, commonerSatDelta: +3, stabilityDelta: +1, regionConditionDelta: -4 },
    wait_for_skies_to_clear:   { foodDelta: -30, commonerSatDelta: -5, regionConditionDelta: -6, stabilityDelta: -4 },
  },
  evt_exp_env_deforestation_crisis: {
    establish_royal_forest_reserves: { treasuryDelta: -30, commonerSatDelta: -2, regionConditionDelta: +5, culturalCohesionDelta: +2 },
    tax_lumber_operations:           { treasuryDelta: +30, merchantSatDelta: -3, commonerSatDelta: -2, regionConditionDelta: +1 },
    allow_continued_clearing:        { regionConditionDelta: -5, foodDelta: +10, commonerSatDelta: -1 },
  },
  evt_exp_env_coastal_erosion: {
    build_sea_walls:             { treasuryDelta: -50, regionConditionDelta: +3, regionDevelopmentDelta: +2, commonerSatDelta: +1 },
    relocate_coastal_villages:   { treasuryDelta: -35, commonerSatDelta: -3, regionDevelopmentDelta: -2, stabilityDelta: +1 },
    accept_gradual_loss:         { regionConditionDelta: -4, commonerSatDelta: -2, merchantSatDelta: -1, treasuryDelta: -5 },
  },
  evt_exp_env_great_storm: {
    emergency_fortification:       { treasuryDelta: -80, regionConditionDelta: -3, stabilityDelta: +3, commonerSatDelta: +2 },
    distribute_emergency_supplies: { treasuryDelta: -50, foodDelta: -15, commonerSatDelta: +4, regionConditionDelta: -5 },
    shelter_in_place:              { regionConditionDelta: -8, commonerSatDelta: -5, foodDelta: -10, stabilityDelta: -4, treasuryDelta: -10 },
  },
  evt_exp_env_mine_contamination: {
    shut_down_mine:        { treasuryDelta: -40, commonerSatDelta: +3, regionConditionDelta: +4, merchantSatDelta: -3 },
    invest_in_drainage:    { treasuryDelta: -60, regionConditionDelta: +2, merchantSatDelta: +1 },
    continue_operations:   { commonerSatDelta: -4, regionConditionDelta: -4, treasuryDelta: +20 },
  },

  // --- Any Phase ---
  evt_exp_env_harsh_winter_early: {
    accelerate_harvest:    { foodDelta: +15, commonerSatDelta: -2, treasuryDelta: -20 },
    open_emergency_stores: { foodDelta: +20, treasuryDelta: -30, stabilityDelta: +2 },
    trust_preparations:    { foodDelta: -5, commonerSatDelta: -1 },
  },
  evt_exp_env_bountiful_rainfall: {
    expand_irrigation:       { foodDelta: +15, treasuryDelta: -20, regionDevelopmentDelta: +3 },
    celebrate_good_fortune:  { commonerSatDelta: +2, faithDelta: +1 },
  },
  evt_exp_env_medicinal_springs: {
    build_healing_baths:   { treasuryDelta: -40, commonerSatDelta: +3, culturalCohesionDelta: +2, regionDevelopmentDelta: +3 },
    grant_to_clergy:       { clergySatDelta: +4, faithDelta: +3, treasuryDelta: -15, commonerSatDelta: -1 },
    leave_undeveloped:     { regionConditionDelta: +1 },
  },
  evt_exp_env_summer_heat_wave: {
    ration_water_supplies: { foodDelta: -5, commonerSatDelta: -1, stabilityDelta: +2 },
    dig_new_wells:         { treasuryDelta: -35, commonerSatDelta: +2, regionDevelopmentDelta: +2, foodDelta: +5 },
    endure_the_heat:       { commonerSatDelta: -3, foodDelta: -10 },
  },
  evt_exp_env_animal_migration: {
    organize_hunts:  { foodDelta: +10, militaryMoraleDelta: +1, regionConditionDelta: -1 },
    protect_herds:   { culturalCohesionDelta: +1, commonerSatDelta: +1 },
  },
};
