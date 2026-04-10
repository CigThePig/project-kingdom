// Bridge Layer — Decision Mapper
// Maps PhaseDecisions / MonthDecision[] to QueuedAction[] for the engine's turn resolution.

import type { QueuedAction } from '../engine/types';
import { ActionType, InteractionType } from '../engine/types';
import type { PhaseDecisions, MonthDecision } from '../ui/types';
import type { CrisisPhaseData } from './crisisCardGenerator';
import type { PetitionCardData } from './petitionCardGenerator';
import type { DecreeCardData } from './decreeCardGenerator';

export function mapDecisionsToActions(
  decisions: PhaseDecisions,
  crisisData: CrisisPhaseData | null,
  petitionCards: PetitionCardData[],
  decreeCards: DecreeCardData[],
): QueuedAction[] {
  const actions: QueuedAction[] = [];

  // Crisis response
  if (decisions.crisisResponse && crisisData) {
    const response = crisisData.responses.find((r) => r.id === decisions.crisisResponse);
    if (response) {
      actions.push({
        id: crypto.randomUUID(),
        type: ActionType.CrisisResponse,
        actionDefinitionId: crisisData.crisisCard.definitionId,
        slotCost: response.slotCost,
        isFree: response.isFree,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {
          eventId: crisisData.crisisCard.eventId,
          choiceId: response.choiceId,
        },
      });
    }
  }

  // Petition decisions
  for (const d of decisions.petitionDecisions) {
    const card = petitionCards.find((p) => p.eventId === d.cardId);
    if (!card) continue;
    const choiceId = d.granted ? card.grantChoiceId : card.denyChoiceId;
    actions.push({
      id: crypto.randomUUID(),
      type: ActionType.CrisisResponse,
      actionDefinitionId: card.definitionId,
      slotCost: 0,
      isFree: true,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {
        eventId: card.eventId,
        choiceId,
      },
    });
  }

  // Decrees
  for (const decreeId of decisions.selectedDecrees) {
    const card = decreeCards.find((d) => d.decreeId === decreeId);
    if (!card) continue;
    actions.push({
      id: crypto.randomUUID(),
      type: ActionType.Decree,
      actionDefinitionId: decreeId,
      slotCost: card.slotCost,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    });
  }

  return actions;
}

/**
 * Maps MonthDecision[] (accumulated across 3 months) + decree selections
 * into QueuedAction[] for the engine's turn resolution.
 */
export function mapMonthDecisionsToActions(
  monthDecisions: MonthDecision[],
  selectedDecrees: string[],
  crisisData: CrisisPhaseData | null,
  petitionCards: PetitionCardData[],
  _negotiationId: string | null,
  decreeCards: DecreeCardData[],
): QueuedAction[] {
  const actions: QueuedAction[] = [];

  for (const decision of monthDecisions) {
    switch (decision.interactionType) {
      case InteractionType.CrisisResponse: {
        // Find the response in crisis data to get slot cost
        const response = crisisData?.responses.find((r) => r.id === decision.choiceId);
        actions.push({
          id: crypto.randomUUID(),
          type: ActionType.CrisisResponse,
          actionDefinitionId: crisisData?.crisisCard.definitionId ?? decision.cardId,
          slotCost: response?.slotCost ?? 0,
          isFree: response?.isFree ?? true,
          targetRegionId: null,
          targetNeighborId: null,
          parameters: {
            eventId: decision.cardId,
            choiceId: response?.choiceId ?? decision.choiceId,
          },
        });
        break;
      }

      case InteractionType.Petition: {
        const card = petitionCards.find((p) => p.eventId === decision.cardId);
        actions.push({
          id: crypto.randomUUID(),
          type: ActionType.CrisisResponse,
          actionDefinitionId: card?.definitionId ?? decision.cardId,
          slotCost: 0,
          isFree: true,
          targetRegionId: null,
          targetNeighborId: null,
          parameters: {
            eventId: decision.cardId,
            choiceId: decision.choiceId,
          },
        });
        break;
      }

      case InteractionType.Negotiation:
        // Negotiation effects are applied directly via applyDirectEffects()
        // in RoundController, not through the engine's event system.
        break;

      case InteractionType.Assessment:
        // Assessment effects are applied directly via applyDirectEffects()
        // in RoundController, not through the engine's event system.
        break;

      case InteractionType.Decree:
        // Decrees are handled separately below
        break;
    }
  }

  // Decrees
  for (const decreeId of selectedDecrees) {
    const card = decreeCards.find((d) => d.decreeId === decreeId);
    if (!card) continue;
    actions.push({
      id: crypto.randomUUID(),
      type: ActionType.Decree,
      actionDefinitionId: decreeId,
      slotCost: card.slotCost,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    });
  }

  return actions;
}
