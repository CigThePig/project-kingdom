# Audit Scanner Overhaul Plan

## Purpose

This plan upgrades the repo audit system from a table-shape checker into a runtime-contract verifier.

The current scanner catches useful wiring issues, but it still has a blind spot: many findings are based on what the data *looks like* instead of how the engine *actually resolves* cards. That creates three problems:

1. false positives caused by the scanner reading the wrong source tables or assuming the wrong runtime path
2. false negatives in generated or inline families that the scanner barely sees today
3. weak “surface vs structural” judgments because the scanner infers behavior instead of diffing real state changes

The target state is an audit pipeline that can be trusted as the primary work queue for card cleanup.

---

## What this overhaul must accomplish

By the end of this work, the audit should be able to answer all of the following with high confidence:

- Does every family read from the correct text/effects source?
- Does the audit understand the family’s **real runtime path**?
- Is a structural effect actually live in runtime, or only present in a table?
- Do generated families such as overtures have full coverage instead of partial proxy checks?
- Do inline families such as hand cards get meaningful static analysis instead of text-only checks?
- Can the audit tell the difference between:
  - a real card failure
  - a scanner-model failure
  - a heuristic suspicion
- Can the audit show which rule areas are truly covered for each family?

---

## Non-goals

This plan is **not** for rewriting the card corpus itself.

Card-content fixes should only begin after the scanner is trustworthy enough that its findings can be treated as a real backlog. Small obvious fixes can happen during implementation when they are directly required to validate the scanner, but this plan is primarily scanner and tooling work.

---

## Recommended dependency additions

Add these as **devDependencies**.

### 1. `ts-morph`
Use for AST-backed source inspection and project-aware TypeScript analysis. The official docs describe it as a wrapper around the TypeScript compiler API meant to simplify AST setup, navigation, and manipulation. citeturn0search0

**Use it for:**
- replacing regex/filepath-based source indexing where practical
- reading inline card definitions more safely
- extracting `apply` functions and structural patterns from hand-card definitions
- locating runtime writer/reader sites for tags, pressure, and effects

### 2. `tsquery`
Use as a companion tool for selector-style AST queries. Its documentation describes it as a TypeScript AST query library using CSS-style selectors. citeturn0search3

**Use it for:**
- finding specific code shapes quickly, such as cards declaring `requiresChoice` but not actually using `choice`
- locating `persistentConsequences` writes and reads
- finding `applyPressure(...)` call sites and matching source-type usage

### 3. `ajv`
Use for validating the normalized audit IR and the emitted findings schema. Ajv’s docs describe it as a JSON Schema validator and note that it can leverage TypeScript helper types such as `JSONSchemaType`, while its getting-started guide notes that it compiles schemas into efficient JavaScript validators. citeturn0search5turn0search1turn0search9

**Use it for:**
- validating normalized `AuditCard` / `AuditDecisionPath` objects
- validating report payloads before writing markdown/json artifacts
- preventing drift between scanner stages

### 4. `fast-check`
Use for property-based testing and fuzz-oriented calibration. Its docs describe it as a property-based testing framework for JavaScript and TypeScript that works with runners including Vitest. citeturn0search2

**Use it for:**
- trigger attainability and state-sampling harnesses
- runtime-diff invariants
- regression tests against scanner false positives / false negatives
- finding weird edge-state combinations that example-based tests miss citeturn0search6

### Suggested install command

```bash
npm install -D ts-morph tsquery ajv fast-check
```

### Dependency stance

- `ts-morph`, `ajv`, and `fast-check` are strongly recommended.
- `tsquery` is also recommended, but can be treated as a companion convenience layer if `ts-morph` alone proves sufficient.

---

## Guiding design rules

1. **Audit runtime truth before authoring assumptions.**
2. **Generated families must be audited as generated families, not awkwardly coerced into `EVENT_POOL` logic.**
3. **Inline families must be audited via AST/static analysis, not only text coverage.**
4. **Every finding must declare its confidence level.**
5. **A family with thin coverage must never appear deceptively green.**
6. **Scanner-model failures must be surfaced explicitly instead of polluting card findings.**

---

## High-level architecture target

The end state should have five layers.

### Layer 1. Source adapters
Family-specific adapters gather raw authored/generated/inline data and normalize it into a shared model.

### Layer 2. Normalized audit IR
All scans operate on a common intermediate representation instead of each scan re-learning family quirks.

