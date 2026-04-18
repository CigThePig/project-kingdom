// Codex — Council Cards (Phase 8)
// Renders one card per council seat: appointee name, personality, visible
// modifiers, revealed flaws, loyalty bar, years serving, and Dismiss button.

import type { CouncilState, CouncilAdvisor, CouncilSeat } from '../../../engine/types';
import { CouncilSeat as CouncilSeatEnum } from '../../../engine/types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

const ALL_SEATS: CouncilSeat[] = [
  CouncilSeatEnum.Chancellor,
  CouncilSeatEnum.Marshal,
  CouncilSeatEnum.Chamberlain,
  CouncilSeatEnum.Spymaster,
];

interface CouncilCardsProps {
  council?: CouncilState;
  onDismiss?: (seat: CouncilSeat) => void;
}

export function CouncilCards({ council, onDismiss }: CouncilCardsProps) {
  const appointments = council?.appointments ?? {};
  const pending = council?.pendingCandidates ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {ALL_SEATS.map((seat) => {
        const advisor = appointments[seat];
        return advisor ? (
          <FilledSeatCard
            key={seat}
            advisor={advisor}
            onDismiss={onDismiss ? () => onDismiss(seat) : undefined}
          />
        ) : (
          <EmptySeatCard key={seat} seat={seat} />
        );
      })}
      {pending.length > 0 && (
        <Card family="advisor">
          <CardTitle>Pending Candidates</CardTitle>
          <CardBody>
            {pending.length} candidate{pending.length > 1 ? 's' : ''} awaiting a vacant seat.
          </CardBody>
          <div style={{ marginTop: 8 }}>
            {pending.map((c) => (
              <div
                key={c.id}
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 4,
                }}
              >
                {c.name} — {c.seat} ({c.personality})
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

interface FilledSeatCardProps {
  advisor: CouncilAdvisor;
  onDismiss?: () => void;
}

function FilledSeatCard({ advisor, onDismiss }: FilledSeatCardProps) {
  const revealedFlaws = advisor.flaws.filter((f) => !f.hidden);
  return (
    <Card family="advisor">
      <CardTitle>
        {advisor.seat}: {advisor.name}
      </CardTitle>
      <CardBody>{advisor.background}</CardBody>

      <DetailRow label="Personality" value={advisor.personality} />
      <DetailRow label="Years Serving" value={String(advisor.yearsServing)} />

      <div style={{ marginTop: 10 }}>
        <Label text="Loyalty" />
        <LoyaltyBar loyalty={advisor.loyalty} />
      </div>

      {advisor.modifiers.length > 0 && (
        <Section title="Known Strengths">
          {advisor.modifiers.map((m, i) => (
            <BulletLine key={i} text={describeModifier(m)} />
          ))}
        </Section>
      )}

      {revealedFlaws.length > 0 && (
        <Section title="Revealed Flaws" tone="negative">
          {revealedFlaws.map((f) => (
            <BulletLine key={f.id} text={f.id} tone="negative" />
          ))}
        </Section>
      )}

      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            marginTop: 12,
            padding: '8px 12px',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            background: 'transparent',
            color: 'var(--color-negative)',
            border: '1px solid var(--color-negative)',
            borderRadius: 6,
            cursor: 'pointer',
            minHeight: 36,
          }}
        >
          Dismiss
        </button>
      )}
    </Card>
  );
}

function EmptySeatCard({ seat }: { seat: CouncilSeat }) {
  return (
    <Card family="advisor">
      <CardTitle>{seat}: Vacant</CardTitle>
      <CardBody>
        No {seat.toLowerCase()} appointed. A candidate may present themselves at court.
      </CardBody>
    </Card>
  );
}

function describeModifier(mod: CouncilAdvisor['modifiers'][number]): string {
  const target = mod.target;
  const effect = mod.effect.kind;
  const value = mod.effect.value;
  return `${effect} (${target}): ${String(value)}`;
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
          minWidth: 100,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
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

function LoyaltyBar({ loyalty }: { loyalty: number }) {
  const pct = Math.max(0, Math.min(100, loyalty));
  const color =
    loyalty >= 70 ? 'var(--color-positive)' : loyalty >= 40 ? 'var(--color-warning)' : 'var(--color-negative)';
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
          background: color,
          transition: 'width 300ms ease',
        }}
      />
    </div>
  );
}

function Section({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'negative';
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: tone === 'negative' ? 'var(--color-negative)' : 'var(--color-text-disabled)',
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function BulletLine({ text, tone }: { text: string; tone?: 'negative' }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: tone === 'negative' ? 'var(--color-negative)' : 'var(--color-text-secondary)',
        marginBottom: 2,
      }}
    >
      • {text}
    </div>
  );
}
