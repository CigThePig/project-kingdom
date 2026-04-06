# Gameplay Blueprint — Crown & Council

## Purpose
This document defines the simulation design, round structure, card system, and mechanical rules for Crown & Council — a mobile-first kingdom management card game. Every player interaction is mediated through cards. The kingdom simulation runs beneath the surface; the player experiences it entirely through card-driven decisions and their visible consequences.

## Scope
This file owns the game's mechanical identity: what systems exist, how rounds work, what cards do, how the simulation resolves, and how the player wins or loses. It does not define visual design, animation behavior, or component architecture — those belong to `ui-ux-blueprint.md`.

## Related Files
- `ui-ux-blueprint.md` — Card components, interaction patterns, visual design, screen flow
- `PHASES.md` — Step-by-step conversion plan from current codebase
- `CLAUDE.md` — Agent working instructions

---

## §1. Game Identity

### §1.1 Core Fantasy
The player is a monarch ruling through cards. Every decision — responding to a crisis, granting a petition, issuing a decree — takes the form of selecting, swiping, or choosing cards. The kingdom is a living society with five social classes, religious traditions, diplomatic neighbors, espionage networks, and accumulated knowledge, but the player never opens menus or adjusts sliders. They rule through cards that arrive, demand attention, and produce consequences.

### §1.2 Design Pillars

**Everything is a card.** Stats, events, decrees, advisors, settings, codex — all presented as cards. This creates a unified tactile language and eliminates traditional UI chrome.

**Readable tension over hidden complexity.** The player should constantly feel: "I can solve this, but it will cost me something else." Strategy emerges from tradeoffs, not spreadsheet optimization.

**Choices echo forward.** Decisions made in round 3 should visibly affect what cards appear in round 12. The game remembers how you rule and responds accordingly.

**Three beats per round.** Every round has a dramatic beat (crisis), a reactive beat (petitions), and a proactive beat (decrees). This rhythm creates pacing variety within a consistent structure.

### §1.3 Single-Player, Turn-Based
No multiplayer. Neighboring kingdoms are AI-driven. The game is designed for mobile sessions of 5–15 minutes per round, with a full reign spanning 40–80 rounds across multiple sessions.

### §1.4 Scenario Architecture
The base simulation supports scenario overrides. Each scenario reconfigures initial conditions, faction distributions, neighbor configurations, event pools, storyline availability, and starting policies without altering core resolution logic.

---

## §2. Round Structure

### §2.1 The Royal Day
Each round represents a season of rule (3 months). A round consists of five sequential phases:

| Phase | Name | Player Role | Duration Feel |
|-------|------|-------------|---------------|
| 0 | Season Dawn | Observe | Brief |
| 1 | Morning Court | Decide | Weighty |
| 2 | Audience Chamber | React | Brisk |
| 3 | Royal Council | Plan | Deliberate |
| 4 | Court Summary | Reflect | Satisfying |

The player progresses through phases in order. There is no going back to a completed phase within the same round.

### §2.2 Phase 0 — Season Dawn
A single atmospheric card appears showing the new season and any persistent conditions. Purpose: set mood, communicate seasonal mechanical shifts, deliver advisor briefings.

**Contains:**
- Season name and year ("Winter, Year 4")
- Active kingdom conditions (drought, festival season, plague scare, etc.)
- 0–1 advisor briefing cards (espionage intel, diplomatic intelligence, or warning)
- Seasonal modifier summary (e.g., "Food production halved during winter")

Advisor briefings are the primary way espionage and diplomatic intelligence reach the player. A briefing card from the Spymaster might read: "Our agents report Lord Ashford masses troops at the border — confidence: moderate." The player reads this, then enters Morning Court with that context coloring their decisions.

**Interaction:** Tap to acknowledge and advance. If an advisor briefing is present, the player reads it (no action required) and taps to proceed to Phase 1.

### §2.3 Phase 1 — Morning Court (Crisis)
The dramatic heart of the round. One major event demands the player's attention.

**Card composition:**
- 1 Event Card describing the situation (crisis, story beat, neighbor action, failure warning)
- 2–4 Response Cards offering mutually exclusive choices

**What generates crisis cards:**
- Critical and Serious severity events from the event engine
- Storyline branch decision points
- War declarations and major neighbor actions (demands, invasions)
- Schism triggers and faith crises
- Failure condition warnings (approaching famine, insolvency, etc.)
- Active conflict escalation moments

