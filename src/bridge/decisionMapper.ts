// Bridge Layer — Decision Mapper
// Maps PhaseDecisions to QueuedAction[] for the engine's turn resolution.

import type { QueuedAction } from '../engine/types';
import { ActionType } from '../engine/types';
import type { PhaseDecisions } from '../ui/types';
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
