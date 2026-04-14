import type { EventTextEntry } from '../events';

export const EXPANSION_ECONOMY_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Market Fluctuations
  // ============================================================
  evt_exp_eco_market_fluctuations: {
    title: 'Unstable Market Prices',
    body: 'Your treasury minister reports that prices in the capital market have swung wildly this fortnight, with grain and iron trading at twice their customary value one day and half the next. Merchants grumble whilst common folk struggle to plan their household budgets.',
    choices: {
      impose_price_controls: 'Impose Price Controls',
      let_market_self_correct: 'Let the Market Self-Correct',
      subsidize_essential_goods: 'Subsidize Essential Goods',
    },
  },

  // ============================================================
  // 2. Currency Debasement
  // ============================================================
  evt_exp_eco_currency_debasement: {
    title: 'The Coin Grows Thin',
    body: 'The royal mint master presents a grim accounting: the treasury cannot meet its obligations at the current rate of expenditure. He proposes mixing base metals into the Crown\'s silver coins, a practice that would stretch reserves but risk shattering merchant confidence in the realm\'s currency.',
    choices: {
      debase_the_coinage: 'Debase the Coinage',
      raise_emergency_tax: 'Raise an Emergency Tax',
      seek_foreign_loan: 'Seek a Foreign Loan',
    },
  },

  // ============================================================
  // 3. Tax Collection Dispute
  // ============================================================
  evt_exp_eco_tax_dispute: {
    title: 'Tax Collectors Turned Away',
    body: 'Crown tax collectors have been met with barred doors and angry crowds in the outlying villages. The common folk claim the assessments are unjust and demand relief, while your exchequer insists the levies are lawful and the treasury cannot afford leniency.',
    choices: {
      enforce_full_collection: 'Enforce Full Collection',
      grant_partial_amnesty: 'Grant Partial Amnesty',
      defer_collection_to_next_season: 'Defer to Next Season',
    },
  },

  // ============================================================
  // 4. Guild Monopoly
  // ============================================================
  evt_exp_eco_guild_monopoly: {
    title: 'The Merchant Guild Tightens Its Grip',
    body: 'The merchant guild has quietly bought out every independent cloth trader in the capital, fixing prices at whatever level suits their purses. Commoners pay dearly for basic textiles, yet the guild argues their control ensures consistent quality and supply.',
    choices: {
      break_the_monopoly: 'Break the Monopoly',
      tax_monopoly_profits: 'Tax the Monopoly Profits',
      permit_guild_control: 'Permit Guild Control',
    },
  },

  // ============================================================
  // 5. Foreign Trade Disruption
  // ============================================================
  evt_exp_eco_foreign_trade_disruption: {
    title: 'Arenthal Closes Its Markets',
    body: 'In retaliation for perceived slights, Arenthal has imposed punishing tariffs on goods crossing its borders. Your merchants find their caravans turned away or taxed into ruin. The trade routes that once enriched your kingdom now stand as costly liabilities.',
    choices: {
      reroute_trade_through_valdris: 'Reroute Trade Through Valdris',
      invest_in_domestic_production: 'Invest in Domestic Production',
      endure_the_shortfall: 'Endure the Shortfall',
    },
  },

  // ============================================================
  // 6. Merchant Bankruptcy
  // ============================================================
  evt_exp_eco_merchant_bankruptcy: {
    title: 'A Great House Falls',
    body: 'The wealthiest merchant house in the capital has declared itself unable to meet its debts, sending shockwaves through the trading quarter. Creditors demand satisfaction, smaller merchants fear contagion, and the common folk whisper that the Crown\'s mismanagement is to blame.',
    choices: {
      bail_out_the_merchants: 'Bail Out the Merchants',
      seize_merchant_assets: 'Seize Merchant Assets',
      let_creditors_settle: 'Let Creditors Settle It',
    },
  },

  // ============================================================
  // 7. Inflation Crisis
  // ============================================================
  evt_exp_eco_inflation_crisis: {
    title: 'The Price of Everything Rises',
    body: 'A loaf of bread now costs what a chicken did last season. The kingdom\'s currency buys less with each passing week, and panic buying has emptied market stalls across the realm. Your advisors warn that without decisive action, trade will collapse entirely.',
    choices: {
      mint_new_currency: 'Mint an Entirely New Currency',
      freeze_all_prices: 'Freeze All Prices by Decree',
      allow_free_market_correction: 'Allow Free Market Correction',
    },
  },

  // ============================================================
  // 8. Luxury Goods Trade
  // ============================================================
  evt_exp_eco_luxury_trade: {
    title: 'Silks and Spices from Arenthal',
    body: 'Arenthal\'s envoy presents a catalogue of fine goods available for import: Tyrian silks, exotic spices, and master-crafted jewelry. The nobility clamors for such refinements, though your treasury minister warns that coin spent on luxuries does not return as bread.',
    choices: {
      open_luxury_imports: 'Open Luxury Imports',
      tax_luxury_goods_heavily: 'Tax Luxury Goods Heavily',
      decline_the_opportunity: 'Decline the Opportunity',
    },
  },

  // ============================================================
  // 9. Mining Revenue Boom
  // ============================================================
  evt_exp_eco_mining_revenue: {
    title: 'Silver Veins Discovered',
    body: 'Prospectors in the highland regions report the discovery of rich silver deposits beneath Crown lands. The find could fill your coffers handsomely, though mining expansion would require labourers drawn from the fields and displace farming communities.',
    choices: {
      expand_mining_operations: 'Expand Mining Operations',
      claim_royal_share: 'Claim the Royal Share',
      leave_to_local_lords: 'Leave It to Local Lords',
    },
  },

  // ============================================================
  // 10. Black Market Operations
  // ============================================================
  evt_exp_eco_black_market: {
    title: 'Shadow Markets Flourish',
    body: 'Your spymaster confirms that an extensive black market has taken root in the capital, trading in untaxed goods, stolen wares, and forbidden imports. The shadow merchants grow bolder by the week, and the legitimate trading houses demand the Crown restore order.',
    choices: {
      crack_down_harshly: 'Crack Down with Full Force',
      infiltrate_and_tax: 'Infiltrate and Tax Quietly',
      tolerate_for_now: 'Tolerate for Now',
    },
  },

  // ============================================================
  // 11. Banking Innovation
  // ============================================================
  evt_exp_eco_banking_innovation: {
    title: 'A Proposal for Lending Houses',
    body: 'A consortium of wealthy merchants petitions for royal sanction to establish formal lending houses, promising to multiply the kingdom\'s available capital. The clergy condemns usury as sinful, while the nobility fears that merchant wealth will eclipse their own.',
    choices: {
      charter_royal_bank: 'Charter a Royal Bank',
      license_private_banks: 'License Private Banks',
      forbid_lending_houses: 'Forbid Lending Houses',
    },
  },

  // ============================================================
  // 12. Debt Crisis
  // ============================================================
  evt_exp_eco_debt_crisis: {
    title: 'The Crown Cannot Pay',
    body: 'Your exchequer kneels before the throne with an admission that chills the court: the Crown\'s debts exceed its capacity to repay. Foreign creditors grow impatient, domestic lenders withhold further coin, and the realm teeters on the edge of financial ruin.',
    choices: {
      default_on_debts: 'Default on All Debts',
      negotiate_with_creditors: 'Negotiate with Creditors',
      impose_austerity_measures: 'Impose Austerity Measures',
    },
  },

  // ============================================================
  // 13. Trade Fair Opportunity
  // ============================================================
  evt_exp_eco_trade_fair: {
    title: 'Summer Trade Fair',
    body: 'The warm season presents an opportunity to host a trade fair in the capital. Merchants from across the realm and beyond would converge upon your gates, bringing goods, coin, and news. The occasion would please the people, though provisioning such a gathering is no small matter.',
    choices: {
      host_grand_fair: 'Host a Grand Fair',
      modest_market_day: 'Hold a Modest Market Day',
      decline_to_host: 'Decline to Host',
    },
  },

  // ============================================================
  // 14. Toll Road Dispute
  // ============================================================
  evt_exp_eco_toll_road_dispute: {
    title: 'Nobles Block the King\'s Road',
    body: 'Several noble houses have erected toll gates on roads that merchants must use to reach market. The merchants protest that these private levies strangle trade, while the nobility insists that road maintenance falls upon those whose lands the routes cross.',
    choices: {
      abolish_noble_tolls: 'Abolish Noble Tolls',
      regulate_toll_rates: 'Regulate Toll Rates',
      uphold_noble_privilege: 'Uphold Noble Privilege',
    },
  },

  // ============================================================
  // 15. Smuggling Operations
  // ============================================================
  evt_exp_eco_smuggling: {
    title: 'Contraband on the Border',
    body: 'Reports reach the throne of organized smuggling rings operating along the Valdris border, moving untaxed goods in both directions. The smugglers bribe local officials and employ armed escorts, making them as much a security concern as a fiscal one.',
    choices: {
      deploy_border_patrols: 'Deploy Border Patrols',
      bribe_smuggler_captains: 'Bribe the Smuggler Captains',
      ignore_the_smuggling: 'Ignore the Smuggling',
    },
  },

  // ============================================================
  // 16. Artisan Guild Demands
  // ============================================================
  evt_exp_eco_artisan_demands: {
    title: 'The Artisans Demand Recognition',
    body: 'Master craftsmen — weavers, tanners, potters, and carpenters — have united to petition the throne for a formal charter granting them collective rights. They seek fair wages and protection from merchant exploitation, but the trading houses warn that guild power will inflate costs for all.',
    choices: {
      grant_guild_charter: 'Grant a Guild Charter',
      offer_tax_relief: 'Offer Tax Relief Instead',
      deny_all_demands: 'Deny All Demands',
    },
  },

  // ============================================================
  // 17. Warehouse Fire
  // ============================================================
  evt_exp_eco_warehouse_fire: {
    title: 'Fire in the Trading Quarter',
    body: 'A devastating blaze has consumed three warehouses along the harbour, destroying stockpiles of grain, timber, and imported cloth. The merchants affected plead for royal compensation, warning that without it, they cannot fulfil contracts that keep the capital supplied.',
    choices: {
      fund_full_reconstruction: 'Fund Full Reconstruction',
      compensate_merchants_partially: 'Compensate Partially',
      leave_to_private_rebuilding: 'Leave to Private Rebuilding',
    },
  },

  // ============================================================
  // 18. Counterfeit Coins
  // ============================================================
  evt_exp_eco_counterfeit_coins: {
    title: 'False Coin Floods the Realm',
    body: 'Merchants across the kingdom report a surge of counterfeit silver coins so skillfully forged that only an assayer can tell them from true currency. Trust in the Crown\'s coinage erodes daily, and trade has slowed to a crawl as sellers demand to weigh every coin by hand.',
    choices: {
      execute_counterfeiters: 'Execute the Counterfeiters',
      recall_all_coinage: 'Recall All Coinage for Reissue',
      issue_royal_stamps: 'Issue Royal Verification Stamps',
    },
  },
};
