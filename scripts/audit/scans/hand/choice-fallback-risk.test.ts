import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './choice-fallback-risk';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags silent fallback on choice.kind as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_court_favor_test',
        requiresChoice: 'class',
        markers: {
          silentFallbackOnChoiceKind: true,
          appliesMechanicalDelta: true,
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].details?.kind).toBe('silent-fallback-on-choice-kind');
  });

  it('flags neighbors-fallback as MINOR when no mechanical delta runs', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_spymasters_test',
        requiresChoice: 'rival',
        markers: {
          earlyReturnOnMissingId: true,
          appliesMechanicalDelta: false,
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].details?.kind).toBe('neighbors-fallback');
  });

  it('does not flag cards that apply a mechanical delta before the guard', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_sanctioned_raid_test',
        requiresChoice: 'rival',
        markers: {
          earlyReturnOnMissingId: true,
          appliesMechanicalDelta: true,
        },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag cards without requiresChoice', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_plain',
        markers: { silentFallbackOnChoiceKind: true },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips cards without AST semantic coverage', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_no_ast',
        requiresChoice: 'class',
        coverage: { astSemanticCoverage: false },
        markers: { silentFallbackOnChoiceKind: true },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
