// Causal Ledger — Recording system for turn resolution legibility.
// Tracks why significant state changes occurred for card/summary surfacing.
// No React imports. No player-facing text.

import type {
  CausalChain,
  CausalEntry,
  CausalLedger,
  CausalNode,
} from '../types';
import {
  CAUSAL_SIGNIFICANCE_THRESHOLD,
  CAUSAL_RECENT_TURNS_KEPT,
  CAUSAL_CHAIN_MIN_MAGNITUDE,
} from '../constants';

// ============================================================
// Mutable Accumulator — used during a single resolveTurn() call
// ============================================================

export interface TurnLedgerAccumulator {
  entries: CausalEntry[];
  turnNumber: number;
}

export function createTurnLedger(turnNumber: number): TurnLedgerAccumulator {
  return { entries: [], turnNumber };
}

/**
 * Records a causal entry if the delta is significant enough.
 * Mutates the accumulator — scoped to a single synchronous resolveTurn() call.
 */
export function recordCausalEntry(
  ledger: TurnLedgerAccumulator,
  cause: CausalNode,
  effect: CausalNode,
): void {
  if (Math.abs(effect.numericDelta ?? 0) < CAUSAL_SIGNIFICANCE_THRESHOLD) return;
  ledger.entries.push({ cause, effect });
}

/**
 * Convenience helper for system modules.
 * No-op when ledger is undefined (unit tests, etc.).
 */
export function maybeRecord(
  ledger: TurnLedgerAccumulator | undefined,
  causeSystem: string,
  causeDescription: string,
  effectSystem: string,
  effectDescription: string,
  delta: number,
): void {
  if (!ledger) return;
  recordCausalEntry(
    ledger,
    { system: causeSystem, description: causeDescription, numericDelta: null },
    { system: effectSystem, description: effectDescription, numericDelta: delta },
  );
}

// ============================================================
// Immutable State Builders
// ============================================================

export function createEmptyLedger(): CausalLedger {
  return {
    currentTurnEntries: [],
    currentTurnChains: [],
    recentChains: [],
  };
}

let chainIdCounter = 0;

/**
 * Links related entries into causal chains.
 * Two entries are chained when entry1's effect system matches entry2's cause system.
 */
export function chainRelatedEntries(
  entries: CausalEntry[],
  turnNumber: number,
): CausalChain[] {
  if (entries.length === 0) return [];

  const chains: CausalChain[] = [];
  const used = new Set<number>();

  // Build adjacency: effect.system of entry i → cause.system of entry j
  for (let i = 0; i < entries.length; i++) {
    if (used.has(i)) continue;

    // Start a chain from entry i
    const chainEntries: CausalEntry[] = [entries[i]];
    used.add(i);

    // Greedy forward linking
    let currentEffectSystem = entries[i].effect.system;
    let foundNext = true;

    while (foundNext) {
      foundNext = false;
      for (let j = 0; j < entries.length; j++) {
        if (used.has(j)) continue;
        if (entries[j].cause.system === currentEffectSystem) {
          chainEntries.push(entries[j]);
          used.add(j);
          currentEffectSystem = entries[j].effect.system;
          foundNext = true;
          break;
        }
      }
    }

    // Build the chain
    const first = chainEntries[0];
    const last = chainEntries[chainEntries.length - 1];
    const intermediateSteps = chainEntries.slice(1, -1).map(e => e.effect);
    const totalMagnitude = chainEntries.reduce(
      (sum, e) => sum + Math.abs(e.effect.numericDelta ?? 0),
      0,
    );

    chainIdCounter++;
    chains.push({
      id: `chain_t${turnNumber}_${chainIdCounter}`,
      rootCause: first.cause,
      finalEffect: last.effect,
      intermediateSteps: chainEntries.length > 1 ? intermediateSteps : [],
      totalMagnitude,
      turnRecorded: turnNumber,
    });
  }

  // Filter out low-magnitude chains
  return chains.filter(c => c.totalMagnitude >= CAUSAL_CHAIN_MIN_MAGNITUDE);
}

/**
 * Prunes chains older than CAUSAL_RECENT_TURNS_KEPT.
 */
export function pruneOldChains(
  chains: CausalChain[],
  currentTurn: number,
): CausalChain[] {
  return chains.filter(c => currentTurn - c.turnRecorded < CAUSAL_RECENT_TURNS_KEPT);
}

/**
 * Finalizes the turn ledger: chains entries, merges with previous history, prunes old chains.
 */
export function finalizeTurnLedger(
  accumulator: TurnLedgerAccumulator,
  previousLedger: CausalLedger,
): CausalLedger {
  const newChains = chainRelatedEntries(accumulator.entries, accumulator.turnNumber);
  const prunedRecent = pruneOldChains(previousLedger.recentChains, accumulator.turnNumber);

  return {
    currentTurnEntries: accumulator.entries,
    currentTurnChains: newChains,
    recentChains: [...prunedRecent, ...newChains],
  };
}
