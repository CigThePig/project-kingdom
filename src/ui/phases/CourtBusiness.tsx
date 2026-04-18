// CourtBusiness — Router component for monthly court interactions.
// Supports stacked interactions: primary → additional crises → petitions → notifications → opportunity.
// Each sub-phase collects decisions; the month is complete when all stages are done.

import { useState, useCallback, useEffect, useRef } from 'react';

import { InteractionType, SeasonMonth } from '../../engine/types';
import type { CourtHand, GameState } from '../../engine/types';
import { CrisisPhase } from './CrisisPhase';
import { PetitionPhase } from './PetitionPhase';
import { NegotiationPhase } from './NegotiationPhase';
import { AssessmentPhase } from './AssessmentPhase';
import type { CardOfFamily } from '../../engine/cards/types';
import type { MonthDecision, CourtOpportunityOffer } from '../types';

type PetitionLikeCard = CardOfFamily<'petition'> | CardOfFamily<'overture'>;
import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { CourtHandPanel } from '../components/CourtHandPanel';
import type { HandCardChoice } from '../../data/cards/hand-cards';

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
type RenderStage = 'primary' | 'additionalCrisis' | 'petitions' | 'notifications' | 'opportunity';

interface CourtBusinessProps {
  interactionType: InteractionType | null;
  crisisData: CardOfFamily<'crisis'> | null;
  additionalCrises: CardOfFamily<'crisis'>[];
  petitionCards: PetitionLikeCard[];
  notificationCards: CardOfFamily<'notification'>[];
  negotiationCard: CardOfFamily<'negotiation'> | null;
  assessmentData: CardOfFamily<'assessment'> | null;
  currentMonth: SeasonMonth;
  onComplete: (decisions: MonthDecision[]) => void;
  /** Phase 5 — Court Opportunity attached to a quiet month. */
  courtOpportunity?: CourtOpportunityOffer | null;
  /** Phase 5 — Court Hand and side-effects for the overlay panel. */
  courtHand?: CourtHand;
  gameState?: GameState;
  onAcceptOpportunity?: (offer: CourtOpportunityOffer) => void;
  onPlayHandCard?: (cardId: string, choice: HandCardChoice) => void;
  onDiscardHandCard?: (cardId: string) => void;
}

/**
 * Determines the first stage to render based on what content is available.
 * If the primary interaction is null (quiet month) but stacked content exists,
 * skips to the appropriate secondary stage.
 */
function getInitialStage(
  interactionType: InteractionType | null,
  additionalCrises: CardOfFamily<'crisis'>[],
  petitionCards: PetitionLikeCard[],
  notificationCards: CardOfFamily<'notification'>[],
  courtOpportunity?: CourtOpportunityOffer | null,
): RenderStage | null {
  if (interactionType !== null) return 'primary';
  if (additionalCrises.length > 0) return 'additionalCrisis';
  if (petitionCards.length > 0) return 'petitions';
  if (notificationCards.length > 0) return 'notifications';
  if (courtOpportunity) return 'opportunity';
  return null; // truly quiet month
}

/**
 * Determines the next stage after the current one finishes.
 * Returns null when all stages are complete.
 */
