import { describe, expect, it } from 'vitest';

import { RivalAgenda } from '../../../../../src/engine/types';
import {
  buildDecisionPath,
  buildEmptyCorpus,
  buildGenericAuditCard,
} from '../../__test_helpers';
import { scan, SCAN_ID } from '../effect-hint-parity';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('does not flag well-formed overtures from the real pool', () => {
    // DynasticAlliance grants relationship-up (hint ↑↑, grant choiceId => up).
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:DynasticAlliance',
        family: 'overture',
        sourceKind: 'generated',
        runtimePath: 'generated-overture',
        metadata: { agenda: RivalAgenda.DynasticAlliance },
        choices: [
          buildDecisionPath({
            cardId: 'overture:DynasticAlliance',
            family: 'overture',
            choiceId: 'grant',
            touches: ['diplomacy.neighbors[0].relationshipScore'],
            classes: ['diplomatic'],
          }),
          buildDecisionPath({
            cardId: 'overture:DynasticAlliance',
            family: 'overture',
            choiceId: 'deny',
            touches: ['diplomacy.neighbors[0].relationshipScore'],
            classes: ['diplomatic'],
          }),
        ],
      }),
    );
    // Note: the hint says ↑↑ for grant and ↓ for deny — the scan treats
    // grant as 'up' and deny as 'down' via choiceId semantics, so both paths
    // match their hint direction and the scan is silent.
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('returns no findings for an unknown agenda without a spec', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:BleedTheRivals',
        family: 'overture',
        sourceKind: 'generated',
        runtimePath: 'generated-overture',
        metadata: { agenda: RivalAgenda.BleedTheRivals },
        choices: [
          buildDecisionPath({
            cardId: 'overture:BleedTheRivals',
            family: 'overture',
            choiceId: 'grant',
            touches: ['diplomacy.neighbors[0].relationshipScore'],
            classes: ['diplomatic'],
          }),
        ],
      }),
    );
    // BleedTheRivals has no INLINE_EFFECTS entry → buildInlineSpec returns
    // null → scan emits nothing for this card.
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
