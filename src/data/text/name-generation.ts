// Phase 1 — Procedural Naming System
// Seeded procedural generators for kingdom names, rulers, dynasties, regions, and agents.
// All functions are pure and deterministic given the same seed.

import { RivalPersonality, TerrainType } from '../../engine/types';
import {
  AGENT_CODENAME_ARTICLES,
  AGENT_CODENAME_NOUNS,
  CAPITAL_PREFIXES,
  CAPITAL_SUFFIXES,
  CULTURE_FILTERS,
  DEFAULT_CULTURE_BIAS,
  DYNASTY_PREFIXES,
  DYNASTY_ROOTS,
  EPITHETS_AGGRESSIVE,
  EPITHETS_DEVOUT,
  EPITHETS_PRAGMATIC,
  FEMININE_NAMES,
  KINGDOM_NAME_PATTERNS,
  KINGDOM_NAME_PREFIXES,
  KINGDOM_NAME_ROOTS,
  MASCULINE_NAMES,
  REGION_PREFIXES_COASTAL,
  REGION_PREFIXES_FOREST,
  REGION_PREFIXES_HILLS,
  REGION_PREFIXES_MOUNTAIN,
  REGION_PREFIXES_PLAINS,
  REGION_PREFIXES_RIVER,
  REGION_SUFFIXES,
  REGNAL_NUMERALS,
  RULER_TITLES,
  type CultureBias,
} from './word-banks';

// ============================================================
// Seeded Random Number Generation
// ============================================================
// Uses cyrb128 (string → 4 32-bit ints) + sfc32 (4 ints → uniform [0,1) generator).
// Deterministic, fast, no external dependencies. NOT cryptographically secure.

