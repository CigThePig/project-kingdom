# Phase 9 — Crises Family Deep Audit: In-Progress Report

Phase 9 of the Card Audit & Progression workstream is underway. This doc
tracks the running state so follow-up sessions can pick up cleanly. It
will be replaced by `phase-9-findings-closed.md` (the structured close
doc matching Phase 4a / 6 / 8 template) when the family reaches
`0 CRITICAL / 0 MAJOR` on `npm run audit:crises`.

## Running scanner state

| Checkpoint | MAJOR | Δ from prior | Notes |
|---|---:|---:|---|
| Phase 9 start (pre-9A) | 615 | — | baseline from `docs/audit/baseline-2026-04-22/`; `docs/audit/findings/crises.md` front-matter `status: green` was stale from Phase 2 closure |
| Post-9A | 581 | −34 | condition & social-condition events retired |
| Post-9B | 539 | −42 | wave-2 crises retired |

Corpus-wide regression check at each checkpoint: `npm run audit` =
`0 CRITICAL / <MAJOR> / 0 MINOR / 0 POLISH`. Prior-phase scan zeros
(Phase 2 `CRITICAL_SHALLOW_RUNTIME`, 3/4a `PROMISE_NOT_DELIVERED`, 4b
`SCOPE_MISMATCH`, 5 region+neighbor coverage, 6 class coverage) all
continue to hold.

## Batches completed

### Batch 9A — Condition & social-condition events (committed)

Files touched:
- `src/data/events/condition-events.ts`
- `src/data/events/condition-effects.ts`
- `src/data/events/social-condition-events.ts`
- `src/data/events/social-condition-effects.ts`
- `src/data/events/effects.ts` (temp modifiers)
- `src/data/events/expansion/followup-events.ts` (new stub)
- `src/data/events/expansion/followup-effects.ts` (new stub effects)
- `src/data/text/expansion/condition-text.ts`
- `src/data/text/expansion/social-condition-text.ts`
- `src/data/text/expansion/followup-text.ts` (new stub text)
- `src/data/ruling-style/flavor-tags.ts` (plague-tier style tags)

Key moves:
- Flipped `affectsRegion: true` on condition-system-injected moderate
  crises (drought / flood / harshwinter / plague / banditry / corruption
  / criminal / unrest moderate). These events get a region bound at
  surface time by `turn-resolution.ts:1939` regardless of the
  definition's `affectsRegion` flag, so aligning the flag matches
  reality and lets the audit harness exercise the same code path.
- Added `regionConditionDelta` to every choice on the newly-bound
  region-scoped crises. The event harness runs
  `applyEventChoiceEffects` (not `applyActionEffects`), so temp-mod /
  follow-up / feature-registry levers do not appear in the runtime
  fingerprint. Only real state-field deltas do. `regionConditionDelta`
  with `affectsRegion: true` touches `regions.*.conditions` → 'region'
  touch class → retires `substance.surface-only`.
- Threaded `{region}` / `{settlement}` / `{condition_context}` tokens
  into bodies for the newly-region-bound cards (satisfies
  `text.smart-card-coverage` while the flag flip would otherwise
  introduce new coverage findings).
- Rewrote bodies with bare "drought" / "famine" / "unrest" state words
  on `triggerConditions: [{ type: 'always' }]` events to drop those
  words (since the events are system-injected and cannot add gating
  triggers — see `docs/CARD_AUDIT_RULES.md` §4.4 interpretation).
  `{condition_context}` emits the actual condition label at render.
- Authored one Phase-15 stub: `evt_fu_plague_mild_ignored`, wired from
  `evt_cond_plague_mild:ignore_sickness` at 75% / 3 turns.

Commit: `card-audit phase 9 batch 9A: condition & social-condition crises`

### Batch 9B — Wave-2 crises (committed)

