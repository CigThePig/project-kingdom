// Bridge Layer — World Pulse Generator
// Generates 1-2 World Pulse lines for the current month.
// Lines are flavor text — informational, not actionable.

import { SeasonMonth, WorldPulseCategory } from '../engine/types';
import type { GameState } from '../engine/types';
import type { WorldPulseLine } from '../ui/types';
import { WORLD_PULSE_TEMPLATES } from '../data/text/world-pulse';
import type { WorldPulseTemplate } from '../data/text/world-pulse';
import { WORLD_PULSE_RECLASSIFIED } from '../data/text/world-pulse-reclassified';
import {
  INTER_RIVAL_ALLIANCE_LINES,
  INTER_RIVAL_WAR_LINES,
  INTER_RIVAL_TRADE_LINES,
  INTER_RIVAL_SKIRMISH_LINES,
} from '../data/text/inter-rival-pulse';
import { evaluateCondition } from '../engine/events/event-engine';
import { getInterRivalAdjacency } from '../engine/systems/geography';
import { turnRng } from '../engine/resolution/turn-rng';
import { getNeighborDisplayName } from './nameResolver';

// ============================================================
// Category preferences by month
// ============================================================

const MONTH_PREFERRED_CATEGORIES: Record<SeasonMonth, WorldPulseCategory[]> = {
  [SeasonMonth.Early]: [WorldPulseCategory.NeighborActivity, WorldPulseCategory.KingdomCondition],
  [SeasonMonth.Mid]: [WorldPulseCategory.FactionMurmur, WorldPulseCategory.Seasonal],
  [SeasonMonth.Late]: [WorldPulseCategory.Foreshadowing],
};

// ============================================================
// Reclassified event adapter
// ============================================================

/** Convert reclassified events into eligible pulse lines if their conditions pass. */
function getReclassifiedLines(state: GameState): WorldPulseLine[] {
  const lines: WorldPulseLine[] = [];
  for (const entry of WORLD_PULSE_RECLASSIFIED) {
    const allPass = entry.triggerConditions.every((cond) =>
      evaluateCondition(cond, state, state.turn.turnNumber),
    );
    if (allPass) {
      // Assign a category based on text heuristics (most are Seasonal/KingdomCondition)
      lines.push({
        text: entry.text,
        category: WorldPulseCategory.Seasonal,
        sourceId: entry.eventId,
      });
    }
  }
  return lines;
}

// ============================================================
// Weighted random selection
// ============================================================

function weightedPick<T extends { weight: number }>(
  items: T[],
  rng: () => number = Math.random,
): T | null {
  if (items.length === 0) return null;
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return items[0] ?? null;
  let roll = rng() * totalWeight;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

// ============================================================
// Inter-rival lines (Phase 11)
// ============================================================

function getInterRivalLines(state: GameState, rng: () => number): WorldPulseLine[] {
  const lines: WorldPulseLine[] = [];
  const diplomacy = state.diplomacy;
  const agreements = diplomacy.interRivalAgreements ?? [];
  const currentTurn = state.turn.turnNumber;

  // Fresh news: agreements that started this turn.
  for (const ag of agreements) {
    if (ag.turnStarted !== currentTurn) continue;
    const nameA = getNeighborDisplayName(ag.a, state);
    const nameB = getNeighborDisplayName(ag.b, state);
    let template;
    if (ag.kind === 'alliance') {
      template = INTER_RIVAL_ALLIANCE_LINES[Math.floor(rng() * INTER_RIVAL_ALLIANCE_LINES.length)];
    } else if (ag.kind === 'war') {
      template = INTER_RIVAL_WAR_LINES[Math.floor(rng() * INTER_RIVAL_WAR_LINES.length)];
    } else {
      template = INTER_RIVAL_TRADE_LINES[Math.floor(rng() * INTER_RIVAL_TRADE_LINES.length)];
    }
    if (!template) continue;
    lines.push({
      text: template.render(nameA, nameB),
      category: WorldPulseCategory.NeighborActivity,
      sourceId: `inter_rival:${ag.kind}:${ag.id}`,
    });
  }

  // Border skirmishes: contested adjacency with hostile relationship.
  const matrix = diplomacy.rivalRelationships ?? {};
  const pairs = getInterRivalAdjacency(state);
  const skirmishCandidates: Array<[string, string]> = [];
  for (const [a, b] of pairs) {
    const edge = state.geography?.edges?.find(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a),
    );
    if (edge?.frictionTier !== 'contested') continue;
    const score = matrix[a]?.[b] ?? 0;
    if (score > -20) continue;
    // Exclude pairs already at inter-rival war — their war line is louder.
    const atWar = agreements.some(
      (ag) => ag.kind === 'war' && ag.a === a && ag.b === b,
    );
    if (atWar) continue;
    skirmishCandidates.push([a, b]);
  }
  if (skirmishCandidates.length > 0) {
    const [a, b] = skirmishCandidates[Math.floor(rng() * skirmishCandidates.length)];
    const template =
      INTER_RIVAL_SKIRMISH_LINES[Math.floor(rng() * INTER_RIVAL_SKIRMISH_LINES.length)];
    if (template) {
      lines.push({
        text: template.render(
          getNeighborDisplayName(a, state),
          getNeighborDisplayName(b, state),
        ),
        category: WorldPulseCategory.NeighborActivity,
        sourceId: `inter_rival:skirmish:${a}|${b}:t${state.turn.turnNumber}`,
      });
    }
  }

  return lines;
}

