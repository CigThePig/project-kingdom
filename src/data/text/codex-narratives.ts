// Codex Narrative Templates — 90 narrative blocks
// 6 domains × 5 tiers × 3 variants each.
// Tone: steward's report written for a monarch.

import { QualitativeTier } from '../../engine/types';

export const CODEX_NARRATIVES: Record<string, Record<QualitativeTier, [string, string, string]>> = {
  // ============================================================
  // REALM (stability)
  // ============================================================
  realm: {
    [QualitativeTier.Dire]: [
      'The realm teeters on the edge of collapse. Open defiance greets the crown in every quarter, and the throne itself feels unsteady.',
      'Order has crumbled. Bandits roam the roads unchallenged, and even loyal subjects whisper of a change in power.',
      'The kingdom is a realm in name only. Authority extends no further than the castle walls, and every faction schemes for advantage.',
    ],
    [QualitativeTier.Troubled]: [
      'Unrest simmers beneath the surface. The people obey, but grudgingly, and tensions between factions grow harder to contain.',
      'The crown\u2019s hold is fragile. Minor disputes flare into confrontations, and the court spends more time quelling dissent than governing.',
      'Discontent spreads through the provinces. Loyal governors report increasing difficulty maintaining order without armed intervention.',
    ],
    [QualitativeTier.Stable]: [
      'The realm holds steady. There are grievances, as there always are, but the machinery of governance turns without crisis.',
      'A measured calm prevails across the kingdom. The people go about their business, and the crown\u2019s authority is broadly respected.',
      'Order is maintained, though not without effort. The realm functions as it should, neither flourishing nor faltering.',
    ],
    [QualitativeTier.Prosperous]: [
      'Confidence in the crown runs high. The roads are safe, justice is dispensed fairly, and the people speak well of their sovereign.',
      'The realm enjoys a period of genuine stability. Faction leaders cooperate more than they quarrel, and the court governs with authority.',
      'A sense of optimism pervades the kingdom. Citizens invest in their futures, trusting that the peace will hold.',
    ],
    [QualitativeTier.Flourishing]: [
      'The kingdom stands as a beacon of order. Foreign dignitaries remark on the tranquility, and the people celebrate their sovereign with genuine affection.',
      'Stability has become the hallmark of this reign. The realm\u2019s institutions function with rare efficiency, and dissent is nearly unheard of.',
      'These are golden days. The crown commands not merely obedience but devotion, and the kingdom\u2019s unity is the envy of neighboring lands.',
    ],
  },

  // ============================================================
  // STORES (food reserves / consumption ratio)
  // ============================================================
  stores: {
    [QualitativeTier.Dire]: [
      'The granaries echo with emptiness. Rationing has begun in earnest, and the specter of famine haunts every village.',
      'Food reserves are critically depleted. Without immediate relief, the kingdom faces starvation within weeks.',
      'Hunger stalks the land. The stores are bare, and desperate subjects have begun hoarding what little remains.',
    ],
    [QualitativeTier.Troubled]: [
      'Provisions run low. The stewards stretch what remains, but another poor harvest could prove catastrophic.',
      'The kingdom\u2019s food stores are worryingly thin. Careful management may see us through, but there is no margin for error.',
      'Supplies dwindle faster than they are replenished. The markets show rising prices, and the common folk grow anxious.',
    ],
    [QualitativeTier.Stable]: [
      'The stores hold adequate reserves. There is enough to weather a modest downturn, though surplus is not our luxury.',
      'Provisions are sufficient for the season ahead. The granaries are neither overflowing nor empty \u2014 a workable position.',
      'Food supplies remain steady. The kingdom feeds itself without abundance, but also without want.',
    ],
    [QualitativeTier.Prosperous]: [
      'The granaries are well-stocked. Reserves provide comfortable insurance against poor harvests, and the markets offer variety.',
      'Provisions are plentiful. The kingdom enjoys a generous surplus that could sustain us through a difficult season with ease.',
      'Food security is strong. The stores overflow with grain and preserved goods, and the people eat well.',
    ],
    [QualitativeTier.Flourishing]: [
      'The kingdom\u2019s stores are the envy of the region. Years of careful management have built reserves that could weather any crisis.',
      'Abundance defines our provisions. The granaries are full to bursting, and surplus trade brings additional revenue to the crown.',
      'Famine is a distant memory. The stores are so well-provisioned that we export food to less fortunate neighbors.',
    ],
  },

  // ============================================================
  // TREASURY (balance + net flow)
  // ============================================================
  treasury: {
    [QualitativeTier.Dire]: [
      'The royal coffers are empty \u2014 worse than empty. Debts mount daily, and creditors grow impatient. The crown cannot meet its obligations.',
      'Financial ruin looms. The treasury hemorrhages gold faster than any revenue stream can replenish it.',
      'Insolvency is not a risk but a reality. The crown borrows against future seasons merely to pay this month\u2019s expenses.',
    ],
    [QualitativeTier.Troubled]: [
      'The treasury bleeds slowly. Revenue falls short of expenses, and the reserve shrinks with each passing month.',
      'Finances are strained. The crown can still meet its commitments, but only by deferring investments the kingdom sorely needs.',
      'Gold trickles out faster than it flows in. The stewards warn that without reform, the deficit will become a crisis.',
    ],
    [QualitativeTier.Stable]: [
      'The books roughly balance. Revenue meets expenditure without great surplus, but the crown is not in danger.',
      'The treasury maintains a modest reserve. Income and expenses are well-matched, leaving room for careful investment.',
      'Finances are adequate. There is no great wealth, but neither is there debt. The kingdom pays its way.',
    ],
    [QualitativeTier.Prosperous]: [
      'Gold flows steadily into the coffers. The surplus allows for ambitious projects and comfortable reserves against uncertainty.',
      'The treasury is in excellent health. Revenue exceeds expenses by a comfortable margin, and the crown invests with confidence.',
      'Financial strength underpins the kingdom\u2019s ambitions. The stewards report growing reserves and a healthy revenue stream.',
    ],
    [QualitativeTier.Flourishing]: [
      'The royal treasury overflows with wealth. The crown can fund any endeavor and still maintain reserves that would last for years.',
      'Prosperity defines the kingdom\u2019s finances. Revenue streams are diverse, debts are nonexistent, and the coffers swell with gold.',
      'The treasury has never been stronger. Wealth accumulates faster than it can be spent wisely, and the kingdom\u2019s credit is unimpeachable.',
    ],
  },

  // ============================================================
  // INFRASTRUCTURE (average region development)
  // ============================================================
  infrastructure: {
    [QualitativeTier.Dire]: [
      'The kingdom\u2019s infrastructure is in ruins. Roads are impassable, bridges collapsed, and basic services have ceased in many regions.',
      'Neglect has reduced the realm\u2019s works to rubble. What buildings remain are crumbling, and trade routes lie abandoned.',
      'Development has regressed to the most primitive levels. The kingdom lacks the basic infrastructure to support its population.',
    ],
    [QualitativeTier.Troubled]: [
      'Infrastructure lags behind the kingdom\u2019s needs. Roads deteriorate, construction projects stall, and the provinces grow more isolated.',
      'Development is uneven and insufficient. Key trade routes suffer from poor maintenance, and several regions lack basic amenities.',
      'The kingdom\u2019s works require urgent attention. Years of underinvestment show in crumbling walls and rutted thoroughfares.',
    ],
    [QualitativeTier.Stable]: [
      'Infrastructure is functional if unremarkable. The roads serve their purpose, buildings stand, and trade flows without major obstruction.',
      'Development across the regions is adequate. The kingdom maintains its works at a serviceable level, though improvements are always welcome.',
      'The realm\u2019s infrastructure meets basic needs. There is room for growth, but no immediate crisis demands attention.',
    ],
    [QualitativeTier.Prosperous]: [
      'Well-maintained roads and sturdy buildings mark a kingdom that invests in its future. Trade flows freely across developed regions.',
      'Infrastructure is a point of pride. Construction projects advance on schedule, and the provinces benefit from thoughtful development.',
      'The kingdom\u2019s works are impressive. Bridges span every river, roads connect every town, and new buildings rise with regularity.',
    ],
    [QualitativeTier.Flourishing]: [
      'The kingdom\u2019s infrastructure rivals that of the great empires. Every region boasts modern works, and new projects push the boundaries of engineering.',
      'Development across the realm is exceptional. The roads are the finest in the known world, and every province thrives with well-planned infrastructure.',
      'A marvel of civilization. The kingdom\u2019s works stand as monuments to wise governance and sustained investment across many seasons.',
    ],
  },

  // ============================================================
  // ARMIES (readiness + morale + equipment composite)
  // ============================================================
  armies: {
    [QualitativeTier.Dire]: [
      'The army is a shadow of a fighting force. Desertions mount, equipment is broken or missing, and readiness has collapsed entirely.',
      'Our military is in disarray. Soldiers lack weapons, morale has evaporated, and any serious engagement would end in disaster.',
      'The kingdom\u2019s forces exist in name only. What troops remain are demoralized, poorly equipped, and unfit for any campaign.',
    ],
    [QualitativeTier.Troubled]: [
      'The military struggles. Equipment is worn, training has lapsed, and the soldiers\u2019 confidence wavers. We are vulnerable.',
      'Our forces are below acceptable readiness. Shortages in arms and declining morale leave the kingdom exposed to opportunistic neighbors.',
      'The army suffers from neglect. Capable soldiers remain, but they are underequipped and increasingly restless.',
    ],
    [QualitativeTier.Stable]: [
      'The military is functional and reasonably prepared. Soldiers are trained, equipment is serviceable, and morale holds steady.',
      'Our forces maintain an acceptable state of readiness. They could defend the realm capably, though an extended campaign would strain resources.',
      'The army stands ready for duty. Neither exceptional nor wanting, the kingdom\u2019s military is a reliable instrument of defense.',
    ],
    [QualitativeTier.Prosperous]: [
      'The military is well-maintained and confident. Good equipment, regular training, and high morale make for an effective fighting force.',
      'Our forces are in excellent condition. The soldiers are well-armed, well-drilled, and eager to serve. Neighbors take note.',
      'The army is a source of strength. Veterans lead disciplined ranks, and the armories are well-stocked with quality weapons.',
    ],
    [QualitativeTier.Flourishing]: [
      'The kingdom commands a formidable military. Elite troops with superior equipment stand ready, and our martial reputation precedes us.',
      'Our armies are the finest in the region. Impeccable training, gleaming arms, and unshakeable morale make them a force to be reckoned with.',
      'Military excellence defines this reign. The kingdom\u2019s forces are a masterwork of discipline, equipment, and fighting spirit.',
    ],
  },

  // ============================================================
  // FAITH (faith level + cultural cohesion + inverse heterodoxy)
  // ============================================================
  faith: {
    [QualitativeTier.Dire]: [
      'The spiritual fabric of the kingdom is torn asunder. Heresy runs rampant, the clergy are despised, and cultural unity has shattered completely.',
      'Faith has collapsed. The temples stand empty, dissenting sects multiply, and the people share no common bonds of belief or culture.',
      'A spiritual crisis grips the realm. Division runs so deep that neighbor turns against neighbor over matters of doctrine and identity.',
    ],
    [QualitativeTier.Troubled]: [
      'Religious tensions simmer. The faithful grow uneasy as heterodox movements gain ground, and cultural divisions deepen between regions.',
      'The kingdom\u2019s spiritual health falters. Attendance at services declines, rival doctrines compete for adherents, and the clergy struggle to maintain influence.',
      'Cultural cohesion weakens as regional identities pull in different directions. The faith that once unified the kingdom now divides it.',
    ],
    [QualitativeTier.Stable]: [
      'The kingdom\u2019s faith holds steady. The clergy maintain their congregations, cultural traditions are observed, and doctrinal disputes remain manageable.',
      'Spiritual life continues without great passion or great crisis. The people attend to their faith as custom demands, and cultural bonds persist.',
      'Faith and culture provide a quiet foundation. There is neither fervent devotion nor dangerous dissent \u2014 merely steady observance.',
    ],
    [QualitativeTier.Prosperous]: [
      'The kingdom\u2019s spiritual life thrives. The faithful gather with genuine devotion, cultural traditions are celebrated, and the clergy command respect.',
      'Religious institutions flourish and cultural identity strengthens. The people draw comfort and purpose from shared faith and heritage.',
      'A robust spiritual foundation supports the realm. The temples are full, festivals draw enthusiastic crowds, and heresy finds no purchase.',
    ],
    [QualitativeTier.Flourishing]: [
      'Faith and culture unite the kingdom in extraordinary harmony. The religious orders prosper, cultural achievement soars, and the people share a deep sense of identity.',
      'The kingdom\u2019s spiritual life is a beacon to neighboring lands. Pilgrims arrive from distant shores, and cultural works of lasting beauty adorn every region.',
      'An age of spiritual and cultural brilliance. The kingdom\u2019s faith traditions have never been stronger, and the bonds of shared identity have never run deeper.',
    ],
  },
};
