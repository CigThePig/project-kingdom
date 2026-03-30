# UX Blueprint

## Purpose
This document defines how the game should feel to use, how the player understands information, how decisions are staged, and how movement through the interface supports clarity, pressure, and confidence.

## Scope
This file covers interaction logic, comprehension priorities, flow design, decision support, feedback, onboarding, and accessibility principles. It does not define simulation rules or exact screen composition.

## What This File Owns
- Experience pillars and intended feel of use
- Information hierarchy rules
- Player mental model
- Navigation logic and drill-down depth rules
- Decision support behavior
- Feedback and response patterns
- Onboarding and learnability principles
- Error prevention and recovery behavior
- Readability and comfort standards
- Turn advance ceremony and flow
- Storyline experience design

## What This File Does Not Own
- Exact screen layouts or component styling
- Simulation values, rules, or balance
- Visual theme tokens
- Resource formulas or event math
- Screen-by-screen structural specifications

## Related Files
- `ui-blueprint.md`
- `gameplay-blueprint.md`

---

## 1. Experience Pillars

### 1.1 Rule Through Information
The player should feel that rulership happens through reading, judging, prioritizing, and deciding rather than through direct manipulation of a visible world scene.

### 1.2 Calm Pressure
The game should create pressure through accumulating consequences and meaningful tradeoffs, not through frantic interaction. Class tensions, religious shifts, and intelligence uncertainty should contribute to the feeling of pressure without making the interface feel hostile.

### 1.3 Clarity Before Depth
The player should be able to understand the kingdom's state at a glance before choosing to enter deeper information layers. This applies equally to established systems like treasury and food and to newer dimensions like class satisfaction, faith, and intelligence.

### 1.4 Weight Without Friction
Decisions should feel consequential, but the interface should not feel burdensome or slow when performing ordinary tasks.

### 1.5 Layered Complexity
The game should reveal detail progressively. Depth should exist, but understanding should not require immediate mastery. The population class system, faith mechanics, knowledge tree, and espionage system each add strategic depth, but the player should encounter them gradually through the onboarding flow and progression structure.

### 1.6 Narrative Voice
The kingdom speaks to the player through its advisors and records. Information should feel like it comes from a competent but imperfect advisory apparatus — reports are written with a civic formality, events arrive as dispatches, intelligence reports arrive as sealed briefings, storyline events arrive as dramatic dispatches with narrative weight, and consequences are delivered as assessments. The voice is institutional, not personal. There is no single named narrator, but the tone is consistent: measured, serious, and occasionally dry. Storyline text may be slightly more vivid and character-driven than standard event text, since storylines introduce named figures and specific dramatic stakes.

### 1.7 Living Society
The player should feel that they are governing a society of people with competing interests, spiritual needs, and cultural identity — not merely managing a spreadsheet of abstract values. Class satisfaction, faith, and culture should feel like governing a population, not optimizing meters. Intelligence should feel like peering into uncertainty, not clicking a reveal button.

**Related:**
- See `ui-blueprint.md` → Global Screen Architecture
- See `gameplay-blueprint.md` → Core Gameplay Loop

---

## 2. Player Mental Model

### 2.1 What the Player Is Doing
The player is not acting as a battlefield commander or colony micromanager. The player is evaluating the kingdom's condition across material, social, spiritual, and strategic dimensions, selecting priorities, issuing responses, and accepting tradeoffs under the constraint of limited action slots per turn. The player governs a society, not a machine.

### 2.2 What the Player Should Always Know
At nearly all times, the player should be able to answer:
- Is the kingdom stable or strained?
- What is the most urgent problem?
- What changed recently?
- Are any social classes dangerously unhappy?
- Is the kingdom's faith and cultural identity secure?
- What actions are available now?
- How many action slots remain this turn?
- What am I risking if I act or do nothing?

### 2.3 Where Key Information Lives
The experience should establish reliable expectations for where things are found:
- Current state on the dashboard and crown bar
- Action options on the Decrees and Policies screens
- Social and spiritual condition on the Society screen
- Intelligence on covert matters on the Intelligence screen
- Kingdom advancement on the Knowledge screen
- Detailed explanations in Reports and the right intelligence panel
- Historical context in the Archive
- Active crises, storyline developments, and events on the Events screen
- Regional detail on the Regions screen

