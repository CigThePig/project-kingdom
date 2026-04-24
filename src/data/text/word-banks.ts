// Phase 1 — Procedural Naming System
// Word banks for procedural kingdom, ruler, dynasty, region, and agent name generation.
// Card-audit workstream Phase 6 also stores the class-supplicant stem library
// at the bottom of this file (used as author-time prose snippets, not
// substituted at runtime).
// Pure data. No logic.

// ============================================================
// Kingdom Name Components
// ============================================================

export const KINGDOM_NAME_PREFIXES: readonly string[] = [
  'Vel', 'Ost', 'Cael', 'Pell', 'Karn', 'Brun', 'Hald', 'Mar', 'Ren', 'Thal',
  'Drak', 'Vor', 'Sel', 'Ash', 'Cor', 'Em', 'Ferr', 'Gar', 'Hael', 'Kor',
  'Lyn', 'Myr', 'Nor', 'Pyr', 'Quel', 'Rav', 'Sten', 'Thorn', 'Ulf', 'Wyn',
];

export const KINGDOM_NAME_ROOTS: readonly string[] = [
  'thorne', 'mark', 'nir', 'anth', 'vale', 'moor', 'reach', 'stand', 'fall', 'watch',
  'ward', 'hold', 'spire', 'crest', 'hollow', 'ridge', 'fen', 'down', 'haven', 'stead',
  'burgh', 'garde', 'court', 'marsh', 'wold', 'shire', 'deep', 'rise', 'field', 'wend',
];

export const KINGDOM_NAME_PATTERNS: readonly string[] = [
  'Kingdom of {0}',
  'The {0}',
  '{0} Dominion',
  'Free Cities of {0}',
  'Realm of {0}',
  '{0} Confederation',
  '{0} Marches',
  'Crown of {0}',
];

// ============================================================
// Ruler Names
// ============================================================

export const RULER_TITLES: readonly string[] = [
  'King', 'Queen', 'High Lord', 'High Lady', 'Empress', 'Emperor', 'Sovereign', 'Warlord',
];

export const MASCULINE_NAMES: readonly string[] = [
  'Hadric', 'Bran', 'Aldis', 'Corwin', 'Drask', 'Edric', 'Faelan', 'Garron', 'Halric', 'Ivor',
  'Jorin', 'Karth', 'Lorn', 'Magnus', 'Nestor', 'Orin', 'Pyrrhus', 'Quintar', 'Ranulf', 'Stellan',
  'Tomas', 'Ulfric', 'Vorn', 'Wystan', 'Xenric', 'Yorick', 'Zerric', 'Beren', 'Cedric', 'Donnar',
  'Erran', 'Fulko', 'Gerwin', 'Holt', 'Iden', 'Joran', 'Kael', 'Loras', 'Mardin', 'Nylan',
];

export const FEMININE_NAMES: readonly string[] = [
  'Selivane', 'Brynn', 'Aelis', 'Cera', 'Delyth', 'Elin', 'Faela', 'Gretha', 'Halle', 'Iola',
  'Jora', 'Karis', 'Lyra', 'Maeren', 'Nessa', 'Orla', 'Phaedra', 'Quenna', 'Rian', 'Selene',
  'Tova', 'Una', 'Vesna', 'Wynn', 'Xenia', 'Ymara', 'Zara', 'Alestra', 'Brenna', 'Caelyn',
  'Daria', 'Eira', 'Fenna', 'Gisela', 'Hesta', 'Ilse', 'Jaena', 'Kerith', 'Lirien', 'Maren',
];

export const REGNAL_NUMERALS: readonly string[] = [
  '', '', '', // weighted toward no numeral
  'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII',
];

// ============================================================
// Dynasty Names
// ============================================================

export const DYNASTY_PREFIXES: readonly string[] = [
  'House', 'Clan', 'the Line of', 'the Sons of', 'the Daughters of', 'House of', 'the',
];

export const DYNASTY_ROOTS: readonly string[] = [
  'Marrowmoor', 'Hollowsong', 'Arnvik', 'Greycliff', 'Ironhand', 'Stormgate', 'Coldwater',
  'Brightspire', 'Darkmere', 'Goldhart', 'Stillvale', 'Northkeep', 'Suncrest', 'Wildmark',
  'Oldoak', 'Whitethorn', 'Blackwater', 'Redforge', 'Silverleaf', 'Thornwall',
  'Crowncliff', 'Stonereach', 'Embervale', 'Frostmere', 'Glassford', 'Highmoor',
  'Ravenhold', 'Saltcrest', 'Vinegate', 'Wolfsden',
];

