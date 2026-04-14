import type { EffectHint } from '../../ui/types';

// Three distinct opening phrases per month (1–12).
// SeasonDawn picks one at random each time the phase mounts.
export const MONTH_PHRASES: Record<number, [string, string, string]> = {
  // January — deep winter
  1: [
    'The coldest days have arrived. Frost grips the fields and firewood grows precious. Endure, Your Majesty — spring is distant but certain.',
    'Deep winter settles over the realm. Roads are treacherous and the people huddle close. Your resolve will carry them through.',
    'Snow blankets the kingdom in silence. The cold tests the strength of every household. A wise ruler tends to warmth and stores now.',
  ],
  // February — late winter
  2: [
    'The grip of winter loosens — barely. Longer days return, and with them cautious hope. The kingdom stirs in anticipation.',
    'Late winter lingers, but the worst has passed. Farmers eye the frozen earth and begin to plan. The court breathes a little easier.',
    'Ice still clings to the eaves, yet the light grows. The realm survived the deep freeze; what comes next is in your hands.',
  ],
  // March — early spring
  3: [
    'The frost recedes at last. Mud-slicked roads fill with travelers and the first green shoots break through the fields.',
    'Spring has arrived in earnest. Plows turn the thawing soil and birdsong returns to the capital. The kingdom exhales.',
    'The thaw is underway. Rivers run high with snowmelt, and the kingdom shakes off the last of winter\'s weight.',
  ],
  // April — mid spring
  4: [
    'The planting season reaches its stride. Every field is active and the kingdom smells of fresh earth and possibility.',
    'Warm rains fall across the realm. Seeds sown now will determine the harvest to come — and the fate of your people.',
    'Trade caravans resume their routes as the roads firm up. April brings commerce, ambition, and the occasional dispute.',
  ],
  // May — late spring
  5: [
    'Late spring is a time of abundance. Blossoms fill the orchards, the granaries are replenishing, and spirits run high.',
    'The kingdom is in full bloom. Festivals dot the calendar and the people celebrate the warmth. Long may it last.',
    'May brings the richest green the realm will see all year. Even the border watch relaxes slightly — summer is close.',
  ],
  // June — early summer
  6: [
    'Summer arrives with blazing clarity. The harvest is months away but promise is visible in every field.',
    'Heat builds across the lowlands. Trade caravans move fast to beat the worst of it. The kingdom hums with industry.',
    'Early summer days are long and bright. The court is busy; the roads are full. But drought whispers on the southern wind.',
  ],
  // July — midsummer
  7: [
    'Midsummer. The sun is at its peak and the kingdom at its most active. Merchants, soldiers, and pilgrims all share the road.',
    'The heat of high summer settles in. Fields grow heavy and the people work sunup to sundown. Fatigue is rising.',
    'July brings the year\'s longest days and shortest nights. There is much to do and little time to rest, Your Majesty.',
  ],
  // August — late summer
  8: [
    'The harvest draws near. Fields are golden and the granaries wait. One more month of good weather and the kingdom will eat well.',
    'Late summer heat lingers, but the first crops are ready. Reapers take to the fields and a sense of relief spreads through the realm.',
    'August is a race. Bring in the harvest before the autumn storms arrive. The kingdom holds its breath.',
  ],
  // September — early autumn
  9: [
    'Autumn begins its slow descent. The harvest is underway and trade caravans laden with grain fill the roads.',
    'A cool wind from the north announces the season\'s turn. The harvest is good so far — may it stay that way.',
    'September: the kingdom\'s busiest month. Every cart, every hand, every road serves the harvest. Protect it well.',
  ],
  // October — mid autumn
  10: [
    'The main harvest is in full swing. Amber leaves fall and the granaries swell. Taxes flow and the treasury breathes.',
    'October brings the richest days of the agricultural year. The kingdom is flush — but winter will come to collect.',
    'Harvest festivals light up the villages. The people are grateful, full, and briefly content. Savor it; winter is weeks away.',
  ],
  // November — late autumn
  11: [
    'The harvest is done. Now the kingdom turns inward — stocking stores, sealing walls, and bracing for the cold.',
    'Late autumn strips the last leaves from the trees. The land grows grey and quiet as the kingdom prepares for winter.',
    'November is a month of final preparations. What is not done now will be done in the cold — or not at all.',
  ],
  // December — early winter
  12: [
    'The cold descends. Fires burn in every hearth and the roads thin out. The long nights of winter have arrived.',
    'December grips the realm in frost. Caravans cease and the kingdom turns to its stores. May they be enough.',
    'Winter is here in force. Snow dusts the capital and the northern passes close. A quiet but demanding month lies ahead.',
  ],
};

