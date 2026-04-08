# Context Gating Fix Plan

## Problem Summary

Three events (`evt_equipment_failure_field`, `evt_merchant_permanent_concessions`, `evt_underground_heretical_movement`) use `triggerConditions: [{ type: 'always' }]` while living in the main `EVENT_POOL`. They were designed as follow-up consequences but fire unconditionally on turn 1 of every run because `surfaceEvents()` scans the full pool independently of the follow-up tracker.

The decree system (`decree-progression.ts`) has no world-state or turn-based prerequisites — every base-tier decree is available from turn 1 regardless of diplomatic context.

The trigger condition system in `event-engine.ts` already supports `turn_range`, `consequence_tag_present`, threshold checks, and probability gating. The architecture is sound — the problem is inconsistent use at the data layer plus a missing prerequisite layer for decrees.

---

## Phase 1: Fix broken follow-up events + establish follow-up pool separation

**Goal**: Eliminate the `always`-trigger bug class permanently by separating follow-up-only events from the main surfacing pool.

### Files to modify

**`src/data/events/index.ts`**

1. Create and export a new array `FOLLOW_UP_POOL: EventDefinition[]` alongside the existing `EVENT_POOL`.

2. Move these three events from `EVENT_POOL` into `FOLLOW_UP_POOL`:
   - `evt_equipment_failure_field` (currently line ~2147)
   - `evt_merchant_permanent_concessions` (search for the id)
   - `evt_underground_heretical_movement` (search for the id)

3. Keep their `triggerConditions: [{ type: 'always' }]` — this is fine for follow-up-only events since the follow-up tracker bypasses trigger checks. The bug was their presence in the main pool, not the trigger itself.

4. Verify each event's follow-up linkage is intact by confirming these exist in their parent events' `followUpEvents` arrays:
   - `evt_equipment_failure_field` is referenced by `evt_military_equipment_shortage_1` choice `defer_to_next_month` (line ~129)
   - For the other two, search `followUpDefinitionId: 'evt_merchant_permanent_concessions'` and `followUpDefinitionId: 'evt_underground_heretical_movement'` to confirm parent linkage. If no parent references them, they are orphaned follow-ups — add the missing `followUpEvents` entry to the appropriate parent event, or convert them to properly-gated standalone events instead of moving them.

**`src/engine/resolution/turn-resolution.ts`**

5. Import `FOLLOW_UP_POOL` alongside `EVENT_POOL`.

6. Find where `processDueFollowUps` is called (search for `processDueFollowUps`). Ensure the `eventPool` parameter passed to it includes both `EVENT_POOL` and `FOLLOW_UP_POOL` merged: `[...EVENT_POOL, ...FOLLOW_UP_POOL]`. The follow-up tracker needs to find definitions by id, so it needs access to both pools.

7. Confirm that `surfaceEvents()` continues to receive only `EVENT_POOL` (not the merged pool). This is the key separation — `surfaceEvents` never sees follow-up-only events.

**`CLAUDE.md`**

8. Add this convention rule under the appropriate section:
```
## Event Pool Rules
- Events with `triggerConditions: [{ type: 'always' }]` that are standalone (chainId: null, chainStep: null) MUST live in `FOLLOW_UP_POOL`, never `EVENT_POOL`.
- `EVENT_POOL` events must have at least one meaningful trigger condition beyond `always`.
- `FOLLOW_UP_POOL` events are only surfaced by the follow-up tracker, never by `surfaceEvents()`.
- When adding a new follow-up event, always add the corresponding `followUpEvents` entry on the parent event definition.
```

### Validation
- Search `EVENT_POOL` for any remaining `{ type: 'always' }` entries where `chainId` is `null` — there should be zero after this phase.
- All `always`-trigger events remaining in `EVENT_POOL` should have `chainStep >= 2` (these are filtered out by `surfaceEvents()` already).

---

## Phase 2: Event gating audit — add `turn_range` and phase tags

**Goal**: Ensure no event with consequence/escalation-flavored text can appear before the player has had time to create the implied conditions.

### Step 1: Add `phase` field to EventDefinition

**`src/engine/events/event-engine.ts`**

Add to the `EventDefinition` interface:
```typescript
/**
 * Narrative phase gating. Events are only eligible when the current turn
 * falls within the phase's turn range.
 * - 'opening': turns 1–3 (fresh kingdom, introductory tensions)
 * - 'developing': turns 4–8 (player choices creating consequences)
 * - 'established': turns 9+ (accumulated history, escalations)
 * - 'any': no turn restriction (default for backward compat)
 */
phase: 'opening' | 'developing' | 'established' | 'any';
```

**`src/engine/constants.ts`**

Add phase turn boundaries:
```typescript
export const PHASE_TURN_RANGES = {
  opening: { min: 1, max: 3 },
  developing: { min: 4, max: 8 },
  established: { min: 9, max: Infinity },
  any: { min: 1, max: Infinity },
} as const;
```

