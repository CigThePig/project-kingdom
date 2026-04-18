// Phase 12 — World Event Choice Effects
// Maps effectsKey -> MechanicalEffectDelta. Each choice represents a genuine
// tradeoff; no strictly dominant options. Applied once when the player picks
// a response; the per-turn effects in the definition continue independently
// as long as the event is active.

import type { MechanicalEffectDelta } from '../../engine/types';

export const WORLD_EVENT_CHOICE_EFFECTS: Record<string, MechanicalEffectDelta> = {
  // --- The Black Pox ---
  we_black_pox__quarantine:            { treasuryDelta: -30, stabilityDelta: -4, faithDelta: +2, commonerSatDelta: -3 },
  we_black_pox__send_aid:              { treasuryDelta: -60, diplomacyDeltas: { }, clergySatDelta: +3, stabilityDelta: +2 },
  we_black_pox__ignore:                { stabilityDelta: -6, commonerSatDelta: -5, clergySatDelta: -3 },

  // --- The Long Winter ---
  we_long_winter__stockpile:           { treasuryDelta: -40, foodDelta: +60, merchantSatDelta: -2 },
  we_long_winter__open_granaries:      { foodDelta: -80, commonerSatDelta: +5, stabilityDelta: +3 },
  we_long_winter__tax_relief:          { treasuryDelta: -30, commonerSatDelta: +3, nobilitySatDelta: -2 },

  // --- The Great Devaluation ---
  we_great_devaluation__debase_coinage:{ treasuryDelta: +40, merchantSatDelta: -5, stabilityDelta: -2 },
  we_great_devaluation__tighten_mint:  { treasuryDelta: -20, merchantSatDelta: +3, commonerSatDelta: -2 },
  we_great_devaluation__absorb_loss:   { treasuryDelta: -50, merchantSatDelta: +2, nobilitySatDelta: +2 },

  // --- The Pilgrim Movement ---
  we_pilgrim_movement__endorse:        { treasuryDelta: -20, faithDelta: +4, clergySatDelta: +4, commonerSatDelta: +2 },
  we_pilgrim_movement__tax_pilgrims:   { treasuryDelta: +40, faithDelta: -2, clergySatDelta: -3 },
  we_pilgrim_movement__forbid:         { heterodoxyDelta: +3, clergySatDelta: -4, stabilityDelta: -2 },

  // --- The Mercenary Uprising ---
  we_mercenary_uprising__hire_company: { treasuryDelta: -80, militaryForceSizeDelta: +8, stabilityDelta: +2 },
  we_mercenary_uprising__crush_them:   { treasuryDelta: -40, militaryReadinessDelta: -5, militaryCasteSatDelta: +3, stabilityDelta: +3 },
  we_mercenary_uprising__negotiate:    { treasuryDelta: -30, stabilityDelta: +1, militaryCasteSatDelta: -2 },

  // --- The Comet Year ---
  we_comet_year__proclaim_omen:        { faithDelta: +3, clergySatDelta: +3, heterodoxyDelta: -2 },
  we_comet_year__dismiss:              { heterodoxyDelta: +2, commonerSatDelta: -2 },
  we_comet_year__fund_observatory:     { treasuryDelta: -40, culturalCohesionDelta: +3 },

  // --- The Heretical Doctrine ---
  we_heretical_doctrine__inquisition:      { treasuryDelta: -30, heterodoxyDelta: -5, stabilityDelta: -3, clergySatDelta: +4 },
  we_heretical_doctrine__tolerate:         { heterodoxyDelta: +3, culturalCohesionDelta: +2, clergySatDelta: -4 },
  we_heretical_doctrine__council_of_faith: { treasuryDelta: -40, heterodoxyDelta: -2, clergySatDelta: +2, culturalCohesionDelta: +1 },

  // --- The Locust Years ---
  we_locust_years__ration:             { foodDelta: +40, commonerSatDelta: -4, stabilityDelta: -2 },
  we_locust_years__import_grain:       { treasuryDelta: -60, foodDelta: +60 },
  we_locust_years__levy_farms:         { treasuryDelta: +20, commonerSatDelta: -3, foodDelta: -20 },

  // --- The Trade League ---
  we_trade_league__join_league:        { treasuryDelta: -30, merchantSatDelta: +5, diplomacyDeltas: { } },
  we_trade_league__undercut:           { treasuryDelta: +30, merchantSatDelta: -3, stabilityDelta: -1 },
  we_trade_league__abstain:            { merchantSatDelta: -2 },

  // --- The Calling Crusade ---
  we_calling_crusade__answer_call:     { treasuryDelta: -80, militaryReadinessDelta: -6, faithDelta: +5, clergySatDelta: +5, militaryCasteSatDelta: +3 },
  we_calling_crusade__send_levies:     { treasuryDelta: -30, militaryReadinessDelta: -3, faithDelta: +2, clergySatDelta: +2 },
  we_calling_crusade__decline:         { faithDelta: -3, clergySatDelta: -4, heterodoxyDelta: +2 },
};
