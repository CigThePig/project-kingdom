# Comprehensive Bug Report: Project Kingdom

## 🔴 CRITICAL SEVERITY (Game-Breaking Architecture & State Loss)
*These bugs fundamentally break the core game loop, cause permanent loss of player actions, or make failure/victory states impossible.*

### 1. The "Double-Generate" Event Desync (Broken Event Chains)
* **Location:** `src/ui/RoundController.tsx` (in `prepareRound`) vs. `src/engine/resolution/turn-resolution.ts` (Phase 9)
* **Description:** At the end of a turn, `resolveTurn` successfully calculates follow-ups, advances event chains, and calls `surfaceEvents` for the *next* turn, storing them in `nextState.activeEvents`. However, when the UI starts the new round, `RoundController.prepareRound()` ignores this and calls `surfaceEvents` a *second* time to generate a fresh batch. It feeds *only* this new batch into the UI.
* **Impact:** The player will **never** see follow-up events or chain-advanced events. Multi-turn storylines and reactive event consequences are completely invisible and unplayable.

### 2. The Unrecorded Event Resolution Trap
* **Location:** `src/engine/resolution/turn-resolution.ts` & `src/context/game-context.tsx`
* **Description:** The engine only applies consequence effects (Phase 9) if `event.isResolved === true`. However, the UI passes decisions via `queuedActions` and never mutates the events to set these flags before calling `resolveTurn`. The engine relies on the data-layer callback `applyActionEffects` (currently a stub `(s) => s`) to translate queue actions into resolved states. 
* **Secondary Context Bug:** Even if it worked, `game-context.tsx` archives events in `TURN_RESOLVED` by checking `state.gameState.activeEvents.filter(...)`. Since it checks the *start-of-turn* state rather than `result.nextState`, `eventHistory` will never populate.
* **Impact:** No events will ever resolve mechanically.

### 3. The Event Consequence Deletion Bug (Phantom Choices)
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 9 vs Phase 11)
* **Description:** In Phase 9, event choice effects modify `stateAfterActions` (e.g., `stateAfterActions.treasury.balance`). However, the engine previously split state tracking into independent variables (`updatedTreasury`, `updatedFood`, etc.). In Phase 11, when assembling `nextState`, the engine completely ignores `stateAfterActions` and rebuilds the state using the decoupled `updatedX` variables.
* **Impact:** Any food, gold, military size, or stability gained or lost through an Event Choice is instantly thrown away. Resource bars will never update based on event decisions.

### 4. Storyline Resolution State Loss
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 9)
* **Description:** Similar to Bug #3, when a storyline resolves, its consequences are applied to a `workingState`. Afterward, the engine maps variables back out (`updatedTreasury = workingState.treasury;`, etc.). However, it completely fails to extract `regions`, `knowledge`, and `policies`.
* **Impact:** If a storyline finale grants a region upgrade, unlocks a technology milestone, or forces a policy shift, that reward/penalty is permanently discarded.

### 5. The Action Queue Overwrite (Non-Card Actions Deleted)
* **Location:** `src/ui/RoundController.tsx` (`handleRoundComplete`)
* **Description:** When the player clicks "End Turn", `RoundController` runs `handleRoundComplete` and does this: `actionBudget: { ...ctx.state.gameState.actionBudget, queuedActions: actions }`. It completely overwrites the existing queue with the actions mapped *strictly* from the UI cards (Crisis, Petitions, Decrees).
* **Impact:** Any military deployments, construction projects, or espionage operations ordered by the player via other dashboard screens during the turn are silently deleted before resolution begins.

### 6. War Defeat / Territory Loss is Mechanically Impossible
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 5d)
* **Description:** The engine runs `applyConflictConsequences` to calculate the aftermath of a resolved war (such as target regions being occupied). When merging the output back into the main state flow, `updatedRegions = afterConsequences.regions;` is missing entirely.
* **Impact:** The player's regions can never be marked as `isOccupied`. The `FailureCondition.Conquest` state is impossible to trigger.

---

## 🟠 HIGH SEVERITY (Severe State, Logic, & Flow Desyncs)
*These bugs cause massive memory leaks, infinite scaling of hidden stats, or unfair fail states.*

### 7. Infinite Active Event Bloat (Memory Leak)
* **Location:** `src/ui/RoundController.tsx` (`handleRoundComplete`)
* **Description:** `RoundController` pushes its locally generated `surfacedEvents` into the global state array before passing it to `resolveTurn`. Because events fail to resolve (Bug #2), they survive the turn resolution purge.
* **Impact:** Over 20-30 turns, the `activeEvents` array bloats indefinitely, tracking dozens of phantom, unplayable events and causing severe memory/performance degradation.

### 8. Infinite Ruling Style Stat Inflation
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 11a)
* **Description:** To calculate the player's ruling style, the engine loops over `stateAfterActions.activeEvents` and applies axis deltas for any resolved event. However, it doesn't check if the event has *already* been scored in a previous turn.
* **Impact:** Because events fail to archive properly, the exact same resolved event will continually apply its alignment points (e.g., +10 Authoritarian) every single turn, violently skewing the player's political profile.

### 9. The "Instant Ambush" Bug (Turn Order Violation)
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 5d)
* **Description:** If the AI generates a `NeighborActionType.WarDeclaration`, the engine instantly pushes a new conflict into `activeConflicts`. Immediately below this, in the exact same phase, it loops over `activeConflicts` to calculate casualties.
* **Impact:** The first round of the war is fought and casualties are applied on the *same turn* war is declared. The player receives the notification at the exact same time their troops have already died, giving them zero opportunity to react or change deployment posture.

