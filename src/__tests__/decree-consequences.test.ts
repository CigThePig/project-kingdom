import { describe, it, expect } from 'vitest';
import { applyActionEffects } from '../engine/resolution/apply-action-effects';
import { createDefaultScenario } from '../data/scenarios/default';
import { ActionType } from '../engine/types';

describe('decree persistent consequences', () => {
  it('creates a PersistentConsequence with a decree: tag when a decree is enacted', () => {
    const state = createDefaultScenario();

    const decreeAction = {
      id: 'test-uuid-1',
      type: ActionType.Decree,
      actionDefinitionId: 'decree_market_charter',
      slotCost: 1,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    };

    const result = applyActionEffects(state, [decreeAction]);

    // Each decree produces two consequences: the specific `decree:${id}` tag
    // and a generic `recent_decree_issued` tag that events can gate on.
    expect(result.persistentConsequences).toHaveLength(2);

    const consequence = result.persistentConsequences.find(
      (c) => c.tag === 'decree:decree_market_charter',
    );
    expect(consequence).toBeDefined();
    expect(consequence!.sourceId).toBe('decree_market_charter');
    expect(consequence!.sourceType).toBe('event');
    expect(consequence!.choiceMade).toBe('decree_market_charter');
    expect(consequence!.turnApplied).toBe(state.turn.turnNumber);

    expect(
      result.persistentConsequences.some((c) => c.tag === 'recent_decree_issued'),
    ).toBe(true);
  });

  it('creates both an IssuedDecree record and a PersistentConsequence', () => {
    const state = createDefaultScenario();

    const decreeAction = {
      id: 'test-uuid-2',
      type: ActionType.Decree,
      actionDefinitionId: 'decree_market_charter',
      slotCost: 1,
      isFree: false,
      targetRegionId: null,
      targetNeighborId: null,
      parameters: {},
    };

    const result = applyActionEffects(state, [decreeAction]);

    expect(result.issuedDecrees).toHaveLength(1);
    // One `decree:${id}` tag + one `recent_decree_issued` tag per decree.
    expect(result.persistentConsequences).toHaveLength(2);
  });

  it('accumulates consequences for multiple decrees in one turn', () => {
    const state = createDefaultScenario();

    const actions = [
      {
        id: 'test-uuid-3',
        type: ActionType.Decree,
        actionDefinitionId: 'decree_market_charter',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
      {
        id: 'test-uuid-4',
        type: ActionType.Decree,
        actionDefinitionId: 'decree_trade_subsidies',
        slotCost: 1,
        isFree: false,
        targetRegionId: null,
        targetNeighborId: null,
        parameters: {},
      },
    ];

    const result = applyActionEffects(state, actions);

    // Two decrees × two tags each (specific + generic recent_decree_issued).
    expect(result.persistentConsequences).toHaveLength(4);
    expect(
      result.persistentConsequences.some((c) => c.tag === 'decree:decree_market_charter'),
    ).toBe(true);
    expect(
      result.persistentConsequences.some((c) => c.tag === 'decree:decree_trade_subsidies'),
    ).toBe(true);
    expect(
      result.persistentConsequences.filter((c) => c.tag === 'recent_decree_issued'),
    ).toHaveLength(2);
  });
});