**`src/engine/events/event-engine.ts`**

In `surfaceEvents()`, add phase filtering to the candidates filter (after the chain/seen checks, before sorting):
```typescript
// After existing chain + seen filters, add:
&& (def.phase === 'any' || (
  turnNumber >= PHASE_TURN_RANGES[def.phase].min &&
  turnNumber <= PHASE_TURN_RANGES[def.phase].max
))
```

Import `PHASE_TURN_RANGES` from constants.

### Step 2: Tag all 98+ events with appropriate phases

**`src/data/events/index.ts`**

Add `phase` to every event definition. Classification rules:

**`phase: 'opening'`** — Events that make sense for a brand new kingdom:
- Weather/seasonal events (frost, flooding, drought, blizzard, harvest)
- Basic resource events (treasury windfall, food shortage warning)
- Simple informational events (scholarly breakthrough, trade season)
- Mild factional events with no implied prior history

**`phase: 'developing'`** — Events implying some elapsed governance:
- Events whose text references "growing", "rising", "increasing" tensions
- Inter-class rivalry events (noble-merchant rivalry, clergy-merchant dispute)
- Events with words like "discovered", "emerged", "escalated" that imply prior buildup
- Faction request petitions (already gated by satisfaction thresholds, but phase-tag as `developing` for narrative consistency)
- Regional unrest, separatist sentiment

**`phase: 'established'`** — Events implying accumulated history:
- Events whose text says "emboldened by earlier", "neglected", "deteriorating", "further concessions"
- All escalation events (`evt_escalation_*`)
- Conspiracy events, coup threats, mass exodus
- Events that are consequences in follow-up chains (these should mostly be in `FOLLOW_UP_POOL` already, but any remaining in `EVENT_POOL` with consequence flavor get this tag)

