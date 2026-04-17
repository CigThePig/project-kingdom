// Phase 5 — Court Opportunity pool.
//
// Quiet months (no crisis, no petition, no negotiation, no assessment) surface
// a single Court Opportunity card. Each opportunity is a flavor frame pointing
// at a single hand card; accept adds the hand card to the Court Hand, decline
// is a no-op.

import type { HandCardId } from './hand-cards';

export interface CourtOpportunityDefinition {
  id: string;
  title: string;
  body: string;
  handCardId: HandCardId;
  weight: number;
}

export const COURT_OPPORTUNITIES: CourtOpportunityDefinition[] = [
  {
    id: 'opp_visiting_knight',
    title: 'A Visiting Knight',
    body: 'A travelling retainer offers to drill the garrison for a week. Accept his aid?',
    handCardId: 'hand_reserve_forces',
    weight: 3,
  },
  {
    id: 'opp_stonemasons_guild',
    title: "Stonemasons' Offer",
    body: "The guild volunteers an older master to push the nearest project forward. Take him on?",
    handCardId: 'hand_master_builder',
    weight: 2,
  },
  {
    id: 'opp_trade_courier',
    title: 'A Foreign Courier',
    body: 'A discreet envoy asks for an audience. A diplomatic gesture is on offer.',
    handCardId: 'hand_diplomatic_courier',
    weight: 3,
  },
  {
    id: 'opp_merchant_gift',
    title: 'Merchant Gift',
    body: 'The guild masters press a velvet purse into the chamberlain\'s hands.',
    handCardId: 'hand_merchant_guild_favor',
    weight: 3,
  },
  {
    id: 'opp_hermit_warning',
    title: 'A Hermit at the Gate',
    body: 'An old hermit warns of bandits in the passes. Post an extra patrol?',
    handCardId: 'hand_border_patrol',
    weight: 3,
  },
  {
    id: 'opp_full_granary',
    title: 'Overflowing Granary',
    body: 'Last season\'s surplus still sits in sealed bins. Open them?',
    handCardId: 'hand_grain_reserve',
    weight: 2,
  },
  {
    id: 'opp_festival_proposal',
    title: 'Festival Proposal',
    body: 'A minor priest proposes a saint\'s day. Proclaim the feast?',
    handCardId: 'hand_festival_proclaimed',
    weight: 2,
  },
  {
    id: 'opp_young_scholar',
    title: 'A Young Scholar',
    body: 'A travelling scholar seeks royal patronage. Her notes are remarkable.',
    handCardId: 'hand_scholars_insight',
    weight: 2,
  },
  {
    id: 'opp_clerk_finds_ledger',
    title: 'A Missing Ledger',
    body: 'A chamber clerk quietly reports an audit opportunity.',
    handCardId: 'hand_bookkeepers_audit',
    weight: 3,
  },
  {
    id: 'opp_quiet_word',
    title: 'A Quiet Word',
    body: 'The chancellor suggests a whispered instruction to the bureaucracy.',
    handCardId: 'hand_quiet_word',
    weight: 2,
  },
  {
    id: 'opp_old_ally_returns',
    title: 'An Old Ally Writes',
    body: 'A distant friend offers an overdue repayment — at a political cost.',
    handCardId: 'hand_old_debt_called_in',
    weight: 2,
  },
  {
    id: 'opp_conscription_proposal',
    title: 'A General\'s Proposal',
    body: 'A general requests levy authority over the eastern villages.',
    handCardId: 'hand_forced_levy',
    weight: 1,
  },
  {
    id: 'opp_clergy_petition',
    title: 'A Quiet Petition',
    body: "The bishop's assistant asks — gently — for this quarter's tithe to be forgiven.",
    handCardId: 'hand_tithe_forgiven',
    weight: 2,
  },
  {
    id: 'opp_captain_plans_raid',
    title: "A Captain's Plan",
    body: 'A border captain outlines a swift raid into contested land. Sanction it?',
    handCardId: 'hand_sanctioned_raid',
    weight: 1,
  },
  {
    id: 'opp_heralds_proclamation',
    title: "The Herald's Draft",
    body: 'The royal herald drafts a carefully neutral proclamation. Keep it in reserve?',
    handCardId: 'hand_royal_announcement',
    weight: 2,
  },
];

/** Pick an opportunity deterministically from `rng()` using weighted selection. */
export function pickCourtOpportunity(rng: () => number): CourtOpportunityDefinition {
  const total = COURT_OPPORTUNITIES.reduce((sum, o) => sum + o.weight, 0);
  let pick = rng() * total;
  for (const opp of COURT_OPPORTUNITIES) {
    pick -= opp.weight;
    if (pick <= 0) return opp;
  }
  return COURT_OPPORTUNITIES[0];
}
