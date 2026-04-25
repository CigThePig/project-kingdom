# Phase 10 — Findings Closed (Assessments + Negotiations + Overtures)

Phase 10 of the Card Audit & Progression workstream is the combined deep
audit of three small families against the 15 standing audit questions
(`docs/CARD_AUDIT_QUESTIONS.md`). The three families share a common
pipeline (each is a non-pool generator-emitted card family in
`src/bridge/`) but each carries its own `CARD_AUDIT_RULES.md` §9 rubric
overlay: confidence-tier language for assessments, per-term
distinctness and counterparty framing for negotiations, agenda-keyed
thematic anchoring for overtures.

## Scope

| Family | Cards | Pre-walk MAJOR | Post-walk MAJOR |
|---|---:|---:|---:|
| Assessment | 12 | 0 | 0 |
| Negotiation | 13 | 0 | 0 |
| Overture | 23 (12 agendas × inline + wave-2 variants) | 6 | 0 |

The scanner was already 0/0/6 going in — assessment and negotiation
findings were retired by the runtime-grounded surface-only patch in
Phase 9, and overtures inherited the Phase 5/6 smart-card-coverage
sweep. Phase 10's real targets are the qualitative §9 items the
scanner can't see: confidence-tone alignment on assessment bodies,
neighbor-name threading inside negotiation term descriptions,
agenda-thematic content on overture variants, and the spouse-name
hardcode that has lived in the marriage-bond materializer since
Phase 13.

## Pre-walk state

```
npm run audit:assessment   → 0 / 0 / 0 / 0
npm run audit:negotiation  → 0 / 0 / 0 / 0
npm run audit:overture     → 0 / 6 / 0 / 0   (text.smart-card-coverage)

Full corpus (npm run audit): 140 MAJOR
```

The 6 overture findings were on diplomacy events the scanner
co-classifies into the overture family because their content is
neighbor-scoped: `evt_foreign_cultural_influx`,
`evt_exp_dip_cultural_envoy`, `evt_exp_dip_diplomatic_gift`,
`evt_exp_esp_double_agent_dilemma`,
`evt_exp_esp_intercepted_dispatches`, `evt_border_envoy_terms`.

## Slab 1 — Assessments (12 cards)

### Engine surface

Added `{intel_grade}` smart-text token in
`src/bridge/smartText.ts` plus a `confidenceLevel?: ConfidenceLevel`
field on `SmartTextContext`. The resolver emits one of three short
opener clauses keyed on the level the generator already derives from
trigger density:

```
low      → "Reports remain unverified"
moderate → "Credible reports indicate"
high     → "Reliable sources confirm"
```

Wired the confidence value into the smart-text context inside
`src/bridge/assessmentCardGenerator.ts:101-105` so the level is no
longer computed-and-thrown-away.

### Body retexts (Q5 confidence-tone alignment, 6 cards)

| Card | Change |
|---|---|
| `assess_border_movement` | body opens with `{intel_grade}:` and reframes the unresolved-source motif as an explicit confidence claim |
| `assess_diplomatic_signal` | body opens with `{intel_grade}:` + names `{neighbor}` / `{ruler_full}` |
| `assess_internal_unrest_rumor` | body opens with `{intel_grade}:`; "the watch cannot tell" pins the source to a verifiable channel |
| `assess_religious_movement` | body opens with `{intel_grade}:`; "neither renewal nor heresy can be ruled out at this grade" |
| `assess_coastal_vessel_sighting` | body opens with `{intel_grade}:`; "intent cannot be deduced from the silhouette alone" |
| `assess_strange_illness_outbreak` | body opens with `{intel_grade}:`; "the cause cannot be named from what little has reached court so far" |

### Intelligence-acting choices (Q7, 3 cards)

The §9 assessments rubric requires at least one choice that *acts on
the intelligence itself* — corroborate, share, exploit — rather than
generic political positioning. Three cards lacked one and were
relabeled (effects unchanged; the deltas already hit
`espionageNetworkDelta`):

