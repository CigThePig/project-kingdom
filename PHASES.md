# PHASES.md — Conversion Plan

## Purpose
This document defines the step-by-step plan for converting the existing kingdom management game into the card-based Crown & Council format. Each phase is a self-contained unit of work that produces a testable result. Phases are sequential — do not skip ahead.

## Current State
The existing codebase has:
- A complete simulation engine (`src/engine/`) with 11 system modules, event/storyline engines, and a 1,438-line turn resolution pipeline — **all with zero React/UI coupling**
- A complete data layer (`src/data/`) with events, decrees, storylines, scenarios, construction, knowledge, and text content — ~450KB of authored content
- A full UI layer (`src/ui/`) built for a traditional dashboard/screen navigation paradigm — **all of this is being replaced**
- Blueprint markdown files describing the old format — **all being replaced by new blueprints**

## Conversion Principles
1. **Never break the engine.** The simulation is the hard part and it works. Protect it.
2. **Delete before building.** Remove old UI completely before creating new UI. Don't try to adapt old components.
3. **Vertical slices.** Each phase should produce something playable, even if incomplete.
4. **Test the loop first.** Get the three-phase round cycling before polishing any single phase.

---

## Phase 1 — Clean Slate

### Goal
Remove all old UI code and markdown files. Establish the new project structure. Verify the engine still compiles independently.

### Tasks

**1.1 Delete old UI layer**
Remove the entire `src/ui/` directory:
- `src/ui/components/` (all: bottom-sheet, change-highlight, consequence-preview, crown-bar, decree-card, event-panel, forecast-module, icon, intelligence-panel, milestone-celebration, nav-rail, policy-card, resource-card, season-transition)
- `src/ui/screens/` (all: archive, dashboard, decrees, diplomacy, events, game-over, intelligence, knowledge, military, regions, reports, society, trade)
- `src/ui/hooks/` (use-game-state.ts, use-save.ts, use-turn-actions.ts)
- `src/ui/context/` (game-context.tsx, right-panel-context.tsx)
- `src/ui/styles/` (base.css, seasonal.css, tokens.css)

**1.2 Delete old markdown blueprints**
Remove:
- `gameplay-blueprint.md`
- `ui-blueprint.md`
- `ux-blueprint.md`
- `PHASES.md` (old)
- `TECHNICAL.md`

Replace with the new files:
- `gameplay-blueprint.md` (new — card game design)
- `ui-ux-blueprint.md` (new — card UI/UX)
- `PHASES.md` (this file)
- `CLAUDE.md` (new — agent instructions)

**1.3 Delete old app shell**
Remove:
- `src/app.tsx`
- `src/app.module.css`
- `src/main.tsx`

**1.4 Create new app shell (stub)**
Create minimal files to verify the project still builds:
- `src/main.tsx` — mounts React root
- `src/App.tsx` — renders a single placeholder card: "Crown & Council — Engine Loaded" with the current game state turn number
- `src/styles.css` — inject the CSS keyframes and base tokens from `ui-ux-blueprint.md §2`

**1.5 Install dependencies**
- Verify `react`, `vite`, `typescript` are present (they are)
- Add `tailwindcss` and configure with the design tokens from `ui-ux-blueprint.md §2`
- No other new dependencies

**1.6 Verify engine compilation**
Run `tsc --noEmit` to confirm all engine and data files still compile cleanly. The engine has zero UI imports, so deleting the UI should cause no type errors in the engine. Fix any issues.

### Done When
- `npm run build` succeeds
- The app renders a single card showing game state data from the engine
- No old UI files remain in the project

---

## Phase 2 — Card Foundation

### Goal
Build the base card component system and the three interaction primitives: tap-to-select, swipe-yes/no, tap-to-toggle-from-spread.

### Tasks

**2.1 Base Card component**
Build `src/ui/components/Card.tsx`:
- Props: `family`, `children`, `style`, `onClick`, `className`, `innerRef`
- Renders: background, border, accent line, family badge, content slot, bottom line
- Handles: `:active` press state via CSS

**2.2 Card content components**
Build in `src/ui/components/`:
- `CardTitle.tsx`
- `CardBody.tsx`
- `EffectStrip.tsx` — renders effect hint tokens with color logic
- `SelectionBadge.tsx` — "✓ SELECTED" overlay
- `ConfidenceIndicator.tsx` — for advisor cards

**2.3 Stats Bar component**
Build `src/ui/components/StatsBar.tsx`:
- Collapsed: 44px, shows 4 key stats
- Expanded: full stat list with progress bars
- Toggle on tap, CSS max-height transition

**2.4 Phase Indicator component**
Build `src/ui/components/PhaseIndicator.tsx`:
- Read-only row of phase pills
- Active phase highlighted

**2.5 Swipe hook**
Build `src/ui/hooks/useSwipe.ts`:
- Touch event handlers (touchstart, touchmove, touchend)
- Threshold detection (35% screen width or velocity > 500px/s)
- Spring-back on insufficient drag
- Returns: `{ ref, onTouchStart, onTouchMove, onTouchEnd }`

