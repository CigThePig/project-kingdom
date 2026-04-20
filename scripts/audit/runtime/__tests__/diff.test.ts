// diff + classifier smoke tests. Feed the diff two real fixture states
// after running a hand card through the harness and assert the classifier
// agrees with the analyzer-declared markers. The point is end-to-end
// truthiness, not exhaustive coverage of every path shape.

import { describe, expect, it } from 'vitest';

import { buildFixtures } from '../fixtures';
import { runChoice } from '../harness';
import { loadCorpus } from '../../corpus';
import { diffStates } from '../diff';
import { classifyPath, touchClassesFor } from '../classifier';

describe('runtime diff + classifier', () => {
  const fixtures = buildFixtures();
  const mid = fixtures.find((f) => f.id === 'mid-kingdom')!.state;

  it('classifies hand_royal_pardon as structural (persistentConsequences)', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.id === 'hand_royal_pardon')!;
    const result = runChoice(card, card.choices[0], mid);
    if (!result.supported) throw new Error('expected supported');

    const paths = diffStates(result.before, result.after);
    const classes = touchClassesFor(paths);
    expect(classes).toContain('structural');
  });

  it('classifies hand_reserve_forces as surface-only (military)', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.id === 'hand_reserve_forces')!;
    const result = runChoice(card, card.choices[0], mid);
    if (!result.supported) throw new Error('expected supported');

    const paths = diffStates(result.before, result.after);
    const classes = touchClassesFor(paths);
    expect(classes).toContain('surface');
    expect(classes).not.toContain('structural');
  });

  it('classifies hand_quiet_word as temporal (activeTemporaryModifiers)', async () => {
    const corpus = await loadCorpus();
    const card = corpus.auditCards.find((c) => c.id === 'hand_quiet_word')!;
    const result = runChoice(card, card.choices[0], mid);
    if (!result.supported) throw new Error('expected supported');

    const paths = diffStates(result.before, result.after);
    const classes = touchClassesFor(paths);
    expect(classes).toContain('temporal');
  });

  it('classifyPath recognizes top-level GameState fields', () => {
    expect(classifyPath({ path: 'treasury.balance', kind: 'change' })).toBe('surface');
    expect(
      classifyPath({ path: 'persistentConsequences.length', kind: 'change' }),
    ).toBe('structural');
    expect(classifyPath({ path: 'diplomacy.neighbors[0].relationshipScore', kind: 'change' })).toBe('diplomatic');
    expect(classifyPath({ path: 'narrativePressure.authority', kind: 'change' })).toBe('narrative');
  });
});
