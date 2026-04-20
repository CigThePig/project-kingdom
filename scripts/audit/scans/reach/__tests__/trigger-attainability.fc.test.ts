// Phase 6 — trigger-attainability fast-check-driven sampling. Verifies that
// the deterministic sampler actually walks a diverse-enough state space to
// find a trivially-reachable trigger, and that a plainly-unreachable
// condition still falls through to POLISH TRIGGER_UNREACHABLE.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../../src/engine/types';
import type { EventDefinition } from '../../../../../src/engine/events/event-engine';
import { buildEmptyCorpus } from '../../__test_helpers';
import { scan } from '../trigger-attainability';

const OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_reach',
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

describe('reach.trigger-attainability (fast-check sampler)', () => {
  it('emits no finding for a trivially-reachable threshold trigger', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_reachable',
      triggerConditions: [
        { type: 'treasury_above', threshold: 100 },
      ],
    } as Partial<EventDefinition>);
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');

    const findings = scan(corpus, OPTS);
    expect(findings.filter((f) => f.cardId === 'evt_reachable')).toEqual([]);
  });

  it('emits POLISH TRIGGER_UNREACHABLE for an impossible combination', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_impossible',
      triggerConditions: [
        { type: 'treasury_above', threshold: 5000 },  // our arbitrary tops out at 1500
      ],
    } as Partial<EventDefinition>);
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');

    const findings = scan(corpus, OPTS).filter((f) => f.cardId === 'evt_impossible');
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('TRIGGER_UNREACHABLE');
    expect(findings[0].severity).toBe('POLISH');
    expect(findings[0].confidence).toBe('HEURISTIC');
  });

  it('is deterministic across repeated runs (same seed → same findings)', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_deterministic',
      triggerConditions: [
        { type: 'treasury_above', threshold: 5000 },
      ],
    } as Partial<EventDefinition>);
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');

    const runA = scan(corpus, OPTS);
    const runB = scan(corpus, OPTS);
    expect(runA.length).toBe(runB.length);
    expect(runA.map((f) => f.code).sort()).toEqual(runB.map((f) => f.code).sort());
  });
});
