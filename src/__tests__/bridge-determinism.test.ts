// Phase G — Bridge generators must be deterministic under a fixed runSeed.
// Targets Phase E-18: seeded RNG in assessment / negotiation / decree / world-pulse.

import { describe, it, expect } from 'vitest';
import { createDefaultScenario } from '../data/scenarios/default';
import { generateDecreeCards } from '../bridge/decreeCardGenerator';
import { generateWorldPulse } from '../bridge/worldPulseGenerator';
import { SeasonMonth } from '../engine/types';

describe('bridge generator determinism', () => {
  it('decree generator returns identical results for identical state', () => {
    const state = { ...createDefaultScenario(), runSeed: 'fixed_seed_decree' };
    const a = generateDecreeCards(state);
    const b = generateDecreeCards(state);
    expect(a.map((d) => d.decreeId)).toEqual(b.map((d) => d.decreeId));
  });

  it('world pulse returns identical results for identical state', () => {
    const state = { ...createDefaultScenario(), runSeed: 'fixed_seed_pulse' };
    const a = generateWorldPulse(state, SeasonMonth.Early, []);
    const b = generateWorldPulse(state, SeasonMonth.Early, []);
    expect(a.map((l) => l.sourceId)).toEqual(b.map((l) => l.sourceId));
  });

  it('different seeds can produce different decree order', () => {
    // Probabilistic check: over several seeds, at least one should differ from baseline.
    const baseline = generateDecreeCards({
      ...createDefaultScenario(),
      runSeed: 'seed_base',
    }).map((d) => d.decreeId);
    let sawDifferent = false;
    for (const seed of ['seed_a', 'seed_b', 'seed_c', 'seed_d', 'seed_e']) {
      const ids = generateDecreeCards({
        ...createDefaultScenario(),
        runSeed: seed,
      }).map((d) => d.decreeId);
      if (ids.join('|') !== baseline.join('|')) {
        sawDifferent = true;
        break;
      }
    }
    expect(sawDifferent).toBe(true);
  });
});
