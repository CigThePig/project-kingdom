// Phase 3 — Tests for rival-memory system.

import { beforeAll, describe, expect, it } from 'vitest';
import type { GameState, RivalMemoryEntry } from '../engine/types';
import {
  computeMemoryDriftDelta,
  decayMemoryWeights,
  recordMemory,
} from '../engine/systems/rival-memory';
import { createDefaultScenario } from '../data/scenarios/default';

function entry(over: Partial<RivalMemoryEntry> = {}): RivalMemoryEntry {
  return {
    turnRecorded: 1,
    type: 'slight',
    source: 'test',
    weight: 1,
    context: 'test',
    ...over,
  };
}

describe('recordMemory', () => {
  it('appends entries in order up to capacity', () => {
    const mem: RivalMemoryEntry[] = [];
    const a = recordMemory(mem, entry({ source: 'a' }));
    const b = recordMemory(a, entry({ source: 'b' }));
    expect(b).toHaveLength(2);
    expect(b[0].source).toBe('a');
    expect(b[1].source).toBe('b');
  });

  it('evicts the lowest-weight entry when capacity is exceeded', () => {
    let mem: RivalMemoryEntry[] = [];
    for (let i = 0; i < 4; i++) {
      mem = recordMemory(mem, entry({ source: `e${i}`, weight: 0.5 }), 4);
    }
    // Add a heavier entry that should keep and push out one of the weight-0.5 ones.
    const next = recordMemory(
      mem,
      entry({ source: 'heavy', weight: 2 }),
      4,
    );
    expect(next).toHaveLength(4);
    expect(next.find((e) => e.source === 'heavy')).toBeDefined();
  });

  it('keeps a high-weight grudge when many smaller favors accumulate', () => {
    let mem: RivalMemoryEntry[] = [
      entry({ source: 'grudge', weight: 5, type: 'breach' }),
    ];
    for (let i = 0; i < 20; i++) {
      mem = recordMemory(
        mem,
        entry({ source: `favor${i}`, weight: 0.3, type: 'favor' }),
        16,
      );
    }
    expect(mem.find((e) => e.source === 'grudge')).toBeDefined();
    expect(mem.length).toBeLessThanOrEqual(16);
  });

  it('preserves regionId/settlementId round-trip', () => {
    const mem = recordMemory([], entry({
      type: 'territorial_loss',
      regionId: 'region_ironvale',
      settlementId: 'settlement_forgetown',
    }));
    expect(mem[0].regionId).toBe('region_ironvale');
    expect(mem[0].settlementId).toBe('settlement_forgetown');
  });
});

describe('decayMemoryWeights', () => {
  it('multiplies weights by 0.85^years', () => {
    const mem = [entry({ weight: 1 })];
    const decayed = decayMemoryWeights(mem, 1);
    expect(decayed[0].weight).toBeCloseTo(0.85, 5);
  });

  it('drops entries that fall below 0.05', () => {
    const mem = [entry({ weight: 0.06 })];
    // After ~2 years, 0.06 * 0.85^2 ≈ 0.043 — should drop.
    const decayed = decayMemoryWeights(mem, 2);
    expect(decayed).toHaveLength(0);
  });

  it('returns a new array and preserves originals', () => {
    const mem = [entry({ weight: 1 })];
    const decayed = decayMemoryWeights(mem, 1);
    expect(decayed).not.toBe(mem);
    expect(mem[0].weight).toBe(1);
  });

  it('is a no-op for yearsElapsed <= 0', () => {
    const mem = [entry({ weight: 1 })];
    expect(decayMemoryWeights(mem, 0)).toBe(mem);
  });
});

describe('computeMemoryDriftDelta', () => {
  let state: GameState;

  // Use the default scenario so historicClaims are real (valdris → ironvale).
  beforeAll(() => {
    state = createDefaultScenario();
  });

  it('returns 0 for an empty or missing memory', () => {
    expect(computeMemoryDriftDelta([], 'neighbor_valdris', state)).toBe(0);
    expect(computeMemoryDriftDelta(undefined, 'neighbor_valdris', state)).toBe(0);
  });

  it('returns positive for favor-only memory', () => {
    const mem = [
      entry({ type: 'favor', weight: 1 }),
      entry({ type: 'favor', weight: 0.5 }),
    ];
    expect(computeMemoryDriftDelta(mem, 'neighbor_valdris', state)).toBeGreaterThan(0);
  });

  it('returns negative for slight/breach memory', () => {
    const mem = [
      entry({ type: 'slight', weight: 1 }),
      entry({ type: 'breach', weight: 1 }),
    ];
    expect(computeMemoryDriftDelta(mem, 'neighbor_valdris', state)).toBeLessThan(0);
  });

  it('double-weights territorial_loss when regionId is a historic claim', () => {
    // In default scenario, valdris claims region_ironvale.
    const claimed = [entry({ type: 'territorial_loss', weight: 1, regionId: 'region_ironvale' })];
    const unclaimed = [entry({ type: 'territorial_loss', weight: 1, regionId: 'region_heartlands' })];

    const claimedDrift = computeMemoryDriftDelta(claimed, 'neighbor_valdris', state);
    const unclaimedDrift = computeMemoryDriftDelta(unclaimed, 'neighbor_valdris', state);
    // claimedDrift should be twice as negative (doubled).
    expect(Math.abs(claimedDrift)).toBeGreaterThan(Math.abs(unclaimedDrift));
  });

  it('clamps the final delta to ±20', () => {
    const massiveFavor: RivalMemoryEntry[] = [];
    for (let i = 0; i < 100; i++) {
      massiveFavor.push(entry({ type: 'favor', weight: 5 }));
    }
    expect(computeMemoryDriftDelta(massiveFavor, 'neighbor_valdris', state)).toBe(20);
  });
});

