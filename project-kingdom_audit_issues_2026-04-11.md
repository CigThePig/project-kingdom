# Project Kingdom Audit Issues

Comprehensive issue list from today's audit passes across engine, cards/card logic, UI, and repo-wide cross-layer plumbing. This is written for an AI agent: minimal preamble, direct problem statements, relevant files, impact, and fix direction.

---

## Priority Summary

### Highest priority
- Fix the TypeScript build blocker in `src/context/game-context.tsx`.
- Fix engine timing/order bugs that make policy changes, agreements, and construction behave incorrectly.
- Fix card/context mismatches where the player sees one target or choice set and the engine resolves another.
- Fix UI/controller state drift so the round flow cannot visually progress after a failed turn resolution.
- Wire or remove dormant systems: save/load, new game, scenarios, storylines, neighbor-action cards, game over.

### Recommended execution order
1. Build + type issues
2. Engine correctness
3. Card correctness and card-to-effect consistency
4. UI/controller state-flow issues
5. Dormant/unwired systems
6. PWA/performance/test coverage

---

## Build / Type / Repo Blocking Issues

### PK-BUILD-001: TypeScript build blocker in save/load reducer
**Area:** UI / persistence / build

**Files:**
- `src/context/game-context.tsx:154`

**Problem:**
The reducer reads `chronicle` from `save` using an invalid cast expression:

```ts
chronicle: (save as Record<string, unknown>).chronicle as ChronicleEntry[] ?? []
```

TypeScript rejects this, so the app does not build cleanly.

**Impact:**
- `npm run build` fails.
- Blocks deployment and masks downstream issues.

**Fix direction:**
Use a safe temporary extraction step or widen the `SaveFile` type to include `chronicle`, then parse/default safely.

---

### PK-REPO-001: Save schema drift between types and reducer expectations
**Area:** Persistence / repo-wide

**Files:**
- `src/engine/types.ts:934-943`
- `src/context/game-context.tsx:154`

**Problem:**
`SaveFile` does not include `chronicle`, but the reducer expects it during `LOAD_SAVE`.

**Impact:**
- Type drift between formal schema and actual runtime usage.
- Build error is a symptom of a deeper contract mismatch.

**Fix direction:**
Either add `chronicle` to `SaveFile` and persist it intentionally, or stop expecting it on load.

---

## Engine Issues

### PK-ENG-001: Policy changes do not affect same-turn economy/food calculations
**Area:** Engine / turn resolution

**Files:**
- `src/engine/resolution/turn-resolution.ts:275-309`
- `src/engine/resolution/apply-action-effects.ts:325-338`

**Problem:**
`resolveTurn()` calculates taxation, trade, and food using the pre-action state. Policy changes are applied later in `applyActionEffects()`, so policy actions taken this turn do not affect the same turn’s numbers.

**Impact:**
- Taxation/trade/rationing changes feel delayed by one turn.
- Player-facing policy cards appear to “do nothing” immediately.

**Fix direction:**
Run economy/food calculations against `stateAfterActions` or reorder policy application before those calculations.

---

### PK-ENG-002: Newly accepted diplomatic agreements lose a turn immediately
**Area:** Engine / diplomacy timing

**Files:**
- `src/engine/resolution/turn-resolution.ts:218-236`
- `src/engine/resolution/turn-resolution.ts:477-483`

**Problem:**
Pending proposals are auto-accepted at the start of turn resolution, then all active agreements are decremented in the same turn. A 4-turn agreement becomes 3 the moment it is accepted.

**Impact:**
- Agreement durations are effectively shortened by one turn.
- Negotiation outcomes feel inconsistent with card text or player expectation.

**Fix direction:**
Do not decrement agreements created/accepted during the current resolution pass.

---

### PK-ENG-003: New construction projects lose a turn immediately
**Area:** Engine / construction timing

**Files:**
- `src/engine/resolution/apply-action-effects.ts:395-404`
- `src/engine/resolution/turn-resolution.ts:1402-1499`

**Problem:**
Construction starts with `turnsRemaining = turnsTotal`, but construction progress runs later in the same `resolveTurn()`, decrementing the new project immediately. A 3-turn project becomes 2 on the same turn it is started.

