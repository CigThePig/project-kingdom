import { useContext } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { GameContext } from '../../context/game-context';
import { Season } from '../../engine/types';
import type { EffectHint } from '../types';
import type { AdvisorBriefing } from '../../bridge/advisorGenerator';

interface SeasonDawnProps {
  onComplete: () => void;
  advisorBriefing?: AdvisorBriefing;
}

const SEASON_TEXT: Record<Season, string> = {
  [Season.Spring]: 'The frost recedes and new life stirs across the land. Fields are plowed, spirits rise, and the court buzzes with ambition.',
  [Season.Summer]: 'The sun beats down on golden fields. Trade caravans fill the roads and the kingdom hums with industry.',
  [Season.Autumn]: 'Leaves turn amber and the harvest begins. The kingdom prepares stores for the cold months ahead.',
  [Season.Winter]: 'The frost descends. Food consumption rises, and the roads grow treacherous. Plan carefully, Your Majesty.',
};

const SEASON_EFFECTS: Record<Season, EffectHint[]> = {
  [Season.Spring]: [
    { label: 'Food +25%', type: 'positive' },
    { label: 'Morale', type: 'positive' },
  ],
  [Season.Summer]: [
    { label: 'Trade +15%', type: 'positive' },
    { label: 'Food +10%', type: 'positive' },
  ],
  [Season.Autumn]: [
    { label: 'Harvest', type: 'positive' },
    { label: 'Raids?', type: 'warning' },
  ],
  [Season.Winter]: [
    { label: 'Food ×0.5', type: 'warning' },
    { label: 'Trade -20%', type: 'negative' },
  ],
};

export function SeasonDawn({ onComplete, advisorBriefing }: SeasonDawnProps) {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('SeasonDawn must be inside GameProvider');

  const { season, year } = ctx.state.gameState.turn;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 400ms ease both' }}>
      <Card family="season">
        <CardTitle>{season}, Year {year}</CardTitle>
        <CardBody>{SEASON_TEXT[season]}</CardBody>
        <EffectStrip effects={SEASON_EFFECTS[season]} />

        <div
          onClick={onComplete}
          style={{
            marginTop: 16,
            padding: '12px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            cursor: 'pointer',
          }}
        >
          TAP TO BEGIN
        </div>
      </Card>

      {advisorBriefing && advisorBriefing.lines.length > 0 && (
        <Card family="advisor">
          <CardTitle>Advisor Briefing</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
            {advisorBriefing.lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
