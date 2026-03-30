# Gameplay Blueprint

## Purpose
This document defines the simulation and design structure of the kingdom management game. It outlines the systems, turn model, player action model, event framework, storyline architecture, progression model, and scenario designs.

## Scope
This file covers how the kingdom simulation works and what categories of actions and systems exist. It does not define visual layout or the behavioral rules for interface comprehension.

## What This File Owns
- Core game identity at the systemic level
- Turn model and time structure
- Core gameplay loop
- Major resource and kingdom systems
- Population class structure
- Faith and culture system
- Espionage and intelligence system
- Knowledge and advancement system
- Action categories and action budget rules
- Turn resolution framework and resolution order
- Event framework
- Storyline system
- Progression structure
- Win, loss, and soft-outcome conditions
- Scenario designs
- Data exposure requirements for interface and feedback layers
- Save and persistence model

## What This File Does Not Own
- Exact UI screen composition
- Visual style or component design
- Navigation depth rules
- Onboarding behavior
- Typography, color, or responsive layout design
- Accessibility presentation rules beyond exposed data needs

## Related Files
- `ui-blueprint.md`
- `ux-blueprint.md`

---

## 1. Game Identity

### 1.1 Core Fantasy
The player rules a kingdom through decrees, priorities, and structured decisions rather than direct control of individuals or battlefield units. The kingdom is a living society with distinct social classes, religious traditions, accumulated knowledge, and hidden threats — not merely a resource ledger.

### 1.2 Single-Player Sandbox
The game is a single-player, turn-based sandbox simulation. There is no multiplayer component. Neighboring kingdoms are system-driven entities governed by AI behavior rules.

### 1.3 Decree-Based Rule
The player's primary form of agency is issuing state-level actions such as policy changes, resource commitments, military posture adjustments, intelligence operations, religious edicts, research directives, and strategic responses.

### 1.4 Scenario-Ready Architecture
The base game establishes a simulation layer designed for structured overrides. Every scenario start reconfigures initial conditions, pressures, class distributions, faith profiles, knowledge states, neighbor configurations, storyline pools, and event weighting without altering core resolution logic.

### 1.5 Session Pacing Target
A single turn should take roughly two to five minutes of real time depending on complexity and player engagement depth. A full sandbox run should support roughly forty to eighty turns, targeting four to six hours of total play across multiple sessions.

**Related:**
- See `ux-blueprint.md` → Player Mental Model
- See `ui-blueprint.md` → Primary Screens

---

## 2. Core Gameplay Loop

### 2.1 Receive Reports
At the start of a turn, the player receives updated kingdom state, active pressures, intelligence briefings, storyline developments, and newly surfaced matters.

### 2.2 Review Kingdom State
The player reviews available information to understand current condition and identify what requires intervention across all domains including social, spiritual, and strategic intelligence.

### 2.3 Issue Actions
The player chooses actions within the constraints of the action budget. Actions may include decrees, policy changes, military orders, trade actions, diplomatic actions, construction commitments, intelligence operations, religious edicts, research directives, and crisis responses.

### 2.4 Advance Time
The player commits to time progression, allowing systems to resolve and conditions to update. Advancing time is an explicit, confirmable action.

### 2.5 Resolve Consequences
The simulation updates resource flows, system interactions, pressures, intelligence outcomes, knowledge progress, class dynamics, faith shifts, storyline progressions, and event outcomes in a defined resolution order.

### 2.6 Reassess and Repeat
The player returns to a new kingdom state and repeats the loop.

---

## 3. Time Model

### 3.1 Turn Unit
Each turn represents one month of kingdom time. Months are long enough to support meaningful state change but short enough to preserve decision texture across seasons.

### 3.2 Seasonal Structure
Every three months form a season. Seasons materially affect food production, military burden, trade activity, festival calendars, event pools, and environmental conditions. The four seasons are Spring, Summer, Autumn, and Winter.

### 3.3 Yearly Rhythm
Years provide broader framing for kingdom growth, long-term strain, and strategic planning. Certain events, assessments, diplomatic cycles, religious observances, and knowledge milestones may operate on yearly timers.

### 3.4 Long-Term State Change
Some effects resolve within a single turn. Others accumulate across multiple turns or seasons. Construction, development, diplomatic shifts, population growth, knowledge advancement, faith evolution, and class mobility are inherently multi-turn processes. The simulation must track both immediate and deferred effects.

---

## 4. Core Systems

### 4.1 Treasury
Treasury represents stored wealth and financial capacity. It interacts with taxation, trade income, maintenance costs, state projects, military upkeep, intelligence funding, religious investment, research costs, and emergency spending. Treasury has both a current balance and a per-turn net flow composed of income and expenses. Taxation income is influenced by merchant class prosperity and nobility cooperation.

### 4.2 Food
Food represents agricultural supply, reserves, and kingdom nourishment. It interacts with population stability, seasonal harvest cycles, military provisioning, trade, festival consumption, and crisis conditions. Food has a reserve level and a per-turn production-versus-consumption balance that shifts with seasons. Food production is primarily driven by commoner labor and improved by agricultural knowledge advancements.

### 4.3 Population and Labor
Population provides the human base of the kingdom, divided into distinct social classes. Labor reflects productive capacity that may be allocated across food production, resource extraction, construction, military service, religious duties, and research. Population grows or shrinks based on food security, stability, health conditions, and migration. Labor allocation is a zero-sum constraint: pulling workers into one domain reduces availability elsewhere.