### 10. The 1-Turn Policy Blindspot (Instant Failure Trap)
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 1 vs Phase 2)
* **Description:** Food production is calculated in Phase 1 using `state.policies`. Player actions (like `PolicyChange` decrees) are processed in Phase 2.
* **Impact:** If a player enacts an Emergency Rationing decree to avoid an imminent famine, the food savings will not apply this turn because the math was locked in during Phase 1. The player triggers a Famine Failure State despite making the correct strategic move.

### 11. Stability Temporary Modifier Eradication
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 2b vs Phase 8)
* **Description:** Temporary modifiers mapped to `stabilityDelta` apply to the raw `.value` in Phase 2b. In Phase 8, `calculateStability` evaluates the stability score entirely from scratch, directly overwriting the Phase 2b mutation.
* **Impact:** Temporary stability buffs or debuffs from events will do absolutely nothing.

---

## 🟡 MEDIUM SEVERITY (Event Engine & Mechanical Bugs)
*These bugs break specific interactions, ruin narrative branching, or mishandle resources.*

### 12. Storyline Consequence Tag Collision
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 9)
* **Description:** When recording a `PersistentConsequence` for a storyline, the tag is hardcoded as: `tag: ${storyline.definitionId}:resolution:${storyline.decisionHistory[0].choiceId}`. It records the player's *very first decision* in the storyline, not their final branch decision.
* **Impact:** Both "Good" and "Bad" endings of a storyline generate the exact same consequence tag, breaking downstream events that require a specific narrative outcome.

### 13. Lost Knowledge Progress on Construction Completion
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 10)
* **Description:** When a scholarly construction project completes, it attempts to apply a progress bonus to `stateAfterActions.policies.researchFocus`. If the player has no active research focus that turn, the `knowledgeProgressDelta` is silently discarded.
* **Impact:** Resources spent building academic infrastructure are entirely wasted if no tech is currently selected.

### 14. Construction "Income" vs "Lump Sum" Mix-up
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 10)
* **Description:** `fx.treasuryIncomeDelta` from a completed building is applied as a one-time addition to `constructionTreasury.balance`.
* **Impact:** Buildings designed to increase per-turn economic output (like Trade Ports) instead act like a one-time flat gold payout.

### 15. Phase 1 vs Phase 3 Resource Paradox
* **Location:** `src/engine/resolution/turn-resolution.ts`
* **Description:** Phase 1 (`calculateFoodProduction`) uses pre-action state. Phase 3 (`calculateFoodConsumption`) uses post-action state.
* **Impact:** A decree boosting agricultural output yields no immediate food, but a decree increasing rationing applies immediately. This mismatch causes unpredictable famine states.

### 16. Permanent Event Blacklisting
* **Location:** `src/engine/events/event-engine.ts` (`surfaceEvents`)
* **Description:** `surfaceEvents` blacklists any `definitionId` that appears in `eventHistory`.
* **Impact:** Generic, repeatable events ("Bandit Raid", "Good Harvest") can only occur exactly once per playthrough. Late games will suffer from empty event pools.

### 17. Regional Context Leak in Event Chains
* **Location:** `src/engine/events/event-engine.ts` (`advanceEventChains`)
* **Description:** Step 2 of an event chain blindly copies `affectedRegionId: event.affectedRegionId` from Step 1.
* **Impact:** If Step 1 targets the whole kingdom (`null` region), but Step 2 requires a specific region to apply local debuffs (like burning development), the engine fails to find the target and the penalty vanishes.

### 18. Undocumented Slot Calculation Exclusion
* **Location:** `src/context/game-context.tsx` (`REMOVE_ACTION`)
* **Description:** When recalculating used slots, the reducer explicitly filters out `ActionType.PolicyChange` actions.
* **Impact:** Even if a major Policy Change is defined as costing 1 or 2 action slots in the data layer, the UI will ignore the cost, granting infinite policy actions.

---

## 🟢 LOW SEVERITY (Edge Cases, UI Quirks, & Minor Exploits)
*These bugs represent minor balance issues, UI flashes, or unintended AI behaviors.*

### 19. AI Treaty Insta-Lock (Loss of Player Agency)
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 5b)
* **Description:** `TreatyProposal` and `TradeProposal` from the AI are injected directly into the player's `activeAgreements` array, instantly applying relationship bonuses.
* **Impact:** The player has no agency to reject treaties; the AI can force them into agreements.

### 20. Espionage Target Bypassing
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 5c)
* **Description:** The exposure check only reads the top-level `op.targetNeighborId`. If a spy operation passes the target via `op.parameters['targetId']`, the resolution phase handles it fine, but the exposure phase skips it.
* **Impact:** Players can avoid all risk of espionage exposure by manipulating how the target ID is submitted in the action queue.

### 21. Espionage Exposure Formula Floor
* **Location:** `src/engine/resolution/turn-resolution.ts` (Phase 5c)
* **Description:** The formula `clamp((targetNeighbor - updatedEspionage) * 0.01, 0.05, 0.4)` enforces a hard 5% minimum floor.
* **Impact:** Even with perfect network strength against an enemy with zero counter-intel, there is always a flat 5% chance of exposure. Mathematical superiority is impossible.

### 22. Randomness During Render Loop Mitigation Note
* **Location:** `src/ui/RoundController.tsx`
* **Description:** `setSeasonPhraseIndex` was correctly moved to a `useEffect`, but because updates trigger async re-renders, the UI might display a single-frame flash of the previous turn's phrase/order before updating.
