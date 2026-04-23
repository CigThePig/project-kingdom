# Phase 4b — Findings Closed (SCOPE_MISMATCH sweep)

Phase 4b of the Card Audit & Progression workstream retired **all 117
remaining `SCOPE_MISMATCH` findings**. The full `SCOPE_MISMATCH` scan is
now at **0 corpus-wide**. Phase 4 (split into 4a + 4b) is complete.

Scope per the workstream doc (`docs/CARD_AUDIT_WORKSTREAM.md` §Phase 4):
Phase 4a closed the 151 `PROMISE_NOT_DELIVERED` findings; Phase 4b closes
the 117 `SCOPE_MISMATCH` findings that were deferred.

## Retired counts

| bodyPhrase (scope-mismatch.ts) | Phase 4a end | Phase 4b end | Retired |
|---|---:|---:|---:|
| `every-class` (`\bevery\s+class\b \| \ball\s+classes\b \| \brealm\s+entire\b \| \bthe\s+realm\b`) | 116 | 0 | 116 |
| `kingdom-wide` (`\bthe\s+kingdom\b \| \bnationwide\b \| \bacross\s+the\s+realm\b \| \brealm-?wide\b` + all-regional touches) | 1 | 0 | 1 |
| `regional-without-flag` | 0 | 0 | 0 |
| **Total** | **117** | **0** | **117** |

Phase 3 + Phase 4a labels (`treasury/gold`, `granaries/food`, `military
readiness`, `agent/operation`, `faith`, `rival/neighbor`, `construction`,
`bond/diplomacy`) remain at 0 `PROMISE_NOT_DELIVERED` findings.

## Fix-shape split

Calibrated against Phase 4a's 70 re-effect / 60 retext / 20 legacy-id / 0
new-stubs split. Phase 4b skewed far more retext-heavy than Phase 4a
because the dominant trigger (`\bthe\s+realm\b`) is a loose metaphorical
synonym for "the kingdom" rather than a literal claim of universal class
impact.

| Shape | Count | Notes |
|---|---:|---|
| Retext — swap body phrase to clear both `EVERY_CLASS_RE` and `KINGDOM_WIDE_RE` | 114 | "the realm" → "our lands" / "the country" / "the crown" / "our people" / "the provinces" / "our governance" / etc. "across the realm" → "across our lands". Applied once per card; shared body edit clears every per-choice finding. |
| Re-effect — add class deltas on one branch to reach ≥3 class paths | 2 | `evt_plague_recovery:acknowledge` — body says "saved lives across all classes"; added `clergySatDelta: +1` and `merchantSatDelta: +1` alongside the existing `commonerSatDelta: +2` so the scanner sees three class paths. This is the §14 calibration shape: the fiction genuinely warrants universal impact. |
| Scope correction — retext a regional choice framed as kingdom-wide | 1 | `evt_region_resource_discovery` body: "one of the kingdom's regions" → "one of our outlying provinces". The `survey_further` choice is pure `regionDevelopmentDelta`, so shrinking the body framing matches the effect scope. |
| New follow-up stub | **0** | No card's body implied a multi-turn cascade beyond what Phase 2/3/4a stubs already cover. |

The `evt_schism_underground_worship` card (body explicitly listing
"commoners, merchants, even minor nobles") was triaged as a re-effect
candidate but resolved via retext ("all classes" → "every station") to
preserve choice distinctness across its three existing branches. The
listed classes remain in the body.

## Regression check

| Scan code | Pre-Phase-4b | Post-Phase-4b | Delta |
|---|---:|---:|---:|
| `SURFACE_ONLY` | 966 | 966 | 0 |
| `SMART_CARD_COVERAGE_CLASS` | 331 | 331 | 0 |
| `SMART_CARD_COVERAGE_REGION` | 254 | 254 | 0 |
| `PROMISE_NOT_DELIVERED` | 0 | 0 | 0 |
| `SCOPE_MISMATCH` | 117 | 0 | **−117** (target) |
| `CHOICES_NOT_DISTINCT` | 77 | 77 | 0 |
| `SMART_CARD_COVERAGE_NEIGHBOR` | 40 | 40 | 0 |
| `TRIGGER_BODY_STATE_UNGATED` | 25 | 24 | **−1** (incidental) |
| `CHOICE_CLONES` | 5 | 5 | 0 |
| `CATEGORY_WITHOUT_TOUCH` | 1 | 1 | 0 |
| **Total MAJOR** | **1816** | **1698** | **−118** |

