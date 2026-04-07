import { useState, useContext, useCallback, useEffect } from 'react';

import { StatsBar } from './components/StatsBar';
import { PhaseIndicator } from './components/PhaseIndicator';
import { SeasonDawn } from './phases/SeasonDawn';
import { CrisisPhase } from './phases/CrisisPhase';
import { PetitionPhase } from './phases/PetitionPhase';
import { DecreePhase } from './phases/DecreePhase';
import { SummaryPhase } from './phases/SummaryPhase';
import { GameContext } from '../context/game-context';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { surfaceEvents } from '../engine/events/event-engine';
import { EVENT_POOL } from '../data/events/index';
import type { ActiveEvent, GameState } from '../engine/types';
import type { RoundPhase, PhaseDecisions } from './types';
import { partitionEvents } from '../bridge/eventClassifier';
import { generateCrisisPhaseData } from '../bridge/crisisCardGenerator';
import type { CrisisPhaseData } from '../bridge/crisisCardGenerator';
import { generatePetitionCards } from '../bridge/petitionCardGenerator';
import type { PetitionCardData } from '../bridge/petitionCardGenerator';
import { generateDecreeCards } from '../bridge/decreeCardGenerator';
import type { DecreeCardData } from '../bridge/decreeCardGenerator';
import { generateAdvisorBriefing } from '../bridge/advisorGenerator';
import type { AdvisorBriefing } from '../bridge/advisorGenerator';
import { generateSummaryData } from '../bridge/summaryGenerator';
import type { SummaryData } from '../bridge/summaryGenerator';
import { mapDecisionsToActions } from '../bridge/decisionMapper';

const PHASE_ORDER: RoundPhase[] = ['seasonDawn', 'crisis', 'petition', 'decree', 'summary'];

const INITIAL_DECISIONS: PhaseDecisions = {
  crisisResponse: null,
  petitionDecisions: [],
  selectedDecrees: [],
};

export function RoundController() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('RoundController must be inside GameProvider');

  const [currentPhase, setCurrentPhase] = useState<RoundPhase>('seasonDawn');
  const [decisions, setDecisions] = useState<PhaseDecisions>(INITIAL_DECISIONS);

  // Bridge data for this round
  const [surfacedEvents, setSurfacedEvents] = useState<ActiveEvent[]>([]);
  const [crisisData, setCrisisData] = useState<CrisisPhaseData | null>(null);
  const [petitionCards, setPetitionCards] = useState<PetitionCardData[]>([]);
  const [decreeCards, setDecreeCards] = useState<DecreeCardData[]>([]);
  const [advisorBriefing, setAdvisorBriefing] = useState<AdvisorBriefing | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  // Pre-generate card pools when the season dawn phase begins
  useEffect(() => {
    if (currentPhase === 'seasonDawn') {
      prepareRound(ctx.state.gameState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase]);

  function prepareRound(gameState: GameState) {
    const events = surfaceEvents(
      gameState,
      gameState.turn.turnNumber,
      EVENT_POOL,
      gameState.activeEvents,
      [],
    );
    setSurfacedEvents(events);

    const { crisisEvents, petitionEvents } = partitionEvents(events);

    const firstCrisis = crisisEvents[0] ?? null;
    const crisis = firstCrisis ? generateCrisisPhaseData(firstCrisis) : null;
    setCrisisData(crisis);
    setPetitionCards(generatePetitionCards(petitionEvents));
    setDecreeCards(generateDecreeCards(gameState));
    setAdvisorBriefing(generateAdvisorBriefing(gameState));
    setSummaryData(null);
  }

  const advancePhase = useCallback(
    (phaseDecisions?: Partial<PhaseDecisions>) => {
      setDecisions((prev: PhaseDecisions) => {
        const updated = phaseDecisions ? { ...prev, ...phaseDecisions } : prev;

        const currentIndex = PHASE_ORDER.indexOf(currentPhase);
        if (currentIndex < PHASE_ORDER.length - 1) {
          const nextPhase = PHASE_ORDER[currentIndex + 1];

          // Generate summary data when transitioning to summary phase
          if (nextPhase === 'summary') {
            const finalDecisions = updated;
            const prevStyle = ctx.state.gameState.rulingStyle;
            setSummaryData(
              generateSummaryData(finalDecisions, crisisData, petitionCards, prevStyle, prevStyle),
            );
          }

          setCurrentPhase(nextPhase);
        }

        return updated;
      });
    },
    [currentPhase, crisisData, petitionCards, ctx.state.gameState.rulingStyle],
  );

  const handleRoundComplete = useCallback(() => {
    try {
      const actions = mapDecisionsToActions(decisions, crisisData, petitionCards, decreeCards);
      const totalSlots = actions.reduce((sum, a) => sum + a.slotCost, 0);

      const stateWithActions: GameState = {
        ...ctx.state.gameState,
        activeEvents: [
          ...ctx.state.gameState.activeEvents,
          ...surfacedEvents,
        ],
        actionBudget: {
          ...ctx.state.gameState.actionBudget,
          queuedActions: actions,
          slotsUsed: totalSlots,
          slotsRemaining: Math.max(
            0,
            ctx.state.gameState.actionBudget.slotsTotal - totalSlots,
          ),
        },
      };

      const result = resolveTurn(stateWithActions, (s) => s, ctx.state.eventHistory);
      ctx.dispatch({ type: 'TURN_RESOLVED', result });
    } catch (err) {
      console.error('Turn resolution error:', err);
    }

    setCurrentPhase('seasonDawn');
    setDecisions(INITIAL_DECISIONS);
    setSurfacedEvents([]);
  }, [ctx, decisions, crisisData, petitionCards, decreeCards, surfacedEvents]);

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
      <StatsBar />
      <PhaseIndicator activePhase={currentPhase} />

      {currentPhase === 'seasonDawn' && (
        <SeasonDawn
          advisorBriefing={advisorBriefing ?? undefined}
          onComplete={() => advancePhase()}
        />
      )}
      {currentPhase === 'crisis' && (
        <CrisisPhase
          crisisData={crisisData ?? undefined}
          onComplete={(response) => advancePhase({ crisisResponse: response })}
        />
      )}
      {currentPhase === 'petition' && (
        <PetitionPhase
          petitionCards={petitionCards}
          onComplete={(petitionDecisions) => advancePhase({ petitionDecisions })}
        />
      )}
      {currentPhase === 'decree' && (
        <DecreePhase
          decreeCards={decreeCards}
          onComplete={(selectedDecrees) => advancePhase({ selectedDecrees })}
        />
      )}
      {currentPhase === 'summary' && (
        <SummaryPhase
          decisions={decisions}
          summaryData={summaryData ?? undefined}
          onComplete={handleRoundComplete}
        />
      )}
    </div>
  );
}
