// Phase 7 — Wave-2 Crisis Text: Social Tensions.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_SOCIAL_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_food_riot_escalation: {
    title: 'Bread Riots Turn Violent',
    body: 'The bread queues have become bread riots across {region}. In two market towns the granaries have been stormed; in a third the royal factor was beaten and left in the road. The city guard report that one more failed harvest will set the whole country alight.',
    choices: {
      open_the_royal_granaries: 'Open the Royal Granaries',
      post_guards_at_the_markets: 'Post Guards at the Markets',
      hang_the_ringleaders: 'Hang the Ringleaders',
    },
  },
  evt_exp_w2_bonded_labor_revolt: {
    title: 'The Bonded Refuse the Harvest',
    body: 'Bonded labourers on three of the great estates in {region} have downed their tools and begun to march toward the capital with a list of grievances. The lords demand the rebellion be broken; the reformers demand a hearing; both watch you closely.',
    choices: {
      crush_with_the_levy: 'Crush with the Levy',
      grant_limited_emancipation: 'Grant a Limited Emancipation',
      negotiate_better_terms: 'Negotiate Better Terms',
    },
  },
  evt_exp_w2_mercenary_defection: {
    title: 'The Free Companies Are Tempted Away',
    body: 'A neighbouring realm has offered twice the wage to the free companies on the frontier. Two captains have already struck their tents and ridden south. If the rest follow, the border is bare.',
    choices: {
      match_the_foreign_wages: 'Match the Foreign Wages',
      brand_them_as_deserters: 'Brand Them as Deserters',
      recruit_local_replacements: 'Recruit Local Replacements',
    },
  },
  evt_exp_w2_monetary_crisis: {
    title: 'The Coffers Ring Hollow',
    body: 'The exchequer reports that, at the current rate of spending, the royal purse will not meet next month\'s obligations. The choice among debasement, borrowing, and seizure must be made this fortnight.',
    choices: {
      debase_the_coinage: 'Debase the Coinage',
      borrow_from_the_merchants: 'Borrow from the Merchants',
      seize_the_old_hoards: 'Seize the Old Hoards',
    },
  },
};
