// Canonical GameState fixtures for the runtime-diff harness.
//
// `createDefaultScenario()` from src/data/scenarios/default.ts is the
// engine's own bootstrap, so audit fixtures piggyback on it rather than
// re-authoring a full GameState tree. We tweak a handful of fields per
// fixture to surface different touch-classes when the harness dispatches
// decision paths: early-kingdom sits at default values; mid-kingdom has
// narrative pressure, a persistent consequence, and a temporary modifier
// so hand cards that read/clear them fire their structural branches;
// late-kingdom drains treasury/food so assessments that set survival
// pressure produce visible deltas.

import type { GameState } from '../../../src/engine/types';
import { createDefaultScenario } from '../../../src/data/scenarios/default';

export type FixtureId = 'early-kingdom' | 'mid-kingdom' | 'late-kingdom';

export interface RuntimeFixture {
  id: FixtureId;
  state: GameState;
  /** One-line description for scan-output context. */
  summary: string;
}

export function buildFixtures(): RuntimeFixture[] {
  return [
    { id: 'early-kingdom', state: early(), summary: 'default scenario, turn 1' },
    { id: 'mid-kingdom', state: mid(), summary: 'turn 12, one consequence + temp modifier' },
    { id: 'late-kingdom', state: late(), summary: 'turn 24, low treasury/food' },
  ];
}

// ============================================================
// Internals — each fixture is a deep-cloned default scenario
// with a handful of targeted tweaks.
// ============================================================

function early(): GameState {
  return createDefaultScenario();
}

function mid(): GameState {
  const s = createDefaultScenario();
  return {
    ...s,
    turn: { ...s.turn, turnNumber: 12 },
    narrativePressure: {
      ...s.narrativePressure,
      authority: 15,
      piety: 10,
      commerce: 8,
    },
    persistentConsequences: [
      ...s.persistentConsequences,
      {
        sourceId: 'evt_fixture',
        sourceType: 'event',
        choiceMade: 'resolved',
        turnApplied: 5,
        tag: 'evt_fixture:resolved',
      },
    ],
    activeTemporaryModifiers: [
      ...s.activeTemporaryModifiers,
      {
        id: 'fixture_temp_mod_1',
        sourceTag: 'fixture:temp',
        turnsRemaining: 3,
        turnApplied: 9,
        effectPerTurn: { stabilityDelta: 1 },
      },
    ],
  };
}

function late(): GameState {
  const s = createDefaultScenario();
  return {
    ...s,
    turn: { ...s.turn, turnNumber: 24 },
    treasury: { ...s.treasury, balance: 50 },
    food: { ...s.food, reserves: 80 },
    military: { ...s.military, readiness: 35 },
    narrativePressure: {
      ...s.narrativePressure,
      isolation: 20,
      militarism: 18,
    },
  };
}
