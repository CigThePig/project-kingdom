// Hand-card scan §9.8 — `expiresAfterTurns` should match the card's flavor.
// "Royal Pardon" expiring in 2 turns makes no sense; "Whispered Rumor"
// sitting in the hand for 24 turns is equally strange. This scan is a
// conservative heuristic: it only fires on out-of-band numbers or a small
// list of obvious durability/fleetingness keywords in the card title.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'hand.expiry-sanity';

const MIN_EXPIRY = 3;
const MAX_EXPIRY = 24;
const DURABLE_KEYWORDS = /pardon|chronicler|assize|treaty|decree|announcement|proclam|charter/i;
const DURABLE_MIN_EXPIRY = 8;
const FLEETING_KEYWORDS = /whisper|quick|snap|flash|rumour|rumor|glimpse/i;
const FLEETING_MAX_EXPIRY = 10;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    const expires = (card.metadata?.expiresAfterTurns as number | undefined) ?? null;
    if (expires == null) continue;
    const title = card.title ?? '';

    const reasons: string[] = [];
    if (expires < MIN_EXPIRY) {
      reasons.push(`expires in ${expires} turn(s) — below the ${MIN_EXPIRY}-turn floor`);
    }
    if (expires > MAX_EXPIRY) {
      reasons.push(`expires in ${expires} turn(s) — above the ${MAX_EXPIRY}-turn ceiling`);
    }
    if (DURABLE_KEYWORDS.test(title) && expires < DURABLE_MIN_EXPIRY) {
      reasons.push(
        `title reads durable ("${title}") but expires in ${expires} turn(s) (< ${DURABLE_MIN_EXPIRY})`,
      );
    }
    if (FLEETING_KEYWORDS.test(title) && expires > FLEETING_MAX_EXPIRY) {
      reasons.push(
        `title reads fleeting ("${title}") but expires in ${expires} turn(s) (> ${FLEETING_MAX_EXPIRY})`,
      );
    }
    if (reasons.length === 0) continue;

    out.push({
      severity: 'MINOR',
      family: 'hand',
      scanId: SCAN_ID,
      code: 'EXPIRY_FLAVOR_MISMATCH',
      cardId: card.id,
      choiceId: 'play',
      filePath: card.filePath,
      message: `${card.id}: ${reasons.join('; ')}.`,
      confidence: 'HEURISTIC',
      details: { expiresAfterTurns: expires, title, reasons },
    });
  }

  return out;
};
