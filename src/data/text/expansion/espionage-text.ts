import type { EventTextEntry } from '../events';

export const EXPANSION_ESPIONAGE_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Informational (3)
  // ============================================================
  evt_exp_esp_coded_correspondence: {
    title: 'Coded Correspondence Intercepted',
    body: '{spymaster_or_fallback} brings word of a bundle of letters written in an unfamiliar cipher, intercepted from a merchant traveling the borderlands. The correspondence may contain intelligence of considerable value, but deciphering it will require skilled codebreakers and a modest investment of coin.',
    choices: {
      fund_codebreakers: 'Fund Codebreakers',
      archive_for_later: 'Archive for Later',
    },
  },
  evt_exp_esp_informant_tip: {
    title: 'A Whisper from the Shadows',
    body: "One of {spymaster_or_fallback}'s informants has surfaced with a fragment of intelligence regarding troop movements along the northern frontier. The information appears credible, though the informant requests compensation for the personal risk undertaken in acquiring it.",
    choices: {
      reward_informant: 'Reward the Informant',
      note_intelligence: 'Note the Intelligence',
    },
  },
  evt_exp_esp_spy_equipment_advance: {
    title: 'Advances in Covert Craft',
    body: "A guild of skilled artisans has developed improved tools for clandestine work — concealed writing implements, undetectable lock mechanisms, and disguises of remarkable quality. {spymaster_or_fallback} would gladly equip the crown's agents, though their services do not come cheaply. The {class_plural} await the crown's reply.",
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
    body: "{spymaster_or_fallback} presents a delicate situation: one of your agents embedded in {ruler}'s court has been approached to serve as a double agent. The opportunity could yield extraordinary intelligence, but the risks of exposure and disinformation are considerable.",
    choices: {
      turn_agent_double: 'Accept the Double Role',
      extract_and_debrief: 'Extract and Debrief',
      feed_disinformation: 'Feed False Intelligence',
    },
  },
  evt_exp_esp_foreign_spy_ring: {
    title: 'Foreign Spy Ring Discovered',
    body: "{spymaster_or_fallback} brings a dossier before the throne: a network of {neighbor_short}'s agents has been operating within the capital under {ruler}'s direction. The ring has been gathering information on troop deployments, fortification plans, and courtly alliances. Your advisors debate whether to crush the network outright or exploit it for your own ends.{inter_rival_note}",
    choices: {
      dismantle_network: 'Dismantle the Network',
      surveil_and_exploit: 'Monitor and Exploit',
      expel_suspects: 'Quietly Expel Suspects',
    },
  },
  evt_exp_esp_blackmail_discovery: {
    title: 'Compromising Documents Uncovered',
    body: "{spymaster_or_fallback}'s agents have discovered documents revealing that a prominent noble has been secretly corresponding with {ruler_full}, promising favors in exchange for personal enrichment. The evidence is damning, and how you wield it will shape the balance of power at court. The {class_plural} await the crown's reply.",
    choices: {
      confront_noble_privately: 'Confront Privately',
      use_leverage_quietly: 'Use as Leverage',
      destroy_evidence: 'Destroy the Evidence',
    },
  },
  evt_exp_esp_intercepted_dispatches: {
    title: 'Intercepted Diplomatic Dispatches',
    body: "{spymaster_or_fallback}'s agents have intercepted sealed dispatches from {capital} to a minor border principality, detailing plans by {ruler_full} that could threaten regional trade routes. The contents are valuable to multiple parties, and how you share — or withhold — this intelligence will have diplomatic consequences.",
    choices: {
      share_with_arenthal: 'Share with Arenthal',
      confront_valdris: 'Confront Valdris Directly',
      file_intelligence: 'File and Monitor',
    },
  },
  evt_exp_esp_mole_hunt: {
    title: 'Suspicion of a Mole',
    body: 'Troubling patterns have emerged in recent intelligence failures — operations compromised, agents exposed, and safe houses discovered. {spymaster_or_fallback} suspects a mole has penetrated your inner circle, but identifying the traitor without alerting them will require careful and costly measures.',
    choices: {
      thorough_investigation: 'Launch Full Investigation',
      controlled_leak_test: 'Test with False Intelligence',
      tighten_protocols: 'Tighten Security Protocols',
    },
  },
  evt_exp_esp_defector_opportunity: {
    title: 'A Defector from {neighbor}',
    body: "A senior official from {ruler}'s intelligence apparatus has made contact through back channels, offering to defect to your kingdom. The official claims to possess detailed knowledge of {neighbor_short}'s military capabilities and diplomatic strategy, but granting asylum will strain relations with {capital}.",
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
    body: "{spymaster_or_fallback} has uncovered a plot against the royal person — a conspiracy involving disaffected nobles and possibly agents of {ruler_full}. The plotters have already procured poison and suborned members of the household guard. Swift action is required, though the scope of the conspiracy remains unclear.",
    choices: {
      preemptive_arrests: 'Order Preemptive Arrests',
      double_royal_guard: 'Double the Royal Guard',
      set_counter_trap: 'Set a Counter-Trap',
    },
  },
  evt_exp_esp_counter_espionage_raid: {
    title: 'Counter-Espionage Operation',
    body: "{spymaster_or_fallback} has pinpointed a safe house operated by {ruler_full} within your border regions, serving as a hub for enemy agents and stolen documents. Your military commanders propose a raid, but the operation's scale and diplomatic fallout require careful consideration. The {class_plural} are watching every move of the court.",
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
    body: "Your covert understanding with {neighbor} — kept carefully hidden from rivals — has been exposed through unknown means. Foreign ambassadors are furious, and even {ruler}'s diplomats are nervous about the revelation. The court must decide how to navigate this diplomatic crisis.",
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
    body: "The unthinkable has been confirmed: operatives loyal to {ruler_full} have penetrated the highest levels of the kingdom's administration. Critical military plans, treasury figures, and diplomatic correspondence have been flowing to {capital} for months. The rot runs deep, and excising it will be painful.",
    choices: {
      martial_law_purge: 'Declare Martial Law and Purge',
      targeted_counter_ops: 'Targeted Counter-Operations',
      negotiate_withdrawal: 'Negotiate Their Withdrawal',
    },
  },
  evt_exp_esp_underground_resistance: {
    title: 'Underground Resistance Movement',
    body: '{spymaster_or_fallback} warns of an organized resistance movement that has taken root among the commonfolk, operating through hidden cells and secret meeting places. Their grievances are real, but their methods — sabotage, intimidation, and covert recruitment — pose a grave threat to order, and the movement is growing rapidly.',
    choices: {
      infiltrate_resistance: 'Infiltrate the Movement',
      address_grievances: 'Address Their Grievances',
      military_crackdown: 'Military Crackdown',
    },
  },
  evt_exp_esp_military_secrets_stolen: {
    title: 'Military Secrets Stolen',
    body: "A breach of devastating proportions has occurred: detailed plans for the kingdom's frontier fortifications, garrison strengths, and defensive strategies have been stolen and smuggled to {capital}. Winter's cover aided the thieves, and by now the intelligence may already be in {ruler}'s hands. The {class_plural} are watching every move of the court.",
    choices: {
      change_all_plans: 'Overhaul All Defenses',
      hunt_the_thief: 'Hunt Down the Thief',
      feed_false_plans: 'Plant False Replacements',
    },
  },

  // --- 18. Spymaster Introduction ---
  evt_exp_esp_spymaster_introduction: {
    title: 'A Shadow at Court',
    body: "{spymaster_or_fallback} requests a private audience \u2014 a post your predecessor kept carefully hidden from public view. He speaks of watching eyes along every border and whispers gathered from foreign courts. His network, he admits, has grown thin of late and requires investment if it is to serve its new sovereign.",
    choices: {
      fund_intelligence_network: 'Fund the Intelligence Network',
      request_dossiers_on_neighbors: 'Request Dossiers on Our Neighbors',
      acknowledge_and_dismiss: 'Acknowledge and Dismiss',
    },
  },
};