### Layer 3. Runtime contract map
A small registry describes how each family actually resolves in runtime.

### Layer 4. Scan engine
Scans run by class:
- deterministic
- runtime-grounded
- heuristic

### Layer 5. Reporting and coverage
Reports include findings, coverage, confidence class, and engine-model mismatches.

---

## Core data model to introduce

Create a normalized audit IR in `scripts/audit/ir.ts`.

### `AuditCard`

```ts
interface AuditCard {
  id: string;
  family: AuditFamily;
  sourceKind: 'authored' | 'generated' | 'inline';
  runtimePath: RuntimePathKind;
  filePath?: string;
  title?: string;
  body?: string;
  severityHint?: string | null;
  metadata: Record<string, unknown>;
  choices: AuditDecisionPath[];
  coverage: AuditCoverageFlags;
}
```

### `AuditDecisionPath`

```ts
interface AuditDecisionPath {
  cardId: string;
  family: AuditFamily;
  choiceId: string;
  label?: string;
  effectSourceKind: 'event-effects' | 'assessment-effects' | 'negotiation-effects' | 'inline-apply' | 'generated-inline' | 'none';
  textSourceKind: 'event-text' | 'assessment-text' | 'negotiation-text' | 'overture-text' | 'inline-text' | 'world-text' | 'none';
  declaredEffects: Record<string, unknown> | null;
  declaredStructuralMarkers: StructuralMarkerSummary;
  pressureKey?: string | null;
  consequenceTagsProduced: string[];
  consequenceTagsConsumed: string[];
  followUps: string[];
  runtimeTouchHints: string[];
  contextRequirements: string[];
  previewText?: string | null;
}
```

### `AuditCoverageFlags`

```ts
interface AuditCoverageFlags {
  textCoverage: boolean;
  effectCoverage: boolean;
  runtimeDiffCoverage: boolean;
  pressureCoverage: boolean;
  consequenceCoverage: boolean;
  generatedFamilyCoverage: boolean;
  astSemanticCoverage: boolean;
  previewParityCoverage: boolean;
}
```

### `RuntimePathKind`

```ts
type RuntimePathKind =
  | 'event-resolution'
  | 'direct-effect-assessment'
  | 'direct-effect-negotiation'
  | 'generated-overture'
  | 'inline-hand-apply'
  | 'world-event-resolution'
  | 'unknown';
```

### Validation
Use Ajv to validate the IR before scans run and again before reports are emitted. citeturn0search5turn0search9

---

## New finding classes

Update `scripts/audit/types.ts` so findings include both severity and confidence.

### Severity
Keep existing severity levels:
- `CRITICAL`
- `MAJOR`
- `MINOR`
- `POLISH`

### Confidence class
Add:
- `DETERMINISTIC`
- `RUNTIME_GROUNDED`
- `HEURISTIC`
- `ENGINE_MISMATCH`

### Why `ENGINE_MISMATCH` matters
This separates:
- real card/content issues
- scanner assumptions that disagree with runtime

Examples that should land here immediately:
- scanner assumes assessments behave like normal event choices
- scanner counts pressure keys that runtime never applies
- scanner counts a tag source that no runtime path actually writes

---

## Planned folder and file changes

### Existing files to modify

- `scripts/audit/corpus.ts`
- `scripts/audit/index.ts`
- `scripts/audit/inventory.ts`
- `scripts/audit/reporter.ts`
- `scripts/audit/seeder.ts`
- `scripts/audit/types.ts`
- `scripts/audit/category-map.ts`
- `scripts/audit/scans/shared.ts`
- `scripts/audit/calibration.test.ts`
- `scripts/audit/smoke.test.ts`

### New files to add

