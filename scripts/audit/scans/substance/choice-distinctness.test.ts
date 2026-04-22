import { describe, expect, it } from 'vitest';

import type { MechanicalEffectDelta } from '../../../../src/engine/types';
import type { AuditDecisionPath } from '../../ir';
import { emptyStructuralMarkerSummary } from '../../ir';
import type { Corpus } from '../../types';
import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './choice-distinctness';

const OPTS = { includeMinor: true, includePolish: true };

function makePath(cardId: string, choiceId: string, followUps: string[] = []): AuditDecisionPath {
  return {
    cardId,
    family: 'petition',
    choiceId,
    label: choiceId,
    effectSourceKind: 'event-effects',
    textSourceKind: 'event-text',
    declaredEffects: null,
    declaredStructuralMarkers: emptyStructuralMarkerSummary(),
    pressureKey: null,
    consequenceTagsProduced: [],
    consequenceTagsConsumed: [],
    followUps,
    runtimeTouchHints: [],
    contextRequirements: [],
    previewText: null,
    runtimeFingerprint: null,
    runtimeFingerprintVariants: null,
  };
}

function registerEffects(
  corpus: Corpus,
  eventId: string,
  byChoice: Record<string, MechanicalEffectDelta>,
): void {
  corpus.effects.events[eventId] = byChoice;
}

describe(SCAN_ID, () => {
  it('flags a 3-choice card whose branches only sign-flip treasury', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_treasury_signflip';
    registerEffects(corpus, cardId, {
      enforce: { treasuryDelta: 10 },
      relent: { treasuryDelta: -5 },
      defer: { treasuryDelta: -2 },
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'A treasury question.',
        choices: [
          makePath(cardId, 'enforce'),
          makePath(cardId, 'relent'),
          makePath(cardId, 'defer'),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICES_NOT_DISTINCT');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('DETERMINISTIC');
  });

  it('does not flag when choices differ on follow-up AND style axis (2 axes)', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_varied_followups';
    registerEffects(corpus, cardId, {
      a: { treasuryDelta: 10 },
      b: { treasuryDelta: -5 },
      c: { treasuryDelta: -2 },
    });
    corpus.styleTags[cardId] = {
      a: { Authority: 2 },
      b: { Mercy: 1 },
      c: { Caution: 1 },
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'Differentiated on follow-up and style axis.',
        choices: [
          makePath(cardId, 'a', ['fu_storm']),
          makePath(cardId, 'b', ['fu_reconcile']),
          makePath(cardId, 'c', ['fu_defer']),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags when choices differ only on follow-up (1 axis)', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_followup_only';
    registerEffects(corpus, cardId, {
      a: { treasuryDelta: 10 },
      b: { treasuryDelta: -5 },
      c: { treasuryDelta: -2 },
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'Only the follow-up varies — same category, same scope, no style axes.',
        choices: [
          makePath(cardId, 'a', ['fu_storm']),
          makePath(cardId, 'b', ['fu_reconcile']),
          makePath(cardId, 'c', ['fu_defer']),
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('CHOICES_NOT_DISTINCT');
  });

  it('does not flag when choices touch different scope segments', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_varied_scope';
    registerEffects(corpus, cardId, {
      kingdom: { treasuryDelta: 10 },
      region: { regionDevelopmentDelta: -2 },
      classy: { merchantSatDelta: 4 },
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'Three different scopes.',
        choices: [
          makePath(cardId, 'kingdom'),
          makePath(cardId, 'region'),
          makePath(cardId, 'classy'),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag when style axes AND temp-mods differ per choice (2 axes)', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_style_and_tempmod';
    registerEffects(corpus, cardId, {
      a: { treasuryDelta: 10 },
      b: { treasuryDelta: -5 },
      c: { treasuryDelta: -2 },
    });
    corpus.styleTags[cardId] = {
      a: { Authority: 2 },
      b: { Mercy: 1 },
      c: { Caution: 1 },
    };
    corpus.tempModifiers[cardId] = {
      a: { durationTurns: 3, effectPerTurn: { commonerSatDelta: -1 } },
      b: { durationTurns: 3, effectPerTurn: { merchantSatDelta: -1 } },
      // c has no temp-mod
    };
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'Style axes and temp-mods differ.',
        choices: [
          makePath(cardId, 'a'),
          makePath(cardId, 'b'),
          makePath(cardId, 'c'),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips 2-choice cards', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'evt_binary';
    registerEffects(corpus, cardId, {
      yes: { treasuryDelta: 10 },
      no: { treasuryDelta: -10 },
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'petition',
        body: 'Binary.',
        choices: [makePath(cardId, 'yes'), makePath(cardId, 'no')],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips families outside monthly pipeline', () => {
    const corpus = buildEmptyCorpus();
    const cardId = 'neg_terms';
    registerEffects(corpus, cardId, {
      a: { treasuryDelta: 10 },
      b: { treasuryDelta: -5 },
      c: { treasuryDelta: -2 },
    });
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: cardId,
        family: 'negotiation',
        body: 'Negotiation terms.',
        choices: [
          makePath(cardId, 'a'),
          makePath(cardId, 'b'),
          makePath(cardId, 'c'),
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
