# EXPANSION-TASKS.md — World Texture Expansion

## Overview

Three parallel workstreams expanding Crown & Council with world texture, card quality, and structural variety. See `gameplay-blueprint.md` and `ui-ux-blueprint.md` for full design rationale — the expansion design has been absorbed into those documents. This file contains only implementation tasks.

**Workstream A** — Card Tension Audit (data layer, no UI)
**Workstream B** — Monthly Structure (UI pacing layer)
**Workstream C** — Codex & World Pulse (information layer)

## Critical Rules

1. **The engine is sacred.** Do not restructure `src/engine/resolution/turn-resolution.ts` or change the 11-phase resolution order. Expansion work is additive — new exports, new optional fields, new modules alongside existing ones.
2. **No animation libraries.** CSS keyframes + transitions + JS touch events only.
3. **Text stays in `src/data/text/`.** Engine files never contain player-facing strings.
4. **Bridge layer required.** UI never reads engine state directly for card/display generation. All translations go through `src/bridge/`.
5. **The engine already tracks months.** `TurnState` has `month: number` (1–12) and `season: Season`. Each season = 3 months. The monthly structure is a UI/pacing layer on top of this existing tracking — not a new engine concept.
6. **Resolution fires once per season**, after Month 3. Months 1-2 collect decisions into a queue; Month 3 collects decrees; then the full pipeline runs. Do not add per-month resolution.

---

## New Types

Add these to `src/engine/types.ts` (Workstream B) and `src/ui/types.ts` (Workstreams B+C). These are the contracts — implement them exactly.

### Engine Types (add to `src/engine/types.ts`)

```typescript
// Section: Month-within-Season tracking
// The engine already has TurnState.month (1-12). These types map
// the 3 months within a season to the player-facing monthly structure.

export enum SeasonMonth {
  Early = 1,
  Mid = 2,
  Late = 3,
}

// Section: Rival Kingdom Personality (for dossier system)

export enum RivalPersonality {
  AmbtitiousMilitaristic = 'AmbitiousMilitaristic',
  MercantilePragmatic = 'MercantilePragmatic',
  DevoutInsular = 'DevoutInsular',
  ExpansionistDiplomatic = 'ExpansionistDiplomatic',
  DefensiveCautious = 'DefensiveCautious',
}

// Section: Qualitative State Tiers (for Codex)

export enum QualitativeTier {
  Dire = 'Dire',
  Troubled = 'Troubled',
  Stable = 'Stable',
  Prosperous = 'Prosperous',
  Flourishing = 'Flourishing',
}

// Section: Interaction types (extends card families)

export enum InteractionType {
  CrisisResponse = 'CrisisResponse',
  Petition = 'Petition',
  Negotiation = 'Negotiation',
  Assessment = 'Assessment',
  Decree = 'Decree',
}

// Section: World Pulse

export enum WorldPulseCategory {
  NeighborActivity = 'NeighborActivity',
  KingdomCondition = 'KingdomCondition',
  FactionMurmur = 'FactionMurmur',
  Seasonal = 'Seasonal',
  Foreshadowing = 'Foreshadowing',
}
```

### UI Types (add to `src/ui/types.ts`)

```typescript
import type {
  QualitativeTier,
  SeasonMonth,
  InteractionType,
  WorldPulseCategory,
  RivalPersonality,
  CardDefinition,
} from '../engine/types';

// Monthly round phase tracking
export type MonthPhase =
  | 'monthDawn'
  | 'courtBusiness'
  | 'decree'    // Month 3 only
  | 'summary';  // Month 3 only

export interface MonthState {
  seasonMonth: SeasonMonth;          // 1, 2, or 3
  monthName: string;                 // "Early Thaw", "High Summer", etc.
  phase: MonthPhase;
  assignedCards: CardDefinition[];   // cards distributed to this month
  interactionType: InteractionType | null; // null = quiet month
  worldPulseLines: WorldPulseLine[];
  decisions: MonthDecision[];        // accumulated, fed to resolution after Month 3
}

export interface MonthDecision {
  cardId: string;
  choiceId: string;
  interactionType: InteractionType;
  month: SeasonMonth;
}

export interface WorldPulseLine {
  text: string;
  category: WorldPulseCategory;
  sourceId?: string; // neighborId, factionId, etc.
}

// Negotiation interaction
export interface NegotiationTerm {
  id: string;
  title: string;
  description: string;
  effects: import('../engine/types').MechanicalEffectDelta;
  effectHints: import('./types').EffectHint[];
  isToggled: boolean;
}

export interface NegotiationCard {
  eventCard: CardDefinition;
  terms: NegotiationTerm[];
  rejectEffects: import('../engine/types').MechanicalEffectDelta;
  rejectHints: import('./types').EffectHint[];
}

// Codex types
export interface CodexDomain {
  id: string;          // 'realm' | 'stores' | 'treasury' | 'infrastructure' | 'armies' | 'faith'
  title: string;
  tier: QualitativeTier;
  narrative: string;   // 1-3 sentence qualitative description
}

export interface RivalDossier {
  neighborId: string;
  kingdomName: string;
  rulerName: string;
  personality: RivalPersonality;
  personalityLabel: string;          // "Ambitious & Militaristic"
  regard: { label: string; score: number };  // "Wary (-12)"
  diplomaticStatus: string;          // "Non-Aggression Pact (Year 2)"
  tradeStatus: string | null;        // "Active — southern grain route" or null
  knownStrengths: string[];          // gated by intel level
  recentActions: string[];           // gated by intel level, last 3-4 turns
  spymasterAssessment: string | null; // gated by intel level >= Strong
  confidenceRating: string | null;    // "Low" | "Moderate" | "High" | "Very High"
  intelLevel: 'none' | 'minimal' | 'moderate' | 'strong' | 'exceptional';
}

export interface ActiveSituation {
  id: string;
  type: 'war' | 'construction' | 'treaty' | 'trade' | 'espionage' | 'failureWarning' | 'storyline';
  title: string;
  statusLines: string[];   // 2-4 short status descriptors
  urgency: 'low' | 'medium' | 'high';
}

export interface ChronicleEntry {
  season: string;       // "Year 2, Autumn"
  text: string;         // "The Great Schism divided the clergy. You chose tolerance."
  isProtected: boolean; // legacy/milestone events can't be pruned
}

export type CodexSection = 'kingdom' | 'rivals' | 'situations' | 'chronicle';
```

