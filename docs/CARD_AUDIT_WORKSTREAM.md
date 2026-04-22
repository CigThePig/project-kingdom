# Crown & Council — Card Audit & Progression Workstream

> **Purpose.** Operational plan for fixing the card corpus and giving it a felt sense of progression. Companion to `docs/CARD_AUDIT_RULES.md` (verification rules) and `docs/SMART_CARD_ENGINE_SURFACE.md` (authoring tokens). This doc is the *what we do, in what order, to get the corpus green and smart*.

---

## Context

The scanner at `scripts/audit/` was recently fixed. Prior "family green" marks (decrees, crises, petitions, hand cards, overtures, negotiations) were based on faulty scans and are **invalidated**. The first clean run of the corrected scanner shows a true baseline that has never been addressed.

**True baseline, first honest scan:**

| Finding kind | Count | Shape of fix |
|---|---|---|
| `SURFACE_ONLY` | 1,161 | Re-effect: add temp modifier / follow-up / feature / style tag / queried tag to ≥1 choice |
| `PROMISE_NOT_DELIVERED` | 293 | Retext (trim promise) or re-effect (add delivery) |
| `SMART_CARD_COVERAGE_CLASS` | 281 | Retext: thread `{class}` / class-specific supplicant framing |
| `SMART_CARD_COVERAGE_REGION` | 118 | Retext: thread `{region}` / `{settlement}` / `{terrain}` |
| `SCOPE_MISMATCH` | 117 | Align body framing with effect scope (usually retext; sometimes re-scope effects) |
| `CRITICAL_SHALLOW_RUNTIME` | 57 | Hardest: Defining/Critical tier that must establish feature, change policy, or activate storyline |
| `SMART_CARD_COVERAGE_NEIGHBOR` | 36 | Retext: name neighbor via `nameResolver` |
| **Total** | **~2,063** | |

Goals:

1. Close every finding the scanner can produce, severity by severity.
2. Close duplication and family-misplacement (marriage across decree/petition/overture, tax across petition/decree, border across event-chain/decree, guild across petition/decree, festival across event/decree).
3. Add new follow-up cards so primary decisions cascade into a felt sense of progression — the §14 tax-dispute rewrite in `CARD_AUDIT_RULES.md` is the shape, not an exception.
4. Upgrade the card-serving pipeline and token vocabulary where needed so "smarter" cards can actually query the state that would make them smarter.
5. End state: every card passes the 15 standing audit questions below, and the player feels the simulation remembers what they did.

15 phases is the plan; extend to 20 only if system-layer upgrades (phases 18–20) prove necessary. Do not pre-commit to 20.

---

## Standing audit questions (the 15)

Applied to every card touched in every phase. A card is green only when all 15 answer cleanly.

1. **Pattern fit.** Is this Pattern A (active decision), B (state-earned reveal), or C (pure flavor)? If C, why is it in a monthly decision slot?
2. **Family fit.** Is the card in the right family? A supplicant asking = petition, an urgent escalation = crisis, a royal declaration = decree, a two-party exchange = negotiation, a rival opening = overture, an intelligence product = assessment.
3. **Duplicate check.** Are there other versions of this card in other families covering the same trigger niche? (marriage decree vs marriage petition vs dynastic-alliance overture; tax petition vs emergency-levy decree; border crisis vs fortify-borders decree.)
4. **Wiring.** Text entry present? Effects entry present? Every `choiceId` has a label? Every `followUpEvents[].followUpDefinitionId` resolves? Every style-tag points at a real choice?
5. **Smart-card coverage.** If the engine binds `affectsRegionId` / `affectsClass` / `affectsNeighborId` / advisor seat / agent / bond, does the body name it at least once?
6. **Trigger coherence.** Does every specific-state phrase in the body (drought, restive march, empty treasury) have a matching `triggerConditions` entry that gates the card on that state?
7. **Choice distinctness.** Are the 2–4 choices structurally distinct (follow-up, feature, modifier, consequence tag that is read, style axis, pressure axis, scope) — not just sign/magnitude variants of the same surface fields?
8. **Substance (§2).** Does at least one choice leave a mark the simulation can query later? Defining/Critical tier must establish a feature, change a policy, or activate a storyline — temporary modifier alone is insufficient.
9. **Severity–magnitude coherence.** Does `|total_delta|` on the weightiest branch fit the severity tier (Informational 3–15, Notable 10–30, Serious 25–60, Critical 50+)?
10. **Category coherence.** Does a Military card touch military state? Religious → faith/heterodoxy? Economy → treasury/economy/merchants? Food → food/granaries?
11. **Promise ↔ delivery.** Does every concrete image in the body ("a lasting improvement," "generations will stand") have a mechanical backbone?
12. **Progression memory.** Does the card read the player's past? `{prior_decision_clause:*}`, ruling-style note, recent-causal tag, rival memory, resolved storyline, kingdom feature. Rare tier: expected. Common tier: where it fits.
13. **Follow-up shape.** Does at least one branch seed a follow-up commensurate with its tier? (Common → optional; Uncommon → ≥1 branch; Rare → ≥2 branches; Defining/Critical → every consequential branch.)
14. **Cost asymmetry.** Do the choices use different `slotCost` / `isFree` where the fiction allows — the cheap-now-expensive-later option, the free acknowledge, the paid aggressive play?
15. **Authoring self-test.** Would I author this card from scratch today if it didn't exist, given everything the current engine surfaces? If no → rebuild.

