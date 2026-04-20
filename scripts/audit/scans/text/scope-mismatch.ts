// Text scan §3 — the card body should not claim a wider (or narrower) scope
// than the effects actually cover. Three shapes are worth surfacing:
//
//   1. "Every class" / "all classes" / "the realm entire" — body claims
//      universal class impact but the runtime diff touches < 3 class
//      satisfaction paths.
//   2. "The kingdom" / "nationwide" — body claims kingdom-wide impact but
//      the runtime diff is exclusively region-scoped.
//   3. "In {region}" / "the {terrain} villages" / named region — body
//      claims a region scope but `affectsRegion` is false on the card
//      definition.
//
// All are MAJOR heuristics. False positives are possible (poetic "kingdom"
// phrasing over a region-scoped event) but the finding is actionable
// because the author either needs to widen scope or narrow the body.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'text.scope-mismatch';

const EVERY_CLASS_RE = /\bevery\s+class\b|\ball\s+classes\b|\brealm\s+entire\b|\bthe\s+realm\b/i;
const KINGDOM_WIDE_RE = /\bthe\s+kingdom\b|\bnationwide\b|\bacross\s+the\s+realm\b|\brealm-?wide\b/i;
const REGIONAL_PHRASE_RE = /\bin\s+the\s+\w+\s+villages?\b|\bin\s+the\s+[a-z]+\s+provinces?\b|\bin\s+the\s+(?:northern|southern|eastern|western)\s+(?:march|march(?:es)?|frontier)\b/i;

const CLASS_TOUCH_PATHS = [
  'Commoners',
  'Nobility',
  'Clergy',
  'Merchants',
  'MilitaryCaste',
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

      if (EVERY_CLASS_RE.test(body)) {
        const classesTouched = CLASS_TOUCH_PATHS.filter((c) =>
          fp.touches.some((t) => t.includes(c)),
        );
        if (classesTouched.length < 3) {
          out.push({
            severity: 'MAJOR',
            family: card.family,
            scanId: SCAN_ID,
            code: 'SCOPE_MISMATCH',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message: `${card.id}: body claims universal class impact ("every class" / "all classes") but runtime diff only touches ${classesTouched.length} class path(s).`,
            confidence: 'HEURISTIC',
            details: {
              bodyPhrase: 'every-class',
              classesTouched,
              touches: fp.touches,
            },
          });
          continue;
        }
      }

      if (KINGDOM_WIDE_RE.test(body)) {
        const onlyRegional =
          fp.touches.length > 0
          && fp.touches.every((t) => t.startsWith('regions'));
        if (onlyRegional) {
          out.push({
            severity: 'MAJOR',
            family: card.family,
            scanId: SCAN_ID,
            code: 'SCOPE_MISMATCH',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message: `${card.id}: body frames a kingdom-wide effect but every runtime touch is region-scoped.`,
            confidence: 'HEURISTIC',
            details: { bodyPhrase: 'kingdom-wide', touches: fp.touches },
          });
          continue;
        }
      }

      const affectsRegion =
        (card.metadata?.affectsRegion as boolean | undefined) === true;
      if (REGIONAL_PHRASE_RE.test(body) && !affectsRegion) {
        out.push({
          severity: 'MAJOR',
          family: card.family,
          scanId: SCAN_ID,
          code: 'SCOPE_MISMATCH',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: body frames a regional scope but the definition is not marked \`affectsRegion: true\`.`,
          confidence: 'HEURISTIC',
          details: { bodyPhrase: 'regional-without-flag' },
        });
      }
    }
  }

  return out;
};