### 2.4 How Actions Relate to Consequences
The player should learn that major actions affect multiple systems and multiple classes, may produce delayed effects, and often trade one form of security for another. A military expansion may strengthen defense but anger commoners through conscription and strain the treasury. A religious edict may please the clergy but restrict merchant freedom. The game should reinforce this through consequence previews showing affected classes, post-turn change reports, and traceable cause-effect links in the archive.

### 2.5 How Intelligence Relates to Trust
The player should learn that intelligence is valuable but not infallible. Early in the game, the player may take intelligence at face value. Over time, the experience of false intelligence corrections should teach the player to weigh intelligence confidence and maintain healthy skepticism. The game should never punish the player for trusting intelligence that was presented identically to real data — the correction system exists to create an interesting relationship with uncertainty, not to make the player feel cheated.

### 2.6 How Storylines Relate to the Simulation
The player should understand that storylines are not separate from the simulation — they emerge from kingdom conditions, their choices have real mechanical effects, and their consequences persist after the storyline resolves. Storyline events should feel like the kingdom's most dramatic moments, not like interruptions to the main game.

---

## 3. Information Hierarchy

### 3.1 What Must Be Visible Immediately
On entering the game or returning to the dashboard, the player should immediately understand: kingdom condition (stable, strained, or critical), active pressure count, season and turn number, whether there are urgent unresolved matters, and whether any class satisfaction or faith level is in a warning or critical state.

### 3.2 What Must Be Understandable Within One Turn
Within a single turn cycle, the player should understand how to inspect a problem, review a decision, commit an action, and interpret the resulting change. The full loop should be learnable by observation within two to three turns.

### 3.3 Progressive Disclosure Rules
Detail should be layered from summary to explanation to breakdown. The default view should be summary-first. Supporting details should be one interaction away whenever possible. No critical information should be buried beyond two drill-down layers. This applies to all systems including the class satisfaction factors, faith mechanics, knowledge prerequisites, and intelligence confidence — all of these should be scannable at summary level and explorable at detail level.

### 3.4 Priority Ordering of Information
Urgent and decision-relevant information must outrank background detail, historical reference, and deep explanatory breakdowns. Within any screen, items requiring player action should appear before items that are purely informational. Storyline events requiring a decision should appear above standard events.

**Rule:** The game should never require the player to dig through archival or tertiary views to identify the current crisis.

---

## 4. Core Interaction Flows

### 4.1 Open Game / Return to Dashboard
The first view should anchor the player in present state. Returning players should regain situational awareness quickly. If there are unresolved events or active storyline branch points from the previous session, a brief re-orientation note should appear on the dashboard.

### 4.2 Review Kingdom Condition
The default flow should support scanning condition, identifying pressure, and deciding whether action is immediately required. The dashboard provides this at glance level — now including class satisfaction mini-cards, faith indicator, and active storyline status. Reports provide this at depth level.

### 4.3 Inspect an Issue
Issue inspection should answer: what is happening, why it matters, what systems and classes it touches, what severity it carries, and what kinds of responses are available. The path from an issue card to its response options should never require more than one navigation step.

### 4.4 Review a Decree
Before acting, the player should be able to understand: action slot cost, resource costs, prerequisites (including knowledge prerequisites and class/faith thresholds), near-term effects, likely tradeoffs, affected domains and classes, and whether the action is reversible or persistent. All of this should be visible on the decree card and its right-panel detail expansion.

### 4.5 Review a Policy Change
Before changing a policy, the player should see the current setting, the proposed setting, the projected impact summary on relevant class satisfactions and system flows, and any related active conditions that may interact with the change.

### 4.6 Review an Intelligence Operation
Before committing an intelligence operation, the player should see: the operation type, the target, the success probability range, the cost, the risk profile (what happens on failure), and the potential payoff. The intelligence screen's right panel should show the full risk detail for the selected operation.

### 4.7 Review Knowledge Progress
The player should be able to quickly assess: which branch is currently focused, how close the next milestone is, what the next milestone unlocks, and whether changing focus would serve immediate needs. The knowledge screen should make both the current path and the broader landscape of possibilities clear.

