import type { EffectHint } from '../types';

const TYPE_CONFIG: Record<EffectHint['type'], { color: string; prefix: string }> = {
  positive: { color: 'var(--color-positive)', prefix: '+' },
  negative: { color: 'var(--color-negative)', prefix: '-' },
  warning:  { color: 'var(--color-warning)',  prefix: '?' },
  neutral:  { color: 'var(--color-neutral)',  prefix: '' },
};

interface EffectStripProps {
  effects: EffectHint[];
}

export function EffectStrip({ effects }: EffectStripProps) {
  if (effects.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        paddingTop: 12,
        marginTop: 12,
        borderTop: '1px solid var(--color-border-default)',
      }}
    >
      {effects.map((effect, i) => {
        const { color, prefix } = TYPE_CONFIG[effect.type];
        return (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              fontWeight: 600,
              color,
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            {prefix && `${prefix} `}
            {effect.label}
          </span>
        );
      })}
    </div>
  );
}
