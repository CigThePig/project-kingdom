# UI Blueprint

## Purpose
This document defines the visual and structural interface layer for the kingdom management game. It describes how the game is presented on screen through layouts, screens, panels, components, visual hierarchy, and responsive behavior.

## Scope
This file covers the shape of the interface, not the rules of the simulation and not the behavioral logic of player understanding. It defines what appears where, how information is grouped, and how interface states are visually represented.

## What This File Owns
- Global screen architecture
- Persistent layout zones and their contents
- Screen inventory and screen-level structure
- Shared component inventory
- Visual hierarchy and presentation rules
- Responsive layout behavior
- Visual state rules for alerts, trends, and unavailable actions
- Seasonal and temporal visual communication
- Audio direction

## What This File Does Not Own
- Simulation logic or balancing
- Turn resolution rules
- Player guidance or onboarding strategy
- Decision psychology or comprehension flow
- Forecast calculations
- Scenario rules or kingdom progression systems

## Related Files
- `ux-blueprint.md`
- `gameplay-blueprint.md`

---

## 1. UI Design Goals

### 1.1 Visual Role of the Interface
The interface is the player's primary window into the kingdom. Because the game is text-forward and does not rely on animated world scenes, the UI must carry atmosphere, clarity, and authority at the same time.

### 1.2 Information-First Presentation
The interface must prioritize legibility and structured reading over spectacle. Important information should feel immediate and layered, while detail should remain accessible without overcrowding the default view.

### 1.3 Modern-Retro Identity
The UI should blend the ceremonial tone of reports, ledgers, decrees, and archives with a modern dashboard structure. The retro influence comes from the information style, not from forced pixel nostalgia.

**Related:**
- See `ux-blueprint.md` → Experience Pillars
- See `gameplay-blueprint.md` → Game Identity

---

## 2. Visual Language

### 2.1 Overall Aesthetic
The visual identity should feel like a royal command desk, archive terminal, and strategy dashboard combined. Surfaces should feel weighty and structured rather than ornamental for ornament's sake.

### 2.2 Typography System
Use a refined serif for major headings and formal screen titles. Use a highly readable body font for reports, summaries, cards, and dense interface copy. Numeric and stat-heavy areas should use a crisp, high-legibility style with strong alignment and tabular figures.

### 2.3 Color System
The palette should be muted and serious. Base surfaces should rely on dark slate, charcoal, iron-blue, muted parchment, and restrained metallic accents. Status colors should be controlled and never loud:
- Warning: muted amber
- Critical: restrained deep red
- Positive: desaturated green or teal
- Neutral change: soft blue-gray
- Locked or unavailable: reduced opacity with muted overlay
- Covert or intelligence: muted indigo or deep violet undertone
- Faith or cultural: warm bronze or antique gold undertone

### 2.4 Seasonal Color Accents
The interface should carry a subtle seasonal accent that shifts across the year without disrupting the core palette:
- Spring: faint warm green undertone
- Summer: faint gold or warm amber undertone
- Autumn: faint copper or burnt sienna undertone
- Winter: faint cool blue or silver undertone

Seasonal accents apply to the crown bar background, dashboard header region, and turn-advance confirmation surfaces. They should never compete with status colors.

### 2.5 Iconography
Icons should be simple, symbolic, and systemic. Resource and domain icons should feel civic or heraldic rather than playful. Each core system should have a consistent icon used across all screens where that system appears. New system icons should follow the same family:
- Each population class should have a distinct icon (crown for nobility, chalice or book for clergy, scales for merchants, wheat sheaf for commoners, shield for military caste)
- Faith should use a flame or temple icon
- Cultural cohesion should use an interlocking ring or banner icon
- Espionage should use a lantern or shadow icon
- Knowledge branches should each have a branch-specific icon (plough, sword, scroll, ship, lyre, compass)

### 2.6 Panels, Surfaces, and Borders
Panels should feel like mounted information surfaces, not floating toy cards. Borders and separators should be present but restrained. Important documents such as major events, storyline developments, or royal decisions may receive more formal framing than standard cards. Storyline events should use a distinct border treatment to differentiate them from standalone events.