### 4.4 Population Classes
The kingdom's population is divided into five social classes. Each class has a population count, a satisfaction level, and distinct mechanical relationships with other systems.

**Nobility** governs administrative efficiency and provides a portion of the kingdom's governance capacity. High noble satisfaction improves decree effectiveness and diplomatic credibility. Low noble satisfaction increases intrigue risk, reduces tax cooperation, and may trigger power struggle events. Nobility is the smallest class by population but disproportionately influential. Noble satisfaction is affected by taxation pressure on their estates, their share of political influence, military outcomes, and perceived threats to their status from merchant or clergy ascendancy.

**Clergy** maintains the kingdom's faith institutions and provides spiritual authority. Clergy satisfaction affects faith stability, cultural cohesion, healing capacity during disease events, and education infrastructure. The clergy is a modest population class that consumes treasury resources for temple and monastery upkeep. Clergy satisfaction is affected by religious policy, investment in faith institutions, tolerance or suppression of heterodox beliefs, and the perceived moral direction of royal decrees.

**Merchants** drive trade efficiency and provide a significant portion of treasury income through commerce taxes and enterprise. High merchant satisfaction improves trade output, attracts foreign traders, and generates economic intelligence. Low merchant satisfaction reduces trade income, increases smuggling risk, and may trigger capital flight events. Merchant satisfaction is affected by trade policy openness, taxation levels, infrastructure investment, and the security of trade routes.

**Commoners** form the largest class and provide the primary labor pool for food production, resource extraction, and construction. Commoner satisfaction is the strongest single contributor to overall kingdom stability. Commoner satisfaction is affected by food security, taxation burden, labor conscription intensity, access to religious comfort, and the visible fairness of royal rule.

**Military Caste** represents the professional warrior population. Unlike conscripted commoners, the military caste provides higher-quality recruits with better readiness and morale baselines. Military caste satisfaction affects recruitment quality, unit loyalty, desertion risk, and the likelihood of military-backed political pressure. Military caste satisfaction is affected by pay, equipment quality, campaign outcomes, and perceived royal respect for martial service.

**Class Interaction Rules:**
- Favoring one class often comes at the perceived expense of another. Increasing noble privileges may alienate commoners. Empowering merchants may threaten noble status. Elevating clergy influence may constrain merchant freedom.
- Class satisfaction shifts are gradual, not instant. A single decree may set a trend, but satisfaction changes accumulate over multiple turns.
- Each class has a breaking point. If any class satisfaction reaches critical low, class-specific crisis events trigger: noble conspiracy, religious schism, merchant exodus, popular uprising, or military mutiny.
- Class mobility exists at the margins. Successful merchant families may enter the nobility over time. Commoner education through clergy institutions may shift small population fractions between classes across years.

### 4.5 Resources
Material resources such as wood, iron, and stone support construction, infrastructure development, military equipment, and trade goods. Each resource type has a stockpile level and a per-turn extraction rate influenced by labor allocation, regional output, and relevant knowledge advancements.

### 4.6 Military
Military reflects the kingdom's defensive and strategic capacity. It includes force size (drawn from both commoner conscription and military caste), readiness level, equipment condition, upkeep burden, deployment posture, morale, and intelligence advantage. Military draws from treasury for upkeep, food for provisioning, and population for recruitment. Military effectiveness is modified by relevant knowledge advancements, intelligence on enemy positions, and military caste quality.

### 4.7 Stability and Order
Stability represents internal order, public confidence, and the kingdom's resilience against unrest. Stability is a composite derived primarily from the weighted satisfaction of all five population classes, food security, faith level, cultural cohesion, and the pace of change imposed by recent decrees. Low stability increases the probability of unrest events, reduces the effectiveness of other systems, and makes the kingdom appear vulnerable to neighbors.

### 4.8 Faith and Culture
Faith represents the kingdom's spiritual condition and the role of religion in public life. Culture represents shared identity, traditions, and social cohesion.

**Faith Level** is a kingdom-wide measure of religious devotion and institutional strength. High faith improves stability, supports clergy effectiveness, boosts commoner morale, and enables faith-specific decrees and construction. Low faith reduces clergy influence, weakens cultural cohesion, and opens the kingdom to heresy and schism events.

**Cultural Cohesion** measures how unified the kingdom's identity is. High cohesion improves stability, eases governance, and supports rapid mobilization. Low cohesion makes the kingdom vulnerable to regional separatism, factional conflict, and foreign cultural influence.

**Religious Orders** are specialized institutions that can be invested in through construction and decree. Each order provides a persistent bonus to a specific domain: a healing order improves disease response, a scholarly order supports knowledge advancement, a martial order supports military morale, a charitable order improves commoner satisfaction. Orders require clergy population and treasury upkeep. A kingdom may support a limited number of active orders based on clergy population and development level.

**Festivals and Observances** are seasonal or yearly events that the player may choose to fund. Festivals consume food and treasury but provide temporary boosts to class satisfaction, faith level, and cultural cohesion. Each season has a traditional observance. Skipping observances lowers faith and clergy satisfaction. Lavish observances impress commoners and clergy but cost more.

**Heterodoxy and Schism** represent challenges to the established faith. Heterodox movements may emerge from low faith conditions, clergy dissatisfaction, foreign cultural contact, or storyline triggers. If left unaddressed, heterodoxy can escalate into a full religious schism that splits clergy loyalty, divides regional faith allegiance, and forces the player to choose between suppression, accommodation, or reformation.

