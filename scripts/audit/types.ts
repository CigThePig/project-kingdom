// Card Audit — shared types
// See docs/CARD_AUDIT_RULES.md §8 for severity definitions and §13 for scans.

export type FindingSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'POLISH';

/**
 * How confident the audit is that a finding represents reality, distinct
 * from its severity to the player-facing corpus:
 *   - DETERMINISTIC:   table/shape check with no runtime inference.
 *   - RUNTIME_GROUNDED: backed by a real runtime-diff or AST-verified fact.
 *   - HEURISTIC:       pattern- or magnitude-based suspicion.
 *   - ENGINE_MISMATCH: the scanner's model disagrees with runtime. These
 *                      are scanner-model failures, NOT content failures, and
 *                      must be isolated from card-cleanup backlogs.
 */
export type FindingConfidence =
  | 'DETERMINISTIC'
  | 'RUNTIME_GROUNDED'
  | 'HEURISTIC'
  | 'ENGINE_MISMATCH';

export type Family =
  | 'decree'
  | 'crisis'
  | 'petition'
  | 'assessment'
  | 'negotiation'
  | 'overture'
  | 'notification'
  | 'hand'
  | 'world'
  | 'unknown';

export type ScanCategory = 'wiring' | 'substance' | 'text' | 'reach' | 'engine';

export interface Finding {
  severity: FindingSeverity;
  family: Family;
  scanId: string;
  code: string;
  cardId: string;
  choiceId?: string;
  filePath?: string;
  message: string;
  details?: Record<string, unknown>;
  /** When omitted, the reporter treats the finding as DETERMINISTIC. */
  confidence?: FindingConfidence;
}

export interface Corpus {
  events: { pool: import('../../src/engine/events/event-engine').EventDefinition[]; followUpPool: import('../../src/engine/events/event-engine').EventDefinition[] };
  decrees: {
    pool: import('../../src/data/decrees/index').DecreeDefinition[];
    effects: Record<string, import('../../src/engine/types').MechanicalEffectDelta>;
    /** Keys registered in DECREE_EFFECT_REGISTRY (decree_ prefix stripped). */
    handlerKeys: Set<string>;
  };
  assessments: {
    pool: import('../../src/engine/events/event-engine').EventDefinition[];
    effects: Record<string, Record<string, import('../../src/engine/types').MechanicalEffectDelta>>;
    /** ASSESSMENT_TEXT — same row shape as EventTextEntry, separate table. */
    text: Record<string, import('../../src/data/text/events').EventTextEntry>;
  };
  negotiations: {
    pool: import('../../src/data/events/negotiations').NegotiationDefinition[];
    effects: Record<string, Record<string, import('../../src/engine/types').MechanicalEffectDelta>>;
    /** NEGOTIATION_TEXT — distinct shape (terms + rejectLabel, no `choices`). */
    text: Record<string, import('../../src/data/text/negotiations').NegotiationTextEntry>;
  };
  overtures: {
    /** OVERTURE_TEXT keyed by RivalAgenda. Sparse; not every agenda is authored. */
    text: Partial<Record<import('../../src/engine/types').RivalAgenda, import('../../src/data/text/overtures').OvertureTextEntry>>;
    /** Agendas with authored text entries — the audit's de-facto overture pool. */
    authoredAgendas: import('../../src/engine/types').RivalAgenda[];
  };
  worldEvents: {
    defs: import('../../src/engine/types').WorldEventDefinition[];
    effects: Record<string, import('../../src/engine/types').MechanicalEffectDelta>;
    text: Record<string, { title: string; body: string; choices: Record<string, string> }>;
  };
  handCards: import('../../src/data/cards/hand-cards').HandCardDefinition[];
  text: { events: Record<string, import('../../src/data/text/events').EventTextEntry> };
  effects: {
    events: Record<string, Record<string, import('../../src/engine/types').MechanicalEffectDelta>>;
  };
  styleTags: Record<string, Record<string, Partial<Record<import('../../src/engine/types').StyleAxis, number>>>>;
  tempModifiers: Record<string, Record<string, import('../../src/data/events/effects').TemporaryModifierSpec>>;
  featureRegistry: Record<string, import('../../src/data/kingdom-features/index').KingdomFeatureDefinition>;

  // Pre-built indexed views
  /** All event definitions reachable from EVENT_POOL ∪ FOLLOW_UP_POOL ∪ ASSESSMENT_POOL. */
  eventById: Map<string, import('../../src/engine/events/event-engine').EventDefinition>;
  /** Family classification for a given card id. Built from pool membership + classification flag. */
  familyByCardId: Map<string, Family>;
  /** Map cardId -> source file path (best-effort, derived from a one-shot directory walk). */
  filePathByCardId: Map<string, string>;
  /** Tags produced by some choice anywhere in the corpus, with producer locations. */
  tagProducers: Map<string, Array<{ kind: 'event' | 'decree'; id: string; choiceId?: string }>>;
  /** Tags read by triggers/storylines/branches. */
  tagReaders: Map<string, Array<{ where: 'event-trigger' | 'decree-trigger'; id: string }>>;
}

export interface ScanResult {
  scanId: string;
  category: ScanCategory;
  findings: Finding[];
}

export type Scan = (corpus: Corpus, opts: ScanOptions) => Finding[];

export interface ScanOptions {
  /** When set, scan only emits findings for cards in the given family. */
  family?: Family;
  /** When true, MINOR findings are emitted; otherwise suppressed. */
  includeMinor: boolean;
  /** When true, POLISH findings are emitted; otherwise suppressed. */
  includePolish: boolean;
}

export interface AuditConfig {
  outputDir: string;
  family?: Family;
  includeMinor: boolean;
  includePolish: boolean;
  withReach: boolean;
  failOn?: FindingSeverity;
  seedArtifacts: boolean;
}

/** Severity rank — higher is worse. Used for fail-on threshold comparison. */
export const SEVERITY_RANK: Record<FindingSeverity, number> = {
  POLISH: 0,
  MINOR: 1,
  MAJOR: 2,
  CRITICAL: 3,
};

/** Stable, total ordering on findings — produces minimal diffs between runs. */
export function compareFindings(a: Finding, b: Finding): number {
  if (a.family !== b.family) return a.family.localeCompare(b.family);
  const af = a.filePath ?? '';
  const bf = b.filePath ?? '';
  if (af !== bf) return af.localeCompare(bf);
  if (a.cardId !== b.cardId) return a.cardId.localeCompare(b.cardId);
  const ac = a.choiceId ?? '';
  const bc = b.choiceId ?? '';
  if (ac !== bc) return ac.localeCompare(bc);
  return a.scanId.localeCompare(b.scanId);
}
