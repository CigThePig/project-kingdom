// World Pulse Templates — ambient flavor text shown on MonthDawn.
// Each template has a condition function, text function, category, and weight.

import { WorldPulseCategory, Season } from '../../engine/types';
import type { GameState } from '../../engine/types';
import { getNeighborDisplayName } from '../../bridge/nameResolver';

// ============================================================
// Template interface
// ============================================================

export interface WorldPulseTemplate {
  id: string;
  category: WorldPulseCategory;
  /** Returns true if this pulse line is eligible given current state */
  condition: (state: GameState) => boolean;
  /** Returns the text, with any variable substitution applied */
  text: (state: GameState) => string;
  /** Minimum espionage network strength required (NeighborActivity only) */
  minIntelStrength?: number;
  /** Weight multiplier — higher = more likely to be selected */
  weight: number;
}

// ============================================================
// Helpers
// ============================================================

function neighborName(state: GameState, index: number): string {
  const neighbor = state.diplomacy.neighbors[index];
  if (!neighbor) return 'a neighboring kingdom';
  return getNeighborDisplayName(neighbor.id, state);
}

function hasNeighbor(state: GameState, index: number): boolean {
  return index < state.diplomacy.neighbors.length;
}

// ============================================================
// NeighborActivity (15+ templates)
// ============================================================

const NEIGHBOR_ACTIVITY: WorldPulseTemplate[] = [
  {
    id: 'na_military_activity_0',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].militaryStrength >= 50,
    text: (s) => `Traders from ${neighborName(s, 0)} report unusual military activity.`,
    minIntelStrength: 0,
    weight: 2,
  },
  {
    id: 'na_military_activity_1',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.diplomacy.neighbors[1].militaryStrength >= 60,
    text: (s) => `Scouts report troop movements along the ${neighborName(s, 1)} border.`,
    minIntelStrength: 0,
    weight: 2,
  },
  {
    id: 'na_border_closed',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].relationshipScore < 30,
    text: (s) => `${neighborName(s, 0)} has restricted traffic along the northern border.`,
    minIntelStrength: 0,
    weight: 2,
  },
  {
    id: 'na_refugees',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.diplomacy.neighbors[1].warWeariness > 30,
    text: (s) => `Refugees from ${neighborName(s, 1)} seek entry — they speak of hardship.`,
    minIntelStrength: 0,
    weight: 2,
  },
  {
    id: 'na_trade_flourishing',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].relationshipScore >= 60,
    text: (s) => `Trade caravans from ${neighborName(s, 0)} arrive with increasing frequency.`,
    minIntelStrength: 0,
    weight: 1,
  },
  {
    id: 'na_diplomatic_overture',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].pendingProposals.length > 0,
    text: (s) => `Diplomats from ${neighborName(s, 0)} have been seen arriving at the capital.`,
    minIntelStrength: 10,
    weight: 3,
  },
  {
    id: 'na_spies_report_unrest',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.diplomacy.neighbors[1].warWeariness > 50,
    text: (s) => `Sources within ${neighborName(s, 1)} report growing popular unrest.`,
    minIntelStrength: 50,
    weight: 2,
  },
  {
    id: 'na_arms_production',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].militaryStrength >= 70,
    text: (s) => `Intelligence suggests ${neighborName(s, 0)} has increased arms production.`,
    minIntelStrength: 30,
    weight: 2,
  },
  {
    id: 'na_merchant_gossip',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.treasury.balance > 100,
    text: (s) => `Merchants gossip about political changes in ${neighborName(s, 1)}.`,
    minIntelStrength: 20,
    weight: 1,
  },
  {
    id: 'na_border_fortification',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.diplomacy.neighbors[1].relationshipScore < 40,
    text: (s) => `${neighborName(s, 1)} appears to be fortifying positions near our border.`,
    minIntelStrength: 10,
    weight: 2,
  },
  {
    id: 'na_harvest_report',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.turn.season === Season.Autumn,
    text: (s) => `Traders report that ${neighborName(s, 0)}'s harvest was poor this year.`,
    minIntelStrength: 20,
    weight: 1,
  },
  {
    id: 'na_religious_expansion',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.faithCulture.heterodoxy > 30,
    text: (s) => `Religious missionaries from ${neighborName(s, 1)} have been seen in the provinces.`,
    minIntelStrength: 0,
    weight: 2,
  },
  {
    id: 'na_economic_strength',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].relationshipScore >= 50,
    text: (s) => `${neighborName(s, 0)} appears to enjoy a period of economic prosperity.`,
    minIntelStrength: 20,
    weight: 1,
  },
  {
    id: 'na_war_preparation',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 1) && s.diplomacy.neighbors[1].isAtWarWithPlayer,
    text: (s) => `${neighborName(s, 1)} rallies its people for continued war against us.`,
    minIntelStrength: 0,
    weight: 3,
  },
  {
    id: 'na_cultural_exchange',
    category: WorldPulseCategory.NeighborActivity,
    condition: (s) => hasNeighbor(s, 0) && s.diplomacy.neighbors[0].relationshipScore >= 70,
    text: (s) => `Scholars from ${neighborName(s, 0)} visit our libraries, and ours theirs.`,
    minIntelStrength: 0,
    weight: 1,
  },
];

