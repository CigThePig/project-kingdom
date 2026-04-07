import { useContext } from 'react';

import { GameContext } from './context/game-context';
import { Season } from './engine/types';

const SEASON_LABELS: Record<Season, string> = {
  [Season.Spring]: 'Spring',
  [Season.Summer]: 'Summer',
  [Season.Autumn]: 'Autumn',
  [Season.Winter]: 'Winter',
};

export function App() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('App must be wrapped in GameProvider');

  const { turn, treasury, food, military, stability } = ctx.state.gameState;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: '64px 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* Placeholder card */}
      <div
        style={{
          width: '100%',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          padding: '20px 18px',
          boxShadow: 'var(--shadow-card-default)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideUp 400ms ease both',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, var(--color-accent-response), var(--color-accent-legacy))',
          }}
        />

        {/* Family badge */}
        <div
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase' as const,
            color: 'var(--color-accent-response)',
            marginBottom: 16,
          }}
        >
          CROWN & COUNCIL
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--color-text-primary)',
            margin: '0 0 12px',
          }}
        >
          Engine Loaded
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 13.5,
            fontWeight: 400,
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
            margin: '0 0 20px',
          }}
        >
          The simulation engine is running. All {11} system modules are active.
          The card-based interface will be built in Phase 2.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            padding: '12px 0',
            borderTop: '1px solid var(--color-border-default)',
          }}
        >
          {[
            { label: 'TURN', value: turn.turnNumber },
            { label: 'SEASON', value: SEASON_LABELS[turn.season] },
            { label: 'GOLD', value: treasury.balance },
            { label: 'GRAIN', value: food.reserves },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-text-disabled)',
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            paddingTop: 8,
          }}
        >
          {[
            { label: 'STABILITY', value: stability.value },
            { label: 'MILITARY', value: military.readiness },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-text-disabled)',
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--color-border-default), transparent)',
          }}
        />
      </div>
    </div>
  );
}
