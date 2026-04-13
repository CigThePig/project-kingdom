# Follow-Up Branching and Season Delivery Realignment

## Purpose

This document is the full implementation plan for follow-up branching, season delivery integrity, and notification presentation in the kingdom game codebase.

Follow-up branching is a cross-layer feature that touches:

1. engine scheduling and resolution (`follow-up-tracker.ts`, `turn-resolution.ts`)
2. surfaced-event delivery into the season/month card structure (`cardDistributor.ts`, `RoundController.tsx`)
3. petition/crisis/notification presentation rules (`eventClassifier.ts`, `CourtBusiness.tsx`, `PetitionPhase.tsx`)
4. authoring constraints and content volume (`data/events/index.ts`, `data/events/effects.ts`)

This is not an incremental patch. It is a full vertical slice: make follow-up branching mechanically correct, make season delivery truthful, wire all presentation paths, then populate the system with a production-scale content set that exercises every code path.

---

## Implementation Goal

Deliver follow-up branching as a complete, production-ready feature:

- mechanically correct engine with state-gated branching, exclusivity, retry, and composite deduplication
- truthful delivery that never silently drops surfaced content
- all three interaction types (crisis, petition, notification) fully wired end-to-end
- a production content set large enough to sustain varied gameplay across multiple playthroughs
- condition vocabulary expanded to cover the full range of authored consequence chains
- automated test coverage across all layers

---

## Non-Goals

Do not pursue these as part of this implementation:

- infinite recursive follow-up trees (max depth is capped and enforced)
- generalized arbitrary chain scripting language
- petition UI overhaul for 3+ choices (completed prior to this implementation; petition phase now uses tap-to-select response cards supporting arbitrary choice counts)
- storyline-engine integration (follow-up chains operate independently of the storyline system)

---

## Current Problems This Implementation Must Solve

### A. Fire-time state branching

A follow-up must be able to become due, inspect the current `GameState`, and only surface when its branch conditions are met.

Currently `processDueFollowUps()` in `follow-up-tracker.ts` checks only timing and probability. There is no `stateConditions` evaluation. The `EventTriggerCondition` type exists in `event-engine.ts` and the `evaluateCondition()` helper is already implemented, but neither is wired into follow-up processing.

### B. Branch exclusivity

When multiple sibling follow-ups represent alternate branches of the same consequence tree, once one sibling surfaces, the others must be cancelled.

Currently nothing prevents sibling follow-ups from surfacing across different turns. A player decision that schedules two mutually-exclusive follow-ups (e.g. "rich outcome" vs "poor outcome") can produce both if they become due on different turns.

### C. Retry behavior

When a due follow-up is not yet eligible because state conditions are unmet, it should wait and retry rather than disappearing immediately.

Currently `processDueFollowUps()` rolls probability immediately when a follow-up becomes due (line 75). A failed roll discards the follow-up permanently. There is no retry mechanism.

### D. Dedupe scope

Dedupe in `scheduleFollowUps()` currently checks only `definitionId` (line 29-31 of `follow-up-tracker.ts`). If two unrelated source events both try to schedule the same follow-up definition, the second is blocked. This is too coarse for a production content set where the same authored follow-up might legitimately fire from different source contexts.

### E. Delivery integrity

A surfaced petition, crisis, or notification must not be silently lost because of month assignment or interaction-type collisions.

Currently in `cardDistributor.ts`, additional crises that exceed the 3-month capacity are silently dropped (line 105: `// If no free month, the extra crisis is not surfaced this season.`). Petition overflow has fallback logic (lines 115-133) but ultimately attaches orphaned petitions to month 3 regardless of its interaction type, with no guarantee that CourtBusiness will render them after the primary interaction.

### F. Presentation truthfulness

The UI must not present fake decisions for acknowledgment-only content.

Currently notification events are fed into `generatePetitionCards()` in `RoundController.tsx` (line 174) and rendered through `PetitionPhase` with decision controls meant for substantive choices. The infrastructure for proper notification handling partially exists: `eventClassifier.ts` correctly partitions events into crisis/petition/notification, and `petitionCardGenerator.ts` already defines a `NotificationCardData` type and `generateNotificationCards()` function. However, the notification pipeline is not wired through `MonthAllocation`, `CourtBusiness`, or `decisionMapper`. The `InteractionType` enum has no `Notification` member.

### G. Petition choice-count mismatch — RESOLVED

~~The `PetitionCardData` type preserves all authored choices via `allChoices: PetitionChoiceData[]`, and `generatePetitionCards()` populates this correctly. However, the UI callback in `CourtBusiness.tsx` reduced decisions to `{ cardId: string; granted: boolean }`, and `decisionMapper.ts` mapped this boolean back to `grantChoiceId` or `denyChoiceId`. Any middle options in a 3-choice event were unreachable.~~

**Fixed:** The petition phase now uses tap-to-select response cards (same pattern as CrisisPhase), reading from `allChoices`. The pipeline passes `{ cardId: string; choiceId: string }` through `CourtBusiness` → `MonthDecision` → `decisionMapper`, so all authored choices are reachable. No binary constraint remains.

---

## Implementation Order

1. **Engine follow-up model revision**
2. **Season/month delivery fixes**
3. **Notification handling wiring**
4. **Petition choice-model verification** (largely complete — see Phase 4)
5. **Multi-crisis summary cleanup**
6. **Condition vocabulary expansion**
7. **Existing FOLLOW_UP_POOL triage**
8. **Full production content set**

Do not reverse the order of phases 1–5. Phase 6 can run in parallel with phase 5. Phases 7 and 8 require all prior phases to be complete.

---

## Phase 1: Engine Follow-Up Model Revision

### Required data additions

Extend `PendingFollowUp` in `src/engine/types.ts` (currently lines 796-804) with the following fields.

#### Add `stateConditions`

```ts
stateConditions?: EventTriggerCondition[]
```

These are evaluated when the follow-up becomes due, using the existing `evaluateCondition()` function from `event-engine.ts`.

#### Add `stateRetries`

```ts
stateRetries?: number
```

Tracks how many times a due follow-up failed eligibility and was re-queued.

#### Add `exclusiveGroupId`

```ts
exclusiveGroupId?: string | null
```

All sibling branches generated from the same source choice should share an exclusive group id. Once one branch from that group surfaces, the rest are cancelled.

#### Widen the dedupe key

Currently `scheduleFollowUps()` dedupes on `definitionId` alone (line 29-31). Change to a composite key:

```ts
sourceEventId + triggerChoiceId + followUpDefinitionId
```

This prevents unrelated source events from blocking each other while still preventing true duplicates from the same source.

#### Extend the authored follow-up shape

The `followUpEvents` array on `EventDefinition` (currently lines 138-143 of `event-engine.ts`) needs optional fields for the new capabilities:

