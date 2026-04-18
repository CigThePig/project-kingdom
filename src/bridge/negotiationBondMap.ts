// Phase 13 — shared mapping from existing negotiation-term IDs onto bond kinds
// and counterable value specs. Single source of truth consumed by both the
// negotiation card generator (to decorate terms for the UI) and the direct
// effect applier (to actually create bonds on accept).

import type { BondKind } from '../engine/types';
import type { NegotiationCounterableValue } from '../ui/types';

/** Term IDs that produce a Bond on accept. Terms not listed here are purely
 *  numeric deltas (reparations, territorial concessions, internal reforms). */
export const TERM_ID_TO_BOND_KIND: Record<string, BondKind> = {
  // neg_trade_deal
  exclusive_market_access: 'trade_league',
  bulk_pricing_agreement: 'trade_league',
  port_rights_concession: 'trade_league',
  // neg_treaty_terms
  mutual_defense_clause: 'mutual_defense',
  trade_corridor_rights: 'trade_league',
  border_access_agreement: 'cultural_exchange',
  // neg_peace_terms
  prisoner_exchange: 'hostage_exchange',
  trade_normalization: 'trade_league',
  // neg_alliance_pact
  military_commitment: 'mutual_defense',
  shared_intelligence: 'cultural_exchange',
  trade_exclusivity: 'trade_league',
  // neg_resource_blockade
  payment_tribute: 'vassalage',
  trade_concessions: 'trade_league',
  hostage_exchange: 'hostage_exchange',
  // neg_marriage_alliance
  royal_dowry: 'royal_marriage',
  faith_concessions: 'religious_accord',
};

/** Numeric terms the player can counter-propose. Baselines match the implicit
 *  value encoded in NEGOTIATION_EFFECTS; step/min/max define the haggle range. */
export const TERM_ID_TO_COUNTERABLE: Record<string, NegotiationCounterableValue> = {
  payment_tribute: { field: 'tribute', baseline: 25, min: 5, max: 50, step: 5, playerFavors: 'lower' },
  war_reparations: { field: 'tribute', baseline: 40, min: 10, max: 80, step: 10, playerFavors: 'lower' },
  royal_dowry: { field: 'dowry', baseline: 30, min: 10, max: 60, step: 5, playerFavors: 'lower' },
};
