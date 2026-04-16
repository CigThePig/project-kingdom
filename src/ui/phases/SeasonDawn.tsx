import { useContext } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { ContextStrip } from '../components/ContextStrip';
import { GameContext } from '../../context/game-context';
import { MONTH_PHRASES, MONTH_EFFECT_POOLS, MONTH_NAMES, MONTH_SEASON_LABELS } from '../../data/text/month-openings';
import type { AdvisorBriefing } from '../../bridge/advisorGenerator';

interface SeasonDawnProps {
  onComplete: () => void;
  advisorBriefing?: AdvisorBriefing;
  /** Index (0–2) into the month's phrase array, computed by RoundController */
  phraseIndex: number;
  /** Shuffled indices into the month's effect pool, computed by RoundController */
  effectOrder: [number, number, number];
}

export function SeasonDawn({ onComplete, advisorBriefing, phraseIndex, effectOrder }: SeasonDawnProps) {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('SeasonDawn must be inside GameProvider');

  const { month, year } = ctx.state.gameState.turn;
  const pool = MONTH_EFFECT_POOLS[month];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 400ms ease both' }}>
      <Card family="season">
        <CardTitle>{MONTH_NAMES[month]} — {MONTH_SEASON_LABELS[month]}, Year {year}</CardTitle>
        <CardBody>{MONTH_PHRASES[month][phraseIndex]}</CardBody>
        <EffectStrip effects={[pool[effectOrder[0]], pool[effectOrder[1]]]} />

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
          <ContextStrip lines={advisorBriefing.statusBadges} maxLines={4} />
        </Card>
      )}
    </div>
  );
}
