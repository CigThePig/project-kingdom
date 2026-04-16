// Bridge Layer — Modifier Tag Extractor
// For each effect delta field, determines which active modifiers will
// influence the actual resolved value. Returns short tag strings
// (e.g. "drought", "recession", "winter") so the EffectStrip can
// display them alongside the base number, making the card honest
// about what forces will shape the outcome.

import type { GameState, MechanicalEffectDelta } from '../engine/types';
import {
  Season,
  ConditionType,
  EconomicPhase,
} from '../engine/types';

// ============================================================
// Which delta fields are affected by which modifier categories
// ============================================================

type DeltaField = keyof MechanicalEffectDelta;

const FOOD_FIELDS: DeltaField[] = ['foodDelta'];
const TREASURY_FIELDS: DeltaField[] = ['treasuryDelta'];
const SATISFACTION_FIELDS: DeltaField[] = [
  'nobilitySatDelta', 'clergySatDelta', 'merchantSatDelta',
  'commonerSatDelta', 'militaryCasteSatDelta',
];
const MILITARY_FIELDS: DeltaField[] = [
  'militaryReadinessDelta', 'militaryMoraleDelta',
  'militaryEquipmentDelta', 'militaryForceSizeDelta',
];

// Conditions that amplify food-related pain
const FOOD_NEGATIVE_CONDITIONS = new Set<ConditionType>([
  ConditionType.Drought, ConditionType.Blight, ConditionType.Famine,
  ConditionType.HarshWinter, ConditionType.Flood, ConditionType.Pestilence,
]);

// Conditions that amplify treasury/trade pain
const TREASURY_NEGATIVE_CONDITIONS = new Set<ConditionType>([
  ConditionType.TradeDisruption, ConditionType.MarketPanic,
  ConditionType.Corruption, ConditionType.Banditry,
]);

// Conditions that amplify satisfaction pain
const SATISFACTION_CONDITIONS = new Set<ConditionType>([
  ConditionType.Plague, ConditionType.Pox, ConditionType.Famine,
  ConditionType.Unrest, ConditionType.CriminalUnderworld,
]);

// Short human-readable labels for conditions
const CONDITION_SHORT_LABELS: Partial<Record<ConditionType, string>> = {
  [ConditionType.Drought]: 'drought',
  [ConditionType.Flood]: 'flood',
  [ConditionType.HarshWinter]: 'winter',
  [ConditionType.Blight]: 'blight',
  [ConditionType.Famine]: 'famine',
  [ConditionType.Plague]: 'plague',
  [ConditionType.Pox]: 'pox',
  [ConditionType.Pestilence]: 'pestilence',
  [ConditionType.Banditry]: 'banditry',
  [ConditionType.Corruption]: 'corruption',
  [ConditionType.Unrest]: 'unrest',
  [ConditionType.CriminalUnderworld]: 'crime',
  [ConditionType.TradeDisruption]: 'trade disruption',
  [ConditionType.MarketPanic]: 'market panic',
};

// ============================================================
// Extractor
// ============================================================

/**
 * For a given MechanicalEffectDelta, returns modifier tags per delta field.
 * Keys are the delta field names (e.g. 'treasuryDelta'), values are arrays
 * of short tags (e.g. ['drought', 'recession']).
 *
 * Only returns tags for fields that are present and non-zero in the delta,
 * AND where the game state has an active modifier that would influence that field.
 */
export function extractModifierTags(
  state: GameState,
  delta: MechanicalEffectDelta,
): Record<string, string[]> {
  const tags: Record<string, string[]> = {};

  function addTag(field: string, tag: string) {
    if (!tags[field]) tags[field] = [];
    if (!tags[field].includes(tag)) tags[field].push(tag);
  }

  const activeConditionTypes = new Set<ConditionType>(
    state.environment?.activeConditions?.map((c) => c.type) ?? [],
  );

  // Season tag for food/treasury in harsh seasons
  const season = state.turn.season;

  // Food fields: conditions + winter
  for (const field of FOOD_FIELDS) {
    if (delta[field] === undefined || delta[field] === 0) continue;
    for (const condType of activeConditionTypes) {
      if (FOOD_NEGATIVE_CONDITIONS.has(condType)) {
        const label = CONDITION_SHORT_LABELS[condType];
        if (label) addTag(field, label);
      }
    }
    if (season === Season.Winter) addTag(field, 'winter');
  }

  // Treasury fields: conditions + economic phase
  for (const field of TREASURY_FIELDS) {
    if (delta[field] === undefined || delta[field] === 0) continue;
    for (const condType of activeConditionTypes) {
      if (TREASURY_NEGATIVE_CONDITIONS.has(condType)) {
        const label = CONDITION_SHORT_LABELS[condType];
        if (label) addTag(field, label);
      }
    }
    if (state.economy) {
      const phase = state.economy.cyclePhase;
      if (phase === EconomicPhase.Recession) addTag(field, 'recession');
      if (phase === EconomicPhase.Depression) addTag(field, 'depression');
      if (phase === EconomicPhase.Boom) addTag(field, 'boom');
    }
  }

  // Satisfaction fields: conditions + ruling style
  for (const field of SATISFACTION_FIELDS) {
    if (delta[field] === undefined || delta[field] === 0) continue;
    for (const condType of activeConditionTypes) {
      if (SATISFACTION_CONDITIONS.has(condType)) {
        const label = CONDITION_SHORT_LABELS[condType];
        if (label) addTag(field, label);
      }
    }
    // Ruling style affects satisfaction independently — tag the dominant style
    if (state.rulingStyle) {
      const axes = state.rulingStyle.axes;
      for (const [, value] of Object.entries(axes)) {
        if (Math.abs(value) >= 20) {
          // Only tag if style is strong enough to matter
          if (value >= 20) {
            if (field === 'commonerSatDelta') addTag(field, 'style');
            if (field === 'nobilitySatDelta') addTag(field, 'style');
          } else if (value <= -20) {
            if (field === 'merchantSatDelta') addTag(field, 'style');
            if (field === 'militaryCasteSatDelta') addTag(field, 'style');
          }
          break; // one 'style' tag is enough
        }
      }
    }
  }

  // Military fields: conditions
  for (const field of MILITARY_FIELDS) {
    if (delta[field] === undefined || delta[field] === 0) continue;
    if (activeConditionTypes.has(ConditionType.HarshWinter)) addTag(field, 'winter');
    if (activeConditionTypes.has(ConditionType.Plague)) addTag(field, 'plague');
  }

  return tags;
}
