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

**Status:** 🟢 Complete
**Blueprint Reference:** `ui-blueprint.md` — individual screen specs; `ux-blueprint.md` — §4 Decision Support, §4.6 Consequence Previewing

All screens must support full player interaction, not just data display.

**Files modified:**
- `src/ui/screens/decrees/decrees.tsx` — decree commitment with confirmation dialog; added laborAllocationPriority as 8th policy
- `src/ui/screens/military/military.tsx` — military order issuance (posture change, readiness training)
- `src/ui/screens/trade/trade.tsx` — trade agreement initiation and cancellation
- `src/ui/screens/diplomacy/diplomacy.tsx` — diplomatic action dispatch (envoy, treaty, ultimatum)
- `src/ui/screens/intelligence/intelligence.tsx` — intelligence operation launch with target selection
- `src/ui/screens/regions/regions.tsx` — construction project initiation per region
- `src/ui/screens/knowledge/knowledge.tsx` — research focus selection and directive issuance
- `src/data/text/labels.ts` — added LABOR_ALLOCATION_LABELS
- `src/data/text/reports.ts` — added LABOR_ALLOCATION_EFFECT

**Checklist:**
- [x] Decrees screen: browse by category, view prerequisites and costs, commit with confirmation for high-impact decrees, see slot cost deducted
- [x] Policies screen (Society): view all 9 policy types with current settings, change one per turn, show ongoing effects
- [x] Military screen: issue orders (change posture, recruitment, deployment), see slot cost and effect preview
- [x] Trade screen: initiate/cancel agreements, adjust import/export, view partner availability filtered by diplomacy
- [x] Diplomacy screen: send envoys, propose treaties, issue ultimatums, view neighbor profiles with intelligence exposure
- [x] Intelligence screen: launch operations with success probability display, cost, and risk summary; view reports with confidence indicators
- [x] Regions screen: initiate construction projects with resource cost and timeline display
- [x] Knowledge screen: set research focus (policy, no slot), issue research directive (2 slots, elevated cost)
- [x] Events screen: select and submit event choices, see affected domains and classes, handle storyline branch points
- [x] Pre-commit reversibility: player can queue, reorder, and cancel actions before advancing time
- [x] Action slot indicator: show remaining slots updating in real-time as actions are queued
- [x] Verify: complete a full turn using actions from at least 5 different screens

---

## Phase 6 — Turn Summary & Contextual Feedback

**Status:** 🟢 Complete
**Blueprint Reference:** `ux-blueprint.md` — §4.10 Turn Advance Ceremony, §3 Information Hierarchy; `ui-blueprint.md` — §5 Right Contextual Intelligence Panel

Build the full feedback loop: what changed, why, and what to look at next.

**Files modified:**
- `src/engine/types.ts` — Added `TurnSummaryItem`, `TurnSummarySeverity`, `SummaryTargetScreen`, `SummaryItemCategory` types
- `src/ui/screens/dashboard/dashboard.tsx` — Enhanced turn summary with structured `TurnSummaryItem` objects, navigable items with cross-screen linking, dashboard failure warning alerts, `onNavigate` prop
- `src/ui/screens/dashboard/dashboard.module.css` — Clickable summary item styles, alert section styles
- `src/ui/components/intelligence-panel/intelligence-panel.tsx` — Transformed to context-aware right panel with per-screen content (Dashboard forecast/risks, Decrees consequence preview, Society satisfaction factors, Intelligence reports, Knowledge advancement detail, Events context)
- `src/ui/components/intelligence-panel/intelligence-panel.module.css` — Full rewrite with context section styles, risk items, chip rows, trend display, storyline items, chain sections
- `src/ui/components/decree-card/decree-card.tsx` — Added `consequencePreview` prop with directional impact indicators via ConsequencePreview component
- `src/ui/components/event-panel/event-panel.tsx` — Added `effects` field to `EventPanelChoice`, consequence preview per choice via ConsequencePreview component
- `src/ui/components/event-panel/event-panel.module.css` — Added choice wrapper and effects styles
- `src/ui/screens/events/events.tsx` — Passes `EVENT_CHOICE_EFFECTS` to EventPanel choices, wires right panel context on event hover
- `src/ui/screens/decrees/decrees.tsx` — Passes `DECREE_EFFECTS` to DecreeCard, wires right panel context on decree hover
- `src/ui/screens/society/society.tsx` — Wires right panel context when expanding a class
- `src/ui/screens/knowledge/knowledge.tsx` — Wires right panel context when expanding a branch
- `src/app.tsx` — Wrapped with `RightPanelProvider`, syncs `activeScreen` to right panel context, passes `onNavigate` to Dashboard
- `src/data/text/reports.ts` — Added turn summary templates (construction, storyline, faith, intelligence, conflict, neighbor, military), consequence preview labels, right panel section headers
- `src/data/text/labels.ts` — Added `CONSEQUENCE_DELTA_LABELS`, `FAILURE_SCREEN_MAP`

