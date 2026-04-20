// Reach scan §6 (heuristic) — attempt to surface cards whose trigger
// conditions never seem to fire across a sampled walk of GameState. Opt-in
// behind --with-reach because false-positive risk is high: a condition that
// only fires under a rare combination of derived stats can look unreachable
// under shallow sampling.
//
// Phase 6 upgrade: use fast-check to drive deterministic property-based
// sampling instead of ad-hoc randInt loops. We still generate SAMPLE_COUNT
// synthetic states by perturbing a few high-leverage scalars (treasury, food,
// stability, season, turn, faith, class satisfactions) within realistic
// ranges, but the arbitrary is seeded so runs are stable and reproducible
// across audit invocations.
//
// If fast-check fails to import for any reason we fall back to the prior
// random sampler so the scan never hard-breaks the audit pipeline.

import fc from 'fast-check';

import { evaluateCondition } from '../../../../src/engine/events/event-engine';
import {
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../../src/engine/types';
import type { GameState } from '../../../../src/engine/types';
import { createDefaultScenario } from '../../../../src/data/scenarios/default';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'reach.trigger-attainability';

const SAMPLE_COUNT = 500;
const FC_SEED = 1_742_451_337;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  const samples = buildSamples(SAMPLE_COUNT);

  for (const ev of corpus.eventById.values()) {
    if (ev.triggerConditions.length === 0) continue;

    let everPassed = false;
    for (const { state, turnNumber } of samples) {
      const allPass = ev.triggerConditions.every((c) => evaluateCondition(c, state, turnNumber));
      if (allPass) {
        everPassed = true;
        break;
      }
    }

    if (!everPassed) {
      out.push({
        severity: 'POLISH',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'TRIGGER_UNREACHABLE',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Across ${SAMPLE_COUNT} sampled states, ${ev.id}'s trigger conditions never simultaneously held. Manual review recommended.`,
        confidence: 'HEURISTIC',
        details: {
          severity: ev.severity,
          conditionCount: ev.triggerConditions.length,
          conditionTypes: ev.triggerConditions.map((c) => c.type),
        },
      });
    }
  }

  return out;
};

interface Sample {
  state: GameState;
  turnNumber: number;
}

interface SampleScalars {
  turnNumber: number;
  treasuryBalance: number;
  foodReserves: number;
  stability: number;
  faithLevel: number;
  heterodoxyLevel: number;
  nobilitySat: number;
  clergySat: number;
  merchantsSat: number;
  commonersSat: number;
  militaryCasteSat: number;
  militaryReadiness: number;
}

function sampleArbitrary(): fc.Arbitrary<SampleScalars> {
  return fc.record({
    turnNumber: fc.integer({ min: 1, max: 60 }),
    treasuryBalance: fc.integer({ min: 0, max: 1500 }),
    foodReserves: fc.integer({ min: 0, max: 1000 }),
    stability: fc.integer({ min: 0, max: 100 }),
    faithLevel: fc.integer({ min: 0, max: 100 }),
    heterodoxyLevel: fc.integer({ min: 0, max: 50 }),
    nobilitySat: fc.integer({ min: 0, max: 100 }),
    clergySat: fc.integer({ min: 0, max: 100 }),
    merchantsSat: fc.integer({ min: 0, max: 100 }),
    commonersSat: fc.integer({ min: 0, max: 100 }),
    militaryCasteSat: fc.integer({ min: 0, max: 100 }),
    militaryReadiness: fc.integer({ min: 0, max: 100 }),
  });
}

function buildSamples(n: number): Sample[] {
  const base = createDefaultScenario();
  const scalarList = drawScalars(n);
  const samples: Sample[] = [];
  for (const s of scalarList) {
    samples.push({ state: assembleState(base, s), turnNumber: s.turnNumber });
  }
  return samples;
}

function drawScalars(n: number): SampleScalars[] {
  try {
    return fc.sample(sampleArbitrary(), { numRuns: n, seed: FC_SEED });
  } catch {
    // Fallback to prior random sampling if fast-check ever fails to run in
    // this environment — keep the scan operational.
    const out: SampleScalars[] = [];
    for (let i = 0; i < n; i++) {
      out.push({
        turnNumber: randInt(1, 60),
        treasuryBalance: randInt(0, 1500),
        foodReserves: randInt(0, 1000),
        stability: randInt(0, 100),
        faithLevel: randInt(0, 100),
        heterodoxyLevel: randInt(0, 50),
        nobilitySat: randInt(0, 100),
        clergySat: randInt(0, 100),
        merchantsSat: randInt(0, 100),
        commonersSat: randInt(0, 100),
        militaryCasteSat: randInt(0, 100),
        militaryReadiness: randInt(0, 100),
      });
    }
    return out;
  }
}

function assembleState(base: GameState, s: SampleScalars): GameState {
  const month = ((s.turnNumber - 1) % 12) + 1;
  const seasonIndex = Math.floor((month - 1) / 3);
  const season = ([Season.Spring, Season.Summer, Season.Autumn, Season.Winter])[seasonIndex];
  return {
    ...base,
    turn: { ...base.turn, turnNumber: s.turnNumber, month, season, year: 1 + Math.floor((s.turnNumber - 1) / 12) },
    treasury: { ...base.treasury, balance: s.treasuryBalance },
    food: { ...base.food, reserves: s.foodReserves },
    stability: s.stability,
    faithCulture: { ...base.faithCulture, kingdomFaithLevel: s.faithLevel, heterodoxyLevel: s.heterodoxyLevel },
    population: {
      ...base.population,
      [PopulationClass.Nobility]: { ...base.population[PopulationClass.Nobility], satisfaction: s.nobilitySat },
      [PopulationClass.Clergy]: { ...base.population[PopulationClass.Clergy], satisfaction: s.clergySat },
      [PopulationClass.Merchants]: { ...base.population[PopulationClass.Merchants], satisfaction: s.merchantsSat },
      [PopulationClass.Commoners]: { ...base.population[PopulationClass.Commoners], satisfaction: s.commonersSat },
      [PopulationClass.MilitaryCaste]: { ...base.population[PopulationClass.MilitaryCaste], satisfaction: s.militaryCasteSat },
    },
    military: {
      ...base.military,
      readiness: s.militaryReadiness,
    },
  };
}

function randInt(lo: number, hi: number): number {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

// Keep a reference to EventSeverity so the import isn't dropped by the
// linter; severity is reported in the details object for triage.
void EventSeverity;
