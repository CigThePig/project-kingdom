// Bridge Layer — Decree Card Generator
// Filters DECREE_POOL for available decrees and converts to DecreeCardData[].

import type { GameState } from '../engine/types';
import type { EffectHint, ContextLine } from '../ui/types';
import type { CardOfFamily } from '../engine/cards/types';
import { decreeToCard } from '../engine/cards/adapters';
import { DECREE_POOL } from '../data/decrees/index';
import { DECREE_EFFECTS } from '../data/decrees/effects';
import { DECREE_STYLE_TAGS } from '../data/ruling-style/flavor-tags';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import { getDecreeAvailability } from '../engine/systems/decree-progression';
import { getDominantAxes } from '../engine/systems/ruling-style';
import { StyleAxis } from '../engine/types';
import { extractDecreeContext } from './contextExtractor';

// ============================================================
// Card data type
// ============================================================

export interface DecreeCardData {
  decreeId: string;
  title: string;
  category: string;
  body: string;
  effects: EffectHint[];
  slotCost: number;
  isHighImpact: boolean;
  context?: ContextLine[];
}

// ============================================================
// Generator
// ============================================================

export function generateDecreeCards(
  gameState: GameState,
  recentlyOfferedDecreeIds: string[] = [],
): DecreeCardData[] {
  const currentTurn = gameState.turn.turnNumber;

  const available = DECREE_POOL.filter((decree) => {
    // Use centralized availability check (one-time, cooldown, chain, turn, state prereqs)
    const availability = getDecreeAvailability(
      decree,
      gameState.issuedDecrees,
      currentTurn,
      gameState,
    );
    if (!availability.available) return false;

    // Knowledge prerequisites are checked here in the bridge layer
    if (decree.knowledgePrerequisite !== null) {
      const { branch, milestoneIndex } = decree.knowledgePrerequisite;
      const branchState = gameState.knowledge.branches[branch];
      if (!branchState || branchState.currentMilestoneIndex <= milestoneIndex) {
        return false;
      }
    }

    return true;
  });

  // Weighted random sampling: favor lower tiers and style-aligned decrees
  // while ensuring variety across rounds. Penalize decrees that were offered
  // last season so the player sees fresh options.
  const dominantAxes = getDominantAxes(gameState.rulingStyle.axes);
  const recentlyOfferedSet = new Set(recentlyOfferedDecreeIds);

  const selected = weightedSample(available, 6, (decree) => {
    const tierWeight = 1 / decree.tier; // tier 1 = 1.0, tier 2 = 0.5, tier 3 = 0.33
    const alignment = getDecreeStyleAlignment(decree.id, dominantAxes);
    const recentPenalty = recentlyOfferedSet.has(decree.id) ? 0.3 : 1.0;
    return (1.0 + tierWeight + alignment * 0.5) * recentPenalty;
  });

  return selected.map((decree) => {
    const context = extractDecreeContext(gameState, decree.category);
    return {
      decreeId: decree.id,
      title: decree.title,
      category: decree.category,
      body: decree.effectPreview,
      effects: mechDeltaToEffectHints(DECREE_EFFECTS[decree.id] ?? {}),
      slotCost: decree.slotCost,
      isHighImpact: decree.isHighImpact,
      context: context.length ? context : undefined,
    };
  });
}

// ============================================================
// Weighted Random Sampling
// ============================================================

/**
 * Selects up to `count` items from `pool` without replacement, using
 * weighted random selection. Higher-weighted items are more likely to
 * be picked, but every item has a chance.
 */
function weightedSample<T>(
  pool: T[],
  count: number,
  weightFn: (item: T) => number,
): T[] {
  if (pool.length <= count) return pool;

  const indices = pool.map((_, i) => i);
  const result: T[] = [];

  for (let i = 0; i < count && indices.length > 0; i++) {
    const weights = indices.map((idx) => Math.max(0.1, weightFn(pool[idx])));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let r = Math.random() * totalWeight;

    let picked = indices.length - 1;
    for (let j = 0; j < weights.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        picked = j;
        break;
      }
    }

    result.push(pool[indices[picked]]);
    indices.splice(picked, 1);
  }

  return result;
}

// ============================================================
// Style Alignment Helper
// ============================================================

/**
 * Returns a score indicating how well a decree aligns with the player's
 * dominant style axes. Higher score = more aligned = shown earlier in spread.
 */
function getDecreeStyleAlignment(decreeId: string, dominantAxes: StyleAxis[]): number {
  if (dominantAxes.length === 0) return 0;
  const tags = DECREE_STYLE_TAGS[decreeId];
  if (!tags) return 0;

  let score = 0;
  for (const axis of dominantAxes) {
    const delta = tags[axis];
    if (delta !== undefined && delta > 0) {
      score += delta;
    }
  }
  return score;
}

/** Phase 4 — lift each decree card into a unified `Card<'decree'>`. */
export function generateDecreeCardsAsCards(
  gameState: GameState,
  recentlyOfferedDecreeIds: string[] = [],
): CardOfFamily<'decree'>[] {
  return generateDecreeCards(gameState, recentlyOfferedDecreeIds).map((d) => decreeToCard(d));
}
