import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_MILITARY_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Border Patrol Gaps — Informational, opening
  // ============================================================
  {
    id: 'evt_exp_mil_border_patrol_gaps',
    severity: EventSeverity.Informational,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 55 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_patrol_frequency', slotCost: 1, isFree: false },
      { choiceId: 'recruit_local_militia', slotCost: 1, isFree: false },
      { choiceId: 'accept_current_coverage', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 2. Weapons Smithing Proposal — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_mil_weapons_smithing',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'treasury_above', threshold: 300 },
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_royal_armory', slotCost: 1, isFree: false },
      { choiceId: 'contract_guild_smiths', slotCost: 1, isFree: false },
      { choiceId: 'postpone_investment', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 3. Cavalry Training Grounds — Serious, established
  // ============================================================
  {
    id: 'evt_exp_mil_cavalry_training',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_above', threshold: 45 },
      { type: 'treasury_above', threshold: 400 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'build_cavalry_academy', slotCost: 2, isFree: false },
      { choiceId: 'expand_existing_stables', slotCost: 1, isFree: false },
      { choiceId: 'maintain_infantry_focus', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 4. Siege Preparations — Critical, established
  // ============================================================
  {
    id: 'evt_exp_mil_siege_preparations',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 25 },
      { type: 'military_readiness_below', threshold: 40 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'full_siege_mobilization', slotCost: 2, isFree: false },
      { choiceId: 'reinforce_key_fortifications', slotCost: 1, isFree: false },
      { choiceId: 'seek_diplomatic_resolution', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 5. Veteran Pensions — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_mil_veteran_pensions',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 40 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_pension_fund', slotCost: 1, isFree: false },
      { choiceId: 'grant_farmland_plots', slotCost: 1, isFree: false },
      { choiceId: 'honor_with_ceremony_only', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 6. Military Academy Proposal — Serious, established
  // ============================================================
  {
    id: 'evt_exp_mil_academy_proposal',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'treasury_above', threshold: 500 },
      { type: 'stability_above', threshold: 55 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'found_royal_academy', slotCost: 2, isFree: false },
      { choiceId: 'expand_officer_training', slotCost: 1, isFree: false },
      { choiceId: 'defer_to_peacetime', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 7. Mercenary Company Offer — Notable, any
  // ============================================================
  {
    id: 'evt_exp_mil_mercenary_offer',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 45 },
      { type: 'treasury_above', threshold: 250 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hire_full_company', slotCost: 1, isFree: false },
      { choiceId: 'hire_scouts_only', slotCost: 1, isFree: false },
      { choiceId: 'decline_mercenaries', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 8. Arms Deal with Arenthal — Serious, developing
  // ============================================================
  {
    id: 'evt_exp_mil_arms_deal',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'neighbor_relationship_above', neighborId: 'neighbor_arenthal', threshold: 50 },
      { type: 'turn_range', minTurn: 6 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'accept_arms_shipment', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_mutual_pact', slotCost: 1, isFree: false },
      { choiceId: 'politely_refuse', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'accept_arms_shipment', followUpDefinitionId: 'evt_exp_fu_mil_arms_breakthrough', delayTurns: 3, probability: 0.5 },
    ],
  },

  // ============================================================
  // 9. Fortification Decay — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_mil_fortification_decay',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'full_restoration', slotCost: 1, isFree: false },
      { choiceId: 'patch_critical_sections', slotCost: 1, isFree: false },
      { choiceId: 'delay_repairs', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'full_restoration', followUpDefinitionId: 'evt_exp_fu_mil_fortress_garrison', delayTurns: 3, probability: 0.7 },
    ],
  },

  // ============================================================
  // 10. War Hero Recognition — Informational, any
  // ============================================================
  {
    id: 'evt_exp_mil_war_hero',
    severity: EventSeverity.Informational,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_above', threshold: 60 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.MilitaryCaste, threshold: 50 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'public_ceremony', slotCost: 1, isFree: false },
      { choiceId: 'promote_to_officer', slotCost: 1, isFree: false },
      { choiceId: 'note_service_in_records', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'public_ceremony', followUpDefinitionId: 'evt_exp_fu_mil_parade_recruitment', delayTurns: 2, probability: 0.7 },
    ],
  },

  // ============================================================
  // 11. Court Martial — Serious, established
  // ============================================================
  {
    id: 'evt_exp_mil_court_martial',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'stability_below', threshold: 45 },
      { type: 'military_readiness_above', threshold: 30 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'public_tribunal', slotCost: 1, isFree: false },
      { choiceId: 'quiet_discharge', slotCost: 1, isFree: false },
      { choiceId: 'pardon_and_reassign', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 12. Soldier Discipline Crisis — Serious, any
  // ============================================================
  {
    id: 'evt_exp_mil_discipline_crisis',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 30 },
      { type: 'stability_below', threshold: 50 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_strict_discipline', slotCost: 1, isFree: false },
      { choiceId: 'address_grievances', slotCost: 1, isFree: false },
      { choiceId: 'rotate_troublesome_units', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'enforce_strict_discipline', followUpDefinitionId: 'evt_exp_fu_mil_amnesty_returns', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 13. Supply Chain Disruption — Critical, any
  // ============================================================
  {
    id: 'evt_exp_mil_supply_chain',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'food_below', threshold: 80 },
      { type: 'military_readiness_below', threshold: 50 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_supply_convoy', slotCost: 2, isFree: false },
      { choiceId: 'requisition_from_merchants', slotCost: 1, isFree: false },
      { choiceId: 'ration_existing_supplies', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 14. Military Intelligence Report — Informational, developing
  // ============================================================
  {
    id: 'evt_exp_mil_intel_report',
    severity: EventSeverity.Informational,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 40 },
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_border_watch', slotCost: 1, isFree: false },
      { choiceId: 'deploy_counter_intelligence', slotCost: 1, isFree: false },
      { choiceId: 'file_the_report', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 15. Conscription Dispute — Notable, established
  // ============================================================
  {
    id: 'evt_exp_mil_conscription_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'population_above', threshold: 1200 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_conscription_quotas', slotCost: 1, isFree: false },
      { choiceId: 'offer_volunteer_incentives', slotCost: 1, isFree: false },
      { choiceId: 'reduce_levy_demands', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 16. War Preparations — Critical, established
  // ============================================================
  {
    id: 'evt_exp_mil_war_preparations',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 20 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'full_war_mobilization', slotCost: 2, isFree: false },
      { choiceId: 'defensive_preparations_only', slotCost: 1, isFree: false },
      { choiceId: 'last_chance_diplomacy', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'defensive_preparations_only', followUpDefinitionId: 'evt_exp_fu_mil_peace_dividend', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // 17. Battlefield Medicine — Notable, any
  // ============================================================
  {
    id: 'evt_exp_mil_battlefield_medicine',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_above', threshold: 35 },
      { type: 'treasury_above', threshold: 200 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_field_hospitals', slotCost: 1, isFree: false },
      { choiceId: 'train_combat_medics', slotCost: 1, isFree: false },
      { choiceId: 'rely_on_camp_followers', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 18. Strategic Alliance — Critical, established
  // ============================================================
  {
    id: 'evt_exp_mil_strategic_alliance',
    severity: EventSeverity.Critical,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'neighbor_relationship_above', neighborId: 'neighbor_arenthal', threshold: 60 },
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 35 },
      { type: 'turn_range', minTurn: 10 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'formal_military_pact', slotCost: 2, isFree: false },
      { choiceId: 'limited_cooperation', slotCost: 1, isFree: false },
      { choiceId: 'maintain_independence', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 19. Weapon Innovation — Informational, developing
  // ============================================================
  {
    id: 'evt_exp_mil_weapon_innovation',
    severity: EventSeverity.Informational,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'treasury_above', threshold: 200 },
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_prototype', slotCost: 1, isFree: false },
      { choiceId: 'commission_field_trials', slotCost: 1, isFree: false },
      { choiceId: 'archive_the_designs', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 20. Naval Operations — Serious, opening
  // ============================================================
  {
    id: 'evt_exp_mil_naval_operations',
    severity: EventSeverity.Serious,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'treasury_above', threshold: 300 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'commission_war_galleys', slotCost: 2, isFree: false },
      { choiceId: 'refit_merchant_vessels', slotCost: 1, isFree: false },
      { choiceId: 'focus_on_land_forces', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
];
