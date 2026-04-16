// Bridge Layer — Context Extractor
// Pure functions that read GameState and produce targeted ContextLine[]
// for card enrichment. Centralizes all "why is this happening" logic.

import type { GameState, ActiveEvent, CausalLedger, PopulationClass } from '../engine/types';
import {
  EventCategory,
  ConditionType,
  ConditionSeverity,
  EconomicPhase,
  DiplomaticPosture,
  StyleAxis,
  KnowledgeBranch,
} from '../engine/types';
import type { ContextLine } from '../ui/types';
import { CONDITION_TYPE_LABELS, CONDITION_SEVERITY_LABELS, ECONOMIC_PHASE_LABELS } from '../data/text/labels';
import { NEIGHBOR_LABELS, CLASS_LABELS, REGION_LABELS, DIPLOMATIC_POSTURE_LABELS, KNOWLEDGE_BRANCH_LABELS } from '../data/text/labels';

// ============================================================
// Positive condition types (for tone classification)
// ============================================================

const POSITIVE_CONDITIONS = new Set<ConditionType>([
  ConditionType.BountifulHarvest,
  ConditionType.GoldenAge,
  ConditionType.HarvestFestival,
  ConditionType.PilgrimageSeason,
  ConditionType.MilitaryTriumph,
]);

// ============================================================
// Category → relevant condition types mapping
// ============================================================

const CATEGORY_CONDITION_MAP: Partial<Record<EventCategory, ConditionType[]>> = {
  [EventCategory.Food]: [ConditionType.Drought, ConditionType.Blight, ConditionType.Famine, ConditionType.BountifulHarvest, ConditionType.HarvestFestival, ConditionType.Flood],
  [EventCategory.Environment]: [ConditionType.Drought, ConditionType.Flood, ConditionType.HarshWinter, ConditionType.Blight, ConditionType.Pestilence],
  [EventCategory.PublicOrder]: [ConditionType.Banditry, ConditionType.Unrest, ConditionType.CriminalUnderworld, ConditionType.Corruption],
  [EventCategory.Economy]: [ConditionType.TradeDisruption, ConditionType.MarketPanic],
  [EventCategory.Military]: [ConditionType.MilitaryTriumph],
  [EventCategory.Religion]: [ConditionType.PilgrimageSeason],
};

// ============================================================
// Individual context extractors
// ============================================================

/**
 * Finds active conditions relevant to the given event category and region.
 * Returns a context line describing the most severe matching condition.
 */
export function extractConditionContext(
  state: GameState,
  category: EventCategory | null,
  regionId: string | null,
): ContextLine | null {
  if (!state.environment?.activeConditions?.length) return null;

  const relevantTypes = category ? CATEGORY_CONDITION_MAP[category] ?? null : null;

  // Filter conditions: match by category relevance OR by region
  const matching = state.environment.activeConditions.filter((c) => {
    if (relevantTypes && relevantTypes.includes(c.type)) return true;
    if (regionId && c.regionId === regionId) return true;
    // If no category filter, show any severe condition
    if (!relevantTypes && c.severity === ConditionSeverity.Severe) return true;
    return false;
  });

  if (matching.length === 0) return null;

  // Pick the most severe, then longest-running
  const sorted = [...matching].sort((a, b) => {
    const sevOrder = { Severe: 3, Moderate: 2, Mild: 1 };
    const sevDiff = (sevOrder[b.severity] ?? 0) - (sevOrder[a.severity] ?? 0);
    if (sevDiff !== 0) return sevDiff;
    return b.turnsActive - a.turnsActive;
  });

  const cond = sorted[0];
  const label = CONDITION_TYPE_LABELS[cond.type];
  const severity = CONDITION_SEVERITY_LABELS[cond.severity];
  const isPositive = POSITIVE_CONDITIONS.has(cond.type);

  let text = `${label} (${severity})`;
  if (cond.turnsActive > 0) text += ` — ${cond.turnsActive} turn${cond.turnsActive !== 1 ? 's' : ''} active`;
  if (cond.canEscalate && cond.escalatesTo && !isPositive) {
    text += `, risk of ${CONDITION_TYPE_LABELS[cond.escalatesTo]}`;
  }

  const tone: ContextLine['tone'] = isPositive
    ? 'opportunity'
    : cond.severity === ConditionSeverity.Severe ? 'crisis' : 'pressure';

  return { text, tone };
}