```text
scripts/audit/
  ir.ts
  ir-schema.ts
  runtime-paths.ts
  ast/
    project.ts
    queries.ts
    hand-card-analyzer.ts
    runtime-writer-reader-index.ts
  runtime/
    diff.ts
    classifier.ts
    harness.ts
    fixtures.ts
  adapters/
    events.ts
    decrees.ts
    assessments.ts
    negotiations.ts
    overtures.ts
    hand-cards.ts
    world-events.ts
  coverage/
    matrix.ts
  scans/
    engine/
      pressure-prefix-parity.ts
      runtime-path-parity.ts
      consequence-write-parity.ts
      text-source-parity.ts
    assessments/
      text-coverage.ts
      runtime-structural-depth.ts
      neighbor-resolution-parity.ts
      pressure-wiring.ts
    negotiations/
      text-coverage.ts
      reject-text-coverage.ts
      term-distinctness.ts
      bond-materialization-parity.ts
      pressure-wiring.ts
    overtures/
      agenda-coverage.ts
      placeholder-resolution.ts
      synthetic-id-roundtrip.ts
      grant-deny-runtime-parity.ts
      effect-hint-parity.ts
    hand/
      requires-choice-used.ts
      no-op-apply.ts
      runtime-structural-depth.ts
      expiry-sanity.ts
      temp-modifier-shape.ts
      choice-fallback-risk.ts
    decrees/
      preview-parity.ts
      handler-feature-parity.ts
      chain-tier-policy.ts
      high-impact-depth.ts
    text/
      promise-delivery.ts
      scope-mismatch.ts
```

### Optional later additions

```text
scripts/audit/
  export-json.ts
  inspect-card.ts
  inspect-family.ts
```

These can provide debug-focused JSON outputs or ad hoc inspection tools later.

---

## Phase 0 — Correct the audit’s worldview before adding more scanners

This phase is mandatory. Do not skip ahead.

### 0.1 Fix family-aware text lookup
Create a shared text-source resolver and stop treating everything as `EVENT_TEXT`.

**Must correctly support at minimum:**
- event text
- assessment text
- negotiation text
- overture text
- inline hand-card text
- world event text

**Actions:**
- add `getTextEntryForFamily(...)`
- update `missing-text`
- update `choice-label-coverage`
- update `unresolved-tokens`

**Acceptance gate:**
- assessment text is no longer read through `EVENT_TEXT`
- negotiation text is no longer treated as “has terms = good enough”
- overtures are no longer invisible to text scans

### 0.2 Formalize runtime paths
Introduce `runtime-paths.ts` with an explicit family-to-runtime-path map.

**Document at least:**
- authored events → `event-resolution`
- assessments → `direct-effect-assessment`
- negotiations → `direct-effect-negotiation`
- overtures → `generated-overture`
- hand cards → `inline-hand-apply`

**Acceptance gate:**
- every family has an explicit runtime-path classification
- scans can query runtime path instead of guessing it indirectly

### 0.3 Add engine mismatch detection
Introduce `ENGINE_MISMATCH` findings and emit them when scanner assumptions disagree with runtime shape.

**Initial targets:**
- pressure source-type mismatch
- consequence producer/consumer mismatch
- family runtime-path mismatch

### 0.4 Replace duplicated schema assumptions where possible
Stop manually mirroring source-of-truth structures when they can be derived.

**Examples:**
- avoid hand-maintained effect-field mirrors when runtime/state diff can classify touches
- reduce regex-based file-path inference if AST-backed indexing can resolve origins more safely

---

## Phase 1 — Build adapters and normalized IR

This phase makes the scanner family-aware without making each scan family-specific.

### 1.1 Add source adapters
Each adapter returns normalized `AuditCard[]` for one family.

#### Events adapter
Source:
- event pools
- event text
- event effects
- temporary modifiers
- style tags
- follow-up tables

#### Assessments adapter
Source:
- assessment generator-visible definitions
- `ASSESSMENT_TEXT`
- `ASSESSMENT_EFFECTS`
- direct-effect resolution semantics

#### Negotiations adapter
Source:
- negotiation generator-visible definitions
- `NEGOTIATION_TEXT`
- `NEGOTIATION_EFFECTS`
- direct-effect resolution semantics
- term-to-bond mapping

#### Overtures adapter
Source:
- `OVERTURE_TEXT`
- overture generator/spec builders
- agenda-specific synthetic event creation
- grant/deny effect wiring

#### Hand-card adapter
Source:
- `src/data/cards/hand-cards.ts`
- `src/data/cards/hand-cards-expanded.ts`
- inline `apply` functions
- `expiresAfterTurns`
- `requiresChoice`

#### Decrees adapter
Source:
- decree definitions
- decree effect previews
- decree progression/handler semantics
- relevant downstream readers/writers

### 1.2 Validate IR with Ajv
Create schemas for `AuditCard[]` and emitted findings. Validate at both adapter output and report output stages. citeturn0search1turn0search9

### 1.3 Add coverage flags to the IR
Each adapter must explicitly declare which coverage areas it truly supports.

**Acceptance gate:**
- one scan can run against all families through normalized IR
- reports can say “not covered” instead of implying a false pass

