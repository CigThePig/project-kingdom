// Runtime-fingerprint wire-up: the loader's opt-in flag must attach a
// non-null fingerprint to every harness-supported path and flip
// runtimeDiffCoverage true on those cards. Unsupported families stay null.

import { describe, expect, it } from 'vitest';

import { loadCorpus } from '../../corpus';

describe('runtime fingerprint loader flag', () => {
  it('attaches fingerprints to hand cards when runtimeFingerprint is enabled', async () => {
    const corpus = await loadCorpus({ runtimeFingerprint: true });
    const pardon = corpus.auditCards.find((c) => c.id === 'hand_royal_pardon');
    expect(pardon).toBeDefined();
    const fp = pardon!.choices[0]!.runtimeFingerprint;
    expect(fp).not.toBeNull();
    expect(fp!.classes).toContain('structural');
    expect(pardon!.coverage.runtimeDiffCoverage).toBe(true);
  });

  it('attaches fingerprints to crisis events once event-resolution is supported', async () => {
    const corpus = await loadCorpus({ runtimeFingerprint: true });
    const event = corpus.auditCards.find(
      (c) => c.family === 'crisis' && c.runtimePath === 'event-resolution',
    );
    expect(event).toBeDefined();
    const anySupported = event!.choices.some(
      (p) => p.runtimeFingerprint != null || p.runtimeFingerprintVariants != null,
    );
    expect(anySupported).toBe(true);
    expect(event!.coverage.runtimeDiffCoverage).toBe(true);
  });

  it('leaves fingerprint undefined when the flag is off', async () => {
    const corpus = await loadCorpus();
    const pardon = corpus.auditCards.find((c) => c.id === 'hand_royal_pardon');
    expect(pardon).toBeDefined();
    expect(pardon!.choices[0]!.runtimeFingerprint).toBeUndefined();
  });
});
