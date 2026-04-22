import { describe, expect, it } from 'vitest';

import type { AuditDecisionPath } from '../../ir';
import { emptyStructuralMarkerSummary } from '../../ir';
import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './cost-asymmetry';

const OPTS = { includeMinor: true, includePolish: true };

function makePath(cardId: string, choiceId: string, slotCost: number | null): AuditDecisionPath {
  return {
    cardId,
    family: 'petition',
    choiceId,
    label: choiceId,
    effectSourceKind: 'event-effects',
    textSourceKind: 'event-text',
    declaredEffects: slotCost == null ? null : { _slotCost: slotCost, _isFree: slotCost === 0 },
    declaredStructuralMarkers: emptyStructuralMarkerSummary(),
    pressureKey: null,
    consequenceTagsProduced: [],
    consequenceTagsConsumed: [],
    followUps: [],
    runtimeTouchHints: [],
    contextRequirements: [],
    previewText: null,
    runtimeFingerprint: null,
    runtimeFingerprintVariants: null,
  };
}

describe(SCAN_ID, () => {
  it('flags a card whose three choices all have slotCost=1', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_uniform_cost',
        family: 'petition',
        body: 'Three choices, all slotCost=1.',
        choices: [
          makePath('evt_uniform_cost', 'a', 1),
          makePath('evt_uniform_cost', 'b', 1),
          makePath('evt_uniform_cost', 'c', 1),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICES_UNIFORM_SLOT_COST');
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].confidence).toBe('DETERMINISTIC');
    expect(findings[0].details?.slotCost).toBe(1);
  });

  it('does not flag when costs differ', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_mixed_costs',
        family: 'petition',
        body: 'Mixed costs.',
        choices: [
          makePath('evt_mixed_costs', 'a', 1),
          makePath('evt_mixed_costs', 'b', 1),
          makePath('evt_mixed_costs', 'c', 0),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips cards whose adapter did not expose _slotCost', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_no_cost_data',
        family: 'petition',
        body: 'No slotCost threaded.',
        choices: [
          makePath('evt_no_cost_data', 'a', null),
          makePath('evt_no_cost_data', 'b', null),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips single-choice cards', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_single',
        family: 'notification',
        body: 'A single-choice notification.',
        choices: [makePath('evt_single', 'ack', 0)],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips decrees (single enactment path)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'dec_example',
        family: 'decree',
        body: 'A decree.',
        choices: [
          makePath('dec_example', 'enact', 1),
          makePath('dec_example', 'other', 1),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