// ============================================================
// Phase 2 — Rival Simulation Finding Labels
// ============================================================
// Short, player-facing sentences surfaced in intelligence reports when the
// target's RivalKingdomState reveals a condition worth noting. Keyed by the
// finding codes emitted by buildRivalSimulationFindings in espionage.ts.
// Template variable {neighbor} is resolved via bridge/nameResolver at render.

export const RIVAL_SIM_FINDING_TEXT: Record<string, { label: string; detail: string }> = {
  rival_treasury_strain: {
    label: 'Treasury Strain',
    detail: 'Your agents report that {neighbor}\'s coffers are running worryingly thin — tax collectors return half-empty, and the court\'s usual extravagances have quietly been curtailed.',
  },
  rival_food_shortage: {
    label: 'Food Shortage',
    detail: 'Whispers from {neighbor}\'s provinces speak of thin harvests and rising bread prices. Granaries your spies can see into stand notably low for the season.',
  },
  rival_internal_unrest: {
    label: 'Internal Unrest',
    detail: 'Your informants within {neighbor} describe a restive mood — unsanctioned gatherings, grumbling in the market squares, and nobles sending their families to safer estates.',
  },
  rival_expansionist_intent: {
    label: 'Expansionist Intent',
    detail: 'Maps are being drawn, levies are being quietly assessed, and {neighbor}\'s captains speak openly of lands not yet theirs. Your spymaster warns that patience may be running short.',
  },
  rival_succession_concern: {
    label: 'Succession Concern',
    detail: 'The question of who will rule {neighbor} after the present sovereign hangs in the air, and factions have already begun to form. Court is tense in a way no public pronouncement can hide.',
  },
};