Files touched:
- `src/data/events/expansion/wave-2/crises-{disasters,phenomena,political,religious,social}.ts`
- `src/data/text/expansion/wave-2-text/crises-{disasters,phenomena,political,religious,social,originals}.ts`

Key moves:
- Same region-binding + `regionConditionDelta` pattern applied to
  `affectsRegion: true` crises whose choices were surface-only.
- `evt_exp_w2_royal_illness` / `evt_exp_w2_mercenary_defection` /
  `evt_exp_w2_monetary_crisis` are kingdom-scoped so they now bind a
  neighbor via `affectsNeighbor` and carry `diplomacyDeltas` on each
  choice (touches `state.diplomacy` → 'diplomatic' touch class →
  structural).
- `evt_exp_w2_prophet_appears` flipped `affectsRegion: true` — the
  prophet appears at a specific gate, the fiction places him in a
  province.
- Fixed unresolved token `{neighbor_ruler_full}` (not registered) by
  using `{ruler_full}` + `{capital}` in neighbor-bound events.
- Reworded `evt_exp_w2_royal_illness` to drop "restive" (was triggering
  `text.trigger-coherence` against the `unrest` keyword pattern).

Commit: `card-audit phase 9 batch 9B: wave-2 crises`

## Batches remaining

Per the plan at `/root/.claude/plans/please-read-docs-card-audit-workstream-m-twinkly-riddle.md`:

| # | Batch | Remaining MAJOR |
|---|---|---:|
| 9C | Expansion small files: `food-events`, `religion-events`, `region-events`, `diplomacy-events`, `kingdom-events`, `environment-events`, `culture-events`, `knowledge-events` | ~108 |
| 9D | `class-conflict-events`, `public-order-events`, `espionage-events` | ~60 |
| 9E | `economy-events`, `military-events`, `chain-events` | ~76 |
| 9F | Base monolith: `src/data/events/index.ts` + `effects.ts` + `population-events.ts` | ~234 |
| 9G | Phase-2 stub reconciliation in `expansion/followup-events.ts` | ~94 |

Sum ≈ 572 — the ~33 delta against 539 `audit:crises` reports comes from
findings that span multiple files in the heatmap.

## Recipe reference (for continuation)

For each flagged choice on a remaining crisis file:

**`substance.surface-only` on an `affectsRegion: true` event:**
- Add `regionConditionDelta: ±N` (or `regionDevelopmentDelta: ±N`) to
  the existing effect delta. `±1` is enough to pass the scanner; sign
  matches the choice's character (+ for repair/recovery, − for decline).

**`substance.surface-only` on an `affectsRegion: false` event:**
- Preferred: flip `affectsRegion: true` when the fiction places the
  event in a specific province. Add `regionConditionDelta` + thread
  `{region}` / `{settlement}` in body.
- Alternative (for kingdom-scoped events): set `affectsNeighbor:
  'neighbor_<id>'` and add `diplomacyDeltas: { neighbor_<id>: ±N }` —
  only where the fiction involves a named rival.
- Last resort: set `affectsClass` + keep all surface deltas — no, this
  doesn't pass the scanner; use one of the two above.

**`text.smart-card-coverage SMART_CARD_COVERAGE_REGION`:**
- Add `{region}`, `{settlement}`, `{terrain}`, or `{condition_context}`
  to the body. One token is enough; two reads more naturally.

**`text.smart-card-coverage SMART_CARD_COVERAGE_NEIGHBOR`:**
- Add `{neighbor}`, `{neighbor_short}`, `{ruler_full}`, `{capital}`, or
  `{dynasty}`. `{neighbor_ruler_full}` is **not** a registered token —
  use `{ruler_full}` (which resolves against the bound neighbor).

**`text.smart-card-coverage SMART_CARD_COVERAGE_CLASS`:**
- Replace "the people" / "your subjects" / etc. with `{class_plural}`
  (`{class}` for singular supplicant framing).

