// Runtime-path registry: how each card family is actually resolved in the
// engine. Scans should read these instead of guessing from data shape.
//
// The map below is the scanner's *declared* runtime path for each family.
// `engine.runtime-path-parity` (M5) diffs this against what the runtime
// harness actually dispatches to; mismatches surface as ENGINE_MISMATCH
// findings so scanner-model drift stays visible.

import type { Family } from './types';

export type RuntimePathKind =
  | 'event-resolution'
  | 'direct-effect-assessment'
  | 'direct-effect-negotiation'
  | 'generated-overture'
  | 'inline-hand-apply'
  | 'decree-resolution'
  | 'world-event-resolution'
  | 'unknown';

const FAMILY_RUNTIME_PATH: Record<Family, RuntimePathKind> = {
  crisis: 'event-resolution',
  petition: 'event-resolution',
  notification: 'event-resolution',
  assessment: 'direct-effect-assessment',
  negotiation: 'direct-effect-negotiation',
  overture: 'generated-overture',
  hand: 'inline-hand-apply',
  decree: 'decree-resolution',
  world: 'world-event-resolution',
  unknown: 'unknown',
};

export function runtimePathFor(family: Family): RuntimePathKind {
  return FAMILY_RUNTIME_PATH[family] ?? 'unknown';
}

export function allKnownRuntimePaths(): Record<Family, RuntimePathKind> {
  return { ...FAMILY_RUNTIME_PATH };
}
