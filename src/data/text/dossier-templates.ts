// Dossier Templates — text data for the rival kingdom dossier system.
// All player-facing text for dossier cards lives here.

import { RivalPersonality, NeighborActionType, RivalAgenda } from '../../engine/types';

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

// ============================================================
// Phase 3 — Spymaster agenda lines (per agenda × situation)
// {target} is resolved by dossierCompiler through the relevant name
// resolver (region / settlement / neighbor). If the agenda's target is
// null, the {target} placeholder is stripped.
// ============================================================

export const SPYMASTER_AGENDA_LINES: Record<string, string[]> = {
  // RestoreTheOldBorders — region target
  'RestoreTheOldBorders_peaceful': [
    'Their archivists have been quietly reviewing historic claims to {target}. The old wound has not healed.',
    'Our agents hear courtly talk of {target} as "our province in exile." They wait for the right moment.',
  ],
  'RestoreTheOldBorders_tense': [
    'They now speak openly of {target} as unfinished business. Expect pressure to escalate.',
    'Border patrols near {target} have thickened. They press the claim while they believe us weak.',
  ],
  'RestoreTheOldBorders_hostile': [
    'The recovery of {target} has become a rallying cry in their court. War may follow.',
    'Their generals map the approaches to {target}. The moment of decision comes soon.',
  ],
  'RestoreTheOldBorders_at_war': [
    'Every offensive is shaped by the desire to reclaim {target}. They will not settle for less.',
    'Their war aims are transparent: recover {target}, whatever the cost.',
  ],

  // BleedTheRivals — neighbor target (another rival)
  'BleedTheRivals_peaceful': [
    'They play a longer game — undermining {target} from the shadows while keeping our eyes elsewhere.',
    'Their envoys court us warmly, but our agents track funds flowing to dissidents inside {target}.',
  ],
  'BleedTheRivals_tense': [
    'They use this quarrel as cover to pressure {target}. We are a stage, not the target.',
    'Their hostility is theatrical — real preparations are aimed at {target}, not us.',
  ],
  'BleedTheRivals_hostile': [
    'They seek our conflict only to drain {target}. A distracted realm serves their ambitions.',
    'Hostility masks their true goal: they wish us bogged down so {target} stands alone.',
  ],
  'BleedTheRivals_at_war': [
    'Even at war, they angle for advantage against {target} more than against us.',
    'Their offensives are shaped to weaken {target} — we are merely the nearest opportunity.',
  ],

  // DominateTrade — neighbor target (trade rival)
  'DominateTrade_peaceful': [
    'Their merchants push to corner the routes with {target}. Trade, not steel, is their weapon.',
    'They expand warehouses and docks at a pace that only makes sense if they mean to monopolize {target}\u2019s markets.',
  ],
  'DominateTrade_tense': [
    'Tariff threats and convoy escorts suggest they are positioning to cut {target} out of the trade lanes.',
    'Their diplomatic pressure is economic — access to {target}\u2019s ports is the prize.',
  ],
  'DominateTrade_hostile': [
    'They use their navy to choke off trade with {target}. A trade war may become a real one.',
    'Our assessment: they will risk open hostility to break {target}\u2019s commercial hold.',
  ],
  'DominateTrade_at_war': [
    'Their war economy is structured to emerge as the dominant trade power once {target} is humbled.',
    'Every seized port and broken convoy aims at the same goal: displacing {target} from the lanes.',
  ],

  // ReligiousHegemony — neighbor target (religious rival)
  'ReligiousHegemony_peaceful': [
    'Their clergy send missions into {target}. Conversion precedes the crown.',
    'Religious delegations criss-cross toward {target}. Faith is the opening move.',
  ],
  'ReligiousHegemony_tense': [
    'They frame their quarrel with {target} in the language of heresy — a dangerous escalation.',
    'Their priests denounce {target}\u2019s rites openly. Holy war is a short step away.',
  ],
  'ReligiousHegemony_hostile': [
    'They prepare a crusade in all but name against {target}. We may be drawn in.',
    'Their hostility has taken on religious fervor — {target} stands accused of apostasy.',
  ],
  'ReligiousHegemony_at_war': [
    'The war is a holy one in their telling. {target} will be offered conversion or erasure.',
    'They pursue spiritual dominion through military means. Mercy for {target} is unlikely.',
  ],

  // DynasticAlliance — neighbor target (ally candidate)
  'DynasticAlliance_peaceful': [
    'Their envoys quietly discuss a marriage tie with {target}. An alliance is in formation.',
    'Cordial ties with {target} deepen by the month. Dynastic bonds may follow.',
  ],
  'DynasticAlliance_tense': [
    'They rush to conclude an alliance with {target} before our conflict sharpens.',
    'Diplomatic tension with us accelerates their courtship of {target}.',
  ],
  'DynasticAlliance_hostile': [
    'They seek {target} as a shield. Expect joint demarches should hostilities deepen.',
    'An alliance with {target} is nearly sealed; we may soon face two crowns, not one.',
  ],
  'DynasticAlliance_at_war': [
    'They lean hard on {target} for aid — the marriage-bed is now a war-council.',
    'Their war effort depends on {target}\u2019s support. Sever that tie and their resolve frays.',
  ],

  // SubjugateAVassal — neighbor target (weaker rival)
  'SubjugateAVassal_peaceful': [
    'They apply quiet pressure on {target} — protection offered at the point of a sword.',
    'Demands of tribute reach {target} behind closed doors. Vassalage is their aim.',
  ],
  'SubjugateAVassal_tense': [
    'They escalate demands on {target} while keeping us in careful check.',
    'Their current posture toward us masks a harder one toward {target}.',
  ],
  'SubjugateAVassal_hostile': [
    'They prepare to break {target}\u2019s independence. Our intervention would be costly but meaningful.',
    'Their hostility is a prelude to forcing {target} into subjugation.',
  ],
  'SubjugateAVassal_at_war': [
    'Any peace they offer us is a hand freed to deal with {target}. Be wary of easy terms.',
    'The war serves a second purpose — a crushed us means an isolated {target}, ripe for taking.',
  ],

  // SackASettlement — settlement target
  'SackASettlement_peaceful': [
    'They send scouts toward {target}. Its walls and warehouses are being measured.',
    'Their raiders quietly study the approaches to {target}. Not yet, but soon.',
  ],
  'SackASettlement_tense': [
    'A raid on {target} is in preparation. Tension serves to mask the mustering.',
    'Their border forces stage within a day\u2019s ride of {target}. Strike plans exist.',
  ],
  'SackASettlement_hostile': [
    'They mean to burn {target} if they can. Expect a lightning strike rather than a campaign.',
    'Their hostility is aimed squarely at {target}. Reinforcements there are urgently warranted.',
  ],
  'SackASettlement_at_war': [
    '{target} is marked on their maps in red ink. Its sacking is a war aim.',
    'They seek a symbolic victory at {target} — plunder, punishment, and proof to their populace.',
  ],

  // DefensiveConsolidation — untargeted
  'DefensiveConsolidation_peaceful': [
    'They fortify and reorganize. They want no quarrel — but they want to be ready for one.',
    'Their spending pours into walls and garrisons, not armies. They seek a strong defense, not a strong offense.',
  ],
  'DefensiveConsolidation_tense': [
    'They brace for trouble rather than seek it. Tensions are more about their fears than ambitions.',
    'Every sign points to defensive consolidation — they expect an attack but do not plan one.',
  ],
  'DefensiveConsolidation_hostile': [
    'Even in hostility, their deployments are defensive. They may bite only if cornered.',
    'They stockpile for a siege, not a march. Attack them and they will be hard to dislodge.',
  ],
  'DefensiveConsolidation_at_war': [
    'Their strategy is defensive attrition. They wait for us to tire.',
    'Fortifications absorb their attention. They do not seek battle — they seek to outlast.',
  ],

  // IsolationistRetreat — untargeted
  'IsolationistRetreat_peaceful': [
    'They pull back from foreign entanglements. Our envoys find fewer doors open than last year.',
    'Embassies close; trade concessions lapse. They turn inward by choice.',
  ],
  'IsolationistRetreat_tense': [
    'Rather than escalate, they withdraw. Tension may pass as they disengage.',
    'They seek distance, not confrontation. We may be easing their retreat.',
  ],
  'IsolationistRetreat_hostile': [
    'Hostility coexists uneasily with their withdrawal. They would rather we left them alone.',
    'They fight only to be left in peace. Press too hard and they dig in — but they will not pursue.',
  ],
  'IsolationistRetreat_at_war': [
    'The war runs against their deepest inclination. They seek a settlement that lets them close the door.',
    'Their armies exist to buy distance. Offer that and peace becomes possible.',
  ],

  // EconomicRecovery — untargeted
  'EconomicRecovery_peaceful': [
    'Their treasury is strained and they know it. Peace is a budgetary necessity.',
    'They pursue only what their finances permit. Grand ambitions are postponed.',
  ],
  'EconomicRecovery_tense': [
    'Tensions they cannot afford. Expect them to blink first if costs climb.',
    'Financial strain undercuts their posture. They bluster now; they will relent under real pressure.',
  ],
  'EconomicRecovery_hostile': [
    'Their hostility outruns their coin. They cannot sustain a long confrontation.',
    'A prolonged standoff favors us — their treasury will crack before their will.',
  ],
  'EconomicRecovery_at_war': [
    'The war is crushing their finances. Each month extends the odds we prevail.',
    'They cannot pay for this war indefinitely. Time, not steel, may be the decisive weapon.',
  ],

  // ConvertThePlayer — untargeted (directed at the player)
  'ConvertThePlayer_peaceful': [
    'Their clergy increasingly court our court. They hope to bring us into their faith.',
    'Religious envoys press for expanded missions in our lands. Conversion is a long game, and it has begun.',
  ],
  'ConvertThePlayer_tense': [
    'They frame our differences in religious terms. Our rituals draw criticism from their pulpits.',
    'Spiritual pressure mounts alongside political tension. They cast us as heretics to be reformed.',
  ],
  'ConvertThePlayer_hostile': [
    'Their hostility wears a religious mask. Submission to their faith is offered as a peace.',
    'They speak as though war itself is correction. Only conversion ends the quarrel in their telling.',
  ],
  'ConvertThePlayer_at_war': [
    'Their war aims include our spiritual submission. Any peace treaty will carry religious terms.',
    'They style themselves crusaders. Expect conditions of faith, not merely of borders.',
  ],

  // ProveDominance — neighbor target (strongest rival)
  'ProveDominance_peaceful': [
    'They measure themselves against {target} and find themselves wanting. A demonstration is coming.',
    'Ambition to eclipse {target} drives their every move. We are the nearest proving-ground.',
  ],
  'ProveDominance_tense': [
    'They need a victory to humble {target} in the eyes of the world. Tension suits that need.',
    'Their posture toward us is performance — aimed at {target}\u2019s attention more than ours.',
  ],
  'ProveDominance_hostile': [
    'They seek open conflict to shake {target}\u2019s standing. Escalation is almost certain.',
    'A decisive strike against us would rewrite the rank above {target}. They feel ready to attempt it.',
  ],
  'ProveDominance_at_war': [
    'This war is a showpiece aimed at {target}. They cannot afford to appear weak.',
    'Every battle is fought twice — once against us, once in {target}\u2019s perception of them.',
  ],
};

