// Phase 6 — surface-only runtime-grounded branch. When the IR carries a
// runtimeFingerprint for a choice, the scan ignores the 5-marker table
// heuristic and trusts the real runtime diff: a fingerprint with any
// structural/temporal/… touch class passes; a surface-only fingerprint
// fails with RUNTIME_GROUNDED confidence.

import { describe, expect, it } from 'vitest';

import { EventCategory, EventSeverity } from '../../../../../src/engine/types';
import type { EventDefinition } from '../../../../../src/engine/events/event-engine';
import { buildEmptyCorpus, buildDecisionPath } from '../../__test_helpers';
import { emptyCoverageFlags } from '../../../ir';
import { scan } from '../surface-only';

const OPTS = { includeMinor: true, includePolish: true };

function eventShell(overrides: Partial<EventDefinition>): EventDefinition {
  return {
    id: 'evt_rt',
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

describe('substance.surface-only (runtime-grounded branch)', () => {
  it('flags SURFACE_ONLY with RUNTIME_GROUNDED when fingerprint classes are only surface', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_rt_surface',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: -5 },
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
    expect(findings).toHaveLength(2);
    for (const f of findings) {
      expect(f.confidence).toBe('RUNTIME_GROUNDED');
      expect(f.code).toBe('SURFACE_ONLY');
      expect(f.severity).toBe('MAJOR');
    }
  });

  it('passes when a fingerprint includes a structural touch class', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_rt_structural',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: -5 },
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
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c2',
          touches: ['treasury.balance', 'narrativePressure.authority'],
          classes: ['surface', 'narrative'],
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('falls back to HEURISTIC table heuristic when no fingerprint is attached', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_rt_fallback',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'crisis');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: -5 },
    };
    // No auditCards entry → no fingerprint → fallback path.

    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(2);
    for (const f of findings) {
      expect(f.confidence).toBe('HEURISTIC');
      expect(f.code).toBe('SURFACE_ONLY');
    }
  });

  it('skips a choice whose fingerprint is a no-op (delegated to no-op-apply scan)', () => {
    const corpus = buildEmptyCorpus();
    const ev = eventShell({
      id: 'evt_rt_noop',
      choices: [
        { choiceId: 'c1', slotCost: 1, isFree: false },
        { choiceId: 'c2', slotCost: 1, isFree: false },
      ],
    });
    corpus.eventById.set(ev.id, ev);
    corpus.familyByCardId.set(ev.id, 'assessment');
    corpus.effects.events[ev.id] = {
      c1: { treasuryDelta: 5 },
      c2: { treasuryDelta: -5 },
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
          touches: [],
          classes: [],
          noOp: true,
        }),
        buildDecisionPath({
          cardId: ev.id,
          family: 'assessment',
          choiceId: 'c2',
          touches: [],
          classes: [],
          noOp: true,
        }),
      ],
      coverage: { ...emptyCoverageFlags(), runtimeDiffCoverage: true },
    });

    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
