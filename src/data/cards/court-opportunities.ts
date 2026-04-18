// Phase 5 — Court Opportunity pool.
//
// Quiet months (no crisis, no petition, no negotiation, no assessment) surface
// a single Court Opportunity card. Each opportunity is a flavor frame pointing
// at a single hand card; accept adds the hand card to the Court Hand, decline
// is a no-op.

import type { HandCardId } from './hand-cards';

/** Court opportunities now discriminate between hand-card gifts and advisor
 *  candidate introductions. Phase 8 added the `advisor_candidate` variant;
 *  pre-Phase-8 opportunities are all `hand_card`. */
export type CourtOpportunityDefinition =
  | {
      kind: 'hand_card';
      id: string;
      title: string;
      body: string;
      handCardId: HandCardId;
      weight: number;
    }
  | {
      kind: 'advisor_candidate';
      id: string;
      title: string;
      body: string;
      /** References a template id from
       *  `src/data/advisors/candidates-wave-2/index.ts`. Concrete advisors are
       *  instantiated with a procgen name at accept time. */
      candidateTemplateId: string;
      weight: number;
    }
  | {
      /** Phase 9 — a "Set Posture" opportunity that resolves a stale region
       *  at build time and suggests a specific new posture. */
      kind: 'set_posture';
      id: string;
      /** Template title/body — `{region}` is substituted at build time. */
      title: string;
      body: string;
      weight: number;
    };

