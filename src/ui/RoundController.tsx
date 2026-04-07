import { useState, useContext, useCallback } from 'react';

import { StatsBar } from './components/StatsBar';
import { PhaseIndicator } from './components/PhaseIndicator';
import { SeasonDawn } from './phases/SeasonDawn';
import { CrisisPhase } from './phases/CrisisPhase';
import { PetitionPhase } from './phases/PetitionPhase';
import { DecreePhase } from './phases/DecreePhase';
import { SummaryPhase } from './phases/SummaryPhase';
import { GameContext } from '../context/game-context';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import type { RoundPhase, PhaseDecisions } from './types';

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

  const advancePhase = useCallback(
    (phaseDecisions?: Partial<PhaseDecisions>) => {
      if (phaseDecisions) {
        setDecisions((prev) => ({ ...prev, ...phaseDecisions }));
      }
      const currentIndex = PHASE_ORDER.indexOf(currentPhase);
      if (currentIndex < PHASE_ORDER.length - 1) {
        setCurrentPhase(PHASE_ORDER[currentIndex + 1]);
      }
    },
    [currentPhase],
  );

  const handleRoundComplete = useCallback(() => {
    try {
      const result = resolveTurn(
        ctx.state.gameState,
        (s) => s,
        ctx.state.eventHistory,
      );
      ctx.dispatch({ type: 'TURN_RESOLVED', result });
    } catch (err) {
      console.error('Turn resolution error:', err);
    }

    setCurrentPhase('seasonDawn');
    setDecisions(INITIAL_DECISIONS);
  }, [ctx]);

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
        <SeasonDawn onComplete={() => advancePhase()} />
      )}
      {currentPhase === 'crisis' && (
        <CrisisPhase
          onComplete={(response) => advancePhase({ crisisResponse: response })}
        />
      )}
      {currentPhase === 'petition' && (
        <PetitionPhase
          onComplete={(petitionDecisions) =>
            advancePhase({ petitionDecisions })
          }
        />
      )}
      {currentPhase === 'decree' && (
        <DecreePhase
          onComplete={(selectedDecrees) => advancePhase({ selectedDecrees })}
        />
      )}
      {currentPhase === 'summary' && (
        <SummaryPhase decisions={decisions} onComplete={handleRoundComplete} />
      )}
    </div>
  );
}
