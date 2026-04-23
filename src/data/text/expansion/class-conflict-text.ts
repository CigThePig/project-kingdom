import type { EventTextEntry } from '../events';

export const EXPANSION_CLASS_CONFLICT_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Tax Burden Dispute
  // ============================================================
  evt_exp_cc_tax_burden_dispute: {
    title: 'Tax Burden Falls Unevenly',
    body: 'Commoner petitioners have gathered at the castle gates, protesting that the kingdom\'s tax burden falls almost entirely upon those least able to bear it. The nobility\'s ancient exemptions, they argue, leave common folk crushed under levies that the wealthy never pay. Several noble houses have already dispatched envoys warning against any alteration of their chartered privileges.',
    choices: {
      redistribute_tax_burden: 'Redistribute the Tax Burden',
      maintain_noble_exemptions: 'Maintain Noble Exemptions',
      commission_tax_review: 'Commission a Tax Review',
    },
  },

  // ============================================================
  // 2. Usury Accusation
  // ============================================================
  evt_exp_cc_usury_accusation: {
    title: 'Clergy Accuse Merchants of Usury',
    body: 'The high clergy have publicly denounced several prominent moneylenders for charging interest rates that violate sacred teachings on just commerce. The accused merchants counter that without flexible lending, trade will wither and the kingdom\'s coffers will suffer. The matter has drawn sharp lines between the faithful and the commercially minded.',
    choices: {
      enforce_usury_laws: 'Enforce Usury Laws',
      protect_lending_practices: 'Protect Lending Practices',
      appoint_arbitration_panel: 'Appoint an Arbitration Panel',
    },
  },

  // ============================================================
  // 3. Military Privilege Demand
  // ============================================================
  evt_exp_cc_military_privilege_demand: {
    title: 'Military Caste Demands Landed Privileges',
    body: 'Officers of the military caste have presented a formal petition demanding estates and hereditary privileges comparable to those held by the nobility. They argue that those who shed blood for the crown deserve standing equal to those who merely inherited it. The nobility views this as a brazen assault on the ancient order of precedence.',
    choices: {
      grant_military_estates: 'Grant Military Estates',
      offer_honorary_titles: 'Offer Honorary Titles',
      refuse_special_treatment: 'Refuse Special Treatment',
    },
  },

  // ============================================================
  // 4. Inter-Class Marriage
  // ============================================================
  evt_exp_cc_interclass_marriage: {
    title: 'Inter-Class Marriage Stirs Debate',
    body: 'A prominent noble heir has announced betrothal to a commoner of considerable reputation but no title. The match has become the talk of every court and tavern alike, with some hailing it as a sign of progress and others decrying it as an erosion of bloodline traditions.',
    choices: {
      bless_the_union: 'Bless the Union',
      discourage_precedent: 'Discourage the Precedent',
    },
  },

  // ============================================================
  // 5. Guild vs Nobility Power Struggle
  // ============================================================
  evt_exp_cc_guild_noble_power_struggle: {
    title: 'Guild Masters Challenge Noble Authority',
    body: 'The wealthiest guild masters have begun openly defying noble prerogatives, refusing to pay traditional levies and demanding seats on the royal council. They command enough coin to hire their own guards and enough trade influence to cripple {region}. The nobility warns that yielding to merchants will unravel the very fabric of our governance.',
    choices: {
      curtail_guild_influence: 'Curtail Guild Influence',
      formalize_guild_seats: 'Formalize Guild Council Seats',
      play_factions_against_each_other: 'Play Factions Against Each Other',
    },
  },

  // ============================================================
  // 6. Commoner Envy
  // ============================================================
  evt_exp_cc_commoner_envy: {
    title: 'Resentment of Merchant Wealth Grows',
    body: 'As merchant houses erect ever-grander townhouses and host lavish feasts, common laborers who can barely afford bread have grown openly hostile. Incidents of vandalism against merchant properties are increasing, and pamphlets circulating in the lower quarters demand the crown address the widening gulf between rich and poor.',
    choices: {
      impose_wealth_tithe: 'Impose a Wealth Tithe',
      fund_public_works: 'Fund Public Works',
      dismiss_grievances: 'Dismiss the Grievances',
    },
  },

  // ============================================================
  // 7. Clerical Overreach
  // ============================================================
  evt_exp_cc_clerical_overreach: {
    title: 'Church Claims Expanded Tithe Rights',
    body: 'Emboldened by rising piety across our lands, the high clergy have announced that church tithes will henceforth apply to lands previously held exempt by secular tradition. Commoner farmers and lesser nobles alike protest across {region} that the church already holds vast estates and should not be permitted to extract yet more from those who work the soil.',
    choices: {
      limit_church_holdings: 'Limit Church Holdings',
      sanction_expanded_tithes: 'Sanction Expanded Tithes',
      negotiate_boundaries: 'Negotiate Boundaries',
    },
  },

  // ============================================================
  // 8. Justice Inequality
  // ============================================================
  evt_exp_cc_justice_inequality: {
    title: 'Commoners Decry Unequal Justice',
    body: 'A commoner convicted of theft received a harsh public sentence, while a nobleman accused of a far graver offense was quietly pardoned by his peers in a closed tribunal. Word has spread quickly, and the disparity has become a rallying cry for those who believe the kingdom\'s courts serve only the privileged.',
    choices: {
      establish_equal_courts: 'Establish Equal Courts',
      uphold_traditional_courts: 'Uphold Traditional Courts',
      create_appellate_process: 'Create an Appellate Process',
    },
  },

  // ============================================================
  // 9. Social Mobility Demands
  // ============================================================
  evt_exp_cc_social_mobility_demands: {
    title: 'Demands for Social Advancement Escalate',
    body: 'A coalition of commoner leaders, guild apprentices, and low-ranking soldiers across {region} has presented a manifesto demanding that birth no longer determine one\'s station. They call for merit-based appointments to all offices of consequence. The nobility and senior clergy have closed ranks, warning that such upheaval would throw our ancient order into chaos.',
    choices: {
      open_ranks_to_merit: 'Open All Ranks to Merit',
      create_advancement_paths: 'Create Advancement Paths',
      reaffirm_social_order: 'Reaffirm the Social Order',
    },
  },

  // ============================================================
  // 10. Land Ownership Dispute
  // ============================================================
  evt_exp_cc_land_ownership_dispute: {
    title: 'Disputed Land Claims Threaten Peace',
    body: 'Several noble houses have invoked ancient charters to claim common grazing lands across {region} that village communities have used for generations. The commoners possess no written deeds but point to unbroken tradition. With planting season approaching, the matter cannot wait — whoever controls the land will control the harvest.',
    choices: {
      redistribute_crown_lands: 'Redistribute Crown Lands',
      enforce_existing_deeds: 'Enforce Existing Deeds',
      establish_tenant_protections: 'Establish Tenant Protections',
    },
  },

  // ============================================================
  // 11. Merchant-Military War Costs
  // ============================================================
  evt_exp_cc_merchant_military_war_costs: {
    title: 'Merchants Protest Military Expenditures',
    body: 'The merchant guild has submitted a formal grievance that the kingdom\'s military buildup is strangling commerce. Wartime requisitions consume goods that could be traded abroad, and road tolls to fund border patrols are cutting into profit margins. The military caste argues that without a strong army, the merchants would have no roads to trade upon at all.',
    choices: {
      reduce_military_spending: 'Reduce Military Spending',
      levy_war_commerce_tax: 'Levy a War Commerce Tax',
      acknowledge_both_concerns: 'Acknowledge Both Concerns',
    },
  },

  // ============================================================
  // 12. Labor Rights
  // ============================================================
  evt_exp_cc_labor_rights: {
    title: 'Labor Rights Movement Emerges',
    body: 'Workers in the kingdom\'s towns and mines have begun organizing, demanding limits on working hours, fair wages, and protection from arbitrary dismissal by their noble and merchant employers. Sympathizers among the clergy speak of the dignity of labor, while landowners warn that concessions will breed idleness and ruin productivity.',
    choices: {
      grant_labor_protections: 'Grant Labor Protections',
      enforce_work_obligations: 'Enforce Work Obligations',
      defer_to_local_lords: 'Defer to Local Lords',
    },
  },

  // ============================================================
  // 13. Privilege Reform
  // ============================================================
  evt_exp_cc_privilege_reform: {
    title: 'Mass Petition Demands Privilege Reform',
    body: 'Thousands of commoners across {region} have signed a petition delivered to the throne, demanding the abolition of hereditary exemptions from taxation, military service, and judicial accountability. The document names specific noble and clerical privileges it considers unjust. The country holds its breath, for the crown\'s response will define a generation.',
    choices: {
      enact_sweeping_reforms: 'Enact Sweeping Reforms',
      offer_token_concessions: 'Offer Token Concessions',
      suppress_reform_movement: 'Suppress the Reform Movement',
    },
  },

  // ============================================================
  // 14. Harvest Tithe Resentment
  // ============================================================
  evt_exp_cc_harvest_tithe_resentment: {
    title: 'Harvest Tithes Draw Grumbling',
    body: 'As the autumn harvest is gathered, peasant communities are voicing quiet but persistent resentment over the portion claimed by church and crown alike. With granaries not yet full from a modest season, every bushel surrendered to the tithe collector is felt keenly at the family table.',
    choices: {
      reduce_harvest_tithe: 'Reduce the Harvest Tithe',
      hold_tithe_steady: 'Hold the Tithe Steady',
    },
  },
};