| Card | Choice | Old label | New label |
|---|---|---|---|
| `assess_border_movement` | `investigate_border_movement` | "Send Scouts to Investigate" | "Run Down the Source" |
| `assess_diplomatic_signal` | `investigate_intent` | "Investigate Their Intent" | "Corroborate Through Other Courts" |
| `assess_internal_unrest_rumor` | `investigate_unrest_rumor` | "Investigate the Rumors" | "Verify Through Watch Informants" |

### Substance (Q8, 7 cards)

Notable severity = Common tier per `CARD_AUDIT_RULES.md` §2; a
temp-modifier on at least one choice is sufficient. The 7 most
surface-only assessments — those whose effects hit only stat deltas
without heterodoxy / faith / food / diplomacy structural touches —
got 3-turn temp-mods on their decisive (paid) branches via
`EVENT_CHOICE_TEMPORARY_MODIFIERS` in `src/data/events/effects.ts`
(appended at file tail):

```
assess_border_movement                  · investigate / reinforce
assess_spy_report_unverified            · verify_intelligence
assess_internal_unrest_rumor            · investigate / preemptive_concession
assess_merchant_caravan_disappearance   · fund_investigation / increase_road_patrols
assess_noble_faction_meeting            · infiltrate_meeting
assess_coastal_vessel_sighting          · send_naval_scouts / fortify_harbor
assess_strange_illness_outbreak         · quarantine / investigate_cause
```

Each temp-mod runs 3 turns at magnitude ±1 on a stat the choice's
fiction would naturally extend (espionage for investigations,
treasury+military for reinforcements, stability+merchant for
quarantines). The 5 remaining assessments already touched
heterodoxy / culture / faith / food and didn't need new entries.

## Slab 2 — Negotiations (13 cards / ~37 terms)

### Per-term `{neighbor_short}` threading (Q5)

External negotiations named the counterparty in the title and opening
sentence but reverted to "them" / "foreign traffic" inside term
descriptions. Threaded `{neighbor_short}` / `{dynasty}` per term in
`src/data/text/negotiations.ts`:

| Negotiation | Term descriptions edited |
|---|---|
| `neg_trade_deal` | `bulk_pricing_agreement` (named neighbor) |
| `neg_treaty_terms` | `trade_corridor_rights`, `border_access_agreement` |
| `neg_peace_terms` | full body retex (see Q6 below) + all 4 term descriptions reworded around `{neighbor_short}` |
| `neg_alliance_pact` | `shared_intelligence` |
| `neg_marriage_alliance` | body + `royal_dowry`, `land_gift` |
| `neg_resource_blockade` | already named neighbor in every term — no change |

### Trigger coherence (Q6) — `neg_peace_terms`

Body said "After prolonged conflict, both sides have agreed to
negotiate." Trigger only checked `stability < 40 + turn ≥ 8` — no war
gate. The engine has no `neighbor_at_war_with_player` condition type
(adding one was deferred per the plan to avoid engine surface
expansion). Retexted instead: title "Settlement Talks with
{neighbor}", body opens "With the kingdom strained and standing toward
{neighbor} grown {posture}…" — frames the trigger's actual gate
(stability crisis + degraded posture) rather than a war that may not
exist.

### Posture-differentiated body flavor (3 negotiations)

Phase 10 doesn't change which terms are offered (term-subset
filtering is deferred to Phase 18), but bodies now carry posture-aware
sentences via existing memory tokens so the same negotiation reads
differently when the counterparty is Friendly vs. Hostile:

- `neg_peace_terms`: `{posture}` + `{neighbor_memory_clause}`
- `neg_marriage_alliance`: `{posture}` + `{neighbor_memory_clause}`
- `neg_merchant_guild_charter`: `{watching_faction}` +
  `{prior_decision_clause:guild}`

### Bond materialization audit (Q8)

