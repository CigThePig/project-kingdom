import { useState, useCallback } from 'react';

import { Card } from './ui/components/Card';
import { CardTitle } from './ui/components/CardTitle';
import { CardBody } from './ui/components/CardBody';
import { EffectStrip } from './ui/components/EffectStrip';
import { SelectionBadge } from './ui/components/SelectionBadge';
import { ConfidenceIndicator } from './ui/components/ConfidenceIndicator';
import { StatsBar } from './ui/components/StatsBar';
import { PhaseIndicator } from './ui/components/PhaseIndicator';
import { useSwipe } from './ui/hooks/useSwipe';
import type { CardFamily, EffectHint } from './ui/types';

// ============================================================
// Demo data
// ============================================================

const CARD_DEMOS: {
  family: CardFamily;
  title: string;
  body: string;
  effects: EffectHint[];
}[] = [
  {
    family: 'crisis',
    title: 'Border Incursion',
    body: 'Raiders from the northern marches have crossed the border. Your captains await orders.',
    effects: [
      { label: 'Military -10', type: 'negative' },
      { label: 'Stability', type: 'warning' },
    ],
  },
  {
    family: 'response',
    title: 'Mobilize the Garrison',
    body: 'Send the border garrison to intercept. Swift action, but costly.',
    effects: [
      { label: 'Treasury -80', type: 'negative' },
      { label: 'Military +15', type: 'positive' },
    ],
  },
  {
    family: 'petition',
    title: 'Merchant Guild Request',
    body: 'The merchants seek lower tariffs on eastern trade routes. Granting this would please them greatly.',
    effects: [
      { label: 'Merchants +5', type: 'positive' },
      { label: 'Treasury -20', type: 'negative' },
    ],
  },
  {
    family: 'decree',
    title: 'Market Charter',
    body: 'Establish an official market charter granting merchant rights in the capital district.',
    effects: [
      { label: 'Merchants +4', type: 'positive' },
      { label: 'Commoners +2', type: 'positive' },
      { label: '1 Slot', type: 'neutral' },
    ],
  },
  {
    family: 'advisor',
    title: 'Spymaster\u2019s Report',
    body: 'Our agents report Lord Ashford masses troops at the border. His intentions remain unclear.',
    effects: [{ label: 'Intelligence', type: 'warning' }],
  },
  {
    family: 'legacy',
    title: 'The Iron-Fisted',
    body: 'Your reign has become known for its uncompromising authority. The people fear you \u2014 but they obey.',
    effects: [
      { label: 'Authority +30', type: 'positive' },
      { label: 'Loyalty -5', type: 'negative' },
    ],
  },
  {
    family: 'status',
    title: 'Kingdom Overview',
    body: 'The realm endures. Granaries are half-full and the treasury holds steady.',
    effects: [
      { label: 'Stable', type: 'neutral' },
      { label: 'Grain OK', type: 'positive' },
    ],
  },
  {
    family: 'season',
    title: 'Winter, Year 3',
    body: 'The frost descends. Food consumption rises, and the roads grow treacherous. Plan carefully.',
    effects: [
      { label: 'Food \u00D70.5', type: 'warning' },
      { label: 'Trade -20%', type: 'negative' },
    ],
  },
  {
    family: 'summary',
    title: 'Court Summary',
    body: 'Your decisions have rippled through the kingdom. The merchants are pleased, but the clergy grows restless.',
    effects: [
      { label: 'Treasury +40', type: 'positive' },
      { label: 'Faith -3', type: 'negative' },
      { label: 'Stability', type: 'neutral' },
    ],
  },
];

// ============================================================
// Swipe Demo Card
// ============================================================

function SwipeDemo() {
  const [result, setResult] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const reset = useCallback(() => {
    setTimeout(() => {
      setResult(null);
      setKey((k) => k + 1);
    }, 600);
  }, []);

  const { ref, handlers } = useSwipe({
    onSwipeLeft: () => {
      setResult('DENIED');
      reset();
    },
    onSwipeRight: () => {
      setResult('GRANTED');
      reset();
    },
  });

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        SWIPE DEMO &mdash; Drag left or right
      </div>

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
            <CardTitle>Tax Relief Petition</CardTitle>
            <CardBody>
              The farming villages request a temporary reduction in grain tax for the coming season.
            </CardBody>
            <EffectStrip
              effects={[
                { label: 'Commoners +3', type: 'positive' },
                { label: 'Treasury -15', type: 'negative' },
              ]}
            />
          </Card>
        </div>
      </div>

      {result && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 8,
            fontFamily: 'var(--font-family-mono)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            color:
              result === 'GRANTED'
                ? 'var(--color-positive)'
                : 'var(--color-negative)',
            animation: 'pop 300ms ease both',
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ============================================================
// App (Phase 2 Demo Harness)
// ============================================================

export function App() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        padding: '0 16px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <StatsBar />
      <PhaseIndicator activePhase="crisis" />

      {/* Card gallery — one per family */}
      {CARD_DEMOS.map((demo, i) => (
        <div
          key={demo.family}
          style={{ animation: `slideUp 400ms ease ${i * 60}ms both` }}
        >
          <Card
            family={demo.family}
            onClick={demo.family === 'response' ? undefined : undefined}
          >
            <CardTitle>{demo.title}</CardTitle>
            <CardBody>{demo.body}</CardBody>
            <EffectStrip effects={demo.effects} />

            {/* Show SelectionBadge on the response card */}
            {demo.family === 'response' && <SelectionBadge />}

            {/* Show ConfidenceIndicator on the advisor card */}
            {demo.family === 'advisor' && <ConfidenceIndicator level="moderate" />}
          </Card>
        </div>
      ))}

      {/* Swipe interaction demo */}
      <div style={{ marginTop: 8 }}>
        <SwipeDemo />
      </div>
    </div>
  );
}
