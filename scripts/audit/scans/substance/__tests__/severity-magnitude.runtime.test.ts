// Phase 6 — severity-magnitude runtime-grounded branch. A Critical card
// whose numeric magnitudes clear the bar but whose runtime diffs never leave
// the surface class is still shallow — flagged CRITICAL_SHALLOW_RUNTIME with
// RUNTIME_GROUNDED confidence.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../../src/engine/types';
import type { EventDefinition } from '../../../../../src/engine/events/event-engine';
import { buildEmptyCorpus, buildDecisionPath } from '../../__test_helpers';
import { emptyCoverageFlags } from '../../../ir';
import { scan } from '../severity-magnitude';

const OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_sm',
    severity: EventSeverity.Critical,
    category: EventCategory.Economy,
    triggerConditions: [],
    weight: 1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [{ choiceId: 'c1', slotCost: 1, isFree: false }],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    followUpEvents: [],
    ...overrides,
  } as EventDefinition;
}

describe('substance.severity-magnitude (runtime-grounded branch)', () => {
  it('flags CRITICAL_SHALLOW_RUNTIME when magnitude passes but runtime is surface-only', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_critical_shallow' });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 50 },  // ≥40 clears the Critical numeric bar
    };
    corpus.auditCards.push({
      id: ev.id,
      family: 'assessment',
      sourceKind: 'authored',
      runtimePath: 'direct-effect-assessment',
      severityHint: null,
      metadata: {},
      choices: [
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c1',
          touches: ['treasury.balance'],
          classes: ['surface'],
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CRITICAL_SHALLOW_RUNTIME');
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
    expect(findings[0].severity).toBe('MAJOR');
  });

  it('does not fire CRITICAL_SHALLOW_RUNTIME when runtime touches a structural class', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_critical_deep' });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 50 },
    };
    corpus.auditCards.push({
      id: ev.id,
      family: 'assessment',
      sourceKind: 'authored',
      runtimePath: 'direct-effect-assessment',
      severityHint: null,
      metadata: {},
      choices: [
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c1',
          touches: ['treasury.balance', 'persistentConsequences.length'],
          classes: ['surface', 'structural'],
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('marks magnitude-only CRITICAL_TOO_SMALL as HEURISTIC', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_critical_small' });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },  // < 40: fails magnitude
    };

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CRITICAL_TOO_SMALL');
    expect(findings[0].confidence).toBe('HEURISTIC');
  });
});