**Impact:**
- Project durations are effectively shortened by one turn.
- A 1-turn project can complete instantly.

**Fix direction:**
Skip decrementing projects created this turn, or progress construction before new projects are added.

---

### PK-ENG-004: Trade agreement IDs use inconsistent prefixes
**Area:** Engine / diplomacy / trade

**Files:**
- `src/engine/resolution/apply-action-effects.ts:442-447`
- `src/engine/systems/trade.ts:129-130`
- `src/engine/systems/trade.ts:147-148`
- `src/engine/systems/diplomacy.ts:400-402`
- `src/engine/systems/diplomacy.ts:431-432`

**Problem:**
Player-created trade agreements use IDs like `trade-${action.id}` while the rest of the engine checks for `trade_...` with an underscore.

**Impact:**
- Existing player-created trade agreements are invisible to logic that detects trade.
- AI can propose duplicate trade relationships.
- Trade withdrawal checks can fail.

**Fix direction:**
Standardize one ID scheme everywhere and migrate all checks to it.

---

### PK-ENG-005: Diplomatic drift uses readiness instead of military strength
**Area:** Engine / diplomacy

**Files:**
- `src/engine/systems/diplomacy.ts:107-130`
- `src/engine/resolution/turn-resolution.ts:468-474`

**Problem:**
`calculateAIRelationshipDelta()` expects military strength input, but `resolveTurn()` passes `militaryAfterUpdate.readiness` instead.

**Impact:**
- A tiny fully-ready army and a huge fully-ready army look equivalent to diplomacy drift.
- Foreign perception logic does not match actual military power.

**Fix direction:**
Pass a real military strength metric, not readiness percentage.

---

### PK-ENG-006: Stability decree-pace penalty is off by one
**Area:** Engine / population / stability

**Files:**
- `src/engine/constants.ts:92-93`
- `src/engine/systems/population.ts:292`
- `src/engine/systems/population.ts:317-318`

**Problem:**
Constants/docs say the penalty should apply per action above 2, but the implementation uses `Math.max(0, actionsTakenThisTurn - 3)`, delaying the penalty until the fourth action.

**Impact:**
- The third action is treated as free when it should incur decree-pace drag.
- Stability tuning does not match documented rules.

**Fix direction:**
Change the threshold to `Math.max(0, actionsTakenThisTurn - 2)` if the documented design is correct.

---

## Card / Card Logic Issues

### PK-CARD-001: Petition generation collapses multi-choice events into binary yes/no cards
**Area:** Card generation / authored content fidelity

**Files:**
- `src/bridge/eventClassifier.ts:9-23`
- `src/bridge/petitionCardGenerator.ts:30-52`

**Problem:**
All `Notable` and `Informational` events are treated as petitions based on severity only. `generatePetitionCards()` discards all middle choices and converts the event into a binary grant/deny card using only the first and last choices.

**Impact:**
- Rich multi-choice authored events lose their middle options.
- Several event outcomes become unreachable.
- Player choice space is significantly reduced.

**Fix direction:**
Only generate binary petition cards from explicitly binary events, or preserve all authored choices in petition UI/logic.

---

### PK-CARD-002: Notification cards are authored but never appear
**Area:** Card generation / dead content

**Files:**
- `src/engine/events/event-engine.ts:127-132`
- `src/data/events/index.ts:88-107`
- `src/data/events/index.ts:590-607`
- `src/bridge/eventClassifier.ts:9-23`
- `src/bridge/petitionCardGenerator.ts:37`

**Problem:**
The event model supports `classification: 'notification'`, and notification-style events are authored, but the classifier ignores classification and routes them by severity. The petition generator then skips them because they have fewer than 2 choices.

**Impact:**
- Notification content is effectively dead.
- Important informational/state-assessment content never reaches the player.

**Fix direction:**
Add explicit notification-card handling in the classifier and round pipeline.

---

### PK-CARD-003: Only the first crisis event is surfaced each season
**Area:** Card distribution / round flow

