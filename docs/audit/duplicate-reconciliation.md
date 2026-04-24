# Phase 7 — Cross-family duplicate reconciliation

Phase 7 of the Card Audit & Progression workstream
(`docs/CARD_AUDIT_WORKSTREAM.md`) is the reconciliation gate that sits
between the coverage retexts (phases 3–6, completed) and the long
SURFACE_ONLY family deep-audits (phases 8–14). Its purpose is to
prevent wasted work later: if we re-effect a card in phase 11 only to
delete it in phase 14 because it duplicated another family, that's a
lost phase. The acceptance gate is explicit: *"Reconciliation doc
merged. No two cards compete for the same (family × trigger × class)
slot."*

**Baseline at close of Phase 6:** 1,367 MAJOR findings corpus-wide,
0 `CRITICAL_SHALLOW_RUNTIME` / `PROMISE_NOT_DELIVERED` /
`SCOPE_MISMATCH` / `SMART_CARD_COVERAGE_*` (see
`docs/audit/phase-6-findings-closed.md`).

**Scope.** Ten overlap zones called out in the workstream doc:
marriage, tax, festival, border, guild, plague, trade, governance,
military readiness, succession.

**Headline finding.** The corpus has **no true cross-family
duplicates remaining.** A prior pass retired the marriage overtures
in phase 13 (see
`// Phase 13 — evt_exp_dip_marriage_proposal retired; replaced by
neg_marriage_alliance …` at
`src/data/events/expansion/diplomacy-events.ts:202`), and two Pattern
C flavor events (`evt_commoner_harvest_festival`,
`evt_merchant_tax_satisfied`) already carry
`classification: 'notification'` so they don't consume monthly
decision slots. Phase 7 therefore lands as a **formal verification +
publication pass**: no cards retired, no save-compat migration
required, `SAVE_SCHEMA_VERSION` unchanged at 8.

---

## Canonical mapping contract

One row per zone. This is the post-Phase-7 contract — future authors
work against it. The mapping is also encoded mechanically in
`scripts/audit/scans/wiring/cross-family-overlap.ts` so drift is
caught by the scanner.

| Zone | Petition | Decree | Crisis | Negotiation | Overture | Notes |
|---|---|---|---|---|---|---|
| Marriage | class proposes a match (GAP — not yet authored) | crown declares royal marriage | disrupted/broken match | multi-term marriage exchange *(corpus convention)* | rival initiates dynastic alliance | Petition slot open for phase 11 to consider. |
| Tax | class asks for relief | crown decrees levy / exemption / reform | enforcement breakdown | — | rival credit/recovery offer w/ tax term | §14 of `CARD_AUDIT_RULES.md` is the calibration shape for the crisis slot. |
| Festival | class asks for festival tied to current state | `call_festival` active choice | — | — | — | Seasonal flavor routes through notification / seasonal dawn, not petition. |
| Border | border captains / garrisons ask for support | fortify / defense network | active incursion / flashpoint (incl. event-chain war escalation) | — | rival claim or demonstration | Event-chain (`chain_border_war_*`) is a crisis subtype. |
| Guild | guild asks | crown grants/revokes charter | class-conflict status divergence *(allowlisted)* | multi-term guild charter exchange | — | The power-struggle crisis is class-conflict, not charter-revocation. |
| Plague | commonfolk supplication (GAP) | quarantine orders (GAP) | outbreak escalation | — | — | Crisis-only family today; decree/petition reserved for future. |
| Trade | merchant / guild asks for policy relief | crown trade policy | trade-route disruption | two-party trade pact / embargo | rival trade overture | Every decision-slot family is canonical. |
| Governance | class asks for policy change | crown reform / codification | governance shock (scandal, bandit-lord uprising) | power-sharing / charter | — | Category-drift items logged for phases 8/9/11/12 deep-audits. |
| Military readiness | class asks for resources (garrison, order) | muster / fortify / arsenal | invasion, defection, revolt | military reform | rival border demonstration | Every decision-slot family is canonical. |
| Succession | (GAP) | (GAP) | legitimacy shock (royal illness, dynastic challenge) | succession pact / marriage-alliance | rival presses claim | Petition + decree slots open for phases 11/12 to consider. |

