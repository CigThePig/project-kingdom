// gameplay-blueprint.md §7 — Event Framework
// Pure engine logic for event surfacing, chain advancement, and choice resolution.
// No React imports. No player-facing text.

import {
  ActiveEvent,
  EventCategory,
  EventSeverity,
  GameState,
  PopulationClass,
  Season,
} from '../types';
import {
  MAX_CRITICAL_EVENTS_PER_TURN,
  MAX_EVENTS_PER_TURN,
  MAX_SERIOUS_EVENTS_PER_TURN,
} from '../constants';

// ============================================================
// Data Contract Interfaces (fulfilled by Phase 5 data layer)
// ============================================================

/**
 * A single trigger condition that must evaluate to true for an event to fire.
 * All conditions in EventDefinition.triggerConditions must pass simultaneously.
 */
export interface EventTriggerCondition {
  type:
    | 'treasury_below'
    | 'treasury_above'
    | 'food_below'
    | 'food_above'
    | 'stability_below'
    | 'stability_above'
    | 'class_satisfaction_below'
    | 'class_satisfaction_above'
    | 'faith_below'
    | 'faith_above'
    | 'heterodoxy_above'
    | 'schism_active'
    | 'military_readiness_below'
    | 'season_is'
    | 'turn_range'
    | 'random_chance'
    | 'consequence_tag_present'
    | 'consequence_tag_absent'
    | 'always';
  /** Numeric threshold for above/below condition types. */
  threshold?: number;
  /** Required for class_satisfaction_* conditions. */
  classTarget?: PopulationClass;
  /** Required for season_is condition. */
  season?: Season;
  /** Required for turn_range condition: inclusive lower bound. */
  minTurn?: number;
  /** Required for turn_range condition: inclusive upper bound. */
  maxTurn?: number;
  /** Required for random_chance condition: probability 0–1. */
  probability?: number;
  /** Required for consequence_tag_present / consequence_tag_absent conditions. */
  consequenceTag?: string;
  /** Optional: minimum turns elapsed since the consequence was recorded. */
  minTurnsSinceConsequence?: number;
}

/**
 * A single player-selectable response to an event.
 * The actual consequence text and mechanical effects live in the data layer.
 */
export interface EventChoiceDefinition {
  choiceId: string;
  /** 0 = free crisis response; 1 = consumes an action slot. */
  slotCost: number;
  isFree: boolean;
}

/**
 * The authoritative definition of an event type.
 * Instances (ActiveEvent) are created at runtime when conditions are met.
 */
export interface EventDefinition {
  id: string;
  severity: EventSeverity;
  category: EventCategory;
  /** All conditions must pass for this event to fire. */
  triggerConditions: EventTriggerCondition[];
  /**
   * Relative weight used when multiple events at the same severity qualify.
   * Higher weight increases selection likelihood.
   */
  weight: number;
  /** Non-null when this event is part of a multi-turn chain. */
  chainId: string | null;
  chainStep: number | null;
  /**
   * The definitionId of the next event in the chain after this one resolves.
   * Null for the final step of a chain or for standalone events.
   */
  chainNextDefinitionId: string | null;
  choices: EventChoiceDefinition[];
  /** When non-null, the engine assigns this class as the affectedClassId. */
  affectsClass: PopulationClass | null;
  /**
   * When true, the engine selects an eligible non-occupied region and sets
   * affectedRegionId on the resulting ActiveEvent.
   */
  affectsRegion: boolean;
  /** Links this event to an active or soon-to-activate storyline. */
  relatedStorylineId: string | null;
  /**
   * When true, this event definition can fire multiple times across a playthrough.
   * Non-repeatable events (default) are permanently excluded from surfacing once
   * they appear in eventHistory.
   */
  repeatable?: boolean;
  /**
   * Optional reactive follow-up events triggered by specific player choices.
   * When a player selects a matching choiceId, a follow-up event is scheduled
   * to surface after delayTurns with the given probability.
   */
  followUpEvents?: {
    triggerChoiceId: string;
    followUpDefinitionId: string;
    delayTurns: number;
    probability: number;
  }[];
}

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Numeric priority score for severity-based surfacing order. */
const SEVERITY_SCORE: Record<EventSeverity, number> = {
  [EventSeverity.Critical]: 4,
  [EventSeverity.Serious]: 3,
  [EventSeverity.Notable]: 2,
  [EventSeverity.Informational]: 1,
};

/**
 * Evaluates a single trigger condition against current game state.
 * Returns true when the condition is satisfied.
 */