/**
 * Returns economic phase + momentum context when noteworthy.
 */
export function extractEconomicContext(state: GameState): ContextLine | null {
  if (!state.economy) return null;

  const phase = state.economy.cyclePhase;
  // Only surface when economy is notably bad or good (skip Stagnation)
  if (phase === EconomicPhase.Stagnation) {
    // Still surface if inflation is high or merchant confidence is very low
    if (state.economy.inflationRate < 0.15 && state.economy.merchantConfidence > 30) {
      return null;
    }
  }

  const phaseLabel = ECONOMIC_PHASE_LABELS[phase];
  const momentum = state.economy.economicMomentum;
  let direction = '';
  if (momentum > 20) direction = ', momentum rising';
  else if (momentum < -20) direction = ', momentum falling';

  let text = `Economy: ${phaseLabel}${direction}`;

  // Add merchant confidence if critically low
  if (state.economy.merchantConfidence < 30) {
    text += ` — merchant confidence low (${Math.round(state.economy.merchantConfidence)})`;
  }
  // Add inflation note if high
  if (state.economy.inflationRate >= 0.15) {
    text += ` — inflation ${Math.round(state.economy.inflationRate * 100)}%`;
  }

  const tone: ContextLine['tone'] =
    phase === EconomicPhase.Depression || phase === EconomicPhase.Recession
      ? 'pressure'
      : phase === EconomicPhase.Growth || phase === EconomicPhase.Boom
      ? 'opportunity'
      : 'info';

  return { text, tone };
}

/**
 * Returns context about a specific population class when satisfaction
 * is low or dropping fast.
 */
export function extractClassPressureContext(
  state: GameState,
  classId: PopulationClass | null,
): ContextLine | null {
  if (!classId) return null;

  const classState = state.population[classId];
  if (!classState) return null;

  const sat = classState.satisfaction;
  const delta = classState.satisfactionDeltaLastTurn;

  // Only surface when satisfaction is low (<40) or dropping fast (delta <= -5)
  if (sat >= 40 && delta > -5) return null;

  const className = CLASS_LABELS[classId];
  let text = `${className}: satisfaction ${Math.round(sat)}`;
  if (delta !== 0) {
    text += ` (${delta > 0 ? '↑' : '↓'}${Math.abs(Math.round(delta))} last turn)`;
  }

  const tone: ContextLine['tone'] = sat < 25 ? 'crisis' : 'pressure';
  return { text, tone };
}

/**
 * Returns context about a specific neighbor's diplomatic status.
 */
export function extractDiplomacyContext(
  state: GameState,
  neighborId: string | null,
): ContextLine | null {
  if (!neighborId) return null;

  const neighbor = state.diplomacy.neighbors.find((n) => n.id === neighborId);
  if (!neighbor) return null;

  const posture = neighbor.attitudePosture;
  // Only surface when relationship is tense or worse
  if (posture === DiplomaticPosture.Friendly || posture === DiplomaticPosture.Neutral) {
    return null;
  }

  const name = NEIGHBOR_LABELS[neighborId] ?? neighborId;
  const postureLabel = DIPLOMATIC_POSTURE_LABELS[posture];
  const text = `${name}: ${postureLabel} (relations ${Math.round(neighbor.relationshipScore)})`;

  const tone: ContextLine['tone'] = posture === DiplomaticPosture.War ? 'crisis' : 'pressure';
  return { text, tone };
}

/**
 * Returns context about population dynamics when extreme.
 */
