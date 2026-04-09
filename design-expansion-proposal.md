# Design Expansion — World Texture & Structural Rethink

## Status
**APPROVED.** Implementation tasks are in `EXPANSION-TASKS.md`. This file is the design reference — consult it for intent and constraints, not for task instructions.

## Related Files
- `EXPANSION-TASKS.md` — all implementation tasks, file paths, interfaces, acceptance criteria
- `gameplay-blueprint.md` — core game mechanics (to be amended after expansion work completes)
- `ui-ux-blueprint.md` — visual design and interaction specs (to be amended after expansion work completes)
- `CLAUDE.md` — agent working instructions

---

## Problem Summary

1. **The world is invisible.** Other kingdoms are abstract names. The player's own kingdom state is numbers without narrative context.
2. **Cards lack tension.** Many decisions have an obviously correct answer — no meaningful cost to the "right" choice.
3. **The round structure is monotone.** Every season plays identically: crisis → petitions → decrees → summary. No sense of time passing, no structural variety.

---

## Design Decisions (Confirmed)

| Decision | Answer |
|---|---|
| Player discovers world state via... | Mix of passive (World Pulse) and active (Codex) |
| Rival kingdoms are... | Central to gameplay — alliances, wars, trade are core loops |
| Negotiation scope | Both foreign AND internal (clearly labeled which) |
| Codex access during decisions | Yes — accessible at all times, including mid-crisis |
| Chronicle depth | Scales with reign length (base 20, +1 per 2 seasons beyond 20). Milestones protected from pruning |
| Month naming | Thematic: Early Thaw, High Spring, Late Bloom, etc. |
| Tension audit vs structural changes | Parallel workstreams, staggered phases |

---

## Monthly Structure

Each season (1 round) becomes **3 months**. Resolution still fires **once per season** after Month 3. Months are a UI/pacing layer, not an engine restructure.

```
Season
├── Month 1: Dawn → Court Business (0-1 event) → advance
├── Month 2: Dawn → Court Business (0-1 event + 0-3 petitions) → advance
├── Month 3: Dawn → Court Business (0-1 event) → Decrees → Summary → Resolution
```

### Month Tendencies (soft, not hard)

| Month | Tendency | Feel |
|---|---|---|
| Month 1 | Consequences, aftermath, developing situations | Reactive |
| Month 2 | Petitions, negotiations, active governance | Engaged |
| Month 3 | Strategic planning + any remaining crises | Deliberate |

Crises override tendencies. Quiet months (no business) are valid and signal stability.

### Month Names

| Season | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Spring | Early Thaw | High Spring | Late Bloom |
| Summer | Early Harvest | High Summer | Summer's End |
| Autumn | First Harvest | Deep Autumn | Last Light |
| Winter | First Frost | Deep Winter | Winter's End |

### Timing Target

- Month 1: 30–90 seconds
- Month 2: 60–120 seconds
- Month 3: 60–150 seconds
- **Season total: 2.5–6 minutes**

---

## Card Tension Rules

### Core Rule

Every card that asks the player to choose must have a meaningful cost on both sides. If one option is obviously correct, the card fails and must be rebalanced or reclassified.

### Tension Test

1. Would a reasonable player ever choose each option?
2. Does choosing either option sacrifice something the player values?
3. Does the choice create downstream consequences?
4. Does the interaction type match the decision's complexity?

### Reclassification Path

Cards that fail the tension test are not deleted — they move:

| Failed Card Type | Becomes |
|---|---|
| Pure upside event (no cost to accept) | Rebalanced with real costs, OR reclassified as World Pulse flavor |
| Information delivery (not a decision) | Advisor briefing in Month Dawn, OR Codex update |
| Completion notification | Summary line + Codex Active Situations entry |
| Complex multi-factor deal squeezed into binary swipe | Reclassified as Negotiation interaction |
| Ambiguous intelligence crammed into petition | Reclassified as Assessment interaction |

### Tension Spectrum

| Level | Both options are... | Use for |
|---|---|---|
| Agonizing | Painful | Crisis cards, war, schisms |
| Strategic | Clear tradeoffs | Diplomacy, policy, major petitions |
| Contextual | Situation-dependent | Faction requests, resource allocation |
| Mild | Slight preferences, neither free | Minor petitions, routine governance |

Nothing in the game should be a no-brainer.

---

## Interaction Types

Five types, up from three. The monthly structure provides room for the new types.

### 1. Crisis Response (existing)
Event card + 2-4 response cards. Tap to select, confirm.
**Admission:** Urgent. Critical/Serious severity. 2+ genuinely different strategic responses.

