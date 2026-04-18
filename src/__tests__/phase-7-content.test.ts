// Phase 7 — Content Expansion tests.
// Smoke tests that the new wave-2 hand cards, decrees, events, and overtures
// are registered and produce well-formed state transitions.

import { describe, it, expect } from 'vitest';

import { createDefaultScenario } from '../data/scenarios/default';
import { HAND_CARDS } from '../data/cards/hand-cards';
import {
  HAND_CARDS_EXPANDED,
  type HandCardIdExpanded,
} from '../data/cards/hand-cards-expanded';
import { EVENT_POOL } from '../data/events';
import { EVENT_CHOICE_EFFECTS } from '../data/events/effects';
import { DECREE_POOL } from '../data/decrees';
import { EXPANSION_WAVE_2_DECREES } from '../data/decrees/expansion-wave-2';
import { EXPANSION_WAVE_2_CRISES } from '../data/events/expansion/wave-2';
import { EXPANSION_WAVE_2_PETITIONS } from '../data/events/expansion/petitions-wave-2';
import { WAVE_2_OVERTURES } from '../data/overtures/wave-2';
import { generateOvertureCards } from '../bridge/diplomaticOvertureGenerator';
import {
  PopulationClass,
  RivalAgenda,
  type GameState,
} from '../engine/types';

const EXPANDED_IDS = Object.keys(HAND_CARDS_EXPANDED) as HandCardIdExpanded[];

describe('Phase 7 — hand cards expanded', () => {
  it('registers 20 new hand cards', () => {
    expect(EXPANDED_IDS).toHaveLength(20);
  });

  it('grows HAND_CARDS to 40 entries when merged with the base set', () => {
    expect(Object.keys(HAND_CARDS)).toHaveLength(40);
  });

  it('every wave-2 hand card resolves on a default scenario without throwing', () => {
    const state = createDefaultScenario();
    for (const id of EXPANDED_IDS) {
      const def = HAND_CARDS[id];
      expect(def, `missing definition for ${id}`).toBeDefined();
      const choice = pickChoiceFor(def.requiresChoice, state);
      const next = def.apply(state, choice);
      expect(next, `apply returned no state for ${id}`).toBeDefined();
      expect(typeof next.turn.turnNumber).toBe('number');
    }
  });

  it('every wave-2 hand card has its id mirrored in its definition', () => {
    for (const id of EXPANDED_IDS) {
      expect(HAND_CARDS_EXPANDED[id].id).toBe(id);
    }
  });
});

describe('Phase 7 — wave-2 events', () => {
  it('registers wave-2 crisis events in EVENT_POOL', () => {
    for (const def of EXPANSION_WAVE_2_CRISES) {
      const found = EVENT_POOL.find((e) => e.id === def.id);
      expect(found, `missing crisis ${def.id} in EVENT_POOL`).toBeDefined();
    }
  });

  it('registers wave-2 petitions in EVENT_POOL', () => {
    for (const def of EXPANSION_WAVE_2_PETITIONS) {
      const found = EVENT_POOL.find((e) => e.id === def.id);
      expect(found, `missing petition ${def.id} in EVENT_POOL`).toBeDefined();
    }
  });

  it('every wave-2 event has effect deltas registered for every choice', () => {
    const allWave2 = [...EXPANSION_WAVE_2_CRISES, ...EXPANSION_WAVE_2_PETITIONS];
    for (const def of allWave2) {
      const effects = EVENT_CHOICE_EFFECTS[def.id];
      expect(effects, `no effect map for event ${def.id}`).toBeDefined();
      for (const choice of def.choices) {
        expect(
          effects[choice.choiceId],
          `no effect delta for ${def.id}.${choice.choiceId}`,
        ).toBeDefined();
      }
    }
  });
});

describe('Phase 7 — wave-2 decrees', () => {
  it('registers wave-2 decrees in DECREE_POOL', () => {
    for (const def of EXPANSION_WAVE_2_DECREES) {
      const found = DECREE_POOL.find((d) => d.id === def.id);
      expect(found, `missing decree ${def.id} in DECREE_POOL`).toBeDefined();
    }
  });

  it('every wave-2 decree carries a non-empty title and effect preview', () => {
    for (const def of EXPANSION_WAVE_2_DECREES) {
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.effectPreview.length).toBeGreaterThan(0);
    }
  });
});

describe('Phase 7 — wave-2 overtures', () => {
  it('exposes 10 wave-2 overtures', () => {
    expect(WAVE_2_OVERTURES).toHaveLength(10);
  });

  it('every wave-2 overture build() produces a well-formed spec', () => {
    for (const o of WAVE_2_OVERTURES) {
      const spec = o.build('Test Realm');
      expect(spec.title).toContain('Test Realm');
      expect(spec.grantTitle.length).toBeGreaterThan(0);
      expect(spec.denyTitle.length).toBeGreaterThan(0);
      expect(spec.grantEffects.length).toBeGreaterThan(0);
      expect(spec.denyEffects.length).toBeGreaterThan(0);
    }
  });

  it('generator surfaces a wave-2 overture for an agenda not covered inline', () => {
    const base = createDefaultScenario();
    const neighbor = base.diplomacy.neighbors[0];
    expect(neighbor).toBeDefined();
    // Force a previously uncovered agenda past the progress threshold.
    const state: GameState = {
      ...base,
      diplomacy: {
        ...base.diplomacy,
        neighbors: base.diplomacy.neighbors.map((n, i) =>
          i === 0
            ? {
                ...n,
                agenda: {
                  current: RivalAgenda.EconomicRecovery,
                  targetEntityId: null,
                  progressValue: 80,
                  turnsActive: 5,
                },
              }
            : n,
        ),
      },
    };
    const cards = generateOvertureCards(state);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].eventId.startsWith('overture_')).toBe(true);
  });
});

function pickChoiceFor(
  kind: 'class' | 'rival' | undefined,
  state: GameState,
): { kind: 'none' } | { kind: 'class'; class: PopulationClass } | { kind: 'rival'; neighborId: string } {
  if (kind === 'class') return { kind: 'class', class: PopulationClass.Commoners };
  if (kind === 'rival') {
    const id = state.diplomacy.neighbors[0]?.id ?? '';
    return { kind: 'rival', neighborId: id };
  }
  return { kind: 'none' };
}
