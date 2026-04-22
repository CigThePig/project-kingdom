// Harness smoke tests — prove the dispatch layer routes a hand card through
// the engine's inline apply and returns a usable { before, after } pair.
// Phase 5 adds decree / assessment / negotiation / overture dispatch; the
// broader non-hand coverage lives in harness-nonhand.test.ts.

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

  it('runs a world event through the applyEventChoiceEffects path', async () => {
    const corpus = await loadCorpus();
    const worldCard = corpus.auditCards.find((c) => c.family === 'world');
    expect(worldCard).toBeDefined();
    const result = runChoice(worldCard!, worldCard!.choices[0], mid);
    expect(result.supported).toBe(true);
  });

  it('runs a crisis event through event-resolution and returns a before/after pair', async () => {
    const corpus = await loadCorpus();
    const crisisCard = corpus.auditCards.find(
      (c) => c.family === 'crisis' && c.runtimePath === 'event-resolution',
    );
    expect(crisisCard).toBeDefined();
    const result = runChoice(crisisCard!, crisisCard!.choices[0], mid);
    expect(result.supported).toBe(true);
  });
});