### 2.7 Spacing and Layout Rhythm
The interface should use deliberate spacing with clear visual lanes. Dense information is acceptable only when strongly grouped and scannable.

### 2.8 Motion and Transition Style
Motion should be minimal, smooth, and document-like. Expansions, updates, and screen changes should feel like revealing records or sliding reports into place.

**Rule:** Motion may support hierarchy and feedback, but must never compete with reading.

### 2.9 Audio Direction
Audio should be sparse, ambient, and atmospheric. Background tone should evoke a quiet command chamber. Sound effects are reserved for:
- Turn advance confirmation: a weighted, deliberate tone (seal stamp, page turn, or bell)
- Critical alerts: a restrained low chime, not an alarm
- Decree commitment: a brief authoritative sound (quill scratch, stamp)
- Event arrival: a subtle notification tone
- Storyline event arrival: a slightly more distinct variant of the event tone to signal narrative significance
- Intelligence report delivery: a quiet, coded-feeling sound (soft click or paper rustle)
- Knowledge advancement unlock: a clear, bright but brief tone (chime or bell)
- Festival activation: a warm, brief celebratory tone

Music, if present, should be ambient and seasonal. Audio must always be optional and independently adjustable. The game should function fully without sound.

---

## 3. Global Screen Architecture

### 3.1 Persistent Layout Zones
The main application layout should be organized into persistent zones that create a stable mental model across screens:
- Top crown bar
- Left navigation rail
- Central content chamber
- Right contextual intelligence panel
- Contextual bottom actions on smaller screens where appropriate

### 3.2 Crown Bar Contents
The crown bar is the persistent top-level status strip visible on every screen. It contains:
- Kingdom name
- Current turn number
- Current season and year, with seasonal accent indicator
- Treasury balance with trend arrow
- Food reserves with trend arrow
- Overall stability rating with trend arrow
- Unresolved urgent matters count (links to Events screen)
- Action slots remaining this turn (filled/total indicator)
- Settings and save access

The crown bar must never require horizontal scrolling. On mobile, it should compress to show the four most critical values (turn/season, treasury, food, stability) with a tap-to-expand for the rest.

### 3.3 Desktop Structure
Desktop should show the full command-desk form of the interface. The left rail remains persistent, the top crown bar remains fixed, the center holds the active screen, and the right panel supplies contextual supporting intelligence.

### 3.4 Mobile Structure
Mobile should preserve the same information architecture but change the physical arrangement. The top crown bar remains compact, navigation becomes a bottom tab bar or compressed hamburger rail, and the right intelligence panel converts into a slide-up sheet accessible from any screen.

### 3.5 Navigation Model
Primary navigation should move between major game sections via the left rail (desktop) or bottom bar (mobile). The primary navigation items are:
- Dashboard
- Reports
- Decrees
- Society (Population Classes and Faith/Culture)
- Regions
- Military
- Trade
- Diplomacy
- Intelligence
- Knowledge
- Events
- Archive

Secondary navigation exists within screens through tabs, accordions, filters, and controlled drill-downs. On mobile, the bottom bar should show the five most-used items (Dashboard, Decrees, Events, Society, and a More menu containing the rest) to avoid overcrowding.

**Related:**
- See `ux-blueprint.md` → Navigation UX

---

## 4. Primary Screens

### 4.1 Main Dashboard
The dashboard is the central command surface. It presents current kingdom condition, urgent matters, active storyline status, and short-horizon trajectory. This is the player's home screen and the default return destination.

### 4.2 Reports
The reports area is the formal intelligence archive for deeper system-level reading. It organizes domain-specific records and begins each domain view with an executive summary. Report domains mirror core systems: Treasury, Food, Population, Resources, Military, Stability, Faith and Culture, Intelligence, Knowledge, Development.

### 4.3 Decrees
The decrees area contains player actions presented as policy and rulership instruments. It supports scanning by category, comparison of options, and consequence previewing. Decrees are organized by domain: Economy, Agriculture, Military, Diplomacy, Development, Public Order, Trade, Faith, Intelligence, Knowledge. The decree pool visibly expands as knowledge advancements unlock new options.