```ts
followUpEvents?: {
  triggerChoiceId: string;
  followUpDefinitionId: string;
  delayTurns: number;
  probability: number;
  stateConditions?: EventTriggerCondition[];   // NEW
  exclusiveGroupId?: string | null;            // NEW
}[];
```

`scheduleFollowUps()` must propagate these into the `PendingFollowUp` it creates.

---

## Due Processing Rules

Update `processDueFollowUps()` in `follow-up-tracker.ts` to use this order:

1. check whether the follow-up is due this turn (existing: `turnsElapsed < followUp.delayTurns`)
2. evaluate `stateConditions` using `evaluateCondition()` from `event-engine.ts`
3. if conditions fail:
   - increment `stateRetries`
   - re-queue into `remaining` for the next eligible check
   - discard only after max retries is reached
4. if conditions pass:
   - roll probability
   - if probability fails, discard normally
   - if probability passes, surface the follow-up
5. if surfaced and `exclusiveGroupId` is set:
   - cancel all other pending follow-ups in the same exclusive group (remove from `remaining`)

### Important behavioral rule

**State eligibility must be evaluated before probability.**

Currently probability is rolled first (line 75). This must change. A branch that is not yet eligible should not consume its chance to exist. Probability should answer "does this eligible branch happen?" not "does this branch disappear before it is even allowed to happen?"

---

## Retry Policy

Default configuration:

- retry limit: `3`
- retry cadence: once per turn after due

That creates a short "waiting for conditions" window without leaving dead branches in the queue forever.

Allow authored override via `maxStateRetries` on the follow-up definition:

```ts
followUpEvents?: {
  triggerChoiceId: string;
  followUpDefinitionId: string;
  delayTurns: number;
  probability: number;
  stateConditions?: EventTriggerCondition[];
  exclusiveGroupId?: string | null;
  maxStateRetries?: number;                    // NEW — defaults to 3
}[];
```

Chains that model slow-building consequences (e.g. a famine response that waits for food stores to actually deplete) can set a higher retry ceiling. Chains that model time-sensitive reactions (e.g. a military response to an invasion) can set it to `0` or `1`.

---

## Branch Exclusivity Rules

Any authored alternate futures that represent mutually-exclusive outcomes from the same source choice must share an `exclusiveGroupId`.

### Example

A single choice schedules:

- rich outcome (`stateConditions: [{ type: 'treasury_above', threshold: 60 }]`)
- poor outcome (`stateConditions: [{ type: 'treasury_below', threshold: 30 }]`)
- unstable outcome (`stateConditions: [{ type: 'stability_below', threshold: 40 }]`)

Only one of these is allowed to surface. Once one does, the others must be cancelled immediately.

### Cancellation timing

Cancellation should happen inside `processDueFollowUps()` when the winning branch is accepted into the surfaced array, before the function returns. That prevents sibling leakage into future turns.

---

## Phase 2: Season/Month Delivery Fixes

### Problem 1: Crisis overflow is silently dropped

In `cardDistributor.ts` (lines 97-106), additional crises beyond the first are placed into free months. If no month is free, the extra crisis is not surfaced at all and no overflow mechanism exists.

### Problem 2: Petition fallback is fragile

The petition distribution fallback (lines 115-133) eventually attaches orphaned petitions to month 3 regardless of that month's interaction type. `CourtBusiness.tsx` renders only the month's primary interaction type — it does not walk a secondary petition stack.

### Required change

Surfaced events must be delivered through a structure that preserves multiple interaction payloads per month.

### Implementation: Per-month stacked interactions

Each month can hold:

- primary interaction (crisis, negotiation, or assessment)
- additional petition interactions
- additional notification interactions

`CourtBusiness` renders the stack in order: primary interaction first, then petitions, then notifications.

This requires extending `MonthAllocation` to include a `notificationCards` field and updating `CourtBusiness` to handle sequential interaction rendering.

The stacked approach is required for a production content volume. A guaranteed-overflow-routing fallback would eventually hit the same structural limitation when chains start producing multiple follow-ups in a single season. Build the correct structure now.

---

## Phase 3: Notification Handling Wiring

### Current state

The data layer and classification layer are ready:

- `EventDefinition.classification` already supports `'notification'` (2 events use it: `evt_commoner_harvest_festival` and `evt_annual_state_assessment`)
- `eventClassifier.ts` already correctly partitions events, returning a `notificationEvents` array
- `petitionCardGenerator.ts` already exports `NotificationCardData` and `generateNotificationCards()`

What is NOT wired:

- `InteractionType` enum has no `Notification` member
- `MonthAllocation` has no `notificationCards` field
- `cardDistributor.ts` does not distribute notification cards
- `CourtBusiness.tsx` has no notification rendering path
- `decisionMapper.ts` has no notification mapping (notifications produce an `acknowledge` action, not a grant/deny decision)
- `RoundController.tsx` line 174 dumps notification events into `generatePetitionCards()` as a workaround

### Required changes

1. Add `Notification` to the `InteractionType` enum in `src/engine/types.ts`
2. Add `notificationCards: NotificationCardData[]` to `MonthAllocation` in `src/ui/types.ts`
3. In `RoundController.tsx`, call `generateNotificationCards(notificationEvents)` separately instead of merging notifications into the petition generator
4. In `cardDistributor.ts`, distribute notification cards (they can share a month with petitions or occupy quiet months)
5. In `CourtBusiness.tsx`, add a notification rendering path that presents an acknowledge-only card without grant/deny controls
6. In `decisionMapper.ts`, map notification acknowledgments to the event's single `acknowledge` choice

### Implementation detail

A lightweight notification card component renders the event title and body with a single "Acknowledged" button and no effect-preview strip. Notification cards are visually distinct from petition cards — they use a neutral/informational frame rather than the petition's request-and-response framing.

---

## Phase 4: Petition Choice-Model Verification

> **Status: Largely complete.** The petition UI was overhauled in a prior commit to support arbitrary choice counts via tap-to-select response cards. The binary swipe constraint no longer exists.

### What was done

- `PetitionPhase.tsx` now renders response cards from `allChoices` with the same select-then-confirm pattern as `CrisisPhase`
- The pipeline passes `{ cardId: string; choiceId: string }` (not `granted: boolean`) through `CourtBusiness` → `MonthDecision` → `decisionMapper` → engine
- `PetitionChoiceData` includes a `title` field populated from `EVENT_TEXT`
- `summaryGenerator` and `SummaryPhase` use `choiceId` directly instead of boolean grant/deny logic

### Remaining work for this phase

- Verify all 3 existing `FOLLOW_UP_POOL` events render correctly through the petition path with all choices visible (see Phase 7)
- Confirm that `generatePetitionCards()` correctly populates `allChoices` for events with 2, 3, and 4+ choices
- Events with 1 choice (notifications) should still route through the notification path, not petitions (see Phase 3)

---

## Phase 5: Multi-Crisis Summary Cleanup

The current `generateMonthlySummaryData()` in `summaryGenerator.ts` is single-crisis-oriented.

### Current behavior

