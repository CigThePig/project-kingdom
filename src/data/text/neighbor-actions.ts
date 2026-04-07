// Phase 6.6 — Neighbor Action Card Player-Facing Text
// Maps NeighborActionType to title template, body template, and choice labels.
// Title and body use {neighbor} as a placeholder replaced at card generation time.

import { NeighborActionType } from '../../engine/types';

export interface NeighborActionTextEntry {
  title: string;
  body: string;
  choices: Record<string, string>;
}

export const NEIGHBOR_ACTION_TEXT: Record<NeighborActionType, NeighborActionTextEntry> = {
  // ============================================================
  // Crisis-tier
  // ============================================================
  [NeighborActionType.WarDeclaration]: {
    title: '{neighbor} Declares War',
    body: '{neighbor} has formally declared war upon the realm. Their armies gather at the border, their ambassadors have departed, and the time for diplomacy may have passed. The kingdom must decide how to meet this existential threat.',
    choices: {
      mobilize_for_war: 'Mobilize for War',
      seek_emergency_diplomacy: 'Seek Emergency Diplomacy',
      defensive_posture: 'Adopt Defensive Posture',
    },
  },
  [NeighborActionType.Demand]: {
    title: '{neighbor} Issues Demands',
    body: '{neighbor} has delivered a formal demand backed by the implicit threat of force. The demands are steep — tribute, territorial concessions, or policy changes that would diminish the crown\'s sovereignty. Refusal risks escalation.',
    choices: {
      comply_with_demand: 'Comply with the Demand',
      negotiate_terms: 'Negotiate Better Terms',
      reject_demand: 'Reject the Demand',
    },
  },
  [NeighborActionType.MilitaryBuildup]: {
    title: '{neighbor} Military Buildup Detected',
    body: 'Intelligence reports confirm that {neighbor} is significantly expanding its military forces. New fortifications, increased recruitment, and weapons production all point to preparations for conflict — though the target of this buildup remains unclear.',
    choices: {
      match_buildup: 'Match Their Buildup',
      diplomatic_inquiry: 'Send Diplomatic Inquiry',
      monitor_situation: 'Monitor the Situation',
    },
  },
  [NeighborActionType.EspionageRetaliation]: {
    title: '{neighbor} Retaliates for Espionage',
    body: '{neighbor} has discovered evidence of our intelligence operations within their borders. Their response is swift and hostile — agents expelled, diplomatic protests filed, and threats of further retaliation. The intelligence network in their territory is compromised.',
    choices: {
      deny_involvement: 'Deny All Involvement',
      offer_compensation: 'Offer Diplomatic Compensation',
      escalate_operations: 'Escalate Operations',
    },
  },

  // ============================================================
  // Petition-tier
  // ============================================================
  [NeighborActionType.TradeProposal]: {
    title: '{neighbor} Proposes Trade Agreement',
    body: '{neighbor} has sent envoys proposing a formal trade agreement. The terms would open markets in both kingdoms, potentially benefiting merchants and the treasury. The proposal appears genuine, though accepting may create economic dependency.',
    choices: {
      accept_trade_proposal: 'Accept the Proposal',
      decline_trade_proposal: 'Decline the Proposal',
    },
  },
  [NeighborActionType.TradeWithdrawal]: {
    title: '{neighbor} Withdraws from Trade',
    body: '{neighbor} has formally withdrawn from existing trade arrangements, citing deteriorating relations. Merchant caravans are turned away at the border, and established trade routes grow quiet. The economic impact will be felt across the kingdom.',
    choices: {
      seek_reconciliation: 'Seek Reconciliation',
      accept_withdrawal: 'Accept the Withdrawal',
    },
  },
  [NeighborActionType.TreatyProposal]: {
    title: '{neighbor} Proposes Formal Treaty',
    body: '{neighbor} has dispatched senior diplomats bearing a formal treaty of cooperation and mutual respect. The agreement would strengthen ties between the kingdoms and provide a framework for peaceful resolution of future disputes.',
    choices: {
      accept_treaty: 'Accept the Treaty',
      decline_treaty: 'Decline the Treaty',
    },
  },
  [NeighborActionType.PeaceOffer]: {
    title: '{neighbor} Extends Peace Offer',
    body: 'War-weary and seeking an end to hostilities, {neighbor} has extended a formal offer of peace. The terms are fair — a return to pre-conflict borders and restoration of diplomatic relations. The military urges caution, but the people long for peace.',
    choices: {
      accept_peace: 'Accept the Peace',
      reject_peace: 'Reject and Continue Fighting',
    },
  },
  [NeighborActionType.BorderTension]: {
    title: 'Border Tension with {neighbor}',
    body: 'Increased military activity along the border with {neighbor} has raised tensions. Patrol clashes, disputed boundary markers, and provocative troop movements suggest a deliberate campaign of intimidation — or perhaps preparation for something worse.',
    choices: {
      reinforce_border: 'Reinforce the Border',
      ignore_provocation: 'Ignore the Provocation',
    },
  },
  [NeighborActionType.ReligiousPressure]: {
    title: '{neighbor} Exerts Religious Pressure',
    body: '{neighbor} is actively spreading foreign religious doctrine within the realm\'s borders. Missionaries, pamphlets, and funded gatherings are drawing converts, particularly among the discontented. The clergy demands a response, while some see an opportunity for cultural exchange.',
    choices: {
      counter_religious_influence: 'Counter Their Influence',
      tolerate_foreign_doctrine: 'Tolerate the Doctrine',
    },
  },
};
