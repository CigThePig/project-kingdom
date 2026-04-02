# Building Phases

Progress tracker for the kingdom management simulation. Built entirely with Claude Code.

**How to use:**
- Check off items as they are completed: `- [ ]` → `- [x]`
- Work top-to-bottom. Complete one phase before starting the next.
- Each phase lists the blueprint section to read **before** writing any code.
- Status key: 🔴 Not Started · 🟡 In Progress · 🟢 Complete

---

## Phase 0 — Project Bootstrap

**Status:** 🟢 Complete
**Blueprint Reference:** `TECHNICAL.md` — Stack Overview, Vite Configuration, GitHub Pages Deployment

- [x] Initialize npm project: `npm create vite@latest . -- --template react-ts`
- [x] Configure `vite.config.ts` with `base: '/project-kingdom/'`
- [x] Configure `tsconfig.json` with strict mode enabled
- [x] Create `.eslintrc` / `eslint.config.js` using `typescript-eslint`
- [x] Create `.prettierrc` config file
- [x] Create `.github/workflows/deploy.yml` (GitHub Actions → gh-pages)
- [x] Scaffold folder structure: `src/engine/`, `src/ui/`, `src/data/`, `src/assets/`, `public/`
- [x] Create `src/engine/systems/`, `src/engine/resolution/`, `src/engine/events/`
- [x] Create `src/ui/screens/`, `src/ui/components/`, `src/ui/hooks/`, `src/ui/styles/`
- [x] Create `src/data/events/`, `src/data/storylines/`, `src/data/scenarios/`, `src/data/text/`
- [x] Verify `npm run dev` starts without errors
- [x] Verify `npm run build` produces clean `dist/`

---

## Phase 1 — Engine Foundation

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Core Systems, Turn Model, Action Budget

- [x] Create `src/engine/types.ts` — all shared game state TypeScript interfaces and types
- [x] Create `src/engine/constants.ts` — action budget size, thresholds, starting values, all magic numbers

---

## Phase 2 — Engine Systems

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — individual system sections for each file below

Each file must import from `src/engine/types.ts` only. No React imports.

- [x] Create `src/engine/systems/treasury.ts` — wealth, taxation, trade income, maintenance
- [x] Create `src/engine/systems/food.ts` — agricultural supply, reserves, seasonal balance
- [x] Create `src/engine/systems/population.ts` — 5 class satisfaction dynamics and labor
- [x] Create `src/engine/systems/military.ts` — force size, readiness, morale, equipment
- [x] Create `src/engine/systems/faith.ts` — devotion, cultural cohesion, religious orders, schism mechanics
- [x] Create `src/engine/systems/espionage.ts` — 6 operation types, intelligence state
- [x] Create `src/engine/systems/knowledge.ts` — 6 research branches, progress tracking
- [x] Create `src/engine/systems/diplomacy.ts` — neighboring kingdoms, relationship scores, AI behavior
- [x] Create `src/engine/systems/trade.ts` — commerce, trade routes, tariffs
- [x] Create `src/engine/systems/regions.ts` — sub-territories, regional outputs and conditions

---

## Phase 3 — Turn Resolution Engine

**Status:** 🟢 Complete
**Blueprint Reference:** `gameplay-blueprint.md` — Turn Resolution Order, Action Budget System

- [x] Create `src/engine/resolution/turn-resolution.ts` — turn resolution order and consequence processing
- [x] Create `src/engine/resolution/action-budget.ts` — 3-slot budget rules and validation

---

## Phase 4 — Event & Storyline Engines

**Status:** 🔴 Not Started
**Blueprint Reference:** `gameplay-blueprint.md` — Event Framework, Storyline System

- [ ] Create `src/engine/events/event-engine.ts` — severity weighting, event surfacing logic
- [ ] Create `src/engine/events/storyline-engine.ts` — branching logic, progression, arc tracking

---

## Phase 5 — Data Layer