Line 167: `crisisData.responses.find((r) => r.id === crisisDecisions[0].choiceId)` — only the first crisis decision is summarized, using only the primary `crisisData` object. Additional crises placed in months 2 or 3 via `additionalCrises` have no corresponding crisis data passed to the summary generator.

### Required change

When multiple crisis events surface in the same season:

- each crisis decision maps against its own source event data (not all against `crisisData`)
- summaries reflect all surfaced crises independently
- metadata such as slot cost, action identity, and text source are derived from the correct source for each crisis

The `mapMonthDecisionsToActions()` function in `decisionMapper.ts` has the same issue: it uses the single `crisisData` parameter for all crisis-type decisions (line 96-97).

This is a correctness pass. The production content set will regularly produce seasons with 2+ crises from converging follow-up chains.

---

## Phase 6: Condition Vocabulary Expansion

### Already supported

The `EventTriggerCondition` type in `event-engine.ts` (lines 28-65) already covers:

- `treasury_below` / `treasury_above`
- `food_below` / `food_above`
- `stability_below` / `stability_above`
- `class_satisfaction_below` / `class_satisfaction_above` (with `classTarget`)
- `faith_below` / `faith_above`
- `heterodoxy_above`
- `schism_active`
- `military_readiness_below`
- `season_is`
- `turn_range`
- `random_chance`
- `consequence_tag_present` / `consequence_tag_absent` (with optional `minTurnsSinceConsequence`)
- `always`

### New condition types required for production content

Add the following to support the full chain set:

#### Neighbor relationship conditions

```ts
{ type: 'neighbor_relationship_above'; neighborId: string; threshold: number }
{ type: 'neighbor_relationship_below'; neighborId: string; threshold: number }
```

Required for diplomacy chains where follow-up outcomes depend on whether a neighbor's disposition has improved or deteriorated since the root event.

#### Recent neighbor action condition

```ts
{ type: 'neighbor_action_recent'; neighborId: string; actionType: string; withinTurns: number }
```

Required for reactive chains where a follow-up should only fire if a specific neighbor took a recent action (e.g. border raid, trade offer, alliance proposal).

#### Population threshold conditions

```ts
{ type: 'population_above'; threshold: number }
{ type: 'population_below'; threshold: number }
```

Required for growth/decline chains where follow-up consequences scale with population pressure.

#### Multiple condition composition

Confirm that `stateConditions` is evaluated as an AND-list (all conditions must pass). If OR-semantics are needed for specific chains, add:

```ts
{ type: 'any_of'; conditions: EventTriggerCondition[] }
```

This enables a single follow-up to gate on "treasury is low OR food is low" without requiring separate sibling branches for each.

### Do not add

- broad historical query language over past turns
- generalized pattern matching over all world events
- complex boolean scripting DSL beyond AND-lists and `any_of`

The condition vocabulary should remain readable and debuggable.

---

## Phase 7: Existing FOLLOW_UP_POOL Triage

The existing 3 follow-up events must be resolved before the production content set is authored:

### `evt_merchant_permanent_concessions`

3 choices, Notable severity → routes as petition → all 3 choices now reachable via tap-to-select response cards.

**Resolution:** Safe as-is. The petition UI now supports 3+ choices. Verify that all 3 response cards render correctly in the petition phase and that the selected choiceId flows through to the engine. Add to the integration test set.

### `evt_underground_heretical_movement`

3 choices, Serious severity → routes as crisis → all 3 choices reachable.

**Resolution:** Safe as-is. No changes needed. Verify that crisis routing is stable and add it to the integration test set.

### `evt_equipment_failure_field`

3 choices, Critical severity → routes as crisis → all 3 choices reachable.

**Resolution:** Safe as-is. No changes needed. Verify that crisis routing is stable and add it to the integration test set.

---

## Phase 8: Production Content Set

This is the core authored content that makes follow-up branching a real gameplay feature. The content set must be large enough to produce varied playthroughs and exercise all engine capabilities.

### Scale targets

- **12–15 root chain families** (each a thematic cluster of cause-and-consequence)
- **60–80 total follow-up event definitions** across all chains
- **max chain depth: 4** (root → follow-up → follow-up → terminal) — deep enough for meaningful arcs, shallow enough to reason about
- every chain family must include at least one exclusive branch group
- at least 3 chain families must include retry-gated branches
- the full set must produce a mix of crisis, petition, and notification outcomes

### Chain family specifications

Each chain family below is specified with its root trigger, branch structure, condition vocabulary, and terminal outcomes. Definitions, effects, and text entries are authored for all events.

---

#### Chain 1: Grain Crisis

**Theme:** A poor harvest triggers cascading food-security decisions with consequences that branch based on whether the kingdom is rich, poor, or unstable.

**Root:** `evt_grain_crisis_root`
- Classification: Crisis (Serious)
- Trigger conditions: `food_below: 40`, `season_is: autumn`
- Choices:
  1. Ration strictly (−food consumption, −commoner satisfaction, +stability short-term)
  2. Import grain at high cost (−treasury, +food, −merchant satisfaction if treasury drops low)
  3. Seize noble estates' reserves (−noble satisfaction, +food, +commoner satisfaction, triggers noble resentment branch)

**Branch A — Rationing Aftermath** (`excl_grain_ration`)
- `evt_grain_ration_compliance` — delay 2, conditions: `stability_above: 50` — notification: the rationing holds, minor unrest fades. Terminal.
- `evt_grain_ration_riots` — delay 2, conditions: `stability_below: 30` — crisis (Serious): riots break out in the market district. 3 choices (suppress, negotiate, distribute reserves). Terminal.
- `evt_grain_ration_black_market` — delay 3, conditions: `treasury_above: 50`, `stability_below: 50` — petition (binary): merchants petition to legalize a grey market. Terminal.

**Branch B — Import Debt** (`excl_grain_import`)
- `evt_grain_import_merchant_leverage` — delay 2, conditions: `treasury_below: 30` — crisis (Serious): the importing merchants demand permanent tariff exemptions. 3 choices. Terminal.
- `evt_grain_import_gratitude` — delay 2, conditions: `treasury_above: 50` — notification: the grain arrives, the people are fed, the merchants are paid. Terminal.
- `evt_grain_import_spoiled` — delay 3, conditions: `food_below: 30`, probability: 0.4 — crisis (Critical): half the imported grain was spoiled. Emergency choices. Terminal.

