import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './temp-modifier-shape';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags an empty effectPerTurn as MAJOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_empty_effects',
        queuedModifiers: [
          {
            turnsRemaining: 'literal',
            effectKeys: [],
            hasId: true,
            hasSourceTag: true,
            hasTurnApplied: true,
          },
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].code).toBe('TEMP_MODIFIER_MALFORMED');
  });

  it('flags missing id / sourceTag as MINOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_loose_modifier',
        queuedModifiers: [
          {
            turnsRemaining: 'literal',
            effectKeys: ['stabilityDelta'],
            hasId: false,
            hasSourceTag: false,
            hasTurnApplied: true,
          },
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].details?.missing).toEqual(['id', 'sourceTag']);
  });

  it('flags non-literal turnsRemaining as MINOR', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_dynamic_turns',
        queuedModifiers: [
          {
            turnsRemaining: 'dynamic',
            effectKeys: ['stabilityDelta'],
            hasId: true,
            hasSourceTag: true,
            hasTurnApplied: true,
          },
        ],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe('MINOR');
    expect(findings[0].details?.dynamicTurnsRemaining).toBe(true);
  });

  it('does not flag a fully-shaped modifier', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_good_modifier',
        queuedModifiers: [
          {
            turnsRemaining: 'literal',
            effectKeys: ['stabilityDelta'],
            hasId: true,
            hasSourceTag: true,
            hasTurnApplied: true,
          },
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('skips cards without AST semantic coverage', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_no_ast',
        coverage: { astSemanticCoverage: false },
        queuedModifiers: [
          {
            turnsRemaining: 'literal',
            effectKeys: [],
            hasId: true,
            hasSourceTag: true,
            hasTurnApplied: true,
          },
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
