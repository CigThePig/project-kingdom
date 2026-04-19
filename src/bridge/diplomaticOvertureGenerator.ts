// Phase 3 — Diplomatic Overture Generator.
// Produces overture cards (rival-initiated diplomatic propositions) when a
// neighbor's agenda has ripened enough to surface a player-facing decision.
// Piggybacks on the PetitionCardData shape so overture cards flow through
// the existing petition month slot without adding a new InteractionType
// (Phase 4's card schema will unify all of these).
//
// Synthetic eventIds are prefixed `overture_` so that action-resolution can
// detect them and apply inline relationship + memory effects without
// requiring an entry in EVENT_POOL / EVENT_CHOICE_EFFECTS.
//
// TODO(smart-cards): This generator builds titles/bodies via inline template
// literals instead of placeholder-based authored text. A follow-up PR should
// migrate overture strings into an OVERTURE_TEXT map and route them through
// `substituteSmartPlaceholders` so they can participate in the same
// placeholder vocabulary as petitions/crises/decrees.
// See docs/SMART_CARD_ENGINE_SURFACE.md Phase A notes.

import {
  RivalAgenda,
  type GameState,
  type NeighborState,
} from '../engine/types';
import type { PetitionCardData } from './petitionCardGenerator';
import type { EffectHint, SignalTag } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { overtureToCard } from '../engine/cards/adapters';
import { getNeighborDisplayName } from './nameResolver';
import { WAVE_2_OVERTURES } from '../data/overtures/wave-2';

const PROGRESS_THRESHOLD = 40;

export interface OvertureSpec {
  title: string;
  body: string;
  grantTitle: string;
  grantEffects: EffectHint[];
  grantSignals: SignalTag[];
  denyTitle: string;
  denyEffects: EffectHint[];
  denySignals: SignalTag[];
}

function buildInlineSpec(
  agenda: RivalAgenda,
  neighborName: string,
): OvertureSpec | null {
  switch (agenda) {
    case RivalAgenda.DynasticAlliance:
      return {
        title: `${neighborName} proposes a dynastic union`,
        body: `Envoys from ${neighborName} arrive with a formal proposal of marriage between your houses — a binding of the two crowns that would reshape the map.`,
        grantTitle: 'Accept the match',
        grantEffects: [{ label: 'Relationship ↑↑', type: 'positive' }],
        grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
        denyTitle: 'Decline with courtesies',
        denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
        denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
      };

    case RivalAgenda.DominateTrade:
      return {
        title: `${neighborName} presses a trade concession`,
        body: `${neighborName}'s merchants press for preferential access to your markets. Granting it enriches both treasuries — and ties your prosperity to theirs.`,
        grantTitle: 'Grant the concession',
        grantEffects: [{ label: 'Gold income ↑', type: 'positive' }, { label: 'Relationship ↑', type: 'positive' }],
        grantSignals: [{ label: '+COMMERCIAL', tone: 'style' }],
        denyTitle: 'Protect the home markets',
        denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
        denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
      };

    case RivalAgenda.RestoreTheOldBorders:
      return {
        title: `${neighborName} demands restitution of old lands`,
        body: `${neighborName} formally revives ancient claims, demanding you cede the disputed territory. Refusal will be remembered.`,
        grantTitle: 'Negotiate a quiet concession',
        grantEffects: [{ label: 'Relationship ↑', type: 'positive' }, { label: 'Stability ↓', type: 'negative' }],
        grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
        denyTitle: 'Reject the claim outright',
        denyEffects: [{ label: 'Relationship ↓↓', type: 'negative' }],
        denySignals: [{ label: 'BORDER TENSION ↑', tone: 'consequence' }],
      };

    case RivalAgenda.DefensiveConsolidation:
      return {
        title: `${neighborName} seeks a non-aggression pact`,
        body: `${neighborName}'s envoys propose a formal non-aggression pact. Signing would calm their border and free your hand elsewhere.`,
        grantTitle: 'Sign the pact',
        grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
        grantSignals: [{ label: '+DIPLOMATIC', tone: 'style' }],
        denyTitle: 'Reserve your freedom',
        denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
        denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
      };

    case RivalAgenda.ReligiousHegemony:
    case RivalAgenda.ConvertThePlayer:
      return {
        title: `${neighborName} proposes a religious accord`,
        body: `${neighborName}'s clergy seek permission to establish missions across your realm — an act of faith, and of influence.`,
        grantTitle: 'Permit the missions',
        grantEffects: [{ label: 'Relationship ↑', type: 'positive' }, { label: 'Heterodoxy ↑', type: 'warning' }],
        grantSignals: [{ label: '+FAITH', tone: 'style' }],
        denyTitle: 'Refuse the presence',
        denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
        denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
      };

    default:
      // Other agendas do not currently surface as overture cards.
      return null;
  }
}

