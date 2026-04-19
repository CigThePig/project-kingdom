// Codex — Inter-Rival Situation (Phase F, §10)
// Renders a digest of alliances, trade pacts, and wars between neighboring
// kingdoms. Gated by the player's intelligence tier: at low intel the
// overlay surfaces an empty-state note rather than raw data.

import type { InterRivalDigest, InterRivalDigestEntry } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

interface InterRivalCardsProps {
  digest: InterRivalDigest;
}

export function InterRivalCards({ digest }: InterRivalCardsProps) {
  if (digest.entries.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card family="advisor">
          <CardTitle>Foreign Affairs — Quiet</CardTitle>
          <CardBody>
            {digest.emptyLine ?? 'No known entanglements between your neighbors.'}
          </CardBody>
        </Card>
      </div>
    );
  }

  const groups: { label: string; kind: InterRivalDigestEntry['kind']; entries: InterRivalDigestEntry[] }[] = [
    { label: 'Wars', kind: 'war', entries: digest.entries.filter((e) => e.kind === 'war') },
    { label: 'Alliances', kind: 'alliance', entries: digest.entries.filter((e) => e.kind === 'alliance') },
    { label: 'Trade Pacts', kind: 'trade_pact', entries: digest.entries.filter((e) => e.kind === 'trade_pact') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {groups.map((group) =>
        group.entries.length > 0 ? (
          <GroupCard key={group.kind} label={group.label} entries={group.entries} />
        ) : null,
      )}
    </div>
  );
}

function GroupCard({
  label,
  entries,
}: {
  label: string;
  entries: InterRivalDigestEntry[];
}) {
  return (
    <Card family="advisor">
      <CardTitle>{label}</CardTitle>
      <div style={{ marginTop: 6 }}>
        {entries.map((entry) => (
          <EntryLine key={entry.id} entry={entry} />
        ))}
      </div>
    </Card>
  );
}

function EntryLine({ entry }: { entry: InterRivalDigestEntry }) {
  const summary = entry.sharedTargetName
    ? `${entry.participantAName} ⤫ ${entry.participantBName} — against ${entry.sharedTargetName}`
    : `${entry.participantAName} ⤫ ${entry.participantBName}`;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 8,
      }}
    >
      <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{summary}</div>
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          letterSpacing: 1,
          color: 'var(--color-text-disabled)',
        }}
      >
        {entry.turnsActive} season{entry.turnsActive === 1 ? '' : 's'} active
      </div>
    </div>
  );
}
