// Phase 7 — Wave-2 Crisis Text: Disasters & Material Failures.

import type { EventTextEntry } from '../../events';

export const EXPANSION_WAVE_2_CRISES_DISASTER_TEXT: Record<string, EventTextEntry> = {
  evt_exp_w2_plague_variant: {
    title: 'A New Pestilence Stalks the Quarters',
    body: 'A pox unlike the familiar ones has broken out in the poorer districts. Physicians argue over its origin; the monks speak of old prayers. Whatever its cause, the sickness will not wait for the court to deliberate. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      quarantine_afflicted_quarters: 'Quarantine the Afflicted Quarters',
      open_hospitals_for_all: 'Open Hospitals to All',
      pray_and_wait: 'Pray and Wait',
    },
  },
  evt_exp_w2_naval_disaster: {
    title: 'The Fleet Broken on the Shoal',
    body: 'A sudden storm has smashed a third of the royal fleet against the reefs. The admiral blames the cartographers; the cartographers blame the admiral. Either way, vessels and cargo lie in the shallows and the coast is open to opportunists. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      fund_emergency_shipyard: 'Fund an Emergency Shipyard',
      recall_merchant_vessels: 'Recall Merchant Vessels',
      blame_the_captain: 'Blame the Captain',
    },
  },
  evt_exp_w2_library_fire: {
    title: 'The Great Library Burns',
    body: 'Fire has consumed the eastern wing of the royal library in a single night. Irreplaceable codices, registers of title, and the sole copies of three ancient chronicles are gone. The scribes stand among the ashes and wait for direction. The {class_plural} await the crown\'s reply.',
    choices: {
      commission_scribes_to_restore: 'Commission Scribes to Restore',
      import_foreign_copies: 'Import Foreign Copies',
      accept_the_loss: 'Accept the Loss',
    },
  },
  evt_exp_w2_well_poisoning: {
    title: 'Poison in the Public Wells',
    body: 'Three wells in the lower city have been found fouled with something that is not the slop of common waste. A handful have already sickened. Fear is spreading faster than the sickness; the people want someone named. The {class_plural} are watching every move of the court. Word comes most urgently from {region}.',
    choices: {
      hunt_the_saboteurs: 'Hunt the Saboteurs',
      quietly_replace_the_wells: 'Quietly Replace the Wells',
      blame_a_rival: 'Blame a Rival',
    },
  },
  evt_exp_w2_salt_shortage: {
    title: 'The Salt Has Run Short',
    body: 'Winter stores cannot be cured without salt, and the caravans have not come through. Merchants hoard what little remains; housewives riot at the markets. The choice is between opening royal stocks, opening the trade roads, or taxing the last of the supply. The {class_plural} await the crown\'s reply.',
    choices: {
      ration_royal_stocks: 'Ration the Royal Stocks',
      open_the_salt_roads: 'Open the Salt Roads',
      impose_a_salt_tax: 'Impose a Salt Tax',
    },
  },
};
