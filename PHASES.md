# Game Implementation Phases

Progress tracker for turning the kingdom simulation from demo scaffold into a fully playable game. The original scaffold phases (0–14) are complete — all architecture, engine systems, UI screens, data layer, and styling are in place. These phases focus on making everything functional, interactive, and content-rich.

**How to use:**
- Check off items as they are completed: `- [ ]` → `- [x]`
- Work top-to-bottom. Complete one phase before starting the next.
- Each phase lists the blueprint section to read **before** writing any code.
- Status key: 🔴 Not Started · 🟡 In Progress · 🟢 Complete

---

## Phase 1 — Action Effect Resolution

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Action Types (§ all 10 action types), Turn Resolution Phase 2

The most critical gap. Player actions can be queued but don't fully alter game state on resolution. Complete the mechanical effect application for all action types in turn resolution Phase 2.

**Files modified:**
- `src/engine/resolution/apply-action-effects.ts` — new file; implements `ApplyActionEffectsFn` with all 10 action type handlers
- `src/engine/constants.ts` — Block 16 added: action effect constants for decree deltas, research directive costs, diplomatic deltas, religious edict deltas, construction defaults
- `src/ui/hooks/use-turn-actions.ts` — wired real `applyActionEffects` as default instead of identity stub

**Checklist:**
- [x] Decree execution: apply resource costs, immediate effects, and delayed effect scheduling
- [x] Policy changes: apply standing policy modifications (taxation, recruitment, trade openness, rationing, research focus, religious tolerance, festival investment, intelligence funding, labor allocation)
- [x] Military orders: change recruitment level, readiness target, deployment posture, force composition
- [x] Trade actions: initiate/cancel trade agreements, adjust import/export, apply economic stabilization
- [x] Diplomatic actions: send envoys, propose treaties, issue ultimatums, break agreements
- [x] Intelligence operations: initiate covert ops with success probability, cost deduction, risk tracking
- [x] Religious edicts: fund festivals, invest in religious orders, address heterodoxy, establish observances
- [x] Research directives: apply one-time research burst at elevated treasury cost
- [x] Construction initiation: begin multi-turn projects with resource commitment and region assignment
- [x] Crisis responses: execute event-linked reactive decisions (free or slot-consuming per event rules)
- [x] Verify end-to-end: queue a decree, advance turn, confirm game state changes in reports

---

## Phase 2 — Event & Storyline Mechanics

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Event Framework, Storyline System, Event-to-Decree Routing

Events and storylines must apply mechanical effects to game state, not just display text. Complete the stub functions in both engines.

**Files modified:**
- `src/engine/types.ts` — added `MechanicalEffectDelta`, `PersistentConsequence`, extended `GameState` with `persistentConsequences`, `resolvedStorylineIds`, `lastStorylineActivationTurn`
- `src/engine/events/apply-event-effects.ts` — new file; core effect applicator, event choice effects, storyline branch/resolution effects
- `src/data/events/effects.ts` — new file; `EVENT_CHOICE_EFFECTS` mapping all 26 events (~70 choices) to mechanical deltas
- `src/data/storylines/effects.ts` — new file; `STORYLINE_CHOICE_EFFECTS` and `STORYLINE_RESOLUTION_EFFECTS` for all 6 storylines
- `src/engine/resolution/apply-action-effects.ts` — enhanced `applyCrisisResponseEffect` with mechanical effects, persistent consequences, and storyline branch decision handling
- `src/engine/resolution/turn-resolution.ts` — Phase 9 now applies storyline resolution effects, tracks resolved storyline IDs, passes proper history to `evaluateStorylinePool()`
- `src/data/scenarios/default.ts` — initialized new `GameState` fields
- `src/engine/constants.ts` — bumped `SAVE_SCHEMA_VERSION` to 2

