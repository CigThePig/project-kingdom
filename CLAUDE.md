# Crown & Council — Project Guide

## Overview

A TypeScript/React kingdom-management strategy game, mobile-first. The player rules a medieval kingdom by resolving a sequence of cards each month (crises, petitions, decrees, negotiations). Decisions ripple through a simulation engine tracking population, treasury, military, faith, food, diplomacy, and espionage.

**Current work:** 15-phase Crown & Council expansion. Design spec: `docs/CROWN_AND_COUNCIL_EXPANSION.md`. Task list: `docs/EXPANSION_TASKS.md`.

---

## Tech Stack

| Tool | Version |
|---|---|
| React | 18 |
| TypeScript | 5.5 |
| Vite | 5 |
| Vitest | 4 |
| TailwindCSS | 4 |

---

## Dev Commands

```bash
npm run dev        # start Vite dev server
npm test           # run full Vitest suite (single run)
npm run test:watch # run Vitest in watch mode
npm run build      # tsc -b && vite build (production)
npm run lint       # ESLint check
npm run format     # Prettier format
tsc --noEmit       # type-check only, no emit
```

**Phase gate:** before advancing to the next phase, all three must pass: `npm test && npm run lint && npm run build`.

---

## Architecture

Four layers with strict one-way data flow:

```
src/engine/     Pure simulation — no UI, no React, no I/O
src/bridge/     Card generators and data compilers (engine → UI boundary)
src/ui/         React components and phase screens
src/data/       Authored content (scenarios, events, decrees, text, cards)
```

### `src/engine/`

- `types.ts` — all core TypeScript interfaces and enums (`GameState`, `NeighborState`, `RegionState`, etc.)
- `constants.ts` — numeric constants
- `systems/` — pure functions per subsystem (diplomacy, espionage, faith, food, military, population, regions, treasury, knowledge, rival-simulation, etc.)
- `resolution/` — turn resolution pipeline (`turn-resolution.ts`, `apply-action-effects.ts`, `action-budget.ts`)
- `events/` — event engine and storyline handling
- `cards/` — unified card schema (Phase 4+): `types.ts`, `adapters.ts`, `combos.ts`

### `src/bridge/`

Card generators (`crisisCardGenerator`, `petitionCardGenerator`, `decreeCardGenerator`, `negotiationCardGenerator`, `advisorGenerator`, `assessmentCardGenerator`, `diplomaticOvertureGenerator`) and compilers (`dossierCompiler`, `codexCompiler`, `contextExtractor`). Also `nameResolver.ts` (Phase 1) for all neighbor display-name lookups.

### `src/ui/`

- `phases/` — one component per game phase (TitleScreen, SeasonDawn, MonthDawn, CrisisPhase, PetitionPhase, DecreePhase, CourtBusiness, NegotiationPhase, AssessmentPhase, SummaryPhase, GameOverScreen)
- `components/` — reusable components (Card, CardBody, StatsBar, EffectStrip, CodexOverlay, CourtHandPanel, etc.)
- `hooks/` — `useSave`, `useSwipe`

### `src/data/`

- `scenarios/` — game scenarios (default, faithful-kingdom, fractured-inheritance, frozen-march, merchants-gambit)
- `events/`, `decrees/`, `storylines/` — authored content
- `text/` — all labels and templates (chronicle, dossier, codex, word-banks, name-generation)
- `cards/` — hand-card and court-opportunity definitions (Phase 5+)
- `advisors/`, `initiatives/`, `world-events/` — expansion content

### `src/context/`

- `game-context.tsx` — main `GameState` React context, reducer, and `LOAD_SAVE` save-migration logic

### Tests

`src/__tests__/` — Vitest test files, one per system or feature.

---

## Design Rules

These bind every phase. Violations are rejected.

1. **Internal IDs are forever; display strings are disposable.** Every entity (neighbors, regions, advisors, agents) has a stable ID. All display text is derived at render time via `nameResolver` helpers. Internal IDs never change.

