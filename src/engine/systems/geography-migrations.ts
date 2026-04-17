// Phase 2.5 — Geography save migration helpers.
// Legacy saves (SAVE_VERSION 1) have no `geography` field. This module
// synthesizes the graph that the corresponding scenario factory would have
// produced so older save files load without data loss.
//
// Keep this module in sync with the geography blocks in
// src/data/scenarios/*.ts. If a scenario's geography shape changes, mirror
// the change here.

import { edge } from './geography';
import type { GameState, WorldGeography } from '../types';

function defaultGeography(): WorldGeography {
  return {
    schemaVersion: 1,
    edges: [
      edge('region_heartlands', 'region_ironvale',   'land',          'open'),
      edge('region_heartlands', 'region_timbermark', 'river',         'open'),
      edge('region_ironvale',   'region_timbermark', 'mountain_pass', 'difficult'),
      edge('region_timbermark', 'neighbor_arenthal', 'land',          'contested'),
      edge('region_ironvale',   'neighbor_valdris',  'mountain_pass', 'contested'),
      edge('neighbor_arenthal', 'neighbor_valdris',  'sea',           'open'),
    ],
    historicClaims: [
      {
        neighborId: 'neighbor_valdris',
        regionId: 'region_ironvale',
        claimStrength: 'ancestral',
        lostOnTurn: null,
        internalReasonCode: 'valdrisi_iron_birthright',
      },
    ],
    settlements: [
      { id: 'settlement_heartcrown', regionId: 'region_heartlands', role: 'capital',  populationShare: 0.4 },
      { id: 'settlement_ironwatch',  regionId: 'region_ironvale',   role: 'fortress', populationShare: 0.25 },
    ],
  };
}

function faithfulKingdomGeography(): WorldGeography {
  return {
    schemaVersion: 1,
    edges: [
      edge('region_heartlands', 'region_ironvale',   'land',          'open'),
      edge('region_heartlands', 'region_timbermark', 'river',         'open'),
      edge('region_ironvale',   'region_timbermark', 'mountain_pass', 'difficult'),
      edge('region_timbermark', 'neighbor_arenthal', 'land',          'contested'),
      edge('region_ironvale',   'neighbor_valdris',  'mountain_pass', 'contested'),
      edge('neighbor_arenthal', 'neighbor_valdris',  'land',          'open'),
    ],
    historicClaims: [
      {
        neighborId: 'neighbor_valdris',
        regionId: 'region_ironvale',
        claimStrength: 'ancestral',
        lostOnTurn: null,
        internalReasonCode: 'schism_of_the_old_faith',
      },
      {
        neighborId: 'neighbor_arenthal',
        regionId: 'region_timbermark',
        claimStrength: 'disputed',
        lostOnTurn: null,
        internalReasonCode: 'disputed_monastery',
      },
    ],
    settlements: [
      { id: 'settlement_sanctumhold', regionId: 'region_heartlands', role: 'capital', populationShare: 0.4 },
      { id: 'settlement_vigilglade',  regionId: 'region_timbermark', role: 'shrine',  populationShare: 0.15 },
    ],
  };
}

function fracturedInheritanceGeography(): WorldGeography {
  return {
    schemaVersion: 1,
    edges: [
      edge('region_heartlands', 'region_ironvale',   'land',          'contested'),
      edge('region_heartlands', 'region_timbermark', 'river',         'contested'),
      edge('region_ironvale',   'region_timbermark', 'mountain_pass', 'difficult'),
      edge('region_timbermark', 'neighbor_arenthal', 'land',          'contested'),
      edge('region_ironvale',   'neighbor_valdris',  'mountain_pass', 'contested'),
      edge('region_heartlands', 'neighbor_valdris',  'land',          'contested'),
      edge('neighbor_arenthal', 'neighbor_valdris',  'land',          'contested'),
    ],
    historicClaims: [
      { neighborId: 'neighbor_valdris',  regionId: 'region_ironvale',   claimStrength: 'ancestral', lostOnTurn: null, internalReasonCode: 'valdrisi_iron_birthright' },
      { neighborId: 'neighbor_valdris',  regionId: 'region_heartlands', claimStrength: 'disputed',  lostOnTurn: null, internalReasonCode: 'claimant_of_the_middle_throne' },
      { neighborId: 'neighbor_arenthal', regionId: 'region_timbermark', claimStrength: 'recent',    lostOnTurn: null, internalReasonCode: 'arenthali_border_grievance' },
    ],
    settlements: [
      { id: 'settlement_brokencrown',   regionId: 'region_heartlands', role: 'capital', populationShare: 0.35 },
      { id: 'settlement_rivalsmarket',  regionId: 'region_timbermark', role: 'market',  populationShare: 0.2 },
    ],
  };
}

