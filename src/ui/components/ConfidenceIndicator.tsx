import type { ConfidenceLevel } from '../types';

const LEVEL_FILLS: Record<ConfidenceLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
};

const LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  low: 'Low Confidence',
  moderate: 'Moderate Confidence',
  high: 'High Confidence',
};

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
}

export function ConfidenceIndicator({ level }: ConfidenceIndicatorProps) {
  const filled = LEVEL_FILLS[level];

  return (
    <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 14,
              borderRadius: 2,
              background:
                i < filled
                  ? 'var(--color-accent-advisor)'
                  : 'var(--color-border-default)',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'var(--color-accent-advisor)',
        }}
      >
        {LEVEL_LABELS[level]}
      </span>
    </div>
  );
}
