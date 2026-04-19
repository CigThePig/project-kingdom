// Phase 11 — Decree Pool Definitions
// Blueprint Reference: gameplay-blueprint.md §5.2 — Decrees

import {
  DecreeCategory,
  DiplomaticPosture,
  KnowledgeBranch,
  PopulationClass,
  ResourceType,
} from '../../engine/types';
import { EXPANSION_DECREE_POOL } from './expansion-decrees';
import { EXPANSION_WAVE_2_DECREES } from './expansion-wave-2';

// ============================================================
// Decree State Condition — world-state prerequisites for decree availability
// ============================================================

export interface DecreeStateCondition {
  type:
    | 'stability_above'
    | 'treasury_above'
    | 'faith_above'
    | 'military_readiness_above'
    | 'neighbor_disposition_above'
    | 'turn_range'
    | 'consequence_tag_present';
  threshold?: number;
  /** For neighbor_disposition_above: minimum diplomatic posture required. */
  dispositionMinimum?: DiplomaticPosture;
  consequenceTag?: string;
  minTurn?: number;
}

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
  /** If true, this decree can be issued multiple times (with cooldown). */
  isRepeatable: boolean;
  /** Turns before a repeatable decree can be re-issued. 0 = no cooldown. */
  cooldownTurns: number;
  /** Decree ID of the previous tier that must be enacted first. Null for base tier / standalone. */
  previousTierDecreeId: string | null;
  /** Groups decrees in the same progression chain for UI display. Null for standalone. */
  chainId: string | null;
  /** Position within a chain: 1 = base, 2 = upgrade, 3 = mastery. 1 for standalone. */
  tier: number;
  /** Minimum turn number before this decree becomes available. Null = no restriction. */
  turnMinimum: number | null;
  /**
   * Optional world-state conditions that must ALL pass for this decree to be available.
   * Null = no state requirements.
   */
  statePrerequisites: DecreeStateCondition[] | null;
}

// ============================================================
// Decree Pool — Base decrees + progression chain tiers
// ============================================================

