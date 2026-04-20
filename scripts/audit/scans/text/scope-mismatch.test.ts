import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './scope-mismatch';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags "every class" claim backed by a single class touch', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_every_class',
        body: 'A proclamation reaches every class in the realm.',
        touches: ['population.classes.Commoners.satisfaction'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('SCOPE_MISMATCH');
    expect(findings[0].details?.bodyPhrase).toBe('every-class');
  });

  it('does not flag "every class" claim when 3+ class paths change', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_every_class_delivered',
        body: 'Every class feels the change.',
        touches: [
          'population.classes.Commoners.satisfaction',
          'population.classes.Nobility.satisfaction',
          'population.classes.Merchants.satisfaction',
        ],
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags "the kingdom" claim when every touch is regional', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_kingdom_but_regional',
        body: 'The kingdom responds.',
        touches: ['regions[0].condition', 'regions[1].condition'],
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].details?.bodyPhrase).toBe('kingdom-wide');
  });

  it('flags a regional-phrase body when affectsRegion is false', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_regional_but_not_flagged',
        body: 'Unrest spreads in the outlying villages.',
        touches: ['treasury.balance'],
        affectsRegion: false,
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].details?.bodyPhrase).toBe('regional-without-flag');
  });

  it('does not flag a regional-phrase body when affectsRegion is true', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_regional_and_flagged',
        body: 'Unrest spreads in the outlying villages.',
        touches: ['regions[0].condition'],
        affectsRegion: true,
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });
});
