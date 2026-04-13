// CourtBusiness — Router component for monthly court interactions.
// Receives the current month's allocated cards and renders the correct
// interaction component based on InteractionType.

import { useCallback, useEffect } from 'react';

import { InteractionType, SeasonMonth } from '../../engine/types';
import { CrisisPhase } from './CrisisPhase';
import { PetitionPhase } from './PetitionPhase';
import { NegotiationPhase } from './NegotiationPhase';
import { AssessmentPhase } from './AssessmentPhase';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';
import type { PetitionCardData } from '../../bridge/petitionCardGenerator';
import type { AssessmentPhaseData } from '../../bridge/assessmentCardGenerator';
import type { NegotiationCard, MonthDecision } from '../types';

/** Fallback for negotiation with no data — defers onComplete to an effect. */
function NegotiationFallback({ onComplete }: { onComplete: (d: MonthDecision[]) => void }) {
  useEffect(() => { onComplete([]); }, [onComplete]);
  return null;
}

/** Fallback for assessment with no data — defers onComplete to an effect. */
function AssessmentFallback({ onComplete }: { onComplete: (d: MonthDecision[]) => void }) {
  useEffect(() => { onComplete([]); }, [onComplete]);
  return null;
}

/** Fallback for decree routed through CourtBusiness — defers onComplete to an effect. */
function DecreeFallback({ onComplete }: { onComplete: (d: MonthDecision[]) => void }) {
  useEffect(() => { onComplete([]); }, [onComplete]);
  return null;
}

interface CourtBusinessProps {
  interactionType: InteractionType | null;
  crisisData: CrisisPhaseData | null;
  petitionCards: PetitionCardData[];
  negotiationCard: NegotiationCard | null;
  assessmentData: AssessmentPhaseData | null;
  currentMonth: SeasonMonth;
  onComplete: (decisions: MonthDecision[]) => void;
}

export function CourtBusiness({
  interactionType,
  crisisData,
  petitionCards,
  negotiationCard,
  assessmentData,
  currentMonth,
  onComplete,
}: CourtBusinessProps) {
  // Quiet month — auto-advance with no decisions
  useEffect(() => {
    if (interactionType === null) {
      onComplete([]);
    }
  }, [interactionType, onComplete]);

  // Wrap CrisisPhase callback → MonthDecision[]
  const handleCrisisComplete = useCallback(
    (crisisResponse: string) => {
      if (crisisResponse === 'no-crisis') {
        onComplete([]);
        return;
      }
      const decisions: MonthDecision[] = [{
        cardId: crisisData?.crisisCard.eventId ?? '',
        choiceId: crisisResponse,
        interactionType: InteractionType.CrisisResponse,
        month: currentMonth,
      }];
      onComplete(decisions);
    },
    [crisisData, currentMonth, onComplete],
  );

  // Wrap PetitionPhase callback → MonthDecision[]
  const handlePetitionComplete = useCallback(
    (petitionDecisions: { cardId: string; choiceId: string }[]) => {
      const decisions: MonthDecision[] = petitionDecisions.map((d) => ({
        cardId: d.cardId,
        choiceId: d.choiceId,
        interactionType: InteractionType.Petition,
        month: currentMonth,
      }));
      onComplete(decisions);
    },
    [currentMonth, onComplete],
  );

  // NegotiationPhase already returns MonthDecision[]
  const handleNegotiationComplete = useCallback(
    (decisions: MonthDecision[]) => {
      onComplete(decisions);
    },
    [onComplete],
  );

  // Wrap AssessmentPhase callback → MonthDecision[]
  const handleAssessmentComplete = useCallback(
    (choiceId: string) => {
      const decisions: MonthDecision[] = [{
        cardId: assessmentData?.crisisData.crisisCard.eventId ?? '',
        choiceId,
        interactionType: InteractionType.Assessment,
        month: currentMonth,
        targetNeighborId: assessmentData?.resolvedNeighborId,
      }];
      onComplete(decisions);
    },
    [assessmentData, currentMonth, onComplete],
  );

  if (interactionType === null) {
    // Quiet month — handled by useEffect above, render nothing
    return null;
  }

  switch (interactionType) {
    case InteractionType.CrisisResponse:
      return (
        <CrisisPhase
          crisisData={crisisData ?? undefined}
          onComplete={handleCrisisComplete}
        />
      );

    case InteractionType.Petition:
      return (
        <PetitionPhase
          petitionCards={petitionCards}
          onComplete={handlePetitionComplete}
        />
      );

    case InteractionType.Negotiation:
      if (!negotiationCard) {
        return <NegotiationFallback onComplete={onComplete} />;
      }
      return (
        <NegotiationPhase
          negotiationCard={negotiationCard}
          currentMonth={currentMonth}
          onComplete={handleNegotiationComplete}
        />
      );

    case InteractionType.Assessment:
      if (!assessmentData) {
        return <AssessmentFallback onComplete={onComplete} />;
      }
      return (
        <AssessmentPhase
          assessmentData={assessmentData.crisisData}
          confidenceLevel={assessmentData.confidenceLevel}
          onComplete={handleAssessmentComplete}
        />
      );

    case InteractionType.Decree:
      // Decrees are handled separately in RoundController, not through CourtBusiness
      return <DecreeFallback onComplete={onComplete} />;
  }
}
