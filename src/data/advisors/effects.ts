// Phase 8 — Advisor modifier evaluation helpers.
//
// Used by:
//  - `src/engine/events/apply-event-effects.ts` — merge delta bonuses into
//    each choice's `MechanicalEffectDelta`.
//  - `src/engine/resolution/action-budget.ts` — apply `slot_cost_discount`
//    when costing a queued action whose tags match an advisor's scope.
//  - Bridge-layer quality previews.
//
// Pure and side-effect free. The caller passes the modifier and context; we
// return whether it matches and what numeric adjustment applies.

import type {
  AdvisorModifier,
  EventCategory,
  MechanicalEffectDelta,
} from '../../engine/types';
import type { CardTag } from '../../engine/cards/types';

export interface ModifierMatchContext {
  target: AdvisorModifier['target'];
  tags?: CardTag[];
  category?: EventCategory;
}

export function advisorModifierMatches(mod: AdvisorModifier, ctx: ModifierMatchContext): boolean {
  if (mod.target !== ctx.target) return false;
  if (mod.scope.categories && mod.scope.categories.length > 0) {
    if (!ctx.category) return false;
    if (!mod.scope.categories.includes(ctx.category)) return false;
  }
  if (mod.scope.tags && mod.scope.tags.length > 0) {
    if (!ctx.tags || ctx.tags.length === 0) return false;
    const anyMatch = mod.scope.tags.some((t) => ctx.tags!.includes(t));
    if (!anyMatch) return false;
  }
  return true;
}

/** Applies a single `delta_bonus` modifier on top of a delta, mutating a
 *  fresh copy. Never mutates the input. */
export function applyDeltaBonus(
  delta: MechanicalEffectDelta,
  mod: AdvisorModifier,
): MechanicalEffectDelta {
  if (mod.effect.kind !== 'delta_bonus') return delta;
  if (!mod.effect.deltaField) return delta;
  const field = mod.effect.deltaField as keyof MechanicalEffectDelta;
  const next: MechanicalEffectDelta = { ...delta };
  const current = (next as unknown as Record<string, number | undefined>)[field] ?? 0;
  (next as unknown as Record<string, number>)[field] = current + mod.effect.value;
  return next;
}
