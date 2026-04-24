# Phase 8 — Findings Closed (Decrees family deep audit)

Phase 8 of the Card Audit & Progression workstream walked every decree in the
corpus against the 15 standing audit questions
(`docs/CARD_AUDIT_QUESTIONS.md`) and threaded progression-memory tokens onto
the high-impact / defining-tier decrees that lacked them.

Decrees are the calibration family per `CARD_AUDIT_RULES.md` §11.1 — fewest
cards, highest leverage each — and the first SURFACE_ONLY deep audit after
the corpus-wide waves in Phases 3–6.

## Scope

Family: `decree`. Corpus: **97 decrees** across three files
(`src/data/decrees/index.ts` — 58 base; `src/data/decrees/expansion-decrees.ts`
— 24 expansion; `src/data/decrees/expansion-wave-2/index.ts` — 15 wave-2).

## Pre-walk state (verified before the walk)

The scanner was already green on decrees going into Phase 8 after the
corpus-wide retires in Phases 3 / 4a / 6:

- `npm run audit:decrees` — 0 CRITICAL / 0 MAJOR / 0 MINOR / 0 POLISH.
- `npm run audit -- --family=decree --include-minor --include-polish` —
  87 POLISH findings, all `TAG_NEVER_READ` (consequence tags produced with
  no trigger reader), explicitly Phase 17 territory per the workstream doc.
- `KINGDOM_FEATURE_REGISTRY` coverage: 89 of 97 decrees carry registry
  entries (including all 15 wave-2 decrees at
  `src/data/kingdom-features/index.ts:787-895`). The 8 decrees without a
  registry entry are repeatable one-shots (`decree_emergency_levy` etc.)
  where no ongoing feature exists by design, per `CARD_AUDIT_RULES.md` §9.1.
- Cooldown / `isOneTime` sweep: all 13 repeatable decrees have cooldowns in
  the 2–6 turn range; the other 84 are `isRepeatable: false` one-shots. No
  spam-the-feature risks.
- Preview-parity scan: 100% covered.
- Decrees do not use `followUpDefinitionId`; they seed consequence tags and
  kingdom features instead. No Phase-15 follow-up stub backlog grows from
  Phase 8.

## Outcome matrix

Per-card outcomes for all 97 decrees recorded at
`docs/audit/findings/decrees.md` below the `AUTO-GENERATED:END` marker
(seeder-safe — `scripts/audit/seeder.ts:22-23` only rewrites the region
between the AUTO-GENERATED markers).

| Outcome | Count |
|---|---:|
| pass | 82 |
| retext | 15 |
| re-effect | 0 |
| rebuild | 0 |
| **total** | **97** |

### Retext breakdown (15)

All 15 retexts were Q12 progression-memory threads: appending
`{ruling_style_note}{recent_causal}` to the `effectPreview` strings of
high-impact / Rare-rarity decrees that lacked them. The
`substituteSmartPlaceholders` path at `src/bridge/decreeCardGenerator.ts:91`
runs on every decree body, and the two tokens are already registered in
`src/bridge/smartText.ts:371-372` — no resolver change was required.

| Bucket | Count | Cards |
|---|---:|---|
| Base — Tier-3 chain mastery | 5 | `decree_religious_unification`, `decree_diplomatic_supremacy`, `decree_imperial_confederation`, `decree_kingdom_breadbasket`, `decree_social_contract` |
| Base — Tier-1 Rare policy (standalone / chain-head) | 5 | `decree_royal_marriage`, `decree_agricultural_trade_compact`, `decree_land_redistribution`, `decree_provincial_governance`, `decree_medical_reforms` |
| Wave-2 — high-impact policy | 5 | `decree_w2_university_charter`, `decree_w2_codify_the_common_law`, `decree_w2_free_cities_charter`, `decree_w2_road_construction`, `decree_w2_military_reforms` |

Token coverage across the family moved from **11 of 97** to **26 of 97**,
concentrated on the Defining / Rare tier where Q12 is expected per
`CARD_AUDIT_RULES.md` §9.1. Common-tier and repeatable tactical decrees
remained un-threaded by design — progression memory does not read on one-off
treasury / faith / militia spikes.

### Question tally

