// Phase F — Agent Name Resolver
// Resolves espionage agent IDs to procgen codenames and cover-settlement
// labels. Mirrors nameResolver.ts conventions: live state first, stable
// fallback string second, never a raw id in player-facing copy.

import type { Agent, GameState } from '../engine/types';
import { getSettlementDisplayName } from './nameResolver';

/**
 * Looks up an agent by id in the espionage roster.
 * Returns undefined if the roster is absent or the id is unknown.
 */
export function findAgentById(
  agentId: string,
  state: GameState,
): Agent | undefined {
  return state.espionage?.agents?.find((a) => a.id === agentId);
}

/**
 * Returns the agent's procgen codename, or the string "the agent" when the
 * id can't be resolved. Callers that want to distinguish unknown agents
 * should use `findAgentById` directly.
 */
export function getAgentCodename(agentId: string, state: GameState): string {
  return findAgentById(agentId, state)?.codename ?? 'the agent';
}

/**
 * Returns the display name of the agent's cover settlement, resolved through
 * `getSettlementDisplayName`. Useful for dossier / roster lines that
 * mention cover context.
 */
export function getAgentCoverSettlementLabel(
  agentId: string,
  state: GameState,
): string {
  const agent = findAgentById(agentId, state);
  if (!agent) return 'an unknown posting';
  return getSettlementDisplayName(agent.coverSettlementId, state);
}
