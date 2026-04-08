# CLAUDE.md — Agent Working Instructions

## Project Identity
**Crown & Council** — a mobile-first kingdom management card game built with React + TypeScript + Vite + Tailwind CSS. Every player interaction is mediated through cards. A deep simulation engine runs beneath a tactile card-based interface.

## Architecture

### Engine Layer (`src/engine/`)
Pure TypeScript. Zero UI imports. Zero React. This is the simulation brain.
- `types.ts` — all interfaces, enums, and the `GameState` root type
- `constants.ts` — all numeric tuning constants
- `systems/` — 11 system modules (treasury, food, population, military, diplomacy, espionage, faith, knowledge, regions, trade, decree-progression). Each is a collection of pure functions.
- `events/` — event engine, storyline engine, follow-up tracker, narrative pacing, outcome variance, effect application
- `resolution/` — turn resolution pipeline (the 11-phase orchestrator), action budget, effect application

**Rules for engine code:**
- Never add React imports
- Never add UI concerns or player-facing text
- All functions are pure: state in, state out
- Player-facing text lives in `src/data/text/`

### Data Layer (`src/data/`)
Static game content. Events, decrees, storylines, scenarios, construction, knowledge, text.
- `events/index.ts` + `events/effects.ts` — event definitions and their mechanical effects
- `decrees/index.ts` + `decrees/effects.ts` — decree definitions and effects
- `storylines/index.ts` + `storylines/effects.ts` — storyline definitions and effects
- `scenarios/` — 5 scenario starting configurations
- `construction/index.ts` — building definitions
- `knowledge/index.ts` — tech tree definitions
- `text/` — all player-facing text (event narratives, labels, reports, outcome narratives)

**Rules for data code:**
- Data files export arrays/records of definition objects
- Effect files export maps from IDs to `MechanicalEffectDelta` objects
- Text files export maps from IDs to strings or string templates
- No logic beyond simple lookups

### Bridge Layer (`src/bridge/`)
Connects engine output to card system input. Translates between simulation state and card definitions.
- `eventClassifier.ts` — classifies events as crisis or petition cards
- `crisisCardGenerator.ts` — generates crisis phase cards from engine state
- `petitionCardGenerator.ts` — generates petition phase cards
- `decreeCardGenerator.ts` — generates decree phase cards
- `summaryGenerator.ts` — generates summary phase content
- `advisorGenerator.ts` — generates Phase 0 advisor briefings
- `decisionMapper.ts` — maps player card decisions back to engine actions

### UI Layer (`src/ui/`)
React components. Card-based interface. Mobile-first.
- `components/` — Card, CardTitle, CardBody, EffectStrip, StatsBar, PhaseIndicator, etc.
- `phases/` — one component per round phase (SeasonDawn, CrisisPhase, PetitionPhase, DecreePhase, SummaryPhase)
- `hooks/` — useSwipe, useGameState, useSave
- `context/` — GameContext (wraps engine GameState + dispatch)
- `RoundController.tsx` — phase sequencer
- `App.tsx` — root component

## Key Design Decisions

### Everything is a card
No menus, no modals, no sidebars. Stats are a pull-down card. Settings would be a card. The codex would be a card stack. If it's on screen, it's shaped like a card.

### Three phases per round
1. **Morning Court (Crisis)** — one major event, player picks from 2–4 response cards
2. **Audience Chamber (Petitions)** — 1–5 quick yes/no cards, swiped left/right
3. **Royal Council (Decrees)** — horizontal spread, player picks up to 3

Plus Phase 0 (Season Dawn — atmospheric + advisor briefing) and Phase 4 (Summary — narrative + stat deltas).

### No animation library
All animations are CSS keyframes + transitions. Swipe physics use raw touch events. This is a hard constraint — do not add framer-motion, react-spring, or similar.

### The engine is sacred
The 11-phase turn resolution pipeline, all system modules, and the data layer represent months of work. The conversion changes how the player interacts with the simulation, not how the simulation works. When modifying engine code, changes should be minimal and additive (new exports, new optional fields) — never restructure existing resolution logic.

## File Naming Conventions
- Components: PascalCase (`Card.tsx`, `StatsBar.tsx`, `CrisisPhase.tsx`)
- Hooks: camelCase with `use` prefix (`useSwipe.ts`, `useGameState.ts`)
- Engine modules: kebab-case (`turn-resolution.ts`, `event-engine.ts`)
- Data files: kebab-case or `index.ts` inside named directories
- Types: collected in `types.ts` files, exported with PascalCase names

## Styling
Tailwind CSS utility classes configured with the design tokens from `ui-ux-blueprint.md §2`. For complex one-off styles (card gradients, accent lines), inline styles are acceptable. No CSS modules, no styled-components, no CSS-in-JS libraries.

## Build Commands
```
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # production build
npx tsc --noEmit     # type check without emitting
npm run lint         # ESLint check
```

## Testing Mental Model
Since the game is mobile-first and gesture-heavy, testing requires actually playing on a phone. The key test scenarios:
1. Can you complete a full round (all 5 phases) without confusion?
2. Does petition swipe work reliably? (threshold, spring-back, commit)
3. Do crisis response selections feel responsive? (two-step: select then confirm)
4. Does the decree spread scroll smoothly and snap correctly?
5. Do stat changes in the summary match what you'd expect from your decisions?
6. Does the game feel different after 10 rounds vs. round 1? (pacing, complexity growth)

## Current Conversion Phase
Check `PHASES.md` for the current phase of the conversion. Always complete the current phase before starting the next one. Each phase produces a testable result.

## Event Pool Rules
- Events with `triggerConditions: [{ type: 'always' }]` that are standalone (chainId: null, chainStep: null) MUST live in `FOLLOW_UP_POOL`, never `EVENT_POOL`.
- `EVENT_POOL` events must have at least one meaningful trigger condition beyond `always`.
- `FOLLOW_UP_POOL` events are only surfaced by the follow-up tracker, never by `surfaceEvents()`.
- When adding a new follow-up event, always add the corresponding `followUpEvents` entry on the parent event definition.

## Common Pitfalls
- **Don't add animation libraries.** CSS keyframes + transitions + JS touch events handle everything.
- **Don't modify engine resolution order.** The 11-phase pipeline is carefully sequenced. If you need to add card-system logic, add it in Phase 11 (bookkeeping) or as a post-resolution step.
- **Don't put player-facing text in engine files.** Text lives in `src/data/text/`. Engine files use internal codes and IDs.
- **Don't create separate CSS/JS files for card components.** Everything is single-file components with Tailwind classes and inline styles where needed.
- **Don't make the phase indicator interactive.** Phases are strictly sequential. The player cannot navigate between phases.
- **Don't forget the bridge layer.** The UI never reads engine state directly to generate cards. The bridge layer translates engine state into card definitions. This keeps the engine and UI decoupled.