### 4.8 Commit an Action
Committing an action should feel deliberate and clear. Standard actions commit with a single tap and a brief visual acknowledgment. High-impact actions, crisis responses, intelligence operations, and all actions affecting faith or class satisfaction at critical levels require a confirmation step that restates the key consequence.

### 4.9 Queue and Manage Actions Within a Turn
The player may queue multiple actions before advancing time. Queued actions should be visible and manageable: reorderable if order matters, and cancellable at any time before the turn advances. The action slot counter updates in real time as actions are queued and removed.

### 4.10 Advance Time
Time advancement is the most consequential single action in the game. The flow is:
1. Player selects Advance Time (accessible from crown bar or dashboard).
2. A confirmation surface appears showing: current season, queued actions summary, any unused action slots, any unresolved events flagged as time-sensitive, active storyline status, and pending festival if applicable.
3. Player confirms advancement.
4. Resolution plays out. A brief transition indicates time is passing.
5. The player lands on a turn summary view showing what changed, organized by: critical changes first, then notable changes, then routine updates. The summary includes: resource changes, class satisfaction shifts, faith and culture changes, intelligence report arrivals, knowledge milestone unlocks, construction completions, storyline progressions, and new events.
6. The player dismisses the summary and returns to the updated dashboard.

### 4.11 Review Outcome Changes
After resolution, the turn summary surfaces all meaningful changes. Each change item should be traceable to its likely cause when the game can identify one. The player can tap any change item to navigate to its home screen for deeper inspection. Intelligence report arrivals should note their confidence level. Knowledge unlocks should explain what new capability appeared. Storyline progressions should note the storyline name and what happened.

### 4.12 Experience a Storyline
Storylines create a narrative thread across multiple turns. The player's experience of a storyline should feel like:
1. **Discovery:** A storyline opening event arrives with slightly more narrative weight than a standard event. It introduces a situation, named characters or factions, and stakes.
2. **Living With It:** Between branch points, the storyline is present but not demanding. A status card on the dashboard and a note in reports remind the player the situation is developing.
3. **Decision Points:** Branch point events arrive with clear dramatic stakes. The right panel shows the full storyline arc context: what happened before, what's at stake now, and what the consequences of each choice might affect. These should feel like the game's most consequential single moments.
4. **Resolution:** The final resolution event ties the arc together. The consequences are concrete and mechanical, not just narrative. A summary of the full storyline path and its effects is added to the archive.

The game should never force the player to resolve a storyline branch point before attending to a more urgent crisis. Storyline events have deadlines (measured in turns), but those deadlines should be visible and generous enough that the player retains agency over their turn priorities.

---

## 5. Navigation UX

### 5.1 Global Navigation Logic
Global navigation should be stable and predictable. The left rail on desktop and bottom bar on mobile always show the same items in the same order. The active screen is always visually indicated. With twelve primary screens, the navigation must remain scannable — icon-first with text labels on desktop, icon-only with text on the active item on mobile.

### 5.2 Section-to-Section Movement
Transitions between major sections should preserve context, not feel like entering separate applications. If the player was inspecting a specific region and navigates to Decrees, returning to Regions should restore the previous view state within the session.

### 5.3 Drill-Down Depth Rules
Decision-critical information should be reachable within one or two layers from its home screen. Deep nesting (three or more layers) should be reserved for historical reference or specialized breakdowns. The maximum practical depth from any primary screen is three levels: screen → detail view → breakdown.

### 5.4 Return Paths and Backtracking
Players should always have a clear way back to the dashboard and to the previous context from which they drilled down. A persistent breadcrumb or back affordance must be present on any view deeper than the primary screen level.

### 5.5 Cross-Screen Linking
When a system on one screen is affected by something shown on another screen, the interface should provide a direct link. Examples: a food shortage warning on the dashboard links to the Food report. A commoner unrest event links to the commoner detail on the Society screen. A knowledge unlock notification links to the new decree it enabled on the Decrees screen. An intelligence report about a neighbor links to that neighbor's profile on the Diplomacy screen. A storyline event affecting a region links to the region detail.

