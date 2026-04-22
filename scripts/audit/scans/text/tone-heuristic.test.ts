import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './tone-heuristic';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a crisis body that reads as a petition', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_wrong_tone',
        family: 'crisis',
        body: 'The merchants humbly beg Your Majesty for mercy and plead that the crown grant them audience.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('TONE_FAMILY_MISMATCH');
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].confidence).toBe('HEURISTIC');
    expect(findings[0].details?.actualFamily).toBe('crisis');
    expect(findings[0].details?.detectedFamily).toBe('petition');
  });

  it('does not flag a crisis body with urgent vocabulary', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_urgent_crisis',
        family: 'crisis',
        body: 'Urgent: the plague is spreading. Riots have broken out before the palace gates.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag a neutral body with no strong family tone', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_neutral',
        family: 'crisis',
        body: 'A report arrives from the eastern provinces concerning the annual grain levy.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags a petition body that reads as a decree', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_decree_voice',
        family: 'petition',
        body: 'We hereby proclaim that our will shall be carried out. Let it be so.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].details?.detectedFamily).toBe('decree');
  });

  it('skips families outside {crisis, petition, decree}', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_plea',
        family: 'negotiation',
        body: 'The envoy humbly begs your understanding on the terms offered.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips when the body is empty', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_empty',
        family: 'crisis',
        body: '',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
