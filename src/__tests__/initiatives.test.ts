// Phase 10 — Long-Term Initiatives tests.

import { describe, it, expect } from 'vitest';

import {
  commitInitiative,
  tickInitiativeProgress,
  abandonInitiative,
  isInitiativeComplete,
  evaluateFailureConditions,
  advanceFailureCounter,
  getInitiativeCardWeightBoost,
  getPerTurnPressureDelta,
  getInitiativeDefinition,
  INITIATIVE_BASELINE_PROGRESS,
  INITIATIVE_PROGRESS_PER_TAGGED_CARD,
  INITIATIVE_CARD_WEIGHT_MULTIPLIER,
  INITIATIVE_FAILURE_GRACE_TURNS,
} from '../engine/systems/initiatives';
import {
  INITIATIVE_DEFINITIONS,
  INITIATIVE_DEFINITION_IDS,
} from '../data/initiatives';
import { COURT_OPPORTUNITIES } from '../data/cards/court-opportunities';
import { createDefaultScenario } from '../data/scenarios/default';
import type { ActiveInitiative, GameState } from '../engine/types';
import type { CardTag } from '../engine/cards/types';

function commitOnScenario(defId: string): { state: GameState; initiative: ActiveInitiative } {
  const state = createDefaultScenario();
  const def = getInitiativeDefinition(defId)!;
  const initiative = commitInitiative(def, state.turn.turnNumber);
  state.activeInitiative = initiative;
  return { state, initiative };
}

describe('Phase 10 — data registry', () => {
  it('ships 10 authored initiative definitions', () => {
    expect(INITIATIVE_DEFINITION_IDS).toHaveLength(10);
  });

  it('every definition has required fields populated', () => {
    for (const def of Object.values(INITIATIVE_DEFINITIONS)) {
      expect(def.id.length).toBeGreaterThan(0);
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(0);
      expect(def.turnsRequired).toBeGreaterThanOrEqual(12);
      expect(def.turnsRequired).toBeLessThanOrEqual(24);
      expect(def.cardWeightingBoost.length).toBeGreaterThanOrEqual(2);
      expect(def.rewardSummary.length).toBeGreaterThan(0);
      expect(def.penaltySummary.length).toBeGreaterThan(0);
      expect(def.payoffTitle.length).toBeGreaterThan(0);
      expect(def.payoffBody.length).toBeGreaterThan(0);
    }
  });

  it('ships a commit opportunity for every definition plus one abandon', () => {
    const commits = COURT_OPPORTUNITIES.filter((o) => o.kind === 'initiative_commit');
    const abandons = COURT_OPPORTUNITIES.filter((o) => o.kind === 'initiative_abandon');
    expect(commits).toHaveLength(10);
    expect(abandons).toHaveLength(1);
    for (const c of commits) {
      if (c.kind !== 'initiative_commit') continue;
      expect(INITIATIVE_DEFINITIONS[c.definitionId]).toBeDefined();
    }
  });
});

describe('Phase 10 — commit / progress / complete', () => {
  it('commitInitiative produces a fresh zeroed state', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const a = commitInitiative(def, 7);
    expect(a.definitionId).toBe('init_found_university');
    expect(a.progressValue).toBe(0);
    expect(a.turnsActive).toBe(0);
    expect(a.turnsRequired).toBe(def.turnsRequired);
    expect(a.turnCommitted).toBe(7);
    expect(a.consecutiveFailingTurns).toBe(0);
  });

  it('tick with no matching tags still applies the baseline gain', () => {
    const { initiative } = commitOnScenario('init_found_university');
    const { next, completed } = tickInitiativeProgress(initiative, []);
    expect(completed).toBeNull();
    expect(next?.progressValue).toBe(INITIATIVE_BASELINE_PROGRESS);
    expect(next?.turnsActive).toBe(1);
  });

  it('tick adds bonus per matching tag', () => {
    const { initiative } = commitOnScenario('init_found_university');
    const def = getInitiativeDefinition('init_found_university')!;
    const matching = def.cardWeightingBoost.slice(0, 2) as CardTag[];
    const { next } = tickInitiativeProgress(initiative, matching);
    expect(next?.progressValue).toBe(
      INITIATIVE_BASELINE_PROGRESS + 2 * INITIATIVE_PROGRESS_PER_TAGGED_CARD,
    );
  });

  it('non-matching tags do not add bonus', () => {
    const { initiative } = commitOnScenario('init_found_university');
    const nonMatching: CardTag[] = ['aggressive', 'siege'];
    const { next } = tickInitiativeProgress(initiative, nonMatching);
    expect(next?.progressValue).toBe(INITIATIVE_BASELINE_PROGRESS);
  });

  it('caps progress at 100 and reports completion', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const near: ActiveInitiative = {
      definitionId: def.id,
      progressValue: 98,
      turnsActive: 15,
      turnsRequired: def.turnsRequired,
      turnCommitted: 1,
      consecutiveFailingTurns: 0,
    };
    const { next, completed } = tickInitiativeProgress(near, def.cardWeightingBoost as CardTag[]);
    expect(next).toBeNull();
    expect(completed).not.toBeNull();
    expect(completed!.progressValue).toBe(100);
    expect(isInitiativeComplete(completed!)).toBe(true);
  });

  it('unknown definitionId tick preserves state without throwing', () => {
    const ghost: ActiveInitiative = {
      definitionId: 'init_does_not_exist',
      progressValue: 10,
      turnsActive: 1,
      turnsRequired: 12,
      turnCommitted: 0,
      consecutiveFailingTurns: 0,
    };
    const { next, completed } = tickInitiativeProgress(ghost, ['cultural']);
    expect(completed).toBeNull();
    expect(next).toEqual(ghost);
  });

  it('null active in / null out', () => {
    const { next, completed } = tickInitiativeProgress(null, ['cultural']);
    expect(next).toBeNull();
    expect(completed).toBeNull();
  });
});