Walked the 16 bond-tagged terms in
`src/bridge/negotiationBondMap.ts:TERM_ID_TO_BOND_KIND` and confirmed
`directEffectApplier.appendBondForTerm` constructs every kind cleanly.
The one hardcoded field was `spouseName: 'consort'` in
`buildBondForKind` — replaced with a deterministic
`generateSpouseName(neighborId)` call (see Slab 3 for the generator).
The same fix was applied to the two `createMarriageBond` call sites
in `src/engine/resolution/apply-action-effects.ts` (royal_marriage
decree handler at line 376, dynasty_alliance handler at line 387).

## Slab 3 — Overtures (12 agendas)

### Engine surface

Added `{spouse_name}` smart-text token to `src/bridge/smartText.ts`
(reads `ctx.spouseName`, falls back to "a royal consort"). The
overture allowlist in
`scripts/audit/scans/overtures/placeholder-resolution.ts` was
extended to include both `region` and `spouse_name`, since the
overture generator now binds them per-agenda.

Added `generateSpouseName(neighborId, gender?)` to
`src/data/text/name-generation.ts`. Seed is keyed on `neighborId`
only (turn-stable) so the body shown at presentation matches the
name written into the marriage bond at resolution.

### Per-agenda thematic keying (§9)

`src/bridge/diplomaticOvertureGenerator.ts:generateOvertureCards`
now binds two extra context fields per agenda before
`substituteSmartPlaceholders` runs:

```
RestoreTheOldBorders → ctx.regionId = pickClaimedRegionId(state, neighbor)
DynasticAlliance     → ctx.spouseName = generateSpouseName(neighbor.id)
```

`pickClaimedRegionId` prefers `agenda.targetEntityId` when it points at
a region; falls back to the rival's most recent
`territorial_loss` memory anchor; finally falls back to the kingdom's
first region so bodies always name somewhere concrete.

Body retexts in `src/data/text/overtures.ts`:

| Agenda | Old fragment | New fragment |
|---|---|---|
| `RestoreTheOldBorders` | "demanding you cede the disputed territory" | "demanding you cede {region}" (also threaded into the grant title: "Cede {region}") |
| `DynasticAlliance` | "a formal proposal of marriage between your houses" | "a formal proposal: {spouse_name} of {dynasty} to be wedded to your own line" |

### Smart-card coverage retext (6 events)

The scanner co-classifies 6 diplomacy / espionage events into the
overture family because they're neighbor-scoped. Threaded `{neighbor}`
into each body / title:

| Card | File |
|---|---|
| `evt_foreign_cultural_influx` | `src/data/text/events.ts` |
| `evt_border_envoy_terms` | `src/data/text/events.ts` |
| `evt_exp_dip_cultural_envoy` | `src/data/text/expansion/diplomacy-text.ts` |
| `evt_exp_dip_diplomatic_gift` | `src/data/text/expansion/diplomacy-text.ts` |
| `evt_exp_esp_double_agent_dilemma` | `src/data/text/expansion/espionage-text.ts` |
| `evt_exp_esp_intercepted_dispatches` | `src/data/text/expansion/espionage-text.ts` |

### 15-question spot-check on agenda × variant matrix

Walked the 12 × ~2 matrix qualitatively. No rebuilds or new variants
authored. Findings:

- `Vassalize` / `SubjugateAVassal` grant path remains a posture
  nudge with no `vassalage` bond materialization — engine doesn't
  wire overture grants into bond construction the way negotiation
  acceptances do. Deferred: needs an overture-bond plumbing pass
  (Phase 17 or a dedicated phase 10.5 follow-up).
- `IsolationistRetreat`, `EconomicRecovery`: grant/deny pairs are
  already structurally distinct per
  `overtures.grant-deny-runtime-parity` (scan-clean).
- `DominateTrade` (both variants) is the calibration reference for
  agenda-thematic keying — no edits needed.

## Acceptance

```
Post Phase 10 (npm run audit):
  CRITICAL = 0
  MAJOR    = 134        (was 140; Δ −6)
  MINOR    = 0
  POLISH   = 0

Per-family deltas:
  assessment    : 0 → 0      (qualitative pass; no scanner delta)
  negotiation   : 0 → 0      (qualitative pass; no scanner delta)
  overture      : 6 → 0      (Δ −6 — 6 diplomacy-event neighbor retexts)

Out-of-scope families unchanged:
  petition      : 98
  notification  : 15
  unknown       :  21       (Phase 11–13 territory)
```

