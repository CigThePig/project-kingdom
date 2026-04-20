// Card Audit — category → effect-field touch map
// See docs/CARD_AUDIT_RULES.md §4.2: a card whose category is X but whose
// effects never touch any of X's fields is suspect (substance/category-without-touch).
//
// IMPORTANT: every key is an EventCategory string value. Every value is a list
// of MechanicalEffectDelta field names. When MechanicalEffectDelta gains a new
// field, mirror the addition here for the categories it should belong to.

import type { MechanicalEffectDelta } from '../../src/engine/types';
import { EventCategory } from '../../src/engine/types';

/** A field name on MechanicalEffectDelta. */
export type EffectField = keyof MechanicalEffectDelta;

/**
 * Per-category set of MechanicalEffectDelta fields considered "the substance"
 * of that category. A choice in a card of category X is expected to mention at
 * least one of X's fields with a nonzero value (or to carry a temporary
 * modifier whose effectPerTurn touches one of X's fields).
 *
 * regionConditionDelta only counts as a substantive touch for Region/
 * Environment cards when affectsRegion === true; the surface-only scan handles
 * that gotcha specifically and does not rely on this map.
 */
export const CATEGORY_TOUCH_FIELDS: Record<EventCategory, ReadonlySet<EffectField>> = {
  [EventCategory.Economy]: new Set<EffectField>([
    'treasuryDelta',
    'merchantSatDelta',
  ]),
  [EventCategory.Food]: new Set<EffectField>([
    'foodDelta',
    'commonerSatDelta',
  ]),
  [EventCategory.Military]: new Set<EffectField>([
    'militaryReadinessDelta',
    'militaryMoraleDelta',
    'militaryEquipmentDelta',
    'militaryForceSizeDelta',
    'militaryCasteSatDelta',
  ]),
  [EventCategory.Diplomacy]: new Set<EffectField>([
    'diplomacyDeltas',
  ]),
  [EventCategory.Environment]: new Set<EffectField>([
    'foodDelta',
    'regionConditionDelta',
    'regionDevelopmentDelta',
  ]),
  [EventCategory.PublicOrder]: new Set<EffectField>([
    'stabilityDelta',
    'commonerSatDelta',
    'nobilitySatDelta',
  ]),
  [EventCategory.Religion]: new Set<EffectField>([
    'faithDelta',
    'heterodoxyDelta',
    'clergySatDelta',
  ]),
  [EventCategory.Culture]: new Set<EffectField>([
    'culturalCohesionDelta',
    'commonerSatDelta',
    'clergySatDelta',
  ]),
  [EventCategory.Espionage]: new Set<EffectField>([
    'espionageNetworkDelta',
  ]),
  [EventCategory.Knowledge]: new Set<EffectField>([
    // Knowledge advancement currently flows through dedicated state, not
    // MechanicalEffectDelta — fall back to broad civic levers as proxies.
    'culturalCohesionDelta',
    'treasuryDelta',
    'stabilityDelta',
  ]),
  [EventCategory.ClassConflict]: new Set<EffectField>([
    'nobilitySatDelta',
    'clergySatDelta',
    'merchantSatDelta',
    'commonerSatDelta',
    'militaryCasteSatDelta',
    'stabilityDelta',
  ]),
  [EventCategory.Region]: new Set<EffectField>([
    'regionDevelopmentDelta',
    'regionConditionDelta',
    'stabilityDelta',
  ]),
  [EventCategory.Kingdom]: new Set<EffectField>([
    // Kingdom-wide events touch broad levers; we accept any major resource or
    // satisfaction shift as substantive.
    'stabilityDelta',
    'treasuryDelta',
    'foodDelta',
    'faithDelta',
    'nobilitySatDelta',
    'clergySatDelta',
    'merchantSatDelta',
    'commonerSatDelta',
    'militaryCasteSatDelta',
    'culturalCohesionDelta',
  ]),
};

/**
 * All MechanicalEffectDelta field names. Used by the surface-only scan and the
 * empty-effects scan to detect "no nonzero deltas anywhere" outcomes.
 *
 * TODO: keep this list in lockstep with MechanicalEffectDelta in
 * src/engine/types.ts. Adding a field there without adding it here means the
 * field is invisible to the audit and choices touching only that field will be
 * mis-classified as empty.
 */
export const ALL_EFFECT_FIELDS: ReadonlyArray<EffectField> = [
  'treasuryDelta',
  'foodDelta',
  'stabilityDelta',
  'faithDelta',
  'heterodoxyDelta',
  'culturalCohesionDelta',
  'militaryReadinessDelta',
  'militaryMoraleDelta',
  'militaryEquipmentDelta',
  'militaryForceSizeDelta',
  'espionageNetworkDelta',
  'nobilitySatDelta',
  'clergySatDelta',
  'merchantSatDelta',
  'commonerSatDelta',
  'militaryCasteSatDelta',
  'diplomacyDeltas',
  'regionDevelopmentDelta',
  'regionConditionDelta',
];

