// Bridge Layer — Petition Card Generator
// Translates petition-severity ActiveEvents into PetitionCardData[] for the UI.

import type { ActiveEvent, GameState } from '../engine/types';
import { AgentStatus } from '../engine/types';
import type { EffectHint, ContextLine, SignalTag } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { petitionToCard, notificationToCard } from '../engine/cards/adapters';
import { EVENT_TEXT } from '../data/text/events';
import { EVENT_POOL, FOLLOW_UP_POOL } from '../data/events/index';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { NEIGHBOR_LABELS } from '../data/text/labels';
import { extractEventContext } from './contextExtractor';
import { extractChoiceSignals } from './signalExtractor';
import { substituteSmartPlaceholders, SEAT_FALLBACK_LABEL } from './smartText';
import {
  BURN_RISK_EXTRACTION_THRESHOLD,
  MOLE_DETECTION_EXPOSE_THRESHOLD,
} from '../engine/systems/agents';

// ============================================================
// Card data type
// ============================================================

export interface PetitionChoiceData {
  choiceId: string;
  title: string;
  effects: EffectHint[];
  signals: SignalTag[];
}

export interface PetitionCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  grantChoiceId: string;
  denyChoiceId: string;
  grantEffects: EffectHint[];
  denyEffects: EffectHint[];
  grantSignals: SignalTag[];
  denySignals: SignalTag[];
  /** All authored choices, preserving middle options for 3+ choice events. */
  allChoices: PetitionChoiceData[];
  context?: ContextLine[];
}

// ============================================================
// Smart-text substitution
// ============================================================
//
// When a GameState is available, we route card text through the full
// smartText pipeline so that any placeholder (identity, situational,
// or grammar) is resolved consistently across card families.
//
// Callers that have no GameState (a handful of unit tests) still need
// the legacy `{neighbor}` behavior: substitute from NEIGHBOR_LABELS, or
// leave the literal in place when no affected neighbor is set.

function renderEventText(
  text: string,
  event: ActiveEvent,
  gameState: GameState | undefined,
): string {
  if (gameState) {
    return substituteSmartPlaceholders(text, gameState, {
      neighborId: event.affectedNeighborId ?? undefined,
      regionId: event.affectedRegionId ?? undefined,
      classId: event.affectedClassId ?? undefined,
    });
  }
  if (!event.affectedNeighborId) return text;
  const name = NEIGHBOR_LABELS[event.affectedNeighborId] ?? event.affectedNeighborId;
  return text.replace(/\{neighbor\}/g, name);
}

// ============================================================
// Generator
// ============================================================