### 4.9 Diplomacy
Diplomacy tracks external relationships with neighboring kingdoms. Each neighbor has a relationship score, an attitude posture, active agreements, outstanding tensions, a behavior disposition, and a religious and cultural profile. Diplomatic state affects trade opportunities, military threat level, espionage posture, religious influence, and event pools. Shared faith or cultural heritage with a neighbor provides a diplomatic bonus; religious or cultural opposition creates friction.

### 4.10 Espionage and Intelligence
Espionage represents the kingdom's capacity for hidden information gathering, covert operations, and defense against foreign intelligence threats.

**Intelligence Network** is a persistent resource representing the kingdom's spy infrastructure. It has a strength level that grows through investment (treasury and specialized labor) and degrades through neglect or exposure. Network strength determines the range and reliability of intelligence operations.

**Counter-Intelligence** is a parallel defensive capacity that protects against foreign espionage. Higher counter-intelligence reduces the success rate of enemy operations targeting the kingdom. Counter-intelligence is improved by investment, stability, and military caste loyalty.

**Intelligence Operations** are discrete actions available on the intelligence screen. Each operation has a success probability (based on network strength, operation difficulty, and target defenses), a cost, a risk profile, and a potential payoff. Operations consume action slots.

Available operation types:
- **Reconnaissance:** Reveals a neighbor's military strength, economic condition, or diplomatic intentions. Provides concrete data that improves decision-making and military planning.
- **Diplomatic Intelligence:** Reveals hidden neighbor attitudes, secret agreements between neighbors, or impending diplomatic shifts. Helps anticipate threats and opportunities.
- **Economic Intelligence:** Reveals trade route vulnerabilities, foreign market conditions, or smuggling networks. May improve trade action effectiveness or reveal merchant class concerns.
- **Sabotage:** Disrupts a neighbor's military readiness, construction progress, or economic output. High risk — failure may cause a diplomatic incident, escalate tensions, or expose agents.
- **Internal Surveillance:** Monitors domestic threats including noble conspiracies, heretical movements, or merchant smuggling operations. Improves early warning for internal crisis events. Overuse degrades commoner and noble satisfaction as the population feels watched.
- **Counter-Espionage Sweep:** A targeted defensive operation that attempts to identify and neutralize foreign agents operating within the kingdom. Success reduces enemy intelligence effectiveness; failure wastes resources.

**Operation Risk:** Every covert operation carries a chance of failure. Failed operations may produce no result, expose agents (reducing network strength), trigger diplomatic incidents, or provide false intelligence that misleads the player for one turn before being corrected.

**False Intelligence:** Some reconnaissance results may be deliberately planted by well-defended neighbors. The game presents false intelligence identically to real intelligence, with correction arriving on the following turn's reports. This creates a meaningful trust relationship between the player and their intelligence apparatus.

### 4.11 Regions
Regions represent territorial sub-units with distinct characteristics. Each region has a primary economic output, a local condition modifier, a population contribution (with its own class distribution), a development level, a local faith profile, a cultural identity, and strategic value. Regions can be individually affected by events, seasons, player investment, and storyline developments.

### 4.12 Development and Infrastructure
Development reflects the kingdom's long-term investment in productive capacity, transport, storage, defenses, religious institutions, research facilities, and structural growth. Development projects take multiple turns to complete and provide persistent bonuses to the systems they serve. Available construction options expand as knowledge advances.

### 4.13 Knowledge and Advancement
Knowledge represents the kingdom's accumulated understanding and technical capacity. It functions as a progression tree where advancement unlocks new capabilities, improves existing systems, and opens new strategic options.

**Knowledge Branches:**
- **Agricultural:** Improves food production efficiency, introduces crop rotation, unlocks irrigation construction, extends harvest seasons, and improves famine resistance.
- **Military:** Improves unit effectiveness, unlocks advanced fortification construction, improves siege capability, enables new military postures, and enhances equipment quality.
- **Civic:** Improves governance efficiency, unlocks administrative buildings, reduces decree overhead, enables more effective taxation, and improves stability recovery.
- **Maritime and Trade:** Improves trade income, unlocks port construction, enables new trade routes, reduces trade losses, and opens maritime diplomatic options.
- **Cultural and Scholarly:** Improves cultural cohesion, unlocks university and library construction, increases education rate (enabling slow class mobility), enhances clergy effectiveness, and supports diplomatic prestige.
- **Natural Philosophy:** Unlocks advanced material processing (improving resource output), enables engineering projects, improves disease response, and supports military engineering.

**Research Model:** Research is a standing investment, not a per-turn action. The player sets a research focus through a policy (selecting which branch to prioritize). Each turn, research progress accumulates based on treasury investment, scholarly clergy contribution, and any relevant infrastructure (universities, libraries, monasteries). The player may change research focus once per turn via the policy system. Advancement milestones are reached after accumulating sufficient progress, at which point the new capability unlocks automatically.

**Advancement Unlocks:** Each milestone in a knowledge branch provides one or more concrete benefits: a new decree becomes available, an existing system receives a quantitative improvement, a new construction project becomes possible, or a new policy option appears. Unlocks should feel meaningful and visible — the player should notice when a new capability appears and understand which research produced it.