**Status:** 🔴 Not Started
**Blueprint Reference:** `gameplay-blueprint.md` — Event Pool, Storylines, Scenarios; `ux-blueprint.md` — Narrative Voice

All player-facing strings must live here, never in engine or component files.

- [ ] Create `src/data/events/index.ts` — event pool definitions
- [ ] Create `src/data/storylines/index.ts` — storyline tree definitions
- [ ] Create `src/data/scenarios/default.ts` — default starting scenario configuration
- [ ] Create `src/data/text/labels.ts` — UI labels and navigation strings
- [ ] Create `src/data/text/reports.ts` — report and decree text templates
- [ ] Create `src/data/text/events.ts` — event dispatch text strings

---

## Phase 6 — UI Styles

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — §2 Visual Language (color system, typography, spacing, seasonal accents)

All color, spacing, and typography values come from the blueprint. No hardcoded hex values in components.

- [ ] Create `src/ui/styles/tokens.css` — CSS custom properties: colors, spacing scale, type scale, status colors
- [ ] Create `src/ui/styles/base.css` — reset and base element styles
- [ ] Create `src/ui/styles/seasonal.css` — spring/summer/autumn/winter accent overrides

---

## Phase 7 — State Management & Hooks

**Status:** 🔴 Not Started
**Blueprint Reference:** `TECHNICAL.md` — State Management; `ux-blueprint.md` — §10 Save/Load

- [ ] Create `src/ui/context/game-context.tsx` — React context + useReducer for game state
- [ ] Create `src/ui/hooks/use-game-state.ts` — read current kingdom state
- [ ] Create `src/ui/hooks/use-turn-actions.ts` — dispatch player actions within budget
- [ ] Create `src/ui/hooks/use-save.ts` — LocalStorage save/load with versioned JSON schema

---

## Phase 8 — App Shell & Navigation

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — §3 Global Screen Architecture; `ux-blueprint.md` — §6 Navigation UX

- [ ] Create `src/main.tsx` — React root mount
- [ ] Create `src/app.tsx` — top-level routing and layout shell
- [ ] Create `src/ui/components/crown-bar/crown-bar.tsx` — persistent top status bar
- [ ] Create `src/ui/components/crown-bar/crown-bar.module.css`
- [ ] Create `src/ui/components/nav-rail/nav-rail.tsx` — left rail (desktop) / bottom bar (mobile)
- [ ] Create `src/ui/components/nav-rail/nav-rail.module.css`
- [ ] Create `src/ui/components/intelligence-panel/intelligence-panel.tsx` — right contextual panel
- [ ] Create `src/ui/components/intelligence-panel/intelligence-panel.module.css`
- [ ] Verify full layout renders in browser with placeholder screen content

---

## Phase 9 — Shared Components

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — §4 Shared Component Library; `ux-blueprint.md` — §3 Information Hierarchy

Build components only as they are needed by screens. Do not build components speculatively.

- [ ] Create `src/ui/components/resource-card/resource-card.tsx` — resource status with trend arrows
- [ ] Create `src/ui/components/resource-card/resource-card.module.css`
- [ ] Create `src/ui/components/decree-card/decree-card.tsx` — decree option display
- [ ] Create `src/ui/components/decree-card/decree-card.module.css`
- [ ] Create `src/ui/components/policy-card/policy-card.tsx` — policy status display
- [ ] Create `src/ui/components/policy-card/policy-card.module.css`
- [ ] Create `src/ui/components/event-panel/event-panel.tsx` — event and storyline presentation
- [ ] Create `src/ui/components/event-panel/event-panel.module.css`
- [ ] Create `src/ui/components/forecast-module/forecast-module.tsx` — consequence preview display
- [ ] Create `src/ui/components/forecast-module/forecast-module.module.css`

---

## Phase 10 — Core Screens

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — Dashboard, Reports, Events screen specs; `ux-blueprint.md` — §2 Player Mental Model, §4 Core Interaction Flows

