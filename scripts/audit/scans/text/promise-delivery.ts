// Text scan §4.1 — promise/delivery coherence. When the card body uses a
// concrete mechanical keyword ("construction", "granaries", "readiness"),
// the runtime diff must show a corresponding touch. Body-claims-without-
// mechanical-backing is the single most common failure mode in the
// petition corpus and is worth surfacing as a heuristic.
//
// This is a HEURISTIC scan: the keyword lexicon is conservative and the
// touch-matching is by substring against the runtime fingerprint's
// `touches[]`. False positives will exist; the scan is calibrated so that
// when it fires, the author has either oversold the mechanic or missed
// wiring the claim to a real effect.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'text.promise-delivery';

interface PromiseRule {
  keyword: RegExp;
  requires: string[];
  label: string;
}

const PROMISE_RULES: PromiseRule[] = [
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

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!card.coverage.runtimeDiffCoverage) continue;
    const body = card.body;
    if (!body) continue;

    for (const path of card.choices) {
      const fp = path.runtimeFingerprint;
      if (!fp || fp.noOp) continue;

      for (const rule of PROMISE_RULES) {
        if (!rule.keyword.test(body)) continue;
        const satisfied = fp.touches.some((t) =>
          rule.requires.some((req) => t.includes(req)),
        );
        if (satisfied) continue;

        out.push({
          severity: 'MAJOR',
          family: card.family,
          scanId: SCAN_ID,
          code: 'PROMISE_NOT_DELIVERED',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: body references "${rule.label}" but runtime diff shows no matching touch (touches: ${fp.touches.join(', ') || '∅'}).`,
          confidence: 'HEURISTIC',
          details: {
            ruleLabel: rule.label,
            expectedTouchSubstrings: rule.requires,
            actualTouches: fp.touches,
          },
        });
      }
    }
  }

  return out;
};