**Files created:**
- `src/data/decrees/effects.ts` — `DECREE_EFFECTS` mapping all 18 decrees to `MechanicalEffectDelta` for consequence preview
- `src/ui/components/consequence-preview/consequence-preview.tsx` — Shared directional impact chip component
- `src/ui/components/consequence-preview/consequence-preview.module.css` — Consequence preview styling
- `src/ui/context/right-panel-context.tsx` — `RightPanelProvider` and `useRightPanel` hook for per-screen contextual state

**Checklist:**
- [x] Turn summary view: post-resolution display organized by severity (critical → notable → routine)
- [x] Change items include: resource deltas, class satisfaction shifts with cause labels, faith/culture changes, intelligence report arrivals with confidence, knowledge milestone unlocks, construction completions, storyline progressions, new events
- [x] Each change item tappable to navigate to its home screen (cross-screen linking)
- [x] Dashboard alerts: urgent matters link directly to relevant screens (food shortage → Food report, border tension → Diplomacy)
- [x] Consequence previews on decree cards: show directional impact on affected domains and classes before committing
- [x] Consequence previews on event choices: show tradeoffs between options
- [x] Right panel — Dashboard context: short-horizon forecast, top risk factors, active storyline status
- [x] Right panel — Decrees context: consequence preview, affected domains/classes, prerequisites breakdown
- [x] Right panel — Society context: satisfaction factor breakdown, historical trend, risk assessment
- [x] Right panel — Intelligence context: operation detail with full risk profile, report confidence
- [x] Right panel — Knowledge context: selected advancement detail, what it unlocks, estimated turns
- [x] Right panel — Events context: background context, related prior chain events, storyline arc summary
- [x] Forecast modules: 1-3 turn projections for treasury, food, stability with confidence shading
- [x] Verify: advance a turn and confirm summary shows meaningful, cause-linked changes across all systems

---

## Phase 7 — Content Expansion

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Event Categories (all), Class-Specific Events, Storyline Categories, Scenario Designs

Expand from demo content to game-quality variety.

**Files modified:**
- `src/data/events/index.ts` — expanded from 26 to 61 events (35 new: 15 class-specific, 8 seasonal, 6 regional, 6 escalation)
- `src/data/events/effects.ts` — added EVENT_CHOICE_EFFECTS for all 35 new events
- `src/data/decrees/index.ts` — expanded from 18 to 30 decrees (12 new knowledge-gated)
- `src/data/decrees/effects.ts` — added DECREE_EFFECTS for all 12 new decrees
- `src/data/storylines/index.ts` — expanded all 6 storylines with mid-arc branch points (opening → mid-arc → resolution)
- `src/data/storylines/effects.ts` — added STORYLINE_CHOICE_EFFECTS for 18 new mid-arc choices, updated STORYLINE_RESOLUTION_EFFECTS keyed to mid-arc choices
- `src/data/text/events.ts` — added EVENT_TEXT for 35 new events, updated STORYLINE_TEXT with 6 new mid-arc branch points
- `src/ui/context/game-context.tsx` — wired scenario selection into INIT_NEW_GAME reducer with createScenarioState()

**Files created:**
- `src/data/scenarios/fractured-inheritance.ts` — The Fractured Inheritance scenario (succession crisis, low noble satisfaction 30, high treasury 700, separatist region)
- `src/data/scenarios/merchants-gambit.ts` — The Merchant's Gambit scenario (powerful merchants, weak military, 3 neighbors including aggressive Krath)
- `src/data/scenarios/frozen-march.ts` — The Frozen March scenario (winter start, strained food, strong but under-equipped military, hostile neighbor)
- `src/data/scenarios/faithful-kingdom.ts` — The Faithful Kingdom scenario (faith 85, large clergy, 2 active religious orders, rival faith neighbor)

