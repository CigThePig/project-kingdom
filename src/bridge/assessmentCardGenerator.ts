// Bridge Layer — Assessment Card Generator
// Filters ASSESSMENT_POOL by trigger conditions and produces assessment card data
// for the monthly court business phase. Reuses CrisisPhaseData shape since
// assessments are functionally identical to crises (1 event + 2-3 responses).

import type { GameState } from '../engine/types';
import { evaluateCondition } from '../engine/events/event-engine';
import type { EventTriggerCondition, EventDefinition } from '../engine/events/event-engine';
import { ASSESSMENT_POOL } from '../data/events/assessments';
import { ASSESSMENT_EFFECTS } from '../data/events/assessment-effects';
import { ASSESSMENT_TEXT } from '../data/text/assessments';
import { turnRng } from '../engine/resolution/turn-rng';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { substituteSmartPlaceholders } from './smartText';
import type { CrisisPhaseData, CrisisCardData, ResponseCardData } from './crisisCardGenerator';
import type { ConfidenceLevel } from '../ui/types';
import type { MechanicalEffectDelta } from '../engine/types';
import type { CardOfFamily } from '../engine/cards/types';
import { assessmentToCard } from '../engine/cards/adapters';

export interface AssessmentPhaseData {
  crisisData: CrisisPhaseData;
  confidenceLevel: ConfidenceLevel;
  /** Neighbor resolved at generation time; prevents retargeting at resolution. */
  resolvedNeighborId?: string;
}

/**
 * Derive a confidence level from an assessment's trigger conditions.
 * More conditions = higher confidence (more specific intelligence).
 */
function deriveConfidenceLevel(def: EventDefinition): ConfidenceLevel {
  const condCount = def.triggerConditions.length;
  if (condCount >= 3) return 'high';
  if (condCount >= 2) return 'moderate';
  return 'low';
}

/**
 * Resolves __NEIGHBOR__ in diplomacyDeltas with the first non-warring neighbor.
 */
function resolveNeighborInEffects(
  delta: MechanicalEffectDelta,
  state: GameState,
): MechanicalEffectDelta {
  if (!delta.diplomacyDeltas) return delta;
  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  const neighborId = peaceful[0]?.id ?? neighbors[0]?.id ?? 'unknown';

  const resolved: Record<string, number> = {};
  for (const [key, value] of Object.entries(delta.diplomacyDeltas)) {
    resolved[key === '__NEIGHBOR__' ? neighborId : key] = value;
  }
  return { ...delta, diplomacyDeltas: resolved };
}

/**
 * Generates assessment card data from the eligible ASSESSMENT_POOL, or null if none qualify.
 */
export function generateAssessmentPhaseData(
  state: GameState,
): AssessmentPhaseData | null {
  const turnNumber = state.turn.turnNumber;

  // Filter eligible assessments
  const eligible = ASSESSMENT_POOL.filter((def) =>
    def.triggerConditions.every((c: EventTriggerCondition) =>
      evaluateCondition(c, state, turnNumber),
    ),
  );

  if (eligible.length === 0) return null;

  // Weighted random selection. Seeded by run + turn so remounting the
  // Assessment screen for the same state picks the same assessment.
  const totalWeight = eligible.reduce((sum, def) => sum + def.weight, 0);
  let roll = turnRng(state, 'bridge:assessment-select')() * totalWeight;
  let selected: EventDefinition = eligible[0];
  for (const def of eligible) {
    roll -= def.weight;
    if (roll <= 0) {
      selected = def;
      break;
    }
  }

  const effects = ASSESSMENT_EFFECTS[selected.id];
  const text = ASSESSMENT_TEXT[selected.id];
  if (!effects || !text) return null;

  // Resolve neighbor once and reuse for all choices.
  const neighbors = state.diplomacy.neighbors;
  const peaceful = neighbors
    .filter((n) => !n.isAtWarWithPlayer)
    .sort((a, b) => b.relationshipScore - a.relationshipScore);
  const resolvedNeighborId = peaceful[0]?.id ?? neighbors[0]?.id ?? undefined;

  const confidenceLevel = deriveConfidenceLevel(selected);
  const smartCtx = {
    ...(resolvedNeighborId ? { neighborId: resolvedNeighborId } : {}),
    confidenceLevel,
  };

  // Build crisis card (assessment card)
  const crisisCard: CrisisCardData = {
    eventId: `assessment:${selected.id}`,
    definitionId: selected.id,
    title: substituteSmartPlaceholders(text.title, state, smartCtx),
    body: substituteSmartPlaceholders(text.body, state, smartCtx),
    effects: [],
  };

  // Build response cards from choices
  // Assessments don't have ruling-style tags or follow-up definitions,
  // so signals are empty. If assessment style tags are authored later,
  // a dedicated extractor should be wired here.
  const responses: ResponseCardData[] = selected.choices.map((choice) => {
    const choiceEffects = effects[choice.choiceId] ?? {};
    const resolved = resolveNeighborInEffects(choiceEffects, state);
    return {
      id: `assessment:${selected.id}:${choice.choiceId}`,
      choiceId: choice.choiceId,
      title: substituteSmartPlaceholders(
        text.choices[choice.choiceId] ?? choice.choiceId,
        state,
        smartCtx,
      ),
      effects: mechDeltaToEffectHints(resolved),
      signals: [],
      slotCost: choice.slotCost,
      isFree: choice.isFree,
    };
  });

  return {
    crisisData: { crisisCard, responses },
    confidenceLevel,
    resolvedNeighborId,
  };
}

/** Phase 4 — emit a unified `Card<'assessment'>` envelope. */
export function generateAssessmentCard(
  state: GameState,
): CardOfFamily<'assessment'> | null {
  const data = generateAssessmentPhaseData(state);
  if (!data) return null;
  const def = ASSESSMENT_POOL.find((d) => d.id === data.crisisData.crisisCard.definitionId);
  return assessmentToCard(data, def);
}
