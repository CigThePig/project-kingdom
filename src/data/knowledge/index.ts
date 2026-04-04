// Phase 8 — Knowledge Tree Visualization Data
// Blueprint Reference: gameplay-blueprint.md §4.13 — Knowledge & Advancement System
// Milestone definitions, cross-branch dependencies, and research contributor labels.
// All player-facing text lives here, not in component files.

import { KnowledgeBranch } from '../../engine/types';

// ============================================================
// Milestone Definition
// ============================================================

export interface MilestoneUnlock {
  type: 'decree' | 'construction' | 'bonus';
  label: string;
}

export interface MilestoneDefinition {
  branch: KnowledgeBranch;
  milestoneIndex: number;
  name: string;
  description: string;
  branchBonus: string;
  unlocks: MilestoneUnlock[];
}

// ============================================================
// Cross-Branch Dependency
// ============================================================

export interface CrossBranchDependency {
  from: { branch: KnowledgeBranch; milestoneIndex: number };
  to: { branch: KnowledgeBranch; milestoneIndex: number };
  label: string;
}

// ============================================================
// Milestone Definitions — 6 branches x 5 milestones = 30 nodes
// ============================================================

export const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  // ---- Agricultural ----
  {
    branch: KnowledgeBranch.Agricultural,
    milestoneIndex: 0,
    name: 'Crop Rotation',
    description: 'Systematic alternation of crops to maintain soil fertility and reduce blight risk.',
    branchBonus: '+10% food production',
    unlocks: [
      { type: 'decree', label: 'Implement Crop Rotation' },
    ],
  },
  {
    branch: KnowledgeBranch.Agricultural,
    milestoneIndex: 1,
    name: 'Irrigation Systems',
    description: 'Engineered water channels that protect against drought and expand arable land.',
    branchBonus: '+20% food production',
    unlocks: [
      { type: 'decree', label: 'Commission Irrigation Works' },
      { type: 'construction', label: 'Irrigation Network' },
    ],
  },
  {
    branch: KnowledgeBranch.Agricultural,
    milestoneIndex: 2,
    name: 'Selective Breeding',
    description: 'Methodical improvement of livestock and seed stock for greater yield and resilience.',
    branchBonus: '+30% food production',
    unlocks: [
      { type: 'bonus', label: 'Improved famine resistance' },
    ],
  },
  {
    branch: KnowledgeBranch.Agricultural,
    milestoneIndex: 3,
    name: 'Harvest Preservation',
    description: 'Advanced storage and preservation techniques that extend food supply through lean seasons.',
    branchBonus: '+40% food production',
    unlocks: [
      { type: 'bonus', label: 'Extended harvest seasons' },
    ],
  },
  {
    branch: KnowledgeBranch.Agricultural,
    milestoneIndex: 4,
    name: 'Agricultural Mastery',
    description: 'The kingdom leads the known world in farming science. Food scarcity becomes a policy choice, not a natural threat.',
    branchBonus: '+50% food production',
    unlocks: [
      { type: 'bonus', label: 'Maximum agricultural efficiency' },
    ],
  },

  // ---- Military ----
  {
    branch: KnowledgeBranch.Military,
    milestoneIndex: 0,
    name: 'Fortification Design',
    description: 'Improved defensive architecture using angled walls and reinforced gatehouses.',
    branchBonus: '+10% military effectiveness',
    unlocks: [
      { type: 'decree', label: 'Advanced Fortifications' },
    ],
  },
  {
    branch: KnowledgeBranch.Military,
    milestoneIndex: 1,
    name: 'Tactical Doctrine',
    description: 'Codified battle formations and command structures that multiply force effectiveness.',
    branchBonus: '+20% military effectiveness',
    unlocks: [
      { type: 'decree', label: 'Elite Training Program' },
      { type: 'construction', label: 'Stone Fortress' },
    ],
  },
  {
    branch: KnowledgeBranch.Military,
    milestoneIndex: 2,
    name: 'Siege Engineering',
    description: 'Mastery of siege weapons and countermeasures that shift the balance of offensive warfare.',
    branchBonus: '+30% military effectiveness',
    unlocks: [
      { type: 'construction', label: 'Arsenal' },
    ],
  },
  {
    branch: KnowledgeBranch.Military,
    milestoneIndex: 3,
    name: 'Strategic Intelligence',
    description: 'Systematic battlefield reconnaissance and supply chain management.',
    branchBonus: '+40% military effectiveness',
    unlocks: [
      { type: 'bonus', label: 'Enhanced equipment quality' },
    ],
  },
  {
    branch: KnowledgeBranch.Military,
    milestoneIndex: 4,
    name: 'Military Supremacy',
    description: 'The kingdom fields the most disciplined and technically advanced military force in the region.',
    branchBonus: '+50% military effectiveness',
    unlocks: [
      { type: 'bonus', label: 'Maximum military efficiency' },
    ],
  },

  // ---- Civic ----
  {
    branch: KnowledgeBranch.Civic,
    milestoneIndex: 0,
    name: 'Record-Keeping',
    description: 'Standardized administrative records improve governance efficiency and reduce corruption.',
    branchBonus: '+10% governance efficiency',
    unlocks: [
      { type: 'decree', label: 'Administrative Reform' },
      { type: 'decree', label: 'Tax Code Reform' },
    ],
  },
  {
    branch: KnowledgeBranch.Civic,
    milestoneIndex: 1,
    name: 'Provincial Administration',
    description: 'Formal governance structures that extend the crown\'s effective reach beyond the capital.',
    branchBonus: '+20% governance efficiency',
    unlocks: [
      { type: 'decree', label: 'Provincial Governance' },
      { type: 'construction', label: 'Courthouse' },
    ],
  },
  {
    branch: KnowledgeBranch.Civic,
    milestoneIndex: 2,
    name: 'Legal Codification',
    description: 'Written law replaces customary practice, creating predictable justice and reducing unrest.',
    branchBonus: '+30% governance efficiency',
    unlocks: [
      { type: 'construction', label: 'Hall of Records' },
    ],
  },
  {
    branch: KnowledgeBranch.Civic,
    milestoneIndex: 3,
    name: 'Census Systems',
    description: 'Comprehensive population tracking enables precise taxation and resource allocation.',
    branchBonus: '+40% governance efficiency',
    unlocks: [
      { type: 'bonus', label: 'Improved stability recovery' },
    ],
  },
  {
    branch: KnowledgeBranch.Civic,
    milestoneIndex: 4,
    name: 'Civic Mastery',
    description: 'The kingdom\'s governance institutions are a model of efficiency admired across the region.',
    branchBonus: '+50% governance efficiency',
    unlocks: [
      { type: 'bonus', label: 'Maximum administrative efficiency' },
    ],
  },

  // ---- Maritime & Trade ----
  {
    branch: KnowledgeBranch.MaritimeTrade,
    milestoneIndex: 0,
    name: 'Trade Logistics',
    description: 'Standardized weights, measures, and contracts that reduce commercial friction.',
    branchBonus: '+10% trade income',
    unlocks: [
      { type: 'decree', label: 'Harbor Expansion' },
    ],
  },
  {
    branch: KnowledgeBranch.MaritimeTrade,
    milestoneIndex: 1,
    name: 'Navigation Arts',
    description: 'Improved shipbuilding and navigation enable longer trade routes and larger cargoes.',
    branchBonus: '+20% trade income',
    unlocks: [
      { type: 'decree', label: 'Trade Fleet Commission' },
      { type: 'construction', label: 'Port' },
      { type: 'construction', label: 'Merchant Quarter' },
    ],
  },
  {
    branch: KnowledgeBranch.MaritimeTrade,
    milestoneIndex: 2,
    name: 'Banking Instruments',
    description: 'Letters of credit and deposit banking accelerate commerce and reduce robbery losses.',
    branchBonus: '+30% trade income',
    unlocks: [
      { type: 'construction', label: 'Trade Exchange' },
    ],
  },
  {
    branch: KnowledgeBranch.MaritimeTrade,
    milestoneIndex: 3,
    name: 'Maritime Diplomacy',
    description: 'Naval presence and trade agreements open new diplomatic channels with distant powers.',
    branchBonus: '+40% trade income',
    unlocks: [
      { type: 'bonus', label: 'Maritime diplomatic options' },
    ],
  },
  {
    branch: KnowledgeBranch.MaritimeTrade,
    milestoneIndex: 4,
    name: 'Trade Mastery',
    description: 'The kingdom becomes a commercial hub. Wealth flows through its ports and markets from every direction.',
    branchBonus: '+50% trade income',
    unlocks: [
      { type: 'bonus', label: 'Maximum trade efficiency' },
    ],
  },

  // ---- Cultural & Scholarly ----
  {
    branch: KnowledgeBranch.CulturalScholarly,
    milestoneIndex: 0,
    name: 'Scriptoria & Archives',
    description: 'Centers of manuscript production preserve and spread knowledge throughout the realm.',
    branchBonus: '+10% faith & cultural cohesion',
    unlocks: [
      { type: 'decree', label: 'University Charter' },
    ],
  },
  {
    branch: KnowledgeBranch.CulturalScholarly,
    milestoneIndex: 1,
    name: 'Higher Learning',
    description: 'Established seats of learning attract scholars and elevate the kingdom\'s intellectual prestige.',
    branchBonus: '+20% faith & cultural cohesion',
    unlocks: [
      { type: 'decree', label: 'Diplomatic Academy' },
      { type: 'construction', label: 'Royal Library' },
      { type: 'construction', label: 'Grand Cathedral' },
    ],
  },
  {
    branch: KnowledgeBranch.CulturalScholarly,
    milestoneIndex: 2,
    name: 'Philosophical Tradition',
    description: 'A flourishing school of thought that deepens understanding and strengthens cultural identity.',
    branchBonus: '+30% faith & cultural cohesion',
    unlocks: [
      { type: 'bonus', label: 'Enhanced clergy effectiveness' },
    ],
  },
  {
    branch: KnowledgeBranch.CulturalScholarly,
    milestoneIndex: 3,
    name: 'Diplomatic Prestige',
    description: 'The kingdom\'s cultural achievements earn respect and influence in foreign courts.',
    branchBonus: '+40% faith & cultural cohesion',
    unlocks: [
      { type: 'bonus', label: 'Diplomatic prestige bonus' },
    ],
  },
  {
    branch: KnowledgeBranch.CulturalScholarly,
    milestoneIndex: 4,
    name: 'Cultural Mastery',
    description: 'The kingdom is a beacon of learning and culture. Scholars from distant lands seek its wisdom.',
    branchBonus: '+50% faith & cultural cohesion',
    unlocks: [
      { type: 'bonus', label: 'Maximum cultural influence' },
    ],
  },

  // ---- Natural Philosophy ----
  {
    branch: KnowledgeBranch.NaturalPhilosophy,
    milestoneIndex: 0,
    name: 'Material Science',
    description: 'Systematic study of metals, minerals, and construction materials improves resource processing.',
    branchBonus: '+10% resource processing',
    unlocks: [
      { type: 'decree', label: 'Engineering Corps' },
    ],
  },
  {
    branch: KnowledgeBranch.NaturalPhilosophy,
    milestoneIndex: 1,
    name: 'Medical Practice',
    description: 'Evidence-based healing reduces plague mortality and improves population health.',
    branchBonus: '+20% resource processing',
    unlocks: [
      { type: 'decree', label: 'Medical Reforms' },
    ],
  },
  {
    branch: KnowledgeBranch.NaturalPhilosophy,
    milestoneIndex: 2,
    name: 'Engineering Principles',
    description: 'Mathematical foundations for construction, machinery, and infrastructure projects.',
    branchBonus: '+30% resource processing',
    unlocks: [
      { type: 'construction', label: 'Observatory' },
    ],
  },
  {
    branch: KnowledgeBranch.NaturalPhilosophy,
    milestoneIndex: 3,
    name: 'Applied Chemistry',
    description: 'Understanding of chemical processes improves metallurgy, agriculture, and medicine.',
    branchBonus: '+40% resource processing',
    unlocks: [
      { type: 'bonus', label: 'Improved disease response' },
    ],
  },
  {
    branch: KnowledgeBranch.NaturalPhilosophy,
    milestoneIndex: 4,
    name: 'Natural Mastery',
    description: 'The kingdom commands an understanding of natural law that reshapes every aspect of production and welfare.',
    branchBonus: '+50% resource processing',
    unlocks: [
      { type: 'bonus', label: 'Maximum processing efficiency' },
    ],
  },
];

