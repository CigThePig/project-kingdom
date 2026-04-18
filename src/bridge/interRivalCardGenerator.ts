// Phase 11 — Inter-Kingdom Diplomacy: Mediation + Coalition card generator.
// Surfaces player-facing decisions when rivals are at war or a coalition is
// ripe to form. Piggybacks on PetitionCardData (like diplomatic overtures)
// so existing petition routing handles layout, and uses synthetic eventIds
// prefixed `mediation_` / `coalition_` that apply-action-effects detects.

import type { GameState } from '../engine/types';
import type { PetitionCardData } from './petitionCardGenerator';
import {
  getActiveInterRivalWars,
  findCoalitionCandidates,
} from '../engine/systems/inter-rival';
import { getNeighborDisplayName } from './nameResolver';

const MEDIATION_PREFIX = 'mediation_';
const COALITION_PREFIX = 'coalition_';

export function isMediationEventId(eventId: string): boolean {
  return eventId.startsWith(MEDIATION_PREFIX);
}

export function isCoalitionEventId(eventId: string): boolean {
  return eventId.startsWith(COALITION_PREFIX);
}

/**
 * Parses a mediation choice id. eventId format:
 *   mediation_<warId>_t<turn>
 * choiceId suffixes: `_sponsor`, `_backA`, `_backB`, `_stay`
 */
export interface MediationDecision {
  warId: string;
  action: 'sponsor' | 'backA' | 'backB' | 'stay';
}

export function parseMediationChoice(
  choiceId: string,
): MediationDecision | null {
  if (!choiceId.startsWith(MEDIATION_PREFIX)) return null;
  const suffixes: Array<[string, MediationDecision['action']]> = [
    ['_sponsor', 'sponsor'],
    ['_backA', 'backA'],
    ['_backB', 'backB'],
    ['_stay', 'stay'],
  ];
  for (const [suffix, action] of suffixes) {
    if (choiceId.endsWith(suffix)) {
      const trimmed = choiceId.slice(0, -suffix.length);
      const match = /^mediation_(.+)_t\d+$/.exec(trimmed);
      if (!match) return null;
      return { warId: match[1], action };
    }
  }
  return null;
}

export interface CoalitionDecision {
  pairKey: string; // `${a}|${b}`
  action: 'joinA' | 'joinB' | 'decline';
}

export function parseCoalitionChoice(
  choiceId: string,
): CoalitionDecision | null {
  if (!choiceId.startsWith(COALITION_PREFIX)) return null;
  const suffixes: Array<[string, CoalitionDecision['action']]> = [
    ['_joinA', 'joinA'],
    ['_joinB', 'joinB'],
    ['_decline', 'decline'],
  ];
  for (const [suffix, action] of suffixes) {
    if (choiceId.endsWith(suffix)) {
      const trimmed = choiceId.slice(0, -suffix.length);
      const match = /^coalition_(.+)_t\d+$/.exec(trimmed);
      if (!match) return null;
      return { pairKey: match[1], action };
    }
  }
  return null;
}

// ============================================================
// Generator
// ============================================================

