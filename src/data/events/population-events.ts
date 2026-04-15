// Population Event Definitions — surfaced by the population dynamics system (Phase 4b).
// These events use triggerConditions: [{ type: 'always' }] because they are
// injected directly by the population system, not surfaced by surfaceEvents().

import type { EventDefinition } from '../../engine/events/event-engine';
import { EventCategory, EventSeverity } from '../../engine/types';

export const POPULATION_EVENT_POOL: EventDefinition[] = [
  // ============================================================
  // Migration Events
  // ============================================================
  {
    id: 'evt_pop_migration_inflow',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'welcome_settlers', slotCost: 1, isFree: false },
      { choiceId: 'direct_to_frontier', slotCost: 1, isFree: false },
      { choiceId: 'let_them_settle', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_migration_petition',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'reduce_taxes_briefly', slotCost: 1, isFree: false },
      { choiceId: 'improve_conditions', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_concerns', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_migration_crisis',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'seal_borders', slotCost: 1, isFree: false },
      { choiceId: 'emergency_relief', slotCost: 2, isFree: false },
      { choiceId: 'let_them_leave', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Overcrowding Events
  // ============================================================
  {
    id: 'evt_pop_overcrowding_petition',
    severity: EventSeverity.Notable,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_housing', slotCost: 1, isFree: false },
      { choiceId: 'resettle_frontier', slotCost: 1, isFree: false },
      { choiceId: 'ignore_crowding', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_overcrowding_crisis',
    severity: EventSeverity.Serious,
    category: EventCategory.PublicOrder,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'emergency_construction', slotCost: 2, isFree: false },
      { choiceId: 'forced_relocation', slotCost: 1, isFree: false },
      { choiceId: 'endure_squalor', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Class Mobility Events
  // ============================================================
  {
    id: 'evt_pop_merchant_titles',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_titles', slotCost: 1, isFree: false },
      { choiceId: 'deny_titles', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_conscription_harvest',
    severity: EventSeverity.Notable,
    category: EventCategory.Military,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'proceed_conscription', slotCost: 1, isFree: false },
      { choiceId: 'delay_conscription', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_clergy_exodus',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'offer_clergy_stipends', slotCost: 1, isFree: false },
      { choiceId: 'let_clergy_depart', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },

  // ============================================================
  // Demographic Events
  // ============================================================
  {
    id: 'evt_pop_boom',
    severity: EventSeverity.Informational,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'invest_in_growth', slotCost: 1, isFree: false },
      { choiceId: 'celebrate_prosperity', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
  {
    id: 'evt_pop_decline',
    severity: EventSeverity.Serious,
    category: EventCategory.Economy,
    triggerConditions: [{ type: 'always' }],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'encourage_families', slotCost: 1, isFree: false },
      { choiceId: 'attract_immigrants', slotCost: 1, isFree: false },
      { choiceId: 'accept_decline', slotCost: 0, isFree: true },
    ],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
    repeatable: true,
  },
];