function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number): () => number {
  return () => {
    a |= 0; b |= 0; c |= 0; d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Returns a deterministic [0, 1) generator seeded from a string.
 * Same seed → same generator → same sequence of values.
 */
export function seededRandom(seed: string): () => number {
  const [a, b, c, d] = cyrb128(seed);
  return sfc32(a, b, c, d);
}

// ============================================================
// Selection Helpers
// ============================================================

/**
 * Picks an item from an array using the rng. With optional bias indices,
 * boosted indices have ~3x weight compared to unboosted ones.
 */
function pickWeighted<T>(
  rng: () => number,
  items: readonly T[],
  boostedIndices: readonly number[] = [],
): T {
  if (items.length === 0) {
    throw new Error('pickWeighted: empty items array');
  }
  if (boostedIndices.length === 0) {
    return items[Math.floor(rng() * items.length)];
  }

  const boostSet = new Set(boostedIndices);
  // Weight: 3 for boosted, 1 for normal
  const totalWeight = items.length + boostSet.size * 2; // each boosted adds 2 extra weight
  let target = rng() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    const weight = boostSet.has(i) ? 3 : 1;
    target -= weight;
    if (target <= 0) return items[i];
  }
  return items[items.length - 1];
}

function getCultureBias(culture: string): CultureBias {
  return CULTURE_FILTERS[culture] ?? DEFAULT_CULTURE_BIAS;
}

// ============================================================
// Public Generators
// ============================================================

/**
 * Generates a kingdom name like "Kingdom of Velthorne" or "The Ostmark."
 * Deterministic for a given (seed, culture) pair.
 */
export function generateKingdomName(seed: string, culture: string): string {
  const rng = seededRandom(`kingdom:${seed}:${culture}`);
  const bias = getCultureBias(culture);

  const prefix = pickWeighted(rng, KINGDOM_NAME_PREFIXES, bias.kingdomPrefixBoost);
  const root = pickWeighted(rng, KINGDOM_NAME_ROOTS, bias.kingdomRootBoost);
  const baseName = `${prefix}${root}`;
  const capitalizedBase = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  const pattern = pickWeighted(rng, KINGDOM_NAME_PATTERNS);
  return pattern.replace('{0}', capitalizedBase);
}

export interface GeneratedRuler {
  firstName: string;
  title: string;
  fullName: string; // "King Hadric IV"
}

/**
 * Generates a ruler name + title. Gender randomized if not provided.
 */
export function generateRulerName(
  seed: string,
  culture: string,
  gender?: 'M' | 'F',
): GeneratedRuler {
  const rng = seededRandom(`ruler:${seed}:${culture}`);
  const bias = getCultureBias(culture);

  const finalGender: 'M' | 'F' = gender ?? (rng() < 0.5 ? 'M' : 'F');
  const namePool = finalGender === 'M' ? MASCULINE_NAMES : FEMININE_NAMES;
  const firstName = pickWeighted(rng, namePool, bias.rulerNameBoost);

  // Title selection biased by gender (basic mapping, can be refined)
  const titlePool = finalGender === 'M'
    ? RULER_TITLES.filter((t) => !['Queen', 'High Lady', 'Empress'].includes(t))
    : RULER_TITLES.filter((t) => !['King', 'High Lord', 'Emperor', 'Warlord'].includes(t));
  const title = pickWeighted(rng, titlePool);

  const numeral = pickWeighted(rng, REGNAL_NUMERALS);
  const fullName = numeral
    ? `${title} ${firstName} ${numeral}`
    : `${title} ${firstName}`;

  return { firstName, title, fullName };
}

/**
 * Generates a dynasty/house name like "House Marrowmoor" or "Clan Arnvik."
 */
export function generateDynastyName(seed: string, culture: string): string {
  const rng = seededRandom(`dynasty:${seed}:${culture}`);
  const bias = getCultureBias(culture);

  const prefix = pickWeighted(rng, DYNASTY_PREFIXES);
  const root = pickWeighted(rng, DYNASTY_ROOTS, bias.dynastyRootBoost);
  return `${prefix} ${root}`;
}

/**
 * Generates an epithet ("the Iron-Handed") biased by personality archetype.
 * Returns null roughly 40% of the time — not every ruler has earned an epithet.
 */
export function generateEpithet(seed: string, personality: RivalPersonality): string | null {
  const rng = seededRandom(`epithet:${seed}:${personality}`);
  if (rng() < 0.4) return null;

  let pool: readonly string[];
  switch (personality) {
    case RivalPersonality.AmbitiousMilitaristic:
      pool = EPITHETS_AGGRESSIVE;
      break;
    case RivalPersonality.MercantilePragmatic:
    case RivalPersonality.ExpansionistDiplomatic:
      pool = EPITHETS_PRAGMATIC;
      break;
    case RivalPersonality.DevoutInsular:
      pool = EPITHETS_DEVOUT;
      break;
    case RivalPersonality.DefensiveCautious:
      pool = EPITHETS_PRAGMATIC;
      break;
    default:
      pool = EPITHETS_PRAGMATIC;
  }
  return pickWeighted(rng, pool);
}

/**
 * Generates a region name based on terrain type. E.g. Plains → "the Cornlands."
 */
export function generateRegionName(seed: string, terrain: TerrainType): string {
  const rng = seededRandom(`region:${seed}:${terrain}`);

  let prefixPool: readonly string[];
  switch (terrain) {
    case TerrainType.Plains:    prefixPool = REGION_PREFIXES_PLAINS; break;
    case TerrainType.Hills:     prefixPool = REGION_PREFIXES_HILLS; break;
    case TerrainType.Forest:    prefixPool = REGION_PREFIXES_FOREST; break;
    case TerrainType.Coastal:   prefixPool = REGION_PREFIXES_COASTAL; break;
    case TerrainType.Mountain:  prefixPool = REGION_PREFIXES_MOUNTAIN; break;
    case TerrainType.River:     prefixPool = REGION_PREFIXES_RIVER; break;
    default:                    prefixPool = REGION_PREFIXES_PLAINS;
  }

  const suffixPool = REGION_SUFFIXES[terrain] ?? REGION_SUFFIXES.Plains;
  const prefix = pickWeighted(rng, prefixPool);
  const suffix = pickWeighted(rng, suffixPool);
  return `the ${prefix}${suffix.toLowerCase()}`;
}

/**
 * Generates an agent codename like "the Magpie" or "Black Owl."
 */
export function generateAgentCodename(seed: string): string {
  const rng = seededRandom(`agent:${seed}`);
  const article = pickWeighted(rng, AGENT_CODENAME_ARTICLES);
  const noun = pickWeighted(rng, AGENT_CODENAME_NOUNS);
  return `${article} ${noun}`;
}

/**
 * Generates a capital city name like "Velthorne" or "Aurinth."
 */
export function generateCapitalName(seed: string, culture: string): string {
  const rng = seededRandom(`capital:${seed}:${culture}`);
  const prefix = pickWeighted(rng, CAPITAL_PREFIXES);
  const suffix = pickWeighted(rng, CAPITAL_SUFFIXES);
  const name = `${prefix}${suffix}`;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ============================================================
// Convenience: Generate a complete neighbor name set
// ============================================================

export interface GeneratedNeighborNames {
  displayName: string;
  rulerName: string;
  rulerTitle: string;
  dynastyName: string;
  epithet: string | null;
  capitalName: string;
}

/**
 * Generates a complete name set for a neighbor in a single call.
 * Use this in scenario creation to populate all naming fields at once.
 */
export function generateNeighborNames(
  runSeed: string,
  neighborId: string,
  culture: string,
  personality: RivalPersonality,
): GeneratedNeighborNames {
  const seed = `${runSeed}:${neighborId}`;
  const ruler = generateRulerName(seed, culture);

  return {
    displayName: generateKingdomName(seed, culture),
    rulerName: ruler.fullName,
    rulerTitle: ruler.title,
    dynastyName: generateDynastyName(seed, culture),
    epithet: generateEpithet(seed, personality),
    capitalName: generateCapitalName(seed, culture),
  };
}

/**
 * Generates a fresh runSeed for a new game.
 * Combines current time and a random component for entropy.
 */
export function generateRunSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