// ============================================================
// KingdomCondition (12+ templates)
// ============================================================

const KINGDOM_CONDITION: WorldPulseTemplate[] = [
  {
    id: 'kc_roads_rutted',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.regions.some((r) => r.developmentLevel < 30),
    text: () => 'The eastern roads grow rutted and merchants complain of delays.',
    weight: 1,
  },
  {
    id: 'kc_granaries_full',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.food.reserves > s.food.consumptionPerTurn * 8,
    text: () => 'Granaries in the heartland are nearly full.',
    weight: 2,
  },
  {
    id: 'kc_construction_progress',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.constructionProjects.length > 0,
    text: () => 'Construction crews make steady progress on current building projects.',
    weight: 1,
  },
  {
    id: 'kc_treasury_woes',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.treasury.netFlowPerTurn < -10,
    text: () => 'The treasury stewards express concern over mounting expenses.',
    weight: 2,
  },
  {
    id: 'kc_food_shortage',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.food.reserves < s.food.consumptionPerTurn * 2,
    text: () => 'Market stalls show fewer goods. Prices for basic staples rise steadily.',
    weight: 3,
  },
  {
    id: 'kc_stability_high',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.stability.value > 65,
    text: () => 'The kingdom enjoys a rare period of tranquility. Citizens go about their business with confidence.',
    weight: 1,
  },
  {
    id: 'kc_military_parade',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.military.morale > 70 && s.military.readiness > 60,
    text: () => 'Soldiers parade through the capital with pride. The people cheer their protectors.',
    weight: 1,
  },
  {
    id: 'kc_trade_thriving',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.treasury.income.trade > 20,
    text: () => 'Trade routes bustle with activity. Merchant guilds report excellent profits this season.',
    weight: 1,
  },
  {
    id: 'kc_faith_declining',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.faithCulture.faithLevel < 30,
    text: () => 'Temple attendance has declined noticeably. The clergy worry about waning devotion.',
    weight: 2,
  },
  {
    id: 'kc_population_unrest',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => Object.values(s.population).some((c) => c.satisfaction < 25),
    text: () => 'Discontent murmurs can be heard in the markets. Not all are pleased with the crown\u2019s direction.',
    weight: 2,
  },
  {
    id: 'kc_development_booming',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.regions.every((r) => r.developmentLevel > 50),
    text: () => 'Every region shows signs of growth. The kingdom\u2019s infrastructure has never been stronger.',
    weight: 1,
  },
  {
    id: 'kc_espionage_active',
    category: WorldPulseCategory.KingdomCondition,
    condition: (s) => s.espionage.networkStrength > 40,
    text: () => 'The spymaster reports that intelligence networks operate smoothly across the realm.',
    weight: 1,
  },
];

// ============================================================
// FactionMurmur (10+ templates)
// ============================================================

const FACTION_MURMUR: WorldPulseTemplate[] = [
  {
    id: 'fm_clergy_favorable',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Clergy.satisfaction > 60,
    text: () => 'The clergy speak favorably of your recent decisions from the pulpit.',
    weight: 1,
  },
  {
    id: 'fm_noble_grumble',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Nobility.satisfaction < 40,
    text: () => 'Noble houses grumble about taxes in the great hall.',
    weight: 2,
  },
  {
    id: 'fm_soldiers_songs',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.military.morale > 60,
    text: () => 'Soldiers share songs and stories of recent campaigns in the barracks.',
    weight: 1,
  },
  {
    id: 'fm_merchant_optimism',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Merchants.satisfaction > 55,
    text: () => 'Merchants speak optimistically of expanding their ventures under the crown\u2019s protection.',
    weight: 1,
  },
  {
    id: 'fm_commoner_hardship',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Commoners.satisfaction < 35,
    text: () => 'Common folk whisper of hardship and wonder when relief will come.',
    weight: 2,
  },
  {
    id: 'fm_military_caste_pride',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.MilitaryCaste.satisfaction > 60,
    text: () => 'The military caste expresses pride in serving the crown.',
    weight: 1,
  },
  {
    id: 'fm_noble_intrigue',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Nobility.satisfaction < 30,
    text: () => 'Whispers of noble intrigue reach the court. Not all houses are content with the current order.',
    weight: 3,
  },
  {
    id: 'fm_clergy_concern',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.faithCulture.heterodoxy > 40,
    text: () => 'The clergy express concern about growing heterodox movements among the people.',
    weight: 2,
  },
  {
    id: 'fm_merchant_competition',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Merchants.satisfaction < 40,
    text: () => 'Merchant guilds argue bitterly over trade routes and market access.',
    weight: 2,
  },
  {
    id: 'fm_commoner_gratitude',
    category: WorldPulseCategory.FactionMurmur,
    condition: (s) => s.population.Commoners.satisfaction > 65,
    text: () => 'Common folk offer prayers of thanks for the crown\u2019s benevolent rule.',
    weight: 1,
  },
];

