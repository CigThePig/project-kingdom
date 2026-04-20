// Classifier — maps a DiffedPath into a touch-class the scanner reasons
// about. Scans lean on touch-classes (not raw paths) because the
// scanner's language is "this decision is surface-only" or "this decision
// mutates structural state" — the specific field doesn't matter to the
// scan, but the class does.
//
// The map below pairs GameState top-level fields to classes. Unmapped or
// unknown paths fall to `'unknown'`; each unknown is effectively a signal
// that the diff walked into a corner of GameState the classifier hasn't
// taught the scanner about yet.

import type { DiffedPath } from './diff';

export type TouchClass =
  | 'surface' // treasury, food, military, stability, population satisfaction
  | 'structural' // persistentConsequences, issuedDecrees, activeKingdomFeatures
  | 'diplomatic' // diplomacy.*, bonds, neighbors
  | 'temporal' // activeTemporaryModifiers, pendingFollowUps, turn
  | 'narrative' // narrativePressure, activeEvents, activeStorylines
  | 'operations' // actionBudget, council, causalLedger bookkeeping
  | 'region' // regions.*
  | 'policy' // policies.*
  | 'construction' // constructionProjects, activeInitiative
  | 'unknown';

export interface ClassifiedDiff {
  path: DiffedPath;
  touchClass: TouchClass;
}

/** Ordered: most-specific prefix first so subpaths don't shadow. */
const PREFIX_CLASSES: Array<[string, TouchClass]> = [
  ['persistentConsequences', 'structural'],
  ['issuedDecrees', 'structural'],
  ['activeKingdomFeatures', 'structural'],
  ['resolvedStorylineIds', 'structural'],
  ['discoveredCombos', 'structural'],

  ['activeTemporaryModifiers', 'temporal'],
  ['pendingFollowUps', 'temporal'],
  ['turn', 'temporal'],

  ['diplomacy', 'diplomatic'],

  ['narrativePressure', 'narrative'],
  ['activeEvents', 'narrative'],
  ['activeStorylines', 'narrative'],
  ['activeWorldEvents', 'narrative'],
  ['narrativePacing', 'narrative'],

  ['regions', 'region'],

  ['policies', 'policy'],

  ['constructionProjects', 'construction'],
  ['activeInitiative', 'construction'],

  ['council', 'operations'],
  ['actionBudget', 'operations'],
  ['causalLedger', 'operations'],
  ['crownBar', 'operations'],
  ['pendingComboKeysThisTurn', 'operations'],

  ['treasury', 'surface'],
  ['food', 'surface'],
  ['resources', 'surface'],
  ['population', 'surface'],
  ['populationDynamics', 'surface'],
  ['military', 'surface'],
  ['stability', 'surface'],
  ['faithCulture', 'surface'],
  ['espionage', 'surface'],
  ['knowledge', 'surface'],
  ['environment', 'surface'],
  ['economy', 'surface'],
  ['rulingStyle', 'surface'],
  ['courtHand', 'surface'],
];

export function classifyPath(path: DiffedPath): TouchClass {
  const segment = path.path.split(/[.\[]/)[0];
  for (const [prefix, cls] of PREFIX_CLASSES) {
    if (segment === prefix) return cls;
  }
  return 'unknown';
}

export function classifyDiff(paths: DiffedPath[]): ClassifiedDiff[] {
  return paths.map((p) => ({ path: p, touchClass: classifyPath(p) }));
}

/** Convenience: unique, stable-ordered set of classes touched. */
export function touchClassesFor(paths: DiffedPath[]): TouchClass[] {
  const seen = new Set<TouchClass>();
  for (const p of paths) seen.add(classifyPath(p));
  const order: TouchClass[] = [
    'surface',
    'structural',
    'diplomatic',
    'temporal',
    'narrative',
    'operations',
    'region',
    'policy',
    'construction',
    'unknown',
  ];
  return order.filter((c) => seen.has(c));
}
