# Phase 5 — Findings Closed (SMART_CARD_COVERAGE_REGION + _NEIGHBOR sweep)

Phase 5 of the Card Audit & Progression workstream retired **every
`SMART_CARD_COVERAGE_REGION` and `SMART_CARD_COVERAGE_NEIGHBOR` finding**.
Both scans are now at **0 corpus-wide**. Phase 5 is complete.

Scope per the workstream doc (`docs/CARD_AUDIT_WORKSTREAM.md` §Phase 5):
pure retext — thread the scanner-satisfying `{region}` / `{neighbor_short}`
token into card body strings whose event-definition metadata declares
`affectsRegion: true` or `affectsNeighbor: <id>`. No new resolvers authored;
the tokens were already wired in `src/bridge/smartText.ts`.

## Retired counts

The in-tree `docs/audit/baseline-2026-04-22/findings.json` file was a stale
Phase-1 snapshot (118 + 36 = 154) and did not reflect the post-Phase-4b
state. The authoritative pre-phase-5 counts come from the Phase 4b close
report (`docs/audit/phase-4b-findings-closed.md`).

| Scan code | Pre-Phase-5 | Post-Phase-5 | Retired |
|---|---:|---:|---:|
| `SMART_CARD_COVERAGE_REGION` | 254 | 0 | **−254** |
| `SMART_CARD_COVERAGE_NEIGHBOR` | 40 | 0 | **−40** |
| **Total** | **294** | **0** | **−294** |

Phase 3 + Phase 4a + Phase 4b labels (`PROMISE_NOT_DELIVERED`,
`SCOPE_MISMATCH` across every sub-label) remain at 0.

## Fix-shape split

Calibrated against Phase 4b's 114-retext-dominant / 2-re-effect /
1-scope-correction / 0-new-stubs shape. Phase 5 was entirely retext, as
designed.

| Shape | Count | Notes |
|---|---:|---|
| Retext — thread `{region}` into body (R3 scoping tail or R4 severity anchor the dominant patterns) | ~240 | "the kingdom's X" → "the X of {region}", "a province" → "{region}", "the region" → "{region}", "across the kingdom" → "across {region}". |
| Retext — thread `{neighbor_short}` into body (N1 envoy opener or N2 bilateral frame dominant) | ~40 | "from {capital}" → "from {capital} in {neighbor_short}", "{ruler_full} has" → "{ruler_full} of {neighbor_short} has", "the border" → "the border with {neighbor_short}". |
| Retext — dual-flag card (added both tokens in one body) | ~14 | Cards flagged on both scans; common in border-crisis and envoy-raid content. Examples: `evt_border_tension_escalation`, `evt_exp_esp_counter_espionage_raid`, `evt_exp_esp_enemy_infiltration`, `evt_exp_mil_cavalry_training`, `evt_exp_mil_siege_preparations`, `evt_exp_cul_assimilation_pressure`, `evt_fu_assimilation_standoff`, `evt_fu_marriage_dynastic_friction`, `evt_fu_surrender_terms_harsh`. |
| Escape-hatch flag flip on event definition | **0** | Never used. Every flagged card was closeable via body retext. |
| New follow-up stub | **0** | Same as Phases 3/4a/4b. |

The `{ruler_full}` / `{dynasty}` / `{capital}` tokens already wired into
many diplomacy and border bodies do **not** satisfy the scanner's neighbor
regex (`/\{(neighbor|rival|neighbor_\w+)\}/i`). A large fraction of the 40
neighbor findings were cards that already named a ruler or capital but had
never threaded `{neighbor}` / `{neighbor_short}` itself — closed by adding
a single "of {neighbor_short}" clause after the existing ruler mention.

## Regression check

| Scan code | Pre-Phase-5 | Post-Phase-5 | Delta |
|---|---:|---:|---:|
| `SURFACE_ONLY` | 966 | 966 | 0 |
| `SMART_CARD_COVERAGE_CLASS` | 331 | 331 | 0 |
| `SMART_CARD_COVERAGE_REGION` | 254 | 0 | **−254** (target) |
| `PROMISE_NOT_DELIVERED` | 0 | 0 | 0 |
| `SCOPE_MISMATCH` | 0 | 0 | 0 |
| `CHOICES_NOT_DISTINCT` | 77 | 77 | 0 |
| `SMART_CARD_COVERAGE_NEIGHBOR` | 40 | 0 | **−40** (target) |
| `TRIGGER_BODY_STATE_UNGATED` | 24 | 24 | 0 |
| `CHOICE_CLONES` | 5 | 5 | 0 |
| `CATEGORY_WITHOUT_TOUCH` | 1 | 1 | 0 |
| **Total MAJOR** | **1698** | **1404** | **−294** |

