# Crown & Council — Card Audit Rules

> **Purpose.** Rules, severity tiers, and per-family rubrics for auditing every authored card in the corpus after the smart-card rewrite. The audit verifies that each card's text, choices, effects, and wiring all hold together — and that every card does meaningful work in the simulation, not just surface-level stat nudges.
>
> **Companion to** `SMART_CARD_ENGINE_SURFACE.md`. This doc is about *verification*; that doc was about *substitution*.

---

## 0. Working principle

Every card is a contract between three parties: the text (what it says), the effects (what it does), and the engine (what it touches). The audit's job is to find every card where those three disagree — where the text promises something the effects don't deliver, where the effects touch nothing structural, where the engine has context the text never uses, or where a card is taking up a decision slot without making a decision worth taking.

---

## 1. The three card patterns

Every card resolves into exactly one pattern. Which pattern a card is *supposed* to be determines which rules apply to it.

### Pattern A — Active decision
The overwhelming majority. The player chooses one of 2–4 options. Each choice shapes the simulation meaningfully beyond surface numbers.

### Pattern B — Consequence reveal
A single-choice or simple-acknowledge card that surfaces because prior engine state reached a threshold (a mole was detected, an agent's cover is burning, a bond is expiring, a claim has ripened). The *text* must name the specific state; the *choice* may be acknowledgement, but the surfacing itself was structurally earned. Pattern B cards are rare.

### Pattern C — Pure acknowledgement
Flavor. Something happened; nothing changes. "Commoners celebrate the harvest."

**Binding placement rule:**

> **Pattern C cards never consume a monthly decision slot.** They belong in seasonal dawn text, end-of-season summary, or World Pulse lines. A monthly slot spent acknowledging is a monthly slot wasted.

Audit consequence: any single-choice card currently sitting in the monthly deck that is not Pattern B is, by definition, a Pattern C in the wrong place, and **must be relocated or elevated**.

---

## 2. The core substance rule

> **Every monthly card (crisis, petition, decree, negotiation, assessment, overture, hand card) is Pattern A. Every Pattern A card must produce at least one structural effect on at least one of its choices.**

### What "surface" means
A surface effect is a one-shot numeric nudge to a visible stat. These alone are insufficient:

- `treasuryDelta`, `foodDelta`, `stabilityDelta`, `faithDelta`, `heterodoxyDelta`, `culturalCohesionDelta`
- `militaryReadinessDelta`, `militaryMoraleDelta`, `militaryEquipmentDelta`, `militaryForceSizeDelta`
- Any `*SatDelta` (class satisfaction)
- `diplomacyDeltas` (one-shot relationship nudge, no bond, no agreement)
- `espionageNetworkDelta` as a one-shot
- `regionConditionDelta`, `regionDevelopmentDelta` as one-shots

### What "structural" means
A structural effect leaves a mark the simulation can query later. At least one of these must appear on at least one choice of any Pattern A card:

- **Kingdom feature established** (`KINGDOM_FEATURE_REGISTRY[tag]` entry so the feature auto-creates on resolution; ongoing per-turn effect)
- **Temporary modifier queued** (`EVENT_CHOICE_TEMPORARY_MODIFIERS[event][choice]` entry; ongoing per-turn effect for N turns)
- **Persistent consequence tag that is actually *read* somewhere** (trigger condition, storyline gate, narrative pressure axis, or event-text callback). A consequence tag that no card or system queries is dead paper — it counts as structural only if the tag is consumed.
- **Follow-up event scheduled** (`followUpEvents[]` entry on the event definition)
- **Policy or stance changed** (one of `PolicyState` fields)
- **Construction project started**
- **Bond created, strained, or broken** (`Bond` subtypes)
- **Diplomatic agreement proposed, signed, or broken** (distinct from one-shot relationship deltas)
- **Agent recruited / dispatched / extracted**
- **Ongoing operation started**
- **Mole detection progressed**
- **Knowledge progress bumped or milestone advanced** (distinct from ambient per-turn progress)
- **Religious order activated or deactivated**
- **Storyline activated or resolved by explicit effect** (rare — usually flows through pressure, but some cards force it)
- **Narrative pressure axis nudged**
- **Ruling-style axis nudged** (via `EVENT_CHOICE_STYLE_TAGS`)
- **Region posture changed** (`posture` field)
- **Region infrastructure modified** (`roads`, `walls`, `granaries`, `sanitation`)
- **Active condition emerged or resolved** (distinct from regionConditionDelta, which only nudges severity)
- **Active initiative committed, progressed, or abandoned**

### The "at least one choice" clause

A Pattern A card with three choices may legitimately have one "do nothing meaningful" option — that's a valid trade-off where the player pays an opportunity cost. But at least *one* choice must be structural. A card where *every* choice is stat-only is a fail. A card where one choice is stat-only and the others are structural is fine and sometimes actively good design.

### Severity scaling corollary

> Mechanical depth scales with rarity and tier.
>
> - **Defining-tier** (decrees rarity `Defining`, Critical crises): must establish a kingdom feature, change policy, activate/resolve a storyline, or trigger a bond-level diplomatic change. Temporary modifier alone is insufficient.
> - **Rare-tier**: at minimum a temporary modifier, a persistent consequence tag that is queried, or a follow-up event.
> - **Uncommon-tier**: a persistent consequence tag, a follow-up, or a style/pressure nudge beyond surface.
> - **Common-tier**: single structural effect is sufficient.
>
> Tier 1 decree with no structural effect = **MAJOR**.
> Critical crisis with only surface effects = **MAJOR**.

---

## 3. Text integrity rules

> **No raw placeholders in rendered output.** Any `{token}` visible to the player = fail. All placeholders must resolve, or fall back to sensible generic text when their context is unavailable.

> **Smart-card placeholder coverage.** If a card references a named engine entity that is available in context (`affectedNeighborId`, `affectedRegionId`, seat for advisor-mediated cards, agent id for agent-triggered cards, bond id for bond-triggered cards), the body must name that entity at least once. Region-scoped crisis rendering "a remote province" when `affectedRegionId` is populated = **MAJOR**.

> **Tone matches family.** Crises read urgent. Petitions read supplicant (someone is asking). Decrees read royal (you are declaring). Negotiations read formal (two sides). Assessments read observational (here is what we see). Overtures read formal-external. Notifications read brief-informational. Mismatched tone = **MINOR**.

> **No orphaned metaphors.** If the text uses a concrete image ("the granaries will stand for generations"), the mechanical effect must back it (ongoing food kingdom feature). Flowery language without mechanical reflection = **MAJOR**.

> **No misleading scope.** If the body frames the event as affecting the whole kingdom but the effects are all regional, or vice versa, the framing is wrong. Body and effect scope must agree = **MAJOR**.

---

## 4. Coherence rules

### 4.1 Promise / delivery coherence
Body references → effect mechanics. If the body says "a lasting improvement to the kingdom's roads," the effect must include `regionDevelopmentDelta > 0` on at least one region, or a construction project, or a kingdom feature — not "Merchants +2."

### 4.2 Category coherence
- Military category → touches `military`, `militaryCaste`, or military-relevant structural effect.
- Religious category → touches `faith`, `heterodoxy`, `culturalCohesion`, `religiousOrders`.
- Economy category → touches `treasury`, `merchants`, `economy`, `trade`.
- Food category → touches `food`, `granaries`, or agricultural effect.
- Diplomacy category → touches `diplomacyDeltas`, bonds, or agreements.
- Espionage category → touches `espionage`, agents, ops, moles.
- Environment category → touches `environment`, `conditions`, `weatherSeverity`.
- PublicOrder category → touches `stability`, `classConflict`, social conditions.
- Region category → touches `regions`, region-scoped fields.
- ClassConflict category → touches multiple classes with opposing deltas.

Category without category-appropriate touch = **MAJOR**.

### 4.3 Severity coherence
- Informational: `|total_delta|` (sum of absolute values across effect fields) typically 3–15.
- Notable: 10–30.
- Serious: 25–60.
- Critical: 50+.

Severity without matching magnitude = **MAJOR**.

### 4.4 Trigger coherence
If the body references a specific state ("during the ongoing drought," "as the treasury empties," "with the northern march restive"), the `triggerConditions` must gate on that state. Body referencing state that triggers don't require = **MAJOR** (the card can fire when its own text is wrong).

### 4.5 Choice / effect coherence
The choice labels must match what they do. "Grant Amnesty" with `commonerSatDelta: -5` = the label is lying = **MAJOR**.

---

## 5. Choice differentiation rules

### 5.1 Structural distinctness
Two choices that differ only in sign or magnitude of the same surface fields = clones. They fail differentiation.

Two choices are meaningfully distinct only if they differ in at least one of:
- Consequence tag (implicitly true — every choice has a distinct `${eventId}:${choiceId}` tag, but the tag must be *read* somewhere for this to count structurally)
- Follow-up event triggered
- Kingdom feature or temporary modifier
- Style-axis or pressure-axis contribution
- Structural effect kind (see §2)
- Scope of impact (kingdom-wide vs. regional vs. class-specific vs. neighbor-specific)

### 5.2 Choice count calibration
- 1 choice: Pattern B only. Must be state-triggered reveal; text must name the state.
- 2 choices: Binary decisions. Fine for clear yes/no, accept/decline, now/later.
- 3 choices: Classic "trilemma" shape. Each branch must lead to meaningfully different downstream state. Three choices that are "yes / no / softer yes" = fail.
- 4+ choices: Reserved for crises and defining decrees. Each additional choice increases the burden on structural differentiation.

### 5.3 Cost/benefit asymmetry
Choices should not all have identical `slotCost`. If all are `slotCost: 1`, the card is flattening its decision space. Mix at least one `isFree: true` (crisis responses) or `slotCost: 0` against paid options where reasonable.

---

## 6. Wiring integrity rules (automatable)

Automated scans catch these. The audit's pre-pass script runs these first and produces a findings log grouped by file.

- **Text entry present.** Every `EventDefinition.id` in every pool has a matching `EVENT_TEXT[id]`. Missing = runtime crash risk.
- **Effects entry present.** Every event with choices has `EVENT_CHOICE_EFFECTS[id]` covering every `choiceId`. Missing = silent no-op on resolution.
- **Choice labels present.** Every `choiceId` on a definition appears as a key in `EVENT_TEXT[id].choices`. Missing = button shows the raw choiceId.
- **Parallel table coverage.** Same rule for `DECREE_EFFECTS`, `ASSESSMENT_EFFECTS` / `ASSESSMENT_TEXT`, `NEGOTIATION_EFFECTS` / `NEGOTIATION_TEXT`, `WORLD_EVENT_CHOICE_EFFECTS` / `WORLD_EVENT_TEXT`.
- **Follow-up target exists.** Every `followUpEvents[].followUpDefinitionId` resolves to an entry in `FOLLOW_UP_POOL` or `EVENT_POOL`.
- **Style tag points at real choices.** Every `EVENT_CHOICE_STYLE_TAGS[eventId][choiceId]` references a choice that exists on the definition.
- **Kingdom feature registry tags are reachable.** Every `KINGDOM_FEATURE_REGISTRY` key with `event:` prefix has a corresponding event + choice combination that produces the tag.
- **Consequence tag readers resolve.** For every tag referenced in a `triggerConditions` entry (`has_consequence`, `not_has_consequence`), at least one card or system produces that tag.
- **Trigger conditions are attainable.** Every `triggerConditions` combination can plausibly hold in some reachable game state (this one is heuristic — run a state-sampling harness and flag conditions that never hold across 500 simulated turns as suspicious).

---

## 7. Four outcomes per card

The audit does not reduce to pass/fail. Every card audited resolves to one of:

| Outcome | Means |
|---|---|
| **Pass** | Text and effects hold up to all rules above. No action. |
| **Retext** | Effects are fine; body needs smart-card rewrite (usually Tier 1 or 2 from the smart-card spec). No mechanical work. |
| **Re-effect** | Text is fine; choices need structural effects added. Data-layer work only. |
| **Rebuild** | The card's concept is thin and the best fix is a new card covering the same trigger niche. Full redesign. |

**Rebuild is contextual, not mechanical.** Just because all three choices are stat-only does not automatically mean rebuild. Ask: does this card represent a situation the simulation genuinely produces? Is the trigger interesting? Are the choices meaningfully distinct *as concepts*, even if the effects are weak? If yes → re-effect. If the card is thin across the board (text bland, trigger generic, choices indistinct, effects flat) → rebuild.

A useful test: would you author this card from scratch today if it didn't exist, given the current engine surface? If no → rebuild.

---

## 8. Severity tiers for findings

- **CRITICAL.** Card crashes at render or resolution. Card never fires under any playable conditions. Card fires and produces no effect on any choice (wired to empty effect dicts). Blocks release.
- **MAJOR.** Violates substance rule (§2). Text coherence or promise/delivery violation (§4.1–§4.4). Unresolved placeholder visible to player. All choices are clones. Pattern C in a monthly slot. Severity doesn't match magnitude. **Must be fixed before the family is declared green.**
- **MINOR.** Tone mismatch. Missing smart-card placeholder on a cue the body almost takes. Effect magnitude off by a tier. Missing non-defining style tag. **Fixed at time of discovery, not deferred.**
- **POLISH.** Tier 3 smart-card memory clause would fit. Codex entry would help. Could gain an optional follow-up on one choice. **Fixed at time of discovery, not deferred.**

The MINOR/POLISH rule is strict: **don't let these accumulate.** A family is green only when every finding has been addressed. Backlogging MINORs leads to a corpus that's 90% great and 10% always almost-finished.

---

## 9. Family rubrics

Each family has its own specific shape. These rubrics are the family-specific lens applied on top of the general rules.

### 9.1 Decrees
All Pattern A. Have explicit rarity tiers.

- **Defining** must establish a kingdom feature or change policy. Temporary modifier alone insufficient.
- **Rare** must at minimum queue a temporary modifier or trigger a follow-up.
- **Uncommon/Common** may be single-consequence structural.
- Prerequisites (knowledge, state, prior decree) must be coherent with the decree's theme.
- `effectPreview` text (shown on the card) must match the actual effects. Mismatch = **MAJOR**.
- Cooldown and one-time flags (`isOneTime`, `cooldownTurns`) must prevent decree spam for structural-effect decrees.

### 9.2 Crises
Pattern A. Severity gates content: a `Critical` crisis must have stakes that justify the word. If the player "wins" a Critical by picking a choice with only surface effects, the card misnamed itself.

- Every choice must be a genuine crisis response — no "do nothing" choice with the same effect shape as "respond."
- Follow-up likelihood should correlate with choice severity. Picking "ignore the crisis" should have a higher follow-up probability than "address the crisis decisively."
- `affectedRegionId`, `affectedClassId`, `affectedNeighborId` must be used both in text and in effect scope. A crisis with `affectedRegionId: 'region_north_march'` that never mentions the region in body = **MAJOR**.

### 9.3 Petitions
Pattern A. Highest volume in the corpus. Most likely to have stat-only choices. Most likely to need rebuilds.

- A petition's supplicant class (from `affectsClass`) must be named or at least strongly implied in the body. "A delegation of merchants" / "The clergy of the Highland faith" — not "your advisors report."
- Grant/deny symmetry is important: the consequences of denying should be as well-specified as granting. A grant with follow-up but a deny with nothing = deny is a free skip = **MAJOR** (the deny choice has no weight).
- Petitions are where Pattern C most commonly hides. Single-choice petitions = relocate or elevate.
- The petition's existence should respond to state: if the card fires when the supplicant class has high satisfaction, the text should acknowledge that ("emboldened by recent prosperity…").

### 9.4 Assessments
Pattern A, but structured: they present intelligence and ask how the player wants to act. Confidence level is derived from trigger condition count (§bridge/assessmentCardGenerator).

- Body must match confidence tier. Low-confidence assessments should hedge ("rumours suggest…"); high-confidence should be direct ("reliable sources confirm…").
- The neighbor/region/entity being assessed must be named.
- At least one choice must be *about the intelligence itself* — corroborate, share with allies, act on it — not just generic political positioning.

### 9.5 Negotiations
Pattern A, multi-term. Each term is individually audited.

- The neighbor must be named everywhere, not just in one sentence.
- Each term must have a distinct mechanical effect; terms that just stack satisfaction nudges are a failing set.
- The counterparty's posture, economic state, and agenda should be reflected in which terms are offered and at what weighting — this is already supported by the engine but authoring rarely exploits it.
- A negotiation with all surface-effect terms = **MAJOR** even if the flavor is great.

### 9.6 Overtures
Pattern A, agenda-driven. The rival neighbor's current agenda decides which overture fires.

- Every agenda variant must produce an overture that is *thematically* keyed to the agenda — not a generic "{neighbor} proposes something."
- For `RestoreTheOldBorders`: `neighbor.agenda.targetEntityId` must be surfaced as a specific region by name.
- For `DynasticAlliance`: a generated spouse/heir name must appear and carry through if the match produces a marriage bond.
- For `DominateTrade`: the economic stakes (what changes for your merchants) must be concrete.
- Deny path should seed a memory entry on the rival — refusing an overture is a slight that should echo.

### 9.7 Notifications (Pattern B only)
One choice. Card exists to reveal state the player cannot otherwise see. Banned from decision slots — these belong in the seasonal dawn, summary, or World Pulse.

- Text must name the specific state that triggered the notification.
- Every notification should have a destination: dawn text, end-of-season summary, or World Pulse. During the audit, flag its destination.
- Notifications that are *actually* Pattern A in disguise (advisor flaw reveal, mole exposure, bond strain) must be **rebuilt** as Pattern A with real choices.

### 9.8 Hand cards
Each has a custom `apply` function. Per-card code review is required in addition to text review.

- The `apply` function must modify at least one structural state field, not just push satisfaction deltas through `applyMechanicalEffectDelta`.
- Hand cards with `requiresChoice: 'class'` or `requiresChoice: 'rival'` must use the chosen target in a way that would differ if another target were chosen — otherwise the choice is fake.
- Expiry (`expiresAfterTurns`) must match the card's flavor. "Royal Pardon" expiring in 2 turns makes no sense.

---

## 10. Pattern C destinations

When a card is relocated, its destination is tagged during the audit.

| Content type | Destination |
|---|---|
| "Something good happened passively" (festival, good harvest, prosperous season acknowledgement) | Seasonal dawn text or month opening |
| "A system state was reached" (milestone unlocked, condition emerged, order founded, kingdom feature established) | End-of-season summary |
| "Foreign activity observed" (rival did thing, inter-rival agreement signed, distant war flared) | World Pulse |
| "Construction complete / initiative complete / storyline resolved" | End-of-season summary (these are already structural — the acknowledgement is just the celebration beat) |
| "Advisor flaw revealed / mole exposed / bond strained / agent in trouble" | **Rebuild as Pattern A** — these are miscategorized. The reveal itself is a decision point (dismiss / investigate / exploit). Do not relocate. |
| "A minor world-atmospheric tidbit" (weather-colored flavor, seasonal change, cultural note) | Seasonal dawn or World Pulse |

---

## 11. Batching plan

Go deep, family by family. A family is green when every finding is resolved and the automated scans pass for that family's files.

### 11.1 Family order

1. **Decrees** (calibrate here — fewer cards, higher leverage each, stable pool).
2. **Crises** (severity coherence is sharpest here).
3. **Assessments** (smaller pool, intelligence-gated).
4. **Negotiations** (smaller pool, multi-term complexity).
5. **Overtures** (proc-generated; audit per-agenda variant).
6. **Petitions** (largest pool, most rebuilds expected; the big one).
7. **Hand cards** (per-card code review alongside text).
8. Out of main audit (separate pass): storyline beats, world events, court opportunities.

### 11.2 Petition sub-batching

Petitions live in `src/data/events/expansion/` split by subject file. Size-aware batching:

- **Small files** (~5–10 events): batch two together. E.g., `knowledge-events` + `class-conflict-events`.
- **Medium files** (~10–20 events): one file per batch.
- **Large files** (20+ events): split by subcategory within the file. E.g., economy-events split into early-game/crisis-tier/notable-tier sub-batches.

Run the automated stat-only scan first to see which petition files have the worst ratio — prioritize those, since they'll generate the most rebuilds and the most rewrites.

### 11.3 Session size

15–30 cards per focused audit session. Bigger → attention degrades. Smaller → setup overhead dominates. For petition files in the rebuild zone, smaller sessions (10–15) to leave headroom for design work.

### 11.4 What "green" means

- All CRITICAL findings resolved.
- All MAJOR findings resolved.
- All MINOR and POLISH findings resolved at discovery (no backlog).
- Automated scans pass for that family's files.
- Rebuild queue for that family is either empty or has its own tracked work with a design-intent note per card.

---

## 12. The audit produces three artifacts

1. **Findings log.** Per-card outcome (pass/retext/re-effect/rebuild), severity of findings, fix notes.
2. **Migration list.** Pattern C relocations with destination tagged (dawn / summary / pulse / rebuild-as-A).
3. **Rebuild queue.** Cards flagged for full redesign, grouped by trigger category so replacements are coherent (you don't want to rebuild six tax-petition cards one at a time with no shared framing).

---

## 13. Automated pre-pass

Before any family's deep audit starts, a one-time script runs across the whole corpus and produces a priority heatmap. Scans:

- **Missing text entries** (crash risk)
- **Missing effects entries** (silent no-op)
- **Choices with empty effects dicts**
- **Choices with all-surface effects** (the "Subsidize Trade Routes" scan) — flagged with the choice's current delta pattern for review
- **Single-choice cards in the monthly deck** (Pattern C candidates)
- **Placeholder tokens unresolved in templates** (`{raw_token}` patterns after substitution)
- **Follow-up targets that don't exist**
- **Style tags on nonexistent choices**
- **Category-without-touch** (Military category never touches military state, etc.)
- **Severity-magnitude mismatches** (Critical with low total delta, Informational with high total delta)
- **Choice clones** (within-card: two choices with same-shape non-zero delta field sets)
- **Consequence tags referenced by triggers but never produced** (dead gates)
- **Consequence tags produced but never read** (dead tagging — informational, not necessarily fail)

Output: per-family priority count, per-file finding count, per-card finding list. This is *input* to the depth audit, not a substitute for it.

---

## 14. Strong rewrite example — `evt_exp_eco_tax_dispute`

This section is the calibration anchor for every audit pass that produces a re-effect or rebuild. It demonstrates what a petition with proper substance looks like, using an existing card from the corpus. Use this as the reference shape when upgrading other petitions.

### 14.1 The card as it stands today

**Current definition** (`src/data/events/expansion/economy-events.ts`):
```ts
{
  id: 'evt_exp_eco_tax_dispute',
  severity: EventSeverity.Notable,
  category: EventCategory.Economy,
  triggerConditions: [
    { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 55 },
    { type: 'random_chance', probability: 0.3 },
  ],
  weight: 0.9,
  chainId: null,
  chainStep: null,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'enforce_full_collection', slotCost: 1, isFree: false },
    { choiceId: 'grant_partial_amnesty', slotCost: 1, isFree: false },
    { choiceId: 'defer_collection_to_next_season', slotCost: 1, isFree: false },
  ],
  affectsClass: PopulationClass.Commoners,
  affectsRegion: false,
  relatedStorylineId: null,
  phase: 'opening',
},
```

**Current effects** (`economy-effects.ts`):
```ts
evt_exp_eco_tax_dispute: {
  enforce_full_collection:         { treasuryDelta: +35, commonerSatDelta: -4, stabilityDelta: -2, regionConditionDelta: -1 },
  grant_partial_amnesty:           { treasuryDelta: +15, commonerSatDelta: +2, merchantSatDelta: -2, nobilitySatDelta: -1 },
  defer_collection_to_next_season: { treasuryDelta: -10, commonerSatDelta: +1, stabilityDelta: -1 },
},
```

**Current text** (`economy-text.ts`):
```ts
evt_exp_eco_tax_dispute: {
  title: 'Tax Collectors Turned Away',
  body: 'Crown tax collectors have been met with barred doors and angry crowds in the outlying villages. The common folk claim the assessments are unjust and demand relief, while your exchequer insists the levies are lawful and the treasury cannot afford leniency.',
  choices: {
    enforce_full_collection: 'Enforce Full Collection',
    grant_partial_amnesty: 'Grant Partial Amnesty',
    defer_collection_to_next_season: 'Defer to Next Season',
  },
},
```

### 14.2 Audit verdict

- **Pattern:** A (correct).
- **Substance rule:** **FAIL** — all three choices are purely surface. `regionConditionDelta: -1` on `enforce_full_collection` is technically structural but has no identified region (`affectsRegion: false`), so it's a no-op.
- **Text integrity:** Passes — no placeholders, reasonable tone.
- **Smart-card coverage:** **FAIL** — event is class-scoped (`Commoners`) but body says "the outlying villages" and "the common folk" generically. Engine knows which province is most restive, which settlement the collectors were turned from, which neighbor is nearby if the village is border-adjacent — none surfaced.
- **Category coherence:** Borderline — economy category, treasury touched, but the underlying situation is class-conflict and public-order with no social-fabric state change.
- **Choice differentiation:** Weak. Three choices, all with `slotCost: 1`, all differing only in treasury vs. satisfaction trade-off curves. No follow-up, no structural effect, no consequence downstream queries. Effectively "how much treasury for how much satisfaction."
- **Severity coherence:** Notable severity, magnitudes low-notable. Acceptable but unremarkable.

**Disposition: Re-effect + Retext.** Good concept, good trigger, good three-branch shape. Effects need structural depth; text needs smart-card rewriting and class specificity. Not a rebuild.

### 14.3 The rewrite

#### 14.3.1 Definition changes

```ts
{
  id: 'evt_exp_eco_tax_dispute',
  severity: EventSeverity.Notable,
  category: EventCategory.Economy,
  triggerConditions: [
    { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 55 },
    // Added: require a region with elevated tension to scope the card concretely.
    { type: 'any_region_condition_above', conditionField: 'unrest_or_banditry', threshold: 0 },
    { type: 'random_chance', probability: 0.3 },
  ],
  weight: 0.9,
  chainId: null,
  chainStep: null,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'enforce_full_collection',         slotCost: 1, isFree: false },
    { choiceId: 'grant_partial_amnesty',           slotCost: 1, isFree: false },
    { choiceId: 'defer_collection_to_next_season', slotCost: 0, isFree: true  },
  ],
  affectsClass: PopulationClass.Commoners,
  affectsRegion: true,                  // was false — engine now binds to a specific region
  relatedStorylineId: null,
  phase: 'opening',

  // New: follow-up events, one per branch. These are the teeth.
  followUpEvents: [
    { triggerChoiceId: 'enforce_full_collection',         followUpDefinitionId: 'evt_exp_fu_tax_dispute_rebellion',     delayTurns: 3, probability: 0.55 },
    { triggerChoiceId: 'enforce_full_collection',         followUpDefinitionId: 'evt_exp_fu_tax_dispute_exchequer_praise', delayTurns: 2, probability: 0.30 },
    { triggerChoiceId: 'grant_partial_amnesty',           followUpDefinitionId: 'evt_exp_fu_tax_dispute_merchant_grievance', delayTurns: 2, probability: 0.45 },
    { triggerChoiceId: 'defer_collection_to_next_season', followUpDefinitionId: 'evt_exp_fu_tax_dispute_deferred_reckoning', delayTurns: 4, probability: 0.70 },
  ],
},
```

Key changes:
- `affectsRegion: true` — binds the card to a specific region, which the bridge layer resolves to a named province.
- `slotCost: 0, isFree: true` on the defer option — differentiates it mechanically; it's the cheap-to-take, expensive-downstream choice.
- `followUpEvents` on every branch — the card's consequences now flow forward. Each branch seeds at least one follow-up.
- Added `any_region_condition_above` trigger — makes the card's "outlying villages" framing honest by requiring at least one region under stress.

#### 14.3.2 Effects changes

```ts
evt_exp_eco_tax_dispute: {
  // Enforce full collection — aggressive, high short-term revenue, structural stability damage
  enforce_full_collection: {
    treasuryDelta: +35,
    commonerSatDelta: -6,          // deeper than before
    stabilityDelta: -2,
    regionConditionDelta: -2,       // now binds to the affected region
    // Ruling-style nudge authored via EVENT_CHOICE_STYLE_TAGS (see §14.3.4)
  },
  // Grant amnesty — political concession, merchant backlash, class re-alignment
  grant_partial_amnesty: {
    treasuryDelta: +15,
    commonerSatDelta: +3,
    merchantSatDelta: -2,
    nobilitySatDelta: -1,
  },
  // Defer — free now, costly later
  defer_collection_to_next_season: {
    treasuryDelta: -10,
    commonerSatDelta: +1,
    stabilityDelta: -1,
  },
},
```

Add to `EVENT_CHOICE_TEMPORARY_MODIFIERS`:
```ts
evt_exp_eco_tax_dispute: {
  // Enforce collection levies ongoing resentment for 3 turns.
  enforce_full_collection: {
    durationTurns: 3,
    effectPerTurn: { commonerSatDelta: -1, stabilityDelta: -1 },
  },
  // Amnesty is a political gesture; merchant confidence erodes for 4 turns
  // as they see the crown selectively forgiving debts.
  grant_partial_amnesty: {
    durationTurns: 4,
    effectPerTurn: { merchantSatDelta: -1 },
  },
  // Deferral lets the treasury hemorrhage while promising a future
  // reckoning. Treasury drains 8/turn for 4 turns.
  defer_collection_to_next_season: {
    durationTurns: 4,
    effectPerTurn: { treasuryDelta: -8 },
  },
},
```

Add to `KINGDOM_FEATURE_REGISTRY` (only the enforce path has a kingdom-level structural consequence when outcome is poor):
```ts
// Authored to match the consequence tag `evt_exp_eco_tax_dispute:enforce_full_collection`
// when paired with a follow-up that establishes a "strict levy regime."
// Created by the follow-up's resolution, not this event directly — see §14.3.3.
```

(Note: kingdom features on primary-event choices should be rare — they represent permanent shifts. For a Notable-severity card, it's more realistic for the feature to emerge via the follow-up chain when the player persists in a path. That's why the feature entry above lives on a follow-up, not on this event directly.)

Add to `EVENT_CHOICE_STYLE_TAGS`:
```ts
evt_exp_eco_tax_dispute: {
  enforce_full_collection: { Authority: +2, Economy: +1 },
  grant_partial_amnesty: { Authority: -1, Economy: -1 },
  defer_collection_to_next_season: { Authority: -1 },
},
```

#### 14.3.3 Follow-up events (the substance)

Four new follow-up definitions. These are the part that makes the original card's choices *mean* something. Each follow-up is itself a Pattern A card with its own effects table and text entry — they are not Pattern B reveals, they are cascading decisions.

**Follow-up 1: `evt_exp_fu_tax_dispute_rebellion`** (fires 3 turns after `enforce_full_collection`, 55% probability)

```ts
{
  id: 'evt_exp_fu_tax_dispute_rebellion',
  severity: EventSeverity.Serious,
  category: EventCategory.PublicOrder,
  triggerConditions: [],   // gated only by the scheduled delay + probability
  weight: 0,               // pool weight irrelevant for follow-ups
  chainId: 'chain_tax_dispute',
  chainStep: 2,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'crush_the_uprising',      slotCost: 1, isFree: false },
    { choiceId: 'negotiate_with_rebels',   slotCost: 1, isFree: false },
    { choiceId: 'pardon_and_restructure',  slotCost: 1, isFree: false },
  ],
  affectsClass: PopulationClass.Commoners,
  affectsRegion: true,
  relatedStorylineId: null,
  phase: 'developing',
  followUpEvents: [
    { triggerChoiceId: 'crush_the_uprising',     followUpDefinitionId: 'evt_exp_fu_iron_fist_reign',    delayTurns: 3, probability: 0.50 },
    { triggerChoiceId: 'pardon_and_restructure', followUpDefinitionId: 'evt_exp_fu_reform_reputation',  delayTurns: 4, probability: 0.60 },
  ],
}
```

Effects:
```ts
evt_exp_fu_tax_dispute_rebellion: {
  crush_the_uprising:     { treasuryDelta: -30, militaryMoraleDelta: +2, commonerSatDelta: -10, stabilityDelta: -4, regionConditionDelta: -3 },
  negotiate_with_rebels:  { treasuryDelta: -15, commonerSatDelta: +5, nobilitySatDelta: -3, stabilityDelta: +2 },
  pardon_and_restructure: { treasuryDelta: -20, commonerSatDelta: +7, merchantSatDelta: -2, stabilityDelta: +1, regionConditionDelta: +2 },
},
```

Kingdom feature registration for the terminal paths:
```ts
'event:evt_exp_fu_tax_dispute_rebellion:crush_the_uprising': {
  featureId: 'feature_pacified_province',
  title: 'Pacified Province',
  description: 'A region holds its peace through fear of the crown. Stability steady; commoner satisfaction slowly erodes.',
  category: 'military',
  ongoingEffect: { stabilityDelta: +1, commonerSatDelta: -1 },
},
'event:evt_exp_fu_tax_dispute_rebellion:pardon_and_restructure': {
  featureId: 'feature_restructured_levies',
  title: 'Restructured Levies',
  description: 'Tax collection has been reformed after the upheaval. Commoners bear lighter burdens; treasury yields less but steadier.',
  category: 'economic',
  ongoingEffect: { commonerSatDelta: +1, treasuryDelta: -2 },
},
```

Text:
```ts
evt_exp_fu_tax_dispute_rebellion: {
  title: 'Open Rebellion in {region}',
  body: 'The reckoning you forced on {region} has come due. Tax collectors have been driven out at pitchfork and scythe, and the reeve of {settlement} sends word that the commons have declared for a self-styled "Council of Assessed." Your {marshal_or_fallback} readies the garrison. {prior_decision_clause:tax}',
  choices: {
    crush_the_uprising:     'Crush the Uprising',
    negotiate_with_rebels:  'Negotiate with the Council',
    pardon_and_restructure: 'Pardon the Leaders; Restructure the Levies',
  },
},
```

**Follow-up 2: `evt_exp_fu_tax_dispute_exchequer_praise`** (fires 2 turns after `enforce_full_collection`, 30% probability — the "good roll" branch where enforcement works)

```ts
{
  id: 'evt_exp_fu_tax_dispute_exchequer_praise',
  severity: EventSeverity.Informational,
  category: EventCategory.Economy,
  triggerConditions: [],
  weight: 0,
  chainId: 'chain_tax_dispute',
  chainStep: 2,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'formalize_the_collection_regime', slotCost: 1, isFree: false },
    { choiceId: 'accept_the_windfall_quietly',     slotCost: 0, isFree: true  },
  ],
  affectsClass: PopulationClass.Nobility,
  affectsRegion: false,
  relatedStorylineId: null,
  phase: 'developing',
},
```

Effects:
```ts
evt_exp_fu_tax_dispute_exchequer_praise: {
  formalize_the_collection_regime: { treasuryDelta: +15, nobilitySatDelta: +2, commonerSatDelta: -3 },
  accept_the_windfall_quietly:     { treasuryDelta: +8 },
},
```

Kingdom feature for `formalize`:
```ts
'event:evt_exp_fu_tax_dispute_exchequer_praise:formalize_the_collection_regime': {
  featureId: 'feature_strict_levy_regime',
  title: 'Strict Levy Regime',
  description: 'Tax collection is rigorous and relentless. Treasury gains steady revenue; commoner satisfaction bears the weight.',
  category: 'economic',
  ongoingEffect: { treasuryDelta: +3, commonerSatDelta: -1 },
},
```

Text:
```ts
evt_exp_fu_tax_dispute_exchequer_praise: {
  title: 'The Exchequer\'s Report',
  body: '{chancellor_or_fallback} presents the quarter\'s returns with quiet satisfaction: collection in {region} exceeded projections. The hard line held. {They} suggests codifying the approach as standing policy — a permanent regime of firm assessment — or letting the moment pass without fanfare.',
  choices: {
    formalize_the_collection_regime: 'Codify the Strict Regime',
    accept_the_windfall_quietly:     'Accept the Windfall Quietly',
  },
},
```

**Follow-up 3: `evt_exp_fu_tax_dispute_merchant_grievance`** (fires 2 turns after `grant_partial_amnesty`, 45% probability)

```ts
{
  id: 'evt_exp_fu_tax_dispute_merchant_grievance',
  severity: EventSeverity.Notable,
  category: EventCategory.Economy,
  triggerConditions: [],
  weight: 0,
  chainId: 'chain_tax_dispute',
  chainStep: 2,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'guild_concession',      slotCost: 1, isFree: false },
    { choiceId: 'reassert_equal_duty',   slotCost: 1, isFree: false },
    { choiceId: 'private_assurances',    slotCost: 0, isFree: true  },
  ],
  affectsClass: PopulationClass.Merchants,
  affectsRegion: false,
  relatedStorylineId: null,
  phase: 'developing',
},
```

Effects:
```ts
evt_exp_fu_tax_dispute_merchant_grievance: {
  guild_concession:    { treasuryDelta: -15, merchantSatDelta: +4, commonerSatDelta: -2 },
  reassert_equal_duty: { treasuryDelta: +10, merchantSatDelta: -4, stabilityDelta: -1, commonerSatDelta: +1 },
  private_assurances:  { merchantSatDelta: +1 },
},
```

Temporary modifier for `private_assurances` (the "kick the can" option carries hidden cost — merchants feel strung along):
```ts
evt_exp_fu_tax_dispute_merchant_grievance: {
  private_assurances: {
    durationTurns: 3,
    effectPerTurn: { merchantSatDelta: -1 },
  },
},
```

Text:
```ts
evt_exp_fu_tax_dispute_merchant_grievance: {
  title: '{dynasty}\'s Merchants Press the Throne',
  body: 'A delegation of {capital}\'s merchant guilds seeks audience. They note — politely, at first — that the crown\'s recent amnesty for common debtors came at no parallel relief for their own tax liabilities. They ask what the crown intends. {chamberlain_or_fallback} observes that the guilds arrived together, which is unusual.',
  choices: {
    guild_concession:    'Offer the Guilds a Parallel Concession',
    reassert_equal_duty: 'Reassert the Duties of All Classes',
    private_assurances:  'Offer Private Assurances',
  },
},
```

**Follow-up 4: `evt_exp_fu_tax_dispute_deferred_reckoning`** (fires 4 turns after `defer_collection_to_next_season`, 70% probability — the deferred cost comes due)

```ts
{
  id: 'evt_exp_fu_tax_dispute_deferred_reckoning',
  severity: EventSeverity.Serious,
  category: EventCategory.Economy,
  triggerConditions: [],
  weight: 0,
  chainId: 'chain_tax_dispute',
  chainStep: 2,
  chainNextDefinitionId: null,
  choices: [
    { choiceId: 'double_season_levy',     slotCost: 1, isFree: false },
    { choiceId: 'forgive_the_arrears',    slotCost: 1, isFree: false },
    { choiceId: 'sell_crown_holdings',    slotCost: 1, isFree: false },
  ],
  affectsClass: PopulationClass.Commoners,
  affectsRegion: true,
  relatedStorylineId: null,
  phase: 'developing',
  followUpEvents: [
    { triggerChoiceId: 'double_season_levy', followUpDefinitionId: 'evt_exp_fu_tax_dispute_rebellion', delayTurns: 3, probability: 0.65 },
  ],
},
```

Effects:
```ts
evt_exp_fu_tax_dispute_deferred_reckoning: {
  double_season_levy:  { treasuryDelta: +40, commonerSatDelta: -8, stabilityDelta: -3, regionConditionDelta: -2 },
  forgive_the_arrears: { treasuryDelta: -30, commonerSatDelta: +5, nobilitySatDelta: -3 },
  sell_crown_holdings: { treasuryDelta: +25, nobilitySatDelta: -4 },
},
```

Kingdom feature for `sell_crown_holdings` — this is a **permanent** revenue reduction:
```ts
'event:evt_exp_fu_tax_dispute_deferred_reckoning:sell_crown_holdings': {
  featureId: 'feature_diminished_crown_lands',
  title: 'Diminished Crown Lands',
  description: 'Hereditary crown holdings were sold off to cover deferred revenue. Treasury income is permanently reduced.',
  category: 'economic',
  ongoingEffect: { treasuryDelta: -2 },
},
```

Text:
```ts
evt_exp_fu_tax_dispute_deferred_reckoning: {
  title: 'The Deferred Reckoning',
  body: 'The season you promised to settle the {region} levies has arrived. {chancellor_or_fallback} is direct: the treasury has bled through the delay, and the hole is now twice the size it was. Three paths present themselves, and the choice cannot be deferred again.',
  choices: {
    double_season_levy:  'Collect Both Seasons at Once',
    forgive_the_arrears: 'Forgive the Arrears Entirely',
    sell_crown_holdings: 'Sell Hereditary Crown Holdings',
  },
},
```

#### 14.3.4 Primary card text rewrite (Tier 3 smart-card)

```ts
evt_exp_eco_tax_dispute: {
  title: 'Crown Collectors Turned Away in {region}',
  body: 'Word arrives from the reeve of {settlement}: crown tax collectors have been met with barred doors and angry crowds in the {terrain} villages of {region}. The assessments are called unjust by commoners already weighing {condition_context}, while {chancellor_or_fallback} insists the levies are lawful and that the treasury cannot afford leniency. {prior_decision_clause:tax}',
  choices: {
    enforce_full_collection:         'Enforce Full Collection',
    grant_partial_amnesty:           'Grant Partial Amnesty',
    defer_collection_to_next_season: 'Defer to Next Season',
  },
},
```

Token usage:
- `{region}` — from `affectsRegion: true` binding; engine resolves the stressed region the trigger matched.
- `{settlement}` — pick a representative settlement within `{region}` (the largest non-capital market or the regional seat).
- `{terrain}` — the region's `terrainType`, giving flavor.
- `{condition_context}` — the region's active conditions, e.g., "a persistent drought" or "a slow-growing banditry." The trigger required a condition, so this clause always resolves.
- `{chancellor_or_fallback}` — named chancellor if seated, "your chancellor" otherwise.
- `{prior_decision_clause:tax}` — if the player has made a recent tax-related decision in the last 8 turns, a short clause appears ("— echoes of the levy reforms two seasons past"); otherwise the token resolves to empty.

### 14.4 What the rewrite accomplishes

Before the rewrite, the card resolves in a single turn. After, it opens a four-turn-minimum narrative with real stakes on every branch:

- **Enforce** branches into either crushing rebellion (permanent feature: Pacified Province) or codified strict regime (permanent feature: Strict Levy Regime) — both are long-term commitments.
- **Amnesty** triggers a merchant counter-grievance 45% of the time — the class-conflict dimension the original card hinted at is now mechanically real.
- **Defer** is now the "cheap today, expensive tomorrow" trap — 70% chance of a serious follow-up in 4 turns, which itself can cascade into rebellion if the player doubles down.

Every primary choice now has:
- Surface effects (unchanged, for immediate feedback)
- Temporary modifier (ongoing pressure for 3–4 turns)
- Ruling-style axis nudge
- At least one potential follow-up (substantive structural cascade)
- For certain terminal paths, a permanent kingdom feature

Text-wise, the card names the specific region, settlement, terrain, the chancellor, the region's active conditions, and any recent tax-related decisions. The player reads text that sounds like the game knows what's happening because it does.

### 14.5 Audit findings after rewrite

Running this same card through the rules again:
- Pattern: A ✓
- Substance rule: pass on all three choices ✓
- Text integrity: pass (placeholders all resolve; fallback-clean) ✓
- Smart-card coverage: pass (region, settlement, terrain, chancellor, conditions, prior decisions all referenced) ✓
- Category coherence: pass (economy touched; class-conflict surfaced through secondary class deltas) ✓
- Choice differentiation: pass (each choice has distinct follow-up, style tag, temp modifier, and cost structure) ✓
- Severity coherence: pass (total magnitude still Notable; follow-ups escalate appropriately) ✓
- Trigger coherence: pass (added condition-above trigger ensures `{condition_context}` always resolves honestly) ✓

New files touched: 1 definition, 1 effects entry + 3 temp modifiers added, 1 text entry rewritten, 4 new follow-up definitions, 4 new follow-up effects entries, 4 new follow-up text entries, 3 new kingdom feature registry entries, 1 style-tag entry.

**Engine code changes: zero.** Everything above lives in the data layer. The existing wiring in `apply-action-effects.ts` already auto-creates features from `KINGDOM_FEATURE_REGISTRY[event:id:choice]` tags and auto-queues modifiers from `EVENT_CHOICE_TEMPORARY_MODIFIERS`. The follow-up chain flows through `pendingFollowUps` which the engine already processes.

This is the shape every re-effect audit outcome should produce. Not every card needs four follow-ups — defining tier might, common tier needs one. But the pattern of *definition + effects + style tags + temp modifiers + follow-ups + feature registry + smart text* is the template.

---

## 15. Ongoing discipline

- Audit a batch. Fix everything found at every severity. Run scans. Mark the family green.
- Don't let MINORs or POLISH findings accumulate. The pile doesn't shrink on its own.
- Rebuild queue is shared across families and addressed in design-coherent groups (don't rebuild six tax cards one at a time with no shared framing).
- Every rebuild uses §14 as the shape guide.
- The smart-card token vocabulary (`SMART_CARD_ENGINE_SURFACE.md` §3) is the authoring vocabulary. Every retext uses it; every rebuild uses it.

---

*End of reference.*
