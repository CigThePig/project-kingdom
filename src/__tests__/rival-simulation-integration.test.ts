// Phase 2 — Integration: rival simulation persists and diversifies across turns.
// This smoke test guards the wiring between turn-resolution, diplomacy, and
// the rival simulation. Specifically it verifies that:
//   - kingdomSimulation state is preserved turn-over-turn
//   - rival economies diverge over a multi-turn simulation
//   - rivals placed in crisis declare war less often than healthy rivals

import { describe, expect, it } from 'vitest';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { createDefaultScenario } from '../data/scenarios/default';
import { NeighborActionType, RivalCrisisType } from '../engine/types';
import {
  computeRivalActionPressure,
  createInitialRivalState,
} from '../engine/systems/rival-simulation';
import { NeighborDisposition } from '../engine/types';

describe('rival simulation integration', () => {
  it('retains and evolves kingdomSimulation across a 30-turn run', () => {
    let state = createDefaultScenario();
    const initialTreasuries = state.diplomacy.neighbors.map(
      (n) => n.kingdomSimulation?.treasuryHealth ?? 0,
    );

    for (let i = 0; i < 30; i++) {
      state = resolveTurn(state, applyActionEffects, []).nextState;
    }

    for (const n of state.diplomacy.neighbors) {
      expect(n.kingdomSimulation).toBeDefined();
      expect(n.kingdomSimulation?.treasuryHealth).toBeGreaterThanOrEqual(0);
      expect(n.kingdomSimulation?.treasuryHealth).toBeLessThanOrEqual(100);
    }

    // At least one rival's treasury should have moved from its starting value.
    const finalTreasuries = state.diplomacy.neighbors.map(
      (n) => n.kingdomSimulation?.treasuryHealth ?? 0,
    );
    const moved = initialTreasuries.some((t, i) => Math.abs(t - finalTreasuries[i]) >= 1);
    expect(moved).toBe(true);
  });

  it('paralyzes aggressive rivals in crisis: WarDeclaration pressure is dramatically reduced', () => {
    const healthy = {
      ...createInitialRivalState('seed_h', NeighborDisposition.Aggressive),
      expansionistPressure: 90,
      isInCrisis: false,
      crisisType: null,
    };
    const crisis = {
      ...healthy,
      isInCrisis: true,
      crisisType: RivalCrisisType.Famine,
      foodSecurity: 15,
    };
    const stubNeighbor = {
      id: 'n',
      relationshipScore: 20,
      attitudePosture: 'Hostile' as never,
      activeAgreements: [],
      pendingProposals: [],
      outstandingTensions: [],
      disposition: NeighborDisposition.Aggressive,
      militaryStrength: 70,
      religiousProfile: 'orthodox',
      culturalIdentity: 'highland',
      espionageCapability: 40,
      lastActionTurn: 0,
      warWeariness: 0,
      isAtWarWithPlayer: false,
      recentActionHistory: [],
    };

    const healthyScores = computeRivalActionPressure(healthy, stubNeighbor);
    const crisisScores = computeRivalActionPressure(crisis, stubNeighbor);

    expect(healthyScores[NeighborActionType.WarDeclaration]).toBeGreaterThan(
      crisisScores[NeighborActionType.WarDeclaration],
    );
    expect(crisisScores[NeighborActionType.WarDeclaration]).toBeLessThanOrEqual(0.25);
  });
});