**`phase: 'any'`** — Events gated by other conditions that make them self-timing:
- Events already gated by `consequence_tag_present` (the tag itself ensures proper sequencing)
- Events with `turn_range` conditions already set
- Chain step 1 events with strong threshold conditions (e.g., `stability_below: 30` won't trigger at starting value 55)
- Events with multiple strict threshold conditions that effectively self-gate

**`src/data/events/faction-requests.ts`**

Add `phase: 'any'` to all 15 faction requests — they're already gated by satisfaction thresholds.

### Step 3: Remove now-redundant `turn_range` conditions

After adding phase tags, any event that previously used `turn_range` purely for phase gating (e.g., `evt_golden_age_opportunity` has `minTurn: 8`) can keep its `turn_range` for precision but should also get the matching `phase` tag for consistency. Don't remove working `turn_range` conditions — they're more precise than phases and the two work together.

### Validation
- Build the project (`npm run build` or `npx tsc --noEmit`) to confirm no type errors from the new required field.
- Grep `EVENT_POOL` for any event missing the `phase` field — TypeScript will catch this if the field is required.
- Manually review: search event text in `src/data/text/events.ts` for "neglect", "escalat", "emboldened", "earlier", "growing", "deteriorat" — cross-reference that the corresponding event definition has phase `developing` or `established`.

---

## Phase 3: Decree state prerequisites

**Goal**: Prevent decrees from appearing when the world state doesn't support them narratively.

### Step 1: Add prerequisite fields to DecreeDefinition

**`src/data/decrees/index.ts`**

Extend the `DecreeDefinition` interface:
```typescript
/** Minimum turn number before this decree becomes available. Null = no restriction. */
turnMinimum: number | null;

/**
 * Optional world-state conditions that must ALL pass for this decree to be available.
 * Uses the same condition shape as event triggers for consistency.
 * Null = no state requirements.
 */
statePrerequisites: DecreeStateCondition[] | null;
```

Define `DecreeStateCondition` (in the same file or in `engine/types.ts`):
```typescript
export interface DecreeStateCondition {
  type:
    | 'stability_above'
    | 'treasury_above'
    | 'faith_above'
    | 'military_readiness_above'
    | 'neighbor_disposition_above'
    | 'turn_range'
    | 'consequence_tag_present';
  threshold?: number;
  /** For neighbor_disposition_above: minimum disposition level required. */
  dispositionMinimum?: string; // maps to NeighborDisposition enum values
  consequenceTag?: string;
  minTurn?: number;
}
```

### Step 2: Update decree availability logic

**`src/engine/systems/decree-progression.ts`**

Add a new parameter to `getDecreeAvailability`:
```typescript
export function getDecreeAvailability(
  decree: DecreeDefinition,
  issuedDecrees: ReadonlyArray<IssuedDecree>,
  currentTurn: number,
  state?: GameState,  // NEW — optional for backward compat during migration
): DecreeAvailability {
```

Add these checks BEFORE the "Available" return at the end of the function:

```typescript
// --- Turn minimum not met ---
if (decree.turnMinimum !== null && currentTurn < decree.turnMinimum) {
  return {
    status: 'locked',
    available: false,
    reason: `Available from turn ${decree.turnMinimum}`,
    cooldownTurnsRemaining: 0,
    chainProgress,
  };
}

// --- State prerequisites not met ---
if (decree.statePrerequisites !== null && state) {
  for (const condition of decree.statePrerequisites) {
    if (!evaluateDecreeCondition(condition, state)) {
      return {
        status: 'locked',
        available: false,
        reason: getDecreeConditionFailureReason(condition),
        cooldownTurnsRemaining: 0,
        chainProgress,
      };
    }
  }
}
```

Implement `evaluateDecreeCondition` as a local helper mirroring the event engine's `evaluateCondition` pattern but scoped to the decree-relevant subset. For `neighbor_disposition_above`, check if ANY neighbor in `state.diplomacy.neighbors` meets the disposition minimum.

Implement `getDecreeConditionFailureReason` to return human-readable lock reasons (e.g., "Requires diplomatic contact with a neighbor").

### Step 3: Tag decrees with appropriate prerequisites

**`src/data/decrees/index.ts`**

Add `turnMinimum` and `statePrerequisites` to every decree. Guidelines:

**Diplomatic decrees** (royal marriage, dynasty alliance, confederation, envoy, trade agreement, non-aggression pact):
- `turnMinimum: 4` minimum (player needs time to establish the kingdom)
- Royal marriage specifically: `statePrerequisites: [{ type: 'neighbor_disposition_above', dispositionMinimum: 'neutral' }]`
- Dynasty alliance: `turnMinimum: 8` + requires royal marriage enacted (already handled by `previousTierDecreeId`)

**Military decrees** (conscription, fortification, campaign):
- Base tier: `turnMinimum: null` (reasonable from turn 1)
- Higher tiers: `turnMinimum: 6`+

**Economic decrees** (market charter, trade routes, guild regulation):
- Base tier: `turnMinimum: null`
- Higher tiers: `turnMinimum: 4`

**Religious/cultural decrees**:
- Base tier: `turnMinimum: null`
- Inquisition/reformation type: `turnMinimum: 6`, `statePrerequisites: [{ type: 'faith_above', threshold: 40 }]` or similar

**Infrastructure/construction decrees**:
- Most: `turnMinimum: null` (building is always reasonable)

For any decree where `turnMinimum` is null and `statePrerequisites` is null, those values confirm "available from turn 1 with no conditions" — which is the correct default for basic governance actions.

### Step 4: Update all callers

Search for all calls to `getDecreeAvailability` and pass the `GameState` parameter. Key locations:
- UI components that render the decree list
- `turn-resolution.ts` if it validates decree actions

### Validation
- Build the project to confirm no type errors.
- Check that `decree_royal_marriage` shows as locked on turn 1 with a meaningful reason string.
- Verify base-tier economic/military decrees remain available on turn 1.

---

## Phase 4: Anti-repetition variety scoring

**Goal**: Prevent identical event selection patterns across runs and within runs when multiple events have equal weight.

### Implementation

**`src/engine/events/event-engine.ts`**

In `surfaceEvents()`, modify the sort to add jitter. Replace the current sort:

```typescript
candidates.sort((a, b) => {
  const severityDiff = SEVERITY_SCORE[b.severity] - SEVERITY_SCORE[a.severity];
  if (severityDiff !== 0) return severityDiff;
  const wa = a.weight * (categoryWeights?.[a.category] ?? 1.0);
  const wb = b.weight * (categoryWeights?.[b.category] ?? 1.0);
  return wb - wa;
});
```

With:

```typescript
// Add variety jitter so equal-weight events don't always sort identically.
// Jitter range ±20% preserves intentional weight differences while
// randomizing ties.
const jitterMap = new Map<string, number>();
for (const c of candidates) {
  jitterMap.set(c.id, 0.8 + Math.random() * 0.4); // 0.8–1.2
}

candidates.sort((a, b) => {
  const severityDiff = SEVERITY_SCORE[b.severity] - SEVERITY_SCORE[a.severity];
  if (severityDiff !== 0) return severityDiff;
  const wa = a.weight * (categoryWeights?.[a.category] ?? 1.0) * (jitterMap.get(a.id) ?? 1.0);
  const wb = b.weight * (categoryWeights?.[b.category] ?? 1.0) * (jitterMap.get(b.id) ?? 1.0);
  return wb - wa;
});
```

This is a small change with no structural risk. It ensures that when 5 Notable events all have weight 1.0, the player sees variety across turns and runs.

### Validation
- No type changes needed.
- Behavioral: events at the same severity/weight tier should now appear in varying order across resets. The highest-severity event still dominates (severity sort is unaffected), but within a tier, selection rotates.

---

## Execution Order

Phase 1 → Phase 2 → Phase 3 → Phase 4

Each phase is independently shippable. Phase 1 is the critical bug fix. Phase 2 is the highest-value systemic improvement. Phase 3 adds decree depth. Phase 4 is polish.
