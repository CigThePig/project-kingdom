// Phase 6 — Card Combos & Synergies
//
// A combo fires when the player plays a set of cards whose `comboKeys`
// collectively satisfy every `requiredKey` of a registered `CardCombo`,
// within the combo's rolling `windowTurns`. Bonuses are additive — never
// subtractive — so ignoring combos never penalizes the player.
//
// This file is types only. Registry content lives in
// `src/data/cards/combos.ts`; detection and application logic lives in
// `src/engine/systems/combo-engine.ts`.

import type { MechanicalEffectDelta, StyleAxis } from '../types';

/** A combo recipe. Registered entries are iterated each turn by the combo
 *  engine. */
export interface CardCombo {
  /** Stable internal identifier; persisted in `GameState.discoveredCombos`. */
  id: string;
  /** Short display name ("Iron Dawn"). */
  name: string;
  /** One-line narrative shown in turn summary and codex. */
  description: string;
  /** Combo fires only when every key in this list has been played within
   *  `windowTurns`. Keys are matched against `Card.comboKeys` entries. */
  requiredKeys: string[];
  /** 1 = same-turn combo. N = satisfied within any rolling window of N
   *  consecutive turns (current turn + N-1 previous). */
  windowTurns: number;
  /** Bonus state delta applied on proc, on top of normal card resolution. */
  bonusEffect: MechanicalEffectDelta;
  /** Optional ruling-style axis nudge applied on proc. */
  styleAxisDelta?: Partial<Record<StyleAxis, number>>;
  /** Optional kingdom-feature tag to install on proc (appended to
   *  `GameState.activeKingdomFeatures`). */
  unlocksKingdomFeature?: string;
}

/** Records that a combo fired during turn resolution. Surfaced on
 *  `TurnResolutionResult.triggeredCombos` for the summary screen. */
export interface ComboProc {
  comboId: string;
  name: string;
  description: string;
  firedOnTurn: number;
  /** True if this is the first time this combo has fired in the current
   *  save. Drives the "Newly discovered" ribbon. */
  isFirstDiscovery: boolean;
}