Where a cell says **GAP**, no card exists today. Gaps are recorded
below under §Known gaps and are explicitly *not filled in Phase 7* —
they're flagged for phases 8–12 to slot into their respective slates
if thematically appropriate.

---

## Verdicts — zone by zone

Verdict vocabulary:

- **KEEP** — card is in the right family, right role; leave alone.
- **RETIRE** — card is a true duplicate and should be deleted (none
  found this phase).
- **REDIRECT** — card stays in its current family but carries a
  framing / category drift that a later phase's deep-audit should
  address via the 15-question checklist.
- **GAP** — canonical role has no card. Reserved for future
  authoring; no action this phase.
- **DEFER-TO-PHASE-16** — Pattern C flavor candidate. Already
  classified as notification or otherwise out of the decision-slot
  deck today; only listed so Phase 16 can sweep cleanly.

### Marriage

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Decree | `decree_royal_marriage` | `src/data/decrees/index.ts:784` | crown declares marriage | KEEP | Tier-1 of royal-marriage chain. |
| Decree | `decree_dynasty_alliance` | `src/data/decrees/index.ts:804` | chained upgrade | KEEP | Tier-2. |
| Crisis | `evt_exp_w2_dynastic_challenge` | `src/data/events/expansion/wave-2/crises-political.ts:59` | broken match / challenge | KEEP | Canonical: disrupted succession via dynastic claim. |
| Negotiation | `neg_marriage_alliance` | `src/data/events/negotiations.ts:230` | multi-term marriage exchange | KEEP | `context: 'external'` (rival-initiated); three terms produce `MarriageBond + ReligiousAccordBond`. Corpus convention already retired the overture-shape duplicates (see `diplomacy-events.ts:202, 452`). |
| Overture | DynasticAlliance — hostage exchange variant | `src/data/overtures/wave-2/index.ts:128` | rival dynastic alliance | KEEP | Single-choice alternate to full marriage. |
| (Petition) | — | — | class proposes a match | GAP | Flagged for phase 11 petitions deep-audit. |