### 5.6 Mobile Navigation Behavior
Mobile navigation must preserve orientation. The bottom tab bar shows five primary items: Dashboard, Decrees, Events, Society, and a More menu. The More menu provides access to all other screens. Compression of space should not create ambiguity about where the player is. The right intelligence panel is always accessible via a consistent slide-up gesture or tab.

---

## 6. Decision Support UX

### 6.1 Consequence Previewing
Whenever the player is about to take an action, the game should preview: direct resource costs, affected domains and affected classes, immediate effects, and directional impact on key systems. Previews follow the visibility rules defined in the gameplay blueprint's Consequence Visibility Rules section. For actions affecting class satisfaction, the preview should name which classes are helped and which are hurt.

### 6.2 Forecast Presentation
Forecasts should help the player think ahead without pretending to guarantee outcomes. They should frame expected direction and visible risk using simple visual projections (one to three turns ahead) with confidence shading. Text accompanies charts to explain the main takeaway. Forecasts should now include class satisfaction trajectories, faith trend, and knowledge milestone proximity when relevant.

### 6.3 Risk Communication
Risk should be communicated using a four-level scale matching event severity: low, rising, severe, and imminent. Risk indicators should be consistent across all screens and always use the same iconography and color treatment. Intelligence-specific risk (operation failure probability) should use the same scale applied to the covert context.

### 6.4 Explaining Change Over Time
When the kingdom changes, the player should be able to understand both the change and the likely cause. The turn summary and report system should link consequence back to decision, condition, or event when practical. The phrase pattern is: "X changed because of Y" where Y is a traceable cause. Class satisfaction changes should explain which factors drove the shift. Faith changes should explain whether investment, neglect, or external pressure was the cause.

### 6.5 Communicating Tradeoffs
Major actions should make visible which domains and classes benefit and which may suffer. This is central to the kingdom-management feel. Class tradeoffs are the most important new dimension: the player should always see when an action that helps one class hurts another. Tradeoff communication should appear in decree consequence previews and in the right intelligence panel during decision review.

### 6.6 Cross-Domain Impact Alerts
When an action or event in one domain significantly affects another domain, a brief cross-domain alert should appear on the affected domain's summary card and in the right intelligence panel. Examples: issuing a military recruitment decree triggers a labor impact note on Population. A religious edict triggers a merchant freedom note on Trade. An intelligence operation failure triggers a diplomacy impact note.

### 6.7 Intelligence Confidence Communication
Intelligence reports should always show their confidence level. The player should develop an intuition for how much to trust different confidence tiers over time. When a report is corrected (revealed as false intelligence), the correction should be clear but not punishing — framed as "updated intelligence" rather than "you were deceived." The goal is to create an interesting trust dynamic, not frustration.

**Rule:** The player should never be surprised by a visible cost that the game had the ability to disclose beforehand.

---

## 7. Onboarding and Learnability

### 7.1 First-Time User Experience
The first-time experience should teach the player the dashboard, the action model, the action budget, and the turn cycle before presenting the full system density. Not all twelve screens need to be introduced immediately. The first turn focuses on the core loop. Subsequent turns introduce additional screens and systems progressively.

### 7.2 First Turn Flow
Turn one should:
1. Open on the dashboard with a brief framing note establishing the kingdom and its social structure.
2. Highlight the crown bar and explain what each element represents.
3. Present one simple event requiring a response to teach the event-to-action flow.
4. Guide the player through one decree to teach action commitment and slot usage.
5. Guide the player through advancing time.
6. Show the turn summary and explain how to read changes, including class satisfaction shifts.

### 7.3 System Introduction Pace
Systems should be introduced in a deliberate order across the first several turns:
- **Turn 1:** Dashboard, crown bar, events, decrees, turn cycle (core loop).
- **Turn 2:** Reports, policies, and the Society screen (class satisfaction and faith become visible as factors in the turn summary).
- **Turn 3:** Regions and military. A military-related event or border tension introduces the military screen.
- **Turn 4:** Trade and diplomacy. A neighbor interaction opens the diplomatic dimension.
- **Turn 5–6:** Intelligence and knowledge. An event or advisor note introduces the intelligence screen. The knowledge screen becomes relevant as the player's first research milestone approaches.
- **Turn 7+:** All systems active. First storyline may trigger after turn seven.