**Knowledge and Other Systems:**
- Knowledge advancement requires clergy (scholarly labor), treasury (funding), and infrastructure (research buildings).
- Agricultural knowledge directly improves food production.
- Military knowledge directly improves combat effectiveness and unlocks fortification.
- Civic knowledge directly improves governance and stability recovery.
- Trade knowledge directly improves trade income and opens new partners.
- Cultural knowledge directly improves cohesion and diplomatic prestige.
- Natural philosophy improves resource processing and engineering.
- Some advancements have prerequisites in other branches, creating soft cross-branch dependencies.

**Rule:** No major system should exist in isolation. Every core system should meaningfully influence at least one other domain.

### 4.14 System Interconnection Map
The following connections are foundational and must be reflected in resolution logic:
- Treasury ↔ Military (upkeep), Development (construction), Trade (income), Intelligence (funding), Faith (institutional upkeep), Knowledge (research funding)
- Food ↔ Population (consumption, growth), Military (provisioning), Seasons (production), Festivals (consumption), Agricultural Knowledge (efficiency)
- Population Classes ↔ Stability (weighted satisfaction), Treasury (class-specific taxation and income), Labor (class-specific allocation), Faith (clergy role, commoner morale), Military (caste quality), Espionage (noble intrigue, merchant intelligence)
- Stability ↔ All Class Satisfactions (weighted composite), Food Security, Decree Pace, Faith Level, Cultural Cohesion
- Faith ↔ Clergy (institutional strength), Commoners (morale), Stability (cohesion), Knowledge (scholarly clergy), Events (heterodoxy), Diplomacy (shared faith bonus)
- Espionage ↔ Diplomacy (intelligence advantage), Military (reconnaissance), Stability (internal surveillance), Trade (economic intelligence), Nobility (intrigue detection)
- Knowledge ↔ All production systems (efficiency gains), Military (effectiveness), Development (unlocked construction), Trade (route expansion), Clergy (scholarly contribution)
- Diplomacy ↔ Trade (partner access), Military (threat level), Espionage (intelligence targets), Faith (religious alignment), Cultural Cohesion (shared identity)
- Regions ↔ Resource Output, Event Locality, Development Targets, Local Faith, Local Class Distribution, Cultural Identity
- Development ↔ Production Capacity, Defense Strength, Storage Limits, Knowledge Infrastructure, Religious Institutions

---

## 5. Player Action Model

### 5.1 Action Budget
Each turn, the player has a limited number of action slots. The base budget is three action slots per turn. Some action types cost one slot, while high-impact actions may cost two. Certain crisis responses may be free but constrained by event rules. Standing policy changes do not consume action slots but are limited to one policy change per turn. The action budget creates the core tension of prioritization: the player can never do everything they want in a single turn.

### 5.2 Decrees
Decrees are direct rulership actions with defined costs, conditions, and consequences. They serve as the primary short-to-mid-term intervention tool. Each decree has a name, a category, prerequisites (which may include knowledge advancements, class conditions, or faith thresholds), resource costs, immediate effects, delayed effects, and affected domains. Decrees consume action slots. The decree pool expands as knowledge advances and as the kingdom's situation changes.

### 5.3 Standing Policies
Standing policies represent longer-duration kingdom-wide stances that alter ongoing system behavior. Policies include: taxation level and distribution across classes, military recruitment stance, trade openness, rationing rules, research focus, religious tolerance or enforcement, festival investment level, intelligence funding level, and labor allocation priorities. Policies persist across turns until changed. Changing a policy costs one policy change per turn but does not consume a standard action slot.

### 5.4 Construction and Investment
Construction and investment actions represent long-horizon growth choices. Each project has a target region, resource cost spread across multiple turns, a completion timeline, prerequisite knowledge advancements if applicable, and a persistent effect upon completion. Construction occupies action slots when initiated but progresses automatically once started. Construction categories include: economic (farms, mines, markets), military (fortifications, barracks, armories), civic (roads, administrative buildings, courts), religious (temples, monasteries, shrines), scholarly (universities, libraries, observatories), and trade (ports, warehouses, trade posts).

### 5.5 Military Orders
Military orders change recruitment, readiness, deployment posture, force burden, or defensive emphasis. Orders consume action slots.

### 5.6 Trade Actions
Trade actions influence import, export, exchange rates, and economic stabilization. Trade is governed by available partners, relationship state, resource surplus or deficit, active trade agreements, and trade knowledge level. Trade actions consume action slots.

### 5.7 Diplomatic Actions
Diplomatic actions allow the player to influence foreign relations, secure advantage, reduce threat, or pursue strategic leverage. Available diplomatic actions depend on the current relationship state with each neighbor, intelligence on that neighbor's disposition, and whether shared faith or culture provides additional options. Diplomatic actions consume action slots.

### 5.8 Intelligence Operations
Intelligence operations are covert actions executed through the espionage system. Each operation has a type, a target, a success probability, a cost, and a risk profile. Operations consume action slots. Available operations depend on intelligence network strength.

### 5.9 Religious Edicts
Religious edicts are decree-category actions that specifically address faith and cultural matters: calling festivals, investing in religious orders, addressing heterodoxy, issuing moral proclamations, or establishing new observances. Some religious edicts require clergy cooperation (clergy satisfaction above a threshold). Religious edicts consume action slots.

### 5.10 Research Directives
Research focus is set through the policy system and does not consume action slots. However, the player may issue a research directive as a one-time decree that provides a significant burst of progress to a specific knowledge branch at an elevated treasury cost. Research directives consume action slots.

