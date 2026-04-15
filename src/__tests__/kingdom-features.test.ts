import { describe, it, expect } from 'vitest';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { resolveTurn } from '../engine/resolution/turn-resolution';
import { createDefaultScenario } from '../data/scenarios/default';
import { ActionType } from '../engine/types';
import { KINGDOM_FEATURE_REGISTRY } from '../data/kingdom-features/index';

describe('kingdom features', () => {
  it('creates a KingdomFeature when a decree with a registry entry is enacted', () => {
    const state = createDefaultScenario();

    const decreeAction = {
      id: 'test-uuid-kf-1',
      type: ActionType.Decree,
      actionDefinitionId: 'decree_fortify_borders',
      slotCost: 1,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    };

    const result = applyActionEffects(state, [decreeAction]);

    expect(result.activeKingdomFeatures).toHaveLength(1);

    const feature = result.activeKingdomFeatures[0];
    expect(feature.sourceTag).toBe('decree:decree_fortify_borders');
    expect(feature.category).toBe('military');
    expect(feature.ongoingEffect).toEqual({ militaryReadinessDelta: 1 });
    expect(feature.turnEstablished).toBe(state.turn.turnNumber);
    expect(feature.id).toContain('kf-feature_fortified_borders');
  });

  it('does not create a KingdomFeature for a decree without a registry entry', () => {
    const state = createDefaultScenario();

    const decreeAction = {
      id: 'test-uuid-kf-2',
      type: ActionType.Decree,
      actionDefinitionId: 'decree_census',
      slotCost: 1,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    };

    const result = applyActionEffects(state, [decreeAction]);

    expect(result.activeKingdomFeatures).toHaveLength(0);
  });

  it('applies ongoing effects from kingdom features during turn resolution', () => {
    const baseState = createDefaultScenario();

    // Manually add a kingdom feature with a known ongoing effect
    const stateWithFeature = {
      ...baseState,
      activeKingdomFeatures: [
        {
          id: 'kf-test-feature-t1',
          sourceTag: 'decree:decree_fortify_borders',
          turnEstablished: 1,
          ongoingEffect: { militaryReadinessDelta: 1 },
          category: 'military' as const,
        },
      ],
    };

    const resultWithFeature = resolveTurn(stateWithFeature, applyActionEffects, []);
    const resultWithout = resolveTurn(baseState, applyActionEffects, []);

    // The state with a kingdom feature should have higher military readiness
    expect(resultWithFeature.nextState.military.readiness).toBeGreaterThan(
      resultWithout.nextState.military.readiness,
    );

    // The feature should persist (not be removed after the turn)
    expect(resultWithFeature.nextState.activeKingdomFeatures).toHaveLength(1);
  });

  it('accumulates features from multiple decrees', () => {
    const state = createDefaultScenario();

    const actions = [
      {
        id: 'test-uuid-kf-3',
        type: ActionType.Decree,
        actionDefinitionId: 'decree_fortify_borders',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
      {
        id: 'test-uuid-kf-4',
        type: ActionType.Decree,
        actionDefinitionId: 'decree_market_charter',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
    ];

    const result = applyActionEffects(state, actions);

    expect(result.activeKingdomFeatures).toHaveLength(2);

    const tags = result.activeKingdomFeatures.map((f) => f.sourceTag);
    expect(tags).toContain('decree:decree_fortify_borders');
    expect(tags).toContain('decree:decree_market_charter');
  });

  it('has valid entries in KINGDOM_FEATURE_REGISTRY with required fields', () => {
    for (const [tag, def] of Object.entries(KINGDOM_FEATURE_REGISTRY)) {
      expect(tag).toBeTruthy();
      expect(def.featureId).toBeTruthy();
      expect(def.title).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(['infrastructure', 'military', 'diplomatic', 'cultural', 'economic']).toContain(
        def.category,
      );
      expect(def.ongoingEffect).toBeDefined();
      // At least one delta should be non-zero
      const deltas = Object.values(def.ongoingEffect);
      expect(deltas.some((d) => d !== 0)).toBe(true);
    }
  });
});
