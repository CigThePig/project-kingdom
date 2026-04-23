---
family: notification
totalCards: 73
status: pending
lastScan: 2026-04-23T01:32:38.216Z
---

# Notification — Audit findings

The auto-generated block below is rewritten on every `npm run audit:seed`.
The `outcome` and `notes` columns are preserved across reruns when the cardId
matches; edit them freely. To exclude a card from regeneration, leave the row
in place but write an outcome — the seeder will keep your edits.

<!-- AUTO-GENERATED:START -->

**Coverage**

| Coverage area | Status |
|---|---|
| text integrity | covered (100%) |
| effect table coverage | covered (100%) |
| runtime diff | covered (100%) |
| pressure parity | covered (100%) |
| consequence parity | covered (100%) |
| generated-family audit | not covered (0%) |
| AST semantic analysis | not covered (0%) |
| preview parity | covered (100%) |

| cardId | choiceId | severity | confidence | scanId | message | outcome | notes |
|---|---|---|---|---|---|---|---|
| evt_commoner_harvest_festival | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_commoner_harvest_festival: body references "granaries/food" but runtime diff shows no matching touch (touches: population.Commoners.satisfaction, faithCulture.faithLevel). |  |  |
| evt_annual_state_assessment | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_annual_state_assessment: body references "treasury/gold" but runtime diff shows no matching touch (touches: stability.value). |  |  |
| evt_annual_state_assessment | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_annual_state_assessment: body references "military readiness" but runtime diff shows no matching touch (touches: stability.value). |  |  |
| evt_grain_import_gratitude | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_grain_import_gratitude: body references "treasury/gold" but runtime diff shows no matching touch (touches: population.Merchants.satisfaction, population.Commoners.satisfaction). |  |  |
| evt_grain_noble_acceptance | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_grain_noble_acceptance: body references "granaries/food" but runtime diff shows no matching touch (touches: population.Nobility.satisfaction, stability.value). |  |  |
| evt_border_envoy_success | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_border_envoy_success: body references "rival/neighbor" but runtime diff shows no matching touch (touches: stability.value). |  |  |
| evt_mutiny_pay_loyalty | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_mutiny_pay_loyalty: body references "treasury/gold" but runtime diff shows no matching touch (touches: population.MilitaryCaste.satisfaction, military.readiness). |  |  |
| evt_mutiny_reform_desertion | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_mutiny_reform_desertion: body references "faith" but runtime diff shows no matching touch (touches: military.forceSize, military.readiness). |  |  |
| evt_uprising_reform_progress | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_uprising_reform_progress: body references "treasury/gold" but runtime diff shows no matching touch (touches: population.Commoners.satisfaction, stability.value). |  |  |
| evt_merchant_tax_satisfied | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_merchant_tax_satisfied: body references "treasury/gold" but runtime diff shows no matching touch (touches: population.Merchants.satisfaction). |  |  |
| evt_ambassador_alliance_benefit | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_ambassador_alliance_benefit: body references "bond/diplomacy" but runtime diff shows no matching touch (touches: treasury.balance, population.Merchants.satisfaction). |  |  |
| evt_ambassador_respect | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_ambassador_respect: body references "rival/neighbor" but runtime diff shows no matching touch (touches: population.Nobility.satisfaction, stability.value). |  |  |
| evt_audit_clean | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_audit_clean: body references "treasury/gold" but runtime diff shows no matching touch (touches: stability.value). |  |  |
| evt_exp_fu_food_feast_aftermath | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_exp_fu_food_feast_aftermath: body references "granaries/food" but runtime diff shows no matching touch (touches: population.Commoners.satisfaction, stability.value). |  |  |
| evt_exp_fu_kno_academic_breakthrough | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_exp_fu_kno_academic_breakthrough: body references "rival/neighbor" but runtime diff shows no matching touch (touches: population.Commoners.satisfaction, faithCulture.culturalCohesion). |  |  |
| evt_social_corruption_resolved | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_social_corruption_resolved: body references "treasury/gold" but runtime diff shows no matching touch (touches: population.Commoners.satisfaction, stability.value). |  |  |
| evt_social_criminal_resolved | acknowledge | MAJOR | HEURISTIC | text.promise-delivery | evt_social_criminal_resolved: body references "treasury/gold" but runtime diff shows no matching touch (touches: stability.value, espionage.networkStrength). |  |  |
| evt_infra_road_decay | acknowledge | MAJOR | HEURISTIC | text.scope-mismatch | evt_infra_road_decay: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 1 class path(s). |  |  |
| evt_plague_recovery | acknowledge | MAJOR | HEURISTIC | text.scope-mismatch | evt_plague_recovery: body claims universal class impact ("every class" / "all classes") but runtime diff only touches 1 class path(s). |  |  |
| evt_commoner_harvest_festival |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_commoner_harvest_festival: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_grain_ration_compliance |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_grain_ration_compliance: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_schism_orthodox_peace |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_schism_orthodox_peace: `affectsClass: Clergy` but body does not name the class (no {class} token and no literal "Clergy"/"Clergy Members"). |  |  |
| evt_border_campaign_victory |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_campaign_victory: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_border_envoy_success |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_envoy_success: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_border_fortify_holds |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_fortify_holds: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_trade_escort_success |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_trade_escort_success: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_trade_negotiate_alliance |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_trade_negotiate_alliance: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_trade_redirect_slow_recovery |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_trade_redirect_slow_recovery: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_succession_heir_popular |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_succession_heir_popular: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_succession_council_agreement |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_succession_council_agreement: `affectsClass: Nobility` but body does not name the class (no {class} token and no literal "Nobility"/"Nobles"). |  |  |
| evt_uprising_peace |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_uprising_peace: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_uprising_reform_progress |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_uprising_reform_progress: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_merchant_council_effective |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_merchant_council_effective: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_ambassador_counter_accepted |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_ambassador_counter_accepted: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_ambassador_respect |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_ambassador_respect: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_exp_fu_eco_tax_compromise_fallout |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_eco_tax_compromise_fallout: `affectsClass: Commoners` but body does not name the class (no {class} token and no literal "Commonfolk"/"Commoners"). |  |  |
| evt_exp_fu_mil_fortress_garrison |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_mil_fortress_garrison: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_mil_fortress_garrison |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_mil_fortress_garrison: `affectsClass: MilitaryCaste` but body does not name the class (no {class} token and no literal "Military Caste"/"Soldiers"). |  |  |
| evt_exp_fu_mil_parade_recruitment |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_mil_parade_recruitment: `affectsClass: MilitaryCaste` but body does not name the class (no {class} token and no literal "Military Caste"/"Soldiers"). |  |  |
| evt_exp_fu_dip_trade_profits |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_dip_trade_profits: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_exp_fu_env_levee_success |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_env_levee_success: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_env_mining_wealth |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_env_mining_wealth: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_cc_strike_settlement |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_cc_strike_settlement: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_exp_fu_cc_new_merchant_class |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_cc_new_merchant_class: `affectsClass: Merchants` but body does not name the class (no {class} token and no literal "Merchant Guild"/"Merchants"). |  |  |
| evt_exp_fu_reg_resource_boom |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_resource_boom: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_reg_infrastructure_complete |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_infrastructure_complete: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_reg_hero_legend |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_hero_legend: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_grain_ration_compliance |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_grain_ration_compliance: body references "unrest" but triggerConditions do not gate on matching state (expected one of: class_satisfaction_below, stability_below, region_loyalty_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_grain_noble_acceptance |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_grain_noble_acceptance: body references "famine" but triggerConditions do not gate on matching state (expected one of: food_below, population_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_cond_drought_resolved |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_cond_drought_resolved: body references "drought" but triggerConditions do not gate on matching state (expected one of: food_below, season_is, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_social_unrest_resolved |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_social_unrest_resolved: body references "unrest" but triggerConditions do not gate on matching state (expected one of: class_satisfaction_below, stability_below, region_loyalty_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |

<!-- AUTO-GENERATED:END -->