---

## Phase 2 — Add AST-backed source intelligence

This is where the scanner stops acting like a spreadsheet and starts behaving like tooling.

### 2.1 Create a shared AST project helper
Add `scripts/audit/ast/project.ts` using `ts-morph` to load the repo through `tsconfig`. The library is designed to simplify TypeScript AST setup/navigation compared with the raw compiler API. citeturn0search0

### 2.2 Add targeted tsquery selectors
Use `tsquery` for focused pattern checks where selectors are cleaner than manual tree walking. Its selector-based query model is specifically designed for this sort of AST search. citeturn0search3

### 2.3 Build a runtime writer/reader index
Create a reusable index that answers questions like:
- where are `persistentConsequences` written?
- where are they read?
- where is `applyPressure(...)` called?
- which source-type strings are actually used?
- where are bonds created?
- where are temporary modifiers queued?

This should power multiple engine scans instead of re-searching source files in every scan.

### 2.4 Add a hand-card analyzer
The hand-card analyzer should inspect inline `apply` functions and extract semantic hints such as:
- whether `choice` is used meaningfully
- whether the function can return unchanged state on all normal paths
- whether rival/class fallback behavior silently undermines the declared targeting model
- whether the function queues a temporary modifier, changes policy-like state, alters relationships, mutates projects, or removes/adds persistent consequences

**Acceptance gate:**
- no new hand-card scan should need to regex the source file directly

---

## Phase 3 — Build runtime-diff infrastructure

This is the most important capability upgrade in the plan.

### 3.1 Create a runtime harness
Add `scripts/audit/runtime/harness.ts`.

This harness should execute real resolution paths against representative fixture states.

**Required support:**
- event choices through standard event-resolution-compatible logic where practical
- assessments through `applyDirectEffects`
- negotiations through `applyDirectEffects`
- overtures through their real generated application path
- hand cards through inline `apply`
- decrees through the real decree application path or a wrapper around it

### 3.2 Create state diffing
Add `runtime/diff.ts` and `runtime/classifier.ts`.

The diff/classifier should map changed state paths into categories such as:
- surface
- structural
- diplomatic
- temporal
- narrative
- operations/agents
- region/infrastructure
- policy/initiative
- construction/project

### 3.3 Build a structural fingerprint
For each choice/action, store a compact fingerprint summarizing what *actually changed* in runtime.

Example:

```ts
{
  touches: ['diplomacy.relationshipScore', 'diplomacy.bonds'],
  classes: ['surface', 'structural', 'diplomatic'],
  structuralCount: 1,
  surfaceCount: 1,
  noOp: false
}
```

### 3.4 Use runtime diff as the main truth source for substance checks
Once runtime diff exists, downgrade purely table-inferred substance scans where appropriate.

**Acceptance gate:**
- “surface-only” can use runtime-diff truth instead of only table heuristics
- hand cards, overtures, negotiations, and assessments can all be judged on real state changes

---

## Phase 4 — Add engine reality scans

These scans should ship before most new family-level content scans.

### 4.1 `engine.text-source-parity`
Verify the scanner is reading the correct text table/source for each family.

### 4.2 `engine.runtime-path-parity`
Verify the scanner’s runtime-path assumptions match real code.

### 4.3 `engine.pressure-prefix-parity`
Compare all pressure keys/prefixes against actual `applyPressure(...)` call sites and real source-type usage.

This scan should answer:
- which prefixes are live
- which prefixes are dead or currently unused
- whether the rules doc and runtime are aligned on what counts as a narrative-pressure nudge

### 4.4 `engine.consequence-write-parity`
Compare consequence producer assumptions in the audit against actual runtime writers.

### 4.5 `engine.reader-writer-roundtrip`
For tags, pressure keys, bonds, or temporary modifiers, flag cases where the audit counts a thing structurally but runtime never writes it, or runtime writes it but no scan is tracking it.

**Acceptance gate:**
- the audit can explain what is live, dead, or mismodeled in engine terms

---

## Phase 5 — Family-specific scanners

Only start these after Phases 0–4 are in place.

---

## Phase 5A — Assessments

### Scans to add
- `assessments/text-coverage`
- `assessments/runtime-structural-depth`
- `assessments/neighbor-resolution-parity`
- `assessments/pressure-wiring`

### Goals
- read `ASSESSMENT_TEXT` correctly
- understand that assessments resolve through `applyDirectEffects`
- validate whether neighbor placeholders/materialization line up with text and runtime
- stop treating assessments like ordinary event choices if runtime does not

