import { Season, SeasonMonth } from '../../engine/types';

export const THEMATIC_MONTH_NAMES: Record<Season, Record<SeasonMonth, string>> = {
  [Season.Spring]: {
    [SeasonMonth.Early]: 'Early Thaw',
    [SeasonMonth.Mid]: 'High Spring',
    [SeasonMonth.Late]: 'Late Bloom',
  },
  [Season.Summer]: {
    [SeasonMonth.Early]: 'Early Harvest',
    [SeasonMonth.Mid]: 'High Summer',
    [SeasonMonth.Late]: "Summer's End",
  },
  [Season.Autumn]: {
    [SeasonMonth.Early]: 'First Harvest',
    [SeasonMonth.Mid]: 'Deep Autumn',
    [SeasonMonth.Late]: 'Last Light',
  },
  [Season.Winter]: {
    [SeasonMonth.Early]: 'First Frost',
    [SeasonMonth.Mid]: 'Deep Winter',
    [SeasonMonth.Late]: "Winter's End",
  },
};
