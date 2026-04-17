// Phase 5 — Court Hand tests.
// Covers: pure-function semantics of court-hand.ts, play-dispatch of
// representative hand cards, save-migration for pre-v4 saves.

import { describe, it, expect } from 'vitest';

import {
  addCardToHand,
  canAddToHand,
  createInitialCourtHand,
  DEFAULT_COURT_HAND_CAPACITY,
  removeCardFromHand,
  tickHandExpiry,
} from '../engine/systems/court-hand';
import {
  HAND_CARDS,
  buildHandCard,
  handCardDefinitionFromCard,
} from '../data/cards/hand-cards';
import { gameReducer, createInitialState, createScenarioState } from '../context/game-context';
import type { GameState, SaveFile } from '../engine/types';

describe('court-hand pure functions', () => {
  it('createInitialCourtHand returns an empty 5-slot hand', () => {
    const hand = createInitialCourtHand();
    expect(hand.slots).toEqual([]);
    expect(hand.capacity).toBe(DEFAULT_COURT_HAND_CAPACITY);
    expect(hand.capacity).toBe(5);
  });

  it('canAddToHand reflects slot count vs capacity', () => {
    let hand = createInitialCourtHand();
    expect(canAddToHand(hand)).toBe(true);
    for (let i = 0; i < hand.capacity; i++) {
      hand = addCardToHand(hand, buildHandCard('hand_grain_reserve'), 1);
    }
    expect(hand.slots.length).toBe(5);
    expect(canAddToHand(hand)).toBe(false);
  });

  it('addCardToHand respects capacity (past-capacity is a no-op)', () => {
    let hand = createInitialCourtHand();
    for (let i = 0; i < 5; i++) {
      hand = addCardToHand(hand, buildHandCard('hand_grain_reserve'), 1);
    }
    const before = hand.slots.length;
    hand = addCardToHand(hand, buildHandCard('hand_reserve_forces'), 1);
    expect(hand.slots.length).toBe(before);
  });

  it('addCardToHand seeds turnsUntilExpiry from card.expiresAfterTurns', () => {
    const hand = createInitialCourtHand();
    const card = buildHandCard('hand_reserve_forces'); // expiresAfterTurns: 10
    const next = addCardToHand(hand, card, 3);
    expect(next.slots).toHaveLength(1);
    expect(next.slots[0].turnsUntilExpiry).toBe(10);
    expect(next.slots[0].turnAdded).toBe(3);
  });

  it('removeCardFromHand matches by card id', () => {
    let hand = createInitialCourtHand();
    const a = buildHandCard('hand_grain_reserve');
    const b = buildHandCard('hand_reserve_forces');
    hand = addCardToHand(hand, a, 1);
    hand = addCardToHand(hand, b, 1);
    const after = removeCardFromHand(hand, a.id);
    expect(after.slots).toHaveLength(1);
    expect(after.slots[0].card.id).toBe(b.id);
  });

  it('tickHandExpiry decrements each slot and collects expired cards', () => {
    let hand = createInitialCourtHand();
    hand = addCardToHand(hand, buildHandCard('hand_reserve_forces'), 1); // 10
    hand = addCardToHand(hand, buildHandCard('hand_forced_levy'), 1);    // 8
    const almost = {
      ...hand,
      slots: hand.slots.map((s) => ({ ...s, turnsUntilExpiry: 1 })),
    };
    const { hand: tickedHand, expiredCards } = tickHandExpiry(almost);
    expect(tickedHand.slots).toHaveLength(0);
    expect(expiredCards).toHaveLength(2);
  });

  it('tickHandExpiry leaves non-zero slots intact with decremented counters', () => {
    let hand = createInitialCourtHand();
    hand = addCardToHand(hand, buildHandCard('hand_reserve_forces'), 1);
    const { hand: ticked, expiredCards } = tickHandExpiry(hand);
    expect(ticked.slots).toHaveLength(1);
    expect(ticked.slots[0].turnsUntilExpiry).toBe(9);
    expect(expiredCards).toEqual([]);
  });
});

