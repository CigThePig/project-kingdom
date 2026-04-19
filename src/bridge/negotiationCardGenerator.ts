// Bridge Layer — Negotiation Card Generator
// Filters NEGOTIATION_POOL by trigger conditions and produces a NegotiationCard
// for the monthly court business phase.

import type { GameState, MechanicalEffectDelta } from '../engine/types';
import { evaluateCondition } from '../engine/events/event-engine';
import type { EventTriggerCondition } from '../engine/events/event-engine';
import { NEGOTIATION_POOL } from '../data/events/negotiations';
import type { NegotiationDefinition } from '../data/events/negotiations';
import { NEGOTIATION_EFFECTS } from '../data/events/negotiation-effects';
import { NEGOTIATION_TEXT } from '../data/text/negotiations';
import { turnRng } from '../engine/resolution/turn-rng';
import { getNeighborDisplayName } from './nameResolver';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { substituteSmartPlaceholders } from './smartText';
import type { NegotiationCard, NegotiationTerm } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { negotiationToCard } from '../engine/cards/adapters';
import { TERM_ID_TO_BOND_KIND, TERM_ID_TO_COUNTERABLE } from './negotiationBondMap';

/**
 * Picks the best neighbor for external negotiations:
 * the one with the highest relationship score who is not at war.
 * Falls back to the first neighbor if none qualify.
 */
function pickExternalNeighbor(state: GameState): { id: string; name: string } {
  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);

  const chosen = peaceful[0] ?? neighbors[0];
  if (!chosen) return { id: 'unknown', name: 'a foreign kingdom' };
  return {
    id: chosen.id,
    name: getNeighborDisplayName(chosen.id, state),
  };
}

/**
 * Tests whether all trigger conditions pass for a negotiation definition.
 */
function negotiationConditionsPass(
  def: NegotiationDefinition,
  state: GameState,
  turnNumber: number,
): boolean {
  return def.triggerConditions.every((c: EventTriggerCondition) =>
    evaluateCondition(c, state, turnNumber),
  );
}

/**
 * Resolves __NEIGHBOR__ placeholders in diplomacyDeltas with the actual neighborId.
 */
function resolveNeighborInEffects(
  delta: MechanicalEffectDelta,
  neighborId: string,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;
  const resolved: Record<string, number> = {};
  for (const [key, value] of Object.entries(delta.diplomacyDeltas)) {
    resolved[key === '__NEIGHBOR__' ? neighborId : key] = value;
  }
  return { ...delta, diplomacyDeltas: resolved };
}

/**
 * Generates a NegotiationCard from the eligible NEGOTIATION_POOL, or null if none qualify.
 */
export function generateNegotiationCard(
  state: GameState,
): NegotiationCard | null {
  const turnNumber = state.turn.turnNumber;

  // Filter eligible negotiations
  const eligible = NEGOTIATION_POOL.filter((def) =>
    negotiationConditionsPass(def, state, turnNumber),
  );

  if (eligible.length === 0) return null;

  // Weighted random selection. Seeded by run + turn so the same state
  // produces the same negotiation on re-render.
  const totalWeight = eligible.reduce((sum, def) => sum + def.weight, 0);
  let roll = turnRng(state, 'bridge:negotiation-select')() * totalWeight;
  let selected: NegotiationDefinition = eligible[0];
  for (const def of eligible) {
    roll -= def.weight;
    if (roll <= 0) {
      selected = def;
      break;
    }
  }

  const effects = NEGOTIATION_EFFECTS[selected.id];
  const text = NEGOTIATION_TEXT[selected.id];
  if (!effects || !text) return null;

  // For external negotiations, resolve neighbor references
  const neighbor = selected.context === 'external'
    ? pickExternalNeighbor(state)
    : { id: '', name: '' };

  const smartCtx = neighbor.id ? { neighborId: neighbor.id } : {};
  const resolveText = (s: string) => substituteSmartPlaceholders(s, state, smartCtx);

  // Build terms
  const terms: NegotiationTerm[] = selected.terms.map((termDef) => {
    const termEffects = effects[termDef.termId] ?? {};
    const resolved = selected.context === 'external'
      ? resolveNeighborInEffects(termEffects, neighbor.id)
      : termEffects;
    const termText = text.terms[termDef.termId];
    const bondKind = TERM_ID_TO_BOND_KIND[termDef.termId];
    const counterableValue = TERM_ID_TO_COUNTERABLE[termDef.termId];
    return {
      id: termDef.termId,
      title: termText?.title ?? termDef.termId,
      description: resolveText(termText?.description ?? ''),
      effects: resolved,
      effectHints: mechDeltaToEffectHints(resolved),
      isToggled: false,
      ...(bondKind ? { bondKind } : {}),
      ...(counterableValue ? { counterableValue } : {}),
    };
  });

  // Build reject effects
  const rejectEffectsRaw = effects[selected.rejectChoiceId] ?? {};
  const rejectEffects = selected.context === 'external'
    ? resolveNeighborInEffects(rejectEffectsRaw, neighbor.id)
    : rejectEffectsRaw;

  return {
    eventCard: {
      id: selected.id,
      title: resolveText(text.title),
      body: resolveText(text.body),
      family: 'advisor',
      effects: [],
    },
    terms,
    rejectEffects,
    rejectHints: mechDeltaToEffectHints(rejectEffects),
    contextLabel: text.contextLabel ?? 'NEGOTIATION',
    resolvedNeighborId: neighbor.id || undefined,
  };
}

/** Phase 4 — emit a unified `Card<'negotiation'>` envelope. */
export function generateNegotiationCardAsCard(
  state: GameState,
): CardOfFamily<'negotiation'> | null {
  const data = generateNegotiationCard(state);
  return data ? negotiationToCard(data) : null;
}
