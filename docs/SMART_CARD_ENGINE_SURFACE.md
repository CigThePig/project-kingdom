# Crown & Council — Smart Card Engine Surface

> **Status:** Design reference, companion to `CROWN_AND_COUNCIL_EXPANSION.md`.
> **Goal:** Convert the majority of authored cards from prescripted generics into state-aware "smart cards" whose flavor text, effects, and selection are driven by what the simulation is actually doing.

---

## 0. What a Smart Card Is

A smart card is a card whose body reads like the game *knows what is happening* — it names the actual kingdom, ruler, region, settlement, advisor, or agent involved; it references the specific economic phase, active condition, or prior decision that produced the situation; and it surfaces the real downstream stakes rather than a generic hedge.

Concretely, the difference looks like this:

> **Prescripted (current):**
> *"An envoy from a neighboring power has arrived with proposals for expanded trade agreements. The terms appear favorable, though the nobility bristles at the growing influence of merchant wealth."*

> **Smart (proposed):**
> *"An envoy from King Hadric IV, the Iron-Handed arrives from Velthorne bearing proposals for expanded trade agreements with the Kingdom of Agroth. The terms are favorable — Agroth's economy is booming and its merchants are hungry for routes into your markets — though your nobility remembers the last such deal, three seasons ago, and the wealth it funnelled away from their estates."*

Both are the same card. The smart version is drawing from state that is **already in memory**:

- `neighbor.displayName` = "Kingdom of Agroth"
- `neighbor.rulerName` = "King Hadric IV"
- `neighbor.epithet` = "the Iron-Handed"
- `neighbor.capitalName` = "Velthorne"
- `neighbor.kingdomSimulation.treasuryTrend` = `'rising'` + `economicMomentum > 50`
- `persistentConsequences` has an entry tagged `merchant_trade_deal` from turn N-9

**Nothing new has to be computed.** The engine is already tracking every piece of this. The only thing missing is a template vocabulary and the authored lines to take advantage of it.

---

## 1. The Window Metaphor

The engine runs a full simulation every turn. Cards are windows onto what's already happening. A smart card answers four questions without the player having to navigate away:

| Question | Source |
|---|---|
| **Who?** Which named entity is involved. | `nameResolver` (already exists for neighbors, regions, settlements) + new resolvers for advisors, agents, bonds. |
| **What specifically?** Which state values, not general category. | `contextExtractor` (already exists, underused) + the new placeholder substitution system. |
| **Why now?** What chain of prior choices/conditions led here. | `causalLedger`, `persistentConsequences`, `narrativePressure`, `rulingStyle`. |
| **Who's watching?** The downstream reactive stakes. | Rival `kingdomSimulation.populationMood`, rival `memory`, inter-rival agreements, bond participants, storyline branches. |

A card does not have to answer all four. But every card should answer at least one with a named specific, not a generic descriptor.

---

## 2. The Current Vocabulary vs. What's Available

### 2.1 What authored text currently uses

A grep across every `.ts` file under `src/data/text/` turns up exactly one placeholder token:

```
{neighbor}
```

That's it. 83 occurrences across diplomacy / espionage / military / events. No other placeholder is ever substituted in any authored body or title.

### 2.2 What the nameResolver already exposes but templates don't use

`src/bridge/nameResolver.ts` exposes the following accessors — **every one of these is already populated from procgen state at scenario setup**:

| Accessor | Returns | Example |
|---|---|---|
| `getNeighborDisplayName(id, state)` | Kingdom name | "Kingdom of Agroth" |
| `getNeighborRulerName(id, state)` | Full ruler name | "King Hadric IV" |
| `getNeighborRulerTitle(id, state)` | Title alone | "King", "High Lord" |
| `getNeighborDynastyName(id, state)` | Ruling house | "House Marrowmoor" |
| `getNeighborCapitalName(id, state)` | Capital city | "Velthorne" |
| `getNeighborEpithet(id, state)` | Earned epithet or null | "the Iron-Handed" |
| `getNeighborFullRulerDescriptor(id, state)` | Ruler + epithet | "King Hadric IV, the Iron-Handed" |
| `getRegionDisplayName(id, state)` | Procgen region | "The Ironvale" |
| `getSettlementDisplayName(id, state)` | Procgen settlement | "Fort Greymarch" |

**Eight of these nine accessors are never referenced in any authored template.** The work to generate the names has already been done, the work to retrieve them has already been done — they just never reach the player.

### 2.3 What's in state but has no resolver yet

The following fields are in state and ready to be surfaced, but lack a helper today:

- **Council advisor names** — `state.council.appointments[seat].name`, background, personality label
- **Agent codenames** — `state.espionage.agents[].codename`, specialization label, cover settlement
- **Bond-specific names** — `MarriageBond.spouseName`, `HostageBond.hostageName`, `VassalageBond.overlord`
- **Active initiative title** — resolved from `INITIATIVE_DEFINITIONS[active.definitionId].title`
- **Active storyline label** — resolved from `STORYLINE_TEXT[storyline.definitionId].title`
- **World event names** — resolved from `WORLD_EVENT_TEXT[active.definitionId].title`
- **Condition type labels** — `CONDITION_TYPE_LABELS[c.type]` already exists in `data/text/labels.ts`
- **Economic phase labels** — `ECONOMIC_PHASE_LABELS[phase]` already exists
- **Posture labels** — `POSTURE_LABEL[posture]` already exists
- **Season month names** — already in `data/text/month-names.ts`

All of these need is a one-file resolver in the bridge layer. No new engine work.

---

## 3. The Smart Placeholder Specification

This is the recommended placeholder vocabulary. Every placeholder resolves through a single substitution function (see §7) that takes a card context object (event + optional region/neighbor/etc. IDs) and returns text with tokens replaced.

### 3.1 Identity placeholders — WHO