// ============================================================
// Cross-Branch Dependencies (soft / aspirational — visual only)
// ============================================================

export const CROSS_BRANCH_DEPENDENCIES: CrossBranchDependency[] = [
  {
    from: { branch: KnowledgeBranch.Civic, milestoneIndex: 0 },
    to: { branch: KnowledgeBranch.MaritimeTrade, milestoneIndex: 2 },
    label: 'Record-keeping enables banking instruments',
  },
  {
    from: { branch: KnowledgeBranch.CulturalScholarly, milestoneIndex: 0 },
    to: { branch: KnowledgeBranch.NaturalPhilosophy, milestoneIndex: 1 },
    label: 'Scholarly tradition supports medical research',
  },
  {
    from: { branch: KnowledgeBranch.Military, milestoneIndex: 1 },
    to: { branch: KnowledgeBranch.NaturalPhilosophy, milestoneIndex: 2 },
    label: 'Tactical doctrine informs engineering principles',
  },
  {
    from: { branch: KnowledgeBranch.Agricultural, milestoneIndex: 1 },
    to: { branch: KnowledgeBranch.NaturalPhilosophy, milestoneIndex: 0 },
    label: 'Irrigation engineering seeds material science',
  },
  {
    from: { branch: KnowledgeBranch.Civic, milestoneIndex: 1 },
    to: { branch: KnowledgeBranch.Military, milestoneIndex: 3 },
    label: 'Provincial administration enables strategic intelligence',
  },
  {
    from: { branch: KnowledgeBranch.CulturalScholarly, milestoneIndex: 1 },
    to: { branch: KnowledgeBranch.Civic, milestoneIndex: 2 },
    label: 'Higher learning supports legal codification',
  },
  {
    from: { branch: KnowledgeBranch.MaritimeTrade, milestoneIndex: 1 },
    to: { branch: KnowledgeBranch.CulturalScholarly, milestoneIndex: 3 },
    label: 'Navigation arts enable diplomatic prestige abroad',
  },
];

// ============================================================
// Helpers
// ============================================================

export function getMilestoneDefinition(
  branch: KnowledgeBranch,
  milestoneIndex: number,
): MilestoneDefinition | undefined {
  return MILESTONE_DEFINITIONS.find(
    (m) => m.branch === branch && m.milestoneIndex === milestoneIndex,
  );
}

export function getDependenciesForNode(
  branch: KnowledgeBranch,
  milestoneIndex: number,
): CrossBranchDependency[] {
  return CROSS_BRANCH_DEPENDENCIES.filter(
    (d) =>
      (d.to.branch === branch && d.to.milestoneIndex === milestoneIndex) ||
      (d.from.branch === branch && d.from.milestoneIndex === milestoneIndex),
  );
}

// ============================================================
// Research Speed Contributor Labels
// ============================================================

export const RESEARCH_CONTRIBUTOR_LABELS = {
  base: 'Base Research',
  treasury: 'Treasury Investment',
  scholarly: 'Scholarly Order',
  infrastructure: 'Research Infrastructure',
} as const;
