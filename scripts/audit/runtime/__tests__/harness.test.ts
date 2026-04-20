// Harness smoke tests — prove the dispatch layer routes a hand card through
// the engine's inline apply and returns a usable { before, after } pair.
// Non-hand paths should degrade gracefully to `{ supported: false }` until
// later milestones flesh them out.

import { describe, expect, it } from 'vitest';

import { buildFixtures } from '../fixtures';
import { runChoice } from '../harness';
import { loadCorpus } from '../../corpus';

describe('runtime harness', () => {
  const fixtures = buildFixtures();
  const mid = fixtures.find((f) => f.id === 'mid-kingdom')!.state;

  it('runs hand_royal_pardon and shortens persistentConsequences', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.id === 'hand_royal_pardon');
    expect(card).toBeDefined();
    const result = runChoice(card!, card!.choices[0], mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(result.after.persistentConsequences.length).toBe(
      result.before.persistentConsequences.length - 1,
    );
  });

  it('runs hand_reserve_forces and raises military readiness', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.id === 'hand_reserve_forces');
    expect(card).toBeDefined();
    const result = runChoice(card!, card!.choices[0], mid);
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(result.after.military.readiness).toBeGreaterThan(
      result.before.military.readiness,
    );
  });

  it('returns unsupported for non-hand families for now', async () => {
    const corpus = await loadCorpus();
    const assessmentCard = corpus.auditCards.find((c) => c.family === 'assessment');
    expect(assessmentCard).toBeDefined();
    const result = runChoice(assessmentCard!, assessmentCard!.choices[0], mid);
    expect(result.supported).toBe(false);
  });
});
