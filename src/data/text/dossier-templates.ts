// Dossier Templates — text data for the rival kingdom dossier system.
// All player-facing text for dossier cards lives here.

import { RivalPersonality, NeighborActionType } from '../../engine/types';

// ============================================================
// Ruler names — keyed by neighbor ID
// ============================================================

export const NEIGHBOR_RULER_NAMES: Record<string, string> = {
  neighbor_arenthal: 'Queen Elara of Arenthal',
  neighbor_valdris: 'Warlord Valdris the Iron',
  neighbor_krath: 'Chieftain Gorran of Krath',
};

// ============================================================
// Personality labels and descriptions
// ============================================================

export const PERSONALITY_LABELS: Record<RivalPersonality, string> = {
  [RivalPersonality.AmbitiousMilitaristic]: 'Ambitious & Militaristic',
  [RivalPersonality.MercantilePragmatic]: 'Mercantile & Pragmatic',
  [RivalPersonality.DevoutInsular]: 'Devout & Insular',
  [RivalPersonality.ExpansionistDiplomatic]: 'Expansionist & Diplomatic',
  [RivalPersonality.DefensiveCautious]: 'Defensive & Cautious',
};

export const PERSONALITY_DESCRIPTIONS: Record<RivalPersonality, string> = {
  [RivalPersonality.AmbitiousMilitaristic]:
    'This ruler values strength above all and is not afraid to use it. Expect demands, military posturing, and eventual aggression unless deterred.',
  [RivalPersonality.MercantilePragmatic]:
    'A pragmatic ruler who measures worth in gold. They prefer profitable partnerships to costly wars, but will ruthlessly exploit any perceived weakness.',
  [RivalPersonality.DevoutInsular]:
    'A deeply religious ruler who guards their borders and traditions fiercely. They resist foreign influence but rarely seek conquest beyond their own lands.',
  [RivalPersonality.ExpansionistDiplomatic]:
    'A cunning ruler who expands influence through alliances and soft power. Their diplomats are everywhere, and their ambitions are veiled in courtesy.',
  [RivalPersonality.DefensiveCautious]:
    'A cautious ruler who invests heavily in defense and avoids provocation. They make reliable treaty partners but are slow to commit to joint ventures.',
};

// ============================================================
// Military strength descriptors
// ============================================================

export const MILITARY_STRENGTH_DESCRIPTORS: Record<string, string> = {
  weak: 'Their forces are modest and poorly equipped.',
  moderate: 'They maintain a capable military force.',
  strong: 'Their army is formidable and well-supplied.',
  overwhelming: 'Their military power far exceeds our own.',
};

// ============================================================
// Regard labels (based on relationship score ranges)
// ============================================================

export const REGARD_LABELS: Record<string, string> = {
  hostile: 'Hostile',
  wary: 'Wary',
  neutral: 'Neutral',
  favorable: 'Favorable',
  allied: 'Allied',
};

// ============================================================
// Diplomatic posture labels
// ============================================================

export const POSTURE_STATUS_LABELS: Record<string, string> = {
  Friendly: 'Friendly relations',
  Neutral: 'Neutral standing',
  Tense: 'Tense relations',
  Hostile: 'Hostile stance',
  War: 'At war',
};

// ============================================================
// Recent action display labels
// ============================================================

export const RECENT_ACTION_LABELS: Record<string, string> = {
  military_buildup: 'Expanded military recruitment',
  trade_proposed: 'Proposed a trade agreement',
  trade_withdrawn: 'Withdrew a trade agreement',
  treaty_proposed: 'Proposed a formal treaty',
  demand_issued: 'Issued demands',
  war_declared: 'Declared war',
  peace_offered: 'Extended a peace offer',
  border_tension: 'Provoked border tension',
  espionage_retaliation: 'Retaliated against espionage',
  religious_pressure: 'Applied religious pressure',
};

export const NEIGHBOR_ACTION_TYPE_TO_SUMMARY: Record<NeighborActionType, string> = {
  [NeighborActionType.TradeProposal]: 'trade_proposed',
  [NeighborActionType.TradeWithdrawal]: 'trade_withdrawn',
  [NeighborActionType.TreatyProposal]: 'treaty_proposed',
  [NeighborActionType.Demand]: 'demand_issued',
  [NeighborActionType.WarDeclaration]: 'war_declared',
  [NeighborActionType.PeaceOffer]: 'peace_offered',
  [NeighborActionType.BorderTension]: 'border_tension',
  [NeighborActionType.MilitaryBuildup]: 'military_buildup',
  [NeighborActionType.EspionageRetaliation]: 'espionage_retaliation',
  [NeighborActionType.ReligiousPressure]: 'religious_pressure',
};

