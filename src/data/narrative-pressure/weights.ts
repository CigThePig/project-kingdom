// Narrative Pressure — Master Weight Map
// Maps every player decision to its narrative pressure axis contributions.
// Keyed by: `${sourceType}:${sourceId}:${choiceId}`
//
// TODO: Populate with pressure weights for all ~650 decision points.
// See NARRATIVE-PRESSURE-SYSTEM.md §2 for weight ranges:
//   - Normal decisions: 1-5
//   - Major decisions: 5-10
//   - Crisis-level pivots: 10-15
//   - Follow-up event choices: 4-10 (amplified — doubling down)
//   - Storyline branch choices: 6-12 (highest weight — pivotal moments)
//
// Source categories to cover:
//   - event:{eventId}:{choiceId} — EVENT_POOL and FOLLOW_UP_POOL choices
//   - faction:{requestId}:{choiceId} — Faction request swipes
//   - decree:{decreeId} — Decree selections (no choiceId)
//   - negotiation:{negotiationId}:{termId} — Negotiation term toggles
//   - assessment:{assessmentId}:{choiceId} — Assessment posture choices
//   - neighbor:{actionType}:{responseChoice} — Neighbor action responses
//   - storyline:{storylineId}:{choiceId} — Storyline branch choices

import type { NarrativePressure } from '../../engine/types';

export interface PressureWeightEntry {
  axisWeights: Partial<NarrativePressure>;
}

export const PRESSURE_WEIGHTS: Record<string, PressureWeightEntry> = {
  // TODO: Add entries for all decision points.
  // Example entries from the spec:
  //
  // 'faction:faction_req_clergy_heresy_crackdown:authorize_crackdown': {
  //   axisWeights: { authority: 4, piety: 5 },
  // },
  // 'faction:faction_req_clergy_heresy_crackdown:refuse_crackdown': {
  //   axisWeights: { reform: 3, openness: 2 },
  // },
  // 'event:evt_harvest_blight:quarantine_affected_fields': {
  //   axisWeights: { authority: 2 },
  // },
  // 'event:evt_harvest_blight:purchase_foreign_grain': {
  //   axisWeights: { commerce: 2, openness: 1 },
  // },
  // 'decree:decree_raise_taxes': {
  //   axisWeights: { authority: 2 },
  // },
};
