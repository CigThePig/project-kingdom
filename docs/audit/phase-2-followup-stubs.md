# Phase 2 — Follow-up Stub Index

These 81 follow-up events were authored as **stubs** during Phase 2 of the
Card Audit & Progression Workstream, as the plan requires: every re-effect
branch that doesn't terminate in a kingdom feature schedules ≥1 follow-up,
and the follow-ups are **drafted as IDs now and authored in Phase 15 (the
progression backbone)**.

Each stub is a minimal Pattern A definition (2 choices, a structural touch
on at least one branch) so the scheduler resolves it and the scanner does
not flag it. Phase 15 rewrites every entry into a fully-textured card with
smart-text tokens, body copy, more branch distinctness, and its own
follow-ups where the tier justifies.

Definitions: `src/data/events/expansion/followup-events.ts` (bottom of file
— eight batches under `Phase 2 Card Audit — Follow-up stubs`).

Effects: `src/data/events/expansion/followup-effects.ts` (bottom of file —
matching batches under `Phase 2 Card Audit — Stub follow-up effects`).

## By parent event (57 Critical events → 81 stubs)

### Region / condition crises

- `evt_cond_drought_severe` → `evt_fu_drought_wasteland`, `evt_fu_merchant_water_reprisal`
- `evt_cond_famine_moderate` → `evt_fu_famine_ration_riot`, `evt_fu_grain_debt_called`
- `evt_cond_plague_moderate` → `evt_fu_burned_quarters_rebuild`, `evt_fu_plague_worsens`
- `evt_cond_plague_severe` → `evt_fu_plague_wasteland`, `evt_fu_exodus_refugee_crisis`
- `evt_cond_plague_escalation` → `evt_fu_martial_law_aftermath`
- `evt_social_banditry_severe` → `evt_fu_amnesty_banditry_return`, `evt_fu_lawless_outer_region`
- `evt_social_corruption_severe` → `evt_fu_coopted_lords_demand_more`, `evt_fu_corruption_entrenched`
- `evt_social_unrest_severe` → `evt_fu_martial_law_backlash`, `evt_fu_rebel_accord_unravels`
- `evt_social_criminal_severe` → `evt_fu_syndicate_protection_fees`, `evt_fu_criminal_shadow_state`

### Diplomacy / military / border

- `evt_border_incursion_root` — (parent already has real follow-ups)
- `evt_border_campaign_defeat` — (retex + region delta only)
- `evt_trade_escort_ambush` → `evt_fu_abandoned_convoy_outrage`
- `evt_grain_import_spoiled` → `evt_fu_spoiled_grain_sickness`
- `evt_grain_noble_uprising` → `evt_fu_noble_estate_razed`, `evt_fu_amnesty_cabal_reforms`
- `evt_assassination_attempt` → `evt_fu_purge_court_paralysis`, `evt_fu_mercy_emboldens_plot`
- `evt_military_coup_threat` → `evt_fu_purge_officer_shortage`, `evt_fu_bribed_officers_ask_more`
- `evt_military_mutiny_root` — (parent already has real follow-ups)
- `evt_mutiny_execute_revenge` — (retex + region delta only)
- `evt_mutiny_reform_betrayal` — (retex + region delta only)
- `evt_equipment_failure_field` → `evt_fu_field_equipment_catastrophe`
- `evt_uprising_guerrilla` — (retex + region delta only)
- `evt_exp_mil_supply_chain` → `evt_fu_merchant_boycott`, `evt_fu_starving_garrison`

### Escalation / social crisis

- `evt_escalation_faith_collapse` → `evt_fu_state_religion_persecution`, `evt_fu_pluralism_splinter_sects`
- `evt_escalation_famine_panic` → `evt_fu_seized_granaries_noble_revolt`, `evt_fu_famine_descends_into_riot`
- `evt_escalation_mass_exodus` → `evt_fu_closed_border_smuggling`, `evt_fu_exodus_brain_drain`
- `evt_escalation_military_mutiny` → `evt_fu_ringleader_martyrs`, `evt_fu_officer_cabal`
- `evt_escalation_noble_conspiracy` → `evt_fu_arrests_purge_pushback`, `evt_fu_double_agent_compromised`
- `evt_escalation_treasury_crisis` → `evt_fu_noble_contribution_resistance`, `evt_fu_neglected_works_collapse`
- `evt_popular_unrest` → `evt_fu_peacekeeper_overreach`, `evt_fu_curfew_mass_defiance`