**Checklist:**
- [x] `resolveEventChoice()`: apply choice effects to game state (treasury, food, class satisfaction, faith, stability, military, diplomacy deltas)
- [x] `advanceEventChains()`: progress multi-step event chains based on prior choices, surface next chain event when delay expires
- [x] Event mechanical effects: map event choice outcomes to concrete system changes (not just text)
- [x] `evaluateStorylinePool()`: check activation conditions against current game state, select and activate qualifying storylines (max 2 active, 3-turn spacing)
- [x] `advanceStorylines()`: progress active storylines through branch points, apply dormant-turn status updates, trigger resolution events
- [x] Storyline branch choice resolution: apply narrative-driven mechanical consequences (class satisfaction shifts, faith changes, diplomatic changes, regional effects)
- [x] Storyline resolution: close completed storylines, archive narrative summary, apply final mechanical consequences
- [x] Persistent consequences: events and storylines leave lasting marks on systems, regions, relations, future event pools
- [x] Verify: play 10+ turns, confirm events chain correctly and storylines activate and progress

---

## Phase 3 — AI Neighbors & Conflict Resolution

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Diplomacy System (AI behavior), Military System (Conflict Resolution)

Neighboring kingdoms must be autonomous actors that react to player state, not passive data.

**Files modified:**
- `src/engine/types.ts` — Added `ConflictPhase`, `NeighborActionType` enums; `ConflictState`, `ConflictResolutionOutcome`, `NeighborAction` interfaces; extended `NeighborState` with `lastActionTurn`, `warWeariness`, `isAtWarWithPlayer`; extended `GameState` with `activeConflicts`, `neighborActions`
- `src/engine/constants.ts` — Block 17: AI behavior thresholds, conflict resolution weights, phase transitions, per-turn consequences, resolution thresholds, victory/defeat consequences, trade AI, espionage exposure constants
- `src/engine/systems/diplomacy.ts` — AI autonomous action generation (`generateNeighborActions`, `shouldDeclareWar`), espionage exposure handling, neighbor military/war weariness updates, war declaration/peace resolution applicators
- `src/engine/systems/military.ts` — Combat power calculators (`calculatePlayerCombatPower`, `calculateNeighborCombatPower`), conflict turn resolution, phase advancement, war cost calculation, conflict initiation, conflict consequence application (victory/defeat)
- `src/engine/systems/trade.ts` — Trade AI proposal/withdrawal logic (`shouldProposeTradeAgreement`, `shouldWithdrawTrade`)
- `src/engine/resolution/turn-resolution.ts` — Phases 5b-5e: AI neighbor action generation, action processing, espionage exposure checks, conflict initiation/resolution, neighbor military/weariness updates; Phase 8: conflict stability penalties; Phase 11: activeConflicts/neighborActions in final state
- `src/data/scenarios/default.ts` — Initialized new NeighborState and GameState fields
- `src/data/text/labels.ts` — Labels for ConflictPhase, NeighborActionType, conflict outcomes

**Checklist:**
- [x] AI neighbor behavior: each neighbor evaluates player military strength, diplomatic stance, trade value, stability, intelligence exposure, and religious alignment each turn
- [x] Diplomatic escalation: AI can shift posture (friendly → cautious → hostile → war), propose treaties, break agreements, issue demands
- [x] Trade AI: neighbors propose or withdraw trade based on relationship, resource needs, and merchant class influence
- [x] Military threat: hostile neighbors build forces, issue warnings, and potentially declare war based on player weakness
- [x] Conflict initiation: AI-triggered or player-triggered military conflict with clear cause
- [x] Conflict resolution: outcome based on force size, readiness, equipment, morale, military caste quality, terrain, intelligence advantage, military knowledge, randomness
- [x] Multi-turn conflicts: campaigns that persist across turns with evolving advantage, not single-turn resolution
- [x] Conflict consequences: territory loss/gain, resource costs, population casualties, class satisfaction shifts, diplomatic ripple effects
- [x] Intelligence exposure reaction: neighbors respond to discovered espionage (diplomatic incidents, counter-measures)
- [x] Verify: play 15+ turns, confirm neighbors take visible autonomous actions and conflicts resolve meaningfully

---

## Phase 4 — Win/Loss Conditions & Construction

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Win/Loss Conditions, Development & Infrastructure System