### 2. Audience Petitions (existing, tightened)
Sequential swipe cards. Left = deny, right = grant.
**Admission:** Genuinely binary. Passes tension test. Max 3 per month.

### 3. Negotiation (NEW)
Event card describing context → 2-4 toggleable term cards → accept/reject.
Player shapes the deal by toggling individual terms on/off before committing. "Accept all" must not be obviously optimal — at least one term should be costly enough to consider leaving off.
**Admission:** Multi-factor decisions with separable terms. Trade deals, treaties, peace terms, internal faction negotiations.
**Internal vs External:** Internal negotiations use faction accents. External use diplomatic accent + kingdom name. The `contextLabel` on the card reads "INTERNAL NEGOTIATION" or "DIPLOMATIC NEGOTIATION."

### 4. Assessment (NEW)
Advisor card with confidence indicator + 2-3 posture response cards. Visually uses purple/Advisor accent instead of red/Crisis.
Player decides how to respond to uncertain information — invest resources to learn more, hedge, or ignore.
**Admission:** Genuine uncertainty. Ambiguous intelligence, early warnings, diplomatic signals of unclear intent.

### 5. Decrees (existing, unchanged)
Browse spread, select up to 3. Month 3 only.

---

## The Codex

Pull-based information layer. The player opens it to browse qualitative, narrative-rich state descriptions. Accessed from the stats bar at any time, including mid-decision.

### Structure

Full-screen card overlay with 4 tabbed sections:

| Section | Content | Card Count |
|---|---|---|
| **Kingdom State** | Qualitative descriptors of 6 domains (realm, stores, treasury, infrastructure, armies, faith). 5-tier scale: Dire → Flourishing. Reads like a steward's report. | 6 cards (fixed) |
| **Rival Kingdoms** | Living dossier per neighbor. Detail gated by espionage network strength. | 1 per neighbor |
| **Active Situations** | Ongoing wars, construction, treaties, operations, failure warnings, storylines. Dynamic — can be empty. | 0-N |
| **Reign Chronicle** | Significant past events in reverse chronological order. Scales with reign length. | Up to capacity |

### Intelligence Gating (Rival Dossiers)

| Espionage Network | Dossier Shows |
|---|---|
| 0-10 (None) | Name, ruler, disposition. "Little is known." |
| 11-30 (Minimal) | + military strength descriptor + diplomatic status |
| 31-60 (Moderate) | + known strengths + recent actions (last 2-3 turns) |
| 61-80 (Strong) | + Spymaster assessment + confidence rating |
| 81-100 (Exceptional) | + predicted next action + internal political situation |

This creates the feedback loop: invest in espionage → see more of the world → make better decisions → feel the value of intelligence funding.

### Rival Personality Archetypes

| Archetype | Behavior | Player Reads As |
|---|---|---|
| Ambitious & Militaristic | Expands, builds army, makes demands | Threat |
| Mercantile & Pragmatic | Proposes trade, avoids war | Trade partner |
| Devout & Insular | Religious pressure, resists foreign influence | Cultural friction |
| Expansionist & Diplomatic | Makes alliances, leverages for territory | Subtle threat |
| Defensive & Cautious | Fortifies, rarely initiates, retaliates hard | Safe unless provoked |

### Codex Design Constraints

- Everything is still cards. The Codex does not violate "everything is a card."
- Overlay, not a screen. No route navigation. Opens over game content, dismisses back.
- Read-only. No decisions made inside the Codex.
- Does not pause gameplay. The game state doesn't change while the Codex is open.

---

## World Pulse

Push-based information layer. 1-2 short flavor lines per month, delivered on the Month Dawn card. Informational only — never actionable.

### Categories

| Category | Examples |
|---|---|
| Neighbor Activity | "Traders report Valdris is fortifying its southern passes." |
| Kingdom Condition | "The eastern roads have fallen into disrepair." |
| Faction Murmur | "Clergy speak favorably of your recent festival decree." |
| Seasonal | "The first snows dust the northern mountains." |
| Foreshadowing | "Strange lights are seen over the eastern marshes." |

### Rules

- 1-2 lines per month, 3-6 per season
- No category repeats within the same season
- Weighted by relevance to current state
- Neighbor activity lines filtered by espionage network strength (low = only obvious events, high = subtle internal affairs)
- Foreshadowing lines appear 1-2 seasons before the event they hint at

---

## What This Expansion Does Not Change

- The "everything is a card" philosophy
- The 11-phase resolution pipeline
- The ruling style system
- The scenario architecture (scenarios can now additionally configure starting dossier visibility and World Pulse flavor)
- The dark parchment aesthetic
- Mobile-first design
- No animation library constraint
- The engine's existing month/season/year tracking in `TurnState`