**If no crisis exists this round:** A milder Notable event is promoted to fill the slot. There is always a Morning Court phase — even in peaceful times, the monarch faces decisions. In rare cases of true quiet, a "court is calm" flavor card appears with a single "Proceed" response.

**Interaction:** Player reads the event card, reviews response cards (each showing title, description, and effect hints), taps to select one, then confirms. Selection is a two-step process (select → confirm) to prevent misclicks.

**Response card effect hints:** Show the immediate, clear effects. Hinted side effects use softer language ("May anger merchants"). Hidden long-term ripple effects are not shown — they emerge through future cards.

### §2.4 Phase 2 — Audience Chamber (Petitions)
Fast, reactive decision-making. Cards arrive one at a time and the player swipes right (grant) or left (deny).

**What generates petition cards:**
- Notable and Informational severity events
- Trade proposals and treaty offers from neighbors
- Religious pressure from neighbors
- Faction-specific requests (merchant guild, clergy, commoner villages, noble houses, military officers)
- Construction completion notifications (acknowledge/redirect)
- Minor diplomatic incidents
- Intelligence report delivery (acknowledge or act on)

**Cards per round:** 1–3 petitions in early game, scaling to 2–5 as the kingdom grows and complexity increases. The narrative pacing system controls volume to prevent fatigue.

**Petition-crisis interaction:** Some petitions deliberately echo the crisis. If the player refused to repair a dam in Phase 1, a village petition for flood barriers may appear in Phase 2. This is driven by the consequence tag system — crisis response choices tag the game state, and petition card eligibility checks for those tags.

**Interaction:** Swipe right to grant, left to deny. The card physically moves with the player's finger, rotating slightly, with color feedback (green tint right, red tint left). Commits at 35% screen width or sufficient velocity. Springs back if released below threshold.

### §2.5 Phase 3 — Royal Council (Decrees)
The proactive planning layer. The player browses a spread of available decree cards and selects up to 3.

**What generates decree cards:**
- Standing decrees (always available unless on cooldown or locked by prerequisites)
- Policy change cards (taxation, trade openness, military stance, rationing, religious tolerance, festival investment, intelligence funding, research focus)
- Construction orders (presented as decree cards: "Commission a Granary in the Western Province")
- Military orders (mobilize, stand down, fortify region)
- Diplomatic actions (send envoy, propose treaty, issue ultimatum)
- Intelligence operations (reconnaissance, sabotage, counter-espionage sweep, etc.)
- Religious edicts (found order, suppress heresy, promote tolerance)
- Research directives (shift research focus to a branch)
- Unlocked special decrees from tech milestones, storyline outcomes, or ruling style thresholds