export function extractPopulationContext(state: GameState): ContextLine | null {
  if (!state.populationDynamics) return null;

  const pd = state.populationDynamics;

  if (pd.currentTotalPopulation > pd.housingCapacity) {
    const excess = pd.currentTotalPopulation - pd.housingCapacity;
    return {
      text: `Overcrowding — population exceeds housing by ${excess}`,
      tone: 'pressure',
    };
  }

  if (pd.migrationPressure < -30) {
    return {
      text: `People fleeing — migration pressure ${Math.round(pd.migrationPressure)}`,
      tone: pd.migrationPressure < -50 ? 'crisis' : 'pressure',
    };
  }

  if (pd.migrationPressure > 30) {
    return {
      text: `Migrants arriving — migration pressure +${Math.round(pd.migrationPressure)}`,
      tone: 'opportunity',
    };
  }

  if (pd.recentDeathSurplus > pd.recentBirthSurplus * 1.5 && pd.recentDeathSurplus > 0) {
    return {
      text: `Population declining — deaths outpace births`,
      tone: 'pressure',
    };
  }

  return null;
}

/**
 * Returns the highest-magnitude causal chain matching a target system.
 * Falls back to the overall highest-magnitude chain if no system match.
 */
export function extractCausalSnippet(
  ledger: CausalLedger | undefined,
  targetSystem: string | null,
): ContextLine | null {
  if (!ledger) return null;

  const chains = ledger.recentChains;
  if (chains.length === 0) return null;

  // Try to match target system first
  let match = targetSystem
    ? chains.find((c) => c.rootCause.system === targetSystem || c.finalEffect.system === targetSystem)
    : null;

  // Fall back to highest magnitude
  if (!match) {
    const sorted = [...chains].sort((a, b) => b.totalMagnitude - a.totalMagnitude);
    match = sorted[0];
  }

  if (!match) return null;

  const text = `${match.rootCause.description} → ${match.finalEffect.description}`;
  const tone: ContextLine['tone'] = match.totalMagnitude < 0 ? 'pressure' : 'info';
  return { text, tone };
}

/**
 * Returns faith-related context when relevant.
 */
function extractFaithContext(state: GameState): ContextLine | null {
  if (state.faithCulture.schismActive) {
    return { text: 'Religious schism divides the faithful', tone: 'crisis' };
  }
  if (state.faithCulture.heterodoxy > 60) {
    return {
      text: `Heterodoxy rising (${Math.round(state.faithCulture.heterodoxy)})`,
      tone: 'pressure',
    };
  }
  if (state.faithCulture.faithLevel < 30) {
    return {
      text: `Faith waning (${Math.round(state.faithCulture.faithLevel)})`,
      tone: 'pressure',
    };
  }
  return null;
}

/**
 * Returns regional context for a specific region.
 */
function extractRegionContext(
  state: GameState,
  regionId: string | null,
): ContextLine | null {
  if (!regionId) return null;

  const region = state.regions?.find((r) => r.id === regionId);
  if (!region) return null;

  const name = REGION_LABELS[regionId] ?? regionId;
  const loyalty = region.loyalty;

  if (loyalty !== undefined && loyalty < 40) {
    let text = `${name}: loyalty ${Math.round(loyalty)}`;
    if (loyalty < 25) text += ' — separatist risk';
    return {
      text,
      tone: loyalty < 25 ? 'crisis' : 'pressure',
    };
  }

  // Infrastructure decay warning
  if (region.infrastructure) {
    const infra = region.infrastructure;
    const decaying = [
      infra.roads < 30 ? 'roads' : null,
      infra.walls < 30 ? 'walls' : null,
      infra.granaries < 30 ? 'granaries' : null,
      infra.sanitation < 30 ? 'sanitation' : null,
    ].filter(Boolean);
    if (decaying.length >= 2) {
      return {
        text: `${name}: infrastructure decaying (${decaying.join(', ')})`,
        tone: 'pressure',
      };
    }
  }

  return null;
}

// ============================================================
// Category → system name for causal chain matching
// ============================================================

const CATEGORY_SYSTEM_MAP: Partial<Record<EventCategory, string>> = {
  [EventCategory.Food]: 'food',
  [EventCategory.Economy]: 'treasury',
  [EventCategory.Military]: 'military',
  [EventCategory.Diplomacy]: 'diplomacy',
  [EventCategory.Environment]: 'environment',
  [EventCategory.PublicOrder]: 'stability',
  [EventCategory.Religion]: 'faith',
  [EventCategory.Culture]: 'culture',
  [EventCategory.Espionage]: 'espionage',
  [EventCategory.Knowledge]: 'knowledge',
  [EventCategory.ClassConflict]: 'population',
  [EventCategory.Region]: 'regions',
};

