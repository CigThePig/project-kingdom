import type { EventTextEntry } from '../events';

export const SOCIAL_CONDITION_EVENT_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Banditry
  // ============================================================
  evt_social_banditry_mild: {
    title: 'Highwaymen on the Roads',
    body: 'Reports trickle in from merchants and travelers: armed bands have begun ambushing caravans on the outer roads. The boldest strike within sight of village gates. Trade slows as fear spreads along the kingdom\'s arteries.',
    choices: {
      deploy_patrols: 'Deploy Road Patrols',
      arm_merchant_caravans: 'Arm the Merchant Caravans',
      ignore_bandits: 'Ignore the Reports',
    },
  },
  evt_social_banditry_moderate: {
    title: 'Brigand Plague',
    body: 'What began as scattered robberies has grown into organized brigandage. Entire stretches of road are now controlled by bandit captains who demand tolls from all who pass. Villages bolt their gates at dusk, and trade has slowed to a trickle.',
    choices: {
      military_sweep: 'Launch a Military Sweep',
      negotiate_brigands: 'Negotiate with the Brigand Captains',
      fortify_trade_routes: 'Fortify the Trade Routes',
    },
  },
  evt_social_banditry_severe: {
    title: 'The Brigand Kingdom',
    body: 'The bandits have grown so bold they\'ve established their own courts and territories in the wilds. Entire regions have been cut off from the crown\'s protection. Some desperate commoners have joined the outlaws, seeing more safety in lawlessness than in the king\'s peace. Word comes most urgently from {region}.',
    choices: {
      marshal_campaign: 'Marshal a Punitive Campaign',
      offer_amnesty: 'Offer General Amnesty',
      abandon_outer_roads: 'Abandon the Outer Roads',
    },
  },
  evt_social_banditry_resolved: {
    title: 'Roads Made Safe',
    body: 'The bandit threat has been quelled. Merchants once again travel the roads without fear, and the kingdom\'s trade routes hum with renewed activity. The countryside breathes easier.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },

  // ============================================================
  // Corruption
  // ============================================================
  evt_social_corruption_mild: {
    title: 'Whispers of Graft',
    body: 'Tax collectors return with lighter purses than expected, and public works cost far more than they should. The nobility grows fat on skimmed revenues while the crown\'s coffers thin. The whispers are quiet, but persistent.',
    choices: {
      launch_investigation: 'Launch an Investigation',
      public_denouncement: 'Publicly Denounce the Corrupt',
      tolerate_graft: 'Tolerate the Graft',
    },
  },
  evt_social_corruption_moderate: {
    title: 'A Rot in the Court',
    body: 'Corruption has sunk deep roots into the kingdom\'s administration. Officials sell appointments, judges accept bribes, and entire ledgers of collected silver vanish into private estates. The common folk seethe at the injustice, while the guilty nobles grow ever bolder.',
    choices: {
      purge_corrupt_officials: 'Purge the Corrupt Officials',
      reform_tax_collection: 'Reform Tax Collection',
      accept_status_quo: 'Accept the Status Quo',
    },
  },
  evt_social_corruption_severe: {
    title: 'Entrenched Corruption',
    body: 'The corruption is no longer a disease — it is the system itself. Every office is bought and sold, every law has a price, and the treasury hemorrhages gold into noble coffers. The people have lost all hope that the crown can or will act. Only the most drastic measures can root out what has become entrenched. Word comes most urgently from {region}.',
    choices: {
      royal_tribunal: 'Convene a Royal Tribunal',
      co_opt_corrupt_lords: 'Co-opt the Corrupt Lords',
      endure_corruption: 'Endure the Corruption',
    },
  },
  evt_social_corruption_resolved: {
    title: 'Corruption Curtailed',
    body: 'Through sustained effort, the worst of the corruption has been rooted out. Tax revenues return to expected levels, and the people regain some measure of trust in the crown\'s administration. The scars remain, but the bleeding has stopped.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },

  // ============================================================
  // Unrest
  // ============================================================
  evt_social_unrest_mild: {
    title: 'Murmurs of Discontent',
    body: 'The mood in the taverns and market squares has turned sour. Workers grumble about their lot, merchants complain of heavy-handed policies, and even the clergy speak of the people\'s suffering. The discontent has not yet found a leader, but the kindling is dry.',
    choices: {
      address_grievances: 'Address the Grievances',
      increase_guard_presence: 'Increase Guard Presence',
      ignore_grumbling: 'Ignore the Grumbling',
    },
  },
  evt_social_unrest_moderate: {
    title: 'Riots in the Streets',
    body: 'The discontent has boiled over into open violence. Mobs clash with the city guard, market stalls are overturned, and angry crowds gather before the castle gates demanding change. Workshops have fallen idle as laborers join the unrest. The kingdom teeters on a knife\'s edge.',
    choices: {
      hold_public_festival: 'Hold a Public Festival',
      suppress_riots: 'Suppress the Riots by Force',
      make_concessions: 'Make Concessions',
    },
  },
  evt_social_unrest_severe: {
    title: 'Rebellion Brewing',
    body: 'What began as scattered protests has crystallized into organized resistance. Self-proclaimed leaders rally the disaffected under banners of their own, demanding the overthrow of the current order. Barricades block city streets, and parts of the countryside have declared themselves beyond the crown\'s authority. Word comes most urgently from {region}.',
    choices: {
      declare_martial_law: 'Declare Martial Law',
      negotiate_rebel_leaders: 'Negotiate with Rebel Leaders',
      abdicate_demands: 'Concede to Their Demands',
    },
  },
  evt_social_unrest_resolved: {
    title: 'Peace Restored',
    body: 'The fires of unrest have burned themselves out. Whether through force, negotiation, or sheer exhaustion, the people have returned to their daily lives. The streets are quiet again, though the memory of upheaval lingers.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },

  // ============================================================
  // Criminal Underworld
  // ============================================================
  evt_social_criminal_mild: {
    title: 'Shadows in the Market',
    body: 'A network of thieves and smugglers has taken root in the kingdom\'s trading quarters. Stolen goods move through back-alley bazaars, and pickpockets grow brazen in the crowded markets. The criminal element chips away at the kingdom\'s security and treasury alike.',
    choices: {
      fund_undercover_ops: 'Fund Undercover Operations',
      legalize_and_tax: 'Legalize and Tax the Trade',
      look_the_other_way: 'Look the Other Way',
    },
  },
  evt_social_criminal_moderate: {
    title: 'The Syndicate Grows',
    body: 'The criminal underworld has organized into powerful syndicates that match the crown\'s own intelligence network. They control black markets, run protection rackets, and have even begun to corrupt the city guard. Counter-intelligence operations are compromised, and the treasury bleeds from a thousand small cuts.',
    choices: {
      crack_down_syndicates: 'Crack Down on the Syndicates',
      recruit_informants: 'Recruit Criminal Informants',
      tolerate_black_market: 'Tolerate the Black Market',
    },
  },
  evt_social_criminal_severe: {
    title: 'A Kingdom Beneath the Kingdom',
    body: 'The syndicates no longer skulk in shadow — they parade through the docks with their own sigils. Customs officers answer to their paymasters before the crown, judges find silver pressed into their palms before verdicts are rendered, and whole harbors run on smuggled tonnage. The kingdom has, in all but name, a second sovereign. Word comes most urgently from {region}.',
    choices: {
      martial_purge: 'Order a Martial Purge',
      bribe_the_bosses: 'Buy the Bosses\' Cooperation',
      cede_the_ports: 'Cede the Ports in All But Name',
    },
  },
  evt_social_criminal_resolved: {
    title: 'Underworld Dismantled',
    body: 'The criminal networks have been broken or driven underground. The markets feel safer, intelligence operations resume their effectiveness, and the treasury no longer suffers the constant drain of organized theft. Order has been restored to the shadows.',
    choices: {
      acknowledge: 'Acknowledge',
    },
  },
};
