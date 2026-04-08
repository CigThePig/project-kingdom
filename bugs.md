# Comprehensive Bug Report: Project Kingdom

> **Audit note (2026-04-08):** Each bug below has been verified against source code.
> Bugs marked `[VERIFIED]` are confirmed real. Bugs dependent on others are noted.
> Three originally-listed bugs were removed as not real issues (see bottom).
> One bug (Storyline Consequence Tag Collision) was fixed and removed.

---

## CRITICAL SEVERITY (Game-Breaking Architecture & State Loss)
*These bugs fundamentally break the core game loop, cause permanent loss of player actions, or make failure/victory states impossible.*

### 1. The "Double-Generate" Event Desync (Broken Event Chains) `[VERIFIED]`
* **Location:** `src/ui/RoundController.tsx:70-78` (in `prepareRound`) vs. `src/engine/resolution/turn-resolution.ts:1078-1087` (Phase 9)
* **Description:** At the end of a turn, `resolveTurn` successfully calculates follow-ups, advances event chains, and calls `surfaceEvents` for the *next* turn, storing them in `nextState.activeEvents`. However, when the UI starts the new round, `RoundController.prepareRound()` calls `surfaceEvents` a *second* time to generate a fresh batch. It feeds *only* this new batch into the bridge layer (`partitionEvents`, `generateCrisisPhaseData`, `generatePetitionCards`).
* **Impact:** The player will **never** see follow-up events or chain-advanced events from Phase 9. Multi-turn storylines and reactive event consequences are completely invisible and unplayable. The Phase 9 events sit silently in `gameState.activeEvents` but are never presented as cards.
* **Additional context:** The two `surfaceEvents` calls don't produce duplicates (the `seenDefinitionIds` check prevents that), but they produce *different* events. Phase 9 events include chain-advanced and follow-up events; `prepareRound` events are standalone-only.

### 2. The Unrecorded Event Resolution Trap `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:1031-1032` & `src/context/game-context.tsx:204`
* **Description:** The engine only applies consequence effects (Phase 9) if `event.isResolved === true`. However, the UI maps player decisions to `QueuedAction` objects via `mapDecisionsToActions` and never mutates the events themselves to set `isResolved` or `choiceMade`. Furthermore, `applyActionEffects` is currently a stub identity function `(s) => s` (line 149 of RoundController), so no action effects are applied at all.
* **Secondary Context Bug:** `game-context.tsx:204` archives events via `state.gameState.activeEvents.filter((e) => e.isResolved)`. This checks the *pre-resolution* state (before `TURN_RESOLVED` updates `gameState`), so even if events were resolved during turn resolution, they'd be missed. `eventHistory` never populates.
* **Impact:** No events will ever resolve mechanically. This is the root cause that masks Bugs 3, 7, 8, and 16.

### 3. The Event Consequence Deletion Bug (Phantom Choices) `[VERIFIED]` `[MASKED BY BUG 2]`
* **Location:** `src/engine/resolution/turn-resolution.ts:1034-1037` (Phase 9) vs. lines `1103-1113` (workingState assembly)
* **Description:** In Phase 9, event choice effects modify `stateAfterActions` via `applyMechanicalEffectDelta` (e.g., `stateAfterActions.treasury.balance`). However, when building `workingState` for storyline resolution (line 1103), the code explicitly overwrites with earlier-phase variables: `treasury: updatedTreasury`, `food: updatedFood`, etc. These `updatedX` variables were set in Phases 3-5, before Phase 9 ran.
* **Impact:** Any food, gold, military size, or stability gained or lost through an Event Choice is instantly thrown away. Currently masked by Bug 2 (events never resolve, so the Phase 9 loop is never entered).

### 4. Storyline Resolution State Loss `[VERIFIED]` `[NARROWER THAN REPORTED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:1141-1149` (Phase 9 merge-back)
* **Description:** When a storyline resolves, its consequences are applied to `workingState`. Afterward, the engine merges back treasury, food, population, military, stability, faithCulture, diplomacy, and espionage. However, it fails to extract `regions`.
* **Correction from original report:** The original report also listed `knowledge` and `policies` as lost, but `applyMechanicalEffectDelta` / `applyStorylineResolutionEffects` do not modify knowledge or policies — only regions (via `applyRegionDevelopmentChange`). So the practical loss is **regions only**.
* **Impact:** If a storyline finale grants a region upgrade, that reward is permanently discarded. The fix would be adding `constructionRegions = workingState.regions;` after the merge-back block (noting that `constructionRegions` is initialized from `stateAfterActions.regions` at line 1194).

