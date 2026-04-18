// Phase G — Guards D-14: every ConditionType must map to an authored event
// definition ID prefix, with known historical mismatches encoded explicitly.

import { describe, it, expect } from 'vitest';
import {
  conditionEventDefinitionId,
  conditionEventDefinitionIdForResolution,
} from '../engine/resolution/condition-event-ids';
import { ConditionSeverity, ConditionType } from '../engine/types';

describe('conditionEventDefinitionId', () => {
  it('maps CriminalUnderworld to evt_social_criminal_*', () => {
    expect(conditionEventDefinitionId(ConditionType.CriminalUnderworld, ConditionSeverity.Severe))
      .toBe('evt_social_criminal_severe');
  });

  it('maps Banditry to evt_social_banditry_*', () => {
    expect(conditionEventDefinitionId(ConditionType.Banditry, ConditionSeverity.Mild))
      .toBe('evt_social_banditry_mild');
  });

  it('maps TradeDisruption to the snake_case authored id', () => {
    expect(conditionEventDefinitionId(ConditionType.TradeDisruption, ConditionSeverity.Moderate))
      .toBe('evt_cond_trade_disruption_moderate');
  });

  it('provides a resolution-flavor id per type', () => {
    expect(conditionEventDefinitionIdForResolution(ConditionType.CriminalUnderworld))
      .toBe('evt_social_criminal_resolved');
  });

  it('covers every ConditionType without returning the raw enum', () => {
    for (const type of Object.values(ConditionType)) {
      const id = conditionEventDefinitionId(type, ConditionSeverity.Mild);
      expect(id).toMatch(/^evt_/);
      expect(id).not.toContain('undefined');
    }
  });
});