---

## Severity priority order (drives phase sequencing)

Stop the bleeding, then fix the integrity spine, then grind the long tail.

1. **CRITICAL_SHALLOW_RUNTIME (57)** — Defining decrees and Critical crises with no structural teeth. These mislabel themselves every time they fire. Highest visibility per card.
2. **PROMISE_NOT_DELIVERED (293)** — text is lying to the player. Either trim the promise or add the delivery; both are cheap and each one closed is a credibility win.
3. **SCOPE_MISMATCH (117)** — same shape as promise/delivery but specifically about kingdom-vs-region framing.
4. **SMART_CARD_COVERAGE_REGION (118) + _NEIGHBOR (36)** — pure retext passes; high reader-impact for low effort; unlocks better tokens everywhere they land.
5. **SMART_CARD_COVERAGE_CLASS (281)** — retext, larger surface, same pattern.
6. **SURFACE_ONLY (1,161)** — the grind. Addressed family-by-family across phases 8–14 with new follow-up cards authored in phase 15 as the progression backbone that absorbs most of the re-effect burden.

New follow-up cards are **not a separate family** — they are the expected output of re-effecting roughly 30–40% of the SURFACE_ONLY findings. The §14 tax-dispute example is the calibration shape.

---

## Phases

Each phase ends with **acceptance gates**: `npm run audit` delta (findings retired, none regressed), `npm test`, `npm run lint`, `npm run build`. No phase is complete while a prior phase's findings re-appear.

The 15 standing audit questions are the lens on every card touched in every phase — they are not re-listed per phase.

---

### Phase 1 — Baseline snapshot & scanner gap closure

**Why first.** Prior green marks are invalid. We need an authoritative baseline and the scanner must cover every rule before manual passes start, or we'll re-learn the same lesson.

**Work.**
- Run `npm run audit -- --include-minor --include-polish` clean-slate. Archive the report as `docs/audit/baseline-<date>.md` — that's the immutable "before."
- Seed per-family finding tables: `npm run audit:seed`.
- Close the scanner coverage gaps from `CARD_AUDIT_RULES.md` §13 that are still heuristic or absent:
  - **Pattern classifier** (A/B/C heuristic): 1-choice + body matches known acknowledgement phrases → B-candidate; otherwise A-required.
  - **Trigger coherence scan**: body contains state words (`drought`, `restive`, `hostile`, `empty treasury`, etc.) → require a `triggerConditions` entry that gates on that state.
  - **Choice distinctness**: ≥3 choices must differ on ≥2 of {follow-up, feature tag, temp modifier, style axis, pressure axis, scope}.
  - **Cost asymmetry**: all choices with identical `slotCost` → flag.
  - **Tone heuristic** (lightweight): family-keyword ratio per family (crisis must contain urgent vocabulary; petition must frame a supplicant verb; decree must use royal first-person) — catches gross miscategorisation, not prose quality.
- Publish the 15-question checklist at `docs/CARD_AUDIT_QUESTIONS.md`.

**Critical files.** `scripts/audit/index.ts`, `scripts/audit/scans/` (new files), `scripts/audit/reporter.ts`, `docs/audit/`, `docs/CARD_AUDIT_RULES.md` (no edits; reference), `docs/CARD_AUDIT_QUESTIONS.md` (new).

