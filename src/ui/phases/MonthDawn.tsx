// MonthDawn — Replaces SeasonDawn for the monthly structure.
// Renders month name, atmospheric text, World Pulse lines, effect hints,
// and an optional advisor briefing for Month 1.

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SeasonMonth } from '../../engine/types';
import type { Season } from '../../engine/types';
import { SEASON_MONTHS } from '../../engine/constants';
import { THEMATIC_MONTH_NAMES } from '../../data/text/month-names';
import { MONTH_PHRASES, MONTH_EFFECT_POOLS, MONTH_TRANSITION_PHRASES } from '../../data/text/month-openings';
import type { AdvisorBriefing } from '../../bridge/advisorGenerator';
import type { WorldPulseLine, EffectHint } from '../types';

/**
 * Maps Season + SeasonMonth to the calendar month (1-12) used by MONTH_PHRASES.
 */
function calendarMonthForSeasonMonth(season: Season, seasonMonth: SeasonMonth): number {
  return SEASON_MONTHS[season][seasonMonth - 1]; // SeasonMonth.Early=1 → index 0
}

interface MonthDawnProps {
  seasonMonth: SeasonMonth;
  season: Season;
  year: number;
  worldPulseLines: WorldPulseLine[];
  advisorBriefing?: AdvisorBriefing;
  /** Index (0–2) for Month 1 phrases, (0–1) for Month 2-3 transition phrases */
  phraseIndex: number;
  /** Shuffled indices into the month's effect pool */
  effectOrder: [number, number, number];
  onComplete: () => void;
}

export function MonthDawn({
  seasonMonth,
  season,
  year,
  worldPulseLines,
  advisorBriefing,
  phraseIndex,
  effectOrder,
  onComplete,
}: MonthDawnProps) {
  const calendarMonth = calendarMonthForSeasonMonth(season, seasonMonth);
  const monthName = THEMATIC_MONTH_NAMES[season]?.[seasonMonth] ?? `Month ${calendarMonth}`;
  const pool = MONTH_EFFECT_POOLS[calendarMonth];

  // Month 1: full atmospheric phrase; Months 2-3: shorter transition phrase
  let atmosphericText: string;
  if (seasonMonth === SeasonMonth.Early) {
    const phrases = MONTH_PHRASES[calendarMonth];
    atmosphericText = phrases?.[phraseIndex % 3] ?? '';
  } else {
    const transitions = MONTH_TRANSITION_PHRASES[calendarMonth];
    atmosphericText = transitions?.[phraseIndex % 2] ?? '';
  }

  // Pick 2 of 3 effects based on shuffled order
  const effects: EffectHint[] = pool
    ? [pool[effectOrder[0]], pool[effectOrder[1]]]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 400ms ease both' }}>
      <Card family="season">
        <CardTitle>{monthName}, Year {year}</CardTitle>
        <CardBody>{atmosphericText}</CardBody>

        {/* World Pulse lines */}
        {worldPulseLines.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {worldPulseLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                  opacity: 0.85,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        )}

        <EffectStrip effects={effects} />

        <button
          onClick={onComplete}
          style={{
            marginTop: 16,
            padding: '12px 0',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
        >
          TAP TO BEGIN
        </button>
      </Card>

      {/* Advisor briefing — Month 1 only */}
      {advisorBriefing && advisorBriefing.lines.length > 0 && (
        <div style={{ animation: 'slideUp 400ms ease 100ms both' }}>
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
        </div>
      )}
    </div>
  );
}