These three screens are the highest-value and most-used. Build them first.

- [ ] Create `src/ui/screens/dashboard/dashboard.tsx`
- [ ] Create `src/ui/screens/dashboard/dashboard.module.css`
- [ ] Create `src/ui/screens/reports/reports.tsx`
- [ ] Create `src/ui/screens/reports/reports.module.css`
- [ ] Create `src/ui/screens/events/events.tsx`
- [ ] Create `src/ui/screens/events/events.module.css`
- [ ] Verify turn advance flow works end-to-end (dashboard → advance → results)

---

## Phase 11 — Action Screens

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — Decrees, Policies, Society screen specs; `ux-blueprint.md` — §4 Decision Support

- [ ] Create `src/ui/screens/decrees/decrees.tsx`
- [ ] Create `src/ui/screens/decrees/decrees.module.css`
- [ ] Create `src/ui/screens/society/society.tsx` — population classes + faith/culture tabs
- [ ] Create `src/ui/screens/society/society.module.css`
- [ ] Verify action budget enforcement (3-slot limit) works in the UI

---

## Phase 12 — Simulation Screens

**Status:** 🔴 Not Started
**Blueprint Reference:** `ui-blueprint.md` — individual screen specs for each below; `ux-blueprint.md` — §6 Navigation Depth Rules

- [ ] Create `src/ui/screens/regions/regions.tsx`
- [ ] Create `src/ui/screens/regions/regions.module.css`
- [ ] Create `src/ui/screens/military/military.tsx`
- [ ] Create `src/ui/screens/military/military.module.css`
- [ ] Create `src/ui/screens/trade/trade.tsx`
- [ ] Create `src/ui/screens/trade/trade.module.css`
- [ ] Create `src/ui/screens/diplomacy/diplomacy.tsx`
- [ ] Create `src/ui/screens/diplomacy/diplomacy.module.css`
- [ ] Create `src/ui/screens/intelligence/intelligence.tsx`
- [ ] Create `src/ui/screens/intelligence/intelligence.module.css`
- [ ] Create `src/ui/screens/knowledge/knowledge.tsx`
- [ ] Create `src/ui/screens/knowledge/knowledge.module.css`
- [ ] Create `src/ui/screens/archive/archive.tsx`
- [ ] Create `src/ui/screens/archive/archive.module.css`

---

## Phase 13 — Integration & Polish

**Status:** 🔴 Not Started
**Blueprint Reference:** `ux-blueprint.md` — §10 Save/Load, §10.4 Mobile UX, §10.5 Accessibility; `TECHNICAL.md` — Performance Notes

- [ ] Verify save/load round-trip: save mid-turn, reload page, state restored correctly
- [ ] Implement code splitting with `React.lazy` for all 12 screens
- [ ] Verify all 12 screens are fully accessible and operable on mobile viewport
- [ ] Audit and fix any CSS custom property gaps (no hardcoded hex values in components)
- [ ] Run `npm run build` and verify bundle is under 200KB gzipped (excluding audio)
- [ ] Add `vite-plugin-pwa` for offline play (optional — only after above items complete)

---

## Phase 14 — Testing & Deployment

**Status:** 🔴 Not Started
**Blueprint Reference:** `TECHNICAL.md` — GitHub Pages Deployment, Browser Targets

- [ ] Run `npm run lint` — fix all ESLint errors
- [ ] Run `npm run build` — fix all TypeScript type errors
- [ ] Run `npm run preview` — verify production build serves correctly at `/project-kingdom/`
- [ ] Enable GitHub Pages in repository settings (source: `gh-pages` branch, root directory)
- [ ] Push to `main` — verify GitHub Actions workflow runs and deploys successfully
- [ ] Verify live URL: `https://cigthepig.github.io/project-kingdom/`
- [ ] Test on Chrome, Firefox, Safari, and a mobile device
