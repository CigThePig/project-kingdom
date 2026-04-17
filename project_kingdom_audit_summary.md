# Project Kingdom Audit Summary

## Overall verdict

The repo has a good architectural skeleton. The split between `data`, `engine`, `bridge`, and `ui` is real and mostly coherent. This is not a junk-drawer codebase.

The problems are concentrated in a few specific fault lines:

- turn resolution / consequence application
- state persistence across turns and saves
- regional systems
- content-to-runtime ID wiring
- bridge translation fidelity
- UI interaction edge cases
- test coverage around the riskiest seams

So the castle is real stone, but several load-bearing arches have cracks running through them.

## Important note

This was a static audit. The repo’s test suite could not be executed in this environment because the uploaded bundle does not include a usable installed Vitest toolchain.

---

## The big picture in one sentence

The game’s main risk is not messy code style. It is **state and consequence drift**: the simulation, content layer, player-facing summaries, and save system can fall out of agreement.

---

# Priority order for fixes

## Tier 1: fix these first

These are the highest-value, highest-risk issues.

### 1. `resolveTurn()` drops persistent state fields
In `turn-resolution.ts`, the next turn state is rebuilt without carrying forward:

- `runSeed`
- `geography`

This can break deterministic behavior, procedural naming consistency, and anything depending on stable world geography.

**Why it matters:** this can distort future turns and save/load behavior.

### 2. Event effects are being applied twice
Crisis/event choices are already resolved inside `apply-action-effects.ts`, but then `turn-resolution.ts` applies event choice effects again in a later phase.

**Why it matters:** stats and consequences can double-apply, and stored `outcomeQuality` can stop matching the actual mechanical result.

### 3. Nested follow-up chains are broken
Follow-up scheduling in turn resolution uses the wrong registry, so follow-up events that themselves spawn later follow-ups can dead-end.

**Why it matters:** major authored event chains quietly stop advancing.

### 4. Save versioning is not really enforced
The repo has conflicting save-version constants, a storage key that still says `v1`, and no meaningful version validation on load.

**Why it matters:** old or incompatible saves can hydrate into current state with no proper guardrail.

### 5. Condition-card runtime ID generation does not match authored content IDs
The runtime lowercases enum names into event IDs, but the content layer uses mixed naming conventions such as:

- `evt_social_banditry_*`
- `evt_social_criminal_*`
- `evt_cond_trade_disruption_*`

These do not line up with generated IDs like:

- `evt_cond_banditry_mild`
- `evt_cond_criminalunderworld_mild`
- `evt_cond_tradedisruption_mild`

**Why it matters:** condition cards can surface with fallback text or broken behavior even though authored content exists.

### 6. Storyline resolution effects are keyed to the wrong decisions
The storyline resolution effect tables are keyed to branch decisions, but the runtime looks them up using the opening decision.

**Why it matters:** major arc payoffs are effectively unreachable.

### 7. Regional banditry is duplicated across two systems
Banditry is represented both in region-local conditions and in global environment conditions. The global version can resolve, but the local version can remain stuck forever.

**Why it matters:** ghost penalties can linger and distort loyalty / condition counts after the real condition is gone.

---

## Tier 2: fix these right after Tier 1

These are serious correctness problems, but slightly less foundational.

### 8. Regional banditry’s food penalty is silently ignored
The condition uses `food.productionModifier`, but the environment effect aggregator only understands `food.production`.

**Why it matters:** the banditry condition does less than it claims.

### 9. Diplomacy merge logic can produce mismatched posture vs score
Event-driven diplomacy changes can update `relationshipScore` without properly re-deriving:

- `attitudePosture`
- `isAtWarWithPlayer`

**Why it matters:** diplomacy state can contradict itself.

### 10. War-state bookkeeping is ordered incorrectly
The code sets `isAtWarWithPlayer` from posture and then re-derives posture afterward.