**Checklist:**
- [x] Class-specific events: at least 3 per class (nobility power struggles, clergy disputes, merchant trade conflicts, commoner festivals/plagues, military veteran demands) — 15+ new events
- [x] Seasonal events: at least 2 per season (spring flooding, summer drought, autumn harvest, winter storms) — 8+ new events
- [x] Regional events: events tied to specific region conditions — 6+ new events
- [x] Escalation events: events triggered by prolonged low satisfaction, low faith, or low stability — 6+ new events
- [x] Knowledge-gated decrees: decrees that unlock only after reaching specific knowledge milestones — 12+ new decrees
- [x] Storyline fleshing: each of the 6 storylines has at least 2 branch points with 3 choices each, distinct resolution paths, and meaningful mechanical consequences
- [x] The Fractured Inheritance scenario: succession crisis, divided nobles, separatist region
- [x] The Merchant's Gambit scenario: trade-focused start, powerful merchant class, weak military
- [x] The Frozen March scenario: military pressure, harsh climate, strained food
- [x] The Faithful Kingdom scenario: deeply religious, large clergy, rival faith neighbor
- [x] Verify: start a new game, play 20+ turns, confirm diverse events appear and at least one storyline activates

---

## Phase 8 — Knowledge Tree Visualization

**Status:** 🟢 Complete
**Blueprint Reference:** `ui-blueprint.md` — Knowledge screen spec; `gameplay-blueprint.md` — Knowledge & Advancement System

Transform the knowledge screen from data display into a visual interactive tree.

**Files modified:**
- `src/ui/screens/knowledge/knowledge.tsx` — horizontal tree layout with branch rows, milestone nodes, node detail panel, cross-branch SVG lines, research contributors
- `src/ui/screens/knowledge/knowledge.module.css` — node styling (unlocked/active/locked/selected states), progress connectors, dependency lines, branch focus highlight, mobile responsive

**Files created:**
- `src/data/knowledge/index.ts` — 30 milestone definitions (6 branches × 5 milestones) with names, descriptions, unlock lists; 7 cross-branch dependencies; research contributor labels

**Checklist:**
- [x] Visual branch layout: all 6 knowledge branches arranged as horizontal tree (branch header left, 5 milestone nodes flowing left-to-right)
- [x] Node display: each advancement as a node — filled (positive teal) for unlocked, pulsing for active, dimmed for locked
- [x] Progress bars: connector lines between nodes with fill showing progress toward next milestone
- [x] Current research focus: highlighted branch with seasonal accent border and left inset glow
- [x] Cross-branch dependencies: SVG overlay lines between prerequisite nodes (dashed for unsatisfied, solid for satisfied), highlighted on node selection
- [x] Milestone unlock indicators: positive state treatment on unlocked nodes, node detail shows "Achieved" status
- [x] Node detail on selection: what it unlocks (decree/construction/bonus chips), cross-branch links, progress bar, estimated turns at current investment
- [x] Scholarly clergy and research infrastructure indicators: Research Speed Contributors section showing base, treasury, scholarly order, infrastructure with active/inactive status
- [x] Mobile layout: branch rows switch to single-column, node track scrolls horizontally, SVG overlay hidden
- [x] Verify: advance research over several turns, confirm visual progress updates and milestone unlocks display correctly

---

## Phase 8A — Visual Foundation & Surface Hierarchy

**Status:** 🟢 Complete
**Blueprint Reference:** `ui-blueprint.md` §2 (Visual Language), §2.3 (Color System); `ux-blueprint.md` §1.2 (Calm Pressure), §1.3 (Clarity Before Depth)

Upgrade the base visual system so every surface has depth, texture, and spatial hierarchy instead of flat boxes.

