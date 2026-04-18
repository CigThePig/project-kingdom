import { useState, useContext, useCallback, useEffect, useRef, lazy, Suspense } from 'react';

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
import { SeasonMonth, InteractionType, WorldPulseCategory, RegionalPosture } from '../engine/types';
import type { ActiveEvent, GameState } from '../engine/types';
import { accumulateStyleDecision } from '../engine/systems/ruling-style';
import { EVENT_CHOICE_STYLE_TAGS, DECREE_STYLE_TAGS } from '../data/ruling-style/flavor-tags';
import type { MonthPhase, MonthDecision, MonthCardAllocation } from './types';
import { partitionEvents } from '../bridge/eventClassifier';
import { generateCrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import {
  generatePetitionCards,
  generateNotificationCards,
  synthesizePhase14Petitions,
} from '../bridge/petitionCardGenerator';
import type { PetitionCardData, NotificationCardData } from '../bridge/petitionCardGenerator';
import { generateDecreeCards } from '../bridge/decreeCardGenerator';
import type { DecreeCardData } from '../bridge/decreeCardGenerator';
import { decreeToCard } from '../engine/cards/adapters';
import type { CardTag } from '../engine/cards/types';
import { generateAdvisorBriefing } from '../bridge/advisorGenerator';
import type { AdvisorBriefing } from '../bridge/advisorGenerator';
import { generateMonthlySummaryData } from '../bridge/summaryGenerator';
import type { SummaryData } from '../bridge/summaryGenerator';
import { mapMonthDecisionsToActions } from '../bridge/decisionMapper';
import { generateNegotiationCard } from '../bridge/negotiationCardGenerator';
import { generateAssessmentPhaseData } from '../bridge/assessmentCardGenerator';
import { distributeCardsToMonths } from '../bridge/cardDistributor';
import { generateOvertureCards } from '../bridge/diplomaticOvertureGenerator';
import { generateInterRivalCards } from '../bridge/interRivalCardGenerator';
import { applyDirectEffects } from '../bridge/directEffectApplier';
import { generateWorldPulse } from '../bridge/worldPulseGenerator';
import { compileKingdomState, compileRegionSummaries } from '../bridge/codexCompiler';
import { deductActionCost } from '../engine/resolution/action-budget';
import { compileDossier } from '../bridge/dossierCompiler';
import { compileActiveSituations } from '../bridge/situationTracker';
import { CodexOverlay } from './components/CodexOverlay';
import { generateStorylineCrisisData } from '../bridge/storylineCardGenerator';
import { generateNeighborActionCards } from '../bridge/neighborActionCardGenerator';
import type { WorldPulseLine, CourtOpportunityOffer } from './types';
import { seededRandom } from '../data/text/name-generation';
import {
  HAND_CARDS,
  buildHandCard,
  type HandCardId,
  type HandCardChoice,
} from '../data/cards/hand-cards';
import {
  addCardToHand,
  removeCardFromHand,
} from '../engine/systems/court-hand';
import { detectCombosForTurn } from '../engine/systems/combo-engine';
import { COMBOS } from '../data/cards/combos';

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
  const [overtureCards, setOvertureCards] = useState<PetitionCardData[]>([]);
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
  // (e.g. load-save, new-game) so cards reflect the current state. We only
  // want this effect to fire on turn/phase boundaries, so reads of the live
  // context go through a ref rather than a dep.
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  });
  const turnNumber = ctx.state.gameState.turn.turnNumber;
  useEffect(() => {
    if (currentMonth === SeasonMonth.Early && currentPhase === 'monthDawn') {
      const live = ctxRef.current;
      const offeredDecrees = prepareRound(
        live.state.gameState,
        live.state.eventHistory,
        live.state.recentlyOfferedDecreeIds,
      );
      live.dispatch({ type: 'DECREES_OFFERED', decreeIds: offeredDecrees });
    }
  }, [currentMonth, currentPhase, turnNumber]);

  // Randomize dawn display and generate World Pulse each time we enter monthDawn
  useEffect(() => {
    if (currentPhase === 'monthDawn') {
      const gameState = ctxRef.current.state.gameState;
      const dawnRng = seededRandom(
        `${gameState.runSeed ?? 'dawn'}_t${gameState.turn.turnNumber}_m${currentMonth}_dawn`,
      );
      setPhraseIndex(Math.floor(dawnRng() * 3));
      const order = [0, 1, 2] as [number, number, number];
      for (let i = 2; i > 0; i--) {
        const j = Math.floor(dawnRng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setEffectOrder(order);

      // Reset pulse categories on season start (Month 1)
      const prevCategories = currentMonth === SeasonMonth.Early ? [] : previousPulseCategories;
      if (currentMonth === SeasonMonth.Early) {
        setPreviousPulseCategories([]);
      }

      // Generate World Pulse lines for this month
      const pulseLines = generateWorldPulse(
        ctxRef.current.state.gameState,
        currentMonth,
        prevCategories,
      );
      setCurrentWorldPulseLines(pulseLines);

      // Track categories used this season
      const newCategories = pulseLines.map((l) => l.category);
      setPreviousPulseCategories((prev) => {
        const base = currentMonth === SeasonMonth.Early ? [] : prev;
        return [...base, ...newCategories];
      });
    }
    // previousPulseCategories is intentionally read-through-closure here:
    // we only want this effect to fire on month/phase boundaries, not every
    // time pulse categories change (which would infinite-loop).
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
    const neighborCards = generateNeighborActionCards(gameState.neighborActions ?? [], gameState);

    // Merge all crisis sources
    const allCrises = [...crisisDataList, ...storylineCrises, ...neighborCards.crisisCards];
    const crisis = allCrises[0] ?? null;
    setAllCrisesData(allCrises);

    // Generate petition and notification cards separately
    const petitions = generatePetitionCards(petitionEvents, gameState);
    // Phase 14 — synthesize agent-extraction + mole-exposure petitions when
    // roster/mole state crosses the relevant thresholds.
    const phase14Petitions = synthesizePhase14Petitions(gameState);
    const allPetitions = [
      ...petitions,
      ...neighborCards.petitionCards,
      ...phase14Petitions,
    ];
    setPetitionCards(allPetitions);

    const notifications = generateNotificationCards(notificationEvents, gameState);
    setNotificationCards(notifications);

    // Generate negotiation and assessment cards
    const negotiation = generateNegotiationCard(gameState);
    setNegotiationId(negotiation?.eventCard.id ?? null);

    const assessment = generateAssessmentPhaseData(gameState);

    // Distribute cards across 3 months (pass additional crises beyond the first + notifications)
    const additionalCrises = allCrises.slice(1);
    // Phase 3 — rival-agenda-driven diplomatic overtures. Merged into the
    // petition pool inside the distributor.
    const overtures = generateOvertureCards(gameState);
    // Phase 11 — mediation + coalition cards route through the same petition
    // slot as overtures. Merged here so the distributor sees a single list.
    const interRivalCards = generateInterRivalCards(gameState);
    const allOvertures = [...overtures, ...interRivalCards];
    setOvertureCards(allOvertures);
    const opportunityRng = seededRandom(
      `${gameState.runSeed ?? 'opportunity'}_t${gameState.turn.turnNumber}_opportunity`,
    );
    const allocations = distributeCardsToMonths(
      crisis,
      allPetitions,
      negotiation,
      assessment,
      additionalCrises,
      notifications,
      allOvertures,
      opportunityRng,
      {
        runSeed: gameState.runSeed ?? 'default',
        turnNumber: gameState.turn.turnNumber,
      },
      {
        state: gameState,
        regions: gameState.regions,
        currentTurn: gameState.turn.turnNumber,
      },
      // Phase 10 — initiative context gates commit vs. abandon opportunities.
      { active: gameState.activeInitiative ?? null },
      // Phase 14 — agent context gates recruit-agent opportunities.
      { state: gameState },
    );
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

  // ---- Phase 5: Court Hand handlers ----
  const handleAcceptOpportunity = useCallback(
    (offer: CourtOpportunityOffer) => {
      if (offer.kind === 'advisor_candidate') {
        ctx.dispatch({
          type: 'APPOINT_CANDIDATE_FROM_OPPORTUNITY',
          templateId: offer.candidateTemplateId,
        });
        return;
      }
      if (offer.kind === 'set_posture') {
        ctx.dispatch({
          type: 'SET_REGIONAL_POSTURE',
          regionId: offer.regionId,
          posture: offer.suggestedPosture as RegionalPosture,
        });
        return;
      }
      if (offer.kind === 'initiative_commit') {
        ctx.dispatch({
          type: 'COMMIT_INITIATIVE',
          definitionId: offer.definitionId,
        });
        return;
      }
      if (offer.kind === 'initiative_abandon') {
        ctx.dispatch({ type: 'ABANDON_INITIATIVE' });
        return;
      }
      if (offer.kind === 'recruit_agent') {
        ctx.dispatch({
          type: 'RECRUIT_AGENT_FROM_OPPORTUNITY',
          specialization: offer.specialization,
          coverSettlementId: offer.proposedCoverSettlementId,
        });
        return;
      }
      const handCardId = offer.handCardId;
      ctx.dispatch({
        type: 'UPDATE_GAME_STATE',
        updater: (s) => {
          const card = buildHandCard(handCardId as HandCardId);
          return { ...s, courtHand: addCardToHand(s.courtHand, card, s.turn.turnNumber) };
        },
      });
    },
    [ctx],
  );

  const handlePlayHandCard = useCallback(
    (cardId: string, choice: HandCardChoice) => {
      ctx.dispatch({
        type: 'UPDATE_GAME_STATE',
        updater: (s) => {
          const id = cardId.startsWith('hand:') ? (cardId.slice(5) as HandCardId) : null;
          if (!id) return s;
          const def = HAND_CARDS[id];
          if (!def) return s;
          const card = buildHandCard(id);
          const applied = def.apply(s, choice);
          // Phase 6 — record combo keys for turn-resolution detection.
          const nextCombos = [
            ...applied.pendingComboKeysThisTurn,
            ...(card.comboKeys ?? []),
          ];
          return {
            ...applied,
            courtHand: removeCardFromHand(applied.courtHand, cardId),
            pendingComboKeysThisTurn: nextCombos,
          };
        },
      });
    },
    [ctx],
  );

  const handleDiscardHandCard = useCallback(
    (cardId: string) => {
      ctx.dispatch({
        type: 'UPDATE_GAME_STATE',
        updater: (s) => ({ ...s, courtHand: removeCardFromHand(s.courtHand, cardId) }),
      });
    },
    [ctx],
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

      // Phase 6 — preview the combos that will fire on resolution, so the
      // summary card can show them with prominent styling.
      const triggeredCombos = detectCombosForTurn({
        currentKeys: ctx.state.gameState.pendingComboKeysThisTurn ?? [],
        history: ctx.state.turnHistory,
        currentTurn: ctx.state.gameState.turn.turnNumber,
        registry: COMBOS,
        alreadyDiscovered: ctx.state.gameState.discoveredCombos ?? [],
      });

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
          triggeredCombos,
          overtureCards,
          ctx.state.gameState,
        ),
      );

      setCurrentPhase('summary');
    },
    [accumulatedDecisions, allCrisesData, petitionCards, notificationCards, overtureCards, negotiationId, ctx.state.gameState, ctx.state.turnHistory],
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

      // Fold card-derived actions into the existing budget. deductActionCost
      // respects the real rules (free actions don't consume slots; PolicyChange
      // uses policyChangesUsedThisTurn, not slotCost) so slotsUsed,
      // slotsRemaining, and the queue stay consistent with engine validation.
      const mergedBudget = cardActions.reduce(
        (budget, action) => deductActionCost(budget, action),
        stateAfterDirect.actionBudget,
      );

      const stateWithActions: GameState = {
        ...stateAfterDirect,
        activeEvents: [...surfacedEvents],
        actionBudget: mergedBudget,
      };

      // Phase 10 — collect tags from every card the player resolved this
      // season. Looks up each decision's cardId in the month allocations and
      // in decree cards; matched card tags feed initiative progress.
      const tagIndex = new Map<string, readonly CardTag[]>();
      if (monthAllocations) {
        const allMonths = [
          monthAllocations.month1,
          monthAllocations.month2,
          monthAllocations.month3,
        ];
        for (const m of allMonths) {
          if (m.crisisData) tagIndex.set(m.crisisData.id, m.crisisData.tags);
          for (const c of m.additionalCrises) tagIndex.set(c.id, c.tags);
          for (const p of m.petitionCards) tagIndex.set(p.id, p.tags);
          for (const n of m.notificationCards) tagIndex.set(n.id, n.tags);
          if (m.negotiationCard) tagIndex.set(m.negotiationCard.id, m.negotiationCard.tags);
          if (m.assessmentData) tagIndex.set(m.assessmentData.id, m.assessmentData.tags);
        }
      }
      for (const d of decreeCards) {
        const card = decreeToCard(d);
        tagIndex.set(card.id, card.tags);
      }
      const playedCardTags: CardTag[] = [];
      for (const dec of accumulatedDecisions) {
        const tags = tagIndex.get(dec.cardId);
        if (tags) playedCardTags.push(...tags);
      }
      for (const decreeId of selectedDecrees) {
        const tags = tagIndex.get(decreeId);
        if (tags) playedCardTags.push(...tags);
      }

      const result = resolveTurn(
        stateWithActions,
        applyActionEffects,
        ctx.state.eventHistory,
        ctx.state.turnHistory,
        playedCardTags,
      );
      const decreeDecisions: MonthDecision[] = selectedDecrees.map((decreeId) => ({
        interactionType: InteractionType.Decree,
        cardId: decreeId,
        choiceId: decreeId,
        month: SeasonMonth.Late,
      }));
      const decisionsForChronicle = [...accumulatedDecisions, ...decreeDecisions];
      ctx.dispatch({ type: 'TURN_RESOLVED', result, decisions: decisionsForChronicle });

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
    monthAllocations,
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
          courtOpportunity={currentAllocation.courtOpportunity ?? null}
          courtHand={ctx.state.gameState.courtHand}
          gameState={ctx.state.gameState}
          onAcceptOpportunity={handleAcceptOpportunity}
          onPlayHandCard={handlePlayHandCard}
          onDiscardHandCard={handleDiscardHandCard}
        />
      )}

      {currentPhase === 'decree' && (
        <DecreePhase
          decreeCards={decreeCards.map((d) => decreeToCard(d))}
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
          compileDossier(n, ctx.state.gameState.espionage, ctx.state.gameState.neighborActions.filter((a) => a.neighborId === n.id), ctx.state.gameState.turn.turnNumber, ctx.state.gameState),
        )}
        situations={compileActiveSituations(ctx.state.gameState)}
        chronicle={ctx.state.chronicle}
        discoveredCombos={ctx.state.gameState.discoveredCombos ?? []}
        council={ctx.state.gameState.council}
        onDismissAdvisor={(seat) => ctx.dispatch({ type: 'DISMISS_ADVISOR', seat })}
        regions={compileRegionSummaries(ctx.state.gameState)}
        onSetRegionalPosture={(regionId, posture) =>
          ctx.dispatch({ type: 'SET_REGIONAL_POSTURE', regionId, posture })
        }
      />
    </div>
  );
}