// ============================================================
// Epithets — categorized by personality archetype
// ============================================================

export const EPITHETS_AGGRESSIVE: readonly string[] = [
  'the Iron-Handed', 'the Conqueror', 'the Wolf', 'the Unyielding', 'the Bloody',
  'the Fierce', 'the Stormbringer', 'the Bold', 'the Hammer', 'the Spear',
  'the Burner', 'the Reaver', 'the Implacable', 'the Wrathful', 'the Sword',
];

export const EPITHETS_PRAGMATIC: readonly string[] = [
  'the Patient', 'the Gilded', 'the Calculating', 'the Shrewd', 'the Fox',
  'the Diplomat', 'the Weaver', 'the Cunning', 'the Subtle', 'the Quill',
  'the Scholar', 'the Fair', 'the Just', 'the Wise', 'the Measured',
];

export const EPITHETS_DEVOUT: readonly string[] = [
  'the Devout', 'the Pilgrim', 'the Pious', 'the Saint', 'the Reverent',
  'the Cloistered', 'the Faithful', 'the Holy', 'the Righteous', 'the Blessed',
  'the Pure', 'the Solemn', 'the Old Faith', 'the Quiet', 'the Withdrawn',
];

// ============================================================
// Region Name Components — by terrain
// ============================================================

export const REGION_PREFIXES_PLAINS: readonly string[] = [
  'Corn', 'Grain', 'Sun', 'Open', 'Long', 'Wide', 'Gold', 'Wheat', 'Reed', 'Meadow',
];

export const REGION_PREFIXES_HILLS: readonly string[] = [
  'Iron', 'Stone', 'Grey', 'Hollow', 'Bare', 'Crow', 'Ridge', 'High', 'Old', 'Black',
];

export const REGION_PREFIXES_FOREST: readonly string[] = [
  'Oak', 'Pine', 'Dark', 'Deep', 'Wolf', 'Thorn', 'Green', 'Wild', 'Fern', 'Ash',
];

export const REGION_PREFIXES_COASTAL: readonly string[] = [
  'Salt', 'Tide', 'Storm', 'Shell', 'Surf', 'Gull', 'Pearl', 'Brine', 'Cove', 'Foam',
];

export const REGION_PREFIXES_MOUNTAIN: readonly string[] = [
  'Sky', 'Cloud', 'Stone', 'Frost', 'Snow', 'Eagle', 'Spire', 'Crag', 'Rim', 'Iron',
];

export const REGION_PREFIXES_RIVER: readonly string[] = [
  'Run', 'Mill', 'Ford', 'Bend', 'Reed', 'Otter', 'Salmon', 'Bridge', 'Mire', 'Silver',
];

export const REGION_SUFFIXES: Record<string, readonly string[]> = {
  Plains: ['Lowlands', 'Fields', 'Meadow', 'Flats', 'Grasslands', 'Reach'],
  Hills: ['Reach', 'Heights', 'Downs', 'Wolds', 'Slopes', 'Crests'],
  Forest: ['Wood', 'Forest', 'Wilds', 'Greenshade', 'Thicket', 'Holt'],
  Coastal: ['Coast', 'Shore', 'Cove', 'Strand', 'Bay', 'Reach'],
  Mountain: ['Heights', 'Peaks', 'Spires', 'Reach', 'Range', 'Crag'],
  River: ['Vale', 'Run', 'Reach', 'Bend', 'Ford', 'Banks'],
};

// ============================================================
// Settlement Name Components — by role and terrain (Phase 2.5)
// ============================================================
// Settlements are named locations inside a player region (capital, market,
// fortress, shrine, minor). Word banks mix role flavor and terrain flavor so
// a "fortress" on a mountain terrain reads different from one on a coast.

export const SETTLEMENT_PREFIXES_CAPITAL: readonly string[] = [
  'Crown', 'High', 'Royal', 'Old', 'Great', 'Kings', 'Queens', 'First', 'Throne', 'Court',
];

export const SETTLEMENT_PREFIXES_MARKET: readonly string[] = [
  'Gold', 'Silver', 'Copper', 'Trader', 'Market', 'Coin', 'Fair', 'Caravan', 'Bridge', 'Scale',
];