| Placeholder | Source | Fallback if unresolved | Example |
|---|---|---|---|
| `{neighbor}` | `getNeighborDisplayName(ctx.neighborId, state)` | "a neighboring kingdom" | "Kingdom of Agroth" |
| `{neighbor_short}` | strip "Kingdom of /Realm of /The " from above | "their" | "Agroth" |
| `{ruler}` | `getNeighborRulerName(ctx.neighborId, state)` | "the ruler of {neighbor_short}" | "King Hadric IV" |
| `{ruler_title}` | `getNeighborRulerTitle(ctx.neighborId, state)` | "the ruler" | "King" |
| `{ruler_full}` | `getNeighborFullRulerDescriptor(ctx.neighborId, state)` | "{ruler}" | "King Hadric IV, the Iron-Handed" |
| `{dynasty}` | `getNeighborDynastyName(ctx.neighborId, state)` | "the royal house" | "House Marrowmoor" |
| `{capital}` | `getNeighborCapitalName(ctx.neighborId, state)` | "the capital" | "Velthorne" |
| `{epithet}` | `getNeighborEpithet(ctx.neighborId, state)` | (empty string) | "the Iron-Handed" |
| `{region}` | `getRegionDisplayName(ctx.regionId, state)` | "the province" | "The Ironvale" |
| `{settlement}` | `getSettlementDisplayName(ctx.settlementId, state)` | "the settlement" | "Fort Greymarch" |
| `{chancellor}` / `{marshal}` / `{chamberlain}` / `{spymaster}` | `state.council?.appointments[seat]?.name` | "your {seat_label}" | "Lord Vessin" |
| `{spymaster_or_fallback}` | spymaster name or "your spymaster" | "your spymaster" | used when seat may be vacant |
| `{agent:id}` | `state.espionage.agents.find(a=>a.id===id)?.codename` | "the agent" | "Shrike" |
| `{spouse}` | marriage-bond spouse name | "your consort" | "Lady Sarielle" |
| `{hostage}` | hostage-bond hostage name | "the hostage" | "young Prince Corwyn" |
| `{initiative_title}` | `INITIATIVE_DEFINITIONS[active.definitionId].title` | "the long-term initiative" | "The Golden Road" |
| `{storyline_title}` | `STORYLINE_TEXT[storyline.definitionId].title` | "the unfolding matter" | "The Crown's Schism" |
| `{world_event_title}` | `WORLD_EVENT_TEXT[event.definitionId].title` | "the region-wide event" | "The Black Pox" |

### 3.2 Situational placeholders — WHAT

| Placeholder | Source | Example |
|---|---|---|
| `{season}` | `state.turn.season` | "Summer" |
| `{month_name}` | data/text/month-names by `state.turn.month` | "Frostgate" |
| `{year}` | `state.turn.year` | "the 14th year of your reign" |
| `{economic_phase}` | `ECONOMIC_PHASE_LABELS[state.economy.cyclePhase]` | "Depression", "Boom" |
| `{economic_phase_lc}` | lowercased above | "depression", "boom" |
| `{condition:type}` | match first active condition of given type on region/kingdom | "a severe Drought" |
| `{posture}` | `POSTURE_LABEL[region.posture]` (region-scoped card) | "Garrison" |
| `{terrain}` | region's `terrainType` | "Mountain", "Coastal" |
| `{treasury_tier}` | qualitative — `compileKingdomState` tier | "Troubled", "Flourishing" |
| `{stores_tier}` | qualitative food tier | "Dire", "Stable" |
| `{faith_tradition}` | from `faithCulture.kingdomFaithTraditionId` label map | "the Reformed faith" |
| `{culture_identity}` | from `faithCulture.kingdomCultureIdentityId` label map | "the Highland ways" |
| `{inflation_note}` | "with inflation at {rate}%" or empty | "with inflation at 22%" |
| `{bond_kind}` | human label of relevant bond | "marriage alliance" |
| `{intel_tier}` | `getIntelLevel(networkStrength)` readable | "scant", "strong" |

### 3.3 Memory placeholders — WHY NOW

These resolve against `persistentConsequences`, `rulingStyle`, and `narrativePressure`. They produce short parenthetical or trailing clauses, and **gracefully emit empty strings** when no match is found so templates degrade cleanly.

| Placeholder | Source | Example emitted clause |
|---|---|---|
| `{prior_decision_clause:tag_prefix}` | most recent `persistentConsequence` whose tag starts with prefix, emits "— echoes of a decision {turnsAgo} seasons past" | "— echoes of a decision three seasons past" |
| `{neighbor_memory_clause}` | if `neighbor.memory` contains a recent slight/favor, emit one line | "Agroth has not forgotten the denied marriage pact." |
| `{ruling_style_note}` | dominant StyleAxis if |value| >= 20 | "as befits your Martial reign" |
| `{recent_causal}` | top `recentChain` intermediate step | "the conscription order has thinned the fields" |

### 3.4 Stakes placeholders — WHO'S WATCHING

| Placeholder | Source | Example |
|---|---|---|
| `{rival_mood:id}` | `kingdomSimulation.populationMood` banded | "restive", "content" |
| `{rival_crisis:id}` | `kingdomSimulation.crisisType` if `isInCrisis` | "facing a grain failure of their own" |
| `{inter_rival_note}` | if inter-rival agreement touches {neighborId} | "fresh from signing a trade pact with Veldraq" |
| `{watching_faction}` | if event touches a class at |sat| pressure | "the merchants watch closely" |
| `{storyline_arc_note}` | if active storyline intersects this event | "a beat in the unfolding schism" |

### 3.5 Grammar helpers

These are small but make templates shorter:

| Token | Resolves to | Purpose |
|---|---|---|
| `{their/his/her}` | inferred from ruler title gender or `'their'` | Pronoun agreement. |
| `{They/He/She}` | capitalized pronoun | Sentence starters. |
| `{is/was}` | context tense | Past vs. present event. |

---

## 4. Before / After — Concrete Examples

These use real events from the current corpus. Each "after" uses only placeholders specified above, with no new engine state.

### 4.1 Trade Overture
**Current** (`evt_neighbor_trade_overture`):
> *An envoy from {neighbor} has arrived bearing proposals for expanded trade agreements. The terms appear favorable, though the nobility bristles at the growing influence of merchant-class wealth that foreign trade enables. Accepting would deepen economic ties and mutual dependency with {neighbor}.*

**Smart:**
> *An envoy of {ruler_full} arrives from {capital} bearing proposals for expanded trade with {neighbor}. The terms appear favorable — {neighbor_short} is in {economic_phase_lc}, and {their} merchants press hard for routes into your markets. Your own nobility bristles at the prospect of merchant-class wealth deepening its hold on the realm. {neighbor_memory_clause}*

Uses: `{ruler_full}`, `{capital}`, `{neighbor}`, `{neighbor_short}`, `{economic_phase_lc}` of the neighbor (needs a small extension — see §7.3), `{their}`, `{neighbor_memory_clause}`.