### 5. The Action Queue Overwrite (Non-Card Actions Deleted) `[VERIFIED]`
* **Location:** `src/ui/RoundController.tsx:140` (`handleRoundComplete`)
* **Description:** When the player clicks "End Turn", `handleRoundComplete` sets `queuedActions: actions` where `actions` comes exclusively from `mapDecisionsToActions(decisions, ...)`. This completely overwrites any actions previously queued via `QUEUE_ACTION` dispatch.
* **Impact:** Any military deployments, construction projects, or espionage operations queued via the `QUEUE_ACTION` context dispatch during the turn are silently deleted before resolution begins. The severity depends on whether non-card UI elements that dispatch `QUEUE_ACTION` are implemented.

### 6. War Defeat / Territory Loss is Mechanically Impossible `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:875-882` (Phase 5d conflict consequence merge)
* **Description:** After `applyConflictConsequences` returns `afterConsequences`, the code extracts treasury, food, population, military, diplomacy, and stability — but **not regions**. The `applyConflictConsequences` function (in `military.ts`) modifies `regions` to mark territories as occupied on defeat, but those changes are never propagated.
* **Impact:** The player's regions can never be marked as `isOccupied`. The `FailureCondition.Conquest` check at line 1359 (`checkTotalConquest(constructionRegions)`) will never trigger because `constructionRegions` is initialized from `stateAfterActions.regions` which never receives conflict region changes.

---

## HIGH SEVERITY (Severe State, Logic, & Flow Desyncs)
*These bugs cause massive memory leaks, infinite scaling of hidden stats, or unfair fail states.*

### 7. Infinite Active Event Bloat (Memory Leak) `[VERIFIED]` `[CONSEQUENCE OF BUG 2]`
* **Location:** `src/ui/RoundController.tsx:134-136` (`handleRoundComplete`) & `src/engine/events/event-engine.ts:380` (`advanceEventChains`)
* **Description:** `RoundController` adds `surfacedEvents` into `activeEvents` before passing to `resolveTurn`. In Phase 9, `advanceEventChains` preserves all unresolved events (line 380-381). Since events never resolve (Bug 2), they all survive. Each turn adds new events via `surfaceEvents`, and old ones are never purged.
* **Impact:** Over many turns, `activeEvents` grows indefinitely. The `seenDefinitionIds` check in `surfaceEvents` will eventually exhaust the event pool, but not before accumulating many phantom events.
* **Root cause:** Bug 2. If events resolved properly, resolved events would be dropped by `advanceEventChains` and archived by `game-context.tsx`.

### ~~8. Infinite Ruling Style Stat Inflation~~ `[NOT A BUG — REMOVED]`
*See "Removed Bugs" section at bottom.*

### 9. The "Instant Ambush" Bug (Turn Order Violation) `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:720-839` (Phase 5d)
* **Description:** At line 722-740, if the AI generates a `NeighborActionType.WarDeclaration`, a new conflict is pushed into the local `activeConflicts` array. At line 766, the code immediately loops over `activeConflicts` — including the just-added conflict — to calculate combat, casualties, and war costs.
* **Impact:** The first round of combat is fought on the *same turn* war is declared. The player's troops take casualties before they even know a war started. New conflicts should start unresolved and first see combat next turn.

### 10. The 1-Turn Policy Blindspot (Instant Failure Trap) `[VERIFIED]` `[DESIGN ISSUE]`
* **Location:** `src/engine/resolution/turn-resolution.ts:267` (Phase 1) vs. line `276` (Phase 2)
* **Description:** Food production is calculated in Phase 1 using `state` (pre-action). Player actions (like `PolicyChange` decrees) are processed in Phase 2 via `applyActionEffects`.
* **Additional context:** The comment at line 266 says "Food production uses commoner labor and regional food output from pre-action state," suggesting this ordering is intentional. However, `applyActionEffects` is currently a stub `(s) => s`, so no actions take effect at all. Once implemented, the 1-turn lag will become a real gameplay issue.
* **Impact:** Emergency policy changes to avoid famine won't take effect until the following turn. This is a design-level ordering concern rather than a code error.