### Acceptance gate
- no assessment finding should depend on `EVENT_TEXT`
- assessment structural classification comes from runtime diff, not guesswork alone

---

## Phase 5B — Negotiations

### Scans to add
- `negotiations/text-coverage`
- `negotiations/reject-text-coverage`
- `negotiations/term-distinctness`
- `negotiations/bond-materialization-parity`
- `negotiations/pressure-wiring`

### Goals
- validate term labels and reject text properly
- ensure accepted term IDs that claim bond-like consequences actually materialize them
- ensure “reject” is not mechanically hollow when text frames it as significant
- treat negotiations as a distinct family instead of an event cousin

### Acceptance gate
- negotiations have full text coverage, runtime depth checks, and bond parity checks

---

## Phase 5C — Overtures

### Scans to add
- `overtures/agenda-coverage`
- `overtures/placeholder-resolution`
- `overtures/synthetic-id-roundtrip`
- `overtures/grant-deny-runtime-parity`
- `overtures/effect-hint-parity`

### Goals
- audit overtures as generated cards
- ensure every agenda has complete text coverage
- ensure synthetic IDs and generated specs stay round-trippable
- compare inline effect hints against runtime reality

### Acceptance gate
- overtures no longer rely on proxy event scans for coverage

---

## Phase 5D — Hand cards

### Scans to add
- `hand/requires-choice-used`
- `hand/no-op-apply`
- `hand/runtime-structural-depth`
- `hand/expiry-sanity`
- `hand/temp-modifier-shape`
- `hand/choice-fallback-risk`

### Goals
- detect cards declaring `requiresChoice` but ignoring it in practice
- detect cards whose `apply` is effectively a no-op or only conditionally meaningful in a suspicious way
- classify actual touched state paths
- catch hidden fallback behavior that undermines card identity

### Acceptance gate
- hand-card auditing is no longer limited to text completeness

---

## Phase 5E — Decrees

### Scans to add
- `decrees/preview-parity`
- `decrees/handler-feature-parity`
- `decrees/chain-tier-policy`
- `decrees/high-impact-depth`

### Goals
- compare preview text with actual runtime outcomes
- align decree rules with the current decree model instead of relying on a partially outdated rarity framing
- ensure high-impact/deeper-tier decrees actually do deep work

### Acceptance gate
- a “clean” decree page means the audit really checked decree depth, not just wiring

---

## Phase 5F — Text and coherence scanners

These should build on the normalized IR plus runtime diff.

### Scans to add
- `text/promise-delivery`
- `text/scope-mismatch`

### Guidance
Start simple. Use conservative, obvious keyword and effect-scope rules first. Keep these as `HEURISTIC` until calibrated heavily.

---

## Phase 6 — Upgrade existing scanners to use stronger truth sources

Do not leave older scans frozen on weaker logic if better infrastructure now exists.

### Existing scans to revisit
- `substance/surface-only`
- `substance/category-without-touch`
- `substance/choice-clones`
- `substance/severity-magnitude`
- `reach/trigger-attainability`
- `wiring/tag-producers`
- `wiring/tag-consumers`

### Required upgrades

#### `surface-only`
Should use runtime fingerprints and live structural writers, not only tables.

#### `choice-clones`
Should compare structural fingerprints and scope, not just shallow field differences.

#### `tag-producers` / `tag-consumers`
Should be informed by the runtime writer/reader index where possible.

#### `trigger-attainability`
Should eventually use `fast-check`-powered state generation and property-style sampling instead of only static heuristics. Property-based testing is specifically useful for uncovering edge cases and hard-to-reach combinations. citeturn0search2turn0search6

---

## Phase 7 — Reporting, coverage, and artifact output

### 7.1 Add coverage reporting
Every family report should include a coverage matrix.

Example:

| Coverage area | Status |
|---|---|
| text integrity | covered |
| effect table coverage | covered |
| runtime diff | covered |
| pressure parity | not covered |
| AST semantic analysis | covered |
| generated-family audit | covered |
| preview parity | partial |

This prevents a false “green” state when a family simply has thin scanner coverage.

### 7.2 Show confidence class in findings
Each finding should clearly indicate whether it is deterministic, runtime-grounded, heuristic, or engine-mismatch.

### 7.3 Add machine-readable artifact output
In addition to markdown reports, emit JSON.