/** Phase 3 — Disposition-toward-player bucket labels, keyed by memory-drift band. */
export const DISPOSITION_TOWARD_PLAYER: Record<
  'Hostile' | 'Sour' | 'Neutral' | 'Warming' | 'Cordial',
  string
> = {
  Hostile: 'Their court remembers our every affront. They will not forget.',
  Sour: 'Old grievances still color their view of us. Trust is thin.',
  Neutral: 'They bear us no special grudge, nor any particular affection.',
  Warming: 'Favors and forbearance have left a mark. Goodwill is building.',
  Cordial: 'They remember us kindly. A deep reservoir of goodwill favors us.',
};

/** Returns the drift bucket key for a given computed drift delta. */
export function getDispositionBucket(
  drift: number,
): keyof typeof DISPOSITION_TOWARD_PLAYER {
  if (drift <= -10) return 'Hostile';
  if (drift <= -3) return 'Sour';
  if (drift < 3) return 'Neutral';
  if (drift < 10) return 'Warming';
  return 'Cordial';
}

/** Convenience accessor. Exhaustive coverage check at module load. */
const _AGENDA_LINE_SITUATIONS: Situation[] = ['peaceful', 'tense', 'hostile', 'at_war'];
for (const agenda of Object.values(RivalAgenda)) {
  for (const sit of _AGENDA_LINE_SITUATIONS) {
    const key = `${agenda}_${sit}`;
    if (!SPYMASTER_AGENDA_LINES[key]) {
      throw new Error(`SPYMASTER_AGENDA_LINES missing key: ${key}`);
    }
  }
}

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
