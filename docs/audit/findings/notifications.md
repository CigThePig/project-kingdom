---
family: notification
totalCards: 73
status: pending
lastScan: 2026-04-24T19:35:41.174Z
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
| evt_border_campaign_victory |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_campaign_victory: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_border_envoy_success |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_envoy_success: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_border_fortify_holds |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_border_fortify_holds: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_ambassador_counter_accepted |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_ambassador_counter_accepted: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_ambassador_respect |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_ambassador_respect: `affectsNeighbor` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token). |  |  |
| evt_exp_fu_mil_fortress_garrison |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_mil_fortress_garrison: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_env_levee_success |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_env_levee_success: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_env_mining_wealth |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_env_mining_wealth: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_reg_resource_boom |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_resource_boom: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_reg_infrastructure_complete |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_infrastructure_complete: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_exp_fu_reg_hero_legend |  | MAJOR | DETERMINISTIC | text.smart-card-coverage | evt_exp_fu_reg_hero_legend: `affectsRegion: true` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token). |  |  |
| evt_grain_ration_compliance |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_grain_ration_compliance: body references "unrest" but triggerConditions do not gate on matching state (expected one of: class_satisfaction_below, stability_below, region_loyalty_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_grain_noble_acceptance |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_grain_noble_acceptance: body references "famine" but triggerConditions do not gate on matching state (expected one of: food_below, population_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_cond_drought_resolved |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_cond_drought_resolved: body references "drought" but triggerConditions do not gate on matching state (expected one of: food_below, season_is, consequence_tag_present). Card can fire when its own text is wrong. |  |  |
| evt_social_unrest_resolved |  | MAJOR | HEURISTIC | text.trigger-coherence | evt_social_unrest_resolved: body references "unrest" but triggerConditions do not gate on matching state (expected one of: class_satisfaction_below, stability_below, region_loyalty_below, consequence_tag_present). Card can fire when its own text is wrong. |  |  |

<!-- AUTO-GENERATED:END -->
