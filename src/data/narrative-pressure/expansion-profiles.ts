import type { StorylineActivationProfile } from '../../engine/types';

export const EXPANSION_STORYLINE_ACTIVATION_PROFILES: Record<string, StorylineActivationProfile> = {
  // Political — The Council of Lords
  // Nobles demand an advisory council; authority + intrigue axes
  sl_exp_council_of_lords: {
    primaryAxis: 'authority',
    primaryThreshold: 30,
    secondaryAxis: 'intrigue',
    secondaryThreshold: 15,
    minTurn: 10,
    priority: 5,
  },

  // Political — The Foreign Bride
  // Marriage alliance with political strings; openness + commerce axes
  sl_exp_foreign_bride: {
    primaryAxis: 'openness',
    primaryThreshold: 25,
    secondaryAxis: 'commerce',
    secondaryThreshold: 15,
    suppressedByAxis: 'isolation',
    suppressedByThreshold: 30,
    minTurn: 9,
    priority: 5,
  },

  // Religious — The Relic Discovery
  // Contested holy relic, orthodox vs reform; piety axis
  sl_exp_relic_discovery: {
    primaryAxis: 'piety',
    primaryThreshold: 30,
    suppressedByAxis: 'reform',
    suppressedByThreshold: 40,
    minTurn: 9,
    priority: 5,
  },

  // Religious — The Witch Trials
  // Sorcery accusations spread; piety + authority axes
  sl_exp_witch_trials: {
    primaryAxis: 'piety',
    primaryThreshold: 35,
    secondaryAxis: 'authority',
    secondaryThreshold: 20,
    minTurn: 11,
    priority: 6,
  },

  // Military — The Mercenary Company
  // Mercenaries offer services at a price; militarism + commerce axes
  sl_exp_mercenary_company: {
    primaryAxis: 'militarism',
    primaryThreshold: 30,
    secondaryAxis: 'commerce',
    secondaryThreshold: 15,
    minTurn: 9,
    priority: 5,
  },

  // Military — The Veterans' March
  // Demobilized soldiers demand pensions; militarism + reform axes
  sl_exp_veterans_march: {
    primaryAxis: 'militarism',
    primaryThreshold: 25,
    secondaryAxis: 'reform',
    secondaryThreshold: 15,
    suppressedByAxis: 'authority',
    suppressedByThreshold: 45,
    minTurn: 10,
    priority: 5,
  },

  // TradeEcon — The Silk Road
  // Overland trade route proposal; commerce + openness axes
  sl_exp_silk_road: {
    primaryAxis: 'commerce',
    primaryThreshold: 30,
    secondaryAxis: 'openness',
    secondaryThreshold: 20,
    minTurn: 10,
    priority: 5,
  },

  // TradeEcon — The Currency Crisis
  // Foreign debased currency floods markets; commerce axis
  sl_exp_currency_crisis: {
    primaryAxis: 'commerce',
    primaryThreshold: 35,
    suppressedByAxis: 'isolation',
    suppressedByThreshold: 35,
    minTurn: 11,
    priority: 6,
  },

  // Discovery — The Ancient Library
  // Buried knowledge cache discovered; openness + intrigue axes
  sl_exp_ancient_library: {
    primaryAxis: 'openness',
    primaryThreshold: 30,
    secondaryAxis: 'intrigue',
    secondaryThreshold: 15,
    minTurn: 9,
    priority: 4,
  },

  // Discovery — The Cartographers' Guild
  // Uncharted territory found; commerce + militarism axes
  sl_exp_cartographers_guild: {
    primaryAxis: 'commerce',
    primaryThreshold: 25,
    secondaryAxis: 'militarism',
    secondaryThreshold: 15,
    minTurn: 10,
    priority: 4,
  },

  // Cultural — The Bards' Rebellion
  // Satirical songs become political dissent; reform + openness axes
  sl_exp_bards_rebellion: {
    primaryAxis: 'reform',
    primaryThreshold: 30,
    secondaryAxis: 'openness',
    secondaryThreshold: 15,
    suppressedByAxis: 'authority',
    suppressedByThreshold: 40,
    minTurn: 9,
    priority: 5,
  },

  // Cultural — The Builder's Vision
  // Grand construction project; commerce + authority axes
  sl_exp_builders_vision: {
    primaryAxis: 'commerce',
    primaryThreshold: 30,
    secondaryAxis: 'authority',
    secondaryThreshold: 20,
    minTurn: 11,
    priority: 5,
  },
};
