---
family: hand
totalCards: 40
status: pending
lastScan: 2026-04-20T21:31:36.218Z
---

# Hand — Audit findings

The auto-generated block below is rewritten on every `npm run audit:seed`.
The `outcome` and `notes` columns are preserved across reruns when the cardId
matches; edit them freely. To exclude a card from regeneration, leave the row
in place but write an outcome — the seeder will keep your edits.

<!-- AUTO-GENERATED:START -->

**Coverage**

| Coverage area | Status |
|---|---|
| text integrity | covered (100%) |
| effect table coverage | not covered (0%) |
| runtime diff | covered (100%) |
| pressure parity | not covered (0%) |
| consequence parity | not covered (0%) |
| generated-family audit | not covered (0%) |
| AST semantic analysis | covered (100%) |
| preview parity | not covered (0%) |

| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |
|---|---|---|---|---|---|---|---|
| hand_master_builder | play | MAJOR | HEURISTIC | text.promise-delivery | hand_master_builder: body references "construction" but runtime diff shows no matching touch (touches: activeTemporaryModifiers.length, activeTemporaryModifiers[1]). |  |  |
| hand_master_builder | play | MAJOR | HEURISTIC | text.promise-delivery | hand_master_builder: body references "military readiness" but runtime diff shows no matching touch (touches: activeTemporaryModifiers.length, activeTemporaryModifiers[1]). |  |  |
| hand_scholars_insight | play | MAJOR | HEURISTIC | text.promise-delivery | hand_scholars_insight: body references "faith" but runtime diff shows no matching touch (touches: activeTemporaryModifiers.length, activeTemporaryModifiers[1]). |  |  |
| hand_royal_announcement | play | MAJOR | HEURISTIC | text.promise-delivery | hand_royal_announcement: body references "construction" but runtime diff shows no matching touch (touches: narrativePressure.authority, narrativePressure.piety, narrativePressure.commerce). |  |  |
| hand_seize_contraband | play | MAJOR | HEURISTIC | text.promise-delivery | hand_seize_contraband: body references "agent/operation" but runtime diff shows no matching touch (touches: treasury.balance, population.Merchants.satisfaction). |  |  |
| hand_emergency_levy | play | MAJOR | HEURISTIC | text.scope-mismatch | hand_emergency_levy: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 0 class path(s). |  |  |
| hand_papal_blessing | play | MAJOR | HEURISTIC | text.scope-mismatch | hand_papal_blessing: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 1 class path(s). |  |  |
| hand_grand_assize | play | MAJOR | HEURISTIC | text.scope-mismatch | hand_grand_assize: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 1 class path(s). |  |  |
| hand_chronicler_summoned | play | MAJOR | HEURISTIC | text.scope-mismatch | hand_chronicler_summoned: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 0 class path(s). |  |  |
| hand_court_favor | play | MAJOR | HEURISTIC | hand.choice-fallback-risk | hand_court_favor: apply contains `if (choice.kind !== '…') return state;` — the declared requiresChoice is effectively unenforced inside the body. |  |  |
| hand_reserve_forces | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_reserve_forces: runtime diff shows only surface touches (military.readiness) — the card pushes sliders with no structural side effect. |  |  |
| hand_court_favor | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_court_favor: runtime diff shows only surface touches (population.Commoners.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_forced_levy | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_forced_levy: runtime diff shows only surface touches (population.Commoners.satisfaction, military.forceSize) — the card pushes sliders with no structural side effect. |  |  |
| hand_grain_reserve | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_grain_reserve: runtime diff shows only surface touches (food.reserves) — the card pushes sliders with no structural side effect. |  |  |
| hand_tithe_forgiven | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_tithe_forgiven: runtime diff shows only surface touches (treasury.balance, population.Clergy.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_disciplined_march | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_disciplined_march: runtime diff shows only surface touches (military.readiness, military.morale) — the card pushes sliders with no structural side effect. |  |  |
| hand_merchant_guild_favor | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_merchant_guild_favor: runtime diff shows only surface touches (treasury.balance, population.Merchants.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_bookkeepers_audit | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_bookkeepers_audit: runtime diff shows only surface touches (treasury.balance) — the card pushes sliders with no structural side effect. |  |  |
| hand_border_patrol | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_border_patrol: runtime diff shows only surface touches (military.readiness, military.morale) — the card pushes sliders with no structural side effect. |  |  |
| hand_emergency_levy | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_emergency_levy: runtime diff shows only surface touches (treasury.balance, stability.value) — the card pushes sliders with no structural side effect. |  |  |
| hand_market_day_proclaimed | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_market_day_proclaimed: runtime diff shows only surface touches (treasury.balance, population.Merchants.satisfaction, population.Commoners.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_seize_contraband | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_seize_contraband: runtime diff shows only surface touches (treasury.balance, population.Merchants.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_treasury_inspection | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_treasury_inspection: runtime diff shows only surface touches (treasury.balance, population.Nobility.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_call_to_arms | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_call_to_arms: runtime diff shows only surface touches (treasury.balance, military.forceSize) — the card pushes sliders with no structural side effect. |  |  |
| hand_veterans_homecoming | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_veterans_homecoming: runtime diff shows only surface touches (population.MilitaryCaste.satisfaction, military.morale) — the card pushes sliders with no structural side effect. |  |  |
| hand_warlords_bargain | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_warlords_bargain: runtime diff shows only surface touches (military.readiness, faithCulture.faithLevel) — the card pushes sliders with no structural side effect. |  |  |
| hand_papal_blessing | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_papal_blessing: runtime diff shows only surface touches (population.Clergy.satisfaction, faithCulture.faithLevel) — the card pushes sliders with no structural side effect. |  |  |
| hand_relic_unveiled | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_relic_unveiled: runtime diff shows only surface touches (treasury.balance, population.Clergy.satisfaction, population.Commoners.satisfaction) — the card pushes sliders with no structural side effect. |  |  |
| hand_intercepted_dispatch | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_intercepted_dispatch: runtime diff shows only surface touches (espionage.networkStrength) — the card pushes sliders with no structural side effect. |  |  |
| hand_pardon_political_prisoners | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_pardon_political_prisoners: runtime diff shows only surface touches (population.Nobility.satisfaction, population.Commoners.satisfaction, stability.value) — the card pushes sliders with no structural side effect. |  |  |
| hand_grand_assize | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_grand_assize: runtime diff shows only surface touches (treasury.balance, population.Nobility.satisfaction, stability.value) — the card pushes sliders with no structural side effect. |  |  |
| hand_chronicler_summoned | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_chronicler_summoned: runtime diff shows only surface touches (faithCulture.faithLevel, faithCulture.culturalCohesion) — the card pushes sliders with no structural side effect. |  |  |
| hand_open_court | play | MAJOR | RUNTIME_GROUNDED | hand.runtime-structural-depth | hand_open_court: runtime diff shows only surface touches (population.Nobility.satisfaction, population.Clergy.satisfaction, population.Merchants.satisfaction, population.Commoners.satisfaction, population.MilitaryCaste.satisfaction, faithCulture.culturalCohesion) — the card pushes sliders with no structural side effect. |  |  |

<!-- AUTO-GENERATED:END -->
