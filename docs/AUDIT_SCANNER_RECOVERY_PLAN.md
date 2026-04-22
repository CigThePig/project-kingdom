# Audit Scanner Recovery Plan

## Purpose

This plan replaces `AUDIT_SCANNER_OVERHAUL_PLAN.md`. The previous overhaul shipped — adapters, IR, runtime harness, AST helpers, coverage matrix, JSON artifacts, 47 scans across 7 families. The architecture is sound. The output is not.

A fresh run of `npm run audit` against the current corpus:

```
[audit] 47 scans · 0 findings (CRITICAL=0 MAJOR=0 MINOR=0 POLISH=0) · 7322 ms
```

793 cards, zero findings. The `evt_exp_eco_tax_dispute` calibration anchor in `CARD_AUDIT_RULES.md` §14 — the document's own gold-standard example of a card that should fail substance, smart-card coverage, and choice differentiation — is reported clean. The overhaul did not deliver on its own acceptance criterion #9: *"a family page showing zero findings can be trusted to mean covered and clean, not merely barely checked."*

This plan does not redesign anything. It fixes three specific gaps that, together, are responsible for the false-green state.

---

## Diagnosis

Coverage is uneven. From `docs/audit/coverage.json`:

| Coverage flag | Cards covered |
|---|---|
| textCoverage | 793/793 (100%) |
| effectCoverage | 741/793 (93%) |
| pressureCoverage | 707/793 (89%) |
| consequenceCoverage | 707/793 (89%) |
| previewParityCoverage | 741/793 (93%) |
| **runtimeDiffCoverage** | **173/793 (22%)** |
| **astSemanticCoverage** | **40/793 (5%)** |
| **generatedFamilyCoverage** | **12/793 (2%)** |

The three coverage areas the overhaul was specifically built to add are barely online. Three specific causes follow.

### Cause 1 — the harness skips events and world events

`scripts/audit/runtime/harness.ts` `runChoice()` returns `supported: false` for `event-resolution` and `world-event-resolution`:

```ts
case 'event-resolution':
case 'world-event-resolution':
  return {
    supported: false,
    reason: `runtime path ${card.runtimePath} not yet supported by harness`,
  };
```

Petitions, crises, and world events make up the majority of the corpus. None of them get runtime fingerprints, so `corpus.ts:139` never flips `runtimeDiffCoverage` to true for them.

### Cause 2 — 21 of 47 scans early-exit when there's no fingerprint

A grep for `if (!card.coverage.runtimeDiffCoverage) continue;` and equivalent fingerprint guards turns up 21 scans that no-op on cards without runtime data. Combined with cause 1, this means roughly half the scanner is dark for ~80% of the corpus.

### Cause 3 — the fallback heuristic in `surface-only` is too generous

The table-shape fallback used for cards that can't be fingerprinted is a six-way OR:

```ts
isStructural = hasTempMod || hasFeatureEntry || hasStyleTag || hasFollowUp 
            || tagReadElsewhere || regionConditionStructural;
```

Walking the §14 anchor through this:

- `enforce_full_collection` passes via `regionConditionStructural` (`affectsRegion: true` + `regionConditionDelta: -1`).
- `grant_partial_amnesty` passes via the one follow-up that exists.
- `defer_collection_to_next_season` passes via its single style-tag entry.

Every choice trips at least one marker. The card the rules doc itself describes as substantively thin gets clean-billed.

### Cause 4 — §3's smart-card placeholder rule has no implementation

`CARD_AUDIT_RULES.md` §3 says: *"if a card references a named engine entity available in context (`affectedRegionId`, `affectedClassId`, `affectedNeighborId`), the body must name that entity at least once. Region-scoped crisis rendering 'a remote province' when `affectedRegionId` is populated = MAJOR."* The closest existing scan, `text/scope-mismatch`, only checks the inverse direction (named region without the flag set). The body-must-name-the-entity rule has no scan at all.

---

## Non-goals

This plan does not:

- redesign the IR, the runtime harness architecture, or the coverage matrix
- add new families or new runtime paths
- attempt to mechanize §2's substance judgments past what's testable, §4's tone matching, or §9's family-specific taste rules
- change what the wiring scans (missing text, missing effects, dead follow-ups, unresolved tokens) currently do — those work and stay

What this plan deliberately leaves unmechanized:

- "Would you author this card from scratch today" (§7)
- "Tone matches family" (§3)
- Pattern A vs Pattern C boundary judgments (§1, §10)
- "Choices meaningfully distinct *as concepts*" (§5.1)

These are taste judgments. The right tool is per-family human or LLM-assisted review using §14 as the calibration anchor, not more scans. See "Beyond the scanner" at the end of this plan.

---

## Fix 1 — Add event-resolution support to the harness

This is the highest-leverage change in the repo. It unlocks the 21 fingerprint-gated scans across ~620 cards.

### Files

- **modify:** `scripts/audit/runtime/harness.ts` — implement `runEvent` and route `event-resolution` and `world-event-resolution` through it
- **modify:** `scripts/audit/runtime/fixtures.ts` — extend the canonical `GameState` fixture if needed so events with `affectsRegion`/`affectsClass`/`affectedNeighborId` have a well-formed target in state

### Implementation

`runEvent` follows the same pattern as `runDecree` (`harness.ts:219`). It wraps three steps:

1. Build a transient `ActiveEvent` from the card's `EventDefinition` (`ActiveEvent` shape at `engine/types.ts:1019`; construction analog at `event-engine.ts:489`).
2. Mark the event resolved with the chosen `choiceId` (mirrors `resolveEventChoice` at `event-engine.ts:694`).
3. Call `applyEventChoiceEffects(state, event, EVENT_CHOICE_EFFECTS, rng)` (signature at `apply-event-effects.ts:240`). For `world-event-resolution`, swap in `WORLD_EVENT_CHOICE_EFFECTS`.

Sketch:

```ts
function runEvent(
  card: AuditCard,
  choice: AuditDecisionPath,
  state: GameState,
  effectsRegistry: typeof EVENT_CHOICE_EFFECTS | typeof WORLD_EVENT_CHOICE_EFFECTS,
): HarnessResult {
  const def = EVENT_POOL.find((e) => e.id === card.id);
  if (!def) return { supported: false, reason: `event ${card.id} not in pool` };

  const activeEvent: ActiveEvent = {
    id: `audit-${card.id}`,
    definitionId: card.id,
    severity: def.severity,
    category: def.category,
    isResolved: true,
    choiceMade: choice.choiceId,
    chainId: def.chainId,
    chainStep: def.chainStep,
    turnSurfaced: 0,
    affectedRegionId: pickFixtureRegion(card, state),
    affectedClassId: pickFixtureClass(card),
    affectedNeighborId: pickFixtureNeighbor(card, state),
    relatedStorylineId: def.relatedStorylineId,
    outcomeQuality: null,
    isFollowUp: false,
    followUpSourceId: null,
  };

  const rng = () => 0.5;  // deterministic median outcome
  const { state: after } = applyEventChoiceEffects(state, activeEvent, effectsRegistry, rng);
  return { supported: true, before: state, after };
}
```

Then update `runChoice`'s switch:

```ts
case 'event-resolution':
  return runEvent(card, choice, state, EVENT_CHOICE_EFFECTS);
case 'world-event-resolution':
  return runEvent(card, choice, state, WORLD_EVENT_CHOICE_EFFECTS);
```

### Picking targets

The fixture state already has at least one region and one neighbor. Three small helpers — `pickFixtureRegion(card, state)`, `pickFixtureClass(card)`, `pickFixtureNeighbor(card, state)` — should return the relevant target only when the card declares it (`affectsRegion: true`, `affectsClass: ...`, or carries an `affectedNeighborId`-shaped trigger). When the flag is false, return `null`. This matters because `applyEventChoiceEffects` scopes some deltas (notably `regionConditionDelta`) to `affectedRegionId`, and the diff classifier needs to see the right post-state.