### 11. Stability Temporary Modifier Eradication `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:283-288` (Phase 2b) vs. lines `996-1003` (Phase 8)
* **Description:** Temporary modifiers apply `stabilityDelta` to `stateAfterActions.stability.value` via `applyMechanicalEffectDelta` in Phase 2b. In Phase 8, `calculateStability` (defined in `population.ts:296-341`) recalculates stability entirely from scratch using population satisfaction, food security, faith, cultural cohesion, and decree pace — completely ignoring whatever value was in `stateAfterActions.stability.value`.
* **Impact:** Temporary stability buffs or debuffs from events or modifiers are immediately overwritten and have zero effect.

---

## MEDIUM SEVERITY (Event Engine & Mechanical Bugs)
*These bugs break specific interactions, ruin narrative branching, or mishandle resources.*

### ~~12. Storyline Consequence Tag Collision~~ `[FIXED — REMOVED]`
*One-line fix applied: changed `storyline.decisionHistory[0].choiceId` to `lastDecision.choiceId` in `turn-resolution.ts:1133`.*

### 13. Lost Knowledge Progress on Construction Completion `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:1257-1270` (Phase 10)
* **Description:** When a scholarly construction project completes, it attempts to apply a progress bonus to the research branch identified by `stateAfterActions.policies.researchFocus`. The entire block is guarded by `if (fx.knowledgeProgressDelta && stateAfterActions.policies.researchFocus)` — if no research focus is active, the progress bonus is silently discarded with no fallback.
* **Impact:** Resources spent building academic infrastructure are entirely wasted if no tech is currently selected. The bonus could be banked or applied to a default branch instead.

### 14. Construction "Income" vs "Lump Sum" Mix-up `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:1219-1224` (Phase 10)
* **Description:** `fx.treasuryIncomeDelta` from a completed building is applied as `constructionTreasury.balance + fx.treasuryIncomeDelta` — a one-time balance addition.
* **Additional context:** The comment at line 1219 acknowledges this: *"Treasury income bonus (applied as immediate balance bump; persistent via development)"*. The intent is that the region development increase from the building provides the recurring income. However, the field name `treasuryIncomeDelta` is misleading and the data layer could define values expecting recurring behavior.
* **Impact:** Buildings designed to increase per-turn economic output instead act like a one-time flat gold payout. The naming inconsistency could cause data-layer authors to define values incorrectly.

### 15. Phase 1 vs Phase 3 Resource Paradox `[VERIFIED]` `[DESIGN ISSUE]`
* **Location:** `src/engine/resolution/turn-resolution.ts:267` (Phase 1) and `320-325` (Phase 3)
* **Description:** Phase 1 (`calculateFoodProduction`) uses pre-action `state`. Phase 3 (`calculateFoodConsumption`) uses post-action `stateAfterActions`.
* **Additional context:** Currently moot since `applyActionEffects` is a stub `(s) => s`, making `state` and `stateAfterActions` identical. Once implemented, a decree boosting agricultural output yields no immediate food, but a decree increasing rationing applies immediately. This is the same design-level ordering concern as Bug 10.
* **Impact:** Asymmetric treatment of production vs. consumption creates unpredictable famine states.

### 16. Permanent Event Blacklisting `[VERIFIED]` `[MASKED BY BUG 2]`
* **Location:** `src/engine/events/event-engine.ts:310-314` (`surfaceEvents`)
* **Description:** `surfaceEvents` builds `seenDefinitionIds` from both `existingActive` and `eventHistory`, then filters candidates with `!seenDefinitionIds.has(def.id)`. Once any instance of an event definition appears in `eventHistory`, that definition is permanently blacklisted.
* **Additional context:** Currently masked by Bug 2 — `eventHistory` never grows because events never resolve and get archived. Once Bug 2 is fixed, repeatable events like "Bandit Raid" or "Good Harvest" will only fire once per playthrough. The `EventDefinition` type would need a `repeatable` flag to distinguish one-time from recurring events.
* **Impact:** Late games will suffer from empty event pools as all definitions get exhausted.

