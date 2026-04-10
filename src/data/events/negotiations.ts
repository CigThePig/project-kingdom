// Workstream A — Task A4: Negotiation Card Definitions
// 8 negotiation events with toggleable terms. Each term has real costs;
// accepting all terms is never obviously optimal.

import {
  EventCategory,
  EventSeverity,
} from '../../engine/types';
import type { EventTriggerCondition } from '../../engine/events/event-engine';

export interface NegotiationTermDefinition {
  termId: string;
  slotCost: 0;
  isFree: true;
}

export interface NegotiationDefinition {
  id: string;
  context: 'internal' | 'external';
  severity: EventSeverity;
  category: EventCategory;
  triggerConditions: EventTriggerCondition[];
  weight: number;
  terms: NegotiationTermDefinition[];
  rejectChoiceId: string;
}

export const NEGOTIATION_POOL: NegotiationDefinition[] = [
  // ============================================================
  // External Negotiations (4)
  // ============================================================
  {
    id: 'neg_trade_deal',
    context: 'external',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 4 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.0,
    terms: [
      { termId: 'exclusive_market_access', slotCost: 0, isFree: true },
      { termId: 'bulk_pricing_agreement', slotCost: 0, isFree: true },
      { termId: 'port_rights_concession', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_trade_deal',
  },
  {
    id: 'neg_treaty_terms',
    context: 'external',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 1.0,
    terms: [
      { termId: 'mutual_defense_clause', slotCost: 0, isFree: true },
      { termId: 'trade_corridor_rights', slotCost: 0, isFree: true },
      { termId: 'border_access_agreement', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_treaty_terms',
  },
  {
    id: 'neg_peace_terms',
    context: 'external',
    severity: EventSeverity.Serious,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'stability_below', threshold: 40 },
      { type: 'turn_range', minTurn: 8 },
    ],
    weight: 1.2,
    terms: [
      { termId: 'war_reparations', slotCost: 0, isFree: true },
      { termId: 'prisoner_exchange', slotCost: 0, isFree: true },
      { termId: 'territorial_concession', slotCost: 0, isFree: true },
      { termId: 'trade_normalization', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_peace_terms',
  },
  {
    id: 'neg_alliance_pact',
    context: 'external',
    severity: EventSeverity.Notable,
    category: EventCategory.Diplomacy,
    triggerConditions: [
      { type: 'stability_above', threshold: 50 },
      { type: 'turn_range', minTurn: 6 },
      { type: 'random_chance', probability: 0.2 },
    ],
    weight: 0.9,
    terms: [
      { termId: 'military_commitment', slotCost: 0, isFree: true },
      { termId: 'shared_intelligence', slotCost: 0, isFree: true },
      { termId: 'trade_exclusivity', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_alliance_pact',
  },

  // ============================================================
  // Internal Negotiations (4)
  // ============================================================
  {
    id: 'neg_noble_power_share',
    context: 'internal',
    severity: EventSeverity.Serious,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: 'Nobility' as any, threshold: 35 },
    ],
    weight: 1.1,
    terms: [
      { termId: 'council_seats', slotCost: 0, isFree: true },
      { termId: 'tax_authority', slotCost: 0, isFree: true },
      { termId: 'judicial_power', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_noble_demands',
  },
  {
    id: 'neg_merchant_guild_charter',
    context: 'internal',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: 'Merchants' as any, threshold: 50 },
      { type: 'turn_range', minTurn: 5 },
    ],
    weight: 1.0,
    terms: [
      { termId: 'monopoly_rights', slotCost: 0, isFree: true },
      { termId: 'tax_reduction', slotCost: 0, isFree: true },
      { termId: 'port_access', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_guild_charter',
  },
  {
    id: 'neg_clergy_concordat',
    context: 'internal',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_above', threshold: 50 },
      { type: 'class_satisfaction_below', classTarget: 'Clergy' as any, threshold: 45 },
    ],
    weight: 1.0,
    terms: [
      { termId: 'education_authority', slotCost: 0, isFree: true },
      { termId: 'tithe_enforcement', slotCost: 0, isFree: true },
      { termId: 'heresy_courts', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_concordat',
  },
  {
    id: 'neg_military_reform',
    context: 'internal',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [
      { type: 'military_readiness_below', threshold: 45 },
    ],
    weight: 1.0,
    terms: [
      { termId: 'merit_promotion', slotCost: 0, isFree: true },
      { termId: 'veteran_benefits', slotCost: 0, isFree: true },
      { termId: 'equipment_budget', slotCost: 0, isFree: true },
    ],
    rejectChoiceId: 'reject_military_reform',
  },
];
