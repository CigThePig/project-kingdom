import { useState, useCallback } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { useSwipe } from '../hooks/useSwipe';
import type { EffectHint } from '../types';

interface PetitionPhaseProps {
  onComplete: (decisions: { cardId: string; granted: boolean }[]) => void;
}

interface PetitionCard {
  id: string;
  title: string;
  body: string;
  effects: EffectHint[];
}

const PETITIONS: PetitionCard[] = [
  {
    id: 'petition-1',
    title: 'Merchant Guild Request',
    body: 'The merchants seek lower tariffs on eastern trade routes. Granting this would please them greatly.',
    effects: [
      { label: 'Merchants +5', type: 'positive' },
      { label: 'Treasury -20', type: 'negative' },
    ],
  },
  {
    id: 'petition-2',
    title: "Farmers' Appeal",
    body: 'The farming villages request a temporary reduction in grain tax for the coming season.',
    effects: [
      { label: 'Commoners +3', type: 'positive' },
      { label: 'Treasury -15', type: 'negative' },
    ],
  },
];

export function PetitionPhase({ onComplete }: PetitionPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ cardId: string; granted: boolean }[]>([]);
  const [key, setKey] = useState(0);

  const handleDecision = useCallback(
    (granted: boolean) => {
      const petition = PETITIONS[currentIndex];
      const newResults = [...results, { cardId: petition.id, granted }];

      if (currentIndex >= PETITIONS.length - 1) {
        // All petitions resolved
        setTimeout(() => onComplete(newResults), 400);
      } else {
        setResults(newResults);
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setKey((k) => k + 1);
        }, 400);
      }
    },
    [currentIndex, results, onComplete],
  );

  const { ref, handlers } = useSwipe({
    onSwipeLeft: () => handleDecision(false),
    onSwipeRight: () => handleDecision(true),
  });

  if (currentIndex >= PETITIONS.length) {
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

  const petition = PETITIONS[currentIndex];

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
        PETITION {currentIndex + 1} OF {PETITIONS.length}
      </div>

      {/* Swipeable petition card */}
      <div style={{ position: 'relative', minHeight: 180 }}>
        {/* Ghost indicators */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: 0,
            top: 0,
            bottom: 0,
            width: 40,
            color: 'var(--color-negative)',
            fontSize: 20,
            opacity: 0.3,
          }}
        >
          &#10007;
        </div>
        <div
          className="absolute flex items-center justify-center"
          style={{
            right: 0,
            top: 0,
            bottom: 0,
            width: 40,
            color: 'var(--color-positive)',
            fontSize: 20,
            opacity: 0.3,
          }}
        >
          &#10003;
        </div>

        <div
          key={key}
          ref={ref}
          {...handlers}
          style={{ touchAction: 'none' }}
        >
          <Card family="petition">
            <CardTitle>{petition.title}</CardTitle>
            <CardBody>{petition.body}</CardBody>
            <EffectStrip effects={petition.effects} />
          </Card>
        </div>
      </div>

      {/* Swipe hint */}
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
        SWIPE LEFT TO DENY &mdash; RIGHT TO GRANT
      </div>
    </div>
  );
}
