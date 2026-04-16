import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_KINGDOM_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // --- 1. Coronation Anniversary (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_kgd_coronation_anniversary: {
    lavish_celebration:    { treasuryDelta: -30, stabilityDelta: +3, commonerSatDelta: +3, nobilitySatDelta: +2, clergySatDelta: -1 },
    solemn_ceremony:       { treasuryDelta: -10, stabilityDelta: +2, clergySatDelta: +2, commonerSatDelta: -1 },
    forgo_festivities:     { treasuryDelta: +10, stabilityDelta: -1, commonerSatDelta: -2 },
  },

  // --- 2. Succession Question (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_succession_question: {
    name_heir_publicly:        { stabilityDelta: +5, nobilitySatDelta: +3, commonerSatDelta: +2, treasuryDelta: -20 },
    establish_council_regency: { stabilityDelta: +3, nobilitySatDelta: -3, commonerSatDelta: +4, merchantSatDelta: +2 },
    dismiss_concerns:          { stabilityDelta: -4, nobilitySatDelta: -5, commonerSatDelta: -2 },
  },

  // --- 3. Royal Court Intrigue (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_court_intrigue: {
    investigate_factions:      { treasuryDelta: -30, stabilityDelta: +4, espionageNetworkDelta: +3, nobilitySatDelta: -3 },
    play_factions_against:     { stabilityDelta: -3, nobilitySatDelta: -2, espionageNetworkDelta: +5, treasuryDelta: +20 },
    ignore_rumors:             { stabilityDelta: -2, nobilitySatDelta: +2 },
  },

  // --- 4. Crown Treasury Audit (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_treasury_audit: {
    full_public_audit:         { treasuryDelta: +40, stabilityDelta: +3, nobilitySatDelta: -5, merchantSatDelta: -3 },
    quiet_internal_review:     { treasuryDelta: +20, stabilityDelta: +1, nobilitySatDelta: -2 },
    tighten_spending:          { treasuryDelta: +30, commonerSatDelta: -3, militaryCasteSatDelta: -2, stabilityDelta: -1 },
  },

  // --- 5. National Celebration Demand (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_kgd_national_celebration: {
    grand_royal_festival:      { treasuryDelta: -25, stabilityDelta: +3, commonerSatDelta: +3, nobilitySatDelta: +1, faithDelta: +1 },
    modest_observance:         { stabilityDelta: +1, commonerSatDelta: +1 },
    redirect_funds_to_needy:   { treasuryDelta: -15, commonerSatDelta: +3, nobilitySatDelta: -2, stabilityDelta: +1 },
  },

  // --- 6. Governance Reform Proposal (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_kgd_governance_reform: {
    accept_reforms:            { stabilityDelta: +6, commonerSatDelta: +5, nobilitySatDelta: -6, treasuryDelta: -50, merchantSatDelta: +3 },
    partial_concessions:       { stabilityDelta: +3, commonerSatDelta: +3, nobilitySatDelta: -3, treasuryDelta: -25 },
    reject_reforms:            { stabilityDelta: -5, commonerSatDelta: -6, nobilitySatDelta: +4, treasuryDelta: +20 },
  },

  // --- 7. Constitutional Crisis (Critical: -120/+80, -6/+8 sat) ---
  evt_exp_kgd_constitutional_crisis: {
    convene_emergency_council: { stabilityDelta: +8, commonerSatDelta: +5, nobilitySatDelta: +3, treasuryDelta: -80, militaryReadinessDelta: -3 },
    assert_royal_authority:    { stabilityDelta: -6, commonerSatDelta: -8, nobilitySatDelta: -4, militaryReadinessDelta: +5, militaryCasteSatDelta: +3 },
    offer_charter_of_rights:   { stabilityDelta: +5, commonerSatDelta: +8, nobilitySatDelta: -7, treasuryDelta: -40, merchantSatDelta: +4 },
  },

  // --- 8. Power Consolidation (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_kgd_power_consolidation: {
    centralize_authority:      { stabilityDelta: +5, nobilitySatDelta: -6, militaryCasteSatDelta: +4, treasuryDelta: +30, commonerSatDelta: -4 },
    delegate_to_governors:     { stabilityDelta: +2, nobilitySatDelta: +5, commonerSatDelta: +2, treasuryDelta: -30, regionDevelopmentDelta: +4 },
    maintain_balance:          { stabilityDelta: +1, nobilitySatDelta: -1 },
  },

  // --- 9. Royal Decree Dispute (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_decree_dispute: {
    enforce_decree:            { stabilityDelta: +3, nobilitySatDelta: -5, commonerSatDelta: +2, militaryReadinessDelta: -2 },
    amend_decree:              { stabilityDelta: +1, nobilitySatDelta: +3, commonerSatDelta: -2, treasuryDelta: -20 },
    rescind_decree:            { stabilityDelta: -4, nobilitySatDelta: +5, commonerSatDelta: -3 },
  },

  // --- 10. National Identity Debate (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_national_identity: {
    promote_cultural_pride:    { stabilityDelta: +3, culturalCohesionDelta: +5, commonerSatDelta: +3, diplomacyDeltas: { neighbor_arenthal: -5, neighbor_valdris: -5 } },
    emphasize_unity:           { stabilityDelta: +4, culturalCohesionDelta: +3, nobilitySatDelta: +2, commonerSatDelta: +1, treasuryDelta: -25 },
    let_discourse_continue:    { stabilityDelta: -2, culturalCohesionDelta: -3, commonerSatDelta: -1 },
  },

  // --- 11. Corruption Investigation (Serious: -80/+50, -4/+6 sat) ---
  evt_exp_kgd_corruption_investigation: {
    public_tribunal:           { treasuryDelta: +50, stabilityDelta: +5, nobilitySatDelta: -6, merchantSatDelta: -4, commonerSatDelta: +4 },
    private_purge:             { treasuryDelta: +30, stabilityDelta: +2, nobilitySatDelta: -4, espionageNetworkDelta: +3 },
    offer_amnesty:             { stabilityDelta: -3, nobilitySatDelta: +4, commonerSatDelta: -5, treasuryDelta: -20 },
  },

  // --- 12. Administrative Overhaul (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_admin_overhaul: {
    comprehensive_restructuring: { treasuryDelta: -50, stabilityDelta: +5, commonerSatDelta: +3, nobilitySatDelta: -3, regionDevelopmentDelta: +3 },
    incremental_improvements:    { treasuryDelta: -25, stabilityDelta: +3, merchantSatDelta: +2, nobilitySatDelta: -1 },
    preserve_traditions:         { nobilitySatDelta: +3, commonerSatDelta: -2, stabilityDelta: -1 },
  },

  // --- 13. Crown Land Management (Notable: -50/+40, -3/+5 sat) ---
  evt_exp_kgd_crown_land: {
    open_crown_lands:          { foodDelta: +30, commonerSatDelta: +4, nobilitySatDelta: -5, stabilityDelta: +2, regionDevelopmentDelta: +3 },
    lease_to_nobility:         { treasuryDelta: +40, nobilitySatDelta: +4, commonerSatDelta: -3, stabilityDelta: -1 },
    preserve_royal_domain:     { stabilityDelta: +1, nobilitySatDelta: -1, commonerSatDelta: -2 },
  },

  // --- 14. Royal Legacy (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_kgd_royal_legacy: {
    commission_monument:       { treasuryDelta: -30, stabilityDelta: +3, culturalCohesionDelta: +3, commonerSatDelta: +2, nobilitySatDelta: +1 },
    endow_scholarly_archive:   { treasuryDelta: -20, stabilityDelta: +2, clergySatDelta: +3, culturalCohesionDelta: +2, commonerSatDelta: -1 },
    let_deeds_speak:           { stabilityDelta: +1 },
  },

  // --- 15. Royal Steward's Ledger (Informational: -15/+30, +1/+3 sat) ---
  evt_exp_kgd_steward_ledger: {
    prioritize_public_welfare:     { treasuryDelta: -20, commonerSatDelta: +3, stabilityDelta: +2, nobilitySatDelta: -1 },
    invest_in_royal_authority:     { treasuryDelta: -15, stabilityDelta: +3, nobilitySatDelta: +2, commonerSatDelta: -1 },
    maintain_current_allocations:  { stabilityDelta: +1 },
  },
};
