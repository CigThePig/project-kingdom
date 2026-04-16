import type { SignalTag } from '../types';

const TONE_CONFIG: Record<SignalTag['tone'], { color: string; borderColor: string }> = {
  style:       { color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-default)' },
  followup:    { color: 'var(--color-warning)',        borderColor: 'color-mix(in srgb, var(--color-warning) 40%, transparent)' },
  consequence: { color: 'var(--color-text-disabled)',  borderColor: 'var(--color-border-default)' },
};

interface SignalStripProps {
  signals: SignalTag[];
}

export function SignalStrip({ signals }: SignalStripProps) {
  if (signals.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5,
        paddingTop: 8,
        marginTop: 8,
      }}
    >
      {signals.map((signal, i) => {
        const { color, borderColor } = TONE_CONFIG[signal.tone];
        return (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color,
              border: `1px solid ${borderColor}`,
              padding: '2px 6px',
              borderRadius: 4,
              lineHeight: 1.4,
            }}
          >
            {signal.label}
          </span>
        );
      })}
    </div>
  );
}