This introduction pace applies to the base sandbox scenario. Other scenarios may front-load specific systems relevant to their narrative (for example, The Conquered Crown introduces intelligence and espionage earlier).

### 7.4 Early-Turn Guidance
After the first turn's guided experience, turns two through six should use contextual tips attached to relevant surfaces rather than modal overlays. Tips should introduce new screens when they first become relevant and explain new mechanics when they first appear in a turn summary.

### 7.5 Glossary and Tooltip Strategy
Domain terms may use tooltips, glossary access, or concise inline explanations. Tooltips should appear on hover (desktop) or long-press (mobile) for any term that might be unfamiliar. This is especially important for class mechanics, faith vocabulary, knowledge branch names, and intelligence terminology. A full glossary should be accessible from settings.

### 7.6 Reducing Cognitive Load
The game should avoid presenting all systems as equally urgent. The twelve-screen navigation is manageable because not all screens demand attention every turn. The dashboard serves as a triage surface that directs the player to whichever screens need attention. The progressive system introduction ensures the player is never overwhelmed at the start. The priority ordering of information, alert severity tiers, and summary-first disclosure model all serve cognitive load management. The dashboard should feel scannable in under ten seconds even in a complex kingdom state.

---

## 8. Feedback and Response Patterns

### 8.1 Light Actions
Minor interactions such as navigation, expansion, filtering, or report inspection should feel immediate and produce no confirmation ceremony. Response time should be imperceptible.

### 8.2 Standard Action Commitment
Standard decree commitment should produce a brief visual acknowledgment: the action slot counter updates, the decree card shows a committed state, and a subtle sound plays if audio is enabled.

### 8.3 High-Impact Action Commitment
High-impact actions, crisis responses, intelligence operations, and all actions affecting faith or class satisfaction at critical levels should produce a confirmation dialog restating the key consequence before commitment. The visual weight of the confirmation should match the severity of the action.

### 8.4 Turn Resolution Feedback
After time advances, the game should present a structured turn summary showing all meaningful changes organized by severity. The summary should include: resource changes, class satisfaction shifts with cause labels, faith and culture changes, intelligence report arrivals (with confidence), knowledge milestone unlocks, construction completions, storyline developments, and new events. The player should not need to hunt for changes.

### 8.5 Knowledge Advancement Feedback
When a knowledge milestone is reached, the turn summary should highlight the unlock with the positive state treatment and clearly state what new capability appeared (new decree, improved system, new construction, or new policy option). A link should take the player to the relevant screen where the new capability is available.

### 8.6 Storyline Feedback
Storyline events should arrive with slightly more ceremony than standard events — a distinct notification tone if audio is enabled, a narrative-style header, and the storyline name prominently displayed. Storyline resolution events should receive additional weight, with the full consequence summary showing how the arc's decisions shaped the outcome.

### 8.7 Intelligence Feedback
Intelligence report delivery should feel like receiving a sealed briefing. Reports arrive in the turn summary with a confidence indicator. When a previous report is corrected, the correction should appear in the same turn summary section, clearly linked to the original report, with an "updated intelligence" framing rather than an accusatory tone.

### 8.8 Alerts, Warnings, and Escalation
The same issue may move from informational to warning to critical over time. Escalation should follow the four-tier severity model and should feel ordered and understandable. Class satisfaction approaching critical levels should escalate through the same system. When an issue escalates, the turn summary should note the escalation and link to the prior state.

### 8.9 Empty, Loading, and No-Data Cases
These states should remain comprehensible and thematic. They should never imply a broken system when the actual state is simply quiet, resolved, or unavailable. Empty states should use brief, tone-consistent placeholder text: "No active conflicts" rather than "Nothing to show." The intelligence screen with no active operations should read "No operations in progress. Network strength: [level]." The knowledge screen with no active research should prompt the player to set a research focus.

---

## 9. Error Prevention and Recovery

### 9.1 Preventing Misclicks
Major actions should be protected from accidental commitment through hierarchy, spacing, and where needed, explicit confirmation. The turn advance button should require a confirmation step every time. Intelligence operations should always require confirmation given their risk profile.

