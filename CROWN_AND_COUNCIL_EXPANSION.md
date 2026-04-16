# Crown & Council — Fifteen-Phase Expansion

**Status:** Design Locked  
**Scope:** Foundational expansion across rival simulation, card system, kingdom control, world depth, and endgame  
**Compatibility:** All 15 phases preserve existing save format with migration shims; each phase leaves the game fully playable

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Architectural Strategy](#architectural-strategy)
3. [Phase 1 — Procedural Naming System](#phase-1--procedural-naming-system)
4. [Phase 2 — Rival Kingdom Simulation Core](#phase-2--rival-kingdom-simulation-core)
5. [Phase 3 — Rival Agendas & Memory](#phase-3--rival-agendas--memory)
6. [Phase 4 — Unified Card Schema](#phase-4--unified-card-schema)
7. [Phase 5 — Hand & Draft Mechanics](#phase-5--hand--draft-mechanics)
8. [Phase 6 — Card Combos & Synergies](#phase-6--card-combos--synergies)
9. [Phase 7 — Card Content Expansion (80+ Cards)](#phase-7--card-content-expansion-80-cards)
10. [Phase 8 — Council & Advisor System](#phase-8--council--advisor-system)
11. [Phase 9 — Regional Governance Stances](#phase-9--regional-governance-stances)
12. [Phase 10 — Long-Term Initiatives](#phase-10--long-term-initiatives)
13. [Phase 11 — Inter-Kingdom Diplomacy](#phase-11--inter-kingdom-diplomacy)
14. [Phase 12 — Dynamic World Events](#phase-12--dynamic-world-events)
15. [Phase 13 — Diplomacy Overhaul](#phase-13--diplomacy-overhaul)
16. [Phase 14 — Intelligence Network Depth](#phase-14--intelligence-network-depth)
17. [Phase 15 — Victory Conditions & Legacy](#phase-15--victory-conditions--legacy)
18. [Cross-Cutting Concerns](#cross-cutting-concerns)

---

## Design Principles

These principles bind every phase. Any change that violates one of them is rejected, even if functionally correct.

**1. Internal IDs are forever; display strings are disposable.** Every entity in the engine — neighbors, regions, dynasties, advisors, agents — has a stable internal ID that never changes after creation. All display text is derived from runtime state at render time. This keeps event effects, persistent consequences, save migrations, and tests stable while everything visible can be procedurally generated.

**2. The card is the unit of player attention.** Every meaningful decision surfaces as a card. New systems do not introduce new screens, modals, or navigation depth. They surface as new card families, new card content, new context lines on existing cards, or new resolution behaviors driven by card choices.

**3. Depth via set-and-forget, not micro.** New control comes from infrequent high-leverage choices (appoint an advisor, set a regional posture, commit to a multi-season initiative) whose consequences play out automatically through existing card flows. The player should never feel they need to revisit a control panel each turn.

**4. Each phase is shippable.** Every phase ends with the game playable, tests passing, and no half-implemented features visible to the player. Scaffolding for later phases is hidden behind feature flags or stub implementations until those phases ship.

**5. Save compatibility is non-negotiable.** Every new field on `GameState` lands with a migration shim in `LOAD_SAVE`. Tests cover loading a pre-expansion save and verify the game continues without errors.

**6. The rival simulation must be legible.** Players cannot directly observe rival kingdom internals. But every visible rival behavior must be downstream of a real underlying state — never a coin flip painted with flavor text. Intelligence operations exist precisely to surface this hidden state at a cost.

---

## Architectural Strategy

### The neighbor naming problem

The codebase has ~30+ files referencing neighbor IDs as string literals (`'neighbor_arenthal'`, `'neighbor_valdris'`, `'neighbor_krath'`). Event effect tables, tests, text labels, dossier templates, and chronicle templates all key off these strings. A naive randomization breaks all of them.

**Solution:** Keep the internal IDs stable across all scenarios and event content. Add `displayName`, `rulerName`, `dynastyName`, and `epithet` fields to `NeighborState`, populated at scenario creation time from a procedural generator seeded by `(scenarioId, neighborId, runSeed)`. Update every `NEIGHBOR_LABELS[id] ?? id` lookup to prefer the live state name when available and fall back to the static map.

The static `NEIGHBOR_LABELS` map remains as a final fallback for any code path that doesn't have neighbor state in scope (and for backward-compat with older saves that don't have the fields populated).

### The card overhaul problem

The current card system has six generators (`crisisCardGenerator`, `petitionCardGenerator`, `decreeCardGenerator`, `negotiationCardGenerator`, `assessmentCardGenerator`, `advisorGenerator`) each producing their own card data shape. They share a `CardDefinition` interface but in practice each phase consumes its specific data shape (`CrisisPhaseData`, `PetitionCardData`, etc.).

**Solution:** Introduce a unified `Card` schema with a discriminated union over `family`, plus a shared metadata envelope (cost, rarity, tags, prerequisites, conditional effects). Existing per-family data shapes become payloads inside this envelope. Generators produce `Card` instances; phase components consume them via family-typed accessors. This lands in Phase 4 and is the foundation for combos (Phase 6) and hand mechanics (Phase 5).

### The rival simulation problem

Currently neighbors have rich-looking state (military strength, war weariness, espionage capability) but most fields are static or only updated reactively to player actions. There's no real internal economy.

**Solution:** Add a `RivalKingdomState` interface attached to each `NeighborState` containing a parallel-but-simpler simulation: treasury, food security, stability, internal pressure axes, current agenda, and a list of recent self-actions. A new engine system `rival-simulation.ts` ticks each rival every turn through a lightweight pipeline (~10% the cost of player simulation since it doesn't need event/storyline machinery). This produces emergent rival behaviors: a rival with stable economy and strong military starts demanding tribute; a rival in famine will accept lopsided trades; a rival in civil unrest is vulnerable to opportunistic strikes.

### The kingdom-control problem

Adding more control normally means more screens, more buttons, more decisions per turn — which kills mobile UX. The expansion introduces three control surfaces, each with the property that the player touches them rarely (every few seasons at most) but their effects ripple through every turn:

- **Council appointments** (Phase 8): pick 4 advisors from candidates, each modifies how a card family resolves
- **Regional postures** (Phase 9): set a single posture per region (Develop / Extract / Garrison / Pacify / Autonomy), changes regional event distribution and resource flow
- **Long-term initiatives** (Phase 10): commit to one multi-season directive, generates themed cards and modifies pressure accumulators

All three integrate with the existing card system rather than spawning new UI surfaces.

---

## Phase 1 — Procedural Naming System

### Goal

Replace the three hand-picked neighbor names with procedurally generated kingdom names, ruler names, dynasty names, and ruler epithets, while preserving every internal ID. Establish the naming infrastructure that later phases (especially Phase 11's inter-kingdom diplomacy) will reuse.

### What gets added

**New file: `src/data/text/name-generation.ts`** — Procedural name generators with deterministic seeding. Six generators:

- `generateKingdomName(seed)` — produces names like "Kingdom of Velthorne," "The Ostmark," "Caelnir Dominion," "Free Cities of Pellanth"
- `generateRulerName(seed, gender, culture)` — produces names like "King Hadric IV," "Empress Selivane," "High Lord Bran of Coldwater"
- `generateDynastyName(seed, culture)` — surname-style names like "House Marrowmoor," "the Hollowsong line," "Clan Arnvik"
- `generateEpithet(seed, personality)` — "the Iron-Handed," "the Patient," "the Gilded," "the Devout"
- `generateRegionName(seed, terrain)` — for Phase 9's region renaming (Plains → "the Cornlands," Mountain → "the Greyhorn Reach")
- `generateAgentCodename(seed)` — for Phase 14's named agents ("the Magpie," "Black Owl," "Silver Hand")

Each generator is a pure function from seed to name. Seeding strategy: hash of `(scenarioId, entityId, runSeed)` where `runSeed` is set once at game creation. This makes runs reproducible — same scenario + same runSeed → same names.

**Word banks:** Each generator pulls from curated word banks (prefixes, roots, suffixes) with culture-specific filtering. Highland culture pulls harsher consonants ("Vald," "Karth," "Brun"); coastal culture pulls flowing vowels ("Elen," "Thala," "Nereth"); reformed faith pulls austere roots ("Cinder," "Stark," "Plain"); orthodox pulls reverent ones ("Saintsmark," "Aurelia," "Holy").

**New fields on `NeighborState`:**

```typescript
interface NeighborState {
  // ... existing fields
  displayName: string;        // "Kingdom of Velthorne"
  rulerName: string;          // "King Hadric IV"
  rulerTitle: string;         // "King" (for grammar in templates)
  dynastyName: string;        // "House Marrowmoor"
  epithet: string | null;     // "the Iron-Handed" (assigned after rival earns it via behavior)
  capitalName: string;        // "Velthorne" (the capital city, used in storylines)
  runSeed: string;            // for downstream procedural content keyed to this rival
}
```

### What doesn't change

- All internal IDs (`neighbor_arenthal`, `neighbor_valdris`, `neighbor_krath`) remain unchanged
- All event effect tables continue to use these IDs
- All tests continue to use these IDs
- All static `NEIGHBOR_LABELS` entries are preserved as the final fallback
- Save file schema gains optional fields with migration defaults

### Display resolution

Add a single helper `getNeighborDisplayName(neighborId, state)` to `src/bridge/contextExtractor.ts` (or a new `src/bridge/nameResolver.ts`). All ~30 existing call sites switch to it. The helper:

1. Tries `state.diplomacy.neighbors.find(n => n.id === neighborId)?.displayName`
2. Falls back to `NEIGHBOR_LABELS[neighborId]`
3. Falls back to the raw ID

Three other helpers follow the same pattern: `getRulerName`, `getDynastyName`, `getCapitalName`.

### Acceptance criteria

- New game with same scenario + same runSeed produces identical names twice
- New game with different runSeed produces different names
- Old save loads cleanly, neighbors display their hand-authored names (from `NEIGHBOR_LABELS`)
- All existing tests pass without modification
- A new test verifies the same `(scenarioId, neighborId, runSeed)` triple produces the same name across calls

### Files touched

- New: `src/data/text/name-generation.ts`, `src/data/text/word-banks.ts`, `src/bridge/nameResolver.ts`
- Modified: `src/engine/types.ts` (add fields), `src/data/scenarios/*.ts` (call generators in scenario creation), `src/context/game-context.tsx` (migration in `LOAD_SAVE`), all bridge files using `NEIGHBOR_LABELS` (switch to `getNeighborDisplayName`)
- New tests: `src/__tests__/name-generation.test.ts`

---

## Phase 2 — Rival Kingdom Simulation Core

### Goal

Each rival kingdom runs a simplified internal simulation each turn. Their visible behaviors (war declarations, trade offers, military buildups) become downstream consequences of real underlying state rather than scripted reactions to player actions.

### What gets added

**New interface `RivalKingdomState`** attached to each `NeighborState`:

```typescript
interface RivalKingdomState {
  // Economy
  treasuryHealth: number;        // 0-100, abstract
  treasuryTrend: 'rising' | 'stable' | 'declining';
  
  // Subsistence
  foodSecurity: number;          // 0-100
  foodTrend: 'rising' | 'stable' | 'declining';
  
  // Internal
  internalStability: number;     // 0-100, mirrors player stability
  populationMood: number;        // 0-100, like a single combined satisfaction score
  
  // Pressures (drivers of behavior)
  expansionistPressure: number;  // 0-100, drives demands and aggression
  mercantilePressure: number;    // 0-100, drives trade proposals
  pietisticPressure: number;     // 0-100, drives religious actions
  
  // Recent self-actions (for narrative legibility through intelligence)
  recentInternalEvents: RivalInternalEvent[];  // last 8, e.g. "Famine in southern provinces", "Coup attempt suppressed"
  
  // Crisis flags
  isInCrisis: boolean;            // composite: stability < 30 OR food < 30 OR treasury < 20
  crisisType: RivalCrisisType | null;
}

enum RivalCrisisType {
  Famine = 'Famine',
  Insolvency = 'Insolvency',
  CivilUnrest = 'CivilUnrest',
  SuccessionStruggle = 'SuccessionStruggle',
  Plague = 'Plague',
  ReligiousSchism = 'ReligiousSchism',
}
```

**New engine system `src/engine/systems/rival-simulation.ts`** — Pure functions:

- `tickRivalKingdom(rival, world, rng) → updated rival state`  
  Updates treasury, food, stability based on disposition + trends + random shocks. Cheaper than player simulation (no events, no storylines, no decree pool, no construction queue). Roughly 5-10ms per rival per turn.

- `evaluateRivalCrisisEmergence(rival, rng) → RivalCrisisType | null`  
  Procs occasional crises that ripple into player-visible behaviors (a rival in famine will accept worse trade terms; a rival with succession struggle will be diplomatically paralyzed for 2-3 turns).

- `computeRivalActionPressure(rival) → ActionPressureScores`  
  Each rival action type (war declaration, trade proposal, demand, etc.) gets a pressure score from the rival's internal state. The existing `evaluateNeighborActions` function in `diplomacy.ts` is rewritten to consult these pressure scores instead of using raw thresholds.

### Where the simulation runs

In `src/engine/resolution/turn-resolution.ts`, immediately after the existing diplomacy AI tick, call `tickRivalKingdom` for each neighbor. Order: rival simulation → existing `evaluateNeighborActions` → existing relationship score updates. This keeps existing logic intact while routing it through richer inputs.

### What this enables (and player-visible effects)

- Aggressive rivals with strong economies start demanding tribute earlier
- Rivals in famine will accept lopsided trade deals (the deal looks "too good to be true" — that's because their kitchens are empty)
- Rivals in civil unrest stop initiating diplomatic actions for several turns (their diplomats are at home dealing with riots)
- Rivals build up militarily over multiple turns before declaring war (no more sudden out-of-nowhere declarations)
- Intelligence operations now have much richer findings to surface

### Intelligence integration

`generateIntelligenceReport` in the espionage system gets new finding types:

- `rival_treasury_strain` — surfaces low treasury health
- `rival_food_shortage` — surfaces low food security
- `rival_internal_unrest` — surfaces low population mood
- `rival_expansionist_intent` — surfaces high expansionist pressure
- `rival_succession_concern` — surfaces succession crisis

These become actionable: a player who knows a rival is in food crisis can offer aid (relationship boost) or refuse trade (force a worse internal state).

### What doesn't change

- Player simulation untouched
- Existing diplomacy AI logic preserved as a fallback path (called only if `RivalKingdomState` is absent on a neighbor — for save migration)
- Player-facing UI — rival simulation is invisible until intelligence surfaces it

### Acceptance criteria

- Each rival has a `RivalKingdomState` populated at scenario creation
- Running 50 simulated turns produces variation in rival economies (not all identical)
- A rival in famine triggers a surfaced "favorable trade" intelligence finding within ~3 turns of crisis onset
- War declarations correlate with rising expansionistPressure over multiple turns
- Pre-expansion saves load and migrate cleanly (rivals get default `RivalKingdomState` on load)

### Files touched

- Modified: `src/engine/types.ts` (add `RivalKingdomState`, `RivalInternalEvent`, `RivalCrisisType`)
- New: `src/engine/systems/rival-simulation.ts`
- Modified: `src/engine/systems/diplomacy.ts` (`evaluateNeighborActions` reads pressure scores)
- Modified: `src/engine/resolution/turn-resolution.ts` (insert rival tick)
- Modified: `src/engine/systems/espionage.ts` (new finding types)
- Modified: `src/data/scenarios/*.ts` (initial rival state per scenario)
- Modified: `src/context/game-context.tsx` (migration shim)
- New tests: `src/__tests__/rival-simulation.test.ts`

---

## Phase 3 — Rival Agendas & Memory

### Goal

Rivals have evolving long-term goals and remember player actions. A rival who was wronged three years ago acts differently than one who's been treated well. Agendas drive multi-turn behavior arcs that feel like character.

### What gets added

**Rival agendas** — Each rival has an active `agenda` (one of ~12) that drives long-term behavior. Agendas shift over years, not turns. Examples:

- `RestoreTheOldBorders` — wants to reclaim a specific region (sets target region, accumulates aggression toward whichever kingdom holds it)
- `DominateTrade` — focuses on trade agreements, opposes rivals' trade partnerships
- `ReligiousHegemony` — pressures faith conformity, sponsors religious dissent abroad
- `DefensiveConsolidation` — builds walls, refuses entanglements, pure defensive posture
- `DynasticAlliance` — seeks royal marriages, trades favors for friendship
- `BleedTheRivals` — funds internal opposition, opposes player success regardless of relationship score

Each agenda has: target conditions (who/what), tactics (which actions it prefers), satisfaction triggers (when does it flip to a new agenda).

**Rival memory** — `RivalMemoryEntry[]`:

```typescript
interface RivalMemoryEntry {
  turnRecorded: number;
  type: 'slight' | 'favor' | 'breach' | 'demonstration';
  source: string;          // event/action ID that caused it
  weight: number;          // -100 to +100, decays slowly over many turns
  context: string;         // internal code, e.g. 'refused_aid_during_famine'
}
```

Memory weights decay 5% per year. Some memories (`'breach'`) decay much slower — a treaty broken once is remembered for decades. Memory weights modify the rival's relationship score drift each turn (small per-turn impact, large cumulative impact).

### Player-visible effects

- The dossier card (already exists) gains a "Disposition Toward You" line that draws on memory: "Hostile after the Coldwater Incident", "Grateful for famine aid", "Wary since the broken treaty"
- Spymaster assessments gain agenda-aware lines: "They appear focused on reclaiming the eastern marches" or "Their court is consumed with religious unification"
- World pulse lines occasionally surface agenda hints: "Velthorne sends emissaries to the southern kingdoms — purpose unknown"

### Player interaction

A new card family enters the rotation: **Diplomatic Overture** cards. These are generated when a rival's agenda creates an opening for the player:

- A rival pursuing `DynasticAlliance` may generate a marriage-proposal card
- A rival pursuing `RestoreTheOldBorders` may generate a card offering joint action against the holder
- A rival pursuing `BleedTheRivals` toward you may generate a "secretly fund internal opposition" warning when intelligence detects it

### What doesn't change

- Phase 2's `RivalKingdomState` is unchanged, agendas sit alongside it
- Existing relationship score / posture system continues to work as before
- Memory has no effect if the field is empty (so save migration is trivial)

### Acceptance criteria

- Each rival has an agenda assigned at scenario creation
- Agendas shift over a 50-turn simulated game (not all stay static)
- Refusing aid to a rival in famine writes a `'slight'` memory with weight ~−40
- Memory weights decay over time
- Spymaster assessments include agenda-aware lines
- Diplomatic Overture cards appear when conditions are met

### Files touched

- Modified: `src/engine/types.ts` (add `RivalAgenda`, `RivalMemoryEntry`, fields on `NeighborState`)
- New: `src/engine/systems/rival-agendas.ts`
- New: `src/engine/systems/rival-memory.ts`
- Modified: `src/engine/systems/diplomacy.ts`, `src/engine/systems/rival-simulation.ts`
- Modified: `src/bridge/dossierCompiler.ts`, `src/data/text/dossier-templates.ts`
- New: `src/bridge/diplomaticOvertureGenerator.ts`
- Modified: `src/bridge/cardDistributor.ts` (route overture cards into appropriate months)

---

## Phase 4 — Unified Card Schema

### Goal

Replace the family-specific card data shapes with a single discriminated `Card` type that all generators produce and all consumers read. This is the foundation for hand mechanics (Phase 5) and combos (Phase 6).

### What gets added

**New unified type:**

```typescript
type CardId = string;  // unique per generated card instance

interface CardBase {
  id: CardId;
  family: CardFamily;
  title: string;
  body: string;
  
  // Cost & impact
  slotCost: number;
  effortCost: EffortTier;          // Light / Standard / Heavy / Crushing
  rarity: CardRarity;              // Common / Uncommon / Rare / Defining
  
  // Tags drive combos, prerequisites, hand mechanics
  tags: CardTag[];                 // ['military', 'aggressive', 'border', ...]
  
  // Conditional rendering / availability
  prerequisites: CardPrerequisite[];
  
  // Display
  effects: EffectHint[];
  context: ContextLine[];
  signals?: SignalTag[];
  
  // Combo system (Phase 6)
  comboKeys?: string[];            // e.g. ['border_fortification', 'military_buildup']
  
  // Hand mechanics (Phase 5)
  hand: CardHandBehavior;          // 'instant' | 'banked' | 'persistent'
  expiresAfterTurns?: number;      // for banked cards
}

type Card =
  | (CardBase & { family: 'crisis'; payload: CrisisPayload })
  | (CardBase & { family: 'petition'; payload: PetitionPayload })
  | (CardBase & { family: 'decree'; payload: DecreePayload })
  | (CardBase & { family: 'negotiation'; payload: NegotiationPayload })
  | (CardBase & { family: 'advisor'; payload: AdvisorPayload })
  | (CardBase & { family: 'overture'; payload: OverturePayload })
  | (CardBase & { family: 'initiative'; payload: InitiativePayload })
  | (CardBase & { family: 'notification'; payload: NotificationPayload });
```

`CardPrerequisite` is a discriminated union (state thresholds, knowledge unlocks, owned cards in hand, advisor presence, etc.). `CardTag` is a string-literal union of ~40 tags drawn from existing event/decree categories.

### Migration path

- Existing `CardDefinition` is kept as `LegacyCardDefinition` for one phase
- Each generator gets an adapter `toCard(legacyData) → Card`
- Phase consumers read `Card` via family-typed accessors: `card.family === 'crisis' ? card.payload.choices : []`
- Phase 5 deprecates `LegacyCardDefinition` once all generators emit unified `Card` directly

### What doesn't change

- Existing per-family payload shapes (`CrisisPhaseData`, `PetitionCardData`, etc.) become the `payload` field
- All existing card generation logic remains; only the wrapper changes
- All phase components (`CrisisPhase.tsx`, `PetitionPhase.tsx`, etc.) continue to render exactly as before

### Acceptance criteria

- All existing generators produce `Card` instances
- Phase components consume `Card` via family-typed accessors
- All existing tests pass
- No visible UI change

### Files touched

- New: `src/engine/cards/types.ts`, `src/engine/cards/adapters.ts`, `src/engine/cards/tags.ts`
- Modified: every file in `src/bridge/` that generates a card
- Modified: every file in `src/ui/phases/` that consumes a card
- New tests: `src/__tests__/card-schema.test.ts`

---

## Phase 5 — Hand & Draft Mechanics

### Goal

Cards become persistent objects the player accumulates and curates. Some cards resolve immediately (today's behavior). Others bank into a hand. The player draws from the hand on quiet turns. Decisions about which cards to keep create a layer of strategic foresight without adding new screens.

### What gets added

**Three card behaviors:**

- `instant` — resolves the turn it surfaces (current behavior, applies to all crises and most petitions)
- `banked` — surfaces with an option to act now or save for later. Banked cards live in a Court Hand, max 5 slots, 8-12 turn expiry depending on card
- `persistent` — once played, generates ongoing effects until dismissed or superseded (existing kingdom features become a subset of this)

**The Court Hand** — A new card surface accessed from Court Business. Mobile UX: a small pip indicator on the Court Business header showing `2/5` filled. Tapping opens a vertical scroll of hand cards. The hand is its own card collection; it never auto-plays. Cards in the hand:

- Can be played on any turn that has slots remaining
- Show a turns-until-expiry pip
- Can be discarded for nothing (no penalty)
- Can be combined with other hand cards (combos in Phase 6)

**Card draft moments** — Quiet months (no crisis, no negotiation, low activity) generate a "Court Opportunity" — a single banked-tier card the player can either accept into hand or decline. This replaces what would otherwise be an empty month with a small strategic decision.

**Hand-card content (initial set, ~20 cards):**

- "Royal Pardon" — discard one negative persistent consequence
- "Reserve Forces" — +20 military readiness, instant
- "Master Builder" — next construction project completes 1 turn faster
- "Spymaster's Whisper" — generate a free intelligence finding on chosen rival
- "Court Favor" — +10 satisfaction with chosen class, one turn
- "Quiet Word" — convert one petition decision's outcome quality up by one tier
- "Old Debt Called In" — +50 treasury, costs 5 relationship with random rival
- "Forced Levy" — +200 force size, −5 commoner satisfaction

These are just openers; Phase 7 will expand the pool significantly.

### What doesn't change

- The fundamental flow (Month 1 / 2 / 3, decree phase, summary) is unchanged
- All existing crises and petitions remain `instant` behavior — players don't lose any current functionality
- Banking is opt-in: the player can ignore the hand entirely and play exactly as before

### Why this design

The current game has occasional empty months that feel flat. Banking turns those into "save the resource for when you need it" moments — a different kind of strategic engagement than acting on a crisis. It also gives the player a lever for handling multi-turn problems: bank a Reserve Forces card while war looms, deploy it the turn the siege starts.

The 5-card cap and expiry timer prevent hoarding from becoming optimal. The player has to use cards or lose them.

### Acceptance criteria

- Banked cards persist in `gameState.courtHand` across turn resolution
- Hand UI is reachable from Court Business with a single tap, no new screen depth
- Quiet months generate Court Opportunity cards
- Cards expire after their authored turn count
- Saves correctly preserve and restore hand state

### Files touched

- Modified: `src/engine/types.ts` (add `CourtHand`, fields on `GameState`)
- Modified: `src/engine/cards/types.ts`
- New: `src/engine/systems/court-hand.ts`
- New: `src/ui/components/CourtHandPanel.tsx`
- Modified: `src/ui/phases/CourtBusiness.tsx`
- Modified: `src/engine/resolution/turn-resolution.ts` (tick hand expiry)
- New: `src/data/cards/hand-cards.ts`
- New tests: `src/__tests__/court-hand.test.ts`

---

## Phase 6 — Card Combos & Synergies

### Goal

Cards that interact with other cards. When two cards share a `comboKey`, playing them in the same turn (or across consecutive turns) produces an enhanced effect. This rewards thoughtful hand curation and creates emergent strategy without explicit deck-building screens.

### What gets added

**Combo registry** — A new data file `src/data/cards/combos.ts` defines combos:

```typescript
interface CardCombo {
  id: string;
  name: string;                          // "Iron Dawn"
  description: string;                   // "Mass conscription with reserve deployment yields disciplined armies"
  requiredKeys: string[];                // ['mass_conscription', 'reserve_forces']
  windowTurns: number;                   // 1 = same turn, 2 = consecutive turns
  bonusEffect: MechanicalEffectDelta;
  styleAxisDelta?: Partial<Record<StyleAxis, number>>;
  unlocksKingdomFeature?: string;
}
```

**Combo detection** — During turn resolution, after all card decisions are collected, scan for matching combos:

- Same-turn combos: all `requiredKeys` satisfied within current turn's decisions
- Cross-turn combos: requires keys to be satisfied within the rolling `windowTurns` window

When a combo fires:

- Apply the bonus effect on top of normal card resolution
- Surface a notification in the turn summary ("Iron Dawn — your reserve deployment combined with the conscription decree has produced disciplined elite formations")
- Optionally unlock a new kingdom feature

**Initial combo pool (12-15):**

- "Iron Dawn" — Mass Conscription + Reserve Forces → +5 military training (persistent)
- "Bread and Circuses" — Festival Decree + Famine Relief → +15 commoner satisfaction, no decree pace penalty
- "The Long Game" — Espionage Sweep + Diplomatic Overture → +25 intelligence advantage on target
- "Faithful Restoration" — Religious Edict + Pilgrimage Sponsorship → -20 heterodoxy, prevents schism this season
- "Iron Borders" — Wall Construction + Border Garrison Order → +regional loyalty in border regions
- "Scholar's Patronage" — University Foundation + Scholarly Order → +20% knowledge gain (persistent)
- "Crown's Favor" — Three petitions accepted from same class → +15 long-term loyalty from that class
- "Velvet Glove" — Reduced Taxation + Festival Investment → −commoner satisfaction floor for next 4 turns

### Player-visible affordances

When a player adds a card to their hand, the card body gains a "Combos with..." subline showing 1-2 combo opportunities. When the player plays cards, the combo notification appears in the turn summary with prominent styling. A new section in the Codex tracks discovered combos (locked combos show a silhouette).

### What doesn't change

- Cards work the same when played without their combo partners
- Combo bonuses are additive — never subtractive — so trying combos has no downside
- The system is opt-in; ignoring combos still produces a playable game

### Acceptance criteria

- Playing matching cards produces the combo bonus
- Same-turn vs cross-turn windowing works
- Combo notifications surface in turn summary
- Codex tracks discovered combos
- No existing card content changes; only metadata added

### Files touched

- New: `src/engine/cards/combos.ts`, `src/data/cards/combos.ts`
- Modified: `src/engine/resolution/turn-resolution.ts`
- New: `src/ui/components/codex/CombosCards.tsx`
- Modified: existing card data files to add `comboKeys`

---

## Phase 7 — Card Content Expansion (80+ Cards)

### Goal

Bulk content addition leveraging the new schema. 80+ new cards across all families: 25 new crises, 20 new petitions, 15 new decrees, 12 new advisors, 10 new diplomatic overtures, plus expansion of hand-card content from 20 to 40.

### Distribution by family

- **Crises (25)**: drought escalations, plague variants, succession disputes, religious schisms, mercenary defections, food riot escalations, monetary crises, royal scandals, foreign assassinations, comet sightings, prophet appearances, bandit lord uprisings, slave revolts, naval disasters, magical phenomena (treated as folk belief, no real magic system), heretical sermons, salt shortage, well poisonings, royal illness, dynastic challenge, library fires, explored ruins, witch trials, foreign refugees, succession of saints
- **Petitions (20)**: scholarly societies, merchant guilds, regional lords, religious orders, military veterans, displaced peasants, foreign envoys, imprisoned nobles, miners, fishermen guilds, carpenters guilds, miller guilds, etc.
- **Decrees (15)**: codification of law, expansion of the bureaucracy, foundation of universities, charter of free cities, establishment of mint standards, military reforms, religious councils, hunting regulations, sumptuary laws, language standardization, calendar reform, weights and measures, justice circuits, road construction, bridge program
- **Advisors (12)**: extends Phase 8's initial advisor pool with personality-typed candidates
- **Diplomatic overtures (10)**: marriage proposals, joint military ventures, technology exchanges, religious councils, trade leagues, prisoner exchanges, mediation requests, royal visits, embassy establishment, cultural exchange programs

### Content authoring guidance

All new cards reuse the design language of existing cards: dark parchment aesthetic, terse evocative body text (2-3 sentences max), 2-4 choices per decision card, every choice has tradeoffs. New cards should explore underused mechanical levers — currently the simulation has rich heterodoxy/cohesion/pressure axes but few cards touch them directly.

### Acceptance criteria

- All new cards integrate with the unified schema
- All new cards have appropriate `tags`, `comboKeys`, and `prerequisites`
- New cards are discoverable across multiple playthroughs (none locked behind one-time conditions only)
- Existing tests pass; new tests verify each new card's effect application

### Files touched

- New files in `src/data/events/expansion/` for each cluster
- New files in `src/data/decrees/expansion-cards.ts`
- New files in `src/data/cards/hand-cards-expanded.ts`
- New files in `src/data/text/expansion/` for body text per cluster

---

## Phase 8 — Council & Advisor System

### Goal

Add a deep new control surface — appointing advisors — with minimal UI footprint. The player picks 4 advisors from a pool of candidates. Each advisor modifies how a card family or system resolves. Appointments shift over years, not turns. This is "depth via set-and-forget."

### What gets added

**Four council seats**: Chancellor (treasury & economy), Marshal (military), Chamberlain (court & petitions), Spymaster (intelligence & diplomacy). Each seat is initially vacant. The player fills seats from candidates that appear as Court Opportunity cards.

**Advisor data:**

```typescript
interface Advisor {
  id: string;
  name: string;                     // procedurally generated
  seat: CouncilSeat;
  personality: AdvisorPersonality;
  modifiers: AdvisorModifier[];     // 2-3 per advisor
  loyalty: number;                  // 0-100, tracks player favor
  yearsServing: number;
  background: string;               // narrative flavor
  flaws: AdvisorFlaw[];             // 1-2 per advisor
}

interface AdvisorModifier {
  target: 'crisis' | 'petition' | 'decree' | 'negotiation' | 'overture' | 'system';
  effect: AdvisorEffect;            // tagged union: 'discount_slot_cost' | 'increase_outcome_quality' | 'add_choice_option' | 'modify_finding_confidence' | etc.
  scope: AdvisorScope;              // which tags or categories the modifier applies to
}
```

**Examples of advisor effects:**

- A Chancellor with "Prudent Accountant" gives a +10% bonus to all treasury income
- A Marshal with "Battle-Hardened" gives a +1 outcome tier on all military crisis resolutions
- A Chamberlain with "Silver Tongue" adds an extra "soothing words" choice to every petition card
- A Spymaster with "Network of Whispers" reduces intelligence operation slot cost by 1

**Advisor flaws:**

- "Greedy" — drains 5 treasury per turn into personal coffers (until detected and fired)
- "Drunkard" — 10% chance per turn of failing to apply their bonus
- "Religious Zealot" — adds heterodoxy reduction at cost of cultural cohesion
- "Vendetta" — refuses to advise on decisions involving a specific rival kingdom
- "Reformist" — slowly accumulates positive reform pressure even on conservative decisions

**Advisor loyalty** — Advisors are characters with their own arcs. Low loyalty advisors may betray the player (defect to a rival, refuse to advise during a critical decision, etc.). High loyalty advisors generate occasional bonus events.

### Player interaction

- Court Opportunity cards occasionally present advisor candidates (with name, seat, listed strengths and listed flaws — but flaws are partially hidden, with the rest revealed during play)
- A new Council card in Codex shows current appointments
- Dismissing an advisor is a free action with a 1-time satisfaction cost from their patron class

### What doesn't change

- The game is fully playable with empty council seats (just no bonuses)
- All existing decree/petition/crisis logic is untouched; advisors layer modifiers on top of resolution

### Acceptance criteria

- Each seat can hold 0 or 1 advisor at a time
- Advisor modifiers correctly apply during resolution
- Hidden flaws are revealed during play (probabilistically)
- Advisors can be dismissed; dismissal has costs
- Advisor loyalty tracks player favor

### Files touched

- New: `src/engine/systems/advisors.ts`, `src/engine/types.ts` (add `Advisor`, `CouncilSeat`, etc.)
- New: `src/data/advisors/personalities.ts`, `src/data/advisors/effects.ts`, `src/data/advisors/flaws.ts`
- Modified: turn-resolution.ts (apply modifiers)
- New UI: `src/ui/components/codex/CouncilCards.tsx`
- New tests

---

## Phase 9 — Regional Governance Stances

### Goal

The player sets a single governance posture per region, infrequently. The posture changes how regional events resolve, what cards surface from that region, and how its economy behaves. Maximum one decision per region per few seasons.

### What gets added

**Five regional postures:**

- **Develop** — invest in infrastructure (auto-progression in roads/walls/granaries/sanitation), regional events skew toward growth opportunities, tax revenue −10%
- **Extract** — maximize resource yield, +20% extraction rate, infrastructure decays, loyalty drifts down
- **Garrison** — military buildup focus, regional military events surface, regional military strength bonus during conflicts, local trade −15%
- **Pacify** — focus on loyalty and order, banditry/unrest events suppressed, +loyalty drift, no resource bonus
- **Autonomy** — hands-off, no costs but no benefits, region runs itself, occasional surprising events (good or bad)

**Region-name procgen** — Phase 1's `generateRegionName` activates: Plains regions become "the X Lowlands", Hills become "the X Reach", etc. The hand-authored names ("Heartlands," "Ironvale," "Timbermark") become the fallback for the default scenario.

**Posture-changing UI** — A "Set Regional Posture" card appears as a Court Opportunity when a region's posture has been static for 8+ turns. It's an opt-in card, not a forced decision. Player can also change posture from a region's Codex card.

### What doesn't change

- All existing regional event content remains, with posture acting as a soft filter on weighting
- Regions without a posture set behave like the current "Autonomy" default

### Acceptance criteria

- Each region has a posture, default Autonomy
- Posture affects regional event weighting and resource flow
- Posture-change cards surface organically
- Regional cards in Codex show current posture and what it does

### Files touched

- Modified: `src/engine/types.ts` (add `RegionalPosture`)
- New: `src/engine/systems/regional-posture.ts`
- Modified: `src/engine/systems/regional-life.ts`, `src/engine/systems/regions.ts`
- Modified: `src/data/scenarios/*.ts` (initial postures)
- Modified: codex region cards

---

## Phase 10 — Long-Term Initiatives

### Goal

The player commits to one major multi-season directive. The initiative drives card distribution, modifies pressure axes, and pays out at completion. This adds long-horizon planning to a game otherwise dominated by season-to-season firefighting.

### What gets added

**Initiative framework:**

```typescript
interface Initiative {
  id: string;
  definitionId: string;
  title: string;
  description: string;
  category: InitiativeCategory;       // 'military' | 'cultural' | 'economic' | 'religious' | 'political'
  
  // Progress
  progressValue: number;              // 0-100
  turnsActive: number;
  turnsRequired: number;              // typical: 12-24
  
  // Effects while active
  perTurnPressureDelta: Partial<NarrativePressure>;
  cardWeightingBoost: CardTag[];      // cards with these tags surface more often
  
  // Effects on completion
  completionReward: MechanicalEffectDelta;
  unlocksKingdomFeature: string | null;
  
  // Failure conditions
  abandonPenalty: MechanicalEffectDelta;
  failureConditions: InitiativeFailureCondition[];
}
```

**Initial initiative pool (10):**

- **Subjugate the Eastern Marches** — military, 18 turns, requires conflict victory
- **Found a University** — cultural, 16 turns, requires construction completion + decree
- **Establish a Royal Bank** — economic, 20 turns, requires merchant satisfaction + treasury
- **Convene a Holy Synod** — religious, 14 turns, requires faith infrastructure
- **Forge a Grand Alliance** — political, 18 turns, requires treaties with all rivals
- **Reform the Coinage** — economic, 12 turns, requires economic stability
- **Establish a Standing Navy** — military, 22 turns, requires coastal regions
- **Codify the Common Law** — political, 16 turns, requires civic infrastructure
- **Sponsor the Great Cathedral** — religious, 24 turns, requires sustained treasury
- **Scour the Frontier of Banditry** — political, 14 turns, requires military activity

### Player interaction

A single "Initiative" slot. Switching initiatives requires explicit abandonment with a penalty. Initiative progress shows as a single line on the Codex Kingdom card. Completion fires a Defining-rarity card with a major narrative payoff.

### What doesn't change

- The slot is empty by default — game is fully playable with no initiative
- Initiative doesn't replace any existing system; it layers as a soft pressure

### Acceptance criteria

- Player can commit to one initiative at a time
- Progress accrues through tagged card decisions
- Completion fires a payoff card and applies rewards
- Abandonment applies penalty
- Saves preserve initiative state

### Files touched

- Modified: `src/engine/types.ts`
- New: `src/engine/systems/initiatives.ts`
- New: `src/data/initiatives/`
- Modified: `src/bridge/cardDistributor.ts` (weight tagged cards higher)

---

## Phase 11 — Inter-Kingdom Diplomacy

### Goal

Rivals interact with each other, not just the player. Alliances form, wars break out between rivals, and the player can mediate, exploit, or be drawn in.

### What gets added

**Rival-vs-rival relationships** — Each rival has relationship scores with every other rival, computed from their religious/cultural overlap, agendas, and recent actions. New `RivalRelationshipMatrix` field on `DiplomacyState`.

**Inter-rival actions** — In addition to actions targeting the player, rivals can now take actions against each other:

- TradeProposal between rivals (forms a trading bloc)
- Alliance formation
- War declaration on another rival
- Joint military action against a third party

These actions use the rival simulation pipeline — they're not invisible flavor, they reshape the world's military/trade balance.

**Player effects:**

- A two-rival war between hostile-to-you rivals is good news (they're distracted)
- A two-rival alliance against you is catastrophic (combined military > yours)
- Mediation cards become available when two rivals are at war
- Joining a coalition becomes possible when alliances form

**World pulse integration** — Existing world pulse system gains rival-to-rival news lines: "Velthorne and Caelnir have signed a trade pact," "Border skirmishes reported between Ostmark and the Free Cities."

### What doesn't change

- Player-vs-rival diplomacy still works as before
- Rival-vs-rival actions use the same `NeighborAction` machinery, just with different source/target
- Pre-Phase-11 saves migrate by initializing a neutral relationship matrix

### Acceptance criteria

- Rivals form alliances and declare wars on each other
- Player-visible world pulse surfaces inter-rival events
- Mediation cards appear when conditions are met
- Coalition mechanics work (joining one side of a rival war)

### Files touched

- Modified: `src/engine/types.ts`
- New: `src/engine/systems/inter-rival.ts`
- Modified: `src/engine/systems/rival-simulation.ts`
- Modified: world pulse generator
- New card content: mediation cards, coalition cards

---

## Phase 12 — Dynamic World Events

### Goal

Events that affect the entire region, not just one kingdom. Plagues spread across borders. Economic shocks ripple through trade networks. Religious movements transcend political boundaries. These create shared circumstances that all kingdoms must respond to differently.

### What gets added

**World event framework:**

```typescript
interface WorldEvent {
  id: string;
  definitionId: string;
  category: WorldEventCategory;       // 'plague' | 'economic_shock' | 'religious_movement' | 'climatic' | 'celestial'
  severity: EventSeverity;
  turnsRemaining: number | null;
  
  // Spread mechanics
  affectedKingdoms: string[];          // 'player' or neighbor IDs
  spreadProbabilityPerTurn: number;
  spreadResistanceFactors: SpreadFactor[];
  
  // Effects per affected kingdom
  perTurnEffects: WorldEventEffect[];
  
  // Player surfacing
  hasPlayerCardSurfaced: boolean;
}
```

**Event types (10 initial):**

- **The Black Pox** — plague that spreads turn-by-turn through trade routes
- **The Long Winter** — climatic, affects all northern kingdoms simultaneously
- **The Great Devaluation** — economic shock from a discovered silver hoard, inflation everywhere
- **The Pilgrim Movement** — religious revival, spreads kingdom-to-kingdom
- **The Mercenary Uprising** — large mercenary company free-roaming, threatens all
- **The Comet Year** — celestial event, modifies pressure axes for all kingdoms
- **The Heretical Doctrine** — schismatic faith spreads, modifies heterodoxy everywhere
- **The Locust Years** — multi-season agricultural collapse
- **The Trade League** — cooperative trade structure that all kingdoms can join
- **The Calling Crusade** — multi-kingdom religious war demand

### Player interaction

World events surface as crisis-tier cards with choices that often involve other kingdoms ("Send aid to Velthorne plague-stricken cities," "Ignore the comet's call," "Join the trade league"). Choices ripple back through inter-kingdom diplomacy.

### What doesn't change

- Existing local event system continues
- World events are an addition, not a replacement
- Pre-Phase-12 saves load with empty world events list

### Acceptance criteria

- World events spawn periodically (every 8-15 turns on average)
- Events spread between kingdoms via simulation rules
- Each event surfaces appropriate cards for affected kingdoms
- Effects propagate correctly across multiple kingdoms

### Files touched

- New: `src/engine/systems/world-events.ts`
- New: `src/data/world-events/`
- Modified: turn-resolution.ts

---

## Phase 13 — Diplomacy Overhaul

### Goal

Replace the binary "agreement / no agreement" diplomatic relationship with a richer set of bond types: marriages, hostages, vassalage, coalitions, and nested treaty terms.

### What gets added

**Bond types:**

- **Royal marriage** — long-term relationship modifier, generates dynastic complications and inheritance opportunities
- **Hostage exchange** — mutual relationship boost, bilateral leverage; breaking treaty costs hostage's life and major satisfaction hits
- **Vassalage** — formal subordination, vassal pays tribute and follows in war, occasionally rebels
- **Mutual defense pact** — automatic war entry if either is attacked
- **Coalition** — multi-party formation against a common enemy
- **Trade league** — multi-party formation for shared commerce
- **Religious accord** — shared faith institutions, reduces heterodoxy across signatories
- **Cultural exchange** — slow cultural drift toward shared identity

**Negotiation depth** — Negotiation cards (already a card family) get richer terms. A proposed treaty is no longer just a single agreement; it's a bundle of toggleable terms (a marriage clause, a trade clause, a defense clause, a tribute clause). The player can accept, reject, or counter-propose with modified terms.

### What doesn't change

- Existing diplomatic agreement structure remains as the foundational data
- Bond types are richer wrappers around the same underlying state

### Acceptance criteria

- All bond types can be formed and broken
- Bond effects apply correctly each turn
- Counter-proposal mechanic works in negotiation cards
- Pre-expansion saves load and migrate

### Files touched

- Modified: `src/engine/types.ts` (rich bond types)
- Modified: `src/engine/systems/diplomacy.ts`
- Modified: `src/bridge/negotiationCardGenerator.ts`
- Modified: `src/ui/phases/NegotiationPhase.tsx`

---

## Phase 14 — Intelligence Network Depth

### Goal

The current espionage system has aggregate `networkStrength` and `counterIntelligenceLevel`. Phase 14 adds named agents, agent specializations, dead drops (long-term ops), and named moles (rival agents in the player's court). This makes intelligence narratively rich without adding screens.

### What gets added

**Agent roster** — Up to 6 named agents, each with:

- Specialization (`Diplomatic`, `Military`, `Economic`, `Counter`, `Court`)
- Cover (which kingdom or domain they're embedded in)
- Reliability (0-100, affects intel confidence)
- Burn risk (0-100, increases with each operation)
- Status (`Active`, `Compromised`, `Dead`)

Agent recruitment surfaces as Court Opportunity cards. Agents with high burn risk generate "extraction or exposure" decisions.

**Long-term operations** — Slot-cost operations now produce ongoing investigations rather than single intel reports. A `Reconnaissance` op against a rival's military becomes a 4-turn ongoing op that produces escalating findings.

**Mole detection** — Rival kingdoms can place moles in the player's court. Moles drift policy and steal intelligence. Counter-espionage operations can detect moles, producing "expose or feed false intel" decisions.

### Acceptance criteria

- Named agents persist across turns
- Long-term operations produce escalating findings
- Mole mechanics work and surface decisions
- Existing single-shot espionage operations continue to work alongside new ones

### Files touched

- Modified: `src/engine/types.ts`, `src/engine/systems/espionage.ts`
- New: `src/engine/systems/agents.ts`
- Modified: `src/bridge/petitionCardGenerator.ts` (agent decisions)

---

## Phase 15 — Victory Conditions & Legacy

### Goal

Multiple victory paths give long campaigns a meaningful endpoint. A legacy system tracks dynasty continuation across runs.

### What gets added

**Six victory paths:**

- **Dominion** — control or vassalize all neighbors
- **Renaissance** — complete 3 cultural initiatives, max all knowledge branches
- **Theocracy** — establish religious hegemony across all kingdoms (faith conformity > 80%)
- **Mercantile Hegemony** — control trade leagues with all neighbors
- **Long Reign** — 60+ turns of stable rule with no failure warnings ever crossed
- **Dynastic** — succession plan in place, designated heir, no failure conditions for 40 turns

Each victory path triggers a defining-rarity finale card sequence and a credits-style chronicle of the reign.

**Legacy system** — On victory or defeat, the run produces a `LegacyRecord`:

- Kingdom name, dynasty name, ruler line
- Major decisions (top 10 by impact)
- Final scoring

Legacy records persist across runs (localStorage). New games can choose to "continue the dynasty" — a successor scenario with mild bonuses/inheritances from the previous reign. Three legacy records are visible at a time.

### Acceptance criteria

- Each victory path correctly detects victory conditions
- Finale card sequence plays
- Legacy records persist across game sessions
- "Continue dynasty" mode applies inherited modifiers

### Files touched

- New: `src/engine/systems/victory.ts`
- New: `src/engine/systems/legacy.ts`
- Modified: `src/ui/phases/GameOverScreen.tsx` (new finale rendering)
- New: `src/ui/phases/LegacyScreen.tsx`

---

## Cross-Cutting Concerns

### Save migration

Every phase that adds fields to `GameState` ships with a migration shim in `src/context/game-context.tsx` `LOAD_SAVE` reducer. New fields default to safe zero values. All migration is one-way (newer schema can read older saves; older code rejects newer saves with a clear "save from a newer version" error). A `version` integer on `SaveFile` already exists and gets bumped per phase.

### Testing

Each phase ships with new tests. Crucially, every phase verifies:

- Pre-expansion save loads cleanly
- All existing tests still pass
- New mechanics produce expected behavior in 50-turn simulated runs (a deterministic seeded simulation harness)

### Mobile UI considerations

Every visible addition reuses existing card families and the existing phase navigation. No new screens, no new modals, no nested overlays. The Codex gains new card sections (Council, Combos, Initiative, Legacy, Agents), each opening to a single scrollable view of cards. Total navigation depth never exceeds 2 from any phase screen.

### Performance budget

Per-turn resolution must stay under 100ms on mid-tier mobile hardware. Rival simulation budget: 10ms per rival per turn (×6 rivals max = 60ms ceiling). World event spread: 5ms. Card combo detection: 5ms. Combined headroom: 20ms.

### Phase ordering rationale

Phases 1-3 establish the rival foundation. Phase 4 is a refactor that the rest depends on. Phases 5-7 expand the card system that everything else surfaces through. Phases 8-10 add player control surfaces. Phases 11-12 deepen the world. Phase 13 enriches diplomacy now that there's a rich world to be diplomatic in. Phase 14 deepens espionage now that there's something rich to spy on. Phase 15 closes out with victory and legacy.

Each phase can be skipped or reordered with caveats:

- Phase 4 must precede 5, 6, 7
- Phase 2 must precede 3, 11
- Phase 8 can land any time after Phase 4
- Phase 12 benefits from 11 but works without it
- Phase 15 should land last
