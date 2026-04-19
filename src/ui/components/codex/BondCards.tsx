// Codex — Bonds (Phase F, §10)
// Renders one card per active diplomatic bond: descriptor, participants,
// age, time remaining, breach penalty, and kind-specific extras.

import type { BondCodexEntry } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

interface BondCardsProps {
  bonds: BondCodexEntry[];
}

export function BondCards({ bonds }: BondCardsProps) {
  if (bonds.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card family="status">
          <CardTitle>No Active Bonds</CardTitle>
          <CardBody>
            You have no marriages, vassalages, hostage exchanges, or other diplomatic bonds in force.
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {bonds.map((bond) => (
        <BondCard key={bond.bondId} bond={bond} />
      ))}
    </div>
  );
}

function titleCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function BondCard({ bond }: { bond: BondCodexEntry }) {
  const participantLine =
    bond.participantNames.length > 0
      ? bond.participantNames.join(', ')
      : 'sworn party';

  return (
    <Card family="status">
      <CardTitle>{titleCase(bond.descriptor)}</CardTitle>
      <CardBody>
        A {bond.kindLabel} in force for {bond.ageInTurns} season
        {bond.ageInTurns === 1 ? '' : 's'}.
      </CardBody>

      <DetailRow label="Participants" value={participantLine} />
      <DetailRow label="Remaining" value={bond.turnsRemainingLabel} />
      <DetailRow label="Breach Penalty" value={String(bond.breachPenalty)} />

      {bond.kind === 'royal_marriage' && (
        <DetailRow label="Heir Produced" value={bond.heirProduced ? 'Yes' : 'Not yet'} />
      )}
      {bond.kind === 'vassalage' && bond.tributePerTurn !== undefined && (
        <DetailRow label="Tribute / Turn" value={String(bond.tributePerTurn)} />
      )}
      {bond.kind === 'trade_league' && bond.incomePerTurn !== undefined && (
        <DetailRow label="Income / Turn" value={String(bond.incomePerTurn)} />
      )}
      {bond.kind === 'hostage_exchange' && bond.hostageName && (
        <DetailRow label="Hostage" value={bond.hostageName} />
      )}
      {bond.kind === 'coalition' && bond.commonEnemyName && (
        <DetailRow label="Against" value={bond.commonEnemyName} />
      )}
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12 }}>
      <span
        style={{
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--color-text-disabled)',
          textTransform: 'uppercase',
          letterSpacing: 1,
          minWidth: 120,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  );
}