**Files:**
- `src/ui/RoundController.tsx:145-149`

**Problem:**
`prepareRound()` takes only `crisisEvents[0]` and creates one crisis card for the season, even if multiple `Serious` or `Critical` events are active.

**Impact:**
- Additional crises remain active in state but are not represented as cards.
- The player can be unaware of multiple simultaneous urgent problems.

**Fix direction:**
Queue multiple crisis cards across months or explicitly batch/stack them.

---

### PK-CARD-004: Negotiation cards can target one neighbor in the UI and another at resolution time
**Area:** Card generation / direct effect application

**Files:**
- `src/bridge/negotiationCardGenerator.ts:21-33`
- `src/bridge/negotiationCardGenerator.ts:94-123`
- `src/bridge/directEffectApplier.ts:14-35`
- `src/bridge/directEffectApplier.ts:62-79`

**Problem:**
Negotiation cards resolve `__NEIGHBOR__` placeholders during generation and present a specific neighbor to the player. On resolution, `applyDirectEffects()` selects a neighbor again from the current state instead of using the stored one.

**Impact:**
- Card text and resolved target can diverge.
- Player accepts a deal with one kingdom and another kingdom gets the effect.

**Fix direction:**
Persist the selected neighbor on the card and use it during effect resolution.

---

### PK-CARD-005: Assessment cards have the same retargeting bug as negotiations
**Area:** Card generation / direct effect application

**Files:**
- `src/bridge/assessmentCardGenerator.ts:33-52`
- `src/bridge/assessmentCardGenerator.ts:96-108`
- `src/bridge/directEffectApplier.ts:14-35`
- `src/bridge/directEffectApplier.ts:48-59`

**Problem:**
Assessment previews resolve foreign placeholders during card generation, but effects resolve those placeholders again later from the current game state.

**Impact:**
- The UI can describe one foreign kingdom and the effects can hit another.
- Assessment outcomes are not stable between display and resolution.

**Fix direction:**
Store target context on the card and consume that context when applying effects.

---

### PK-CARD-006: Cards are pre-generated once at season start and become stale by month 2/3
**Area:** Round pipeline / card state freshness

**Files:**
- `src/ui/RoundController.tsx:124-168`

**Problem:**
Crises, petitions, negotiations, assessments, and decrees are generated once from the starting `gameState` and stored for the entire season. Month 1 decisions can change state before month 2/3 cards are played.

**Impact:**
- Later cards can reflect outdated diplomacy, treasury, faith, stability, or AI context.
- Contributes directly to target mismatch bugs and stale availability problems.

**Fix direction:**
Regenerate cards at the point they are needed, or snapshot all required context onto each card.

---

### PK-CARD-007: Petitions can be deferred for an entire season if months are already occupied
**Area:** Card distribution / content starvation

**Files:**
- `src/bridge/cardDistributor.ts:103-120`

**Problem:**
If crisis + negotiation + assessment already fill the available month slots, petitions are deferred instead of being queued or surfaced in another way.

**Impact:**
- Petition content can disappear for a season.
- Low-severity but important kingdom issues can be starved indefinitely if the schedule is busy.

**Fix direction:**
Add a queue/backlog mechanic or allow multiple cards in a month where appropriate.

---

## UI / Controller / Interaction Issues

### PK-UI-001: Round UI resets even if turn resolution throws
**Area:** UI controller / state flow

**Files:**
- `src/ui/RoundController.tsx:268-318`

**Problem:**
`handleRoundComplete()` catches resolution errors but still resets the local round flow afterward. The UI can jump back to month start even though `gameState` never advanced.

**Impact:**
- UI and authoritative state can drift apart.
- Player loses the visible context of the season after a failed resolution.

**Fix direction:**
Only reset local UI state after a successful dispatch, or abort the reset path on failure.

---

### PK-UI-002: Crisis choices are not projected into ruling-style summary correctly
**Area:** UI summary / ruling-style projection

**Files:**
- `src/ui/RoundController.tsx:221-227`
- `src/bridge/crisisCardGenerator.ts:70-89`
- `src/engine/events/event-engine.ts:287-290`

