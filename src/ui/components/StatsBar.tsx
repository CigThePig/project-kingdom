import { useState, useContext } from 'react';

import { GameContext } from '../../context/game-context';
import { PopulationClass, Season } from '../../engine/types';

const SEASON_LABELS: Record<Season, string> = {
  [Season.Spring]: 'Spring',
  [Season.Summer]: 'Summer',
  [Season.Autumn]: 'Autumn',
  [Season.Winter]: 'Winter',
};

function progressBarColor(value: number): string {
  if (value < 30) return 'var(--color-negative)';
  if (value < 60) return 'var(--color-warning)';
  return 'var(--color-positive)';
}

function averageSatisfaction(population: Record<PopulationClass, { satisfaction: number }>): number {
  const classes = Object.values(population);
  return Math.round(classes.reduce((sum, c) => sum + c.satisfaction, 0) / classes.length);
}

interface StatRow {
  icon: string;
  label: string;
  value: number;
  max: number;
}

export function StatsBar() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('StatsBar must be inside GameProvider');

  const [expanded, setExpanded] = useState(false);
  const { turn, treasury, food, military, stability, faithCulture, population } =
    ctx.state.gameState;

  const loyalty = averageSatisfaction(population);

  const coreStats: StatRow[] = [
    { icon: '\u{1F451}', label: 'Stability', value: stability.value, max: 100 },
    { icon: '\u{1F33E}', label: 'Grain',     value: food.reserves,   max: 500 },
    { icon: '\u{1F4B0}', label: 'Treasury',  value: treasury.balance, max: 2000 },
    { icon: '\u2694\uFE0F', label: 'Military',  value: military.readiness, max: 100 },
  ];

  const extraStats: StatRow[] = [
    { icon: '\u271D\uFE0F', label: 'Faith',   value: faithCulture.faithLevel, max: 100 },
    { icon: '\u2764\uFE0F', label: 'Loyalty', value: loyalty, max: 100 },
  ];

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="w-full cursor-pointer select-none"
      style={{
        background: 'var(--color-bg-parchment)',
        borderRadius: '0 0 12px 12px',
        border: '1px solid var(--color-border-default)',
        borderTop: 'none',
        overflow: 'hidden',
        transition: 'max-height 350ms ease',
        maxHeight: expanded ? 400 : 44,
      }}
    >
      {/* Collapsed row */}
      <div
        className="flex items-center justify-between"
        style={{ height: 44, padding: '0 14px' }}
      >
        <div className="flex items-center gap-4">
          {coreStats.map((s) => (
            <span
              key={s.label}
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {s.icon} {typeof s.value === 'number' ? Math.round(s.value) : s.value}
            </span>
          ))}
        </div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            transition: 'transform 350ms ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          &#9660;
        </span>
      </div>

      {/* Expanded content */}
      <div style={{ padding: '0 14px 14px' }}>
        {[...coreStats, ...extraStats].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3"
            style={{ marginBottom: 8 }}
          >
            <span style={{ width: 22, textAlign: 'center', fontSize: 14 }}>{s.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--color-text-secondary)',
                width: 60,
              }}
            >
              {s.label}
            </span>
            <div
              className="flex-1"
              style={{
                height: 6,
                borderRadius: 3,
                background: 'var(--color-bg-primary)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (Math.max(0, s.value) / s.max) * 100)}%`,
                  borderRadius: 3,
                  background: progressBarColor((s.value / s.max) * 100),
                  transition: 'width 600ms ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                width: 40,
                textAlign: 'right',
              }}
            >
              {Math.round(s.value)}
            </span>
          </div>
        ))}

        {/* Turn / Season / Year */}
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--color-border-default)',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            textAlign: 'center',
          }}
        >
          Turn {turn.turnNumber} &middot; {SEASON_LABELS[turn.season]} &middot; Year {turn.year}
        </div>
      </div>
    </div>
  );
}