Suggested files:

```text
docs/audit/findings.json
docs/audit/coverage.json
docs/audit/engine-mismatches.json
```

Use Ajv to validate these outputs before writing them. citeturn0search5turn0search9

### 7.4 Keep seeded markdown, but derive it from richer output
The current seeded findings docs are useful. Keep them, but build them from the richer validated report model.

---

## Phase 8 — Calibration and test strategy

The scanner should not be trusted without a stronger test harness.

### 8.1 Expand calibration fixtures
Add:
- known-good cards
- known-bad cards
- known-generated overture cases
- known inline hand-card patterns
- known engine mismatch examples

### 8.2 Add property-based tests with `fast-check`
Use `fast-check` with Vitest for:
- state-sampling and trigger attainability experiments
- diff-classifier invariants
- “runtime diff never claims structural when no structural slice changed” checks
- “no-op detection does not misclassify obvious state writers” checks citeturn0search2

### 8.3 Regression packs
For every bug fixed in the audit model, add a regression test.

Examples:
- assessment text previously read from the wrong table
- negotiation text not actually validated
- overture agenda missing text but passing scans
- pressure prefixes existing in weights but unused in runtime
- hand card declares `requiresChoice` yet ignores it

### 8.4 Add a confidence threshold rule
A new scan should not be considered “green” until it has:
- at least one known-good fixture
- at least one known-bad fixture
- one real-corpus anchor case

---

## Suggested implementation order

Follow this order exactly unless a blocker forces a local swap.

1. Phase 0 — worldview corrections
2. Phase 1 — adapters and IR
3. Phase 2 — AST intelligence
4. Phase 3 — runtime diff infrastructure
5. Phase 4 — engine reality scans
6. Phase 5D — hand cards
7. Phase 5A — assessments
8. Phase 5B — negotiations
9. Phase 5C — overtures
10. Phase 5E — decrees
11. Phase 6 — upgrade old scans
12. Phase 7 — reporting and JSON output
13. Phase 8 — calibration and fuzz/property testing

### Why this order
- It fixes the audit’s assumptions before adding more conclusions.
- It gets the biggest leverage families first.
- It prevents “more scan names, same weak truth source.”

---

## Short execution checklist

### Milestone 1 — worldview corrected
- [ ] family-aware text resolver added
- [ ] runtime path registry added
- [ ] `ENGINE_MISMATCH` finding class added
- [ ] pressure-prefix parity scan added
- [ ] consequence writer/reader parity scan added

### Milestone 2 — scanner foundation rebuilt
- [ ] adapters added for every family
- [ ] normalized IR added and validated with Ajv
- [ ] coverage flags emitted per family
- [ ] AST project helper in place

### Milestone 3 — runtime truth online
- [ ] runtime harness added
- [ ] diff + classifier added
- [ ] runtime fingerprints emitted for targeted families

### Milestone 4 — family depth online
- [ ] hand-card semantic scans added
- [ ] assessment scans added
- [ ] negotiation scans added
- [ ] overture scans added
- [ ] decree scans added

### Milestone 5 — reports trustworthy
- [ ] coverage matrix appears in reports
- [ ] JSON artifacts emitted and validated
- [ ] calibration/regression pack expanded

---

## Acceptance criteria for the whole overhaul

Do not call this complete until all of the following are true:

1. **No family is judged through the wrong text source.**
2. **Every family has an explicit runtime path.**
3. **Generated families are audited as generated families.**
4. **Inline families are audited through AST/static analysis.**
5. **Runtime-grounded scans exist for at least hand cards, assessments, negotiations, overtures, and decrees.**
6. **Reports show both findings and coverage.**
7. **Engine-model mismatches are isolated from content findings.**
8. **At least one property-based or fuzz-style calibration layer exists for the hardest scans.**
9. **A family page showing zero findings can be trusted to mean “covered and clean,” not merely “barely checked.”**

---

## Nice-to-have follow-ups after the overhaul

These are useful, but should not delay the core plan.

- CLI inspector for one card/family
- HTML or richer local viewer for audit output
- trend tracking across runs
- autofixers for low-risk deterministic issues
- “why this finding exists” debug traces for complex scans

---

## Final rule for implementation

When deciding between “add another heuristic scan” and “improve the scanner’s source of truth,” prefer the stronger source of truth.

The main failure mode of the current audit is not lack of scan count. It is lack of runtime-backed certainty.
