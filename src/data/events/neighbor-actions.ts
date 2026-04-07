// Phase 6.6 — Neighbor Action Card Template Definitions
// Maps each NeighborActionType to a card template with severity, choices, and category.
// These are NOT EventDefinitions — they are card templates consumed by the bridge
// layer to translate NeighborAction engine objects into card data.

import {
  EventCategory,
  EventSeverity,
  NeighborActionType,
} from '../../engine/types';

export interface NeighborActionCardTemplate {
  actionType: NeighborActionType;
  severity: EventSeverity;
  category: EventCategory;
  choices: { choiceId: string; slotCost: number; isFree: boolean }[];
}

export const NEIGHBOR_ACTION_TEMPLATES: Record<NeighborActionType, NeighborActionCardTemplate> = {
  // ============================================================
  // Crisis-tier (Critical/Serious)
  // ============================================================
  [NeighborActionType.WarDeclaration]: {
    actionType: NeighborActionType.WarDeclaration,
    severity: EventSeverity.Critical,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'mobilize_for_war', slotCost: 1, isFree: false },
      { choiceId: 'seek_emergency_diplomacy', slotCost: 1, isFree: false },
      { choiceId: 'defensive_posture', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.Demand]: {
    actionType: NeighborActionType.Demand,
    severity: EventSeverity.Serious,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'comply_with_demand', slotCost: 0, isFree: true },
      { choiceId: 'negotiate_terms', slotCost: 1, isFree: false },
      { choiceId: 'reject_demand', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.MilitaryBuildup]: {
    actionType: NeighborActionType.MilitaryBuildup,
    severity: EventSeverity.Serious,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'match_buildup', slotCost: 1, isFree: false },
      { choiceId: 'diplomatic_inquiry', slotCost: 1, isFree: false },
      { choiceId: 'monitor_situation', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.EspionageRetaliation]: {
    actionType: NeighborActionType.EspionageRetaliation,
    severity: EventSeverity.Serious,
    category: EventCategory.Espionage,
    choices: [
      { choiceId: 'deny_involvement', slotCost: 0, isFree: true },
      { choiceId: 'offer_compensation', slotCost: 1, isFree: false },
      { choiceId: 'escalate_operations', slotCost: 1, isFree: false },
    ],
  },

  // ============================================================
  // Petition-tier (Notable)
  // ============================================================
  [NeighborActionType.TradeProposal]: {
    actionType: NeighborActionType.TradeProposal,
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'accept_trade_proposal', slotCost: 0, isFree: true },
      { choiceId: 'decline_trade_proposal', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.TradeWithdrawal]: {
    actionType: NeighborActionType.TradeWithdrawal,
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'seek_reconciliation', slotCost: 0, isFree: true },
      { choiceId: 'accept_withdrawal', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.TreatyProposal]: {
    actionType: NeighborActionType.TreatyProposal,
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'accept_treaty', slotCost: 0, isFree: true },
      { choiceId: 'decline_treaty', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.PeaceOffer]: {
    actionType: NeighborActionType.PeaceOffer,
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'accept_peace', slotCost: 0, isFree: true },
      { choiceId: 'reject_peace', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.BorderTension]: {
    actionType: NeighborActionType.BorderTension,
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    choices: [
      { choiceId: 'reinforce_border', slotCost: 0, isFree: true },
      { choiceId: 'ignore_provocation', slotCost: 0, isFree: true },
    ],
  },
  [NeighborActionType.ReligiousPressure]: {
    actionType: NeighborActionType.ReligiousPressure,
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    choices: [
      { choiceId: 'counter_religious_influence', slotCost: 0, isFree: true },
      { choiceId: 'tolerate_foreign_doctrine', slotCost: 0, isFree: true },
    ],
  },
};