// ============================================================
// Spymaster assessments — per personality × diplomatic situation
// ============================================================

type Situation = 'peaceful' | 'tense' | 'hostile' | 'at_war';

export const SPYMASTER_ASSESSMENTS: Record<string, string[]> = {
  // Ambitious & Militaristic
  'AmbitiousMilitaristic_peaceful': [
    'They are quiet, but do not mistake quiet for peace. Our agents report continued arms production and recruitment. They are preparing — the question is for whom.',
    'Their generals conduct exercises near the border with increasing frequency. Current intelligence suggests they are testing our readiness.',
    'Military spending has increased sharply despite the peace. They build for war, even if they have not yet chosen their target.',
  ],
  'AmbitiousMilitaristic_tense': [
    'Tensions serve their purpose — they use provocation to probe for weakness. Our assessment: they will escalate if they sense opportunity.',
    'Forward supply depots have been established near our border. This suggests planning for a sustained campaign, not mere posturing.',
    'Their diplomatic language has hardened. Our contacts within their court suggest the war faction has gained the ruler\u2019s ear.',
  ],
  'AmbitiousMilitaristic_hostile': [
    'War preparations are unmistakable. Troops mass along the frontier and supply lines extend toward our territory. Conflict appears imminent.',
    'Our agents report general mobilization orders have been issued. The only question remaining is the timing of their first strike.',
    'Their hostility has moved beyond posturing. Defensive preparations on our part should be treated as urgent.',
  ],
  'AmbitiousMilitaristic_at_war': [
    'They fight with the ferocity of true believers in conquest. Our intelligence suggests they will accept nothing less than total victory or exhaustion.',
    'Their war effort is sustained by genuine martial culture. Expect no easy peace — they view retreat as unthinkable dishonor.',
    'The war has unified their population behind the ruler. Our best path to peace runs through decisive military success, not diplomacy.',
  ],

  // Mercantile & Pragmatic
  'MercantilePragmatic_peaceful': [
    'Their merchants flood our markets while their diplomats smile. They profit from peace but are not bound by sentiment — only by profit.',
    'Trade agreements serve their interests handsomely. As long as gold flows, they will remain agreeable partners.',
    'They invest heavily in trade infrastructure. Our assessment: they value the relationship primarily for its commercial returns.',
  ],
  'MercantilePragmatic_tense': [
    'They calculate the cost of conflict carefully. Current tensions are likely a negotiating tactic rather than a prelude to war.',
    'Their merchants have begun redirecting trade routes away from our borders. This is a pressure tactic, not a permanent shift.',
    'Our agents suggest they will seek a deal rather than escalate. The question is what concessions they will demand.',
  ],
  'MercantilePragmatic_hostile': [
    'Even their hostility is calculated. They squeeze our trade and fund our rivals, preferring economic warfare to the battlefield.',
    'They wage war with ledgers and tariffs. Military action is a last resort for them, but not an impossibility if profits demand it.',
    'Our intelligence suggests they are financing opposition factions within our borders. Economic subversion is their weapon of choice.',
  ],
  'MercantilePragmatic_at_war': [
    'They fight to protect their trade interests, not for glory. A generous settlement that preserves their commerce could end this quickly.',
    'Their war effort is efficient but not passionate. They will sue for peace the moment the costs outweigh the potential gains.',
    'The war disrupts their commerce, which is their primary motivation to end it. Strategic patience may serve us well here.',
  ],

  // Devout & Insular
  'DevoutInsular_peaceful': [
    'They keep to themselves and their temples. Our agents find it difficult to penetrate their closed society, but they show no aggressive intent.',
    'Religious ceremonies and cultural isolation dominate their affairs. They have little interest in our kingdom beyond maintaining their borders.',
    'Their insularity makes them predictable but opaque. They will not start trouble, but they will resist any perceived encroachment fiercely.',
  ],
  'DevoutInsular_tense': [
    'They perceive our actions as a threat to their religious traditions. This is a matter of faith for them, which makes de-escalation delicate.',
    'Religious leaders have influence over their military. Tensions with them are best addressed through cultural sensitivity rather than shows of force.',
    'Our agents report increased religious rhetoric against foreign influence. They are circling the wagons around their faith.',
  ],
  'DevoutInsular_hostile': [
    'They view this conflict through a religious lens. Our assessment: they will fight with the conviction of zealots if pushed to war.',
    'Their hostility is driven by doctrinal differences as much as politics. Rational negotiation may prove difficult.',
    'Religious orders within their borders train for combat. They prepare a holy defense, not a war of conquest.',
  ],
  'DevoutInsular_at_war': [
    'They fight for their faith and homeland with extraordinary determination. Expect fierce resistance but limited offensive ambition.',
    'Their people are united by religious conviction. This makes them resilient in defense but unlikely to pursue us beyond their borders.',
    'The war has strengthened their religious fervor. Peace will require acknowledging their cultural autonomy.',
  ],

  // Expansionist & Diplomatic
  'ExpansionistDiplomatic_peaceful': [
    'Their diplomats are charming and their treaties generous — suspiciously so. They build a web of obligations that slowly draws nations into dependence.',
    'Peace serves their expansion better than war. They acquire influence through trade agreements, cultural exchange, and strategic marriages.',
    'Our agents report a vast network of diplomatic contacts across the region. They seek to become indispensable to everyone.',
  ],
  'ExpansionistDiplomatic_tense': [
    'They use tension as leverage in negotiations. Our assessment: they want concessions, not conflict.',
    'Their diplomatic corps works overtime to isolate us from potential allies. This is a sophisticated pressure campaign.',
    'Behind the diplomatic smile lies calculation. They are positioning themselves for advantage while appearing to seek reconciliation.',
  ],
  'ExpansionistDiplomatic_hostile': [
    'They turn allies against us with whispered promises. Their hostility manifests through proxy actions rather than direct confrontation.',
    'Our intelligence suggests they are assembling a coalition. They prefer to fight with allies rather than alone.',
    'Their diplomatic network becomes a weapon. Trade partners are pressured to choose sides, and neutral parties are courted aggressively.',
  ],
  'ExpansionistDiplomatic_at_war': [
    'They wage war with one hand and extend peace feelers with the other. Every battle is a negotiating position for them.',
    'Their military actions are calculated to create favorable terms for a settlement, not to achieve total victory.',
    'Even at war, their diplomats probe for a deal. The right offer at the right time could end this — but beware the fine print.',
  ],

  // Defensive & Cautious
  'DefensiveCautious_peaceful': [
    'They invest in walls and watchtowers rather than warships. Our assessment: a reliable neighbor unless provoked.',
    'Their cautious nature makes them predictable allies and unthreatening neighbors. They fear change more than they desire expansion.',
    'Defensive fortifications continue to expand along their borders. They prepare against all threats, real and imagined.',
  ],
  'DefensiveCautious_tense': [
    'They retreat into defensive postures at the first sign of tension. Our agents suggest they fear us more than we should fear them.',
    'Their caution amplifies perceived threats. Minor diplomatic incidents become fortress-building campaigns.',
    'They are unlikely to strike first but may lash out if they feel cornered. De-escalation through reassurance would be most effective.',
  ],
  'DefensiveCautious_hostile': [
    'They dig in and fortify. Our intelligence suggests they have no offensive plans but will resist any incursion with everything they have.',
    'Hostility has driven them into a defensive shell. Breaking through would be costly, but they pose little offensive threat.',
    'Their caution has become paranoia. Every action we take is interpreted as aggression, making diplomacy increasingly difficult.',
  ],
  'DefensiveCautious_at_war': [
    'They fight a purely defensive war. Our forces face fortified positions and determined resistance, but no counterattacks.',
    'Their strategy is to outlast us behind their walls. A siege mentality has taken hold, and they will endure much before surrendering.',
    'They wage a war of attrition from behind their defenses. Time and patience may be our greatest weapons.',
  ],
};

/** Helper to get the situation key from diplomatic posture. */
export function getSituationKey(posture: string): Situation {
  switch (posture) {
    case 'Friendly':
    case 'Neutral':
      return 'peaceful';
    case 'Tense':
      return 'tense';
    case 'Hostile':
      return 'hostile';
    case 'War':
      return 'at_war';
    default:
      return 'peaceful';
  }
}
