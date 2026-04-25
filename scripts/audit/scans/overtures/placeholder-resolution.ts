// Phase 5C — Overture placeholder-resolution sanity.
//
// Overture text uses smart-card placeholders (`{ruler_full}`, `{capital}`,
// `{neighbor}`, …) resolved by `substituteSmartPlaceholders` at generation
// time. This scan confirms (a) every agenda body contains at least one
// resolvable placeholder — a flat body without placeholders is a smell that
// the card was authored generically; (b) any `{token}` appearing in the
// body must belong to the documented allowlist; unknown tokens will render
// raw to the player.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'overtures.placeholder-resolution';

// Conservative allowlist of the smart-card tokens the overture generator
// routes through `substituteSmartPlaceholders`. Tokens outside this set
// won't be substituted and will render raw on the card.
const KNOWN_TOKENS = new Set<string>([
  'ruler',
  'ruler_full',
  'ruler_short',
  'capital',
  'dynasty',
  'neighbor',
  'neighbor_short',
  'neighbor_memory_clause',
  'prior_decision_clause:trade',
  'prior_decision_clause:treaty',
  'prior_decision_clause:tax',
  'inter_rival_note',
  'ruling_style_note',
  // Advisor-mediated tokens resolved by bridge/smartText.ts substituteSmart-
  // Placeholders — overtures use these when the narrative hands off to an
  // advisor voice ("Your spymaster reports…").
  'chancellor',
  'marshal',
  'chamberlain',
  'spymaster',
  'chancellor_or_fallback',
  'marshal_or_fallback',
  'chamberlain_or_fallback',
  'spymaster_or_fallback',
  // Phase 10 — agenda-keyed thematic tokens. The overture generator binds
  // ctx.regionId for RestoreTheOldBorders and ctx.spouseName for
  // DynasticAlliance before substituteSmartPlaceholders runs, so both resolve
  // at render time rather than rendering raw.
  'region',
  'spouse_name',
]);

// Tokens that carry an argument after `:`.
const PARAMETRIC_PREFIXES = ['prior_decision_clause:'];

const TOKEN_PATTERN = /\{([a-z_][a-z0-9_:-]*)\}/gi;

function isKnown(token: string): boolean {
  if (KNOWN_TOKENS.has(token)) return true;
  for (const prefix of PARAMETRIC_PREFIXES) {
    if (token.startsWith(prefix)) return true;
  }
  return false;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'overture') continue;
    const body = card.body;
    if (!body) continue;

    const tokens = [...body.matchAll(TOKEN_PATTERN)].map((m) => m[1]);
    if (tokens.length === 0) {
      out.push({
        severity: 'MINOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_BODY_NO_PLACEHOLDERS',
        cardId: card.id,
        message: `${card.id}: overture body contains no smart-card placeholders — the card will read the same regardless of which rival offers it.`,
        confidence: 'HEURISTIC',
      });
      continue;
    }

    const unknown = tokens.filter((t) => !isKnown(t));
    if (unknown.length > 0) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_UNKNOWN_TOKEN',
        cardId: card.id,
        message: `${card.id}: overture body uses token(s) outside the known allowlist (${unknown.join(', ')}) — these will render raw.`,
        confidence: 'HEURISTIC',
        details: { unknownTokens: unknown, allTokens: tokens },
      });
    }
  }

  return out;
};
