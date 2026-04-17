// Phase G — Invariants that must hold across any resolveTurn call.
// Guards the audit's Phase A concerns: state spine integrity.

import { describe, it, expect } from 'vitest';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { createDefaultScenario } from '../data/scenarios/default';

describe('resolveTurn invariants', () => {
  it('preserves runSeed across resolution', () => {
    const state = { ...createDefaultScenario(), runSeed: 'seed_0xABC' };
    const { nextState } = resolveTurn(state, applyActionEffects, []);
    expect(nextState.runSeed).toBe('seed_0xABC');
  });

  it('preserves geography across resolution', () => {
    const state = createDefaultScenario();
    const { nextState } = resolveTurn(state, applyActionEffects, []);
    expect(nextState.geography).toEqual(state.geography);
  });

  it('keeps treasury balance finite', () => {
    const state = createDefaultScenario();
    const { nextState } = resolveTurn(state, applyActionEffects, []);
    expect(Number.isFinite(nextState.treasury.balance)).toBe(true);
  });

  it('preserves action-budget slot totals', () => {
    const state = createDefaultScenario();
    const { nextState } = resolveTurn(state, applyActionEffects, []);
    expect(Number.isFinite(nextState.actionBudget.slotsTotal)).toBe(true);
    expect(nextState.actionBudget.slotsUsed).toBeGreaterThanOrEqual(0);
  });

  it('advances turnNumber monotonically', () => {
    const s0 = createDefaultScenario();
    const r1 = resolveTurn(s0, applyActionEffects, []);
    const r2 = resolveTurn(r1.nextState, applyActionEffects, [], [r1.historyEntry]);
    expect(r1.nextState.turn.turnNumber).toBe(s0.turn.turnNumber + 1);
    expect(r2.nextState.turn.turnNumber).toBe(r1.nextState.turn.turnNumber + 1);
  });

  it('preserves region count across resolution', () => {
    const state = createDefaultScenario();
    const { nextState } = resolveTurn(state, applyActionEffects, []);
    expect(nextState.regions.length).toBe(state.regions.length);
  });
});