### 4.4 Policies
The policies area displays all active standing policies, their current settings, and their ongoing effects. The player can review, compare, and change one policy per turn from this surface. Policies are grouped by domain and include: taxation, military recruitment, trade openness, rationing, research focus, religious tolerance, festival investment, intelligence funding, and labor priorities.

### 4.5 Society
The society screen presents the kingdom's social fabric. It has two primary tabs:

**Population Classes tab** shows all five classes with their population counts, satisfaction levels, satisfaction trend arrows, and key mechanical relationships. Each class has an expandable detail card showing what affects its satisfaction, what it contributes, and what risks exist at current satisfaction levels.

**Faith and Culture tab** shows faith level, cultural cohesion, active religious orders, current heterodox pressures if any, upcoming or recent festival status, and regional faith breakdown. Religious orders show their active bonuses and upkeep costs.

### 4.6 Regions
The regions area presents the kingdom's territorial breakdown through jurisdiction-style cards and detail panels. Each region card shows primary output, local condition, population with class breakdown, development level, local faith profile, cultural identity, and any active local events, construction, or storyline effects.

### 4.7 Military
The military area presents military condition, readiness, composition (showing military caste versus conscript breakdown), assignments, force posture, equipment state, intelligence advantage if applicable, and active conflicts. If a conflict is ongoing, the conflict status panel takes priority position.

### 4.8 Trade
The trade area presents commerce, exchange, import/export options, active trade agreements, available trading partners, and economic flow summaries. Trade availability is filtered by diplomatic relationships, resource surplus/deficit, and trade knowledge level. Merchant class prosperity is shown as a contextual indicator.

