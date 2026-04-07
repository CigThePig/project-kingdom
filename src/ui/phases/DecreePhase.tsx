import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { DecreeCardData } from '../../bridge/decreeCardGenerator';

interface DecreePhaseProps {
  onComplete: (selectedDecrees: string[]) => void;
  decreeCards?: DecreeCardData[];
}

export function DecreePhase({ onComplete, decreeCards }: DecreePhaseProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const decrees = decreeCards ?? [];

  function toggleDecree(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
        }}
      >
        ISSUE UP TO 3 DECREES &mdash; {selected.size} SELECTED
      </div>

      {/* Decree cards */}
      {decrees.map((decree, i) => (
        <div
          key={decree.decreeId}
          style={{ animation: `slideUp 400ms ease ${i * 60}ms both` }}
        >
          <Card
            family="decree"
            onClick={() => toggleDecree(decree.decreeId)}
            style={
              selected.has(decree.decreeId)
                ? { borderColor: 'var(--color-accent-decree)' }
                : undefined
            }
          >
            <CardTitle>{decree.title}</CardTitle>
            <CardBody>{decree.body}</CardBody>
            <EffectStrip effects={decree.effects} />
            {selected.has(decree.decreeId) && <SelectionBadge />}
          </Card>
        </div>
      ))}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 4,
        }}
      >
        <div
          onClick={() => onComplete([])}
          style={{
            padding: '10px 20px',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            cursor: 'pointer',
          }}
        >
          SKIP
        </div>

        {selected.size > 0 && (
          <div
            onClick={() => onComplete(Array.from(selected))}
            style={{
              padding: '10px 20px',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-accent-decree)',
              cursor: 'pointer',
              animation: 'pop 300ms ease both',
            }}
          >
            CONFIRM DECREES
          </div>
        )}
      </div>
    </div>
  );
}