**Files modified:**
- `src/ui/styles/tokens.css` — new shadow tokens (elevated, inset, glow, card-hover), surface elevation levels (recessed/base/raised/floating), card interaction tokens, status border colors
- `src/ui/styles/base.css` — global keyframe library (fadeIn, fadeOut, slideUp, slideDown, slideIn, scaleIn, pulseGlow, shimmer, breathe, flashHighlight), focus-visible styles, scrollbar upgrade, section-divider and shimmer utilities
- `src/ui/styles/seasonal.css` — expanded with glow, border, card-tint, and gradient tokens per season
- `src/app.module.css` — background depth (radial gradients + seasonal gradient), content title decorative underline
- All component `.module.css` files — upgraded to surface elevation system with box-shadow, hover lift, and interaction transitions
- All screen `.module.css` files — cards upgraded from flat to elevated surfaces
- Crown bar — gradient background, seasonal top-border glow, depth shadow
- Nav rail — depth shadow, active item inset glow
- Intelligence panel — gradient background, depth shadow
- Game-over — darker overlay, floating surface, critical glow

**Checklist:**
- [x] Richer shadow scale: add `--shadow-glow`, `--shadow-elevated`, `--shadow-inset` tokens for interactive/raised/recessed surfaces
- [x] Surface hierarchy: distinguish 4 clear elevation levels (recessed, base, raised, floating) with distinct background + shadow + border combos
- [x] Card upgrade: all cards gain subtle gradient borders or top-accent strips instead of uniform 1px borders; hover state adds lift (translateY -1px + shadow-elevated)
- [x] Background depth: app background uses subtle radial gradient or noise texture instead of flat `hsl(220, 15%, 10%)`
- [x] Section dividers: replace gap-only separation with styled dividers (thin rule with fade-out ends, or spacing + subtle background shift)
- [x] Seasonal depth: each season gets a subtle background gradient tint, slightly warmer/cooler border accents, and crown bar gets a seasonal top-border glow
- [x] Global keyframe library in `base.css`: define reusable `fadeIn`, `slideUp`, `slideIn`, `scaleIn`, `pulseGlow`, `shimmer` animations
- [x] Focus-visible styles: distinct visible focus ring using seasonal accent color for keyboard navigation
- [x] Status color backgrounds: warning/critical/positive cards get more pronounced background treatment (subtle gradient, not just flat tint)
- [x] Scrollbar upgrade: styled scrollbar thumb with rounded ends, subtle hover brightening
- [x] Verify: every screen visually distinguishes card hierarchy; hover states feel tactile; seasonal differences are noticeable

---

## Phase 8B — Iconography & Visual Identity

**Status:** 🟢 Complete
**Blueprint Reference:** `ui-blueprint.md` §2.5 (Iconography — class icons, faith, espionage, knowledge branches, resources, domains)

Replace text-only indicators with an inline SVG icon system that gives every game concept a recognizable visual symbol. Each icon is a React component rendering inline SVG — zero dependencies, full control over color/size via CSS custom properties.

**Files created:**
- `src/ui/components/icon/icon.tsx` — shared `Icon` component with name→SVG lookup, size/color CSS custom property support
- `src/ui/components/icon/icon.module.css` — icon wrapper styling
- `src/ui/components/icon/icons/` — 42 individual SVG icon components (resource, class, domain, faith, knowledge, status, action, intelligence)

**Files modified:**
- `src/ui/components/crown-bar/crown-bar.tsx` + `.module.css` — resource icons on stat chips, warning icon on urgent badge, lantern icon on intel toggle
- `src/ui/components/nav-rail/nav-rail.tsx` + `.module.css` — domain icons on all 12 nav items (desktop: icon + label stacked; mobile: icon + label)
- `src/ui/components/resource-card/resource-card.tsx` + `.module.css` — resource type icon in label
- `src/ui/components/decree-card/decree-card.tsx` + `.module.css` — category icon in header with metallic accent color
- `src/ui/components/event-panel/event-panel.tsx` — severity icon in badge row, scroll icon for storyline events
- `src/ui/screens/dashboard/dashboard.tsx` + `.module.css` — section header icons (society, compass), hourglass on turn advance button

