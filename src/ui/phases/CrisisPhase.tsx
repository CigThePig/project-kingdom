import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { ContextStrip } from '../components/ContextStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';

interface CrisisPhaseProps {
  onComplete: (crisisResponse: string) => void;
  crisisData?: CrisisPhaseData;
}

export function CrisisPhase({ onComplete, crisisData }: CrisisPhaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleResponseClick(id: string) {
    if (selectedId === id) {
      onComplete(id);
    } else {
      setSelectedId(id);
    }
  }

  // No crisis this turn — show a tappable peaceful court card
  if (!crisisData) {
    return (
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="crisis">
          <CardTitle>Morning Court — Peaceful</CardTitle>
          <CardBody>No urgent matters reach the throne this morning. The court is quiet, the kingdom at ease.</CardBody>
          <button
            onClick={() => onComplete('no-crisis')}
            style={{
              marginTop: 16,
              padding: '12px 0',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-accent-response)',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >
            CONTINUE
          </button>
        </Card>
      </div>
    );
  }

  const { crisisCard, responses } = crisisData;

  // Fallback: if event has no choices, show a single acknowledge button
  if (responses.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ animation: 'slideUp 400ms ease both' }}>
          <Card family="crisis">
            <CardTitle>{crisisCard.title}</CardTitle>
            <CardBody>{crisisCard.body}</CardBody>
            <ContextStrip lines={crisisCard.context} />
            <EffectStrip effects={crisisCard.effects} />
          </Card>
        </div>
        <button
          onClick={() => onComplete('acknowledge')}
          style={{
            padding: '12px 0',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-accent-response)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
        >
          ACKNOWLEDGE
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Crisis card */}
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="crisis">
          <CardTitle>{crisisCard.title}</CardTitle>
          <CardBody>{crisisCard.body}</CardBody>
          <ContextStrip lines={crisisCard.context} />
          <EffectStrip effects={crisisCard.effects} />
        </Card>
      </div>

      {/* Response cards */}
      {responses.map((resp, i) => (
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
