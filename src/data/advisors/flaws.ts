// Phase 8 — Advisor Flaws.
//
// A flaw is a hidden (or revealed) vice baked into a CouncilAdvisor. While
// hidden, a flaw still ticks its per-turn effect — the player just doesn't
// see it in the chronicle. Once revealed, the chronicle surfaces the flaw
// and (optionally) fires the one-time `detectionMessage`.
//
// The engine calls `applyFlawPerTurnEffect` once per appointed advisor, per
// turn, inside `applyPerTurnFlawEffects` (see
// `src/engine/systems/advisors.ts`).

import type { GameState, MechanicalEffectDelta } from '../../engine/types';

export interface FlawDefinition {
  id: string;
  label: string;
  detectionMessage: string;
  /** Effects applied on every turn the flaw is live on an appointed advisor,
   *  whether hidden or revealed. Returning an empty object is a no-op. */
  perTurnDelta: (state: GameState) => MechanicalEffectDelta;
}

export const FLAW_DEFINITIONS: Record<string, FlawDefinition> = {
  greedy: {
    id: 'greedy',
    label: 'Greedy',
    detectionMessage: 'The treasurer\'s audit has caught the advisor skimming from the royal accounts.',
    perTurnDelta: () => ({ treasuryDelta: -5 }),
  },
  drunkard: {
    id: 'drunkard',
    label: 'Drunkard',
    detectionMessage: 'Court gossip confirms what the pages have whispered for weeks — the advisor cannot hold his cups.',
    perTurnDelta: () => ({ stabilityDelta: -1 }),
  },
  zealot: {
    id: 'zealot',
    label: 'Zealot',
    detectionMessage: 'The advisor has been seen pressing a narrow orthodoxy on the junior clerks.',
    perTurnDelta: () => ({ heterodoxyDelta: -1, clergySatDelta: 1, commonerSatDelta: -1 }),
  },
  vendetta: {
    id: 'vendetta',
    label: 'Vendetta',
    detectionMessage: 'The advisor has been using royal writs to pursue a private grudge.',
    perTurnDelta: () => ({ nobilitySatDelta: -1 }),
  },
  reformist: {
    id: 'reformist',
    label: 'Reformist',
    detectionMessage: 'The advisor\'s reform pamphlets have begun circulating under royal seal.',
    perTurnDelta: () => ({ commonerSatDelta: 1, nobilitySatDelta: -1 }),
  },
};