Implement game-ending failure states and the long-term construction investment system.

**Files modified:**
- `src/engine/types.ts` — Added `FailureWarning`, `FailureWarningSeverity` interfaces; added `consecutiveTurnsOverthrowRisk` to `GameState`
- `src/engine/constants.ts` — Added `OVERTHROW_INTRIGUE_THRESHOLD`, `OVERTHROW_CONSECUTIVE_TURNS`; bumped `SAVE_SCHEMA_VERSION` to 4
- `src/engine/systems/population.ts` — Added `checkOverthrow()`, `isOverthrowRiskActive()` functions
- `src/engine/systems/regions.ts` — Added `getOccupiedFraction()` for conquest forecasting
- `src/engine/resolution/turn-resolution.ts` — Phase 10: construction completion effects (region development, treasury, food, military, faith, knowledge, stability, trade bonuses); Phase 11: overthrow detection, failure forecasting with `FailureWarning[]`
- `src/ui/context/game-context.tsx` — Added `isGameOver`, `gameOverConditions` to context state; game-over detection in `TURN_RESOLVED` reducer
- `src/ui/hooks/use-game-state.ts` — Added `useIsGameOver()`, `useGameOverConditions()`, `useGameDispatch()` hooks
- `src/app.tsx` — Game-over overlay rendering with lazy-loaded `GameOver` component
- `src/data/text/labels.ts` — Game-over screen labels, failure warning messages for all 5 conditions
- `src/data/scenarios/default.ts` — Initialized `consecutiveTurnsOverthrowRisk: 0`

**Files created:**
- `src/data/construction/index.ts` — 18 construction project definitions (3 per category) with `ConstructionProjectDefinition` and `ConstructionCompletionEffect` interfaces, `findConstructionDefinition()` lookup helper
- `src/ui/screens/game-over/game-over.tsx` — Game-over screen with failure type, cause report, kingdom assessment, Load Save / New Game actions
- `src/ui/screens/game-over/game-over.module.css` — Full-screen overlay styling with CSS custom properties

**Checklist:**
- [x] Famine detection: food reserves at 0 for 3 consecutive turns with no recovery path
- [x] Insolvency detection: treasury at 0 with negative net flow for 3 consecutive turns
- [x] Collapse detection: stability at 0 for 2 consecutive turns
- [x] Conquest detection: all regions occupied by foreign military
- [x] Overthrow detection: class crisis (noble conspiracy, military coup, popular revolution) reaches final stage
- [x] Failure forecasting: warn player 2 turns before each failure state with increasing urgency
- [x] Game-over screen: display failure type, cause explanation, kingdom assessment summary, option to load save or start new game
- [x] Construction project tracking: multi-turn progress per project (resource commitment, turns remaining, completion percentage)
- [x] Construction Phase 10: advance active projects by 1 turn each resolution, apply persistent effects on completion
- [x] Construction categories: economic, military, civic, religious, scholarly, trade — each with distinct bonuses
- [x] Knowledge-gated construction: certain projects require knowledge milestones as prerequisites
- [x] Verify: deliberately trigger each failure state, confirm game-over flow works; initiate and complete a construction project

---

## Phase 5 — Screen Interactivity

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — individual screen specs; `ux-blueprint.md` — §4 Decision Support, §4.6 Consequence Previewing

All screens must support full player interaction, not just data display.

**Files to modify:**
- `src/ui/screens/decrees/decrees.tsx` — decree commitment with confirmation dialog
- `src/ui/screens/society/society.tsx` — policy changes with one-per-turn enforcement
- `src/ui/screens/military/military.tsx` — military order issuance
- `src/ui/screens/trade/trade.tsx` — trade action initiation
- `src/ui/screens/diplomacy/diplomacy.tsx` — diplomatic action dispatch
- `src/ui/screens/intelligence/intelligence.tsx` — intelligence operation launch
- `src/ui/screens/regions/regions.tsx` — construction project initiation
- `src/ui/screens/knowledge/knowledge.tsx` — research focus selection and directive issuance
- `src/ui/screens/events/events.tsx` — event choice selection and submission
- `src/ui/hooks/use-turn-actions.ts` — support all action types in dispatch
- `src/ui/components/decree-card/decree-card.tsx` — commit button with slot cost display
- `src/ui/components/event-panel/event-panel.tsx` — choice selection UI