export function generatePetitionCards(events: ActiveEvent[], gameState?: GameState): PetitionCardData[] {
  // Dev assertion: notification events should use generateNotificationCards(), not this function.
  if (import.meta.env.DEV) {
    for (const event of events) {
      const def = EVENT_POOL.find((e) => e.id === event.definitionId)
        ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);
      if (def?.classification === 'notification') {
        console.warn(
          `[petitionCardGenerator] Notification event "${event.definitionId}" was passed to generatePetitionCards(). ` +
          `Route it through generateNotificationCards() instead.`,
        );
      }
    }
  }

  const cards: PetitionCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    const choiceEffects = EVENT_CHOICE_EFFECTS[event.definitionId] ?? {};
    const context = gameState ? extractEventContext(gameState, event) : undefined;
    const contextLines = context?.length ? context : undefined;

    // Single-choice (notification-style) events: present as acknowledge-only petition.
    if (def.choices.length === 1) {
      const onlyChoice = def.choices[0];
      const onlyEffects = mechDeltaToEffectHints(choiceEffects[onlyChoice.choiceId] ?? {}, gameState);
      const onlySignals = extractChoiceSignals(event.definitionId, onlyChoice.choiceId);
      cards.push({
        eventId: event.id,
        definitionId: event.definitionId,
        title: renderEventText(textEntry.title, event, gameState),
        body: renderEventText(textEntry.body, event, gameState),
        grantChoiceId: onlyChoice.choiceId,
        denyChoiceId: onlyChoice.choiceId,
        grantEffects: onlyEffects,
        denyEffects: onlyEffects,
        grantSignals: onlySignals,
        denySignals: onlySignals,
        allChoices: [{ choiceId: onlyChoice.choiceId, title: textEntry.choices[onlyChoice.choiceId] ?? onlyChoice.choiceId, effects: onlyEffects, signals: onlySignals }],
        context: contextLines,
      });
      continue;
    }
    const grantChoice = def.choices[0];
    const denyChoice = def.choices[def.choices.length - 1];

    const allChoices: PetitionChoiceData[] = def.choices.map((c) => ({
      choiceId: c.choiceId,
      title: textEntry.choices[c.choiceId] ?? c.choiceId,
      effects: mechDeltaToEffectHints(choiceEffects[c.choiceId] ?? {}, gameState),
      signals: extractChoiceSignals(event.definitionId, c.choiceId),
    }));

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: renderEventText(textEntry.title, event, gameState),
      body: renderEventText(textEntry.body, event, gameState),
      grantChoiceId: grantChoice.choiceId,
      denyChoiceId: denyChoice.choiceId,
      grantEffects: mechDeltaToEffectHints(choiceEffects[grantChoice.choiceId] ?? {}, gameState),
      denyEffects: mechDeltaToEffectHints(choiceEffects[denyChoice.choiceId] ?? {}, gameState),
      grantSignals: extractChoiceSignals(event.definitionId, grantChoice.choiceId),
      denySignals: extractChoiceSignals(event.definitionId, denyChoice.choiceId),
      allChoices,
      context: contextLines,
    });
  }

  return cards;
}

/** Phase 4 — lift each petition into a unified `Card<'petition'>`. */
export function generatePetitionCardsAsCards(
  events: ActiveEvent[],
  gameState?: GameState,
): CardOfFamily<'petition'>[] {
  return generatePetitionCards(events, gameState).map((data) => {
    const def = EVENT_POOL.find((e) => e.id === data.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === data.definitionId);
    return petitionToCard(data, def);
  });
}

// ============================================================
// Notification Card Data
// ============================================================

export interface NotificationCardData {
  eventId: string;
  definitionId: string;
  title: string;
  body: string;
  acknowledgeChoiceId: string;
}

export function generateNotificationCards(
  events: ActiveEvent[],
  gameState?: GameState,
): NotificationCardData[] {
  const cards: NotificationCardData[] = [];

  for (const event of events) {
    const textEntry = EVENT_TEXT[event.definitionId];
    const def = EVENT_POOL.find((e) => e.id === event.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === event.definitionId);

    if (!textEntry || !def || def.choices.length < 1) continue;

    cards.push({
      eventId: event.id,
      definitionId: event.definitionId,
      title: renderEventText(textEntry.title, event, gameState),
      body: renderEventText(textEntry.body, event, gameState),
      acknowledgeChoiceId: def.choices[0].choiceId,
    });
  }

  return cards;
}

/** Phase 4 — lift each notification into a unified `Card<'notification'>`. */
export function generateNotificationCardsAsCards(
  events: ActiveEvent[],
  gameState?: GameState,
): CardOfFamily<'notification'>[] {
  return generateNotificationCards(events, gameState).map((data) => {
    const def = EVENT_POOL.find((e) => e.id === data.definitionId)
      ?? FOLLOW_UP_POOL.find((e) => e.id === data.definitionId);
    return notificationToCard(data, def);
  });
}

// ============================================================
// Phase 14 — Synthetic petitions (agent extraction + mole exposure)
// ============================================================

/** Prefix for synthesized agent-extraction petition cardIds. Used by
 *  applyDirectEffects to identify and route these decisions. */
export const PHASE14_EXTRACT_PREFIX = 'phase14_extract:';
/** Prefix for synthesized mole-exposure petition cardIds. */
export const PHASE14_MOLE_PREFIX = 'phase14_mole:';

/**
 * Synthesizes petition cards from the current espionage state:
 *  - One extraction petition per Active agent at or above the burn-risk
 *    extraction threshold.
 *  - One exposure petition per unexposed mole at or above the detection
 *    threshold.
 *
 * These live alongside regular event-backed petitions in the allocation
 * pool and resolve through `applyDirectEffects` (their eventIds carry
 * dedicated prefixes the pipeline recognises).
 */
