// Codex — Reign Chronicle Card
// Single card with scrollable reverse-chronological list of chronicle entries.

import type { ChronicleEntry } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';

interface ReignChronicleCardsProps {
  entries: ChronicleEntry[];
}

export function ReignChronicleCards({ entries }: ReignChronicleCardsProps) {
  if (entries.length === 0) {
    return (
      <Card family="legacy">
        <CardTitle>Reign Chronicle</CardTitle>
        <div
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            marginTop: 8,
          }}
        >
          The chronicle awaits your reign&apos;s first notable event.
        </div>
      </Card>
    );
  }

  // Reverse chronological (newest at top)
  const reversed = [...entries].reverse();

  return (
    <Card family="legacy">
      <CardTitle>Reign Chronicle</CardTitle>
      <div
        style={{
          marginTop: 12,
          maxHeight: 400,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {reversed.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              paddingBottom: 8,
              borderBottom: i < reversed.length - 1 ? '1px solid var(--color-border-default)' : undefined,
            }}
          >
            {/* Protected milestone star */}
            <span
              style={{
                fontSize: 12,
                width: 16,
                flexShrink: 0,
                textAlign: 'center',
                color: entry.isProtected ? 'var(--color-warning)' : 'transparent',
              }}
            >
              {entry.isProtected ? '\u2605' : ''}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.4,
                }}
              >
                {entry.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