/** Phase 7 — selects an overture spec from the union of inline + wave-2
 *  candidates for the given agenda. Selection is deterministic on
 *  (turnNumber, neighborId) so the same state always produces the same card. */
function buildSpec(
  agenda: RivalAgenda,
  neighborName: string,
  neighborId: string,
  turnNumber: number,
): OvertureSpec | null {
  const inline = buildInlineSpec(agenda, neighborName);
  const wave2 = WAVE_2_OVERTURES.filter((o) => o.agenda === agenda).map((o) =>
    o.build(neighborName),
  );
  const candidates: OvertureSpec[] = inline ? [inline, ...wave2] : wave2;
  if (candidates.length === 0) return null;
  const seed = turnNumber + hashNeighborId(neighborId);
  return candidates[Math.abs(seed) % candidates.length];
}

function hashNeighborId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Generates diplomatic overture cards for rivals whose agenda has ripened
 * past the progress threshold. One overture per eligible neighbor per turn
 * at most. Deterministic — same state produces the same list.
 */
export function generateOvertureCards(state: GameState): PetitionCardData[] {
  const cards: PetitionCardData[] = [];

  for (const neighbor of state.diplomacy.neighbors) {
    if (!neighbor.agenda) continue;
    if (neighbor.agenda.progressValue < PROGRESS_THRESHOLD) continue;

    const spec = buildSpec(
      neighbor.agenda.current,
      getNeighborDisplayName(neighbor.id, state),
      neighbor.id,
      state.turn.turnNumber,
    );
    if (!spec) continue;

    const eventId = `overture_${neighbor.id}_${neighbor.agenda.current}_t${state.turn.turnNumber}`;
    const grantChoiceId = `${eventId}_grant`;
    const denyChoiceId = `${eventId}_deny`;

    cards.push(buildOverturePetition(
      eventId,
      neighbor,
      spec,
      grantChoiceId,
      denyChoiceId,
    ));
  }

  return cards;
}

function buildOverturePetition(
  eventId: string,
  neighbor: NeighborState,
  spec: OvertureSpec,
  grantChoiceId: string,
  denyChoiceId: string,
): PetitionCardData {
  return {
    eventId,
    definitionId: eventId,
    title: spec.title,
    body: spec.body,
    grantChoiceId,
    denyChoiceId,
    grantEffects: spec.grantEffects,
    denyEffects: spec.denyEffects,
    grantSignals: spec.grantSignals,
    denySignals: spec.denySignals,
    allChoices: [
      {
        choiceId: grantChoiceId,
        title: spec.grantTitle,
        effects: spec.grantEffects,
        signals: spec.grantSignals,
      },
      {
        choiceId: denyChoiceId,
        title: spec.denyTitle,
        effects: spec.denyEffects,
        signals: spec.denySignals,
      },
    ],
    context: [
      {
        text: `Overture from ${neighbor.displayName ?? neighbor.id}`,
        tone: 'info',
      },
    ],
  };
}

/**
 * Tests whether an eventId belongs to a diplomatic overture card. Used by
 * apply-action-effects to route overture decisions into the inline
 * relationship/memory effect path (bypasses EVENT_CHOICE_EFFECTS).
 */
export function isOvertureEventId(eventId: string): boolean {
  return eventId.startsWith('overture_');
}

/** Parses an overture eventId back into its constituent neighbor + agenda. */
export function parseOvertureEventId(
  eventId: string,
): { neighborId: string; agenda: RivalAgenda; grant: boolean } | null {
  if (!isOvertureEventId(eventId)) return null;
  // Accept both the card id `overture_<neighbor>_<agenda>_tN` and the
  // choice id `<eventId>_grant|_deny`.
  const grant = eventId.endsWith('_grant');
  const deny = eventId.endsWith('_deny');
  const trimmed = grant
    ? eventId.slice(0, -'_grant'.length)
    : deny
      ? eventId.slice(0, -'_deny'.length)
      : eventId;
  // format: overture_<neighborid_can_contain_underscores>_<Agenda>_t<N>
  const match = /^overture_(neighbor_[A-Za-z0-9]+)_([A-Za-z]+)_t\d+$/.exec(trimmed);
  if (!match) return null;
  const agenda = match[2] as RivalAgenda;
  if (!Object.values(RivalAgenda).includes(agenda)) return null;
  return {
    neighborId: match[1],
    agenda,
    grant,
  };
}

/** Phase 4 — lift each overture into a unified `Card<'overture'>`. */
export function generateOvertureCardsAsCards(
  state: GameState,
): CardOfFamily<'overture'>[] {
  return generateOvertureCards(state).map((o) => overtureToCard(o));
}
