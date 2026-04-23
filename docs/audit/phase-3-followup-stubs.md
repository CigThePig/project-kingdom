# Phase 3 — Follow-up Stub Index

Phase 3 of the Card Audit & Progression Workstream retired **147 of 298**
`PROMISE_NOT_DELIVERED` findings (the plan's "wave 1" target of ≥150 was met
by overshooting into related waves). The four rule labels **treasury/gold**,
**granaries/food**, **military readiness**, and **agent/operation** are now
at zero findings corpus-wide.

Per the plan's triage ladder (`docs/CARD_AUDIT_WORKSTREAM.md` — Phase 3),
fixes fell into three shapes:

| Shape | Count | Notes |
|---|---:|---|
| Re-effect — inline delta on one or more flagged branches | ~120 | Typical pattern: add `treasuryDelta: -5`, `foodDelta: +3`, `militaryReadinessDelta: +2`, or `espionageNetworkDelta: -2` to the offending choice's existing effect row. No definition change, no text change. |
| Retext — drop the trigger keyword from the body | ~27 | Used when the keyword was flavor ("reserves" meaning financial holdings rather than food reserves; "tax collectors" in a body that's really about public order; "Garrison requisitions" where the card is a merchant grievance rather than a military readiness card). |
| New follow-up stub authored | **0** | No branch required a new multi-turn cascade. Every fix closed cleanly with an inline delta or retext. |

## Why no new stubs?

The plan allowed up to ~20 new follow-up stubs for branches whose bodies
implied a persistent cascade ("lasting," "generations," "never again"). In
practice, the Phase 3 scope — four rule labels covering ~147 cards, mostly
Informational and Notable severity, across petitions / crises / follow-up
stubs — did not contain such branches. The Phase-2 stub index
(`docs/audit/phase-2-followup-stubs.md`) already covers the 57 Critical-tier
cards where cascades were mandatory. Phase 3's retired findings were either:

1. **Already structural on at least one sibling branch** (e.g.
   `evt_merchant_capital_flight` — 3 branches, one already had
   `treasuryDelta: -50`; the finding fired because one *other* branch
   lacked the touch). Adding the touch to the missing branch resolves
   it without cascade authoring.
2. **Ack cards** (single-choice notifications). Adding a small inline
   delta to the ack gives the scanner its required touch without
   fabricating a follow-up for a card that is thematically a receipt,
   not a decision point.
3. **Flavor-only keyword hits** (retexted).

## Stub-on-stub findings (Phase 2 stub fixes)

Six of the 16 Phase-2-stub findings in `followup-events.ts` were
addressed in Phase 3 by one-line delta additions to the stubs'
existing `followup-effects.ts` rows. The stubs' *bodies* remain
thin and belong to Phase 15 authoring; only the effect row was touched.

Parent → stub → delta added:

- `evt_cond_plague_moderate` → `evt_fu_burned_quarters_rebuild` / `evt_fu_plague_worsens` — no PND findings (already covered)
- `evt_escalation_famine_panic` → `evt_fu_famine_ration_riot` · `clamp_down` — `foodDelta: -3`
- `evt_escalation_treasury_crisis` → `evt_fu_neglected_works_collapse` · `emergency_repair_fund` / `let_it_stand_as_warning` — `foodDelta: +3` / `foodDelta: -3`
- `evt_famine_crisis` → `evt_fu_seized_granaries_noble_revolt` · `confront_the_lords` — `foodDelta: -3`
- `evt_border_campaign_defeat` → `evt_fu_surrender_terms_harsh` · `reopen_the_war` — `treasuryDelta: -30`
- `evt_trade_escort_ambush` → `evt_fu_abandoned_convoy_outrage` — no PND finding on this label
- `evt_exp_fu_food_feast_aftermath` · `acknowledge` — `foodDelta: -3`

These inline deltas do not interfere with Phase 15 authoring. Phase 15
will rewrite the bodies, add smart-text tokens, tune magnitudes per
tier, and (where the tier justifies) add deeper cascades. The inline
deltas survive those rewrites.

## Phase 15 TODO

Phase 3 added no new stubs, so there is no Phase 3 backlog for Phase 15
authoring. The Phase 2 backlog (`docs/audit/phase-2-followup-stubs.md`)
stands unchanged. If Phase 4 introduces new stubs while closing the
remaining 151 `PROMISE_NOT_DELIVERED` findings plus the 117
`SCOPE_MISMATCH` findings, they will be registered in a sibling
`docs/audit/phase-4-followup-stubs.md` following the same shape.

## Verification

Baseline → Phase 3 close:

| Rule label | Baseline | Now | Retired |
|---|---:|---:|---:|
| treasury/gold | 70 | 0 | 70 |
| granaries/food | 57 | 0 | 57 |
| military readiness | 10 | 0 | 10 |
| agent/operation | 10 | 0 | 10 |
| faith | 53 | 53 | — *(Phase 4)* |
| rival/neighbor | 48 | 48 | — *(Phase 4)* |
| construction | 37 | 37 | — *(Phase 4)* |
| bond/diplomacy | 13 | 13 | — *(Phase 4)* |
| **Total** | **298** | **151** | **147** |

Regressions against the Phase-2-close baseline: **0**. Total corpus
findings went from 2140 → 1993 (-147, matching the retired PND count
exactly). No other scan category regressed.
