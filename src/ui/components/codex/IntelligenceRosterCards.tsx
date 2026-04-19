// Codex — Intelligence Roster (Phase F, §10)
// Renders one card per active agent: codename, specialization, cover
// settlement, reliability/burn-risk bars, and ongoing operations.

import { QualitativeTier } from '../../../engine/types';
import type { AgentRosterEntry } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

interface IntelligenceRosterCardsProps {
  agents: AgentRosterEntry[];
}

export function IntelligenceRosterCards({ agents }: IntelligenceRosterCardsProps) {
  if (agents.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card family="advisor">
          <CardTitle>No Agents Recruited</CardTitle>
          <CardBody>
            Your intelligence network has no named operatives in the field. Recruit agents via
            court opportunities as the spymaster presents candidates.
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentRosterEntry }) {
  return (
    <Card family="advisor">
      <CardTitle>
        {agent.codename} — {agent.specializationLabel}
      </CardTitle>
      <CardBody>
        Covered in {agent.coverSettlementLabel}. {agent.status === 'Active'
          ? `In post for ${agent.turnsActive} season${agent.turnsActive === 1 ? '' : 's'}.`
          : `Status: ${agent.status}.`}
      </CardBody>

      <div style={{ marginTop: 10 }}>
        <Label text="Reliability" />
        <Meter value={agent.reliabilityValue} tier={agent.reliabilityTier} invert={false} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Label text="Burn Risk" />
        <Meter value={agent.burnRiskValue} tier={agent.burnRiskTier} invert={true} />
      </div>

      {agent.ongoingOperations.length > 0 && (
        <Section title="Ongoing Operations">
          {agent.ongoingOperations.map((op, i) => (
            <BulletLine key={i} text={`${op.label} — ${op.stageLabel}`} />
          ))}
        </Section>
      )}
    </Card>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-family-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: 'var(--color-text-disabled)',
        marginBottom: 4,
      }}
    >
      {text}
    </div>
  );
}

function tierColor(tier: QualitativeTier, invert: boolean): string {
  // When `invert` is true (burn risk), Dire = high bar = bad (red).
  // When `invert` is false (reliability), Dire = low bar = bad (red).
  if (tier === QualitativeTier.Flourishing || tier === QualitativeTier.Prosperous) {
    return invert ? 'var(--color-positive)' : 'var(--color-positive)';
  }
  if (tier === QualitativeTier.Stable) return 'var(--color-warning)';
  return 'var(--color-negative)';
}

function Meter({
  value,
  tier,
  invert,
}: {
  value: number;
  tier: QualitativeTier;
  invert: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      style={{
        width: '100%',
        height: 6,
        background: 'var(--color-border-default)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: tierColor(tier, invert),
          transition: 'width 300ms ease',
        }}
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletLine({ text }: { text: string }) {
  return (
    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 3 }}>
      • {text}
    </div>
  );
}
