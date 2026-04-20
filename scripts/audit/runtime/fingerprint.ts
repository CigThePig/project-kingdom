// Runtime fingerprint builder. Given an AuditCard and a set of fixtures,
// produce `{ fixtureId, touches, classes, structuralCount, surfaceCount,
// noOp }` for each decision path. The builder picks the first fixture the
// harness successfully runs against — mid-kingdom first because it has the
// non-empty persistentConsequences / temp-modifier arrays the hand cards
// need to produce visible diffs.

import type { AuditCard, AuditDecisionPath, RuntimeFingerprint } from '../ir';
import { classifyPath, touchClassesFor } from './classifier';
import { diffStates } from './diff';
import { buildFixtures, type RuntimeFixture } from './fixtures';
import { runChoice } from './harness';

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
    const paths = diffStates(result.before, result.after);
    const classes = touchClassesFor(paths);
    let structural = 0;
    let surface = 0;
    for (const p of paths) {
      const cls = classifyPath(p);
      if (cls === 'structural') structural++;
      if (cls === 'surface') surface++;
    }
    return {
      fixtureId: fx.id,
      touches: paths.map((p) => p.path),
      classes,
      structuralCount: structural,
      surfaceCount: surface,
      noOp: paths.length === 0,
    };
  }
  return null;
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
