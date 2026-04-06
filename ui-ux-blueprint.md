# UI/UX Blueprint — Crown & Council

## Purpose
This document defines the visual design, component architecture, interaction patterns, animation specifications, and screen flow for Crown & Council. It is the implementation contract for the card-based interface.

## Scope
This file owns everything the player sees and touches: card components, gesture behavior, layout, typography, color, animation timing, and mobile-specific concerns. It does not own game mechanics or simulation logic — those belong to `gameplay-blueprint.md`.

## Related Files
- `gameplay-blueprint.md` — Game systems, round structure, card schema
- `PHASES.md` — Build conversion plan
- `CLAUDE.md` — Agent working instructions

---

## §1. Design Philosophy

### §1.1 Core Aesthetic
Dark parchment. Gold accents. Quiet authority. The game should feel like handling royal documents in a candlelit chamber — not a fantasy video game UI. Cards are the stars; the background is minimal and atmospheric.

### §1.2 Anti-Patterns
- No traditional game HUD (health bars, mini-maps, ability cooldowns)
- No hamburger menus, tab bars, or sidebar navigation
- No modals or pop-up dialogs (everything is a card)
- No floating action buttons
- No loading spinners (use card flip/deal animations as transitions)
- No tooltip hovers (mobile-first; information lives on the card face)

### §1.3 One Card at a Time
At any moment, one card (or one small spread) dominates the viewport. The player's attention is never split between competing interface elements. Chrome is minimal: a stats peek bar at the top, a phase indicator at the bottom, and the card(s) in between.

---

## §2. Design Tokens

### §2.1 Colors

```
Background:
  bg-primary:       #1a1714    (near-black warm brown)
  bg-card:           #2a2520    (dark parchment)
  bg-card-elevated:  #322c26    (lifted card state)
  bg-parchment:      #342e28    (inset/recessed areas)

Borders:
  border-default:    #3d3630    (card edges, dividers)
  border-active:     #5a5048    (focused/interactive edges)

Text:
  text-primary:      #e8dcc8    (cream — headings, important text)
  text-secondary:    #9e9484    (muted — body, labels)
  text-disabled:     #5a5248    (inactive states)

Accents (Card Families):
  accent-crisis:     #a83232    (red)
  accent-response:   #c9a84c    (gold)
  accent-petition:   #3a6b8a    (blue)
  accent-decree:     #4a7a3a    (green)
  accent-advisor:    #7a4a8a    (purple)
  accent-legacy:     #c0b8a8    (silver/white)
  accent-status:     #8a7434    (amber)

Feedback:
  positive:          #6aaa5a    (stat gain, grant swipe)
  negative:          #aa5a5a    (stat loss, deny swipe)
  warning:           #c9a84c    (approaching danger)
  neutral:           #9e9484    (uncertain/hinted)
```

### §2.2 Typography

```
Heading Font:    Georgia, 'Times New Roman', serif
Body Font:       Georgia, 'Times New Roman', serif
Mono Font:       'Courier New', monospace

Scale:
  card-title:    17px / 700 weight / 1.3 line-height
  card-body:     13.5px / 400 weight / 1.55 line-height
  card-label:    10px / 700 weight / 1.2 line-height / 2px letter-spacing / uppercase
  effect-token:  11px / 600 weight / mono font
  stat-value:    12px / 600 weight / mono font
  stat-label:    12px / 400 weight / serif
  phase-label:   10px / 600 weight / 1px letter-spacing / uppercase / mono font
  button-text:   13px / 800 weight / 2px letter-spacing / uppercase / mono font
```

### §2.3 Spacing and Sizing

```
Card:
  border-radius:     16px
  padding:           20px 18px
  gap (between):     12px
  accent-line:       2px height (top gradient)
  bottom-line:       1px height (bottom gradient)

Decree card (in spread):
  width:             220px
  min-height:        190px
  gap:               12px
  scroll-snap:       center

Screen:
  max-width:         430px (centered)
  side-padding:      16px
  bottom-padding:    30px

Stats bar:
  collapsed-height:  44px
  margin-x:          8px
  border-radius:     0 0 12px 12px

Buttons:
  border-radius:     12px
  padding:           14px 24px
```

### §2.4 Shadows

```
card-default:     0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)
card-elevated:    0 12px 36px rgba(0,0,0,0.7), 0 0 12px [accent]22
card-lifted:      0 16px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)
```

---

## §3. Component Architecture

### §3.1 Component Tree

