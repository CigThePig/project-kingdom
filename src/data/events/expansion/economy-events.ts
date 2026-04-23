import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_ECONOMY_EVENTS: EventDefinition[] = [
  // ============================================================
  // 1. Market Fluctuations — Informational, opening
  // ============================================================
  {
    id: 'evt_exp_eco_market_fluctuations',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_above', threshold: 100 },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'impose_price_controls', slotCost: 1, isFree: false },
      { choiceId: 'let_market_self_correct', slotCost: 0, isFree: true },
      { choiceId: 'subsidize_essential_goods', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'impose_price_controls', followUpDefinitionId: 'evt_exp_fu_eco_price_control_backlash', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // 2. Currency Debasement — Serious, developing
  // ============================================================
  {
    id: 'evt_exp_eco_currency_debasement',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_below', threshold: 150 },
      { type: 'turn_range', minTurn: 4, maxTurn: 12 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'debase_the_coinage', slotCost: 1, isFree: false },
      { choiceId: 'raise_emergency_tax', slotCost: 1, isFree: false },
      { choiceId: 'seek_foreign_loan', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 3. Tax Collection Dispute — Notable, opening
  // ============================================================
  {
    id: 'evt_exp_eco_tax_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 55 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enforce_full_collection', slotCost: 1, isFree: false },
      { choiceId: 'grant_partial_amnesty', slotCost: 1, isFree: false },
      { choiceId: 'defer_collection_to_next_season', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'grant_partial_amnesty', followUpDefinitionId: 'evt_exp_fu_eco_tax_compromise_fallout', delayTurns: 3, probability: 0.7 },
    ],
  },

  // ============================================================
  // 4. Guild Monopoly — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_eco_guild_monopoly',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 60 },
      { type: 'turn_range', minTurn: 5 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'break_the_monopoly', slotCost: 1, isFree: false },
      { choiceId: 'tax_monopoly_profits', slotCost: 1, isFree: false },
      { choiceId: 'permit_guild_control', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
    followUpEvents: [
      { triggerChoiceId: 'break_the_monopoly', followUpDefinitionId: 'evt_exp_fu_eco_guild_resentment', delayTurns: 3, probability: 0.5 },
    ],
  },

  // ============================================================
  // 5. Foreign Trade Disruption — Serious, established
  // ============================================================
  {
    id: 'evt_exp_eco_foreign_trade_disruption',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_arenthal', threshold: 40 },
      { type: 'turn_range', minTurn: 9 },
      { type: 'consequence_tag_absent', consequenceTag: 'decree:decree_trade_agreement' },
      { type: 'trade_volume_below', threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reroute_trade_through_valdris', slotCost: 1, isFree: false },
      { choiceId: 'invest_in_domestic_production', slotCost: 2, isFree: false },
      { choiceId: 'endure_the_shortfall', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 6. Merchant Bankruptcy — Notable, established
  // ============================================================
  {
    id: 'evt_exp_eco_merchant_bankruptcy',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_below', threshold: 200 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 45 },
      { type: 'turn_range', minTurn: 9 },
      { type: 'merchant_confidence_below', threshold: 35 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'bail_out_the_merchants', slotCost: 1, isFree: false },
      { choiceId: 'seize_merchant_assets', slotCost: 1, isFree: false },
      { choiceId: 'let_creditors_settle', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 7. Inflation Crisis — Critical, established
  // ============================================================
  {
    id: 'evt_exp_eco_inflation_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'stability_below', threshold: 35 },
      { type: 'treasury_below', threshold: 100 },
      { type: 'turn_range', minTurn: 10 },
      { type: 'inflation_above', threshold: 0.2 },
    ],
    weight: 1.4,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'mint_new_currency', slotCost: 2, isFree: false },
      { choiceId: 'freeze_all_prices', slotCost: 1, isFree: false },
      { choiceId: 'allow_free_market_correction', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'freeze_all_prices', followUpDefinitionId: 'evt_fu_price_freeze_shortages', delayTurns: 3, probability: 0.7 },
      { triggerChoiceId: 'allow_free_market_correction', followUpDefinitionId: 'evt_fu_market_crash_bread_riots', delayTurns: 3, probability: 0.7 },
    ],
  },

  // ============================================================
  // 8. Luxury Goods Trade — Informational, any
  // ============================================================
  {
    id: 'evt_exp_eco_luxury_trade',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_above', threshold: 300 },
      { type: 'neighbor_relationship_above', neighborId: 'neighbor_arenthal', threshold: 50 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'open_luxury_imports', slotCost: 1, isFree: false },
      { choiceId: 'tax_luxury_goods_heavily', slotCost: 1, isFree: false },
      { choiceId: 'decline_the_opportunity', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 9. Mining Revenue Boom — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_eco_mining_revenue',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4, maxTurn: 10 },
      { type: 'random_chance', probability: 0.2 },
      { type: 'population_above', threshold: 800 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_mining_operations', slotCost: 1, isFree: false },
      { choiceId: 'claim_royal_share', slotCost: 1, isFree: false },
      { choiceId: 'leave_to_local_lords', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 10. Black Market Operations — Serious, established
  // ============================================================
  {
    id: 'evt_exp_eco_black_market',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'stability_below', threshold: 50 },
      { type: 'turn_range', minTurn: 9 },
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crack_down_harshly', slotCost: 2, isFree: false },
      { choiceId: 'infiltrate_and_tax', slotCost: 1, isFree: false },
      { choiceId: 'tolerate_for_now', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 11. Banking Innovation — Notable, established
  // ============================================================
  {
    id: 'evt_exp_eco_banking_innovation',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 50 },
      { type: 'treasury_above', threshold: 250 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'charter_royal_bank', slotCost: 2, isFree: false },
      { choiceId: 'license_private_banks', slotCost: 1, isFree: false },
      { choiceId: 'forbid_lending_houses', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
    followUpEvents: [
      { triggerChoiceId: 'charter_royal_bank', followUpDefinitionId: 'evt_exp_fu_eco_bailout_resentment', delayTurns: 2, probability: 0.5 },
    ],
  },

  // ============================================================
  // 12. Debt Crisis — Critical, any
  // ============================================================
  {
    id: 'evt_exp_eco_debt_crisis',
    severity: EventSeverity.Critical,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'treasury_below', threshold: 50 },
      { type: 'stability_below', threshold: 45 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'default_on_debts', slotCost: 1, isFree: false },
      { choiceId: 'negotiate_with_creditors', slotCost: 1, isFree: false },
      { choiceId: 'impose_austerity_measures', slotCost: 2, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 13. Trade Fair Opportunity — Informational, any
  // ============================================================
  {
    id: 'evt_exp_eco_trade_fair',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'season_is', season: Season.Summer },
      { type: 'random_chance', probability: 0.35 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_grand_fair', slotCost: 1, isFree: false },
      { choiceId: 'modest_market_day', slotCost: 0, isFree: true },
      { choiceId: 'decline_to_host', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 14. Toll Road Dispute — Notable, developing
  // ============================================================
  {
    id: 'evt_exp_eco_toll_road_dispute',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 50 },
        { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
      ]},
      { type: 'turn_range', minTurn: 4 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'abolish_noble_tolls', slotCost: 1, isFree: false },
      { choiceId: 'regulate_toll_rates', slotCost: 1, isFree: false },
      { choiceId: 'uphold_noble_privilege', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // 15. Smuggling Operations — Serious, any
  // ============================================================
  {
    id: 'evt_exp_eco_smuggling',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 45 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'deploy_border_patrols', slotCost: 2, isFree: false },
      { choiceId: 'bribe_smuggler_captains', slotCost: 1, isFree: false },
      { choiceId: 'ignore_the_smuggling', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
    followUpEvents: [
      { triggerChoiceId: 'deploy_border_patrols', followUpDefinitionId: 'evt_exp_fu_eco_smuggler_revenge', delayTurns: 2, probability: 0.6 },
    ],
  },

  // ============================================================
  // 16. Artisan Guild Demands — Notable, established
  // ============================================================
  {
    id: 'evt_exp_eco_artisan_demands',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
      { type: 'population_above', threshold: 1000 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_guild_charter', slotCost: 1, isFree: false },
      { choiceId: 'offer_tax_relief', slotCost: 1, isFree: false },
      { choiceId: 'deny_all_demands', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // ============================================================
  // 17. Warehouse Fire — Serious, any
  // ============================================================
  {
    id: 'evt_exp_eco_warehouse_fire',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'season_is', season: Season.Autumn },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_full_reconstruction', slotCost: 2, isFree: false },
      { choiceId: 'compensate_merchants_partially', slotCost: 1, isFree: false },
      { choiceId: 'leave_to_private_rebuilding', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'any',
  },

  // ============================================================
  // 18. Counterfeit Coins — Critical, opening
  // ============================================================
  {
    id: 'evt_exp_eco_counterfeit_coins',
    severity: EventSeverity.Critical,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'stability_below', threshold: 40 },
        { type: 'consequence_tag_present', consequenceTag: 'evt_exp_eco_currency_debasement:debase_the_coinage' },
        { type: 'consequence_tag_present', consequenceTag: 'evt_exp_w2_monetary_crisis:debase_the_coinage' },
      ]},
      { type: 'population_above', threshold: 600 },
    ],
    weight: 1.3,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'execute_counterfeiters', slotCost: 1, isFree: false },
      { choiceId: 'recall_all_coinage', slotCost: 2, isFree: false },
      { choiceId: 'issue_royal_stamps', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'execute_counterfeiters', followUpDefinitionId: 'evt_fu_counterfeit_underground_revenge', delayTurns: 3, probability: 0.6 },
      { triggerChoiceId: 'issue_royal_stamps', followUpDefinitionId: 'evt_fu_royal_stamp_fraud', delayTurns: 4, probability: 0.6 },
    ],
  },
];
