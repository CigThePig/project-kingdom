// Reach scan §6 (heuristic) — attempt to surface cards whose trigger
// conditions never seem to fire across a randomized walk of GameState. Opt-in
// behind --with-reach because false-positive risk is high: a condition that
// only fires under a rare combination of derived stats can look unreachable
// under random sampling.
//
// Strategy: build N synthetic states by perturbing a few high-leverage scalars
// (treasury, food, stability, season, turn, faith, class satisfactions) within
// realistic ranges; for each event, check `evaluateCondition` on every
// triggerCondition; if none ever pass for any sampled state, emit POLISH.

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

function buildSamples(n: number): Sample[] {
  const base = createDefaultScenario();
  const samples: Sample[] = [];
  for (let i = 0; i < n; i++) {
    const turnNumber = randInt(1, 60);
    const month = ((turnNumber - 1) % 12) + 1;
    const seasonIndex = Math.floor((month - 1) / 3);
    const season = ([Season.Spring, Season.Summer, Season.Autumn, Season.Winter])[seasonIndex];

    const state: GameState = {
      ...base,
      turn: { ...base.turn, turnNumber, month, season, year: 1 + Math.floor((turnNumber - 1) / 12) },
      treasury: { ...base.treasury, balance: randInt(0, 1500) },
      food: { ...base.food, reserves: randInt(0, 1000) },
      stability: randInt(0, 100),
      faithCulture: { ...base.faithCulture, kingdomFaithLevel: randInt(0, 100), heterodoxyLevel: randInt(0, 50) },
      population: {
        ...base.population,
        [PopulationClass.Nobility]: { ...base.population[PopulationClass.Nobility], satisfaction: randInt(0, 100) },
        [PopulationClass.Clergy]: { ...base.population[PopulationClass.Clergy], satisfaction: randInt(0, 100) },
        [PopulationClass.Merchants]: { ...base.population[PopulationClass.Merchants], satisfaction: randInt(0, 100) },
        [PopulationClass.Commoners]: { ...base.population[PopulationClass.Commoners], satisfaction: randInt(0, 100) },
        [PopulationClass.MilitaryCaste]: { ...base.population[PopulationClass.MilitaryCaste], satisfaction: randInt(0, 100) },
      },
      military: {
        ...base.military,
        readiness: randInt(0, 100),
      },
    };
    samples.push({ state, turnNumber });
  }
  return samples;
}

function randInt(lo: number, hi: number): number {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

// Keep a reference to EventSeverity so the import isn't dropped by the
// linter; severity is reported in the details object for triage.
void EventSeverity;