**Branch C — Noble Seizure** (`excl_grain_seizure`)
- `evt_grain_noble_plot` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 30 }` — crisis (Serious): the nobility is organizing a coordinated resistance. 3 choices.
- `evt_grain_noble_acceptance` — delay 2, conditions: `class_satisfaction_above: { classTarget: 'nobility', threshold: 50 }` — notification: the nobles grumble but accept. Terminal.
  - From `evt_grain_noble_plot` choice "negotiate concessions":
    - `evt_grain_noble_concessions_result` — delay 1, conditions: `always` — notification: terms are set. Terminal.
  - From `evt_grain_noble_plot` choice "arrest the ringleaders":
    - `evt_grain_noble_uprising` — delay 2, conditions: `military_readiness_below: 40`, probability: 0.6 — crisis (Critical): armed uprising in the provinces. Terminal.
    - `evt_grain_noble_cowed` — delay 2, conditions: `military_readiness_below: 40` inverted (readiness ≥ 40) — notification: the arrests succeed, the nobility falls in line. Terminal.

**Total events in chain: 12** (1 root + 11 follow-ups)

---

#### Chain 2: Border Incursion

**Theme:** A neighboring kingdom's raiders cross the border. The player's response determines whether this escalates into a diplomatic crisis, a military campaign, or a negotiated settlement.

**Root:** `evt_border_incursion_root`
- Classification: Crisis (Critical)
- Trigger conditions: `neighbor_relationship_below: { neighborId: 'rival_north', threshold: 30 }`, `turn_range: { min: 6 }`
- Choices:
  1. Retaliate with force (−military readiness, +stability, triggers military campaign branch)
  2. Send a diplomatic envoy (−treasury, triggers diplomacy branch)
  3. Fortify and absorb the losses (−food, −commoner satisfaction, triggers fortification branch)

**Branch A — Military Campaign** (`excl_border_military`)
- `evt_border_campaign_victory` — delay 3, conditions: `military_readiness_above: 60` — notification: the campaign succeeds. +neighbor relationship, +stability. Terminal.
- `evt_border_campaign_stalemate` — delay 3, conditions: `military_readiness_below: 60`, `stability_above: 30` — petition (binary): the generals petition for more resources or a withdrawal. Terminal.
- `evt_border_campaign_defeat` — delay 3, conditions: `military_readiness_below: 40`, `stability_below: 30` — crisis (Critical): the campaign has failed and the enemy is advancing. 3 choices. Terminal.

**Branch B — Diplomacy** (`excl_border_diplomacy`)
- `evt_border_envoy_success` — delay 2, conditions: `treasury_above: 40`, probability: 0.6 — notification: the envoy secures a ceasefire. Terminal.
- `evt_border_envoy_hostage` — delay 2, conditions: `treasury_below: 30`, probability: 0.5 — crisis (Serious): the envoy has been taken hostage. 3 choices. Terminal.
- `evt_border_envoy_terms` — delay 3, conditions: `treasury_above: 30` — petition (binary): the neighbor offers unfavorable but stable peace terms. Terminal.

**Branch C — Fortification** (`excl_border_fortify`)
- `evt_border_fortify_holds` — delay 2, conditions: `food_above: 50` — notification: the border holds, losses are manageable. Terminal.
- `evt_border_fortify_famine` — delay 3, conditions: `food_below: 30` — crisis (Serious): the absorbed losses have triggered food shortages. 3 choices. Terminal.
- `evt_border_fortify_resentment` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 30 }` — petition (binary): commoners near the border petition for compensation. Terminal.

**Total events in chain: 10** (1 root + 9 follow-ups)

---

#### Chain 3: Faith Schism

**Theme:** A theological dispute within the kingdom's religious institutions grows into a factional crisis. The player must navigate between orthodoxy, reform, and suppression.

**Root:** `evt_faith_schism_root`
- Classification: Crisis (Serious)
- Trigger conditions: `heterodoxy_above: 40`, `faith_below: 50`
- Choices:
  1. Back the orthodox faction (−heterodoxy, −commoner satisfaction, +clergy satisfaction)
  2. Support the reformists (+heterodoxy, +commoner satisfaction, −clergy satisfaction, −faith)
  3. Suppress all factions (+stability short-term, −faith, −all class satisfaction)

**Branch A — Orthodox Victory** (`excl_schism_orthodox`)
- `evt_schism_inquisition` — delay 2, conditions: `heterodoxy_above: 30` — crisis (Serious): the orthodox faction demands an inquisition. 3 choices. Terminal.
- `evt_schism_orthodox_peace` — delay 2, conditions: `heterodoxy_above: 30` inverted — notification: the theological dispute settles. Terminal.
- `evt_schism_orthodox_overreach` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 25 }` — petition (binary): commoners complain about religious oppression. Terminal.

**Branch B — Reform Movement** (`excl_schism_reform`)
- `evt_schism_reform_growth` — delay 2, conditions: `faith_above: 40` — notification: the reform movement integrates peacefully. Terminal.
- `evt_schism_reform_backlash` — delay 3, conditions: `faith_below: 30` — crisis (Serious): the clergy revolts against the reforms. 3 choices. Terminal.
- `evt_schism_reform_schism_deep` — delay 3, conditions: `schism_active` — crisis (Critical): the kingdom now has two competing religious authorities. 3 choices. Terminal.

**Branch C — Suppression Consequences** (`excl_schism_suppress`)
- `evt_schism_underground_worship` — delay 3, conditions: `stability_below: 40` — crisis (Serious): underground worship cells are discovered. 3 choices.
  - From choice "tolerate quietly": `evt_schism_underground_stable` — delay 2, `always` — notification: an uneasy equilibrium. Terminal.
  - From choice "crack down": `evt_schism_underground_martyr` — delay 1, probability: 0.5 — crisis (Critical): the crackdown creates a martyr figure. Terminal.
- `evt_schism_suppress_calm` — delay 2, conditions: `stability_above: 60` — notification: the suppression worked. Religious discourse is muted. Terminal.

**Total events in chain: 11** (1 root + 10 follow-ups)

---

#### Chain 4: Trade Route Disruption

**Theme:** A major trade route is threatened — by bandits, by a neighbor's toll demands, or by natural disaster. Economic consequences branch based on the kingdom's financial resilience.

**Root:** `evt_trade_route_disruption_root`
- Classification: Crisis (Serious)
- Trigger conditions: `treasury_above: 20`, `turn_range: { min: 4 }`
- Choices:
  1. Send military escorts (−military readiness, −treasury, maintains trade)
  2. Negotiate with the disrupting party (−treasury, uncertain outcome)
  3. Redirect to alternate routes (−efficiency, −merchant satisfaction, slow recovery)

**Branch A — Military Escort** (`excl_trade_military`)
- `evt_trade_escort_success` — delay 2, conditions: `military_readiness_above: 50` — notification: the route is secured. Terminal.
- `evt_trade_escort_ambush` — delay 2, conditions: `military_readiness_below: 40`, probability: 0.5 — crisis (Critical): the escort was ambushed. 3 choices. Terminal.
- `evt_trade_escort_expensive` — delay 3, conditions: `treasury_below: 30` — petition (binary): merchants petition for the crown to subsidize ongoing escort costs. Terminal.

**Branch B — Negotiation** (`excl_trade_negotiate`)
- `evt_trade_negotiate_deal` — delay 2, conditions: `treasury_above: 40` — petition (binary): the disrupting party offers a toll arrangement. Accept or refuse. Terminal.
- `evt_trade_negotiate_betrayal` — delay 3, conditions: `treasury_below: 30`, probability: 0.4 — crisis (Serious): the deal was a ruse and goods have been seized. 3 choices. Terminal.
- `evt_trade_negotiate_alliance` — delay 3, conditions: `stability_above: 50`, `treasury_above: 50` — notification: the negotiation leads to a lasting arrangement. Terminal.

**Branch C — Alternate Routes** (`excl_trade_redirect`)
- `evt_trade_redirect_slow_recovery` — delay 3, conditions: `always` — notification: the alternate routes stabilize, but at reduced capacity. Terminal.
- `evt_trade_redirect_opportunity` — delay 3, conditions: `treasury_above: 40`, probability: 0.3 — petition (binary): a merchant guild proposes investing in the new route permanently. Terminal.

**Total events in chain: 9** (1 root + 8 follow-ups)

---

#### Chain 5: Plague Outbreak

**Theme:** Disease strikes the kingdom. The player's response determines whether it is contained, spreads, or mutates into a political crisis about class-based treatment.

**Root:** `evt_plague_outbreak_root`
- Classification: Crisis (Critical)
- Trigger conditions: `population_above: 500`, `food_below: 50`, `season_is: summer`
- Choices:
  1. Quarantine affected districts (−commoner satisfaction, −treasury, +containment)
  2. Prioritize treating the nobility (−commoner satisfaction dramatically, +noble satisfaction, −stability)
  3. Open the royal stores for treatment of all (+commoner satisfaction, −treasury heavily, −noble satisfaction)

**Branch A — Quarantine** (`excl_plague_quarantine`)
- `evt_plague_quarantine_holds` — delay 2, conditions: `stability_above: 40`, `food_above: 30` — notification: the quarantine holds. Casualties are limited. Terminal.
- `evt_plague_quarantine_breaks` — delay 2, conditions: `stability_below: 30` — crisis (Critical): the quarantine has collapsed. 3 choices. Terminal.
- `evt_plague_quarantine_unrest` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 25 }` — petition (binary): quarantined districts demand compensation. Terminal.