function evaluateCondition(
  condition: EventTriggerCondition,
  state: GameState,
  turnNumber: number,
): boolean {
  switch (condition.type) {
    case 'always':
      return true;

    case 'treasury_below':
      return condition.threshold !== undefined && state.treasury.balance < condition.threshold;

    case 'treasury_above':
      return condition.threshold !== undefined && state.treasury.balance > condition.threshold;

    case 'food_below':
      return condition.threshold !== undefined && state.food.reserves < condition.threshold;

    case 'food_above':
      return condition.threshold !== undefined && state.food.reserves > condition.threshold;

    case 'stability_below':
      return condition.threshold !== undefined && state.stability.value < condition.threshold;

    case 'stability_above':
      return condition.threshold !== undefined && state.stability.value > condition.threshold;

    case 'class_satisfaction_below':
      if (condition.threshold === undefined || condition.classTarget === undefined) return false;
      return state.population[condition.classTarget].satisfaction < condition.threshold;

    case 'class_satisfaction_above':
      if (condition.threshold === undefined || condition.classTarget === undefined) return false;
      return state.population[condition.classTarget].satisfaction > condition.threshold;

    case 'faith_below':
      return (
        condition.threshold !== undefined && state.faithCulture.faithLevel < condition.threshold
      );

    case 'faith_above':
      return (
        condition.threshold !== undefined && state.faithCulture.faithLevel > condition.threshold
      );

    case 'heterodoxy_above':
      return (
        condition.threshold !== undefined && state.faithCulture.heterodoxy > condition.threshold
      );

    case 'schism_active':
      return state.faithCulture.schismActive;

    case 'military_readiness_below':
      return condition.threshold !== undefined && state.military.readiness < condition.threshold;

    case 'season_is':
      return condition.season !== undefined && state.turn.season === condition.season;

    case 'turn_range': {
      const min = condition.minTurn ?? 0;
      const max = condition.maxTurn ?? Infinity;
      return turnNumber >= min && turnNumber <= max;
    }

    case 'random_chance':
      return condition.probability !== undefined && Math.random() < condition.probability;

    case 'consequence_tag_present': {
      if (condition.consequenceTag === undefined) return false;
      const match = state.persistentConsequences.find(
        (c) => c.tag === condition.consequenceTag,
      );
      if (!match) return false;
      if (condition.minTurnsSinceConsequence !== undefined) {
        return (turnNumber - match.turnApplied) >= condition.minTurnsSinceConsequence;
      }
      return true;
    }

    case 'consequence_tag_absent': {
      if (condition.consequenceTag === undefined) return false;
      return !state.persistentConsequences.some(
        (c) => c.tag === condition.consequenceTag,
      );
    }

    default:
      return false;
  }
}

/**
 * Returns true when all of the definition's trigger conditions pass.
 */
function allConditionsPass(
  definition: EventDefinition,
  state: GameState,
  turnNumber: number,
): boolean {
  return definition.triggerConditions.every((c) => evaluateCondition(c, state, turnNumber));
}

/**
 * Picks an eligible (non-occupied) region ID for region-scoped events.
 * Returns null if no eligible region exists.
 */
function pickEligibleRegionId(state: GameState): string | null {
  const eligible = state.regions.filter((r) => !r.isOccupied);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].id;
}

/**
 * Constructs a fresh ActiveEvent instance from a definition.
 */
