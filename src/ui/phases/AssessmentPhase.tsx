// AssessmentPhase — Visual reskin of CrisisPhase for intelligence assessments.
// Uses advisor (purple) family + ConfidenceIndicator instead of crisis (red).
// Functionally identical: 1 event card + 2-3 response cards, tap to select, confirm.

import { useState } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import { ConfidenceIndicator } from '../components/ConfidenceIndicator';
import type { CrisisPhaseData } from '../../bridge/crisisCardGenerator';
import type { ConfidenceLevel } from '../types';

interface AssessmentPhaseProps {
  assessmentData: CrisisPhaseData;
  confidenceLevel: ConfidenceLevel;
  onComplete: (choiceId: string) => void;
}

export function AssessmentPhase({ assessmentData, confidenceLevel, onComplete }: AssessmentPhaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleResponseClick(id: string) {
    if (selectedId === id) {
      onComplete(id);
    } else {
      setSelectedId(id);
    }
  }

  const { crisisCard, responses } = assessmentData;

  // No choices — acknowledge only
  if (responses.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ animation: 'slideUp 400ms ease both' }}>
          <Card family="advisor">
            <CardTitle>{crisisCard.title}</CardTitle>
            <CardBody>{crisisCard.body}</CardBody>
            <ConfidenceIndicator level={confidenceLevel} />
            <EffectStrip effects={crisisCard.effects} />
          </Card>
        </div>
        <div
          onClick={() => onComplete('acknowledge')}
          style={{
            padding: '12px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-accent-advisor)',
            cursor: 'pointer',
          }}
        >
          ACKNOWLEDGE
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Assessment event card — advisor family (purple) */}
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="advisor">
          <div
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-accent-advisor)',
              marginBottom: 6,
            }}
          >
            INTELLIGENCE ASSESSMENT
          </div>
          <CardTitle>{crisisCard.title}</CardTitle>
          <CardBody>{crisisCard.body}</CardBody>
          <ConfidenceIndicator level={confidenceLevel} />
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
