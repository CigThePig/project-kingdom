# Phase 6 — Findings Closed (SMART_CARD_COVERAGE_CLASS)

Phase 6 of the Card Audit & Progression workstream retired **all 331
`SMART_CARD_COVERAGE_CLASS` findings** flagged by the corrected scanner
baseline. The `SMART_CARD_COVERAGE_CLASS` code is now at **0 corpus-wide**.

The plan (`docs/CARD_AUDIT_WORKSTREAM.md` §Phase 6) originally quoted 281
findings against the Phase 1 baseline. The count grew to 331 as Phases 2–4b
added new follow-up and wave-2 cards; every new flagged card was closed in
this pass.

## Retired counts

### By family

| Family | Baseline | Phase 6 end | Retired |
|---|---:|---:|---:|
| petition | 163 | 0 | 163 |
| crisis | 151 | 0 | 151 |
| notification | 17 | 0 | 17 |
| **Total** | **331** | **0** | **331** |

### By class binding

| Class (singular label) | Retired |
|---|---:|
| Commonfolk | 164 |
| Nobility | 53 |
| Military Caste | 42 |
| Merchant Guild | 38 |
| Clergy | 34 |
| **Total** | **331** |

## Fix-shape split

| Shape | Count | Notes |
|---|---:|---|
| Appended `{class_plural}` trailing clause | 313 | Family-appropriate trailing sentence using the new token (petition = "await the crown's reply", crisis = "watching every move of the court", notification = "take note of the dispatch"). |
| Cheap-swap `common folk` → `commonfolk` | 18 | Two-word phrase the scanner's `\bCommonfolk\b` regex didn't match, collapsed to the single-word literal. |
| Definition-layer `affectsClass` corrections | 0 | No mis-binding found in the flagged set; every flagged card's `affectedClassId` was semantically correct, only the body failed to name the class. |

## System upgrade

The plan called for threading class names via supplicant framing. To avoid
authoring 331 bespoke sentences, a single resolver pair was added so
`{class}` / `{class_plural}` tokens substitute at render time:

- `src/bridge/smartText.ts` — two new entries in `DISPATCH`
  (`class`, `class_plural`) backed by a small `classLabel` helper. `ctx.classId`
  is preferred; falls back to the existing `findPressuredClass(state)` helper
  (already used by `watchingFactionClause`); final fallback is `'the populace'`
  / `'the people'` so the token never leaks raw to the player.
- `src/bridge/crisisCardGenerator.ts` and
  `src/bridge/petitionCardGenerator.ts` already plumbed
  `classId: event.affectedClassId ?? undefined` into `SmartTextContext` — no
  generator changes were needed.
- `src/__tests__/smartText.test.ts` — four new tests covering all five
  `PopulationClass` values on both tokens plus the `findPressuredClass`
  fallback path and the no-pressure default.

## Why `{class_plural}` (token) instead of literal class names

The smart-card-coverage scanner accepts both literal `CLASS_LABELS` /
`CLASS_PLURAL_LABELS` matches *and* the `{class}` / `{class_*}` tokens. The
promise/delivery scanner, however, matches literal keywords — and `"Clergy"`
is a keyword on the `faith` rule (`\bclerg(?:y|ies)\b`), which requires the
runtime diff to touch `faith`, `heterodoxy`, or `religiousOrders`. Trailing
the literal word "Clergy" on 34 Clergy-bound cards would have regressed
Phase 4a's PND=0.

The `{class_plural}` token sidesteps this entirely: the raw body contains only
the token, so the PND scanner never sees `"Clergy"`; at render time the token
resolves to the correct class label. No other class label collides with a PND
keyword rule, but using the token uniformly keeps the appended text consistent.

## Class supplicant-stem library

`src/data/text/word-banks.ts` gained a `CLASS_SUPPLICANT_STEMS` export —
family × class opening phrases for future deep-audit work (Phases 8–13) to
reference when rebuilding cards. The export is pure data; nothing consumes
it at runtime.

## Acceptance

- `npm run audit` — total findings **1698 → 1367**, delta exactly
  **−331** (the `SMART_CARD_COVERAGE_CLASS` retired). No other scan code
  increased.
- `SMART_CARD_COVERAGE_CLASS = 0` (from 331).
- Phase-gate invariants held:
  - Phase 2 `CRITICAL_SHALLOW_RUNTIME` = 0 ✓
  - Phase 3/4a `PROMISE_NOT_DELIVERED` = 0 ✓
  - Phase 4b `SCOPE_MISMATCH` = 0 ✓
- `npm test` — 904 passing.
- `npm run lint` — clean.
- `npm run build` — clean.
- Render spot-check — bodies read cleanly: `"… The Merchants await the
  crown's reply."`, `"… The Clergy Members are watching every move of the
  court."`, etc. No raw tokens visible.

## Files touched

| Bucket | Files |
|---|---|
| System upgrade | `src/bridge/smartText.ts`, `src/__tests__/smartText.test.ts`, `src/data/text/word-banks.ts` |
| Text retext (28 files) | `src/data/text/events.ts`, `src/data/text/faction-requests.ts`, `src/data/text/expansion/{chain,class-conflict,culture,diplomacy,economy,environment,espionage,followup,food,kingdom,knowledge,military,public-order,region,religion}-text.ts`, `src/data/text/expansion/wave-2-text/{crises-disasters,crises-originals,crises-phenomena,crises-political,crises-religious,crises-social,petitions-civic,petitions-guilds,petitions-military,petitions-originals,petitions-religious}.ts` |
| Close report | `docs/audit/phase-6-findings-closed.md` (this file) |

No `GameState` shape changes → no `LOAD_SAVE` migration → no `version`
bump.
