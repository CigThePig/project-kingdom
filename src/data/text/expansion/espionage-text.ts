import type { EventTextEntry } from '../events';

export const EXPANSION_ESPIONAGE_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Informational (3)
  // ============================================================
  evt_exp_esp_coded_correspondence: {
    title: 'Coded Correspondence Intercepted',
    body: 'A patrol has intercepted a bundle of letters written in an unfamiliar cipher, carried by a merchant traveling from the borderlands. Your spymaster believes the correspondence may contain intelligence of considerable value, but deciphering it will require skilled codebreakers and a modest investment of coin.',
    choices: {
      fund_codebreakers: 'Fund Codebreakers',
      archive_for_later: 'Archive for Later',
    },
  },
  evt_exp_esp_informant_tip: {
    title: 'A Whisper from the Shadows',
    body: 'One of the crown\'s informants has surfaced with a fragment of intelligence regarding troop movements along the northern frontier. The information appears credible, though the informant requests compensation for the personal risk undertaken in acquiring it.',
    choices: {
      reward_informant: 'Reward the Informant',
      note_intelligence: 'Note the Intelligence',
    },
  },
  evt_exp_esp_spy_equipment_advance: {
    title: 'Advances in Covert Craft',
    body: 'A guild of skilled artisans has developed improved tools for clandestine work — concealed writing implements, undetectable lock mechanisms, and disguises of remarkable quality. They offer to supply the crown\'s agents, though their services do not come cheaply.',
    choices: {
      commission_equipment: 'Commission the Equipment',
      acknowledge_progress: 'Acknowledge Their Work',
    },
  },

  // ============================================================
  // Notable (6)
  // ============================================================
  evt_exp_esp_double_agent_dilemma: {
    title: 'The Double Agent\'s Dilemma',
    body: 'Your spymaster presents a delicate situation: one of your agents embedded in a foreign court has been approached to serve as a double agent. The opportunity could yield extraordinary intelligence, but the risks of exposure and disinformation are considerable.',
    choices: {
      turn_agent_double: 'Accept the Double Role',
      extract_and_debrief: 'Extract and Debrief',
      feed_disinformation: 'Feed False Intelligence',
    },
  },
  evt_exp_esp_foreign_spy_ring: {
    title: 'Foreign Spy Ring Discovered',
    body: 'Counter-intelligence operatives have uncovered a network of Valdrian agents operating within the capital. The ring has been gathering information on troop deployments, fortification plans, and courtly alliances. Your advisors debate whether to crush the network outright or exploit it for your own ends.',
    choices: {
      dismantle_network: 'Dismantle the Network',
      surveil_and_exploit: 'Monitor and Exploit',
      expel_suspects: 'Quietly Expel Suspects',
    },
  },
  evt_exp_esp_blackmail_discovery: {
    title: 'Compromising Documents Uncovered',
    body: 'Your agents have discovered documents revealing that a prominent noble has been secretly corresponding with foreign interests, promising favors in exchange for personal enrichment. The evidence is damning, and how you wield it will shape the balance of power at court.',
    choices: {
      confront_noble_privately: 'Confront Privately',
      use_leverage_quietly: 'Use as Leverage',
      destroy_evidence: 'Destroy the Evidence',
    },
  },
  evt_exp_esp_intercepted_dispatches: {
    title: 'Intercepted Diplomatic Dispatches',
    body: 'Your agents have intercepted sealed dispatches between Valdris and a minor border principality, detailing plans that could threaten Arenthal\'s southern trade routes. The contents are valuable to multiple parties, and how you share — or withhold — this intelligence will have diplomatic consequences.',
    choices: {
      share_with_arenthal: 'Share with Arenthal',
      confront_valdris: 'Confront Valdris Directly',
      file_intelligence: 'File and Monitor',
    },
  },
  evt_exp_esp_mole_hunt: {
    title: 'Suspicion of a Mole',
    body: 'Troubling patterns have emerged in recent intelligence failures — operations compromised, agents exposed, and safe houses discovered. Your spymaster suspects a mole has penetrated your inner circle, but identifying the traitor without alerting them will require careful and costly measures.',
    choices: {
      thorough_investigation: 'Launch Full Investigation',
      controlled_leak_test: 'Test with False Intelligence',
      tighten_protocols: 'Tighten Security Protocols',
    },
  },
  evt_exp_esp_defector_opportunity: {
    title: 'An Arenthalian Defector',
    body: 'A senior official from Arenthal\'s intelligence apparatus has made contact through back channels, offering to defect to your kingdom. The official claims to possess detailed knowledge of Arenthal\'s military capabilities and diplomatic strategy, but granting asylum will strain relations.',
    choices: {
      grant_asylum: 'Grant Asylum',
      debrief_and_return: 'Debrief and Return',
      refuse_defector: 'Refuse the Defector',
    },
  },

  // ============================================================
  // Serious (5)
  // ============================================================
  evt_exp_esp_assassination_plot: {
    title: 'Assassination Plot Uncovered',
    body: 'Your spymaster has uncovered a plot against the royal person — a conspiracy involving disaffected nobles and possibly foreign agents. The plotters have already procured poison and suborned members of the household guard. Swift action is required, though the scope of the conspiracy remains unclear.',
    choices: {
      preemptive_arrests: 'Order Preemptive Arrests',
      double_royal_guard: 'Double the Royal Guard',
      set_counter_trap: 'Set a Counter-Trap',
    },
  },
  evt_exp_esp_counter_espionage_raid: {
    title: 'Counter-Espionage Operation',
    body: 'Intelligence has pinpointed a Valdrian safe house operating brazenly within your border regions, serving as a hub for enemy agents and stolen documents. Your military commanders propose a raid, but the operation\'s scale and diplomatic fallout require careful consideration.',
    choices: {
      full_scale_raid: 'Launch Full Raid',
      surgical_strike: 'Conduct Surgical Strike',
      diplomatic_protest: 'Lodge Formal Protest',
    },
  },
  evt_exp_esp_poisoning_attempt: {
    title: 'Poison in the Royal Kitchens',
    body: 'A vigilant servant has discovered a vial of slow-acting venom concealed near the royal kitchens. The attempted poisoning was thwarted by chance alone. The culprit remains unknown, and fear grips the court as suspicion falls upon servants, nobles, and foreign agents alike.',
    choices: {
      purge_kitchen_staff: 'Purge the Kitchen Staff',
      hire_royal_taster: 'Appoint a Royal Taster',
      trace_poison_source: 'Trace the Poison\'s Origin',
    },
  },
  evt_exp_esp_intelligence_failure: {
    title: 'A Catastrophic Intelligence Failure',
    body: 'A major operation has ended in disaster — your agents abroad have been exposed and captured, safe houses compromised, and a year\'s worth of carefully cultivated intelligence networks dismantled. The kingdom\'s eyes and ears beyond its borders have gone dark at the worst possible time.',
    choices: {
      rebuild_network: 'Rebuild from Scratch',
      scapegoat_spymaster: 'Replace the Spymaster',
      accept_losses: 'Accept the Losses',
    },
  },
  evt_exp_esp_secret_alliance_exposed: {
    title: 'Secret Alliance Brought to Light',
    body: 'Your covert understanding with Arenthal — kept carefully hidden from Valdris — has been exposed through unknown means. Valdrian ambassadors are furious, and even Arenthal\'s diplomats are nervous about the revelation. The court must decide how to navigate this diplomatic crisis.',
    choices: {
      publicly_confirm: 'Publicly Confirm the Alliance',
      deny_and_distance: 'Deny and Create Distance',
      reframe_as_trade_pact: 'Reframe as a Trade Agreement',
    },
  },

  // ============================================================
  // Critical (3)
  // ============================================================
  evt_exp_esp_enemy_infiltration: {
    title: 'Deep Enemy Infiltration',
    body: 'The unthinkable has been confirmed: enemy operatives have penetrated the highest levels of the kingdom\'s administration. Critical military plans, treasury figures, and diplomatic correspondence have been flowing to hostile powers for months. The rot runs deep, and excising it will be painful.',
    choices: {
      martial_law_purge: 'Declare Martial Law and Purge',
      targeted_counter_ops: 'Targeted Counter-Operations',
      negotiate_withdrawal: 'Negotiate Their Withdrawal',
    },
  },
  evt_exp_esp_underground_resistance: {
    title: 'Underground Resistance Movement',
    body: 'An organized resistance movement has taken root among the common folk, operating through hidden cells and secret meeting places. Their grievances are real, but their methods — sabotage, intimidation, and covert recruitment — pose a grave threat to order. Your spymaster warns that the movement is growing rapidly.',
    choices: {
      infiltrate_resistance: 'Infiltrate the Movement',
      address_grievances: 'Address Their Grievances',
      military_crackdown: 'Military Crackdown',
    },
  },
  evt_exp_esp_military_secrets_stolen: {
    title: 'Military Secrets Stolen',
    body: 'A breach of devastating proportions has occurred: detailed plans for the kingdom\'s frontier fortifications, garrison strengths, and defensive strategies have been stolen and smuggled to Arenthal. Winter\'s cover aided the thieves, and by now the intelligence may already be in enemy hands.',
    choices: {
      change_all_plans: 'Overhaul All Defenses',
      hunt_the_thief: 'Hunt Down the Thief',
      feed_false_plans: 'Plant False Replacements',
    },
  },
};
