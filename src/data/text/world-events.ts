// Phase 12 — World Event Display Text
// All display strings (titles, bodies, choice labels) for Phase 12 events.
// Kept separate from EVENT_TEXT because world events use a different internal
// data shape (WorldEventDefinition) — the bridge layer resolves `we_*` ids
// through this table.

export interface WorldEventTextEntry {
  title: string;
  body: string;
  choices: Record<string, string>;
}

export const WORLD_EVENT_TEXT: Record<string, WorldEventTextEntry> = {
  we_black_pox: {
    title: 'The Black Pox',
    body: 'Plague carts roll in from the ports. Whole districts are walled up; priests walk the streets ringing bells. Neighboring courts say the sickness jumps the river at night. What do we tell the city gates?',
    choices: {
      quarantine: 'Seal the infected districts',
      send_aid: 'Open the coffers and send aid to the afflicted',
      ignore: 'The Crown does not answer to plague',
    },
  },
  we_long_winter: {
    title: 'The Long Winter',
    body: 'Snow fell in the second month and has not lifted. Rivers are ice to the seabed. Our reeves say stores will not hold until thaw, and the border lords are asking the same questions of their own granaries.',
    choices: {
      stockpile: 'Buy grain at any price while caravans still move',
      open_granaries: 'Throw open the royal granaries to the people',
      tax_relief: 'Suspend the winter levy',
    },
  },
  we_great_devaluation: {
    title: 'The Great Devaluation',
    body: 'A silver hoard unearthed beyond the mountains has flooded every market between here and the sea. Coin buys less this month than last; our merchants mutter; foreign courts coin their own solutions.',
    choices: {
      debase_coinage: 'Match the devaluation at the royal mint',
      tighten_mint: 'Tighten the mint and restore coin purity',
      absorb_loss: 'The Crown absorbs the loss; let commerce breathe',
    },
  },
  we_pilgrim_movement: {
    title: 'The Pilgrim Road',
    body: 'Roads thicken with pilgrims bound for a new shrine the faithful call miraculous. They come from every realm; clergy beg for roads, inns, and the Crown\'s blessing. Neighboring sovereigns are making their own answer.',
    choices: {
      endorse: 'Endorse the pilgrimage; fund the roads',
      tax_pilgrims: 'Levy a pilgrim\'s toll at every crossing',
      forbid: 'Forbid the movement; turn travelers back',
    },
  },
  we_mercenary_uprising: {
    title: 'The Free Company',
    body: 'A mercenary host disbanded after the last war has not disbanded at all. They move as a kingdom without a crown, taking tribute in grain and coin from whoever cannot refuse. Our march lords want a decision.',
    choices: {
      hire_company: 'Hire the company into royal service',
      crush_them: 'Raise the levies and break them in the field',
      negotiate: 'Pay them to move along',
    },
  },
  we_comet_year: {
    title: 'The Comet Year',
    body: 'A streak of fire hangs in the night sky for a second week. Preachers call it judgment; philosophers call it a wanderer. Every court in the region is asked the same question: what does the Crown say it means?',
    choices: {
      proclaim_omen: 'Proclaim it a divine omen in our favor',
      dismiss: 'Dismiss it as a wandering star',
      fund_observatory: 'Fund an observatory and watch it carefully',
    },
  },
  we_heretical_doctrine: {
    title: 'The Heretical Doctrine',
    body: 'A schismatic teaching has crossed from the lowlands. Its preachers are patient, quiet, persuasive, and already in our market squares. The archbishop demands a trial; the commons defend them.',
    choices: {
      inquisition: 'Authorize an inquisition',
      tolerate: 'Tolerate the preachers',
      council_of_faith: 'Convene a council of faith',
    },
  },
  we_locust_years: {
    title: 'The Locust Years',
    body: 'The swarm came on a south wind and stayed. Field after field is stripped to stubble. The reeves estimate three lean harvests to come. Neighboring provinces are requesting, and refusing, the same things of their kings.',
    choices: {
      ration: 'Impose rationing across the realm',
      import_grain: 'Import grain from unaffected markets',
      levy_farms: 'Levy the surviving estates for the royal stores',
    },
  },
  we_trade_league: {
    title: 'The Trade League',
    body: 'A coalition of merchant cities proposes a regional league: common weights, common coin, common safe passage. Other kingdoms have already been asked. The league will form with or without us.',
    choices: {
      join_league: 'Join the league and commit to its terms',
      undercut: 'Undercut the league with crown charters',
      abstain: 'Abstain; watch how it settles',
    },
  },
  we_calling_crusade: {
    title: 'The Calling Crusade',
    body: 'A patriarch has called a crusade against the old enemy beyond the eastern waste. Every realm in the region is asked to send banners. The price of refusing is not yet clear, but the clergy can count sins.',
    choices: {
      answer_call: 'Answer the call in full; the banners ride',
      send_levies: 'Send token levies; keep the main host at home',
      decline: 'Decline; the Crown\'s war is its own',
    },
  },
};
