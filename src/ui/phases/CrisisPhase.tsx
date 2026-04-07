import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { EffectHint } from '../types';

interface CrisisPhaseProps {
  onComplete: (crisisResponse: string) => void;
}

interface ResponseCard {
  id: string;
  title: string;
  body: string;
  effects: EffectHint[];
}

const CRISIS = {
  title: 'Border Incursion',
  body: 'Raiders from the northern marches have crossed the border in force. Villages burn and your captains await orders. How will the crown respond?',
  effects: [
    { label: 'Military -10', type: 'negative' as const },
    { label: 'Stability', type: 'warning' as const },
  ],
};

const RESPONSES: ResponseCard[] = [
  {
    id: 'crisis-resp-1',
    title: 'Mobilize the Garrison',
    body: 'Send the border garrison to intercept. Swift action, but costly.',
    effects: [
      { label: 'Treasury -80', type: 'negative' },
      { label: 'Military +15', type: 'positive' },
    ],
  },
  {
    id: 'crisis-resp-2',
    title: 'Rally the Militia',
    body: 'Call upon the local peasantry to defend their homes. Cheap but risky.',
    effects: [
      { label: 'Commoners -5', type: 'negative' },
      { label: 'Military +5', type: 'positive' },
    ],
  },
  {
    id: 'crisis-resp-3',
    title: 'Negotiate Terms',
    body: 'Send an envoy to parley with the raiders. Perhaps gold will satisfy them.',
    effects: [
      { label: 'Treasury -40', type: 'negative' },
      { label: 'Stability +3', type: 'positive' },
    ],
  },
];

export function CrisisPhase({ onComplete }: CrisisPhaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleResponseClick(id: string) {
    if (selectedId === id) {
      onComplete(id);
    } else {
      setSelectedId(id);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Crisis card */}
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="crisis">
          <CardTitle>{CRISIS.title}</CardTitle>
          <CardBody>{CRISIS.body}</CardBody>
          <EffectStrip effects={CRISIS.effects} />
        </Card>
      </div>

      {/* Response cards */}
      {RESPONSES.map((resp, i) => (
        <div
          key={resp.id}
          style={{ animation: `slideUp 400ms ease ${(i + 1) * 80}ms both` }}
        >
          <Card
            family="response"
            onClick={() => handleResponseClick(resp.id)}
            style={
              selectedId === resp.id
                ? { borderColor: 'var(--color-accent-response)' }
                : undefined
            }
          >
            <CardTitle>{resp.title}</CardTitle>
            <CardBody>{resp.body}</CardBody>
            <EffectStrip effects={resp.effects} />
            {selectedId === resp.id && <SelectionBadge />}
          </Card>
        </div>
      ))}

      {/* Confirm hint */}
      {selectedId && (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            animation: 'pop 300ms ease both',
          }}
        >
          TAP AGAIN TO CONFIRM
        </div>
      )}
    </div>
  );
}
