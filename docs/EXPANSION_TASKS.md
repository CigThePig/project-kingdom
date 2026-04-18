# Crown & Council Expansion — Claude Code Task File

Each task below is a self-contained prompt for Claude Code. Run them in order. Each task ends with verification steps that must pass before moving to the next. If a task fails, fix it before proceeding — do not advance with broken state.

The design document `CROWN_AND_COUNCIL_EXPANSION.md` is the source of truth. When in doubt, defer to it. Do not invent features not in the design doc.

**Completion tracking:** Mark each task heading with ✅ when done. A task is only done when its verification steps pass — not when the code is written. Do not mark a task complete if tests are failing or the build is broken.

---

## Phase 1 — Procedural Naming System

### Task 1.1 — Word banks ✅

Create `src/data/text/word-banks.ts`. Export the following const arrays of strings:

- `KINGDOM_NAME_PREFIXES` (~30 entries): "Vel", "Ost", "Cael", "Pell", "Karn", "Brun", "Hald", "Mar", "Ren", "Thal", "Drak", "Vor", "Sel", "Ash", "Cor", "Em", "Ferr", "Gar", "Hael", "Kor", "Lyn", "Myr", "Nor", "Pyr", "Quel", "Rav", "Sten", "Thorn", "Ulf", "Wyn"
- `KINGDOM_NAME_ROOTS` (~30 entries): "thorne", "mark", "nir", "anth", "vale", "moor", "reach", "stand", "fall", "watch", "ward", "hold", "spire", "crest", "hollow", "ridge", "fen", "down", "haven", "stead", "burgh", "garde", "court", "marsh", "wold", "shire", "deep", "rise", "field", "wend"
- `KINGDOM_NAME_PATTERNS` (8 entries): "Kingdom of {0}", "The {0}", "{0} Dominion", "Free Cities of {0}", "Realm of {0}", "{0} Confederation", "{0} Marches", "Crown of {0}"
- `RULER_TITLES` (8): "King", "Queen", "High Lord", "High Lady", "Empress", "Emperor", "Sovereign", "Warlord"
- `MASCULINE_NAMES` (~40): "Hadric", "Bran", "Aldis", "Corwin", "Drask", "Edric", "Faelan", "Garron", "Halric", "Ivor", "Jorin", "Karth", "Lorn", "Magnus", "Nestor", "Orin", "Pyrrhus", "Quintar", "Ranulf", "Stellan", "Tomas", "Ulfric", "Vorn", "Wystan", "Xenric", "Yorick", "Zerric", "Beren", "Cedric", "Donnar", "Erran", "Fulko", "Gerwin", "Holt", "Iden", "Joran", "Kael", "Loras", "Mardin", "Nylan"
- `FEMININE_NAMES` (~40): "Selivane", "Brynn", "Aelis", "Cera", "Delyth", "Elin", "Faela", "Gretha", "Halle", "Iola", "Jora", "Karis", "Lyra", "Maeren", "Nessa", "Orla", "Phaedra", "Quenna", "Rian", "Selene", "Tova", "Una", "Vesna", "Wynn", "Xenia", "Ymara", "Zara", "Alestra", "Brenna", "Caelyn", "Daria", "Eira", "Fenna", "Gisela", "Hesta", "Ilse", "Jaena", "Kerith", "Lirien", "Maren"
- `DYNASTY_PREFIXES` (~20): "House", "Clan", "the Line of", "the Sons of", "the Daughters of", "House of", "the"
- `DYNASTY_ROOTS` (~30): "Marrowmoor", "Hollowsong", "Arnvik", "Greycliff", "Ironhand", "Stormgate", "Coldwater", "Brightspire", "Darkmere", "Goldhart", "Stillvale", "Northkeep", "Suncrest", "Wildmark", "Oldoak", "Whitethorn", "Blackwater", "Redforge", "Silverleaf", "Thornwall"
- `EPITHETS_AGGRESSIVE` (~15): "the Iron-Handed", "the Conqueror", "the Wolf", "the Unyielding", "the Bloody", "the Fierce", "the Stormbringer", "the Bold", "the Hammer", "the Spear", "the Burner", "the Reaver", "the Implacable", "the Wrathful", "the Sword"
- `EPITHETS_PRAGMATIC` (~15): "the Patient", "the Gilded", "the Calculating", "the Shrewd", "the Fox", "the Diplomat", "the Weaver", "the Cunning", "the Subtle", "the Quill", "the Scholar", "the Fair", "the Just", "the Wise", "the Measured"
- `EPITHETS_DEVOUT` (~15): "the Devout", "the Pilgrim", "the Pious", "the Saint", "the Reverent", "the Cloistered", "the Faithful", "the Holy", "the Righteous", "the Blessed", "the Pure", "the Solemn", "the Old Faith", "the Quiet", "the Withdrawn"
- `CULTURE_FILTERS`: a Record mapping each culture identity ID ("highland", "coastal", "reformed", "orthodox") to which prefix/root indices to prefer (boost weighting, not exclusive)

All exported as `const` with inferred types. No runtime logic — just data.

**Verify:** `npm run lint && tsc --noEmit`. No errors.

### Task 1.2 — Procedural name generators ✅

Create `src/data/text/name-generation.ts`. Implement:

