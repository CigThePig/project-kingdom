import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './pattern-classifier';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a single-choice non-acknowledgement petition as Pattern C in monthly slot', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_flavor_filler',
        family: 'petition',
        body: 'The merchants of the capital set up colourful stalls for the midsummer fair.',
        choices: [
          {
            cardId: 'evt_flavor_filler',
            family: 'petition',
            choiceId: 'accept',
            label: 'Walk the fairgrounds',
            effectSourceKind: 'event-effects',
            textSourceKind: 'event-text',
            declaredEffects: null,
            declaredStructuralMarkers: {
              touchesPersistentConsequences: false,
              queuesTemporaryModifier: false,
              appliesMechanicalDelta: false,
              readsChoice: false,
              writesPressure: false,
              touchesBond: false,
              choiceUsageKind: 'none',
              earlyReturnOnMissingId: false,
              silentFallbackOnChoiceKind: false,
              queuedModifiers: [],
            },
            pressureKey: null,
            consequenceTagsProduced: [],
            consequenceTagsConsumed: [],
            followUps: [],
            runtimeTouchHints: [],
            contextRequirements: [],
            previewText: null,
            runtimeFingerprint: null,
            runtimeFingerprintVariants: null,
          },
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('PATTERN_C_IN_MONTHLY_SLOT');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('DETERMINISTIC');
  });

  it('flags a single-choice acknowledgement card as a Pattern B candidate (POLISH)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_report_read',
        family: 'crisis',
        body: 'The intelligencers report the mole is dead. So be it — take note and move on.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('PATTERN_B_CANDIDATE_UNFLAGGED');
    expect(findings[0].severity).toBe('POLISH');
    expect(findings[0].confidence).toBe('HEURISTIC');
  });

  it('does not flag a card already classified as notification', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_real_notification',
        family: 'notification',
        body: 'A courier rides in with news from the north — acknowledge the dispatch.',
        metadata: { classification: 'notification' },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag multi-choice cards', () => {
    const corpus = buildEmptyCorpus();
    const path = (choiceId: string) => ({
      cardId: 'evt_real_decision',
      family: 'crisis' as const,
      choiceId,
      label: choiceId,
      effectSourceKind: 'event-effects' as const,
      textSourceKind: 'event-text' as const,
      declaredEffects: null,
      declaredStructuralMarkers: {
        touchesPersistentConsequences: false,
        queuesTemporaryModifier: false,
        appliesMechanicalDelta: false,
        readsChoice: false,
        writesPressure: false,
        touchesBond: false,
        choiceUsageKind: 'none' as const,
        earlyReturnOnMissingId: false,
        silentFallbackOnChoiceKind: false,
        queuedModifiers: [],
      },
      pressureKey: null,
      consequenceTagsProduced: [],
      consequenceTagsConsumed: [],
      followUps: [],
      runtimeTouchHints: [],
      contextRequirements: [],
      previewText: null,
      runtimeFingerprint: null,
      runtimeFingerprintVariants: null,
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_real_decision',
        family: 'crisis',
        body: 'A real decision awaits.',
        choices: [path('a'), path('b')],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips families outside the monthly pipeline', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'asm_observer',
        family: 'assessment',
        body: 'An intelligence report arrives.',
      }),
      buildGenericAuditCard({
        id: 'hnd_flavor',
        family: 'hand',
        body: 'Some hand card flavour.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