// Three effect hints per month. SeasonDawn randomly displays two of them.
export const MONTH_EFFECT_POOLS: Record<number, [EffectHint, EffectHint, EffectHint]> = {
  1: [
    { label: 'Food Cost ↑↑', type: 'negative' },
    { label: 'Trade -25%', type: 'negative' },
    { label: 'Sickness?', type: 'warning' },
  ],
  2: [
    { label: 'Food Cost ↑', type: 'warning' },
    { label: 'Morale ↑', type: 'positive' },
    { label: 'Livestock?', type: 'warning' },
  ],
  3: [
    { label: 'Food +15%', type: 'positive' },
    { label: 'Morale ↑', type: 'positive' },
    { label: 'Floods?', type: 'warning' },
  ],
  4: [
    { label: 'Growth ↑', type: 'positive' },
    { label: 'Trade +10%', type: 'positive' },
    { label: 'Bandits?', type: 'warning' },
  ],
  5: [
    { label: 'Food +25%', type: 'positive' },
    { label: 'Festivals', type: 'positive' },
    { label: 'Recruitment ↑', type: 'positive' },
  ],
  6: [
    { label: 'Trade +15%', type: 'positive' },
    { label: 'Drought?', type: 'warning' },
    { label: 'Disease?', type: 'warning' },
  ],
  7: [
    { label: 'Trade +20%', type: 'positive' },
    { label: 'Food +10%', type: 'positive' },
    { label: 'Unrest?', type: 'warning' },
  ],
  8: [
    { label: 'Harvest ↑', type: 'positive' },
    { label: 'Military ↑', type: 'positive' },
    { label: 'Raids?', type: 'warning' },
  ],
  9: [
    { label: 'Harvest', type: 'positive' },
    { label: 'Trade Caravans', type: 'positive' },
    { label: 'Border Raids?', type: 'warning' },
  ],
  10: [
    { label: 'Grain ↑↑', type: 'positive' },
    { label: 'Treasury ↑', type: 'positive' },
    { label: 'Squabbles?', type: 'warning' },
  ],
  11: [
    { label: 'Stores Built', type: 'positive' },
    { label: 'Roads Closing', type: 'negative' },
    { label: 'Bandit Season', type: 'warning' },
  ],
  12: [
    { label: 'Food Cost ↑', type: 'warning' },
    { label: 'Trade -15%', type: 'negative' },
    { label: 'Sickness?', type: 'warning' },
  ],
};

// Shorter transition phrases for Months 2 and 3 within each season.
// Keyed by calendar month (1–12), 2 variants per month.
// Month 1 of each season uses the full MONTH_PHRASES above instead.
export const MONTH_TRANSITION_PHRASES: Record<number, [string, string]> = {
  // January — deep winter (Winter Mid)
  1: [
    'The cold persists. The kingdom endures.',
    'Midwinter deepens its grip on the land.',
  ],
  // February — late winter (Winter Late)
  2: [
    'Late winter holds, but the light returns.',
    'The realm stirs beneath the frost.',
  ],
  // March — early spring (Spring Early) — used as Month 1, so rarely needed
  3: [
    'The first green shoots break through frozen soil.',
    'Snowmelt feeds the rivers; the land awakens.',
  ],
  // April — mid spring (Spring Mid)
  4: [
    'Warm rains soak the planting fields.',
    'The kingdom turns its hands to the soil.',
  ],
  // May — late spring (Spring Late)
  5: [
    'Blossoms fill the orchards and spirits rise.',
    'The warmth builds and the roads fill with travelers.',
  ],
  // June — early summer (Summer Early) — used as Month 1
  6: [
    'Heat settles across the lowlands.',
    'Long days stretch toward the horizon.',
  ],
  // July — midsummer (Summer Mid)
  7: [
    'The sun beats down and the fields grow heavy.',
    'Midsummer toil continues without rest.',
  ],
  // August — late summer (Summer Late)
  8: [
    'The harvest draws near; the kingdom holds its breath.',
    'Late summer fades and the reapers sharpen their scythes.',
  ],
  // September — early autumn (Autumn Early) — used as Month 1
  9: [
    'Cool winds announce the season\'s turn.',
    'The harvest wagons creak along every road.',
  ],
  // October — mid autumn (Autumn Mid)
  10: [
    'Amber leaves fall and the granaries swell.',
    'The harvest is in full swing across the realm.',
  ],
  // November — late autumn (Autumn Late)
  11: [
    'The land grows grey; winter preparations begin.',
    'The last leaves fall and the fires are stoked.',
  ],
  // December — early winter (Winter Early) — used as Month 1
  12: [
    'Frost grips the land and the roads thin out.',
    'The cold descends; the kingdom turns to its stores.',
  ],
};

export const MONTH_NAMES: Record<number, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const MONTH_SEASON_LABELS: Record<number, string> = {
  1: 'Deep Winter',
  2: 'Late Winter',
  3: 'Early Spring',
  4: 'Mid Spring',
  5: 'Late Spring',
  6: 'Early Summer',
  7: 'Midsummer',
  8: 'Late Summer',
  9: 'Early Autumn',
  10: 'Mid Autumn',
  11: 'Late Autumn',
  12: 'Early Winter',
};