### 5.11 Crisis Responses
Crisis responses are reactive decisions tied to active events or storyline developments. They appear when events demand a player choice. Some crisis responses are free and do not consume action slots, but their availability is time-limited and tied to the event that spawned them. Others may consume a slot if they represent a major commitment.

### 5.12 Pre-Commit Reversibility
Before advancing time, the player may freely queue, reorder, and cancel any queued actions. Nothing is committed until the player explicitly advances time.

**Related:**
- See `ui-blueprint.md` → Decrees Layout, Policies Panel, Intelligence Screen
- See `ux-blueprint.md` → Decision Support UX

---

## 6. Turn Resolution Framework

### 6.1 Resolution Order
The simulation resolves in the following fixed order each turn.

**Phase 1 — Income and Production**
Taxation income is calculated, weighted by class cooperation (noble willingness, merchant prosperity). Food production is calculated based on season, labor, region modifiers, and agricultural knowledge. Resource extraction is calculated. Trade income is applied. Intelligence funding costs are deducted.

**Phase 2 — Action Execution**
Player-queued decrees, orders, trade actions, diplomatic actions, intelligence operations, religious edicts, research directives, and construction initiations are executed in player-chosen order.

**Phase 3 — Upkeep and Consumption**
Military upkeep is deducted from treasury. Food consumption is deducted from reserves. Infrastructure and religious institution maintenance costs are applied. Standing policy costs are applied. Festival costs are applied if a festival is active this turn.

**Phase 4 — Population and Class Dynamics**
Population growth or decline is calculated based on food security, stability, and health conditions. Class satisfaction shifts are calculated based on recent policies, decrees, food access, taxation, and faith conditions. Class mobility (marginal population shifts between classes) is calculated on yearly intervals. Labor availability is recalculated. Migration effects are applied.

**Phase 5 — Military, Diplomacy, and Intelligence**
Military readiness is updated. Diplomatic relationships shift based on actions, agreements, and AI neighbor behavior. Intelligence operations resolve: successes produce reports, failures produce consequences. Active conflicts are resolved with intelligence advantage factored in. Counter-intelligence checks are performed against incoming enemy operations.

**Phase 6 — Faith and Culture**
Faith level is updated based on religious investment, clergy satisfaction, festival observance, and heterodox pressures. Cultural cohesion is updated based on regional identity alignment, foreign cultural contact, and relevant knowledge advancements. Religious order effects are applied. Heterodoxy progression is evaluated.

**Phase 7 — Knowledge Progress**
Research progress accumulates based on current research focus, treasury investment, scholarly clergy, and research infrastructure. If a milestone threshold is reached, the advancement unlocks and its effects are applied immediately.

**Phase 8 — Stability Recalculation**
Overall stability is recalculated as a weighted composite of all class satisfactions, food security, faith level, cultural cohesion, recent decree intensity, and event outcomes.

**Phase 9 — Event and Storyline Generation**
The simulation evaluates whether current conditions trigger new events, escalate existing pressures, create opportunities, or advance active storylines. Event pools are filtered by season, system thresholds, class conditions, faith state, region conditions, intelligence reports, and prior event history. Storyline progression checks are performed.

**Phase 10 — Construction Progress**
Active construction projects advance by one turn. Completed projects apply their persistent effects.

**Phase 11 — State Snapshot**
All current values, deltas, risk levels, and derived condition signals are captured as the new kingdom state. The previous state is preserved for comparison.

### 6.2 Conflict Resolution
When military conflict occurs, it resolves during Phase 5. Combat outcome is determined by force size, readiness, equipment quality, morale, military caste quality, terrain advantage, intelligence advantage, knowledge-based military improvements, and a controlled randomness factor. Conflicts may resolve in a single turn or persist across multiple turns. The player does not control individual units; outcomes are system-resolved based on posture and preparation decisions.

### 6.3 Change Tracking
The system must preserve prior-turn state alongside current state so that deltas, trends, and cause-linked changes can be surfaced by the interface and experience layers.

**Related:**
- See `ux-blueprint.md` → Review Outcome Changes
- See `ui-blueprint.md` → Visual State Rules, Turn-Change Highlighting

---

## 7. Event Framework

### 7.1 Event Categories
Events should come from multiple domains: economy, food, military, diplomacy, environment, public order, religion, culture, espionage, knowledge, class conflict, region-specific issues, and kingdom-wide developments.

### 7.2 Trigger Sources
Events may be triggered by system thresholds, class satisfaction extremes, faith conditions, seasonal conditions, accumulated strain, controlled randomness, intelligence discoveries, scenario overrides, storyline progressions, prior player decisions, or AI neighbor actions.

### 7.3 Event Severity
Events use a four-tier severity model:
- **Informational:** Context or flavor developments with no immediate mechanical impact.
- **Notable:** Developments that affect one system moderately and may benefit from a response.
- **Serious:** Developments that affect multiple systems or carry escalation risk if unaddressed.
- **Critical:** Developments that threaten kingdom stability or survival and demand immediate response.

### 7.4 Choice-Driven Outcomes
Most events at Notable severity or above should present player choices that redirect or modify consequence paths. Choices should have meaningfully different tradeoff profiles rather than obvious best answers. Many choices should create tension between class interests.

### 7.5 Event-to-Decree Routing
When an event's response options overlap with decree-level commitments, the event should either embed the response directly or link explicitly to the relevant decree with pre-filled context.

