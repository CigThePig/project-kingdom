// Phase 4 — Construction Project Pool Definitions
// Blueprint Reference: gameplay-blueprint.md §4.12, §5.4 — Development & Infrastructure

import {
  ConstructionCategory,
  KnowledgeBranch,
  ResourceType,
} from '../../engine/types';

// ============================================================
// Construction Completion Effect
// ============================================================

export interface ConstructionCompletionEffect {
  regionDevelopmentDelta: number;
  treasuryIncomeDelta?: number;
  foodProductionDelta?: number;
  militaryReadinessDelta?: number;
  militaryEquipmentDelta?: number;
  faithDelta?: number;
  knowledgeProgressDelta?: number;
  stabilityDelta?: number;
  tradeIncomeDelta?: number;
}

// ============================================================
// Construction Project Definition
// ============================================================

export interface ConstructionProjectDefinition {
  id: string;
  title: string;
  category: ConstructionCategory;
  turnsTotal: number;
  resourceCosts: Partial<Record<ResourceType, number>>;
  knowledgePrerequisite: {
    branch: KnowledgeBranch;
    milestoneIndex: number;
  } | null;
  effectDescription: string;
  completionEffect: ConstructionCompletionEffect;
}

// ============================================================
// Construction Pool — 18 projects, 3 per category
// ============================================================

