import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_MILITARY_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Border Patrol Gaps — Informational
  // ============================================================
  evt_exp_mil_border_patrol_gaps: {
    increase_patrol_frequency:  { treasuryDelta: -20, militaryReadinessDelta: +3, militaryMoraleDelta: -1 },
    recruit_local_militia:      { treasuryDelta: -10, militaryForceSizeDelta: +50, militaryReadinessDelta: +1, commonerSatDelta: -2 },
    accept_current_coverage:    { militaryReadinessDelta: -2, regionConditionDelta: -1 },
  },

  // ============================================================
  // 2. Weapons Smithing Proposal — Notable
  // ============================================================
  evt_exp_mil_weapons_smithing: {
    fund_royal_armory:      { treasuryDelta: -50, militaryEquipmentDelta: +6, militaryCasteSatDelta: +3, merchantSatDelta: -2 },
    contract_guild_smiths:  { treasuryDelta: -35, militaryEquipmentDelta: +4, merchantSatDelta: +3, militaryCasteSatDelta: +1 },
    postpone_investment:    { militaryEquipmentDelta: -2, militaryCasteSatDelta: -2, treasuryDelta: +5 },
  },

  // ============================================================
  // 3. Cavalry Training Grounds — Serious
  // ============================================================
  evt_exp_mil_cavalry_training: {
    build_cavalry_academy:    { treasuryDelta: -80, militaryReadinessDelta: +6, militaryMoraleDelta: +4, regionDevelopmentDelta: +3, commonerSatDelta: -3 },
    expand_existing_stables:  { treasuryDelta: -40, militaryReadinessDelta: +3, militaryMoraleDelta: +2, foodDelta: -10 },
    maintain_infantry_focus:  { militaryCasteSatDelta: -2, militaryReadinessDelta: -1 },
  },

  // ============================================================
  // 4. Siege Preparations — Critical
  // ============================================================
  evt_exp_mil_siege_preparations: {
    full_siege_mobilization:       { treasuryDelta: -120, militaryReadinessDelta: +8, militaryEquipmentDelta: +6, militaryForceSizeDelta: +100, commonerSatDelta: -6, merchantSatDelta: -4 },
    reinforce_key_fortifications:  { treasuryDelta: -70, militaryReadinessDelta: +5, regionConditionDelta: +4, militaryEquipmentDelta: +3, commonerSatDelta: -3 },
    seek_diplomatic_resolution:    { treasuryDelta: -30, stabilityDelta: +3, militaryCasteSatDelta: -4, diplomacyDeltas: { neighbor_valdris: +5 } },
  },

  // ============================================================
  // 5. Veteran Pensions — Notable
  // ============================================================
  evt_exp_mil_veteran_pensions: {
    establish_pension_fund:    { treasuryDelta: -40, militaryCasteSatDelta: +5, militaryMoraleDelta: +3, merchantSatDelta: -2 },
    grant_farmland_plots:      { foodDelta: -10, militaryCasteSatDelta: +4, commonerSatDelta: -3, regionDevelopmentDelta: +2, treasuryDelta: -10 },
    honor_with_ceremony_only:  { militaryCasteSatDelta: +1, militaryMoraleDelta: -2, treasuryDelta: -3 },
  },

  // ============================================================
  // 6. Military Academy Proposal — Serious
  // ============================================================
  evt_exp_mil_academy_proposal: {
    found_royal_academy:      { treasuryDelta: -80, militaryReadinessDelta: +5, militaryMoraleDelta: +4, militaryCasteSatDelta: +4, nobilitySatDelta: -3 },
    expand_officer_training:  { treasuryDelta: -40, militaryReadinessDelta: +3, militaryMoraleDelta: +2, nobilitySatDelta: -1 },
    defer_to_peacetime:       { militaryCasteSatDelta: -3, militaryMoraleDelta: -2 },
  },

  // ============================================================
  // 7. Mercenary Company Offer — Notable
  // ============================================================
  evt_exp_mil_mercenary_offer: {
    hire_full_company:    { treasuryDelta: -50, militaryForceSizeDelta: +200, militaryReadinessDelta: +4, militaryCasteSatDelta: -3, stabilityDelta: -2 },
    hire_scouts_only:     { treasuryDelta: -25, militaryReadinessDelta: +2, espionageNetworkDelta: +2, militaryCasteSatDelta: -1 },
    decline_mercenaries:  { militaryCasteSatDelta: +1, treasuryDelta: +5 },
  },

  // ============================================================
  // 8. Arms Deal with Arenthal — Serious
  // ============================================================
  evt_exp_mil_arms_deal: {
    accept_arms_shipment:   { treasuryDelta: -60, militaryEquipmentDelta: +6, militaryReadinessDelta: +3, diplomacyDeltas: { neighbor_arenthal: +3 }, nobilitySatDelta: -2 },
    negotiate_mutual_pact:  { treasuryDelta: -30, militaryEquipmentDelta: +3, diplomacyDeltas: { neighbor_arenthal: +5, neighbor_valdris: -3 }, militaryReadinessDelta: +2 },
    politely_refuse:        { diplomacyDeltas: { neighbor_arenthal: -2 }, militaryCasteSatDelta: -1 },
  },

  // ============================================================
  // 9. Fortification Decay — Notable
  // ============================================================
  evt_exp_mil_fortification_decay: {
    full_restoration:        { treasuryDelta: -45, regionConditionDelta: +5, militaryReadinessDelta: +3, commonerSatDelta: -1 },
    patch_critical_sections: { treasuryDelta: -20, regionConditionDelta: +2, militaryReadinessDelta: +1 },
    delay_repairs:           { regionConditionDelta: -3, militaryReadinessDelta: -3, stabilityDelta: -1 },
  },

  // ============================================================
  // 10. War Hero Recognition — Informational
  // ============================================================
  evt_exp_mil_war_hero: {
    public_ceremony:          { treasuryDelta: -15, militaryMoraleDelta: +3, militaryCasteSatDelta: +2, commonerSatDelta: +1 },
    promote_to_officer:       { militaryMoraleDelta: +2, militaryReadinessDelta: +1, nobilitySatDelta: -1 },
    note_service_in_records:  { militaryCasteSatDelta: +1, militaryMoraleDelta: -1 },
  },

  // ============================================================
  // 11. Court Martial — Serious
  // ============================================================
  evt_exp_mil_court_martial: {
    public_tribunal:      { stabilityDelta: +4, militaryMoraleDelta: -3, militaryCasteSatDelta: -2, commonerSatDelta: +2, treasuryDelta: -20 },
    quiet_discharge:      { stabilityDelta: +1, militaryMoraleDelta: +2, militaryCasteSatDelta: -1, nobilitySatDelta: -2 },
    pardon_and_reassign:  { militaryCasteSatDelta: +3, stabilityDelta: -3, commonerSatDelta: -2, militaryMoraleDelta: -1 },
  },

  // ============================================================
  // 12. Soldier Discipline Crisis — Serious
  // ============================================================
  evt_exp_mil_discipline_crisis: {
    enforce_strict_discipline:  { militaryMoraleDelta: -4, militaryReadinessDelta: +5, stabilityDelta: +3, militaryCasteSatDelta: -3 },
    address_grievances:         { treasuryDelta: -40, militaryCasteSatDelta: +4, militaryMoraleDelta: +3, nobilitySatDelta: -2 },
    rotate_troublesome_units:   { militaryReadinessDelta: -3, militaryMoraleDelta: +1, stabilityDelta: +2, regionConditionDelta: -2 },
  },

  // ============================================================
  // 13. Supply Chain Disruption — Critical
  // ============================================================
  evt_exp_mil_supply_chain: {
    emergency_supply_convoy:      { treasuryDelta: -100, foodDelta: +30, militaryReadinessDelta: +5, militaryMoraleDelta: +3, merchantSatDelta: -4, regionDevelopmentDelta: +1 },
    requisition_from_merchants:   { foodDelta: +20, merchantSatDelta: -6, militaryReadinessDelta: +3, commonerSatDelta: -3, regionConditionDelta: -1 },
    ration_existing_supplies:     { foodDelta: -10, militaryMoraleDelta: -4, militaryCasteSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -2 },
  },

  // ============================================================
  // 14. Military Intelligence Report — Informational
  // ============================================================
  evt_exp_mil_intel_report: {
    increase_border_watch:        { treasuryDelta: -15, militaryReadinessDelta: +2, militaryMoraleDelta: +1, diplomacyDeltas: { neighbor_valdris: -1 } },
    deploy_counter_intelligence:  { treasuryDelta: -20, espionageNetworkDelta: +3, militaryReadinessDelta: +1 },
    file_the_report:              { militaryReadinessDelta: -1 },
  },

  // ============================================================
  // 15. Conscription Dispute — Notable
  // ============================================================
  evt_exp_mil_conscription_dispute: {
    enforce_conscription_quotas:  { militaryForceSizeDelta: +150, commonerSatDelta: -5, stabilityDelta: -2, militaryReadinessDelta: +2 },
    offer_volunteer_incentives:   { treasuryDelta: -35, militaryForceSizeDelta: +80, commonerSatDelta: +2, militaryCasteSatDelta: +2 },
    reduce_levy_demands:          { commonerSatDelta: +3, militaryForceSizeDelta: -50, militaryCasteSatDelta: -3 },
  },

  // ============================================================
  // 16. War Preparations — Critical
  // ============================================================
  evt_exp_mil_war_preparations: {
    full_war_mobilization:         { treasuryDelta: -120, militaryReadinessDelta: +8, militaryEquipmentDelta: +5, militaryForceSizeDelta: +200, militaryMoraleDelta: +4, commonerSatDelta: -6, merchantSatDelta: -5, foodDelta: -20 },
    defensive_preparations_only:   { treasuryDelta: -60, militaryReadinessDelta: +5, regionConditionDelta: +4, militaryEquipmentDelta: +3, commonerSatDelta: -3 },
    last_chance_diplomacy:         { treasuryDelta: -40, diplomacyDeltas: { neighbor_valdris: +4 }, militaryCasteSatDelta: -5, nobilitySatDelta: -2, stabilityDelta: +2 },
  },

  // ============================================================
  // 17. Battlefield Medicine — Notable
  // ============================================================
  evt_exp_mil_battlefield_medicine: {
    establish_field_hospitals:  { treasuryDelta: -40, militaryMoraleDelta: +4, militaryCasteSatDelta: +3, clergySatDelta: +1, militaryReadinessDelta: -1, faithDelta: +1 },
    train_combat_medics:        { treasuryDelta: -25, militaryMoraleDelta: +2, militaryReadinessDelta: +2, commonerSatDelta: -1, faithDelta: +1 },
    rely_on_camp_followers:     { militaryMoraleDelta: -2, militaryCasteSatDelta: -1, faithDelta: -1 },
  },

  // ============================================================
  // 18. Strategic Alliance — Critical
  // ============================================================
  evt_exp_mil_strategic_alliance: {
    formal_military_pact:     { treasuryDelta: -80, diplomacyDeltas: { neighbor_arenthal: +8, neighbor_valdris: -5 }, militaryReadinessDelta: +6, nobilitySatDelta: -4, militaryMoraleDelta: +4 },
    limited_cooperation:      { treasuryDelta: -30, diplomacyDeltas: { neighbor_arenthal: +4 }, militaryReadinessDelta: +3, militaryEquipmentDelta: +2, nobilitySatDelta: -1 },
    maintain_independence:    { nobilitySatDelta: +2, diplomacyDeltas: { neighbor_arenthal: -3 }, militaryCasteSatDelta: -2 },
  },

  // ============================================================
  // 19. Weapon Innovation — Informational
  // ============================================================
  evt_exp_mil_weapon_innovation: {
    fund_prototype:          { treasuryDelta: -25, militaryEquipmentDelta: +3, militaryReadinessDelta: +1, merchantSatDelta: -1 },
    commission_field_trials: { treasuryDelta: -15, militaryEquipmentDelta: +2, militaryMoraleDelta: +1 },
    archive_the_designs:     { militaryEquipmentDelta: +1 },
  },

  // ============================================================
  // 20. Naval Operations — Serious
  // ============================================================
  evt_exp_mil_naval_operations: {
    commission_war_galleys:  { treasuryDelta: -70, militaryReadinessDelta: +5, militaryEquipmentDelta: +4, militaryMoraleDelta: +3, commonerSatDelta: -4, foodDelta: -10 },
    refit_merchant_vessels:  { treasuryDelta: -35, militaryReadinessDelta: +3, merchantSatDelta: -3, militaryEquipmentDelta: +2 },
    focus_on_land_forces:    { militaryCasteSatDelta: -1, militaryReadinessDelta: -1, merchantSatDelta: +1 },
  },

  // ============================================================
  // 21. Garrison Inspection — Informational
  // ============================================================
  evt_exp_mil_garrison_inspection: {
    fund_equipment_upgrades:    { treasuryDelta: -25, militaryEquipmentDelta: +3, militaryReadinessDelta: +2, militaryCasteSatDelta: +2 },
    host_a_feast_for_soldiers:  { treasuryDelta: -15, militaryMoraleDelta: +3, militaryCasteSatDelta: +3, commonerSatDelta: -1 },
    note_the_report:            { militaryCasteSatDelta: -1, militaryMoraleDelta: -1 },
  },
};
