// Runtime fingerprint builder. Given an AuditCard and a set of fixtures,
// produce `{ fixtureId, touches, classes, structuralCount, surfaceCount,
// noOp }` for each decision path. The builder picks the first fixture the
// harness successfully runs against — mid-kingdom first because it has the
// non-empty persistentConsequences / temp-modifier arrays the hand cards
// need to produce visible diffs.

import type { GameState } from '../../../src/engine/types';
import type { AuditCard, AuditDecisionPath, RuntimeFingerprint } from '../ir';
import { classifyPath, touchClassesFor } from './classifier';
import { diffStates, type DiffedPath } from './diff';
import { buildFixtures, type RuntimeFixture } from './fixtures';
import { runChoice, runChoiceVariants } from './harness';

export interface RuntimeFingerprintVariants {
  a: RuntimeFingerprint;
  b: RuntimeFingerprint;
}

const FIXTURE_ORDER: Array<RuntimeFixture['id']> = [
  'mid-kingdom',
  'late-kingdom',
  'early-kingdom',
];

export function fingerprintCard(
  card: AuditCard,
  fixtures: RuntimeFixture[] = buildFixtures(),
): Map<string, RuntimeFingerprint | null> {
  const out = new Map<string, RuntimeFingerprint | null>();
  for (const choice of card.choices) {
    out.set(choice.choiceId, fingerprintChoice(card, choice, fixtures));
  }
  return out;
}

export function fingerprintChoice(
  card: AuditCard,
  choice: AuditDecisionPath,
  fixtures: RuntimeFixture[],
): RuntimeFingerprint | null {
  const ordered = orderFixtures(fixtures);
  for (const fx of ordered) {
    const result = runChoice(card, choice, fx.state);
    if (!result.supported) continue;
    return buildFingerprint(fx.id, result.before, result.after);
  }
  return null;
}

/**
 * Fingerprint the same decision path against two distinct `choice` targets.
 * Populated only when `card.metadata.requiresChoice != null` and the fixture
 * can supply two distinct targets. The `a` and `b` fingerprints are compared
 * by scans to catch cards that ignore the distinguishing target.
 */
export function fingerprintChoiceVariants(
  card: AuditCard,
  choice: AuditDecisionPath,
  fixtures: RuntimeFixture[] = buildFixtures(),
): RuntimeFingerprintVariants | null {
  const ordered = orderFixtures(fixtures);
  for (const fx of ordered) {
    const result = runChoiceVariants(card, choice, fx.state);
    if (!result.supported) continue;
    return {
      a: buildFingerprint(fx.id, result.before, result.afterA),
      b: buildFingerprint(fx.id, result.before, result.afterB),
    };
  }
  return null;
}

function buildFingerprint(
  fixtureId: string,
  before: GameState,
  after: GameState,
): RuntimeFingerprint {
  const paths = diffStates(before, after);
  return {
    fixtureId,
    touches: paths.map((p: DiffedPath) => p.path),
    classes: touchClassesFor(paths),
    structuralCount: paths.filter((p) => classifyPath(p) === 'structural').length,
    surfaceCount: paths.filter((p) => classifyPath(p) === 'surface').length,
    noOp: paths.length === 0,
  };
}

function orderFixtures(fixtures: RuntimeFixture[]): RuntimeFixture[] {
  const byId = new Map(fixtures.map((f) => [f.id, f] as const));
  const out: RuntimeFixture[] = [];
  for (const id of FIXTURE_ORDER) {
    const f = byId.get(id);
    if (f) out.push(f);
  }
  // Include any extras not in FIXTURE_ORDER so custom fixtures don't fall off.
  for (const f of fixtures) {
    if (!FIXTURE_ORDER.includes(f.id)) out.push(f);
  }
  return out;
}