describe('Phase 10 — abandonment', () => {
  it('returns the authored abandon penalty', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const a = commitInitiative(def, 3);
    const { next, penalty } = abandonInitiative(a);
    expect(next).toBeNull();
    expect(penalty).toEqual(def.abandonPenalty);
  });
});

describe('Phase 10 — failure conditions', () => {
  it('trips when the watched field drops below threshold', () => {
    const state = createDefaultScenario();
    const def = getInitiativeDefinition('init_royal_bank')!;
    const a = commitInitiative(def, state.turn.turnNumber);
    state.activeInitiative = a;
    // init_royal_bank watches treasury.gold < 30. Force a low balance.
    const lowState: GameState = {
      ...state,
      treasury: { ...state.treasury, balance: 10 },
    };
    expect(evaluateFailureConditions(a, lowState)).toBe(true);
  });

  it('is false when the field is above threshold', () => {
    const state = createDefaultScenario();
    const def = getInitiativeDefinition('init_royal_bank')!;
    const a = commitInitiative(def, state.turn.turnNumber);
    const highState: GameState = {
      ...state,
      treasury: { ...state.treasury, balance: 1000 },
    };
    expect(evaluateFailureConditions(a, highState)).toBe(false);
  });

  it('is false when the definition has no failure conditions', () => {
    const state = createDefaultScenario();
    const def = getInitiativeDefinition('init_reform_coinage')!;
    expect(def.failureConditions).toHaveLength(0);
    const a = commitInitiative(def, state.turn.turnNumber);
    expect(evaluateFailureConditions(a, state)).toBe(false);
  });

  it('grace period: advanceFailureCounter auto-abandons after N consecutive failing turns', () => {
    const def = getInitiativeDefinition('init_royal_bank')!;
    let a = commitInitiative(def, 0);
    for (let i = 0; i < INITIATIVE_FAILURE_GRACE_TURNS - 1; i++) {
      const r = advanceFailureCounter(a, true);
      expect(r.shouldAutoAbandon).toBe(false);
      a = r.next;
    }
    const final = advanceFailureCounter(a, true);
    expect(final.shouldAutoAbandon).toBe(true);
  });

  it('advanceFailureCounter resets the counter on a non-failing turn', () => {
    const def = getInitiativeDefinition('init_royal_bank')!;
    let a = commitInitiative(def, 0);
    a = advanceFailureCounter(a, true).next;
    expect(a.consecutiveFailingTurns).toBe(1);
    a = advanceFailureCounter(a, false).next;
    expect(a.consecutiveFailingTurns).toBe(0);
  });
});

describe('Phase 10 — card weighting & pressure helpers', () => {
  it('getInitiativeCardWeightBoost returns 1.0 with no active initiative', () => {
    expect(getInitiativeCardWeightBoost(null, ['cultural'])).toBe(1.0);
    expect(getInitiativeCardWeightBoost(undefined, ['cultural'])).toBe(1.0);
  });

  it('getInitiativeCardWeightBoost returns the multiplier on match', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const a = commitInitiative(def, 0);
    expect(
      getInitiativeCardWeightBoost(a, def.cardWeightingBoost as CardTag[]),
    ).toBe(INITIATIVE_CARD_WEIGHT_MULTIPLIER);
  });

  it('getInitiativeCardWeightBoost returns 1.0 on no overlap', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const a = commitInitiative(def, 0);
    expect(getInitiativeCardWeightBoost(a, ['siege', 'aggressive'])).toBe(1.0);
  });

  it('getPerTurnPressureDelta returns {} with no active initiative', () => {
    expect(getPerTurnPressureDelta(null)).toEqual({});
  });

  it('getPerTurnPressureDelta returns the authored axes', () => {
    const def = getInitiativeDefinition('init_found_university')!;
    const a = commitInitiative(def, 0);
    expect(getPerTurnPressureDelta(a)).toEqual(def.perTurnPressureDelta);
  });
});

describe('Phase 10 — save compatibility', () => {
  it('fresh scenarios ship activeInitiative = null', () => {
    const s = createDefaultScenario();
    expect(s.activeInitiative).toBeNull();
  });
});
