import { describe, expect, it } from 'vitest';

import {
  buildDecisionPath,
  buildEmptyCorpus,
  buildGenericAuditCard,
} from '../../__test_helpers';
import { scan, SCAN_ID } from '../grant-deny-runtime-parity';

const OPTS = { includeMinor: true, includePolish: true };

function buildOvertureCard(
  id: string,
  grantTouches: string[],
  denyTouches: string[],
) {
  return buildGenericAuditCard({
    id,
    family: 'overture',
    sourceKind: 'generated',
    runtimePath: 'generated-overture',
    choices: [
      buildDecisionPath({
        cardId: id,
        family: 'overture',
        choiceId: 'grant',
        touches: grantTouches,
        classes: grantTouches.length ? ['diplomatic'] : [],
      }),
      buildDecisionPath({
        cardId: id,
        family: 'overture',
        choiceId: 'deny',
        touches: denyTouches,
        classes: denyTouches.length ? ['diplomatic'] : [],
      }),
    ],
  });
}

describe(SCAN_ID, () => {
  it('flags a grant path that produces no state diff', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(buildOvertureCard('overture:NoopGrant', [], ['diplomacy.neighbors[0].relationshipScore']));
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'OVERTURE_GRANT_NO_OP')).toBe(true);
  });

  it('flags a deny path that produces no state diff', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(buildOvertureCard('overture:NoopDeny', ['diplomacy.neighbors[0].relationshipScore'], []));
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'OVERTURE_DENY_NO_OP')).toBe(true);
  });

  it('flags identical grant and deny diffs', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildOvertureCard(
        'overture:Identical',
        ['diplomacy.neighbors[0].relationshipScore'],
        ['diplomacy.neighbors[0].relationshipScore'],
      ),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.some((f) => f.code === 'OVERTURE_GRANT_DENY_IDENTICAL')).toBe(true);
  });

  it('passes when grant and deny diverge', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildOvertureCard(
        'overture:Healthy',
        ['diplomacy.neighbors[0].relationshipScore', 'diplomacy.neighbors[0].memory'],
        ['diplomacy.neighbors[0].relationshipScore'],
      ),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
