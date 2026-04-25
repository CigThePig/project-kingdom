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
import { OVERTURE_TEXT } from '../data/text/overtures';
import { WAVE_2_OVERTURES } from '../data/overtures/wave-2';
import { substituteSmartPlaceholders, type SmartTextContext } from './smartText';
import { generateSpouseName } from '../data/text/name-generation';

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

const INLINE_EFFECTS: Partial<Record<RivalAgenda, Pick<OvertureSpec,
  'grantEffects' | 'grantSignals' | 'denyEffects' | 'denySignals'>>> = {
  [RivalAgenda.DynasticAlliance]: {
    grantEffects: [{ label: 'Relationship ↑↑', type: 'positive' }],
    grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.DominateTrade]: {
    grantEffects: [
      { label: 'Gold income ↑', type: 'positive' },
      { label: 'Relationship ↑', type: 'positive' },
    ],
    grantSignals: [{ label: '+COMMERCIAL', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.RestoreTheOldBorders]: {
    grantEffects: [
      { label: 'Relationship ↑', type: 'positive' },
      { label: 'Stability ↓', type: 'negative' },
    ],
    grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
    denyEffects: [{ label: 'Relationship ↓↓', type: 'negative' }],
    denySignals: [{ label: 'BORDER TENSION ↑', tone: 'consequence' }],
  },
  [RivalAgenda.DefensiveConsolidation]: {
    grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
    grantSignals: [{ label: '+DIPLOMATIC', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
  },
  [RivalAgenda.ReligiousHegemony]: {
    grantEffects: [
      { label: 'Relationship ↑', type: 'positive' },
      { label: 'Heterodoxy ↑', type: 'warning' },
    ],
    grantSignals: [{ label: '+FAITH', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.ConvertThePlayer]: {
    grantEffects: [
      { label: 'Relationship ↑', type: 'positive' },
      { label: 'Heterodoxy ↑', type: 'warning' },
    ],
    grantSignals: [{ label: '+FAITH', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.BleedTheRivals]: {
    grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
    grantSignals: [{ label: 'INTER-RIVAL', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↑', tone: 'consequence' }],
  },
  [RivalAgenda.EconomicRecovery]: {
    grantEffects: [
      { label: 'Relationship ↑', type: 'positive' },
      { label: 'Merchants ↓', type: 'negative' },
    ],
    grantSignals: [{ label: '+COMMERCIAL', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.IsolationistRetreat]: {
    grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
    grantSignals: [{ label: '+ISOLATION', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
  },
  [RivalAgenda.ProveDominance]: {
    grantEffects: [
      { label: 'Relationship ↑', type: 'positive' },
      { label: 'Stability ↓', type: 'negative' },
    ],
    grantSignals: [{ label: 'FOLLOW-UP LIKELY', tone: 'followup' }],
    denyEffects: [{ label: 'Relationship ↓↓', type: 'negative' }],
    denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
  },
  [RivalAgenda.SackASettlement]: {
    grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
    grantSignals: [{ label: 'FOREIGN OPINION ↓', tone: 'consequence' }],
    denyEffects: [{ label: 'Relationship ↓↓', type: 'negative' }],
    denySignals: [{ label: 'AUTHORITY ↑', tone: 'style' }],
  },
  [RivalAgenda.SubjugateAVassal]: {
    grantEffects: [{ label: 'Relationship ↑', type: 'positive' }],
    grantSignals: [{ label: 'INTER-RIVAL', tone: 'style' }],
    denyEffects: [{ label: 'Relationship ↓', type: 'negative' }],
    denySignals: [{ label: 'AUTHORITY ↑', tone: 'consequence' }],
  },
};

export function buildInlineSpec(agenda: RivalAgenda): OvertureSpec | null {
  const text = OVERTURE_TEXT[agenda];
  const effects = INLINE_EFFECTS[agenda];
  if (!text || !effects) return null;
  return {
    title: text.title,
    body: text.body,
    grantTitle: text.grantTitle,
    denyTitle: text.denyTitle,
    grantEffects: effects.grantEffects,
    grantSignals: effects.grantSignals,
    denyEffects: effects.denyEffects,
    denySignals: effects.denySignals,
  };
}

/** Phase 7 — selects an overture spec from the union of inline + wave-2
 *  candidates for the given agenda. Selection is deterministic on
 *  (turnNumber, neighborId) so the same state always produces the same card. */
function buildSpec(
  agenda: RivalAgenda,
  neighborId: string,
  turnNumber: number,
): OvertureSpec | null {
  const inline = buildInlineSpec(agenda);
  const wave2 = WAVE_2_OVERTURES.filter((o) => o.agenda === agenda).map((o) =>
    o.build(),
  );
  const candidates: OvertureSpec[] = inline ? [inline, ...wave2] : wave2;
  if (candidates.length === 0) return null;
  const seed = turnNumber + hashNeighborId(neighborId);
  return candidates[Math.abs(seed) % candidates.length];
}

/** Phase 10 — resolves the contested region for a RestoreTheOldBorders
 *  overture. Prefers the agenda's targetEntityId when it points at a region;
 *  falls back to the rival's most recent territorial_loss memory anchor;
 *  finally falls back to the kingdom's first region so the body still names
 *  somewhere concrete instead of a generic "the disputed territory." */
function pickClaimedRegionId(state: GameState, neighbor: NeighborState): string | undefined {
  const targetId = neighbor.agenda?.targetEntityId;
  if (targetId && targetId.startsWith('region_')) {
    if (state.regions.some((r) => r.id === targetId)) return targetId;
  }
  const memoryRegion = neighbor.memory?.find(
    (m) => m.type === 'territorial_loss' && m.regionId,
  )?.regionId;
  if (memoryRegion && state.regions.some((r) => r.id === memoryRegion)) {
    return memoryRegion;
  }
  return state.regions[0]?.id;
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

    const rawSpec = buildSpec(
      neighbor.agenda.current,
      neighbor.id,
      state.turn.turnNumber,
    );
    if (!rawSpec) continue;

    const ctx: SmartTextContext = { neighborId: neighbor.id };
    // Phase 10 — agenda-keyed context so the body can name what's actually
    // at stake: the contested region for RestoreTheOldBorders, and the
    // generated spouse name for DynasticAlliance (the same name the
    // marriage-bond materializer in directEffectApplier will use on accept).
    if (neighbor.agenda?.current === RivalAgenda.RestoreTheOldBorders) {
      const claimedRegionId = pickClaimedRegionId(state, neighbor);
      if (claimedRegionId) ctx.regionId = claimedRegionId;
    }
    if (neighbor.agenda?.current === RivalAgenda.DynasticAlliance) {
      ctx.spouseName = generateSpouseName(neighbor.id);
    }
    const spec: OvertureSpec = {
      ...rawSpec,
      title: substituteSmartPlaceholders(rawSpec.title, state, ctx),
      body: substituteSmartPlaceholders(rawSpec.body, state, ctx),
      grantTitle: substituteSmartPlaceholders(rawSpec.grantTitle, state, ctx),
      denyTitle: substituteSmartPlaceholders(rawSpec.denyTitle, state, ctx),
    };

    const eventId = `overture_${neighbor.id}_${neighbor.agenda.current}_t${state.turn.turnNumber}`;
    const grantChoiceId = `${eventId}_grant`;
    const denyChoiceId = `${eventId}_deny`;

    cards.push(buildOverturePetition(
      eventId,
      neighbor,
      spec,
      grantChoiceId,
      denyChoiceId,
      state,
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
  state: GameState,
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
        text: `Overture from ${getNeighborDisplayName(neighbor.id, state)}`,
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
