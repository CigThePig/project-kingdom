// Deterministic per-turn RNG. Engine code must not call Math.random()
// directly (see CLAUDE.md "Architecture — engine/" and the header in
// systems/rival-simulation.ts) because it breaks replay determinism and
// makes rival behavior illegible. All randomness flows from the run's
// persisted seed via this helper.

import { seededRandom } from '../../data/text/name-generation';

interface SeededStateSlice {
  // Pre-Phase-1 saves predate runSeed; game-context.tsx's LOAD_SAVE migration
  // back-fills a fresh seed, but we accept `undefined` here so engine entry
  // points don't need to narrow before calling into the RNG.
  runSeed?: string;
  turn: { turnNumber: number };
}

/**
 * Builds a deterministic [0, 1) generator scoped to one turn and one
 * call-site. The `tag` distinguishes sites so that, for example, outcome
 * variance rolls don't share a stream with event-selection rolls.
 */
export function turnRng(state: SeededStateSlice, tag: string): () => number {
  const seed = state.runSeed ?? '__test-fallback__';
  return seededRandom(`${seed}:t${state.turn.turnNumber}:${tag}`);
}

/**
 * Deterministic short ID suffix, replacing the common
 * `Math.random().toString(36).slice(2, 8)` pattern.
 */
export function rngSuffix(rng: () => number, length = 6): string {
  // rng() is [0, 1). Multiply up to 36^length, floor, base-36 encode, pad.
  const max = Math.pow(36, length);
  const n = Math.floor(rng() * max);
  return n.toString(36).padStart(length, '0');
}