Phase gate:
- `npm test` — 911 pass, 93 files
- `npm run lint` — clean
- `npm run build` — dist emitted, PWA precache 16 entries (1970 KiB)
- `npm run audit:seed` — per-family findings docs refreshed

## Question tally

| Q | Description | Touched | Action |
|---:|---|---:|---|
| 1 | Pattern fit | — | All 3 families Pattern A; no relocations. |
| 2 | Family fit | — | Phase 7 reconciliation holds; no mis-family cards remain. |
| 3 | Duplicate check | — | `docs/audit/duplicate-reconciliation.md` mapping unchanged. |
| 4 | Wiring | — | All scanner wiring scans clean. |
| 5 | Smart-card coverage | **8** | 6 assessment retexts + 6 diplomacy-event retexts (overture-classified) — neighbor / intel-grade tokens threaded into bodies. |
| 6 | Trigger coherence | **1** | `neg_peace_terms` body retexted to match its actual stability/posture trigger gate. |
| 7 | Choice distinctness | **3** | Assessment intelligence-acting choices on `assess_border_movement`, `assess_diplomatic_signal`, `assess_internal_unrest_rumor`. |
| 8 | Substance (§2) | **7 + 16** | 7 assessments got 3-turn temp-mods on decisive branches; verified 16 bond-tagged negotiation terms materialize bonds; replaced 3 hardcoded `'consort'` literals with `generateSpouseName`. |
| 9 | Severity–magnitude coherence | 0 | Scanner-clean. |
| 10 | Category coherence | 0 | Scanner-clean. |
| 11 | Promise ↔ delivery | 0 | Retired corpus-wide in Phases 3 / 4a. |
| 12 | Progression memory | **3** | Posture / memory clause flavor on `neg_peace_terms`, `neg_marriage_alliance`, `neg_merchant_guild_charter`. |
| 13 | Follow-up shape | — | Phase 15 owns follow-up authoring. |
| 14 | Cost asymmetry | — | Negotiation terms by design uniform-cost (no slot delta); assessment costs already asymmetric (paid investigations vs free hedge). |
| 15 | Authoring self-test | 0 | No rebuild queue additions. `docs/audit/rebuild-queue.md` unchanged. |

## Files touched

**Engine surface:**
- `src/bridge/smartText.ts` — `confidenceLevel`, `spouseName` context
  fields; `intel_grade`, `spouse_name` resolvers; `INTEL_GRADE_CLAUSES`
  table.
- `src/bridge/assessmentCardGenerator.ts` — passes `confidenceLevel`
  into `SmartTextContext`.
- `src/bridge/diplomaticOvertureGenerator.ts` — agenda-keyed `regionId`
  / `spouseName` context binding via new `pickClaimedRegionId` helper.
- `src/bridge/directEffectApplier.ts` — `generateSpouseName` import +
  `buildBondForKind` royal_marriage case.
- `src/engine/resolution/apply-action-effects.ts` — `generateSpouseName`
  import + the two `createMarriageBond` call sites
  (`royal_marriage` decree, `dynasty_alliance` decree).
- `src/data/text/name-generation.ts` — new `generateSpouseName`
  function.

**Data — assessments:**
- `src/data/text/assessments.ts` — body retexts on 6 cards; choice
  label rewrites on 3 cards.
- `src/data/events/effects.ts` — 7 new
  `EVENT_CHOICE_TEMPORARY_MODIFIERS` entries.

**Data — negotiations:**
- `src/data/text/negotiations.ts` — body and per-term retexts on 5
  external negotiations + posture flavor on 3.

**Data — overtures and overture-classified events:**
- `src/data/text/overtures.ts` — `RestoreTheOldBorders` and
  `DynasticAlliance` body / title retexts.
- `src/data/text/events.ts` — `evt_foreign_cultural_influx`,
  `evt_border_envoy_terms` neighbor threading.