### 7.6 Persistent Consequences
Some events should leave lasting marks on systems, regions, relations, class satisfaction, faith state, or future event pools. Persistent consequences should be visible in the archive and traceable in reports.

### 7.7 Event Chains
Some events are part of multi-turn chains where early decisions affect later developments. The game should make chain membership visible. Event chains may be standalone or may be part of a larger storyline.

### 7.8 Class-Specific Events
Each population class generates its own category of events when conditions warrant:
- **Noble events:** Power struggles, succession disputes, estate conflicts, political maneuvering, marriage alliances.
- **Clergy events:** Heresy emergence, monastic disputes, pilgrimage movements, prophecy claims, requests for religious investment.
- **Merchant events:** Trade disputes, smuggling rings, foreign trader arrivals, guild formation, capital flight threats.
- **Commoner events:** Harvest festivals, labor disputes, migration waves, plague outbreaks, folk hero emergence.
- **Military events:** Veteran demands, desertion crises, equipment shortages, honor disputes, border skirmishes.

---

## 8. Storyline System

### 8.1 What Storylines Are
Storylines are pre-authored, multi-event narrative arcs that play out across several turns. Unlike standalone events, storylines have a beginning, branching middle acts, and a definitive resolution. They introduce named characters, specific dramatic stakes, and memorable kingdom moments that make each playthrough feel distinct.

### 8.2 Storyline Structure
Each storyline has:
- **Activation Conditions:** A set of system state requirements that must be met before the storyline can trigger. Conditions may include turn ranges, class satisfaction thresholds, faith levels, diplomatic states, knowledge advancements, or regional conditions.
- **Opening Event:** The first event in the chain, which introduces the situation and its stakes.
- **Branch Points:** Two to four decision moments spread across subsequent turns where the player's choices redirect the narrative and mechanical consequences.
- **Dormant Turns:** Turns between branch points where the storyline is active but waiting. During dormant turns, a brief status note appears in reports indicating the situation is developing.
- **Resolution Event:** A final event that closes the storyline with consequences shaped by the cumulative path of player decisions.
- **Mechanical Footprint:** Every storyline must produce meaningful system effects — not just flavor text. Resolutions should alter class satisfaction, faith state, diplomatic relationships, regional conditions, treasury, military posture, or knowledge progress.

### 8.3 Storyline Pool and Selection
The game maintains a pool of available storylines. At any given time, zero to two storylines may be active simultaneously. The selection process evaluates activation conditions against current kingdom state during Phase 9 of turn resolution. When multiple storylines qualify, selection is weighted by relevance to current kingdom pressures and by variety (the system avoids repeating storyline domains within the same run). A minimum spacing of three turns is enforced between storyline activations.

### 8.4 Storyline Categories
Storylines are categorized by primary domain to ensure variety across a full run:

**Political Storylines** center on power dynamics, class conflict, and governance crises.
Example — *The Pretender's Claim:* A distant relative of the ruling family emerges with noble backing, challenging the player's legitimacy. Branch points involve investigating the claim's validity through espionage, negotiating with supporting nobles, choosing between suppression and accommodation, and managing commoner opinion. Resolution ranges from peaceful absorption to civil conflict.

**Religious Storylines** center on faith, doctrine, and the role of the clergy.
Example — *The Prophet of the Waste:* A charismatic figure appears in a frontier region preaching a reformed doctrine. Branch points involve sending clergy to investigate, choosing tolerance or suppression, managing noble and commoner reactions, and addressing regional faith divergence. Resolution ranges from a strengthened unified faith to a permanent regional schism.

**Military Storylines** center on external threats, internal military politics, and strategic turning points.
Example — *The Frozen March:* A neighbor begins massing forces during winter. Branch points involve intelligence gathering, diplomatic outreach, military preparation, and choosing between preemptive and defensive postures. Resolution ranges from a negotiated stand-down to a decisive winter campaign.

**Trade and Economic Storylines** center on commerce, wealth, and merchant class dynamics.
Example — *The Merchant King:* A powerful merchant family grows wealthy enough to rival the nobility. Branch points involve regulating their power, accepting their investment, managing noble jealousy, and addressing the social disruption. Resolution ranges from a prosperous partnership to a dramatic expropriation.

**Exploration and Discovery Storylines** center on the unknown, natural philosophy, and knowledge expansion.
Example — *The Lost Expedition:* An expedition to a distant frontier goes silent. Branch points involve sending a rescue party, interpreting fragmentary reports, deciding how much to invest in recovery, and managing the political fallout of potential failure. Resolution ranges from a valuable discovery to a costly loss.

**Cultural Storylines** center on identity, tradition, and social change.
Example — *The Foreign Festival:* A wave of foreign cultural influence arrives through trade. Branch points involve embracing or resisting the new practices, managing clergy objections, leveraging merchant enthusiasm, and addressing regional cultural shifts. Resolution ranges from enriching cultural synthesis to xenophobic backlash.

### 8.5 Storyline Interaction with Events
Storylines coexist with the standard event system. Regular events continue to fire during an active storyline. Occasionally, a regular event may interact with an active storyline — for example, a food shortage during a military storyline adds pressure to the narrative stakes. These interactions should be acknowledged in event text when they occur.

