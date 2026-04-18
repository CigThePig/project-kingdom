// Phase 10 — Initiative definitions registry.
//
// Ten multi-season directives. Each is tagged to 2-3 CardTags so that
// relevant cards both advance progress and surface more often.

import type { InitiativeDefinition } from './definitions';

export type { InitiativeDefinition } from './definitions';

export const INITIATIVE_DEFINITIONS: Record<string, InitiativeDefinition> = {
  init_subjugate_eastern_marches: {
    id: 'init_subjugate_eastern_marches',
    title: 'Subjugate the Eastern Marches',
    description:
      'Bring the restless eastern holdings fully under the crown — by levy, by siege, by treaty where it serves.',
    category: 'military',
    turnsRequired: 18,
    cardWeightingBoost: ['military', 'aggressive', 'campaign', 'border'],
    perTurnPressureDelta: { militarism: 1, authority: 1 },
    completionReward: {
      stabilityDelta: 6,
      militaryMoraleDelta: 8,
      militaryCasteSatDelta: 6,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      militaryMoraleDelta: -8,
      militaryCasteSatDelta: -10,
      stabilityDelta: -3,
    },
    failureConditions: [
      { type: 'state_below', field: 'military.morale', threshold: 25 },
    ],
    payoffTitle: 'The Marches Bend the Knee',
    payoffBody:
      'After long seasons of campaigning, the eastern lords swear fealty in the great hall. The realm settles behind a firmer frontier.',
    rewardSummary: '+Stability, army morale, and a loyal martial caste.',
    penaltySummary: 'Army morale falls; the martial caste feels betrayed.',
  },

  init_found_university: {
    id: 'init_found_university',
    title: 'Found a University',
    description:
      'Endow a seat of learning — halls of philosophy, medicine, and the liberal arts, held under royal patronage.',
    category: 'cultural',
    turnsRequired: 16,
    cardWeightingBoost: ['cultural', 'scholarly', 'construction'],
    perTurnPressureDelta: { reform: 1, openness: 1 },
    completionReward: {
      culturalCohesionDelta: 10,
      clergySatDelta: 4,
      merchantSatDelta: 4,
      treasuryDelta: -40,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      culturalCohesionDelta: -6,
      clergySatDelta: -4,
    },
    failureConditions: [
      { type: 'state_below', field: 'treasury.balance', threshold: 40 },
    ],
    payoffTitle: 'Doors of the Academy Open',
    payoffBody:
      'The first scholars cross the threshold. Their lectures will echo through generations, and the crown has paid for every stone.',
    rewardSummary: 'Cultural cohesion surges; clergy and merchants patronise.',
    penaltySummary: 'Cultural standing slips; the project is remembered.',
  },

  init_royal_bank: {
    id: 'init_royal_bank',
    title: 'Establish a Royal Bank',
    description:
      'Found a chartered bank — royal deposits, backed bills, and a standardized currency across the great markets.',
    category: 'economic',
    turnsRequired: 20,
    cardWeightingBoost: ['economy', 'commercial', 'treasury', 'trade'],
    perTurnPressureDelta: { commerce: 1, reform: 1 },
    completionReward: {
      treasuryDelta: 80,
      merchantSatDelta: 10,
      nobilitySatDelta: 3,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      merchantSatDelta: -10,
      treasuryDelta: -20,
    },
    failureConditions: [
      { type: 'state_below', field: 'treasury.balance', threshold: 30 },
    ],
    payoffTitle: 'The Royal Bank Opens Its Doors',
    payoffBody:
      'Gold flows through the exchange; letters of credit cross the realm in days, not seasons. The crown\'s coin is trusted as never before.',
    rewardSummary: 'Treasury surges; merchants and nobility gain from trust.',
    penaltySummary: 'Merchants feel the cost of a promise broken.',
  },

  init_holy_synod: {
    id: 'init_holy_synod',
    title: 'Convene a Holy Synod',
    description:
      'Summon the prelates and theologians to settle matters of doctrine under royal auspices.',
    category: 'religious',
    turnsRequired: 14,
    cardWeightingBoost: ['religious', 'orthodox', 'reformed'],
    perTurnPressureDelta: { piety: 2 },
    completionReward: {
      faithDelta: 10,
      clergySatDelta: 10,
      heterodoxyDelta: -8,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      clergySatDelta: -12,
      heterodoxyDelta: 6,
      faithDelta: -5,
    },
    failureConditions: [
      { type: 'state_below', field: 'faithCulture.faith', threshold: 20 },
    ],
    payoffTitle: 'The Synod Proclaims the Creed',
    payoffBody:
      'The bishops, in unison, bless the crown. The realm\'s faith takes a firmer shape — and heterodoxy retreats into the margins.',
    rewardSummary: 'Faith strengthens; heresies recede; clergy are honoured.',
    penaltySummary: 'Clergy feel snubbed; heterodoxy quietly grows.',
  },

  init_grand_alliance: {
    id: 'init_grand_alliance',
    title: 'Forge a Grand Alliance',
    description:
      'Weave treaty, marriage, and shared cause into a sweeping alliance across the known kingdoms.',
    category: 'political',
    turnsRequired: 18,
    cardWeightingBoost: ['diplomatic', 'alliance', 'marriage', 'tribute'],
    perTurnPressureDelta: { openness: 2 },
    completionReward: {
      nobilitySatDelta: 6,
      stabilityDelta: 4,
      militaryMoraleDelta: 4,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      nobilitySatDelta: -8,
      stabilityDelta: -3,
    },
    failureConditions: [
      { type: 'state_below', field: 'stability.value', threshold: 25 },
    ],
    payoffTitle: 'The Signatures Dry on the Grand Pact',
    payoffBody:
      'Banners of five kingdoms hang together in the council hall. No throne in the known world stands alone — yours least of all.',
    rewardSummary: 'Nobility, stability, and army morale all lift.',
    penaltySummary: 'Nobility sneer at a failed diplomat.',
  },

  init_reform_coinage: {
    id: 'init_reform_coinage',
    title: 'Reform the Coinage',
    description:
      'Recall the old debased coin and issue a standard, bullion-backed currency across the realm.',
    category: 'economic',
    turnsRequired: 12,
    cardWeightingBoost: ['economy', 'treasury', 'administrative'],
    perTurnPressureDelta: { commerce: 1, authority: 1 },
    completionReward: {
      treasuryDelta: 40,
      merchantSatDelta: 6,
      stabilityDelta: 3,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      merchantSatDelta: -5,
      stabilityDelta: -2,
    },
    failureConditions: [],
    payoffTitle: 'The New Coin Rings True',
    payoffBody:
      'The first struck coins circulate. Merchants bite them, find them honest, and the markets breathe out.',
    rewardSummary: 'Treasury swells; merchants trust the coin.',
    penaltySummary: 'The aborted reform costs confidence.',
  },

  init_standing_navy: {
    id: 'init_standing_navy',
    title: 'Establish a Standing Navy',
    description:
      'Lay keels, build yards, and retain captains year-round — a permanent fleet, not a wartime levy.',
    category: 'military',
    turnsRequired: 22,
    cardWeightingBoost: ['military', 'construction', 'recruitment', 'trade'],
    perTurnPressureDelta: { militarism: 1, commerce: 1 },
    completionReward: {
      militaryReadinessDelta: 10,
      militaryEquipmentDelta: 8,
      merchantSatDelta: 6,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      militaryReadinessDelta: -6,
      merchantSatDelta: -4,
      treasuryDelta: -20,
    },
    failureConditions: [
      { type: 'state_below', field: 'treasury.balance', threshold: 30 },
    ],
    payoffTitle: 'The Fleet Puts to Sea',
    payoffBody:
      'Pennants flare in the harbour. The crown\'s ships, in crown\'s pay, stand between the realm and every sea-road.',
    rewardSummary: 'Naval readiness & equipment climb; merchants rejoice.',
    penaltySummary: 'Dockyards go quiet; coffers bled for nothing.',
  },

  init_common_law: {
    id: 'init_common_law',
    title: 'Codify the Common Law',
    description:
      'Commission jurists to set down in one book what has always been custom — royal courts above baronial.',
    category: 'political',
    turnsRequired: 16,
    cardWeightingBoost: ['civic', 'legal', 'bureaucratic', 'administrative'],
    perTurnPressureDelta: { authority: 2, reform: 1 },
    completionReward: {
      stabilityDelta: 8,
      commonerSatDelta: 6,
      nobilitySatDelta: -3,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      stabilityDelta: -4,
      commonerSatDelta: -5,
    },
    failureConditions: [
      { type: 'state_below', field: 'stability.value', threshold: 25 },
    ],
    payoffTitle: 'The Codex Is Sealed',
    payoffBody:
      'Bound in red leather, the new code is read aloud in every shire. The commons stand a little straighter; the barons chafe at the margins.',
    rewardSummary: 'Stability rises; commoners gain — nobility less so.',
    penaltySummary: 'Half-finished laws unsettle the shires.',
  },

  init_great_cathedral: {
    id: 'init_great_cathedral',
    title: 'Sponsor the Great Cathedral',
    description:
      'Break ground on a cathedral to eclipse all others — decades of labour, consecrated in royal name.',
    category: 'religious',
    turnsRequired: 24,
    cardWeightingBoost: ['religious', 'construction', 'cultural'],
    perTurnPressureDelta: { piety: 1, authority: 1 },
    completionReward: {
      faithDelta: 12,
      culturalCohesionDelta: 8,
      clergySatDelta: 8,
      treasuryDelta: -60,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      faithDelta: -6,
      clergySatDelta: -10,
      culturalCohesionDelta: -4,
    },
    failureConditions: [
      { type: 'state_below', field: 'treasury.balance', threshold: 40 },
    ],
    payoffTitle: 'The Cathedral Is Consecrated',
    payoffBody:
      'Pilgrims line every road. The bells, when struck, shake dust from every tower in the realm. Your name is carved above the western door.',
    rewardSummary: 'Faith, culture, and clerical favour all flower.',
    penaltySummary: 'Unfinished spires shame the realm; faith falters.',
  },

  init_scour_frontier: {
    id: 'init_scour_frontier',
    title: 'Scour the Frontier of Banditry',
    description:
      'Systematic patrols and sweeps until no brigand band dares keep a camp within a week\'s ride of the roads.',
    category: 'political',
    turnsRequired: 14,
    cardWeightingBoost: ['military', 'border', 'public_order', 'civic'],
    perTurnPressureDelta: { authority: 1, militarism: 1 },
    completionReward: {
      stabilityDelta: 6,
      commonerSatDelta: 6,
      merchantSatDelta: 4,
    },
    unlocksKingdomFeature: null,
    abandonPenalty: {
      stabilityDelta: -4,
      commonerSatDelta: -5,
      merchantSatDelta: -3,
    },
    failureConditions: [
      { type: 'state_below', field: 'military.morale', threshold: 25 },
    ],
    payoffTitle: 'The Roads Run Safe',
    payoffBody:
      'Bandit heads above the gatehouses; travellers on the roads at dusk without a guard. The crown\'s reach lengthens.',
    rewardSummary: 'Stability lifts; commoners and merchants breathe easier.',
    penaltySummary: 'Banditry regrows; commoners and merchants suffer.',
  },
};

/** All definition IDs in registration order (used by opportunity offers). */
export const INITIATIVE_DEFINITION_IDS: string[] = Object.keys(
  INITIATIVE_DEFINITIONS,
);