export function synthesizePhase14Petitions(state: GameState): PetitionCardData[] {
  const out: PetitionCardData[] = [];
  const esp = state.espionage;
  if (!esp) return out;
  const currentTurn = state.turn?.turnNumber ?? 0;

  // Extraction petitions ------------------------------------------------
  // Smart Card Engine Surface — Phase E: body surfaces codename, cover
  // settlement, and turns in cover. Ruler/realm not mentioned; this is a
  // domestic decision about one of our own agents.
  for (const agent of esp.agents ?? []) {
    if (agent.status !== AgentStatus.Active) continue;
    if (agent.burnRisk < BURN_RISK_EXTRACTION_THRESHOLD) continue;
    const eventId = `${PHASE14_EXTRACT_PREFIX}${agent.id}`;
    const turnsInCover = Math.max(0, currentTurn - agent.recruitedTurn);
    const seasonWord = turnsInCover === 1 ? 'season' : 'seasons';
    const coverRegionId = state.geography?.settlements
      ?.find((s) => s.id === agent.coverSettlementId)?.regionId;
    const ctx = {
      agentId: agent.id,
      settlementId: agent.coverSettlementId,
      regionId: coverRegionId,
    };
    const titleTpl = 'Extract {agent} from {settlement}?';
    const bodyTpl =
      "{spymaster_or_fallback} reports that {agent}'s cover in {settlement} is fraying — " +
      `${turnsInCover} ${seasonWord} in place, and the watch has grown curious. ` +
      'Pull them home now, or hold and hope they weather the coming month.';
    out.push({
      eventId,
      definitionId: 'phase14_extract',
      title: substituteSmartPlaceholders(titleTpl, state, ctx),
      body: substituteSmartPlaceholders(bodyTpl, state, ctx),
      grantChoiceId: 'extract',
      denyChoiceId: 'hold',
      grantEffects: [],
      denyEffects: [],
      grantSignals: [],
      denySignals: [],
      allChoices: [
        { choiceId: 'extract', title: 'Extract now', effects: [], signals: [] },
        { choiceId: 'hold', title: 'Hold position', effects: [], signals: [] },
      ],
    });
  }

  // Mole-exposure petitions --------------------------------------------
  // Smart Card Engine Surface — Phase E: body names the affected seat but
  // NEVER names the planter (§9 spec invariant). The player chooses with
  // incomplete information; identifying the planter is a separate beat.
  for (const mole of esp.moles ?? []) {
    if (mole.isExposed) continue;
    if (mole.detectionProgress < MOLE_DETECTION_EXPOSE_THRESHOLD) continue;
    const eventId = `${PHASE14_MOLE_PREFIX}${mole.id}`;
    const seatAdvisor = state.council?.appointments?.[mole.seat];
    const seatLabel = seatAdvisor?.name ?? SEAT_FALLBACK_LABEL[mole.seat];
    const titleTpl = `Shadows at ${seatLabel}'s Desk`;
    const bodyTpl =
      `{spymaster_or_fallback}'s counter-intelligence traces a pattern of leaks ` +
      `converging on ${seatLabel}'s office. The source remains uncertain — ` +
      `expose the mole and take the diplomatic cost, or feed them false ` +
      `intelligence and turn the leak against its source.`;
    out.push({
      eventId,
      definitionId: 'phase14_mole',
      title: substituteSmartPlaceholders(titleTpl, state, {}),
      body: substituteSmartPlaceholders(bodyTpl, state, { seat: mole.seat }),
      grantChoiceId: 'expose',
      denyChoiceId: 'feed_false_intel',
      grantEffects: [],
      denyEffects: [],
      grantSignals: [],
      denySignals: [],
      allChoices: [
        { choiceId: 'expose', title: 'Expose the mole', effects: [], signals: [] },
        {
          choiceId: 'feed_false_intel',
          title: 'Feed false intelligence',
          effects: [],
          signals: [],
        },
      ],
    });
  }

  return out;
}