// ============================================================
// Main dispatcher: extract context lines for an event
// ============================================================

/**
 * Extracts up to `limit` context lines for an event, using the event's metadata
 * (category, region, class, neighbor) to pick the most relevant extractors.
 * Default limit is 2 for petitions, pass 4 for crisis cards.
 *
 * Priority: active conditions > economic phase > class pressure >
 *           diplomacy > region > faith > public order > causal chain >
 *           persistent consequences > population
 */
export function extractEventContext(
  state: GameState,
  event: ActiveEvent,
  limit: number = 2,
): ContextLine[] {
  const lines: ContextLine[] = [];

  // 1. Active conditions matching the event's domain
  const condLine = extractConditionContext(state, event.category, event.affectedRegionId);
  if (condLine) lines.push(condLine);

  // 2. Economic context for economy/trade events
  if (lines.length < limit && (
    event.category === EventCategory.Economy ||
    event.category === EventCategory.Food
  )) {
    const econLine = extractEconomicContext(state);
    if (econLine) lines.push(econLine);
  }

  // 3. Class pressure for class-related events
  if (lines.length < limit && event.affectedClassId) {
    const classLine = extractClassPressureContext(state, event.affectedClassId);
    if (classLine) lines.push(classLine);
  }

  // 4. Diplomacy context for neighbor-related events
  if (lines.length < limit && event.affectedNeighborId) {
    const diploLine = extractDiplomacyContext(state, event.affectedNeighborId);
    if (diploLine) lines.push(diploLine);
  }

  // 5. Region context
  if (lines.length < limit && event.affectedRegionId) {
    const regionLine = extractRegionContext(state, event.affectedRegionId);
    if (regionLine) lines.push(regionLine);
  }

  // 6. Faith context for religion events
  if (lines.length < limit && event.category === EventCategory.Religion) {
    const faithLine = extractFaithContext(state);
    if (faithLine) lines.push(faithLine);
  }

  // 7. Public order → class pressure for lowest class
  if (lines.length < limit && event.category === EventCategory.PublicOrder && !event.affectedClassId) {
    const lowestClass = findLowestSatisfactionClass(state);
    if (lowestClass) {
      const classLine = extractClassPressureContext(state, lowestClass);
      if (classLine) lines.push(classLine);
    }
  }

  // 8. Causal chain as fallback
  if (lines.length < limit) {
    const system = CATEGORY_SYSTEM_MAP[event.category] ?? null;
    const causalLine = extractCausalSnippet(state.causalLedger, system);
    if (causalLine) lines.push(causalLine);
  }

  // 9. Persistent consequence context — show when a prior decision tag
  //    is relevant to this event's category
  if (lines.length < limit) {
    const pcLine = extractPersistentConsequenceContext(state, event.category);
    if (pcLine) lines.push(pcLine);
  }

  // 10. Population dynamics as final fallback
  if (lines.length < limit) {
    const popLine = extractPopulationContext(state);
    if (popLine) lines.push(popLine);
  }

  return lines.slice(0, limit);
}

// ============================================================
// Decree context: what makes this decree relevant right now?
// ============================================================

/**
 * Extracts up to 3 context lines for a decree based on its category.
 * Includes knowledge milestone context when a branch just opened new options.
 */
