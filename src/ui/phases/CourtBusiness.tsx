// CourtBusiness — Router component for monthly court interactions.
// Supports stacked interactions: primary → additional crises → petitions → notifications.
// Each sub-phase collects decisions; the month is complete when all stages are done.

import { useState, useCallback, useEffect, useRef } from 'react';

import { InteractionType, SeasonMonth } from '../../engine/types';
import { CrisisPhase } from './CrisisPhase';
import { PetitionPhase } from './PetitionPhase';
import { NegotiationPhase } from './NegotiationPhase';
import { AssessmentPhase } from './AssessmentPhase';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../../bridge/petitionCardGenerator';
import type { AssessmentPhaseData } from '../../bridge/assessmentCardGenerator';
import type { NegotiationCard, MonthDecision } from '../types';
import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';

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

// Render stage for the stacked interaction state machine
type RenderStage = 'primary' | 'additionalCrisis' | 'petitions' | 'notifications';

interface CourtBusinessProps {
  interactionType: InteractionType | null;
  crisisData: CrisisPhaseData | null;
  additionalCrises: CrisisPhaseData[];
  petitionCards: PetitionCardData[];
  notificationCards: NotificationCardData[];
  negotiationCard: NegotiationCard | null;
  assessmentData: AssessmentPhaseData | null;
  currentMonth: SeasonMonth;
  onComplete: (decisions: MonthDecision[]) => void;
}

/**
 * Determines the first stage to render based on what content is available.
 * If the primary interaction is null (quiet month) but stacked content exists,
 * skips to the appropriate secondary stage.
 */
function getInitialStage(
  interactionType: InteractionType | null,
  additionalCrises: CrisisPhaseData[],
  petitionCards: PetitionCardData[],
  notificationCards: NotificationCardData[],
): RenderStage | null {
  if (interactionType !== null) return 'primary';
  if (additionalCrises.length > 0) return 'additionalCrisis';
  if (petitionCards.length > 0) return 'petitions';
  if (notificationCards.length > 0) return 'notifications';
  return null; // truly quiet month
}

/**
 * Determines the next stage after the current one finishes.
 * Returns null when all stages are complete.
 */
function getNextStage(
  currentStage: RenderStage,
  interactionType: InteractionType | null,
  additionalCrises: CrisisPhaseData[],
  additionalCrisisIndex: number,
  petitionCards: PetitionCardData[],
  notificationCards: NotificationCardData[],
): RenderStage | null {
  switch (currentStage) {
    case 'primary':
      if (additionalCrises.length > 0) return 'additionalCrisis';
      // Don't show petitions as secondary if primary was already petitions
      if (petitionCards.length > 0 && interactionType !== InteractionType.Petition) return 'petitions';
      if (notificationCards.length > 0) return 'notifications';
      return null;
    case 'additionalCrisis':
      if (additionalCrisisIndex + 1 < additionalCrises.length) return 'additionalCrisis';
      if (petitionCards.length > 0 && interactionType !== InteractionType.Petition) return 'petitions';
      if (notificationCards.length > 0) return 'notifications';
      return null;
    case 'petitions':
      if (notificationCards.length > 0) return 'notifications';
      return null;
    case 'notifications':
      return null;
  }
}

