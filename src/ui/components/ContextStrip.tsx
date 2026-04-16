import type { ContextLine } from '../types';

const TONE_COLORS: Record<ContextLine['tone'], string> = {
  crisis: 'var(--color-negative)',
  pressure: 'var(--color-warning)',
  opportunity: 'var(--color-positive)',
  info: 'var(--color-text-disabled)',
};

interface ContextStripProps {
  lines?: ContextLine[];
  /** Maximum number of context lines to display. Default: 2. */
  maxLines?: number;
}

export function ContextStrip({ lines, maxLines = 2 }: ContextStripProps) {
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
      {lines.slice(0, maxLines).map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 11,
            fontStyle: 'italic',
            color: TONE_COLORS[line.tone],
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: maxLines <= 2 ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