export const DECREE_POOL: DecreeDefinition[] = [
  // ====================
  // Economic — Market Chain (3 tiers)
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_market',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_trade_guild_expansion',
    title: 'Expand Trade Guilds',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 20, [ResourceType.Iron]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Formalize and empower merchant guilds across the kingdom, granting them regulatory authority over trade practices. Increases commerce significantly but concentrates economic power.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_market_charter',
    chainId: 'chain_market',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_merchant_republic_charter',
    title: 'Charter Merchant Republic',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Iron]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners, PopulationClass.Nobility],
    effectPreview:
      'Grant merchants formal political representation and autonomous trade governance. A transformative act that massively boosts commerce but permanently shifts power away from the nobility.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_trade_guild_expansion',
    chainId: 'chain_market',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: null,
  },

  // ====================
  // Economic — Trade Chain (3 tiers)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_trade',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_trade_monopoly',
    title: 'Establish Trade Monopoly',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 15, [ResourceType.Iron]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Nobility],
    effectPreview:
      'Grant exclusive trading rights in key commodities to crown-licensed merchants. Generates substantial revenue but breeds resentment among excluded traders and the nobility.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_trade_subsidies',
    chainId: 'chain_trade',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_international_trade_empire',
    title: 'Proclaim International Trade Empire',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 20 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners, PopulationClass.Nobility],
    effectPreview:
      'Declare the kingdom a dominant commercial power, establishing trade dominance across all neighboring regions. Transforms the economy but draws the ire of foreign rivals and domestic nobles alike.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_trade_monopoly',
    chainId: 'chain_trade',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: null,
  },

  // ====================
  // Economic — Emergency Levy (repeatable, standalone)
  // ====================
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
    isRepeatable: true,
    cooldownTurns: 4,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Military — Fortification Chain (3 tiers)
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_fortify',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_integrated_defense_network',
    title: 'Build Integrated Defense Network',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 30, [ResourceType.Iron]: 20 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Commoners],
    effectPreview:
      'Connect border outposts into a coordinated defense system with signal towers and supply lines. Substantially improves readiness and morale but demands heavy resources and commoner labor.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_fortify_borders',
    chainId: 'chain_fortify',
    tier: 2,
    turnMinimum: 6,
    statePrerequisites: null,
  },
  {
    id: 'decree_fortress_kingdom',
    title: 'Declare Fortress Kingdom',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 40, [ResourceType.Iron]: 25 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Commoners, PopulationClass.Nobility],
    effectPreview:
      'Transform the entire kingdom into a fortified domain with layered defenses and militarized infrastructure. An extreme commitment that makes the realm nearly impregnable but reshapes society around permanent defense.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_integrated_defense_network',
    chainId: 'chain_fortify',
    tier: 3,
    turnMinimum: 10,
    statePrerequisites: null,
  },

  // ====================
  // Military — Arms Chain (3 tiers)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_arms',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_royal_arsenal',
    title: 'Establish Royal Arsenal',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Iron]: 35, [ResourceType.Stone]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Merchants],
    effectPreview:
      'Found a permanent royal weapons manufactory, ensuring a steady supply of superior arms. Equipment quality rises dramatically and merchants secure long-term contracts.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_arms_commission',
    chainId: 'chain_arms',
    tier: 2,
    turnMinimum: 6,
    statePrerequisites: null,
  },
  {
    id: 'decree_war_machine_industry',
    title: 'Industrialize War Production',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Iron]: 45, [ResourceType.Stone]: 20, [ResourceType.Wood]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Reorganize the kingdom\'s entire manufacturing capacity around military production. Creates an unmatched arsenal but diverts resources from civilian needs and reshapes the economy around war.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_royal_arsenal',
    chainId: 'chain_arms',
    tier: 3,
    turnMinimum: 10,
    statePrerequisites: null,
  },

  // ====================
  // Military — General Mobilization (repeatable, standalone)
  // ====================
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
    isRepeatable: true,
    cooldownTurns: 5,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Civic — Roads Chain (3 tiers)
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_roads',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_provincial_highway_system',
    title: 'Build Provincial Highways',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 25, [ResourceType.Wood]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Construct a network of paved highways connecting all provincial capitals. Dramatically improves trade efficiency and regional development, though the costs are considerable.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_road_improvement',
    chainId: 'chain_roads',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_kingdom_transit_network',
    title: 'Establish Kingdom Transit Network',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 35, [ResourceType.Wood]: 20, [ResourceType.Iron]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners, PopulationClass.MilitaryCaste],
    effectPreview:
      'Complete a unified transit system with way stations, bridges, and military supply routes. The kingdom becomes interconnected as never before, benefiting commerce, defense, and civilian life alike.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_provincial_highway_system',
    chainId: 'chain_roads',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: null,
  },

  // ====================
  // Civic — Administration Chain (3 tiers)
  // ====================
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
    isRepeatable: true,
    cooldownTurns: 6,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_admin',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_royal_bureaucracy',
    title: 'Establish Royal Bureaucracy',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 10 },
    prerequisites: ['Civic Administration milestone 1'],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy, PopulationClass.Commoners],
    effectPreview:
      'Create a professional administrative class to manage the kingdom\'s affairs. Reduces corruption and improves efficiency, but further diminishes noble and clerical authority.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_administrative_reform',
    chainId: 'chain_admin',
    tier: 2,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_centralized_governance',
    title: 'Centralize Royal Governance',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 20 },
    prerequisites: ['Civic Administration milestone 2'],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy, PopulationClass.Commoners],
    effectPreview:
      'Consolidate all governance under direct crown authority, eliminating feudal intermediaries. A revolutionary act that maximizes administrative efficiency but provokes intense aristocratic opposition.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_royal_bureaucracy',
    chainId: 'chain_admin',
    tier: 3,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Religious — Call Festival (repeatable, standalone)
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
    isRepeatable: true,
    cooldownTurns: 3,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Religious — Faith Chain (3 tiers)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_faith',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_expand_religious_authority',
    title: 'Expand Religious Authority',
    category: DecreeCategory.Religious,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 20 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Nobility],
    effectPreview:
      'Grant religious orders greater jurisdiction over moral and legal matters. Significantly strengthens faith and clergy satisfaction but may encroach on noble prerogatives.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_invest_religious_order',
    chainId: 'chain_faith',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_theocratic_council',
    title: 'Convene Theocratic Council',
    category: DecreeCategory.Religious,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 30 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Nobility, PopulationClass.Commoners],
    effectPreview:
      'Establish a permanent religious council with formal advisory power over crown decisions. Faith becomes a pillar of governance, but the clergy gains unprecedented influence over temporal affairs.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_expand_religious_authority',
    chainId: 'chain_faith',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: [{ type: 'faith_above', threshold: 50 }],
  },

  // ====================
  // Religious — Heresy Chain (3 tiers)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_heresy',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_inquisitorial_authority',
    title: 'Establish Inquisitorial Authority',
    category: DecreeCategory.Religious,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners, PopulationClass.Nobility],
    effectPreview:
      'Create a formal body empowered to investigate and prosecute religious dissent. Dramatically reduces heterodoxy but creates fear among commoners and tension with nobles who value their autonomy.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_suppress_heresy',
    chainId: 'chain_heresy',
    tier: 2,
    turnMinimum: 6,
    statePrerequisites: [{ type: 'faith_above', threshold: 40 }],
  },
  {
    id: 'decree_religious_unification',
    title: 'Decree Religious Unification',
    category: DecreeCategory.Religious,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners, PopulationClass.Nobility],
    effectPreview:
      'Mandate a single orthodox faith across the entire kingdom, outlawing all heterodox practices. Eliminates heterodoxy but inflicts severe damage on commoner satisfaction and risks widespread unrest.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_inquisitorial_authority',
    chainId: 'chain_heresy',
    tier: 3,
    turnMinimum: 10,
    statePrerequisites: [{ type: 'faith_above', threshold: 40 }],
  },

  // ====================
  // Diplomatic — Envoy Chain (3 tiers)
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
      'Send emissaries to a foreign court to improve relations. Slow but steady path toward diplomatic cooperation and reduced tensions.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_envoy',
    tier: 1,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_permanent_embassy',
    title: 'Establish Permanent Embassy',
    category: DecreeCategory.Diplomatic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Merchants],
    effectPreview:
      'Build a permanent diplomatic mission in a foreign capital. Provides ongoing relationship improvement and intelligence gathering opportunities.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_diplomatic_envoy',
    chainId: 'chain_envoy',
    tier: 2,
    turnMinimum: 6,
    statePrerequisites: [{ type: 'neighbor_disposition_above', dispositionMinimum: DiplomaticPosture.Neutral }],
  },
  {
    id: 'decree_diplomatic_supremacy',
    title: 'Pursue Diplomatic Supremacy',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 20 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Merchants, PopulationClass.Clergy],
    effectPreview:
      'Position the kingdom as the dominant diplomatic power in the region, hosting international summits and arbitrating disputes. Brings immense prestige but creates expectations of neutrality.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_permanent_embassy',
    chainId: 'chain_envoy',
    tier: 3,
    turnMinimum: 10,
    statePrerequisites: [{ type: 'neighbor_disposition_above', dispositionMinimum: DiplomaticPosture.Neutral }],
  },

  // ====================
  // Diplomatic — Marriage Chain (3 tiers)
  // ====================
  {
    id: 'decree_trade_agreement',
    title: 'Propose Trade Agreement',
    category: DecreeCategory.Diplomatic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Nobility],
    effectPreview:
      'Offer a structured trade agreement to a foreign court. Increases mutual commerce if relations are sufficient. Merchants profit directly.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 4,
    statePrerequisites: null,
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
      'Forge a dynastic bond with a foreign ruling house. Significantly improves diplomatic relations but commits the crown to a long-term alliance.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_marriage',
    tier: 1,
    turnMinimum: 4,
    statePrerequisites: [{ type: 'neighbor_disposition_above', dispositionMinimum: DiplomaticPosture.Neutral }],
  },
  {
    id: 'decree_dynasty_alliance',
    title: 'Forge Dynasty Alliance Network',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy],
    effectPreview:
      'Extend dynastic bonds across multiple ruling houses, creating an interlocking network of marriage alliances. Dramatically strengthens diplomatic position but entangles the crown in foreign obligations.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_royal_marriage',
    chainId: 'chain_marriage',
    tier: 2,
    turnMinimum: 8,
    statePrerequisites: null,
  },
  {
    id: 'decree_imperial_confederation',
    title: 'Propose Imperial Confederation',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy, PopulationClass.Merchants],
    effectPreview:
      'Propose a formal confederation of allied kingdoms under crown leadership. The pinnacle of diplomatic achievement, granting enormous influence but requiring the kingdom to bear the costs of collective governance.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_dynasty_alliance',
    chainId: 'chain_marriage',
    tier: 3,
    turnMinimum: 12,
    statePrerequisites: null,
  },

  // ====================
  // Social — Granary Chain (3 tiers)
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_granary',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_regional_food_distribution',
    title: 'Organize Regional Food Distribution',
    category: DecreeCategory.Social,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 25, [ResourceType.Stone]: 10 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Merchants],
    effectPreview:
      'Create a managed system for distributing food reserves across regions during shortages. Reduces famine risk substantially and stabilizes food prices for merchants.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_public_granary',
    chainId: 'chain_granary',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_kingdom_breadbasket',
    title: 'Launch Kingdom Breadbasket Program',
    category: DecreeCategory.Social,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Stone]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Merchants, PopulationClass.Clergy],
    effectPreview:
      'Guarantee food security for every subject through a comprehensive national program. Eliminates hunger as a political threat but requires permanent resource commitment.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_regional_food_distribution',
    chainId: 'chain_granary',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: null,
  },

  // ====================
  // Food — Standalone Decrees (4)
  // ====================
  {
    id: 'decree_military_ration_reform',
    title: 'Reform Military Rations',
    category: DecreeCategory.Military,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Commoners],
    effectPreview:
      'Restructure military provisioning to reduce waste and align rations with actual readiness needs. Saves food but military morale may suffer.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: true,
    cooldownTurns: 6,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_seasonal_reserve_mandate',
    title: 'Mandate Seasonal Food Reserves',
    category: DecreeCategory.Social,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Merchants],
    effectPreview:
      'Require all regions to maintain minimum food reserves before winter. Stabilizes food supply but constrains merchant trade in foodstuffs.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 3,
    statePrerequisites: [{ type: 'stability_above', threshold: 40 }],
  },
  {
    id: 'decree_agricultural_trade_compact',
    title: 'Negotiate Agricultural Trade Compact',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Establish formal food trade agreements with neighboring kingdoms. Provides a reliable food supplement at ongoing treasury cost, but strengthens merchant ties and diplomatic bonds.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 5,
    statePrerequisites: [{ type: 'stability_above', threshold: 50 }],
  },
  {
    id: 'decree_harvest_tithe_exemption',
    title: 'Waive Harvest Tithe',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Clergy],
    effectPreview:
      'Temporarily waive the traditional harvest tithe, allowing farmers to retain more of their produce for food stores. Reduces treasury income but substantially boosts food reserves.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: true,
    cooldownTurns: 4,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Social — Labor Chain (3 tiers)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: 'chain_labor',
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_workers_guild_charter',
    title: 'Charter Workers\' Guilds',
    category: DecreeCategory.Social,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 10 },
    prerequisites: [],
    affectedClasses: [
      PopulationClass.Commoners,
      PopulationClass.Merchants,
      PopulationClass.Nobility,
    ],
    effectPreview:
      'Grant commoner workers the right to organize into protective guilds. Substantially improves labor conditions and commoner satisfaction, but merchants and nobles face organized resistance to exploitation.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_labor_rights',
    chainId: 'chain_labor',
    tier: 2,
    turnMinimum: 4,
    statePrerequisites: null,
  },
  {
    id: 'decree_social_contract',
    title: 'Enact Social Contract Reform',
    category: DecreeCategory.Social,
    slotCost: 2,
    resourceCosts: {},
    prerequisites: [],
    affectedClasses: [
      PopulationClass.Commoners,
      PopulationClass.Merchants,
      PopulationClass.Nobility,
      PopulationClass.Clergy,
    ],
    effectPreview:
      'Codify fundamental rights and obligations for all classes, creating a formal social compact. A transformative decree that redefines the kingdom\'s social order, elevating commoners at the cost of traditional hierarchies.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: 'decree_workers_guild_charter',
    chainId: 'chain_labor',
    tier: 3,
    turnMinimum: 8,
    statePrerequisites: null,
  },

  // ====================
  // Social — Land Redistribution (one-time standalone)
  // ====================
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
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 4,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Agricultural (2) — standalone one-time
  // ====================
  {
    id: 'decree_crop_rotation',
    title: 'Implement Crop Rotation',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 10 },
    prerequisites: ['Agricultural milestone 1'],
    affectedClasses: [PopulationClass.Commoners],
    effectPreview:
      'Introduce systematic crop rotation practices across the kingdom\'s farmlands. Improves long-term food production efficiency and soil health.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Agricultural,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_irrigation_works',
    title: 'Commission Irrigation Works',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 20, [ResourceType.Wood]: 15 },
    prerequisites: ['Agricultural milestone 2'],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Merchants],
    effectPreview:
      'Build a major irrigation system to protect against drought and increase agricultural yields. A costly investment with significant long-term food security benefits.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Agricultural,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Military (2) — standalone one-time
  // ====================
  {
    id: 'decree_advanced_fortifications',
    title: 'Build Advanced Fortifications',
    category: DecreeCategory.Military,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 25, [ResourceType.Iron]: 10 },
    prerequisites: ['Military milestone 1'],
    affectedClasses: [PopulationClass.MilitaryCaste],
    effectPreview:
      'Upgrade border defenses with advanced engineering techniques. Significantly improves defensive capability and deters aggression from neighbors.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Military,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_elite_training_program',
    title: 'Establish Elite Training Program',
    category: DecreeCategory.Military,
    slotCost: 2,
    resourceCosts: { [ResourceType.Iron]: 20 },
    prerequisites: ['Military milestone 2'],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Nobility],
    effectPreview:
      'Create a rigorous training program for elite military units. Dramatically improves force quality, morale, and readiness at significant cost.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Military,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Civic (2) — standalone one-time
  // ====================
  {
    id: 'decree_tax_code_reform',
    title: 'Reform the Tax Code',
    category: DecreeCategory.Civic,
    slotCost: 1,
    resourceCosts: {},
    prerequisites: ['Civic Administration milestone 1'],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Nobility],
    effectPreview:
      'Modernize and rationalize the tax collection system. Increases treasury efficiency while reducing unfair burdens. Merchants welcome reform; nobles resist scrutiny.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_provincial_governance',
    title: 'Establish Provincial Governance',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 15 },
    prerequisites: ['Civic Administration milestone 2'],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Commoners],
    effectPreview:
      'Create formal provincial administration structures, reducing the crown\'s dependence on local noble governance. Improves stability and regional development at the cost of noble influence.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.Civic,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Maritime/Trade (2) — standalone one-time
  // ====================
  {
    id: 'decree_harbor_expansion',
    title: 'Expand Harbor Facilities',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Wood]: 20, [ResourceType.Stone]: 15 },
    prerequisites: ['Maritime Trade milestone 1'],
    affectedClasses: [PopulationClass.Merchants],
    effectPreview:
      'Expand port infrastructure to accommodate larger trading vessels and higher trade volume. Directly benefits merchant income and strengthens international commerce.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.MaritimeTrade,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_trade_fleet_commission',
    title: 'Commission a Trade Fleet',
    category: DecreeCategory.Economic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 30, [ResourceType.Iron]: 15 },
    prerequisites: ['Maritime Trade milestone 2'],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Build a royal merchant fleet to secure trade routes and expand commercial reach. A major investment that transforms the kingdom\'s trading capability.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.MaritimeTrade,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Cultural/Scholarly (2) — standalone one-time
  // ====================
  {
    id: 'decree_university_charter',
    title: 'Charter a Royal University',
    category: DecreeCategory.Civic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Stone]: 20 },
    prerequisites: ['Cultural Scholarly milestone 1'],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Commoners],
    effectPreview:
      'Establish a center of higher learning, attracting scholars and advancing the kingdom\'s intellectual prestige. Accelerates research and improves clergy scholarly output.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.CulturalScholarly,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_diplomatic_academy',
    title: 'Found a Diplomatic Academy',
    category: DecreeCategory.Diplomatic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 15 },
    prerequisites: ['Cultural Scholarly milestone 2'],
    affectedClasses: [PopulationClass.Nobility, PopulationClass.Clergy],
    effectPreview:
      'Establish an academy for training diplomats and courtiers. Improves the quality of diplomatic negotiations and strengthens the kingdom\'s international standing.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.CulturalScholarly,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // ====================
  // Knowledge-Gated: Natural Philosophy (2) — standalone one-time
  // ====================
  {
    id: 'decree_engineering_corps',
    title: 'Establish Engineering Corps',
    category: DecreeCategory.Civic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Iron]: 15 },
    prerequisites: ['Natural Philosophy milestone 1'],
    affectedClasses: [PopulationClass.MilitaryCaste, PopulationClass.Commoners],
    effectPreview:
      'Create a specialized corps of engineers to improve infrastructure, military fortifications, and resource extraction. Benefits both civilian and military applications.',
    isHighImpact: false,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.NaturalPhilosophy,
      milestoneIndex: 0,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },
  {
    id: 'decree_medical_reforms',
    title: 'Institute Medical Reforms',
    category: DecreeCategory.Social,
    slotCost: 2,
    resourceCosts: { [ResourceType.Wood]: 10 },
    prerequisites: ['Natural Philosophy milestone 2'],
    affectedClasses: [PopulationClass.Commoners, PopulationClass.Clergy],
    effectPreview:
      'Implement systematic medical practices based on natural philosophy research. Improves population health, reduces plague impact, and enhances clergy healing capacity.',
    isHighImpact: true,
    knowledgePrerequisite: {
      branch: KnowledgeBranch.NaturalPhilosophy,
      milestoneIndex: 1,
    },
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: null,
    statePrerequisites: null,
  },

  // Expansion Decrees
  ...EXPANSION_DECREE_POOL,

  // Phase 7 — Wave-2 Decrees
  ...EXPANSION_WAVE_2_DECREES,
];
