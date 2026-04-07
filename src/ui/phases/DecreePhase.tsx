import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { EffectHint } from '../types';

interface DecreePhaseProps {
  onComplete: (selectedDecrees: string[]) => void;
}

interface DecreeCard {
  id: string;
  title: string;
  body: string;
  effects: EffectHint[];
}

const DECREES: DecreeCard[] = [
  {
    id: 'decree-1',
    title: 'Market Charter',
    body: 'Establish an official market charter granting merchant rights in the capital district.',
    effects: [
      { label: 'Merchants +4', type: 'positive' },
      { label: 'Commoners +2', type: 'positive' },
      { label: '1 Slot', type: 'neutral' },
    ],
  },
  {
    id: 'decree-2',
    title: 'Fortify Borders',
    body: 'Commission new watchtowers and palisades along the northern frontier.',
    effects: [
      { label: 'Military +8', type: 'positive' },
      { label: 'Treasury -60', type: 'negative' },
      { label: '1 Slot', type: 'neutral' },
    ],
  },
  {
    id: 'decree-3',
    title: 'Festival of Plenty',
    body: 'Declare a week of feasting and celebration to lift the spirits of the common folk.',
    effects: [
      { label: 'Commoners +6', type: 'positive' },
      { label: 'Food -30', type: 'negative' },
      { label: '1 Slot', type: 'neutral' },
    ],
  },
  {
    id: 'decree-4',
    title: 'Tax Reform',
    body: 'Restructure the tax code to shift the burden from peasants to the merchant class.',
    effects: [
      { label: 'Commoners +4', type: 'positive' },
      { label: 'Merchants -3', type: 'negative' },
      { label: 'Treasury +20', type: 'positive' },
    ],
  },
];

export function DecreePhase({ onComplete }: DecreePhaseProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
      {DECREES.map((decree, i) => (
        <div
          key={decree.id}
          style={{ animation: `slideUp 400ms ease ${i * 60}ms both` }}
        >
          <Card
            family="decree"
            onClick={() => toggleDecree(decree.id)}
            style={
              selected.has(decree.id)
                ? { borderColor: 'var(--color-accent-decree)' }
                : undefined
            }
          >
            <CardTitle>{decree.title}</CardTitle>
            <CardBody>{decree.body}</CardBody>
            <EffectStrip effects={decree.effects} />
            {selected.has(decree.id) && <SelectionBadge />}
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
