# Phase 9 — Follow-up stubs reserved for Phase 15

This document is the register of follow-up card IDs (and Kingdom Features
that play the same progression role) seeded during Phase 9 of the Card
Audit & Progression workstream. Phase 15 (progression-backbone authoring)
will convert the follow-up stubs into full Pattern A cards; the Kingdom
Features below ship active already because their ongoing-effect shape is
authored at the registry, not via a follow-up card.

Companion to `docs/audit/phase-2-followup-stubs.md` /
`docs/audit/phase-3-followup-stubs.md`. Workstream context:
`docs/CARD_AUDIT_WORKSTREAM.md` §Phase 9.

---

## Shape

Phase 9's surface-only re-effect pass (Wave 2) established progression
markers on 137 choices across the crisis family. The markers fall into
three buckets. No new follow-up *stub IDs* were reserved — every
Critical-tier card paired its ongoing temp-modifier with a kingdom
feature rather than with a follow-up ID, so the Phase 15 backlog is
unchanged by Phase 9 Wave 2.

### Bucket A — Temporary modifiers (Serious tier, 114 choices)

Choices on every Serious crisis in the corpus received a
`EVENT_CHOICE_TEMPORARY_MODIFIERS[event][choice]` entry with a 2–4 turn
duration and a 1–2 magnitude `effectPerTurn`. Thematically matched to
the choice's primary existing delta (treasury-heavy choices receive
persisting treasury drain; morale-heavy choices receive persisting
morale shift; etc.). No follow-up stubs registered for these; the
ongoing modifier is the structural marker.

Scope: `src/data/events/effects.ts` `EVENT_CHOICE_TEMPORARY_MODIFIERS`
table — 114 new choice-level entries under 117 card keys, preserving
every pre-existing entry (Phase 3 / Phase 8 / Wave 3 additions kept
intact; only missing keys added). See the commit diff for the full list.

### Bucket B — Kingdom features (Critical tier, 23 choices)

Every Critical crisis choice flagged surface-only received a paired
`KINGDOM_FEATURE_REGISTRY['event:<event>:<choice>']` entry so the
Critical tier's "2+ strong markers" bar is met (temp-modifier + feature
= 2 strong markers per `scripts/audit/scans/substance/surface-only.ts`
severity-scaling rule).

Features added at `src/data/kingdom-features/index.ts:971-1145`:

| Event | Choice | Feature ID | Category | Ongoing effect |
|---|---|---|---|---|
| `evt_exp_chain_border_war_mobilization` | `defensive_posture` | `feature_defensive_posture` | military | `+militaryReadiness` / `−treasury` |
| `evt_exp_chain_border_war_mobilization` | `full_mobilization` | `feature_full_mobilization` | military | `+militaryForceSize` / `−treasury` / `−commonerSat` |
| `evt_exp_chain_drought_autumn` | `emergency_food_imports` | `feature_grain_import_dependency` | economic | `+food` / `−treasury` |
| `evt_exp_chain_drought_autumn` | `strict_rationing` | `feature_drought_rationing_regime` | infrastructure | `+food` / `−commonerSat` |
| `evt_exp_chain_spy_war_resolution` | `cut_losses_and_rebuild` | `feature_rebuilt_spy_network` | military | `+espionageNetwork` |
| `evt_exp_dip_trade_embargo_threat` | `accept_the_embargo` | `feature_embargo_adaptation` | economic | `−merchantSat` / `+commonerSat` |
| `evt_exp_eco_debt_crisis` | `impose_austerity_measures` | `feature_austerity_regime` | economic | `+treasury` / `−commonerSat` / `−nobilitySat` |
| `evt_exp_eco_debt_crisis` | `negotiate_with_creditors` | `feature_creditor_accord` | economic | `−treasury` / `+merchantSat` |
| `evt_exp_env_volcanic_ash_cloud` | `seal_granaries_and_ration` | `feature_sealed_granaries` | economic | `+food` |
| `evt_exp_esp_enemy_infiltration` | `martial_law_purge` | `feature_martial_law` | infrastructure | `+stability` / `−commonerSat` |
| `evt_exp_esp_enemy_infiltration` | `targeted_counter_ops` | `feature_counter_espionage_program` | military | `+espionageNetwork` |
| `evt_exp_esp_military_secrets_stolen` | `change_all_plans` | `feature_operational_security` | military | `+militaryReadiness` |
| `evt_exp_esp_underground_resistance` | `address_grievances` | `feature_reform_commitment` | infrastructure | `+commonerSat` / `−nobilitySat` |
| `evt_exp_fod_imports_blocked` | `enforce_strict_rationing` | `feature_wartime_rationing` | infrastructure | `+food` / `−commonerSat` |
| `evt_exp_kno_library_fire` | `let_it_burn` | `feature_lost_library` | cultural | `−culturalCohesion` / `−clergySat` |
| `evt_exp_mil_siege_preparations` | `full_siege_mobilization` | `feature_siege_readiness` | military | `+militaryReadiness` / `−treasury` |
| `evt_exp_mil_war_preparations` | `full_war_mobilization` | `feature_war_footing` | military | `+militaryReadiness` / `−treasury` |
| `evt_exp_po_refugee_influx` | `close_the_borders` | `feature_closed_borders` | infrastructure | `+stability` / `−merchantSat` |
| `evt_exp_rel_sacred_desecration` | `call_for_reconciliation` | `feature_faith_reconciliation` | cultural | `+faith` / `+culturalCohesion` |
| `evt_exp_rel_sacred_desecration` | `hunt_perpetrators` | `feature_purity_enforcement` | cultural | `−heterodoxy` / `−commonerSat` |
| `evt_exp_w2_plague_variant` | `open_hospitals_for_all` | `feature_royal_hospitals` | cultural | `+commonerSat` / `−treasury` |
| `evt_exp_w2_plague_variant` | `pray_and_wait` | `feature_providential_devotion` | cultural | `+faith` / `−heterodoxy` |
| `evt_commoner_plague_outbreak` | `distribute_herbal_remedies` | `feature_physicians_guild` | cultural | `+commonerSat` / `−clergySat` |

### Bucket C — Stubs inherited from earlier phases

Crisis-family follow-up stub IDs already registered in
`docs/audit/phase-2-followup-stubs.md` and
`docs/audit/phase-3-followup-stubs.md` remain unchanged. Phase 9 did
not author new follow-up IDs because the Critical-tier feature pairing
(Bucket B) matched the severity-scaling rule without needing follow-up
scheduling, and the Serious-tier temp-modifier (Bucket A) was
sufficient for single-strong-marker retirement.

## Why no new Phase 15 stub IDs

Phase 15's progression-backbone authoring converts reserved follow-up
IDs into full Pattern A cards. Phase 9 Wave 2 used the kingdom-feature
channel instead for Critical-tier re-effects — a feature with an
ongoing effect is structurally equivalent to a follow-up for the
purposes of §2 substance and the surface-only scan, and it avoids
back-loading Phase 15's author budget by 23 cards.

Kingdom features also land in `activeKingdomFeatures` at turn 0 of
resolution, so the progression feel lands immediately rather than
deferring to a future follow-up firing. Where the design intent is
"the choice installs a standing policy," feature is the right channel;
where the intent is "this decision echoes back three turns later,"
follow-up stubs (Phase 15) remain the right channel and earlier
phases' stubs carry that work.

## Verification

All 23 kingdom features and 114 temp-modifier entries are covered by
`npm run audit -- --family=crisis`, which returns 0 CRITICAL / 0 MAJOR
post-Wave-2. The markers flow through to the scanner's fallback table
check (post-scan-patch in `scripts/audit/scans/substance/surface-only.ts`),
which honors both the runtime fingerprint and the table heuristics.