```
<App>
  <StatsBar />                    — collapsible top stats
  <PhaseIndicator />              — phase progress strip
  <PhaseContainer>                — main content area, scrollable
    <SeasonDawnPhase />           — Phase 0
    <CrisisPhase />               — Phase 1
      <CrisisCard />
      <ResponseCard /> (×2–4)
    <PetitionPhase />             — Phase 2
      <PetitionCard /> (one at a time)
    <DecreePhase />               — Phase 3
      <DecreeCard /> (horizontal spread)
    <SummaryPhase />              — Phase 4
      <SummaryCard />
      <StatDeltaDisplay />
      <LegacyCard />  (conditional)
  </PhaseContainer>
</App>
```

### §3.2 Base Card Component
All card types render through a single `<Card>` component that provides:
- Background, border, border-radius, shadow
- Top accent gradient line (color from family)
- Family badge (icon + label, top-left)
- Bottom border gradient line
- Press/active state (scale 0.97 on touch)
- CSS transition on transform, border-color, box-shadow

Props: `family`, `children`, `style`, `onClick`, `className`, `innerRef`

The base card has NO knowledge of game logic. It is purely presentational.

### §3.3 Card Content Components
Reusable inner components placed inside `<Card>`:
- `<CardTitle>` — heading text
- `<CardBody>` — description text
- `<EffectStrip>` — row of effect tokens with color coding
- `<SelectionBadge>` — "✓ SELECTED" overlay for chosen response/decree cards
- `<ConfidenceIndicator>` — for advisor cards: Low / Moderate / High confidence display

### §3.4 Phase Components
Each phase is a self-contained component that:
- Receives game state as props
- Manages its own internal selection state
- Calls `onComplete(decisions)` when the player finishes the phase
- Handles its own animations and transitions

The phase components do NOT talk to each other directly. The parent `<App>` (or a `<RoundController>`) manages phase sequencing and passes results forward.

---

## §4. Interaction Specifications

### §4.1 Phase 0 — Season Dawn
**Cards:** 1 season card + 0–1 advisor briefing cards.
**Interaction:** Tap anywhere on the card (or a "Continue" region) to advance. If an advisor card is present, it appears after the season card with a slide-up animation.
**Transition out:** Cards fade up and away. Phase 1 cards slide up from below.

### §4.2 Phase 1 — Crisis (Morning Court)
**Layout:** Crisis event card at top. Response cards stacked vertically below with "Choose your response" label between them.

**Selection flow:**
1. Player scrolls to read all response cards
2. Taps a response card → it gets gold border + "✓ SELECTED" badge, others dim slightly
3. Tapping the same card deselects it. Tapping another card switches selection.
4. "Confirm Decision" button appears at bottom when a card is selected
5. On confirm: selected card stays at full opacity, others fade to 30%. Button text changes to "Confirmed ✓" briefly. After 500ms, phase transitions.

**Animation timing:**
- Crisis card: slide-up, 400ms ease
- Response cards: slide-in from right, 350ms ease, staggered 80ms each
- Confirm button: pop-in (scale 0.9→1), 300ms ease
- Exit: all cards fade-slide-left, 350ms

### §4.3 Phase 2 — Petitions (Audience Chamber)
**Layout:** One petition card centered in the viewport. Deny (✗) and Grant (✓) ghost indicators on left/right edges. Decision pip dots below.

**Swipe behavior:**
- Touch start: record initial X position. Disable vertical scroll on the card.
- Touch move: card translates with finger. Rotation = dx × 0.04 degrees. Opacity = max(0.4, 1 - |dx|/400).
- Touch end:
  - If |dx| > 35% of screen width OR |velocity| > 500px/s: commit
  - Card animates to exit (translateX ±screenWidth, rotate ±20°, opacity 0), 350ms ease
  - Below threshold: spring back to center (transform: none, opacity: 1), 350ms ease

**Between cards:** 350ms delay after exit animation. New card enters with pop animation (scale 0.9→1, opacity 0→1), 300ms.

**Decision pips:** Row of dots below the card area. Undecided = border-color dot. Current = gold, scaled 1.4×. Decided = green (granted) or red (denied) fill.

**Completion:** After last petition decided, 200ms pause, then auto-advance to Phase 3.

### §4.4 Phase 3 — Decrees (Royal Council)
**Layout:** Horizontal scrollable row of decree cards. Scroll-snap to center alignment. Counter text above ("Select up to 3 decrees · X/3 chosen"). Confirm button below.

