// Phase 7 — Wave-2 Crisis Text: Strange Phenomena.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_PHENOMENA_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_strange_phenomenon: {
    title: 'A Strange Light in the Fields',
    body: 'For three nights running a pale light has walked the reed-fields outside a southern hamlet. The commons declare it a saint; the bishop suspects a trick; the scholars have asked permission to sit up with torches and notebooks. The {class_plural} await the crown\'s reply.',
    choices: {
      declare_it_a_miracle: 'Declare It a Miracle',
      call_it_a_trick_of_light: 'Call It a Trick of Light',
      commission_scholars: 'Commission Scholars',
    },
  },
  evt_exp_w2_drought_escalation: {
    title: 'The Long Drought Deepens',
    body: 'The summer has brought no rain. The rivers run low; the great mill-wheels stand still; the cattle are driven further each day to find water. The commons look to the sky and then to the palace. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      dig_emergency_wells: 'Dig Emergency Wells',
      ration_water_strictly: 'Ration Water Strictly',
      lead_a_rain_procession: 'Lead a Rain Procession',
    },
  },
  evt_exp_w2_explored_ruins: {
    title: 'An Ancient Ruin Unearthed',
    body: 'A landslide has opened an old doorway in the cliffs above a quarry. Behind it the workers found carved stones and a sealed inner chamber. The bishop wants it blessed; the masons want it stripped; the scholars want it dug open. None will wait. The {class_plural} await the crown\'s reply.',
    choices: {
      fund_a_scholarly_expedition: 'Fund a Scholarly Expedition',
      strip_for_building_stone: 'Strip for Building Stone',
      seal_the_entrance: 'Seal the Entrance',
    },
  },
  evt_exp_w2_vassal_succession: {
    title: 'A Vassal House Divided',
    body: 'The old lord of a border fief has died and left two sons at odds. The elder has the law; the younger has the affection of the house guard and the local tenants. Whichever you confirm, the other will turn his face from the Crown. The {class_plural} await the crown\'s reply.',
    choices: {
      confirm_the_elder_heir: 'Confirm the Elder Heir',
      back_the_capable_younger: 'Back the Capable Younger',
      take_the_fief_in_hand: 'Take the Fief in Hand',
    },
  },
};