**Why it matters:** the war flag and the relationship posture can disagree.

### 11. Event-driven region condition changes can be lost
Turn resolution forwards region development changes from action-applied state, but does not preserve full region-condition state.

**Why it matters:** some event effects can appear to apply and then vanish.

### 12. Occupied regions still tick normal loyalty/banditry/infrastructure systems
Regional ticking does not skip `isOccupied` regions consistently.

**Why it matters:** occupied land can keep acting like a normal governed region and generate misleading internal crises.

### 13. Disease severity handling is order-dependent
Population mortality logic says it should use the worst plague/pox severity, but actually uses the first matching condition it encounters.

**Why it matters:** death rates depend on array order, not actual world state.

### 14. Trade disruption emergence is tied to phase duration, not low-trade duration
The system uses `turnsInCurrentPhase` as a proxy for consecutive low-trade turns.

**Why it matters:** disruption can trigger too early, too late, or for the wrong reason.

### 15. Severe Criminal Underworld content is missing
The systems can escalate Criminal Underworld to Severe, but the authored event/text/effect layer only covers Mild and Moderate.

**Why it matters:** late-stage condition escalation has a content hole.

---

## Tier 3: player-facing translation and UI problems

These are not the engine’s deepest cracks, but they directly affect player trust and legibility.

### 16. Bridge generators use unseeded `Math.random()`
Assessment, negotiation, decree, and world-pulse generators use `Math.random()` instead of the seeded run model.

**Why it matters:** player-facing generated content can change across reloads/remounts for the same state.

### 17. Diplomatic overtures disappear from summary previews
Overtures are generated and usable, but the summary generator does not properly include their effects.

**Why it matters:** the player can make a meaningful diplomatic choice and then get a summary that pretends it had no effect.

### 18. Assessment and negotiation summaries can show unresolved `__NEIGHBOR__`
The actual cards resolve neighbor targets, but the summary generator often falls back to raw registry effects containing placeholders.

**Why it matters:** the summary can be less accurate than the card the player just chose.

### 19. Multi-choice petition cards can use static neighbor labels instead of live procedural names
Single-choice petition paths pass `gameState` into neighbor substitution; multi-choice petition paths do not.

**Why it matters:** naming becomes inconsistent within the same run.

### 20. Decrees never really reach the chronicle
The chronicle logger expects decree decisions in `MonthDecision[]`, but decree selections are tracked separately and not passed through that path.

**Why it matters:** royal decrees vanish from the historical record.

### 21. `CrisisPhase` selection state leaks between sequential crisis cards
The same crisis component instance is reused without resetting local selection state when switching to the next crisis.

**Why it matters:** a choice selected on one crisis can still appear selected on the next.

### 22. Codex swipe-to-dismiss can fight normal scrolling
The Codex overlay dismisses on a downward swipe without properly distinguishing dismissal from ordinary reading scroll.

**Why it matters:** the overlay can feel slippery and unreliable on mobile.

### 23. Codex close animation uses an unmanaged timeout
A raw timeout is used for close animation without cleanup.

**Why it matters:** quick close/reopen sequences can cause ghost closes.

### 24. Month Dawn presentation is non-deterministic
The dawn banner shuffles phrase/effect ordering with plain `Math.random()`.

**Why it matters:** the same game state can present differently after reload.

---

## Tier 4: structural and quality issues that should be cleaned up

These are still important, but they are not the first fires to put out.

### 25. Action-budget bookkeeping is recomputed incorrectly in `RoundController`
It sums all slot costs instead of following the real budget rules and uses the older budget object.

### 26. Mid-turn save semantics are implied but not actually supported
The save file stores `isMidTurn`, but the real month/phase/session progression state lives in local UI state and is not persisted.

### 27. Religious order types are flattened into one generic effect
The comments describe different order-type strengths, but the implementation just counts active orders and applies a flat bonus.