### Determinism

`applyEventChoiceEffects` takes an `rng` for outcome variance. Pass `() => 0.5` so every harness run produces the median outcome and fingerprints are stable across runs.

### Variants

Events don't generally have `requiresChoice: 'class' | 'rival'` the way hand cards do. The base `runChoice` path is sufficient — `runChoiceVariants` does not need to be wired for events.

### Acceptance gate

- A fresh `npm run audit` shows `runtimeDiffCoverage` for events and world events at ≥85% of the eligible corpus (the remainder being follow-ups or chain children that legitimately can't fire from the fixture state).
- The 21 fingerprint-gated scans now produce output for at least one petition and one crisis.
- Re-running the audit on the unmodified `evt_exp_eco_tax_dispute` produces a non-empty fingerprint for at least one of its three choices.

---

## Fix 2 — Tighten the `surface-only` fallback heuristic

The runtime-grounded path in `surface-only.ts` is fine. The fallback path needs calibration to match the §2 severity-scaling corollary in `CARD_AUDIT_RULES.md`.

### Files

- `scripts/audit/scans/substance/surface-only.ts`
- `scripts/audit/scans/substance/surface-only.test.ts`

### Rule change

The current `isStructural = A || B || C || D || E || F` is too permissive. Replace with a tier-aware rule that mirrors §2's severity-scaling corollary:

| Card severity | Required structural markers |
|---|---|
| Critical / Defining | At least 2 of: temp modifier, kingdom feature, follow-up, tag-read-elsewhere. Style tag and `regionConditionStructural` do **not** count. |
| Serious / Rare | At least 1 of: temp modifier, kingdom feature, follow-up, tag-read-elsewhere. Style tag and `regionConditionStructural` do **not** count. |
| Notable / Uncommon | At least 1 of any marker (current behavior). |
| Informational / Common | At least 1 of any marker (current behavior). |

Rationale: style tags are pervasive in the corpus (basically every card has one), so they're useless as a structural signal at higher severity. `regionConditionStructural` is a real persisting effect, but a single `-1` on `regionConditionDelta` is not what the rules doc means by "structural" for a Critical-tier card.

### Sketch

```ts
const STRONG_MARKERS = ['hasTempMod', 'hasFeatureEntry', 'hasFollowUp', 'tagReadElsewhere'] as const;
const WEAK_MARKERS = ['hasStyleTag', 'regionConditionStructural'] as const;

function structuralVerdict(
  severity: EventSeverity,
  markers: Record<string, boolean>,
): { ok: boolean; reason: string } {
  const strongCount = STRONG_MARKERS.filter((m) => markers[m]).length;
  const weakCount = WEAK_MARKERS.filter((m) => markers[m]).length;

  if (severity === EventSeverity.Critical) {
    return strongCount >= 2
      ? { ok: true, reason: `${strongCount} strong markers` }
      : { ok: false, reason: `Critical requires 2+ strong markers; got ${strongCount} strong, ${weakCount} weak` };
  }
  if (severity === EventSeverity.Serious) {
    return strongCount >= 1
      ? { ok: true, reason: `${strongCount} strong markers` }
      : { ok: false, reason: `Serious requires 1+ strong markers; got ${strongCount} strong, ${weakCount} weak` };
  }
  return strongCount + weakCount >= 1
    ? { ok: true, reason: 'has at least one marker' }
    : { ok: false, reason: 'no markers' };
}
```

The finding `details` block already includes the per-marker breakdown; add the verdict reason so the output makes the calibration rule visible to the reader.

### Decree-tier handling

Decrees use `rarity` rather than `severity`. The same shape applies — `Defining` → 2 strong, `Rare` → 1 strong, `Uncommon`/`Common` → 1 of any. Decrees mostly already have runtime fingerprints (decree harness exists), so they go through the runtime-grounded path; but if a decree falls back to the heuristic, this rule covers it.

### Acceptance gate

- `evt_exp_eco_tax_dispute`'s three choices produce at least one finding once Fix 1 lands and the runtime-grounded path takes over (Notable severity is the loosest tier, but the runtime diff should still expose the surface-only branches).
- A regression test fixture asserts: a Critical-severity card with only `regionConditionStructural` and a style tag fails the scan; a Notable card with the same shape passes (current behavior preserved at lower tiers).
- No regression in existing `surface-only.test.ts` cases that exercise Notable-tier shapes.

---

## Fix 3 — Add `text/smart-card-coverage` scan

This implements the §3 rule that has no current implementation: when a card carries an affected-entity flag, the body must name that entity.

### Files

- **add:** `scripts/audit/scans/text/smart-card-coverage.ts`
- **add:** `scripts/audit/scans/text/smart-card-coverage.test.ts`
- **modify:** `scripts/audit/index.ts` — register the new scan in the pipeline

### Rule

For every card in the IR with a non-empty body:

1. If the card's metadata has `affectsRegion === true`, the body must contain at least one of: `{region}`, `{settlement}`, `{terrain}`, or `{condition_context}` — or, if the harness has produced a fingerprint and the resolved region's name is known, that literal name.
2. If `affectsClass !== null`, the body must mention the class either via a smart token (`{class}`) or by literal name (e.g. "merchants", "the clergy"). Class-name match is case-insensitive against the enum's display name.
3. If `affectedNeighborId` is set on the card or on the trigger, the body must contain a neighbor token (`{neighbor}`, `{rival}`, `{neighbor_capital}`) or the resolved neighbor's name.

A miss on any active flag is a MAJOR finding with code `SMART_CARD_COVERAGE_<DIMENSION>`. Confidence is `DETERMINISTIC` — this is a flag-vs-body string match, no runtime inference required.

### Important — this scan does not require `runtimeDiffCoverage`

Unlike `text/scope-mismatch` and `text/promise-delivery`, this scan should run on every card in `corpus.auditCards` regardless of fingerprint availability. The body string and the metadata flags are both populated by the family adapters during foundation-phase corpus loading. **Do not** add an `if (!card.coverage.runtimeDiffCoverage) continue;` guard.

### Sketch

```ts
const REGION_TOKENS = /\{(region|settlement|terrain|condition_context|region_\w+)\}/i;
const CLASS_TOKENS = /\{class(_\w+)?\}/i;
const NEIGHBOR_TOKENS = /\{(neighbor|rival|neighbor_\w+)\}/i;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  for (const card of corpus.auditCards) {
    const body = card.body;
    if (!body) continue;

    const meta = card.metadata as {
      affectsRegion?: boolean;
      affectsClass?: PopulationClass | null;
      affectedNeighborId?: string | null;
    } | undefined;

    if (meta?.affectsRegion === true && !REGION_TOKENS.test(body)) {
      out.push({ /* MAJOR, SMART_CARD_COVERAGE_REGION */ });
    }
    if (meta?.affectsClass != null) {
      const className = classDisplayName(meta.affectsClass);
      const namedLiterally = new RegExp(`\\b${className}\\b`, 'i').test(body);
      if (!namedLiterally && !CLASS_TOKENS.test(body)) {
        out.push({ /* MAJOR, SMART_CARD_COVERAGE_CLASS */ });
      }
    }
    if (meta?.affectedNeighborId && !NEIGHBOR_TOKENS.test(body)) {
      out.push({ /* MAJOR, SMART_CARD_COVERAGE_NEIGHBOR */ });
    }
  }
  return out;
};
```

### What this scan deliberately does not do

It does not assess whether the body is *good* — only whether it acknowledges the engine-known entity. A body of "Things happen in {region}." passes this scan even though it would fail any human review. That's intentional: this scan replaces an obvious silent failure mode (the §14 anchor case), not a taste judgment.

### Acceptance gate

- Running the scan on the current corpus produces a non-trivial finding count — at minimum, `evt_exp_eco_tax_dispute` is flagged (`affectsRegion: true`, body says "outlying villages" with no region token).
- The test file covers: card with `affectsRegion: true` and no region token (fail); card with `affectsRegion: true` and `{region}` token (pass); card with `affectsRegion: false` regardless of body (pass); class and neighbor variants of each.

---

## Implementation order

Strict order. Earlier fixes unblock later ones.

1. **Fix 1 first.** Without the harness covering events, Fix 2's runtime-grounded path stays dark for the families that need it, and overall coverage stays ~22%. This is the leverage point.
2. **Fix 3 second.** Independent of Fix 1 — runs without runtime fingerprints — and gives an immediate signal on the corpus once landed. Useful as a sanity check that the new scan plumbing works before changing established scan logic.
3. **Fix 2 last.** With Fix 1 in place, most cards will go through the runtime-grounded path, so the fallback's tightening affects fewer cards but the ones it does affect (events the harness can't fixture) are exactly where the loose heuristic was hiding things.

