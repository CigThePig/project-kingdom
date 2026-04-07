// Bridge Layer — Decree Card Generator
// Filters DECREE_POOL for available decrees and converts to DecreeCardData[].

import type { GameState } from '../engine/types';
import type { EffectHint } from '../ui/types';
import { DECREE_POOL } from '../data/decrees/index';
import { DECREE_EFFECTS } from '../data/decrees/effects';
import { mechDeltaToEffectHints } from './crisisCardGenerator';

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
}

// ============================================================
// Generator
// ============================================================

export function generateDecreeCards(gameState: GameState): DecreeCardData[] {
  const currentTurn = gameState.turn.turnNumber;
  const issuedIds = new Set(gameState.issuedDecrees.map((d) => d.decreeId));
  const issuedTurnMap = new Map<string, number>(
    gameState.issuedDecrees.map((d) => [d.decreeId, d.turnIssued]),
  );

  const available = DECREE_POOL.filter((decree) => {
    // 1. One-time decrees that have already been issued
    if (!decree.isRepeatable && issuedIds.has(decree.id)) return false;

    // 2. Repeatable decrees on cooldown
    if (decree.isRepeatable && decree.cooldownTurns > 0) {
      const lastIssued = issuedTurnMap.get(decree.id);
      if (lastIssued !== undefined && currentTurn < lastIssued + decree.cooldownTurns) {
        return false;
      }
    }

    // 3. Chain prerequisite not yet issued
    if (decree.previousTierDecreeId !== null && !issuedIds.has(decree.previousTierDecreeId)) {
      return false;
    }

    // 4. Knowledge prerequisite not yet reached
    if (decree.knowledgePrerequisite !== null) {
      const { branch, milestoneIndex } = decree.knowledgePrerequisite;
      const branchState = gameState.knowledge.branches[branch];
      if (!branchState || branchState.currentMilestoneIndex <= milestoneIndex) {
        return false;
      }
    }

    return true;
  });

  // Sort: lower tier first, then alphabetically by category
  available.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.category.localeCompare(b.category);
  });

  // Return up to 6 decree cards
  return available.slice(0, 6).map((decree) => ({
    decreeId: decree.id,
    title: decree.title,
    category: decree.category,
    body: decree.effectPreview,
    effects: mechDeltaToEffectHints(DECREE_EFFECTS[decree.id] ?? {}),
    slotCost: decree.slotCost,
    isHighImpact: decree.isHighImpact,
  }));
}
