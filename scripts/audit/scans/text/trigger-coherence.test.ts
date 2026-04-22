import { describe, expect, it } from 'vitest';

import type { EventTriggerCondition } from '../../../../src/engine/events/event-engine';
import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './trigger-coherence';

const OPTS = { includeMinor: true, includePolish: true };

function withTriggers(
  id: string,
  body: string,
  triggerConditions: EventTriggerCondition[],
  family: 'crisis' | 'petition' | 'notification' = 'crisis',
) {
  return buildGenericAuditCard({
    id,
    family,
    body,
    metadata: { triggerConditions },
  });
}

describe(SCAN_ID, () => {
  it('flags a body that mentions drought with no food trigger', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_drought_ungated',
        'With the kingdom in the grip of a drought, the reeve petitions the crown.',
        [{ type: 'random_chance', probability: 0.3 }],
      ),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('TRIGGER_BODY_STATE_UNGATED');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('HEURISTIC');
    expect(findings[0].details?.stateWord).toBe('drought');
  });

  it('does not flag when a drought body has a food_below trigger', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_drought_gated',
        'With the kingdom in the grip of a drought, the reeve petitions the crown.',
        [{ type: 'food_below', threshold: 30 }],
      ),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('resolves triggers nested inside any_of', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_drought_any_of',
        'A drought has set in over the outer provinces.',
        [
          {
            type: 'any_of',
            conditions: [
              { type: 'random_chance', probability: 0.2 },
              { type: 'food_below', threshold: 40 },
            ],
          },
        ],
      ),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags empty-treasury framing without a treasury_below trigger', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_empty_coffers',
        'The coffers are empty and the chancellor has no easy answer.',
        [{ type: 'class_satisfaction_below', threshold: 50 }],
      ),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].details?.stateWord).toBe('empty treasury');
  });

  it('does not flag bodies that use no state keyword', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_neutral',
        'The merchants propose a new trade compact with the southern ports.',
        [{ type: 'random_chance', probability: 0.2 }],
      ),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('emits one finding per distinct state word when multiple are ungated', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      withTriggers(
        'evt_many_states',
        'A drought grips the march; the treasury is empty; heresy spreads in the hills.',
        [{ type: 'random_chance', probability: 0.2 }],
      ),
    );
    const findings = scan(corpus, OPTS);
    const keywords = findings.map((f) => f.details?.stateWord).sort();
    expect(keywords).toEqual(['drought', 'empty treasury', 'heterodox']);
  });

  it('skips cards without a triggerConditions metadata entry', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_no_triggers',
        family: 'crisis',
        body: 'A drought is spreading.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
