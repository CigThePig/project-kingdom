// Phase 9 — Codex Regions tab
// Renders one status card per region with tier badges and an inline posture
// picker. Disabled when the region is occupied.

import { QualitativeTier, RegionalPosture } from '../../../engine/types';
import type { RegionSummary } from '../../types';
import { Card } from '../Card';
import { CardTitle } from '../CardTitle';
import { CardBody } from '../CardBody';

const POSTURE_ORDER: RegionalPosture[] = [
  RegionalPosture.Autonomy,
  RegionalPosture.Develop,
  RegionalPosture.Extract,
  RegionalPosture.Garrison,
  RegionalPosture.Pacify,
];

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

interface RowProps {
  label: string;
  tier: QualitativeTier;
  narrative: string;
}

function DetailRow({ label, tier, narrative }: RowProps) {
  const color = tierColor(tier);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            minWidth: 80,
          }}
        >
          {label}
        </span>
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
            color,
            padding: '2px 8px',
            borderRadius: 4,
            border: `1px solid ${color}`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
            }}
          />
          {tier}
        </span>
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          paddingLeft: 88,
        }}
      >
        {narrative}
      </div>
    </div>
  );
}

interface PosturePickerProps {
  current: RegionalPosture;
  disabled: boolean;
  onSelect: (posture: RegionalPosture) => void;
}

function PosturePicker({ current, disabled, onSelect }: PosturePickerProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
      {POSTURE_ORDER.map((p) => {
        const isActive = p === current;
        return (
          <button
            key={p}
            disabled={disabled}
            onClick={() => {
              if (!disabled && !isActive) onSelect(p);
            }}
            style={{
              padding: '6px 10px',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              border: `1px solid ${
                isActive ? 'var(--color-warning)' : 'var(--color-border-default)'
              }`,
              borderRadius: 6,
              background: isActive ? 'var(--color-warning)22' : 'transparent',
              color: disabled
                ? 'var(--color-text-disabled)'
                : isActive
                  ? 'var(--color-warning)'
                  : 'var(--color-text-secondary)',
              cursor: disabled || isActive ? 'default' : 'pointer',
              transition: 'all 180ms ease',
              minHeight: 32,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

interface RegionCardsProps {
  regions: RegionSummary[];
  onSetPosture?: (regionId: string, posture: RegionalPosture) => void;
}

export function RegionCards({ regions, onSetPosture }: RegionCardsProps) {
  if (regions.length === 0) {
    return (
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 12,
          color: 'var(--color-text-disabled)',
          textAlign: 'center',
          padding: 20,
        }}
      >
        No regions recorded.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {regions.map((region) => {
        const currentPosture = (region.posture as RegionalPosture) ?? RegionalPosture.Autonomy;
        return (
          <Card key={region.id} family="status">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <CardTitle>{region.displayName}</CardTitle>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {region.isOccupied && (
                  <span
                    style={{
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: 'var(--color-negative)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--color-negative)',
                    }}
                  >
                    Occupied
                  </span>
                )}
                {region.isBorder && !region.isOccupied && (
                  <span
                    style={{
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: 'var(--color-text-disabled)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    Border
                  </span>
                )}
              </div>
            </div>
            <CardBody>
              <span style={{ color: 'var(--color-text-disabled)' }}>Primary output:</span>{' '}
              {region.primaryOutput}
              {'. '}
              {region.activityLine}
            </CardBody>

            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-disabled)',
                    minWidth: 80,
                  }}
                >
                  Posture
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--color-warning)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid var(--color-warning)',
                  }}
                >
                  {region.postureLabel}
                </span>
                {region.isStale && !region.isOccupied && (
                  <span
                    style={{
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: 'var(--color-text-disabled)',
                    }}
                  >
                    Review due
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', paddingLeft: 88 }}>
                {region.postureNarrative}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-disabled)',
                  fontStyle: 'italic',
                  paddingLeft: 88,
                  marginTop: 2,
                }}
              >
                {region.postureEffect}
              </div>
            </div>

            <DetailRow
              label="Loyalty"
              tier={region.loyaltyTier}
              narrative={region.loyaltyNarrative}
            />
            <DetailRow
              label="Development"
              tier={region.developmentTier}
              narrative={region.developmentNarrative}
            />

            <PosturePicker
              current={currentPosture}
              disabled={region.isOccupied || !onSetPosture}
              onSelect={(p) => onSetPosture?.(region.id, p)}
            />
          </Card>
        );
      })}
    </div>
  );
}