function getNextStage(
  currentStage: RenderStage,
  interactionType: InteractionType | null,
  additionalCrises: CardOfFamily<'crisis'>[],
  additionalCrisisIndex: number,
  petitionCards: PetitionLikeCard[],
  notificationCards: CardOfFamily<'notification'>[],
  courtOpportunity?: CourtOpportunityOffer | null,
): RenderStage | null {
  switch (currentStage) {
    case 'primary':
      if (additionalCrises.length > 0) return 'additionalCrisis';
      // Don't show petitions as secondary if primary was already petitions
      if (petitionCards.length > 0 && interactionType !== InteractionType.Petition) return 'petitions';
      if (notificationCards.length > 0) return 'notifications';
      if (courtOpportunity) return 'opportunity';
      return null;
    case 'additionalCrisis':
      if (additionalCrisisIndex + 1 < additionalCrises.length) return 'additionalCrisis';
      if (petitionCards.length > 0 && interactionType !== InteractionType.Petition) return 'petitions';
      if (notificationCards.length > 0) return 'notifications';
      if (courtOpportunity) return 'opportunity';
      return null;
    case 'petitions':
      if (notificationCards.length > 0) return 'notifications';
      if (courtOpportunity) return 'opportunity';
      return null;
    case 'notifications':
      if (courtOpportunity) return 'opportunity';
      return null;
    case 'opportunity':
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
  courtOpportunity,
  courtHand,
  gameState,
  onAcceptOpportunity,
  onPlayHandCard,
  onDiscardHandCard,
}: CourtBusinessProps) {
  const initialStage = getInitialStage(
    interactionType,
    additionalCrises,
    petitionCards,
    notificationCards,
    courtOpportunity,
  );

  const [renderStage, setRenderStage] = useState<RenderStage | null>(initialStage);
  const [additionalCrisisIndex, setAdditionalCrisisIndex] = useState(0);
  const [accumulatedDecisions, setAccumulatedDecisions] = useState<MonthDecision[]>([]);

  // Notification sub-phase state
  const [notifIndex, setNotifIndex] = useState(0);
  const [notifConfirming, setNotifConfirming] = useState(false);

  // Phase 5 — Court Hand overlay visibility
  const [handPanelOpen, setHandPanelOpen] = useState(false);

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
      const next = getNextStage(
        currentStage,
        interactionType,
        additionalCrises,
        additionalCrisisIndex,
        petitionCards,
        notificationCards,
        courtOpportunity,
      );

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
    [accumulatedDecisions, renderStage, additionalCrisisIndex, interactionType, additionalCrises, petitionCards, notificationCards, courtOpportunity, onComplete],
  );

  // ---- Primary stage callbacks ----

  const handleCrisisComplete = useCallback(
    (crisisResponse: string) => {
      if (crisisResponse === 'no-crisis') {
        advanceStage([]);
        return;
      }
      advanceStage([{
        cardId: crisisData?.payload.crisisCard.eventId ?? '',
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
        cardId: assessmentData?.payload.crisisData.crisisCard.eventId ?? '',
        choiceId,
        interactionType: InteractionType.Assessment,
        month: currentMonth,
        targetNeighborId: assessmentData?.payload.resolvedNeighborId,
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
        cardId: crisisItem.payload.crisisCard.eventId,
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
        cardId: card.payload.eventId,
        choiceId: card.payload.acknowledgeChoiceId,
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

  // ---- Opportunity stage handler ----
  const handleAcceptOpportunity = useCallback(() => {
    if (courtOpportunity && onAcceptOpportunity) {
      onAcceptOpportunity(courtOpportunity);
    }
    advanceStage([]);
  }, [courtOpportunity, onAcceptOpportunity, advanceStage]);

  const handleDeclineOpportunity = useCallback(() => {
    advanceStage([]);
  }, [advanceStage]);

  // ---- Rendering ----

  if (initialStage === null) {
    return null;
  }

  const showHandControls =
    courtHand !== undefined &&
    onPlayHandCard !== undefined &&
    onDiscardHandCard !== undefined &&
    gameState !== undefined;

  const stageContent = renderStageContent();

  return (
    <div style={{ position: 'relative' }}>
      {showHandControls && courtHand && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 8,
          }}
        >
          <button
            onClick={() => setHandPanelOpen(true)}
            aria-label={`Open Court Hand — ${courtHand.slots.length} of ${courtHand.capacity}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: 999,
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <span>Hand</span>
            <span style={{ color: 'var(--color-text-primary)' }}>
              {courtHand.slots.length}/{courtHand.capacity}
            </span>
          </button>
        </div>
      )}
      {stageContent}
      {showHandControls && courtHand && gameState && handPanelOpen && (
        <CourtHandPanel
          hand={courtHand}
          neighbors={gameState.diplomacy.neighbors}
          state={gameState}
          onPlay={(cardId, choice) => {
            onPlayHandCard!(cardId, choice);
          }}
          onDiscard={(cardId) => {
            onDiscardHandCard!(cardId);
          }}
          onClose={() => setHandPanelOpen(false)}
        />
      )}
    </div>
  );

  function renderStageContent() {
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
              assessmentCard={assessmentData}
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

          <div style={{ animation: 'slideUp 400ms ease both' }}>
            <Card family="notification">
              <CardTitle>{card.payload.title}</CardTitle>
              <CardBody>{card.payload.body}</CardBody>
            </Card>
          </div>

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

    // Opportunity stage — Accept/Decline a Court Opportunity on quiet months
    if (renderStage === 'opportunity' && courtOpportunity) {
      let badgeLabel: string;
      let previewTitle: string;
      let previewBody: string;
      if (courtOpportunity.kind === 'advisor_candidate') {
        badgeLabel = `Advisor Candidate — ${courtOpportunity.seat}`;
        previewTitle = `${courtOpportunity.advisorName} — ${courtOpportunity.personality}`;
        previewBody = courtOpportunity.background;
      } else if (courtOpportunity.kind === 'set_posture') {
        badgeLabel = `${courtOpportunity.regionDisplayName} — ${courtOpportunity.currentPostureLabel} → ${courtOpportunity.suggestedPostureLabel}`;
        previewTitle = `Set Posture: ${courtOpportunity.suggestedPostureLabel}`;
        previewBody = courtOpportunity.suggestedPostureEffect;
      } else {
        badgeLabel = `Hand Card — Expires in ${courtOpportunity.expiresAfterTurns} turns`;
        previewTitle = courtOpportunity.handCardTitle;
        previewBody = courtOpportunity.handCardBody;
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ animation: 'slideUp 400ms ease both' }}>
            <Card family="advisor">
              <CardTitle>{courtOpportunity.title}</CardTitle>
              <CardBody>{courtOpportunity.body}</CardBody>
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-disabled)',
                    marginBottom: 4,
                  }}
                >
                  {badgeLabel}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-family-heading)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: 2,
                  }}
                >
                  {previewTitle}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {previewBody}
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', gap: 8, animation: 'slideUp 400ms ease 80ms both' }}>
            <div style={{ flex: 1 }}>
              <Card family="response" onClick={handleAcceptOpportunity}>
                <CardTitle>Accept</CardTitle>
              </Card>
            </div>
            <div style={{ flex: 1 }}>
              <Card family="response" onClick={handleDeclineOpportunity}>
                <CardTitle>Decline</CardTitle>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
