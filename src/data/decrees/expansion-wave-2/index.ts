// Phase 7 — Wave-2 Decrees.
//
// Two new decrees occupying themes the design doc lists for this phase:
// formal codification of weights & measures, and the founding charter of a
// university. Same `DecreeDefinition` shape as the rest of `DECREE_POOL`.

import type { DecreeDefinition } from '../index';
import {
  DecreeCategory,
  PopulationClass,
  ResourceType,
} from '../../../engine/types';

export const EXPANSION_WAVE_2_DECREES: DecreeDefinition[] = [
  {
    id: 'decree_w2_weights_and_measures',
    title: 'Standardize Weights and Measures',
    category: DecreeCategory.Economic,
    slotCost: 1,
    resourceCosts: { [ResourceType.Iron]: 5 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Merchants, PopulationClass.Commoners],
    effectPreview:
      'Impose royal standards on every market scale and grain bushel. Trade smooths; old guild fees lose their bite.',
    isHighImpact: false,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 3,
    statePrerequisites: null,
  },
  {
    id: 'decree_w2_university_charter',
    title: 'Charter a Royal University',
    category: DecreeCategory.Civic,
    slotCost: 2,
    resourceCosts: { [ResourceType.Stone]: 20, [ResourceType.Wood]: 15 },
    prerequisites: [],
    affectedClasses: [PopulationClass.Clergy, PopulationClass.Nobility],
    effectPreview:
      'Grant a chartered university the right to teach the seven liberal arts. A long investment in scholars and statecraft.',
    isHighImpact: true,
    knowledgePrerequisite: null,
    isRepeatable: false,
    cooldownTurns: 0,
    previousTierDecreeId: null,
    chainId: null,
    tier: 1,
    turnMinimum: 8,
    statePrerequisites: [{ type: 'stability_above', threshold: 40 }],
  },
];
