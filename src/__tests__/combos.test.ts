// Phase 6 — Card Combos & Synergies tests.
// Covers: combo detection windowing, bonus application, UI helper, registry
// integrity against the hand-card catalog, save migration for pre-v5 saves.

import { describe, it, expect } from 'vitest';

import {
  applyComboBonus,
  collectPlayedComboKeys,
  detectCombosForTurn,
  findPotentialCombosForCard,
} from '../engine/systems/combo-engine';
import type { CardCombo } from '../engine/cards/combos';
import { COMBOS, COMBO_BY_ID } from '../data/cards/combos';
import { buildHandCard, type HandCardId } from '../data/cards/hand-cards';
import { createInitialCourtHand, addCardToHand } from '../engine/systems/court-hand';
import { gameReducer, createInitialState, createScenarioState } from '../context/game-context';
import type { GameState, QueuedAction, SaveFile, TurnHistoryEntry } from '../engine/types';
import { ActionType, Season } from '../engine/types';

function historyEntry(turnNumber: number, keys: string[]): TurnHistoryEntry {
  return {
    turnNumber,
    season: Season.Spring,
    year: 1,
    snapshotSummary: {
      treasuryBalance: 0,
      foodReserves: 0,
      stabilityValue: 0,
      activeEventCount: 0,
    },
    actionsIssued: [],
    eventsResolved: [],
    playedComboKeys: keys,
  };
}

describe('detectCombosForTurn — windowing', () => {
  const singleTurnCombo: CardCombo = {
    id: 'test_same_turn',
    name: 'Test Same Turn',
    description: 'Both keys on the same turn.',
    requiredKeys: ['mass_conscription', 'reserve_forces'],
    windowTurns: 1,
    bonusEffect: { militaryReadinessDelta: 10 },
  };
  const crossTurnCombo: CardCombo = {
    id: 'test_cross_turn',
    name: 'Test Cross Turn',
    description: 'Keys split across consecutive turns.',
    requiredKeys: ['festival_decree', 'famine_relief'],
    windowTurns: 2,
    bonusEffect: { commonerSatDelta: 15 },
  };

  it('fires a same-turn combo when all keys are played this turn', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['mass_conscription', 'reserve_forces'],
      history: [],
      currentTurn: 5,
      registry: [singleTurnCombo],
      alreadyDiscovered: [],
    });
    expect(procs).toHaveLength(1);
    expect(procs[0].comboId).toBe('test_same_turn');
    expect(procs[0].firedOnTurn).toBe(5);
    expect(procs[0].isFirstDiscovery).toBe(true);
  });

  it('does NOT fire a same-turn combo when one key is missing', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['mass_conscription'],
      history: [],
      currentTurn: 5,
      registry: [singleTurnCombo],
      alreadyDiscovered: [],
    });
    expect(procs).toHaveLength(0);
  });

  it('does NOT fire a same-turn combo when keys are split across turns', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['reserve_forces'],
      history: [historyEntry(4, ['mass_conscription'])],
      currentTurn: 5,
      registry: [singleTurnCombo],
      alreadyDiscovered: [],
    });
    expect(procs).toHaveLength(0);
  });

  it('fires a cross-turn combo when the second key is played this turn', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['famine_relief'],
      history: [historyEntry(4, ['festival_decree'])],
      currentTurn: 5,
      registry: [crossTurnCombo],
      alreadyDiscovered: [],
    });
    expect(procs).toHaveLength(1);
    expect(procs[0].comboId).toBe('test_cross_turn');
  });

  it('does NOT re-fire a cross-turn combo when the next turn adds no fresh required key', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['unrelated_key'],
      history: [
        historyEntry(4, ['festival_decree']),
        historyEntry(5, ['famine_relief']),
      ],
      currentTurn: 6,
      registry: [crossTurnCombo],
      alreadyDiscovered: ['test_cross_turn'],
    });
    expect(procs).toHaveLength(0);
  });

  it('marks isFirstDiscovery false once the combo is in alreadyDiscovered', () => {
    const procs = detectCombosForTurn({
      currentKeys: ['mass_conscription', 'reserve_forces'],
      history: [],
      currentTurn: 7,
      registry: [singleTurnCombo],
      alreadyDiscovered: ['test_same_turn'],
    });
    expect(procs).toHaveLength(1);
    expect(procs[0].isFirstDiscovery).toBe(false);
  });
});

describe('applyComboBonus', () => {
  it('routes the bonusEffect through applyMechanicalEffectDelta', () => {
    const state = createScenarioState();
    const combo: CardCombo = {
      id: 'test_bonus',
      name: 'Test Bonus',
      description: 'Applies a treasury delta.',
      requiredKeys: ['a'],
      windowTurns: 1,
      bonusEffect: { treasuryDelta: 50 },
    };
    const before = state.treasury.balance;
    const after = applyComboBonus(state, combo, 1);
    expect(after.treasury.balance).toBe(before + 50);
  });

  it('installs a kingdom feature when unlocksKingdomFeature is set', () => {
    const state = createScenarioState();
    const combo: CardCombo = {
      id: 'test_feature',
      name: 'Test Feature',
      description: 'Unlocks a feature.',
      requiredKeys: ['a'],
      windowTurns: 1,
      bonusEffect: {},
      unlocksKingdomFeature: 'combo_feature_tag',
    };
    const after = applyComboBonus(state, combo, 3);
    expect(
      after.activeKingdomFeatures.some((f) => f.sourceTag === 'combo_feature_tag'),
    ).toBe(true);
  });

  it('does not duplicate a kingdom feature if already unlocked', () => {
    let state = createScenarioState();
    const combo: CardCombo = {
      id: 'test_feature',
      name: 'Test Feature',
      description: 'Unlocks a feature.',
      requiredKeys: ['a'],
      windowTurns: 1,
      bonusEffect: {},
      unlocksKingdomFeature: 'combo_feature_tag',
    };
    state = applyComboBonus(state, combo, 3);
    state = applyComboBonus(state, combo, 4);
    const count = state.activeKingdomFeatures.filter(
      (f) => f.sourceTag === 'combo_feature_tag',
    ).length;
    expect(count).toBe(1);
  });
});

