import { useContext, useState, useEffect } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { GameContext } from '../../context/game-context';
import { MONTH_PHRASES, MONTH_EFFECT_POOLS, MONTH_NAMES } from '../../data/text/month-openings';
import type { EffectHint } from '../types';
import type { AdvisorBriefing } from '../../bridge/advisorGenerator';

interface SeasonDawnProps {
  onComplete: () => void;
  advisorBriefing?: AdvisorBriefing;
}

// Returns a shuffled copy of [0, 1, ..., n-1]
function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SeasonDawn({ onComplete, advisorBriefing }: SeasonDawnProps) {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('SeasonDawn must be inside GameProvider');

  const { month, year } = ctx.state.gameState.turn;

  // Initialized to deterministic defaults; randomized in useEffect (after render)
  // so Math.random() is never called during the render phase.
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [effects, setEffects] = useState<EffectHint[]>([
    MONTH_EFFECT_POOLS[month][0],
    MONTH_EFFECT_POOLS[month][1],
  ]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * 3);
    const order = shuffleIndices(3);
    const pool = MONTH_EFFECT_POOLS[month];
    setPhraseIndex(idx);
    setEffects([pool[order[0]], pool[order[1]]]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const phrase = MONTH_PHRASES[month][phraseIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 400ms ease both' }}>
      <Card family="season">
        <CardTitle>{MONTH_NAMES[month]}, Year {year}</CardTitle>
        <CardBody>{phrase}</CardBody>
        <EffectStrip effects={effects} />

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