### Uprising / public order

- `evt_commoner_uprising_root` — (parent already has real follow-ups)
- `evt_commoner_uprising_neglect` → `evt_fu_patrol_brutality_complaint`, `evt_fu_labor_reform_backlash`
- `evt_exp_po_martial_law` → `evt_fu_civilian_authority_falters` (plus existing wired follow-up)
- `evt_exp_po_mob_justice` → `evt_fu_force_crackdown_legacy`, `evt_fu_mob_rule_spreads`
- `evt_succession_factions` → `evt_fu_succession_factions_war`, `evt_fu_merit_heir_noble_backlash`

### Kingdom / policy crisis

- `evt_exp_cc_guild_noble_power_struggle` → `evt_fu_factions_see_through` (plus existing)
- `evt_exp_cc_privilege_reform` → `evt_fu_token_concessions_backfire`, `evt_fu_reform_martyrs`
- `evt_exp_cc_social_mobility_demands` → `evt_fu_social_order_revolt` (plus existing)
- `evt_exp_chain_corruption_scandal` → `evt_fu_pardon_emboldens_graft` (plus existing)
- `evt_exp_chain_guild_rev_shift` → `evt_fu_crushed_movement_underground`, `evt_fu_guild_compromise_drift`
- `evt_exp_chain_reformation_doctrine` → `evt_fu_dual_practice_schism`, `evt_fu_underground_reformers`
- `evt_exp_cul_assimilation_pressure` → `evt_fu_assimilation_standoff`, `evt_fu_integration_fifth_column`
- `evt_exp_cul_preservation_crisis` → `evt_fu_cultural_drift_backlash`, `evt_fu_suppression_diaspora_unrest`
- `evt_exp_eco_counterfeit_coins` → `evt_fu_counterfeit_underground_revenge`, `evt_fu_royal_stamp_fraud`
- `evt_exp_eco_inflation_crisis` → `evt_fu_price_freeze_shortages`, `evt_fu_market_crash_bread_riots`
- `evt_exp_kgd_constitutional_crisis` → `evt_fu_authority_rebellion`, `evt_fu_charter_implementation`
- `evt_famine_crisis` → `evt_fu_commandeered_stores_noble_strike`

### Religion / schism

- `evt_schism_crisis` → `evt_fu_doctrine_enforcement_blowback`, `evt_fu_coexistence_fractures`
- `evt_schism_reform_schism_deep` → `evt_fu_secularization_backlash`
- `evt_schism_underground_martyr` — (retex + region delta only)
- `evt_exp_w2_religious_schism` → `evt_fu_schism_reformer_revolt`, `evt_fu_schism_parallel_churches`

### Wave-2 / knowledge / misc

- `evt_exp_kno_printing_press` → `evt_fu_press_smuggled_in` (plus existing)
- `evt_exp_w2_comet_sighting` → `evt_fu_comet_heresy_spreads`
- `evt_exp_w2_dynastic_challenge` → `evt_fu_marriage_dynastic_friction`, `evt_fu_exiled_pretender_returns`
- `evt_border_campaign_defeat` → `evt_fu_scorched_earth_famine`, `evt_fu_surrender_terms_harsh`

## Phase 15 TODO

For each stub above, Phase 15 authoring should:

1. Flesh body text (currently just choice labels).
2. Add smart-text tokens (`{region}`, `{settlement}`, `{condition_context}`,
   `{prior_decision_clause:*}`, `{ruler_full}` etc.) where a parent event
   binds `affectsRegion` / `affectsNeighbor` / `affectsClass`.
3. Tune magnitudes against `CARD_AUDIT_RULES.md` §9 per-tier ranges.
4. Add a second round of follow-ups for the "defer" branches (these stubs
   are deliberately thin to unblock Phase 2 scanner close; the deferral
   ratio per §14 is 60–80%).
5. Register kingdom features on the terminal branches that should leave a
   permanent mark. Follow the pattern in `src/data/kingdom-features/index.ts`
   under `Phase 2 Card Audit — Critical-tier terminal branches`.