### Month Name Data (new file: `src/data/text/month-names.ts`)

```typescript
import { Season, SeasonMonth } from '../../engine/types';

export const THEMATIC_MONTH_NAMES: Record<Season, Record<SeasonMonth, string>> = {
  [Season.Spring]: {
    [SeasonMonth.Early]: 'Early Thaw',
    [SeasonMonth.Mid]: 'High Spring',
    [SeasonMonth.Late]: 'Late Bloom',
  },
  [Season.Summer]: {
    [SeasonMonth.Early]: 'Early Harvest',
    [SeasonMonth.Mid]: 'High Summer',
    [SeasonMonth.Late]: "Summer's End",
  },
  [Season.Autumn]: {
    [SeasonMonth.Early]: 'First Harvest',
    [SeasonMonth.Mid]: 'Deep Autumn',
    [SeasonMonth.Late]: 'Last Light',
  },
  [Season.Winter]: {
    [SeasonMonth.Early]: 'First Frost',
    [SeasonMonth.Mid]: 'Deep Winter',
    [SeasonMonth.Late]: "Winter's End",
  },
};
```

---

## Workstream A — Card Tension Audit

Data layer only. No UI work. Can begin immediately regardless of other workstreams or core phases.

### Task A1: Audit & Flag

**REQUIRES:** Nothing.
**OUTPUT:** `src/data/tension-audit.ts` — a structured audit record.

Create `src/data/tension-audit.ts` exporting an array of audit entries. For every card in the game that presents a player choice, evaluate whether both options have meaningful costs. Flag cards that fail.