**`text.trigger-coherence`:**
- If the event has real `triggerConditions`: add the gating type the
  scanner expects (see `scripts/audit/scans/text/trigger-coherence.ts`
  `STATE_WORD_MAP`).
- If the event uses `triggerConditions: [{ type: 'always' }]` (injection
  events / chain events): rewrite the body to drop the keyword. The
  `{condition_context}` token emits the actual state label at render
  and does not match the keyword regex (tokens are preserved
  unrendered in the scanner's view of `card.body`).

**`text.scope-mismatch`:**
- Body cannot say "every class" / "all classes" / "the realm entire" /
  "the realm" — regex is
  `\bevery\s+class\b|\ball\s+classes\b|\brealm\s+entire\b|\bthe\s+realm\b`.
- Kingdom-wide framing cannot land on a single-class or single-region
  runtime diff — either rewrite framing narrower, or widen the effect
  touches.

**`substance.choice-distinctness` / `choice-clones`:**
- Two choices must differ on ≥2 of 6 axes: follow-up, feature-registry,
  temp-mod effect-key-set, style-tag axis-set, scope
  (kingdom/class/region/neighbor from effect fields), effect-field
  category.
- Cheapest: give one branch a different temp-mod effect-key-set (e.g.
  `treasuryDelta` vs `merchantSatDelta`); give each a distinct style
  tag; or add a follow-up stub to one branch.

**Follow-up stubs:**
- Shape per `docs/audit/phase-2-followup-stubs.md` — minimal Pattern A
  definition, 2 choices, `triggerConditions: [{ type: 'always' }]`,
  effects with ≥1 structural touch (`regionConditionDelta`,
  `diplomacyDeltas`, or similar) so the scheduler + scanner are
  satisfied.
- New stubs live at the bottom of
  `src/data/events/expansion/followup-events.ts` under a
  `// Phase 9 Card Audit — Follow-up stubs (batch 9X: <topic>)`
  banner. Matching effects in `followup-effects.ts`. Matching text in
  `src/data/text/expansion/followup-text.ts`.
- Hard cap: don't flesh out prose or add third/fourth choices. Phase 15
  owns that.

## Invariants to preserve

- `affectsRegion` / `affectsClass` / `affectsNeighbor` flags track the
  event's real surfacing behavior. Flipping `false → true` requires
  that the injection pathway actually binds one; flipping `true → false`
  is a Phase 5/6 regression.
- Every new stub ID must have matching entries in `followup-events.ts`,
  `followup-effects.ts`, and `followup-text.ts`, or
  `wiring.missing-text` fires CRITICAL.
- Don't write consequence tags without a reader (Phase 17 territory).
- Every `{neighbor_X}` token must exist in
  `src/bridge/smartText.ts`'s `DISPATCH` map — otherwise
  `text.unresolved-tokens` fires MAJOR.

## Open questions for Phase 9 close

- Several Phase-2 stubs (81 total) account for ~94 MAJOR findings. Per
  plan batch 9G, light uplift only (style-tag + temp-mod + one
  distinctness lever). But the event-resolution harness does not see
  temp mods, so for stubs the uplift becomes "add a structural effect
  field (regionConditionDelta / diplomacyDeltas) to at least one
  branch" — same recipe as primary-event uplift. Document this in the
  close report.
- The `substance.cost-asymmetry` findings surfaced under
  `--include-minor --include-polish` are POLISH, not MAJOR, and thus
  out of Phase 9's acceptance gate. Record that call in the close
  report.

## Close artifacts (to be authored at end of phase)

- `docs/audit/phase-9-findings-closed.md` — structured close per Phase
  4a / 6 / 8 template.
- `docs/audit/phase-9-followup-stubs.md` — stub index for Phase 15.
- `docs/audit/findings/crises.md` — front-matter update (`status:
  green`) + outcome column filled per row.
- `docs/audit/rebuild-queue.md` — any Phase 9 queue additions grouped
  by trigger category.