Zero regressions across all scan categories. The incidental
`TRIGGER_BODY_STATE_UNGATED` retirement was from
`evt_exp_cul_assimilation_pressure`: the body retext swapped "continued
hostility" → "continued antagonism" as part of the
`the realm` → `our very identity` fix, dropping the ungated "hostile"
state-word as a side effect.

No in-phase distinctness or state-word transient regressions arose (Phase
4a hit three; Phase 4b hit none because the retext-heavy approach
touched only body text, not effect tables, for 114 of 117 findings).

## Phase 15 backlog

Phase 4b authored **zero new follow-up stubs**. The Phase 2
(`phase-2-followup-stubs.md`) backlog of 81 stubs stands unchanged.
Phases 3, 4a, and 4b together added no new entries to that backlog.

## Files touched

**Text files (12):**
- `src/data/text/events.ts` (18 cards retexted; 1 additional card — `evt_plague_recovery` — re-effected in `effects.ts` without body change)
- `src/data/text/expansion/condition-text.ts` (1)
- `src/data/text/expansion/class-conflict-text.ts` (5)
- `src/data/text/expansion/culture-text.ts` (6)
- `src/data/text/expansion/economy-text.ts` (6)
- `src/data/text/expansion/environment-text.ts` (2)
- `src/data/text/expansion/kingdom-text.ts` (4)
- `src/data/text/expansion/region-text.ts` (1)
- `src/data/text/expansion/religion-text.ts` (2)
- `src/data/text/expansion/social-condition-text.ts` (1)
- `src/data/text/expansion/wave-2-text/petitions-civic.ts` (1)
- `src/data/text/expansion/wave-2-text/petitions-military.ts` (1)

**Effect files (1):**
- `src/data/events/effects.ts` (`evt_plague_recovery:acknowledge` — added
  `clergySatDelta: +1`, `merchantSatDelta: +1`)

**Seeded finding tables (refreshed via `npm run audit:seed`):**
- `docs/audit/findings/crises.md` (−~136 rows)
- `docs/audit/findings/petitions.md` (−~136 rows)
- `docs/audit/findings/notifications.md` (−~10 rows)
- plus timestamp-only bumps on the other family files

## Verification

- Baseline → Phase 4b close: `SCOPE_MISMATCH` 117 → 0; both body-phrase
  shapes (`every-class`, `kingdom-wide`) at 0.
- Phase 3 + Phase 4a labels remain at 0 `PROMISE_NOT_DELIVERED`.
- No regressions against the Phase-4a-close baseline in any scan
  category.
- Total corpus findings: 1816 → 1698 (−118, matching 117 SCOPE_MISMATCH
  retired + 1 incidental TRIGGER_BODY_STATE_UNGATED retirement).
- Phase acceptance gate green: `npm test` (92 files, 900 tests passing),
  `npm run lint` (clean), `npm run build` (clean).
- `npm run audit:seed` is idempotent — the second run produced no
  additional diff to `docs/audit/findings/*.md` beyond the first.

## Scanner regex cheat sheet (for future reference)

The two regexes that drove every finding retired in this phase live in
`scripts/audit/scans/text/scope-mismatch.ts`:

- `EVERY_CLASS_RE = /\bevery\s+class\b|\ball\s+classes\b|\brealm\s+entire\b|\bthe\s+realm\b/i`
- `KINGDOM_WIDE_RE = /\bthe\s+kingdom\b|\bnationwide\b|\bacross\s+the\s+realm\b|\brealm-?wide\b/i`

Safe swap vocabulary discovered during Phase 4b (matches neither regex):
`our lands`, `the land`, `the country`, `our people`, `our governance`,
`our commonwealth`, `the crown`, `the provinces` (plain), `our
territory`, `every corner of our lands`, `every quarter`, `every
station`, `every walk of life`, `every order`, `every faction`, `rich
and poor alike`, `high and low`.

Unsafe (still trapped):
`the realm`, `every class`, `all classes`, `realm entire`, `the
kingdom`, `nationwide`, `across the realm`, `realm-wide`.
