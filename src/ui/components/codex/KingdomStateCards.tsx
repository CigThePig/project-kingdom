// Codex — Kingdom State Cards
// Renders 6 status cards, one per domain, with qualitative tier badges.

import { QualitativeTier } from '../../../engine/types';
import type { CodexDomain } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

function tierColor(tier: QualitativeTier): string {
  switch (tier) {
    case QualitativeTier.Dire:
    case QualitativeTier.Troubled:
      return 'var(--color-negative)';
    case QualitativeTier.Stable:
      return 'var(--color-warning)';
    case QualitativeTier.Prosperous:
    case QualitativeTier.Flourishing:
      return 'var(--color-positive)';
  }
}

function tierLabel(tier: QualitativeTier): string {
  return tier;
}

interface KingdomStateCardsProps {
  domains: CodexDomain[];
}

export function KingdomStateCards({ domains }: KingdomStateCardsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {domains.map((domain) => (
        <Card key={domain.id} family="status">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <CardTitle>{domain.title}</CardTitle>
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
                color: tierColor(domain.tier),
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${tierColor(domain.tier)}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: tierColor(domain.tier),
                  flexShrink: 0,
                }}
              />
              {tierLabel(domain.tier)}
            </span>
          </div>
          <CardBody>{domain.narrative}</CardBody>
        </Card>
      ))}
    </div>
  );
}