After all three land:

4. Re-run `npm run audit` and capture the new findings count as the new baseline.
5. **Audit the audit.** Spot-check a sample of MAJOR findings to confirm they're real issues, not scanner artifacts. If false-positive rate is >10% on any single finding code, calibrate before treating the output as a backlog.
6. Only then begin working through the findings as a card-content backlog.

---

## Acceptance criteria for the whole recovery

Do not call this complete until all of the following are true:

1. `npm run audit` produces a non-zero count for at least `MAJOR` findings on the unmodified corpus.
2. `runtimeDiffCoverage` overall is ≥80% (was 22%).
3. `evt_exp_eco_tax_dispute` is flagged by at least one substance scan and at least one text scan.
4. A documented "audit the audit" pass has been performed: at least 20 sampled findings reviewed for truth-vs-noise, false-positive rate recorded.
5. The seeded markdown reports under `docs/audit/findings/` show non-empty content per family.

---

## Beyond the scanner

The scanner's job is to find the *checkable* problems — things with right/wrong answers. Once Fixes 1–3 are in, the remaining gap between scanner output and the full `CARD_AUDIT_RULES.md` rubric is the taste portion of the rules. That is not a scanner gap; it is a different problem.

Recommended approach for the taste portion:

- Use `CARD_AUDIT_RULES.md` §14 (`evt_exp_eco_tax_dispute` rewrite) as the calibration anchor for what a finished card looks like.
- Per-family review batches of 15–30 cards (per §11.3), human-driven, with an LLM as a second pass that grades each card against the §14 shape.
- Output the per-family batches as the existing `docs/audit/findings/<family>.md` files, with LLM-graded findings tagged separately from scanner findings (`source: llm-review` vs `source: scanner`) so future runs don't conflate the two.