```typescript
export function generateKingdomName(seed: string, culture: string): string
export function generateRulerName(seed: string, culture: string, gender?: 'M' | 'F'): { firstName: string; title: string }
export function generateDynastyName(seed: string, culture: string): string
export function generateEpithet(seed: string, personality: RivalPersonality): string
export function generateRegionName(seed: string, terrain: TerrainType): string
export function generateAgentCodename(seed: string): string
export function generateCapitalName(seed: string, culture: string): string
```

**Seeding:** Use a simple deterministic hash (`mulberry32` or `cyrb128 + sfc32`). Implement as a pure function `seededRandom(seed: string): () => number` that returns a generator. Never use `Math.random()` directly.

**Behavior:** Each generator constructs from word banks. Culture biases selection (highland prefers harder consonants, coastal prefers softer vowels). Personality biases epithet selection. Same `(seed, args...)` always produces the same name.

**Verify:** Add tests in `src/__tests__/name-generation.test.ts`:

- `generateKingdomName('seed_a', 'highland') === generateKingdomName('seed_a', 'highland')` (deterministic)
- `generateKingdomName('seed_a', 'highland') !== generateKingdomName('seed_b', 'highland')` (varies by seed)
- All generated names are non-empty strings
- 100 generated names with random seeds have at least 50 unique values

Run `npm test`. All tests pass.

### Task 1.3 — Add fields to NeighborState

In `src/engine/types.ts`, find the `NeighborState` interface. Add these new optional fields (optional for save migration):

```typescript
displayName?: string;
rulerName?: string;
rulerTitle?: string;
dynastyName?: string;
epithet?: string | null;
capitalName?: string;
runSeed?: string;
```

Also add a top-level field on `GameState`:

```typescript
runSeed: string;  // single seed used to derive all procedural names
```

**Verify:** `tsc --noEmit` passes. No code logic uses these fields yet.

### Task 1.4 — Populate fields in scenarios

In each `src/data/scenarios/*.ts`, modify the scenario creation function to:

1. Generate a `runSeed` using `Date.now().toString(36) + Math.random().toString(36).slice(2)`
2. For each neighbor in `diplomacy.neighbors`, populate the new fields using the generators from Task 1.2, seeded with `${runSeed}_${neighbor.id}`
3. Set `gameState.runSeed = runSeed`

**Important:** Keep all internal IDs (`neighbor_arenthal`, etc.) unchanged. Only populate the new display fields.

**Verify:** Start a new game in dev mode. Open the dossier card for any rival. The displayed name should be procedurally generated, not "Kingdom of Arenthal."

### Task 1.5 — Name resolver bridge ✅

Create `src/bridge/nameResolver.ts`:

```typescript
export function getNeighborDisplayName(neighborId: string, state: GameState): string
export function getNeighborRulerName(neighborId: string, state: GameState): string
export function getNeighborDynastyName(neighborId: string, state: GameState): string
export function getNeighborCapitalName(neighborId: string, state: GameState): string
export function getNeighborEpithet(neighborId: string, state: GameState): string | null
```

Each function:

1. Looks up the neighbor in `state.diplomacy.neighbors`
2. Returns the live state field if present
3. Falls back to `NEIGHBOR_LABELS[neighborId]` (existing static map) for `displayName`
4. Falls back to a sensible default for the other fields
5. Falls back to the raw ID as a last resort

**Verify:** `tsc --noEmit` passes. No callers yet.

### Task 1.6 — Switch all callers to the resolver

Find every `NEIGHBOR_LABELS[...] ?? ...` lookup pattern in the codebase. Replace each with the appropriate `getNeighbor*` helper from `nameResolver.ts`. Files to check (from grep):

- `src/bridge/contextExtractor.ts`
- `src/bridge/dossierCompiler.ts`
- `src/bridge/crisisCardGenerator.ts`
- `src/bridge/petitionCardGenerator.ts`
- `src/bridge/neighborActionCardGenerator.ts`
- `src/bridge/negotiationCardGenerator.ts`
- `src/bridge/situationTracker.ts`
- `src/data/text/chronicle-templates.ts`

Each call site has access to either `gameState` or a sub-slice. Pass it through.

For dossier templates, replace `NEIGHBOR_RULER_NAMES[id]` with `getNeighborRulerName(id, state)`.

**Verify:** `npm test && npm run lint && tsc --noEmit`. All existing tests must pass without modification.

### Task 1.7 — Save migration

In `src/context/game-context.tsx`, locate the `LOAD_SAVE` case. For each loaded neighbor without `displayName`, populate it from `NEIGHBOR_LABELS[neighbor.id]`. For missing `runSeed`, generate one. This ensures old saves continue to display the original hand-authored names.

**Verify:** Manually save a game from a fresh build, load it. Display names persist. Then test loading a synthetic "old save" (a save without the new fields) and confirm names display via `NEIGHBOR_LABELS` fallback.

### Task 1.8 — Phase 1 acceptance

Run the full Phase 1 verification suite:

- `npm test` — all green
- `npm run lint` — zero warnings
- `npm run build` — production build succeeds
- New game produces procedurally generated names visible in dossier and crisis cards
- Old save loads without breaking
- Two new games with different runs produce different names; same runSeed produces same names

If any step fails, do not advance to Phase 2. Fix and re-verify.

