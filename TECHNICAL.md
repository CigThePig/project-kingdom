# Technical Reference

Dependencies, tooling, build configuration, and deployment for the kingdom management game. See `CODEX.md` for project conventions and design principles.

---

## Stack Overview

| Layer | Choice |
|-------|--------|
| Language | TypeScript 5 (strict mode) |
| UI framework | React 18 |
| Build tool | Vite 5 |
| Styling | CSS custom properties + CSS Modules |
| UI component library | None — custom components per `ui-blueprint.md` |
| State management | React context + useReducer (no external library) |
| Persistence | Browser LocalStorage — no backend |
| Hosting | GitHub Pages (static) |
| Deployment | GitHub Actions |

---

## Why This Stack

GitHub Pages serves only static files. Vite produces a fully static `dist/` output and is fast in development. React + TypeScript is well-supported by Claude Code and well-suited to the component structure defined in `ui-blueprint.md`. No game engine is needed — this is a turn-based text/dashboard simulation with no physics, sprites, or animation loops. CSS custom properties handle the theming requirements (seasonal color accents, status colors) defined in `ui-blueprint.md` §2.3–2.4 without a third-party design system.

---

## Dependencies

### Runtime

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

### Dev

```json
{
  "vite": "^5.4.0",
  "@vitejs/plugin-react": "^4.3.0",
  "typescript": "^5.5.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "eslint": "^9.0.0",
  "typescript-eslint": "^8.0.0",
  "@eslint/js": "^9.0.0",
  "prettier": "^3.3.0"
}
```

### Optional

```json
{
  "vite-plugin-pwa": "^0.20.0"
}
```

`vite-plugin-pwa` enables offline play via a service worker. Add it only after core gameplay is complete.

---

## Dev Tooling

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and produce `dist/` |
| `npm run preview` | Serve `dist/` locally to verify the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier across `src/` |

---

## Vite Configuration

`vite.config.ts` must set `base` to the repository name so that asset paths resolve correctly on GitHub Pages:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/project-kingdom/',
})
```

---

## Folder Structure

```
src/
  engine/
    systems/
      treasury.ts          # Treasury resource system
      food.ts              # Food production and rationing
      population.ts        # Population class satisfaction and dynamics
      military.ts          # Military command and readiness
      faith.ts             # Faith and cultural cohesion
      espionage.ts         # Intelligence and espionage operations
      knowledge.ts         # Knowledge research tree
      diplomacy.ts         # Diplomatic relations
      trade.ts             # Trade and commerce
      regions.ts           # Regional governance
    resolution/
      turn-resolution.ts   # Turn resolution order and consequence processing
      action-budget.ts     # 3-slot action budget rules
    events/
      event-engine.ts      # Event framework: severity, weighting, surfacing
      storyline-engine.ts  # Storyline branching and progression
    types.ts               # All shared game state TypeScript types
    constants.ts           # Game constants (action budget size, thresholds, etc.)

  ui/
    screens/
      dashboard/           # Dashboard screen
      reports/             # Reports screen
      decrees/             # Decrees screen
      society/             # Society screen (population classes + faith/culture tabs)
      regions/             # Regions screen
      military/            # Military screen
      trade/               # Trade screen
      diplomacy/           # Diplomacy screen
      intelligence/        # Intelligence screen
      knowledge/           # Knowledge screen
      events/              # Events screen
      archive/             # Archive screen
    components/
      crown-bar/           # Persistent top status bar
      nav-rail/            # Left navigation rail (desktop) / bottom bar (mobile)
      resource-card/       # Resource status with trend arrows
      decree-card/         # Decree option display
      policy-card/         # Policy status display
      event-panel/         # Event and storyline presentation
      forecast-module/     # Consequence preview display
      intelligence-panel/  # Right contextual intelligence panel
    hooks/
      use-game-state.ts    # Read current kingdom state
      use-turn-actions.ts  # Dispatch player actions within budget
      use-save.ts          # LocalStorage save/load
    styles/
      tokens.css           # CSS custom properties: colors, spacing, type scale
      base.css             # Reset and base element styles
      seasonal.css         # Seasonal accent overrides (spring/summer/autumn/winter)

  data/
    events/                # Event pool definitions (JSON or TS)
    storylines/            # Storyline tree definitions
    scenarios/             # Scenario start configurations
    text/                  # All player-facing strings (reports, labels, descriptions)

  assets/
    icons/                 # SVG icons (one per game domain, per ui-blueprint.md §2.5)
    fonts/                 # Typeface files
    audio/                 # Optional: sparse UI sounds per ui-blueprint.md §2.9

  main.tsx                 # App entry point and React root
  app.tsx                  # Top-level routing and layout shell
```

---

## GitHub Pages Deployment

Deployment uses GitHub Actions. On every push to `main`, the workflow builds the project and pushes `dist/` to the `gh-pages` branch.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

In the GitHub repository settings, set Pages source to the `gh-pages` branch, root directory.

The live URL will be: `https://cigthepig.github.io/project-kingdom/`

---

## Save and Persistence

- All game state is saved to `localStorage` under a versioned key (e.g., `kingdom-save-v1`).
- Save format is JSON. The save schema must include a `version` field to support future migrations.
- The game must be saveable at any point, including mid-turn (per `ux-blueprint.md` §10.5).
- No cloud sync, no accounts, no backend. Single-device local saves only.

---

## Browser Targets

Modern evergreen browsers: Chrome, Firefox, Safari, Edge. No Internet Explorer support. The Vite default `browserslist` covers this.

The game must be fully playable on mobile. All 12 screens must be accessible and completable on a mobile viewport. See `ui-blueprint.md` §3.4 for mobile layout rules and `ux-blueprint.md` §10.4 for mobile UX requirements.

---

## Performance Notes

- Game state updates are **turn-based, not real-time**. There are no `requestAnimationFrame` loops. Re-renders happen only on explicit player actions.
- Load screen components with **dynamic imports** (`React.lazy`) to keep the initial bundle small. Twelve screens warrant code splitting.
- Heavy static data (event pools, storyline trees, scenario configs) should be loaded on demand from `src/data/`, not bundled into the main chunk.
- The right intelligence panel (`src/ui/components/intelligence-panel/`) updates contextually but must not trigger expensive re-renders of the main content area.
- Target initial page load under 200KB gzipped JS before audio assets are added.
