// Card Audit — shared scan helpers.

import type { Corpus, Family } from '../types';

export function familyOf(corpus: Corpus, cardId: string): Family {
  return corpus.familyByCardId.get(cardId) ?? 'unknown';
}

export function fileOf(corpus: Corpus, cardId: string): string | undefined {
  return corpus.filePathByCardId.get(cardId);
}

/** True when the card is a follow-up that exists in FOLLOW_UP_POOL only. */
export function isFollowUpOnly(corpus: Corpus, cardId: string): boolean {
  const inMain = corpus.events.pool.some((e) => e.id === cardId);
  if (inMain) return false;
  return corpus.events.followUpPool.some((e) => e.id === cardId);
}

// ============================================================
// Shared touch-class vocabulary for substance scans.
// A decision path whose runtime diff only mentions SURFACE_ONLY_CLASSES is
// structurally hollow (CARD_AUDIT_RULES §2). Any scan that asserts "this
// family failed the substance rule" should import this set instead of
// re-declaring it.
// ============================================================

export const STRUCTURAL_TOUCH_CLASSES = new Set<string>([
  'structural',
  'diplomatic',
  'temporal',
  'narrative',
  'operations',
  'region',
  'policy',
  'construction',
]);

/** True when the runtime fingerprint contains at least one non-surface class. */
export function hasStructuralClass(classes: readonly string[]): boolean {
  for (const c of classes) {
    if (STRUCTURAL_TOUCH_CLASSES.has(c)) return true;
  }
  return false;
}

/**
 * Canonical keyword lexicon for promise/delivery style scans. Both
 * text.promise-delivery and decrees.preview-parity read concrete claims
 * out of authored prose and ask the runtime fingerprint to corroborate.
 * Keyword patterns are conservative (word-boundary matched, case-insensitive).
 */
export interface PromiseKeywordRule {
  /** Short label for the rule in findings. */
  label: string;
  /** Pattern that must appear in the card body / preview text. */
  keyword: RegExp;
  /** Any one of these substrings must appear in `fp.touches`. */
  requires: string[];
}

export const PROMISE_KEYWORD_RULES: PromiseKeywordRule[] = [
  {
    label: 'construction',
    keyword: /\bconstruct(?:ion|s|ed|ing)?\b|\bbuild(?:ing|s|ers?)?\b|\bwalls?\b/i,
    requires: ['constructionProjects', 'regions', 'infrastructure'],
  },
  {
    label: 'granaries/food',
    keyword: /\bgranar(?:y|ies)\b|\bharvest\b|\breserves?\b/i,
    requires: ['food', 'granaries'],
  },
  {
    label: 'treasury/gold',
    keyword: /\btreasur(?:y|ies)\b|\bcoffers?\b|\brevenue\b|\btax(?:es|ation)?\b/i,
    requires: ['treasury'],
  },
  {
    label: 'military readiness',
    keyword: /\breadiness\b|\bmuster\b|\bgarrison(?:ed|s)?\b|\bdrill\b/i,
    requires: ['military'],
  },
  {
    label: 'faith',
    keyword: /\bfaith(?:ful)?\b|\bclerg(?:y|ies)\b|\baltar\b|\bheterodox(?:y|ies)?\b/i,
    requires: ['faith', 'heterodoxy', 'religiousOrders'],
  },
  {
    label: 'bond/diplomacy',
    keyword: /\btreat(?:y|ies)\b|\balliance\b|\bcovenant\b|\bbond\b/i,
    requires: ['diplomacy', 'diplomaticBonds'],
  },
  {
    label: 'rival/neighbor',
    keyword: /\bneighbo[ru]rs?\b|\brivals?\b|\bambassador\b|\benvoy\b/i,
    requires: ['diplomacy', 'neighbors'],
  },
  {
    label: 'agent/operation',
    keyword: /\bagents?\b|\bspymaster\b|\bcovert\b|\binfiltrat(?:e|ion|ing)\b/i,
    requires: ['espionage', 'agents', 'operations'],
  },
];
