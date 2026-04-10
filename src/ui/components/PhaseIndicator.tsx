import { SeasonMonth } from '../../engine/types';
import type { MonthPhase } from '../types';

interface PhaseIndicatorProps {
  currentMonth: SeasonMonth;
  currentPhase: MonthPhase;
}

const MONTH_LABELS = ['M1', 'M2', 'M3'] as const;

/**
 * Determines whether a month pill should appear active, completed, or inactive.
 */
function getMonthStatus(
  monthIndex: number,
  currentMonth: SeasonMonth,
): 'active' | 'completed' | 'inactive' {
  const currentIdx = currentMonth - 1; // SeasonMonth is 1-based
  if (monthIndex < currentIdx) return 'completed';
  if (monthIndex === currentIdx) return 'active';
  return 'inactive';
}

export function PhaseIndicator({ currentMonth, currentPhase }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 w-full" style={{ padding: '8px 0' }}>
      {MONTH_LABELS.map((label, i) => {
        const status = getMonthStatus(i, currentMonth);
        const isActive = status === 'active';
        const isCompleted = status === 'completed';

        return (
          <span
            key={label}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 8,
              border: `1px solid ${
                isActive
                  ? 'var(--color-accent-response)'
                  : isCompleted
                    ? 'var(--color-accent-decree)'
                    : 'var(--color-border-default)'
              }`,
              background: isActive
                ? 'rgba(201, 168, 76, 0.13)'
                : isCompleted
                  ? 'rgba(74, 122, 58, 0.1)'
                  : 'transparent',
              color: isActive
                ? 'var(--color-text-primary)'
                : isCompleted
                  ? 'var(--color-accent-decree)'
                  : 'var(--color-text-disabled)',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </span>
        );
      })}

      {/* Month 3 extra phase pips: Council + Summary */}
      {currentMonth === SeasonMonth.Late && (
        <>
          {(['decree', 'summary'] as const).map((phase) => {
            const phaseLabel = phase === 'decree' ? 'COUNCIL' : 'SUMMARY';
            const phaseActive = currentPhase === phase;
            const phaseCompleted =
              (phase === 'decree' && currentPhase === 'summary');

            return (
              <span
                key={phase}
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  padding: '3px 6px',
                  borderRadius: 6,
                  border: `1px solid ${
                    phaseActive
                      ? 'var(--color-accent-response)'
                      : phaseCompleted
                        ? 'var(--color-accent-decree)'
                        : 'var(--color-border-default)'
                  }`,
                  background: phaseActive
                    ? 'rgba(201, 168, 76, 0.13)'
                    : 'transparent',
                  color: phaseActive
                    ? 'var(--color-text-primary)'
                    : phaseCompleted
                      ? 'var(--color-accent-decree)'
                      : 'var(--color-text-disabled)',
                  transition: 'all 0.2s ease',
                }}
              >
                {phaseLabel}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}