### 4.9 Diplomacy
The diplomacy area presents neighboring realms, relationship state, agreements, tensions, and foreign-facing actions. Each neighbor has a dedicated profile card showing disposition, relationship score, religious alignment indicator, cultural alignment indicator, active agreements, available actions, and intelligence exposure level (how much the player knows about this neighbor's internals based on espionage).

### 4.10 Intelligence
The intelligence screen is the command center for covert operations. It presents:
- Intelligence network strength and trend
- Counter-intelligence level
- Available operations (filtered by network strength) with success probability ranges, costs, and risk summaries
- Active operation results: a briefing-style list of recent intelligence reports with confidence indicators
- Internal surveillance findings if active
- A warning indicator if any reports from the previous turn were corrected (revealed as false intelligence)

The intelligence screen should feel distinct from other screens — slightly more austere, with a muted indigo accent suggesting secrecy and precision.

### 4.11 Knowledge
The knowledge screen presents the advancement tree. It should show:
- All six knowledge branches arranged visually (a branching tree, a radial layout, or a horizontal progression — whichever reads best in testing)
- Current research focus (highlighted branch)
- Progress toward the next milestone in the focused branch
- Unlocked advancements shown as filled nodes with brief descriptions of what they enabled
- Locked advancements shown as dimmed nodes with prerequisite indicators
- Cross-branch dependencies shown as connecting lines between branches
- The scholarly clergy contribution and research infrastructure indicators

The knowledge screen should feel aspirational — the tree should convey a sense of expanding possibility as advancements unlock.

### 4.12 Events
The events area contains unresolved matters, active event chains, active storyline events, and notable kingdom developments. Events requiring a player response are visually prioritized at the top. Storyline events use a distinct border treatment and show the storyline name and current act. Event chain membership is indicated with a linking marker.

### 4.13 Archive
The archive stores resolved records, historical summaries, past decisions, storyline resolution summaries, and turn-by-turn kingdom history. Items are archived automatically at the end of the turn in which they resolve. The archive supports date grouping, category filtering, keyword search, and historical traceability. Completed storylines receive a dedicated archive entry summarizing the full narrative arc and its consequences.

**Rule:** Every primary screen must answer one dominant player question and visually subordinate everything else to that question.

---

## 5. Right Intelligence Panel — Per-Screen Contents

The right panel provides contextual supporting information that changes based on the active screen. On mobile, this panel becomes a slide-up sheet.

### 5.1 Dashboard Context
Short-horizon forecast summary. Top two or three risk factors. Active storyline status summary if a storyline is in progress. Suggested areas of attention.

### 5.2 Reports Context
Cross-domain impact notes for the currently viewed report. Class satisfaction factors if viewing population or stability reports. Related historical trend if available.

### 5.3 Decrees Context
Consequence preview for the selected decree. Affected domains and affected classes. Prerequisites and cost breakdown (including knowledge prerequisites). Comparison to similar past actions if applicable.

### 5.4 Policies Context
Current effect summary for the selected policy. Projected impact of a proposed change on relevant class satisfactions and system flows. History of recent policy changes.

### 5.5 Society Context
For the selected class: detailed satisfaction factor breakdown, historical satisfaction trend, risk assessment if satisfaction is low, and related active events. For faith/culture: detailed factor breakdown for faith level and cohesion, religious order detail, and heterodoxy risk assessment.

### 5.6 Regions Context
Regional detail expansion for the selected region. Local class distribution. Local faith and cultural profile. Local event list. Development project status. Storyline effects on this region if applicable.

### 5.7 Military Context
Force composition detail including military caste versus conscript breakdown. Conflict status if active. Intelligence advantage summary. Upkeep cost breakdown. Readiness factors. Knowledge-based combat modifiers.

### 5.8 Trade Context
Trade partner relationship summary. Merchant class prosperity indicators. Market condition notes. Active agreement terms. Knowledge-based trade modifiers.

### 5.9 Diplomacy Context
Selected neighbor's full profile including religious and cultural alignment indicators. Relationship history. Recent interactions and their effects. Known intelligence on this neighbor (with confidence indicators). Available diplomatic actions based on current state.

### 5.10 Intelligence Context
Operation detail for the selected operation: full risk profile, historical success rate for this operation type, potential consequences of failure. For selected intelligence reports: source operation, confidence level, and whether the report has been corrected.

### 5.11 Knowledge Context
Selected advancement detail: what it unlocks, prerequisites from other branches, estimated turns to reach at current investment rate. Branch overview showing full progression path and remaining milestones.

### 5.12 Events Context
Background context for the selected event. Affected systems and affected classes. Related prior events in the chain if applicable. Storyline arc summary if the event is part of a storyline (showing which act this is and what prior branch decisions were made).

### 5.13 Archive Context
Full detail view of the selected archived item. Cause-and-effect trace if available. For archived storylines: the full narrative summary with decision path and final consequences.

---

## 6. Shared Component Library

### 6.1 Resource Stat Cards
Compact cards used to present core kingdom resources and condition markers. They should support current value, trend arrow, per-turn net flow, and brief interpretation text.

### 6.2 Alert and Issue Cards
Cards used to present urgent concerns, pressure points, active warnings, and actionable matters. They should indicate severity tier, affected classes if applicable, and link to the relevant screen or action.

### 6.3 Event Panels
Formal event surfaces used for state developments, petitions, diplomatic moments, disasters, and other structured decisions. Event panels should show severity, affected domains, affected classes, available response options, and chain membership indicator. Storyline events use a visually distinct variant with the storyline name, current act number, and a narrative-style header.

### 6.4 Decree Cards
Action cards representing orders, policies, or major decisions. These should support: action slot cost indicator, resource costs, prerequisites (including knowledge prerequisites and class/faith thresholds), affected domains and classes, concise effect preview, and a commit button with confirmation for high-impact actions.

### 6.5 Policy Cards
Cards representing active standing policies. These should show current setting, ongoing effect summary, affected class indicators, and a change control limited to one change per turn.

### 6.6 Class Satisfaction Cards
Compact cards for each population class showing: class icon, population count, satisfaction level (as a bar or gauge), satisfaction trend arrow, and a brief status phrase (content, uneasy, restless, critical). Tapping expands to show satisfaction factors.

### 6.7 Faith and Culture Cards
Cards showing faith level as a gauge with trend, cultural cohesion as a gauge with trend, active religious order count, and heterodoxy warning if applicable.

### 6.8 Intelligence Operation Cards
Cards for available intelligence operations showing: operation type icon, target, success probability range (as a descriptive tier), cost, risk summary, and a commit button. Completed operation reports show as briefing-style cards with confidence indicator.

### 6.9 Knowledge Branch Cards
Cards or nodes representing a knowledge branch showing: branch icon, branch name, current progress bar toward next milestone, number of unlocked versus total advancements, and active research focus indicator if this branch is currently prioritized.

### 6.10 Storyline Status Card
A compact card that appears on the dashboard and events screen when a storyline is active. Shows: storyline name, current act, a brief one-sentence status, and a link to the full storyline event if a decision is pending.

### 6.11 Neighbor Profile Cards
Cards for each neighboring kingdom showing name, disposition icon, relationship score bar, religious alignment indicator, cultural alignment indicator, active agreements, current tension level, and intelligence exposure level (how much the player knows about this neighbor).

### 6.12 Forecast Modules
Small panels or chart blocks that display projected near-future outcomes over one to three turns. Forecasts should use simple directional charts (line or bar) with confidence shading. Text summaries accompany visual projections.

### 6.13 Trend Indicators
Micro-components for signaling rising, falling, stable, worsening, or improving conditions. Use directional arrows with color coding consistent with the status color system.

### 6.14 Action Slot Indicator
A persistent micro-component showing action slots used versus total available this turn. This appears in the crown bar and is reinforced on the Decrees screen.

### 6.15 Construction Progress Bars
Compact progress indicators for active development and construction projects showing current phase, turns remaining, resource commitment, and the knowledge prerequisite that enabled this construction if applicable.

### 6.16 Tables, Accordions, and Tabs
Used for dense or layered information within reports, archives, and domain-specific screens.

### 6.17 Empty and Loading States
These states should preserve tone and clarity while making it obvious that no data, no activity, or no applicable actions are currently available.

### 6.18 Turn Advance Confirmation Surface
A dedicated confirmation surface that appears when the player chooses to advance time. It should show: current season, queued actions summary, unresolved events warning, action slots unused warning, active storyline status note, and a confirm button with ceremonial weight.

---

## 7. Screen Layout Specifications

### 7.1 Dashboard Layout
The dashboard should include:
- A high-priority summary block near the top showing kingdom health at a glance (treasury, food, stability, faith, and top class concern)
- A section for urgent matters or active pressures linking to Events
- An active storyline status card if a storyline is in progress
- A section for kingdom condition by domain using resource stat cards and class satisfaction mini-cards
- A strategic forecast or trend area using forecast modules
- Supporting context in the right panel

### 7.2 Reports Layout
Reports should be organized around domain ownership. Each report view should begin with an executive summary followed by expandable detail sections. A domain selector (tabs or sidebar) controls which report is active. Report domains now include: Treasury, Food, Population and Classes, Resources, Military, Stability, Faith and Culture, Intelligence, Knowledge, Development.

### 7.3 Decrees Layout
The decrees screen should support category filtering by domain (including Faith, Intelligence, and Knowledge categories), fast scanning via decree cards, and side-by-side understanding of available choices. The main list belongs in the center with contextual effect details in the right panel. An action slot counter should be visible at the top. Newly unlocked decrees (from knowledge advancements) should have a brief "New" indicator that persists for one turn.

### 7.4 Policies Layout
Policies should present all active policies in a scannable list grouped by domain. Policies now include research focus, religious tolerance, festival investment, and intelligence funding alongside the original set. Each policy shows its current setting and effect. The change interface appears in the right panel when a policy is selected.

### 7.5 Society Layout
The society screen uses a two-tab structure. The Population Classes tab shows all five class cards in a prominent row or column, with the most critical class satisfaction visually flagged. Below the class cards, a summary of inter-class dynamics and any active class-related events. The Faith and Culture tab shows faith and cohesion gauges prominently, religious order cards below, and heterodoxy or festival status at the bottom.

### 7.6 Regions Layout
The regions screen should default to a scannable region card layout. Region cards now include local faith and cultural identity indicators. Details open into a focused region view showing local class distribution, local faith profile, and region-specific storyline effects if any.

### 7.7 Military Layout
Military should present strategic overview first (force size, readiness, posture, intelligence advantage), then force breakdown (military caste versus conscripts), then assignment or readiness details. Active conflicts receive a dedicated status panel at the top with intelligence data shown alongside tactical information.

### 7.8 Trade Layout
Trade should present an overview of current economic flow including merchant class prosperity, then available trade actions filtered by partner and resource, then active agreement management. Knowledge-based trade modifiers should be visible.

### 7.9 Diplomacy Layout
Diplomacy should present neighbor profile cards in a row or grid for relationship snapshots (now including religious and cultural alignment indicators), then open a deep relationship view when a neighbor is selected. Intelligence exposure level per neighbor should be visible on the profile cards.

### 7.10 Intelligence Layout
The intelligence screen should present: network strength and counter-intelligence at the top, available operations in the center as operation cards, and a briefing feed of recent intelligence reports below. The briefing feed is organized reverse-chronologically. Corrected reports (revealed false intelligence) should show a correction marker linking the original report to its correction. The overall visual tone should be slightly more austere than other screens.

### 7.11 Knowledge Layout
The knowledge screen should present the full advancement tree as the dominant visual element. The currently focused branch should be highlighted. Progress toward the next milestone should be prominently displayed. Unlocked nodes show their benefits on hover or tap. The right panel should show details for the selected branch or advancement. A research summary at the top should show: current focus, investment level, scholarly clergy contribution, and estimated turns to next milestone.

### 7.12 Events Layout
Events should prioritize: storyline events requiring response first, then other unresolved events requiring response, then active informational events, then recently resolved events. Storyline events are visually distinct. Event chain indicators should be visually linked.

### 7.13 Archive Layout
Archive should prioritize retrievability. It should support date grouping, category filtering (including a Storylines filter), keyword search, and historical traceability. Completed storylines appear with a narrative summary card. Recent archive entries appear at the top by default.

**Related:**
- See `ux-blueprint.md` → Core Interaction Flows

---

## 8. Visual State Rules

### 8.1 Warning States
Warning states should use restrained amber contrast and clear iconography. They must remain visible without turning the interface into a field of alarm.

### 8.2 Critical States
Critical states should receive stronger emphasis through deep red accents, icon treatment, and prominence in layout positioning. Critical items float to the top of any list they appear in. Class satisfaction at critical levels should receive the same treatment.

### 8.3 Positive States
Positive changes should be readable but controlled using desaturated green or teal. Improvement should register clearly without shifting the game's tone toward celebratory excess. Knowledge advancement unlocks should use the positive state treatment briefly.

### 8.4 Locked or Unavailable Actions
Unavailable actions should remain legible, visibly disabled with reduced opacity, and accompanied by concise reason text explaining why the action is locked. Reasons include: insufficient resources, prerequisites not met (including knowledge prerequisites), action slots exhausted, policy change already used this turn, class satisfaction too low for clergy cooperation, intelligence network too weak, or scenario restriction.

### 8.5 Turn-Change Highlighting
After time advances, changed values should briefly surface through directional markers, highlight pulses, or update framing. Changes persist visually for the first interaction cycle of the new turn, then settle to standard presentation. Class satisfaction changes, faith shifts, knowledge milestone unlocks, and intelligence report arrivals should all participate in turn-change highlighting.

### 8.6 Seasonal Transition
When the season changes, the crown bar seasonal accent shifts, and the turn advance confirmation surface displays the incoming season prominently. The dashboard may show a brief seasonal transition note summarizing expected system effects including festival calendar notes.

### 8.7 Storyline Visual Treatment
Active storyline events should be visually distinct from standard events through a unique border treatment, a storyline icon or badge, and slightly more formal typographic framing. Storyline branch points should feel weightier than standard event choices, conveyed through layout emphasis and the right panel showing narrative arc context.

### 8.8 Intelligence Visual Treatment
Intelligence-related surfaces should use the muted indigo accent to create a subtle tonal distinction. Intelligence reports should feel like sealed dispatches — compact, formal, and slightly separate from the standard information flow. Confidence indicators should use a clear visual scale (filled dots, a small gauge, or a descriptive label).

---

## 9. Responsive Behavior

### 9.1 Desktop
Desktop uses multi-panel structure with simultaneous visibility of global navigation, active content, and supporting intelligence. Minimum supported width should be 1024 pixels.

### 9.2 Tablet
Tablet retains multi-zone structure but may reduce the right panel to a collapsible overlay. Navigation remains visible as a compact rail.

### 9.3 Mobile
Mobile should stack content by priority. The crown bar compresses, navigation moves to a bottom tab bar (five primary items plus a More menu), the main content becomes the dominant reading area, and the right intelligence panel becomes a slide-up sheet triggered by a persistent tab or gesture. The knowledge tree should use a vertically scrollable linear layout on mobile rather than attempting to render the full branching view.

### 9.4 Panel Collapse Rules
Only secondary and contextual content should collapse aggressively on smaller screens. Primary kingdom condition and active decision surfaces must remain easy to reach. The crown bar never fully collapses — it may compress but must always show turn, season, and at least one critical resource.

---

## 10. UI-to-System Mapping

### 10.1 Which Systems Surface Where

| System | Crown Bar | Dashboard | Reports | Decrees | Policies | Society | Regions | Military | Trade | Diplomacy | Intelligence | Knowledge | Events | Archive |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Treasury | Balance + trend | Summary card | Full report | Cost display | Policy effects | — | Regional contribution | Upkeep cost | Trade income | Aid/tribute | Op costs | Research cost | Event costs | Historical |
| Food | Reserves + trend | Summary card | Full report | Cost display | Rationing | — | Regional production | Provisioning | Import/export | — | — | — | Event effects | Historical |
| Pop. Classes | — | Mini-cards | Full report | Class prereqs | Class effects | Full detail | Local distribution | Caste breakdown | Merchant prosperity | — | Intrigue intel | — | Class events | Historical |
| Stability | Rating + trend | Summary card | Full report | Impact preview | Policy effects | Composite view | Regional stability | Garrison effects | — | — | Surveillance | — | Event effects | Historical |
| Faith/Culture | — | Alert if low | Full report | Faith prereqs | Tolerance policy | Full detail | Local faith | Morale boost | — | Alignment indicators | Heresy intel | Cultural branch | Religious events | Historical |
| Military | — | Summary card | Full report | Order cards | Recruitment | Caste card | Garrisons | Full detail | — | Threat context | Recon data | Military branch | Conflict events | Historical |
| Diplomacy | — | Alert if tense | Summary | Diplomatic decrees | Trade openness | — | — | Threat source | Partner state | Full detail | Diplomatic intel | — | Diplomatic events | Historical |
| Espionage | — | — | Full report | Intel operations | Intel funding | — | — | Intel advantage | Econ intel | Exposure level | Full detail | — | Intel events | Historical |
| Knowledge | — | — | Full report | Unlocked decrees | Research focus | — | — | Combat mods | Trade mods | — | — | Full detail | — | Milestones |
| Development | — | Active projects | Full report | Investment decrees | — | — | Regional projects | Defense projects | — | — | — | Prereqs | — | Completed |
| Storylines | — | Status card | — | — | — | — | Regional effects | — | — | — | — | — | Storyline events | Full summaries |
| Seasons | Current season | Forecast | Seasonal notes | — | — | Festival calendar | Regional mods | Campaign effects | Seasonal trade | — | — | — | Seasonal events | — |

### 10.2 Dependencies on Gameplay Data
This file depends on gameplay outputs being available as structured values, change deltas, risk markers, forecast data, state categories, action slot counts, class populations, class satisfactions, faith and culture values, intelligence network data, knowledge progress, storyline states, and severity-tiered alerts.

### 10.3 Dependencies on UX Rules
This file depends on UX rules to determine which information must appear first, how deep drill-downs may go, and how consequence previews should be staged.

**Related:**
- See `gameplay-blueprint.md` → Data Exposure Requirements, Crown Bar Data
- See `ux-blueprint.md` → Information Hierarchy