**Checklist:**
- [ ] Decrees screen: browse by category, view prerequisites and costs, commit with confirmation for high-impact decrees, see slot cost deducted
- [ ] Policies screen (Society): view all 9 policy types with current settings, change one per turn, show ongoing effects
- [ ] Military screen: issue orders (change posture, recruitment, deployment), see slot cost and effect preview
- [ ] Trade screen: initiate/cancel agreements, adjust import/export, view partner availability filtered by diplomacy
- [ ] Diplomacy screen: send envoys, propose treaties, issue ultimatums, view neighbor profiles with intelligence exposure
- [ ] Intelligence screen: launch operations with success probability display, cost, and risk summary; view reports with confidence indicators
- [ ] Regions screen: initiate construction projects with resource cost and timeline display
- [ ] Knowledge screen: set research focus (policy, no slot), issue research directive (1 slot, elevated cost)
- [ ] Events screen: select and submit event choices, see affected domains and classes, handle storyline branch points
- [ ] Pre-commit reversibility: player can queue, reorder, and cancel actions before advancing time
- [ ] Action slot indicator: show remaining slots updating in real-time as actions are queued
- [ ] Verify: complete a full turn using actions from at least 5 different screens

---

## Phase 6 — Turn Summary & Contextual Feedback

**Status:** 🔴 Not Started
**Blueprint Reference:** `ux-blueprint.md` — §4.10 Turn Advance Ceremony, §3 Information Hierarchy; `ui-blueprint.md` — §5 Right Contextual Intelligence Panel

Build the full feedback loop: what changed, why, and what to look at next.

**Files to modify:**
- `src/ui/screens/dashboard/dashboard.tsx` — turn summary view, cross-screen linking
- `src/ui/components/intelligence-panel/intelligence-panel.tsx` — per-screen contextual content
- `src/ui/components/decree-card/decree-card.tsx` — consequence preview display
- `src/ui/components/event-panel/event-panel.tsx` — consequence preview for choices
- `src/ui/components/forecast-module/forecast-module.tsx` — 1-3 turn projections

**Checklist:**
- [ ] Turn summary view: post-resolution display organized by severity (critical → notable → routine)
- [ ] Change items include: resource deltas, class satisfaction shifts with cause labels, faith/culture changes, intelligence report arrivals with confidence, knowledge milestone unlocks, construction completions, storyline progressions, new events
- [ ] Each change item tappable to navigate to its home screen (cross-screen linking)
- [ ] Dashboard alerts: urgent matters link directly to relevant screens (food shortage → Food report, border tension → Diplomacy)
- [ ] Consequence previews on decree cards: show directional impact on affected domains and classes before committing
- [ ] Consequence previews on event choices: show tradeoffs between options
- [ ] Right panel — Dashboard context: short-horizon forecast, top risk factors, active storyline status
- [ ] Right panel — Decrees context: consequence preview, affected domains/classes, prerequisites breakdown
- [ ] Right panel — Society context: satisfaction factor breakdown, historical trend, risk assessment
- [ ] Right panel — Intelligence context: operation detail with full risk profile, report confidence
- [ ] Right panel — Knowledge context: selected advancement detail, what it unlocks, estimated turns
- [ ] Right panel — Events context: background context, related prior chain events, storyline arc summary
- [ ] Forecast modules: 1-3 turn projections for treasury, food, stability with confidence shading
- [ ] Verify: advance a turn and confirm summary shows meaningful, cause-linked changes across all systems

---

## Phase 7 — Content Expansion

**Status:** 🔴 Not Started
**Blueprint Reference:** `gameplay-blueprint.md` — Event Categories (all), Class-Specific Events, Storyline Categories, Scenario Designs

Expand from demo content to game-quality variety.

