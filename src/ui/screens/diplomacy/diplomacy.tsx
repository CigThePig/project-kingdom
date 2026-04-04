// Phase 12 — Diplomacy Screen: diplomatic relations overview.
// Blueprint Reference: ui-blueprint.md §4.9; ux-blueprint.md §6

import { useState } from 'react';

import type { NeighborState } from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  NEIGHBOR_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
  NEIGHBOR_DISPOSITION_LABELS,
} from '../../../data/text/labels';
import styles from './diplomacy.module.css';

// ============================================================
// Helpers
// ============================================================

function getNeighborName(id: string): string {
  return NEIGHBOR_LABELS[id] ?? id;
}

function getPostureStatus(posture: string): string {
  switch (posture) {
    case 'Friendly': return 'positive';
    case 'Neutral': return 'neutral';
    case 'Tense': return 'warning';
    case 'Hostile':
    case 'War': return 'critical';
    default: return 'neutral';
  }
}

function getAlignmentLabel(
  kingdomId: string,
  neighborId: string,
): string {
  return kingdomId === neighborId ? 'Aligned' : 'Divergent';
}

function getAlignmentStatus(
  kingdomId: string,
  neighborId: string,
): string {
  return kingdomId === neighborId ? 'positive' : 'warning';
}

// ============================================================
// Diplomacy Screen
// ============================================================

export function Diplomacy() {
  const kingdom = useKingdomState();
  const [expandedNeighbor, setExpandedNeighbor] = useState<string | null>(null);

  const atWar = kingdom.diplomacy.neighbors.some(
    (n) => n.attitudePosture === 'War',
  );

  return (
    <div className={styles.screen}>
      {/* War Warning */}
      {atWar && (
        <div className={styles.warningBanner} data-level="critical" role="alert">
          <span className={styles.warningText}>
            The kingdom is at war. Diplomatic options are limited during
            active hostilities.
          </span>
        </div>
      )}

      {/* Neighbor Cards */}
      <div className={styles.neighborGrid}>
        {kingdom.diplomacy.neighbors.map((neighbor) => (
          <NeighborCard
            key={neighbor.id}
            neighbor={neighbor}
            kingdomFaith={kingdom.faithCulture.kingdomFaithTraditionId}
            kingdomCulture={kingdom.faithCulture.kingdomCultureIdentityId}
            isExpanded={expandedNeighbor === neighbor.id}
            onToggle={() =>
              setExpandedNeighbor(
                expandedNeighbor === neighbor.id ? null : neighbor.id,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Sub-Components
// ============================================================

function NeighborCard({
  neighbor,
  kingdomFaith,
  kingdomCulture,
  isExpanded,
  onToggle,
}: {
  neighbor: NeighborState;
  kingdomFaith: string;
  kingdomCulture: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const postureStatus = getPostureStatus(neighbor.attitudePosture);

  return (
    <div
      className={styles.neighborCard}
      data-expanded={isExpanded ? 'true' : 'false'}
      data-posture={postureStatus}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${getNeighborName(neighbor.id)} — ${DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture]}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Header */}
      <div className={styles.neighborHeader}>
        <span className={styles.neighborName}>
          {getNeighborName(neighbor.id)}
        </span>
        <span className={styles.postureBadge} data-status={postureStatus}>
          {DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture]}
        </span>
      </div>

      {/* Disposition */}
      <span className={styles.disposition}>
        {NEIGHBOR_DISPOSITION_LABELS[neighbor.disposition]}
      </span>

      {/* Relationship Bar */}
      <div className={styles.relationRow}>
        <span className={styles.relationLabel}>Relationship</span>
        <span className={styles.relationValue}>{neighbor.relationshipScore}</span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          data-status={postureStatus}
          style={{ width: `${neighbor.relationshipScore}%` }}
        />
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <span className={styles.quickLabel}>Military</span>
          <span className={styles.quickValue}>{neighbor.militaryStrength}</span>
        </div>
        <div className={styles.quickStat}>
          <span className={styles.quickLabel}>Espionage</span>
          <span className={styles.quickValue}>{neighbor.espionageCapability}</span>
        </div>
        <div className={styles.quickStat}>
          <span className={styles.quickLabel}>Agreements</span>
          <span className={styles.quickValue}>{neighbor.activeAgreements.length}</span>
        </div>
        <div className={styles.quickStat}>
          <span className={styles.quickLabel}>Tensions</span>
          <span className={styles.quickValue}>{neighbor.outstandingTensions.length}</span>
        </div>
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className={styles.neighborDetail}>
          {/* Alignment */}
          <div className={styles.alignmentRow}>
            <div className={styles.alignmentItem}>
              <span className={styles.alignmentLabel}>Faith</span>
              <span
                className={styles.alignmentValue}
                data-status={getAlignmentStatus(
                  kingdomFaith,
                  neighbor.religiousProfile,
                )}
              >
                {getAlignmentLabel(kingdomFaith, neighbor.religiousProfile)}
              </span>
            </div>
            <div className={styles.alignmentItem}>
              <span className={styles.alignmentLabel}>Culture</span>
              <span
                className={styles.alignmentValue}
                data-status={getAlignmentStatus(
                  kingdomCulture,
                  neighbor.culturalIdentity,
                )}
              >
                {getAlignmentLabel(kingdomCulture, neighbor.culturalIdentity)}
              </span>
            </div>
          </div>

          {/* Active Agreements */}
          {neighbor.activeAgreements.length > 0 && (
            <div className={styles.detailSection}>
              <span className={styles.detailTitle}>Active Agreements</span>
              <div className={styles.agreementList}>
                {neighbor.activeAgreements.map((a) => (
                  <div key={a.agreementId} className={styles.agreementItem}>
                    <span className={styles.agreementId}>{a.agreementId}</span>
                    <span className={styles.agreementDuration}>
                      {a.turnsRemaining === null
                        ? 'Indefinite'
                        : `${a.turnsRemaining} months`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tensions */}
          {neighbor.outstandingTensions.length > 0 && (
            <div className={styles.detailSection}>
              <span className={styles.detailTitle}>
                Outstanding Tensions ({neighbor.outstandingTensions.length})
              </span>
              <p className={styles.detailText}>
                Unresolved diplomatic tensions strain relations. Each
                outstanding tension exerts downward pressure on the
                relationship score.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
