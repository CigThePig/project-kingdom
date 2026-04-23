import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_RELIGION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- 1. Miracle Claims (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_rel_miracle_claims: {
    endorse_miracle:           { faithDelta: +3, clergySatDelta: +3, heterodoxyDelta: -2, commonerSatDelta: +1, stabilityDelta: -1 },
    order_investigation:       { faithDelta: +1, clergySatDelta: -1, heterodoxyDelta: -1, treasuryDelta: -10 },
    remain_silent:             { faithDelta: -1, clergySatDelta: -1, heterodoxyDelta: +2 },
  },

  // --- 2. Heretical Texts Discovered (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_heretical_texts: {
    public_burning:            { faithDelta: +4, clergySatDelta: +5, heterodoxyDelta: -5, commonerSatDelta: -3, culturalCohesionDelta: -2 },
    scholarly_review:          { faithDelta: +1, clergySatDelta: -2, heterodoxyDelta: +3, culturalCohesionDelta: +3, commonerSatDelta: +1 },
    suppress_quietly:          { faithDelta: +2, clergySatDelta: +2, heterodoxyDelta: -2, espionageNetworkDelta: +2 },
  },

  // --- 3. Religious Order Expansion (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_order_expansion: {
    grant_charter:             { faithDelta: +4, clergySatDelta: +5, treasuryDelta: -30, nobilitySatDelta: -3, regionDevelopmentDelta: +3 },
    limit_expansion:           { faithDelta: -1, clergySatDelta: -3, nobilitySatDelta: +3, stabilityDelta: +2 },
    demand_crown_oversight:    { faithDelta: +1, clergySatDelta: -2, treasuryDelta: +15, heterodoxyDelta: -2, stabilityDelta: +1 },
  },

  // --- 4. Temple Construction Demands (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_temple_construction: {
    fund_grand_temple:         { treasuryDelta: -50, faithDelta: +5, clergySatDelta: +5, commonerSatDelta: +2, regionDevelopmentDelta: +4, heterodoxyDelta: -3 },
    modest_chapel:             { treasuryDelta: -20, faithDelta: +3, clergySatDelta: +2, regionDevelopmentDelta: +2 },
    decline_construction:      { clergySatDelta: -4, faithDelta: -2, commonerSatDelta: -1, treasuryDelta: +5, regionConditionDelta: -1 },
  },

  // --- 5. Interfaith Dialogue (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_interfaith_dialogue: {
    host_dialogue:             { faithDelta: +2, heterodoxyDelta: +4, clergySatDelta: -3, culturalCohesionDelta: +3, diplomacyDeltas: { neighbor_arenthal: +5 } },
    permit_cautiously:         { faithDelta: +1, heterodoxyDelta: +2, clergySatDelta: -1, diplomacyDeltas: { neighbor_arenthal: +3 } },
    forbid_dialogue:           { faithDelta: +3, heterodoxyDelta: -3, clergySatDelta: +4, diplomacyDeltas: { neighbor_arenthal: -5 }, culturalCohesionDelta: -2 },
  },

  // --- 6. Pilgrimage Season (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_rel_pilgrimage_season: {
    provide_escorts:           { treasuryDelta: -15, faithDelta: +3, clergySatDelta: +2, commonerSatDelta: +1, militaryReadinessDelta: -1 },
    tax_pilgrims:              { treasuryDelta: +20, faithDelta: -2, clergySatDelta: -3, commonerSatDelta: -1, merchantSatDelta: +2 },
    permit_freely:             { faithDelta: +1, clergySatDelta: +1 },
  },

  // --- 7. Divine Portent Interpretation (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_rel_divine_portent: {
    declare_divine_favor:      { faithDelta: +6, clergySatDelta: +5, heterodoxyDelta: -4, commonerSatDelta: +3, stabilityDelta: +3, nobilitySatDelta: -2 },
    call_for_penance:          { faithDelta: +4, clergySatDelta: +4, commonerSatDelta: -4, treasuryDelta: -30, heterodoxyDelta: -3, stabilityDelta: +2 },
    dismiss_superstition:      { faithDelta: -5, clergySatDelta: -6, heterodoxyDelta: +5, commonerSatDelta: -2, nobilitySatDelta: +3, merchantSatDelta: +2 },
  },

  // --- 8. Clerical Corruption (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_rel_clerical_corruption: {
    royal_inquisition:         { faithDelta: +5, clergySatDelta: -6, commonerSatDelta: +5, heterodoxyDelta: -4, treasuryDelta: +30, stabilityDelta: +3 },
    internal_reform:           { faithDelta: +3, clergySatDelta: -2, commonerSatDelta: +3, heterodoxyDelta: -2, treasuryDelta: -20 },
    look_the_other_way:        { faithDelta: -4, clergySatDelta: +3, commonerSatDelta: -5, heterodoxyDelta: +4, stabilityDelta: -3 },
  },

  // --- 9. Religious Holiday Observance (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_rel_holiday_observance: {
    crown_sponsored_rites:     { treasuryDelta: -20, faithDelta: +3, clergySatDelta: +2, commonerSatDelta: +2, heterodoxyDelta: -1 },
    permit_observance:         { faithDelta: +1, clergySatDelta: +1, commonerSatDelta: +1, treasuryDelta: -2 },
    curtail_festivities:       { faithDelta: -2, clergySatDelta: -2, commonerSatDelta: -2, treasuryDelta: +10, heterodoxyDelta: +2 },
  },

  // --- 10. Monastery Funding (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_monastery_funding: {
    generous_endowment:        { treasuryDelta: -40, faithDelta: +5, clergySatDelta: +5, heterodoxyDelta: -3, regionDevelopmentDelta: +3 },
    conditional_funding:       { treasuryDelta: -20, faithDelta: +3, clergySatDelta: +2, heterodoxyDelta: -1, nobilitySatDelta: +1 },
    deny_funding:              { clergySatDelta: -4, faithDelta: -3, heterodoxyDelta: +3, commonerSatDelta: -1, treasuryDelta: +5 },
  },

  // --- 11. Sacred Site Desecration (Critical: -120/+80, -6/+8 sat) ---
  evt_exp_rel_sacred_desecration: {
    hunt_perpetrators:         { faithDelta: +6, clergySatDelta: +7, heterodoxyDelta: -6, treasuryDelta: -60, militaryReadinessDelta: -3, commonerSatDelta: -2, stabilityDelta: +4 },
    consecrate_and_restore:    { faithDelta: +8, clergySatDelta: +5, treasuryDelta: -80, heterodoxyDelta: -4, regionConditionDelta: +5, commonerSatDelta: +3 },
    call_for_reconciliation:   { faithDelta: +2, clergySatDelta: -4, heterodoxyDelta: +5, commonerSatDelta: +4, culturalCohesionDelta: +3, stabilityDelta: +3, nobilitySatDelta: -2 },
  },

  // --- 12. Faith Healing Movement (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_faith_healing: {
    support_movement:          { faithDelta: +4, clergySatDelta: +3, commonerSatDelta: +4, heterodoxyDelta: +3, treasuryDelta: -15 },
    regulate_practices:        { faithDelta: +2, clergySatDelta: +1, commonerSatDelta: +1, heterodoxyDelta: -1, treasuryDelta: -10 },
    ban_practitioners:         { faithDelta: -2, clergySatDelta: +2, commonerSatDelta: -5, heterodoxyDelta: -3 },
  },

  // --- 13. Religious Education Reform (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_rel_education_reform: {
    expand_religious_schools:  { faithDelta: +4, clergySatDelta: +4, treasuryDelta: -35, heterodoxyDelta: -3, commonerSatDelta: +2, culturalCohesionDelta: +2 },
    secular_curriculum:        { faithDelta: -2, clergySatDelta: -4, merchantSatDelta: +3, commonerSatDelta: +3, heterodoxyDelta: +3, treasuryDelta: -25 },
    maintain_status_quo:       { clergySatDelta: +1, faithDelta: +1, heterodoxyDelta: +1 },
  },

  // --- 14. Court Chaplain's Blessing (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_rel_chaplain_blessing: {
    public_devotion:           { treasuryDelta: -15, faithDelta: +3, clergySatDelta: +3, commonerSatDelta: +1, nobilitySatDelta: -1 },
    private_piety:             { faithDelta: +1, clergySatDelta: +1 },
    emphasize_secular_duties:  { faithDelta: -1, clergySatDelta: -2, nobilitySatDelta: +2, stabilityDelta: +1 },
  },
};
