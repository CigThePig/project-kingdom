import { describe, expect, it } from 'vitest';

import type { RuntimeFingerprint } from '../../ir';
import { buildEmptyCorpus, buildHandAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './requires-choice-used';

const OPTS = { includeMinor: true, includePolish: true };

function fp(touches: string[]): RuntimeFingerprint {
  return {
    fixtureId: 'mid-kingdom',
    touches,
    classes: [],
    structuralCount: 0,
    surfaceCount: touches.length,
    noOp: touches.length === 0,
  };
}

describe(SCAN_ID, () => {
  it('flags shallow AST usage as MAJOR / HEURISTIC', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_fake_class_choice',
        requiresChoice: 'class',
        markers: { choiceUsageKind: 'shallow' },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('HEURISTIC');
    expect(findings[0].code).toBe('REQUIRES_CHOICE_UNUSED');
  });

  it('upgrades to RUNTIME_GROUNDED when variants produce identical touches', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_runtime_ignored',
        requiresChoice: 'class',
        markers: { choiceUsageKind: 'shallow' },
        fingerprintVariants: {
          a: fp(['treasury.balance']),
          b: fp(['treasury.balance']),
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });

  it('does not flag cards where variants diverge', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_real_choice',
        requiresChoice: 'class',
        markers: { choiceUsageKind: 'deep' },
        fingerprintVariants: {
          a: fp(['population.classes.Commoners.satisfaction']),
          b: fp(['population.classes.Nobility.satisfaction']),
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
        markers: { choiceUsageKind: 'none' },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('fires on deep AST usage when runtime variants still match', () => {
    // Deep usage in AST but identical touches at runtime — a contract that
    // looks OK statically but actually produces the same diff regardless.
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildHandAuditCard({
        id: 'hand_deep_but_unused',
        requiresChoice: 'rival',
        markers: { choiceUsageKind: 'deep' },
        fingerprintVariants: {
          a: fp(['treasury.balance']),
          b: fp(['treasury.balance']),
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].confidence).toBe('RUNTIME_GROUNDED');
  });
});