**Selection behavior:**
- Tap a card: if not selected and count < 3, select it. Card lifts (translateY -6px, scale 1.03), border turns green, checkmark badge appears.
- Tap a selected card: deselect. Card returns to rest position.
- If count is 3 and player taps an unselected card: nothing happens (card does not respond). The counter text could briefly pulse to draw attention to the limit.

**Scroll behavior:**
- Horizontal scroll with momentum and snap
- Hide scrollbar (webkit and Firefox)
- Touch action: pan-x (allow horizontal drag, prevent vertical scroll while scrolling deck)

**Cards enter:** Staggered slide-in from right (350ms, 70ms stagger per card).

**Slot cost display:** If a decree costs 2 slots, its effect strip includes a token: "⚡ 2 Slots". The counter reflects this (e.g., selecting a 2-slot decree when 1 is already selected shows "3/3").

**Confirm button:** Only visible when ≥1 decree selected. Text: "Issue X Decree(s)". Gradient green background. On tap: animates out, phase transitions.

### §4.5 Phase 4 — Summary
**Layout:** Narrative summary card at top. Stat delta block below. Legacy card (if applicable) below that. "Begin Next Season →" button at bottom.

**Stat delta animation:** Each stat row slides in from left with stagger (80ms per row). Delta values are colored: green for positive, red for negative.

**Legacy card (conditional):** Only appears when a milestone, storyline resolution, or ruling style threshold was crossed this round. Enters with a distinct animation — slow fade-in with slight scale-up, white/silver accent. Should feel momentous and rare.

**Transition to next round:** Button tap fades everything out, then Phase 0 of the next round fades in.

---

## §5. Stats Bar

### §5.1 Collapsed State (Default)
A 44px-high bar at the top of the viewport showing 4 key stats in compact form:
`👑 72  🌾 340  💰 1250  ⚔ 58`
Plus a ▼ chevron indicating expandability.

Tapping anywhere on the bar toggles expansion.

### §5.2 Expanded State
The bar grows to show all tracked stats with:
- Icon + Label + Progress bar + Numeric value per stat
- Progress bar color: red < 30%, gold < 60%, green ≥ 60%
- Current season/year/turn at the bottom
- Active conditions listed (if any)
- Failure warnings (if any) highlighted in red

### §5.3 Stats Tracked
| Icon | Stat | Source |
|------|------|--------|
| 👑 | Authority/Stability | stability.value |
| 🌾 | Grain | food.reserves |
| 💰 | Treasury | treasury.balance |
| ⚔ | Military | military.readiness |
| ✝ | Faith | faithCulture.faithLevel |
| ❤ | Loyalty | average of class satisfactions |

### §5.4 Interaction
The stats bar is accessible during any phase. It overlays the current content when expanded. Tapping again collapses it. It does NOT pause or interrupt gameplay — the player can peek at stats and go back to their current decision.

The stats bar animates with max-height transition (350ms ease). Chevron rotates 180° when expanded.

---

## §6. Phase Indicator

### §6.1 Layout
A row of small labeled pills centered below the stats bar. One pill per phase: Court, Audience, Council, Summary.

### §6.2 States
- **Active phase:** Filled background (accent color at 13% opacity), accent-colored border, cream text
- **Inactive phase:** Transparent background, default border, muted text

### §6.3 Behavior
The phase indicator is read-only. The player cannot tap it to navigate between phases (phases are strictly sequential). It exists solely to orient the player in the round structure.

---

## §7. Animation System

### §7.1 Implementation
All animations use CSS keyframes and transitions. No animation library dependency. Keyframes are injected into the document head on mount.

### §7.2 Core Animations

| Name | Keyframes | Duration | Use |
|------|-----------|----------|-----|
| slideUp | translateY(40px) → 0, opacity 0→1 | 400ms ease | Crisis card entrance, summary cards |
| slideIn | translateX(30px) → 0, opacity 0→1 | 350ms ease | Response cards, stat delta rows, decree cards |
| pop | scale(0.9) → 1, opacity 0→1 | 300ms ease | Petition card entrance, buttons appearing |
| barFill | width 0 → target | 600ms ease | Stat bar progress fills |

### §7.3 Stagger Pattern
Sequential card entrances use `animation-delay` calculated as `index × staggerMs`:
- Response cards: 80ms stagger
- Decree cards: 70ms stagger
- Stat delta rows: 80ms stagger

### §7.4 Interactive Transitions
Elements that change state (selected, deselected, expanded, collapsed) use CSS transitions:
```
transition: transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
```

