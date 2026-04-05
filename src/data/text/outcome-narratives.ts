// Outcome quality narrative text — displayed on resolved events to explain
// how the player's choice turned out. Generic fallbacks per category when
// no event-specific text exists.

import { EventCategory, OutcomeQuality } from '../../engine/types';

/**
 * Generic outcome narratives by category and quality tier.
 * Used when no event-specific narrative is defined.
 */
export const GENERIC_OUTCOME_NARRATIVES: Record<string, Record<OutcomeQuality, string>> = {
  [EventCategory.Economy]: {
    [OutcomeQuality.Disastrous]: 'The economic measures backfired spectacularly. Markets recoiled and confidence evaporated faster than anyone anticipated.',
    [OutcomeQuality.Poor]: 'The economic response fell short of expectations. Results were modest at best, and the costs may have outweighed the gains.',
    [OutcomeQuality.Expected]: 'The economic measures proceeded as planned. The treasury adjusts accordingly.',
    [OutcomeQuality.Good]: 'The economic intervention proved more effective than anticipated. Markets responded favorably.',
    [OutcomeQuality.Excellent]: 'The economic measures succeeded beyond all projections. A surge of confidence has energized commerce throughout the realm.',
  },
  [EventCategory.Food]: {
    [OutcomeQuality.Disastrous]: 'The response to the food crisis made matters worse. Stores depleted faster than expected, and hunger spread.',
    [OutcomeQuality.Poor]: 'Efforts to address the food situation yielded disappointing results. The granaries show less improvement than hoped.',
    [OutcomeQuality.Expected]: 'Food management efforts proceeded as anticipated. Reserves adjust according to plan.',
    [OutcomeQuality.Good]: 'The food situation improved more than expected. Careful management produced surplus reserves.',
    [OutcomeQuality.Excellent]: 'Exceptional results in food management. The harvest exceeded all estimates and the people are well-provisioned.',
  },
  [EventCategory.Military]: {
    [OutcomeQuality.Disastrous]: 'The military response was catastrophic. Equipment failed, morale collapsed, and the realm is weaker for it.',
    [OutcomeQuality.Poor]: 'Military operations underperformed. The officers report difficulties and the results are underwhelming.',
    [OutcomeQuality.Expected]: 'Military operations proceeded according to plan. The forces adjust as ordered.',
    [OutcomeQuality.Good]: 'The military initiative exceeded expectations. The officers report strong performance and improved readiness.',
    [OutcomeQuality.Excellent]: 'Outstanding military results. The forces performed superbly and morale surges across the ranks.',
  },
  [EventCategory.Diplomacy]: {
    [OutcomeQuality.Disastrous]: 'Diplomatic efforts collapsed in failure. Relations have worsened and trust has been badly damaged.',
    [OutcomeQuality.Poor]: 'The diplomatic initiative achieved little. Negotiations stalled and positions hardened.',
    [OutcomeQuality.Expected]: 'Diplomatic proceedings went as anticipated. Relations adjust accordingly.',
    [OutcomeQuality.Good]: 'Diplomacy proved more fruitful than expected. Goodwill was generated beyond what was planned.',
    [OutcomeQuality.Excellent]: 'A diplomatic triumph. The negotiations produced results that exceeded the most optimistic projections.',
  },
  [EventCategory.Environment]: {
    [OutcomeQuality.Disastrous]: 'Nature proved far crueler than expected. The environmental damage is severe and recovery will be long.',
    [OutcomeQuality.Poor]: 'Efforts to manage the environmental situation fell short. Damage was greater than projected.',
    [OutcomeQuality.Expected]: 'Environmental response proceeded as planned. Recovery is on track.',
    [OutcomeQuality.Good]: 'The environmental response yielded better results than anticipated. Damage was less severe than feared.',
    [OutcomeQuality.Excellent]: 'Remarkable environmental recovery. The kingdom emerged from the crisis in better condition than anyone dared hope.',
  },
  [EventCategory.PublicOrder]: {
    [OutcomeQuality.Disastrous]: 'The attempt to restore order descended into chaos. The streets are more dangerous than before.',
    [OutcomeQuality.Poor]: 'Public order efforts were only partially successful. Unrest simmers beneath the surface.',
    [OutcomeQuality.Expected]: 'Order was maintained as expected. The situation stabilized according to plan.',
    [OutcomeQuality.Good]: 'Public order was restored more quickly than anticipated. The population appears reassured.',
    [OutcomeQuality.Excellent]: 'A masterful restoration of order. Public confidence has surged and the streets are calm.',
  },
  [EventCategory.Religion]: {
    [OutcomeQuality.Disastrous]: 'The religious intervention inflamed passions rather than calming them. Faith is shaken and the clergy is divided.',
    [OutcomeQuality.Poor]: 'Religious matters did not resolve as hoped. Tensions remain and the faithful are unsettled.',
    [OutcomeQuality.Expected]: 'The religious matter was addressed as planned. The faithful respond accordingly.',
    [OutcomeQuality.Good]: 'Religious tensions eased more than expected. The faithful responded well to the crown\'s guidance.',
    [OutcomeQuality.Excellent]: 'An inspired resolution of the religious matter. Faith is strengthened and the clergy is unified in gratitude.',
  },
  [EventCategory.Culture]: {
    [OutcomeQuality.Disastrous]: 'Cultural initiatives were poorly received. Cohesion fractured and traditions were undermined.',
    [OutcomeQuality.Poor]: 'The cultural response produced mixed results. Some progress was made, but at a cost.',
    [OutcomeQuality.Expected]: 'Cultural affairs developed as anticipated.',
    [OutcomeQuality.Good]: 'Cultural efforts bore unexpected fruit. The kingdom\'s identity grew stronger.',
    [OutcomeQuality.Excellent]: 'A golden moment for the kingdom\'s culture. Arts flourish and traditions are celebrated with renewed vigor.',
  },
  [EventCategory.Espionage]: {
    [OutcomeQuality.Disastrous]: 'Intelligence operations were compromised. The network is exposed and adversaries are aware of our methods.',
    [OutcomeQuality.Poor]: 'The espionage effort yielded little of value. Resources were spent for minimal return.',
    [OutcomeQuality.Expected]: 'Intelligence operations proceeded as planned.',
    [OutcomeQuality.Good]: 'The espionage effort uncovered more than expected. Valuable intelligence has been secured.',
    [OutcomeQuality.Excellent]: 'A stunning intelligence success. Critical secrets have been obtained that will serve the crown for years.',
  },
  [EventCategory.Knowledge]: {
    [OutcomeQuality.Disastrous]: 'Scholarly efforts ended in disaster. Knowledge was lost and progress set back considerably.',
    [OutcomeQuality.Poor]: 'Research produced disappointing results. The scholars report setbacks and dead ends.',
    [OutcomeQuality.Expected]: 'Scholarly work proceeded as expected. Progress continues on schedule.',
    [OutcomeQuality.Good]: 'Research yielded unexpected breakthroughs. The scholars are energized by their discoveries.',
    [OutcomeQuality.Excellent]: 'A watershed moment in scholarship. Revolutionary insights have advanced the kingdom\'s knowledge dramatically.',
  },
  [EventCategory.ClassConflict]: {
    [OutcomeQuality.Disastrous]: 'The intervention worsened class tensions dramatically. Both sides feel betrayed and the divide has deepened.',
    [OutcomeQuality.Poor]: 'Efforts to address class tensions achieved little. Resentment persists on all sides.',
    [OutcomeQuality.Expected]: 'Class tensions were managed as expected. The situation stabilized.',
    [OutcomeQuality.Good]: 'Class tensions eased more than anticipated. The competing interests found unexpected common ground.',
    [OutcomeQuality.Excellent]: 'A remarkable resolution of class tensions. Cooperation has replaced conflict, at least for now.',
  },
  [EventCategory.Region]: {
    [OutcomeQuality.Disastrous]: 'Regional management failed badly. Conditions deteriorated beyond all projections.',
    [OutcomeQuality.Poor]: 'The regional response fell short. Recovery is slower than hoped.',
    [OutcomeQuality.Expected]: 'Regional affairs proceeded as planned.',
    [OutcomeQuality.Good]: 'Regional conditions improved beyond expectations. The provinces report favorable developments.',
    [OutcomeQuality.Excellent]: 'Exceptional regional outcomes. The affected areas have recovered stronger than before.',
  },
  [EventCategory.Kingdom]: {
    [OutcomeQuality.Disastrous]: 'The crown\'s response to this kingdom-wide matter was a grave miscalculation. The realm is shaken.',
    [OutcomeQuality.Poor]: 'The kingdom-wide initiative produced lackluster results. The realm adjusts, but with less benefit than hoped.',
    [OutcomeQuality.Expected]: 'Affairs of the realm proceeded as anticipated.',
    [OutcomeQuality.Good]: 'The crown\'s response proved wiser than expected. The realm benefits from favorable outcomes.',
    [OutcomeQuality.Excellent]: 'A masterful handling of affairs. The realm emerges stronger, and the crown\'s reputation is enhanced.',
  },
};

/**
 * Returns the appropriate outcome narrative for a resolved event.
 * Falls back to generic category-based text.
 */
export function getOutcomeNarrative(
  category: EventCategory | string,
  quality: OutcomeQuality,
): string {
  const categoryNarratives = GENERIC_OUTCOME_NARRATIVES[category];
  if (categoryNarratives) {
    return categoryNarratives[quality];
  }
  // Absolute fallback.
  switch (quality) {
    case OutcomeQuality.Disastrous: return 'The outcome was disastrous. Far worse than anyone anticipated.';
    case OutcomeQuality.Poor: return 'Results fell short of expectations.';
    case OutcomeQuality.Expected: return 'Events unfolded as anticipated.';
    case OutcomeQuality.Good: return 'The outcome was more favorable than expected.';
    case OutcomeQuality.Excellent: return 'An exceptional outcome, exceeding all expectations.';
  }
}
