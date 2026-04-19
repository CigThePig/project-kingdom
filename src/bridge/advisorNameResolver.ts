// Phase F — Advisor Name Resolver
// Single point of indirection for council-seat display names. Mirrors the
// nameResolver.ts pattern: prefer the live state field, fall back to a stable
// label, never leak raw enum values to player-facing copy.
//
// Used by smartText.ts (`{chancellor}` et al.) and by codex compilers that
// need the same fallback behavior.

import type { GameState, CouncilAdvisor } from '../engine/types';
import { CouncilSeat } from '../engine/types';

/**
 * Per-seat fallback label used when a seat is vacant and the caller wants a
 * stable noun phrase ("your chancellor") rather than the bare enum form.
 */
export const SEAT_FALLBACK_LABEL: Record<CouncilSeat, string> = {
  [CouncilSeat.Chancellor]: 'your chancellor',
  [CouncilSeat.Marshal]: 'your marshal',
  [CouncilSeat.Chamberlain]: 'your chamberlain',
  [CouncilSeat.Spymaster]: 'your spymaster',
};

/**
 * Returns the appointed advisor object for a seat, or undefined when vacant.
 */
export function findAdvisorBySeat(
  seat: CouncilSeat,
  state: GameState,
): CouncilAdvisor | undefined {
  return state.council?.appointments?.[seat];
}

/**
 * Returns the advisor's display name for a seat.
 *
 * Resolution order:
 *   1. `state.council.appointments[seat].name`
 *   2. `your ${seat.toLowerCase()}` (e.g. "your chancellor")
 */
export function getAdvisorName(seat: CouncilSeat, state: GameState): string {
  const advisor = findAdvisorBySeat(seat, state);
  if (advisor?.name) return advisor.name;
  return `your ${seat.toLowerCase()}`;
}

/**
 * Like {@link getAdvisorName}, but returns the stable SEAT_FALLBACK_LABEL
 * variant when the seat is vacant. Prefer this at call sites where a terse
 * possessive reads poorly (e.g. sentence starters).
 */
export function getAdvisorNameOrFallback(
  seat: CouncilSeat,
  state: GameState,
): string {
  const advisor = findAdvisorBySeat(seat, state);
  if (advisor?.name) return advisor.name;
  return SEAT_FALLBACK_LABEL[seat];
}
