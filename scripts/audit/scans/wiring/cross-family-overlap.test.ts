// Unit test for the §Phase-7 cross-family overlap guard. Builds synthetic
// AuditCard fixtures rather than touching the live corpus, so the scan's
// canonical-family rules are exercised directly without dragging the rest
// of the audit pipeline along.

import { describe, expect, it } from 'vitest';

import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './cross-family-overlap';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags a festival-themed overture (overture is non-canonical for festival)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'overture:SyntheticHarvestFestival',
        family: 'overture',
        title: 'A grand harvest festival',
        body: 'A synthetic overture proposing a grand festival across the realm.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0]).toMatchObject({
      severity: 'MINOR',
      scanId: SCAN_ID,
      code: 'CROSS_FAMILY_OVERLAP',
      cardId: 'overture:SyntheticHarvestFestival',
      family: 'overture',
      confidence: 'HEURISTIC',
    });
    expect(findings[0].details).toMatchObject({ zone: 'festival' });
  });

  it('flags a tax-themed crisis when forced into a non-canonical family', () => {
    // Synthetic: a tax-relief card authored as a negotiation. Tax canonical
    // is petition / decree / crisis / overture — negotiation is not.
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_synth_tax_relief',
        family: 'negotiation',
        title: 'Tax relief talks',
        body: 'The exchequer summons the great houses to renegotiate the levy.',
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings.length).toBe(1);
    expect(findings[0]).toMatchObject({
      code: 'CROSS_FAMILY_OVERLAP',
      cardId: 'neg_synth_tax_relief',
      family: 'negotiation',
    });
    expect(findings[0].details).toMatchObject({ zone: 'tax' });
  });

  it('does not flag a card in a canonical family for its zone', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_synth_tax_petition',
        family: 'petition',
        title: 'Commoners ask for tax relief',
        body: 'A delegation arrives asking the crown to suspend the harvest tithe.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag cards in non-decision-slot families even when the zone matches', () => {
    // Notifications, hand cards, world events, assessments, and `unknown`
    // are explicitly excluded — they don't compete for monthly decision
    // slots, so flagging them is noise.
    const corpus = buildEmptyCorpus();
    for (const family of ['notification', 'hand', 'world', 'assessment', 'unknown'] as const) {
      corpus.auditCards.push(
        buildGenericAuditCard({
          id: `synth_tax_${family}`,
          family,
          body: 'A reference to taxes and the exchequer.',
        }),
      );
    }
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag cards whose body never mentions a zone keyword', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_generic_petition',
        family: 'petition',
        body: 'A delegation arrives with concerns about the weather.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('honours the per-zone allowlist', () => {
    // evt_cultural_festival_proposal is recorded in the reconciliation
    // doc as KEEP despite living in the Culture event family. The
    // allowlist suppresses the finding even if its family ever drifts
    // into a non-canonical decision slot.
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'evt_cultural_festival_proposal',
        family: 'overture', // synthetic re-classification to verify suppression
        title: 'A cultural festival proposal',
        body: 'Clergy approach the throne suggesting a grand festival to honour the patrons.',
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('emits one finding per matched zone for a card spanning multiple non-canonical zones', () => {
    // Synthetic card hitting two zones (border + plague) in a family
    // that is canonical for neither — petition is not in border's
    // canonical… wait, petition IS canonical for border (border captains).
    // Use negotiation instead: not canonical for border, not canonical
    // for plague.
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'neg_synth_border_plague',
        family: 'negotiation',
        title: 'Border plague talks',
        body: 'A frontier outbreak forces the crown into negotiations with refugees of the plague.',
      }),
    );
    const findings = scan(corpus, OPTS);
    const zones = findings.map((f) => f.details?.zone).sort();
    expect(zones).toEqual(['border', 'plague']);
  });
});