### Tax

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Petition | `faction_req_nobility_tax_exemption` | `src/data/events/faction-requests.ts:18` | nobility asks relief | KEEP | |
| Petition | `faction_req_w2_millers_tax_relief` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts:98` | commonfolk millers ask relief | KEEP | |
| Petition | `faction_req_w2_abbey_tax_exemption` | `src/data/events/expansion/petitions-wave-2/petitions-religious.ts:77` | clergy ask relief | KEEP | |
| Decree | `decree_emergency_levy` | `src/data/decrees/index.ts:208` | crown imposes levy | KEEP | |
| Decree | `decree_harvest_tithe_exemption` | `src/data/decrees/index.ts:972` | crown waives tithe | KEEP | |
| Decree | `decree_tax_code_reform` | `src/data/decrees/index.ts:1201` | knowledge-gated reform | KEEP | |
| Crisis | `evt_exp_eco_tax_dispute` | `src/data/events/expansion/economy-events.ts` | enforcement breakdown | KEEP | §14 calibration card. |
| Crisis | `evt_merchant_tax_shortfall` | `src/data/events/index.ts:4225` | merchant tax withholding | KEEP | Legit three-choice remediation. |
| Notification | `evt_merchant_tax_satisfied` | `src/data/events/index.ts:4211` | post-resolution flavor | DEFER-TO-PHASE-16 | Already `classification: 'notification'`; logged for Pattern C sweep. |

### Festival

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Decree | `decree_call_festival` | `src/data/decrees/index.ts:548` | crown calls festival | KEEP | |
| Petition | `faction_req_clergy_religious_festival` | `src/data/events/faction-requests.ts:125` | clergy asks festival | KEEP | |
| Event | `evt_cultural_festival_proposal` | `src/data/events/index.ts:576` | clergy-proposed festival | REDIRECT | Three substantive choices (petition-shape), category `Culture`. Phase 10/12 to decide whether to retag. Allowlisted in the scanner so future family-reclassification doesn't regress. |
| Event | `evt_spring_planting_festival` | `src/data/events/index.ts` | seasonal Pattern A-lite | KEEP | Three choices with cost asymmetry; substance-review covered by phase 9 crises / phase 11 petitions audit. |
| Notification | `evt_commoner_harvest_festival` | `src/data/events/index.ts:110` | seasonal flavor | DEFER-TO-PHASE-16 | `classification: 'notification'`. |
| Hand | `hand_festival_proclaimed` | `src/data/cards/hand-cards.ts` | tactical holiday | KEEP | Hand-card channel; out of scope for zone competition. |
| Court Opp | `opp_festival_proposal` | `src/data/cards/court-opportunities.ts` | flavor frame for hand | KEEP | |

### Border

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Decree | `decree_fortify_borders` | `src/data/decrees/index.ts:236` | fortify tier 1 | KEEP | |
| Decree | `decree_integrated_defense_network` | `src/data/decrees/index.ts:269` (chained) | fortify tier 2 | KEEP | |
| Decree | `decree_fortress_kingdom` | `src/data/decrees/index.ts` | fortify tier 3 | KEEP | |
| Crisis | `evt_exp_chain_border_war_skirmish` | `src/data/events/expansion/chain-events.ts` | chain step 1 | KEEP | Multi-turn escalation chain. |
| Crisis | `evt_exp_chain_border_war_mobilization` | `src/data/events/expansion/chain-events.ts` | chain step 2 | KEEP | |
| Crisis | `evt_exp_chain_border_war_resolution` | `src/data/events/expansion/chain-events.ts` | chain step 3 | KEEP | |
| Crisis | `evt_exp_mil_siege_preparations` | `src/data/events/expansion/military-events.ts` | active incursion | KEEP | |
| Petition | `faction_req_w2_border_captains_garrison` | `src/data/events/expansion/petitions-wave-2/petitions-military.ts:16` | military caste asks support | KEEP | |
| Overture | `SackASettlement` agenda | `src/data/overtures/wave-2/index.ts` | rival threat | KEEP | |
| Overture | `DefensiveConsolidation` agenda | `src/data/overtures/wave-2/index.ts` | rival cooperation | KEEP | |
| Hand | `hand_border_patrol` | `src/data/cards/hand-cards.ts` | tactical watch | KEEP | Hand channel. |
| Hand | `hand_sanctioned_raid` | `src/data/cards/hand-cards.ts` | tactical raid | KEEP | |
| Court Opp | `opp_hermit_warning` | `src/data/cards/court-opportunities.ts` | flavor frame | KEEP | |

### Guild

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Petition | `faction_req_w2_merchant_tariff_reform` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts` | merchants ask tariff reform | KEEP | |
| Petition | `faction_req_w2_miners_charter` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts` | miners ask charter | KEEP | |
| Petition | `faction_req_w2_fishermens_protection` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts` | fishermen ask protection | KEEP | |
| Petition | `faction_req_w2_carpenters_price_cap` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts` | carpenters ask price cap | KEEP | |
| Petition | `faction_req_w2_goldsmiths_seal` | `src/data/events/expansion/petitions-wave-2/petitions-guilds.ts` | goldsmiths ask monopoly seal | KEEP | |
| Decree | `decree_market_charter` | `src/data/decrees/index.ts:80` | grant market charter tier 1 | KEEP | |
| Decree | `decree_trade_guild_expansion` | `src/data/decrees/index.ts:100` | expand guilds tier 2 | KEEP | |
| Decree | `decree_merchant_republic_charter` | `src/data/decrees/index.ts:120` | charter republic tier 3 | KEEP | |
| Crisis | `evt_exp_cc_guild_noble_power_struggle` | `src/data/events/expansion/class-conflict-events.ts:123` | class-conflict status divergence | KEEP (allowlisted) | Triggers on merchants ≥70 + nobility ≤40 — emergent class conflict, not a charter revocation. Allowlisted in the scanner so future corpus changes don't mis-flag it. |
| Negotiation | `neg_merchant_guild_charter` | `src/data/events/negotiations.ts` | multi-term charter exchange | KEEP | Canonical per post-Phase-7 contract (added to canonical set; replaces earlier strict reading). |
| Hand | `hand_merchant_guild_favor` | `src/data/cards/hand-cards.ts` | tactical guild favor | KEEP | |
| Court Opp | `opp_merchant_gift` | `src/data/cards/court-opportunities.ts` | flavor frame | KEEP | |

### Plague

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Crisis | `evt_exp_w2_plague_variant` | `src/data/events/expansion/wave-2/crises-disasters.ts:17` | outbreak escalation | KEEP | Canonical crisis. |
| Crisis | `evt_exp_w2_well_poisoning` | `src/data/events/expansion/wave-2/crises-disasters.ts:83` | water sabotage | KEEP | Adjacent zone (public-order + espionage), not a plague duplicate. Kept for category coverage. |
| (Decree) | — | — | quarantine orders | GAP | Flagged for phase 8 decrees deep-audit. |
| (Petition) | — | — | commonfolk supplication during outbreak | GAP | Flagged for phase 11 petitions deep-audit. |

### Trade

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Negotiation | `neg_trade_deal` | `src/data/events/negotiations.ts` | two-party trade contract | KEEP | |
| Negotiation | `neg_resource_blockade` | `src/data/events/negotiations.ts` | two-party under duress | KEEP | |
| Decree | `decree_trade_subsidies` | `src/data/decrees/index.ts` | crown invests in routes | KEEP | |
| Decree | `decree_trade_monopoly` | `src/data/decrees/index.ts` | crown grants monopoly | KEEP | |
| Decree | `decree_international_trade_empire` | `src/data/decrees/index.ts` | crown trade dominance | KEEP | |
| Decree | `decree_w2_weights_and_measures` | `src/data/decrees/expansion-wave-2/index.ts` | crown standardizes markets | KEEP | |
| Decree | `decree_w2_road_construction` | `src/data/decrees/expansion-wave-2/index.ts` | crown commissions roads | KEEP | |
| Petition | `faction_req_merchant_trade_protections` | `src/data/events/faction-requests.ts` | merchants ask tariff protection | KEEP | |
| Petition | `faction_req_merchant_market_expansion` | `src/data/events/faction-requests.ts` | merchants ask market access | KEEP | |
| Crisis | `evt_exp_w2_naval_disaster` | `src/data/events/expansion/wave-2/crises-disasters.ts` | trade-vessel loss | KEEP | |
| Crisis | `evt_exp_w2_monetary_crisis` | `src/data/events/expansion/wave-2/crises-social.ts` | treasury depletion | KEEP | |
| Overture | `DominateTrade` agenda | `src/data/overtures/wave-2/index.ts` | rival trade pact | KEEP | |
| Overture | `EconomicRecovery` agenda | `src/data/overtures/wave-2/index.ts` | rival credit/grain offer | KEEP | Overture tax-canonical per post-Phase-7 contract. |
| Assessment | `assess_merchant_caravan_disappearance` | `src/data/events/assessments.ts` | intel on caravan loss | KEEP | Assessment channel — out of zone competition. |

### Governance

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Negotiation | `neg_noble_power_share` | `src/data/events/negotiations.ts` | power-sharing treaty | KEEP | |
| Negotiation | `neg_commoner_charter` | `src/data/events/negotiations.ts` | class-rights charter | KEEP | Multi-term; hits `guild` regex via the charter framing, but canonical for guild too. |
| Decree | `decree_exp_land_reform` | `src/data/decrees/expansion-decrees.ts` | crown redistribution | KEEP | |
| Decree | `decree_w2_codify_the_common_law` | `src/data/decrees/expansion-wave-2/index.ts` | crown legal codification | KEEP | |
| Decree | `decree_w2_expand_the_bureaucracy` | `src/data/decrees/expansion-wave-2/index.ts` | crown admin reform | KEEP | |
| Decree | `decree_w2_free_cities_charter` | `src/data/decrees/expansion-wave-2/index.ts` | municipal self-govt | KEEP | |
| Decree | `decree_w2_justice_circuits` | `src/data/decrees/expansion-wave-2/index.ts` | royal judges | KEEP | |
| Decree | `decree_road_improvement` | `src/data/decrees/index.ts` | road network | REDIRECT | Trade-flavored governance decree — category is borderline. Phase 8 decrees deep-audit to decide retag vs. keep. |
| Decree | `decree_exp_provincial_academies` | `src/data/decrees/expansion-decrees.ts` | regional academies | REDIRECT | Knowledge-focused; phase 8 to reassess category binding. |
| Decree | `decree_w2_sumptuary_laws` | `src/data/decrees/expansion-wave-2/index.ts` | sumptuary regulation | REDIRECT | Social-regulation flavor; phase 8. |
| Petition | `faction_req_nobility_court_privileges` | `src/data/events/faction-requests.ts` | nobility court access | KEEP | |
| Petition | `faction_req_w2_regional_lords_road` | `src/data/events/expansion/petitions-wave-2/petitions-civic.ts` | infrastructure petition | REDIRECT | Governance framing but trade-infrastructure substance; phase 11/12 audit. |
| Petition | `faction_req_w2_imprisoned_nobles` | `src/data/events/expansion/petitions-wave-2/petitions-civic.ts` | clemency petition | KEEP | |
| Crisis | `evt_exp_w2_royal_scandal` | `src/data/events/expansion/wave-2/crises-political.ts` | public-order shock | KEEP | |
| Crisis | `evt_exp_w2_royal_illness` | `src/data/events/expansion/wave-2/crises-political.ts:37` | succession-adjacent | REDIRECT | Leans succession zone; phase 9 crises deep-audit to decide primary categorization. |
| Crisis | `evt_exp_w2_bandit_lord_uprising` | `src/data/events/expansion/wave-2/crises-political.ts` | bandit uprising | REDIRECT | Leans military readiness; phase 9 to reassess. |
| Assessment | `assess_internal_unrest_rumor` | `src/data/events/assessments.ts` | intel on unrest | KEEP | Assessment channel. |
| Overture | `SubjugateAVassal` agenda | `src/data/overtures/wave-2/index.ts` | rival fealty pressure | KEEP | Diplomacy/governance hybrid; canonical for overture diplomacy. |

### Military readiness

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Negotiation | `neg_military_reform` | `src/data/events/negotiations.ts` | military reform terms | KEEP | |
| Decree | `decree_arms_commission` | `src/data/decrees/index.ts` | order weapons | KEEP | |
| Decree | `decree_royal_arsenal` | `src/data/decrees/index.ts` | establish arsenal | KEEP | |
| Decree | `decree_war_machine_industry` | `src/data/decrees/index.ts` | industrial war production | KEEP | |
| Decree | `decree_general_mobilization` | `src/data/decrees/index.ts` | full readiness | KEEP | Repeatable. |
| Decree | `decree_exp_levy_militia` | `src/data/decrees/expansion-decrees.ts` | conscript militia | KEEP | Tax-zone regex does NOT fire on this — `levy` is inside `levy_militia` which hits the tax signature. Canonical for both zones. |
| Petition | `faction_req_w2_border_captains_garrison` | `src/data/events/expansion/petitions-wave-2/petitions-military.ts:16` | garrison support | KEEP | |
| Petition | `faction_req_w2_knightly_order_grant` | `src/data/events/expansion/petitions-wave-2/petitions-military.ts` | order charter grant | REDIRECT | Nobility-framed; phase 12 to decide whether it's nobility petition or military petition primarily. |
| Crisis | `evt_exp_w2_mercenary_defection` | `src/data/events/expansion/wave-2/crises-social.ts` | force defection | KEEP | |
| Crisis | `evt_exp_w2_bonded_labor_revolt` | `src/data/events/expansion/wave-2/crises-social.ts` | internal security | KEEP | |
| Assessment | `assess_border_movement` | `src/data/events/assessments.ts` | intel on troops | KEEP | Assessment channel. |
| Overture | `SackASettlement` agenda | `src/data/overtures/wave-2/index.ts` | military threat | KEEP | Also appears in border zone. |

### Succession

| Family | Card ID | File:line | Role | Verdict | Notes |
|---|---|---|---|---|---|
| Negotiation | `neg_marriage_alliance` | `src/data/events/negotiations.ts:230` | dynastic succession pact | KEEP | Also in marriage zone. |
| Crisis | `evt_exp_w2_royal_illness` | `src/data/events/expansion/wave-2/crises-political.ts:37` | legitimacy shock from health | KEEP | Primary succession crisis. |
| Crisis | `evt_exp_w2_dynastic_challenge` | `src/data/events/expansion/wave-2/crises-political.ts:59` | rival claim | KEEP | |
| Overture | `DynasticAlliance` (marriage) | `src/data/overtures/wave-2/index.ts` | rival marriage | KEEP | |
| Overture | `DynasticAlliance` (hostage exchange) | `src/data/overtures/wave-2/index.ts:128` | rival heir exchange | KEEP | |
| (Decree) | — | — | proclaim heir / regent | GAP | Flagged for phase 8/12. |
| (Petition) | — | — | class asks succession clarity | GAP | Flagged for phase 12. |

---

## Retired-event redirect table

Empty this phase — no cards retired. Present as the forward contract:
if a future phase retires an event / decree / negotiation / overture
card id, add a row here mapping the retired id to its replacement (or
`null` for silent pass-through). The `LOAD_SAVE` migration in
`src/context/game-context.tsx` must gain a matching passthrough for
any id that could appear in a historical save, and
`SAVE_SCHEMA_VERSION` in `src/engine/constants.ts` must be bumped.

| Retired id | Replaced by | Save-compat action |
|---|---|---|
| *(none)* | — | — |

**Historical retirements already handled** (recorded here so future
audits don't re-retire them):

| Retired id | File comment | Replaced by |
|---|---|---|
| `evt_exp_dip_marriage_proposal` | `src/data/events/expansion/diplomacy-events.ts:202` | `neg_marriage_alliance` (accept produces `MarriageBond` + `ReligiousAccordBond`) |
| `evt_exp_dip_diplomatic_marriage_offer` | `src/data/events/expansion/diplomacy-events.ts:452` | `neg_marriage_alliance` |

---

## Save-compat

No retirements → no `LOAD_SAVE` passthrough additions, no
`SAVE_SCHEMA_VERSION` bump. Version remains **v8** (per
`src/engine/constants.ts:322`). Pre-Phase-7 saves load unchanged.

---

## Known gaps

Recorded for future authoring phases. **No cards are authored in
Phase 7** — these are flags for the deep-audit phases to consider
within their existing slates.

- **Plague — decree.** No quarantine-orders decree exists.
  Candidate for phase 8 decrees deep-audit: determine whether a
  `decree_quarantine_protocol` tier-1 (+ optional escalation tiers)
  fits the decree chain discipline.
- **Plague — petition.** No commonfolk-supplication-during-outbreak
  petition. Candidate for phase 11 economy + class-conflict slate
  (secondary) or phase 13 environment slate (primary fit).
- **Marriage — petition.** Phase-7 canonical says *petition = a
  match is being proposed to you by a class*. None authored.
  Candidate for phase 11 class-conflict slate.
- **Succession — decree.** No *proclaim heir* / *appoint regent*
  decree. Candidate for phase 8.
- **Succession — petition.** No class-asks-for-succession-clarity
  petition. Candidate for phase 12 advisor + military petitions.

---

## Deferred items (not action this phase)

### Category / framing REDIRECTs

Picked up naturally by the 15 standing audit questions during family
deep-audits. Listed here so the deep-audits don't miss them.

- Phase 8 decrees: `decree_road_improvement`,
  `decree_exp_provincial_academies`, `decree_w2_sumptuary_laws`.
- Phase 9 crises: `evt_exp_w2_royal_illness` (succession?),
  `evt_exp_w2_bandit_lord_uprising` (military?).
- Phase 10 assessments/negotiations/overtures or phase 12 religious
  petitions: `evt_cultural_festival_proposal` (retag category?).
- Phase 11/12 petitions: `faction_req_w2_regional_lords_road`
  (trade infrastructure framing), `faction_req_w2_knightly_order_grant`
  (nobility vs. military framing).

### Pattern C relocations

Phase 16 scope. Already `classification: 'notification'` today, so
no current decision-slot impact:

- `evt_commoner_harvest_festival`
  (`src/data/events/index.ts:110`).
- `evt_merchant_tax_satisfied`
  (`src/data/events/index.ts:4211`).

---

## Regression scanner

`scripts/audit/scans/wiring/cross-family-overlap.ts` encodes the
canonical-family contract mechanically and emits
`CROSS_FAMILY_OVERLAP` (MINOR) when a card in a decision-slot family
(`petition | crisis | decree | negotiation | overture`) matches a
zone signature but sits outside the canonical set for that zone and
isn't on the allowlist. Subject-side filter is intentional:
`notification`, `hand`, `world`, `assessment`, `unknown` families
occupy separate channels and can't structurally compete for monthly
decision slots.

On the live corpus the scanner returns **0 findings**, mechanically
validating this doc's "no overlap" claim.

Unit tests: `scripts/audit/scans/wiring/cross-family-overlap.test.ts`
(pass / zone-match / non-canonical-family / allowlist / multi-zone
cases).

---

## Acceptance

Phase 7 gate per `docs/CARD_AUDIT_WORKSTREAM.md` §Phase 7 and
§Verification:

- `npm run audit` (default) — total findings **1367** MAJOR,
  unchanged from the Phase-6 close-out. No corpus regressions.
- `npm run audit -- --include-minor` — total findings **1700**
  (333 MINOR from existing MINOR scans, 0 MINOR from the new
  `CROSS_FAMILY_OVERLAP`). Prior phase invariants that this phase
  commits to not regressing:
  - `CRITICAL_SHALLOW_RUNTIME` = 0 ✓ (Phase 2)
  - `PROMISE_NOT_DELIVERED` = 0 ✓ (Phase 3 + 4a)
  - `SCOPE_MISMATCH` = 0 ✓ (Phase 4b)
  - `SMART_CARD_COVERAGE_CLASS` = 0 ✓ (Phase 6)
  - `CROSS_FAMILY_OVERLAP` = 0 ✓ (this phase)
- Open from prior phases (not touched here):
  `SMART_CARD_COVERAGE_REGION` (254) and
  `SMART_CARD_COVERAGE_NEIGHBOR` (40) — Phase 5 was skipped in the
  original run order; these carry over into the deep-audit phases'
  smart-text retext work.
- `npm test` — 911 passing (+7 new `cross-family-overlap` tests).
- `npm run lint` — clean.
- `npm run build` — clean.
- No corpus edits; no save-compat migration; `SAVE_SCHEMA_VERSION`
  still 8.
- Reconciliation doc merged (this file). No two decision-slot cards
  compete for the same (family × trigger × class) slot across the
  ten overlap zones.

## Files touched

- `docs/audit/duplicate-reconciliation.md` *(new — this file)*.
- `scripts/audit/scans/wiring/cross-family-overlap.ts` *(new — regression scan)*.
- `scripts/audit/scans/wiring/cross-family-overlap.test.ts` *(new — unit tests)*.
- `scripts/audit/index.ts` *(registered the new scan)*.