### 28. Regional local economy appears to be dead data
Regional production/trade/tax values are calculated and stored but do not seem to materially feed the kingdom economy systems.

### 29. Regional loyalty-warning authored content exists but appears unwired
There is region-warning text content, but the runtime does not appear to surface it as real player-facing events.

### 30. Some chronicle output still reads like debug text
Raw IDs and weakly translated labels appear in some chronicle entries instead of proper narrative phrasing.

---

# What the repo is doing well

This audit was not all thunderclouds. Some parts are genuinely solid.

## 1. The architecture is real
The separation between:

- engine
- data
- bridge
- UI

is meaningful, not decorative.

## 2. Content coverage is better than expected
Regular events, decrees, negotiations, assessments, and most storyline text/effect registries are not a total wreck.

## 3. Geography and rival systems look more intentional than average
Those subsystems seem to have more care and test attention than the average content-heavy project gets.

## 4. The codebase is fixable without a rewrite
These are mostly seam problems, duplicated consequence paths, missing mappings, and merge-order bugs. That is painful, but it is not a full rewrite situation.

---

# Test-suite summary

The tests are misweighted, not useless.

## Stronger coverage
The suite does relatively well on:

- follow-up/content chain integrity
- geography/procedural determinism
- rival systems
- card schema/adapters
- some save migrations

## Weakest coverage
The suite is weak where the repo is actually most dangerous:

- turn resolution correctness
- save/version enforcement
- regional/economic/environmental systems
- bridge translation fidelity
- UI interaction behavior

## Biggest test-suite problem
`turn-resolution.test.ts` is basically a smoke puff where the repo really needs a watchtower.

---

# Recommended fix sequence

If this were my cleanup plan, I would do it in this order.

## Phase A: stabilize the state spine
1. Preserve `runSeed` and `geography` in `resolveTurn()`
2. Enforce real save-version policy
3. Fix action-budget recompute drift
4. Decide whether mid-turn resume exists or not

## Phase B: repair the consequence pipeline
5. Remove duplicate event effect application
6. Fix follow-up scheduling to use the correct registry
7. Fix diplomacy posture/war-flag derivation order
8. Preserve full region-condition changes during turn merge

## Phase C: repair the regional systems
9. Remove duplicated regional banditry ownership
10. Fix the `food.productionModifier` typo
11. Decide and enforce occupied-region behavior
12. Fix disease worst-severity evaluation
13. Track actual low-trade streaks

## Phase D: repair content/runtime joins
14. Replace condition ID string-building with an explicit mapping table
15. Align storyline resolution lookup with authored resolution keys
16. Add Severe Criminal Underworld coverage
17. Wire or prune dead regional warning content

## Phase E: repair bridge truthfulness
18. Seed all bridge-side randomness
19. Make summaries use resolved card payload effects, not raw registries
20. Fix overture summary inclusion
21. Pass decrees into the chronicle
22. Clean up player-facing diplomacy labels and chronicle naming

## Phase F: repair UI edge cases
23. Reset `CrisisPhase` selection between crises
24. Fix Codex swipe/scroll conflict
25. Clean up Codex close timeout
26. Seed Month Dawn presentation

## Phase G: strengthen tests around the real danger zones
27. Add turn-resolution invariant tests
28. Add real follow-up integration tests through `resolveTurn()`
29. Add save/version contract tests
30. Add regional/economic system tests
31. Add bridge correctness tests
32. Add UI interaction tests

---

# Final diagnosis

This repo’s main disease is not chaos. It is **mismatch**.

Mismatch between:

- authored content and runtime IDs
- applied effects and later merges
- seeded simulation and unseeded presentation
- stored state and rebuilt state
- what the player chose and what the summary says happened
- what the tests prove and what the game actually depends on

That is good news in one sense: the project already has structure, which means these issues can be fixed methodically.

The first thing to tackle is the Tier 1 group. Once those are repaired, the rest of the codebase gets dramatically easier to trust.
