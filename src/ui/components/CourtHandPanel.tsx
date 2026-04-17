// Phase 5 — Court Hand Panel
//
// Sheet-style overlay that lists every card currently held in the Court Hand.
// Each entry surfaces a title, body, expiry pip, and Play / Discard buttons.
// For cards that require a choice (class or rival), the Play button expands
// inline into a picker before confirming. No new screen depth; this is a
// diegetic overlay over Court Business.

import { useState } from 'react';

import type { CourtHand } from '../../engine/types';
import { PopulationClass } from '../../engine/types';
import type { NeighborState } from '../../engine/types';
import { Card } from './Card';
import { CardTitle } from './CardTitle';
import { CardBody } from './CardBody';
import {
  HAND_CARDS,
  handCardDefinitionFromCard,
  type HandCardChoice,
} from '../../data/cards/hand-cards';
import { getNeighborDisplayName } from '../../bridge/nameResolver';
import type { GameState } from '../../engine/types';
import { findPotentialCombosForCard } from '../../engine/systems/combo-engine';
import { COMBOS } from '../../data/cards/combos';

interface CourtHandPanelProps {
  hand: CourtHand;
  neighbors: NeighborState[];
  state: GameState;
  onPlay: (cardId: string, choice: HandCardChoice) => void;
  onDiscard: (cardId: string) => void;
  onClose: () => void;
}

const POPULATION_CLASS_LABEL: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]: 'Nobility',
  [PopulationClass.Clergy]: 'Clergy',
  [PopulationClass.Merchants]: 'Merchants',
  [PopulationClass.Commoners]: 'Commoners',
  [PopulationClass.MilitaryCaste]: 'Military',
};

export function CourtHandPanel({
  hand,
  neighbors,
  state,
  onPlay,
  onDiscard,
  onClose,
}: CourtHandPanelProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const playCard = (cardId: string, choice: HandCardChoice) => {
    setExpandedCardId(null);
    onPlay(cardId, choice);
  };

  return (
    <div
      role="dialog"
      aria-label="Court Hand"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-bg-page, #0b0b0b)',
        overflowY: 'auto',
        padding: '16px 12px 24px',
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '0 6px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          Court Hand — {hand.slots.length}/{hand.capacity}
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '6px 14px',
            background: 'transparent',
            border: '1px solid var(--color-border-default)',
            borderRadius: 8,
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      {hand.slots.length === 0 && (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            fontSize: 14,
          }}
        >
          The hand is empty. Quiet months may offer cards to bank.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {hand.slots.map((slot) => {
          const def = handCardDefinitionFromCard(slot.card);
          const expanded = expandedCardId === slot.card.id;
          return (
            <Card key={slot.card.id} family="advisor">
              <CardTitle>{slot.card.title}</CardTitle>
              <CardBody>{slot.card.body}</CardBody>
              {(() => {
                const potential = findPotentialCombosForCard(slot.card, hand, COMBOS);
                if (potential.length === 0) return null;
                const names = potential.slice(0, 2).map((c) => c.name).join(', ');
                return (
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: 'var(--color-accent-response)',
                    }}
                  >
                    Combos with: {names}
                  </div>
                );
              })()}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12,
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span>
                  Expires in{' '}
                  <strong style={{ color: 'var(--color-text-primary)' }}>
                    {slot.turnsUntilExpiry}
                  </strong>{' '}
                  turn{slot.turnsUntilExpiry === 1 ? '' : 's'}
                </span>
              </div>

              {expanded && def?.requiresChoice === 'class' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {Object.values(PopulationClass).map((cls) => (
                    <button
                      key={cls}
                      onClick={() =>
                        playCard(slot.card.id, { kind: 'class', class: cls })
                      }
                      style={pickerButtonStyle()}
                    >
                      {POPULATION_CLASS_LABEL[cls]}
                    </button>
                  ))}
                </div>
              )}

              {expanded && def?.requiresChoice === 'rival' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {neighbors.length === 0 && (
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      No rivals available.
                    </span>
                  )}
                  {neighbors.map((n) => (
                    <button
                      key={n.id}
                      onClick={() =>
                        playCard(slot.card.id, { kind: 'rival', neighborId: n.id })
                      }
                      style={pickerButtonStyle()}
                    >
                      {getNeighborDisplayName(n.id, state)}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => {
                    if (def?.requiresChoice) {
                      setExpandedCardId(expanded ? null : slot.card.id);
                    } else {
                      playCard(slot.card.id, { kind: 'none' });
                    }
                  }}
                  style={primaryButtonStyle()}
                >
                  {expanded ? 'Cancel' : 'Play'}
                </button>
                <button
                  onClick={() => onDiscard(slot.card.id)}
                  style={secondaryButtonStyle()}
                >
                  Discard
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function primaryButtonStyle(): React.CSSProperties {
  return {
    flex: 1,
    padding: '10px 14px',
    background: 'var(--color-accent-advisor, #6a8fb3)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };
}

function secondaryButtonStyle(): React.CSSProperties {
  return {
    flex: 1,
    padding: '10px 14px',
    background: 'transparent',
    border: '1px solid var(--color-border-default)',
    borderRadius: 8,
    color: 'var(--color-text-secondary)',
    fontSize: 14,
    cursor: 'pointer',
  };
}

function pickerButtonStyle(): React.CSSProperties {
  return {
    padding: '6px 10px',
    background: 'transparent',
    border: '1px solid var(--color-border-default)',
    borderRadius: 6,
    color: 'var(--color-text-primary)',
    fontSize: 12,
    cursor: 'pointer',
  };
}

// Re-export for CourtBusiness
export { HAND_CARDS };