**Files to modify:**
- `src/data/events/index.ts` — expand from 26 to 60+ events
- `src/data/decrees/index.ts` — expand from 18 to 30+ decrees
- `src/data/storylines/index.ts` — flesh out all 6 storyline categories with full branching
- `src/data/text/events.ts` — event dispatch text for new events
- `src/data/text/reports.ts` — report templates for new systems

**Files to create:**
- `src/data/scenarios/fractured-inheritance.ts` — The Fractured Inheritance scenario
- `src/data/scenarios/merchants-gambit.ts` — The Merchant's Gambit scenario
- `src/data/scenarios/frozen-march.ts` — The Frozen March scenario
- `src/data/scenarios/faithful-kingdom.ts` — The Faithful Kingdom scenario

**Checklist:**
- [ ] Class-specific events: at least 3 per class (nobility power struggles, clergy disputes, merchant trade conflicts, commoner festivals/plagues, military veteran demands) — 15+ new events
- [ ] Seasonal events: at least 2 per season (spring flooding, summer drought, autumn harvest, winter storms) — 8+ new events
- [ ] Regional events: events tied to specific region conditions — 6+ new events
- [ ] Escalation events: events triggered by prolonged low satisfaction, low faith, or low stability — 6+ new events
- [ ] Knowledge-gated decrees: decrees that unlock only after reaching specific knowledge milestones — 12+ new decrees
- [ ] Storyline fleshing: each of the 6 storylines has at least 2 branch points with 3 choices each, distinct resolution paths, and meaningful mechanical consequences
- [ ] The Fractured Inheritance scenario: succession crisis, divided nobles, separatist region
- [ ] The Merchant's Gambit scenario: trade-focused start, powerful merchant class, weak military
- [ ] The Frozen March scenario: military pressure, harsh climate, strained food
- [ ] The Faithful Kingdom scenario: deeply religious, large clergy, rival faith neighbor
- [ ] Verify: start a new game, play 20+ turns, confirm diverse events appear and at least one storyline activates

---

## Phase 8 — Knowledge Tree Visualization

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — Knowledge screen spec; `gameplay-blueprint.md` — Knowledge & Advancement System

Transform the knowledge screen from data display into a visual interactive tree.

**Files to modify:**
- `src/ui/screens/knowledge/knowledge.tsx` — visual tree layout with nodes and branches
- `src/ui/screens/knowledge/knowledge.module.css` — node styling, progress indicators, dependency lines

**Checklist:**
- [ ] Visual branch layout: all 6 knowledge branches arranged as tree, radial, or horizontal display
- [ ] Node display: each advancement as a node — filled for unlocked, dimmed for locked
- [ ] Progress bars: show progress toward next milestone in each branch
- [ ] Current research focus: highlighted branch with distinct visual treatment
- [ ] Cross-branch dependencies: connecting lines between prerequisites in different branches
- [ ] Milestone unlock indicators: clear visual celebration when milestone reached
- [ ] Node detail on selection: what it unlocks (new decrees, construction, policy options), prerequisites, estimated turns at current investment
- [ ] Scholarly clergy and research infrastructure indicators: show what contributes to research speed
- [ ] Mobile layout: vertically scrollable linear layout instead of spatial tree
- [ ] Verify: advance research over several turns, confirm visual progress updates and milestone unlocks display correctly

---

## Phase 9 — Onboarding & Pacing

**Status:** 🔴 Not Started
**Blueprint Reference:** `ux-blueprint.md` — §5 Onboarding Flow, §5.5 Pacing Modes, §5.4 Glossary and Tooltips

Teach the game progressively instead of overwhelming new players.

**Files to modify:**
- `src/ui/screens/dashboard/dashboard.tsx` — turn 1 guidance integration
- `src/ui/components/crown-bar/crown-bar.tsx` — crown bar explanation tooltip
- `src/ui/components/nav-rail/nav-rail.tsx` — progressive screen visibility
- `src/ui/context/game-context.tsx` — onboarding state tracking, pacing mode
- `src/engine/constants.ts` — deliberate mode action budget (4 slots)

