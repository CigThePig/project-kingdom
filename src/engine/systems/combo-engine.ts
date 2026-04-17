// Phase 6 — Combo detection and application.
//
// Pure functions only. No React, no I/O. Consumed from the turn-resolution
// pipeline after actions have been applied but before the history entry and
// causal ledger are finalized.
//
// Windowing: `windowTurns: 1` means the combo is satisfied only by cards
// played during the current turn. `windowTurns: N` means cards played in the
// current turn OR the previous N-1 turns may contribute keys. A combo only
// fires when at least one required key was played on the current turn — this
// prevents cross-turn combos from re-firing each subsequent turn without
// fresh input.

import type { Card } from '../cards/types';
import type { CardCombo, ComboProc } from '../cards/combos';
import type {
  CourtHand,
  GameState,
  QueuedAction,
  TurnHistoryEntry,
} from '../types';
import { applyMechanicalEffectDelta } from '../events/apply-event-effects';

// ============================================================
// Collection
// ============================================================

/** Flatten every combo key from the cards that produced the given actions.
 *  De-duplicates. Unknown action IDs are skipped silently. */
export function collectPlayedComboKeys(
  actions: readonly QueuedAction[],
  cardsByActionId: ReadonlyMap<string, Card>,
): string[] {
  const set = new Set<string>();
  for (const action of actions) {
    const card = cardsByActionId.get(action.id);
    if (!card) continue;
    for (const key of card.comboKeys ?? []) {
      set.add(key);
    }
  }
  return [...set];
}

// ============================================================
// Detection
// ============================================================

export interface DetectCombosOptions {
  /** Combo keys played on the current turn (before it is appended to history). */
  currentKeys: readonly string[];
  /** Past turn history, oldest first. Each entry's optional `playedComboKeys`
   *  contributes to cross-turn windows. */
  history: readonly TurnHistoryEntry[];
  /** The turn number being resolved. */
  currentTurn: number;
  /** Combo definitions to evaluate. */
  registry: readonly CardCombo[];
  /** Combo IDs already discovered in this save; controls `isFirstDiscovery`. */
  alreadyDiscovered: readonly string[];
}

/** Scan the registry and return a ComboProc for each combo whose
 *  `requiredKeys` are satisfied by the window. */
export function detectCombosForTurn(opts: DetectCombosOptions): ComboProc[] {
  const discovered = new Set(opts.alreadyDiscovered);
  const currentSet = new Set(opts.currentKeys);
  const procs: ComboProc[] = [];

  for (const combo of opts.registry) {
    const window = Math.max(1, combo.windowTurns);
    const earliest = opts.currentTurn - window + 1;

    // Aggregate keys across the window from history + current.
    const available = new Set<string>(currentSet);
    for (const entry of opts.history) {
      if (entry.turnNumber < earliest) continue;
      if (entry.turnNumber > opts.currentTurn) continue;
      for (const key of entry.playedComboKeys ?? []) {
        available.add(key);
      }
    }

    // Every requiredKey must be present...
    const allPresent = combo.requiredKeys.every((k) => available.has(k));
    if (!allPresent) continue;

    // ...and at least one must come from this turn, so cross-turn combos
    // don't re-fire without fresh input.
    const freshContribution = combo.requiredKeys.some((k) => currentSet.has(k));
    if (!freshContribution) continue;

    procs.push({
      comboId: combo.id,
      name: combo.name,
      description: combo.description,
      firedOnTurn: opts.currentTurn,
      isFirstDiscovery: !discovered.has(combo.id),
    });
  }

  return procs;
}

// ============================================================
// Application
// ============================================================

/** Apply a combo's bonus effect, ruling-style nudge, and optional kingdom
 *  feature unlock to the state. Returns a new state; input is untouched. */
export function applyComboBonus(
  state: GameState,
  combo: CardCombo,
  currentTurn: number,
): GameState {
  let s = applyMechanicalEffectDelta(state, combo.bonusEffect, null);

  if (combo.styleAxisDelta) {
    const axes = { ...s.rulingStyle.axes };
    for (const [axis, delta] of Object.entries(combo.styleAxisDelta)) {
      if (delta === undefined) continue;
      const key = axis as keyof typeof axes;
      axes[key] = Math.max(-50, Math.min(50, axes[key] + delta));
    }
    s = { ...s, rulingStyle: { ...s.rulingStyle, axes } };
  }

  if (combo.unlocksKingdomFeature) {
    const alreadyUnlocked = s.activeKingdomFeatures.some(
      (f) => f.sourceTag === combo.unlocksKingdomFeature,
    );
    if (!alreadyUnlocked) {
      s = {
        ...s,
        activeKingdomFeatures: [
          ...s.activeKingdomFeatures,
          {
            id: `feature_${combo.id}_${currentTurn}`,
            sourceTag: combo.unlocksKingdomFeature,
            turnEstablished: currentTurn,
            ongoingEffect: {},
            category: 'cultural',
          },
        ],
      };
    }
  }

  return s;
}

// ============================================================
// UI helper
// ============================================================

/** Return every combo whose `requiredKeys` can be completed by pairing
 *  the given card with one or more other cards currently in hand. Used by
 *  `CourtHandPanel` to render "Combos with…" hints. */
export function findPotentialCombosForCard(
  card: Card,
  hand: CourtHand,
  registry: readonly CardCombo[],
): CardCombo[] {
  const cardKeys = new Set(card.comboKeys ?? []);
  if (cardKeys.size === 0) return [];

  const handKeysByCardId = new Map<string, Set<string>>();
  for (const slot of hand.slots) {
    if (slot.card.id === card.id) continue;
    handKeysByCardId.set(slot.card.id, new Set(slot.card.comboKeys ?? []));
  }

  const matches: CardCombo[] = [];
  for (const combo of registry) {
    // The card must contribute at least one required key.
    const contribution = combo.requiredKeys.filter((k) => cardKeys.has(k));
    if (contribution.length === 0) continue;

    const stillNeeded = combo.requiredKeys.filter((k) => !cardKeys.has(k));

    // Every remaining key must be covered by some OTHER card in hand.
    const satisfiable = stillNeeded.every((k) => {
      for (const keys of handKeysByCardId.values()) {
        if (keys.has(k)) return true;
      }
      return false;
    });

    if (satisfiable) matches.push(combo);
  }

  return matches;
}
