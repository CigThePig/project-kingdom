import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_PUBLIC_ORDER_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Riots in the Market District — Serious, established
  // ============================================================
  {
    id: 'evt_exp_po_market_riots',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'deploy_garrison', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_with_ringleaders', slotCost: 1, isFree: false },
      { choiceId: 'seal_district_gates', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 2. Highway Banditry Surge — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_po_highway_banditry',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 40 },
      { type: 'stability_below', threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_bounty_hunters', slotCost: 1, isFree: false },
      { choiceId: 'establish_road_garrisons', slotCost: 1, isFree: false },
      { choiceId: 'offer_amnesty_to_bandits', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 3. Curfew Debate — Notable, established
  // ============================================================
  {
    id: 'evt_exp_po_curfew_debate',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 45 },
      { type: 'turn_range', minTurn: 6, maxTurn: 999 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'impose_strict_curfew', slotCost: 1, isFree: false },
      { choiceId: 'limited_evening_curfew', slotCost: 1, isFree: false },
      { choiceId: 'reject_curfew', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 4. Crime Wave — Serious, any
  // ============================================================
  {
    id: 'evt_exp_po_crime_wave',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 35 },
      { type: 'treasury_below', threshold: 300 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hire_additional_watchmen', slotCost: 1, isFree: false },
      { choiceId: 'public_executions', slotCost: 1, isFree: false },
      { choiceId: 'empower_neighborhood_watches', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'hire_additional_watchmen', followUpDefinitionId: 'evt_exp_fu_po_purge_aftermath', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 5. Vigilante Justice — Notable, established
  // ============================================================
  {
    id: 'evt_exp_po_vigilante_justice',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 40 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'arrest_vigilantes', slotCost: 1, isFree: false },
      { choiceId: 'legitimize_as_militia', slotCost: 1, isFree: false },
      { choiceId: 'ignore_for_now', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'arrest_vigilantes', followUpDefinitionId: 'evt_exp_fu_po_militia_overreach', delayTurns: 3, probability: 0.5 },
    ],
  },

  // ============================================================
  // 6. Prison Overcrowding — Serious, developing
  // ============================================================
  {
    id: 'evt_exp_po_prison_overcrowding',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'population_above', threshold: 600 },
      { type: 'stability_below', threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'build_new_prison', slotCost: 1, isFree: false },
      { choiceId: 'release_minor_offenders', slotCost: 1, isFree: false },
      { choiceId: 'forced_labor_gangs', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'build_new_prison', followUpDefinitionId: 'evt_exp_fu_po_prison_complete', delayTurns: 3, probability: 0.7 },
    ],
  },

  // ============================================================
  // 7. Tax Resistance Movement — Serious, established
  // ============================================================
  {
    id: 'evt_exp_po_tax_resistance',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'treasury_above', threshold: 500 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 35 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'send_tax_collectors_with_guards', slotCost: 1, isFree: false },
      { choiceId: 'temporarily_reduce_taxes', slotCost: 1, isFree: false },
      { choiceId: 'address_grievances_at_court', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 8. Black Market Flourishing — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_po_black_market',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'food_below', threshold: 80 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 45 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'raid_black_market', slotCost: 1, isFree: false },
      { choiceId: 'tax_and_regulate', slotCost: 1, isFree: false },
      { choiceId: 'turn_blind_eye', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 9. Gang Warfare — Serious, established
  // ============================================================
  {
    id: 'evt_exp_po_gang_warfare',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 30 },
      { type: 'population_above', threshold: 500 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'military_sweep', slotCost: 2, isFree: false },
      { choiceId: 'pit_gangs_against_each_other', slotCost: 1, isFree: false },
      { choiceId: 'offer_gang_leaders_positions', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'military_sweep', followUpDefinitionId: 'evt_exp_fu_po_gang_driven_underground', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // 10. Arson Attacks — Notable, any
  // ============================================================
  {
    id: 'evt_exp_po_arson_attacks',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 45 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'form_fire_brigades', slotCost: 1, isFree: false },
      { choiceId: 'investigate_arsonists', slotCost: 1, isFree: false },
      { choiceId: 'post_night_sentries', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 11. Public Drunkenness Epidemic — Informational, opening
  // ============================================================
  {
    id: 'evt_exp_po_drunkenness',
    severity: EventSeverity.Informational,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'food_above', threshold: 120 },
      { type: 'stability_below', threshold: 60 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'regulate_taverns', slotCost: 1, isFree: false },
      { choiceId: 'clergy_temperance_campaign', slotCost: 1, isFree: false },
      { choiceId: 'leave_it_be', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 12. Refugee Influx — Critical, any
  // ============================================================
  {
    id: 'evt_exp_po_refugee_influx',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_westerlands', threshold: 30 },
        { type: 'neighbor_relationship_below', neighborId: 'neighbor_northmarch', threshold: 30 },
      ]},
      { type: 'turn_range', minTurn: 4, maxTurn: 999 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'welcome_and_settle', slotCost: 1, isFree: false },
      { choiceId: 'temporary_camps', slotCost: 1, isFree: false },
      { choiceId: 'close_the_borders', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 13. Vagrancy Crisis — Informational, developing
  // ============================================================
  {
    id: 'evt_exp_po_vagrancy',
    severity: EventSeverity.Informational,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'food_below', threshold: 100 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'establish_poorhouses', slotCost: 1, isFree: false },
      { choiceId: 'conscript_vagrants', slotCost: 1, isFree: false },
      { choiceId: 'ignore_the_problem', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 14. Labor Strike — Notable, any
  // ============================================================
  {
    id: 'evt_exp_po_labor_strike',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 30 },
      { type: 'treasury_above', threshold: 400 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_wage_increase', slotCost: 1, isFree: false },
      { choiceId: 'break_the_strike', slotCost: 1, isFree: false },
      { choiceId: 'replace_with_conscripts', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 15. Mob Justice — Critical, established
  // ============================================================
  {
    id: 'evt_exp_po_mob_justice',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 25 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 25 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'restore_order_by_force', slotCost: 2, isFree: false },
      { choiceId: 'hold_public_trial', slotCost: 1, isFree: false },
      { choiceId: 'let_the_mob_decide', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'restore_order_by_force', followUpDefinitionId: 'evt_fu_force_crackdown_legacy', delayTurns: 3, probability: 0.6 },
      { triggerChoiceId: 'let_the_mob_decide', followUpDefinitionId: 'evt_fu_mob_rule_spreads', delayTurns: 3, probability: 0.8 },
    ],
  },

  // ============================================================
  // 16. Martial Law Debate — Critical, any
  // ============================================================
  {
    id: 'evt_exp_po_martial_law',
    severity: EventSeverity.Critical,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'stability_below', threshold: 20 },
      { type: 'military_readiness_above', threshold: 50 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'declare_martial_law', slotCost: 2, isFree: false },
      { choiceId: 'limited_military_patrols', slotCost: 1, isFree: false },
      { choiceId: 'trust_civilian_authority', slotCost: 1, isFree: false },
    ],
    affectsClass: null,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'declare_martial_law', followUpDefinitionId: 'evt_exp_fu_po_martial_law_tension', delayTurns: 2, probability: 0.7 },
      { triggerChoiceId: 'trust_civilian_authority', followUpDefinitionId: 'evt_fu_civilian_authority_falters', delayTurns: 3, probability: 0.6 },
    ],
  },

  // ============================================================
  // 17. Street Brawling Epidemic — Informational, opening
  // ============================================================
  {
    id: 'evt_exp_po_street_brawls',
    severity: EventSeverity.Informational,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'stability_below', threshold: 55 },
    ],
    weight: 0.6,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_watch_patrols', slotCost: 1, isFree: false },
      { choiceId: 'organize_public_games', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_as_rowdiness', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // ============================================================
  // 18. People's Mood — Informational, opening
  // ============================================================
  {
    id: 'evt_exp_po_peoples_mood',
    severity: EventSeverity.Informational,
    category: EventCategory.PublicOrder,
    triggerConditions: [
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_watch_presence', slotCost: 1, isFree: false },
      { choiceId: 'address_grievances', slotCost: 1, isFree: false },
      { choiceId: 'take_no_action', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },
];