**Branch B — Noble Treatment** (`excl_plague_noble`)
- `evt_plague_class_anger` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 20 }` — crisis (Critical): class riots over preferential treatment. 3 choices. Terminal.
- `evt_plague_noble_saved` — delay 2, conditions: `class_satisfaction_above: { classTarget: 'commoners', threshold: 30 }` — notification: the nobility is treated, commoners endure. Terminal.
- `evt_plague_noble_spread` — delay 3, conditions: `population_below: 400`, probability: 0.4 — crisis (Serious): the untreated commoner population has become a second wave vector. Terminal.

**Branch C — Open Stores** (`excl_plague_open`)
- `evt_plague_recovery` — delay 3, conditions: `treasury_above: 20` — notification: the kingdom recovers, weakened but united. Terminal.
- `evt_plague_bankruptcy` — delay 2, conditions: `treasury_below: 15` — crisis (Serious): the treasury is depleted. 3 choices. Terminal.
- `evt_plague_gratitude` — delay 3, conditions: `class_satisfaction_above: { classTarget: 'commoners', threshold: 50 }`, probability: 0.5 — notification: the commoners rally to support the crown. +stability. Terminal.

**Total events in chain: 10** (1 root + 9 follow-ups)

---

#### Chain 6: Military Mutiny

**Theme:** Unpaid or overworked soldiers begin to organize. The player must choose between appeasement, discipline, and reform.

**Root:** `evt_military_mutiny_root`
- Classification: Crisis (Critical)
- Trigger conditions: `military_readiness_below: 30`, `treasury_below: 40`
- Choices:
  1. Pay the soldiers' back wages immediately (−treasury heavily)
  2. Promise reform and request patience (−military readiness further, triggers trust branch)
  3. Execute the ringleaders (−military readiness, +stability short-term, triggers fear/loyalty branch)

**Branch A — Payment** (`excl_mutiny_pay`)
- `evt_mutiny_pay_loyalty` — delay 1, conditions: `treasury_above: 20` — notification: the soldiers return to duty. Terminal.
- `evt_mutiny_pay_bankrupt` — delay 2, conditions: `treasury_below: 10` — crisis (Serious): the payment has emptied the treasury. 3 choices. Terminal.

**Branch B — Reform Promise** (`excl_mutiny_reform`)
- `evt_mutiny_reform_trust` — delay 3, conditions: `stability_above: 40`, maxStateRetries: 5 — notification: the reforms materialize, trust is restored. Terminal.
- `evt_mutiny_reform_betrayal` — delay 3, conditions: `stability_below: 30` — crisis (Critical): the soldiers feel betrayed and march on the capital. 3 choices. Terminal.
- `evt_mutiny_reform_desertion` — delay 2, conditions: `military_readiness_below: 20`, probability: 0.5 — notification: desertion rates climb. −military readiness. Terminal.

**Branch C — Execution** (`excl_mutiny_execute`)
- `evt_mutiny_execute_fear` — delay 1, conditions: `stability_above: 40` — notification: the army is cowed. Discipline returns, morale does not. Terminal.
- `evt_mutiny_execute_revenge` — delay 3, conditions: `stability_below: 30`, probability: 0.4 — crisis (Critical): loyalists of the executed soldiers sabotage a key fortification. Terminal.
- `evt_mutiny_execute_loyalty_split` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 30 }` — petition (binary): commoner-born soldiers petition for amnesty for the families of the executed. Terminal.

**Total events in chain: 9** (1 root + 8 follow-ups)

---

#### Chain 7: Merchant Guild Power Play

**Theme:** The merchant guild demands formal political representation. The player must decide how much institutional power to share.

**Root:** `evt_merchant_guild_demands_root`
- Classification: Crisis (Serious)
- Trigger conditions: `class_satisfaction_below: { classTarget: 'merchants', threshold: 35 }`, `treasury_above: 30`
- Choices:
  1. Grant a trade council seat (−noble satisfaction, +merchant satisfaction, institutional change)
  2. Offer tax concessions instead (−treasury revenue, +merchant satisfaction, no structural change)
  3. Refuse and reassert royal authority (+noble satisfaction, −merchant satisfaction, −treasury from trade disruption)

