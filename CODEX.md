# CODEX

This file is the primary reference for all development on this project. Read it at the start of every Claude Code session before making any changes. When in doubt about a decision, check the relevant blueprint first.

---

## Project Overview

This is a **kingdom management simulation game** — a single-player, turn-based sandbox where the player rules a kingdom through decrees, policies, and structured decisions. The kingdom is a living society with distinct social classes, religious traditions, accumulated knowledge, and hidden threats, not merely a resource ledger.

The player governs by evaluating information, selecting priorities, and issuing responses within a limited action budget each turn. The game is text-forward and information-dense. It does not rely on animated world scenes or real-time interaction. Neighboring kingdoms are AI-driven. There is no multiplayer component.

A single turn targets two to five minutes of real time. A full sandbox run targets forty to eighty turns across four to six hours of play.

The game is built as a static web application and hosted on GitHub Pages.

---

## Blueprint Map

The three blueprint files are the authoritative source of design intent. Before implementing any feature, read the relevant section of the appropriate blueprint.

| File | What It Owns |
|------|-------------|
| `gameplay-blueprint.md` | Simulation rules, turn model, game loop, resource systems, population classes, faith and culture, espionage, knowledge tree, action budget, turn resolution order, event framework, storyline system, win/loss conditions, scenario designs, save model |
| `ui-blueprint.md` | Screen inventory (12 screens), global layout zones (crown bar, nav rail, content chamber, right panel), shared component library, visual language (color system, typography, iconography, spacing), responsive layout rules, seasonal visual accents, audio direction |
| `ux-blueprint.md` | Experience pillars, player mental model, information hierarchy, navigation depth rules, decision support behavior, onboarding flow, feedback patterns, error prevention, accessibility standards, turn advance ceremony, storyline experience |

**Rule:** If a design question is not answered by a blueprint, ask before inventing. Do not extrapolate simulation rules, visual language, or interaction patterns beyond what the blueprints define.

---

## Tech Stack

The stack is React 18 + TypeScript 5, built with Vite, deployed to GitHub Pages. See `TECHNICAL.md` for the full dependency list, build configuration, and deployment setup.

Key choices:
- No game engine. This is a text/dashboard simulation, not a visual or physics-based game.
- No UI component library. Build custom components per `ui-blueprint.md`.
- LocalStorage for save/persistence. No backend, no server.
- CSS custom properties for theming (seasonal accents, status colors per `ui-blueprint.md` §2.3–2.4).

---

## Project File Structure

```
project-kingdom/
├── src/
│   ├── engine/          # Pure TypeScript: simulation logic, turn resolution, state
│   │   ├── systems/     # One file per major system (treasury, food, population, etc.)
│   │   ├── resolution/  # Turn resolution order and consequence processing
│   │   ├── events/      # Event framework and storyline system
│   │   └── types.ts     # Shared game state types
│   ├── ui/
│   │   ├── screens/     # One subfolder per screen (dashboard/, reports/, decrees/, etc.)
│   │   ├── components/  # Shared components (ResourceCard, DecreeCard, EventPanel, etc.)
│   │   ├── hooks/       # Custom React hooks (useGameState, useTurnActions, etc.)
│   │   └── styles/      # CSS custom properties, tokens, base styles, reset
│   ├── data/            # Static JSON/TS: event pools, storylines, scenario configs, text
│   ├── assets/          # Icons (SVG), fonts, optional audio
│   └── main.tsx         # App entry point
├── public/              # Static assets passed through by Vite
├── docs/                # Design blueprints (gameplay-blueprint.md, ui-blueprint.md, ux-blueprint.md)
├── CODEX.md             # This file
├── TECHNICAL.md         # Stack, dependencies, build, deployment
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions: build + deploy to gh-pages
```

The `engine/` layer must have **no React imports**. It is pure TypeScript that can be tested independently of the UI. UI components must not contain simulation logic — they read from and write to the engine layer through hooks and state management.

---

## Development Workflow