---

## Phase 2 — Rival Kingdom Simulation Core

### Task 2.1 — RivalKingdomState type

Add to `src/engine/types.ts`:

```typescript
export enum RivalCrisisType {
  Famine = 'Famine',
  Insolvency = 'Insolvency',
  CivilUnrest = 'CivilUnrest',
  SuccessionStruggle = 'SuccessionStruggle',
  Plague = 'Plague',
  ReligiousSchism = 'ReligiousSchism',
}

export interface RivalInternalEvent {
  turnRecorded: number;
  type: string;             // internal code: 'famine_southern_provinces', 'minor_uprising', etc.
  severity: 'minor' | 'notable' | 'major';
  resolved: boolean;
}

export interface RivalKingdomState {
  treasuryHealth: number;
  treasuryTrend: 'rising' | 'stable' | 'declining';
  foodSecurity: number;
  foodTrend: 'rising' | 'stable' | 'declining';
  internalStability: number;
  populationMood: number;
  expansionistPressure: number;
  mercantilePressure: number;
  pietisticPressure: number;
  recentInternalEvents: RivalInternalEvent[];
  isInCrisis: boolean;
  crisisType: RivalCrisisType | null;
}
```

Add an optional field on `NeighborState`: `kingdomSimulation?: RivalKingdomState`.

**Verify:** `tsc --noEmit` passes.

### Task 2.2 — Rival simulation engine

Create `src/engine/systems/rival-simulation.ts`. Implement pure functions:

```typescript
export function createInitialRivalState(seed: string, disposition: NeighborDisposition): RivalKingdomState
export function tickRivalKingdom(rival: RivalKingdomState, neighborMilitaryStrength: number, rng: () => number): RivalKingdomState
export function evaluateRivalCrisisEmergence(rival: RivalKingdomState, rng: () => number): RivalCrisisType | null
export function computeRivalActionPressure(rival: RivalKingdomState, neighbor: NeighborState): RivalActionPressureScores
```

Where `RivalActionPressureScores` is a Record mapping each `NeighborActionType` to a 0-1 score.

**Tick behavior:**

- Each turn, treasuryHealth drifts by ±2 modified by treasuryTrend
- foodSecurity drifts seasonally (matches player food seasonal pattern)
- internalStability drifts toward 50 + small per-turn random noise
- Pressures accumulate based on disposition (Aggressive → expansionist; Mercantile → mercantile; Devout → pietistic)
- When any of treasuryHealth/foodSecurity/internalStability drops below 30, set `isInCrisis = true` and pick a crisisType
- When in crisis, recovery is slower; crisis lifts when condition climbs back above 45
- `recentInternalEvents` capped at 8, oldest dropped first

**Pressure → action scores:**

- expansionistPressure → war declaration, demand, military buildup scores
- mercantilePressure → trade proposal score
- pietisticPressure → religious pressure score
- Crisis types reduce all action scores (rivals in crisis are paralyzed)

**Verify:** Add tests in `src/__tests__/rival-simulation.test.ts`:

- 100-turn simulation produces variation in treasuryHealth across rivals
- Famine crisis correctly sets `crisisType = Famine`
- Crisis recovery works when conditions improve
- Pressure scores correlate with disposition

Run `npm test`. All pass.

### Task 2.3 — Wire rival simulation into turn resolution

In `src/engine/resolution/turn-resolution.ts`, find the diplomacy AI section. Add a step **before** the existing `evaluateNeighborActions` call:

```typescript
// Tick rival simulations
const updatedNeighbors = state.diplomacy.neighbors.map((n) => {
  if (!n.kingdomSimulation) return n;
  const updatedSim = tickRivalKingdom(n.kingdomSimulation, n.militaryStrength, rng);
  return { ...n, kingdomSimulation: updatedSim };
});
```

Then modify `evaluateNeighborActions` (in `src/engine/systems/diplomacy.ts`) to accept the rival simulation and consult `computeRivalActionPressure` when available. If rival has no simulation, fall back to existing threshold logic.

**Verify:** Run a 30-turn simulated game (use the existing test harness if present, or write a quick `simulate-30-turns.test.ts`). Rival economies vary across turns. Aggressive rivals with healthy economies issue demands more often than aggressive rivals in crisis.

### Task 2.4 — Initialize rival simulations in scenarios

In each scenario file, after generating procedural names, also generate initial rival simulation state per neighbor. Use the runSeed-derived seed.

**Verify:** New game has fully populated `kingdomSimulation` on every neighbor.

### Task 2.5 — Save migration for rival simulation

In `LOAD_SAVE`, for each loaded neighbor missing `kingdomSimulation`, create a default rival simulation state.

**Verify:** Old save loads cleanly. Inspect loaded state — every neighbor has `kingdomSimulation`.

### Task 2.6 — Intelligence finding integration

In `src/engine/systems/espionage.ts`, add new finding codes to the intelligence findings enum/union:

- `rival_treasury_strain`
- `rival_food_shortage`
- `rival_internal_unrest`
- `rival_expansionist_intent`
- `rival_succession_concern`

Update `generateIntelligenceReport` to inspect the target neighbor's `kingdomSimulation` and surface findings based on actual state. Add corresponding text labels in `src/data/text/expansion/espionage-text.ts`.

