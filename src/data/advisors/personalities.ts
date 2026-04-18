// Phase 8 — Advisor Personality Modifier Templates.
//
// Each `AdvisorPersonality` maps to a bundle of 2–3 `AdvisorModifier`s. When a
// candidate is instantiated (via `instantiateCandidate` in
// `src/engine/systems/advisors.ts`) the chosen personality's templates are
// copied into the advisor's `modifiers` array. The `evaluateAdvisorModifier`
// helper in `src/data/advisors/effects.ts` aggregates them at card-resolution
// time.

import {
  AdvisorPersonality,
  CouncilSeat,
  EventCategory,
  type AdvisorModifier,
} from '../../engine/types';

export const PERSONALITY_MODIFIER_TEMPLATES: Record<AdvisorPersonality, AdvisorModifier[]> = {
  [AdvisorPersonality.Prudent]: [
    {
      target: 'system',
      scope: { seats: [CouncilSeat.Chancellor] },
      effect: { kind: 'income_multiplier', value: 5 },
    },
    {
      target: 'petition',
      scope: { categories: [EventCategory.Economy] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'treasuryDelta' },
    },
  ],
  [AdvisorPersonality.Zealous]: [
    {
      target: 'crisis',
      scope: { categories: [EventCategory.Religion] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'faithDelta' },
    },
    {
      target: 'crisis',
      scope: { categories: [EventCategory.Religion] },
      effect: { kind: 'delta_bonus', value: -1, deltaField: 'heterodoxyDelta' },
    },
    {
      target: 'petition',
      scope: { categories: [EventCategory.Religion] },
      effect: { kind: 'delta_bonus', value: 1, deltaField: 'clergySatDelta' },
    },
  ],
  [AdvisorPersonality.Cunning]: [
    {
      target: 'crisis',
      scope: { categories: [EventCategory.Espionage, EventCategory.Diplomacy] },
      effect: { kind: 'delta_bonus', value: 1, deltaField: 'espionageNetworkDelta' },
    },
    {
      target: 'system',
      scope: { seats: [CouncilSeat.Spymaster] },
      effect: { kind: 'finding_confidence_boost', value: 10 },
    },
  ],
  [AdvisorPersonality.BattleHardened]: [
    {
      target: 'crisis',
      scope: { categories: [EventCategory.Military] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'militaryReadinessDelta' },
    },
    {
      target: 'decree',
      scope: { tags: ['military'] },
      effect: { kind: 'slot_cost_discount', value: 1 },
    },
  ],
  [AdvisorPersonality.SilverTongue]: [
    {
      target: 'negotiation',
      scope: {},
      effect: { kind: 'outcome_quality_boost', value: 1 },
    },
    {
      target: 'overture',
      scope: {},
      effect: { kind: 'outcome_quality_boost', value: 1 },
    },
    {
      target: 'petition',
      scope: { categories: [EventCategory.Diplomacy] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'nobilitySatDelta' },
    },
  ],
  [AdvisorPersonality.Scholar]: [
    {
      target: 'crisis',
      scope: { categories: [EventCategory.Knowledge] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'culturalCohesionDelta' },
    },
    {
      target: 'decree',
      scope: { tags: ['knowledge', 'civic'] },
      effect: { kind: 'slot_cost_discount', value: 1 },
    },
  ],
  [AdvisorPersonality.Ironfist]: [
    {
      target: 'crisis',
      scope: { categories: [EventCategory.PublicOrder, EventCategory.ClassConflict] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'stabilityDelta' },
    },
    {
      target: 'crisis',
      scope: { categories: [EventCategory.PublicOrder] },
      effect: { kind: 'delta_bonus', value: -1, deltaField: 'commonerSatDelta' },
    },
  ],
  [AdvisorPersonality.Reformist]: [
    {
      target: 'decree',
      scope: { tags: ['civic', 'social'] },
      effect: { kind: 'slot_cost_discount', value: 1 },
    },
    {
      target: 'petition',
      scope: { categories: [EventCategory.ClassConflict] },
      effect: { kind: 'delta_bonus', value: 2, deltaField: 'commonerSatDelta' },
    },
  ],
};