When starting a new Claude Code session:
1. Read `CODEX.md` (this file).
2. Identify which blueprint governs the feature being built.
3. Read the relevant blueprint sections before writing any code.
4. Implement one system or screen at a time. Complete and test it before moving on.
5. Run `npm run dev` and verify in the browser after each meaningful change.
6. Keep `src/engine/` and `src/ui/` concerns strictly separated.

When implementing a game system (treasury, food, population class, etc.):
- Locate the system definition in `gameplay-blueprint.md`.
- Define the TypeScript types in `src/engine/types.ts` first.
- Implement the system logic in `src/engine/systems/`.
- Wire the UI to it last.

When implementing a screen or component:
- Locate the screen specification in `ui-blueprint.md`.
- Review the interaction rules for that screen in `ux-blueprint.md`.
- Build the component using existing shared components from `src/ui/components/` before creating new ones.

---

## Design Principles

These principles are drawn directly from the blueprints and must guide every implementation decision.

**Rule through information.** Rulership happens through reading, judging, prioritizing, and deciding — not through direct manipulation of a visible world scene. (`ux-blueprint.md` §1.1)

**Calm pressure.** Pressure comes from accumulating consequences and meaningful tradeoffs, not frantic interaction. The interface must never feel hostile. (`ux-blueprint.md` §1.2)

**Clarity before depth.** The player must be able to read the kingdom's state at a glance before choosing to drill down. The Dashboard and crown bar carry this responsibility. (`ux-blueprint.md` §1.3)

**Weight without friction.** Decisions feel consequential, but ordinary tasks must not feel slow or burdensome. (`ux-blueprint.md` §1.4)

**Layered complexity.** Depth exists but must not require immediate mastery. Surface the most complex systems (knowledge tree, espionage, class tensions) gradually via the onboarding flow. (`ux-blueprint.md` §1.5)

**Narrative voice.** All text — reports, event dispatches, intelligence briefings, consequence assessments — uses a consistent institutional tone: civic, measured, serious, occasionally dry. No personal narrator. (`ux-blueprint.md` §1.6)

**Living society.** The kingdom is a population of people with competing interests, spiritual needs, and cultural identity, not a spreadsheet of meters. Class satisfaction, faith, and culture must feel like governing people. (`ux-blueprint.md` §1.7)

---

## Coding Conventions

- **TypeScript strict mode** is always on. No `any` without a comment explaining why.
- **Functional components only.** No class components.
- **Named exports** for all components, hooks, and engine functions. No default exports except `main.tsx`.
- **File naming:** kebab-case for all files (`resource-card.tsx`, `treasury-system.ts`).
- **No magic numbers.** Game constants (action budget size, starting values, thresholds) live in `src/data/` or `src/engine/types.ts`, not inline.
- **No strings in logic.** Player-facing text lives in `src/data/`, not in component or engine files.
- **CSS custom properties** for all color, spacing, and typography tokens. No hardcoded hex values in component styles.
- **One component per file.** Small helper components used only within a parent file are the only exception.
- **No premature abstraction.** Build a specific implementation first. Extract a shared abstraction only when the same pattern appears three or more times.

---

## Guardrails

These are hard constraints. Do not violate them without explicit instruction.

- **Do not invent gameplay systems.** Every system, action type, event, and mechanic must trace to `gameplay-blueprint.md`. If it is not there, do not build it.
- **Do not add multiplayer.** The game is single-player. There is no server, no real-time sync, no user accounts.
- **Do not use a 3D or animation-heavy game engine** (Unity WebGL, Phaser, Pixi.js, Three.js, etc.). This is a text/dashboard simulation. React + CSS is sufficient.
- **Do not mix simulation logic with React components.** The engine layer is pure TypeScript. Components only present state and dispatch actions.
- **Do not hard-code player-facing text** in component or engine files. All text goes in `src/data/`.
- **Do not deviate from the visual language** defined in `ui-blueprint.md` §2. Do not introduce colors, typefaces, or animation styles not described there.
- **Do not skip the blueprint.** Before implementing any feature, locate its specification. If it is not in the blueprints, stop and ask.