**Files to audit:**
- `src/data/events/index.ts` — 98 event definitions (check all `choices` arrays)
- `src/data/events/effects.ts` — the mechanical effects for each choice
- `src/data/events/faction-requests.ts` — 15 faction request templates
- `src/data/events/faction-request-effects.ts` — faction request effects
- `src/data/events/neighbor-actions.ts` — 10 neighbor action types
- `src/data/events/neighbor-action-effects.ts` — neighbor action effects
- `src/data/decrees/index.ts` — 54 decree definitions (decrees don't have grant/deny tension but check for "obviously never pick this" entries)

**Audit criteria for each card:**
1. Does choosing option A sacrifice something the player values?
2. Does choosing option B sacrifice something the player values?
3. Would a reasonable player ever pick the weaker option?
4. Does the interaction type (swipe vs multi-option) match the decision's complexity?
5. Is this actually a decision, or is it information/notification?

**Entry format:**

```typescript
export interface TensionAuditEntry {
  cardId: string;
  source: 'events' | 'faction-requests' | 'neighbor-actions' | 'decrees';
  currentClassification: 'crisis' | 'petition' | 'decree';
  tensionPass: boolean;
  problem?: 'no_cost_to_accept' | 'lopsided_deny' | 'lopsided_grant' | 'not_a_decision' | 'wrong_interaction_type' | 'missing_cross_faction_cost';
  recommendation?: 'rebalance' | 'reclassify_as_notification' | 'reclassify_as_world_pulse' | 'reclassify_as_negotiation' | 'reclassify_as_assessment' | 'delete';
  notes?: string; // specific fix description
}
```

**Known failures to confirm (from initial review):**
- `TradeProposal` — accept is pure upside (+3 merchant, +15 treasury, +8 diplomacy), decline is pure downside (-3 diplomacy). Recommendation: rebalance or reclassify as negotiation.
- `TreatyProposal` — accept is +3 stability, +12 diplomacy, zero cost. Recommendation: add constraining terms (mutual defense, trade exclusivity) or reclassify as negotiation.
- `faction_req_nobility_academy` — grant costs -30 treasury for +3 nobility sat and +2 cohesion. Deny costs only -1 sat. Lopsided deny.
- `faction_req_clergy_religious_festival` — same pattern, trivial deny cost.
- `faction_req_merchant_market_expansion` — approve is three positives and zero negatives.
- `faction_req_commoner_public_works` — decline costs -1 commoner sat. Almost free to deny.
- `faction_req_military_border_fortification` — same pattern.

**DONE WHEN:** `src/data/tension-audit.ts` exists, exports `TENSION_AUDIT` array, contains an entry for every card ID found across all four source files. Every entry has `tensionPass` set and a `recommendation` if it fails. `npx tsc --noEmit` passes.

---

### Task A2: Mechanical Rebalancing

**REQUIRES:** A1 complete.
**MODIFIES:**
- `src/data/events/effects.ts`
- `src/data/events/faction-request-effects.ts`
- `src/data/events/neighbor-action-effects.ts`
- `src/data/events/index.ts` (if choices need restructuring)
- `src/data/events/neighbor-actions.ts` (if choices need restructuring)
- `src/data/events/faction-requests.ts` (if choices need restructuring)
- `src/data/text/events.ts` (update text for rebalanced cards)
- `src/data/text/faction-requests.ts` (update text for rebalanced cards)
- `src/data/text/neighbor-actions.ts` (update text for rebalanced cards)

For every card flagged `rebalance` in the tension audit, modify the `MechanicalEffectDelta` entries so both options have real costs.

**Rebalancing principles:**
- **Cross-faction costs.** Granting a faction's request should anger or cost a different faction. Not just -1 but meaningful impact (-3 to -5 range for the opposing group).
- **Cross-system costs.** Accepting trade should have a diplomatic or security cost (dependency, rival kingdom angered, merchant competition). Accepting treaties should constrain future actions.
- **Contextual scaling.** Where possible, add trigger conditions that make costs heavier when the player is already stressed (e.g., food relief costs more food when reserves are below 200).
- **Deny must hurt.** If denying a request currently costs -1 satisfaction, raise it to -3 or -4 minimum. The faction came to you with a request — being refused should sting.
- **Text must match mechanics.** If you add a merchant competition cost to accepting trade, the card body text must mention local merchants' concerns. Update the corresponding text file.

**Specific fixes required:**

`TradeProposal` — Change `accept_trade_proposal` effects to:
```typescript
{ merchantSatDelta: -2, treasuryDelta: +15, diplomacyDeltas: { __NEIGHBOR__: +8 }, commonerSatDelta: +1 }
```
Rationale: foreign traders compete with local merchants (negative sat), but commoners benefit from cheaper goods. Update text body to mention merchant competition.

`TreatyProposal` — Change `accept_treaty` effects to:
```typescript
{ stabilityDelta: +3, diplomacyDeltas: { __NEIGHBOR__: +12 }, militaryReadinessDelta: -3, treasuryDelta: -15 }
```
Rationale: treaties require diplomatic maintenance costs and constrain military posture. Update text body to mention obligations.

`faction_req_merchant_market_expansion` — Change `approve_market_expansion` to:
```typescript
{ merchantSatDelta: +5, treasuryDelta: +15, commonerSatDelta: -2, nobilitySatDelta: -2 }
```
Rationale: expansion displaces commoner housing and encroaches on noble estates.

For all high-satisfaction faction requests (academy, festival, foreign mission, public works, border fortification): raise deny costs to minimum -3 satisfaction (from -1).

**DONE WHEN:** All cards flagged `rebalance` in the audit have updated effects. No choice in the game has an all-positive effect with zero negatives. Corresponding text entries reflect the new tradeoffs. `npx tsc --noEmit` passes. Run a manual spot-check: read 10 rebalanced cards and confirm both options feel like real tradeoffs.

---

### Task A3: Card Reclassification

**REQUIRES:** A1 complete.
**MODIFIES:**
- `src/data/events/index.ts` (remove reclassified events from pools or add metadata)
- `src/data/events/effects.ts` (remove effects for deleted choices)
- `src/data/text/events.ts` (remove text for deleted choices)
**CREATES:**
- `src/data/text/world-pulse-reclassified.ts` — World Pulse text for events that become flavor

For every card flagged `reclassify_as_notification`, `reclassify_as_world_pulse`, or `delete` in the audit:

**Notifications:** Add a `classification: 'notification'` field to the event definition. These will be acknowledged without a choice — the bridge layer will render them as read-only cards. Do not remove them from the event pool; they still need trigger conditions. Remove their `choices` array and replace with `choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }]`.

**World Pulse:** Extract the card's flavor text and adapt it into a short World Pulse line (1 sentence, max 120 characters). Add to `src/data/text/world-pulse-reclassified.ts`. Remove the event from the event pool. Add its trigger conditions to the World Pulse generation rules (see Task C7).

**Deletions:** Remove from all files (definition, effects, text). Document what was removed and why in a comment block at the top of the audit file.

**DONE WHEN:** No reclassified cards remain in decision pools. Notification cards have single-choice `acknowledge` entries. World Pulse candidates have text entries in the new file. `npx tsc --noEmit` passes.

---

### Task A4: New Card Authoring — Negotiations & Assessments

**REQUIRES:** A1 complete.
**CREATES:**
- `src/data/events/negotiations.ts` — negotiation event definitions
- `src/data/events/negotiation-effects.ts` — per-term effect deltas
- `src/data/text/negotiations.ts` — player-facing text
- `src/data/events/assessments.ts` — assessment event definitions
- `src/data/events/assessment-effects.ts` — effect deltas
- `src/data/text/assessments.ts` — player-facing text

**Negotiation cards:** Author at minimum:

| ID | Context | # Terms | Internal/External |
|---|---|---|---|
| `neg_trade_deal` | Foreign kingdom proposes trade | 3 terms | External |
| `neg_treaty_terms` | Foreign kingdom proposes formal treaty | 3 terms | External |
| `neg_peace_terms` | End of war peace negotiation | 3-4 terms | External |
| `neg_alliance_pact` | Military alliance proposal | 2-3 terms | External |
| `neg_noble_power_share` | Noble house demands power sharing | 2-3 terms | Internal |
| `neg_merchant_guild_charter` | Merchant guild negotiates privileges | 3 terms | Internal |
| `neg_clergy_concordat` | Clergy negotiates religious authority | 2-3 terms | Internal |
| `neg_military_reform` | Military caste proposes structural reform | 2-3 terms | Internal |

Each negotiation definition:

```typescript
export interface NegotiationDefinition {
  id: string;
  context: 'internal' | 'external';
  severity: EventSeverity;
  category: EventCategory;
  triggerConditions: TriggerCondition[];
  weight: number;
  terms: NegotiationTermDefinition[];
  rejectChoiceId: string;
}

export interface NegotiationTermDefinition {
  termId: string;
  slotCost: 0; // terms don't cost decree slots
  isFree: true;
}
```

Each term must have real costs. The "accept all terms" combination should not be obviously optimal — at least one term should be genuinely costly enough that players consider leaving it off.

**Text structure per negotiation:**

```typescript
export interface NegotiationTextEntry {
  title: string;         // "Trade Negotiations with {neighbor}"
  body: string;          // 2-3 sentence setup
  contextLabel: string;  // "DIPLOMATIC NEGOTIATION" or "INTERNAL NEGOTIATION"
  terms: Record<string, { title: string; description: string }>;
  rejectLabel: string;   // "Reject the Proposal Entirely"
}
```

**Assessment cards:** Author at minimum:

| ID | Context |
|---|---|
| `assess_border_movement` | Ambiguous military activity on border |
| `assess_spy_report_unverified` | Intelligence report with uncertain reliability |
| `assess_diplomatic_signal` | Neighbor makes subtle overture — genuine or trap? |
| `assess_internal_unrest_rumor` | Reports of faction unrest, severity unclear |
| `assess_foreign_famine` | Neighbor reportedly suffering — opportunity or setup? |
| `assess_religious_movement` | New religious movement emerging — threat or benign? |

Assessment definitions follow the existing `EventDefinition` interface. They use `EventSeverity.Notable` and present 2-3 response options focused on *posture* (investigate further, respond cautiously, ignore). Choices should have the structure: one costs resources to learn more, one costs resources to hedge, one is free but risks exposure.

**DONE WHEN:** All negotiation and assessment definition files exist with the minimum card counts above. Each has matching effects and text files. Every negotiation term has real costs in its effects. `npx tsc --noEmit` passes.

---

## Workstream B — Monthly Structure

UI pacing layer on top of the existing engine. The engine already tracks months — this workstream makes the player experience them.

### Task B1: Month Data Model

**REQUIRES:** Core Phase 3 complete (round loop skeleton exists in `src/ui/RoundController.tsx`).
**MODIFIES:**
- `src/ui/types.ts` — add month types (from "New Types" section above)
- `src/ui/RoundController.tsx` — restructure from 5-phase to month-based sequencing
**CREATES:**
- `src/data/text/month-names.ts` — thematic month names (from "New Types" section above)
- `src/bridge/cardDistributor.ts` — distributes a season's card pool across 3 months

**Card distribution algorithm** (`src/bridge/cardDistributor.ts`):

```typescript
export interface MonthCardAllocation {
  month1: CardDefinition[];
  month2: CardDefinition[];
  month3: CardDefinition[];
  month1Interaction: InteractionType | null;
  month2Interaction: InteractionType | null;
  month3Interaction: InteractionType | null;
}

/**
 * Distributes a season's generated card pool across 3 months.
 *
 * Tendencies (soft, not hard):
 *   Month 1: consequences, aftermath, assessments
 *   Month 2: petitions, negotiations, active governance
 *   Month 3: crises that weren't placed + any remaining events
 *
 * Rules (hard):
 *   - Crisis-severity events override tendencies (placed in earliest available month)
 *   - Max 1 crisis/negotiation/assessment per month
 *   - Max 3 petitions per month
 *   - Decrees are Month 3 only (handled by phase structure, not distribution)
 *   - A month can be empty (null interaction = quiet month)
 */
export function distributeCardsToMonths(
  crisisCards: CardDefinition[],
  petitionCards: CardDefinition[],
  negotiationCards: NegotiationCard[],
  assessmentCards: CardDefinition[],
): MonthCardAllocation { /* ... */ }
```

**RoundController restructure:**

The current flow is: Phase 0 → 1 → 2 → 3 → 4 (linear).
The new flow is:

```
Season Start
  → Month 1: MonthDawn → CourtBusiness (0-1 event) → next month
  → Month 2: MonthDawn → CourtBusiness (0-1 event + 0-3 petitions) → next month
  → Month 3: MonthDawn → CourtBusiness (0-1 event) → Decrees → Summary
  → Resolution (all decisions from all 3 months)
Season End
```

RoundController state shape:

```typescript
interface RoundControllerState {
  currentMonth: SeasonMonth;       // 1, 2, or 3
  currentPhase: MonthPhase;        // 'monthDawn' | 'courtBusiness' | 'decree' | 'summary'
  monthAllocations: MonthCardAllocation;
  accumulatedDecisions: MonthDecision[]; // all decisions from all months so far
}
```

Decisions from Months 1 and 2 are stored in `accumulatedDecisions`. After Month 3's summary phase, the entire `accumulatedDecisions` array (including Month 3 choices and decrees) is fed to the existing `decisionMapper.ts` → resolution pipeline.

**DONE WHEN:** RoundController cycles through 3 months per season. Each month shows a dawn phase and optional court business. Decrees and summary only appear in Month 3. Resolution fires once per season. The engine's `TurnState.month` advances correctly. Save state captures current month within a season. `npx tsc --noEmit` passes.

---

### Task B2: Month Dawn Component

**REQUIRES:** B1, Core Phase 2 (card components exist).
**CREATES:** `src/ui/phases/MonthDawn.tsx`
**MODIFIES:** Replaces usage of `src/ui/phases/SeasonDawn.tsx` in RoundController.

MonthDawn replaces SeasonDawn. It renders:
1. Month name + year ("Early Thaw, Year 3")
2. For Month 1 of each season: seasonal atmospheric text from existing `MONTH_PHRASES` (map `SeasonMonth.Early` to the first month of the current season in `MONTH_PHRASES`)
3. For Months 2-3: shorter atmospheric line (author 2 variants per mid/late month in each season — 16 total new lines, add to `src/data/text/month-openings.ts`)
4. 1-2 World Pulse lines (received as props, rendered as italicized text below the atmospheric line)
5. 0-1 Advisor briefing card (same as current SeasonDawn advisor behavior)
6. Seasonal effect hints from existing `MONTH_EFFECT_POOLS`

**Card family:** `Season` (existing).
**Interaction:** Tap to advance to Court Business or next month.

Props:
```typescript
interface MonthDawnProps {
  seasonMonth: SeasonMonth;
  monthName: string;
  year: number;
  atmosphericText: string;
  worldPulseLines: WorldPulseLine[];
  advisorBriefing: CardDefinition | null;
  effectHints: EffectHint[];
  onComplete: () => void;
}
```

**DONE WHEN:** MonthDawn renders correctly for all 12 calendar months. World Pulse lines display below atmospheric text. Advisor briefings appear after the main card with a slide-up animation. Tap advances to next phase. Visual style matches existing SeasonDawn aesthetic.

---

### Task B3: Court Business Router

**REQUIRES:** B1, B2, B4.
**CREATES:** `src/ui/phases/CourtBusiness.tsx`

A routing component that receives the current month's assigned cards and renders the correct interaction component:

```typescript
interface CourtBusinessProps {
  interactionType: InteractionType | null;
  cards: CardDefinition[];
  negotiation?: NegotiationCard;
  onComplete: (decisions: MonthDecision[]) => void;
}
```

Routing logic:
- `InteractionType.CrisisResponse` → renders `CrisisPhase` (existing)
- `InteractionType.Petition` → renders `PetitionPhase` (existing)
- `InteractionType.Negotiation` → renders `NegotiationPhase` (new, from B4)
- `InteractionType.Assessment` → renders `AssessmentPhase` (new, from B4)
- `null` → quiet month, calls `onComplete([])` immediately (the month advances from Dawn straight to next month or to council)

**DONE WHEN:** CourtBusiness correctly routes to all 5 interaction types (including quiet). Decisions from each interaction are collected and passed back through `onComplete`. Transition animations work between MonthDawn → CourtBusiness. `npx tsc --noEmit` passes.

---

### Task B4: New Interaction Components

**REQUIRES:** Core Phase 2 (card components exist).
**CREATES:**
- `src/ui/phases/NegotiationPhase.tsx`
- `src/ui/phases/AssessmentPhase.tsx`

**NegotiationPhase:**

Layout (vertical scroll):
1. Event card at top describing the negotiation context
2. "NEGOTIATION TERMS" label with contextLabel from text ("DIPLOMATIC NEGOTIATION" or "INTERNAL NEGOTIATION")
3. Term cards — each rendered as a Decree-family card with a toggle state. Tap to toggle on (gold border, ✓ badge), tap again to toggle off. Each shows its own effect strip.
4. Bottom area: "Accept Terms (N selected)" button + "Reject Entirely" button
5. Confirm step on either button (same two-step as crisis response)

If zero terms are toggled and player taps Accept, treat as reject.

State:
```typescript
{
  toggledTermIds: Set<string>;
  confirmed: boolean;
}
```

Returns decisions: one `MonthDecision` per toggled term (choiceId = termId), plus one for the overall accept/reject.

Animation: Event card slides up. Term cards slide in from right with 80ms stagger. Buttons pop in.

**AssessmentPhase:**

Visually identical to CrisisPhase but with a different family accent:
- Uses `Advisor` family (purple accent) instead of `Crisis` family (red accent)
- Shows `ConfidenceIndicator` component on the event card (Low / Moderate / High)
- Response cards use `Response` family (gold) as normal

Functionally identical to CrisisPhase: one event card + 2-3 response cards, tap to select, confirm.

This is intentionally a reskin of CrisisPhase, not a new interaction model. The visual distinction tells the player "this is intelligence, not an emergency" — but the mechanics are the same.

**DONE WHEN:** Both components render correctly with test data. NegotiationPhase handles 2-4 toggleable terms with correct selection state. AssessmentPhase renders with purple accent and confidence indicator. Both call `onComplete` with properly structured decisions. Touch targets meet 44px minimum. `npx tsc --noEmit` passes.

---

### Task B5: Month 3 Council + Summary

**REQUIRES:** B1, B3, Core Phase 3.
**MODIFIES:**
- `src/ui/RoundController.tsx` — ensure decree and summary phases gate to Month 3
- `src/bridge/decisionMapper.ts` — accept `MonthDecision[]` from all 3 months

The decree phase (`DecreePhase.tsx`) and summary phase (`SummaryPhase.tsx`) are unchanged in their internal behavior. The only change is that they only render during Month 3.

Modify `decisionMapper.ts` to accept the accumulated `MonthDecision[]` array and map all decisions (from Months 1-3 + decrees) into the engine's effect application format. The mapper already handles crisis responses, petition decisions, and decree selections — it now receives them all as `MonthDecision` objects with an `interactionType` discriminator:

- `CrisisResponse` → maps as crisis response (existing)
- `Petition` → maps as petition decision (existing)
- `Negotiation` → maps each toggled term's effects + the accept/reject wrapper
- `Assessment` → maps as crisis response (same mechanic)
- `Decree` → maps as decree selection (existing)

**DONE WHEN:** Decree spread and summary only appear in Month 3. All decisions from all 3 months are correctly fed to the resolution pipeline. A full season (3 months → resolution) plays through without errors. Stat deltas in the summary reflect decisions made in all 3 months, not just Month 3.

---

### Task B6: Card Distribution Tuning

**REQUIRES:** Core Phase 4 (real card content), B3.
**MODIFIES:** `src/bridge/cardDistributor.ts`

With real content flowing, tune the distribution algorithm:

1. Test with 10+ seasons of varied game states. Verify month tendencies feel right.
2. Verify crises punch through tendencies (a war declaration in Month 1 takes priority).
3. Verify quiet months occur naturally in peaceful early-game seasons.
4. Verify late-game seasons don't overload any single month.
5. Adjust tendency weights and overflow rules based on testing.

Also wire in the interaction type classifier: cards flagged `reclassify_as_negotiation` or `reclassify_as_assessment` in the tension audit (A1) should route to the correct interaction type through the distributor.

**DONE WHEN:** Play 20 seasons on varied game states. No month has more than 1 crisis + 3 petitions. Quiet months occur in early game. Crisis override works. Negotiations and assessments appear in their correct interaction containers.

---

## Workstream C — Codex & World Pulse

The information layer. Translates engine state into narrative the player can browse (Codex) or passively receive (World Pulse).

### Task C1: Codex State Compiler

**REQUIRES:** Core Phase 4 (real game state flowing).
**CREATES:** `src/bridge/codexCompiler.ts`

```typescript
/**
 * Reads GameState and produces qualitative tier assessments for each domain.
 * Pure function: state in, CodexDomain[] out.
 */
export function compileKingdomState(state: GameState): CodexDomain[];

/**
 * Threshold definitions for each domain.
 * Maps a domain to the primary stats that determine its tier.
 */
```

**Domain → stat mappings and tier thresholds:**

| Domain | Primary Stats | Dire (0-15%) | Troubled (16-35%) | Stable (36-65%) | Prosperous (66-85%) | Flourishing (86-100%) |
|---|---|---|---|---|---|---|
| `realm` | stability | 0-12 | 13-28 | 29-52 | 53-68 | 69-80 |
| `stores` | food.reserves relative to consumption rate | <1 month supply | 1-2 months | 3-5 months | 6-9 months | 10+ months |
| `treasury` | treasury.balance relative to monthly expenses | negative + deficit | low + deficit | positive + breaking even | comfortable + surplus | wealthy + surplus |
| `infrastructure` | average regionDevelopment across all regions | 0-15 | 16-35 | 36-55 | 56-75 | 76-100 |
| `armies` | composite: (readiness×0.4 + morale×0.3 + equipment×0.3) | 0-15 | 16-35 | 36-55 | 56-75 | 76-100 |
| `faith` | composite: (faithLevel×0.5 + culturalCohesion×0.3 + (100-heterodoxy)×0.2) | 0-15 | 16-35 | 36-55 | 56-75 | 76-100 |

Use the `stores` and `treasury` thresholds as ratios, not absolutes — "2 months of food" means `reserves / monthlyConsumption >= 2`.

**DONE WHEN:** `compileKingdomState` returns 6 `CodexDomain` objects with correct tier assignments for a range of game states. Unit test: create 3 contrasting game states (dire, stable, flourishing) and verify tier assignments match. `npx tsc --noEmit` passes.

---

### Task C2: Codex Narrative Templates

**REQUIRES:** C1.
**CREATES:** `src/data/text/codex-narratives.ts`

Author qualitative narrative text for all domain × tier combinations. Each combination gets 3 variants (randomly selected to avoid repetition across seasons).

**Total: 6 domains × 5 tiers × 3 variants = 90 narrative blocks.**

Each narrative block is 1-3 sentences. It should read like a steward's report written for a monarch — not a tooltip.

Export format:
```typescript
export const CODEX_NARRATIVES: Record<string, Record<QualitativeTier, [string, string, string]>> = {
  realm: {
    [QualitativeTier.Dire]: [
      'The realm teeters on the edge of collapse. Open defiance greets the crown in every quarter, and the throne itself feels unsteady.',
      'Order has crumbled. Bandits roam the roads unchallenged, and even loyal subjects whisper of a change in power.',
      'The kingdom is a realm in name only. Authority extends no further than the castle walls, and every faction schemes for advantage.',
    ],
    [QualitativeTier.Troubled]: [
      // ... 3 variants
    ],
    // ... all 5 tiers
  },
  stores: {
    // ... all 5 tiers × 3 variants
  },
  // ... all 6 domains
};
```

**Tone guide:**
- **Dire:** Urgent, ominous. The steward is alarmed.
- **Troubled:** Concerned, cautionary. Problems are acknowledged.
- **Stable:** Neutral, steady. Neither praise nor worry.
- **Prosperous:** Positive, confident. Things are going well.
- **Flourishing:** Glowing, proud. The kingdom is at its best.

**Variable substitution:** Templates can use `{regionName}`, `{neighborName}`, `{className}` placeholders where specificity adds flavor. The compiler will substitute these with actual names from game state.

**DONE WHEN:** File exports `CODEX_NARRATIVES` with all 90 entries filled in. Each narrative is 1-3 sentences. Tone matches the tier. No placeholder text remains. `npx tsc --noEmit` passes.

---

### Task C3: Rival Kingdom Dossier System

**REQUIRES:** C1, Core Phase 4.
**CREATES:**
- `src/bridge/dossierCompiler.ts`
- `src/data/text/dossier-templates.ts`

**Dossier compiler** (`src/bridge/dossierCompiler.ts`):

```typescript
/**
 * Reads a NeighborState + player's EspionageState and produces a
 * RivalDossier with detail gated by intelligence level.
 */
export function compileDossier(
  neighbor: NeighborState,
  espionage: EspionageState,
  recentActions: NeighborAction[], // last 3-4 turns of this neighbor's actions
  turn: number,
): RivalDossier;

/**
 * Determines intel level from espionage network strength.
 */
export function getIntelLevel(networkStrength: number): RivalDossier['intelLevel'];
```

**Intel level thresholds:**
| Network Strength | Intel Level | Dossier Shows |
|---|---|---|
| 0-10 | `none` | Name, ruler, disposition only. Body: "Little is known of this kingdom's affairs." |
| 11-30 | `minimal` | + general military strength descriptor + diplomatic status |
| 31-60 | `moderate` | + known strengths (2-3 items) + recent actions (last 2-3 turns) |
| 61-80 | `strong` | + spymaster assessment paragraph + confidence rating |
| 81-100 | `exceptional` | + predicted next action + internal political situation |

**Personality → Disposition mapping:** The existing `NeighborDisposition` enum maps to the new `RivalPersonality`:
- `Aggressive` → `AmbitiousMilitaristic`
- `Opportunistic` → `ExpansionistDiplomatic`
- `Cautious` → `DefensiveCautious`
- `Mercantile` → `MercantilePragmatic`
- `Isolationist` → `DevoutInsular`

**Dossier templates** (`src/data/text/dossier-templates.ts`):

```typescript
export const PERSONALITY_LABELS: Record<RivalPersonality, string> = {
  [RivalPersonality.AmbitiousMilitaristic]: 'Ambitious & Militaristic',
  // ... etc.
};

export const PERSONALITY_DESCRIPTIONS: Record<RivalPersonality, string> = {
  [RivalPersonality.AmbitiousMilitaristic]: 'This ruler values strength above all and is not afraid to use it. Expect demands, military posturing, and eventual aggression unless deterred.',
  // ... etc.
};

export const MILITARY_STRENGTH_DESCRIPTORS: Record<string, string> = {
  weak: 'Their forces are modest and poorly equipped.',
  moderate: 'They maintain a capable military force.',
  strong: 'Their army is formidable and well-supplied.',
  overwhelming: 'Their military power far exceeds our own.',
};

// Spymaster assessment templates — 3 variants per personality × situation
export const SPYMASTER_ASSESSMENTS: Record<string, string[]> = {
  // key format: `${personality}_${situation}` where situation is 'peaceful'|'tense'|'hostile'|'at_war'
  'AmbitiousMilitaristic_peaceful': [
    'Valdris is quiet, but do not mistake quiet for peace. Our agents report continued arms production and recruitment. They are preparing — the question is for whom.',
    // ... 2 more variants
  ],
  // ... all personality × situation combinations
};
```

**Recent actions tracking:** The dossier compiler needs the last 3-4 turns of `NeighborAction` for each neighbor. Add to `GameState` or to a new tracking structure in the engine:

Add to `NeighborState` in `src/engine/types.ts`:
```typescript
recentActionHistory: { turnNumber: number; actionType: NeighborActionType; summary: string }[];
```
Max 4 entries. Pruned on each resolution. The `summary` field is a short text key (e.g., `'military_buildup'`, `'trade_proposed'`) that the text layer translates to player-facing text like "Expanded military recruitment (2 seasons ago)".

**DONE WHEN:** `compileDossier` produces a `RivalDossier` for a given neighbor state. Dossier detail scales correctly with espionage network strength (test with network = 5, 25, 50, 75, 95). All text template files exist with complete content. `recentActionHistory` field added to `NeighborState`. `npx tsc --noEmit` passes.

---

### Task C4: Codex UI

**REQUIRES:** C1, C2, C3, Core Phase 2 (card components).
**CREATES:**
- `src/ui/components/CodexOverlay.tsx`
- `src/ui/components/codex/KingdomStateCards.tsx`
- `src/ui/components/codex/RivalDossierCards.tsx`
- `src/ui/components/codex/ActiveSituationsCards.tsx`
- `src/ui/components/codex/ReignChronicleCards.tsx`
**MODIFIES:**
- `src/ui/components/StatsBar.tsx` — add Codex access icon

**CodexOverlay** — full-screen overlay component:
- Background: `bg-primary` at 97% opacity over game content
- Four tab pills at top: `Kingdom` `Rivals` `Situations` `Chronicle`
- Tab pills use existing phase indicator pill style (active = filled, inactive = transparent)
- Tab pills use family accents: Kingdom = amber, Rivals = blue, Situations = red, Chronicle = gold
- Content area scrolls vertically below tabs
- Dismiss: tap X button (top-right) or swipe down gesture
- Entry animation: slide up from bottom, 350ms ease
- Exit animation: slide down, 300ms ease

```typescript
interface CodexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  kingdomState: CodexDomain[];
  rivals: RivalDossier[];
  situations: ActiveSituation[];
  chronicle: ChronicleEntry[];
  initialSection?: CodexSection;
}
```

**KingdomStateCards** — 6 cards, one per domain. Each card:
- Family: `Status` (amber accent)
- Title: domain title ("The Realm", "Stores & Provisions", etc.)
- Tier badge: colored pip in top-right (red/gold/green matching tier)
- Body: narrative text from `CODEX_NARRATIVES`
- No effect strip (read-only)

**RivalDossierCards** — 1 card per neighbor. Each card:
- Family: `Advisor` (purple accent) for foreign kingdoms
- Layout matches the dossier mockup from the design proposal
- Content gated by `intelLevel` — use conditional rendering to hide sections above the intel threshold
- "Little is known..." message for `none`/`minimal` intel levels

**ActiveSituationsCards** — dynamic count. Each card:
- Family: varies by situation type (war = Crisis red, construction = Decree green, treaty = Advisor purple, etc.)
- Compact: title + 2-4 status lines
- Urgency indicator: colored left border (green/gold/red)
- Empty state: single card saying "No active situations. The kingdom is at peace."

**ReignChronicleCards** — single card with scrollable list:
- Family: `Legacy` (silver accent)
- Each entry: season label + event text on one line
- Protected entries (milestones) get a small ★ icon
- Reverse chronological (newest at top)

**StatsBar modification:**
- Add a small scroll/book icon (📜 or a simple SVG) to the right of the chevron in the collapsed stats bar
- Tapping the icon opens the Codex overlay
- The icon is always visible, even when the stats bar is collapsed
- Icon does NOT appear during the Codex overlay itself

**Accessibility:**
- Codex overlay traps focus when open
- Tab pills are keyboard-navigable
- Cards use semantic HTML headings
- Close button has aria-label="Close Codex"

**DONE WHEN:** Codex opens from stats bar icon. All 4 sections render with test data. Tab switching works. Overlay dismisses with X or swipe down. Codex is accessible during all gameplay phases (including mid-crisis). No interaction with game beneath the overlay while open. Touch targets meet 44px minimum. Visual style matches dark parchment aesthetic. `npx tsc --noEmit` passes.

---

### Task C5: Active Situations Tracker

**REQUIRES:** C1, Core Phase 4.
**CREATES:** `src/bridge/situationTracker.ts`

```typescript
/**
 * Scans GameState for all active ongoing situations.
 * Pure function: state in, ActiveSituation[] out.
 */
export function compileActiveSituations(state: GameState): ActiveSituation[];
```

**Situation types to detect:**

| Type | Source in GameState | Title Format | Status Lines |
|---|---|---|---|
| `war` | `conflicts[]` where `isResolved === false` | "War with {neighborName}" | Conflict phase, advantage, casualties, turns elapsed |
| `construction` | Active construction projects (turn started + build time > current turn) | "{buildingName} Under Construction" | Region, turns remaining, resources committed |
| `treaty` | `neighbor.activeAgreements[]` | "Treaty with {neighborName}" | Treaty type, terms summary, turns remaining |
| `trade` | `neighbor.activeAgreements[]` where type is trade | "Trade Agreement with {neighborName}" | Trade type, income estimate |
| `espionage` | Active intelligence operations (from espionage system state) | "Operation: {operationType}" | Target, estimated completion, risk level |
| `failureWarning` | Any failure condition counter > 0 | "Warning: {failureType} Approaching" | Turns remaining, what needs to change |
| `storyline` | Active storylines where `status === Active` | "{storylineName}" | Current stage, what the player is waiting for |

Each situation's `urgency` is derived from its state:
- Wars + failure warnings = `high`
- Espionage operations + storylines nearing resolution = `medium`
- Construction + trade + treaties = `low`

**DONE WHEN:** `compileActiveSituations` returns correct situations for a game state that has an active war, ongoing construction, and a trade agreement. Returns empty array for a peaceful early-game state. `npx tsc --noEmit` passes.

---

### Task C6: Reign Chronicle

**REQUIRES:** Core Phase 4, Core Phase 5 (ruling style for legacy events).
**CREATES:**
- `src/bridge/chronicleLogger.ts`
- `src/data/text/chronicle-templates.ts`

**Chronicle logger** — called after each season's resolution to record significant events:

```typescript
export interface ChronicleLogEntry {
  turnNumber: number;
  season: Season;
  year: number;
  text: string;
  isProtected: boolean;
}

/**
 * Evaluates the just-resolved turn and returns 0-3 chronicle entries
 * for events significant enough to record.
 */
export function generateChronicleEntries(
  preState: GameState,
  postState: GameState,
  decisions: MonthDecision[],
): ChronicleLogEntry[];

/**
 * Returns the max chronicle size for the given reign length.
 * Base 20 + 1 per 2 additional seasons beyond 20.
 */
export function getChronicleCapacity(turnNumber: number): number;
```

**What qualifies as significant:**
- Crisis resolved (any crisis-severity event that the player responded to)
- War started or ended
- Treaty signed or broken
- Milestone/legacy card fired (tech milestone, ruling style threshold)
- Storyline resolved
- Failure condition warning issued
- Scenario-specific events

Protected from pruning: milestone/legacy events and storyline resolutions.

**Chronicle text format:** "{Season}, Year {N} — {event summary}."
Examples:
- "Autumn, Year 3 — War declared by Valdris. You chose to mobilize."
- "Spring, Year 5 — The Great Schism divided the clergy. Tolerance was chosen."
- "Winter, Year 8 — Agricultural milestone unlocked: Crop Rotation."

**DONE WHEN:** `generateChronicleEntries` returns entries for a turn that had a crisis, a war, and a milestone. Returns empty array for a quiet turn. `getChronicleCapacity(20)` returns 20. `getChronicleCapacity(60)` returns 40. Protected entries survive pruning. `npx tsc --noEmit` passes.

---

### Task C7: World Pulse Generator

**REQUIRES:** B2 (MonthDawn exists), C3 (neighbor state accessible), Core Phase 4.
**CREATES:**
- `src/bridge/worldPulseGenerator.ts`
- `src/data/text/world-pulse.ts`

**Generator** (`src/bridge/worldPulseGenerator.ts`):

```typescript
/**
 * Generates 1-2 World Pulse lines for the current month.
 * Lines are flavor text — informational, not actionable.
 */
export function generateWorldPulse(
  state: GameState,
  currentMonth: SeasonMonth,
  previousPulseCategories: WorldPulseCategory[], // categories used in earlier months this season
): WorldPulseLine[];
```

**Selection rules:**
1. Pick 1-2 lines from eligible category pools based on current state
2. Weight by relevance (food pulse more likely when food reserves are changing significantly)
3. No category repeat within the same season (check `previousPulseCategories`)
4. Month 1 favors NeighborActivity and KingdomCondition
5. Month 2 favors FactionMurmur and Seasonal
6. Month 3 favors Foreshadowing
7. These are tendencies, not hard rules — override if no eligible lines exist in the preferred category

**Intelligence filtering for NeighborActivity:**
- `espionageNetworkStrength < 20`: only obvious/public neighbor actions ("Valdris mobilizes its army")
- `espionageNetworkStrength 20-50`: moderate detail ("Traders report Korrath's harvest was poor this year")
- `espionageNetworkStrength > 50`: subtle internal affairs ("Sources within Valdris report growing merchant unrest")

**Text templates** (`src/data/text/world-pulse.ts`):

Organized by category. Each entry has a condition function and a text template:

```typescript
export interface WorldPulseTemplate {
  id: string;
  category: WorldPulseCategory;
  /** Returns true if this pulse line is eligible given current state */
  condition: (state: GameState) => boolean;
  /** Returns the text, with any variable substitution applied */
  text: (state: GameState) => string;
  /** Minimum espionage network strength required (NeighborActivity only) */
  minIntelStrength?: number;
  /** Weight multiplier — higher = more likely to be selected */
  weight: number;
}
```

**Minimum templates per category:**

| Category | Min Count | Examples |
|---|---|---|
| NeighborActivity | 15 | "Traders from {neighbor} report unusual military activity." / "{neighbor} has closed its northern borders to trade." / "Refugees from {neighbor} seek entry — they speak of hardship." |
| KingdomCondition | 12 | "The eastern roads grow rutted and merchants complain of delays." / "Granaries in the heartland are nearly full." / "Construction crews make steady progress on the new {building}." |
| FactionMurmur | 10 | "The clergy speak favorably of your recent decree." / "Noble houses grumble about taxes in the great hall." / "Soldiers share songs of the recent victory." |
| Seasonal | 8 | "The first snows dust the northern mountains." / "Spring rains swell the rivers — the fields will be fertile." / "Summer heat bakes the southern plains." |
| Foreshadowing | 8 | "Strange lights are seen over the eastern marshes." / "A merchant claims to have found ancient ruins beneath the old quarry." / "An old prophecy circulates among the clergy — they say the signs are aligning." |

Also incorporate any World Pulse text created during Task A3 (reclassified cards).

**DONE WHEN:** `generateWorldPulse` returns 1-2 lines per call. No category repeats within a 3-call season sequence. Lines change based on game state (food-related lines appear when food is low/changing). Intelligence filtering works (low espionage = vague neighbor lines, high = detailed). All template counts meet minimums. `npx tsc --noEmit` passes.

---

## Integration Checklist

After all workstreams complete, verify the full integration:

- [ ] A full season plays as 3 months with varied pacing
- [ ] Quiet months occur naturally in peaceful early game
- [ ] Crises punch through monthly tendencies correctly
- [ ] Negotiations render with toggleable terms and real tradeoffs
- [ ] Assessments render with purple accent and confidence indicators
- [ ] All rebalanced cards have meaningful costs on both options
- [ ] Codex opens from stats bar during any phase including mid-decision
- [ ] Kingdom State cards show correct qualitative tiers
- [ ] Rival dossiers scale detail with espionage investment
- [ ] Active Situations tracks wars, construction, treaties correctly
- [ ] Reign Chronicle grows with reign length, protects milestones
- [ ] World Pulse lines appear on each Month Dawn, no category repeats per season
- [ ] Resolution fires once per season after Month 3
- [ ] Save/load captures current month within a season
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