### 9.2 Protecting Against Hidden Consequences
If an action has obvious costs, requirements, or conflicts, the player should not need outside knowledge or trial-and-error to discover them. All previewable consequences defined in the gameplay blueprint must be surfaced before commitment. This includes class satisfaction impacts and faith effects.

### 9.3 Reversibility and Confirmation Rules
The experience should distinguish clearly between three tiers:
- **Freely reversible:** Navigation, inspection, filtering, expanding details, browsing the knowledge tree.
- **Reversible within the turn:** Queuing and cancelling actions before advancing time.
- **Committed and irreversible:** Advancing time. Once time advances, all queued actions execute and cannot be undone.

The tier of any action should be obvious from its interaction pattern. Intelligence operations should feel particularly weighty given their risk of failure and potential diplomatic consequences.

### 9.4 Recovering from Confusion
If the player becomes lost in depth views, the dashboard link in the navigation rail should always be one tap away. The breadcrumb trail should show the current position. The right intelligence panel should always offer context for the current view. With twelve primary screens, the dashboard's role as a universal orientation surface is critical.

---

## 10. Accessibility and Readability

### 10.1 Text Density
Dense information is allowed, but the default experience should use summaries, headings, grouping, and whitespace to keep long reading sessions sustainable. No default view should present more than three major information groups without visual separation. The Society screen's class detail and the Knowledge tree are the most information-dense new surfaces and should be designed with particular care for scanability.

### 10.2 Contrast and Legibility
Text-heavy play depends on strong contrast and font sizing that supports comfortable scanning over long sessions. Minimum body text size should be 14px equivalent. Status colors must meet WCAG AA contrast ratios against their background surfaces. The intelligence screen's muted indigo accent must maintain legibility.

### 10.3 Input Simplicity
Interaction should not depend on precision-heavy gestures or hidden control patterns. All critical interactions should be achievable with standard tap and scroll. No drag-and-drop should be required for essential gameplay. The knowledge tree must be fully navigable through taps, not hover-only interactions.

### 10.4 Responsive Comfort
The experience should remain coherent across desktop and mobile without turning mobile into a compromised afterthought. Mobile is a first-class platform. All gameplay must be completable on mobile with no information hidden behind desktop-only views. The knowledge tree and system mapping table should have mobile-specific layouts that preserve readability.

### 10.5 Long-Session Usability
Because the game asks the player to read, compare, and decide repeatedly, fatigue reduction should be treated as a core UX requirement rather than a late polish pass. This includes: controlled information density, consistent layout expectations, restrained motion, muted but effective color use, and the ability to save and exit at any point mid-turn.

### 10.6 Difficulty and Pacing Accessibility
The game should support at least two pacing modes:
- **Standard:** Full action budget and event pressure as designed.
- **Deliberate:** Extended action budget (four slots instead of three) and reduced event frequency. Intended for players who want more time to learn and explore systems.

Pacing mode is selected at game start and noted in the save file.

---

## 11. UX Dependencies

### 11.1 Dependencies on UI Layout
This file depends on the UI layer to provide stable surfaces, visible priorities, readable states, accessible consequence display, a persistent crown bar, a functioning right intelligence panel, distinct visual treatment for storyline events and intelligence surfaces, and a turn advance confirmation surface.

### 11.2 Dependencies on Gameplay Data
This file depends on gameplay outputs being structured into current state, forecast signals, deltas, urgency markers, action availability, action slot status, class populations and satisfactions with factor breakdowns, faith and culture values, intelligence network data with report confidence, knowledge progress with milestone proximity, storyline states, cause-linked changes, severity-tiered events, and consequence visibility categories.

### 11.3 Dependencies on Scenario Framework
Scenario starts may alter pressure, pacing, system introduction order, or framing, but must not break the player's understanding of how to read the kingdom or use the interface. The onboarding flow may need scenario-specific adjustments — for example, The Conquered Crown should introduce intelligence earlier than the standard pace, and The Faithful Kingdom should foreground the Society screen's faith tab sooner.

**Related:**
- See `ui-blueprint.md` → Screen Layout Specifications, Right Intelligence Panel
- See `gameplay-blueprint.md` → Data Exposure Requirements, Consequence Visibility Rules, Scenario Designs
