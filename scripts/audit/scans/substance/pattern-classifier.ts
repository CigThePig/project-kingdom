// Substance scan §1 — Pattern A/B/C classifier. Complements
// `single-choice-monthly` by classifying the single-choice cards that scan
// catches: a body that reads like an acknowledgement is a Pattern B candidate
// (earned reveal; should be re-classified as `notification`), while a body
// that does NOT read like an acknowledgement is a Pattern C in the wrong slot
// (a real monthly decision slot is being burned on flavor; relocate per
// CARD_AUDIT_RULES.md §10).
//
// Runs independently of the runtime-diff harness — reads body + choice count
// only. Families outside the monthly decision pipeline (assessment,
// negotiation, overture, hand, world) are skipped: their one-choice shape is
// an engine convention, not a decision slot.
//
// Codes:
//   PATTERN_C_IN_MONTHLY_SLOT   (MAJOR, DETERMINISTIC)
//   PATTERN_B_CANDIDATE_UNFLAGGED (POLISH, HEURISTIC)

import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'substance.pattern-classifier';

const MONTHLY_FAMILIES: ReadonlySet<Family> = new Set<Family>([
  'crisis',
  'petition',
  'notification',
  'unknown',
]);

/**
 * Fragments that, when they appear anywhere in a body, signal acknowledgement
 * framing rather than a real decision. Case-insensitive. These were chosen to
 * match the authoring pattern already in `src/data/text/expansion/followup-
 * text.ts` (every follow-up single-choice card uses one of these shapes).
 */
const ACKNOWLEDGEMENT_PHRASES: readonly string[] = [
  'acknowledge',
  'so be it',
  'so noted',
  'we have heard',
  'we hear',
  'let the record show',
  'the matter is noted',
  'the matter is closed',
  'the matter is settled',
  'understood',
  'as you say',
  'take note',
  'note the',
];

function looksLikeAcknowledgement(body: string): boolean {
  const lower = body.toLowerCase();
  return ACKNOWLEDGEMENT_PHRASES.some((p) => lower.includes(p));
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!MONTHLY_FAMILIES.has(card.family)) continue;
    if (card.choices.length !== 1) continue;
    const body = card.body ?? '';
    if (!body) continue;

    // A card already classified as `notification` is the correct answer for
    // Pattern B and is handled by the relocation pipeline, not this scan.
    const classification = (card.metadata as { classification?: string }).classification;
    if (classification === 'notification') continue;

    if (looksLikeAcknowledgement(body)) {
      out.push({
        severity: 'POLISH',
        family: card.family,
        scanId: SCAN_ID,
        code: 'PATTERN_B_CANDIDATE_UNFLAGGED',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: single-choice card reads as an acknowledgement — classify as \`notification\` so it routes out of the monthly decision slot (Pattern B candidate).`,
        confidence: 'HEURISTIC',
        details: { classification: classification ?? 'standard' },
      });
    } else {
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'PATTERN_C_IN_MONTHLY_SLOT',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: single-choice card is neither earned reveal (Pattern B) nor offers a real decision (Pattern A); it consumes a monthly slot for flavor (Pattern C). Relocate to seasonal dawn / end-of-season / world pulse per §10.`,
        confidence: 'DETERMINISTIC',
        details: { classification: classification ?? 'standard' },
      });
    }
  }

  return out;
};
