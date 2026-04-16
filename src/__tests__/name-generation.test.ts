// Phase 1 — Tests for procedural name generation.

import { describe, expect, it } from 'vitest';
import { RivalPersonality, TerrainType } from '../engine/types';
import {
  generateAgentCodename,
  generateCapitalName,
  generateDynastyName,
  generateEpithet,
  generateKingdomName,
  generateNeighborNames,
  generateRegionName,
  generateRulerName,
  generateRunSeed,
  seededRandom,
} from '../data/text/name-generation';

describe('seededRandom', () => {
  it('produces deterministic sequences for the same seed', () => {
    const rngA = seededRandom('test_seed');
    const rngB = seededRandom('test_seed');
    for (let i = 0; i < 10; i++) {
      expect(rngA()).toBe(rngB());
    }
  });

  it('produces different sequences for different seeds', () => {
    const rngA = seededRandom('seed_a');
    const rngB = seededRandom('seed_b');
    let differs = false;
    for (let i = 0; i < 10; i++) {
      if (rngA() !== rngB()) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });

  it('returns values in [0, 1)', () => {
    const rng = seededRandom('range_test');
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('generateKingdomName', () => {
  it('is deterministic for the same (seed, culture) pair', () => {
    const a = generateKingdomName('seed_a', 'highland');
    const b = generateKingdomName('seed_a', 'highland');
    expect(a).toBe(b);
  });

  it('varies by seed', () => {
    const a = generateKingdomName('seed_a', 'highland');
    const b = generateKingdomName('seed_b', 'highland');
    expect(a).not.toBe(b);
  });

  it('produces non-empty strings', () => {
    for (let i = 0; i < 50; i++) {
      const name = generateKingdomName(`seed_${i}`, 'coastal');
      expect(name.length).toBeGreaterThan(0);
    }
  });

  it('produces variety across many seeds', () => {
    const names = new Set<string>();
    for (let i = 0; i < 100; i++) {
      names.add(generateKingdomName(`seed_${i}`, 'highland'));
    }
    // With 30 prefixes × 30 roots × 8 patterns = 7200 possibilities,
    // 100 random seeds should easily produce 50+ unique names.
    expect(names.size).toBeGreaterThanOrEqual(50);
  });

  it('handles unknown culture gracefully', () => {
    const name = generateKingdomName('seed_a', 'unknown_culture_id');
    expect(name.length).toBeGreaterThan(0);
  });
});

describe('generateRulerName', () => {
  it('is deterministic for the same seed', () => {
    const a = generateRulerName('seed_a', 'highland');
    const b = generateRulerName('seed_a', 'highland');
    expect(a.fullName).toBe(b.fullName);
  });

  it('respects explicit gender parameter', () => {
    const masculineTitles = ['King', 'High Lord', 'Emperor', 'Sovereign', 'Warlord'];
    const feminineTitles = ['Queen', 'High Lady', 'Empress', 'Sovereign'];

    for (let i = 0; i < 20; i++) {
      const m = generateRulerName(`seed_m_${i}`, 'highland', 'M');
      const f = generateRulerName(`seed_f_${i}`, 'highland', 'F');
      expect(masculineTitles).toContain(m.title);
      expect(feminineTitles).toContain(f.title);
    }
  });

  it('produces a fullName combining title and first name', () => {
    const r = generateRulerName('seed_a', 'highland');
    expect(r.fullName).toContain(r.firstName);
    expect(r.fullName).toContain(r.title);
  });
});

describe('generateDynastyName', () => {
  it('is deterministic', () => {
    const a = generateDynastyName('seed_a', 'highland');
    const b = generateDynastyName('seed_a', 'highland');
    expect(a).toBe(b);
  });

  it('produces variety', () => {
    const names = new Set<string>();
    for (let i = 0; i < 100; i++) {
      names.add(generateDynastyName(`seed_${i}`, 'orthodox'));
    }
    expect(names.size).toBeGreaterThanOrEqual(50);
  });
});

describe('generateEpithet', () => {
  it('is deterministic', () => {
    const a = generateEpithet('seed_a', RivalPersonality.AmbitiousMilitaristic);
    const b = generateEpithet('seed_a', RivalPersonality.AmbitiousMilitaristic);
    expect(a).toBe(b);
  });

  it('returns null for some seeds (not all rulers earn an epithet)', () => {
    let nullCount = 0;
    for (let i = 0; i < 100; i++) {
      const e = generateEpithet(`seed_${i}`, RivalPersonality.MercantilePragmatic);
      if (e === null) nullCount++;
    }
    // ~40% should be null — allow generous tolerance
    expect(nullCount).toBeGreaterThan(20);
    expect(nullCount).toBeLessThan(60);
  });

  it('selects from aggressive pool for AmbitiousMilitaristic', () => {
    const aggressive = ['Iron-Handed', 'Conqueror', 'Wolf', 'Unyielding', 'Bloody', 'Fierce',
      'Stormbringer', 'Bold', 'Hammer', 'Spear', 'Burner', 'Reaver', 'Implacable', 'Wrathful', 'Sword'];
    let aggressiveCount = 0;
    for (let i = 0; i < 100; i++) {
      const e = generateEpithet(`seed_${i}`, RivalPersonality.AmbitiousMilitaristic);
      if (e && aggressive.some((a) => e.includes(a))) aggressiveCount++;
    }
    expect(aggressiveCount).toBeGreaterThan(40); // most non-null results should be aggressive
  });
});

describe('generateRegionName', () => {
  it('is deterministic', () => {
    const a = generateRegionName('seed_a', TerrainType.Plains);
    const b = generateRegionName('seed_a', TerrainType.Plains);
    expect(a).toBe(b);
  });

  it('produces appropriate names per terrain', () => {
    const plainsName = generateRegionName('seed_a', TerrainType.Plains);
    const mountainName = generateRegionName('seed_a', TerrainType.Mountain);
    expect(plainsName).toContain('the ');
    expect(mountainName).toContain('the ');
  });
});

describe('generateAgentCodename', () => {
  it('is deterministic', () => {
    const a = generateAgentCodename('seed_a');
    const b = generateAgentCodename('seed_a');
    expect(a).toBe(b);
  });

  it('produces variety', () => {
    const names = new Set<string>();
    for (let i = 0; i < 100; i++) {
      names.add(generateAgentCodename(`seed_${i}`));
    }
    expect(names.size).toBeGreaterThan(40);
  });
});

describe('generateCapitalName', () => {
  it('is deterministic', () => {
    const a = generateCapitalName('seed_a', 'highland');
    const b = generateCapitalName('seed_a', 'highland');
    expect(a).toBe(b);
  });

  it('starts with a capital letter', () => {
    const name = generateCapitalName('seed_a', 'highland');
    expect(name.charAt(0)).toBe(name.charAt(0).toUpperCase());
  });
});

describe('generateNeighborNames', () => {
  it('produces a complete name set', () => {
    const names = generateNeighborNames(
      'run_seed_1',
      'neighbor_test',
      'highland',
      RivalPersonality.AmbitiousMilitaristic,
    );
    expect(names.displayName).toBeTruthy();
    expect(names.rulerName).toBeTruthy();
    expect(names.rulerTitle).toBeTruthy();
    expect(names.dynastyName).toBeTruthy();
    expect(names.capitalName).toBeTruthy();
    // epithet may be null
  });

  it('is deterministic for the same inputs', () => {
    const a = generateNeighborNames('run_1', 'n_1', 'coastal', RivalPersonality.MercantilePragmatic);
    const b = generateNeighborNames('run_1', 'n_1', 'coastal', RivalPersonality.MercantilePragmatic);
    expect(a).toEqual(b);
  });

  it('varies by runSeed', () => {
    const a = generateNeighborNames('run_1', 'n_1', 'coastal', RivalPersonality.MercantilePragmatic);
    const b = generateNeighborNames('run_2', 'n_1', 'coastal', RivalPersonality.MercantilePragmatic);
    expect(a.displayName).not.toBe(b.displayName);
  });

  it('varies by neighborId within the same run', () => {
    const a = generateNeighborNames('run_1', 'neighbor_arenthal', 'coastal', RivalPersonality.MercantilePragmatic);
    const b = generateNeighborNames('run_1', 'neighbor_valdris', 'coastal', RivalPersonality.MercantilePragmatic);
    expect(a.displayName).not.toBe(b.displayName);
  });
});

describe('generateRunSeed', () => {
  it('produces non-empty unique strings', () => {
    const a = generateRunSeed();
    // Force a tiny delay to ensure timestamp differs
    const b = generateRunSeed();
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    // Highly likely to differ given random component
    expect(a).not.toBe(b);
  });
});
