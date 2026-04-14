import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_CLASS_CONFLICT_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Noble vs Commoner — Tax Burden Dispute (Serious, established)
  // ============================================================
  {
    id: 'evt_exp_cc_tax_burden_dispute',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 55 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'redistribute_tax_burden', slotCost: 1, isFree: false },
      { choiceId: 'maintain_noble_exemptions', slotCost: 1, isFree: false },
      { choiceId: 'commission_tax_review', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 2. Clergy vs Merchant — Usury Accusation (Notable, established)
  // ============================================================
  {
    id: 'evt_exp_cc_usury_accusation',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 55 },
      { type: 'faith_above', threshold: 40 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_usury_laws', slotCost: 1, isFree: false },
      { choiceId: 'protect_lending_practices', slotCost: 1, isFree: false },
      { choiceId: 'appoint_arbitration_panel', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 3. Military Caste Demands Privileges (Serious, established)
  // ============================================================
  {
    id: 'evt_exp_cc_military_privilege_demand',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 45 },
      { type: 'military_readiness_above', threshold: 50 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_military_estates', slotCost: 1, isFree: false },
      { choiceId: 'offer_honorary_titles', slotCost: 1, isFree: false },
      { choiceId: 'refuse_special_treatment', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 4. Inter-Class Marriage Controversy (Informational, opening)
  // ============================================================
  {
    id: 'evt_exp_cc_interclass_marriage',
    severity: EventSeverity.Informational,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'stability_above', threshold: 45 },
      { type: 'random_chance', probability: 0.15 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'bless_the_union', slotCost: 0, isFree: true },
      { choiceId: 'discourage_precedent', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 5. Guild vs Nobility Power Struggle (Critical, established)
  // ============================================================
  {
    id: 'evt_exp_cc_guild_noble_power_struggle',
    severity: EventSeverity.Critical,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 70 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 40 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'curtail_guild_influence', slotCost: 2, isFree: false },
      { choiceId: 'formalize_guild_seats', slotCost: 1, isFree: false },
      { choiceId: 'play_factions_against_each_other', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 6. Commoner Envy of Merchant Wealth (Notable, developing)
  // ============================================================
  {
    id: 'evt_exp_cc_commoner_envy',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 60 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'impose_wealth_tithe', slotCost: 1, isFree: false },
      { choiceId: 'fund_public_works', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_grievances', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 7. Clerical Overreach — Land Tithes (Serious, established)
  // ============================================================
  {
    id: 'evt_exp_cc_clerical_overreach',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 60 },
      { type: 'faith_above', threshold: 55 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'limit_church_holdings', slotCost: 1, isFree: false },
      { choiceId: 'sanction_expanded_tithes', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_boundaries', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 8. Class-Based Justice Inequality (Notable, developing)
  // ============================================================
  {
    id: 'evt_exp_cc_justice_inequality',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'stability_below', threshold: 55 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_equal_courts', slotCost: 1, isFree: false },
      { choiceId: 'uphold_traditional_courts', slotCost: 1, isFree: false },
      { choiceId: 'create_appellate_process', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 9. Social Mobility Demands (Critical, established)
  // ============================================================
  {
    id: 'evt_exp_cc_social_mobility_demands',
    severity: EventSeverity.Critical,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
      { type: 'stability_below', threshold: 45 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'open_ranks_to_merit', slotCost: 2, isFree: false },
      { choiceId: 'create_advancement_paths', slotCost: 1, isFree: false },
      { choiceId: 'reaffirm_social_order', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 10. Land Ownership Dispute (Serious, any)
  // ============================================================
  {
    id: 'evt_exp_cc_land_ownership_dispute',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 60 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'redistribute_crown_lands', slotCost: 1, isFree: false },
      { choiceId: 'enforce_existing_deeds', slotCost: 1, isFree: false },
      { choiceId: 'establish_tenant_protections', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 11. Merchant-Military Disagreement Over War Costs (Notable, any)
  // ============================================================
  {
    id: 'evt_exp_cc_merchant_military_war_costs',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 50 },
      { type: 'military_readiness_above', threshold: 55 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reduce_military_spending', slotCost: 1, isFree: false },
      { choiceId: 'levy_war_commerce_tax', slotCost: 1, isFree: false },
      { choiceId: 'acknowledge_both_concerns', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 12. Labor Rights Movement (Notable, developing)
  // ============================================================
  {
    id: 'evt_exp_cc_labor_rights',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
      { type: 'treasury_above', threshold: 300 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_labor_protections', slotCost: 1, isFree: false },
      { choiceId: 'enforce_work_obligations', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_local_lords', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 13. Privilege Reform Petition (Critical, any)
  // ============================================================
  {
    id: 'evt_exp_cc_privilege_reform',
    severity: EventSeverity.Critical,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 30 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enact_sweeping_reforms', slotCost: 2, isFree: false },
      { choiceId: 'offer_token_concessions', slotCost: 1, isFree: false },
      { choiceId: 'suppress_reform_movement', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 14. Commoner Harvest Tithe Resentment (Informational, opening)
  // ============================================================
  {
    id: 'evt_exp_cc_harvest_tithe_resentment',
    severity: EventSeverity.Informational,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 50 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reduce_harvest_tithe', slotCost: 1, isFree: false },
      { choiceId: 'hold_tithe_steady', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
];
