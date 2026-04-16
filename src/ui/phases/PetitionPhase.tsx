import { useState, useCallback, useEffect, useMemo } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { ContextStrip } from '../components/ContextStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { PetitionCardData } from '../../bridge/petitionCardGenerator';

interface PetitionPhaseProps {
  onComplete: (decisions: { cardId: string; choiceId: string }[]) => void;
  petitionCards?: PetitionCardData[];
}

export function PetitionPhase({ onComplete, petitionCards }: PetitionPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ cardId: string; choiceId: string }[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const petitions = useMemo(() => petitionCards ?? [], [petitionCards]);

  // Auto-complete if there are no petitions
  useEffect(() => {
    if (petitions.length === 0) {
      const timer = setTimeout(() => onComplete([]), 200);
      return () => clearTimeout(timer);
    }
  }, [petitions.length, onComplete]);

  const handleChoiceClick = useCallback(
    (choiceId: string) => {
      if (selectedChoiceId === choiceId) {
        // Second tap — commit
        const petition = petitions[currentIndex];
        const newResults = [...results, { cardId: petition.eventId, choiceId }];

        if (currentIndex >= petitions.length - 1) {
          // All petitions resolved
          setTimeout(() => onComplete(newResults), 400);
        } else {
          setResults(newResults);
          setSelectedChoiceId(null);
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
          }, 400);
        }
      } else {
        // First tap — select
        setSelectedChoiceId(choiceId);
      }
    },
    [selectedChoiceId, currentIndex, results, petitions, onComplete],
  );

  if (petitions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 0',
          fontFamily: 'var(--font-family-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          animation: 'pop 300ms ease both',
        }}
      >
        NO PETITIONS THIS TURN
      </div>
    );
  }

  if (currentIndex >= petitions.length) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 0',
          fontFamily: 'var(--font-family-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          animation: 'pop 300ms ease both',
        }}
      >
        ALL PETITIONS HEARD
      </div>
    );
  }

  const petition = petitions[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Counter */}
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
        PETITION {currentIndex + 1} OF {petitions.length}
      </div>

      {/* Petition event card */}
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="petition">
          <CardTitle>{petition.title}</CardTitle>
          <CardBody>{petition.body}</CardBody>
          <ContextStrip lines={petition.context} />
        </Card>
      </div>

      {/* Response cards — one per authored choice */}
      {petition.allChoices.map((choice, i) => (
        <div
          key={choice.choiceId}
          style={{ animation: `slideUp 400ms ease ${(i + 1) * 80}ms both` }}
        >
          <Card
            family="response"
            onClick={() => handleChoiceClick(choice.choiceId)}
            style={
              selectedChoiceId === choice.choiceId
                ? { borderColor: 'var(--color-accent-petition)' }
                : undefined
            }
          >
            <CardTitle>{choice.title}</CardTitle>
            <EffectStrip effects={choice.effects} />
            {selectedChoiceId === choice.choiceId && <SelectionBadge />}
          </Card>
        </div>
      ))}

      {/* Confirm hint */}
      {selectedChoiceId && (
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
