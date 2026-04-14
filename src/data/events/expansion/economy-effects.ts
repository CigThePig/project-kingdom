import type { MechanicalEffectDelta } from '../../../engine/types';

export const EXPANSION_ECONOMY_EFFECTS: Record<string, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // 1. Market Fluctuations — Informational
  // ============================================================
  evt_exp_eco_market_fluctuations: {
    impose_price_controls:      { treasuryDelta: -10, merchantSatDelta: -2, commonerSatDelta: +2, stabilityDelta: +1 },
    let_market_self_correct:    { merchantSatDelta: +1, commonerSatDelta: -1, treasuryDelta: -5 },
    subsidize_essential_goods:  { treasuryDelta: -20, commonerSatDelta: +3, merchantSatDelta: -1 },
  },

  // ============================================================
  // 2. Currency Debasement — Serious
  // ============================================================
  evt_exp_eco_currency_debasement: {
    debase_the_coinage:   { treasuryDelta: +50, merchantSatDelta: -5, commonerSatDelta: -4, stabilityDelta: -3 },
    raise_emergency_tax:  { treasuryDelta: +40, commonerSatDelta: -4, nobilitySatDelta: -2, stabilityDelta: -2 },
    seek_foreign_loan:    { treasuryDelta: +30, merchantSatDelta: -2, diplomacyDeltas: { neighbor_arenthal: -3 }, stabilityDelta: -1 },
  },

  // ============================================================
  // 3. Tax Collection Dispute — Notable
  // ============================================================
  evt_exp_eco_tax_dispute: {
    enforce_full_collection:         { treasuryDelta: +35, commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
    grant_partial_amnesty:           { treasuryDelta: +15, commonerSatDelta: +2, merchantSatDelta: -2, nobilitySatDelta: -1 },
    defer_collection_to_next_season: { treasuryDelta: -10, commonerSatDelta: +1, stabilityDelta: -1 },
  },

  // ============================================================
  // 4. Guild Monopoly — Notable
  // ============================================================
  evt_exp_eco_guild_monopoly: {
    break_the_monopoly:    { treasuryDelta: -30, merchantSatDelta: -5, commonerSatDelta: +4, stabilityDelta: +2 },
    tax_monopoly_profits:  { treasuryDelta: +40, merchantSatDelta: -3, nobilitySatDelta: +2, commonerSatDelta: -1 },
    permit_guild_control:  { merchantSatDelta: +3, commonerSatDelta: -3, treasuryDelta: -5 },
  },

  // ============================================================
  // 5. Foreign Trade Disruption — Serious
  // ============================================================
  evt_exp_eco_foreign_trade_disruption: {
    reroute_trade_through_valdris:  { treasuryDelta: -40, merchantSatDelta: +2, diplomacyDeltas: { neighbor_valdris: +4, neighbor_arenthal: -3 }, stabilityDelta: -1 },
    invest_in_domestic_production:  { treasuryDelta: -70, merchantSatDelta: -2, commonerSatDelta: +3, regionDevelopmentDelta: +4, stabilityDelta: +2 },
    endure_the_shortfall:           { treasuryDelta: -20, merchantSatDelta: -4, commonerSatDelta: -2, stabilityDelta: -2 },
  },

  // ============================================================
  // 6. Merchant Bankruptcy — Notable
  // ============================================================
  evt_exp_eco_merchant_bankruptcy: {
    bail_out_the_merchants:  { treasuryDelta: -50, merchantSatDelta: +5, commonerSatDelta: -2, nobilitySatDelta: -2 },
    seize_merchant_assets:   { treasuryDelta: +30, merchantSatDelta: -5, nobilitySatDelta: +2, stabilityDelta: -2 },
    let_creditors_settle:    { merchantSatDelta: -3, stabilityDelta: -1, treasuryDelta: -5 },
  },

  // ============================================================
  // 7. Inflation Crisis — Critical
  // ============================================================
  evt_exp_eco_inflation_crisis: {
    mint_new_currency:             { treasuryDelta: -100, stabilityDelta: +6, merchantSatDelta: +4, commonerSatDelta: +2, nobilitySatDelta: -3 },
    freeze_all_prices:             { treasuryDelta: -40, merchantSatDelta: -6, commonerSatDelta: +5, stabilityDelta: +3, nobilitySatDelta: -2 },
    allow_free_market_correction:  { merchantSatDelta: -2, commonerSatDelta: -6, stabilityDelta: -4, treasuryDelta: +20 },
  },

  // ============================================================
  // 8. Luxury Goods Trade — Informational
  // ============================================================
  evt_exp_eco_luxury_trade: {
    open_luxury_imports:       { treasuryDelta: -15, nobilitySatDelta: +3, merchantSatDelta: +2, commonerSatDelta: -1, diplomacyDeltas: { neighbor_arenthal: +2 } },
    tax_luxury_goods_heavily:  { treasuryDelta: +20, nobilitySatDelta: -2, merchantSatDelta: -1, commonerSatDelta: +1 },
    decline_the_opportunity:   { merchantSatDelta: -1, diplomacyDeltas: { neighbor_arenthal: -1 } },
  },

  // ============================================================
  // 9. Mining Revenue Boom — Notable
  // ============================================================
  evt_exp_eco_mining_revenue: {
    expand_mining_operations:  { treasuryDelta: +30, regionDevelopmentDelta: +3, commonerSatDelta: -3, merchantSatDelta: +2, foodDelta: -5 },
    claim_royal_share:         { treasuryDelta: +40, nobilitySatDelta: -3, merchantSatDelta: -2, commonerSatDelta: -1 },
    leave_to_local_lords:      { nobilitySatDelta: +3, treasuryDelta: +5, commonerSatDelta: -2 },
  },

  // ============================================================
  // 10. Black Market Operations — Serious
  // ============================================================
  evt_exp_eco_black_market: {
    crack_down_harshly:   { treasuryDelta: -60, stabilityDelta: +5, merchantSatDelta: -4, espionageNetworkDelta: +3, commonerSatDelta: -2 },
    infiltrate_and_tax:   { treasuryDelta: +30, espionageNetworkDelta: +4, merchantSatDelta: -2, stabilityDelta: -1, commonerSatDelta: -1 },
    tolerate_for_now:     { stabilityDelta: -3, merchantSatDelta: +2, commonerSatDelta: -2, treasuryDelta: +10 },
  },

  // ============================================================
  // 11. Banking Innovation — Notable
  // ============================================================
  evt_exp_eco_banking_innovation: {
    charter_royal_bank:     { treasuryDelta: -50, merchantSatDelta: +4, stabilityDelta: +3, nobilitySatDelta: -3, commonerSatDelta: +1 },
    license_private_banks:  { treasuryDelta: +20, merchantSatDelta: +5, nobilitySatDelta: -2, clergySatDelta: -2, stabilityDelta: +1 },
    forbid_lending_houses:  { clergySatDelta: +2, merchantSatDelta: -4, treasuryDelta: -10, stabilityDelta: -1 },
  },

  // ============================================================
  // 12. Debt Crisis — Critical
  // ============================================================
  evt_exp_eco_debt_crisis: {
    default_on_debts:          { treasuryDelta: +80, merchantSatDelta: -8, nobilitySatDelta: -4, stabilityDelta: -5, diplomacyDeltas: { neighbor_arenthal: -5 } },
    negotiate_with_creditors:  { treasuryDelta: +30, merchantSatDelta: -3, stabilityDelta: +2, nobilitySatDelta: -2 },
    impose_austerity_measures: { treasuryDelta: +60, commonerSatDelta: -7, merchantSatDelta: -3, stabilityDelta: -3, militaryCasteSatDelta: -2 },
  },

  // ============================================================
  // 13. Trade Fair Opportunity — Informational
  // ============================================================
  evt_exp_eco_trade_fair: {
    host_grand_fair:    { treasuryDelta: -15, merchantSatDelta: +3, commonerSatDelta: +2, regionDevelopmentDelta: +1, foodDelta: -5 },
    modest_market_day:  { treasuryDelta: +5, merchantSatDelta: +1, commonerSatDelta: +1 },
    decline_to_host:    { merchantSatDelta: -1, commonerSatDelta: -1 },
  },

  // ============================================================
  // 14. Toll Road Dispute — Notable
  // ============================================================
  evt_exp_eco_toll_road_dispute: {
    abolish_noble_tolls:     { treasuryDelta: -20, nobilitySatDelta: -5, merchantSatDelta: +4, commonerSatDelta: +3, regionConditionDelta: +1 },
    regulate_toll_rates:     { treasuryDelta: +15, nobilitySatDelta: -2, merchantSatDelta: +2, stabilityDelta: +1 },
    uphold_noble_privilege:  { nobilitySatDelta: +3, merchantSatDelta: -3, commonerSatDelta: -2 },
  },

  // ============================================================
  // 15. Smuggling Operations — Serious
  // ============================================================
  evt_exp_eco_smuggling: {
    deploy_border_patrols:     { treasuryDelta: -60, militaryReadinessDelta: +3, merchantSatDelta: -2, stabilityDelta: +4, diplomacyDeltas: { neighbor_valdris: -2 } },
    bribe_smuggler_captains:   { treasuryDelta: -30, espionageNetworkDelta: +3, merchantSatDelta: +2, stabilityDelta: -2, commonerSatDelta: -1 },
    ignore_the_smuggling:      { stabilityDelta: -3, treasuryDelta: -15, merchantSatDelta: -1, commonerSatDelta: -2 },
  },

  // ============================================================
  // 16. Artisan Guild Demands — Notable
  // ============================================================
  evt_exp_eco_artisan_demands: {
    grant_guild_charter:  { treasuryDelta: -30, commonerSatDelta: +5, merchantSatDelta: -3, nobilitySatDelta: -2, regionDevelopmentDelta: +2 },
    offer_tax_relief:     { treasuryDelta: -20, commonerSatDelta: +3, merchantSatDelta: +1, nobilitySatDelta: -1 },
    deny_all_demands:     { commonerSatDelta: -4, stabilityDelta: -2, merchantSatDelta: +1 },
  },

  // ============================================================
  // 17. Warehouse Fire — Serious
  // ============================================================
  evt_exp_eco_warehouse_fire: {
    fund_full_reconstruction:        { treasuryDelta: -70, merchantSatDelta: +5, regionConditionDelta: +3, commonerSatDelta: +2, stabilityDelta: +2 },
    compensate_merchants_partially:  { treasuryDelta: -35, merchantSatDelta: +2, commonerSatDelta: +1, stabilityDelta: +1 },
    leave_to_private_rebuilding:     { merchantSatDelta: -4, regionConditionDelta: -3, stabilityDelta: -2 },
  },

  // ============================================================
  // 18. Counterfeit Coins — Critical
  // ============================================================
  evt_exp_eco_counterfeit_coins: {
    execute_counterfeiters:  { treasuryDelta: -20, stabilityDelta: +5, merchantSatDelta: +3, commonerSatDelta: -6, militaryReadinessDelta: +2 },
    recall_all_coinage:      { treasuryDelta: -120, merchantSatDelta: -4, stabilityDelta: +8, commonerSatDelta: +3, nobilitySatDelta: -2 },
    issue_royal_stamps:      { treasuryDelta: -50, merchantSatDelta: +2, stabilityDelta: +3, commonerSatDelta: +1, nobilitySatDelta: -3 },
  },
};
