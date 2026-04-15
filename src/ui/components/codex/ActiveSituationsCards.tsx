// Codex — Active Situations Cards
// Renders one card per active situation with urgency indicators.

import type { ActiveSituation } from '../../types';
import type { CardFamily } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';

function situationFamily(type: ActiveSituation['type']): CardFamily {
  switch (type) {
    case 'war':
    case 'failureWarning':
      return 'crisis';
    case 'construction':
      return 'decree';
    case 'treaty':
    case 'trade':
    case 'espionage':
      return 'advisor';
    case 'storyline':
      return 'season';
    case 'kingdom_feature':
      return 'status';
  }
}

function urgencyColor(urgency: ActiveSituation['urgency']): string {
  switch (urgency) {
    case 'low':
      return 'var(--color-positive)';
    case 'medium':
      return 'var(--color-warning)';
    case 'high':
      return 'var(--color-negative)';
  }
}

interface ActiveSituationsCardsProps {
  situations: ActiveSituation[];
}

export function ActiveSituationsCards({ situations }: ActiveSituationsCardsProps) {
  if (situations.length === 0) {
    return (
      <Card family="season">
        <CardTitle>No Active Situations</CardTitle>
        <div
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginTop: 8,
          }}
        >
          The kingdom is at peace. No urgent matters demand attention.
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {situations.map((situation) => (
        <Card
          key={situation.id}
          family={situationFamily(situation.type)}
          style={{
            borderLeft: `4px solid ${urgencyColor(situation.urgency)}`,
          }}
        >
          <CardTitle>{situation.title}</CardTitle>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {situation.statusLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
