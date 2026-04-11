import { describe, it, expect } from 'vitest';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { createDefaultScenario } from '../data/scenarios/default';

describe('resolveTurn', () => {
  it('resolves a turn without throwing on default scenario', () => {
    const state = createDefaultScenario();
    const result = resolveTurn(state, applyActionEffects, []);

    expect(result).toBeDefined();
    expect(result.nextState).toBeDefined();
    expect(result.nextState.turn.turnNumber).toBe(state.turn.turnNumber + 1);
    expect(result.historyEntry).toBeDefined();
    expect(Array.isArray(result.triggeredFailureConditions)).toBe(true);
    expect(Array.isArray(result.failureWarnings)).toBe(true);
  });

  it('returns a valid history entry', () => {
    const state = createDefaultScenario();
    const result = resolveTurn(state, applyActionEffects, []);

    expect(result.historyEntry.turnNumber).toBe(state.turn.turnNumber);
    expect(result.historyEntry.season).toBe(state.turn.season);
    expect(result.historyEntry.year).toBe(state.turn.year);
  });

  it('does not trigger failure conditions on a healthy default state', () => {
    const state = createDefaultScenario();
    const result = resolveTurn(state, applyActionEffects, []);

    expect(result.triggeredFailureConditions).toEqual([]);
  });
});