**Verify:** Run an intelligence operation against a rival in a synthetic famine state. The generated report includes `rival_food_shortage`. UI displays the new finding text.

### Task 2.7 — Phase 2 acceptance

Same verification suite as Phase 1: tests, lint, build, manual playthrough confirms rival behaviors are downstream of simulation state.

---

## Phase 2.5 — Location & Geography Foundation

**Motivation.** Phase 3 agendas (`RestoreTheOldBorders`, `BleedTheRivals`)
reference historic claims and inter-rival adjacency. Phases 9, 11, 12, and 14
also need a real adjacency layer. This phase ships the pure-data graph —
no map UI, no coordinates — so subsequent phases have something real to read.

### Task 2.5.1 — Geography types

Add to `src/engine/types.ts`:

```typescript
export type GeographicEntityId = string; // region_* | neighbor_* | settlement_*

export interface AdjacencyEdge {
  a: GeographicEntityId;
  b: GeographicEntityId;
  kind: 'land' | 'river' | 'sea' | 'mountain_pass';
  frictionTier: 'open' | 'contested' | 'difficult';
}

export interface HistoricClaim {
  neighborId: string;
  regionId: string;
  claimStrength: 'ancestral' | 'recent' | 'disputed';
  lostOnTurn: number | null;
  internalReasonCode: string;
}

export interface Settlement {
  id: string;                       // 'settlement_*'
  regionId: string;
  role: 'capital' | 'market' | 'fortress' | 'shrine' | 'minor';
  displayName?: string;
  populationShare: number;
}

export interface WorldGeography {
  schemaVersion: 1;
  edges: AdjacencyEdge[];
  historicClaims: HistoricClaim[];
  settlements: Settlement[];
  _adjacencyIndex?: Record<string, string[]>;
  _claimsByNeighbor?: Record<string, string[]>;
  _claimsByRegion?: Record<string, string[]>;
}
```

Add `geography?: WorldGeography` to `GameState`. Bump `SAVE_VERSION` 1 → 2.
Mark `RegionState.borderRegion` `@deprecated — derived from geography.edges`;
keep the field, but compute it from edges. Add `displayName?: string` to
`RegionState` — procgen at scenario setup and save migration.

### Task 2.5.2 — Geography engine system

Create `src/engine/systems/geography.ts` (pure functions):

- `buildGeographyIndexes(geo)` — populates `_adjacencyIndex`, `_claimsByX`.
- `getNeighborsBordering(regionId, state)` → `string[]`
- `getRegionAdjacencies(regionId, state)` → `string[]`
- `getRegionsClaimedBy(neighborId, state)` → `string[]`
- `getClaimantsOf(regionId, state)` → `HistoricClaim[]`
- `areAdjacent(idA, idB, state)` → `boolean` (symmetric, false on unknown)
- `getInterRivalAdjacency(state)` → `Array<[string, string]>` (sorted, deduped)
- `getSettlementsIn(regionId, state)` → `Settlement[]`
- `deriveBorderRegionFlag(regionId, geo)` / `recomputeBorderFlags(state)`
- `validateGeographyIntegrity(state)` — throws on dangling edges/claims
- `applyProceduralRegionNames(state)` / `applyProceduralSettlementNames(state)`
- `finalizeGeography(state)` — build indexes, procgen names, border flags
- `edge(a, b, kind?, frictionTier?)` — authoring helper

Create `src/engine/systems/geography-migrations.ts`:

- `synthesizeGeographyFromScenario(scenarioId, state)` — returns the same
  edges/claims the scenario factory would have produced, for legacy saves.
  Falls back to "every region ↔ every neighbor" emergency geography when the
  scenarioId is unknown (preserves `borderRegion=true` semantics).

### Task 2.5.3 — Procedural naming wiring

**All** region and settlement display names are procgen. There is no
hand-authored `REGION_LABELS` fallback. Internal IDs (`region_heartlands`,
`settlement_heartcrown`, …) are stable forever per design rule — only display
strings change, regenerated on every new run.

Add to `src/data/text/word-banks.ts`:

- Settlement name banks per `Settlement.role` (capital / market / fortress /
  shrine / minor) plus per-terrain roots mirroring the existing region banks.

Add to `src/data/text/name-generation.ts`:

- `generateSettlementName(seed, role, terrain)` — deterministic from seed.

Add to `src/bridge/nameResolver.ts`:

- `getRegionDisplayName(regionId, state)` — live `region.displayName` → raw id
  as a last-resort safety net; in practice `displayName` is always populated
  after scenario setup or save migration.
- `getSettlementDisplayName(settlementId, state)` — same shape.

Delete `REGION_LABELS` from `src/data/text/labels.ts`. All call sites that
previously read `REGION_LABELS[id]` (e.g. `contextExtractor`,
`situationTracker`) route through `getRegionDisplayName(id, state)`.

### Task 2.5.4 — Scenario integration

Each of the 5 scenario factories (`src/data/scenarios/*.ts`) declares its
geography inline and calls `finalizeGeography(baseState)` before returning.
Scenario flavor:

- **default (`new_crown`)** — single valdris↔ironvale ancestral claim.
- **faithful-kingdom** — religious claim strengths (schism + disputed monastery).
- **fractured-inheritance** — 3 overlapping claims; contested internal edges.
- **frozen-march** — `mountain_pass` edges dominate; arenthal ancestral claim
  on timbermark.
