import type { EventTextEntry } from '../events';

export const POPULATION_EVENT_TEXT: Record<string, EventTextEntry> = {
  // ============================================================
  // Migration
  // ============================================================
  evt_pop_migration_inflow: {
    title: 'Settlers at the Gates',
    body: 'Word of the kingdom\'s prosperity has spread. Families from neighboring lands arrive at the borders seeking new lives — farmers, craftsmen, and laborers willing to swear fealty in exchange for a plot of land and the promise of safety.',
    choices: {
      welcome_settlers: 'Welcome the Settlers',
      direct_to_frontier: 'Direct Them to the Frontier',
      let_them_settle: 'Let Them Settle Freely',
    },
  },
  evt_pop_migration_petition: {
    title: 'Petition Against Exodus',
    body: 'Village elders petition the crown with alarming news: families are packing their belongings and leaving for neighboring kingdoms. They cite heavy taxes, scarce food, or the threat of war. If the trend continues, entire communities may hollow out.',
    choices: {
      reduce_taxes_briefly: 'Reduce Taxes Briefly',
      improve_conditions: 'Improve Living Conditions',
      dismiss_concerns: 'Dismiss Their Concerns',
    },
  },
  evt_pop_migration_crisis: {
    title: 'Mass Exodus',
    body: 'The trickle has become a flood. Hundreds of families stream toward the borders, their carts laden with everything they own. The kingdom\'s population is hemorrhaging, and those who remain grow more desperate with each departure.',
    choices: {
      seal_borders: 'Seal the Borders',
      emergency_relief: 'Provide Emergency Relief',
      let_them_leave: 'Let Them Leave',
    },
  },

  // ============================================================
  // Overcrowding
  // ============================================================
  evt_pop_overcrowding_petition: {
    title: 'Crowded Quarters',
    body: 'The cities groan under the weight of their inhabitants. Multiple families share single rooms, streets overflow with refuse, and tempers flare in the cramped quarters. Citizens petition for relief from the overcrowding that strains every resource.',
    choices: {
      expand_housing: 'Expand Housing',
      resettle_frontier: 'Resettle to the Frontier',
      ignore_crowding: 'Ignore the Crowding',
    },
  },
  evt_pop_overcrowding_crisis: {
    title: 'Urban Squalor',
    body: 'The overcrowding has reached a breaking point. Disease festers in the packed tenements, clean water is a luxury, and fights erupt daily over the barest scraps of space. Without drastic action, the cities will become breeding grounds for plague and unrest.',
    choices: {
      emergency_construction: 'Emergency Construction Program',
      forced_relocation: 'Force Relocation to Rural Areas',
      endure_squalor: 'Endure the Squalor',
    },
  },

  // ============================================================
  // Class Mobility
  // ============================================================
  evt_pop_merchant_titles: {
    title: 'Merchants Seek Titles',
    body: 'A delegation of the kingdom\'s wealthiest merchants presents itself before the throne. They offer generous contributions to the treasury in exchange for minor noble titles — a foothold in the aristocracy that the old blood views with suspicion.',
    choices: {
      grant_titles: 'Grant the Titles',
      deny_titles: 'Deny Their Request',
    },
  },
  evt_pop_conscription_harvest: {
    title: 'Conscription During Harvest',
    body: 'The military\'s need for fresh recruits has collided with the harvest season. Commoners drafted into the army leave fields half-reaped, threatening food supplies. The generals insist the troops are needed; the farmers insist the grain is needed more.',
    choices: {
      proceed_conscription: 'Proceed with Conscription',
      delay_conscription: 'Delay Until After Harvest',
    },
  },
  evt_pop_clergy_exodus: {
    title: 'Clergy Departing',
    body: 'Dissatisfied with the crown\'s religious policies, a growing number of priests and monks are leaving the kingdom. Churches go unattended, the faithful lose their spiritual shepherds, and the faith that binds the people weakens with each departure.',
    choices: {
      offer_clergy_stipends: 'Offer Clergy Stipends',
      let_clergy_depart: 'Let Them Depart',
    },
  },

  // ============================================================
  // Demographics
  // ============================================================
  evt_pop_boom: {
    title: 'Population Boom',
    body: 'The kingdom flourishes. Well-fed, secure, and hopeful, families grow larger with each passing season. Children fill the streets and schools, and the future seems bright. But more mouths mean greater demands on food and housing.',
    choices: {
      invest_in_growth: 'Invest in Infrastructure',
      celebrate_prosperity: 'Celebrate the Prosperity',
    },
  },
  evt_pop_decline: {
    title: 'Population in Decline',
    body: 'The kingdom\'s numbers are falling. Deaths outpace births, the young leave for greener pastures, and villages that once bustled with life grow quiet. Fields lie fallow for want of hands to work them, and the military struggles to fill its ranks.',
    choices: {
      encourage_families: 'Encourage Larger Families',
      attract_immigrants: 'Attract Immigrants',
      accept_decline: 'Accept the Decline',
    },
  },
};
