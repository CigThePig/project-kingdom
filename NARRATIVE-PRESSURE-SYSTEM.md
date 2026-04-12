# NARRATIVE-PRESSURE-SYSTEM.md — Emergent Storyline Architecture

## Overview

This document replaces the current storyline activation system. Today, storylines check their own trigger conditions each turn (turn_min + state check + random_chance) and activate independently. This creates problems: storylines can fire before the player has established a playstyle, multiple storylines can collide, and the same storyline can fire in playthroughs that have nothing to do with its theme.

The replacement is a **Narrative Pressure** system. Every player decision deposits weight onto one or more thematic axes. As weight accumulates, the game detects what kind of story the player is building through their choices and activates the storyline that fits that trajectory. All games start vanilla. Storylines emerge from play, not from dice rolls.

### Design Constraints

- One primary storyline active at a time
- Storyline cards mix into the normal card pool (don't replace it)
- No storyline activation before turn 8
- Subplots are handled by follow-up chains, not the storyline system
- System must be expandable — adding a new storyline means defining a new axis mapping and threshold, not rewriting engine code
- The existing storyline branch/resolution structure stays unchanged — only the *activation* mechanism changes

---

## Part 1 — Narrative Axes

A narrative axis is a thematic dimension that player decisions push along. Each axis has a numeric pressure value that starts at 0 and accumulates over the course of a reign. Pressure is always additive (never subtracted — your past choices are permanent history). The axes are:

| Axis ID | Name | Theme | What pushes it |
|---------|------|-------|---------------|
| `authority` | Iron Crown | Centralized power, suppression, control | Military suppression of riots, denying faction demands, enforcing laws, crackdowns, arresting conspirators |
| `piety` | Faith Ascendant | Religious dominance, orthodox power | Supporting clergy, authorizing crackdowns on heterodoxy, temple funding, rejecting foreign doctrine |
| `commerce` | Merchant Tide | Mercantile power, economic expansion | Siding with merchants, trade deals, market expansion, foreign missions, trade protections |
| `militarism` | Drums of War | Military buildup, aggressive posture | Military spending, matching buildups, rejecting peace, preemptive strikes, conscription |
| `reform` | Voice of the People | Progressive change, commoner empowerment | Labor reforms, food relief, public works, commoner charters, fair wage guarantees |
| `intrigue` | Shadow Court | Espionage, manipulation, hidden power | Espionage operations, investigations, infiltration, intelligence gathering, using leverage |
| `openness` | Wide Horizon | Cultural exchange, foreign engagement | Welcoming scholars, accepting treaties, cultural exchange, foreign alliances, tolerating foreign doctrine |
| `isolation` | Closed Gates | Protectionism, tradition, insularity | Trade protections, rejecting treaties, expelling foreigners, reasserting traditional values, border reinforcement |

Eight axes. A decision can push multiple axes simultaneously (authorizing a heresy crackdown pushes both `authority` and `piety`). Some axes have natural tension (`openness` vs. `isolation`, `authority` vs. `reform`) but this is emergent from the weight patterns, not enforced by the engine.

### Engine Type

```typescript
// Add to src/engine/types.ts

export interface NarrativePressure {
  authority: number;
  piety: number;
  commerce: number;
  militarism: number;
  reform: number;
  intrigue: number;
  openness: number;
  isolation: number;
}

// Add to GameState:
narrativePressure: NarrativePressure;
```

Initialized to all zeros on new game. Never reset during a reign (resets on succession/new game only).

---

## Part 2 — Pressure Sources

Every player-facing decision in the game contributes pressure. The weight is defined in the data layer, not the engine. The engine just applies whatever weights the data layer provides.

### 2.1 Pressure Weight Schema

Each decision that contributes pressure gets a `pressureWeights` entry: an object mapping axis IDs to numeric values. Values typically range from 1-5 for normal decisions, 5-10 for major decisions, and 10-15 for crisis-level pivots.

```typescript
// New file: src/data/narrative-pressure/weights.ts

export interface PressureWeightEntry {
  axisWeights: Partial<NarrativePressure>;
}

// Keyed by: `${sourceType}:${sourceId}:${choiceId}`
export const PRESSURE_WEIGHTS: Record<string, PressureWeightEntry> = {
  // Faction request example
  'faction:faction_req_clergy_heresy_crackdown:authorize_crackdown': {
    axisWeights: { authority: 4, piety: 5 },
  },
  'faction:faction_req_clergy_heresy_crackdown:refuse_crackdown': {
    axisWeights: { reform: 3, openness: 2 },
  },

  // Event example
  'event:evt_harvest_blight:quarantine_affected_fields': {
    axisWeights: { authority: 2 },
  },
  'event:evt_harvest_blight:purchase_foreign_grain': {
    axisWeights: { commerce: 2, openness: 1 },
  },

  // Decree example
  'decree:decree_raise_taxes': {
    axisWeights: { authority: 2 },
  },

  // Negotiation term example
  'negotiation:neg_trade_deal:exclusive_market_access': {
    axisWeights: { commerce: 3, openness: 2 },
  },
  'negotiation:neg_trade_deal:reject_trade_deal': {
    axisWeights: { isolation: 3 },
  },

  // Assessment example
  'assessment:assess_border_movement:investigate_border_movement': {
    axisWeights: { intrigue: 3 },
  },
  'assessment:assess_border_movement:reinforce_preemptively': {
    axisWeights: { militarism: 3 },
  },
  'assessment:assess_border_movement:dismiss_border_reports': {
    axisWeights: {},  // no pressure — inaction is neutral
  },

  // Neighbor action example
  'neighbor:WarDeclaration:mobilize_for_war': {
    axisWeights: { militarism: 5 },
  },
  'neighbor:WarDeclaration:seek_emergency_diplomacy': {
    axisWeights: { openness: 3 },
  },
  'neighbor:WarDeclaration:defensive_posture': {
    axisWeights: { militarism: 2, authority: 1 },
  },

  // Follow-up events contribute AMPLIFIED pressure
  'event:fu_tax_exemption_merchant_precedent:grant_merchant_exemption_too': {
    axisWeights: { commerce: 5 },  // higher weight — this is a doubling-down moment
  },
  'event:fu_inquisition_overreach:disband_the_inquisition': {
    axisWeights: { reform: 8 },  // pivotal reversal — strong signal
  },
  'event:fu_inquisition_overreach:let_it_continue': {
    axisWeights: { authority: 8, piety: 6 },  // pivotal commitment — very strong signal
  },
};
```

### 2.2 How Weights Are Applied

Pressure is applied in `turn-resolution.ts` after event choices are resolved (Phase 9a) and after decree effects are applied. A new utility function handles the lookup and accumulation:

```typescript
// New file: src/engine/systems/narrative-pressure.ts

import type { GameState, NarrativePressure } from '../types';
import { PRESSURE_WEIGHTS } from '../../data/narrative-pressure/weights';

/**
 * Applies pressure weights for a single player decision.
 * Returns updated NarrativePressure (does not mutate input).
 */
export function applyPressure(
  current: NarrativePressure,
  sourceType: string,  // 'event' | 'faction' | 'decree' | 'negotiation' | 'assessment' | 'neighbor'
  sourceId: string,
  choiceId: string,
): NarrativePressure {
  const key = `${sourceType}:${sourceId}:${choiceId}`;
  const entry = PRESSURE_WEIGHTS[key];
  if (!entry) return current;

  const updated = { ...current };
  for (const [axis, weight] of Object.entries(entry.axisWeights)) {
    updated[axis as keyof NarrativePressure] += weight;
  }
  return updated;
}

/**
 * Returns the axis with the highest accumulated pressure.
 * Used for storyline activation and Codex display.
 */
export function getDominantAxis(pressure: NarrativePressure): {
  axis: keyof NarrativePressure;
  value: number;
} {
  let maxAxis: keyof NarrativePressure = 'authority';
  let maxValue = 0;
  for (const [axis, value] of Object.entries(pressure)) {
    if (value > maxValue) {
      maxAxis = axis as keyof NarrativePressure;
      maxValue = value;
    }
  }
  return { axis: maxAxis, value: maxValue };
}
```

### 2.3 Pressure Source Categories

| Source | When applied | Typical weight | Notes |
|--------|-------------|---------------|-------|
| Event choices (EVENT_POOL) | After event resolution in Phase 9a | 1-4 | Base-level decisions |
| Faction request swipes | After petition resolution | 2-5 | Frequent, moderate impact |
| Decree selections | After decree effects applied | 2-4 | Deliberate policy choices |
| Negotiation term toggles | After negotiation resolution | 2-4 per term, 3-5 for reject | Multiple terms = compounding pressure |
| Assessment posture choices | After assessment resolution | 2-4 | Investigate vs. ignore signals different axes |
| Neighbor action responses | After neighbor action resolution | 3-6 | Diplomatic posture is a strong signal |
| Follow-up event choices | After follow-up resolution | 4-10 | Amplified — doubling down on a trajectory |
| Storyline branch choices | After storyline branch resolution | 6-12 | Highest weight — these are pivotal moments |
| Consequence tag creation | When tag is recorded | 1-3 (passive) | Automatic background accumulation |

Follow-up events and storyline branches intentionally carry heavier weight. A player who not only authorized a heresy crackdown (weight 4+5) but then doubled down when the inquisition overreached (weight 8+6) is sending a very clear signal about what kind of ruler they are. The system should hear that signal loudly.

---

## Part 3 — Storyline Activation

### 3.1 Activation Thresholds

Each storyline defines which axes it responds to and what pressure threshold is required. A storyline can require pressure on a single axis or a combination.

```typescript
// Replaces activationConditions on StorylineDefinition

export interface StorylineActivationProfile {
  /** Primary axis — must cross this threshold. */
  primaryAxis: keyof NarrativePressure;
  primaryThreshold: number;

  /** Optional secondary axis — if present, must also cross this threshold. */
  secondaryAxis?: keyof NarrativePressure;
  secondaryThreshold?: number;

  /** Optional suppressor — if this axis is ABOVE this value, storyline is blocked. */
  suppressedByAxis?: keyof NarrativePressure;
  suppressedByThreshold?: number;

  /** Minimum turn before this storyline can activate (floor: 8, enforced by engine). */
  minTurn: number;

  /** Priority when multiple storylines qualify simultaneously. Higher = preferred. */
  priority: number;

  /** Optional: required consequence tags (from follow-up chains or past decisions). */
  requiredTags?: string[];

  /** Optional: blocking consequence tags (if present, storyline cannot activate). */
  blockedByTags?: string[];
}
```

### 3.2 Storyline-to-Axis Mappings

Here's how the existing 12 storylines map to the pressure system. Thresholds are tuned so that a player making consistent choices in one direction reaches activation around turn 10-14. A player making mixed choices may never activate some storylines.

| Storyline | Primary Axis | Threshold | Secondary | Suppressor | Min Turn |
|-----------|-------------|-----------|-----------|------------|----------|
| The Pretender's Claim | `authority` | 35 | — | — | 9 |
| The Prophet of the Waste | `piety` | 30 | — | `authority` > 40 | 9 |
| The Frozen March | `militarism` | 35 | — | — | 10 |
| The Merchant King | `commerce` | 35 | — | `authority` > 35 | 10 |
| The Lost Expedition | `openness` | 25 | `commerce` ≥ 15 | — | 10 |
| The Foreign Festival | `openness` | 30 | — | `isolation` > 25 | 9 |
| The Merchant's Rebellion | `commerce` | 40 | `reform` ≥ 15 | — | 11 |
| The Holy War | `piety` | 40 | `militarism` ≥ 20 | — | 12 |
| The Prodigal Prince | `intrigue` | 30 | — | — | 11 |
| The Plague Ships | any axis | 20 | — | — | 8 |
| The Great Tournament | `militarism` | 25 | `openness` ≥ 15 | — | 10 |
| The Starving Winter | `isolation` | 25 | — | `commerce` > 30 | 9 |

**Design notes:**

- **The Plague Ships** has the lowest threshold and responds to any axis — it's a "something always happens" failsafe for playthroughs where the player doesn't push hard in any direction. It activates at turn 8+ if any single axis is above 20. Since nearly every decision pushes at least one axis, this ensures every playthrough eventually gets a storyline even with diffuse decision-making.

- **The Holy War** has the highest combined threshold (piety 40 + militarism 20) — it only fires for a player who has been both devout AND militant. This is the hardest storyline to trigger and represents an extreme playstyle.

- **Suppressors** prevent contradictory storylines. A player who has been authoritarian can't trigger the Prophet of the Waste (which is about a grassroots religious movement — it doesn't make sense if the crown has been suppressing everything). The Starving Winter (about isolationist consequences) is suppressed if the player has high commerce pressure (they've been trading too much to be isolated).

- **Required tags** (not shown in table, defined per-storyline) allow specific follow-up chain outcomes to unlock storylines. Example: if the heresy crackdown chain ends with "Inquisition Overreach" and the player chose `let_it_continue`, the consequence tag `inquisition_unchecked` could be a required tag for a future "Theocratic State" storyline.

### 3.3 Activation Evaluation

Runs once per turn during Phase 9 of turn resolution, after all pressure has been applied for the current turn's decisions. This replaces the current `evaluateStorylinePool` call.

```typescript
// New function in src/engine/systems/narrative-pressure.ts

export interface StorylineCandidate {
  storylineId: string;
  dominantAxis: keyof NarrativePressure;
  pressure: number;
  priority: number;
}

/**
 * Evaluates all storylines against current pressure state.
 * Returns the single best candidate for activation, or null.
 */
export function evaluateStorylineActivation(
  pressure: NarrativePressure,
  storylines: StorylineDefinition[],
  currentTurn: number,
  activeStorylines: ActiveStoryline[],
  resolvedStorylineIds: string[],
  persistentConsequences: PersistentConsequence[],
): StorylineCandidate | null {

  // Hard gate: no activation before turn 8
  if (currentTurn < 8) return null;

  // Hard gate: only one primary storyline at a time
  if (activeStorylines.length > 0) return null;

  const candidates: StorylineCandidate[] = [];
  const tags = new Set(persistentConsequences.map(c => c.tag));

  for (const sl of storylines) {
    // Skip already resolved storylines
    if (resolvedStorylineIds.includes(sl.id)) continue;

    const profile = sl.activationProfile;

    // Check minimum turn
    if (currentTurn < profile.minTurn) continue;

    // Check primary axis threshold
    if (pressure[profile.primaryAxis] < profile.primaryThreshold) continue;

    // Check secondary axis threshold (if defined)
    if (profile.secondaryAxis && profile.secondaryThreshold) {
      if (pressure[profile.secondaryAxis] < profile.secondaryThreshold) continue;
    }

    // Check suppressor axis (if defined)
    if (profile.suppressedByAxis && profile.suppressedByThreshold) {
      if (pressure[profile.suppressedByAxis] > profile.suppressedByThreshold) continue;
    }

    // Check required tags
    if (profile.requiredTags?.some(t => !tags.has(t))) continue;

    // Check blocking tags
    if (profile.blockedByTags?.some(t => tags.has(t))) continue;

    candidates.push({
      storylineId: sl.id,
      dominantAxis: profile.primaryAxis,
      pressure: pressure[profile.primaryAxis],
      priority: profile.priority,
    });
  }

  if (candidates.length === 0) return null;

  // Pick the candidate with highest priority, breaking ties by pressure value
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.pressure - a.pressure;
  });

  return candidates[0];
}
```

### 3.4 Integration with Turn Resolution

In `turn-resolution.ts`, the existing storyline evaluation block is replaced:

```typescript
// BEFORE (current):
const newStorylines = evaluateStorylinePool(state, STORYLINE_REGISTRY, ...);

// AFTER (new):
// 1. Apply pressure from all decisions made this turn
let updatedPressure = state.narrativePressure;
for (const decision of allResolvedDecisions) {
  updatedPressure = applyPressure(
    updatedPressure,
    decision.sourceType,
    decision.sourceId,
    decision.choiceId,
  );
}

// 2. Evaluate storyline activation against updated pressure
const candidate = evaluateStorylineActivation(
  updatedPressure,
  STORYLINE_REGISTRY,
  nextTurnNumber,
  state.activeStorylines,
  state.resolvedStorylineIds,
  state.persistentConsequences,
);

// 3. If a candidate qualifies, activate it
let newStorylines: ActiveStoryline[] = [];
if (candidate) {
  const def = STORYLINE_REGISTRY.find(s => s.id === candidate.storylineId);
  if (def) {
    newStorylines = [createActiveStoryline(def, nextTurnNumber)];
  }
}
```

The rest of the storyline system (branch progression, resolution, effects) remains unchanged. Only the front door changes — how a storyline gets activated.

---

## Part 4 — Pressure Decay & Reactivation

### 4.1 No Decay During a Storyline

While a storyline is active, pressure continues to accumulate from normal decisions but no new storyline can activate (one at a time rule). Storyline branch choices contribute heavy pressure, which means by the time a storyline resolves, the player's pressure profile is even more defined.

### 4.2 Post-Resolution Cooldown

After a storyline resolves, there is a **4-turn cooldown** before the next storyline can activate. During cooldown, pressure still accumulates. This prevents storyline fatigue and gives the player breathing room to return to vanilla play.

```typescript
// Add to GameState:
lastStorylineResolutionTurn: number;  // 0 if no storyline has resolved yet

// In evaluateStorylineActivation:
if (currentTurn - state.lastStorylineResolutionTurn < 4) return null;
```

### 4.3 Pressure Carries Forward

Pressure is never reset during a reign. A player who resolves a military storyline at turn 14 still has high `militarism` pressure — and that can trigger a second military storyline later if one exists. This means the system naturally supports multi-act narratives: a player's reign has a first act (vanilla), a second act (first storyline), and potentially a third act (second storyline if they survive long enough).

### 4.4 Pressure Resets on New Reign

If the Legacy Reign System (Phase 9 of the improvement plan) is implemented, pressure resets to zero when a successor begins. The new ruler starts clean.

---

## Part 5 — Data Layer Contract

### 5.1 StorylineDefinition Changes

The `StorylineDefinition` interface changes only at the activation level:

```typescript
// In storyline-engine.ts — MODIFIED interface:
export interface StorylineDefinition {
  id: string;
  category: StorylineCategory;

  // REMOVED: activationConditions: StorylineActivationCondition[];
  // ADDED:
  activationProfile: StorylineActivationProfile;

  openingBranchId: string;
  branches: StorylineBranchPointDefinition[];
  initialTurnsUntilFirstBranchPoint: number;
}
```

Everything below `activationProfile` (branches, choices, resolution) stays identical.

### 5.2 Pressure Weight File Structure

All pressure weights live in a single data directory:

```
src/data/narrative-pressure/
  weights.ts          — master weight map (all sources)
  axis-definitions.ts — axis metadata (names, descriptions, Codex display)
  thresholds.ts       — storyline-to-axis mappings and thresholds
```

This structure means adding a new storyline requires:
1. Writing the storyline definition (branches, text, effects) — same as today
2. Adding one entry to `thresholds.ts` mapping it to axes
3. Adding pressure weights for its branch choices to `weights.ts`

No engine code changes needed.

### 5.3 Adding a New Storyline (Example)

Suppose someone wants to add "The Peasant King" — a storyline about a commoner uprising that installs a populist council.

**Step 1:** Define activation profile in `thresholds.ts`:
```typescript
sl_peasant_king: {
  primaryAxis: 'reform',
  primaryThreshold: 40,
  secondaryAxis: undefined,
  secondaryThreshold: undefined,
  suppressedByAxis: 'authority',
  suppressedByThreshold: 35,
  minTurn: 12,
  priority: 6,
  requiredTags: ['denied_food_relief', 'commoner_uprising_suppressed'],
  blockedByTags: ['opened_royal_granaries'],
}
```

This storyline only fires if the player has accumulated 40+ reform pressure, hasn't been too authoritarian, has previously denied food relief AND suppressed a commoner uprising, and hasn't shown mercy by opening the royal granaries. It requires very specific narrative preconditions that emerge from follow-up chains.

**Step 2:** Add branch choice weights to `weights.ts`:
```typescript
'storyline:sl_peasant_king:support_the_council': {
  axisWeights: { reform: 12 },
},
'storyline:sl_peasant_king:crush_the_uprising': {
  axisWeights: { authority: 12 },
},
```

**Step 3:** Write the storyline branches, text, and effects — identical process to today.

Done. The engine handles everything else.

---

## Part 6 — Codex Integration

### 6.1 Narrative Pulse Display

The Codex's Kingdom State section gets a new entry: "Narrative Pulse" — a qualitative reading of the kingdom's dominant pressures. This never mentions axes by name or shows numbers. It shows the *story* the numbers imply.

```typescript
// In src/bridge/codexCompiler.ts — new function:

export function compileNarrativePulse(
  pressure: NarrativePressure,
): { headline: string; description: string } {
  const dominant = getDominantAxis(pressure);
  const secondary = getSecondHighestAxis(pressure);

  // Map axes to qualitative descriptions
  const headlines: Record<string, string> = {
    authority: 'The Crown Tightens Its Grip',
    piety: 'Faith Shapes the Realm',
    commerce: 'Gold Moves the Kingdom',
    militarism: 'The Realm Arms for Conflict',
    reform: 'Winds of Change Blow',
    intrigue: 'Shadows Deepen at Court',
    openness: 'The Kingdom Looks Outward',
    isolation: 'The Borders Close',
  };

  return {
    headline: headlines[dominant.axis],
    description: generatePulseDescription(dominant, secondary, pressure),
  };
}
```

This gives the player a soft signal of where their decisions are taking them — without exposing the mechanical system. A player reading "Faith Shapes the Realm" in their Codex might realize they've been siding with the clergy on everything and course-correct, or they might lean in. Either way, the system is communicating.

### 6.2 Post-Storyline Chronicle Entry

When a storyline activates, the Chronicle records which pressure axis triggered it and what the kingdom's narrative pulse was at the time. This creates a readable history: "Year 3, Autumn — The Pretender's Claim begins. The Crown had tightened its grip, and now a rival emerges from the shadows."

---

## Part 7 — Interaction with Follow-Up Chains

The follow-up chain system from Phase 1B feeds directly into narrative pressure. Here's how they connect:

### 7.1 Chains as Pressure Amplifiers

Every follow-up event choice has its own pressure weight entry. Because follow-up choices represent doubling-down or course-correction, their weights are 2-3x higher than base event weights. A player who:

1. Authorized a heresy crackdown (piety: 5, authority: 4)
2. Then doubled down when martyrs emerged (piety: 4, authority: 6)
3. Then let the inquisition overreach (piety: 6, authority: 8)

...has accumulated 15 piety + 18 authority from a single chain. That's enough to make The Pretender's Claim (authority: 35) reachable by turn 10 if their other decisions also push authority.

### 7.2 Chains as Tag Generators

Follow-up chain endpoints generate consequence tags. These tags serve as storyline prerequisites (via `requiredTags`) or blockers (via `blockedByTags`). This means specific follow-up chain outcomes can unlock or prevent specific storylines.

Example: The food relief chain that ends with "Opened Royal Granaries" generates tag `opened_royal_granaries`. This tag BLOCKS "The Peasant King" storyline (the commoners don't revolt against a merciful crown) but ENABLES a hypothetical "The Beloved Monarch" storyline about popular loyalty.

### 7.3 Chains Don't Compete with Storylines

Follow-up chains produce crisis and petition cards that mix into the normal pool. Storylines also produce cards that mix into the normal pool. They coexist: a player can be in the middle of a heresy crackdown follow-up chain while the Prophet of the Waste storyline is active. The follow-up chain is a subplot; the storyline is the main arc.

The card distributor already handles mixed pools — it allocates crisis cards first, then petitions, then negotiations/assessments. Storyline branch point cards are treated as crisis-severity cards and get priority allocation.

---

## Part 8 — Migration from Current System

### 8.1 What Changes

| Component | Current | New |
|-----------|---------|-----|
| StorylineDefinition.activationConditions | Array of state checks + random_chance | Replaced by `activationProfile` |
| evaluateStorylinePool() | Checks conditions each turn, random roll | Replaced by `evaluateStorylineActivation()` using pressure |
| MAX_ACTIVE_STORYLINES constant | 2 | Changed to 1 |
| MIN_TURNS_BETWEEN_STORYLINE_ACTIVATIONS | 4 | Kept, now also enforced by pressure system |
| Storyline branch structure | Unchanged | Unchanged |
| Storyline effects and resolution | Unchanged | Unchanged |
| Storyline text | Unchanged | Unchanged |

### 8.2 What Stays

- All 12 existing storyline definitions keep their branches, choices, text, and effects
- The storyline engine's branch progression and resolution logic is untouched
- StorylineBranchChoiceDefinition, StorylineBranchPointDefinition unchanged
- The bridge layer's storylineCardGenerator.ts unchanged
- The Codex's situations tracker for active storylines unchanged

### 8.3 New Files

| File | Purpose |
|------|---------|
| `src/engine/systems/narrative-pressure.ts` | Pressure application, dominant axis, activation evaluation |
| `src/data/narrative-pressure/weights.ts` | Master weight map for all decision sources |
| `src/data/narrative-pressure/axis-definitions.ts` | Axis names, descriptions, Codex text |
| `src/data/narrative-pressure/thresholds.ts` | Storyline activation profiles |

### 8.4 Modified Files

| File | Changes |
|------|---------|
| `src/engine/types.ts` | Add NarrativePressure to GameState, add activationProfile to StorylineDefinition |
| `src/engine/resolution/turn-resolution.ts` | Replace evaluateStorylinePool call with pressure accumulation + evaluateStorylineActivation |
| `src/engine/events/storyline-engine.ts` | Remove evaluateStorylinePool (or keep as dead code for reference), update StorylineDefinition interface |
| `src/engine/constants.ts` | Change MAX_ACTIVE_STORYLINES to 1 |
| `src/data/storylines/index.ts` | Replace activationConditions with activationProfile on all 12 storylines |
| `src/data/scenarios/*.ts` | Initialize narrativePressure: { all zeros } in starting GameState |
| `src/bridge/codexCompiler.ts` | Add compileNarrativePulse |

### 8.5 Estimated Scope

| Task | Size |
|------|------|
| Engine: NarrativePressure type + applyPressure + evaluateStorylineActivation | ~120 lines |
| Data: Pressure weights for all existing decisions (~120 decision points) | ~400 lines |
| Data: Axis definitions and Codex text | ~60 lines |
| Data: Activation profiles for 12 storylines | ~100 lines |
| Integration: turn-resolution.ts changes | ~40 lines |
| Migration: storyline definition updates | ~120 lines (mostly deleting old conditions) |
| Codex: Narrative Pulse display | ~60 lines |
| **Total** | **~900 lines** |

---

## Part 9 — Design Philosophy

The pressure system is intentionally simple. It's an accumulator with thresholds. There is no machine learning, no complex weighting algorithm, no dynamic rebalancing. The sophistication lives in the data layer — in how weights are assigned, how thresholds are tuned, and how tags gate specific storylines.

This makes it debuggable (just look at the pressure values), tunable (change a threshold number), and expandable (add a new storyline by adding one activation profile and weight entries for its choices). A new storyline author never needs to touch engine code.

The system trusts the player to create their own story. It doesn't nudge them toward any particular axis — it watches what they do and responds with content that fits. A player who makes inconsistent decisions gets the Plague Ships (the universal fallback). A player who commits to a vision gets a storyline that validates and challenges that vision.

That's the core promise: your decisions don't just have mechanical consequences — they shape the *kind of story* you're living in.
