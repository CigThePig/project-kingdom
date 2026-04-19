// Phase C — Rival-scoped state helpers
// Bridge-layer accessors that translate a neighbor's simulation state into
// short, player-facing language for use by the smart-text substitution engine.
//
// These mirror the kingdom-scoped helpers in smartText.ts (treasuryTier,
// storesTier) so rival and player state share vocabulary where it makes sense.

import type { GameState, NeighborState } from '../engine/types';
import { EconomicPhase } from '../engine/types';
import {
  ECONOMIC_PHASE_LABELS,
  RIVAL_CRISIS_CLAUSES,
  RIVAL_MOOD_LABELS,
} from '../data/text/labels';

function findNeighbor(neighborId: string, state: GameState): NeighborState | undefined {
  return state.diplomacy.neighbors.find((n) => n.id === neighborId);
}

/**
 * Bands a neighbor's `kingdomSimulation.treasuryHealth` (0..100) into one of
 * the shared five economic-phase labels (Depression / Recession / Stagnation /
 * Growth / Boom). Band edges align with the rival-simulation crisis threshold
 * (30) so the word "Depression" maps to the same regime that flags insolvency.
 */
export function getRivalEconomicPhaseLabel(
  neighborId: string,
  state: GameState,
): string {
  const neighbor = findNeighbor(neighborId, state);
  const treasury = neighbor?.kingdomSimulation?.treasuryHealth ?? 50;
  let phase: EconomicPhase;
  if (treasury < 20) phase = EconomicPhase.Depression;
  else if (treasury < 40) phase = EconomicPhase.Recession;
  else if (treasury < 60) phase = EconomicPhase.Stagnation;
  else if (treasury < 80) phase = EconomicPhase.Growth;
  else phase = EconomicPhase.Boom;
  return ECONOMIC_PHASE_LABELS[phase];
}

/**
 * Bands a neighbor's `kingdomSimulation.populationMood` (0..100) into a short
 * descriptor (restive / uneasy / settled / content / jubilant). Returns
 * "settled" for an unknown neighbor so the token always produces valid prose.
 */
export function getRivalMoodDescriptor(
  neighborId: string,
  state: GameState,
): string {
  const neighbor = findNeighbor(neighborId, state);
  const mood = neighbor?.kingdomSimulation?.populationMood ?? 50;
  if (mood < 25) return RIVAL_MOOD_LABELS.restive;
  if (mood < 40) return RIVAL_MOOD_LABELS.uneasy;
  if (mood < 60) return RIVAL_MOOD_LABELS.settled;
  if (mood < 75) return RIVAL_MOOD_LABELS.content;
  return RIVAL_MOOD_LABELS.jubilant;
}

/**
 * Returns a mid-sentence clause describing a neighbor's active crisis, or an
 * empty string if the neighbor is not in crisis (or is unknown). Intended to
 * be spliced into authored bodies like "{ruler_full}'s envoys arrive,
 * {rival_crisis:neighbor_a}, and press for terms."
 */
export function getRivalCrisisClause(
  neighborId: string,
  state: GameState,
): string {
  const neighbor = findNeighbor(neighborId, state);
  const sim = neighbor?.kingdomSimulation;
  if (!sim?.isInCrisis || !sim.crisisType) return '';
  return RIVAL_CRISIS_CLAUSES[sim.crisisType] ?? '';
}