**Problem:**
Summary style projection tries to find crisis decision style data through `petitionCards.find(...)`. Crisis decisions are keyed by active event instance IDs while the style tags are keyed by event definition IDs.

**Impact:**
- Crisis choices often fail to contribute to projected ruling-style state.
- Summary/ruling feedback underreports crisis behavior.

**Fix direction:**
Map crisis decisions through the crisis card/definition ID path explicitly instead of treating them like petition cards.

---

### PK-UI-003: `SummaryPhase` is rendered with fake fallback decision data
**Area:** UI summary / brittle fallback path

**Files:**
- `src/ui/RoundController.tsx:383-390`

**Problem:**
`SummaryPhase` receives `crisisResponse: null`, `petitionDecisions: []`, and only `selectedDecrees` in the direct props path. This is only partially masked by `summaryData` usually existing.

**Impact:**
- Any failure or partial generation in `summaryData` can produce a misleading summary that omits crisis/petition behavior.

**Fix direction:**
Pass real round decisions into `SummaryPhase` or make `summaryData` mandatory for render.

---

### PK-UI-004: Month setup effects ignore game-state changes because dependencies are suppressed
**Area:** UI controller / reactivity

**Files:**
- `src/ui/RoundController.tsx:86-91`
- `src/ui/RoundController.tsx:94-122`

**Problem:**
Month-setup effects intentionally suppress exhaustive dependency checks and only react to `currentMonth` or `currentPhase`. If the authoritative `gameState` changes while the controller remains in the same phase/month, month content does not regenerate.

**Impact:**
- New game, load-save, future scenario switch, or context updates can leave the visible month content stale while stats update.

**Fix direction:**
Include the necessary `gameState`/round derivation dependencies or force regeneration when authoritative state changes.

---

### PK-UI-005: Petition UI only previews grant effects
**Area:** UI / player information fidelity

**Files:**
- `src/ui/phases/PetitionPhase.tsx:145-155`

**Problem:**
The petition screen shows `petition.grantEffects` even though the player is deciding between grant and deny.

**Impact:**
- Player sees only the “yes” consequences and not the “no” consequences.
- Decision UX is biased and incomplete.

**Fix direction:**
Show both grant and deny effect previews or make the active selection preview its own consequences explicitly.

---

### PK-UI-006: Petition interaction is effectively touch-only
**Area:** UI accessibility / interaction

**Files:**
- `src/ui/phases/PetitionPhase.tsx`
- `src/ui/hooks/useSwipe.ts:38-97`

**Problem:**
Petition interaction depends on swipe handlers with no equivalent button or keyboard fallback.

**Impact:**
- Poor accessibility.
- Harder debugging and desktop testing.
- Limits input flexibility for future ports or admin tooling.

**Fix direction:**
Add explicit Grant / Deny buttons and keep swipe as an optional gesture layer.

---

### PK-UI-007: Swipe handler has no `onTouchCancel` cleanup path
**Area:** UI gestures / interaction robustness

**Files:**
- `src/ui/hooks/useSwipe.ts:38-97`

**Problem:**
Interrupted touch gestures or browser gesture conflicts can leave the card in an in-between transformed state because there is no touch-cancel cleanup.

**Impact:**
- Cards can get visually stranded or partially dragged.
- Gesture behavior is brittle on real devices.

**Fix direction:**
Handle `touchcancel` and reset drag/transform state consistently.

---

### PK-UI-008: Core interactions are implemented as clickable `div`s instead of buttons
**Area:** UI semantics / accessibility

**Files:**
- `src/ui/phases/MonthDawn.tsx:95-110`
- `src/ui/phases/CrisisPhase.tsx:33-49`
- `src/ui/phases/CrisisPhase.tsx:68-80`
- `src/ui/phases/DecreePhase.tsx:66-103`
- `src/ui/phases/SummaryPhase.tsx:68-83`

**Problem:**
Major interaction surfaces use clickable `div`s rather than semantic buttons.

**Impact:**
- Weak keyboard support and focus behavior.
- Poor semantics for accessibility tooling.
- Higher risk of inconsistent activation behavior.