// ============================================================
// Main generator
// ============================================================

export function generateWorldPulse(
  state: GameState,
  currentMonth: SeasonMonth,
  previousPulseCategories: WorldPulseCategory[],
): WorldPulseLine[] {
  const usedCategories = new Set(previousPulseCategories);
  const espionageStrength = state.espionage.networkStrength;

  // Filter eligible templates
  const eligible = WORLD_PULSE_TEMPLATES.filter((t) => {
    // Check condition
    if (!t.condition(state)) return false;
    // Intel gating for NeighborActivity
    if (t.minIntelStrength !== undefined && espionageStrength < t.minIntelStrength) return false;
    return true;
  });

  // Separate by preferred vs non-preferred categories
  const preferred = MONTH_PREFERRED_CATEGORIES[currentMonth] ?? [];

  // Boost weight for preferred categories
  const weighted: Array<WorldPulseTemplate & { effectiveWeight: number }> = eligible.map((t) => ({
    ...t,
    effectiveWeight: preferred.includes(t.category) ? t.weight * 2 : t.weight,
  }));

  // Exclude categories already used this season (soft — override if needed)
  const freshCategory = weighted.filter((t) => !usedCategories.has(t.category));
  const pool = freshCategory.length > 0 ? freshCategory : weighted;

  const results: WorldPulseLine[] = [];
  const usedIds = new Set<string>();

  // Phase 11 — inject fresh inter-rival news first (takes priority over
  // generic templated flavor when something actually happened this turn).
  const interRivalLines = getInterRivalLines(state, turnRng(state, 'bridge:world-pulse-inter-rival-pick'));
  for (const line of interRivalLines) {
    if (results.length >= 2) break;
    const id = line.sourceId;
    if (id && usedIds.has(id)) continue;
    if (id) usedIds.add(id);
    results.push(line);
  }

  const countRng = turnRng(state, 'bridge:world-pulse-count');
  const pickRng = turnRng(state, 'bridge:world-pulse-select');
  const reclassifiedRng = turnRng(state, 'bridge:world-pulse-reclass');
  const conditionRng = turnRng(state, 'bridge:world-pulse-cond');

  // Pick 1-2 lines
  const targetCount = countRng() < 0.4 ? 1 : 2;

  for (let i = 0; i < targetCount; i++) {
    if (results.length >= 2) break;
    const remaining = pool.filter((t) => !usedIds.has(t.id));
    if (remaining.length === 0) break;

    const picked = weightedPick(
      remaining.map((t) => ({ ...t, weight: t.effectiveWeight })),
      pickRng,
    );
    if (!picked) break;

    usedIds.add(picked.id);
    results.push({
      text: picked.text(state),
      category: picked.category,
      sourceId: picked.id,
    });
  }

  // Also consider reclassified event lines (adds one if eligible and we have room)
  if (results.length < 2) {
    const reclassified = getReclassifiedLines(state);
    const freshReclassified = reclassified.filter(
      (l) => !usedCategories.has(l.category) && !results.some((r) => r.sourceId === l.sourceId),
    );
    if (freshReclassified.length > 0) {
      const idx = Math.floor(reclassifiedRng() * freshReclassified.length);
      results.push(freshReclassified[idx]);
    }
  }

  // Add condition-related pulse entries from the environment system
  if (results.length < 2 && state.environment) {
    const conditionLines = getConditionPulseLines(state);
    const freshConditionLines = conditionLines.filter(
      (l) => !results.some((r) => r.sourceId === l.sourceId),
    );
    if (freshConditionLines.length > 0) {
      const idx = Math.floor(conditionRng() * freshConditionLines.length);
      results.push(freshConditionLines[idx]);
    }
  }

  return results.slice(0, 2);
}

// ============================================================
// Condition Pulse Lines
// ============================================================

const CONDITION_PULSE_TEXT: Record<string, string> = {
  Drought: 'The land thirsts. Wells run low and fields lie parched.',
  Flood: 'Rivers swell beyond their banks. The lowlands are awash.',
  HarshWinter: 'A bitter cold grips the realm. Frost covers everything.',
  BountifulHarvest: 'The fields overflow with abundance this season.',
  Plague: 'Sickness spreads through the streets. The healers are overwhelmed.',
  Famine: 'Hunger stalks the kingdom. The granaries echo with emptiness.',
  Blight: 'A creeping blight withers the crops.',
  Pox: 'A pox afflicts the populace.',
};

function getConditionPulseLines(state: GameState): WorldPulseLine[] {
  if (!state.environment) return [];
  return state.environment.activeConditions
    .filter((c) => CONDITION_PULSE_TEXT[c.type])
    .map((c) => ({
      text: CONDITION_PULSE_TEXT[c.type]!,
      category: WorldPulseCategory.KingdomCondition,
      sourceId: `condition_${c.id}`,
    }));
}