**Branch A — Council Seat** (`excl_merchant_council`)
- `evt_merchant_council_effective` — delay 3, conditions: `stability_above: 40` — notification: the trade council produces useful policy. Terminal.
- `evt_merchant_council_overreach` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 25 }` — crisis (Serious): the nobility demands the council be dissolved. 3 choices. Terminal.
- `evt_merchant_council_corruption` — delay 4, conditions: `treasury_below: 30`, probability: 0.3, maxStateRetries: 5 — petition (binary): reports of council corruption surface. Investigate or ignore. Terminal.

**Branch B — Tax Concessions** (`excl_merchant_tax`)
- `evt_merchant_tax_satisfied` — delay 2, conditions: `treasury_above: 40` — notification: the concessions are absorbed without crisis. Terminal.
- `evt_merchant_tax_shortfall` — delay 3, conditions: `treasury_below: 25` — crisis (Serious): the tax concessions have created a revenue shortfall. 3 choices. Terminal.

**Branch C — Refusal** (`excl_merchant_refuse`)
- `evt_merchant_boycott` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'merchants', threshold: 20 }` — crisis (Serious): the merchant guild organizes a trade boycott. 3 choices. Terminal.
- `evt_merchant_grudging_acceptance` — delay 2, conditions: `class_satisfaction_above: { classTarget: 'merchants', threshold: 30 }` — notification: the guild backs down. Terminal.

**Total events in chain: 8** (1 root + 7 follow-ups)

---

#### Chain 8: Succession Anxiety

**Theme:** Rumors about the stability of the royal succession trigger factional positioning. Different power centers begin to maneuver.

**Root:** `evt_succession_anxiety_root`
- Classification: Crisis (Serious)
- Trigger conditions: `stability_below: 40`, `turn_range: { min: 10 }`
- Choices:
  1. Name an heir publicly (+stability, −flexibility, triggers legitimacy branch)
  2. Suppress the rumors (−faith, −stability short-term, triggers underground branch)
  3. Convene the great lords to discuss succession (−noble satisfaction, triggers council branch)

**Branch A — Named Heir** (`excl_succession_heir`)
- `evt_succession_heir_accepted` — delay 2, conditions: `stability_above: 50` — notification: the succession is settled. Terminal.
- `evt_succession_heir_challenged` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 30 }` — crisis (Serious): a rival claimant emerges from the nobility. 3 choices. Terminal.
- `evt_succession_heir_popular` — delay 2, conditions: `class_satisfaction_above: { classTarget: 'commoners', threshold: 50 }`, probability: 0.4 — notification: the named heir is popular with the people. +stability. Terminal.

**Branch B — Suppression** (`excl_succession_suppress`)
- `evt_succession_whispers` — delay 3, conditions: `stability_below: 35` — crisis (Serious): the suppression has amplified the rumors. 3 choices. Terminal.
- `evt_succession_suppress_works` — delay 2, conditions: `stability_above: 45` — notification: the rumors die down. Terminal.

**Branch C — Council** (`excl_succession_council`)
- `evt_succession_council_agreement` — delay 3, conditions: `class_satisfaction_above: { classTarget: 'nobility', threshold: 40 }` — notification: the lords agree on a succession protocol. Terminal.
- `evt_succession_council_deadlock` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 30 }` — crisis (Serious): the council is deadlocked and factions are forming. 3 choices. Terminal.
- `evt_succession_council_proposal` — delay 2, conditions: `always` — petition (binary): a senior lord proposes a compromise candidate. Terminal.

**Total events in chain: 9** (1 root + 8 follow-ups)

---

#### Chain 9: Infrastructure Decay

**Theme:** Roads, bridges, and public works are deteriorating. The player must decide where to invest limited resources.

**Root:** `evt_infrastructure_decay_root`
- Classification: Petition (binary)
- Trigger conditions: `treasury_below: 50`, `turn_range: { min: 5 }`
- Choices:
  1. Fund emergency repairs (−treasury, prevents worst outcomes)
  2. Defer maintenance (saves treasury, triggers decay branch)

**Branch A — Repairs** (`excl_infra_repair`)
- `evt_infra_repair_success` — delay 2, conditions: `treasury_above: 20` — notification: repairs are completed. Terminal.
- `evt_infra_repair_cost_overrun` — delay 3, conditions: `treasury_below: 15` — petition (binary): the project has gone over budget. Approve additional funds or cut scope. Terminal.

**Branch B — Deferred** (`excl_infra_defer`)
- `evt_infra_bridge_collapse` — delay 3, conditions: `food_below: 40`, probability: 0.5 — crisis (Critical): a key bridge has collapsed, disrupting food supply lines. 3 choices. Terminal.
- `evt_infra_road_decay` — delay 2, conditions: `always` — notification: trade slows as roads deteriorate. −treasury revenue. Terminal.
- `evt_infra_commoner_petition` — delay 3, conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 30 }` — petition (binary): commoners petition for basic road repairs. Terminal.

**Total events in chain: 6** (1 root + 5 follow-ups)

---

#### Chain 10: Foreign Ambassador

**Theme:** A foreign power sends an ambassador with a proposal. The nature of the proposal and the consequences depend on the kingdom's current posture.

**Root:** `evt_foreign_ambassador_root`
- Classification: Crisis (Serious)
- Trigger conditions: `turn_range: { min: 8 }`, `neighbor_relationship_below: { neighborId: 'empire_south', threshold: 50 }`
- Choices:
  1. Accept the proposal (triggers alliance/dependency branch)
  2. Counter-propose (+diplomatic leverage, triggers negotiation branch)
  3. Reject outright (−neighbor relationship, +noble satisfaction, triggers isolation branch)

**Branch A — Acceptance** (`excl_ambassador_accept`)
- `evt_ambassador_alliance_benefit` — delay 2, conditions: `stability_above: 40` — notification: the alliance provides economic benefits. Terminal.
- `evt_ambassador_dependency` — delay 3, conditions: `treasury_below: 30` — petition (binary): advisors warn the alliance is becoming a dependency. Renegotiate or accept. Terminal.

**Branch B — Counter-Proposal** (`excl_ambassador_counter`)
- `evt_ambassador_counter_accepted` — delay 2, conditions: `treasury_above: 40`, probability: 0.5 — notification: your counter-proposal is accepted. Terminal.
- `evt_ambassador_counter_rejected` — delay 2, conditions: `treasury_below: 30` — crisis (Serious): your counter-proposal is rejected and the ambassador threatens consequences. 3 choices. Terminal.

**Branch C — Rejection** (`excl_ambassador_reject`)
- `evt_ambassador_trade_embargo` — delay 2, conditions: `neighbor_relationship_below: { neighborId: 'empire_south', threshold: 20 }` — crisis (Serious): the foreign power imposes a trade embargo. 3 choices. Terminal.
- `evt_ambassador_respect` — delay 2, conditions: `military_readiness_above: 50` — notification: the rejection is respected. Terminal.

**Total events in chain: 7** (1 root + 6 follow-ups)

---

#### Chain 11: Commoner Uprising

**Theme:** Years of accumulated grievance lead to organized commoner resistance. Distinct from one-off riots — this is a movement.

**Root:** `evt_commoner_uprising_root`
- Classification: Crisis (Critical)
- Trigger conditions: `class_satisfaction_below: { classTarget: 'commoners', threshold: 20 }`, `stability_below: 35`
- Choices:
  1. Meet their demands (+commoner satisfaction, −noble satisfaction, −treasury)
  2. Suppress by force (+stability short-term, −commoner satisfaction further, −faith)
  3. Address root causes with reform (−treasury, slow recovery, triggers reform branch)

**Branch A — Demands Met** (`excl_uprising_demands`)
- `evt_uprising_noble_backlash` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 25 }` — crisis (Serious): the nobility retaliates. 3 choices. Terminal.
- `evt_uprising_peace` — delay 2, conditions: `stability_above: 40` — notification: the demands are met, peace returns. Terminal.