**2.6 Demo harness**
Wire all components into `App.tsx` as a standalone demo with hardcoded data (similar to the prototype artifact). Verify:
- Cards render correctly with all families
- Swipe gesture works on mobile
- Stats bar toggles
- Phase indicator shows correct state

### Done When
- All card components render with correct styling
- Swipe gesture reliably detects left/right on a phone
- Components match the design tokens from `ui-ux-blueprint.md`
- No game logic is connected yet — purely visual

---

## Phase 3 — Round Loop Skeleton

### Goal
Build the phase sequencer that walks through all 5 phases of a round, and wire it to a minimal game state. No real card content yet — use placeholder data.

### Tasks

**3.1 Round phase types**
Create `src/ui/types.ts`:
```typescript
type RoundPhase = 'seasonDawn' | 'crisis' | 'petition' | 'decree' | 'summary';

interface PhaseDecisions {
  crisisResponse: string | null;
  petitionDecisions: { cardId: string; granted: boolean }[];
  selectedDecrees: string[];
}
```

**3.2 Phase sequencer**
Build `src/ui/RoundController.tsx`:
- State: current phase, accumulated decisions
- Renders the correct phase component based on state
- Each phase component calls `onComplete(decisions)` to advance
- After summary phase, calls engine resolution and starts next round

**3.3 Phase components (placeholder content)**
Build one component per phase in `src/ui/phases/`:
- `SeasonDawn.tsx` — shows season card with hardcoded text
- `CrisisPhase.tsx` — shows 1 crisis card + 3 response cards (hardcoded)
- `PetitionPhase.tsx` — shows 2 swipeable petition cards (hardcoded)
- `DecreePhase.tsx` — shows 4 decree cards in spread (hardcoded)
- `SummaryPhase.tsx` — shows narrative + hardcoded deltas

**3.4 Minimal game state integration**
Create `src/ui/context/GameContext.tsx`:
- Wraps the engine's `GameState`
- Provides dispatch for advancing turns
- Calls `resolveTurn()` from the engine after all phases complete

**3.5 Connect resolution pipeline**
After the player completes all phases with placeholder cards, feed the placeholder decisions into the engine's `resolveTurn()` function. Display the resulting state on the summary screen. Verify that:
- Turn number advances
- Season rotates
- Treasury/food/stability values change

### Done When
- Player can tap/swipe through all 5 phases with placeholder cards
- At the end of a round, the engine resolves and state visibly changes
- The loop repeats (Phase 0 of next round starts)
- Stats bar reflects real engine state

---

## Phase 4 — Card Pool Bridge

### Goal
Connect the engine's event system, decree definitions, and storyline system to the card rendering layer. Real cards replace placeholder data.

### Tasks

**4.1 Event-to-card classifier**
Build `src/bridge/eventClassifier.ts`:
- Takes an `EventDefinition` from the data layer
- Classifies it as `crisis` or `petition` based on severity:
  - Critical, Serious → crisis
  - Notable, Informational → petition
- Returns the appropriate card family and formats the event data into a `CardDefinition`

**4.2 Crisis card generator**
Build `src/bridge/crisisCardGenerator.ts`:
- Queries the event engine for events that pass trigger conditions this turn
- Filters for crisis-tier events
- Selects one using the narrative pacing system
- Generates the crisis card + response cards from the event definition's choices
- Falls back to a notable event if no crisis-tier events qualify

**4.3 Petition card generator**
Build `src/bridge/petitionCardGenerator.ts`:
- Queries the event engine for petition-tier events
- Generates faction request cards based on satisfaction thresholds
- Includes neighbor action cards (trade offers, treaty proposals, minor incidents)
- Applies pacing rules to select 1–5 petitions
- Formats each into a petition `CardDefinition` with grant/deny effects

**4.4 Decree card generator**
Build `src/bridge/decreeCardGenerator.ts`:
- Queries the decree data layer for available decrees
- Filters by prerequisites, cooldowns, one-time status
- Generates policy change cards from current policy state
- Generates construction cards from available buildings
- Generates military/diplomatic/espionage/religious action cards
- Formats all into decree `CardDefinition`s with slot costs

**4.5 Summary generator**
Build `src/bridge/summaryGenerator.ts`:
- Takes pre-resolution and post-resolution game state
- Computes deltas for all tracked stats
- Generates a narrative summary string from the text layer
- Checks for legacy card triggers (milestones, storyline resolutions, ruling style thresholds)

**4.6 Advisor briefing generator**
Build `src/bridge/advisorGenerator.ts`:
- Checks for pending intelligence reports
- Checks for diplomatic intelligence
- Checks for failure condition warnings
- Generates 0–1 advisor cards for Phase 0

**4.7 Wire generators to phase components**
Replace hardcoded data in all phase components with output from the generators. Each round:
1. Phase 0: advisor generator → season dawn content
2. Phase 1: crisis generator → crisis card + response cards
3. Phase 2: petition generator → petition cards
4. Phase 3: decree generator → decree card spread
5. Phase 4: summary generator → narrative + deltas + legacy