**Acceptance.** Scanner coverage reaches ≥95% of `CARD_AUDIT_RULES.md` §13. Baseline snapshot committed. New scans run on the full corpus and the extended finding counts are folded into the phase-target numbers below.

---

### Phase 2 — CRITICAL_SHALLOW_RUNTIME sweep (57 findings)

**Why.** A Critical crisis or Defining decree that does nothing structural is the worst-looking card in the game every time it fires. These sit across decrees + crises, so one focused pass hits the bleeding-edge.

**Work.**
- For each of the 57 findings, decide: re-effect (add feature/policy/storyline-activation/bond) or rebuild (concept is thin).
- Defining decrees must register a `KINGDOM_FEATURE_REGISTRY` entry or flip a `PolicyState` field. No exceptions.
- Critical crises must activate/resolve a storyline, establish a feature, or trigger a bond-level diplomatic change on at least one branch.
- Every re-effect here that doesn't terminate in a feature schedules ≥1 follow-up — those follow-ups are drafted as IDs now and authored in phase 15 (the progression backbone).

**Critical files.** `src/data/decrees/index.ts`, `src/data/decrees/expansion-decrees.ts`, `src/data/decrees/expansion-wave-2/`, `src/data/events/expansion/wave-2/` (crisis), `src/engine/cards/` (`KINGDOM_FEATURE_REGISTRY` wiring), `src/data/events/followup-events.ts` (stub IDs only this phase).

**Acceptance.** `npm run audit -- --family=decrees,crises --fail-on=critical` returns 0 `CRITICAL_SHALLOW_RUNTIME`. Phase gate passes.

---

### Phase 3 — PROMISE_NOT_DELIVERED wave 1 (target ~150 of 293)

**Why.** Text integrity. Every card here has a body saying something the effects don't back. Triage: "promise is the right design, effect is the bug" → re-effect; "promise is flowery and the effect is correct" → retext.

**Work.**
- Group findings by file to keep edits batched.
- For each card: read body, read effects, pick retext or re-effect. Bias toward adding delivery when the concrete image ("granaries stand," "roads improved," "priests reconciled") is structural; bias toward trimming when it's orphaned metaphor.
- Capture every re-effect that needs a follow-up as a stub ID for phase 15.

**Critical files.** Broad across families; most concentration expected in `src/data/events/expansion/`, `src/data/decrees/`, `src/data/events/negotiations.ts`, `src/data/events/assessments.ts`, `src/data/overtures/wave-2/`.

**Acceptance.** `PROMISE_NOT_DELIVERED` down by ≥150. None of the retired ones regress. Families touched see no new findings.

---

### Phase 4 — PROMISE_NOT_DELIVERED wave 2 (remaining ~143) + SCOPE_MISMATCH (117)

**Why.** Finish the promise/delivery spine. Scope mismatch is the same shape of bug (body says kingdom-wide, effects hit one region — or vice versa), so folding it in now keeps the mental model hot.

**Work.**
- Same triage as Phase 3 for the remaining promise/delivery rows.
- Scope mismatches: usually retext (shrink the framing) but sometimes the effect is under-scoped and should fan out via `regionConditionDelta` / class deltas. Per-finding judgment.

**Acceptance.** `PROMISE_NOT_DELIVERED` = 0 and `SCOPE_MISMATCH` = 0 across all families. `npm run audit -- --fail-on=major` passes for these two scans.

---

### Phase 5 — SMART_CARD_COVERAGE_REGION (118) + _NEIGHBOR (36)

**Why.** Pure retext. Lowest cost-per-finding, highest reader-facing impact — these are the cards where the engine already *knows* which region or which neighbor but the body says "a remote province" or "a foreign court." Threading names in also primes the downstream class pass.

**Work.**
- Extend `nameResolver` where needed: advisor / agent / bond accessors don't exist yet but `{region}`, `{settlement}`, `{neighbor}`, `{ruler_full}`, `{dynasty}`, `{capital}` do.
- For every flagged card, rewrite the body using the appropriate tokens plus `{condition_context}` / `{posture}` where a trigger already binds them (these "come free" once the name is threaded).
- Where the card has context the engine extracts but no token yet resolves (e.g. specific advisor seat, specific agent codename), add the resolver and the token together — this is the smallest system-upgrade cost and it unlocks all downstream phases.

