// Unit test for §13.4 surface-only scan. Uses synthetic mini-corpora so the
// assertions don't depend on the real card content shifting beneath us.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../src/engine/types';
import type { EventDefinition } from '../../../../src/engine/events/event-engine';
import { buildEmptyCorpus } from '../__test_helpers';
import { scan, SCAN_ID } from './surface-only';

const FULL_OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_test',
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

describe('substance.surface-only', () => {
  it('flags a 2-choice event whose choices only nudge sliders', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_a',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5, stabilityDelta: -1 },
      c2: { treasuryDelta: -3, faithDelta: 1 },
    };

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.length).toBe(2);
    expect(new Set(findings.map((f) => f.choiceId))).toEqual(new Set(['c1', 'c2']));
    expect(findings.every((f) => f.severity === 'MAJOR')).toBe(true);
    expect(findings.every((f) => f.scanId === SCAN_ID)).toBe(true);
  });

  it('does NOT flag a choice that schedules a follow-up event (Marker 4)', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_b',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
      followUpEvents: [
        { triggerChoiceId: 'c1', followUpDefinitionId: 'evt_b_fu', delayTurns: 2, probability: 1 },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 1 },
      c2: { treasuryDelta: -1 },
    };

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.map((f) => f.choiceId)).toEqual(['c2']); // c1 is structural via follow-up
  });

  it('does NOT flag a choice with a non-empty style tag block (Marker 3)', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_c',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 1 },
      c2: { treasuryDelta: -1 },
    };
    corpus.styleTags[ev.id] = { c1: { merciful: 5 } };

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.map((f) => f.choiceId)).toEqual(['c2']);
  });

  it('honors the §14 regionConditionDelta gotcha when affectsRegion=true', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_region',
      affectsRegion: true,
      choices: [
        { choiceId: 'c_region_persist', slotCost: 1, isFree: false },
        { choiceId: 'c_just_treasury', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c_region_persist: { treasuryDelta: 5, regionConditionDelta: -1 },
      c_just_treasury: { treasuryDelta: 5 },
    };

    const findings = scan(corpus, FULL_OPTS);
    // c_region_persist is structural because regionConditionDelta persists in
    // region state when affectsRegion=true. c_just_treasury is surface-only.
    expect(findings.map((f) => f.choiceId)).toEqual(['c_just_treasury']);
  });

  it('flags regionConditionDelta as surface when affectsRegion=false (the negative side of the gotcha)', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_no_region',
      affectsRegion: false,
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5, regionConditionDelta: -1 },
      c2: { treasuryDelta: -1 },
    };

    const findings = scan(corpus, FULL_OPTS);
    expect(findings.length).toBe(2); // both surface-only
  });

  it('skips notification cards entirely', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_notif',
      classification: 'notification',
      choices: [
        { choiceId: 'c1', slotCost: 0, isFree: true },
        { choiceId: 'c2', slotCost: 0, isFree: true },
      ],
    } as Partial<EventDefinition>);
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'notification');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 1 },
      c2: { treasuryDelta: -1 },
    };
    expect(scan(corpus, FULL_OPTS)).toEqual([]);
  });

  it('skips Pattern C single-choice cards entirely', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_single',
      choices: [{ choiceId: 'acknowledge', slotCost: 0, isFree: true }],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = { acknowledge: { treasuryDelta: 1 } };
    expect(scan(corpus, FULL_OPTS)).toEqual([]);
  });
});