**Branch B — Suppression** (`excl_uprising_suppress`)
- `evt_uprising_guerrilla` — delay 3, conditions: `stability_below: 25`, probability: 0.5 — crisis (Critical): the suppressed movement goes underground and launches guerrilla attacks. 3 choices. Terminal.
- `evt_uprising_crushed` — delay 2, conditions: `military_readiness_above: 50` — notification: the uprising is crushed. −commoner satisfaction permanently. Terminal.

**Branch C — Reform** (`excl_uprising_reform`)
- `evt_uprising_reform_progress` — delay 3, conditions: `treasury_above: 25`, maxStateRetries: 5 — notification: reforms are taking effect. Slow recovery in satisfaction. Terminal.
- `evt_uprising_reform_too_slow` — delay 3, conditions: `treasury_below: 20` — petition (binary): reform supporters petition for faster action. Terminal.
- `evt_uprising_reform_resistance` — delay 2, conditions: `class_satisfaction_below: { classTarget: 'nobility', threshold: 30 }` — crisis (Serious): the nobility resists the reforms. 3 choices. Terminal.

**Total events in chain: 8** (1 root + 7 follow-ups)

---

#### Chain 12: Royal Treasury Audit

**Theme:** A routine audit reveals irregularities. The player must decide how deep to investigate and who to hold accountable.

**Root:** `evt_treasury_audit_root`
- Classification: Petition (binary)
- Trigger conditions: `treasury_below: 35`, `turn_range: { min: 6 }`
- Choices:
  1. Conduct a full investigation (−treasury, triggers investigation branch)
  2. Accept the report at face value (no cost, triggers cover-up branch)

**Branch A — Investigation** (`excl_audit_investigate`)
- `evt_audit_corruption_found` — delay 2, conditions: `always` — crisis (Serious): the investigation reveals corruption among the court officials. 3 choices. Terminal.
- `evt_audit_clean` — delay 2, conditions: `stability_above: 50`, probability: 0.3 — notification: the books are clean. Terminal.

**Branch B — Cover-Up** (`excl_audit_coverup`)
- `evt_audit_embezzlement` — delay 3, conditions: `treasury_below: 25` — crisis (Serious): the embezzlement continues and worsens. 3 choices. Terminal.
- `evt_audit_whistleblower` — delay 3, conditions: `class_satisfaction_above: { classTarget: 'commoners', threshold: 40 }`, probability: 0.4 — petition (binary): a court clerk brings evidence of fraud. Protect them or silence them. Terminal.
- `evt_audit_quiet` — delay 2, conditions: `stability_above: 50` — notification: the irregularities are absorbed. Terminal.

**Total events in chain: 6** (1 root + 5 follow-ups)

---

### Content production summary

| Chain | Root | Follow-ups | Total | Crises | Petitions | Notifications |
|-------|------|------------|-------|--------|-----------|---------------|
| Grain Crisis | 1 | 11 | 12 | 5 | 2 | 5 |
| Border Incursion | 1 | 9 | 10 | 3 | 2 | 5 |
| Faith Schism | 1 | 10 | 11 | 4 | 2 | 5 |
| Trade Route | 1 | 8 | 9 | 3 | 2 | 4 |
| Plague Outbreak | 1 | 9 | 10 | 4 | 1 | 5 |
| Military Mutiny | 1 | 8 | 9 | 3 | 1 | 5 |
| Merchant Guild | 1 | 7 | 8 | 3 | 2 | 3 |
| Succession | 1 | 8 | 9 | 3 | 1 | 5 |
| Infrastructure | 1 | 5 | 6 | 1 | 3 | 2 |
| Ambassador | 1 | 6 | 7 | 2 | 1 | 4 |
| Uprising | 1 | 7 | 8 | 4 | 1 | 3 |
| Treasury Audit | 1 | 5 | 6 | 2 | 2 | 2 |
| **Totals** | **12** | **93** | **105** | **37** | **20** | **48** |

This produces 105 total event definitions across 12 chain families, with a balanced distribution across all three interaction types.

---

## Authoring Rules

These rules apply to all content in the production set.

### Required

- binary petition follow-ups only (exactly 2 choices) — crisis path supports 3+ choices
- notifications must route through the notification render path, never through the petition generator
- max chain depth: 4 events including root
- sibling branches must use `exclusiveGroupId`
- state-gated branches must use mutually-exclusive conditions where possible
- every chain must have at least one guaranteed terminal (a branch with `conditions: always` or probability `1.0`) so that the chain cannot silently dead-end
- every follow-up must specify `delayTurns ≥ 1` (no same-turn follow-ups)
- authored `maxStateRetries` must be justified (default 3 is sufficient for most chains)

### Prohibited

- 3-choice petitions (until petition UI upgrade)
- chains that depend on hidden overflow behavior
- chains with more than 4 authored follow-up depth
- follow-ups with `delayTurns: 0`
- exclusive groups that span multiple root events (each root manages its own exclusivity tree)

---

## Acceptance Criteria

This implementation is complete when all of the following are true.

### Engine

- due follow-ups evaluate fire-time `stateConditions` using the existing `evaluateCondition()` helper
- unmet branches retry up to the configured limit (default 3, overridable via `maxStateRetries`)
- probability is rolled only after state eligibility passes
- sibling branches in the same exclusive group cannot both surface across different turns
- dedupe uses the composite key (`sourceEventId + triggerChoiceId + followUpDefinitionId`) and no longer blocks unrelated branches incorrectly
- `any_of` condition composition is implemented and tested

### Delivery

- surfaced petitions cannot be silently lost due to month interaction collisions
- surfaced notifications render as acknowledge-only cards, not as grant/deny petition cards
- `InteractionType.Notification` exists and is wired through `MonthAllocation`, `CourtBusiness`, and `decisionMapper`
- multiple crises in one season are carried through mapping and summary correctly (each against its own source data)
- per-month stacked interactions are implemented (primary + petitions + notifications)

### Content integrity

- binary petition rule is enforced (development assertion)
- existing FOLLOW_UP_POOL events are triaged (severity adjustments applied)
- all 12 chain families are authored with definitions, effects, and text entries
- every chain has at least one guaranteed terminal path
- every exclusive group is correctly configured

### Condition vocabulary

- `neighbor_relationship_above` / `neighbor_relationship_below` implemented and tested
- `neighbor_action_recent` implemented and tested
- `population_above` / `population_below` implemented and tested
- `any_of` composition implemented and tested

### Testing