Zero regressions across all scan categories. Every pre-Phase-5 label is
either unchanged (every non-target scan) or at 0 (both Phase 5 targets and
all prior-phase targets).

One in-phase transient regression was caught and resolved during the sweep:

- `evt_military_coup_threat` — sub-agent retext added "garrisoned across
  {region}". The word "garrisoned" matched the
  `military readiness` keyword in `scripts/audit/scans/shared.ts`
  (`/\breadiness\b|\bmuster\b|\bgarrison(?:ed|s)?\b|\bdrill\b/i`), triggering
  two `PROMISE_NOT_DELIVERED` findings because the card's choice touches use
  `MilitaryCaste` (capital M) while the PND rule requires lowercase
  `military` substring. Resolved by swapping "garrisoned" → "stationed"
  (same narrative anchor, no regex hit). Final PND count: 0, unchanged from
  Phase 4b close.

No other transient regressions surfaced. `{region}`, `{settlement}`,
`{terrain}`, `{condition_context}`, `{neighbor}`, `{neighbor_short}`, and
`{neighbor_memory_clause}` are inert vs every other scan, as predicted in
the plan.

## Phase 15 backlog

Phase 5 authored **zero new follow-up stubs**. The Phase 2
(`phase-2-followup-stubs.md`) backlog of 81 stubs stands unchanged. Phases
3, 4a, 4b, and 5 together have added no new entries to that backlog.

## Files touched

**Text files (28) — all edits are to card body strings; no choice labels,
no effects, no event-definition metadata:**

- `src/data/text/events.ts` (~61 cards — the largest single-file sweep; covers base pool, border chain, ambassador chain, plague chain, regional, escalation, seasonal, and class-specific blocks)
- `src/data/text/expansion/followup-text.ts` (~77 cards — both `evt_exp_fu_*` Phase 2-authored follow-ups and the `evt_fu_*` Phase 2 stubs-realized follow-ups)
- `src/data/text/expansion/economy-text.ts` (9 cards)
- `src/data/text/expansion/public-order-text.ts` (9 cards)
- `src/data/text/expansion/military-text.ts` (8 cards)
- `src/data/text/expansion/diplomacy-text.ts` (9 cards)
- `src/data/text/expansion/espionage-text.ts` (9 cards)
- `src/data/text/expansion/chain-text.ts` (8 cards)
- `src/data/text/expansion/culture-text.ts` (6 cards)
- `src/data/text/expansion/environment-text.ts` (6 cards)
- `src/data/text/expansion/food-text.ts` (5 cards)
- `src/data/text/expansion/condition-text.ts` (5 cards)
- `src/data/text/expansion/class-conflict-text.ts` (4 cards)
- `src/data/text/expansion/religion-text.ts` (4 cards)
- `src/data/text/expansion/knowledge-text.ts` (4 cards)
- `src/data/text/expansion/social-condition-text.ts` (4 cards)
- `src/data/text/expansion/wave-2-text/crises-phenomena.ts` (4 cards)
- `src/data/text/expansion/wave-2-text/crises-disasters.ts` (3 cards)
- `src/data/text/expansion/wave-2-text/crises-political.ts` (3 cards)
- `src/data/text/expansion/wave-2-text/petitions-civic.ts` (3 cards)
- `src/data/text/expansion/wave-2-text/crises-religious.ts` (2 cards)
- `src/data/text/expansion/wave-2-text/crises-social.ts` (2 cards)
- `src/data/text/expansion/wave-2-text/crises-originals.ts` (2 cards — `evt_exp_w2_comet_sighting` and `evt_exp_w2_foreign_refugees`, whose definitions live in the wave-2 aggregator `index.ts` but whose bodies live in `crises-originals.ts`)
- `src/data/text/expansion/wave-2-text/petitions-guilds.ts` (2 cards)
- `src/data/text/expansion/kingdom-text.ts` (2 cards)
- `src/data/text/expansion/region-text.ts` (2 cards)
- `src/data/text/expansion/wave-2-text/petitions-military.ts` (1 card)
- `src/data/text/expansion/wave-2-text/petitions-religious.ts` (1 card)