export function extractDecreeContext(
  state: GameState,
  category: string,
): ContextLine[] {
  const lines: ContextLine[] = [];

  // Knowledge milestone — shown first when a branch just unlocked something
  const knowledgeLine = extractKnowledgeContext(state, category);
  if (knowledgeLine) lines.push(knowledgeLine);

  switch (category) {
    case 'Economic': {
      const econLine = extractEconomicContext(state);
      if (econLine) lines.push(econLine);
      if (lines.length < 3) {
        const condLine = extractConditionContext(state, EventCategory.Economy, null);
        if (condLine) lines.push(condLine);
      }
      break;
    }
    case 'Military': {
      // Find most threatening neighbor
      const tensest = state.diplomacy.neighbors
        .filter((n) => n.attitudePosture === DiplomaticPosture.War || n.attitudePosture === DiplomaticPosture.Hostile)
        .sort((a, b) => a.relationshipScore - b.relationshipScore)[0];
      if (tensest) {
        const diploLine = extractDiplomacyContext(state, tensest.id);
        if (diploLine) lines.push(diploLine);
      }
      if (lines.length < 3) {
        const milClass = extractClassPressureContext(state, 'MilitaryCaste' as PopulationClass);
        if (milClass) lines.push(milClass);
      }
      break;
    }
    case 'Civic': {
      const popLine = extractPopulationContext(state);
      if (popLine) lines.push(popLine);
      if (lines.length < 3) {
        const lowestClass = findLowestSatisfactionClass(state);
        if (lowestClass) {
          const classLine = extractClassPressureContext(state, lowestClass);
          if (classLine) lines.push(classLine);
        }
      }
      break;
    }
    case 'Religious': {
      const faithLine = extractFaithContext(state);
      if (faithLine) lines.push(faithLine);
      break;
    }
    case 'Diplomatic': {
      // Show the most concerning neighbor
      const worst = state.diplomacy.neighbors
        .sort((a, b) => a.relationshipScore - b.relationshipScore)[0];
      if (worst) {
        const diploLine = extractDiplomacyContext(state, worst.id);
        if (diploLine) lines.push(diploLine);
      }
      break;
    }
    case 'Social': {
      const condLine = extractConditionContext(state, EventCategory.PublicOrder, null);
      if (condLine) lines.push(condLine);
      if (lines.length < 3) {
        const lowestClass = findLowestSatisfactionClass(state);
        if (lowestClass) {
          const classLine = extractClassPressureContext(state, lowestClass);
          if (classLine) lines.push(classLine);
        }
      }
      break;
    }
    default: {
      const econLine = extractEconomicContext(state);
      if (econLine) lines.push(econLine);
      break;
    }
  }

  return lines.slice(0, 3);
}

// ============================================================
// Knowledge context: surfaces when a branch recently unlocked a milestone
// ============================================================

/**
 * Returns context when a knowledge branch has just reached a new milestone
 * (unlocked advancements count > 0 and milestone is recent).
 * Useful on decree cards whose prerequisites just became available.
 */
export function extractKnowledgeContext(
  state: GameState,
  category?: string,
): ContextLine | null {
  if (!state.knowledge) return null;

  // Map decree categories to relevant knowledge branches
  const branchForCategory: Record<string, KnowledgeBranch> = {
    Military: KnowledgeBranch.Military,
    Economic: KnowledgeBranch.MaritimeTrade,
    Civic: KnowledgeBranch.Civic,
    Religious: KnowledgeBranch.CulturalScholarly,
    Social: KnowledgeBranch.Civic,
    Diplomatic: KnowledgeBranch.MaritimeTrade,
  };

  // Find the most advanced branch or the category-matched branch
  const targetBranch = category ? branchForCategory[category] : null;
  const branches = Object.values(state.knowledge.branches);

  // Pick the branch that just unlocked something
  const recentlyAdvanced = branches.filter(
    (b) => b.unlockedAdvancements.length > 0 && b.currentMilestoneIndex > 0,
  );
  if (recentlyAdvanced.length === 0) return null;

  // Prefer the category-matched branch if it advanced, otherwise pick highest
  let best = targetBranch
    ? recentlyAdvanced.find((b) => b.branch === targetBranch)
    : null;
  if (!best) {
    best = recentlyAdvanced.sort(
      (a, b) => b.currentMilestoneIndex - a.currentMilestoneIndex,
    )[0];
  }
  if (!best) return null;

  const branchLabel = KNOWLEDGE_BRANCH_LABELS[best.branch];
  const milestone = best.currentMilestoneIndex;
  return {
    text: `${branchLabel}: milestone ${milestone} reached — new options available`,
    tone: 'opportunity',
  };
}

// ============================================================
// Ruling-style context: shows current reign drift on dawn cards
// ============================================================