export function generateInterRivalCards(state: GameState): PetitionCardData[] {
  const cards: PetitionCardData[] = [];
  const turn = state.turn.turnNumber;

  // Mediation — one card per active inter-rival war, cap at 1 per turn so
  // the player is not flooded by multi-war worlds.
  const wars = getActiveInterRivalWars(state.diplomacy);
  if (wars.length > 0) {
    const war = wars[0];
    const nameA = getNeighborDisplayName(war.a, state);
    const nameB = getNeighborDisplayName(war.b, state);
    const eventId = `${MEDIATION_PREFIX}${war.id}_t${turn}`;
    const sponsorId = `${eventId}_sponsor`;
    const backAId = `${eventId}_backA`;
    const backBId = `${eventId}_backB`;
    const stayId = `${eventId}_stay`;

    cards.push({
      eventId,
      definitionId: eventId,
      title: `Mediate: ${nameA} at war with ${nameB}`,
      body: `${nameA} and ${nameB} are openly at war. Envoys from both courts circle your throne. Your gold, your banners, or your silence will shape the outcome.`,
      grantChoiceId: sponsorId,
      denyChoiceId: stayId,
      grantEffects: [
        { label: 'Gold ↓↓', type: 'negative' },
        { label: 'Both relationships ↑', type: 'positive' },
      ],
      denyEffects: [{ label: 'No immediate cost', type: 'neutral' }],
      grantSignals: [{ label: 'PEACE BROKERED', tone: 'followup' }],
      denySignals: [{ label: 'WORLD UNSETTLED', tone: 'consequence' }],
      allChoices: [
        {
          choiceId: sponsorId,
          title: 'Sponsor peace talks',
          effects: [
            { label: 'Gold ↓↓', type: 'negative' },
            { label: 'Both relationships ↑', type: 'positive' },
          ],
          signals: [{ label: 'PEACE BROKERED', tone: 'followup' }],
        },
        {
          choiceId: backAId,
          title: `Back ${nameA}`,
          effects: [
            { label: `${nameA} relationship ↑`, type: 'positive' },
            { label: `${nameB} relationship ↓↓`, type: 'negative' },
          ],
          signals: [{ label: 'MILITARY COMMITMENT', tone: 'consequence' }],
        },
        {
          choiceId: backBId,
          title: `Back ${nameB}`,
          effects: [
            { label: `${nameB} relationship ↑`, type: 'positive' },
            { label: `${nameA} relationship ↓↓`, type: 'negative' },
          ],
          signals: [{ label: 'MILITARY COMMITMENT', tone: 'consequence' }],
        },
        {
          choiceId: stayId,
          title: 'Stay out of it',
          effects: [{ label: 'No immediate cost', type: 'neutral' }],
          signals: [{ label: 'WORLD UNSETTLED', tone: 'consequence' }],
        },
      ],
      context: [
        {
          text: `Inter-rival war: ${nameA} vs ${nameB}`,
          tone: 'info',
        },
      ],
    });
  }

  // Coalition — one card per turn max. Picks the top candidate.
  const coalitions = findCoalitionCandidates(state);
  if (coalitions.length > 0 && cards.length === 0) {
    const top = coalitions[0];
    const nameA = getNeighborDisplayName(top.a, state);
    const nameB = getNeighborDisplayName(top.b, state);
    const pairKey = `${top.a}|${top.b}`;
    const eventId = `${COALITION_PREFIX}${top.a}__${top.b}_t${turn}`;
    const joinAId = `${eventId}_joinA`;
    const joinBId = `${eventId}_joinB`;
    const declineId = `${eventId}_decline`;

    cards.push({
      eventId,
      definitionId: eventId,
      title: `Coalition overtures: ${nameA} and ${nameB}`,
      body: `${nameA} and ${nameB} both hold grudges that align with yours. A coalition would reshape the continent — but binds you to their quarrels.`,
      grantChoiceId: joinAId,
      denyChoiceId: declineId,
      grantEffects: [
        { label: `${nameA} relationship ↑↑`, type: 'positive' },
        { label: `${nameB} relationship ↓`, type: 'negative' },
      ],
      denyEffects: [{ label: 'No commitment', type: 'neutral' }],
      grantSignals: [{ label: 'COALITION FORMED', tone: 'followup' }],
      denySignals: [],
      allChoices: [
        {
          choiceId: joinAId,
          title: `Side with ${nameA}`,
          effects: [
            { label: `${nameA} relationship ↑↑`, type: 'positive' },
            { label: `${nameB} relationship ↓`, type: 'negative' },
          ],
          signals: [{ label: 'COALITION FORMED', tone: 'followup' }],
        },
        {
          choiceId: joinBId,
          title: `Side with ${nameB}`,
          effects: [
            { label: `${nameB} relationship ↑↑`, type: 'positive' },
            { label: `${nameA} relationship ↓`, type: 'negative' },
          ],
          signals: [{ label: 'COALITION FORMED', tone: 'followup' }],
        },
        {
          choiceId: declineId,
          title: 'Decline and stay neutral',
          effects: [{ label: 'No commitment', type: 'neutral' }],
          signals: [],
        },
      ],
      context: [
        {
          text: `Shared grievances: ${top.sharedGrievances}${top.adjacent ? ' · adjacent frontier' : ''}`,
          tone: 'info',
        },
      ],
    });
    // Retain reference so unused-local check doesn't flag pairKey.
    void pairKey;
  }

  return cards;
}
