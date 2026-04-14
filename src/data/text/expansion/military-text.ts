import type { EventTextEntry } from '../events';

export const EXPANSION_MILITARY_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // 1. Border Patrol Gaps
  // ============================================================
  evt_exp_mil_border_patrol_gaps: {
    title: 'Gaps in the Border Watch',
    body: 'Your marshal reports that patrol routes along the frontier have grown dangerously thin. Several outposts have gone unmanned for weeks, and local villages report unfamiliar riders passing unchallenged through Crown lands.',
    choices: {
      increase_patrol_frequency: 'Increase Patrol Frequency',
      recruit_local_militia: 'Recruit Local Militia',
      accept_current_coverage: 'Accept Current Coverage',
    },
  },

  // ============================================================
  // 2. Weapons Smithing Proposal
  // ============================================================
  evt_exp_mil_weapons_smithing: {
    title: 'The Smiths Seek Royal Patronage',
    body: 'A delegation of master smiths has petitioned the throne for investment in new forges and workshops. They promise superior arms for the garrison, but the nobility questions whether Crown funds should flow to common tradesmen.',
    choices: {
      fund_royal_armory: 'Fund a Royal Armory',
      contract_guild_smiths: 'Contract Guild Smiths',
      postpone_investment: 'Postpone the Investment',
    },
  },

  // ============================================================
  // 3. Cavalry Training Grounds
  // ============================================================
  evt_exp_mil_cavalry_training: {
    title: 'Proposal for a Cavalry Academy',
    body: 'Your master-at-arms argues that the kingdom\'s mounted forces lag behind those of neighboring realms. He proposes converting fertile pastureland into dedicated training grounds, a plan that would strengthen the cavalry but displease those who farm the land.',
    choices: {
      build_cavalry_academy: 'Build a Cavalry Academy',
      expand_existing_stables: 'Expand Existing Stables',
      maintain_infantry_focus: 'Maintain Infantry Focus',
    },
  },

  // ============================================================
  // 4. Siege Preparations
  // ============================================================
  evt_exp_mil_siege_preparations: {
    title: 'Valdris Masses Near the Border',
    body: 'Scouts confirm that Valdris has assembled siege engines and supply trains within striking distance of your southern fortifications. Your generals urge immediate preparations, but full mobilization would strain the treasury and alarm the populace.',
    choices: {
      full_siege_mobilization: 'Order Full Mobilization',
      reinforce_key_fortifications: 'Reinforce Key Fortifications',
      seek_diplomatic_resolution: 'Seek Diplomatic Resolution',
    },
  },

  // ============================================================
  // 5. Veteran Pensions
  // ============================================================
  evt_exp_mil_veteran_pensions: {
    title: 'Veterans Petition for Support',
    body: 'Aging soldiers who served the Crown faithfully now struggle in poverty. Their spokesman, a decorated former captain, kneels before the throne and asks that the kingdom remember those who bled in its defense.',
    choices: {
      establish_pension_fund: 'Establish a Pension Fund',
      grant_farmland_plots: 'Grant Farmland Plots',
      honor_with_ceremony_only: 'Honor with Ceremony Only',
    },
  },

  // ============================================================
  // 6. Military Academy Proposal
  // ============================================================
  evt_exp_mil_academy_proposal: {
    title: 'A School for War',
    body: 'Your senior commanders propose a permanent academy to train officers in strategy, logistics, and leadership. The nobility fears it would elevate common-born soldiers above their station, but the generals insist competence must outweigh birth.',
    choices: {
      found_royal_academy: 'Found a Royal Academy',
      expand_officer_training: 'Expand Officer Training',
      defer_to_peacetime: 'Defer Until Peacetime',
    },
  },

  // ============================================================
  // 7. Mercenary Company Offer
  // ============================================================
  evt_exp_mil_mercenary_offer: {
    title: 'Sellswords at the Gate',
    body: 'A seasoned mercenary captain offers his company\'s services at a rate below market price. His fighters are battle-hardened and well-equipped, but your own soldiers view sellswords with suspicion, and their loyalty extends only as far as the coin purse.',
    choices: {
      hire_full_company: 'Hire the Full Company',
      hire_scouts_only: 'Hire Scouts Only',
      decline_mercenaries: 'Decline the Offer',
    },
  },

  // ============================================================
  // 8. Arms Deal with Arenthal
  // ============================================================
  evt_exp_mil_arms_deal: {
    title: 'Arenthal Offers Arms',
    body: 'Envoys from Arenthal propose a shipment of crossbows and plate armor at favorable terms. The deal would strengthen your forces and deepen ties with Arenthal, though Valdris may view such an arrangement as a provocation.',
    choices: {
      accept_arms_shipment: 'Accept the Shipment',
      negotiate_mutual_pact: 'Negotiate a Mutual Pact',
      politely_refuse: 'Politely Refuse',
    },
  },

  // ============================================================
  // 9. Fortification Decay
  // ============================================================
  evt_exp_mil_fortification_decay: {
    title: 'Crumbling Walls',
    body: 'Engineers report that several border fortifications have deteriorated beyond safe use. Mortar crumbles between the stones, and one watchtower has already partially collapsed. Without repairs, the defensive line is compromised.',
    choices: {
      full_restoration: 'Order Full Restoration',
      patch_critical_sections: 'Patch Critical Sections',
      delay_repairs: 'Delay Repairs',
    },
  },

  // ============================================================
  // 10. War Hero Recognition
  // ============================================================
  evt_exp_mil_war_hero: {
    title: 'A Soldier\'s Valor',
    body: 'Word has spread of a garrison commander who single-handedly held a border crossing against bandits for three days. The troops speak of little else, and the common folk have begun calling the soldier by name in their prayers.',
    choices: {
      public_ceremony: 'Hold a Public Ceremony',
      promote_to_officer: 'Promote to Officer Rank',
      note_service_in_records: 'Note Service in Records',
    },
  },

  // ============================================================
  // 11. Court Martial
  // ============================================================
  evt_exp_mil_court_martial: {
    title: 'An Officer Accused',
    body: 'A ranking officer stands accused of selling military provisions on the black market and falsifying patrol reports. The evidence is damning, but the accused has powerful friends among the nobility and loyal subordinates who threaten to desert if he is punished.',
    choices: {
      public_tribunal: 'Convene a Public Tribunal',
      quiet_discharge: 'Arrange a Quiet Discharge',
      pardon_and_reassign: 'Pardon and Reassign',
    },
  },

  // ============================================================
  // 12. Soldier Discipline Crisis
  // ============================================================
  evt_exp_mil_discipline_crisis: {
    title: 'Unrest in the Barracks',
    body: 'Discontented soldiers have begun brawling in garrison towns, harassing merchants, and defying their officers. Morale has collapsed in several units, and your commanders warn that without intervention the rot will spread to the entire force.',
    choices: {
      enforce_strict_discipline: 'Enforce Strict Discipline',
      address_grievances: 'Address Their Grievances',
      rotate_troublesome_units: 'Rotate Troublesome Units',
    },
  },

  // ============================================================
  // 13. Supply Chain Disruption
  // ============================================================
  evt_exp_mil_supply_chain: {
    title: 'The Army Goes Hungry',
    body: 'Supply wagons bound for the frontier garrisons have failed to arrive for the second consecutive week. Granaries at forward outposts are nearly empty, and soldiers report subsisting on foraged roots. Without resupply, desertions will begin in earnest.',
    choices: {
      emergency_supply_convoy: 'Dispatch Emergency Convoy',
      requisition_from_merchants: 'Requisition from Merchants',
      ration_existing_supplies: 'Ration Existing Supplies',
    },
  },

  // ============================================================
  // 14. Military Intelligence Report
  // ============================================================
  evt_exp_mil_intel_report: {
    title: 'Whispers from the Border',
    body: 'Your spymaster presents a troubling intelligence briefing. Valdris has been conducting nighttime patrols along disputed territory and stockpiling timber suitable for siege construction. The activity may be routine, or it may signal darker intentions.',
    choices: {
      increase_border_watch: 'Increase the Border Watch',
      deploy_counter_intelligence: 'Deploy Counter-Intelligence',
      file_the_report: 'File the Report',
    },
  },

  // ============================================================
  // 15. Conscription Dispute
  // ============================================================
  evt_exp_mil_conscription_dispute: {
    title: 'The Levy Meets Resistance',
    body: 'Village elders have refused to surrender their young men to the annual military levy, citing depleted harvests and the kingdom\'s broken promises of fair compensation. Several conscription officers were turned away at spearpoint.',
    choices: {
      enforce_conscription_quotas: 'Enforce the Quotas',
      offer_volunteer_incentives: 'Offer Volunteer Incentives',
      reduce_levy_demands: 'Reduce Levy Demands',
    },
  },

  // ============================================================
  // 16. War Preparations
  // ============================================================
  evt_exp_mil_war_preparations: {
    title: 'The Drums of War',
    body: 'Relations with Valdris have deteriorated beyond recovery. Your war council convenes in grim assembly, laying out the costs and consequences of full mobilization. Every path forward demands sacrifice; the only question is what kind.',
    choices: {
      full_war_mobilization: 'Order Full War Mobilization',
      defensive_preparations_only: 'Prepare Defenses Only',
      last_chance_diplomacy: 'Attempt Last-Chance Diplomacy',
    },
  },

  // ============================================================
  // 17. Battlefield Medicine
  // ============================================================
  evt_exp_mil_battlefield_medicine: {
    title: 'Healers for the Field',
    body: 'A physician recently returned from foreign wars proposes establishing organized medical care for wounded soldiers. The clergy supports the effort as an act of mercy, though it would divert funds from weapons and training.',
    choices: {
      establish_field_hospitals: 'Establish Field Hospitals',
      train_combat_medics: 'Train Combat Medics',
      rely_on_camp_followers: 'Rely on Camp Followers',
    },
  },

  // ============================================================
  // 18. Strategic Alliance
  // ============================================================
  evt_exp_mil_strategic_alliance: {
    title: 'Arenthal Proposes a Military Pact',
    body: 'Arenthal\'s ambassador arrives with a formal proposal for a mutual defense treaty. The alliance would present a united front against Valdris, but binding your armies to another sovereign\'s wars is a commitment the nobility views with alarm.',
    choices: {
      formal_military_pact: 'Sign a Formal Pact',
      limited_cooperation: 'Agree to Limited Cooperation',
      maintain_independence: 'Maintain Independence',
    },
  },

  // ============================================================
  // 19. Weapon Innovation
  // ============================================================
  evt_exp_mil_weapon_innovation: {
    title: 'A Curious New Design',
    body: 'An ingenious craftsman has presented designs for a novel crossbow mechanism that could be loaded and fired twice as fast as current models. The prototype is promising but unproven, and the smithing guilds are skeptical of outsider innovations.',
    choices: {
      fund_prototype: 'Fund the Prototype',
      commission_field_trials: 'Commission Field Trials',
      archive_the_designs: 'Archive the Designs',
    },
  },

  // ============================================================
  // 20. Naval Operations
  // ============================================================
  evt_exp_mil_naval_operations: {
    title: 'The Question of a Fleet',
    body: 'Your coastal advisors argue that the kingdom\'s neglected harbors leave vital trade routes undefended. Building warships would protect commerce and project power along the coast, but the expense would be considerable and the army views naval spending as a diversion.',
    choices: {
      commission_war_galleys: 'Commission War Galleys',
      refit_merchant_vessels: 'Refit Merchant Vessels',
      focus_on_land_forces: 'Focus on Land Forces',
    },
  },
};