Button press states: `transform: scale(0.95); opacity: 0.85;` on `:active`.

Card press states: `transform: scale(0.97);` on `:active`.

### §7.5 Swipe Physics (Petition Cards)
Handled via JavaScript touch events, not CSS:
- During drag: `style.transition = 'none'` for immediate response
- On release (spring back): `style.transition = 'transform 0.35s ease, opacity 0.35s ease'`
- On commit (exit): same transition, target is off-screen with rotation

---

## §8. Mobile Considerations

### §8.1 Viewport
- Max-width: 430px, centered horizontally
- Min-height: 100vh
- No horizontal scroll on the page (only on decree card spread)
- Content scrolls vertically within the phase container

### §8.2 Touch Targets
- All tappable cards: minimum 44px height (usually much larger)
- Buttons: 48px minimum height with 14px vertical padding
- Stats bar tap zone: full width, 44px height
- Phase pills: non-interactive, no touch target needed

### §8.3 Safe Areas
- Bottom padding accounts for home indicator on notched phones (30px minimum)
- Stats bar does not overlap device status bar (positioned below it)

### §8.4 Scroll Behavior
- Phase container: `overflow-y: auto` for vertical scrolling
- Decree spread: `overflow-x: auto`, `scroll-snap-type: x mandatory`, `-webkit-overflow-scrolling: touch`
- Petition cards: `touch-action: none` on the draggable surface to prevent scroll interference

### §8.5 Performance
- No animation library (CSS-only with JS for swipe physics)
- No layout thrashing during animations (use transform/opacity only, never width/height/top/left)
- Cards use `will-change: transform` during active drag only
- Stagger delays capped at 6 items to prevent long animation queues

---

## §9. Accessibility

### §9.1 Color
- All text meets WCAG AA contrast ratio against card background
- Effect tokens use color AND symbol (+ / - / ? / !) for colorblind support
- Decision pips use color AND size change for current state

### §9.2 Motion
- Respect `prefers-reduced-motion`: disable keyframe animations, keep instant state changes
- Swipe physics: provide tap-based fallback buttons ("Grant" / "Deny") when reduced motion is active

### §9.3 Screen Readers
- Cards use semantic HTML (headings, paragraphs)
- Family labels are aria-labels on the badge
- Phase indicator announces current phase
- Swipe instructions announced: "Swipe right to grant, left to deny"

---

## §10. State Management

### §10.1 Architecture
React Context + `useReducer` for game state. No external state management library.

### §10.2 State Shape (UI Layer)

```typescript
interface UIState {
  currentPhase: RoundPhase;
  statsExpanded: boolean;
  
  // Phase 1 state
  crisisCardId: string | null;
  responseCards: CardDefinition[];
  selectedResponseId: string | null;
  crisisConfirmed: boolean;
  
  // Phase 2 state
  petitionCards: CardDefinition[];
  currentPetitionIndex: number;
  petitionDecisions: PetitionDecision[];
  
  // Phase 3 state
  availableDecrees: CardDefinition[];
  selectedDecreeIds: Set<string>;
  totalSlotCost: number;
  
  // Phase 4 state
  summaryNarrative: string;
  statDeltas: StatDelta[];
  legacyCard: CardDefinition | null;
}
```

### §10.3 Game State
The full `GameState` from `engine/types.ts` is the source of truth. The UI state above is derived from it each round. The UI never mutates GameState directly — it dispatches decisions, and the round controller feeds them to the engine's resolution pipeline.

---

## §11. Screen Flow

```
[Title Screen]
     │
     ▼
[Scenario Select] ──→ [New Game Init]
     │                       │
     ▼                       ▼
[Load Game] ──────→ [Round Loop]
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         [Phase 0]  [Phase 1]  [Phase 2]
         Season     Crisis     Petitions
         Dawn       Court      Chamber
              │          │          │
              └──────────┼──────────┘
                         ▼
                    [Phase 3]
                    Royal
                    Council
                         │
                         ▼
                    [Phase 4]
                    Court
                    Summary
                         │
                    ┌────┴────┐
                    ▼         ▼
              [Next Round] [Game Over]
                    │         │
                    ▼         ▼
              [Phase 0]  [Reign Score]
                              │
                              ▼
                         [Title Screen]
```

All transitions between screens use card-based animations (deal in, slide out, flip). No page navigations, no route changes. The entire game runs in a single viewport with content swapping via React state.