**Fix direction:**
Use `<button>` for primary actions, or fully replicate button semantics if a custom primitive is required.

---

## Repo-Wide / Cross-Layer / Unwired System Issues

### PK-REPO-002: Save/load/new-game action API exists but is not wired into the app
**Area:** Repo-wide / persistence / app shell

**Files:**
- `src/context/game-context.tsx:55-62`
- `src/ui/RoundController.tsx:307`
- `src/engine/constants.ts:309`

**Problem:**
The reducer supports save/load/new-game/action-budget operations, but the live UI only dispatches `TURN_RESOLVED`. `SAVE_STORAGE_KEY` exists but is unused.

**Impact:**
- Persistence and scenario-reset behavior are half-built.
- The codebase contains a dormant app-shell API that players cannot access.

**Fix direction:**
Either wire save/load/new game into the app or remove the dead reducer surface until it is implemented.

---

### PK-REPO-003: Game-over state is tracked but never surfaced in the UI
**Area:** Repo-wide / UI flow / game state

**Files:**
- `src/context/game-context.tsx:47-48`
- `src/context/game-context.tsx:227-258`
- `src/ui/RoundController.tsx`

**Problem:**
`isGameOver` and `gameOverConditions` are maintained in context after turn resolution, but no UI layer reads or responds to them.

**Impact:**
- The game can internally be over while the round flow continues to present normal play.

**Fix direction:**
Add a game-over gate in the main controller and render an end-state phase/screen.

---

### PK-REPO-004: Scenario support exists in code but is unreachable in the current app
**Area:** Repo-wide / startup flow

**Files:**
- `src/context/game-context.tsx:79-91`
- `src/context/game-context.tsx` (`GameProvider` initialization path)

**Problem:**
Multiple scenarios can be created through `createScenarioState()`, but the current app initialization hardwires the default state and never exposes a scenario selection path.

**Impact:**
- Additional scenarios are effectively dead from the player’s perspective.
- Testing scenario-specific content requires code changes or direct dispatches.

**Fix direction:**
Expose scenario selection in the new-game flow or remove dormant scenario code until it is used.

---

### PK-REPO-005: Storyline card generation exists but is not connected to the round flow
**Area:** Repo-wide / content plumbing

**Files:**
- `src/bridge/storylineCardGenerator.ts`
- `src/ui/RoundController.tsx:124-168`

**Problem:**
There is a dedicated storyline-card bridge, but `prepareRound()` never calls it.

**Impact:**
- Storylines can exist in state/codex without becoming player-facing card content.
- Storyline investment is not reflected in the actual season flow.

**Fix direction:**
Wire storyline generation into `prepareRound()` or remove/park the dormant bridge.

---

### PK-REPO-006: Neighbor-action card generation exists but is not connected
**Area:** Repo-wide / content plumbing

**Files:**
- `src/bridge/neighborActionCardGenerator.ts`
- `src/ui/RoundController.tsx:124-168`

**Problem:**
The repo contains a generator that converts `NeighborAction[]` into player-facing cards, but nothing uses it.

**Impact:**
- Diplomatic incidents and neighbor moves may exist as logic/data but never surface to the player through the card layer.

**Fix direction:**
Integrate neighbor-action cards into round preparation or remove the dormant path.

---

### PK-REPO-007: Ruling-style threshold memory is computed but not persisted back into game state
**Area:** Repo-wide / summary / progression

**Files:**
- `src/engine/types.ts:860`
- `src/engine/systems/ruling-style.ts:119-129`
- `src/bridge/summaryGenerator.ts`

**Problem:**
`crossedThresholds` is supposed to prevent repeated threshold triggers. `markThresholdsCrossed()` is used inside summary generation, which returns `updatedRulingStyle`, but that updated state is never written back to authoritative game state.

**Impact:**
- Threshold-cross memory is effectively transient.
- Re-trigger suppression may not function as designed over time.

**Fix direction:**
Persist the updated ruling-style state after summary generation or move threshold crossing into authoritative turn resolution.

---

### PK-REPO-008: PWA manifest references missing icon files
**Area:** Repo-wide / deployment / PWA