- automated coverage exists for retry, exclusivity, dedupe, and `any_of` behavior
- at least one integration test covers month delivery under mixed petition/crisis/notification load
- at least one integration test covers notification rendering as acknowledge-only
- at least one integration test covers per-month stacked interactions
- at least one integration test covers multi-crisis summary independence

---

## Test Matrix

### Engine unit tests

1. due follow-up with unmet state conditions retries and increments `stateRetries`
2. due follow-up with unmet state conditions expires after max retries (default 3)
3. due follow-up with custom `maxStateRetries` expires after that limit
4. due follow-up with met state conditions rolls probability and surfaces
5. state eligibility is evaluated before probability (mock both to verify order)
6. two sibling branches share exclusive group and only one can surface
7. winning branch cancels all siblings in the same exclusive group within `processDueFollowUps()`
8. same follow-up definition from unrelated sources does not dedupe incorrectly
9. same follow-up definition from same source + choice DOES dedupe correctly
10. `any_of` condition passes when at least one sub-condition is met
11. `any_of` condition fails when no sub-conditions are met
12. `neighbor_relationship_above` evaluates correctly against game state
13. `neighbor_relationship_below` evaluates correctly against game state
14. `neighbor_action_recent` evaluates correctly with `withinTurns` window
15. `population_above` / `population_below` evaluate correctly

### Integration tests

16. petition overflow in a crisis-heavy season still renders deterministically
17. notification surfaces as acknowledgment-only, not binary decision
18. two crises in one season map and summarize independently (each with correct source data)
19. binary petition authoring violation triggers development assertion
20. per-month stacked interactions render in correct order (primary → petitions → notifications)
21. a full Grain Crisis chain produces correct branch from root through terminal
22. a full Border Incursion chain with neighbor conditions produces correct branch
23. a season with crisis + petition + notification from converging chains renders all three

### Manual QA scenarios

24. root decision schedules two alternate branches and only one ever appears
25. a branch waits multiple turns for state eligibility, then surfaces successfully
26. a season with crisis + petition + notification does not lose content
27. a deep chain (depth 4) resolves correctly through all levels
28. a chain with `maxStateRetries: 0` expires immediately when conditions are unmet
29. two chains from different roots converge on the same season without data corruption
30. the full content set does not produce duplicate events across a 20-turn playthrough

---

## File Targets

These are confirmed touch points in the current repo.

### Engine / typing

| File | Change |
|------|--------|
| `src/engine/types.ts` | Extend `PendingFollowUp` (line 796). Add `Notification` to `InteractionType` (line 873). |
| `src/engine/events/event-engine.ts` | Extend `followUpEvents` shape (line 138). Add `neighbor_relationship_above`, `neighbor_relationship_below`, `neighbor_action_recent`, `population_above`, `population_below`, `any_of` to `EventTriggerCondition`. Add `maxStateRetries` to follow-up definition. Export `evaluateCondition` if not already exported. |
| `src/engine/events/follow-up-tracker.ts` | Rewrite `processDueFollowUps()` for state conditions, retry with `maxStateRetries`, exclusivity. Widen dedupe in `scheduleFollowUps()`. |
| `src/engine/resolution/turn-resolution.ts` | Confirm `processDueFollowUps()` call site (line 1290) passes updated args. |

### Delivery / bridge

| File | Change |
|------|--------|
| `src/bridge/cardDistributor.ts` | Handle notification card distribution. Implement per-month stacked interactions. Fix crisis/petition overflow. |
| `src/bridge/decisionMapper.ts` | Add notification acknowledgment mapping. Fix multi-crisis source data mapping. |
| `src/bridge/summaryGenerator.ts` | Fix `generateMonthlySummaryData()` to handle multiple crises independently (line 167). |
| `src/bridge/eventClassifier.ts` | No changes needed — already partitions correctly. |
| `src/bridge/petitionCardGenerator.ts` | Add development assertion for binary choice rule. No structural changes needed (`NotificationCardData` and `generateNotificationCards()` already exist). |

### UI

| File | Change |
|------|--------|
| `src/ui/types.ts` | Add `notificationCards` to `MonthAllocation`. Add `'notification'` to `CardFamily`. |
| `src/ui/RoundController.tsx` | Stop merging notifications into petition generator (line 174). Call `generateNotificationCards()` separately. Pass notification data through month allocations. |
| `src/ui/phases/CourtBusiness.tsx` | Add notification rendering path (acknowledge-only card, single button). Implement per-month stacked interaction rendering (primary → petitions → notifications). |

### Content / data

| File | Change |
|------|--------|
| `src/data/events/index.ts` | Triage existing FOLLOW_UP_POOL events. Add all 105 event definitions across 12 chain families with `stateConditions`, `exclusiveGroupId`, and `maxStateRetries` where applicable. |
| `src/data/events/effects.ts` | Add effect entries for all new follow-up events (105 definitions). |
| `src/data/text/events.ts` | Add text entries for all new follow-up events (105 definitions). |

---

## Implementation Tracks

### Track A: Mechanical correctness

Implement:

- `stateConditions` on `PendingFollowUp` and authored follow-up shape
- `stateRetries` and retry logic with `maxStateRetries` override
- `exclusiveGroupId` and cancellation
- composite dedupe key
- due-processing order update (state before probability)

Test before proceeding.

### Track B: Delivery correctness

Implement:

- notification pipeline wiring (`InteractionType.Notification` → `MonthAllocation` → `CourtBusiness` → `decisionMapper`)
- per-month stacked interaction rendering in `CourtBusiness`
- safe petition overflow handling in `cardDistributor.ts`
- multi-crisis summary and decision-mapper fix
- development assertion for binary petition rule

Test before proceeding.

### Track C: Condition vocabulary expansion

Implement:

- `neighbor_relationship_above` / `neighbor_relationship_below`
- `neighbor_action_recent`
- `population_above` / `population_below`
- `any_of` composition

Can run in parallel with Track B. Must be complete before Track D.

### Track D: Existing content triage

- elevate `evt_merchant_permanent_concessions` to Serious severity
- verify crisis routing for `evt_underground_heretical_movement` and `evt_equipment_failure_field`
- add integration tests for all three existing follow-up events

### Track E: Production content authoring

Author the full 12-chain content set:

- definitions, effects, and text for all 105 events
- verify every chain's exclusive groups, condition gates, and terminal guarantees
- integration test at least 3 representative chains end-to-end
- manual QA the full set across a 20-turn playthrough

Requires all prior tracks to be complete.

---

## Final Notes

The correct build order for this feature is:

1. make branches real (engine)
2. make surfaced content unlosable (delivery)
3. make the UI tell the truth (notification wiring + stacked interactions)
4. expand the condition language (vocabulary)
5. fix what exists (triage)
6. fill the system with production content (authoring)

Every layer must be correct before the content goes in. The content set is large enough that routing bugs, lost events, or misclassified interactions will produce invisible gameplay defects across hundreds of play paths. The infrastructure earns the right to hold the content.