Total: **28 files, 284 body-string replacements**. `git diff --stat`
confirms 284 insertions / 284 deletions — consistent with one-line edits
per card.

**Effect files:** none.

**Event-definition files:** none. No `affectsRegion` / `affectsNeighbor`
flag flips were needed — every flagged card closed cleanly via retext.

**Seeded finding tables (refreshed via `npm run audit:baseline`):**
- `docs/audit/baseline-2026-04-22/findings.json` and `.md`
- `docs/audit/baseline-2026-04-22/heatmap.md`
- `docs/audit/baseline-2026-04-22/inventory.{json,md}`
- `docs/audit/findings/*.md` — per-family tables; hand-kept `outcome` and
  `notes` columns preserved per Phase 4b's verified idempotency.

## Escape-hatch log

**None.** No `affectsRegion` / `affectsNeighbor` metadata flip was needed
on any event definition. The `src/data/events/**` tree was not touched by
this phase.

## Verification

- `npm run audit`: `53 scans · 1404 findings (CRITICAL=0 MAJOR=1404 MINOR=0 POLISH=0) · 4033 ms`
- `npm run audit:baseline` (refreshed baseline): `53 scans · 3579 findings (CRITICAL=0 MAJOR=1404 MINOR=332 POLISH=1843)`
- `SMART_CARD_COVERAGE_REGION` and `SMART_CARD_COVERAGE_NEIGHBOR` both absent from the post-Phase-5 findings enumeration.
- `npm test`: **900 tests passing** across 92 test files (20.36s).
- `npm run lint`: clean.
- `npm run build`: clean (`vite build` succeeded; no TypeScript errors).
- Phase gate from `CLAUDE.md` green.
- Save-compat: no `GameState` schema changes in this phase, so no
  migration shim needed. The save-compat version integer stands.

## Scanner regex cheat sheet (for future reference)

The two regexes that drove every finding retired in this phase live in
`scripts/audit/scans/text/smart-card-coverage.ts`:

- `REGION_TOKENS = /\{(region|settlement|terrain|condition_context|region_\w+)\}/i`
- `NEIGHBOR_TOKENS = /\{(neighbor|rival|neighbor_\w+)\}/i`

**Clears the REGION scan:** `{region}`, `{settlement}`, `{terrain}`,
`{condition_context}`, `{region_posture}`, or any `{region_*}` token.

**Clears the NEIGHBOR scan:** `{neighbor}`, `{neighbor_short}`, `{rival}`,
`{neighbor_memory_clause}`, or any `{neighbor_*}` token.

**Does NOT clear the NEIGHBOR scan** (common authoring mistake — these
were present in ~40 of the 40 flagged neighbor cards without a
`neighbor_*` token alongside): `{ruler}`, `{ruler_full}`, `{ruler_title}`,
`{dynasty}`, `{capital}`, `{epithet}`.

**Gated state-words to avoid introducing via retext** (would regress
`TRIGGER_BODY_STATE_UNGATED`): `drought`, `parched`, `withered crops`,
`failed harvest`, `famine`, `starvation`, `starving`, `restive`, `unrest`,
`rebellion`, `rioting`, `in revolt`, `hostile`, `tensions flare`,
`saber-rattling`, `empty treasury`, `coffers empty`, `heretic`, `heresy`,
`heterodox`, `schism`, `depression`, `recession`, `trade collapse`,
`merchants despair`. Per Phase 5 discipline: if a gated word is ALREADY in
the source body, it was left untouched; never added as part of a retext.

**Gated keyword to avoid introducing via retext** (would regress
`PROMISE_NOT_DELIVERED` per
`scripts/audit/scans/shared.ts:military readiness`): any of
`readiness`, `muster`, `garrison(ed|s)`, `drill`. One such regression
surfaced during this phase (`evt_military_coup_threat` — "garrisoned" →
"stationed") and was resolved in-phase with zero carryover.
