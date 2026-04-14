import type { StorylineDefinition } from '../../engine/events/storyline-engine';
import { StorylineCategory } from '../../engine/types';
import { STORYLINE_ACTIVATION_PROFILES } from '../narrative-pressure/thresholds';

export const EXPANSION_STORYLINE_POOL: StorylineDefinition[] = [
  // ============================================================
  // Political 1 — The Council of Lords
  // ============================================================
  {
    id: 'sl_exp_council_of_lords',
    category: StorylineCategory.Political,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_council_of_lords'],
    openingBranchId: 'bp_council_lords_opening',
    branches: [
      {
        branchId: 'bp_council_lords_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'accept_council_proposal',
            nextBranchId: 'bp_council_lords_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'reject_and_reassert_authority',
            nextBranchId: 'bp_council_lords_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'propose_limited_advisory_body',
            nextBranchId: 'bp_council_lords_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_council_lords_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'grant_legislative_powers',
            nextBranchId: 'bp_council_lords_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'stack_council_with_loyalists',
            nextBranchId: 'bp_council_lords_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'dissolve_council_by_force',
            nextBranchId: 'bp_council_lords_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_council_lords_resolution',
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
  // Political 2 — The Foreign Bride
  // ============================================================
  {
    id: 'sl_exp_foreign_bride',
    category: StorylineCategory.Political,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_foreign_bride'],
    openingBranchId: 'bp_foreign_bride_opening',
    branches: [
      {
        branchId: 'bp_foreign_bride_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'accept_marriage_alliance',
            nextBranchId: 'bp_foreign_bride_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'negotiate_better_terms',
            nextBranchId: 'bp_foreign_bride_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'decline_and_seek_domestic_match',
            nextBranchId: 'bp_foreign_bride_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_foreign_bride_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'embrace_foreign_customs',
            nextBranchId: 'bp_foreign_bride_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'insist_on_assimilation',
            nextBranchId: 'bp_foreign_bride_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'exploit_alliance_for_trade',
            nextBranchId: 'bp_foreign_bride_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_foreign_bride_resolution',
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
  // Religious 1 — The Relic Discovery
  // ============================================================
  {
    id: 'sl_exp_relic_discovery',
    category: StorylineCategory.Religious,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_relic_discovery'],
    openingBranchId: 'bp_relic_opening',
    branches: [
      {
        branchId: 'bp_relic_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'enshrine_in_cathedral',
            nextBranchId: 'bp_relic_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'submit_to_scholarly_study',
            nextBranchId: 'bp_relic_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'auction_to_highest_bidder',
            nextBranchId: 'bp_relic_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_relic_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'declare_miraculous_origin',
            nextBranchId: 'bp_relic_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'share_relic_with_neighbor',
            nextBranchId: 'bp_relic_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'suppress_competing_claims',
            nextBranchId: 'bp_relic_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_relic_resolution',
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
  // Religious 2 — The Witch Trials
  // ============================================================
  {
    id: 'sl_exp_witch_trials',
    category: StorylineCategory.Religious,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_witch_trials'],
    openingBranchId: 'bp_witch_trials_opening',
    branches: [
      {
        branchId: 'bp_witch_trials_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'authorize_inquisition',
            nextBranchId: 'bp_witch_trials_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'demand_evidence_standards',
            nextBranchId: 'bp_witch_trials_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'dismiss_accusations_outright',
            nextBranchId: 'bp_witch_trials_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_witch_trials_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'expand_trials_to_nobility',
            nextBranchId: 'bp_witch_trials_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'pardon_the_accused',
            nextBranchId: 'bp_witch_trials_resolution',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'redirect_fervor_outward',
            nextBranchId: 'bp_witch_trials_resolution',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_witch_trials_resolution',
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
  // Military 1 — The Mercenary Company
  // ============================================================
  {
    id: 'sl_exp_mercenary_company',
    category: StorylineCategory.Military,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_mercenary_company'],
    openingBranchId: 'bp_mercenary_opening',
    branches: [
      {
        branchId: 'bp_mercenary_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'hire_full_company',
            nextBranchId: 'bp_mercenary_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'hire_select_specialists',
            nextBranchId: 'bp_mercenary_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'turn_mercenaries_away',
            nextBranchId: 'bp_mercenary_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_mercenary_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'integrate_into_standing_army',
            nextBranchId: 'bp_mercenary_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'deploy_to_border_garrison',
            nextBranchId: 'bp_mercenary_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'terminate_contract_early',
            nextBranchId: 'bp_mercenary_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_mercenary_resolution',
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
  // Military 2 — The Veterans' March
  // ============================================================
  {
    id: 'sl_exp_veterans_march',
    category: StorylineCategory.Military,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_veterans_march'],
    openingBranchId: 'bp_veterans_opening',
    branches: [
      {
        branchId: 'bp_veterans_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'grant_veteran_pensions',
            nextBranchId: 'bp_veterans_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'offer_land_grants',
            nextBranchId: 'bp_veterans_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'disperse_the_march',
            nextBranchId: 'bp_veterans_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_veterans_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'establish_veterans_guild',
            nextBranchId: 'bp_veterans_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'conscript_into_civic_works',
            nextBranchId: 'bp_veterans_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'suppress_veteran_leaders',
            nextBranchId: 'bp_veterans_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_veterans_resolution',
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
  // TradeEcon 1 — The Silk Road
  // ============================================================
  {
    id: 'sl_exp_silk_road',
    category: StorylineCategory.TradeEcon,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_silk_road'],
    openingBranchId: 'bp_silk_road_opening',
    branches: [
      {
        branchId: 'bp_silk_road_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'fund_royal_trade_expedition',
            nextBranchId: 'bp_silk_road_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'charter_merchant_venture',
            nextBranchId: 'bp_silk_road_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'decline_route_proposal',
            nextBranchId: 'bp_silk_road_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_silk_road_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'build_caravanserai_network',
            nextBranchId: 'bp_silk_road_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'impose_trade_tariffs',
            nextBranchId: 'bp_silk_road_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'militarize_the_route',
            nextBranchId: 'bp_silk_road_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_silk_road_resolution',
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
  // TradeEcon 2 — The Currency Crisis
  // ============================================================
  {
    id: 'sl_exp_currency_crisis',
    category: StorylineCategory.TradeEcon,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_currency_crisis'],
    openingBranchId: 'bp_currency_opening',
    branches: [
      {
        branchId: 'bp_currency_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'ban_foreign_coinage',
            nextBranchId: 'bp_currency_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'mint_new_royal_currency',
            nextBranchId: 'bp_currency_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'allow_market_correction',
            nextBranchId: 'bp_currency_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_currency_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'establish_royal_exchange',
            nextBranchId: 'bp_currency_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'seize_foreign_merchant_reserves',
            nextBranchId: 'bp_currency_resolution',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'negotiate_currency_treaty',
            nextBranchId: 'bp_currency_resolution',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_currency_resolution',
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
  // Discovery 1 — The Ancient Library
  // ============================================================
  {
    id: 'sl_exp_ancient_library',
    category: StorylineCategory.Discovery,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_ancient_library'],
    openingBranchId: 'bp_library_opening',
    branches: [
      {
        branchId: 'bp_library_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'fund_full_excavation_library',
            nextBranchId: 'bp_library_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'send_scholars_quietly',
            nextBranchId: 'bp_library_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'seal_the_site',
            nextBranchId: 'bp_library_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_library_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'publish_findings_openly',
            nextBranchId: 'bp_library_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'restrict_to_royal_scholars',
            nextBranchId: 'bp_library_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'weaponize_lost_knowledge',
            nextBranchId: 'bp_library_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_library_resolution',
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
  // Discovery 2 — The Cartographers' Guild
  // ============================================================
  {
    id: 'sl_exp_cartographers_guild',
    category: StorylineCategory.Discovery,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_cartographers_guild'],
    openingBranchId: 'bp_cartographers_opening',
    branches: [
      {
        branchId: 'bp_cartographers_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'sponsor_mapping_expedition',
            nextBranchId: 'bp_cartographers_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'claim_territory_by_decree',
            nextBranchId: 'bp_cartographers_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'sell_maps_to_merchants',
            nextBranchId: 'bp_cartographers_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_cartographers_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'establish_frontier_outpost',
            nextBranchId: 'bp_cartographers_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'negotiate_shared_borders',
            nextBranchId: 'bp_cartographers_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'fortify_and_annex',
            nextBranchId: 'bp_cartographers_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_cartographers_resolution',
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
  // Cultural 1 — The Bards' Rebellion
  // ============================================================
  {
    id: 'sl_exp_bards_rebellion',
    category: StorylineCategory.Cultural,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_bards_rebellion'],
    openingBranchId: 'bp_bards_opening',
    branches: [
      {
        branchId: 'bp_bards_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'ban_seditious_songs',
            nextBranchId: 'bp_bards_mid',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'commission_counter_ballads',
            nextBranchId: 'bp_bards_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'invite_bards_to_court',
            nextBranchId: 'bp_bards_mid',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_bards_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'establish_royal_theater',
            nextBranchId: 'bp_bards_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'arrest_ringleaders',
            nextBranchId: 'bp_bards_resolution',
            turnsUntilNextBranchPoint: 2,
          },
          {
            choiceId: 'channel_into_reform_movement',
            nextBranchId: 'bp_bards_resolution',
            turnsUntilNextBranchPoint: 3,
          },
        ],
      },
      {
        branchId: 'bp_bards_resolution',
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
  // Cultural 2 — The Builder's Vision
  // ============================================================
  {
    id: 'sl_exp_builders_vision',
    category: StorylineCategory.Cultural,
    activationProfile: STORYLINE_ACTIVATION_PROFILES['sl_exp_builders_vision'],
    openingBranchId: 'bp_builders_opening',
    branches: [
      {
        branchId: 'bp_builders_opening',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'approve_grand_monument',
            nextBranchId: 'bp_builders_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'redirect_to_infrastructure',
            nextBranchId: 'bp_builders_mid',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'reject_as_vanity_project',
            nextBranchId: 'bp_builders_mid',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_builders_mid',
        isResolutionBranch: false,
        choices: [
          {
            choiceId: 'expand_scope_with_foreign_artisans',
            nextBranchId: 'bp_builders_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'scale_back_to_essentials',
            nextBranchId: 'bp_builders_resolution',
            turnsUntilNextBranchPoint: 3,
          },
          {
            choiceId: 'conscript_labor_force',
            nextBranchId: 'bp_builders_resolution',
            turnsUntilNextBranchPoint: 2,
          },
        ],
      },
      {
        branchId: 'bp_builders_resolution',
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
