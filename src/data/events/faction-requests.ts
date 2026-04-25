// Phase 6.5 — Faction Request Petition Templates
// 15 templates: 3 per population class × 5 classes.
// These function as petition cards generated when class satisfaction
// crosses specific thresholds.

import type { EventDefinition } from '../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
} from '../../engine/types';

export const FACTION_REQUEST_POOL: EventDefinition[] = [
  // ============================================================
  // Nobility (3)
  // ============================================================
  {
    id: 'faction_req_nobility_tax_exemption',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_tax_exemption', slotCost: 0, isFree: true },
      { choiceId: 'deny_tax_exemption', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_nobility_court_privileges',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_court_privileges', slotCost: 0, isFree: true },
      { choiceId: 'deny_court_privileges', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_nobility_academy',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Nobility, threshold: 70 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_noble_academy', slotCost: 0, isFree: true },
      { choiceId: 'decline_academy_proposal', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Nobility,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // Clergy (3)
  // ============================================================
  {
    id: 'faction_req_clergy_heresy_crackdown',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 30 },
      { type: 'heterodoxy_above', threshold: 20 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'authorize_crackdown', slotCost: 0, isFree: true },
      { choiceId: 'refuse_crackdown', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_clergy_temple_funding',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_temple_funding', slotCost: 0, isFree: true },
      { choiceId: 'deny_temple_funding', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_clergy_religious_festival',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 70 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'sponsor_religious_festival', slotCost: 0, isFree: true },
      { choiceId: 'decline_festival_request', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // Merchants (3)
  // ============================================================
  {
    id: 'faction_req_merchant_trade_protections',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_trade_protections', slotCost: 0, isFree: true },
      { choiceId: 'deny_trade_protections', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_merchant_market_expansion',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Merchants, threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_market_expansion', slotCost: 0, isFree: true },
      { choiceId: 'deny_market_expansion', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_merchant_foreign_mission',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 70 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_foreign_mission', slotCost: 0, isFree: true },
      { choiceId: 'decline_foreign_mission', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Merchants,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // Commoners (3)
  // ============================================================
  {
    id: 'faction_req_commoner_food_relief',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'distribute_food_relief', slotCost: 0, isFree: true },
      { choiceId: 'deny_food_relief', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_commoner_labor_reforms',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Commoners, threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'enact_labor_reforms', slotCost: 0, isFree: true },
      { choiceId: 'reject_labor_reforms', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_commoner_public_works',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Commoners, threshold: 70 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_public_works', slotCost: 0, isFree: true },
      { choiceId: 'decline_public_works', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // ============================================================
  // Military Caste (3)
  // ============================================================
  {
    id: 'faction_req_military_equipment_pay',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 30 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'increase_military_pay', slotCost: 0, isFree: true },
      { choiceId: 'deny_pay_increase', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_military_training_grounds',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_below', classTarget: PopulationClass.MilitaryCaste, threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.MilitaryCaste, threshold: 30 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'build_training_grounds', slotCost: 0, isFree: true },
      { choiceId: 'deny_training_grounds', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
  {
    id: 'faction_req_military_border_fortification',
    severity: EventSeverity.Notable,
    category: EventCategory.ClassConflict,
    triggerConditions: [
      { type: 'class_satisfaction_above', classTarget: PopulationClass.MilitaryCaste, threshold: 70 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'approve_border_fortification', slotCost: 0, isFree: true },
      { choiceId: 'decline_border_fortification', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.MilitaryCaste,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },
];
