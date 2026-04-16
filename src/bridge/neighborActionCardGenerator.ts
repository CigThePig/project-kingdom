// Bridge Layer — Neighbor Action Card Generator
// Translates NeighborAction[] from the engine into crisis and petition card data.

import type { NeighborAction, MechanicalEffectDelta } from '../engine/types';
import { EventSeverity, NeighborActionType } from '../engine/types';
import type { EffectHint } from '../ui/types';
import type { CrisisPhaseData, CrisisCardData, ResponseCardData } from './crisisCardGenerator';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import type { PetitionCardData } from './petitionCardGenerator';
import { NEIGHBOR_ACTION_TEMPLATES } from '../data/events/neighbor-actions';
import { NEIGHBOR_ACTION_EFFECTS } from '../data/events/neighbor-action-effects';
import { NEIGHBOR_ACTION_TEXT } from '../data/text/neighbor-actions';
import { NEIGHBOR_LABELS } from '../data/text/labels';

// ============================================================
// Public API
// ============================================================

export function generateNeighborActionCards(
  actions: NeighborAction[],
): { crisisCards: CrisisPhaseData[]; petitionCards: PetitionCardData[] } {
  const crisisCards: CrisisPhaseData[] = [];
  const petitionCards: PetitionCardData[] = [];

  for (const action of actions) {
    const template = NEIGHBOR_ACTION_TEMPLATES[action.actionType];
    if (!template) continue;

    const isCrisis =
      template.severity === EventSeverity.Critical ||
      template.severity === EventSeverity.Serious;

    if (isCrisis) {
      const data = generateCrisisFromAction(action, template);
      if (data) crisisCards.push(data);
    } else {
      const data = generatePetitionFromAction(action, template);
      if (data) petitionCards.push(data);
    }
  }

  return { crisisCards, petitionCards };
}

// ============================================================
// Internal helpers
// ============================================================

function neighborLabel(neighborId: string): string {
  return NEIGHBOR_LABELS[neighborId] ?? neighborId;
}

function fillTemplate(text: string, neighborId: string): string {
  return text.replace(/\{neighbor\}/g, neighborLabel(neighborId));
}

/** Replace the __NEIGHBOR__ placeholder in diplomacyDeltas with the actual neighborId. */
function resolveEffects(
  delta: MechanicalEffectDelta,
  neighborId: string,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;
  const resolved = { ...delta, diplomacyDeltas: { ...delta.diplomacyDeltas } };
  if ('__NEIGHBOR__' in resolved.diplomacyDeltas!) {
    const value = resolved.diplomacyDeltas!['__NEIGHBOR__'];
    delete resolved.diplomacyDeltas!['__NEIGHBOR__'];
    resolved.diplomacyDeltas![neighborId] = value;
  }
  return resolved;
}

function severityLabel(severity: EventSeverity): EffectHint {
  switch (severity) {
    case EventSeverity.Critical:
      return { label: 'CRITICAL', type: 'negative' };
    case EventSeverity.Serious:
      return { label: 'SERIOUS', type: 'warning' };
    default:
      return { label: 'DIPLOMATIC', type: 'neutral' };
  }
}

function generateCrisisFromAction(
  action: NeighborAction,
  template: (typeof NEIGHBOR_ACTION_TEMPLATES)[NeighborActionType],
): CrisisPhaseData | null {
  const textEntry = NEIGHBOR_ACTION_TEXT[action.actionType];
  if (!textEntry) return null;

  const effects = NEIGHBOR_ACTION_EFFECTS[action.actionType] ?? {};
  const eventId = `neighbor:${action.neighborId}:${action.actionType}:${action.turnGenerated}`;

  const crisisCard: CrisisCardData = {
    eventId,
    definitionId: `neighbor_${action.actionType}`,
    title: fillTemplate(textEntry.title, action.neighborId),
    body: fillTemplate(textEntry.body, action.neighborId),
    effects: [severityLabel(template.severity)],
  };

  const responses: ResponseCardData[] = template.choices.map((choice) => {
    const rawDelta = effects[choice.choiceId] ?? {};
    const delta = resolveEffects(rawDelta, action.neighborId);
    return {
      id: `${eventId}:${choice.choiceId}`,
      choiceId: choice.choiceId,
      title: textEntry.choices[choice.choiceId] ?? choice.choiceId,
      effects: mechDeltaToEffectHints(delta),
      signals: [],
      slotCost: choice.slotCost,
      isFree: choice.isFree,
    };
  });

  return { crisisCard, responses };
}

function generatePetitionFromAction(
  action: NeighborAction,
  template: (typeof NEIGHBOR_ACTION_TEMPLATES)[NeighborActionType],
): PetitionCardData | null {
  const textEntry = NEIGHBOR_ACTION_TEXT[action.actionType];
  if (!textEntry || template.choices.length < 2) return null;

  const effects = NEIGHBOR_ACTION_EFFECTS[action.actionType] ?? {};
  const eventId = `neighbor:${action.neighborId}:${action.actionType}:${action.turnGenerated}`;

  const grantChoice = template.choices[0];
  const denyChoice = template.choices[template.choices.length - 1];

  const grantDelta = resolveEffects(effects[grantChoice.choiceId] ?? {}, action.neighborId);
  const denyDelta = resolveEffects(effects[denyChoice.choiceId] ?? {}, action.neighborId);

  return {
    eventId,
    definitionId: `neighbor_${action.actionType}`,
    title: fillTemplate(textEntry.title, action.neighborId),
    body: fillTemplate(textEntry.body, action.neighborId),
    grantChoiceId: grantChoice.choiceId,
    denyChoiceId: denyChoice.choiceId,
    grantEffects: mechDeltaToEffectHints(grantDelta),
    denyEffects: mechDeltaToEffectHints(denyDelta),
    grantSignals: [],
    denySignals: [],
    allChoices: template.choices.map((c) => ({
      choiceId: c.choiceId,
      title: textEntry.choices[c.choiceId] ?? c.choiceId,
      effects: mechDeltaToEffectHints(resolveEffects(effects[c.choiceId] ?? {}, action.neighborId)),
      signals: [],
    })),
  };
}
