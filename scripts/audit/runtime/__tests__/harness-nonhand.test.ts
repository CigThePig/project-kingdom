// Phase 5 — Runtime harness smoke test for non-hand families.
//
// Each of the four new dispatch paths (decrees, assessments, negotiations,
// overtures) should return `{ supported: true }` against the mid-kingdom
// fixture and produce at least one state diff for at least one card. These
// tests lock in the wiring; family-specific behavior is exercised by the
// scan tests.

import { describe, expect, it } from 'vitest';

import { buildFixtures } from '../fixtures';
import { runChoice } from '../harness';
import { diffStates } from '../diff';
import { loadCorpus } from '../../corpus';

describe('runtime harness — non-hand dispatch', () => {
  const fixtures = buildFixtures();
  const mid = fixtures.find((f) => f.id === 'mid-kingdom')!.state;

  it('dispatches an assessment and produces a state diff', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.family === 'assessment');
    expect(card).toBeDefined();
    const result = runChoice(card!, card!.choices[0], mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(diffStates(result.before, result.after).length).toBeGreaterThan(0);
  });

  it('dispatches a negotiation and produces a state diff', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.family === 'negotiation');
    expect(card).toBeDefined();
    // Pick a term path (skip reject which may be a no-op by design).
    const rejectId = card!.metadata?.rejectChoiceId as string | undefined;
    const termChoice = card!.choices.find((c) => c.choiceId !== rejectId);
    expect(termChoice).toBeDefined();
    const result = runChoice(card!, termChoice!, mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(diffStates(result.before, result.after).length).toBeGreaterThan(0);
  });

  it('dispatches an overture grant and produces a state diff', async () => {
    const corpus = await loadCorpus();
    // Filter to the generated overtures (keyed `overture:<Agenda>`); event-
    // pool cards with affectsNeighbor are also classified `overture` but use
    // a different runtime path.
    const card = corpus.auditCards.find(
      (c) => c.family === 'overture' && c.sourceKind === 'generated',
    );
    expect(card).toBeDefined();
    const grant = card!.choices.find((c) => c.choiceId === 'grant');
    expect(grant).toBeDefined();
    const result = runChoice(card!, grant!, mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(diffStates(result.before, result.after).length).toBeGreaterThan(0);
  });

  it('dispatches a decree and produces a state diff', async () => {
    const corpus = await loadCorpus();
    // Pick a decree known to have a handler so we don't test a no-op path.
    const card = corpus.auditCards.find(
      (c) => c.family === 'decree' && c.metadata?.hasHandler === true,
    );
    expect(card).toBeDefined();
    const result = runChoice(card!, card!.choices[0], mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(diffStates(result.before, result.after).length).toBeGreaterThan(0);
  });
});
