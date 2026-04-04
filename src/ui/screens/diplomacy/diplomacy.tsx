// Phase 5 — Diplomacy Screen: diplomatic relations and action dispatch.
// Blueprint Reference: ui-blueprint.md §4.9; ux-blueprint.md §4, §6

import React, { useState, useCallback } from 'react';

import {
  ActionType,
  DiplomaticPosture,
  type NeighborState,
  type QueuedAction,
} from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import { useTurnActions } from '../../hooks/use-turn-actions';
import {
  NEIGHBOR_LABELS,
  DIPLOMATIC_POSTURE_LABELS,
  NEIGHBOR_DISPOSITION_LABELS,
  BUDGET_ERROR_LABELS,
} from '../../../data/text/labels';
import styles from './diplomacy.module.css';

// ============================================================
// Helpers
// ============================================================

let actionIdCounter = 0;
function generateActionId(): string {
  actionIdCounter += 1;
  return `action_${Date.now()}_${actionIdCounter}`;
}

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

function getAlignmentLabel(kingdomId: string, neighborId: string): string {
  return kingdomId === neighborId ? 'Aligned' : 'Divergent';
}

function getAlignmentStatus(kingdomId: string, neighborId: string): string {
  return kingdomId === neighborId ? 'positive' : 'warning';
}

// ============================================================
// Diplomacy Screen
// ============================================================

export function Diplomacy() {
  const kingdom = useKingdomState();
  const { queueAction, slotsRemaining, isBudgetExhausted } = useTurnActions();
  const [expandedNeighbor, setExpandedNeighbor] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const canAct = !isBudgetExhausted && slotsRemaining >= 1;

  const atWar = kingdom.diplomacy.neighbors.some(
    (n) => n.attitudePosture === 'War',
  );

  const handleDiplomaticAction = useCallback(
    (neighborId: string, diplomaticActionType: string) => {
      setActionError(null);
      const action: QueuedAction = {
        id: generateActionId(),
        type: ActionType.DiplomaticAction,
        actionDefinitionId: `diplo_${diplomaticActionType}_${neighborId}`,
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: neighborId,
        parameters: { diplomaticActionType },
      };
      const error = queueAction(action);
      if (error) {
        setActionError(BUDGET_ERROR_LABELS[error.code] ?? 'Diplomatic action could not be dispatched.');
        setTimeout(() => setActionError(null), 3000);
      }
    },
    [queueAction],
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

      {/* Action Error */}
      {actionError && (
        <div className={styles.errorMessage} role="alert">{actionError}</div>
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
            canAct={canAct}
            onToggle={() =>
              setExpandedNeighbor(
                expandedNeighbor === neighbor.id ? null : neighbor.id,
              )
            }
            onDiplomaticAction={handleDiplomaticAction}
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
  canAct,
  onToggle,
  onDiplomaticAction,
}: {
  neighbor: NeighborState;
  kingdomFaith: string;
  kingdomCulture: string;
  isExpanded: boolean;
  canAct: boolean;
  onToggle: () => void;
  onDiplomaticAction: (neighborId: string, actionType: string) => void;
}) {
  const [ultimatumConfirming, setUltimatumConfirming] = useState(false);
  const postureStatus = getPostureStatus(neighbor.attitudePosture);
  const atWar = neighbor.attitudePosture === DiplomaticPosture.War;

  return (
    <div
      className={styles.neighborCard}
      data-expanded={isExpanded ? 'true' : 'false'}
      data-posture={postureStatus}
    >
      {/* Clickable header / summary area */}
      <div
        className={styles.neighborSummary}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${getNeighborName(neighbor.id)} — ${DIPLOMATIC_POSTURE_LABELS[neighbor.attitudePosture]}`}
        onKeyDown={(e: React.KeyboardEvent) => {
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
                data-status={getAlignmentStatus(kingdomFaith, neighbor.religiousProfile)}
              >
                {getAlignmentLabel(kingdomFaith, neighbor.religiousProfile)}
              </span>
            </div>
            <div className={styles.alignmentItem}>
              <span className={styles.alignmentLabel}>Culture</span>
              <span
                className={styles.alignmentValue}
                data-status={getAlignmentStatus(kingdomCulture, neighbor.culturalIdentity)}
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

          {/* Diplomatic Actions */}
          <div className={styles.diplomaticActions}>
            <span className={styles.actionsTitle}>Diplomatic Actions</span>
            {atWar ? (
              <p className={styles.actionsDisabledNote}>
                Diplomatic actions are unavailable while at war.
              </p>
            ) : (
              <div className={styles.actionButtonRow}>
                <button
                  className={styles.actionButton}
                  disabled={!canAct}
                  onClick={() => onDiplomaticAction(neighbor.id, 'send_envoy')}
                  title="Send an envoy to improve relations (+8 relationship)"
                >
                  Send Envoy
                  <span className={styles.actionEffect}>+8</span>
                </button>
                <button
                  className={styles.actionButton}
                  disabled={!canAct}
                  onClick={() => onDiplomaticAction(neighbor.id, 'propose_treaty')}
                  title="Propose a formal treaty to strengthen ties (+12 relationship)"
                >
                  Propose Treaty
                  <span className={styles.actionEffect}>+12</span>
                </button>

                {/* Issue Ultimatum — requires inline confirmation */}
                {ultimatumConfirming ? (
                  <div className={styles.confirmPrompt}>
                    <span className={styles.confirmText}>
                      Issuing an ultimatum severely damages relations (−15). Proceed?
                    </span>
                    <div className={styles.confirmRow}>
                      <button
                        className={styles.dangerButton}
                        onClick={() => {
                          onDiplomaticAction(neighbor.id, 'issue_ultimatum');
                          setUltimatumConfirming(false);
                        }}
                      >
                        Issue Ultimatum
                      </button>
                      <button
                        className={styles.confirmCancelButton}
                        onClick={() => setUltimatumConfirming(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={styles.dangerButton}
                    disabled={!canAct}
                    onClick={() => setUltimatumConfirming(true)}
                    title="Issue a formal ultimatum (−15 relationship)"
                  >
                    Issue Ultimatum
                    <span className={styles.actionEffect}>−15</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