export const SETTLEMENT_PREFIXES_FORTRESS: readonly string[] = [
  'Iron', 'Black', 'Stone', 'Wall', 'Watch', 'Shield', 'Spear', 'Guard', 'Bulwark', 'Keep',
];

export const SETTLEMENT_PREFIXES_SHRINE: readonly string[] = [
  'Saint', 'Holy', 'Quiet', 'White', 'Grey', 'Vigil', 'Cloister', 'Hymn', 'Pilgrim', 'Chapel',
];

export const SETTLEMENT_PREFIXES_MINOR: readonly string[] = [
  'Old', 'Little', 'Lower', 'Upper', 'North', 'South', 'East', 'West', 'Long', 'Low',
];

export const SETTLEMENT_ROOTS_BY_TERRAIN: Record<string, readonly string[]> = {
  Plains:   ['ford', 'cross', 'field', 'meadow', 'grange', 'hollow', 'stead', 'furrow'],
  Hills:    ['mere', 'crest', 'ridge', 'barrow', 'knoll', 'downs', 'scar', 'cairn'],
  Forest:   ['holt', 'wick', 'thorn', 'glade', 'hollow', 'copse', 'bough', 'briar'],
  Coastal: ['port', 'cove', 'strand', 'harbor', 'reach', 'wharf', 'shoal', 'haven'],
  Mountain: ['gate', 'pass', 'peak', 'spire', 'crag', 'watch', 'hollow', 'stone'],
  River:    ['bridge', 'ford', 'mill', 'bank', 'bend', 'run', 'weir', 'reach'],
};

// Role-agnostic fallback roots, used when terrain is unknown.
export const SETTLEMENT_ROOTS_GENERIC: readonly string[] = [
  'hold', 'cross', 'stead', 'gate', 'watch', 'keep', 'reach', 'march', 'ford', 'row',
];

// ============================================================
// Agent Codenames — for Phase 14
// ============================================================

export const AGENT_CODENAME_ARTICLES: readonly string[] = [
  'the', 'the', 'the', 'Black', 'Silver', 'Grey', 'Quiet', 'Long', 'Iron', 'Old',
];

export const AGENT_CODENAME_NOUNS: readonly string[] = [
  'Magpie', 'Owl', 'Hand', 'Whisper', 'Shadow', 'Fox', 'Wolf', 'Knife', 'Quill', 'Rose',
  'Mirror', 'Crow', 'Spider', 'Heron', 'Hare', 'Lantern', 'Coin', 'Mask', 'Veil', 'Thread',
];

// ============================================================
// Capital City Components
// ============================================================

export const CAPITAL_PREFIXES: readonly string[] = [
  'Aur', 'Bel', 'Cor', 'Dur', 'Em', 'Fir', 'Gor', 'Hal', 'Iv', 'Jor',
  'Kar', 'Lor', 'Mer', 'Nyr', 'Or', 'Pen', 'Quil', 'Ran', 'Sel', 'Tan',
];

export const CAPITAL_SUFFIXES: readonly string[] = [
  'aire', 'antha', 'erra', 'inth', 'oria', 'ynna', 'ovar', 'illin', 'addan', 'engar',
];

// ============================================================
// Culture-based Selection Bias
// ============================================================
// Each culture identity ID prefers certain word indices.
// These are weighting hints — generators should boost (not exclude) preferred indices.

export interface CultureBias {
  kingdomPrefixBoost: readonly number[];   // indices into KINGDOM_NAME_PREFIXES
  kingdomRootBoost: readonly number[];
  rulerNameBoost: readonly number[];        // indices into MASCULINE/FEMININE
  dynastyRootBoost: readonly number[];
}

// Highland culture: harder consonants, martial/territorial flavor
const HIGHLAND_BIAS: CultureBias = {
  kingdomPrefixBoost: [0, 4, 5, 6, 12, 13, 21, 24],     // Vel, Karn, Brun, Hald, Drak, Vor, Myr, Pyr
  kingdomRootBoost: [0, 6, 7, 11, 13, 15],              // thorne, reach, stand, hold, crest, ridge
  rulerNameBoost: [0, 1, 7, 11, 17, 21],                // Hadric, Bran, Garron, Karth, Pyrrhus, Tomas
  dynastyRootBoost: [0, 4, 5, 9, 11, 14],               // Marrowmoor, Ironhand, Stormgate, Goldhart, Northkeep, Oldoak
};

