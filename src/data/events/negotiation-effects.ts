// Workstream A — Task A4: Negotiation Term Effects
// Maps negotiationId → termId/rejectId → MechanicalEffectDelta.
// Every negotiation has at least one genuinely costly term so that
// "accept all" is never the obvious play.

import type { MechanicalEffectDelta } from '../../engine/types';

export const NEGOTIATION_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // neg_trade_deal — Foreign kingdom proposes trade
  // ============================================================
  neg_trade_deal: {
    exclusive_market_access: {
      treasuryDelta: +20,
      merchantSatDelta: -3,
      diplomacyDeltas: { __NEIGHBOR__: +5 },
    },
    bulk_pricing_agreement: {
      treasuryDelta: +10,
      commonerSatDelta: +2,
      merchantSatDelta: -2,
    },
    port_rights_concession: {
      merchantSatDelta: +4,
      militaryReadinessDelta: -3,
      diplomacyDeltas: { __NEIGHBOR__: +8 },
    },
    reject_trade_deal: {
      diplomacyDeltas: { __NEIGHBOR__: -5 },
      merchantSatDelta: -2,
    },
  },

  // ============================================================
  // neg_treaty_terms — Foreign kingdom proposes formal treaty
  // ============================================================
  neg_treaty_terms: {
    mutual_defense_clause: {
      stabilityDelta: +3,
      militaryReadinessDelta: -5,
      diplomacyDeltas: { __NEIGHBOR__: +10 },
    },
    trade_corridor_rights: {
      treasuryDelta: +15,
      merchantSatDelta: +2,
      commonerSatDelta: -1,
    },
    border_access_agreement: {
      diplomacyDeltas: { __NEIGHBOR__: +8 },
      espionageNetworkDelta: -3,
      militaryReadinessDelta: -2,
    },
    reject_treaty_terms: {
      diplomacyDeltas: { __NEIGHBOR__: -8 },
      stabilityDelta: -1,
    },
  },

  // ============================================================
  // neg_peace_terms — End of war peace negotiation
  // ============================================================
  neg_peace_terms: {
    war_reparations: {
      treasuryDelta: -60,
      commonerSatDelta: -2,
      diplomacyDeltas: { __NEIGHBOR__: +10 },
    },
    prisoner_exchange: {
      militaryCasteSatDelta: +4,
      militaryMoraleDelta: +3,
      diplomacyDeltas: { __NEIGHBOR__: +5 },
    },
    territorial_concession: {
      regionDevelopmentDelta: -4,
      nobilitySatDelta: -5,
      diplomacyDeltas: { __NEIGHBOR__: +15 },
      stabilityDelta: -3,
    },
    trade_normalization: {
      merchantSatDelta: +3,
      treasuryDelta: +15,
      diplomacyDeltas: { __NEIGHBOR__: +5 },
    },
    reject_peace_terms: {
      militaryMoraleDelta: +2,
      commonerSatDelta: -3,
      stabilityDelta: -2,
      diplomacyDeltas: { __NEIGHBOR__: -10 },
    },
  },

  // ============================================================
  // neg_alliance_pact — Military alliance proposal
  // ============================================================
  neg_alliance_pact: {
    military_commitment: {
      militaryReadinessDelta: -5,
      militaryCasteSatDelta: -2,
      diplomacyDeltas: { __NEIGHBOR__: +12 },
      stabilityDelta: +2,
    },
    shared_intelligence: {
      espionageNetworkDelta: +5,
      diplomacyDeltas: { __NEIGHBOR__: +5 },
      treasuryDelta: -15,
    },
    trade_exclusivity: {
      merchantSatDelta: -4,
      treasuryDelta: +20,
      diplomacyDeltas: { __NEIGHBOR__: +8 },
    },
    reject_alliance_pact: {
      diplomacyDeltas: { __NEIGHBOR__: -5 },
    },
  },

  // ============================================================
  // neg_noble_power_share — Noble house demands power sharing
  // ============================================================
  neg_noble_power_share: {
    council_seats: {
      nobilitySatDelta: +5,
      commonerSatDelta: -3,
      stabilityDelta: +2,
    },
    tax_authority: {
      nobilitySatDelta: +4,
      treasuryDelta: -25,
      merchantSatDelta: -2,
    },
    judicial_power: {
      nobilitySatDelta: +3,
      commonerSatDelta: -4,
      clergySatDelta: -2,
      stabilityDelta: -1,
    },
    reject_noble_demands: {
      nobilitySatDelta: -6,
      stabilityDelta: -3,
    },
  },

  // ============================================================
  // neg_merchant_guild_charter — Merchant guild negotiates privileges
  // ============================================================
  neg_merchant_guild_charter: {
    monopoly_rights: {
      merchantSatDelta: +5,
      commonerSatDelta: -3,
      nobilitySatDelta: -2,
    },
    tax_reduction: {
      merchantSatDelta: +3,
      treasuryDelta: -20,
      commonerSatDelta: +1,
    },
    port_access: {
      merchantSatDelta: +4,
      militaryReadinessDelta: -2,
      treasuryDelta: +10,
    },
    reject_guild_charter: {
      merchantSatDelta: -4,
      treasuryDelta: -10,
    },
  },

  // ============================================================
  // neg_clergy_concordat — Clergy negotiates religious authority
  // ============================================================
  neg_clergy_concordat: {
    education_authority: {
      clergySatDelta: +4,
      commonerSatDelta: -2,
      culturalCohesionDelta: +2,
      heterodoxyDelta: -3,
    },
    tithe_enforcement: {
      clergySatDelta: +3,
      faithDelta: +2,
      commonerSatDelta: -3,
      merchantSatDelta: -2,
    },
    heresy_courts: {
      clergySatDelta: +5,
      heterodoxyDelta: -5,
      commonerSatDelta: -4,
      stabilityDelta: -2,
    },
    reject_concordat: {
      clergySatDelta: -5,
      faithDelta: -2,
    },
  },

  // ============================================================
  // neg_military_reform — Military caste proposes structural reform
  // ============================================================
  neg_military_reform: {
    merit_promotion: {
      militaryCasteSatDelta: +4,
      militaryMoraleDelta: +3,
      nobilitySatDelta: -4,
    },
    veteran_benefits: {
      militaryCasteSatDelta: +3,
      militaryMoraleDelta: +2,
      treasuryDelta: -30,
    },
    equipment_budget: {
      militaryEquipmentDelta: +5,
      militaryReadinessDelta: +3,
      treasuryDelta: -25,
      merchantSatDelta: -1,
    },
    reject_military_reform: {
      militaryCasteSatDelta: -4,
      militaryMoraleDelta: -3,
      stabilityDelta: -1,
    },
  },

  // ============================================================
  // Expansion — 4 additional negotiation effects
  // ============================================================
  neg_commoner_charter: {
    fair_wage_guarantee: {
      commonerSatDelta: +5,
      merchantSatDelta: -3,
      treasuryDelta: -15,
    },
    land_tenure_rights: {
      commonerSatDelta: +4,
      nobilitySatDelta: -4,
      regionDevelopmentDelta: +2,
    },
    public_assembly_rights: {
      commonerSatDelta: +3,
      stabilityDelta: -2,
      clergySatDelta: -1,
      culturalCohesionDelta: +2,
    },
    reject_commoner_charter: {
      commonerSatDelta: -5,
      stabilityDelta: -4,
    },
  },

  neg_scholarly_patronage: {
    university_funding: {
      culturalCohesionDelta: +3,
      treasuryDelta: -30,
      clergySatDelta: -2,
    },
    secular_curriculum: {
      heterodoxyDelta: +3,
      culturalCohesionDelta: +2,
      clergySatDelta: -4,
      commonerSatDelta: +1,
    },
    foreign_scholars: {
      diplomacyDeltas: { __NEIGHBOR__: +5 },
      espionageNetworkDelta: -2,
      culturalCohesionDelta: +2,
      nobilitySatDelta: -2,
    },
    reject_scholarly_patronage: {
      culturalCohesionDelta: -2,
      commonerSatDelta: -1,
    },
  },

  neg_resource_blockade: {
    payment_tribute: {
      treasuryDelta: -50,
      diplomacyDeltas: { __NEIGHBOR__: +12 },
      commonerSatDelta: -2,
    },
    trade_concessions: {
      merchantSatDelta: -4,
      treasuryDelta: +10,
      diplomacyDeltas: { __NEIGHBOR__: +8 },
    },
    military_passage_rights: {
      militaryReadinessDelta: -4,
      diplomacyDeltas: { __NEIGHBOR__: +10 },
      espionageNetworkDelta: -2,
    },
    hostage_exchange: {
      nobilitySatDelta: -3,
      stabilityDelta: -2,
      diplomacyDeltas: { __NEIGHBOR__: +15 },
    },
    reject_blockade_terms: {
      diplomacyDeltas: { __NEIGHBOR__: -12 },
      merchantSatDelta: -3,
      foodDelta: -15,
    },
  },

  neg_marriage_alliance: {
    royal_dowry: {
      treasuryDelta: -40,
      diplomacyDeltas: { __NEIGHBOR__: +15 },
      nobilitySatDelta: +2,
    },
    land_gift: {
      regionDevelopmentDelta: -3,
      diplomacyDeltas: { __NEIGHBOR__: +10 },
      nobilitySatDelta: -3,
    },
    faith_concessions: {
      faithDelta: -2,
      heterodoxyDelta: +2,
      diplomacyDeltas: { __NEIGHBOR__: +8 },
      clergySatDelta: -3,
    },
    reject_marriage_alliance: {
      diplomacyDeltas: { __NEIGHBOR__: -5 },
      nobilitySatDelta: -2,
    },
  },
};
