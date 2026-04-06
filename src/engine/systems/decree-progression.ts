// Decree Progression System — availability logic for one-time, cooldown, and chain decrees.
// Pure TypeScript — no React imports.

import type { IssuedDecree } from '../types';
import { DECREE_POOL, type DecreeDefinition } from '../../data/decrees/index';

// ============================================================
// Types
// ============================================================

export type DecreeStatus = 'available' | 'enacted' | 'locked' | 'cooldown' | 'unlocked';

export interface DecreeAvailability {
  status: DecreeStatus;
  available: boolean;
  reason: string;
  cooldownTurnsRemaining: number;
  chainProgress: { currentTier: number; maxTier: number } | null;
}

// ============================================================
// Core availability check
// ============================================================

/**
 * Determines whether a decree can be issued, considering:
 * - One-time issuance (non-repeatable decrees that have been enacted)
 * - Cooldown tracking (repeatable decrees with a waiting period)
 * - Chain prerequisites (previous tier must be enacted)
 * - Knowledge prerequisites are NOT checked here — handled separately in the UI layer
 *   alongside slot budget checks, since those depend on live game state context.
 */
export function getDecreeAvailability(
  decree: DecreeDefinition,
  issuedDecrees: ReadonlyArray<IssuedDecree>,
  currentTurn: number,
): DecreeAvailability {
  const chainProgress = getChainProgress(decree, issuedDecrees);

  // Check if this decree has been issued before
  const issuedRecord = issuedDecrees.find((d) => d.decreeId === decree.id);
  const wasIssued = issuedRecord !== undefined;

  // --- One-time decree already enacted ---
  if (wasIssued && !decree.isRepeatable) {
    return {
      status: 'enacted',
      available: false,
      reason: 'Already enacted',
      cooldownTurnsRemaining: 0,
      chainProgress,
    };
  }

  // --- Repeatable decree on cooldown ---
  if (wasIssued && decree.isRepeatable && decree.cooldownTurns > 0) {
    // Find the most recent issuance for cooldown calculation
    const mostRecent = issuedDecrees
      .filter((d) => d.decreeId === decree.id)
      .reduce((latest, d) => (d.turnIssued > latest.turnIssued ? d : latest), issuedRecord);

    const turnsSinceIssued = currentTurn - mostRecent.turnIssued;
    if (turnsSinceIssued < decree.cooldownTurns) {
      const remaining = decree.cooldownTurns - turnsSinceIssued;
      return {
        status: 'cooldown',
        available: false,
        reason: `Available in ${remaining} turn${remaining !== 1 ? 's' : ''}`,
        cooldownTurnsRemaining: remaining,
        chainProgress,
      };
    }
  }

  // --- Chain prerequisite missing ---
  if (decree.previousTierDecreeId !== null) {
    const previousTierEnacted = issuedDecrees.some(
      (d) => d.decreeId === decree.previousTierDecreeId,
    );
    if (!previousTierEnacted) {
      const prevDecree = DECREE_POOL.find((d) => d.id === decree.previousTierDecreeId);
      const prevTitle = prevDecree?.title ?? 'previous decree';
      return {
        status: 'locked',
        available: false,
        reason: `Requires: ${prevTitle}`,
        cooldownTurnsRemaining: 0,
        chainProgress,
      };
    }

    // Previous tier enacted — this is a newly unlocked tier
    const thisAlreadyIssued = issuedDecrees.some((d) => d.decreeId === decree.id);
    if (!thisAlreadyIssued) {
      return {
        status: 'unlocked',
        available: true,
        reason: '',
        cooldownTurnsRemaining: 0,
        chainProgress,
      };
    }
  }

  // --- Available ---
  return {
    status: 'available',
    available: true,
    reason: '',
    cooldownTurnsRemaining: 0,
    chainProgress,
  };
}

// ============================================================
// Chain helpers
// ============================================================

/**
 * Returns all decrees belonging to the same chain, sorted by tier.
 */
export function getChainDecrees(chainId: string): DecreeDefinition[] {
  return DECREE_POOL
    .filter((d) => d.chainId === chainId)
    .sort((a, b) => a.tier - b.tier);
}

/**
 * Computes chain progress for a given decree.
 * Returns null for standalone (non-chain) decrees.
 */
function getChainProgress(
  decree: DecreeDefinition,
  issuedDecrees: ReadonlyArray<IssuedDecree>,
): { currentTier: number; maxTier: number } | null {
  if (decree.chainId === null) return null;

  const chainDecrees = getChainDecrees(decree.chainId);
  if (chainDecrees.length <= 1) return null;

  const maxTier = chainDecrees.length;
  // Current tier = highest enacted tier in this chain (0 if none enacted)
  let highestEnacted = 0;
  for (const cd of chainDecrees) {
    if (issuedDecrees.some((d) => d.decreeId === cd.id)) {
      highestEnacted = cd.tier;
    }
  }

  return { currentTier: highestEnacted, maxTier };
}