- `src/data/text/expansion/diplomacy-text.ts` —
  `evt_exp_dip_cultural_envoy`, `evt_exp_dip_diplomatic_gift`.
- `src/data/text/expansion/espionage-text.ts` —
  `evt_exp_esp_double_agent_dilemma`,
  `evt_exp_esp_intercepted_dispatches`.

**Audit harness:**
- `scripts/audit/scans/overtures/placeholder-resolution.ts` — added
  `region` and `spouse_name` to the overture token allowlist.

**Audit bookkeeping:**
- `docs/audit/findings/{assessments,negotiations,overtures}.md` — re-seeded
  via `npm run audit:seed`.
- `docs/audit/findings.json`, `docs/audit/coverage.json`,
  `docs/audit/engine-mismatches.json`, `docs/audit/migration-list.md`
  — regenerated.

## Phase 15 backlog

Zero new follow-up stub IDs reserved. The structural progression for
Phase 10 is carried by:
- Assessment temp-modifiers (3-turn ongoing footprints).
- Negotiation bond materialization (already wired pre-Phase-10;
  spouse-name plumbing fixes a long-standing hardcode).
- Overture spouse-name carry-through (deterministic name persists
  across the body and the resulting marriage bond — the player sees
  the same name in the overture text and in the bond panel).

A single deferred work item: `Vassalize` / `SubjugateAVassal`
overture grants do not currently materialize a `vassalage` bond on
accept. This is the same shape as the negotiation bond
materialization but for overtures, which currently take only inline
relationship + memory deltas. Wiring overture grants into bond
construction is a Phase 10.5 follow-up or an overflow into
Phase 17 (consequence-tag reader expansion) — not in this slab's
scope.

## Phase 10.5 — closed

The deferred item above is closed. Note: only `SubjugateAVassal`
exists as a `RivalAgenda` enum value; the original "Vassalize" mention
was imprecise — that agenda does not exist. The single deferred row
mapped to a single agenda.

### Change

`applyOvertureDecision` in
`src/engine/resolution/apply-action-effects.ts` now branches on
`agenda === RivalAgenda.SubjugateAVassal` inside the existing agenda
side-effect switch. On the grant path it constructs a `vassalage` bond
between the source rival (overlord) and the rival's resolved
`agenda.targetEntityId` (vassal), with `tributePerTurn: 25` matching
the negotiation pipeline default at
`src/bridge/directEffectApplier.ts:254-260`. The relationship-score
nudge and `favor` memory write layer on top — they are not replaced.

### Necessary correctness fix

`tickVassalage` in `src/engine/systems/bonds.ts` previously assumed
the player was always a participant: any non-player overlord caused
the player's treasury to lose `tributePerTurn` each tick. With the
new inter-rival bond path, that path was suddenly reachable. The tick
now zeroes the player tribute delta when neither overlord nor any
participant is `'player'`, leaving the bond's vassal-side
expansionist-pressure dampening intact.

### Tests

Three new tests in `src/__tests__/bonds.test.ts`:
- Grant materialises a `vassalage` bond with the source rival as
  overlord and `agenda.targetEntityId` as participant.
- Deny path leaves no bond on state.
- Inter-rival vassalage tick does not move the player's treasury
  (regression guard for the `tickVassalage` fix above).

### Acceptance

- `npm test`: 914 pass (was 911; +3 new tests).
- `npm run lint`: clean.
- `npm run build`: dist emitted.
- `npm run audit -- --fail-on=major`: full corpus delta unchanged
  (this is a structural fix, not a text fix; no scanner-visible
  finding count moves).
- Save-compat: no `GameState` shape change, no version bump required.
  Bonds are appended to the existing `state.diplomacy.bonds` array.

### Files touched

- `src/engine/resolution/apply-action-effects.ts` — added
  `createVassalageBond` import; new `SubjugateAVassal` case in
  `applyOvertureDecision`'s agenda switch.
- `src/engine/systems/bonds.ts` — `tickVassalage` no-ops player-side
  tribute when the player is uninvolved.
- `src/__tests__/bonds.test.ts` — three new tests.
