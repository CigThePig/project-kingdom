// Phase 6.6 — Neighbor Action Card Mechanical Effects
// Maps NeighborActionType → choiceId → MechanicalEffectDelta.
// diplomacyDeltas use a placeholder key '__NEIGHBOR__' which the bridge
// replaces with the actual neighborId at card generation time.

import type { MechanicalEffectDelta } from '../../engine/types';
import { NeighborActionType } from '../../engine/types';

export const NEIGHBOR_ACTION_EFFECTS: Record<NeighborActionType, Record<string, MechanicalEffectDelta>> = {
  // ============================================================
  // Crisis-tier
  // ============================================================
  [NeighborActionType.WarDeclaration]: {
    mobilize_for_war:       { militaryReadinessDelta: +10, militaryMoraleDelta: +5, treasuryDelta: -60, commonerSatDelta: -3 },
    seek_emergency_diplomacy: { stabilityDelta: +2, treasuryDelta: -30, diplomacyDeltas: { __NEIGHBOR__: +5 } },
    defensive_posture:      { militaryReadinessDelta: +5, stabilityDelta: -2 },
  },
  [NeighborActionType.Demand]: {
    comply_with_demand:  { treasuryDelta: -40, stabilityDelta: +2, diplomacyDeltas: { __NEIGHBOR__: +10 } },
    negotiate_terms:     { treasuryDelta: -20, diplomacyDeltas: { __NEIGHBOR__: +5 } },
    reject_demand:       { stabilityDelta: -2, militaryReadinessDelta: +3, diplomacyDeltas: { __NEIGHBOR__: -10 } },
  },
  [NeighborActionType.MilitaryBuildup]: {
    match_buildup:       { militaryReadinessDelta: +8, treasuryDelta: -45, militaryCasteSatDelta: +2 },
    diplomatic_inquiry:  { espionageNetworkDelta: +3, treasuryDelta: -15, diplomacyDeltas: { __NEIGHBOR__: +3 } },
    monitor_situation:   { espionageNetworkDelta: +1 },
  },
  [NeighborActionType.EspionageRetaliation]: {
    deny_involvement:     { espionageNetworkDelta: -3, diplomacyDeltas: { __NEIGHBOR__: -5 } },
    offer_compensation:   { treasuryDelta: -25, diplomacyDeltas: { __NEIGHBOR__: +8 }, espionageNetworkDelta: -2 },
    escalate_operations:  { espionageNetworkDelta: +5, diplomacyDeltas: { __NEIGHBOR__: -10 }, stabilityDelta: -2 },
  },

  // ============================================================
  // Petition-tier
  // ============================================================
  [NeighborActionType.TradeProposal]: {
    accept_trade_proposal:  { merchantSatDelta: -2, treasuryDelta: +15, diplomacyDeltas: { __NEIGHBOR__: +8 }, commonerSatDelta: +1 },
    decline_trade_proposal: { diplomacyDeltas: { __NEIGHBOR__: -3 } },
  },
  [NeighborActionType.TradeWithdrawal]: {
    seek_reconciliation: { treasuryDelta: -15, merchantSatDelta: -1, diplomacyDeltas: { __NEIGHBOR__: +5 } },
    accept_withdrawal:   { merchantSatDelta: -3, treasuryDelta: -10 },
  },
  [NeighborActionType.TreatyProposal]: {
    accept_treaty:  { stabilityDelta: +3, diplomacyDeltas: { __NEIGHBOR__: +12 }, militaryReadinessDelta: -3, treasuryDelta: -15 },
    decline_treaty: { diplomacyDeltas: { __NEIGHBOR__: -5 } },
  },
  [NeighborActionType.PeaceOffer]: {
    accept_peace: { stabilityDelta: +5, commonerSatDelta: +3, militaryReadinessDelta: -3, diplomacyDeltas: { __NEIGHBOR__: +15 } },
    reject_peace: { militaryMoraleDelta: +2, diplomacyDeltas: { __NEIGHBOR__: -8 } },
  },
  [NeighborActionType.BorderTension]: {
    reinforce_border:    { militaryReadinessDelta: +3, treasuryDelta: -15, diplomacyDeltas: { __NEIGHBOR__: -3 } },
    ignore_provocation:  { stabilityDelta: -1, diplomacyDeltas: { __NEIGHBOR__: +2 } },
  },
  [NeighborActionType.ReligiousPressure]: {
    counter_religious_influence: { faithDelta: +3, clergySatDelta: +2, heterodoxyDelta: -2, diplomacyDeltas: { __NEIGHBOR__: -5 } },
    tolerate_foreign_doctrine:   { heterodoxyDelta: +3, culturalCohesionDelta: -1, diplomacyDeltas: { __NEIGHBOR__: +3 } },
  },
};
