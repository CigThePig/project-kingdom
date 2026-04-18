// Phase G — Neighbor substitution helper. Guards E-20.

import { describe, it, expect } from 'vitest';
import { resolveNeighborInDelta, pickPreferredNeighborId } from '../bridge/neighborSubstitution';
import { createDefaultScenario } from '../data/scenarios/default';
import type { MechanicalEffectDelta } from '../engine/types';

describe('resolveNeighborInDelta', () => {
  it('replaces __NEIGHBOR__ with the preferred non-warring neighbor id', () => {
    const state = createDefaultScenario();
    const pick = pickPreferredNeighborId(state);
    const delta: MechanicalEffectDelta = {
      diplomacyDeltas: { __NEIGHBOR__: 5 },
    };
    const resolved = resolveNeighborInDelta(delta, state);
    expect(resolved.diplomacyDeltas).toEqual({ [pick]: 5 });
  });

  it('passes through deltas that contain no diplomacyDeltas', () => {
    const state = createDefaultScenario();
    const delta: MechanicalEffectDelta = { treasuryDelta: 10 };
    expect(resolveNeighborInDelta(delta, state)).toEqual(delta);
  });

  it('accepts an explicit neighbor id rather than gameState', () => {
    const delta: MechanicalEffectDelta = {
      diplomacyDeltas: { __NEIGHBOR__: 3 },
    };
    const resolved = resolveNeighborInDelta(delta, 'neighbor_xyz');
    expect(resolved.diplomacyDeltas).toEqual({ neighbor_xyz: 3 });
  });

  it('preserves non-placeholder keys in diplomacyDeltas', () => {
    const state = createDefaultScenario();
    const pick = pickPreferredNeighborId(state);
    const delta: MechanicalEffectDelta = {
      diplomacyDeltas: { __NEIGHBOR__: 2, neighbor_other: -1 },
    };
    const resolved = resolveNeighborInDelta(delta, state);
    expect(resolved.diplomacyDeltas).toEqual({ [pick]: 2, neighbor_other: -1 });
  });
});
