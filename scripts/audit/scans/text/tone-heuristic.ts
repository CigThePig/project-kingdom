// Text scan §3 — tone heuristic. Crises should read urgent, petitions
// should read as a supplicant asking, decrees should read as a royal
// declaration. Mismatched tone is a MINOR finding — not a content bug but
// a family-placement smell.
//
// Lightweight by design: three family-keyword sets, count hits per set per
// body, and flag when the card's own family scored zero AND a different
// family scored ≥2. Catches gross miscategorization (a petition body on a
// crisis card) without trying to assess prose quality. §3 explicitly calls
// this out as "catches gross miscategorisation, not prose quality".

import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'text.tone-heuristic';

type ToneFamily = 'crisis' | 'petition' | 'decree';

const FAMILY_KEYWORDS: Record<ToneFamily, readonly RegExp[]> = {
  crisis: [
    /\burgent\b/i,
    /\bimmediate(ly)?\b/i,
    /\bcollapse\b/i,
    /\bspreading\b/i,
    /\bescalat/i,
    /\bbefore (the|it|a)\b/i,
    /\briot(s|ing|ers)?\b/i,
    /\bstorm(ed|ing)?\b/i,
    /\bpanic\b/i,
  ],
  petition: [
    /\bbeg(s|ged|ging)?\b/i,
    /\bbeseech(es|ing)?\b/i,
    /\bhumbly\b/i,
    /\bpetition(s|ed|ing)?\b/i,
    /\bwe (ask|beg|beseech|plead)\b/i,
    /\bpray (you|for|that)\b/i,
    /\bmercy\b/i,
    /\bsupplica(te|nt|tion)/i,
    /\baudience\b/i,
  ],
  decree: [
    /\bwe (hereby|decree|proclaim|order|command|will)\b/i,
    /\bour (will|command|crown|kingdom)\b/i,
    /\bhereby\b/i,
    /\bproclaim(s|ed|ing)?\b/i,
    /\bshall (be|not|now|henceforth)\b/i,
    /\blet it be\b/i,
    /\bby royal\b/i,
  ],
};

function countHits(body: string, patterns: readonly RegExp[]): number {
  let n = 0;
  for (const p of patterns) if (p.test(body)) n++;
  return n;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    const actualFamily = card.family as ToneFamily;
    if (!(actualFamily in FAMILY_KEYWORDS)) continue;
    const body = card.body ?? '';
    if (!body) continue;

    const hits: Record<ToneFamily, number> = {
      crisis: countHits(body, FAMILY_KEYWORDS.crisis),
      petition: countHits(body, FAMILY_KEYWORDS.petition),
      decree: countHits(body, FAMILY_KEYWORDS.decree),
    };

    if (hits[actualFamily] > 0) continue;

    let detectedFamily: ToneFamily | null = null;
    let detectedHits = 0;
    (Object.keys(hits) as ToneFamily[]).forEach((fam) => {
      if (fam === actualFamily) return;
      if (hits[fam] >= 2 && hits[fam] > detectedHits) {
        detectedFamily = fam;
        detectedHits = hits[fam];
      }
    });
    if (!detectedFamily) continue;

    out.push({
      severity: 'MINOR',
      family: card.family,
      scanId: SCAN_ID,
      code: 'TONE_FAMILY_MISMATCH',
      cardId: card.id,
      filePath: card.filePath,
      message: `${card.id}: body reads as ${detectedFamily} (${detectedHits} tone keywords) but is authored in the ${actualFamily} family. §3: tone must match family.`,
      confidence: 'HEURISTIC',
      details: {
        actualFamily,
        detectedFamily,
        hits,
      },
    });
  }

  return out;
};
