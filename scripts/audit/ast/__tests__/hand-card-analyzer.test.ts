// Hand-card analyzer smoke tests. We anchor on four cards with distinct
// apply shapes so a regression in any classifier branch surfaces as a named
// failure rather than a whole-map shift.
//
//   hand_royal_pardon       — mutates persistentConsequences via spread-assign
//   hand_reserve_forces     — calls applyMechanicalEffectDelta, no consequence
//   hand_quiet_word         — queues a temporary modifier via queueTemporaryModifier
//   hand_royal_announcement — no consequence / temp modifier / delta call

import { describe, expect, it } from 'vitest';

import { analyzeHandCards } from '../hand-card-analyzer';

describe('hand-card analyzer', () => {
  const index = analyzeHandCards();

  it('classifies hand_royal_pardon as touching persistentConsequences', () => {
    const m = index.get('hand_royal_pardon');
    expect(m).toBeDefined();
    expect(m!.touchesPersistentConsequences).toBe(true);
    expect(m!.queuesTemporaryModifier).toBe(false);
    expect(m!.appliesMechanicalDelta).toBe(false);
  });

  it('classifies hand_reserve_forces as calling applyMechanicalEffectDelta', () => {
    const m = index.get('hand_reserve_forces');
    expect(m).toBeDefined();
    expect(m!.appliesMechanicalDelta).toBe(true);
    expect(m!.touchesPersistentConsequences).toBe(false);
    // The card now also queues a lingering readiness modifier so it passes
    // hand.runtime-structural-depth — see M3 audit pass.
    expect(m!.queuesTemporaryModifier).toBe(true);
  });

  it('classifies hand_quiet_word as queueing a temporary modifier', () => {
    const m = index.get('hand_quiet_word');
    expect(m).toBeDefined();
    expect(m!.queuesTemporaryModifier).toBe(true);
    expect(m!.touchesPersistentConsequences).toBe(false);
  });

  it('classifies hand_royal_announcement as a pure surface edit', () => {
    const m = index.get('hand_royal_announcement');
    expect(m).toBeDefined();
    expect(m!.touchesPersistentConsequences).toBe(false);
    expect(m!.queuesTemporaryModifier).toBe(false);
    expect(m!.appliesMechanicalDelta).toBe(false);
    expect(m!.touchesBond).toBe(false);
  });

  it('covers every HAND_CARDS entry (both base and expanded files)', () => {
    // A rough floor — both files together define >30 hand cards. If the
    // source-file matcher breaks, this drops to zero.
    expect(index.size).toBeGreaterThan(30);
  });

  it('flags choice-reading cards (e.g. hand_spymasters_whisper) via readsChoice', () => {
    const m = index.get('hand_spymasters_whisper');
    expect(m).toBeDefined();
    expect(m!.readsChoice).toBe(true);
  });

  // ----------------------------------------------------------------
  // M5D.A — fine-grained markers: choice usage depth, early-return guards,
  // and temp-modifier shape inventory.
  // ----------------------------------------------------------------

  it('hand_royal_pardon uses no choice and has no early-return guards', () => {
    const m = index.get('hand_royal_pardon');
    expect(m).toBeDefined();
    expect(m!.choiceUsageKind).toBe('none');
    expect(m!.earlyReturnOnMissingId).toBe(false);
    expect(m!.silentFallbackOnChoiceKind).toBe(false);
  });

  it('hand_court_favor routes non-class choices to a real fallback class (no silent return)', () => {
    const m = index.get('hand_court_favor');
    expect(m).toBeDefined();
    // After M3, the card picks the lowest-satisfied class on a non-class
    // choice rather than returning state unchanged — the silent fallback
    // is gone.
    expect(m!.silentFallbackOnChoiceKind).toBe(false);
    // `choice.class` is still read when the class choice is present.
    expect(m!.choiceUsageKind).toBe('deep');
  });

  it('hand_spymasters_whisper has an early-return-on-missing-id guard and deep choice usage', () => {
    const m = index.get('hand_spymasters_whisper');
    expect(m).toBeDefined();
    expect(m!.earlyReturnOnMissingId).toBe(true);
    expect(m!.silentFallbackOnChoiceKind).toBe(false);
    expect(m!.choiceUsageKind).toBe('deep');
  });

  it('hand_quiet_word records a fully-shaped queued modifier', () => {
    const m = index.get('hand_quiet_word');
    expect(m).toBeDefined();
    expect(m!.queuedModifiers.length).toBe(1);
    const mod = m!.queuedModifiers[0];
    expect(mod.hasId).toBe(true);
    expect(mod.hasSourceTag).toBe(true);
    expect(mod.hasTurnApplied).toBe(true);
    expect(mod.turnsRemaining).toBe('literal');
    expect(mod.effectKeys).toContain('stabilityDelta');
  });

  it('hand_festival_proclaimed queues a multi-class satisfaction modifier', () => {
    const m = index.get('hand_festival_proclaimed');
    expect(m).toBeDefined();
    expect(m!.queuedModifiers.length).toBe(1);
    const mod = m!.queuedModifiers[0];
    expect(mod.effectKeys.sort()).toEqual([
      'clergySatDelta',
      'commonerSatDelta',
      'merchantSatDelta',
      'militaryCasteSatDelta',
      'nobilitySatDelta',
    ]);
  });

  it('hand_reserve_forces records the lingering readiness modifier added in M3', () => {
    const m = index.get('hand_reserve_forces');
    expect(m).toBeDefined();
    expect(m!.queuedModifiers.length).toBe(1);
    expect(m!.queuedModifiers[0].effectKeys).toContain('militaryReadinessDelta');
  });
});
