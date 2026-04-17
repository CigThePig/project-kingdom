// Codex — Combos section.
// Renders every registered card combo. Discovered entries show their full
// name and flavor text; undiscovered entries show a silhouette, hinting
// that a combo exists without revealing the recipe.

import type { CardCombo } from '../../../engine/cards/combos';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

interface CombosCardsProps {
  combos: readonly CardCombo[];
  discoveredIds: readonly string[];
}

export function CombosCards({ combos, discoveredIds }: CombosCardsProps) {
  const discovered = new Set(discoveredIds);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {combos.map((combo) => {
        const isDiscovered = discovered.has(combo.id);
        return (
          <Card key={combo.id} family="legacy">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <CardTitle>
                {isDiscovered ? combo.name : '\u2014\u2014\u2014\u2014'}
              </CardTitle>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: isDiscovered
                    ? 'var(--color-accent-response)'
                    : 'var(--color-text-disabled)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: `1px solid ${
                    isDiscovered
                      ? 'var(--color-accent-response)'
                      : 'var(--color-border-default)'
                  }`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {isDiscovered ? 'Discovered' : 'Unknown'}
              </span>
            </div>
            <CardBody>
              {isDiscovered
                ? combo.description
                : 'A combination of royal decisions that has yet to be tried.'}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
