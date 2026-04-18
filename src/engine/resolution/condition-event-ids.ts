// Maps runtime ConditionType + ConditionSeverity to the authored event
// definition IDs in `src/data/events/` and the matching text keys in
// `src/data/text/`. Previously the runtime derived these IDs by lowercasing
// the enum name (e.g. `evt_cond_criminalunderworld_mild`) which did not match
// the authored IDs (e.g. `evt_social_criminal_mild`), so condition cards
// surfaced with fallback text even when authored content existed.
//
// When adding a new ConditionType, add its prefix here AND ensure authored
// content uses the resulting IDs. Tests in `condition-event-ids.test.ts`
// round-trip every enum member to catch drift.

import { ConditionSeverity, ConditionType } from '../types';

// Prefix that, joined with the lowercase severity, produces the event
// definition ID. e.g. `evt_social_banditry_` + `mild` → `evt_social_banditry_mild`.
const CONDITION_EVENT_ID_PREFIX: Record<ConditionType, string> = {
  // Environmental
  [ConditionType.Drought]: 'evt_cond_drought_',
  [ConditionType.Flood]: 'evt_cond_flood_',
  [ConditionType.HarshWinter]: 'evt_cond_harshwinter_',
  [ConditionType.Blight]: 'evt_cond_blight_',
  [ConditionType.BountifulHarvest]: 'evt_cond_bountifulharvest_',
  // Health
  [ConditionType.Plague]: 'evt_cond_plague_',
  [ConditionType.Pox]: 'evt_cond_pox_',
  [ConditionType.Famine]: 'evt_cond_famine_',
  [ConditionType.Pestilence]: 'evt_cond_pestilence_',
  // Social (authored under evt_social_*, with CriminalUnderworld shortened
  // to `criminal` and Unrest/Corruption kept literal).
  [ConditionType.Banditry]: 'evt_social_banditry_',
  [ConditionType.Corruption]: 'evt_social_corruption_',
  [ConditionType.Unrest]: 'evt_social_unrest_',
  [ConditionType.CriminalUnderworld]: 'evt_social_criminal_',
  // Economic (TradeDisruption authored text uses snake_case; MarketPanic too).
  [ConditionType.TradeDisruption]: 'evt_cond_trade_disruption_',
  [ConditionType.MarketPanic]: 'evt_cond_market_panic_',
  // Positive
  [ConditionType.GoldenAge]: 'evt_cond_goldenage_',
  [ConditionType.HarvestFestival]: 'evt_cond_harvestfestival_',
  [ConditionType.PilgrimageSeason]: 'evt_cond_pilgrimageseason_',
  [ConditionType.MilitaryTriumph]: 'evt_cond_militarytriumph_',
};

export function conditionEventDefinitionId(
  type: ConditionType,
  severity: ConditionSeverity,
): string {
  return `${CONDITION_EVENT_ID_PREFIX[type]}${severity.toLowerCase()}`;
}

export function conditionEventDefinitionIdForResolution(type: ConditionType): string {
  return `${CONDITION_EVENT_ID_PREFIX[type]}resolved`;
}