describe('collectPlayedComboKeys', () => {
  it('joins actions against a card map and de-duplicates keys', () => {
    const card1 = buildHandCard('hand_forced_levy'); // mass_conscription
    const card2 = buildHandCard('hand_reserve_forces'); // reserve_forces
    const actions: QueuedAction[] = [
      {
        id: 'a1',
        type: ActionType.PolicyChange,
        actionDefinitionId: 'd1',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
      {
        id: 'a2',
        type: ActionType.PolicyChange,
        actionDefinitionId: 'd2',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
    ];
    const map = new Map([
      ['a1', card1],
      ['a2', card2],
    ]);
    const keys = collectPlayedComboKeys(actions, map);
    expect(keys.sort()).toEqual(['mass_conscription', 'reserve_forces'].sort());
  });
});

describe('findPotentialCombosForCard', () => {
  it('returns combos the card can complete with another hand card', () => {
    let hand = createInitialCourtHand();
    hand = addCardToHand(hand, buildHandCard('hand_forced_levy'), 1);
    hand = addCardToHand(hand, buildHandCard('hand_reserve_forces'), 1);
    const card = buildHandCard('hand_forced_levy');
    const matches = findPotentialCombosForCard(card, hand, COMBOS);
    expect(matches.map((c) => c.id)).toContain('combo_iron_dawn');
  });

  it('returns empty when no partner key is in hand', () => {
    let hand = createInitialCourtHand();
    hand = addCardToHand(hand, buildHandCard('hand_forced_levy'), 1);
    const card = buildHandCard('hand_forced_levy');
    const matches = findPotentialCombosForCard(card, hand, COMBOS);
    expect(matches).toHaveLength(0);
  });

  it('returns empty for a card without combo keys', () => {
    let hand = createInitialCourtHand();
    hand = addCardToHand(hand, buildHandCard('hand_forced_levy'), 1);
    const card = buildHandCard('hand_quiet_word'); // no combo keys
    const matches = findPotentialCombosForCard(card, hand, COMBOS);
    expect(matches).toHaveLength(0);
  });
});

describe('COMBOS registry integrity', () => {
  it('every requiredKey is produced by at least one hand card', () => {
    const handCardIds: HandCardId[] = [
      'hand_royal_pardon',
      'hand_reserve_forces',
      'hand_master_builder',
      'hand_spymasters_whisper',
      'hand_court_favor',
      'hand_quiet_word',
      'hand_old_debt_called_in',
      'hand_forced_levy',
      'hand_grain_reserve',
      'hand_tithe_forgiven',
      'hand_festival_proclaimed',
      'hand_disciplined_march',
      'hand_diplomatic_courier',
      'hand_merchant_guild_favor',
      'hand_bookkeepers_audit',
      'hand_patient_sovereign',
      'hand_scholars_insight',
      'hand_border_patrol',
      'hand_sanctioned_raid',
      'hand_royal_announcement',
    ];
    const producedKeys = new Set<string>();
    for (const id of handCardIds) {
      for (const key of buildHandCard(id).comboKeys ?? []) {
        producedKeys.add(key);
      }
    }
    for (const combo of COMBOS) {
      for (const key of combo.requiredKeys) {
        expect(producedKeys.has(key)).toBe(true);
      }
    }
  });

  it('COMBO_BY_ID indexes every entry', () => {
    for (const combo of COMBOS) {
      expect(COMBO_BY_ID[combo.id]).toBe(combo);
    }
  });

  it('every combo has at least one requiredKey and a positive windowTurns', () => {
    for (const combo of COMBOS) {
      expect(combo.requiredKeys.length).toBeGreaterThan(0);
      expect(combo.windowTurns).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('GameState initialization (Phase 6)', () => {
  it('all scenarios start with empty discoveredCombos and pendingComboKeysThisTurn', () => {
    const ids = ['new_crown', 'fractured_inheritance', 'merchants_gambit', 'frozen_march', 'faithful_kingdom'];
    for (const id of ids) {
      const state = createScenarioState(id);
      expect(state.discoveredCombos).toEqual([]);
      expect(state.pendingComboKeysThisTurn).toEqual([]);
    }
  });
});

describe('LOAD_SAVE combos migration (Phase 6)', () => {
  function makeLegacySave(): SaveFile {
    const fresh = createScenarioState();
    // Strip Phase-6 fields to emulate a pre-v5 save.
    const rest = { ...fresh } as Partial<GameState>;
    delete rest.discoveredCombos;
    delete rest.pendingComboKeysThisTurn;
    return {
      version: 4,
      scenarioId: fresh.scenarioId,
      savedAt: Date.now(),
      isMidTurn: false,
      gameState: rest as GameState,
      turnHistory: [],
      eventHistory: [],
      intelligenceReports: [],
    };
  }

  it('pre-v5 save loads with empty combo fields', () => {
    const save = makeLegacySave();
    const result = gameReducer(createInitialState(), { type: 'LOAD_SAVE', save });
    expect(result.gameState.discoveredCombos).toEqual([]);
    expect(result.gameState.pendingComboKeysThisTurn).toEqual([]);
  });
});
