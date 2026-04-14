import type { EventTextEntry } from '../events';

export const EXPANSION_FOLLOWUP_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Economy Follow-ups
  // ============================================================
  evt_exp_fu_eco_price_control_backlash: {
    title: 'Merchants Chafe Under Price Controls',
    body: 'The price controls have stabilized markets for consumers, but merchants are struggling. Several prominent traders threaten to relocate their operations to neighboring realms unless the restrictions are eased.',
    choices: {
      enforce_strictly: 'Enforce the Controls Strictly',
      relax_controls: 'Relax the Controls',
    },
  },
  evt_exp_fu_eco_guild_resentment: {
    title: 'Guild Resentment Simmers',
    body: 'The guild members who lost the dispute continue to grumble. Their resentment has begun to affect trade, as they slow-walk contracts and withhold cooperation. A gesture of goodwill might restore productivity.',
    choices: {
      offer_concessions_to_new_guild: 'Offer Concessions',
      maintain_current_stance: 'Maintain Current Stance',
    },
  },
  evt_exp_fu_eco_smuggler_revenge: {
    title: 'Smugglers Strike Back',
    body: 'The dismantled smuggling ring has not gone quietly. Reports indicate sabotage of legitimate trade shipments and intimidation of merchants who cooperated with the crown\'s investigation. The threat persists.',
    choices: {
      increase_guard_patrols: 'Increase Guard Patrols',
      offer_amnesty: 'Offer Amnesty to Informants',
    },
  },
  evt_exp_fu_eco_tax_compromise_fallout: {
    title: 'Tax Compromise Under Review',
    body: 'The tax compromise negotiated during the revolt has taken effect. Revenue has stabilized, though some officials question whether the concessions were too generous. The agreement could be revisited.',
    choices: {
      honor_the_agreement: 'Honor the Agreement',
      renegotiate_terms: 'Renegotiate the Terms',
    },
  },
  evt_exp_fu_eco_bailout_resentment: {
    title: 'Public Anger Over Bailout',
    body: 'Word of the lender bailout has spread among the common folk. They see wealthy money-changers rescued by the crown while ordinary people struggle. Protests have begun in the market squares.',
    choices: {
      address_public_anger: 'Address Public Anger',
      defend_the_decision: 'Defend the Decision',
    },
  },

  // ============================================================
  // Food Follow-ups
  // ============================================================
  evt_exp_fu_food_granary_shortage: {
    title: 'Granary Reserves Dangerously Low',
    body: 'The destruction of contaminated grain stores has left reserves at critically low levels. With the next harvest still months away, the kingdom faces a difficult period of scarcity unless supplies are secured from abroad.',
    choices: {
      import_emergency_grain: 'Import Emergency Grain',
      tighten_rationing: 'Tighten Rationing',
    },
  },
  evt_exp_fu_food_overfishing: {
    title: 'Coastal Waters Depleted',
    body: 'The fishing boom has been too successful. Fishermen report dwindling catches and smaller fish, suggesting the coastal waters are being overfished. Unless limits are imposed, the fishery may collapse entirely.',
    choices: {
      impose_fishing_limits: 'Impose Fishing Limits',
      continue_unrestricted: 'Continue Unrestricted',
    },
  },
  evt_exp_fu_food_feast_aftermath: {
    title: 'Memories of the Feast Linger',
    body: 'The grand harvest feast has become a cherished memory among the people. Ballads about the celebration have spread through the taverns, and morale in the countryside remains high.',
    choices: {
      acknowledge: 'Acknowledge the Good News',
    },
  },
  evt_exp_fu_food_quarantine_success: {
    title: 'Quarantine Proves Effective',
    body: 'The livestock quarantine has contained the plague. Surviving herds are recovering, and preliminary reports suggest the breeding stock is sufficient to rebuild within a few seasons.',
    choices: {
      acknowledge: 'Acknowledge the Recovery',
    },
  },

  // ============================================================
  // Military Follow-ups
  // ============================================================
  evt_exp_fu_mil_amnesty_returns: {
    title: 'Deserters Return Under Amnesty',
    body: 'The amnesty offer has brought hundreds of deserters back to the ranks. Their return bolsters numbers, but veteran soldiers view them with contempt. Integration will require careful management.',
    choices: {
      reintegrate_fully: 'Reintegrate into Regular Units',
      assign_to_labor_battalions: 'Assign to Labor Battalions',
    },
  },
  evt_exp_fu_mil_arms_breakthrough: {
    title: 'Weapons Research Bears Fruit',
    body: 'The investment in superior weapons has yielded a breakthrough — new alloys that produce stronger blades and more resilient armor. The question now is whether to produce these weapons en masse or keep them as an elite advantage.',
    choices: {
      mass_produce_weapons: 'Mass Produce the New Weapons',
      keep_as_elite_reserve: 'Keep as Elite Reserve',
    },
  },
  evt_exp_fu_mil_fortress_garrison: {
    title: 'Border Fortresses Manned',
    body: 'The newly constructed border fortresses have been garrisoned and provisioned. Their presence has already deterred several incursions, and local villages report feeling safer than they have in years.',
    choices: {
      acknowledge: 'Acknowledge the Report',
    },
  },
  evt_exp_fu_mil_peace_dividend: {
    title: 'Peace Brings Opportunities',
    body: 'The peace settlement has freed up military resources and reduced the burden on the treasury. The kingdom now has an opportunity to invest these savings in recovery or set them aside for future needs.',
    choices: {
      invest_in_recovery: 'Invest in Recovery',
      save_for_future_conflicts: 'Save for Future Conflicts',
    },
  },
  evt_exp_fu_mil_parade_recruitment: {
    title: 'Recruitment Surge After Parade',
    body: 'The grand military review has inspired a wave of young recruits eager to serve. Recruiting stations report their highest numbers in years, and morale throughout the ranks is lifted.',
    choices: {
      acknowledge: 'Acknowledge the Report',
    },
  },

  // ============================================================
  // Diplomacy Follow-ups
  // ============================================================
  evt_exp_fu_dip_trade_profits: {
    title: 'Trade Agreement Yields Profits',
    body: 'The trade agreement with Valdris has begun to generate returns. Merchant caravans move freely along the new routes, and tariff revenues have exceeded expectations. The treasury benefits.',
    choices: {
      acknowledge: 'Acknowledge the Profits',
    },
  },
  evt_exp_fu_dip_apology_accepted: {
    title: 'Arenthal Accepts Our Apology',
    body: 'The formal apology has been well received by the Arenthal court. Their ambassador reports a willingness to move past the incident and explore closer cooperation. An opportunity for a fresh start.',
    choices: {
      propose_new_treaty: 'Propose a New Treaty',
      accept_restoration: 'Accept the Restored Relations',
    },
  },
  evt_exp_fu_dip_refugee_integration: {
    title: 'Refugees Seek Permanent Settlement',
    body: 'The refugees welcomed into the kingdom are settling in and beginning to establish themselves. Some locals grumble about competition for work and housing, while others appreciate the newcomers\' industriousness.',
    choices: {
      provide_settlement_aid: 'Provide Settlement Aid',
      let_refugees_self_organize: 'Let Refugees Self-Organize',
    },
  },
  evt_exp_fu_dip_alliance_first_test: {
    title: 'Alliance Put to the Test',
    body: 'Valdris has invoked the mutual defense alliance, requesting military support against a border threat. The alliance was meant for just such occasions, but the cost and risk of intervention are real. Our response will define the alliance\'s value.',
    choices: {
      honor_alliance_obligations: 'Honor Our Obligations',
      find_diplomatic_excuse: 'Find a Diplomatic Excuse',
      delay_response: 'Delay Our Response',
    },
  },
  evt_exp_fu_dip_reparation_partial: {
    title: 'Arenthal Offers Partial Reparations',
    body: 'Arenthal has responded to the reparation demands with a partial payment — roughly half of what was demanded. Their envoy insists this is all they can afford, though our spies suggest otherwise.',
    choices: {
      accept_partial_payment: 'Accept the Partial Payment',
      insist_on_full_amount: 'Insist on the Full Amount',
    },
  },

  // ============================================================
  // Environment Follow-ups
  // ============================================================
  evt_exp_fu_env_levee_success: {
    title: 'Levees Hold Against Spring Floods',
    body: 'The new levees and dams have been tested by the spring rains and held firm. The river valley that was devastated last season has been spared, and farmers are planting with renewed confidence.',
    choices: {
      acknowledge: 'Acknowledge the Success',
    },
  },
  evt_exp_fu_env_fire_recovery: {
    title: 'Burned Lands Await Decision',
    body: 'The wildfire has passed, leaving a swath of charred landscape. The land will recover, but the crown must decide how — replanting the forest, converting the cleared ground to farmland, or simply letting nature take its course.',
    choices: {
      replant_forest: 'Replant the Forest',
      convert_to_farmland: 'Convert to Farmland',
      let_nature_recover: 'Let Nature Recover',
    },
  },
  evt_exp_fu_env_mine_reopening: {
    title: 'Mine Ready to Reopen',
    body: 'Safety improvements at the collapsed mine are complete, and the engineers have declared the site ready for operations. The workers are eager to return, though some families still fear another collapse.',
    choices: {
      resume_full_operations: 'Resume Full Operations',
      maintain_reduced_output: 'Maintain Reduced Output',
    },
  },
  evt_exp_fu_env_logging_ban_impact: {
    title: 'Logging Ban Hits Livelihoods',
    body: 'The logging ban has protected the forests, but the loggers and their families are suffering. Unemployment has risen in timber-dependent villages, and there are calls for compensation or alternative employment.',
    choices: {
      compensate_loggers: 'Compensate the Loggers',
      hold_firm_on_ban: 'Hold Firm on the Ban',
    },
  },
  evt_exp_fu_env_mining_wealth: {
    title: 'New Mine Produces Riches',
    body: 'The crown mining operation at the newly discovered vein is producing excellent yields. Iron and copper flow into the treasury, and the surrounding region is beginning to develop around the mining settlement.',
    choices: {
      acknowledge: 'Acknowledge the Report',
    },
  },

  // ============================================================
  // PublicOrder Follow-ups
  // ============================================================
  evt_exp_fu_po_gang_driven_underground: {
    title: 'Gangs Driven Underground',
    body: 'The city watch deployment has pushed the street gangs underground, but they have not been eliminated. Criminal activity continues in the shadows, and the watch commander requests continued funding to maintain pressure.',
    choices: {
      maintain_patrols: 'Maintain the Patrols',
      declare_victory: 'Declare Victory and Stand Down',
    },
  },
  evt_exp_fu_po_prison_complete: {
    title: 'New Prison Opens',
    body: 'The new prison facility has been completed and is now accepting prisoners. The overcrowding crisis has eased, and the courts can once again sentence offenders without concern for capacity.',
    choices: {
      acknowledge: 'Acknowledge the Completion',
    },
  },
  evt_exp_fu_po_militia_overreach: {
    title: 'Citizen Militia Oversteps',
    body: 'The legalized citizen militia has begun exceeding its mandate. Reports of rough justice, settling of personal grudges, and intimidation of merchants have reached the crown. The militia\'s supporters defend their actions as necessary.',
    choices: {
      rein_in_militia: 'Rein in the Militia',
      look_the_other_way: 'Look the Other Way',
    },
  },
  evt_exp_fu_po_martial_law_tension: {
    title: 'Martial Law Wears Thin',
    body: 'The martial law imposed after the riots has restored order, but the population grows increasingly restive under military rule. Soldiers patrol the streets, a curfew remains in effect, and resentment builds daily.',
    choices: {
      lift_martial_law: 'Lift Martial Law',
      extend_martial_law: 'Extend Martial Law',
    },
  },
  evt_exp_fu_po_purge_aftermath: {
    title: 'Vacancies After the Purge',
    body: 'The corruption purge has left numerous positions in the administration vacant. The crown must decide whether to fill them with reform-minded newcomers or restore the chastened old guard who know the systems best.',
    choices: {
      appoint_reformers: 'Appoint Reformers',
      restore_old_officials: 'Restore Old Officials',
    },
  },

  // ============================================================
  // Religion Follow-ups
  // ============================================================
  evt_exp_fu_rel_pilgrimage_boom: {
    title: 'Pilgrims Flood the Kingdom',
    body: 'The crown\'s endorsement of the miracle has triggered an influx of pilgrims. Roads are crowded, inns are overflowing, and local merchants are thriving — but the infrastructure is straining under the demand.',
    choices: {
      build_pilgrim_infrastructure: 'Build Pilgrim Infrastructure',
      let_pilgrims_come_naturally: 'Let Pilgrims Come Naturally',
    },
  },
  evt_exp_fu_rel_underground_copies: {
    title: 'Heretical Texts Circulate Underground',
    body: 'Despite the suppression order, copies of the heretical texts have been found circulating in secret among scholars and curious commoners. The ideas contained within are spreading beyond the crown\'s ability to control.',
    choices: {
      intensify_censorship: 'Intensify Censorship',
      accept_inevitable_spread: 'Accept the Inevitable Spread',
    },
  },
  evt_exp_fu_rel_temple_consecration: {
    title: 'Grand Temple Consecrated',
    body: 'The crown-funded temple has been completed and consecrated in a grand ceremony attended by thousands. It stands as a monument to the kingdom\'s devotion and a source of pride for clergy and commoners alike.',
    choices: {
      acknowledge: 'Acknowledge the Consecration',
    },
  },
  evt_exp_fu_rel_clergy_reform: {
    title: 'Clergy Awaits New Leadership',
    body: 'The investigation into clerical corruption has resulted in the removal of several senior clergy. The vacant positions must now be filled, and the choice between reformists and traditionalists will shape the faith for years.',
    choices: {
      install_reformist_clergy: 'Install Reformist Clergy',
      restore_chastened_officials: 'Restore Chastened Officials',
    },
  },

  // ============================================================
  // Culture Follow-ups
  // ============================================================
  evt_exp_fu_cul_masterwork_completed: {
    title: 'A Masterwork Unveiled',
    body: 'The royal patronage of the arts has borne remarkable fruit. A celebrated artist has completed a masterwork — a painting, sculpture, or musical composition — that has captivated the court and drawn admirers from afar.',
    choices: {
      acknowledge: 'Acknowledge the Achievement',
    },
  },
  evt_exp_fu_cul_cultural_tension: {
    title: 'Cultural Identity in Question',
    body: 'The embrace of foreign artistic influences has enriched the kingdom\'s culture but stirred a backlash. Traditional artists complain of being overshadowed, and some clergy warn that foreign aesthetics carry foreign values.',
    choices: {
      celebrate_diversity: 'Celebrate Cultural Diversity',
      promote_traditional_arts: 'Promote Traditional Arts',
      let_trends_settle: 'Let Trends Settle Naturally',
    },
  },
  evt_exp_fu_cul_folk_festival: {
    title: 'Folk Festival Delights the People',
    body: 'The folk tradition revival has culminated in a grand festival celebrating the kingdom\'s heritage. Music, dance, and storytelling fill the streets, and the common folk bask in a renewed sense of cultural pride.',
    choices: {
      acknowledge: 'Acknowledge the Festival',
    },
  },
  evt_exp_fu_cul_underground_theater: {
    title: 'Underground Performances Continue',
    body: 'The banned theatrical performance has found a second life in secret venues. Audiences gather in cellars and private homes, and the forbidden show has become more popular than ever. The ban may be doing more harm than good.',
    choices: {
      crack_down_on_gatherings: 'Crack Down on Secret Gatherings',
      reverse_the_ban: 'Reverse the Ban',
    },
  },
  evt_exp_fu_cul_language_resistance: {
    title: 'Resistance to Language Policy',
    body: 'The decree enforcing a single official language has met fierce resistance in regions with their own linguistic traditions. Petitions and protests demand recognition of local tongues, and compliance has been poor.',
    choices: {
      offer_bilingual_compromise: 'Offer a Bilingual Compromise',
      enforce_compliance: 'Enforce Strict Compliance',
      abandon_policy: 'Abandon the Policy',
    },
  },

  // ============================================================
  // Espionage Follow-ups
  // ============================================================
  evt_exp_fu_esp_agent_intel: {
    title: 'Double Agent Delivers Intelligence',
    body: 'The recruited double agent has provided a cache of valuable intelligence about enemy troop movements, diplomatic intentions, and trade vulnerabilities. The question is how to use this advantage.',
    choices: {
      exploit_intelligence: 'Exploit the Intelligence',
      share_with_allies: 'Share with Allies',
    },
  },
  evt_exp_fu_esp_network_rebuilt: {
    title: 'Spy Network Rebuilt',
    body: 'Following the purge of compromised agents, the espionage network has been rebuilt from the ground up with fresh operatives and improved security protocols. Intelligence gathering is resuming at full capacity.',
    choices: {
      acknowledge: 'Acknowledge the Report',
    },
  },
  evt_exp_fu_esp_conspiracy_trial: {
    title: 'Conspirators Await Judgment',
    body: 'The arrested assassination conspirators sit in the dungeons awaiting the crown\'s judgment. Their trial — and its outcome — will send a powerful message about the consequences of plotting against the throne.',
    choices: {
      public_execution: 'Public Execution',
      exile_the_conspirators: 'Exile the Conspirators',
      imprison_for_leverage: 'Imprison for Leverage',
    },
  },
  evt_exp_fu_esp_disinformation_success: {
    title: 'Disinformation Campaign Succeeds',
    body: 'The turned foreign spies have successfully fed false intelligence to their handlers. Enemy plans have been disrupted, and our strategic position has improved — all without a single battle.',
    choices: {
      acknowledge: 'Acknowledge the Success',
    },
  },

  // ============================================================
  // Knowledge Follow-ups
  // ============================================================
  evt_exp_fu_kno_academic_breakthrough: {
    title: 'Academic Rivalry Yields Discovery',
    body: 'The competition between funded academic schools has produced an unexpected breakthrough. Rival scholars, each trying to outdo the other, have jointly advanced understanding of natural philosophy in ways neither could have achieved alone.',
    choices: {
      acknowledge: 'Acknowledge the Discovery',
    },
  },
  evt_exp_fu_kno_technology_restored: {
    title: 'Lost Technology Reconstructed',
    body: 'Scholars have successfully reconstructed the lost technology from ancient texts. The knowledge could be applied to military equipment, agricultural tools, or shared openly for the benefit of all. The choice will shape the kingdom\'s priorities.',
    choices: {
      apply_to_military: 'Apply to Military',
      apply_to_agriculture: 'Apply to Agriculture',
      publish_for_all: 'Publish for All',
    },
  },
  evt_exp_fu_kno_printed_pamphlets: {
    title: 'Printed Pamphlets Proliferate',
    body: 'The subsidized printing press has unleashed a flood of printed pamphlets across the kingdom. Some spread useful knowledge; others contain political commentary, religious debate, and social criticism. The clergy demands regulation.',
    choices: {
      encourage_free_press: 'Encourage Free Press',
      regulate_publications: 'Regulate Publications',
    },
  },
  evt_exp_fu_kno_scholar_contributions: {
    title: 'Foreign Scholars Enrich the Kingdom',
    body: 'The foreign scholars welcomed into the kingdom have made significant contributions to its intellectual life. Their teachings draw eager students, and their presence has enhanced the kingdom\'s reputation as a center of learning.',
    choices: {
      acknowledge: 'Acknowledge Their Contributions',
    },
  },

  // ============================================================
  // ClassConflict Follow-ups
  // ============================================================
  evt_exp_fu_cc_noble_retaliation: {
    title: 'Nobles Retaliate Against Merchants',
    body: 'The nobles who lost the dispute have begun using their influence to obstruct merchant operations — blocking permits, delaying shipments, and pressuring landlords to raise rents on merchant properties. The situation threatens to escalate.',
    choices: {
      stand_firm_with_merchants: 'Stand Firm with Merchants',
      offer_nobles_concession: 'Offer Nobles a Concession',
      ignore_the_backlash: 'Ignore the Backlash',
    },
  },
  evt_exp_fu_cc_grievance_reforms: {
    title: 'Time to Deliver on Promises',
    body: 'The grievances addressed during the peasant uprising now require concrete action. The reforms promised must be implemented, or the crown\'s credibility with the common folk will be shattered.',
    choices: {
      implement_reforms: 'Implement the Reforms',
      delay_reforms: 'Delay the Reforms',
    },
  },
  evt_exp_fu_cc_strike_settlement: {
    title: 'Guild Strike Settled',
    body: 'The negotiations with the striking guild workers have concluded successfully. Both sides have made concessions, and work has resumed in the workshops and markets. The settlement may serve as a model for future disputes.',
    choices: {
      acknowledge: 'Acknowledge the Settlement',
    },
  },
  evt_exp_fu_cc_new_merchant_class: {
    title: 'A New Merchant Class Emerges',
    body: 'The policies encouraging social mobility have produced visible results. Former commoners have risen to prominence in trade and commerce, creating a new merchant class that bridges the old divide between common folk and established traders.',
    choices: {
      acknowledge: 'Acknowledge the Development',
    },
  },

  // ============================================================
  // Region Follow-ups
  // ============================================================
  evt_exp_fu_reg_resource_boom: {
    title: 'Regional Resource Boom',
    body: 'The crown monopoly on the newly discovered resources has begun generating significant revenue. The surrounding region is developing rapidly as workers and merchants flock to the area.',
    choices: {
      acknowledge: 'Acknowledge the Boom',
    },
  },
  evt_exp_fu_reg_infrastructure_complete: {
    title: 'Infrastructure Project Completed',
    body: 'The approved infrastructure project has been completed on schedule. New roads, bridges, and public buildings serve the region, and the improved connectivity is already stimulating local trade and settlement.',
    choices: {
      acknowledge: 'Acknowledge the Completion',
    },
  },
  evt_exp_fu_reg_new_governor: {
    title: 'Province Needs a New Governor',
    body: 'With the corrupt governor removed, the province requires new leadership. The choice of replacement will signal the crown\'s priorities — loyalty, local knowledge, or direct control.',
    choices: {
      appoint_loyal_noble: 'Appoint a Loyal Noble',
      appoint_local_leader: 'Appoint a Local Leader',
      rule_directly: 'Rule the Province Directly',
    },
  },
  evt_exp_fu_reg_hero_legend: {
    title: 'Local Hero Becomes Legend',
    body: 'The royal recognition of the local hero has elevated them to legendary status. Songs are sung in their honor, and the region takes pride in producing such a celebrated figure. Morale and loyalty are strengthened.',
    choices: {
      acknowledge: 'Acknowledge the Legend',
    },
  },

  // ============================================================
  // Kingdom Follow-ups
  // ============================================================
  evt_exp_fu_kgd_reform_resistance: {
    title: 'Nobles Resist Governance Reforms',
    body: 'The governance reforms enacted by the crown have provoked fierce resistance from noble families who stand to lose privileges. They lobby, petition, and threaten to withdraw cooperation unless the reforms are softened.',
    choices: {
      push_through_resistance: 'Push Through the Resistance',
      compromise_on_reforms: 'Compromise on Reforms',
    },
  },
  evt_exp_fu_kgd_audit_results: {
    title: 'Treasury Audit Reveals Irregularities',
    body: 'The comprehensive treasury audit has uncovered significant irregularities — misallocated funds, phantom expenditures, and suspicious transfers to noble accounts. The evidence demands a response.',
    choices: {
      prosecute_offenders: 'Prosecute the Offenders',
      quiet_reform: 'Quiet Reform of Procedures',
    },
  },
  evt_exp_fu_kgd_celebration_goodwill: {
    title: 'Celebration Leaves Lasting Goodwill',
    body: 'The grand national celebration has left a warm afterglow across the kingdom. The people remember the festivities fondly, and the sense of unity and pride persists weeks after the event.',
    choices: {
      acknowledge: 'Acknowledge the Goodwill',
    },
  },
  evt_exp_fu_kgd_centralization_tension: {
    title: 'Provinces Resist Centralization',
    body: 'The administrative centralization has produced efficiency gains in the capital, but provincial leaders chafe under the loss of autonomy. Several regions threaten non-cooperation unless some measure of local governance is restored.',
    choices: {
      press_centralization: 'Press Forward with Centralization',
      allow_provincial_autonomy: 'Allow Some Provincial Autonomy',
    },
  },

  // ============================================================
  // Chain Follow-ups
  // ============================================================
  evt_exp_fu_chain_corruption_aftermath: {
    title: 'Aftermath of the Corruption Scandal',
    body: 'The public trials have concluded, and the guilty have been punished. But the corruption scandal has exposed systemic weaknesses in the kingdom\'s administration. The question now is whether to establish permanent oversight or let the system heal on its own.',
    choices: {
      establish_oversight_body: 'Establish an Oversight Body',
      return_to_normal: 'Return to Normal Operations',
    },
  },
  evt_exp_fu_chain_ceasefire_holds: {
    title: 'The Ceasefire Holds',
    body: 'Weeks have passed since the ceasefire with Arenthal, and both sides have honored its terms. The mood along the border has shifted from tension to cautious optimism. This may be the moment to pursue a lasting peace.',
    choices: {
      propose_formal_treaty: 'Propose a Formal Peace Treaty',
      maintain_ceasefire: 'Maintain the Ceasefire As-Is',
    },
  },
  evt_exp_fu_chain_golden_age_legacy: {
    title: 'Legacy of the Golden Age',
    body: 'The declaration of a golden age has resonated beyond the kingdom\'s borders. Foreign scholars cite our achievements, artists dedicate works to the crown, and the people swell with justified pride. This moment will be remembered for generations.',
    choices: {
      acknowledge: 'Acknowledge the Legacy',
    },
  },
};
