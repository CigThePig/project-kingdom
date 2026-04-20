// Phase 6 — choice-clones runtime-grounded branch. Two choices that share a
// table signature but produce different runtime diffs should NOT be flagged
// as clones; an ENGINE_MISMATCH POLISH note is emitted instead.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../../src/engine/types';
import type { EventDefinition } from '../../../../../src/engine/events/event-engine';
import { buildEmptyCorpus, buildDecisionPath } from '../../__test_helpers';
import { emptyCoverageFlags } from '../../../ir';
import { scan } from '../choice-clones';

const OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_cc',
    severity: EventSeverity.Notable,
    category: EventCategory.Economy,
    triggerConditions: [],
    weight: 1,
    chainId: null,
    chainStep: null,
    chainNextDefinitionId: null,
    choices: [],
    affectsClass: null,
    affectsRegion: false,
    relatedStorylineId: null,
    followUpEvents: [],
    ...overrides,
  } as EventDefinition;
}

describe('substance.choice-clones (runtime-grounded branch)', () => {
  it('suppresses MAJOR and emits POLISH ENGINE_MISMATCH when table collides but runtime diverges', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_table_collide',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    // Identical table signature (same nonzero field set, same styleTag shape, etc).
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: 5 },
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
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c2',
          touches: ['treasury.balance', 'persistentConsequences.length'],
          classes: ['surface', 'structural'],
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICE_CLONES_TABLE_ONLY');
    expect(findings[0].severity).toBe('POLISH');
    expect(findings[0].confidence).toBe('ENGINE_MISMATCH');
  });

  it('fires MAJOR with RUNTIME_GROUNDED when both table and runtime signatures match', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_full_clone',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: 5 },
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
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c2',
          touches: ['treasury.balance'],
          classes: ['surface'],
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICE_CLONES');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });

  it('falls back to HEURISTIC when no fingerprints are attached', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_no_fp',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: 5 },
    };

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICE_CLONES');
    expect(findings[0].confidence).toBe('HEURISTIC');
  });
});