// Coastal culture: flowing vowels, maritime/mercantile flavor
const COASTAL_BIAS: CultureBias = {
  kingdomPrefixBoost: [2, 3, 8, 10, 15, 19, 22],        // Cael, Pell, Ren, Thal, Em, Kor, Nor
  kingdomRootBoost: [2, 3, 8, 18, 22, 28],              // nir, anth, fall, haven, court, field
  rulerNameBoost: [5, 9, 13, 17, 25],                   // Edric, Ivor, Lorn, Pyrrhus, Yorick
  dynastyRootBoost: [1, 6, 12, 18, 27, 28],             // Hollowsong, Coldwater, Stillvale, Whitethorn, Saltcrest, Vinegate
};

// Reformed faith: austere, plain, militant tone
const REFORMED_BIAS: CultureBias = {
  kingdomPrefixBoost: [4, 13, 14, 16, 27],              // Karn, Vor, Sel, Ferr, Thorn
  kingdomRootBoost: [4, 9, 11, 16, 25],                 // vale, watch, hold, fen, shire
  rulerNameBoost: [3, 13, 14, 22, 27],                  // Corwin, Lorn, Magnus, Vorn, Beren
  dynastyRootBoost: [4, 5, 8, 13, 17],                  // Ironhand, Stormgate, Darkmere, Wildmark, Blackwater
};

// Orthodox faith: reverent, traditional, established tone
const ORTHODOX_BIAS: CultureBias = {
  kingdomPrefixBoost: [0, 2, 9, 17, 19],                // Vel, Cael, Thal, Hael, Kor
  kingdomRootBoost: [0, 5, 12, 19, 21],                 // thorne, moor, spire, stead, garde
  rulerNameBoost: [0, 7, 12, 23],                       // Hadric, Garron, Karth, Stellan
  dynastyRootBoost: [0, 3, 10, 16, 19],                 // Marrowmoor, Greycliff, Brightspire, Crowncliff, Highmoor
};

export const CULTURE_FILTERS: Record<string, CultureBias> = {
  highland: HIGHLAND_BIAS,
  coastal: COASTAL_BIAS,
  reformed: REFORMED_BIAS,
  orthodox: ORTHODOX_BIAS,
};

// Default bias applied when culture is unknown — empty boosts mean uniform selection.
export const DEFAULT_CULTURE_BIAS: CultureBias = {
  kingdomPrefixBoost: [],
  kingdomRootBoost: [],
  rulerNameBoost: [],
  dynastyRootBoost: [],
};

// ============================================================
// Class Supplicant Stems (Phase 6 — card-audit workstream)
// ============================================================
// Shared opening phrases indexed by family × class. Used at author time to
// keep class-naming retexts coherent across the corpus instead of 331 bespoke
// sentences. Stems embed class labels literally (so the scanner's literal-
// match path resolves) and leave `{region}` / `{settlement}` tokens in place
// for runtime substitution where a card's binding supplies them.
//
// Keys match the `family` values reported by the audit corpus.

export const CLASS_SUPPLICANT_STEMS = {
  petition: {
    Nobility: 'A delegation of the Nobility has requested audience at court',
    Clergy: 'A senior Clergy delegation has sought audience at court',
    Merchants: 'Masters of the Merchant Guild have requested audience',
    Commoners: 'Petitioners from the Commonfolk have gathered at the palace gates',
    MilitaryCaste: 'Captains of the Military Caste have requested an audience',
  },
  crisis: {
    Nobility: 'Word from the Nobility cuts through the court',
    Clergy: 'The Clergy send urgent warning',
    Merchants: 'The Merchant Guild rushes word to the throne',
    Commoners: 'Unrest rises among the Commonfolk',
    MilitaryCaste: 'The Military Caste sounds the alarm',
  },
  decree: {
    Nobility: 'Before the assembled Nobility, the crown declares',
    Clergy: 'To the Clergy of the realm, the crown declares',
    Merchants: 'To the Merchant Guild, the crown decrees',
    Commoners: 'To the Commonfolk of every province, the crown decrees',
    MilitaryCaste: 'Before the Military Caste, the crown decrees',
  },
  notification: {
    Nobility: 'A dispatch from the Nobility reaches the court',
    Clergy: 'Word arrives from the Clergy',
    Merchants: 'A report from the Merchant Guild reaches the court',
    Commoners: 'A dispatch from the Commonfolk reaches the court',
    MilitaryCaste: 'A report from the Military Caste reaches the court',
  },
} as const;