- **merchants-gambit** — 3 neighbors (arenthal/valdris/krath); sea edges
  dominate; dense rival↔rival adjacency.

Hard-coded `borderRegion: true` literals remain in place this phase —
`recomputeBorderFlags()` derives them from edges. Cleanup during Phase 3.

### Task 2.5.5 — Save migration

In `src/context/game-context.tsx` `LOAD_SAVE`, after the existing diplomacy
migration block:

```typescript
const geography = migratedGameState.geography
  ?? synthesizeGeographyFromScenario(migratedGameState.scenarioId, migratedGameState);
const gameState = finalizeGeography({ ...migratedGameState, geography });
```

`finalizeGeography` rebuilds indexes, populates procgen region and settlement
names (idempotent — same `runSeed` → same names), and refreshes `borderRegion`.

### Task 2.5.6 — Verification

`src/__tests__/geography.test.ts` covers:

- `buildGeographyIndexes` produces a symmetric `_adjacencyIndex`.
- `getNeighborsBordering('region_timbermark', defaultState)` →
  `['neighbor_arenthal']`.
- `getRegionsClaimedBy('neighbor_valdris', defaultState)` →
  `['region_ironvale']`.
- `areAdjacent` symmetric; unknown IDs → `false` (no throw).
- `getInterRivalAdjacency` returns sorted, deduped pairs.
- `recomputeBorderFlags` updates `borderRegion` to match edges.
- All 5 scenarios pass `validateGeographyIntegrity`.
- Procgen region and settlement names are deterministic per `runSeed`.

Extended `src/__tests__/game-reducer.test.ts`:

- v1 `SaveFile` with no geography → `LOAD_SAVE` synthesizes edges, populates
  `displayName`, and derives `borderRegion`.
- Round-trip: save then load preserves edges, claims, and generated names.
- Unknown `scenarioId` falls back to emergency geography.

Phase gate: `npm test && npm run lint && npm run build` all green.

---

## Phase 3 — Rival Agendas & Memory ✅

> **Prerequisite: Phase 2.5 (Geography Foundation).** Agendas reference
> `geography.historicClaims` and `getInterRivalAdjacency`. All region /
> settlement display names come from `getRegionDisplayName` and
> `getSettlementDisplayName` — never raw ids in dossier text.

### Task 3.1 — Agenda and memory types

Add to `src/engine/types.ts`:

```typescript
export enum RivalAgenda {
  RestoreTheOldBorders = 'RestoreTheOldBorders',
  DominateTrade = 'DominateTrade',
  ReligiousHegemony = 'ReligiousHegemony',
  DefensiveConsolidation = 'DefensiveConsolidation',
  DynasticAlliance = 'DynasticAlliance',
  BleedTheRivals = 'BleedTheRivals',
  // ...etc, ~12 total
}

export interface RivalMemoryEntry {
  turnRecorded: number;
  type: 'slight' | 'favor' | 'breach' | 'demonstration' | 'territorial_loss';
  source: string;
  weight: number;
  context: string;
  regionId?: string;        // Phase 2.5 anchor
  settlementId?: string;
}

export interface RivalAgendaState {
  current: RivalAgenda;
  targetEntityId: string | null;     // region_* | neighbor_* | settlement_*
  progressValue: number;
  turnsActive: number;
}
```

Add to `NeighborState`:

```typescript
agenda?: RivalAgendaState;
memory?: RivalMemoryEntry[];
```

**Verify:** `tsc --noEmit` passes.

### Task 3.2 — Agenda system

Create `src/engine/systems/rival-agendas.ts`:

```typescript
export function selectInitialAgenda(neighbor: NeighborState, rng: () => number): RivalAgendaState
export function tickAgenda(agenda: RivalAgendaState, neighbor: NeighborState, world: GameState, rng: () => number): RivalAgendaState
export function shouldAgendaShift(agenda: RivalAgendaState, neighbor: NeighborState): boolean
```

Each agenda has authored definitions in `src/data/rivals/agendas.ts` covering: target conditions, preferred action types (modifier on action pressure), satisfaction triggers (when does it complete or shift).

**Geography-anchored agenda behavior (Phase 2.5 consumer):**

- `RestoreTheOldBorders.selectInitialAgenda` calls
  `getRegionsClaimedBy(neighbor.id)`. Empty → fall back to
  `DefensiveConsolidation`. Non-empty → `targetEntityId` is the first claim's
  `regionId` (deterministic, not RNG).
- `DominateTrade` prefers neighbors reachable via `sea`/`river` edges.
- `BleedTheRivals` requires at least one inter-rival edge to the target
  (consults `getInterRivalAdjacency`).
- `tickAgenda` for `RestoreTheOldBorders` reads player control of
  `targetEntityId` and bumps `progressValue` only while the player still
  holds it.

**Verify:** Tests confirm agendas shift over time, target the right entities,
and modify action pressure correctly. Geography-anchored agendas resolve
targets against `state.geography` not via RNG lookup.

### Task 3.3 — Memory system

Create `src/engine/systems/rival-memory.ts`:

```typescript
export function recordMemory(memory: RivalMemoryEntry[], entry: RivalMemoryEntry, capacity?: number): RivalMemoryEntry[]
export function decayMemoryWeights(memory: RivalMemoryEntry[], yearsElapsed: number): RivalMemoryEntry[]
export function computeMemoryDriftDelta(memory: RivalMemoryEntry[]): number
```

Hook `recordMemory` calls into existing event resolution paths (when player makes a decision affecting a rival, write a memory entry).

**Geography hooks (Phase 2.5 consumer):**

- `recordMemory` accepts optional `regionId` / `settlementId`. Resolution code
  that flags region loss writes `type: 'territorial_loss', regionId`.
- `computeMemoryDriftDelta` weights `territorial_loss` 2× when the region also
  appears in `historicClaims` for the same neighbor (via
  `getRegionsClaimedBy`).

**Verify:** Memory entries are recorded; weights decay over multi-year sims;
drift delta affects relationship score. Territorial losses on historically
claimed regions double-weight.

### Task 3.4 — Spymaster assessments and dossier integration

Update `src/data/text/dossier-templates.ts` to add agenda-aware spymaster lines per agenda × posture combination. Update `src/bridge/dossierCompiler.ts` to surface them.

Add a "Disposition Toward You" line to the dossier card derived from memory entries.

Spymaster lines must resolve `targetEntityId` through
`getRegionDisplayName` / `getSettlementDisplayName` / `getNeighborDisplayName`
— never render a raw `region_*` or `settlement_*` id.

**Verify:** Dossier shows agenda hints and disposition lines. Targets render
as procgen names.

### Task 3.5 — Diplomatic Overture cards

Create `src/bridge/diplomaticOvertureGenerator.ts`. Generates overture cards based on rival agenda state. E.g., a rival with `DynasticAlliance` agenda may surface a marriage proposal card to the player.

Wire into `src/bridge/cardDistributor.ts` as a new card category that can be placed in any month.

**Verify:** Overture cards appear when rival agenda conditions are met.

### Task 3.6 — Phase 3 acceptance

Tests, lint, build. Playthrough confirms rivals show agenda-driven behavior over multiple seasons.

---

## Phase 4 — Unified Card Schema

### Task 4.1 — Card type definitions

Create `src/engine/cards/types.ts`. Define the unified `Card` discriminated union per the design doc Section "Phase 4."

Define `CardTag` as a union of all existing categories from event/decree taxonomies: `'military' | 'aggressive' | 'border' | 'religious' | 'commercial' | 'civic' | 'cultural' | ...` (~40 tags).

Define `CardPrerequisite` as a discriminated union supporting:

- `{ type: 'state_threshold'; field: string; comparator: '>=' | '<='; value: number }`
- `{ type: 'knowledge_unlocked'; advancementId: string }`
- `{ type: 'has_card_in_hand'; cardId: string }`
- `{ type: 'advisor_appointed'; seat: CouncilSeat }`
- `{ type: 'agenda_active'; agenda: RivalAgenda }`

Define `CardHandBehavior = 'instant' | 'banked' | 'persistent'` and `EffortTier = 'Light' | 'Standard' | 'Heavy' | 'Crushing'` and `CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Defining'`.

**Verify:** `tsc --noEmit` passes.

### Task 4.2 — Adapters

Create `src/engine/cards/adapters.ts`. For each existing card data type (`CrisisPhaseData`, `PetitionCardData`, `DecreeCardData`, `NegotiationCard`, etc.), write a `toCard(legacyData): Card` adapter.

Adapters preserve all existing payload data and add reasonable defaults for new metadata fields:

- `tags`: derived from existing category fields
- `effortCost`: derived from existing slotCost (1 → Light, 2 → Standard, etc.)
- `rarity`: 'Common' default, 'Rare' for severity Critical
- `prerequisites`: empty array
- `comboKeys`: empty array
- `hand`: 'instant'

**Verify:** All existing card generators can be wrapped with adapters and produce valid `Card` instances. Add a test that round-trips each card type through the adapter and verifies essential fields.

### Task 4.3 — Migrate consumers

Update each `src/ui/phases/*.tsx` file to consume `Card` instances via family-typed accessors rather than the old data shapes directly. The phase components should not change visually — only their type signatures.

**Verify:** All phase components type-check, render correctly, and no visual regressions in manual playthrough.

### Task 4.4 — Migrate generators

Update each generator in `src/bridge/` to produce `Card` instances natively rather than relying on adapters. The adapters become deprecated (kept for one phase) and only used for any straggler call paths.

**Verify:** Tests pass; lint passes; build succeeds.

### Task 4.5 — Phase 4 acceptance

Full verification suite plus a manual 5-season playthrough confirming no visible regressions.

---

## Phase 5 — Hand & Draft Mechanics

### Task 5.1 — Court Hand state

Add to `src/engine/types.ts`:

```typescript
export interface CourtHandSlot {
  card: Card;
  turnAdded: number;
  turnsUntilExpiry: number;
}

export interface CourtHand {
  slots: CourtHandSlot[];
  capacity: number;
}
```

Add `courtHand: CourtHand` to `GameState`.

**Verify:** `tsc --noEmit` passes.

### Task 5.2 — Court Hand engine system

Create `src/engine/systems/court-hand.ts`:

