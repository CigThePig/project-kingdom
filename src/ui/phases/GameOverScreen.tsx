import { useContext } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { GameContext } from '../../context/game-context';
import { PopulationClass } from '../../engine/types';
import type { FailureCondition } from '../../engine/types';
import {
  GAME_OVER_TITLE,
  GAME_OVER_ASSESSMENT_TITLE,
  GAME_OVER_NEW_GAME_LABEL,
  GAME_OVER_TURNS_LABEL,
  GAME_OVER_TREASURY_LABEL,
  GAME_OVER_FOOD_LABEL,
  GAME_OVER_STABILITY_LABEL,
  GAME_OVER_POPULATION_LABEL,
  FAILURE_CONDITION_LABELS,
  FAILURE_WARNING_MESSAGES,
} from '../../data/text/labels';

interface GameOverScreenProps {
  onNewGame: () => void;
}

function totalPopulation(population: Record<PopulationClass, { population: number }>): number {
  return Object.values(population).reduce((sum, c) => sum + c.population, 0);
}

export function GameOverScreen({ onNewGame }: GameOverScreenProps) {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('GameOverScreen must be inside GameProvider');

  const { gameState, gameOverConditions } = ctx.state;
  const primaryCondition = gameOverConditions[0];
  const conditionLabel = primaryCondition ? FAILURE_CONDITION_LABELS[primaryCondition] : 'Unknown';
  const conditionMessage = primaryCondition
    ? FAILURE_WARNING_MESSAGES[primaryCondition]?.critical
    : 'Your reign has come to an end.';

  const stats: Array<{ label: string; value: string }> = [
    { label: GAME_OVER_TURNS_LABEL, value: String(gameState.turn.turnNumber) },
    { label: GAME_OVER_TREASURY_LABEL, value: String(gameState.treasury.balance) },
    { label: GAME_OVER_FOOD_LABEL, value: String(gameState.food.reserves) },
    { label: GAME_OVER_STABILITY_LABEL, value: String(gameState.stability.value) },
    { label: GAME_OVER_POPULATION_LABEL, value: String(totalPopulation(gameState.population)) },
  ];

  const conditionEffects = gameOverConditions.map((c: FailureCondition) => ({
    label: FAILURE_CONDITION_LABELS[c],
    type: 'negative' as const,
  }));

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: '0 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'slideUp 400ms ease both',
      }}
    >
      {/* Failure card */}
      <Card family="crisis">
        <CardTitle>{GAME_OVER_TITLE}</CardTitle>
        <CardBody>
          {conditionMessage}
        </CardBody>
        <EffectStrip effects={conditionEffects} />
      </Card>

      {/* Reign assessment card */}
      <Card family="summary">
        <CardTitle>{GAME_OVER_ASSESSMENT_TITLE}</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-family-mono)',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)', letterSpacing: 1 }}>
                {stat.label}
              </span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        <EffectStrip
          effects={[
            { label: `Year ${gameState.turn.year}`, type: 'neutral' },
            { label: conditionLabel, type: 'negative' },
          ]}
        />
      </Card>

      {/* New game button */}
      <button
        onClick={onNewGame}
        style={{
          marginTop: 4,
          padding: '12px 0',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-family-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-accent-response)',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
        }}
      >
        {GAME_OVER_NEW_GAME_LABEL}
      </button>
    </div>
  );
}
