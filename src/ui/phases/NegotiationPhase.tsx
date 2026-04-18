// NegotiationPhase — Renders a negotiation with toggleable terms.
// Event card at top, term cards that toggle on/off, Accept/Reject at bottom.
// Two-step confirm pattern (same as CrisisPhase).

import { useState, useCallback } from 'react';

import { Card } from '../components/Card';
import { CardTitle } from '../components/CardTitle';
import { CardBody } from '../components/CardBody';
import { EffectStrip } from '../components/EffectStrip';
import { SelectionBadge } from '../components/SelectionBadge';
import type { MonthDecision } from '../types';
import type { CardOfFamily } from '../../engine/cards/types';
import { SeasonMonth, InteractionType } from '../../engine/types';

interface NegotiationPhaseProps {
  negotiationCard: CardOfFamily<'negotiation'>;
  currentMonth: SeasonMonth;
  onComplete: (decisions: MonthDecision[]) => void;
}

const BOND_KIND_LABEL: Record<string, string> = {
  royal_marriage: 'MARRIAGE',
  hostage_exchange: 'HOSTAGE',
  vassalage: 'VASSAL',
  mutual_defense: 'DEFENSE',
  coalition: 'COALITION',
  trade_league: 'TRADE LEAGUE',
  religious_accord: 'ACCORD',
  cultural_exchange: 'EXCHANGE',
};