This keeps the scanner doing what it can do reliably and removes the burden of trying to mechanize taste — which is what produced the green-by-default state this plan exists to fix.

---

## File summary

**Modified**

- `scripts/audit/runtime/harness.ts` — add `runEvent`, route event paths
- `scripts/audit/runtime/fixtures.ts` — extend fixture if needed for event targets
- `scripts/audit/scans/substance/surface-only.ts` — tier-aware fallback heuristic
- `scripts/audit/scans/substance/surface-only.test.ts` — regression tests
- `scripts/audit/index.ts` — register `text/smart-card-coverage`

**Added**

- `scripts/audit/scans/text/smart-card-coverage.ts`
- `scripts/audit/scans/text/smart-card-coverage.test.ts`

**Replaced**

- `docs/AUDIT_SCANNER_OVERHAUL_PLAN.md` → `docs/AUDIT_SCANNER_RECOVERY_PLAN.md` (this file)

---

## Final rule for implementation

The previous overhaul's failure was top-down: every scan listed in the plan, partial coverage on each. This plan is bottom-up: full coverage on the harness foundation first, then a single calibrated heuristic, then a single new scan for the §3 rule with no implementation. Three fixes, in order, with acceptance gates that fail loudly if the previous step didn't deliver.

When in doubt, prefer fewer scans with higher coverage over more scans with thin coverage. The current state is the proof.