// ============================================================
// Seasonal (8+ templates)
// ============================================================

const SEASONAL: WorldPulseTemplate[] = [
  {
    id: 'sea_first_snows',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Winter,
    text: () => 'The first snows dust the northern mountains.',
    weight: 2,
  },
  {
    id: 'sea_spring_rains',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Spring,
    text: () => 'Spring rains swell the rivers \u2014 the fields will be fertile.',
    weight: 2,
  },
  {
    id: 'sea_summer_heat',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Summer,
    text: () => 'Summer heat bakes the southern plains. Farmers pray for an early harvest.',
    weight: 2,
  },
  {
    id: 'sea_autumn_colors',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Autumn,
    text: () => 'The forests blaze with autumn colors as the harvest season begins.',
    weight: 2,
  },
  {
    id: 'sea_winter_storms',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Winter,
    text: () => 'Winter storms batter the coastline. Ships shelter in harbor until the gales pass.',
    weight: 1,
  },
  {
    id: 'sea_spring_bloom',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Spring,
    text: () => 'Wildflowers carpet the meadows as the kingdom shakes off winter\u2019s grip.',
    weight: 1,
  },
  {
    id: 'sea_summer_festivals',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Summer,
    text: () => 'Long summer evenings bring outdoor festivals and merriment to the villages.',
    weight: 1,
  },
  {
    id: 'sea_autumn_migration',
    category: WorldPulseCategory.Seasonal,
    condition: (s) => s.turn.season === Season.Autumn,
    text: () => 'Great flocks of birds pass overhead, following ancient paths to warmer lands.',
    weight: 1,
  },
];

// ============================================================
// Foreshadowing (8+ templates)
// ============================================================

const FORESHADOWING: WorldPulseTemplate[] = [
  {
    id: 'fore_strange_lights',
    category: WorldPulseCategory.Foreshadowing,
    condition: () => true,
    text: () => 'Strange lights are seen over the eastern marshes.',
    weight: 1,
  },
  {
    id: 'fore_ancient_ruins',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.turn.turnNumber > 5,
    text: () => 'A merchant claims to have found ancient ruins beneath the old quarry.',
    weight: 1,
  },
  {
    id: 'fore_prophecy',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.faithCulture.faithLevel > 40,
    text: () => 'An old prophecy circulates among the clergy \u2014 they say the signs are aligning.',
    weight: 1,
  },
  {
    id: 'fore_omens',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.stability.value < 50,
    text: () => 'Villagers report strange omens \u2014 a red moon, a two-headed calf, crows that fly in circles.',
    weight: 1,
  },
  {
    id: 'fore_old_maps',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.turn.turnNumber > 8,
    text: () => 'Scholars in the royal library have uncovered old maps showing passages beneath the mountains.',
    weight: 1,
  },
  {
    id: 'fore_wandering_mystic',
    category: WorldPulseCategory.Foreshadowing,
    condition: () => true,
    text: () => 'A wandering mystic arrives at court, speaking of a great change coming to the land.',
    weight: 1,
  },
  {
    id: 'fore_tremors',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.turn.turnNumber > 10,
    text: () => 'Miners report tremors deep underground. The earth grows restless.',
    weight: 1,
  },
  {
    id: 'fore_comet',
    category: WorldPulseCategory.Foreshadowing,
    condition: (s) => s.turn.turnNumber > 3,
    text: () => 'A bright comet streaks across the night sky. Some call it an omen; others, a blessing.',
    weight: 1,
  },
];

// ============================================================
// Combined template pool
// ============================================================

export const WORLD_PULSE_TEMPLATES: WorldPulseTemplate[] = [
  ...NEIGHBOR_ACTIVITY,
  ...KINGDOM_CONDITION,
  ...FACTION_MURMUR,
  ...SEASONAL,
  ...FORESHADOWING,
];