```typescript
export function createInitialCourtHand(): CourtHand
export function addCardToHand(hand: CourtHand, card: Card, currentTurn: number): CourtHand
export function removeCardFromHand(hand: CourtHand, cardId: string): CourtHand
export function tickHandExpiry(hand: CourtHand): { hand: CourtHand; expiredCards: Card[] }
export function canAddToHand(hand: CourtHand): boolean
```

Capacity 5 by default. Cards expire when `turnsUntilExpiry` reaches 0.

**Verify:** Tests cover add/remove/tick/capacity.

### Task 5.3 — Hand UI panel

Create `src/ui/components/CourtHandPanel.tsx`. A vertical scroll of hand cards with:

- Card title, body
- Turns-until-expiry pip
- "Play" button (consumes a slot, plays the card)
- "Discard" button (removes from hand, no effect)

Mount this panel in `src/ui/phases/CourtBusiness.tsx` behind a tap on the existing "Hand" pip indicator.

**Verify:** Manual playthrough — banked cards appear in hand, can be played or discarded, expiry counts down.

### Task 5.4 — Quiet month opportunity cards

In `src/bridge/cardDistributor.ts`, when a month has no crisis/petition/negotiation/assessment, generate a Court Opportunity card from a curated pool. The player can accept (adds to hand) or decline.

Create `src/data/cards/court-opportunities.ts` with ~15 initial opportunity card definitions (these become hand cards when accepted).

**Verify:** Quiet months generate opportunity cards; accepting adds to hand; declining is a no-op.

### Task 5.5 — Initial hand-card content

Create `src/data/cards/hand-cards.ts` with the 20 hand-card definitions per the design doc.

**Verify:** Each hand card resolves correctly when played.

### Task 5.6 — Phase 5 acceptance

Tests, lint, build. Playthrough confirms hand mechanics work end-to-end.

---

## Phase 6 — Card Combos & Synergies

### Task 6.1 — Combo type and registry

Create `src/engine/cards/combos.ts` and `src/data/cards/combos.ts` per the design doc.

### Task 6.2 — Combo detection

In `src/engine/resolution/turn-resolution.ts`, add a combo detection step after card decisions are collected. Apply bonus effects, surface notifications.

### Task 6.3 — Combo Codex

Create `src/ui/components/codex/CombosCards.tsx` showing discovered and undiscovered combos.

### Task 6.4 — Tag existing cards

Add `comboKeys` to existing card data files where combos apply.

### Task 6.5 — Phase 6 acceptance

Tests, lint, build. Manual playthrough confirms combo notifications fire correctly.

---

## Phase 7 — Card Content Expansion

### Task 7.1 — 25 new crisis cards

Create `src/data/events/expansion/wave-2/` directory. 25 new crisis card definitions across the categories listed in the design doc. Each in its own file or grouped by theme.

### Task 7.2 — 20 new petition cards

Create `src/data/events/expansion/petitions-wave-2/`.

### Task 7.3 — 15 new decree cards

Create `src/data/decrees/expansion-wave-2/`.

### Task 7.4 — 12 new advisor candidates

Create `src/data/advisors/candidates-wave-2/` (depends on Phase 8 type definitions).

> **Deferred to Phase 8.** Phase 8 has not yet introduced the `CouncilSeat` /
> `AdvisorCandidate` type definitions in `src/engine/types.ts`. Authoring 12
> candidates here would either invent throwaway types or block on Phase 8;
> roll this work into Phase 8.2 so candidates land on the real schema.

### Task 7.5 — 10 new diplomatic overtures

Create `src/data/overtures/wave-2/`.

### Task 7.6 — 20 new hand cards

Add to `src/data/cards/hand-cards-expanded.ts`.

### Task 7.7 — Register all new content

Add new cards to their respective registry/index files. Verify card distribution still works correctly.

### Task 7.8 — Phase 7 acceptance

Tests, lint, build. Playthrough confirms new cards appear and resolve correctly.

---

## Phase 8 — Council & Advisor System

### Task 8.1 — Type definitions

Per design doc.

### Task 8.2 — Advisor data files

`src/data/advisors/personalities.ts`, `effects.ts`, `flaws.ts`.

### Task 8.3 — Engine system

`src/engine/systems/advisors.ts` with appointment, dismissal, modifier application, loyalty tracking.

### Task 8.4 — Modifier integration

Modifier application happens in turn-resolution.ts during card resolution.

### Task 8.5 — Council Codex card

`src/ui/components/codex/CouncilCards.tsx`.

### Task 8.6 — Advisor opportunity cards

Wire advisor candidates into Court Opportunity card generator.

### Task 8.7 — Phase 8 acceptance

Tests, lint, build, playthrough.

---

## Phase 9 — Regional Governance Stances

### Task 9.1 — Posture types

```typescript
export enum RegionalPosture {
  Develop = 'Develop',
  Extract = 'Extract',
  Garrison = 'Garrison',
  Pacify = 'Pacify',
  Autonomy = 'Autonomy',
}
```

Add `posture: RegionalPosture` to `RegionState`.

### Task 9.2 — Posture engine system

`src/engine/systems/regional-posture.ts` with per-turn posture effects.

### Task 9.3 — Posture-change cards

Generate "Set Posture" cards as Court Opportunities for stale regions.

### Task 9.4 — Region rename via procgen *(removed — completed in Phase 2.5)*

