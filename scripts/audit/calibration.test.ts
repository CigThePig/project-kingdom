// Calibration anchor — see docs/CARD_AUDIT_RULES.md §14.
//
// `evt_exp_eco_tax_dispute` is the canonical "weak card" test fixture. The
// audit verdict in §14.2 is: surface-only on `defer_collection_to_next_season`,
// weak differentiation across choices, and a smart-card coverage failure.
//
// This test runs the real corpus through the real scan pipeline and asserts
// the surface-only flag fires on the deferral choice. When §14.3 lands and
// this card is rebuilt, the test will start failing — which is the signal to
// update or delete it.

import { describe, expect, it } from 'vitest';

import { loadCorpus } from './corpus';
import { scan as surfaceOnlyScan, SCAN_ID as SURFACE_ONLY_ID } from './scans/substance/surface-only';
import { scan as choiceClonesScan, SCAN_ID as CHOICE_CLONES_ID } from './scans/substance/choice-clones';
import type { ScanOptions } from './types';

const ANCHOR = 'evt_exp_eco_tax_dispute';

const FULL_OPTS: ScanOptions = {
  includeMinor: true,
  includePolish: true,
};

describe('calibration: evt_exp_eco_tax_dispute', () => {
  it('flags defer_collection_to_next_season as surface-only (MAJOR)', async () => {
    const corpus = await loadCorpus();
    const findings = surfaceOnlyScan(corpus, FULL_OPTS);
    const onAnchor = findings.filter((f) => f.cardId === ANCHOR);

    const deferral = onAnchor.find(
      (f) => f.choiceId === 'defer_collection_to_next_season',
    );
    expect(deferral, 'expected surface-only finding on defer_collection_to_next_season').toBeDefined();
    expect(deferral!.severity).toBe('MAJOR');
    expect(deferral!.scanId).toBe(SURFACE_ONLY_ID);
    expect(deferral!.code).toBe('SURFACE_ONLY');

    // The other two choices have structural markers (regionConditionDelta on
    // an affectsRegion card; follow-up event on the amnesty branch). The
    // scanner should leave them alone — that's the false-positive guarantee.
    const otherChoices = onAnchor.filter(
      (f) => f.choiceId && f.choiceId !== 'defer_collection_to_next_season',
    );
    expect(otherChoices, 'no other choices on the anchor should be flagged surface-only').toEqual([]);
  });

  it('produces a stable choice-clones signature for the anchor (no false-positive clone match)', async () => {
    // The three choices have distinct effect signatures. The clone scan must
    // NOT flag this card — that would be a false positive against §14.
    const corpus = await loadCorpus();
    const clones = choiceClonesScan(corpus, FULL_OPTS);
    const onAnchor = clones.filter((f) => f.cardId === ANCHOR);
    expect(onAnchor, 'choice-clones must not flag distinct-effect choices on the anchor').toEqual([]);
    expect(CHOICE_CLONES_ID).toBe('substance.choice-clones');
  });

  it('finds the anchor in the corpus with three choices and a follow-up wired', async () => {
    // Defensive — if upstream rewrites the card without updating this test,
    // the failure mode should be obvious.
    const corpus = await loadCorpus();
    const ev = corpus.eventById.get(ANCHOR);
    expect(ev, `${ANCHOR} must exist in EVENT_POOL`).toBeDefined();
    expect(ev!.choices.map((c) => c.choiceId)).toEqual([
      'enforce_full_collection',
      'grant_partial_amnesty',
      'defer_collection_to_next_season',
    ]);
    const followUps = ev!.followUpEvents ?? [];
    expect(followUps.some((fu) => fu.triggerChoiceId === 'grant_partial_amnesty')).toBe(true);
  });
});