**Files:**
- `vite.config.ts:24-35`
- `public/` (contains only `.gitkeep`)

**Problem:**
The PWA manifest declares `pwa-192x192.png` and `pwa-512x512.png`, but those files do not exist in `public/`.

**Impact:**
- PWA install metadata is incomplete/broken.
- Device install UX and icon behavior may fail.

**Fix direction:**
Add the icon assets or remove the manifest entries until icons exist.

---

### PK-REPO-009: Deployment path is hardcoded to one GitHub Pages base
**Area:** Repo-wide / deployment

**Files:**
- `vite.config.ts:22-23`
- `vite.config.ts:39`

**Problem:**
`start_url`, `scope`, and `base` are hardcoded to `/project-kingdom/`.

**Impact:**
- Serving from root or a renamed repo will break asset paths and PWA behavior.
- Reduces portability and makes local/non-GitHub deployment more brittle.

**Fix direction:**
Derive the base path from environment/config or clearly isolate this as a deployment-only override.

---

### PK-REPO-010: Initial production bundle is large for a mobile-first app
**Area:** Repo-wide / performance

**Files:**
- Production build output
- Likely contributors: static data + single large client bundle

**Problem:**
After patching the build blocker locally, the main JS bundle built to roughly 627.5 kB minified and triggered a Vite chunk-size warning.

**Impact:**
- Slower startup on mobile.
- Worse cold-load experience on weaker devices or poor connections.

**Fix direction:**
Code-split phase UI/data, lazy-load heavy content, and review large static imports.

---

### PK-REPO-011: No automated test layer exists
**Area:** Repo-wide / quality guardrails

**Files:**
- `package.json`
- No test files present

**Problem:**
The repo defines scripts for dev/build/preview/lint/format only. There is no test script and no test suite.

**Impact:**
- Cross-layer regressions are easy to introduce.
- Timing/order bugs and card/UI mismatches are unlikely to be caught automatically.

**Fix direction:**
Add a thin automated test net around turn resolution, card generation, round preparation, and critical reducers.

---

## Suggested Agent Work Plan

### Phase 1: Make the repo safe to build and run
1. Fix `PK-BUILD-001` and `PK-REPO-001`.
2. Add a minimal build-verification pass.
3. Ensure summary/game-over/controller code still renders after build fixes.

### Phase 2: Fix authoritative simulation correctness
1. `PK-ENG-001`
2. `PK-ENG-002`
3. `PK-ENG-003`
4. `PK-ENG-004`
5. `PK-ENG-005`
6. `PK-ENG-006`

### Phase 3: Fix card fidelity and card-to-effect consistency
1. `PK-CARD-001`
2. `PK-CARD-002`
3. `PK-CARD-004`
4. `PK-CARD-005`
5. `PK-CARD-006`
6. `PK-CARD-003`
7. `PK-CARD-007`

### Phase 4: Fix UI/controller state-flow problems
1. `PK-UI-001`
2. `PK-UI-002`
3. `PK-UI-003`
4. `PK-UI-004`
5. `PK-UI-005`
6. `PK-UI-006`
7. `PK-UI-007`
8. `PK-UI-008`

### Phase 5: Resolve dormant / half-built systems
1. `PK-REPO-002`
2. `PK-REPO-003`
3. `PK-REPO-004`
4. `PK-REPO-005`
5. `PK-REPO-006`
6. `PK-REPO-007`

### Phase 6: Deployment, performance, and guardrails
1. `PK-REPO-008`
2. `PK-REPO-009`
3. `PK-REPO-010`
4. `PK-REPO-011`

---

## Short Version for an Agent

The repo’s main problem is not one isolated bug. It is a set of cross-layer inconsistencies:
- the engine sometimes resolves the wrong timing/order,
- the card layer sometimes shows one context and resolves another,
- the UI/controller can drift away from authoritative state,
- and several app-shell systems exist only as half-wired scaffolding.

Stabilize build + persistence contracts first, then fix authoritative engine behavior, then make card context stable, then repair UI flow, then either wire or remove dormant systems.
