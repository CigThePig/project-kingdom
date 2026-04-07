import type { RoundPhase } from '../types';

const PHASES: { key: RoundPhase; label: string }[] = [
  { key: 'seasonDawn', label: 'DAWN' },
  { key: 'crisis',     label: 'COURT' },
  { key: 'petition',   label: 'AUDIENCE' },
  { key: 'decree',     label: 'COUNCIL' },
  { key: 'summary',    label: 'SUMMARY' },
];

interface PhaseIndicatorProps {
  activePhase: RoundPhase;
}

export function PhaseIndicator({ activePhase }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 w-full" style={{ padding: '8px 0' }}>
      {PHASES.map(({ key, label }) => {
        const active = key === activePhase;
        return (
          <span
            key={key}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              padding: '4px 8px',
              borderRadius: 8,
              border: `1px solid ${active ? 'var(--color-accent-response)' : 'var(--color-border-default)'}`,
              background: active ? 'rgba(201, 168, 76, 0.13)' : 'transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