**Critical files.** `src/bridge/nameResolver.ts`, `src/bridge/contextExtractor.ts`, `src/bridge/smartText.ts` (or equivalent token resolver), events/decrees/overtures text files across the corpus.

**Acceptance.** Both coverage buckets = 0. `nameResolver` has accessors for every entity class the text can now name.

---

### Phase 6 — SMART_CARD_COVERAGE_CLASS (281)

**Why.** Largest retext bucket. Class is the identity of most petitions ("A delegation of merchants" / "the clergy") and many crises. Fixing these is the last pre-grind coverage sweep.

**Work.**
- For each flagged card, thread the class via the supplicant framing appropriate to the family (petition = supplicant verb; crisis = escalating voice; decree = royal address).
- Where the card's `affectsClass` was previously unset but the content is clearly class-scoped, set it — this is a definition-layer fix, not a text-layer one.
- Pattern-match groups: class X with state Y ("merchants during a trade disruption") get a shared stem phrasing pulled from `src/data/text/word-banks.ts` so the rewrite is coherent, not 281 bespoke sentences.

**Acceptance.** `SMART_CARD_COVERAGE_CLASS` = 0. Any newly-added `affectsClass` bindings do not regress other scans.

---

### Phase 7 — Cross-family duplicate reconciliation

**Why.** Before the long SURFACE_ONLY grind, settle overlap so we don't re-effect a card only to delete it two phases later. Top overlap zones (from corpus exploration): marriage, tax, festival, border, guild, plague, trade, governance, military readiness, succession.

**Work.**
- For each overlap zone, pick one canonical family per *situational role* and retire duplicates or redirect them:
  - **Marriage.** Petition = "a match is being proposed to you by a class" (supplicant). Decree = "you decree the royal marriage outcome." Overture = "a rival initiates dynastic alliance." Crisis = only on disrupted/broken matches. Remove any card that overlaps another role.
  - **Tax.** Petition = class asks for relief. Decree = crown decrees levy/exemption/reform. Crisis = enforcement breakdown (the §14 example is already exactly this).
  - **Festival.** Seasonal dawn text (Pattern C) by default. Decree = `call_festival` as an active choice. Petition only if a class specifically asks for one tied to current state.
  - **Border.** Crisis = active incursion or flashpoint. Decree = `fortify_borders` / defense network. Overture = rival claim or demonstration. Event chain = multi-turn war escalation.
  - **Guild.** Petition = guild asks. Decree = crown grants/revokes charter.
- Produce `docs/audit/duplicate-reconciliation.md` with a row per overlap zone: canonical mapping, cards kept, cards retired or merged, redirect table for persistent consequence tags that the retired cards produced.
- Save-compat: any retired event ID that could appear in a historical save needs a dead-id passthrough in the `LOAD_SAVE` migration (version bump).

**Acceptance.** Reconciliation doc merged. No two cards compete for the same (family × trigger × class) slot.

---

### Phase 8 — Decrees family deep audit (SURFACE_ONLY grind begins)

**Why.** Fewest cards, highest leverage each — the calibration family per `CARD_AUDIT_RULES.md` §11.1. Tier-aware substance rule bites hardest here: Defining must establish feature/policy, Rare must queue a modifier or follow-up.

**Work.**
- Walk `src/data/decrees/` file-by-file. Apply the 15 questions. Outcomes recorded per card in `docs/audit/findings/decrees.md`: pass / retext / re-effect / rebuild.
- Re-effect: add `KINGDOM_FEATURE_REGISTRY` entries, `EVENT_CHOICE_TEMPORARY_MODIFIERS`, `EVENT_CHOICE_STYLE_TAGS`, or follow-up IDs (stubs for phase 15).
- `preview-parity` scan must end at 0 — every decree's `effectPreview` must match its actual effects.
- Confirm cooldown / `isOneTime` on every structural-effect decree so the player can't spam a feature-setting decree.

**Critical files.** `src/data/decrees/index.ts`, `src/data/decrees/effects.ts`, `src/data/decrees/expansion-decrees.ts`, `src/data/decrees/expansion-wave-2/`, `src/engine/cards/adapters.ts` (`decreeToCard`).

