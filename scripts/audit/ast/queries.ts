// tsquery selectors for the writer/reader index.
//
// We keep the selector strings here (not inline in the index builder) so the
// hand-card analyzer (M3.2) and future structural scans can reuse the same
// patterns and evolve them in one place. Every selector matches CallExpression
// / PropertyAccessExpression nodes — tsquery uses AST node names from the
// TypeScript compiler, not source text.

/**
 * `applyPressure(state, sourceType, sourceId, choiceId)` — the engine's
 * narrative-pressure writer. Matches the outer CallExpression so consumers
 * can pull the source-type literal from the second argument.
 */
export const APPLY_PRESSURE = 'CallExpression:has(Identifier[name="applyPressure"])';

/**
 * `persistentConsequences: [...state.persistentConsequences, consequence]`.
 * The engine uses immutable spread-append rather than `.push()`, so we match
 * the PropertyAssignment shape. This catches all three write sites in
 * apply-action-effects.ts plus any future decree/event/storyline handlers
 * that follow the same pattern.
 */
export const PERSISTENT_CONSEQUENCES_ASSIGN =
  'PropertyAssignment:has(Identifier[name="persistentConsequences"])';

/**
 * `.filter(...)` calls on a persistentConsequences reference — used to remove
 * tags (e.g. hand_royal_pardon). We capture these so hand-card analysis can
 * mark the card as touching persistentConsequences even without a push.
 */
export const PERSISTENT_CONSEQUENCES_FILTER =
  'CallExpression:has(PropertyAccessExpression:has(Identifier[name="persistentConsequences"]):has(Identifier[name="filter"]))';

/**
 * Temporary-modifier enqueues — `activeTemporaryModifiers: [...state.activeTemporaryModifiers, mod]`
 * is hard to pattern-match reliably as a single query; callers should look for
 * Identifier references to `activeTemporaryModifiers` and filter by context.
 */
export const TEMP_MODIFIER_REF = 'Identifier[name="activeTemporaryModifiers"]';

/**
 * `applyMechanicalEffectDelta(...)` — the primary delta applier the bridge
 * layer and hand-card analyzer both look for.
 */
export const APPLY_MECHANICAL_DELTA = 'CallExpression:has(Identifier[name="applyMechanicalEffectDelta"])';

/**
 * Bond mutation — any reference to `diplomaticBonds` or a direct call to
 * the bond-creation helper.
 */
export const BOND_REF = 'Identifier[name="diplomaticBonds"]';
export const CREATE_BOND = 'CallExpression:has(Identifier[name="createBond"])';

/**
 * `EVENT_CHOICE_TEMPORARY_MODIFIERS[...]` — property-access writes.
 * Useful for cross-checking the temp-modifier registry against runtime
 * enqueue sites.
 */
export const TEMP_MODIFIER_REGISTRY_REF =
  'Identifier[name="EVENT_CHOICE_TEMPORARY_MODIFIERS"]';