const AXIS_POSITIVE_NAMES: Record<StyleAxis, string> = {
  [StyleAxis.Authority]: 'Authoritarian',
  [StyleAxis.Economy]:   'Mercantilist',
  [StyleAxis.Military]:  'Martial',
  [StyleAxis.Faith]:     'Theocratic',
};

const AXIS_NEGATIVE_NAMES: Record<StyleAxis, string> = {
  [StyleAxis.Authority]: 'Permissive',
  [StyleAxis.Economy]:   'Populist',
  [StyleAxis.Military]:  'Pacifist',
  [StyleAxis.Faith]:     'Secular',
};

/**
 * Returns a context line summarizing the player's ruling style drift.
 * Only surfaces when at least one axis has a notable lean (|value| >= 15).
 * Designed for dawn/advisor cards — the reflective moment in the round loop.
 */
export function extractRulingStyleContext(state: GameState): ContextLine | null {
  if (!state.rulingStyle) return null;

  const axes = state.rulingStyle.axes;
  const notable: string[] = [];

  for (const axis of Object.values(StyleAxis)) {
    const value = axes[axis];
    if (Math.abs(value) >= 15) {
      const label = value > 0
        ? AXIS_POSITIVE_NAMES[axis]
        : AXIS_NEGATIVE_NAMES[axis];
      notable.push(label);
    }
  }

  if (notable.length === 0) return null;

  const text = `Your reign leans ${notable.join(', ')}`;
  return { text, tone: 'info' };
}

// ============================================================
// Persistent consequence context: when a prior decision tag
// is about to interact with the current situation
// ============================================================

/**
 * Maps event categories to consequence tag prefixes that are relevant.
 */
const CATEGORY_CONSEQUENCE_PREFIXES: Partial<Record<EventCategory, string[]>> = {
  [EventCategory.Economy]: ['merchant', 'trade', 'treasury', 'tax'],
  [EventCategory.Food]: ['harvest', 'famine', 'grain', 'food'],
  [EventCategory.Military]: ['military', 'army', 'border', 'desertion'],
  [EventCategory.Religion]: ['heresy', 'clergy', 'faith', 'schism', 'prophecy'],
  [EventCategory.PublicOrder]: ['unrest', 'bandit', 'crime', 'labor'],
  [EventCategory.Diplomacy]: ['neighbor', 'trade_war', 'treaty', 'envoy'],
  [EventCategory.ClassConflict]: ['noble', 'merchant', 'commoner', 'labor'],
  [EventCategory.Espionage]: ['intelligence', 'agent', 'spy'],
};

/**
 * Returns context when a persistent consequence from a prior decision
 * is relevant to the current event's category. This makes visible
 * the "your past decisions shape current outcomes" loop.
 */
export function extractPersistentConsequenceContext(
  state: GameState,
  category: EventCategory | null,
): ContextLine | null {
  if (!category || !state.persistentConsequences?.length) return null;

  const prefixes = CATEGORY_CONSEQUENCE_PREFIXES[category];
  if (!prefixes) return null;

  // Find the most recent consequence whose tag matches any prefix
  const sorted = [...state.persistentConsequences].sort(
    (a, b) => b.turnApplied - a.turnApplied,
  );

  for (const consequence of sorted) {
    const tagLower = consequence.tag.toLowerCase();
    if (prefixes.some((prefix) => tagLower.includes(prefix))) {
      const turnsAgo = state.turn.turnNumber - consequence.turnApplied;
      const timeLabel = turnsAgo === 1
        ? 'last turn'
        : turnsAgo <= 3
        ? `${turnsAgo} turns ago`
        : 'earlier';
      return {
        text: `Prior decision (${timeLabel}) shapes this outcome`,
        tone: 'info',
      };
    }
  }

  return null;
}

// ============================================================
// Helpers
// ============================================================

function findLowestSatisfactionClass(state: GameState): PopulationClass | null {
  let lowest: PopulationClass | null = null;
  let lowestSat = 100;

  for (const [classId, classState] of Object.entries(state.population)) {
    if (classState.satisfaction < lowestSat) {
      lowestSat = classState.satisfaction;
      lowest = classId as PopulationClass;
    }
  }

  // Only return if satisfaction is concerning
  return lowestSat < 40 ? lowest : null;
}
