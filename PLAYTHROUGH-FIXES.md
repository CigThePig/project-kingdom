# PLAYTHROUGH-FIXES.md — Claude Code Implementation Plan

This file contains phased instructions for fixing the world-state continuity problems identified in the April 2026 playthrough audit. Each phase is self-contained and produces a testable result. Complete phases in order. Run `npx tsc --noEmit` and `npm run lint` after each phase.

---

## Phase 1 — Decrees create persistent consequences

**Problem:** Crisis responses create `PersistentConsequence` entries. Decrees don't. This means the game has no memory of what the player enacted as policy.

**Files to modify:**

### `src/engine/resolution/apply-action-effects.ts`

Find the `applyDecreeEffect()` function. At the end of the function, before the `return`, add persistent consequence creation matching the pattern used in `applyCrisisResponseEffect()` (lines 651–662 of the same file).

The consequence should be:
```typescript
const consequence: PersistentConsequence = {
  sourceId: action.actionDefinitionId,
  sourceType: 'event', // reuse 'event' sourceType — decrees use the same tag system
  choiceMade: action.actionDefinitionId,
  turnApplied: state.turn.turnNumber,
  tag: `decree:${action.actionDefinitionId}`,
};
```

Append it to `state.persistentConsequences`. Make sure the import for `PersistentConsequence` is present (it's already imported in this file).

**Do not** modify any other function in this file. Do not change `applyCrisisResponseEffect`.

### Verification

- `npx tsc --noEmit` passes
- `npm run lint` passes
- Write a test in `src/__tests__/` that calls `applyActionEffects()` with a decree action and asserts the returned state has a new entry in `persistentConsequences` with `tag` starting with `decree:`.

---

## Phase 2 — Season flavor in the month header

**Problem:** SeasonDawn shows "January, Year 1" but should show "January — Deep Winter, Year 1".

**Files to modify:**

### `src/data/text/month-openings.ts`

Add a new export after `MONTH_NAMES`:

```typescript
export const MONTH_SEASON_LABELS: Record<number, string> = {
  1: 'Deep Winter',
  2: 'Late Winter',
  3: 'Early Spring',
  4: 'Mid Spring',
  5: 'Late Spring',
  6: 'Early Summer',
  7: 'Midsummer',
  8: 'Late Summer',
  9: 'Early Autumn',
  10: 'Mid Autumn',
  11: 'Late Autumn',
  12: 'Early Winter',
};
```

### `src/ui/phases/SeasonDawn.tsx`

1. Add `MONTH_SEASON_LABELS` to the import from `month-openings`.
2. Change the `<CardTitle>` on line 30 from:
   ```
   {MONTH_NAMES[month]}, Year {year}
   ```
   to:
   ```
   {MONTH_NAMES[month]} — {MONTH_SEASON_LABELS[month]}, Year {year}
   ```

**Do not** modify anything else in SeasonDawn.

### Verification

- `npx tsc --noEmit` passes
- Visual check: the header should read like "January — Deep Winter, Year 1"

---

## Phase 3 — Neighbor attribution on events

**Problem:** Diplomatic and military events say "a neighboring kingdom" instead of naming the actual kingdom involved. The engine has no `affectedNeighborId` on events.

**Files to modify (in this order):**

### 3a. `src/engine/events/event-engine.ts`

Add to `EventDefinition`:
```typescript
/** When non-null, the engine assigns this neighbor as the affectedNeighborId. 
 *  Value can be a literal neighbor ID or '__HOSTILE__' / '__FRIENDLY__' / '__ANY__'
 *  for dynamic resolution at surfacing time. */
affectsNeighbor?: string | null;
```

Add to the `buildActiveEvent()` function: resolve `affectsNeighbor` to a concrete neighbor ID using game state. Logic:
- If `affectsNeighbor` is a literal ID (starts with `neighbor_`): use it directly.
- If `'__HOSTILE__'`: pick the neighbor with the lowest relationship score.
- If `'__FRIENDLY__'`: pick the neighbor with the highest relationship score.
- If `'__ANY__'`: pick a random neighbor.
- If `null` or `undefined`: leave as null.

### 3b. `src/engine/types.ts`

Add `affectedNeighborId: string | null;` to the `ActiveEvent` interface, after `affectedClassId`. Set default to `null` in `buildActiveEvent()`.

### 3c. `src/bridge/crisisCardGenerator.ts`

Find where the card body text is assembled from `EVENT_TEXT[definitionId].body`. After retrieving the body string, add template substitution:
```typescript
let body = textEntry.body;
if (event.affectedNeighborId) {
  const neighborName = NEIGHBOR_LABELS[event.affectedNeighborId] ?? event.affectedNeighborId;
  body = body.replace(/\{neighbor\}/g, neighborName);
}
```

Import `NEIGHBOR_LABELS` from `../../data/text/labels`.

### 3d. `src/bridge/petitionCardGenerator.ts`

Apply the same `{neighbor}` substitution pattern as 3c.

### 3e. Update event definitions and text

For this phase, pick **5 representative diplomatic/military events** from `src/data/events/index.ts` and `src/data/events/expansion/diplomacy-events.ts` and `src/data/events/expansion/military-events.ts`:
- Add `affectsNeighbor: '__HOSTILE__'` (or `'__FRIENDLY__'` for positive events) to their definitions.
- In their text entries in `src/data/text/events.ts` (or the matching expansion text file), replace "a neighboring kingdom" / "a foreign power" / "a rival" with `{neighbor}`.

Do not attempt to update all ~212 events. Do 5 as proof of pattern, leave the rest for a follow-up pass.

### Verification

- `npx tsc --noEmit` passes
- `npm run lint` passes
- The 5 updated events now render with actual kingdom names instead of vague references.

---

## Phase 4 — Event data uses consequence tag conditions

**Problem:** Events fire without checking what the player has already done. Border fortification events appear after the player already fortified borders. This is the highest-impact data fix.

**Approach:** This is a data-layer-only pass. No engine changes. Add `consequence_tag_absent` and `consequence_tag_present` conditions to existing event trigger conditions.

### 4a. Identify decree consequence tags

After Phase 1, every decree creates a tag like `decree:fortify_border_outposts`. List all decree IDs from `src/data/decrees/index.ts` and the expansion decrees. These are the tags that events must respect.

### 4b. Add blocking conditions to contradictory events

Search across all event definition files (`src/data/events/index.ts`, `src/data/events/expansion/*.ts`) for events that describe degradation or failure of something the player can build/enact. For each, add a `consequence_tag_absent` condition.

**Examples of what to look for and fix:**

| Event theme | Should be blocked by tag | Condition to add |
|---|---|---|
| Border walls crumbling/deteriorating | `decree:fortify_border_outposts` or similar border decree | `{ type: 'consequence_tag_absent', consequenceTag: 'decree:fortify_border_outposts' }` |
| Military proposes border fortification | Same | Same |
| Military equipment failing | `decree:commission_new_armaments` or similar | `{ type: 'consequence_tag_absent', consequenceTag: 'decree:commission_new_armaments' }` |
| Food shortage events | Agricultural investment decree tags | Appropriate `consequence_tag_absent` |
| Trade route disruption | Trade decree/agreement tags | Appropriate `consequence_tag_absent` |

Also look for petition/crisis event choices that produce consequence tags (these are already in `persistentConsequences` via `applyCrisisResponseEffect`). The tag format is `{definitionId}:{choiceId}`. Events that duplicate those choices should block on those tags too.

### 4c. Add prerequisite conditions to escalation events

For diplomatic and military escalation events, add `consequence_tag_present` conditions requiring a prior friction event. This prevents jumping straight to invasion without buildup.

**Pattern:**
- Tier 1 event (border incident, diplomatic friction): no prerequisite. Creates consequence tag on resolution.
- Tier 2 event (military mobilization, formal demands): requires Tier 1 tag via `{ type: 'consequence_tag_present', consequenceTag: '<tier1_tag>' }`.
- Tier 3 event (invasion, war declaration): requires Tier 2 tag.

### 4d. Tighten phase gating on diplomatic events

Find events in `src/data/events/expansion/diplomacy-events.ts` that represent formal agreements, treaties, or trade pacts. Change `phase: 'any'` or `phase: 'developing'` to `phase: 'established'` (turn 9+). Minor diplomatic contact events can stay at `'developing'`.

### 4e. Add relationship checks to military threat events

Find standalone military threat events (not generated by the neighbor AI). Add `neighbor_relationship_below` conditions:
```typescript
{ type: 'neighbor_relationship_below', neighborId: 'neighbor_arenthal', threshold: 40 }
```

Or, if the event should fire when ANY neighbor is hostile, use `any_of`:
```typescript
{
  type: 'any_of',
  conditions: [
    { type: 'neighbor_relationship_below', neighborId: 'neighbor_arenthal', threshold: 40 },
    { type: 'neighbor_relationship_below', neighborId: 'neighbor_valdris', threshold: 40 },
  ]
}
```

### Verification

- `npx tsc --noEmit` passes
- `npm run lint` passes
- Existing tests in `src/__tests__/condition-vocabulary.test.ts` still pass
- Play through 12 turns. After enacting a border fortification decree, no "crumbling walls" event should appear. After fortifying + petitioning borders, no "military proposes fortification" event should appear.

---

## Phase 5 — Kingdom features system

**Problem:** The player builds healing baths, fortifies borders, commissions armaments — none of these persist as visible, ongoing kingdom features. They vanish into one-time stat nudges.

### 5a. `src/engine/types.ts`

Add a new interface:
```typescript
export interface KingdomFeature {
  id: string;
  sourceTag: string;
  turnEstablished: number;
  ongoingEffect: MechanicalEffectDelta;
  category: 'infrastructure' | 'military' | 'diplomatic' | 'cultural' | 'economic';
}
```

Add to `GameState`:
```typescript
activeKingdomFeatures: KingdomFeature[];
```

Add to the `SaveFile` interface if needed for persistence.

### 5b. `src/data/kingdom-features/index.ts` (new file)

Create a registry mapping consequence tags to kingdom feature definitions:
```typescript
export interface KingdomFeatureDefinition {
  featureId: string;
  title: string;
  description: string;
  category: KingdomFeature['category'];
  ongoingEffect: MechanicalEffectDelta;
}

export const KINGDOM_FEATURE_REGISTRY: Record<string, KingdomFeatureDefinition> = {
  // Decree-sourced features
  'decree:fortify_border_outposts': {
    featureId: 'feature_fortified_borders',
    title: 'Fortified Border Outposts',
    description: 'Border defenses have been reinforced. Military readiness benefits each season.',
    category: 'military',
    ongoingEffect: { militaryReadinessDelta: 1 },
  },
  // Event-choice-sourced features
  'evt_hot_springs_discovery:build_healing_baths': {
    featureId: 'feature_healing_baths',
    title: 'Public Healing Baths',
    description: 'Natural hot springs developed into public baths. Commoner wellbeing and cultural prestige grow.',
    category: 'cultural',
    ongoingEffect: { commonerSatDelta: 1, culturalCohesionDelta: 1 },
  },
  // Add 10-15 more covering major decree and event choices
};
```

Start with features for the most obviously impactful decisions. Do not try to cover all ~212 events. Cover all decrees and the 15-20 event choices that represent building or establishing something permanent.

### 5c. `src/engine/resolution/apply-action-effects.ts`

After creating the `PersistentConsequence` in both `applyDecreeEffect()` and `applyCrisisResponseEffect()`, check if the consequence tag has a matching entry in `KINGDOM_FEATURE_REGISTRY`. If so, create and append a `KingdomFeature` to `state.activeKingdomFeatures`:

```typescript
import { KINGDOM_FEATURE_REGISTRY } from '../../data/kingdom-features/index';

// After creating consequence:
const featureDef = KINGDOM_FEATURE_REGISTRY[consequence.tag];
if (featureDef) {
  const feature: KingdomFeature = {
    id: `kf-${featureDef.featureId}-t${state.turn.turnNumber}`,
    sourceTag: consequence.tag,
    turnEstablished: state.turn.turnNumber,
    ongoingEffect: featureDef.ongoingEffect,
    category: featureDef.category,
  };
  updatedState = {
    ...updatedState,
    activeKingdomFeatures: [...updatedState.activeKingdomFeatures, feature],
  };
}
```

### 5d. `src/engine/resolution/turn-resolution.ts`

In Phase 2b (temporary modifier tick, around line 335), add a loop that applies `ongoingEffect` from each `KingdomFeature` in `state.activeKingdomFeatures` using `applyMechanicalEffectDelta()`. Pattern it after the temporary modifier loop that's already there. Kingdom features do not decrement or expire — they apply every turn permanently.

### 5e. Initialize on all scenario starting states

In `src/data/scenarios/default.ts` (and all other scenario files), add `activeKingdomFeatures: []` to the initial `GameState`.

### Verification

- `npx tsc --noEmit` passes
- `npm run lint` passes
- Write a test: enact a decree that has a kingdom feature mapping, verify the feature exists in post-state, advance one turn, verify the ongoing effect was applied.

---

## Phase 6 — Codex shows kingdom features and decision history

**Problem:** The codex shows domain tiers (Realm: Stable, Armies: Prosperous) but nothing about what the player has built or enacted.

### 6a. `src/bridge/situationTracker.ts`

Add a new section (section 7) after the active storylines section. Read `state.activeKingdomFeatures` and produce `ActiveSituation` entries:

```typescript
// 7. Kingdom features (established improvements)
for (const feature of state.activeKingdomFeatures) {
  const def = KINGDOM_FEATURE_REGISTRY[feature.sourceTag];
  if (!def) continue;
  situations.push({
    id: `feature_${feature.id}`,
    type: 'kingdom_feature',
    title: def.title,
    statusLines: [
      def.description,
      `Established season ${feature.turnEstablished}`,
    ],
    urgency: 'low' as const,
  });
}
```

Import `KINGDOM_FEATURE_REGISTRY` from the data layer. Add `'kingdom_feature'` to the `ActiveSituation['type']` union in `src/ui/types.ts` if it's constrained.

### 6b. `src/bridge/chronicleLogger.ts`

Expand `generateChronicleEntries()` to also log:

1. **Decree enactments.** The function receives `_decisions: MonthDecision[]` (currently unused — note the underscore). Rename to `decisions` and iterate: for any decision with `interactionType === InteractionType.Decree`, add a chronicle entry. You'll need a `DECREE_DISPLAY_NAMES` lookup — add it to `src/data/text/labels.ts` or a new text file.

2. **Notable-severity event resolutions.** Currently only Serious/Critical events get chronicle entries (lines 47–57). Add Notable severity to the filter condition.

### 6c. `src/ui/components/codex/ActiveSituationsCards.tsx`

If the component filters or styles by situation type, add handling for `'kingdom_feature'` type. Give it a distinct icon or accent color. Kingdom features should sort to the bottom (low urgency, permanent).

### Verification

- `npx tsc --noEmit` passes
- After building healing baths, the Situations tab shows "Public Healing Baths" with its description.
- After enacting a decree, the Chronicle tab shows the enactment.

---

## Phase 7 — Title screen defaults to New Crown

**Problem:** All five scenarios appear as equal choices. New Crown should be the default and only starting option.

### `src/ui/phases/TitleScreen.tsx`

Replace the scenario selection UI. Remove the `SCENARIO_METADATA.map()` block (lines 68–122). Replace with a single "Begin New Reign" card that calls `onStartGame('new_crown')`.

Keep the "Continue Your Reign" card as-is.

Remove the `useState` for `selectedScenario` since it's no longer needed.

Remove the "CHOOSE YOUR SCENARIO" / "OR BEGIN NEW REIGN" section label.

### `src/data/scenarios/metadata.ts`

Keep the file — other code may reference it. But it is no longer used for the title screen selection flow.

### Verification

- Title screen shows only "Crown & Council" title card, optional "Continue" card, and a "Begin New Reign" card.
- Starting a game always begins with `new_crown` scenario.

---

## Phase 8 — Convert alternate scenarios to pressure-activated storylines

**Problem:** Merchant's Gambit, Frozen March, Fractured Inheritance, and Faithful Kingdom should emerge from player behavior rather than being selected up front.

### 8a. `src/data/storylines/index.ts`

Add four new `StorylineDefinition` entries, one for each former scenario. Each needs:

- `activationProfile` with pressure axis thresholds matching the scenario's theme:
  - **Merchant's Gambit**: `primaryAxis: 'commerce'`, `primaryThreshold: 15`, `suppressedByAxis: 'militarism'`, `suppressedByThreshold: 12`
  - **Frozen March**: `primaryAxis: 'militarism'`, `primaryThreshold: 12`, `secondaryAxis: 'isolation'`, `secondaryThreshold: 8`
  - **Fractured Inheritance**: `primaryAxis: 'authority'`, `primaryThreshold: 15`, `secondaryAxis: 'intrigue'`, `secondaryThreshold: 10`
  - **Faithful Kingdom**: `primaryAxis: 'piety'`, `primaryThreshold: 15`, `suppressedByAxis: 'reform'`, `suppressedByThreshold: 10`
- `minTurn: 8` (at minimum — the engine enforces floor of 8 anyway per `NARRATIVE_PRESSURE_MIN_TURN`).
- Branch points that introduce the arc narratively, with at least 2 branches and a resolution.

### 8b. `src/data/storylines/effects.ts`

Add mechanical effects for each new storyline's branch choices and resolution. Follow the existing pattern in this file.

### 8c. `src/data/text/expansion/storyline-text.ts`

Add text entries for each new storyline: title, statusNote, and branchPoints with body text and choice labels.

### 8d. `src/data/narrative-pressure/weights.ts`

Add pressure weight entries for the new storyline branch choices so they feed back into the pressure system.

### Verification

- `npx tsc --noEmit` passes
- `npm run lint` passes
- In a test playthrough, making heavy merchant-favoring choices for 8+ turns should eventually trigger the Merchant's Gambit storyline activation.

---

## Constraints for all phases

- **The engine is sacred.** Do not restructure the 11-phase turn resolution pipeline. Add new logic at the end of existing phases or as new sub-phases (e.g., Phase 2c).
- **No player-facing text in engine files.** Display text lives in `src/data/text/`. The new `KINGDOM_FEATURE_REGISTRY` in `src/data/` stores titles and descriptions. The engine's `KingdomFeature` type stores only IDs and mechanical data.
- **Pure functions.** All engine and bridge additions must be pure: state in, state out. No side effects, no mutation.
- **Run type checks and lint after every file change.** `npx tsc --noEmit && npm run lint`.
- **Do not add dependencies.** No new npm packages.
- **Existing tests must continue to pass.** Run `npx vitest run` after each phase.
