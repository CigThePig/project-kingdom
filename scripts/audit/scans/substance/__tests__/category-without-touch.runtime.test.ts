// Phase 6 — category-without-touch runtime-grounded branch. A runtime diff
// that touches one of the category's expected GameState prefixes counts as
// substantive even if the declared effect table looks bare.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../../src/engine/types';
import type { EventDefinition } from '../../../../../src/engine/events/event-engine';
import { buildEmptyCorpus, buildDecisionPath } from '../../__test_helpers';
import { emptyCoverageFlags } from '../../../ir';
import { scan } from '../category-without-touch';

const OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_cat',
    severity: EventSeverity.Notable,
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

describe('substance.category-without-touch (runtime-grounded branch)', () => {
  it('passes an Economy card when runtime fingerprint touches treasury.*', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_eco_runtime', category: EventCategory.Economy });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      // Declared effects do NOT touch treasury/merchants — only stability.
      c1: { stabilityDelta: 1 },
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

    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags with RUNTIME_GROUNDED when neither declared effects nor runtime touches the category', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_religion_empty', category: EventCategory.Religion });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
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
    expect(findings[0].code).toBe('CATEGORY_WITHOUT_TOUCH');
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });

  it('flags with HEURISTIC confidence when no fingerprint is present', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({ id: 'evt_mil_empty', category: EventCategory.Military });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
    };

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].confidence).toBe('HEURISTIC');
  });
});