function buildActiveEvent(
  definition: EventDefinition,
  turnNumber: number,
  state: GameState,
): ActiveEvent {
  const id = `evt-${definition.id}-t${turnNumber}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    definitionId: definition.id,
    severity: definition.severity,
    category: definition.category,
    isResolved: false,
    choiceMade: null,
    chainId: definition.chainId,
    chainStep: definition.chainStep,
    turnSurfaced: turnNumber,
    affectedRegionId: definition.affectsRegion ? pickEligibleRegionId(state) : null,
    affectedClassId: definition.affectsClass,
    relatedStorylineId: definition.relatedStorylineId,
    outcomeQuality: null,
    isFollowUp: false,
    followUpSourceId: null,
  };
}

// ============================================================
// Exported Functions
// ============================================================

/**
 * Evaluates the event pool against the current game state and returns new
 * ActiveEvents to surface this turn.
 *
 * Surfacing rules (§7):
 * - Never resurfaces a definitionId already present in existingActive or eventHistory.
 * - Chain events are not surfaced here — use advanceEventChains for those.
 * - Caps: MAX_EVENTS_PER_TURN total, MAX_CRITICAL_EVENTS_PER_TURN Critical,
 *   MAX_SERIOUS_EVENTS_PER_TURN Serious, remainder Notable/Informational.
 * - Within each severity tier, candidates are sorted by descending weight then
 *   selected until the tier cap is reached.
 */
export function surfaceEvents(
  state: GameState,
  turnNumber: number,
  eventPool: EventDefinition[],
  existingActive: ActiveEvent[],
  eventHistory: ActiveEvent[],
  categoryWeights?: Partial<Record<EventCategory, number>>,
): ActiveEvent[] {
  if (eventPool.length === 0) return [];

  // Build a set of already-seen definitionIds to prevent re-surfacing.
  // Repeatable events are only blocked by existingActive (to prevent same-turn duplicates),
  // not by eventHistory (so they can recur across turns).
  const repeatableIds = new Set<string>(
    eventPool.filter((d) => d.repeatable).map((d) => d.id),
  );
  const seenDefinitionIds = new Set<string>([
    ...existingActive.map((e) => e.definitionId),
    ...eventHistory
      .filter((e) => !repeatableIds.has(e.definitionId))
      .map((e) => e.definitionId),
  ]);

  // Exclude chain events — they are managed by advanceEventChains.
  const candidates = eventPool.filter(
    (def) =>
      (def.chainId === null || def.chainStep === 1) &&
      !seenDefinitionIds.has(def.id) &&
      allConditionsPass(def, state, turnNumber),
  );

  // Sort by severity (desc) then weight (desc), with optional category multipliers.
  candidates.sort((a, b) => {
    const severityDiff = SEVERITY_SCORE[b.severity] - SEVERITY_SCORE[a.severity];
    if (severityDiff !== 0) return severityDiff;
    const wa = a.weight * (categoryWeights?.[a.category] ?? 1.0);
    const wb = b.weight * (categoryWeights?.[b.category] ?? 1.0);
    return wb - wa;
  });

  const result: ActiveEvent[] = [];
  let criticalCount = 0;
  let seriousCount = 0;

  for (const def of candidates) {
    if (result.length >= MAX_EVENTS_PER_TURN) break;

    if (def.severity === EventSeverity.Critical) {
      if (criticalCount >= MAX_CRITICAL_EVENTS_PER_TURN) continue;
      criticalCount++;
    } else if (def.severity === EventSeverity.Serious) {
      if (seriousCount >= MAX_SERIOUS_EVENTS_PER_TURN) continue;
      seriousCount++;
    }

    result.push(buildActiveEvent(def, turnNumber, state));
  }

  return result;
}

/**
 * Advances active event chains by one step.
 *
 * For each resolved event that belongs to a chain (chainNextDefinitionId is set),
 * the corresponding next-step definition is located in the pool and a new
 * ActiveEvent is created for it. Resolved chain events are dropped from the
 * returned list; unresolved events pass through unchanged.
 *
 * Returns the updated active event list (no resolved chain events, plus any
 * new chain-step events).
 */
export function advanceEventChains(
  activeEvents: ActiveEvent[],
  turnNumber: number,
  eventPool: EventDefinition[],
  eventHistory: ActiveEvent[],
): ActiveEvent[] {
  if (eventPool.length === 0) return activeEvents;

  const definitionById = new Map<string, EventDefinition>(eventPool.map((d) => [d.id, d]));
  const seenDefinitionIds = new Set<string>(eventHistory.map((e) => e.definitionId));

  const surviving: ActiveEvent[] = [];
  const newChainEvents: ActiveEvent[] = [];

  for (const event of activeEvents) {
    if (!event.isResolved) {
      surviving.push(event);
      continue;
    }

    // Resolved and part of a chain — look up the next step.
    const currentDef = definitionById.get(event.definitionId);
    if (!currentDef || currentDef.chainNextDefinitionId === null) {
      // No next step; the resolved event is simply dropped (archived by caller).
      continue;
    }

    const nextDef = definitionById.get(currentDef.chainNextDefinitionId);
    if (!nextDef || seenDefinitionIds.has(nextDef.id)) {
      // Next definition not found or already seen — skip.
      continue;
    }

    // Carry the chain/region context forward.
    const nextEvent: ActiveEvent = {
      id: `evt-${nextDef.id}-t${turnNumber}-${Math.random().toString(36).slice(2, 8)}`,
      definitionId: nextDef.id,
      severity: nextDef.severity,
      category: nextDef.category,
      isResolved: false,
      choiceMade: null,
      chainId: nextDef.chainId,
      chainStep: nextDef.chainStep,
      turnSurfaced: turnNumber,
      affectedRegionId: nextDef.affectsRegion ? event.affectedRegionId : null,
      affectedClassId: nextDef.affectsClass,
      relatedStorylineId: nextDef.relatedStorylineId,
      outcomeQuality: null,
      isFollowUp: false,
      followUpSourceId: null,
    };
    newChainEvents.push(nextEvent);
  }

  return [...surviving, ...newChainEvents];
}

/**
 * Marks an event resolved with the given player choice.
 * Returns a new ActiveEvent (immutable update); the caller is responsible for
 * replacing the old instance in state.
 *
 * Called by turn resolution when processing ActionType.CrisisResponse actions.
 */
export function resolveEventChoice(event: ActiveEvent, choiceId: string): ActiveEvent {
  return {
    ...event,
    isResolved: true,
    choiceMade: choiceId,
  };
}

// ============================================================
// Internal guard (unused variable suppression)
// ============================================================

// clamp is defined for future internal use within severity/weight calculations.
void clamp;
