// Phase 11 — Decree Pool Definitions
// Blueprint Reference: gameplay-blueprint.md §5.2 — Decrees

import {
  DecreeCategory,
  KnowledgeBranch,
  PopulationClass,
  ResourceType,
} from '../../engine/types';

// ============================================================
// Decree Definition Type
// ============================================================

export interface DecreeDefinition {
  id: string;
  title: string;
  category: DecreeCategory;
  slotCost: number;
  resourceCosts: Partial<Record<ResourceType, number>>;
  prerequisites: string[];
  affectedClasses: PopulationClass[];
  effectPreview: string;
  isHighImpact: boolean;
  knowledgePrerequisite: {
    branch: KnowledgeBranch;
    milestoneIndex: number;
  } | null;
}

// ============================================================
// Decree Pool — 18 decrees, 3 per category
// ============================================================

export const DECREE_POOL: DecreeDefinition[] = [
  // ====================
  // Economic (3)
  // ====================
  {
    id: 'decree_market_charter',
    title: 'Grant Market Charter',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Establish a new licensed market, improving merchant revenues and commoner access to goods. Modest increase to trade income at the cost of timber.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_emergency_levy',
    title: 'Impose Emergency Levy',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [
      PopulationClass.Merchants,
      PopulationClass.Commoners,
      PopulationClass.Nobility,
    ],
    effectPreview:
      'Extract an immediate one-time treasury payment from all taxable classes. Raises substantial coin but damages satisfaction across the populace.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_trade_subsidies',
    title: 'Subsidize Trade Routes',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants],
    effectPreview:
      'Invest heavily in trade infrastructure, boosting merchant satisfaction and long-term trade income. A costly commitment with delayed returns.',
    isHighImpact: true,
    knowledgePrerequisite: null,
  },

  // ====================
  // Military (3)
  // ====================
  {
    id: 'decree_fortify_borders',
    title: 'Fortify Border Outposts',
    category: DecreeCategory.Military,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 20, [ResourceType.Iron]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste],
    effectPreview:
      'Strengthen defensive positions along the frontier. Improves military readiness and signals resolve to neighboring kingdoms.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_arms_commission',
    title: 'Commission New Armaments',
    category: DecreeCategory.Military,
    slotCost: 1,
    resourceCosts: { [ResourceType.Iron]: 25 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Merchants],
    effectPreview:
      'Order forging of new weapons and armor. Improves equipment condition and military caste morale. Merchants benefit from iron contracts.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_general_mobilization',
    title: 'Order General Mobilization',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Iron]: 15 },
    prerequisites: [],
    affectedClasses: [
      PopulationClass.MilitaryCaste,
      PopulationClass.Commoners,
    ],
    effectPreview:
      'Place the entire military apparatus on full readiness. Dramatically improves military posture but strains commoner labor supply and treasury.',
    isHighImpact: true,
    knowledgePrerequisite: null,
  },

  // ====================
  // Civic (3)
  // ====================
  {
    id: 'decree_road_improvement',
    title: 'Improve Royal Roads',
    category: DecreeCategory.Civic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 15, [ResourceType.Wood]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Repair and extend the road network, improving trade flow and regional connectivity. Merchants and commoners benefit from easier movement of goods.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_census',
    title: 'Conduct Kingdom Census',
    category: DecreeCategory.Civic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Commoners],
    effectPreview:
      'Order a thorough accounting of population, land holdings, and production. Improves taxation accuracy and administrative clarity. Nobility may resist scrutiny.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_administrative_reform',
    title: 'Enact Administrative Reform',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: ['Civic Administration milestone 1'],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy],
    effectPreview:
      'Restructure governance institutions for greater efficiency. Reduces decree overhead in future turns but disrupts existing noble and clerical power structures.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 0,
    },
  },

  // ====================
  // Religious (3)
  // ====================
  {
    id: 'decree_call_festival',
    title: 'Call a Grand Festival',
    category: DecreeCategory.Religious,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners],
    effectPreview:
      'Declare a kingdom-wide religious festival. Boosts faith level and commoner morale at the cost of treasury investment determined by festival policy.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_invest_religious_order',
    title: 'Invest in Religious Order',
    category: DecreeCategory.Religious,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy],
    effectPreview:
      'Provide resources and patronage to a religious order, activating its benefits. Strengthens clergy influence and provides faith bonuses.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_suppress_heresy',
    title: 'Suppress Heterodox Movements',
    category: DecreeCategory.Religious,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners],
    effectPreview:
      'Crack down on heterodox religious movements. Reduces heterodoxy pressure but may damage commoner satisfaction if faith is low.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },

  // ====================
  // Diplomatic (3)
  // ====================
  {
    id: 'decree_diplomatic_envoy',
    title: 'Dispatch Diplomatic Envoy',
    category: DecreeCategory.Diplomatic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility],
    effectPreview:
      'Send emissaries to a neighboring kingdom to improve relations. Slow but steady path toward diplomatic cooperation and reduced tensions.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_trade_agreement',
    title: 'Propose Trade Agreement',
    category: DecreeCategory.Diplomatic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Nobility],
    effectPreview:
      'Offer a structured trade agreement to a neighboring kingdom. Increases mutual commerce if relations are sufficient. Merchants profit directly.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_royal_marriage',
    title: 'Arrange Royal Marriage',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy],
    effectPreview:
      'Forge a dynastic bond with a neighboring ruling house. Significantly improves diplomatic relations but commits the crown to a long-term alliance.',
    isHighImpact: true,
    knowledgePrerequisite: null,
  },

  // ====================
  // Social (3)
  // ====================
  {
    id: 'decree_public_granary',
    title: 'Establish Public Granaries',
    category: DecreeCategory.Social,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 20 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Commoners],
    effectPreview:
      'Build communal grain stores to buffer against food shortages. Commoner satisfaction improves as hunger anxiety recedes.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_labor_rights',
    title: 'Proclaim Labor Protections',
    category: DecreeCategory.Social,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [
      PopulationClass.Commoners,
      PopulationClass.Merchants,
      PopulationClass.Nobility,
    ],
    effectPreview:
      'Issue protections for common laborers. Commoner satisfaction rises meaningfully, but merchants face higher costs and nobility resents the precedent.',
    isHighImpact: false,
    knowledgePrerequisite: null,
  },
  {
    id: 'decree_land_redistribution',
    title: 'Order Land Redistribution',
    category: DecreeCategory.Social,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [
      PopulationClass.Nobility,
      PopulationClass.Commoners,
      PopulationClass.Clergy,
    ],
    effectPreview:
      'Redistribute portions of noble and clerical estates to commoners. Dramatically improves commoner outlook but severely damages noble and clerical satisfaction.',
    isHighImpact: true,
    knowledgePrerequisite: null,
  },
];