### 4.2 Harvest Blight
**Current** (`evt_harvest_blight`):
> *A persistent blight has spread across the kingdom's central farmlands. Crop yields are falling sharply, and agricultural laborers report entire fields lost to the affliction.*

**Smart:**
> *A persistent blight has taken hold in {region}. Labourers report entire fields lost; the {terrain} soil, already stressed by {condition_context}, cannot shrug it off. {prior_decision_clause:conscription}*

Uses: `{region}` (event already has `affectedRegionId`), `{terrain}`, a new `{condition_context}` helper that concatenates other active conditions in that region, `{prior_decision_clause:conscription}` (if the player recently conscripted labour, this clause surfaces; otherwise nothing is emitted).

### 4.3 Foreign Spy Ring
**Current** (`evt_exp_esp_foreign_spy_ring`):
> *Counter-intelligence operatives have uncovered a network of agents from {neighbor} operating within the capital. The ring has been gathering information on troop deployments, fortification plans, and courtly alliances.*

**Smart:**
> *{spymaster_or_fallback} brings a dossier before the throne: a network of {neighbor_short}'s agents has been operating out of {settlement}, gathering reports on troop deployments and courtly alignments. {ruler_short}'s ambitions toward the {region} are not subtle. {inter_rival_note}*

Uses: `{spymaster_or_fallback}` (named advisor if appointed, "your spymaster" otherwise), `{neighbor_short}`, `{settlement}` (pick from the cover settlements or a border settlement), `{ruler_short}` (last-name short form), `{region}` (nearest contested region to the rival), `{inter_rival_note}` (surfaces if the rival recently signed an agreement with a third party).

### 4.4 Provincial Autonomy
**Current** (`evt_exp_reg_autonomy_dispute`):
> *The governor of a restive province has petitioned the crown for expanded powers of self-governance. Local lords echo the call, citing the particular needs and traditions of their region.*

**Smart:**
> *The governor of {region} has petitioned the crown for expanded powers of self-governance. Local lords echo the call, citing the particular traditions of the {terrain} folk. Loyalty in {region} has slipped to {loyalty_tier}; under {posture} posture, {prior_decision_clause:tax}.*

Uses: `{region}` (event has `affectedRegionId` but today renders "a restive province"), `{terrain}` ("Highland", "Coastal"), `{loyalty_tier}` (new helper: band from `region.loyalty`), `{posture}`, `{prior_decision_clause:tax}`.

### 4.5 Equipment Shortages
**Current** (`evt_military_equipment_shortage_1`):
> *The military quartermaster has filed an urgent report: equipment stores are running dangerously low.*

**Smart:**
> *{marshal_or_fallback} brings the quartermaster's report: equipment stores have fallen to {equipment_condition_tier}. The {year_ref} campaign season has ground {their} armourers down, and with the treasury in {treasury_tier} condition, options narrow.*

Uses: `{marshal_or_fallback}`, `{equipment_condition_tier}` (qualitative band from `state.military.equipmentCondition`), `{year_ref}`, `{their}`, `{treasury_tier}`.

### 4.6 Bountiful Harvest
**Current** (`evt_abundant_harvest_surplus`):
> *The fields have yielded beyond all expectations this season.*

**Smart:**
> *The fields of {dominant_food_region} have yielded beyond all expectations this {season}. Granaries in {settlement_in_region} stand near full, and {chancellor_or_fallback}'s ledgers show the kingdom's agricultural output at a {stores_tier} mark not seen since {year_of_last_peak}.*

Uses: `{dominant_food_region}` (new helper: top-producing region), `{season}`, `{settlement_in_region}`, `{chancellor_or_fallback}`, `{stores_tier}`, `{year_of_last_peak}` (optional — only if you want to track running maxima; can be omitted).

---

## 5. Card Family Conversion Map

For each family, the placeholders most relevant and the specific engine state to weave in.

### 5.1 Crisis cards (`bridge/crisisCardGenerator.ts`)

Crisis events already have `affectedRegionId`, `affectedClassId`, `affectedNeighborId` on the `ActiveEvent`. The generator currently substitutes only `{neighbor}`. High-leverage additions:

- `{region}`, `{terrain}`, `{settlement}` (pick one: capital, largest, or nearest to source)
- `{ruler_full}`, `{dynasty}`, `{capital}` when `affectedNeighborId` is set
- Severity-aware framing: for `Critical` severity crises, mention the active failure counter ("the third consecutive season of empty granaries")
- `{recent_causal}` for the second sentence of the body
- Advisor seat name relevant to category (Marshal for military, Chancellor for economy/civic, Chamberlain for diplomacy, Spymaster for espionage)

### 5.2 Petition cards (`bridge/petitionCardGenerator.ts`)

Petitions carry `affectedClassId` but rarely use it. Additions:

- Class-scoped address: "The merchant guilds" / "The clergy of the Highland faith" / "A delegation of commoners from {region}"
- `{chancellor_or_fallback}` or `{chamberlain_or_fallback}` for class-mediated petitions
- `{prior_decision_clause:<category>}` to surface prior consequences
- Signed names for petitioners (optional — would need a minor proc-gen: "Guildmaster Teresh of {capital_guild_district}")

### 5.3 Decree cards (`bridge/decreeCardGenerator.ts`)

Decrees have `category`. The body (`effectPreview`) is static text from `DECREE_POOL`. Additions:

- Prefix clause from the currently dominant `rulingStyle` axis: "For a reign already leaning {dominant_axis_name}, this decree…"
- Suffix clause from `narrativePressure` if the decree aligns: "…and the pressure toward {dominant_pressure_axis} has been building for {turns}"
- `{chancellor_or_fallback}`, `{marshal_or_fallback}`, etc. depending on category
- When knowledge milestones just unlocked (`extractKnowledgeContext` already catches this), bake the branch name into the body text not just the context line

### 5.4 Negotiation cards (`bridge/negotiationCardGenerator.ts`)

Negotiations are the richest ground — they're all external by definition. The generator already picks a peaceful neighbor at the highest relationship score. Additions per term:

- `{ruler_full}` as the counterparty
- `{dynasty}` and `{capital}` in the preamble
- `{rival_mood:id}`, `{rival_crisis:id}` if the rival is in crisis (it's a huge leverage signal — if the rival is `isInCrisis` they may sign disadvantageous terms)
- `{inter_rival_note}` — surfaces if this rival is in inter-rival war/alliance/pact, changing the stakes
- For marriage/hostage terms: show the procgen name of the spouse/hostage being proposed

### 5.5 Assessment cards (`bridge/assessmentCardGenerator.ts`)

Assessments already resolve a neighbor but surface it only in effects, not flavor. Additions:

- `{ruler_full}` in body
- Intel-gated detail: at `strong`+ intel, surface `kingdomSimulation.treasuryTrend`, `foodTrend`, or a specific `recentInternalEvents` entry
- At `exceptional`, surface the rival's current agenda + target region by name: "Spymaster {spymaster} reports {ruler} has fixed {their} attention on {region}."

### 5.6 Notification cards

Single-choice events. These are the simplest conversion: the body is read-only, so just weave state freely without worrying about choice symmetry. Prime candidates:

- Storyline dormant-note notifications → reference the storyline title and current branch
- Failure-warning notifications → name the specific region/class driving the warning
- Construction-complete notifications → name the settlement, region, and workforce involved

### 5.7 Overture cards (`bridge/diplomaticOvertureGenerator.ts`)

Overtures already carry `{neighbor}` substitution via `buildInlineSpec`. Currently every body is hand-written per agenda. Additions:

- `{ruler_full}`, `{dynasty}`, `{capital}` everywhere
- For `RestoreTheOldBorders`: resolve `neighbor.agenda.targetEntityId` to a specific region name ("{neighbor} formally revives ancient claims to {region}")
- For `DynasticAlliance`: generate a spouse name at surface time, thread it through: "A match with {spouse_candidate} of {dynasty}"
- `{neighbor_memory_clause}` — especially strong here since overtures are agenda-driven and often echo past grievances

### 5.8 Advisor cards (council candidates, Phase 8)

Advisor candidate cards are a special case — the procgen already generates `name`, `background`, `seat`, `personality`. Current court-opportunity body is generic. Additions:

- Background sentence per personality (already partially in `data/advisors/`)
- Explicit mention of `patronClass` ("arrives with the backing of the Merchant guilds")
- The hidden-flaw hook: "though something about {their} bearing gives {chamberlain} pause" when `advisor.flaws.some(f => f.hidden)` is true (leaks *that* there's a flaw, not *which*)

### 5.9 Initiative cards

Initiative commit/abandon opportunities should name the initiative title, its thematic category ("a Military endeavour"), and current kingdom pressure-alignment. Abandon cards should surface sunk-cost: "{turns_active} seasons of work stand half-finished" with the actual integer.

### 5.10 Hand cards (`data/cards/hand-cards.ts`)

Hand cards are banked for later play — their text is written at author time, but their *display at play time* can be state-aware through appended context lines. The bodies themselves could also be lightly templated where applicable (e.g. "hand_forced_levy" could reference which region the levy targets, revealed at play time by the class/rival choice).

---

## 6. The Smart Card Context Ladder

Three tiers of smart-ness. Not every card needs to climb to tier 3. The tiers let you batch conversions by impact.

### Tier 1 — Identity substitution (minimum bar)

Any card that touches a named entity substitutes the real name. This is where "Kingdom of Agroth" replaces "opposing force". Mechanically this is: swap generics ("the province", "a neighboring power", "the quartermaster", "a frontier settlement") for the corresponding placeholder wherever the engine has an ID to resolve.

**Scope**: any card with `affectedNeighborId`, `affectedRegionId`, `targetSettlementId`, or touching `council.appointments`.

**Acceptance test**: no player-facing noun phrase that the engine has state for is rendered as a generic.

### Tier 2 — Situational substitution

Tier 1 + reference to the specific situation (condition, economic phase, posture, terrain, faction pressure, intel tier). Body text names what the simulation is doing, not just who's involved.

**Scope**: crisis, petition, assessment, overture, notification for failure warnings.

**Acceptance test**: body text shifts meaningfully between two runs where the named entities are the same but the situation differs (drought vs. flood; boom vs. depression; friendly vs. hostile posture).

### Tier 3 — Memory substitution

Tier 2 + a sentence or clause that nods to prior decisions, rival memory, ruling-style drift, or narrative pressure. This is what makes the card feel like the world has a memory.

**Scope**: high-severity crises, defining-tier decrees, overtures (especially memory-driven ones), storyline beats.

**Acceptance test**: playing the same card twice in two different runs produces visibly different final sentences because the narrative history is different.

---

## 7. Bridge Layer Additions

The engine needs no changes to support all of §3–6. The bridge layer needs five small additions, in this order.

### 7.1 `bridge/smartText.ts` — central substitution function

One pure function:

```ts
export interface SmartTextContext {
  neighborId?: string;
  regionId?: string;
  settlementId?: string;
  classId?: PopulationClass;
  seat?: CouncilSeat;
  agentId?: string;
  bondId?: string;
  initiativeDefId?: string;
  storylineDefId?: string;
  // Fallback anchors for unknown-source cards:
  fallbackNeighborPicker?: 'hostile' | 'friendliest' | 'first';
}

export function substituteSmartPlaceholders(
  text: string,
  state: GameState,
  ctx: SmartTextContext = {},
): string
```

Internally: one regex pass, one dispatch table mapping each token to a resolver function. Missing context fields produce fallbacks, never raw placeholders. Every resolver is a pure function of `state + ctx`.

**Test strategy**: a single table-driven `smartText.test.ts` with one row per placeholder, asserting both (1) the happy-path substitution produces the expected string and (2) the missing-context path produces the expected fallback.

### 7.2 Wire it into all card generators

For each generator (`crisisCardGenerator`, `petitionCardGenerator`, `decreeCardGenerator`, `assessmentCardGenerator`, `negotiationCardGenerator`, `diplomaticOvertureGenerator`, `storylineCardGenerator`), the wiring is three lines:

```ts
import { substituteSmartPlaceholders } from './smartText';

const ctx = buildContextFromEvent(event); // or equivalent for family
title = substituteSmartPlaceholders(rawTitle, gameState, ctx);
body = substituteSmartPlaceholders(rawBody, gameState, ctx);
```

The context builder is generator-specific but trivial — most families already resolve a neighbor/region at generation time.

### 7.3 Rival-scoped lookups

Two new helpers, mirroring the existing player-scoped ones:

```ts
export function getRivalEconomicPhaseLabel(
  neighborId: string, state: GameState
): string;  // bands neighbor.kingdomSimulation.treasuryHealth into a 5-tier phase

export function getRivalMoodDescriptor(
  neighborId: string, state: GameState
): string;  // from kingdomSimulation.populationMood
```

These unlock `{economic_phase}` for neighbors, `{rival_mood:id}`, and `{rival_crisis:id}`.

### 7.4 Contextual clause generators

The "degrades to empty string if no match" clauses need a single helper each:

```ts
export function priorDecisionClause(
  state: GameState, tagPrefix: string, maxAgeTurns: number = 8
): string;  // returns "" or " — echoes of a decision N seasons past"

export function neighborMemoryClause(
  state: GameState, neighborId: string
): string;  // returns "" or "Agroth has not forgotten the denied marriage pact."

export function rulingStyleNote(
  state: GameState, minAbs: number = 20
): string;  // returns "" or " as befits your Martial reign"

export function recentCausalClause(
  state: GameState, targetSystem: string | null
): string;  // returns "" or " — the conscription order has thinned the fields"

export function interRivalClause(
  state: GameState, neighborId: string
): string;  // returns "" or ", fresh from signing a trade pact with Veldraq"
```

All five are already 80% implementable from code already in `contextExtractor.ts` — they just need to produce a *short clause* rather than a `ContextLine` for display beside the card.

### 7.5 Name resolvers for new entity classes

Three small resolvers, following the `nameResolver.ts` pattern:

```ts
// bridge/advisorNameResolver.ts
export function getAdvisorName(seat: CouncilSeat, state: GameState): string;
export function getAdvisorNameOrFallback(seat: CouncilSeat, state: GameState): string;
// "Lord Vessin" or "your chancellor"

// bridge/agentNameResolver.ts
export function getAgentCodename(agentId: string, state: GameState): string;

// bridge/bondNameResolver.ts
export function getBondDescriptor(bondId: string, state: GameState): string;
// "the marriage to Lady Sarielle", "the vassalage to Agroth"
```

---

## 8. Engine State Surface — the full catalog

This is the reference catalog of engine state. For each, the column **In templates?** records whether the field can *currently* reach a player-facing card body, not whether it's shown *somewhere* (e.g. dashboard, reports). "Extracted" means contextExtractor or another compiler reads it; "No" means no authored card body can surface it.

### 8.1 Time

| Field | Range | In templates? | Notes |
|---|---|---|---|
| `turn.turnNumber` | 1+ | No | Full-count surfaces on dashboard only. |
| `turn.season` | Spring…Winter | No | Labels exist. |
| `turn.month` | 1–12 | No | Month-names authored (`month-names.ts`). |
| `turn.year` | 1+ | No | "Year of your reign" unused. |

### 8.2 Treasury

| Field | Range | In templates? | Notes |
|---|---|---|---|
| `treasury.balance` | integer | No | Only numeric in effect hints. |
| `treasury.netFlowPerTurn` | integer | No | |
| `treasury.income.{taxation,trade,misc}` | integers | No | Tiered label `{treasury_tier}` available via codexCompiler. |
| `treasury.expenses.{milUpkeep,construction,intel,religious,festival}` | integers | No | All unused in flavor. |
| `treasury.consecutiveTurnsInsolvent` | 0+ | situationTracker | Failure-warning cards could reference exact count. |

### 8.3 Food

| Field | Range | In templates? | Notes |
|---|---|---|---|
| `food.reserves` | 0+ | No | Tier `{stores_tier}` available. |
| `food.production/consumption/netFlow` | integers | No | |
| `food.seasonalModifier` | 0–1.5 | No | Would be great on seasonal cards. |
| `food.consecutiveTurnsEmpty` | 0+ | situationTracker | |

### 8.4 Population

| Field | In templates? | Notes |
|---|---|---|
| `population.<class>.satisfaction` | Extracted (`extractClassPressureContext`) | Never woven into body, only context line. |
| `population.<class>.satisfactionDeltaLastTurn` | Extracted | Same. |
| `population.Nobility.intrigueRisk` | No | Directly suggests "whispers in court" flavor. |
| `populationDynamics.migrationPressure` | Extracted | |
| `populationDynamics.housingCapacity` vs `currentTotalPopulation` | Extracted | "Overcrowding" case only. |
| `populationDynamics.pendingMobility[]` | No | Surfaces *why* people are moving between classes, unused. |
| `populationDynamics.birthRate/deathRate modifiers` | No | "Births running ahead of deaths" flavor hook. |

### 8.5 Military

| Field | In templates? | Notes |
|---|---|---|
| `military.forceSize` | No | |
| `military.readiness` | No | |
| `military.equipmentCondition` | No | Could drive `{equipment_condition_tier}`. |
| `military.morale` | No | `{morale_tier}`. |
| `military.deploymentPosture` | No | "Forward-postured" / "Defensive". |
| `military.intelligenceAdvantage` | No | |
| `military.militaryCasteQuality` | No | "The warrior-caste grows uneasy" flavor. |

### 8.6 Stability

| Field | In templates? | Notes |
|---|---|---|
| `stability.value` | Extracted | Realm tier used in codex. |
| `stability.classContributions` | No | "The nobility carries the crown, while the commoners strain" flavor. |
| `stability.decreePaceContribution` | No | "The court groans under the pace of decrees" — rich hook. |

### 8.7 Faith & Culture

| Field | In templates? | Notes |
|---|---|---|
| `faithCulture.faithLevel` | Extracted | |
| `faithCulture.culturalCohesion` | No | |
| `faithCulture.activeOrders[]` | No | Named religious orders could be surfaced. |
| `faithCulture.heterodoxy` | Extracted | |
| `faithCulture.schismActive` | Extracted | |
| `faithCulture.kingdomFaithTraditionId` | No | Label lookup exists. **Very high-leverage** — every religious event could name the specific tradition ("the Reformed rites", "the Old Faith"). |
| `faithCulture.kingdomCultureIdentityId` | No | Ditto. |

### 8.8 Diplomacy — per neighbor

| Field | In templates? | Notes |
|---|---|---|
| `displayName`, `rulerName`, `rulerTitle`, `dynastyName`, `capitalName`, `epithet` | **Only `displayName`** is ever substituted (via `{neighbor}`) | The single largest template-vocabulary gap. |
| `relationshipScore` | Extracted (only when posture ≥ Tense) | |
| `attitudePosture` | Extracted | |
| `disposition` | Partial | Dossier uses it, cards don't. |
| `militaryStrength` | Dossier only | |
| `espionageCapability` | Dossier only | |
| `warWeariness` | No | "War-weary" tag for long conflicts. |
| `isAtWarWithPlayer` | No | Flag; redundant with posture. |
| `recentActionHistory[]` | Dossier only | Powerful hook for "Agroth's envoys, fresh from {last_action}…" |
| `activeAgreements[]` | situationTracker | |
| `pendingProposals[]` | No | |
| `kingdomSimulation.*` | Dossier at strong+ intel | **This is the big one.** Every field below is hidden from most cards today. |
| `kingdomSimulation.treasuryHealth` | Dossier | |
| `kingdomSimulation.treasuryTrend` | Dossier | |
| `kingdomSimulation.foodSecurity/foodTrend` | Dossier | |
| `kingdomSimulation.internalStability` | Dossier | |
| `kingdomSimulation.populationMood` | Dossier | |
| `kingdomSimulation.expansionistPressure` | No | Direct agenda-weight; player never sees it. |
| `kingdomSimulation.mercantilePressure` | No | |
| `kingdomSimulation.pietisticPressure` | No | |
| `kingdomSimulation.recentInternalEvents[]` | Dossier at strong+ intel | "Agroth suffered a famine in its southern provinces last season" flavor. |
| `kingdomSimulation.isInCrisis` + `crisisType` | Dossier at strong+ intel | **Huge** negotiation leverage; currently invisible to most cards. |
| `agenda.current/targetEntityId/progressValue` | Dossier moderate+ | Overture cards use `current` only. |
| `memory[]` | Dossier only (as drift) | Specific memory entries never named. |
| `bonds[]` | situationTracker (flat) | Marriage/hostage/vassalage/coalition names never woven into event bodies. |

### 8.9 Diplomacy — kingdom-level

| Field | In templates? | Notes |
|---|---|---|
| `interRivalAgreements[]` | Dossier at moderate+ intel + worldPulse | Never in card bodies. Rich hook: "fresh from signing a pact with Veldraq…" |
| `rivalRelationships[][]` | No | The full symmetric matrix is invisible to cards. |
| `bonds[]` (global) | situationTracker | |

### 8.10 Regions — per region

| Field | In templates? | Notes |
|---|---|---|
| `id` / `displayName` | Court-opportunity set-posture only | Regions are rarely named in event bodies. |
| `primaryEconomicOutput` | No | "The fishing villages of {region}" type flavor. |
| `developmentLevel` | Codex tier | |
| `strategicValue` | No | |
| `isOccupied` | No | |
| `loyalty` | Extracted | Never in body. |
| `infrastructure.{roads, walls, granaries, sanitation}` | Extracted at decay | Never in body flavor ("the cracked walls of {settlement}…"). |
| `localConditions[]` | Extracted | Severe cases only; mild/moderate never surfaced. |
| `terrainType` | No | **Highly flavourful.** "The Mountain folk of {region}" vs. "The Coastal merchants of {region}". |
| `posture` + `postureSetOnTurn` | Court opportunities | Never in body. |

### 8.11 Geography

| Field | In templates? | Notes |
|---|---|---|
| `edges[]` (adjacency) | worldPulse inter-rival skirmish | Kind (land/river/sea/mountain_pass) and friction tier never in card bodies. |
| `historicClaims[]` | No | **Extremely underused.** Every territorial event could cite the specific ancestral claim: "Agroth's claim to {region} predates the Rathgar dynasty." |
| `settlements[]` | Court-opportunity recruit-agent | Role (capital/market/fortress/shrine/minor) never in body. |

### 8.12 Espionage

| Field | In templates? | Notes |
|---|---|---|
| `networkStrength` | situationTracker | `{intel_tier}` via `getIntelLevel` but never in body. |
| `counterIntelligenceLevel` | situationTracker | |
| `agents[]` | No | Named codenames invisible to cards that trigger *because of* those agents. |
| `agents[].burnRisk` | Spawns petitions, body is generic | Petition body should read "Shrike's cover is fraying in Fort Greymarch" — currently does not. |
| `ongoingOperations[].findings[]` | Report screen | Multi-turn op findings never narrated in cards. |
| `moles[]` | Detection petition fires | Body is generic; should name the affected seat ("the whispers seem to touch your chancellor's desk"). |

### 8.13 Knowledge

| Field | In templates? | Notes |
|---|---|---|
| `branches.{branch}.currentMilestoneIndex` | Extracted | "Milestone N reached" generic; milestone *title* never in body. |
| `branches.{branch}.unlockedAdvancements[]` | Decree availability | Not in body flavor. |

### 8.14 Environment / Conditions

| Field | In templates? | Notes |
|---|---|---|
| `environment.activeConditions[]` | Extracted | Severe cases get a context line; body never names specific condition. |
| `environment.weatherSeverity` | No | Seasonal cards should read very differently in a hard winter vs. mild. |
| `environment.droughtAccumulator` | No | Foreshadows the condition emergence. |
| `environment.floodRisk` | No | |
| `environment.diseaseVulnerability` | No | |
| `environment.sanitationLevel` | No | |
| `environment.plagueMemoryTurns` | No | "It has been 12 seasons since the last pox" — atmospheric. |

### 8.15 Economy

| Field | In templates? | Notes |
|---|---|---|
| `economy.cyclePhase` | Extracted | Never in body. Every economic card could reference the phase by name. |
| `economy.economicMomentum` | Extracted | |
| `economy.merchantConfidence` | Extracted | |
| `economy.inflationRate` + `cumulativeInflation` | Extracted when high | |
| `economy.foodPriceMultiplier` | No | "Bread in the markets has doubled in price" flavor. |
| `economy.tradeVolume` | No | |
| `economy.resourceDemandPressure` | No | Per-resource scarcity, never narrated. |

### 8.16 Narrative Pressure & Ruling Style

| Field | In templates? | Notes |
|---|---|---|
| `narrativePressure.{axes}` | Codex pulse only | Never in body. Dominant axis would add thematic weight to defining decrees. |
| `rulingStyle.axes.{axis}` | Extracted (dawn cards only) | Elsewhere never. |
| `rulingStyle.recentDecisions[]` | No | "Your last twelve rulings have leaned Authoritarian" flavor. |
| `rulingStyle.crossedThresholds` | No | Threshold-crossings are perfect triggers for unique notification cards. |

### 8.17 Persistent Consequences & Memory

| Field | In templates? | Notes |
|---|---|---|
| `persistentConsequences[]` | Extracted (vague "prior decision") | Named consequences invisible. |
| `activeTemporaryModifiers[]` | No | Surfacing "a lingering cost of your decision to X, N seasons remaining" is direct and valuable. |
| `activeKingdomFeatures[]` | situationTracker | |
| `resolvedStorylineIds[]` | No | Rich anchor for callbacks: "since the matter of the Crown's Schism was settled…" |
| `issuedDecrees[]` | Decree cooldown logic | Past decree titles could be cited in future events. |

### 8.18 Council

| Field | In templates? | Notes |
|---|---|---|
| `council.appointments[seat].name` | No | **The single most obvious identity substitution gap** after `{neighbor}`. |
| `council.appointments[seat].personality` | No | Personality-tinged flavor ("your Cunning chamberlain suggests…"). |
| `council.appointments[seat].loyalty` | No | Low-loyalty advisors should hedge more in their attributed lines. |
| `council.appointments[seat].flaws` | Flaw-reveal events | Hidden flaws generate generic "something is off" hooks today. |
| `council.pendingCandidates[]` | Court opportunity | |

### 8.19 Initiatives / Storylines / World Events

| Field | In templates? | Notes |
|---|---|---|
| `activeInitiative` | Codex domain | Initiative title never woven into related cards. |
| `activeStorylines[].currentBranchId` | Storyline card itself | Never referenced in adjacent cards. |
| `activeWorldEvents[].phase` + `affectedKingdoms[]` | World-event crisis cards | Phase/spread invisible in other cards. |

### 8.20 Combos & Hand

| Field | In templates? | Notes |
|---|---|---|
| `discoveredCombos[]` | Codex only | Discovered combo names could surface in the card that *just completed* the combo. |
| `courtHand.slots[].turnsUntilExpiry` | Hand panel | Never mentioned in bank-triggering cards. |

### 8.21 Action budget / policies

| Field | In templates? | Notes |
|---|---|---|
| `actionBudget.slotsRemaining` | Slot UI | |
| `policies.*` | No | Current policies (taxation level, trade openness, etc.) rarely surfaced in bodies even when the card is *caused by* the policy. |

---

## 9. Net-New Smart-Card Archetypes

Cards that do not exist today but that the engine already has all the state to support.

| Archetype | Trigger | Family | Named state it surfaces |
|---|---|---|---|
| **Rival Crisis Window** | `neighbor.kingdomSimulation.isInCrisis` + intel ≥ moderate | notification | crisis type, region where it's happening, population mood |
| **Agent Burn Extraction** | `agent.burnRisk` crosses `BURN_RISK_EXTRACTION_THRESHOLD` | petition | agent codename, cover settlement, duration of cover |
| **Mole Suspicion** | `mole.detectionProgress` crosses threshold | petition | affected council seat, *without* naming the planter |
| **Initiative Failure Watch** | `activeInitiative.consecutiveFailingTurns >= 1` | notification | initiative title, failing condition field, turns to abandon |
| **Bond Strain** | `bond.turnsRemaining <= 2` or participant relationship drops below threshold | petition | bond kind, participant names, breach penalty preview |
| **Inter-Rival War Alert** | any `interRivalAgreement.kind === 'war'` involving a border neighbor | notification | both rivals named, the shared target if alliance-war, geographic implications |
| **Claim Pressure** | `historicClaim.neighborId` relationship drops + `claim.regionId` proximity | petition | specific region, specific claim strength, specific turn it was lost |
| **Infrastructure Decay** | `region.infrastructure.{field} < 30` for 2+ consecutive turns | petition | specific region, specific infrastructure type, specific decay driver |
| **Stale Posture Prompt** | `isPostureStale` on a region (already wired to court-opp) → promote to first-class petition | petition | region, current posture age, suggested posture |
| **Religious Order Founding Push** | `faithCulture.heterodoxy > 60` and no matching order active | petition | tradition, order type, upkeep preview |
| **Advisor Flaw Reveal** | `advisor.flaw.hidden === true` and per-turn detection check passes | crisis/petition | advisor name, flaw label, consequences |
| **Advisor Loyalty Drift** | `advisor.loyalty < 30` | notification | advisor name, specific misalignments from recent pressures |
| **Causal Chain Notification** | `causalLedger.recentChains` top-magnitude chain completes | notification | chain endpoints by named system, magnitude, turn |
| **Settlement-Specific Event** | any of the above scoped to a specific settlement (fortress/shrine/market/capital) | various | settlement name and role, parent region |
| **Prior Decree Callback** | any new event where `affectedClassId` matches a class impacted by a decree from `issuedDecrees` in the last 6 turns | petition | decree title, turn issued, linked current consequence |
| **Dominant Pressure Storyline Tease** | `narrativePressure.{axis}` crosses 60+ but no storyline active | notification | axis name, dominant theme, hint toward storyline class |

Each of these is just a new event def + text entry + trigger condition. No new engine primitives needed.

---

## 10. Codex Entries Worth Adding

The Codex is the "deeper reference" layer — information too dense for a card but valuable for the player to consult. Existing domains: Realm, Stores, Treasury, Infrastructure, Armies, Faith, Pressures, Initiative. Recommended additions:

- **Council** — advisors by seat, their personality, known flaws, loyalty band, patron class, background.
- **Intelligence Roster** — named agents, cover settlements, specialization, reliability and burn risk bands, ongoing operations with partial findings by stage.
- **Foreign Courts** — one entry per neighbor, a collapsed dossier for each. Also surfaces `historicClaims` that involve the player.
- **Bonds** — active marriages, hostages, vassalages, coalitions, trade leagues, religious accords, cultural exchanges. Each with participants, age, breach penalty.
- **Initiatives & Long Works** — active + recently-completed initiatives, construction projects with ETA.
- **Inter-Rival Situation** — a tiny digest of who's allied, who's at war, who's trading with whom among the neighbors; gated by intel tier.
- **Chronicle of Decisions** — `rulingStyle.recentDecisions`, top-N `persistentConsequences`, storylines resolved this reign. Doubles as a "what kind of ruler am I becoming" mirror.
- **Regional Atlas** — per region: name, terrain, loyalty tier, posture + age, infrastructure, local conditions, strategic value, border status, historic claims by other neighbors.

None of these require engine changes — they're pure bridge-layer compilers over state that already exists.

---

## 11. Implementation Order

Phased so each step is shippable and each unlocks later work.

### Phase A — Foundation (1 PR, ~1 day)

1. Create `bridge/smartText.ts` with the substitution engine, dispatch table, and fallbacks for §3.1 and §3.2 tokens.
2. Wire it into the six generators (crisis, petition, decree, assessment, negotiation, overture) — three-line change per generator, no behavior change until templates are updated.
3. Table-driven test for every placeholder.

**Phase gate:** `npm test && npm run lint && npm run build` all green. Playing the game produces identical output because no template strings have changed yet — this is infrastructure only.

### Phase B — Identity sweep (Tier 1 — 2–3 PRs)

1. For each event text file in `src/data/text/` and `src/data/text/expansion/`, rewrite bodies that reference `{neighbor}` to also use `{ruler}`, `{dynasty}`, `{capital}`, `{ruler_full}` where it reads better.
2. For every event with `affectedRegionId`, introduce `{region}` in the body where generics currently stand ("a province" → "{region}").
3. Same for `affectedSettlementId` / `{settlement}` (much smaller set).
4. Council-seat identity sweep for cards that mechanically invoke a seat (advisor-effected crises, seat-scoped petitions).

**Acceptance**: grep for common generic phrases (`a neighboring`, `the borderlands`, `a remote province`, `your advisor`, `the quartermaster`) across all text files and verify each hit either still makes sense or has been replaced.

### Phase C — Situational sweep (Tier 2 — 2–3 PRs)

1. Add §7.3 rival-scoped lookups.
2. Extend the substitution engine with §3.2 situational tokens.
3. Sweep event files category-by-category (economy, food, military, diplomacy, environment) weaving situation tokens into the bodies. One commit per category for bisectability.
4. Add `{posture}`, `{terrain}`, `{loyalty_tier}` tokens to region-scoped events.
5. Add `{faith_tradition}`, `{culture_identity}` tokens to religion/culture events.

### Phase D — Memory sweep (Tier 3 — 1–2 PRs)

1. Add §7.4 clause generators.
2. Add §3.3 memory tokens to the substitution engine.
3. Author ~20–30 high-leverage callbacks on defining-tier decrees, critical crises, and overtures.
4. Quiet, graceful fallbacks — no memory, no clause; never a broken sentence.

### Phase E — New archetypes (per card, one at a time)

Each new archetype from §9 is its own mini-PR: one event definition, one effects entry, one text entry, one trigger condition, one test. No ordering dependencies between archetypes — pick the highest-leverage first (Rival Crisis Window, Agent Burn Extraction, and Mole Suspicion read as the biggest visible wins).

### Phase F — Net-new name resolvers & Codex expansion (background)

1. `advisorNameResolver`, `agentNameResolver`, `bondNameResolver`.
2. One Codex domain from §10 per PR. Pure additive work; no save migration.

---

## 12. Non-Goals for This Expansion

- No new engine primitives. Everything in this document is achievable with the current `GameState` shape. The one place that may want a tiny addition is explicit rival-economic-phase caching on the rival (to avoid re-banding on every card render) — but it can also live in a memoised bridge helper.
- No new UI screens. Every smart-card feature surfaces inside the existing `Card` envelope or the Codex overlay. The card remains the unit of attention.
- No mechanic changes. Smart cards do not alter effect math, probabilities, or outcomes. They only change the *language* of cards and *which* cards are eligible to surface.
- No save migration. Adding placeholders to authored templates is a pure text change. Adding new archetype events is equivalent to the existing Wave 2 content drops — no schema changes.

---

## 13. The Work of Writing Lines

This document describes the *infrastructure* and the *catalog*. The bulk of the actual expansion is prose: rewriting roughly 150+ authored event bodies, plus authoring ~20–30 net-new archetype bodies. That work is meaningfully assisted by having the tokens declared up-front — an LLM writing prose for `evt_harvest_blight` against the template `"A blight has taken hold in {region}. Labourers of the {terrain} reaches report…"` produces better copy than free-form rewrites, because the token list acts as a shot list for what the writer should mention.

A natural working rhythm:

1. Open an event file.
2. For each entry, identify which §3 tokens the event's known context can carry.
3. Write the title (Tier 1 — names only, short).
4. Write the body in three sentences: identity (who/what — Tier 1), situation (state — Tier 2), stakes or callback (Tier 3).
5. Keep choice labels terse and un-templated. The flavor lives in title and body.

Estimated effort, assuming AI-assisted authoring: Phase A ~1 day, Phase B ~3–4 days, Phase C ~5–7 days, Phase D ~2–3 days, Phase E per archetype ~1 day each, Phase F ~1 day per Codex domain. This is the same scale as a single major expansion phase in the existing roadmap.

---

## 14. Quick Reference — Placeholder Cheatsheet

For ongoing authoring. Drop this in a comment at the top of each text file when starting a rewrite pass.

```
// IDENTITY: {neighbor} {neighbor_short} {ruler} {ruler_title} {ruler_full}
//           {dynasty} {capital} {epithet}
//           {region} {settlement} {terrain}
//           {chancellor} {marshal} {chamberlain} {spymaster}
//           {chancellor_or_fallback} {marshal_or_fallback}
//           {chamberlain_or_fallback} {spymaster_or_fallback}
//           {initiative_title} {storyline_title} {world_event_title}
//
// SITUATION: {season} {month_name} {year}
//            {economic_phase} {economic_phase_lc}
//            {treasury_tier} {stores_tier} {intel_tier}
//            {posture} {loyalty_tier} {morale_tier} {equipment_condition_tier}
//            {faith_tradition} {culture_identity}
//            {condition:type} {condition_context}
//            {inflation_note}
//
// MEMORY:    {prior_decision_clause:tag_prefix}
//            {neighbor_memory_clause}
//            {ruling_style_note}
//            {recent_causal}
//            {inter_rival_note}
//            {watching_faction}
//            {storyline_arc_note}
//
// GRAMMAR:   {their/his/her} {They/He/She} {is/was}
```

---

*End of reference.*
