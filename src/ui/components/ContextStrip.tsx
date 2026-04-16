import type { ContextLine } from '../types';

const TONE_COLORS: Record<ContextLine['tone'], string> = {
  crisis: 'var(--color-negative)',
  pressure: 'var(--color-warning)',
  opportunity: 'var(--color-positive)',
  info: 'var(--color-text-disabled)',
};

interface ContextStripProps {
  lines?: ContextLine[];
}

export function ContextStrip({ lines }: ContextStripProps) {
  if (!lines || lines.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingTop: 10,
        marginTop: 10,
        borderTop: '1px solid color-mix(in srgb, var(--color-border-default) 50%, transparent)',
      }}
    >
      {lines.slice(0, 2).map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 11,
            fontStyle: 'italic',
            color: TONE_COLORS[line.tone],
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
