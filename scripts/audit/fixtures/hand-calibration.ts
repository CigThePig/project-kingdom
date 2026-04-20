// Hand-card calibration fixtures. Each entry is a synthetic shape that
// mimics the IR an adapter would produce for a problematic hand card. Tests
// push these into an empty corpus and assert the Phase 5D scans surface the
// expected finding codes — if the scanners regress, the assertions break
// with a named failure rather than a silent drop in coverage.
//
// We deliberately keep the shapes minimal: scans read the IR, not the real
// source file, so the fixtures don't need to be compilable HandCardDefinition
// objects.

import { buildHandAuditCard } from '../scans/__test_helpers';
import type { AuditCard } from '../ir';

export interface HandCalibrationFixture {
  id: string;
  label: string;
  card: AuditCard;
  /** Scan codes the fixture must emit (any order). Empty = clean. */
  expectedCodes: string[];
}

export const HAND_CALIBRATION_FIXTURES: HandCalibrationFixture[] = [
  {
    id: 'known-good-structural',
    label: 'structural apply with a valid temp modifier',
    card: buildHandAuditCard({
      id: 'hand_cal_good_structural',
      title: 'Quiet Council',
      body: 'A whispered aside steadies the line for a turn.',
      expiresAfterTurns: 9,
      markers: {
        queuesTemporaryModifier: true,
        choiceUsageKind: 'none',
      },
      queuedModifiers: [
        {
          turnsRemaining: 'literal',
          effectKeys: ['stabilityDelta'],
          hasId: true,
          hasSourceTag: true,
          hasTurnApplied: true,
        },
      ],
      fingerprint: {
        touches: ['activeTemporaryModifiers.length', 'activeTemporaryModifiers[2]'],
        classes: ['temporal'],
        structuralCount: 1,
        surfaceCount: 0,
        noOp: false,
      },
    }),
    expectedCodes: [],
  },
  {
    id: 'known-bad-no-op',
    label: 'apply returns state unchanged',
    card: buildHandAuditCard({
      id: 'hand_cal_no_op',
      title: 'Silent Hour',
      body: 'Nothing is done. Nothing happens.',
      expiresAfterTurns: 9,
      markers: { choiceUsageKind: 'none' },
      fingerprint: { noOp: true, touches: [], classes: [] },
    }),
    expectedCodes: ['NO_OP_APPLY'],
  },
  {
    id: 'known-bad-fake-choice',
    label: 'requiresChoice declared but apply never uses it',
    card: buildHandAuditCard({
      id: 'hand_cal_fake_choice',
      title: 'Hollow Audience',
      body: 'The crown claims to hear a chosen class. It does not.',
      expiresAfterTurns: 10,
      requiresChoice: 'class',
      markers: { choiceUsageKind: 'none', appliesMechanicalDelta: true },
      fingerprint: {
        touches: ['treasury.balance'],
        classes: ['surface'],
        surfaceCount: 1,
        structuralCount: 0,
        noOp: false,
      },
      fingerprintVariants: {
        a: {
          fixtureId: 'mid-kingdom',
          touches: ['treasury.balance'],
          classes: ['surface'],
          structuralCount: 0,
          surfaceCount: 1,
          noOp: false,
        },
        b: {
          fixtureId: 'mid-kingdom',
          touches: ['treasury.balance'],
          classes: ['surface'],
          structuralCount: 0,
          surfaceCount: 1,
          noOp: false,
        },
      },
    }),
    // Deep structural-depth check also fires: the only touch is surface-class.
    expectedCodes: ['REQUIRES_CHOICE_UNUSED', 'HAND_SURFACE_ONLY'],
  },
  {
    id: 'known-bad-malformed-modifier',
    label: 'queued temporary modifier is missing sourceTag and turnApplied',
    card: buildHandAuditCard({
      id: 'hand_cal_malformed_modifier',
      title: 'Stray Edict',
      body: 'A loosely-worded edict echoes next turn.',
      expiresAfterTurns: 8,
      markers: { queuesTemporaryModifier: true },
      queuedModifiers: [
        {
          turnsRemaining: 'literal',
          effectKeys: ['stabilityDelta'],
          hasId: true,
          hasSourceTag: false,
          hasTurnApplied: false,
        },
      ],
      fingerprint: {
        touches: ['activeTemporaryModifiers.length', 'activeTemporaryModifiers[2]'],
        classes: ['temporal'],
        structuralCount: 1,
        surfaceCount: 0,
        noOp: false,
      },
    }),
    expectedCodes: ['TEMP_MODIFIER_MALFORMED'],
  },
];
