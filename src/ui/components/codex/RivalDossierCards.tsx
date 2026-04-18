// Codex — Rival Dossier Cards
// Renders one card per neighbor, with content gated by intelligence level.

import type { RivalDossier } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

function regardColor(score: number): string {
  if (score <= 20) return 'var(--color-negative)';
  if (score <= 40) return 'var(--color-warning)';
  if (score <= 60) return 'var(--color-text-secondary)';
  if (score <= 80) return 'var(--color-positive)';
  return 'var(--color-positive)';
}

interface RivalDossierCardsProps {
  rivals: RivalDossier[];
}

export function RivalDossierCards({ rivals }: RivalDossierCardsProps) {
  if (rivals.length === 0) {
    return (
      <Card family="advisor">
        <CardTitle>No Known Rivals</CardTitle>
        <CardBody>The kingdom has no known neighboring powers.</CardBody>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rivals.map((rival) => (
        <Card key={rival.neighborId} family="advisor">
          <CardTitle>{rival.kingdomName}</CardTitle>

          {/* Ruler & Personality — always visible */}
          <div style={{ marginTop: 8 }}>
            <DetailRow label="Ruler" value={rival.rulerName} />
            <DetailRow label="Disposition" value={rival.personalityLabel} />
            <DetailRow
              label="Regard"
              value={`${rival.regard.label} (${rival.regard.score})`}
              valueColor={regardColor(rival.regard.score)}
            />
          </div>

          {/* Minimal+: diplomatic status */}
          {rival.intelLevel !== 'none' && (
            <div style={{ marginTop: 8 }}>
              <DetailRow label="Relations" value={rival.diplomaticStatus} />
              {rival.tradeStatus && <DetailRow label="Trade" value={rival.tradeStatus} />}
            </div>
          )}

          {/* None/minimal: limited intel message */}
          {(rival.intelLevel === 'none' || rival.intelLevel === 'minimal') && (
            <div
              style={{
                marginTop: 12,
                fontFamily: 'var(--font-family-body)',
                fontSize: 13,
                fontStyle: 'italic',
                color: 'var(--color-text-disabled)',
              }}
            >
              Little is known of this kingdom&apos;s internal affairs.
            </div>
          )}

          {/* Moderate+: known strengths */}
          {(rival.intelLevel === 'moderate' || rival.intelLevel === 'strong' || rival.intelLevel === 'exceptional') && (
            <>
              {rival.knownStrengths.length > 0 && (
                <Section title="Known Strengths">
                  {rival.knownStrengths.map((s, i) => (
                    <BulletLine key={i} text={s} />
                  ))}
                </Section>
              )}
              {rival.recentActions.length > 0 && (
                <Section title="Recent Actions">
                  {rival.recentActions.map((a, i) => (
                    <BulletLine key={i} text={a} />
                  ))}
                </Section>
              )}
              {rival.foreignEntanglements && rival.foreignEntanglements.length > 0 && (
                <Section title="Foreign Entanglements">
                  {rival.foreignEntanglements.map((e, i) => (
                    <BulletLine key={i} text={e} />
                  ))}
                </Section>
              )}
            </>
          )}

          {/* Strong+: spymaster assessment */}
          {(rival.intelLevel === 'strong' || rival.intelLevel === 'exceptional') && rival.spymasterAssessment && (
            <Section title="Spymaster\u2019s Assessment">
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                {rival.spymasterAssessment}
              </div>
              {rival.confidenceRating && (
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Confidence: {rival.confidenceRating}
                </div>
              )}
            </Section>
          )}
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// Helper sub-components
// ============================================================

function DetailRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex items-baseline gap-2"
      style={{ marginBottom: 4 }}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          width: 80,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 13,
          color: valueColor ?? 'var(--color-text-primary)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          marginBottom: 6,
          borderTop: '1px solid var(--color-border-default)',
          paddingTop: 8,
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
    <div
      style={{
        fontFamily: 'var(--font-family-body)',
        fontSize: 13,
        color: 'var(--color-text-primary)',
        paddingLeft: 12,
        position: 'relative',
        marginBottom: 3,
      }}
    >
      <span style={{ position: 'absolute', left: 0, color: 'var(--color-text-disabled)' }}>&bull;</span>
      {text}
    </div>
  );
}
