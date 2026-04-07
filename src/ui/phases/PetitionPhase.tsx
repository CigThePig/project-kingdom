import { useState, useCallback, useEffect } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { useSwipe } from '../hooks/useSwipe';
import type { PetitionCardData } from '../../bridge/petitionCardGenerator';

interface PetitionPhaseProps {
  onComplete: (decisions: { cardId: string; granted: boolean }[]) => void;
  petitionCards?: PetitionCardData[];
}

export function PetitionPhase({ onComplete, petitionCards }: PetitionPhaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ cardId: string; granted: boolean }[]>([]);
  const [key, setKey] = useState(0);

  const petitions = petitionCards ?? [];

  // Auto-complete if there are no petitions
  useEffect(() => {
    if (petitions.length === 0) {
      const timer = setTimeout(() => onComplete([]), 200);
      return () => clearTimeout(timer);
    }
  }, [petitions.length, onComplete]);

  const handleDecision = useCallback(
    (granted: boolean) => {
      const petition = petitions[currentIndex];
      const newResults = [...results, { cardId: petition.eventId, granted }];

      if (currentIndex >= petitions.length - 1) {
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
    [currentIndex, results, petitions, onComplete],
  );

  const { ref, handlers } = useSwipe({
    onSwipeLeft: () => handleDecision(false),
    onSwipeRight: () => handleDecision(true),
  });

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
            <EffectStrip effects={petition.grantEffects} />
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