/**
 * Returns true when the delta has at least one nonzero numeric field or a
 * non-empty diplomacy map. Used by every wiring/substance scan that needs to
 * know "is this an empty outcome?".
 */
export function isEffectDeltaNonEmpty(delta: MechanicalEffectDelta | undefined): boolean {
  if (!delta) return false;
  for (const field of ALL_EFFECT_FIELDS) {
    if (field === 'diplomacyDeltas') {
      const dd = delta.diplomacyDeltas;
      if (dd && Object.values(dd).some((v) => v !== 0)) return true;
      continue;
    }
    const v = (delta as Record<string, unknown>)[field];
    if (typeof v === 'number' && v !== 0) return true;
  }
  return false;
}

/**
 * Returns the subset of fields in the delta that are nonzero. Useful for
 * choice-clones signature building.
 */
export function nonzeroFieldsOf(delta: MechanicalEffectDelta | undefined): EffectField[] {
  if (!delta) return [];
  const out: EffectField[] = [];
  for (const field of ALL_EFFECT_FIELDS) {
    if (field === 'diplomacyDeltas') {
      const dd = delta.diplomacyDeltas;
      if (dd && Object.keys(dd).length > 0 && Object.values(dd).some((v) => v !== 0)) {
        out.push(field);
      }
      continue;
    }
    const v = (delta as Record<string, unknown>)[field];
    if (typeof v === 'number' && v !== 0) out.push(field);
  }
  return out;
}

/**
 * Returns true when the delta touches at least one of the category's
 * substantive fields.
 */
export function deltaTouchesCategory(
  delta: MechanicalEffectDelta | undefined,
  category: EventCategory,
): boolean {
  if (!delta) return false;
  const fields = CATEGORY_TOUCH_FIELDS[category];
  for (const f of fields) {
    if (f === 'diplomacyDeltas') {
      const dd = delta.diplomacyDeltas;
      if (dd && Object.values(dd).some((v) => v !== 0)) return true;
      continue;
    }
    const v = (delta as Record<string, unknown>)[f];
    if (typeof v === 'number' && v !== 0) return true;
  }
  return false;
}

/**
 * Per MechanicalEffectDelta field → set of GameState top-level path prefixes
 * a runtime diff's `touches[]` entry can start with when the same kind of
 * change happens at runtime. Used by substance scans that want to count a
 * runtime-observed `treasury.balance` touch as fulfilment of an expected
 * `treasuryDelta` field.
 *
 * Intentionally conservative: each field maps to one or more concrete
 * top-level GameState path segments the diff walker produces (see
 * runtime/classifier.ts). Keep in lockstep with that classifier's PREFIX
 * map — new structural domains added there should appear here when a
 * category depends on them.
 */
export const EFFECT_FIELD_RUNTIME_PREFIXES: Record<EffectField, readonly string[]> = {
  treasuryDelta: ['treasury'],
  foodDelta: ['food'],
  stabilityDelta: ['stability'],
  faithDelta: ['faithCulture'],
  heterodoxyDelta: ['faithCulture'],
  culturalCohesionDelta: ['faithCulture'],
  militaryReadinessDelta: ['military'],
  militaryMoraleDelta: ['military'],
  militaryEquipmentDelta: ['military'],
  militaryForceSizeDelta: ['military'],
  espionageNetworkDelta: ['espionage'],
  nobilitySatDelta: ['population'],
  clergySatDelta: ['population'],
  merchantSatDelta: ['population'],
  commonerSatDelta: ['population'],
  militaryCasteSatDelta: ['population'],
  diplomacyDeltas: ['diplomacy'],
  regionDevelopmentDelta: ['regions'],
  regionConditionDelta: ['regions'],
};

/**
 * Returns true when the runtime fingerprint's `touches[]` starts with any
 * path prefix associated with any of the category's substantive fields.
 * Used by substance/category-without-touch to corroborate declared-effect
 * claims against the real runtime diff for harness-supported families.
 */
export function runtimeTouchesCategory(
  touches: readonly string[],
  category: EventCategory,
): boolean {
  if (touches.length === 0) return false;
  const fields = CATEGORY_TOUCH_FIELDS[category];
  const prefixes = new Set<string>();
  for (const f of fields) {
    for (const p of EFFECT_FIELD_RUNTIME_PREFIXES[f] ?? []) prefixes.add(p);
  }
  if (prefixes.size === 0) return false;
  for (const touch of touches) {
    const segment = touch.split(/[.\[]/)[0];
    if (prefixes.has(segment)) return true;
  }
  return false;
}