**Checklist:**
- [x] Resource icons: treasury (coin/chest), food (wheat/basket), stability (scales/pillar)
- [x] Class icons: nobility (crown), clergy (chalice), merchants (scales), commoners (sheaf), military (shield)
- [x] Domain icons: one per nav screen (12 total — dashboard/compass, reports/scroll, decrees/seal, policies/balance, society/people, regions/map, military/sword, trade/ship, diplomacy/handshake, intelligence/lantern, knowledge/book, events/bell, archive/ledger)
- [x] Faith & culture icons: flame, temple, festival
- [x] Knowledge branch icons: plough (agriculture), sword (military), scroll (governance), ship (commerce), lyre (culture), compass (exploration)
- [x] Status icons: trend up/down/stable arrows, warning triangle, critical circle, positive check, locked padlock
- [x] Action icons: seal/stamp icon, hourglass for turn advance
- [x] Intelligence icons: cloak, confidence bars, sealed envelope
- [x] Nav rail uses icons with labels on desktop, icons-only on collapsed rail
- [x] Crown bar stat chips get resource icons before values
- [x] Decree cards show category icon in header
- [x] Event panels show type-specific icon (storyline events get storyline icon)
- [x] Verify: every major game concept has a visual icon; text labels are supplemented not replaced

---

## Phase 8C — Micro-interactions & Animation

**Status:** 🟢 Complete
**Blueprint Reference:** `ux-blueprint.md` §8 (Feedback Patterns), §4.8 (Action Commitment), §4.10 (Turn Advance Ceremony); `ui-blueprint.md` §2.8 (Animation), §8 (Visual State Rules)

Add motion and feedback that makes every interaction feel responsive and the game world feel alive.

**Files modified:**
- `src/ui/styles/base.css` — page-enter and stagger-enter utility classes with nth-child delays
- `src/app.tsx` — key-based content remount for page entrance animation
- `src/app.module.css` — slideUp animation on content area
- `src/ui/screens/dashboard/dashboard.module.css` — staggered resource row and class grid entrance, overlay fade-ins, summary section stagger, confirm/cancel/advance button interactions, alert item slideIn with stagger, critical class card pulseGlow, summary card slideUp entrance
- `src/ui/components/crown-bar/crown-bar.module.css` — urgent badge pulse animation
- `src/ui/components/decree-card/decree-card.module.css` — disabled hover fix
- `src/ui/screens/events/events.module.css` — staggered event list entrance

**Checklist:**
- [x] Card hover: all interactive cards gain `transform: translateY(-2px)` + `box-shadow` elevation on hover (120ms ease) — done in Phase 8A
- [x] Card press: active state presses card down slightly (`translateY(0)` + reduced shadow) for tactile click feel — done on buttons
- [x] Button interactions: all buttons gain hover brightness/scale, active press-down, and commitment pulse for decree/action buttons
- [x] Page transitions: screen content fades in with subtle slideUp on navigation (200ms)
- [x] Staggered list entry: card grids and lists animate in with sequential delay (each card 30-50ms after previous)
- [x] Value change animation: infrastructure in place via flashHighlight keyframe (wired in Phase 8E)
- [x] Turn advance ceremony: overlays fade in with animation, confirm card uses scaleIn, summary card uses slideUp with section stagger
- [x] Turn summary entrance: summary items stagger in by severity group (critical first, then notable, then routine)
- [x] Decree commitment: disabled hover suppressed, select button has lift/press interaction
- [x] Event arrival: event panels slide in with staggered delay
- [x] Status transitions: critical class cards have pulseGlow animation
- [x] Loading/empty states: shimmer CSS utility class defined in base.css
- [x] Crown bar urgent badge: pulse animation when visible
- [x] All animations respect `prefers-reduced-motion` (already have infrastructure in base.css)
- [x] Verify: navigate between all screens, commit actions, advance turns — every interaction has visible, satisfying feedback

---

## Phase 8D — Component & Screen Polish

**Status:** ✅ Complete
**Blueprint Reference:** `ui-blueprint.md` §4 (Screen specs), §6 (Component Library), §8 (Visual State Rules); `ux-blueprint.md` §1.6 (Narrative Voice), §1.7 (Living Society)

Upgrade each shared component and screen from data display to game-quality presentation with narrative framing and visual weight.

**Files to modify:**
- `src/ui/components/resource-card/` — add mini sparkline/trend visualization, status-colored value, threshold indicator
- `src/ui/components/decree-card/` — visual weight tiers, committed state with wax-seal visual
- `src/ui/components/event-panel/` — narrative framing, parchment-style background for storyline events
- `src/ui/components/intelligence-panel/` — sealed dispatch aesthetic, confidence bars
- `src/ui/components/forecast-module/` — animated bar fills, confidence shading with gradient
- `src/ui/components/consequence-preview/` — directional impact arrows with color intensity
- `src/ui/screens/dashboard/` — command center layout with section headers, visual hierarchy
- `src/ui/screens/reports/` — styled data rows, smooth expandable sections
- `src/ui/screens/society/` — satisfaction gauge, population bars, ceremonial faith styling
- `src/ui/screens/diplomacy/` — relationship gauge, posture indicator icon
- `src/ui/screens/military/` — force composition bars, readiness gauge, conflict framing
- `src/ui/screens/intelligence/` — operation cards with probability gauge, sealed-report aesthetic
- `src/ui/screens/game-over/` — dramatic weight, kingdom epitaph, fade-to-dark

