// Phase 10 — Initiative authored content.
//
// Each InitiativeDefinition describes a multi-season directive. Authored
// entries live in index.ts; this file holds the shape.

import type {
  InitiativeCategory,
  InitiativeFailureCondition,
  MechanicalEffectDelta,
  NarrativePressure,
} from '../../engine/types';
import type { CardTag } from '../../engine/cards/types';

export interface InitiativeDefinition {
  id: string;
  title: string;
  description: string;
  category: InitiativeCategory;
  /** Typical turnsRequired is 12-24; used for display only — progress
   *  completes at progressValue >= 100, not at turnsActive >= turnsRequired. */
  turnsRequired: number;
  /** Cards whose tags overlap this list accrue progress when played, and
   *  the card distributor boosts their selection weight. */
  cardWeightingBoost: CardTag[];
  /** Per-turn narrative-pressure delta applied while this initiative is
   *  active. Merges additively into the existing pressure accumulator. */
  perTurnPressureDelta: Partial<NarrativePressure>;
  completionReward: MechanicalEffectDelta;
  unlocksKingdomFeature: string | null;
  abandonPenalty: MechanicalEffectDelta;
  failureConditions: InitiativeFailureCondition[];
  /** Defining-rarity payoff card title shown when the initiative completes. */
  payoffTitle: string;
  payoffBody: string;
  /** One-line display of the reward for opportunity/codex previews. */
  rewardSummary: string;
  /** One-line display of the abandon penalty. */
  penaltySummary: string;
}
