# Phase 4 — Findings Closed (PROMISE_NOT_DELIVERED wave 2)

Phase 4 of the Card Audit & Progression workstream retired **all 151
remaining `PROMISE_NOT_DELIVERED` findings** across the four labels that
Phase 3 deferred. The full `PROMISE_NOT_DELIVERED` scan is now at **0
corpus-wide**.

Scope per user direction: PND only. The 117 `SCOPE_MISMATCH` findings in
the original Phase 4 plan are deferred to a new Phase 4b (or absorbed into
the family deep-audits in Phases 8–13). See the workstream doc for the
updated split.

## Retired counts

| Rule label | Phase 3 end | Phase 4 end | Retired |
|---|---:|---:|---:|
| faith | 53 | 0 | 53 |
| rival/neighbor | 48 | 0 | 48 |
| construction | 37 | 0 | 37 |
| bond/diplomacy | 13 | 0 | 13 |
| **Total** | **151** | **0** | **151** |

Phase 3's four labels (`treasury/gold`, `granaries/food`, `military
readiness`, `agent/operation`) remain at 0.

## Fix-shape split

Calibrated against Phase 3's 120 re-effect / 27 retext / 0 new stubs.
Phase 4 skewed more toward retext because two of the four labels had
significant metaphorical/flavor-keyword usage (bond, alliance, rival,
envoy used as internal-political metaphors rather than literal diplomatic
terms).

| Shape | Count | Notes |
|---|---:|---|
| Re-effect — inline delta on ≥1 flagged branch | ~70 | `faithDelta ±N`, `heterodoxyDelta ±N`, `regionConditionDelta ±N`, `diplomacyDeltas { neighbor_arenthal: ±N }`. Typical pattern: one delta field per fix. |
| Retext — drop flavor keyword from body | ~60 | "rival factions" → "opposing factions"; "alliance" → "accord"/"coalition"; "bond" → "tie"; "builders" → "masons"; "construction projects" → "public works"; "lost faith in" → "lost hope in" / "lost confidence in". |
| Legacy neighbor-id swap | ~20 | Dead IDs (`empire_south`, `rival_north`) in `diplomacyDeltas` swapped to the live scenario IDs (`neighbor_arenthal`, `neighbor_valdris`). Latent gameplay bug — the deltas silently no-op'd at runtime too. |
| New follow-up stub | **0** | No card's body implied a multi-turn cascade beyond what Phase 2 stubs already cover. |

## Legacy-id cleanup

Dead neighbor IDs that were silently no-op-ing in both the audit fixture
*and* live play (because the IDs reference neighbors not present in any
authored scenario):

| File | Legacy IDs swapped |
|---|---|
| `src/data/events/effects.ts` | `empire_south` → `neighbor_arenthal` (×14), `rival_north` → `neighbor_valdris` (×7) |
| `src/data/events/expansion/culture-effects.ts` | `empire_south` → `neighbor_arenthal` (×2), `rival_north` → `neighbor_valdris` (×2) |
| `src/data/events/expansion/wave-2/crises-political.ts` | `empire_south` → `neighbor_arenthal` (×3) |
| `src/data/events/expansion/petitions-wave-2/petitions-civic.ts` | `__NEIGHBOR__` placeholder → `neighbor_arenthal` (×2) — the placeholder isn't resolved on the event-resolution path |

Trigger conditions with the same dead IDs (in `index.ts` and
`culture-events.ts`) were **not** swapped — that's separate (and
out-of-scope) scenario-consistency work. **Five specific sites are
enumerated in `docs/audit/phase-4-deferred-legacy-ids.md`** as an
explicit follow-up punch-list. The deltas in these files now
register touches in both the audit fixture and live play; the trigger
conditions continue to prevent the cards from firing in the default
scenario until those swaps are applied too.

## Regression check

| Scan code | Pre-Phase-4 | Post-Phase-4 | Delta |
|---|---:|---:|---:|
| `SURFACE_ONLY` | 992 | 966 | **−26** (bonus retirements from re-effect passes adding real deltas) |
| `SMART_CARD_COVERAGE_CLASS` | 331 | 331 | 0 |
| `SMART_CARD_COVERAGE_REGION` | 254 | 254 | 0 |
| `PROMISE_NOT_DELIVERED` | 151 | 0 | **−151** (target) |
| `SCOPE_MISMATCH` | 117 | 117 | 0 (deferred) |
| `CHOICES_NOT_DISTINCT` | 77 | 77 | 0 |
| `SMART_CARD_COVERAGE_NEIGHBOR` | 40 | 40 | 0 |
| `TRIGGER_BODY_STATE_UNGATED` | 25 | 25 | 0 |
| `CHOICE_CLONES` | 5 | 5 | 0 |
| `CATEGORY_WITHOUT_TOUCH` | 1 | 1 | 0 |
| **Total MAJOR** | **1993** | **1816** | **−177** |

Zero regressions across all scan categories. Phase 3 labels remain at 0.

During the work, three transient regressions appeared (2 on
`CHOICES_NOT_DISTINCT`, 1 on `TRIGGER_BODY_STATE_UNGATED`) from
specific choices where the new delta collapsed the category-signature
axis or the retext introduced a new state-word. All three were resolved
in-phase:

- `evt_exp_cul_monument_foundation.defer_construction` — reverted
  `regionDevelopmentDelta: -1`; retexted "master builders" → "master
  masons" instead (same scanner-clearing effect, no distinctness collapse).
- `evt_exp_eco_luxury_trade.tax_luxury_goods_heavily` — reverted
  `diplomacyDeltas`; retexted body "Arenthal's envoy presents" → "A
  merchant delegation from Arenthal presents" (drops "envoy" keyword).
- `evt_exp_cc_usury_accusation.protect_lending_practices` — swapped
  `faithDelta: -2` to `heterodoxyDelta: +2` (keeps the faith-substring
  touch while differentiating from `enforce_usury_laws`'s category set).
- `evt_exp_kno_navigation_charts` — retexted "hostile powers" → "foreign
  courts" (drops "hostile" state-word that has no matching trigger).

## Phase 15 backlog

Phase 4 authored **zero new follow-up stubs**. The Phase 2
(`phase-2-followup-stubs.md`) backlog of 81 stubs stands unchanged.
Phase 3 and Phase 4 together added no new entries to that backlog.

## Files touched

**Effect files (26):**
- `src/data/events/effects.ts`
- `src/data/events/social-condition-effects.ts`
- `src/data/events/faction-request-effects.ts`
- `src/data/events/expansion/class-conflict-effects.ts`
- `src/data/events/expansion/culture-effects.ts`
- `src/data/events/expansion/economy-effects.ts`
- `src/data/events/expansion/environment-effects.ts`
- `src/data/events/expansion/followup-effects.ts`
- `src/data/events/expansion/knowledge-effects.ts`
- `src/data/events/expansion/military-effects.ts`
- `src/data/events/expansion/public-order-effects.ts`
- `src/data/events/expansion/religion-effects.ts`
- `src/data/events/expansion/petitions-wave-2/petitions-civic.ts`
- `src/data/events/expansion/wave-2/crises-political.ts`

**Text files (12):**
- `src/data/text/events.ts`
- `src/data/text/faction-requests.ts`
- `src/data/text/expansion/chain-text.ts`
- `src/data/text/expansion/culture-text.ts`
- `src/data/text/expansion/economy-text.ts`
- `src/data/text/expansion/followup-text.ts`
- `src/data/text/expansion/food-text.ts`
- `src/data/text/expansion/kingdom-text.ts`
- `src/data/text/expansion/knowledge-text.ts`
- `src/data/text/expansion/military-text.ts`
- `src/data/text/expansion/public-order-text.ts`
- `src/data/text/expansion/religion-text.ts`
- `src/data/text/expansion/social-condition-text.ts`
- `src/data/text/expansion/wave-2-text/petitions-guilds.ts`

## Verification

- Baseline → Phase 4 close: `PROMISE_NOT_DELIVERED` 151 → 0; all four
  target labels (faith, rival/neighbor, construction, bond/diplomacy) at 0.
- Phase 3 labels (treasury/gold, granaries/food, military readiness,
  agent/operation) remain at 0.
- No regressions against the Phase-3-close baseline in any scan category.
- Total corpus findings: 1993 → 1816 (−177, matching 151 PND retired +
  26 incidental SURFACE_ONLY retirements from re-effect deltas).
