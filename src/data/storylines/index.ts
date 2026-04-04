// gameplay-blueprint.md §8 — Storyline Pool Definitions
// 6 storylines: one per StorylineCategory.
// Each storyline has: opening branch → mid-arc branch → resolution branch.

import type { StorylineDefinition } from '../../engine/events/storyline-engine';
import {
  PopulationClass,
  StorylineCategory,
} from '../../engine/types';

export const STORYLINE_POOL: StorylineDefinition[] = [
  // ============================================================
  // Political — The Pretender's Claim
  // ============================================================
  {
    id: 'sl_pretenders_claim',
    category: StorylineCategory.Political,
    activationConditions: [
      { type: 'turn_min', threshold: 6 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 60 },
      { type: 'random_chance', probability: 0.4 },
    ],
    openingBranchId: 'bp_pretender_opening',
    branches: [
      {
        branchId: 'bp_pretender_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'launch_espionage_investigation',
            nextBranchId: 'bp_pretender_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'open_direct_negotiation',
            nextBranchId: 'bp_pretender_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'issue_public_condemnation',
            nextBranchId: 'bp_pretender_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_pretender_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'expose_foreign_backing',
            nextBranchId: 'bp_pretender_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'offer_minor_title',
            nextBranchId: 'bp_pretender_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'rally_loyalist_nobles',
            nextBranchId: 'bp_pretender_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_pretender_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },

  // ============================================================
  // Religious — The Prophet of the Waste
  // ============================================================
  {
    id: 'sl_prophet_of_the_waste',
    category: StorylineCategory.Religious,
    activationConditions: [
      { type: 'turn_min', threshold: 5 },
      { type: 'faith_below', threshold: 60 },
      { type: 'random_chance', probability: 0.35 },
    ],
    openingBranchId: 'bp_prophet_opening',
    branches: [
      {
        branchId: 'bp_prophet_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'send_clergy_investigation',
            nextBranchId: 'bp_prophet_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'declare_tolerance',
            nextBranchId: 'bp_prophet_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'order_suppression',
            nextBranchId: 'bp_prophet_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_prophet_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'invite_prophet_to_capital',
            nextBranchId: 'bp_prophet_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'integrate_teachings',
            nextBranchId: 'bp_prophet_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'exile_the_prophet',
            nextBranchId: 'bp_prophet_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_prophet_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },

  // ============================================================
  // Military — The Frozen March
  // ============================================================
  {
    id: 'sl_frozen_march',
    category: StorylineCategory.Military,
    activationConditions: [
      { type: 'turn_min', threshold: 4 },
      { type: 'random_chance', probability: 0.3 },
    ],
    openingBranchId: 'bp_frozen_march_opening',
    branches: [
      {
        branchId: 'bp_frozen_march_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'conduct_reconnaissance',
            nextBranchId: 'bp_frozen_march_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'dispatch_diplomatic_envoy',
            nextBranchId: 'bp_frozen_march_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'begin_military_preparation',
            nextBranchId: 'bp_frozen_march_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_frozen_march_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'fortify_mountain_passes',
            nextBranchId: 'bp_frozen_march_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'seek_allied_reinforcements',
            nextBranchId: 'bp_frozen_march_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'launch_preemptive_strike',
            nextBranchId: 'bp_frozen_march_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_frozen_march_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },

  // ============================================================
  // TradeEcon — The Merchant King
  // ============================================================
  {
    id: 'sl_merchant_king',
    category: StorylineCategory.TradeEcon,
    activationConditions: [
      { type: 'turn_min', threshold: 6 },
      { type: 'class_satisfaction_above', classTarget: PopulationClass.Merchants, threshold: 65 },
      { type: 'class_satisfaction_below', classTarget: PopulationClass.Nobility, threshold: 55 },
      { type: 'random_chance', probability: 0.4 },
    ],
    openingBranchId: 'bp_merchant_king_opening',
    branches: [
      {
        branchId: 'bp_merchant_king_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'impose_regulatory_limits',
            nextBranchId: 'bp_merchant_king_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'accept_investment_offer',
            nextBranchId: 'bp_merchant_king_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'await_and_observe',
            nextBranchId: 'bp_merchant_king_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_merchant_king_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'grant_noble_title',
            nextBranchId: 'bp_merchant_king_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'seize_merchant_assets',
            nextBranchId: 'bp_merchant_king_resolution',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'broker_merchant_noble_alliance',
            nextBranchId: 'bp_merchant_king_resolution',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_merchant_king_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },

  // ============================================================
  // Discovery — The Lost Expedition
  // ============================================================
  {
    id: 'sl_lost_expedition',
    category: StorylineCategory.Discovery,
    activationConditions: [
      { type: 'turn_min', threshold: 5 },
      { type: 'treasury_above', threshold: 350 },
      { type: 'random_chance', probability: 0.3 },
    ],
    openingBranchId: 'bp_expedition_opening',
    branches: [
      {
        branchId: 'bp_expedition_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'dispatch_rescue_party',
            nextBranchId: 'bp_expedition_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'await_further_word',
            nextBranchId: 'bp_expedition_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'send_scout_riders',
            nextBranchId: 'bp_expedition_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_expedition_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'fund_full_excavation',
            nextBranchId: 'bp_expedition_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'secure_and_document',
            nextBranchId: 'bp_expedition_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'abandon_the_site',
            nextBranchId: 'bp_expedition_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_expedition_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },

  // ============================================================
  // Cultural — The Foreign Festival
  // ============================================================
  {
    id: 'sl_foreign_festival',
    category: StorylineCategory.Cultural,
    activationConditions: [
      { type: 'turn_min', threshold: 4 },
      { type: 'treasury_above', threshold: 300 },
      { type: 'random_chance', probability: 0.35 },
    ],
    openingBranchId: 'bp_festival_opening',
    branches: [
      {
        branchId: 'bp_festival_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'embrace_cultural_exchange',
            nextBranchId: 'bp_festival_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'permit_with_restrictions',
            nextBranchId: 'bp_festival_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'restrict_foreign_practices',
            nextBranchId: 'bp_festival_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_festival_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'establish_cultural_quarter',
            nextBranchId: 'bp_festival_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'host_synthesis_festival',
            nextBranchId: 'bp_festival_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'reassert_traditional_values',
            nextBranchId: 'bp_festival_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_festival_resolution',
        isResolutionBranch: true,
        choices: [
          {
            choiceId: 'conclude_arc',
            nextBranchId: null,
            turnsUntilNextBranchPoint: 0,
          },
        ],
      },
    ],
    initialTurnsUntilFirstBranchPoint: 2,
  },
];
