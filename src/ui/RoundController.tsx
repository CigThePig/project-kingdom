import { useState, useContext, useCallback, useEffect, lazy, Suspense } from 'react';

import { StatsBar } from './components/StatsBar';
import { PhaseIndicator } from './components/PhaseIndicator';

const MonthDawn = lazy(() => import('./phases/MonthDawn').then(m => ({ default: m.MonthDawn })));
const CourtBusiness = lazy(() => import('./phases/CourtBusiness').then(m => ({ default: m.CourtBusiness })));
const DecreePhase = lazy(() => import('./phases/DecreePhase').then(m => ({ default: m.DecreePhase })));
const SummaryPhase = lazy(() => import('./phases/SummaryPhase').then(m => ({ default: m.SummaryPhase })));
import { GameContext } from '../context/game-context';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { surfaceEvents } from '../engine/events/event-engine';
import { calculateCategoryWeights } from '../engine/events/narrative-pacing';
import { EVENT_POOL } from '../data/events/index';
import { SeasonMonth, InteractionType, WorldPulseCategory } from '../engine/types';
import type { ActiveEvent, GameState } from '../engine/types';
import { accumulateStyleDecision } from '../engine/systems/ruling-style';
import { EVENT_CHOICE_STYLE_TAGS, DECREE_STYLE_TAGS } from '../data/ruling-style/flavor-tags';
import type { MonthPhase, MonthDecision, MonthCardAllocation } from './types';
import { partitionEvents } from '../bridge/eventClassifier';
import { generateCrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import { generatePetitionCards, generateNotificationCards } from '../bridge/petitionCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../bridge/petitionCardGenerator';
import { generateDecreeCards } from '../bridge/decreeCardGenerator';
import type { DecreeCardData } from '../bridge/decreeCardGenerator';
import { generateAdvisorBriefing } from '../bridge/advisorGenerator';
import type { AdvisorBriefing } from '../bridge/advisorGenerator';
import { generateMonthlySummaryData } from '../bridge/summaryGenerator';
import type { SummaryData } from '../bridge/summaryGenerator';
import { mapMonthDecisionsToActions } from '../bridge/decisionMapper';
import { generateNegotiationCard } from '../bridge/negotiationCardGenerator';
import { generateAssessmentPhaseData } from '../bridge/assessmentCardGenerator';
import { distributeCardsToMonths } from '../bridge/cardDistributor';
import { applyDirectEffects } from '../bridge/directEffectApplier';
import { generateWorldPulse } from '../bridge/worldPulseGenerator';
import { compileKingdomState } from '../bridge/codexCompiler';
import { compileDossier } from '../bridge/dossierCompiler';
import { compileActiveSituations } from '../bridge/situationTracker';
import { CodexOverlay } from './components/CodexOverlay';
import { generateStorylineCrisisData } from '../bridge/storylineCardGenerator';
import { generateNeighborActionCards } from '../bridge/neighborActionCardGenerator';
import type { WorldPulseLine } from './types';

/**
 * Returns the MonthAllocation for the given SeasonMonth from a MonthCardAllocation.
 */
function getAllocationForMonth(allocations: MonthCardAllocation, month: SeasonMonth) {
  switch (month) {
    case SeasonMonth.Early: return allocations.month1;
    case SeasonMonth.Mid:   return allocations.month2;
    case SeasonMonth.Late:  return allocations.month3;
  }
}

interface RoundControllerProps {
  onGameOver?: () => void;
}

export function RoundController({ onGameOver }: RoundControllerProps = {}) {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('RoundController must be inside GameProvider');

  // Monthly state machine
  const [currentMonth, setCurrentMonth] = useState<SeasonMonth>(SeasonMonth.Early);
  const [currentPhase, setCurrentPhase] = useState<MonthPhase>('monthDawn');
  const [accumulatedDecisions, setAccumulatedDecisions] = useState<MonthDecision[]>([]);

  // Bridge data for this season
  const [surfacedEvents, setSurfacedEvents] = useState<ActiveEvent[]>([]);
  const [monthAllocations, setMonthAllocations] = useState<MonthCardAllocation | null>(null);
  const [allCrisesData, setAllCrisesData] = useState<CrisisPhaseData[]>([]);
  const [petitionCards, setPetitionCards] = useState<PetitionCardData[]>([]);
  const [notificationCards, setNotificationCards] = useState<NotificationCardData[]>([]);
  const [decreeCards, setDecreeCards] = useState<DecreeCardData[]>([]);
  const [advisorBriefing, setAdvisorBriefing] = useState<AdvisorBriefing | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const [selectedDecrees, setSelectedDecrees] = useState<string[]>([]);

  // Random selections for MonthDawn — computed in prepareRound (inside a useEffect)
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [effectOrder, setEffectOrder] = useState<[number, number, number]>([0, 1, 2]);

  // World Pulse state — tracks categories used this season to avoid repeats
  const [previousPulseCategories, setPreviousPulseCategories] = useState<WorldPulseCategory[]>([]);
  const [currentWorldPulseLines, setCurrentWorldPulseLines] = useState<WorldPulseLine[]>([]);

  // Codex overlay state
  const [isCodexOpen, setIsCodexOpen] = useState(false);

  // Prepare card pools when season starts (Month 1, monthDawn).
  // Also regenerates when authoritative gameState changes externally
  // (e.g. load-save, new-game) so cards reflect the current state.
  const turnNumber = ctx.state.gameState.turn.turnNumber;
  useEffect(() => {
    if (currentMonth === SeasonMonth.Early && currentPhase === 'monthDawn') {
      const offeredDecrees = prepareRound(ctx.state.gameState, ctx.state.eventHistory, ctx.state.recentlyOfferedDecreeIds);
      ctx.dispatch({ type: 'DECREES_OFFERED', decreeIds: offeredDecrees });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentPhase, turnNumber]);

  // Randomize dawn display and generate World Pulse each time we enter monthDawn
  useEffect(() => {
    if (currentPhase === 'monthDawn') {
      setPhraseIndex(Math.floor(Math.random() * 3));
      const order = [0, 1, 2] as [number, number, number];
      for (let i = 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setEffectOrder(order);

      // Reset pulse categories on season start (Month 1)
      const prevCategories = currentMonth === SeasonMonth.Early ? [] : previousPulseCategories;
      if (currentMonth === SeasonMonth.Early) {
        setPreviousPulseCategories([]);
      }

      // Generate World Pulse lines for this month
      const pulseLines = generateWorldPulse(ctx.state.gameState, currentMonth, prevCategories);
      setCurrentWorldPulseLines(pulseLines);

      // Track categories used this season
      const newCategories = pulseLines.map((l) => l.category);
      setPreviousPulseCategories((prev) => {
        const base = currentMonth === SeasonMonth.Early ? [] : prev;
        return [...base, ...newCategories];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, currentMonth]);

  function prepareRound(gameState: GameState, eventHistory: ActiveEvent[], recentlyOfferedDecreeIds: string[]): string[] {
    // Surface events for the season (same as before)
    let events: ActiveEvent[];
    if (gameState.activeEvents.length > 0) {
      events = gameState.activeEvents;
    } else {
      const categoryWeights = calculateCategoryWeights(
        gameState.narrativePacing,
        gameState.turn.turnNumber,
      );
      events = surfaceEvents(
        gameState,
        gameState.turn.turnNumber,
        EVENT_POOL,
        gameState.activeEvents,
        eventHistory,
        categoryWeights,
      );
    }
    setSurfacedEvents(events);

    // Partition events into crisis/petition/notification
    const { crisisEvents, petitionEvents, notificationEvents } = partitionEvents(events);
    const crisisDataList = crisisEvents.map((e) => generateCrisisPhaseData(e, gameState));

    // Generate crisis cards from active storylines at branch points
    const storylineCrises = (gameState.activeStorylines ?? [])
      .map(generateStorylineCrisisData)
      .filter((d): d is CrisisPhaseData => d !== null);

    // Generate cards from neighbor AI actions
    const neighborCards = generateNeighborActionCards(gameState.neighborActions ?? []);

    // Merge all crisis sources
    const allCrises = [...crisisDataList, ...storylineCrises, ...neighborCards.crisisCards];
    const crisis = allCrises[0] ?? null;
    setAllCrisesData(allCrises);

    // Generate petition and notification cards separately
    const petitions = generatePetitionCards(petitionEvents, gameState);
    const allPetitions = [...petitions, ...neighborCards.petitionCards];
    setPetitionCards(allPetitions);

    const notifications = generateNotificationCards(notificationEvents);
    setNotificationCards(notifications);

    // Generate negotiation and assessment cards
    const negotiation = generateNegotiationCard(gameState);
    setNegotiationId(negotiation?.eventCard.id ?? null);

    const assessment = generateAssessmentPhaseData(gameState);

    // Distribute cards across 3 months (pass additional crises beyond the first + notifications)
    const additionalCrises = allCrises.slice(1);
    const allocations = distributeCardsToMonths(crisis, allPetitions, negotiation, assessment, additionalCrises, notifications);
    setMonthAllocations(allocations);

    // Generate decree cards (used in Month 3)
    const decrees = generateDecreeCards(gameState, recentlyOfferedDecreeIds);
    setDecreeCards(decrees);

    // Generate advisor briefing (used in Month 1 dawn)
    setAdvisorBriefing(generateAdvisorBriefing(gameState));

    // Reset accumulated state
    setSummaryData(null);
    setSelectedDecrees([]);
    setAccumulatedDecisions([]);

    return decrees.map((d) => d.decreeId);
  }

  // Phase advancement — the core state machine
  const advanceFromDawn = useCallback(() => {
    if (!monthAllocations) return;

    const alloc = getAllocationForMonth(monthAllocations, currentMonth);

    if (alloc.interactionType !== null) {
      // This month has court business
      setCurrentPhase('courtBusiness');
    } else if (currentMonth < SeasonMonth.Late) {
      // Quiet month, advance to next month
      setCurrentMonth((m) => (m + 1) as SeasonMonth);
      setCurrentPhase('monthDawn');
    } else {
      // Month 3, quiet, go straight to decrees
      setCurrentPhase('decree');
    }
  }, [monthAllocations, currentMonth]);

  const handleCourtBusinessComplete = useCallback(
    (decisions: MonthDecision[]) => {
      setAccumulatedDecisions((prev) => [...prev, ...decisions]);

      if (currentMonth < SeasonMonth.Late) {
        // Advance to next month
        setCurrentMonth((m) => (m + 1) as SeasonMonth);
        setCurrentPhase('monthDawn');
      } else {
        // Month 3 — proceed to decrees
        setCurrentPhase('decree');
      }
    },
    [currentMonth],
  );

  const handleDecreeComplete = useCallback(
    (decrees: string[]) => {
      setSelectedDecrees(decrees);

      // Generate summary data with all accumulated decisions
      const allDecisions = accumulatedDecisions;
      const prevStyle = ctx.state.gameState.rulingStyle;
      const turnNumber = ctx.state.gameState.turn.turnNumber;

      // Project ruling style changes from this round's decisions
      let projectedStyle = prevStyle;
      for (const d of allDecisions) {
        if (d.interactionType === InteractionType.CrisisResponse || d.interactionType === InteractionType.Petition) {
          const card = petitionCards.find((p) => p.eventId === d.cardId);
          // For crisis responses, look up the definitionId from all crises data.
          const matchedCrisis = allCrisesData.find(
            (c) => c.crisisCard.eventId === d.cardId,
          );
          const crisisDefId = matchedCrisis?.crisisCard.definitionId;
          const defId = card?.definitionId ?? crisisDefId ?? d.cardId;
          const deltas = EVENT_CHOICE_STYLE_TAGS[defId]?.[d.choiceId];
          if (deltas && Object.keys(deltas).length > 0) {
            projectedStyle = accumulateStyleDecision(projectedStyle, {
              source: d.interactionType === InteractionType.CrisisResponse ? 'event' : 'petition',
              sourceId: defId,
              choiceId: d.choiceId,
              turnApplied: turnNumber,
              axisDeltas: deltas,
            });
          }
        }
      }
      for (const decreeId of decrees) {
        const deltas = DECREE_STYLE_TAGS[decreeId];
        if (deltas && Object.keys(deltas).length > 0) {
          projectedStyle = accumulateStyleDecision(projectedStyle, {
            source: 'decree',
            sourceId: decreeId,
            choiceId: decreeId,
            turnApplied: turnNumber,
            axisDeltas: deltas,
          });
        }
      }

      setSummaryData(
        generateMonthlySummaryData(
          allDecisions,
          decrees,
          allCrisesData,
          petitionCards,
          negotiationId,
          prevStyle,
          projectedStyle,
          notificationCards,
          ctx.state.gameState.causalLedger,
        ),
      );

      setCurrentPhase('summary');
    },
    [accumulatedDecisions, allCrisesData, petitionCards, notificationCards, negotiationId, ctx.state.gameState.rulingStyle, ctx.state.gameState.turn.turnNumber, ctx.state.gameState.causalLedger],
  );

  const handleRoundComplete = useCallback(() => {
    try {
      const cardActions = mapMonthDecisionsToActions(
        accumulatedDecisions,
        selectedDecrees,
        allCrisesData,
        petitionCards,
        negotiationId,
        decreeCards,
        notificationCards,
      );

      // Apply assessment and negotiation effects directly (they don't
      // flow through the engine's event system as ActiveEvents).
      let stateAfterDirect = applyDirectEffects(
        ctx.state.gameState,
        accumulatedDecisions,
        negotiationId,
      );

      // Persist ruling-style threshold crossings computed during summary generation.
      if (summaryData?.updatedRulingStyle) {
        stateAfterDirect = {
          ...stateAfterDirect,
          rulingStyle: summaryData.updatedRulingStyle,
        };
      }

      // Merge card-derived actions with any pre-queued actions
      const existingActions = stateAfterDirect.actionBudget.queuedActions;
      const allActions = [...existingActions, ...cardActions];
      const totalSlots = allActions.reduce((sum, a) => sum + a.slotCost, 0);

      const stateWithActions: GameState = {
        ...stateAfterDirect,
        activeEvents: [...surfacedEvents],
        actionBudget: {
          ...ctx.state.gameState.actionBudget,
          queuedActions: allActions,
          slotsUsed: totalSlots,
          slotsRemaining: Math.max(
            0,
            ctx.state.gameState.actionBudget.slotsTotal - totalSlots,
          ),
        },
      };

      const result = resolveTurn(stateWithActions, applyActionEffects, ctx.state.eventHistory);
      ctx.dispatch({ type: 'TURN_RESOLVED', result, decisions: accumulatedDecisions });

      // If failure conditions triggered, signal game over instead of cycling.
      if (result.triggeredFailureConditions.length > 0) {
        onGameOver?.();
        return;
      }

      // Only reset for next season after successful resolution.
      setCurrentMonth(SeasonMonth.Early);
      setCurrentPhase('monthDawn');
      setAccumulatedDecisions([]);
      setSelectedDecrees([]);
      setSurfacedEvents([]);
      setMonthAllocations(null);
    } catch (err) {
      console.error('Turn resolution error:', err);
    }
  }, [
    ctx,
    accumulatedDecisions,
    selectedDecrees,
    allCrisesData,
    petitionCards,
    notificationCards,
    negotiationId,
    decreeCards,
    surfacedEvents,
    summaryData,
    onGameOver,
  ]);

  // Get current month's allocation for rendering
  const currentAllocation = monthAllocations
    ? getAllocationForMonth(monthAllocations, currentMonth)
    : null;

  const { season, year } = ctx.state.gameState.turn;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: '0 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <StatsBar onCodexOpen={() => setIsCodexOpen(true)} />
      <PhaseIndicator currentMonth={currentMonth} currentPhase={currentPhase} />

      <Suspense fallback={<div style={{ fontFamily: 'var(--font-family-mono)', fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px 0', letterSpacing: 2, textTransform: 'uppercase' }}>The court assembles...</div>}>

      {currentPhase === 'monthDawn' && (
        <MonthDawn
          seasonMonth={currentMonth}
          season={season}
          year={year}
          worldPulseLines={currentWorldPulseLines}
          advisorBriefing={currentMonth === SeasonMonth.Early ? (advisorBriefing ?? undefined) : undefined}
          phraseIndex={phraseIndex}
          effectOrder={effectOrder}
          onComplete={advanceFromDawn}
        />
      )}

      {currentPhase === 'courtBusiness' && currentAllocation && (
        <CourtBusiness
          interactionType={currentAllocation.interactionType}
          crisisData={currentAllocation.crisisData}
          additionalCrises={currentAllocation.additionalCrises}
          petitionCards={currentAllocation.petitionCards}
          notificationCards={currentAllocation.notificationCards}
          negotiationCard={currentAllocation.negotiationCard}
          assessmentData={currentAllocation.assessmentData}
          currentMonth={currentMonth}
          onComplete={handleCourtBusinessComplete}
        />
      )}

      {currentPhase === 'decree' && (
        <DecreePhase
          decreeCards={decreeCards}
          onComplete={handleDecreeComplete}
        />
      )}

      {currentPhase === 'summary' && (
        <SummaryPhase
          decisions={{
            crisisResponse: accumulatedDecisions.find(
              (d) => d.interactionType === InteractionType.CrisisResponse,
            )?.choiceId ?? null,
            petitionDecisions: accumulatedDecisions
              .filter((d) => d.interactionType === InteractionType.Petition)
              .map((d) => ({ cardId: d.cardId, choiceId: d.choiceId })),
            selectedDecrees,
          }}
          summaryData={summaryData ?? undefined}
          onComplete={handleRoundComplete}
        />
      )}

      </Suspense>

      {/* Codex Overlay — accessible during all phases */}
      <CodexOverlay
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        kingdomState={compileKingdomState(ctx.state.gameState)}
        rivals={ctx.state.gameState.diplomacy.neighbors.map((n) =>
          compileDossier(n, ctx.state.gameState.espionage, ctx.state.gameState.neighborActions.filter((a) => a.neighborId === n.id), ctx.state.gameState.turn.turnNumber),
        )}
        situations={compileActiveSituations(ctx.state.gameState)}
        chronicle={ctx.state.chronicle}
      />
    </div>
  );
}