**Acceptance.** All decrees green on every scan. `npm run audit:decrees` returns 0 CRITICAL/MAJOR.

---

### Phase 9 — Crises family deep audit

**Why.** Severity coherence is sharpest here. A `Critical` crisis that resolves on a surface-only choice is the loudest mislabel in the corpus, and phase 2 only caught the 57 worst runtime offenders — the long tail is here.

**Work.**
- Walk `src/data/events/expansion/wave-2/` and base crisis files. Per-card 15-question pass.
- Every crisis with `affectedRegionId` / `affectedClassId` / `affectedNeighborId` set must name that entity in the body (phase 5/6 caught the scanner-visible gaps; this phase catches conceptual gaps the scanner can't see, e.g. body mentions region by synonym but not token).
- Follow-up likelihood must correlate with choice severity: ignore-the-crisis branches should seed follow-ups at higher probability than decisively-address branches.
- No `Critical` crisis finishes in a single turn with only surface effects. If it does, choose: downgrade severity to `Serious`, or re-effect with a feature/storyline/bond change.

**Critical files.** `src/data/events/expansion/wave-2/*`, `src/data/events/condition-events.ts`, `src/data/events/condition-effects.ts`, `src/engine/cards/adapters.ts` (`crisisToCard`).

**Acceptance.** All crises green. `npm run audit:crises` returns 0 CRITICAL/MAJOR.

---

### Phase 10 — Assessments + Negotiations + Overtures

**Why.** Three smaller families combined into one phase. Each has its own `CARD_AUDIT_RULES.md` §9 rubric (confidence-tier language for assessments, per-term distinctness for negotiations, agenda-keyed variants for overtures), but the total card count is low enough that they co-audit cleanly.

**Work.**
- **Assessments** (12 defs in `src/data/events/assessments.ts`): body tone must match confidence tier ("rumours suggest…" vs "reliable sources confirm…"). At least one choice acts *on the intelligence itself* (corroborate / share / exploit) rather than generic political positioning.
- **Negotiations** (13 defs in `src/data/events/negotiations.ts`): each term individually audited. Terms that stack identical satisfaction nudges are clones and fail. Counterparty posture/agenda must influence which terms are offered — this is already engine-supported; authoring must exploit it. Reject-path text coverage mandatory.
- **Overtures** (`src/data/overtures/wave-2/`): per-agenda variants must be thematically keyed. `RestoreTheOldBorders` → target region named. `DynasticAlliance` → generated spouse/heir name that carries into any resulting marriage bond. `DominateTrade` → concrete economic stakes. Deny path seeds a `rivalMemory` entry on the rival (this is the "refusing is a slight" mechanic and it's currently missing on most deny paths).

**Critical files.** `src/data/events/assessments.ts`, `src/data/events/negotiations.ts`, `src/data/text/overtures.ts`, `src/bridge/assessmentCardGenerator.ts`, `src/bridge/diplomaticOvertureGenerator.ts`, `src/engine/systems/rival-memory.ts` (memory-seeding on deny).

**Acceptance.** All three families green. `npm run audit:assessments && npm run audit:negotiations && npm run audit:overtures` returns 0 CRITICAL/MAJOR.

---

### Phase 11 — Petitions wave 1: economy + class-conflict

**Why.** Petitions are the largest family, the highest-volume SURFACE_ONLY offenders, and the most likely to produce rebuilds. Split across three phases. Economy + class-conflict first because they're the hottest overlap zones post-phase-7 and they pair naturally (tax, guild, labor, market).

**Work.**
- Per-file in `src/data/events/expansion/economy-events.ts` and `src/data/events/expansion/class-conflict-events.ts`.
- Stat-only scan runs first to prioritize the worst files within the wave.
- Every petition must name the supplicant class in the body (this was coverage-fixed in phase 6 for flagged cases; this phase catches concept-level cases where the supplicant is wrong or absent from framing).
- Grant/deny symmetry: deny must have weight. A deny-with-no-consequence is a free skip and counts as a failed card.
- Re-effect targets: temp modifier + follow-up stub on at least 2 branches. Use the `CARD_AUDIT_RULES.md` §14 rewrite as shape template.
- Rebuild queue populated per-card where concept is thin; rebuilds grouped into design-coherent sets (don't rebuild six tax petitions one at a time).

**Critical files.** `src/data/events/expansion/economy-events.ts`, `src/data/events/expansion/class-conflict-events.ts`, `src/data/events/followup-events.ts`, `docs/audit/rebuild-queue.md`.

**Acceptance.** Economy + class-conflict petitions green. Rebuild queue populated for this wave with design-intent notes.

---

### Phase 12 — Petitions wave 2: knowledge + advisor + military

**Why.** Second petition slab. Knowledge petitions are small and intellectually tight. Advisor petitions surface seat-holder state. Military petitions are where promise/delivery is easiest to botch ("our marches will stand firm" with a +2 merchant effect).

**Work.**
- Same shape as phase 11 applied to the three categories.
- Advisor petitions: use the new advisor nameResolver accessors from phase 5. Every advisor-mediated card names the seated advisor or explicitly flags vacancy.
- Military petitions: category coherence must touch `military`, `militaryCaste`, or military-relevant structural state. "Merchants +2" on a military petition is a MAJOR from `CARD_AUDIT_RULES.md` §4.2.

**Acceptance.** Three categories green. Rebuild queue updated.

---

### Phase 13 — Petitions wave 3: espionage + religion + diplomacy + environment

**Why.** Final petition slab. These four categories have the most tag-integration potential (espionage → agents/moles/ops, religion → religious orders/heterodoxy, diplomacy → bonds/agreements, environment → active conditions).

**Work.**
- Same shape as phases 11–12.
- Espionage petitions: any agent-mediated card must use agent codename / cover / status from state — currently generic in `petitionCardGenerator.ts`.
- Religion petitions: touch `faith`, `heterodoxy`, `culturalCohesion`, or `religiousOrders`. Founding-order-type petitions must activate the order.
- Diplomacy petitions: bond-strain and agreement-breach cards must reference the specific bond / agreement in both body and effect scope.
- Environment petitions: body state phrase ("during the ongoing drought") must trigger-coherent with an actual active condition on a region.

**Acceptance.** All petitions green. Family-level `npm run audit:petitions` returns 0 CRITICAL/MAJOR.

---

### Phase 14 — Hand cards + Court opportunities

**Why.** Hand cards (~39 in `src/data/cards/hand-cards.ts`) and court opportunities (~50 in `src/data/cards/court-opportunities.ts`) need per-card code review in addition to text review because each has a custom `apply()` function.

**Work.**
- Hand card apply-function review: every `apply` must modify at least one structural state field, not push surface deltas through `applyMechanicalEffectDelta`. Scanner's hand AST analyzer catches the obvious ones; this phase catches the subtle ones (apply modifies the right field but with weak magnitude, apply uses `requiresChoice` but the chosen target is ignored).
- Expiry sanity: `expiresAfterTurns` matches flavor ("Royal Pardon" expiring in 2 turns makes no sense).
- Court opportunities: determinism under the existing bridge RNG, and the "quiet month" allocation in `cardDistributor.ts` must surface them when context is present. Any archetype that currently only fires when an optional context param is supplied gets a fallback path.

**Critical files.** `src/data/cards/hand-cards.ts`, `src/data/cards/court-opportunities.ts`, `src/bridge/cardDistributor.ts`, `scripts/audit/ast/hand-card-analyzer.ts`.

**Acceptance.** Hand and court-opportunity scans return 0 CRITICAL/MAJOR. Hand card apply-determinism test suite (extended) green.

---

### Phase 15 — Progression backbone: follow-up card authoring wave

**Why.** The previous phases have accumulated a long list of follow-up stub IDs referenced from primary cards. This phase authors them as real Pattern A cards with their own effects, text, and sometimes their own follow-ups. This is the phase that converts "cards re-effected to technically pass the substance rule" into "cards that feel like the simulation remembers what you did."

**Work.**
- Expected scale: 40–80 new follow-up definitions, grouped by theme (tax-dispute chain, border-war chain, marriage-consequence chain, guild-concession chain, merchant-grievance chain, etc.). Groups authored together to keep framing coherent.
- Each follow-up is a full Pattern A card: ≥2 choices, structural effect on at least one branch, smart-text with tokens, appropriate severity, its own follow-ups where tier justifies.
- Terminal follow-up branches should land on kingdom features where the path represents a permanent state (Pacified Province, Strict Levy Regime, Restructured Levies, Diminished Crown Lands from the `CARD_AUDIT_RULES.md` §14 example are the calibration references).
- Probability curves matter: "kick the can" branches get 60–80% follow-up probability; "decisive resolution" branches get 20–40%. This is how deferral feels like a trap without being a trap in the code.
- Cross-check every stub ID from phases 2/3/4/8/9/10/11/12/13 resolves to a real definition here.

**Critical files.** `src/data/events/followup-events.ts`, family-specific expansion files where chain IDs live (`chain_tax_dispute`, `chain_border_war_*`, etc.), `src/engine/events/follow-up-tracker.ts` (no edits expected; just verify scheduling covers new cases).

**Acceptance.** No unresolved follow-up IDs remain. `audit:followup-targets` returns 0. Playthrough spot-check: pick three primary cards from different families, resolve each, advance 3–5 turns, confirm follow-up fires and reads progression context (prior decision clause, ruling style, causal chain).

---

## Optional phases 16–20 (extend only if needed)

Evaluated after Phase 15. If `npm run audit` returns 0 CRITICAL/MAJOR across every family and playtesting confirms the "simulation remembers" feel, **stop at 15**. If findings persist or the feel isn't landing, run the relevant phases below.

---

### Phase 16 — Pattern C relocation

**Why.** `CARD_AUDIT_RULES.md` §10 specifies exact destinations for Pattern C content. The phase 1 pattern classifier surfaces single-choice monthly cards; this phase wires them to their proper channel so they stop consuming decision slots.

**Work.**
- Seasonal dawn: "something good happened passively" (harvest, prosperous season).
- End-of-season summary: system-state milestones (feature established, storyline resolved, construction complete).
- World Pulse: foreign activity (rival did thing, inter-rival agreement signed, distant war flared).
- **Rebuild-as-A**: advisor flaw reveal, mole exposure, bond strain, agent in trouble. The reveal *is* the decision point (dismiss / investigate / exploit). Do not relocate — rewrite.
- Update `src/ui/phases/SeasonDawn.tsx`, `src/ui/phases/SummaryPhase.tsx`, and whatever surfaces World Pulse today to accept the new content streams.

**Trigger.** Run this phase if Phase 1's pattern classifier surfaces ≥20 Pattern C cards in monthly decks.

---

### Phase 17 — Consequence-tag reader expansion

**Why.** Many cards write persistent consequence tags; only ~20 are currently read by triggers or text. A tag nobody reads is dead paper — it counts as structural only if something consumes it (`CARD_AUDIT_RULES.md` §2).

**Work.**
- Audit every tag produced across the corpus. For each tag without a reader, decide: add a reader (trigger gate on future card, text clause via `{prior_decision_clause:*}`, storyline activation, narrative pressure nudge) or stop writing it.
- Expand `{prior_decision_clause:*}` topic taxonomy beyond `tax` — add `faith`, `military`, `diplomacy`, `guild`, `marriage`, `border`, `succession` at minimum.
- This directly powers Question 12 (progression memory) on hundreds of cards.

**Trigger.** Run if the post-phase-15 audit shows lingering `consequence-tag-produced-but-never-read` warnings and playtesting shows the "memory" feel is weak.

---

### Phase 18 — Card-selection intelligence

**Why.** The current selection pipeline (`src/engine/events/`, `src/bridge/cardDistributor.ts`) weights mostly on trigger-satisfaction + random. Two cards that both qualify surface with equal probability, even if one is far more salient to current state.

**Work.**
- Add a saliency score to the selection layer: cards whose triggers *just* crossed (recent state change) outrank cards whose triggers have held for many turns. Follow-up-bound cards outrank fresh pool pulls. Cards naming entities currently stressed (class crisis, region under condition, neighbor in crisis) outrank generic cards.
- Anti-repeat: the same card ID doesn't fire twice within N turns unless triggered by a follow-up.
- Narrative coherence: bias selection toward cards that extend an active storyline or echo a recent causal chain.

**Critical files.** `src/engine/events/event-engine.ts` (or equivalent `surfaceEvents` host), `src/bridge/cardDistributor.ts`, new tests in `src/__tests__/card-selection.test.ts`.

**Trigger.** Run if playtest feedback is "cards feel arbitrary" despite the corpus itself being clean. This is the highest-risk phase because it changes selection semantics — save-compat safe but test-coverage expensive.

---

### Phase 19 — New archetypes (from `SMART_CARD_ENGINE_SURFACE.md` §9)

**Why.** Fifteen new card types are feasible with zero engine changes (rival crisis window, agent burn extraction, mole suspicion, initiative failure watch, bond strain, inter-rival war alert, claim pressure, infrastructure decay, stale posture prompt, religious order founding, advisor flaw reveal, advisor loyalty drift, causal chain notification, settlement-specific variants, prior decree callback).

**Work.**
- Author each archetype as a small family (5–10 cards per archetype), following the `CARD_AUDIT_RULES.md` §14 template.
- Rival-crisis-window and agent-burn-extraction are the highest-leverage — they surface kingdomSimulation and agent state that the player otherwise never sees.

**Trigger.** Run if phases 1–15 landed clean and the team wants volume + variety before release rather than more depth per card.

---

### Phase 20 — Regression seal + release gate

**Why.** Every earlier phase had its own gate, but after this much churn a final full-corpus regression + integrated playtest pass is non-negotiable.

**Work.**
- Full `npm run audit -- --include-minor --include-polish` returns 0 MAJOR, 0 CRITICAL. MINORs counted; zero backlog accepted.
- Smart-text test harness (`src/__tests__/smart-text.test.ts` from `SMART_CARD_ENGINE_SURFACE.md` §7.1) expanded to cover every token and every fallback path.
- Pattern classifier test suite: every card's pattern is explicitly asserted.
- Playthrough: three full 5-year games on different scenarios with post-game write-up scoring progression-feel on a rubric.
- Save-compat check: load a pre-workstream save, verify all migrations applied cleanly.
- `version` integer in save-compat bumped once per phase that altered `GameState` shape (most phases don't; phase 5 might for advisor/agent name-resolver fields; phase 18 might for selection weights).
- `docs/CROWN_AND_COUNCIL_EXPANSION.md` and the phase-roadmap table in `CLAUDE.md` updated to reflect the card-audit workstream as complete.

**Trigger.** Always, if any of 16–19 ran. If only 1–15 ran, the phase 15 acceptance test effectively substitutes.

---

## Verification — end-to-end

**Per-phase.**
- `npm run audit -- --family=<affected>` delta: findings retired match the phase target; none regressed from prior phases.
- `npm test && npm run lint && npm run build` all green (the phase gate from `CLAUDE.md`).
- For phases that add new follow-ups or kingdom features: load a save snapshot, resolve a triggering choice, advance until the follow-up fires, inspect the rendered body for token resolution.

**End of workstream.**
- Baseline comparison: `docs/audit/baseline-<date>.md` vs. post-phase-15 run — every finding count trends to 0 for CRITICAL/MAJOR.
- Playthrough rubric (5-point scale per dimension): named-entity density, progression memory (does a mid-game card reference an early-game decision?), choice distinctness (do three different runs of the same card feel different?), cross-family coherence (no duplicates), follow-up connective tissue (does one card leading to another feel earned?). Target: ≥4/5 on every dimension across three playthroughs.
- Save-compat: load a pre-workstream save; verify migration; verify that historical event IDs retired in phase 7 are passthrough-handled and don't crash the load path.

---

## Notes for executors

- The 15 audit questions (`docs/CARD_AUDIT_QUESTIONS.md`, authored in phase 1) are the single canonical checklist. Don't branch it per family — the family rubrics in `CARD_AUDIT_RULES.md` §9 are overlays, not replacements.
- The §14 tax-dispute rewrite in `CARD_AUDIT_RULES.md` is the calibration anchor for every re-effect and rebuild. When in doubt about how deep to go, match §14's shape.
- `src/bridge/nameResolver.ts` is the single public API for all display-name lookups, per `CLAUDE.md`. Extensions in phase 5 preserve that invariant — no direct label reads at call sites.
- Save-compat is non-negotiable (`CLAUDE.md` design rule 5). Any phase that adds `GameState` fields adds migration defaults in `LOAD_SAVE` and bumps the `version` integer.
- The rebuild queue is shared across families (`CARD_AUDIT_RULES.md` §12.3). Don't rebuild six tax cards one at a time — group and frame them.
- If any phase slips past a week, re-run the scanner baseline — drift in the corpus while work is in flight will mask regressions.
