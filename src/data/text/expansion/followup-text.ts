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
    body: 'The guild members who lost the dispute continue to grumble. Their resentment has begun to affect trade, as they slow-walk contracts and withhold cooperation. A gesture of goodwill might restore productivity. The {class_plural} await the crown\'s reply.',
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
    body: 'The tax compromise negotiated during the revolt has taken effect. Revenue has stabilized, though some officials question whether the concessions were too generous. The agreement could be revisited. The {class_plural} take note of the dispatch.',
    choices: {
      honor_the_agreement: 'Honor the Agreement',
      renegotiate_terms: 'Renegotiate the Terms',
    },
  },
  evt_exp_fu_eco_bailout_resentment: {
    title: 'Public Anger Over Bailout',
    body: 'Word of the lender bailout has spread among the commonfolk. They see wealthy money-changers rescued by the crown while ordinary people struggle. Protests have begun in the market squares.',
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
    body: 'The destruction of contaminated grain stores has left reserves at critically low levels. With the next harvest still months away, the kingdom faces a difficult period of scarcity unless supplies are secured from abroad. The {class_plural} await the crown\'s reply.',
    choices: {
      import_emergency_grain: 'Import Emergency Grain',
      tighten_rationing: 'Tighten Rationing',
    },
  },
  evt_exp_fu_food_overfishing: {
    title: 'Coastal Waters Depleted',
    body: 'The fishing boom has been too successful. Fishermen report dwindling catches and smaller fish, suggesting the coastal waters are being overfished. Unless limits are imposed, the fishery may collapse entirely. The {class_plural} await the crown\'s reply.',
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
    body: 'The investment in superior weapons has yielded a breakthrough — new alloys that produce stronger blades and more resilient armor. The question now is whether to produce these weapons en masse or keep them as an elite advantage. The {class_plural} await the crown\'s reply.',
    choices: {
      mass_produce_weapons: 'Mass Produce the New Weapons',
      keep_as_elite_reserve: 'Keep as Elite Reserve',
    },
  },
  evt_exp_fu_mil_fortress_garrison: {
    title: 'Border Fortresses Manned',
    body: 'The newly constructed border fortresses have been garrisoned and provisioned. Their presence has already deterred several incursions, and local villages report feeling safer than they have in years. The {class_plural} take note of the dispatch.',
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
    body: 'The grand military review has inspired a wave of young recruits eager to serve. Recruiting stations report their highest numbers in years, and morale throughout the ranks is lifted. The {class_plural} take note of the dispatch.',
    choices: {
      acknowledge: 'Acknowledge the Report',
    },
  },

  // ============================================================
  // Diplomacy Follow-ups
  // ============================================================
  evt_exp_fu_dip_trade_profits: {
    title: 'Trade Agreement Yields Profits',
    body: 'The trade agreement with Valdris has begun to generate returns. Merchant caravans move freely along the new routes, and tariff revenues have exceeded expectations. The treasury benefits. The {class_plural} take note of the dispatch.',
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
    body: 'The refugees welcomed into the kingdom are settling in and beginning to establish themselves. Some locals grumble about competition for work and housing, while others appreciate the newcomers\' industriousness. The {class_plural} await the crown\'s reply.',
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
    body: 'Safety improvements at the collapsed mine are complete, and the engineers have declared the site ready for operations. The workers are eager to return, though some families still fear another collapse. The {class_plural} await the crown\'s reply.',
    choices: {
      resume_full_operations: 'Resume Full Operations',
      maintain_reduced_output: 'Maintain Reduced Output',
    },
  },
  evt_exp_fu_env_logging_ban_impact: {
    title: 'Logging Ban Hits Livelihoods',
    body: 'The logging ban has protected the forests, but the loggers and their families are suffering. Unemployment has risen in timber-dependent villages, and there are calls for compensation or alternative employment. The {class_plural} await the crown\'s reply.',
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
    body: 'The city watch deployment has pushed the street gangs underground, but they have not been eliminated. Criminal activity continues in the shadows, and the watch commander requests continued funding to maintain pressure. The {class_plural} await the crown\'s reply.',
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
    body: 'The legalized citizen militia has begun exceeding its mandate. Reports of rough justice, settling of personal grudges, and intimidation of merchants have reached the crown. The militia\'s supporters defend their actions as necessary. The {class_plural} await the crown\'s reply.',
    choices: {
      rein_in_militia: 'Rein in the Militia',
      look_the_other_way: 'Look the Other Way',
    },
  },
  evt_exp_fu_po_martial_law_tension: {
    title: 'Martial Law Wears Thin',
    body: 'The martial law imposed after the riots has restored order, but the population grows increasingly restive under military rule. Soldiers patrol the streets, a curfew remains in effect, and resentment swells daily. The {class_plural} await the crown\'s reply.',
    choices: {
      lift_martial_law: 'Lift Martial Law',
      extend_martial_law: 'Extend Martial Law',
    },
  },
  evt_exp_fu_po_purge_aftermath: {
    title: 'Vacancies After the Purge',
    body: 'The corruption purge has left numerous positions in the administration vacant. The crown must decide whether to fill them with reform-minded newcomers or restore the chastened old guard who know the systems best. The {class_plural} await the crown\'s reply.',
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
    body: 'The crown\'s endorsement of the miracle has triggered an influx of pilgrims. Roads are crowded, inns are overflowing, and local merchants are thriving — but the infrastructure is straining under the demand. The {class_plural} await the crown\'s reply.',
    choices: {
      build_pilgrim_infrastructure: 'Build Pilgrim Infrastructure',
      let_pilgrims_come_naturally: 'Let Pilgrims Come Naturally',
    },
  },
  evt_exp_fu_rel_underground_copies: {
    title: 'Heretical Texts Circulate Underground',
    body: 'Despite the suppression order, copies of the heretical texts have been found circulating in secret among scholars and curious commoners. The ideas contained within are spreading beyond the crown\'s ability to control. The {class_plural} await the crown\'s reply.',
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
    body: 'The banned theatrical performance has found a second life in secret venues. Audiences gather in cellars and private homes, and the forbidden show has become more popular than ever. The ban may be doing more harm than good. The {class_plural} await the crown\'s reply.',
    choices: {
      crack_down_on_gatherings: 'Crack Down on Secret Gatherings',
      reverse_the_ban: 'Reverse the Ban',
    },
  },
  evt_exp_fu_cul_language_resistance: {
    title: 'Resistance to Language Policy',
    body: 'The decree enforcing a single official language has met fierce resistance in regions with their own linguistic traditions. Petitions and protests demand recognition of local tongues, and compliance has been poor. The {class_plural} await the crown\'s reply.',
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
    body: 'The arrested assassination conspirators sit in the dungeons awaiting the crown\'s judgment. Their trial — and its outcome — will send a powerful message about the consequences of plotting against the throne. The {class_plural} await the crown\'s reply.',
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
    body: 'The competition between funded academic schools has produced an unexpected breakthrough. Contending scholars, each trying to outdo the other, have jointly advanced understanding of natural philosophy in ways neither could have achieved alone.',
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
    body: 'The subsidized printing press has unleashed a flood of printed pamphlets across the kingdom. Some spread useful knowledge; others contain political commentary, religious debate, and social criticism. The clergy demands regulation. The {class_plural} await the crown\'s reply.',
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
    body: 'The grievances addressed during the peasant uprising now require concrete action. The reforms promised must be implemented, or the crown\'s credibility with the commonfolk will be shattered.',
    choices: {
      implement_reforms: 'Implement the Reforms',
      delay_reforms: 'Delay the Reforms',
    },
  },
  evt_exp_fu_cc_strike_settlement: {
    title: 'Guild Strike Settled',
    body: 'The negotiations with the striking guild workers have concluded successfully. Both sides have made concessions, and work has resumed in the workshops and markets. The settlement may serve as a model for future disputes. The {class_plural} take note of the dispatch.',
    choices: {
      acknowledge: 'Acknowledge the Settlement',
    },
  },
  evt_exp_fu_cc_new_merchant_class: {
    title: 'A New Merchant Class Emerges',
    body: 'The policies encouraging social mobility have produced visible results. Former commoners have risen to prominence in trade and commerce, creating a new merchant class that bridges the old divide between common folk and established traders. The {class_plural} take note of the dispatch.',
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
    body: 'The governance reforms enacted by the crown have provoked fierce resistance from noble families who stand to lose privileges. They lobby, petition, and threaten to withdraw cooperation unless the reforms are softened. The {class_plural} await the crown\'s reply.',
    choices: {
      push_through_resistance: 'Push Through the Resistance',
      compromise_on_reforms: 'Compromise on Reforms',
    },
  },
  evt_exp_fu_kgd_audit_results: {
    title: 'Treasury Audit Reveals Irregularities',
    body: 'The comprehensive treasury audit has uncovered significant irregularities — misallocated funds, phantom expenditures, and suspicious transfers to noble accounts. The evidence demands a response. The {class_plural} await the crown\'s reply.',
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
    body: 'The administrative centralization has produced efficiency gains in the capital, but provincial leaders chafe under the loss of autonomy. Several regions threaten non-cooperation unless some measure of local governance is restored. The {class_plural} await the crown\'s reply.',
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
    body: 'The public trials have concluded, and the guilty have been punished. But the corruption scandal has exposed systemic weaknesses in the kingdom\'s administration. The question now is whether to establish permanent oversight or let the system heal on its own. The {class_plural} await the crown\'s reply.',
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

  // ============================================================
  // Phase 2 Card Audit — Stub follow-up text (batch 1)
  // Minimal title/body/choice labels to unblock the scanner.
  // Phase 15 rewrites these into full Pattern A content.
  // ============================================================
  evt_fu_drought_wasteland: {
    title: 'Wasteland Where the Fields Once Stood',
    body: 'The abandoned region has not recovered. Dry wells, cracked earth, empty villages — the crown must decide whether to invest in reclaiming the land or cede it to the desert.',
    choices: { invest_in_recovery: 'Invest in Recovery', abandon_the_region: 'Abandon the Region' },
  },
  evt_fu_merchant_water_reprisal: {
    title: 'Merchant Guild Demands Redress',
    body: 'The seized water rights have bled merchant trust. A delegation demands compensation for the commandeered stores before trade resumes. The {class_plural} are watching every move of the court.',
    choices: { pay_compensation: 'Pay Compensation', dismiss_claims: 'Dismiss the Claims' },
  },
  evt_fu_burned_quarters_rebuild: {
    title: 'Burned Quarters Ask to Be Rebuilt',
    body: 'The quarters we put to the torch still stand empty. Commoners want reconstruction funded; others say the ash should serve as a warning.',
    choices: { fund_reconstruction: 'Fund Reconstruction', defer_the_works: 'Defer the Works' },
  },
  evt_fu_plague_worsens: {
    title: 'The Sickness Deepens',
    body: 'Prayer has not stayed the plague. Fresh reports speak of whole villages fallen silent. The crown must act. The {class_plural} are watching every move of the court.',
    choices: { mobilize_healers: 'Mobilize Royal Healers', pray_and_wait: 'Pray and Wait' },
  },
  evt_fu_plague_wasteland: {
    title: 'The Plague Region Lies Empty',
    body: 'Where we accepted the fate of the dying, only a wasteland remains. Settlers could be called back, or the land left to rot.',
    choices: { resettle_and_rebuild: 'Resettle and Rebuild', leave_it_to_the_wind: 'Leave It to the Wind' },
  },
  evt_fu_exodus_refugee_crisis: {
    title: 'Refugees at the Gates',
    body: 'The plague exodus has massed at the borders of safer provinces. We must house them or turn them away. The {class_plural} are watching every move of the court.',
    choices: { open_refugee_camps: 'Open Refugee Camps', turn_them_back: 'Turn Them Back' },
  },
  evt_fu_martial_law_aftermath: {
    title: 'Martial Law Still in Force',
    body: 'Soldiers remain in the streets long after the plague broke. The people want normalcy; the generals advise caution.',
    choices: { lift_restrictions: 'Lift the Restrictions', keep_troops_in_streets: 'Keep Troops in the Streets' },
  },
  evt_fu_famine_ration_riot: {
    title: 'Rationing Triggers Riot',
    body: 'Strict rationing has broken down. Crowds storm the granaries. The {class_plural} are watching every move of the court.',
    choices: { distribute_reserves: 'Distribute the Reserves', clamp_down: 'Clamp Down' },
  },
  evt_fu_grain_debt_called: {
    title: 'The Grain Debt Comes Due',
    body: 'The foreign lenders who shipped grain now send collectors. Terms were generous; the repayment is not. The {class_plural} are watching every move of the court.',
    choices: { pay_the_debt: 'Pay the Debt in Full', renegotiate_terms: 'Renegotiate Terms' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 2) ---
  evt_fu_amnesty_banditry_return: {
    title: 'The Bandits Return',
    body: 'The amnesty held only as long as the purse. Fresh raids stalk the outer roads.',
    choices: { recommit_patrols: 'Recommit Patrols', cut_losses: 'Cut the Losses' },
  },
  evt_fu_lawless_outer_region: {
    title: 'Lawless Province',
    body: 'Abandoned to itself, the outer region has found its own lords. The crown\'s writ runs only to the border.',
    choices: { reclaim_by_force: 'Reclaim by Force', formalize_warlord_rule: 'Formalize the Warlord\'s Rule' },
  },
  evt_fu_coopted_lords_demand_more: {
    title: 'The Co-opted Lords Ask for More',
    body: 'Grown fat on royal favor, the lords we bought return for a second helping. Refusal will be taken as betrayal. The {class_plural} are watching every move of the court.',
    choices: { grant_new_privileges: 'Grant New Privileges', draw_the_line: 'Draw the Line' },
  },
  evt_fu_corruption_entrenched: {
    title: 'Corruption Hardens Into Custom',
    body: 'What we tolerated has become the order of things. Tribunal or surrender — those are the remaining options.',
    choices: { launch_tribunal: 'Launch Tribunal', accept_the_rot: 'Accept the Rot' },
  },
  evt_fu_martial_law_backlash: {
    title: 'Martial Law Breeds Its Enemies',
    body: 'Dissenters have coalesced against the occupation. The streets are quieter, but quieter is not peaceful. The {class_plural} are watching every move of the court.',
    choices: { withdraw_troops: 'Withdraw Troops', arrest_dissenters: 'Arrest Dissenters' },
  },
  evt_fu_rebel_accord_unravels: {
    title: 'The Rebel Accord Unravels',
    body: 'The terms we agreed with the rebels are being read in a dozen contradictory ways. Either we honor every clause or we tear the page.',
    choices: { honor_every_term: 'Honor Every Term', repudiate_the_pact: 'Repudiate the Pact' },
  },
  evt_fu_syndicate_protection_fees: {
    title: 'Protection Fees Presented as Invoices',
    body: 'The bosses we bribed now mail invoices to honest merchants. It is not yet extortion, they say — it is civic rent.',
    choices: { pay_the_fee: 'Pay the Fee', break_the_racket: 'Break the Racket' },
  },
  evt_fu_criminal_shadow_state: {
    title: 'A Shadow State at the Ports',
    body: 'The ceded ports answer to a second crown now. Every entering ship pays that crown first.',
    choices: { reassert_authority: 'Reassert Royal Authority', formalize_the_arrangement: 'Formalize the Arrangement' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 3) ---
  evt_fu_factions_see_through: {
    title: 'The Factions See Through the Game',
    body: 'Playing guild and noble against each other worked — until both realized the game. Now both want a reckoning.',
    choices: { publicly_reconcile: 'Publicly Reconcile', disavow_both_sides: 'Disavow Both Sides' },
  },
  evt_fu_social_order_revolt: {
    title: 'The Old Order Revolts',
    body: 'Commoners denied their demands have risen. The guard shudders; the nobility demands iron.',
    choices: { concede_to_reforms: 'Concede to Reforms', crush_dissent: 'Crush the Dissent' },
  },
  evt_fu_token_concessions_backfire: {
    title: 'Token Concessions Spark Larger Demands',
    body: 'The small reforms proved the crown could bend. Now the commons want the crown to bend further. The {class_plural} are watching every move of the court.',
    choices: { offer_real_reforms: 'Offer Real Reforms', revoke_concessions: 'Revoke the Concessions' },
  },
  evt_fu_reform_martyrs: {
    title: 'The Reformers Have Their Martyrs',
    body: 'Suppressing the reform movement cost lives the people now name. Acknowledging or denying those dead will shape the next months. The {class_plural} are watching every move of the court.',
    choices: { acknowledge_wrongs: 'Acknowledge the Wrongs', deny_the_dead: 'Deny the Dead' },
  },
  evt_fu_cultural_drift_backlash: {
    title: 'Traditionalists Stir',
    body: 'The cultural reforms have unsettled the old orders. Sermons, pamphlets, whisper campaigns — the backlash is organised.',
    choices: { support_traditionalists: 'Support the Traditionalists', stand_by_the_reforms: 'Stand by the Reforms' },
  },
  evt_fu_suppression_diaspora_unrest: {
    title: 'The Diaspora Demands Refuge',
    body: 'Those we suppressed flee to sympathetic neighbours and sympathetic hills. The refuge terms will decide whether they come home. The {class_plural} are watching every move of the court.',
    choices: { offer_refuge_terms: 'Offer Refuge Terms', double_down_on_suppression: 'Double Down on Suppression' },
  },
  evt_fu_assimilation_standoff: {
    title: 'The Cultural Standoff',
    body: 'Refused, the neighbour\'s pressure has hardened into a standoff. Either we hold the line or we sue for terms.',
    choices: { hold_the_line: 'Hold the Line', offer_terms: 'Offer Terms' },
  },
  evt_fu_integration_fifth_column: {
    title: 'A Fifth Column Among Us',
    body: 'The agents of partial integration proved agents of something else. Purge or turn, a choice of espionage.',
    choices: { purge_the_agents: 'Purge the Agents', turn_them: 'Turn Them' },
  },
  evt_fu_price_freeze_shortages: {
    title: 'Price Freeze Yields Shortages',
    body: 'The freeze holds — and so do the empty shelves. Enforcement or repeal, either answer costs. The {class_plural} are watching every move of the court.',
    choices: { lift_the_freeze: 'Lift the Freeze', enforce_by_patrol: 'Enforce by Patrol' },
  },
  evt_fu_market_crash_bread_riots: {
    title: 'The Markets Crash, Bread Riots Begin',
    body: 'Letting the market correct has corrected us. The bread queues are now bread riots. The {class_plural} are watching every move of the court.',
    choices: { distribute_emergency_food: 'Distribute Emergency Food', call_the_city_watch: 'Call the City Watch' },
  },
  evt_fu_counterfeit_underground_revenge: {
    title: 'The Counterfeit Ring Returns',
    body: 'Those we executed left heirs. Underground mints stamp new coin in the old shapes. The {class_plural} are watching every move of the court.',
    choices: { hunt_the_remnants: 'Hunt the Remnants', offer_amnesty_for_names: 'Offer Amnesty for Names' },
  },
  evt_fu_royal_stamp_fraud: {
    title: 'Royal Stamps, Forged',
    body: 'The stamps we issued now travel on false coin too. The forgers work from inside the mint. The {class_plural} are watching every move of the court.',
    choices: { replace_the_stamps: 'Replace the Stamps', prosecute_the_ring: 'Prosecute the Ring' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 4: religion/schism) ---
  evt_fu_dual_practice_schism: {
    title: 'Dual Practice Hardens Into Schism',
    body: 'What we called tolerance has congealed into two churches. Either we force a single rite or watch the split become permanent. The {class_plural} are watching every move of the court.',
    choices: { unify_rite: 'Unify the Rite', let_the_rites_split: 'Let the Rites Split' },
  },
  evt_fu_underground_reformers: {
    title: 'Underground Reformers',
    body: 'Tradition restored from the pulpit; heresy restored in basements. The reformers have not gone — only gone dark. The {class_plural} are watching every move of the court.',
    choices: { hunt_and_punish: 'Hunt and Punish', meet_them_halfway: 'Meet Them Halfway' },
  },
  evt_fu_schism_reformer_revolt: {
    title: 'Reformer Revolt',
    body: 'Backing orthodoxy sent the reformers to arms. Their council meets in the open air and names itself sovereign. The {class_plural} are watching every move of the court.',
    choices: { convene_mediation: 'Convene Mediation', back_orthodoxy_fully: 'Back Orthodoxy Fully' },
  },
  evt_fu_schism_parallel_churches: {
    title: 'Parallel Churches',
    body: 'Recognising both confessions has made two churches. They now levy tithes in the same villages. The {class_plural} are watching every move of the court.',
    choices: { formalize_both: 'Formalise Both', force_unity: 'Force Unity' },
  },
  evt_fu_doctrine_enforcement_blowback: {
    title: 'The State Doctrine Meets Resistance',
    body: 'Priests refuse the edict; some bishops refuse their oaths. The crown must soften or prosecute. The {class_plural} are watching every move of the court.',
    choices: { soften_the_edict: 'Soften the Edict', prosecute_resisters: 'Prosecute the Resisters' },
  },
  evt_fu_coexistence_fractures: {
    title: 'Coexistence Fractures',
    body: 'Allowed to coexist, the confessions have started burning each other\'s books. The kingdom cannot stay neutral.',
    choices: { mediate_the_split: 'Mediate the Split', pick_a_side: 'Pick a Side' },
  },
  evt_fu_state_religion_persecution: {
    title: 'State Religion, Cruel Enforcement',
    body: 'Imposing the state religion has turned into systematic persecution. Halt the purges or deepen the inquiry.',
    choices: { halt_the_purges: 'Halt the Purges', deepen_the_inquiry: 'Deepen the Inquiry' },
  },
  evt_fu_pluralism_splinter_sects: {
    title: 'Pluralism Sprouts Splinter Sects',
    body: 'Pluralism did not stop at two faiths. Splinter sects multiply faster than the clergy can count.',
    choices: { regulate_the_sects: 'Regulate the Sects', let_them_fracture: 'Let Them Fracture' },
  },
  evt_fu_secularization_backlash: {
    title: 'The Secularised State Is Hated',
    body: 'Stripping the church of civic seats has united clergy and commons against the reform. Roll it back or hold fast.',
    choices: { restore_church_seats: 'Restore the Church Seats', hold_the_reforms: 'Hold the Reforms' },
  },
  evt_fu_comet_heresy_spreads: {
    title: 'Comet Heresy Spreads',
    body: 'Forbidden speculation went where forbidden speech goes — underground, and out through every backroom. A new sect names the comet its prophet. The {class_plural} are watching every move of the court.',
    choices: { authorize_suppression: 'Authorise Suppression', engage_in_debate: 'Engage in Debate' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 5: succession/authority) ---
  evt_fu_marriage_dynastic_friction: {
    title: 'Dynastic Friction',
    body: 'The dynastic marriage is stable on paper and tense at court. The in-laws pressure for real power. The {class_plural} are watching every move of the court.',
    choices: { formalize_joint_rule: 'Formalise Joint Rule', exile_the_in_laws: 'Exile the In-laws' },
  },
  evt_fu_exiled_pretender_returns: {
    title: 'The Pretender Returns',
    body: 'The pension ran out — or was never the point. The pretender is back, with new allies. The {class_plural} are watching every move of the court.',
    choices: { meet_with_sword: 'Meet With the Sword', offer_a_settlement: 'Offer a Settlement' },
  },
  evt_fu_succession_factions_war: {
    title: 'Succession Factions to Arms',
    body: 'Playing the factions has birthed a small war in the capital. Either the crown takes a side, or the crown brokers peace.',
    choices: { seize_a_side: 'Seize a Side', call_peace_conference: 'Call a Peace Conference' },
  },
  evt_fu_merit_heir_noble_backlash: {
    title: 'Noble Backlash to the Merit Heir',
    body: 'Merit chose the heir. Blood objects. The lords demand concessions or a reversal. The {class_plural} are watching every move of the court.',
    choices: { grant_noble_concession: 'Grant a Noble Concession', hold_the_merit_line: 'Hold the Merit Line' },
  },
  evt_fu_authority_rebellion: {
    title: 'Asserted Authority Breeds Rebellion',
    body: 'Asserting royal authority during the crisis cost consent. Open revolt follows unless a charter is granted.',
    choices: { crush_the_rising: 'Crush the Rising', grant_a_charter: 'Grant a Charter' },
  },
  evt_fu_charter_implementation: {
    title: 'Implementing the Charter',
    body: 'The Charter is on parchment. It must now be read, interpreted, enforced. Either by the letter or by royal nuance.',
    choices: { stand_by_the_letter: 'Stand by the Letter', reinterpret_it_royally: 'Reinterpret It Royally' },
  },
  evt_fu_purge_court_paralysis: {
    title: 'Purged Court, Paralysed Court',
    body: 'With the inner circle gone, decisions wait for seats to be filled. Recall exiles or elevate loyalists. The {class_plural} are watching every move of the court.',
    choices: { recall_trusted_exiles: 'Recall Trusted Exiles', fill_seats_with_loyalists: 'Fill Seats With Loyalists' },
  },
  evt_fu_mercy_emboldens_plot: {
    title: 'Mercy Emboldens a Second Plot',
    body: 'The pardoned conspirators did not repent. A second plot stirs in the same rooms. The {class_plural} are watching every move of the court.',
    choices: { arrest_the_cell: 'Arrest the Cell', ignore_the_rumors: 'Ignore the Rumours' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 6: military/mutiny) ---
  evt_fu_purge_officer_shortage: {
    title: 'Officer Shortage After the Purge',
    body: 'The conspirators are gone and so are most of the experienced commanders. Ranks need filling, fast. The {class_plural} are watching every move of the court.',
    choices: { promote_from_ranks: 'Promote From the Ranks', recruit_mercenaries: 'Recruit Mercenaries' },
  },
  evt_fu_bribed_officers_ask_more: {
    title: 'The Bribed Officers Ask for More',
    body: 'The officer corps we bought now presents a larger bill. Either the purse grows or the loyalty breaks. The {class_plural} are watching every move of the court.',
    choices: { raise_the_purse: 'Raise the Purse', hold_the_line: 'Hold the Line' },
  },
  evt_fu_ringleader_martyrs: {
    title: 'Ringleaders, Martyred',
    body: 'Isolated and executed, the ringleaders have become the stuff of ballads. Posthumous pardons, or a harder narrative? The {class_plural} are watching every move of the court.',
    choices: { grant_posthumous_pardons: 'Grant Posthumous Pardons', reinforce_the_narrative: 'Reinforce the Narrative' },
  },
  evt_fu_officer_cabal: {
    title: 'An Officer Cabal',
    body: 'Negotiation with the officers produced a quiet cabal — loyal on paper, loyal to themselves in practice. The {class_plural} are watching every move of the court.',
    choices: { infiltrate_the_cabal: 'Infiltrate the Cabal', confront_them_openly: 'Confront Them Openly' },
  },
  evt_fu_merchant_boycott: {
    title: 'Merchant Boycott',
    body: 'The merchants we requisitioned from have closed their doors. The army\'s supply chain is choking.',
    choices: { pay_the_backtax: 'Pay the Back-tax', force_the_trade: 'Force the Trade' },
  },
  evt_fu_starving_garrison: {
    title: 'A Garrison Starves',
    body: 'Rationing to breaking point, a garrison now eats its horses. Relief or retreat. The {class_plural} are watching every move of the court.',
    choices: { airlift_rations: 'Airlift Rations', abandon_the_post: 'Abandon the Post' },
  },
  evt_fu_field_equipment_catastrophe: {
    title: 'Field Equipment Catastrophe',
    body: 'Pushing through with failing gear has cost a company its arms. The armoury must answer — or the unit dissolves. The {class_plural} are watching every move of the court.',
    choices: { emergency_armory_orders: 'Emergency Armoury Orders', let_the_unit_dissolve: 'Let the Unit Dissolve' },
  },
  evt_fu_estate_seizure_lawsuit: {
    title: 'Estate Seizure Lawsuit',
    body: 'The requisitioned estate\'s heir has sued in the high court. The crown must pay or quash. The {class_plural} are watching every move of the court.',
    choices: { pay_the_indemnity: 'Pay the Indemnity', quash_the_suit: 'Quash the Suit' },
  },
  evt_fu_seized_granaries_noble_revolt: {
    title: 'Noble Revolt Over Seized Granaries',
    body: 'The granaries we opened without their leave have made the lords revolt. Return the stores, or stand firm. The {class_plural} are watching every move of the court.',
    choices: { return_the_stores: 'Return the Stores', confront_the_lords: 'Confront the Lords' },
  },
  evt_fu_famine_descends_into_riot: {
    title: 'Famine Tips Into Riot',
    body: 'Appeals for calm fed only hunger. The riot has come. The {class_plural} are watching every move of the court.',
    choices: { distribute_reserves: 'Distribute Reserves', deploy_the_guard: 'Deploy the Guard' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 7: public order) ---
  evt_fu_noble_contribution_resistance: {
    title: 'Nobles Refuse the Levy',
    body: 'The contribution we demanded has been refused in council. Seize it or waive it. The {class_plural} are watching every move of the court.',
    choices: { seize_the_levy: 'Seize the Levy', waive_the_demand: 'Waive the Demand' },
  },
  evt_fu_neglected_works_collapse: {
    title: 'Neglected Works Collapse',
    body: 'Suspended spending had consequences. A bridge, a wall, or a granary has gone — take your pick; they did.',
    choices: { emergency_repair_fund: 'Emergency Repair Fund', let_it_stand_as_warning: 'Let It Stand as Warning' },
  },
  evt_fu_arrests_purge_pushback: {
    title: 'Purge Arrests Trigger Pushback',
    body: 'The preemptive arrests have produced a noble faction demanding releases. Halve the list — or double it. The {class_plural} are watching every move of the court.',
    choices: { release_half_the_held: 'Release Half the Held', double_the_arrests: 'Double the Arrests' },
  },
  evt_fu_double_agent_compromised: {
    title: 'A Double Agent Burned',
    body: 'One of our planted agents has been made. Extract them at cost, or burn them and keep the network.',
    choices: { extract_the_agent: 'Extract the Agent', burn_them: 'Burn Them' },
  },
  evt_fu_closed_border_smuggling: {
    title: 'Closed Border, Open Smuggling',
    body: 'The border closure has bred professional smugglers. Legitimise controlled exits, or harden the patrols. The {class_plural} are watching every move of the court.',
    choices: { legalize_controlled_exits: 'Legalise Controlled Exits', crack_down_on_runners: 'Crack Down on Runners' },
  },
  evt_fu_exodus_brain_drain: {
    title: 'Brain Drain Following the Exodus',
    body: 'Letting dissenters leave cost the kingdom its physicians, scribes, and mint clerks. Incentivise return or seal tighter.',
    choices: { incentivize_return: 'Incentivise Return', seal_borders_tighter: 'Seal Borders Tighter' },
  },
  evt_fu_curfew_mass_defiance: {
    title: 'Mass Defiance of the Curfew',
    body: 'The curfew produced crowds that deliberately break it. Either it ends, or it is enforced with blood. The {class_plural} are watching every move of the court.',
    choices: { lift_the_curfew: 'Lift the Curfew', enforce_with_blood: 'Enforce With Blood' },
  },
  evt_fu_peacekeeper_overreach: {
    title: 'Peacekeeper Overreach',
    body: 'Patrols deployed for order have crossed into brutality. Court-martial the officers, or defend the guards. The {class_plural} are watching every move of the court.',
    choices: { court_martial_the_officers: 'Court-martial the Officers', defend_the_guards: 'Defend the Guards' },
  },
  evt_fu_patrol_brutality_complaint: {
    title: 'Patrol Brutality Complaint',
    body: 'A commoner delegation brings a register of patrol abuses. Reassign or dismiss. The {class_plural} are watching every move of the court.',
    choices: { reassign_the_unit: 'Reassign the Unit', dismiss_the_complaint: 'Dismiss the Complaint' },
  },
  evt_fu_labor_reform_backlash: {
    title: 'Labour Reform, Backlash',
    body: 'The reforms pleased few. Broaden them, or soften them. The {class_plural} are watching every move of the court.',
    choices: { broaden_the_reform: 'Broaden the Reform', soften_the_edict: 'Soften the Edict' },
  },

  // --- Phase 2 Card Audit — Stub follow-up text (batch 8: misc) ---
  evt_fu_crushed_movement_underground: {
    title: 'The Crushed Movement Goes Underground',
    body: 'Crushed above ground, the revolutionary guild moves below. Hunt or amnesty. The {class_plural} are watching every move of the court.',
    choices: { hunt_the_cells: 'Hunt the Cells', offer_amnesty: 'Offer Amnesty' },
  },
  evt_fu_guild_compromise_drift: {
    title: 'The Guild Compromise Drifts',
    body: 'The compromise text grows unrecognisable as each side rereads it. Honor or revise. The {class_plural} are watching every move of the court.',
    choices: { honor_the_accord: 'Honor the Accord', revise_the_terms: 'Revise the Terms' },
  },
  evt_fu_commandeered_stores_noble_strike: {
    title: 'Noble Strike Over Commandeered Stores',
    body: 'The lords refuse to sit council until the grain is returned. Return it, or seize more. The {class_plural} are watching every move of the court.',
    choices: { return_the_grain: 'Return the Grain', seize_more_estates: 'Seize More Estates' },
  },
  evt_fu_spoiled_grain_sickness: {
    title: 'Spoiled Grain Spreads Sickness',
    body: 'The remains we distributed are making the poor sick. Healers are needed; quarantine too. The {class_plural} are watching every move of the court.',
    choices: { deploy_healers: 'Deploy Healers', quarantine_the_villages: 'Quarantine the Villages' },
  },
  evt_fu_noble_estate_razed: {
    title: 'A Noble Estate Razed',
    body: 'Crushing the uprising cost an estate and a line. The survivors want compensation; the commoners want land. The {class_plural} are watching every move of the court.',
    choices: { compensate_the_survivors: 'Compensate the Survivors', redistribute_the_holdings: 'Redistribute the Holdings' },
  },
  evt_fu_amnesty_cabal_reforms: {
    title: 'The Amnestied Cabal Pushes Reforms',
    body: 'Those we pardoned return with a parchment. They want the concessions codified; the court wants them silenced. The {class_plural} are watching every move of the court.',
    choices: { codify_the_concessions: 'Codify the Concessions', revoke_the_amnesty: 'Revoke the Amnesty' },
  },
  evt_fu_force_crackdown_legacy: {
    title: 'Crackdown Legacy',
    body: 'The commoners remember who the guard cut down. A public apology or the erasure of memorials — nothing neutral.',
    choices: { apologize_publicly: 'Apologise Publicly', erase_the_memorials: 'Erase the Memorials' },
  },
  evt_fu_mob_rule_spreads: {
    title: 'Mob Rule Spreads',
    body: 'Letting the mob decide has spread the habit. Other quarters hold their own tribunals now. Crush or codify. The {class_plural} are watching every move of the court.',
    choices: { crush_the_mob_courts: 'Crush the Mob Courts', formalize_tribunals: 'Formalise Tribunals' },
  },
  evt_fu_civilian_authority_falters: {
    title: 'Civilian Authority Falters',
    body: 'Trusting civilian courts during the crisis left them overrun. Restore military patrol, or back the judges with gold.',
    choices: { restore_military_patrol: 'Restore Military Patrol', back_civilian_courts: 'Back Civilian Courts' },
  },
  evt_fu_pardon_emboldens_graft: {
    title: 'Pardons Embolden Graft',
    body: 'The pardoned grafters now regard the tribunal as a formality. Launch a fresh one, or legalise the fees. The {class_plural} are watching every move of the court.',
    choices: { launch_fresh_tribunal: 'Launch Fresh Tribunal', legalize_graft_fees: 'Legalise Graft Fees' },
  },
  evt_fu_press_smuggled_in: {
    title: 'The Press Is Smuggled In',
    body: 'We banned the device. It arrived anyway. Seize every press, or regulate instead.',
    choices: { seize_every_press: 'Seize Every Press', regulate_instead: 'Regulate Instead' },
  },
  evt_fu_abandoned_convoy_outrage: {
    title: 'Outrage Over the Abandoned Convoy',
    body: 'Cutting losses cost merchants their goods and their trust in the crown. Reimburse, or decline.',
    choices: { reimburse_the_merchants: 'Reimburse the Merchants', decline_responsibility: 'Decline Responsibility' },
  },
  evt_fu_scorched_earth_famine: {
    title: 'Famine After Scorched Earth',
    body: 'Our own borderlanders are starving in the scorched districts. Import, or leave them to the winter. The {class_plural} are watching every move of the court.',
    choices: { import_emergency_grain: 'Import Emergency Grain', let_the_borderlands_starve: 'Let the Borderlands Starve' },
  },
  evt_fu_surrender_terms_harsh: {
    title: 'The Surrender Terms Are Harsh',
    body: 'Suing for peace produced an indemnity the treasury cannot bear — or the crown can reopen the war.',
    choices: { pay_the_indemnity: 'Pay the Indemnity', reopen_the_war: 'Reopen the War' },
  },

  // --- Phase 9 Card Audit — Follow-up text (batch 9A: condition crises) ---
  evt_fu_plague_mild_ignored: {
    title: 'The Sickness Spreads Unchecked',
    body: 'The fevers we ignored have leapt across the river. The healers report three times the cases. Commit to quarantine now, or accept the spread as the cost of doing nothing.',
    choices: { commit_to_quarantine: 'Commit to Quarantine', accept_the_spread: 'Accept the Spread' },
  },
};