export function NegotiationPhase({ negotiationCard, currentMonth, onComplete }: NegotiationPhaseProps) {
  const [toggledTermIds, setToggledTermIds] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState<'accept' | 'reject' | null>(null);
  // Phase 13 — counter-proposal stepper values per term (adjusted from baseline).
  const [counterValues, setCounterValues] = useState<Record<string, number>>({});

  const payload = negotiationCard.payload;
  const { eventCard, terms, rejectHints } = payload;

  const handleToggleTerm = useCallback((termId: string) => {
    // Reset confirmation state when toggling terms
    setConfirming(null);
    setToggledTermIds((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  }, []);

  const resolvedNeighborId = payload.resolvedNeighborId;

  const handleReject = useCallback(() => {
    if (confirming === 'reject') {
      // Second tap — commit
      const decisions: MonthDecision[] = [{
        cardId: eventCard.id,
        choiceId: `reject:${eventCard.id}`,
        interactionType: InteractionType.Negotiation,
        month: currentMonth,
        targetNeighborId: resolvedNeighborId,
      }];
      onComplete(decisions);
    } else {
      setConfirming('reject');
    }
  }, [confirming, eventCard.id, currentMonth, onComplete, resolvedNeighborId]);

  const handleAccept = useCallback(() => {
    if (toggledTermIds.size === 0) {
      // No terms toggled = treat as reject
      handleReject();
      return;
    }
    if (confirming === 'accept') {
      // Second tap — commit
      const decisions: MonthDecision[] = [];
      for (const termId of toggledTermIds) {
        decisions.push({
          cardId: eventCard.id,
          choiceId: termId,
          interactionType: InteractionType.Negotiation,
          month: currentMonth,
          targetNeighborId: resolvedNeighborId,
        });
      }
      // Add overall accept decision
      decisions.push({
        cardId: eventCard.id,
        choiceId: `accept:${eventCard.id}`,
        interactionType: InteractionType.Negotiation,
        month: currentMonth,
        targetNeighborId: resolvedNeighborId,
      });
      onComplete(decisions);
    } else {
      setConfirming('accept');
    }
  }, [confirming, toggledTermIds, eventCard.id, currentMonth, onComplete, handleReject, resolvedNeighborId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Negotiation event card */}
      <div style={{ animation: 'slideUp 400ms ease both' }}>
        <Card family="advisor">
          <div
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-accent-advisor)',
              marginBottom: 6,
            }}
          >
            {payload.contextLabel}
          </div>
          <CardTitle>{eventCard.title}</CardTitle>
          <CardBody>{eventCard.body}</CardBody>
        </Card>
      </div>

      {/* Terms header */}
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-text-disabled)',
          textAlign: 'center',
          padding: '4px 0',
          animation: 'slideUp 400ms ease 80ms both',
        }}
      >
        NEGOTIATION TERMS — TAP TO TOGGLE
      </div>

      {/* Term cards */}
      {terms.map((term, i) => {
        const isOn = toggledTermIds.has(term.id);
        const bondLabel = term.bondKind ? BOND_KIND_LABEL[term.bondKind] : null;
        const counter = term.counterableValue;
        const counterCurrent = counter
          ? counterValues[term.id] ?? counter.baseline
          : null;
        const adjustCounter = (delta: number) => {
          if (!counter) return;
          const next = Math.max(counter.min, Math.min(counter.max, (counterValues[term.id] ?? counter.baseline) + delta));
          setCounterValues((prev) => ({ ...prev, [term.id]: next }));
        };
        return (
          <div
            key={term.id}
            style={{ animation: `slideUp 400ms ease ${(i + 1) * 80 + 80}ms both` }}
          >
            <Card
              family="decree"
              onClick={() => handleToggleTerm(term.id)}
              style={isOn ? {
                borderColor: 'var(--color-accent-response)',
                boxShadow: '0 0 8px rgba(201, 168, 76, 0.25)',
              } : undefined}
            >
              {bondLabel && (
                <div
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-response)',
                    border: '1px solid var(--color-accent-response)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    marginBottom: 6,
                  }}
                >
                  BOND · {bondLabel}
                </div>
              )}
              <CardTitle>{term.title}</CardTitle>
              <CardBody>{term.description}</CardBody>
              <EffectStrip effects={term.effectHints} />
              {counter && counterCurrent !== null && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <span style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {counter.field}: {counterCurrent}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => adjustCounter(-counter.step)}
                      style={{
                        padding: '2px 10px',
                        fontFamily: 'var(--font-family-mono)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 4,
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustCounter(counter.step)}
                      style={{
                        padding: '2px 10px',
                        fontFamily: 'var(--font-family-mono)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 4,
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              {isOn && <SelectionBadge />}
            </Card>
          </div>
        );
      })}

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          animation: `slideUp 400ms ease ${(terms.length + 2) * 80}ms both`,
        }}
      >
        {/* Reject button */}
        <div
          onClick={handleReject}
          style={{
            flex: 1,
            padding: '14px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: confirming === 'reject' ? 'var(--color-accent-crisis)' : 'var(--color-text-secondary)',
            border: `1px solid ${confirming === 'reject' ? 'var(--color-accent-crisis)' : 'var(--color-border-default)'}`,
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {confirming === 'reject' ? 'TAP TO CONFIRM' : 'REJECT ALL'}
        </div>

        {/* Accept button */}
        <div
          onClick={handleAccept}
          style={{
            flex: 1,
            padding: '14px 0',
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: confirming === 'accept' ? 'var(--color-accent-response)' : 'var(--color-text-secondary)',
            border: `1px solid ${confirming === 'accept' ? 'var(--color-accent-response)' : 'var(--color-border-default)'}`,
            borderRadius: 12,
            cursor: 'pointer',
            opacity: toggledTermIds.size === 0 ? 0.4 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          {confirming === 'accept'
            ? 'TAP TO CONFIRM'
            : `ACCEPT (${toggledTermIds.size})`}
        </div>
      </div>

      {/* Reject effects preview */}
      {confirming === 'reject' && (
        <div style={{ animation: 'pop 300ms ease both' }}>
          <EffectStrip effects={rejectHints} />
        </div>
      )}

      {/* Confirm hint */}
      {confirming && (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-family-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'var(--color-text-disabled)',
            animation: 'pop 300ms ease both',
          }}
        >
          TAP AGAIN TO CONFIRM
        </div>
      )}
    </div>
  );
}
