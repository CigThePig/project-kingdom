// gameplay-blueprint.md §4.1, §5.6 — Trade
// Pure engine logic for trade income calculation.
// No React imports. No player-facing text.

import { TradeOpenness } from '../types';
import {
  TRADE_BASE_INCOME,
  TRADE_DIPLOMATIC_BONUS_PER_FRIENDLY_NEIGHBOR,
  TRADE_INCOME_MULTIPLIER,
  TRADE_MERCHANT_COMMERCE_MULTIPLIER_MAX,
  TRADE_MERCHANT_COMMERCE_MULTIPLIER_MIN,
} from '../constants';

// ============================================================
// Internal Helpers
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(t: number, min: number, max: number): number {
  return min + t * (max - min);
}

// Relationship score threshold above which a neighbor counts as "friendly" for trade bonuses.
const FRIENDLY_NEIGHBOR_THRESHOLD = 70;

// ============================================================
// Exported Calculators
// ============================================================

/**
 * Returns the trade openness policy multiplier.
 * (Convenience wrapper around the TRADE_INCOME_MULTIPLIER constant.)
 */
export function getTradeOpennessMultiplier(openness: TradeOpenness): number {
  return TRADE_INCOME_MULTIPLIER[openness];
}

/**
 * Returns the merchant commerce multiplier based on merchant class satisfaction.
 * At satisfaction 0 → MULTIPLIER_MIN; at 100 → MULTIPLIER_MAX (§4.4).
 * High merchant satisfaction attracts foreign traders and improves commerce taxes.
 */
export function calculateMerchantCommerceMultiplier(merchantSatisfaction: number): number {
  const t = clamp(merchantSatisfaction / 100, 0, 1);
  return lerp(t, TRADE_MERCHANT_COMMERCE_MULTIPLIER_MIN, TRADE_MERCHANT_COMMERCE_MULTIPLIER_MAX);
}

/**
 * Returns the additive diplomatic trade bonus from neighboring kingdoms.
 * Each neighbor with a relationship score above FRIENDLY_NEIGHBOR_THRESHOLD contributes
 * TRADE_DIPLOMATIC_BONUS_PER_FRIENDLY_NEIGHBOR gold/turn (§4.9).
 *
 * neighborRelationshipScores: Record<neighborId, score 0–100>
 */
export function calculateDiplomaticTradeBonus(
  neighborRelationshipScores: Record<string, number>,
): number {
  const friendlyCount = Object.values(neighborRelationshipScores).filter(
    (score) => score > FRIENDLY_NEIGHBOR_THRESHOLD,
  ).length;
  return friendlyCount * TRADE_DIPLOMATIC_BONUS_PER_FRIENDLY_NEIGHBOR;
}

/**
 * Calculates total trade income for the turn.
 *
 * Formula:
 *   tradeIncome = (BASE_INCOME × tradeOpenessMultiplier × merchantCommerceMultiplier
 *                  × regionalTradeModifier × (1 + tradeKnowledgeBonus))
 *                 + diplomaticTradeBonus
 *
 * - Base income is scaled by policy openness (§5.3).
 * - Merchant satisfaction amplifies or reduces commerce.
 * - Regional trade output from trade-oriented regions adds a structural bonus.
 * - Trade knowledge advancements improve income efficiency (§4.13).
 * - Diplomatic relationships add a flat bonus per friendly neighbor.
 *
 * neighborRelationshipScores: Record<neighborId, score 0–100>
 * tradeKnowledgeBonus: pre-computed by caller from KnowledgeState (0.0–0.4 range)
 * regionalTradeModifier: pre-computed by regions.ts (1.0 = neutral)
 */
export function calculateTradeIncome(
  merchantSatisfaction: number,
  tradeOpenness: TradeOpenness,
  neighborRelationshipScores: Record<string, number>,
  regionalTradeModifier: number,
  tradeKnowledgeBonus: number,
): number {
  const opennessMultiplier = TRADE_INCOME_MULTIPLIER[tradeOpenness];
  const merchantMultiplier = calculateMerchantCommerceMultiplier(merchantSatisfaction);
  const diplomaticBonus = calculateDiplomaticTradeBonus(neighborRelationshipScores);

  const baseTradeIncome =
    TRADE_BASE_INCOME *
    opennessMultiplier *
    merchantMultiplier *
    regionalTradeModifier *
    (1 + tradeKnowledgeBonus);

  return clamp(baseTradeIncome + diplomaticBonus, 0, Infinity);
}
