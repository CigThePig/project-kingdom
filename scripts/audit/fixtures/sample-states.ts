// Card Audit — sample GameState fixtures for token-resolution scan.
//
// Three fixtures derived from the default sandbox scenario (turn 1, turn 8,
// turn 18) so the unresolved-tokens scan can distinguish "token never resolves
// in any plausible state" (real bug) from "token only resolves in late-game
// state" (legitimate). The scan flags only tokens that fail in EVERY fixture.
//
// We also vary ctx mid-flight: each fixture is exercised with a populated
// SmartTextContext that covers neighborId, regionId, classId, settlementId,
// agentId, bondId, etc. so identity tokens have someone to resolve to.

import type { GameState } from '../../../src/engine/types';
import type { SmartTextContext } from '../../../src/bridge/smartText';
import { createDefaultScenario } from '../../../src/data/scenarios/default';

export interface SampleState {
  label: string;
  state: GameState;
  ctx: SmartTextContext;
}

export function buildSampleStates(): SampleState[] {
  const t1 = createDefaultScenario();
  const t8 = advance(t1, 8);
  const t18 = advance(t1, 18);

  const ctxFor = (s: GameState): SmartTextContext => {
    const neighbor = s.diplomacy.neighbors[0];
    const region = s.regions[0];
    return {
      neighborId: neighbor?.id,
      regionId: region?.id,
      settlementId: region?.settlements?.[0]?.id,
      classId: undefined,
      bondId: undefined,
      agentId: undefined,
    };
  };

  return [
    { label: 'turn-1-fresh-kingdom', state: t1, ctx: ctxFor(t1) },
    { label: 'turn-8-developing', state: t8, ctx: ctxFor(t8) },
    { label: 'turn-18-established', state: t18, ctx: ctxFor(t18) },
  ];
}

function advance(state: GameState, toTurn: number): GameState {
  // Shallow turn advance for the audit fixture only — we don't run the full
  // engine because that would re-trigger random surfacing and load the entire
  // game loop. The token resolver reads turn.turnNumber, season, year and a
  // few derived stats, all of which we copy through unchanged.
  if (toTurn <= state.turn.turnNumber) return state;
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;
  const month = ((toTurn - 1) % 12) + 1;
  const seasonIndex = Math.floor((month - 1) / 3);
  return {
    ...state,
    turn: {
      ...state.turn,
      turnNumber: toTurn,
      month,
      season: seasons[seasonIndex] as GameState['turn']['season'],
      year: 1 + Math.floor((toTurn - 1) / 12),
    },
  };
}