export function CourtBusiness({
  interactionType,
  crisisData,
  additionalCrises,
  petitionCards,
  notificationCards,
  negotiationCard,
  assessmentData,
  currentMonth,
  onComplete,
}: CourtBusinessProps) {
  const initialStage = getInitialStage(interactionType, additionalCrises, petitionCards, notificationCards);

  const [renderStage, setRenderStage] = useState<RenderStage | null>(initialStage);
  const [additionalCrisisIndex, setAdditionalCrisisIndex] = useState(0);
  const [accumulatedDecisions, setAccumulatedDecisions] = useState<MonthDecision[]>([]);

  // Notification sub-phase state
  const [notifIndex, setNotifIndex] = useState(0);
  const [notifConfirming, setNotifConfirming] = useState(false);

  // Track whether we've completed to prevent double-calling onComplete
  const completedRef = useRef(false);

  // Quiet month with no stacked content — auto-advance
  useEffect(() => {
    if (initialStage === null && !completedRef.current) {
      completedRef.current = true;
      onComplete([]);
    }
  }, [initialStage, onComplete]);

  /**
   * Advance to the next stage, or complete the month if all stages are done.
   */
  const advanceStage = useCallback(
    (newDecisions: MonthDecision[]) => {
      const allDecisions = [...accumulatedDecisions, ...newDecisions];
      setAccumulatedDecisions(allDecisions);

      const currentStage = renderStage;
      if (!currentStage) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete(allDecisions);
        }
        return;
      }

      const nextIdx = currentStage === 'additionalCrisis' ? additionalCrisisIndex + 1 : additionalCrisisIndex;
      const next = getNextStage(currentStage, interactionType, additionalCrises, additionalCrisisIndex, petitionCards, notificationCards);

      if (next === null) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete(allDecisions);
        }
      } else {
        if (next === 'additionalCrisis' && currentStage === 'additionalCrisis') {
          setAdditionalCrisisIndex(nextIdx);
        }
        setRenderStage(next);
      }
    },
    [accumulatedDecisions, renderStage, additionalCrisisIndex, interactionType, additionalCrises, petitionCards, notificationCards, onComplete],
  );

  // ---- Primary stage callbacks ----

  const handleCrisisComplete = useCallback(
    (crisisResponse: string) => {
      if (crisisResponse === 'no-crisis') {
        advanceStage([]);
        return;
      }
      advanceStage([{
        cardId: crisisData?.crisisCard.eventId ?? '',
        choiceId: crisisResponse,
        interactionType: InteractionType.CrisisResponse,
        month: currentMonth,
      }]);
    },
    [crisisData, currentMonth, advanceStage],
  );

  const handlePetitionComplete = useCallback(
    (petitionDecisions: { cardId: string; choiceId: string }[]) => {
      const decisions: MonthDecision[] = petitionDecisions.map((d) => ({
        cardId: d.cardId,
        choiceId: d.choiceId,
        interactionType: InteractionType.Petition,
        month: currentMonth,
      }));
      advanceStage(decisions);
    },
    [currentMonth, advanceStage],
  );

  const handleNegotiationComplete = useCallback(
    (decisions: MonthDecision[]) => {
      advanceStage(decisions);
    },
    [advanceStage],
  );

  const handleAssessmentComplete = useCallback(
    (choiceId: string) => {
      advanceStage([{
        cardId: assessmentData?.crisisData.crisisCard.eventId ?? '',
        choiceId,
        interactionType: InteractionType.Assessment,
        month: currentMonth,
        targetNeighborId: assessmentData?.resolvedNeighborId,
      }]);
    },
    [assessmentData, currentMonth, advanceStage],
  );

  // ---- Additional crisis callback ----

  const handleAdditionalCrisisComplete = useCallback(
    (crisisResponse: string) => {
      const crisisItem = additionalCrises[additionalCrisisIndex];
      if (crisisResponse === 'no-crisis' || !crisisItem) {
        advanceStage([]);
        return;
      }
      advanceStage([{
        cardId: crisisItem.crisisCard.eventId,
        choiceId: crisisResponse,
        interactionType: InteractionType.CrisisResponse,
        month: currentMonth,
      }]);
    },
    [additionalCrises, additionalCrisisIndex, currentMonth, advanceStage],
  );

  // ---- Secondary petition callback (when primary was not petitions) ----

  const handleSecondaryPetitionComplete = useCallback(
    (petitionDecisions: { cardId: string; choiceId: string }[]) => {
      const decisions: MonthDecision[] = petitionDecisions.map((d) => ({
        cardId: d.cardId,
        choiceId: d.choiceId,
        interactionType: InteractionType.Petition,
        month: currentMonth,
      }));
      advanceStage(decisions);
    },
    [currentMonth, advanceStage],
  );

  // ---- Notification acknowledge handler ----

  const handleNotifTap = useCallback(() => {
    const card = notificationCards[notifIndex];
    if (!card) return;

    if (notifConfirming) {
      // Second tap — commit this notification
      const decision: MonthDecision = {
        cardId: card.eventId,
        choiceId: card.acknowledgeChoiceId,
        interactionType: InteractionType.Notification,
        month: currentMonth,
      };

      const nextNotifIndex = notifIndex + 1;
      if (nextNotifIndex >= notificationCards.length) {
        // All notifications done — advance stage with this + accumulated notif decisions
        advanceStage([decision]);
      } else {
        // More notifications — accumulate and advance index
        setAccumulatedDecisions((prev) => [...prev, decision]);
        setNotifIndex(nextNotifIndex);
        setNotifConfirming(false);
      }
    } else {
      // First tap — select
      setNotifConfirming(true);
    }
  }, [notifIndex, notifConfirming, notificationCards, currentMonth, advanceStage]);

  // ---- Rendering ----

  if (initialStage === null) {
    return null;
  }

  // Primary stage
  if (renderStage === 'primary') {
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
          return <NegotiationFallback onComplete={(d) => advanceStage(d)} />;
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
          return <AssessmentFallback onComplete={(d) => advanceStage(d)} />;
        }
        return (
          <AssessmentPhase
            assessmentData={assessmentData.crisisData}
            confidenceLevel={assessmentData.confidenceLevel}
            onComplete={handleAssessmentComplete}
          />
        );

      case InteractionType.Decree:
        return <DecreeFallback onComplete={(d) => advanceStage(d)} />;

      case InteractionType.Notification:
        // A notification as primary interaction — treat as notification stage
        setRenderStage('notifications');
        return null;
    }
  }

  // Additional crisis stage
  if (renderStage === 'additionalCrisis') {
    const crisisItem = additionalCrises[additionalCrisisIndex];
    if (!crisisItem) {
      return <DecreeFallback onComplete={(d) => advanceStage(d)} />;
    }
    return (
      <CrisisPhase
        crisisData={crisisItem}
        onComplete={handleAdditionalCrisisComplete}
      />
    );
  }

  // Secondary petitions stage (when primary was not petitions)
  if (renderStage === 'petitions') {
    return (
      <PetitionPhase
        petitionCards={petitionCards}
        onComplete={handleSecondaryPetitionComplete}
      />
    );
  }

  // Notifications stage — inline acknowledge-only cards
  if (renderStage === 'notifications') {
    const card = notificationCards[notifIndex];
    if (!card) {
      return null;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Counter */}
        {notificationCards.length > 1 && (
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-text-disabled)',
            }}
          >
            NOTICE {notifIndex + 1} OF {notificationCards.length}
          </div>
        )}

        {/* Notification card */}
        <div style={{ animation: 'slideUp 400ms ease both' }}>
          <Card family="notification">
            <CardTitle>{card.title}</CardTitle>
            <CardBody>{card.body}</CardBody>
          </Card>
        </div>

        {/* Acknowledge button */}
        <div style={{ animation: 'slideUp 400ms ease 80ms both' }}>
          <Card
            family="response"
            onClick={handleNotifTap}
            style={
              notifConfirming
                ? { borderColor: 'var(--color-accent-status)' }
                : undefined
            }
          >
            <CardTitle>Acknowledged</CardTitle>
          </Card>
        </div>

        {/* Confirm hint */}
        {notifConfirming && (
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-text-disabled)',
              animation: 'pop 300ms ease both',
            }}
          >
            TAP AGAIN TO CONFIRM
          </div>
        )}
      </div>
    );
  }

  return null;
}
