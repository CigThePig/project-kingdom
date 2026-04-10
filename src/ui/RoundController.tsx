import { useState, useContext, useCallback, useEffect } from 'react';

import { StatsBar } from './components/StatsBar';
import { PhaseIndicator } from './components/PhaseIndicator';
import { MonthDawn } from './phases/MonthDawn';
import { CourtBusiness } from './phases/CourtBusiness';
import { DecreePhase } from './phases/DecreePhase';
import { SummaryPhase } from './phases/SummaryPhase';
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
import { generatePetitionCards } from '../bridge/petitionCardGenerator';
import type { PetitionCardData } from '../bridge/petitionCardGenerator';
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

export function RoundController() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('RoundController must be inside GameProvider');

  // Monthly state machine
  const [currentMonth, setCurrentMonth] = useState<SeasonMonth>(SeasonMonth.Early);
  const [currentPhase, setCurrentPhase] = useState<MonthPhase>('monthDawn');
  const [accumulatedDecisions, setAccumulatedDecisions] = useState<MonthDecision[]>([]);

  // Bridge data for this season
  const [surfacedEvents, setSurfacedEvents] = useState<ActiveEvent[]>([]);
  const [monthAllocations, setMonthAllocations] = useState<MonthCardAllocation | null>(null);
  const [crisisData, setCrisisData] = useState<CrisisPhaseData | null>(null);
  const [petitionCards, setPetitionCards] = useState<PetitionCardData[]>([]);
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

  // Prepare card pools when season starts (Month 1, monthDawn)
  useEffect(() => {
    if (currentMonth === SeasonMonth.Early && currentPhase === 'monthDawn') {
      prepareRound(ctx.state.gameState, ctx.state.eventHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentPhase]);

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

  function prepareRound(gameState: GameState, eventHistory: ActiveEvent[]) {
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

    // Partition events into crisis/petition
    const { crisisEvents, petitionEvents } = partitionEvents(events);
    const firstCrisis = crisisEvents[0] ?? null;
    const crisis = firstCrisis ? generateCrisisPhaseData(firstCrisis) : null;
    setCrisisData(crisis);

    const petitions = generatePetitionCards(petitionEvents);
    setPetitionCards(petitions);

    // Generate negotiation and assessment cards
    const negotiation = generateNegotiationCard(gameState);
    setNegotiationId(negotiation?.eventCard.id ?? null);

    const assessment = generateAssessmentPhaseData(gameState);

    // Distribute cards across 3 months
    const allocations = distributeCardsToMonths(crisis, petitions, negotiation, assessment);
    setMonthAllocations(allocations);

    // Generate decree cards (used in Month 3)
    setDecreeCards(generateDecreeCards(gameState));

    // Generate advisor briefing (used in Month 1 dawn)
    setAdvisorBriefing(generateAdvisorBriefing(gameState));

    // Reset accumulated state
    setSummaryData(null);
    setSelectedDecrees([]);
    setAccumulatedDecisions([]);
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
          const defId = card?.definitionId ?? d.cardId;
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
          crisisData,
          petitionCards,
          negotiationId,
          prevStyle,
          projectedStyle,
        ),
      );

      setCurrentPhase('summary');
    },
    [accumulatedDecisions, crisisData, petitionCards, negotiationId, ctx.state.gameState.rulingStyle, ctx.state.gameState.turn.turnNumber],
  );

  const handleRoundComplete = useCallback(() => {
    try {
      const cardActions = mapMonthDecisionsToActions(
        accumulatedDecisions,
        selectedDecrees,
        crisisData,
        petitionCards,
        negotiationId,
        decreeCards,
      );

      // Apply assessment and negotiation effects directly (they don't
      // flow through the engine's event system as ActiveEvents).
      const stateAfterDirect = applyDirectEffects(
        ctx.state.gameState,
        accumulatedDecisions,
        negotiationId,
      );

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
      ctx.dispatch({ type: 'TURN_RESOLVED', result });
    } catch (err) {
      console.error('Turn resolution error:', err);
    }

    // Reset for next season
    setCurrentMonth(SeasonMonth.Early);
    setCurrentPhase('monthDawn');
    setAccumulatedDecisions([]);
    setSelectedDecrees([]);
    setSurfacedEvents([]);
    setMonthAllocations(null);
  }, [
    ctx,
    accumulatedDecisions,
    selectedDecrees,
    crisisData,
    petitionCards,
    negotiationId,
    decreeCards,
    surfacedEvents,
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
          petitionCards={currentAllocation.petitionCards}
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
            crisisResponse: null,
            petitionDecisions: [],
            selectedDecrees,
          }}
          summaryData={summaryData ?? undefined}
          onComplete={handleRoundComplete}
        />
      )}

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
