// Phase 3 — Authored agenda definitions.
// Each RivalAgenda has a target class, a pressureModifier map (multiplies
// the Phase 2 pressure score per NeighborActionType), and a satisfaction
// predicate that reads world state to decide whether the agenda has run
// its course or is still in flight.

import {
  NeighborActionType,
  RivalAgenda,
  type NeighborState,
  type GameState,
  type RivalAgendaState,
} from '../../engine/types';

export type AgendaSatisfaction = 'active' | 'satisfied' | 'lapsed';

export type AgendaTargetClass = 'region' | 'neighbor' | 'settlement' | 'none';

export interface AgendaDef {
  target: AgendaTargetClass;
  /** Multipliers applied per action type. Omitted actions default to 1.0. */
  pressureModifiers: Partial<Record<NeighborActionType, number>>;
  /** Satisfaction predicate. Called by tickAgenda/shouldAgendaShift. */
  satisfaction: (
    agenda: RivalAgendaState,
    neighbor: NeighborState,
    state: GameState,
  ) => AgendaSatisfaction;
}

// ---- Per-agenda satisfaction helpers -----------------------------------

/** RestoreTheOldBorders: satisfied when the neighbor controls the target
 * region (we approximate by checking the region is occupied by any rival
 * — RegionState doesn't record an owning neighbor id). Lapses if the
 * target region id is gone from state.regions. */
const satisfactionRestoreBorders: AgendaDef['satisfaction'] = (
  agenda,
  _neighbor,
  state,
) => {
  if (!agenda.targetEntityId) return 'lapsed';
  const region = state.regions.find((r) => r.id === agenda.targetEntityId);
  if (!region) return 'lapsed';
  if (region.isOccupied) return 'satisfied';
  return 'active';
};

/** EconomicRecovery: satisfied when treasuryHealth climbs above 60. */
const satisfactionEconomicRecovery: AgendaDef['satisfaction'] = (
  _agenda,
  neighbor,
) => {
  const sim = neighbor.kingdomSimulation;
  if (!sim) return 'active';
  if (sim.treasuryHealth >= 60) return 'satisfied';
  return 'active';
};

/** DefensiveConsolidation: satisfied when internal stability climbs above 70. */
const satisfactionDefensive: AgendaDef['satisfaction'] = (_agenda, neighbor) => {
  const sim = neighbor.kingdomSimulation;
  if (!sim) return 'active';
  if (sim.internalStability >= 70) return 'satisfied';
  return 'active';
};

/** Untargeted default — never auto-satisfies, relies on turnsActive cap. */
const satisfactionStayActive: AgendaDef['satisfaction'] = () => 'active';

// ---- Definitions -------------------------------------------------------

export const AGENDA_DEFS: Record<RivalAgenda, AgendaDef> = {
  [RivalAgenda.RestoreTheOldBorders]: {
    target: 'region',
    pressureModifiers: {
      [NeighborActionType.Demand]: 1.6,
      [NeighborActionType.BorderTension]: 1.5,
      [NeighborActionType.WarDeclaration]: 1.4,
      [NeighborActionType.MilitaryBuildup]: 1.3,
      [NeighborActionType.TreatyProposal]: 0.6,
    },
    satisfaction: satisfactionRestoreBorders,
  },

  [RivalAgenda.BleedTheRivals]: {
    target: 'neighbor',
    pressureModifiers: {
      // BleedTheRivals aims at other rivals; against the player it suppresses
      // direct action in favor of proxy pressure.
      [NeighborActionType.WarDeclaration]: 0.5,
      [NeighborActionType.Demand]: 0.7,
      [NeighborActionType.TradeProposal]: 1.3,
      [NeighborActionType.TreatyProposal]: 1.3,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.DominateTrade]: {
    target: 'neighbor',
    pressureModifiers: {
      [NeighborActionType.TradeProposal]: 1.7,
      [NeighborActionType.TradeWithdrawal]: 1.4,
      [NeighborActionType.Demand]: 1.2,
      [NeighborActionType.WarDeclaration]: 0.6,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.ReligiousHegemony]: {
    target: 'neighbor',
    pressureModifiers: {
      [NeighborActionType.ReligiousPressure]: 1.8,
      [NeighborActionType.Demand]: 1.2,
      [NeighborActionType.TradeProposal]: 0.7,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.DynasticAlliance]: {
    target: 'neighbor',
    pressureModifiers: {
      [NeighborActionType.TreatyProposal]: 1.7,
      [NeighborActionType.TradeProposal]: 1.3,
      [NeighborActionType.WarDeclaration]: 0.3,
      [NeighborActionType.Demand]: 0.5,
      [NeighborActionType.BorderTension]: 0.5,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.SubjugateAVassal]: {
    target: 'neighbor',
    pressureModifiers: {
      [NeighborActionType.Demand]: 1.6,
      [NeighborActionType.MilitaryBuildup]: 1.4,
      [NeighborActionType.TreatyProposal]: 1.2,
      [NeighborActionType.TradeProposal]: 0.8,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.SackASettlement]: {
    target: 'settlement',
    pressureModifiers: {
      [NeighborActionType.MilitaryBuildup]: 1.5,
      [NeighborActionType.BorderTension]: 1.4,
      [NeighborActionType.WarDeclaration]: 1.3,
      [NeighborActionType.TreatyProposal]: 0.4,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.DefensiveConsolidation]: {
    target: 'none',
    pressureModifiers: {
      [NeighborActionType.MilitaryBuildup]: 1.3,
      [NeighborActionType.TreatyProposal]: 1.2,
      [NeighborActionType.WarDeclaration]: 0.4,
      [NeighborActionType.Demand]: 0.5,
      [NeighborActionType.BorderTension]: 0.6,
    },
    satisfaction: satisfactionDefensive,
  },

  [RivalAgenda.IsolationistRetreat]: {
    target: 'none',
    pressureModifiers: {
      [NeighborActionType.TradeWithdrawal]: 1.5,
      [NeighborActionType.MilitaryBuildup]: 1.2,
      [NeighborActionType.TradeProposal]: 0.4,
      [NeighborActionType.TreatyProposal]: 0.5,
      [NeighborActionType.WarDeclaration]: 0.3,
      [NeighborActionType.Demand]: 0.5,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.EconomicRecovery]: {
    target: 'none',
    pressureModifiers: {
      [NeighborActionType.TradeProposal]: 1.5,
      [NeighborActionType.TreatyProposal]: 1.3,
      [NeighborActionType.WarDeclaration]: 0.2,
      [NeighborActionType.Demand]: 0.3,
      [NeighborActionType.MilitaryBuildup]: 0.5,
    },
    satisfaction: satisfactionEconomicRecovery,
  },

  [RivalAgenda.ConvertThePlayer]: {
    target: 'none',
    pressureModifiers: {
      [NeighborActionType.ReligiousPressure]: 1.9,
      [NeighborActionType.TreatyProposal]: 1.2,
      [NeighborActionType.WarDeclaration]: 0.5,
    },
    satisfaction: satisfactionStayActive,
  },

  [RivalAgenda.ProveDominance]: {
    target: 'neighbor',
    pressureModifiers: {
      [NeighborActionType.MilitaryBuildup]: 1.5,
      [NeighborActionType.BorderTension]: 1.3,
      [NeighborActionType.WarDeclaration]: 1.3,
      [NeighborActionType.Demand]: 1.2,
    },
    satisfaction: satisfactionStayActive,
  },
};
