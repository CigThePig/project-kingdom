// Phase 9 — Codex region-summary compiler tests.

import { describe, it, expect } from 'vitest';
import { compileRegionSummaries } from '../bridge/codexCompiler';
import { createDefaultScenario } from '../data/scenarios/default';
import { QualitativeTier, RegionalPosture } from '../engine/types';

describe('compileRegionSummaries', () => {
  it('returns one entry per region in state order', () => {
    const state = createDefaultScenario();
    const summaries = compileRegionSummaries(state);
    expect(summaries.length).toBe(state.regions.length);
    summaries.forEach((s, i) => {
      expect(s.id).toBe(state.regions[i].id);
    });
  });

  it('populates display names via the resolver', () => {
    const state = createDefaultScenario();
    const summaries = compileRegionSummaries(state);
    for (const s of summaries) {
      expect(typeof s.displayName).toBe('string');
      expect(s.displayName.length).toBeGreaterThan(0);
    }
  });

  it('defaults every region to Autonomy with a non-empty effect and narrative', () => {
    const state = createDefaultScenario();
    const summaries = compileRegionSummaries(state);
    for (const s of summaries) {
      expect(s.posture).toBe(RegionalPosture.Autonomy);
      expect(s.postureLabel).toBe('Autonomy');
      expect(s.postureEffect.length).toBeGreaterThan(5);
      expect(s.postureNarrative.length).toBeGreaterThan(5);
    }
  });

  it('computes loyalty/development tiers within the standard 5-tier scheme', () => {
    const state = createDefaultScenario();
    const summaries = compileRegionSummaries(state);
    const validTiers = new Set<QualitativeTier>(Object.values(QualitativeTier));
    for (const s of summaries) {
      expect(validTiers.has(s.loyaltyTier)).toBe(true);
      expect(validTiers.has(s.developmentTier)).toBe(true);
      expect(s.loyaltyNarrative.length).toBeGreaterThan(0);
      expect(s.developmentNarrative.length).toBeGreaterThan(0);
    }
  });

  it('falls back to quiet activity when no local conditions are active', () => {
    const state = createDefaultScenario();
    const summaries = compileRegionSummaries(state);
    for (const s of summaries) {
      if ((state.regions.find((r) => r.id === s.id)?.localConditions?.length ?? 0) === 0) {
        expect(s.activityLine).toMatch(/Quiet/);
      }
    }
  });

  it('marks regions whose posture has been untouched past the stale threshold', () => {
    const state = createDefaultScenario();
    // Simulate late-game: turn 12 is well past the 8-turn stale threshold.
    const advanced = { ...state, turn: { ...state.turn, turnNumber: 12 } };
    const summaries = compileRegionSummaries(advanced);
    // All default regions seed postureSetOnTurn: 0, so all should be stale.
    expect(summaries.every((s) => s.isStale || s.isOccupied)).toBe(true);
  });

  it('preserves occupied flag from RegionState', () => {
    const state = createDefaultScenario();
    if (state.regions.length === 0) return;
    const mutated = {
      ...state,
      regions: state.regions.map((r, i) =>
        i === 0 ? { ...r, isOccupied: true } : r,
      ),
    };
    const summaries = compileRegionSummaries(mutated);
    expect(summaries[0].isOccupied).toBe(true);
  });

  it('reflects a posture change in postureLabel, effect, and narrative', () => {
    const state = createDefaultScenario();
    if (state.regions.length === 0) return;
    const mutated = {
      ...state,
      regions: state.regions.map((r, i) =>
        i === 0
          ? { ...r, posture: RegionalPosture.Extract, postureSetOnTurn: 1 }
          : r,
      ),
      turn: { ...state.turn, turnNumber: 2 },
    };
    const summaries = compileRegionSummaries(mutated);
    expect(summaries[0].posture).toBe(RegionalPosture.Extract);
    expect(summaries[0].postureLabel).toBe('Extract');
    expect(summaries[0].postureEffect.toLowerCase()).toContain('extract');
    expect(summaries[0].isStale).toBe(false);
    expect(summaries[0].turnsSincePostureChange).toBe(1);
  });
});
