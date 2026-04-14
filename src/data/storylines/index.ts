// gameplay-blueprint.md §8 — Storyline Pool Definitions
// 12 storylines across 6 categories.
// Each storyline has: opening branch → mid-arc branch → resolution branch.
// Activation is now driven by the narrative pressure system (activationProfile).

import type { StorylineDefinition } from '../../engine/events/storyline-engine';
import {
  StorylineCategory,
} from '../../engine/types';
import { STORYLINE_ACTIVATION_PROFILES } from '../narrative-pressure/thresholds';
import { EXPANSION_STORYLINE_POOL } from './expansion-storylines';

export const STORYLINE_POOL: StorylineDefinition[] = [
  // ============================================================
  // Political — The Pretender's Claim
  // ============================================================
  {
    id: 'sl_pretenders_claim',
    category: StorylineCategory.Political,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_pretenders_claim'],
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
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_prophet_of_the_waste'],
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
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_frozen_march'],
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
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_merchant_king'],
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
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_lost_expedition'],
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
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_foreign_festival'],
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

  // ============================================================
  // TradeEcon 2 — The Merchant's Rebellion
  // ============================================================
  {
    id: 'sl_merchants_rebellion',
    category: StorylineCategory.TradeEcon,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_merchants_rebellion'],
    openingBranchId: 'bp_rebellion_opening',
    branches: [
      {
        branchId: 'bp_rebellion_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'negotiate_guild_charter',
            nextBranchId: 'bp_rebellion_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'crush_the_guild',
            nextBranchId: 'bp_rebellion_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'co_opt_guild_leaders',
            nextBranchId: 'bp_rebellion_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_rebellion_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'grant_trade_monopoly',
            nextBranchId: 'bp_rebellion_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'impose_royal_oversight',
            nextBranchId: 'bp_rebellion_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'pit_factions_against_each_other',
            nextBranchId: 'bp_rebellion_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_rebellion_resolution',
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
  // Religious 2 — The Holy War
  // ============================================================
  {
    id: 'sl_holy_war',
    category: StorylineCategory.Religious,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_holy_war'],
    openingBranchId: 'bp_holy_war_opening',
    branches: [
      {
        branchId: 'bp_holy_war_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'defensive_stance',
            nextBranchId: 'bp_holy_war_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'launch_counter_crusade',
            nextBranchId: 'bp_holy_war_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'seek_diplomatic_peace',
            nextBranchId: 'bp_holy_war_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_holy_war_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'rally_faithful_defenders',
            nextBranchId: 'bp_holy_war_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'forge_interfaith_alliance',
            nextBranchId: 'bp_holy_war_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'scorched_earth_defense',
            nextBranchId: 'bp_holy_war_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_holy_war_resolution',
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
  // Political 2 — The Prodigal Prince
  // ============================================================
  {
    id: 'sl_prodigal_prince',
    category: StorylineCategory.Political,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_prodigal_prince'],
    openingBranchId: 'bp_prince_opening',
    branches: [
      {
        branchId: 'bp_prince_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'welcome_with_caution',
            nextBranchId: 'bp_prince_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'investigate_claims',
            nextBranchId: 'bp_prince_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'denounce_as_impostor',
            nextBranchId: 'bp_prince_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_prince_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'offer_advisory_role',
            nextBranchId: 'bp_prince_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'confront_foreign_backers',
            nextBranchId: 'bp_prince_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'appeal_to_popular_opinion',
            nextBranchId: 'bp_prince_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_prince_resolution',
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
  // Discovery 2 — The Plague Ships
  // ============================================================
  {
    id: 'sl_plague_ships',
    category: StorylineCategory.Discovery,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_plague_ships'],
    openingBranchId: 'bp_plague_ships_opening',
    branches: [
      {
        branchId: 'bp_plague_ships_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'quarantine_the_harbor',
            nextBranchId: 'bp_plague_ships_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'accept_the_cargo',
            nextBranchId: 'bp_plague_ships_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'burn_the_ships',
            nextBranchId: 'bp_plague_ships_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_plague_ships_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'isolate_and_treat',
            nextBranchId: 'bp_plague_ships_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'distribute_remedies',
            nextBranchId: 'bp_plague_ships_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'sacrifice_the_district',
            nextBranchId: 'bp_plague_ships_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_plague_ships_resolution',
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
  // Military 2 — The Great Tournament
  // ============================================================
  {
    id: 'sl_great_tournament',
    category: StorylineCategory.Military,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_great_tournament'],
    openingBranchId: 'bp_tournament_opening',
    branches: [
      {
        branchId: 'bp_tournament_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'diplomatic_showcase',
            nextBranchId: 'bp_tournament_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'military_demonstration',
            nextBranchId: 'bp_tournament_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'cultural_celebration',
            nextBranchId: 'bp_tournament_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_tournament_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'exploit_diplomatic_moment',
            nextBranchId: 'bp_tournament_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'handle_tournament_incident',
            nextBranchId: 'bp_tournament_resolution',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'host_grand_feast',
            nextBranchId: 'bp_tournament_resolution',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_tournament_resolution',
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
  // Cultural 2 — The Starving Winter
  // ============================================================
  {
    id: 'sl_starving_winter',
    category: StorylineCategory.Cultural,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_starving_winter'],
    openingBranchId: 'bp_winter_opening',
    branches: [
      {
        branchId: 'bp_winter_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'ration_harshly',
            nextBranchId: 'bp_winter_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'seek_foreign_aid',
            nextBranchId: 'bp_winter_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'sacrifice_military_stores',
            nextBranchId: 'bp_winter_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_winter_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'manage_refugee_crisis',
            nextBranchId: 'bp_winter_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'tax_the_wealthy',
            nextBranchId: 'bp_winter_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'abandon_outer_settlements',
            nextBranchId: 'bp_winter_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_winter_resolution',
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

  // Expansion Storylines
  ...EXPANSION_STORYLINE_POOL,
];