describe('handCardDefinitionFromCard reverse lookup', () => {
  it('resolves every registered hand card by envelope id', () => {
    for (const id of Object.keys(HAND_CARDS)) {
      const card = buildHandCard(id as keyof typeof HAND_CARDS);
      const def = handCardDefinitionFromCard(card);
      expect(def).not.toBeNull();
      expect(def!.id).toBe(id);
    }
  });

  it('returns null for non-initiative cards', () => {
    const fake = { ...buildHandCard('hand_reserve_forces'), family: 'petition' as const };
    // Cast away the strict family — mimics a card that isn't ours.
    const def = handCardDefinitionFromCard(fake as unknown as ReturnType<typeof buildHandCard>);
    expect(def).toBeNull();
  });
});

describe('hand card apply() semantics', () => {
  it('Reserve Forces increments military readiness by 20', () => {
    const state = createScenarioState();
    const before = state.military.readiness;
    const applied = HAND_CARDS.hand_reserve_forces.apply(state, { kind: 'none' });
    expect(applied.military.readiness - before).toBe(20);
  });

  it('Grain Reserve bumps food reserves by 300', () => {
    const state = createScenarioState();
    const before = state.food.reserves;
    const applied = HAND_CARDS.hand_grain_reserve.apply(state, { kind: 'none' });
    expect(applied.food.reserves - before).toBe(300);
  });

  it('Royal Pardon removes the first persistent consequence if any', () => {
    const state = createScenarioState();
    const seeded: GameState = {
      ...state,
      persistentConsequences: [
        {
          sourceId: 'src1',
          sourceType: 'event',
          choiceMade: 'c',
          turnApplied: 1,
          tag: 'pc1',
        },
        {
          sourceId: 'src2',
          sourceType: 'event',
          choiceMade: 'c',
          turnApplied: 1,
          tag: 'pc2',
        },
      ],
    };
    const applied = HAND_CARDS.hand_royal_pardon.apply(seeded, { kind: 'none' });
    expect(applied.persistentConsequences).toHaveLength(1);
    expect(applied.persistentConsequences[0].tag).toBe('pc2');
  });
});

describe('GameState initialization', () => {
  it('all scenarios start with an empty 5-slot court hand', () => {
    const ids = ['new_crown', 'fractured_inheritance', 'merchants_gambit', 'frozen_march', 'faithful_kingdom'];
    for (const id of ids) {
      const state = createScenarioState(id);
      expect(state.courtHand).toBeDefined();
      expect(state.courtHand.slots).toEqual([]);
      expect(state.courtHand.capacity).toBe(5);
    }
  });
});

describe('LOAD_SAVE court-hand migration (Phase 5)', () => {
  function makeLegacySave(): SaveFile {
    const fresh = createScenarioState();
    // Strip courtHand to emulate a pre-v4 save.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { courtHand: _ch, ...rest } = fresh;
    return {
      version: 3,
      scenarioId: fresh.scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: rest as GameState,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
  }

  it('pre-v4 save loads with an empty default hand', () => {
    const save = makeLegacySave();
    const result = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(result.gameState.courtHand).toBeDefined();
    expect(result.gameState.courtHand.slots).toEqual([]);
    expect(result.gameState.courtHand.capacity).toBe(5);
  });

  it('v4 save round-trips the hand state', () => {
    let fresh = createScenarioState();
    fresh = {
      ...fresh,
      courtHand: addCardToHand(
        fresh.courtHand,
        buildHandCard('hand_reserve_forces'),
        fresh.turn.turnNumber,
      ),
    };
    const save: SaveFile = {
      version: 4,
      scenarioId: fresh.scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: fresh,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
    const loaded = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(loaded.gameState.courtHand.slots).toHaveLength(1);
    expect(loaded.gameState.courtHand.slots[0].card.id).toBe('hand:hand_reserve_forces');
  });
});