export const COURT_OPPORTUNITIES: CourtOpportunityDefinition[] = [
  {
    kind: 'hand_card',
    id: 'opp_visiting_knight',
    title: 'A Visiting Knight',
    body: 'A travelling retainer offers to drill the garrison for a week. Accept his aid?',
    handCardId: 'hand_reserve_forces',
    weight: 3,
  },
  {
    kind: 'hand_card',
    id: 'opp_stonemasons_guild',
    title: "Stonemasons' Offer",
    body: "The guild volunteers an older master to push the nearest project forward. Take him on?",
    handCardId: 'hand_master_builder',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_trade_courier',
    title: 'A Foreign Courier',
    body: 'A discreet envoy asks for an audience. A diplomatic gesture is on offer.',
    handCardId: 'hand_diplomatic_courier',
    weight: 3,
  },
  {
    kind: 'hand_card',
    id: 'opp_merchant_gift',
    title: 'Merchant Gift',
    body: 'The guild masters press a velvet purse into the chamberlain\'s hands.',
    handCardId: 'hand_merchant_guild_favor',
    weight: 3,
  },
  {
    kind: 'hand_card',
    id: 'opp_hermit_warning',
    title: 'A Hermit at the Gate',
    body: 'An old hermit warns of bandits in the passes. Post an extra patrol?',
    handCardId: 'hand_border_patrol',
    weight: 3,
  },
  {
    kind: 'hand_card',
    id: 'opp_full_granary',
    title: 'Overflowing Granary',
    body: 'Last season\'s surplus still sits in sealed bins. Open them?',
    handCardId: 'hand_grain_reserve',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_festival_proposal',
    title: 'Festival Proposal',
    body: 'A minor priest proposes a saint\'s day. Proclaim the feast?',
    handCardId: 'hand_festival_proclaimed',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_young_scholar',
    title: 'A Young Scholar',
    body: 'A travelling scholar seeks royal patronage. Her notes are remarkable.',
    handCardId: 'hand_scholars_insight',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_clerk_finds_ledger',
    title: 'A Missing Ledger',
    body: 'A chamber clerk quietly reports an audit opportunity.',
    handCardId: 'hand_bookkeepers_audit',
    weight: 3,
  },
  {
    kind: 'hand_card',
    id: 'opp_quiet_word',
    title: 'A Quiet Word',
    body: 'The chancellor suggests a whispered instruction to the bureaucracy.',
    handCardId: 'hand_quiet_word',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_old_ally_returns',
    title: 'An Old Ally Writes',
    body: 'A distant friend offers an overdue repayment — at a political cost.',
    handCardId: 'hand_old_debt_called_in',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_conscription_proposal',
    title: 'A General\'s Proposal',
    body: 'A general requests levy authority over the eastern villages.',
    handCardId: 'hand_forced_levy',
    weight: 1,
  },
  {
    kind: 'hand_card',
    id: 'opp_clergy_petition',
    title: 'A Quiet Petition',
    body: "The bishop's assistant asks — gently — for this quarter's tithe to be forgiven.",
    handCardId: 'hand_tithe_forgiven',
    weight: 2,
  },
  {
    kind: 'hand_card',
    id: 'opp_captain_plans_raid',
    title: "A Captain's Plan",
    body: 'A border captain outlines a swift raid into contested land. Sanction it?',
    handCardId: 'hand_sanctioned_raid',
    weight: 1,
  },
  {
    kind: 'hand_card',
    id: 'opp_heralds_proclamation',
    title: "The Herald's Draft",
    body: 'The royal herald drafts a carefully neutral proclamation. Keep it in reserve?',
    handCardId: 'hand_royal_announcement',
    weight: 2,
  },

  // ============================================================
  // Phase 8 — Advisor Candidate Introductions (12)
  // ============================================================
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chancellor_prudent',
    title: 'A Candidate for Chancellor',
    body: 'An exchequer graduate seeks a seat at the council table. Patient with ledgers and slow to spend.',
    candidateTemplateId: 'cand_chancellor_prudent_exchequer',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chancellor_reformist',
    title: 'A Reformist Clerk',
    body: 'A minor clerk has risen on the last reform commission. He offers his services.',
    candidateTemplateId: 'cand_chancellor_cunning_reformer',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chancellor_ironfist',
    title: 'A Hard-Eyed Collector',
    body: 'A tax commissioner with a reputation for making levies land offers his counsel.',
    candidateTemplateId: 'cand_chancellor_iron_collector',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_marshal_veteran',
    title: 'A Veteran Marshal',
    body: 'A veteran of three campaigns asks for a place at the council. Moves stiffly; sees clearly.',
    candidateTemplateId: 'cand_marshal_battle_hardened_veteran',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_marshal_silver_tongue',
    title: 'A Courtly Captain',
    body: 'A younger son of the great houses seeks the marshal\'s seat. Better at table than patrol.',
    candidateTemplateId: 'cand_marshal_silver_tongue_captain',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_marshal_ironfist',
    title: 'A Border Ranger',
    body: 'A border ranger, promoted after the last bandit-sweep, offers steel for the council.',
    candidateTemplateId: 'cand_marshal_ironfist_ranger',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chamberlain_courtier',
    title: 'A Practiced Courtier',
    body: 'A courtier everyone recognises — and no one fully trusts — offers to run the household.',
    candidateTemplateId: 'cand_chamberlain_silver_tongue_courtier',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chamberlain_steward',
    title: 'A Keeper of Keys',
    body: 'A steward of the royal household, keeper of many small keys, seeks the chamberlain\'s seat.',
    candidateTemplateId: 'cand_chamberlain_prudent_steward',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_chamberlain_secretary',
    title: 'A Low-Born Secretary',
    body: 'A secretary who won the court\'s ear by being right on small matters offers his services.',
    candidateTemplateId: 'cand_chamberlain_reformist_secretary',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_spymaster_agent',
    title: 'A Returning Agent',
    body: 'An agent returned from three foreign capitals under three different names offers his network.',
    candidateTemplateId: 'cand_spymaster_cunning_agent',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_spymaster_inquisitor',
    title: 'A Former Inquisitor',
    body: 'A former diocesan inquisitor with a long memory offers himself as spymaster.',
    candidateTemplateId: 'cand_spymaster_zealous_inquisitor',
    weight: 1,
  },
  {
    kind: 'advisor_candidate',
    id: 'opp_advisor_spymaster_cryptographer',
    title: 'A Cathedral Cryptographer',
    body: 'A cryptographer who reads three languages the court does not seeks the spymaster\'s seat.',
    candidateTemplateId: 'cand_spymaster_scholar_cryptographer',
    weight: 1,
  },
  // Phase 9 — weighted at 2 so postures surface on roughly 1 in N quiet months.
  {
    kind: 'set_posture',
    id: 'opp_set_posture',
    title: 'A Quiet Question of Governance',
    body: '{region} has been left to its own devices. Your stewards propose a firmer hand.',
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