**4.8 Decision-to-action mapper**
Build `src/bridge/decisionMapper.ts`:
- Takes the player's crisis response choice, petition decisions, and decree selections
- Maps them into the engine's effect application format
- Feeds them into the resolution pipeline

### Done When
- Real events from the data layer appear as crisis and petition cards
- Real decrees from the data layer appear in the decree spread
- Player decisions produce real mechanical effects via the engine
- The game is playable end-to-end with actual content
- Follow-up events and storyline progression work across multiple rounds

---

## Phase 5 — Ruling Style and Card Pool Dynamics

### Goal
Implement the ruling style tracking system and make it influence card pool generation.

### Tasks

**5.1 Ruling style state**
Add to game state:
```typescript
interface RulingStyleState {
  axes: Record<StyleAxis, number>;  // -50 to +50
  recentDecisions: StyleDecision[]; // rolling window of last 20
}
```

**5.2 Style tag assignment**
Add `flavorTags` to existing event choice effects, decree definitions, and petition outcomes. Each tag maps to one or more style axis shifts.

**5.3 Style accumulation logic**
After each round's decisions are resolved, update the rolling window and recalculate axis values.

**5.4 Style-based card filtering**
Modify the decree card generator to weight cards by alignment with dominant style. Modify the event engine's selection to favor events that test the player's style.

**5.5 Style-based faction modifiers**
Add ruling style axis values as inputs to the population satisfaction delta calculations.

**5.6 Legacy card triggers**
When any axis crosses ±30 or ±45, generate a Legacy card for the summary phase.

### Done When
- Ruling style axes accumulate based on player decisions
- Decree pool is visibly influenced by established style
- Legacy cards appear when style thresholds are crossed
- Faction satisfaction is modulated by ruling style

---

## Phase 6 — Event Classification Audit

### Goal
Audit all existing event definitions, storyline definitions, and decree definitions. Tag every piece of content for the card system.

### Tasks

**6.1 Event severity audit**
Review all events in `src/data/events/index.ts` and verify severity assignments map correctly to crisis/petition classification.

**6.2 Petition-appropriate event identification**
Some events currently classified as Serious may work better as petitions. Some Informational events may be too trivial to show. Reclassify where needed.

**6.3 Effect hint generation**
For every event choice, decree, and petition outcome, verify that the `MechanicalEffectDelta` can be summarized into readable effect hint tokens for the card strip.

**6.4 Storyline card integration**
Verify all storyline branch points generate proper crisis cards. Verify storyline resolution effects produce proper legacy cards.

**6.5 Faction request templates**
Create petition card templates for each faction at various satisfaction thresholds. These don't exist in the current data layer — they need to be authored.

**6.6 Neighbor action card templates**
Create card templates for each `NeighborActionType`. Map severity: war declarations → crisis, trade proposals → petition, etc.

### Done When
- Every piece of content in the data layer has correct card classification
- No event or decree is missing effect hints
- Faction request and neighbor action card templates exist
- The full content library works with the card system

---

## Phase 7 — Polish and Pacing

### Goal
Tune the player experience: animation feel, pacing, difficulty curve, and mobile performance.

### Tasks

**7.1 Animation tuning**
Play through 20+ rounds on a phone. Adjust:
- Stagger timing
- Transition durations
- Swipe threshold sensitivity
- Spring-back feel
- Phase transition pacing

**7.2 Petition volume tuning**
Verify early rounds have 1–2 petitions, mid-game has 2–4, late-game has 3–5. Adjust pacing parameters.

**7.3 Decree pool sizing**
Verify early decree pools are small (5–8 cards) and grow with tech/storyline progression. Tune filtering.

**7.4 Crisis severity curve**
Verify early crises are moderate, mid-game crises are harder, late-game crises chain together. Adjust event trigger conditions if needed.

**7.5 Reduced motion support**
Add `prefers-reduced-motion` media query. Provide tap-based fallback for petition swipe.

**7.6 Performance audit**
Profile on a mid-range phone. Ensure:
- No animation jank
- No layout thrashing
- Card generation < 16ms
- Resolution pipeline < 100ms

**7.7 Save/load integration**
Implement auto-save after each round. Implement mid-round save on app background. Implement load game flow.

### Done When
- The game feels good to play on a phone for 30+ minutes
- Pacing feels natural across a full reign
- Performance is smooth on mid-range hardware
- Save/load works reliably

---

## Phase 8 — Title Screen and Scenario Select

### Goal
Build the game entry flow using the card metaphor.

### Tasks

**8.1 Title card**
A single card with the game title, "New Game" and "Continue" options.

**8.2 Scenario select**
Scenario cards in a horizontal spread (like decree selection). Each shows scenario name, description, and starting conditions summary. Tap to select, confirm to start.

**8.3 Load game**
If a save exists, "Continue" on the title card resumes from the saved state.

**8.4 Game over sequence**
When a failure condition triggers, a special crisis card sequence plays: warning → final event → game over card showing reign length and score. "View Reign Summary" expands to a detailed card stack. "New Game" returns to title.

### Done When
- Full game flow from title to gameplay to game over and back
- All 5 scenarios are selectable and start correctly
- The entire experience never leaves the card metaphor