export const CONSTRUCTION_POOL: ConstructionProjectDefinition[] = [
  // ====================
  // Economic (3)
  // ====================
  {
    id: 'construction_farm_expansion',
    title: 'Farm Expansion',
    category: ConstructionCategory.Economic,
    turnsTotal: 3,
    resourceCosts: { [ResourceType.Wood]: 20 },
    knowledgePrerequisite: null,
    effectDescription:
      'Expand cultivated land within the region, increasing food production capacity and reducing seasonal vulnerability.',
    completionEffect: {
      regionDevelopmentDelta: 5,
      foodProductionDelta: 8,
    },
  },
  {
    id: 'construction_iron_mine',
    title: 'Iron Mine',
    category: ConstructionCategory.Economic,
    turnsTotal: 5,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 10 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Agricultural,
      milestoneIndex: 1,
    },
    effectDescription:
      'Establish a new iron extraction site, boosting iron availability and treasury income from mineral exports.',
    completionEffect: {
      regionDevelopmentDelta: 8,
      treasuryIncomeDelta: 15,
    },
  },
  {
    id: 'construction_market_district',
    title: 'Market District',
    category: ConstructionCategory.Economic,
    turnsTotal: 4,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Iron]: 5 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.MaritimeTrade,
      milestoneIndex: 1,
    },
    effectDescription:
      'Build a permanent commercial quarter, increasing trade throughput and merchant class satisfaction.',
    completionEffect: {
      regionDevelopmentDelta: 6,
      tradeIncomeDelta: 12,
      stabilityDelta: 2,
    },
  },

  // ====================
  // Military (3)
  // ====================
  {
    id: 'construction_watchtower',
    title: 'Watchtower',
    category: ConstructionCategory.Military,
    turnsTotal: 3,
    resourceCosts: { [ResourceType.Wood]: 15, [ResourceType.Iron]: 5 },
    knowledgePrerequisite: null,
    effectDescription:
      'Erect a regional watchtower network, improving early warning capabilities and military readiness.',
    completionEffect: {
      regionDevelopmentDelta: 3,
      militaryReadinessDelta: 8,
    },
  },
  {
    id: 'construction_barracks',
    title: 'Barracks',
    category: ConstructionCategory.Military,
    turnsTotal: 5,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 15 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Military,
      milestoneIndex: 1,
    },
    effectDescription:
      'Construct dedicated military quarters, accelerating recruitment and improving equipment maintenance.',
    completionEffect: {
      regionDevelopmentDelta: 6,
      militaryReadinessDelta: 10,
      militaryEquipmentDelta: 5,
    },
  },
  {
    id: 'construction_armory',
    title: 'Royal Armory',
    category: ConstructionCategory.Military,
    turnsTotal: 6,
    resourceCosts: { [ResourceType.Wood]: 20, [ResourceType.Iron]: 35 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Military,
      milestoneIndex: 2,
    },
    effectDescription:
      'Establish a centralized armory for forging and storing weapons, significantly improving equipment quality.',
    completionEffect: {
      regionDevelopmentDelta: 8,
      militaryEquipmentDelta: 15,
      militaryReadinessDelta: 5,
    },
  },

  // ====================
  // Civic (3)
  // ====================
  {
    id: 'construction_road_network',
    title: 'Road Network',
    category: ConstructionCategory.Civic,
    turnsTotal: 4,
    resourceCosts: { [ResourceType.Wood]: 20, [ResourceType.Iron]: 5 },
    knowledgePrerequisite: null,
    effectDescription:
      'Improve roads connecting settlements, facilitating trade, troop movement, and administrative reach.',
    completionEffect: {
      regionDevelopmentDelta: 7,
      tradeIncomeDelta: 5,
      stabilityDelta: 3,
    },
  },
  {
    id: 'construction_courthouse',
    title: 'Courthouse',
    category: ConstructionCategory.Civic,
    turnsTotal: 5,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Iron]: 10 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 1,
    },
    effectDescription:
      'Build a regional seat of justice, strengthening the rule of law and reducing civil disorder.',
    completionEffect: {
      regionDevelopmentDelta: 6,
      stabilityDelta: 6,
    },
  },
  {
    id: 'construction_administrative_hall',
    title: 'Administrative Hall',
    category: ConstructionCategory.Civic,
    turnsTotal: 6,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 15 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 2,
    },
    effectDescription:
      'Establish a centralized administrative complex, improving governance efficiency and treasury collection.',
    completionEffect: {
      regionDevelopmentDelta: 10,
      treasuryIncomeDelta: 10,
      stabilityDelta: 4,
    },
  },

  // ====================
  // Religious (3)
  // ====================
  {
    id: 'construction_chapel',
    title: 'Chapel',
    category: ConstructionCategory.Religious,
    turnsTotal: 3,
    resourceCosts: { [ResourceType.Wood]: 15 },
    knowledgePrerequisite: null,
    effectDescription:
      'Build a modest house of worship, strengthening local faith and clergy presence.',
    completionEffect: {
      regionDevelopmentDelta: 3,
      faithDelta: 6,
      stabilityDelta: 2,
    },
  },
  {
    id: 'construction_monastery',
    title: 'Monastery',
    category: ConstructionCategory.Religious,
    turnsTotal: 5,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Iron]: 5 },
    knowledgePrerequisite: null,
    effectDescription:
      'Found a monastic order, providing sustained spiritual guidance and scholarly contribution to the realm.',
    completionEffect: {
      regionDevelopmentDelta: 6,
      faithDelta: 10,
      knowledgeProgressDelta: 15,
    },
  },
  {
    id: 'construction_grand_temple',
    title: 'Grand Temple',
    category: ConstructionCategory.Religious,
    turnsTotal: 7,
    resourceCosts: { [ResourceType.Wood]: 35, [ResourceType.Iron]: 20 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.CulturalScholarly,
      milestoneIndex: 1,
    },
    effectDescription:
      'Raise a magnificent temple, becoming a regional center of faith and cultural identity.',
    completionEffect: {
      regionDevelopmentDelta: 12,
      faithDelta: 15,
      stabilityDelta: 5,
    },
  },

  // ====================
  // Scholarly (3)
  // ====================
  {
    id: 'construction_scriptorium',
    title: 'Scriptorium',
    category: ConstructionCategory.Scholarly,
    turnsTotal: 4,
    resourceCosts: { [ResourceType.Wood]: 20 },
    knowledgePrerequisite: null,
    effectDescription:
      'Establish a scriptorium for copying and preserving texts, modestly accelerating knowledge accumulation.',
    completionEffect: {
      regionDevelopmentDelta: 4,
      knowledgeProgressDelta: 12,
    },
  },
  {
    id: 'construction_library',
    title: 'Royal Library',
    category: ConstructionCategory.Scholarly,
    turnsTotal: 5,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 10 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.CulturalScholarly,
      milestoneIndex: 1,
    },
    effectDescription:
      'Found a library housing the kingdom\'s collected wisdom, significantly boosting research capacity.',
    completionEffect: {
      regionDevelopmentDelta: 8,
      knowledgeProgressDelta: 25,
      stabilityDelta: 2,
    },
  },
  {
    id: 'construction_observatory',
    title: 'Observatory',
    category: ConstructionCategory.Scholarly,
    turnsTotal: 6,
    resourceCosts: { [ResourceType.Wood]: 20, [ResourceType.Iron]: 25 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.NaturalPhilosophy,
      milestoneIndex: 2,
    },
    effectDescription:
      'Build an astronomical observatory, advancing natural philosophy and unlocking new engineering possibilities.',
    completionEffect: {
      regionDevelopmentDelta: 10,
      knowledgeProgressDelta: 35,
    },
  },

  // ====================
  // Trade (3)
  // ====================
  {
    id: 'construction_warehouse',
    title: 'Warehouse',
    category: ConstructionCategory.Trade,
    turnsTotal: 3,
    resourceCosts: { [ResourceType.Wood]: 20 },
    knowledgePrerequisite: null,
    effectDescription:
      'Build storage facilities to protect surplus goods, improving trade reliability and reducing spoilage losses.',
    completionEffect: {
      regionDevelopmentDelta: 4,
      tradeIncomeDelta: 6,
      foodProductionDelta: 3,
    },
  },
  {
    id: 'construction_trading_post',
    title: 'Trading Post',
    category: ConstructionCategory.Trade,
    turnsTotal: 4,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Iron]: 5 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.MaritimeTrade,
      milestoneIndex: 1,
    },
    effectDescription:
      'Establish a frontier trading post, opening new routes and attracting foreign merchants.',
    completionEffect: {
      regionDevelopmentDelta: 6,
      tradeIncomeDelta: 15,
      treasuryIncomeDelta: 8,
    },
  },
  {
    id: 'construction_harbor',
    title: 'Harbor',
    category: ConstructionCategory.Trade,
    turnsTotal: 6,
    resourceCosts: { [ResourceType.Wood]: 35, [ResourceType.Iron]: 15 },
    knowledgePrerequisite: {
      branch: KnowledgeBranch.MaritimeTrade,
      milestoneIndex: 2,
    },
    effectDescription:
      'Construct a deep-water harbor, enabling large-scale maritime trade and naval presence.',
    completionEffect: {
      regionDevelopmentDelta: 12,
      tradeIncomeDelta: 25,
      treasuryIncomeDelta: 12,
      militaryReadinessDelta: 3,
    },
  },
];

// ============================================================
// Lookup Helper
// ============================================================

export function findConstructionDefinition(
  definitionId: string,
): ConstructionProjectDefinition | undefined {
  return CONSTRUCTION_POOL.find((p) => p.id === definitionId);
}