### 8.6 Storyline Replayability
Storylines should be authored so that different player choices produce meaningfully different narrative and mechanical outcomes. A single storyline experienced across two different runs should feel like a different story because the decisions diverged. The storyline pool should be large enough that a single run encounters only a fraction of available storylines, ensuring variety across multiple playthroughs.

---

## 9. AI Neighbor Behavior

### 9.1 Neighbor Profiles
Each neighboring kingdom has a behavioral disposition (aggressive, opportunistic, cautious, mercantile, or isolationist), a military strength level, a religious profile (faith tradition and tolerance), a cultural identity, and an espionage capability. Disposition influences how the neighbor reacts to the player's actions and conditions.

### 9.2 Neighbor Decision Logic
AI neighbors evaluate the player's military strength, diplomatic stance, trade value, stability, intelligence exposure, and religious alignment. They may initiate trade offers, alliances, demands, border tensions, raids, full invasions, espionage operations, or religious missionary pressure based on their disposition and the player's perceived vulnerability.

### 9.3 Escalation and De-escalation
Neighbor relationships can escalate from neutral to tense to hostile to war, or de-escalate through diplomacy, tribute, alliance, shared faith, or intelligence-backed negotiation. Escalation follows visible steps so the player is never ambushed without prior signals. Intelligence operations can reveal escalation before it becomes diplomatically visible.

### 9.4 Neighbor Actions During Resolution
AI neighbor actions are resolved during Phase 5 of turn resolution. Neighbor-initiated events and espionage operations feed into the standard event framework.

---

## 10. Progression Structure

### 10.1 Early Kingdom State
The early game emphasizes limited capacity, foundational tradeoffs, and establishing stable production and order. The knowledge tree is mostly unexplored. Class dynamics are present but relatively stable. Faith is established but untested. Intelligence infrastructure is minimal. The action budget feels tight. Events are mostly Notable or below. One or two knowledge branches should offer early milestones that feel rewarding and teach the research system.

### 10.2 Midgame Growth
The midgame opens wider strategic options and stronger differentiation. Development projects begin to pay off. Knowledge advancements unlock new decrees and construction. Class tensions become more pronounced as the kingdom's direction becomes clearer. Diplomatic complexity increases. Espionage becomes a meaningful tool. Storylines begin appearing. Serious events become more common.

### 10.3 Strategic Specialization
As the kingdom develops, player choices enable recognizable governing styles. Specialization should emerge from accumulated decisions across all systems. Possible kingdom identities include: militarized conquest state, mercantile trading power, theocratic faith kingdom, scholarly enlightened realm, civic administrative model, or balanced pragmatic rule. The knowledge tree, class balance, faith posture, and policy history all contribute to the emerging identity.

### 10.4 Failure States
Failure comes from systemic collapse:
- **Famine:** Food reserves at zero for three consecutive turns with no recovery path.
- **Insolvency:** Treasury at zero with negative net flow for three consecutive turns and no corrective actions available.
- **Collapse:** Stability at zero for two consecutive turns.
- **Conquest:** A military conflict results in total occupation of all regions.
- **Overthrow:** A class crisis (noble conspiracy, military coup, or popular revolution) reaches its final stage without resolution.

Failure conditions should be forecasted with increasing urgency. The player should always see failure approaching at least two turns before it occurs.

### 10.5 Soft Success States
There is no single victory condition. Soft success is represented by long-term kingdom resilience, prosperity, strategic security, knowledge accumulation, faith strength, class harmony, or a stable and distinct ruling style. The game offers a kingdom assessment at yearly intervals and a final assessment when the player concludes a run. The assessment evaluates the kingdom across all major domains and identifies the governing style the player has developed.

---

## 11. Scenario Designs

### 11.1 Base Sandbox — The New Crown
A standard kingdom with three regions, two neighbors (one cautious, one opportunistic), moderate starting resources, balanced class distribution, established but unremarkable faith, no knowledge advancements, and a neutral diplomatic landscape. Event pools and storyline pools include the full standard set with no weighting overrides. This is the default learning scenario.

### 11.2 The Fractured Inheritance
The player inherits a kingdom divided by a recent succession crisis. Noble satisfaction starts critically low. Two noble factions compete for influence. One region has separatist tendencies. The clergy is divided. Starting treasury is high but stability is fragile. Storyline pool weighted toward political and religious storylines. Mandatory opening storyline: *The Disputed Crown*.

### 11.3 The Merchant's Gambit
A kingdom built on trade, facing a shifting economic landscape. Merchant class is large and powerful, beginning to clash with traditional nobility. Advanced maritime and trade knowledge but weak military knowledge. Two mercantile neighbors (one friendly, one competitive), one aggressive neighbor eyeing the kingdom's wealth. Event pools weight trade and economic events. Opening storyline: *The Trade War*.

### 11.4 The Frozen March
A kingdom facing military pressure from an aggressive northern neighbor during a harsh climate cycle. Winter seasonal modifiers are doubled. Food production is strained. Military caste is strong but under-equipped. Some military knowledge but minimal trade knowledge. Event pools weight military, food, and diplomacy. Opening storyline: *The Gathering Storm*.

### 11.5 The Faithful Kingdom
A deeply religious kingdom where the clergy holds unusual influence. Faith starts very high. Clergy population is large, consuming significant treasury. Religious orders are already established. A neighbor follows a rival faith, creating permanent diplomatic friction. Cultural knowledge is advanced but military knowledge is weak. Event pools weight religious, cultural, and diplomatic events. Opening storyline: *The Rival Faith*.