**Deck management:** Not all decrees are visible every round. The available pool is filtered by:
- Prerequisites (tech unlocks, storyline flags, consequence tags)
- Cooldowns (some decrees can only be issued once every N rounds)
- One-time decrees (enacted once, permanently removed from pool)
- Policy mutual exclusivity (can't raise and lower taxes in the same round)
- Ruling style weighting (decrees aligned with the player's established style appear more prominently)

**The 3-decree limit** replaces the old action budget/slot system entirely. It is the core constraint of the planning phase. Some powerful decrees may count as 2 of the 3 slots (marked on the card), preserving the old slot-cost mechanic in simplified form.

**Interaction:** Horizontal scrollable spread. Tap a card to select (it lifts and glows). Tap again to deselect. Counter shows X/3 selected. Confirm button issues all selected decrees simultaneously.

### §2.6 Phase 4 — Court Summary
A narrative card followed by a stat delta breakdown. Purpose: make the player feel the weight of their decisions and understand what changed.

**Contains:**
- 1 Narrative Summary Card — a short prose paragraph describing the round's story arc in plain language ("The dam holds, but at great cost. The merchant quarter seethes as emergency taxes bite. In the east, militia companies drill for the first time.")
- Stat Delta Display — each tracked stat shows its change with a brief cause annotation (Treasury: -92, "Dam repairs & festival costs")
- 0–1 Legacy Card — if a significant threshold was crossed (tech milestone, storyline resolution, ruling style crystallization), a special card appears: "Your realm is now known as a Mercantile Power" or "The Great Schism has ended."
- "Begin Next Season" button advances to the next round's Phase 0.

**Interaction:** Read and review. Tap to advance.

### §2.7 Round Timing Targets
- Phase 0 (Season Dawn): 5–10 seconds
- Phase 1 (Morning Court): 30–90 seconds
- Phase 2 (Audience Chamber): 15–45 seconds
- Phase 3 (Royal Council): 30–120 seconds
- Phase 4 (Court Summary): 10–30 seconds
- **Total round target: 2–5 minutes**

---

## §3. Card System

### §3.1 Card Families
Every card in the game belongs to a family. The family determines visual treatment (accent color, icon, border style) and interaction behavior.

| Family | Accent | Purpose | Interaction |
|--------|--------|---------|-------------|
| Crisis | Red | Major events and threats | Read (no direct action) |
| Response | Gold | Choices for crisis events | Tap to select |
| Petition | Blue | Quick yes/no requests | Swipe left/right |
| Decree | Green | Proactive player actions | Tap to toggle, up to 3 |
| Status | Amber | Kingdom stats and conditions | Pull-down, read-only |
| Advisor | Purple | Intelligence briefings and warnings | Read and acknowledge |
| Summary | Gold | Round results and narrative | Read-only |
| Legacy | White/Silver | Milestone achievements and identity shifts | Read and acknowledge |
| Season | Varies | Atmospheric season transitions | Tap to advance |

### §3.2 Card Anatomy
All cards share a common layout structure regardless of family:

```
┌─────────────────────────────┐
│ ▔▔▔▔▔ accent line ▔▔▔▔▔▔▔ │
│ [icon] FAMILY LABEL         │
│                             │
│ Card Title                  │
│ Body text describing the    │
│ situation, request, or      │
│ action in 1-3 sentences.    │
│                             │
│ ─── effect strip ────────── │
│ +Effect  -Effect  ?Hint     │
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │
└─────────────────────────────┘
```

**Effect strip tokens:**
- `+Label` — positive effect (green text)
- `-Label` — negative effect (red text)
- `?Label` — uncertain/hinted effect (dim text)
- `!Label` — warning/risk (amber text)

Not all cards have effect strips. Crisis cards, advisor cards, summary cards, and season cards typically do not. Response cards, petition cards, and decree cards always do.

### §3.3 Card Schema (Data Structure)
Every card in the data layer follows this schema:

```typescript
interface CardDefinition {
  id: string;
  family: CardFamily;
  title: string;
  body: string;
  effects: CardEffect[];           // mechanical effects applied on selection
  effectHints: EffectHint[];       // player-visible effect tokens on the strip
  prerequisites: Prerequisite[];   // conditions for this card to appear in pool
  cooldownTurns: number;           // 0 = no cooldown
  isOneTime: boolean;              // true = removed from pool after use
  slotCost: number;                // decree cards only: 1 or 2 (of 3 max)
  tags: string[];                  // for consequence tracking and filtering
  weight: number;                  // selection probability weight
  category: string;                // for grouping and pacing (maps to event/decree categories)
  linkedCardIds: string[];         // for crisis→response relationships
  flavorTags: string[];            // for ruling style tracking
}
```

### §3.4 Card Effect System
Every card that produces mechanical changes does so through a universal effect structure. This is the existing `MechanicalEffectDelta` interface — a flat, all-optional delta representing any combination of game state changes.

An effect can:
- Modify any numeric stat (treasury, food, faith, satisfaction per class, etc.)
- Add or remove a condition
- Add a persistent consequence tag
- Shift faction satisfaction
- Modify neighbor relationship scores
- Modify region development or condition
- Queue a follow-up card (delayed by N turns, with probability)
- Unlock or lock a decree category
- Trigger a storyline branch advancement

This universality means content creation follows one pattern: define the card, define its effects, define its prerequisites. The engine resolves everything through the same pipeline.

### §3.5 Card Pool Management
Each phase draws from a filtered pool:

**Crisis pool:** All events with severity Critical or Serious that pass trigger conditions this turn. Storyline branch points that are due. Major neighbor actions. If multiple qualify, the narrative pacing system selects one based on category diversity and severity escalation rules. Remaining eligible events may demote to petitions if severity allows.

**Petition pool:** All events with severity Notable or Informational that pass triggers. Minor neighbor actions. Faction requests generated by satisfaction thresholds (e.g., merchant satisfaction below 30 generates tariff reduction requests). The pacing system selects 1–5 based on kingdom complexity and recent petition density.

**Decree pool:** All decree definitions whose prerequisites are met and not on cooldown. Policy change cards generated from current policy state. Construction cards generated from available buildings and unlocked tech. Military/diplomatic/espionage/religious action cards based on current game state.

---

## §4. Kingdom Systems

All systems from the original simulation are preserved. The card format changes how the player interacts with them, not how they calculate.

### §4.1 Treasury
- **Income:** Taxation (modified by noble cooperation × merchant prosperity), trade income (modified by trade openness × diplomatic trade bonuses × merchant satisfaction), miscellaneous event income.
- **Expenses:** Military upkeep (force size × posture multiplier), construction costs, intelligence funding, religious order upkeep, festival costs.
- **Tracking:** Net flow per turn, consecutive turns insolvent.
- **Card exposure:** Treasury balance and trend shown on Status card. Income/expense breakdown available in expanded Status view. Treasury-affecting effects shown on Response, Petition, and Decree card effect strips.

### §4.2 Food
- **Production:** Base rate × seasonal modifier × agricultural knowledge bonus × regional output. Spring/Summer bonus, Winter penalty.
- **Consumption:** Total population × rationing level modifier.
- **Tracking:** Reserves, net flow, consecutive turns empty.
- **Card exposure:** Food reserves and trend on Status card. Season card communicates seasonal shifts. Food-related events become crisis or petition cards.

### §4.3 Population Classes
Five classes, each with population count, satisfaction 0–100, and per-turn satisfaction delta:

| Class | Satisfaction Drivers | Card Relevance |
|-------|---------------------|----------------|
| Nobility | Taxation level, stability, intrigue risk | Generate petition cards, crisis cards when intrigue peaks |
| Clergy | Religious tolerance, faith level, heterodoxy | Generate petition cards, religious crisis events |
| Merchants | Trade openness, taxation, merchant prosperity | Generate trade petitions, economic crisis events |
| Commoners | Food security, rationing, festival investment, stability | Generate welfare petitions, unrest crisis events |
| Military Caste | Military posture, equipment, morale, recruitment stance | Generate military petitions, mutiny crisis events |

**Nobility intrigue:** When nobility satisfaction is low and intrigue risk is high, generates crisis cards (coup attempts, noble conspiracies). This is the primary internal political threat.

**Satisfaction-driven card generation:** When any class drops below threshold (e.g., 30), the petition pool starts receiving class-specific request cards. Below 15, crisis-tier cards enter the pool. This creates organic pressure — neglecting a class doesn't just move a number, it fills your court with their complaints.

### §4.4 Stability
Composite weighted score from:
- All 5 class satisfaction contributions
- Food security score
- Faith level contribution
- Cultural cohesion contribution
- Decree pacing drag (issuing too many decrees per round reduces stability)

Stability at zero for consecutive turns triggers Collapse (game over). Stability affects event probabilities, neighbor behavior, and construction efficiency.

### §4.5 Military
- **Stats:** Force size, readiness (decays based on posture), equipment condition, morale, deployment posture.
- **Postures:** Defensive / Standby / Mobilized / Aggressive. Higher postures increase readiness but cost more upkeep and stress commoners.
- **Card exposure:** Military posture changes are decree cards. Military-related events become crisis or petition cards. War is a crisis event. Combat resolution happens in the engine between rounds, with results appearing in the summary and as crisis cards if the situation escalates.

### §4.6 Diplomacy
- **Neighbors:** Multiple AI-driven kingdoms, each with relationship score, diplomatic posture (Friendly→War), personality disposition, military strength, religious/cultural profile, espionage capability, war weariness.
- **Neighbor autonomous actions:** Each turn, neighbors evaluate whether to: propose trade, withdraw trade, offer treaties, make demands, declare war, offer peace, create border tension, build up military, retaliate for espionage, apply religious pressure. These actions arrive as crisis cards (war declarations, demands) or petition cards (trade offers, treaty proposals, peace offers).
- **Player diplomatic actions:** Send envoy, propose treaty, issue ultimatum, declare war, accept/reject peace — all presented as decree cards or response cards to neighbor-initiated crisis events.

### §4.7 Conflicts and War
- **Phases:** Skirmish → Campaign → Siege. Each phase has different mechanical implications.
- **Resolution:** Combat power calculation (force size × readiness × equipment × morale × terrain × intelligence advantage) vs. neighbor combat power. Resolved each turn during engine tick.
- **Card exposure:** War declaration is a crisis card. Each turn during active conflict, a "war report" advisor card appears in Phase 0 with current status. Major shifts (phase escalation, siege beginning, near-defeat) become crisis cards. Peace offers from neighbors are petition cards. Player war actions (retreat, press attack, seek terms) are decree cards.
- **Consequences:** Casualties, region occupation, treasury drain, morale impact, war weariness. Victory/defeat effects ripple through all systems.

### §4.8 Espionage
- **Stats:** Network strength 0–100, counter-intelligence level 0–100.
- **Operations (6 types):** Reconnaissance, Diplomatic Intelligence, Economic Intelligence, Sabotage, Internal Surveillance, Counter-Espionage Sweep.
- **False intelligence:** Reports can be fabricated. The `isGenuine` flag is engine-only; the player never sees it. A correction report arrives next turn. This means advisor briefings derived from espionage are sometimes wrong — the player learns to weigh confidence levels.
- **Card exposure:** Intelligence operations are decree cards. Espionage results arrive as advisor briefings in Phase 0. Sabotage results appear as crisis events for the target (or as blowback crisis events if the operation fails). Espionage exposure by a neighbor triggers a diplomatic crisis card. Counter-intelligence successes appear as advisor cards ("Our agents intercepted an enemy spy").

### §4.9 Faith and Culture
- **Faith level:** 0–100. Driven by religious tolerance policy, clergy satisfaction, religious order activity.
- **Cultural cohesion:** 0–100. Driven by festival investment, regional cultural diversity, neighbor cultural pressure.
- **Heterodoxy:** 0–100. Escalates when tolerance is high or neighbor religious pressure is strong. At threshold, triggers schism — a major crisis event with lasting consequences.
- **Religious orders:** Healing, Scholarly, Martial, Charitable. Each has upkeep and system bonuses. Founding/dissolving orders are decree cards.
- **Card exposure:** Faith crises (schism, heresy, religious conflict) are crisis cards. Clergy petitions reference faith state. Religious edicts are decree cards. Cultural events are petition or crisis cards depending on severity.

### §4.10 Knowledge and Advancement
- **6 branches:** Agricultural, Military, Civic, Maritime Trade, Cultural/Scholarly, Natural Philosophy.
- **Progress:** Accumulated per turn based on research focus policy, clergy scholarly bonus, infrastructure.
- **Milestones:** Each branch has unlock thresholds. Unlocking a milestone produces a Legacy card and unlocks new decree cards, event possibilities, or system bonuses.
- **Bonuses feed back:** Agricultural → food production, Military → combat power, Civic → stability, Maritime Trade → trade income, Cultural → cohesion, Natural Philosophy → construction efficiency.
- **Card exposure:** Research focus is a decree card. Milestone unlocks are Legacy cards between rounds. Knowledge bonuses are invisible but shape what other cards become available.

### §4.11 Regions
- **Multiple regions**, each with: primary economic output, development level, local condition modifier, population contribution, faith/cultural profile, strategic value, occupation status.
- **Card exposure:** Regions are context, not interactive objects. Event cards reference regions by name ("Fire in the Eastern Granary"). Decree cards target regions ("Fortify the Northern Border"). Region state changes appear in the summary. There is no map screen — the player's mental model of geography builds through card narratives.

### §4.12 Construction
- **Projects:** Categories (Economic, Military, Civic, Religious, Scholarly, Trade), build times in turns, resource costs (Wood, Iron, Stone).
- **Card exposure:** Starting construction is a decree card. Progress is tracked in the engine. Completion notifications are petition cards (tap to acknowledge) or appear in the summary. Construction effects (new building bonuses) become part of the persistent game state.

### §4.13 Resources
- **Wood, Iron, Stone:** Stockpiles with extraction rates per turn. Used primarily for construction.
- **Card exposure:** Resource levels visible on expanded Status card. Resource shortages generate petition cards ("The quarries are depleted, Sire") or gate construction decree availability.

### §4.14 Policies
Eight adjustable levers, each presented as decree cards rather than a settings menu:

| Policy | Levels | Primary Effect |
|--------|--------|----------------|
| Taxation | Low / Moderate / High / Punitive | Treasury income vs. satisfaction |
| Trade Openness | Closed / Restricted / Open / Encouraged | Trade income vs. security |
| Military Recruitment | Minimal / Voluntary / Conscript / War Footing | Force size vs. commoner satisfaction |
| Rationing | Abundant / Normal / Rationed / Emergency | Food consumption vs. satisfaction |
| Religious Tolerance | Enforced / Favored / Tolerated / Suppressed | Faith vs. heterodoxy |
| Festival Investment | None / Modest / Standard / Lavish | Cohesion/loyalty vs. treasury |
| Intelligence Funding | None / Minimal / Moderate / Heavy | Espionage capability vs. treasury |
| Research Focus | Any of 6 branches or None | Knowledge progress direction |

Each policy level is a separate decree card. Changing a policy costs one of the 3 decree slots per round. The "one policy change per turn" rule from the original is preserved — the player cannot issue two policy-change decree cards in the same round.

---

## §5. Ruling Style System

### §5.1 Purpose
The ruling style system tracks how the player governs and feeds that identity back into the game. It replaces the "direction tags" concept with a concrete mechanical system.

### §5.2 Style Axes
The game tracks the player's decisions across several axes:

| Axis | Low End | High End |
|------|---------|----------|
| Authority | Lenient | Iron-Fisted |
| Prosperity | Austerity | Lavish |
| Faith | Secular | Devout |
| Militarism | Peaceful | Warlike |
| Openness | Isolationist | Cosmopolitan |
| Justice | Merciful | Harsh |

Each axis is a value from -50 to +50, starting at 0.

### §5.3 Accumulation
Every response card, petition decision, and decree card carries hidden `flavorTags` that shift one or more axes by 1–3 points. The shift is weighted by the decision's impact — a crisis response shifts more than a petition swipe.

### §5.4 Rolling Window
Only the last 20 decisions (weighted by impact) contribute to the active ruling style. This means a player who was once warlike can gradually become peaceful. The style is a tendency, not a permanent stamp.

### §5.5 Mechanical Effects
- **Card pool filtering:** Decree cards aligned with the player's dominant style appear more often. Cards opposed to the style still appear but less frequently. This creates a "lean into your style" dynamic without locking the player out of options.
- **Faction response modifiers:** Factions react to the ruling style. A militaristic ruler gets better military satisfaction but worse merchant satisfaction, regardless of specific policy settings.
- **Event weighting:** The event engine weights card selection toward events that test the player's dominant style. A merciful ruler faces more situations that test whether they'll stay merciful.
- **Legacy cards:** When any axis crosses ±30, a Legacy card fires announcing the kingdom's emerging identity. At ±45, a stronger identity card fires with mechanical bonuses/penalties.

---

## §6. Turn Resolution

### §6.1 Resolution Pipeline
After the player completes all three decision phases, the engine resolves the round. The existing 11-phase resolution pipeline is preserved but restructured to account for the card-based input:

**Resolution order:**
1. **Income and Production** — Calculate treasury income, food production, resource extraction.
2. **Decision Execution** — Apply effects of the crisis response, all petition decisions, and all decree cards.
3. **Temporary Modifier Tick** — Decrement and apply active temporary modifiers from past decisions.
4. **Upkeep and Consumption** — Deduct military upkeep, food consumption, construction costs, intelligence funding, religious upkeep, festival costs.
5. **Population and Class Dynamics** — Calculate satisfaction deltas for all 5 classes. Apply satisfaction changes. Update nobility intrigue risk.
6. **Military, Diplomacy, Intelligence** — Update military stats. Tick diplomatic agreements. Resolve espionage operations. Process AI neighbor autonomous actions. Check espionage exposure. Resolve active conflicts.
7. **Faith and Culture** — Calculate faith delta, cultural cohesion delta, heterodoxy delta. Check schism conditions.
8. **Knowledge Progress** — Apply research progress. Check milestone unlocks.
9. **Stability Recalculation** — Recompute composite stability score from all inputs.
10. **Event and Storyline Generation** — Evaluate event trigger conditions. Surface new events into the card pools for next round. Advance storyline timers. Activate new storylines if conditions met. Process follow-up events.
11. **Bookkeeping** — Advance calendar. Record turn history. Update ruling style axes. Check failure conditions. Generate summary data. Prepare card pools for next round.

### §6.2 Failure Conditions
Five ways to lose:

| Condition | Trigger | Warning |
|-----------|---------|---------|
| Famine | Food reserves empty for 3+ consecutive turns | Crisis card when reserves hit zero |
| Insolvency | Treasury below threshold for 5+ consecutive turns | Crisis card when treasury negative |
| Collapse | Stability at 0 for 3+ consecutive turns | Crisis card when stability critical |
| Conquest | All regions occupied by enemy forces | Crisis card as regions fall |
| Overthrow | Multiple classes at breaking point for 4+ consecutive turns | Crisis card warning of revolt |

When a failure condition is approaching, a warning crisis card appears with the turns remaining. If the player fails to correct course, a final "game over" card sequence plays.

### §6.3 Reign Scoring
There is no traditional "win." The game measures the player's reign by:
- **Reign length** — total rounds survived
- **Peak stability** — highest stability achieved
- **Kingdom identity** — ruling style axes at end of reign
- **Legacy achievements** — storylines resolved, milestones unlocked, wars won/lost
- **Class welfare** — average satisfaction across all classes at end

This creates replayability: a short, glorious military reign scores differently than a long, stable mercantile one.

---

## §7. Pacing and Difficulty

### §7.1 Early Game (Rounds 1–10)
- 1 crisis per round (moderate severity)
- 1–2 petitions per round
- Decree pool is small (basic policies, simple construction)
- Neighbors are quiet
- Purpose: teach the loop, let the player feel powerful

### §7.2 Mid Game (Rounds 11–30)
- Crises increase in severity and complexity
- 2–4 petitions per round
- Decree pool expands via tech unlocks and storyline progression
- Neighbors become active (trade, diplomacy, border tensions)
- First wars likely
- Storylines activate
- Purpose: the player develops a ruling style and faces real tradeoffs

### §7.3 Late Game (Rounds 31+)
- Crises chain together and reference past decisions
- 3–5 petitions per round
- Full decree pool available
- Multiple simultaneous pressures (war + schism + famine risk)
- The player's established style is tested under stress
- Purpose: the player's kingdom identity crystallizes or crumbles

### §7.4 Narrative Pacing Rules
The existing narrative pacing system (§16d in old types) is preserved:
- Track recent event categories to prevent same-category spam
- Track recent severity counts to prevent crisis fatigue
- Track dominant class favor to generate contrarian events
- Minimum gap between storyline activations
- Follow-up events honor delay timers and probability rolls

---

## §8. Save and Persistence

### §8.1 Save Model
The game auto-saves after each completed round (after Phase 4). Mid-round saves capture the current phase and all decisions made so far in the round.

### §8.2 Save Structure
The existing `SaveFile` interface is preserved with additions:
- `currentPhase: RoundPhase` — which phase the player is in if mid-round
- `phaseDecisions: PhaseDecisionRecord` — crisis response, petition decisions, decree selections for the current round
- `rulingStyle: RulingStyleState` — current axis values and decision history
- `cardPoolState: CardPoolSnapshot` — what cards were generated for this round (so reloading mid-round shows the same cards)

---

## §9. Scenarios

### §9.1 Scenario Override Points
Each scenario can override:
- Initial game state (treasury, food, population distribution, military, etc.)
- Starting policies
- Neighbor configurations (count, dispositions, relationships, military strength)
- Event pool additions/removals
- Storyline pool additions/removals
- Starting conditions (active modifiers, consequence tags)
- Decree availability overrides
- Starting ruling style axis biases

### §9.2 Existing Scenarios (to convert)
The following scenarios from the data layer are preserved and adapted to the card format:
- **Default** — balanced starting kingdom
- **Faithful Kingdom** — strong religious identity, clergy-heavy, heterodoxy pressure
- **Fractured Inheritance** — low stability, class tensions, political crisis
- **Frozen March** — harsh winter start, food scarcity, military pressure
- **Merchant's Gambit** — trade-focused, mercantile neighbors, economic complexity

Each scenario's initial event and storyline pools need re-tagging to distinguish crisis vs. petition card classification.