**Files to create:**
- `src/ui/hooks/use-onboarding.ts` — onboarding state and tip management
- `src/data/text/onboarding.ts` — contextual tip text for turns 1-7
- `src/data/text/glossary.ts` — glossary terms and definitions
- `src/ui/components/tooltip/tooltip.tsx` — hover (desktop) / long-press (mobile) tooltip
- `src/ui/components/tooltip/tooltip.module.css`

**Checklist:**
- [ ] Turn 1 guidance: dashboard framing note, crown bar element explanations, guided event response, guided decree commitment, guided time advancement, turn summary explanation
- [ ] Turn 2: introduce Reports, Policies, Society screen (contextual tips, not modal overlays)
- [ ] Turn 3: introduce Regions and Military (triggered by military event or border tension)
- [ ] Turn 4: introduce Trade and Diplomacy (triggered by neighbor interaction)
- [ ] Turns 5-6: introduce Intelligence and Knowledge (triggered by relevant events or advisor notes)
- [ ] Turn 7+: all systems active, first storyline eligible to trigger
- [ ] Progressive nav rail: hide screens not yet introduced, reveal as onboarding progresses
- [ ] Contextual tips: attach to relevant UI surfaces when first encountered, dismiss on interaction
- [ ] Glossary: accessible from settings, covers class mechanics, faith vocabulary, knowledge terms, intelligence terminology
- [ ] Tooltips: hover on desktop, long-press on mobile for unfamiliar terms throughout UI
- [ ] Pacing mode selection: offer Standard (3 slots) or Deliberate (4 slots, reduced event frequency) at game start
- [ ] Verify: start a fresh game and confirm progressive introduction works through turn 7

---

## Phase 10 — Polish & Deployment

**Status:** 🔴 Not Started
**Blueprint Reference:** `ux-blueprint.md` — §10 Mobile UX, §10.5 Accessibility; `ui-blueprint.md` — §2.6 Audio Direction; `TECHNICAL.md` — Deployment

Final quality pass and production deployment.

**Files to modify:**
- `src/ui/components/nav-rail/nav-rail.tsx` — mobile bottom tab bar (Dashboard, Decrees, Events, Society, More)
- `src/ui/components/intelligence-panel/intelligence-panel.tsx` — mobile slide-up sheet
- `src/ui/styles/tokens.css` — responsive breakpoints
- `src/ui/styles/base.css` — accessibility base styles
- `src/app.tsx` — save/load UI integration
- `.github/workflows/deploy.yml` — verify deployment pipeline

**Files to create:**
- `src/ui/components/save-load/save-load.tsx` — manual save, multiple slots, load confirmation
- `src/ui/components/save-load/save-load.module.css`
- `src/assets/audio/turn-advance.mp3` — turn advance sound (optional)

**Checklist:**
- [ ] Mobile bottom tab bar: 5 items (Dashboard, Decrees, Events, Society, More menu) replacing side rail on small viewports
- [ ] Mobile right panel: slide-up sheet accessible from any screen via consistent gesture/button
- [ ] Mobile crown bar: compress to 4 critical values with tap-to-expand
- [ ] Accessibility: keyboard navigation for all interactive elements, ARIA labels, focus management, screen reader compatibility
- [ ] Save/load UI: manual save button in settings, multiple save slots, load with confirmation dialog, clear indication of save location
- [ ] Audio cues: optional turn advance sound (seal stamp / page turn / bell), seasonal transition tone, notification sounds for events and storyline arrivals
- [ ] Audio toggle: accessible from settings, off by default
- [ ] Kingdom assessment: yearly assessment summary evaluating governing style (militarized, mercantile, theocratic, scholarly, civic, balanced)
- [ ] `npm run lint` — fix all ESLint errors
- [ ] `npm run build` — fix all TypeScript errors, verify bundle under 200KB gzipped
- [ ] Deploy to GitHub Pages via GitHub Actions
- [ ] Verify live URL works on Chrome, Firefox, Safari, and mobile devices
- [ ] Full playthrough: complete 20+ turn game testing all major systems end-to-end
