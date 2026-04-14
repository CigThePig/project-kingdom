import type { EventDefinition } from '../../../engine/events/event-engine';
import {
  EventCategory,
  EventSeverity,
  PopulationClass,
  Season,
} from '../../../engine/types';

export const EXPANSION_RELIGION_EVENTS: EventDefinition[] = [
  // --- 1. Miracle Claims (opening) ---
  {
    id: 'evt_exp_rel_miracle_claims',
    severity: EventSeverity.Informational,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_above', threshold: 55 },
      { type: 'turn_range', minTurn: 1, maxTurn: 3 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'endorse_miracle', slotCost: 1, isFree: false },
      { choiceId: 'order_investigation', slotCost: 1, isFree: false },
      { choiceId: 'remain_silent', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
    followUpEvents: [
      { triggerChoiceId: 'endorse_miracle', followUpDefinitionId: 'evt_exp_fu_rel_pilgrimage_boom', delayTurns: 3, probability: 0.6 },
    ],
  },

  // --- 2. Heretical Texts Discovered (opening) ---
  {
    id: 'evt_exp_rel_heretical_texts',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 25 },
      { type: 'turn_range', minTurn: 2, maxTurn: 4 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'public_burning', slotCost: 1, isFree: false },
      { choiceId: 'scholarly_review', slotCost: 1, isFree: false },
      { choiceId: 'suppress_quietly', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'opening',
  },

  // --- 3. Religious Order Expansion (developing) ---
  {
    id: 'evt_exp_rel_order_expansion',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_above', threshold: 50 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 50 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'grant_charter', slotCost: 1, isFree: false },
      { choiceId: 'limit_expansion', slotCost: 1, isFree: false },
      { choiceId: 'demand_crown_oversight', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 4. Temple Construction Demands (developing) ---
  {
    id: 'evt_exp_rel_temple_construction',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'treasury_above', threshold: 400 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Clergy, threshold: 50 },
    ],
    weight: 1.0,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'fund_grand_temple', slotCost: 2, isFree: false },
      { choiceId: 'modest_chapel', slotCost: 1, isFree: false },
      { choiceId: 'decline_construction', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 5. Interfaith Dialogue (developing) ---
  {
    id: 'evt_exp_rel_interfaith_dialogue',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 30 },
      { type: 'neighbor_relationship_above', neighborId: 'neighbor_arenthal', threshold: 45 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'host_dialogue', slotCost: 1, isFree: false },
      { choiceId: 'permit_cautiously', slotCost: 1, isFree: false },
      { choiceId: 'forbid_dialogue', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'developing',
  },

  // --- 6. Pilgrimage Season (established) ---
  {
    id: 'evt_exp_rel_pilgrimage_season',
    severity: EventSeverity.Informational,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'season_is', season: Season.Spring },
      { type: 'faith_above', threshold: 45 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'provide_escorts', slotCost: 1, isFree: false },
      { choiceId: 'tax_pilgrims', slotCost: 1, isFree: false },
      { choiceId: 'permit_freely', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 7. Divine Portent Interpretation (established) ---
  {
    id: 'evt_exp_rel_divine_portent',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'stability_below', threshold: 35 },
        { type: 'faith_below', threshold: 35 },
      ]},
      { type: 'random_chance', probability: 0.3 },
    ],
    weight: 1.1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'declare_divine_favor', slotCost: 1, isFree: false },
      { choiceId: 'call_for_penance', slotCost: 1, isFree: false },
      { choiceId: 'dismiss_superstition', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 8. Clerical Corruption (established) ---
  {
    id: 'evt_exp_rel_clerical_corruption',
    severity: EventSeverity.Serious,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'faith_below', threshold: 45 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Commoners, threshold: 45 },
      { type: 'turn_range', minTurn: 9 },
    ],
    weight: 1.2,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'royal_inquisition', slotCost: 2, isFree: false },
      { choiceId: 'internal_reform', slotCost: 1, isFree: false },
      { choiceId: 'look_the_other_way', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 9. Religious Holiday Observance (any) ---
  {
    id: 'evt_exp_rel_holiday_observance',
    severity: EventSeverity.Informational,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'season_is', season: Season.Winter },
      { type: 'population_above', threshold: 700 },
    ],
    weight: 0.7,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'crown_sponsored_rites', slotCost: 1, isFree: false },
      { choiceId: 'permit_observance', slotCost: 0, isFree: true },
      { choiceId: 'curtail_festivities', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 10. Monastery Funding (established) ---
  {
    id: 'evt_exp_rel_monastery_funding',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'treasury_above', threshold: 350 },
      { type: 'faith_below', threshold: 50 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'generous_endowment', slotCost: 1, isFree: false },
      { choiceId: 'conditional_funding', slotCost: 1, isFree: false },
      { choiceId: 'deny_funding', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 11. Sacred Site Desecration (established) ---
  {
    id: 'evt_exp_rel_sacred_desecration',
    severity: EventSeverity.Critical,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'heterodoxy_above', threshold: 40 },
      { type: 'stability_below', threshold: 40 },
      { type: 'random_chance', probability: 0.25 },
    ],
    weight: 1.5,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'hunt_perpetrators', slotCost: 2, isFree: false },
      { choiceId: 'consecrate_and_restore', slotCost: 1, isFree: false },
      { choiceId: 'call_for_reconciliation', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: true,
    relatedStorylineId: null,
    phase: 'established',
  },

  // --- 12. Faith Healing Movement (any) ---
  {
    id: 'evt_exp_rel_faith_healing',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'population_below', threshold: 850 },
      { type: 'faith_above', threshold: 50 },
    ],
    weight: 0.8,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'support_movement', slotCost: 1, isFree: false },
      { choiceId: 'regulate_practices', slotCost: 1, isFree: false },
      { choiceId: 'ban_practitioners', slotCost: 1, isFree: false },
    ],
    affectsClass: PopulationClass.Commoners,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },

  // --- 13. Religious Education Reform (any) ---
  {
    id: 'evt_exp_rel_education_reform',
    severity: EventSeverity.Notable,
    category: EventCategory.Religion,
    triggerConditions: [
      { type: 'any_of', conditions: [
        { type: 'class_satisfaction_above', classTarget: PopulationClass.Clergy, threshold: 55 },
        { type: 'faith_above', threshold: 60 },
      ]},
      { type: 'turn_range', minTurn: 6 },
    ],
    weight: 0.9,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [
      { choiceId: 'expand_religious_schools', slotCost: 1, isFree: false },
      { choiceId: 'secular_curriculum', slotCost: 1, isFree: false },
      { choiceId: 'maintain_status_quo', slotCost: 0, isFree: true },
    ],
    affectsClass: PopulationClass.Clergy,
    affectsRegion: false,
    relatedStorylineId: null,
    phase: 'any',
  },
];