### 11.6 The Conquered Crown
The player rules a kingdom recently subjugated. Commoner and nobility satisfaction are both very low. A foreign occupying neighbor maintains tense oversight. Military is depleted. Stability is critically low. But the population is large, faith is a source of quiet resistance, and a smuggling network provides a functioning intelligence infrastructure. Event pools weight unrest, espionage, and diplomatic events. Opening storyline: *The Occupied Throne*.

### 11.7 The Scholar's Ambition
A small, resource-poor kingdom compensating with accumulated knowledge. Starting with advancements across multiple knowledge branches and a functioning university. Clergy is scholarly and effective. Surrounded by larger, less educated neighbors who view it with suspicion. Military is small. Treasury is modest. Survival depends on leveraging knowledge into diplomatic, economic, and strategic gains. Opening storyline: *The Envious Neighbor*.

### 11.8 Scenario Override Model
Scenarios function as structured overrides applied at game start. They do not alter core resolution logic.

### 11.9 Scenario-Owned Variables
A scenario pack may override any of the following:
- Starting treasury, food reserves, resource stockpiles
- Starting population, class distribution, and class satisfaction levels
- Starting stability, military posture, and military caste strength
- Starting faith level, cultural cohesion, religious order state, and heterodox conditions
- Starting knowledge state (which advancements are already unlocked)
- Starting intelligence network strength and counter-intelligence level
- Number and profiles of regions, including local faith and cultural identity
- Number, dispositions, religious profiles, cultural identities, espionage capabilities, and starting relationships of neighbors
- Seasonal modifier overrides or climate shifts
- Event pool weighting, additions, and exclusions
- Storyline pool weighting, mandatory opening storylines, and storyline exclusions
- Special starting traits, conditions, or active event chains
- Custom introductory narrative text
- Pacing modifier (adjusting event frequency and pressure ramp)

### 11.10 Shared Engine Rules
Scenarios do not alter the fundamental meaning of core systems. By default, they reuse the same simulation engine and resolution order.

---

## 12. Consequence Visibility Rules

### 12.1 Always Previewable
The following must always be shown before the player commits an action:
- Direct resource costs
- Affected domains and affected classes
- Prerequisites and conditions
- Whether the action is reversible or persistent
- Known immediate effects

### 12.2 Directionally Previewable
The following should show likely direction but not exact values:
- Impact on stability and class satisfactions
- Impact on diplomatic relationships
- Impact on faith level and cultural cohesion
- Impact on food or treasury flow rates
- Multi-turn construction timelines
- Intelligence operation success probability range (low, moderate, high, or very high)

### 12.3 Intentionally Hidden
The following are deliberately not previewed:
- Exact event triggers caused by actions
- Long-chain cascading effects beyond two steps
- AI neighbor internal decision thresholds
- Random event and storyline variation outcomes
- Whether intelligence results are genuine or planted
- Exact class satisfaction breaking points
- Exact heterodoxy escalation thresholds

**Rule:** The player should never be blindsided by a cost or immediate consequence the game could have disclosed. Surprise should come from systemic interaction, long-term emergence, intelligence uncertainty, and narrative discovery.

**Related:**
- See `ux-blueprint.md` → Consequence Previewing, Risk Communication
- See `ui-blueprint.md` → Decree Cards, Forecast Modules

---

## 13. Save and Persistence Model

### 13.1 Autosave
The game autosaves the complete kingdom state at the end of every turn resolution, after Phase 11 is complete.

### 13.2 Manual Save
The player may manually save at any point during their action phase, before advancing time.

### 13.3 Save Contents
A save file must contain: full kingdom state, all system values, class populations and satisfactions, faith and cultural state, knowledge tree progress, intelligence network state, active events, active storylines and their branch history, active construction projects, active religious orders, standing policies, turn history, event history, neighbor states, region states, queued actions if mid-turn, and scenario identifier.

### 13.4 Session Recovery
If the game is closed mid-turn, the next session restores to the last autosave or manual save with a clear indication of where the player left off.

---

## 14. Data Exposure Requirements

### 14.1 Data Required by UI
The simulation must expose current values for all systems including class populations, class satisfactions, faith level, cultural cohesion, intelligence network strength, knowledge branch progress, active religious orders, and active storyline status — all in structured form usable by interface components.

### 14.2 Data Required by UX Feedback
The simulation must expose interpretable deltas, cause-linked changes, risk signals, consequence previews, forecast projections, class satisfaction trends, faith trajectory, and intelligence report confidence.

### 14.3 Forecast and Preview Data
The simulation should support short-horizon projections (one to three turns ahead) showing estimated directional outcomes for key resources, class satisfactions, faith, and stability. Forecasts should indicate confidence level.

### 14.4 Change Tracking Between Turns
The system must preserve prior-turn state comparisons and change history.

### 14.5 Crown Bar Data
The simulation must expose: current turn number, current season and year, treasury balance, food reserves, overall stability rating, and count of unresolved urgent matters.

### 14.6 Intelligence Report Data
Intelligence reports must be structured with a confidence indicator, a source operation type, a target, findings, and an internal flag (not exposed to the player) indicating whether the report is genuine or planted. Corrections to false intelligence are delivered through the report system on the following turn.

**Related:**
- See `ui-blueprint.md` → UI-to-System Mapping, Crown Bar, Intelligence Screen
- See `ux-blueprint.md` → Decision Support UX