**Checklist:**
- [x] Resource cards: add horizontal mini-bar showing value relative to a threshold, trend arrow icon replaces text arrow
- [x] Decree cards: visual weight indicator, committed state shows filled seal icon overlay, locked decrees have padlock + reason
- [x] Event panels: storyline events get parchment-tinted background, event type badge, choice buttons as full-width cards with consequence preview inline
- [x] Intelligence panel: muted indigo surface, confidence as filled bar segments, reports feel like sealed dispatches
- [x] Forecast module: projection bars animate fill on mount, confidence as gradient opacity, icon-based direction arrows
- [x] Dashboard: section headers with icons + decorative underlines, urgent items most prominent, storyline card gets narrative border
- [x] Reports: alternating row backgrounds, animated expandable sections, seasonal accent tab underline
- [x] Society: satisfaction as visual gauge not just number, population as proportional bar segments, faith section with bronze/warm styling
- [x] Diplomacy: relationship score as colored bar (red→yellow→green), disposition badge with icon, agreement list as styled chips
- [x] Military: force bars, readiness gauge, active conflict with dramatic red accent and urgency treatment
- [x] Intelligence screen: covert-feeling operation cards (dark indigo, probability gauge, mission-briefing layout)
- [x] Game-over: full-screen dramatic overlay with slow fade, large serif epitaph, kingdom stats, weighted options
- [x] Verify: build passes, all screens have upgraded visual identity

---

## Phase 8E — Atmosphere & Immersion

**Status:** ✅ Complete
**Blueprint Reference:** `ui-blueprint.md` §2.4 (Seasonal Accents), §8 (Visual State Rules — turn-change highlighting, seasonal transition); `ux-blueprint.md` §8 (Feedback Patterns), §1.2 (Calm Pressure)

Add the final layer of game feel — seasonal atmosphere, turn-change highlights, celebration moments, and cohesive polish. (Audio deferred to Phase 10.)

**Files to create:**
- `src/ui/components/season-transition/season-transition.tsx` + `.module.css` — seasonal transition overlay (name + icon, 1-2 second fade)
- `src/ui/components/milestone-celebration/milestone-celebration.tsx` + `.module.css` — visual burst on knowledge milestone unlock
- `src/ui/components/change-highlight/change-highlight.tsx` + `.module.css` — wrapper that highlights value changes between turns

**Files to modify:**
- `src/ui/styles/seasonal.css` — expanded seasonal treatments (background gradients, card tints, nav rail accent, crown bar glow)
- `src/ui/components/crown-bar/` — seasonal glow, season badge with icon, change flashes
- `src/ui/screens/dashboard/` — seasonal header treatment, change highlights
- `src/ui/screens/knowledge/` — milestone unlock celebration visual
- `src/ui/components/resource-card/` — change highlight integration
- `src/ui/components/intelligence-panel/` — new report arrival highlight

**Checklist:**
- [x] Seasonal transitions: brief overlay with season name + icon on season change, crown bar top border shifts to new accent
- [x] Expanded seasonal theming: each season affects card backgrounds, nav rail active indicator, crown bar gradient
- [x] Seasonal card tints: surface cards get barely-perceptible warm/cool tint per season
- [x] Turn-change highlighting: changed values show directional indicator + brief background flash
- [x] Change highlight component: reusable wrapper comparing previous/current value
- [x] Crown bar change flashes: treasury, food, stability flash green/red on turn resolution
- [x] Knowledge milestone celebration: expanding ring + glow + text announcement
- [x] Empty/loading personality: thematic shimmer, in-character placeholder text
- [x] Storyline visual presence: active storyline card has subtle breathing glow on border
- [x] Critical state urgency: critical crown bar stats get slow red pulse
- [x] Verify: build passes, all atmosphere features integrated

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