2. **The card is the unit of player attention.** Every decision surfaces as a card. No new screens, no new modals. New systems surface as new card families or context lines on existing cards.

3. **Depth via set-and-forget, not micro.** New controls (advisor appointments, regional postures, initiatives) are infrequent high-leverage choices whose effects play out automatically. No per-turn panels.

4. **Each phase is shippable.** Every phase ends with `npm test && npm run lint && npm run build` all green and no half-implemented features visible.

5. **Save compatibility is non-negotiable.** Every new `GameState` field ships with a migration shim in the `LOAD_SAVE` case of `src/context/game-context.tsx`. Bump the `version` integer per phase. Test loading a pre-expansion save.

6. **Rival simulation must be legible.** Every rival behavior is downstream of real state. Intelligence operations surface this hidden state. Never a coin flip with flavor text.

7. **Performance budget.** Per-turn resolution ≤ 100ms on mid-tier mobile. Rival simulation ≤ 10ms per rival. World event spread ≤ 5ms. Combo detection ≤ 5ms.

---

## Neighbor Display Names

All neighbor display lookups go through `src/bridge/nameResolver.ts`. Never read `NEIGHBOR_LABELS[id]` directly at call sites — use `getNeighborDisplayName(id, state)` and siblings. The static `NEIGHBOR_LABELS` map is the fallback inside the resolver, not a public API.

---

## Phase Roadmap

| # | Phase | Key new files |
|---|---|---|
| 1 | Procedural Naming System | `src/data/text/word-banks.ts`, `src/data/text/name-generation.ts`, `src/bridge/nameResolver.ts` |
| 2 | Rival Kingdom Simulation Core | `src/engine/systems/rival-simulation.ts` |
| 3 | Rival Agendas & Memory | `src/engine/systems/rival-agendas.ts`, `rival-memory.ts` |
| 4 | Unified Card Schema | `src/engine/cards/types.ts`, `adapters.ts` |
| 5 | Hand & Draft Mechanics | `src/engine/systems/court-hand.ts`, `src/ui/components/CourtHandPanel.tsx` |
| 6 | Card Combos & Synergies | `src/engine/cards/combos.ts`, `src/data/cards/combos.ts` |
| 7 | Card Content Expansion (80+) | `src/data/events/expansion/`, `src/data/decrees/expansion-wave-2/` |
| 8 | Council & Advisor System | `src/engine/systems/advisors.ts`, `src/data/advisors/` |
| 9 | Regional Governance Stances | `src/engine/systems/regional-posture.ts` |
| 10 | Long-Term Initiatives | `src/engine/systems/initiatives.ts`, `src/data/initiatives/` |
| 11 | Inter-Kingdom Diplomacy | `src/engine/systems/inter-rival.ts` |
| 12 | Dynamic World Events | `src/engine/systems/world-events.ts`, `src/data/world-events/` |
| 13 | Diplomacy Overhaul | rich bond types in `src/engine/systems/diplomacy.ts` |
| 14 | Intelligence Network Depth | `src/engine/systems/agents.ts` |
| 15 | Victory Conditions & Legacy | `src/engine/systems/victory.ts`, `src/engine/systems/legacy.ts` |

**Phase dependencies:** 4 must precede 5, 6, 7. 2 must precede 3 and 11. 15 lands last.

---

## Adding a New Phase

1. Read `docs/EXPANSION_TASKS.md` for the task list for that phase.
2. Add new `GameState` fields as **optional** in `src/engine/types.ts`.
3. Add migration defaults in `LOAD_SAVE` in `src/context/game-context.tsx`.
4. Add new engine systems as pure functions in `src/engine/systems/`.
5. Wire into `src/engine/resolution/turn-resolution.ts`.
6. Add bridge generators/compilers in `src/bridge/`.
7. Add UI only via existing card families or new Codex sections in `src/ui/components/codex/`.
8. Add tests in `src/__tests__/<system-name>.test.ts`.
9. Run phase acceptance: `npm test && npm run lint && npm run build`.