### 17. Regional Context Leak in Event Chains `[VERIFIED]`
* **Location:** `src/engine/events/event-engine.ts:409` (`advanceEventChains`)
* **Description:** When advancing a chain event, line 409 blindly copies `affectedRegionId: event.affectedRegionId` from Step 1 to Step 2. The comment says *"maintain regional context through the chain"*.
* **Impact:** If Step 1 targets a specific region but Step 2 is designed to be kingdom-wide (or vice versa), the inherited region context causes incorrect targeting. Step 2 definitions have no mechanism to override the inherited region.

### ~~18. Undocumented Slot Calculation Exclusion~~ `[NOT A BUG — REMOVED]`
*See "Removed Bugs" section at bottom.*

---

## LOW SEVERITY (Edge Cases, UI Quirks, & Minor Exploits)
*These bugs represent minor balance issues, UI flashes, or unintended AI behaviors.*

### 19. AI Treaty Insta-Lock (Loss of Player Agency) `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:548-571` (TradeProposal) and `589-609` (TreatyProposal)
* **Description:** `TreatyProposal` and `TradeProposal` from the AI are injected directly into the player's `activeAgreements` array. Treaties also instantly apply a +5 relationship bonus. There is no crisis event surfaced for the player to accept or reject.
* **Impact:** The player has no agency to reject treaties or trade agreements; the AI can force them into agreements unilaterally.

### 20. Espionage Target Bypassing `[VERIFIED]`
* **Location:** `src/engine/resolution/turn-resolution.ts:678-679` (Phase 5c) vs. lines `468-470` (main intel resolution)
* **Description:** The main intel op resolution (line 468-470) handles target lookup with a fallback: `op.targetNeighborId ?? op.parameters['targetId']`. But the exposure check in Phase 5c (line 678-679) only reads `op.targetNeighborId` — if it's `null`, the loop skips the operation with `continue`.
* **Impact:** Operations that pass their target via `op.parameters['targetId']` instead of `op.targetNeighborId` are resolved successfully but completely bypass the exposure check.

### 21. Espionage Exposure Formula Floor `[VERIFIED]` `[DESIGN CONCERN]`
* **Location:** `src/engine/resolution/turn-resolution.ts:687-691` (Phase 5c)
* **Description:** The formula `clamp((targetNeighbor.espionageCapability - updatedEspionage.networkStrength) * 0.01, 0.05, 0.4)` enforces a hard 5% minimum floor.
* **Additional context:** This may be an intentional design choice — many games enforce minimum risk floors to prevent "no risk" operations. However, it means mathematical superiority in espionage can never reduce exposure risk below 5%, which may feel unfair to players who invest heavily in network strength.
* **Impact:** Even with perfect network strength against an enemy with zero counter-intel, there is always a flat 5% chance of exposure.

### ~~22. Randomness During Render Loop~~ `[NOT A BUG — REMOVED]`
*See "Removed Bugs" section at bottom.*

---

## Removed Bugs

### ~~8. Infinite Ruling Style Stat Inflation~~ — NOT A BUG
`accumulateStyleDecision` in `ruling-style.ts:56-71` uses a rolling window of `RULING_STYLE_WINDOW_SIZE` decisions. Each call appends the new decision, trims to the window, and recalculates axes from the trimmed list via `recalculateAxes`. This prevents any infinite accumulation. Additionally, the Phase 11a loop (line 1303-1304) checks `!event.isResolved`, so it's unreachable due to Bug 2 anyway.

### ~~18. Undocumented Slot Calculation Exclusion~~ — NOT A BUG (Intentional Design)
`PolicyChange` actions are intentionally excluded from slot calculations in `game-context.tsx:178-182`. They use a separate counter system: `policyChangesUsedThisTurn` (line 192), enforced by `validateActionAddition` in `action-budget.ts`. The policy limit is `POLICY_CHANGES_PER_TURN` (1 per turn), tracked independently from action slots.

### ~~22. Randomness During Render Loop~~ — NOT A BUG
`setSeasonPhraseIndex` is correctly called inside `prepareRound`, which is invoked from a `useEffect` (RoundController.tsx:58-63). No randomness occurs during the render phase. The initial value is `0` (deterministic), and the effect sets the random value after mount/update. This is standard React effect timing.