For completeness on the 15-question lens (family-agnostic checklist;
decree-specific overlay is §9.1). Q7 (choice distinctness), Q13 (follow-up
shape per branch), and Q14 (cost asymmetry across choices) are N/A for
single-action Pattern A decrees and were marked once at the top of the
outcome matrix rather than per-card.

| Q | Description | Hits | Action |
|---:|---|---:|---|
| 1 | Pattern fit | 0 | Every decree is Pattern A. |
| 2 | Family fit | 0 | Post Phase 7 reconciliation — no mis-family decrees remain. |
| 3 | Duplicate check | 0 | `docs/audit/duplicate-reconciliation.md` mapping still holds; expansion `decree_exp_common_law` (chain step) and wave-2 `decree_w2_codify_the_common_law` (one-time compilation policy) are complementary, not duplicates. |
| 4 | Wiring | 0 | Scanner-clean. |
| 5 | Smart-card coverage | 0 | No `affectsRegionId` / `affectsClass` / `affectsNeighborId` binding gaps; decrees don't use those fields. |
| 6 | Trigger coherence | 0 | `statePrerequisites` match the state-sensitive flavor in every case (e.g. `decree_theocratic_council` faith-gate 50 matches its body). |
| 7 | Choice distinctness | — | N/A (Pattern A single action). |
| 8 | Substance (§2) | 0 | Registry-verified; 89 of 97 set a feature, the other 8 are repeatable one-shots by design. |
| 9 | Severity–magnitude coherence | 0 | Scanner-clean. |
| 10 | Category coherence | 0 | Every decree's category matches its effect table. |
| 11 | Promise ↔ delivery | 0 | Retired corpus-wide in Phase 4a. |
| 12 | Progression memory | **15** | All threaded — see retext breakdown. |
| 13 | Follow-up shape | — | N/A (decrees use features/tags, not `followUpDefinitionId`). |
| 14 | Cost asymmetry | — | N/A (single-action; `slotCost` asymmetry lives *across* the decree pool, not within a card). |
| 15 | Authoring self-test | 0 | No rebuild candidates. `docs/audit/rebuild-queue.md` unchanged. |

## Deliberate scope exclusions

- **87 `TAG_NEVER_READ` POLISH findings.** Decree consequence tags (e.g.
  `decree:decree_exp_anti_corruption_campaign`) are produced but no trigger
  currently reads them. This is Phase 17 (Consequence-tag reader expansion)
  territory per `CARD_AUDIT_WORKSTREAM.md`. Phase 8 did not add readers nor
  remove writes.
- **No wholesale body rewrites.** Retext in Phase 8 means "append a token
  that the resolver already supports." A from-scratch rewrite of a bland
  decree would be a rebuild; none surfaced in the walk.
- **No new `KINGDOM_FEATURE_REGISTRY` entries.** The 8 decrees without
  registry entries are by-design repeatable one-shots (treasury spike,
  faith spike, militia call-up) — adding features there would overcount
  permanent effects on tactical spikes.
- **No resolver / engine changes.** Both `{ruling_style_note}` and
  `{recent_causal}` are already wired. `{prior_decision_clause:*}` topic
  taxonomy expansion is deferred to Phase 17 where it lands corpus-wide.

## Acceptance

- `npm run audit:decrees` — 0 CRITICAL / 0 MAJOR / 0 MINOR / 0 POLISH ✓
- `npm run audit -- --family=decree --include-minor --include-polish` —
  87 POLISH (all `TAG_NEVER_READ`), unchanged from pre-walk baseline ✓
- Phase-gate invariants held:
  - Phase 2 `CRITICAL_SHALLOW_RUNTIME = 0` ✓
  - Phase 3/4a `PROMISE_NOT_DELIVERED = 0` ✓
  - Phase 4b `SCOPE_MISMATCH = 0` ✓
  - Phase 6 `SMART_CARD_COVERAGE_CLASS = 0` ✓

No `GameState` shape changes → no `LOAD_SAVE` migration → no `version`
bump.

## Files touched

| Bucket | Files |
|---|---|
| Q12 token threads | `src/data/decrees/index.ts` (10 edits), `src/data/decrees/expansion-wave-2/index.ts` (5 edits) |
| Outcome matrix | `docs/audit/findings/decrees.md` (appended below AUTO-GENERATED block) |
| Close report | `docs/audit/phase-8-findings-closed.md` (this file) |