Moved to Phase 2.5 (Task 2.5.3). `generateRegionName` is now called in
`finalizeGeography` from every scenario factory and from `LOAD_SAVE`. Phase 9
keeps regional postures; renaming is already wired.

### Task 9.5 — Phase 9 acceptance

Tests, lint, build, playthrough.

---

## Phase 10 — Long-Term Initiatives ✅

### Task 10.1 — Initiative types ✅

Per design doc.

### Task 10.2 — Initiative pool data ✅

`src/data/initiatives/` with 10 initial initiatives.

### Task 10.3 — Engine system ✅

`src/engine/systems/initiatives.ts` with progress tracking, completion detection, abandonment, card weighting boost.

### Task 10.4 — Initiative UI ✅

Surface initiative state on the Codex Kingdom card. Initiative selection happens via a Court Opportunity card.

### Task 10.5 — Phase 10 acceptance ✅

Tests, lint, build, playthrough.

---

## Phase 11 — Inter-Kingdom Diplomacy

> **Geography consumer (Phase 2.5).** Coalition formation prefers
> `getInterRivalAdjacency` pairs. "Border skirmish" world-pulse lines seed
> off edges with `frictionTier: 'contested'`.

### Task 11.1 — Relationship matrix

Add `rivalRelationships: Record<string, Record<string, number>>` to `DiplomacyState`.

### Task 11.2 — Inter-rival actions

Extend `evaluateNeighborActions` to optionally generate actions targeting other rivals.
Action probability bumped for rivals sharing an adjacency edge
(`areAdjacent(aId, bId, state)`); multiplied further for `contested` edges.

### Task 11.3 — World pulse integration

New world pulse line categories for inter-rival events. Border skirmish pulses
iterate `getInterRivalAdjacency(state)` and filter by `frictionTier === 'contested'`.

### Task 11.4 — Mediation and coalition cards

New card types and generators for player intervention in rival conflicts.
Coalition candidacy ranks rival pairs by `getInterRivalAdjacency` intersection
with shared grievance memories.

### Task 11.5 — Phase 11 acceptance

Tests, lint, build, playthrough.

---

## Phase 12 — Dynamic World Events

> **Geography consumer (Phase 2.5).** Plague / economic-shock spread iterates
> `state.geography._adjacencyIndex`. Sea edges spread maritime plague faster;
> `mountain_pass` edges block land plague.

### Task 12.1 — World event types

Per design doc.

### Task 12.2 — World event engine

`src/engine/systems/world-events.ts` with spawning, spread, per-kingdom effect
application. Spread iterates `_adjacencyIndex`; per-event definitions declare
which `AdjacencyEdge.kind` values transmit (e.g. maritime plague: `sea`,
`river`; land plague: `land`; economic shock: `land`, `river`, `sea`).

### Task 12.3 — Initial world event pool

`src/data/world-events/` with 10 initial event definitions.

### Task 12.4 — Card surfacing

World events surface as Crisis-tier cards with multi-kingdom choices.

### Task 12.5 — Phase 12 acceptance

Tests, lint, build, playthrough.

---

## Phase 13 — Diplomacy Overhaul

### Task 13.1 — Bond types

Replace simple `DiplomaticAgreement` with rich bond types per design doc.

### Task 13.2 — Negotiation depth

Negotiation cards gain bundled toggleable terms and counter-proposal mechanics.

### Task 13.3 — Bond effect application

Each bond type has its own per-turn effect logic.

### Task 13.4 — Phase 13 acceptance

Tests, lint, build, playthrough.

---

## Phase 14 — Intelligence Network Depth

> **Geography consumer (Phase 2.5).** Agent `coverLocation` is a
> `settlementId`. Agents stationed in settlements inside border regions
> (`deriveBorderRegionFlag`) receive a detection-risk modifier.

### Task 14.1 — Agent types and roster

Per design doc. `Agent.coverLocation?: string` holds a `settlement_*` id;
resolved via `getSettlementDisplayName(id, state)` for display.

### Task 14.2 — Long-term operations

Multi-turn operation state machine.

### Task 14.3 — Mole detection

Counter-espionage operations that detect rival moles in the player's court.

### Task 14.4 — Phase 14 acceptance

Tests, lint, build, playthrough.

---

## Phase 15 — Victory Conditions & Legacy

### Task 15.1 — Victory detection

`src/engine/systems/victory.ts` checks each victory condition each turn.

### Task 15.2 — Finale card sequences

Each victory path has a defining-rarity finale card sequence.

### Task 15.3 — Legacy persistence

`src/engine/systems/legacy.ts` with localStorage-backed legacy records.

### Task 15.4 — Legacy continuation mode

New game option: "Continue the Dynasty" applies legacy bonuses.

### Task 15.5 — Phase 15 acceptance

Tests, lint, build, full victory and legacy playthrough.

---

## Final Acceptance — All Phases

After Phase 15:

- `npm test` — 100% pass
- `npm run lint` — zero warnings
- `npm run build` — production build under reasonable size
- Two complete playthroughs — one to victory, one to defeat — with no crashes, no missing UI, no stuck states
- A fresh game from each scenario produces meaningfully different procedural content (names, rival behaviors, world events)
- A pre-Phase-1 save still loads cleanly through the migration chain