function frozenMarchGeography(): WorldGeography {
  return {
    schemaVersion: 1,
    edges: [
      edge('region_heartlands', 'region_ironvale',   'mountain_pass', 'difficult'),
      edge('region_heartlands', 'region_timbermark', 'land',          'open'),
      edge('region_ironvale',   'region_timbermark', 'mountain_pass', 'difficult'),
      edge('region_timbermark', 'neighbor_arenthal', 'mountain_pass', 'contested'),
      edge('region_ironvale',   'neighbor_valdris',  'mountain_pass', 'contested'),
      edge('neighbor_arenthal', 'neighbor_valdris',  'mountain_pass', 'difficult'),
    ],
    historicClaims: [
      {
        neighborId: 'neighbor_arenthal',
        regionId: 'region_timbermark',
        claimStrength: 'ancestral',
        lostOnTurn: null,
        internalReasonCode: 'arenthali_winter_conquest',
      },
    ],
    settlements: [
      { id: 'settlement_frosthold', regionId: 'region_heartlands', role: 'capital',  populationShare: 0.35 },
      { id: 'settlement_ironpass',  regionId: 'region_ironvale',   role: 'fortress', populationShare: 0.25 },
    ],
  };
}

function merchantsGambitGeography(): WorldGeography {
  return {
    schemaVersion: 1,
    edges: [
      edge('region_heartlands', 'region_ironvale',   'land',  'open'),
      edge('region_heartlands', 'region_timbermark', 'river', 'open'),
      edge('region_ironvale',   'region_timbermark', 'river', 'open'),
      edge('region_timbermark', 'neighbor_arenthal', 'sea',   'open'),
      edge('region_heartlands', 'neighbor_valdris',  'sea',   'open'),
      edge('region_ironvale',   'neighbor_krath',    'land',  'contested'),
      edge('neighbor_arenthal', 'neighbor_valdris',  'sea',   'open'),
      edge('neighbor_arenthal', 'neighbor_krath',    'sea',   'contested'),
      edge('neighbor_valdris',  'neighbor_krath',    'land',  'open'),
    ],
    historicClaims: [
      {
        neighborId: 'neighbor_krath',
        regionId: 'region_ironvale',
        claimStrength: 'recent',
        lostOnTurn: null,
        internalReasonCode: 'krathi_trade_revanchism',
      },
    ],
    settlements: [
      { id: 'settlement_goldhaven',     regionId: 'region_heartlands', role: 'capital', populationShare: 0.4 },
      { id: 'settlement_silvermarket',  regionId: 'region_timbermark', role: 'market',  populationShare: 0.3 },
    ],
  };
}

/**
 * Emergency fallback: connects every region to every neighbor. Preserves the
 * "borderRegion = true" semantics when the scenarioId is unknown (e.g. an
 * experimental scenario that has since been removed).
 */
function emergencyGeography(state: GameState): WorldGeography {
  const edges = [];
  const regions = state.regions.map((r) => r.id);
  const neighbors = state.diplomacy.neighbors.map((n) => n.id);
  for (const r of regions) {
    for (const n of neighbors) {
      edges.push(edge(r, n, 'land', 'contested'));
    }
  }
  return { schemaVersion: 1, edges, historicClaims: [], settlements: [] };
}

/**
 * Returns the geography graph that the scenario factory for `scenarioId` would
 * have produced. Used by LOAD_SAVE to migrate pre-Phase-2.5 saves.
 *
 * Falls back to an emergency graph (every region ↔ every neighbor) if the
 * scenarioId is unknown, so legacy saves from removed scenarios still load.
 */
export function synthesizeGeographyFromScenario(
  scenarioId: string,
  state: GameState,
): WorldGeography {
  switch (scenarioId) {
    case 'new_crown':             return defaultGeography();
    case 'faithful_kingdom':      return faithfulKingdomGeography();
    case 'fractured_inheritance': return fracturedInheritanceGeography();
    case 'frozen_march':          return frozenMarchGeography();
    case 'merchants_gambit':      return merchantsGambitGeography();
    default:                      return emergencyGeography(state);
  }
}
