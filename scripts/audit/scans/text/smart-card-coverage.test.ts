import { describe, expect, it } from 'vitest';

import { PopulationClass } from '../../../../src/engine/types';
import { buildEmptyCorpus, buildGenericAuditCard } from '../__test_helpers';
import { scan, SCAN_ID } from './smart-card-coverage';

const OPTS = { includeMinor: true, includePolish: true };

describe(SCAN_ID, () => {
  it('flags affectsRegion:true card whose body has no region token', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_region_missing',
        body: 'Unrest spreads in the outlying villages.',
        affectsRegion: true,
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('SMART_CARD_COVERAGE_REGION');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].confidence).toBe('DETERMINISTIC');
  });

  it('does not flag affectsRegion:true when body contains {region}', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_region_ok',
        body: 'Unrest spreads in {region}.',
        affectsRegion: true,
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('accepts {settlement}, {terrain}, {condition_context} as region tokens', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_settlement',
        body: 'Trouble in {settlement}.',
        affectsRegion: true,
      }),
      buildGenericAuditCard({
        id: 'card_terrain',
        body: 'The {terrain} road is blocked.',
        affectsRegion: true,
      }),
      buildGenericAuditCard({
        id: 'card_condition',
        body: 'Word arrives: {condition_context}.',
        affectsRegion: true,
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag when affectsRegion is false regardless of body', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_no_region_flag',
        body: 'The villages suffer — no token here.',
        affectsRegion: false,
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags affectsClass when body neither names the class literally nor uses {class}', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_class_missing',
        body: 'A complaint lands on your desk.',
        metadata: { affectsClass: PopulationClass.Merchants },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('SMART_CARD_COVERAGE_CLASS');
  });

  it('does not flag affectsClass when body names the class literally (singular label)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_class_literal_singular',
        body: 'The Merchant Guild demands an audience.',
        metadata: { affectsClass: PopulationClass.Merchants },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag affectsClass when body names the class literally (plural label)', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_class_literal_plural',
        body: 'Merchants gather in the square.',
        metadata: { affectsClass: PopulationClass.Merchants },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('does not flag affectsClass when body uses the {class} token', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_class_token',
        body: 'The {class} are restless.',
        metadata: { affectsClass: PopulationClass.Merchants },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('flags affectsNeighbor when body has no neighbor token', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_neighbor_missing',
        body: 'Envoys arrive at court with grievances.',
        metadata: { affectsNeighbor: 'nbr_blackwood' },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('SMART_CARD_COVERAGE_NEIGHBOR');
  });

  it('does not flag affectsNeighbor when body has {neighbor} token', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_neighbor_ok',
        body: 'Envoys arrive from {neighbor}.',
        metadata: { affectsNeighbor: 'nbr_blackwood' },
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('emits one finding per failing dimension when all three scope flags are set', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_triple_miss',
        body: 'Trouble brews in the realm.',
        affectsRegion: true,
        metadata: {
          affectsClass: PopulationClass.Nobility,
          affectsNeighbor: 'nbr_blackwood',
        },
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(3);
    const codes = findings.map((f) => f.code).sort();
    expect(codes).toEqual([
      'SMART_CARD_COVERAGE_CLASS',
      'SMART_CARD_COVERAGE_NEIGHBOR',
      'SMART_CARD_COVERAGE_REGION',
    ]);
  });

  it('skips cards with empty body', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_no_body',
        body: '',
        affectsRegion: true,
      }),
    );
    expect(scan(corpus, OPTS)).toEqual([]);
  });

  it('runs without runtimeDiffCoverage — fingerprint not required', () => {
    const corpus = buildEmptyCorpus();
    corpus.auditCards.push(
      buildGenericAuditCard({
        id: 'card_no_runtime',
        body: 'Trouble in the outlying villages.',
        affectsRegion: true,
        noRuntime: true,
      }),
    );
    const findings = scan(corpus, OPTS);
    expect(findings).toHaveLength(1);
    expect(findings[0].code).toBe('SMART_CARD_COVERAGE_REGION');
  });
});
